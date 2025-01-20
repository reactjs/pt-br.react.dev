---
title: "<title>"
canary: true
---

<Canary>

As extensões do React para `<title>` estão atualmente disponíveis apenas nos canais canary e experimental do React. Nas versões estáveis do React, `<title>` funciona apenas como um [componente HTML embutido do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

O [componente `<title>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) permite que você especifique o título do documento.

```js
<title>Meu Blog</title>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<title>` {/*title*/}

Para especificar o título do documento, renderize o [componente `<title>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). Você pode renderizar `<title>` a partir de qualquer componente e o React sempre colocará o elemento DOM correspondente no cabeçalho do documento.

```js
<title>Meu Blog</title>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<title>` suporta todas as [props comuns de elementos.](/reference/react-dom/components/common#props)

* `children`: `<title>` aceita apenas texto como filho. Esse texto se tornará o título do documento. Você também pode passar seus próprios componentes, desde que eles renderizem apenas texto.

#### Comportamento especial de renderização {/*special-rendering-behavior*/}

O React sempre colocará o elemento DOM correspondente ao componente `<title>` dentro do `<head>` do documento, independentemente de onde na árvore do React ele seja renderizado. O `<head>` é o único lugar válido para o `<title>` existir dentro do DOM, mas é conveniente e mantém as coisas compostas se um componente representando uma página específica puder renderizar seu próprio `<title>`.

Existem duas exceções a isso:
* Se `<title>` estiver dentro de um componente `<svg>`, então não há comportamento especial, porque neste contexto ele não representa o título do documento, mas sim uma [anotação de acessibilidade para aquele gráfico SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* Se o `<title>` tiver uma prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), não há comportamento especial, porque nesse caso ele não representa o título do documento, mas sim metadados sobre uma parte específica da página.

<Pitfall>

Renderize apenas um único `<title>` por vez. Se mais de um componente renderizar uma tag `<title>` ao mesmo tempo, o React colocará todos esses títulos no cabeçalho do documento. Quando isso acontece, o comportamento dos navegadores e mecanismos de busca é indefinido.

</Pitfall>

---

## Uso {/*usage*/}

### Defina o título do documento {/*set-the-document-title*/}

Renderize o componente `<title>` de qualquer componente com texto como seus filhos. O React colocará um nó DOM `<title>` no `<head>` do documento.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>Meu Site: Fale Conosco</title>
      <h1>Fale Conosco</h1>
      <p>Envie-nos um email para support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Use variáveis no título {/*use-variables-in-the-title*/}

Os filhos do componente `<title>` devem ser uma única string de texto. (Ou um único número ou um único objeto com um método `toString`.) Pode não ser óbvio, mas usar chaves JSX assim:

```js
<title>Página de Resultados {pageNumber}</title> // 🔴 Problema: Isso não é uma única string
```

... na verdade causa o componente `<title>` a receber um array de dois elementos como seus filhos (a string `"Página de Resultados"` e o valor de `pageNumber`). Isso causará um erro. Em vez disso, use interpolação de string para passar ao `<title>` uma única string:

```js
<title>{`Página de Resultados ${pageNumber}`}</title>
```