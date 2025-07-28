---
title: "<form>"
---

<Intro>

O [componente `<form>` do navegador embutido](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form) permite que você crie controles interativos para enviar informações.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<form>` {/*form*/}

Para criar controles interativos para enviar informações, renderize o [componente `<form>` do navegador embutido](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

<<<<<<< HEAD
`<form>` suporta todas as [props de elementos comuns.](/reference/react-dom/components/common#props)
=======
`<form>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

[`action`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form#action): uma URL ou função. Quando uma URL é passada para `action`, o formulário se comportará como o componente de formulário HTML. Quando uma função é passada para `action`, a função irá manipular o envio do formulário. A função passada para `action` pode ser async e será chamada com um único argumento contendo os [dados do formulário](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) do formulário enviado. A prop `action` pode ser substituída por um atributo `formAction` em um componente `<button>`, `<input type="submit">` ou `<input type="image">`.

#### Ressalvas {/*caveats*/}

* Quando uma função é passada para `action` ou `formAction`, o método HTTP será POST, independentemente do valor da prop `method`.

---

## Uso {/*usage*/}

### Manipular envio de formulário no cliente {/*handle-form-submission-on-the-client*/}

Passe uma função para a prop `action` do formulário para executar a função quando o formulário for enviado. [`formData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) será passado para a função como um argumento para que você possa acessar os dados enviados pelo formulário. Isso difere da [ação HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form#action) convencional, que aceita apenas URLs. Após a execução da função `action`, todos os elementos de campo não controlados no formulário são redefinidos.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

### Manipular envio de formulário com uma Server Function {/*handle-form-submission-with-a-server-function*/}

Renderize um `<form>` com um input e um botão de envio. Passe uma Server Function (uma função marcada com [`'use server'`](/reference/rsc/use-server)) para a prop `action` do formulário para executar a função quando o formulário for enviado.

Passar uma Server Function para `<form action>` permite que os usuários enviem formulários sem o JavaScript ativado ou antes que o código seja carregado. Isso é benéfico para usuários que têm uma conexão lenta, dispositivo ou têm o JavaScript desativado e é semelhante à maneira como os formulários funcionam quando uma URL é passada para a prop `action`.

Você pode usar campos de formulário ocultos para fornecer dados para a ação do `<form>`. A Server Function será chamada com os dados do campo de formulário oculto como uma instância de [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData).

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
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

Em vez de usar campos de formulário ocultos para fornecer dados à ação do `<form>`, você pode chamar o método <CodeStep step={1}>`bind`</CodeStep> para fornecer argumentos extras. Isso vinculará um novo argumento (<CodeStep step={2}>`productId`</CodeStep>) à função, além do <CodeStep step={3}>`formData`</CodeStep> que é passado como argumento para a função.

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
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Quando o `<form>` é renderizado por um [Server Component](/reference/rsc/use-client), e uma [Server Function](/reference/rsc/server-functions) é passada para a prop `action` do `<form>`, o formulário é [progressivamente aprimorado](https://developer.mozilla.org/pt-BR/docs/Glossary/Progressive_Enhancement).

### Exibir um estado pendente durante o envio do formulário {/*display-a-pending-state-during-form-submission*/}
Para exibir um estado pendente quando um formulário está sendo enviado, você pode chamar o Hook `useFormStatus` em um componente renderizado em um `<form>` e ler a propriedade `pending` retornada.

Aqui, usamos a propriedade `pending` para indicar que o formulário está sendo enviado.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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

</Sandpack>

Para saber mais sobre o Hook `useFormStatus`, consulte a [documentação de referência](/reference/react-dom/hooks/useFormStatus).

### Atualizando otimistamente dados do formulário {/*optimistically-updating-form-data*/}
O Hook `useOptimistic` fornece uma maneira de atualizar otimistamente a interface do usuário antes que uma operação em segundo plano, como uma solicitação de rede, seja concluída. No contexto de formulários, essa técnica ajuda a tornar os aplicativos mais responsivos. Quando um usuário envia um formulário, em vez de esperar pela resposta do servidor para refletir as alterações, a interface é imediatamente atualizada com o resultado esperado.

Por exemplo, quando um usuário digita uma mensagem no formulário e pressiona o botão "Enviar", o Hook `useOptimistic` permite que a mensagem apareça imediatamente na lista com um rótulo "Enviando...", mesmo antes que a mensagem seja realmente enviada para um servidor. Essa abordagem "otimista" dá a impressão de velocidade e responsividade. O formulário então tenta enviar a mensagem de verdade em segundo plano. Depois que o servidor confirma que a mensagem foi recebida, o rótulo "Enviando..." é removido.

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
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
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

</Sandpack>

<<<<<<< HEAD
[//]: # 'Remova o comentário da próxima linha e exclua esta linha após a publicação da página de documentação de referência `useOptimistic`'
[//]: # 'Para saber mais sobre o Hook `useOptimistic`, consulte a [documentação de referência](/reference/react/hooks/useOptimistic).'
=======
[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/useOptimistic).'
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

### Lidando com erros de envio de formulário {/*handling-form-submission-errors*/}

Em alguns casos, a função chamada pela prop `action` de um `<form>` lança um erro. Você pode tratar esses erros envolvendo o `<form>` em um Error Boundary. Se a função chamada pela prop `action` de um `<form>` lançar um erro, o fallback para o error boundary será exibido.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Exibir um erro de envio de formulário sem JavaScript {/*display-a-form-submission-error-without-javascript*/}

Exibir uma mensagem de erro de envio de formulário antes que o bundle JavaScript seja carregado para aprimoramento progressivo exige que:

1. `<form>` seja renderizado por um [Server Component](/reference/rsc/use-client)
1. a função passada para a prop `action` do `<form>` seja uma [Server Function](/reference/rsc/server-functions)
1. o Hook `useActionState` seja usado para exibir a mensagem de erro

`useActionState` recebe dois parâmetros: um [Server Function](/reference/rsc/server-functions) e um estado inicial. `useActionState` retorna dois valores, uma variável de estado e uma ação. A ação retornada por `useActionState` deve ser passada para a prop `action` do formulário. A variável de estado retornada por `useActionState` pode ser usada para exibir uma mensagem de erro. O valor retornado pela Server Function passada para `useActionState` será usado para atualizar a variável de estado.

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
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
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
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Saiba mais sobre como atualizar o estado de uma ação de formulário com a documentação [`useActionState`](/reference/react/useActionState)

### Lidar com vários tipos de envio {/*handling-multiple-submission-types*/}

Os formulários podem ser projetados para lidar com várias ações de envio com base no botão pressionado pelo usuário. Cada botão dentro de um formulário pode ser associado a uma ação ou comportamento distinto definindo a prop `formAction`.

Quando um usuário toca em um botão específico, o formulário é enviado e uma ação correspondente, definida pelos atributos e ação daquele botão, é executada. Por exemplo, um formulário pode, por padrão, enviar um artigo para revisão, mas ter um botão separado com o `formAction` definido para salvar o artigo como um rascunho.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>