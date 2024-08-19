---
title: 'Reutilizando lógica com Hooks personalizados'
---

<Intro>

O React vem com vários Hooks embutidos como `useState`, `useContext`, e `useEffect`. Às vezes, você desejará que houvesse um Hook para algum propósito mais específico: Por exemplo, para buscar dados, para acompanhar se o usuário está online, ou para se conectar a uma sala de bate-papo. Você pode não encontrar esses Hooks no React, mas pode criar seus próprios Hooks para as necessidades do seu aplicativo

</Intro>

<YouWillLearn>

- O que são Hooks personalizados e como escrever os seus próprios
- Como reutilizar lógica entre componentes
- Como nomear e estruturar seus Hooks personalizados
- Quando e por que extrair Hooks personalizados

</YouWillLearn>

## Hooks Personalizados: Compartilhando lógica entre componentes {/*custom-hooks-sharing-logic-between-components*/}

Imagine que você está desenvolvendo um aplicativo que depende fortemente da rede (como a maioria dos aplicativos). Você deseja alertar o usuário caso a conexão de rede seja perdida acidentalmente enquanto eles estiverem usando o seu aplicativo. Como você procederia? Parece que você precisará de duas coisas no seu componente:

1. Um estado que acompanha se a rede está online ou não.
2. Um efeito que se inscreve nos eventos globais [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) e [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) e atualiza o estado correspondente.

Isso manterá seu componente [sincronizado](/learn/synchronizing-with-effects) com o status da rede. Você pode começar com algo assim:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}
```

</Sandpack>

Tente ligar e desligar sua conexão de rede e observe como esta `StatusBar` é atualizada em resposta às suas ações.

Agora, imagine que você *também* deseja usar a mesma lógica em um componente diferente. Você deseja implementar um botão "Salvar" que ficará desativado e exibirá "Reconectando..." em vez de "Salvar" enquanto a rede estiver desligada.

Para começar, você pode copiar e colar o estado `isOnline` e o efeito em `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progresso salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}
```

</Sandpack>

Verifique que, ao desligar a rede, o botão alterará sua aparência.

Esses dois componentes funcionam bem, mas a duplicação da lógica entre eles é infeliz. Parece que, mesmo que eles tenham uma aparência *visual diferente,* você deseja reutilizar a lógica entre eles.

### Extraindo seu próprio Hook personalizado de um componente {/*extracting-your-own-custom-hook-from-a-component*/}

Imagine, por um momento, que, assim como [`useState`](/reference/react/useState) e [`useEffect`](/reference/react/useEffect), houvesse um Hook embutido chamado `useOnlineStatus`. Em seguida, ambos esses componentes poderiam ser simplificados e seria possível remover a duplicação entre eles:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progresso salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}
```

Embora não exista um Hook embutido assim, você pode escrevê-lo por conta própria. Declare uma função chamada `useOnlineStatus` e mova todo o código duplicado para ela, a partir dos componentes que você escreveu anteriormente:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

No final da função, retorne `isOnline`. Isso permite que seus componentes leiam esse valor:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progresso salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Verifique se alternar a rede ligada e desligada atualiza ambos os componentes.

Agora, seus componentes não possuem tanta lógica repetitiva. **Mais importante ainda, o código dentro deles descreve *o que deles desejam fazer* (usar o status online!) em vez de *como fazer isso* (se inscrevendo nos eventos do navegador).**

Quando você extrai a lógica em Hooks personalizados, é possível ocultar os detalhes complicados de como lidar com algum sistema externo ou uma API do navegador. O código dos seus componentes expressa sua intenção, não a implementação.

### Nome dos hooks sempre começam com `use` {/*hook-names-always-start-with-use*/}

Aplicações React são construídas a partir de componentes. Os componentes são construídos a partir de Hooks, sejam eles embutidos ou personalizados. Provavelmente, você frequentemente usará Hooks personalizados criados por outras pessoas, mas ocasionalmente poderá escrever um você mesmo!

Você deve seguir estas convenções de nomenclatura:

1. **Os nomes dos componentes do React devem começar com uma letra maiúscula,** como `StatusBar` e `SaveButton`. Os componentes do React também precisam retornar algo que o React saiba como exibir, como um trecho de JSX.
2. **Os nomes do hooks devem começar com `use` seguido por uma letra maiúscula,** como [`useState`](/reference/react/useState) (built-in) ou `useOnlineStatus` (personalizado, como mencionado anteriormente na página). Hooks podem retornar valores arbitrários.

Essa convenção garante que você sempre possa olhar para um componente e saber onde seu estado, efeitos e outras funcionalidades do React podem estar "escondidos". Por exemplo, se você vir uma chamada de função `getColor()` dentro do seu componente, pode ter certeza de que ela não pode conter estado do React, pois seu nome não começa com `use`. No entanto, uma chamada de função como `useOnlineStatus()` provavelmente conterá chamadas a outros Hooks internamente!

<Note>

Se o seu linter estiver [configurado para o React,](/learn/editor-setup#linting) ele irá impor essa convenção de nomenclatura. Role para cima até o sandbox e renomeie `useOnlineStatus` para `getOnlineStatus`. Observe que o linter não permitirá mais que você chame `useState` ou `useEffect` dentro dele. Apenas Hooks e componentes podem chamar outros Hooks!

</Note>

<DeepDive>

#### Todos os nomes de funções chamadas durante a renderização devem começar com o prefixo use? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Não. Funções que não *chamam* Hooks não precisam *ser* Hooks. 

Se sua função não chama nenhum Hook, evite o prefixo `use`. Em vez disso, escreva-a como uma função regular *sem* o prefixo `use`. Por exemplo, se a função `useSorted` abaixo não chama Hooks, você pode chamá-la de `getSorted`:

```js
// 🔴 Evite: um Hook que não utiliza Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Bom: uma função regular que não utiliza Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

Isso garante que seu código possa chamar essa função regular em qualquer lugar, incluindo condições:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ É possível chamar getSorted() condicionalmente porque não é um Hook.
    displayedItems = getSorted(items);
  }
  // ...
}
```

Você deve adicionar o prefixo `use` a uma função (e, portanto, transformá-la em um Hook) se ela usar pelo menos um Hook em seu interior.

```js
// ✅ Bom: um Hook que usa outros Hooks
function useAuth() {
  return useContext(Auth);
}
```

Tecnicamente, isso não é exigido pelo React. Em princípio, é possível criar um Hook que não chama outros Hooks. Isso geralmente é confuso e limitante, então é melhor evitar esse padrão. No entanto, pode haver casos raros em que isso é útil. Por exemplo, talvez sua função não use nenhum Hook no momento, mas você planeja adicionar chamadas de Hook a ela no futuro. Nesse caso, faz sentido nomeá-la com o prefixo `use`.

```js {3-4}
// ✅ Bom: um Hook que provavelmente usará outros Hooks posteriormente
function useAuth() {
  // TODO: Substitua por esta linha quando a autenticação for implementada:
  // return useContext(Auth);
  return TEST_USER;
}
```

Então, os componentes não poderão chamá-lo condicionalmente. Isso se tornará importante quando você realmente adicionar chamadas de Hook no interior. Se você não planeja usar Hooks dentro dele (agora ou posteriormente), não o transforme em um Hook.

</DeepDive>

### Hooks personalizados permitem compartilhar lógica com estado, não o próprio estado {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

No exemplo anterior, quando você ligou e desligou a rede, ambos os componentes foram atualizados juntos. No entanto, é incorreto pensar que uma única variável de estado `isOnline` é compartilhada entre eles. Observe este código:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ele funciona da mesma forma que antes de extrair a duplicação:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Essas são duas variáveis de estado e efeitos completamente independentes! Elas acabaram tendo o mesmo valor ao mesmo tempo porque foram sincronizadas com o mesmo valor externo (se a rede está ligada ou desligada).

Para ilustrar melhor isso, precisaremos de um exemplo diferente. Considere este componente `Form`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Primeiro nome:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Último nome:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Bom dia, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Há alguma lógica repetitiva para cada campo do formulário:

1. Há uma variável de estado (`firstName` e `lastName`).
2. Há um manipulador de alteração (`handleFirstNameChange` e `handleLastNameChange`).
3. Há uma parte de JSX que especifica os atributos `value` e `onChange` para a entrada.

Você pode extrair a lógica repetitiva para este Hook personalizado `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        Primeiro nome:
        <input {...firstNameProps} />
      </label>
      <label>
        Último nome:
        <input {...lastNameProps} />
      </label>
      <p><b>Bom dia, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Observe que ele declara apenas uma variável de estado chamada `value`.

No entanto, o componente `Form` chama `useFormInput` *duas vezes*:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

É por isso que funciona como se estivéssemos declarando duas variáveis de estado separadas!

**Os Hooks personalizados permitem compartilhar *lógica com estado* e não *o próprio estado*. Cada chamada a um Hook é completamente independente de qualquer outra chamada ao mesmo Hook.** É por isso que as duas sandboxes acima são completamente equivalentes. Se desejar, role para cima e compare-as. O comportamento antes e depois de extrair um Hook personalizado é idêntico.

Quando você precisa compartilhar o próprio estado entre vários componentes, [eleve-o e passe-o como propriedade](/learn/sharing-state-between-components) em vez disso.

## Passando valores reativos entre Hooks {/*passing-reactive-values-between-hooks*/}

O código dentro dos seus Hooks personalizados será executado novamente durante cada nova renderização do seu componente. É por isso que, assim como os componentes, os Hooks personalizados [precisam ser puros](/learn/keeping-components-pure). Pense no código dos Hooks personalizados como parte do corpo do seu componente!

Como os Hooks personalizados são renderizados juntamente com o seu componente, eles sempre recebem as props e o estado mais recentes. Para entender o que isso significa, considere este exemplo de sala de bate-papo. Altere a URL do servidor ou a sala de bate-papo:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo{' '}
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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('Nova mensagem: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL do servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bem vindo(a) à sala {roomId}</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real conectaria de fato ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Espera-se que serverUrl seja uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Espera-se que roomId seja uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '" sala em ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de "' + roomId + '" sala em ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'message') {
        throw Error('Apenas o evento "message" é suportado.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Quando você altera `serverUrl` ou `roomId`, o efeito ["reage" às suas mudanças](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) e ressincroniza. Você pode observar pelas mensagens no console que o chat se reconecta toda vez que você altera as dependências do seu efeito.

Agora mova o código do efeito para um Hook personalizado:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nova mensagem: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Isso permite que seu componente `ChatRoom` chame o seu Hook personalizado sem se preocupar com o funcionamento interno:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL do servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bem vindo(a) à sala {roomId}</h1>
    </>
  );
}
```

Isso parece muito mais simples! (Mas faz a mesma coisa.)

Observe que a lógica *ainda responde* às mudanças nas props e no estado. Experimente editar a URL do servidor ou a sala selecionada:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo{' '}
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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL do servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bem vindo(a) à sala {roomId}</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nova mensagem: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real conectaria de fato ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Espera-se que serverUrl seja uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Espera-se que roomId seja uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '" sala em ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de "' + roomId + '" sala em ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'message') {
        throw Error('Apenas o evento "message" é suportado.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe como você está recebendo o valor de retorno de um Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

e passando como entrada para outro Hook:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Sempre que o componente `ChatRoom` é renderizado novamente, ele passa as últimas `roomId` e `serverUrl` para o seu Hook. É por isso que o seu efeito se reconecta ao chat sempre que os valores forem diferentes após uma nova renderização. (Se você já trabalhou com software de processamento de áudio ou vídeo, encadear Hooks dessa forma pode lembrar o encadeamento de efeitos visuais ou de áudio. É como se a saída do `useState` "alimentasse" a entrada do `useChatRoom`.)

### Passando manipuladores de eventos para Hooks personalizados {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Conforme você começa a usar o `useChatRoom` em mais componentes, pode ser desejável permitir que os componentes personalizem seu comportamento. Por exemplo, atualmente, a lógica do que fazer quando uma mensagem chega está codificada diretamente no Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nova mensagem: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Digamos que você queira mover essa lógica de volta para o seu componente:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nova mensagem: ' + msg);
    }
  });
  // ...
```

Para fazer isso funcionar, altere o seu Hook personalizado para receber `onReceiveMessage` como uma das opções nomeadas:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Todas as dependências declaradas
}
```

Isso funcionará, mas há mais uma melhoria que você pode fazer quando seu Hook personalizado aceita manipuladores de eventos.

Adicionar uma dependência em `onReceiveMessage` não é ideal, pois fará com que o chat se reconecte sempre que o componente for renderizado novamente. [Encapsule esse manipulador de eventos em um Event Effect para removê-lo das dependências:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas as dependências declaradas
}
```

Agora, o chat não será reconectado toda vez que o componente `ChatRoom` for renderizado novamente. Aqui está um exemplo completo de como passar um manipulador de eventos para um Hook personalizado com o qual você pode brincar:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo{' '}
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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nova mensagem: ' + msg);
    }
  });

  return (
    <>
      <label>
        URL do servidor:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bem vindo(a) à sala {roomId}</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real conectaria de fato ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Espera-se que serverUrl seja uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Espera-se que roomId seja uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '" sala em ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado de "' + roomId + '" sala em ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Não é possível adicionar o manipulador duas vezes.');
      }
      if (event !== 'message') {
        throw Error('Apenas o evento "message" é suportado.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe como agora você não precisa mais saber *como* `useChatRoom` funciona para poder usá-lo. Você poderia adicioná-lo a qualquer outro componente, passar outras opções e ele funcionaria da mesma maneira. Esse é o poder dos Hooks personalizados.

## Quando usar Hooks personalizados {/*when-to-use-custom-hooks*/}

Você não precisa extrair um Hook personalizado para cada pequeno trecho de código duplicado. Alguma duplicação é aceitável. Por exemplo, extrair um Hook `useFormInput` para envolver uma única chamada `useState` como feito anteriormente provavelmente é desnecessário.

No entanto, sempre que você escrever um Efeito, considere se seria mais claro encapsulá-lo também em um Hook personalizado. [Você não deve precisar de efeitos com muita frequência,](/learn/you-might-not-need-an-effect) então, se você estiver escrevendo um, significa que precisa "sair do mundo React" para sincronizar com algum sistema externo ou fazer algo para o qual o React não tenha uma API embutida. encapsular o Efeito em um Hook personalizado permite que você comunique claramente sua intenção e como os dados fluem por ele.

Por exemplo, considere um componente `ShippingForm` que exibe dois dropdowns: um mostra a lista de cidades e outro mostra a lista de áreas na cidade selecionada. Você pode começar com um código que se parece com isso:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Este efeito busca cidades para um país
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Esse efeito busca as áreas para a cidade selecionada.
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Embora este código seja bastante repetitivo, [é correto manter esses efeitos separados um do outro.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Eles sincronizam duas coisas diferentes, portanto, não deve-se mesclá-los em um único efeito. Em vez disso, você pode simplificar o componente `ShippingForm` acima extraindo a lógica comum entre eles para o seu próprio Hook `useData`:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Agora você pode substituir os dois efeitos nos componentes `ShippingForm` por chamadas ao `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Extrair um Hook personalizado torna o fluxo de dados explícito. Você fornece a `url` como entrada e obtém a `data` como saída. Ao "esconder" seu efeito dentro do `useData`, você também impede que alguém que trabalhe no componente `ShippingForm` adicione [dependências desnecessárias](/learn/removing-effect-dependencies) a ele. Com o tempo, a maioria dos efeitos do seu aplicativo estará nos Hooks personalizados.

<DeepDive>

#### Mantenha seus Hooks personalizados focados em casos de uso concretos de alto nível {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Comece escolhendo o nome do seu Hook personalizado. Se você tiver dificuldade em escolher um nome claro, isso pode significar que seu Efeito está muito acoplado à lógica do restante do seu componente e ainda não está pronto para ser extraído.

Idealmente, o nome do seu Hook personalizado deve ser claro o suficiente para que até mesmo uma pessoa que não escreve código com frequência possa ter uma boa ideia do que seu Hook personalizado faz, o que ele recebe e o que retorna:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Quando você se sincroniza com um sistema externo, o nome do seu Hook personalizado pode ser mais técnico e usar jargões específicos desse sistema. Isso é bom, desde que seja claro para uma pessoa familiarizada com esse sistema:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Mantenha os Hooks personalizados focados em casos de uso concretos de alto nível.** Evite criar e usar Hooks personalizados de "ciclo de vida" que atuem como alternativas e encapsuladores de conveniência para a própria API `useEffect`:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Por exemplo, este Hook `useMount` tenta garantir que determinado código seja executado apenas "no momento da montagem":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Evite: usar Hooks personalizados de "ciclo de vida"
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Evite: criar Hooks personalizados de "ciclo de vida"
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook `useEffect` está com uma dependência faltando: 'fn'
}
```

**Hooks personalizados de "ciclo de vida", como `useMount`, não se encaixam bem no paradigma do React.** Por exemplo, este exemplo de código contém um erro (ele não "reage" às alterações em `roomId` ou `serverUrl`), mas o linter não irá alertá-lo sobre isso porque o linter verifica apenas chamadas diretas de `useEffect`. Ele não saberá sobre o seu Hook.

Se você está escrevendo um efeito, comece usando a API do React diretamente:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Bom: dois efeitos separados por finalidade

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Em seguida, você pode (mas não é obrigatório) extrair Hooks personalizados para diferentes casos de uso de alto nível:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Ótimo: Hooks personalizados nomeados de acordo com sua finalidade
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Um bom Hook personalizado torna o código de chamada mais declarativo, restringindo o que ele faz.** Por exemplo, `useChatRoom(options)` pode apenas se conectar à sala de bate-papo, enquanto `useImpressionLog(eventName, extraData)` pode apenas enviar um registro de impressão para a análise. Se a API do seu Hook personalizado não restringir os casos de uso e for muito abstrata, a longo prazo é provável que introduza mais problemas do que resolve.

</DeepDive>

### Hooks personalizados ajudam na migração para padrões melhores {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Os efeitos são uma ["porta de escape"](/learn/escape-hatches): você os utiliza quando precisa "sair do React" e não há uma solução interna melhor para o seu caso de uso. Com o tempo, o objetivo da equipe do React é reduzir ao mínimo o número de efeitos em seu aplicativo, fornecendo soluções mais específicas para problemas mais específicos. Encapsular seus efeitos em Hooks personalizados facilita a atualização do seu código quando essas soluções estiverem disponíveis.

Vamos voltar a este exemplo:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progresso Salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

No exemplo acima, `useOnlineStatus` é implementado com um par de [`useState`](/reference/react/useState) e [`useEffect`](/reference/react/useEffect). No entanto, essa não é a melhor solução possível. Existem alguns casos específicos que não são considerados. Por exemplo, assume-se que quando o componente é montado, `isOnline` já é `true`, mas isso pode estar errado se a rede já estiver offline. Você pode usar a API do navegador [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) para verificar isso, mas usá-la diretamente não funcionaria no servidor para gerar o HTML inicial. Em resumo, este código pode ser aprimorado.

Felizmente, o React 18 inclui uma API dedicada chamada [`useSyncExternalStore`](/reference/react/useSyncExternalStore) que cuida de todos esses problemas para você. Aqui está como o seu Hook `useOnlineStatus` pode ser reescrito para aproveitar essa nova API:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Conectado' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progresso Salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Como obter o valor no cliente
    () => true // Como obter o valor no servidor
  );
}

```

</Sandpack>

Observe como **você não precisou alterar nenhum dos componentes** para fazer essa migração:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Este é outro motivo pelo qual envolver efeitos em Hooks personalizados frequentemente é benéfico:

1. Você torna o fluxo de dados de ida e volta dos seus efeitos muito explícito.
2. Você permite que seus componentes se concentrem na intenção em vez de na implementação exata dos seus efeitos.
3. Quando o React adiciona novos recursos, você pode remover esses efeitos sem precisar alterar nenhum dos seus componentes.

Similar a um [sistema de design](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), você pode achar útil começar a extrair idiomatismos comuns dos componentes do seu aplicativo em Hooks personalizados. Isso manterá o código dos seus componentes focado na intenção e permitirá evitar escrever efeitos brutos com frequência. Muitos Hooks personalizados excelentes são mantidos pela comunidade do React.

<DeepDive>

#### O React fornecerá alguma solução interna para busca de dados? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Ainda estamos trabalhando nos detalhes, mas esperamos que no futuro você escreva a busca de dados da seguinte forma:

```js {1,4,6}
import { use } from 'react'; // Não disponível ainda!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Se você usar Hooks personalizados como `useData` mencionado acima em seu aplicativo, será necessário fazer menos alterações para migrar para a abordagem eventualmente recomendada do que se você escrever efeitos brutos em cada componente manualmente. No entanto, a abordagem antiga ainda funcionará bem, então, se você se sentir confortável escrevendo efeitos brutos, pode continuar fazendo isso.

</DeepDive>

### Há mais de uma maneira de fazer isso {/*there-is-more-than-one-way-to-do-it*/}

Vamos supor que você queira implementar uma animação de fade-in *do zero* usando a API do navegador [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). Você pode começar com um efeito que configura um loop de animação. Durante cada quadro da animação, você poderia alterar a opacidade do nó do DOM que você [mantém em uma referência (ref)](/learn/manipulating-the-dom-with-refs) até que ela atinja o valor `1`. Seu código pode começar assim:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Ainda temos mais quadros para renderizar
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Bem vindo(a)
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Para tornar o componente mais legível, você pode extrair a lógica para um Hook personalizado `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bem vindo(a)
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Ainda temos mais quadros para renderizar
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Você pode manter o código do `useFadeIn` como está, mas também pode refatorá-lo ainda mais. Por exemplo, você pode extrair a lógica para configurar o loop de animação do `useFadeIn` para um Hook personalizado `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bem vindo(a)
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

No entanto, você *não precisou* fazer isso. Assim como com funções regulares, você decide em última instância onde definir os limites entre diferentes partes do seu código. Você também pode adotar uma abordagem muito diferente. Em vez de manter a lógica no efeito, você poderia mover a maior parte da lógica imperativa para uma [classe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) JavaScript:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bem vindo(a)
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Ainda temos mais quadros para renderizar
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Os efeitos permitem conectar o React a sistemas externos. Quanto mais coordenação entre efeitos for necessária (por exemplo, para encadear várias animações), mais faz sentido extrair essa lógica *completamente* dos efeitos e hooks, como no sandbox anterior. Em seguida, o código que você extraiu se torna *o sistema externo*. Isso permite que seus efeitos permaneçam simples, pois eles só precisam enviar mensagens para o sistema que você moveu para fora do React.

Os exemplos acima pressupõem que a lógica do fade-in precisa ser escrita em JavaScript. No entanto, essa animação específica de fade-in é mais simples e muito mais eficiente de ser implementada com uma simples [Animação CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Bem vindo(a)
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Às vezes, você nem precisa de um Hook!

<Recap>

- Hooks personalizados permitem compartilhar lógica entre componentes.
- Hooks personalizados devem ser nomeados começando com `use`, seguido por uma letra maiúscula.
- Hooks personalizados compartilham apenas a lógica relacionada ao estado, não o estado em si.
- É possível passar valores reativos de um Hook para outro, e eles se mantêm atualizados.
- Todos os Hooks são executados novamente sempre que o componente é renderizado novamente.
- O código dos seus Hooks personalizados deve ser puro, assim como o código do seu componente.
- Encapsular manipuladores de eventos recebidos por Hooks personalizados em efeitos de Evento.
- Não crie Hooks personalizados como `useMount`. Mantenha o propósito deles específico.
- Cabe a você escolher como e onde definir os limites do seu código.

</Recap>

<Challenges>

#### Extrair um Hook `useCounter` {/*extract-a-usecounter-hook*/}

Este componente usa uma variável de estado e um efeito para exibir um número que incrementa a cada segundo. Extraia essa lógica para um Hook personalizado chamado `useCounter`. Seu objetivo é fazer com que a implementação do componente `Counter` fique exatamente assim:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Segundos que se passaram: {count}</h1>;
}
```

<<<<<<< HEAD
Você precisará escrever seu Hook personalizado no arquivo `useCounter.js` e importá-lo no arquivo `Counter.js`.
=======
You'll need to write your custom Hook in `useCounter.js` and import it into the `App.js` file.
>>>>>>> 2bfa7a628b0534bb0d437ff7520a72010ab970c3

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
// Escreva seu Hook personalizado neste arquivo!
```

</Sandpack>

<Solution>

Seu código deve se parecer com isto:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Observe que `App.js` não precisa mais importar `useState` ou `useEffect`.

</Solution>

#### Torne o atraso do contador configurável {/*make-the-counter-delay-configurable*/}

Neste exemplo, há uma variável de estado `delay` controlada por um slider, mas seu valor não está sendo utilizado. Passe o valor de `delay` para o seu Hook personalizado `useCounter` e altere o Hook `useCounter` para usar o `delay` passado em vez de codificar `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        duração do Tick: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Passe o `delay` para o seu Hook com `useCounter(delay)`. Em seguida, dentro do Hook, use `delay` em vez do valor codificado `1000`. Você precisará adicionar `delay` às dependências do seu efeito. Isso garante que uma alteração no `delay` redefina o intervalo.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        duração do Tick: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Extrair `useInterval` fora do `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Atualmente, seu Hook `useCounter` faz duas coisas. Ele configura um intervalo e também incrementa uma variável de estado a cada intervalo. Separe a lógica que configura o intervalo em um Hook separado chamado `useInterval`. Ele deve receber dois argumentos: o callback `onTick` e o `delay`. Após essa alteração, a implementação do seu `useCounter` deve ficar assim:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Escreva `useInterval` no arquivo `useInterval.js` e importe-o no arquivo `useCounter.js`.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Escreva seu Hook aqui!
```

</Sandpack>

<Solution>

A lógica dentro do `useInterval` deve configurar e limpar o intervalo. Não precisa fazer mais nada.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Observe que há um pequeno problema com essa solução, que você resolverá no próximo desafio.

</Solution>

#### Corrigir um intervalo que é resetado {/*fix-a-resetting-interval*/}

No exemplo dado, existem *dois* intervalos separados.

O componente `App` chama `useCounter`, que por sua vez chama `useInterval` para atualizar o contador a cada segundo. Mas o componente `App` *também* chama `useInterval` para atualizar aleatoriamente a cor de fundo da página a cada dois segundos.

Por algum motivo, o callback que atualiza o fundo da página nunca é executado. Adicione alguns logs dentro do `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Configurando um intervalo com atraso ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Limpando um intervalo com atraso ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Os logs correspondem ao que você espera que aconteça? Se alguns de seus efeitos parecem ser ressincronizados desnecessariamente, você consegue adivinhar qual dependência está causando isso? Existe alguma maneira de [remover essa dependência](/learn/removing-effect-dependencies) do seu efeito?

Depois de corrigir o problema, você deve esperar que o fundo da página seja atualizado a cada dois segundos.

<Hint>

Parece que o seu Hook `useInterval` aceita um ouvinte de evento como argumento. Você consegue pensar em alguma maneira de encapsular esse ouvinte de evento para que ele não precise ser uma dependência do seu Effect?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Dentro do `useInterval`, encapsule o callback do tick em um Evento de Efeito, como você fez [anteriormente nesta página.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Isso permitirá que você omita `onTick` das dependências do seu Effect. O Effect não será ressincronizado a cada re-renderização do componente, portanto, o intervalo de alteração da cor de fundo da página não será redefinido a cada segundo antes de ter a chance de disparar.

Com essa alteração, ambos os intervalos funcionam como esperado e não interferem um no outro:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Segundos que se passaram: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implemente um movimento impressionante {/*implement-a-staggering-movement*/}

Neste exemplo, o Hook `usePointerPosition()` rastreia a posição atual do ponteiro. Tente mover o cursor do mouse ou o dedo sobre a área de visualização e observe o ponto vermelho seguir o seu movimento. Sua posição é armazenada na variável `pos1`.

Na verdade, existem cinco (!) pontos vermelhos diferentes sendo renderizados. Você não os vê porque atualmente todos aparecem na mesma posição. Isso é o que você precisa corrigir. Em vez disso, você deseja implementar um movimento "escalado": cada ponto deve "seguir" o caminho do ponto anterior. Por exemplo, se você mover rapidamente o cursor, o primeiro ponto deve segui-lo imediatamente, o segundo ponto deve seguir o primeiro ponto com um pequeno atraso, o terceiro ponto deve seguir o segundo ponto e assim por diante.

Você precisa implementar o Hook personalizado `useDelayedValue`. Sua implementação atual retorna o `value` fornecido a ele. Em vez disso, você deseja retornar o valor de volta de `delay` milissegundos atrás. Você pode precisar de algum estado e um Effect para fazer isso.

Após você implementar o `useDelayedValue`, você deverá ver os pontos se movendo um após o outro.

<Hint>

Você precisará armazenar o `delayedValue` como uma variável de estado dentro do seu Hook personalizado. Quando o `value` mudar, você desejará executar um efeito. Este efeito deve atualizar o `delayedValue` após o `delay`. Pode ser útil usar `setTimeout` para isso.

Este efeito precisa de limpeza? Por quê ou por que não?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implemente este Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Aqui está uma versão funcional. Você mantém o `delayedValue` como uma variável de estado. Quando o `value` é atualizado, seu efeito agenda um timeout para atualizar o `delayedValue`. É por isso que o `delayedValue` sempre fica "atrasado" em relação ao valor real.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Observe que este efeito *não precisa* de uma limpeza. Se você chamasse `clearTimeout` na função de limpeza, cada vez que o `value` mudasse, ele redefiniria o timeout já agendado. Para manter o movimento contínuo, você deseja que todos os timeouts sejam disparados.

</Solution>

</Challenges>
