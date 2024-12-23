---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` é um React Hook que permite customizar o identificador exposto como [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Chame `useImperativeHandle` no nível superior do seu componente para customizar o identificador de referência que ele expõe:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... seus métodos ...
    };
  }, []);
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

<<<<<<< HEAD
* `ref`: A `ref` que você recebeu como segundo argumento da [função de renderização `forwardRef`.](/reference/react/forwardRef#render-function)
=======
* `ref`: The `ref` you received as a prop to the `MyInput` component.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

* `createHandle`: Uma função que não aceita argumentos e retorna o identificador de referência que você deseja expor. Essa identificador de referência pode ter qualquer tipo. Normalmente, você retornará um objeto com os métodos que deseja expor.

* **opcional** `dependencies`: A lista de todos os valores reativos referenciados dentro do código `createHandle`. Os valores reativos incluem propriedades, estado, e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se o seu linter estiver [configurado para React](/learn/editor-setup#linting), ele verificará se cada valor reativo está especificado corretamente como uma dependência. A lista de dependências devem ter um número constante de items e ser escrito inline como `[dep1, dep2, dep3]`. O React comparará cada dependência com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se uma nova renderização resultou em uma alteração em alguma dependência, ou se você omitiu este argumento, sua função `createHandle` será executada novamente e o identificador recém-criado será atribuído à ref.

<<<<<<< HEAD
#### Retorna {/*returns*/}
=======
<Note>

Starting with React 19, [`ref` is available a prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 and earlier, it was necessary to get the `ref` from [`forwardRef`.](/reference/react/forwardRef) 

</Note>

#### Returns {/*returns*/}
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

`useImperativeHandle` retorna `undefined`.

---

## Uso {/*usage*/}

### Expondo um identificador de referência customizado ao componente pai {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Por padrão, os componentes não expõem seus nós DOM aos componentes pai. Por exemplo, se você deseja que o componente pai de `MyInput` [tenha acesso](/learn/manipulating-the-dom-with-refs) ao nó DOM `<input>`, você deve optar por [`forwardRef`:](/referência/react/forwardRef)

<<<<<<< HEAD
=======
To expose a DOM node to the parent element, pass in the `ref` prop to the node.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

<<<<<<< HEAD
Com o código acima, [uma referência para `MyInput` receberá o nó DOM `<input>`.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) No entanto, você pode expor um valor customizado. Para customizar o identificador exposto, chame `useImperativeHandle` no nível superior do seu componente:
=======
With the code above, [a ref to `MyInput` will receive the `<input>` DOM node.](/learn/manipulating-the-dom-with-refs) However, you can expose a custom value instead. To customize the exposed handle, call `useImperativeHandle` at the top level of your component:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... seus métodos ...
    };
  }, []);

  return <input />;
};
```

<<<<<<< HEAD
Note que no código acima, a `ref` não é mais encaminhado para o `<input>`.

Por exemplo, suponha que você não queira expor todo o nó DOM `<input>`, mas você deseja expor dois de seus métodos: `focus` e `scrollIntoView`. Para fazer isso, mantenha o DOM real do navegador em uma referência separada. Em seguida, use `useImperativeHandle` para expor um identificador com apenas os métodos que você deseja que o componente pai chame:
=======
Note that in the code above, the `ref` is no longer passed to the `<input>`.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682


```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Agora, se o componente pai obtiver uma referência para `MyInput`, ele será capaz de chamar os métodos `focus` e `scrollIntoView` nele. No entanto, ele não terá acesso total ao nó DOM `<input>` subjacente.


<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Isso não funcionará porque o nó DOM não está exposto:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Expondo seus próprios métodos imperativos {/*exposing-your-own-imperative-methods*/}

Os métodos que você expõe por meio de um identificador imperativo não precisam corresponder exatamente aos métodos DOM. Por exemplo, este componente `Post` expõe um método `scrollAndFocusAddComment` por meio de um identificador imperativo. Isso permite que a `Page` pai role a lista de comentários *e* foque no campo de entrada quando você clica no botão:


<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comentário #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

<<<<<<< HEAD
const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Adicionar comentário..." ref={ref} />;
});
=======
function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Não abuse das referências.** Você deve apenas usar referências para comportamentos *imperativos* que você não pode expressar como propriedades: por exemplo, rolar até um nó, focar em um nó, disparar uma animação, selecionar texto e assim por diante.

**Se você pode expressar algo como uma propriedade, não deve usar uma referência.** Por exemplo, em vez de expor um identificador imperativo como `{ open, close }` de um componente `Modal`, é melhor usar `isOpen` como um suporte como `<Modal isOpen={isOpen} />`. [Efeitos](/learn/synchronizing-with-effects) podem ajudá-lo a expor comportamentos imperativos por meio de propriedades.

</Pitfall>
