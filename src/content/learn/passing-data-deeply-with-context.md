---
title: Passando Dados Profundamente com Contexto
---

<Intro>

Normalmente, você passará informações de um componente pai para um componente filho via props. No entanto, passar props pode se tornar verboso e inconveniente se você precisar passá-las por muitos componentes intermediários, ou se muitos componentes em sua aplicação precisarem da mesma informação. *Contexto* permite que o componente pai torne algumas informações disponíveis para qualquer componente na árvore abaixo dele—não importa quão profundo—sem passar explicitamente através de props.

</Intro>

<YouWillLearn>

- O que é "prop drilling"
- Como substituir a passagem repetitiva de props por contexto
- Casos de uso comuns para contexto
- Alternativas comuns ao contexto

</YouWillLearn>

## O problema com a passagem de props {/*the-problem-with-passing-props*/}

[Passar props](/learn/passing-props-to-a-component) é uma ótima maneira de canalizar explicitamente dados através da sua árvore de UI para os componentes que os utilizam.

Mas passar props pode se tornar verboso e inconveniente quando você precisa passar alguma prop profundamente pela árvore, ou se muitos componentes precisam da mesma prop. O ancestral comum mais próximo pode estar longe dos componentes que precisam dos dados, e [elevar o estado](/learn/sharing-state-between-components) tão alto pode levar a uma situação chamada "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagrama com uma árvore de três componentes. O pai contém uma bolha representando um valor destacado em roxo. O valor flui para cada um dos dois filhos, ambos destacados em roxo." >

Elevando o estado

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagrama com uma árvore de dez nós, cada nó com dois filhos ou menos. O nó raiz contém uma bolha representando um valor destacado em roxo. O valor flui através dos dois filhos, cada um dos quais passa o valor, mas não o contém. O filho esquerdo passa o valor para dois filhos, ambos destacados em roxo. O filho direito do raiz passa o valor para um de seus dois filhos - o da direita, que está destacado em roxo. Esse filho passou o valor para seu único filho, que o passa para ambos os seus dois filhos, que estão destacados em roxo.">

Prop drilling

</Diagram>

</DiagramGroup>

Não seria ótimo se houvesse uma maneira de "teleportar" dados para os componentes na árvore que precisam dele sem passar props? Com o recurso de contexto do React, há!

## Contexto: uma alternativa à passagem de props {/*context-an-alternative-to-passing-props*/}

O contexto permite que um componente pai forneça dados para toda a árvore abaixo dele. Existem muitos usos para o contexto. Aqui está um exemplo. Considere este componente `Heading` que aceita um `level` para seu tamanho:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Heading level={2}>Cabeçalho</Heading>
      <Heading level={3}>Sub-cabeçalho</Heading>
      <Heading level={4}>Sub-sub-cabeçalho</Heading>
      <Heading level={5}>Sub-sub-sub-cabeçalho</Heading>
      <Heading level={6}>Sub-sub-sub-sub-cabeçalho</Heading>
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
      throw Error('Nível desconhecido: ' + level);
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

Vamos supor que você queira que múltiplos cabeçalhos dentro da mesma `Section` tenham sempre o mesmo tamanho:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Section>
        <Heading level={2}>Cabeçalho</Heading>
        <Heading level={2}>Cabeçalho</Heading>
        <Heading level={2}>Cabeçalho</Heading>
        <Section>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Section>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
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
      throw Error('Nível desconhecido: ' + level);
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
  <Heading level={3}>Sobre</Heading>
  <Heading level={3}>Fotos</Heading>
  <Heading level={3}>Vídeos</Heading>
</Section>
```

Seria bom se você pudesse passar a prop `level` para o componente `<Section>` em vez de removê-la do `<Heading>`. Dessa forma, você poderia garantir que todos os cabeçalhos na mesma seção tenham o mesmo tamanho:

```js
<Section level={3}>
  <Heading>Sobre</Heading>
  <Heading>Fotos</Heading>
  <Heading>Vídeos</Heading>
</Section>
```

Mas como o componente `<Heading>` saberá o nível de sua `<Section>` mais próxima? **Isso exigiria alguma forma de a criança "perguntar" dados a partir de algum lugar acima na árvore.**

Você não pode fazer isso apenas com props. É aqui que o contexto entra em cena. Você fará isso em três etapas:

1. **Criar** um contexto. (Você pode chamá-lo de `LevelContext`, já que se refere ao nível de cabeçalho.)
2. **Usar** esse contexto a partir do componente que precisa dos dados. (`Heading` usará `LevelContext`.)
3. **Fornecer** esse contexto a partir do componente que especifica os dados. (`Section` fornecerá `LevelContext`.)

O contexto permite que um pai—mesmo um distante!—forneça alguns dados para toda a árvore dentro dele.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagrama com uma árvore de três componentes. O pai contém uma bolha representando um valor destacado em laranja, que se projeta para baixo para os dois filhos, cada um destacado em laranja." >

Usando contexto em filhos próximos

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagrama com uma árvore de dez nós, cada nó com dois filhos ou menos. O nó pai raiz contém uma bolha representando um valor destacado em laranja. O valor se projeta diretamente para quatro folhas e um componente intermediário na árvore, que estão todos destacados em laranja. Nenhum dos outros componentes intermediários está destacado.">

Usando contexto em filhos distantes

</Diagram>

</DiagramGroup>

### Etapa 1: Criar o contexto {/*step-1-create-the-context*/}

Primeiro, você precisa criar o contexto. Você precisará **exportá-lo de um arquivo** para que seus componentes possam usá-lo:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Título</Heading>
      <Section>
        <Heading level={2}>Cabeçalho</Heading>
        <Heading level={2}>Cabeçalho</Heading>
        <Heading level={2}>Cabeçalho</Heading>
        <Section>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Heading level={3}>Sub-cabeçalho</Heading>
          <Section>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
            <Heading level={4}>Sub-sub-cabeçalho</Heading>
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
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

O único argumento para `createContext` é o _valor padrão_. Aqui, `1` refere-se ao maior nível de cabeçalho, mas você poderia passar qualquer tipo de valor (até mesmo um objeto). Você verá a importância do valor padrão na próxima etapa.

### Etapa 2: Usar o contexto {/*step-2-use-the-context*/}

Importe o Hook `useContext` do React e seu contexto:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Atualmente, o componente `Heading` lê `level` a partir de props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Em vez disso, remova a prop `level` e leia o valor do contexto que você acabou de importar, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` é um Hook. Assim como `useState` e `useReducer`, você só pode chamar um Hook imediatamente dentro de um componente React (não dentro de loops ou condições). **`useContext` informa ao React que o componente `Heading` deseja ler o `LevelContext`.**

Agora que o componente `Heading` não possui uma prop `level`, você não precisa mais passar a prop de nível para `Heading` em seu JSX assim:

```js
<Section>
  <Heading level={4}>Sub-sub-cabeçalho</Heading>
  <Heading level={4}>Sub-sub-cabeçalho</Heading>
  <Heading level={4}>Sub-sub-cabeçalho</Heading>
</Section>
```

Atualize o JSX para que seja a `Section` que receba isso em vez:

```jsx
<Section level={4}>
  <Heading>Sub-sub-cabeçalho</Heading>
  <Heading>Sub-sub-cabeçalho</Heading>
  <Heading>Sub-sub-cabeçalho</Heading>
</Section>
```

Como lembrete, esta é a marcação que você estava tentando fazer funcionar:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Título</Heading>
      <Section level={2}>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Section level={3}>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Section level={4}>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
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
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
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
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

Observe que este exemplo ainda não funciona direito! Todos os cabeçalhos têm o mesmo tamanho porque **mesmo que você *use* o contexto, você ainda não o *forneceu*.** O React não sabe de onde obtê-lo!

Se você não fornecer o contexto, o React usará o valor padrão que você especificou na etapa anterior. Neste exemplo, você especificou `1` como argumento para `createContext`, então `useContext(LevelContext)` retorna `1`, definindo todos esses cabeçalhos como `<h1>`. Vamos corrigir esse problema fazendo com que cada `Section` forneça seu próprio contexto.

### Etapa 3: Fornecer o contexto {/*step-3-provide-the-context*/}

O componente `Section` atualmente renderiza seus filhos:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Envolva-os com um provedor de contexto** para fornecer o `LevelContext` a eles:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Isso informa ao React: "se algum componente dentro deste `<Section>` perguntar por `LevelContext`, dê a ele este `level`." O componente usará o valor do mais próximo `<LevelContext.Provider>` na árvore de UI acima dele.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Título</Heading>
      <Section level={2}>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Section level={3}>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Section level={4}>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
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
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

É o mesmo resultado que o código original, mas você não precisou passar a prop `level` para cada componente `Heading`! Em vez disso, ele "descobre" seu nível de cabeçalho perguntando o valor mais próximo de `Section` acima:

1. Você passa uma prop `level` para o `<Section>`.
2. `Section` envolve seus filhos dentro do `<LevelContext.Provider value={level}>`.
3. `Heading` pergunta pelo valor mais próximo de `LevelContext` acima com `useContext(LevelContext)`.

## Usando e fornecendo contexto do mesmo componente {/*using-and-providing-context-from-the-same-component*/}

Atualmente, você ainda precisa especificar o `level` de cada seção manualmente:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Como o contexto permite que você leia informações de um componente acima, cada `Section` poderia ler o `level` da `Section` acima e passar `level + 1` automaticamente. Aqui está como você poderia fazer isso:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Com essa mudança, você não precisa passar a prop `level` *nem* para o `<Section>` *nem* para o `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Título</Heading>
      <Section>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Heading>Cabeçalho</Heading>
        <Section>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Heading>Sub-cabeçalho</Heading>
          <Section>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
            <Heading>Sub-sub-cabeçalho</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Cabeçalho deve estar dentro de uma Seção!');
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
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
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

Agora tanto `Heading` quanto `Section` leem o `LevelContext` para descobrir quão "profundos" estão. E o `Section` envolve seus filhos dentro do `LevelContext` para especificar que qualquer coisa dentro dele está em um "nível" mais profundo.

<Note>

Este exemplo usa níveis de cabeçalho porque eles mostram visualmente como componentes aninhados podem sobrescrever o contexto. Mas o contexto é útil para muitos outros casos de uso também. Você pode passar qualquer informação necessária por toda a subárvore: o tema de cor atual, o usuário atualmente logado, e assim por diante.

</Note>

## O contexto passa através de componentes intermediários {/*context-passes-through-intermediate-components*/}

Você pode inserir quantos componentes quiser entre o componente que fornece contexto e aquele que o utiliza. Isso inclui tanto componentes embutidos como `<div>` quanto componentes que você possa construir.

Neste exemplo, o mesmo componente `Post` (com uma borda tracejada) é renderizado em dois níveis de aninhamento diferentes. Note que o `<Heading>` dentro dele obtém seu nível automaticamente do mais próximo `<Section>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Meu Perfil</Heading>
      <Post
        title="Olá viajante!"
        body="Leia sobre minhas aventuras."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Posts Recentes</Heading>
      <Post
        title="Sabores de Lisboa"
        body="...aqueles pastéis de nata!"
      />
      <Post
        title="Buenos Aires ao ritmo do tango"
        body="Eu amei!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Cabeçalho deve estar dentro de uma Seção!');
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
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Você não fez nada de especial para que isso funcionasse. Um `Section` especifica o contexto para a árvore dentro dele, então você pode inserir um `<Heading>` em qualquer lugar, e ele terá o tamanho correto. Tente isso no sandbox acima!

**O contexto permite que você escreva componentes que "se adaptam ao seu entorno" e se exibam de forma diferente dependendo de _onde_ (ou, em outras palavras, _em qual contexto_) estão sendo renderizados.**

Como o contexto funciona pode lembrá-lo da [herança de propriedades CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) No CSS, você pode especificar `color: blue` para um `<div>`, e qualquer nó DOM dentro dele, não importa quão profundo, herdará essa cor a menos que algum outro nó DOM no meio sobrescreva com `color: green`. Da mesma forma, no React, a única maneira de sobrescrever algum contexto que vem de cima é envolver os filhos em um provedor de contexto com um valor diferente.

Em CSS, diferentes propriedades como `color` e `background-color` não se sobrescrevem. Você pode definir todas as `<div>`'s `color` como vermelho sem impactar `background-color`. Da mesma forma, **diferentes contextos React não se sobrescrevem.** Cada contexto que você cria com `createContext()` é completamente separado de outros, e conecta componentes que usam e fornecem *aquele contexto em particular*. Um componente pode usar ou fornecer muitos contextos diferentes sem problemas.

## Antes de usar contexto {/*before-you-use-context*/}

O contexto é muito tentador de usar! No entanto, isso também significa que é fácil demais usá-lo em excesso. **Só porque você precisa passar algumas props várias camadas abaixo não significa que você deve colocar essa informação no contexto.**

Aqui estão algumas alternativas que você deve considerar antes de usar contexto:

1. **Comece passando [props.](/learn/passing-props-to-a-component)** Se seus componentes não são triviais, não é incomum passar uma dúzia de props por uma dúzia de componentes. Pode parecer cansativo, mas torna muito claro quais componentes usam quais dados! A pessoa que mantiver seu código ficará feliz que você tornou o fluxo de dados explícito com props.
2. **Extraia componentes e [passe JSX como `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) para eles.** Se você passar alguns dados por muitas camadas de componentes intermediários que não usam esses dados (e apenas os passam adiante), isso muitas vezes significa que você esqueceu de extrair alguns componentes ao longo do caminho. Por exemplo, talvez você passe props de dados como `posts` para componentes visuais que não os usam diretamente, como `<Layout posts={posts} />`. Em vez disso, faça com que `Layout` receba `children` como prop, e renderize `<Layout><Posts posts={posts} /></Layout>`. Isso reduz o número de camadas entre o componente que especifica os dados e o que precisa deles.

Se nenhuma dessas abordagens funcionar bem para você, considere o contexto.

## Casos de uso para contexto {/*use-cases-for-context*/}

* **Tematização:** Se seu aplicativo permitir que o usuário mude sua aparência (por exemplo, modo escuro), você pode colocar um provedor de contexto no topo do seu aplicativo e usar esse contexto em componentes que precisam ajustar sua aparência visual.
* **Conta atual:** Muitos componentes podem precisar saber quem é o usuário atualmente logado. Colocá-lo em contexto torna conveniente lê-lo em qualquer lugar na árvore. Alguns aplicativos também permitem que você opere várias contas ao mesmo tempo (por exemplo, para deixar um comentário como um usuário diferente). Nesses casos, pode ser conveniente envolver uma parte da UI em um provedor aninhado com um valor atual de conta diferente.
* **Roteamento:** A maioria das soluções de roteamento usa internamente o contexto para manter a rota atual. É assim que cada link "sabe" se está ativo ou não. Se você construir seu próprio roteador, pode querer fazer o mesmo.
* **Gerenciamento de estado:** À medida que seu aplicativo cresce, você pode acabar com muitos estados mais perto do topo do seu aplicativo. Muitos componentes distantes abaixo podem querer mudá-lo. É comum [usar um redutor junto com contexto](/learn/scaling-up-with-reducer-and-context) para gerenciar estados complexos e passá-los para componentes distantes sem muitos problemas.

O contexto não se limita a valores estáticos. Se você passar um valor diferente na próxima renderização, o React atualizará todos os componentes que o estão lendo abaixo! É por isso que o contexto é frequentemente usado em combinação com estado.

Em geral, se algumas informações são necessárias por componentes distantes em diferentes partes da árvore, é um bom indicativo de que o contexto ajudará você.

<Recap>

* O contexto permite que um componente forneça algumas informações para toda a árvore abaixo dele.
* Para passar contexto:
  1. Crie e exporte com `export const MyContext = createContext(defaultValue)`.
  2. Passe para o Hook `useContext(MyContext)` para lê-lo em qualquer componente filho, não importa quão profundo.
  3. Envolva os filhos dentro de `<MyContext.Provider value={...}>` para fornecer a partir de um pai.
* O contexto passa através de quaisquer componentes no meio.
* O contexto permite que você escreva componentes que "se adaptam ao seu entorno".
* Antes de usar contexto, tente passar props ou passar JSX como `children`.

</Recap>

<Challenges>

#### Substitua o prop drilling por contexto {/*replace-prop-drilling-with-context*/}

Neste exemplo, alternar a caixa de seleção muda a prop `imageSize` passada para cada `<PlaceImage>`. O estado da caixa de seleção é mantido no componente topo `App`, mas cada `<PlaceImage>` precisa estar ciente disso.

Atualmente, `App` passa `imageSize` para `List`, que passa para cada `Place`, que passa para o `PlaceImage`. Remova a prop `imageSize` e, em vez disso, passe-a do componente `App` diretamente ao `PlaceImage`.

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
  name: 'Bo-Kaap em Cape Town, África do Sul',
  description: 'A tradição de escolher cores brilhantes para as casas começou no final do século 20.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village em Taichung, Taiwan',
  description: 'Para salvar as casas da demolição, Huang Yung-Fu, um residente local, pintou todas as 1.200 delas em 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, México',
  description: 'Um dos maiores murais do mundo cobrindo casas em um bairro na colina.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Escadaria Selarón no Rio de Janeiro, Brasil',
  description: 'Este marco foi criado por Jorge Selarón, um artista nascido no Chile, como um "tributo ao povo brasileiro."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Itália',
  description: 'As casas são pintadas seguindo um sistema de cores específico que remonta ao século 16.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marrocos',
  description: 'Existem algumas teorias sobre por que as casas são pintadas de azul, incluindo que a cor repele mosquitos ou que simboliza o céu e o paraíso.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village em Busan, Coreia do Sul',
  description: 'Em 2009, a vila foi convertida em um centro cultural pintando as casas e apresentando exposições e instalações artísticas.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
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

Crie e exporte `ImageSizeContext` de `Context.js`. Depois, envolva o List em `<ImageSizeContext.Provider value={imageSize}>` para passar o valor para baixo, e `useContext(ImageSizeContext)` para lê-lo no `PlaceImage`:

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
    <ImageSizeContext.Provider
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
    </ImageSizeContext.Provider>
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
  name: 'Bo-Kaap em Cape Town, África do Sul',
  description: 'A tradição de escolher cores brilhantes para as casas começou no final do século 20.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village em Taichung, Taiwan',
  description: 'Para salvar as casas da demolição, Huang Yung-Fu, um residente local, pintou todas as 1.200 delas em 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, México',
  description: 'Um dos maiores murais do mundo cobrindo casas em um bairro na colina.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Escadaria Selarón no Rio de Janeiro, Brasil',
  description: 'Este marco foi criado por Jorge Selarón, um artista nascido no Chile, como um "tributo ao povo brasileiro".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Itália',
  description: 'As casas são pintadas seguindo um sistema de cores específico que remonta ao século 16.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marrocos',
  description: 'Existem algumas teorias sobre por que as casas são pintadas de azul, incluindo que a cor repele mosquitos ou que simboliza o céu e o paraíso.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village em Busan, Coreia do Sul',
  description: 'Em 2009, a vila foi convertida em um centro cultural pintando as casas e apresentando exposições e instalações artísticas.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
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

Note que os componentes intermediários não precisam passar `imageSize` mais.

</Solution>

</Challenges>