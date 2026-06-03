---
title: <Activity>
---

<Intro>

`<Activity>` permite ocultar e restaurar a interface do usuário e o estado interno de seus filhos.

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<Activity>` {/*activity*/}

Você pode usar Activity para ocultar parte de sua aplicação:

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Quando um limite de Activity é <CodeStep step={1}>ocultado</CodeStep>, o React ocultará visualmente <CodeStep step={2}>seus filhos</CodeStep> usando a propriedade CSS `display: "none"`. Ele também destruirá seus Efeitos, limpando quaisquer assinaturas ativas.

Enquanto ocultos, os filhos ainda são renderizados em resposta a novas props, embora com uma prioridade menor do que o restante do conteúdo.

Quando o limite se torna <CodeStep step={3}>visível</CodeStep> novamente, o React revelará os filhos com seu estado anterior restaurado e recriará seus Efeitos.

Dessa forma, Activity pode ser pensado como um mecanismo para renderizar "atividade em segundo plano". Em vez de descartar completamente o conteúdo que provavelmente se tornará visível novamente, você pode usar Activity para manter e restaurar a interface do usuário e o estado interno desse conteúdo, garantindo que seu conteúdo oculto não tenha efeitos colaterais indesejados.

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

* `children`: A interface do usuário que você pretende mostrar e ocultar.
* `mode`: Um valor de string `'visible'` ou `'hidden'`. Se omitido, o padrão é `'visible'`.

#### Ressalvas {/*caveats*/}

- Se um Activity for renderizado dentro de uma [ViewTransition](/reference/react/ViewTransition), e se tornar visível como resultado de uma atualização causada por [startTransition](/reference/react/startTransition), ele ativará a animação `enter` da ViewTransition. Se se tornar oculto, ativará sua animação `exit`.
- Um Activity *oculto* que apenas renderiza texto não renderizará nada em vez de renderizar texto oculto, pois não há um elemento DOM correspondente para aplicar alterações de visibilidade. Por exemplo, `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` não produzirá nenhuma saída no DOM para `const ComponentThatJustReturnsText = () => "Hello, World!"`. `<Activity mode="visible"><ComponentThatJustReturnsText /></Activity>` renderizará texto visível.

---

## Uso {/*usage*/}

### Restaurando o estado de componentes ocultos {/*restoring-the-state-of-hidden-components*/}

No React, quando você deseja mostrar ou ocultar um componente condicionalmente, você normalmente o monta ou desmonta com base nessa condição:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

Mas desmontar um componente destrói seu estado interno, o que nem sempre é o que você deseja.

Quando você oculta um componente usando um limite de Activity em vez disso, o React "salvará" seu estado para mais tarde:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Isso torna possível ocultar e, em seguida, restaurar componentes no estado em que estavam anteriormente.

O exemplo a seguir tem uma barra lateral com uma seção expansível. Você pode pressionar "Overview" para revelar os três subitens abaixo dela. A área principal do aplicativo também tem um botão que oculta e mostra a barra lateral.

Tente expandir a seção Overview e, em seguida, alternar a barra lateral para fechada e depois aberta:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

A seção Overview sempre começa recolhida. Como desmontamos a barra lateral quando `isShowingSidebar` muda para `false`, todo o seu estado interno é perdido.

Este é um caso de uso perfeito para Activity. Podemos preservar o estado interno de nossa barra lateral, mesmo ao ocultá-la visualmente.

Vamos substituir a renderização condicional de nossa barra lateral por um limite de Activity:

```jsx {7,9}
// Antes
{isShowingSidebar && (
  <Sidebar />
)}

// Depois
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

e verificar o novo comportamento:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

O estado interno de nossa barra lateral agora é restaurado, sem nenhuma alteração em sua implementação.

---

### Restaurando o DOM de componentes ocultos {/*restoring-the-dom-of-hidden-components*/}

Como os limites de Activity ocultam seus filhos usando `display: none`, o DOM de seus filhos também é preservado quando oculto. Isso os torna ideais para manter o estado efêmero em partes da interface do usuário com as quais o usuário provavelmente interagirá novamente.

Neste exemplo, a aba Contato tem um `<textarea>` onde o usuário pode digitar uma mensagem. Se você digitar algum texto, mudar para a aba Home e depois voltar para a aba Contato, a mensagem rascunhada será perdida:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Isso ocorre porque estamos desmontando completamente `Contact` em `App`. Quando a aba Contato é desmontada, o estado DOM interno do elemento `<textarea>` é perdido.

Se mudarmos para usar um limite de Activity para mostrar e ocultar a aba ativa, podemos preservar o estado DOM de cada aba. Tente digitar texto e alternar as abas novamente, e você verá que a mensagem rascunhada não é mais redefinida:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Novamente, o limite de Activity nos permitiu preservar o estado interno da aba Contato sem alterar sua implementação.

---

### Pré-renderizando conteúdo que provavelmente se tornará visível {/*pre-rendering-content-thats-likely-to-become-visible*/}

Até agora, vimos como Activity pode ocultar algum conteúdo com o qual o usuário interagiu, sem descartar o estado efêmero desse conteúdo.

Mas os limites de Activity também podem ser usados para _preparar_ conteúdo que o usuário ainda não viu pela primeira vez:

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Quando um limite de Activity é <CodeStep step={1}>ocultado</CodeStep> durante sua renderização inicial, seus filhos não serão visíveis na página — mas eles _ainda serão renderizados_, embora com uma prioridade menor do que o conteúdo visível, e sem montar seus Efeitos.

Essa _pré-renderização_ permite que os filhos carreguem qualquer código ou dados de que precisam com antecedência, para que, mais tarde, quando o limite de Activity se tornar visível, os filhos possam aparecer mais rapidamente com tempos de carregamento reduzidos.

Vamos ver um exemplo.

Nesta demonstração, a aba Posts carrega alguns dados. Se você a pressionar, verá um fallback de Suspense exibido enquanto os dados estão sendo buscados:

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Isso ocorre porque `App` não monta `Posts` até que sua aba esteja ativa.

Se atualizarmos `App` para usar um limite de Activity para mostrar e ocultar a aba ativa, `Posts` será pré-renderizado quando o aplicativo for carregado pela primeira vez, permitindo que ele busque seus dados antes de se tornar visível.

Tente clicar na aba Posts agora:

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

`Posts` foi capaz de se preparar para uma renderização mais rápida, graças ao limite de Activity oculto.

---

A pré-renderização de componentes com limites de Activity ocultos é uma maneira poderosa de reduzir os tempos de carregamento para partes da interface do usuário com as quais o usuário provavelmente interagirá em seguida.

<Note>

**Apenas fontes de dados habilitadas para Suspense serão buscadas durante a pré-renderização.** Elas incluem:

- Busca de dados com frameworks habilitados para Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Carregamento preguiçoso de código de componente com [`lazy`](/reference/react/lazy)
- Leitura do valor de uma Promise em cache com [`use`](/reference/react/use)

Activity **não** detecta dados que são buscados dentro de um Effect.

A maneira exata como você buscaria dados no componente `Posts` acima depende do seu framework. Se você usar um framework habilitado para Suspense, encontrará os detalhes em sua documentação de busca de dados.

A busca de dados habilitada para Suspense sem o uso de um framework opinativo ainda não é suportada. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não documentados. Uma API oficial para integrar fontes de dados com Suspense será lançada em uma versão futura do React.

</Note>

---

### Acelerando interações durante o carregamento da página {/*speeding-up-interactions-during-page-load*/}

O React inclui uma otimização de desempenho "por baixo dos panos" chamada Hidratação Seletiva. Ela funciona hidratando o HTML inicial de seu aplicativo _em blocos_, permitindo que alguns componentes se tornem interativos mesmo que outros componentes na página ainda não tenham carregado seu código ou dados.

Os limites de Suspense participam da Hidratação Seletiva, pois naturalmente dividem sua árvore de componentes em unidades que são independentes umas das outras:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

Aqui, `MessageComposer` pode ser totalmente hidratado durante a renderização inicial da página, mesmo antes de `Chats` ser montado e começar a buscar seus dados.

Portanto, ao dividir sua árvore de componentes em unidades discretas, o Suspense permite que o React hidrate o HTML renderizado pelo servidor de seu aplicativo em blocos, permitindo que partes de seu aplicativo se tornem interativas o mais rápido possível.

Mas e as páginas que não usam Suspense?

Veja este exemplo de abas:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

Aqui, o React deve hidratar a página inteira de uma vez. Se `Home` ou `Video` forem mais lentos para renderizar, eles podem fazer com que os botões de aba pareçam não responsivos durante a hidratação.

Adicionar Suspense em torno da aba ativa resolveria isso:

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...mas também mudaria a interface do usuário, já que o fallback `Placeholder` seria exibido na renderização inicial.

Em vez disso, podemos usar Activity. Como os limites de Activity mostram e ocultam seus filhos, eles já dividem naturalmente a árvore de componentes em unidades independentes. E assim como o Suspense, esse recurso permite que eles participem da Hidratação Seletiva.

Vamos atualizar nosso exemplo para usar limites de Activity em torno da aba ativa:

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

Agora, nosso HTML inicial renderizado pelo servidor se parece com a versão original, mas graças ao Activity, o React pode hidratar os botões de aba primeiro, antes mesmo de montar `Home` ou `Video`.

---

Assim, além de ocultar e mostrar conteúdo, os limites de Activity ajudam a melhorar o desempenho de seu aplicativo durante a hidratação, informando ao React quais partes de sua página podem se tornar interativas isoladamente.

E mesmo que sua página nunca oculte parte de seu conteúdo, você ainda pode adicionar limites de Activity sempre visíveis para melhorar o desempenho da hidratação:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

---

## Solução de Problemas {/*troubleshooting*/}

### Meus componentes ocultos têm efeitos colaterais indesejados {/*my-hidden-components-have-unwanted-side-effects*/}

Um limite de `Activity` oculta seu conteúdo definindo `display: none` em seus filhos e limpando quaisquer Efeitos deles. Portanto, a maioria dos componentes React bem comportados que limpam adequadamente seus efeitos colaterais já será robusta para ser ocultada por `Activity`.

Mas existem algumas situações em que um componente oculto se comporta de maneira diferente de um desmontado. Notavelmente, como o DOM de um componente oculto não é destruído, quaisquer efeitos colaterais desse DOM persistirão, mesmo após o componente ser ocultado.

Como exemplo, considere uma tag `<video>`. Normalmente, ela não requer nenhuma limpeza, pois mesmo que você esteja reproduzindo um vídeo, desmontar a tag para a reprodução de vídeo e áudio no navegador. Tente reproduzir o vídeo e depois pressione Home nesta demonstração:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

O vídeo para de tocar como esperado.

Agora, digamos que quiséssemos preservar o timecode em que o usuário assistiu pela última vez, para que, quando ele voltasse para o vídeo, ele não recomeçasse do início novamente.

Este é um ótimo caso de uso para `Activity`!

Vamos atualizar `App` para ocultar a aba inativa com um limite de `Activity` oculto em vez de desmontá-la, e ver como a demonstração se comporta desta vez:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Ops! O vídeo e o áudio continuam tocando mesmo depois de terem sido ocultados, porque o elemento `<video>` da aba ainda está no DOM.

Para corrigir isso, podemos adicionar um Efeito com uma função de limpeza que pausa o vídeo:

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

Chamamos `useLayoutEffect` em vez de `useEffect` porque conceitualmente o código de limpeza está vinculado à ocultação visual da interface do usuário do componente. Se usássemos um efeito regular, o código poderia ser atrasado por (por exemplo) um limite de Suspense de re-suspensão ou uma Transição de Visualização.

Vamos ver o novo comportamento. Tente reproduzir o vídeo, mudar para a aba Home e depois voltar para a aba Vídeo:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Funciona muito bem! Nossa função de limpeza garante que o vídeo pare de tocar se for ocultado por um limite de `Activity`, e ainda melhor, como a tag `<video>` nunca é destruída, o timecode é preservado, e o próprio vídeo não precisa ser inicializado ou baixado novamente quando o usuário volta para continuar assistindo.

Este é um ótimo exemplo de uso de `Activity` para preservar o estado efêmero do DOM para partes da interface do usuário que se tornam ocultas, mas com as quais o usuário provavelmente interagirá novamente em breve.

---

Nosso exemplo ilustra que para certas tags como `<video>`, desmontar e ocultar têm comportamentos diferentes. Se um componente renderiza um DOM que tem um efeito colateral, e você deseja impedir esse efeito colateral quando um limite de `Activity` o oculta, adicione um Efeito com uma função de retorno para limpá-lo.

Os casos mais comuns disso serão das seguintes tags:

  - `<video>`
  - `<audio>`
  - `<iframe>`

Normalmente, porém, a maioria dos seus componentes React já deve ser robusta para ser ocultada por um limite de `Activity`. E conceitualmente, você deve pensar em `Activity` "ocultas" como sendo desmontadas.

Para descobrir proativamente outros Efeitos que não possuem limpeza adequada, o que é importante não apenas para os limites de `Activity`, mas para muitos outros comportamentos no React, recomendamos o uso de [`<StrictMode>`](/reference/react/StrictMode).

---


### Meus componentes ocultos têm Efeitos que não estão sendo executados {/*my-hidden-components-have-effects-that-arent-running*/}

Quando um `<Activity>` é "oculto", todos os Efeitos de seus filhos são limpos. Conceitualmente, os filhos são desmontados, mas o React salva seu estado para mais tarde. Este é um recurso do `Activity`, pois significa que as assinaturas não estarão ativas para partes ocultas da interface do usuário, reduzindo a quantidade de trabalho necessária para o conteúdo oculto.

Se você está contando com a montagem de um Efeito para limpar os efeitos colaterais de um componente, refatore o Efeito para fazer o trabalho na função de limpeza retornada em vez disso.

Para encontrar proativamente Efeitos problemáticos, recomendamos adicionar [`<StrictMode>`](/reference/react/StrictMode), que executará proativamente desmontagens e montagens de `Activity` para capturar quaisquer efeitos colaterais inesperados.