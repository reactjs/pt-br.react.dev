---
title: 'Ciclo de Vida dos Effects Reativos'
---

<Intro>

Effects têm um ciclo de vida diferente do dos componentes. Componentes podem montar, atualizar ou desmontar. Um Effect só pode fazer duas coisas: começar a sincronizar algo e, mais tarde, parar de sincronizar. Esse ciclo pode acontecer várias vezes se o seu Effect depender de props e estado que mudam ao longo do tempo. O React fornece uma regra de linter para verificar se você especificou corretamente as dependências do seu Effect. Isso mantém o seu Effect sincronizado com as props e o estado mais recentes.

</Intro>

<YouWillLearn>

- Como o ciclo de vida de um Effect é diferente do ciclo de vida de um componente
- Como pensar em cada Effect individualmente, de forma isolada
- Quando o seu Effect precisa ressincronizar, e por quê
- Como as dependências do seu Effect são determinadas
- O que significa um valor ser reativo
- O que significa um array de dependências vazio
- Como o React verifica, com um linter, se as suas dependências estão corretas
- O que fazer quando você discorda do linter

</YouWillLearn>

## O ciclo de vida de um Effect {/*the-lifecycle-of-an-effect*/}

Todo componente React passa pelo mesmo ciclo de vida:

- Um componente _monta_ quando é adicionado à tela.
- Um componente _atualiza_ quando recebe novas props ou um novo estado, geralmente em resposta a uma interação.
- Um componente _desmonta_ quando é removido da tela.

**Essa é uma boa forma de pensar sobre componentes, mas _não_ sobre Effects.** Em vez disso, tente pensar em cada Effect de forma independente do ciclo de vida do seu componente. Um Effect descreve como [sincronizar um sistema externo](/learn/synchronizing-with-effects) com as props e o estado atuais. À medida que o seu código muda, a sincronização vai precisar acontecer com mais ou menos frequência.

Para ilustrar esse ponto, considere este Effect que conecta o seu componente a um servidor de chat:

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

O corpo do seu Effect especifica como **começar a sincronizar:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

A função de limpeza retornada pelo seu Effect especifica como **parar de sincronizar:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitivamente, você poderia pensar que o React **começaria a sincronizar** quando o seu componente monta e **pararia de sincronizar** quando o seu componente desmonta. Mas a história não termina aí! Às vezes, também pode ser necessário **começar e parar de sincronizar várias vezes** enquanto o componente continua montado.

Vamos ver _por que_ isso é necessário, _quando_ acontece e _como_ você pode controlar esse comportamento.

<Note>

Alguns Effects não retornam nenhuma função de limpeza. [Na maioria das vezes,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) você vai querer retornar uma--mas, se não retornar, o React vai se comportar como se você tivesse retornado uma função de limpeza vazia.

</Note>

### Por que a sincronização pode precisar acontecer mais de uma vez {/*why-synchronization-may-need-to-happen-more-than-once*/}

Imagine que este componente `ChatRoom` recebe uma prop `roomId` que o usuário escolhe em um dropdown. Digamos que, inicialmente, o usuário escolha a sala `"general"` como `roomId`. O seu app exibe a sala de chat `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Depois que a UI é exibida, o React vai executar o seu Effect para **começar a sincronizar.** Ele se conecta à sala `"general"`:

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

Até aqui, tudo bem.

Mais tarde, o usuário escolhe uma sala diferente no dropdown (por exemplo, `"travel"`). Primeiro, o React vai atualizar a UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Pense no que deveria acontecer em seguida. O usuário vê na UI que `"travel"` é a sala de chat selecionada. No entanto, o Effect que foi executado da última vez ainda está conectado à sala `"general"`. **A prop `roomId` mudou, então o que o seu Effect fez lá atrás (conectar à sala `"general"`) não corresponde mais à UI.**

Neste ponto, você quer que o React faça duas coisas:

1. Parar de sincronizar com o `roomId` antigo (desconectar da sala `"general"`)
2. Começar a sincronizar com o novo `roomId` (conectar à sala `"travel"`)

**Felizmente, você já ensinou o React a fazer essas duas coisas!** O corpo do seu Effect especifica como começar a sincronizar, e a sua função de limpeza especifica como parar de sincronizar. Tudo o que o React precisa fazer agora é chamá-los na ordem correta e com as props e o estado corretos. Vamos ver exatamente como isso acontece.

### Como o React ressincroniza o seu Effect {/*how-react-re-synchronizes-your-effect*/}

Lembre-se de que o seu componente `ChatRoom` recebeu um novo valor para a prop `roomId`. Antes era `"general"`, e agora é `"travel"`. O React precisa ressincronizar o seu Effect para reconectar você a uma sala diferente.

Para **parar de sincronizar,** o React vai chamar a função de limpeza que o seu Effect retornou depois de se conectar à sala `"general"`. Como `roomId` era `"general"`, a função de limpeza desconecta da sala `"general"`:

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

Em seguida, o React vai executar o Effect que você forneceu durante esta renderização. Desta vez, `roomId` é `"travel"`, então ele vai **começar a sincronizar** com a sala de chat `"travel"` (até que a função de limpeza dele também seja chamada em algum momento):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta à sala "travel"
    connection.connect();
    // ...
```

Graças a isso, agora você está conectado à mesma sala que o usuário escolheu na UI. Desastre evitado!

Toda vez que o seu componente renderizar novamente com um `roomId` diferente, o seu Effect vai ressincronizar. Por exemplo, digamos que o usuário mude o `roomId` de `"travel"` para `"music"`. O React vai de novo **parar de sincronizar** o seu Effect chamando a função de limpeza dele (desconectando você da sala `"travel"`). Depois, vai **começar a sincronizar** novamente executando o corpo do Effect com a nova prop `roomId` (conectando você à sala `"music"`).

Por fim, quando o usuário vai para outra tela, `ChatRoom` desmonta. Agora não há mais necessidade de continuar conectado. O React vai **parar de sincronizar** o seu Effect uma última vez e desconectar você da sala de chat `"music"`.

### Pensando da perspectiva do Effect {/*thinking-from-the-effects-perspective*/}

Vamos recapitular tudo o que aconteceu da perspectiva do componente `ChatRoom`:

1. `ChatRoom` montou com `roomId` definido como `"general"`
1. `ChatRoom` atualizou com `roomId` definido como `"travel"`
1. `ChatRoom` atualizou com `roomId` definido como `"music"`
1. `ChatRoom` desmontou

Em cada um desses pontos do ciclo de vida do componente, o seu Effect fez coisas diferentes:

1. O seu Effect se conectou à sala `"general"`
1. O seu Effect se desconectou da sala `"general"` e se conectou à sala `"travel"`
1. O seu Effect se desconectou da sala `"travel"` e se conectou à sala `"music"`
1. O seu Effect se desconectou da sala `"music"`

Agora vamos pensar no que aconteceu da perspectiva do próprio Effect:

```js
  useEffect(() => {
    // O seu Effect se conectou à sala especificada por roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...até se desconectar
      connection.disconnect();
    };
  }, [roomId]);
```

A estrutura deste código pode levar você a enxergar o que aconteceu como uma sequência de períodos de tempo que não se sobrepõem:

1. O seu Effect se conectou à sala `"general"` (até se desconectar)
1. O seu Effect se conectou à sala `"travel"` (até se desconectar)
1. O seu Effect se conectou à sala `"music"` (até se desconectar)

Antes, você estava pensando da perspectiva do componente. Quando você olhava da perspectiva do componente, era tentador pensar em Effects como "callbacks" ou "eventos de ciclo de vida" que disparam em um momento específico, como "depois de uma renderização" ou "antes de desmontar". Essa forma de pensar fica complicada muito rápido, então é melhor evitá-la.

**Em vez disso, sempre foque em um único ciclo de início/parada por vez. Não deveria importar se um componente está montando, atualizando ou desmontando. Tudo o que você precisa fazer é descrever como iniciar a sincronização e como pará-la. Se você fizer isso bem, o seu Effect vai ser resiliente a ser iniciado e parado quantas vezes for necessário.**

Isso pode lembrar você de que não pensa se um componente está montando ou atualizando quando escreve a lógica de renderização que cria JSX. Você descreve o que deveria estar na tela, e o React [resolve o resto.](/learn/reacting-to-input-with-state)

### Como o React verifica se o seu Effect consegue ressincronizar {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Aqui está um exemplo ao vivo com o qual você pode brincar. Pressione "Open chat" para montar o componente `ChatRoom`:

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
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
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

Observe que, quando o componente monta pela primeira vez, você vê três logs:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(apenas em desenvolvimento)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(apenas em desenvolvimento)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Os dois primeiros logs aparecem apenas em desenvolvimento. Em desenvolvimento, o React sempre remonta cada componente uma vez.

**O React verifica se o seu Effect consegue ressincronizar forçando-o a fazer isso imediatamente em desenvolvimento.** Isso pode lembrar você de abrir uma porta e fechá-la uma vez a mais para verificar se a fechadura funciona. O React inicia e para o seu Effect uma vez a mais em desenvolvimento para verificar se [você implementou bem a limpeza dele.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Na prática, o principal motivo para o seu Effect ressincronizar é alguma informação que ele usa ter mudado. Na sandbox acima, mude a sala de chat selecionada. Observe como, quando o `roomId` muda, o seu Effect ressincroniza.

No entanto, também há casos mais incomuns em que a ressincronização é necessária. Por exemplo, tente editar o `serverUrl` na sandbox acima enquanto o chat está aberto. Observe como o Effect ressincroniza em resposta às suas edições no código. No futuro, o React pode adicionar mais recursos que dependem de ressincronização.

### Como o React sabe que precisa ressincronizar o Effect {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Você pode estar se perguntando como o React soube que o seu Effect precisava ressincronizar depois que `roomId` mudou. É porque *você disse ao React* que o código dele depende de `roomId`, incluindo-o na [lista de dependências:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // A prop roomId pode mudar ao longo do tempo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Effect lê roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Então você diz ao React que este Effect "depende de" roomId
  // ...
```

Veja como isso funciona:

1. Você sabia que `roomId` é uma prop, o que significa que ela pode mudar ao longo do tempo.
2. Você sabia que o seu Effect lê `roomId` (então a lógica dele depende de um valor que pode mudar depois).
3. É por isso que você o especificou como dependência do seu Effect (para que ele ressincronize quando `roomId` mudar).

Toda vez que o seu componente renderizar novamente, o React vai olhar o array de dependências que você passou. Se qualquer um dos valores no array for diferente do valor na mesma posição que você passou na renderização anterior, o React vai ressincronizar o seu Effect.

Por exemplo, se você passou `["general"]` durante a renderização inicial e depois passou `["travel"]` na renderização seguinte, o React vai comparar `"general"` e `"travel"`. Esses valores são diferentes (comparados com [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), então o React vai ressincronizar o seu Effect. Por outro lado, se o seu componente renderizar novamente mas `roomId` não tiver mudado, o seu Effect vai continuar conectado à mesma sala.

### Cada Effect representa um processo de sincronização separado {/*each-effect-represents-a-separate-synchronization-process*/}

Resista à tentação de adicionar ao seu Effect uma lógica não relacionada só porque ela precisa rodar ao mesmo tempo que um Effect que você já escreveu. Por exemplo, digamos que você queira enviar um evento de analytics quando o usuário visita a sala. Você já tem um Effect que depende de `roomId`, então pode se sentir tentado a adicionar a chamada de analytics ali:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Mas imagine que, mais tarde, você adicione a este Effect outra dependência que precise restabelecer a conexão. Se este Effect ressincronizar, ele também vai chamar `logVisit(roomId)` para a mesma sala, o que você não pretendia. Registrar a visita **é um processo separado** de conectar. Escreva-os como dois Effects separados:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Cada Effect no seu código deve representar um processo de sincronização separado e independente.**

No exemplo acima, apagar um Effect não quebraria a lógica do outro. Esse é um bom indício de que eles sincronizam coisas diferentes e, portanto, fazia sentido separá-los. Por outro lado, se você dividir uma lógica coesa em Effects separados, o código pode parecer "mais limpo", mas vai ser [mais difícil de manter.](/learn/you-might-not-need-an-effect#chains-of-computations) É por isso que você deve pensar se os processos são o mesmo ou são separados, e não se o código parece mais limpo.

## Effects "reagem" a valores reativos {/*effects-react-to-reactive-values*/}

O seu Effect lê duas variáveis (`serverUrl` e `roomId`), mas você especificou apenas `roomId` como dependência:

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

Isso acontece porque `serverUrl` nunca muda por causa de uma nova renderização. Ele é sempre o mesmo, não importa quantas vezes nem por que o componente renderize novamente. Como `serverUrl` nunca muda, não faria sentido especificá-lo como dependência. Afinal, dependências só fazem alguma coisa quando mudam ao longo do tempo!

Por outro lado, `roomId` pode ser diferente em uma nova renderização. **Props, estado e outros valores declarados dentro do componente são _reativos_ porque são calculados durante a renderização e participam do fluxo de dados do React.**

Se `serverUrl` fosse uma variável de estado, ele seria reativo. Valores reativos precisam ser incluídos nas dependências:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props mudam ao longo do tempo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // O state pode mudar ao longo do tempo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // O seu Effect lê props e state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Então você diz ao React que este Effect "depende de" props e state
  // ...
}
```

Ao incluir `serverUrl` como dependência, você garante que o Effect ressincronize depois que ele mudar.

Tente mudar a sala de chat selecionada ou editar a URL do servidor nesta sandbox:

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
  // Uma implementação real realmente se conectaria ao servidor
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

Sempre que você muda um valor reativo como `roomId` ou `serverUrl`, o Effect se reconecta ao servidor de chat.

### O que significa um Effect com dependências vazias {/*what-an-effect-with-empty-dependencies-means*/}

O que acontece se você mover tanto `serverUrl` quanto `roomId` para fora do componente?

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
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora o código do seu Effect não usa *nenhum* valor reativo, então as dependências dele podem ficar vazias (`[]`).

Pensando da perspectiva do componente, o array de dependências vazio `[]` significa que este Effect se conecta à sala de chat apenas quando o componente monta, e se desconecta apenas quando o componente desmonta. (Lembre-se de que o React ainda [o ressincronizaria uma vez a mais](#how-react-verifies-that-your-effect-can-re-synchronize) em desenvolvimento para testar a sua lógica sob estresse.)


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
  // Uma implementação real realmente se conectaria ao servidor
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

No entanto, se você [pensar da perspectiva do Effect,](#thinking-from-the-effects-perspective) não precisa pensar em montagem e desmontagem. O importante é que você especificou o que o seu Effect faz para começar e parar de sincronizar. Hoje, ele não tem dependências reativas. Mas, se um dia você quiser que o usuário mude `roomId` ou `serverUrl` ao longo do tempo (e eles passariam a ser reativos), o código do seu Effect não vai mudar. Você só vai precisar adicioná-los às dependências.

### Todas as variáveis declaradas no corpo do componente são reativas {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props e estado não são os únicos valores reativos. Os valores que você calcula a partir deles também são reativos. Se as props ou o estado mudarem, o seu componente vai renderizar novamente, e os valores calculados a partir deles também vão mudar. É por isso que todas as variáveis do corpo do componente usadas pelo Effect devem estar na lista de dependências do Effect.

Digamos que o usuário possa escolher um servidor de chat no dropdown, mas também possa configurar um servidor padrão nas configurações. Suponha que você já tenha colocado o estado das configurações em um [contexto](/learn/scaling-up-with-reducer-and-context), então você lê `settings` desse contexto. Agora você calcula o `serverUrl` com base no servidor selecionado vindo das props e no servidor padrão:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId é reativo
  const settings = useContext(SettingsContext); // settings é reativo
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl é reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // O seu Effect lê roomId e serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Então ele precisa ressincronizar quando qualquer um deles mudar!
  // ...
}
```

Neste exemplo, `serverUrl` não é uma prop nem uma variável de estado. É uma variável comum que você calcula durante a renderização. Mas, como é calculada durante a renderização, ela pode mudar por causa de uma nova renderização. É por isso que ela é reativa.

**Todos os valores dentro do componente (incluindo props, estado e variáveis no corpo do seu componente) são reativos. Qualquer valor reativo pode mudar em uma nova renderização, então você precisa incluir os valores reativos como dependências do Effect.**

Em outras palavras, Effects "reagem" a todos os valores do corpo do componente.

<DeepDive>

#### Valores globais ou mutáveis podem ser dependências? {/*can-global-or-mutable-values-be-dependencies*/}

Valores mutáveis (incluindo variáveis globais) não são reativos.

**Um valor mutável como [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) não pode ser uma dependência.** Ele é mutável, então pode mudar a qualquer momento, completamente fora do fluxo de dados de renderização do React. Mudá-lo não acionaria uma nova renderização do seu componente. Portanto, mesmo que você o especificasse nas dependências, o React *não saberia* que precisa ressincronizar o Effect quando ele mudasse. Isso também quebra as regras do React, porque ler dados mutáveis durante a renderização (que é quando você calcula as dependências) quebra a [pureza da renderização.](/learn/keeping-components-pure) Em vez disso, você deve ler e se inscrever em um valor mutável externo com [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Um valor mutável como [`ref.current`](/reference/react/useRef#reference), ou coisas que você lê dele, também não pode ser uma dependência.** O próprio objeto ref retornado por `useRef` pode ser uma dependência, mas a propriedade `current` dele é intencionalmente mutável. Ela permite que você [acompanhe algo sem acionar uma nova renderização.](/learn/referencing-values-with-refs) Mas, como mudá-la não aciona uma nova renderização, ela não é um valor reativo, e o React não vai saber que precisa executar o seu Effect novamente quando ela mudar.

Como você vai aprender mais abaixo nesta página, um linter verifica esses problemas automaticamente.

</DeepDive>

### O React verifica se você especificou cada valor reativo como dependência {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Se o seu linter estiver [configurado para React,](/learn/editor-setup#linting) ele vai verificar se cada valor reativo usado pelo código do seu Effect está declarado como dependência dele. Por exemplo, isto é um erro de lint porque tanto `roomId` quanto `serverUrl` são reativos:

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
  }, []); // <-- Tem algo errado aqui!

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
  // Uma implementação real realmente se conectaria ao servidor
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

Isso pode parecer um erro do React, mas, na verdade, o React está apontando um bug no seu código. Tanto `roomId` quanto `serverUrl` podem mudar ao longo do tempo, mas você está esquecendo de ressincronizar o seu Effect quando eles mudam. Você vai continuar conectado ao `roomId` e ao `serverUrl` iniciais mesmo depois que o usuário escolher valores diferentes na UI.

Para corrigir o bug, siga a sugestão do linter e especifique `roomId` e `serverUrl` como dependências do seu Effect:

```js {9}
function ChatRoom({ roomId }) { // roomId é reativo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl é reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ Todas as dependências declaradas
  // ...
}
```

Teste essa correção na sandbox acima. Verifique se o erro do linter sumiu e se o chat se reconecta quando necessário.

<Note>

Em alguns casos, o React *sabe* que um valor nunca muda, mesmo que ele seja declarado dentro do componente. Por exemplo, a [função `set`](/reference/react/useState#setstate) retornada por `useState` e o objeto ref retornado por [`useRef`](/reference/react/useRef) são *estáveis*--há garantia de que não mudam em uma nova renderização. Valores estáveis não são reativos, então você pode omiti-los da lista. Incluí-los é permitido: eles não vão mudar, então não faz diferença.

</Note>

### O que fazer quando você não quer ressincronizar {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

No exemplo anterior, você corrigiu o erro de lint listando `roomId` e `serverUrl` como dependências.

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

Você também pode movê-los *para dentro do Effect.* Eles não são calculados durante a renderização, então não são reativos:

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

**Effects são blocos de código reativos.** Eles ressincronizam quando os valores que você lê dentro deles mudam. Diferente dos manipuladores de eventos, que só são executados uma vez por interação, Effects são executados sempre que a sincronização é necessária.

**Você não pode "escolher" as suas dependências.** As suas dependências precisam incluir cada [valor reativo](#all-variables-declared-in-the-component-body-are-reactive) que você lê no Effect. O linter garante isso. Às vezes, isso pode levar a problemas como loops infinitos e a um Effect que ressincroniza com frequência demais. Não corrija esses problemas suprimindo o linter! Veja o que tentar em vez disso:

* **Verifique se o seu Effect representa um processo de sincronização independente.** Se o seu Effect não sincroniza nada, [ele pode ser desnecessário.](/learn/you-might-not-need-an-effect) Se ele sincroniza várias coisas independentes, [divida-o.](#each-effect-represents-a-separate-synchronization-process)

* **Se você quiser ler o valor mais recente de props ou do estado sem "reagir" a ele e ressincronizar o Effect,** pode dividir o seu Effect em uma parte reativa (que você vai manter no Effect) e uma parte não reativa (que você vai extrair para algo chamado _Evento de Effect_). [Leia sobre como separar Eventos de Effects.](/learn/separating-events-from-effects)

* **Evite depender de objetos e funções como dependências.** Se você cria objetos e funções durante a renderização e depois os lê em um Effect, eles vão ser diferentes a cada renderização. Isso vai fazer o seu Effect ressincronizar toda vez. [Leia mais sobre como remover dependências desnecessárias de Effects.](/learn/removing-effect-dependencies)

<Pitfall>

O linter é seu amigo, mas os poderes dele são limitados. O linter só sabe quando as dependências estão *erradas*. Ele não sabe *a melhor* forma de resolver cada caso. Se o linter sugere uma dependência, mas adicioná-la causa um loop, isso não significa que o linter deve ser ignorado. Você precisa mudar o código dentro (ou fora) do Effect para que esse valor não seja reativo e não *precise* ser uma dependência.

Se você tem uma base de código existente, pode ter alguns Effects que suprimem o linter assim:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Nas [próximas](/learn/separating-events-from-effects) [páginas](/learn/removing-effect-dependencies), você vai aprender a corrigir esse código sem quebrar as regras. Sempre vale a pena corrigir!

</Pitfall>

<Recap>

- Componentes podem montar, atualizar e desmontar.
- Cada Effect tem um ciclo de vida separado do componente que o contém.
- Cada Effect descreve um processo de sincronização separado que pode *começar* e *parar*.
- Quando você escreve e lê Effects, pense da perspectiva de cada Effect individualmente (como começar e parar a sincronização), e não da perspectiva do componente (como ele monta, atualiza ou desmonta).
- Valores declarados dentro do corpo do componente são "reativos".
- Valores reativos devem ressincronizar o Effect porque podem mudar ao longo do tempo.
- O linter verifica se todos os valores reativos usados dentro do Effect estão especificados como dependências.
- Todos os erros apontados pelo linter são legítimos. Sempre há uma forma de corrigir o código sem quebrar as regras.

</Recap>

<Challenges>

#### Corrija a reconexão a cada tecla digitada {/*fix-reconnecting-on-every-keystroke*/}

Neste exemplo, o componente `ChatRoom` se conecta à sala de chat quando o componente monta, se desconecta quando ele desmonta e se reconecta quando você seleciona uma sala de chat diferente. Esse comportamento está correto, então você precisa mantê-lo funcionando.

No entanto, há um problema. Sempre que você digita no campo de mensagem na parte de baixo, `ChatRoom` *também* se reconecta ao chat. (Você pode perceber isso limpando o console e digitando no campo.) Corrija o problema para que isso não aconteça.

<Hint>

Talvez você precise adicionar um array de dependências a este Effect. Quais dependências deveriam estar nele?

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
  // Uma implementação real realmente se conectaria ao servidor
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

Este Effect não tinha nenhum array de dependências, então ressincronizava depois de cada nova renderização. Primeiro, adicione um array de dependências. Depois, garanta que cada valor reativo usado pelo Effect esteja especificado no array. Por exemplo, `roomId` é reativo (porque é uma prop), então deve ser incluído no array. Isso garante que, quando o usuário seleciona uma sala diferente, o chat se reconecte. Por outro lado, `serverUrl` é definido fora do componente. É por isso que ele não precisa estar no array.

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
  // Uma implementação real realmente se conectaria ao servidor
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

#### Ative e desative a sincronização {/*switch-synchronization-on-and-off*/}

Neste exemplo, um Effect se inscreve no evento [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) da janela para mover um ponto rosa na tela. Tente passar o mouse sobre a área de visualização (ou tocar na tela, se estiver em um dispositivo móvel) e veja como o ponto rosa acompanha o seu movimento.

Também há uma caixa de seleção. Marcar a caixa de seleção alterna a variável de estado `canMove`, mas essa variável de estado não é usada em nenhum lugar do código. A sua tarefa é mudar o código para que, quando `canMove` for `false` (a caixa de seleção estiver desmarcada), o ponto pare de se mover. Depois que você marcar a caixa de seleção de novo (e definir `canMove` como `true`), o ponto deve voltar a acompanhar o movimento. Em outras palavras, se o ponto pode ou não se mover deve permanecer sincronizado com o fato de a caixa de seleção estar marcada.

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

Uma solução é envolver a chamada de `setPosition` em uma condição `if (canMove) { ... }`:

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

Como alternativa, você poderia envolver a lógica de *inscrição no evento* em uma condição `if (canMove) { ... }`:

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

Nos dois casos, `canMove` é uma variável reativa que você lê dentro do Effect. É por isso que ela precisa estar especificada na lista de dependências do Effect. Isso garante que o Effect ressincronize depois de cada mudança no valor dela.

</Solution>

#### Investigue um bug de valor desatualizado {/*investigate-a-stale-value-bug*/}

Neste exemplo, o ponto rosa deveria se mover quando a caixa de seleção está marcada e parar de se mover quando ela está desmarcada. A lógica para isso já foi implementada: o manipulador de eventos `handleMove` verifica a variável de estado `canMove`.

No entanto, por algum motivo, a variável de estado `canMove` dentro de `handleMove` parece estar "desatualizada": ela é sempre `true`, mesmo depois que você desmarca a caixa de seleção. Como isso é possível? Encontre o erro no código e corrija-o.

<Hint>

Se você vir uma regra do linter sendo suprimida, remova a supressão! Normalmente é aí que estão os erros.

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

O problema do código original era suprimir o linter de dependências. Se você remover a supressão, vai ver que este Effect depende da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Todo valor reativo precisa ser especificado como dependência, ou pode ficar desatualizado com o tempo!

Quem escreveu o código original "mentiu" para o React ao dizer que o Effect não depende (`[]`) de nenhum valor reativo. É por isso que o React não ressincronizou o Effect depois que `canMove` mudou (e `handleMove` junto com ele). Como o React não ressincronizou o Effect, o `handleMove` registrado como listener é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, e é por isso que o `handleMove` da renderização inicial vai enxergar esse valor para sempre.

**Se você nunca suprimir o linter, nunca vai ter problemas com valores desatualizados.** Há algumas formas diferentes de resolver este bug, mas você deve sempre começar removendo a supressão do linter. Depois, mude o código para corrigir o erro de lint.

Você pode mudar as dependências do Effect para `[handleMove]`, mas, como ela vai ser uma função definida de novo a cada renderização, é melhor remover o array de dependências de vez. Assim, o Effect *vai* ressincronizar depois de cada nova renderização:

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

Essa solução funciona, mas não é a ideal. Se você colocar `console.log('Resubscribing')` dentro do Effect, vai perceber que ele refaz a inscrição depois de cada nova renderização. Refazer a inscrição é rápido, mas ainda assim seria bom evitar fazer isso com tanta frequência.

Uma correção melhor seria mover a função `handleMove` para *dentro* do Effect. Assim, `handleMove` não vai ser um valor reativo e, portanto, o seu Effect não vai depender de uma função. Em vez disso, ele vai precisar depender de `canMove`, que agora o seu código lê de dentro do Effect. Isso corresponde ao comportamento que você queria, já que agora o seu Effect vai permanecer sincronizado com o valor de `canMove`:

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

Tente adicionar `console.log('Resubscribing')` dentro do corpo do Effect e observe que agora ele só refaz a inscrição quando você alterna a caixa de seleção (`canMove` muda) ou edita o código. Isso torna esta abordagem melhor do que a anterior, que sempre refazia a inscrição.

Você vai aprender uma abordagem mais geral para esse tipo de problema em [Separando Eventos de Effects.](/learn/separating-events-from-effects)

</Solution>

#### Corrija uma troca de conexão {/*fix-a-connection-switch*/}

Neste exemplo, o serviço de chat em `chat.js` expõe duas APIs diferentes: `createEncryptedConnection` e `createUnencryptedConnection`. O componente raiz `App` permite que o usuário escolha se quer usar criptografia ou não e, em seguida, passa o método de API correspondente para o componente filho `ChatRoom` como a prop `createConnection`.

Observe que, inicialmente, os logs do console dizem que a conexão não está criptografada. Tente marcar a caixa de seleção: nada vai acontecer. No entanto, se você mudar a sala selecionada depois disso, o chat vai se reconectar *e* ativar a criptografia (como você vai ver pelas mensagens do console). Isso é um bug. Corrija o bug para que marcar ou desmarcar a caixa de seleção *também* faça o chat se reconectar.

<Hint>

Suprimir o linter é sempre suspeito. Será que isso é um bug?

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
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
import { useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Se você remover a supressão do linter, vai ver um erro de lint. O problema é que `createConnection` é uma prop, então é um valor reativo. Ela pode mudar ao longo do tempo! (E, de fato, deveria--quando o usuário marca a caixa de seleção, o componente pai passa um valor diferente para a prop `createConnection`.) É por isso que ela deve ser uma dependência. Inclua-a na lista para corrigir o bug:

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
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
import { useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Está correto que `createConnection` seja uma dependência. No entanto, este código é um pouco frágil, porque alguém poderia editar o componente `App` para passar uma função inline como valor dessa prop. Nesse caso, o valor dela seria diferente toda vez que o componente `App` renderizasse novamente, e o Effect poderia ressincronizar com frequência demais. Para evitar isso, você pode passar `isEncrypted` para baixo em vez disso:

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
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
import { useEffect } from 'react';
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

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Nesta versão, o componente `App` passa uma prop booleana em vez de uma função. Dentro do Effect, você decide qual função usar. Como tanto `createEncryptedConnection` quanto `createUnencryptedConnection` são declaradas fora do componente, elas não são reativas e não precisam ser dependências. Você vai aprender mais sobre isso em [Removendo Dependências de Effects.](/learn/removing-effect-dependencies)

</Solution>

#### Preencha uma cadeia de caixas de seleção {/*populate-a-chain-of-select-boxes*/}

Neste exemplo, há duas caixas de seleção. Uma delas permite que o usuário escolha um planeta. A outra permite que o usuário escolha um lugar *naquele planeta.* A segunda caixa ainda não funciona. A sua tarefa é fazê-la mostrar os lugares do planeta escolhido.

Veja como a primeira caixa de seleção funciona. Ela preenche o estado `planetList` com o resultado da chamada à API `"/planets"`. O ID do planeta selecionado no momento fica guardado na variável de estado `planetId`. Você precisa descobrir onde adicionar mais código para que a variável de estado `placeList` seja preenchida com o resultado da chamada à API `"/planets/" + planetId + "/places"`.

Se você implementar isso corretamente, selecionar um planeta deve preencher a lista de lugares. Mudar o planeta deve mudar a lista de lugares.

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
        console.log('Fetched a list of planets.');
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
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
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
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
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
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
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
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Há dois processos de sincronização independentes:

- A primeira caixa de seleção é sincronizada com a lista remota de planetas.
- A segunda caixa de seleção é sincronizada com a lista remota de lugares do `planetId` atual.

É por isso que faz sentido descrevê-los como dois Effects separados. Aqui está um exemplo de como você poderia fazer isso:

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
        console.log('Fetched a list of planets.');
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
      // Nada foi selecionado na primeira caixa ainda
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
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
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
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
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
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
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
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
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Este código é um pouco repetitivo. No entanto, isso não é um bom motivo para combiná-lo em um único Effect! Se você fizesse isso, teria que combinar as dependências dos dois Effects em uma única lista, e então mudar o planeta buscaria de novo a lista de todos os planetas. Effects não são uma ferramenta para reutilização de código.

Em vez disso, para reduzir a repetição, você pode extrair parte da lógica para um Hook personalizado como o `useSelectOptions` abaixo:

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
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
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
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
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
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
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
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Veja a aba `useSelectOptions.js` na sandbox para entender como funciona. O ideal é que a maioria dos Effects na sua aplicação acabe sendo substituída por Hooks personalizados, escritos por você ou pela comunidade. Hooks personalizados escondem a lógica de sincronização, então o componente que os chama não sabe da existência do Effect. À medida que você continuar trabalhando no seu app, vai montar uma paleta de Hooks para escolher e, com o tempo, não vai precisar escrever Effects nos seus componentes com muita frequência.

</Solution>

</Challenges>
