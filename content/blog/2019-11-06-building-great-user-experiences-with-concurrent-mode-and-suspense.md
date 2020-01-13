---
title: "Construindo Ótimas Experiências de Usuário com Modo Concorrente e Suspense"
author: [josephsavona]
---

Na React Conf 2019 nós anunciamos uma [versão experimental](/docs/concurrent-mode-adoption.html#installation) do React que acrescenta suporte ao Modo Concorrente e Suspense. Nesse artigo nós vamos introduzir as melhores práticas para seu uso que nós identificamos durante o processo de construção [do novo facebook.com](https://twitter.com/facebook/status/1123322299418124289).

> Esse artigo será mais relevante para pessoas que trabalham com as _bibliotecas de obtenção de dados (data fetching)_ para React. 
>
> Mostramos como integrar melhor elas com o Modo Concorrente e o Suspense. Os padrão introduzidos aqui são baseados no [Relay](https://relay.dev/docs/en/experimental/step-by-step) -- nossa biblioteca para construir interfaces de usuário orientadas a dados com GraphQL. De qualquer forma, as ideias desse artigo **se aplicam a outros clientes GraphQL também assim como bibliotecas que usam REST** ou outras abordagens.

Esse artigo é **dedicado aos autores de bibliotecas**. Se você for principalmente desenvolvedor de aplicações, você ainda pode encontrar ideias interessantes aqui, mas não se sinta obrigado a lê-lo inteiramente.

## Vídeos de Talks {#talk-videos}

Se você preferir assistir vídeos, algumas das ideias desse artigo se referema diversas apresentações da React Conf 2019:

* [Obtenção de Dados com Suspense no Relay](https://www.youtube.com/watch?v=Tl0S7QkxFE4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=15&t=0s) por [Joe Savona](https://twitter.com/en_JS)
* [Contruindo o Novo Facebook com React e Relay](https://www.youtube.com/watch?v=KT3XKDBZW7M&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=4) por [Ashley Watkins](https://twitter.com/catchingash)
* [React Conf Keynote](https://www.youtube.com/watch?v=uXEEL9mrkAQ&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=2) por [Yuzhi Zheng](https://twitter.com/yuzhiz)

Esse artigo apresenta um mergulho na implentação de uma biblioteca de obtenção de dados com Suspense.

## Colocando a Experiência de Usuário como Prioridade {#putting-user-experience-first}

A equipe do React e a comunidade tem constantemente enfatizado a experiência do desenvolvedor: garantindo que o React tenha boas mensagens de erro, focando em componentes como uma maneira de pensar localmente no comportamento do aplicativo, desenvolvimento APIs que são previsíveis e encorajando o correto uso via design, etc. Mas nós não temos difundido as melhores práticas para garantir uma ótima experiência de *usuário* em grandes aplicações.

Por exemplo, a equipe do React tem focado na performance da *biblioteca* e provendo ferramentas para desenvolvedores debugarem e refinarem a performance da aplicação (ex. `React.memo`). Mas nós não temos opinado sobre *padrões de alto nível* que fazem a diferença entre aplicativos rápidos e fluídos e aplicativos lentos e travados. Nós sempre queremos garantir que o React se mantenha abordável para novos usuários e suportar uma variedade de casos uso -- nem todo aplicativo tem que ser "super" rápidos. Mas como uma comunidade nós podemos e devemos sonhar alto. **Nós devemos fazer ser tão fácil quanto possível construir aplicativos que iniciam rápido e continuam rápidos,** mesmo quando eles crescem em complexidade, para vários usuários em diversos dispositivos e redes ao no mundo todo. 

[Modo Concorrente](/docs/concurrent-mode-intro.html) e [Suspense](/docs/concurrent-mode-suspense.html) são funcionalidades experimentais que podem ajudar os desenvolvedores a alcançarem esse objetivo. Nós inicialmente apresentamos eles na [JSConf Iceland em 2018](/blog/2018/03/01/sneak-peek-beyond-react-16.html), intencionalmente compartilhando detalhes muito antecipadamente para dar a comunidade tempo para digerir os novos conceitos e para se prepararem para as alterações subsequentes. Desde então nós completamos trabalhos correlacionados, como a nova API Conext e a introdução do Hooks, que foram desenhados em parte para ajudar os desenvolvedores a escreverem código que seja naturalmente mais compatível com o Modo Concorrente. Mas nós não queremos implementar essas funcionalidades e liberá-las sem garantir que funcionam. Então ao longo do ano passado, as equipes do React, Relay, infraestrutura web, e produto do Facebook têm todas colaborado intimamente para construir uma nova versão do facebook.com que integre profundamente o Modo Concorrente e o Suspense para criar uma experiência com uma sensação mais fluída e similar a de aplicativo. 

Graças a esse projeto, nós estamos mais confiantes do que nunca de que o Modo Concorrente e o Suspense podem tornar mais fácil entregar uma experiência de usuário ótima e rápida. Mas fazer isso requer repensar como nós abordamos o carregamento do código e dos dados em nossas aplicações. Efetivamente toda a obtenção de dados no novo facebook.com é realizada pelo [Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) -- novas APIs do Relay baseadas em Hooks que integram com o Modo Concorrente e o Suspense sem configurações adicionais.

Relay Hooks -- e GraphQL -- não são para todos, e tudo bem com isso! Através do nosso trabalho nessas APIs nós identificamos um conjunto de padrões em geral para usar Suspense. **Mesmo que o Relay não seja o fit correto para você, nós acreditamos que os padrões chave que nós introduzimos com o Relay Hooks podem ser adaptados para outras bibliotecas**

## Melhores Práticas com Suspense {#best-practices-for-suspense}

É tentador focar apenas no tempo total de inicialização de um aplicativo -- mas ocorre que a percepção de performance pelo usuário é determinada por mais do que o tempo absoluto de carregamento. Por exemplo, quando comparados dois aplicativos com o mesmo tempo absoluto de inicialização, nossa pesquisa mostra que os usuários geralmente irão perceber aquele que tiver menos estados de carregamento intermediários e menos alterações de layout como o que carrega mais rápido. Suspense é uma ferramenta poderosa por orquestrar cuidadosamente uma sequência de carregamento com poucos, bem definidos, estados que revelam progressivamente o conteúdo. Mas melhorar a performance percebida vai além disso -- nossos aplicativos não deveriam demorar uma eternidade para carregar todo o código, dados, imagens, e outros artefatos.

A abordagem tradicional para carregar dados nos aplicativos React involvem o que nos referimos como ["renderização-conforme-você-busca"](/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense). Primeiro nós renderizamos um componente com um spinner, então carregamos dados na montagem (`componentDidMount` or `useEffect`), e finalmente atualizamos para renderizar os dados resultantes. É certamente *possível* usar esse padrão com Suspense: ao invés de inicialmente renderizar um placeholder por si mesmo, um componente pode "suspender" -- indicar ao React que ele não está pronto ainda. Isso irá dizer ao React para buscar o ancestral mais próximo `<Suspense fallback={<Placeholder/>}>`, e renderizar o seu fallback no lugar. Se você viu os demonstrativos do Suspense anteriormente este exemplo pode parecer familiar -- é como nós originalmente imaginamos usar o Suspense para carregamento de dados.

Ocorre que esta abordagem tem algumas limitações. Considere uma página que mostra uma postagem de mídia social feita por um usuário, com comentários nessa postagem. Ela pode ser estruturada como um componente `<Post>` que renderiza tanto o corpo da postagem como a `<CommentList>` para mostrar os comentários. Usando a abordagem de renderização-conforme-você-busca descrita acima para implementar isso pode causar  idas e voltas sequenciais (muitas vezes conhecido como uma "cachoeira"). Primeiro os dados para o componente `<Post>` seriam carregados e então os dados para a `<CommentList>`, aumentando o tempo que para mostrar a página completamente.

Há também outra There's also another desvantagem muitas vezes esquecida nessa abordagem. Se o `<Post>` requisita (ou importa) o componente `<CommentList>` de maneira completa, nosso aplicativo terá de esperar para mostrar o *corpo* da postagem enquanto o código para os *commentários* é baixado. Nós poderáimos carregar a `<CommentList>` de maneira preguiçosa, mas dessa forma nós iríamos atrasar o carregamento dos dados dos comentários e aumentar o tempo para exibir a página inteira. Como nós resolvemos esse problema sem comprometer a experiência do usuário?

## Renderização Conforme Você Busca {#render-as-you-fetch}

A abordagem de renderização-conforme-você-busca é amplamente utilizada pelos aplicativos React atualmente e pode certamente ser usada para criar ótimos aplicativos. Mas nós conseguiríamos fazer ainda melhor? Vamos voltar um passo atrás e considerar nosso objetivo.

No exemplo acima do `<Post>`, nós idealmente deveríamos mostrar o conteudo mais importante -- o corpo da postagem -- o mais rápido possível, *sem* impactar negativamente o tempo para mostrar a página completamente (incluindo comentários). Vamos considerar as restrições em qualquer solução e observar como nós podemos atendê-las:

* Mostrar o conteúdo mais importante (o corpo da postagem) o mais rápido possíve significa que nós precisamos carregar o código e os dados para a visualização de forma incremental. Nós *não queremos bloquear a visualização do corpo da postagem* para que a `<CommentList>` seja baixada, por exemplo.
* Ao mesmo tempo nós não queremos aumentar o tempo para exibição da página completa incluindo comentários. Então nós precisamos *começar a carregar o código e os dados para os comentários* o mais rápido possível, idealmente *em paralelo* com o carregamento do corpo da postagem.

Isso pode soar difícil de alcançar -- mas essas restrições são na verdade incrivelmente helpful. Elas descartam uma série de abordagens e nos desenham um rascunho da solução. Isso nós leva os padrões chave que nós implementamos no in Relay Hooks, e que podem ser adaptados para outras biblotecas de obtenção de dados. Veremos cada um de maneira a nos mostrar como podem nos ajudar a alcançar nosso objetivo de experiências de carregamento rápidas e encatadoras:

1. Dados paralelos e árvores de visualização
2. Carregar em manipuladores de evento
3. Carregar dados incrementalmente
4. Tratar código como dado

### Parallel Data and View Trees {#parallel-data-and-view-trees}

One of the most appealing things about the fetch-on-render pattern is that it colocates *what* data a component needs with *how* to render that data. This colocation is great -- an example of how it makes sense to group code by concerns and not by technologies. All the issues we saw above were due to *when* we fetch data in this approach: upon rendering. We need to be able to fetch data *before* we've rendered the component. The only way to achieve that is by extracting the data dependencies into parallel data and view trees. 

Here's how that works in Relay Hooks. Continuing our example of a social media post with body and comments, here's how we might define it with Relay Hooks:

```javascript
// Post.js
function Post(props) {
  // Given a reference to some post - `props.post` - *what* data
  // do we need about that post?
  const postData = useFragment(graphql`
    fragment PostData on Post @refetchable(queryName: "PostQuery") {
      author
      title
      # ...  more fields ...
    }
  `, props.post);

  // Now that we have the data, how do we render it?
  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* more fields  */}
    </div>
  );
}
```

Although the GraphQL is written within the component, Relay has a build step (Relay Compiler) that extracts these data-dependencies into separate files and aggregates the GraphQL for each view into a single query. So we get the benefit of colocating concerns, while at runtime having parallel data and view trees. Other frameworks could achieve a similar effect by allowing developers to define data-fetching logic in a sibling file (maybe `Post.data.js`), or perhaps integrate with a bundler to allow defining data dependencies with UI code and automatically extracting it, similar to Relay Compiler.

The key is that regardless of the technology we're using to load our data -- GraphQL, REST, etc -- we can separate *what* data to load from how and when to actually load it. But once we do that, how and when *do* we fetch our data?

### Fetch in Event Handlers {#fetch-in-event-handlers}

Imagine that we're about to navigate from a list of a user's posts to the page for a specific post. We'll need to download the code for that page -- `Post.js` -- and also fetch its data.

Waiting until we render the component has problems as we saw above. The key is to start fetching code and data for a new view *in the same event handler that triggers showing that view*. We can either fetch the data within our router -- if our router supports preloading data for routes -- or in the click event on the link that triggered the navigation. It turns out that the React Router folks are already hard at work on building APIs to support preloading data for routes. But other routing frameworks can implement this idea too. 

Conceptually, we want every route definition to include two things: what component to render and what data to preload, as a function of the route/url params. Here's what such a route definition *might* look like. This example is loosely inspired by React Router's route definitions and is *primarily intended to demonstrate the concept, not a specific API*:

```javascript
// PostRoute.js (GraphQL version)

// Relay generated query for loading Post data
import PostQuery from './__generated__/PostQuery.graphql';

const PostRoute = {
  // a matching expression for which paths to handle
  path: '/post/:id',

  // what component to render for this route
  component: React.lazy(() => import('./Post')),

  // data to load for this route, as function of the route
  // parameters
  prepare: routeParams => {
    // Relay extracts queries from components, allowing us to reference
    // the data dependencies -- data tree -- from outside.
    const postData = preloadQuery(PostQuery, {
      postId: routeParams.id,
    });

    return { postData };
  },
};

export default PostRoute;
```

Given such a definition, a router can:

* Match a URL to a route definition.
* Call the `prepare()` function to start loading that route's data. Note that `prepare()` is synchronous -- *we don't wait for the data to be ready*, since we want to start rendering more important parts of the view (like the post body) as quickly as possible.
* Pass the preloaded data to the component. If the component is ready -- the `React.lazy` dynamic import has completed -- the component will render and try to access its data. If not, `React.lazy` will suspend until the code is ready.

This approach can be generalized to other data-fetching solutions. An app that uses REST might define a route like this:

```javascript
// PostRoute.js (REST version)

// Manually written logic for loading the data for the component
import PostData from './Post.data';

const PostRoute = {
  // a matching expression for which paths to handle
  path: '/post/:id',

  // what component to render for this route
  component: React.lazy(() => import('./Post')),

  // data to load for this route, as function of the route
  // parameters
  prepare: routeParams => {
    const postData = preloadRestEndpoint(
      PostData.endpointUrl, 
      {
        postId: routeParams.id,
      },
    );
    return { postData };
  },
};

export default PostRoute;
```

This same approach can be employed not just for routing, but in other places where we show content lazily or based on user interaction. For example, a tab component could eagerly load the first tab's code and data, and then use the same pattern as above to load the code and data for other tabs in the tab-change event handler. A component that displays a modal could preload the code and data for the modal in the click handler that triggers opening the modal, and so on. 

Once we've implemented the ability to start loading code and data for a view independently, we have the option to go one step further. Consider a `<Link to={path} />` component that links to a route. If the user hovers over that link, there's a reasonable chance they'll click it. And if they press the mouse down, there's an even better chance that they'll complete the click. If we can load code and data for a view *after* the user clicks, we can also start that work *before* they click, getting a head start on preparing the view.

Best of all, we can centralize that logic in a few key places -- a router or core UI components -- and get any performance benefits automatically throughout our app. Of course preloading isn't always beneficial. It's something an application would tune based on the user's device or network speed to avoid eating up user's data plans. But the pattern here makes it easier to centralize the implementation of preloading and the decision of whether to enable it or not.

### Load Data Incrementally {#load-data-incrementally}

The above patterns -- parallel data/view trees and fetching in event handlers -- let us start loading all the data for a view earlier. But we still want to be able to show more important parts of the view without waiting for *all* of our data. At Facebook we've implemented support for this in GraphQL and Relay in the form of some new GraphQL directives (annotations that affect how/when data is delivered, but not what data). These new directives, called `@defer` and `@stream`, allow us to retrieve data incrementally. For example, consider our `<Post>` component from above. We want to show the body without waiting for the comments to be ready. We can achieve this with `@defer` and `<Suspense>`:

```javascript
// Post.js
function Post(props) {
  const postData = useFragment(graphql`
    fragment PostData on Post {
      author
      title

      # fetch data for the comments, but don't block on it being ready
      ...CommentList @defer
    }
  `, props.post);

  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* @defer pairs naturally with <Suspense> to make the UI non-blocking too */}
      <Suspense fallback={<Spinner/>}>
        <CommentList post={postData} />
      </Suspense>
    </div>
  );
}
```

Here, our GraphQL server will stream back the results, first returning the `author` and `title` fields and then returning the comment data when it's ready. We wrap `<CommentList>` in a `<Suspense>` boundary so that we can render the post body before `<CommentList>` and its data are ready. This same pattern can be applied to other frameworks as well. For example, apps that call a REST API might make parallel requests to fetch the body and comments data for a post to avoid blocking on all the data being ready.

### Treat Code Like Data {#treat-code-like-data}

But there's one thing that's still missing. We've shown how to preload *data* for a route -- but what about code? The example above cheated a bit and used `React.lazy`. However, `React.lazy` is, as the name implies, *lazy*. It won't start downloading code until the lazy component is actually rendered -- it's "fetch-on-render" for code!

To solve this, the React team is considering APIs that would allow bundle splitting and eager preloading for code as well. That would allow a user to pass some form of lazy component to a router, and for the router to trigger loading the code alongside its data as early as possible.

## Putting It All Together {#putting-it-all-together}

To recap, achieving a great loading experience means that we need to **start loading code and data as early as possible, but without waiting for all of it to be ready**. Parallel data and view trees allow us to load the data for a view in parallel with loading the view (code) itself. Fetching in an event handler means we can start loading data as early as possible, and even optimistically preload a view when we have enough confidence that a user will navigate to it. Loading data incrementally allows us to load important data earlier without delaying the fetching of less important data. And treating code as data -- and preloading it with similar APIs -- allows us to load it earlier too.

## Using These Patterns {#using-these-patterns}

These patterns aren't just ideas -- we've implemented them in Relay Hooks and are using them in production throughout the new facebook.com (which is currently in beta testing). If you're interested in using or learning more about these patterns, here are some resources:

* The [React Concurrent docs](/docs/concurrent-mode-intro.html) explore how to use Concurrent Mode and Suspense and go into more detail about many of these patterns. It's a great resource to learn more about the APIs and use-cases they support.
* The [experimental release of Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) implements the patterns described here. 
* We've implemented two similar example apps that demonstrate these concepts:
  * The [Relay Hooks example app](https://github.com/relayjs/relay-examples/tree/master/issue-tracker) uses GitHub's public GraphQL API to implement a simple issue tracker app. It includes nested route support with code and data preloading. The code is fully commented -- we encourage cloning the repo, running the app locally, and exploring how it works.
  * We also have a [non-GraphQL version of the app](https://github.com/gaearon/suspense-experimental-github-demo) that demonstrates how these concepts can be applied to other data-fetching libraries.

While the APIs around Concurrent Mode and Suspense are [still experimental](/docs/concurrent-mode-adoption.html#who-is-this-experimental-release-for), we're confident that the ideas in this post are proven by practice. However, we understand that Relay and GraphQL aren't the right fit for everyone. That's ok! **We're actively exploring how to generalize these patterns to approaches such as REST,** and are exploring ideas for a more generic (ie non-GraphQL) API for composing a tree of data dependencies. In the meantime, we're excited to see what new libraries will emerge that implement the patterns described in this post to make it easier to build great, *fast* user experiences.

