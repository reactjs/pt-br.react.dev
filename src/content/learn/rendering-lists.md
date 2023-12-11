---
title: Renderizando Listas
---

<Intro>

É comum a necessidade de se exibir vários componentes semelhantes a partir de uma coleção de dados. Você pode usar os [métodos de array JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) para manipular um array de dados. Nessa página, você usará [`filter()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) e [`map()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map) com o React para filtrar e transformar seu array de dados em um array de componentes.

</Intro>

<YouWillLearn>

* Como renderizar componentes a partir de um array usando `map()` do JavaScript
* Como renderizar apenas componentes específicos usando `filter()` do JavaScript
* Quando e por que usar as keys do React

</YouWillLearn>

## Renderizando dados de arrays {/*rendering-data-from-arrays*/}

Digamos que você tenha uma lista de informações.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

As únicas diferenças entre os itens da lista são seus conteúdos, seus dados. Você comumente precisará exibir diversas instâncias do mesmo componente usando dados diferentes ao construir interfaces: de listas de comentários a galerias de fotos de perfil. Nestas situações, você pode armazenar esses dados em objetos ou arrays JavaScript e usar métodos como [`map()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map) e [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) para renderizar listas de componentes a partir deles.

Aqui está um breve exemplo de como gerar uma lista de itens a partir de um array:

1. **Mova** os dados para um array:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Mapeie** os membros de `people` a um novo array de nós JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Retorne** `listItems` do seu componente dentro de uma `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Esse é o resultado:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Perceba que a *sandbox* acima exibe um erro no *console*:

<ConsoleBlock level="error">

Aviso: Cada filho em uma lista deve haver uma prop "key" única.

</ConsoleBlock>

Mais tarde nessa página, você aprenderá como corrigir este erro. Mas antes, vamos estruturar os seus dados um pouco mais.

## Filtrando arrays de itens {/*filtering-arrays-of-items*/}

Esses dados podem ser estruturados ainda mais.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Vamos supor que você queira exibir somente as pessoas cuja profissão seja `'chemist'`. Neste caso, voce pode usar o método `filter()` do JavaScript para retornar apenas essas pessoas. Este método recebe um array de itens, os quais são submetidos a um “teste” (uma função que retorna `true` ou `false`), e retorna um novo array contendo apenas aqueles itens os quais passaram no teste (retornaram `true`).

Você quer apenas os itens onde `profession` seja `'chemist'`. A função "teste" para isto ficaria assim `(person) => person.profession === 'chemist'`. Veja como juntar tudo isso:

1. **Crie** um novo array contendo apenas pessoas cuja profissão é “chemist”, `chemists`, chamando `filter()` em `people` e filtrando por `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Agora **mapeie** sobre `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. Por fim, **retorne** `listItems` em seu componente:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Arrow functions retornam implicitamente a expressão logo após `=>`, então você não precisa de uma declaração `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Retorno implícito!
);
```

Entretanto, **você deve escrever `return` explicitamente se seu `=>` é seguido de uma chave `{`!**

```js
const listItems = chemists.map(person => { // Chave
  return <li>...</li>;
});
```

Nos referimos a arrow functions que contenham `=> {` em seu início como possuindo um ["corpo em bloco".](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Elas deixam com que você escreva mais de uma linha de código, mas você *precisa* incluir uma declaração `return` manualmente. Caso esquecida, nada é retornado!

</Pitfall>

## Mantendo itens em ordem com `key` {/*keeping-list-items-in-order-with-key*/}

Perceba que todas as *sandboxes* acima exibem um erro no *console*:

<ConsoleBlock level="error">

Aviso: Cada filho em uma lista deve ter uma prop "key" única.

</ConsoleBlock>

Você precisa dar a cada item do array uma `key` -- uma string ou um número que o identifique unicamente dentre os demais itens naquele array:

```js
<li key={person.id}>...</li>
```

<Note>

Elementos JSX retornados por um chamado `map()` sempre precisam de keys!

</Note>

Keys dizem ao React a qual item do array cada componente corresponde, para que ele possa combiná-los mais tarde. Isso se torna importante se os itens do seu array podem se mover (por exemplo, ao ser ordenado), serem inseridos, ou serem removidos. Uma `key` bem escolhida ajuda o React a identificar o que exatamente aconteceu, e fazer as atualizações corretas à árvore da DOM.

Em vez de gerar keys em tempo real, você deve incluí-las em seus dados:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Usado no JSX como key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Usado no JSX como key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Usado no JSX como key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Usado no JSX como key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Usado no JSX como key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Exibindo múltiplos nós da DOM para cada item da lista {/*displaying-several-dom-nodes-for-each-list-item*/}

O que fazer quando cada item precisa renderizar não um, mas múltiplos nós da DOM?

A sintaxe abreviada [`<>...</>` Fragment](/reference/react/Fragment) não deixará com que você passe uma key, por conta disto você precisa agrupá-los em uma única `<div>`, ou então usar a um pouco mais longa e [mais explícita sintaxe `<Fragment>`:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragmentos desaparecem da DOM, então isto irá produzir uma lista plana de `<h1>`, `<p>`, `<h1>`, `<p>`, e assim por diante.

</DeepDive>

### Onde conseguir sua `key` {/*where-to-get-your-key*/}

As chaves podem vir de diferentes fontes de dados:

* **Dados de uma base de dados:** Se seus dados estão vindo de uma base de dados, você pode usar as keys/IDs desta, os quais são únicos por natureza.
* **Dados gerados localmente:** Se seus dados são gerados e persistidos localmente (por exemplo, anotações em um aplicativo de notas), use um contador incremental, [`crypto.randomUUID()`](https://developer.mozilla.org/pt-BR/docs/Web/API/Crypto/randomUUID) ou um biblioteca como a [`uuid`](https://www.npmjs.com/package/uuid) ao criar itens.

### Regras das keys {/*rules-of-keys*/}

* **Keys devem ser únicas entre suas irmãs.** Entretanto, é tranquilo usar as mesmas chaves para nós JSX em arrays *diferentes*.
* **Keys não devem mudar** caso contrário, isso vai contra o seu propósito! Não as gere durante a renderização. 

### Por que o React precisa de keys? {/*why-does-react-need-keys*/}

Imagine que os arquivos em sua área de trabalho não tivessem nomes. Em vez disso, você teria que se referir a eles pela sua ordem -- o primeiro arquivo, o segundo arquivo, e assim por diante. Isto poderia funcionar em um primeiro momento, porém uma vez que você exclua um arquivo, as coisas iriam ficar confusas. O segundo arquivo se tornaria o primeiro, o terceiro arquivo se tornaria o segundo e assim por diante.

Nomes de arquivo em uma pasta e keys JSX em um array servem um propósito similar. Eles permitem com que nós identifiquemos unicamente um item entre seus irmãos. Uma key bem escolhida fornece mais informação que uma posição dentro do array. Mesmo que a *posição* mude por conta de uma reordenação, a `key` permite que o React identifique o item durante seu ciclo de vida.

<Pitfall>

Você pode ser tentado a usar o índice de um item no array como sua key. De fato, isto é o que o React irá utilizar caso você não especifique uma `key`. Entretanto, a ordem em que você renderiza os itens irá mudar conforme o tempo caso um item seja inserido, excluído, ou se o array for reordenado. Usar índices como key por muitas vezes leva a bugs sutis e confusos.

Da mesma forma, não gere keys em tempo real, por exemplo com `key={Math.random()}`. Isso fará com que as keys nunca sejam iguais nas renderizações subsequentes, ocasionando com que todos os seus componentes e DOM sejam recriados a cada vez. Isso não somente é lento, mas também perde qualquer dado de entrada do usuário dentro dos elementos da lista. Em vez disso, use um ID estável baseado nos dados.

Note que os seus componentes não receberão `key` como uma prop. Esta só é usada como uma dica pelo próprio React. Se o seu componente precisa de um ID, você deve passá-lo como uma prop separada: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Nessa página você aprendeu:

* Como mover dados para fora de componentes e para dentro de estruturas como arrays ou objetos.
* Como gerar conjuntos de componentes similares com o `map()` do JavaScript.
* Como criar arrays de itens filtrados com o `filter()` do JavaScript.
* Porquê e como definir `key` em cada componente dentre uma coleção para que o React possa acompanhar cada um deles mesmo se sua posição ou dados mudem.

</Recap>

<Challenges>

#### Separando uma lista em duas {/*splitting-a-list-in-two*/}

Esse exemplo mostra uma lista de todas as pessoas.

Altere-o para exibir duas listas separadas uma após a outra: **Químicos** e **Outras Profissões.** Como antes, você pode determinar se uma pessoa é um "químico" checando se `person.profession === 'chemist'`.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Você pode usar `filter()` duas vezes, criando dois arrays separados, e então chamando `map` em ambos:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Nesta solução, as chamadas `map` são colocadas diretamente em linha nos elementos `<ul>` pai, mas você pode introduzir variáveis para elas se você considerar isso mais legível.

Ainda há um pouco de duplicação entre as listas renderizadas. Você pode ir além e extrair as partes repetitivas em um componente `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Um leitor atencioso pode notar que com duas chamadas de `filter`, nós checamos a profissão de cada pessoa duas vezes. Checar uma propriedade é muito rápido, então nesse exemplo não há problema. Se sua lógica for mais complexa que isso, você pode substituir as chamadas de `filter` por um loop o qual constrói manualmente os arrays e checa cada pessoa uma vez.

De fato, se `people` nunca mudar, você pode mover esse código para fora de seu componente. Da perspectiva do React, tudo o que importa é que você o dê um array de nós JSX no fim das contas. Ele não se importa sobre como você produziu esse array:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Listas aninhadas em um componente {/*nested-lists-in-one-component*/}

Faça uma lista de receitas a partir desse array! Para cada receita no array, exiba seu nome como um `<h2>` e liste seus ingredientes em uma `<ul>`.

<Hint>

Para fazer isto, você precisará realizar duas chamadas ao `map` aninhadas. 

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Você poderia seguir esse caminho:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Cada uma das `recipes` já inclui um campo `id`, então é isso que o loop externo usa como sua `key`. Não ha ID que você possa usar para iterar sobre os ingredientes. Entretanto, podemos assumir que o mesmo ingrediente são será listado duas vezes na mesma receita, então seu nome pode servir como uma `key`. Alternativamente, você pode mudar a estrutura dos dados para adicionar IDs, ou usar o índice como uma `key` (com a exceção de que você não pode seguramente reordenar ingredientes).

</Solution>

#### Extraindo um componente de uma lista de items {/*extracting-a-list-item-component*/}

Esse componente `RecipeList` contêm duas chamadas ao `map` aninhadas. Simplificando, extraia um componente `Recipe` dele o qual irá aceitar as props `id`, `name`, e `ingredients`. Onde você coloca a `key` externa e por que?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Você pode copiar e colar o JSX de um `map` externo em um novo componente `Recipe` e retornar esse JSX. Então, você pode mudar `recipe.name` para `name`, `recipe.id` para `id`, e assim por diante, posteriormente passando-os como props para a `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Aqui, `<Recipe {...recipe} key={recipe.id} />` é um atalho de sintaxe dizendo "passe todas as propriedades do objeto `recipe` como props para o componente `Recipe`". Você também pode escrever cada prop explicitamente: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Note que a `key` é especificada no `<Recipe>` propriamente dito ao invés de na `div` raiz retornada por `Recipe`.** Isso se deve ao fato de que essa `key` é diretamente necessária dentro do contexto do array em que o componente está sendo renderizado. Anteriormente, você tinha um array de `<div>`s então cada uma delas precisava de uma `key`, mas agora você tem um array de `<Recipe>`s. Em outras palavras, quando você extrai um componente, não se esqueça de deixar a `key` fora da JSX que você copia e cola.

</Solution>

#### Lista com um separador {/*list-with-a-separator*/}

<<<<<<< HEAD
Esse exemplo renderiza um famoso haiku por Katsushika Hokusai, com cada linha envolta em uma tag `<p>`. Seu trabalho é inserir um separador `<hr />` entre cada parágrafo. Sua estrutura resultante deve se parecer com isso:
=======
This example renders a famous haiku by Tachibana Hokushi, with each line wrapped in a `<p>` tag. Your job is to insert an `<hr />` separator between each paragraph. Your resulting structure should look like this:
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Um haiku contêm apenas três linhas, mas a solução deve funcionar com qualquer número de linhas. Note que elementos `<hr />` apenas aparecem *entre* os elementos `<p>`, não no começo ou fim!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Esse é um caso raro onde o uso do índice como key é aceitável porque as linhas do poema nunca serão reordenadas.)

<Hint>

<<<<<<< HEAD
Você precisará converter `map` para um loop manual, ou então usar um fragment.
=======
You'll either need to convert `map` to a manual loop, or use a Fragment.
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

</Hint>

<Solution>

Você pode escrever um loop manual, inserindo `<hr />` e `<p>...</p>` na saída do array conforme você vai:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Preencher o array output
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove o primeiro <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Usando o índice original da linha como `key` não funciona mais porque cada separador e parágrafo estão agora no mesmo array. Entretanto, você pode dar a cada uma delas uma key distinta usando um sufixo, por exemplo `key={i + '-text'}`.

<<<<<<< HEAD
Alternativamente, você pode renderizar uma coleção de fragmentos a qual contêm `<hr />` e `<p>...</p>`. Entretanto, o atalho de sintaxe `<>...</>` não suporta a passagem de keys, então você teria que escrever `<Fragment>` explicitamente:
=======
Alternatively, you could render a collection of Fragments which contain `<hr />` and `<p>...</p>`. However, the `<>...</>` shorthand syntax doesn't support passing keys, so you'd have to write `<Fragment>` explicitly:
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

<<<<<<< HEAD
Lembre-se, fragmentos (comumente escritos como `<> </>`) deixam com que você agrupe nós JSX sem adicionar `<div>`s extras!
=======
Remember, Fragments (often written as `<> </>`) let you group JSX nodes without adding extra `<div>`s!
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

</Solution>

</Challenges>
