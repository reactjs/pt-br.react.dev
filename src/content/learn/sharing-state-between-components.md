---
title: Compartilhando State Entre Componentes
---

<Intro>

Às vezes, você deseja que o state de dois componentes seja sempre alterado em conjunto. Para fazer isso, remova o state de ambos, mova-os para o pai comum mais próximo e, em seguida, passe-os aos componentes por meio de props. Isto é conhecido como *elevação de state* e é uma das coisas mais comuns que você fará ao escrever código React.

</Intro>

<YouWillLearn>

- Como compartilhar state entre componentes por sua elevação
- O que são componentes controlados e não controlados

</YouWillLearn>

## Exemplificando a elevação de state {/*lifting-state-up-by-example*/}

Neste exemplo, um componente `Accordion` pai renderiza dois componentes `Panel` separados:

* `Accordion`
  - `Panel`
  - `Panel`

Cada componente `Panel` tem um state booleano `isActive` que determina se o seu conteúdo está visível.

Pressione o botão "Show" de ambos os painéis:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Cazaquistão</h2>
      <Panel title="Sobre">
        Com uma população de cerca de 2 milhões de habitantes, Almaty é a maior cidade do Cazaquistão. De 1929 a 1997, foi sua capital.
      </Panel>
      <Panel title="Etimologia">
        O nome vem de <span lang="kk-KZ">алма</span>, a palavra cazaque para "maçã", e é frequentemente traduzido como "cheio de maçãs". De fato, acredita-se que a região em torno de Almaty seja o lar ancestral da maçã, e o <i lang="la">Malus sieversii</i> selvagem é considerado um provável candidato a ancestral da maçã doméstica moderna.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Observe como o fato de pressionar o botão de um painel não afeta o outro painel--eles são independentes.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagrama mostrando uma árvore de três componentes, um componente principal denominado Accordion e dois componentes secundários denominados Painel. Ambos os componentes Paneil contêm isActive com valor falso.">

Inicialmente, o state `isActive` de cada `Panel` é falso, de modo que ambos aparecem recolhidos

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="O mesmo diagrama que o anterior, com o isActive do primeiro componente filho do Painel destacado, indicando um clique com o valor isActive definido como verdadeiro. O segundo componente Painel ainda contém o valor falso." >

Clicar em um dos botões do `Panel` somente atualizará o state `isActive` desse `Panel`.

</Diagram>

</DiagramGroup>

**Mas agora digamos que você queira alterá-lo para que apenas um painel seja expandido por vez.** Com esse design, expandir o segundo painel deve recolher o primeiro. Como você faria isso?

Para coordenar esses dois painéis, você precisa "elevar o state deles" para um componente pai em três etapas:

1. **Remover** o state dos componentes filhos.
2. **Passar** dados estáticos do pai comum.
3. **Adicionar** o state ao pai comum e passá-lo para baixo junto com os manipuladores de eventos.

Isso permitirá que o componente `Accordion` coordene ambos os `Panel`s e expanda apenas um de cada vez.

### Etapa 1: Remover o state dos componentes filhos {/*step-1-remove-state-from-the-child-components*/}

Você dará o controle do `isActive` do `Panel` ao seu componente pai. Isso significa que o componente pai passará o `isActive` para o `Panel` como uma propriedade. Comece **removendo essa linha** do componente `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Em vez disso, adicione `isActive` à lista de props do `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Agora, o componente pai do `Panel` pode *controlar* o `isActive` [transmitindo-o como uma prop.](/learn/passing-props-to-a-component) Por outro lado, o componente `Panel` agora não tem *nenhum controle* sobre o valor de `isActive`; isso agora depende do componente pai!

### Etapa 2: passar dados estáticos do pai comum {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Para elevar o state, você deve localizar o componente pai comum mais próximo de *ambos* os componentes filhos que deseja coordenar:

* `Accordion` *(pai comum mais próximo)*
  - `Panel`
  - `Panel`

Neste exemplo, é o componente `Accordion`. Como ele está acima de ambos os painéis e pode controlar suas props, ele se tornará a "fonte da verdade" para saber qual painel está ativo no momento. Faça com que o componente `Accordion` passe um valor estático de `isActive` (por exemplo, `true`) para ambos os painéis:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Cazaquistão</h2>
      <Panel title="Sobre" isActive={true}>
        Com uma população de cerca de 2 milhões de habitantes, Almaty é a maior cidade do Cazaquistão. De 1929 a 1997, foi sua capital.
      </Panel>
      <Panel title="Etmologia" isActive={true}>
        O nome vem de <span lang="kk-KZ">алма</span>, a palavra cazaque para "maçã", e é frequentemente traduzido como "cheio de maçãs". De fato, acredita-se que a região em torno de Almaty seja o lar ancestral da maçã, e o<i lang="la"> Malus sieversii</i> selvagem é considerado um provável candidato a ancestral da maçã doméstica moderna.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Exibir
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Tente editar os valores estáticos `isActive` no componente `Accordion` e veja o resultado na tela.

### Etapa 3: Adicionar state ao pai comum {/*step-3-add-state-to-the-common-parent*/}

Elevar o state muitas vezes muda a natureza do que você está armazenando como state.

Nesse caso, apenas um painel deve estar ativo por vez. Isso significa que o componente pai comum `Accordion` precisa manter o controle de *qual* painel está ativo. Em vez de um valor `booleano`, ele poderia usar um número como índice do `Panel` ativo para a variável do state:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Quando o `activeIndex` é `0`, o primeiro painel está ativo, e quando é `1`, é o segundo.

Clicar no botão "Exibir" em um dos "Painéis" precisa alterar o índice ativo no "Accordion". Um `Panel` não pode definir o state `activeIndex` diretamente porque ele é definido dentro do `Accordion`. O componente `Accordion` precisa *permitir explicitamente* que o componente `Panel` altere seu state, [passando um manipulador de eventos como uma prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

O `<button>` dentro do `Panel` agora usará a propriedade `onShow` como seu manipulador de eventos de clique:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Cazaquistão</h2>
      <Panel
        title="Sobre"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Com uma população de cerca de 2 milhões de habitantes, Almaty é a maior cidade do Cazaquistão. De 1929 a 1997, foi sua capital.
      </Panel>
      <Panel
        title="Etmologia"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        O nome vem de <span lang="kk-KZ">алма</span>, a palavra cazaque para "maçã", e é frequentemente traduzido como "cheio de maçãs". De fato, acredita-se que a região em torno de Almaty seja o lar ancestral da maçã, e o<i lang="la"> Malus sieversii</i> selvagem é considerado um provável candidato a ancestral da maçã doméstica moderna.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Exibir
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Isso completa a elevação do state! Mover o state para o componente pai comum permitiu que você coordenasse os dois painéis. Usar o índice ativo em vez de dois sinalizadores "é exibido" garantiu que apenas um painel estivesse ativo em um determinado momento. E passar o manipulador de eventos para o filho permitiu que ele alterasse o state do pai.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagrama que mostra uma árvore de três componentes, um pai denominado Accordion e dois filhos denominados Panel. O Accordion contém um valor activeIndex igual a zero, que se transforma em um valor isActive verdadeiro passado para o primeiro Panel, e um valor isActive falso passado para o segundo Panel." >

Inicialmente, o `activeIndex` do `Accordion` é `0`, portanto o primeiro `Panel` recebe `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="O mesmo diagrama que o anterior, com o valor activeIndex do componente Accordion pai destacado, indicando um clique com o valor alterado para um. O fluxo para ambos os componentes Panel filhos também é destacado, e o valor isActive passado para cada filho é definido como o oposto: false para o primeiro Panel e true para o segundo." >

Quando o state `activeIndex` do `Accordion` muda para `1`, o segundo `Panel` recebe `isActive = true` em seu lugar

</Diagram>

</DiagramGroup>

<DeepDive>

#### Componentes controlados e não controlados {/*controlled-and-uncontrolled-components*/}

É comum chamar um componente com algum state local de "não controlado". Por exemplo, o componente `Panel` original com uma variável de state `isActive` não é controlado porque seu pai não pode influenciar se o painel está ativo ou não.

Por outro lado, pode-se dizer que um componente é "controlado" quando as informações importantes nele contidas são orientadas por props em vez de seu próprio state local. Isso permite que o componente pai especifique totalmente seu comportamento. O componente final `Panel` com a prop `isActive` é controlado pelo componente `Accordion`.

Os componentes não controlados são mais fáceis de usar dentro de seus pais porque exigem menos configuração. Mas são menos flexíveis quando você deseja coordená-los entre si. Os componentes controlados são extremamente flexíveis, mas exigem que os componentes principais os configurem totalmente com props.

Na prática, "controlado" e "não controlado" não são termos técnicos rigorosos - cada componente geralmente tem uma mistura de state local e props. No entanto, essa é uma maneira útil de falar sobre como os componentes são projetados e quais recursos eles oferecem.

Ao escrever um componente, considere quais informações nele devem ser controladas (por meio de props) e quais informações não devem ser controladas (por meio de state). Mas você sempre pode mudar de ideia e refatorar mais tarde.

</DeepDive>

## Uma única fonte de verdade para cada state {/*a-single-source-of-truth-for-each-state*/}

Em um aplicativo React, muitos componentes terão seu próprio state. Alguns states podem "residir" perto dos componentes de folha (componentes na parte inferior da árvore), como entradas. Outro state pode "residir" mais perto do topo do aplicativo. Por exemplo, até mesmo as bibliotecas de roteamento do lado do cliente geralmente são implementadas armazenando a rota atual no state do React e passando-a para baixo por meio de props!

**Para cada parte exclusiva do state, você escolherá o componente que o "possui".** Esse princípio também é conhecido como ter uma ["única fonte de verdade".](https://en.wikipedia.org/wiki/Single_source_of_truth) Isso não significa que todo o state esteja em um único lugar, mas que, para cada parte do state, há um componente específico que contém essa parte da informação. Em vez de duplicar o state compartilhado entre os componentes, *levante-o* para o pai compartilhado comum e *passe-o* para os filhos que precisam dele.

Seu aplicativo mudará à medida que você trabalhar nele. É comum que você mova o state para baixo ou para cima enquanto ainda está descobrindo onde cada parte do state  "reside". Tudo isso faz parte do processo!

Para ver como isso funciona na prática com mais alguns componentes, leia [Pensando em React.](/learn/thinking-in-react)

<Recap>

* Quando você quiser coordenar dois componentes, mova o state deles para o pai comum.
* Em seguida, passe as informações por meio de props vindas de seu pai comum.
* Por fim, passe os manipuladores de eventos para que os filhos possam alterar o state do pai.
* É útil considerar os componentes como "controlados" (acionados por props) ou "não controlados" (acionados pelo state).

</Recap>

<Challenges>

#### Entradas sincronizadas {/*synced-inputs*/}

Essas duas entradas são independentes. Faça com que elas fiquem sincronizadas: a edição de uma entrada deve atualizar a outra entrada com o mesmo texto e vice-versa.

<Hint>

Você precisará elevar o state deles para o componente principal.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Mova a variável do state `text` para o componente pai juntamente com o manipulador `handleChange`. Em seguida, passe-os como props para ambos os componentes `Input`. Isso os manterá em sincronia.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Primeira entrada"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Segunda entrada"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtrando uma lista {/*filtering-a-list*/}

Neste exemplo, a `SearchBar` tem seu próprio state `query` que controla a entrada de texto. Seu componente pai `FilterableList` exibe uma `List` de itens, mas não leva em conta a consulta de pesquisa.

Use a função `filterItems(foods, query)` para filtrar a lista de acordo com a consulta de pesquisa. Para testar suas alterações, verifique se digitar "s" na entrada filtra a lista para "Sushi", "Shish kebab" e "Dim sum".

Observe que o `filterItems` já está implementado e importado, portanto, você não precisa escrevê-lo!

<Hint>

Você deverá remover o state `query` e o manipulador `handleChange` da `SearchBar` e movê-los para a `FilterableList`. Em seguida, passe-os para a `SearchBar` como props `query` e `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Buscar:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi é um prato tradicional japonês de arroz preparado com vinagre'
}, {
  id: 1,
  name: 'Dal',
  description: 'A maneira mais comum de preparar o dal é na forma de uma sopa à qual podem ser adicionados cebola, tomate e vários temperos'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi são bolinhos recheados feitos com massa sem fermento em volta de um recheio salgado ou doce e cozidos em água fervente'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'O shish kebab é uma refeição popular com cubos de carne grelhados e espetados.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum é uma grande variedade de pequenos pratos que os cantoneses tradicionalmente apreciam em restaurantes no café da manhã e no almoço'
}];
```

</Sandpack>

<Solution>

Transfira o state `query` para o componente `FilterableList`. Chame `filterItems(foods, query)` para obter a lista filtrada e passe-a para o `List`. Agora, a alteração da entrada da consulta é refletida na lista:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Buscar:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi é um prato tradicional japonês de arroz preparado com vinagre'
}, {
  id: 1,
  name: 'Dal',
  description: 'A maneira mais comum de preparar o dal é na forma de uma sopa à qual podem ser adicionados cebola, tomate e vários temperos'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi são bolinhos recheados feitos com massa sem fermento em volta de um recheio salgado ou doce e cozidos em água fervente'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'O shish kebab é uma refeição popular com cubos de carne grelhados e espetados.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum é uma grande variedade de pequenos pratos que os cantoneses tradicionalmente apreciam em restaurantes no café da manhã e no almoço'
}];
```

</Sandpack>

</Solution>

</Challenges>
