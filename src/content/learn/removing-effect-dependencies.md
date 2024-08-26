---
title: 'Removendo Dependências de Efeitos'
---

<Intro>

Quando você escreve um efeito, o linter verifica se você incluiu todos os valores reativos (como props e state) que o efeito lê na lista de dependências do seu efeito. Isso garante que seu efeito permaneça sincronizado com as últimas propriedades e o estado de seu componente. Dependências desnecessárias podem fazer com que seu Efeito seja executado com muita frequência ou até mesmo criar um loop infinito. Siga este guia para revisar e remover dependências desnecessárias de seus efeitos.

</Intro>

<YouWillLearn>

- Como corrigir loops de dependência de efeito infinito
- O que fazer quando você quiser remover uma dependência
- Como ler um valor de seu Effect sem “reagir” a ele
- Como e por que evitar dependências de objetos e funções
- Por que suprimir o linter de dependência é perigoso e o que fazer em vez disso

</YouWillLearn>

## As Dependências devem corresponder ao código {/*dependencies-should-match-the-code*/}

Quando você escreve um Efeito, o primeiro passo é especifica como [iniciar e parar](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) o que o seu efeito faz:

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

Portanto, se você deixar as dependências do Efeito vazias (`[]`), o linter sugerirá as dependências corretas:

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
  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
         Escolha a sala de bate-papo:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor.
  return {
    connect() {
      console.log('✅ Conectando-se à sala  "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala  "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Preencha-os de acordo com o que o linter indica:

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

Os [Efeitos "reagem" a valores reativos.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Como `roomId` é um valor reativo (ele pode mudar devido a uma re-renderização), o linter verifica se você o especificou como uma dependência. Se `roomId` receber um valor diferente, o React irá re-sincronizar o seu Efeito. Isso garante que o chat permaneça conectado à sala selecionada e "reaja" ao menu suspenso:

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
  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor.
  return {
    connect() {
      console.log('✅ Conectando-se à sala  "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala  "' + roomId + '" em ' + serverUrl);
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

Observe que você não pode "escolher" as dependências do seu Efeito. Todo <CodeStep step={2}>valor reativo</CodeStep> usado pelo código do seu Efeito deve ser declarado na sua lista de dependências. A lista de dependências é estabelecida pelo código ao redor:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Este é um valor reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Esse efeito indica que o valor reativo
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Portanto, você deve especificar esse valor reativo como uma dependência do seu Efeito
  // ...
}
```

[Valores reativos](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) incluem *props* e todas as variáveis e funções declaradas diretamente dentro do seu componente. Como `roomId` é um valor reativo, você não pode removê-lo da lista de dependências. O linter não permitirá isso:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect tem uma dependência ausente: 'roomId'
  // ...
}
```

E o linter estaria correto! Como o `roomId` pode mudar ao longo do tempo, removê-lo da lista de dependências poderia introduzir um bug no seu código.

**Para remover uma dependência, "prove" ao linter que ela *não precisa* ser uma dependência**. Por exemplo, você pode mover `roomId` para fora do seu componente para demonstrar que ele não é reativo e não mudará em re-renderizações:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'música'; // Não se trata mais de um valor reativo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Todas as dependências declaradas
  // ...
}
```

Agora que `roomId` não é um valor reativo (e não pode ser alterado em uma nova renderização), ele não precisa ser uma dependência:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'música';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor.
  return {
    connect() {
      console.log('✅ Conectando-se à sala  "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala  "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

É por isso que agora você pode especificar uma [lista de dependências vazia (`[]`).](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Seu Efeito *não depende* mais de nenhum valor reativo, portanto, *não precisa* ser reexecutado quando qualquer propriedade ou estado do componente for alterado.

### Para alterar as dependências, altere o código {/*to-change-the-dependencies-change-the-code*/}

Talvez você tenha notado um padrão em seu fluxo de trabalho:

1. Primeiro, você **altera o código** do seu Efeito ou a forma como seus valores reativos são declarados.
2. Em seguida, você segue as orientações do linter e ajusta as dependências para **corresponder ao código que você alterou**.
3. Se não estiver satisfeito com a lista de dependências, você **volta ao primeiro passo** (e altera o código novamente).

A última parte é importante. **Se você deseja alterar as dependências, modifique o código ao redor primeiro.** Você pode considerar a lista de dependências como [uma lista de todos os valores reativos usados pelo código do seu Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Você não *escolhe* o que colocar nessa lista. A lista *descreve* o seu código. Para alterar a lista de dependências, altere o código.

Isso pode parecer como resolver uma equação. Você pode começar com um objetivo (por exemplo, remover uma dependência) e precisa “encontrar” o código que corresponda a esse objetivo. Nem todo mundo acha divertido resolver equações, e a mesma coisa pode ser dita sobre escrever efeitos! Felizmente, há uma lista de receitas comuns que você pode experimentar abaixo.

<Pitfall>

Se você tiver uma base de código existente, poderá ter alguns efeitos que suprimem o linter dessa forma:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite ignorar o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando as dependências não correspondem ao código, há um risco muito alto de introduzir bugs.** Ignorar o linter faz com que você “enganar” o React sobre os valores dos quais seu efeito depende.

Em vez disso, utilize as técnicas abaixo.

</Pitfall>

<DeepDive>

#### Por que ignorar o linter de dependências é tão perigoso? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Ignorar o linter pode resultar em bugs complexos e não intuitivos, que são difíceis de identificar e corrigir. Veja um exemplo:

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
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </h1>
      <hr />
      <p>
        A cada segundo, incremente:
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

Digamos que você queira executar o efeito “somente na montagem”. Você leu que uma lista de dependências [vazia (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) faz isso, então decidiu ignorar o linter e especificou `[]` como as dependências.

Este contador deveria ser incrementado a cada segundo pelo valor configurável com os dois botões. No entanto, como você “enganou” o React, dizendo que esse Efeito não depende de nada, o React continua usando a função onTick do render inicial. [Durante esse render](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), o `count` era `0` e o `increment` era `1`. É por isso que `onTick` daquele render sempre chama `setCount(0 + 1)` a cada segundo, e você sempre vê o valor `1`. Bugs como este são mais difíceis de corrigir quando estão espalhados por vários componentes.

Sempre há uma solução melhor do que ignorar o linter! Para corrigir esse código, você precisa adicionar `onTick` à lista de dependências. (Para garantir que o intervalo seja configurado apenas uma vez, [faça `onTick` um Evento de Efeito](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Recomendamos tratar o erro de dependência do lint como um erro de compilação. Se você não ignorá-lo, nunca encontrará erros como este.** O restante desta página documenta as alternativas para esse e outros casos.

</DeepDive>

## Removendo dependências desnecessárias {/*removing-unnecessary-dependencies*/}

Toda vez que você ajustar as dependências do Efeito para refletir o código, examine a lista de dependências. Faz sentido que o Efeito seja executado novamente quando alguma dessas dependências for alterada? Às vezes, a resposta é “não”:

- Você pode querer reexecutar *partes diferentes* do seu Efeito sob condições distintas.
- Pode ser necessário ler apenas o *valor mais recente* de alguma dependência em vez de "reagir" às suas alterações.
- Uma dependência pode mudar com muita frequência *não intencionalmente* porque é um objeto ou uma função.

Para encontrar a solução certa, você precisará responder a algumas perguntas sobre o seu Efeito. Vamos examiná-las.

### Esse código deve ser movido para um manipulador de eventos? {/*should-this-code-move-to-an-event-handler*/}

A primeira coisa que você deve pensar é se esse código deve ser um Efeito.

Imagine um formulário. Ao enviar, você define a variável de estado `submitted` como `true`. Você precisa enviar uma solicitação POST e mostrar uma notificação. Você colocou essa lógica dentro de um Efeito que “reage” ao fato de `submitted` ser `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evite: Lógica específica do evento dentro de um Efeito
      post('/api/register');
      showNotification('Bem-sucedido registrado!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Posteriormente, você deseja estilizar a mensagem de notificação de acordo com o tema atual, portanto, você lê o tema atual. Como o `theme` é declarado no corpo do componente, ele é um valor reativo, portanto, você o adiciona como uma dependência:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evite: Lógica específica do evento dentro de um Efeito
      post('/api/register');
      showNotification('Bem-sucedido registrado!', theme);
    }
  }, [submitted, theme]); // ✅ Todas as dependências declaradas

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Ao fazer isso, você introduziu um bug. Imagine que você envie o formulário primeiro e depois alterne entre os temas Escuro e Claro. O `theme` mudará, o Efeito será executado novamente e, portanto, exibirá a mesma notificação novamente!

**O problema aqui é que isso não deveria ser um efeito em primeiro lugar.** Você deseja enviar essa solicitação POST e mostrar a notificação em resposta ao *envio do formulário*, que é uma interação específica. Para executar algum código em resposta a uma interação específica, coloque essa lógica diretamente no manipulador de eventos correspondente:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Bom: A lógica específica do evento é chamada pelos manipuladores de eventos
    post('/api/register');
    showNotification('Bem-sucedido registrado!', theme);
  }  

  // ...
}
```

Agora que o código está em um manipulador de eventos, ele não é reativo, portanto, só será executado quando o usuário enviar o formulário. Leia mais sobre [escolhendo entre manipuladores de eventos e efeitos](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) e [como excluir efeitos desnecessários](/learn/you-might-not-need-an-effect)

### Seu efeito está fazendo várias coisas não relacionadas? {/*is-your-effect-doing-several-unrelated-things*/}

A próxima pergunta que você deve fazer a si mesmo é se o seu Efeito está fazendo várias coisas não relacionadas.

Imagine que você está criando um formulário de envio em que o usuário precisa escolher a cidade e a região. Você obtém a lista de `cities` do servidor de acordo com o `country` selecionado para mostrá-las em um menu suspenso:

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

Esse é um bom exemplo de [obtenção de dados em um Efeito](/learn/you-might-not-need-an-effect#fetching-data) Você está sincronizando o estado das `cities` com a rede de acordo com a propriedade `country`. Não é possível fazer isso em um manipulador de eventos porque você precisa buscar os dados assim que o `ShippingForm` for exibido e sempre que o `country` for alterado (independentemente da interação que o causar).

Agora, digamos que você está adicionando uma segunda caixa de seleção para áreas da cidade, que deve buscar as `areas` da `city` selecionada no momento. Você pode começar adicionando uma segunda chamada `fetch` para obter a lista de áreas dentro do mesmo Efeito:

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
    // 🔴 Evite: Um único efeito sincroniza dois processos independentes
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

Entretanto, como o Efeito agora usa a variável de estado `city`, você teve que adicionar `city` à lista de dependências. Isso, por sua vez, introduziu um problema: quando o usuário selecionar uma cidade diferente, o Efeito será executado novamente e chamará `fetchCities(country)`. Como resultado, você estará recuperando desnecessariamente a lista de cidades várias vezes.

**O problema com esse código é que você está sincronizando duas coisas diferentes e não relacionadas:**

1. Você deseja sincronizar o estado `cities` com a rede com base na propriedade `country`.
1. Você deseja sincronizar o estado `areas` com a rede com base no estado `city`.

Divida a lógica em dois Efeitos, cada um dos quais reage à propriedade com a qual precisa se sincronizar:

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

Agora, o primeiro efeito só é executado novamente se o `country` altera, enquanto o segundo efeito é executado novamente quando a `city` altera. Você os separou por finalidade: duas coisas diferentes são sincronizadas por dois efeitos separados. Dois efeitos separados têm duas listas de dependências separadas, de modo que não acionam um ao outro de forma não intencional.

O código final é mais longo que o original, mas a divisão desses Efeitos ainda está correta. [Cada efeito deve representar um processo de sincronização independente](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Neste exemplo, a exclusão de um efeito não quebra a lógica do outro efeito. Isso significa que eles *sincronizam coisas diferentes* e é bom separá-los. Se estiver preocupado com a duplicação, você pode melhorar esse código [extraindo a lógica repetitiva em um Hook personalizado](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Você está lendo algum estado para calcular o próximo estado? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Esse Efeito atualiza a variável de estado `messages` com uma matriz recém-criada sempre que uma nova mensagem chega:

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

Ele usa a variável `messages` para [criar uma nova matriz](/learn/updating-arrays-in-state) começando com todas as mensagens existentes e adicionando a nova mensagem no final. Entretanto, como `messages` é um valor reativo lido por um Effect, ele deve ser uma dependência:

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

Toda vez que você recebe uma mensagem, `setMessages()` faz com que o componente seja renderizado novamente com uma nova matriz `messages` que inclui a mensagem recebida. Entretanto, como esse Efeito agora depende de `messages`, isso *também* ressincronizará o Efeito. Portanto, cada nova mensagem fará com que o chat se reconecte. O usuário não gostaria disso!

Para corrigir o problema, não leia `messages` dentro do Efeito. Em vez disso, passe uma [função de atualização](/reference/react/useState#updating-state-based-on-the-previous-state) para `setMessages`:

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

**Observe como seu Efeito não lê a variável `messages` agora.** Você só precisa passar uma função atualizadora como `msgs => [...msgs, receivedMessage]`. O React [coloca sua função atualizadora em uma fila](/learn/queueing-a-series-of-state-updates) e fornecerá o argumento `msgs` a ela durante a próxima renderização. É por isso que o efeito em si não precisa mais depender de `messages`. Como resultado dessa correção, o recebimento de uma mensagem de chat não fará mais com que o chat seja reconectado.

### Você deseja ler um valor sem “reagir” às suas alterações? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Esta seção descreve uma API **experimental que ainda não foi lançada** em uma versão estável do React.

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

Como seu Efeito agora usa `isMuted` em seu código, você precisa adicioná-lo às dependências:

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

O problema é que toda vez que `isMuted` é alterado (por exemplo, quando o usuário pressiona o botão de alternância Silenciado), o Efeito é ressincronizado e se reconecta ao chat. Essa não é a experiência de usuário desejada! (Neste exemplo, nem mesmo a desativação do linter funcionaria - se você fizer isso, o `isMuted` ficará “preso” ao seu valor antigo).

Para resolver esse problema, você precisa extrair do Efeito a lógica que não deve ser reativa. Você não quer que esse efeito “reaja” às alterações em `isMuted`. [Mova essa parte não reativa da lógica para um Evento de Efeito:](/learn/separating-events-from-effects#declaring-an-effect-event)

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

Os Eventos de Efeito permitem que você divida um Efeito em partes reativas (que devem “reagir” a valores reativos como `roomId` e suas alterações) e partes não reativas (que apenas leem seus valores mais recentes, como `onMessage` lê `isMuted`). **Agora que você lê `isMuted` dentro de um Evento de Efeito, ele não precisa ser uma dependência do seu Efeito.** Como resultado, o chat não se reconectará quando você ativar e desativar a configuração “Muted”, resolvendo o problema original!

#### Envolvimento de um manipulador de eventos a partir dos props {/*wrapping-an-event-handler-from-the-props*/}

Você pode se deparar com um problema semelhante quando seu componente recebe um manipulador de eventos como uma propriedade:

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

Como o `onReceiveMessage` é uma dependência, isso faria com que o Effect fosse ressincronizado após cada nova renderização do pai. Isso faria com que ele se reconectasse ao chat. Para resolver isso, envolva a chamada em um Evento de Efeito:

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

Os Eventos de Efeitos não são reativos, portanto, você não precisa especificá-los como dependências. Como resultado, o bate-papo não será mais reconectado, mesmo que o componente pai passe uma função que seja diferente a cada nova renderização.

#### Separação de código reativo e não reativo {/*separating-reactive-and-non-reactive-code*/}

Neste exemplo, você deseja registrar uma visita sempre que o `roomId` for alterado. Além disso, você quer incluir o `notificationCount` atual em cada registro, mas *sem* que uma alteração em `notificationCount` dispare um novo evento de registro.

A solução, mais uma vez, é separar o código não reativo em um Evento de Efeito:

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

Você deseja que sua lógica seja reativa com relação a `roomId`, portanto, você lê `roomId` dentro do seu Efeito. No entanto, você não quer que uma alteração em `notificationCount` registre uma visita extra, então você lê `notificationCount` dentro do Evento de Efeito. [Saiba mais sobre como ler as últimas props e o estado dos efeitos usando Efeito Events](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Algum valor reativo muda involuntariamente? {/*does-some-reactive-value-change-unintentionally*/}

Às vezes, você *quer* que seu Efeito “reaja” a um determinado valor, mas esse valor muda com mais frequência do que você gostaria e pode não refletir nenhuma mudança real da perspectiva do usuário. Por exemplo, digamos que você crie um objeto `options` no corpo do seu componente e, em seguida, leia esse objeto de dentro do seu Efeito:

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

Esse objeto é declarado no corpo do componente, portanto, é um [valor reativo.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Quando você lê um valor reativo como esse dentro de um Efeito, você o declara como uma dependência. Isso garante que seu efeito “reaja” a suas alterações:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas as dependências declaradas
  // ...
```

É importante declará-lo como uma dependência! Isso garante, por exemplo, que se o `roomId` for alterado, seu Efeito se conectará novamente ao chat com as novas `options`. No entanto, também há um problema com o código acima. Para ver isso, tente digitar na entrada da caixa de areia abaixo e observe o que acontece no console:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Desative temporariamente a linter para demonstrar o problema
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
      <h1>Bem-vindo(a) à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor.
  return {
    connect() {
      console.log('✅ Conectando-se à sala  "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala  "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No exemplo acima, a entrada de texto apenas atualiza a variável de estado `message`. Do ponto de vista do usuário, isso não deveria afetar a conexão do chat. No entanto, toda vez que você atualiza a `message`, o seu componente é re-renderizado. Quando o componente é re-renderizado, o código dentro dele é executado novamente desde o início.

Um novo objeto `options` é criado do zero a cada re-renderização do componente ChatRoom. O React percebe que o objeto `options` é *diferente* do objeto `options` criado durante a renderização anterior. É por isso que ele re-sincroniza o seu Efeito (que depende de `options`), e o chat se reconecta conforme você digita.

**Esse problema afeta apenas objetos e funções. Em JavaScript, cada objeto e função recém-criados são considerados distintos de todos os outros. Não importa se o conteúdo dentro deles pode ser o mesmo!**

```js {7-8}
// Durante a primeira renderização
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'música' };

// Durante a próxima renderização
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'música' };

// Esses são dois objetos diferentes!
console.log(Object.is(options1, options2)); // falso
```

**As dependências de objetos e funções podem fazer com que seu Efeito seja ressincronizado com mais frequência do que o necessário.**

É por isso que, sempre que possível, você deve tentar evitar objetos e funções como dependências de seu Efeito. Em vez disso, tente movê-los para fora do componente, dentro do Efeito, ou extrair valores primitivos deles.

#### Mova objetos e funções estáticas para fora do seu componente {/*move-static-objects-and-functions-outside-your-component*/}

Se o objeto não depender de nenhuma propriedade e estado, você poderá movê-lo para fora do seu componente:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'música'
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

Dessa forma, você *prova* para o linter que ele não é reativo. Como ele não pode mudar como resultado de uma re-renderização, não precisa ser uma dependência. Agora, re-renderizar `ChatRoom` não fará com que seu Efeito se re-sincronize.

Isso também funciona para funções:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'música'
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

Como o `createOptions` é declarado fora de seu componente, ele não é um valor reativo. É por isso que ele não precisa ser especificado nas dependências de seu Effect e nunca fará com que seu Efeito seja ressincronizado.

#### Mova objetos e funções dinâmicos dentro de seu Efeito {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Se o seu objeto depender de algum valor reativo que possa mudar como resultado de uma nova renderização, como um prop `roomId`, você não poderá movê-lo *para fora* do seu componente. No entanto, você pode transferir sua criação para dentro do código do seu Efeito:

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

Agora que `options` foi declarado dentro de seu Efeito, ele não é mais uma dependência de seu Efeito. Em vez disso, o único valor reativo usado por seu Efeito é `roomId`. Como `roomId` não é um objeto ou uma função, você pode ter certeza de que ele não será *intencionalmente* diferente. Em JavaScript, os números e as cadeias de caracteres são comparados por seu conteúdo:

```js {7-8}
// Durante a primeira renderização
const roomId1 = 'música';

// Durante a próxima renderização
const roomId2 = 'música';

// Essas duas cordas são iguais!
console.log(Object.is(roomId1, roomId2)); // Verdadeiro
```

Graças a essa correção, o bate-papo não será mais reconectado se você editar a entrada:

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
      <h1>Bem-vindo(a) à sala {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real se conectaria ao servidor.
  return {
    connect() {
      console.log('✅ Conectando-se à sala  "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala  "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

No entanto, ele se *reconecta* quando você altera o menu suspenso `roomId`, conforme esperado.

Isso também funciona para funções:

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

Você pode escrever suas próprias funções para agrupar partes da lógica dentro do seu Efeito. Desde que você também as declare *dentro* do seu Efeito, elas não são valores reativos e, portanto, não precisam ser dependências do seu Efeito.

#### Leia valores primitivos a partir de objetos {/*read-primitive-values-from-objects*/}

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

O risco aqui é que o componente pai crie o objeto durante a renderização:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Isso faria com que seu Efeito fosse reconectado toda vez que o componente pai fosse renderizado novamente. Para corrigir isso, leia as informações do objeto *fora* do Efeito e evite ter dependências de objetos e funções:

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

A lógica pode se tornar um pouco repetitiva (você lê alguns valores de um objeto fora de um Efeito e, em seguida, cria um objeto com os mesmos valores dentro do Efeito). Mas isso torna muito explícito em quais informações seu Efeito *realmente* depende. Se um objeto for recriado inadvertidamente pelo componente pai, o chat não será reconectado. No entanto, se `options.roomId` ou `options.serverUrl` forem realmente diferentes, o chat será reconectado.

#### Calcular valores primitivos a partir de funções {/*calculate-primitive-values-from-functions*/}

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

Para evitar que ele se torne uma dependência (e cause a reconexão em novas renderizações), obtenha-o fora do Efeito. Isso fornece os valores `roomId` e `serverUrl` que não são objetos e que você pode ler de dentro do seu Efeito:

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

Isso só funciona para funções [puras](/learn/keeping-components-pure) porque elas são seguras para chamar durante a renderização. Se sua função for um manipulador de eventos, mas você não quiser que suas alterações ressincronizem seu Efeito, [envolva-a em um Evento de Efeito em vez disso.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- As dependências devem sempre refletir o código atual.
- Se você não estiver satisfeito com suas dependências, a edição deve ser feita no código.
- Ignorar o linter pode causar bugs confusos; você deve sempre evitar essa prática.
- Para remover uma dependência, você precisa “provar” ao linter que ela não é necessária.
- Se algum código deve ser executado em resposta a uma interação específica, mova esse código para um manipulador de eventos.
- Se diferentes partes do seu efeito devem ser executadas novamente por motivos distintos, divida-o em vários efeitos.
- Se você precisar atualizar um estado com base no estado anterior, utilize uma função atualizadora.
- Se você quiser ler o valor mais recente sem reagir a ele, extraia um Evento de Efeito do seu Efeito.
- Em JavaScript, objetos e funções são considerados diferentes se forem criados em momentos distintos.
- Evite depender de objetos e funções. Mova-os para fora do componente ou para dentro do Efeito.

</Recap>

<Challenges>

#### Fix a resetting interval {/*fix-a-resetting-interval*/}

This Effect sets up an interval that ticks every second. You've noticed something strange happening: it seems like the interval gets destroyed and re-created every time it ticks. Fix the code so that the interval doesn't get constantly re-created.

<Hint>

It seems like this Effect's code depends on `count`. Is there some way to not need this dependency? There should be a way to update the `count` state based on its previous value without adding a dependency on that value.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

You want to update the `count` state to be `count + 1` from inside the Effect. However, this makes your Effect depend on `count`, which changes with every tick, and that's why your interval gets re-created on every tick.

To solve this, use the [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) and write `setCount(c => c + 1)` instead of `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, so you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.

</Solution>

#### Fix a retriggering animation {/*fix-a-retriggering-animation*/}

In this example, when you press "Show", a welcome message fades in. The animation takes a second. When you press "Remove", the welcome message immediately disappears. The logic for the fade-in animation is implemented in the `animation.js` file as plain JavaScript [animation loop.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) You don't need to change that logic. You can treat it as a third-party library. Your Effect creates an instance of `FadeInAnimation` for the DOM node, and then calls `start(duration)` or `stop()` to control the animation. The `duration` is controlled by a slider. Adjust the slider and see how the animation changes.

This code already works, but there is something you want to change. Currently, when you move the slider that controls the `duration` state variable, it retriggers the animation. Change the behavior so that the Effect does not "react" to the `duration` variable. When you press "Show", the Effect should use the current `duration` on the slider. However, moving the slider itself should not by itself retrigger the animation.

<Hint>

Is there a line of code inside the Effect that should not be reactive? How can you move non-reactive code out of the Effect?

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

Your Effect needs to read the latest value of `duration`, but you don't want it to "react" to changes in `duration`. You use `duration` to start the animation, but starting animation isn't reactive. Extract the non-reactive line of code into an Effect Event, and call that function from your Effect.

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

Effect Events like `onAppear` are not reactive, so you can read `duration` inside without retriggering the animation.

</Solution>

#### Fix a reconnecting chat {/*fix-a-reconnecting-chat*/}

In this example, every time you press "Toggle theme", the chat re-connects. Why does this happen? Fix the mistake so that the chat re-connects only when you edit the Server URL or choose a different chat room.

Treat `chat.js` as an external third-party library: you can consult it to check its API, but don't edit it.

<Hint>

There's more than one way to fix this, but ultimately you want to avoid having an object as your dependency.

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
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
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

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
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

Your Effect is re-running because it depends on the `options` object. Objects can be re-created unintentionally, you should try to avoid them as dependencies of your Effects whenever possible.

The least invasive fix is to read `roomId` and `serverUrl` right outside the Effect, and then make the Effect depend on those primitive values (which can't change unintentionally). Inside the Effect, create an object and pass it to `createConnection`:

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
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
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

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

It would be even better to replace the object `options` prop with the more specific `roomId` and `serverUrl` props:

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
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
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

  return <h1>Welcome to the {roomId} room!</h1>;
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sticking to primitive props where possible makes it easier to optimize your components later.

</Solution>

#### Fix a reconnecting chat, again {/*fix-a-reconnecting-chat-again*/}

This example connects to the chat either with or without encryption. Toggle the checkbox and notice the different messages in the console when the encryption is on and off. Try changing the room. Then, try toggling the theme. When you're connected to a chat room, you will receive new messages every few seconds. Verify that their color matches the theme you've picked.

In this example, the chat re-connects every time you try to change the theme. Fix this. After the fix, changing the theme should not re-connect the chat, but toggling encryption settings or changing the room should re-connect.

Don't change any code in `chat.js`. Other than that, you can change any code as long as it results in the same behavior. For example, you may find it helpful to change which props are being passed down.

<Hint>

You're passing down two functions: `onMessage` and `createConnection`. Both of them are created from scratch every time `App` re-renders. They are considered to be new values every time, which is why they re-trigger your Effect.

One of these functions is an event handler. Do you know some way to call an event handler an Effect without "reacting" to the new values of the event handler function? That would come in handy!

Another of these functions only exists to pass some state to an imported API method. Is this function really necessary? What is the essential information that's being passed down? You might need to move some imports from `App.js` to `ChatRoom.js`.

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

There's more than one correct way to solve this, but here is one possible solution.

In the original example, toggling the theme caused different `onMessage` and `createConnection` functions to be created and passed down. Since the Effect depended on these functions, the chat would re-connect every time you toggle the theme.

To fix the problem with `onMessage`, you needed to wrap it into an Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Unlike the `onMessage` prop, the `onReceiveMessage` Effect Event is not reactive. This is why it doesn't need to be a dependency of your Effect. As a result, changes to `onMessage` won't cause the chat to re-connect.

You can't do the same with `createConnection` because it *should* be reactive. You *want* the Effect to re-trigger if the user switches between an encrypted and an unencryption connection, or if the user switches the current room. However, because `createConnection` is a function, you can't check whether the information it reads has *actually* changed or not. To solve this, instead of passing `createConnection` down from the `App` component, pass the raw `roomId` and `isEncrypted` values:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Now you can move the `createConnection` function *inside* the Effect instead of passing it down from the `App`:

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

After these two changes, your Effect no longer depends on any function values:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
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

As a result, the chat re-connects only when something meaningful (`roomId` or `isEncrypted`) changes:

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

</Solution>

</Challenges>
