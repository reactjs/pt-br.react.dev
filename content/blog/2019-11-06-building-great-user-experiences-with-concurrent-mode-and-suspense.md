---
title: "Construindo Ótimas Experiências de Usuário com Modo Concorrente e Suspense"
author: [josephsavona]
---

Na React Conf 2019 nós anunciamos uma [versão experimental](/docs/concurrent-mode-adoption.html#installation) do React que acrescenta suporte ao Modo Concorrente e Suspense. Nesse artigo nós vamos introduzir as melhores práticas para seu uso que nós identificamos durante o processo de construção [do novo facebook.com](https://twitter.com/facebook/status/1123322299418124289).

> Esse artigo será mais relevante para pessoas que trabalham com as *bibliotecas de obtenção de dados (data fetching)* para React. 
>
> Mostramos como integrar melhor elas com o Modo Concorrente e o Suspense. Os padrões introduzidos aqui são baseados no [Relay](https://relay.dev/docs/en/experimental/step-by-step) -- nossa biblioteca para construir interfaces de usuário orientadas a dados com GraphQL. De qualquer forma, as ideias desse artigo **se aplicam a outros clientes GraphQL também assim como bibliotecas que usam REST** ou outras abordagens.

Esse artigo é **dedicado aos autores de bibliotecas**. Se você for principalmente desenvolvedor de aplicações, você ainda pode encontrar ideias interessantes aqui, mas não se sinta obrigado a lê-lo inteiramente.

## Vídeos de Talks {#talk-videos}

Se você preferir assistir vídeos, algumas das ideias desse artigo foram abordadas em diversas apresentações da React Conf 2019:

* [Obtenção de Dados com Suspense no Relay](https://www.youtube.com/watch?v=Tl0S7QkxFE4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=15&t=0s) por [Joe Savona](https://twitter.com/en_JS)
* [Contruindo o Novo Facebook com React e Relay](https://www.youtube.com/watch?v=KT3XKDBZW7M&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=4) por [Ashley Watkins](https://twitter.com/catchingash)
* [React Conf Keynote](https://www.youtube.com/watch?v=uXEEL9mrkAQ&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=2) por [Yuzhi Zheng](https://twitter.com/yuzhiz)

Esse artigo apresenta um mergulho na implentação de uma biblioteca de obtenção de dados com Suspense.

## Colocando a Experiência de Usuário como Prioridade {#putting-user-experience-first}

A equipe do React e a comunidade tem constantemente enfatizado a experiência do desenvolvedor: garantindo que o React tenha boas mensagens de erro, focando em componentes como uma maneira de pensar localmente no comportamento do app, desenvolvendo APIs que são previsíveis e encorajando o correto uso via design, etc. Mas nós não temos difundido o suficiente as melhores práticas para garantir uma ótima experiência de *usuário* em grandes aplicações.

Por exemplo, a equipe do React tem focado na performance da *biblioteca* e provido ferramentas para desenvolvedores debugarem e refinarem a performance da aplicação (ex. `React.memo`). Mas nós não temos opinado sobre *padrões de alto nível* que fazem a diferença entre aplicativos rápidos e fluídos e aplicativos lentos e travados. Nós sempre queremos garantir que o React se mantenha acessível a novos usuários e suporte vários de casos uso -- nem todo app tem que ser "super" rápido. Mas como uma comunidade nós podemos e devemos sonhar alto. **Nós devemos fazer ser tão fácil quanto possível construir aplicativos que iniciam rápido e continuam rápidos,** mesmo quando eles crescem em complexidade, para usuários utilizando uma variedade de dispositivos e redes no mundo todo. 

[Modo Concorrente](/docs/concurrent-mode-intro.html) e [Suspense](/docs/concurrent-mode-suspense.html) são funcionalidades experimentais que podem ajudar os desenvolvedores a alcançarem esse objetivo. Nós inicialmente apresentamos eles na [JSConf Iceland em 2018](/blog/2018/03/01/sneak-peek-beyond-react-16.html), intencionalmente compartilhando detalhes muito antecipadamente para dar a comunidade tempo para digerir os novos conceitos e para se prepararem para as alterações seguintes. Desde então nós completamos trabalhos correlacionados, como a nova API de Contexto e a introdução do Hooks, que foram desenhados em parte para ajudar os desenvolvedores a escreverem código que seja naturalmente mais compatível com o Modo Concorrente. Mas nós não queremos implementar essas funcionalidades e liberá-las sem garantir que funcionam. Então ao longo do ano passado, as equipes do React, Relay, infraestrutura web, e produto do Facebook têm todas colaborado fortemente para construir uma nova versão do facebook.com que integre profundamente o Modo Concorrente e o Suspense para criar uma experiência com uma sensação mais fluída e similar a de um app. 

Graças a esse projeto, nós estamos mais confiantes do que nunca de que o Modo Concorrente e o Suspense podem tornar mais fácil entregar uma experiência de usuário ótima e *rápida*. Mas fazer isso requer repensar como nós abordamos o carregamento do código e dos dados em nossos apps. Efetivamente toda a obtenção de dados no novo facebook.com é realizada pelo [Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) -- novas APIs do Relay baseadas em Hooks que integram com o Modo Concorrente e o Suspense sem configurações adicionais.

Relay Hooks -- e GraphQL -- não são para todos, e tudo bem com isso! Através do nosso trabalho nessas APIs nós identificamos um conjunto de padrões em geral para utilizar com Suspense. **Mesmo que o Relay não se encaixe para você, nós acreditamos que os padrões chave que nós introduzimos com o Relay Hooks podem ser adaptados para outras bibliotecas**

## Melhores Práticas com Suspense {#best-practices-for-suspense}

É tentador focar apenas no tempo total de inicialização de um app -- mas ocorre que a percepção de performance pelo usuário é determinada por mais do que o tempo absoluto de carregamento. Por exemplo, quando comparados dois aplicativos com o mesmo tempo absoluto de inicialização, nossos estudos mostram que os usuários geralmente irão perceber aquele que tiver menos estados de carregamento intermediários e menos alterações de layout como o que carrega mais rápido. Suspense é uma ferramenta poderosa por orquestrar cuidadosamente uma elegante sequência de carregamento com poucos, e bem definidos, estados que revelam progressivamente o conteúdo. Mas melhorar a performance percebida vai além disso -- nossos apps não deveriam demorar uma eternidade para obter todo o código, dados, imagens, e outros artefatos.

A abordagem tradicional para carregar dados nos apps React envolvem o que nos referimos como ["renderização-conforme-você-busca"](/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense). Primeiro nós renderizamos um componente com um spinner, então carregamos dados na montagem (`componentDidMount` ou `useEffect`), e finalmente atualizamos para renderizar os dados resultantes. É certamente *possível* usar esse padrão com Suspense: ao invés de inicialmente renderizar um placeholder por si mesmo, um componente pode "suspender" -- indicar ao React que ele não está pronto ainda. Isso irá dizer ao React para buscar o ancestral mais próximo `<Suspense fallback={<Placeholder/>}>`, e renderizar o seu fallback no lugar. Se você viu os demos do Suspense anteriormente este exemplo pode parecer familiar -- é como nós originalmente imaginamos usar o Suspense para obtenção de dados.

Ocorre que esta abordagem tem algumas limitações. Considere uma página que mostra uma postagem de mídia social feita por um usuário, com comentários nessa postagem. Ela pode ser estruturada como um componente `<Post>` que renderiza tanto o corpo da postagem como a `<CommentList>` para mostrar os comentários. Usando a abordagem de renderização-conforme-você-busca descrita acima para implementar isso pode causar idas e voltas sequenciais (muitas vezes conhecido como uma "cachoeira"). Primeiro os dados para o componente `<Post>` seriam obtidos e então os dados para a `<CommentList>`, aumentando o tempo que para mostrar a página completamente.

Há também outra desvantagem muitas vezes esquecida nessa abordagem. Se o `<Post>` requisita (ou importa) o componente `<CommentList>` de maneira completa, nosso app terá de esperar para mostrar o *corpo* da postagem enquanto o código para os *comentários* é baixado. Nós poderíamos carregar a `<CommentList>` de maneira preguiçosa, mas dessa forma nós iríamos atrasar a obtenção dos dados dos comentários e aumentar o tempo para exibir a página inteira. Como nós resolvemos esse problema sem comprometer a experiência do usuário?

## Renderização Conforme Você Busca {#render-as-you-fetch}

A abordagem de renderização-conforme-você-busca é amplamente utilizada pelos apps React atualmente e pode certamente ser usada para criar ótimos apps. Mas nós conseguiríamos fazer ainda melhor? Vamos voltar um passo atrás e considerar nosso objetivo.

No exemplo acima do `<Post>`, nós idealmente deveríamos mostrar o conteudo mais importante -- o corpo da postagem -- o mais rápido possível, *sem* impactar negativamente o tempo para mostrar a página completamente (incluindo comentários). Vamos considerar as restrições em qualquer solução e observar como nós podemos atendê-las:

* Mostrar o conteúdo mais importante (o corpo da postagem) o mais rápido possíve significa que nós precisamos carregar o código e os dados para a visualização de forma incremental. Nós *não queremos bloquear a visualização do corpo da postagem* enquanto o código da `<CommentList>` é baixado, por exemplo.
* Ao mesmo tempo nós não queremos aumentar o tempo para exibição da página completa incluindo comentários. Então nós precisamos *começar a carregar o código e os dados para os comentários* o mais rápido possível, idealmente *em paralelo* ao carregamento do corpo da postagem.

Isso pode soar difícil de alcançar -- mas essas restrições são na verdade incrivelmente facilitadoras. Elas descartam uma série de abordagens e nos desenham um rascunho da solução. Isso nós leva aos padrões chave que nós implementamos no Relay Hooks, e que podem ser adaptados para outras biblotecas de obtenção de dados. Veremos cada desses padrões de maneira a entender como podem nos ajudar a alcançar nosso objetivo de experiências de carregamento rápidas e encatadoras:

1. Dados em paralelo e árvores de visualização
2. Obtenção de dados em manipuladores de evento
3. Carregar dados incrementalmente
4. Tratar código como dado

### Dados em Paralelo e Árvores de Visualização {#parallel-data-and-view-trees}

Uma das coisas mais atraentes no padrão de renderização-conforme-você-busca é que ele combina *quais* dados o componente precisa com *como* renderizar esses dados. Essa combinação é ótima -- um exemplo de como faz sentido agrupar código por responsabilidades e não por tecnologias. Todos os problemas que nós vimos acima foram sobre *quando* nós obtemos os dados nessa abordagem: após a renderização. Nós precisamos precisamos ser capazes de obter dados *antes* de renderizar o componente. A única forma de alcançar isso é extraindo as dependências de dados em dados em paralelo e árvores de visualização.

Aqui mostramos como isso funciona no Relay Hooks. Continuando nosso exemplo de uma postagem de mídia social com corpo e comentários, aqui está como definimos isso no Relay Hooks:

```javascript
// Post.js
function Post(props) {
  // Dado uma referência para alguma postagem - `props.post` - *de quais* dados
  // nós precisamos sobre essa postagem?
  const postData = useFragment(graphql`
    fragment PostData on Post @refetchable(queryName: "PostQuery") {
      author
      title
      # ...  mais campos ...
    }
  `, props.post);

  // Agora que nós temos os dados, como renderizá-lo?
  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* mais campos  */}
    </div>
  );
}
```

Embora o GraphQL esteja escrito junto ao componente, Relay tem um passo de build (Compilador do Relay) que extrai essas dependências-de-dados em arquivos separados e agrega o GraphQL para cada visualização em uma única consulta. Então nós obtemos os benefícios de combinar responsabilidades, enquanto no tempo de execução temos dados em paralelo e árvores de visualização. Outras bibliotecas poderiam alcançar resultados similares ao permitir que os desenvolvedores definam lógica de obtenção de dados em um arquivo irmão (talvez `Post.data.js`), ou então integrar com um bundler para permitir definição de dependência de dados com código de interface de usuário e automaticamente extraí-lo, de maneira semelhante ao Compilador do Relay.

O segredo é que independente da tecnologia que estamos usando para carregar nossos dados -- GraphQL, REST, etc -- nós podemos separar *quais* dados carregar de como e quando fazê-lo. Mas uma vez feito isso, *como e quando* nós carregamos nossos dados?

### Obtenção de Dados em Manipuladores de Evento {#fetch-in-event-handlers}

Imagine que nós estamos para navegar da listagem de postagens de um usuário para a página de uma postagem específica. Nós vamos precisar baixar o código para aquela página -- `Post.js` -- e também obter seus dados.

Aguardar até que a gente renderize os dados gera os problemas que nós vimos acima. O segredo é começar a obter o código e os dados para a nova visualização *no mesmo manipulador de evento que dispara a visualização*. Nós ainda podemos obter os dados com nosso roteador -- se nosso roteador suporta pré-carregamento de dados para as rotas -- ou no evento de clique no link que disparou a navegação. Vale lembrar que os colegas do React Router já trabalharam arduamente para construir APIs para suportarem pré-carregamento de dados para rotas. Mas outras bibliotecas de roteamento podem implementar essa ideia também.

Conceitualmente, nós queremos que a definição de cada rota inclua duas coisas: qual componente renderizar e que dados pré-carregar, como uma função de rota/parâmetros de url. Aqui está o que esta definição de rota *pode* parecer. Este exemplo é um pouco inspirado pelas definições de rota do React Router e *principalmente se dedica a demonstrar o conceito, não uma API específica*:

```javascript
// PostRoute.js (GraphQL version)

// Consulta do Relay para carregamento dos dados do Post
import PostQuery from './__generated__/PostQuery.graphql';

const PostRoute = {
  // uma expressão que associa qual rota tratar
  path: '/post/:id',

  // que componente renderizar para essa rota
  component: React.lazy(() => import('./Post')),

  // dados a serem carregados para essa rota, como uma função dos parâmetros
  // da rota
  prepare: routeParams => {
    // Relay extrai consultas de componentes, nos permitindo referenciar
    // as dependências de dados -- árvore de dados -- de fora.
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

Esta abordagem pode ser generalizada para outras soluções de obtenção de dados. Um app que usa REST poderia definir uma rota dessa forma:

```javascript
// PostRoute.js (versão em REST)

// Lógica escrita manualmente para carregamento dos dados para o componente
import PostData from './Post.data';

const PostRoute = {
  // uma expressão que associa qual rota tratar
  path: '/post/:id',

  // que componente renderizar para essa rota
  component: React.lazy(() => import('./Post')),

  // dados a serem carregados para essa rota, como uma função dos parâmetros
  // da rota
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

Esta mesma abordagem pode ser empregada não apenas para roteamento, mas em outros lugares onde nós queiramos mostrar conteúdo de maneira preguiçosa ou baseada na interação do usuário. Por exemplo, um componente de aba poderia carregar completamente os dados e o código para a primeira aba, e então usar o mesmo padrão acima para carregar o código e os dados para as outras abas que estão no manipulador de evento de troca de aba. Um componente que mostra um modal poderia pré-carregar o código e os dados para o modal no manipulador de clique que dispara a abertura do modal, e assim por diante.

Uma vez que implementamos a habilidade de começar a carregar código e dados de uma visualização de maneira independente, nós temos a opção de ir um passo além. Considere um componente `<Link to={path} />` que faz o link para uma rota. Se o usuário passa sobre este link, existe uma chance razoável de que ele irá clicá-lo. E se ele pressionar o mouse, existe uma chance ainda maior de que ele irá completar o clique. Se nós podemos carregar o código e os dados para uma visualização *depois* de o usuário clicar, nós também podemos iniciar o trabalho *antes* deles clicarem, começando a preparar a visualização.

O melhor de tudo, nós podemos centralizar essa lógica em poucos lugares chave -- um roteador ou em componentes centralizadores de interação com o usuário -- e obter quaisquer benefícios de performance automaticamente em todo nosso app. Claro que pré-carregar nem sempre é benéfico. É algo que um aplicativo pode otimizar baseado no dispositivo do usuário ou velocidade de rede para evitar consumir os planos de dados do usuário. Mas este padrão torna mais fácil centralizar a implementação do pré-carregamento e a decisão de quando habilitá-lo ou não.

### Carregar Dados Incrementalmente {#load-data-incrementally}

Os padrões acima -- dados em paralelo/árvores de visualização e obtenção em manipuladores de evento -- nos permitem iniciar o carregamento dos dados de uma visualização antecipadamente. Mas nós ainda queremos poder mostrar as partes mais importantes da visualização sem ter que esperar por *todos* os nossos dados. No Facebook nós implementamos o suporte para isso no GraphQL e Relay na forma de algumas novas diretivas de GraphQL (anotações que afetam quando/como os dados são entregues, mas não quais dados). Essas novas diretivas, chamadas `@defer` e `@stream`, nos permitem recuperar dados de maneira incremental. Por exemplo, considere nosso componente `<Post>` acima. Nós queremos mostrar o corpo sem ter que esperar que os comentários estejam prontos. Nós podemos alcançar isso com `@defer` e `<Suspense>`:

```javascript
// Post.js
function Post(props) {
  const postData = useFragment(graphql`
    fragment PostData on Post {
      author
      title

      # obter dados para os comentários, mas sem bloquear até que estejam carregados
      ...CommentList @defer
    }
  `, props.post);

  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* @defer trabalha naturalmente com <Suspense> para criar uma interface de usuário não bloqueada também */}
      <Suspense fallback={<Spinner/>}>
        <CommentList post={postData} />
      </Suspense>
    </div>
  );
}
```

Aqui, nosso servidor GraphQL devolve os resultados por stream, primeiro retornando os campos `author` e `title` e então retornando os dados de comentário quando estiver pronto. Nós envolvemos a `<CommentList>` em uma tag `<Suspense>` então nós podemos renderizar o corpo da postagem antes da `<CommentList>` e seus dados estarem prontos. Esse padrão pode ser aplicado a outras biblotecas. Por exemplo, apps que chamam uma API REST podem fazer requisições em paralelo para obter os dados para o corpo e comentários para uma postagem evitando bloquear até que todos os dados estejam prontos.

### Tratar Código Como Dados {#treat-code-like-data}

Mas ainda tem uma coisa faltando. Nós mostramos como pré-carregar *dados* para uma rota -- mas e o código? O exemplo acima nos enganou um pouco e usou `React.lazy`. De qualquer forma, `React.lazy` é, como o nome indica, *preguiçoso*. Ele não irá começar a baixar o código até que o componente preguiçoso esteja renderizado -- é uma "obtenção-de-dados-na-renderização" para código!

Para resolver isso, a equipe do React está considerando APIs que nos permitiriam dividir o bundle e pré-carregar completamente o código também. Isso permitiria um usuário passar de alguma forma um componente preguiçoso para uma rota, e a rota disparar o carregamento do código e dos seus dados o mais antecipadamente possível.

## Resumindo {#putting-it-all-together}

Para recaptular, atingir uma ótima experiência de usuário significa que nós precisamos **começar a carregar código e dados o mais antecipadamente possível, mas sem esperar que tudo seja completado**. Dados em paralelo e árvores de visualização nos permitem carregar os dados para uma visualização em paralelo com o carregamento da própria visualização (código). Obtenção de dados em um manipulador de eventos significa que nós podemos começar a carregar os dados o mais antecipadamente possível, e otimamente até mesmo pré-carregar uma visualização quando nós tivermos confiança suficiente de que o usuário irá navegar para ela. Carregar dados de maneira incremental nos permite carregar os dados mais importantes antecipadamente sem atrasar a obtenção de dados de menos importância. E tratar código como dados -- e pré-carregar esse código com APIs similares -- nos permite carregá-lo de maneira antecipada também.

## Utilizando Esses Padrões {#using-these-patterns}

Esses padrões não são apenas ideias -- nós os implementamos no React Hooks e estamos usando eles em produção ao longo do novo facebook.com (o que está atualmente em teste beta). Se você estiver interessado em utilizá-lo ou aprender mais sobre esses padrões, aqui estão algumas referências:

* A [documentação do Modo Concorrente do React](/docs/concurrent-mode-intro.html) aborda como utilizar o Modo Concorrente e o Suspense e detalha melhor vários desses padrões. É uma ótima referência para aprender mais sobre as APIs e casos de uso que elas suportam.
* A [versão experimental do Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) implementa os padrões descritos aqui. 
* Nós implementamos dois aplicativos de exemplo que demonstram esses conceitos:
  * O [aplicativo exemplo do Relay Hooks](https://github.com/relayjs/relay-examples/tree/master/issue-tracker) utiliza a API GraphQL pública do GitHub para implementar um aplicativo simples de rastreamento de issues. Ele inclui suporte a rotas aninhadas com pré-carregamento de dados e código. O código está totalmente comentado -- nós encorajamos clonar o repositório, executar o aplicativo localmente, e explorar como ele funciona.
  * Nós também temos uma [versão de aplicativo não-GraphQL](https://github.com/gaearon/suspense-experimental-github-demo) que demonstra como esses conceitos podem ser aplicados para outras bibliotecas de obtenção de dados.

Mesmo que as APIs do Modo Concorrente e Suspense [ainda sejam experimentais](/docs/concurrent-mode-adoption.html#who-is-this-experimental-release-for), nós estamos confiantes que as ideias desse artigo são comprovadas na prática. De qualquer forma, nós entendemos que o Relay e GraphQL não são aplicáveis a todos. E tudo bem! **Nós estamos explorando como generalizar esses padrões para abordagens como REST,** e também explorando ideias para uma API mais genérica (isto é, não-GraphQL) para composição de árvores de dependência de dados. Enquanto isso, estamos animados por ver que novas bibliotecas irão surgir implementando os padrões descritos nesse artigo para criar de maneira mais fácil, experiências de usuário *rápidas*.

