---
title: Adicione o React a um site
---

<Intro>

React foi projetado desde o início para adoção gradual e você pode usar o React o quanto precisar, sendo pouco ou muito. Quer você esteja trabalhando com micro-frontends, um sistema existente, ou experimentando o React, você pode começar adicionando componentes interativos do React a uma página HTML com apenas algumas linhas de código - e nenhuma ferramenta de build!

</Intro>

## Adicione o React em Um Minuto {/*add-react-in-one-minute*/}

Você pode adicionar um componente React em uma página HTML existente em menos de um minuto. Você pode usar em seu próprio site ou [em um arquivo HTML vazio](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)—tudo o que você precisa é uma conexão de internet e um editor de texto como o Notepad (ou o VSCode-verifique nosso guia sobre [como configurar](/learn/editor-setup/))!

### Passo 1: Adicionar um elemento ao HTML {/*step-1-add-an-element-to-the-html*/}

Primeiramente, abra a página HTML que você deseja alterar. Adicione uma tag `<div>` com um `id` único para marcar o local onde você deseja exibir algo com o React.

Você pode colocar um elemento "contêiner" como esta `<div>` em qualquer lugar dentro da tag `<body>`. O React irá substituir qualquer conteúdo dentro desses elementos HTML, então eles geralmente estão vazios. Você pode ter quantos desses elementos HTML você precisar em uma página.

```html {3}
<!-- ... HTML existente ... -->

<div id="component-goes-here"></div>

<!-- ... HTML existente ... -->
```

### Passo 2: Adicionar as Tags Script {/*step-2-add-the-script-tags*/}

Na página HTML, adicione três tags `<script>` em sua página HTML logo antes do fechamento da tag `</body>`:

- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) carrega o código principal do React
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) permite ao React renderizar elementos HTML no [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **like_button.js** é aqui que você vai adicionar o código de seu componente no passo 3!

<Gotcha>

Antes de realizar o deploy do seu site para produção, substitua "development.js" por "production.min.js".

</Gotcha>

```html
  <!-- final da página -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### Passo 3: Criar um Componente React {/*step-3-create-a-react-component*/}

Crie um arquivo com o nome `like_button.js` na pasta de sua página HTML, adicione esse trecho de código, e salve o arquivo. Esse código define um componente React chamando `LikeButton`. [Você pode aprender mais sobre criação de componentes em nossos tutoriais.](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### Passo 4: Adicionar seu Componente React a página {/*step-4-add-your-react-component-to-the-page*/}

Por último, adicione duas linhas ao final de **like_button.js**. Essas duas linhas de código irão procurar a tag `<div>` que você adicionou em seu HTML no primeiro passo e então exibir o componente React do botão "Curtir" nela.

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**Parabéns! Você acaba de renderizar seu primeiro componente em seu website!**

- [Ver o código fonte do exemplo completo](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Baixe o exemplo completo (2KB comprimido)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### Você pode reutilizar componentes! {/*you-can-reuse-components*/}

Você pode querer exibir um componente React em diversos lugares na mesma página HTML. Isso é muito útil quando diversas partes da página feitas com React são isoladas uma da outra. Você pode fazer isso chamando `ReactDOM.render()` diversas vezes com vários elementos de contêiner.

1. No arquivo **index.html**, adicione um elemento contêiner extra `<div id="component-goes-here-too"></div>`.
2. No arquivo **like_button.js**, adicione um `ReactDOM.render()` extra para o novo elemento contêiner:

```js {6,7,8,9}
ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here')
);

ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here-too')
);
```

Veja [um exemplo que exibe o botão "Curtir" três vezes e passa alguns dados para eles](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### Passo 5: Minificar o JavaScript para produção {/*step-5-minify-javascript-for-production*/}

JavaScript não minificado pode aumentar consideravelmente o tempo de carregamento das páginas para seus usuários. Antes de realizar o deploy de seu website para produção, é uma boa ideia minificar o código.

- **Se você não tiver um passo de minificação** para seus códigos, [aqui está uma maneira de configurar](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Se você já minifica** o código de sua aplicação, seu site vai estar pronto para produção se você garantir que o HTML que irá para a versão de deploy carregue as versões do react que terminam em `production.min.js` assim como:

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## Experimente React com JSX {/*try-react-with-jsx*/}

O exemplo abaixo utiliza funcionalidades que são suportadas pelos navegadores de maneira nativa. É por isso que **like_button.js** usa uma chamada de função JavaScript para dizer ao React o que exibir:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

No entanto, o React também oferece uma opção de utilizar [JSX](/learn/writing-markup-with-jsx), uma sintaxe JavaScript similar ao HTML:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Esses dois trechos de código são equivalentes. JSX é uma sintaxe popular para descrever marcação em JavaScript. Muitas pessoas acham mais familiar e útil para escrever código de interface de usuário --seja com React ou com outras bibliotecas. Você pode ver "marcação envolvida por acento grave pelo JavaScript" em outros projetos!

> Você pode utilizar [esse conversor online](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3) para transformar marcação HTML em JSX.

### Experimente JSX {/*try-jsx*/}

A maneira mais rápida de experimentar JSX em seu projeto é adicionar o compilador Babel ao tag `<head>` de sua página junto com o React e o ReactDOM da seguinte maneira:

```html {6}
<!-- ... restante do <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... restante do <body> ... -->
```

Agora você pode usar JSX em qualquer tag `<script>` tag adicionando o atributo `type="text/babel"` a ela. Por exemplo:

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

Para converter **like_button.js** para JSX:

1. Em **like_button.js**, substitua

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

por:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. Em **index.html**, adicione `type="text/babel"` na tag script do botão curtir:

```html
<script src="like_button.js" type="text/babel"></script>
```

Aqui está [um exemplo de arquivo HTML feito com JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) que você pode baixar e experimentar.

Essa abordagem é ótima para aprender e criar demonstrações simples. No entanto, isso faz com que seu site seja lento e **não é adequado para produção**. Quando você estiver pronto para seguir adiante, remova essa nova tag `<script>` e os atributos `type="text/babel"` que você adicionou. Ao invés disso, na próxima sessão você verá como configurar um pré-processador JSX para converter todas as suas tags `<script>` tags automaticamente.

### Adicionar JSX em um projeto {/*add-jsx-to-a-project*/}

Adicionar JSX a um projeto não requer ferramentas complicadas como um [empacotador](/learn/start-a-new-react-project#custom-toolchains) ou um servidor de desenvolvimento. Adicionar um pré-processador JSX é muito parecido com adicionar um pré-processador CSS.

Navegue até a pasta do seu projeto via terminal, e cole esses dois comandos (**Garanta que você tem o [Node.js](https://nodejs.org/) instalado!**):

1. `npm init -y` (se falhar, [aqui está a correção](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Você precisa apenas do npm para instalar o pré-processador JSX. Você não vai precisar de mais nada. Tanto o React quanto o código da aplicação pode ser mantido em tags `<script>` sem qualquer alteração.

Parabéns! Você adicionou uma **configuração pronta para produção** ao seu projeto.

### Executar o pré-processador JSX {/*run-the-jsx-preprocessor*/}

Você pode pré-processar JSX de forma que toda vez que você salvar um arquivo contendo JSX, a conversão execute novamente, convertendo o arquivo JSX em um novo arquivo em JavaScript puro.

1. Crie uma pasta chamada **src**
2. No terminal, execute esse comando: `npx babel --watch src --out-dir . --presets react-app/prod ` (Não espere ele terminar! Esse comando inicia um observador automático para JSX.)
3. Mova seu **like_button.js** JSX-ficado para a nova pasta **src** (ou crie um **like_button.js** contendo este [código inicial JSX](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

O observador irá criar um **like_button.js** pré-processado com código JavaScript puro suitable para o navegador with the plain JavaScript.

<Gotcha>

Se você ver uma mensagem "Você instalou o pacote `babel` por engano", você se esqueceu do [passo anterior](#add-jsx-to-a-project). Faça isso na mesma pasta, e então tente novamente.

</Gotcha>

Como um bônus, isso também te permite usar funcionalidades da sintaxe moderna do JavaScript como classes sem precisar se preocupar se o seu código vai falhar em navegadores mais antigos. A ferramenta que nós usamos é chamada Babel, e você pode aprender mais [na sua documentação](https://babeljs.io/docs/en/babel-cli/).

Se você está ficando confortável com ferramentas de build e quer que elas façam mais para você, [nós listamos alguns dos conjuntos de ferramentas mais populares e utilizáveis aqui](/learn/start-a-new-react-project).

<DeepDive title="React sem JSX">

Originalmente o JSX foi introduzido para fazer com que a escrita de componentes React seja tão familiar quanto escrever HTML. Desde então, essa sintaxe se tornou muito difundida. No entanto, podem haver situações em que você não queira ou não possa utilizar JSX. Você tem duas opções:

- Usar uma alternativa ao JSX como [htm](https://github.com/developit/htm) que não usa um compilador- ela utiliza modelos de marcação do JavaScript nativo.
- Utilize [`React.createElement()`](/apis/createelement), que é uma estrutura especial explicada abaixo.

Com JSX, você escreveria um componente da seguinte forma:

```jsx
function Hello(props) {
  return <div>Olá {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="Mundo" />, document.getElementById('root'));
```

Com `React.createElement()`, você escreve dessa maneira:

```js
function Hello(props) {
  return React.createElement('div', null, `Olá ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'Mundo'}, null),
  document.getElementById('root')
);
```

A função aceita três argumentos: `React.createElement(component, props, children)`. Veja abaixo para que eles são utilizados:

1. Um **component**, que pode ser uma string que representa um elemento HTML ou um componente funcional
2. Um objeto com quaisquer [**props** que você queira passar](/learn/passing-props-to-a-component)
3. Um objeto qualquer **children** que o componente possa ter, tal como strings de texto

Se você ficar cansado de escrever `React.createElement()`, um padrão comum é designar um atalho:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Olá Mundo'), document.getElementById('root'));
```

Se você usar esse atalho para `React.createElement()`, usar React sem JSX pode ser quase tão conveniente quanto usar React com JSX.

</DeepDive>
