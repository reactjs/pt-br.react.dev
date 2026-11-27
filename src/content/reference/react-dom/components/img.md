---
title: "<img>"
---

<Intro>

O [componente `<img>` nativo do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) permite que você incorpore uma imagem.

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<img>` {/*img*/}

Para exibir uma imagem, renderize o [componente `<img>` nativo do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<img>` suporta todas as [props comuns de elemento.](/reference/react-dom/components/common#common-props)

* `alt`: uma string. Especifica o texto alternativo da imagem. Use uma string vazia para uma imagem puramente decorativa.
* `crossOrigin`: uma string. Especifica a [política de CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada ao buscar a imagem. Os valores possíveis são `anonymous` e `use-credentials`.
* `decoding`: uma string. Sugere se o navegador deve esperar a decodificação da imagem antes de apresentar outros conteúdos. Os valores possíveis são `async`, `sync` e `auto` (o padrão).
* `fetchPriority`: uma string. Sugere uma prioridade relativa para a busca da imagem. Os valores possíveis são `high`, `low` e `auto` (o padrão). Durante a renderização no servidor, `fetchPriority="low"` também impede que o React [pré-carregue a imagem automaticamente.](#controlling-image-preloading-during-server-rendering)
* `height`: um número ou uma string. Especifica a altura renderizada da imagem.
* `loading`: uma string. Especifica se o navegador deve adiar o carregamento da imagem até que ela esteja perto da viewport. Os valores possíveis são `eager` (o padrão) e `lazy`. Definir `loading="lazy"` impede que o React [pré-carregue a imagem automaticamente.](#controlling-image-preloading-during-server-rendering)
* `onError`: uma função [manipuladora de eventos (event handler)](/reference/react-dom/components/common#event-handler). É disparada quando a imagem falha ao carregar.
* `onLoad`: uma função [manipuladora de eventos (event handler)](/reference/react-dom/components/common#event-handler). É disparada quando a imagem termina de carregar. Passar `onLoad` impede que o React [espere pela imagem durante uma atualização com View Transition renderizada no cliente.](#waiting-for-an-image-during-a-view-transition)
* `referrerPolicy`: uma string. Especifica as [informações de referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy) a serem enviadas ao buscar a imagem.
* `sizes`: uma string. Especifica os tamanhos da imagem para diferentes layouts de página. Usada com `srcSet`.
* `src`: uma string. Especifica a URL da imagem.
* `srcSet`: uma string. Especifica uma ou mais fontes de imagem candidatas para o navegador escolher.
* `useMap`: uma string. Associa a imagem a um [mapa de imagem do lado do cliente](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map).
* `width`: um número ou uma string. Especifica a largura renderizada da imagem.

#### Ressalvas {/*caveats*/}

* Não passe uma string vazia para `src`. Isso pode fazer com que o navegador solicite a página atual novamente. O React emite um aviso em desenvolvimento e omite o atributo. Para não renderizar nenhuma imagem, omita o `<img>` ou passe `null` para `src`.
* `<img>` não pode ter filhos nem usar `dangerouslySetInnerHTML`. O React lança um erro se você passar qualquer um deles.
* `fetchPriority="low"` não impede que o React espere a imagem carregar durante uma atualização com View Transition renderizada no cliente. Use `loading="lazy"` ou um manipulador `onLoad` para desativar esse comportamento.

---

## Uso {/*usage*/}

### Exibindo uma imagem {/*displaying-an-image*/}

Passe a URL da imagem para `src` e uma descrição em texto para `alt`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

Especifique `width` e `height` quando souber as dimensões da imagem, para que o navegador possa reservar espaço antes de a imagem carregar. Para uma imagem decorativa, passe `alt=""` para que os leitores de tela a ignorem.

---

### Controlando o pré-carregamento de imagens durante a renderização no servidor {/*controlling-image-preloading-during-server-rendering*/}

Durante a renderização no servidor, o React gera automaticamente, por padrão, uma dica de pré-carregamento (preload) para um `<img>`. Isso pode permitir que o navegador comece a buscar a imagem antes de encontrar o `<img>` no HTML renderizado.

Adicione `loading="lazy"` ou `fetchPriority="low"` a uma imagem que não deve receber essa dica:

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Featured product" />
      <img src="thumbnail.jpg" alt="Related product" loading="lazy" />
      <img src="secondary.jpg" alt="Another product" fetchPriority="low" />
    </>
  );
}
```

Neste exemplo, o React gera uma dica de pré-carregamento apenas para `hero.jpg`. Dependendo da API de servidor ou do framework, o React pode renderizar o equivalente a este elemento:

```html
<link rel="preload" as="image" href="hero.jpg" />
```

Em vez disso, o React pode fornecer a mesma dica em um cabeçalho de resposta `Link`. As outras duas imagens mantêm suas props `loading` e `fetchPriority` no HTML renderizado, mas o React não gera dicas de pré-carregamento para elas. A prop `loading="lazy"` pede ao navegador que adie o carregamento de uma imagem até que ela se aproxime da viewport. A prop `fetchPriority="low"` permite que a imagem carregue imediatamente, mas informa ao navegador que ela deve ser buscada com prioridade mais baixa.

O React também não pré-carrega automaticamente uma imagem quando ela está dentro de um elemento `<picture>` ou `<noscript>`, ou quando seu `src` ou `srcSet` é uma data URL.

Se você renderiza uma imagem por meio de um framework ou de uma biblioteca de componentes, consulte a documentação dele para saber o comportamento padrão. O React decide se deve gerar um pré-carregamento automático a partir das props do `<img>` subjacente. Por exemplo, um componente de imagem pode adicionar `loading="lazy"` por padrão e fornecer uma opção separada para pré-carregar explicitamente imagens selecionadas.

Para criar uma dica de pré-carregamento explícita, chame [`preload`](/reference/react-dom/preload).

---

### Esperando por uma imagem durante uma View Transition {/*waiting-for-an-image-during-a-view-transition*/}

Durante uma atualização de [`<ViewTransition>`](/reference/react/ViewTransition), o React espera até 500 ms para que as imagens visíveis carreguem antes de iniciar a animação. Isso inclui elementos `<img>` recém-renderizados e imagens existentes cujo `src` ou `srcSet` muda. Definir `loading="lazy"` ou adicionar um manipulador `onLoad` exclui a imagem desse comportamento.

Compare como a mesma imagem aparece quando um limite de Suspense revela seu conteúdo dentro e fora de um `<ViewTransition>`:

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
} from 'react';
import { fetchImageSrc } from './image.js';

function Profile({ cacheKey }) {
  const src = use(fetchImageSrc(cacheKey));
  return (
    <div className="card">
      <img src={src} alt="" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [showWithTransition, setShowWithTransition] =
    useState(false);
  const [showWithoutTransition, setShowWithoutTransition] =
    useState(false);
  return (
    <>
      <button onClick={() => setShowWithTransition(true)}>
        Show profile with View Transition
      </button>
      {showWithTransition && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile cacheKey="with-transition" />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <button onClick={() => setShowWithoutTransition(true)}>
        Show profile without View Transition
      </button>
      {showWithoutTransition && (
        <Suspense fallback={<ProfilePlaceholder />}>
          <Profile cacheKey="without-transition" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/image.js hidden
// Normalmente, a lógica de cache ficaria dentro de um framework.
const cache = new Map();

export function fetchImageSrc(cacheKey) {
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, loadImageSrc());
  }
  return cache.get(cacheKey);
}

async function loadImageSrc() {
  // Atrasa a resposta para que o fallback do Suspense fique visível.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Adiciona um parâmetro único para que a imagem não fique em cache.
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Com `<ViewTransition>`, o React mantém o skeleton visível por até 500 ms enquanto a imagem carrega, para que o card possa ser revelado com a imagem já no lugar. Sem `<ViewTransition>`, o Suspense deixa de mostrar o skeleton assim que a Promise é resolvida. Se a imagem ainda estiver carregando, o card aparece primeiro e a imagem surge logo depois.
