---
title: Aviso de Refs Precisam Ter um Dono
layout: single
permalink: warnings/refs-must-have-owner.html
---

Você provavelmente está aqui porque recebeu uma das seguintes mensagens de erro:

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*Versões anteriores do React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

Isso normalmente significa uma destas três coisas:

- Você está tentando adicionar uma `ref` a um componente funcional.
- Você está tentando adicionar uma `ref` a um elemento criado fora da função render() de um componente.
- Você possui múltiplas (conflitantes) cópias do React carregadas (por exemplo, em função de uma dependência do npm configurada erroneamente).

## Refs Em Componentes Funcionais {#refs-on-function-components}

Se `<Foo>` é um componente funcional, você não pode adicionar uma ref nele:

```js
// Não funciona se Foo é uma função!
<Foo ref={foo} />
```

Se você precisa adicionar uma ref a um componente, converta-o em uma classe primeiro, ou considere a não utilização de refs por elas serem [raramente necessárias](/docs/refs-and-the-dom.html#when-to-use-refs)

## Refs como Strings Fora do Método Render {#strings-refs-outside-the-render-method}

Isso normalmente significa que você está tentando adicionar uma ref para um componente que não possui um dono (isto é, não foi criado dentro do método `render` de outro componente). Por exemplo, isso não funcionará:

```js
// Não funciona!
ReactDOM.render(<App ref="app" />, el);
```

Tente renderizar esse componente dentro de um novo componente localizado em um nível acima e que irá possuir essa ref. De outro modo, você pode utilizar uma ref com callback:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Reflita se você [realmente precisa de uma ref](/docs/refs-and-the-dom.html#when-to-use-refs) antes de seguir essa abordagem.

## Múltiplas Cópias do React {#multiple-copies-of-react}

Bower faz um bom trabalho de desduplicar dependências, mas o npm não. Se você não está fazendo algo (extravagante) com refs, existe uma boa chance do problema não estar com suas refs, mas sim pelo fato de existir múltiplas cópias do React carregadas no seu projeto. Às vezes, quando você instala um módulo externo via npm, você irá obter uma cópia duplicada da dependência, e isso pode causar problemas.

Se você está usando npm... `npm ls` ou `npm ls react` podem ajudar.
