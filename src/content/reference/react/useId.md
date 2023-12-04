---
title: useId
---

<Intro>

`useId` é um Hook do React para gerar IDs únicos que podem ser passados para atributos de acessibilidade.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useId()` {/*useid*/}

Chame `useId` no nível superior do seu componente para gerar um ID único:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

`useId` não aceita nenhum parâmetro.

#### Retorna {/*returns*/}

`useId` retorna uma sequência de ID único associada a esta chamada `useId` específica neste componente específico.

#### Ressalvas {/*caveats*/}

* `useId` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou no seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar, extraia um novo componente e mova o estado para ele.

* `useId` **não deve ser usado para gerar chaves** em uma lista. [As chaves devem ser geradas a partir de seus dados.](/learn/rendering-lists#where-to-get-your-key)

---

## Uso {/*usage*/}

<Pitfall>

**Não chame `useId` para gerar chaves em uma lista.** [As chaves devem ser geradas a partir de seus dados.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Gerando IDs únicos para atributos de acessibilidade {/*generating-unique-ids-for-accessibility-attributes*/}

Chame `useId` no nível superior do seu componente para gerar um ID único:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Você pode então passar o <CodeStep step={1}>ID gerado</CodeStep> para diferentes atributos:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Vamos analisar um exemplo para ver quando isso é útil.**

[Atributos de acessibilidade do HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) como [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) permite especificar que duas tags estão relacionadas entre si. Por exemplo, você pode especificar que um elemento (como um input) seja descrito por outro elemento (como um parágrafo).

No HTML normal, você escreveria assim:

```html {5,8}
<label>
  Senha:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  A senha deve conter pelo menos 18 caracteres
</p>
```

No entanto, codificar IDs como esse não é uma boa prática no React. Um componente pode ser renderizado mais de uma vez na página, mas os IDs devem ser únicos! Em vez de codificar um ID, gere um ID único com `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Senha:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        A senha deve conter pelo menos 18 caracteres
      </p>
    </>
  );
}
```

Agora, mesmo que `PasswordField` apareça várias vezes na tela, os IDs gerados não entrarão em conflito.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Senha:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        A senha deve conter pelo menos 18 caracteres
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Escolha uma senha</h2>
      <PasswordField />
      <h2>Confirme a senha</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Assista à esse vídeo](https://www.youtube.com/watch?v=0dNzNcuEuOo) para ver a diferença na experiência do usuário com tecnologias assistivas.

<Pitfall>

Com a [renderização do servidor](/reference/react-dom/server), **`useId` requer uma árvore de componentes idêntica no servidor e no cliente**. Se as árvores que você renderizar no servidor e no cliente não corresponderem exatamente, os IDs gerados não corresponderão.

</Pitfall>

<DeepDive>

#### Por que useId é melhor que um contador de incremento? {/*why-is-useid-better-than-an-incrementing-counter*/}

Você pode estar se perguntando por que `useId` é melhor do que incrementar uma variável global como `nextId++`.

O principal benefício do `useId` é que o React garante que funcione com a [renderização do servidor.](/reference/react-dom/server) Durante a renderização do servidor, seus componentes geram saídas HTML. Posteriormente, no cliente, a [hidratação](/reference/react-dom/client/hydrateRoot) anexa seus manipuladores de eventos ao HTML gerado. Para que a hidratação funcione, a saída do cliente deve corresponder ao HTML do servidor.

<<<<<<< HEAD
Isso é muito difícil de garantir com um contador de incremento porque a ordem na qual os componentes do cliente são hidratados pode não corresponder à ordem na qual o HTML do servidor foi emitido. Ao chamar `useId`, você garante que a hidratação funcionará e a saída corresponderá entre o servidor e o cliente.
=======
This is very difficult to guarantee with an incrementing counter because the order in which the Client Components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

Dentro do React, `useId` é gerado a partir do "caminho pai" do componente chamado. É por isso que, se o cliente e a árvore do servidor forem iguais, o "caminho pai" corresponderá, independentemente da ordem de renderização.

</DeepDive>

---

### Gerando IDs para vários elementos relacionados {/*generating-ids-for-several-related-elements*/}

Se você precisar fornecer IDs para vários elementos relacionados, você pode chamar `useId` para gerar um prefixo compartilhado para eles:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>Primeiro nome:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Sobrenome:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Isso permite que você evite chamar `useId` para cada elemento que precisa de um ID único.

---

### Especificando um prefixo compartilhado para todos os IDs gerados {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Se você renderizar várias aplicações React independentes em uma única página, passe `identifierPrefix` como uma opção para suas chamadas [`createRoot`](/reference/react-dom/client/createRoot#parameters) ou [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Isso garante que os IDs gerados pelos dois aplicativos diferentes nunca entrem em conflito porque cada identificador gerado com `useId` começará com o prefixo distinto que você especificou.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Meu app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Identificador gerado:', passwordHintId)
  return (
    <>
      <label>
        Senha:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        A senha deve conter pelo menos 18 caracteres
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Escolha uma senha</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>
