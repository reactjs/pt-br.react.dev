---
title: APIs do DOM do React no cliente
---

<Intro>

As APIs `react-dom/client` permitem que você renderize componentes React no cliente (no navegador). Essas APIs são tipicamente usadas no nível superior do seu aplicativo para inicializar sua árvore React. Um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs do cliente {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) permite que você crie uma raiz para exibir componentes React dentro de um nó do DOM do navegador.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) permite que você exiba componentes React dentro de um nó do DOM do navegador cujo conteúdo HTML foi previamente gerado por [`react-dom/server`.](/reference/react-dom/server)

---

## Suporte a navegadores {/*browser-support*/}

o React suporta todos os navegadores populares, incluindo Internet Explorer 9 e superior. Alguns polyfills são necessários para navegadores mais antigos, como IE 9 e IE 10.
