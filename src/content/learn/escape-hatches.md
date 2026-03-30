---
title: Saídas de Emergência
---

<Intro>

Alguns de seus componentes podem precisar controlar e se sincronizar com sistemas externos ao React. Por exemplo: você talvez precise focar um *input* através da API do navegador, pausar ou dar continuidade a um *player* de vídeo implementado sem uso do React ou conectar-se e escutar mensagens vindas de um servidor remoto. Nesse capítulo, você aprenderá as saídas de emergência que te permitem "contornar" o React e conectar-se a sistemas externos. A maior parte da lógica na sua aplicação não deverá depender dessas funcionalidades.

</Intro>

<YouWillLearn isChapter={true}>

* [Como "guardar" informação sem rerrenderizar](/learn/referencing-values-with-refs)
* [Como acessar elementos do DOM gerenciados pelo React](/learn/manipulating-the-dom-with-refs)
* [Como sincronizar componentes com sistemas externos](/learn/synchronizing-with-effects)
* [Como remover Effects desnecessários dos seus componentes](/learn/you-might-not-need-an-effect)
* [Como o ciclo de vida de um Effect difere do de um componente](/learn/lifecycle-of-reactive-effects)
* [Como prevenir alguns valores de executarem Effects novamente](/learn/separating-events-from-effects)
* [Como diminuir o número de execuções de um Effect](/learn/removing-effect-dependencies)
* [Como compartilhar lógica entre componentes](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Referenciando valores através de refs {/*referencing-values-with-refs*/}

Quando desejar que um componente "guarde" alguma informação, mas não que ela [acione novas renderizações](/learn/render-and-commit), você pode usar uma *ref*:

```js
const ref = useRef(0);
```

Assim como estado, refs são retidas pelo React entre rerrenderizações. Entretanto, definir estado rerrenderiza um componente. Mudar uma ref, não! Você pode acessar o valor atual de uma ref através da propriedade `ref.current`.


<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Uma ref é como um compartimento secreto do seu componente que o React não acompanha. Por exemplo, você pode usar refs para guardar IDs de timeout(https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [elementos do DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Element) e outros objetos que não impactem no resultado da renderização de um componente.

<LearnMore path="/learn/referencing-values-with-refs">

Leia **[Referenciando Valores com Refs](/learn/referencing-values-with-refs)** para aprender como usar refs para guardar informação.

</LearnMore>

## Manipulando o DOM com refs {/*manipulating-the-dom-with-refs*/}

O React automaticamente atualiza o DOM para adequá-lo ao resultado de sua renderização, então seus componentes não precisarão manipulá-lo frequentemente. Entretanto, às vezes você precisa acessar elementos do DOM gerenciados pelo React - por exemplo, para focar em um nó, realizar a rolagem até ele ou medir seu tamanho e posição. Não há método pronto no React que permita fazer isso, então você precisará de uma referência ao nó do DOM. Neste exemplo: clicar no botão atribuirá foco ao input através de uma ref.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Leia **[Manipulando o DOM com refs](/learn/manipulating-the-dom-with-refs)** para aprender como acessar elementos do DOM gerenciados pelo React.

</LearnMore>

## Sincronizando com Effects {/*synchronizing-with-effects*/}

Alguns componentes precisam se sincronizar com sistemas externos. Por exemplo, você talvez precise controlar um componente fora do React com base no estado do React, estabelecer uma conexão com um servidor ou enviar um log de *analytics* quando um componente aparecer na tela. Diferentemente de *handlers* de eventos, que permitem tratar eventos específicos, *Effects* te permitem executar um trecho de código após a renderização. Utilize-os para sincronizar seu componente com o sistema fora do React.


Clique em Play/Pause algumas vezes e veja como o player de vídeo permanece sincronizado com o valor da prop `isPlaying`:


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
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
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
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Muitos Effects também "se limpam". Por exemplo, um Effect que estabelece uma conexão com um servidor de chat deveria retornar uma *função de limpeza* que informa ao React como se desconectar de tal servidor:


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
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Uma implementação real de fato se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

No ambiente de desenvolvimento, o React irá imediatamente executar e limpar seu Effect uma vez a mais. Por essa razão, `"✅ Connecting..."` é exibido duas vezes. Isso assegura que você não se esqueceu de implementar a função de limpeza.

<LearnMore path="/learn/synchronizing-with-effects">

Leia **[Sincronizando com Effects](/learn/synchronizing-with-effects)** para aprender como sincronizar componentes com sistemas externos.

</LearnMore>

## Talvez você não precise de um Effect {/*you-might-not-need-an-effect*/}

Effects são uma saída de emergência do paradigma do React. Eles permitem que você "contorne" o React e sincronize seus componentes com algum sistema externo. Se não houver sistema externo envolvido (por exemplo, se você quiser atualizar o estado de um componente com props ou mudança de estado), você não deveria usar um Effect. Remover Effects desnecessários tornará seu código mais fácil de se entender, mais rápido e menos propenso a erros.

Há dois casos comuns nos quais você não precisa de Effects:
- **Você não precisa de Effects para transformar dados para renderização.**
- **Você não precisa de Effects para lidar com eventos do usuário.**


Por exemplo, você não precisa de um Effect para ajustar um estado baseado em outro estado:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Evite: estado redundante e Effect desnecessário
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Ao invés disso, calcule o quanto puder enquanto estiver renderizando:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Bom: calculado durante a renderização
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Entretanto, você *precisa* de Effects para sincronizar com sistemas externos.

<LearnMore path="/learn/you-might-not-need-an-effect">

Leia **[Talvez você não precise de um Effect](/learn/you-might-not-need-an-effect)** para aprender como remover Effects desnecessários.

</LearnMore>



## Ciclo de vida de Effects reativos {/*lifecycle-of-reactive-effects*/}

Effects têm um ciclo de vida diferente dos componentes. Componentes podem se montar, atualizar ou desmontar. Um Effect só pode fazer duas coisas: começar a sincronizar algo e, mais tarde, parar a sincronização. Esse ciclo pode acontecer múltiplas vezes se seu Effect depender de props e estado que possam mudar ao longo do tempo.

Este Effect depende do valor da prop `roomId`. Props são *valores reativos*, o que significa que podem mudar em uma rerrenderização. Note que um Effect *ressincroniza* (e reconecta ao servidor) caso `roomId` seja alterado:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real de fato se conectaria ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

O React provê uma regra de *linter* para checar se você especificou as dependências do seu Effect corretamente. Caso você se esqueça de especificar `roomId` na lista de dependências do exemplo acima, o *linter* achará esse bug automaticamente.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Leia **[Ciclo de vida de Effects reativos](/learn/lifecycle-of-reactive-effects)** para aprender como o ciclo de vida de um Effect é diferente do de um componente.

</LearnMore>

## Separando eventos de Effects {/*separating-events-from-effects*/}

<<<<<<< HEAD
<Wip>

Essa seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

_Handlers_ de eventos só são executados novamente caso uma interação ocorra de novo. Diferentemente de _handlers_ de eventos, Effects resincronizam se qualquer valor lido por eles, como props ou estado, mudarem desde a última renderização. Às vezes, você deseja uma mistura dos dois comportamentos: um Effect que é executado novamente em resposta a alguns valores, mas não a outros.
=======
Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if any of the values they read, like props or state, are different than during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.
>>>>>>> 40ea071c846b3ab1232391bab15d31f508913bf4

Todo código dentro de Effects é *reativo*. Ele será executado novamente se algum valor reativo lido por ele se alterar por causa de uma rerrenderização. Por exemplo, esse Effect irá reconectar ao chat se `roomId` ou `theme` tiverem mudado.

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
  // Uma implementação real de fato se conectaria ao servidor
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

Isso não é ideal. Você quer se reconectar ao chat apenas se `roomId` tiver mudado. Mudar o `theme` não deveria reconectar o chat! Mova o código lendo `theme` do seu Effect para um Effect Event.

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
  // Uma implementação real de fato se conectaria ao servidor
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

Código dentro de Effect Events não é reativo, portanto a mudança de `theme` deixará de fazer seu Effect reconectar.

<LearnMore path="/learn/separating-events-from-effects">

Leia **[Separando eventos de Effects](/learn/separating-events-from-effects)** para aprender como prevenir alguns valores de dispararem Effects.

</LearnMore>

## Removendo dependências de Effect {/*removing-effect-dependencies*/}

Ao escrever um Effect, o *linter* irá verificar que você incluiu todo valor reativo (como props e estado) lido pelo Effect à lista de dependências desse Effect. Isso assegura que seu Effect permanecerá sincronizado com os valores das props e estado mais atualizados do seu componente. Dependências desnecessárias podem fazer com que seu Effect seja executado muito frequentemente, ou até mesmo crie um loop infinito. A forma de removê-las depende de cada caso.

Por exemplo, esse Effect depende do objeto `options`, que é recriado toda vez que você edita o input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real de fato se conectaria ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Você não quer que o chat reconecte toda vez que você começar a digitar uma mensagem nele. Para consertar esse problema, mova a criação do objeto `options` para dentro do Effect de forma que o Effect dependa apenas da string `roomId`:

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
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real de fato se conectaria ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Note que você não começou editando a lista de dependências para remover `options` de lá. Isso seria errado. Ao invés disso, você alterou o código ao redor dela, de forma que essa dependência se tornasse *desnecessária*. Pense na lista de dependências como uma lista de todos os valores reativos usados pelo código do seu Effect. Você não escolheu intencionalmente o que colocar na lista. A lista descreve seu código. Para mudar a lista de dependências, mude o código.

<LearnMore path="/learn/removing-effect-dependencies">

Leia **[Removendo dependências de Effect](/learn/removing-effect-dependencies)** para aprender a como diminuir o número de execuções de um Effect.

</LearnMore>

## Reutilizando lógica com Hooks customizados {/*reusing-logic-with-custom-hooks*/}

O React vem com diversos Hooks prontos, como `useState`, `useContext` e `useEffect`. Às vezes, você desejará que houvesse um Hook para um propósito mais específico: por exemplo, buscar dados, observar se um usuário está online, ou para conectar-se a uma sala de chat. Para fazer isso, você pode criar seus próprios Hooks conforme as necessidades da sua aplicação.

Neste exemplo, o Hook customizado `usePointerPosition` acompanha a posição do cursor enquanto o outro Hook customizado `useDelayedValue` retorna um valor passado a ele com o atraso de uma quantidade arbitrária de milissegundos. Mova o cursor sobre a àrea de pré-visualização do *sandbox* para ver um rastro de pontinhos acompanhando a trajetória do cursor:


<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Você pode criar Hooks customizados, juntá-los, passar dados entre eles, e reutilizá-los entre componentes. Conforme seu app cresce, vocé escreverá menos Effects à mão porque poderá reutilizar os Hooks customizados que já escreveu. Há muitos Hooks customizados excelentes mantidos pela comunidade React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Leia **[Reutilizando lógica com Hooks customizados](/learn/reusing-logic-with-custom-hooks)** para aprender como compartilhar lógica entre componentes.

</LearnMore>

## E agora? {/*whats-next*/}

Vá para [Referenciando Valores com Refs](/learn/referencing-values-with-refs) para começar a ler este capítulo página por página!
