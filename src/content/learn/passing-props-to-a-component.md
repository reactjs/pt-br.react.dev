---
title: Passando Props a um Componente
---

<Intro>

Componentes do React usam *props* para se comunicar um com ou outro. Todo componente pai pode passar alguma informação aos seus filhos por meio das *props*. Props podem te lembrar de atributos HTML, mas você pode passar qualquer valor JavaScript por meio delas, incluindo objetos, arrays, e funções.

</Intro>

<YouWillLearn>

* Como passar props para um componente
* Como ler props de um componente
* Como especificar valores padrão para as props
* Como passar JSX a um componente
* Como as props mudam com o tempo

</YouWillLearn>

## Props familiares {/*familiar-props*/}

Props são as informações que você passa usando uma tag JSX. Por exemplo, `className`, `src`, `alt`, `width`, e `height` são algumas das props que você pode passar a uma `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

As props que você pode passar a uma tag `<img>` são predefinidas (A ReactDOM conforma-se ao [padrão HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Mas você pode passar quaisquer props aos *seus próprios* componentes, como um `<Avatar>`, para customizá-los. Veja como fazer isso!

## Passando props para um componente {/*passing-props-to-a-component*/}

Neste código, o componente `Profile` não está passando nenhuma prop ao seu componente filho, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Você pode atribuir algumas props ao `Avatar` em dois passos.

### Passo 1: Passe props ao componente filho {/*step-1-pass-props-to-the-child-component*/}

Primeiro, passe algumas props ao `Avatar`. Por exemplo, vamos passar duas props: `person` (um objeto), e `size` (um número):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Se as chaves duplas depois de `person=` confundirem você, lembre-se [que elas são meramente um objeto](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) dentro das chaves da JSX.

</Note>

Agora você pode ler essas props dentro do componente `Avatar`.

### Passo 2: Leia props dentro de um componente filho {/*step-2-read-props-inside-the-child-component*/}

Você pode ler estas props listando seus nomes `person, size` separados por vírgulas dentro de `({` e `})` diretamente depois de `function Avatar`. Isso permite que você as use dentro do código de `Avatar`, assim como você faria com uma variável.

```js
function Avatar({ person, size }) {
  // person e size estão disponíveis aqui
}
```

Adicione alguma lógica a `Avatar` que use as props `person` e `size` para a renderização, e pronto.

Agora você pode configurar `Avatar` para que seja renderizado de várias maneiras diferentes usando props diferentes. Tente mudar os valores!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props permitem que você pense sobre os componentes pai e filho independentemente. Por exemplo, você pode mudar as props `person` ou `size` dentro de `Profile` sem ter que pensar sobre como `Avatar` as usa. Similarmente, você é livre para mudar como `Avatar` usa essas props, sem checar o `Profile`.

Você pode pensar nas props como "controles" os quais você pode ajustar. Elas desempenham o mesmo papel que os argumentos para funções-de fato, props _são_ o único argumento para o seu componente! Os componente funcionais do React aceitam apenas um argumento, um objeto `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Normalmente você não precisa de todo o objeto `props` em si, então você pode desestruturá-lo em props individuais.

<Pitfall>

**Não esqueça o par de `{` e `}` chaves** dentro de `(` e `)` ao declarar props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Esta sintaxe é chamada de ["desestruturação"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) e é equivalente a ler propriedades de um parâmetro de função:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Especificando um valor padrão para uma prop {/*specifying-a-default-value-for-a-prop*/}

Se você quer dar a uma prop um valor padrão para usar quando nenhum valor for especificado, pode fazer isso com a desestruturação colocando `=` e o valor padrão logo depois do parâmetro:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Agora, se `<Avatar person={...} />` for renderizado sem a prop `size`, `size` será igual a `100`.

O valor padrão é apenas utilizado se a prop `size` não for especificada ou se você passar `size={undefined}`. Mas caso você passe `size={null}` ou `size={0}`, o valor padrão **não** será usado.

## Encaminhando props com a sintaxe de espalhamento JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Às vezes, passar props se torna muito repetitivo:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Não há nada de errado com código repetitivo-ele pode ser mais legível. Mas às vezes você pode valorizar concisão. Alguns componentes encaminham todas as suas props aos seus filhos, como `Profile` faz com `Avatar`. Como eles não usam nenhuma de suas props diretamente, pode fazer sentido usar uma sintaxe de espalhamento mais concisa:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Isso encaminha todas as props de `Profile` ao `Avatar` sem listar cada um de seus nomes.

**Use a sintaxe de espalhamento com cuidado.** Se você está a utilizando em quase todos os componentes, algo está errado. Muitas vezes, isso indica que você deveria dividir seus componentes e passar filhos como JSX. Mais sobre isso a seguir!

## Passando JSX como `children` {/*passing-jsx-as-children*/}

É comum aninhar tags embutidas no navegador:

```js
<div>
  <img />
</div>
```

Às vezes você desejará aninhar seus próprios componentes da mesma forma:

```js
<Card>
  <Avatar />
</Card>
```

Quando você aninha conteúdo dentro de uma tag JSX, o componente pai irá receber esse conteúdo em uma prop chamada `children`. Por exemplo, o componente `Card` abaixo receberá a prop `children` definida como `<Avatar />` e o renderizará em uma wrapper div:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Tente substituir o `<Avatar>` dentro de `<Card>` com algum texto para ver como o componente `Card` pode encapsular conteúdo aninhado. Ele não precisa "saber" o que está sendo renderizado dentro dele. Você encontrará esse padrão flexível em muitos lugares.

É possível pensar sobre um componente com a prop `children` como se ele tivesse um "buraco" o qual pode ser "preenchido" por seus componente pais com JSX arbitrária. Você frequentemente usará a prop `children` para wrappers visuais: painéis, grids, etc.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Como props mudam com o passar do tempo {/*how-props-change-over-time*/}

O componente `Clock` abaixo recebe duas props de seu componente pai: `color` e `time`. (O código deste componente pai está omitido porque usa [state](/learn/state-a-components-memory), conceito o qual nós não vamos nos aprofundar ainda.)

Tente mudar a cor na caixa de seleção abaixo:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Escolha uma cor:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Este exemplo ilustra que **um componente pode receber props diferentes com o passar o tempo.** Props não são sempre estáticas! Aqui, a prop `time` muda a cada segundo, e a prop `color` muda quando você seleciona outra cor. As props refletem os dados de um componente a qualquer instante, não apenas num primeiro momento.

Entretanto, as props são [imutáveis](https://pt.wikipedia.org/wiki/Objeto_imut%C3%A1vel)-um termo da ciência da computação o qual significa "inalterável". Quando um componente precisa mudar suas props (por exemplo, em resposta à interação do usuário ou a novos dados), ele terá que "pedir" ao componente pai que passe _props diferentes_- um novo objeto! Suas props antigas serão então deixadas de lado, e eventualmente o motor do JavaScript irá recuperar a memória ocupada por elas.

**Não tente "alterar props".** Quando você precisa responder a interações do usuário (como trocar a cor selecionada), você terá que "definir state", sobre o qual você pode aprender em [State: A Memória de um Componente.](/learn/state-a-components-memory)

<Recap>

* Para passar props, adicione-as à JSX, assim como você faria com atributos HTML.
* Para ler props, use a sintaxe de desestruturação `function Avatar({ person, size })`.
* Você pode especificar um valor padrão como `size = 100`, o qual é usado para props inexistentes ou `undefined`.
* Você pode encaminhar todas as props com a sintaxe de espalhamento JSX `<Avatar {...props} />`, mas não abuse!
* JSX aninhada como `<Card><Avatar /></Card>` aparecerá como a prop `children` do componente `Card`.
* Props podem somente ser lidas e representam um momento específico no tempo: toda renderização recebe uma nova versão de props.
* Você não pode mudar as props. Quando você precisar de interatividade, precisará definir state.

</Recap>



<Challenges>

#### Extraia um componente {/*extract-a-component*/}

Este componente `Gallery` contém marcação bastante similar para os dois perfis. Extraia um componente `Profile` a partir dele para reduzir a duplicação de código. Você precisará escolher quais props passar para ele.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Comece extraindo a marcação para um dos cientistas. Então encontre as partes diferentes no segundo exemplo e torne-as configuráveis via props.

</Hint>

<Solution>

Nesta solução, o componente `Profile` aceita múltiplas props: `imageId` (uma string), `name` (uma string), `profession` (uma string), `awards` (um array de strings), `discovery` (uma string), e `imageSize` (um número).

Note que a prop `imageSize` possui um valor padrão, o qual justifica o por quê de não a passarmos ao componente.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Perceba como você não precisa de uma prop separada `awardCount` se `awards` é um array. Logo, você pode usar `awards.length` para contar o número de prêmios. Lembre-se de que as props podem receber quaisquer valores, e isso também inclui arrays!

Outra solução, a qual é mais parecida com os exemplos anteriores nesta página, é agrupar toda a informação sobre uma pessoa em um único objeto e passá-lo como uma prop:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Mesmo que a sintaxe seja levemente diferente porque você está descrevendo as propriedades de um objeto JavaScript em vez de uma coleção de atributos JSX, esses exemplos são praticamente equivalentes e você pode escolher ambas as abordagens.

</Solution>

#### Ajuste o tamanho da imagem com base em uma prop {/*adjust-the-image-size-based-on-a-prop*/}

Neste exemplo, `Avatar` recebe uma prop numérica `size` a qual determina a largura e a altura da `<img>`. A prop `size` é igual a `40` neste exemplo. No entanto, se você abrir a imagem em uma nova aba, perceberá que ela em si é maior (`160` pixels). O tamanho real da imagem é determinado pelo tamanho da miniatura que você está solicitando.

Altere o componente `Avatar` para solicitar o tamanho mais próximo da imagem com base na prop `size`. Especificamente, se `size` for menor que `90`, passe `'s'` ("small") em vez de `'b'` ("big") à função `getImageUrl`. Verifique se suas mudanças funcionam renderizando avatares com diferentes valores da prop `size` e abrindo as imagens em uma nova aba.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Veja como você poderia fazer isso:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Você também poderia exibir uma imagem mais nítida para telas de altas DPIs levando [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) em consideração:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props permitem encapsular a lógica como esta dentro do componente `Avatar`, (e alterá-la depois caso necessário), para que todos possam usar o componente `<Avatar>` sem pensar sobre como as imagens são solicitadas e redimensionadas.

</Solution>

#### Passando JSX em uma prop `children` {/*passing-jsx-in-a-children-prop*/}

Extraia um componente `Card` da marcação abaixo, e use a prop `children` para passar JSX diferente a ele:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Qualquer JSX que você colocar dentro da tag do componente será passada como prop `children` para o mesmo.

</Hint>

<Solution>

Esta é a maneira que você pode usar o componente `Card` em ambos os lugares:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Você pode também fazer de `title` uma prop separada se quiser que todo `Card` sempre tenha um título:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
