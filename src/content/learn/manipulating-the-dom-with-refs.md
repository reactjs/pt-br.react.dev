---
title: 'Manipulando o DOM com Refs'
---

<Intro>

O React atualiza automaticamente o [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) para corresponder à sua saída de renderização, então seus componentes não precisarão frequentemente manipulá-lo. No entanto, às vezes você pode precisar de acesso aos elementos DOM gerenciados pelo React—por exemplo, para focar um nó, rolar para ele ou medir seu tamanho e posição. Não há uma maneira integrada de fazer essas coisas no React, então você precisará de um *ref* para o nó do DOM.

</Intro>

<YouWillLearn>

- Como acessar um nó do DOM gerenciado pelo React com o atributo `ref`
- Como o atributo JSX `ref` se relaciona ao Hook `useRef`
- Como acessar o nó do DOM de outro componente
- Em quais casos é seguro modificar o DOM gerenciado pelo React

</YouWillLearn>

## Obtendo um ref para o nó {/*getting-a-ref-to-the-node*/}

Para acessar um nó do DOM gerenciado pelo React, primeiro importe o Hook `useRef`:

```js
import { useRef } from 'react';
```

Em seguida, use-o para declarar um ref dentro do seu componente:

```js
const myRef = useRef(null);
```

Finalmente, passe seu ref como o atributo `ref` para a tag JSX da qual você deseja obter o nó do DOM:

```js
<div ref={myRef}>
```

O Hook `useRef` retorna um objeto com uma única propriedade chamada `current`. Inicialmente, `myRef.current` será `null`. Quando o React criar um nó do DOM para este `<div>`, o React colocará uma referência a este nó em `myRef.current`. Você poderá então acessar este nó do DOM de seus [manipuladores de eventos](/learn/responding-to-events) e usar as [APIs de navegador](https://developer.mozilla.org/docs/Web/API/Element) integradas definidas nele.

```js
// Você pode usar qualquer API de navegador, por exemplo:
myRef.current.scrollIntoView();
```

### Exemplo: Focando um campo de texto {/*example-focusing-a-text-input*/}

Neste exemplo, clicar no botão irá focar a entrada:

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
        Focar na entrada
      </button>
    </>
  );
}
```

</Sandpack>

Para implementar isso:

1. Declare `inputRef` com o Hook `useRef`.
2. Passe-o como `<input ref={inputRef}>`. Isso diz ao React para **colocar o nó do DOM deste `<input>` em `inputRef.current`.**
3. Na função `handleClick`, leia o nó do DOM da entrada de `inputRef.current` e chame [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) nele com `inputRef.current.focus()`.
4. Passe o manipulador de eventos `handleClick` para `<button>` com `onClick`.

Embora a manipulação do DOM seja o caso de uso mais comum para refs, o Hook `useRef` pode ser usado para armazenar outras coisas fora do React, como IDs de temporizador. Assim como o estado, os refs permanecem entre as renderizações. Os refs são como variáveis de estado que não acionam novas renderizações quando você as define. Leia sobre refs em [Referenciando Valores com Refs.](/learn/referencing-values-with-refs)

### Exemplo: Rolando para um elemento {/*example-scrolling-to-an-element*/}

Você pode ter mais de um ref em um componente. Neste exemplo, há um carrossel de três imagens. Cada botão centraliza uma imagem chamando o método [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) do navegador no nó DOM correspondente:

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

#### Como gerenciar uma lista de refs usando um callback ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Nos exemplos acima, há um número pré-definido de refs. No entanto, às vezes você pode precisar de um ref para cada item na lista, e você não sabe quantos terá. Algo como isto **não funcionaria**:

```js
<ul>
  {items.map((item) => {
    // Não funciona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Isso acontece porque **os Hooks devem ser chamados apenas no nível superior do seu componente.** Você não pode chamar `useRef` em um loop, em uma condição, ou dentro de uma chamada `map()`.

Uma possível maneira de contornar isso é obter um único ref para seu elemento pai e, em seguida, usar métodos de manipulação do DOM, como [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) para "encontrar" os nós filhos individuais a partir dele. No entanto, isso é frágil e pode quebrar se sua estrutura DOM mudar.

Outra solução é **passar uma função para o atributo `ref`.** Isso é chamado de [`callback` ref.](/reference/react-dom/components/common#ref-callback) O React chamará seu callback ref com o nó DOM quando for hora de definir o ref, e com `null` quando for hora de limpá-lo. Isso permite que você mantenha seu próprio array ou um [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), e acesse qualquer ref por seu índice ou algum tipo de ID.

Este exemplo mostra como você pode usar essa abordagem para rolar para um nó arbitrário em uma lista longa:

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

Neste exemplo, `itemsRef` não contém um único nó DOM. Em vez disso, ele contém um [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) de ID de item para um nó DOM. ([Refs podem conter quaisquer valores!](/learn/referencing-values-with-refs)) O [`callback` ref](/reference/react-dom/components/common#ref-callback) em cada item da lista cuida de atualizar o Map:

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

Isso permite que você leia nós DOM individuais do Map mais tarde.

<Canary>

Este exemplo mostra outra abordagem para gerenciar o Map com uma função de limpeza de `callback` ref.

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

## Acessando os nós DOM de outro componente {/*accessing-another-components-dom-nodes*/}

Quando você coloca um ref em um componente embutido que gera um elemento de navegador como `<input />`, o React definirá a propriedade `current` desse ref para o nó DOM correspondente (como o `<input />` real no navegador).

No entanto, se você tentar colocar um ref em **seu próprio** componente, como `<MyInput />`, por padrão você obterá `null`. Aqui está um exemplo demonstrando isso. Note como clicar no botão **não** foca a entrada:

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
        Focar na entrada
      </button>
    </>
  );
}
```

</Sandpack>

Para ajudá-lo a notar o problema, o React também imprime um erro no console:

<ConsoleBlock level="error">

Aviso: Componentes de função não podem receber refs. Tentativas de acessar este ref falharão. Você quis dizer para usar React.forwardRef()?

</ConsoleBlock>

Isso acontece porque, por padrão, o React não permite que um componente acesse os nós DOM de outros componentes. Nem mesmo para seus próprios filhos! Isso é intencional. Os refs são uma escapatória que deve ser usada com moderação. Manipular manualmente os nós DOM de _outro_ componente torna seu código ainda mais frágil.

Em vez disso, componentes que _querem_ expor seus nós DOM devem **optar** por esse comportamento. Um componente pode especificar que "encaminha" seu ref para um de seus filhos. Aqui está como `MyInput` pode usar a API `forwardRef`:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Assim funciona:

1. `<MyInput ref={inputRef} />` diz ao React para colocar o nó DOM correspondente em `inputRef.current`. No entanto, cabe ao componente `MyInput` optar por isso—por padrão, ele não faz.
2. O componente `MyInput` é declarado usando `forwardRef`. **Isso o opta para receber o `inputRef` de cima como o segundo argumento `ref`** que é declarado após `props`.
3. O `MyInput` em si passa o `ref` que recebeu para o `<input>` dentro dele.

Agora, clicar no botão para focar a entrada funciona:

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
        Focar na entrada
      </button>
    </>
  );
}
```

</Sandpack>

Em sistemas de design, é um padrão comum que componentes de baixo nível, como botões, entradas e assim por diante, encaminhem seus refs para seus nós DOM. Por outro lado, componentes de alto nível, como formulários, listas ou seções de página, geralmente não expõem seus nós DOM para evitar dependências acidentais na estrutura DOM.

<DeepDive>

#### Expondo um subconjunto da API com uma handle imperativa {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

No exemplo acima, `MyInput` expõe o elemento DOM de entrada original. Isso permite que o componente pai chame `focus()` nele. No entanto, isso também permite que o componente pai faça algo mais—por exemplo, alterar seus estilos CSS. Em casos não comuns, você pode querer restringir a funcionalidade exposta. Você pode fazer isso com `useImperativeHandle`:

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
    // Apenas expõe foco e mais nada
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
        Focar na entrada
      </button>
    </>
  );
}
```

</Sandpack>

Aqui, `realInputRef` dentro de `MyInput` contém o nó DOM de entrada real. No entanto, `useImperativeHandle` instrui o React a fornecer seu próprio objeto especial como o valor de um ref para o componente pai. Assim, `inputRef.current` dentro do componente `Form` terá apenas o método `focus`. Nesse caso, a "handle" do ref não é o nó DOM, mas o objeto customizado que você cria dentro da chamada `useImperativeHandle`.

</DeepDive>

## Quando o React anexa os refs {/*when-react-attaches-the-refs*/}

No React, cada atualização é dividida em [duas fases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante a **renderização,** o React chama seus componentes para descobrir o que deve estar na tela.
* Durante o **compromisso,** o React aplica as alterações ao DOM.

Em geral, você [não quer](/learn/referencing-values-with-refs#best-practices-for-refs) acessar refs durante a renderização. Isso se aplica a refs que contêm nós DOM também. Durante a primeira renderização, os nós DOM ainda não foram criados, então `ref.current` será `null`. E durante a renderização das atualizações, os nós DOM ainda não foram atualizados. Portanto, é cedo demais para lê-los.

O React define `ref.current` durante o compromisso. Antes de atualizar o DOM, o React define os valores afetados de `ref.current` como `null`. Após atualizar o DOM, o React imediatamente os define para os nós DOM correspondentes.

**Geralmente, você acessará refs a partir de manipuladores de eventos.** Se você quiser fazer algo com um ref, mas não houver um evento específico para fazê-lo, pode precisar de um Effect. Vamos discutir Effects nas próximas páginas.

<DeepDive>

#### Limpando atualizações de estado de forma síncrona com flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considere um código como este, que adiciona uma nova tarefa e rola a tela para o último filho da lista. Note como, por algum motivo, ele sempre rola para a tarefa que foi *apenas antes* da última adicionada:

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
    text: 'Tarefa #' + (i + 1)
  });
}
```

</Sandpack>

O problema está nessas duas linhas:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

No React, [atualizações de estado são enfileiradas.](/learn/queueing-a-series-of-state-updates) Normalmente, isso é o que você deseja. No entanto, aqui isso causa um problema porque `setTodos` não atualiza imediatamente o DOM. Então, no momento em que você rola a lista para seu último elemento, a tarefa ainda não foi adicionada. É por isso que a rolagem sempre "atrasada" em um item.

Para corrigir esse problema, você pode forçar o React a atualizar ("limpar") o DOM de forma síncrona. Para fazer isso, importe `flushSync` de `react-dom` e **envelope a atualização de estado** em uma chamada `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Isso instruirá o React a atualizar o DOM de forma síncrona logo após a execução do código envolvido na chamada `flushSync`. Como resultado, a última tarefa já estará no DOM no momento em que você tentar rolar para ela:

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
    text: 'Tarefa #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Melhores práticas para manipulação do DOM com refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs são uma escapatória. Você só deve usá-los quando precisar "sair do React". Exemplos comuns disso incluem gerenciar foco, posição de rolagem, ou chamar APIs de navegador que o React não expõe.

Se você se limitar a ações não destrutivas, como focar e rolar, não deverá encontrar problemas. No entanto, se você tentar **modificar** o DOM manualmente, pode correr o risco de conflitar com as alterações que o React está fazendo.

Para ilustrar esse problema, este exemplo inclui uma mensagem de boas-vindas e dois botões. O primeiro botão alterna sua presença usando [renderização condicional](/learn/conditional-rendering) e [estado](/learn/state-a-components-memory), como você normalmente faria no React. O segundo botão usa a [API DOM `remove()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) para removê-lo à força do DOM fora do controle do React.

Tente pressionar "Alternar com setState" algumas vezes. A mensagem deve desaparecer e aparecer novamente. Em seguida, pressione "Remover do DOM". Isso o removerá à força. Finalmente, pressione "Alternar com setState":

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

Depois de você remover manualmente o elemento DOM, tentar usar `setState` para mostrá-lo novamente resultará em uma falha. Isso acontece porque você mudou o DOM, e o React não sabe como continuar gerenciando-o corretamente.

**Evite mudar nós DOM gerenciados pelo React.** Modificar, adicionar filhos a, ou remover filhos de elementos que são gerenciados pelo React pode levar a resultados visuais inconsistentes ou falhas como a acima.

No entanto, isso não significa que você não possa fazê-lo. Isso requer cautela. **Você pode modificar partes do DOM que o React _não tem razão_ para atualizar com segurança.** Por exemplo, se algum `<div>` estiver sempre vazio no JSX, o React não terá razão para tocar em sua lista de filhos. Portanto, é seguro adicionar ou remover elementos manualmente lá.

<Recap>

- Refs são um conceito genérico, mas na maioria das vezes você os usará para manter elementos DOM.
- Você instrui o React a colocar um nó DOM em `myRef.current` passando `<div ref={myRef}>`.
- Geralmente, você usará refs para ações não destrutivas como focar, rolar ou medir elementos DOM.
- Um componente não expõe seus nós DOM por padrão. Você pode optar por expor um nó DOM usando `forwardRef` e passando o segundo argumento `ref` para baixo para um nó específico.
- Evite mudar nós DOM gerenciados pelo React.
- Se você modificar nós DOM gerenciados pelo React, modifique partes que o React não tenha razão para atualizar.

</Recap>

<Challenges>

#### Reproduzir e pausar o vídeo {/*play-and-pause-the-video*/}

Neste exemplo, o botão alterna uma variável de estado para mudar entre um estado de reprodução e um estado pausado. No entanto, para realmente reproduzir ou pausar o vídeo, alternar o estado não é suficiente. Você também precisa chamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) no elemento DOM para o `<video>`. Adicione um ref a ele e faça o botão funcionar.

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
        {isPlaying ? 'Pausar' : 'Reproduzir'}
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

Para um desafio extra, mantenha o botão "Reproduzir" em sincronia com se o vídeo está sendo reproduzido, mesmo que o usuário clique com o botão direito no vídeo e o reproduza usando os controles de mídia integrados do navegador. Você pode querer ouvir `onPlay` e `onPause` no vídeo para fazer isso.

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
        {isPlaying ? 'Pausar' : 'Reproduzir'}
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

Para lidar com os controles integrados do navegador, você pode adicionar manipuladores `onPlay` e `onPause` ao elemento `<video>` e chamar `setIsPlaying` a partir deles. Dessa forma, se o usuário reproduzir o vídeo usando os controles do navegador, o estado será ajustado adequadamente.

</Solution>

#### Focar no campo de pesquisa {/*focus-the-search-field*/}

Faça com que clicar no botão "Pesquisar" coloque foco no campo.

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

Adicione um ref à entrada e chame `focus()` no nó DOM para focá-la:

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

Este carrossel de imagens tem um botão "Próximo" que alterna a imagem ativa. Faça a galeria rolar horizontalmente para a imagem ativa ao clicar. Você vai querer chamar [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) no nó DOM da imagem ativa:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Você não precisa ter um ref para cada imagem para este exercício. Deve ser suficiente ter um ref para a imagem atualmente ativa, ou para a lista em si. Use `flushSync` para garantir que o DOM seja atualizado *antes* de você rolar.

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
                    'active' :
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

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Você pode declarar um `selectedRef`, e então passá-lo condicionalmente apenas para a imagem atual:

```js
<li ref={index === i ? selectedRef : null}>
```

Quando `index === i`, significando que a imagem é a selecionada, o `<li>` receberá o `selectedRef`. O React garantirá que `selectedRef.current` sempre aponte para o nó DOM correto.

Note que a chamada a `flushSync` é necessária para forçar o React a atualizar o DOM antes da rolagem. Caso contrário, `selectedRef.current` sempre apontaria para o item selecionado anteriormente.

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
                    'active'
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

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Focar no campo de pesquisa com componentes separados {/*focus-the-search-field-with-separate-components*/}

Faça com que clicar no botão "Pesquisar" coloque foco no campo. Observe que cada componente está definido em um arquivo separado e não deve ser movido para fora dele. Como você os conecta?

<Hint>

Você precisará de `forwardRef` para optar por expor um nó DOM do seu próprio componente como `SearchInput`.

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

Você precisará adicionar uma prop `onClick` ao `SearchButton`, e fazer o `SearchButton` passá-la para o botão do navegador `<button>`. Você também passará um ref para `<SearchInput>`, que o encaminhará para o real `<input>` e o preencherá. Finalmente, no manipulador de clique, você chamará `focus` no nó DOM armazenado dentro desse ref.

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