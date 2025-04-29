---
title: 'Separando Eventos de Efeitos'
---

<Intro>

Manipuladores de eventos só são executados novamente quando você realiza a mesma interação novamente. Ao contrário dos manipuladores de eventos, os Efeitos são re-sincronizados se algum valor que eles leem, como uma prop ou uma variável de estado, for diferente do que era durante a última renderização. Às vezes, você também quer uma mistura de ambos os comportamentos: um Efeito que é executado em resposta a alguns valores, mas não a outros. Esta página ensinará como fazer isso.

</Intro>

<YouWillLearn>

- Como escolher entre um manipulador de eventos e um Efeito
- Por que os Efeitos são reativos e os manipuladores de eventos não
- O que fazer quando você quer que uma parte do código do seu Efeito não seja reativa
- O que são Eventos de Efeito e como extraí-los dos seus Efeitos
- Como ler as últimas props e estado dos Efeitos usando Eventos de Efeito

</YouWillLearn>

## Escolhendo entre manipuladores de eventos e Efeitos {/*choosing-between-event-handlers-and-effects*/}

Primeiro, vamos revisar a diferença entre manipuladores de eventos e Efeitos.

Imagine que você está implementando um componente de chat. Seus requisitos são os seguintes:

1. Seu componente deve se conectar automaticamente à sala de chat selecionada.
1. Quando você clicar no botão "Enviar", ele deve enviar uma mensagem para o chat.

Vamos supor que você já implementou o código para eles, mas não tem certeza de onde colocá-lo. Você deve usar manipuladores de eventos ou Efeitos? Sempre que precisar responder a essa pergunta, considere [*por que* o código precisa ser executado.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Manipuladores de eventos são executados em resposta a interações específicas {/*event-handlers-run-in-response-to-specific-interactions*/}

Do ponto de vista do usuário, enviar uma mensagem deve acontecer *porque* o botão "Enviar" específico foi clicado. O usuário ficará bastante chateado se você enviar a mensagem dele em qualquer outro momento ou por qualquer outro motivo. É por isso que enviar uma mensagem deve ser um manipulador de eventos. Os manipuladores de eventos permitem que você trate interações específicas:

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

Com um manipulador de eventos, você pode ter certeza de que `sendMessage(message)` será *executado apenas* se o usuário pressionar o botão.

### Efeitos são executados sempre que a sincronização é necessária {/*effects-run-whenever-synchronization-is-needed*/}

Lembre-se de que você também precisa manter o componente conectado à sala de chat. Onde esse código deve ir?

A *razão* para executar esse código não é alguma interação específica. Não importa como ou por que o usuário navegou até a tela da sala de chat. Agora que está olhando para ela e poderia interagir com ela, o componente precisa permanecer conectado ao servidor de chat selecionado. Mesmo que o componente da sala de chat fosse a tela inicial do seu aplicativo, e o usuário não tivesse realizado nenhuma interação, você ainda precisaria se conectar. É por isso que é um Efeito:

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

Com esse código, você pode ter certeza de que sempre há uma conexão ativa com o servidor de chat atualmente selecionado, *independentemente* das interações específicas realizadas pelo usuário. Quer o usuário tenha apenas aberto seu aplicativo, selecionado uma sala diferente, ou navegado para outra tela e voltado, seu Efeito garante que o componente *permaneça sincronizado* com a sala atualmente selecionada, e [reconectará sempre que necessário.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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
      <h1>Bem-vindo à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Enviar</button>
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
          <option value="musica">música</option>
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
export function sendMessage(message) {
  console.log('🔵 Você enviou: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## Valores reativos e lógica reativa {/*reactive-values-and-reactive-logic*/}

Intuitivamente, você poderia dizer que os manipuladores de eventos são sempre disparados "manualmente", por exemplo, clicando em um botão. Os Efeitos, por outro lado, são "automáticos": eles são executados e re-executados sempre que necessário para permanecerem sincronizados.

Há uma maneira mais precisa de pensar sobre isso.

Props, estado e variáveis declaradas dentro do corpo do seu componente são chamadas de <CodeStep step={2}>valores reativos</CodeStep>. Neste exemplo, `serverUrl` não é um valor reativo, mas `roomId` e `message` são. Eles participam do fluxo de dados de renderização:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Valores reativos como esses podem mudar devido a uma nova renderização. Por exemplo, o usuário pode editar a `message` ou escolher um `roomId` diferente em um dropdown. Manipuladores de eventos e Efeitos respondem às mudanças de maneira diferente:

- **A lógica dentro dos manipuladores de eventos *não é reativa.*** Ela não será executada novamente, a menos que o usuário realize a mesma interação (por exemplo, um clique) novamente. Os manipuladores de eventos podem ler valores reativos sem "reagir" às suas mudanças.
- **A lógica dentro dos Efeitos *é reativa.*** Se seu Efeito ler um valor reativo, [você precisa especificá-lo como uma dependência.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Então, se uma nova renderização fizer com que esse valor mude, o React re-executará a lógica do seu Efeito com o novo valor.

Vamos revisar o exemplo anterior para ilustrar essa diferença.

### A lógica dentro dos manipuladores de eventos não é reativa {/*logic-inside-event-handlers-is-not-reactive*/}

Veja esta linha de código. Essa lógica deve ser reativa ou não?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Do ponto de vista do usuário, **uma mudança na `message` não significa que eles querem enviar uma mensagem.** Isso apenas significa que o usuário está digitando. Em outras palavras, a lógica que envia uma mensagem não deve ser reativa. Ela não deve ser executada novamente apenas porque o <CodeStep step={2}>valor reativo</CodeStep> mudou. É por isso que pertence ao manipulador de eventos:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Os manipuladores de eventos não são reativos, então `sendMessage(message)` só será executado quando o usuário clicar no botão Enviar.

### A lógica dentro dos Efeitos é reativa {/*logic-inside-effects-is-reactive*/}

Agora vamos voltar para essas linhas:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Do ponto de vista do usuário, **uma mudança no `roomId` *significa* que eles querem se conectar a uma sala diferente.** Em outras palavras, a lógica para se conectar à sala deve ser reativa. Você *quer* que essas linhas de código "acompanhem" o <CodeStep step={2}>valor reativo</CodeStep>, e sejam executadas novamente se ese valor for diferente. É por isso que pertence a um Efeito:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Os Efeitos são reativos, então `createConnection(serverUrl, roomId)` e `connection.connect()` serão executados para cada valor distinto de `roomId`. Seu Efeito mantém a conexão de chat sincronizada com a sala atualmente selecionada.

## Extraindo lógica não reativa dos Efeitos {/*extracting-non-reactive-logic-out-of-effects*/}

As coisas ficam mais complicadas quando você deseja misturar lógica reativa com lógica não reativa.

Por exemplo, imagine que você quer mostrar uma notificação quando o usuário se conecta ao chat. Você lê o tema atual (claro ou escuro) das props para que possa mostrar a notificação na cor correta:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Conectado!', theme);
    });
    connection.connect();
    // ...
```

No entanto, `theme` é um valor reativo (pode mudar como resultado de uma nova renderização), e [cada valor reativo lido por um Efeito deve ser declarado como sua dependência.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Agora você precisa especificar `theme` como uma dependência do seu Efeito:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Conectado!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Todas as dependências declaradas
  // ...
```

Brinque com este exemplo e veja se consegue identificar o problema com essa experiência do usuário:

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
      showNotification('Conectado!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Bem-vindo à sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [isDark, setIsDark] = useState(false);
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
          <option value="musica">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
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
  // Uma implementação real realmente se conectaria ao servidor
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
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'connected') {
        throw Error('Apenas o evento "connected" é suportado.');
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

Quando o `roomId` muda, o chat reconecta como você esperaria. Mas como `theme` também é uma dependência, o chat *também* reconecta sempre que você alterna entre o tema escuro e o claro. Isso não é legal!

Em outras palavras, você *não* quer que esta linha seja reativa, mesmo que esteja dentro de um Efeito (que é reativo):

```js
      // ...
      showNotification('Conectado!', theme);
      // ...
```

Você precisa de uma maneira de separar essa lógica não reativa da reativa ao seu redor.

### Declarando um Evento de Efeito {/*declaring-an-effect-event*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Use um Hook especial chamado [`useEffectEvent`](/reference/react/experimental_useEffectEvent) para extrair essa lógica não reativa dos seus Efeitos:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Conectado!', theme);
  });
  // ...
```

Aqui, `onConnected` é chamado de um *Evento de Efeito.* É uma parte da lógica do seu Efeito, mas se comporta muito mais como um manipulador de eventos. A lógica dentro dele não é reativa, e sempre "vê" os valores mais recentes das suas props e estado.

Agora você pode chamar o Evento de Efeito `onConnected` de dentro do seu Efeito:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Conectado!', theme);
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
    showNotification('Conectado!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Bem-vindo à sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [isDark, setIsDark] = useState(false);
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
          <option value="musica">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
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
  // Uma implementação real realmente se conectaria ao servidor
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
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'connected') {
        throw Error('Apenas o evento "connected" é suportado.');
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

Você pode pensar nos Eventos de Efeito como sendo muito semelhantes aos manipuladores de eventos. A principal diferença é que os manipuladores de eventos são executados em resposta a interações do usuário, enquanto os Eventos de Efeito são acionados por você a partir dos Efeitos. Os Eventos de Efeito permitem que você "quebre a cadeia" entre a reatividade dos Efeitos e o código que não deve ser reativo.

### Lendo as últimas props e estado com Eventos de Efeito {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Os Eventos de Efeito permitem que você conserte muitos padrões nos quais você pode estar tentado a suprimir o linter de dependência.

Por exemplo, digamos que você tem um Efeito para registrar as visitas à página:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Depois, você adiciona várias rotas ao seu site. Agora seu componente `Page` recebe uma prop `url` com o caminho atual. Você quer passar a `url` como parte do seu chamado de `logVisit`, mas o linter de dependências reclama:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect tem uma dependência ausente: 'url'
  // ...
}
```

Pense sobre o que você quer que o código faça. Você *quer* registrar uma visita separada para diferentes URLs, pois cada URL representa uma página diferente. Em outras palavras, essa chamada de `logVisit` *deve* ser reativa em relação à `url`. É por isso que, nesse caso, faz sentido seguir o linter de dependências e adicionar `url` como uma dependência:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora digamos que você quer incluir o número de itens no carrinho de compras junto com cada visita à página:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect tem uma dependência ausente: 'numberOfItems'
  // ...
}
```

Você usou `numberOfItems` dentro do Efeito, então o linter pede que você a adicione como uma dependência. No entanto, você *não* quer que a chamada de `logVisit` seja reativa em relação a `numberOfItems`. Se o usuário coloca algo no carrinho de compras, e `numberOfItems` muda, isso *não significa* que o usuário visitou a página novamente. Em outras palavras, *visitar a página* é, em certo sentido, um "evento". Acontece em um momento preciso no tempo.

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

Aqui, `onVisit` é um Evento de Efeito. O código dentro dele não é reativo. É por isso que você pode usar `numberOfItems` (ou qualquer outro valor reativo!) sem se preocupar que isso fará com que o código circundante seja reexecutado.

Por outro lado, o Efeito em si permanece reativo. O código dentro do Efeito usa a prop `url`, então o Efeito será executado após cada nova renderização com uma `url` diferente. Isso, por sua vez, chamará o Evento de Efeito `onVisit`.

Como resultado, você chamará `logVisit` para cada mudança na `url`, e sempre lerá a `numberOfItems` mais recente. No entanto, se `numberOfItems` mudar por conta própria, isso não fará com que nenhum dos códigos seja reexecutado.

<Note>

Você pode estar se perguntando se poderia chamar `onVisit()` sem argumentos e ler a `url` dentro dele:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Isso funcionaria, mas é melhor passar essa `url` explicitamente para o Evento de Efeito. **Ao passar `url` como um argumento para seu Evento de Efeito, você está dizendo que visitar uma página com uma `url` diferente constitui um "evento" separado da perspectiva do usuário.** A `visitedUrl` é uma *parte* do "evento" que aconteceu:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Como seu Evento de Efeito "pede" explicitamente pela `visitedUrl`, agora você não pode acidentalmente remover `url` das dependências do Efeito. Se você remover a dependência `url` (fazendo com que visitas distintas à página sejam contadas como uma), o linter alertará você sobre isso. Você quer que `onVisit` seja reativo em relação à `url`, então, em vez de ler a `url` dentro (onde não seria reativa), você a passa *do* seu Efeito.

Isso se torna especialmente importante se houver alguma lógica assíncrona dentro do Efeito:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Atraso ao registrar visitas
  }, [url]);
```

Aqui, `url` dentro de `onVisit` corresponde à `url` mais *recente* (que já pode ter mudado), mas `visitedUrl` corresponde à `url` que originalmente fez com que esse Efeito (e essa chamada de `onVisit`) fosse executada.

</Note>

<DeepDive>

#### É aceitável suprimir o linter de dependência em vez disso? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Nos bases de código existentes, você pode às vezes ver a regra de lint suprimida assim:

```js {7-9}
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

Depois que `useEffectEvent` se tornar uma parte estável do React, recomendamos **nunca suprimir o linter**.

O primeiro problema de suprimir a regra é que o React não alertará mais você quando seu Efeito precisa "reagir" a uma nova dependência reativa que você introduziu em seu código. No exemplo anterior, você adicionou `url` às dependências *porque* o React lembrou você de fazer isso. Você não receberá mais tais lembretes para futuras edições desse Efeito se desativar o linter. Isso leva a bugs.

Aqui está um exemplo de um bug confuso causado pela supressão do linter. Neste exemplo, a função `handleMove` deve ler o valor atual da variável de estado `canMove` para decidir se o ponto deve seguir o cursor. No entanto, `canMove` sempre é `true` dentro de `handleMove`.

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
        O ponto pode se mover
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

O problema com esse código está em suprimir o linter de dependências. Se você remover a supressão, verá que este Efeito deve depender da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Todo valor reativo deve ser especificado como uma dependência, ou poderá potencialmente ficar obsoleto com o tempo!

O autor do código original "mentiu" para o React ao dizer que o Efeito não depende (`[]`) de nenhum valor reativo. É por isso que o React não re-sincronizou o Efeito após `canMove` ter mudado (e `handleMove` com ele). Como o React não re-sincronizou o Efeito, o `handleMove` anexado como ouvinte é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, e é por isso que `handleMove` da renderização inicial sempre verá esse valor.

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
        O ponto pode se mover
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

Isso não significa que `useEffectEvent` é *sempre* a solução correta. Você deve aplicá-lo apenas nas linhas de código que você não quer que sejam reativas. No sandbox acima, você não queria que o código do Efeito fosse reativo em relação a `canMove`. É por isso que fez sentido extrair um Evento de Efeito.

Leia [Removendo Dependências de Efeito](/learn/removing-effect-dependencies) para outras alternativas corretas à supressão do linter.

</DeepDive>

### Limitações dos Eventos de Efeito {/*limitations-of-effect-events*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Os Eventos de Efeito são muito limitados em como você pode usá-los:

* **Chame-os apenas de dentro de Efeitos.**
* **Nunca os passe para outros componentes ou Hooks.**

Por exemplo, não declare e passe um Evento de Efeito assim:

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
  }, [delay, callback]); // Necessita especificar "callback" nas dependências
}
```

Em vez disso, sempre declare Eventos de Efeito diretamente ao lado dos Efeitos que os usam:

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
  }, [delay]); // Não é necessário especificar "onTick" (um Evento de Efeito) como uma dependência
}
```

Os Eventos de Efeito são "partes" não reativas do seu código de Efeito. Eles devem estar ao lado do Efeito que os usa.

<Recap>

- Manipuladores de eventos são executados em resposta a interações específicas.
- Efeitos são executados sempre que a sincronização é necessária.
- A lógica dentro dos manipuladores de eventos não é reativa.
- A lógica dentro dos Efeitos é reativa.
- Você pode mover a lógica não reativa dos Efeitos para Eventos de Efeito.
- Chame Eventos de Efeito apenas de dentro de Efeitos.
- Não passe Eventos de Efeito para outros componentes ou Hooks.

</Recap>

<Challenges>

#### Corrija uma variável que não se atualiza {/*fix-a-variable-that-doesnt-update*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual está aumentando é armazenado na variável de estado `increment`. Você pode controlar a variável `increment` com os botões de mais e menos.

No entanto, não importa quantas vezes você clicar no botão de mais, o contador ainda é incrementado em um a cada segundo. O que há de errado com este código? Por que `increment` sempre é igual a `1` dentro do código do Efeito? Encontre o erro e corrija-o.

<Hint>

Para corrigir este código, basta seguir as regras.

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        A cada segundo, incrementar em:
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

Como de costume, ao procurar bugs em Efeitos, comece procurando por supressões de linter.

Se você remover o comentário de supressão, o React dirá que o código deste Efeito depende de `increment`, mas você "mentiu" para o React ao afirmar que esse Efeito não depende de nenhum valor reativo (`[]`). Adicione `increment` à matriz de dependência:

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        A cada segundo, incrementar em:
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

Agora, quando `increment` muda, o React re-sincronizará seu Efeito, que reiniciará o intervalo.

</Solution>

#### Corrija um contador que congela {/*fix-a-freezing-counter*/}

Este componente `Timer` mantém uma variável de estado `count` que aumenta a cada segundo. O valor pelo qual está aumentando é armazenado na variável de estado `increment`, que você pode controlar com os botões de mais e menos. Por exemplo, tente pressionar o botão de mais nove vezes e note que o `count` agora aumenta a cada segundo em dez, em vez de um.

Há um pequeno problema com essa interface do usuário. Você pode notar que, se continuar pressionando os botões de mais ou menos mais rápido do que uma vez por segundo, o timer parece parar. Ele só retoma após um segundo passar desde a última vez que você pressionou qualquer um dos botões. Encontre por que isso está acontecendo, e conserte o problema para que o timer marque a cada segundo sem interrupções.

<Hint>

Parece que o Efeito que configura o timer "reage" ao valor de `increment`. A linha que usa o valor atual de `increment` para chamar `setCount` realmente precisa ser reativado?

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
  
The issue is that the code inside the Effect uses the `increment` state variable. Since it's a dependency of your Effect, every change to `increment` causes the Effect to re-synchronize, which causes the interval to clear. If you keep clearing the interval every time before it has a chance to fire, it will appear as if the timer has stalled.

To solve the issue, extract an `onTick` Effect Event from the Effect:

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
Since `onTick` is an Effect Event, the code inside it isn't reactive. The change to `increment` does not trigger any Effects.

</Solution>

#### Fix a non-adjustable delay {/*fix-a-non-adjustable-delay*/}

In this example, you can customize the interval delay. It's stored in a `delay` state variable which is updated by two buttons. However, even if you press the "plus 100 ms" button until the `delay` is 1000 milliseconds (that is, a second), you'll notice that the timer still increments very fast (every 100 ms). It's as if your changes to the `delay` are ignored. Find and fix the bug.

<Hint>
Code inside Effect Events is not reactive. Are there cases in which you would _want_ the `setInterval` call to re-run?
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
	@@ -1298,22 +1141,11 @@ export default function Timer() {
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

O problema com o exemplo acima é que ele extraiu um Evento de Efeito chamado `onMount` sem considerar o que o código realmente deveria fazer. Você deve extrair Eventos de Efeito por um motivo específico: quando quer tornar uma parte do seu código não reativa. No entanto, a chamada `setInterval` *deve* ser reativa em relação à variável de estado `delay`. Se `delay` mudar, você quer configurar o intervalo do zero! Para consertar esse código, coloque todo o código reativo de volta dentro do Efeito:

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
        Contador: {count}
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        Incrementar em:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Atraso de incremento:
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

Em geral, você deve ser suspeito de funções como `onMount` que se concentram na *temporalidade* em vez do *propósito* de uma parte do código. Pode parecer "mais descritivo" à primeira vista, mas obscurece sua intenção. Como regra geral, os Eventos de Efeito devem corresponder a algo que acontece a partir da perspectiva do *usuário*. Por exemplo, `onMessage`, `onTick`, `onVisit` ou `onConnected` são bons nomes para Eventos de Efeito. O código dentro deles provavelmente não precisaria ser reativo. Por outro lado, `onMount`, `onUpdate`, `onUnmount` ou `onAfterRender` são tão genéricos que é fácil acidentalmente colocar código que *deveria* ser reativo dentro deles. Por isso, você deve nomear seus Eventos de Efeito com base em *o que o usuário acha que aconteceu,* não quando algum código aconteceu de ser executado.

</Solution>

#### Corrija uma notificação atrasada {/*fix-a-delayed-notification*/}

Quando você entra em uma sala de chat, este componente mostra uma notificação. No entanto, ela não é exibida imediatamente. Em vez disso, a notificação é artificialmente atrasada em dois segundos para que o usuário tenha a chance de observar a interface do usuário.

Isso quase funciona, mas há um bug. Tente mudar o dropdown de "geral" para "viagem" e depois para "musica" muito rapidamente. Se você fizer isso rápido o suficiente, verá duas notificações (como esperado!), mas ambas dirão "Bem-vindo à música".

Conserte-o para que quando você mudar de "geral" para "viagem" e depois para "musica" muito rapidamente, você veja duas notificações, sendo a primeira "Bem-vindo à viagem" e a segunda "Bem-vindo à música". (Para um desafio adicional, supondo que você *já* fez as notificações mostrarem as salas corretas, mude o código de maneira que apenas a última notificação seja exibida.)

<Hint>

Seu Efeito sabe a qual sala ele se conectou. Existe alguma informação que você pode querer passar para o seu Evento de Efeito?

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
    showNotification('Bem-vindo à ' + roomId, theme);
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

  return <h1>Bem-vindo à sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [isDark, setIsDark] = useState(false);
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
          <option value="musica">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
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
  // Uma implementação real realmente se conectaria ao servidor
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
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'connected') {
        throw Error('Apenas o evento "connected" é suportado.');
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

<Solution>

Dentro do seu Evento de Efeito, `roomId` é o valor *no momento em que o Evento de Efeito foi chamado.*

Seu Evento de Efeito é chamado com um atraso de dois segundos. Se você estiver mudando rapidamente de sala de viagem para música, quando a notificação da sala de viagem aparecer, `roomId` já é "música". É por isso que ambas as notificações dizem "Bem-vindo à música".

Para consertar o problema, em vez de ler a `roomId` *mais recente* dentro do Evento de Efeito, torne-a um parâmetro do seu Evento de Efeito, como `connectedRoomId` abaixo. Então passe `roomId` do seu Efeito chamando `onConnected(roomId)`:

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
    showNotification('Bem-vindo à ' + connectedRoomId, theme);
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

  return <h1>Bem-vindo à sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [isDark, setIsDark] = useState(false);
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
          <option value="musica">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
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
  // Uma implementação real realmente se conectaria ao servidor
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
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'connected') {
        throw Error('Apenas o evento "connected" é suportado.');
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

O Efeito que tinha `roomId` definido como "viagem" (portanto, se conectou à sala "viagem") mostrará a notificação para "viagem". O Efeito que tinha `roomId` definido como "música" (portanto, se conectou à sala "música") mostrará a notificação para "música". Em outras palavras, `connectedRoomId` vem do seu Efeito (que é reativo), enquanto `theme` sempre usa o valor mais recente.

Para resolver o desafio adicional, salve o ID do tempo limite da notificação e cancele-o na função de limpeza do seu Efeito:

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
    showNotification('Bem-vindo à ' + connectedRoomId, theme);
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

  return <h1>Bem-vindo à sala {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [isDark, setIsDark] = useState(false);
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
          <option value="musica">música</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
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
  // Uma implementação real realmente se conectaria ao servidor
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
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'connected') {
        throw Error('Apenas o evento "connected" é suportado.');
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

Isso garante que notificações já agendadas (mas ainda não exibidas) sejam canceladas quando você mudar de salas.

</Solution>

</Challenges>
