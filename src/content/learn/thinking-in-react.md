---
title: Pensando em React
---

<Intro>

O React pode mudar a maneira como você pensa sobre os designs que você vê e os aplicativos que você constrói. Ao construir uma interface de usuário com o React, você primeiro a dividirá em partes chamadas *componentes*. Em seguida, você descreverá os diferentes estados visuais para cada um de seus componentes. Finalmente, você conectará seus componentes para que os dados fluam através deles. Neste tutorial, guiaremos você pelo processo de pensamento de como construir uma tabela de dados de produto pesquisável com React.

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

Para implementar uma UI em React, você geralmente seguirá as mesmas cinco etapas.

## Etapa 1: Divida a UI em uma hierarquia de componentes {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Comece desenhando caixas em torno de cada componente e subcomponente no mockup e dando nome a eles. Se você trabalha com um designer, ele já pode ter nomeado esses componentes em sua ferramenta de design. Pergunte a ele!

Dependendo de sua experiência, você pode pensar em dividir um design em componentes de maneiras diferentes:

*   **Programação**--use as mesmas técnicas para decidir se você deve criar uma nova função ou objeto. Uma dessas técnicas é o [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), ou seja, um componente deve, idealmente, fazer apenas uma coisa. Se ele acabar crescendo, ele deve ser decomposto em componentes menores.
*   **CSS**--considere para quais seletores de classe você faria. (No entanto, os componentes são um pouco menos granulares.)
*   **Design**--considere como você organizaria as camadas do design.

Se seu JSON estiver bem estruturado, você frequentemente descobrirá que ele mapeia naturalmente para a estrutura de componentes de sua UI. Isso ocorre porque a UI e os modelos de dados geralmente têm a mesma arquitetura de informações, ou seja, a mesma forma. Separe sua UI em componentes, onde cada componente corresponde a uma parte de seu modelo de dados.

Existem cinco componentes nesta tela:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1.  `FilterableProductTable` (cinza) contém todo o aplicativo.
2.  `SearchBar` (azul) recebe a entrada do usuário.
3.  `ProductTable` (lavanda) exibe e filtra a lista de acordo com a entrada do usuário.
4.  `ProductCategoryRow` (verde) exibe um cabeçalho para cada categoria.
5.  `ProductRow` (amarelo) exibe uma linha para cada produto.

</CodeDiagram>

</FullWidth>

Se você olhar para `ProductTable` (lavanda), verá que o cabeçalho da tabela (contendo os rótulos "Name" e "Price") não é um componente próprio. Esta é uma questão de preferência, e você pode seguir qualquer caminho. Para este exemplo, ele faz parte do `ProductTable` porque aparece dentro da lista do `ProductTable`. No entanto, se este cabeçalho se tornar complexo (por exemplo, se você adicionar a classificação), você poderá movê-lo para seu próprio componente `ProductTableHeader`.

Agora que você identificou os componentes no mockup, organize-os em uma hierarquia. Os componentes que aparecem dentro de outro componente no mockup devem aparecer como filhos na hierarquia:

*   `FilterableProductTable`
    *   `SearchBar`
    *   `ProductTable`
        *   `ProductCategoryRow`
        *   `ProductRow`

## Etapa 2: Crie uma versão estática em React {/*step-2-build-a-static-version-in-react*/}

Agora que você tem sua hierarquia de componentes, é hora de implementar seu aplicativo. A abordagem mais direta é construir uma versão que renderiza a UI de seu modelo de dados sem adicionar nenhuma interatividade... ainda! Muitas vezes é mais fácil construir a versão estática primeiro e adicionar interatividade mais tarde. Construir uma versão estática requer muita digitação e nenhum pensamento, mas adicionar interatividade requer muito pensamento e pouca digitação.

Para construir uma versão estática de seu aplicativo que renderize seu modelo de dados, você desejará construir [componentes](/learn/your-first-component) que reutilizem outros componentes e passem dados usando [props.](/learn/passing-props-to-a-component) Props são uma maneira de passar dados do pai para o filho. (Se você estiver familiarizado com o conceito de [state](/learn/state-a-components-memory), não use state para construir esta versão estática. State é reservado apenas para interatividade, isto é, dados que mudam com o tempo. Como esta é uma versão estática do aplicativo, você não precisa dele.)

Você pode construir "top down", começando com a construção dos componentes mais altos na hierarquia (como `FilterableProductTable`) ou "bottom up", trabalhando a partir de componentes mais baixos (como `ProductRow`). Em exemplos mais simples, geralmente é mais fácil ir de cima para baixo, e em projetos maiores, é mais fácil ir de baixo para cima.

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

(Se este código parecer intimidador, analise o [Início Rápido](/learn/) primeiro!)

Depois de construir seus componentes, você terá uma biblioteca de componentes reutilizáveis que renderiza seu modelo de dados. Como este é um aplicativo estático, os componentes retornarão apenas JSX. O componente no topo da hierarquia (`FilterableProductTable`) aceitará seu modelo de dados como uma prop. Isso é chamado de _fluxo de dados unidirecional_ porque os dados fluem de cima para baixo do componente de nível superior para os da parte inferior da árvore.

<Pitfall>

Neste ponto, você não deve estar usando nenhum valor de state. Isso é para a próxima etapa!

</Pitfall>

## Etapa 3: Encontre a representação mínima, mas completa, do state da UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Para tornar a UI interativa, você precisa permitir que os usuários alterem seu modelo de dados subjacente. Você usará *state* para isso.

Pense no state como o conjunto mínimo de dados em mudança que seu aplicativo precisa lembrar. O princípio mais importante para estruturar o state é mantê-lo [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Descubra a representação mínima absoluta do state que seu aplicativo precisa e calcule todo o resto sob demanda. Por exemplo, se você estiver construindo uma lista de compras, poderá armazenar os itens como um array em state. Se você também quiser exibir o número de itens na lista, não armazene o número de itens como outro valor de state - em vez disso, leia o comprimento do seu array.

Agora pense em todos os dados de exemplo neste aplicativo:

1.  A lista original de produtos
2.  O texto de pesquisa que o usuário inseriu
3.  O valor da checkbox
4.  A lista filtrada de produtos

Quais destes são state? Identifique aqueles que não são:

*   Ele **permanece inalterado** ao longo do tempo? Se sim, não é state.
*   Ele é **passado de um pai** via props? Se sim, não é state.
*   Você **pode calculá-lo** com base no state ou props existentes em seu componente? Se sim, *definitivamente* não é state!

O que sobra é provavelmente state.

Vamos repassar um por um novamente:

1.  A lista original de produtos é **passada como props, então não é state.**
2.  O texto de pesquisa parece ser state, pois muda com o tempo e não pode ser calculado a partir de nada.
3.  O valor da checkbox parece ser state, pois muda com o tempo e não pode ser calculado a partir de nada.
4.  A lista filtrada de produtos **não é state porque pode ser calculada** pegando a lista original de produtos e filtrando-a de acordo com o texto de pesquisa e o valor da checkbox.

Isso significa que somente o texto de pesquisa e o valor da checkbox são state! Muito bom!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Existem dois tipos de dados de "modelo" no React: props e state. Os dois são muito diferentes:

*   [**Props** são como argumentos que você passa](/learn/passing-props-to-a-component)para uma função. Eles permitem que um componente pai passe dados para um componente filho e personalize sua aparência. Por exemplo, um `Form` pode passar uma prop `color` para um `Button`.
*   [**State** é como a memória de um componente.](/learn/state-a-components-memory) Ele permite que um componente acompanhe algumas informações e as altere em resposta a interações. Por exemplo, um `Button` pode acompanhar o state `isHovered`.

Props e state são diferentes, mas funcionam em conjunto. Um componente pai geralmente manterá algumas informações em state (para que possa alterá-las) e *passará para baixo* para componentes filhos como suas props. Está tudo bem se a diferença ainda parecer confusa na primeira leitura. Leva um pouco de prática para realmente fixar!

</DeepDive>

## Etapa 4: Identifique onde seu state deve viver {/*step-4-identify-where-your-state-should-live*/}

Depois de identificar os dados mínimos de state do seu aplicativo, você precisa identificar qual componente é responsável por alterar este state, ou *possui* o state. Lembre-se: o React usa fluxo de dados unidirecional, passando dados pela hierarquia de componentes do componente pai para o componente filho. Pode não ser imediatamente claro qual componente deve possuir qual state. Isso pode ser desafiador se você é novo nesse conceito, mas você pode descobrir seguindo estas etapas!

Para cada parte do state em seu aplicativo:

1.  Identifique *todos* os componentes que renderizam algo com base nesse state.
2.  Encontre o componente pai comum mais próximo - um componente acima de todos eles na hierarquia.
3.  Decida onde o state deve viver:
    1.  Frequentemente, você pode colocar o state diretamente em seu pai comum.
    2.  Você também pode colocar o state em algum componente acima de seu pai comum.
    3.  Se você não conseguir encontrar um componente onde faça sentido possuir o state, crie um novo componente apenas para manter o state e adicione-o em algum lugar na hierarquia acima do componente pai comum.

Na etapa anterior, você encontrou duas partes de state neste aplicativo: o texto de entrada da pesquisa e o valor da checkbox. Neste exemplo, eles sempre aparecem juntos, então faz sentido colocá-los no mesmo lugar.

Agora, vamos executar nossa estratégia para eles:

1.  **Identifique os componentes que usam o state:**
    *   `ProductTable` precisa filtrar a lista de produtos com base nesse state (texto de pesquisa e valor da checkbox).
    *   `SearchBar` precisa exibir esse state (texto de pesquisa e valor da checkbox).
2.  **Encontre seu pai comum:** O primeiro componente pai que ambos os componentes compartilham é `FilterableProductTable`.
3.  **Decida onde o state vive**: Manteremos o texto do filtro e os valores do state verificados em `FilterableProductTable`.

Portanto, os valores de state viverão em `FilterableProductTable`.

Adicione state ao componente com o [`useState()` Hook.](/reference/react/useState) Hooks são funções especiais que permitem que você "se conecte" ao React. Adicione duas variáveis de state na parte superior de `FilterableProductTable` e especifique seu estado inicial:

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

Você pode começar a ver como seu aplicativo se comportará. Edite o valor inicial `filterText` de `useState('')` para `useState('fruit')` no código do sandbox abaixo. Você verá o texto de entrada da pesquisa e a atualização da tabela:

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

Observe que editar o formulário ainda não funciona. Há um erro de console no sandbox acima explicando o porquê:

<ConsoleBlock level="error">

Você forneceu uma prop \`value\` para um campo de formulário sem um manipulador \`onChange\`. Isso renderizará um campo somente leitura.

</ConsoleBlock>

No sandbox acima, `ProductTable` e `SearchBar` leem as props `filterText` e `inStockOnly` para renderizar a tabela, a entrada e a checkbox. Por exemplo, aqui está como `SearchBar` preenche o valor da entrada:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

No entanto, você ainda não adicionou nenhum código para responder às ações do usuário, como digitar. Esta será sua etapa final.

## Etapa 5: Adicione o fluxo de dados inverso {/*step-5-add-inverse-data-flow*/}

Atualmente, seu aplicativo renderiza corretamente com as props e o state fluindo pela hierarquia. Mas para alterar o state de acordo com a entrada do usuário, você precisará suportar dados que fluem de outra maneira: os componentes do formulário na parte inferior da hierarquia precisam atualizar o state em `FilterableProductTable`.

O React torna este fluxo de dados explícito, mas requer um pouco mais de digitação do que a associação de dados bidirecional. Se você tentar digitar ou marcar a caixa no exemplo acima, verá que o React ignora sua entrada. Isso é intencional. Ao escrever `<input value={filterText} />`, você definiu a prop `value`da `input` para ser sempre igual ao state `filterText` passado de `FilterableProductTable`. Como o state `filterText` nunca é definido, a entrada nunca muda.

Você deseja fazer com que, sempre que o usuário alterar as entradas do formulário, o state seja atualizado para refletir essas alterações. O state é propriedade de `FilterableProductTable`, portanto, somente ele pode chamar `setFilterText` e `setInStockOnly`. Para permitir que o `SearchBar` atualize o state do `FilterableProductTable`, você precisa passar essas funções para `SearchBar`:

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

Dentro do `SearchBar`, você adicionará os manipuladores de eventos `onChange` e definirá o state pai a partir deles:

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

Agora o aplicativo funciona totalmente!

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

Você pode aprender tudo sobre lidar com eventos e atualizar o state na seção [Adicionando Interatividade](/learn/adding-interactivity).

## Para onde ir a partir daqui {/*where-to-go-from-here*/}

Esta foi uma breve introdução sobre como pensar em construir componentes e aplicativos com o React. Você pode [iniciar um projeto React](/learn/installation) agora ou [aprofundar em toda a sintaxe](/learn/describing-the-ui) usada neste tutorial.