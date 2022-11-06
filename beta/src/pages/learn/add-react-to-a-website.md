---
title: Add React to a Website
---

<Intro>
O React foi projetado desde o início para adoção gradual, e você pode usar o mínimo ou o máximo de React que precisar. Esteja você trabalhando com micro-frontends, um sistema existente ou apenas experimentando o React, você pode começar adicionando componentes interativos do React a uma página HTML com apenas algumas linhas de código - e sem ferramentas de compilação!

</Intro>

## Adicione React em um minuto 

Você pode adicionar um componente React a uma página HTML existente em menos de um minuto. Experimente isso com seu próprio site ou [um arquivo HTML vazio](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip) — tudo que você precisa é uma conexão com a internet e um editor de texto como o Bloco de Notas (ou VSCode - confira nosso guia em [como configurar o seu](/learn/editor-setup/))!

### Etapa 1: adicionar um elemento ao HTML 

Na página HTML que você deseja editar, adicione um elemento HTML como uma tag `<div>` vazia com um id exclusivo para marcar o local onde você deseja exibir algo com React.


```html {3}
<!-- ... existing HTML ... -->

<div id="component-goes-here"></div>

<!-- ... existing HTML ... -->
```

### Etapa 2: adicionar as tags de script {/

Na página HTML, logo antes da tag de fechamento `</body>` tag, adicione três tags `<script>` para os seguintes arquivos:

- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) carrega o núcleo do React
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) permite que o React renderize elementos HTML para o [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **like_button.js** é onde você escreverá seu componente na etapa 3!

<Gotcha>

Quando adicionar, substitua "development.js" com "production.min.js".

</Gotcha>

```html
  <!-- end of the page -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### Etapa 3: criar um componente React

Crie um arquivo chamado **like_button.js** ao lado de sua página HTML, adicione este snippet de código e salve o arquivo. Este código define um componente React chamado `LikeButton`. [Você pode aprender mais sobre como fazer componentes em nossos guias.](/learn/your-first-component)

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

### Etapa 4: adicione seu componente React à página

Por fim, adicione duas linhas na parte inferior de **like_button.js**. Essas duas linhas de código encontram o `<div>` que você adicionou ao seu HTML na primeira etapa e, em seguida, exibem o botão "Curtir" do componente React dentro dele.

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**Parabéns! Você acabou de renderizar seu primeiro componente React em seu site!**

- [Veja o código-fonte completo do exemplo](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Baixe o exemplo completo (2KB compactado)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### Você pode reutilizar componentes!

Você pode querer exibir um componente React em vários lugares na mesma página HTML. Isso é mais útil enquanto as partes da página com React estão isoladas umas das outras. Você pode fazer isso chamando `ReactDOM.render()` várias vezes com vários elementos de contêiner.

1. Em **index.html**, adicione um elemento de contêiner adicional `<div id="component-goes-here-too"></div>`.
2. Em **like_button.js**, adicione um `ReactDOM.render()` adicional para o novo elemento de contêiner:

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

Verificação de saída [um exemplo que exibe o botão "Curtir" três vezes e passa alguns dados para ele](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### Etapa 5: otimize o JavaScript para produção 

O JavaScript não Otimizado pode diminuir significativamente o tempo de carregamento da página para seus usuários. Antes de implantar seu site em produção, é uma boa ideia reduzir seus scripts.

- **Se você não tiver uma etapa de otimização** para seus scripts, [aqui está uma maneira de configurá-lo](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Se você já otimiza** seus scripts, seu site estará pronto para produção se você garantir que o HTML implantado carregue as versões do React terminando em `production.min.js` igual a:

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## Experimente o React com JSX 

Os exemplos acima contam com recursos que são suportados nativamente pelos navegadores. É por isso que **like_button.js** usa uma chamada de função JavaScript para dizer ao React o que exibir:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```


No entanto, o React também oferece uma opção para usar   [JSX](/learn/writing-markup-with-jsx), uma sintaxe JavaScript semelhante a HTML

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Esses dois trechos de código são equivalentes. JSX é uma sintaxe popular para descrever marcação em JavaScript. Muitas pessoas acham familiar e útil escrever código de interface do usuário - tanto com React quanto com outras bibliotecas. Você pode ver "marcação espalhada por todo o seu JavaScript" em outros projetos!

> Você pode brincar com a transformação da marcação HTML em JSX usando [este conversor online](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Experimente o JSX
A maneira mais rápida de experimentar o JSX em seu projeto é adicionar o compilador Babel ao `<head>` da sua página junto com React e ReactDOM assim:

```html {6}
<!-- ... rest of <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... rest of <body> ... -->
```

Agora você pode usar JSX em qualquer tag `<script>` adicionando o atributo `type="text/babel"` a ela. Por exemplo:

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

Para converter **like_button.js** para usar JSX:

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

com:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. Em **index.html**, adicione `type="text/babel"` à tag de script do botão curtir:

```html
<script src="like_button.js" type="text/babel"></script>
```

Aqui está [um arquivo HTML de exemplo com JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)que você pode baixar e jogar.

Essa abordagem é boa para aprender e criar demos simples. No entanto, isso torna seu site lento e **não é adequado para produção**. Quando estiver pronto para seguir em frente, remova esta nova tag `<script>` e os atributos `type="text/babel"` que você adicionou. Em vez disso, na próxima seção, você configurará um pré-processador JSX para converter todas as suas tags `<script>` automaticamente.

### Adicionar JSX a um projeto
Adicionar JSX a um projeto não requer ferramentas complicadas como um [bundler](/learn/start-a-new-react-project#custom-toolchains) ou um servidor de desenvolvimento. Adicionar um pré-processador JSX é muito parecido com adicionar um pré-processador CSS.

Vá para a pasta do seu projeto no terminal e cole estes dois comandos (**Certifique-se de ter o [Node.js](https://nodejs.org/) instalado!**):

1. `npm init -y` (se falhar, [aqui está uma solução](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Você só precisa do npm para instalar o pré-processador JSX. Você não vai precisar dele para mais nada. Tanto o React quanto o código da aplicação podem permanecer como tags `<script>` sem alterações.

Parabéns! Você acabou de adicionar uma **configuração JSX pronta para produção** ao seu projeto.

### Execute o pré-processador JSX

Você pode pré-processar o JSX para que toda vez que salvar um arquivo com JSX nele, a transformação seja executada novamente, convertendo o arquivo JSX em um novo arquivo JavaScript simples.

1. Crie uma pasta chamada **src**
2. Em seu terminal, execute este comando: `npx babel --watch src --out-dir . --presets react-app/prod ` (Não espere que termine! Este comando inicia um observador automatizado para JSX.)
3. Mova seu **like_button.js** com JSX para a nova pasta **src** (ou crie um **like_button.js** contendo estes [Código inicial JSX](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

O observador criará um **like_button.js** pré-processado com o código JavaScript simples adequado para o navegador.

<Gotcha>

Se você vir uma mensagem de erro dizendo "Você instalou por engano o pacote `babel`", você pode ter perdido [a etapa anterior](#add-jsx-to-a-project). Execute-o na mesma pasta e tente novamente.

</Gotcha>

Como bônus, isso também permite que você use recursos de sintaxe JavaScript modernos, como classes, sem se preocupar em quebrar navegadores mais antigos. A ferramenta que acabamos de usar chama-se Babel, e você pode aprender mais sobre [na documentação](https://babeljs.io/docs/en/babel-cli/).

Se você está se acostumando com as ferramentas de construção e quer que elas façam mais por você, [cobrimos algumas das cadeias de ferramentas mais populares e acessíveis aqui](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

Originalmente, o JSX foi introduzido para tornar a escrita de componentes com React tão familiar quanto escrever HTML. Desde então, a sintaxe tornou-se generalizada. No entanto, pode haver casos em que você não queira ou não possa usar o JSX. Você tem duas opções:

- Use uma alternativa JSX como [htm](https://github.com/developit/htm) que não usa um compilador—ele usa os Tagged Templates nativos do JavaScript.
- Use [`React.createElement()`](/apis/createelement), que tem uma estrutura especial explicada abaixo.

Com JSX, você escreveria um componente assim:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

Com `React.createElement()`, você escreveria assim:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Ele aceita três argumentos: `React.createElement(component, props, children)`. Veja como eles funcionam:

1. Um **componente**, que pode ser uma string representando um elemento HTML ou um componente de função
2. Um objeto de qualquer [**props** que você queira passar](/learn/passing-props-to-a-component)
3. Um objeto de qualquer **filho** que o componente possa ter, como strings de texto

Se você se cansar de digitar `React.createElement()`, um padrão comum é atribuir um atalho:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

Se você usar esta forma abreviada para `React.createElement()`, pode ser quase tão conveniente usar React sem JSX.

</DeepDive>
