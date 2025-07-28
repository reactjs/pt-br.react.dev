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

<<<<<<< HEAD
`<select>` suporta todas as [props de elementos gerais.](/reference/react-dom/components/common#props)
=======
`<select>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

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

Se não puder aninhar `<select>` dentro de um `<label>`, associe-os passando o mesmo ID para `<select id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflitos entre múltiplas instâncias de um componente, gere um ID com [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Escolha uma fruta:
        <select name="selectedFruit">
          <option value="apple">Maçã</option>
          <option value="banana">Banana</option>
          <option value="orange">Laranja</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Escolha um vegetal:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Pepino</option>
        <option value="corn">Milho</option>
        <option value="tomato">Tomate</option>
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

### Fornecendo uma opção selecionada inicialmente {/*providing-an-initially-selected-option*/}

Por padrão, o navegador selecionará a primeira `<option>` na lista. Para selecionar uma opção diferente por padrão, passe o `value` dessa `<option>` como `defaultValue` para o elemento `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Escolha uma fruta:
      <select name="selectedFruit" defaultValue="orange">
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

<Pitfall>

Diferente do HTML, passar um atributo `selected` para uma `<option>` individual não é suportado.

</Pitfall>

---

### Habilitando seleção múltipla {/*enabling-multiple-selection*/}

Passe `multiple={true}` para o `<select>` para permitir que o usuário selecione várias opções. Nesse caso, se você também especificar `defaultValue` para escolher as opções selecionadas inicialmente, ele deve ser um array.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Escolha algumas frutas:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Maçã</option>
        <option value="banana">Banana</option>
        <option value="orange">Laranja</option>
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

### Lendo o valor da caixa de seleção ao enviar um formulário {/*reading-the-select-box-value-when-submitting-a-form*/}

Adicione um [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) em torno da sua caixa de seleção com um [`<button type="submit">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/button) dentro. Isso chamará o manipulador de evento `<form onSubmit>`. Por padrão, o navegador enviará os dados do formulário para a URL atual e recarregará a página. Você pode substituir esse comportamento chamando `e.preventDefault()`. Leia os dados do formulário com [`new FormData(e.target)`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Impede o navegador de recarregar a página
    e.preventDefault();
    // Lê os dados do formulário
    const form = e.target;
    const formData = new FormData(form);
    // Você pode passar formData diretamente como corpo de uma requisição fetch:
    fetch('/some-api', { method: form.method, body: formData });
    // Você pode gerar uma URL a partir disso, como o navegador faz por padrão:
    console.log(new URLSearchParams(formData).toString());
    // Você pode trabalhar com isso como um objeto simples.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Isso não inclui valores de seleção múltipla
    // Ou você pode obter um array de pares de nome e valor.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Escolha sua fruta favorita:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Maçã</option>
          <option value="banana">Banana</option>
          <option value="orange">Laranja</option>
        </select>
      </label>
      <label>
        Escolha todos os seus vegetais favoritos:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Pepino</option>
          <option value="corn">Milho</option>
          <option value="tomato">Tomate</option>
        </select>
      </label>
      <hr />
      <button type="reset">Redefinir</button>
      <button type="submit">Enviar</button>
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

Atribua um `name` ao seu `<select>`, por exemplo `<select name="selectedFruit" />`. O `name` que você especificou será usado como uma chave nos dados do formulário, por exemplo `{ selectedFruit: "orange" }`.

Se você usar `<select multiple={true}>`, o [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) que você lerá do formulário incluirá cada valor selecionado como um par de nome e valor separado. Observe atentamente os logs do console no exemplo acima.

</Note>

<Pitfall>

Por padrão, *qualquer* `<button>` dentro de um `<form>` irá submetê-lo. Isso pode ser surpreendente! Se você tiver seu próprio componente `Button` no React, considere retornar [`<button type="button">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input/button) em vez de `<button>`. Então, para ser explícito, use `<button type="submit">` para botões que *devem* submeter o formulário.

</Pitfall>

---

### Controlando uma caixa de seleção com uma variável de estado {/*controlling-a-select-box-with-a-state-variable*/}

Uma caixa de seleção como `<select />` é *não controlada.* Mesmo se você [passar um valor selecionado inicialmente](#providing-an-initially-selected-option) como `<select defaultValue="orange" />`, seu JSX apenas especifica o valor inicial, não o valor atual.

**Para renderizar uma caixa de seleção _controlada_, passe a prop `value` para ela.** O React forçará a caixa de seleção a sempre ter o `value` que você passou. Normalmente, você controlará uma caixa de seleção declarando uma [variável de estado:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declara uma variável de estado...
  // ...
  return (
    <select
      value={selectedFruit} // ...força o valor do select a coincidir com a variável de estado...
      onChange={e => setSelectedFruit(e.target.value)} // ...e atualiza a variável de estado a cada alteração!
    >
      <option value="apple">Maçã</option>
      <option value="banana">Banana</option>
      <option value="orange">Laranja</option>
    </select>
  );
}
```

Isso é útil se você deseja re-renderizar alguma parte da interface em resposta a cada seleção.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Escolha uma fruta:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Maçã</option>
          <option value="banana">Banana</option>
          <option value="orange">Laranja</option>
        </select>
      </label>
      <hr />
      <label>
        Escolha todos os seus vegetais favoritos:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Pepino</option>
          <option value="corn">Milho</option>
          <option value="tomato">Tomate</option>
        </select>
      </label>
      <hr />
      <p>Sua fruta favorita: {selectedFruit}</p>
      <p>Seus vegetais favoritos: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Se você passar `value` sem `onChange`, será impossível selecionar uma opção.** Quando você controla uma caixa de seleção, passando um `value` para ela, você *força* a caixa de seleção a sempre manter o valor passado. Portanto, se você passar uma variável de estado como `value`, mas esquecer de atualizar essa variável de estado de forma síncrona no manipulador de evento `onChange`, o React reverterá a caixa de seleção após cada tecla pressionada para o `value` que você especificou.

Diferente do HTML, passar um atributo `selected` para uma `<option>` individual não é suportado.

</Pitfall>
