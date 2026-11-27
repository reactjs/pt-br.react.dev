---
title: requestFormReset
---

<Intro>

`requestFormReset` permite que você redefina um formulário gerenciado pelo React após a conclusão de uma Action ou Transition.

```js
requestFormReset(form)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `requestFormReset(form)` {/*requestformreset*/}

Chame `requestFormReset` para solicitar que um formulário seja redefinido após a conclusão da Action ou Transition atual.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function handleSubmit(form) {
  startTransition(async () => {
    const formData = new FormData(form);
    requestFormReset(form);
    await save(formData);
  });
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `form`: um [elemento de formulário HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) renderizado pelo React.

#### Retorna {/*returns*/}

`requestFormReset` não retorna nada.

#### Ressalvas {/*caveats*/}

* Passe um elemento de formulário renderizado pelo React. Passar um elemento que não seja um formulário, ou um formulário não gerenciado pelo React, lança um erro.
* `requestFormReset` foi feito para Actions e Transitions. Se for chamado fora de uma Action ou Transition, o React emite um aviso em desenvolvimento e executa uma redefinição síncrona.
* `requestFormReset` é útil quando você mesmo implementa a lógica de envio do formulário (por exemplo, com `onSubmit` + `startTransition`) e ainda quer o comportamento de redefinição de formulário do React.
* Esta API solicita a redefinição de campos de formulário não controlados. Para campos controlados, trate a redefinição atualizando o state, por exemplo, em `onReset`.

---

## Uso {/*usage*/}

### Solicitando uma redefinição em uma Action de formulário personalizada {/*requesting-a-reset-in-a-custom-form-action*/}

O React [redefine automaticamente os campos não controlados após um envio bem-sucedido de `<form action={...}>`](/reference/react-dom/components/form#handle-form-submission-with-an-action-prop). Quando você implementa o envio manualmente, pode optar pelo mesmo comportamento chamando `requestFormReset`.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function SearchForm() {
  async function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      requestFormReset(form);
      await submitSearch(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="query" defaultValue="react" />
      <button type="submit">Search</button>
    </form>
  );
}
```

Se o seu envio usa o comportamento nativo de `<form action={...}>`, você não precisa chamar `requestFormReset` manualmente.
