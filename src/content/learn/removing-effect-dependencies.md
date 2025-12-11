---
title: 'Removendo Dependências de Efeitos'
---

<Intro>

Quando você escreve um Efeito, o linter verificará se você incluiu cada valor reativo (como props e estado) que o Efeito lê na lista de dependências do seu Efeito. Isso garante que seu Efeito permaneça sincronizado com as props e estado mais recentes do seu componente. Dependências desnecessárias podem fazer com que seu Efeito execute com muita frequência ou até mesmo crie um loop infinito. Siga este guia para revisar e remover dependências desnecessárias dos seus Efeitos.

</Intro>

<YouWillLearn>

- Como corrigir loops infinitos de dependência de Efeitos
- O que fazer quando você quer remover uma dependência
- Como ler um valor do seu Efeito sem "reagir" a ele
- Como e por que evitar dependências de objetos e funções
- Por que suprimir o linter de dependências é perigoso e o que fazer em vez disso

</YouWillLearn>

## As dependências devem corresponder ao código {/*dependencies-should-match-the-code*/}

Quando você escreve um Efeito, primeiro especifica como [iniciar e parar](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) o que quer que seu Efeito faça:

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

Então, se você deixar as dependências do Efeito vazias (`[]`), o linter sugerirá as dependências corretas:

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente conectaria ao servidor
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

[Os Efeitos "reagem" a valores reativos.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Como `roomId` é um valor reativo (pode mudar devido a uma re-renderização), o linter verifica se você o especificou como uma dependência. Se `roomId` receber um valor diferente, o React irá ressincronizar seu Efeito. Isso garante que o chat permaneça conectado à sala selecionada e "reaja" ao menu suspenso:

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente conectaria ao servidor
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

Observe que você não pode "escolher" as dependências do seu Efeito. Cada <CodeStep step={2}>valor reativo</CodeStep> usado pelo código do seu Efeito deve ser declarado em sua lista de dependências. A lista de dependências é determinada pelo código ao redor:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Este é um valor reativo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Este Efeito lê esse valor reativo
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Então você deve especificar esse valor reativo como uma dependência do seu Efeito
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
  }, []); // 🔴 React Hook useEffect tem uma dependência faltante: 'roomId'
  // ...
}
```

E o linter estaria certo! Como `roomId` pode mudar com o tempo, isso introduziria um bug no seu código.

**Para remover uma dependência, "prove" ao linter que ela *não precisa* ser uma dependência.** Por exemplo, você pode mover `roomId` para fora do seu componente para provar que não é reativo e não mudará nas re-renderizações:

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

Agora que `roomId` não é um valor reativo (e não pode mudar em uma re-renderização), não precisa ser uma dependência:

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
  // Uma implementação real realmente conectaria ao servidor
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

É por isso que você pode agora especificar uma [lista de dependências vazia (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means). Seu Efeito *realmente não* depende mais de nenhum valor reativo, então ele *realmente não* precisa ser reexecutado quando qualquer prop ou estado do componente mudar.

### Para mudar as dependências, mude o código {/*to-change-the-dependencies-change-the-code*/}

Você deve ter notado um padrão no seu fluxo de trabalho:

1. Primeiro, você **muda o código** do seu Efeito ou como seus valores reativos são declarados.
2. Em seguida, você segue o linter e ajusta as dependências para **corresponder ao código que você mudou.**
3. Se você não estiver satisfeito com a lista de dependências, você **volta ao primeiro passo** (e muda o código novamente).

A última parte é importante. **Se você quiser mudar as dependências, mude primeiro o código ao redor.** Você pode pensar na lista de dependências como [uma lista de todos os valores reativos usados pelo código do seu Efeito.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Você não *escolhe* o que colocar nessa lista. A lista *descreve* seu código. Para mudar a lista de dependências, mude o código.

Isso pode parecer como resolver uma equação. Você pode começar com um objetivo (por exemplo, remover uma dependência) e precisa "encontrar" o código correspondente a esse objetivo. Nem todo mundo acha divertido resolver equações, e o mesmo pode ser dito sobre escrever Efeitos! Felizmente, há uma lista de receitas comuns que você pode experimentar abaixo.

<Pitfall>

Se você tem uma base de código existente, pode ter alguns Efeitos que suprimem o linter assim:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evite suprimir o linter assim:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando as dependências não correspondem ao código, há um risco muito alto de introduzir bugs.** Ao suprimir o linter, você "mente" para o React sobre os valores dos quais seu Efeito depende.

Em vez disso, use as técnicas abaixo.

</Pitfall>

<DeepDive>

#### Por que suprimir o linter de dependências é tão perigoso? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Suprimir o linter leva a bugs muito não intuitivos que são difíceis de encontrar e corrigir. Aqui está um exemplo:

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
        <button onClick={() => setCount(0)}>Resetar</button>
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

Digamos que você queria executar o Efeito "apenas na montagem". Você leu que [dependências vazias (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) fazem isso, então decidiu ignorar o linter e forçosamente especificou `[]` como as dependências.

Este contador deveria incrementar a cada segundo pela quantidade configurável com os dois botões. No entanto, como você "mentiu" para o React que este Efeito não depende de nada, o React sempre mantém a função `onTick` da renderização inicial. [Durante aquela renderização,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` era `0` e `increment` era `1`. É por isso que `onTick` daquela renderização sempre chama `setCount(0 + 1)` a cada segundo, e você sempre vê `1`. Bugs como este são mais difíceis de corrigir quando estão espalhados por vários componentes.

Sempre há uma solução melhor do que ignorar o linter! Para corrigir este código, você precisa adicionar `onTick` à lista de dependências. (Para garantir que o intervalo seja configurado apenas uma vez, [torne `onTick` um Evento de Efeito.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Recomendamos tratar o erro do linter de dependências como um erro de compilação. Se você não o suprimir, nunca verá bugs como este.** O resto desta página documenta as alternativas para este e outros casos.

</DeepDive>

## Removendo dependências desnecessárias {/*removing-unnecessary-dependencies*/}

Toda vez que você ajusta as dependências do Efeito para refletir o código, observe a lista de dependências. Faz sentido que o Efeito seja reexecutado quando qualquer uma dessas dependências mudar? Às vezes, a resposta é "não":

* Você pode querer reexecutar *partes diferentes* do seu Efeito sob condições diferentes.
* Você pode querer apenas ler o *valor mais recente* de alguma dependência em vez de "reagir" às suas mudanças.
* Uma dependência pode mudar com muita frequência *inadvertidamente* porque é um objeto ou uma função.

Para encontrar a solução certa, você precisará responder a algumas perguntas sobre seu Efeito. Vamos percorrê-las.

### Este código deve ser movido para um manipulador de evento? {/*should-this-code-move-to-an-event-handler*/}

A primeira coisa que você deve pensar é se este código deveria ser um Efeito.

Imagine um formulário. No envio, você define a variável de estado `submitted` como `true`. Você precisa enviar uma requisição POST e mostrar uma notificação. Você colocou essa lógica dentro de um Efeito que "reage" a `submitted` sendo `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evitar: Lógica específica de evento dentro de um Efeito
      post('/api/register');
      showNotification('Registrado com sucesso!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Mais tarde, você quer estilizar a mensagem de notificação de acordo com o tema atual, então você lê o tema atual. Como `theme` é declarado no corpo do componente, é um valor reativo, então você o adiciona como uma dependência:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Evitar: Lógica específica de evento dentro de um Efeito
      post('/api/register');
      showNotification('Registrado com sucesso!', theme);
    }
  }, [submitted, theme]); // ✅ Todas as dependências declaradas

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Ao fazer isso, você introduziu um bug. Imagine que você envia o formulário primeiro e depois alterna entre os temas Escuro e Claro. O `theme` mudará, o Efeito será reexecutado e, portanto, exibirá a mesma notificação novamente!

**O problema aqui é que isso não deveria ser um Efeito em primeiro lugar.** Você quer enviar esta requisição POST e mostrar a notificação em resposta ao *envio do formulário*, que é uma interação específica. Para executar algum código em resposta a uma interação específica, coloque essa lógica diretamente no manipulador de evento correspondente:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Bom: Lógica específica de evento é chamada de manipuladores de evento
    post('/api/register');
    showNotification('Registrado com sucesso!', theme);
  }  

  // ...
}
```

Agora que o código está em um manipulador de evento, ele não é reativo - então só será executado quando o usuário enviar o formulário. Leia mais sobre [escolher entre manipuladores de evento e Efeitos](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) e [como excluir Efeitos desnecessários.](/learn/you-might-not-need-an-effect)

### Seu Efeito está fazendo várias coisas não relacionadas? {/*is-your-effect-doing-several-unrelated-things*/}

A próxima pergunta que você deve se fazer é se seu Efeito está fazendo várias coisas não relacionadas.

Imagine que você está criando um formulário de envio onde o usuário precisa escolher sua cidade e área. Você busca a lista de `cities` do servidor de acordo com o `country` selecionado para mostrá-las em um menu suspenso:

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

Este é um bom exemplo de [busca de dados em um Efeito.](/learn/you-might-not-need-an-effect#fetching-data) Você está sincronizando o estado `cities` com a rede de acordo com a prop `country`. Você não pode fazer isso em um manipulador de evento porque precisa buscar assim que `ShippingForm` é exibido e sempre que o `country` mudar (não importa qual interação cause isso).

Agora digamos que você está adicionando uma segunda caixa de seleção para áreas da cidade, que deve buscar as `areas` para a `city` atualmente selecionada. Você pode começar adicionando uma segunda chamada `fetch` para a lista de áreas dentro do mesmo Efeito:

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
    // 🔴 Evitar: Um único Efeito sincroniza dois processos independentes
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

No entanto, como o Efeito agora usa a variável de estado `city`, você teve que adicionar `city` à lista de dependências. Isso, por sua vez, introduziu um problema: quando o usuário seleciona uma cidade diferente, o Efeito será reexecutado e chamará `fetchCities(country)`. Como resultado, você estará buscando desnecessariamente a lista de cidades muitas vezes.

**O problema com este código é que você está sincronizando duas coisas diferentes não relacionadas:**

1. Você quer sincronizar o estado `cities` com a rede baseado na prop `country`.
2. Você quer sincronizar o estado `areas` com a rede baseado no estado `city`.

Separe a lógica em dois Efeitos, cada um reagindo à prop com a qual precisa sincronizar:

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

Agora o primeiro Efeito só é reexecutado se o `country` mudar, enquanto o segundo Efeito é reexecutado quando o `city` muda. Você os separou por propósito: duas coisas diferentes são sincronizadas por dois Efeitos separados. Dois Efeitos separados têm duas listas de dependências separadas, então não acionarão um ao outro inadvertidamente.

O código final é mais longo que o original, mas separar esses Efeitos ainda está correto. [Cada Efeito deve representar um processo de sincronização independente.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Neste exemplo, excluir um Efeito não quebra a lógica do outro Efeito. Isso significa que eles *sincronizam coisas diferentes*, e é bom separá-los. Se você está preocupado com duplicação, pode melhorar este código [extraindo lógica repetitiva em um Hook personalizado.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Você está lendo algum estado para calcular o próximo estado? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Este Efeito atualiza a variável de estado `messages` com um array recém-criado toda vez que uma nova mensagem chega:

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

Ele usa a variável `messages` para [criar um novo array](/learn/updating-arrays-in-state) começando com todas as mensagens existentes e adicionando a nova mensagem no final. No entanto, como `messages` é um valor reativo lido por um Efeito, ele deve ser uma dependência:

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

Toda vez que você recebe uma mensagem, `setMessages()` faz o componente ser re-renderizado com um novo array `messages` que inclui a mensagem recebida. No entanto, como este Efeito agora depende de `messages`, isso *também* ressincronizará o Efeito. Então, cada nova mensagem fará o chat reconectar. O usuário não gostaria disso!

Para corrigir o problema, não leia `messages` dentro do Efeito. Em vez disso, passe uma [função atualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) para `setMessages`:

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

**Observe como seu Efeito não lê mais a variável `messages`.** Você só precisa passar uma função atualizadora como `msgs => [...msgs, receivedMessage]`. O React [coloca sua função atualizadora em uma fila](/learn/queueing-a-series-of-state-updates) e fornecerá o argumento `msgs` durante a próxima renderização. É por isso que o próprio Efeito não precisa mais depender de `messages`. Como resultado desta correção, receber uma mensagem de chat não fará mais o chat reconectar.

### Você quer ler um valor sem "reagir" às suas mudanças? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Esta seção descreve uma **API experimental que ainda não foi lançada** em uma versão estável do React.

</Wip>

Suponha que você queira tocar um som quando o usuário recebe uma nova mensagem, a menos que `isMuted` seja `true`:

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

Como seu Efeito agora usa `isMuted` em seu código, você tem que adicioná-lo às dependências:

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

O problema é que toda vez que `isMuted` muda (por exemplo, quando o usuário pressiona o botão "Mudo"), o Efeito será ressincronizado e reconectará ao chat. Esta não é a experiência de usuário desejada! (Neste exemplo, mesmo desabilitar o linter não funcionaria - se você fizer isso, `isMuted` ficaria "preso" com seu valor antigo.)

Para resolver este problema, você precisa extrair a lógica que não deve ser reativa para fora do Efeito. Você não quer que este Efeito "reaja" às mudanças em `isMuted`. [Mova esta parte não reativa da lógica para um Evento de Efeito:](/learn/separating-events-from-effects#declaring-an-effect-event)

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

Eventos de Efeito permitem dividir um Efeito em partes reativas (que devem "reagir" a valores reativos como `roomId` e suas mudanças) e partes não reativas (que apenas leem seus valores mais recentes, como `onMessage` lê `isMuted`). **Agora que você lê `isMuted` dentro de um Evento de Efeito, ele não precisa ser uma dependência do seu Efeito.** Como resultado, o chat não reconectará quando você alternar a configuração "Mudo", resolvendo o problema original!

#### Envolvendo um manipulador de evento das props {/*wrapping-an-event-handler-from-the-props*/}

Você pode encontrar um problema semelhante quando seu componente recebe um manipulador de evento como prop:

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

Suponha que o componente pai passe uma função *diferente* `onReceiveMessage` em cada renderização:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Como `onReceiveMessage` é uma dependência, causaria a ressincronização do Efeito após cada re-renderização do pai. Isso faria com que ele reconectasse ao chat. Para resolver isso, envolva a chamada em um Evento de Efeito:

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

Eventos de Efeito não são reativos, então você não precisa especificá-los como dependências. Como resultado, o chat não reconectará mesmo se o componente pai passar uma função que é diferente em cada re-renderização.

#### Separando código reativo e não reativo {/*separating-reactive-and-non-reactive-code*/}

Neste exemplo, você quer registrar uma visita toda vez que `roomId` mudar. Você quer incluir o `notificationCount` atual com cada log, mas você *não* quer que uma mudança em `notificationCount` dispare um evento de log.

A solução é novamente separar o código não reativo em um Evento de Efeito:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Todas as dependências declaradas
  // ...
```

Você quer que sua lógica seja reativa em relação a `roomId`, então você lê `roomId` dentro do seu Efeito. No entanto, você não quer que uma mudança em `notificationCount` registre uma visita extra, então você lê `notificationCount` dentro do Evento de Efeito. [Saiba mais sobre como ler as props e estado mais recentes de Efeitos usando Eventos de Efeito.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Algum valor reativo muda inadvertidamente? {/*does-some-reactive-value-change-unintentionally*/}

Às vezes, você *quer* que seu Efeito "reaja" a um determinado valor, mas esse valor muda com mais frequência do que você gostaria - e pode não refletir nenhuma mudança real da perspectiva do usuário. Por exemplo, digamos que você cria um objeto `options` no corpo do seu componente e depois lê esse objeto de dentro do seu Efeito:

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

Este objeto é declarado no corpo do componente, então é um [valor reativo.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Quando você lê um valor reativo como este dentro de um Efeito, você o declara como uma dependência. Isso garante que seu Efeito "reaja" às suas mudanças:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Todas as dependências declaradas
  // ...
```

É importante declará-lo como uma dependência! Isso garante, por exemplo, que se o `roomId` mudar, seu Efeito se reconectará ao chat com as novas `options`. No entanto, também há um problema com o código acima. Para vê-lo, tente digitar na entrada na caixa de areia abaixo e observe o que acontece no console:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporariamente desabilita o linter para demonstrar o problema
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
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

Na caixa de areia acima, a entrada apenas atualiza a variável de estado `message`. Do ponto de vista do usuário, isso não deveria afetar a conexão do chat. No entanto, toda vez que você atualiza a `message`, seu componente é re-renderizado. Quando seu componente é re-renderizado, o código dentro dele é executado novamente do zero.

Um novo objeto `options` é criado do zero em cada re-renderização do componente `ChatRoom`. O React vê que o objeto `options` é um *objeto diferente* do objeto `options` criado durante a última renderização. É por isso que ele ressincroniza seu Efeito (que depende de `options`), e o chat reconecta conforme você digita.

**Este problema afeta apenas objetos e funções. Em JavaScript, cada objeto e função recém-criado é considerado distinto de todos os outros. Não importa que o conteúdo dentro deles possa ser o mesmo!**

```js {7-8}
// Durante a primeira renderização
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Durante a próxima renderização
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Estes são dois objetos diferentes!
console.log(Object.is(options1, options2)); // false
```

**Dependências de objetos e funções podem fazer seu Efeito ressincronizar com mais frequência do que você precisa.**

É por isso que, sempre que possível, você deve tentar evitar objetos e funções como dependências do seu Efeito. Em vez disso, tente movê-los para fora do componente, dentro do Efeito, ou extrair valores primitivos deles.

#### Mover objetos e funções estáticos para fora do seu componente {/*move-static-objects-and-functions-outside-your-component*/}

Se o objeto não depende de nenhuma prop ou estado, você pode mover esse objeto para fora do seu componente:

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

Dessa forma, você *prova* ao linter que não é reativo. Ele não pode mudar como resultado de uma re-renderização, então não precisa ser uma dependência. Agora, re-renderizar `ChatRoom` não fará com que seu Efeito seja ressincronizado.

Isso também funciona para funções:

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

Como `createOptions` é declarado fora do seu componente, não é um valor reativo. É por isso que ele não precisa ser especificado nas dependências do seu Efeito e por que nunca fará seu Efeito ressincronizar.

#### Mover objetos e funções dinâmicos para dentro do seu Efeito {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Se seu objeto depende de algum valor reativo que pode mudar como resultado de uma re-renderização, como uma prop `roomId`, você não pode puxá-lo *para fora* do seu componente. Você pode, no entanto, mover sua criação *para dentro* do código do seu Efeito:

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

Agora que `options` é declarado dentro do seu Efeito, ele não é mais uma dependência do seu Efeito. Em vez disso, o único valor reativo usado pelo seu Efeito é `roomId`. Como `roomId` não é um objeto ou função, você pode ter certeza de que não será *inadvertidamente* diferente. Em JavaScript, números e strings são comparados por seu conteúdo:

```js {7-8}
// Durante a primeira renderização
const roomId1 = 'music';

// Durante a próxima renderização
const roomId2 = 'music';

// Estas duas strings são iguais!
console.log(Object.is(roomId1, roomId2)); // true
```

Graças a esta correção, o chat não reconecta mais se você editar a entrada:

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
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

No entanto, ele *reconecta* quando você muda o menu suspenso `roomId`, como você esperaria.

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

Você pode escrever suas próprias funções para agrupar partes da lógica dentro do seu Efeito. Contanto que você também as declare *dentro* do seu Efeito, elas não são valores reativos e, portanto, não precisam ser dependências do seu Efeito.

#### Ler valores primitivos de objetos {/*read-primitive-values-from-objects*/}

Às vezes, você pode receber um objeto das props:

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

Isso faria com que seu Efeito se reconectasse toda vez que o componente pai fosse re-renderizado. Para corrigir isso, leia informações do objeto *fora* do Efeito e evite ter dependências de objetos e funções:

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

A lógica fica um pouco repetitiva (você lê alguns valores de um objeto fora de um Efeito e então cria um objeto com os mesmos valores dentro do Efeito). Mas torna muito explícito sobre qual informação seu Efeito *realmente* depende. Se um objeto for recriado inadvertidamente pelo componente pai, o chat não reconectará. No entanto, se `options.roomId` ou `options.serverUrl` forem realmente diferentes, o chat reconectará.

#### Calcular valores primitivos de funções {/*calculate-primitive-values-from-functions*/}

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

Para evitar torná-la uma dependência (e causar sua reconexão em re-renderizações), chame-a fora do Efeito. Isso fornece os valores `roomId` e `serverUrl` que não são objetos e que você pode ler de dentro do seu Efeito:

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

Isso só funciona para funções [puras](/learn/keeping-components-pure) porque são seguras para chamar durante a renderização. Se sua função é um manipulador de evento, mas você não quer que suas mudanças ressincronizem seu Efeito, [envolva-a em um Evento de Efeito.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- As dependências devem sempre corresponder ao código.
- Quando você não está satisfeito com suas dependências, o que você precisa editar é o código.
- Suprimir o linter leva a bugs muito confusos e você deve sempre evitá-lo.
- Para remover uma dependência, você precisa "provar" ao linter que ela não é necessária.
- Se algum código deve ser executado em resposta a uma interação específica, mova esse código para um manipulador de evento.
- Se partes diferentes do seu Efeito devem ser reexecutadas por razões diferentes, divida-o em vários Efeitos.
- Se você quiser atualizar algum estado com base no estado anterior, passe uma função atualizadora.
- Se você quiser ler o valor mais recente sem "reagir" a ele, extraia um Evento de Efeito do seu Efeito.
- Em JavaScript, objetos e funções são considerados diferentes se foram criados em momentos diferentes.
- Tente evitar dependências de objetos e funções. Mova-os para fora do componente ou para dentro do Efeito.

</Recap>

<Challenges>

#### Corrigir um intervalo de reset {/*fix-a-resetting-interval*/}

Este Efeito configura um intervalo que marca a cada segundo. Você notou que algo estranho está acontecendo: parece que o intervalo é destruído e recriado a cada marca. Corrija o código para que o intervalo não seja constantemente recriado.

<Dica>

Parece que o código deste Efeito depende de `count`. Existe alguma maneira de não precisar dessa dependência? Deve haver uma maneira de atualizar o estado `count` com base em seu valor anterior sem adicionar uma dependência desse valor.

</Dica>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Intervalo tick');
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

<Solução>

Você quer atualizar o estado `count` para ser `count + 1` de dentro do Efeito. No entanto, isso faz seu Efeito depender de `count`, que muda a cada tick, e é por isso que seu intervalo é recriado em cada tick.

Para resolver isso, use a [função atualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) e escreva `setCount(c => c + 1)` em vez de `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Criando um intervalo');
    const id = setInterval(() => {
      console.log('⏰ Intervalo tick');
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

Em vez de ler `count` dentro do Efeito, você passa uma instrução `c => c + 1` ("incrementar este número!") para o React. O React irá aplicá-lo na próxima renderização. E como você não precisa mais ler o valor de `count` dentro do seu Efeito, pode manter as dependências do seu Efeito vazias (`[]`). Isso impede que seu Efeito recrie o intervalo a cada tick.

</Solução>

#### Corrigir uma animação que retriggera {/*fix-a-retriggering-animation*/}

Neste exemplo, quando você pressiona "Mostrar", uma mensagem de boas-vindas aparece com fade-in. A animação leva um segundo. Quando você pressiona "Remover", a mensagem de boas-vindas desaparece imediatamente. A lógica para a animação de fade-in é implementada no arquivo `animation.js` como um [loop de animação](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) JavaScript simples. Você não precisa mudar essa lógica. Pode tratá-la como uma biblioteca de terceiros. Seu Efeito cria uma instância de `FadeInAnimation` para o nó DOM e, em seguida, chama `start(duration)` ou `stop()` para controlar a animação. A `duration` é controlada por um controle deslizante. Ajuste o controle deslizante e veja como a animação muda.

Este código já funciona, mas há algo que você quer mudar. Atualmente, quando você move o controle deslizante que controla a variável de estado `duration`, ele retriggera a animação. Altere o comportamento para que o Efeito não "reaja" à variável `duration`. Quando você pressiona "Mostrar", o Efeito deve usar a `duration` atual no controle deslizante. No entanto, mover o controle deslizante não deve por si só retriggerar a animação.

<Dica>

Há uma linha de código dentro do Efeito que não deve ser reativa? Como você pode mover código não reativo para fora do Efeito?

</Dica>

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
      Bem-vindo
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
      // Pular para o final imediatamente
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Começar a animar
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Ainda temos mais quadros para pintar
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

<Solução>

Seu Efeito precisa ler o valor mais recente de `duration`, mas você não quer que ele "reaja" às mudanças em `duration`. Você usa `duration` para iniciar a animação, mas iniciar a animação não é reativo. Extraia a linha de código não reativa em um Evento de Efeito e chame essa função do seu Efeito.

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
      Bem-vindo
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
      // Ainda temos mais quadros para pintar
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

Eventos de Efeito como `onAppear` não são reativos, então você pode ler `duration` dentro sem retriggerar a animação.

</Solução>

#### Corrigir um chat que reconecta {/*fix-a-reconnecting-chat*/}

Neste exemplo, toda vez que você pressiona "Alternar tema", o chat reconecta. Por que isso acontece? Corrija o erro para que o chat reconecte apenas quando você editar a URL do Servidor ou escolher uma sala de chat diferente.

Trate `chat.js` como uma biblioteca de terceiros externa: você pode consultá-la para verificar sua API, mas não a edite.

<Dica>

Há mais de uma maneira de corrigir isso, mas, em última análise, você quer evitar ter um objeto como sua dependência.

</Dica>

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
        URL do Servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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

  return <h1>Bem-vindo à sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
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

<Solução>

Seu Efeito está sendo reexecutado porque depende do objeto `options`. Objetos podem ser recriados inadvertidamente, você deve tentar evitá-los como dependências de seus Efeitos sempre que possível.

A correção menos invasiva é ler `roomId` e `serverUrl` logo fora do Efeito e, em seguida, fazer o Efeito depender desses valores primitivos (que não podem mudar inadvertidamente). Dentro do Efeito, crie um objeto e passe-o para `createConnection`:

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
        URL do Servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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

  return <h1>Bem-vindo à sala {options.roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
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
        URL do Servidor:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
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

Manter-se em props primitivas sempre que possível facilita a otimização de seus componentes posteriormente.

</Solução>

#### Corrigir um chat que reconecta, novamente {/*fix-a-reconnecting-chat-again*/}

Este exemplo conecta ao chat com ou sem criptografia. Alterne a caixa de seleção e observe as diferentes mensagens no console quando a criptografia está ligada e desligada. Tente mudar a sala. Em seguida, tente alternar o tema. Quando você está conectado a uma sala de chat, receberá novas mensagens a cada poucos segundos. Verifique se sua cor corresponde ao tema que você escolheu.

Neste exemplo, o chat reconecta toda vez que você tenta mudar o tema. Corrija isso. Após a correção, mudar o tema não deve reconectar o chat, mas alternar as configurações de criptografia ou mudar a sala deve reconectar.

Não mude nenhum código em `chat.js`. Além disso, você pode mudar qualquer código, desde que resulte no mesmo comportamento. Por exemplo, você pode achar útil mudar quais props estão sendo passadas.

<Dica>

Você está passando duas funções: `onMessage` e `createConnection`. Ambas são criadas do zero toda vez que `App` é re-renderizado. Elas são consideradas novos valores a cada vez, e é por isso que retriggeram seu Efeito.

Uma dessas funções é um manipulador de evento. Você conhece alguma maneira de chamar um manipulador de evento em um Efeito sem "reagir" aos novos valores da função do manipulador de evento? Isso seria útil!

A outra dessas funções só existe para passar algum estado para um método de API importado. Essa função é realmente necessária? Qual é a informação essencial que está sendo passada? Você pode precisar mover algumas importações de `App.js` para `ChatRoom.js`.

</Dica>

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

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografada)');
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
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" (não criptografada)...');
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
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografada)');
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

<Solução>

Há mais de uma maneira correta de resolver isso, mas aqui está uma solução possível.

No exemplo original, alternar o tema fazia com que diferentes funções `onMessage` e `createConnection` fossem criadas e passadas. Como o Efeito dependia dessas funções, o chat reconectava toda vez que você alternava o tema.

Para corrigir o problema com `onMessage`, você precisava envolvê-la em um Evento de Efeito:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Ao contrário da prop `onMessage`, o Evento de Efeito `onReceiveMessage` não é reativo. É por isso que ele não precisa ser uma dependência do seu Efeito. Como resultado, mudanças em `onMessage` não farão o chat reconectar.

Você não pode fazer o mesmo com `createConnection` porque ele *deve* ser reativo. Você *quer* que o Efeito seja retriggered se o usuário alternar entre uma conexão criptografada e não criptografada, ou se o usuário mudar a sala atual. No entanto, como `createConnection` é uma função, você não pode verificar se a informação que ela lê *realmente* mudou ou não. Para resolver isso, em vez de passar `createConnection` do componente `App`, passe os valores brutos `roomId` e `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nova mensagem: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Agora você pode mover a função `createConnection` *para dentro* do Efeito em vez de passá-la do `App`:

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

Após essas duas mudanças, seu Efeito não depende mais de nenhum valor de função:

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

Como resultado, o chat reconecta apenas quando algo significativo (`roomId` ou `isEncrypted`) muda:

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

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Conectando à sala "' + roomId + '"... (criptografada)');
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
  // Uma implementação real realmente conectaria ao servidor
  if (typeof serverUrl !== 'string') {
    throw Error('Esperado que serverUrl fosse uma string. Recebido: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Esperado que roomId fosse uma string. Recebido: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" (não criptografada)...');
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
      console.log('❌ Desconectado da sala "' + roomId + '" (não criptografada)');
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

</Solução>

</Challenges>