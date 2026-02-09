---
title: useEffect
---

<Intro>

`useEffect` é um Hook do React que permite [sincronizar um componente com um sistema externo.](/learn/synchronizing-with-effects)

```js
useEffect(configurar, dependências?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useEffect(configurar, dependências?)` {/*useeffect*/}

Chame `useEffect` no nível superior do seu componente para declarar um Efeito:

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
  }, [serverUrl, roomId]);
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

<<<<<<< HEAD
* `configurar`: A função com a lógica do seu Efeito. Sua função de configuração também pode opcionalmente retornar uma função de *limpeza*. Quando seu componente é adicionado ao DOM, o React executará sua função de configuração. Após cada re-renderização com dependências alteradas, o React primeiro executará a função de limpeza (se você a forneceu) com os valores antigos e, em seguida, executará sua função de configuração com os novos valores. Após seu componente ser removido do DOM, o React executará sua função de limpeza.
 
* **opcional** `dependências`: A lista de todos os valores reativos referenciados dentro do código da `configurar`. Valores reativos incluem props, estado, e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se seu linter estiver [configurado para React](/learn/editor-setup#linting), ele verificará se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita em linha como `[dep1, dep2, dep3]`. O React comparará cada dependência com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se você omitir este argumento, seu Efeito será executado novamente após cada re-renderização do componente. [Veja a diferença entre passar um array de dependências, um array vazio, e nenhuma dependência.](#examples-dependencies)
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your [component commits](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React will run your setup function. After every commit with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every commit of the component. [See the difference between passing an array of dependencies, an empty array, and no dependencies at all.](#examples-dependencies)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

#### Retorna {/*returns*/}

`useEffect` retorna `undefined`.

#### ressalvas {/*caveats*/}

* `useEffect` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou de seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se você precisar disso, extraia um novo componente e mova o estado para ele.

* Se você **não está tentando sincronizar com algum sistema externo**, [provavelmente você não precisa de um Efeito.](/learn/you-might-not-need-an-effect)

* Quando o Modo Estrito está ativado, o React **executará um ciclo extra de configuração+limpeza apenas para desenvolvimento** antes da primeira configuração real. Este é um teste de estresse que garante que a lógica de limpeza "reflete" a lógica de configuração e que ela para ou reverte o que a configuração está fazendo. Se isso causar um problema, [implemente a função de limpeza.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se algumas das suas dependências forem objetos ou funções definidas dentro do componente, há o risco de que elas **façam o Efeito ser executado novamente mais frequentemente do que o necessário.** Para corrigir isso, remova as dependências [de objeto](#removing-unnecessary-object-dependencies) e [de função](#removing-unnecessary-function-dependencies) desnecessárias. Você também pode [extrair atualizações de estado](#updating-state-based-on-previous-state-from-an-effect) e [lógica não reativa](#reading-the-latest-props-and-state-from-an-effect) para fora de seu Efeito.

* Se seu Efeito não foi causado por uma interação (como um clique), o React geralmente permitirá que o navegador **pinte a tela atualizada primeiro antes de executar seu Efeito.** Se seu Efeito estiver fazendo algo visual (por exemplo, posicionando uma dica), e o atraso for perceptível (por exemplo, ele pisca), substitua `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Se seu Efeito foi causado por uma interação (como um clique), **o React pode executar seu Efeito antes que o navegador pinte a tela atualizada**. Isso garante que o resultado do Efeito possa ser observado pelo sistema de eventos. Normalmente, isso funciona como esperado. No entanto, se você precisar adiar o trabalho até depois da pintura, como um `alert()`, você pode usar `setTimeout`. Veja [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) para mais informações.

* Mesmo que seu Efeito tenha sido causado por uma interação (como um clique), **o React pode permitir que o navegador repinte a tela antes de processar as atualizações de estado dentro do seu Efeito.** Normalmente, isso funciona como esperado. No entanto, se você precisar bloquear o navegador de repintar a tela, você precisa substituir `useEffect` por [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Efeitos **somente são executados no cliente.** Eles não são executados durante a renderização do servidor.

---

## Uso {/*usage*/}

### Conectando-se a um sistema externo {/*connecting-to-an-external-system*/}

Alguns componentes precisam permanecer conectados à rede, a alguma API do navegador ou a uma biblioteca de terceiros, enquanto são exibidos na página. Esses sistemas não são controlados pelo React, então são chamados de *externos.*

Para [conectar seu componente a algum sistema externo,](/learn/synchronizing-with-effects) chame `useEffect` no nível superior do seu componente:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
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
  }, [serverUrl, roomId]);
  // ...
}
```

Você precisa passar dois argumentos para `useEffect`:

1. Uma *função de configuração* com <CodeStep step={1}>código de configuração</CodeStep> que conecta a esse sistema.
   - Deve retornar uma *função de limpeza* com <CodeStep step={2}>código de limpeza</CodeStep> que desconecta desse sistema.
2. Uma <CodeStep step={3}>lista de dependências</CodeStep> incluindo cada valor do seu componente usado dentro dessas funções.

**O React chama suas funções de configuração e limpeza sempre que é necessário, o que pode acontecer várias vezes:**

<<<<<<< HEAD
1. Seu <CodeStep step={1}>código de configuração</CodeStep> é executado quando seu componente é adicionado à página *(montado)*.
2. Após cada re-renderização do seu componente onde as <CodeStep step={3}>dependências</CodeStep> mudaram:
   - Primeiro, seu <CodeStep step={2}>código de limpeza</CodeStep> roda com os antigos props e estado.
   - Então, seu <CodeStep step={1}>código de configuração</CodeStep> roda com os novos props e estado.
3. Seu <CodeStep step={2}>código de limpeza</CodeStep> é executado mais uma vez após seu componente ser removido da página *(desmontado).*
=======
1. Your <CodeStep step={1}>setup code</CodeStep> runs when your component is added to the page *(mounts)*.
2. After every commit of your component where the <CodeStep step={3}>dependencies</CodeStep> have changed:
   - First, your <CodeStep step={2}>cleanup code</CodeStep> runs with the old props and state.
   - Then, your <CodeStep step={1}>setup code</CodeStep> runs with the new props and state.
3. Your <CodeStep step={2}>cleanup code</CodeStep> runs one final time after your component is removed from the page *(unmounts).*
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**Vamos ilustrar essa sequência pelo exemplo acima.**  

<<<<<<< HEAD
Quando o componente `ChatRoom` acima é adicionado à página, ele se conectará à sala de chat com o `serverUrl` e `roomId` iniciais. Se `serverUrl` ou `roomId` mudarem como resultado de uma re-renderização (por exemplo, se o usuário escolher uma sala de chat diferente em um dropdown), seu Efeito irá *desconectar da sala anterior e conectar à próxima.* Quando o componente `ChatRoom` for removido da página, seu Efeito irá se desconectar mais uma vez.
=======
When the `ChatRoom` component above gets added to the page, it will connect to the chat room with the initial `serverUrl` and `roomId`. If either `serverUrl` or `roomId` change as a result of a commit (say, if the user picks a different chat room in a dropdown), your Effect will *disconnect from the previous room, and connect to the next one.* When the `ChatRoom` component is removed from the page, your Effect will disconnect one last time.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**Para [ajudar você a encontrar bugs,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) durante o desenvolvimento, o React executa <CodeStep step={1}>configuração</CodeStep> e <CodeStep step={2}>limpeza</CodeStep> uma vez extra antes da <CodeStep step={1}>configuração</CodeStep>.** Este é um teste de estresse que verifica se a lógica do seu Efeito está implementada corretamente. Se isso causar problemas visíveis, sua função de limpeza pode estar faltando alguma lógica. A função de limpeza deve parar ou reverter o que a função de configuração estava fazendo. A regra prática é que o usuário não deve ser capaz de distinguir entre a configuração sendo chamada uma vez (como na produção) e uma sequência de *configuração* → *limpeza* → *configuração* (como no desenvolvimento). [Veja soluções comuns.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Tente [escrever cada Efeito como um processo independente](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) e [pense em um único ciclo de configuração/limpeza de cada vez.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Não deve importar se seu componente está montando, atualizando ou desmontando. Quando sua lógica de limpeza reflete corretamente a lógica de configuração, seu Efeito é resiliente a executar configuração e limpeza tantas vezes quanto necessário.

<Note>

Um Efeito permite que você [mantenha seu componente sincronizado](/learn/synchronizing-with-effects) com algum sistema externo (como um serviço de chat). Aqui, *sistema externo* significa qualquer parte do código que não é controlada pelo React, como:

* Um temporizador gerenciado com <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> e <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Uma assinatura de evento usando <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> e <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Uma biblioteca de animação de terceiros com uma API como <CodeStep step={1}>`animation.start()`</CodeStep> e <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Se você não está se conectando a nenhum sistema externo, [provavelmente você não precisa de um Efeito.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Exemplos de conexão a um sistema externo" titleId="examples-connecting">

#### Conectando a um servidor de chat {/*connecting-to-a-chat-server*/}

Neste exemplo, o componente `ChatRoom` usa um Efeito para permanecer conectado a um sistema externo definido em `chat.js`. Pressione "Abrir chat" para fazer o componente `ChatRoom` aparecer. Este sandbox é executado em modo de desenvolvimento, então há um ciclo extra de conectar e desconectar, como [explicado aqui.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Tente mudar o `roomId` e o `serverUrl` usando o dropdown e a entrada, e veja como o Efeito reconecta ao chat. Pressione "Fechar chat" para ver o Efeito se desconectar uma última vez.

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
        URL do Servidor:{' '}
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
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
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

#### Ouvindo um evento global do navegador {/*listening-to-a-global-browser-event*/}

Neste exemplo, o sistema externo é o próprio DOM do navegador. Normalmente, você especificaria ouvintes de eventos com JSX, mas você não pode ouvir o objeto global [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) dessa maneira. Um Efeito permite que você se conecte ao objeto `window` e ouça seus eventos. Ouvindo o evento `pointermove` permite que você rastreie a posição do cursor (ou dedo) e atualize o ponto vermelho para se mover com ele.

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

#### Iniciando uma animação {/*triggering-an-animation*/}

Neste exemplo, o sistema externo é a biblioteca de animação em `animation.js`. Ela fornece uma classe JavaScript chamada `FadeInAnimation` que recebe um nó do DOM como argumento e expõe os métodos `start()` e `stop()` para controlar a animação. Este componente [usa um ref](/learn/manipulating-the-dom-with-refs) para acessar o nó DOM subjacente. O Efeito lê o nó DOM do ref e automaticamente inicia a animação para esse nó quando o componente aparece.

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
        {show ? 'Remover' : 'Mostrar'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Pular para o final imediatamente
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Começar a animar
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Ainda temos mais quadros para pintar
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

#### Controlando um diálogo modal {/*controlling-a-modal-dialog*/}

Neste exemplo, o sistema externo é o DOM do navegador. O componente `ModalDialog` renderiza um elemento [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Ele usa um Efeito para sincronizar a prop `isOpen` com as chamadas dos métodos [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) e [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Abrir diálogo
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

```js src/ModalDialog.js active
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

#### Rastreando a visibilidade de um elemento {/*tracking-element-visibility*/}

Neste exemplo, o sistema externo é novamente o DOM do navegador. O componente `App` exibe uma longa lista, depois um componente `Box`, e depois outra longa lista. Role a lista para baixo. Note que quando todo o `Box` está totalmente visível na janela de visualização, a cor de fundo muda para preto. Para implementar isso, o componente `Box` usa um Efeito para gerenciar um [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Essa API do navegador notifica você quando o elemento DOM está visível na janela de visualização.

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

```js src/Box.js active
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
    }, {
       threshold: 1.0
    });
    observer.observe(div);
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

### Encapsulando Efeitos em Hooks personalizados {/*wrapping-effects-in-custom-hooks*/}

Os Efeitos são um ["escape hatch":](/learn/escape-hatches) que você usa quando precisa "sair do React" e quando não há solução interna melhor para o seu caso de uso. Se você se vê frequentemente precisando escrever Efeitos manualmente, geralmente é um sinal de que você precisa extrair alguns [Hooks personalizados](/learn/reusing-logic-with-custom-hooks) para comportamentos comuns dos quais seus componentes dependem.

Por exemplo, este Hook personalizado `useChatRoom` "oculta" a lógica do seu Efeito atrás de uma API mais declarativa:

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

Então você pode usá-lo de qualquer componente assim:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Existem também muitos ótimos Hooks personalizados para todos os propósitos disponíveis no ecossistema React.

[Saiba mais sobre encapsular Efeitos em Hooks personalizados.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Exemplos de encapsulamento de Efeitos em Hooks personalizados" titleId="examples-custom-hooks">

#### Hook personalizado `useChatRoom` {/*custom-usechatroom-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting) mas a lógica é extraída para um Hook personalizado.

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
        URL do Servidor:{' '}
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
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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

```js src/useChatRoom.js
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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
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

#### Hook personalizado `useWindowListener` {/*custom-usewindowlistener-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting) mas a lógica é extraída para um Hook personalizado.

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

```js src/useWindowListener.js
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

#### Hook personalizado `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

Este exemplo é idêntico a um dos [exemplos anteriores,](#examples-connecting) mas a lógica é parcialmente extraída para um Hook personalizado.

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

```js src/Box.js active
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

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
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

### Controlando um widget não-React {/*controlling-a-non-react-widget*/}

Às vezes, você deseja manter um sistema externo sincronizado com alguma prop ou estado do seu componente.

Por exemplo, se você tiver um widget de mapa de terceiros ou um componente reprodutor de vídeo escrito sem React, pode usar um Efeito para chamar métodos nele que fazem seu estado corresponder ao estado atual do seu componente React. Esse Efeito cria uma instância da classe `MapWidget` definida em `map-widget.js`. Quando você muda a prop `zoomLevel` do componente `Map`, o Efeito chama o `setZoom()` na instância da classe para mantê-la sincronizada:

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

```js src/App.js
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

```js src/Map.js active
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

```js src/map-widget.js
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

Neste exemplo, uma função de limpeza não é necessária porque a classe `MapWidget` gerencia apenas o nó DOM que foi passado para ela. Depois que o componente `Map` do React é removido da árvore, tanto o nó DOM quanto a instância da classe `MapWidget` serão automaticamente coletados pelo mecanismo JavaScript do navegador.

---

### Buscando dados com Efeitos {/*fetching-data-with-effects*/}

<<<<<<< HEAD
Você pode usar um Efeito para buscar dados para seu componente. Note que [se você usar uma framework,](/learn/start-a-new-react-project#full-stack-frameworks) usar o mecanismo de busca de dados da sua framework será muito mais eficiente do que escrever Efeitos manualmente.
=======
You can use an Effect to fetch data for your component. Note that [if you use a framework,](/learn/creating-a-react-app#full-stack-frameworks) using your framework's data fetching mechanism will be a lot more efficient than writing Effects manually.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Se você quiser buscar dados de um Efeito manualmente, seu código pode ser assim:

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

Note a variável `ignore` que é inicializada como `false`, e é definida como `true` durante a limpeza. Isso garante que [seu código não sofra de "condições de corrida":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) as respostas de rede podem chegar em uma ordem diferente da que você as enviou.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
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

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Esta é a biografia de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>

Você também pode reescrever usando a sintaxe [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), mas ainda precisa fornecer uma função de limpeza:

<Sandpack>

```js src/App.js
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

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Esta é a biografia de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>

Escrever a busca de dados diretamente em Efeitos se torna repetitivo e torna difícil adicionar otimizações como cache e renderização no servidor mais tarde. [É mais fácil usar um Hook personalizado--seu próprio ou mantido pela comunidade.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Quais são boas alternativas à busca de dados em Efeitos? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Escrever chamadas `fetch` dentro de Efeitos é uma [maneira popular de buscar dados](https://www.robinwieruch.de/react-hooks-fetch-data/), especialmente em aplicativos totalmente do lado do cliente. Este é, no entanto, um abordagem muito manual e tem desvantagens significativas:

- **Efeitos não são executados no servidor.** Isso significa que o HTML gerado inicialmente no servidor só incluirá um estado de carregamento sem dados. O computador cliente terá que baixar todo o JavaScript e renderizar seu aplicativo apenas para descobrir que agora precisa carregar os dados. Isso não é muito eficiente.
- **Buscar diretamente em Efeitos torna fácil criar "cachoeiras de rede".** Você renderiza o componente pai, ele busca alguns dados, renderiza os componentes filhos, e então eles começam a buscar seus dados. Se a rede não for muito rápida, isso é significativamente mais lento do que buscar todos os dados em paralelo.
- **Buscar diretamente em Efeitos geralmente significa que você não pré-carrega ou armazena em cache os dados.** Por exemplo, se o componente for desmontado e depois montado novamente, ele teria que buscar os dados novamente.
- **Não é muito ergonômico.** Há bastante código boilerplate envolvido ao escrever chamadas `fetch` de uma maneira que não sofra de bugs como [condições de corrida.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Esta lista de desvantagens não é específica do React. Ela se aplica a buscar dados ao montar com qualquer biblioteca. Assim como com roteamento, buscar dados não é trivial de fazer bem, então recomendamos as seguintes abordagens:

<<<<<<< HEAD
- **Se você usar uma [framework](/learn/start-a-new-react-project#full-stack-frameworks), utilize seu mecanismo de busca de dados integrado.** Frameworks modernas de React possuem mecanismos integrados de busca de dados que são eficientes e não sofrem com as armadilhas mencionadas acima.
- **Caso contrário, considere usar ou construir um cache do lado do cliente.** Soluções populares de código aberto incluem [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Você também pode construir sua própria solução, caso em que usaria Efeitos por baixo dos panos, mas também adicionaria lógica para desduplicar solicitações, armazenar respostas em cache e evitar cachoeiras de rede (pré-carregando dados ou elevando os requisitos de dados para rotas).
=======
- **If you use a [framework](/learn/creating-a-react-app#full-stack-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood but also add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Você pode continuar buscando dados diretamente em Efeitos se nenhuma dessas abordagens for adequada a você.

</DeepDive>

---

### Especificando dependências reativas {/*specifying-reactive-dependencies*/}

**Note que você não pode "escolher" as dependências do seu Efeito.** Cada <CodeStep step={2}>valor reativo</CodeStep> usado pelo código do seu Efeito deve ser declarado como uma dependência. A lista de dependências do seu Efeito é determinada pelo código circundante:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Este é um valor reativo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Este também é um valor reativo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Efeito lê esses valores reativos
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Portanto, você deve especificá-los como dependências do seu Efeito
  // ...
}
```

Se `serverUrl` ou `roomId` mudarem, seu Efeito irá reconectar ao chat usando os novos valores.

**[Valores reativos](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) incluem props e todas as variáveis e funções declaradas diretamente dentro do seu componente.** Como `roomId` e `serverUrl` são valores reativos, você não pode removê-los das dependências. Se você tentar omiti-los e [seu linter estiver configurado corretamente para o React,](/learn/editor-setup#linting) o linter sinalizará isso como um erro que você precisa corrigir:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect tem dependências ausentes: 'roomId' e 'serverUrl'
  // ...
}
```

**Para remover uma dependência, você precisa ["provar" ao linter que ela *não precisa* ser uma dependência.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Por exemplo, você pode mover `serverUrl` para fora do seu componente para provar que ele não é reativo e não mudará em re-renderizações:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Não é mais um valor reativo

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora que `serverUrl` não é mais um valor reativo (e não pode mudar em uma re-renderização), não precisa ser uma dependência. **Se o código do seu Efeito não usar nenhum valor reativo, sua lista de dependências deve ser vazia (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Não é mais um valor reativo
const roomId = 'music'; // Não é mais um valor reativo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

[Um Efeito com dependências vazias](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) não reexecutará quando qualquer um dos props ou estado do seu componente mudar.

<Pitfall>

Se você tem uma base de código existente, pode ter alguns Efeitos que suprimem o linter assim:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evitar suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando as dependências não correspondem ao código, há um alto risco de introduzir bugs.** Ao suprimir o linter, você "mente" para o React sobre os valores dos quais seu Efeito depende. [Em vez disso, prove que eles são desnecessários.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Exemplos de passagem de dependências reativas" titleId="examples-dependencies">

#### Passando um array de dependências {/*passing-a-dependency-array*/}

<<<<<<< HEAD
Se você especificar as dependências, seu Efeito será executado **após a renderização inicial _e_ após re-renderizações com dependências alteradas.**
=======
If you specify the dependencies, your Effect runs **after the initial commit _and_ after commits with changed dependencies.**
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Executa novamente se a ou b forem diferentes
```

No exemplo abaixo, `serverUrl` e `roomId` são [valores reativos,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) então ambos devem ser especificados como dependências. Como resultado, selecionar uma sala diferente no dropdown ou editar a entrada da URL do servidor faz com que o chat reconecte. No entanto, como `message` não é usado no Efeito (e, portanto, não é uma dependência), editar a mensagem não reconecta ao chat.

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
        URL do Servidor:{' '}
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
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
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

#### Passando um array de dependências vazio {/*passing-an-empty-dependency-array*/}

<<<<<<< HEAD
Se seu Efeito realmente não usar nenhum valor reativo, ele executará **apenas após a renderização inicial.**
=======
If your Effect truly doesn't use any reactive values, it will only run **after the initial commit.**
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}, []); // Não executa novamente (exceto uma vez em desenvolvimento)
```

**Mesmo com dependências vazias, configuração e limpeza [serão executadas uma vez extra durante o desenvolvimento](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) para ajudar você a encontrar bugs.**


No exemplo, tanto `serverUrl` quanto `roomId` são hardcoded. Como estão declarados fora do componente, eles não são valores reativos, e assim não são dependências. A lista de dependências é vazia, então o Efeito não re-executa em re-renderizações.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Não passando nenhuma array de dependências {/*passing-no-dependency-array-at-all*/}

<<<<<<< HEAD
Se você não passar nenhuma array de dependências, seu Efeito será executado **após cada renderização (e re-renderização)** do seu componente.
=======
If you pass no dependency array at all, your Effect runs **after every single commit** of your component.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}); // Executa novamente sempre
```

No exemplo, o Efeito re-executa quando você muda `serverUrl` e `roomId`, o que é sensato. No entanto, ele *também* re-executa quando você muda a `message`, o que provavelmente não é desejável. É por isso que geralmente você especificará a array de dependência.

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
  }); // Nenhuma array de dependência

  return (
    <>
      <label>
        URL do Servidor:{' '}
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
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
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

### Atualizando o estado baseado em estado anterior a partir de um Efeito {/*updating-state-based-on-previous-state-from-an-effect*/}

Quando você deseja atualizar o estado com base no estado anterior a partir de um Efeito, você pode encontrar um problema:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Você quer incrementar o contador a cada segundo...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... mas especificar `count` como uma dependência redefine sempre o intervalo.
  // ...
}
```

Como `count` é um valor reativo, deve ser especificado na lista de dependências. No entanto, isso faz com que o Efeito limpe e configure novamente toda vez que o `count` muda. Isso não é ideal. 

Para corrigir isso, [passe o atualizador de estado `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) para `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Passe um atualizador de estado
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

Agora que você está passando `c => c + 1` em vez de `count + 1`, [seu Efeito não precisa mais depender de `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Como resultado dessa correção, ele não precisará limpar e configurar o intervalo novamente toda vez que o `count` mudar.

---


### Removendo dependências de objeto desnecessárias {/*removing-unnecessary-object-dependencies*/}

<<<<<<< HEAD
Se seu Efeito depende de um objeto ou uma função criada durante a renderização, ele pode rodar mais frequentemente. Por exemplo, este Efeito reconecta após cada renderização porque o objeto `options` é [diferente a cada renderização:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
=======
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every commit because the `options` object is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Este objeto é criado do zero a cada re-renderização
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // É usado dentro do Efeito
    connection.connect();
    return () => connection.disconnect();
<<<<<<< HEAD
  }, [options]); // 🚩 Como resultado, essas dependências estão sempre diferentes em re-renderizações
=======
  }, [options]); // 🚩 As a result, these dependencies are always different on a commit
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75
  // ...
```

Evite usar um objeto criado durante a renderização como dependência. Em vez disso, crie o objeto dentro do Efeito:

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
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Agora que você cria o objeto `options` dentro do Efeito, o próprio Efeito depende apenas da string `roomId`.

Com essa correção, digitar na entrada não reconecta o chat. Ao contrário de um objeto que é recriado, uma string como `roomId` não muda a menos que você a defina para outro valor. [Leia mais sobre remoção de dependências.](/learn/removing-effect-dependencies)

---

### Removendo dependências de função desnecessárias {/*removing-unnecessary-function-dependencies*/}

<<<<<<< HEAD
Se seu Efeito depende de um objeto ou uma função criada durante a renderização, ele pode rodar mais frequentemente. Por exemplo, este Efeito reconecta após cada renderização porque a função `createOptions` é [diferente a cada renderização:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
=======
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every commit because the `createOptions` function is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Esta função é criada do zero a cada re-renderização
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // É usada dentro do Efeito
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
<<<<<<< HEAD
  }, [createOptions]); // 🚩 Como resultado, essas dependências estão sempre diferentes em re-renderizações
  // ...
```

Por si só, criar uma função do zero a cada re-renderização não é um problema. Você não precisa otimizar isso. No entanto, se você a usar como uma dependência do seu Efeito, fará com que seu Efeito re-execute após cada re-renderização.
=======
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a commit
  // ...
```

By itself, creating a function from scratch on every re-render is not a problem. You don't need to optimize that. However, if you use it as a dependency of your Effect, it will cause your Effect to re-run after every commit.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Evite usar uma função criada durante a renderização como dependência. Em vez disso, declare-a dentro do Efeito:

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
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Agora que você definiu a função `createOptions` dentro do Efeito, o Efeito em si depende apenas da string `roomId`. Com essa correção, digitar na entrada não reconecta o chat. Ao contrário de uma função que é recriada, uma string como `roomId` não muda, a menos que você a defina para outro valor. [Leia mais sobre remoção de dependências.](/learn/removing-effect-dependencies)

---

### Lendo os últimos props e estado de um Efeito {/*reading-the-latest-props-and-state-from-an-effect*/}

<<<<<<< HEAD
<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Por padrão, quando você lê um valor reativo de um Efeito, precisa adicioná-lo como uma dependência. Isso garante que seu Efeito "reaja" a cada mudança desse valor. Para a maioria das dependências, esse é o comportamento que você deseja.
=======
By default, when you read a reactive value from an Effect, you have to add it as a dependency. This ensures that your Effect "reacts" to every change of that value. For most dependencies, that's the behavior you want.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**No entanto, às vezes você quer ler os *últimos* props e estado de um Efeito sem "reagir" a eles.** Por exemplo, imagine que você quer registrar o número de itens no carrinho de compras para cada visita à página:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Todas as dependências declaradas
  // ...
}
```

<<<<<<< HEAD
**E se você quiser registrar uma nova visita à página após cada mudança de `url`, mas *não* se apenas o `shoppingCart` mudar?** Você não pode excluir `shoppingCart` das dependências sem quebrar as [regras de reatividade.](#specifying-reactive-dependencies) No entanto, você pode expressar que *não quer* que um trecho de código "reaja" a alterações, mesmo que ele seja chamado de dentro de um Efeito. [Declare um *Evento de Efeito*](/learn/separating-events-from-effects#declaring-an-effect-event) com o Hook [`useEffectEvent`](/reference/react/experimental_useEffectEvent), e mova o código que lê `shoppingCart` para dentro dele:
=======
**What if you want to log a new page visit after every `url` change, but *not* if only the `shoppingCart` changes?** You can't exclude `shoppingCart` from dependencies without breaking the [reactivity rules.](#specifying-reactive-dependencies) However, you can express that you *don't want* a piece of code to "react" to changes even though it is called from inside an Effect. [Declare an *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) with the [`useEffectEvent`](/reference/react/useEffectEvent) Hook, and move the code reading `shoppingCart` inside of it:
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Todas as dependências declaradas
  // ...
}
```

**Eventos de Efeito não são reativos e devem sempre ser omitidos das dependências do seu Efeito.** Isso permite que você coloque código não reativo (onde você pode ler o valor mais recente de alguns props e estado) dentro deles. Ao ler `shoppingCart` dentro de `onVisit`, você garante que `shoppingCart` não reexecutará seu Efeito.

[Leia mais sobre como Eventos de Efeito permitem separar código reativo e não reativo.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Exibindo conteúdo diferente no servidor e no cliente {/*displaying-different-content-on-the-server-and-the-client*/}

<<<<<<< HEAD
Se seu aplicativo usa renderização do servidor (diretamente ou por meio de uma [framework](/learn/start-a-new-react-project#full-stack-frameworks)), seu componente será renderizado em dois ambientes diferentes. No servidor, ele renderizará para produzir o HTML inicial. No cliente, o React executará o código de renderização novamente para que possa anexar seus manipuladores de eventos a esse HTML. É por isso que, para [hidratação](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) funcionar, sua saída de renderização inicial deve ser idêntica no cliente e no servidor.
=======
If your app uses server rendering (either [directly](/reference/react-dom/server) or via a [framework](/learn/creating-a-react-app#full-stack-frameworks)), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) to work, your initial render output must be identical on the client and the server.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Em raras ocasiões, você pode precisar exibir conteúdo diferente no cliente. Por exemplo, se seu aplicativo ler alguns dados de [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), não é possível fazer isso no servidor. Aqui está como você poderia implementar isso:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... retornar JSX apenas do cliente ...
  }  else {
    // ... retornar JSX inicial ...
  }
}
```

Enquanto o aplicativo está carregando, o usuário verá a saída de renderização inicial. Então, quando estiver carregado e hidratado, seu Efeito será executado e definirá `didMount` como `true`, acionando uma re-renderização. Isso mudará para a saída de renderização apenas do cliente. Efeitos não são executados no servidor, por isso `didMount` estava `false` durante a renderização inicial no servidor.

Use esse padrão com moderação. Tenha em mente que usuários com uma conexão lenta verão o conteúdo inicial por bastante tempo--potencialmente, muitos segundos--então você não quer fazer mudanças bruscas na aparência do seu componente. Em muitos casos, você pode evitar essa necessidade mostrando condicionalmente coisas diferentes com CSS.

---

## Solução de Problemas {/*troubleshooting*/}

### Meu Efeito é executado duas vezes quando o componente monta {/*my-effect-runs-twice-when-the-component-mounts*/}

Quando o Modo Estrito está ativado, no desenvolvimento, o React executa a configuração e a limpeza uma vez extra antes da configuração real.

Este é um teste de estresse que verifica se a lógica do seu Efeito está implementada corretamente. Se isso causar problemas visíveis, sua função de limpeza pode estar faltando alguma lógica. A função de limpeza deve parar ou reverter o que a função de configuração estava fazendo. A regra prática é que o usuário não deve ser capaz de distinguir entre a configuração sendo chamada uma vez (como na produção) e uma sequência de configuração → limpeza → configuração (como no desenvolvimento).

Leia mais sobre [como isso ajuda a encontrar bugs](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) e [como corrigir sua lógica.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Meu Efeito é executado após cada re-renderização {/*my-effect-runs-after-every-re-render*/}

Primeiro, verifique se você não esqueceu de especificar a array de dependências:

```js {3}
useEffect(() => {
  // ...
<<<<<<< HEAD
}); // 🚩 Sem array de dependência: re-executa após cada renderização!
=======
}); // 🚩 No dependency array: re-runs after every commit!
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75
```

Se você especificou a array de dependências, mas seu Efeito ainda re-executa em um loop, isso ocorre porque uma de suas dependências é diferente em cada re-renderização.

Você pode depurar esse problema registrando manualmente suas dependências no console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Você pode então clicar com o botão direito nas arrays de diferentes re-renderizações no console e selecionar "Armazenar como uma variável global" para ambas. Supondo que a primeira tenha sido salva como `temp1` e a segunda tenha sido salva como `temp2`, você pode então usar o console do navegador para verificar se cada dependência em ambas as arrays é a mesma:

```js
Object.is(temp1[0], temp2[0]); // A primeira dependência é a mesma entre as arrays?
Object.is(temp1[1], temp2[1]); // A segunda dependência é a mesma entre as arrays?
Object.is(temp1[2], temp2[2]); // ... e assim por diante para cada dependência ...
```

Quando você encontra a dependência que é diferente em cada re-renderização, você geralmente pode corrigir isso de uma dessas maneiras:

- [Atualizando o estado baseado em estado anterior a partir de um Efeito](#updating-state-based-on-previous-state-from-an-effect)
- [Removendo dependências de objeto desnecessárias](#removing-unnecessary-object-dependencies)
- [Removendo dependências de função desnecessárias](#removing-unnecessary-function-dependencies)
- [Lendo os últimos props e estado de um Efeito](#reading-the-latest-props-and-state-from-an-effect)

Como último recurso (se esses métodos não ajudaram), envolva sua criação com [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) ou [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (para funções).

---

### Meu Efeito continua re-executando em um ciclo infinito {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Se seu Efeito está rodando em um ciclo infinito, essas duas coisas devem ser verdadeiras:

- Seu Efeito está atualizando algum estado.
- Esse estado leva a uma re-renderização, o que faz com que as dependências do Efeito mudem.

Antes de começar a corrigir o problema, pergunte a si mesmo se seu Efeito está se conectando a algum sistema externo (como DOM, rede, um widget de terceiros, etc.). Por que seu Efeito precisa definir estado? Ele está sincronizando com aquele sistema externo? Ou você está tentando gerenciar o fluxo de dados do seu aplicativo com isso?

Se não há sistema externo, considere se [remover o Efeito completamente](/learn/you-might-not-need-an-effect) simplificaria sua lógica.

Se você realmente está sincronizando com algum sistema externo, pense por que e sob quais condições seu Efeito deve atualizar o estado. Alguma coisa mudou que afeta a saída visual do seu componente? Se você precisa acompanhar algum dado que não é usado pela renderização, um [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (que não aciona re-renderizações) pode ser mais apropriado. Verifique se seu Efeito não atualiza o estado (e aciona re-renderizações) mais do que o necessário.

Por fim, se seu Efeito estiver atualizando o estado no momento certo, mas ainda assim houver um loop, é porque a atualização desse estado leva a uma das dependências do Efeito mudando. [Leia como depurar mudanças de dependência.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Minha lógica de limpeza é executada mesmo que meu componente não tenha sido desmontado {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

A função de limpeza é executada não apenas durante a desmontagem, mas antes de cada re-renderização com dependências alteradas. Além disso, em desenvolvimento, o React [executa a configuração+limpeza uma vez extra imediatamente após o componente montar.](#my-effect-runs-twice-when-the-component-mounts)

Se você tiver código de limpeza sem lógica correspondente de configuração, isso geralmente é um sinal de alerta:

```js {2-5}
useEffect(() => {
  // 🔴 Evitar: Lógica de limpeza sem lógica de configuração correspondente
  return () => {
    doSomething();
  };
}, []);
```

Sua lógica de limpeza deve ser "simétrica" à lógica de configuração e deve parar ou desfazer o que a configuração fez:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Saiba como o ciclo de vida do Effect é diferente do ciclo de vida do componente.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Meu Effect faz algo visual, e eu vejo uma cintilação antes dele ser executado {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Se o seu Effect precisa bloquear o navegador de [pintar a tela,](/learn/render-and-commit#epilogue-browser-paint) substitua `useEffect` por [`useLayoutEffect`](/reference/react/useLayoutEffect). Note que **isso não deve ser necessário para a grande maioria dos Effects.** Você só precisará disso se for crucial executar seu Effect antes da pintura do navegador: por exemplo, para medir e posicionar uma dica de ferramenta antes que o usuário a veja.
