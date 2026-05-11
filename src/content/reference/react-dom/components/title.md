---
title: "<title>"
---

<Intro>

O [componente `<title>` do navegador incorporado](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) permite que você especifique o título do documento.

```js
<title>Meu Blog</title>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<title>` {/*title*/}

Para especificar o título do documento, renderize o [componente `<title>` de navegador incorporado](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). Você pode renderizar o `<title>` de qualquer componente, e o React sempre colocará o elemento DOM correspondente no head do documento.

```js
<title>Meu Blog</title>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<title>` suporta todas as [props de elementos comuns.](/reference/react-dom/components/common#common-props)

* `children`: `<title>` aceita apenas texto como um filho. Este texto se tornará o título do documento. Você também pode passar seus próprios componentes desde que eles renderizem apenas texto.

#### Comportamento de renderização especial {/*special-rendering-behavior*/}

<<<<<<< HEAD
O React sempre colocará o elemento DOM correspondente ao componente `<title>` dentro do `<head>` do documento, independentemente de onde na árvore React ele for renderizado. O `<head>` é o único lugar válido para `<title>` existir dentro do DOM, mas é conveniente e mantém as coisas compostas se um componente representando uma página específica pode renderizar seu próprio `<title>`.

Há duas exceções a isso:
* Se `<title>` estiver dentro de um componente `<svg>`, então não há comportamento especial, porque nesse contexto ele não representa o título do documento, mas sim uma [anotação de acessibilidade para esse gráfico SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* Se o `<title>` tiver uma prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), não há comportamento especial, porque nesse caso ele não representa o título do documento, mas sim metadados sobre uma parte específica da página.
=======
React will always place the DOM element corresponding to the `<title>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<title>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render its `<title>` itself.

There are two exception to this:
* If `<title>` is within an `<svg>` component, then there is no special behavior, because in this context it doesn’t represent the document’s title but rather is an [accessibility annotation for that SVG graphic](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* If the `<title>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t represent the document’s title but rather metadata about a specific part of the page.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

<Pitfall>

Renderize apenas um `<title>` por vez. Se mais de um componente renderizar uma tag `<title>` ao mesmo tempo, o React colocará todos esses títulos no head do documento. Quando isso acontece, o comportamento dos navegadores e mecanismos de busca fica indefinido.

</Pitfall>

---

## Uso {/*usage*/}

### Definir o título do documento {/*set-the-document-title*/}

Renderize o componente `<title>` de qualquer componente com texto como seus filhos. O React colocará um nó DOM `<title>` no `<head>` do documento.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>Meu Site: Fale Conosco</title>
      <h1>Fale Conosco</h1>
      <p>Envie um e-mail para support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Use variáveis no título {/*use-variables-in-the-title*/}

Os filhos do componente `<title>` devem ser uma única string de texto. (Ou um único número ou um único objeto com um método `toString`.) Pode não ser óbvio, mas usar chaves JSX assim:

```js
<title>Página de resultados {pageNumber}</title> // 🔴 Problema: Isso não é uma única string
```

... na verdade, faz com que o componente `<title>` receba um array de dois elementos como seus filhos (a string `"Página de resultados"` e o valor de `pageNumber`). Isso causará um erro. Em vez disso, use a interpolação de string para passar ao `<title>` uma única string:

```js
<title>{`Página de resultados ${pageNumber}`}</title>
```
