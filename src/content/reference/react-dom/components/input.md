---
title: "<input>"
---

<Intro>

O [componente `<input>` do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input) integrado permite que você renderize diferentes tipos de entradas de formulário.

```js
<input />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<input>` {/*input*/}

Para exibir uma entrada, renderize o componente [`<input>` do navegador integrado](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

O componente `<input>` aceita todas as [props comuns de elementos.](/reference/react-dom/components/common#common-props)

- [`formAction`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formaction): Uma string ou função. Substitui o `<form action>` pai para `type="submit"` e `type="image"`. Quando uma URL for passada para `action`, o formulário se comportará como um formulário HTML padrão. Quando uma função é passada para `formAction`, a função manipulará o envio do formulário. Veja [`<form action>`](/reference/react-dom/components/form#props).

Você pode [tornar uma entrada controlada](#controlling-an-input-with-a-state-variable) passando uma dessas props:

* [`checked`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement#checked): Um booleano. Para uma entrada do tipo checkbox ou um botão de rádio, controla se está selecionado.
* [`value`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement#value): Uma string. Para uma entrada de texto, controla o seu texto. (Para um botão de rádio, especifica seus dados de formulário.)

Quando você passa qualquer uma delas, também deve passar um manipulador `onChange` que atualiza o valor passado.

Essas props do componente `<input>` são relevantes apenas para entradas não controladas:

* [`defaultChecked`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement#defaultChecked): Um booleano. Especifica [o valor inicial](#providing-an-initial-value-for-an-input) para entradas do tipo `type="checkbox"` e `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement#defaultValue): Uma string. Especifica [o valor inicial](#providing-an-initial-value-for-an-input) para uma entrada de texto.

Essas props do componente `<input>` são relevantes tanto para entradas não controladas quanto para controladas:

* [`accept`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#accept): Uma string. Especifica quais tipos de arquivo são aceitos por uma entrada `type="file"`.
* [`alt`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#alt): Uma string. Especifica o texto alternativo da imagem para uma entrada `type="image"`.
* [`capture`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#capture): Uma string. Especifica a mídia (microfone, vídeo ou câmera) capturada por uma entrada `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#autocomplete): Uma string. Especifica um dos possíveis [comportamentos de preenchimento automático.](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#autofocus): Um booleano. Se `true`, o React focará o elemento na montagem.
* [`dirname`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#dirname): Uma string. Especifica o nome do campo do formulário para a direcionalidade do elemento.
* [`disabled`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#disabled): Um booleano. Se `true`, a entrada não será interativa e aparecerá esmaecida.
* `children`: O componente `<input>` não aceita `children`.
* [`form`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#form): Uma string. Especifica o `id` do componente `<form>` a que esta entrada pertence. Se omitido, é o formulário pai mais próximo.
* [`formAction`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formaction): Uma string. Substitui o `<form action>` pai para `type="submit"` e `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formenctype): Uma string. Substitui o `<form enctype>` pai para `type="submit"` e `type="image"`.
* [`formMethod`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formmethod): Uma string. Substitui o `<form method>` pai para `type="submit"` e `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formnovalidate): Uma string. Substitui o `<form noValidate>` pai para `type="submit"` e `type="image"`.
* [`formTarget`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#formtarget): Uma string. Substitui o `<form target>` pai para `type="submit"` e `type="image"`.
* [`height`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#height): Uma string. Especifica a altura da imagem para `type="image"`.
* [`list`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#list): Uma string. Especifica o `id` do componente `<datalist>` com as opções de preenchimento automático.
* [`max`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#max): Um número. Especifica o valor máximo das entradas numéricas e de data/hora.
* [`maxLength`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#maxlength): Um número. Especifica o comprimento máximo de texto e outras entradas.
* [`min`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#min): Um número. Especifica o valor mínimo das entradas numéricas e de data/hora.
* [`minLength`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#minlength): Um número. Especifica o comprimento mínimo de texto e outras entradas.
* [`multiple`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#multiple): Um booleano. Especifica se vários valores são permitidos para `<type="file"` e `type="email"`.
* [`name`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#name): Uma string. Especifica o nome para esta entrada que é [enviada com o formulário.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Uma função de [`Event` handler](/reference/react-dom/components/common#event-handler). Requerido para [entradas controladas.](#controlling-an-input-with-a-state-variable) Dispara imediatamente quando o valor da entrada é alterado pelo usuário (por exemplo, dispara a cada pressionamento de tecla). Comporta-se como o [evento `input` do navegador.](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Uma versão do `onChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/input_event): Uma função de [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara imediatamente quando o valor é alterado pelo usuário. Por razões históricas, no React é idiomático usar `onChange` em vez disso, que funciona de forma semelhante.
* `onInputCapture`: Uma versão do `onInput` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement/invalid_event): Uma função de [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara se uma entrada falhar na validação ao enviar o formulário. Diferente do evento `invalid` integrado, o evento `onInvalid` do React propaga.
* `onInvalidCapture`: Uma versão do `onInvalid` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLInputElement/select_event): Uma função de [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara após a alteração da seleção dentro do componente `<input>`. O React estende o evento `onSelect` para também disparar para seleção vazia e em edições (que podem afetar a seleção).
* `onSelectCapture`: Uma versão do `onSelect` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#pattern): Uma string. Especifica o padrão que o `value` deve corresponder.
* [`placeholder`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#placeholder): Uma string. Exibido em uma cor esmaecida quando o valor da entrada está vazio.
* [`readOnly`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#readonly): Um booleano. Se `true`, a entrada não é editável pelo usuário.
* [`required`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#required): Um booleano. Se `true`, o valor deve ser fornecido para o formulário ser enviado.
* [`size`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#size): Um número. Semelhante a definir a largura, mas a unidade depende do controle.
* [`src`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#src): Uma string. Especifica a fonte da imagem para uma entrada `type="image"`.
* [`step`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#step): Um número positivo ou uma string `'any'`. Especifica a distância entre valores válidos.
* [`type`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type): Uma string. Um dos [tipos de entrada.](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#width): Uma string. Especifica a largura da imagem para uma entrada `type="image"`.

#### Ressalvas {/*caveats*/}

- Checkboxes precisam de `checked` (ou `defaultChecked`), não de `value` (ou `defaultValue`).
- Se uma entrada de texto receber uma prop `value` string, ela será [tratada como controlada.](#controlling-an-input-with-a-state-variable)
- Se um checkbox ou um botão de rádio receber uma prop `checked` booleana, ele será [tratado como controlado.](#controlling-an-input-with-a-state-variable)
- Uma entrada não pode ser controlada e não controlada ao mesmo tempo.
- Uma entrada não pode alternar entre ser controlada ou não controlada durante sua vida útil.
- Toda entrada controlada precisa de um manipulador de evento `onChange` que atualiza o valor de apoio de forma síncrona.

---

## Uso {/*usage*/}

### Exibindo entradas de diferentes tipos {/*displaying-inputs-of-different-types*/}

Para exibir uma entrada, renderize um componente `<input>`. Por padrão, será uma entrada de texto. Você pode passar `type="checkbox"` para uma checkbox, `type="radio"` para um botão de rádio, [ou um dos outros tipos de entrada.](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Entrada de texto: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Botões de rádio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Opção 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Opção 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Opção 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Fornecendo um rótulo para uma entrada {/*providing-a-label-for-an-input*/}

Normalmente, você colocará cada `<input>` dentro de uma tag [`<label>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/label). Isso informa ao navegador que este rótulo está associado a essa entrada. Quando o usuário clica no rótulo, o navegador focará automaticamente na entrada. Também é essencial para acessibilidade: um leitor de tela anunciará a legenda do rótulo quando o usuário focar na entrada associada.

Se você não puder aninhar `<input>` em um componente `<label>`, associe-os passando o mesmo ID para `<input id>` e [`<label htmlFor>`.](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflitos entre várias instâncias de um componente, gere esse ID com [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Seu primeiro nome:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Sua idade:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Fornecendo um valor inicial para uma entrada {/*providing-an-initial-value-for-an-input*/}

Você pode opcionalmente especificar o valor inicial para qualquer entrada. Passe-o como string `defaultValue` para entradas de texto. Checkboxes e botões de rádio devem especificar o valor inicial com o booleano `defaultChecked` em vez disso.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Entrada de texto: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Botões de rádio:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Opção 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Opção 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Opção 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Lendo os valores de entrada ao enviar um formulário {/*reading-the-input-values-when-submitting-a-form*/}

Adicione um [`<form>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form) ao redor de suas entradas com um [`<button type="submit">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/button) dentro. Ele chamará seu manipulador de evento `<form onSubmit>`. Por padrão, o navegador enviará os dados do formulário para a URL atual e atualizará a página. Você pode substituir esse comportamento chamando `e.preventDefault()`. Leia os dados do formulário com [`new FormData(e.target)`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Impede que o navegador recarregue a página
    e.preventDefault();

    // Leia os dados do formulário
    const form = e.target;
    const formData = new FormData(form);

    // Você pode passar formData como um body de busca diretamente:
    fetch('/some-api', { method: form.method, body: formData });

    // Ou você pode trabalhar com ele como um objeto simples:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Entrada de texto: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Botões de rádio:
        <label><input type="radio" name="myRadio" value="option1" /> Opção 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Opção 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Opção 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Enviar formulário</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Dê um `name` para cada `<input>`, por exemplo, `<input name="firstName" defaultValue="Taylor" />`. O `name` que você especificou será usado como uma chave nos dados do formulário, por exemplo, `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Por padrão, um `<button>` dentro de um `<form>` sem um atributo `type` o enviará. Isso pode ser surpreendente! Se você tiver seu próprio componente `Button` React personalizado, considere usar [`<button type="button">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/button) em vez de `<button>` (sem tipo). Então, para ser mais claro, use `<button type="submit">` para botões que *devem* enviar o formulário.

</Pitfall>

---

### Controlando uma entrada com uma variável de estado {/*controlling-an-input-with-a-state-variable*/}

Uma entrada como `<input />` não é *controlada*. Mesmo se você [passar um valor inicial](#providing-an-initial-value-for-an-input) como `<input defaultValue="Texto inicial" />`, seu JSX apenas especifica o valor inicial. Ele não controla qual deve ser o valor agora.

**Para renderizar uma entrada _controlada_, passe a prop `value` para ela (ou `checked` para checkboxes e rádios).** O React forçará a entrada a sempre ter o `value` que você passou. Normalmente, você faria isso declarando uma [variável de estado:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare uma variável de estado...
  // ...
  return (
    <input
      value={firstName} // ...forçar o valor da entrada a corresponder à variável de estado...
      onChange={e => setFirstName(e.target.value)} // ... e atualizar a variável de estado em qualquer edição!
    />
  );
}
```

Uma entrada controlada faz sentido se você precisasse de estado de qualquer maneira - por exemplo, para renderizar sua UI a cada edição:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        Primeiro nome:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Seu nome é {firstName}.</p>}
      ...
```

Também é útil se você deseja oferecer várias maneiras de ajustar o estado da entrada (por exemplo, clicando em um botão):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Idade:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Adicionar 10 anos
        </button>
```

O `value` que você passa para componentes controlados não deve ser `undefined` ou `null`. Se você precisar que o valor inicial esteja vazio (como no campo `firstName` abaixo), inicialize sua variável de estado com uma string vazia (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Primeiro nome:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Idade:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Adicionar 10 anos
        </button>
      </label>
      {firstName !== '' &&
        <p>Seu nome é {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Sua idade é {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Se você passar `value` sem `onChange`, será impossível digitar na entrada.** Quando você controla uma entrada passando algum `value` para ela, você a *força* a sempre ter o valor que você passou. Portanto, se você passar uma variável de estado como um `value`, mas esquecer de atualizar essa variável de estado de forma síncrona durante o manipulador de eventos `onChange`, o React reverterá a entrada após cada pressionamento de tecla de volta para o `value` que você especificou.

</Pitfall>

---

### Otimizando a renderização a cada pressionamento de tecla {/*optimizing-re-rendering-on-every-keystroke*/}

Quando você usa uma entrada controlada, você define o estado a cada pressionamento de tecla. Se o componente que contém seu estado renderizar uma árvore grande, isso pode ficar lento. Existem algumas maneiras de otimizar o desempenho da renderização.

Por exemplo, suponha que você comece com um formulário que renderiza todo o conteúdo da página a cada pressionamento de tecla:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Como o `<PageContent />` não depende do estado da entrada, você pode mover o estado da entrada para seu próprio componente:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Isso melhora significativamente o desempenho porque agora somente `SignupForm` renderiza a cada pressionamento de tecla.

Se não houver como evitar a renderização (por exemplo, se `PageContent` depender do valor da entrada de pesquisa), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) permite que você mantenha a entrada controlada responsiva mesmo no meio de uma grande renderização.

---

## Solução de problemas {/*troubleshooting*/}

### Minha entrada de texto não atualiza quando digito nela {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Se você renderizar uma entrada com `value`, mas sem `onChange`, verá um erro no console:

```js
// 🔴 Bug: entrada de texto controlada sem manipulador onChange
<input value={something} />
```

<ConsoleBlock level="error">

Você forneceu uma prop `value` para um campo de formulário sem um manipulador `onChange`. Isso renderizará um campo somente leitura. Se o campo deve ser mutável, use `defaultValue`. Caso contrário, defina `onChange` ou `readOnly`.

</ConsoleBlock>

Como a mensagem de erro sugere, se você só queria [especificar o valor *inicial*,](#providing-an-initial-value-for-an-input) passe `defaultValue` em vez disso:

```js
// ✅ Bom: entrada não controlada com um valor inicial
<input defaultValue={something} />
```

Se você quer [controlar esta entrada com uma variável de estado,](#controlling-an-input-with-a-state-variable) especifique um manipulador `onChange`:

```js
// ✅ Bom: entrada controlada com onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Se o valor for intencionalmente somente leitura, adicione uma prop `readOnly` para suprimir o erro:

```js
// ✅ Bom: entrada controlada somente leitura sem alteração
<input value={something} readOnly={true} />
```

---

### Minha checkbox não atualiza quando clico nela {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Se você renderizar uma checkbox com `checked`, mas sem `onChange`, verá um erro no console:

```js
// 🔴 Bug: checkbox controlada sem manipulador onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Você forneceu uma prop `checked` para um campo de formulário sem um manipulador `onChange`. Isso renderizará um campo somente leitura. Se o campo deve ser mutável, use `defaultChecked`. Caso contrário, defina `onChange` ou `readOnly`.

</ConsoleBlock>

Como a mensagem de erro sugere, se você só queria [especificar o valor *inicial*,](#providing-an-initial-value-for-an-input) passe `defaultChecked` em vez disso:

```js
// ✅ Bom: checkbox não controlada com um valor inicial
<input type="checkbox" defaultChecked={something} />
```

Se você quer [controlar esta checkbox com uma variável de estado,](#controlling-an-input-with-a-state-variable) especifique um manipulador `onChange`:

```js
// ✅ Bom: checkbox controlada com onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Você precisa ler `e.target.checked` em vez de `e.target.value` para checkboxes.

</Pitfall>

Se a checkbox for intencionalmente somente leitura, adicione uma prop `readOnly` para suprimir o erro:

```js
// ✅ Bom: entrada controlada somente leitura sem alteração
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Meu cursor de entrada pula para o início a cada pressionamento de tecla {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Se você [controla uma entrada,](#controlling-an-input-with-a-state-variable) você deve atualizar sua variável de estado para o valor da entrada do DOM durante `onChange`.

Você não pode atualizá-lo para algo diferente de `e.target.value` (ou `e.target.checked` para checkboxes):

```js
function handleChange(e) {
  // 🔴 Bug: atualizando uma entrada para algo diferente de e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Você também não pode atualizá-lo de forma assíncrona:

```js
function handleChange(e) {
  // 🔴 Bug: atualizando uma entrada de forma assíncrona
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Para corrigir seu código, atualize-o de forma síncrona para `e.target.value`:

```js
function handleChange(e) {
  // ✅ Atualizando uma entrada controlada para e.target.value de forma síncrona
  setFirstName(e.target.value);
}
```

Se isso não resolver o problema, é possível que a entrada seja removida e readicionada do DOM a cada pressionamento de tecla. Isso pode acontecer se você estiver [redefinindo acidentalmente o estado](/learn/preserving-and-resetting-state) a cada renderização, por exemplo, se a entrada ou um de seus pais sempre receber um atributo `key` diferente, ou se você aninhar definições de função de componente (o que não é suportado e faz com que o componente "interno" seja sempre considerado uma árvore diferente).

---

### Estou recebendo um erro: "Um componente está alterando uma entrada não controlada para ser controlada" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Se você fornecer um `value` para o componente, ele deve permanecer uma string durante sua vida útil.

Você não pode passar `value={undefined}` primeiro e depois passar `value="some string"` porque o React não saberá se você deseja que o componente seja não controlado ou controlado. Um componente controlado sempre deve receber um `value` string, não `null` ou `undefined`.

Se seu `value` estiver vindo de uma API ou de uma variável de estado, ele pode ser inicializado como `null` ou `undefined`. Nesse caso, defina-o como uma string vazia (`''`) inicialmente ou passe `value={someValue ?? ''}` para garantir que `value` seja uma string.

Da mesma forma, se você passar `checked` para uma checkbox, certifique-se de que seja sempre um booleano.
