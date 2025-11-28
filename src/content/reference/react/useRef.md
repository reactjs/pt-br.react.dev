---
title: useRef
---

<Intro>

`useRef` é um Hook React que permite que você referencie um valor que não é necessário para renderização.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Chame `useRef` no topo do seu componente para declarar uma [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

*   `initialValue`: O valor que você quer que a propriedade `current` do objeto ref tenha inicialmente. Pode ser um valor de qualquer tipo. Este argumento é ignorado após a renderização inicial.

#### Retorna {/*returns*/}

`useRef` retorna um objeto com uma única propriedade:

*   `current`: Inicialmente, é definido para o `initialValue` que você passou. Você pode, mais tarde, definir para outra coisa. Se você passar o objeto ref para o React como um atributo `ref` para um nó JSX, o React definirá sua propriedade `current`.

Nas próximas renderizações, `useRef` retornará o mesmo objeto.

#### Ressalvas {/*caveats*/}

*   Você pode mutar a propriedade `ref.current`. Diferente do state, é mutável. No entanto, se ele contiver um objeto que é usado para renderização (por exemplo, uma parte do seu state), então você não deve mutar esse objeto.
*   Quando você muda a propriedade `ref.current`, o React não re-renderiza o seu componente. O React não está ciente quando você o muda porque uma ref é um objeto JavaScript simples.
*   Não escreva _ou leia_ `ref.current` durante a renderização, exceto para [inicialização.](#avoiding-recreating-the-ref-contents) Isso torna o comportamento do seu componente imprevisível.
*   No Strict Mode, o React irá **chamar a função do seu componente duas vezes** para [ajudar você a encontrar impurezas acidentais.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Esse é um comportamento apenas para desenvolvimento e não afeta a produção. Cada objeto ref será criado duas vezes, mas uma das versões será descartada. Se a função do seu componente é pura (como deveria ser), isso não deve afetar o comportamento.

---

## Uso {/*usage*/}

### Referenciando um valor com uma ref {/*referencing-a-value-with-a-ref*/}

Chame `useRef` no nível mais alto do seu componente para declarar um ou mais [refs.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` retorna um <CodeStep step={1}>objeto ref</CodeStep> com uma única <CodeStep step={2}>propriedade `current`</CodeStep> inicialmente definida para o <CodeStep step={3}>valor inicial</CodeStep> que você forneceu.

Nas renderizações seguintes, `useRef` retornará o mesmo objeto. Você pode mudar sua propriedade `current` para armazenar informações e lê-las depois. Isso pode fazer você lembrar do [state](/reference/react/useState), mas há uma diferença importante.

**Mudar uma ref não dispara uma re-renderização.** Isso significa que as refs são perfeitas para armazenar informações que não afetam a saída visual do seu componente. Por exemplo, se você precisar armazenar um [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) e recuperá-lo depois, você pode colocá-lo em uma ref. Para atualizar o valor dentro da ref, você precisa mudar manualmente sua <CodeStep step={2}>propriedade `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Mais tarde, você pode ler o ID do intervalo da ref para que possa chamar [clear o intervalo](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Ao usar uma ref, você garante que:

-   Você pode **armazenar informações** entre as re-renderizações (diferente das variáveis normais, que reiniciam em cada renderização).
-   Mudá-la **não dispara uma re-renderização** (diferente das variáveis do state, que disparam uma re-renderização).
-   A **informação é local** para cada cópia do seu componente (diferente das variáveis externas, que são compartilhadas).

Mudar uma ref não dispara uma re-renderização, então refs não são apropriadas para armazenar informações que você quer exibir na tela. Use state para isso. Leia mais sobre [escolher entre `useRef` e `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Exemplos de referência de um valor com useRef" titleId="examples-value">

#### Contador de cliques {/*click-counter*/}

Este componente usa uma ref para controlar quantas vezes o botão foi clicado. Note que é aceitável usar uma ref em vez de state aqui porque a contagem de cliques é somente lida e escrita em um manipulador de evento.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Se você mostrar `{ref.current}` no JSX, o número não irá atualizar no clique. Isso ocorre porque definir `ref.current` não dispara uma re-renderização. Informações que são usadas para renderização deveriam ser state, em vez disso.

<Solution />

#### Um cronômetro {/*a-stopwatch*/}

Este exemplo usa uma combinação de state e refs. Ambos `startTime` e `now` são variáveis de state porque elas são usadas para renderização. Mas nós também precisamos manter um [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) para que possamos parar o intervalo na pressão do botão. Já que o ID do intervalo não é usado para renderização, é apropriado mantê-lo em uma ref e atualizá-lo manualmente.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Não escreva _ou leia_ `ref.current` durante a renderização.**

O React espera que o corpo do seu componente [se comporte como uma função pura](/learn/keeping-components-pure):

-   Se os _inputs_ ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), e [contexto](/learn/passing-data-deeply-with-context)) forem os mesmos, ele deverá retornar exatamente o mesmo JSX.
-   Chamá-la em uma ordem diferente ou com argumentos diferentes não deverá afetar os resultados de outras chamadas.

Ler ou escrever uma ref **durante a renderização** quebra essas expectativas.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Não escreva uma ref durante a renderização
  myRef.current = 123;
  // ...
  // 🚩 Não leia uma ref durante a renderização
  return <h1>{myOtherRef.current}</h1>;
}
```

Você pode ler ou escrever refs **de manipuladores de eventos ou effects, em vez disso**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Você pode ler ou escrever refs em effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Você pode ler ou escrever refs em manipuladores de eventos
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Se você *tiver que* ler [ou escrever](/reference/react/useState#storing-information-from-previous-renders) algo durante a renderização, [use o state](/reference/react/useState) em vez disso.

Quando você quebra essas regras, seu componente ainda pode funcionar, mas a maioria dos recursos mais novos que estamos adicionando ao React dependerão dessas expectativas. Leia mais sobre [manter seus componentes puros.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### Manipulando o DOM com uma ref {/*manipulating-the-dom-with-a-ref*/}

É particularmente comum usar uma ref para manipular o [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) O React tem suporte embutido para isso.

Primeiramente, declare um <CodeStep step={1}>objeto ref</CodeStep> com um <CodeStep step={3}>valor inicial</CodeStep> de `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Então passe o seu objeto ref como o atributo `ref` para o JSX do nó do DOM que você quer manipular:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Depois que o React cria o nó do DOM e o coloca na tela, o React irá definir a <CodeStep step={2}>propriedade `current`</CodeStep> do seu objeto ref para esse nó do DOM. Agora você pode acessar o nó DOM do `<input>` e chamar métodos como [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

O React irá definir a propriedade `current` de volta para `null` quando o nó for removido da tela.

Leia mais sobre [manipular o DOM com refs.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Exemplos de manipulação do DOM com useRef" titleId="examples-dom">

#### Focando uma entrada de texto {/*focusing-a-text-input*/}

Neste exemplo, clicar no botão irá focar no _input_:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Rolando uma imagem para dentro da visão {/*scrolling-an-image-into-view*/}

Neste exemplo, clicar no botão irá rolar uma imagem para dentro da visão. Ele usa uma ref para o nó DOM da lista, e então chama a API DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) para encontrar a imagem que queremos rolar até.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Essa linha assume uma estrutura DOM em particular:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Reproduzindo e pausando um vídeo {/*playing-and-pausing-a-video*/}

Este exemplo usa uma ref para chamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) em um nó DOM de `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Expondo uma ref para o seu próprio componente {/*exposing-a-ref-to-your-own-component*/}

Às vezes, talvez você queira deixar o componente pai manipular o DOM dentro do seu componente. Por exemplo, talvez você esteja escrevendo um componente `MyInput`, mas você quer que o pai seja capaz de focar o _input_ (acesso ao qual o pai não tem). Você pode criar uma `ref` no pai e passar a `ref` como prop para o componente filho. Leia um [passo a passo detalhado](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) aqui.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitando recriar o conteúdo da ref {/*avoiding-recreating-the-ref-contents*/}

O React salva o valor inicial do ref uma vez e o ignora nas renderizações seguintes.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Embora o resultado de `new VideoPlayer()` seja usado somente para a renderização inicial, você ainda está chamando essa função em cada renderização. Isso pode ser um desperdício se estiver criando objetos caros.

Para resolver isso, você pode inicializar a ref assim, em vez disso:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalmente, escrever ou ler `ref.current` durante a renderização não é permitido. No entanto, é aceitável neste caso porque o resultado é sempre o mesmo, e a condição só executa durante a inicialização, então é totalmente previsível.

<DeepDive>

#### Como evitar _null checks_ ao inicializar o useRef mais tarde {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Se você usa um _type checker_ e não quer sempre verificar por `null`, você pode tentar um padrão como este, em vez disso:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Aqui, a própria `playerRef` é nulável. No entanto, você deve ser capaz de convencer seu _type checker_ de que não há caso em que `getPlayer()` retorne `null`. Então use `getPlayer()` em seus manipuladores de eventos.

</DeepDive>

---

## Solução de Problemas {/*troubleshooting*/}

### Eu não consigo obter uma ref para um componente customizado {/*i-cant-get-a-ref-to-a-custom-component*/}

Se você tentar passar uma `ref` para o seu próprio componente assim:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Você pode obter um erro no console:

<ConsoleBlock level="error">

TypeError: Não é possível ler as propriedades de null

</ConsoleBlock>

Por padrão, seus próprios componentes não expõem refs para os nós do DOM dentro deles.

Para corrigir isso, encontre o componente para o qual você quer obter uma ref:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

<<<<<<< HEAD
E então adicione `ref` para a lista de _props_ que seu componente aceita e passe `ref` como uma prop para o [componente embutido](/reference/react-dom/components/common) relevante como este:
=======
And then add `ref` to the list of props your component accepts and pass `ref` as a prop to the relevant child [built-in component](/reference/react-dom/components/common) like this:
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Então o componente pai pode obter uma ref para ele.

Leia mais sobre [acessar nós DOM de outro componente.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)