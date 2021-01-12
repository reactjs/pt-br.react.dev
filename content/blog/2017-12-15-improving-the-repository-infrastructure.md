---
title: "Nos Bastidores: Melhorando a Infraestrutura do Repositório"
author: [gaearon, bvaughn]
---

Enquanto trabalhávamos no [React 16](/blog/2017/09/26/react-v16.0.html), reformulamos a estrutura de pastas e muito do ferramental de construção no repositório React. Entre outras coisas, introduzimos projetos como [Rollup](https://rollupjs.org/), [Prettier](https://prettier.io/), e [Google Closure Compiler](https://developers.google.com/closure/compiler/) em nosso fluxo de trabalho. As pessoas frequentemente nos fazem perguntas sobre como usamos essas ferramentas. Neste post, nós gostaríamos de compartilhar algumas das alterações que fizemos em nossa infraestrura de build e teste em 2017 e o que as motivou.

Enquanto essas mudanças nos ajudaram a fazer o React melhor, elas não afetam a maioria do usuários React diretamente. Contudo, esperamos que os posts sobre eles possam ajudar outros autores de bibliotecas a resolver problemas semelhantes. Nossos colaboradores também podem achar essas anotações úteis!

## Formatando Código com Prettier {#formatting-code-with-prettier}

O React foi um dos primeiros grandes repositórios a [adotar completamente](https://github.com/facebook/react/pull/9101) formatação automática de código opinativo com [Prettier](https://prettier.io/). Nossa configuração atual do Prettier consiste em:

* Um script local [`yarn prettier`](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/package.json#L115) que [usa a API Node do Prettier](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/prettier/index.js#L71-L77) para formatar arquivos no lugar. Normalmente, executamos isso antes de confirmar alterações. É rápido porque só verifica o [arquivo alterado desde  que esteja divergente com a branch master remota](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/shared/listChangedFiles.js#L29-L33).
* O script que [roda o Prettier](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/prettier/index.js#L79-L90) como parte dos nossos [checks de integração contínua](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/circleci/test_entry_point.sh#L10). Não tentará sobrescrever os arquivos, mas, em vez disso, falhará a compilação se algum arquivo for diferente da saída Prettier desse arquivo. Isso garante que não possamos mergear um pull request, a menos que ela tenha sido totalmente formatado.

Alguns membros da equipe também configuraram [integrações com o editor](https://prettier.io/docs/en/editors.html). Nossa experiência com o Prettier tem sido fantástica e recomendamos a qualquer equipe que utilize JavaScript.

## Reestruturando o Monorepo {#restructuring-the-monorepo}

Desde que o React foi dividido em pacotes, tem sido um [monorepo](https://danluu.com/monorepo/): um conjunto de pacotes sob o guarda-chuva de um único repositório. Isso facilitou a coordenação de alterações e o compartilhamento das ferramentas, mas nossa estrutura de pastas estava profundamente aninhada e difícil de entender. Não ficou claro quais arquivos pertenciam a qual pacote. Depois de liberar o React 16, decidimos reorganizar completamente a estrutura do repositório. Aqui está como nós fizemos isso.

### Migrating to Yarn Workspaces {#migrating-to-yarn-workspaces}

O gerenciador de pacote Yarn [introduziu um recurso chamado Workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) há alguns meses atrás. Esse recurso permite que você diga ao Yarn onde os pacotes do seu monorepo estão localizados na árvore de fontes. Toda vez que você roda `yarn`, além de instalar suas dependências, ele também configura os links simbólicos que apontam a partir do `node_modules` do seu projeto, para as pastas de origem dos seus pacotes.

Graças aos Workspaces, importações absolutas entre os nossos próprios pacotes (como importar `react` do `react-dom`) "simplismente funcionam" com todas as ferramentas que suportam o mecanismo de resolução do Node. O único problema que encontramos foi no Jest não executando as transformações dentro dos pacotes vinculados, mas nós [encontramos uma correção](https://github.com/facebook/jest/pull/4761), e foi mergeado dentro do Jest.

Para habilitar o Yarn Workspaces, nós adicionamos `"workspaces": ["packages/*"]` para nosso [`package.json`](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/package.json#L4-L6), e movemos todo código dentro do [top-level `packages/*` folders](https://github.com/facebook/react/tree/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages), cada um com o seu próprio arquivo `package.json`.

Cada pacote é estruturado de forma semelhante. Para cada ponto de entrada da API pública, como `react-dom` ou `react-dom/server`, existe um [arquivo](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/react-dom/index.js) na pasta raiz do pacote que reexporta a implementação do [`/src/`](https://github.com/facebook/react/tree/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/react-dom/src) subpasta. A decisão de apontar pontos de entrada para a fonte e não para as versões construídas foi intencional. Tipicamente, nós executamos novamente um subconjunto de testes após cada alteração durante o desenvolvimento. Ter que construir o projeto para executar um teste teria sido proibitivamente lento. Quando publicamos pacotes para o npm, substituímos esses pontos de entrada por arquivos na pasta [`/npm/`](https://github.com/facebook/react/tree/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/react-dom/npm) que apontam para os artefatos da build.

Nem todos os pacotes precisam ser publicados no npm. Por exemplo, mantemos alguns utilitários que são pequenos o suficiente e podem ser duplicados com segurança em um [pseudo-pacote chamado `shared`](https://github.com/facebook/react/tree/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/shared). Nosso bundler está configurado para [apenas tratar `dependências` declaradas no `package.json` como externas](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L326-L329) por isso, felizmente empacota o código do `shared` dentro do `react` e `react-dom` sem deixar nenhuma referências a `shared/` nos artefatos de build. Então você pode usar Yarn Workspaces mesmo que você não planeje publicar pacotes npm!

### Removendo o sistema de módulo personalizado {#removing-the-custom-module-system}

No passado, usamos um sistema de módulo não padronizado chamado "Haste" que permite importar qualquer arquivo de qualquer outro arquivo por sua única `@providesModule` diretiva, não importa onde esteja na árvore. Ele evita o problema de importações relativas profundas com caminhos como `../../../../` e é ótimo para o código do produto. Entretanto, isso dificulta entender as dependências entre pacotes. Nós também tivemos que recorrer a hacks para fazê-lo funcionar com diferentes ferramentas.

Nós decidimos [remover o Haste](https://github.com/facebook/react/pull/11303) e usar ao invés, a resolução Node com importações relativas. Para evitar o problema dos caminhos relativos profundos, nós temos [achatado nossa estrutura de respositório](https://github.com/facebook/react/pull/11304) de modo que vá no máximo um nível no fundo de cada pacote:

```
|-react
|  |-npm
|  |-src
|-react-dom
|  |-npm
|  |-src
|  |  |-client
|  |  |-events
|  |  |-server
|  |  |-shared
```

Neste caminho, os caminhos relativos só podem ter um `./` ou `../` seguido pelo nome do arquivo. Se um pacote precisa importar algo de outro pacote, pode fazê-lo com uma importação absoluta no nível superior do ponto de entrada.

Na prática, nós ainda temos [algumas importações "internas" cross-package](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/react-dom/src/client/ReactDOMFiberComponent.js#L10-L11) que violam este princípio, mas são explícitas e planejamos gradualmente nos livrar delas.

## Compilando Pacotes Simples {#compiling-flat-bundles}

Historicamente, o React era distribuído em dois diferentes formatos: como uma compilação de arquivo único que você pode adicionar com uma tag `<script>` no navegador, e como uma coleção de CommonJS módulos que você pode empacotar como uma ferramenta como webpack ou Browserify. 

Antes do React 16, cada arquivo fonte React tinha um módulo CommonJS correspondente que foi publicado como parte de um pacote npm. Importando `react` ou `react-dom` empacotadores conduzidos para o [ponto de entrada](https://unpkg.com/react@15/index.js) do pacote a partir do qual eles iriam construir uma árvore de dependência com os módulos CommonJS na [pasta interna `lib`](https://unpkg.com/react@15/lib/).

Entretanto, esta abordagem teve várias desvantagens:

* **Era inconsistente.** Diferentes ferramentas produzem pacotes de tamanhos diferentes para código idêntico importando o React, com a diferença indo até 30 kB (antes do gzip).
* **Era ineficiente para usuários de empacotadores.** O código produzido pela maioria dos empacotadores hoje, possuem muitos "código de cola" nos limites do módulo. Mantém os módulos isolados uns dos outros, mas aumenta o tempo de parse, o tamanho do bundle, e o tempo de build.
* **Era ineficiente para usuários de Node.** Ao rodar em Node, com `process.env.NODE_ENV` verifica se antes apenas em tempo de desenvolvimento, o código incorre na sobrecarga de realmente procurar variáveis ​​de ambiente. Isto desacelerou a renderização do React no servidor. Não foi possível armazenar em cache em uma variável porque impediu a eliminação do código morto com Uglify.
* **Quebrou o encapsulamento.** React internals foram expostos tanto no open source (como `react-dom/lib/*` imports) e internamente no Facebook. Foi conveniente a princípio como uma maneira de compartilhar utilitários entre projetos, mas com o tempo tornou-se um fardo de manutenção porque renomear ou alterar os tipos de argumento de funções internas iria quebrar projetos não relacionados.
* **Isso impediu a experimentação.** Não havia como o time do React experimentar com qualquer técnica avançada de compilação. Por exemplo, na teoria, poderíamos poder aplicar o [Google Closure Compiler Advanced](https://developers.google.com/closure/compiler/docs/api-tutorial3) otimizações ou [Prepack](https://prepack.io/) para alguns dos nossos códigos, mas eles são projetados para trabalhar em pacotes completos ao invés de pequenos módulos individuais que usamos para enviar para o npm.

Devido a estas e outras questões, nós mudamos nossa estratégia no React 16. Nós ainda enviamos módulos CommonJS para Node.js e empacotadores, mas em vez de publicar muitos arquivos individuais no pacote npm, nós publicamos apenas dois bundles CommonJS por ponto de entrada.

Por exemplo, quando você importa o `react` com React 16, o empacotador [encontra o ponto de entrada](https://unpkg.com/react@16/index.js) que apenas reexporta um dos dois arquivos:

```js
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
```

Em todos os pacotes fornecidos pelo React, a [pasta `cjs`](https://unpkg.com/react@16/cjs/) (abreviatura de "CommonJS") contém um pacote pré-construído de desenvolvimento e um de produção para cada ponto de entrada. 

Por exemplo, [`react.development.js`](https://unpkg.com/react@16/cjs/react.development.js) é a versão destinada ao desenvolvimento. É legível e inclui comentários. Por outro lado, [`react.production.min.js`](https://unpkg.com/react@16/cjs/react.production.min.js) foi reduzido e otimizado antes de ser publicado no npm.

Observe como essa é essencialmente a mesma estratégia que usamos para as compilações de navegador de arquivo único (que agora residem no [diretório `umd`](https://unpkg.com/react@16/umd/), abreviatura para [Universal Module Definition](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)). Agora apenas aplicamos a mesma estratégia ao CommonJS builds também.

### Migrando para o Rollup {#migrating-to-rollup}

Apenas compilando módulos CommonJS em pacotes de arquivos únivos não resolve todos os problemas acima. As vitórias realmente significativas vieram de [migrando nosso sistema de build](https://github.com/facebook/react/pull/9327) do Browserify para [Rollup](https://rollupjs.org/).

[O Rollup foi projetado com bibliotecas em vez de aplicativos em mente](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c), e isso é um ajuste perfeito para o caso de uso do React. Isso resolve bem um problema: como combinar múltiplos módulos em um arquivo simples com o mínimo de código lixo no meio. Para alcançar isso, em vez de transformar módulos em funções assim como muitos outros empacotadores, coloca-se todo o código no mesmo escopo, e renomeia-se as variáveis para que não entrem em conflito. Isso produz código que é mais fácil para a engine do Javascript analisar, para um ser humano ler, e para um minificador otimizar.

O Rollup atualmente não suporta alguns recursos que são importantes para builders de aplicações, como code splitting. No entanto, não visa substituir ferramentas como o webpack que faz um ótimo trabalho nisso.

Você pode encontrar nossa configuração de build do Rollup [aqui](https://github.com/facebook/react/blob/8ec146c38ee4f4c84b6ecf59f52de3371224e8bd/scripts/rollup/build.js#L336-L362), com uma [lista de plugins que utilizamos atualmente](https://github.com/facebook/react/blob/8ec146c38ee4f4c84b6ecf59f52de3371224e8bd/scripts/rollup/build.js#L196-L273).

### Migrando para o compilador do Google Closure {#migrating-to-google-closure-compiler}

Depois de migrar para pacotes planos, nós [começamos](https://github.com/facebook/react/pull/10236) a usar [a versão JavaScript do compilador Google Closure](https://github.com/google/closure-compiler-js) nesse modo "simples". Em nossa experiência, mesmo com as otimizações avançadas desativadas, ainda fornecia uma vantagem significativa sobre o Uglify, pois foi capaz de eliminar melhor códigos mortos e automaticamente pequenas funções embutidas quando apropriado.

No início, nós poderíamos apenas utilizar o compilador do Google Closure para os pacotes React que nós enviamos em código aberto. No Facebook, nós ainda precisávamos que os pacotes de check-in não fossem minificados para que pudéssemos simbolizar quebras do React em produção com nossas ferramentas de relatórios de erros. Nós acabamos contribuindo [uma flag](https://github.com/google/closure-compiler/pull/2707) que desabilita completamente o passo de renomeação do compilador. Isso nos permite aplicar outras otimizações como funções embutidas, mas mantém o código totalmente legível para as compilações Facebook-specific do React. Para melhorar a legibilidade do output, nós [também formatamos esse build customizado usando Prettier](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L249-L250). Curiosamente, executar o Prettier nos pacotes de produção enquanto depura o processo de compilação é uma ótima maneira de encontrar código desnecessário nos pacotes!

Atualmente, todos os pacotes de produção do React [rodam através do compilador do Google Closure em um modo simples](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L235-L248), e nós podemos considerar a habilitação de otimizações avançadas no futuro.

### Proteção Contra a Eliminação de Códigos Mortos Fracos {#protecting-against-weak-dead-code-elimination}

Enquanto nós utilizamos uma solução eficiente de [eliminação de códigos mortos](https://en.wikipedia.org/wiki/Dead_code_elimination) no React em si, não podemos fazer muitas suposições sobre as ferramentas utilizadas pelos consumidores do React.

Tipicamente, quando você [configura um pacote para produção](/docs/optimizing-performance.html#use-the-production-build) , você precisa informá-lo para substituir `process.env.NODE_ENV` com a string literal de `"production"`. Esse processo às vezes é chamado de "envification". Considere esse código:

```js
if (process.env.NODE_ENV !== "production") {
  // development-only code
}
```
Depois do processo de envification, essa condição sempre será `false`, e pode ser completamente eliminado pela maioria dos minificadores:

```js
if ("production" !== "production") {
  // development-only code
}
```

Entretanto, se o pacote estiver configurado incorretamente, você pode acidentalmente enviar código de desenvolvimento para produção. Nós não podemos prevenir isso completamente, mas nós tomamos algumas medidas para mitigar os casos comuns quando isso acontece.

#### Protegendo Contra a Envificação Tardia {#protecting-against-late-envification}

Como mencionado acima, nossos pontos de entrada agora se parecem com isso:

```js
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
```

Entretanto, alguns processos de empacotadores `requerem` antes uma envificação. Nesse caso, mesmo se o bloco `else` nunca executa, o arquivo `cjs/react.development.js` ainda é empacotado.

Para prevenir isso, nós também [embrulhamos todo o conteúdo](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/rollup/wrappers.js#L65-L69) do pacote de desenvolvimento em outra verificação `process.env.NODE_ENV` dentro de `cjs/react.development.js` no pacote em si:

```js
'use strict';

if (process.env.NODE_ENV !== "production") {
  (function() {
    // bundle code
  })();
}
```

Dessa forma, mesmo que o pacote da aplicação inclua ambas as versões de desenvolvimento e de produção do arquivo, a versão do desenvolvimento estará vazia após a envificação.

O wrapper adicional [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) é necessário porque algumas declarações (e.g. funções) não podem ser colocadas dentro de uma declaração `if` em JavaScript.

#### Detectando Eliminação de Código Morto Desconfigurada {#detecting-misconfigured-dead-code-elimination}

Apesar de [a situação esteja mudando](https://twitter.com/iamakulov/status/941336777188696066), muitos empacotadores populares ainda não forçam os usuários a especificar o modo de desenvolvimento ou modo de produção. Nesse caso `process.env.NODE_ENV` é tipicamente fornecido por um polyfill de tempo de execução, mas a eliminação do código morto não funciona.

Não podemos prevenir completamente os usuários do React a configurarem incorretamente seus empacotadores, mas introduzimos algumas verificações adicionais para isso no [React DevTools](https://github.com/facebook/react-devtools). 

Se o pacote de desenvolvimento for executado, [React DOM reporta isso para o React DevTools](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/packages/react-dom/src/client/ReactDOM.js#L1333-L1335):

<br>

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Há também mais um cenário ruim. Algumas vezes, `process.env.NODE_ENV` é setado para `"production"` em tempo de execução em vez de no tempo de build. É assim que deve funcionar no Node.js, mas isso é ruim para os builds do lado do client porque o código de desenvolvimento desnecessário é empacotado apesar de nunca ser executado. Isso é mais difícil de detectar mas encontramos uma heurística que funciona bem na maioria dos casos e não parece produzir falsos positivos.

Podemos escrever uma função que contenha uma [branch apenas de desenvolvimento](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/packages/react-dom/npm/index.js#L11-L20) com uma string literal arbitrária. Então, se `process.env.NODE_ENV` é setado para `"production"`, podemos [chamar `toString()` nessa função](https://github.com/facebook/react-devtools/blob/b370497ba6e873c63479408f11d784095523a630/backend/installGlobalHook.js#L143) e verificar que a string literal na branch de apenas desenvolvimento foi retirada. Se ainda estiver lá, a eliminação do código morto não funcionou, e precisamos avisar o desenvolvedor. Desde que os desenvolvedores podem não notar os avisos do React DevTools em um website de produção, nós também [lançamos um erro dentro de `setTimeout`](https://github.com/facebook/react-devtools/blob/b370497ba6e873c63479408f11d784095523a630/backend/installGlobalHook.js#L153-L160) do React DevTools na esperança de que seja captado pela análise de erros.

Reconhecemos que essa abordagem é um tanto frágil. O método `toString()` não é confiável e pode mudar seu comportamento em futuras versões do navegador. É por isso que colocamos essa lógica no próprio React DevTools em vez de no React. Isso nos permite removê-lo posteriormente, caso se torne problemático. Também avisamos apenas se *encontramos* a string literal especial, e não se *não* a encontramos. Desta forma, se a saída `toString()` se tornar opaca, ou for substituída, o aviso simplesmente não disparará.

## Perceber erros antecipadamente {#catching-mistakes-early}

Queremos detectar bugs o mais cedo possível. No entanto, mesmo com nossa ampla cobertura de teste, ocasionalmente cometemos um erro crasso. Fizemos várias alterações em nossa infraestrutura de construção e teste este ano para torná-la mais difícil de bagunçar.

### Migrando para os ES Modules {#migrating-to-es-modules}

Com CommonJS `require()` e `module.exports`, é fácil importar uma função que realmente não existe e não perceber isso até que você a chame. No entanto, ferramentas como Rollup, que oferecem suporte nativo à sintaxe de [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) e  [`export`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) falham o build se você digitar incorretamente uma importação nomeada. Após lançar o React 16, [nós convertemos todo o código-fonte do React](https://github.com/facebook/react/pull/11389) para a sintaxe do ES Modules.

Isso não apenas forneceu alguma proteção extra, mas também ajudou a melhorar o tamanho da construção. Muitos módulos React exportam apenas funções utilitárias, mas o CommonJS nos forçou a agrupá-los em um objeto. Transformando essas funções utilitárias em exportações nomeadas e eliminando os objetos que as continham, permitimos que o Rollup as coloque no escopo de nível superior e, assim, deixamos o minificador alterar seus nomes nas compilações de produção.

Por enquanto, decidimos converter apenas o código-fonte para ES Modules, mas não os testes. Usamos utilitários poderosos como `jest.resetModules()` e queremos manter um controle mais rígido sobre quando os módulos são inicializados nos testes. Para consumir os ES Modules de nossos testes, habilitamos o [Babel CommonJS transform](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/jest/preprocessor.js#L28-L29), mas apenas para o ambiente de teste.

### Executando testes no modo de produção {#running-tests-in-production-mode}

Historicamente, executamos todos os testes em um ambiente de desenvolvimento. Isso nos permitiu confirmar sobre as mensagens de advertência produzidas pelo React e parecia fazer sentido geral. No entanto, embora tentemos manter as diferenças entre os caminhos do código de desenvolvimento e produção, ocasionalmente cometeríamos um erro em branches de código somente de produção que não foram cobertos pelos testes e causaríamos um problema no Facebook.

Para resolver esse problema, nós adicionamos um novo script [`yarn test-prod`](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/package.json#L110) que é executado em CI para cada pull request, e [executa todos os casos de teste do React em modo de produção](https://github.com/facebook/react/pull/11616). Envelopamos todas as confirmações sobre mensagens de aviso em blocos condicionais somente de desenvolvimento em todos os testes, para que eles ainda possam verificar o restante do comportamento esperado em ambos os ambientes. Uma vez que temos um Babel transform personalizado que substitui as mensagens de erro de produção com os [error codes](/blog/2016/07/11/introducing-reacts-error-code-system.html), nós também adicionamos uma [transformação reversa](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/jest/setupTests.js#L91-L126) como parte da execução do teste de produção.

### Usando API pública em testes {#using-public-api-in-tests}

Quando nós estávamos [rescrevendo o React reconcilier](https://code.facebook.com/posts/1716776591680069/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/), reconhecemos a importância de escrever testes na API pública, em vez de módulos internos. Se o teste for escrito na API pública, fica claro o que está sendo testado da perspectiva do usuário e você pode executá-lo mesmo se reescrever a implementação do zero.

Entramos em contato com a maravilhosa comunidade do React [pedindo ajuda](https://github.com/facebook/react/issues/11299) para converter os testes restantes para usar a API pública. Quase todos os testes estão convertidos agora! O processo não foi fácil. Às vezes, um teste unitário apenas chama um método interno e é difícil descobrir o que o comportamento observável do ponto de vista do usuário deveria ser testado. Encontramos algumas estratégias que ajudaram nisso. A primeira coisa que tentaríamos é encontrar o histórico do git de quando o teste foi adicionado e encontrar pistas no problema e na descrição do pull request. Frequentemente, eles conteriam casos de reprodução que acabaram sendo mais valiosos do que os testes unitários originais! Uma boa maneira de verificar a suposição é tentar comentar linhas individuais no código-fonte que está sendo testado. Se o teste falhar, sabemos com certeza que ele estressa o caminho do código fornecido.

Gostaríamos de agradecer profundamente a [todos que contribuíram para este esforço](https://github.com/facebook/react/issues?q=is%3Apr+11299+is%3Aclosed).

### Executando testes em bundles compilados {#running-tests-on-compiled-bundles}

Há também mais um benefício em escrever testes na API pública: agora podemos [executá-los nos bundles compilados](https://github.com/facebook/react/pull/11633).

Isso nos ajuda a garantir que ferramentas como Babel, Rollup e Google Closure Compiler não introduzam regressões. Isso também abre a porta para futuras otimizações mais agressivas, pois podemos ter certeza de que o React ainda se comportará exatamente como esperado depois delas.

Para implementar isso, nós criamos uma [segunda configuração no Jest](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/jest/config.build.js). Ela sobrescreve nossa configuração inicial mas aponta `react`, `react-dom`, e outros pontos de entrada para a pasta `/build/packages/`. Essa pasta não contém qualquer código fonte do React, e reflete o que é publicado no npm. Ela é preenchida após a execução do `yarn build`.

Isso nos permite executar exatamente os mesmos testes que normalmente executamos na source, mas os executa usando bundles do React pré-construídos de desenvolvimento e produção produzidos com Rollup e Google Closure Compiler.

Ao contrário da execução de teste normal, a execução de teste de pacote depende dos produtos de build, portanto, não é excelente para iteração rápida. No entanto, ela ainda é executada no servidor de CI, portanto, se algo quebrar, o teste será exibido como falho e saberemos que não é seguro executar o merge com a master.

Ainda existem alguns arquivos de teste que intencionalmente não executamos nos pacotes. Às vezes, nós queremos contruir um mock de um módulo interno ou substituir uma feature flag que ainda não foi exposta ao público. Para esses casos, colocamos um arquivo de teste na lista negra, renomeando-o de `MyModule-test.js` para` MyModule-test.internal.js`.

Atualmente, mais de 93% dos 2.650 testes React são executados nos pacotes compilados

### Utilizando Lint nos Pacotes Compilados {#linting-compiled-bundles}

Além de utilizar o lint no nosso código-fonte, executamos um conjunto muito mais limitado de regras linting (de fato, [apenas duas delas](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/validate/eslintrc.cjs.js#L26-L27)) nos pacotes compilados. Isso nos dá uma camada extra de proteção contra regressões nas ferramentas subjacentes e [garante](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/validate/eslintrc.cjs.js#L22) que os pacotes não usem nenhum recurso de linguagem que não seja compatível com navegadores mais antigos.

### Simulando a Publicação de Pacotes {#simulating-package-publishing}

Mesmo rodar os testes nos pacotes buildados não é suficiente para evitar o envio de uma atualização quebrada. Por exemplo, usamos o campo `files` em nossos arquivos` package.json` para especificar uma lista de permissões de pastas e arquivos que devem ser publicados no npm. No entanto, é fácil adicionar um ponto de entrada a um pacote, mas esqueça de adicioná-lo à lista de permissões. Mesmo os testes de pacote seriam aprovados, mas após a publicação, o novo ponto de entrada estaria faltando.

Para evitar situações como essa, agora estamos simulando a publicação do npm, [executando `npm pack` e imediatamente descompactando o arquivo](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/packaging.js#L129-L134) depois do build. Assim como o `npm publish`, este comando filtra qualquer coisa que não esteja na lista branca de `files`. Com essa abordagem, se esquecêssemos de adicionar um ponto de entrada à lista, ele estaria faltando na pasta de construção e os testes de pacote que dependem dele falhariam.

### Criando Ferramentas de Teste Manual {#creating-manual-test-fixtures}

Nossos testes unitários são executados apenas no ambiente Node, mas não nos navegadores. Esta foi uma decisão intencional porque as ferramentas de teste baseadas em navegador eram instáveis em nossa experiência e não detectaram muitos problemas de qualquer maneira.

Poderíamos nos safar com isso porque o código que toca o DOM é consolidado em alguns arquivos e não muda com tanta frequência. Todas as semanas, atualizamos a base de código do Facebook.com para o último commit do React no master. No Facebook, usamos um conjunto interno de testes do [WebDriver](http://www.seleniumhq.org/projects/webdriver/) para fluxos de trabalho de produtos críticos, e estes capturam algumas regressões. As atualizações do React são entregues primeiro aos funcionários, então bugs graves são relatados imediatamente antes de atingirem dois bilhões de usuários.

Ainda assim, era difícil revisar as alterações relacionadas ao DOM e, ocasionalmente, cometíamos erros. Em particular, era difícil lembrar todos os casos extremos que o código teve que tratar, por que eles foram adicionados e quando era seguro removê-los. Nós consideramos adicionar alguns testes automatizados que são executados no navegador, mas não queríamos diminuir o ciclo de desenvolvimento e lidar com um CI frágil. Além disso, os testes automatizados nem sempre detectam problemas de DOM. Por exemplo, um valor de entrada exibido pelo navegador pode não corresponder ao que relata como uma propriedade DOM.

Nós conversamos sobre isso com [Brandon Dail](https://github.com/aweary), [Jason Quense](https://github.com/jquense), e [Nathan Hunzaker](https://github.com/nhunzaker). Eles estavam enviando patches substanciais para o React DOM, mas ficaram frustrados porque não os revisamos oportunamente. Decidimos dar a eles acesso de commit, mas pedimos que [criassem um conjunto de testes manuais](https://github.com/facebook/react/pull/8589) para áreas relacionadas ao DOM, como gerenciamento de entrada. O conjunto inicial de ferramentas manuais [continuou crescendo](https://github.com/facebook/react/commits/master/fixtures/dom) durante o ano.

Esses acessórios são implementados como um aplicativo React localizado em [`fixtures / dom`](https://github.com/facebook/react/tree/d906de7f602df810c38aa622c83023228b047db6/fixtures/dom). Adicionar um acessório envolve escrever um componente React com uma descrição do comportamento esperado e links para os problemas apropriados e peculiaridades do navegador, como [neste exemplo](https://github.com/facebook/react/pull/11760):

<img src="https://user-images.githubusercontent.com/590904/33555298-dd52fb4e-d8cd-11e7-80e9-8369538eb633.png" style="max-width:100%" alt="DOM fixture example">

O aplicativo de fixture permite que você escolha uma versão do React (local ou uma das versões publicadas) que é útil para comparar o comportamento antes e depois das alterações. Quando mudamos o comportamento relacionado à forma como interagimos com o DOM, podemos verificar que ele não regrediu, passando pelos acessórios relacionados em diferentes navegadores.

In some cases, a change proved to be so complex that it necessitated a standalone purpose-built fixture to verify it. For example, the [DOM attribute handling in React 16](/blog/2017/09/08/dom-attributes-in-react-16.html) was very hard to pull off with confidence at first. We kept discovering different edge cases, and almost gave up on doing it in time for the React 16 release. However, then we've built an ["attribute table" fixture](https://github.com/facebook/react/tree/d906de7f602df810c38aa622c83023228b047db6/fixtures/attribute-behavior) that renders all supported attributes and their misspellings with previous and next version of React, and displays the differences. It took a few iterations (the key insight was to group attributes with similar behavior together) but it ultimately allowed us to fix all major issues in just a few days.

<br>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We went through the table to vet the new behavior for every case (and discovered some old bugs too) <a href="https://t.co/cmF2qnK9Q9">pic.twitter.com/cmF2qnK9Q9</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/906244378066345984?ref_src=twsrc%5Etfw">September 8, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Going through the fixtures is still a lot of work, and we are considering automating some of it. Still, the fixture app is invaluable even as documentation for the existing behavior and all the edge cases and browser bugs that React currently handles. Having it gives us confidence in making significant changes to the logic without breaking important use cases. Another improvement we're considering is to have a GitHub bot build and deploy the fixtures automatically for every pull request that touches the relevant files so anyone can help with browser testing.

### Preventing Infinite Loops {#preventing-infinite-loops}

The React 16 codebase contains many `while` loops. They let us avoid the dreaded deep stack traces that occurred with earlier versions of React, but can make development of React really difficult. Every time there is a mistake in an exit condition our tests would just hang, and it took a while to figure out which of the loops is causing the issue.

Inspired by the [strategy adopted by Repl.it](https://repl.it/site/blog/infinite-loops), we have added a [Babel plugin that prevents infinite loops](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/babel/transform-prevent-infinite-loops.js) in the test environment. If some loop continues for more than the maximum allowed number of iterations, we throw an error and immediately fail it so that Jest can display where exactly this happened.

This approach has a pitfall. If an error thrown from the Babel plugin gets caught and ignored up the call stack, the test will pass even though it has an infinite loop. This is really, really bad. To solve this problem, we [set a global field](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/babel/transform-prevent-infinite-loops.js#L26-L30) before throwing the error. Then, after every test run, we [rethrow that error if the global field has been set](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/jest/setupTests.js#L42-L56). This way any infinite loop will cause a test failure, no matter whether the error from the Babel plugin was caught or not.

## Customizing the Build {#customizing-the-build}

There were a few things that we had to fine-tune after introducing our new build process. It took us a while to figure them out, but we're moderately happy with the solutions that we arrived at.

### Dead Code Elimination {#dead-code-elimination}

The combination of Rollup and Google Closure Compiler already gets us pretty far in terms of stripping development-only code in production bundles. We [replace](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L223-L226) the `__DEV__` literal with a boolean constant during the build, and both Rollup together and Google Closure Compiler can strip out the `if (false) {}` code branches and even some more sophisticated patterns. However, there is one particularly nasty case:

```js
import warning from 'fbjs/lib/warning';

if (__DEV__) {
  warning(false, 'Blimey!');
}
```

This pattern is very common in the React source code. However `fbjs/lib/warning` is an external import that isn't being bundled by Rollup for the CommonJS bundle. Therefore, even if `warning()` call ends up being removed, Rollup doesn't know whether it's safe to remove to the import itself. What if the module performs a side effect during initialization? Then removing it would not be safe.

To solve this problem, we use the [`treeshake.pureExternalModules` Rollup option](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L338-L340) which takes an array of modules that we can guarantee don't have side effects. This lets Rollup know that an import to `fbjs/lib/warning` is safe to completely strip out if its value is not being used. However, if it *is* being used (e.g. if we decide to add warnings in production), the import will be preserved. That's why this approach is safer than replacing modules with empty shims.

When we optimize something, we need to ensure it doesn't regress in the future. What if somebody introduces a new development-only import of an external module, and not realize they also need to add it to `pureExternalModules`? Rollup prints a warning in such cases but we've [decided to fail the build completely](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/build.js#L395-L412) instead. This forces the person adding a new external development-only import to [explicitly specify whether it has side effects or not](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/modules.js#L10-L22) every time.

### Forking Modules {#forking-modules}

In some cases, different bundles need to contain slightly different code. For example, React Native bundles have a different error handling mechanism that shows a redbox instead of printing a message to the console. However, it can be very inconvenient to thread these differences all the way through the calling modules.

Problems like this are often solved with runtime configuration. However, sometimes it is impossible: for example, the React DOM bundles shouldn't even attempt to import the React Native redbox helpers. It is also unfortunate to bundle the code that never gets used in a particular environment.

Another solution is to use dynamic dependency injection. However, it often produces code that is hard to understand, and may cause cyclical dependencies. It also defies some optimization opportunities.

From the code point of view, ideally we just want to "redirect" a module to its different "forks" for specific bundles. The "forks" have the exact same API as the original modules, but do something different. We found this mental model very intuitive, and [created a fork configuration file](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/forks.js) that specifies how the original modules map to their forks, and the conditions under which this should happen.

For example, this fork config entry specifies different [feature flags](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/shared/ReactFeatureFlags.js) for different bundles:

```js
'shared/ReactFeatureFlags': (bundleType, entry) => {
  switch (entry) {
    case 'react-native-renderer':
      return 'shared/forks/ReactFeatureFlags.native.js';
    case 'react-cs-renderer':
      return 'shared/forks/ReactFeatureFlags.native-cs.js';
    default:
      switch (bundleType) {
        case FB_DEV:
        case FB_PROD:
          return 'shared/forks/ReactFeatureFlags.www.js';
      }
  }
  return null;
},
```

During the build, [our custom Rollup plugin](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/scripts/rollup/plugins/use-forks-plugin.js#L40) replaces modules with their forks if the conditions have matched. Since both the original modules and the forks are written as ES Modules, Rollup and Google Closure Compiler can inline constants like numbers or booleans, and thus efficiently eliminate dead code for disabled feature flags. In tests, when necessary, we [use `jest.mock()`](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/react-cs-renderer/src/__tests__/ReactNativeCS-test.internal.js#L15-L17) to point the module to the appropriate forked version.

As a bonus, we might want to verify that the export types of the original modules match the export types of the forks exactly. We can use a [slightly odd but totally working Flow trick](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/shared/forks/ReactFeatureFlags.native.js#L32-L36) to accomplish this:

```js
import typeof * as FeatureFlagsType from 'shared/ReactFeatureFlags';
import typeof * as FeatureFlagsShimType from './ReactFeatureFlags.native';
type Check<_X, Y: _X, X: Y = _X> = null;
(null: Check<FeatureFlagsShimType, FeatureFlagsType>);
```

This works by essentially forcing Flow to verify that two types are assignable to each other (and thus are equivalent). Now if we modify the exports of either the original module or the fork without changing the other file, the type check will fail. This might be a little goofy but we found this helpful in practice.

To conclude this section, it is important to note that you can't specify your own module forks if you consume React from npm. This is intentional because none of these files are public API, and they are not covered by the [semver](https://semver.org/) guarantees. However, you are always welcome to build React from master or even fork it if you don't mind the instability and the risk of divergence. We hope that this writeup was still helpful in documenting one possible approach to targeting different environments from a single JavaScript library.

### Tracking Bundle Size {#tracking-bundle-size}

As a final build step, we now [record build sizes for all bundles](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/rollup/build.js#L264-L272) and write them to a file that [looks like this](https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/rollup/results.json). When you run `yarn build`, it prints a table with the results:

<br>

<img src="https://user-images.githubusercontent.com/1519870/28427900-80487dbc-6d6f-11e7-828d-1b594bd1ddb5.png" style="max-width:100%" alt="Build results after running GCC">

*(It doesn't always look as good as this. This was the commit that migrated React from Uglify to Google Closure Compiler.)*

Keeping the file sizes committed for everyone to see was helpful for tracking size changes and motivating people to find optimization opportunities.

We haven't been entirely happy with this strategy because the JSON file often causes merge conflicts on larger branches. Updating it is also not currently enforced so it gets out of date. In the future, we're considering integrating a bot that would comment on pull requests with the size changes.

## Simplifying the Release Process {#simplifying-the-release-process}

We like to release updates to the open source community often. Unfortunately, the old process of creating a release was slow and would typically take an entire day. After some changes to this process, we're now able to do a full release in less than an hour. Here's what we changed.

### Branching Strategy {#branching-strategy}

Most of the time spent in the old release process was due to our branching strategy. The `master` branch was assumed to be unstable and would often contain breaking changes. Releases were done from a `stable` branch, and changes were manually cherry-picked into this branch prior to a release. We had [tooling to help automate](https://github.com/facebook/react/pull/7330) some of this process, but it was still [pretty complicated to use](https://github.com/facebook/react/blob/b5a2a1349d6e804d534f673612357c0be7e1d701/scripts/release-manager/Readme.md).

As of version 16, we now release from the `master` branch. Experimental features and breaking changes are allowed, but must be hidden behind [feature flags](https://github.com/facebook/react/blob/cc52e06b490e0dc2482b345aa5d0d65fae931095/packages/shared/ReactFeatureFlags.js) so they can be removed during the build process. The new flat bundles and dead code elimination make it possible for us to do this without fear of leaking unwanted code into open source builds.

### Automated Scripts {#automated-scripts}

After changing to a stable `master`, we created a new [release process checklist](https://github.com/facebook/react/issues/10620). Although much simpler than the previous process, this still involved dozens of steps and forgetting one could result in a broken release.

To address this, we created a new [automated release process](https://github.com/facebook/react/pull/11223) that is [much easier to use](https://github.com/facebook/react/tree/master/scripts/release#react-release-script) and has several built-in checks to ensure that we release a working build. The new process is split into two steps: _build_ and _publish_. Here's what it looks like the first time you run it:

![Release Script overview](../images/blog/release-script-build-overview.png)

The _build_ step does most of the work- verifying permissions, running tests, and checking CI status. Once it finishes, it prints a reminder to update the CHANGELOG and to verify the bundle using the [manual fixtures](#creating-manual-test-fixtures) described above.

![Release Script build confirmation screen](../images/blog/release-script-build-confirmation.png)

All that's left is to tag and publish the release to NPM using the _publish_ script.

![Release Script publish confirmation screen](../images/blog/release-script-publish-confirmation.png)

(You may have noticed a `--dry` flag in the screenshots above. This flag allows us to run a release, end-to-end, without actually publishing to NPM. This is useful when working on the release script itself.)

## In Conclusion {#in-conclusion}

Did this post inspire you to try some of these ideas in your own projects? We certainly hope so! If you have other ideas about how React build, test, or contribution workflow could be improved, please let us know on [our issue tracker](https://github.com/facebook/react/issues).

You can find the related issues by the [build infrastructure label](https://github.com/facebook/react/labels/Component%3A%20Build%20Infrastructure). These are often great first contribution opportunities!

## Acknowledgements {#acknowledgements}

We would like to thank:

* [Rich Harris](https://github.com/Rich-Harris) and [Lukas Taegert](https://github.com/lukastaegert) for maintaining Rollup and helping us integrate it.
* [Dimitris Vardoulakis](https://github.com/dimvar), [Chad Killingsworth](https://github.com/ChadKillingsworth), and [Tyler Breisacher](https://github.com/MatrixFrog) for their work on Google Closure Compiler and timely advice.
* [Adrian Carolli](https://github.com/watadarkstar), [Adams Au](https://github.com/rivenhk), [Alex Cordeiro](https://github.com/accordeiro), [Jordan Tepper](https://github.com/HeroProtagonist), [Johnson Shi](https://github.com/sjy), [Soo Jae Hwang](https://github.com/misoguy), [Joe Lim](https://github.com/xjlim), [Yu Tian](https://github.com/yu-tian113), and others for helping prototype and implement some of these and other improvements.
* [Anushree Subramani](https://github.com/anushreesubramani), [Abid Uzair](https://github.com/abiduzz420), [Sotiris Kiritsis](https://github.com/skiritsis), [Tim Jacobi](https://github.com/timjacobi), [Anton Arboleda](https://github.com/aarboleda1), [Jeremias Menichelli](https://github.com/jeremenichelli), [Audy Tanudjaja](https://github.com/audyodi), [Gordon Dent](https://github.com/gordyd), [Iacami Gevaerd
](https://github.com/enapupe), [Lucas Lentz](https://github.com/sadpandabear), [Jonathan Silvestri](https://github.com/silvestrijonathan), [Mike Wilcox](https://github.com/mjw56), [Bernardo Smaniotto](https://github.com/smaniotto), [Douglas Gimli](https://github.com/douglasgimli), [Ethan Arrowood](https://github.com/ethan-arrowood), and others for their help porting the React test suite to use the public API.