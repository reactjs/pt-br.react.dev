---
title: createElement
---

<Intro>

`createElement` permite que você crie um Elemento React. Ele serve como uma alternativa para escrever [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Chame `createElement` para criar um Elemento React com o `type`, `props` e `children` fornecidos.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `type`: O argumento `type` deve ser um tipo de componente React válido. Por exemplo, pode ser uma string de nome de tag (como `'div'` ou `'span'`) ou um Componente React (uma função, uma classe ou um componente especial como [`Fragment`](/reference/react/Fragment)).

* `props`: O argumento `props` deve ser um objeto ou `null`. Se você passar `null`, ele será tratado da mesma forma que um objeto vazio. O React criará um elemento com props correspondentes ao `props` que você passou. Observe que `ref` e `key` do seu objeto `props` são especiais e *não* estarão disponíveis como `element.props.ref` e `element.props.key` no `element` retornado. Eles estarão disponíveis como `element.ref` e `element.key`.

* **opcional** `...children`: Zero ou mais nós filhos. Eles podem ser quaisquer nós React, incluindo Elementos React, strings, números, [portals](/reference/react-dom/createPortal), nós vazios (`null`, `undefined`, `true` e `false`) e arrays de nós React.

#### Retorna {/*returns*/}

`createElement` retorna um objeto Elemento React com algumas propriedades:

* `type`: O `type` que você passou.
* `props`: O `props` que você passou, exceto `ref` e `key`.
* `ref`: O `ref` que você passou. Se estiver faltando, `null`.
* `key`: O `key` que você passou, forçado a uma string. Se estiver faltando, `null`.

Normalmente, você retornará o elemento do seu componente ou o tornará filho de outro elemento. Embora você possa ler as propriedades do elemento, é melhor tratar cada elemento como opaco após sua criação e apenas renderizá-lo.

#### Ressalvas {/*caveats*/}

* Você deve **tratar os Elementos React e suas props como [imutáveis](https://pt.wikipedia.org/wiki/Objeto_imut%C3%A1vel)** e nunca alterar seu conteúdo após a criação. No desenvolvimento, o React irá [congelar](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) o elemento retornado e sua propriedade `props` superficialmente para impor isso.

* Quando você usa JSX, **você deve iniciar uma tag com uma letra maiúscula para renderizar seu próprio componente customizado.** Em outras palavras, `<Something />` é equivalente a `createElement(Something)`, mas `<something />` (minúsculo) é equivalente a `createElement('something')` (observe que é uma string, então será tratado como uma tag HTML built-in).

* Você deve apenas **passar filhos como múltiplos argumentos para `createElement` se todos forem estaticamente conhecidos,** como `createElement('h1', {}, child1, child2, child3)`. Se seus filhos forem dinâmicos, passe toda a array como o terceiro argumento: `createElement('ul', {}, listItems)`. Isso garante que o React [avise sobre chaves `key` ausentes](/learn/rendering-lists#keeping-list-items-in-order-with-key) para quaisquer listas dinâmicas. Para listas estáticas, isso não é necessário porque elas nunca reordenam.

---

## Uso {/*usage*/}

### Criando um elemento sem JSX {/*creating-an-element-without-jsx*/}

Se você não gosta de [JSX](/learn/writing-markup-with-jsx) ou não pode usá-lo em seu projeto, você pode usar `createElement` como uma alternativa.

Para criar um elemento sem JSX, chame `createElement` com algum <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep> e <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

Os <CodeStep step={3}>children</CodeStep> são opcionais, e você pode passar quantos precisar (o exemplo acima tem três filhos). Este código exibirá um cabeçalho `<h1>` com uma saudação. Para comparação, aqui está o mesmo exemplo reescrito com JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Para renderizar seu próprio Componente React, passe uma função como `Greeting` como <CodeStep step={1}>type</CodeStep> em vez de uma string como `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Com JSX, ficaria assim:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Aqui está um exemplo completo escrito com `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

E aqui está o mesmo exemplo escrito usando JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Ambos os estilos de codificação são bons, então você pode usar o que preferir para seu projeto. O principal benefício de usar JSX em comparação com `createElement` é que é fácil ver qual tag de fechamento corresponde a qual tag de abertura.

<DeepDive>

#### O que é um Elemento React, exatamente? {/*what-is-a-react-element-exactly*/}

Um elemento é uma descrição leve de uma parte da interface do usuário. Por exemplo, tanto `<Greeting name="Taylor" />` quanto `createElement(Greeting, { name: 'Taylor' })` produzem um objeto como este:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Observe que a criação deste objeto não renderiza o componente `Greeting` nem cria quaisquer elementos DOM.**

Um Elemento React é mais como uma descrição - uma instrução para o React posteriormente renderizar o componente `Greeting`. Ao retornar este objeto do seu Componente `App`, você diz ao React o que fazer em seguida.

Criar elementos é extremamente barato, então você não precisa tentar otimizá-lo ou evitá-lo.

</DeepDive>