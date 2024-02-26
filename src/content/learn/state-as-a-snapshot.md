---
title: State como uma Foto Instantânea
---

<Intro>

Variáveis de estado podem parecer variáveis JavaScript regulares das quais você pode ler e escrever. No entanto, estado se comporta mais como uma foto instantânea. Modificá-lo não altera a variável de estado que você já tem, mas sim dispara uma nova renderização.

</Intro>

<YouWillLearn>

* Como manipulações de estado disparam novas renderizações
* Quando e como atualizar o estado
* Por que o estado não é atualizado imediatamente após você modificá-lo
* Como os manipuladores de eventos acessam uma "foto instantânea" do estado

</YouWillLearn>

## Manipulações de estado disparam novas renderizações {/*setting-state-triggers-renders*/}

Você pode pensar que sua interface do usuário muda diretamente em resposta ao evento do usuário, como um clique. No React, isso funciona de forma um pouco diferente deste modelo mental. Na página anterior, você viu que [manipular o estado solicita uma nova renderização](/learn/render-and-commit#step-1-trigger-a-render) do React. Isso significa que, para uma interface reagir ao evento, você precisa *atualizar o state*.

Neste exemplo, quando você pressiona "enviar", `setIsSent(true)` diz ao React para renderizar novamente a interface:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Olá!');
  if (isSent) {
    return <h1>Sua mensagem está a caminho!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Veja o que acontece quando você clica no botão:

1. O manipulador de evento `onSubmit` é executado.
2. `setIsSent(true)` define `isSent` como `true` e enfileira uma nova renderização.
3. O React rerrenderiza o componente de acordo com o novo valor de `isSent`.

Vamos dar uma olhada mais de perto na relação entre estado e renderização.

## Renderização tira uma foto instantânea {/*rendering-takes-a-snapshot-in-time*/}

["Renderizar"](/learn/render-and-commit#step-2-react-renders-your-components) significa que o React está chamando seu componente, que é uma função. O JSX que você retorna dessa função é como uma foto instantânea da interface do usuário em um determinado momento. Suas *props*, manipuladores de eventos e variáveis locais foram todas calculadas **usando seu estado no momento da renderização.**

Ao contrário de uma fotografia ou um *frame* de um filme, a foto instantânea da interface do usuário que você retorna é interativa. Ela inclui lógica como manipuladores de eventos que especificam o que acontece em resposta às entradas. O React atualiza a tela para corresponder a essa foto instantânea e conecta os manipuladores de eventos. Como resultado, pressionar um botão acionará o manipulador de clique do seu JSX.

Quando o React rerrenderiza um componente:

<<<<<<< HEAD
1. O React chama sua função novamente.
2. Sua função retorna uma nova foto instantânea do JSX.
3. O React, então, atualiza a tela para corresponder à foto instantânea que você retornou.
=======
1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot your function returned.
>>>>>>> 081d1008dd1eebffb9550a3ff623860a7d977acf

<IllustrationBlock sequential>
    <Illustration caption="React executando a função" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculando a foto instantânea" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Atualizando a árvore DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Assim como a memória de um componente, o estado não é como uma variável regular que desaparece após a função retornar. O estado realmente "vive" no React, fora da sua função. Quando o React chama seu componente, ele lhe dá uma foto instantânea do estado para aquela renderização específica. Seu componente retorna uma foto instantânea da interface do usuário com um novo conjunto de *props* e manipuladores de eventos em seu JSX, todos calculados **usando os valores do estado daquela renderização!**

<IllustrationBlock sequential>
  <Illustration caption="Você diz ao React para atualizar o state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React atualiza o valor do state" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passa uma foto instantânea do valor do state para o componente" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Aqui está um pequeno experimento para mostrar como isso funciona. Neste exemplo, você pode esperar que clicar no botão "+3" incremente o contador três vezes porque ele chama `setNumber(number + 1)` três vezes.

Veja o que acontece quando você clica no botão "+3":

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Observe que `number` só incrementa uma vez por clique!

**Manipular o estado o altera apenas para a *próxima* renderização.** Durante a primeira renderização, `number` era `0`. É por isso que, no manipulador de `onClick` *daquela renderização*, o valor de `number` ainda é `0` mesmo depois de `setNumber(number + 1)` ter sido chamado:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Aqui está o que o manipulador de `onClick` deste botão diz ao React para fazer:

1. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - O React se prepara para mudar `number` para `1` na próxima renderização.
2. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - O React se prepara para mudar `number` para `1` na próxima renderização.
3. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - O React se prepara para mudar `number` para `1` na próxima renderização.

Mesmo que você tenha chamado `setNumber(number + 1)` três vezes, no manipulador de eventos *daquela renderização* `number` é sempre `0`, então você definiu o estado para `1` três vezes. É por isso que, depois que o manipulador de eventos termina, o React rerrenderiza o componente com `number` igual a `1` em vez de `3`.

Você também pode visualizar isso substituindo mentalmente as variáveis de estado por seus valores no seu código. Como a variável de estado `number` é `0` para *essa renderização*, seu manipulador de eventos se parece com isto:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Para a próxima renderização, `number` é `1`, então o manipulador de eventos *daquela renderização* se parece com isto:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

É por isso que clicar no botão novamente definirá o contador para `2`, depois para `3` no próximo clique e assim por diante.

## Estado ao longo do tempo {/*state-over-time*/}

Bem, isso foi divertido. Tente adivinhar o que clicar neste botão irá alertar:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Se você usar o método de substituição de antes, você pode adivinhar que o alerta mostra "0":

```js
setNumber(0 + 5);
alert(0);
```

Mas e se você colocar um temporizador no alerta, para que ele só seja disparado *depois* do componente ser renderizado novamente? Ele diria "0" ou "5"? Dê um palpite!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Surpreso? Se você usar o método de substituição, você pode ver a "instantânea" do estado passado para o alerta.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

O estado armazenado no React pode ter mudado no momento em que o alerta é executado, mas ele foi agendado usando uma "instantânea" do estado no momento em que o usuário interagiu com ele!

**O valor de uma variável de estado nunca muda dentro de uma renderização,** mesmo que o código do manipulador de eventos seja assíncrono. Dentro do `onClick` *daquela renderização*, o valor de `number` continua sendo `0` mesmo depois que `setNumber(number + 5)` foi chamado. Seu valor foi "fixado" quando o React "tirou a foto" da UI chamando seu componente.

Aqui está um exemplo de como isso torna seus manipuladores de eventos menos propensos a erros de sincronização. Abaixo está um formulário que envia uma mensagem com um atraso de cinco segundos. Imagine este cenário:

1. Você pressiona o botão "Enviar", enviando "Olá" para Alice.
2. Antes que o atraso de cinco segundos termine, você muda o valor do campo "Para" para "Bob".

O que você espera que o `alert` mostre? Ele exibiria "Você disse Olá para Alice"? Ou exibiria "Você disse Olá para Bob"? Faça uma suposição com base no que você sabe e, em seguida, tente:

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
        placeholder="Message"
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

O React mantém os valores do estado "fixos" dentro dos manipuladores de eventos de uma renderização. Você não precisa se preocupar se o estado mudou enquanto o código está sendo executado.

Mas e se você quiser ler o estado mais recente antes de uma rerrenderização? Você vai querer usar uma [função de atualização de estado](/learn/queueing-a-series-of-state-updates), abordado na próxima página!

<Recap>

* Manipular o estado solicita uma nova renderização.
* O React armazena o estado fora do seu componente, como se estivesse em uma prateleira.
* Quando você chama `useState`, o React te dá uma "instantânea" do estado *daquela renderização*.
* Variáveis e manipuladores de eventos não "sobrevivem" às rerrenderizações. Cada renderização tem seus próprios manipuladores de eventos.
* Cada renderização (e funções dentro dela) sempre "vê" a "instantânea" do estado que o React deu para *aquela* renderização.
* Você pode substituir mentalmente o estado nos manipuladores de eventos, de forma semelhante à forma como você pensa sobre o JSX renderizado.
* Manipuladores de eventos criados no passado têm os valores do estado da renderização em que foram criados.

</Recap>



<Challenges>

#### Implemente um semáforo {/*implement-a-traffic-light*/}

Aqui está um componente de semáforo que alterna quando o botão é pressionado:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Mudar para {walk ? 'Pare' : 'Prossiga'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Prossiga' : 'Pare'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Adicione um `alert` ao manipulador de cliques. Quando a luz estiver verde e disser "Prossiga", clicar no botão deve dizer "Pare a seguir". Quando a luz estiver vermelha e disser "Pare", clicar no botão deve dizer "Prossiga a seguir".

Faz diferença se você colocar o `alert` antes ou depois da chamada `setWalk`?

<Solution>

Seu `alert` deve parecer com isto:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Pare a seguir' : 'Prossiga a seguir');
  }

  return (
    <>
      <button onClick={handleClick}>
        Mudar para {walk ? 'Pare' : 'Prossiga'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Prossiga' : 'Pare'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Você colocar ele antes ou depois da chamada `setWalk` não faz diferença. O valor de `walk` daquela renderização é fixo. Chamar `setWalk` só irá alterá-lo para a *próxima* renderização, mas não afetará o manipulador de eventos da renderização anterior.

Esta linha pode parecer contra-intuitiva à primeira vista:

```js
alert(walk ? 'Pare a seguir' : 'Prossiga a seguir');
```

Mas faz sentido se você ler como: "Se o semáforo mostrar 'Prossiga agora', a mensagem deve dizer 'Pare a seguir'". A variável `walk` dentro do seu manipulador de eventos corresponde ao valor de `walk` daquela renderização, e não muda.

Você pode verificar que isso está correto aplicando o método de substituição. Quando `walk` é `true`, você obtém:

```js
<button onClick={() => {
  setWalk(false);
  alert('Pare a seguir');
}}>
  Mudar para Pare
</button>
<h1 style={{color: 'darkgreen'}}>
  Prossiga
</h1>
```

Então, clicar "Mudar para Pare" enfileira uma renderização com `walk` alterado para `false`, e alerta "Pare a seguir".

</Solution>

</Challenges>
