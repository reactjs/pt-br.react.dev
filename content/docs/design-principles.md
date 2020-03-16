---
id: design-principles
title: Princípios de Design
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---
Escrevemos este documento para que se tenha uma melhor compreensão sobre como decidimos o que o React faz e o que não faz e como é nossa filosofia de desenvolvimento. Embora aguardamos ansiosos as contribuições da comunidade, não tomaremos um caminho que viole um ou mais desses princípios.

> **Nota:**
>
> Este documento pressupõe um forte entendimento do React. Ele descreve os princípios de design do *React em si*, não de seus componentes ou aplicações.
>
> Para uma introdução ao React, verificar [Pensando em React ](/docs/thinking-in-react.html).

### Composição {#composition}

A principal característica do React são os componentes. Componentes escritos por diferentes pessoas, devem funcionar bem juntos. É importante para nós que você possa adicionar funcionalidade a um componente, sem gerar efeitos colaterais no código.

Por exemplo, é possível introduzir um state (estado) local dentro de um componente, sem alterar nenhum dos componentes que usam o mesmo. Da mesma forma, será possível adicionar código de inicialização e "destruição" em qualquer componente quando necessário.

Não há nada de "errado" em usar state (estado) ou métodos do ciclo de vida nos componentes. Como qualquer funcionalidade poderosa, eles devem ser usados com moderação. Porém, não temos a intenção de removê-los. Pelo contrário, pensamos que eles são partes importantes do que torna o React útil. Poderemos permitir [mais padrões funcionais](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) no futuro. Porém, tanto state (estado) local e métodos do ciclo de vida serão parte desse modelo.

Componentes geralmente são descritos como "apenas funções". Porém, pelo nosso ponto de vista, eles precisam ser mais do que isso para serem úteis. No React, os componentes descrevem qualquer comportamento "composable", incluindo rendering (renderização), lifecycle (ciclo de vida) e state. Algumas bibliotecas, como [Relay (Retransmissão)](https://facebook.github.io/relay/) aumentam a responsabilidade dos componentes, como por exemplo descrever a dependência de dados. É possível que essas ideias possam voltar para o React também de alguma forma.

### Abstração comum {#common-abstraction}

Normalmente nós [resistimos à adição de funcionalidades](https://www.youtube.com/watch?v=4anAwXYqLG8) que podem ser implementadas pela comunidade. Pois não queremos encher as suas aplicações com código de bibliotecas desnecessárias. No entanto, há algumas exceções.

Por exemplo, se o React não fornecesse suporte para state (estado) local e métodos do ciclo de vida, as pessoas criariam abstrações personalizadas para eles. E, quando há várias abstrações competindo, o React não pode forçar ou tirar vantagem das propriedades de nenhum dessas abstrações. Deve-se ter um mínimo padrão a ser seguido.

Por isso, ocasionalmente, adicionamos recursos ao React em si. Se soubermos que há vários componentes implementando uma certa funcionalidade de maneira incompatível ou ineficiente, preferimos implementá-las como parte do React. Embora não façamos isso com frequência. Quando fizermos é porque acreditamos que, aumentando o nível de abstração, iremos beneficiar todo o sistema. State, métodos do ciclo de vida, eventos de normalização cross-browser são bons exemplos disso.

Sempre debatemos melhorias com a comunidade. Você pode achar alguns desses debates pela label ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") nas issues do React.

### Saída de Emergência {#escape-hatches}

O React é pragmático. Guiado pelas necessidades dos projetos desenvolvidos no Facebook. Embora seja influenciado por alguns paradigmas que ainda não são muito utilizados, tais como programação funcional, manter-se  acessível para uma grande variedade de desenvolvedores, com diferentes níveis de habilidades e experiência,  é um dos principais objetivos do projeto.

Se quisermos depreciar algum padrão que não gostamos, é de nossa responsabilidade considerar todas as situações para isso e [educar a comunidade para que pense em alternativas](/blog/2016/07/13/mixins-considered-harmful.html), antes de o depreciarmos. Se houver algum padrão bastante utilizado para construção das aplicações, porém complexo para expressar de modo declarativo, iremos [oferecer uma API imperativa](/docs/more-about-refs.html) para isso. Se não fornecemos uma API perfeita, para alguma situação que achamos necessária em diversas aplicações, iremos fornecer [uma API temporária](/docs/legacy-context.html) desde que seja possível nos livrarmos dela mais tarde e ela deixe a porta aberta para futuras melhorias.

### Estabilidade {#stability}

Valorizamos APIs estáveis. No Facebook, temos mais de 50 mil componentes utilizando React. Muitas outras empresas, como [Twitter](https://twitter.com/) e [Airbnb](https://www.airbnb.com/), também utilizam bastante o React. Estes são os motivos de evitarmos alterações nas APIs públicas ou no comportamento do React.

Entretanto, quando pensamos em estabilidade, não dizemos que "não haverá mudanças". Pois assim, rapidamente irá paralisar. Em vez disso, preferimos definir estabilidade como "Amplamente utilizado em produção e quando ocorrer alguma alteração, haverá um caminho claro (e preferencialmente automatizado) para realizar a migração."

Quando nós depreciamos um padrão, estudamos seu uso interno no Facebook e adicionamos avisos de depreciação. Permitindo-nos avaliar o impacto da mudança. Às vezes voltamos atrás se percebermos que foi uma ação precoce e que necessitamos pensar mais estrategicamente sobre colocar o código em um patamar onde ele está pronto para essa mudança.

Se estamos confiantes que a mudança não é tão disruptivas e a estratégia de migração é viável para todos os contextos, nós lançamos alertas de depreciação para a comunidade. Estamos em contato com diversos usuários do React fora do Facebook e monitoramos diversos projetos open source e orientamos essas equipes para corrigir essas depreciações.

Dado o tamanho do código-base de React no Facebook, realizar uma migração interna bem sucedida é geralmente um bom indicador que outras empresas não terão problemas também. Entretanto, há situações em que os usuários descrevem situações que não pensamos e nestes casos, acrescentamos caminhos alternativos para eles ou repensamos nossa abordagem.

Não iremos depreciar nada se não for por uma boa razão. Sabemos que a depreciação irá, em alguns momentos, causar frustração. Porém, fazemos isso para melhorar a legibilidade para futuras melhorias e funcionalidades que são consideradas muito valiosas, tanto para nós quanto para a comunidade.

Por exemplo, adicionamos um [aviso sobre DOM props desconhecidas](/warnings/unknown-prop.html) no React 15.2.0. Muitas pessoas foram afetadas por isso. No entanto, este aviso, é importante para que possamos introduzir o suporte para [atributos personalizados](https://github.com/facebook/react/issues/140) do React. Existe uma razão, como esta, por trás de cada depreciação que adicionamos.

Quando adicionamos um alerta de depreciação, nós o mantemos para o resto da versão principal atual e [alteramos o comportamento na próxima versão](/blog/2016/02/19/new-versioning-scheme.html). Se tiver muito trabalho manual repetitivo envolvido, disponibilizaremos um [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) que automatiza a maioria dessas mudanças. Codemods nos permitem progredir, sem paralisar, em uma quantidade massiva de código-base e encorajamos você a usá-los também.

É possível encontrar os codemods que lançamos no repositório [react-codemod](https://github.com/reactjs/react-codemod).

### Interoperabilidade {#interoperability}

Nós valorizamos a interoperabilidade com sistemas já existentes e com adoção gradual. O Facebook possui bastante código que não é em React. Seu site usa uma mistura de um sistema de componente server-side (lado do servidor) chamado XHP, bibliotecas internas de UI que vieram antes do React e o próprio React. É importante que qualquer equipe do produto consiga [começar a utilizar o React para pequenas funcionalidades](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) em vez de reescrever todo seu código para apostar totalmente nele.

Por isso o React fornece diferentes saídas para trabalhar com modelos mutáveis e tenta funcionar corretamente com outras bibliotecas de UI. Você pode envolver uma UI imperativa existente em um componente declarativo e vice-versa. Isso é essencial para adoção gradual.

### Agendamento {#scheduling}

Mesmo quando seus componentes são descritos como funções, no React você não os chama diretamente. Todo componente retorna uma [descrição do que necessita ser renderizado](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree) e esta descrição pode incluir ambos os componentes do usuário, como `<LikeButton>` e componentes da plataforma, como `<div>`. Cabe ao React "desenrolar" `<LikeButton>`, em certo ponto no futuro e realmente aplicar alterações à árvore da UI de acordo com os resultados de renderização dos componentes de forma recursiva.'

Esta é uma distinção sutil, mas poderosa. Como você não chama a função do componente, mas permite que o React a chame, isso significa que o React tem o poder de atrasar a chamada, se necessário. Em sua implementação atual, o React percorre a árvore recursivamente e chama funções de renderização de toda a árvore atualizada durante um único tic. No entanto, no futuro, ele pode começar [atrasando algumas atualizações para evitar a queda de quadros (frames)](https://github.com/facebook/react/issues/6170).

Este é um tema comum no design do React. Algumas bibliotecas populares implementam a abordagem "push", onde os cálculos são realizadas quando os novos dados estão disponíveis. No entanto no React, segue à abordagem "pull", em que os cálculos podem ser atrasados até que sejam necessários.

React não é uma biblioteca genérica de processamento de dados. É uma biblioteca para construir interfaces de usuário. Achamos que ele está posicionado em um aplicativo exclusivamente para saber quais cálculos são relevantes no momento e quais não são.

Se algo estiver fora da tela, podemos atrasar qualquer lógica relacionada a ele. Se os dados chegarem mais rápido que a taxa de quadros, poderemos reunir e atualizar em lote. Podemos priorizar o trabalho proveniente de interações do usuário (como uma animação causada por um clique de um botão) sobre um trabalho de segundo plano menos importante (como renderizar novo conteúdo carregado da rede) para evitar a queda de quadros.

Para ser claro, nós não estamos tirando proveito disso por agora. No entanto, a liberdade de fazer algo assim é porque preferimos ter controle sobre o agendamento e porque `setState()` é assíncrono. Conceitualmente, pensamos nisso como "agendar uma atualização".

O controle sobre o agendamento seria mais difícil para nós ganharmos se deixássemos o usuário compor views diretamente com um paradigma baseado em "push", comum em algumas variações da [Programação Funcional Reativa](https://en.wikipedia.org/wiki/Functional_reactive_programming). Nós queremos possuir o código "grudento"

É uma meta importante para o React que a quantidade de código do usuário que é executada antes de retornar ao React seja mínima. Isso garante que o React mantenha a capacidade de agendar e dividir o trabalho em partes de acordo com o que ele sabe sobre a UI.

Existe uma piada interna do time que o React deveria ter sido chamado de "Schedule", porque o React não quer ser totalmente "reativo".

### Experiência do Desenvolvedor {#developer-experience}

Proporcionar uma boa experiência para o desenvolvedor é importante para nós.

Por exemplo, mantemos uma ferramenta [React DevTools](https://github.com/facebook/react-devtools) na qual é possível inspecionar a árvore de componentes do React no Chrome e Firefox. Sabemos que esta ferramenta melhorou a produtividade, tanto para os engenheiros do Facebook, quanto para a comunidade.

Nós também nos esforçamos para providenciar avisos de desenvolvedor úteis. Por exemplo, React o avisa se, no desenvolvimento, você aninhou as tags de certa forma que o navegador não entende ou se haver algum erro de digitação na API. Alertas para o desenvolvedor e as verificações relacionadas são a principal razão da versão de desenvolvimento do React ser mais lenta do que a versão de produção.

Os padrões de uso que vemos internamente no Facebook nos ajuda a entender quais são os erros comuns e como prevenir eles antecipadamente. Quando adicionamos novas funcionalidades, tentamos antecipar esses erros e avisar sobre eles.

Estamos sempre procurando formas de melhorar a experiência do desenvolvedor. Adoramos ouvir suas sugestões e aceitar as suas contribuições para torná-la ainda melhor.

### Depuração {#debugging}

Quando algo acontece de errado é importante que você tenha uma trilha para rastrear o erro até a sua origem no código. No React, props e state (estado) são essas trilhas.

Se verificar algo de errado em sua tela, você pode abrir o React DevTools, encontrar o componente responsável pela renderização, e verificar se as props e o state estão corretos. Se eles estiverem, você sabe que o problema está função `render()` do componente, ou alguma função que é chamado pelo ` render()`. É um problema isolado.

Se o state (estado) estiver errado, você sabe que o problema é causado por alguma das chamadas `setState()` deste arquivo. Este problema também é fácil de localizar e corrigir, pois geralmente existem somente algumas chamadas `setState()` em um único arquivo.

Se as props estiverem erradas, você pode percorrer pela árvore do React no inspetor, procurando pelo primeiro elemento que causou o erro, passando as props erradas para os filhos.

Essa capacidade de rastrear qualquer UI até os dados que a produziram na forma de props e state (estado) atuais é muito importante para o React. É um objetivo de design explícito que o state (estado) não esteja "preso" em closures e combinadores e esteja disponível para o React diretamente.

Embora a UI seja dinâmica, acreditamos que as funções `render()` síncronas de props e de state (estado) transformam a depuração. O que era um trabalho de adivinhação passa a ser um procedimento chato, porém finito. Gostaríamos de preservar essa restrição no React mesmo que isso torne alguns casos de uso, como animações complexas mais difíceis.

### Configuração {#configuration}

Nós achamos que as opções globais de configuração de tempo de execução são problemáticas.

Por exemplo, é ocasionalmente solicitado que implementemos uma função como `React.configure(options)` ou `React.register(component)`. No entanto, isso expõe vários problemas e não estamos cientes de boas soluções para eles.

E se alguém chamar tal função de uma biblioteca de componentes de terceiros? E se um aplicativo React incorporar outro aplicativo React e suas configurações desejadas forem incompatíveis? Como um componente de terceiros pode especificar que requer uma configuração específica? Pensamos que a configuração global não funciona bem com a composição. Como a composição é fundamental para o React, não fornecemos configuração global no código.

No entanto, fornecemos algumas configurações globais no nível de construção. Por exemplo, fornecemos builds separadas de desenvolvimento e produção. Também podemos [adicionar uma build de criação de perfil](https://github.com/facebook/react/issues/6627) no futuro e estamos abertos a considerar outras flags de builds.

### Além do DOM {#beyond-the-dom}

A grande vantagem do React é a maneira que ele nos permite desenvolver componentes com menos bugs e que possam ser integrados juntos. DOM é o destino original de renderização para o React, mas o [React Native](https://reactnative.dev/) é tão importante quanto, tanto para o Facebook quanto para a comunidade.

Ser "renderer-agnostic" é uma importante restrição de design do React. Isso adiciona alguma sobrecarga nas representações internas. Por outro lado, quaisquer melhorias no núcleo são traduzidas em todas as plataformas.

Ter um único modelo de programação nos permite formar equipes de engenharia em torno de produtos em vez de plataformas. Até agora, a compensação valeu a pena para nós.

### Implementação {#implementation}

Tentamos fornecer APIs elegantes sempre que possível. Estamos muito menos preocupados com a implementação ser elegante. O mundo real está longe de ser perfeito e, até certo ponto, preferimos colocar o código feio na biblioteca, se isso significar que o usuário não precise escrevê-lo. Quando avaliamos novos código, estamos procurando uma implementação que seja correta, que tenha um bom desempenho e proporcione uma boa experiência para o desenvolvedor. Elegância é secundário.

Nós preferimos código chato do que código inteligente. Código é descartável e muitas vezes muda. Portanto, é importante que [não introduza novas abstrações internas a menos que seja absolutamente necessário](https://youtu.be/4anAwXYqLG8?t=13m9s). Código verboso que é fácil de mover, alterar e remover é preferível ao código elegante, que é prematuramente abstraído e difícil de alterar.

### Optimizado para Tooling {#optimized-for-tooling}

Algumas APIs comumente usadas têm nomes verbosos. Por exemplo, usamos `componentDidMount()` em vez de `didMount()` ou `onMount()`. Isso é [intencional](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). O objetivo é tornar os pontos de interação com a biblioteca altamente visíveis.

Em um código-base enorme como o Facebook, poder pesquisar usos de APIs específicas é muito importante. Valorizamos nomes verbosos distintos, especialmente pelas funcionalidades que devem ser usados com moderação. Por exemplo, `dangerouslySetInnerHTML` é difícil de passar batido em uma revisão de código.

A otimização para pesquisa também é importante devido à nossa confiança nos [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) para fazer alterações significativas (que quebrariam o código). Queremos que seja fácil e seguro aplicar vastas alterações automatizadas em toda o código-base, e nomes verbosos distintos nos ajudam a conseguir isso. Da mesma forma, nomes distintos facilitam escrever [regras de lint](https://github.com/yannickcr/eslint-plugin-react) personalizadas sobre como usar o React sem se preocupar com possíveis falsos positivos.

[JSX](/docs/introducing-jsx.html) desempenha um papel semelhante. Embora não seja necessário com o React, nós o usamos extensivamente no Facebook, tanto por razões estéticas quanto pragmáticas.

Em nosso código-base, o JSX fornece uma dica não ambígua para as ferramentas de que elas estão lidando com uma árvore de elementos React. Isso torna possível adicionar otimizações em tempo de build, como [elevar elementos constantes](https://babeljs.io/docs/plugins/transform-react-constant-elements/), seguramente aplicar o lint e executar o "codemodar" nos usos de componentes internos, e [incluir o local de origem do JSX](https://github.com/facebook/react/pull/6771) nos avisos.

### Dogfooding {#dogfooding}

Trabalhamos ao máximo para resolver todos os problemas reportados pela comunidade. No entanto, priorizamos as issues que as pessoas *também* estão sofrendo internamente no Facebook. Ironicamente,  nós pensamos que está é a principal razão da comunidade apostar no React.

O uso intensivo interno do React nos dá confiança de que ele não irá desaparecer amanhã. O React foi criado pelo Facebook para resolver problemas do próprio Facebook. Traz valor comercial tangível para a empresa e é usado em muitos de seus produtos. [Usar nosso próprio produto (Dogfooding)](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) significa que nossa visão permanece nítida e temos uma direção focada daqui para frente.

Não significa que ignoramos os problemas reportados pela comunidade. Por exemplo, nós adicionamos suporte à [web components](/docs/webcomponents.html) e [SVG](https://github.com/facebook/react/pull/6243) no React, mesmo que não os utilizamos internamente. Estamos constantemente [atentos às suas reclamações](https://github.com/facebook/react/issues/2686) e [iremos solucioná-las](/blog/2016/07/11/introducing-reacts-error-code-system.html) da melhor maneira possível. A comunidade é o que faz o React tão especial para nós e é uma honra podermos retribuir de volta.

Depois de lançar muitos projetos open source no Facebook, aprendemos que tentar fazer todos felizes ao mesmo tempo produziu projetos com foco ruim que não cresceram bem. Em vez disso, descobrimos que escolher um público pequeno e focar em torná-lo feliz traz um efeito positivo. Foi exatamente isso que fizemos com o React e até agora a solução dos problemas encontrados pelas equipes de produtos do Facebook se traduziu bem na comunidade open source.

A desvantagem é que, em alguns momentos, não damos atenção suficiente aos pontos em que as equipes do Facebook não lidam, tal como a experiência dos iniciantes no projeto. Estamos cientes disto e pensamos constantemente em como melhorar esta situação, visando beneficiar toda a comunidade, sem cometer os mesmos erros de quando trabalhamos com projetos open source anteriormente.
