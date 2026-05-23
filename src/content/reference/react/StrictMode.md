---
title: <StrictMode>
---

<Intro>

`<StrictMode>` permite que você encontre erros comuns em seus componentes no início do desenvolvimento.

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

Use `StrictMode` para habilitar comportamentos e avisos de desenvolvimento adicionais para a árvore de componentes dentro:

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

O Strict Mode habilita os seguintes comportamentos apenas para desenvolvimento:

- Seus componentes [irão re-renderizar uma vez a mais](#fixing-bugs-found-by-double-rendering-in-development) para encontrar erros causados por renderização impura.
- Seus componentes [irão re-executar os Effects uma vez a mais](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar erros causados pela falta de limpeza do Effect.
- Seus componentes [irão re-executar os callbacks de refs uma vez a mais](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) para encontrar erros causados pela falta de limpeza da ref.
- Seus componentes [serão verificados quanto ao uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` não aceita nenhuma prop.

#### Ressalvas {/*caveats*/}

* Não há como cancelar o Strict Mode dentro de uma árvore encapsulada em `<StrictMode>`. Isso te dá a confiança de que todos os componentes dentro de `<StrictMode>` são verificados. Se duas equipes trabalhando em um produto discordarem se acham as verificações valiosas, elas precisam chegar a um consenso ou mover `<StrictMode>` para baixo na árvore.

---

## Uso {/*usage*/}

### Habilitando o Strict Mode para todo o aplicativo {/*enabling-strict-mode-for-entire-app*/}

O Strict Mode habilita verificações extras apenas para desenvolvimento para toda a árvore de componentes dentro do componente `<StrictMode>`. Essas verificações ajudam você a encontrar erros comuns em seus componentes no início do processo de desenvolvimento.

Para habilitar o Strict Mode para todo o seu aplicativo, envolva seu componente raiz com `<StrictMode>` quando você o renderizar:

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

Recomendamos envolver todo o seu aplicativo em Strict Mode, especialmente para aplicativos recém-criados. Se você usa um framework que chama o [`createRoot`](/reference/react-dom/client/createRoot) para você, verifique sua documentação para saber como habilitar o Strict Mode.

Embora as verificações do Strict Mode **só sejam executadas no desenvolvimento,** elas ajudam você a encontrar erros que já existem em seu código, mas podem ser difíceis de reproduzir de forma confiável na produção. O Strict Mode permite que você corrija erros antes que seus usuários os relatem.

<Note>

O Strict Mode habilita as seguintes verificações no desenvolvimento:

- Seus componentes [re-renderizarão mais uma vez](#fixing-bugs-found-by-double-rendering-in-development) para encontrar bugs causados por renderização impura.
- Seus componentes [re-executarão os Efeitos mais uma vez](#fixing-bugs-found-by-re-running-effects-in-development) para encontrar bugs causados pela falta de limpeza de Efeitos.
- Seus componentes [re-executarão os retornos de chamada de referência mais uma vez](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) para encontrar bugs causados pela falta de limpeza de referência.
- Seus componentes [serão verificados quanto ao uso de APIs obsoletas.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Todas essas verificações são apenas para desenvolvimento e não afetam a build de produção.**

</Note>

---

### Habilitando o Strict Mode para uma parte do aplicativo {/*enabling-strict-mode-for-a-part-of-the-app*/}

Você também pode habilitar o Strict Mode para qualquer parte do seu aplicativo:

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

Neste exemplo, as verificações do Strict Mode não serão executadas nos componentes `Header` e `Footer`. No entanto, elas serão executadas em `Sidebar` e `Content`, bem como em todos os componentes dentro deles, não importa quão profundos sejam.

<Note>

When `StrictMode` is enabled for a part of the app, React will only enable behaviors that are possible in production. For example, if `<StrictMode>` is not enabled at the root of the app, it will not [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) on initial mount, since this would cause child effects to double fire without the parent effects, which cannot happen in production.

</Note>

---

### Corrigindo erros encontrados pela renderização dupla no desenvolvimento {/*fixing-bugs-found-by-double-rendering-in-development*/}

[o React assume que todo componente que você escreve é uma função pura.](/learn/keeping-components-pure) Isso significa que os componentes React que você escreve devem sempre retornar o mesmo JSX, dados as mesmas entradas (props, state e contexto).

Os componentes que quebram essa regra se comportam de forma imprevisível e causam erros. Para ajudá-lo a encontrar código acidentalmente impuro, o Strict Mode chama algumas de suas funções (apenas as que deveriam ser puras) **duas vezes no desenvolvimento.** Isso inclui:

- O corpo da função do seu componente (somente a lógica de nível superior, portanto, isso não inclui código dentro de manipuladores de eventos)
- Funções que você passa para [`useState`](/reference/react/useState), funções [`set`](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo) ou [`useReducer`](/reference/react/useReducer)
- Alguns métodos de componentes de classe como [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([veja a lista completa](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Se uma função é pura, executá-la duas vezes não altera seu comportamento porque uma função pura produz o mesmo resultado toda vez. No entanto, se uma função for impura (por exemplo, ela muta os dados que recebe), executá-la duas vezes tende a ser perceptível (é isso que a torna impura!) Isso ajuda você a detectar e corrigir o erro no início.

**Aqui está um exemplo para ilustrar como a renderização dupla em Strict Mode ajuda você a encontrar erros no início.**

Este componente `StoryTray` recebe uma array de `stories` e adiciona um último item "Create Story" no final:

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
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
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
  items.push({ id: 'create', label: 'Create Story' });
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

Há um erro no código acima. No entanto, é fácil de perder porque a saída inicial parece correta.

Esse erro se tornará mais perceptível se o componente `StoryTray` re-renderizar várias vezes. Por exemplo, vamos fazer o `StoryTray` re-renderizar com uma cor de fundo diferente sempre que você passar o mouse sobre ele:

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
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
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
  items.push({ id: 'create', label: 'Create Story' });
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

Observe como toda vez que você passa o mouse sobre o componente `StoryTray`, "Create Story" é adicionado à lista novamente. A intenção do código era adicioná-lo uma vez no final. Mas o `StoryTray` modifica diretamente a array `stories` das props. Toda vez que o `StoryTray` renderiza, ele adiciona "Create Story" novamente no final da mesma array. Em outras palavras, `StoryTray` não é uma função pura - executá-la várias vezes produz resultados diferentes.

Para corrigir esse problema, você pode fazer uma cópia da array e modificar essa cópia em vez da original:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Isso [tornaria a função `StoryTray` pura.](/learn/keeping-components-pure) Cada vez que for chamada, ela só modificaria uma nova cópia da array e não afetaria nenhum objeto ou variável externa. Isso resolve o erro, mas você teve que fazer o componente re-renderizar com mais frequência antes que se tornasse óbvio que algo está errado com seu comportamento.

**No exemplo original, o erro não era óbvio. Agora vamos encapsular o código original (com erro) em `<StrictMode>`:**

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
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
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
  items.push({ id: 'create', label: 'Create Story' });
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

**O Strict Mode *sempre* chama sua função de renderização duas vezes, então você pode ver o erro imediatamente** ("Create Story" aparece duas vezes). Isso permite que você perceba esses erros no início do processo. Quando você corrige seu componente para renderizar no Strict Mode, você *também* corrige muitos possíveis erros futuros de produção, como a funcionalidade de hover de antes:

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
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
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
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
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

Sem o Strict Mode, era fácil perder o erro até que você adicionasse mais re-renders. O Strict Mode fez o mesmo erro aparecer imediatamente. O Strict Mode ajuda você a encontrar erros antes de enviá-los para sua equipe e para seus usuários.

[Leia mais sobre como manter os componentes puros.](/learn/keeping-components-pure)

<Note>

Se você tiver [React DevTools](/learn/react-developer-tools) instalado, todas as chamadas `console.log` durante a segunda chamada de renderização aparecerão levemente sombreadas. O React DevTools também oferece uma configuração (desativada por padrão) para suprimi-las completamente.

</Note>

---

### Corrigindo erros encontrados pela re-execução de Effects no desenvolvimento {/*fixing-bugs-found-by-re-running-effects-in-development*/}

O Strict Mode também pode ajudar a encontrar erros em [Effects.](/learn/synchronizing-with-effects)

Cada Effect tem algum código de configuração e pode ter algum código de limpeza. Normalmente, o React chama a configuração quando o componente *monta* (é adicionado à tela) e chama a limpeza quando o componente *desmonta* (é removido da tela). O React então chama a limpeza e a configuração novamente se suas dependências mudaram desde a última renderização.

Quando o Strict Mode está ativado, o React também executará **um ciclo extra de configuração+limpeza no desenvolvimento para cada Effect.** Isso pode parecer surpreendente, mas ajuda a revelar erros sutis que são difíceis de detectar manualmente.

**Aqui está um exemplo para ilustrar como a re-execução de Effects no Strict Mode ajuda você a encontrar erros no início.**

Considere este exemplo que conecta um componente a um bate-papo:

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
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente se conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Há um problema com esse código, mas pode não ser imediatamente claro.

Para tornar o problema mais óbvio, vamos implementar um recurso. No exemplo abaixo, `roomId` não é hardcoded. Em vez disso, o usuário pode selecionar o `roomId` ao qual deseja se conectar em uma lista suspensa. Clique em "Open chat" e selecione diferentes salas de bate-papo uma por uma. Mantenha o controle do número de conexões ativas no console:

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

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
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

  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar bate-papo' : 'Abrir bate-papo'}
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
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Você notará que o número de conexões abertas continua crescendo. Em um aplicativo real, isso causaria problemas de desempenho e de rede. O problema é que [seu Effect está perdendo uma função de limpeza:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Agora que seu Effect "limpa" a si mesmo e destrói as conexões desatualizadas, o vazamento está resolvido. No entanto, observe que o problema não se tornou visível até que você adicionasse mais recursos (a caixa de seleção).

**No exemplo original, o erro não era óbvio. Agora vamos encapsular o código original (com erro) em `<StrictMode>`:**

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
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Com o Strict Mode, você vê imediatamente que há um problema** (o número de conexões ativas salta para 2). O Strict Mode executa um ciclo extra de configuração + limpeza para cada Effect. Este Effect não tem lógica de limpeza, então ele cria uma conexão extra, mas não a destrói. Esta é uma dica de que você está perdendo uma função de limpeza.

O Strict Mode permite que você perceba esses erros no início do processo. Quando você corrige seu Effect adicionando uma função de limpeza no Strict Mode, você *também* corrige muitos possíveis bugs futuros de produção, como a caixa de seleção de antes:

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

  return <h1>Bem-vindo(a) à sala {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar bate-papo' : 'Abrir bate-papo'}
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
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe como a contagem de conexões ativas no console não continua crescendo mais.

Sem o Strict Mode, foi fácil perder que seu Effect precisava de limpeza. Ao executar *configuração → limpeza → configuração* em vez de *configuração* para seu Effect no desenvolvimento, o Strict Mode tornou a lógica de limpeza ausente mais perceptível.

[Leia mais sobre como implementar a limpeza do Effect.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Corrigindo erros encontrados pela reexecução dos callbacks ref em desenvolvimento {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

O Strict Mode também pode ajudar a encontrar erros em [callbacks de ref.](/learn/manipulating-the-dom-with-refs)

Cada `ref` de callback tem algum código de configuração e pode ter algum código de limpeza. Normalmente, o React chama a configuração quando o elemento é *criado* (é adicionado ao DOM) e chama a limpeza quando o elemento é *removido* (é removido do DOM).

Quando o Strict Mode está ativado, o React também executará **um ciclo extra de configuração + limpeza no desenvolvimento para cada `ref` de callback.** Isso pode parecer surpreendente, mas ajuda a revelar erros sutis que são difíceis de detectar manualmente.

Considere este exemplo, que permite que você selecione um animal e, em seguida, role para um deles. Observe que, quando você alterna de "Cats" para "Dogs", os logs do console mostram que o número de animais na lista continua crescendo, e os botões "Scroll to" param de funcionar:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**Este é um erro de produção!** Como o ref callback não remove os animais da lista na limpeza, a lista de animais continua crescendo. Este é um vazamento de memória que pode causar problemas de desempenho em um aplicativo real e quebra o comportamento do aplicativo.

O problema é que o ref callback não faz a limpeza após si mesmo:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Agora vamos encapsular o código original (com erro) em `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**Com o Strict Mode, você vê imediatamente que há um problema**. O Strict Mode executa um ciclo extra de configuração + limpeza para cada ref callback. Este ref callback não tem lógica de limpeza, então ele adiciona refs, mas não as remove. Esta é uma dica de que você está perdendo uma função de limpeza.

O Strict Mode permite que você encontre erros nos refs de callback. Quando você corrige seu callback adicionando uma função de limpeza no Strict Mode, você *também* corrige muitos possíveis bugs de produção futuros, como o bug "Scroll to" de antes:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Agora, na montagem inicial no StrictMode, os refs callbacks são todos configurados, limpos e configurados novamente:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**Isso é esperado.** O Strict Mode confirma que os refs callbacks são limpos corretamente, então o tamanho nunca excede a quantidade esperada. Após a correção, não há vazamentos de memória e todos os recursos funcionam conforme o esperado.

Sem o Strict Mode, foi fácil perder o erro até que você clicou no aplicativo para notar recursos quebrados. O Strict Mode fez com que os erros aparecessem imediatamente, antes de enviá-los para a produção.

---
### Corrigindo avisos de descontinuação ativados pelo Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

O React avisa se algum componente em qualquer lugar dentro de uma árvore `<StrictMode>` usa uma dessas APIs descontinuadas:

* Métodos de ciclo de vida de classe `UNSAFE_` como [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Veja alternativas.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

Essas APIs são usadas principalmente em [componentes de classe](/reference/react/Component) mais antigos, então raramente aparecem em aplicativos modernos.
