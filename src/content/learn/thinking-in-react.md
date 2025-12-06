---
title: Pensando em React
---

<Intro>

O React pode mudar a forma como você pensa sobre os designs que observa e as aplicações que constrói. Quando você constrói uma interface de usuário com React, primeiro você a dividirá em partes chamadas *componentes*. Em seguida, você descreverá os diferentes estados visuais para cada um dos seus componentes. Finalmente, você conectará seus componentes para que os dados fluam através deles. Neste tutorial, nós o guiaremos através do processo de pensamento de construir uma tabela de dados de produtos pesquisável com React.

</Intro>

## Comece com o mockup {/*start-with-the-mockup*/}

Imagine que você já tem uma API JSON e um mockup de um designer.

A API JSON retorna alguns dados que se parecem com isto:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

O mockup se parece com isto:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Para implementar uma UI em React, você geralmente seguirá os mesmos cinco passos.

## Passo 1: Divida a UI em uma hierarquia de componentes {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Comece desenhando caixas ao redor de cada componente e subcomponente no mockup e nomeando-os. Se você trabalha com um designer, eles podem já ter nomeado esses componentes em sua ferramenta de design. Pergunte a eles!

Dependendo do seu background, você pode pensar sobre dividir um design em componentes de diferentes maneiras:

<<<<<<< HEAD
* **Programação**--use as mesmas técnicas para decidir se você deve criar uma nova função ou objeto. Uma dessas técnicas é o [princípio da responsabilidade única](https://en.wikipedia.org/wiki/Single_responsibility_principle), ou seja, um componente deve idealmente fazer apenas uma coisa. Se ele acabar crescendo, deve ser decomposto em subcomponentes menores.
* **CSS**--considere para o que você faria seletores de classe. (No entanto, os componentes são um pouco menos granulares.)
* **Design**--considere como você organizaria as camadas do design.
=======
* **Programming**--use the same techniques for deciding if you should create a new function or object. One such technique is the [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns), that is, a component should ideally only be concerned with one thing. If it ends up growing, it should be decomposed into smaller subcomponents. 
* **CSS**--consider what you would make class selectors for. (However, components are a bit less granular.)
* **Design**--consider how you would organize the design's layers.
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

Se seu JSON está bem estruturado, você frequentemente descobrirá que ele mapeia naturalmente para a estrutura de componentes de sua UI. Isso ocorre porque UI e modelos de dados frequentemente têm a mesma arquitetura de informação--ou seja, a mesma forma. Separe sua UI em componentes, onde cada componente corresponde a uma parte do seu modelo de dados.

Há cinco componentes nesta tela:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (cinza) contém toda a aplicação.
2. `SearchBar` (azul) recebe a entrada do usuário.
3. `ProductTable` (lavanda) exibe e filtra a lista de acordo com a entrada do usuário.
4. `ProductCategoryRow` (verde) exibe um cabeçalho para cada categoria.
5. `ProductRow` (amarelo) exibe uma linha para cada produto.

</CodeDiagram>

</FullWidth>

Se você olhar para `ProductTable` (lavanda), verá que o cabeçalho da tabela (contendo os rótulos "Name" e "Price") não é seu próprio componente. Esta é uma questão de preferência, e você pode ir de qualquer forma. Para este exemplo, é parte de `ProductTable` porque aparece dentro da lista de `ProductTable`. No entanto, se este cabeçalho crescer para ser complexo (por exemplo, se você adicionar ordenação), você pode movê-lo para seu próprio componente `ProductTableHeader`.

Agora que você identificou os componentes no mockup, organize-os em uma hierarquia. Componentes que aparecem dentro de outro componente no mockup devem aparecer como filhos na hierarquia:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Passo 2: Construa uma versão estática em React {/*step-2-build-a-static-version-in-react*/}

Agora que você tem sua hierarquia de componentes, é hora de implementar sua aplicação. A abordagem mais direta é construir uma versão que renderiza a UI a partir do seu modelo de dados sem adicionar qualquer interatividade... ainda! É frequentemente mais fácil construir a versão estática primeiro e adicionar interatividade depois. Construir uma versão estática requer muito digitação e nenhum pensamento, mas adicionar interatividade requer muito pensamento e pouca digitação.

Para construir uma versão estática de sua aplicação que renderiza seu modelo de dados, você vai querer construir [componentes](/learn/your-first-component) que reutilizam outros componentes e passam dados usando [props.](/learn/passing-props-to-a-component) Props são uma forma de passar dados de pai para filho. (Se você está familiarizado com o conceito de [state](/learn/state-a-components-memory), não use state de forma alguma para construir esta versão estática. State é reservado apenas para interatividade, ou seja, dados that change over time. Como esta é uma versão estática da aplicação, você não precisa dele.)

Você pode construir "de cima para baixo" começando com a construção dos componentes mais altos na hierarquia (como `FilterableProductTable`) ou "de baixo para cima" trabalhando a partir de componentes mais baixos (como `ProductRow`). Em exemplos mais simples, é geralmente mais fácil ir de cima para baixo, e em projetos maiores, é mais fácil ir de baixo para cima.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Se este código parece intimidante, passe pelo [Início Rápido](/learn/) primeiro!)

Depois de construir seus componentes, você terá uma biblioteca de componentes reutilizáveis que renderizam seu modelo de dados. Como esta é uma aplicação estática, os componentes apenas retornarão JSX. O componente no topo da hierarquia (`FilterableProductTable`) receberá seu modelo de dados como prop. Isso é chamado de _fluxo de dados unidirecional_ porque os dados fluem de cima do componente de nível superior para os da parte inferior da árvore.

<Pitfall>

Neste ponto, você não deve estar usando nenhum valor de state. Isso é para o próximo passo!

</Pitfall>

## Passo 3: Encontre a representação mínima mas completa do estado da UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Para tornar a UI interativa, você precisa permitir que os usuários alterem seu modelo de dados subjacente. Você usará *state* para isso.

Pense no state como o conjunto mínimo de dados em mudança que sua aplicação precisa lembrar. O princípio mais importante para estruturar o state é mantê-lo [DRY (Don't Repeat Yourself - Não Se Repita).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Descubra a representação absolutamente mínima do state que sua aplicação precisa e compute todo o resto sob demanda. Por exemplo, se você está construindo uma lista de compras, você pode armazenar os itens como um array no state. Se você também quer exibir o número de itens na lista, não armazene o número de itens como outro valor de state--em vez disso, leia o comprimento do seu array.

Agora pense em todas as partes de dados nesta aplicação de exemplo:

1. A lista original de produtos
2. O texto de busca que o usuário digitou
3. O valor da checkbox
4. A lista filtrada de produtos

Quais desses são state? Identifique os que não são:

* **Permanece inalterado** ao longo do tempo? Se sim, não é state.
* É **passado de um pai** via props? Se sim, não é state.
* **Você pode computá-lo** baseado no state ou props existentes em seu componente? Se sim, *definitivamente* não é state!

O que sobra provavelmente é state.

Vamos passá-los um por um novamente:

1. A lista original de produtos é **passada como props, então não é state.**
2. O texto de busca parece ser state já que muda ao longo do tempo e não pode ser computado a partir de nada.
3. O valor da checkbox parece ser state já que muda ao longo do tempo e não pode ser computado a partir de nada.
4. A lista filtrada de produtos **não é state porque pode ser computada** pegando a lista original de produtos e filtrando-a de acordo com o texto de busca e o valor da checkbox.

Isso significa que apenas o texto de busca e o valor da checkbox são state! Muito bem!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Há dois tipos de dados "modelo" em React: props e state. Os dois são muito diferentes:

* [**Props** são como argumentos que você passa](/learn/passing-props-to-a-component) para uma função. Eles permitem que um componente pai passe dados para um componente filho e personalize sua aparência. Por exemplo, um `Form` pode passar uma prop `color` para um `Button`.
* [**State** é como a memória de um componente.](/learn/state-a-components-memory) Ele permite que um componente mantenha controle de algumas informações e as altere em resposta a interações. Por exemplo, um `Button` pode manter controle do state `isHovered`.

Props e state são diferentes, mas trabalham juntos. Um componente pai frequentemente manterá algumas informações no state (para que possa alterá-las), e *passá-las para baixo* para componentes filhos como suas props. É normal se a diferença ainda parecer confusa na primeira leitura. Leva um pouco de prática para realmente entender!

</DeepDive>

## Passo 4: Identifique onde seu state deve viver {/*step-4-identify-where-your-state-should-live*/}

Depois de identificar os dados de state mínimos da sua aplicação, você precisa identificar qual componente é responsável por alterar este state, ou *possui* o state. Lembre-se: o React usa fluxo de dados unidirecional, passando dados pela hierarquia de componentes do componente pai para o componente filho. Pode não estar imediatamente claro qual componente deve possuir qual state. Isso pode ser desafiador se você é novo neste conceito, mas você pode descobrir seguindo estes passos!

Para cada parte do state em sua aplicação:

1. Identifique *todos* os componentes que renderizam algo baseado naquele state.
2. Encontre o componente pai comum mais próximo--um componente acima de todos eles na hierarquia.
3. Decida onde o state deve viver:
    1. Frequentemente, você pode colocar o state diretamente no pai comum deles.
    2. Você também pode colocar o state em algum componente acima do pai comum deles.
    3. Se você não conseguir encontrar um componente onde faça sentido possuir o state, crie um novo componente apenas para manter o state e adicione-o em algum lugar na hierarquia acima do componente pai comum.

No passo anterior, você encontrou duas partes de state nesta aplicação: o texto de entrada de busca, e o valor da checkbox. Neste exemplo, eles sempre aparecem juntos, então faz sentido colocá-los no mesmo lugar.

Agora vamos executar nossa estratégia para eles:

1. **Identifique componentes que usam state:**
    * `ProductTable` precisa filtrar a lista de produtos baseada naquele state (texto de busca e valor da checkbox).
    * `SearchBar` precisa exibir aquele state (texto de busca e valor da checkbox).
2. **Encontre o pai comum:** O primeiro componente pai que ambos os componentes compartilham é `FilterableProductTable`.
3. **Decida onde o state vive**: Vamos manter os valores de texto de filtro e estado marcado em `FilterableProductTable`.

Então os valores de state viverão em `FilterableProductTable`.

Adicione state ao componente com o [`useState()` Hook.](/reference/react/useState) Hooks são funções especiais que permitem que você "se conecte" ao React. Adicione duas variáveis de state no topo de `FilterableProductTable` e especifique seu state inicial:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Em seguida, passe `filterText` e `inStockOnly` para `ProductTable` e `SearchBar` como props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Você pode começar a ver como sua aplicação se comportará. Edite o valor inicial de `filterText` de `useState('')` para `useState('fruit')` no código sandbox abaixo. Você verá tanto o texto de entrada de busca quanto a tabela atualizarem:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Note que editar o formulário ainda não funciona. Há um erro no console no sandbox acima explicando o porquê:

<ConsoleBlock level="error">

Você forneceu uma prop \`value\` para um campo de formulário sem um manipulador \`onChange\`. Isso renderizará um campo somente leitura.

</ConsoleBlock>

No sandbox acima, `ProductTable` e `SearchBar` leem as props `filterText` e `inStockOnly` para renderizar a tabela, a entrada, e a checkbox. Por exemplo, aqui está como `SearchBar` popula o valor da entrada:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

No entanto, você ainda não adicionou nenhum código para responder às ações do usuário como digitação. Este será seu passo final.

## Passo 5: Adicione fluxo de dados inverso {/*step-5-add-inverse-data-flow*/}

Atualmente sua aplicação renderiza corretamente com props e state fluindo pela hierarquia. Mas para alterar o state de acordo com a entrada do usuário, você precisará suportar dados fluindo no outro sentido: os componentes de formulário profundos na hierarquia precisam atualizar o state em `FilterableProductTable`.

O React torna este fluxo de dados explícito, mas requer um pouco mais de digitação do que vinculação de dados bidirecional. Se você tentar digitar ou marcar a caixa no exemplo acima, verá que o React ignora sua entrada. Isso é intencional. Ao escrever `<input value={filterText} />`, você definiu a prop `value` do `input` para sempre ser igual ao state `filterText` passado de `FilterableProductTable`. Como o state `filterText` nunca é definido, a entrada nunca muda.

Você quer fazer com que sempre que o usuário altere as entradas do formulário, o state atualize para refletir essas mudanças. O state é possuído por `FilterableProductTable`, então apenas ele pode chamar `setFilterText` e `setInStockOnly`. Para permitir que `SearchBar` atualize o state de `FilterableProductTable`, você precisa passar essas funções para `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Dentro do `SearchBar`, você adicionará os manipuladores de evento `onChange` e definirá o state pai a partir deles:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

Agora a aplicação funciona completamente!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Você pode aprender tudo sobre manipulação de eventos e atualização de state na seção [Adicionando Interatividade](/learn/adding-interactivity).

## Para onde ir daqui {/*where-to-go-from-here*/}

Esta foi uma introdução muito breve sobre como pensar sobre construir componentes e aplicações com React. Você pode [iniciar um projeto React](/learn/installation) agora mesmo ou [mergulhar mais fundo em toda a sintaxe](/learn/describing-the-ui) usada neste tutorial.