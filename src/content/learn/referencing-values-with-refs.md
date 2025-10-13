---
title: 'Referenciando valores com Refs'
---

<Intro>

Quando você quer que um componente "lembre" de alguma informação, mas você não quer que aquela informação [cause novos renders](/learn/render-and-commit), você pode usar um *ref*.


</Intro>

<YouWillLearn>

- Como adicionar um ref ao seu componente
- Como atualizar o valor de um ref
- Como refs diferenciam de state
- Como usar refs de forma segura


</YouWillLearn>

## Adicionando um ref ao seu componente {/*adding-a-ref-to-your-component*/}

Você pode adicionar um ref ao seu componente importando o Hook `useRef` do React:

```js
import { useRef } from 'react';
```

Dentro do seu componente, invoque o Hook `useRef` e passe o valor inicial que você quer referenciar como o único argumento. Por exemplo, aqui está um ref para o valor `0`:

```js
const ref = useRef(0);
```

`useRef` retorna um objeto assim:

```js
{ 
  current: 0 // o valor que você passou para o useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Uma flecha com os escritos 'current', dentro de um bolso com os escritos 'ref'." />

Você pode acessar o valor atual daquele ref através da propriedade `ref.current`. Esse valor é intencionalmente mutável, o que significa que você pode tanto ler quanto escrever sobre ele. É como um bolso secreto do seu componente o qual o React não rastreia. (É isso que o faz uma "saída de emergência" do fluxo de data de mão-única do React--mais sobre isso abaixo!)

Aqui, um botão irá incrementar `ref.current` a cada clique:

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

O ref aponta para um número, mas, como [state](/learn/state-a-components-memory), você pode apontá-lo para qualquer coisa: uma string, um objeto, ou até mesmo uma função. Diferentemente do state, ref é um simples objeto Javascript com a propriedade `current` que você pode ler e modificar.

Note que **o componente não re-renderiza com cada incremento.** Assim como state, refs são retidos pelo React entre re-renderizações. Entretanto, alterar o state re-renderiza um componente. Mudar um ref não!

## Exemplo: construindo um cronômetro {/*example-building-a-stopwatch*/}

Você pode combinar refs e state em um único componente. Por exemplo, vamos fazer um cronômetro que o usuário possa iniciar ou parar ao pressionar um botão. Para exibir quanto tempo passou desde que o usuário pressionou "Start", você precisará rastrear quando o botão Start foi pressionado e qual o horário atual.
**Essas informações são usadas para renderização, então as manteremos no state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Quando o usuário pressionar "Start", você usará [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) para atualizar o tempo a cada 10 milissegundos:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Inicia contagem.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Atualizar o tempo atual a cada 10 milissegundos.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

Quando o botão "Stop" é pressionado, você precisará cancelar o intervalo existente de forma que ele pare de atualizar a variável `now` do state.Você pode fazer isso invocando ['clearInterval'](https://developer.mozilla.org/pt-BR/docs/Web/API/clearInterval), mas você precisará passar o ID do intervalo que foi retornado anteriormente pela invocação do `setInterval` quando o usuário pressionou Start. Você precisará gravar esse ID do intervalo em algum lugar. **Já que o ID do intervalo não é usado para renderização, você pode guardá-lo em um ref:**

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

Quando uma informação é usada para renderização, mantenha-a no state. Quando uma informação é necessária somente por manipuladores de eventos (event handlers) e mudá-la não requer uma re-renderização, usar um ref pode ser mais eficiente.

## Diferenças entre refs e state {/*differences-between-refs-and-state*/}

Talvez você esteja pensando que refs parecem ser menos "rigorosos" que state—você pode mutá-los ao invés de sempre ter que usar uma função de definir state, por exemplo. Mas na maioria dos casos, você irá querer usar state. Refs são uma "válvula de escape" que você não precisará com frequência. Aqui uma comparação entre state e refs:

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` retorna `{ current: initialValue }`                            | `useState(initialValue)` retorna o valor atual de uma variável de state e uma função setter do state ( `[value, setValue]`) |
| Não provoca re-renderização quando alterada.                                         | Provoca re-renderização quando alterada.                     |
| Mutável—você pode modificar e atualizar o valor de `current` de fora do processo de renderização. | "Imutável"—você deve usar a função de definir state para modificar variáveis de state e despachar uma re-renderização.                   |
| Você não deve ler (ou sobrescrever) o valor de `current` durante uma rerenderização. | Você pode ler state a qualquer momento. Entretanto, cada renderização tem seu [snapshot](/learn/state-as-a-snapshot) do state o qual não muda.

Aqui um botão contador que foi implementado com state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Como o valor `count` é exibido, faz sentido usar um valor de state para ele. Quando o valor do contador é definido com `setCount()`, React re-renderiza o componente e a tela é atualizada para refletir o novo valor.

Se você tentasse implementar isso com um ref, React nunca re-renderizaria o componente, então você nunca veria o contador mudar! Veja como, ao clicar neste botão, **seu texto não é atualizado**:

<Sandpack>

```js {expectedErrors: {'react-compiler': [13]}}
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Isso não re-renderiza o componente!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

É por isso que ler `ref.current` durante a renderização leva a um código não confiável. Se você precisar disso, dê preferência ao state.

<DeepDive>

#### como useRef funciona por dentro? {/*how-does-use-ref-work-inside*/}

Apesar de ambos `useState` e `useRef` serem providos pelo React, em princípio `useRef` poderia ser implementado _em cima de_ `useState`. Você pode imaginar que dentro do React, `useRef` é implementado assim:

```js
// Dentro do React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Durante a primeira renderização, `useRef` retorna `{ current: initialValue }`. Este objeto é armazenado pelo React, então durante a próxima renderização o mesmo objeto será retornado. Note como o setter do state não é utilizado neste exemplo. Ele é desnecessário porque `useRef` precisa sempre retornar o mesmo objeto!

O React oferece uma versão integrada do useRef porque é algo comum na prática. No entanto, você pode pensar nele como uma variável de state normal sem um setter. Se você está familiarizado com programação orientada a objetos, refs podem te lembrar dos campos de instância -- mas em vez de `this.something` você escreve `somethingRef.current`.

</DeepDive>

## Quando usar refs {/*when-to-use-refs*/}

Normalmente, você usará um ref quando o seu componente precisa "sair" do React e se comunicar com APIs externas, frequentemente uma API do navegador que não afetará a aparência do componente. Aqui estão algumas destas situações raras:

- Armazenando IDs de [temporizadores (timeouts)](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)
- Armazenando e manipulando [elementos DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Element), que são abordados [na próxima página](/learn/manipulating-the-dom-with-refs)
- Armazenando outros objetos que não são necessários para calcular o JSX.

Se o seu componente precisa armazenar algum valor, mas isso não afeta a lógica de renderização, escolha refs.

## Melhores práticas para refs {/*best-practices-for-refs*/}

Seguir esses princípios tornará seus componentes mais previsíveis:

- **Trate refs como uma saída de emergência.** Refs são úteis quando você trabalha com sistemas externos ou APIs de navegador. Se grande parte da lógica da sua aplicação e fluxo de dados dependem de refs, talvez seja necessário repensar suaa abordagem.
- **Não leia nem escreva sobre `ref.current` durante a renderização.** Se alguma informação for necessária durante a renderização, use [state](/learn/state-a-components-memory). Como o React não sabe quando `ref.current` muda, até mesmo a leitura durante a renderização torna o comportamento do seu componente difícil de prever. (A única exceção a isso é código como `if (!ref.current) ref.current = new Thing()`, que define o ref apenas uma vez durante a primeira renderização.)

As limitações do state do React não se aplicam aos refs. Por exemplo, o state age como uma [foto instantânea para cada renderização](/learn/state-as-a-snapshot) e [não atualiza de forma síncrona.](/learn/queueing-a-series-of-state-updates) Mas quando você altera o valor atual de um ref, ele muda imediatamente:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Isso é porque **o ref em si é um objeto JavaScript normal,** e portanto se comporta como um.

Você também não precisa se preocupar em [evitar a mutação](/learn/updating-objects-in-state) quando trabalha com um ref. Desde que o objeto que você está mutando não seja usado para renderização, o React não se importa com o que você faz com o ref ou seu conteúdo.

## Refs e o DOM {/*refs-and-the-dom*/}

You can point a ref to any value. However, the most common use case for a ref is to access a DOM element. For example, this is handy if you want to focus an input programmatically. When you pass a ref to a `ref` attribute in JSX, like `<div ref={myRef}>`, React will put the corresponding DOM element into `myRef.current`. Once the element is removed from the DOM, React will update `myRef.current` to be `null`. You can read more about this in [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Refs são uma saída de emergência para manter valores que não são usados para renderização. Você não precisará deles com frequência.
- Um ref é um objeto JavaScript simples com uma única propriedade chamada `current`, que você pode ler ou definir.
- Você pode solicitar um ref ao React chamando o Hook `useRef`.
- Assim como o state, refs permitem que você retenha informações entre re-renderizações de um componente.
- Ao contrário do state, definir o valor `current` do ref não provoca uma re-renderização.
- Não leia nem escreva sobre `ref.current` durante a renderização. Isso torna o comportamento do seu componente difícil de prever.


</Recap>



<Challenges>

#### Consertar um input de chat quebrado {/*fix-a-broken-chat-input*/}

Digite uma mensagem e clique em "Send". Você perceberá que há um atraso de três segundos antes de ver o alerta "Sent!". Durante esse atraso, você pode ver um botão "Undo". Clique nele. Este botão "Undo" deve impedir que a mensagem "Sent!" apareça. Ele faz isso chamando [`clearTimeout`](https://developer.mozilla.org/pt-BR/docs/Web/API/clearTimeout) para o ID do temporizador salvo durante `handleSend`. No entanto, mesmo depois de clicar em "Undo", a mensagem "Sent!" ainda aparece. Descubra por que isso não funciona e corrija-o.

<Hint>

Variáveis comuns como `let timeoutID` não "sobrevivem" entre re-renderizações, porque cada re-renderização executa o seu componente (e inicializa suas variáveis) do zero. Será que você deveria manter o ID do temporizador em outro lugar?

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Sempre que o seu componente re-renderiza (como quando você altera state), todas as variáveis locais são inicializadas do zero. É por isso que você não pode salvar o ID do temporizador em uma variável local como `timeoutID` e esperar que outro manipulador de eventos (event handler) o "veja" no futuro. Em vez disso, armazene-o em uma ref, que o React preservará entre as re-renderizações.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Conserte um componente que falha ao re-renderizar {/*fix-a-component-failing-to-re-render*/}

Este botão deveria alternar entre mostrar "On" e "Off". No entanto, ele sempre mostra "Off". O que há de errado com este código? Corrija-o.

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Neste exemplo, o valor _current_ de um ref é usado para calcular a o retorno da renderização: `{isOnRef.current ? 'On' : 'Off'}`. Isso é um sinal de que essa informação não deveria estar em um ref, e em vez disso, deveria ter sido colocada no state. Para corrigir isso, remova o ref e use state em seu lugar:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Consertar agrupamento (debouncing) {/*fix-debouncing*/}

Neste exemplo, todos os manipuladores de cliques dos botões estão ["agrupados" (debounced).](https://kettanaito.com/blog/debounce-vs-throttle) Para entender o que isso significa, clique em um dos botões. Observe como a mensagem aparece um segundo depois. Se você pressionar o botão enquanto aguarda a mensagem, o temporizador será reiniciado. Portanto, se você continuar clicando rapidamente muitas vezes no mesmo botão, a mensagem não aparecerá até um segundo *depois* de você parar de clicar. O agrupamento (debouncing) permite que você atrase alguma ação até que o usuário "pare de fazer coisas".

Este exemplo funciona, mas não exatamente como pretendido. Os botões não são independentes. Para ver o problema, clique em um dos botões e, imediatamente depois, clique em outro botão. Você esperaria que após um atraso, você visse as mensagens de ambos os botões. Mas apenas a mensagem do último botão aparece. A mensagem do primeiro botão se perde.

Por que os botões estão interferindo um com o outro? Encontre e corrija o problema.

<Hint>

O último ID de temporizador (timeout) é compartilhado entre todos os componentes `DebouncedButton`. É por isso que clicar em um botão reinicia o timeout do outro botão. Você pode armazenar um ID de temporizador separado para cada botão?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Uma variável como `timeoutID` é compartilhada entre todos os componentes. É por isso que clicar no segundo botão reinicia o timeout pendente do primeiro botão. Para corrigir isso, você pode armanezar o timeout em um ref. Cada botão terá seu próprio ref, portanto, eles não entrarão em conflito entre si. Observe como clicar em dois botões rapidamente mostrará as duas mensagens.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Ler o state mais recente {/*read-the-latest-state*/}

Neste exemplo, após pressionar "Send", há um pequeno atraso antes que a mensagem seja exibida. Digite "hello", pressione Send e, em seguida, edite rapidamente a entrada novamente. Apesar de suas edições, o alerta ainda mostrará "hello" (que era o valor do state [naquele momento](/learn/state-as-a-snapshot#state-over-time) em que o botão foi clicado).

Normalmente, esse comportamento é o que você deseja em um aplicativo. No entanto, pode haver situações ocasionais em que você deseja que algum código assíncrono leia a versão *mais recente* de algum estado. Você consegue pensar em uma maneira de fazer o alerta mostrar o texto de entrada *atual*, em vez do que estava no momento do clique?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

O estado funciona [como uma foto instantânea](/learn/state-as-a-snapshot), então você não pode ler o estado mais recente de uma operação assíncrona como um timeout. No entanto, você pode manter o texto de entrada mais recente em um ref. O ref é mutável, então você pode ler a propriedade `current` a qualquer momento. Como o texto atual também é usado para renderização, neste exemplo, você precisará de *ambos* uma variável de state (para a renderização) *e* um ref (para lê-lo no timeout). Você precisará atualizar o valor `current` do ref manualmente.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
