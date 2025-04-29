---
title: 'Removendo Dependências de Efeitos'
---

<Intro>

Quando você escreve um efeito, o linter verifica se você incluiu todos os valores reativos (como props e state) que o efeito lê na lista de dependências do seu efeito. Isso garante que seu efeito permaneça sincronizado com as últimas propriedades e o estado de seu componente. Dependências desnecessárias podem fazer com que seu Efeito seja executado com muita frequência ou até mesmo criar um loop infinito. Siga este guia para revisar e remover dependências desnecessárias de seus efeitos.

</Intro>

<YouWillLearn>

- Como corrigir loops de dependência de efeito infinito
- O que fazer quando você quiser remover uma dependência
- Como ler um valor de seu Efeito sem “reagir” a ele
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

A última parte é importante. **Se você deseja alterar as dependências, modifique o código ao redor primeiro.** Você pode considerar a lista de dependências como [uma lista de todos os valores reativos usados pelo código do seu Efeito.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Você não *escolhe* o que colocar nessa lista. A lista *descreve* o seu código. Para alterar a lista de dependências, altere o código.

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

Este Efeito atualiza a variável de estado `messages` com uma *array* recém-criada sempre que chega uma nova mensagem:

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

Ele usa a variável `messages` para [criar um novo array](/learn/updating-arrays-in-state) começando com todas as mensagens existentes e adicionando a nova mensagem no final. Entretanto, como `messages` é um valor reativo lido por um Efeito, ele deve ser uma dependência:

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

Toda vez que você recebe uma mensagem, `setMessages()` faz com que o componente seja renderizado novamente com um novo *array* `messages` que inclui a mensagem recebida. Entretanto, como esse Efeito agora depende de `messages`, isso *também* ressincronizará o Efeito. Portanto, cada nova mensagem fará com que o chat se reconecte. O usuário não gostaria disso!

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

Como o `onReceiveMessage` é uma dependência, isso faria com que o Efeito fosse ressincronizado após cada nova renderização do pai. Isso faria com que ele se reconectasse ao chat. Para resolver isso, envolva a chamada em um Evento de Efeito:

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

Como o `createOptions` é declarado fora de seu componente, ele não é um valor reativo. É por isso que ele não precisa ser especificado nas dependências de seu Efeito e nunca fará com que seu Efeito seja ressincronizado.

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

#### Fixar um intervalo de reinicialização {/*fix-a-resetting-interval*/}

Esse Efeito configura um intervalo que passa a cada segundo. Você notou que algo estranho está acontecendo: parece que o intervalo é destruído e recriado toda vez que ele faz tique-taque. Corrija o código para que o intervalo não seja recriado constantemente.

<Hint>

Parece que o código desse Efeito depende do `count`. Existe alguma maneira de não precisar dessa dependência? Deve haver uma maneira de atualizar o estado do `count` com base em seu valor anterior sem adicionar uma dependência a esse valor.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Intervalo de tique-taque');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Limpar o intervalo');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

<Solution>

Você deseja atualizar o estado `count` para que seja `count + 1` de dentro do Efeito. Entretanto, isso faz com que seu Efeito dependa de `count`, que muda a cada tique-taque, e é por isso que seu intervalo é recriado a cada tique-taque.

Para resolver isso, use a [função atualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) e escreva `setCount(c => c + 1)` em vez de `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Intervalo de tique-taque');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Limpar o intervalo');
      clearInterval(id);
    };
  }, []);

  return <h1>Contador: {count}</h1>
}
```

</Sandpack>

Em vez de ler o valor de `count` dentro do Efeito, você passa uma instrução `c => c + 1` ("incremente esse número!") para o React. O React aplicará essa instrução na próxima renderização. Como você não precisa mais ler o valor de `count` dentro do seu Efeito, você pode manter as dependências do Efeito vazias (`[]`). Isso evita que o Efeito recrie o intervalo a cada tique-taque.

</Solution>

#### Corrigir uma animação que está sendo reiniciada repetidamente {/*fix-a-retriggering-animation*/}

Neste exemplo, ao pressionar "Mostrar", uma mensagem de boas-vindas aparece gradualmente. A animação leva um segundo. Quando você pressiona "Remover", a mensagem de boas-vindas desaparece imediatamente. A lógica para a animação de fade-in é implementada no arquivo `animation.js` como um [loop de animação](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) em JavaScript. Você não precisa alterar essa lógica, pois pode tratá-la como uma biblioteca de terceiros. Seu Efeito cria uma instância de `FadeInAnimation` para o nó do DOM e depois chama `start(duration)` ou `stop()` para controlar a animação. A `duration` é controlada por um *slider*. Ajuste o *slider* e veja como a animação muda.

Esse código já funciona, mas há algo que você deseja modificar. Atualmente, quando você move o *slider* que controla a variável de estado `duration`, ele reinicia a animação. Altere o comportamento para que o Efeito não "reaja" à variável `duration`. Quando você pressionar "Mostrar", o Efeito deve usar a `duration` atual do *slider*. No entanto, mover o *slider* em si não deve reiniciar a animação.

<Hint>

Existe uma linha de código dentro do Efeito que não deveria ser reativa? Como você pode mover código não reativo para fora do Efeito?

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
      Bem-vindo(a)
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
        Duração do fade-in: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remover' : 'Mostrar'}
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
      // Ir para o final imediatamente
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Comece a animar
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

<Solution>

Seu Efeito precisa ler o valor mais recente de `duration`, mas você não quer que ele "reaja" às mudanças em `duration`. Você usa `duration` para iniciar a animação, mas iniciar a animação não é reativo. Extraia a linha de código não reativa para um Evento de Efeito e chame essa função a partir do seu Efeito.

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
      Bem-vindo(a)
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
         Duração do fade-in: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remover' : 'Mostrar'}
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
```

</Sandpack>

Eventos de Efeito, como `onAppear`, não são reativos, portanto você pode ler `duration` dentro sem disparar a animação.

</Solution>

#### Corrigir um chat que está se reconectando {/*fix-a-reconnecting-chat*/}

Neste exemplo, toda vez que você pressiona "Alternar tema", o chat se reconecta. Por que isso acontece? Corrija o erro para que o chat se reconecte apenas quando você editar a URL do servidor ou escolher uma sala de chat diferente.

Trate `chat.js` como uma biblioteca externa de terceiros: você pode consultá-la para verificar sua API, mas não edite o código.

<Hint>

Há mais de uma maneira de corrigir isso, mas, no final, você deve evitar ter um objeto como sua dependência.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('geral');
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
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
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
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Seu Efeito está sendo reexecutado porque depende do objeto `options`. Objetos podem ser recriados involuntariamente, você deve tentar evitar usá-los como dependências dos seus Efeitos sempre que possível.

A correção menos invasiva é ler `roomId` e `serverUrl` logo fora do Efeito e, em seguida, fazer com que o Efeito dependa desses valores primitivos (que não podem mudar involuntariamente). Dentro do Efeito, crie um objeto e passe-o para `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('geral');
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
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
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
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Seria ainda melhor substituir a propriedade de objeto `options` pelas propriedades mais específicas `roomId` e `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('geral');
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
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="música">música</option>
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

  return <h1>Bem-vindo(a) à sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Manter-se aos *props* primitivos, quando possível, facilita a otimização futura dos seus componentes.

</Solution>

#### Corrigir um chat que reconecta, novamente {/*fix-a-reconnecting-chat-again*/}

Neste exemplo, a conexão com o chat pode ser feita com ou sem criptografia. Marque e desmarque a caixa de seleção para notar as mensagens diferentes no console quando a criptografia está ativada ou desativada. Experimente mudar a sala. Em seguida, tente alternar o tema. Quando você está conectado a uma sala de chat, você receberá novas mensagens a cada poucos segundos. Verifique se a cor das mensagens corresponde ao tema que você escolheu.

Neste exemplo, o chat reconecta toda vez que você tenta mudar o tema. Corrija isso. Após a correção, mudar o tema não deve reconectar o chat, mas alternar as configurações de criptografia ou mudar a sala deve reconectar.

Não altere nenhum código em `chat.js`. Além disso, você pode alterar qualquer código, desde que resulte no mesmo comportamento. Por exemplo, pode ser útil alterar quais props estão sendo passadas.

<Hint>

Você está passando duas funções: `onMessage` e `createConnection`. Ambas são criadas do zero toda vez que o `App` é renderizado novamente. Por isso, são consideradas como valores novos a cada renderização, o que faz com que o seu Efeito seja reexecutado.

Um desses manipuladores é um manipulador de eventos. Você conhece alguma forma de chamar um manipulador de eventos dentro de um Efeito sem que ele "reaja" aos novos valores da função do manipulador de eventos? Isso seria bastante útil!

Outra dessas funções existe apenas para passar um estado para um método de API importado. Essa função é realmente necessária? Qual é a informação essencial que está sendo passada adiante? Você pode precisar mover algumas importações de `App.js` para `ChatRoom.js`.

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
  const [roomId, setRoomId] = useState('geral');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Habilitar criptografia
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('Nova mensagem: ' + msg, isDark ? 'dark' : 'light');
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

  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografado');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('ei')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografada)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" (sem criptografia)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('ei')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado da sala "' + roomId + '" (sem criptografia)');
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

Há mais de uma maneira correta de resolver isso, mas aqui está uma solução possível.

No exemplo original, alternar o tema fazia com que diferentes funções `onMessage` e `createConnection` fossem criadas e passadas para baixo. Como o Efeito dependia dessas funções, o chat seria reconectado toda vez que o tema fosse alterado.

Para resolver o problema com `onMessage`, você precisava envolvê-lo em um evento Efeito:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Diferente da prop `onMessage`, o Evento de Efeito `onReceiveMessage` não é reativo. É por isso que ele não precisa ser uma dependência do seu Efeito. Como resultado, mudanças no `onMessage` não farão com que o chat se reconecte.

Você não pode fazer o mesmo com `createConnection` porque ele *deve* ser reativo. Você *quer* que o Efeito seja acionado novamente se o usuário trocar entre uma conexão criptografada e uma não criptografada, ou se o usuário trocar a sala atual. Entretanto, como `createConnection` é uma função, não é possível verificar se a informação lida mudou ou não. Para resolver isso, ao invés de passar `createConnection` do componente `App`, passe os valores brutos de `roomId` e `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nova mensagem: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Agora você pode mover a função `createConnection` para *dentro* do Efeito em vez de passá-la como uma propriedade de `App`:

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

Após estas duas alterações, o seu Efeito já não depende de quaisquer valores de função:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Valores reativos
  const onReceiveMessage = useEffectEvent(onMessage); // Não reativo

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Leitura de um valor reativo
      };
      if (isEncrypted) { // Leitura de um valor reativo
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

Como resultado, o chat só volta a ligar-se quando algo significativo (`roomId` ou `isEncrypted`) muda:

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
  const [roomId, setRoomId] = useState('geral');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Usar tema escuro
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Habilitar criptografia
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nova mensagem: ' + msg, isDark ? 'dark' : 'light');
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

  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma cadeia de caracteres. Recebido: ' + roomId);
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
            messageCallback('ei')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Desconectado da sala "' + roomId + '" (criptografada)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente se conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperava-se que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperava-se que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" (sem criptografado)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('ei')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Desconectado da sala "' + roomId + '" (sem criptografado)');
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
