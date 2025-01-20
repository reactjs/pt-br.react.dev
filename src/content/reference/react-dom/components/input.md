---
title: "<input>"
---

<Intro>

O componente de `<input>` [embarcado no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) permite renderizar diferentes tipos de entradas de formulário.

```js
<input />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<input>` {/*input*/}

Para exibir uma entrada, renderize o componente de `<input>` [embarcado no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<input>` suporta todas as [props de elemento comuns.](/reference/react-dom/components/common#props)

<Canary>

As extensões do React para a prop `formAction` estão atualmente disponíveis apenas nos canais Canary e experimentais do React. Nas versões estáveis do React, `formAction` funciona apenas como um [componente HTML embutido do navegador](/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Uma string ou função. Substitui a `<form action>` do pai para `type="submit"` e `type="image"`. Quando uma URL é passada para `action`, o formulário se comportará como um formulário HTML padrão. Quando uma função é passada para `formAction`, a função lidará com a submissão do formulário. Veja [`<form action>`](/reference/react-dom/components/form#props).

Você pode [tornar um input controlado](#controlling-an-input-with-a-state-variable) passando uma dessas props:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Um booleano. Para uma entrada de checkbox ou um botão de rádio, controla se ele está selecionado.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Uma string. Para uma entrada de texto, controla seu texto. (Para um botão de rádio, especifica seus dados de formulário.)

Ao passar qualquer um deles, você também deve passar um manipulador `onChange` que atualiza o valor passado.

Essas props `<input>` são relevantes apenas para entradas não controladas:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Um booleano. Especifica [o valor inicial](#providing-an-initial-value-for-an-input) para entradas `type="checkbox"` e `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Uma string. Especifica [o valor inicial](#providing-an-initial-value-for-an-input) para uma entrada de texto.

Essas props `<input>` são relevantes tanto para entradas não controladas quanto controladas:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Uma string. Especifica quais tipos de arquivos são aceitos por uma entrada `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Uma string. Especifica o texto alternativo da imagem para uma entrada `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Uma string. Especifica a mídia (microfone, vídeo ou câmera) capturada por uma entrada `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Uma string. Especifica um dos possíveis [comportamentos de autocomplete.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Um booleano. Se `true`, o React irá focar o elemento na montagem.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Uma string. Especifica o nome do campo do formulário para a direcionalidade do elemento.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Um booleano. Se `true`, a entrada não será interativa e aparecerá desbotada.
* `children`: `<input>` não aceita filhos.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Uma string. Especifica o `id` da `<form>` à qual esta entrada pertence. Se omitido, é o formulário pai mais próximo.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Uma string. Substitui a `<form action>` do pai para `type="submit"` e `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Uma string. Substitui a `<form enctype>` do pai para `type="submit"` e `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Uma string. Substitui a `<form method>` do pai para `type="submit"` e `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Uma string. Substitui a `<form noValidate>` do pai para `type="submit"` e `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Uma string. Substitui a `<form target>` do pai para `type="submit"` e `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Uma string. Especifica a altura da imagem para `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Uma string. Especifica o `id` do `<datalist>` com as opções de autocomplete.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Um número. Especifica o valor máximo de entradas numéricas e de data/hora.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Um número. Especifica o comprimento máximo de texto e outras entradas.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Um número. Especifica o valor mínimo de entradas numéricas e de data/hora.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Um número. Especifica o comprimento mínimo de texto e outras entradas.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Um booleano. Especifica se múltiplos valores são permitidos para `<type="file"` e `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Uma string. Especifica o nome desta entrada que será [submetido com o formulário.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Necessária para [entradas controladas.](#controlling-an-input-with-a-state-variable) Dispara imediatamente quando o valor do input é alterado pelo usuário (por exemplo, dispara a cada tecla pressionada). Comporta-se como o evento [`input` do navegador.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Uma versão de `onChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara imediatamente quando o valor é alterado pelo usuário. Por razões históricas, no React é idiomático usar `onChange`, que funciona de forma semelhante.
* `onInputCapture`: Uma versão de `onInput` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara se uma entrada falhar na validação ao enviar o formulário. Ao contrário do evento `invalid` embutido, o evento React `onInvalid` propaga.
* `onInvalidCapture`: Uma versão de `onInvalid` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Dispara após a seleção dentro do `<input>` mudar. O React estende o evento `onSelect` para também disparar para seleção vazia e em edições (que podem afetar a seleção).
* `onSelectCapture`: Uma versão de `onSelect` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Uma string. Especifica o padrão que o `value` deve corresponder.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Uma string. Exibida em uma cor desbotada quando o valor do input está vazio.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Um booleano. Se `true`, a entrada não pode ser editada pelo usuário.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Um booleano. Se `true`, o valor deve ser fornecido para que o formulário seja enviado.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Um número. Semelhante a definir a largura, mas a unidade depende do controle.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Uma string. Especifica a fonte da imagem para uma entrada `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Um número positivo ou uma string `'any'`. Especifica a distância entre valores válidos.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Uma string. Um dos [tipos de entrada.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  Uma string. Especifica a largura da imagem para uma entrada `type="image"`.

#### Ressalvas {/*caveats*/}

- Checkboxes necessitam de `checked` (ou `defaultChecked`), não `value` (ou `defaultValue`).
- Se uma entrada de texto receber uma prop `value` string, ela será [tratada como controlada.](#controlling-an-input-with-a-state-variable)
- Se um checkbox ou um botão de rádio receber uma prop `checked` booleano, ele será [tratado como controlado.](#controlling-an-input-with-a-state-variable)
- Um input não pode ser controlado e não controlado ao mesmo tempo.
- Um input não pode alternar entre ser controlado ou não controlado ao longo de sua vida útil.
- Cada input controlado precisa de um manipulador de eventos `onChange` que atualiza sincronicamente seu valor de suporte.

---

## Uso {/*usage*/}

### Exibindo inputs de diferentes tipos {/*displaying-inputs-of-different-types*/}

Para exibir uma entrada, renderize um componente `<input>`. Por padrão, será uma entrada de texto. Você pode passar `type="checkbox"` para um checkbox, `type="radio"` para um botão de rádio, [ou um dos outros tipos de entrada.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

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

### Fornecendo um rótulo para um input {/*providing-a-label-for-an-input*/}

Normalmente, você colocará cada `<input>` dentro de uma tag [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Isso informa ao navegador que esse rótulo está associado a essa entrada. Quando o usuário clica no rótulo, o navegador automaticamente focará a entrada. Isso também é essencial para acessibilidade: um leitor de tela anunciará a legenda do rótulo quando o usuário focar na entrada associada.

Se você não puder aninhar `<input>` dentro de um `<label>`, associe-os passando o mesmo ID para `<input id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflitos entre várias instâncias de um componente, gere tal ID com [`useId`.](/reference/react/useId)

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

### Fornecendo um valor inicial para um input {/*providing-an-initial-value-for-an-input*/}

Você pode opcionalmente especificar o valor inicial para qualquer entrada. Passe-o como a string `defaultValue` para entradas de texto. Checkboxes e botões de rádio devem especificar o valor inicial com a prop `defaultChecked` booleano.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Entrada de texto: <input name="myInput" defaultValue="Algum valor inicial" />
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

Adicione um [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ao redor de suas entradas com um [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) dentro. Isso chamará seu evento `<form onSubmit>`. Por padrão, o navegador enviará os dados do formulário para a URL atual e atualizará a página. Você pode substituir esse comportamento chamando `e.preventDefault()`. Leia os dados do formulário com [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Impedir que o navegador recarregue a página
    e.preventDefault();

    // Ler os dados do formulário
    const form = e.target;
    const formData = new FormData(form);

    // Você pode passar formData como um corpo de fetch diretamente:
    fetch('/some-api', { method: form.method, body: formData });

    // Ou você pode trabalhar com ele como um objeto simples:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Entrada de texto: <input name="myInput" defaultValue="Algum valor inicial" />
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
      <button type="reset">Redefinir formulário</button>
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

Dê um `name` a cada `<input>`, por exemplo `<input name="firstName" defaultValue="Taylor" />`. O `name` que você especificou será usado como uma chave nos dados do formulário, por exemplo `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Por padrão, *qualquer* `<button>` dentro de um `<form>` enviará o formulário. Isso pode ser surpreendente! Se você tiver seu próprio componente `Button` do React, considere retornar [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) em vez de `<button>`. Então, para ser explícito, use `<button type="submit">` para botões que *devem* submeter o formulário.

</Pitfall>

---

### Controlando um input com uma variável de estado {/*controlling-an-input-with-a-state-variable*/}

Um input como `<input />` é *não controlado.* Mesmo que você [passe um valor inicial](#providing-an-initial-value-for-an-input) como `<input defaultValue="Texto inicial" />`, seu JSX apenas especifica o valor inicial. Não controla qual deve ser o valor agora.

**Para renderizar um input _controlado_, passe a prop `value` para ele (ou `checked` para checkboxes e rádios).** O React forçará o input a sempre ter o `value` que você passou. Normalmente, você faria isso declarando uma [variável de estado:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare uma variável de estado...
  // ...
  return (
    <input
      value={firstName} // ...forçar o valor do input a corresponder à variável de estado...
      onChange={e => setFirstName(e.target.value)} // ... e atualizar a variável de estado em qualquer edição!
    />
  );
}
```

Um input controlado faz sentido se você precisasse de estado de qualquer maneira--por exemplo, para re-renderizar sua UI em cada edição:

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

É também útil se você quiser oferecer várias maneiras de ajustar o estado do input (por exemplo, clicando em um botão):

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

O `value` que você passa para componentes controlados não deve ser `undefined` ou `null`. Se você precisar que o valor inicial seja vazio (como no campo `firstName` abaixo), inicialize sua variável de estado como uma string vazia (`''`).

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

**Se você passar `value` sem `onChange`, será impossível digitar na entrada.** Quando você controla um input passando algum `value` para ele, você *força* ele a sempre ter o valor que você passou. Então, se você passar uma variável de estado como `value` mas esquecer de atualizar essa variável de estado sincronicamente durante o manipulador de eventos `onChange`, o React reverterá o input após cada tecla pressionada de volta para o `value` que você especificou.

</Pitfall>

---

### Otimizando a re-renderização em cada tecla pressionada {/*optimizing-re-rendering-on-every-keystroke*/}

Quando você usa um input controlado, você define o estado em cada tecla pressionada. Se o componente que contém seu estado re-renderiza uma árvore grande, isso pode ficar lento. Existem algumas maneiras de otimizar o desempenho da re-renderização.

Por exemplo, suponha que você comece com um formulário que re-renderiza todo o conteúdo da página a cada tecla pressionada:

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

Como `<PageContent />` não depende do estado da entrada, você pode mover o estado da entrada para seu próprio componente:

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

Isso melhora significativamente o desempenho porque agora apenas o `SignupForm` re-renderiza a cada tecla pressionada.

Se não houver como evitar a re-renderização (por exemplo, se `PageContent` depender do valor da entrada de pesquisa), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) permite que você mantenha o input controlado responsivo mesmo no meio de uma grande re-renderização.

---

## Solução de Problemas {/*troubleshooting*/}

### Minha entrada de texto não atualiza quando digito nela {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Se você renderizar um input com `value` mas sem `onChange`, verá um erro no console:

```js
// 🔴 Bug: entrada de texto controlada sem manipulador onChange
<input value={something} />
```

<ConsoleBlock level="error">

Você forneceu uma prop `value` a um campo de formulário sem um manipulador `onChange`. Isso renderizará um campo somente leitura. Se o campo deveria ser mutável, use `defaultValue`. Caso contrário, defina `onChange` ou `readOnly`.

</ConsoleBlock>

Como a mensagem de erro sugere, se você apenas quisesse [especificar o *valor inicial,](#providing-an-initial-value-for-an-input) passe `defaultValue` em vez disso:

```js
// ✅ Bom: entrada não controlada com um valor inicial
<input defaultValue={something} />
```

Se você quiser [controlar esse input com uma variável de estado,](#controlling-an-input-with-a-state-variable) especifique um manipulador `onChange`:

```js
// ✅ Bom: entrada controlada com onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Se o valor for intencionalmente somente leitura, adicione uma prop `readOnly` para suprimir o erro:

```js
// ✅ Bom: entrada controlada somente leitura sem on change
<input value={something} readOnly={true} />
```

---

### Meu checkbox não atualiza quando clico nele {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Se você renderizar um checkbox com `checked` mas sem `onChange`, verá um erro no console:

```js
// 🔴 Bug: checkbox controlado sem manipulador onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Você forneceu uma prop `checked` a um campo de formulário sem um manipulador `onChange`. Isso renderizará um campo somente leitura. Se o campo deveria ser mutável, use `defaultChecked`. Caso contrário, defina `onChange` ou `readOnly`.

</ConsoleBlock>

Como a mensagem de erro sugere, se você apenas quisesse [especificar o *valor inicial,](#providing-an-initial-value-for-an-input) passe `defaultChecked` em vez disso:

```js
// ✅ Bom: checkbox não controlado com um valor inicial
<input type="checkbox" defaultChecked={something} />
```

Se você quiser [controlar esse checkbox com uma variável de estado,](#controlling-an-input-with-a-state-variable) especifique um manipulador `onChange`:

```js
// ✅ Bom: checkbox controlado com onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Você precisa ler `e.target.checked` em vez de `e.target.value` para checkboxes.

</Pitfall>

Se o checkbox for intencionalmente somente leitura, adicione uma prop `readOnly` para suprimir o erro:

```js
// ✅ Bom: entrada controlada somente leitura sem on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Meu cursor de entrada salta para o início a cada tecla pressionada {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Se você [controla um input,](#controlling-an-input-with-a-state-variable) deve atualizar sua variável de estado para o valor do input do DOM durante `onChange`.

Você não pode atualizá-lo para algo diferente de `e.target.value` (ou `e.target.checked` para checkboxes):

```js
function handleChange(e) {
  // 🔴 Bug: atualizando um input para algo diferente de e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Você também não pode atualizá-lo de forma assíncrona:

```js
function handleChange(e) {
  // 🔴 Bug: atualizando um input de forma assíncrona
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Para corrigir seu código, atualize-o sincronicamente para `e.target.value`:

```js
function handleChange(e) {
  // ✅ Atualizando um input controlado para e.target.value sincronicamente
  setFirstName(e.target.value);
}
```

Se isso não resolver o problema, é possível que o input esteja sendo removido e re-adicionado do DOM a cada tecla pressionada. Isso pode acontecer se você acidentalmente [resetar o estado](/learn/preserving-and-resetting-state) a cada re-renderização, por exemplo, se o input ou um de seus pais sempre recebe um atributo `key` diferente, ou se você aninhar definições de funções de componentes (o que não é suportado e faz com que o "componente interno" sempre seja considerado uma árvore diferente).

---

### Estou recebendo um erro: "Um componente está mudando um input não controlado para ser controlado" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Se você fornecer um `value` ao componente, ele deve permanecer uma string durante toda a sua vida útil.

Você não pode passar `value={undefined}` primeiro e depois passar `value="alguma string"` porque o React não saberá se você deseja que o componente seja não controlado ou controlado. Um componente controlado deve sempre receber um `value` string, não `null` ou `undefined`.

Se seu `value` estiver vindo de uma API ou de uma variável de estado, ele pode ser inicializado como `null` ou `undefined`. Nesse caso, ou o defina como uma string vazia (`''`) inicialmente, ou passe `value={someValue ?? ''}` para garantir que `value` seja uma string.

Da mesma forma, se você passar `checked` para um checkbox, certifique-se de que ele seja sempre um booleano.