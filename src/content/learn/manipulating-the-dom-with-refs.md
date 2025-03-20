---
title: 'Manipulando o DOM com Refs'
---

<Intro>

O React atualiza automaticamente o [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) para corresponder à sua saída de renderização, então seus componentes geralmente não precisarão manipulá-lo. No entanto, às vezes, você pode precisar acessar os elementos DOM gerenciados pelo React - por exemplo, para focar um nó, rolar até ele ou medir seu tamanho e posição. Não há uma maneira integrada de fazer essas coisas no React, então você precisará de um *ref* para o nó do DOM.

</Intro>

<YouWillLearn>

- Como acessar um nó DOM gerenciado pelo React com o atributo `ref`
- Como o atributo JSX `ref` se relaciona com o Hook `useRef`
- Como acessar o nó DOM de outro componente
- Em quais casos é seguro modificar o DOM gerenciado pelo React

</YouWillLearn>

## Obtendo um ref para o nó {/*getting-a-ref-to-the-node*/}

Para acessar um nó DOM gerenciada pelo React, primeiro, importe o Hook `useRef`:

```js
import { useRef } from 'react';
```

Em seguida, use-o para declarar um ref dentro do seu componente:

```js
const myRef = useRef(null);
```

Finalmente, passe seu ref como o atributo `ref` para a tag JSX para a qual você deseja obter o nó DOM:

```js
<div ref={myRef}>
```

O Hook `useRef` retorna um objeto com uma única propriedade chamada `current`. Inicialmente, `myRef.current` será `null`. Quando o React cria um nó DOM para este `<div>`, o React colocará uma referência a este nó em `myRef.current`. Você pode então acessar este nó DOM de seus [manipuladores de eventos](/learn/responding-to-events) e usar as [APIs do navegador](https://developer.mozilla.org/docs/Web/API/Element) incorporadas definidas nele.

```js
// Você pode usar qualquer API do navegador, por exemplo:
myRef.current.scrollIntoView();
```

### Exemplo: Focando uma entrada de texto {/*example-focusing-a-text-input*/}

Neste exemplo, clicar no botão focará a entrada:

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

Para implementar isso:

1. Declare `inputRef` com o Hook `useRef`.
2. Passe-o como `<input ref={inputRef}>`. Isso informa ao React para **colocar o nó DOM deste `<input>` em `inputRef.current`.**
3. Na função `handleClick`, leia o nó DOM de entrada de `inputRef.current`e chame [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) nele com `inputRef.current.focus()`.
4. Passe o manipulador de eventos `handleClick` para `<button>` com `onClick`.

Embora a manipulação do DOM seja o caso de uso mais comum para refs, o Hook `useRef` pode ser usado para armazenar outras coisas fora do React, como IDs de temporizador. Semelhante ao state, os refs permanecem entre as renderizações. Refs são como variáveis de state que não acionam novas renderizações quando você as define. Leia sobre refs em [Referenciando Valores com Refs.](/learn/referencing-values-with-refs)

### Exemplo: Rolando para um elemento {/*example-scrolling-to-an-element*/}

Você pode ter mais de um único ref em um componente. Neste exemplo, há um carrossel de três imagens. Cada botão centraliza uma imagem chamando o método [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) do navegador no nó DOM correspondente:

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
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
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

#### Como gerenciar uma lista de refs usando um ref callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Nos exemplos acima, existe um número predefinido de refs. No entanto, às vezes você pode precisar de um ref para cada item na lista e não saberá quantos terá. Algo como isso **não funcionaria**:

```js
<ul>
  {items.map((item) => {
    // Não funciona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Isso ocorre porque os **Hooks só devem ser chamados no nível superior do seu componente.** Você não pode chamar `useRef` em um loop, em uma condição ou dentro de uma chamada `map()`.

Uma maneira possível de contornar isso é obter um único ref para o elemento pai e, em seguida, usar métodos de manipulação do DOM, como [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll), para "encontrar" os nós filhos individuais a partir dele. No entanto, isso é frágil e pode quebrar se sua estrutura DOM mudar.

Outra solução é **passar uma função para o atributo `ref`.** Isso é chamado de [`ref` callback.](/reference/react-dom/components/common#ref-callback) O React chamará seu ref callback com o nó DOM quando for hora de definir o ref e com `null` quando for hora de limpá-lo. Isso permite que você mantenha seu próprio array ou um [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) e acesse qualquer ref por seu índice ou algum tipo de ID.

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
      // Inicialize o Map no primeiro uso.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
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

</Sandpack>

Neste exemplo, `itemsRef` não contém um único nó DOM. Em vez disso, ele contém um [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) do ID do item para um nó DOM. ([Refs podem conter quaisquer valores!](/learn/referencing-values-with-refs)) O [`ref` callback](/reference/react-dom/components/common#ref-callback) em cada item da lista se encarrega de atualizar o Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Adicionar ao Map
    map.set(cat, node);

    return () => {
      // Remover do Map
      map.delete(cat);
    };
  }}
>
```

Isso permite que você leia nós DOM individuais do Map posteriormente.

<Note>

Quando o Modo Strict estiver ativado, callbacks de ref serão executados duas vezes durante o desenvolvimento.

Leia mais sobre [como isso ajuda a encontrar erros](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) em callbacks de ref.

</Note>

</DeepDive>

## Acessando os nós DOM de outro componente {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Refs são uma brecha. Manipular manualmente os nós DOM de _outro_ componente pode tornar seu código frágil.
</Pitfall>

Você pode passar refs do componente pai para os componentes filhos [assim como qualquer outra prop](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

No exemplo acima, um ref é criado no componente pai, `MyForm`, e é passado para o componente filho, `MyInput`. `MyInput` então passa o ref para `<input>`. Como `<input>` é um [componente integrado](/reference/react-dom/components/common), o React define a propriedade `.current` do ref para o elemento DOM `<input>`.

O `inputRef` criado em `MyForm` agora aponta para o elemento DOM `<input>` retornado por `MyInput`. Um manipulador de cliques criado em `MyForm` pode acessar `inputRef` e chamar `focus()` para definir o foco em `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Expondo um subconjunto da API com um manipulador imperativo {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

No exemplo acima, o ref passado para `MyInput` é repassado para o elemento de entrada DOM original. Isso permite que o componente pai chame `focus()` nele. No entanto, isso também permite que o componente pai faça outra coisa - por exemplo, alterar seus estilos CSS. Em casos incomuns, você pode querer restringir a funcionalidade exposta. Você pode fazer isso com [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Expor apenas o foco e nada mais
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

Aqui, `realInputRef` dentro de `MyInput` contém o nó DOM de entrada real. No entanto, [`useImperativeHandle`](/reference/react/useImperativeHandle) instrui o React a fornecer seu próprio objeto especial como o valor de um ref para o componente pai. Portanto, `inputRef.current` dentro do componente `Form` terá apenas o método `focus`. Neste caso, o "handle" do ref não é o nó DOM, mas o objeto personalizado que você cria dentro da chamada [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Quando o React anexa os refs {/*when-react-attaches-the-refs*/}

No React, cada atualização é dividida em [duas fases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante a **renderização,** o React chama seus componentes para descobrir o que deve estar na tela.
* Durante o **commit,** o React aplica alterações ao DOM.

Em geral, você [não quer](/learn/referencing-values-with-refs#best-practices-for-refs) acessar refs durante a renderização. Isso vale também para refs que contêm nós DOM. Durante a primeira renderização, os nós DOM ainda não foram criados, então `ref.current` será `null`. E durante a renderização das atualizações, os nós DOM ainda não foram atualizados. Então, é muito cedo para lê-los.

O React define `ref.current` durante o commit. Antes de atualizar o DOM, o React define os valores `ref.current` afetados como `null`. Após atualizar o DOM, o React os define imediatamente para os nós DOM correspondentes.

**Normalmente, você acessará refs de manipuladores de eventos.** Se você quiser fazer alguma coisa com um ref, mas não houver um evento específico para fazê-lo, pode precisar de um Effect. Discutiremos Effects nas próximas páginas.

<DeepDive>

#### Despejando as atualizações de state de forma síncrona com flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considere um código como este, que adiciona um novo todo e rola a tela para baixo até o último filho da lista. Observe como, por alguma razão, ele sempre rola para o todo que estava *imediatamente antes* do último adicionado:

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
        Add
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

O problema está com estas duas linhas:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

No React, [as atualizações de state são enfileiradas.](/learn/queueing-a-series-of-state-updates) Normalmente, é isso que você quer. No entanto, aqui ele causa um problema porque `setTodos` não atualiza imediatamente o DOM. Assim, quando você rola a lista para seu último elemento, o todo ainda não foi adicionado. É por isso que a rolagem sempre "fica para trás" por um item.

```
```
Para corrigir este problema, você pode forçar o React a atualizar ("despejar") o DOM de forma síncrona. Para fazer isso, importe `flushSync` de `react-dom` e **encapsule a atualização do estado** em uma chamada `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Isto irá instruir o React a atualizar o DOM de forma síncrona logo após a execução do código encapsulado em `flushSync`. Como resultado, o último todo já fará parte do DOM no momento em que você tentar rolar até ele:

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
        Add
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

Refs são uma saída de emergência. Você só deve usá-los quando precisar "sair do React". Exemplos comuns disso incluem o gerenciamento de foco, a posição da rolagem ou a chamada de APIs do navegador que o React não expõe.

Se você se ater a ações não destrutivas, como foco e rolagem, não deve encontrar nenhum problema. No entanto, se você tentar **modificar** o DOM manualmente, poderá correr o risco de entrar em conflito com as alterações que o React está fazendo.

Para ilustrar esse problema, este exemplo inclui uma mensagem de boas-vindas e dois botões. O primeiro botão alterna sua presença usando [renderização condicional](/learn/conditional-rendering) e [estado](/learn/state-a-components-memory), como você faria normalmente no React. O segundo botão usa a [`remove()` DOM API](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/remove) para removê-lo à força do DOM fora do controle do React.

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
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
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

Depois de remover manualmente o elemento DOM, tentar usar `setState` para mostrá-lo novamente levará a uma falha. Isso ocorre porque você alterou o DOM e o React não sabe como continuar gerenciando-o corretamente.

**Evite alterar nós DOM gerenciados pelo React.** Modificar, adicionar filhos ou remover filhos de elementos que são gerenciados pelo React pode levar a resultados visuais inconsistentes ou falhas como acima.

No entanto, isso não significa que você não pode fazê-lo. Requer cautela. **Você pode modificar com segurança partes do DOM que o React _não tem motivos_ para atualizar.** Por exemplo, se algum `<div>` estiver sempre vazio no JSX, o React não terá motivos para tocar em sua lista de filhos. Portanto, é seguro adicionar ou remover elementos manualmente ali.

<Recap>

- Refs são um conceito genérico, mas na maioria das vezes você os usará para conter elementos DOM.
- Você instrui o React a colocar um nó do DOM em `myRef.current` passando `<div ref={myRef}>`.
- Normalmente, você usará refs para ações não destrutivas como foco, rolagem ou medição de elementos DOM.
- Um componente não expõe seus nós DOM por padrão. Você pode optar por expor um nó DOM usando `forwardRef` e passando o segundo argumento `ref` para baixo para um nó específico.
- Evite alterar nós DOM gerenciados pelo React.
- Se você modificar nós DOM gerenciados pelo React, modifique as partes que o React não tem motivos para atualizar.

</Recap>

<Challenges>

#### Reproduzir e pausar o vídeo {/*play-and-pause-the-video*/}

Neste exemplo, o botão alterna uma variável de estado para alternar entre um estado de reprodução e um estado de pausa. No entanto, para realmente reproduzir ou pausar o vídeo, alternar o estado não é suficiente. Você também precisa chamar [`play()`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLMediaElement/pause) no elemento DOM do `<video>`. Adicione uma ref a ele e faça o botão funcionar.

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
        {isPlaying ? 'Pause' : 'Play'}
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

Para um desafio extra, mantenha o botão "Reproduzir" sincronizado com a reprodução do vídeo, mesmo que o usuário clique com o botão direito do mouse no vídeo e o reproduza usando os controles de mídia integrados ao navegador. Talvez você queira ouvir `onPlay` e `onPause` no vídeo para fazer isso.

<Solution>

Declare uma ref e coloque-a no elemento `<video>`. Em seguida, chame `ref.current.play()` e `ref.current.pause()` no manipulador de eventos, dependendo do próximo estado.

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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Para lidar com os controles integrados do navegador, você pode adicionar manipuladores `onPlay` e `onPause` ao elemento `<video>` e chamá-los em `setIsPlaying`. Dessa forma, se o usuário reproduzir o vídeo usando os controles do navegador, o estado se ajustará de acordo.

</Solution>

#### Focar o campo de pesquisa {/*focus-the-search-field*/}

Faça com que clicar no botão "Pesquisar" coloque o foco no campo.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
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

Adicione uma ref à entrada e chame `focus()` no nó DOM para focá-lo:

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
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
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

Este carrossel de imagens tem um botão "Próximo" que alterna a imagem ativa. Faça a galeria rolar horizontalmente para a imagem ativa ao clicar. Você vai querer chamar [`scrollIntoView()`](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/scrollIntoView) no nó DOM da imagem ativa:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Você não precisa ter uma ref para cada imagem para este exercício. Deve ser suficiente ter uma ref para a imagem atualmente ativa ou para a própria lista. Use `flushSync` para garantir que o DOM seja atualizado *antes* da rolagem.

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
          Next
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
                alt={'Cat #' + cat.id}
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
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
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

Você pode declarar um `selectedRef` e, em seguida, passá-lo condicionalmente apenas para a imagem atual:

```js
<li ref={index === i ? selectedRef : null}>
```

Quando `index === i`, significando que a imagem é a selecionada, o `<li>` receberá o `selectedRef`. O React garantirá que `selectedRef.current` sempre aponte para o nó DOM correto.

Observe que a chamada `flushSync` é necessária para forçar o React a atualizar o DOM antes da rolagem. Caso contrário, `selectedRef.current` sempre apontaria para o item selecionado anteriormente.

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
          Next
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
                alt={'Cat #' + cat.id}
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
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
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

#### Focar o campo de pesquisa com componentes separados {/*focus-the-search-field-with-separate-components*/}

Faça com que clicar no botão "Pesquisar" coloque o foco no campo. Observe que cada componente é definido em um arquivo separado e não deve ser movido dele. Como conectá-los?

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
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Você precisará adicionar uma prop `onClick` ao `SearchButton` e fazer com que o `SearchButton` a passe para baixo para o `<button>` do browser. Você também passará uma ref para baixo para `<SearchInput>`, que a encaminhará para o `<input>` real e o preencherá. Finalmente, no manipulador de cliques, você chamará `focus` no nó DOM armazenado dentro dessa ref.

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
      Search
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
        placeholder="Looking for something?"
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