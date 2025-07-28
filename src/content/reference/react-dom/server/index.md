---
title: APIs de servidor do React DOM
---

<Intro>

<<<<<<< HEAD
As APIs do `react-dom/server` permitem renderizar componentes React no lado do servidor para HTML. Essas APIs são usadas apenas no servidor, no nível superior do seu aplicativo, para gerar o HTML inicial. Um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

</Intro>

---

## APIs de servidor para Node.js Streams {/*server-apis-for-nodejs-streams*/}

Esses métodos estão disponíveis apenas nos ambientes com [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renderiza uma árvore React em um [Node.js Stream](https://nodejs.org/api/stream.html) pipeable.

---

## APIs de servidor para Web Streams {/*server-apis-for-web-streams*/}

Esses métodos estão disponíveis apenas em ambientes com [Web Streams](https://developer.mozilla.org/pt-BR/docs/Web/API/Streams_API), que incluem navegadores, Deno, e alguns edge runtimes modernos:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renderiza uma árvore React em uma [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## APIs de servidor legadas para ambientes sem suporte a streams {/*legacy-server-apis-for-non-streaming-environments*/}

Esses métodos podem ser usados em ambientes que não possuem suporte a streams:

* [`renderToString`](/reference/react-dom/server/renderToString) renderiza uma árvore React em uma string.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) renderiza uma árvore React não interativa em uma string.

Eles têm funcionalidade limitada em comparação com as APIs de streaming.
