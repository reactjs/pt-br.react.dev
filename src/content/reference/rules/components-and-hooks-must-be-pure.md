---
title: Componentes e Hooks devem ser puros
---

<Intro>
Funções puras realizam apenas um cálculo e nada mais. Isso torna seu código mais fácil de entender, depurar e permite que o React otimize automaticamente seus componentes e Hooks corretamente.
</Intro>

<Note>
Esta página de referência cobre tópicos avançados e demanda familiaridade com os conceitos abordados na página [Mantendo Componentes Puros](/learn/keeping-components-pure).
</Note>

<InlineToc />

### Por que a pureza é importante? {/*why-does-purity-matter*/}

Um dos conceitos fundamentais que define o React é a pureza. Um componente ou hook puro é aquele que é:

* **Idempotente** – Obtém [sempre o mesmo resultado toda vez que](/learn/keeping-components-pure#purity-components-as-formulas) é executado com as mesmas entradas - props, state, contexto para entradas de componentes; e argumentos para entradas de hooks.
* **Não tem efeitos colaterais na renderização** – O código com efeitos colaterais deve ser executado [**separadamente da renderização**](#how-does-react-run-your-code). Como por exemplo um [manipulador de eventos (event handler)](/learn/responding-to-events) – em que o usuário interage com a UI e a faz atualizar; ou como um [Effect](/reference/react/useEffect) – que é executado após a renderização.
* **Não altera valores não locais**: Componentes e Hooks não devem [nunca modificar valores que não são criados localmente](#mutation) na renderização.

Quando a renderização é mantida pura, o React pode entender como priorizar quais atualizações são mais importantes para o usuário ver primeiro. Isso é possível por causa da pureza do render: como os componentes não têm efeitos colaterais [no render](#how-does-react-run-your-code), o React pode pausar a renderização de componentes que não são tão importantes para atualizar, e só voltar a eles mais tarde quando for necessário.

Concretamente, isto significa que a lógica de renderização pode ser executada várias vezes de uma forma que permite ao React dar ao usuário uma experiência agradável. No entanto, se o seu componente tiver um efeito colateral não rastreado - como modificar o valor de uma variável global [durante a renderização](#how-does-react-run-your-code) - quando o React executar seu código de renderização novamente, seus efeitos colaterais serão acionados de uma forma que não corresponderá ao que você deseja. Isso geralmente leva a bugs inesperados que podem degradar a forma como seus usuários experimentam seu aplicativo. Você pode ver um [exemplo disso na página Keeping Components Pure](/learn/keeping-components-pure#side-effects-unintended-consequences).


#### Como é que o React executa o seu código?? {/*how-does-react-run-your-code*/}

O React é declarativo: você diz ao React _o que_ renderizar, e o React vai descobrir _como_ melhor exibir isso para o seu usuário. Para fazer isso, o React tem algumas fases onde ele executa seu código. Você não precisa saber sobre todas essas fases para usar bem o React. Mas em um nível alto, você deve saber qual código é executado em um _render_, e o que é executado fora dele.

_Renderização_ refere-se ao cálculo de como deve ser a próxima versão da sua UI. Após a renderização, [Effects](/reference/react/useEffect) são _flushed_ (significando que eles são executados até que não haja mais nenhum) e podem atualizar o cálculo se os Effects tiverem impactos no layout. O React pega esse novo cálculo e o compara com o cálculo usado para criar a versão anterior da sua UI, então _compromete_ apenas as mudanças mínimas necessárias para o [DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model) (o que o seu usuário realmente vê) para atualizá-lo para a versão mais recente.

<DeepDive>

#### Como saber se o código é executado na renderização {/*how-to-tell-if-code-runs-in-render*/}

Uma heurística rápida para saber se o código é executado durante a renderização é examinar onde ele está: se estiver escrito no nível superior, como no exemplo abaixo, há uma boa chance de ser executado durante a renderização.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // criado durante a renderização
  // ...
}
```

Manipuladores de eventos e efeitos não são executados na renderização:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // este código está em um manipulador de eventos, logo, só é executado quando o usuário o aciona
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // este código está dentro de um Effect, por isso só é executado após a renderização
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Componentes e os Hooks devem ser idempotentes {/*components-and-hooks-must-be-idempotent*/}

Os componentes devem devolver sempre o mesmo resultado relativamente às suas entradas - props, state e contexto. Isto é conhecido como _idempotência_. [Idempotência](https://en.wikipedia.org/wiki/Idempotence) é um termo popularizado na programação funcional. Refere-se à ideia de que [obtém sempre o mesmo resultado de cada vez que](learn/keeping-components-pure) executa esse pedaço de código com as mesmas entradas.

Isto significa que _todo_ o código que corre [durante a renderização](#how-does-react-run-your-code) também tem de ser idempotente para que esta regra se mantenha. Por exemplo, esta linha de código não é idempotente (e, portanto, o componente também não é):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Mau: apresenta sempre um resultado diferente!!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` não é idempotente, uma vez que devolve sempre a data atual e altera o seu resultado sempre que é chamado. Ao renderizar o componente acima, a hora exibida na tela ficará presa na hora em que o componente foi renderizado. Da mesma forma, funções como `Math.random()` também não são idempotentes, pois retornam resultados diferentes a cada vez que são chamadas, mesmo quando as entradas são as mesmas.

Isso não significa que você não deva usar funções não-idempotentes como `new Date()` _em tudo_ - você deve apenas evitar usá-las [durante a renderização](#how-does-react-run-your-code). Neste caso, podemos  sincronizar a última data para este componente usando um [Effect](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Mantém o controle do estado da data atual. `useState` recebe uma função inicializadora como seu
  //    estado inicial. Ela é executada apenas uma vez quando o hook é chamado, então apenas a data atual
  //    no momento em que o hook é chamado é definida inicialmente.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Atualiza a data atual a cada segundo usando `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Bom: o código não-idempotente não é mais executado na renderização
    }, 1000);
    // 3. Retorna uma função de limpeza para não vazar o timer `setInterval`.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Ao encapsular a chamada não-idempotente `new Date()` em um Effect, ele move esse cálculo [para fora da renderização](#how-does-react-run-your-code).

Se não precisar sincronizar algum state externo com o React, pode também considerar a utilização de um [manipulador de eventos (event handler)](/learn/responding-to-events) se apenas precisar ser atualizado em resposta a uma interação do usuário.
---

## Efeitos colaterais devem ser executados fora da renderização {/*side-effects-must-run-outside-of-render*/}

[Efeitos colaterais](/learn/keeping-components-pure#side-effects-unintended-consequences) não devem ser executados [no render](#how-does-react-run-your-code), pois o React pode renderizar componentes várias vezes para criar a melhor experiência possível para o usuário.


<Note>
Efeitos colaterais são um termo mais amplo que Efeitos. Efeitos referem-se especificamente a código que está envolvido em `useEffect`, enquanto um efeito colateral é um termo geral para código que tem qualquer efeito observável além de seu resultado primário de retornar um valor para quem o chamou.

Efeitos colaterais são tipicamente escritos dentro de [manipuladores de evento](/learn/responding-to-events) ou Effects. Mas nunca durante a renderização.

</Note>

Enquanto o render deve ser mantido puro, efeitos colaterais são necessários em algum momento para que sua aplicação faça algo interessante, como mostrar algo na tela! O ponto chave dessa regra é que efeitos colaterais não devem rodar [no render](#how-does-react-run-your-code), já que o React pode renderizar componentes múltiplas vezes. Na maioria dos casos, você vai usar [event handlers](learn/responding-to-events) para lidar com efeitos colaterais. Usar um manipulador de eventos diz explicitamente ao React que esse código não precisa ser executado durante a renderização, mantendo a renderização pura. Se você já esgotou todas as opções - e apenas como último recurso - você também pode lidar com efeitos colaterais usando `useEffect`.

### Quando é que se pode ter uma mutação? {/*mutation*/}

#### Mutação local {/*local-mutation*/}
Um exemplo comum de efeito colateral é a mutação, que em JavaScript se refere à alteração do valor de uma variável não-[primitiva](https://developer.mozilla.org/pt-BR/docs/Glossary/Primitive). Em geral, embora a mutação não seja idiomática no React, a mutação _local_ é absolutamente boa:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Bom: criado localmente
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Bom: a mutação local é aceitável
  }
  return <section>{items}</section>;
}
```

Não há necessidade de contorcer o seu código para evitar a mutação local. [`Array.map`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map) também poderia ser usado aqui por questões de brevidade, mas não há nada de errado em criar um array local e então colocar itens nele [durante a renderização](#how-does-react-run-your-code).

Mesmo que pareça que estamos mutando `items`, o ponto chave a ser observado é que este código só faz isso _localmente_ - a mutação não é “lembrada” quando o componente é renderizado novamente. Em outras palavras, `items` só permanece enquanto o componente estiver presente. Como `items` é sempre _recriado_ toda vez que `<FriendList />` é renderizado, o componente sempre retornará o mesmo resultado.

Por outro lado, se `items` foi criado fora do componente, ele mantém seus valores anteriores e se lembra das mudanças:

```js {1,7}
const items = []; // 🔴 Mau: criado fora do componente
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Mau: altera um valor criado fora da renderização
  }
  return <section>{items}</section>;
}
```

Quando `<FriendList />` for executado novamente, continuaremos anexando `friends` a `items` toda vez que o componente for executado, levando a múltiplos resultados duplicados. Esta versão de `<FriendList />` tem efeitos colaterais observáveis [durante a renderização](#how-does-react-run-your-code) e **quebra a regra**.

#### Inicialização preguiçosa {/*lazy-initialization*/}

A inicialização preguiçosa também é boa, apesar de não ser totalmente “pura”:

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Bom: se não afetar outros componentes
  // Continua a renderização
}
```

#### Alterar o DOM {/*changing-the-dom*/}

Os efeitos colaterais que são diretamente visíveis para o utilizador não são permitidos na lógica de renderização dos componentes React. Por outras palavras, a simples chamada de uma função de componente não deve, por si só, produzir uma alteração na tela.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Mau: Altera o DOM
}
```

One way to achieve the desired result of updating `document.title` outside of render is to [synchronize the component with `document`](/learn/synchronizing-with-effects).

Desde que chamar um componente várias vezes seja seguro e não afete a renderização de outros componentes, o React não se importa se é 100% puro no sentido estrito de programação funcional da palavra. É mais importante que [componentes devem ser idempotentes](/reference/rules/components-and-hooks-must-be-pure).

---

## Props and state são imutáveis {/*props-and-state-are-immutable*/}

As props e o state de um componente são imutáveis [snapshots](learn/state-as-a-snapshot). Nunca altere-os diretamente. Ao invés disso, passe novas props para baixo, e use a função setter de `useState`.

Você pode pensar nos valores de props e state como snapshots que são atualizados após a renderização. Por esse motivo, você não modifica as variáveis props ou state diretamente: em vez disso, você passa novas props, ou usa a função setter fornecida para dizer ao React que o state precisa ser atualizado na próxima vez que o componente for renderizado.

### Não alterar Props {/*props*/}
As props são imutáveis porque, se as alterar, a aplicação produzirá resultados inconsistentes, o que pode ser difícil de depurar, uma vez que pode ou não funcionar, dependendo das circunstâncias.

```js {expectedErrors: {'react-compiler': [2]}} {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Mau: nunca alterar diretamente as props
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Bom: fazer uma cópia
  return <Link url={url}>{item.title}</Link>;
}
```

### Não alterar state {/*state*/}
O `useState` devolve a variável de estado e um setter para atualizar esse state.

```js
const [stateVariable, setter] = useState(0);
```

Em vez de atualizar a variável de estado no local, precisamos atualizá-la usando a função setter que é retornada por `useState`. Alterar valores na variável state não faz com que o componente seja atualizado, deixando seus usuários com uma UI desatualizada. Usar a função setter informa ao React que o state foi alterado e que precisamos enfileirar uma nova renderização para atualizar a interface do usuário.

```js {expectedErrors: {'react-compiler': [2, 5]}} {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Mau: nunca alterar diretamente o state
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Bom: utilizar a função setter devolvida por useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## Valores de retorno e os argumentos dos Hooks são imutáveis {/*return-values-and-arguments-to-hooks-are-immutable*/}

Uma vez que os valores são passados para um hook, não deve modificá-los. Como os props em JSX, os valores tornam-se imutáveis quando passados para um hook.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Mau: nunca alterar diretamente os argumentos do hook
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Bom: fazer uma cópia
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Um princípio importante no React é o raciocínio local: a capacidade de entender o que um componente ou hook faz apenas analisando seu código isoladamente. Hooks devem ser tratados como 'caixas pretas' quando são chamados. Por exemplo, um hook personalizado pode ter usado seus argumentos como dependências para memorizar valores internamente:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Se você alterar os argumentos dos Hooks, a memorização do hook personalizado ficará incorreta, portanto, é importante evitar fazer isso.

```js {4}
style = useIconStyle(icon);         // `style` é memorizado com base em `icon`
icon.enabled = false;               // Mau: 🔴 nunca alterar diretamente os argumentos do gancho
style = useIconStyle(icon);         // o resultado previamente memorizado é devolvido
```

```js {4}
style = useIconStyle(icon);         // `style` é memorizado com base em `icon`
icon = { ...icon, enabled: false }; // Bom: ✅ fazer uma cópia
style = useIconStyle(icon);         // o novo valor de `style` é calculado
```

Da mesma forma, é importante não modificar os valores de retorno dos Hooks, pois eles podem ter sido memorizados.

---

## Valores são imutáveis depois de serem passados para o JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

Não altere os valores depois de eles terem sido usados no JSX. Mova a mutação antes que o JSX seja criado.

Quando você usa JSX em uma expressão, o React pode avaliar avidamente o JSX antes que o componente termine de renderizar. Isso significa que mutar valores depois que eles foram passados para o JSX pode levar a UIs desatualizadas, já que o React não saberá atualizar a saída do componente.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Mau: os estilos já foram utilizados no JSX acima
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Bom: criamos um novo valor
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
