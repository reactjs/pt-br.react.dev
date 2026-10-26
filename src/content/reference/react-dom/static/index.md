---
title: APIs estáticas do React DOM
---

<Intro>

As APIs `react-dom/static` permitem que você gere HTML estático para componentes React. Elas têm funcionalidade limitada em comparação com as APIs de streaming. Um [framework](/learn/creating-a-react-app#full-stack-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs estáticas para Web Streams {/*static-apis-for-web-streams*/}

Esses métodos estão disponíveis apenas em ambientes com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), que inclui navegadores, Deno e alguns modernos runtimes de borda:

<<<<<<< HEAD
* [`prerender`](/reference/react-dom/static/prerender) renderiza uma árvore React para HTML estático com um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continua uma árvore React pré-renderizada para HTML estático com um [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
=======
* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continues a prerendered React tree to static HTML with a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
>>>>>>> ae5e48074d4f73f1e349eda2a66841f9a959023e

Node.js também inclui esses métodos para compatibilidade, mas eles não são recomendados devido ao pior desempenho. Use as [APIs dedicadas do Node.js](#static-apis-for-nodejs-streams) em vez disso.

---

## APIs estáticas para Node.js Streams {/*static-apis-for-nodejs-streams*/}

<<<<<<< HEAD
Esses métodos estão disponíveis apenas em ambientes com [Node.js Streams](https://nodejs.org/api/stream.html):
=======
These methods are only available in the environments with [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continues a prerendered React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> ae5e48074d4f73f1e349eda2a66841f9a959023e

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renderiza uma árvore React para HTML estático com um [Node.js Stream.](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continua uma árvore React pré-renderizada para HTML estático com um [Node.js Stream.](https://nodejs.org/api/stream.html)
