---
title: Renderizar e Confirmar
---

<Intro>

Antes de seus componentes serem exibidos em tela, eles devem ser renderizados pelo React. Entender as etapas desse processo irá te ajudar a pensar sobre como seu código é executado e a explicar seu comportamento.

</Intro>

<YouWillLearn>

* O que significa renderização no React
* Quando e porque o React renderiza um componente
* As etapas envolvidas na exibição de um componente na tela
* Por que a renderização nem sempre produz uma atualização no DOM

</YouWillLearn>

Imagine que seus componentes são cozinheiros na cozinha, preparando pratos saborosos com ingredientes. Nesse cenário, o React é o garçom que faz as solicitações dos clientes e traz seus pedidos. Esse processo de solicitação e veiculação da interface do usuário tem três etapas:

1. **Acionando** uma renderização (entregar o pedido do cliente na cozinha)
2. **Renderizando** o componente (preparar o pedido na cozinha)
3. **Confirmar** com o DOM (colocar o pedido na mesa)

<IllustrationBlock sequential>
  <Illustration caption="Acionando" alt="Como um servidor React em um restaurante, buscando pedidos dos usuários e entregando-os na Cozinha de Componentes." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Renderizando" alt="O Card Chef dá ao React um novo componente Card." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Confirmar" alt="O React entrega o Card ao usuário em sua mesa." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Etapa 1: Acionar uma renderização {/*step-1-trigger-a-render*/}

Há duas razões para um componente ser renderizado

1. É a **renderização inicial** do componente.
2. O estado do componente (ou de um de seus ancestrais) **foi atualizado.**

### Renderização inicial {/*initial-render*/}

Quando seu app é iniciado, você precisa acionar uma renderização inicial. Às vezes, Frameworks e sandboxes ocultam esse código, mas isso é feito chamando [`createRoot`](/reference/react-dom/client/createRoot) com o alvo de nó DOM, e em seguida, chamando seu método `render` com seu componente:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' de Eduardo Catalano: uma gigantesca escultura metálica de flores com pétalas reflexivas"
    />
  );
}
```

</Sandpack>

Tente comentar a chamada `root.render()` e veja o componente desaparecer!

### Rerrenderizar quando o estado é atualizado {/*re-renders-when-state-updates*/}

Uma vez que o componente foi renderizado inicialmente, você pode acionar outras renderizações atualizando seu estado com a função [`set`](/reference/react/useState#setstate). A atualização do estado do seu componente enfileira automaticamente uma renderização. (Você pode imaginá-los como um cliente de restaurante pedindo chá, sobremesa e todo tipo de coisas depois de fazer o primeiro pedido, dependendo do estado de sede ou fome.)

<IllustrationBlock sequential>
<<<<<<< HEAD
  <Illustration caption="Atualização de Estado..." alt="Como um servidor React em um restaurante, servindo uma interface do usuário do cartão para o usuário, representado como um usuário com um cursor para sua cabeça. O patrono expressa que quer um cartão rosa, não preto!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React retorna à Cozinha de Componentes e diz ao Card Chef que eles precisam de um Card rosa." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="O Card Chef dá ao React o cartão rosa." src="/images/docs/illustrations/i_rerender3.png" />
=======
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
>>>>>>> 5138e605225b24d25701a1a1f68daa90499122a4
</IllustrationBlock>

## Etapa 2: React renderiza seus componentes {/*step-2-react-renders-your-components*/}

Depois de acionar uma renderização, o React chama seus componentes para descobrir o que exibir na tela. **"Renderização" é o React chamando seus componentes.**

* **Na renderização inicial,** o React chamará o componente raiz.
* **Para renderizações seguintes,** o React chamará o componente de função cuja atualização de estado acionou a renderização.

Este processo é recursivo: se o componente atualizado retornar algum outro componente, o React renderizará _aquele_ componente a seguir, e se esse componente também retornar algo, ele renderizará _aquele_ componente em seguida e assim por diante. O processo continuará até que não haja mais componentes aninhados e o React saiba exatamente o que deve ser exibido na tela.

<<<<<<< HEAD
No exemplo a seguir, o React chamará `Gallery()` e `Image()` várias vezes:
=======
In the following example, React will call `Gallery()` and `Image()` several times:
>>>>>>> 5138e605225b24d25701a1a1f68daa90499122a4

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Esculturas inspiradoras</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' de Eduardo Catalano: uma gigantesca escultura metálica de flores com pétalas reflexivas"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Durante a renderização inicial,** o React [criará os nós DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) para `<section>`, `<h1>`, e três tags `<img>`.
* **Durante uma rerrenderização,** o React calculará quais de suas propriedades, se houver, foram alterados desde a renderização anterior. Ele não fará nada com essa informação até a próxima etapa, a fase de confirmação.

<Pitfall>

A renderização sempre deve ser um [cálculo puro](/learn/keeping-components-pure):

* **Mesmas entradas, mesma saída.** Dadas as mesmas entradas, um componente deve sempre retornar o mesmo JSX. (Quando alguém pede uma salada com tomate, não deve receber uma salada com cebola!)
* **Ele cuida de seus próprios negócios.** Ele não deve alterar nenhum objeto ou variável que existia antes da renderização. (Um pedido não deve alterar o pedido de ninguém.)

Caso contrário, você pode encontrar bugs confusos e comportamento imprevisível à medida que sua base de código cresce em complexidade. Ao desenvolver no "Modo estrito (Strict Mode)", o React chama a função de cada componente duas vezes, o que pode ajudar a detectar erros causados por funções impuras.

</Pitfall>

<DeepDive>

#### Otimizando o desempenho {/*optimizing-performance*/}

O comportamento padrão de renderizar todos os componentes aninhados no componente atualizado não é ideal para desempenho se o componente atualizado estiver muito alto na árvore. Se você tiver um problema de desempenho, existem várias maneiras opcionais de resolvê-lo descritas na seção [Desempenho](https://reactjs.org/docs/optimizing-performance.html). **Não otimize prematuramente!**

</DeepDive>

## Etapa 3: O React confirma as alterações no DOM {/*step-3-react-commits-changes-to-the-dom*/}

<<<<<<< HEAD
Depois de renderizar (chamar) seus componentes, o React modificará o DOM.

* **Para a renderização inicial,** o React usará a API DOM [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) para colocar todos os nós DOM criados na tela. 
* **Para rerrenderizações,** o React aplicará as operações mínimas necessárias (calculadas durante a renderização!) Para fazer o DOM corresponder à última saída de renderização.
=======
After rendering (calling) your components, React will modify the DOM.

* **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen.
* **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
>>>>>>> 5138e605225b24d25701a1a1f68daa90499122a4

**O React apenas altera os nós do DOM se houver uma diferença entre as renderizações.** Por exemplo, aqui está um componente que renderiza novamente com props diferentes passados de seu pai a cada segundo. Observe como você pode adicionar algum texto no `<input>`, atualizando seu `valor`, mas o texto não desaparece quando o componente renderiza novamente:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Isso funciona porque durante esta última etapa, o React apenas atualiza o conteúdo de `<h1>` com o novo `time`. Ele vê que o `<input>` aparece no JSX no mesmo lugar da última vez, então o React não toca no `<input>`—ou no seu `value`!
## Epílogo: pintura do Navegador {/*epilogue-browser-paint*/}

Após a renderização ser concluída e o React atualizar o DOM, o navegador irá repintar a tela. Embora esse processo seja conhecido como "renderização do navegador", vamos nos referir a ele como "pintura" para evitar confusão ao longo dos documentos.

<Illustration alt="Um navegador pintando 'natureza morta com elemento de cartão'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Qualquer atualização de tela em um app React ocorre em três etapas:
  1. Acionar
  2. Renderizar
  3. Confirmar
* Você pode usar o Modo Estrito (Strict Mode) para encontrar erros em seus componentes
* O React não toca no DOM se o resultado da renderização for o mesmo da última vez

</Recap>
