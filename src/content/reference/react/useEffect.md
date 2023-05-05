---
title: useEffect
---

<Intro>

`useEffect` é um hook para React que permite que você [sincronize um componente com um sistema externo.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Execute `useEffect` na raiz de seu componente para declarar um Effect:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `setup`: A função que contém a lógica do seu Effect. A sua função de setup pode também opcionalmente retornar uma função de *cleanup*. Quando seu componente for adicionado ao DOM pela primeira vez, o React irá executar sua função de setup. Após cada rerenderização com mudança nas dependências, o React irá primeiro executar a função de cleanup (se você a definiu) com os valores antigos, e então executar sua função de setup com os valores novos. Após seu componente ser removido do DOM, o React executará sua função de cleanup uma última vez.

* **opcional** `dependencies`: A lista de todos valores reativos referenciados dentro do código de `setup`. Valores reativos incluem props, state e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se seu linter estiver [configurado para React](/learn/editor-setup#linting), ele irá verificar que todos valores reativos estão corretamente especificados como dependência. A lista de dependências deve conter um número constante de itens e deve ser escrito inline como `[dep1, dep2, dep3]`. O React irá comparar cada dependência com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se você emitir este argumento, seu Effect irá ser reexecutado a cada rerenderização do componente. [Veja a diferença entre passar um array de dependências, um array vazio, e não passar dependências.](#examples-dependencies)

#### Retorno {/*returns*/}

`useEffect` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* `useEffect` é um Hook, então você só pode o chamar **na raiz de seu componente** ou em seus próprios Hooks. Você não pode o chamar dentro de loops ou condições. Se você precisar fazer isto, extraia um novo componente e mova o state para dentro dele.

* Se você **não está tentando sincronizar com algum sistema externo,** [você provavelmente não precisa de um Effect.](/learn/you-might-not-need-an-effect)

* Quando o Strict Mode estiver ativo, o React irá **executar um ciclo extra de setup+cleanup somente em modo de desenvolvimento** antes o primeiro setup real. Isto é um teste que garante que sua lógica de cleanup "espelha" sua lógica de setup e que ela pára ou desfaz qualquer coisa que o setup esteja fazendo. Se isto causar um problema, [implemente a função de cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se algumas de suas dependências forem objetos ou funções definidas dentro do componente, há um risco de que elas irão **fazer com que o Effect seja reexecutado com mais frequência do que o necessário.** Para consertar isto, remova [objetos](#removing-unnecessary-object-dependencies) e [funções](#removing-unnecessary-function-dependencies) desnecessários de suas dependências. Você também pode [extrair atualizações de state](#updating-state-based-on-previous-state-from-an-effect) e [lógica não-reativa](#reading-the-latest-props-and-state-from-an-effect) do seu Effect.

* Se seu Effect não foi causado por uma interação (como um clique), o React deixará o navegador **pintar a tela atualizada antes de executar seu Effect.** Caso seu Effect esteja fazendo algo visual (por exemplo, posicionando um tooltip) e o atraso for perceptível (causando, por exemplo, tremulações), substitua `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect) 

* Mesmo que seu Effect tenha sido causado por uma interação (como um clique), **o navegador pode repintar a tela antes de processar atualizações de state dentro de seu Effect.** Normalmente, é isto que você quer. No entanto, se você precisar impedir o navegador de repintar a tela, você precisará substituir `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Effects **executam somente no cliente.** Eles não são executados durante renderizações do lado do servidor.

---

## Uso {/*usage*/}

### Conectando a um sistema externo {/*connecting-to-an-external-system*/}

Alguns componentes precisam permanecer conectados à rede, APIs do navegador, ou bibliotecas de terceiros enquanto estão sendo exibidos na página. Estes sistemas não são controlados pelo React, então eles são chamados de *externos.*

Para [conectar seu componente a algum sistema externo,](/learn/synchronizing-with-effects) chame `useEffect` na raiz de seu componente:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

Você precisa passar dois argumentos ao `useEffect`:

1. Uma *função de setup* com <CodeStep step={1}>código de setup</CodeStep> que conecta a este sistema.
   - Ela deve retornar uma *função de cleanup* com <CodeStep step={2}>código de cleanup</CodeStep> que desconecta deste sistema.
2. Uma <CodeStep step={3}>lista de dependências</CodeStep> incluindo todos valores de seu componente utilizados dentro destas funções.

**O React executará suas funções de setup e cleanup quando necessário, o que pode ocorrer múltiplas vezes:**

1. Seu <CodeStep step={1}>código de setup</CodeStep> executa quando seu componente é adicionado à pagina *(mounts)*.
2. Após cada rerenderização do seu componente onde as <CodeStep step={3}>dependências</CodeStep> sofreram alterações:
   - Primeiro, seu <CodeStep step={2}>código de cleanup</CodeStep> executa com os props e state antigos.
   - Então, seu <CodeStep step={1}>código de setup</CodeStep> executa com os props e state novos.
3. Seu <CodeStep step={2}>código de cleanup</CodeStep> executa uma última vez depois que seu componente é removido da página *(unmounts).*

**Vamos ilustrar esta sequência para o exemplo acima.**  

Quando o componente `ChatRoom` acima é adicionado à página, ele irá conectar com a sala de chat utilizando os valores iniciais de `serverUrl` e `roomId`. Se `serverUrl` ou `roomId` mudarem como resultado de uma rerenderização (causada, por exemplo, pelo usuário selecionando outra sala de chat numa lista), seu Effect irá *desconectar da sala anterior e conectar à próxima.* Quando o compoente `ChatRoom` for removido da página, seu Effect irá desconectar uma última vez.

**No modo de desenvolvimento, para [ajudar você a encontrar erros,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) o React executa <CodeStep step={1}>setup</CodeStep> e <CodeStep step={2}>cleanup</CodeStep> uma vez a mais antes de <CodeStep step={1}>setup</CodeStep>.** Isto é um teste que verifica se a lógica do seu Effect está implementada corretamente. Caso isto cause problemas, alguma lógica está faltando na sua função de cleanup. A função de cleanup deveria parar e desfazer qualquer coisa que a função de setup estava fazendo. De maneira geral, o usuário não deveria poder diferenciar se o setup está sendo chamado uma só vez (como em produção) ou numa sequência *setup* → *cleanup* → *setup* (como em desenvolvimento). [Veja soluções comuns.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Tente [escrever cada Effect como um processo independente](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) e [pense em um ciclo de setup/cleanup por vez.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** O fato de seu componente estar montando, atualizando ou desmontando não deveria importar. Quando sua lógica de cleanup "espelha" corretamente sua lógica de setup, seu Effect é resiliente o suficiente para rodar setup e cleanup o quanto for preciso.

<Note>

Um Effect permite que você [mantenha seu componente sincronizado](/learn/synchronizing-with-effects) com algum sistema externo (como um serviço de chat). Neste contexto, *sistema externo* significa qualquer trecho de código que não é controlado pelo React, como por exemplo:

* Um timer gerenciado usando <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/pt-BR/docs/Web/API/setInterval)</CodeStep> e <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Uma assinatura a eventos utilizando <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener)</CodeStep> e <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Uma biblioteca de animações utilizando uma API como <CodeStep step={1}>`animation.start()`</CodeStep> e <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Se você não estiver conectando a um sistema externo, [você provavelmente não precisa de um Effect.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Exemplos de conexão a um sistema externo" titleId="examples-connecting">

#### Conectando a um servidor de chat {/*connecting-to-a-chat-server*/}

Neste exemplo, o componente `ChatRoom` utiliza um Effect para permanecer conectado a um sistema externo definido em `chat.js`. Pressione "Abrir chat" para fazer com que o componente `ChatRoom` apareça. Este sandbox está executando em modo de desenvolvimento, portanto há um ciclo extra que conecta e desconecta, conforme [explicado aqui.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Experimente alterar `roomId` e `serverUrl` utilizando a lista de opções e o campo de texto, e perceba como o Effect reconecta ao chat. Pressione "Fechar chat" para ver o Effect disconectar uma última vez.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Acompanhando um evento global do navegador {/*listening-to-a-global-browser-event*/}

Neste exemplo, o sistema externo é o DOM do navegador em si. Normalmente, você especificaria event listeners com JSX, mas você não pode acompanhar o objeto global [`window`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window) deste modo. Um Effect permite que você conecte ao objeto `window` e monitore seus eventos. Increver-se ao evento `pointermove` permite que você localize a posição do cursor (ou dedo) e atualize a posição do ponto vermelho.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Acionando uma animação {/*triggering-an-animation*/}

Neste exemplo, o sistema externo é a biblioteca de animação em `animation.js`. Ela provê uma classe JavaScript chamada `FadeInAnimation` que aceita um nó do DOM como argumento e expõe os métodos `start()` e `stop()` para controlar a animação. Este componente [utiliza um ref](/learn/manipulating-the-dom-with-refs) para acessar o nó do DOM subjacente. O Effect lê o nó do DOM a partir do ref e automaticamente inicia a animação para aquele nó quando o componente aparece.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Bem-vindo
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remover' : 'Exibir'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Pular imediatamente ao fim
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Iniciar animação
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Teremos mais quadros para pintar
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Controlando uma caixa de diálogo {/*controlling-a-modal-dialog*/}

Neste exemplo, o sistema externo é o DOM do navegador. O componente `ModalDialog` renderiza um elemento [`<dialog>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/dialog). Ele utiliza um Effect para sincronizar a prop `isOpen` com as chamadas de método [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) e [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Abrir caixa de diálogo
      </button>
      <ModalDialog isOpen={show}>
        Olá!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Fechar</button>
      </ModalDialog>
    </>
  );
}
```

```js ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Monitorando visibilidade de elementos {/*tracking-element-visibility*/}

Neste exemplo, o sistema externo é novamente o DOM do navegador. O componente `App` exibe uma lista longa, o componente `Box`, e então outra lista longa. Role a lista pra baixo. Perceba que quando o componente `Box` aparece na viewport, a cor de fundo muda para preto. Para implementar isto, o componente `Box` usa um Effect para gerenciar um [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Esta API do navegador lhe notifica quando o elemento DOM está visível na viewport.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (continue rolando)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Encapsulando Effects em Hooks customizados {/*wrapping-effects-in-custom-hooks*/}

Effects são uma ["válvula de escape":](/learn/escape-hatches) você as usa quando precisa "sair do React" e quando nao há uma solução integrada melhor para seu caso de uso. Se você perceber que tem precisado escrever muitos Effects, isso é geralmente um sinal que você precisa extrair alguns [Hooks customizados](/learn/reusing-logic-with-custom-hooks) para comportamentos comuns que seus componentes dependem.

Por exemplo, este Hook customizado `useChatRoom` "esconde" a lógica do seu Effect atrás de uma API mais declarativa:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Então você pode utilizá-lo em qualquer componente deste modo:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Existem também muitos Hooks customizados excelentes para qualquer propósito disponíveis no ecossistema do React.

[Aprenda mais sobre encapsular Effects em Hooks customizados.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Exemplos de encapsulamento de Effects em Hooks customizados" titleId="examples-custom-hooks">

#### Hook customizado `useChatRoom` {/*custom-usechatroom-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting), com a lógica extraída para um Hook customizado.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Hook customizado `useWindowListener` {/*custom-usewindowlistener-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting), com a lógica extraída para um Hook customizado.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Hook customizado `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting), com a lógica extraída para um Hook customizado.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (continue rolando)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Controlando um widget não React {/*controlling-a-non-react-widget*/}

Algumas vezes, você precisa manter um sistema externo sincronizado com alguma prop ou state do seu componente.

Por exemplo, se você possui um widget de mapa ou um componente de reprodução de vídeo não escritos em React, você pode utilizar um Effect para executar métodos nele, fazendo com que seu estado corresponda ao estado atual do seu componente React. Este Effect cria uma instância de uma classe `MapWidget` definida em `map-widget.js`. Quando você altera a prop `zoomLevel` do componente `Map`, o Effect chama o método `setZoom()` da instância da classe para manter o valor sincronizado:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Nível de zoom: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Neste exemplo, uma função de cleanup não é necessária, porque a classe `MapWidget` controla somente o nó DOM que foi passado para ela. Após a remoção do componente React `Map`, tanto o nó DOM quanto a instância da classe `MapWidget` serão automaticamente coletados pela engine JavaScript do navegador.

---

### Buscando dados com Effects {/*fetching-data-with-effects*/}

Você pode usar um Effect para buscar dados para seu componente. Note que [se você usa um framework,](/learn/start-a-new-react-project#production-grade-react-frameworks) utilizar o mecanismo de busca de dados do seu framework será muito mais eficiente do que escrever Effects manualmente.

Se você quiser buscar dados com um Effect manualmente, precisará de um código parecido com este:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Perceba a variável `ignore`, que é inicializada como `false` e então atualizada para `true` durante o cleanup. Isso garante que [seu código não sofra com "race conditions":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) respostas da rede podem chegar numa ordem diferente da que você as enviou.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Carregando...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Esta é a página de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>


Você também pode reescrever utilizando a sintaxe [`async` / `await`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function), mas ainda precisará definir a função de cleanup:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Carregando...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Esta é a página de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>

Implementar busca de dados diretamente com Effects se torna repetitivo e dificulta a posterior adição de otimizações como caching e renderização do lado do servidor. [É mais fácil utilizar um Hook customizado -- ou por você ou mantido pela comunidade.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Quais as melhores alternativas à busca de dados em Effects? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Escrever chamadas `fetch` dentro de Effects é um [jeito pupular de buscar dados](https://www.robinwieruch.de/react-hooks-fetch-data/), especialmente em aplicações totalmente client-side. Esta é, entretanto, uma abordagem muito manual e possui desvantagens significativas:

- **Effects não executam no servidor.** Isto significa que o HTML inicial renderizado pelo servidor irá conter somente o estado de "carregando", sem os dados. O computador do cliente terá que fazer o download de todo o JavaScript e renderizar sua aplicação para somente então descobrir que precisará buscar mais dados. Isto não é muito eficiente.
- **Buscar dados diretamente dentro de Effects facilita a criação de "network waterfalls".** Você renderiza o componente pai, ele busca alguns dados, renderiza os componentes filho, e então eles começam a buscar seus próprios dados. Se a rede não for muito rápida, isto é significativamente mais devagar do que buscar todos os dados em paralelo.
- **Buscar dados diretamente dentro de Effects normalmente significa que você não pré-carrega nem armazena dados em cache.** Por exemplo, se o componente desmontar e então montar de novo, ele teria que buscar os dados novamente.
- **Não é muito ergonômico.** Existe muito código de boilerplate envolvido quando escrevemos chamadas `fetch` evitando problemas como [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Esta lista de desvantagens não é específica ao React. Ela se aplica à busca de dados ao montar componentes em qualquer biblioteca. Assim como roteamento, busca de dados não é um problema trivial de resolver, portanto recomendamos as seguintes abordagens:

- **Se você usa um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), utilize os mecanismos de busca de dados integrados a ele.** Frameworks React modernos já possuem mecanismos para busca de dados que são eficientes e não sofrem com as desvantagens mencionadas anteriormente.
- **Caso contrário, considere utilizar ou construir um sistema de cache de dados no lado do cliente.** Soluções populares de código aberto incluem [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/) e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Você pode construir sua própria solução também, neste caso você utilizaria Effects por debaixo dos panos, mas também adicionaria lógicas para deduplicar chamadas, realizar cache das respostas e evitar network waterfalls (pré-carregando dados ou elevando requisitos de dados para as rotas).

Você pode continuar buscando dados diretamente em Effects se nenhuma destas abordagens lhe servir.

</DeepDive>

---

### Especificando dependências reativas {/*specifying-reactive-dependencies*/}

**Note que você não pode "escolher" as dependências do seu Effect.** Cada <CodeStep step={2}>valor reativo</CodeStep> usado pelo código de seu Effect deve ser declarado como uma dependência. A lista de dependências do seu Effect é determinada pelo código ao seu redor:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Este é um valor reativo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Este é outro valor reativo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Effect lê tais valores reativos
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Portanto você deve especificá-los como dependências de seu Effect
  // ...
}
```

Se `serverUrl` ou `roomId` forem alterados, seu Effect irá reconectar ao chat utilizando os novos valores.

**[Valores reativos](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) incluem props e todas as variáveis e funções declaradas diretamente dentro de seu componente.** Dado que `roomId` e `serverUrl` são valores reativos, você não os pode remover das dependências. Se você tentar omiti-los e [seu linter estiver corretamente configurado para React,](/learn/editor-setup#linting) o linter irá marcar isto como um erro que precisa ser corrigido:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**Para remover uma dependência, você precisa ["provar" ao linter que ela *não precisa* ser uma dependência.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Por exemplo, você pode mover `serverUrl` para fora de seu componente para provar que o valor não é reativo e não irá ser alterado em rerenderizações:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Não mais um valor reativo

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas dependências declaradas
  // ...
}
```

Agora que `serverUrl` não é mais um valor reativo (e não pode ser alterado em uma rerenderização), ele não precisa mais ser uma dependência. **Se o código do seu Effect não utilizar nenhum valor reativo, a lista de dependências deveria ser vazia (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Não mais um valor reativo
const roomId = 'music'; // Não mais um valor reativo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas dependências declaradas
  // ...
}
```

[Um Effect com dependências vazias](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) não é reexecutado mesmo quando as props ou state de qualquer de seus componentes for atualizado.

<Pitfall>

Se você tiver um codebase existente, você pode ter alguns Effects que suprimem o linter deste modo:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter deste modo:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando as dependências não correspondem ao código, existe um alto risco de introduzir erros.** Ao suprimir o linter, você "mente" ao React sobre os valores nos quais o seu Effect depende. [Ao invés disto, prove que eles são desnecessários.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Exemplos de passagem de valores reativos" titleId="examples-dependencies">

#### Passando uma lista de dependências {/*passing-a-dependency-array*/}

Se você especificar as dependências, seu Effect executa **após a renderização inicial _e_ depois que rerenderizar com dependências atualizadas.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Executa novamente caso a ou b sejam alterados
```

No exemplo abaixo, `serverUrl` e `roomId` são [valores reativos,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) então eles devem ambos serem especificados como dependências. Como resultado, selecionar um canal diferente na lista ou editar a URL do servidor causará uma reconexão no chat. No entanto, como `message` não é utilizado no Effect (e então não é uma dependência), editar a mensagem não causará reconexão.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
      <label>
        Sua mensagem:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Fechar chat' : 'Abrir chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Passando uma lista de dependências vazia {/*passing-an-empty-dependency-array*/}

Se seu Effect realmente não utilizar nenhum valor reativo, ele irá executar somente **após a renderização inicial.**

```js {3}
useEffect(() => {
  // ...
}, []); // Não executa novamente (exceto por uma vez em desenvolvimento)
```

**Mesmo com dependências vazias, as funções de setup e cleanup irão [executar uma vez a mais em desenvolvimento](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) para ajudá-lo a encontrar erros.**

Neste exemplo, tanto `serverUrl` quanto `roomId` estão hardcoded. Já que eles são declarados fora do componente, eles não são valores reativos, e portanto não são dependências. A lista de dependências está vazia, então o Effect não é reexecutado em rerenderizações.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'música';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Bem-vindo à sala {roomId}!</h1>
      <label>
        Sua mensagem:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Não passando nenhuma lista de dependências {/*passing-no-dependency-array-at-all*/}

Se você não passar nenhuma lista de dependências, seu Effect executa **após toda renderização (e rerenderização)** do seu componente.

```js {3}
useEffect(() => {
  // ...
}); // É sempre executado novamente
```

Neste exemplo, o Effect é reexecutado quando você altera `serverUrl` e `roomId`, o que é razoável. No entento, ele *também* é reexecutado quando `message` é alterado, o que provavelmente é indesejado. É por isso que normalmente você especificará a lista de dependências.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

  return (
    <>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
      <label>
        Sua mensagem:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Fechar chat' : 'Abrir chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Atualizando state baseado em valores anteriores num Effect {/*updating-state-based-on-previous-state-from-an-effect*/}

Quando você precisar atualizar o state baseado em um valor anterior do state dentro de um Effect, você pode ter o seguinte problema:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Você quer incrementar o contador a cada segundo...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... mas especificar `count` como uma dependência sempre reseta o intervalo.
  // ...
}
```

Dado que `count` é um valor reativo, ele deve ser especificado na lista de dependências. No entanto, isto faz com que o Effect rode as funções de cleanup e setup novamente a cada vez que `count` muda. Isto não é ideal.

Para arrumar isto, [passe o state updater `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) a `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Passe um state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Agora count não é uma dependência

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


Agora que você está passando `c => c + 1` ao invés de `count + 1`, [seu Effect não precisa mais depender de `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Como resultado desta correção, o intervalo não precisará mais ser limpo e setado toda vez que `count` atualizar.

---


### Removendo objetos desnecessários das dependências {/*removing-unnecessary-object-dependencies*/}

Se seu Effect depende de um objeto ou uma função criada durante a renderização, ele pode executar com muita frequência. Por exemplo, este Effect reconecta após cada renderização, pois o objeto `options` é [diferente para cada renderização:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Este objeto é recriado a cada rerenderização
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // E usado dentro do Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 Como resultado, estas dependências são sempre diferentes numa rerenderização
  // ...
```

Evite utilizar objetos criados durante a renderização como dependência. Ao invés disto, crie estes objetos dentro do Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Bem-vindo à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Agora que você criou o objeto `options` dentro do Effect, o Effect em si depende somente da string `roomId`.

Com esta correção, escrever no campo de texto não causa reconexão ao chat. Diferentemente de um objeto que é recriado, uma string como `roomId` não é modificada a não ser que você altere seu valor. [Leia mais sobre remoção de dependências.](/learn/removing-effect-dependencies)

---

### Removendo funções desnecessárias das dependências {/*removing-unnecessary-function-dependencies*/}

Se seu effect depende de um objeto ou de uma função criados durante a renderização, ele pode executar com muita frequência. Por exemplo, este Effect reconecta após cada renderização, pois a função `createOptions` é [diferente para cada renderização:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Esta função é recriada a cada rerenderização
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // E usada dentro do Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 Como resultado, estas dependências são sempre diferentes numa rerenderização
  // ...
```

Recriar uma função a cada rerenderização em si não é um problema. Você não precisa otimizar isto. No entanto, se você a utiliza como uma dependência de seu Effect, isto irá fazer com que seu Effect seja reexecutado a cada rerenderização.

Evite utilizar funções criadas durante a renderização como dependência. Ao invés disto, as declare dentro do Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Bem-vindo à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando-se ao canal "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado do canal "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Agora que você definiu a função `createOptions` dentro do Effect, o Effect em si depende somente da string `roomId`. Com esta correção, escrever no campo de texto não causa reconexão ao chat. Diferentemente de uma função que é recriada, uma string como `roomId` não é modificada a não ser que você altere seu valor. [Leia mais sobre remoção de dependências.](/learn/removing-effect-dependencies)

---

### Lendo valores atualizados de props e state a partir de um Effect {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** numa versão estável do React.

</Wip>

Por padrão, quando você lê um valor reativo de dentro de um Effect, você precisa adicioná-lo como uma dependência. Isto garante que seu Effect "reage" a cada mudança deste valor. Para a maioria das dependências, este é o comportamento que você quer.

**No entanto, algumas vezes você irá querer ler o *último* valor de props e state dentro de um Effect, sem "reagir" a ele.** Por exemplo, imagine que você quer logar o número de itens no carrinho de compras a cada visita à página:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Todas dependências declaradas
  // ...
}
```

**E se você quiser logar uma visita a uma página nova a cada mudança em `url`, mas *não* se somente `shoppingCart` for atualizado?** Você não pode excluir `shoppingCart` das dependências sem quebrar as [regras de reatividade.](#specifying-reactive-dependencies) No entanto, você pode expressar que você *não quer* que uma parte do código "reaja" a mudanças, mesmo que seja chamado de dentro de um Effect. [Declare um *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) com o Hook [`useEffectEvent`](/reference/react/experimental_useEffectEvent), e move o código lendo `shoppingCart` para dentro dele:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Todas dependências declaradas
  // ...
}
```

**Effect Events não são reativos e devem sempre ser omitidos das dependências de seu Effect.** É isto que permite que você coloque código não-reativo (onde você pode ler o último valor de props e state) dentro deles. Ao ler `shoppingCart` dentro de `onVisit`, você garante que `shoppingCart` não reexecutará seu Effect.

[Leia mais sobre como Effect Events permitem que você separe código reativo de não-reativo.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Exibindo conteúdos diferentes no servidor e no cliente {/*displaying-different-content-on-the-server-and-the-client*/}

Se sua aplicação usa renderização do lado do servidor (tanto [diretamente](/reference/react-dom/server) quanto via um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), seu componente irá renderizar em dois ambientes diferentes. No servidor, ela irá renderizar para produzir o HTML inicial. No cliente, o React irá executar o código de renderização novamente para poder anexar seus event handlers àquele HTML. É por isto que, para que o [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) funcione, o resultado de sua renderização inicial precisa ser idêntico entre servidor e cliente.

Em raros casos, você pode precisar exibir conteúdo diferente no lado do cliente. Por exemplo, se sua aplicação lê algum dado de [`localStorage`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage), não é possível fazer isto do lado do servidor. Eis um modo de implementar isto:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... retorne JSX somente para cliente...
  }  else {
    // ... retorne o JSX inicial...
  }
}
```

Enquanto a aplicação está carregando, o usuário irá ver a saída inicial da renderização. Então, após o carregamento e execução do hydration, seu Effect irá executar e definir `didMount` como `true`, causando uma rerenderização. Isto irá alternar para a renderização do lado do cliente. Effects não são executados no servidor, e é por isso que `didMount` era `false` durante a renderização inicial do lado do servidor.

Use este modelo com moderação. Lembre-se de que usuários com conexões lentas irão ver o conteúdo inicial por um bom tempo -- potencialmente vários segundos -- portanto você não vai querer que seu componente altere sua aparência de forma tão drástica. Em vários casos, você pode evitar esta solução utilizando CSS para exibir condicionalmente elementos distintos.

---

## Solução de problemas {/*troubleshooting*/}

### Meu Effect roda duas vezes quando o componente monta {/*my-effect-runs-twice-when-the-component-mounts*/}

Quando o Strict Mode está ativado, em desenvolvimento, o React roda as funções de setup e cleanup uma vez a mais antes da execução verdadeira do setup.

Este é um teste que verifica se a lógica do seu Effect está implementada corretamente. Se isto causar problemas, alguma lógica está faltando na sua função de cleanup. A função de cleanup deveria parar e desfazer qualquer coisa que a função de setup estava fazendo. De maneira geral, o usuário não deveria poder diferenciar se o setup está sendo chamado uma só vez (como em produção) ou numa sequência *setup* → *cleanup* → *setup* (como em desenvolvimento).

Leia mais sobre [como isto ajuda a encontrar erros](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) e [como corrigir sua lógica.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Meu Effect executa após cada rerenderização {/*my-effect-runs-after-every-re-render*/}

Primeiro, verifique se você não esqueceu de especificar a lista de dependências:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Sem lista de dependência: reexecuta após cada renderização!
```

Se você especificou a lista de dependências mas seu Effect ainda reexecuta em loop, é porque uma de suas dependências é diferente em cada rerenderização.

Você pode depurar este problema manualmente logando suas dependências no console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Você pode então clicar com o botão direito do mouse nas listas de diferentes rerenderizações e selecionar "Store as a global variable" para ambos. Assumindo que o primeiro foi salvo como `temp1` e o segundo como `temp2`, você pode utilizar o console do navegador para verificar se cada dependência em ambas as listas é a mesma:

```js
Object.is(temp1[0], temp2[0]); // A primeira dependência é a mesma em ambas as listas?
Object.is(temp1[1], temp2[1]); // A segunda dependência é a mesma em ambas as listas?
Object.is(temp1[2], temp2[2]); // ... e por aí vai, para cada dependência ...
```

Quando você encontrar a dependência que difere em rerenderizações, você geralmente pode consertar isto de um destes modos:

- [Atualizando state baseado em valores anteriores num Effect](#updating-state-based-on-previous-state-from-an-effect)
- [Removendo objetos desnecessários das dependências](#removing-unnecessary-object-dependencies)
- [Removendo funções desnecessárias das dependências](#removing-unnecessary-function-dependencies)
- [Lendo valores atualizados de props e state a partir de um Effect](#reading-the-latest-props-and-state-from-an-effect)

Em última instância (se nenhum destes métodos ajudar), encapsule sua criação com [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) ou [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (para funções).

---

### Meu Effect executa em ciclo infinito {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Se seu Effect executa em um ciclo infinito, estas duas coisas devem estar acontecendo:

- Seu Effect está atualizando algum state.
- Este state causa um rerender, fazendo com que as dependências do Effect mudem.

Antes de começar a arrumar este problema, pergunte a si mesmo se este Effect está se conectando a um sistema externo (como o DOM, a rede, um widget de terceiros, etc.). Por que seu Effect precisa alterar o state? Ele se sincroniza com este sistema externo? Ou você está tentando gerenciar o fluxo de dados da sua aplicação com ele?

Se não há sistema externo, considere se [a remoção completa do Effect](/learn/you-might-not-need-an-effect) simplificaria sua lógica.

Se você está genuinamente sincronizando com algum sistema externo, pense sobre a razão e sobre quais condições seu Effect deveria atualizar o state. Algo que afeta a saída visual do seu componente foi alterado? Se você precisa manter controle sobre algum dado que não é utilizado para renderização, um [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (que não causa rerenderizações) pode ser apropriado. Verifique que seu Effect não atualiza o state (e causa rerenderização) mais que o necessário.

Finalmente, se seu Effect está atualizando o state no momento certo, mas ainda há um ciclo, é porque a atualização deste state faz com que as dependências de outro Effect sejam atualizadas.

---

### Minha lógica de cleanup é executada mesmo que meu componente não tenha desmontado {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

A função de cleanup é executada não somente durante a desmontagem, mas antes de cada rerenderização com dependências atualizadas. Adicionalmente, em desenvolvimento, o React [executa um ciclo extra de setup+cleanup imediatamente após a montagem do componente.](#my-effect-runs-twice-when-the-component-mounts)

Se você possui código de cleanup sem um código de setup correspondente, isto é geralmente um mau sinal:

```js {2-5}
useEffect(() => {
  // 🔴 Evite: lógica de cleanup sem lógica de setup correspondente
  return () => {
    doSomething();
  };
}, []);
```

Sua lógica de cleanup deveria ser "simétrica" à lógica de setup, e deveria parar ou desfazer qualquer coisa que o setup tenha feito:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Aprenda como o ciclo de vida de Effect é diferente do ciclo de vida do componente.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Meu Effect faz algo visual, e vejo tremulações antes de sua execução {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

* Se seu Effect não foi causado por uma interação (como um clique), o React deixará o navegador **pintar a tela atualizada antes de executar seu Effect.** Caso seu Effect esteja fazendo algo visual (por exemplo, posicionando um tooltip) e o atraso for perceptível (causando, por exemplo, tremulações), substitua `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect) 

* Mesmo que seu Effect tenha sido causado por uma interação (como um clique), **o navegador pode repintar a tela antes de processar atualizações de state dentro de seu Effect.** Normalmente, é isto que você quer. No entanto, se você precisar impedir o navegador de repintar a tela, você precisará substituir `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect)

Se seu Effect precisar impedir o navegador de [pintar a tela,](/learn/render-and-commit#epilogue-browser-paint) substitua `useEffect` por [`useLayoutEffect`](/reference/react/useLayoutEffect). Perceba que **isto não deveria ser necessário para a grande maioria dos Effects.** Você só precisará disto se for crucial executar seu Effect antes que o navegador pinte a tela: por exemplo, para medir a posição de um tooltip antes que o usuário o veja.
