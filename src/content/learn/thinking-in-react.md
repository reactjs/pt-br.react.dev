---
title: Pensando em React
---

<Intro>

O React pode mudar a forma como você pensa sobre os designs que observa e os aplicativos que constrói. Quando você constrói uma interface de usuário com o React, você primeiro a divide em partes chamadas *componentes*. Em seguida, você descreve os diferentes estados visuais para cada um de seus componentes. Por fim, você conectará seus componentes para que os dados fluam através deles. Neste tutorial, vamos guiá-lo pelo processo de pensamento para construir uma tabela de dados de produtos pesquisável com o React.

</Intro>

## Comece com o mockup {/*start-with-the-mockup*/}

Imagine que você já tem uma API JSON e um mockup de um designer.

A API JSON retorna alguns dados que se parecem com isso:

```json
[
  { category: "Frutas", price: "$1", stocked: true, name: "Maçã" },
  { category: "Frutas", price: "$1", stocked: true, name: "Fruta-dragão" },
  { category: "Frutas", price: "$2", stocked: false, name: "Maracujá" },
  { category: "Vegetais", price: "$2", stocked: true, name: "Espinafre" },
  { category: "Vegetais", price: "$4", stocked: false, name: "Abóbora" },
  { category: "Vegetais", price: "$1", stocked: true, name: "Ervilhas" }
]
```

O mockup se parece com isso:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Para implementar uma UI no React, você geralmente seguirá os mesmos cinco passos.

## Passo 1: Quebre a UI em uma hierarquia de componentes {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Comece desenhando caixas ao redor de cada componente e subcomponente no mockup e nomeando-os. Se você trabalhar com um designer, eles podem já ter nomeado esses componentes em sua ferramenta de design. Pergunte a eles!

Dependendo de sua formação, você pode pensar em dividir um design em componentes de diferentes maneiras:

* **Programação**--use as mesmas técnicas para decidir se deve criar uma nova função ou objeto. Uma dessas técnicas é o [princípio da responsabilidade única](https://en.wikipedia.org/wiki/Single_responsibility_principle), ou seja, um componente deve idealmente fazer apenas uma coisa. Se acabar crescendo, deve ser decomposto em subcomponentes menores. 
* **CSS**--considere o que você faria seletores de classe. (No entanto, os componentes são um pouco menos granulares.)
* **Design**--considere como você organizaria as camadas do design.

Se o seu JSON estiver bem estruturado, você frequentemente descobrirá que ele se mapeia naturalmente para a estrutura de componentes de sua UI. Isso ocorre porque as UI e os modelos de dados frequentemente têm a mesma arquitetura de informação--ou seja, a mesma forma. Separe sua UI em componentes, onde cada componente corresponde a uma parte do seu modelo de dados.

Existem cinco componentes nesta tela:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (cinza) contém todo o aplicativo.
2. `SearchBar` (azul) recebe a entrada do usuário.
3. `ProductTable` (lavanda) exibe e filtra a lista de acordo com a entrada do usuário.
4. `ProductCategoryRow` (verde) exibe um cabeçalho para cada categoria.
5. `ProductRow` (amarelo) exibe uma linha para cada produto.

</CodeDiagram>

</FullWidth>

Se você olhar para `ProductTable` (lavanda), verá que o cabeçalho da tabela (contendo os rótulos "Nome" e "Preço") não é seu próprio componente. Isso é uma questão de preferência, e você poderia seguir por qualquer caminho. Para este exemplo, é uma parte de `ProductTable` porque aparece dentro da lista de `ProductTable`. No entanto, se esse cabeçalho crescer para ser complexo (por exemplo, se você adicionar ordenação), você pode movê-lo para seu próprio componente `ProductTableHeader`.

Agora que você identificou os componentes no mockup, organize-os em uma hierarquia. Os componentes que aparecem dentro de outro componente no mockup devem aparecer como filhos na hierarquia:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Passo 2: Construa uma versão estática em React {/*step-2-build-a-static-version-in-react*/}

Agora que você tem sua hierarquia de componentes, é hora de implementar seu aplicativo. A abordagem mais direta é construir uma versão que renderize a UI do seu modelo de dados sem adicionar nenhuma interatividade... ainda! Muitas vezes é mais fácil construir a versão estática primeiro e adicionar interatividade depois. Construir uma versão estática requer muito digitação e nenhum pensamento, mas adicionar interatividade requer muito pensamento e não muita digitação.

Para construir uma versão estática do seu aplicativo que renderize seu modelo de dados, você vai querer construir [componentes](/learn/your-first-component) que reutilizam outros componentes e passam dados usando [props](/learn/passing-props-to-a-component). Props são uma forma de passar dados do pai para o filho. (Se você está familiarizado com o conceito de [state](/learn/state-a-components-memory), não use state para construir esta versão estática. State é reservado apenas para interatividade, ou seja, dados que mudam ao longo do tempo. Como esta é uma versão estática do aplicativo, você não precisará disso.)

Você pode construir de "cima para baixo" começando a construir os componentes mais altos na hierarquia (como `FilterableProductTable`) ou de "baixo para cima" trabalhando a partir de componentes mais baixos (como `ProductRow`). Em exemplos mais simples, geralmente é mais fácil ir de cima para baixo, em projetos maiores, é mais fácil ir de baixo para cima.

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
          <th>Nome</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Buscar..." />
      <label>
        <input type="checkbox" />
        {' '}
        Mostrar apenas produtos em estoque
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
  {category: "Frutas", price: "$1", stocked: true, name: "Maçã"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta-dragão"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracujá"},
  {category: "Vegetais", price: "$2", stocked: true, name: "Espinafre"},
  {category: "Vegetais", price: "$4", stocked: false, name: "Abóbora"},
  {category: "Vegetais", price: "$1", stocked: true, name: "Ervilhas"}
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

(Se esse código parece intimidador, passe pelo [Início Rápido](/learn/) primeiro!)

Depois de construir seus componentes, você terá uma biblioteca de componentes reutilizáveis que renderizam seu modelo de dados. Como este é um aplicativo estático, os componentes apenas retornarão JSX. O componente no topo da hierarquia (`FilterableProductTable`) receberá seu modelo de dados como uma prop. Isso é chamado de _fluxo de dados unidirecional_ porque os dados fluem de cima para baixo, do componente de nível superior para os que estão no fundo da árvore.

<Pitfall>

Neste ponto, você não deve estar usando nenhum valor de estado. Isso é para o próximo passo!

</Pitfall>

## Passo 3: Encontre a representação mínima, mas completa, do estado da UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Para tornar a UI interativa, você precisa permitir que os usuários mudem seu modelo de dados subjacente. Você usará *state* para isso.

Pense no state como o conjunto mínimo de dados mutáveis que seu aplicativo precisa lembrar. O princípio mais importante para estruturar o state é mantê-lo [DRY (Não Repita Você Mesmo).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Descubra a representação mínima absoluta do state que sua aplicação precisa e calcule tudo o mais sob demanda. Por exemplo, se você estiver construindo uma lista de compras, pode armazenar os itens como um array no state. Se quiser também exibir o número de itens na lista, não armazene o número de itens como outro valor de state--em vez disso, leia o comprimento do seu array.

Agora pense em todas as peças de dados neste exemplo de aplicação:

1. A lista original de produtos
2. O texto de busca que o usuário inseriu
3. O valor da caixa de seleção
4. A lista filtrada de produtos

Quais destes são state? Identifique os que não são:

* **Ele permanece inalterado** ao longo do tempo? Se sim, não é state.
* É **passado de um pai** via props? Se sim, não é state.
* **Você pode computá-lo** com base no state ou nas props existentes em seu componente? Se sim, definitivamente não é state!

O que resta provavelmente é state.

Vamos percorrê-los um por um novamente:

1. A lista original de produtos é **passada como props, então não é state.** 
2. O texto de busca parece ser state, pois muda ao longo do tempo e não pode ser computado a partir de nada.
3. O valor da caixa de seleção parece ser state, pois muda ao longo do tempo e não pode ser computado a partir de nada.
4. A lista filtrada de produtos **não é state porque pode ser computada** pegando a lista original de produtos e filtrando-a de acordo com o texto de busca e o valor da caixa de seleção.

Isso significa que apenas o texto da busca e o valor da caixa de seleção são state! Muito bem!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Existem dois tipos de dados "modelo" no React: props e state. Os dois são muito diferentes:

* [**Props** são como argumentos que você passa](/learn/passing-props-to-a-component) para uma função. Elas permitem que um componente pai passe dados para um componente filho e personalize sua aparência. Por exemplo, um `Form` pode passar uma prop `color` para um `Button`.
* [**State** é como a memória de um componente.](/learn/state-a-components-memory) Permite que um componente mantenha o controle de algumas informações e as altere em resposta a interações. Por exemplo, um `Button` pode manter o controle do state `isHovered`.

Props e state são diferentes, mas trabalham juntos. Um componente pai geralmente manterá algumas informações no state (para que possa mudá-las) e *as passará* para os componentes filhos como suas props. Está tudo bem se a diferença ainda parecer confusa na primeira leitura. Leva um tempo de prática para realmente fazer sentido!

</DeepDive>

## Passo 4: Identifique onde seu estado deve residir {/*step-4-identify-where-your-state-should-live*/}

Depois de identificar os dados mínimos de state do seu aplicativo, você precisa identificar qual componente é responsável por alterar esse state, ou *possui* o state. Lembre-se: o React usa fluxo de dados unidirecional, passando dados pela hierarquia de componentes do pai para o filho. Pode não ser imediatamente claro qual componente deve possuir qual estado. Isso pode ser desafiador se você é novo nesse conceito, mas você pode descobrir seguindo estas etapas!

Para cada peça de state na sua aplicação:

1. Identifique *todos* os componentes que renderizam algo com base naquele state.
2. Encontre seu componente pai comum mais próximo--um componente acima de todos eles na hierarquia.
3. Decida onde o state deve residir:
    1. Muitas vezes, você pode colocar o state diretamente no pai comum deles.
    2. Você também pode colocar o state em algum componente acima do pai comum deles.
    3. Se você não consegue encontrar um componente onde faz sentido possuir o state, crie um novo componente apenas para armazenar o state e adicione-o em algum lugar na hierarquia acima do componente pai comum.

No passo anterior, você encontrou duas peças de state nesta aplicação: o texto de entrada da busca e o valor da caixa de seleção. Neste exemplo, eles sempre aparecem juntos, então faz sentido colocá-los no mesmo lugar.

Agora vamos passar pela nossa estratégia para eles:

1. **Identificar componentes que usam state:**
    * `ProductTable` precisa filtrar a lista de produtos com base naquele state (texto de busca e valor da caixa de seleção). 
    * `SearchBar` precisa exibir esse state (texto de busca e valor da caixa de seleção).
1. **Encontrar seu pai comum:** O primeiro componente pai que ambos os componentes compartilham é `FilterableProductTable`.
2. **Decidir onde o state vive**: Manteremos o texto do filtro e os valores do estado da caixa de seleção em `FilterableProductTable`.

Assim, os valores de state viverão em `FilterableProductTable`. 

Adicione state ao componente com o [`useState()` Hook.](/reference/react/useState) Hooks são funções especiais que permitem que você "conecte" ao React. Adicione duas variáveis de state na parte superior de `FilterableProductTable` e especifique seu estado inicial:

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

Você pode começar a ver como seu aplicativo se comportará. Edite o valor inicial de `filterText` de `useState('')` para `useState('fruta')` no código da sandbox abaixo. Você verá tanto o texto da entrada de busca quanto a tabela atualizados:

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
          <th>Nome</th>
          <th>Preço</th>
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
        placeholder="Buscar..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Mostrar apenas produtos em estoque
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Frutas", price: "$1", stocked: true, name: "Maçã"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta-dragão"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracujá"},
  {category: "Vegetais", price: "$2", stocked: true, name: "Espinafre"},
  {category: "Vegetais", price: "$4", stocked: false, name: "Abóbora"},
  {category: "Vegetais", price: "$1", stocked: true, name: "Ervilhas"}
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

Observe que editar o formulário ainda não funciona. Há um erro no console na sandbox acima explicando o porquê:

<ConsoleBlock level="error">

Você forneceu uma prop \`value\` a um campo de formulário sem um manipulador \`onChange\`. Isso tornará o campo somente leitura.

</ConsoleBlock>

Na sandbox acima, `ProductTable` e `SearchBar` leem as props `filterText` e `inStockOnly` para renderizar a tabela, a entrada e a caixa de seleção. Por exemplo, aqui está como `SearchBar` popula o valor da entrada:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Buscar..."/>
```

No entanto, você não adicionou nenhum código para responder às ações do usuário, como digitar. Este será seu passo final.

## Passo 5: Adicione fluxo de dados inverso {/*step-5-add-inverse-data-flow*/}

Atualmente, seu aplicativo renderiza corretamente com props e state fluindo para baixo na hierarquia. Mas para mudar o state de acordo com a entrada do usuário, você precisará suportar os dados fluindo na direção oposta: os componentes de formulário profundos na hierarquia precisam atualizar o state em `FilterableProductTable`. 

O React torna esse fluxo de dados explícito, mas requer um pouco mais de digitação do que a vinculação de dados bidirecional. Se você tentar digitar ou marcar a caixa no exemplo acima, verá que o React ignora sua entrada. Isso é intencional. Ao escrever `<input value={filterText} />`, você definiu a prop `value` da `input` para sempre ser igual ao state `filterText` passado de `FilterableProductTable`. Como o state `filterText` nunca é definido, a entrada nunca muda.

Você quer que toda vez que o usuário muda as entradas do formulário, o state se atualize para refletir essas mudanças. O state é possuído por `FilterableProductTable`, então só ele pode chamar `setFilterText` e `setInStockOnly`. Para permitir que `SearchBar` atualize o state de `FilterableProductTable`, você precisa passar essas funções para baixo para `SearchBar`:

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

Dentro do `SearchBar`, você adicionará os manipuladores de evento `onChange` e definirá o state do pai a partir deles:

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
        placeholder="Buscar..."
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
          <th>Nome</th>
          <th>Preço</th>
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
        value={filterText} placeholder="Buscar..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Mostrar apenas produtos em estoque
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Frutas", price: "$1", stocked: true, name: "Maçã"},
  {category: "Frutas", price: "$1", stocked: true, name: "Fruta-dragão"},
  {category: "Frutas", price: "$2", stocked: false, name: "Maracujá"},
  {category: "Vegetais", price: "$2", stocked: true, name: "Espinafre"},
  {category: "Vegetais", price: "$4", stocked: false, name: "Abóbora"},
  {category: "Vegetais", price: "$1", stocked: true, name: "Ervilhas"}
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

Você pode aprender tudo sobre como lidar com eventos e atualizar o state na seção [Adicionando Interatividade](/learn/adding-interactivity).

## Para onde ir a partir daqui {/*where-to-go-from-here*/}

Esta foi uma breve introdução sobre como pensar na construção de componentes e aplicativos com o React. Você pode [começar um projeto React](/learn/installation) agora mesmo ou [se aprofundar em toda a sintaxe](/learn/describing-the-ui) usada neste tutorial.