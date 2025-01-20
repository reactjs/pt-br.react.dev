---
title: preload
canary: true
---

<Canary>

A função `preload` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

Os [frameworks baseados em React](/learn/start-a-new-react-project) frequentemente gerenciam o carregamento de recursos para você, então talvez você não precise chamar esta API você mesmo. Consulte a documentação do seu framework para detalhes.

</Note>

<Intro>

`preload` permite que você busque de forma antecipada um recurso, como uma folha de estilos, uma fonte ou um script externo que você espera usar.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preload(href, options)` {/*preload*/}

Para pré-carregar um recurso, chame a função `preload` de `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preload` fornece ao navegador uma dica de que ele deve começar a baixar o recurso dado, o que pode economizar tempo.

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do recurso que você deseja baixar.
* `options`: um objeto. Contém as seguintes propriedades:
  *  `as`: uma string obrigatória. O tipo de recurso. Seus [valores possíveis](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) são `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: uma string. A [política de CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`. É obrigatória quando `as` é definido como `"fetch"`.
  *  `referrerPolicy`: uma string. O [cabeçalho Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) a ser enviado ao buscar. Seus valores possíveis são `no-referrer-when-downgrade` (o padrão), `no-referrer`, `origin`, `origin-when-cross-origin` e `unsafe-url`.
  *  `integrity`: uma string. Um hash criptográfico do recurso, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: uma string. O tipo MIME do recurso.
  *  `nonce`: uma string. Um [nonce criptográfico para permitir o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo rigorosa. 
  *  `fetchPriority`: uma string. Sugere uma prioridade relativa para buscar o recurso. Os valores possíveis são `auto` (o padrão), `high` e `low`.
  *  `imageSrcSet`: uma string. Para ser usado apenas com `as: "image"`. Especifica o [conjunto de fontes da imagem](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: uma string. Para ser usado apenas com `as: "image"`. Especifica os [tamanhos da imagem](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Retornos {/*returns*/}

`preload` não retorna nada.

#### Ressalvas {/*caveats*/}

* Múltiplas chamadas equivalentes a `preload` têm o mesmo efeito que uma única chamada. Chamadas a `preload` são consideradas equivalentes de acordo com as seguintes regras:
  * Duas chamadas são equivalentes se tiverem o mesmo `href`, exceto:
  * Se `as` for definido como `image`, duas chamadas são equivalentes se tiverem o mesmo `href`, `imageSrcSet` e `imageSizes`.
* No navegador, você pode chamar `preload` em qualquer situação: enquanto renderiza um componente, em um Effect, em um manipulador de eventos etc.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preload` só tem efeito se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.

---

## Uso {/*usage*/}

### Pré-carregando ao renderizar {/*preloading-when-rendering*/}

Chame `preload` ao renderizar um componente se você souber que ele ou seus filhos usarão um recurso específico.

<Recipes titleText="Exemplos de pré-carregamento">

#### Pré-carregando um script externo {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador comece a executar o script imediatamente (em vez de apenas baixá-lo), use [`preinit`](/reference/react-dom/preinit) em vez disso. Se você quiser carregar um módulo ESM, use [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Pré-carregando uma folha de estilos {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Se você quiser que a folha de estilos seja inserida no documento imediatamente (o que significa que o navegador começará a analisá-la imediatamente em vez de apenas baixá-la), use [`preinit`](/reference/react-dom/preinit) em vez disso.

<Solution />

#### Pré-carregando uma fonte {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Se você pré-carregar uma folha de estilos, é inteligente também pré-carregar quaisquer fontes às quais a folha de estilos se refere. Dessa forma, o navegador pode começar a baixar a fonte antes que ele faça o download e análise da folha de estilos.

<Solution />

#### Pré-carregando uma imagem {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Ao pré-carregar uma imagem, as opções `imageSrcSet` e `imageSizes` ajudam o navegador a [buscar a imagem corretamente dimensionada para o tamanho da tela](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Pré-carregando em um manipulador de eventos {/*preloading-in-an-event-handler*/}

Chame `preload` em um manipulador de eventos antes de transitar para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```