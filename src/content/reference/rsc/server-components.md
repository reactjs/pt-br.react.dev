---
title: Componentes de Servidor
---

<<<<<<< HEAD
<RSC>

Componentes de Servidor são para uso em [Componentes do Servidor React](/learn/start-a-new-react-project#full-stack-frameworks).

</RSC>

=======
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72
<Intro>

Componentes de Servidor são um novo tipo de Componente que renderiza com antecedência, antes do bundling, em um ambiente separado do seu aplicativo cliente ou servidor SSR.

</Intro>

Este ambiente separado é o "servidor" em Componentes de Servidor React. Componentes de Servidor podem rodar uma vez no tempo de build em seu servidor CI, ou eles podem ser executados para cada requisição usando um servidor web.

<InlineToc />

<Note>

#### Como eu construo suporte para Componentes de Servidor? {/*how-do-i-build-support-for-server-components*/}

Enquanto Componentes do Servidor React no React 19 são estáveis e não quebrarão entre versões menores, as APIs subjacentes utilizadas para implementar um bundler ou framework de Componentes do Servidor React não seguem semver e podem quebrar entre versões menores no React 19.x.

Para dar suporte a Componentes de Servidor React como um bundler ou framework, nós recomendamos fixar em uma versão especifica do React, ou utilizar a versão Canary. Nós continuaremos trabalhando com bundlers e frameworks para estabilizar as APIs utilizadas para implementar Componentes de Servidor React no futuro.

</Note>

### Componentes de Servidor sem um Servidor {/*server-components-without-a-server*/}
Componentes de Servidor podem executar em tempo de build para ler do sistema de arquivos ou buscar conteúdo estático, então um servidor web não é necessário. Por exemplo, você pode querer ler dados estáticos de um sistema de gerenciamento de conteúdo.

Sem Componentes de Servidor, é comum buscar dados estáticos no cliente com um Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Este padrão significa que os usuários precisam baixar e analisar 75KB (gzipped) de bibliotecas adicionais, e esperar por uma segunda requisição para buscar os dados após a página carregar, apenas para renderizar conteúdo estático que não irá mudar durante o tempo de vida da página.

Com Componentes de Servidor, você pode renderizar esses componentes uma vez em tempo de build:

```js
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

A saída renderizada pode então ser renderizada no lado do servidor (SSR) para HTML e carregada em uma CDN. Quando o app carrega, o cliente não verá o componente `Page` original, ou as bibliotecas caras para renderizar o markdown. O cliente irá apenas ver a saída renderizada:

```js
<div><!-- html for markdown --></div>
```

Isso significa que o conteúdo é visível durante o primeiro carregamento da página, e o bundle não inclui as bibliotecas custosas necessárias para renderizar o conteúdo estático.

<Note>

Você pode notar que o Componente de Servidor acima é uma função assíncrona:

```js
async function Page({page}) {
  //...
}
```

Componentes Assíncronos são uma nova funcionalidade dos Componentes de Servidor que permitem que você use `await` no render.

Veja [Componentes assíncronos com Componentes de Servidor](#async-components-with-server-components) abaixo.

</Note>

### Componentes de Servidor com um Servidor {/*server-components-with-a-server*/}
Componentes de Servidor podem também executar em um servidor web durante uma requisição para uma página, permitindo que você acesse sua camada de dados sem ter que construir uma API. Eles são renderizados antes que sua aplicação seja empacotada e podem passar dados e JSX como props para Componentes Cliente.

Sem Componentes de Servidor, é comum buscar dados dinâmicos no cliente em um Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Com Componentes de Servidor, você pode ler os dados e renderizá-los no componente:

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

O bundler então combina os dados, Componentes de Servidor renderizados e Componentes Cliente dinâmicos em um bundle. Opcionalmente, esse bundle pode então ser renderizado no lado do servidor (SSR) para criar o HTML inicial para a página. Quando a página carrega, o navegador não vê os componentes `Note` e `Author` originais; apenas a saída renderizada é enviada para o cliente:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Componentes de Servidor podem ser feitos dinâmicos re-buscando-os de um servidor, onde eles podem acessar os dados e renderizar novamente. Essa nova arquitetura de aplicação combina o modelo mental simples de “requisição/resposta” de Apps Multi-Página server-centric com a interatividade contínua de Apps Single-Page client-centric, dando a você o melhor dos dois mundos.

### Adicionando interatividade aos Componentes de Servidor {/*adding-interactivity-to-server-components*/}

Componentes de Servidor não são enviados para o navegador, então eles não podem usar APIs interativas como `useState`. Para adicionar interatividade aos Componentes de Servidor, você pode compô-los com Componentes Cliente usando a diretiva `"use client"`.

<Note>

#### Não existe diretiva para Componentes de Servidor. {/*there-is-no-directive-for-server-components*/}

Um mal-entendido comum é que Componentes de Servidor são denotados por `"use server"`, mas não existe diretiva para Componentes de Servidor. A diretiva `"use server"` é usada para Funções de Servidor.

Para mais informações, veja a documentação para [Diretivas](/reference/rsc/directives).

</Note>

No exemplo a seguir, o Componente de Servidor `Notes` importa um Componente Cliente `Expandable` que usa state para alternar seu estado `expanded`:
```js
// Componente de Servidor
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Componente Cliente
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Alternar
      </button>
      {expanded && children}
    </div>
  )
}
```

Isso funciona renderizando primeiro `Notes` como um Componente de Servidor, e então instruindo o bundler a criar um bundle para o Componente Cliente `Expandable`. No navegador, os Componentes Cliente verão a saída dos Componentes de Servidor passados como props:

```js
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Componentes assíncronos com Componentes de Servidor {/*async-components-with-server-components*/}

Componentes de Servidor introduzem uma nova forma de escrever Componentes usando async/await. Quando você `await` em um componente assíncrono, React irá suspender e esperar pela promise ser resolvida antes de retomar a renderização. Isso funciona através de limites de servidor/cliente com suporte a streaming para Suspense.

Você pode até mesmo criar uma promise no servidor, e esperar por ela no cliente:

```js
// Componente de Servidor
import db from './database';

async function Page({id}) {
  // Irá suspender o Componente de Servidor.
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Componente Cliente
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

O conteúdo de `note` é dados importantes para a página renderizar, então nós fazemos `await` nele no servidor. Os comentários estão abaixo da dobra e de baixa prioridade, então nós iniciamos a promise no servidor, e esperamos por ela no cliente com a API `use`. Isso irá Suspender no cliente, sem bloquear o conteúdo de `note` de renderizar.

Como componentes assíncronos não são suportados no cliente, aguardamos a promessa com `use`.
