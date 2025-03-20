---
title: Passando dados profundamente com Context
---

<Intro>

Usualmente, você irá passar informações de um componente pai para um componente filho através de `props`. Mas passar `props` pode se tornar verboso e inconveniente se você tiver que passá-los por muitos componentes no meio, ou se muitos componentes em seu app precisarem da mesma informação. *Context* permite que o componente pai disponibilize algumas informações para qualquer componente na árvore abaixo dele — não importa quão profundo — sem passá-lo explicitamente via `props`.

</Intro>

<YouWillLearn>

- O que é "prop drilling"
- Como substituir a passagem de `props` repetitiva com context
- Casos de uso comuns para context
- Alternativas comuns para context

</YouWillLearn>

## O problema com a passagem de props {/*the-problem-with-passing-props*/}

[Passar props](/learn/passing-props-to-a-component) é uma ótima maneira de direcionar explicitamente os dados através da sua árvore de UI para os componentes que a usam.

Mas passar `props` pode se tornar verboso e inconveniente quando você precisa passar alguma `prop` profundamente através da árvore, ou se muitos componentes precisam da mesma `prop`. O ancestral comum mais próximo pode estar muito distante dos componentes que precisam de dados, e [elevar o estado](/learn/sharing-state-between-components) tão alto pode levar a uma situação chamada "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagrama com uma árvore de três componentes. O pai contém uma bolha representando um valor destacado em roxo. O valor flui para baixo para cada um dos dois filhos, ambos destacados em roxo." >

Elevando o estado

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagrama com uma árvore de dez nós, cada nó com dois filhos ou menos. O nó raiz contém uma bolha representando um valor destacado em roxo. O valor flui para baixo através dos dois filhos, cada um dos quais passa o valor, mas não o contém. O filho esquerdo passa o valor para baixo para dois filhos, que são destacados em roxo. O filho direito da raiz passa o valor para um de seus dois filhos - o direito, que é destacado em roxo. Esse filho passa o valor por seu único filho, que o passa para baixo para ambos os seus dois filhos, que são destacados em roxo.">

Prop drilling

</Diagram>

</DiagramGroup>

Não seria ótimo se houvesse uma maneira de "teletransportar" dados para os componentes na árvore que precisam deles sem passar props? Com o recurso de context do React, existe!

## Context: uma alternativa à passagem de props {/*context-an-alternative-to-passing-props*/}

O context permite que um componente pai forneça dados para toda a árvore abaixo dele. Existem muitos usos para context. Aqui está um exemplo. Considere este componente `Heading` que aceita uma `level` para seu tamanho:

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

Digamos que você queira que múltiplos títulos dentro da mesma `Section` sempre tenham o mesmo tamanho:

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
      return <h5>{children}</h1>;
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

Atualmente, você passa a `prop` `level` para cada `<Heading>` separadamente:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Seria bom se você pudesse passar a `prop` `level` para o componente `<Section>` em vez disso e removê-la do `<Heading>`. Desta forma, você poderia garantir que todos os títulos na mesma seção tenham o mesmo tamanho:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Mas como o componente `<Heading>` pode saber o nível de seu `<Section>` mais próximo? **Isso exigiria alguma forma de um filho "pedir" dados de algum lugar acima na árvore.**

Você não pode fazer isso apenas com `props`. É aí que o context entra em jogo. Você fará isso em três etapas:

1. **Crie** um context. (Você pode chamá-lo de `LevelContext`, já que é para o nível do título.)
2. **Use** esse context do componente que precisa dos dados. (`Heading` usará `LevelContext`.)
3. **Forneça** esse context do componente que especifica os dados. (`Section` fornecerá `LevelContext`.)

O context permite que um pai — mesmo um distante! — forneça alguns dados para toda a árvore dentro dele.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagrama com uma árvore de três componentes. O pai contém uma bolha representando um valor destacado em laranja, que se projeta para os dois filhos, cada um destacado em laranja." >

Usando context em filhos próximos

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagrama com uma árvore de dez nós, cada nó com dois filhos ou menos. O nó pai raiz contém uma bolha representando um valor destacado em laranja. O valor se projeta diretamente para quatro leaves e um componente intermediário na árvore, que são todos destacados em laranja. Nenhum dos outros componentes intermediários é destacado.">

Usando context em filhos distantes

</Diagram>

</DiagramGroup>

### Etapa 1: Crie o context {/*step-1-create-the-context*/}

Primeiro, você precisa criar o context. Você vai precisar **exportá-lo de um arquivo** para que seus componentes possam usá-lo:

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

O único argumento para `createContext` é o valor _padrão_. Aqui, `1` se refere ao maior nível de título, mas você pode passar qualquer tipo de valor (até mesmo um objeto). Você verá a importância do valor padrão na próxima etapa.

### Etapa 2: Use o context {/*step-2-use-the-context*/}

Importe o Hook `useContext` do React e seu context:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Atualmente, o componente `Heading` lê `level` das `props`:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Em vez disso, remova a `prop` `level` e leia o valor do context que você acabou de importar, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` é um Hook. Assim como `useState` e `useReducer`, você só pode chamar um Hook imediatamente dentro de um componente React (não dentro de loops ou condições). **`useContext` diz ao React que o componente `Heading` quer ler o `LevelContext`.**

Agora que o componente `Heading` não tem uma `prop` `level`, você não precisará mais passar a `prop` level para `Heading` no seu JSX como este:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Atualize o JSX para que seja a `Section` que o recebe em vez disso:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Como um lembrete, esta é a marcação que você estava tentando fazer funcionar:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
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
      return <h2>{children}</h1>;
    case 3:
      return <h3>{children}</h1>;
    case 4:
      return <h4>{children}</h1>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
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

Observe que este exemplo ainda não funciona! Todos os títulos têm o mesmo tamanho porque **embora você esteja *usando* o context, você ainda não o *forneceu*.** React não sabe onde obtê-lo!

Se você não fornecer o context, o React usará o valor padrão que você especificou na etapa anterior. Neste exemplo, você especificou `1` como o argumento para `createContext`, então `useContext(LevelContext)` retorna `1`, definindo todos esses títulos para `<h1>`. Vamos corrigir esse problema fazendo com que cada `Section` forneça seu próprio context.

### Etapa 3: Forneça o context {/*step-3-provide-the-context*/}

O componente `Section` renderiza atualmente seus filhos:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Envolva-os com um provedor de context** para fornecer o `LevelContext` a eles:

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

Isso diz ao React: "se algum componente dentro desta `<Section>` solicitar `LevelContext`, dê a ele este `level`." O componente usará o valor do `<LevelContext.Provider>` mais próximo na árvore de UI acima dele.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
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
      return <h2>{children}</h1>;
    case 3:
      return <h3>{children}</h1>;
    case 4:
      return <h4>{children}</h1>;
    case 5:
      return <h5>{children}</h1>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
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

É o mesmo resultado do código original, mas você não precisou passar a `prop` `level` para cada componente `Heading`! Em vez disso, ele "descobre" seu nível de título perguntando ao `Section` mais próximo acima:

1. Você passa uma `prop` `level` para o `<Section>`.
2. `Section` envolve seus filhos em `<LevelContext.Provider value={level}>`.
3. `Heading` pergunta o valor mais próximo de `LevelContext` acima com `useContext(LevelContext)`.

## Usando e fornecendo context do mesmo componente {/*using-and-providing-context-from-the-same-component*/}

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

Como o context permite que você leia informações de um componente acima, cada `Section` pode ler o `level` da `Section` acima e passar `level + 1` automaticamente. Veja como você pode fazer isso:

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
```Com essa mudança, você não precisa passar a prop `level` *nem* para o `<Section>` nem para o `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
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
      throw Error('Heading must be inside a Section!');
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

Agora, tanto `Heading` quanto `Section` leem o `LevelContext` para descobrir quão "profundos" eles são. E o `Section` envolve seus filhos no `LevelContext` para especificar que tudo dentro dele está em um nível mais "profundo".

<Note>

Este exemplo usa níveis de título porque eles mostram visualmente como os componentes aninhados podem substituir o contexto. Mas o contexto é útil para muitos outros casos de uso também. Você pode passar qualquer informação necessária por toda a subárvore: o tema de cor atual, o usuário atualmente logado e assim por diante.

</Note>

## O contexto passa por componentes intermediários {/*context-passes-through-intermediate-components*/}

Você pode inserir quantos componentes quiser entre o componente que fornece o contexto e aquele que o usa. Isso inclui componentes *built-in* como `<div>` e componentes que você pode criar sozinho.

Neste exemplo, o mesmo componente `Post` (com uma borda tracejada) é renderizado em dois níveis diferentes de aninhamento. Observe que o `<Heading>` dentro dele obtém seu nível automaticamente do `<Section>` mais próximo:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
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
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
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
      throw Error('Heading must be inside a Section!');
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

Você não fez nada de especial para isso funcionar. Um `Section` especifica o contexto para a árvore dentro dele, então você pode inserir um `<Heading>` em qualquer lugar, e ele terá o tamanho correto. Experimente na caixa de testes acima!

**O contexto permite que você escreva componentes que "se adaptam ao seu entorno" e se exibem de forma diferente dependendo de _onde_ (ou, em outras palavras, _em qual contexto_) eles estão sendo renderizados.**

Como o contexto funciona pode lembrar você da [herança de propriedades CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) Em CSS, você pode especificar `color: blue` para uma `<div>`, e qualquer nó DOM dentro dela, não importa o quão profundo, herdará essa cor, a menos que outro nó DOM no meio a substitua por `color: green`. Da mesma forma, no React, a única maneira de substituir algum contexto que vem de cima é envolver filhos em um provedor de contexto com um valor diferente.

Em CSS, diferentes propriedades como `color` e `background-color` não substituem uma à outra. Você pode definir a `color` de todos os `<div>` para vermelho sem impactar o  `background-color`. Da mesma forma, **diferentes contextos React não se substituem entre si.** Cada contexto que você faz com `createContext()` é completamente separado de outros, e une componentes usando e fornecendo *aquele particular* contexto. Um componente pode usar ou fornecer muitos contextos diferentes sem problemas.

## Antes de usar o contexto {/*before-you-use-context*/}

O contexto é muito tentador de usar! No entanto, isso também significa que é muito fácil de usar em excesso. **Só porque você precisa passar algumas props em vários níveis de profundidade não significa que você deve colocar essa informação no contexto.**

Aqui estão algumas alternativas que você deve considerar antes de usar o contexto:

1. **Comece [passando props.](/learn/passing-props-to-a-component)** Se seus componentes não forem triviais, não é incomum passar uma dúzia de props por uma dúzia de componentes. Pode parecer trabalhoso, mas deixa muito claro quais componentes usam quais dados! A pessoa que mantém seu código ficará feliz que você tornou o fluxo de dados explícito com props.
2. **Extraia componentes e [passe JSX como `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) para eles.** Se você passar alguns dados por muitas camadas de componentes intermediários que não usam esses dados (e só os passa mais adiante), isso geralmente significa que você se esqueceu de extrair alguns componentes ao longo do caminho. Por exemplo, talvez você passe props de dados como `posts` para componentes visuais que não as usam diretamente, como `<Layout posts={posts} />`. Em vez disso, faça com que o `Layout` receba `children` como uma prop, e renderize `<Layout><Posts posts={posts} /></Layout>`. Isso reduz o número de camadas entre o componente que especifica os dados e aquele que precisa deles.

Se nenhuma dessas abordagens funcionar bem para você, considere usar contexto.

## Casos de uso para contexto {/*use-cases-for-context*/}

* **Tematização:** Se seu aplicativo permite que o usuário altere sua aparência (por exemplo, modo escuro), você pode colocar um provedor de contexto na raiz do seu aplicativo e usar esse contexto em componentes que precisam ajustar sua aparência visual.
* **Conta atual:** Muitos componentes podem precisar saber o usuário atualmente logado. Colocá-lo em contexto torna conveniente lê-lo em qualquer lugar na árvore. Alguns aplicativos também permitem que você opere várias contas ao mesmo tempo (por exemplo, para deixar um comentário como um usuário diferente). Nesses casos, pode ser conveniente envolver uma parte da UI em um provedor aninhado com um valor de conta atual diferente.
* **Roteamento:** A maioria das soluções de roteamento usa contexto internamente para manter a rota atual. É assim que cada link "sabe" se está ativo ou não. Se você criar seu próprio roteador, talvez queira fazer isso também.
* **Gerenciamento de estado:** À medida que seu aplicativo cresce, você pode acabar com muito estado mais próximo do topo do seu aplicativo. Muitos componentes distantes abaixo podem querer alterá-lo. É comum [usar um redutor (reducer) junto com o contexto](/learn/scaling-up-with-reducer-and-context) para gerenciar o estado complexo e passá-lo para componentes distantes sem muita dificuldade.
  
O contexto não se limita a valores estáticos. Se você passar um valor diferente na próxima renderização, o React atualizará todos os componentes que o leem abaixo! É por isso que o contexto é frequentemente usado em combinação com o estado.

Em geral, se algumas informações são necessárias por componentes distantes em diferentes partes da árvore, é uma boa indicação de que o contexto o ajudará.

<Recap>

* O contexto permite que um componente forneça algumas informações para toda a árvore abaixo dele.
* Para passar o contexto:
  1. Crie e exporte-o com `export const MyContext = createContext(defaultValue)`.
  2. Passe-o para o Hook `useContext(MyContext)` para lê-lo em qualquer componente filho, não importa o quão profundo.
  3. Envolva os filhos em `<MyContext.Provider value={...}>` para fornecê-lo de um pai.
* O contexto passa por quaisquer componentes no meio.
* O contexto permite que você escreva componentes que "se adaptam ao seu entorno".
* Antes de usar o contexto, tente passar props ou passar JSX como `children`.

</Recap>

<Challenges>

#### Substitua o prop drilling com contexto {/*replace-prop-drilling-with-context*/}

Neste exemplo, alternar a caixa de seleção altera a prop `imageSize` passada para cada `<PlaceImage>`. O estado da caixa de seleção é mantido no componente `App` de nível superior, mas cada `<PlaceImage>` precisa estar ciente dele.

Atualmente, o `App` passa `imageSize` para `List`, que o passa para cada `Place`, que o passa para o `PlaceImage`. Remova a prop `imageSize` e, em vez disso, passe-a do componente `App` diretamente para `PlaceImage`.

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
        Use large images
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
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
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

Crie e exporte `ImageSizeContext` do `Context.js`. Em seguida, envolva a Lista em `<ImageSizeContext.Provider value={imageSize}>` para passar o valor para baixo e  `useContext(ImageSizeContext)` para lê-lo no `PlaceImage`:

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
        Use large images
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
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
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

Observe como os componentes intermediários não precisam mais passar o `imageSize`.

</Solution>

</Challenges>
