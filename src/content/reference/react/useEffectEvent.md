---
title: useEffectEvent
---

<Intro>

`useEffectEvent` é um Hook do React que permite separar eventos de Efeitos.

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Chame `useEffectEvent` no nível superior do seu componente para criar um Evento de Efeito.

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
}
```

Eventos de Efeito são parte da lógica do seu Efeito, mas se comportam mais como um manipulador de eventos. Eles sempre "enxergam" os valores mais recentes da renderização (como props e estado) sem re-sincronizar seu Efeito, portanto, são excluídos das dependências do Efeito. Veja [Separando Eventos de Efeitos](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects) para saber mais.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `callback`: Uma função que contém a lógica para o seu Evento de Efeito. A função pode aceitar qualquer número de argumentos e retornar qualquer valor. Ao chamar a função de Evento de Efeito retornada, o `callback` sempre acessa os valores commitados mais recentes da renderização no momento da chamada.

#### Retorna {/*returns*/}

`useEffectEvent` retorna uma função de Evento de Efeito com a mesma assinatura de tipo que seu `callback`.

Você pode chamar esta função dentro de `useEffect`, `useLayoutEffect`, `useInsertionEffect`, ou de outros Eventos de Efeito no mesmo componente.

#### Ressalvas {/*caveats*/}

* `useEffectEvent` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou dos seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o Evento de Efeito para ele.
* Eventos de Efeito só podem ser chamados de dentro de Efeitos ou outros Eventos de Efeito. Não os chame durante a renderização nem os passe para outros componentes ou Hooks. O linter [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) impõe essa restrição.
* Não use `useEffectEvent` para evitar especificar dependências no array de dependências do seu Efeito. Isso oculta erros e torna seu código mais difícil de entender. Use-o apenas para lógica que seja genuinamente um evento disparado por Efeitos.
* Funções de Evento de Efeito não possuem uma identidade estável. Sua identidade muda intencionalmente a cada renderização.

<DeepDive>

#### Por que os Eventos de Efeito não são estáveis? {/*why-are-effect-events-not-stable*/}

Diferente das funções `set` de `useState` ou de refs, as funções de Evento de Efeito não possuem uma identidade estável. Sua identidade muda intencionalmente a cada renderização:

```js
// 🔴 Errado: incluindo Evento de Efeito nas dependências
useEffect(() => {
  onSomething();
}, [onSomething]); // O ESLint avisará sobre isso
```

Esta é uma escolha de design deliberada. Eventos de Efeito são feitos para serem chamados apenas de dentro de Efeitos no mesmo componente. Como você só pode chamá-los localmente e não pode passá-los para outros componentes ou incluí-los em arrays de dependência, uma identidade estável não teria propósito e, na verdade, mascararia erros.

A identidade não estável atua como uma asserção em tempo de execução: se seu código depender incorretamente da identidade da função, você verá o Efeito sendo reexecutado a cada renderização, tornando o erro óbvio.

Este design reforça que os Eventos de Efeito conceitualmente pertencem a um Efeito específico e não são uma API de propósito geral para optar por não reagir.

</DeepDive>

---

## Uso {/*usage*/}


### Usando um evento em um Efeito {/*using-an-event-in-an-effect*/}

Chame `useEffectEvent` no nível superior do seu componente para criar um *Evento de Efeito*:


```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Connected!');
  }
});
```

`useEffectEvent` aceita um `callback de evento` e retorna um <CodeStep step={1}>Evento de Efeito</CodeStep>. O Evento de Efeito é uma função que pode ser chamada dentro de Efeitos sem re-conectar o Efeito:

```js [[1, 3, "onConnected"]]
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

Como `onConnected` é um <CodeStep step={1}>Evento de Efeito</CodeStep>, `muted` e `onConnect` não estão nas dependências do Efeito.

<Pitfall>

##### Não use Eventos de Efeito para pular dependências {/*pitfall-skip-dependencies*/}

Pode ser tentador usar `useEffectEvent` para evitar listar dependências que você acha "desnecessárias". No entanto, isso oculta erros e torna seu código mais difícil de entender:

```js
// 🔴 Errado: Usando Eventos de Efeito para ocultar dependências
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // pageUrl ausente significa que você perde logs
```

Se um valor deve fazer seu Efeito ser reexecutado, mantenha-o como uma dependência. Use Eventos de Efeito apenas para lógica que genuinamente não deve reativar seu Efeito.

Veja [Separando Eventos de Efeitos](/learn/separating-events-from-effects) para saber mais.

</Pitfall>

---

### Usando um timer com valores mais recentes {/*using-a-timer-with-latest-values*/}

Quando você usa `setInterval` ou `setTimeout` em um Efeito, muitas vezes você quer ler os valores mais recentes da renderização sem reiniciar o timer sempre que esses valores mudam.

Este contador incrementa `count` pelo valor atual de `increment` a cada segundo. O Evento de Efeito `onTick` lê os `count` e `increment` mais recentes sem causar a reinicialização do intervalo:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
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

Tente mudar o valor de incremento enquanto o timer está rodando. O contador usa imediatamente o novo valor de incremento, mas o timer continua funcionando suavemente sem reiniciar.

---

### Usando um listener de eventos com valores mais recentes {/*using-an-event-listener-with-latest-values*/}

Quando você configura um listener de eventos em um Efeito, muitas vezes precisa ler os valores mais recentes da renderização no callback. Sem `useEffectEvent`, você precisaria incluir os valores em suas dependências, o que faria com que o listener fosse removido e adicionado novamente a cada mudança.

Este exemplo mostra um ponto que segue o cursor, mas apenas quando "Can move" está marcado. O Evento de Efeito `onMove` sempre lê o valor `canMove` mais recente sem reexecutar o Efeito:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

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
        <input
          type="checkbox"
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

Marque a caixa de seleção e mova o cursor. O ponto responde imediatamente ao estado da caixa de seleção, mas o listener de eventos é configurado apenas uma vez quando o componente é montado.

---

### Evitar reconexões a sistemas externos {/*avoid-reconnecting-to-external-systems*/}

Um caso de uso comum para `useEffectEvent` é quando você quer fazer algo em resposta a um Efeito, mas esse "algo" depende de um valor ao qual você não quer reagir.

Neste exemplo, um componente de chat se conecta a uma sala e mostra uma notificação quando conectado. O usuário pode silenciar notificações com uma caixa de seleção. No entanto, você não quer se reconectar à sala de chat toda vez que o usuário muda as configurações:

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
import { useState, useEffect, useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ Connected to ' + roomId + ' (muted: ' + muted + ')');
    if (!muted) {
      showNotification('Connected to ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ Connecting to ' + roomId + '...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
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
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        muted={muted}
      />
    </>
  );
}
```

```js src/chat.js
const serverUrl = 'https://localhost:1234';

export function createConnection(roomId) {
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

Tente mudar de sala. O chat se reconecta e mostra uma notificação. Agora, silencie as notificações. Como `muted` é lido dentro do Evento de Efeito em vez do Efeito, o chat permanece conectado.

---

### Usando Eventos de Efeito em Hooks customizados {/*using-effect-events-in-custom-hooks*/}

Você pode usar `useEffectEvent` dentro dos seus próprios Hooks customizados. Isso permite que você crie Hooks reutilizáveis que encapsulam Efeitos, mantendo alguns valores não reativos:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Incrementing by {incrementBy} every second</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment by:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

Neste exemplo, `useInterval` é um Hook customizado que configura um intervalo. O `callback` passado para ele é envolvido em um Evento de Efeito, então o intervalo não é resetado mesmo que um novo `callback` seja passado a cada renderização.

---

## Solução de problemas {/*troubleshooting*/}

### Estou recebendo um erro: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

Este erro significa que você está chamando uma função de Evento de Efeito durante a fase de renderização do seu componente. Eventos de Efeito só podem ser chamados de dentro de Efeitos ou outros Eventos de Efeito.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Errado: chamando durante a renderização
  onLog();

  // ✅ Correto: chamar de um Efeito
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

Se você precisa executar lógica durante a renderização, não a envolva em `useEffectEvent`. Chame a lógica diretamente ou mova-a para um Efeito.

---

### Estou recebendo um erro de lint: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

Se você vir um aviso como "Functions returned from `useEffectEvent` must not be included in the dependency array", remova o Evento de Efeito de suas dependências:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Errado: Evento de Efeito nas dependências
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correto: sem Evento de Efeito nas dependências
useEffect(() => {
  onSomething();
}, []);
```

Eventos de Efeito são projetados para serem chamados de Efeitos sem serem listados como dependências. O linter impõe isso porque a identidade da função é [intencionalmente não estável](#why-are-effect-events-not-stable). Incluí-la faria com que seu Efeito fosse reexecutado a cada renderização.

---

### Estou recebendo um erro de lint: "... is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

Se você vir um aviso como "... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events", você está chamando a função do lugar errado:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Errado: chamando de um manipulador de eventos
function handleClick() {
  onSomething();
}

// 🔴 Errado: passando para um componente filho
return <Child onSomething={onSomething} />;

// ✅ Correto: chamando de um Efeito
useEffect(() => {
  onSomething();
}, []);
```

Eventos de Efeito são especificamente projetados para serem usados em Efeitos locais ao componente em que são definidos. Se você precisar de um callback para manipuladores de eventos ou para passar para filhos, use uma função regular ou `useCallback` em vez disso.