---
title: 'Removendo as Dependências de Efeito'
---

<Intro>

Quando você escreve um Effect, o linter verificará se você incluiu todos os valores reativos (como props e estado) que o Effect lê na lista de dependências do seu Effect. Isso garante que seu Effect permaneça sincronizado com as props e o estado mais recentes do seu componente. Dependências desnecessárias podem fazer com que seu Effect seja executado com muita frequência ou até mesmo criar um loop infinito. Siga este guia para revisar e remover dependências desnecessárias de seus Effects.

</Intro>

<YouWillLearn>

- Como corrigir loops infinitos de dependência de Effect
- O que fazer quando você deseja remover uma dependência
- Como ler um valor do seu Effect sem "reagir" a ele
- Como e por que evitar dependências de objetos e funções
- Por que suprimir o linter de dependência é perigoso e o que fazer em vez disso

</YouWillLearn>

## As dependências devem corresponder ao código {/*dependencies-should-match-the-code*/}

Quando você escreve um Effect, você primeiro especifica como [iniciar e parar](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) o que você deseja que seu Effect faça:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Em seguida, se você deixar as dependências do Effect vazias (`[]`), o linter sugerirá as dependências corretas:

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
  }, []); // <-- Corrija o erro aqui!
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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

Preencha-as de acordo com o que o linter diz:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
}
```

[Effects "reagem" a valores reativos.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Como `roomId` é um valor reativo (ele pode mudar devido a uma nova renderização), o linter verifica se você o especificou como uma dependência. Se `roomId` receber um valor diferente, o React ressincronizará seu Effect. Isso garante que o bate-papo permaneça conectado à sala selecionada e "reaja" ao menu suspenso:

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
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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

### Para remover uma dependência, prove que ela não é uma dependência {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Observe que você não pode "escolher" as dependências do seu Effect. Cada <CodeStep step={2}>valor reativo</CodeStep> usado pelo código do seu Effect deve ser declarado em sua lista de dependências. A lista de dependências é determinada pelo código circundante:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Este é um valor reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Effect lê esse valor reativo
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Então você deve especificar esse valor reativo como uma dependência do seu Effect
  // ...
}
```

[Valores reativos](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) incluem props e todas as variáveis e funções declaradas diretamente dentro do seu componente. Como `roomId` é um valor reativo, você não pode removê-lo da lista de dependências. O linter não permitiria:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

E o linter estaria certo! Como `roomId` pode mudar com o tempo, isso introduziria um erro no seu código.

**Para remover uma dependência, "prove" ao linter que *não precisa* ser uma dependência.** Por exemplo, você pode mover `roomId` para fora do seu componente para provar que ele não é reativo e não mudará nas novas renderizações:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Não é mais um valor reativo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora que `roomId` não é um valor reativo (e não pode mudar em uma nova renderização), ele não precisa ser uma dependência:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

É por isso que você agora pode especificar uma lista de dependências [vazia (`[]`).](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Seu Effect *realmente não* depende mais de nenhum valor reativo, então ele *realmente não* precisa ser executado novamente quando alguma das props ou estado do componente mudar.

### Para alterar as dependências, altere o código {/*to-change-the-dependencies-change-the-code*/}

Você pode ter notado um padrão em seu fluxo de trabalho:

1. Primeiro, você **altera o código** do seu Effect ou como seus valores reativos são declarados.
2. Em seguida, você segue o linter e ajusta as dependências para **corresponder ao código que você alterou.**
3. Se você não estiver satisfeito com a lista de dependências, você **volta para a primeira etapa** (e altera o código novamente).

A última parte é importante. **Se você deseja alterar as dependências, altere o código circundante primeiro.** Você pode pensar na lista de dependências como [uma lista de todos os valores reativos usados pelo código do seu Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Você não *escolhe* o que colocar nessa lista. A lista *descreve* seu código. Para alterar a lista de dependências, altere o código.

Isso pode parecer resolver uma equação. Você pode começar com um objetivo (por exemplo, remover uma dependência) e precisa "encontrar" o código correspondente a esse objetivo. Nem todo mundo acha divertido resolver equações, e o mesmo pode ser dito sobre a escrita de Effects! Felizmente, há uma lista de receitas comuns que você pode tentar abaixo.

<Pitfall>

Se você tiver uma base de código existente, pode ter alguns Effects que suprimem o linter assim:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando as dependências não correspondem ao código, há um risco muito alto de introduzir erros.** Ao suprimir o linter, você "mente" para o React sobre os valores dos quais seu Effect depende.

Em vez disso, use as técnicas abaixo.

</Pitfall>

<DeepDive>

#### Por que suprimir o linter de dependência é tão perigoso? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Suprimir o linter leva a erros muito não intuitivos que são difíceis de encontrar e corrigir. Aqui está um exemplo:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Contador: {count}
        <button onClick={() => setCount(0)}>Redefinir</button>
      </h1>
      <hr />
      <p>
        A cada segundo, incrementar por:
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

Digamos que você quisesse executar o Effect "apenas na montagem". Você leu que as dependências [vazias (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) fazem isso, então você decidiu ignorar o linter e especificou à força `[]` como as dependências.

Este contador deveria incrementar a cada segundo pela quantidade configurável com os dois botões. No entanto, como você "mentiu" para o React que este Effect não depende de nada, o React continua usando a função `onTick` da renderização inicial para sempre. [Durante essa renderização,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` era `0` e `increment` era `1`. É por isso que `onTick` dessa renderização sempre chama `setCount(0 + 1)` a cada segundo, e você sempre vê `1`. Erros como esse são mais difíceis de corrigir quando são espalhados por vários componentes.

Sempre há uma solução melhor do que ignorar o linter! Para corrigir este código, você precisa adicionar `onTick` à lista de dependências. (Para garantir que o intervalo seja configurado apenas uma vez, [faça de `onTick` um Evento de Effect.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Recomendamos tratar o erro de lint de dependência como um erro de compilação. Se você não o suprimir, nunca verá erros como este.** O restante desta página documenta as alternativas para este e outros casos.

</DeepDive>


## Removendo dependências desnecessárias {/*removing-unnecessary-dependencies*/}

Toda vez que você ajustar as dependências do Effect para refletir o código, observe a lista de dependências. Faz sentido o Effect ser executado novamente quando alguma dessas dependências mudar? Às vezes, a resposta é "não":

*   Você pode querer re-executar *diferentes partes* do seu Effect sob diferentes condições.
*   Você pode querer apenas ler o *valor mais recente* de alguma dependência em vez de "reagir" às suas mudanças.
*   Uma dependência pode mudar com muita frequência *intencionalmente* porque é um objeto ou uma função.

Para encontrar a solução certa, você precisará responder a algumas perguntas sobre seu Effect. Vamos analisá-las.

### Este código deve ser movido para um manipulador de eventos? {/*should-this-code-move-to-an-event-handler*/}

A primeira coisa que você deve pensar é se este código deve ser um Effect.

Imagine um formulário. Ao enviar, você define a variável de estado `submitted` como `true`. Você precisa enviar uma solicitação POST e mostrar uma notificação. Você colocou essa lógica dentro de um Effect que "reage" a `submitted` sendo `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evite: Lógica específica de evento dentro de um Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Mais tarde, você deseja estilizar a mensagem de notificação de acordo com o tema atual, então você lê o tema atual. Como `theme` é declarado no corpo do componente, ele é um valor reativo, então você o adiciona como uma dependência:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evite: Lógica específica de evento dentro de um Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Todas as dependências declaradas

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Ao fazer isso, você introduziu um erro. Imagine que você envia o formulário primeiro e depois alterna entre os temas Escuro e Claro. O `theme` mudará, o Effect será executado novamente e, portanto, exibirá a mesma notificação novamente!

**O problema aqui é que isso não deveria ser um Effect em primeiro lugar.** Você deseja enviar esta solicitação POST e mostrar a notificação em resposta ao *envio do formulário,* que é uma interação específica. Para executar algum código em resposta a uma interação específica, coloque essa lógica diretamente no manipulador de eventos correspondente:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Bom: Lógica específica de evento é chamada de manipuladores de eventos
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Agora que o código está em um manipulador de eventos, ele não é reativo - portanto, ele só será executado quando o usuário enviar o formulário. Leia mais sobre [como escolher entre manipuladores de eventos e Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) e [como excluir Effects desnecessários.](/learn/you-might-not-need-an-effect)

### Seu Effect está fazendo várias coisas não relacionadas? {/*is-your-effect-doing-several-unrelated-things*/}

A próxima pergunta que você deve se fazer é se seu Effect está fazendo várias coisas não relacionadas.

Imagine que você está criando um formulário de envio em que o usuário precisa escolher sua cidade e área. Você busca a lista de `cities` do servidor de acordo com o `country` selecionado para mostrá-las em um menu suspenso:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ Todas as dependências declaradas

  // ...
```

Este é um bom exemplo de [como buscar dados em um Effect.](/learn/you-might-not-need-an-effect#fetching-data) Você está sincronizando o estado `cities` com a rede de acordo com a prop `country`. Você não pode fazer isso em um manipulador de eventos porque precisa buscar assim que `ShippingForm` for exibido e sempre que o `country` mudar (não importa qual interação o cause).

Agora, digamos que você está adicionando uma segunda caixa de seleção para as áreas da cidade, que deve buscar as `areas` para a `city` atualmente selecionada. Você pode começar adicionando uma segunda chamada `fetch` para a lista de áreas dentro do mesmo Effect:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Evite: Um único Effect sincroniza dois processos independentes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Todas as dependências declaradas

  // ...
```

No entanto, como o Effect agora usa a variável de estado `city`, você teve que adicionar `city` à lista de dependências. Isso, por sua vez, introduziu um problema: quando o usuário seleciona uma cidade diferente, o Effect será executado novamente e chamará `fetchCities(country)`. Como resultado, você estará refazendo desnecessariamente a busca da lista de cidades muitas vezes.

**O problema com este código é que você está sincronizando duas coisas diferentes não relacionadas:**

1.  Você deseja sincronizar o estado `cities` com a rede com base na prop `country`.
2.  Você deseja sincronizar o estado `areas` com a rede com base no estado `city`.

Divida a lógica em dois Effects, cada um dos quais reage à prop que precisa sincronizar:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ Todas as dependências declaradas

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ Todas as dependências declaradas

  // ...
```

Agora, o primeiro Effect só é executado novamente se o `country` mudar, enquanto o segundo Effect é executado novamente quando o `city` muda. Você os separou por finalidade: duas coisas diferentes são sincronizadas por dois Effects separados. Dois Effects separados têm duas listas de dependências separadas, para que não acionem um ao outro intencionalmente.

O código final é mais longo do que o original, mas dividir esses Effects ainda está correto. [Cada Effect deve representar um processo de sincronização independente.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Neste exemplo, excluir um Effect não quebra a lógica do outro Effect. Isso significa que eles *sincronizam coisas diferentes,* e é bom dividi-los. Se você está preocupado com duplicação, pode melhorar este código [extraindo a lógica repetitiva em um Hook personalizado.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Você está lendo algum estado para calcular o próximo estado? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Este Effect atualiza a variável de estado `messages` com uma matriz recém-criada toda vez que uma nova mensagem chega:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Ele usa a variável `messages` para [criar uma nova matriz](/learn/updating-arrays-in-state) começando com todas as mensagens existentes e adiciona a nova mensagem no final. No entanto, como `messages` é um valor reativo lido por um Effect, ele deve ser uma dependência:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Todas as dependências declaradas
  // ...
```

E tornar `messages` uma dependência introduz um problema.

Toda vez que você recebe uma mensagem, `setMessages()` faz com que o componente seja renderizado novamente com uma nova matriz `messages` que inclui a mensagem recebida. No entanto, como este Effect agora depende de `messages`, isso *também* ressincronizará o Effect. Então, cada nova mensagem fará com que o chat se reconecte. O usuário não gostaria disso!

Para corrigir o problema, não leia `messages` dentro do Effect. Em vez disso, passe uma [função de atualizador](/reference/react/useState#updating-state-based-on-the-previous-state) para `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

**Observe como seu Effect não lê a variável `messages` em tudo agora.** Você só precisa passar uma função de atualizador como `msgs => [...msgs, receivedMessage]`. React [coloca sua função de atualizador em uma fila](/learn/queueing-a-series-of-state-updates) e fornecerá o argumento `msgs` para ela durante a próxima renderização. É por isso que o próprio Effect não precisa mais depender de `messages`. Como resultado desta correção, receber uma mensagem de chat não fará mais com que o chat se reconecte.


### Você quer ler um valor sem "reagir" às suas mudanças? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Suponha que você queira tocar um som quando o usuário receber uma nova mensagem, a menos que `isMuted` seja `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Como seu Effect agora usa `isMuted` em seu código, você precisa adicioná-lo às dependências:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Todas as dependências declaradas
  // ...
```

O problema é que toda vez que `isMuted` muda (por exemplo, quando o usuário pressiona o botão "Muted"), o Effect será ressincronizado e reconectará ao chat. Esta não é a experiência do usuário desejada! (Neste exemplo, mesmo desabilitar o linter não funcionaria - se você fizer isso, `isMuted` ficaria "preso" com seu valor antigo.)

Para resolver esse problema, você precisa extrair a lógica que não deve ser reativa do Effect. Você não quer que este Effect "reaja" às mudanças em `isMuted`. [Mova esta parte não reativa da lógica para um Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Effect Events permitem que você divida um Effect em partes reativas (que devem "reagir" a valores reativos como `roomId` e suas mudanças) e partes não reativas (que apenas leem seus últimos valores, como `onMessage` lê `isMuted`). **Agora que você lê `isMuted` dentro de um Effect Event, ele não precisa ser uma dependência do seu Effect.** Como resultado, o chat não se reconectará quando você ativar e desativar a configuração "Muted", resolvendo o problema original!

#### Encapsulando um manipulador de eventos das props {/*wrapping-an-event-handler-from-the-props*/}

Você pode se deparar com um problema semelhante quando seu componente recebe um manipulador de eventos como uma prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Todas as dependências declaradas
  // ...
```

Suponha que o componente pai passe uma função `onReceiveMessage` *diferente* a cada renderização:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Como `onReceiveMessage` é uma dependência, isso faria com que o Effect fosse ressincronizado após cada re-renderização do pai. Isso faria com que ele se reconectasse ao chat. Para resolver isso, encapsule a chamada em um Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Effect Events não são reativos, então você não precisa especificá-los como dependências. Como resultado, o chat não se reconectará mesmo que o componente pai passe uma função que seja diferente a cada re-renderização.

#### Separando código reativo e não reativo {/*separating-reactive-and-non-reactive-code*/}

Neste exemplo, você quer registrar uma visita toda vez que `roomId` mudar. Você quer incluir o `notificationCount` atual com cada registro, mas você *não* quer que uma mudança em `notificationCount` acione um evento de registro.

A solução é novamente dividir o código não reativo em um Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
}
```

Você quer que sua lógica seja reativa em relação a `roomId`, então você lê `roomId` dentro do seu Effect. No entanto, você não quer que uma mudança em `notificationCount` registre uma visita extra, então você lê `notificationCount` dentro do Effect Event. [Saiba mais sobre como ler as últimas props e state dos Effects usando Effect Events.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


### Algum valor reativo muda sem querer? {/*does-some-reactive-value-change-unintentionally*/}

Às vezes, você *quer* que seu Effect "reaja" a um determinado valor, mas esse valor muda com mais frequência do que você gostaria - e pode não refletir nenhuma mudança real da perspectiva do usuário. Por exemplo, digamos que você crie um objeto `options` no corpo do seu componente e, em seguida, leia esse objeto de dentro do seu Effect:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Este objeto é declarado no corpo do componente, portanto, é um [valor reativo.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Quando você lê um valor reativo como este dentro de um Effect, você o declara como uma dependência. Isso garante que seu Effect "reaja" às suas mudanças:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas as dependências declaradas
  // ...
```

É importante declará-lo como uma dependência! Isso garante, por exemplo, que se o `roomId` mudar, seu Effect se reconectará ao chat com as novas `options`. No entanto, também há um problema com o código acima. Para vê-lo, tente digitar na entrada no sandbox abaixo e observe o que acontece no console:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Desabilite temporariamente o linter para demonstrar o problema
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <h1>Bem-vindo à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No sandbox acima, a entrada só atualiza a variável de estado `message`. Da perspectiva do usuário, isso não deve afetar a conexão do chat. No entanto, toda vez que você atualiza a `message`, seu componente renderiza novamente. Quando seu componente renderiza novamente, o código dentro dele é executado novamente do zero.

Um novo objeto `options` é criado do zero a cada renderização do componente `ChatRoom`. O React vê que o objeto `options` é um *objeto diferente* do objeto `options` criado durante a última renderização. É por isso que ele ressincroniza seu Effect (que depende de `options`) e o chat se reconecta conforme você digita.

**Este problema afeta apenas objetos e funções. Em JavaScript, cada objeto e função recém-criados são considerados distintos de todos os outros. Não importa que o conteúdo dentro deles possa ser o mesmo!**

```js {7-8}
// Durante a primeira renderização
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Durante a próxima renderização
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Estes são dois objetos diferentes!
console.log(Object.is(options1, options2)); // false
```

**As dependências de objetos e funções podem fazer com que seu Effect ressincronize com mais frequência do que você precisa.**

É por isso que, sempre que possível, você deve tentar evitar objetos e funções como dependências do seu Effect. Em vez disso, tente movê-los para fora do componente, dentro do Effect ou extrair valores primitivos deles.

#### Mova objetos e funções estáticos para fora do seu componente {/*move-static-objects-and-functions-outside-your-component*/}

Se o objeto não depender de nenhuma prop e estado, você pode mover esse objeto para fora do seu componente:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas as dependências declaradas
  // ...
```

Dessa forma, você *prova* ao linter que ele não é reativo. Ele não pode mudar como resultado de uma nova renderização, então não precisa ser uma dependência. Agora, a nova renderização de `ChatRoom` não fará com que seu Effect ressincronize.

Isso funciona para funções também:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas as dependências declaradas
  // ...
```

Como `createOptions` é declarado fora do seu componente, ele não é um valor reativo. É por isso que ele não precisa ser especificado nas dependências do seu Effect e por que ele nunca fará com que seu Effect ressincronize.

#### Mova objetos e funções dinâmicos para dentro do seu Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Se seu objeto depender de algum valor reativo que possa mudar como resultado de uma nova renderização, como uma prop `roomId`, você não pode puxá-lo para *fora* do seu componente. No entanto, você pode mover sua criação *para dentro* do código do seu Effect:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Agora que `options` é declarado dentro do seu Effect, ele não é mais uma dependência do seu Effect. Em vez disso, o único valor reativo usado pelo seu Effect é `roomId`. Como `roomId` não é um objeto ou função, você pode ter certeza de que ele não será *intencionalmente* diferente. Em JavaScript, números e strings são comparados por seu conteúdo:

```js {7-8}
// Durante a primeira renderização
const roomId1 = 'music';

// Durante a próxima renderização
const roomId2 = 'music';

// Estas duas strings são as mesmas!
console.log(Object.is(roomId1, roomId2)); // true
```

Graças a esta correção, o chat não se reconecta mais se você editar a entrada:

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
      <h1>Bem-vindo à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No entanto, ele *se* reconecta quando você altera o dropdown `roomId`, como você esperaria.

Isso funciona para funções também:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Você pode escrever suas próprias funções para agrupar pedaços de lógica dentro do seu Effect. Contanto que você também as declare *dentro* do seu Effect, elas não são valores reativos e, portanto, não precisam ser dependências do seu Effect.

#### Leia valores primitivos de objetos {/*read-primitive-values-from-objects*/}

Às vezes, você pode receber um objeto de props:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas as dependências declaradas
  // ...
```

O risco aqui é que o componente pai criará o objeto durante a renderização:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Isso faria com que seu Effect se reconectasse toda vez que o componente pai renderizasse novamente. Para corrigir isso, leia informações do objeto *fora* do Effect e evite ter dependências de objetos e funções:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas as dependências declaradas
  // ...
```

A lógica fica um pouco repetitiva (você lê alguns valores de um objeto fora de um Effect e, em seguida, cria um objeto com os mesmos valores dentro do Effect). Mas isso torna muito explícito em quais informações seu Effect *realmente* depende. Se um objeto for recriado sem querer pelo componente pai, o chat não se reconectará. No entanto, se `options.roomId` ou `options.serverUrl` forem realmente diferentes, o chat se reconectará.

#### Calcule valores primitivos de funções {/*calculate-primitive-values-from-functions*/}

A mesma abordagem pode funcionar para funções. Por exemplo, suponha que o componente pai passe uma função:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Para evitar torná-lo uma dependência (e fazer com que ele se reconecte em novas renderizações), chame-o fora do Effect. Isso fornece os valores `roomId` e `serverUrl` que não são objetos e que você pode ler de dentro do seu Effect:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Todas as dependências declaradas
  // ...
```

Isso só funciona para funções [puras](/learn/keeping-components-pure) porque elas são seguras para serem chamadas durante a renderização. Se sua função for um manipulador de eventos, mas você não quiser que suas alterações ressincronizem seu Effect, [envolva-o em um Evento de Effect em vez disso.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- As dependências devem sempre corresponder ao código.
- Quando você não estiver satisfeito com suas dependências, o que você precisa editar é o código.
- Suprimir o linter leva a bugs muito confusos, e você sempre deve evitá-lo.
- Para remover uma dependência, você precisa "provar" ao linter que ela não é necessária.
- Se algum código deve ser executado em resposta a uma interação específica, mova esse código para um manipulador de eventos.
- Se diferentes partes do seu Effect devem ser executadas novamente por motivos diferentes, divida-o em vários Effects.
- Se você deseja atualizar algum estado com base no estado anterior, passe uma função de atualização.
- Se você deseja ler o valor mais recente sem "reagir" a ele, extraia um Evento de Effect do seu Effect.
- Em JavaScript, objetos e funções são considerados diferentes se foram criados em momentos diferentes.
- Tente evitar dependências de objetos e funções. Mova-os para fora do componente ou para dentro do Effect.

</Recap>

<Challenges>


#### Corrigir um intervalo que reinicia {/*fix-a-resetting-interval*/}

Este Effect configura um intervalo que marca a cada segundo. Você notou algo estranho acontecendo: parece que o intervalo é destruído e recriado toda vez que marca. Corrija o código para que o intervalo não seja constantemente recriado.

<Hint>

Parece que o código deste Effect depende de `count`. Existe alguma forma de não precisar desta dependência? Deve haver uma forma de atualizar o estado `count` com base em seu valor anterior sem adicionar uma dependência nesse valor.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Marcação do intervalo');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Limpando um intervalo');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

<Solution>

Você quer atualizar o estado `count` para ser `count + 1` de dentro do Effect. No entanto, isso faz com que seu Effect dependa de `count`, que muda a cada marcação, e é por isso que seu intervalo é recriado a cada marcação.

Para resolver isso, use a [função atualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) e escreva `setCount(c => c + 1)` em vez de `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Marcação do intervalo');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Limpando um intervalo');
      clearInterval(id);
    };
  }, []);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

Em vez de ler `count` dentro do Effect, você passa uma instrução `c => c + 1` ("incremente este número!") para o React. O React irá aplicá-la na próxima renderização. E como você não precisa mais ler o valor de `count` dentro do seu Effect, você pode manter as dependências do seu Effect vazias (`[]`). Isso impede que seu Effect recrie o intervalo a cada marcação.

</Solution>

#### Corrigir uma animação que é reativada {/*fix-a-retriggering-animation*/}

Neste exemplo, quando você pressiona "Mostrar", uma mensagem de boas-vindas aparece. A animação leva um segundo. Quando você pressiona "Remover", a mensagem de boas-vindas desaparece imediatamente. A lógica para a animação de entrada é implementada no arquivo `animation.js` como um [loop de animação](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) em JavaScript simples. Você não precisa alterar essa lógica. Você pode tratá-la como uma biblioteca de terceiros. Seu Effect cria uma instância de `FadeInAnimation` para o nó DOM e, em seguida, chama `start(duration)` ou `stop()` para controlar a animação. A `duration` é controlada por um controle deslizante. Ajuste o controle deslizante e veja como a animação muda.

Este código já funciona, mas há algo que você quer mudar. Atualmente, quando você move o controle deslizante que controla a variável de estado `duration`, ele reativa a animação. Mude o comportamento para que o Effect não "reaja" à variável `duration`. Quando você pressionar "Mostrar", o Effect deve usar a `duration` atual no controle deslizante. No entanto, mover o controle deslizante por si só não deve reativar a animação.

<Hint>

Existe uma linha de código dentro do Effect que não deveria ser reativa? Como você pode mover o código não reativo para fora do Effect?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
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
```

</Sandpack>

<Solution>

Seu Effect precisa ler o valor mais recente de `duration`, mas você não quer que ele "reaja" a mudanças em `duration`. Você usa `duration` para iniciar a animação, mas iniciar a animação não é reativo. Extraia a linha de código não reativa para um Evento de Effect e chame essa função do seu Effect.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
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
    if (progress < 1) {
      // We still have more frames to paint
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
```

</Sandpack>

Eventos de Effect como `onAppear` não são reativos, então você pode ler `duration` dentro sem reativar a animação.

</Solution>

#### Corrigir um chat reconectando {/*fix-a-reconnecting-chat*/}

Neste exemplo, toda vez que você pressiona "Alternar tema", o chat se reconecta. Por que isso acontece? Corrija o erro para que o chat se reconecte somente quando você editar a URL do servidor ou escolher uma sala de bate-papo diferente.

Trate `chat.js` como uma biblioteca externa de terceiros: você pode consultá-la para verificar sua API, mas não a edite.

<Hint>

Há mais de uma maneira de corrigir isso, mas, em última análise, você deseja evitar ter um objeto como sua dependência.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Bem-vindo(a) à sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado(a) da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Seu Effect está sendo executado novamente porque ele depende do objeto `options`. Objetos podem ser recriados involuntariamente, você deve tentar evitá-los como dependências de seus Effects sempre que possível.

A correção menos invasiva é ler `roomId` e `serverUrl` logo fora do Effect e, em seguida, fazer com que o Effect dependa desses valores primitivos (que não podem mudar involuntariamente). Dentro do Effect, crie um objeto e passe-o para `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Bem-vindo(a) à sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado(a) da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Seria ainda melhor substituir a prop de objeto `options` pelas props mais específicas `roomId` e `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Alternar tema
      </button>
      <label>
        URL do servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado(a) da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Manter as props primitivas sempre que possível facilita a otimização de seus componentes posteriormente.

</Solution>


#### Corrigir um chat reconectando, novamente {/*fix-a-reconnecting-chat-again*/}

Este exemplo conecta ao chat com ou sem criptografia. Alterne a caixa de seleção e observe as diferentes mensagens no console quando a criptografia estiver ativada e desativada. Tente mudar a sala. Em seguida, tente alternar o tema. Quando você estiver conectado a uma sala de bate-papo, receberá novas mensagens a cada poucos segundos. Verifique se a cor corresponde ao tema que você escolheu.

Neste exemplo, o chat se reconecta toda vez que você tenta mudar o tema. Corrija isso. Após a correção, a mudança do tema não deve reconectar o chat, mas alternar as configurações de criptografia ou mudar a sala deve reconectar.

Não altere nenhum código em `chat.js`. Fora isso, você pode alterar qualquer código, desde que resulte no mesmo comportamento. Por exemplo, você pode achar útil alterar quais props estão sendo passadas.

<Hint>

Você está passando duas funções: `onMessage` e `createConnection`. Ambas são criadas do zero toda vez que `App` renderiza novamente. Elas são consideradas novos valores toda vez, e é por isso que elas reativam seu Effect.

Uma dessas funções é um manipulador de eventos. Você conhece alguma forma de chamar um manipulador de eventos em um Effect sem "reagir" aos novos valores da função do manipulador de eventos? Isso seria útil!

Outra dessas funções só existe para passar algum estado para um método de API importado. Essa função é realmente necessária? Qual é a informação essencial que está sendo passada? Talvez seja necessário mover algumas importações de `App.js` para `ChatRoom.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Há mais de uma forma correta de resolver isso, mas aqui está uma possível solução.

No exemplo original, alternar o tema fazia com que diferentes funções `onMessage` e `createConnection` fossem criadas e passadas. Como o Effect dependia dessas funções, o chat se reconectava toda vez que você alternava o tema.

Para corrigir o problema com `onMessage`, você precisava encapsulá-lo em um Evento de Effect:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Ao contrário da prop `onMessage`, o Evento de Effect `onReceiveMessage` não é reativo. É por isso que ele não precisa ser uma dependência do seu Effect. Como resultado, as alterações em `onMessage` não farão com que o chat se reconecte.

Você não pode fazer o mesmo com `createConnection` porque ele *deve* ser reativo. Você *quer* que o Effect seja reativado se o usuário alternar entre uma conexão criptografada e não criptografada, ou se o usuário mudar a sala atual. No entanto, como `createConnection` é uma função, você não pode verificar se as informações que ela lê foram *realmente* alteradas ou não. Para resolver isso, em vez de passar `createConnection` do componente `App`, passe os valores brutos `roomId` e `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Agora você pode mover a função `createConnection` *dentro* do Effect em vez de passá-la do `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Após essas duas alterações, seu Effect não depende mais de nenhum valor de função:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Valores reativos
  const onReceiveMessage = useEffectEvent(onMessage); // Não reativo

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Lendo um valor reativo
      };
      if (isEncrypted) { // Lendo um valor reativo
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Todas as dependências declaradas
```

Como resultado, o chat se reconecta somente quando algo significativo (`roomId` ou `isEncrypted`) muda:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

</Sandpack>

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografado)');
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
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" (não criptografado)...');
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
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografado)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
```