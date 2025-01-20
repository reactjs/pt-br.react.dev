---
title: 'Ciclo de Vida dos Efeitos Reativos'
---

<Intro>

Os Efeitos têm um ciclo de vida diferente dos componentes. Componentes podem montar, atualizar ou desmontar. Um Efeito pode fazer apenas duas coisas: começar a sincronizar algo e, mais tarde, parar de sincronizá-lo. Este ciclo pode acontecer várias vezes se o seu Efeito depender de props e estados que mudam ao longo do tempo. O React fornece uma regra de lint para verificar se você especificou corretamente as dependências do seu Efeito. Isso mantém seu Efeito sincronizado com as últimas props e estado.

</Intro>

<YouWillLearn>

- Como o ciclo de vida de um Efeito é diferente do ciclo de vida de um componente
- Como pensar sobre cada Efeito individualmente em isolamento
- Quando seu Efeito precisa re-sincronizar e por quê
- Como as dependências do seu Efeito são determinadas
- O que significa um valor ser reativo
- O que significa um array de dependências vazio
- Como o React verifica se suas dependências estão corretas com um linter
- O que fazer quando você discorda do linter

</YouWillLearn>

## O ciclo de vida de um Efeito {/*the-lifecycle-of-an-effect*/}

Todo componente React passa pelo mesmo ciclo de vida:

- Um componente _monta_ quando é adicionado à tela.
- Um componente _atualiza_ quando recebe novas props ou estado, geralmente em resposta a uma interação.
- Um componente _desmonta_ quando é removido da tela.

**É uma boa maneira de pensar sobre componentes, mas _não_ sobre Efeitos.** Em vez disso, tente pensar em cada Efeito de forma independente do ciclo de vida do seu componente. Um Efeito descreve como [sincronizar um sistema externo](/learn/synchronizing-with-effects) com as props e estado atuais. À medida que seu código muda, a sincronização precisará acontecer mais ou menos frequentemente.

Para ilustrar este ponto, considere este Efeito conectando seu componente a um servidor de chat:

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

O corpo do seu Efeito especifica como **começar a sincronizar:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

A função de limpeza retornada pelo seu Efeito especifica como **parar de sincronizar:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitivamente, você pode pensar que o React **começaria a sincronizar** quando seu componente monta e **pararia de sincronizar** quando seu componente desmonta. No entanto, este não é o fim da história! Às vezes, pode ser necessário **começar e parar de sincronizar várias vezes** enquanto o componente permanece montado.

Vamos analisar _por que_ isso é necessário, _quando_ isso acontece e _como_ você pode controlar esse comportamento.

<Note>

Alguns Efeitos não retornam uma função de limpeza. [Mais frequentemente do que não,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) você vai querer retornar uma--mas se não o fizer, o React se comportará como se você tivesse retornado uma função de limpeza vazia.

</Note>

### Por que a sincronização pode precisar acontecer mais de uma vez {/*why-synchronization-may-need-to-happen-more-than-once*/}

Imagine que este componente `ChatRoom` recebe uma prop `roomId` que o usuário escolhe em um dropdown. Vamos supor que inicialmente o usuário escolha a sala `"general"` como o `roomId`. Seu aplicativo exibe a sala de chat `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

Depois que a UI é exibida, o React executará seu Efeito para **começar a sincronizar.** Ele se conecta à sala `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta-se à sala "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Desconecta da sala "general"
    };
  }, [roomId]);
  // ...
```

Até aqui, tudo certo.

Mais tarde, o usuário escolhe uma sala diferente no dropdown (por exemplo, `"travel"`). Primeiro, o React atualizará a UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

Pense sobre o que deve acontecer a seguir. O usuário vê que `"travel"` é a sala de chat selecionada na UI. No entanto, o Efeito que foi executado da última vez ainda está conectado à sala `"general"`. **A prop `roomId` mudou, então o que seu Efeito fez na última vez (conectando-se à sala `"general"`) não corresponde mais à UI.**

Neste ponto, você gostaria que o React fizesse duas coisas:

1. Parar de sincronizar com o antigo `roomId` (desconectar da sala `"general"`)
2. Começar a sincronizar com o novo `roomId` (conectar à sala `"travel"`)

**Felizmente, você já ensinou ao React como fazer ambas essas coisas!** O corpo do seu Efeito especifica como começar a sincronizar, e sua função de limpeza especifica como parar de sincronizar. Tudo o que o React precisa fazer agora é chamá-los na ordem correta e com as props e estado corretos. Vamos ver como exatamente isso acontece.

### Como o React re-sincroniza seu Efeito {/*how-react-re-synchronizes-your-effect*/}

Lembre-se de que seu componente `ChatRoom` recebeu um novo valor para sua prop `roomId`. Antes, era `"general"` e agora é `"travel"`. O React precisa re-sincronizar seu Efeito para reconectá-lo a uma sala diferente.

Para **parar de sincronizar,** o React chamará a função de limpeza que seu Efeito retornou após se conectar à sala `"general"`. Como `roomId` era `"general"`, a função de limpeza desconecta da sala `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta-se à sala "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Desconecta da sala "general"
    };
    // ...
```

Depois, o React executará o Efeito que você forneceu durante esta renderização. Desta vez, `roomId` é `"travel"` então ele **começará a sincronizar** com a sala de chat `"travel"` (até que sua função de limpeza seja eventualmente chamada também):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Conecta-se à sala "travel"
    connection.connect();
    // ...
```

Graças a isso, agora você está conectado à mesma sala que o usuário escolheu na UI. Desastre evitado!

Toda vez que seu componente re-renderiza com um `roomId` diferente, seu Efeito será re-sincronizado. Por exemplo, vamos supor que o usuário muda `roomId` de `"travel"` para `"music"`. O React novamente **parará de sincronizar** seu Efeito chamando sua função de limpeza (desconectando-o da sala `"travel"`). Então, ele **começará a sincronizar** novamente executando seu corpo com a nova prop `roomId` (conectando-o à sala `"music"`).

Finalmente, quando o usuário vai para uma tela diferente, `ChatRoom` desmonta. Agora não há necessidade de permanecer conectado. O React **parará de sincronizar** seu Efeito uma última vez e desconectará você da sala de chat `"music"`.

### Pensando da perspectiva do Efeito {/*thinking-from-the-effects-perspective*/}

Vamos recapitular tudo o que aconteceu da perspectiva do componente `ChatRoom`:

1. `ChatRoom` montou com `roomId` definido como `"general"`
1. `ChatRoom` atualizou com `roomId` definido como `"travel"`
1. `ChatRoom` atualizou com `roomId` definido como `"music"`
1. `ChatRoom` desmontou

Durante cada um desses pontos no ciclo de vida do componente, seu Efeito fez coisas diferentes:

1. Seu Efeito conectou-se à sala `"general"`
1. Seu Efeito desconectou da sala `"general"` e conectou na sala `"travel"`
1. Seu Efeito desconectou da sala `"travel"` e conectou na sala `"music"`
1. Seu Efeito desconectou da sala `"music"`

Agora vamos pensar sobre o que aconteceu da perspectiva do próprio Efeito:

```js
  useEffect(() => {
    // Seu Efeito conectou-se à sala especificada com roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...até que se desconectou
      connection.disconnect();
    };
  }, [roomId]);
```

A estrutura desse código pode inspirá-lo a ver o que aconteceu como uma sequência de períodos de tempo não sobrepostos:

1. Seu Efeito conectou-se à sala `"general"` (até se desconectar)
1. Seu Efeito conectou-se à sala `"travel"` (até se desconectar)
1. Seu Efeito conectou-se à sala `"music"` (até se desconectar)

Anteriormente, você estava pensando da perspectiva do componente. Quando você olhou da perspectiva do componente, era tentador pensar nos Efeitos como "callbacks" ou "eventos de ciclo de vida" que disparam em um momento específico, como "após uma renderização" ou "antes de desmontar". Essa forma de pensar fica complicada muito rapidamente, então é melhor evitar.

**Em vez disso, concentre-se sempre em um único ciclo de início/parada de cada vez. Não deve importar se um componente está montando, atualizando ou desmontando. Tudo o que você precisa fazer é descrever como iniciar a sincronização e como parar. Se você fizer isso bem, seu Efeito resistirá a ser iniciado e interrompido quantas vezes forem necessárias.**

Isso pode lembrá-lo de como você não pensa se um componente está montando ou atualizando quando escreve a lógica de renderização que cria JSX. Você descreve o que deve estar na tela, e o React [decide o resto.](/learn/reacting-to-input-with-state)

### Como o React verifica que seu Efeito pode re-sincronizar {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Aqui está um exemplo ao vivo com o qual você pode brincar. Pressione "Abrir chat" para montar o componente `ChatRoom`:

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
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
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
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Perceba que quando o componente monta pela primeira vez, você vê três logs:

1. `✅ Conectando à sala "general" em https://localhost:1234...` *(somente no desenvolvimento)*
1. `❌ Desconectado da sala "general" em https://localhost:1234.` *(somente no desenvolvimento)*
1. `✅ Conectando à sala "general" em https://localhost:1234...`

Os dois primeiros logs são somente para desenvolvimento. No desenvolvimento, o React sempre desmonta cada componente uma vez.

**O React verifica que seu Efeito pode re-sincronizar forçando-o a fazer isso imediatamente em desenvolvimento.** Isso pode lembrá-lo de abrir uma porta e fechá-la uma vez a mais para verificar se a fechadura da porta funciona. O React inicia e para seu Efeito uma vez a mais no desenvolvimento para verificar [se você implementou a limpeza bem.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

A principal razão pela qual seu Efeito re-sincronizará na prática é se alguns dos dados que ele usa mudaram. No sandbox acima, altere a sala de chat selecionada. Perceba que, quando o `roomId` muda, seu Efeito re-sincroniza.

No entanto, há também casos mais incomuns em que a re-sincronização é necessária. Por exemplo, tente editar o `serverUrl` no sandbox acima enquanto o chat está aberto. Perceba como o Efeito re-sincroniza em resposta às suas edições ao código. No futuro, o React pode adicionar mais recursos que dependem da re-sincronização.

### Como o React sabe que precisa re-sincronizar o Efeito {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Você pode estar se perguntando como o React sabia que seu Efeito precisava re-sincronizar após as mudanças no `roomId`. É porque *você disse ao React* que seu código depende de `roomId` ao incluí-lo na [lista de dependências:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // A prop roomId pode mudar ao longo do tempo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Efeito lê roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Então você diz ao React que este Efeito "depende de" roomId
  // ...
```

Aqui está como isso funciona:

1. Você sabia que `roomId` é uma prop, o que significa que pode mudar ao longo do tempo.
2. Você sabia que seu Efeito lê `roomId` (então sua lógica depende de um valor que pode mudar mais tarde).
3. É por isso que você especificou isso como uma dependência do seu Efeito (para que ele re-sincronize quando `roomId` muda).

Toda vez que seu componente re-renderiza, o React olhará para o array de dependências que você passou. Se algum dos valores no array for diferente do valor no mesmo lugar que você passou durante a renderização anterior, o React re-sincronizará seu Efeito.

Por exemplo, se você passou `["general"]` durante a renderização inicial e depois passou `["travel"]` durante a próxima renderização, o React comparará `"general"` e `"travel"`. Esses são valores diferentes (comparados com [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), então o React re-sincronizará seu Efeito. Por outro lado, se seu componente re-renderiza, mas `roomId` não mudou, seu Efeito permanecerá conectado à mesma sala.

### Cada Efeito representa um processo de sincronização separado {/*each-effect-represents-a-separate-synchronization-process*/}

Resista à tentação de adicionar lógica não relacionada ao seu Efeito apenas porque essa lógica precisa ser executada ao mesmo tempo que um Efeito que você já escreveu. Por exemplo, digamos que você queira registrar um evento de análise quando o usuário visita a sala. Você já tem um Efeito que depende de `roomId`, então pode sentir a tentação de adicionar a chamada de análise lá:

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

Mas imagine que você mais tarde adicione outra dependência a este Efeito que precisa restabelecer a conexão. Se este Efeito re-sincronizar, ele também chamará `logVisit(roomId)` para a mesma sala, o que você não pretendia. Registrar a visita **é um processo separado** de conectar. Escreva-os como dois Efeitos separados:

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

**Cada Efeito no seu código deve representar um processo de sincronização separado e independente.**

No exemplo acima, excluir um Efeito não quebraria a lógica do outro Efeito. Este é um bom indicativo de que eles sincronizam coisas diferentes, portanto, faz sentido dividi-los. Por outro lado, se você dividir um pedaço coeso de lógica em Efeitos separados, o código pode parecer "mais limpo", mas será [mais difícil de manter.](/learn/you-might-not-need-an-effect#chains-of-computations) Por isso, você deve pensar se os processos são iguais ou separados, não se o código parece mais limpo.

## Efeitos "reagem" a valores reativos {/*effects-react-to-reactive-values*/}

Seu Efeito lê duas variáveis (`serverUrl` e `roomId`), mas você especificou apenas `roomId` como uma dependência:

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

Isso acontece porque o `serverUrl` nunca muda devido a uma re-renderização. Ele é sempre o mesmo, não importa quantas vezes o componente é re-renderizado e por quê. Como o `serverUrl` nunca muda, não faria sentido especificá-lo como uma dependência. Afinal, as dependências só fazem algo quando mudam ao longo do tempo!

Por outro lado, `roomId` pode ser diferente em uma re-renderização. **Props, estados e outros valores declarados dentro do componente são _reativos_ porque são calculados durante a renderização e participam do fluxo de dados do React.**

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
  }, [roomId, serverUrl]); // Então você diz ao React que este Efeito "depende de" props e estado
  // ...
}
```

Incluindo `serverUrl` como uma dependência, você garante que o Efeito re-sincroniza após mudar.

Tente mudar a sala de chat selecionada ou editar a URL do servidor neste sandbox:

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
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
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
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Toda vez que você mudar um valor reativo como `roomId` ou `serverUrl`, o Efeito reconecta-se ao servidor de chat.

### O que significa um Efeito com dependências vazias {/*what-an-effect-with-empty-dependencies-means*/}

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

Agora o código do seu Efeito não usa *nenhum* valor reativo, então suas dependências podem ser vazias (`[]`).

Pensando da perspectiva do componente, o array de dependências vazio `[]` significa que este Efeito conecta-se à sala de chat apenas quando o componente monta e desconecta apenas quando o componente desmonta. (Lembre-se de que o React ainda [re-sincronizaria uma vez a mais](#how-react-verifies-that-your-effect-can-re-synchronize) no desenvolvimento para estressar sua lógica.)

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
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar chat' : 'Abrir chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No entanto, se você [pensar da perspectiva do Efeito,](#thinking-from-the-effects-perspective) você não precisa pensar sobre montagem e desmontagem de forma alguma. O que é importante é que você especificou o que seu Efeito faz para iniciar e parar a sincronização. Hoje, ele não tem dependências reativas. Mas se você quiser que o usuário altere `roomId` ou `serverUrl` ao longo do tempo (e eles se tornem reativos), o código do seu Efeito não mudará. Você só precisará adicioná-los às dependências.

### Todas as variáveis declaradas no corpo do componente são reativas {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props e estados não são os únicos valores reativos. Valores que você calcula a partir deles também são reativos. Se as props ou estado mudarem, seu componente irá re-renderizar, e os valores calculados a partir deles também mudarão. É por isso que todas as variáveis do corpo do componente usadas pelo Efeito devem estar na lista de dependências do Efeito.

Vamos supor que o usuário possa escolher um servidor de chat no dropdown, mas também possa configurar um servidor padrão nas configurações. Suponha que você já colocou o estado de configurações em um [contexto](/learn/scaling-up-with-reducer-and-context) para que você possa ler as `settings` a partir desse contexto. Agora você calcula a `serverUrl` com base no servidor selecionado a partir das props e do servidor padrão:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId é reativa
  const settings = useContext(SettingsContext); // settings é reativa
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl é reativa
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Seu Efeito lê roomId e serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Portanto ele precisa re-sincronizar quando qualquer um deles mudar!
  // ...
}
```

Neste exemplo, `serverUrl` não é uma prop ou uma variável de estado. É uma variável regular que você calcula durante a renderização. Mas ela é calculada durante a renderização, então pode mudar devido a uma nova renderização. É por isso que ela é reativa.

**Todos os valores dentro do componente (incluindo props, estado e variáveis no corpo do seu componente) são reativos. Qualquer valor reativo pode mudar em uma re-renderização, então você precisa incluir valores reativos como dependências do Efeito.**

Em outras palavras, os Efeitos "reagem" a todos os valores do corpo do componente.

<DeepDive>

#### Valores globais ou mutáveis podem ser dependências? {/*can-global-or-mutable-values-be-dependencies*/}

Valores mutáveis (incluindo variáveis globais) não são reativos.

**Um valor mutável como [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) não pode ser uma dependência.** Ele é mutável, então pode mudar a qualquer momento, completamente fora do fluxo de dados de renderização do React. Alterá-lo não acionaria uma re-renderização do seu componente. Portanto, mesmo que você o especificasse nas dependências, o React *não saberia* para re-sincronizar o Efeito quando ele mudar. Isso também quebra as regras do React porque ler dados mutáveis durante a renderização (que é quando você calcula as dependências) quebra [a pureza da renderização.](/learn/keeping-components-pure) Em vez disso, você deve ler e se inscrever em um valor externo mutável com [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Um valor mutável como [`ref.current`](/reference/react/useRef#reference) ou coisas que você lê dele também não podem ser uma dependência.** O objeto ref retornado por `useRef` pode ser uma dependência, mas sua propriedade `current` é intencionalmente mutável. Isso permite que você [monitore algo sem acionar uma re-renderização.](/learn/referencing-values-with-refs) Mas como mudar isso não aciona uma re-renderização, não é um valor reativo e o React não saberá para re-executar seu Efeito quando isso mudar.

Como você aprenderá abaixo nesta página, um linter verificará automaticamente essas questões.

</DeepDive>

### O React verifica que você especificou cada valor reativo como uma dependência {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Se seu linter estiver [configurado para o React,](/learn/editor-setup#linting) ele verificará se cada valor reativo usado pelo código do seu Efeito está declarado como sua dependência. Por exemplo, este é um erro de lint porque tanto `roomId` quanto `serverUrl` são reativos:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId é reativa
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl é reativa

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Algo está errado aqui!

  return (
    <>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem-vindo à sala {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
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
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Isso pode parecer um erro do React, mas na verdade o React está apontando um bug no seu código. Tanto `roomId` quanto `serverUrl` podem mudar ao longo do tempo, mas você está esquecendo de re-sincronizar seu Efeito quando eles mudam. Você permanecerá conectado ao `roomId` e `serverUrl` iniciais mesmo depois que o usuário escolher valores diferentes na UI.

Para corrigir o bug, siga a sugestão do linter para especificar `roomId` e `serverUrl` como dependências do seu Efeito:

```js {9}
function ChatRoom({ roomId }) { // roomId é reativa
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl é reativa
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

Tente essa correção no sandbox acima. Verifique se o erro do linter desapareceu e que o chat reconecta quando necessário.

<Note>

Em alguns casos, o React *sabe* que um valor nunca muda, mesmo que esteja declarado dentro do componente. Por exemplo, a função [`set`](https://pt.wikipedia.org/wiki/React_(biblioteca)) retornada por `useState` e o objeto ref retornado por [`useRef`](https://pt.wikipedia.org/wiki/React_(biblioteca)) são *estáveis*--são garantidos para não mudar em uma re-renderização. Valores estáveis não são reativos, então você pode omití-los da lista. Incluir eles é permitido: eles não mudarão, então não importa.

</Note>

### O que fazer quando você não quer re-sincronizar {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

No exemplo anterior, você corrigiu o erro do lint listando `roomId` e `serverUrl` como dependências.

**No entanto, você poderia "provar" ao linter que esses valores não são valores reativos,** ou seja, que eles *não podem* mudar como resultado de uma re-renderização. Por exemplo, se `serverUrl` e `roomId` não dependem da renderização e sempre têm os mesmos valores, você pode movê-los para fora do componente. Agora eles não precisam ser dependências:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl não é reativa
const roomId = 'general'; // roomId não é reativa

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // serverUrl e roomId não são reativos
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

Você também pode movê-los *para dentro do Efeito.* Eles não estão calculados durante a renderização, então não são reativos:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl não é reativa
    const roomId = 'general'; // roomId não é reativa
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

**Os Efeitos são blocos de código reativos.** Eles re-sincronizam quando os valores que você lê dentro deles mudam. Diferente dos manipuladores de eventos, que apenas executam uma vez por interação, os Efeitos são executados sempre que a sincronização é necessária.

**Você não pode "escolher" suas dependências.** Suas dependências devem incluir todo [valor reativo](#all-variables-declared-in-the-component-body-are-reactive) que você lê no Efeito. O linter impõe isso. Às vezes isso pode levar a problemas como loops infinitos e à re-sincronização do seu Efeito com frequência demais. Não conserte esses problemas suprimindo o linter! Aqui está o que você pode tentar em vez disso:

* **Verifique se seu Efeito representa um processo de sincronização independente.** Se seu Efeito não sincroniza nada, [pode ser desnecessário.](/learn/you-might-not-need-an-effect) Se ele sincroniza várias coisas independentes, [divida-o.](/learn/each-effect-represents-a-separate-synchronization-process)

* **Se você quiser ler o valor mais recente de props ou estado sem "reagir" a ele e re-sincronizar o Efeito,** pode dividir seu Efeito em uma parte reativa (que você manterá no Efeito) e uma parte não reativa (que você extrairá para algo chamado um _Evento de Efeito_). [Saiba mais sobre separar Eventos de Efeitos.](/learn/separating-events-from-effects)

* **Evite depender de objetos e funções como dependências.** Se você criar objetos e funções durante a renderização e depois lê-los de um Efeito, eles serão diferentes a cada renderização. Isso fará com que seu Efeito re-sincronize cada vez. [Saiba mais sobre remover dependências desnecessárias de Efeitos.](/learn/removing-effect-dependencies)

<Pitfall>

O linter é seu amigo, mas seus poderes são limitados. O linter só sabe quando as dependências estão *erradas*. Ele não sabe *a melhor* maneira de resolver cada caso. Se o linter sugerir uma dependência, mas adicioná-la causar um loop, isso não significa que o linter deve ser ignorado. Você precisa mudar o código dentro (ou fora) do Efeito para que esse valor não seja reativo e não *precise* ser uma dependência.

Se você tiver uma base de código existente, pode ter alguns Efeitos que suprimem o linter assim:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Nas [próximas](/learn/separating-events-from-effects) [páginas](/learn/removing-effect-dependencies), você aprenderá a consertar esse código sem quebrar as regras. Sempre vale a pena consertar!

</Pitfall>

<Recap>

- Componentes podem montar, atualizar e desmontar.
- Cada Efeito tem um ciclo de vida separado do componente ao redor.
- Cada Efeito descreve um processo de sincronização separado que pode *começar* e *parar*.
- Quando você escreve e lê Efeitos, pense da perspectiva de cada Efeito individual (como iniciar e parar a sincronização) em vez da perspectiva do componente (como ele monta, atualiza ou desmonta).
- Valores declarados dentro do corpo do componente são "reativos".
- Valores reativos devem re-sincronizar o Efeito porque podem mudar ao longo do tempo.
- O linter verifica que todos os valores reativos usados dentro do Efeito estão especificados como dependências.
- Todos os erros sinalizados pelo linter são legítimos. Sempre há uma maneira de corrigir o código para não quebrar as regras.

</Recap>

<Challenges>

#### Corrija a reconexão em cada digitação {/*fix-reconnecting-on-every-keystroke*/}

Neste exemplo, o componente `ChatRoom` conecta-se à sala de chat quando o componente monta, desconecta quando desmonta e reconecta quando você seleciona uma sala diferente. Esse comportamento está correto, então você precisa mantê-lo funcionando.

No entanto, há um problema. Sempre que você digita na caixa de mensagem na parte inferior, o `ChatRoom` *também* reconecta ao chat. (Você pode notar isso limpando o console e digitando na entrada.) Corrija o problema para que isso não aconteça.

<Hint>

Você pode precisar adicionar um array de dependências para este Efeito. Quais dependências devem estar lá?

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
      <h1>Bem-vindo à sala {roomId}!</h1>
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
        Escolha a sala de chat:{' '}
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
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

Este Efeito não tinha um array de dependências, então ele re-sincronizou após cada re-renderização. Primeiro, adicione um array de dependências. Em seguida, certifique-se de que todos os valores reativos usados pelo Efeito estão especificados no array. Por exemplo, `roomId` é reativa (porque é uma prop), então deve ser incluída no array. Isso garante que, quando o usuário selecionar uma sala diferente, o chat reconecte. Por outro lado, `serverUrl` é definido fora do componente. É por isso que ele não precisa estar no array.

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
      <h1>Bem-vindo à sala {roomId}!</h1>
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
        Escolha a sala de chat:{' '}
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
  // Uma implementação real conectaria realmente ao servidor
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### Ativar e desativar a sincronização {/*switch-synchronization-on-and-off*/}

Neste exemplo, um Efeito se inscreve no evento [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) da janela para mover um ponto rosa na tela. Tente passar o mouse sobre a área de visualização (ou toque na tela se estiver em um dispositivo móvel) e veja como o ponto rosa segue seu movimento.

Há também uma caixa de seleção. Marcar a caixa de seleção alterna a variável de estado `canMove`, mas essa variável de estado não é usada em nenhum lugar do código. Sua tarefa é mudar o código para que, quando `canMove` for `false` (a caixa de seleção estiver desmarcada), o ponto pare de se mover. Depois que você marcar a caixa de seleção novamente (e definir `canMove` como `true`), o ponto deve seguir o movimento novamente. Em outras palavras, se o ponto pode se mover ou não deve estar sincronizado se a caixa de seleção está marcada.

<Hint>

Você não pode declarar um Efeito condicionalmente. No entanto, o código dentro do Efeito pode usar condições!

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

Alternativamente, você poderia envolver a lógica *da inscrição do evento* em uma condição `if (canMove) { ... }`:

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

Em ambos os casos, `canMove` é uma variável reativa que você lê dentro do Efeito. É por isso que ela deve estar especificada na lista de dependências. Isso garante que o Efeito re-sincronize após cada alteração em seu valor.

</Solution>

#### Investigue um bug de valor obsoleto {/*investigate-a-stale-value-bug*/}

Neste exemplo, o ponto rosa deve se mover quando a caixa de seleção estiver ligada e deve parar de se mover quando a caixa de seleção estiver desligada. A lógica para isso já foi implementada: o manipulador de eventos `handleMove` verifica a variável de estado `canMove`.

No entanto, por algum motivo, a variável de estado `canMove` dentro de `handleMove` parece estar "obsoleta": ela está sempre `true`, mesmo depois que você desmarca a caixa de seleção. Como isso é possível? Encontre o erro no código e corrigir.

<Hint>

Se você vê uma regra de lint sendo suprimida, remova a supressão! É aí que geralmente estão os erros.

</Hint>

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

<Solution>

O problema com o código original era suprimir a dependência do linter. Se você remover a supressão, verá que este Efeito depende da função `handleMove`. Isso faz sentido: `handleMove` é declarada dentro do corpo do componente, o que a torna um valor reativo. Cada valor reativo deve ser especificado como uma dependência, ou ele pode ficar obsoleto ao longo do tempo!

O autor do código original "mentiu" para o React ao dizer que o Efeito não depende (`[]`) de nenhum valor reativo. É por isso que o React não re-sincronizou o Efeito após `canMove` ter mudado (e `handleMove` com ele). Como o React não re-sincronizou o Efeito, o `handleMove` anexado como um listener é a função `handleMove` criada durante a renderização inicial. Durante a renderização inicial, `canMove` era `true`, razão pela qual `handleMove` da renderização inicial sempre verá esse valor.

**Se você nunca suprimir o linter, você nunca verá problemas com valores obsoletos.** Existem algumas maneiras diferentes de resolver esse bug, mas você sempre deve começar removendo a supressão do linter. Em seguida, altere o código para corrigir o erro de lint.

Você pode mudar as dependências do Efeito para `[handleMove]`, mas como será uma função recém-definida a cada renderização, seria mais interessante remover completamente o array de dependências. Então o Efeito *re-sincronizará* após cada re-renderização:

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

Essa solução funciona, mas não é ideal. Se você colocar `console.log('Reinscrevendo')` dentro do corpo do Efeito, você notará que agora ele apenas re-inscreve quando você alternar a caixa de seleção (`canMove` muda) ou editar o código. Isso a torna melhor do que a abordagem anterior que sempre se re-inscrevia.

Uma correção melhor seria mover a função `handleMove` *para dentro* do Efeito. Então `handleMove` não será um valor reativo, e assim seu Efeito não dependerá de uma função. Em vez disso, ele precisará depender de `canMove`, que seu código agora lê de dentro do Efeito. Isso corresponde ao comportamento desejado, já que seu Efeito agora permanecerá sincronizado com o valor de `canMove`:

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

Tente adicionar `console.log('Reinscrevendo')` dentro do corpo do Efeito e note que agora ele só se re-inscreve quando você alterna a caixa de seleção (`canMove` muda) ou edita o código. Isso a torna uma solução melhor que a anterior.

Você aprenderá uma abordagem mais geral para esse tipo de problema em [Separando Eventos de Efeitos.](/learn/separating-events-from-effects)

</Solution>

#### Corrija uma troca de conexão {/*fix-a-connection-switch*/}

Neste exemplo, o serviço de chat em `chat.js` expõe duas APIs diferentes: `createEncryptedConnection` e `createUnencryptedConnection`. O componente `App` principal permite que o usuário escolha entre usar criptografia ou não e, em seguida, passa o método da API correspondente para o componente filho `ChatRoom` como a prop `createConnection`.

Perceba que, inicialmente, os logs do console dizem que a conexão não está criptografada. Tente alternar a caixa de seleção: nada acontecerá. No entanto, se você mudar a sala selecionada depois disso, o chat irá reconectar *e* habilitar a criptografia (como você verá nas mensagens do console). Este é um bug. Corrija o bug para que alternar a caixa de seleção *também* faça com que o chat reconecte.

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '"... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Se você remover a supressão do linter, verá um erro de lint. O problema é que `createConnection` é uma prop, então é um valor reativo. Ele pode mudar ao longo do tempo! (E de fato, deveria--quando o usuário marcar a caixa de seleção, o componente pai passa um valor diferente da prop `createConnection`.) É por isso que deve ser uma dependência. Inclua-a na lista para corrigir o bug:

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
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '"... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

É correto que `createConnection` seja uma dependência. No entanto, esse código é um pouco frágil porque alguém poderia editar o componente `App` para passar uma função inline como valor dessa prop. Nesse caso, seu valor seria diferente a cada vez que o componente `App` re-renderizasse, então o Efeito poderia re-sincronizar com frequência demais. Para evitar isso, você pode passar `isEncrypted` para baixo em vez disso:

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
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografado)');
    },
    disconnect() {
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografado)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Uma implementação real conectaria realmente ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '"... (não criptografado)');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografado)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Nesta versão, o componente `App` passa uma prop booleana em vez de uma função. Dentro do Efeito, você decide qual função usar. Como `createEncryptedConnection` e `createUnencryptedConnection` estão declarados fora do componente, eles não são reativos e não precisam ser dependências. Você aprenderá mais sobre isso em [Remover Dependências de Efeito.](/learn/removing-effect-dependencies)

</Solution>

#### Preencha uma cadeia de caixas de seleção {/*populate-a-chain-of-select-boxes*/}

Neste exemplo, há duas caixas de seleção. Uma caixa de seleção permite que o usuário escolha um planeta. Outra caixa de seleção permite que o usuário escolha um lugar *nesse planeta*. A segunda caixa não funciona ainda. Sua tarefa é fazê-la mostrar os lugares no planeta escolhido.

Olhe como a primeira caixa de seleção funciona. Ela popula o estado `planetList` com o resultado da chamada à API `"/planets"`. O ID do planeta atualmente selecionado é mantido na variável de estado `planetId`. Você precisa encontrar onde adicionar um código adicional para que a variável de estado `placeList` seja preenchida com o resultado da chamada à API `"/planets/" + planetId + "/places"`.

Se você implementar isso corretamente, selecionar um planeta deve popular a lista de lugares. Mudar um planeta deve mudar a lista de lugares.

<Hint>

Se você tiver dois processos de sincronização independentes, precisará escrever dois Efeitos separados.

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
        console.log('Lista de planetas buscada.');
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
      <p>Você está indo para: {placeId || '???'} em {planetId || '???'} </p>
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
      throw Error('Esperava uma URL como "/planets/earth/places". Recebido: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Esperava uma URL como "/planets" ou "/planets/earth/places". Recebido: "' + url + '".');
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
      'fetchPlaces(planetId) espera um argumento do tipo string. ' +
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
          name: 'Cidade de Alumínio'
        }, {
          id: 'new-new-york',
          name: 'Nova Nova Iorque'
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
- A segunda caixa de seleção está sincronizada com a lista remota de lugares para o atual `planetId`.

É por isso que faz sentido descrevê-los como dois Efeitos separados. Aqui está um exemplo de como você poderia fazer isso:

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
        console.log('Lista de planetas buscada.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Seleciona o primeiro planeta
      }
    });
    return () => {
     