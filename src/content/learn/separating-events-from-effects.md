---
title: 'Separating Events from Effects'
---

<Intro>

Os manipuladores de eventos só são executados novamente quando você executa a mesma interação novamente. Ao contrário dos manipuladores de eventos, os Efeitos resincronizam se algum valor que eles leem, como uma prop ou uma variável de estado, for diferente do que era durante a última renderização. Às vezes, você também deseja uma mistura de ambos os comportamentos: um Efeito que é executado novamente em resposta a alguns valores, mas não a outros. Esta página ensinará como fazer isso.

</Intro>

<YouWillLearn>

- Como escolher entre um manipulador de eventos e um Efeito
- Por que os Efeitos são reativos e os manipuladores de eventos não são
- O que fazer quando você deseja que uma parte do código do seu Efeito não seja reativa
- O que são Eventos de Efeito e como extraí-los dos seus Efeitos
- Como ler as últimas props e estado dos Efeitos usando Eventos de Efeito

</YouWillLearn>

## Escolhendo entre manipuladores de eventos e Efeitos {/*choosing-between-event-handlers-and-effects*/}

Primeiro, vamos recapitular a diferença entre manipuladores de eventos e Efeitos.

Imagine que você está implementando um componente de sala de chat. Seus requisitos são os seguintes:

1. Seu componente deve se conectar automaticamente à sala de chat selecionada.
1. Quando você clicar no botão "Enviar", ele deve enviar uma mensagem para o chat.

Vamos dizer que você já implementou o código para eles, mas não tem certeza de onde colocá-lo. Você deve usar manipuladores de eventos ou Efeitos? Toda vez que você precisar responder a essa pergunta, considere [*por que* o código precisa ser executado.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Manipuladores de eventos são executados em resposta a interações específicas {/*event-handlers-run-in-response-to-specific-interactions*/}

Do ponto de vista do usuário, enviar uma mensagem deve acontecer *porque* o botão "Enviar" específico foi clicado. O usuário ficará bastante chateado se você enviar a mensagem em qualquer outro momento ou por qualquer outro motivo. É por isso que enviar uma mensagem deve ser um manipulador de eventos. Manipuladores de eventos permitem que você lide com interações específicas:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Com um manipulador de eventos, você pode ter certeza de que `sendMessage(message)` será executado *apenas* se o usuário pressionar o botão.

### Efeitos são executados sempre que a sincronização é necessária {/*effects-run-whenever-synchronization-is-needed*/}

Lembre-se de que você também precisa manter o componente conectado à sala de chat. Onde esse código vai?

O *motivo* para executar este código não é alguma interação específica. Não importa por que ou como o usuário navegou para a tela da sala de chat. Agora que eles estão olhando para ela e podem interagir com ela, o componente precisa permanecer conectado ao servidor de chat selecionado. Mesmo que o componente da sala de chat fosse a tela inicial do seu aplicativo, e o usuário não tivesse realizado nenhuma interação, você ainda precisaria se conectar. É por isso que é um Efeito:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Com este código, você pode ter certeza de que sempre haverá uma conexão ativa com o servidor de chat atualmente selecionado, *independentemente* das interações específicas realizadas pelo usuário. Se o usuário apenas abriu seu aplicativo, selecionou uma sala diferente ou navegou para outra tela e voltou, seu Efeito garantirá que o componente permanecerá *sincronizado* com a sala atualmente selecionada e se [reconectará sempre que for necessário.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Valores reativos e lógica reativa {/*reactive-values-and-reactive-logic*/}

Intuitivamente, você poderia dizer que os manipuladores de eventos são sempre acionados "manualmente", por exemplo, clicando em um botão. Efeitos, por outro lado, são "automáticos": eles são executados e reexecutados quantas vezes for necessário para permanecerem sincronizados.

Existe uma maneira mais precisa de pensar sobre isso.

Props, estado e variáveis declaradas dentro do corpo do seu componente são chamados de <CodeStep step={2}>valores reativos</CodeStep>. Neste exemplo, `serverUrl` não é um valor reativo, mas `roomId` e `message` são. Eles participam do fluxo de dados de renderização:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Valores reativos como esses podem mudar devido a uma re-renderização. Por exemplo, o usuário pode editar a `message` ou escolher um `roomId` diferente em um dropdown. Manipuladores de eventos e Efeitos respondem a mudanças de maneiras diferentes:

- **A lógica dentro dos manipuladores de eventos *não é reativa.*** Ela não será executada novamente, a menos que o usuário execute a mesma interação (por exemplo, um clique) novamente. Manipuladores de eventos podem ler valores reativos sem "reagir" às suas mudanças.
- **A lógica dentro dos Efeitos *é reativa.*** Se o seu Efeito ler um valor reativo, [você tem que especificá-lo como uma dependência.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Então, se uma re-renderização fizer com que esse valor mude, o React re-executará a lógica do seu Efeito com o novo valor.

Vamos revisitar o exemplo anterior para ilustrar essa diferença.

### A lógica dentro dos manipuladores de eventos não é reativa {/*logic-inside-event-handlers-is-not-reactive*/}

Dê uma olhada nesta linha de código. Essa lógica deve ser reativa ou não?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Do ponto de vista do usuário, **uma mudança na `message` *não* significa que eles querem enviar uma mensagem.** Isso apenas significa que o usuário está digitando. Em outras palavras, a lógica que envia uma mensagem não deve ser reativa. Ela não deve ser executada novamente apenas porque o <CodeStep step={2}>valor reativo</CodeStep> mudou. É por isso que ela pertence ao manipulador de eventos:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Manipuladores de eventos não são reativos, então `sendMessage(message)` só será executado quando o usuário clicar no botão Enviar.

### A lógica dentro dos Efeitos é reativa {/*logic-inside-effects-is-reactive*/}

Agora vamos voltar a estas linhas:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Do ponto de vista do usuário, **uma mudança no `roomId` *significa* que eles querem se conectar a uma sala diferente.** Em outras palavras, a lógica para se conectar à sala deve ser reativa. Você *quer* que essas linhas de código "acompanhem" o <CodeStep step={2}>valor reativo</CodeStep> e sejam executadas novamente se esse valor for diferente. É por isso que ela pertence a um Efeito:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Efeitos são reativos, então `createConnection(serverUrl, roomId)` e `connection.connect()` serão executados para cada valor distinto de `roomId`. Seu Efeito mantém a conexão de chat sincronizada com a sala atualmente selecionada.

## Extraindo lógica não reativa de Effects {/*extracting-non-reactive-logic-out-of-effects*/}

As coisas ficam mais complicadas quando você quer misturar lógica reativa com lógica não reativa.

Por exemplo, imagine que você quer mostrar uma notificação quando o usuário se conecta ao chat. Você lê o tema atual (escuro ou claro) das props para poder mostrar a notificação na cor correta:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

No entanto, `theme` é um valor reativo (ele pode mudar como resultado de uma re-renderização), e [todo valor reativo lido por um Effect deve ser declarado como sua dependência.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Agora você tem que especificar `theme` como uma dependência do seu Effect:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Todas as dependências declaradas
  // ...
```

Brinque com este exemplo e veja se consegue identificar o problema com a experiência do usuário:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Quando o `roomId` muda, o chat reconecta como você esperaria. Mas como `theme` também é uma dependência, o chat *também* reconecta toda vez que você alterna entre o tema escuro e o claro. Isso não é bom!

Em outras palavras, você *não* quer que esta linha seja reativa, mesmo que esteja dentro de um Effect (que é reativo):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Você precisa de uma maneira de separar essa lógica não reativa da lógica reativa do Effect ao redor dela.

### Declarando um Evento de Effect {/*declaring-an-effect-event*/}

Use um Hook especial chamado [`useEffectEvent`](/reference/react/useEffectEvent) para extrair essa lógica não reativa do seu Effect:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Aqui, `onConnected` é chamado de *Evento de Effect*. É uma parte da lógica do seu Effect, mas se comporta muito mais como um manipulador de eventos. A lógica dentro dele não é reativa e ele sempre "vê" os valores mais recentes de suas props e estado.

Agora você pode chamar o Evento de Effect `onConnected` de dentro do seu Effect:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Isso resolve o problema. Note que você teve que *remover* `theme` da lista de dependências do seu Effect, pois ele não é mais usado no Effect. Você também não precisa *adicionar* `onConnected` a ele, porque **Eventos de Effect não são reativos e devem ser omitidos das dependências.**

Verifique se o novo comportamento funciona como você esperaria:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Você pode pensar em Eventos de Effect como sendo muito semelhantes a manipuladores de eventos. A principal diferença é que os manipuladores de eventos são executados em resposta a interações do usuário, enquanto os Eventos de Effect são acionados por você a partir de Effects. Eventos de Effect permitem que você "quebre a corrente" entre a reatividade dos Effects e o código que não deve ser reativo.

### Lendo as últimas props e estado com Eventos de Effect {/*reading-latest-props-and-state-with-effect-events*/}

Eventos de Effect permitem corrigir muitos padrões onde você pode ser tentado a suprimir o linter de dependências.

Por exemplo, digamos que você tenha um Effect para registrar as visitas à página:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Mais tarde, você adiciona várias rotas ao seu site. Agora seu componente `Page` recebe uma prop `url` com o caminho atual. Você quer passar o `url` como parte da sua chamada `logVisit`, mas o linter de dependências reclama:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Pense sobre o que você quer que o código faça. Você *quer* registrar uma visita separada para URLs diferentes, pois cada URL representa uma página diferente. Em outras palavras, esta chamada `logVisit` *deve* ser reativa em relação ao `url`. É por isso que, neste caso, faz sentido seguir o linter de dependências e adicionar `url` como uma dependência:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora, digamos que você queira incluir o número de itens no carrinho de compras junto com cada visita à página:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Você usou `numberOfItems` dentro do Effect, então o linter pede para você adicioná-lo como dependência. No entanto, você *não* quer que a chamada `logVisit` seja reativa em relação a `numberOfItems`. Se o usuário colocar algo no carrinho de compras e `numberOfItems` mudar, isso *não significa* que o usuário visitou a página novamente. Em outras palavras, *visitar a página* é, em certo sentido, um "evento". Ele acontece em um momento preciso no tempo.

Divida o código em duas partes:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Todas as dependências declaradas
  // ...
}
```

Aqui, `onVisit` é um Evento de Effect. O código dentro dele não é reativo. É por isso que você pode usar `numberOfItems` (ou qualquer outro valor reativo!) sem se preocupar que isso fará com que o código circundante seja reexecutado em caso de mudanças.

Por outro lado, o Effect em si permanece reativo. O código dentro do Effect usa a prop `url`, então o Effect será reexecutado após cada re-renderização com um `url` diferente. Isso, por sua vez, chamará o Evento de Effect `onVisit`.

Como resultado, você chamará `logVisit` para cada mudança em `url`, e sempre lerá o `numberOfItems` mais recente. No entanto, se `numberOfItems` mudar por si só, isso não fará com que nenhum código seja reexecutado.

<Note>

Você pode estar se perguntando se poderia chamar `onVisit()` sem argumentos e ler o `url` dentro dele:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Isso funcionaria, mas é melhor passar explicitamente este `url` para o Evento de Effect. **Ao passar `url` como um argumento para o seu Evento de Effect, você está dizendo que visitar uma página com um `url` diferente constitui um "evento" separado da perspectiva do usuário.** O `visitedUrl` é uma *parte* do "evento" que aconteceu:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Como seu Evento de Effect explicitamente "pede" o `visitedUrl`, agora você não pode remover acidentalmente `url` das dependências do Effect. Se você remover a dependência `url` (fazendo com que visitas distintas à página sejam contadas como uma), o linter o alertará sobre isso. Você quer que `onVisit` seja reativo em relação ao `url`, então, em vez de ler o `url` internamente (onde não seria reativo), você o passa *do* seu Effect.

Isso se torna especialmente importante se houver alguma lógica assíncrona dentro do Effect:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Atrasar o registro de visitas
  }, [url]);
```

Aqui, `url` dentro de `onVisit` corresponde ao `url` *mais recente* (que pode já ter mudado), mas `visitedUrl` corresponde ao `url` que originalmente causou a execução deste Effect (e desta chamada `onVisit`).

</Note>

<DeepDive>

#### É aceitável suprimir o linter de dependências em vez disso? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Nos codebases existentes, você pode às vezes ver a regra de lint suprimida assim:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Evite suprimir o linter assim:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Recomendamos **nunca suprimir o linter**.

A primeira desvantagem de suprimir a regra é que o React não o alertará mais quando seu Effect precisar "reagir" a uma nova dependência reativa que você introduziu em seu código. No exemplo anterior, você adicionou `url` às dependências *porque* o React o lembrou de fazê-lo. Você não receberá mais tais lembretes para edições futuras desse Effect se desativar o linter. Isso leva a bugs.

Aqui está um exemplo de um bug confuso causado pela supressão do linter. Neste exemplo, a função `handleMove` deve ler o valor da variável de estado `canMove` atual para decidir se o ponto deve seguir o cursor. No entanto, `canMove` é sempre `true` dentro de `handleMove`.

Você consegue ver por quê?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


O problema com este código está em suprimir o linter de dependências. Se você remover a supressão, verá que este Effect deve depender da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Todo valor reativo deve ser especificado como dependência, ou ele pode potencialmente ficar desatualizado com o tempo!

O autor do código original "mentiu" para o React dizendo que o Effect não dependia (`[]`) de nenhum valor reativo. É por isso que o React não resincronizou o Effect após `canMove` ter mudado (e `handleMove` com ele). Como o React não resincronizou o Effect, o `handleMove` anexado como um listener é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, que é por que `handleMove` da renderização inicial sempre verá esse valor.

**Se você nunca suprimir o linter, nunca verá problemas com valores desatualizados.**

Com `useEffectEvent`, não há necessidade de "mentir" para o linter, e o código funciona como você esperaria:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Isso não significa que `useEffectEvent` seja *sempre* a solução correta. Você só deve aplicá-lo às linhas de código que você não quer que sejam reativas. Na sandbox acima, você não queria que o código do Effect fosse reativo em relação a `canMove`. É por isso que fez sentido extrair um Evento de Effect.

Leia [Removendo Dependências de Effect](/learn/removing-effect-dependencies) para outras alternativas corretas para suprimir o linter.

</DeepDive>

### Limitações dos Eventos de Effect {/*limitations-of-effect-events*/}

Os Eventos de Efeito são muito limitados em como você pode usá-los:

* **Chame-os apenas de dentro de Efeitos.**
* **Nunca os passe para outros componentes ou Hooks.**

Por exemplo, não declare e passe um Evento de Effect como este:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Evite: Passando Eventos de Efeito

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Precisa especificar "callback" nas dependências
}
```

Em vez disso, sempre declare Eventos de Efeito diretamente ao lado dos Efeitos que os utilizam:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Bom: Chamado apenas localmente dentro de um Efeito
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Não é necessário especificar "onTick" (um Evento de Effect) como dependência
}
```

Eventos de Efeito são "pedaços" não reativos do seu código de Efeito. Eles devem estar ao lado do Efeito que os utiliza.

<Recap>

- Manipuladores de eventos executam em resposta a interações específicas.
- Efeitos executam sempre que a sincronização é necessária.
- A lógica dentro de manipuladores de eventos não é reativa.
- A lógica dentro de Efeitos é reativa.
- Você pode mover lógica não reativa de Efeitos para Eventos de Efeito.
- Chame Eventos de Efeito apenas de dentro de Efeitos.
- Não passe Eventos de Efeito para outros componentes ou Hooks.

</Recap>

<Challenges>

#### Corrigir uma variável que não atualiza {/*fix-a-variable-that-doesnt-update*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual ela está aumentando é armazenado na variável de estado `increment`. Você pode controlar a variável `increment` com os botões de mais e menos.

No entanto, não importa quantas vezes você clique no botão de mais, o contador ainda é incrementado em um a cada segundo. O que está errado com este código? Por que `increment` é sempre igual a `1` dentro do código do Efeito? Encontre o erro e corrija-o.

<Hint>

Para corrigir este código, basta seguir as regras.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Como sempre, ao procurar por bugs em Efeitos, comece procurando por supressões de linter.

Se você remover o comentário de supressão, o React informará que o código deste Efeito depende de `increment`, mas você "mentiu" para o React ao afirmar que este Efeito não depende de nenhum valor reativo (`[]`). Adicione `increment` ao array de dependências:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Agora, quando `increment` mudar, o React resincronizará seu Efeito, o que reiniciará o intervalo.

</Solution>

#### Corrigir um contador congelado {/*fix-a-freezing-counter*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual ela está aumentando é armazenado na variável de estado `increment`, que você pode controlar com os botões de mais e menos. Por exemplo, tente pressionar o botão de mais nove vezes e observe que o `count` agora aumenta a cada segundo em dez, em vez de um.

Há um pequeno problema com esta interface de usuário. Você pode notar que, se você continuar pressionando os botões de mais ou menos mais rápido do que uma vez por segundo, o próprio timer parece pausar. Ele só retoma um segundo após a última vez que você pressionou qualquer um dos botões. Descubra por que isso está acontecendo e corrija o problema para que o timer marque *a cada* segundo sem interrupções.

<Hint>

Parece que o Efeito que configura o timer "reage" ao valor de `increment`. A linha que usa o valor atual de `increment` para chamar `setCount` realmente precisa ser reativa?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

O problema é que o código dentro do Efeito usa a variável de estado `increment`. Como ela é uma dependência do seu Efeito, cada mudança em `increment` faz com que o Efeito se resincronize, o que faz com que o intervalo seja limpo. Se você continuar limpando o intervalo antes que ele tenha a chance de disparar, parecerá que o timer parou.

Para resolver o problema, extraia um Evento de Effect `onTick` do Efeito:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Como `onTick` é um Evento de Effect, o código dentro dele não é reativo. A mudança em `increment` não aciona nenhum Efeito.

</Solution>

#### Corrigir um atraso não ajustável {/*fix-a-non-adjustable-delay*/}

Neste exemplo, você pode personalizar o atraso do intervalo. Ele é armazenado em uma variável de estado `delay` que é atualizada por dois botões. No entanto, mesmo que você pressione o botão "mais 100 ms" até que o `delay` seja de 1000 milissegundos (ou seja, um segundo), você notará que o timer ainda incrementa muito rapidamente (a cada 100 ms). É como se suas mudanças no `delay` fossem ignoradas. Encontre e corrija o bug.

<Hint>

O código dentro dos Eventos de Efeito não é reativo. Existem casos em que você *gostaria* que a chamada `setInterval` fosse reexecutada?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

O problema com o exemplo acima é que ele extraiu um Evento de Effect chamado `onMount` sem considerar o que o código realmente deveria fazer. Você só deve extrair Eventos de Efeito por um motivo específico: quando você quer tornar uma parte do seu código não reativa. No entanto, a chamada `setInterval` *deve* ser reativa em relação à variável de estado `delay`. Se o `delay` mudar, você quer configurar o intervalo do zero! Para corrigir este código, traga todo o código reativo de volta para dentro do Efeito:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Em geral, você deve desconfiar de funções como `onMount` que se concentram no *tempo* em vez do *propósito* de um trecho de código. Pode parecer "mais descritivo" no início, mas obscurece sua intenção. Como regra geral, os Eventos de Efeito devem corresponder a algo que acontece da perspectiva do *usuário*. Por exemplo, `onMessage`, `onTick`, `onVisit` ou `onConnected` são bons nomes de Eventos de Efeito. O código dentro deles provavelmente não precisaria ser reativo. Por outro lado, `onMount`, `onUpdate`, `onUnmount` ou `onAfterRender` são tão genéricos que é fácil colocar acidentalmente código que *deveria* ser reativo neles. É por isso que você deve nomear seus Eventos de Efeito com base no *que o usuário pensa que aconteceu*, não em quando algum código aconteceu de rodar.

</Solution>

#### Corrigir uma notificação atrasada {/*fix-a-delayed-notification*/}

Ao entrar em uma sala de chat, este componente exibe uma notificação. No entanto, ele não exibe a notificação imediatamente. Em vez disso, a notificação é artificialmente atrasada em dois segundos para que o usuário tenha a chance de olhar a UI.

Isso quase funciona, mas há um bug. Tente mudar o dropdown de "general" para "travel" e depois para "music" muito rapidamente. Se você fizer isso rápido o suficiente, verá duas notificações (como esperado!), mas ambas dirão "Welcome to music".

Corrija para que, ao mudar de "general" para "travel" e depois para "music" muito rapidamente, você veja duas notificações, a primeira sendo "Welcome to travel" e a segunda "Welcome to music". (Para um desafio adicional, assumindo que você *já* fez as notificações mostrarem as salas corretas, mude o código para que apenas a última notificação seja exibida.)

<Hint>

Seu Efeito sabe em qual sala ele se conectou. Existe alguma informação que você possa querer passar para o seu Evento de Effect?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Dentro do seu Evento de Effect, `roomId` é o valor *no momento em que o Evento de Effect foi chamado.*

Seu Evento de Effect é chamado com um atraso de dois segundos. Se você estiver alternando rapidamente da sala de viagens para a sala de música, quando a notificação da sala de viagens aparecer, `roomId` já será `"music"`. É por isso que ambas as notificações dizem "Welcome to music".

Para corrigir o problema, em vez de ler o `roomId` *mais recente* dentro do Evento de Effect, torne-o um parâmetro do seu Evento de Effect, como `connectedRoomId` abaixo. Em seguida, passe `roomId` do seu Efeito chamando `onConnected(roomId)`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

O Efeito que tinha `roomId` definido como `"travel"` (então conectou-se à sala `"travel"`) exibirá a notificação para `"travel"`. O Efeito que tinha `roomId` definido como `"music"` (então conectou-se à sala `"music"`) exibirá a notificação para `"music"`. Em outras palavras, `connectedRoomId` vem do seu Efeito (que é reativo), enquanto `theme` sempre usa o valor mais recente.

Para resolver o desafio adicional, salve o ID do timeout da notificação e limpe-o na função de limpeza do seu Efeito:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Isso garante que as notificações já agendadas (mas ainda não exibidas) sejam canceladas ao mudar de sala.

</Solution>

</Challenges>
