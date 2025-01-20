---
title: renderToString
---

<Pitfall>

`renderToString` não suporta streaming ou esperar por dados. [Veja as alternativas.](#alternativas)

</Pitfall>

<Intro>

`renderToString` renderiza uma árvore React para uma string HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

No servidor, chame `renderToString` para renderizar seu aplicativo em HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#uso)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um nó React que você deseja renderizar em HTML. Por exemplo, um nó JSX como `<App />`.

* **opcional** `options`: Um objeto para renderização no servidor.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar múltiplas raízes na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Retorna {/*returns*/}

Uma string HTML.

#### Ressalvas {/*caveats*/}

* `renderToString` tem suporte limitado para Suspense. Se um componente suspender, `renderToString` envia imediatamente seu fallback como HTML.

* `renderToString` funciona no navegador, mas seu uso no código do cliente é [não recomendado.](#removendo-rendertostring-do-código-do-cliente)

---

## Uso {/*usage*/}

### Renderizando uma árvore React como HTML para uma string {/*rendering-a-react-tree-as-html-to-a-string*/}

Chame `renderToString` para renderizar seu aplicativo em uma string HTML que você pode enviar com sua resposta do servidor:

```js {5-6}
import { renderToString } from 'react-dom/server';

// A sintaxe do manipulador de rota depende do seu framework de backend
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Isso produzirá a saída HTML inicial não interativa de seus componentes React. No cliente, você precisará chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* esse HTML gerado pelo servidor e torná-lo interativo.


<Pitfall>

`renderToString` não suporta streaming ou esperar por dados. [Veja as alternativas.](#alternativas)

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migrando de `renderToString` para um método de streaming no servidor {/*migrando-de-rendertostring-para-um-método-de-streaming-no-servidor*/}

`renderToString` retorna uma string imediatamente, portanto, não suporta streaming ou espera por dados.

Quando possível, recomendamos usar estas alternativas totalmente funcionais:

* Se você usa Node.js, utilize [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Se você usa Deno ou um runtime moderno com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), utilize [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Você pode continuar usando `renderToString` se seu ambiente de servidor não suportar streams.

---

### Removendo `renderToString` do código do cliente {/*removendo-rendertostring-do-código-do-cliente*/}

Às vezes, `renderToString` é usado no cliente para converter algum componente em HTML.

```js {1-2}
// 🚩 Desnecessário: usando renderToString no cliente
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Por exemplo, "<svg>...</svg>"
```

Importar `react-dom/server` **no cliente** aumenta desnecessariamente o tamanho do seu bundle e deve ser evitado. Se você precisa renderizar algum componente em HTML no navegador, utilize [`createRoot`](/reference/react-dom/client/createRoot) e leia o HTML do DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Por exemplo, "<svg>...</svg>"
```

A chamada [`flushSync`](/reference/react-dom/flushSync) é necessária para que o DOM seja atualizado antes de ler sua propriedade [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

---

## Solução de Problemas {/*troubleshooting*/}

### Quando um componente suspende, o HTML sempre contém um fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` não suporta totalmente o Suspense.

Se algum componente suspender (por exemplo, porque está definido com [`lazy`](/reference/react/lazy) ou busca dados), `renderToString` não esperará que seu conteúdo seja resolvido. Em vez disso, `renderToString` encontrará a borda mais próxima [`<Suspense>`](/reference/react/Suspense) acima dele e renderizará sua propriedade `fallback` no HTML. O conteúdo não aparecerá até que o código do cliente carregue.

Para resolver isso, use uma das [soluções de streaming recomendadas.](#migrando-de-rendertostring-para-um-método-de-streaming-no-servidor) Elas podem transmitir conteúdo em partes à medida que se resolvem no servidor, para que o usuário veja a página sendo preenchida progressivamente antes que o código do cliente carregue.