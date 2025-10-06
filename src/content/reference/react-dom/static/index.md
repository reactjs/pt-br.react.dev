---
title: APIs estáticas do React DOM
---

<Intro>

As APIs `react-dom/static` permitem que você gere HTML estático para componentes React. Elas têm funcionalidade limitada em comparação com as APIs de streaming. Um [framework](/learn/start-a-new-react-project#full-stack-frameworks) pode chamá-las para você. A maioria dos seus componentes não precisa importá-las ou usá-las.

</Intro>

---

## APIs estáticas para Web Streams {/*static-apis-for-web-streams*/}

<<<<<<< HEAD
Esses métodos estão disponíveis apenas em ambientes com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), que inclui navegadores, Deno e alguns modernos runtimes de borda:

* [`prerender`](/reference/react-dom/static/prerender) renderiza uma árvore React para HTML estático com um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## APIs estáticas para Node.js Streams {/*static-apis-for-nodejs-streams*/}

Esses métodos estão disponíveis apenas em ambientes com [Node.js Streams](https://nodejs.org/api/stream.html):
=======
These methods are only available in the environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), which includes browsers, Deno, and some modern edge runtimes:

* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continues a prerendered React tree to static HTML with a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#static-apis-for-nodejs-streams) instead.

---

## Static APIs for Node.js Streams {/*static-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continues a prerendered React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renderiza uma árvore React para HTML estático com um [Node.js Stream.](https://nodejs.org/api/stream.html)
