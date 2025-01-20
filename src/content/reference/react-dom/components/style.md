---
style: "<style>"
canary: true
---

<Canary>

As extensões do React para `<style>` estão atualmente disponíveis apenas nos canais canário e experimental do React. Em versões estáveis do React, `<style>` funciona apenas como um [componente HTML padrão do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

O [componente `<style>` padrão do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) permite que você adicione folhas de estilo CSS inline ao seu documento.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<style>` {/*style*/}

Para adicionar estilos inline ao seu documento, renderize o [componente `<style>` padrão do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). Você pode renderizar `<style>` de qualquer componente e o React [em certos casos](#special-rendering-behavior) colocará o correspondente elemento DOM no cabeçalho do documento e deduplicará estilos idênticos.

```js
<style>{` p { color: red; } `}</style>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<style>` suporta todas as [props de elemento comuns.](/reference/react-dom/components/common#props)

* `children`: uma string, obrigatória. O conteúdo da folha de estilo.
* `precedence`: uma string. Diz ao React onde classificar o nó DOM `<style>` em relação a outros no `<head>` do documento, o que determina qual folha de estilo pode sobrescrever a outra. Seu valor pode ser (em ordem de precedência) `"reset"`, `"low"`, `"medium"`, `"high"`. Folhas de estilo com a mesma precedência vão juntas, independentemente de serem tags `<link>` ou `<style>` inline ou carregadas usando as funções [`preload`](/reference/react-dom/preload) ou [`preinit`](/reference/react-dom/preinit).
* `href`: uma string. Permite que o React [deduplicate estilos](#special-rendering-behavior) que têm o mesmo `href`.
* `media`: uma string. Restringe a folha de estilo a uma certa [consulta de mídia](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `nonce`: uma string. Um [nonce criptográfico para permitir o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo rígida.
* `title`: uma string. Especifica o nome de uma [folha de estilo alternativa](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Props que **não são recomendadas** para uso com o React:

* `blocking`: uma string. Se definido como `"render"`, instrui o navegador a não renderizar a página até que a folha de estilo seja carregada. O React fornece um controle mais refinado usando Suspense.

#### Comportamento de renderização especial {/*special-rendering-behavior*/}

O React pode mover componentes `<style>` para o `<head>` do documento, deduplicar folhas de estilo idênticas e [suspender](/reference/react/Suspense) enquanto a folha de estilo está sendo carregada.

Para optar por esse comportamento, forneça as props `href` e `precedence`. O React deduplicará estilos se eles tiverem o mesmo `href`. A prop de precedência diz ao React onde classificar o nó DOM `<style>` em relação a outros no `<head>` do documento, o que determina qual folha de estilo pode sobrescrever a outra.

Esse tratamento especial vem com duas ressalvas:

* O React ignorará alterações nas props após o estilo ter sido renderizado. (O React emitirá um aviso em desenvolvimento se isso acontecer.)
* O React pode deixar o estilo no DOM mesmo após o componente que o renderizou ter sido desmontado.

---

## Uso {/*usage*/}

### Renderizando uma folha de estilo CSS inline {/*rendering-an-inline-css-stylesheet*/}

Se um componente depende de certos estilos CSS para ser exibido corretamente, você pode renderizar uma folha de estilo inline dentro do componente.

Se você fornecer uma prop `href` e `precedence`, seu componente será suspenso enquanto a folha de estilo está sendo carregada. (Mesmo com folhas de estilo inline, pode haver um tempo de carregamento devido a fontes e imagens às quais a folha de estilo se refere.) A prop `href` deve identificar exclusivamente a folha de estilo, porque o React deduplicará folhas de estilo que tenham o mesmo `href`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>