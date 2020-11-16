---
id: javascript-environment-requirements
title: Requisitos de Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
O React 16 depende de uma coleção de tipos [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set). Se você precisa manter o suporte para navegadores antigos e dispositivos que podem não disponibilizar esses recursos (ex. IE < 11) ou tenham uma implementação que não seja padrão (ex. IE 11), considere incluir um polyfill global no bundle de sua aplicação, tal como o pacote [core-js](https://github.com/zloirock/core-js) ou [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

Um ambiente com polyfill incluido para o React 16, usando core-js para prestar suporte a navegadores antigos, pode parecer assim:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
