---
title: Respondendo a Eventos
---

<Intro>

O React permite você adicionar *manipuladores de eventos* (event handlers) ao seu JSX. Os manipuladores de eventos são funções independentes que são acionadas em resposta a interações como clicar com o mouse, passar o cursor do mouse sobre um certo elemento, focar em campos de formulário, entre outros.

</Intro>

<YouWillLearn>

* Diferentes maneiras de escrever um manipulador de eventos
* Como herdar a lógica de manipulação de eventos de um componente pai
* Como os eventos se propagam e como pará-los

</YouWillLearn>

## Adicionando manipuladores de eventos {/*adding-event-handlers*/}

Para adicionar um manipulador de eventos, primeiro defina uma função e depois [passe-a como uma prop](/learn/passing-props-to-a-component) para o elemento JSX desejado. Por exemplo, aqui temos um botão que ainda não faz nada:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Este botão não faz nada
    </button>
  );
}
```

</Sandpack>

Seguindo esses três passos, você poderá fazer com que uma mensagem seja exibida quando um usuário clicar no botão:

1. Declare uma função chamada `handleClick` *dentro* do seu componente `Button`.
2. Implemente a lógica dentro dessa função (utilize o método `alert` para exibir a mensagem).
3. Adicione `onClick={handleClick}` ao JSX do elemento `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Você clicou no botão!');
  }

  return (
    <button onClick={handleClick}>
      Clique neste botão
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Você definiu a função `handleClick` e depois [a passou como prop](/learn/passing-props-to-a-component) para o elmento `<button>`. O `handleClick` é um **manipulador de eventos.** As funções de manipulador de eventos geralmente:

* São definidas *dentro* de seus componentes.
* Tem nomes que começam com a palavra `handle`, seguida do nome do evento.

Por convenção, é comum nomear manipuladores de eventos com a palavra `handle` seguida do nome do evento. Você verá frequentemente nomes como `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, e assim por diante.

Se desejar, você pode definir um manipulador de eventos diretamente na prop da tag JSX:

```jsx
<button onClick={function handleClick() {
  alert('Você clicou no botão!');
}}>
```

Ou, de forma mais concisa, usando uma arrow function:

```jsx
<button onClick={() => {
  alert('Você clicou no botão!');
}}>
```

Todos esses estilos são equivalentes. Os manipuladores de eventos diretamente na prop são adequados para funções pequenas.

<Pitfall>

As funções passadas para os manipuladores de eventos devem ser passadas como referência, e não chamá-la diretamente. Por exemplo:

| passando uma função como referência (correto)             | chamando uma função (incorreto)    |
| --------------------------------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>`                          | `<button onClick={handleClick()}>` |

A diferença é sutil. No primeiro exemplo, a função `handleClick` é passada como um manipulador de eventos `onClick`. Isso diz ao React para lembrá-lo e apenas chamar sua função quando o usuário clicar no botão.

No segundo exemplo, o `()` no final de `handleClick()` dispara a função *imediatamente* durante a [renderização](/learn/render-and-commit), sem nenhum clique. Isso ocorre porque o JavaScript dentro do [JSX `{` e `}`](/learn/javascript-in-jsx-with-curly-braces) é executado imediatamente.

Quando você escreve código diretamente na prop, você pode cometer o mesmo erro de uma maneira diferente:

| passando uma função como referência (correto)            | chamando uma função (incorreto)   |
| -------------------------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>`                  | `<button onClick={alert('...')}>` |

Passar código diretamente na prop, como no exemplo abaixo, não dispara no clique - ele será disparado toda vez que o componente for renderizado:

```jsx
// Este alerta é acionado quando o componente é renderizado, não quando clicado!
<button onClick={alert('Você clicou em mim!')}>
```

Se você deseja definir seu manipulador de eventos diretamente na prop, envolva-o em uma função anônima da seguinte forma:

```jsx
<button onClick={() => alert('Você clicou em mim!')}>
```

Em vez de executar o código dentro da prop `onClick` a cada renderização, isso cria uma função que será chamada posteriormente.

Em ambos os casos, o que você quer é passar uma função:

* `<button onClick={handleClick}>` passa a função `handleClick`.
* `<button onClick={() => alert('...')}>` passa a função `() => alert('...')`.

[Leia mais sobre as arrow functions.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Lendo props em manipuladores de eventos {/*reading-props-in-event-handlers*/}

Como os manipuladores de eventos são declarados dentro de um componente, eles têm acesso às props do componente. No examplo abaixo, temos um botão que, ao ser clicado, exibe um alerta com a prop `message`:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Reproduzindo!">
        Reproduzir Filme
      </AlertButton>
      <AlertButton message="Enviando!">
        Enviar Imagem
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Isso permite que esses dois botões exibam mensagens diferentes. Tente alterar as mensagens passadas para eles.

### Passando manipuladores de eventos como props {/*passing-event-handlers-as-props*/}

É comum que o componente pai defina o manipulador de eventos de um componente filho. Por exemplo, considere os botões: dependendo do contexto em que o componente `Button` é usado, pode ser necessário executar funções diferentes, talvez um reproduza um filme e outro faça o upload de uma imagem.

Para fazer isso, passe uma prop que o componente recebe de seu pai como o manipulador de eventos da seguinte forma:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Reproduzindo ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Reproduzir "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Enviando!')}>
      Enviar Imagem
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="O Serviço de Entregas da Kiki" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Aqui, o componente `Toolbar` renderiza o componente `PlayButton` e o componente`UploadButton`:

- O `PlayButton` passa o `handlePlayClick` como prop `onClick` para o `Button` dentro dele.
- O `UploadButton` passa `() => alert('Enviando!')` como a prop `onClick` para o `Button` dentro.

Por fim, seu componente `Button` aceita uma prop chamada `onClick`. Ele passa essa prop diretamente para o elemento `<button>` nativo do navegador usando `onClick={onClick}`. Isso diz ao React para chamar a função quando o botão for clicado.

Se você usa um [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), é comum que componentes, como botões, contenham estilo mas não especifiquem o comportamento. Em vez disso, componentes como `PlayButton` e `UploadButton` passarão os manipuladores de eventos para baixo.

### Nomeando props de manipuladores de eventos {/*naming-event-handler-props*/}

Os componentes nativos, como `<button>` e `<div>`, suportam apenas [os nomes de eventos do navegador](/reference/react-dom/components/common#common-props), tais como `onClick`. No entanto, quando você está criando seus próprios componentes, você pode nomear os manipuladores de eventos da forma que preferir.

Por convenção, as props dos manipuladores de eventos devem começar com o termo `on`, seguido por uma letra maiúscula.

Por exemplo, a prop `onClick` do componente `Button` poderia ter sido chamada de `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Reproduzindo!')}>
        Reproduzir Filme
      </Button>
      <Button onSmash={() => alert('Enviando!')}>
        Enviar Imagem
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Neste exemplo, `<button onClick={onSmash}>` mostra que a tag `<button>` do navegador (minúsculo) ainda precisa de uma prop chamada `onClick`. No entanto, é você quem escolhe o nome da prop recebida pelo seu componente personalizado `Button`!

Quando seu componente oferece suporte a várias interações, você pode nomear as props dos manipuladores de eventos com base em conceitos específicos da sua aplicação. Por exemplo, o componente `Toolbar` pode receber os manipuladores de eventos `onPlayMovie` e `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Reproduzindo!')}
      onUploadImage={() => alert('Enviando!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Reproduzir Filme
      </Button>
      <Button onClick={onUploadImage}>
        Enviar Imagem
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Note como o componente `App` não precisa saber *o que* o componente `Toolbar` fará com o `onPlayMovie` ou `onUploadImage`. Isso é um detalhe de implementação da `Toolbar`. Aqui, a `Toolbar` os passa como manipuladores `onClick` para seus componentes `Button`, mas posteriormente pode acioná-los também em um atalho de teclado. Nomear as props com base em interações específicas da aplicação, como `onPlayMovie`, oferece a flexibilidade para alterar como elas são usadas no futuro.
                                
<Note>

É importante utilizar as tags HTML apropriadas para seus manipuladores de eventos. Por exemplo, para lidar com cliques, use [`<button onClick={handleClick}>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/button) em vez de `<div onClick={handleClick}>`. Ao utilizar a tag `<button>`, você se beneficia dos comportamentos nativos do navegador, como a navegação pelo teclado. Se você não gosta do comportamento padrão do navegador de um botão e deseja torná-lo mais parecido com um link ou um elemento diferente, você pode alcançar isso com CSS. [Saiba mais sobre como escrever marcação acessível.](https://developer.mozilla.org/pt-BR/docs/Learn/Accessibility/HTML)
  
</Note>

## Propagação de eventos {/*event-propagation*/}

Os manipuladores de eventos também capturam eventos de quaisquer elementos filhos que o seu componente possa ter. Dizemos que um evento "borbulha" ou "se propaga" pela árvore: ele começa no local onde o evento ocorreu e, em seguida, se propaga pela árvore.

Esta `<div>` contém dois botões, sendo que tanto a `<div>` quanto cada botão tem seu próprio manipulador `onClick`. Você sabe dizer quais manipuladores serão acionados quando clicar em um dos botões?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Você clicou na toolbar!');
    }}>
      <button onClick={() => alert('Reproduzindo!')}>
        Reproduzir Filme
      </button>
      <button onClick={() => alert('Enviando!')}>
        Enviar Imagem
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Se você clicar em qualquer um dos botões, o `onClick` do botão clicado será executado primeiro e, em seguida, o `onClick` da `<div>` pai será executado. Como resultado, duas mensagens serão exibidas. Se você clicar na toolbar, apenas o `onClick` da `<div>` pai será executado.

<Pitfall>

Todos os eventos se propagam no React, exceto `onScroll`, que funciona apenas na tag JSX à qual foi adicionado.

</Pitfall>

### Interrompendo a propagação {/*stopping-propagation*/}

Os manipuladores de eventos recebem um **event object** como único argumento. Por convenção, ele é normalmente chamado de `e`, que significa "event", em inglês. Você pode usar esse objeto para obter informações sobre o evento.

Esse event object também permite que você interrompa a propagação. Caso deseje que um evento não chegue aos componentes pai, você precisa chamar `e.stopPropagation()` como no exemplo do componente `Button` abaixo:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Você clicou na toolbar!');
    }}>
      <Button onClick={() => alert('Reproduzindo!')}>
        Reproduzir Filme
      </Button>
      <Button onClick={() => alert('Enviando!')}>
        Enviar Imagem
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Ao clicar em um dos botões:

1. O React chama o manipulador `onClick` passado para `<button>`.
2. Esse manipulador, definido em `Button`, faz o seguinte:
   * Chama `e.stopPropagation()`, que impede que o evento continue se propagando.
   * Chama a função `onClick`, que é uma propriedade passada do componente `Toolbar`.
3. Essa função, definida no componente `Toolbar`, exibe o alerta que foi definido no botão clicado.
4. Como a propagação foi interrompida, o manipulador `onClick` da `<div>` pai *não* é executado.

Ao usar `e.stopPropagation()`, agora somente um alerta (da tag `<button>`) é exibido quando os botões são clicados, em vez de dois alertas (da tag `<button>` e outro da `<div>` do toolbar). Clicar em um botão não é a mesma coisa que clicar na `div` da toolbar que envolve os botões, por isso, interromper a propagação faz sentido no caso dessa UI.

<DeepDive>

#### Capturar eventos de cada fase {/*capture-phase-events*/}

Em casos raros, pode ser necessário capturar todos os eventos em elementos filhos, *mesmo que eles tenham interrompido a propagação*. Por exemplo, talvez você queira coletar cada clique para coleta de dados, independentemente da lógica de propagação. Você pode fazer isso adicionando `Capture` no final do nome do evento:

```js
<div onClickCapture={() => { /* Essa função é executada primeiro */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Cada evento se propaga em três fases

1. Ele se propaga para baixo, chamando todos os manipuladores `onClickCapture`.
2. Ele executa o manipulador `onClick` do elemento clicado.
3. Ele se propaga para cima, chamando todos os manipuladores `onClick`.

Os eventos de captura são úteis para códigos como roteadores ou análises, mas você provavelmente não os usará no código de uma aplicação.

</DeepDive>

### Passando manipuladores como alternativa à propagação {/*passing-handlers-as-alternative-to-propagation*/}

Observe como esse manipulador de cliques executa uma linha de código _e depois_ chama a prop `onClick` passada pelo pai:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Você também pode adicionar mais código a esse manipulador antes de chamar o manipulador de eventos `onClick` do elemento pai. Esse padrão fornece uma *alternativa* à propagação. Ele permite que o componente filho manipule o evento, mas ainda permitindo que o componente pai especifique algum comportamento adicional. Diferente da propagação, esse padrão não é automático, mas a sua vantagem é que você pode seguir claramente toda a cadeia de código executada como resultado de algum evento.

Caso você esteja dependendo da propagação de eventos e tenha dificuldade em rastrear quais manipuladores estão sendo executados e por quê, tente essa abordagem.

### Removendo comportamento padrão {/*preventing-default-behavior*/}

Alguns eventos do navegador têm um comportamento padrão associado a eles. Por exemplo, um evento de envio de formulário `<form>`, que acontece quando um botão dentro dele é clicado, recarregará a página inteira por padrão:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Enviando!')}>
      <input />
      <button>Enviar</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

É possível chamar `e.preventDefault()` no objeto do evento para impedir que isso aconteça:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Enviando!');
    }}>
      <input />
      <button>Enviar</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Não confunda `e.stopPropagation()` com `e.preventDefault()`. Ambos são úteis, mas não estão relacionados:

* [`e.stopPropagation()`](https://developer.mozilla.org/pt-BR/docs/Web/API/Event/stopPropagation) impede que os manipuladores de eventos associados às tags superiores sejam acionados.
* [`e.preventDefault()` ](https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault) impede que o navegador execute o comportamento padrão associado a determinados eventos.

## Os manipuladores de eventos podem ter efeitos colaterais? {/*can-event-handlers-have-side-effects*/}

Sem dúvida! Os manipuladores de eventos são o local ideal para efeitos colaterais.

Ao contrário das funções de renderização, os manipuladores de eventos não precisam ser [puros](/learn/keeping-components-pure), o que significa que é o local ideal para realizar *modificações*, por exemplo, alterar o valor de um input em resposta à digitação, ou alterar uma lista em resposta ao clique de um botão. No entanto, para alterar alguma informação, você primeiro precisa de uma maneira de armazenar essa informação. No React, isso é feito usando o [state, a memória de um componente.](/learn/state-a-components-memory) Você aprenderá tudo sobre isso na próxima página.

<Recap>

* Você pode manipular eventos passando uma função como prop para um elemento como `<button>`.
* Manipuladores de eventos devem ser passados, **não chamados!** `onClick={handleClick}`, e não `onClick={handleClick()}`.
* Você pode definir uma função de manipulador de eventos separado ou diretamente na prop.
* Os manipuladores de eventos são definidos dentro de um componente, para que possam acessar props.
* Você pode declarar um manipulador de eventos em um pai e passá-lo como prop para um filho.
* Você pode definir seus próprios manipuladores de eventos com nomes específicos para sua aplicação.
* Os eventos se propagam para cima. Use `e.stopPropagation()` no primeiro argumento para que isso não aconteça.
* Os eventos podem ter um comportamento padrão do navegador que não são desejados. Use `e.preventDefault()` para remover esses comportamentos.
* Chamar explicitamente uma prop de um manipulador de eventos a partir de um manipulador filho é uma boa alternativa à propagação.

</Recap>



<Challenges>

#### Corrigir um manipulador de eventos {/*fix-an-event-handler*/}

Ao clicar neste botão, espera-se que o plano de fundo da página seja alternado entre branco e preto. No entanto, nada acontece quando você clica nele. Corrija o problema. (Não se preocupe com a lógica dentro do `handleClick` — essa parte está ok.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Alternar as luzes
    </button>
  );
}
```

</Sandpack>

<Solution>

O problema é que `<button onClick={handleClick()}>` _chama_ a função `handleClick` durante a renderização em vez de _passá-la como referência_. Para corrigir o problema, basta remover a chamada `()` e deixar apenas `<button onClick={handleClick}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Alternar as luzes
    </button>
  );
}
```

</Sandpack>

Uma alternativa é você envolver a chamada em outra função, como em `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Alternar as luzes
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Conecte os eventos {/*wire-up-the-events*/}

Este componente `ColorSwitch` renderiza um botão que deveria alterar a cor da página. Conecte-o ao manipulador de eventos `onChangeColor` que ele recebe do pai. Assim, ao clicar no botão, a cor da página será alterada.

Depois de fazer isso, perceba que ao clicar no botão, o contador de cliques da página também é incrementado. Seu colega, que escreveu o componente pai, insiste que o `onChangeColor` não deveria incrementar o contador. O que mais poderia estar acontecendo? Corrija o problema para que ao clicar no botão, *apenas* altere a cor e _não_ incremente o contador.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Alterar a cor
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Cliques na página: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Primeiro, você precisa adicionar o manipulador de eventos, como por exemplo: `<button onClick={onChangeColor}>`.

No entanto, surge o problema que incremeta contador. Se o seu colega está certo e o `onChangeColor` não deveria incrementar o contador, então o problema é que esse evento se propaga, e algum manipulador acima está realizando essa operação. Para resolver esse problema, você precisa parar a propagação. Mas não se esqueça que você ainda deve chamar o `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
