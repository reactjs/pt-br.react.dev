---
title: Adicionando Interatividade
---

<Intro>

Alguns elementos na tela se atualizam em resposta às entradas do usuário. Por exemplo, ao clicar em uma galeria de imagens, a imagem ativa é trocada. Em React, os dados que mudam ao longo do tempo são chamados de *state.* Você pode adicionar states a qualquer componente, e atualizá-los quando necessário. Neste capítulo, você aprenderá como escrever componentes que gerenciam interações, atualizam seus states, e apresentam diferentes saídas ao longo do tempo.

</Intro>

<YouWillLearn isChapter={true}>

* [Como manipular eventos acionados pelo usuário](/learn/responding-to-events)
* [Como fazer os componentes "memorizarem" informações com o state](/learn/state-a-components-memory)
* [Como o React atualiza a UI em duas fases](/learn/render-and-commit)
* [Porque o state não atualiza logo após ser alterado](/learn/state-as-a-snapshot)
* [Como enfileirar múltiplas atualizações no state](/learn/queueing-a-series-of-state-updates)
* [Como atualizar um objeto no state](/learn/updating-objects-in-state)
* [Como atualizar um array no state](/learn/updating-arrays-in-state)

</YouWillLearn>

## Respondendo a eventos {/*responding-to-events*/}

Componentes embutidos, a exemplo do `<button>` apenas são compatíveis com eventos de navegador, como `onClick`.

No entanto, você também pode criar seus próprios componentes e atribuir aos props de seus manipuladores de eventos quaisquer nomes específicos da aplicação que considerar adequados.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Leia **[Respondendo a Eventos](/learn/responding-to-events)** para aprender como adicionar manipuladores de eventos.

</LearnMore>

## State: A memória de um componente {/*state-a-components-memory*/}

Componentes necessitam de alterar frequentemente o que está na tela como resultado de uma interação. O campo de entrada será atualizado ao digitar em um formulário, a imagem exibida será trocada ao clicar em "próxima" em um carrossel de imagens, um produto é colocado no carrinho de compras ao clicar em "comprar". Componentes precisam "memorizar" informações: o valor de entrada ou a imagem atual, assim como o carrinho de compras, por exemplo. Em React, este tipo de memória específica de componente é chamada de *state.*

É possível adicionar states a componentes com um Hook [`useState`](/apis/usestate). Hooks são funções especiais que possibilitam que seus componentes utilizem recursos do React (como o state, por exemplo). O Hook `useState` possibilita a declaração de uma variável de estado. Este recurso recebe o state inicial e retorna um par de valores: o state atual e uma função setter, que possibilita atualizá-lo.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Veja como uma galeria de imagens utiliza e atualiza um state com cliques:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consited of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Leia **[State: A Memória de um Componente](/learn/state-a-components-memory)** para aprender como memorizar um valor e atualizá-lo com interatividade.

</LearnMore>

## Renderizar e confirmar {/*render-and-commit*/}

Antes que seus componentes sejam exibidos na tela, eles devem ser renderizados pelo React.

O entendimento dos passos neste processo irá ajudá-lo a pensar sobre como o seu código executa e explicará seu comportamento.

Imagine que seus componentes são chefs na cozinha, montando pratos saborosos a partir de ingredientes. Neste cenário, o React é o garçom que recebe as solicitações dos clientes e lhes traz o que foi pedido. Este processo de solicitar e servir a UI consiste em tres etapas:

1. **Acionamento** da renderização (entrega do pedido do cliente à cozinha)
2. **Renderização** do componente (preparo da solicitação na cozinha)
3. **Confirmação** ao DOM (disponibilização do pedido na mesa)

<IllustrationBlock sequential>
  <Illustration caption="Acionamento" alt="O React como um garçom em um restaurante, obtendo as solicitações dos usuários e entregando-as à cozinha dos componentes." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Renderização" alt="O chef Card fornece ao React um componente de Card preparado na hora." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Confirmação" alt="O React disponibiliza o Card para o usuário em sua mesa." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Leia **[Renderizar e Confirmar](/learn/render-and-commit)** para aprender sobre a atualização do ciclo de vida de uma UI.

</LearnMore>

## State como uma foto instantânea {/*state-as-a-snapshot*/}

Diferentemente de variáveis regulares do JavaScript, o state do React se comporta mais como uma foto instantânea. Definí-lo não altera a variável state que você já possui, mas ao invés disso, ativa uma nova renderização. Isso pode ser surpreendente no início!

```js
console.log(count);  // 0
setCount(count + 1); // Solicitação de uma nova renderização com 1
console.log(count);  // Ainda 0!
```

Este comportamento lhe ajuda a evitar bugs sutis. Aqui está um pequeno aplicativo de mensagens. Tente supor o que acontece se você pressionar "Send" primeiramente e depois alterar o destinatário para Bob. Qual nome aparecerá no `alert` após cinco segundos?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Leia **[State como uma Foto Instantânea](/learn/state-as-a-snapshot)** para aprender por que o state parece "fixo" e imutável dentro dos manipuladores de eventos.

</LearnMore>

## Enfileirando uma série de atualizações no state {/*queueing-a-series-of-state-updates*/}

Este componente contém bugs: clicar em "+3" incrementa a pontuação em apenas uma unidade.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[State como uma Foto Instantânea](/learn/state-as-a-snapshot) explica por que isso está acontecendo. Definir o state solicita uma nova renderização, mas não o altera no código já em execução. Então `score` continua a ser `0` logo depois de você chamar `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Você pode consertar isso passando uma *função de atualização* ao definir o state. Perceba como a substituição de `setScore(score + 1)` por `setScore(s => s + 1)` conserta o botão "+3". Isso lhe possibilita enfileirar múltiplas atualizações de state.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Leia **[Enfileirando uma Série de Atualizações no State](/learn/queueing-a-series-of-state-updates)** para aprender como enfileirar uma sequência de atualizações no state.

</LearnMore>

## Atualizando objetos no state {/*updating-objects-in-state*/}

O state pode conter qualquer tipo de valor do JavaScript, inclusive objetos. Mas você não deve alterar diretamente os objetos e arrays que mantém no state do React. Em vez disso, quando desejar atualizar um objeto e array, você precisa criar um novo (ou fazer uma cópia de um existente) e, em seguida, definir o state para usar essa cópia.

Normalmente, você utilizará a sintaxe de spread `...` para copiar objetos e arrays que deseja alterar. Por exemplo, a atualização de um objeto aninhado funcionaria assim:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Caso copiar objetos no código fique entediante, você pode utilizar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir o código repetitivo:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Leia **[Atualizando Objetos no State](/learn/updating-objects-in-state)** para aprender como atualizar objetos corretamente.

</LearnMore>

## Atualizando arrays no state {/*updating-arrays-in-state*/}

Arrays são outro tipo de objetos mutáveis do JavaScript que podem ser armazenados no state. É recomendado que sejam tratados como somente leitura. Assim como objetos, ao atualizar um array armazenado no state, é necessário criar um novo (ou realizar a cópia de um existente), e depois definir o state para utilizar o novo array:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

Caso copiar arrays no código fique entediante, você pode utilizar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir o código repetitivo:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
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
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Leia **[Atualizando Arrays no State](/learn/updating-arrays-in-state)** para aprender como atualizar arrays corretamente.

</LearnMore>

## O que vem a seguir? {/*whats-next*/}

Vá até [Respondendo a Eventos](/learn/responding-to-events) para começar a ler este capítulo página por página!

Ou, se você já está familiarizado com estes tópicos, por que não ler sobre [Gerenciando o Estado](/learn/managing-state)?