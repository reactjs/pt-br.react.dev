---
title: APIs do React DOM no Cliente
---

<Intro>

As APIs `react-dom/client` permitem que você renderize componentes React no cliente (no navegador). Essas APIs são geralmente usadas na raiz da sua aplicação para inicializar sua árvore React. Um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pode chamá-las por você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs do Cliente {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) permite que você crie uma raiz para exibir componentes React dentro de um nó do DOM do navegador.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) permite que você exiba componentes React dentro de um nó do DOM do navegador cujo conteúdo HTML foi gerado anteriormente por [`react-dom/server`.](/reference/react-dom/server)

---

## Suporte a Navegadores {/*browser-support*/}

O React suporta todos os navegadores populares, incluindo o Internet Explorer 9 e versões superiores. Alguns polyfills são necessários para navegadores mais antigos, como IE 9 e IE 10.