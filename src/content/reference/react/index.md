---
title: Visão geral da referência do React
---

<Intro>

Esta seção fornece documentação de referência detalhada para trabalhar com React. Para uma introdução ao React, visite a seção [Aprender](/learn).

</Intro>

A documentação de referência do React é dividida em subseções funcionais:

## React {/*react*/}

Recursos do React Programático:

* [Hooks](/reference/react/hooks) - Use diferentes recursos do React a partir dos seus componentes.
* [Componentes](/reference/react/components) - Componentes integrados que você pode usar no seu JSX.
* [APIs](/reference/react/apis) - APIs que são úteis para definir componentes.
* [Diretivas](/reference/rsc/directives) - Fornecem instruções para empacotadores compatíveis com Componentes de Servidor do React.

## React DOM {/*react-dom*/}

<<<<<<< HEAD
React-dom contém recursos que são suportados apenas por aplicativos da web (que são executados no ambiente DOM do navegador). Esta seção é dividida no seguinte:

* [Hooks](/reference/react-dom/hooks) - Hooks para aplicações web que rodam no ambiente DOM do navegador.
* [Componentes](/reference/react-dom/components) - React suporta todos os componentes HTML e SVG integrados do navegador.
* [APIs](/reference/react-dom) - O pacote `react-dom` contém métodos suportados apenas em aplicações web.
* [APIs do cliente](/reference/react-dom/client) - As APIs `react-dom/client` permitem renderizar componentes do React no cliente (no navegador).
* [APIs de servidor](/reference/react-dom/server) - As APIs `react-dom/server` permitem renderizar componentes React para HTML no servidor.
=======
React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.
* [Static APIs](/reference/react-dom/static) - The `react-dom/static` APIs let you generate static HTML for React components.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Exportado do pacote `react`, mas não recomendado para uso em código recém-escrito.
