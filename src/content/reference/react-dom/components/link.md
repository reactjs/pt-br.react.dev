---
link: "<link>"
canary: true
---

<Canary>

As extensões do React para `<link>` estão disponíveis atualmente apenas nos canais canary e experimental do React. Nas versões estáveis do React, `<link>` funciona apenas como um [componente HTML incorporado do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

O [componente `<link>` incorporado do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/link) permite usar recursos externos, como folhas de estilo, ou anotar o documento com metadados de links.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<link>` {/*link*/}

Para vincular a recursos externos, como folhas de estilo, fontes e ícones, ou para anotar o documento com metadados de links, renderize o [componente `<link>` incorporado do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/link). Você pode renderizar `<link>` de qualquer componente e o React [na maioria dos casos](#special-rendering-behavior) colocará o elemento DOM correspondente no cabeçalho do documento.

```js
<link rel="icon" href="favicon.ico" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<link>` suporta todas as [props comuns de elemento.](/reference/react-dom/components/common#props)

* `rel`: uma string, obrigatória. Especifica a [relação com o recurso](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Attributes/rel). O React [trata links com `rel="stylesheet"` de forma diferente](#special-rendering-behavior) de outros links.

Essas props se aplicam quando `rel="stylesheet"`:

* `precedence`: uma string. Indica ao React onde classificar o nó DOM `<link>` em relação a outros no `<head>` do documento, o que determina qual folha de estilo pode sobrepor a outra. Seu valor pode ser (em ordem de precedência) `"reset"`, `"low"`, `"medium"`, `"high"`. Folhas de estilo com a mesma precedência vão juntas, sejam `<link>` ou tags `<style>` em linha ou carregadas usando as funções [`preload`](/reference/react-dom/preload) ou [`preinit`](/reference/react-dom/preinit).
* `media`: uma string. Restringe a folha de estilo a uma certa [consulta de mídia](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `title`: uma string. Especifica o nome de uma [folha de estilo alternativa](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Alternative_style_sheets).

Essas props se aplicam quando `rel="stylesheet"` mas desabilitam o [tratamento especial de folhas de estilo](#special-rendering-behavior) do React:

* `disabled`: um booleano. Desabilita a folha de estilo.
* `onError`: uma função. Chamado quando a folha de estilo falha ao carregar.
* `onLoad`: uma função. Chamado quando a folha de estilo termina de ser carregada.

Essas props se aplicam quando `rel="preload"` ou `rel="modulepreload"`:

* `as`: uma string. O tipo de recurso. Seus valores possíveis são `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: uma string. Aplicável apenas quando `as="image"`. Especifica o [conjunto de origem da imagem](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: uma string. Aplicável apenas quando `as="image"`. Especifica os [tamanhos da imagem](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Essas props se aplicam quando `rel="icon"` ou `rel="apple-touch-icon"`:

* `sizes`: uma string. Os [tamanhos do ícone](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Essas props se aplicam em todos os casos:

* `href`: uma string. A URL do recurso vinculado.
*  `crossOrigin`: uma string. A [política de CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`. É obrigatório quando `as` é definido como `"fetch"`.
*  `referrerPolicy`: uma string. O [cabeçalho Referrer](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/link#referrerpolicy) a enviar ao buscar. Seus valores possíveis são `no-referrer-when-downgrade` (o padrão), `no-referrer`, `origin`, `origin-when-cross-origin`, e `unsafe-url`.
* `fetchPriority`: uma string. Sugere uma prioridade relativa para buscar o recurso. Os valores possíveis são `auto` (o padrão), `high`, e `low`.
* `hrefLang`: uma string. O idioma do recurso vinculado.
* `integrity`: uma string. Um hash criptográfico do recurso, para [verificar sua autenticidade](https://developer.mozilla.org/pt-BR/docs/Web/Security/Subresource_Integrity).
* `type`: uma string. O tipo MIME do recurso vinculado.

Props que **não são recomendadas** para uso com React:

* `blocking`: uma string. Se definido como `"render"`, instrui o navegador a não renderizar a página até que a folha de estilo seja carregada. O React fornece controle mais fino usando Suspense.

#### Comportamento especial de renderização {/*special-rendering-behavior*/}

O React sempre colocará o elemento DOM correspondente ao componente `<link>` dentro do `<head>` do documento, independentemente de onde ele é renderizado na árvore do React. O `<head>` é o único lugar válido para o `<link>` existir dentro do DOM, no entanto, é conveniente e mantém as coisas compostas se um componente representando uma página específica puder renderizar componentes `<link>` por conta própria.

Há algumas exceções a isso:

* Se o `<link>` tiver uma prop `rel="stylesheet"`, então ele também deve ter uma prop `precedence` para obter esse comportamento especial. Isso ocorre porque a ordem das folhas de estilo dentro do documento é significativa, portanto, o React precisa saber como classificar essa folha de estilo em relação a outras, que você especifica usando a prop `precedence`. Se a prop `precedence` for omitida, não há comportamento especial.
* Se o `<link>` tiver uma prop [`itemProp`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Global_attributes/itemprop), não há comportamento especial, porque, nesse caso, não se aplica ao documento, mas representa metadados sobre uma parte específica da página.
* Se o `<link>` tiver uma prop `onLoad` ou `onError`, porque nesse caso você está gerenciando o carregamento do recurso vinculado manualmente dentro do seu componente React.

#### Comportamento especial para folhas de estilo {/*special-behavior-for-stylesheets*/}

Além disso, se o `<link>` se referir a uma folha de estilo (ou seja, tiver `rel="stylesheet"` em suas props), o React a trata de forma especial das seguintes maneiras:

* O componente que renderiza `<link>` irá [suspender](/reference/react/Suspense) enquanto a folha de estilo está sendo carregada.
* Se vários componentes renderizarem links para a mesma folha de estilo, o React eliminará duplicatas e colocará apenas um link no DOM. Dois links são considerados iguais se tiverem a mesma prop `href`.

Há duas exceções a esse comportamento especial:

* Se o link não tiver uma prop `precedence`, não há comportamento especial, porque a ordem das folhas de estilo dentro do documento é significativa, portanto, o React precisa saber como classificar essa folha de estilo em relação a outras, que você especifica usando a prop `precedence`.
* Se você fornecer qualquer uma das props `onLoad`, `onError` ou `disabled`, não há comportamento especial, porque essas props indicam que você está gerenciando o carregamento da folha de estilo manualmente dentro do seu componente.

Esse tratamento especial vem com duas ressalvas:

* O React ignorará mudanças nas props após o link ter sido renderizado. (O React emitirá um aviso em desenvolvimento se isso acontecer.)
* O React pode deixar o link no DOM mesmo depois que o componente que o renderizou tenha sido desmontado.

---

## Uso {/*usage*/}

### Vinculando a recursos relacionados {/*linking-to-related-resources*/}

Você pode anotar o documento com links para recursos relacionados, como um ícone, URL canônica ou pingback. O React colocará esses metadados dentro do `<head>` do documento, independentemente de onde na árvore do React ele é renderizado.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>Meu Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Vinculando a uma folha de estilo {/*linking-to-a-stylesheet*/}

Se um componente depende de uma determinada folha de estilo para ser exibido corretamente, você pode renderizar um link para essa folha de estilo dentro do componente. Seu componente irá [suspender](/reference/react/Suspense) enquanto a folha de estilo está sendo carregada. Você deve fornecer a prop `precedence`, que informa ao React onde colocar essa folha de estilo em relação a outras — folhas de estilo com maior precedência podem sobrepor aquelas com menor precedência.

<Note>
Quando quiser usar uma folha de estilo, pode ser benéfico chamar a função [preinit](/reference/react-dom/preinit). Chamar essa função pode permitir que o navegador comece a buscar a folha de estilo mais cedo do que se você apenas renderizar um componente `<link>`, por exemplo, enviando uma [resposta HTTP Early Hints](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Controlando a precedência de folhas de estilo {/*controlling-stylesheet-precedence*/}

As folhas de estilo podem conflitar entre si, e quando isso acontece, o navegador utiliza a que vem mais tarde no documento. O React permite que você controle a ordem das folhas de estilo com a prop `precedence`. Neste exemplo, dois componentes renderizam folhas de estilo, e a que tem maior precedência vai mais tarde no documento, mesmo que o componente que a renderiza venha primeiro.

{/*FIXME: isso não parece funcionar na realidade -- imagino que a precedência ainda não esteja implementada?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### Renderização deduplicada de folhas de estilo {/*deduplicated-stylesheet-rendering*/}

Se você renderizar a mesma folha de estilo a partir de vários componentes, o React colocará apenas um `<link>` no cabeçalho do documento.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Anotando itens específicos dentro do documento com links {/*annotating-specific-items-within-the-document-with-links*/}

Você pode usar o componente `<link>` com a prop `itemProp` para anotar itens específicos dentro do documento com links para recursos relacionados. Nesse caso, o React *não* colocará essas anotações dentro do `<head>` do documento, mas as colocará como qualquer outro componente React.

```js
<section itemScope>
  <h3>Anotando itens específicos</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```