```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
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
        {isPlaying ? 'Pause' : 'Play'}
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

How does this work?

1.  **During the initial render**, `isPlaying` is `false`. The `useEffect` runs, and your Effect calls `video.pause()`. React *remembers* that the dependency array was `[false]`.
2.  **You type something** into the text input. The `text` state changes, but `isPlaying` remains `false`. React re-renders `App` and `VideoPlayer`, but because the dependency array `[isPlaying]` is the same as before (`[false]`), React *skips* running the Effect.
3.  **You click "Play"**. The `isPlaying` state changes to `true`. React re-renders `App` and `VideoPlayer`, and `isPlaying` is now `true`. Because the dependency array `[true]` is *different* from what it was before (`[false]`), React re-runs your Effect. This time, it calls `video.play()`. React *remembers* that the dependency array was `[true]`.
4.  **You click "Pause"**. The `isPlaying` state changes to `false`. React re-renders `App` and `VideoPlayer`, and `isPlaying` is now `false`. Because the dependency array `[false]` is *different* from what it was before (`[true]`), React re-runs your Effect. This time, it calls `video.pause()`. React *remembers* that the dependency array was `[false]`.

  In other words, **the dependency array tells React when your Effect needs to re-run.** If some of the dependencies have changed between renders, React will re-run your Effect. If none of the dependencies have changed, React will skip the Effect.

### Dependency array tips {/*dependency-array-tips*/}

Here are some common dependency array patterns:

*   **`[]` (empty array):** Your Effect runs only once, right after the initial render. This is useful for fetching data, setting up subscriptions, or directly manipulating the DOM.
*   **`[someValue]` (array with some values):** Your Effect runs after the initial render, and after every render where `someValue` has changed since the last render. For example, if `someValue` is some state, your Effect will re-run whenever that state changes.
*   **No dependency array:** Your Effect runs after every render.

### Step 3: Add cleanup if needed {/*step-3-add-cleanup-if-needed*/}

Some side effects need to be "cleaned up" or undone when the component unmounts, or when the effect re-runs.

For example:

*   **Connections** must be closed
*   **Subscriptions** must be unsubscribed
*   **Intervals** need to be cleared
*   **Timers** need to be cleared
*   **Resources** must be released

To add cleanup, your Effect function should *return another function*:

```js {3-5}
useEffect(() => {
  // ... setup (run after render)
  return () => {
    // ... cleanup (run when unmounting, or before re-running)
  };
}, [/* dependencies */]);
```

This works in a few steps:

1.  After the component renders, React runs the code inside your `useEffect`.
2.  The code inside your `useEffect` returns a *cleanup function*.
3.  Before your component unmounts, React runs the cleanup function.
4.  If the component re-renders because its dependencies have changed, React will run the cleanup function that you returned previously, then run the Effect again with the new values.

Let's see how this works in practice. Imagine that you need to connect to a chat room when the component appears and disconnect when it disappears. This can be done by using a state variable to know whether you're connected. Here's a sketch of how the `ChatRoom` component could look:

```js
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // 1. Conecte
    const connection = createConnection(roomId);
    connection.connect();
    setIsOnline(true);

    // 2. Desconecte
    return () => {
      connection.disconnect();
      setIsOnline(false);
    };
  }, [roomId]);

  return (
    <p>
      Status: {isOnline ? 'Online' : 'Offline'}
    </p>
  );
}

function createConnection(roomId) {
  // Uma implementação fictícia
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '"...');
    },
    disconnect() {
      console.log('❌ Disconnecting from "' + roomId + '"...');
    }
  };
}
```

If you render a `<ChatRoom>`, you'll see the `"Connecting"` and `"Disconnecting"` messages in the console, as specified in the code. **However, if you change the `roomId` prop, you will also see `"Connecting"` and `"Disconnecting"` messages, because the effect runs again with a new `roomId`.**

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

<Sandpack>

```js ChatRoom.js
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // 1. Connect
    const connection = createConnection(roomId);
    connection.connect();
    setIsOnline(true);

    // 2. Disconnect
    return () => {
      connection.disconnect();
      setIsOnline(false);
    };
  }, [roomId]);

  return (
    <p>
      Status: {isOnline ? 'Online' : 'Offline'}
    </p>
  );
}

function createConnection(roomId) {
  // Uma implementação fictícia
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '"...');
    },
    disconnect() {
      console.log('❌ Disconnecting from "' + roomId + '"...');
    }
  };
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```css
label, select { display: block; margin-bottom: 10px; }
```

</Sandpack>

Here's what happens when you select a different room:

1.  React renders your `ChatRoom` component with a specific `roomId`, let's say `'general'`.
2.  React runs the Effect.  `connect()` is called, which logs `"Connecting to 'general'...`.  The cleanup function is saved (but isn't run yet).
3.  You change the `roomId` to `'travel'`. React re-renders `ChatRoom`.
4.  **Before running the Effect again for the new `roomId`, React runs the cleanup function from the previous render.**  `disconnect()` is called, which logs `"Disconnecting from 'general'..."`.
5.  React runs the Effect. `connect()` is called, which logs `"Connecting to 'travel'..."`.  The cleanup function is saved.
6.  Repeat.

In the same way, when you unmount `ChatRoom` from the screen, React will run its cleanup function.

Returning a cleanup function is a special feature of `useEffect`. It lets you keep your Effect synchronized with the external system while efficiently avoiding memory leaks.

### Effects and performance {/*effects-and-performance*/}

Effects are powerful, but it's important to use them correctly to avoid performance issues. Here are some things to keep in mind:

*   **Prefer events to Effects.** If you can implement the same logic in an event handler, do so. Events are more responsive because they only run in response to user actions, whereas Effects involve some overhead.
*   **Use dependencies carefully.** Always specify your dependencies correctly. If an Effect has incorrect dependencies, it may run more often than needed, hurting your performance.
*   **Optimize rendering.** If your Effect does some computationally expensive work, consider optimizing it with [`useMemo`](/reference/react/useMemo) and [`useCallback`](/reference/react/useCallback) to avoid re-running it unnecessarily.

## Effects in Development {/*effects-in-development*/}

To help you find bugs, React will call some of your Effect functions twice in development, and it will also run the cleanup functions at the right time as well.

This helps you catch these types of bugs:

*   **Missing dependencies.** If your Effect is missing a dependency, you'll often see that something incorrect happens twice. For example, you might see two network requests instead of one. If you fix the dependencies, the problem will go away.
*   **Incorrect cleanup logic.** If the cleanup logic isn't written correctly, you may see the same effect happen twice in a row. For example, you might see two subscriptions, but it should only be one, if you fix the cleanup.

**React only does this in development to help you find bugs.** In production, Effects will run only once as usual.

To fix the issue, you can remove extra `console.log` calls:

```js
  useEffect(() => {
    console.log('Effect'); // This will be called twice in development
  }, [])
```

Or write your cleanup logic correctly:

```js
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // ✅ Correct dependencies
```

```js
// Exporte por padrão uma função App
export default function App() {
  // Define um estado chamado isPlaying e um manipulador para atualizá-lo. Inicialmente, está definido como false.
  const [isPlaying, setIsPlaying] = useState(false);
  // Define um estado chamado text e um manipulador para atualizá-lo. Inicialmente, está definido como uma string vazia.
  const [text, setText] = useState('');
  // Retorna JSX para renderizar na tela.
  return (
    // Usa um Fragmento React para agrupar os elementos.
    <>
      {/* Um campo de entrada para o texto. */}
      <input value={text} onChange={e => setText(e.target.value)} />
      {/* Um botão que alterna entre "Pause" e "Play". */}
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {/* Exibe "Pause" ou "Play" dinamicamente dependendo do valor de isPlaying. */}
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {/* Renderiza o componente VideoPlayer, passando isPlaying e src como props. */}
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

A array de dependências pode conter múltiplas dependências. React somente deixará de executar novamente o Effect se *todas* as dependências que você especificar tiverem exatamente os mesmos valores que tinham durante a renderização anterior. React compara os valores de dependência usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Veja a [referência de `useEffect`](/reference/react/useEffect#reference) para detalhes.

**Note que você não pode "escolher" suas dependências.** Você receberá um erro de lint se as dependências que você especificou não corresponderem ao que o React espera com base no código dentro do seu Effect. Isso ajuda a detectar muitos erros em seu código. Se você não quer que algum código seja reexecutado, [*edite o próprio código do Effect* para não "precisar" dessa dependência.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Os comportamentos sem a array de dependências e com uma array de dependências *vazia* `[]` são diferentes:

```js {3,7,11}
useEffect(() => {
  // Isso roda após cada renderização
});

useEffect(() => {
  // Isso roda somente no mount (quando o componente aparece)
}, []);

useEffect(() => {
  // Isso roda no mount *e também* se a ou b tiverem sido alteradas desde a última renderização
}, [a, b]);
```

Nós vamos dar uma olhada de perto no que "mount" significa no passo seguinte.

</Pitfall>

<DeepDive>

#### Por que a ref foi omitida da array de dependências? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Este Effect usa _tanto_ `ref` quanto `isPlaying`, mas somente `isPlaying` é declarado como uma dependência:

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

Isso acontece porque o objeto `ref` tem uma *identidade estável:* React garante [que você sempre receberá o mesmo objeto](/reference/react/useRef#returns) da mesma chamada `useRef` em toda renderização. Ele nunca muda, então, por si só, nunca causará a reexecução do Effect. Por isso, não importa se você o inclui ou não. Incluí-lo também é bom:

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

As funções `set` retornadas por `useState` também têm identidade estável, então você frequentemente as verá omitidas das dependências também. Se o linter permitir que você omita uma dependência sem erros, é seguro fazê-lo.

Omitir dependências sempre estáveis somente funciona quando o linter consegue "ver" que o objeto é estável. Por exemplo, se `ref` foi passado por um componente pai, você teria que especificá-lo na array de dependências. Entretanto, isso é bom porque você não consegue saber se o componente pai sempre passa a mesma ref, ou passa uma de várias refs condicionalmente. Então, seu Effect _dependeria_ de qual ref é passada.

</DeepDive>

### Passo 3: Adicione a limpeza se necessário {/*step-3-add-cleanup-if-needed*/}

Considere um exemplo diferente. Você está escrevendo um componente `ChatRoom` que precisa conectar ao servidor de chat quando ele aparece. Você recebe uma API `createConnection()` que retorna um objeto com os métodos `connect()` e `disconnect()`. Como você mantém o componente conectado enquanto ele é exibido ao usuário?

Comece escrevendo a lógica do Effect:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Seria lento conectar ao chat após cada re-renderização, então você adiciona a array de dependências:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**O código dentro do Effect não usa nenhuma prop ou state, então sua array de dependências é `[]` (vazia). Isto diz ao React para somente executar este código quando o componente "montar", ou seja, aparecer na tela pela primeira vez.**

Vamos tentar executar este código:

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

Este Effect somente roda no mount, então você pode esperar que `"✅ Conectando..."` seja impresso uma vez no console. **Entretanto, se você verificar o console, `"✅ Conectando..."` é impresso duas vezes. Por que isso acontece?**

Imagine que o componente `ChatRoom` faz parte de um aplicativo maior com muitas telas diferentes. O usuário começa sua jornada na página `ChatRoom`. O componente monta e chama `connection.connect()`. Aí imagine que o usuário navega para uma outra tela -- por exemplo, a página de Configurações. O componente `ChatRoom` desmonta. Finalmente, o usuário clica em Voltar e `ChatRoom` monta novamente. Isso configuraria uma segunda conexão -- mas a primeira conexão nunca foi destruída! Quando o usuário navega pela aplicação, as conexões iriam se acumulando.

Erros como estes são fáceis de perder sem testes manuais extensivos. Para ajudá-lo a detectá-los rapidamente, no desenvolvimento React remonta toda vez um componente imediatamente após seu mount inicial.

Ver que o log `"✅ Conectando..."`duas vezes ajuda você a notar o problema real: seu código não fecha a conexão quando o componente desmonta.

Para corrigir o problema, retorne uma *função de limpeza* do seu Effect:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React chamará sua função de limpeza toda vez antes do Effect rodar novamente, e uma vez final quando o componente desmontar (for removido). Vamos ver o que acontece quando a função de limpeza é implementada:

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

Agora você recebe três logs no console no desenvolvimento:

1.  `"✅ Conectando..."`
2.  `"❌ Desconectado."`
3.  `"✅ Conectando..."`

**Este é o comportamento correto no desenvolvimento.** Remontando seu componente, React verifica que navegar para fora e para dentro não irá quebrar seu código. Desconectar e então conectar novamente é exatamente o que deveria acontecer! Quando você implementa a limpeza bem, não deve haver diferença visível ao usuário entre rodar o Effect uma vez vs rodá-lo, limpá-lo e rodá-lo novamente. Há um par de chamadas connect/disconnect extra porque o React está testando seu código em busca de erros no desenvolvimento. Isso é normal -- não tente fazer isso desaparecer!

**Na produção, você somente veria `"✅ Conectando..."` impresso uma vez.** Remontar componentes somente acontece no desenvolvimento para ajudá-lo a encontrar Effects que precisam de limpeza. Você pode desligar o [Strict Mode](/reference/react/StrictMode) para cancelar o comportamento de desenvolvimento, mas nós recomendamos mantê-lo ligado. Isso permite que você encontre muitos erros como o acima.

## Como lidar com o Effect rodando duas vezes no desenvolvimento? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React intencionalmente remonta seus componentes no desenvolvimento para encontrar erros como no último exemplo. **A pergunta certa não é "como rodar um Effect uma vez", mas "como corrigir meu Effect para que ele funcione após remontar".**

Normalmente, a resposta é implementar a função de limpeza. A função de limpeza deve parar ou desfazer o que o Effect estava fazendo. A regra geral é que o usuário não deveria ser capaz de distinguir entre o Effect rodando uma vez (como na produção) e uma sequência _setup → cleanup → setup_ (como você veria no desenvolvimento).

A maioria dos Effects que você escreverá se encaixará em um dos padrões comuns abaixo.

<Pitfall>

#### Não use refs para prevenir Effects de rodar {/*dont-use-refs-to-prevent-effects-from-firing*/}

Uma armadilha comum para prevenir Effects de rodar duas vezes no desenvolvimento é usar uma `ref` para prevenir que o Effect rode mais de uma vez. Por exemplo, você poderia "corrigir" o erro acima com um `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 Isso não irá corrigir o erro!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Isso faz com que você somente veja `"✅ Conectando..."` uma vez no desenvolvimento, mas não corrige o erro.

Quando o usuário navega para fora, a conexão ainda não é fechada e quando eles navegam de volta, uma nova conexão é criada. Conforme o usuário navega pela aplicação, as conexões continuariam acumulando, o mesmo que acontecia antes da "correção".

Para corrigir o erro, não basta apenas fazer com que o Effect rode uma vez. O effect precisa funcionar após remontar, o que significa que a conexão precisa ser limpa como na solução acima.

Veja os exemplos abaixo para saber como lidar com padrões comuns.

</Pitfall>

### Controlando widgets não React {/*controlling-non-react-widgets*/}

Às vezes você precisa adicionar widgets de UI que não são escritos em React. Por exemplo, vamos dizer que você está adicionando um componente de mapa à sua página. Ele tem um método `setZoomLevel()`, e você gostaria de manter o nível de zoom em sincronia com uma variável de state `zoomLevel` em seu código React. Seu Effect pareceria similar a este:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Note que não há necessidade de limpeza neste caso. No desenvolvimento, React irá chamar o Effect duas vezes, mas isso não é um problema pois chamar `setZoomLevel` duas vezes com o mesmo valor não faz nada. Pode ser levemente mais lento, mas isso não importa porque não remontará desnecessariamente na produção.

Algumas APIs podem não permitir que você as chame duas vezes seguidas. Por exemplo, o método [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) do elemento embutido [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) lança um erro se você o chamar duas vezes. Implemente a função de limpeza e faça com que ela feche o diálogo:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

No desenvolvimento, seu Effect chamará `showModal()`, então imediatamente `close()`, e então `showModal()` novamente. Isto tem o mesmo comportamento visível ao usuário que chamar `showModal()` uma vez, como você veria na produção.

### Assinando eventos {/*subscribing-to-events*/}

Se seu Effect se inscreve (subscribe) em alguma coisa, a função de limpeza deve se desinscrever (unsubscribe):

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

No desenvolvimento, seu Effect chamará `addEventListener()`, então imediatamente `removeEventListener()`, e então `addEventListener()` novamente com o mesmo manipulador (handler). Então haverá somente uma inscrição ativa por vez. Isso tem o mesmo comportamento visível ao usuário que chamar `addEventListener()` uma vez, como na produção.

### Acionando animações {/*triggering-animations*/}

Se seu Effect anima alguma coisa, a função de limpeza deve redefinir a animação para os valores iniciais:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Acione a animação (Trigger the animation)
  return () => {
    node.style.opacity = 0; // Redefina para o valor inicial (Reset to the initial value)
  };
}, []);
```

No desenvolvimento, opacidade (opacity) sera definida como `1`, então para `0`, e então para `1` novamente. Isso deveria ter o mesmo comportamento visível ao usuário que defini-lo para `1` diretamente, que é o que aconteceria na produção. Se você usa uma biblioteca de animação de terceiros com suporte para tweening, sua função de limpeza deveria redefinir a linha do tempo para seu estado inicial.

### Buscando dados {/*fetching-data*/}

Se seu Effect busca alguma coisa, a função de limpeza deve ou [abortar a busca](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ou ignorar seu resultado:

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

Você não pode "desfazer" uma requisição de rede (network request) que já aconteceu, mas sua função de limpeza deve garantir que a busca que _não é mais relevante_ não continue afetando sua aplicação. Se o `userId` mudar de `'Alice'` para `'Bob'`, a limpeza garante que a resposta de `'Alice'` seja ignorada mesmo que ela chegue depois de `'Bob'`.

**No desenvolvimento, você verá duas buscas na aba Rede (Network).** Não há nada de errado com isso. Com a abordagem acima, o primeiro Effect será imediatamente limpo, então seu cópia da variável `ignore` será definida como `true`. Então, mesmo que haja uma requisição extra, ela não irá afetar o state graças à checagem `if (!ignore)`.

**Na produção, haverá somente uma requisição.** Se a segunda requisição no desenvolvimento estiver incomodando você, a melhor abordagem é usar uma solução que deduplica requisições e armazena os resultados em cache entre os componentes:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Isso não somente irá melhorar a experiência de desenvolvimento, mas também fará com que sua aplicação pareça mais rápida. Por exemplo, o usuário pressionando o botão Voltar (Back) não terá que esperar por alguns dados para carregar novamente porque eles estarão armazenados em cache. Você pode ou construir esse cache você mesmo ou usar uma das muitas alternativas às buscas manuais em Effects.

<DeepDive>

#### Quais são boas alternativas às buscas de dados em Effects? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Escrever chamadas `fetch` dentro de Effects é uma [maneira popular de buscar dados](https://www.robinwieruch.de/react-hooks-fetch-data/), especialmente em apps totalmente client-side. Essa é, entretanto, uma abordagem muito manual e tem desvantagens significativas:
- **Effects não são executados no servidor.** Isso significa que o HTML inicial renderizado no servidor só incluirá um estado de carregamento sem dados. O computador cliente precisará baixar todo o JavaScript e renderizar seu aplicativo apenas para descobrir que agora ele precisa carregar os dados. Isso não é muito eficiente.
- **Buscar diretamente em Effects facilita a criação de "cascatas de rede".** Você renderiza o componente pai, ele busca alguns dados, renderiza os componentes filhos e, em seguida, eles começam a buscar seus dados. Se a rede não for muito rápida, isso é significativamente mais lento do que buscar todos os dados em paralelo.
- **Buscar diretamente em Effects geralmente significa que você não pré-carrega ou armazena em cache os dados.** Por exemplo, se o componente for desmontado e depois for montado novamente, ele precisaria buscar os dados novamente.
- **Não é muito ergonômico.** Há uma quantidade considerável de código boilerplate envolvido ao escrever chamadas `fetch` de uma forma que não sofra com bugs como [condições de corrida.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Esta lista de desvantagens não é específica do React. Aplica-se à busca de dados na montagem com qualquer biblioteca. Como com o roteamento, a busca de dados não é trivial de se fazer bem, por isso recomendamos as seguintes abordagens:

- **Se você usa um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use seu mecanismo de busca de dados embutido.** Frameworks React modernos têm mecanismos de busca de dados integrados que são eficientes e não sofrem com as armadilhas acima.
- **Caso contrário, considere usar ou construir um cache no lado do cliente.** Soluções de código aberto populares incluem [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/) e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Você também pode criar sua própria solução, caso em que você usaria Effects por baixo dos panos, mas adicionaria lógica para deduplicar solicitações, armazenar respostas em cache e evitar cascatas de rede (pré-carregando dados ou içando requisitos de dados para rotas).

Você pode continuar buscando dados diretamente em Effects se nenhuma dessas abordagens for adequada para você.

</DeepDive>

### Enviando analytics {/*sending-analytics*/}

Considere este código que envia um evento analytics na visita da página:

```js
useEffect(() => {
  logVisit(url); // Envia uma requisição POST
}, [url]);
```

Em desenvolvimento, `logVisit` será chamado duas vezes para cada URL, então você pode ser tentado a tentar corrigir isso. **Recomendamos manter este código como está.** Como com os exemplos anteriores, não há diferença de comportamento *visível ao usuário* entre executá-lo uma vez e executá-lo duas vezes. Do ponto de vista prático, `logVisit` não deve fazer nada em desenvolvimento porque você não quer que os logs das máquinas de desenvolvimento distorçam as métricas de produção. Seu componente é remontado toda vez que você salva seu arquivo, então ele registra visitas extras em desenvolvimento de qualquer maneira.

**Na produção, não haverá logs de visitas duplicados.**

Para depurar os eventos analytics que você está enviando, você pode implantar seu aplicativo em um ambiente de teste (que é executado no modo de produção) ou desativar temporariamente o [Strict Mode](/reference/react/StrictMode) e seus testes de remontagem apenas para desenvolvimento. Você também pode enviar análises dos manipuladores de eventos de alteração de rota em vez de Effects. Para análises mais precisas, [observadores de interseção](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) podem ajudar a rastrear quais componentes estão na janela de visualização e por quanto tempo eles permanecem visíveis.

### Não é um Effect: Inicializando a aplicação {/*not-an-effect-initializing-the-application*/}

Alguma lógica só deve ser executada uma vez quando o aplicativo iniciar. Você pode colocá-la fora de seus componentes:

```js {2-3}
if (typeof window !== 'undefined') { // Verifica se estamos rodando no navegador.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Isso garante que essa lógica seja executada apenas uma vez após o navegador carregar a página.

### Não é um Effect: Comprando um produto {/*not-an-effect-buying-a-product*/}

Às vezes, mesmo que você escreva uma função de limpeza, não há como evitar as consequências visíveis ao usuário de executar o Effect duas vezes. Por exemplo, talvez seu Effect envie uma requisição POST como comprar um produto:

```js {2-3}
useEffect(() => {
  // 🔴 Errado: Esse Effect é disparado duas vezes em desenvolvimento, expondo um problema no código.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Você não gostaria de comprar o produto duas vezes. No entanto, é também por isso que você não deve colocar essa lógica em um Effect. E se o usuário for para outra página e depois pressionar Voltar? Seu Effect seria executado novamente. Você não quer comprar o produto quando o usuário *visita* uma página; você quer comprá-lo quando o usuário *clica* no botão Comprar.

Comprar não é causado por renderização; é causado por uma interação específica. Ele deve ser executado somente quando o usuário pressiona o botão. **Exclua o Effect e mova sua requisição `/api/buy` para o manipulador de eventos do botão Comprar:**

```js {2-3}
  function handleClick() {
    // ✅ Comprar é um evento porque é causado por uma interação específica.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Isso ilustra que, se a remontagem quebrar a lógica do seu aplicativo, isso geralmente revela bugs existentes.** Da perspectiva do usuário, visitar uma página não deve ser diferente de visitá-la, clicar em um link e, em seguida, pressionar Voltar para visualizar a página novamente. React verifica se seus componentes seguem este princípio remontando-os uma vez em desenvolvimento.

## Juntando tudo {/*putting-it-all-together*/}

Este playground pode ajudá-lo a "ter uma ideia" de como os Effects funcionam na prática.

Este exemplo usa [`setTimeout`](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout) para agendar um log de console com o texto de entrada para aparecer três segundos após a execução do Effect. A função de limpeza cancela o tempo limite pendente. Comece pressionando "Montar o componente":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Agendar "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancelar "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        O que registrar:{' '}
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

Você verá três logs no início: `Agendar "a" log`, `Cancelar "a" log` e `Agendar "a" log` novamente. Três segundos depois, também haverá um log dizendo `a`. Como você aprendeu antes, o par extra de agendar/cancelar é porque o React remonta o componente uma vez em desenvolvimento para verificar se você implementou a limpeza corretamente.

Agora edite a entrada para dizer `abc`. Se você fizer isso rápido o suficiente, verá `Agendar "ab" log` imediatamente seguido por `Cancelar "ab" log` e `Agendar "abc" log`. **React sempre limpa o Effect da renderização anterior antes do Effect da renderização seguinte.** É por isso que, mesmo que você digite na entrada rapidamente, há no máximo um tempo limite agendado por vez. Edite a entrada algumas vezes e observe o console para ter uma ideia de como os Effects são limpos.

Digite algo na entrada e, em seguida, pressione imediatamente "Desmontar o componente". Observe como a desmontagem limpa o Effect da última renderização. Aqui, ele limpa o último tempo limite antes que ele tenha a chance de ser disparado.

Finalmente, edite o componente acima e comente a função de limpeza para que os tempos limite não sejam cancelados. Tente digitar `abcde` rapidamente. O que você espera que aconteça em três segundos? `console.log(text)` dentro do tempo limite imprimirá o `text` *mais recente* e produzirá cinco logs `abcde`? Experimente para verificar sua intuição!

Três segundos depois, você deve ver uma sequência de logs (`a`, `ab`, `abc`, `abcd` e `abcde`) em vez de cinco logs `abcde`. **Cada Effect "captura" o valor `text` de sua renderização correspondente.**  Não importa que o estado `text` tenha mudado: um Effect da renderização com `text = 'ab'` sempre verá `'ab'`. Em outras palavras, os Effects de cada renderização são isolados uns dos outros. Se você está curioso sobre como isso funciona, você pode ler sobre [closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures).

<DeepDive>

#### Cada renderização tem seus próprios Effects {/*each-render-has-its-own-effects*/}

Você pode pensar em `useEffect` como "anexar" um pedaço de comportamento à saída da renderização. Considere este Effect:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Bem-vindo(a) ao {roomId}!</h1>;
}
```

Vamos ver o que exatamente acontece conforme o usuário navega pelo aplicativo.

#### Renderização inicial {/*initial-render*/}

O usuário acessa `<ChatRoom roomId="general" />`. Vamos [substituir mentalmente](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` por `'general'`:

```js
  // JSX para a primeira renderização (roomId = "general")
  return <h1>Bem-vindo(a) ao general!</h1>;
```

**O Effect é *também* uma parte da saída da renderização.** O Effect da primeira renderização se torna:

```js
  // Effect para a primeira renderização (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a primeira renderização (roomId = "general")
  ['general']
```

React executa este Effect, que se conecta à sala de bate-papo `'general'`.

#### Re-renderizar com as mesmas dependências {/*re-render-with-same-dependencies*/}

Digamos que `<ChatRoom roomId="general" />` re-renderize. A saída JSX é a mesma:

```js
  // JSX para a segunda renderização (roomId = "general")
  return <h1>Bem-vindo(a) ao general!</h1>;
```

React vê que a saída da renderização não mudou, então ele não atualiza o DOM.

O Effect da segunda renderização se parece com isto:

```js
  // Effect para a segunda renderização (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a segunda renderização (roomId = "general")
  ['general']
```

React compara `['general']` da segunda renderização com `['general']` da primeira renderização. **Como todas as dependências são as mesmas, React *ignora* o Effect da segunda renderização.** Ele nunca é chamado.

#### Re-renderizar com dependências diferentes {/*re-render-with-different-dependencies*/}

Então, o usuário acessa `<ChatRoom roomId="travel" />`. Desta vez, o componente retorna um JSX diferente:

```js
  // JSX para a terceira renderização (roomId = "travel")
  return <h1>Bem-vindo(a) ao travel!</h1>;
```

React atualiza o DOM para mudar `"Bem-vindo(a) ao general"` para `"Bem-vindo(a) ao travel"`.

O Effect da terceira renderização se parece com isto:

```js
  // Effect para a terceira renderização (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependências para a terceira renderização (roomId = "travel")
  ['travel']
```

React compara `['travel']` da terceira renderização com `['general']` da segunda renderização. Uma dependência é diferente: `Object.is('travel', 'general')` é `false`. O Effect não pode ser ignorado.

**Antes que o React possa aplicar o Effect da terceira renderização, ele precisa limpar o último Effect que _foi_ executado.** O Effect da segunda renderização foi ignorado, então React precisa limpar o Effect da primeira renderização. Se você rolar para cima até a primeira renderização, você verá que sua limpeza chama `disconnect()` na conexão que foi criada com `createConnection('general')`. Isso desconecta o aplicativo da sala de bate-papo `'general'`.

Depois disso, React executa o Effect da terceira renderização. Ele se conecta à sala de bate-papo `'travel'`.

#### Desmontar {/*unmount*/}

Finalmente, digamos que o usuário navegue para longe e o componente `ChatRoom` seja desmontado. React executa a função de limpeza do último Effect. O último Effect foi da terceira renderização. A limpeza da terceira renderização destrói a conexão `createConnection('travel')`. Assim, o aplicativo se desconecta da sala `'travel'`.

#### Comportamentos apenas para desenvolvimento {/*development-only-behaviors*/}

Quando o [Strict Mode](/reference/react/StrictMode) está ativado, o React remonta cada componente uma vez após a montagem (o estado e o DOM são preservados). Isso [ajuda você a encontrar Effects que precisam de limpeza](#step-3-add-cleanup-if-needed) e expõe bugs como condições de corrida no início. Além disso, React remontará os Effects sempre que você salvar um arquivo em desenvolvimento. Ambos os comportamentos são apenas para desenvolvimento.

</DeepDive>

<Recap>

- Ao contrário dos eventos, os Effects são causados pela própria renderização, em vez de uma interação específica.
- Effects permitem que você sincronize um componente com algum sistema externo (API de terceiros, rede, etc.).
- Por padrão, os Effects são executados após cada renderização (incluindo a inicial).
- React ignorará o Effect se todas as suas dependências tiverem os mesmos valores que durante a última renderização.
- Você não pode "escolher" suas dependências. Elas são determinadas pelo código dentro do Effect.
- Uma matriz de dependência vazia (`[]`) corresponde à "montagem" do componente, ou seja, sendo adicionado à tela.
- No Strict Mode, React monta componentes duas vezes (somente em desenvolvimento!) para testar seus Effects.
- Se seu Effect quebrar por causa da remontagem, você precisa implementar uma função de limpeza.
- React chamará sua função de limpeza antes que o Effect seja executado da próxima vez e durante a desmontagem.

</Recap>

<Challenges>

#### Focar um campo na montagem {/*focus-a-field-on-mount*/}

Neste exemplo, o formulário renderiza um componente `<MyInput />`.

Use o método [`focus()`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/focus) da entrada para fazer com que `MyInput` foque automaticamente quando ele aparecer na tela. Já existe uma implementação comentada, mas ela não funciona muito bem. Descubra por que não funciona e corrija-a. (Caso você esteja familiarizado com o atributo `autoFocus`, finja que ele não existe: estamos reimplementando a mesma funcionalidade do zero.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} formulário</button>
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
            Deixar em maiúsculas
          </label>
          <p>Olá, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}```css
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

Para verificar se sua solução funciona, pressione "Mostrar formulário" e verifique se a entrada recebe o foco (fica realçada e o cursor é colocado dentro). Pressione "Ocultar formulário" e "Mostrar formulário" novamente. Verifique se a entrada é realçada novamente.

`MyInput` deve focar _no momento da montagem_ e não após cada renderização. Para verificar se o comportamento está correto, pressione "Mostrar formulário" e, em seguida, pressione repetidamente a caixa de seleção "Tornar maiúsculo". Clicar na caixa de seleção _não_ deve focar a entrada acima dela.

<Solution>

Chamar `ref.current.focus()` durante a renderização está errado porque é um *efeito colateral*. Efeitos colaterais devem ser colocados dentro de um manipulador de eventos ou ser declarados com `useEffect`. Nesse caso, o efeito colateral é _causado_ pelo aparecimento do componente, em vez de qualquer interação específica, por isso faz sentido colocá-lo em um Effect (Efeito).

Para corrigir o erro, envolva a chamada `ref.current.focus()` em uma declaração de Effect. Em seguida, para garantir que esse Effect seja executado somente na montagem, em vez de após cada renderização, adicione as dependências `[]` vazias a ele.

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} formulário</button>
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
            Tornar maiúsculo
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

Pressione "Mostrar formulário" e observe que o segundo campo recebe foco automaticamente. Isso ocorre porque ambos os componentes `<MyInput />` tentam focar o campo dentro. Quando você chama `focus()` para dois campos de entrada em sequência, o último sempre "vence".

Digamos que você queira focar o primeiro campo. O primeiro componente `MyInput` agora recebe uma prop booleana `shouldFocus` definida como `true`. Altere a lógica para que `focus()` seja chamado somente se a prop `shouldFocus` recebida por `MyInput` for `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: chamar focus() somente se shouldFocus for true.
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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} formulário</button>
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

Para verificar sua solução, pressione "Mostrar formulário" e "Ocultar formulário" repetidamente. Quando o formulário aparecer, somente a *primeira* entrada deve receber foco. Isso ocorre porque o componente pai renderiza a primeira entrada com `shouldFocus={true}` e a segunda entrada com `shouldFocus={false}`. Verifique também se ambas as entradas ainda funcionam e você pode digitar em ambas.

<Hint>

Você não pode declarar um Effect condicionalmente, mas seu Effect pode incluir lógica condicional.

</Hint>

<Solution>

Coloque a lógica condicional dentro do Effect (Efeito). Você precisará especificar `shouldFocus` como uma dependência, pois está usando-o dentro do Effect. (Isso significa que, se o `shouldFocus` de alguma entrada mudar de `false` para `true`, ele focará após a montagem.)

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} formulário</button>
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

Este componente `Counter` exibe um contador que deve ser incrementado a cada segundo. Na montagem, ele chama [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) Isso faz com que `onTick` seja executado a cada segundo. A função `onTick` incrementa o contador.

No entanto, em vez de ser incrementado uma vez por segundo, ele é incrementado duas vezes. Por que isso acontece? Encontre a causa do erro e corrija-o.

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} contador</button>
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

Quando o [Strict Mode](/reference/react/StrictMode) está ativado (como nos sandboxes neste site), o React remontará cada componente uma vez no desenvolvimento. Isso faz com que o intervalo seja configurado duas vezes, e é por isso que a cada segundo o contador é incrementado duas vezes.

No entanto, o comportamento do React não é a *causa* do bug: o bug já existe no código. O comportamento do React torna o bug mais perceptível. A causa real é que este Effect (Efeito) inicia um processo, mas não fornece uma maneira de limpá-lo.

Para corrigir este código, salve o ID do intervalo retornado por `setInterval` e implemente uma função de limpeza com [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'} contador</button>
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

No desenvolvimento, o React ainda remontará seu componente uma vez para verificar se você implementou bem a limpeza. Então, haverá uma chamada `setInterval`, seguida imediatamente por `clearInterval` e `setInterval` novamente. Na produção, haverá apenas uma chamada `setInterval`. O comportamento visível pelo usuário em ambos os casos é o mesmo: o contador é incrementado uma vez por segundo.

</Solution>

#### Corrigir a busca dentro de um Effect (Efeito) {/*fix-fetching-inside-an-effect*/}

Este componente mostra a biografia da pessoa selecionada. Ele carrega a biografia chamando uma função assíncrona `fetchBio(person)` na montagem e sempre que `person` muda. Essa função assíncrona retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) que eventualmente resolve para uma string. Quando a busca é concluída, ela chama `setBio` para exibir essa string sob a caixa de seleção.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
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

Há um erro neste código. Comece selecionando "Alice". Em seguida, selecione "Bob" e, imediatamente após isso, selecione "Taylor". Se você fizer isso rápido o suficiente, notará o erro: Taylor está selecionado, mas o parágrafo abaixo diz "Esta é a biografia de Bob".

Por que isso acontece? Corrija o erro dentro deste Effect (Efeito).

<Hint>

Se um Effect (Efeito) busca algo de forma assíncrona, geralmente precisa de limpeza.

</Hint>

<Solution>

Para acionar o bug, as coisas precisam acontecer nesta ordem:

- Selecionar `'Bob'` aciona `fetchBio('Bob')`
- Selecionar `'Taylor'` aciona `fetchBio('Taylor')`
- **Buscar `'Taylor'` é concluído *antes* de buscar `'Bob'`**
- O Effect (Efeito) da renderização de `'Taylor'` chama `setBio('This is Taylor’s bio')` (Esta é a biografia de Taylor)
- Buscar `'Bob'` é concluído
- O Effect (Efeito) da renderização de `'Bob'` chama `setBio('This is Bob’s bio')` (Esta é a biografia de Bob)

É por isso que você vê a biografia de Bob, embora Taylor esteja selecionado. Bugs como esse são chamados de [condições de corrida](https://pt.wikipedia.org/wiki/Condi%C3%A7%C3%A3o_de_corrida) porque duas operações assíncronas estão "competindo" entre si e podem chegar em uma ordem inesperada.

Para corrigir essa condição de corrida, adicione uma função de limpeza:

<Sandpack>

```js src/App.js
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

O Effect (Efeito) de cada renderização tem sua própria variável `ignore`. Inicialmente, a variável `ignore` está definida como `false`. No entanto, se um Effect (Efeito) for limpo (como quando você seleciona uma pessoa diferente), sua variável `ignore` se tornará `true`. Portanto, agora não importa em que ordem as solicitações são concluídas. Somente o Effect (Efeito) da última pessoa terá `ignore` definido como `false`, portanto, ele chamará `setBio(result)`. Os Effects (Efeitos) anteriores foram limpos, portanto, a verificação `if (!ignore)` impedirá que eles chamem `setBio`:

- Selecionar `'Bob'` aciona `fetchBio('Bob')`
- Selecionar `'Taylor'` aciona `fetchBio('Taylor')` **e limpa o Effect (Efeito) anterior (de Bob)**
- Buscar `'Taylor'` é concluído *antes* de buscar `'Bob'`
- O Effect (Efeito) da renderização de `'Taylor'` chama `setBio('This is Taylor’s bio')` (Esta é a biografia de Taylor)
- Buscar `'Bob'` é concluído
- O Effect (Efeito) da renderização de `'Bob'` **não faz nada porque sua flag `ignore` foi definida como `true`**

Além de ignorar o resultado de uma chamada de API desatualizada, você também pode usar [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) para cancelar as solicitações que não são mais necessárias. No entanto, por si só, isso não é suficiente para proteger contra condições de corrida. Mais etapas assíncronas podem ser encadeadas após a busca, portanto, o uso de um flag explícito como `ignore` é a maneira mais confiável de corrigir esse tipo de problema.

</Solution>

</Challenges>