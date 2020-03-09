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
Para renderizar um elemento React em um nó raiz, passe ambos para `ReactDOM.render()`:
=======
To render a React element into a root DOM node, pass both to [`ReactDOM.render()`](/docs/react-dom.html#render):
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

Assim, é exibido "Hello, world" na página.

## Atualizando o Elemento Renderizado {#updating-the-rendered-element}

Elementos React são [imutáveis](https://pt.wikipedia.org/wiki/Objeto_imutável). Uma vez criados, você não pode alterar seus elementos filhos ou atributos.

<<<<<<< HEAD
Com o que aprendemos até agora, a única forma de atualizar a interface é criar um novo elemento e passá-lo para `ReactDOM.render()`.
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to [`ReactDOM.render()`](/docs/react-dom.html#render).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

Veja o seguinte exemplo de um relógio:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

<<<<<<< HEAD
Chama-se o `ReactDOM.render()` a cada segundo a partir de um callback do [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).
=======
It calls [`ReactDOM.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

>**Nota:**
>
<<<<<<< HEAD
>Na prática, a maioria dos aplicativos React usam o `ReactDOM.render()` apenas uma única vez. Nas seções seguintes, aprenderemos como esse código pode ser encapsulado em [componentes com estado](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call [`ReactDOM.render()`](/docs/react-dom.html#render) once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
>
>Recomendamos que você não pule os tópicos porque eles se complementam.

## O React Somente Atualiza o Necessário {#react-only-updates-whats-necessary}

O React DOM compara o elemento novo e seus filhos com os anteriores e somente aplica as modificações necessárias no DOM para levá-lo ao estado desejado.

Você pode observar isso inspecionando o [último exemplo](codepen://rendering-elements/update-rendered-element) com as ferramentas do navegador:

![Ferramenta de inspecionar elemento do DOM mostrando atualizações granulares](../images/docs/granular-dom-updates.gif)

Embora nós criemos um elemento descrevendo toda a estrutura da interface a cada segundo, apenas o nó de texto cujo conteúdo foi alterado é atualizado pelo React DOM.

<<<<<<< HEAD
Em nossa experiência, pensar em como a interface deve estar em um determinado momento, ao invés de pensar como modificá-la com o tempo, evita uma série de erros.
=======
In our experience, thinking about how the UI should look at any given moment, rather than how to change it over time, eliminates a whole class of bugs.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
