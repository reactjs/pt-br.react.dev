---
title: "<textarea>"
---

<Intro>

O [componente `<textarea>` embutido no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) permite renderizar um campo de entrada de texto em várias linhas.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<textarea>` {/*textarea*/}

Para exibir uma área de texto, renderize o [componente `<textarea>` embutido no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<textarea>` suporta todas as [props de elementos comuns.](/reference/react-dom/components/common#props)

Você pode [tornar uma área de texto controlada](#controlling-a-text-area-with-a-state-variable) passando uma prop `value`:

* `value`: Uma string. Controla o texto dentro da área de texto.

Quando você passa `value`, também deve passar um manipulador `onChange` que atualiza o valor passado.

Se a sua `<textarea>` for não controlada, você pode passar a prop `defaultValue` em vez disso:

* `defaultValue`: Uma string. Especifica [o valor inicial](#providing-an-initial-value-for-a-text-area) para uma área de texto.

Estas props `<textarea>` são relevantes tanto para áreas de texto controladas quanto não controladas:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Pode ser `'on'` ou `'off'`. Especifica o comportamento de autocompletar.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Um booleano. Se `true`, o React focará o elemento ao montar.
* `children`: `<textarea>` não aceita filhos. Para definir o valor inicial, use `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Um número. Especifica a largura padrão em médias larguras de caracteres. O padrão é `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Um booleano. Se `true`, a entrada não será interativa e aparecerá esmaecida.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): Uma string. Especifica o `id` do `<form>` ao qual esta entrada pertence. Se omitido, é o formulário pai mais próximo.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Um número. Especifica o comprimento máximo do texto.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Um número. Especifica o comprimento mínimo do texto.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Uma string. Especifica o nome desta entrada que será [enviado com o formulário.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Necessária para [áreas de texto controladas.](#controlling-a-text-area-with-a-state-variable) Aciona imediatamente quando o valor da entrada é alterado pelo usuário (por exemplo, aciona a cada tecla pressionada). Comporta-se como o evento [`input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) do navegador.
* `onChangeCapture`: Uma versão de `onChange` que aciona na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Aciona imediatamente quando o valor é alterado pelo usuário. Por razões históricas, no React, é idiomático usar `onChange`, que funciona de maneira semelhante.
* `onInputCapture`: Uma versão de `onInput` que aciona na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Aciona se uma entrada falhar na validação ao enviar o formulário. Ao contrário do evento `invalid` embutido, o evento `onInvalid` do React propaga.
* `onInvalidCapture`: Uma versão de `onInvalid` que aciona na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Uma função [`Event` handler](/reference/react-dom/components/common#event-handler). Aciona após a seleção dentro da `<textarea>` mudar. O React estende o evento `onSelect` para também acionar para seleção vazia e em edições (o que pode afetar a seleção).
* `onSelectCapture`: Uma versão de `onSelect` que aciona na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): Uma string. Exibida em uma cor esmaecida quando o valor da área de texto está vazio.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Um booleano. Se `true`, a área de texto não é editável pelo usuário.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Um booleano. Se `true`, o valor deve ser fornecido para enviar o formulário.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Um número. Especifica a altura padrão em médias alturas de caracteres. O padrão é `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Pode ser `'hard'`, `'soft'` ou `'off'`. Especifica como o texto deve ser quebrado ao enviar um formulário.

#### Ressalvas {/*caveats*/}

- Passar filhos como `<textarea>algo</textarea>` não é permitido. [Use `defaultValue` para o conteúdo inicial.](#providing-an-initial-value-for-a-text-area)
- Se uma área de texto recebe uma prop string `value`, ela será [tratada como controlada.](#controlling-a-text-area-with-a-state-variable)
- Uma área de texto não pode ser controlada e não controlada ao mesmo tempo.
- Uma área de texto não pode alternar entre ser controlada ou não controlada ao longo de sua vida útil.
- Toda área de texto controlada precisa de um manipulador de eventos `onChange` que atualize sincronamente seu valor de apoio.

---

## Uso {/*usage*/}

### Exibindo uma área de texto {/*displaying-a-text-area*/}

Renderize `<textarea>` para exibir uma área de texto. Você pode especificar seu tamanho padrão com os atributos [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) e [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), mas por padrão, o usuário poderá redimensioná-la. Para desabilitar o redimensionamento, você pode especificar `resize: none` no CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Escreva seu post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Fornecendo um rótulo para uma área de texto {/*providing-a-label-for-a-text-area*/}

Normalmente, você colocará cada `<textarea>` dentro de uma tag [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Isso informa ao navegador que este rótulo está associado a essa área de texto. Quando o usuário clica no rótulo, o navegador focará a área de texto. Isso também é essencial para acessibilidade: um leitor de tela anunciará a legenda do rótulo quando o usuário focar a área de texto.

Se você não puder aninhar `<textarea>` em um `<label>`, associe-os passando o mesmo ID para `<textarea id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Para evitar conflitos entre instâncias de um componente, gere tal ID com [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Escreva seu post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Fornecendo um valor inicial para uma área de texto {/*providing-an-initial-value-for-a-text-area*/}

Você pode opcionalmente especificar o valor inicial para a área de texto. Passe-o como a string `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edite seu post:
      <textarea
        name="postContent"
        defaultValue="Eu realmente gostei de andar de bicicleta ontem!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Ao contrário do HTML, passar texto inicial como `<textarea>Algum conteúdo</textarea>` não é suportado.

</Pitfall>

---

### Lendo o valor da área de texto ao enviar um formulário {/*reading-the-text-area-value-when-submitting-a-form*/}

Adicione um [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ao redor da sua área de texto com um [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) dentro. Isso chamará seu manipulador de evento `<form onSubmit>`. Por padrão, o navegador enviará os dados do formulário para a URL atual e atualizará a página. Você pode sobrescrever esse comportamento chamando `e.preventDefault()`. Leia os dados do formulário com [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Impedir que o navegador recarregue a página
    e.preventDefault();

    // Ler os dados do formulário
    const form = e.target;
    const formData = new FormData(form);

    // Você pode passar formData como um corpo de fetch diretamente:
    fetch('/some-api', { method: form.method, body: formData });

    // Ou você pode trabalhar com isso como um objeto simples:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Título do post: <input name="postTitle" defaultValue="Andando de bicicleta" />
      </label>
      <label>
        Edite seu post:
        <textarea
          name="postContent"
          defaultValue="Eu realmente gostei de andar de bicicleta ontem!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Resetar edições</button>
      <button type="submit">Salvar post</button>
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

Dê um `name` à sua `<textarea>`, por exemplo `<textarea name="postContent" />`. O `name` que você especificou será usado como uma chave nos dados do formulário, por exemplo `{ postContent: "Seu post" }`.

</Note>

<Pitfall>

Por padrão, *qualquer* `<button>` dentro de um `<form>` o enviará. Isso pode ser surpreendente! Se você tiver seu próprio componente `Button` React personalizado, considere retornar [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) em vez de `<button>`. Em seguida, para ser explícito, use `<button type="submit">` para botões que *devem* enviar o formulário.

</Pitfall>

---

### Controlando uma área de texto com uma variável de estado {/*controlling-a-text-area-with-a-state-variable*/}

Uma área de texto como `<textarea />` é *não controlada.* Mesmo que você [vaia uma valor inicial](#providing-an-initial-value-for-a-text-area) como `<textarea defaultValue="Texto inicial" />`, seu JSX especifica apenas o valor inicial, não o valor atual.

**Para renderizar uma área de texto _controlada_, passe a prop `value` para ela.** O React forçará a área de texto a sempre ter o `value` que você passou. Normalmente, você controlará uma área de texto declarando uma [variável de estado:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare uma variável de estado...
  // ...
  return (
    <textarea
      value={postContent} // ...force o valor da entrada a corresponder à variável de estado...
      onChange={e => setPostContent(e.target.value)} // ... e atualize a variável de estado em qualquer edição!
    />
  );
}
```

Isso é útil se você quiser re-renderizar alguma parte da interface do usuário em resposta a cada tecla pressionada.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Olá,_ **Markdown**!');
  return (
    <>
      <label>
        Digite algum markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Se você passar `value` sem `onChange`, será impossível digitar na área de texto.** Quando você controla uma área de texto passando algum `value` para ela, você *força* a ter sempre o valor que você passou. Portanto, se você passar uma variável de estado como um `value` mas esquecer de atualizar essa variável de estado sincronamente durante o manipulador de eventos `onChange`, o React reverterá a área de texto após cada tecla pressionada de volta para o `value` que você especificou.

</Pitfall>

---

## Solução de Problemas {/*troubleshooting*/}

### Minha área de texto não atualiza quando eu digito nela {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Se você renderizar uma área de texto com `value` mas sem `onChange`, verá um erro no console:

```js
// 🔴 Bug: área de texto controlada sem um manipulador onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Você forneceu uma prop `value` a um campo de formulário sem um manipulador `onChange`. Isso renderizará um campo somente leitura. Se o campo deve ser mutável, use `defaultValue`. Caso contrário, defina `onChange` ou `readOnly`.

</ConsoleBlock>

Como a mensagem de erro sugere, se você só queria [especificar o *valor inicial,](#providing-an-initial-value-for-a-text-area) passe `defaultValue` em vez disso:

```js
// ✅ Bom: área de texto não controlada com um valor inicial
<textarea defaultValue={something} />
```

Se você quiser [controlar esta área de texto com uma variável de estado,](#controlling-a-text-area-with-a-state-variable) especifique um manipulador `onChange`:

```js
// ✅ Bom: área de texto controlada com onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Se o valor for intencionalmente somente leitura, adicione uma prop `readOnly` para suprimir o erro:

```js
// ✅ Bom: área de texto controlada somente leitura sem onChange
<textarea value={something} readOnly={true} />
```

---

### Meu cursor na área de texto salta para o início a cada tecla pressionada {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Se você [controla uma área de texto,](#controlling-a-text-area-with-a-state-variable) deve atualizar sua variável de estado com o valor da área de texto do DOM durante `onChange`.

Você não pode atualizá-la para algo diferente de `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Bug: atualizando uma entrada para algo diferente de e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Você também não pode atualizá-la de forma assíncrona:

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

Se isso não resolver o problema, é possível que a área de texto seja removida e adicionada novamente ao DOM a cada tecla pressionada. Isso pode acontecer se você estiver acidentalmente [resetando o estado](/learn/preserving-and-resetting-state) a cada re-renderização. Por exemplo, isso pode acontecer se a área de texto ou um de seus pais sempre receber um atributo `key` diferente, ou se você aninhar definições de componentes (o que não é permitido no React e causa o remonte do componente "interno" a cada renderização).

---

### Estou recebendo um erro: "Um componente está mudando uma entrada não controlada para ser controlada" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Se você fornecer um `value` ao componente, ele deve permanecer uma string durante toda a sua vida útil.

Você não pode passar `value={undefined}` primeiro e depois passar `value="alguma string"` porque o React não saberá se você deseja que o componente seja não controlado ou controlado. Um componente controlado deve sempre receber uma string `value`, não `null` ou `undefined`.

Se o seu `value` estiver vindo de uma API ou variável de estado, pode ser inicializado como `null` ou `undefined`. Nesse caso, defina-o como uma string vazia (`''`) inicialmente, ou passe `value={someValue ?? ''}` para garantir que `value` seja uma string.