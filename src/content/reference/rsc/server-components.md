---
title: Componentes de Servidor do React
canary: true
---

<Intro>

Componentes de Servidor são um novo tipo de Componente que renderiza antecipadamente, antes da empacotamento, em um ambiente separado do seu aplicativo cliente ou servidor SSR.

</Intro>

Esse ambiente separado é o "servidor" nos Componentes de Servidor do React. Os Componentes de Servidor podem ser executados uma vez no tempo de construção em seu servidor CI, ou podem ser executados para cada requisição usando um servidor web.

<InlineToc />

<Note>

#### Como posso construir suporte para Componentes de Servidor? {/*how-do-i-build-support-for-server-components*/}

Embora os Componentes de Servidor no React 19 sejam estáveis e não quebrem entre versões principais, as APIs subjacentes usadas para implementar um empacotador ou framework de Componentes de Servidor do React não seguem semver e podem quebrar entre menores no React 19.x. 

Para suportar os Componentes de Servidor do React como um empacotador ou framework, recomendamos fixar uma versão específica do React ou usar a versão Canary. Continuaremos trabalhando com empacotadores e frameworks para estabilizar as APIs usadas para implementar Componentes de Servidor do React no futuro.

</Note>

### Componentes de Servidor sem um Servidor {/*server-components-without-a-server*/}
Os componentes de servidor podem ser executados no tempo de construção para ler do sistema de arquivos ou buscar conteúdo estático, portanto um servidor web não é necessário. Por exemplo, você pode querer ler dados estáticos de um sistema de gerenciamento de conteúdo.

Sem os Componentes de Servidor, é comum buscar dados estáticos no cliente com um Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: carrega *após* a primeira renderização da página.
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

Esse padrão significa que os usuários precisam baixar e analisar 75K (gzipped) adicionais de bibliotecas e esperar por uma segunda requisição para buscar os dados após a carga da página, apenas para renderizar conteúdo estático que não mudará durante a vida útil da página.

Com os Componentes de Servidor, você pode renderizar esses componentes uma vez no tempo de construção:

```js
import marked from 'marked'; // Não incluído no bundle
import sanitizeHtml from 'sanitize-html'; // Não incluído no bundle

async function Page({page}) {
  // NOTE: carrega *durante* a renderização, quando o aplicativo é construído.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

A saída renderizada pode então ser renderizada no lado do servidor (SSR) para HTML e enviada para um CDN. Quando o aplicativo carrega, o cliente não verá o componente `Page` original, ou as bibliotecas pesadas necessárias para renderizar o markdown. O cliente verá apenas a saída renderizada:

```js
<div><!-- html para markdown --></div>
```

Isso significa que o conteúdo é visível durante o primeiro carregamento da página, e o bundle não inclui as bibliotecas pesadas necessárias para renderizar o conteúdo estático.

<Note>

Você pode notar que o Componente de Servidor acima é uma função assíncrona:

```js
async function Page({page}) {
  //...
}
```

Componentes Assíncronos são um novo recurso dos Componentes de Servidor que permitem que você `await` na renderização.

Veja [Componentes assíncronos com Componentes de Servidor](#async-components-with-server-components) abaixo.

</Note>

### Componentes de Servidor com um Servidor {/*server-components-with-a-server*/}
Os Componentes de Servidor também podem ser executados em um servidor web durante uma requisição por uma página, permitindo que você acesse sua camada de dados sem ter que construir uma API. Eles são renderizados antes que sua aplicação seja empacotada e podem passar dados e JSX como props para Componentes Cliente.

Sem os Componentes de Servidor, é comum buscar dados dinâmicos no cliente em um Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: carrega *após* a primeira renderização.
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
  // NOTE: carrega *após* a renderização do Note.
  // Causando uma cascata pesada entre cliente e servidor.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>Por: {author.name}</span>;
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

Com os Componentes de Servidor, você pode ler os dados e renderizá-los no componente:

```js
import db from './database';

async function Note({id}) {
  // NOTE: carrega *durante* a renderização.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: carrega *após* o Note,
  // mas é rápido se os dados estiverem co-localizados.
  const author = await db.authors.get(id);
  return <span>Por: {author.name}</span>;
}
```

O empacotador então combina os dados, Componentes de Servidor renderizados e Componentes Cliente dinâmicos em um bundle. Opcionalmente, esse bundle pode ser renderizado no lado do servidor (SSR) para criar o HTML inicial para a página. Quando a página carrega, o navegador não vê os componentes `Note` e `Author` originais; apenas a saída renderizada é enviada ao cliente:

```js
<div>
  <span>Por: A Equipe do React</span>
  <p>O React 19 Beta é...</p>
</div>
```

Os Componentes de Servidor podem ser tornados dinâmicos ao serem re-buscados de um servidor, onde podem acessar os dados e renderizar novamente. Essa nova arquitetura de aplicação combina o simples modelo mental de "requisição/resposta" de Aplicativos Multiplos de Páginas centrados em servidor com a interatividade contínua de Aplicativos de Página Única centrados em cliente, oferecendo o melhor dos dois mundos.

### Adicionando interatividade aos Componentes de Servidor {/*adding-interactivity-to-server-components*/}

Os Componentes de Servidor não são enviados para o navegador, então eles não podem usar APIs interativas como `useState`. Para adicionar interatividade aos Componentes de Servidor, você pode compô-los com um Componente Cliente usando a diretiva `"use client"`.

<Note>

#### Não há diretiva para Componentes de Servidor. {/*there-is-no-directive-for-server-components*/}

Um mal-entendido comum é que os Componentes de Servidor são denotados por `"use server"`, mas não há diretiva para Componentes de Servidor. A diretiva `"use server"` é usada para Ações do Servidor.

Para mais informações, veja os documentos sobre [Diretivas](/reference/rsc/directives).

</Note>

No exemplo seguinte, o Componente de Servidor `Notes` importa um Componente Cliente `Expandable` que usa estado para alternar seu estado `expanded`:
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

Isso funciona renderizando primeiro `Notes` como um Componente de Servidor e, em seguida, instruindo o empacotador a criar um bundle para o Componente Cliente `Expandable`. No navegador, os Componentes Clientes verão a saída dos Componentes de Servidor passados como props:

```js
<head>
  <!-- o bundle para Componentes Clientes -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>este é o primeiro note</p>
    </Expandable>
    <Expandable key={2}>
      <p>este é o segundo note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Componentes assíncronos com Componentes de Servidor {/*async-components-with-server-components*/}

Os Componentes de Servidor introduzem uma nova maneira de escrever Componentes usando async/await. Quando você `await` em um componente assíncrono, o React suspende e aguarda que a promessa seja resolvida antes de retomar a renderização. Isso funciona por meio de fronteiras entre servidor/cliente com suporte a streaming para Suspense.

Você pode até criar uma promessa no servidor e aguardá-la no cliente:

```js
// Componente de Servidor
import db from './database';

async function Page({id}) {
  // Suspenderá o Componente de Servidor.
  const note = await db.notes.get(id);
  
  // NOTE: não aguardado, começará aqui e aguardará no cliente. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Carregando comentários...</p>}>
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
  // NOTE: isso retomará a promessa do servidor.
  // Suspenderá até que os dados estejam disponíveis.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

O conteúdo do `note` é um dado importante para a renderização da página, então nós `await` ele no servidor. Os comentários estão abaixo da dobra e são de prioridade inferior, então começamos a promessa no servidor e aguardamos no cliente com a API `use`. Isso suspenderá no cliente, sem bloquear o conteúdo `note` de ser renderizado.

Uma vez que componentes assíncronos não são [suportados no cliente](#why-cant-i-use-async-components-on-the-client), aguardamos a promessa com `use`.