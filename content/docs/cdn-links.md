---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Tanto React como ReactDOM estão disponíveis através de CDN.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

As versões acima devem ser utilizadas apenas para desenvolvimento e não são adequadas para o ambiente de produção. Versões reduzidas e otimizadas para produção estão disponíveis em:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
Para carregar uma versão específica do `react` e `react-dom`, substitua `17` com o número da versão que você deseja.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07

### Por que o atributo `crossorigin`? {#why-the-crossorigin-attribute}

Se você carrega o React de um CDN, recomendamos manter o atributo [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Também recomendamos verificar se o CDN que você está usando define o cabeçalho HTTP `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Isto permite uma melhor [experiência de tratamento de erros](/blog/2017/07/26/error-handling-in-react-16.html) no React 16 e suas próximas versões.
