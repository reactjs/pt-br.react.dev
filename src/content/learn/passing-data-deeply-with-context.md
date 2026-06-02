---
title: Passing Data Deeply with Context
---

<Intro>

Normalmente, você passará informações de um componente pai para um componente filho através de props. Mas passar props pode se tornar verboso e inconveniente se você tiver que passá-las por muitos componentes intermediários, ou se muitos componentes em seu aplicativo precisarem das mesmas informações. O *Contexto* permite que o componente pai disponibilize algumas informações para qualquer componente na árvore abaixo dele — não importa quão profunda — sem passá-las explicitamente por props.

</Intro>

<YouWillLearn>

- O que é "prop drilling"
- Como substituir a passagem repetitiva de props por contexto
- Casos de uso comuns para contexto
- Alternativas comuns ao contexto

</YouWillLearn>

## O problema de passar props {/*the-problem-with-passing-props*/}

[Passar props](/learn/passing-props-to-a-component) é uma ótima maneira de direcionar explicitamente dados através da sua árvore de UI para os componentes que os utilizam.

Mas passar props pode se tornar verboso e inconveniente quando você precisa passar uma prop profundamente através da árvore, ou se muitos componentes precisam da mesma prop. O ancestral comum mais próximo pode estar distante dos componentes que precisam dos dados, e [elevar o estado](/learn/sharing-state-between-components) tão alto pode levar a uma situação chamada "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagrama com uma árvore de três componentes. O pai contém uma bolha representando um valor destacado em roxo. O valor flui para cada um dos dois filhos, ambos destacados em roxo." >

Elevar o estado

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagrama com uma árvore de dez nós, cada nó com dois filhos ou menos. O nó raiz contém uma bolha representando um valor destacado em roxo. O valor flui para os dois filhos, cada um passando o valor, mas não o contendo. O filho esquerdo passa o valor para dois filhos que estão destacados em roxo. O filho direito da raiz passa o valor para um de seus dois filhos — o direito, que está destacado em roxo. Esse filho passa o valor para seu único filho, que o passa para seus dois filhos, que estão destacados em roxo.">

Prop drilling

</Diagram>

</DiagramGroup>

Não seria ótimo se houvesse uma maneira de "teletransportar" dados para os componentes na árvore que os precisam sem passar props? Com o recurso de contexto do React, existe!

## Contexto: uma alternativa para passar props {/*context-an-alternative-to-passing-props*/}

O contexto permite que um componente pai forneça dados para toda a árvore abaixo dele. Existem muitos usos para o contexto. Aqui está um exemplo. Considere este componente `Heading` que aceita um `level` para seu tamanho:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Vamos dizer que você quer que vários títulos dentro da mesma `Section` tenham sempre o mesmo tamanho:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Atualmente, você passa a prop `level` para cada `<Heading>` separadamente:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Seria bom se você pudesse passar a prop `level` para o componente `<Section>` em vez disso e removê-la do `<Heading>`. Dessa forma, você poderia garantir que todos os títulos na mesma seção tenham o mesmo tamanho:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Mas como o componente `<Heading>` saberia o nível de sua `<Section>` mais próxima

## Casos de uso para contexto {/*use-cases-for-context*/}

* **Tematização:** Se seu aplicativo permite que o usuário altere sua aparência (por exemplo, modo escuro), você pode colocar um provedor de contexto no topo do seu aplicativo e usá-lo em componentes que precisam ajustar sua aparência visual.
* **Conta atual:** Muitos componentes podem precisar saber qual usuário está logado no momento. Colocá-lo em contexto torna conveniente lê-lo em qualquer lugar da árvore. Alguns aplicativos também permitem que você opere várias contas ao mesmo tempo (por exemplo, para deixar um comentário como um usuário diferente). Nesses casos, pode ser conveniente envolver uma parte da interface do usuário em um provedor aninhado com um valor de conta atual diferente.
* **Roteamento:** A maioria das soluções de roteamento usa contexto internamente para manter a rota atual. É assim que cada link "sabe" se está ativo ou não. Se você construir seu próprio roteador, talvez queira fazer isso também.
* **Gerenciamento de estado:** À medida que seu aplicativo cresce, você pode acabar com muito estado mais próximo do topo do seu aplicativo. Muitos componentes distantes abaixo podem querer alterá-lo. É comum [usar um redutor junto com o contexto](/learn/scaling-up-with-reducer-and-context) para gerenciar estado complexo e passá-lo para componentes distantes sem muito incômodo.

O contexto não se limita a valores estáticos. Se você passar um valor diferente na próxima renderização, o React atualizará todos os componentes que o lerem abaixo! É por isso que o contexto é frequentemente usado em combinação com o estado.

Em geral, se alguma informação for necessária por componentes distantes em diferentes partes da árvore, é uma boa indicação de que o contexto o ajudará.

<Recap>

* O contexto permite que um componente forneça algumas informações para toda a árvore abaixo dele.
* Para passar contexto:
  1. Crie e exporte-o com `export const MeuContexto = createContext(valorPadrao)`.
  2. Passe-o para o Hook `useContext(MeuContexto)` para lê-lo em qualquer componente filho, não importa quão profundo.
  3. Envolva os filhos em `<MeuContexto valor={...}>` para fornecê-lo a partir de um pai.
* O contexto passa por quaisquer componentes no meio.
* O contexto permite que você escreva componentes que "se adaptam ao seu entorno".
* Antes de usar o contexto, tente passar props ou passar JSX como `children`.

</Recap>

<Challenges>

#### Substituir prop drilling por contexto {/*replace-prop-drilling-with-context*/}

Neste exemplo, alternar a caixa de seleção altera a prop `imageSize` passada para cada `<PlaceImage>`. O estado da caixa de seleção é mantido no componente `App` de nível superior, mas cada `<PlaceImage>` precisa estar ciente disso.

Atualmente, `App` passa `imageSize` para `List`, que o passa para cada `Place`, que o passa para `PlaceImage`. Remova a prop `imageSize` e, em vez disso, passe-a do componente `App` diretamente para `PlaceImage`.

Você pode declarar o contexto em `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Usar imagens grandes
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap em Cidade do Cabo, África do Sul',
  description: 'A tradição de escolher cores vibrantes para as casas começou no final do século XX.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village em Taichung, Taiwan',
  description: 'Para salvar as casas da demolição, Huang Yung-Fu, um morador local, pintou todas as 1.200 em 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, México',
  description: 'Um dos maiores murais do mundo cobrindo casas em um bairro na encosta.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Escadaria Selarón no Rio de Janeiro, Brasil',
  description: 'Este marco foi criado por Jorge Selarón, um artista nascido no Chile, como uma "homenagem ao povo brasileiro".',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Itália',
  description: 'As casas são pintadas seguindo um sistema de cores específico que remonta ao século XVI.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marrocos',
  description: 'Existem algumas teorias sobre por que as casas são pintadas de azul, incluindo que a cor repele mosquitos ou que simboliza o céu.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village em Busan, Coreia do Sul',
  description: 'Em 2009, a vila foi convertida em um centro cultural pintando as casas e apresentando exposições e instalações de arte.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

<Solution>

Remova a prop `imageSize` de todos os componentes.

Crie e exporte `ImageSizeContext` de `Context.js`. Em seguida, envolva `List` em `<ImageSizeContext value={imageSize}>` para passar o valor para baixo e use `useContext(ImageSizeContext)` para lê-lo em `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Usar imagens grandes
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap em Cidade do Cabo, África do Sul',
  description: 'A tradição de escolher cores vibrantes para as casas começou no final do século XX.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village em Taichung, Taiwan',
  description: 'Para salvar as casas da demolição, Huang Yung-Fu, um morador local, pintou todas as 1.200 em 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, México',
  description: 'Um dos maiores murais do mundo cobrindo casas em um bairro na encosta.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Escadaria Selarón no Rio de Janeiro, Brasil',
  description: 'Este marco foi criado por Jorge Selarón, um artista nascido no Chile, como uma "homenagem ao povo brasileiro".',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Itália',
  description: 'As casas são pintadas seguindo um sistema de cores específico que remonta ao século XVI.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marrocos',
  description: 'Existem algumas teorias sobre por que as casas são pintadas de azul, incluindo que a cor repele mosquitos ou que simboliza o céu.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village em Busan, Coreia do Sul',
  description: 'Em 2009, a vila foi convertida em um centro cultural pintando as casas e apresentando exposições e instalações de arte.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

Note como os componentes no meio não precisam mais passar `imageSize`.

</Solution>

</Challenges>