---
title: "<select>"
---

<Intro>

O [componente `<select>` nativo do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select) permite que você renderize uma caixa de seleção com opções.

```js
<select>
  <option value="someOption">Alguma opção</option>
  <option value="otherOption">Outra opção</option>
</select>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<select>` {/*select*/}

Para exibir uma caixa de seleção, renderize o componente [`<select>` nativo do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Alguma opção</option>
  <option value="otherOption">Outra opção</option>
</select>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<select>` suporta todas as [props de elementos gerais.](/reference/react-dom/components/common#props)

Você pode [tornar uma caixa de seleção controlada](#controlling-a-select-box-with-a-state-variable) passando a prop `value`:

* `value`: Uma string (ou um array de strings para [`multiple={true}`](#enabling-multiple-selection)). Controla qual opção está selecionada. Cada valor de string corresponde ao `value` de algum `<option>` aninhado dentro do `<select>`.

Ao passar `value`, você deve também passar o manipulador `onChange` que atualize o valor passado.

Se o `<select>` for não controlado, você pode passar a prop `defaultValue` em vez disso:

* `defaultValue`: Uma string (ou um array de strings para [`multiple={true}`](#enabling-multiple-selection)). Especifica [a opção selecionada inicialmente.](#providing-an-initially-selected-option)

Essas props `<select>` são relevantes tanto para caixas de seleção controladas e não controladas:

* [`autoComplete`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#autocomplete): Uma string. Especifica um dos possíveis [comportamentos de preenchimento automático.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#autofocus): Um booleano. Se `true`, o React irá focar o elemento ao montar.
* `children`: `<select>` aceita os componentes [`<option>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/optgroup) e [`<datalist>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/datalist) como filhos. Você também pode passar seus próprios componentes, desde que eventualmente renderizam um dos componentes permitidos. Se passar seus próprios componentes, que eventualmente renderizem tags `<option>`, cada `<option>` que você renderize precisa ter um `value`.
* [`disabled`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#disabled): Um booleano. Se `true`, a caixa de seleção não será interativa e aparecerá desativada.
* [`form`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#form): Uma string. Especifica o `id` do `<form>` ao qual esta caixa de seleção pertence. Se omitido, será o formulário pai mais próximo.
* [`multiple`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#multiple): Um booleano. If `true`, o navegador permite [seleção múltipla.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#name): Uma string. Especifica o nome desta caixa de seleção que é [enviado com o formulário.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Uma função de [manipulador de `Event`](/reference/react-dom/components/common#event-handler). Necessário para [caixas de seleção controladas.](#controlling-a-select-box-with-a-state-variable) Dispara imediatamente quando o usuário escolhe uma opção diferente. Se comporta como o [evento de `input`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/input_event) do navegador.
* `onChangeCapture`: Uma versão de `onChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/input_event): Uma função de [manipulador de `Event`](/reference/react-dom/components/common#event-handler). Dispara imediatamente quando o valor é alterado pelo usuário. Por razões históricas, é comum usar `onChange` no React, que funciona de forma similar.
* `onInputCapture`: Uma versão de `onInput` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Uma função de [manipulador de `Event`](/reference/react-dom/components/common#event-handler). Dispara se uma entrada falha na validação ao enviar o formulário. Diferente do evento `invalid` nativo, o evento `onInvalid` do React é propagado.
* `onInvalidCapture`: Uma versão de `onInvalid` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#required): Um booleano. Se `true`, o valor deve ser fornecido para o envio do formulário.
* [`size`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select#size): Um número. Para selects `multiple={true}` selects, especifica o número preferencial de itens visíveis inicialmente.

#### Ressalvas {/*caveats*/}

- Diferente do HTML, passar um atributo `selected` para `<option>` não é suportado. Em vez disso, use [`<select defaultValue>`](#providing-an-initially-selected-option) para caixas de seleção não controladas e [`<select value>`](#controlling-a-select-box-with-a-state-variable) para caixas de seleção controladas.
- Se uma caixa de seleção receber a prop `value`, ela será [tratada como controlada.](#controlling-a-select-box-with-a-state-variable)
- Uma caixa de seleção não pode ser simultaneamente controlada e não controlada.
- Uma caixa de seleção não pode alternar entre ser controlada e não controlada durante sua vida útil.
- Toda caixa de seleção controlada precisa de um manipulador de eventos `onChange` que atualize seu valor de forma síncrona.

---

## Uso {/*usage*/}

### Exibindo uma caixa de seleção com opções {/*displaying-a-select-box-with-options*/}

Renderize um `<select>` com uma lista de componentes `<option>` dentro para exibir uma caixa de seleção. Dê a cada `<option>` um `value` que represente os dados a serem enviados com o formulário.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Escolha uma fruta:
      <select name="selectedFruit">
        <option value="apple">Maçã</option>
        <option value="banana">Banana</option>
        <option value="orange">Laranja</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Fornecendo um rótulo para uma caixa de seleção {/*providing-a-label-for-a-select-box*/}

Normalmente, você colocará cada `<select>` dentro de uma tag [`<label>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/label). Isso informa ao navegador que esse rótulo está associado a essa caixa de seleção. Quando o usuário clica no rótulo, o navegador automaticamente foca na caixa de seleção. Isso também é essencial para acessibilidade: um leitor de tela anunciará a legenda do rótulo quando o usuário focar na caixa de seleção.

If you can't nest `<select>` into a `<label>`, associate them by passing the same ID to `<select id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between multiple instances of one component, generate such an ID with [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Providing an initially selected option {/*providing-an-initially-selected-option*/}

By default, the browser will select the first `<option>` in the list. To select a different option by default, pass that `<option>`'s `value` as the `defaultValue` to the `<select>` element.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

Unlike in HTML, passing a `selected` attribute to an individual `<option>` is not supported.

</Pitfall>

---

### Enabling multiple selection {/*enabling-multiple-selection*/}

Pass `multiple={true}` to the `<select>` to let the user select multiple options. In that case, if you also specify `defaultValue` to choose the initially selected options, it must be an array.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Reading the select box value when submitting a form {/*reading-the-select-box-value-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your select box with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. Read the form data with [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Give a `name` to your `<select>`, for example `<select name="selectedFruit" />`. The `name` you specified will be used as a key in the form data, for example `{ selectedFruit: "orange" }`.

If you use `<select multiple={true}>`, the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) you'll read from the form will include each selected value as a separate name-value pair. Look closely at the console logs in the example above.

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.

</Pitfall>

---

### Controlling a select box with a state variable {/*controlling-a-select-box-with-a-state-variable*/}

A select box like `<select />` is *uncontrolled.* Even if you [pass an initially selected value](#providing-an-initially-selected-option) like `<select defaultValue="orange" />`, your JSX only specifies the initial value, not the value right now.

**To render a _controlled_ select box, pass the `value` prop to it.** React will force the select box to always have the `value` you passed. Typically, you will control a select box by declaring a [state variable:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

This is useful if you want to re-render some part of the UI in response to every selection.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to select an option.** When you control a select box by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the select box after every keystroke back to the `value` that you specified.

Unlike in HTML, passing a `selected` attribute to an individual `<option>` is not supported.

</Pitfall>
