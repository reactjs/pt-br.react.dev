---
title: "<form>"
canary: true
---

<Canary>

As extensões do React para `<form>` estão atualmente disponíveis apenas nos canais canary e experimental do React. Nas versões estáveis do React, `<form>` funciona apenas como um [componente HTML embutido do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

O [componente `<form>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) permite criar controles interativos para enviar informações.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Pesquisar</button>
</form>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<form>` {/*form*/}

Para criar controles interativos para enviar informações, renderize o [componente `<form>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Pesquisar</button>
</form>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<form>` suporta todas as [props comuns de elementos.](/reference/react-dom/components/common#props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): uma URL ou função. Quando uma URL é passada para `action`, o formulário se comportará como o componente de formulário HTML. Quando uma função é passada para `action`, a função lidará com o envio do formulário. A função passada para `action` pode ser assíncrona e será chamada com um único argumento contendo os [dados do formulário](https://developer.mozilla.org/en-US/docs/Web/API/FormData) do formulário enviado. A prop `action` pode ser sobrescrita por um atributo `formAction` em um componente `<button>`, `<input type="submit">` ou `<input type="image">`.

#### Ressalvas {/*caveats*/}

* Quando uma função é passada para `action` ou `formAction`, o método HTTP será POST, independentemente do valor da prop `method`.

---

## Uso {/*usage*/}

### Lidar com o envio do formulário no cliente {/*handle-form-submission-on-the-client*/}

Passe uma função para a prop `action` do formulário para executar a função quando o formulário for enviado. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) será passado para a função como um argumento, para que você possa acessar os dados enviados pelo formulário. Isso difere da [ação HTML convencional](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action), que aceita apenas URLs.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`Você pesquisou por '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Pesquisar</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Lidar com o envio do formulário com uma Ação do Servidor {/*handle-form-submission-with-a-server-action*/}

Renderize um `<form>` com um campo de entrada e botão de envio. Passe uma Ação do Servidor (uma função marcada com [`'use server'`](/reference/rsc/use-server)) para a prop `action` do formulário para executar a função quando o formulário for enviado.

Passar uma Ação do Servidor para `<form action>` permite que os usuários enviem formulários sem JavaScript habilitado ou antes que o código tenha sido carregado. Isso é benéfico para usuários que têm uma conexão lenta, um dispositivo com pouca capacidade ou têm JavaScript desabilitado, e é semelhante à forma como os formulários funcionam quando uma URL é passada para a prop `action`.

Você pode usar campos de formulário ocultos para fornecer dados à ação do `<form>`. A Ação do Servidor será chamada com os dados dos campos de formulário ocultos como uma instância de [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Adicionar ao Carrinho</button>
    </form>

  );
}
```

Em vez de usar campos de formulário ocultos para fornecer dados à ação do `<form>`, você pode chamar o <CodeStep step={1}>`bind`</CodeStep> para fornecê-lo com argumentos extras. Isso irá vincular um novo argumento (<CodeStep step={2}>`productId`</CodeStep>) à função, além do <CodeStep step={3}>`formData`</CodeStep> que é passado como um argumento para a função.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );
}
```

Quando `<form>` é renderizado por um [Componente do Servidor](/reference/rsc/use-client), e uma [Ação do Servidor](/reference/rsc/use-server) é passada para a prop `action` do `<form>`, o formulário é [progressivamente aprimorado](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Exibir um estado de pendência durante o envio do formulário {/*display-a-pending-state-during-form-submission*/}
Para exibir um estado de pendência ao enviar um formulário, você pode chamar o Hook `useFormStatus` em um componente renderizado em um `<form>` e ler a propriedade `pending` retornada.

Aqui, usamos a propriedade `pending` para indicar que o formulário está sendo enviado.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

Para saber mais sobre o Hook `useFormStatus`, consulte a [documentação de referência](/reference/react-dom/hooks/useFormStatus).

### Atualizando otimisticamente os dados do formulário {/*optimistically-updating-form-data*/}
O Hook `useOptimistic` fornece uma maneira de atualizar otimisticamente a interface do usuário antes que uma operação de segundo plano, como uma requisição de rede, seja concluída. No contexto dos formulários, essa técnica ajuda a tornar os aplicativos mais responsivos. Quando um usuário envia um formulário, em vez de esperar pela resposta do servidor para refletir as alterações, a interface é imediatamente atualizada com o resultado esperado.

Por exemplo, quando um usuário digita uma mensagem no formulário e pressiona o botão "Enviar", o Hook `useOptimistic` permite que a mensagem apareça imediatamente na lista com um rótulo "Enviando...", mesmo antes da mensagem ser realmente enviada para um servidor. Essa abordagem "otimista" dá a impressão de velocidade e responsividade. O formulário então tenta realmente enviar a mensagem em segundo plano. Assim que o servidor confirma que a mensagem foi recebida, o rótulo "Enviando..." é removido.

<Sandpack>

```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Enviando...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Olá!" />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Olá!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

[//]: # 'Descomente a próxima linha, e exclua esta linha após a página de documentação de referência `useOptimistic` ser publicada'
[//]: # 'Para saber mais sobre o Hook `useOptimistic`, consulte a [documentação de referência](/reference/react/hooks/useOptimistic).'

### Tratando erros de envio do formulário {/*handling-form-submission-errors*/}

Em alguns casos, a função chamada pela prop `action` de um `<form>` lança um erro. Você pode tratar esses erros envolvendo o `<form>` em um Error Boundary. Se a função chamada pela prop `action` de um `<form>` lançar um erro, o fallback para a boundary de erro será exibido.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("erro de pesquisa");
  }
  return (
    <ErrorBoundary
      fallback={<p>Ocorreu um erro ao enviar o formulário</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Pesquisar</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Exibir um erro de envio do formulário sem JavaScript {/*display-a-form-submission-error-without-javascript*/}

Exibir uma mensagem de erro de envio do formulário antes que o pacote JavaScript carregue para aprimoramento progressivo requer que:

1. `<form>` seja renderizado por um [Componente do Servidor](/reference/rsc/use-client)
1. a função passada para a prop `action` do `<form>` seja uma [Ação do Servidor](/reference/rsc/use-server)
1. o Hook `useActionState` seja usado para exibir a mensagem de erro

`useActionState` aceita dois parâmetros: uma [Ação do Servidor](/reference/rsc/use-server) e um estado inicial. `useActionState` retorna dois valores, uma variável de estado e uma ação. A ação retornada pelo `useActionState` deve ser passada para a prop `action` do formulário. A variável de estado retornada pelo `useActionState` pode ser usada para exibir uma mensagem de erro. O valor retornado pela [Ação do Servidor](/reference/rsc/use-server) passada para `useActionState` será usado para atualizar a variável de estado.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Adicionado "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Inscreva-se para minha newsletter</h1>
      <p>Inscreva-se com o mesmo email duas vezes para ver um erro</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Inscrever-se</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("Este endereço de email já foi adicionado");
  }
  emails.push(newEmail);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

Saiba mais sobre atualizar o estado a partir de uma ação de formulário com a documentação do [`useActionState`](/reference/react/useActionState)

### Tratando múltiplos tipos de envio {/*handling-multiple-submission-types*/}

Os formulários podem ser projetados para lidar com várias ações de envio, com base no botão pressionado pelo usuário. Cada botão dentro de um formulário pode ser associado a uma ação ou comportamento distinto definindo a prop `formAction`.

Quando um usuário clica em um botão específico, o formulário é enviado, e uma ação correspondente, definida pelos atributos e ação daquele botão, é executada. Por exemplo, um formulário pode enviar um artigo para revisão por padrão, mas ter um botão separado com `formAction` definido para salvar o artigo como um rascunho.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' foi publicado com o botão '${button}'`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Seu rascunho de '${content}' foi salvo!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publicar</button>
      <button formAction={save}>Salvar rascunho</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>