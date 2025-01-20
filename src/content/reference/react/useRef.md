---
title: useRef
---

<Intro>

`useRef` é um Hook do React que permite referenciar um valor que não é necessário para renderização.

```js
const ref = useRef(valorInicial)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useRef(valorInicial)` {/*useref*/}

Chame `useRef` na raiz do seu componente para declarar um [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MeuComponente() {
  const intervaloRef = useRef(0);
  const entradaRef = useRef(null);
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `valorInicial`: O valor que você deseja que a propriedade `current` do objeto ref seja inicialmente. Pode ser um valor de qualquer tipo. Este argumento é ignorado após a renderização inicial.

#### Retornos {/*returns*/}

`useRef` retorna um objeto com uma única propriedade:

* `current`: Inicialmente, é definido como o `valorInicial` que você passou. Você pode defini-lo posteriormente para algo diferente. Se você passar o objeto ref para o React como um atributo `ref` para um nó JSX, o React definirá sua propriedade `current`.

Nas próximas renderizações, `useRef` retornará o mesmo objeto.

#### Ressalvas {/*caveats*/}

* Você pode modificar a propriedade `ref.current`. Ao contrário do estado, é mutável. No entanto, se ele contiver um objeto que é usado para renderização (por exemplo, uma parte do seu estado), você não deve modificar esse objeto.
* Quando você muda a propriedade `ref.current`, o React não re-renderiza seu componente. O React não está ciente de quando você a altera, pois um ref é um objeto JavaScript simples.
* Não escreva _ou leia_ `ref.current` durante a renderização, exceto para [inicialização.](#avoiding-recreating-the-ref-contents) Isso torna o comportamento do seu componente imprevisível.
* No Modo Estrito, o React **chamará a função do seu componente duas vezes** a fim de [ajudá-lo a encontrar impurezas acidentais.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Este é um comportamento exclusivo de desenvolvimento e não afeta a produção. Cada objeto ref será criado duas vezes, mas uma das versões será descartada. Se a função do seu componente for pura (como deveria ser), isso não deve afetar o comportamento.

---

## Uso {/*usage*/}

### Referenciando um valor com um ref {/*referencing-a-value-with-a-ref*/}

Chame `useRef` na raiz do seu componente para declarar um ou mais [refs.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Cronômetro() {
  const intervaloRef = useRef(0);
  // ...
```

`useRef` retorna um <CodeStep step={1}>objeto ref</CodeStep> com uma única <CodeStep step={2}>propriedade `current`</CodeStep> inicialmente definida como o <CodeStep step={3}>valor inicial</CodeStep> que você forneceu.

Nas próximas renderizações, `useRef` retornará o mesmo objeto. Você pode alterar sua propriedade `current` para armazenar informações e lê-las depois. Isso pode lembrá-lo do [estado](/reference/react/useState), mas há uma diferença importante.

**Mudar um ref não dispara uma re-renderização.** Isso significa que os refs são perfeitos para armazenar informações que não afetam a saída visual do seu componente. Por exemplo, se você precisar armazenar um [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) e recuperá-lo mais tarde, você pode colocá-lo em um ref. Para atualizar o valor dentro do ref, você precisa mudar manualmente sua <CodeStep step={2}>propriedade `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervaloRef.current = intervalId;
}
```

Mais tarde, você pode ler esse ID de intervalo do ref para que possa [limpar esse intervalo](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervaloRef.current;
  clearInterval(intervalId);
}
```

Ao usar um ref, você garante que:

- Você pode **armazenar informações** entre as re-renderizações (diferente de variáveis regulares, que se resetam em cada render).
- Mudá-lo **não dispara uma re-renderização** (diferente de variáveis de estado, que disparam uma re-renderização).
- A **informação é local** para cada cópia do seu componente (diferente de variáveis fora, que são compartilhadas).

Mudar um ref não dispara uma re-renderização, então refs não são apropriados para armazenar informações que você deseja exibir na tela. Use estado para isso em vez disso. Leia mais sobre [escolher entre `useRef` e `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Receitas titleText="Exemplos de referência de um valor com useRef" titleId="examples-value">

#### Contador de cliques {/*click-counter*/}

Esse componente usa um ref para acompanhar quantas vezes o botão foi clicado. Note que é aceitável usar um ref em vez de estado aqui porque a contagem de cliques é apenas lida e escrita em um manipulador de eventos.

<Sandpack>

```js
import { useRef } from 'react';

export default function Contador() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Você clicou ' + ref.current + ' vezes!');
  }

  return (
    <button onClick={handleClick}>
      Clique em mim!
    </button>
  );
}
```

</Sandpack>

Se você mostrar `{ref.current}` no JSX, o número não será atualizado ao clicar. Isso ocorre porque definir `ref.current` não dispara uma re-renderização. Informações que são usadas para renderização devem ser estado em vez disso.

<Solução />

#### Um cronômetro {/*a-stopwatch*/}

Este exemplo usa uma combinação de estado e refs. Tanto `startTime` quanto `now` são variáveis de estado porque são usadas para renderização. Mas também precisamos armazenar um [ID de intervalo](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) para que possamos parar o intervalo ao pressionar o botão. Como o ID de intervalo não é usado para renderização, é apropriado mantê-lo em um ref e atualizá-lo manualmente.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Cronômetro() {
  const [inicioTempo, setInicioTempo] = useState(null);
  const [agora, setAgora] = useState(null);
  const intervaloRef = useRef(null);

  function handleStart() {
    setInicioTempo(Date.now());
    setAgora(Date.now());

    clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      setAgora(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervaloRef.current);
  }

  let segundosPassados = 0;
  if (inicioTempo != null && agora != null) {
    segundosPassados = (agora - inicioTempo) / 1000;
  }

  return (
    <>
      <h1>Tempo decorrido: {segundosPassados.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Iniciar
      </button>
      <button onClick={handleStop}>
        Parar
      </button>
    </>
  );
}
```

</Sandpack>

<Solução />

</Receitas>

<Cuidado>

**Não escreva _ou leia_ `ref.current` durante a renderização.**

O React espera que o corpo do seu componente [comporte-se como uma função pura](/learn/keeping-components-pure):

- Se as entradas ([props](/learn/passing-props-to-a-component), [estado](/learn/state-a-components-memory), e [contexto](/learn/passing-data-deeply-with-context)) forem as mesmas, deve retornar exatamente o mesmo JSX.
- Chamá-lo em uma ordem diferente ou com argumentos diferentes não deve afetar os resultados de outras chamadas.

Ler ou escrever um ref **durante a renderização** quebra essas expectativas.

```js {3-4,6-7}
function MeuComponente() {
  // ...
  // 🚩 Não escreva um ref durante a renderização
  meuRef.current = 123;
  // ...
  // 🚩 Não leia um ref durante a renderização
  return <h1>{meuOutroRef.current}</h1>;
}
```

Você pode ler ou escrever refs **a partir de manipuladores de eventos ou efeitos**.

```js {4-5,9-10}
function MeuComponente() {
  // ...
  useEffect(() => {
    // ✅ Você pode ler ou escrever refs em efeitos
    meuRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Você pode ler ou escrever refs em manipuladores de eventos
    fazerAlgo(meuOutroRef.current);
  }
  // ...
}
```

Se você *precisar* ler [ou escrever](/reference/react/useState#storing-information-from-previous-renders) algo durante a renderização, use [estado](/reference/react/useState) em vez disso.

Quando você quebra essas regras, seu componente ainda pode funcionar, mas a maioria dos novos recursos que estamos adicionando ao React dependerão dessas expectativas. Leia mais sobre [manter seus componentes puros.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Cuidado>

---

### Manipulando o DOM com um ref {/*manipulating-the-dom-with-a-ref*/}

É particularmente comum usar um ref para manipular o [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) O React tem suporte embutido para isso.

Primeiro, declare um <CodeStep step={1}>objeto ref</CodeStep> com um <CodeStep step={3}>valor inicial</CodeStep> de `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MeuComponente() {
  const entradaRef = useRef(null);
  // ...
```

Em seguida, passe seu objeto ref como o atributo `ref` para o JSX do nó DOM que você deseja manipular:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={entradaRef} />;
```

Depois que o React cria o nó DOM e o coloca na tela, o React definirá a <CodeStep step={2}>propriedade `current`</CodeStep> do seu objeto ref para aquele nó DOM. Agora você pode acessar o nó DOM do `<input>` e chamar métodos como [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    entradaRef.current.focus();
  }
```

O React definirá a propriedade `current` de volta para `null` quando o nó for removido da tela.

Leia mais sobre [manipulando o DOM com refs.](/learn/manipulating-the-dom-with-refs)

<Receitas titleText="Exemplos de manipulação do DOM com useRef" titleId="examples-dom">

#### Focando em um campo de texto {/*focusing-a-text-input*/}

Neste exemplo, clicar no botão irá focar o campo de entrada:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const entradaRef = useRef(null);

  function handleClick() {
    entradaRef.current.focus();
  }

  return (
    <>
      <input ref={entradaRef} />
      <button onClick={handleClick}>
        Focar no campo
      </button>
    </>
  );
}
```

</Sandpack>

<Solução />

#### Rolando uma imagem para visualizar {/*scrolling-an-image-into-view*/}

Neste exemplo, clicar no botão rolará uma imagem para visualizar. Ele usa um ref para o nó DOM da lista e, em seguida, chama a API DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) para encontrar a imagem que desejamos rolar.

<Sandpack>

```js
import { useRef } from 'react';

export default function AmigosGato() {
  const listaRef = useRef(null);

  function rolarParaIndice(indice) {
    const nóLista = listaRef.current;
    // Esta linha assume uma estrutura DOM particular:
    const nóImg = nóLista.querySelectorAll('li > img')[indice];
    nóImg.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => rolarParaIndice(0)}>
          Tom
        </button>
        <button onClick={() => rolarParaIndice(1)}>
          Maru
        </button>
        <button onClick={() => rolarParaIndice(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listaRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
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

<Solução />

#### Reproduzindo e pausando um vídeo {/*playing-and-pausing-a-video*/}

Este exemplo usa um ref para chamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) em um nó DOM `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function ReprodutorVideo() {
  const [estáReproduzindo, setEstáReproduzindo] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const próximoEstáReproduzindo = !estáReproduzindo;
    setEstáReproduzindo(próximoEstáReproduzindo);

    if (próximoEstáReproduzindo) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {estáReproduzindo ? 'Pausar' : 'Reproduzir'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setEstáReproduzindo(true)}
        onPause={() => setEstáReproduzindo(false)}
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

<Solução />

#### Expondo um ref para seu próprio componente {/*exposing-a-ref-to-your-own-component*/}

Às vezes, você pode querer permitir que o componente pai manipule o DOM dentro do seu componente. Por exemplo, talvez você esteja escrevendo um componente `MeuInput`, mas deseja que o pai possa focar a entrada (à qual o pai não tem acesso). Você pode usar uma combinação de `useRef` para manter a entrada e [`forwardRef`](/reference/react/forwardRef) para expô-la ao componente pai. Leia um [passo a passo detalhado](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) aqui.

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MeuInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const entradaRef = useRef(null);

  function handleClick() {
    entradaRef.current.focus();
  }

  return (
    <>
      <MeuInput ref={entradaRef} />
      <button onClick={handleClick}>
        Focar no campo
      </button>
    </>
  );
}
```

</Sandpack>

<Solução />

</Receitas>

---

### Evitando a recriação do conteúdo do ref {/*avoiding-recreating-the-ref-contents*/}

O React salva o valor inicial do ref uma vez e ignora-o nas próximas renderizações.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Embora o resultado de `new VideoPlayer()` seja usado apenas para a renderização inicial, você ainda está chamando essa função em cada renderização. Isso pode ser dispendioso se estiver criando objetos caros.

Para resolver isso, você pode inicializar o ref assim em vez disso:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalmente, escrever ou ler `ref.current` durante a renderização não é permitido. No entanto, é aceitável neste caso porque o resultado é sempre o mesmo, e a condição só é executada durante a inicialização, portanto, é totalmente previsível.

<Mergulho>

#### Como evitar verificações nulas ao inicializar useRef mais tarde {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Se você usar um verificador de tipo e não quiser verificar sempre se é `null`, pode tentar um padrão assim:

```js
function Video() {
  const playerRef = useRef(null);

  function obterPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Aqui, o `playerRef` em si é anulável. No entanto, você deve ser capaz de convencer seu verificador de tipo que não há caso em que `obterPlayer()` retorne `null`. Então use `obterPlayer()` em seus manipuladores de eventos.

</Mergulho>

---

## Solução de Problemas {/*troubleshooting*/}

### Não consigo obter um ref para um componente personalizado {/*i-cant-get-a-ref-to-a-custom-component*/}

Se você tentar passar um `ref` para seu próprio componente assim:

```js
const entradaRef = useRef(null);

return <MeuInput ref={entradaRef} />;
```

Você pode receber um erro no console:

<ConsoleBlock level="error">

Atenção: Componentes de função não podem receber refs. Tentativas de acessar este ref falharão. Você quis usar React.forwardRef()?

</ConsoleBlock>

Por padrão, seus próprios componentes não expõem refs para os nós DOM dentro deles.

Para corrigir isso, encontre o componente que você deseja obter um ref:

```js
export default function MeuInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

E então envolva-o em [`forwardRef`](/reference/react/forwardRef) assim:

```js {3,8}
import { forwardRef } from 'react';

const MeuInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MeuInput;
```

Então o componente pai pode obter um ref para ele.

Leia mais sobre [acessando os nós DOM de outro componente.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)