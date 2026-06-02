---
title: 'Lifecycle of Reactive Effects'
---

<Intro>

Efeitos têm um ciclo de vida diferente dos componentes. Componentes podem montar, atualizar ou desmontar. Um Efeito só pode fazer duas coisas: iniciar a sincronização de algo e, mais tarde, parar essa sincronização. Esse ciclo pode acontecer várias vezes se o seu Efeito depender de props e estado que mudam ao longo do tempo. O React fornece uma regra de linter para verificar se você especificou as dependências do seu Efeito corretamente. Isso mantém seu Efeito sincronizado com as últimas props e estado.

</Intro>

<YouWillLearn>

- Como o ciclo de vida de um Efeito é diferente do ciclo de vida de um componente
- Como pensar sobre cada Efeito individualmente
- Quando seu Efeito precisa ressincronizar e por quê
- Como as dependências do seu Efeito são determinadas
- O que significa um valor ser reativo
- O que significa um array de dependências vazio
- Como o React verifica se suas dependências estão corretas com um linter
- O que fazer quando você discorda do linter

</YouWillLearn>

## O ciclo de vida de um Efeito {/*o-ciclo-de-vida-de-um-efeito*/}

Todo componente React passa pelo mesmo ciclo de vida:

- Um componente _monta_ quando é adicionado à tela.
- Um componente _atualiza_ quando recebe novas props ou estado, geralmente em resposta a uma interação.
- Um componente _desmonta_ quando é removido da tela.

**É uma boa maneira de pensar sobre componentes, mas _não_ sobre Efeitos.** Em vez disso, tente pensar em cada Efeito independentemente do ciclo de vida do seu componente. Um Efeito descreve como [sincronizar um sistema externo](/learn/synchronizing-with-effects) com as props e o estado atuais. À medida que seu código muda, a sincronização precisará acontecer com mais ou menos frequência.

Para ilustrar este ponto, considere este Efeito que conecta seu componente a um servidor de chat:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

O corpo do seu Efeito especifica como **iniciar a sincronização:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

A função de limpeza retornada pelo seu Efeito especifica como **parar a sincronização:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitivamente, você pode pensar que o React **iniciaria a sincronização** quando seu componente montasse e **pararia a sincronização** quando seu componente desmontasse. No entanto, este não é o fim da história! Às vezes, pode ser necessário **iniciar e parar a sincronização várias vezes** enquanto o componente permanece montado.

Vamos ver _por que_ isso é necessário, _quando_ isso acontece e _como_ você pode controlar esse comportamento.

<Note>

Alguns Efeitos não retornam uma função de limpeza. [Na maioria das vezes,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) você vai querer retornar uma - mas se não o fizer, o React se comportará como se você tivesse retornado uma função de limpeza vazia.

</Note>

### Por que a sincronização pode precisar acontecer mais de uma vez {/*por-que-a-sincronizacao-pode-precisar-acontecer-mais-de-uma-vez*/}

Imagine que este componente `ChatRoom` recebe uma prop `roomId` que o usuário escolhe em um dropdown. Vamos dizer que inicialmente o usuário escolhe a sala `"general"` como `roomId`. Seu aplicativo exibe a sala de chat `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Após a interface do usuário ser exibida, o React executará seu Efeito para **iniciar a sincronização.** Ele se conecta à sala `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta à sala "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Desconecta da sala "general"
    };
  }, [roomId]);
  // ...
```

Até agora, tudo bem.

Mais tarde, o usuário escolhe uma sala diferente no dropdown (por exemplo, `"travel"`). Primeiro, o React atualizará a interface do usuário:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Pense no que deve acontecer a seguir. O usuário vê que `"travel"` é a sala de chat selecionada na interface do usuário. No entanto, o Efeito que foi executado da última vez ainda está conectado à sala `"general"`. **A prop `roomId` mudou, então o que seu Efeito fez naquela época (conectar à sala `"general"`) não corresponde mais à interface do usuário.**

Neste ponto, você quer que o React faça duas coisas:

1. Pare de sincronizar com o `roomId` antigo (desconecte da sala `"general"`)
2. Comece a sincronizar com o novo `roomId` (conecte à sala `"travel"`)

**Felizmente, você já ensinou ao React como fazer ambas as coisas!** O corpo do seu Efeito especifica como iniciar a sincronização, e sua função de limpeza especifica como parar a sincronização. Tudo o que o React precisa fazer agora é chamá-los na ordem correta e com as props e o estado corretos. Vamos ver exatamente como isso acontece.

### Como o React ressincroniza seu Efeito {/*como-o-react-ressincroniza-seu-efeito*/}

Lembre-se que seu componente `ChatRoom` recebeu um novo valor para sua prop `roomId`. Era `"general"` e agora é `"travel"`. O React precisa ressincronizar seu Efeito para reconectá-lo a uma sala diferente.

Para **parar a sincronização,** o React chamará a função de limpeza que seu Efeito retornou após conectar à sala `"general"`. Como `roomId` era `"general"`, a função de limpeza desconecta da sala `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta à sala "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Desconecta da sala "general"
    };
    // ...
```

Em seguida, o React executará o Efeito que você forneceu durante esta renderização. Desta vez, `roomId` é `"travel"`, então ele **iniciará a sincronização** com a sala de chat `"travel"` (até que sua função de limpeza seja eventualmente chamada também):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta à sala "travel"
    connection.connect();
    // ...
```

Graças a isso, você agora está conectado à mesma sala que o usuário escolheu na interface do usuário. Desastre evitado!

Toda vez que seu componente renderizar novamente com um `roomId` diferente, seu Efeito ressincronizará. Por exemplo, digamos que o usuário mude `roomId` de `"travel"` para `"music"

## Efeitos "reagem" a valores reativos {/*effects-react-to-reactive-values*/}

Seu Efeito lê duas variáveis (`serverUrl` e `roomId`), mas você especificou apenas `roomId` como dependência:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Por que `serverUrl` não precisa ser uma dependência?

Isso ocorre porque `serverUrl` nunca muda devido a uma re-renderização. É sempre o mesmo, não importa quantas vezes o componente re-renderize e por quê. Como `serverUrl` nunca muda, não faria sentido especificá-lo como uma dependência. Afinal, as dependências só fazem algo quando mudam ao longo do tempo!

Por outro lado, `roomId` pode ser diferente em uma re-renderização. **Props, estado e outros valores declarados dentro do componente são _reativos_ porque são calculados durante a renderização e participam do fluxo de dados do React.**

Se `serverUrl` fosse uma variável de estado, seria reativa. Valores reativos devem ser incluídos nas dependências:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props mudam ao longo do tempo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // O estado pode mudar ao longo do tempo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Seu Efeito lê props e estado
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Então você diz ao React que este Efeito "depende" de props e estado
  // ...
}
```

Ao incluir `serverUrl` como uma dependência, você garante que o Efeito se resincronize após a mudança.

Tente alterar a sala de chat selecionada ou editar a URL do servidor neste sandbox:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Sempre que você altera um valor reativo como `roomId` ou `serverUrl`, o Efeito reconecta ao servidor de chat.

### O que um Efeito com dependências vazias significa {/*what-an-effect-with-empty-dependencies-means*/}

O que acontece se você mover `serverUrl` e `roomId` para fora do componente?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Agora o código do seu Efeito não usa *nenhum* valor reativo, então suas dependências podem estar vazias (`[]`).

Pensando da perspectiva do componente, o `[]` vazio na matriz de dependências significa que este Efeito se conecta à sala de chat apenas quando o componente é montado e se desconecta apenas quando o componente é desmontado. (Lembre-se de que o React ainda o [resincronizaria uma vez extra](#how-react-verifies-that-your-effect-can-re-synchronize) em desenvolvimento para testar sua lógica.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No entanto, se você [pensar da perspectiva do Efeito,](#thinking-from-the-effects-perspective) você não precisa pensar em montagem e desmontagem. O importante é que você especificou o que seu Efeito faz para iniciar e parar a sincronização. Hoje, ele não tem dependências reativas. Mas se você quiser que o usuário altere `roomId` ou `serverUrl` ao longo do tempo (e eles se tornariam reativos), o código do seu Efeito não mudará. Você só precisará adicioná-los às dependências.

### Todas as variáveis declaradas no corpo do componente são reativas {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props e estado não são os únicos valores reativos. Valores que você calcula a partir deles também são reativos. Se as props ou o estado mudarem, seu componente será re-renderizado e os valores calculados a partir deles também mudarão. É por isso que todas as variáveis do corpo do componente usadas pelo Efeito devem estar na lista de dependências do Efeito.

Digamos que o usuário possa escolher um servidor de chat no dropdown, mas também possa configurar um servidor padrão nas configurações. Suponha que você já colocou o estado de configurações em um [contexto](/learn/scaling-up-with-reducer-and-context) para que você leia as `settings` desse contexto. Agora você calcula `serverUrl` com base no servidor selecionado das props e no servidor padrão:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId é reativo
  const settings = useContext(SettingsContext); // settings é reativo
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl é reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Seu Efeito lê roomId e serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Então ele precisa resincronizar quando qualquer um deles mudar!
  // ...
}
```

Neste exemplo, `serverUrl` não é uma prop ou uma variável de estado. É uma variável regular que você calcula durante a renderização. Mas é calculada durante a renderização, então pode mudar devido a uma re-renderização. É por isso que é reativa.

**Todos os valores dentro do componente (incluindo props, estado e variáveis no corpo do seu componente) são reativos. Qualquer valor reativo pode mudar em uma re-renderização, então você precisa incluir valores reativos como dependências do Efeito.**

Em outras palavras, os Efeitos "reagem" a todos os valores do corpo do componente.

<DeepDive>

#### Valores globais ou mutáveis podem ser dependências? {/*can-global-or-mutable-values-be-dependencies*/}

Valores mutáveis (incluindo variáveis globais) não são reativos.

**Um valor mutável como [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) não pode ser uma dependência.** É mutável, então pode mudar a qualquer momento completamente fora do fluxo de dados de renderização do React. Mudá-lo não acionaria uma re-renderização do seu componente. Portanto, mesmo que você o especificasse nas dependências, o React *não saberia* para resincronizar o Efeito quando ele mudasse. Isso também quebra as regras do React porque ler dados mutáveis durante a renderização (que é quando você calcula as dependências) quebra a [pureza da renderização.](/learn/keeping-components-pure) Em vez disso, você deve ler e se inscrever em um valor mutável externo com [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Um valor mutável como [`ref.current`](/reference/react/useRef#reference) ou coisas que você lê dele também não pode ser uma dependência.** O objeto ref retornado por `useRef` em si pode ser uma dependência, mas sua propriedade `current` é intencionalmente mutável. Ele permite que você [rastreie algo sem acionar uma re-renderização.](/learn/referencing-values-with-refs) Mas como mudá-lo não aciona uma re-renderização, não é um valor reativo, e o React não saberá para executar seu Efeito novamente quando ele mudar.

Como você aprenderá abaixo nesta página, um linter verificará esses problemas automaticamente.

</DeepDive>

### O React verifica se você especificou todos os valores reativos como dependências {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Se o seu linter estiver [configurado para React,](/learn/editor-setup#linting) ele verificará se todos os valores reativos usados pelo código do seu Efeito estão declarados como suas dependências. Por exemplo, este é um erro de lint porque tanto `roomId` quanto `serverUrl` são reativos:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId é reativo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl é reativo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Algo está errado aqui!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Isso pode parecer um erro do React, mas na verdade o React está apontando um bug no seu código. Tanto `roomId` quanto `serverUrl` podem mudar ao longo do tempo, mas você esqueceu de resincronizar seu Efeito quando eles mudam. Você permanecerá conectado ao `roomId` e `serverUrl` iniciais, mesmo depois que o usuário escolher valores diferentes na interface do usuário.

Para corrigir o bug, siga a sugestão do linter para especificar `roomId` e `serverUrl` como dependências do seu Efeito:

```js {9}
function ChatRoom({ roomId }) { // roomId é reativo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl é reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

Tente esta correção no sandbox acima. Verifique se o erro do linter desapareceu e se o chat reconecta quando necessário.

<Note>

Em alguns casos, o React *sabe* que um valor nunca muda, mesmo que seja declarado dentro do componente. Por exemplo, a função `set` retornada por `useState` e o objeto ref retornado por [`useRef`](/reference/react/useRef) são *estáveis* - eles garantem que não mudarão em uma re-renderização. Valores estáveis não são reativos, então você pode omiti-los da lista. Incluí-los é permitido: eles não mudarão, então não importa.

</Note>

### O que fazer quando você não quer ressincronizar {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

No exemplo anterior, você corrigiu o erro do linter listando `roomId` e `serverUrl` como dependências.

**No entanto, você poderia, em vez disso, "provar" ao linter que esses valores não são valores reativos,** ou seja, que eles *não podem* mudar como resultado de uma nova renderização. Por exemplo, se `serverUrl` e `roomId` não dependem da renderização e sempre têm os mesmos valores, você pode movê-los para fora do componente. Agora eles não precisam ser dependências:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl não é reativo
const roomId = 'general'; // roomId não é reativo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

Você também pode movê-los *para dentro do Effect*. Eles não são calculados durante a renderização, então não são reativos:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl não é reativo
    const roomId = 'general'; // roomId não é reativo
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

**Effects são blocos de código reativos.** Eles ressincronizam quando os valores que você lê dentro deles mudam. Ao contrário dos manipuladores de eventos, que são executados apenas uma vez por interação, os Effects são executados sempre que a sincronização é necessária.

**Você não pode "escolher" suas dependências.** Suas dependências devem incluir todo [valor reativo](#all-variables-declared-in-the-component-body-are-reactive) que você lê no Effect. O linter impõe isso. Às vezes, isso pode levar a problemas como loops infinitos e a seu Effect ressincronizar com muita frequência. Não corrija esses problemas suprimindo o linter! Veja o que tentar em vez disso:

*   **Verifique se seu Effect representa um processo de sincronização independente.** Se seu Effect não sincroniza nada, [ele pode ser desnecessário.](/learn/you-might-not-need-an-effect) Se ele sincroniza várias coisas independentes, [divida-o.](#each-effect-represents-a-separate-synchronization-process)

*   **Se você quiser ler o valor mais recente de props ou state sem "reagir" a ele e ressincronizar o Effect,** você pode dividir seu Effect em uma parte reativa (que você manterá no Effect) e uma parte não reativa (que você extrairá para algo chamado _Evento de Effect_). [Leia sobre separando Eventos de Effects.](/learn/separating-events-from-effects)

*   **Evite depender de objetos e funções como dependências.** Se você cria objetos e funções durante a renderização e depois os lê de um Effect, eles serão diferentes a cada renderização. Isso fará com que seu Effect ressincronize a cada vez. [Leia mais sobre removendo dependências desnecessárias de Effects.](/learn/removing-effect-dependencies)

<Pitfall>

O linter é seu amigo, mas seus poderes são limitados. O linter só sabe quando as dependências estão *erradas*. Ele não sabe qual é a *melhor* maneira de resolver cada caso. Se o linter sugere uma dependência, mas adicioná-la causa um loop, isso não significa que o linter deva ser ignorado. Você precisa alterar o código dentro (ou fora) do Effect para que esse valor não seja reativo e não *precise* ser uma dependência.

Se você tem uma base de código existente, pode ter alguns Effects que suprimem o linter como este:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Nas [próximas](/learn/separating-events-from-effects) [páginas](/learn/removing-effect-dependencies), você aprenderá como corrigir esse código sem quebrar as regras. Vale sempre a pena corrigir!

</Pitfall>

<Recap>

- Componentes podem montar, atualizar e desmontar.
- Cada Effect tem um ciclo de vida separado do componente circundante.
- Cada Effect descreve um processo de sincronização separado que pode *começar* e *parar*.
- Ao escrever e ler Effects, pense a partir da perspectiva de cada Effect individual (como iniciar e parar a sincronização) em vez da perspectiva do componente (como ele monta, atualiza ou desmonta).
- Valores declarados dentro do corpo do componente são "reativos".
- Valores reativos devem ressincronizar o Effect porque eles podem mudar ao longo do tempo.
- O linter verifica se todos os valores reativos usados dentro do Effect são especificados como dependências.
- Todos os erros sinalizados pelo linter são legítimos. Sempre há uma maneira de corrigir o código para não quebrar as regras.

</Recap>

<Challenges>

#### Corrigir reconexão a cada pressionamento de tecla {/*fix-reconnecting-on-every-keystroke*/}

Neste exemplo, o componente `ChatRoom` se conecta à sala de chat quando o componente monta, desconecta quando desmonta e reconecta quando você seleciona uma sala de chat diferente. Esse comportamento está correto, então você precisa mantê-lo funcionando.

No entanto, há um problema. Sempre que você digita na caixa de entrada de mensagens na parte inferior, `ChatRoom` *também* se reconecta ao chat. (Você pode notar isso limpando o console e digitando na entrada.) Corrija o problema para que isso não aconteça.

<Hint>

Você pode precisar adicionar um array de dependências para este Effect. Quais dependências deveriam estar lá?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

Este Effect não tinha um array de dependências, então ele ressincronizou após cada re-renderização. Primeiro, adicione um array de dependências. Em seguida, certifique-se de que cada valor reativo usado pelo Effect seja especificado no array. Por exemplo, `roomId` é reativo (porque é uma prop), então ele deve ser incluído no array. Isso garante que, quando o usuário selecionar uma sala diferente, o chat se reconectará. Por outro lado, `serverUrl` é definido fora do componente. É por isso que ele não precisa estar no array.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### Alternar a sincronização e desativá-la {/*switch-synchronization-on-and-off*/}

Neste exemplo, um Effect se inscreve no evento `pointermove` da janela [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) para mover um ponto rosa na tela. Tente passar o mouse sobre a área de visualização (ou tocar na tela se você estiver em um dispositivo móvel) e veja como o ponto rosa segue seu movimento.

Há também uma caixa de seleção. Marcar a caixa de seleção alterna a variável de estado `canMove`, mas essa variável de estado não é usada em nenhum lugar do código. Sua tarefa é alterar o código para que, quando `canMove` for `false` (a caixa de seleção estiver desmarcada), o ponto pare de se mover. Depois de marcar a caixa de seleção de volta (e definir `canMove` como `true`), o ponto seguirá o movimento novamente. Em outras palavras, se o ponto pode se mover ou não deve permanecer sincronizado com se a caixa de seleção está marcada.

<Hint>

Você não pode declarar um Effect condicionalmente. No entanto, o código dentro do Effect pode usar condições!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Uma solução é envolver a chamada `setPosition` em uma condição `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Alternativamente, você poderia envolver a lógica de *inscrição de eventos* em uma condição `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

Em ambos esses casos, `canMove` é uma variável reativa que você lê dentro do Effect. É por isso que ela deve ser especificada na lista de dependências do Effect. Isso garante que o Effect ressincronize após cada alteração em seu valor.

</Solution>

#### Investigar um bug de valor obsoleto {/*investigate-a-stale-value-bug*/}

Neste exemplo, o ponto rosa deve se mover quando a caixa de seleção está marcada e parar de se mover quando a caixa de seleção está desmarcada. A lógica para isso já foi implementada: o manipulador de eventos `handleMove` verifica a variável de estado `canMove`.

No entanto, por algum motivo, a variável de estado `canMove` dentro de `handleMove` parece estar "obsoleta": é sempre `true`, mesmo depois de você desmarcar a caixa de seleção. Como isso é possível? Encontre o erro no código e corrija-o.

<Hint>

Se você vir uma regra de linter sendo suprimida, remova a supressão! É aí que os erros geralmente estão.

</Hint>

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

<Solution>

O problema com o código original era a supressão do linter de dependência. Se você remover a supressão, verá que este Effect depende da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Todo valor reativo deve ser especificado como dependência, ou ele pode potencialmente ficar obsoleto com o tempo!

O autor do código original "mentiu" para o React dizendo que o Effect não dependia (`[]`) de nenhum valor reativo. É por isso que o React não ressincronizou o Effect após `canMove` ter mudado (e `handleMove` com ele). Como o React não ressincronizou o Effect, o `handleMove` anexado como um ouvinte é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, que é por que `handleMove` da renderização inicial sempre verá esse valor.

**Se você nunca suprimir o linter, nunca terá problemas com valores obsoletos.** Existem algumas maneiras diferentes de resolver esse bug, mas você deve sempre começar removendo a supressão do linter. Em seguida, altere o código para corrigir o erro do linter.

Você pode alterar as dependências do Effect para `[handleMove]`, mas como será uma função recém-definida para cada renderização, você pode muito bem remover o array de dependências completamente. Então o Effect *irá* ressincronizar após cada re-renderização:

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
  });

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

Esta solução funciona, mas não é ideal. Se você colocar `console.log('Resubscribing')` dentro do Effect, notará que ele ressuscita após cada re-renderização. Ressuscitar é rápido, mas ainda seria bom evitar fazer isso com tanta frequência.

Uma correção melhor seria mover a função `handleMove` *para dentro* do Effect. Então `handleMove` não será um valor reativo, e seu Effect não dependerá de uma função. Em vez disso, ele precisará depender de `canMove`, que seu código agora lê de dentro do Effect. Isso corresponde ao comportamento que você desejava, já que seu Effect agora permanecerá sincronizado com o valor de `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Tente adicionar `console.log('Resubscribing')` dentro do corpo do Effect e note que agora ele só ressuscita quando você alterna a caixa de seleção (`canMove` muda) ou edita o código. Isso o torna melhor do que a abordagem anterior que sempre ressuscita.

Você aprenderá uma abordagem mais geral para esse tipo de problema em [Separando Eventos de Effects.](/learn/separating-events-from-effects)

</Solution>

#### Corrigir uma chave de conexão {/*fix-a-connection-switch*/}

Neste exemplo, o serviço de chat em `chat.js` expõe duas APIs diferentes: `createEncryptedConnection` e `createUnencryptedConnection`. O componente raiz `App` permite que o usuário escolha se deseja usar criptografia ou não, e então passa o método de API correspondente para o componente filho `ChatRoom` como a prop `createConnection`.

Observe que, inicialmente, os logs do console indicam que a conexão não está criptografada. Tente marcar a caixa de seleção: nada acontecerá. No entanto, se você mudar a sala selecionada depois disso, o chat se reconectará *e* ativará a criptografia (como você verá nas mensagens do console). Este é um bug. Corrija o bug para que marcar a caixa de seleção *também* cause a reconexão do chat.

<Hint>

Suprimir o linter é sempre suspeito. Isso poderia ser um bug?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Ativar criptografia
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando a "' + roomId + '... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado de "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado de "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Se você remover a supressão do linter, verá um erro de lint. O problema é que `createConnection` é uma prop, então é um valor reativo. Ele pode mudar com o tempo! (E de fato, deveria - quando o usuário marca a caixa de seleção, o componente pai passa um valor diferente da prop `createConnection`.) É por isso que ele deve ser uma dependência. Inclua-o na lista para corrigir o bug:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Ativar criptografia
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando a "' + roomId + '... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado de "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado de "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

É correto que `createConnection` seja uma dependência. No entanto, este código é um pouco frágil porque alguém pode editar o componente `App` para passar uma função inline como valor desta prop. Nesse caso, seu valor será diferente toda vez que o componente `App` for renderizado novamente, então o Effect pode ressincronizar com muita frequência. Para evitar isso, você pode passar `isEncrypted` para baixo em vez disso:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Ativar criptografia
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando a "' + roomId + '... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado de "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando a "' + roomId + '... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado de "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Nesta versão, o componente `App` passa uma prop booleana em vez de uma função. Dentro do Effect, você decide qual função usar. Como `createEncryptedConnection` e `createUnencryptedConnection` são declaradas fora do componente, elas não são reativas e não precisam ser dependências. Você aprenderá mais sobre isso em [Removendo Dependências de Efeitos.](/learn/removing-effect-dependencies)

</Solution>

#### Preencher uma cadeia de caixas de seleção {/*populate-a-chain-of-select-boxes*/}

Neste exemplo, existem duas caixas de seleção. Uma caixa de seleção permite que o usuário escolha um planeta. Outra caixa de seleção permite que o usuário escolha um lugar *nesse planeta.* A segunda caixa ainda não funciona. Sua tarefa é fazê-la mostrar os lugares do planeta escolhido.

Veja como a primeira caixa de seleção funciona. Ela preenche o estado `planetList` com o resultado da chamada da API `"/planets"`. O ID do planeta atualmente selecionado é mantido na variável de estado `planetId`. Você precisa encontrar onde adicionar algum código adicional para que a variável de estado `placeList` seja preenchida com o resultado da chamada da API `"/planets/" + planetId + "/places"`.

Se você implementar isso corretamente, selecionar um planeta deve preencher a lista de lugares. Mudar um planeta deve mudar a lista de lugares.

<Hint>

Se você tem dois processos de sincronização independentes, precisa escrever dois Effects separados.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Buscada uma lista de planetas.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Seleciona o primeiro planeta
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Escolha um planeta:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Escolha um lugar:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Você vai para: {placeId || '???'} em {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Esperado URL como "/planets/earth/places". Recebido: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Esperado URL como "/planets" ou "/planets/earth/places". Recebido: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terra'
      }, {
        id: 'venus',
        name: 'Vênus'
      }, {
        id: 'mars',
        name: 'Marte'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) espera um argumento string. ' +
      'Recebido: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espanha'
        }, {
          id: 'vietnam',
          name: 'Vietnã'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('ID de planeta desconhecido: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Existem dois processos de sincronização independentes:

- A primeira caixa de seleção está sincronizada com a lista remota de planetas.
- A segunda caixa de seleção está sincronizada com a lista remota de lugares para o `planetId` atual.

É por isso que faz sentido descrevê-los como dois Effects separados. Aqui está um exemplo de como você pode fazer isso:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Buscada uma lista de planetas.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Seleciona o primeiro planeta
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nada está selecionado na primeira caixa ainda
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Buscada uma lista de lugares em "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Seleciona o primeiro lugar
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Escolha um planeta:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Escolha um lugar:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Você vai para: {placeId || '???'} em {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Esperado URL como "/planets/earth/places". Recebido: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Esperado URL como "/planets" ou "/planets/earth/places". Recebido: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terra'
      }, {
        id: 'venus',
        name: 'Vênus'
      }, {
        id: 'mars',
        name: 'Marte'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) espera um argumento string. ' +
      'Recebido: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espanha'
        }, {
          id: 'vietnam',
          name: 'Vietnã'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('ID de planeta desconhecido: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Este código é um pouco repetitivo. No entanto, isso não é um bom motivo para combiná-lo em um único Effect! Se você fizesse isso, teria que combinar as dependências de ambos os Effects em uma única lista, e então mudar o planeta buscaria novamente a lista de todos os planetas. Effects não são uma ferramenta para reutilização de código.

Em vez disso, para reduzir a repetição, você pode extrair alguma lógica para um Hook personalizado como `useSelectOptions` abaixo:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Escolha um planeta:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Escolha um lugar:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Você vai para: {placeId || '...'} em {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Esperado URL como "/planets/earth/places". Recebido: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Esperado URL como "/planets" ou "/planets/earth/places". Recebido: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terra'
      }, {
        id: 'venus',
        name: 'Vênus'
      }, {
        id: 'mars',
        name: 'Marte'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) espera um argumento string. ' +
      'Recebido: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espanha'
        }, {
          id: 'vietnam',
          name: 'Vietnã'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('ID de planeta desconhecido: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Verifique a aba `useSelectOptions.js` no sandbox para ver como funciona. Idealmente, a maioria dos Effects em sua aplicação acabará sendo substituída por Hooks personalizados, sejam escritos por você ou pela comunidade. Hooks personalizados ocultam a lógica de sincronização, então o componente que chama não sabe sobre o Effect. À medida que você continua trabalhando em seu aplicativo, desenvolverá uma paleta de Hooks para escolher e, eventualmente, não precisará escrever Effects em seus componentes com muita frequência.

</Solution>

</Challenges>