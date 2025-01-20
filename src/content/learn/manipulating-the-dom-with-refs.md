---
title: 'Manipulando o DOM com Refs'
---

<Intro>

O React atualiza automaticamente o [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) para corresponder à sua saída de renderização, então seus componentes não precisarão manipulá-lo frequentemente. No entanto, às vezes você pode precisar de acesso aos elementos do DOM gerenciados pelo React—por exemplo, para focar um nó, rolar até ele ou medir seu tamanho e posição. Não há uma maneira embutida de fazer essas coisas no React, então você vai precisar de um *ref* para o nó do DOM.

</Intro>

<YouWillLearn>

- Como acessar um nó do DOM gerenciado pelo React com o atributo `ref`
- Como o atributo JSX `ref` se relaciona com o Hook `useRef`
- Como acessar o nó do DOM de outro componente
- Em quais casos é seguro modificar o DOM gerenciado pelo React

</YouWillLearn>

## Obtendo um ref para o nó {/*getting-a-ref-to-the-node*/}

Para acessar um nó do DOM gerenciado pelo React, primeiro, importe o Hook `useRef`:

```js
import { useRef } from 'react';
```

Então, use-o para declarar um ref dentro do seu componente:

```js
const myRef = useRef(null);
```

Finalmente, passe seu ref como o atributo `ref` para a tag JSX para a qual você deseja obter o nó do DOM:

```js
<div ref={myRef}>
```

O Hook `useRef` retorna um objeto com uma única propriedade chamada `current`. Inicialmente, `myRef.current` será `null`. Quando o React cria um nó do DOM para este `<div>`, o React colocará uma referência a este nó em `myRef.current`. Você pode então acessar este nó do DOM em seus [manipuladores de eventos](/learn/responding-to-events) e usar as [APIs do navegador](https://developer.mozilla.org/docs/Web/API/Element) definidas nele.

```js
// Você pode usar qualquer API do navegador, por exemplo:
myRef.current.scrollIntoView();
```

### Exemplo: Focando um campo de texto {/*example-focusing-a-text-input*/}

Neste exemplo, clicar no botão irá focar o input:

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
        Focar no input
      </button>
    </>
  );
}
```

</Sandpack>

Para implementar isso:

1. Declare `inputRef` com o Hook `useRef`.
2. Passe-o como `<input ref={inputRef}>`. Isso diz ao React para **colocar o nó do DOM deste `<input>` em `inputRef.current`.**
3. Na função `handleClick`, leia o nó do DOM do input de `inputRef.current` e chame [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) nele com `inputRef.current.focus()`.
4. Passe o manipulador de eventos `handleClick` para `<button>` com `onClick`.

Embora a manipulação do DOM seja o caso de uso mais comum para refs, o Hook `useRef` pode ser usado para armazenar outras coisas fora do React, como IDs de temporizadores. Semelhante ao estado, os refs permanecem entre renderizações. Os refs são como variáveis de estado que não acionam re-renderizações quando você os define. Leia sobre refs em [Referenciando Valores com Refs.](/learn/referencing-values-with-refs)

### Exemplo: Rolando até um elemento {/*example-scrolling-to-an-element*/}

Você pode ter mais de um ref em um componente. Neste exemplo, há um carrossel de três imagens. Cada botão centraliza uma imagem chamando o método [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) do navegador no nó do DOM correspondente:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
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

<DeepDive>

#### Como gerenciar uma lista de refs usando um callback de ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Nos exemplos acima, há um número predefinido de refs. No entanto, às vezes você pode precisar de um ref para cada item da lista e não sabe quantos terá. Algo como isso **não funcionaria**:

```js
<ul>
  {items.map((item) => {
    // Não funciona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Isso acontece porque **os Hooks devem ser chamados apenas no nível superior do seu componente.** Você não pode chamar `useRef` em um loop, em uma condição ou dentro de uma chamada `map()`.

Uma possível solução é obter um único ref para o elemento pai e, em seguida, usar métodos de manipulação do DOM como [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) para "encontrar" os nós filhos individuais a partir dele. No entanto, isso é frágil e pode quebrar se sua estrutura DOM mudar.

Outra solução é **passar uma função para o atributo `ref`.** Isso é chamado de [`callback` de ref.](/reference/react-dom/components/common#ref-callback) O React chamará seu callback de ref com o nó do DOM quando for hora de definir o ref, e com `null` quando for hora de limpá-lo. Isso permite que você mantenha seu próprio array ou um [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), e acesse qualquer ref pelo seu índice ou algum tipo de ID.

Este exemplo mostra como você pode usar essa abordagem para rolar até um nó arbitrário em uma lista longa:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Inicializa o Map na primeira utilização.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Tom</button>
        <button onClick={() => scrollToCat(catList[5])}>Maru</button>
        <button onClick={() => scrollToCat(catList[9])}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
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

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  }
}
```

</Sandpack>

Neste exemplo, `itemsRef` não contém um único nó do DOM. Em vez disso, ele contém um [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) do ID do item para um nó do DOM. ([Refs podem conter qualquer valor!](/learn/referencing-values-with-refs)) O [`callback` de ref](/reference/react-dom/components/common#ref-callback) em cada item da lista cuida de atualizar o Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Adiciona ao Map
      map.set(cat, node);
    } else {
      // Remove do Map
      map.delete(cat);
    }
  }}
>
```

Isso permite que você leia nós do DOM individuais do Map mais tarde.

<Canary>

Este exemplo mostra outra abordagem para gerenciar o Map com uma função de limpeza de callback de ref.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Adiciona ao Map
    map.set(cat, node);

    return () => {
      // Remove do Map
      map.delete(cat);
    };
  }}
>
```

</Canary>

</DeepDive>

## Acessando nós do DOM de outro componente {/*accessing-another-components-dom-nodes*/}

Quando você coloca um ref em um componente embutido que gera um elemento do navegador como `<input />`, o React definirá a propriedade `current` desse ref para o nó do DOM correspondente (como o real `<input />` no navegador).

No entanto, se você tentar colocar um ref em **seu próprio** componente, como `<MyInput />`, por padrão você receberá `null`. Aqui está um exemplo demonstrando isso. Note como clicar no botão **não** foca o input:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focar no input
      </button>
    </>
  );
}
```

</Sandpack>

Para ajudá-lo a perceber o problema, o React também imprime um erro no console:

<ConsoleBlock level="error">

Aviso: Componentes de função não podem receber refs. Tentativas de acessar este ref falharão. Você queria usar React.forwardRef()?

</ConsoleBlock>

Isso acontece porque por padrão o React não permite que um componente acesse os nós do DOM de outros componentes. Nem mesmo para seus próprios filhos! Isso é intencional. Refs são uma saída que deve ser usada com moderação. Manipular manualmente os nós do DOM de _outro_ componente torna seu código ainda mais frágil.

Em vez disso, os componentes que _querem_ expor seus nós do DOM têm que **optar por** esse comportamento. Um componente pode especificar que "encaminha" seu ref para um de seus filhos. Veja como `MyInput` pode usar a API `forwardRef`:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Veja como funciona:

1. `<MyInput ref={inputRef} />` diz ao React para colocar o correspondente nó do DOM em `inputRef.current`. No entanto, cabe ao componente `MyInput` optar por isso—por padrão, ele não faz.
2. O componente `MyInput` é declarado usando `forwardRef`. **Isso o opta para receber o `inputRef` de cima como o segundo argumento `ref`** que é declarado após `props`.
3. `MyInput` por sua vez passa o `ref` que recebeu para o `<input>` dentro dele.

Agora clicar no botão para focar o input funciona:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focar no input
      </button>
    </>
  );
}
```

</Sandpack>

Em sistemas de design, é um padrão comum para componentes de baixo nível como botões, inputs, etc., encaminhar seus refs para seus nós do DOM. Por outro lado, componentes de alto nível como formulários, listas ou seções de página geralmente não expõem seus nós do DOM para evitar dependências acidentais na estrutura do DOM.

<DeepDive>

#### Expondo um subconjunto da API com um manipulador imperativo {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

No exemplo acima, `MyInput` expõe o elemento de input DOM original. Isso permite que o componente pai chame `focus()` nele. No entanto, isso também permite que o componente pai faça algo mais—por exemplo, alterar seus estilos CSS. Em casos incomuns, você pode querer restringir a funcionalidade exposta. Você pode fazer isso com `useImperativeHandle`:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Expor apenas o foco e nada mais
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focar no input
      </button>
    </>
  );
}
```

</Sandpack>

Aqui, `realInputRef` dentro de `MyInput` contém o real nó do DOM do input. No entanto, `useImperativeHandle` instrui o React a fornecer seu próprio objeto especial como o valor de um ref para o componente pai. Assim, `inputRef.current` dentro do componente `Form` terá apenas o método `focus`. Neste caso, o "manipulador" do ref não é o nó do DOM, mas o objeto personalizado que você cria dentro da chamada de `useImperativeHandle`.

</DeepDive>

## Quando o React anexa os refs {/*when-react-attaches-the-refs*/}

No React, cada atualização é dividida em [duas fases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante **a renderização**, o React chama seus componentes para descobrir o que deve estar na tela.
* Durante **o compromisso**, o React aplica as mudanças ao DOM.

Em geral, você [não quer](/learn/referencing-values-with-refs#best-practices-for-refs) acessar refs durante a renderização. Isso vale para refs que contêm nós do DOM também. Durante a primeira renderização, os nós do DOM ainda não foram criados, então `ref.current` será `null`. E durante a renderização das atualizações, os nós do DOM ainda não foram atualizados. Portanto, é cedo demais para lê-los.

O React define `ref.current` durante o compromisso. Antes de atualizar o DOM, o React define os valores `ref.current` afetados como `null`. Depois de atualizar o DOM, o React os define imediatamente para os nós do DOM correspondentes.

**Normalmente, você acessará refs a partir de manipuladores de eventos.** Se você quiser fazer algo com um ref, mas não houver um evento específico para isso, você pode precisar de um Effect. Discutiremos Effects nas próximas páginas.

<DeepDive>

#### Eliminando atualizações de estado de forma síncrona com flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considere um código como este, que adiciona um novo todo e rola a tela para baixo até o último filho da lista. Note como, por algum motivo, ele sempre rola até o todo que estava *apenas antes* do último adicionado:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Adicionar
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

O problema está nessas duas linhas:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

No React, [atualizações de estado são enfileiradas.](/learn/queueing-a-series-of-state-updates) Normalmente, isso é o que você quer. No entanto, aqui isso causa um problema porque `setTodos` não atualiza imediatamente o DOM. Portanto, no momento em que você rolar a lista até seu último elemento, o todo ainda não foi adicionado. Por isso, a rolagem sempre "atrasa" um item.

Para corrigir esse problema, você pode forçar o React a atualizar ("limpar") o DOM de forma síncrona. Para isso, importe `flushSync` de `react-dom` e **envolva a atualização de estado** em uma chamada `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Isso instruirá o React a atualizar o DOM de forma síncrona logo após a execução do código envolto em `flushSync`. Como resultado, o último todo já estará no DOM no momento em que você tentar rolar até ele:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Adicionar
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Melhores práticas para manipulação do DOM com refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs são uma saída. Você só deve usá-los quando precisar "sair do React". Exemplos comuns disso incluem gerenciar foco, posição de rolagem ou chamar APIs do navegador que o React não expõe.

Se você se ater a ações não destrutivas, como focar e rolar, não deverá encontrar problemas. No entanto, se você tentar **modificar** o DOM manualmente, pode correr o risco de entrar em conflito com as mudanças que o React está fazendo.

Para ilustrar esse problema, este exemplo inclui uma mensagem de boas-vindas e dois botões. O primeiro botão alterna sua presença usando [renderização condicional](/learn/conditional-rendering) e [estado](/learn/state-a-components-memory), como você normalmente faria no React. O segundo botão utiliza a API DOM [`remove()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) para removê-lo forçosamente do DOM fora do controle do React.

Tente pressionar "Alternar com setState" algumas vezes. A mensagem deve desaparecer e aparecer novamente. Em seguida, pressione "Remover do DOM". Isso removerá forçosamente. Finalmente, pressione "Alternar com setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Alternar com setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remover do DOM
      </button>
      {show && <p ref={ref}>Olá mundo</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Depois de ter removido manualmente o elemento do DOM, tentar usar `setState` para mostrá-lo novamente levará a um erro. Isso acontece porque você alterou o DOM, e o React não sabe como continuar gerenciando-o corretamente.

**Evite alterar nós do DOM gerenciados pelo React.** Modificar, adicionar filhos ou remover filhos de elementos que são gerenciados pelo React pode levar a resultados visuais inconsistentes ou erros como o acima.

No entanto, isso não significa que você não possa fazer isso. Exige cautela. **Você pode modificar com segurança partes do DOM que o React não tem _razão_ para atualizar.** Por exemplo, se algum `<div>` estiver sempre vazio no JSX, o React não terá razão para tocar na lista de seus filhos. Portanto, é seguro adicionar ou remover elementos manualmente lá.

<Recap>

- Refs são um conceito genérico, mas na maioria das vezes você os usará para conter elementos do DOM.
- Você instrui o React a colocar um nó do DOM em `myRef.current` passando `<div ref={myRef}>`.
- Normalmente, você usará refs para ações não destrutivas, como focar, rolar ou medir elementos do DOM.
- Um componente não expõe seus nós do DOM por padrão. Você pode optar por expor um nó do DOM usando `forwardRef` e passando o segundo argumento `ref` para um nó específico.
- Evite alterar nós do DOM gerenciados pelo React.
- Se você modificar nós do DOM gerenciados pelo React, modifique partes que o React não tem razão para atualizar.

</Recap>

<Challenges>

#### Tocar e pausar o vídeo {/*play-and-pause-the-video*/}

Neste exemplo, o botão alterna uma variável de estado para mudar entre um estado de reprodução e um de pausa. No entanto, para realmente reproduzir ou pausar o vídeo, alternar o estado não é suficiente. Você também precisa chamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) no elemento DOM do `<video>`. Adicione um ref a ele e faça o botão funcionar.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pausa' : 'Reproduzir'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Para um desafio extra, mantenha o botão "Reproduzir" sincronizado com se o vídeo está sendo reproduzido mesmo que o usuário clique com o botão direito no vídeo e o reproduza usando os controles de mídia do navegador integrados. Você pode querer ouvir os eventos `onPlay` e `onPause` no vídeo para fazer isso.

<Solution>

Declare um ref e coloque-o no elemento `<video>`. Em seguida, chame `ref.current.play()` e `ref.current.pause()` no manipulador de eventos dependendo do próximo estado.

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
        {isPlaying ? 'Pausa' : 'Reproduzir'}
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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Para lidar com os controles integrados do navegador, você pode adicionar manipuladores `onPlay` e `onPause` ao elemento `<video>` e chamar `setIsPlaying` a partir deles. Dessa forma, se o usuário reproduzir o vídeo usando os controles do navegador, o estado se ajustará de acordo.

</Solution>

#### Focar o campo de pesquisa {/*focus-the-search-field*/}

Faça com que clicar no botão "Pesquisar" coloque o foco no campo.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Pesquisar</button>
      </nav>
      <input
        placeholder="Procurando algo?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Adicione um ref ao input e chame `focus()` no nó do DOM para focá-lo:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Pesquisar
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Procurando algo?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Rolando um carrossel de imagens {/*scrolling-an-image-carousel*/}

Este carrossel de imagens possui um botão "Próximo" que alterna a imagem ativa. Faça a galeria rolar horizontalmente até a imagem ativa ao clicar. Você vai querer chamar [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) no nó do DOM da imagem ativa:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Você não precisa ter um ref para cada imagem para este exercício. Deveria ser o suficiente ter um ref para a imagem atualmente ativa, ou para a lista em si. Use `flushSync` para garantir que o DOM seja atualizado *antes* de você rolar.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Próximo
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'ativo' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Gato #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.ativo {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Você pode declarar um `selectedRef` e, em seguida, passá-lo condicionalmente apenas para a imagem atual:

```js
<li ref={index === i ? selectedRef : null}>
```

Quando `index === i`, significando que a imagem é a selecionada, o `<li>` receberá o `selectedRef`. O React garantirá que `selectedRef.current` sempre aponte para o nó do DOM correto.

Note que a chamada `flushSync` é necessária para forçar o React a atualizar o DOM antes da rolagem. Caso contrário, `selectedRef.current` sempre apontaria para o item selecionado anteriormente.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Próximo
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'ativo'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Gato #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.ativo {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Focar o campo de pesquisa com componentes separadas {/*focus-the-search-field-with-separate-components*/}

Faça com que clicar no botão "Pesquisar" coloque o foco no campo. Note que cada componente é definido em um arquivo separado e não deve ser movido para fora dele. Como você os conecta?

<Hint>

Você precisará de `forwardRef` para optar por expor um nó do DOM a partir do seu próprio componente, como `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Pesquisar
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Procurando algo?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Você precisará adicionar uma propriedade `onClick` ao `SearchButton`, e fazer o `SearchButton` passar isso para o botão do navegador `<button>`. Você também passará um ref para `<SearchInput>`, que irá encaminhá-lo para o real `<input>` e populá-lo. Finalmente, no manipulador de clique, você chamará `focus` no nó do DOM armazenado dentro desse ref.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Pesquisar
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Procurando algo?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>