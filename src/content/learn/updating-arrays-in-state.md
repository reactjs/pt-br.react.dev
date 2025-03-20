---
title: Atualizando Arrays no State
---

<Intro>

Arrays são mutáveis em JavaScript, mas você deve tratá-los como imutáveis quando armazená-los no state. Assim como com objetos, quando você deseja atualizar um array armazenado no state, você precisa criar um novo (ou fazer uma cópia de um existente) e, então, definir o state para usar o novo array.

</Intro>

<YouWillLearn>

- Como adicionar, remover ou alterar itens em um array no React state
- Como atualizar um objeto dentro de um array
- Como tornar a cópia de array menos repetitiva com Immer

</YouWillLearn>

## Atualizando arrays sem mutação {/*updating-arrays-without-mutation*/}

Em JavaScript, arrays são apenas outro tipo de objeto. [Como com objetos](/learn/updating-objects-in-state), **você deve tratar arrays no React state como somente leitura.** Isso significa que você não deve reassignar itens dentro de um array como `arr[0] = 'bird'`, e você também não deve usar métodos que mutam o array, como `push()` e `pop()`.

Em vez disso, toda vez que você quiser atualizar um array, você precisará passar um array *novo* para sua função de definição de state. Para fazer isso, você pode criar um novo array a partir do array original no seu state, chamando os métodos não mutáveis dele, como `filter()` e `map()`. Então você pode definir seu state para o novo array resultante.

Aqui está uma tabela de referência de operações de array comuns. Ao lidar com arrays dentro do React state, você precisará evitar os métodos na coluna da esquerda e, em vez disso, preferir os métodos na coluna da direita:

|           | evitar (muta o array)           | preferir (retorna um novo array)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| adicionando    | `push`, `unshift`                   | `concat`, `[...arr]` sintaxe spread ([exemplo](#adding-to-an-array)) |
| removendo  | `pop`, `shift`, `splice`            | `filter`, `slice` ([exemplo](#removing-from-an-array))              |
| substituindo | `splice`, `arr[i] = ...` atribuição | `map` ([exemplo](#replacing-items-in-an-array))                     |
| ordenando   | `reverse`, `sort`                   | copie o array primeiro ([exemplo](#making-other-changes-to-an-array)) |

Alternativamente, você pode [usar Immer](#write-concise-update-logic-with-immer) que permite que você use métodos de ambas as colunas.

<Pitfall>

Infelizmente, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) e [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) têm nomes semelhantes mas são bem diferentes:

* `slice` permite que você copie um array ou parte dele.
* `splice` **muta** o array (para inserir ou deletar itens).

No React, você estará usando `slice` (sem `p`!) muito mais frequentemente porque você não quer mutar objetos ou arrays no state. [Atualizando Objetos](/learn/updating-objects-in-state) explicam o que é mutação e por que ela não é recomendada para o state.

</Pitfall>

### Adicionando a um array {/*adding-to-an-array*/}

`push()` irá mutar um array, o que você não quer:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
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

Em vez disso, crie um array *novo* que contém os itens existentes *e* um novo item no final. Há várias maneiras de fazer isso, mas a maneira mais fácil é usar a sintaxe `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Substitui o state
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
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
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

A sintaxe spread do array também permite que você adicione um item ao começo, colocando-o *antes* do `...artists` original:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Coloca os itens antigos no final
]);
```

Dessa forma, spread pode fazer o trabalho tanto do `push()` adicionando ao final de um array e do `unshift()` adicionando ao início de um array. Experimente no sandbox acima!

### Removendo de um array {/*removing-from-an-array*/}

A maneira mais fácil de remover um item de um array é *filtrá-lo para fora*. Em outras palavras, você produzirá um novo array que não conterá esse item. Para fazer isso, use o método `filter`, por exemplo:

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
      <h1>Inspiring sculptors:</h1>
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
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Clique no botão "Delete" algumas vezes e observe seu manipulador de clique.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Aqui, `artists.filter(a => a.id !== artist.id)` significa "crie um array que consiste nos `artists` cujos IDs são diferentes de `artist.id`". Em outras palavras, o botão "Delete" de cada artista irá filtrar _aquele_ artista do array, e então solicitar uma re-renderização com o array resultante. Observe que `filter` não modifica o array original.

### Transformando um array {/*transforming-an-array*/}

Se você deseja alterar alguns ou todos os itens do array, pode usar `map()` para criar um **novo** array. A função que você passará para `map` pode decidir o que fazer com cada item, com base em seus dados ou seu índice (ou ambos).

Neste exemplo, um array contém as coordenadas de dois círculos e um quadrado. Quando você pressiona o botão, ele move apenas os círculos para baixo em 50 pixels. Ele faz isso produzindo um novo array de dados usando `map()`:

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
        // Sem alteração
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
        Mova os círculos para baixo!
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

É particularmente comum querer substituir um ou mais itens em um array. Atribuições como `arr[0] = 'bird'` estão mutando o array original, então, em vez disso, você também vai querer usar `map` para isso.

Para substituir um item, crie um novo array com `map`. Dentro da sua chamada `map`, você receberá o índice do item como o segundo argumento. Use-o para decidir se deve retornar o item original (o primeiro argumento) ou outra coisa:

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

Às vezes, você pode querer inserir um item em uma posição específica que não esteja nem no início nem no final. Para fazer isso, você pode usar a sintaxe `...` array spread junto com o método `slice()`. O método `slice()` permite que você corte uma "fatia" do array. Para inserir um item, você criará um array que espalha a fatia _antes_ do ponto de inserção, então o novo item e, em seguida, o restante do array original.

Neste exemplo, o botão Insert sempre insere no índice `1`:

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
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
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

### Fazendo outras alterações em um array {/*making-other-changes-to-an-array*/}

Há algumas coisas que você não pode fazer apenas com a sintaxe spread e métodos não mutáveis como `map()` e `filter()`. Por exemplo, você pode querer inverter ou classificar um array. Os métodos JavaScript `reverse()` e `sort()` estão mutando o array original, então você não pode usá-los diretamente.

**No entanto, você pode copiar o array primeiro e, em seguida, fazer alterações nele.**

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
        Reverse
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

Aqui, você usa a sintaxe `[...list]` spread para criar uma cópia do array original primeiro. Agora que você tem uma cópia, você pode usar métodos mutáveis como `nextList.reverse()` ou `nextList.sort()`, ou até mesmo atribuir itens individuais com `nextList[0] = "something"`.

No entanto, **mesmo que você copie um array, você não pode mutar os itens existentes _dentro_ dele diretamente.** Isso ocorre porque a cópia é rasa - o novo array conterá os mesmos itens que o original. Então, se você modificar um objeto dentro do array copiado, você estará mutando o state existente. Por exemplo, código como este é um problema.

```js
const nextList = [...list];
nextList[0].seen = true; // Problema: muta list[0]
setList(nextList);
```

Embora `nextList` e `list` sejam dois arrays diferentes, **`nextList[0]` e `list[0]` apontam para o mesmo objeto.** Então, mudando `nextList[0].seen`, você também está mudando `list[0].seen`. Esta é uma mutação de state, que você deve evitar! Você pode resolver esse problema de maneira semelhante a [atualizar objetos JavaScript aninhados](/learn/updating-objects-in-state#updating-a-nested-object) - copiando itens individuais que você deseja alterar em vez de mutá-los. Veja como.

## Atualizando objetos dentro de arrays {/*updating-objects-inside-arrays*/}

Objetos não são _realmente_ localizados "dentro" de arrays. Eles podem parecer estar "dentro" no código, mas cada objeto em um array é um valor separado, para o qual o array "aponta". É por isso que você precisa ter cuidado ao alterar campos aninhados como `list[0]`. A lista de obras de arte de outra pessoa pode apontar para o mesmo elemento do array!

**Ao atualizar o state aninhado, você precisa criar cópias a partir do ponto em que deseja atualizar, e todo o caminho até o nível superior.** Vamos ver como isso funciona.

Neste exemplo, duas listas de obras de arte separadas têm o mesmo state inicial. Elas devem ser isoladas, mas por causa de uma mutação, seu state é acidentalmente compartilhado, e marcar uma caixa em uma lista afeta a outra lista:

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
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

Embora o array `myNextList` em si seja novo, os *próprios itens* são os mesmos do array `myList` original. Então, mudar `artwork.seen` muda o item de obra de arte *original*. Esse item de obra de arte também está em `yourList`, o que causa o erro. Bugs como esse podem ser difíceis de entender, mas, felizmente, eles desaparecem se você evitar mutar o state.

**Você pode usar `map` para substituir um item antigo por sua versão atualizada sem mutação.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Cria um objeto *novo* com as alterações
    return { ...artwork, seen: nextSeen };
  } else {
    // Sem alterações
    return artwork;
  }
}));
```

Aqui, `...` é a sintaxe spread de objeto usada para [criar uma cópia de um objeto.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Com essa abordagem, nenhum dos itens de state existentes está sendo mutado, e o erro é corrigido:

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
        // Cria um objeto *novo* com as alterações
        return { ...artwork, seen: nextSeen };
      } else {
        // Sem alterações
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Cria um objeto *novo* com as alterações
        return { ...artwork, seen: nextSeen };
      } else {
        // Sem alterações
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

Em geral, **você só deve mutar objetos que você acabou de criar.** Se você estivesse inserindo uma obra de arte *nova*, você poderia mutá-la, mas se você estiver lidando com algo que já está no state, você precisa fazer uma cópia.

### Escreva uma lógica de atualização concisa com Immer {/*write-concise-update-logic-with-immer*/}

Atualizar arrays aninhados sem mutação pode ficar um pouco repetitivo. [Assim como com objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Geralmente, você não deve precisar atualizar o state mais de alguns níveis de profundidade. Se seus objetos de state forem muito profundos, você pode querer [restruturá-los de forma diferente](/learn/choosing-the-state-structure#avoid-deeply-nested-state) para que eles sejam rasos.
- Se você não quiser alterar sua estrutura de state, pode preferir usar [Immer](https://github.com/immerjs/use-immer), que permite que você escreva usando a sintaxe conveniente, mas mutável e cuida de produzir as cópias para você.

Aqui está o exemplo da Lista de Obras de Arte reescrito com Immer:

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
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

Observe como com Immer, **a mutação como `artwork.seen = nextSeen` agora é permitida:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Isso ocorre porque você não está mutando o state _original_, mas está mutando um objeto `draft` especial fornecido pelo Immer. Da mesma forma, você pode aplicar métodos mutáveis como `push()` e `pop()` ao conteúdo do `draft`.

Nos bastidores, Immer sempre constrói o state a partir do zero de acordo com as alterações que você fez no `draft`. Isso mantém seus manipuladores de eventos muito concisos, sem nunca mutar o state.

<Recap>```
PART 2 OF 2:

PART 3 OF 2:

- Você pode colocar `arrays` no `state`, mas não pode modificá-los.
- Em vez de mutar um `array`, crie uma versão *nova* dele, e atualize o `state` para ele.
- Você pode usar a sintaxe de espalhamento de `array` `[...arr, newItem]` para criar `arrays` com novos itens.
- Você pode usar `filter()` e `map()` para criar novos `arrays` com itens filtrados ou transformados.
- Você pode usar Immer para manter seu código conciso.

</Recap>

<Challenges>

#### Atualizar um item no carrinho de compras {/*update-an-item-in-the-shopping-cart*/}

Preencha a lógica `handleIncreaseClick` para que pressionar "+" aumente o número correspondente:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

Você pode usar a função `map` para criar um novo `array`, e então usar a sintaxe de espalhamento de objeto `...` para criar uma cópia do objeto alterado para o novo `array`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

Este carrinho de compras tem um botão "+" funcionando, mas o botão "–" não faz nada. Você precisa adicionar um manipulador de eventos a ele para que pressioná-lo diminua o `count` do produto correspondente. Se você pressionar "–" quando a contagem for 1, o produto deverá ser removido automaticamente do carrinho. Certifique-se de que ele nunca mostre 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

Você pode primeiro usar `map` para produzir um novo `array`, e então `filter` para remover produtos com um `count` definido para `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

#### Corrigir as mutações usando métodos não mutativos {/*fix-the-mutations-using-non-mutative-methods*/}

Neste exemplo, todos os manipuladores de eventos em `App.js` usam mutação. Como resultado, editar e deletar `todos` não funciona. Reescreva `handleAddTodo`, `handleChangeTodo`, e `handleDeleteTodo` para usar os métodos não-mutativos:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

Em `handleAddTodo`, você pode usar a sintaxe de espalhamento de `array`. Em `handleChangeTodo`, você pode criar um novo `array` com `map`. Em `handleDeleteTodo`, você pode criar um novo `array` com `filter`. Agora a lista funciona corretamente:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
      </button>
    </label>
  );
}
```

</Sandpack>```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>

#### Corrija as mutações usando Immer {/*fix-the-mutations-using-immer*/}

Este é o mesmo exemplo do desafio anterior. Desta vez, corrija as mutações usando Immer. Para sua conveniência, `useImmer` já está importado, então você precisa alterar a variável de estado `todos` para usá-la.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

Com Immer, você pode escrever código no estilo de mutação, desde que você esteja apenas mutando partes do `draft` que Immer lhe dá. Aqui, todas as mutações são realizadas no `draft` para que o código funcione:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

Você também pode misturar e combinar as abordagens de mutação e não mutação com Immer.

Por exemplo, nesta versão, `handleAddTodo` é implementado mutando o `draft` do Immer, enquanto `handleChangeTodo` e `handleDeleteTodo` usam os métodos `map` e `filter` não mutativos:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

Com Immer, você pode escolher o estilo que parece mais natural para cada caso em separado.

</Solution>

</Challenges>