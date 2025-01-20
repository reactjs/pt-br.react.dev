---
title: Adicionando Interatividade
---

<Intro>

Algumas coisas na tela são atualizadas em resposta à entrada do usuário. Por exemplo, clicar em uma galeria de imagens troca a imagem ativa. No React, dados que mudam ao longo do tempo são chamados de *estado.* Você pode adicionar estado a qualquer componente e atualizá-lo conforme necessário. Neste capítulo, você aprenderá a escrever componentes que lidam com interações, atualizam seu estado e exibem diferentes saídas ao longo do tempo.

</Intro>

<YouWillLearn isChapter={true}>

* [Como lidar com eventos iniciados pelo usuário](/learn/responding-to-events)
* [Como fazer componentes "lembrar" informações com estado](/learn/state-a-components-memory)
* [Como o React atualiza a UI em duas fases](/learn/render-and-commit)
* [Por que o estado não é atualizado logo após você alterá-lo](/learn/state-as-a-snapshot)
* [Como enfileirar múltiplas atualizações de estado](/learn/queueing-a-series-of-state-updates)
* [Como atualizar um objeto no estado](/learn/updating-objects-in-state)
* [Como atualizar um array no estado](/learn/updating-arrays-in-state)

</YouWillLearn>

## Respondendo a eventos {/*responding-to-events*/}

O React permite que você adicione *manipuladores de eventos* ao seu JSX. Manipuladores de eventos são suas próprias funções que serão acionadas em resposta a interações do usuário, como clicar, passar o mouse, focar em entradas de formulário e assim por diante.

Componentes integrados, como `<button>`, suportam apenas eventos incorporados do navegador, como `onClick`. No entanto, você também pode criar seus próprios componentes e dar a eles nomes de props de manipuladores de eventos que sejam específicos para sua aplicação.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Reproduzindo!')}
      onUploadImage={() => alert('Fazendo upload!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Reproduzir Filme
      </Button>
      <Button onClick={onUploadImage}>
        Fazer Upload da Imagem
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

## Estado: a memória de um componente {/*state-a-components-memory*/}

Componentes frequentemente precisam mudar o que está na tela como resultado de uma interação. Digitar no formulário deve atualizar o campo de entrada, clicar em "próximo" em um carrossel de imagens deve mudar qual imagem está sendo exibida, clicar em "comprar" coloca um produto no carrinho de compras. Componentes precisam "lembrar" coisas: o valor atual de entrada, a imagem atual, o carrinho de compras. No React, esse tipo de memória específica do componente é chamado de *estado.*

Você pode adicionar estado a um componente com um Hook [`useState`](/apis/usestate). Hooks são funções especiais que permitem que seus componentes utilizem recursos do React (o estado é um desses recursos). O Hook `useState` permite que você declare uma variável de estado. Ele recebe o estado inicial e retorna um par de valores: o estado atual e uma função definidora de estado que permite que você o atualize.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Aqui está como uma galeria de imagens utiliza e atualiza o estado ao clicar:

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
        Próximo
      </button>
      <h2>
        <i>{sculpture.name} </i>
        por {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} de {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Ocultar' : 'Mostrar'} detalhes
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
  description: 'Embora Colvin seja predominantemente conhecida por temas abstratos que aludem a símbolos pré-hispânicos, esta escultura gigantesca, uma homenagem à neurocirurgia, é uma das suas peças de arte pública mais reconhecíveis.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Uma estátua de bronze de duas mãos cruzadas segurando delicadamente um cérebro humano com as pontas dos dedos.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Esta enorme (75 pés ou 23m) flor prateada está localizada em Buenos Aires. Ela foi projetada para se mover, fechando suas pétalas à noite ou quando ventos fortes sopram, e abrindo-as pela manhã.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Uma escultura floral metálica gigante com pétalas refletivas semelhantes a espelhos e estames fortes.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson era conhecido por sua preocupação com a igualdade, justiça social, assim como as qualidades essenciais e espirituais da humanidade. Este enorme (7 pés ou 2,13m) bronze representa o que ele descreveu como "uma presença simbólica negra imbuída de um senso de humanidade universal".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'A escultura representando uma cabeça humana parece sempre presente e solene. Ela irradia calma e serenidade.'
}, {
  name: 'Moai',
  artist: 'Artista Desconhecido',
  description: 'Localizados na Ilha de Páscoa, existem 1.000 moai, ou estátuas monumentais existentes, criadas pelos primeiros habitantes Rapa Nui, que alguns acreditam representar ancestrais deificados.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Três bustos monumentais de pedra com cabeças desproporcionalmente grandes e rostos sombrios.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'As Nanas são criaturas triunfantes, símbolos de feminilidade e maternidade. Inicialmente, Saint Phalle usou tecido e objetos encontrados para as Nanas e, mais tarde, introduziu poliéster para obter um efeito mais vibrante.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Uma grande escultura em mosaico de uma figura feminina dançante e lúdica em um traje colorido que emana alegria.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Esta escultura abstrata de bronze faz parte da série The Family of Man localizada no Yorkshire Sculpture Park. Hepworth escolheu não criar representações literais do mundo, mas desenvolveu formas abstratas inspiradas por pessoas e paisagens.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Uma escultura alta feita de três elementos empilhados uns sobre os outros, lembrando uma figura humana.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendente de quatro gerações de escultores, o trabalho de Fakeye mesclava temas tradicionais e contemporâneos de Iorubá.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Uma intrincada escultura de madeira de um guerreiro com um rosto focado em um cavalo adornado com padrões.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow é conhecida por suas esculturas do corpo fragmentado como uma metáfora para a fragilidade e impermanência da juventude e beleza. Esta escultura retrata dois barrigões muito realistas empilhados um sobre o outro, cada um com cerca de cinco pés (1,5m) de altura.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'A escultura lembra uma cascata de dobras, bem diferente das barrigas em esculturas clássicas.'
}, {
  name: 'Terracotta Army',
  artist: 'Artista Desconhecido',
  description: 'O Exército de Terracota é uma coleção de esculturas de terracota retratando os exércitos de Qin Shi Huang, o primeiro Imperador da China. O exército consistiu de mais de 8.000 soldados, 130 carruagens com 520 cavalos e 150 cavalos de cavalaria.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 esculturas de terracota de guerreiros solenes, cada uma com uma expressão facial e armadura únicas.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson era conhecida por coletar objetos dos escombros de Nova York, que ela posteriormente montava em construções monumentais. Neste, ela usou partes díspares como um pé de cama, um pin de malabarismo e um fragmento de assento, pregando e colando-os em caixas que refletem a influência da abstração geométrica do Cubismo no espaço e na forma.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Uma escultura preta fosca onde os elementos individuais são inicialmente indistintos.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar funde o tradicional e o moderno, o natural e o industrial. Sua arte foca na relação entre o homem e a natureza. Seu trabalho foi descrito como atraente tanto abstratamente quanto figurativamente, desafiando a gravidade, e uma "fina síntese de materiais improváveis."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Uma escultura pálida e semelhante a fio montada na parede de concreto e descendo pelo chão. Ela parece leve.'
}, {
  name: 'Hippos',
  artist: 'Zoológico de Taipei',
  description: 'O Zoológico de Taipei encomendou uma Praça Hipopótamo apresentando hipopótamos submersos brincando.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Um grupo de esculturas de hipopótamos de bronze emergindo da calçada como se estivessem nadando.'
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

Leia **[Estado: A Memória de Um Componente](/learn/state-a-components-memory)** para aprender como lembrar um valor e atualizá-lo na interação.

</LearnMore>

## Renderizar e confirmar {/*render-and-commit*/}

Antes que seus componentes sejam exibidos na tela, eles devem ser renderizados pelo React. Compreender as etapas desse processo ajudará você a pensar sobre como seu código é executado e explicar seu comportamento.

Imagine que seus componentes são cozinheiros na cozinha, montando pratos saborosos a partir de ingredientes. Nesse cenário, o React é o garçom que faz os pedidos dos clientes e traz a eles as suas encomendas. Esse processo de solicitar e servir a UI tem três etapas:

1. **Acionar** uma renderização (entregar o pedido do cliente à cozinha)
2. **Renderizar** o componente (preparar o pedido na cozinha)
3. **Confirmar** ao DOM (colocar o pedido na mesa)

<IllustrationBlock sequential>
  <Illustration caption="Acionar" alt="React como um servidor em um restaurante, buscando pedidos dos usuários e entregando-os à Cozinha do Componente." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Renderizar" alt="O Chef do Card dá ao React um novo componente Card." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Confirmar" alt="React entrega o Card ao usuário em sua mesa." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Leia **[Renderizar e Confirmar](/learn/render-and-commit)** para aprender sobre o ciclo de vida de uma atualização de UI.

</LearnMore>

## Estado como um instantâneo {/*state-as-a-snapshot*/}

Diferente de variáveis regulares do JavaScript, o estado do React se comporta mais como um instantâneo. Alterá-lo não muda a variável de estado que você já tem, mas sim aciona uma nova renderização. Isso pode ser surpreendente a princípio!

```js
console.log(count);  // 0
setCount(count + 1); // Solicitar uma nova renderização com 1
console.log(count);  // Ainda 0!
```

Esse comportamento ajuda você a evitar bugs sutis. Aqui está um pequeno aplicativo de bate-papo. Tente adivinhar o que acontece se você pressionar "Enviar" primeiro e *depois* mudar o destinatário para Bob. De quem o nome aparecerá no `alert` cinco segundos depois?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Olá');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Você disse ${message} para ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Para:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Mensagem"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Leia **[Estado como um Instantâneo](/learn/state-as-a-snapshot)** para aprender por que o estado parece "fixo" e imutável dentro dos manipuladores de eventos.

</LearnMore>

## Enfileirando uma série de atualizações de estado {/*queueing-a-series-of-state-updates*/}

Este componente possui um erro: clicar em "+3" incrementa a pontuação apenas uma vez.

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
      <h1>Pontuação: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[Estado como um Instantâneo](/learn/state-as-a-snapshot) explica por que isso está acontecendo. Definir o estado solicita uma nova renderização, mas não o altera no código já em execução. Assim, `score` continua sendo `0` logo após você chamar `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Você pode corrigir isso passando uma *função de atualizador* ao definir o estado. Note como substituir `setScore(score + 1)` por `setScore(s => s + 1)` corrige o botão "+3". Isso permite que você enfileire múltiplas atualizações de estado.

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
      <h1>Pontuação: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Leia **[Enfileirando uma Série de Atualizações de Estado](/learn/queueing-a-series-of-state-updates)** para aprender como enfileirar uma sequência de atualizações de estado.

</LearnMore>

## Atualizando objetos no estado {/*updating-objects-in-state*/}

O estado pode conter qualquer tipo de valor JavaScript, incluindo objetos. Mas você não deve alterar objetos e arrays que você mantém no estado do React diretamente. Em vez disso, quando você quiser atualizar um objeto e array, precisa criar um novo (ou fazer uma cópia de um existente) e, em seguida, atualizar o estado para usar essa cópia.

Normalmente, você usará a sintaxe de espalhamento `...` para copiar objetos e arrays que deseja modificar. Por exemplo, atualizar um objeto aninhado poderia ser assim:

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
        Nome:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Cidade:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagem:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' por '}
        {person.name}
        <br />
        (localizada em {person.artwork.city})
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

Se copiar objetos em código se tornar maçante, você pode usar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir o código repetitivo:

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
        Nome:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Cidade:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagem:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' por '}
        {person.name}
        <br />
        (localizada em {person.artwork.city})
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

Leia **[Atualizando Objetos no Estado](/learn/updating-objects-in-state)** para aprender como atualizar objetos corretamente.

</LearnMore>

## Atualizando arrays no estado {/*updating-arrays-in-state*/}

Arrays são outro tipo de objetos JavaScript mutáveis que você pode armazenar no estado e devem ser tratados como somente leitura. Assim como com objetos, quando você deseja atualizar um array armazenado no estado, precisa criar um novo (ou fazer uma cópia de um existente) e, em seguida, definir o estado para usar o novo array:

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
      <h1>Lista de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
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

Se copiar arrays em código se tornar maçante, você pode usar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir código repetitivo:

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
      <h1>Lista de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
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

Leia **[Atualizando Arrays no Estado](/learn/updating-arrays-in-state)** para aprender como atualizar arrays corretamente.

</LearnMore>

## E agora? {/*whats-next*/}

Vá para [Respondendo a Eventos](/learn/responding-to-events) para começar a ler este capítulo página por página!

Ou, se você já está familiarizado com esses tópicos, que tal ler sobre [Gerenciando Estado](/learn/managing-state)?