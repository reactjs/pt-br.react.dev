---
title: Pensando do jeito React
---

<Intro>

React pode mudar a maneira como você pensa sobre os projetos que você vê e as aplicações que você constrói. Onde uma vez que você tenha visto uma floresta, depois de trabalhar com React, você irá apreciar as árvores individuais. React torna mais fácil pensar em sistemas de design e estados da UI. Neste tutorial, vamos guiá-lo através do processo de pensamento para construir uma tabela de dados de produtos pesquisáveis com o React.

</Intro>

## Comece com uma maquete {/*start-with-the-mockup*/}

Imagine que você já tenha uma API JSON e uma maquete desenvolvida por um designer.

A API JSON retorna dados que se parecem com isto:

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

A maquete se parece com isto:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Para implementar uma UI no React, você geralmente seguirá os mesmos cinco passos.

## Passo 1: Separe a UI em uma hierarquia de componentes {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Comece desenhando caixas em torno de cada componente e subcomponente da maquete e nomeando-os. Se você trabalhar com um designer, eles podem já ter nomeado estes componentes em sua ferramenta de projeto. Verifique com eles!

Dependendo de sua formação, você pode pensar em dividir um projeto em componentes de diferentes maneiras:

* **Programação**--use as mesmas técnicas para decidir se você deve criar uma nova função ou objeto. Uma dessas técnicas é o [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), ou seja, um componente deve idealmente fazer apenas uma coisa. Se ele acabar crescendo, ele deve ser decomposto em subcomponentes menores. 
* **CSS**--considere para o que você faria os seletores de classe. (No entanto, os componentes são um pouco menos granulares).
* **Design**--considere como você organizaria as camadas do projeto.

Se seu JSON estiver bem estruturado, você verá com freqüência que ele mapeia naturalmente a estrutura dos componentes de sua UI. Isso porque a UI e os modelos de dados muitas vezes têm a mesma arquitetura de informação--isto é, a mesma forma. Separe sua UI em componentes, onde cada componente corresponde a uma peça de seu modelo de dados.

Há cinco componentes nesta tela:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (cinza) contém o app todo.
2. `SearchBar` (azul) recebe o input do usuário.
3. `ProductTable` (lavanda) exibe e filtra a lista de acordo com a entrada do usuário.
4. `ProductCategoryRow` (verde) exibe um título para cada categoria.
5. `ProductRow`	(amarelo) exibe uma linha para cada produto.

</CodeDiagram>

</FullWidth>

Se você olhar para `ProductTable` (lavanda), verá que o header da tabela (contendo as etiquetas "Name" e "Price") não é seu próprio componente. Esta é uma questão de preferência, e você poderia ir para qualquer lado. Para este exemplo, é uma parte da `ProductTable` porque aparece dentro da lista da `ProductTable`. Entretanto, se este header se tornar complexo (por exemplo, se você acrescentar ordenação), faria sentido fazer deste seu próprio componente `ProductTableHeader`.

Agora que você identificou os componentes na maquete, organize-os em uma hierarquia. Os componentes que aparecem dentro de outro componente na maquete devem aparecer como um filho na hierarquia:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Passo 2: Crie uma versão estática em React {/*step-2-build-a-static-version-in-react*/}

Agora que você já tem sua hierarquia de componentes, chegou a hora de implementar o seu app. A abordagem mais simples é construir uma versão que renderize a UI a partir de seu modelo de dados sem adicionar nenhuma interatividade... ainda! Muitas vezes é mais fácil construir primeiro a versão estática e depois adicionar a interatividade separadamente. Construir uma versão estática requer muita digitação e pouco pensamento, mas adicionar interatividade requer muito pensamento e pouca digitação.

Para construir uma versão estática que renderiza seu modelo de dados, você quer criar [componentes](/learn/your-first-component) que reutilizem outros componentes e passem dados utilizando [props](/learn/passing-props-to-a-component). Props são uma forma de passar dados de pai para filho. Se você é familiar com o conceito de [state](/learn/state-a-components-memory), não use o state para construir essa versão estática. State é reservado apenas para interatividade, ou seja, dados que mudam com o tempo. Uma vez que essa é uma versão estática do app, seu uso não será necessário.

Você pode construir "top down", começando com a construção dos componentes superiores na hierarquia (como `FilterableProductTable`) ou "bottom up", trabalhando a partir de componentes inferiores (como `ProductRow`). Em exemplos mais simples, geralmente é mais fácil ir de cima para baixo, e em projetos maiores, é mais fácil ir de baixo para cima.

<Sandpack>

```jsx App.js
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

(Se este código parecer intimidante, passe primeiro pelo [Quick Start](/learn/)!)

Depois de construir seus componentes, você terá uma biblioteca de componentes reutilizáveis que renderizam seu modelo de dados. Como este é um app estático, os componentes só retornarão JSX. O componente no topo da hierarquia (`FilterableProductTable`) tomará seu modelo de dados como uma prop. Isto é chamado de _one-way data flow_ (fluxo de dados unidirecional) porque os dados fluem do componente de nível superior para o componente na parte inferior da árvore.

<Gotcha>

Neste ponto, você não deve estar usando nenhum valor de state. Isso é para o próximo passo!

</Gotcha>

## Passo 3: Encontre a representação mínima mas completa do state da UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Para tornar a UI interativa, você precisa deixar os usuários mudarem seu modelo de dados subjacente. Você usará o *state* para isso.

Pense no estado como o conjunto mínimo de dados em mudança que seu aplicativo precisa lembrar. O princípio mais importante para estruturar o estado é mantê-lo [DRY (Don't Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)]. Descubra a representação mínima absoluta do estado que sua aplicação precisa e calcule tudo o mais sob demanda. Por exemplo, se você estiver construindo uma lista de compras, você pode armazenar os itens como um vetor em estado. Se você também quiser exibir o número de itens na lista, não armazene o número de itens como outro valor de estado-- em vez disso, leia o comprimento de seu vetor.

Agora pense em todos os dados deste exemplo de aplicação:

1. A lista original de produtos
2. O texto de busca que o usuário digitou
3. O valor do checkbox
4. A lista filtrada de produtos

Quais deles são estados? Identifique os que não são:

* **Permanece inalterado** com o tempo? Se sim, não é state.
* É **recebido por um pai** via props? Se sim, não é state.
* **Você pode calculá-lo** com base no estado existente ou props em seu componente? Se sim, *definitivamente* não é state! 

O que restou provavelmente é state.

Vamos passar por eles um a um novamente:

1. A lista original de produtos é **passada como props, portanto não é state**
2. O texto de busca parece ser um state, pois muda com o tempo e não pode ser calculado a partir de nada.
3. O valor do checkbox parece ser um state, uma vez que muda com o tempo e não pode ser calculado a partir de nada.
4. A lista filtrada de produtos **não é state porque pode ser calculada** tomando a lista original de produtos e filtrando-a de acordo com o texto de busca e o valor do checkbox.

Isso significa que apenas o texto de busca e o valor da caixa de seleção são states! Muito bem feito!

<DeepDive title="Props vs State">

Há dois tipos de "modelo" de dados em React: props e state. Os dois são muito diferentes:

* [**Props** são como argumentos que você passa](/learn/passing-props-to-a-component) para uma função. Elas deixam um componente pai passar dados para um componente filho e personalizam sua aparência. Por exemplo, um `Form` pode passar uma `color` para um `Button`.
* [**State** é como a memória de um componente.](/learn/state-a-components-memory) Permite que um componente acompanhe algumas informações e as altere em resposta às interações. Por exemplo, um `Button` pode rastrear o estado `isHovered`.

Props e state são diferentes, mas eles trabalham juntos. Um componente pai muitas vezes mantém algumas informações em estado (para que possa mudá-las), e *passam-nas para baixo* para componentes filhos como props. Não há problema se a diferença ainda se sentir confusa na primeira leitura. É preciso um pouco de prática para que ela realmente grude!

</DeepDive>

## Passo 4: Identifique onde o state deve ficar {/*step-4-identify-where-your-state-should-live*/}

Após identificar os dados mínimos de estado de seu app, você precisa identificar qual componente é responsável pela mudança deste estado, ou *possuem* o estado. Lembre-se: React usa o fluxo de dados unidirecional, passando os dados pela hierarquia de componentes do pai para filho. Pode não ficar imediatamente claro qual componente deve possuir qual estado. Isto pode ser um desafio se você é novo neste conceito, mas você pode descobri-lo seguindo estas etapas!

Para cada pedaço de estado em sua aplicação:

1. Identificar *todos* os componentes que rendeerizam algo com base nesse estado.
2. Encontrar seu componente parental comum mais próximo-- um componente acima de todos eles na hierarquia.
3. Decidir onde o estado deve ficar:
    1. Muitas vezes, você pode colocar o estado diretamente em seus pais comuns.
    2. Você também pode colocar o estado em algum componente acima de seus pais comuns.
    3. Se você não conseguir encontrar um componente onde faça sentido possuir o estado, crie um novo componente apenas para manter o estado e adicione-o em algum lugar na hierarquia acima do componente pai comum.

Na etapa anterior, você encontrou duas partes de estado nesta aplicação: o texto de input da busca e o valor do checkbox. Neste exemplo, eles aparecem sempre juntos, portanto é mais fácil pensar neles como um único pedaço de estado.

Agora vamos analisar nossa estratégia para este estado:

1. **Identificar componentes que usam state:**
    * `ProductTable` precisa filtrar a lista de produtos com base nesse estado (texto de busca e valor do checkbox). 
    * `SearchBar` precisa exibir esse estado (texto de busca e valor do checkbox).
1. **Encontrar seu pai comum:** O primeiro componente pai que ambos os componentes compartilham é `FilterableProductTable`.
2. **Decidir onde o state vai ficar**: Manteremos o state de texto de busca e o valor do checkbox em `FilterableProductTable`.

Assim, os valores dos estados vão ficar em `FilterableProductTable`. 

Adicione estado ao componente com o [Hook `useState()`](/apis/usestate). Os hooks permitem "enganchar" o [ciclo de renderização](/learn/render-and-commit) de um componente. Adicione duas variáveis de estado no topo da `FilterableProductTable` e especifique o estado inicial de sua aplicação:

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

Você pode começar a ver como se comportará sua aplicação. Edite o valor inicial do `filterText` de `useState('')` para `useState('fruit')` no código sandbox abaixo. Você verá tanto o texto do input da busca quanto a tabela atualizarem:

<Sandpack>

```jsx App.js
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

Na sandbox acima, `ProductTable` e `SearchBar` lêem as props `filterText` e `inStockOnly` para renderizar a tabela, o input e o checkbox. Por exemplo, aqui é como a `SearchBar` preenche o valor do input:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```


Consulte o [Managing State](/learn/managing-state) para se aprofundar em como o React usa o estado e como você pode organizar sua aplicação com ele.

## Passo 5: Adicione o fluxo de dados inverso {/*step-5-add-inverse-data-flow*/}

Atualmente, seu app é renderizado corretamente com props e estado fluindo para baixo na hierarquia. Mas para mudar o estado de acordo com o input do usuário, você precisará suportar o fluxo de dados de outra forma: os componentes do formulário no fundo da hierarquia precisam atualizar o estado em `FilterableProductTable`.

React torna este fluxo de dados explícito, mas requer um pouco mais de digitação do que a vinculação de dados bidirecionais. Se você tentar digitar ou marcar o checkbox no exemplo acima, você verá que React ignora sua entrada. Isto é intencional. Ao escrever `<input value={filterText} />`, você definiu a propriedade `value` do `input` para ser sempre igual ao estado `filterText` passado pelo `FilterableProductTable`. Como o estado `filterText` nunca é setado, a entrada nunca muda.

Você quer que isso aconteça sempre que o usuário alterar as entradas do formulário, o estado se atualiza para refletir essas alterações. O estado pertence ao `FilterableProductTable`, portanto somente ele pode chamar `setFilterText` e `setInStockOnly`. Para deixar o `SearchBar` atualizar o estado da `FilterableProductTable`, você precisa passar estas funções para a `SearchBar`:

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

Dentro do `SearchBar`, você adicionará os manipuladores de eventos `onChange` e definirá o estado do pai a partir deles:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Agora a aplicação funciona plenamente!

<Sandpack>

```jsx App.js
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

Você pode aprender tudo sobre como lidar com eventos e atualizar o estado na seção [Adding Interactivity](/learn/adding-interactivity).

## Para onde ir a partir daqui {/*where-to-go-from-here*/}

Esta foi uma introdução muito breve sobre como pensar em construir componentes e aplicações com React. Você pode [iniciar um projeto React](/learn/installation) agora mesmo ou [se aprofundar em toda a sintaxe](/learn/describing-the-ui) usada neste tutorial.
