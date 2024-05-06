---
title: Visão geral da referência do React
---

<Intro>

Esta seção fornece documentação de referência detalhada para trabalhar com React. Para uma introdução ao React, visite a seção [Aprender](/learn).

</Intro>

A documentação de referência do React é dividida em subseções funcionais:

## React {/*react*/}

Recursos do React Programático:

<<<<<<< HEAD
* [Hooks](/reference/react/hooks) - Use diferentes recursos do React de seus componentes.
* [Componentes](/reference/react/components) - Documenta componentes integrados que você pode usar em seu JSX.
* [APIs](/reference/react/apis) - APIs que são úteis para definir componentes.
* [Diretivas](/reference/react/directives) - Fornece instruções para bundlers compatíveis com componentes do React Server.
=======
* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Documents built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/rsc/directives) - Provide instructions to bundlers compatible with React Server Components.
>>>>>>> 556063bdce0ed00f29824bc628f79dac0a4be9f4

## React DOM {/*react-dom*/}

React-dom contém recursos que são suportados apenas por aplicativos da web (que são executados no ambiente DOM do navegador). Esta seção é dividida no seguinte:

* [Hooks](/reference/react-dom/hooks) - Hooks para aplicações web que rodam no ambiente DOM do navegador.
* [Componentes](/reference/react-dom/components) - React suporta todos os componentes HTML e SVG integrados do navegador.
* [APIs](/reference/react-dom) - O pacote `react-dom` contém métodos suportados apenas em aplicações web.
* [APIs do cliente](/reference/react-dom/client) - As APIs `react-dom/client` permitem renderizar componentes do React no cliente (no navegador).
* [APIs de servidor](/reference/react-dom/server) - As APIs `react-dom/server` permitem renderizar componentes React para HTML no servidor.

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Exportado do pacote `react`, mas não recomendado para uso em código recém-escrito.
