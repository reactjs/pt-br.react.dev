---
meta: "<meta>"
canary: true
---

<Canary>

As extensões do React para `<meta>` estão atualmente disponíveis apenas nos canais canary e experimental do React. Nas versões estáveis do React, `<meta>` funciona apenas como um [componente HTML integrado do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

O [componente `<meta>` integrado do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) permite que você adicione metadados ao documento.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<meta>` {/*meta*/}

Para adicionar metadados ao documento, renderize o [componente `<meta>` integrado do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). Você pode renderizar `<meta>` de qualquer componente e o React sempre colocará o elemento DOM correspondente no cabeçalho do documento.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<meta>` suporta todas as [props de elementos comuns.](/reference/react-dom/components/common#props)

Deve ter *exatamente uma* das seguintes props: `name`, `httpEquiv`, `charset`, `itemProp`. O componente `<meta>` faz algo diferente dependendo de qual dessas props é especificada.

* `name`: uma string. Especifica o [tipo de metadados](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) a ser anexado ao documento. 
* `charset`: uma string. Especifica o conjunto de caracteres usado pelo documento. O único valor válido é `"utf-8"`.
* `httpEquiv`: uma string. Especifica uma diretiva para o processamento do documento.
* `itemProp`: uma string. Especifica metadados sobre um item específico dentro do documento, em vez do documento como um todo.
* `content`: uma string. Especifica os metadados a serem anexados ao usar as props `name` ou `itemProp` ou o comportamento da diretiva ao usar a prop `httpEquiv`.

#### Comportamento de renderização especial {/*special-rendering-behavior*/}

O React sempre colocará o elemento DOM correspondente ao componente `<meta>` no `<head>` do documento, independentemente de onde ele é renderizado na árvore do React. O `<head>` é o único lugar válido para `<meta>` existir dentro do DOM, no entanto, é conveniente e mantém as coisas compostas se um componente representando uma página específica puder renderizar componentes `<meta>` em si. 

Há uma exceção a isso: se `<meta>` tiver uma prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), não há comportamento especial, pois nesse caso não representa metadados sobre o documento, mas sim metadados sobre uma parte específica da página. 

---

## Uso {/*usage*/}

### Anotando o documento com metadados {/*annotating-the-document-with-metadata*/}

Você pode anotar o documento com metadados, como palavras-chave, um resumo ou o nome do autor. O React colocará esses metadados dentro do `<head>` do documento, independentemente de onde na árvore do React eles são renderizados. 

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="Referência da API para o componente <meta> no React DOM" />
```

Você pode renderizar o componente `<meta>` de qualquer componente. O React colocará um nó DOM `<meta>` no `<head>` do documento.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="Um mapa do site para o site do React" />
      <h1>Mapa do Site</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Anotando itens específicos dentro do documento com metadados {/*annotating-specific-items-within-the-document-with-metadata*/}

Você pode usar o componente `<meta>` com a prop `itemProp` para anotar itens específicos dentro do documento com metadados. Nesse caso, o React *não* colocará essas anotações dentro do `<head>` do documento, mas as colocará como qualquer outro componente React. 

```js
<section itemScope>
  <h3>Anotando itens específicos</h3>
  <meta itemProp="description" content="Referência da API para usar <meta> com itemProp" />
  <p>...</p>
</section>
```