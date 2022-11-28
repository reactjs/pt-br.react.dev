---
id: rendering-elements
title: Renderizando Elementos
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Elementos são os menores blocos de construção de aplicativos React.

Um elemento descreve o que você quer ver na tela:

```js
const element = <h1>Hello, world</h1>;
```

Diferente de elementos DOM do navegador, elementos React são objetos simples e utilizam menos recursos. O React DOM é o responsável por atualizar o DOM para exibir os elementos React.

>**Nota:**
>
>Pode-se confundir elementos com o conceito mais amplo de "componentes". Nós apresentaremos os componentes na [seção seguinte](/docs/components-and-props.html). Elementos compõem os componentes e nós recomendamos ler esta seção antes de prosseguir.

## Renderizando um Elemento no DOM {#rendering-an-element-into-the-dom}

Suponhamos que exista um `<div>` em algum lugar do seu código HTML:

```html
<div id="root"></div>
```

Nós o chamamos de nó raiz do DOM porque tudo dentro dele será gerenciado pelo React DOM.

Aplicações construídas apenas com React geralmente tem apenas um único nó raiz no DOM. Se deseja integrar o React a uma aplicação existente, você pode ter quantos nós raiz precisar.

<<<<<<< HEAD
Para renderizar um elemento React em um nó raiz, passe ambos para [`ReactDOM.render()`](/docs/react-dom.html#render)`:
=======
To render a React element, first pass the DOM element to [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot), then pass the React element to `root.render()`:
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

`embed:rendering-elements/render-an-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/ZpvBNJ?editors=1010)**

Assim, é exibido "Hello, world" na página.

## Atualizando o Elemento Renderizado {#updating-the-rendered-element}

Elementos React são [imutáveis](https://pt.wikipedia.org/wiki/Objeto_imutável). Uma vez criados, você não pode alterar seus elementos filhos ou atributos.

<<<<<<< HEAD
Com o que aprendemos até agora, a única forma de atualizar a interface é criar um novo elemento e passá-lo para [`ReactDOM.render()`](/docs/react-dom.html#render).
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to `root.render()`.
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

Veja o seguinte exemplo de um relógio:

`embed:rendering-elements/update-rendered-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/gwoJZk?editors=1010)**

<<<<<<< HEAD
Chama-se o [`ReactDOM.render()`](/docs/react-dom.html#render) a cada segundo a partir de um callback do [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).
=======
It calls [`root.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

>**Nota:**
>
<<<<<<< HEAD
>Na prática, a maioria dos aplicativos React usam o [`ReactDOM.render()`](/docs/react-dom.html#render) apenas uma única vez. Nas seções seguintes, aprenderemos como esse código pode ser encapsulado em [componentes com estado](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call `root.render()` once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
>
>Recomendamos que você não pule os tópicos porque eles se complementam.

## O React Somente Atualiza o Necessário {#react-only-updates-whats-necessary}

O React DOM compara o elemento novo e seus filhos com os anteriores e somente aplica as modificações necessárias no DOM para levá-lo ao estado desejado.

<<<<<<< HEAD
Você pode observar isso inspecionando o [último exemplo](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) com as ferramentas do navegador:
=======
You can verify by inspecting the [last example](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) with the browser tools:
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

![Ferramenta de inspecionar elemento do DOM mostrando atualizações granulares](../images/docs/granular-dom-updates.gif)

Embora nós criemos um elemento descrevendo toda a estrutura da interface a cada segundo, apenas o nó de texto cujo conteúdo foi alterado é atualizado pelo React DOM.

Em nossa experiência, pensar em como a interface do usuário deve ficar a qualquer momento, em vez de como alterá-la ao longo do tempo, elimina toda uma série de bugs.
