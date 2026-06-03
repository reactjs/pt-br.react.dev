---
title: Client React DOM APIs
---

<Intro>

As APIs do `react-dom/client` permitem renderizar componentes React no cliente (no navegador). Essas APIs são tipicamente usadas no nível superior do seu aplicativo para inicializar sua árvore React. Um [framework](/learn/creating-a-react-app#full-stack-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs do Cliente {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) permite criar uma raiz para exibir componentes React dentro de um nó DOM do navegador.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) permite exibir componentes React dentro de um nó DOM do navegador cujo conteúdo HTML foi previamente gerado por [`react-dom/server`.](/reference/react-dom/server)

---

## Suporte ao Navegador {/*browser-support*/}

O React suporta todos os navegadores populares, incluindo Internet Explorer 9 e superior. Alguns polyfills são necessários para navegadores mais antigos, como IE 9 e IE 10.