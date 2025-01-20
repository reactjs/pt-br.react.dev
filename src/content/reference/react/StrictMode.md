---
title: <StrictMode>
---


<Intro>

`<StrictMode>` permite que você encontre erros comuns em seus componentes mais cedo durante o desenvolvimento.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Use `StrictMode` para habilitar comportamentos e avisos adicionais de desenvolvimento para a árvore de componentes dentro:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Veja mais exemplos abaixo.](#usage)

O Modo Estrito habilita os seguintes comportamentos apenas para desenvolvimento:

- Seus componentes serão [re-renderizados uma vez a mais](#fixing-bugs-found-by-double-rendering-in-development) para encontrar erros causados por renderização impura.
- Seus componentes [re-executarão efeitos uma vez a mais](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar erros causados pela ausência de limpeza de efeito.
- Seus componentes [serão verificados quanto ao uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` não aceita props.

#### Ressalvas {/*caveats*/}

* Não há como optar por sair do Modo Estrito dentro de uma árvore envolvida em `<StrictMode>`. Isso dá a você confiança de que todos os componentes dentro de `<StrictMode>` estão sendo verificados. Se duas equipes trabalhando em um produto discordarem sobre a validade das verificações, elas precisam chegar a um consenso ou mover `<StrictMode>` para baixo na árvore.

---

## Uso {/*usage*/}

### Habilitando o Modo Estrito para todo o aplicativo {/*enabling-strict-mode-for-entire-app*/}

O Modo Estrito habilita verificações adicionais apenas para desenvolvimento para toda a árvore de componentes dentro do componente `<StrictMode>`. Essas verificações ajudam você a encontrar erros comuns em seus componentes no início do processo de desenvolvimento.


Para habilitar o Modo Estrito para todo o seu aplicativo, envolva seu componente raiz com `<StrictMode>` ao renderizá-lo:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Recomendamos envolver todo o seu aplicativo no Modo Estrito, especialmente para aplicativos recém-criados. Se você usar uma biblioteca que chama [`createRoot`](/reference/react-dom/client/createRoot) por você, verifique sua documentação para saber como habilitar o Modo Estrito.

Embora as verificações do Modo Estrito **executem apenas em desenvolvimento,** elas ajudam você a encontrar erros que já existem em seu código, mas que podem ser difíceis de reproduzir de forma confiável em produção. O Modo Estrito permite que você corrija erros antes que seus usuários os relatem.

<Note>

O Modo Estrito habilita as seguintes verificações em desenvolvimento:

- Seus componentes serão [re-renderizados uma vez a mais](#fixing-bugs-found-by-double-rendering-in-development) para encontrar erros causados por renderização impura.
- Seus componentes [re-executarão efeitos uma vez a mais](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar erros causados pela ausência de limpeza de efeito.
- Seus componentes [serão verificados quanto ao uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Todas essas verificações são apenas para desenvolvimento e não afetam a construção para produção.**

</Note>

---

### Habilitando o Modo Estrito para uma parte do aplicativo {/*enabling-strict-mode-for-a-part-of-the-app*/}

Você também pode habilitar o Modo Estrito para qualquer parte de sua aplicação:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Neste exemplo, as verificações do Modo Estrito não serão executadas contra os componentes `Header` e `Footer`. No entanto, elas serão executadas em `Sidebar` e `Content`, bem como todos os componentes dentro deles, não importa quão profundos sejam.

---

### Corrigindo erros encontrados por re-renderização em desenvolvimento {/*fixing-bugs-found-by-double-rendering-in-development*/}

[O React assume que cada componente que você escreve é uma função pura.](/learn/keeping-components-pure) Isso significa que os componentes React que você escreve devem sempre retornar o mesmo JSX dadas as mesmas entradas (props, estado e contexto).

Componentes que quebram essa regra se comportam de forma imprevisível e causam erros. Para ajudar você a encontrar acidentalmente código impuro, o Modo Estrito chama algumas de suas funções (apenas aquelas que deveriam ser puras) **duas vezes em desenvolvimento.** Isso inclui:

- O corpo da função do seu componente (apenas a lógica de nível superior, portanto, isso não inclui código dentro de manipuladores de eventos)
- Funções que você passa para [`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), ou [`useReducer`](/reference/react/useReducer)
- Alguns métodos de componentes de classe, como [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([veja a lista completa](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Se uma função for pura, executá-la duas vezes não altera seu comportamento porque uma função pura produz o mesmo resultado toda vez. No entanto, se uma função for impura (por exemplo, se ela muta os dados que recebe), executá-la duas vezes tende a ser notável (é isso que a torna impura!) Isso ajuda você a identificar e corrigir o erro mais cedo.

**Aqui está um exemplo para ilustrar como a re-renderização no Modo Estrito ajuda você a encontrar erros mais cedo.**

Este componente `StoryTray` recebe um array de `stories` e adiciona um último item "Criar História" no final:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "A História de Ankit" },
  {id: 1, label: "A História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Criar História' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Há um erro no código acima. No entanto, é fácil perder, pois a saída inicial parece correta.

Este erro se tornará mais perceptível se o componente `StoryTray` for re-renderizado várias vezes. Por exemplo, vamos fazer com que o `StoryTray` seja re-renderizado com uma cor de fundo diferente sempre que você passar o mouse sobre ele: 

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "A História de Ankit" },
  {id: 1, label: "A História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Criar História' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Observe como cada vez que você passa o mouse sobre o componente `StoryTray`, "Criar História" é adicionado à lista novamente. A intenção do código era adicioná-lo uma única vez ao final. Mas o `StoryTray` modifica diretamente o array `stories` a partir das props. Cada vez que o `StoryTray` é renderizado, ele adiciona "Criar História" novamente ao final do mesmo array. Em outras palavras, o `StoryTray` não é uma função pura -- executá-lo várias vezes produz resultados diferentes.

Para corrigir esse problema, você pode fazer uma cópia do array e modificar essa cópia em vez do original:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clona o array
  // ✅ Bom: Adicionando a um novo array
  items.push({ id: 'create', label: 'Criar História' });
```

Isso [tornaria a função `StoryTray` pura.](/learn/keeping-components-pure) Cada vez que é chamada, ela apenas modificaria uma nova cópia do array e não afetaria nenhum objeto ou variável externa. Isso resolve o erro, mas você teve que fazer o componente re-renderizar mais vezes antes que ficasse óbvio que algo estava errado com seu comportamento.

**No exemplo original, o erro não era óbvio. Agora, vamos envolver o código original (com erro) em `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "A História de Ankit" },
  {id: 1, label: "A História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Criar História' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**O Modo Estrito *sempre* chama sua função de renderização duas vezes, então você pode ver o erro imediatamente** ("Criar História" aparece duas vezes). Isso permite que você perceba tais erros cedo no processo. Quando você corrige seu componente para renderizar no Modo Estrito, você *também* corrige muitos possíveis erros futuros de produção, como a funcionalidade de hover mencionada anteriormente:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "A História de Ankit" },
  {id: 1, label: "A História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clona o array
  items.push({ id: 'create', label: 'Criar História' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Sem o Modo Estrito, era fácil perder o erro até que você adicionasse mais re-renderizações. O Modo Estrito fez o mesmo erro aparecer imediatamente. O Modo Estrito ajuda você a encontrar erros antes de enviá-los para sua equipe e para seus usuários.

[Leia mais sobre como manter os componentes puros.](/learn/keeping-components-pure)

<Note>

Se você tem [React DevTools](/learn/react-developer-tools) instalado, qualquer chamada `console.log` durante a segunda chamada de renderização aparecerá ligeiramente atenuada. O React DevTools também oferece uma configuração (desativada por padrão) para suprimir completamente essas chamadas.

</Note>

---

### Corrigindo erros encontrados ao re-executar Efeitos em desenvolvimento {/*fixing-bugs-found-by-re-running-effects-in-development*/}

O Modo Estrito também pode ajudar a encontrar erros em [Efeitos.](/learn/synchronizing-with-effects)

Todo Efeito tem algum código de configuração e pode ter algum código de limpeza. Normalmente, o React chama a configuração quando o componente *monta* (é adicionado à tela) e chama a limpeza quando o componente *desmonta* (é removido da tela). O React então chama a limpeza e a configuração novamente se suas dependências mudaram desde a última renderização.

Quando o Modo Estrito está ativo, o React também executará **um ciclo extra de configuração+limpeza no desenvolvimento para cada Efeito.** Isso pode parecer surpreendente, mas ajuda a revelar erros sutis que são difíceis de pegar manualmente.

**Aqui está um exemplo para ilustrar como a re-execução de Efeitos no Modo Estrito ajuda você a encontrar erros mais cedo.**

Considere este exemplo que conecta um componente a um chat:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'geral';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
      connections++;
      console.log('Conexões ativas: ' + connections);
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
      connections--;
      console.log('Conexões ativas: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Há um problema com este código, mas pode não ser imediatamente claro.

Para tornar o problema mais óbvio, vamos implementar um recurso. No exemplo abaixo, `roomId` não está codificado. Em vez disso, o usuário pode selecionar o `roomId` que deseja conectar a partir de um dropdown. Clique em "Abrir chat" e então selecione diferentes salas de chat uma a uma. Mantenha controle do número de conexões ativas no console:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Bem-vindo à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('geral');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="musica">musica</option>
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
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
      connections++;
      console.log('Conexões ativas: ' + connections);
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
      connections--;
      console.log('Conexões ativas: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Você notará que o número de conexões abertas sempre continua aumentando. Em um aplicativo real, isso causaria problemas de desempenho e rede. O problema é que [seu Efeito está faltando uma função de limpeza:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Agora que seu Efeito "limpa" após si mesmo e destrói as conexões desatualizadas, o vazamento está resolvido. No entanto, note que o problema não se tornou visível até que você adicionasse mais recursos (a caixa de seleção).

**No exemplo original, o erro não era óbvio. Agora vamos envolver o código original (bugado) em `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'geral';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Bem-vindo à sala {roomId}!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
      connections++;
      console.log('Conexões ativas: ' + connections);
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
      connections--;
      console.log('Conexões ativas: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Com o Modo Estrito, você imediatamente vê que há um problema** (o número de conexões ativas salta para 2). O Modo Estrito executa um ciclo extra de configuração+limpeza para cada Efeito. Esse Efeito não tem lógica de limpeza, então cria uma conexão extra, mas não a destrói. Isso serve como um sinal de que você está perdendo uma função de limpeza.

O Modo Estrito permite que você perceba tais erros cedo no processo. Quando você corrige seu Efeito adicionando uma função de limpeza no Modo Estrito, você *também* corrige muitos possíveis erros futuros de produção, como a caixa de seleção mencionada anteriormente:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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
  const [roomId, setRoomId] = useState('geral');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de chat:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="geral">geral</option>
          <option value="viagem">viagem</option>
          <option value="musica">musica</option>
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
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
      connections++;
      console.log('Conexões ativas: ' + connections);
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
      connections--;
      console.log('Conexões ativas: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe como a contagem de conexões ativas no console não continua crescendo.

Sem o Modo Estrito, era fácil perder que seu Efeito precisava de limpeza. Ao executar *configuração → limpeza → configuração* em vez de apenas *configuração* para seu Efeito no desenvolvimento, o Modo Estrito tornou a lógica de limpeza ausente mais perceptível.

[Leia mais sobre como implementar a limpeza de Efeitos.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Corrigindo avisos de depreciação habilitados pelo Modo Estrito {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

O React avisa se algum componente em algum lugar dentro de uma árvore `<StrictMode>` usa uma dessas APIs obsoletas:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Veja alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* Métodos de ciclo de vida de classe `UNSAFE_`, como [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Veja alternativas.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Contexto legado ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), e [`getChildContext`](/reference/react/Component#getchildcontext)). [Veja alternativas.](/reference/react/createContext)
* Referências de string legado ([`this.refs`](/reference/react/Component#refs)). [Veja alternativas.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

Essas APIs são principalmente usadas em componentes de classe mais antigos, portanto, raramente aparecem em aplicativos modernos.