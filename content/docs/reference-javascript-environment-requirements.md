---
id: javascript-environment-requirements
title: Requisitos de Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

O React 18 suporta todos os navegadores modernos (Edge, Firefox, Chrome, Safari, etc).

Se você oferece suporte a navegadores e dispositivos mais antigos, como o Internet Explorer, que não fornecem recursos de navegador modernos nativamente ou têm implementações não compatíveis, considere incluir um polyfill global em seu aplicativo integrado.

Aqui está uma lista dos recursos modernos que o React 18 usa:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

O polyfill correto para esses recursos depende do seu ambiente. Para muitos usuários, você pode definir suas configurações de [Lista de navegador](https://github.com/browserslist/browserslist). Para outros, pode ser necessário importar polyfills como [`core-js`](https://github.com/zloirock/core-js) diretamente.
