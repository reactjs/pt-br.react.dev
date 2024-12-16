---
title: Atualizando Objetos no State
---

<Intro>

O state pode conter qualquer tipo de valor JavaScript, inclusive objetos. Mas você não deve alterar diretamente os objetos que mantém no state do React. Em vez disso, quando quiser atualizar um objeto, você precisa criar um novo (ou fazer uma cópia de um existente) e, em seguida, definir o state para usar essa cópia.

</Intro>

<YouWillLearn>

- Como atualizar corretamente um objeto no state do React
- Como atualizar um objeto aninhado sem mutá-lo
- O que é imutabilidade e como não quebrá-la
- Como tornar a cópia de objetos menos repetitiva com o Immer

</YouWillLearn>

## O que é uma mutação? {/*whats-a-mutation*/}

Você pode armazenar qualquer tipo de valor JavaScript no state.

```js
const [x, setX] = useState(0);
```

Até agora, você trabalhou com números, strings e booleanos. Esses tipos de valores JavaScript são "imutáveis", ou seja, inalteráveis ou "somente leitura". Você pode acionar uma nova renderização para _substituir_ um valor:


```js
setX(5);
```

O state `x` foi alterado de `0` para `5`, mas o _número `0` em si_ não foi alterado. Não é possível fazer nenhuma alteração nos valores primitivos internos, como números, strings e booleanos, no JavaScript.

Agora, considere um objeto no state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Tecnicamente, é possível alterar o conteúdo _do próprio objeto_. **Isso é chamado de mutação:**

```js
position.x = 5;
```

No entanto, embora os objetos no state do React sejam tecnicamente mutáveis, você deve tratá-los **como se** fossem imutáveis -- como números, booleanos e strings. Em vez de mutá-los, você deve sempre substituí-los.

## Trate o state como somente leitura {/*treat-state-as-read-only*/}

Em outras palavras, você deve **tratar qualquer objeto JavaScript que você colocar no state como somente leitura**.

Este exemplo mantém um objeto no state para representar a posição atual do ponteiro. O ponto vermelho deve se mover quando você tocar ou mover o cursor sobre a área de visualização. Mas o ponto permanece na posição inicial:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

O problema é com este trecho de código.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Esse código modifica o objeto atribuído à `position` da [renderização anterior.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Mas sem usar a função de configuração de state, o React não tem ideia de que o objeto foi alterado. Portanto, o React não faz nada em resposta. É como tentar alterar o pedido depois que você já comeu a refeição. Embora a mutação de state possa funcionar em alguns casos, não a recomendamos. Você deve tratar o valor de state ao qual tem acesso em uma renderização como somente leitura.

Para realmente [acionar uma nova renderização](/learn/state-as-a-snapshot#setting-state-triggers-renders) nesse caso, **crie um objeto *novo* e passe-o para a função de configuração de state:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Com `setPosition`, você está dizendo ao React:

* Substitua `position` por este novo objeto
* E renderize esse componente novamente

Observe como o ponto vermelho agora segue seu ponteiro quando você toca ou passa o mouse sobre a área de visualização:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Mutação local não tem problema {/*local-mutation-is-fine*/}

Um código como esse é um problema porque modifica um objeto *existente* no state:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Mas um código como esse é **absolutamente aceitável** porque você está alterando um objeto novo que *acabou de criar*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Na verdade, é completamente equivalente a escrever isto:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

A mutação só é um problema quando você altera objetos *existentes* que já estão no state. A mutação de um objeto que você acabou de criar não tem problema porque *nenhum outro código faz referência a ele ainda*. Alterá-lo não afetará acidentalmente algo que depende dele. Isso é chamado de "mutação local". Você pode até mesmo fazer a mutação local [durante a renderização.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Muito conveniente e completamente aceitável!

</DeepDive>  

## Copiando objetos com a sintaxe de espalhamento {/*copying-objects-with-the-spread-syntax*/}

No exemplo anterior, o objeto `position` é sempre criado a partir da posição atual do cursor. Mas, muitas vezes, você desejará incluir dados *existentes* como parte do novo objeto que está criando. Por exemplo, talvez você queira atualizar *apenas um* campo em um formulário, mas manter os valores anteriores de todos os outros campos.

Esses campos de entrada não funcionam porque os manipuladores `onChange` alteram o state:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Nome:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-mail:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Por exemplo, esta linha altera o state de uma renderização anterior:

```js
person.firstName = e.target.value;
```
A maneira confiável de obter o comportamento que você está procurando é criar um novo objeto e passá-lo para `setPerson`. Mas aqui, você também deseja **copiar os dados existentes para ele** porque apenas um dos campos foi alterado:

```js
setPerson({
  firstName: e.target.value, // Novo nome a partir da entrada
  lastName: person.lastName,
  email: person.email
});
```

Você pode usar a [sintaxe de espalhamento](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...` para não precisar copiar cada propriedade separadamente.

```js
setPerson({
  ...person, // Copie os campos antigos
  firstName: e.target.value // Mas substitua esse
});
```

Agora o formulário funciona!

Observe como você não declarou uma variável de state separada para cada campo de entrada. Para formulários grandes, manter todos os dados agrupados em um objeto é muito conveniente -- desde que você os atualize corretamente!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Nome:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-mail:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Observe que a sintaxe de espalhamento `...` é "rasa" -- ela copia apenas um nível de profundidade. Isso a torna rápida, mas também significa que, se você quiser atualizar uma propriedade aninhada, terá de usá-la mais de uma vez.

<DeepDive>

#### Usando um único manipulador de eventos para vários campos {/*using-a-single-event-handler-for-multiple-fields*/}

<<<<<<< HEAD
Você também pode usar as chaves `[` e `]` dentro da definição do objeto para especificar uma propriedade com nome dinâmico. Aqui está o mesmo exemplo, mas com um único manipulador de eventos em vez de três diferentes:
=======
You can also use the `[` and `]` braces inside your object definition to specify a property with a dynamic name. Here is the same example, but with a single event handler instead of three different ones:
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Nome:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Sobrenome:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        E-mail:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Aqui, `e.target.name` refere-se à propriedade `name` fornecida ao elemento do DOM `<input>`.

</DeepDive>

## Atualizando um objeto aninhado {/*updating-a-nested-object*/}

Considere uma estrutura de objetos aninhados como esta:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburgo',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```
Se você quisesse atualizar `person.artwork.city`, está claro como fazer isso com a mutação:

```js
person.artwork.city = 'Nova Deli';
```

Mas no React, você trata o state como imutável! Para alterar `city`, você precisaria primeiro produzir o novo objeto `artwork` (pré-preenchido com os dados do anterior) e, em seguida, produzir o novo objeto `person` que aponta para o novo `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'Nova Deli' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Ou, escrito como uma única chamada de função:

```js
setPerson({
  ...person, // Copie os outros campos
  artwork: { // mas substitua artwork
    ...person.artwork, // pelo mesmo
    city: 'Nova Deli' // mas em Nova Deli!
  }
});
```

Isto fica um pouco verboso, mas funciona bem em muitos casos:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburgo',
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

<DeepDive>

#### Objetos não são realmente aninhados {/*objects-are-not-really-nested*/}

Um objeto como este parece "aninhado" no código:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburgo',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

No entanto, o "aninhamento" é uma maneira imprecisa de pensar sobre como os objetos se comportam. Quando o código é executado, não existe um objeto "aninhado". Na verdade, você está olhando para dois objetos diferentes:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburgo',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```
O objeto `obj1` não está "dentro" do `obj2`. Por exemplo, o `obj3` também poderia "apontar" para o `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburgo',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Se você fizesse uma mutação em `obj3.artwork.city`, isso afetaria tanto `obj2.artwork.city` quanto `obj1.city`. Isso ocorre porque `obj3.artwork`, `obj2.artwork` e `obj1` são o mesmo objeto. Isso é difícil de perceber quando você pensa em objetos como "aninhados". Em vez disso, eles são objetos separados "apontando" uns para os outros com propriedades.

</DeepDive>  

### Escreva uma lógica de atualização concisa com Immer {/*write-concise-update-logic-with-immer*/}

Se o seu state estiver muito aninhado, talvez você deva considerar [achatá-lo](/learn/choosing-the-state-structure#avoid-deeply-nested-state). Mas, se você não quiser alterar sua estrutura de estado, talvez prefira um atalho para espalhamentos aninhados. [Immer](https://github.com/immerjs/use-immer) é uma biblioteca popular que permite que você escreva usando a sintaxe conveniente, mas mutante, e se encarrega de produzir as cópias para você. Com a Immer, o código que você escreve parece que está "quebrando as regras" e mutando um objeto:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Mas, diferentemente de uma mutação normal, ela não sobrescreve o estado anterior!

<DeepDive>

#### Como a Immer funciona? {/*how-does-immer-work*/}

O `draft` fornecido pela Immer é um tipo especial de objeto, chamado de [Proxy](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Proxy), que "registra" o que você faz com ele. É por isso que você pode mutá-lo livremente o quanto quiser! Por baixo dos panos, a Immer descobre quais partes do `draft` foram alteradas e produz um objeto completamente novo que contém suas modificações.

</DeepDive>

Para experimentar a Immer:

1. Execute `npm install use-immer` para adicionar a Immer como uma dependência
2. Em seguida, substitua `import { useState } from 'react'` por `import { useImmer } from 'use-immer'`

Aqui está o exemplo acima convertido para Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburgo',
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

Observe como os manipuladores de eventos se tornaram muito mais concisos. Você pode misturar e combinar `useState` e `useImmer` em um único componente o quanto quiser. A Immer é uma ótima maneira de manter os manipuladores de atualização concisos, especialmente se houver aninhamento em seu state e a cópia de objetos resultar em código repetitivo.

<DeepDive>

#### Por que a mutação de state não é recomendada no React? {/*why-is-mutating-state-not-recommended-in-react*/}

Existem alguns motivos:

* **Depuração:** Se você usar `console.log` e não mutar o state, os logs anteriores não serão afetados pelas alterações de estado mais recentes. Assim, você poderá ver claramente como o estado foi alterado entre as renderizações.
* **Otimizações:** As [estratégias de otimização](/reference/react/memo) comuns do React dependem de pular o trabalho se as props ou o state anteriores forem os mesmos que os próximos. Se você nunca altera o estado, é muito rápido verificar se houve alguma alteração. Se `prevObj === obj`, você pode ter certeza de que nada pode ter sido alterado dentro dele.
* **Novas Funcionalidades:** As novas funcionalidades do React que estamos criando dependem de o estado ser [tratado como um snapshot](/learn/state-as-a-snapshot). Se você estiver mutando versões anteriores do estado, isso poderá impedi-lo de usar as novas funcionalidades.
* **Mudanças de Requisitos:** Algumas funcionalidades de aplicações, como a implementação de Desfazer/Refazer, a exibição de um histórico de alterações ou a possibilidade de o usuário retornar um formulário para valores anteriores, são mais fáceis de fazer quando nada é mutado. Isso ocorre porque você pode manter cópias anteriores do estado na memória e reutilizá-las quando for apropriado. Se você começar com uma abordagem de mutação, pode ser difícil adicionar funcionalidades como essas no futuro.
* **Implementação Mais Simples:** Como o React não depende de mutação, ele não precisa fazer nada de especial com seus objetos. Ele não precisa sequestrar suas propriedades, sempre envolvê-las em Proxies ou fazer outro trabalho na inicialização, como fazem muitas soluções "reativas". É também por isso que o React permite que você coloque qualquer objeto no state -- independentemente do tamanho -- sem problemas adicionais de desempenho ou correção.

Na prática, muitas vezes é possível "sair ileso" ao fazer mutação de state no React, mas recomendamos enfaticamente que você não faça isso para que possa usar as novas funcionalidades do React desenvolvidas com essa abordagem em mente. Os futuros colaboradores e talvez até mesmo seu futuro eu lhe agradecerão!

</DeepDive>

<Recap>

* Trate todo o estado no React como imutável.
* Quando você armazena objetos no estado, a mutação deles não acionará renderizações e alterará o estado em "snapshots" de renderização anteriores.
* Em vez de mutar um objeto, crie uma versão *nova* dele e acione uma nova renderização definindo o state para ele.
* Você pode usar a sintaxe de espalhamento de objetos `{...obj, something: 'newValue'}` para criar cópias de objetos.
* A sintaxe de espalhamento é superficial: ela copia apenas um nível de profundidade.
* Para atualizar um objeto aninhado, é necessário criar cópias em todos os níveis a partir do local que está sendo atualizado.
* Para reduzir a cópia de código repetitiva, use Immer.

</Recap>



<Challenges>

#### Correção de atualizações de state incorretas {/*fix-incorrect-state-updates*/}

Este formulário tem alguns erros. Clique no botão que aumenta a pontuação algumas vezes. Observe que ela não aumenta. Em seguida, edite o nome e observe que a pontuação subitamente "alcançou" suas alterações. Por fim, edite o sobrenome e observe que a pontuação desapareceu completamente.

Sua tarefa é corrigir todos esses erros. Ao corrigi-los, explique por que cada um deles acontece.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Pontuação: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nome:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Aqui está uma versão com os dois erros corrigidos:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Pontuação: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Nome:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

O problema com `handlePlusClick` era que ele mutava o objeto `player`. Como resultado, o React não sabia que havia um motivo para renderizar novamente e não atualizava a pontuação na tela. É por isso que, quando você editou o nome, o state foi atualizado, acionando uma nova renderização que _também_ atualizou a pontuação na tela.

O problema com `handleLastNameChange` era que ele não copiava os campos existentes de `...player` para o novo objeto. É por isso que a pontuação foi perdida depois que você editou o sobrenome.

</Solution>

#### Encontre e corrija a mutação {/*find-and-fix-the-mutation*/}

Há uma caixa arrastável em um fundo estático. Você pode alterar a cor da caixa usando a lista de seleção.

Mas há um erro. Se você mover a caixa primeiro e depois mudar sua cor, o fundo (que não deveria se mover!) "pulará" para a posição da caixa. Mas isso não deveria acontecer: a propriedade `position` do `Background` é definida como `initialPosition`, que é `{ x: 0, y: 0 }`. Por que o fundo está se movendo após a mudança de cor?

Encontre o erro e corrija-o.

<Hint>

Se algo inesperado muda, é porque há uma mutação. Encontre a mutação em `App.js` e corrija-a.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">laranja</option>
        <option value="lightpink">rosa claro</option>
        <option value="aliceblue">azul alice</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Arraste-me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

O problema estava na mutação dentro de `handleMove`. Ele alterou `shape.position`, mas esse é o mesmo objeto para o qual `initialPosition` aponta. É por isso que tanto a forma quanto o plano de fundo se movem. (É uma mutação, portanto, a alteração não é refletida na tela até que uma atualização não relacionada -- a alteração de cor -- acione uma nova renderização).

A solução é remover a mutação de `handleMove` e usar a sintaxe de espalhamento para copiar a forma. Observe que `+=` é uma mutação, portanto, você precisa reescrevê-la para usar uma operação `+` regular.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">laranja</option>
        <option value="lightpink">rosa claro</option>
        <option value="aliceblue">azul alice</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Arraste-me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Atualize um objeto com Immer {/*update-an-object-with-immer*/}

Este é o mesmo exemplo com erros do desafio anterior. Desta vez, corrija a mutação usando Immer. Para sua conveniência, o `useImmer` já está importado, portanto, você precisa alterar a variável `shape` do state para usá-lo.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">laranja</option>
        <option value="lightpink">rosa claro</option>
        <option value="aliceblue">azul alice</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Arraste-me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

Esta é a solução reescrita com Immer. Observe como os manipuladores de eventos são escritos de forma mutante, mas o erro não ocorre. Isso se deve ao fato de que, por baixo dos panos, a Immer nunca muta os objetos existentes.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">laranja</option>
        <option value="lightpink">rosa claro</option>
        <option value="aliceblue">azul alice</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Arraste-me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
