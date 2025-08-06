---
title: Atualizando Arrays no Estado
---

<Intro>

Arrays são mutáveis em JavaScript, mas você deve tratá-los como imutáveis quando os armazena no estado. Assim como com objetos, quando você quer atualizar um array armazenado no estado, você precisa criar um novo (ou fazer uma cópia de um existente), e então definir o estado para usar o novo array.

</Intro>

<YouWillLearn>

- Como adicionar, remover ou alterar itens em um array no estado do React
- Como atualizar um objeto dentro de um array
- Como tornar a cópia de arrays menos repetitiva com Immer

</YouWillLearn>

## Atualizando arrays sem mutação {/*updating-arrays-without-mutation*/}

Em JavaScript, arrays são apenas outro tipo de objeto. [Assim como com objetos](/learn/updating-objects-in-state), **você deve tratar arrays no estado do React como somente leitura.** Isso significa que você não deve reatribuir itens dentro de um array como `arr[0] = 'bird'`, e também não deve usar métodos que mutem o array, como `push()` e `pop()`.

Em vez disso, toda vez que você quiser atualizar um array, você vai querer passar um *novo* array para sua função de definição de estado. Para fazer isso, você pode criar um novo array a partir do array original em seu estado chamando seus métodos não-mutantes como `filter()` e `map()`. Então você pode definir seu estado para o novo array resultante.

Aqui está uma tabela de referência de operações comuns de array. Ao lidar com arrays dentro do estado do React, você precisará evitar os métodos na coluna da esquerda, e em vez disso preferir os métodos na coluna da direita:

|           | evitar (muta o array)                | preferir (retorna um novo array)                                         |
| --------- | ----------------------------------- | ----------------------------------------------------------------------- |
| adicionar | `push`, `unshift`                   | `concat`, `[...arr]` sintaxe spread ([exemplo](#adding-to-an-array))    |
| remover   | `pop`, `shift`, `splice`            | `filter`, `slice` ([exemplo](#removing-from-an-array))                  |
| substituir| `splice`, `arr[i] = ...` atribuição | `map` ([exemplo](#replacing-items-in-an-array))                         |
| ordenar   | `reverse`, `sort`                   | copie o array primeiro ([exemplo](#making-other-changes-to-an-array))   |

Alternativamente, você pode [usar Immer](#write-concise-update-logic-with-immer) que permite usar métodos de ambas as colunas.

<Pitfall>

Infelizmente, [`slice`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) e [`splice`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) têm nomes similares mas são muito diferentes:

* `slice` permite copiar um array ou uma parte dele.
* `splice` **muta** o array (para inserir ou deletar itens).

No React, você estará usando `slice` (sem `p`!) muito mais frequentemente porque você não quer mutar objetos ou arrays no estado. [Atualizando Objetos](/learn/updating-objects-in-state) explica o que é mutação e por que não é recomendado para o estado.

</Pitfall>

### Adicionando a um array {/*adding-to-an-array*/}

`push()` vai mutar um array, o que você não quer:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Adicionar</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Em vez disso, crie um *novo* array que contém os itens existentes *e* um novo item no final. Há múltiplas maneiras de fazer isso, mas a mais fácil é usar a sintaxe `...` [array spread](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_em_literais_de_array):

```js
setArtists( // Substitui o estado
  [ // com um novo array
    ...artists, // que contém todos os itens antigos
    { id: nextId++, name: name } // e um novo item no final
  ]
);
```

Agora funciona corretamente:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Adicionar</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

A sintaxe array spread também permite que você adicione um item no início colocando-o *antes* do `...artists` original:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Coloca itens antigos no final
]);
```

Dessa forma, spread pode fazer o trabalho tanto de `push()` adicionando ao final de um array quanto de `unshift()` adicionando ao início de um array. Experimente no sandbox acima!

### Removendo de um array {/*removing-from-an-array*/}

A maneira mais fácil de remover um item de um array é *filtrá-lo*. Em outras palavras, você vai produzir um novo array que não conterá esse item. Para fazer isso, use o método `filter`, por exemplo:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Clique no botão "Deletar" algumas vezes, e observe seu manipulador de clique.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Aqui, `artists.filter(a => a.id !== artist.id)` significa "criar um array que consiste naqueles `artists` cujos IDs são diferentes de `artist.id`". Em outras palavras, o botão "Deletar" de cada artista vai filtrar _aquele_ artista do array, e então solicitar uma re-renderização com o array resultante. Note que `filter` não modifica o array original.

### Transformando um array {/*transforming-an-array*/}

Se você quiser alterar alguns ou todos os itens do array, você pode usar `map()` para criar um **novo** array. A função que você passará para `map` pode decidir o que fazer com cada item, baseado em seus dados ou seu índice (ou ambos).

Neste exemplo, um array armazena coordenadas de dois círculos e um quadrado. Quando você pressiona o botão, ele move apenas os círculos 50 pixels para baixo. Ele faz isso produzindo um novo array de dados usando `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Sem mudança
        return shape;
      } else {
        // Retorna um novo círculo 50px abaixo
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-renderiza com o novo array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Mover círculos para baixo!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Substituindo itens em um array {/*replacing-items-in-an-array*/}

É particularmente comum querer substituir um ou mais itens em um array. Atribuições como `arr[0] = 'bird'` estão mutando o array original, então em vez disso você vai querer usar `map` para isso também.

Para substituir um item, crie um novo array com `map`. Dentro de sua chamada `map`, você receberá o índice do item como segundo argumento. Use-o para decidir se deve retornar o item original (o primeiro argumento) ou algo diferente:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Incrementa o contador clicado
        return c + 1;
      } else {
        // O resto não mudou
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Inserindo em um array {/*inserting-into-an-array*/}

Às vezes, você pode querer inserir um item em uma posição particular que não seja nem no início nem no final. Para fazer isso, você pode usar a sintaxe `...` array spread junto com o método `slice()`. O método `slice()` permite cortar uma "fatia" do array. Para inserir um item, você criará um array que espalha a fatia _antes_ do ponto de inserção, então o novo item, e então o resto do array original.

Neste exemplo, o botão Inserir sempre insere no índice `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Pode ser qualquer índice
    const nextArtists = [
      // Itens antes do ponto de inserção:
      ...artists.slice(0, insertAt),
      // Novo item:
      { id: nextId++, name: name },
      // Itens depois do ponto de inserção:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Escultores inspiradores:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Inserir
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Fazendo outras mudanças em um array {/*making-other-changes-to-an-array*/}

Há algumas coisas que você não pode fazer apenas com a sintaxe spread e métodos não-mutantes como `map()` e `filter()`. Por exemplo, você pode querer reverter ou ordenar um array. Os métodos JavaScript `reverse()` e `sort()` estão mutando o array original, então você não pode usá-los diretamente.

**No entanto, você pode copiar o array primeiro, e então fazer mudanças nele.**

Por exemplo:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverter
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Aqui, você usa a sintaxe spread `[...list]` para criar uma cópia do array original primeiro. Agora que você tem uma cópia, você pode usar métodos mutantes como `nextList.reverse()` ou `nextList.sort()`, ou até mesmo atribuir itens individuais com `nextList[0] = "algo"`.

No entanto, **mesmo se você copiar um array, você não pode mutar itens existentes _dentro_ dele diretamente.** Isso é porque a cópia é superficial--o novo array conterá os mesmos itens que o original. Então se você modificar um objeto dentro do array copiado, você está mutando o estado existente. Por exemplo, código como este é um problema.

```js
const nextList = [...list];
nextList[0].seen = true; // Problema: muta list[0]
setList(nextList);
```

Embora `nextList` e `list` sejam dois arrays diferentes, **`nextList[0]` e `list[0]` apontam para o mesmo objeto.** Então ao mudar `nextList[0].seen`, você também está mudando `list[0].seen`. Esta é uma mutação de estado, que você deve evitar! Você pode resolver este problema de forma similar a [atualizar objetos JavaScript aninhados](/learn/updating-objects-in-state#updating-a-nested-object)--copiando itens individuais que você quer mudar em vez de mutá-los. Veja como.

## Atualizando objetos dentro de arrays {/*updating-objects-inside-arrays*/}

Objetos não estão _realmente_ localizados "dentro" de arrays. Eles podem parecer estar "dentro" no código, mas cada objeto em um array é um valor separado, para o qual o array "aponta". É por isso que você precisa ter cuidado ao mudar campos aninhados como `list[0]`. A lista de obras de arte de outra pessoa pode apontar para o mesmo elemento do array!

**Ao atualizar estado aninhado, você precisa criar cópias do ponto onde você quer atualizar, e todo o caminho até o nível superior.** Vamos ver como isso funciona.

Neste exemplo, duas listas de obras de arte separadas têm o mesmo estado inicial. Elas deveriam estar isoladas, mas por causa de uma mutação, seu estado é acidentalmente compartilhado, e marcar uma caixa em uma lista afeta a outra lista:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Lista de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Sua lista de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

O problema está no código como este:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problema: muta um item existente
setMyList(myNextList);
```

Embora o array `myNextList` em si seja novo, os *itens em si* são os mesmos que no array `myList` original. Então mudar `artwork.seen` muda o item de obra de arte *original*. Esse item de obra de arte também está em `yourList`, o que causa o bug. Bugs como este podem ser difíceis de pensar, mas felizmente eles desaparecem se você evitar mutar o estado.

**Você pode usar `map` para substituir um item antigo por sua versão atualizada sem mutação.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Criar um *novo* objeto com mudanças
    return { ...artwork, seen: nextSeen };
  } else {
    // Sem mudanças
    return artwork;
  }
}));
```

Aqui, `...` é a sintaxe object spread usada para [criar uma cópia de um objeto.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Com esta abordagem, nenhum dos itens de estado existentes está sendo mutado, e o bug é corrigido:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Criar um *novo* objeto com mudanças
        return { ...artwork, seen: nextSeen };
      } else {
        // Sem mudanças
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Criar um *novo* objeto com mudanças
        return { ...artwork, seen: nextSeen };
      } else {
        // Sem mudanças
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Lista de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Sua lista de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Em geral, **você deve apenas mutar objetos que você acabou de criar.** Se você estivesse inserindo uma *nova* obra de arte, você poderia mutá-la, mas se você está lidando com algo que já está no estado, você precisa fazer uma cópia.

### Escreva lógica de atualização concisa com Immer {/*write-concise-update-logic-with-immer*/}

Atualizar arrays aninhados sem mutação pode ficar um pouco repetitivo. [Assim como com objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Geralmente, você não deveria precisar atualizar o estado mais do que alguns níveis de profundidade. Se seus objetos de estado são muito profundos, você pode querer [reestruturá-los de forma diferente](/learn/choosing-the-state-structure#avoid-deeply-nested-state) para que sejam planos.
- Se você não quer mudar sua estrutura de estado, você pode preferir usar [Immer](https://github.com/immerjs/use-immer), que permite escrever usando a sintaxe conveniente mas mutante e cuida de produzir as cópias para você.

Aqui está o exemplo da Lista de Arte reescrito com Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Lista de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Sua lista de arte para ver:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Note como com Immer, **mutação como `artwork.seen = nextSeen` agora está ok:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Isso é porque você não está mutando o estado _original_, mas você está mutando um objeto `draft` especial fornecido pelo Immer. Similarmente, você pode aplicar métodos mutantes como `push()` e `pop()` ao conteúdo do `draft`.

Por trás dos panos, Immer sempre constrói o próximo estado do zero de acordo com as mudanças que você fez no `draft`. Isso mantém seus manipuladores de evento muito concisos sem nunca mutar o estado.

<Recap>

- Você pode colocar arrays no estado, mas você não pode mudá-los.
- Em vez de mutar um array, crie uma *nova* versão dele, e atualize o estado para ela.
- Você pode usar a sintaxe `[...arr, newItem]` array spread para criar arrays com novos itens.
- Você pode usar `filter()` e `map()` para criar novos arrays com itens filtrados ou transformados.
- Você pode usar Immer para manter seu código conciso.

</Recap>



<Challenges>

#### Atualizar um item no carrinho de compras {/*update-an-item-in-the-shopping-cart*/}

Preencha a lógica de `handleIncreaseClick` para que pressionar "+" aumente o número correspondente:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queijo',
  count: 5,
}, {
  id: 2,
  name: 'Espaguete',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Você pode usar a função `map` para criar um novo array, e então usar a sintaxe `...` object spread para criar uma cópia do objeto alterado para o novo array:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queijo',
  count: 5,
}, {
  id: 2,
  name: 'Espaguete',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Remover um item do carrinho de compras {/*remove-an-item-from-the-shopping-cart*/}

Este carrinho de compras tem um botão "+" funcionando, mas o botão "–" não faz nada. Você precisa adicionar um manipulador de evento a ele para que pressioná-lo diminua o `count` do produto correspondente. Se você pressionar "–" quando a contagem é 1, o produto deve ser automaticamente removido do carrinho. Certifique-se de que nunca mostre 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queijo',
  count: 5,
}, {
  id: 2,
  name: 'Espaguete',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Você pode primeiro usar `map` para produzir um novo array, e então `filter` para remover produtos com `count` definido como `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Queijo',
  count: 5,
}, {
  id: 2,
  name: 'Espaguete',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Corrigir as mutações usando métodos não-mutativos {/*fix-the-mutations-using-non-mutative-methods*/}

Neste exemplo, todos os manipuladores de evento em `App.js` usam mutação. Como resultado, editar e deletar todos não funciona. Reescreva `handleAddTodo`, `handleChangeTodo`, e `handleDeleteTodo` para usar os métodos não-mutativos:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Fazer chá', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Deletar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Em `handleAddTodo`, você pode usar a sintaxe array spread. Em `handleChangeTodo`, você pode criar um novo array com `map`. Em `handleDeleteTodo`, você pode criar um novo array com `filter`. Agora a lista funciona corretamente:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Fazer chá', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Deletar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Corrigir as mutações usando Immer {/*fix-the-mutations-using-immer*/}

Este é o mesmo exemplo do desafio anterior. Desta vez, corrija as mutações usando Immer. Para sua conveniência, `useImmer` já está importado, então você precisa alterar a variável de estado `todos` para usá-lo.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Fazer chá', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Deletar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Com Immer, você pode escrever código de forma mutativa, contanto que você esteja apenas mutando partes do `draft` que Immer lhe dá. Aqui, todas as mutações são realizadas no `draft` então o código funciona:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Fazer chá', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Deletar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Você também pode misturar e combinar as abordagens mutativa e não-mutativa com Immer.

Por exemplo, nesta versão `handleAddTodo` é implementado mutando o `draft` do Immer, enquanto `handleChangeTodo` e `handleDeleteTodo` usam os métodos não-mutativos `map` e `filter`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Fazer chá', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Deletar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Com Immer, você pode escolher o estilo que se sente mais natural para cada caso separado.

</Solution>

</Challenges>