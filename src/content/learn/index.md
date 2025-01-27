---
title: Início rápido
---

<Intro>

<<<<<<< HEAD
Bem-vindo à documentação do React! Esta página fornecerá uma introdução aos 80% dos conceitos do React que você utilizará no seu dia a dia.
=======
Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

</Intro>

<YouWillLearn>

- Como criar e aninhar componentes
- Como adicionar marcações e estilos
- Como exibir dados
- Como renderizar elementos condicionalmente e listas
- Como responder a eventos e atualizar a tela
- Como compartilhar dados entre componentes

</YouWillLearn>

## Criando e aninhando componentes {/*components*/}

As aplicações React são compostas por *componentes*. Um componente é uma parte da IU (interface do usuário) que possui sua própria lógica e aparência. Um componente pode ser tão pequeno quanto um botão, ou tão grande quanto uma página inteira.

Componentes do React são funções JavaScript que retornam marcação (markup):

```js
function MyButton() {
  return (
    <button>Eu sou um botão</button>
  );
}
```
Agora que você declarou `MyButton`, você pode aninhá-lo em outro componente:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Bem-vindo ao meu aplicativo</h1>
      <MyButton />
    </div>
  );
}
```

Repare que `<MyButton />` começa com letra maiúscula. É dessa forma que você identifica um componente React. Os nomes dos componentes React sempre devem começar com letra maiúscula, enquanto as tags HTML devem ser em minúsculas.

Veja o resultado:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Eu sou um botão
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bem-vindo ao meu aplicativo</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

A palavra-chave `export default` especifica o componente principal no arquivo. Se você não estiver familiarizado com algum aspecto da sintaxe do JavaScript, o [MDN](https://developer.mozilla.org/pt-BR/docs/web/javascript/reference/statements/export) e o [javascript.info](https://javascript.info/import-export) têm ótimas referências.

## Escrevendo marcações (markup) com JSX {/*writing-markup-with-jsx*/}

A sintaxe de marcação que você viu acima é chamada de *JSX*. Ela é opcional, mas a maioria dos projetos React utiliza JSX pela sua conveniência. Todas as [todas as ferramentas de desenvolvimento que recomendamos](/learn/installation) suportam JSX prontamente.

JSX é mais rigoroso do que HTML. Você precisa fechar as tags, como `<br />`. Além disso, Seu componente não pode retornar várias tags JSX separadas. Você precisa envolvê-las em um elemento pai compartilhado, como um `<div>...</div>` ou um `<>...</>` vazio:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Sobre</h1>
      <p>Olá.<br />Como vai?</p>
    </>
  );
}
```
Se você tiver muito HTML para converter para JSX, você pode usar um [conversor online.](https://transform.tools/html-to-jsx)

## Adicionando estilos {/*adding-styles*/}


No React, você define uma classe CSS usando `className`, que funciona da mesma forma que o atributo HTML [`class`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Global_attributes/class):

```js
<img className="avatar" />
```

Depois, você escreve o CSS para esse elemento em um arquivo CSS separado:

```css
/* No seu arquivo CSS */
.avatar {
  border-radius: 50%;
}
```

O React não especifica como você adiciona arquivos CSS. No caso mais simples, você adicionará uma tag [`<link>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/link) ao seu HTML. Se você estiver usando uma ferramenta de construção ou um framework, consulte sua documentação para aprender como adicionar um arquivo CSS ao seu projeto.

## Exibindo dados {/*displaying-data*/}

JSX permite que você coloque marcação dentro do JavaScript. As chaves permitem que você insira expressões JavaScript. Isso é útil para incorporar variáveis do seu código e exibi-las para o usuário. Por exemplo, isso irá exibir `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Você também pode incorporar expressões JavaScript a partir de atributos JSX, mas você deve usar chaves *em vez* de aspas. Por exemplo, `className="avatar"` passa a string `"avatar"` como a classe CSS, mas `src={user.imageUrl}` lê o valor da variável JavaScript `user.imageUrl`, e então passa esse valor como o atributo `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Você também pode colocar expressões mais complexas dentro das chaves do JSX, por exemplo, [concatenação de strings](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Foto de ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

No exemplo acima, `style={{}}` não é uma sintaxe especial, mas sim um objeto normal `{}` dentro das chaves do JSX `style={ }`. Você pode usar o atributo `style` quando seus estilos dependem de variáveis JavaScript.

## Renderização condicional {/*conditional-rendering*/}

No React, não existe uma sintaxe especial para escrever condições. Você usará as mesmas técnicas que utiliza ao escrever código JavaScript convencional. Por exemplo, você pode usar uma instrução [`if`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) para incluir JSX condicionalmente:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Se preferir um código mais compacto, você pode utilizar o [operador condicional `?`.](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Ao contrário do `if`, ele funciona dentro do JSX:


```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Quando você não precisa do caso `else`, você pode usar uma sintaxe mais curta com o [operador lógico `&&`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Todas essas abordagens também funcionam para especificar atributos condicionalmente. Se você não estiver familiarizado com algumas dessas sintaxes JavaScript, pode começar sempre usando `if...else`.

## Renderizando listas {/*rendering-lists*/}

Você irá depender de recursos do JavaScript como o [loop `for`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for) e a [função `map()` de arrays](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

Por exemplo, suponha que você tenha um array de produtos:

```js
const products = [
  { title: 'Repolho', id: 1 },
  { title: 'Alho', id: 2 },
  { title: 'Maçã', id: 3 },
];
```

Dentro do seu componente, use a função `map()` para transformar um array de produtos em um array de itens `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Note como `<li>` possui um atributo `key`. Para cada item em uma lista, você deve passar uma string ou um número que identifica unicamente esse item entre seus irmãos. Normalmente, uma chave deve vir dos seus dados, como um ID de banco de dados. O React utiliza essas chaves para entender as mudanças que ocorrem se você posteriormente inserir, excluir ou reordenar os itens.

<Sandpack>

```js
const products = [
  { title: 'Repolho', isFruit: false, id: 1 },
  { title: 'Alho', isFruit: false, id: 2 },
  { title: 'Maçã', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Respondendo a eventos {/*responding-to-events*/}

Você pode responder a eventos declarando funções de *event handler* dentro dos seus componentes:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Você clicou no botão!');
  }

  return (
    <button onClick={handleClick}>
      Clique aqui
    </button>
  );
}
```

Note como `onClick={handleClick}` não tem parênteses no final! Não _chame_ a função de manipulador de evento: você só precisa passá-la. O React chamará seu manipulador de evento quando o usuário clicar no botão.

## Atualizando a tela {/*updating-the-screen*/}

Normalmente, você vai querer que seu componente "lembre" algumas informações e as exiba. Por exemplo, talvez você queira contar o número de vezes que um botão é clicado. Para fazer isso, adicione *estados* ao seu componente.

Primeiro, importe [`useState`](/reference/react/useState) do React:

```js
import { useState } from 'react';
```

Agora você pode declarar uma *variável de estado* dentro do seu componente:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Ao usar `useState`, você receberá duas coisas: o estado atual (`count`) e a função que permite atualizá-lo (`setCount`). Você pode dar a elas qualquer nome, mas a convenção é escrever `[algo, setAlgo]`.

Na primeira vez que o botão é exibido, `count` será `0` porque você passou `0` para `useState()`. Quando você quiser alterar o estado, chame `setCount()` e passe o novo valor para ele. Clicar neste botão irá incrementar o contador:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicado {count} vezes
    </button>
  );
}
```

O React chamará novamente a função do seu componente. Desta vez, `count` será `1`. Depois será `2`. E assim por diante.

Se você renderizar o mesmo componente várias vezes, cada um terá seu próprio estado. Clique em cada botão separadamente:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Contadores que atualiza separadamente</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicado {count} vezes
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Note como cada botão "lembra" seu próprio estado `count` e não afeta os outros botões.

## Usando Hooks {/*using-hooks*/}

Funções que começam com `use` são chamadas de Hooks. `useState` é um Hook integrado fornecido pelo React. Você pode encontrar outros Hooks integrados na [referência da API.](/reference/react). Você também pode escrever seus próprios Hooks combinando com os existentes.

Hooks são mais restritivos do que outras funções. Você só pode chamar Hooks *no topo* dos seus componentes (ou de outros Hooks). Se você quiser usar `useState` em uma condição ou um loop, extraia um novo componente e coloque-o lá.

## Compartilhando dados entre componentes {/*sharing-data-between-components*/}

No exemplo anterior, cada `MyButton` tinha seu próprio `count` independente, e quando cada botão era clicado, apenas o `count` do botão clicado mudava:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagrama mostrando uma árvore de três componentes, um pai denominado MyApp e dois filhos denominados MyButton. Ambos os componentes MyButton contêm uma contagem com valor zero.">

Inicialmente, o estado `count` de cada `MyButton` é `0`.

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="O mesmo diagrama que o anterior, com a contagem do primeiro componente filho MyButton destacada indicando um clique com o valor da contagem incrementado para um. O segundo componente MyButton ainda contém o valor zero.">

O primeiro `MyButton` atualiza seu `count` para `1`.

</Diagram>

</DiagramGroup>

No entanto, normalment você vai precisar que componentes *compartilhem dados e sempre sejam atualizados juntos*.

Para fazer com que ambos os componentes `MyButton` exibam o mesmo `count` e sejam atualizados juntos, você precisa mover o estado dos botões individuais "para cima", para o componente mais próximo que contenha todos eles.

Neste exemplo, é o `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagrama mostrando uma árvore de três componentes, um pai denominado MyApp e dois filhos denominados MyButton. MyApp contém um valor de contagem de zero que é passado para os dois componentes MyButton, que também mostram o valor zero." >

Inicialmente, o estado `count` do `MyApp` é `0` e é passado para ambos os filhos.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="O mesmo diagrama que o anterior, com a contagem do componente MyApp pai destacada, indicando um clique com o valor incrementado para um. O fluxo para ambos os componentes filhos MyButton também está destacado, e o valor da contagem em cada filho está definido como um, indicando que o valor foi passado para baixo." >

Ao clicar, o `MyApp` atualiza seu estado `count` para `1` e o passa para ambos os filhos.

</Diagram>

</DiagramGroup>

Agora, quando você clicar em qualquer botão, o estado `count` em `MyApp` será atualizado, e essa alteração será refletida em ambos os botões em `MyButton`. Você pode expressar isso em código dessa forma.


Primeiro, *mova o estado* de `MyButton` para `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Contadores que atualiza separadamente</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... Estamos movendo o código daqui ...
}

```

Então, *passe o estado de `MyApp` para cada `MyButton`*, juntamente com o manipulador de cliques compartilhado. Você pode passar informações para `MyButton` usando as chaves JSX, assim como fez anteriormente com tags incorporadas como `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Contadores que são atualizados juntos</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

A informação que você passa dessa forma é chamada de _props_. Agora, o componente `MyApp` contém o estado `count` e o manipulador de eventos `handleClick`, e *passa ambos como props* para cada um dos botões.

Por fim, altere `MyButton` para *ler* as props que você passou do seu componente pai:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicado {count} vezes
    </button>
  );
}
```

Quando você clica no botão, o evento `onClick` é disparado. O `onClick` de cada botão foi definido como a função `handleClick` dentro de `MyApp`, então o código dentro dela é executado. Esse código chama `setCount(count + 1)`, incrementando a variável de estado `count`. O novo valor de `count` é passado como uma prop para cada botão, então todos mostram o novo valor. Isso é chamado de "elevar o estado". Ao mover o estado para cima, você o compartilhou entre os componentes.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Contadores que são atualizados juntos</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicado {count} vezes
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Próximo passos {/*next-steps*/}

Até agora, você aprendeu os fundamentos de como escrever código em React!

Confira o [Tutorial](/learn/tutorial-tic-tac-toe) para colocá-los em prática e construir seu primeiro mini-aplicativo com React.