```
---
meta: "<meta>"
---

<Intro>

O [componente nativo do navegador `<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) permite que você adicione metadados ao documento.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<meta>` {/*meta*/}

Para adicionar metadados ao documento, renderize o [componente nativo do navegador `<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). Você pode renderizar `<meta>` a partir de qualquer componente e o React sempre colocará o elemento DOM correspondente no `head` do documento.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<meta>` suporta todas as [props comuns de elemento](/reference/react-dom/components/common#props).

Ele deve ter *exatamente uma* das seguintes props: `name`, `httpEquiv`, `charset`, `itemProp`. O componente `<meta>` faz algo diferente dependendo de qual dessas props é especificada.

*   `name`: uma string. Especifica o [tipo de metadados](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) a serem anexados ao documento.
*   `charset`: uma string. Especifica o conjunto de caracteres usado pelo documento. O único valor válido é `"utf-8"`.
*   `httpEquiv`: uma string. Especifica uma diretiva para processar o documento.
*   `itemProp`: uma string. Especifica metadados sobre um item específico dentro do documento, em vez do documento como um todo.
*   `content`: uma string. Especifica os metadados a serem anexados quando usados com as props `name` ou `itemProp` ou o comportamento da diretiva quando usado com a prop `httpEquiv`.

#### Comportamento especial de renderização {/*special-rendering-behavior*/}

O React sempre colocará o elemento DOM correspondente ao componente `<meta>` dentro do `<head>` do documento, independentemente de onde na árvore React ele é renderizado. O `<head>` é o único lugar válido para `<meta>` existir no DOM, mas é conveniente e mantém as coisas compostas se um componente que representa uma página específica puder renderizar componentes `<meta>` por si só.

Há uma exceção a isso: se `<meta>` tiver uma prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), não haverá comportamento especial, porque, nesse caso, ele não representa metadados sobre o documento, mas sim metadados sobre uma parte específica da página.

---

## Uso {/*usage*/}

### Anotando o documento com metadados {/*annotating-the-document-with-metadata*/}

Você pode anotar o documento com metadados, como palavras-chave, um resumo ou o nome do autor. O React colocará esses metadados no `<head>` do documento, independentemente de onde na árvore React eles são renderizados.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

Você pode renderizar o componente `<meta>` a partir de qualquer componente. O React colocará um nó DOM `<meta>` no `<head>` do documento.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Anotando itens específicos dentro do documento com metadados {/*annotating-specific-items-within-the-document-with-metadata*/}

Você pode usar o componente `<meta>` com a prop `itemProp` para anotar itens específicos dentro do documento com metadados. Nesse caso, o React *não* colocará essas anotações no `<head>` do documento, mas as colocará como qualquer outro componente React.

```js
<section itemScope>
  <h3>Anotando itens específicos</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```