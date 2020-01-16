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

### Dados em Paralelo e Árvores de Visualização {#parallel-data-and-view-trees}

Uma das coisas mais atraentes no padrão de renderização-conforme-você-busca é que ele combina *quais* dados o componente precisa com *como* renderizar esses dados. Essa combinação é ótima -- um exemplo de como faz sentido agrupar código por responsabilidades e não por tecnologias. Todos os problemas que nós vimos acima foram sobre *quando* nós obtemos os dados nessa abordagem: após a renderização. Nós precisamos precisamos ser capazes de obter dados *antes* de renderizar o componente. The only way to achieve that is by extracting the data dependencies into parallel data and view trees. 

Aqui mostramos como isso funciona no Relay Hooks. Continuando nosso exemplo de uma postagem de mídia social com corpo e comentários, aqui está como definimos isso no Relay Hooks:

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

Embora o GraphQL esteja escrito junto ao componente, Relay tem um passo de build (Compilador do Relay) que extrai essas dependências-de-dados em arquivos separados e agrega o GraphQL para cada visualização em uma única consulta. Então nós obtemos os benefícios de combinar responsabilidades, enquanto no tempo de execução temos dados paralelos e árvores de visualização. Outras bibliotecas poderiam alcançar resultados similares ao permitir que os desenvolvedores definam lógica de obtenção de dados em um arquivo irmão (talvez `Post.data.js`), ou então integrar com um bundler para permitir definição de dependência de dados com código de interface de usuário e automaticamente extraí-lo, de maneira semelhante ao Compilador do Relay.

O segredo é que independente da tecnologia que estamos usando para carregar nossos dados -- GraphQL, REST, etc -- nós podemos separar *quais* dados carregar de como e quando fazê-lo. Mas uma vez feito isso, como e quando nós *carregamos* nossos dados?

### Obtenção em Manipuladores de Evento {#fetch-in-event-handlers}

Imagine que nós estamos para navegar da listagem de postagens de um usuário para a página de uma postagem específica. Nós vamos precisar baixar o código para aquela página -- `Post.js` -- e também obter seus dados.

Aguardar até que a gente renderize os dados gera os problemas que nós vimos acima. O segredo é começar a obter o código e os dados para a nova visualização *no mesmo manipulador de evento que dispara a visualização*. Nós ainda podemos obter os dados com nosso roteador -- se nosso roteador suporta pré-carregamento de dados para as rotas -- ou no evento de clique no link que disparou a navegação. Vale lembrar que os colegas do React Router já trabalharam arduamente para construir APIs para suportarem pré-carregamento de dados para rotas. Mas outras bibliotecas de roteamento podem implementar essa ideia também.

Conceitualmente, nós queremos que a definição de cada rota inclua duas coisas: qual componente renderizar e que dados pré-carregar, como uma função de rota/parâmetros de url. Aqui está o que esta definição de rota *pode* parecer. Este exemplo é um pouco inspirado pelas definições de rota do React Router e *principalmente se dedica a demonstrar o conceito, não uma API específica*:

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

Por definição, um roteador pode:

* Associar uma URL a uma definição de rota.
* Chamar a função `prepare()` para iniciar o carregamento dos dados da rota. Note que `prepare()` é síncrona -- *nós não queremos esperar pelos dados*, dado que nós queremos começar a renderizar as partes mais importantes da visualização (como o corpo da postagem) o mais rápido que possível.
* Passar os dados pré-carregados para o componente. Se o componente estiver pronto -- a importação dinâmica do `React.lazy` terminou -- o componente irá renderizar e tentar acessar os seus dados. Do contrário, o `React.lazy` irá suspender até que o código esteja pronto.

Esta abordagem pode ser generalizada para outras soluções de obtenção de dados. Um aplicativo que usa REST poderia definir uma rota dessa forma:

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

Esta mesma abordagem pode ser empregada não apenas para roteamento, mas em outros lugares onde nós queiramos mostrar conteúdo de maneira preguiçosa ou baseada na interação do usuário. Por exemplo, um componente de aba poderia carregar completamente os dados e o código para a primeira aba, e então usar o mesmo padrão acima para carregar o código e os dados para as outras abas que estão no manipulador de evento de troca de aba.

Uma vez que implementamos a habilidade de começar a carregar código e dados de uma visualização de maneira independente, nós temos a opção de ir um passo além. Considere um componente `<Link to={path} />` que faz o link para uma rota. Se o usuário passa sobre este link, existe uma chance razoável de que ele irá clicá-lo. E se ele pressionar o mouse, existe uma chance ainda maior de que ele irá completar o click. Se nós podemos carregar o código e os dados para uma visualização *depois* de o usuário clicar, nós também podemos iniciar o trabalho *antes* deles clicarem, começando a preparar a visualização.

O melhor de tudo, nós podemos centralizar essa lógica em poucos lugares chave -- um roteador ou em componentes centralizadores de interação com o usuário -- e obter os benefícioes automaticamente em todo nosso app. Claro que pré-carregar nem sempre é benéfico. É algo que um aplicativo pode otimizar baseado no dispositivo do usuário ou velocidade de rede  para evitar consumir os planos de dados do usuário. Mas este padrão torna mais fácil centralizar a implementação do pré-carregamento e a decisão de quando habilitá-lo ou não.

### Carregar Dados Incrementalmente {#load-data-incrementally}

Os padrões acima -- dados em paralelo/árvores de visualização e obtenção em manipuladores de evento -- nos permitem iniciar o carregamento dos dados de uma visualização antecipadamente. Mas nós ainda queremos poder mostrar as partes mais importantes da visualização sem ter que esperar por *todos* os nossos dados. No Facebook nós implementamos o suporte para isso no GraphQL e Relay na forma de algumas novas diretivas de GraphQL (anotações que afetam quando/como os dados são entregues, mas não quais dados). Essas novas diretivas, chamadas `@defer` e `@stream`, nos permitem recuperar dados de maneira incremental. Por exemplo, considere nosso componente `<Post>` acima. Nós queremos mostrar o corpo sem ter que esperar que os comentários estejam prontos. Nós podemos alcançar isso com `@defer` e `<Suspense>`:

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

Aqui, nosso servidor GraphQL devolver os resultados por stream, primeiro retornando os campos `author` e `title` e então retornando os dados de comentário quando estiver pronto. Nós envolvemos a `<CommentList>` em uma `<Suspense>` então nós podemos renderizar o corpo da postagem antes da `<CommentList>` e seus dados estarem prontos. Esse padrão pode ser aplicados a outras biblotecas. Por exemplo, aplicativos que chamam uma API REST podem fazer requisições em paralelo para obter os dados para o corpo e comentários para uma postagem evitando bloquear até que todos os dados estejam prontos.

### Tratar Código Como Dados {#treat-code-like-data}

Mas ainda tem uma coisa faltando. Nós mostramos como pré-carregar *dados* para uma rota -- mas e o código? O exemplo acima nos enganou um pouco e usou `React.lazy`. De qualquer forma, `React.lazy` é, como o nome indica, *preguiçoso*. Ele não irá começar a baixar o código até que o componente preguiçoso esteja renderizados -- é uma "obtenção-na-renderização" para código!

Para resolver isso, a equipe do React está considerando APIs que nos permitiriam dividir o bundle e carregar completamente para código também. Isso permitiria um usuário passar de alguma forma um componente preguiçoso para uma rota, e a rota disparar o carregamento do código e dos seus dados o mais antecipadamente possível.

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

