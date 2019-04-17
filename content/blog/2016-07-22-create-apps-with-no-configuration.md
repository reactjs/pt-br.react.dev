---
title: "Crie Apps Sem Configuração"
author: [gaearon]
---

**[Create React App](https://github.com/facebookincubator/create-react-app)** é a nova forma oficialmente suportada para criar aplicativos React de página única. Ele oferece um ambiente moderno sem configurações.

## Começando {#getting-started}

### Instalação {#installation}

Primeiro, instale o pacote global:

```sh
npm install -g create-react-app
```

Node.js 4.x ou superior é nescessário.

### Criando um App {#creating-an-app}

Agora você pode usá-lo para criar um novo app:

```sh
create-react-app hello-world
```

Isso levará algum tempo, já que o npm instala as dependências transitivas, mas, depois de concluído, você verá uma lista de comandos que podem ser executados na pasta criada:

![pasta criada](../images/blog/create-apps-with-no-configuration/created-folder.png)

### Iniciando o Servidor {#starting-the-server}

Execute o `npm start` para iniciar o servidor de desenvolvimento. O navegador será aberto automaticamente com a URL do aplicativo criado.

![compilado com sucesso](../images/blog/create-apps-with-no-configuration/compiled-successfully.png)

Create React App usa tanto o webpack quanto o Babel por de baixo dos panos.
A saída do console é ajustada para ser mínima para ajudá-lo a se concentrar nos problemas:

![não conseguiu compilar](../images/blog/create-apps-with-no-configuration/failed-to-compile.png)

O ESLint também é integrado, de modo que os avisos de lint são exibidos diretamente no console:

![compilado com avisos](../images/blog/create-apps-with-no-configuration/compiled-with-warnings.png)

Nós só escolhemos um pequeno subconjunto de regras de lint que muitas vezes levam a bugs.

### Contruindo para Produção {#building-for-production}

Para construir um pacote otimizado, execute `npm run build`:

![npm run build](../images/blog/create-apps-with-no-configuration/npm-run-build.png)

Ele é minificado, montado corretamente e os recursos incluem hashes de conteúdo para armazenamento em cache.

### Uma Dependência {#one-dependency}

Seu `package.json` contém apenas uma única dependência de compilação e alguns scripts:

```js
{
  "name": "hello-world",
  "dependencies": {
    "react": "^15.2.1",
    "react-dom": "^15.2.1"
  },
  "devDependencies": {
    "react-scripts": "0.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "eject": "react-scripts eject"
  }
}
```

Nós cuidamos de atualizar o Babel, o ESLint e o Webpack para versões compatíveis estáveis, para que você possa atualizar uma única dependência para obter todas elas.

### Configuração Zero {#zero-configuration}

Vale a pena repetir: não há arquivos de configuração ou estruturas de pastas complicadas. A ferramenta gera apenas os arquivos necessários para você criar seu aplicativo.

```
hello-world/
  README.md
  index.html
  favicon.ico
  node_modules/
  package.json
  src/
    App.css
    App.js
    index.css
    index.js
    logo.svg
```

Todas as configurações de criação são pré-configuradas e não podem ser alteradas. Alguns recursos, como testes, estão ausentes no momento. Esta é uma limitação intencional e reconhecemos que pode não funcionar para todos. E isso nos leva ao último ponto.

### Sem Bloqueio {#no-lock-in}

Nós vimos esse recurso pela primeira vez em [Enclave](https://github.com/eanplatter/enclave), e nós adoramos. Nós conversamos com [Ean](https://twitter.com/EanPlatter), e ele estava animado para colaborar conosco. Ele já enviou alguns pull requests!

"Ejetar" permite que você deixe o conforto da configuração do Create React App a qualquer momento. Você executa um único comando e todas as dependências, configurações e scripts de compilação são movidos diretamente para o seu projeto. Neste ponto, você pode personalizar tudo o que quiser, mas efetivamente você está bifurcando nossa configuração e seguindo seu próprio caminho. Se você tem experiência com ferramentas de construção e prefere ajustar tudo ao seu gosto, isso permite usar o Create React App como um gerador geral.

Esperamos que, nos estágios iniciais, muitas pessoas “ejetem” por um motivo ou outro, mas à medida que aprendermos com elas, tornaremos a configuração padrão cada vez mais atraente, sem fornecer configuração.

## Experimente! {#try-it-out}

Você pode encontrar o [**Create React App**](https://github.com/facebookincubator/create-react-app) com instruções adicionais sobre o GitHub.

Este é um experimento, e só o tempo dirá se ele irá se torna uma maneira popular de criar aplicativos React ou desaparecer na obscuridade.

Convidamos você a participar desta experiência. Ajude-nos a construir o conjunto de ferramentas React que mais pessoas podem usar. Estamos sempre [abertos ao feedback](https://github.com/facebookincubator/create-react-app/issues/11).

## A História por Trás {#the-backstory}

O React foi uma das primeiras bibliotecas a adotar o JavaScript transpilado. Como resultado, mesmo que você possa [aprender React sem qualquer ferramenta](https://github.com/facebook/react/blob/3fd582643ef3d222a00a0c756292c15b88f9f83c/examples/basic-jsx/index.html), o ecossistema React se tornou comumente associado com uma esmagadora explosão de ferramentas.

Eric Clemmons chamou esse fenômeno de "[JavaScript fadiga](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4)":

> Em última análise, o problema é que, escolhendo React (e inerentemente JSX), você inadvertidamente optou por um ninho confuso de ferramentas de construção, boilerplate, linters e time-pinks para lidar antes mesmo de criar algo.

É tentador escrever código no ES2015 e no JSX. É sensato usar um bundler para manter a base de código modular e um linter para capturar os erros comuns. É bom ter um servidor de desenvolvimento com reconstruções rápidas e um comando para produzir pacotes otimizados para produção.

Combinar essas ferramentas requer alguma experiência com cada uma delas. Mesmo assim, é muito fácil ser arrastado para combater pequenas incompatibilidades, peerDependencies não-satisfeitas e arquivos de configuração ilegíveis.

Muitas dessas ferramentas são plataformas de plugins e não reconhecem diretamente a existência umas das outras. Eles deixam para os usuários conectá-los juntos. As ferramentas amadurecem e mudam de forma independente, e os tutoriais ficam rapidamente desatualizados.

<blockquote class="twitter-tweet" data-lang="pt"><p lang="pt" dir="ltr"> Marc estava quase pronto para implementar o seu &quot;hello world&quot; Aplicativo React <a href="https://t.co/ptdg4yteF1">pic.twitter.com/ptdg4yteF1</a></p> &mdash; Thomas Fuchs (@thomasfuchs) <a href="https://twitter.com/thomasfuchs/status/708675139253174273"> 12 de março de 2016 </a></blockquote>

Isso não significa que essas ferramentas não sejam ótimas. Para muitos de nós, eles se tornaram indispensáveis, e nós apreciamos muito o esforço de seus mantenedores. Eles já têm muito em seus pratos para se preocupar com o estado do ecossistema React.

Mesmo assim, sabíamos que era frustrante passar dias montando um projeto quando tudo que você queria era aprender React. Nós queríamos consertar isso.

## Poderíamos Corrigir Isso? {#could-we-fix-this}

Nós nos encontramos em um dilema incomum.

Até agora, [nossa estratégia](/docs/design-principles.html#dogfooding) foi apenas liberar o código que estamos usando no Facebook. Isso nos ajudou a garantir que todos os projetos sejam testados em batalha e tenham um escopo e prioridades claramente definidos.

No entanto, ferramentas no Facebook é diferente do que em muitas empresas menores. O linting, o transpilation e o empacotamento são todos gerenciados por poderosos servidores remotos de desenvolvimento, e os engenheiros de produtos não precisam configurá-los. Apesar de desejarmos dar um servidor dedicado a todos os usuários do React, mesmo o Facebook não pode escalar tão bem!

A comunidade React é muito importante para nós. Sabíamos que não poderíamos resolver o problema dentro dos limites da nossa filosofia de código aberto. É por isso que decidimos abrir uma exceção e enviar algo que não usamos, mas achamos que seria útil para a comunidade.

## A Busca por um React <abbr title="Interface de Linha de Comando">CLI</abbr> {#the-quest-for-a-react-abbr-titlecommand-line-interfacecliabbr}

Tendo acabado de assistir a [EmberCamp](http://embercamp.com/) há uma semana, fiquei animado com [Ember CLI](https://ember-cli.com/). Os usuários da Ember têm uma ótima experiência de "introdução" graças a um conjunto de ferramentas unidas sob uma única interface de linha de comando. Eu ouvi comentários semelhantes sobre [Elm Reactor](https://github.com/elm-lang/elm-reactor).

Proporcionar uma experiência coesa e curada é valioso por si só, mesmo que o usuário possa, em teoria, montar essas partes. Kathy Sierra [explica melhor](http://seriouspony.com/blog/2013/7/24/your-app-makes-me-fat):

>If your UX asks the user to make *choices*, for example, even if those choices are both clear and useful, the act of *deciding* is a cognitive drain. And not just *while* they’re deciding... even *after* we choose, an unconscious cognitive background thread is slowly consuming/leaking resources, “Was *that* the right choice?”

Eu nunca tentei escrever uma ferramenta de linha de comando para aplicativos React, e nem [Christopher](https://twitter.com/vjeux). Estávamos conversando sobre o Messenger sobre essa ideia e decidimos trabalhar juntos por uma semana como um projeto de hackathon.

Sabíamos que tais projetos tradicionalmente não tiveram muito sucesso no ecossistema React. Christopher me disse que vários projetos “React CLI” começaram e falharam no Facebook. As ferramentas da comunidade com objetivos similares também existem, mas até agora elas ainda não ganharam tração suficiente.

Ainda assim, decidimos que valeria outra chance. Christopher e eu criamos uma prova de conceito muito difícil no fim de semana, e [Kevin](https://twitter.com/lacker) logo se juntou a nós.

Convidamos alguns membros da comunidade para colaborar conosco e passamos essa semana trabalhando nessa ferramenta. Esperamos que você goste de usá-lo! [Deixe-nos saber o que você pensa.](https://github.com/facebookincubator/create-react-app/issues/11)

Gostaríamos de expressar nossa gratidão a [Max Stoiber](https://twitter.com/mxstbr), [Jonny Buchanan](https://twitter.com/jbscript), [Ean Platter](https://twitter.com/eanplatter), [Tyler McGinnis](https://github.com/tylermcginnis), [Kent C. Dodds](https://github.com/kentcdodds) e [Eric Clemmons](https://twitter.com/ericclemmons) pelo feedback, ideias e contribuições iniciais.