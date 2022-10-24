---
id: javascript-environment-requirements
title: Requisitos de Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
O React 16 depende de uma coleção de tipos [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set). Se você precisa manter o suporte para navegadores antigos e dispositivos que podem não disponibilizar esses recursos (ex. IE < 11) ou tenham uma implementação que não seja padrão (ex. IE 11), considere incluir um polyfill global no bundle de sua aplicação, tal como o pacote [core-js](https://github.com/zloirock/core-js).

Um ambiente com polyfill incluido para o React 16, usando core-js para prestar suporte a navegadores antigos, pode parecer assim:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Olá, mundo!</h1>,
  document.getElementById('root')
);
```

O React também depende da função `requestAnimationFrame` (mesmo em ambiente de teste).  
Você pode usar o pacote [raf](https://www.npmjs.com/package/raf) como substituto para a função `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
