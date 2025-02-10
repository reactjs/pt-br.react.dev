---
title: 'Sincronizando com Efeitos'
---

<Intro>

Alguns componentes precisam se sincronizar com sistemas externos. Por exemplo, você pode querer controlar um componente que não é do React com base no estado do React, configurar uma conexão com o servidor ou enviar um log de análise quando um componente aparecer na tela. *Efeitos* permitem que você execute algum código após a renderização para que você possa sincronizar seu componente com algum sistema fora do React.

</Intro>

<YouWillLearn>

- O que são Efeitos
- Como os Efeitos diferem de eventos
- Como declarar um Efeito em seu componente
- Como evitar a reexecução desnecessária de um Efeito
- Por que os Efeitos são executados duas vezes em desenvolvimento e como corrigir isso

</YouWillLearn>

## O que são Efeitos e como eles diferem de eventos? {/*what-are-effects-and-how-are-they-different-from-events*/}

Antes de abordar os Efeitos, você precisa estar familiarizado com dois tipos de lógica dentro dos componentes do React:

- **Código de renderização** (introduzido em [Descrevendo a UI](/learn/describing-the-ui)) vive no nível superior do seu componente. É aqui que você pega as props e o estado, os transforma e retorna o JSX que você quer ver na tela. [O código de renderização deve ser puro.](/learn/keeping-components-pure) Como uma fórmula matemática, ele deve apenas _calcular_ o resultado, mas não fazer nada mais.

- **Manipuladores de eventos** (introduzidos em [Adicionando Interatividade](/learn/adding-interactivity)) são funções aninhadas dentro dos seus componentes que *fazem* coisas em vez de apenas calculá-las. Um manipulador de eventos pode atualizar um campo de entrada, enviar uma solicitação HTTP POST para comprar um produto ou navegar o usuário para outra tela. Manipuladores de eventos contêm ["efeitos colaterais"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (eles mudam o estado do programa) causados por uma ação específica do usuário (por exemplo, um clique de botão ou digitação).

Às vezes, isso não é suficiente. Considere um componente `ChatRoom` que deve se conectar ao servidor de chat sempre que estiver visível na tela. Conectar-se a um servidor não é um cálculo puro (é um efeito colateral), então não pode acontecer durante a renderização. No entanto, não há um evento particular como um clique que cause a exibição do `ChatRoom`.

***Efeitos* permitem que você especifique efeitos colaterais que são causados pela própria renderização, em vez de por um evento particular.** Enviar uma mensagem no chat é um *evento* porque é causado diretamente pelo usuário ao clicar em um botão específico. No entanto, configurar uma conexão com o servidor é um *Efeito* porque deve acontecer não importando qual interação causou o aparecimento do componente. Efeitos são executados no final de um [compromisso](/learn/render-and-commit) após a atualização da tela. Este é um bom momento para sincronizar os componentes do React com algum sistema externo (como uma rede ou uma biblioteca de terceiros).

<Note>

Aqui e mais adiante neste texto, "Efeito" com letra maiúscula refere-se à definição específica do React acima, ou seja, um efeito colateral causado pela renderização. Para referir-se ao conceito de programação mais amplo, diremos "efeito colateral".

</Note>

## Você pode não precisar de um Efeito {/*you-might-not-need-an-effect*/}

**Não se apresse para adicionar Efeitos aos seus componentes.** Lembre-se de que os Efeitos são normalmente usados para "sair" do seu código React e se sincronizar com algum sistema *externo*. Isso inclui APIs do navegador, widgets de terceiros, rede, e assim por diante. Se o seu Efeito apenas ajusta algum estado com base em outro estado, [você pode não precisar de um Efeito.](/learn/you-might-not-need-an-effect)

## Como escrever um Efeito {/*how-to-write-an-effect*/}

Para escrever um Efeito, siga estas três etapas:

1. **Declare um Efeito.** Por padrão, seu Efeito será executado após cada [compromisso](/learn/render-and-commit).
2. **Especifique as dependências do Efeito.** A maioria dos Efeitos deve apenas ser reexecutada *quando necessário* em vez de após cada renderização. Por exemplo, uma animação de aparecimento deve apenas ser acionada quando um componente aparecer. Conectar-se e desconectar-se de uma sala de chat deve acontecer apenas quando o componente aparecer e desaparecer, ou quando a sala de chat mudar. Você aprenderá a controlar isso especificando *dependências*.
3. **Adicione limpeza se necessário.** Alguns Efeitos precisam especificar como parar, desfazer ou limpar o que estavam fazendo. Por exemplo, "conectar" precisa de "desconectar", "inscrever" precisa de "cancelar inscrição", e "buscar" precisa de "cancelar" ou "ignorar". Você aprenderá a fazer isso retornando uma *função de limpeza*.

Vamos olhar para cada uma dessas etapas em detalhes.

### Etapa 1: Declare um Efeito {/*step-1-declare-an-effect*/}

Para declarar um Efeito em seu componente, importe o [`useEffect` Hook](/reference/react/useEffect) do React:

```js
import { useEffect } from 'react';
```

Em seguida, chame-o no nível superior do seu componente e coloque algum código dentro do seu Efeito:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // O código aqui será executado após *cada* renderização
  });
  return <div />;
}
```

Toda vez que seu componente renderizar, o React atualizará a tela *e então* executará o código dentro de `useEffect`. Em outras palavras, **`useEffect` "atrasará" um trecho de código de ser executado até que aquela renderização seja refletida na tela.**

Vamos ver como você pode usar um Efeito para se sincronizar com um sistema externo. Considere um componente React `<VideoPlayer>`. Seria bom controlar se está tocando ou pausado passando uma prop `isPlaying` para ele:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Seu componente personalizado `VideoPlayer` renderiza a tag `<video>` incorporada do navegador:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: faça algo com isPlaying
  return <video src={src} />;
}
```

No entanto, a tag `<video>` do navegador não possui uma prop `isPlaying`. A única maneira de controlá-la é chamar manualmente os métodos [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) no elemento do DOM. **Você precisa sincronizar o valor da prop `isPlaying`, que diz se o vídeo _deve_ estar tocando atualmente, com chamadas como `play()` e `pause()`.**

Primeiro, precisamos [obter uma referência](/learn/manipulating-the-dom-with-refs) para o nó do DOM `<video>`.

Você pode ser tentado a tentar chamar `play()` ou `pause()` durante a renderização, mas isso não está correto:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Chamar isso durante a renderização não é permitido.
  } else {
    ref.current.pause(); // Além disso, isso causa falha.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

A razão pela qual esse código não está correto é que ele tenta fazer algo com o nó do DOM durante a renderização. No React, [a renderização deve ser uma cálculo puro](/learn/keeping-components-pure) de JSX e não deve conter efeitos colaterais como modificar o DOM.

Além disso, quando `VideoPlayer` é chamado pela primeira vez, seu DOM ainda não existe! Não há um nó do DOM para chamar `play()` ou `pause()`, porque o React não sabe qual DOM criar até você retornar o JSX.

A solução aqui é **envolver o efeito colateral com `useEffect` para movê-lo para fora do cálculo de renderização:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Ao envolver a atualização do DOM em um Efeito, você permite que o React atualize a tela primeiro. Então, seu Efeito é executado.

Quando seu componente `VideoPlayer` renderiza (seja pela primeira vez ou se ele re-renderiza), algumas coisas acontecerão. Primeiro, o React atualizará a tela, garantindo que a tag `<video>` esteja no DOM com as props corretas. Em seguida, o React executará seu Efeito. Por fim, seu Efeito chamará `play()` ou `pause()` dependendo do valor de `isPlaying`.

Pressione Tocar/Pausar várias vezes e veja como o player de vídeo permanece sincronizado com o valor de `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Neste exemplo, o "sistema externo" que você sincronizou com o estado do React foi a API de mídia do navegador. Você pode usar uma abordagem semelhante para envolver código legado não react (como plugins jQuery) em componentes declarativos do React.

Observe que controlar um player de vídeo é muito mais complexo na prática. Chamar `play()` pode falhar, o usuário pode tocar ou pausar usando os controles embutidos do navegador, e assim por diante. Este exemplo é muito simplificado e incompleto.

<Pitfall>

Por padrão, os Efeitos são executados após *cada* renderização. É por isso que códigos como este **produzirão um loop infinito:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Os Efeitos são executados como um *resultado* da renderização. Definir o estado *dispara* a renderização. Definir o estado imediatamente em um Efeito é como conectar um outlet na sua própria fonte de energia. O Efeito é executado, define o estado, que causa uma nova renderização, que faz com que o Efeito seja executado de novo, define o estado novamente, isso causa outra renderização, e assim por diante.

Os Efeitos devem geralmente sincronizar seus componentes com um sistema *externo*. Se não há um sistema externo e você só quer ajustar algum estado com base em outro estado, [você pode não precisar de um Efeito.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Etapa 2: Especificar as dependências do Efeito {/*step-2-specify-the-effect-dependencies*/}

Por padrão, os Efeitos são executados após *cada* renderização. Muitas vezes, isso é **não o que você deseja:**

- Às vezes, é lento. Sincronizar com um sistema externo nem sempre é instantâneo, então você pode querer pular a execução a menos que seja necessário. Por exemplo, você não deseja reconectar ao servidor de chat a cada tecla pressionada.
- Às vezes, está errado. Por exemplo, você não deseja acionar uma animação de desvanecimento do componente em cada tecla pressionada. A animação deve tocar apenas uma vez quando o componente aparecer pela primeira vez.

Para demonstrar o problema, aqui está o exemplo anterior com alguns `console.log` e um campo de texto que atualiza o estado do componente pai. Note como digitar causa a reexecução do Efeito:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Chamando video.play()');
      ref.current.play();
    } else {
      console.log('Chamando video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Você pode dizer ao React para **pular a reexecução desnecessária do Efeito** especificando um array de *dependências* como segundo argumento para a chamada `useEffect`. Comece adicionando um array vazio `[]` ao exemplo acima na linha 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Você deve ver um erro dizendo `O Hook React useEffect tem uma dependência ausente: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Chamando video.play()');
      ref.current.play();
    } else {
      console.log('Chamando video.pause()');
      ref.current.pause();
    }
  }, []); // Isso causa um erro

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

O problema é que o código dentro do seu Efeito *depende de* a prop `isPlaying` para decidir o que fazer, mas essa dependência não foi explicitamente declarada. Para corrigir esse problema, adicione `isPlaying` ao array de dependências:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // Está sendo usado aqui...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...então deve ser declarado aqui!
```

Agora todas as dependências estão declaradas, então não há erro. Especificar `[isPlaying]` como o array de dependências diz ao React que ele deve pular a reexecução do seu Efeito se `isPlaying` for o mesmo que era durante a renderização anterior. Com essa mudança, digitar no campo de entrada não causa a reexecução do Efeito, mas pressionar Tocar/Pausar faz:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Chamando video.play()');
      ref.current.play();
    } else {
      console.log('Chamando video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

O array de dependências pode conter múltiplas dependências. O React só pulará a reexecução do Efeito se *todas* as dependências que você especificou tiverem exatamente os mesmos valores que tinham durante a renderização anterior. O React compara os valores das dependências usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Veja a [referência de `useEffect`](/reference/react/useEffect#reference) para mais detalhes.

**Observe que você não pode "escolher" suas dependências.** Você receberá um erro de lint se as dependências que você especificou não corresponderem ao que o React espera com base no código dentro do seu Efeito. Isso ajuda a detectar muitos bugs no seu código. Se você não quiser que algum código seja reexecutado, [*edite o próprio código do Efeito* para não "precisar" daquela dependência.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Os comportamentos sem o array de dependências e com um array de dependências *vazio* `[]` são diferentes:

```js {3,7,11}
useEffect(() => {
  // Isso é executado após cada renderização
});

useEffect(() => {
  // Isso é executado apenas na montagem (quando o componente aparece)
}, []);

useEffect(() => {
  // Isso é executado na montagem *e também* se a ou b mudaram desde a última renderização
}, [a, b]);
```

Vamos examinar de perto o que "montagem" significa na próxima etapa.

</Pitfall>

<DeepDive>

#### Por que a referência foi omitida do array de dependência? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Este Efeito usa _tanto_ `ref` quanto `isPlaying`, mas apenas `isPlaying` é declarado como uma dependência:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Isso se deve ao fato de que o objeto `ref` tem uma *identidade estável:* O React garante [que você sempre receberá o mesmo objeto](/reference/react/useRef#returns) da mesma chamada de `useRef` em cada renderização. Ele nunca muda, portanto, nunca causará por si só a reexecução do Efeito. Assim, não importa se você inclui ou não. Incluir também é aceitável:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

As funções [`set`](https://reference/react/useState#setstate) retornadas por `useState` também têm identidade estável, portanto você verá frequentemente elas omitidas das dependências também. Se o linter permitir que você omita uma dependência sem erros, é seguro fazê-lo.

Omitir dependências sempre estáveis funciona apenas quando o linter pode "ver" que o objeto é estável. Por exemplo, se `ref` fosse passado de um componente pai, você teria que especificá-lo no array de dependências. No entanto, isso é bom porque você não pode saber se o componente pai sempre passa a mesma referência, ou passa uma de várias referências condicionalmente. Assim, seu Efeito _dependeria_ de qual referência é passada.

</DeepDive>

### Etapa 3: Adicionar limpeza se necessário {/*step-3-add-cleanup-if-needed*/}

Considere um exemplo diferente. Você está escrevendo um componente `ChatRoom` que precisa se conectar ao servidor de chat quando aparecer. Você tem uma API `createConnection()` que retorna um objeto com métodos `connect()` e `disconnect()`. Como você mantém o componente conectado enquanto ele é exibido para o usuário?

Comece escrevendo a lógica do Efeito:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Seria lento conectar-se ao chat após cada re-renderização, então você adiciona o array de dependências:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**O código dentro do Efeito não usa nenhuma prop ou estado, então seu array de dependências é `[]` (vazio). Isso diz ao React para executar esse código apenas quando o componente "monta", ou seja, quando aparece na tela pela primeira vez.**

Vamos tentar executar esse código:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Bem-vindo ao chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando...');
    },
    disconnect() {
      console.log('❌ Desconectado.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Esse Efeito só é executado na montagem, então você pode esperar que `"✅ Conectando..."` seja impresso uma vez no console. **No entanto, se você verificar o console, `"✅ Conectando..."` é impresso duas vezes. Por que isso acontece?**

Imagine que o componente `ChatRoom` é parte de um aplicativo maior com muitas telas diferentes. O usuário começa sua jornada na página `ChatRoom`. O componente monta e chama `connection.connect()`. Em seguida, imagine que o usuário navega para outra tela -- por exemplo, para a página de Configurações. O componente `ChatRoom` é desmontado. Finalmente, o usuário clica em Voltar e `ChatRoom` monta novamente. Isso configuraria uma segunda conexão--mas a primeira conexão nunca foi destruída! À medida que o usuário navega pelo aplicativo, as conexões continuariam se acumulando.

Erros como esse são fáceis de perder sem testes manuais extensivos. Para ajudá-lo a detectá-los rapidamente, no desenvolvimento, o React remonta cada componente uma vez imediatamente após sua montagem inicial.

Ver a mensagem `"✅ Conectando..."` ser impressa duas vezes ajuda você a perceber o problema real: seu código não fecha a conexão quando o componente desmonta.

Para corrigir o problema, retorne uma *função de limpeza* do seu Efeito:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

O React chamará sua função de limpeza toda vez que o Efeito for executado novamente, e uma última vez quando o componente for desmontado (removido). Vamos ver o que acontece quando a função de limpeza é implementada:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bem-vindo ao chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando...');
    },
    disconnect() {
      console.log('❌ Desconectado.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Agora você obterá três logs no console no desenvolvimento:

1. `"✅ Conectando..."`
2. `"❌ Desconectado."`
3. `"✅ Conectando..."`

**Este é o comportamento correto em desenvolvimento.** Remontando seu componente, o React verifica que navegar para longe e voltar não quebraria seu código. Desconectar e depois conectar novamente é exatamente o que deve acontecer! Quando você implementar a limpeza corretamente, não deve haver diferença visível para o usuário entre executar o Efeito uma vez e executá-lo, limpá-lo e executá-lo novamente. Há um par extra de chamadas de conectar/desconectar porque o React está testando seu código em busca de bugs em desenvolvimento. Isso é normal--não tente fazê-lo desaparecer!

**Na produção, você veria apenas `"✅ Conectando..."` impresso uma vez.** A remontagem de componentes só acontece no desenvolvimento para ajudá-lo a encontrar Efeitos que precisam de limpeza. Você pode desligar o [Modo Estrito](/reference/react/StrictMode) para optar por não participar do comportamento de desenvolvimento, mas recomendamos que você mantenha-o ativado. Isso permite que você encontre muitos erros como o acima.

## Como lidar com a execução do Efeito duas vezes em desenvolvimento? {/*how-to-handle-the-effect-firing-twice-in-development*/}

O React intencionalmente remonta seus componentes em desenvolvimento para encontrar erros, como no exemplo anterior. **A pergunta certa não é "como executar um Efeito uma vez", mas "como corrigir meu Efeito para que funcione após a remontagem".**

Normalmente, a resposta é implementar a função de limpeza. A função de limpeza deve parar ou desfazer o que o Efeito estava fazendo. A regra geral é que o usuário não deve ser capaz de distinguir entre o Efeito sendo executado uma vez (como na produção) e uma sequência de _configuração → limpeza → configuração_ (como você veria em desenvolvimento).

A maioria dos Efeitos que você escreverá se encaixará em um dos padrões comuns abaixo.

<Pitfall>

#### Não use refs para impedir que Efeitos sejam executados {/*dont-use-refs-to-prevent-effects-from-firing*/}

Uma armadilha comum para impedir que os Efeitos sejam executados duas vezes em desenvolvimento é usar uma `ref` para evitar que o Efeito seja executado mais de uma vez. Por exemplo, você poderia "corrigir" o erro acima com um `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 Isso não irá corrigir o bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Isso faz com que você veja apenas `"✅ Conectando..."` uma vez em desenvolvimento, mas não corrige o erro.

Quando o usuário navega para longe, a conexão ainda não é fechada e quando ele navega de volta, uma nova conexão é criada. À medida que o usuário navega pelo aplicativo, as conexões continuariam se acumulando, assim como aconteceria antes da "correção".

Para corrigir o bug, não basta apenas fazer o Efeito ser executado uma vez. O efeito precisa funcionar após a remontagem, o que significa que a conexão precisa ser limpa como na solução acima.

Veja os exemplos abaixo para como lidar com padrões comuns.

</Pitfall>

### Controlando widgets não-React {/*controlling-non-react-widgets*/}

Às vezes, você precisa adicionar widgets de UI que não foram escritos para o React. Por exemplo, digamos que você está adicionando um componente de mapa à sua página. Ele tem um método `setZoomLevel()`, e você gostaria de manter o nível de zoom sincronizado com uma variável de estado `zoomLevel` em seu código React. Seu Efeito seria semelhante a isto:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Observe que não há necessidade de limpeza neste caso. No desenvolvimento, o React chamará o Efeito duas vezes, mas isso não é um problema pois chamar `setZoomLevel` duas vezes com o mesmo valor não faz nada. Pode ser um pouco mais lento, mas isso não importa pois não irá remontar desnecessariamente na produção.

Algumas APIs podem não permitir que você as chame duas vezes em sequência. Por exemplo, o método [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) do elemento `<dialog>` embutido [https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement] lançará um erro se você o chamar duas vezes. Implemente a função de limpeza e faça-a fechar o diálogo:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

No desenvolvimento, seu Efeito chamará `showModal()`, em seguida, imediatamente `close()`, e então `showModal()` novamente. Isso tem o mesmo comportamento visível para o usuário que chamar `showModal()` uma vez, como você faria na produção.

### Inscrevendo-se em eventos {/*subscribing-to-events*/}

Se seu Efeito se inscrever em algo, a função de limpeza deve cancelar a inscrição:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

No desenvolvimento, seu Efeito chamará `addEventListener()`, em seguida, imediatamente `removeEventListener()`, e então `addEventListener()` novamente com o mesmo manipulador. Assim, haveria apenas uma assinatura ativa de cada vez. Isso tem o mesmo comportamento visível para o usuário que chamar `addEventListener()` uma vez, como na produção.

### Acionando animações {/*triggering-animations*/}

Se seu Efeito anima algo, a função de limpeza deve redefinir a animação para os valores iniciais:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Aciona a animação
  return () => {
    node.style.opacity = 0; // Redefinir para o valor inicial
  };
}, []);
```

No desenvolvimento, a opacidade será definida como `1`, em seguida, `0`, e então `1` novamente. Isso deve ter o mesmo comportamento visível para o usuário que definir diretamente para `1`, que é o que aconteceria na produção. Se você usar uma biblioteca de animação de terceiros com suporte para animações gradativas, sua função de limpeza deve redefinir a linha do tempo para seu estado inicial.

### Buscando dados {/*fetching-data*/}

Se seu Efeito busca algo, a função de limpeza deve ou [abortar a busca](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ou ignorar seu resultado:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Você não pode "desfazer" uma solicitação de rede que já ocorreu, mas sua função de limpeza deve garantir que a busca que *não é mais relevante* não continue afetando sua aplicação. Se o `userId` mudar de `'Alice'` para `'Bob'`, a limpeza garante que a resposta de `'Alice'` seja ignorada mesmo que chegue após `'Bob'`.

**No desenvolvimento, você verá duas buscas na aba de Rede.** Não há nada de errado com isso. Com a abordagem acima, o primeiro Efeito será imediatamente limpo, de modo que sua cópia da variável `ignore` será definida como `true`. Portanto, mesmo que haja uma solicitação extra, ela não afetará o estado graças à checagem `if (!ignore)`.

**Na produção, haverá apenas uma solicitação.** Se a segunda solicitação no desenvolvimento estiver incomodando você, a melhor abordagem é usar uma solução que deduplica solicitações e registra suas respostas entre os componentes:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Isso não apenas melhorará a experiência de desenvolvimento, mas também fará seu aplicativo parecer mais rápido. Por exemplo, o usuário pressionando o botão Voltar não terá que esperar que alguns dados sejam carregados novamente porque eles estarão em cache. Você pode construir tal cache você mesmo ou usar uma das muitas alternativas para busca manual em Efeitos.

<DeepDive>

#### Quais são boas alternativas para busca de dados em Efeitos? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Escrever chamadas `fetch` dentro de Efeitos é uma [maneira popular de buscar dados](https://www.robinwieruch.de/react-hooks-fetch-data/), especialmente em aplicativos totalmente do lado do cliente. No entanto, esta é uma abordagem muito manual e tem desvantagens significativas:

- **Os Efeitos não são executados no servidor.** Isso significa que o HTML inicial renderizado no servidor incluirá apenas um estado de carregamento sem dados. O computador do cliente terá que baixar todo o JavaScript e renderizar seu aplicativo apenas para descobrir que agora precisa carregar os dados. Isso não é muito eficiente.
- **Buscar diretamente em Efeitos torna fácil criar "cachoeiras de rede".** Você renderiza o componente pai, busca alguns dados, renderiza os componentes filhos, e então eles começam a buscar seus dados. Se a rede não for muito rápida, isso é significativamente mais lento do que buscar todos os dados em paralelo.
- **Buscar diretamente em Efeitos geralmente significa que você não pré-carrega ou armazena dados em cache.** Por exemplo, se o componente desmonta e depois é montado novamente, ele teria que buscar os dados novamente.
- **Não é muito ergonômico.** Há bastante código de boilerplate envolvido ao escrever chamadas `fetch` de uma maneira que não sofra com bugs como [condições de corrida.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Essa lista de desvantagens não é específica do React. Ela se aplica a buscar dados na montagem com qualquer biblioteca. Como com roteamento, a busca de dados não é trivial de fazer bem, portanto, recomendamos as seguintes abordagens:

- **Se você usar um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use seu mecanismo de busca de dados embutido.** Frameworks modernos do React têm mecanismos de busca de dados integrados que são eficientes e não sofrem com as desvantagens acima.
- **Caso contrário, considere usar ou construir um cache do lado do cliente.** Soluções populares de código aberto incluem [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Você também pode construir sua própria solução, caso em que você usaria Efeitos no fundo, mas adicionaria lógica para deduplicar solicitações, armazenar respostas em cache e evitar cachoeiras de rede (pré-carregando dados ou erguer requisitos de dados para rotas).

Você pode continuar buscando dados diretamente em Efeitos se nenhuma dessas abordagens servir para você.

</DeepDive>

### Enviando análises {/*sending-analytics*/}

Considere este código que envia um evento de análise na visita à página:

```js
useEffect(() => {
  logVisit(url); // Envia uma solicitação POST
}, [url]);
```

No desenvolvimento, `logVisit` será chamado duas vezes para cada URL, então você pode ser tentado a tentar corrigir isso. **Recomendamos manter esse código como está.** Como em exemplos anteriores, não há diferença de *comportamento visível para o usuário* entre executá-lo uma vez e executá-lo duas vezes. Do ponto de vista prático, `logVisit` não deve fazer nada em desenvolvimento porque você não quer que os logs das máquinas de desenvolvimento deformem as métricas de produção. Seu componente remonta toda vez que você salva seu arquivo, então ele registra visitas extras em desenvolvimento de qualquer maneira.

**Na produção, não haverá logs de visita duplicados.**

Para depurar os eventos de análise que você está enviando, você pode implantar seu aplicativo em um ambiente de staging (que roda em modo de produção) ou optar temporariamente por não participar do [Modo Estrito](/reference/react/StrictMode) e suas verificações de remontagem só em desenvolvimento. Você também pode enviar análises a partir dos manipuladores de eventos de mudança de rota em vez de Efeitos. Para análises mais precisas, [observadores de interseção](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) podem ajudar a rastrear quais componentes estão na viewport e quanto tempo permanecem visíveis.

### Não um Efeito: Inicializando a aplicação {/*not-an-effect-initializing-the-application*/}

Alguma lógica deve ser executada apenas uma vez quando a aplicação inicia. Você pode colocá-la fora de seus componentes:

```js {2-3}
if (typeof window !== 'undefined') { // Verifique se estamos rodando no navegador.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Isso garante que essa lógica só seja executada uma vez após o navegador carregar a página.

### Não um Efeito: Comprando um produto {/*not-an-effect-buying-a-product*/}

Às vezes, mesmo que você escreva uma função de limpeza, não há como evitar as consequências visíveis para o usuário de executar o Efeito duas vezes. Por exemplo, talvez seu Efeito envie uma solicitação POST como comprar um produto:

```js {2-3}
useEffect(() => {
  // 🔴 Errado: Este Efeito dispara duas vezes em desenvolvimento, expondo um problema no código.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Você não gostaria de comprar o produto duas vezes. No entanto, isso é também porque você não deve colocar essa lógica em um Efeito. E se o usuário for para outra página e então pressionar Voltar? Seu Efeito executaria novamente. Você não quer comprar o produto quando o usuário *visita* uma página; você quer comprá-lo quando o usuário *clica* no botão Comprar.

Comprar não é causado pela renderização; é causado por uma interação específica. Deve ser executado apenas quando o usuário pressionar o botão. **Exclua o Efeito e mova sua solicitação `/api/buy` para o manipulador de eventos do botão Buy:**

```js {2-3}
  function handleClick() {
    // ✅ Comprar é um evento porque é causado por uma interação específica.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Isso ilustra que se a remontagem quebrar a lógica da sua aplicação, isso geralmente revela bugs existentes.** Do ponto de vista do usuário, visitar uma página não deve ser diferente de visitá-la, clicar em um link e depois pressionar Voltar para ver a página novamente. O React verifica que seus componentes respeitam esse princípio ao remontá-los uma vez em desenvolvimento.

## Juntando tudo {/*putting-it-all-together*/}

Este playground pode ajudá-lo a "sentir" como os Efeitos funcionam na prática.

Este exemplo usa [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) para programar um registro de console com o texto de entrada para aparecer três segundos após o Efeito ser executado. A função de limpeza cancela o timeout pendente. Comece pressionando "Montar o componente":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Agendar log "' + text + '"');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancelar log "' + text + '"');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        O que logar:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Desmontar' : 'Montar'} o componente
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Você verá três logs inicialmente: `Agendar "a" log`, `Cancelar "a" log`, e `Agendar "a" log` novamente. Três segundos depois, haverá também um log dizendo `a`. Como você aprendeu anteriormente, o par extra de agendar/cancelar é porque o React remonta o componente uma vez em desenvolvimento para verificar se você implementou a limpeza bem.

Agora edite a entrada para dizer `abc`. Se você fizer isso rapidamente, verá `Agendar "ab" log` imediatamente seguido por `Cancelar "ab" log` e `Agendar "abc" log`. **O React sempre limpa o Efeito da renderização anterior antes do Efeito da próxima renderização.** É por isso que, mesmo que você digite rapidamente na entrada, há no máximo um timeout agendado de cada vez. Edite a entrada algumas vezes e observe o console para sentir como os Efeitos são limpos.

Digite algo na entrada e então pressione imediatamente "Desmontar o componente". Note como desmontar limpa o Efeito da última renderização. Aqui, ele limpa o último timeout antes que tenha chance de disparar.

Finalmente, edite o componente acima e comente a função de limpeza para que os timeouts não sejam cancelados. Tente digitar `abcde` rapidamente. O que você espera que aconteça em três segundos? O registro `console.log(text)` dentro do timeout imprimirá o *texto mais recente* e produzirá cinco logs de `abcde`? Dê uma tentativa para verificar sua intuição!

Três segundos depois, você deverá ver uma sequência de logs (`a`, `ab`, `abc`, `abcd`, e `abcde`) em vez de cinco logs `abcde`. **Cada Efeito "captura" o valor de `text` de sua renderização correspondente.** Não importa que o estado `text` tenha mudado: um Efeito da renderização com `text = 'ab'` sempre verá `'ab'`. Em outras palavras, os Efeitos de cada renderização são isolados uns dos outros. Se você está curioso sobre como isso funciona, pode ler sobre [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Cada renderização tem seus próprios Efeitos {/*each-render-has-its-own-effects*/}

Você pode pensar em `useEffect` como "anexar" um pedaço de comportamento à saída de renderização. Considere este Efeito:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Bem-vindo a {roomId}!</h1>;
}
```

Vamos ver o que exatamente acontece à medida que o usuário navega pelo aplicativo.

#### Renderização inicial {/*initial-render*/}

O usuário visita `<ChatRoom roomId="geral" />`. Vamos [substituir mentalmente](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` por `'geral'`:

```js
  // JSX para a primeira renderização (roomId = "geral")
  return <h1>Bem-vindo a geral!</h1>;
```

**O Efeito é *também* parte da saída de renderização.** O Efeito da primeira renderização torna-se:

```js
  // Efeito para a primeira renderização (roomId = "geral")
  () => {
    const connection = createConnection('geral');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a primeira renderização (roomId = "geral")
  ['geral']
```

O React executa esse Efeito, que conecta à sala de chat `'geral'`.

#### Re-renderização com as mesmas dependências {/*re-render-with-same-dependencies*/}

Suponha que `<ChatRoom roomId="geral" />` re-renderize. A saída JSX é a mesma:

```js
  // JSX para a segunda renderização (roomId = "geral")
  return <h1>Bem-vindo a geral!</h1>;
```

O React vê que a saída de renderização não mudou, então ele não atualiza o DOM.

O Efeito da segunda renderização parece assim:

```js
  // Efeito para a segunda renderização (roomId = "geral")
  () => {
    const connection = createConnection('geral');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a segunda renderização (roomId = "geral")
  ['geral']
```

O React compara `['geral']` da segunda renderização com `['geral']` da primeira renderização. **Como todas as dependências são as mesmas, o React *ignora* o Efeito da segunda renderização.** Ele nunca é chamado.

#### Re-renderização com dependências diferentes {/*re-render-with-different-dependencies*/}

Então, o usuário visita `<ChatRoom roomId="viagem" />`. Desta vez, o componente retorna JSX diferente:

```js
  // JSX para a terceira renderização (roomId = "viagem")
  return <h1>Bem-vindo a viagem!</h1>;
```

O React atualiza o DOM para mudar `"Bem-vindo a geral"` para `"Bem-vindo a viagem"`.

O Efeito da terceira renderização parece assim:

```js
  // Efeito para a terceira renderização (roomId = "viagem")
  () => {
    const connection = createConnection('viagem');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a terceira renderização (roomId = "viagem")
  ['viagem']
```

O React compara `['viagem']` da terceira renderização com `['geral']` da segunda renderização. Uma dependência é diferente: `Object.is('viagem', 'geral')` é `false`. O Efeito não pode ser pulado.

**Antes que o React possa aplicar o Efeito da terceira renderização, ele precisa limpar o último Efeito que _foi_ executado.** O Efeito da segunda renderização foi pulado, então o React precisa limpar o Efeito da primeira renderização. Se você rolar para cima até a primeira renderização, verá que sua limpeza chama `disconnect()` na conexão que foi criada com `createConnection('geral')`. Isso desconecta o aplicativo da sala de chat `'geral'`.

Após isso, o React executa o Efeito da terceira renderização. Conecta-se à sala de chat `'viagem'`.

#### Desmontar {/*unmount*/}

Finalmente, suponha que o usuário navega para longe, e o componente `ChatRoom` se desmonta. O React executa a função de limpeza do último Efeito. O último Efeito foi da terceira renderização. A função de limpeza da terceira renderização destrói a conexão `createConnection('viagem')`. Portanto, o aplicativo desconecta da sala `'viagem'`.

#### Comportamentos apenas de desenvolvimento {/*development-only-behaviors*/}

Quando o [Modo Estrito](/reference/react/StrictMode) está ativado, o React remonta cada componente uma vez após a montagem (o estado e o DOM são preservados). Isso [ajuda você a encontrar Efeitos que precisam de limpeza](#step-3-add-cleanup-if-needed) e expõe erros como condições de corrida precocemente. Além disso, o React remonta os Efeitos sempre que você salva um arquivo em desenvolvimento. Ambos esses comportamentos são apenas para desenvolvimento.

</DeepDive>

<Recap>

- Ao contrário dos eventos, os Efeitos são causados pela própria renderização em vez de uma interação particular.
- Efeitos permitem que você sincronize um componente com algum sistema externo (API de terceiros, rede, etc).
- Por padrão, os Efeitos são executados após cada renderização (incluindo a inicial).
- O React pulará o Efeito se todas as suas dependências tiverem os mesmos valores que durante a última renderização.
- Você não pode "escolher" suas dependências. Elas são determinadas pelo código dentro do Efeito.
- Um array de dependências vazio (`[]`) corresponde à "montagem" do componente, ou seja, sendo adicionado à tela.
- No Modo Estrito, o React monta os componentes duas vezes (apenas em desenvolvimento!) para testar seus Efeitos.
- Se o seu Efeito quebrar devido à remontagem, você precisa implementar uma função de limpeza.
- O React chamará sua função de limpeza antes que o Efeito seja executado na próxima vez e durante a desmontagem.

</Recap>

<Challenges>

#### Focar um campo na montagem {/*focus-a-field-on-mount*/}

Neste exemplo, o formulário renderiza um componente `<MyInput />`.

Use o método [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) do input para fazer o `MyInput` automaticamente receber foco quando aparece na tela. Já há uma implementação comentada, mas ela não funciona exatamente. Descubra por que não funciona e conserte.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: Isso não funciona exatamente. Conserte-o.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} formulário</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Digite seu nome:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Torná-lo maiúsculo
          </label>
          <p>Olá, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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


Para verificar se sua solução funciona, pressione "Mostrar formulário" e verifique se o input recebe foco (fica destacado e o cursor é colocado dentro). Pressione "Esconder formulário" e "Mostrar formulário" novamente. Verifique se o input é destacado novamente.

O `MyInput` deve apenas focar _na montagem_ em vez de após cada renderização. Para verificar se o comportamento está correto, pressione "Mostrar formulário" e em seguida pressione repetidamente a caixa de seleção "Torná-lo maiúsculo". Clicar na caixa de seleção não deve _focar_ o input acima.

<Solution>

Chamar `ref.current.focus()` durante a renderização está errado pois é um *efeito colateral*. Efeitos colaterais devem ser colocados dentro de um manipulador de eventos ou serem declarados com `useEffect`. Neste caso, o efeito colateral é _causado_ pelo componente aparecendo em vez de por qualquer interação específica, portanto faz sentido colocá-lo em um Efeito.

Para corrigir o erro, envolva a chamada `ref.current.focus()` em uma declaração de Efeito. Em seguida, para garantir que esse Efeito seja executado apenas na montagem em vez de após cada renderização, adicione o array vazio `[]` a ele.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} formulário</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Digite seu nome:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Torná-lo maiúsculo
          </label>
          <p>Olá, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Focar um campo condicionalmente {/*focus-a-field-conditionally*/}

Este formulário renderiza dois componentes `<MyInput />`.

Pressione "Mostrar formulário" e note que o segundo campo automaticamente recebe foco. Isso ocorre porque ambos os componentes `<MyInput />` tentam focar o campo interno. Quando você chama `focus()` para dois campos de entrada em sequência, o último sempre "vence".

Vamos supor que você deseja focar o primeiro campo. O primeiro componente `MyInput` agora recebe uma prop booleana `shouldFocus` definida como `true`. Altere a lógica para que `focus()` seja chamado apenas se a prop `shouldFocus` recebida pelo `MyInput` for `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: chamar focus() apenas se shouldFocus for verdadeiro.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} formulário</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Digite seu primeiro nome:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Digite seu sobrenome:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Olá, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

Para verificar sua solução, pressione "Mostrar formulário" e "Esconder formulário" repetidamente. Quando o formulário aparecer, apenas o *primeiro* input deve receber foco. Isso ocorre porque o componente pai renderiza o primeiro input com `shouldFocus={true}` e o segundo input com `shouldFocus={false}`. Também verifique se ambos os inputs ainda funcionam e você pode digitar em ambos.

<Hint>

Você não pode declarar um Efeito condicionalmente, mas seu Efeito pode incluir lógica condicional.

</Hint>

<Solution>

Coloque a lógica condicional dentro do Efeito. Você precisará especificar `shouldFocus` como uma dependência porque está utilizando-a dentro do Efeito. (Isso significa que se a prop de algum input mudar de `false` para `true`, ela se focará após a montagem.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} formulário</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Digite seu primeiro nome:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Digite seu sobrenome:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Olá, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Corrigir um intervalo que dispara duas vezes {/*fix-an-interval-that-fires-twice*/}

Este componente `Counter` exibe um contador que deve incrementar a cada segundo. Na montagem, ele chama [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval). Isso faz com que `onTick` seja executado a cada segundo. A função `onTick` incrementa o contador.

No entanto, em vez de incrementar uma vez por segundo, ele incrementa duas vezes. Qual é a causa do bug? Corrija-o.

<Hint>

Tenha em mente que `setInterval` retorna um ID de intervalo, que você pode passar para [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) para parar o intervalo.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} contador</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

Quando o [Modo Estrito](/reference/react/StrictMode) está ativado (como nas caixas de areia neste site), o React remonta cada componente uma vez em desenvolvimento. Isso faz com que o intervalo seja configurado duas vezes, e é por isso que o contador incrementa duas vezes a cada segundo.

No entanto, o comportamento do React não é a *causa* do bug: o bug já existe no código. O comportamento do React torna o bug mais perceptível. A verdadeira causa é que este Efeito inicia um processo, mas não fornece uma maneira de limpá-lo.

Para corrigir este código, salve o ID de intervalo retornado por `setInterval` e implemente uma função de limpeza com [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Esconder' : 'Mostrar'} contador</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

No desenvolvimento, o React ainda remonta seu componente uma vez para verificar se você implementou a limpeza corretamente. Portanto, haverá uma chamada de `setInterval`, imediatamente seguida por `clearInterval`, e `setInterval` novamente. Na