---
title: APIs estáticas do React DOM
---

<Intro>

As APIs `react-dom/static` permitem que você gere HTML estático para componentes React. Elas têm funcionalidade limitada em comparação com as APIs de streaming. Um [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs estáticas para Web Streams {/*static-apis-for-web-streams*/}

Esses métodos estão disponíveis apenas em ambientes com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), que inclui navegadores, Deno e alguns modernos runtimes de borda:

* [`prerender`](/reference/react-dom/static/prerender) renderiza uma árvore React para HTML estático com um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## APIs estáticas para Node.js Streams {/*static-apis-for-nodejs-streams*/}

Esses métodos estão disponíveis apenas em ambientes com [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renderiza uma árvore React para HTML estático com um [Node.js Stream.](https://nodejs.org/api/stream.html)
