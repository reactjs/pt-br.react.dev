---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` renderiza uma árvore React não interativa para uma string HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

No servidor, chame `renderToStaticMarkup` para renderizar seu aplicativo para HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Ele produzirá saída HTML não interativa de seus componentes React.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um nó React que você deseja renderizar em HTML. Por exemplo, um nó JSX como `<Page />`.
* **opcional** `options`: Um objeto para renderização no servidor.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar vários roots na mesma página.

#### Retorna {/*returns*/}

Uma string HTML.

#### Ressalvas {/*caveats*/}

* A saída de `renderToStaticMarkup` não pode ser hidratada.

* `renderToStaticMarkup` tem suporte limitado para Suspense. Se um componente suspender, `renderToStaticMarkup` envia imediatamente seu fallback como HTML.

* `renderToStaticMarkup` funciona no navegador, mas usá-lo no código do cliente não é recomendado. Se você precisar renderizar um componente para HTML no navegador, [obtenha o HTML renderizando-o em um nó DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Uso {/*usage*/}

### Renderizando uma árvore React não interativa como HTML para uma string {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Chame `renderToStaticMarkup` para renderizar seu aplicativo em uma string HTML que você pode enviar com sua resposta do servidor:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// A sintaxe do manipulador de rota depende da sua estrutura de backend
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Isso produzirá a saída HTML inicial não interativa de seus componentes React.

<Pitfall>

Este método renderiza **HTML não interativo que não pode ser hidratado.** Isso é útil se você deseja usar React como um gerador de página estática simples, ou se estiver renderizando conteúdo completamente estático, como e-mails.

Aplicativos interativos devem usar [`renderToString`](/reference/react-dom/server/renderToString) no servidor e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) no cliente.

</Pitfall>