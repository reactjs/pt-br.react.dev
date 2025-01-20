---
title: Children
---

<Pitfall>

Usar `Children` é incomum e pode levar a código frágil. [Veja alternativas comuns.](#alternatives)

</Pitfall>

<Intro>

`Children` permite que você manipule e transforme o JSX que você recebeu como a [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Chame `Children.count(children)` para contar o número de filhos na estrutura de dados `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total de linhas: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Veja mais exemplos abaixo.](#counting-children)

#### Parâmetros {/*children-count-parameters*/}

* `children`: O valor da [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recebido pelo seu componente.

#### Retorna {/*children-count-returns*/}

O número de nós dentro desses `children`.

#### Ressalvas {/*children-count-caveats*/}

- Nós vazios (`null`, `undefined` e Booleans), strings, números e [elementos React](/reference/react/createElement) contam como nós individuais. Arrays não contam como nós individuais, mas seus filhos contam. **A travessia não vai mais fundo do que elementos React:** eles não são renderizados, e seus filhos não são atravessados. [Fragmentos](/reference/react/Fragment) não são atravessados.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Chame `Children.forEach(children, fn, thisArg?)` para executar algum código para cada filho na estrutura de dados `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Veja mais exemplos abaixo.](#running-some-code-for-each-child)

#### Parâmetros {/*children-foreach-parameters*/}

* `children`: O valor da [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recebido pelo seu componente.
* `fn`: A função que você deseja executar para cada filho, semelhante ao callback do [método `forEach` de array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Ela será chamada com o filho como o primeiro argumento e seu índice como o segundo argumento. O índice começa em `0` e incrementa a cada chamada.
* **opcional** `thisArg`: O [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) com o qual a função `fn` deve ser chamada. Se omitido, é `undefined`.

#### Retorna {/*children-foreach-returns*/}

`Children.forEach` retorna `undefined`.

#### Ressalvas {/*children-foreach-caveats*/}

- Nós vazios (`null`, `undefined` e Booleans), strings, números e [elementos React](/reference/react/createElement) contam como nós individuais. Arrays não contam como nós individuais, mas seus filhos contam. **A travessia não vai mais fundo do que elementos React:** eles não são renderizados, e seus filhos não são atravessados. [Fragmentos](/reference/react/Fragment) não são atravessados.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Chame `Children.map(children, fn, thisArg?)` para mapear ou transformar cada filho na estrutura de dados `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Veja mais exemplos abaixo.](#transforming-children)

#### Parâmetros {/*children-map-parameters*/}

* `children`: O valor da [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recebido pelo seu componente.
* `fn`: A função de mapeamento, semelhante ao callback do [método `map` de array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Ela será chamada com o filho como o primeiro argumento e seu índice como o segundo argumento. O índice começa em `0` e incrementa a cada chamada. Você precisa retornar um nó React desta função. Isso pode ser um nó vazio (`null`, `undefined` ou um Boolean), uma string, um número, um elemento React ou um array de outros nós React.
* **opcional** `thisArg`: O [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) com o qual a função `fn` deve ser chamada. Se omitido, é `undefined`.

#### Retorna {/*children-map-returns*/}

Se `children` é `null` ou `undefined`, retorna o mesmo valor.

Caso contrário, retorna um array plano consistindo dos nós que você retornou da função `fn`. O array retornado conterá todos os nós que você retornou, exceto `null` e `undefined`.

#### Ressalvas {/*children-map-caveats*/}

- Nós vazios (`null`, `undefined` e Booleans), strings, números e [elementos React](/reference/react/createElement) contam como nós individuais. Arrays não contam como nós individuais, mas seus filhos contam. **A travessia não vai mais fundo do que elementos React:** eles não são renderizados, e seus filhos não são atravessados. [Fragmentos](/reference/react/Fragment) não são atravessados.

- Se você retornar um elemento ou um array de elementos com chaves de `fn`, **as chaves dos elementos retornados serão automaticamente combinadas com a chave do item original correspondente de `children`.** Quando você retorna múltiplos elementos de `fn` em um array, suas chaves só precisam ser únicas localmente entre si.

---

### `Children.only(children)` {/*children-only*/}


Chame `Children.only(children)` para afirmar que `children` representa um único elemento React.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parâmetros {/*children-only-parameters*/}

* `children`: O valor da [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recebido pelo seu componente.

#### Retorna {/*children-only-returns*/}

Se `children` [é um elemento válido,](/reference/react/isValidElement) retorna esse elemento.

Caso contrário, lança um erro.

#### Ressalvas {/*children-only-caveats*/}

- Este método sempre **lança uma exceção se você passar um array (como o valor de retorno de `Children.map`) como `children`.** Em outras palavras, ele impõe que `children` seja um único elemento React, não que seja um array com um único elemento.

---

### `Children.toArray(children)` {/*children-toarray*/}

Chame `Children.toArray(children)` para criar um array a partir da estrutura de dados `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parâmetros {/*children-toarray-parameters*/}

* `children`: O valor da [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) recebido pelo seu componente.

#### Retorna {/*children-toarray-returns*/}

Retorna um array plano de elementos em `children`.

#### Ressalvas {/*children-toarray-caveats*/}

- Nós vazios (`null`, `undefined` e Booleans) serão omitidos no array retornado. **As chaves dos elementos retornados serão calculadas a partir das chaves dos elementos originais e seu nível de aninhamento e posição.** Isso garante que achatar o array não introduza mudanças no comportamento.

---

## Uso {/*usage*/}

### Transformando filhos {/*transforming-children*/}

Para transformar o JSX de filhos que seu componente [recebe como a `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) chame `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

No exemplo acima, o `RowList` envolve cada filho que recebe em um contêiner `<div className="Row">`. Por exemplo, digamos que o componente pai passe três tags `<p>` como a `children` prop para `RowList`:

```js
<RowList>
  <p>Este é o primeiro item.</p>
  <p>Este é o segundo item.</p>
  <p>Este é o terceiro item.</p>
</RowList>
```

Então, com a implementação do `RowList` acima, o resultado renderizado final ficará assim:

```js
<div className="RowList">
  <div className="Row">
    <p>Este é o primeiro item.</p>
  </div>
  <div className="Row">
    <p>Este é o segundo item.</p>
  </div>
  <div className="Row">
    <p>Este é o terceiro item.</p>
  </div>
</div>
```

`Children.map` é semelhante a [transformar arrays com `map()`.](/learn/rendering-lists) A diferença é que a estrutura de dados `children` é considerada *opaca.* Isso significa que mesmo que às vezes seja um array, você não deve assumir que é um array ou qualquer outro tipo de dado específico. Por isso, você deve usar `Children.map` se precisar transformá-lo.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este é o primeiro item.</p>
      <p>Este é o segundo item.</p>
      <p>Este é o terceiro item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Por que a prop children nem sempre é um array? {/*why-is-the-children-prop-not-always-an-array*/}

No React, a prop `children` é considerada uma estrutura de dados *opaca*. Isso significa que você não deve depender de como ela está estruturada. Para transformar, filtrar ou contar filhos, você deve usar os métodos `Children`.

Na prática, a estrutura de dados `children` é frequentemente representada como um array internamente. No entanto, se houver apenas um único filho, o React não criará um array extra, pois isso levaria a uma sobrecarga desnecessária de memória. Enquanto você usar os métodos `Children` em vez de introspectar diretamente a prop `children`, seu código não quebrará mesmo que o React mude como a estrutura de dados é realmente implementada.

Mesmo quando `children` é um array, `Children.map` tem um comportamento especial útil. Por exemplo, `Children.map` combina as [chaves](/learn/rendering-lists#keeping-list-items-in-order-with-key) nos elementos retornados com as chaves nos `children` que você passou para ele. Isso garante que os filhos JSX originais não "percam" chaves, mesmo que sejam envoltos como no exemplo acima.

</DeepDive>

<Pitfall>

A estrutura de dados `children` **não inclui a saída renderizada** dos componentes que você passa como JSX. No exemplo abaixo, os `children` recebidos pelo `RowList` contêm apenas dois itens, em vez de três:

1. `<p>Este é o primeiro item.</p>`
2. `<MoreRows />`

É por isso que apenas duas envoltórias de linha são geradas neste exemplo:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este é o primeiro item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Este é o segundo item.</p>
      <p>Este é o terceiro item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Não há como obter a saída renderizada de um componente interno** como `<MoreRows />` ao manipular `children`. É por isso que [geralmente é melhor usar uma das soluções alternativas.](#alternatives)

</Pitfall>

---

### Executando algum código para cada filho {/*running-some-code-for-each-child*/}

Chame `Children.forEach` para iterar sobre cada filho na estrutura de dados `children`. Ele não retorna nenhum valor e é semelhante ao [método `forEach` de array.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Você pode usá-lo para executar lógica personalizada, como construir seu próprio array.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Este é o primeiro item.</p>
      <p>Este é o segundo item.</p>
      <p>Este é o terceiro item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove o último separador
  return result;
}
```

</Sandpack>

<Pitfall>

Como mencionado anteriormente, não há como obter a saída renderizada de um componente interno ao manipular `children`. É por isso que [geralmente é melhor usar uma das soluções alternativas.](#alternatives)

</Pitfall>

---

### Contando filhos {/*counting-children*/}

Chame `Children.count(children)` para calcular o número de filhos.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Este é o primeiro item.</p>
      <p>Este é o segundo item.</p>
      <p>Este é o terceiro item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total de linhas: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Como mencionado anteriormente, não há como obter a saída renderizada de um componente interno ao manipular `children`. É por isso que [geralmente é melhor usar uma das soluções alternativas.](#alternatives)

</Pitfall>

---

### Convertendo filhos em um array {/*converting-children-to-an-array*/}

Chame `Children.toArray(children)` para transformar a estrutura de dados `children` em um array JavaScript regular. Isso permite que você manipule o array com métodos de array incorporados como [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) ou [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) 

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Este é o primeiro item.</p>
      <p>Este é o segundo item.</p>
      <p>Este é o terceiro item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Como mencionado anteriormente, não há como obter a saída renderizada de um componente interno ao manipular `children`. É por isso que [geralmente é melhor usar uma das soluções alternativas.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

<Note>

Esta seção descreve alternativas à API `Children` (com `C` maiúsculo) que é importada assim:

```js
import { Children } from 'react';
```

Não confunda isso com [usar a prop `children` ](/learn/passing-props-to-a-component#passing-jsx-as-children) (com `c` minúsculo), que é boa e incentivada.

</Note>

### Expondo múltiplos componentes {/*exposing-multiple-components*/}

Manipular filhos com os métodos `Children` muitas vezes leva a código frágil. Quando você passa filhos para um componente em JSX, geralmente não espera que o componente manipule ou transforme os filhos individuais.

Quando puder, tente evitar usar os métodos `Children`. Por exemplo, se você quiser que cada filho de `RowList` seja envolvido em `<div className="Row">`, exporte um componente `Row` e envolva manualmente cada linha assim:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Este é o primeiro item.</p>
      </Row>
      <Row>
        <p>Este é o segundo item.</p>
      </Row>
      <Row>
        <p>Este é o terceiro item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Diferente de usar `Children.map`, essa abordagem não envolve automaticamente cada filho. **No entanto, essa abordagem tem um benefício significativo comparado ao [exemplo anterior com `Children.map`](#transforming-children) porque funciona mesmo se você continuar extraindo mais componentes.** Por exemplo, ainda funciona se você extrair seu próprio componente `MoreRows`:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Este é o primeiro item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Este é o segundo item.</p>
      </Row>
      <Row>
        <p>Este é o terceiro item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Isso não funcionaria com `Children.map` porque "veria" `<MoreRows />` como um filho único (e uma única linha).

---

### Aceitando um array de objetos como uma prop {/*accepting-an-array-of-objects-as-a-prop*/}

Você também pode passar explicitamente um array como uma prop. Por exemplo, este `RowList` aceita um array `rows` como uma prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Este é o primeiro item.</p> },
      { id: 'second', content: <p>Este é o segundo item.</p> },
      { id: 'third', content: <p>Este é o terceiro item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Como `rows` é um array JavaScript regular, o componente `RowList` pode usar métodos de array incorporados como [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) nele.

Esse padrão é especialmente útil quando você deseja poder passar mais informações como dados estruturados junto com os filhos. No exemplo abaixo, o componente `TabSwitcher` recebe um array de objetos como a prop `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'Primeiro',
        content: <p>Este é o primeiro item.</p>
      },
      {
        id: 'second',
        header: 'Segundo',
        content: <p>Este é o segundo item.</p>
      },
      {
        id: 'third',
        header: 'Terceiro',
        content: <p>Este é o terceiro item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Diferente de passar os filhos como JSX, essa abordagem permite que você associe alguns dados extras como `header` com cada item. Como você está trabalhando diretamente com os `tabs`, e este é um array, você não precisa dos métodos `Children`.

---

### Chamando uma função de renderização para personalizar a renderização {/*calling-a-render-prop-to-customize-rendering*/}

Em vez de produzir JSX para cada item único, você também pode passar uma função que retorna JSX e chamar essa função quando necessário. Neste exemplo, o componente `App` passa uma função `renderContent` para o componente `TabSwitcher`. O componente `TabSwitcher` chama `renderContent` apenas para a aba selecionada:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Este é o item {tabId}.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Uma prop como `renderContent` é chamada de *render prop* porque é uma prop que especifica como renderizar uma parte da interface do usuário. No entanto, não há nada de especial sobre isso: é uma prop regular que acontece de ser uma função.

Render props são funções, então você pode passar informações para elas. Por exemplo, este componente `RowList` passa o `id` e o `index` de cada linha para o render prop `renderRow`, que usa `index` para destacar linhas pares:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Este é o item {id}.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total de linhas: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Este é outro exemplo de como componentes pai e filho podem cooperar sem manipular os filhos.

---

## Solução de Problemas {/*troubleshooting*/}

### Eu passo um componente personalizado, mas os métodos `Children` não mostram seu resultado de renderização {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Suponha que você passe dois filhos para `RowList` assim:

```js
<RowList>
  <p>Primeiro item</p>
  <MoreRows />
</RowList>
```

Se você fizer `Children.count(children)` dentro de `RowList`, obterá `2`. Mesmo que `MoreRows` renderize 10 itens diferentes, ou se retornar `null`, `Children.count(children)` ainda será `2`. Do ponto de vista do `RowList`, ele só "vê" o JSX que recebeu. Ele não "vê" os internos do componente `MoreRows`.

A limitação torna difícil extrair um componente. É por isso que [soluções alternativas](#alternatives) são preferidas ao usar `Children`.