---
title: Construindo a UI
---

<Intro>

React é uma biblioteca JavaScript para renderizar interfaces de usuário (UI). A interface do usuário é construída a partir de pequenas unidades, como botões, texto e imagens. O React permite combiná-los em *componentes.* encaixáveis ​​e reutilizáveis. De sites a aplicativos de telefone, tudo na tela pode ser dividido em componentes. Neste capítulo, você aprenderá a criar, personalizar e exibir componentes React condicionalmente.

</Intro>

<YouWillLearn isChapter={true}>

<<<<<<< HEAD
* [Como criar seu primeiro componente React](/learn/your-first-component)
* [Quando e como criar múltiplos componentes](/learn/importing-and-exporting-components)
* [Como escrever tags dentro do JavaScript usando JSX](/learn/writing-markup-with-jsx)
* [Como utilizar chaves no JSX para utilizar funcões JavaScript nos seus componentes](/learn/javascript-in-jsx-with-curly-braces)
* [Como configurar componentes utilizando props(propriedades)](/learn/passing-props-to-a-component)
* [Como renderizar componentes de forma condicional](/learn/conditional-rendering)
* [Como renderizar múltiplos componentes de uma só vez](/learn/rendering-lists)
* [Como evitar comportamentos inesperados mantendo seus componentes puros](/learn/keeping-components-pure)
=======
* [How to write your first React component](/learn/your-first-component)
* [When and how to create multi-component files](/learn/importing-and-exporting-components)
* [How to add markup to JavaScript with JSX](/learn/writing-markup-with-jsx)
* [How to use curly braces with JSX to access JavaScript functionality from your components](/learn/javascript-in-jsx-with-curly-braces)
* [How to configure components with props](/learn/passing-props-to-a-component)
* [How to conditionally render components](/learn/conditional-rendering)
* [How to render multiple components at a time](/learn/rendering-lists)
* [How to avoid confusing bugs by keeping components pure](/learn/keeping-components-pure)
* [Why understanding your UI as trees is useful](/learn/understanding-your-ui-as-a-tree)
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

</YouWillLearn>

## Seu Primeiro Componente {/*your-first-component*/}

Aplicações React são construídas a partir de partes isoladas da UI chamadas de *componentes*. Um componente React é uma função JavaScript que você pode usar em combinação com tags. Os componentes podem ser tão pequenos quanto um botão ou tão grandes quanto uma página inteira. Abaixo você pode ver um componente `Gallery` renderizando três componentes `Profile`:
<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Leia **[Seu Primeiro Componente](/learn/your-first-component)** para aprender como criar e usar componentes React.

</LearnMore>

## Importando e Exportando Componentes {/*importing-and-exporting-components*/}

Você pode declarar vários componentes em um único arquivo, mas arquivos grandes podem ser difíceis de navegar. Para resolver isso, você pode *exportar* um componente para um arquivo separado, e então *importar* este componente em outro arquivo:


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Leia **[Importando e Exportando Componentes](/learn/importing-and-exporting-components)** para aprender como separar seus componentes em arquivos próprios.

</LearnMore>

## Escrevendo Tags com JSX {/*writing-markup-with-jsx*/}

Cada componente React é uma função JavaScript que pode conter tags que o React renderiza no navegador. Componentes React utilizam uma extensão de sintaxe chamada JSX para representar essas tags. JSX parece muito com HTML, mas é um pouco mais rígido e pode exibir informações de forma dinâmica.

Nem sempre colar um HTML pré-existente irá funcionar em um componente React:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Isto não vai funcionar!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Você pode consertar seu HTML pré-existente usando um [conversor](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Leia **[Escrevendo Tags com JSX](/learn/writing-markup-with-jsx)** para aprender como escrever JSX corretamente.

</LearnMore>

## JavaScript entre Chaves no JSX {/*javascript-in-jsx-with-curly-braces*/}

JSX permite que você escreva de maneira análoga ao HTML dentro de um arquivo JavaScript, mantendo a lógica de renderização e o conteúdo no mesmo lugar. Em alguns momentos, você pode querer adicionar alguma lógica JavaScript ou uma propriedade dinâmica em uma tag. Neste tipo de situação, você pode utilizar chaves no JSX para "abrir uma janela" que entenda JavaScript: 

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Leia **[JavaScript entre Chaves no JSX](/learn/javascript-in-jsx-with-curly-braces)** para aprender como acessar dados do seu código JavaScript a partir do JSX.

</LearnMore>

## Passando Props para um Componente {/*passing-props-to-a-component*/}

Componentes React utilizam *propriedades (props)* para se comunicarem entre si. Cada componente pai pode passar informações para seus componentes filhos por meio de props. Props lembram um pouco os atributos HTML, mas você pode passar qualquer valor que seja válido em JavaScript por meio delas, incluindo objetos, arrays, funções e até mesmo JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Leia **[Passando Props para um Componente](/learn/passing-props-to-a-component)** para aprender como passar e ler props.

</LearnMore>

## Renderização Condicional {/*conditional-rendering*/}

Frequentemente você vai precisar exibir diferentes conteúdos nos seus componentes de acordo com certas condições. No React, você pode renderizar JSX condicionalmente utilizando uma sintaxe parecida com JavaScript, que usa o comando `if`, e operadores lógicos `&&` e `? :`.

Neste exemplo, o operador JavaScript `&&` é utilizado para renderizar condicionalmente um marcação de 'concluído':


<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Leia **[Renderização Condicional](/learn/conditional-rendering)** para aprender diferentes maneiras de renderizar um conteúdo de forma condicional.

</LearnMore>

## Renderizando Listas {/*rendering-lists*/}

Frequentemente você vai desejar exibir vários componentes similares a partir de uma lista de dados. Você pode utilizar as funções `filter()` e `map()` do JavaScript no React para filtrar e transformar suas listas de dados em listas de componentes.

Para cada item da lista, você precisa especificar uma chave (`key`). Normalmente é desejável que você use um ID do seu banco de dados como `key`. Chaves permitem que o React rastreie o local de cada item da lista, mesmo que a lista mude.


<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Leia **[Renderizando Listas](/learn/rendering-lists)** para aprender como renderizar uma lista de compomentes e como escolher uma chave para cada item da lista.

</LearnMore>

## Mantendo Seus Componentes Puros {/*keeping-components-pure*/}

Algumas funções JavaScript são *puras*. Uma função pura:


* **Cuida apenas de suas próprias responsabilidades.** Isso significa que ela não modifica nenhum objeto ou variável que existia antes que ela fosse chamada.
* **Mesmas entradas, mesma saída.** Dadas as mesmas entradas, uma função pura sempre deve retornar o mesmo resultado.

Escrevendo apenas funções puras, você pode evitar muitos erros e comportamentos imprevisíveis conforme seu código aumenta. Este é um exemplo de componente impuro:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Você pode tornar esse componente puro passando uma prop ao invés de modificar uma variável pré-existente:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Leia **[Mantendo Seus Componentes Puros](/learn/keeping-components-pure)** para aprender como criar componentes puros e funções previsíveis.

</LearnMore>

<<<<<<< HEAD
## O que vem depois? {/*whats-next*/}
=======
## Your UI as a tree {/*your-ui-as-a-tree*/}

React uses trees to model the relationships between components and modules. 

A React render tree is a representation of the parent and child relationship between components. 

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

An example React render tree.

</Diagram>

Components near the top of the tree, near the root component, are considered top-level components. Components with no child components are leaf components. This categorization of components is useful for understanding data flow and rendering performance.

Modelling the relationship between JavaScript modules is another useful way to understand your app. We refer to it as a module dependency tree. 

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

An example module dependency tree.

</Diagram>

A dependency tree is often used by build tools to bundle all the relevant JavaScript code for the client to download and render. A large bundle size regresses user experience for React apps. Understanding the module dependency tree is helpful to debug such issues. 

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Read **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)** to learn how to create a render and module dependency trees for a React app and how they're useful mental models for improving user experience and performance.

</LearnMore>


## What's next? {/*whats-next*/}
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

Navegue para a página [Seu Primeiro Componente](/learn/your-first-component) para começar a ler esse capítulo página por página!

Ou, se você já tem familirialidade com estes tópicos, por quê não ler sobre [Adicionando Interatividade](/learn/adding-interactivity)?
