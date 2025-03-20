---
title: 'Separando Eventos de Efeitos'
---

<Intro>

Manipuladores de eventos só são executados novamente quando você realiza a mesma interação novamente. Diferente dos manipuladores de eventos, os Efeitos re-sincronizam se algum valor que eles leem, como uma prop ou uma variável de estado, for diferente do que era durante a última renderização. Às vezes, você também quer uma mistura dos dois comportamentos: um Efeito que roda novamente em resposta a alguns valores, mas não a outros. Esta página vai te ensinar como fazer isso.

</Intro>

<YouWillLearn>

- Como escolher entre um manipulador de eventos e um Efeito
- Por que os Efeitos são reativos e os manipuladores de eventos não são
- O que fazer quando você quer que uma parte do código do seu Efeito não seja reativa
- O que são Eventos de Efeito, e como extraí-los de seus Efeitos
- Como ler as últimas props e estado de Efeitos utilizando Eventos de Efeito

</YouWillLearn>

## Escolhendo entre manipuladores de eventos e Efeitos {/*choosing-between-event-handlers-and-effects*/}

Primeiramente, vamos recapitular a diferença entre manipuladores de eventos e Efeitos.

Imagine que você está implementando um componente de sala de bate-papo. Seus requisitos são estes:

1. Seu componente deve conectar-se automaticamente à sala de bate-papo selecionada.
1. Quando você clica no botão "Enviar", ele deve enviar uma mensagem para o bate-papo.

Digamos que você já implementou o código para eles, mas você não tem certeza de onde colocá-lo. Você deveria usar manipuladores de eventos ou Efeitos? Toda vez que você precisar responder a esta pergunta, considere [*por que* o código precisa rodar.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Manipuladores de eventos rodam em resposta a interações específicas {/*event-handlers-run-in-response-to-specific-interactions*/}

Da perspectiva do usuário, enviar uma mensagem deve acontecer *porque* o botão "Enviar" em particular foi clicado. O usuário ficará bem chateado se você enviar a mensagem em qualquer outro momento ou por qualquer outra razão. É por isso que enviar uma mensagem deve ser um manipulador de eventos. Manipuladores de eventos permitem que você lide com interações específicas:

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
      <button onClick={handleSendClick}>Enviar</button>
    </>
  );
}
```

Com um manipulador de eventos, você pode ter certeza de que `sendMessage(message)` vai *somente* rodar se o usuário pressionar o botão.

### Efeitos rodam sempre que a sincronização é necessária {/*effects-run-whenever-synchronization-is-needed*/}

Lembre-se de que você também precisa manter o componente conectado à sala de bate-papo. Onde esse código vai?

A *razão* para rodar este código não é alguma interação em particular. Não importa por que ou como o usuário navegou até a tela da sala de bate-papo. Agora que ele está olhando para ela e poderia interagir com ela, o componente precisa ficar conectado ao servidor de bate-papo selecionado. Mesmo se o componente da sala de chat fosse a tela inicial do seu aplicativo, e o usuário não tivesse realizado nenhuma interação, você *ainda* precisaria conectar. É por isso que é um Efeito:

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

Com este código, você pode ter certeza de que sempre há uma conexão ativa com o servidor de bate-papo atualmente selecionado, *independentemente* das interações específicas executadas pelo usuário. Seja o usuário apenas abrindo seu aplicativo, selecionando uma sala diferente ou navegando para outra tela e voltando, seu Efeito garante que o componente *permaneça sincronizado* com a sala atualmente selecionada, e [re-conectará sempre que for necessário.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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

Intuitivamente, você poderia dizer que manipuladores de eventos sempre são acionados "manualmente", por exemplo, clicando em um botão. Efeitos, por outro lado, são "automáticos": eles rodam e rodam novamente com a frequência necessária para permanecerem sincronizados.

Há uma maneira mais precisa de pensar sobre isto.

Props, estado e variáveis declaradas dentro do corpo do seu componente são chamadas de <CodeStep step={2}>valores reativos</CodeStep>. Neste exemplo, `serverUrl` não é um valor reativo, mas `roomId` e `message` são. Eles participam no fluxo de dados de renderização:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Valores reativos como estes podem mudar devido à uma nova renderização. Por exemplo, o usuário pode editar o `message` ou escolher um `roomId` diferente em um dropdown. Manipuladores de eventos e Efeitos respondem às mudanças de forma diferente:

- **A lógica dentro dos manipuladores de eventos *não é reativa.*** Ela não rodará novamente a menos que o usuário execute a mesma interação (por exemplo, um clique) novamente. Manipuladores de eventos podem ler valores reativos sem "reagir" às suas mudanças.
- **A lógica dentro dos Efeitos é *reativa.*** Se seu Efeito ler um valor reativo, [você precisa especificar ele como uma dependência.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Então, se uma nova renderização fizer com que esse valor mude, o React irá rodar novamente a lógica do seu Efeito com o novo valor.

Vamos revisitar o exemplo anterior para ilustrar esta diferença.

### Lógica dentro dos manipuladores de eventos não é reativa {/*logic-inside-event-handlers-is-not-reactive*/}

Dê uma olhada nesta linha de código. Essa lógica deveria ser reativa ou não?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Da perspectiva do usuário, **uma mudança para o `message` _não_ significa que ele quer enviar uma mensagem.** Significa apenas que o usuário está digitando. Em outras palavras, a lógica que envia uma mensagem não deve ser reativa. Ela não deve rodar novamente só porque o <CodeStep step={2}>valor reativo</CodeStep> mudou. É por isso que ela pertence no manipulador de eventos:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Manipuladores de eventos não são reativos, então `sendMessage(message)` só rodará quando o usuário clicar no botão Enviar.

### Lógica dentro dos Efeitos é reativa {/*logic-inside-effects-is-reactive*/}

Agora vamos retornar a estas linhas:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Da perspectiva do usuário, **uma mudança para o `roomId` *significa* que ele quer se conectar a uma sala diferente.** Em outras palavras, a lógica para se conectar à sala deve ser reativa. Você *quer* que estas linhas de código "acompanhem" o <CodeStep step={2}>valor reativo</CodeStep>, e que rodem novamente se esse valor for diferente. É por isso que ele pertence a um Efeito:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Efeitos são reativos, então `createConnection(serverUrl, roomId)` e `connection.connect()` rodarão para cada valor distinto de `roomId`. Seu Efeito mantém a conexão do bate-papo sincronizada com a sala atualmente selecionada.

## Extraindo lógica não reativa de Efeitos {/*extracting-non-reactive-logic-out-of-effects*/}

As coisas ficam mais complicadas quando você quer misturar lógica reativa com lógica não reativa.

Por exemplo, imagine que você quer mostrar uma notificação quando o usuário se conecta ao bate-papo. Você lê o tema atual (escuro ou claro) das props para que você possa mostrar a notificação na cor correta:

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

Entretanto, `theme` é um valor reativo (ele pode mudar como resultado de uma nova renderização), e [todo valor reativo lido por um Efeito deve ser declarado como sua dependência.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Agora você tem que especificar `theme` como uma dependência do seu Efeito:

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

Brinque com este exemplo e veja se você consegue identificar o problema com esta experiência do usuário:

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

Quando o `roomId` muda, o bate-papo re-conecta como você esperaria. Mas como `theme` também é uma dependência, o bate-papo *também* re-conecta toda vez que você alterna entre o tema escuro e o tema claro. Isso não é bom!

Em outras palavras, você *não* quer que esta linha seja reativa, mesmo que ela esteja dentro de um Efeito (que é reativo):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Você precisa de um modo de separar esta lógica não reativa do Efeito reativo ao redor dela.

### Declarando um Evento de Efeito {/*declaring-an-effect-event*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Use um Hook especial chamado [`useEffectEvent`](/reference/react/experimental_useEffectEvent) para extrair essa lógica não reativa de seu Efeito:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Aqui, `onConnected` é chamado de um *Evento de Efeito.* É uma parte da lógica do seu Efeito, mas ela se comporta muito mais como um manipulador de eventos. A lógica dentro dela não é reativa, e ela sempre "vê" os últimos valores de suas props e estado.

Agora você pode chamar o Evento de Efeito `onConnected` de dentro do seu Efeito:

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

Isso resolve o problema. Note que você teve que *remover* `onConnected` da lista de dependências do seu Efeito. **Eventos de Efeito não são reativos e devem ser omitidos das dependências.**

Verifique se o novo comportamento funciona como você esperaria:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';
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

Você pode pensar nos Eventos de Efeito como sendo muito similares aos manipuladores de eventos. A principal diferença é que os manipuladores de eventos rodam em resposta a interações do usuário, enquanto os Eventos de Efeito são acionados por você de Efeitos. Eventos de Efeito permitem que você "quebre a cadeia" entre a reatividade dos Efeitos e o código que não deveria ser reativo.

### Lendo as últimas props e estado com Eventos de Efeito {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Eventos de Efeito permitem que você conserte muitos padrões onde você pode ser tentado a suprimir o linter de dependência.

Por exemplo, diga que você tem um Efeito para registrar as visitas da página:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Mais tarde, você adiciona múltiplas rotas ao seu site. Agora seu componente `Page` recebe uma prop `url` com o caminho atual. Você quer passar a `url` como parte de sua chamada `logVisit`, mas o linter de dependência reclama:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Pense sobre o que você quer que o código faça. Você *quer* registrar uma visita separada para URLs diferentes, já que cada URL representa uma página diferente. Em outras palavras, esta chamada `logVisit` *deveria* ser reativa em relação à `url`. É por isso que, neste caso, faz sentido seguir o linter de dependência, e adicionar `url` como uma dependência:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora, digamos que você quer inlcuir o número de itens no carrinho de compras juntamente com cada visita à página:

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

Você usou `numberOfItems` dentro do Efeito, então o linter pede que você adicione ele como uma dependência. Entretanto, você *não* quer que a chamada `logVisit` seja reativa em relação à `numberOfItems`. Se o usuário coloca algo no carrinho de compras, e o `numberOfItems` muda, isso *não significa* que o usuário visitou a página novamente. Em outras palavras, *visitar a página* é, em certo sentido, um "evento". Ele acontece em um momento preciso no tempo.

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

Aqui, `onVisit` é um Evento de Efeito. O código dentro dele não é reativo. É por isso que você pode usar `numberOfItems` (ou qualquer outro valor reativo!) sem se preocupar que isso fará com que o código ao redor re-execute nas mudanças.

Por outro lado, o próprio Efeito permanece reativo. Código dentro do Efeito usa a prop `url`, então o Efeito irá rodar novamente após cada nova renderização com um `url` diferente. Isso, por sua vez, irá chamar o Evento de Efeito `onVisit`.

Como resultado, você irá chamar `logVisit` para cada mudança para a `url`, e sempre ler a última `numberOfItems`. Entretanto, se `numberOfItems` mudar por conta própria, isso não fará com que nenhum dos códigos seja executado novamente.

<Note>

Você pode estar se perguntando se você poderia chamar `onVisit()` sem argumentos, e ler a `url` dentro dele:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Isso funcionaria, mas é melhor passar esta `url` para o Evento de Efeito explicitamente. **Ao passar a `url` como um argumento para seu Evento de Efeito, você está dizendo que visitar uma página com um `url` diferente constitui um "evento" separado da perspectiva do usuário.** A `visitedUrl` é uma *parte* do "evento" que aconteceu:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Como seu Evento de Efeito explicitamente "pede" pela `visitedUrl`, agora você não pode remover acidentalmente a `url` das dependências do Efeito. Se você remover a dependência `url` (fazendo com que visitas à página distintas sejam contadas como uma), o linter irá avisá-lo sobre isso. Você quer que `onVisit` seja reativo em relação à `url`, então em vez de ler a `url` dentro (onde ela não seria reativa), você a passa *de* seu Efeito.

Isso se torna especialmente importante se houver alguma lógica assíncrona dentro do Efeito:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Aqui, `url` dentro de `onVisit` corresponde à *última* `url` (que poderia já ter mudado), mas `visitedUrl` corresponde à `url` que originalmente fez com que este Efeito (e esta chamada `onVisit`) rodasse.

</Note>

<DeepDive>

#### É aceitável suprimir o linter de dependência em vez disso? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Nos códigos base existentes, você pode às vezes ver a regra de lint suprimida desta maneira:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Depois que `useEffectEvent` se tornar uma parte estável do React, nós recomendamos **nunca suprimir o linter**.

A primeira desvantagem de suprimir a regra é que o React não irá mais avisá-lo quando seu Efeito precisar "reagir" a uma nova dependência reativa que você introduziu ao seu código. No exemplo anterior, você adicionou `url` às dependências *porque* o React te lembrou de fazê-lo. Você não irá mais receber tais lembretes para quaisquer edições futuras para aquele Efeito se você desabilitar o linter. Isso leva a erros (*bugs*).

Aqui está um exemplo de um *bug* confuso causado pela supressão do linter. Neste exemplo, a função `handleMove` é suposta ler o valor atual da variável de estado `canMove` para decidir se o ponto deveria seguir o cursor. Entretanto, `canMove` é sempre `true` dentro de `handleMove`.

Você consegue ver por quê?

<Sandpack>

```js
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

O problema com este código está em suprimir o linter de dependência. Se você remover a supressão, você verá que este Efeito deveria depender da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Cada valor reativo deve ser especificado como uma dependência, ou ele pode potencialmente ficar obsoleto com o tempo!

O autor do código original "mentiu" para o React dizendo que o Efeito não depende (`[]`) de nenhum valor reativo. É por isso que o React não re-sincronizou o Efeito depois que `canMove` mudou (e `handleMove` com ele). Como o React não re-sincronizou o Efeito, o `handleMove` anexado como um listener é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, que é por que `handleMove` da renderização inicial sempre verá aquele valor.

**Se você nunca suprimir o linter, você nunca verá problemas com valores obsoletos.**

Com `useEffectEvent`, não há necessidade de "mentir" para o linter, e o código funciona como você esperaria:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';

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

Isso não significa que `useEffectEvent` é *sempre* a solução correta. Você só deve aplicá-lo às linhas de código que não deseja que sejam reativas. No sandbox acima, você não queria que o código do Effect fosse reativo em relação a `canMove`. É por isso que fez sentido extrair um Evento de Effect.

Leia [Removendo as Dependências de Effect](/learn/removing-effect-dependencies) para outras alternativas corretas para suprimir o linter.

</DeepDive>

### Limitações dos Eventos de Effect {/*limitations-of-effect-events*/}

<Wip>

Essa seção descreve um **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Os Eventos de Effect são muito limitados em como você pode usá-los:

*   **Apenas chame-os de dentro de Effects.**
*   **Nunca os passe para outros componentes ou Hooks.**

Por exemplo, não declare e passe um Evento de Effect assim:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Evitar: Passando Eventos de Effect

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

Em vez disso, sempre declare os Eventos de Effect diretamente próximos aos Effects que os usam:

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
      onTick(); // ✅ Bom: Chamado apenas localmente dentro de um Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Não há necessidade de especificar "onTick" (um Evento de Effect) como uma dependência
}
```

Os Eventos de Effect são "pedaços" não reativos do código do seu Effect. Eles devem estar próximos ao Effect que os usa.

<Recap>

-   Os manipuladores de eventos são executados em resposta a interações específicas.
-   Effects são executados sempre que a sincronização é necessária.
-   A lógica dentro dos manipuladores de eventos não é reativa.
-   A lógica dentro dos Effects é reativa.
-   Você pode mover a lógica não reativa dos Effects para os Eventos de Effect.
-   Apenas chame os Eventos de Effect de dentro de Effects.
-   Não passe os Eventos de Effect para outros componentes ou Hooks.

</Recap>

<Challenges>

#### Consertar uma variável que não atualiza {/*fix-a-variable-that-doesnt-update*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual ela está aumentando é armazenado na variável de estado `increment`. Você pode controlar a variável `increment` com os botões de mais e menos.

No entanto, não importa quantas vezes você clique no botão de mais, o contador ainda incrementa em um a cada segundo. O que há de errado com este código? Por que `increment` é sempre igual a `1` dentro do código do Effect? Encontre o erro e corrija-o.

<Hint>

Para consertar este código, é suficiente seguir as regras.

</Hint>

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

Como sempre, quando você estiver procurando por erros em Effects, comece procurando por supressões de linter.

Se você remover o comentário de supressão, o React informará que o código deste Effect depende de `increment`, mas você "mentiu" para o React ao afirmar que este Effect não depende de nenhum valor reativo (`[]`). Adicione `increment` à matriz de dependência:

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

Agora, quando `increment` muda, o React ressincronizará seu Effect, o que reiniciará o intervalo.

</Solution>

#### Consertar um contador congelante {/*fix-a-freezing-counter*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual ela está aumentando é armazenado na variável de estado `increment`, que você pode controlá-lo com os botões de mais e menos. Por exemplo, tente pressionar o botão de mais nove vezes e observe que o `count` agora aumenta a cada segundo em dez, em vez de um.

Há um pequeno problema com esta interface do usuário. Você pode notar que, se continuar pressionando os botões de mais ou menos mais rápido do que uma vez por segundo, o próprio temporizador parece pausar. Ele só é reiniciado após um segundo ter passado desde a última vez que você pressionou qualquer um dos botões. Descubra por que isso está acontecendo e corrija o problema para que o temporizador marque a cada segundo sem interrupções.

<Hint>

Parece que o Effect que configura o temporizador "reage" ao valor `increment`. A linha que usa o valor atual de `increment` para chamar o `setCount` realmente precisa ser reativa?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';

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

O problema é que o código dentro do Effect usa a variável de estado `increment`. Como é uma dependência do seu Effect, cada alteração em `increment` faz com que o Effect se ressincronize, o que faz com que o intervalo seja limpo. Se você continuar limpando o intervalo toda vez antes que ele tenha a chance de disparar, parecerá que o temporizador paralisou.

Para resolver o problema, extraia um Evento de Effect `onTick` do Effect:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';

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

Como `onTick` é um Evento de Effect, o código dentro dele não é reativo. A alteração em `increment` não aciona nenhum Effect.

</Solution>

#### Corrigir um atraso não ajustável {/*fix-a-non-adjustable-delay*/}

Neste exemplo, você pode personalizar o atraso do intervalo. Ele é armazenado em uma variável de estado `delay`, que é atualizada por dois botões. No entanto, mesmo se você pressionar o botão "mais 100 ms" até que o `delay` seja 1000 milissegundos (ou seja, um segundo), você notará que o temporizador ainda aumenta muito rápido (a cada 100 ms). É como se as suas alterações no `delay` fossem ignoradas. Encontre e corrija o erro.

<Hint>

O código dentro dos Eventos de Effect não é reativo. Existem casos em que você *deseja* que a chamada `setInterval` seja executada novamente?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';

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

O problema com o exemplo acima é que ele extraiu um Evento de Effect chamado `onMount` sem considerar o que o código deveria realmente estar fazendo. Você só deve extrair Eventos de Effect por uma razão específica: quando deseja tornar uma parte do seu código não reativa. No entanto, a chamada `setInterval` *deve* ser reativa em relação à variável de estado `delay`. Se o `delay` mudar, você deseja configurar o intervalo do zero! Para corrigir este código, puxe todo o código reativo de volta para dentro do Effect:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';

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

Em geral, você deve desconfiar de funções como `onMount` que se concentram no *tempo* em vez do *propósito* de um trecho de código. Pode parecer "mais descritivo" a princípio, mas obscurece sua intenção. Como regra geral, os Eventos de Effect devem corresponder a algo que acontece da perspectiva do *usuário*. Por exemplo, `onMessage`, `onTick`, `onVisit` ou `onConnected` são bons nomes de Eventos de Effect. O código dentro deles provavelmente não precisaria ser reativo. Por outro lado, `onMount`, `onUpdate`, `onUnmount` ou `onAfterRender` são tão genéricos que é fácil colocar acidentalmente código que *deveria* ser reativo neles. É por isso que você deve nomear seus Eventos de Effect após *o que o usuário acha que aconteceu*, em vez de quando algum código aconteceu de ser executado.

</Solution>

#### Consertar uma notificação atrasada {/*fix-a-delayed-notification*/}

Quando você entra em uma sala de bate-papo, este componente mostra uma notificação. No entanto, ela não mostra a notificação imediatamente. Em vez disso, a notificação é artificialmente atrasada em dois segundos para que o usuário tenha a chance de olhar ao redor da UI.

Isso quase funciona, mas há um bug. Tente alterar o dropdown de "general" para "travel" e, em seguida, para "music" muito rapidamente. Se você fizer isso rápido o suficiente, verá duas notificações (como esperado!), mas *ambas* dirão "Bem-vindo ao music".

Corrija-o para que, quando você alternar de "general" para "travel" e, em seguida, para "music" muito rapidamente, veja duas notificações, a primeira sendo "Bem-vindo ao travel" e a segunda sendo "Bem-vindo ao music". (Para um desafio adicional, supondo que você *já* tenha feito as notificações mostrarem as salas corretas, altere o código para que somente a última notificação seja exibida.)

<Hint>

Seu Effect sabe em qual sala ele se conectou. Há alguma informação que você pode querer passar para seu Evento de Effect?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';
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
        Escolha a sala de bate-papo:{' '}
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
        Use tema escuro
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

Dentro do seu Evento de Effect, `roomId` é o valor *no momento em que o Evento de Effect foi chamado*.

Seu Evento de Effect é chamado com um atraso de dois segundos. Se você estiver alternando rapidamente da sala de viagens para a sala de música, no momento em que a notificação da sala de viagens for exibida, o `roomId` já será `"music"`. É por isso que ambas as notificações dizem "Bem-vindo ao music".

Para corrigir o problema, em vez de ler o `roomId` *mais recente* dentro do Evento de Effect, torne-o um parâmetro do seu Evento de Effect, como `connectedRoomId` abaixo. Em seguida, passe o `roomId` do seu Effect chamando `onConnected(roomId)`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';
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
        Escolha a sala de bate-papo:{' '}
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
        Use tema escuro
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

O Effect que tinha `roomId` definido como `"travel"` (então ele se conectou à sala `"travel"`) exibirá a notificação para `"travel"`. O Effect que tinha `roomId` definido como `"music"` (então ele se conectou à sala `"music"`) exibirá a notificação para `"music"`. Em outras palavras, `connectedRoomId` vem do seu Effect (que é reativo), enquanto `theme` sempre usa o valor mais recente.

Para resolver o desafio adicional, salve o ID de tempo limite da notificação e limpe-o na função de limpeza do seu Effect:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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
import { experimental_useEffectEvent as useEffectEvent } from 'react';
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
        Escolha a sala de bate-papo:{' '}
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
        Use tema escuro
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

Isso garante que as notificações já agendadas (mas ainda não exibidas) sejam canceladas quando você muda de sala.

</Solution>

</Challenges>
