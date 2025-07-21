---
link: "<link>"
---

<Intro>

O [componente `<link>` nativo do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) permite que você use recursos externos, como folhas de estilo ou anote o documento com metadados de link.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<link>` {/*link*/}

Para fazer link para recursos externos, como folhas de estilo, fontes e ícones, ou para anotar o documento com metadados de link, renderize o [componente `<link>` nativo do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Você pode renderizar `<link>` de qualquer componente e o React [na maioria dos casos](#special-rendering-behavior) colocará o elemento DOM correspondente no head do documento.

```js
<link rel="icon" href="favicon.ico" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

<<<<<<< HEAD
`<link>` suporta todas as [props comuns de elemento](/reference/react-dom/components/common#props).
=======
`<link>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

* `rel`: uma string, obrigatória. Especifica a [relação com o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). O React [trata links com `rel="stylesheet"` de forma diferente](#special-rendering-behavior) de outros links.

Essas props se aplicam quando `rel="stylesheet"`:

* `precedence`: uma string. Diz ao React onde classificar o nó DOM `<link>` em relação a outros no `<head>` do documento, o que determina qual folha de estilo pode substituir a outra. O React inferirá que os valores de precedência que ele descobrir primeiro são "menores" e os valores de precedência que ele descobrir mais tarde são "maiores". Muitos sistemas de estilo podem funcionar bem usando um único valor de precedência porque as regras de estilo são atômicas. Folhas de estilo com a mesma precedência vão juntas, sejam tags `<link>` ou `<style>` inline ou carregadas usando funções [`preinit`](/reference/react-dom/preinit).
* `media`: uma string. Restringe a folha de estilo a uma determinada [consulta de mídia](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `title`: uma string. Especifica o nome de uma [folha de estilo alternativa](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Estas props se aplicam quando `rel="stylesheet"` mas desabilitam o [tratamento especial do React para folhas de estilo](#special-rendering-behavior):

* `disabled`: um booleano. Desabilita a folha de estilo.
* `onError`: uma função. Chamada quando a folha de estilo falha ao carregar.
* `onLoad`: uma função. Chamada quando a folha de estilo termina de ser carregada.

Estas props se aplicam quando `rel="preload"` ou `rel="modulepreload"`:

* `as`: uma string. O tipo de recurso. Seus valores possíveis são `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: uma string. Aplicável somente quando `as="image"`. Especifica o [conjunto de origem da imagem](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: uma string. Aplicável somente quando `as="image"`. Especifica os [tamanhos da imagem](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Essas props se aplicam quando `rel="icon"` ou `rel="apple-touch-icon"`:

* `sizes`: uma string. Os [tamanhos do ícone](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Essas props se aplicam em todos os casos:

* `href`: uma string. O URL do recurso vinculado.
* `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`. É obrigatório quando `as` está definido como `"fetch"`.
* `referrerPolicy`: uma string. O [cabeçalho Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) a ser enviado ao buscar. Seus valores possíveis são `no-referrer-when-downgrade` (o padrão), `no-referrer`, `origin`, `origin-when-cross-origin` e `unsafe-url`.
* `fetchPriority`: uma string. Sugere uma prioridade relativa para buscar o recurso. Os valores possíveis são `auto` (o padrão), `high` e `low`.
* `hrefLang`: uma string. O idioma do recurso vinculado.
* `integrity`: uma string. Um hash criptográfico do recurso, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: uma string. O tipo MIME do recurso vinculado.

Props que **não são recomendadas** para uso com o React:

* `blocking`: uma string. Se definido como `"render"`, instrui o navegador a não renderizar a página até que a folha de estilo seja carregada. O React fornece um controle mais refinado usando Suspense.

#### Comportamento especial de renderização {/*special-rendering-behavior*/}

O React sempre colocará o elemento DOM correspondente ao componente `<link>` dentro do `<head>` do documento, independentemente de onde na árvore React ele é renderizado. O `<head>` é o único lugar válido para `<link>` existir dentro do DOM, no entanto, é conveniente e mantém as coisas compostas se um componente que representa uma página específica pode renderizar os próprios componentes `<link>`.

Existem algumas exceções a isso:

* Se o `<link>` tiver uma prop `rel="stylesheet"`, então ele também precisa ter uma prop `precedence` para obter esse comportamento especial. Isso ocorre porque a ordem das folhas de estilo dentro do documento é significativa, então o React precisa saber como ordenar essa folha de estilo em relação a outras, o que você especifica usando a prop `precedence`. Se a prop `precedence` for omitida, não haverá comportamento especial.
* Se o `<link>` tiver uma prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), não haverá comportamento especial, porque, nesse caso, ele não se aplica ao documento, mas representa metadados sobre uma parte específica da página.
* Se o `<link>` tiver uma prop `onLoad` ou `onError`, porque nesse caso você está gerenciando o carregamento do recurso vinculado manualmente dentro do seu componente React.

#### Comportamento especial para folhas de estilo {/*special-behavior-for-stylesheets*/}

Além disso, se o `<link>` for para uma folha de estilo (nomeadamente, ele tem `rel="stylesheet"` em suas props), o React o trata especialmente das seguintes maneiras:

* O componente que renderiza `<link>` irá [suspender](/reference/react/Suspense) enquanto a folha de estilo está carregando.
* Se vários componentes renderizarem links para a mesma folha de estilo, o React irá desduplicá-los e colocará apenas um único link no DOM. Dois links são considerados os mesmos se eles tiverem a mesma prop `href`.

Há duas exceções a este comportamento especial:

* Se o link não tiver uma prop `precedence`, não haverá comportamento especial, porque a ordem das folhas de estilo dentro do documento é importante, portanto, o React precisa saber como ordenar essa folha de estilo em relação às outras, que você especifica usando a prop `precedence`.
* Se você fornecer alguma das props `onLoad`, `onError` ou `disabled`, não haverá comportamento especial, porque essas props indicam que você está gerenciando o carregamento da folha de estilo manualmente dentro do seu componente.

Este tratamento especial vem com duas ressalvas:

* O React ignorará as alterações nas props após o link ter sido renderizado. (O React emitirá um aviso no desenvolvimento se isso acontecer.)
* O React pode deixar o link no DOM mesmo depois que o componente que o renderizou foi desmontado.

---

## Uso {/*usage*/}

### Ligando a recursos relacionados {/*linking-to-related-resources*/}

Você pode anotar o documento com links para recursos relacionados, como um ícone, URL canônico ou pingback. O React colocará esses metadados dentro do `<head>` do documento, independentemente de onde na árvore React ele for renderizado.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Ligando a uma folha de estilo {/*linking-to-a-stylesheet*/}

Se um componente depende de uma determinada folha de estilo para ser exibido corretamente, você pode renderizar um link para essa folha de estilo dentro do componente. Seu componente irá [suspender](/reference/react/Suspense) enquanto a folha de estilo estiver carregando. Você deve fornecer a prop `precedence`, que informa ao React onde colocar essa folha de estilo em relação a outras — folhas de estilo com maior precedência podem substituir aquelas com menor precedência.

<Note>
Quando você deseja usar uma folha de estilo, pode ser benéfico chamar a função [preinit](/reference/react-dom/preinit). Chamar essa função pode permitir que o navegador comece a buscar a folha de estilo mais cedo do que se você apenas renderizar um componente `<link>`, por exemplo, enviando uma [resposta HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
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

### Controlando a precedência da folha de estilo {/*controlling-stylesheet-precedence*/}

As folhas de estilo podem entrar em conflito umas com as outras e, quando entram, o navegador usa aquela que vem por último no documento. O React permite que você controle a ordem das folhas de estilo com a prop `precedence`. Neste exemplo, três componentes renderizam folhas de estilo e aquelas com a mesma precedência são agrupadas no `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

Observe que os próprios valores `precedence` são arbitrários e sua nomenclatura depende de você. O React inferirá que os valores de precedência que ele descobrir primeiro são "menores" e os valores de precedência que ele descobrir mais tarde são "maiores".

### Renderização de folha de estilo desduplicada {/*deduplicated-stylesheet-rendering*/}

Se você renderizar a mesma folha de estilo de vários componentes, o React colocará apenas um único `<link>` no head do documento.

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
