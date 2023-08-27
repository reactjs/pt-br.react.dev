---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` pode prejudicar o desempenho. Use [`useEffect`](/reference/react/useEffect) sempre que possível.

</Pitfall>

<Intro>

`useLayoutEffect` é uma versão de [`useEffect`](/reference/react/useEffect) que é executada antes do navegador exibir a tela.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Chame o `useLayoutEffect` para executar as medidas de layout antes do navegador exibir a tela:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `setup`: A função com a lógica do seu *Effect* (efeito). Sua função de configuração também pode opcionalmente retornar uma função de limpeza (*cleanup*). Antes que o seu componente seja adicionado ao DOM, o React executará a sua função de configuração. Após cada re-renderização por meio das dependências alteradas, o React primeiro executará a função de limpeza (se fornecida) com os valores antigos e, em seguida, executará a sua função de configuração com os novos valores. Antes que o seu componente seja removido do DOM, o React executará a sua função de limpeza.
 
* **opcional** `dependencies`: A lista de todos os valores reativos referenciados dentro do código de `setup`. Valores reativos incluem *props*, *states* e todas as variáveis e funções declaradas diretamente no *body* do seu componente. Se o seu linter estiver [configurado para o React](/learn/editor-setup#linting), ele verificará se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita inline, como por exemplo: `[dep1, dep2, dep3]`. O React fará uma comparação de cada dependência com seu valor anterior usando o [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se você omitir esse argumento, seu *Effect* (efeito) será executado novamente após cada nova re-renderização do componente.

#### Retorno {/*returns*/}

`useLayoutEffect` retorna `undefined`.

#### Observações {/*caveats*/}

* `useLayoutEffect` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou nos seus próprios Hooks. Não é possível chamá-lo dentro de loops ou condições. Se você precisar fazer isso, crie um componente e mova seu *Effect* (efeito) para lá.

* Quando o *Strict Mode* (Modo Estrito) está ativado, o React **executará um ciclo extra de setup+cleanup (*configuração+limpeza*) exclusivamente para modo de desenvolvimento** antes do primeiro ciclo de configuração real. Isso é um teste de estresse que garante que sua lógica de *cleanup* (limpeza) "espelhe" sua lógica de *setup* (configuração) e que ela interrompa ou desfaça qualquer coisa que o *setup* (configuração) esteja fazendo. Se isso lhe causar um problema, [implemente a função de *cleanup* (limpeza).](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se algumas de suas dependências são objetos ou funções definidas dentro do componente, há o risco de que elas **façam o *Effect* (efeito) ser executado mais vezes do que o necessário**. Para corrigir isso, remova as dependências com [objetos](/reference/react/useEffect#removing-unnecessary-object-dependencies) e [funções](/reference/react/useEffect#removing-unnecessary-function-dependencies) desnecessárias. Você também pode [extrair as atualizações de *state* (estado)](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) e sua [lógica não reativa](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) para fora do seu *Effect* (efeito).

* Os *Effects* (efeitos) **só são executados no lado do cliente.** Eles não são executados durante a renderização no lado do servidor.

* O código executado dentro do `useLayoutEffect` e todas as atualizações de *state* (estado) agendadas a partir dele **bloqueiam o navegador de exibir a tela**. Quando usado em excesso, acaba tornando sua aplicação lenta. Sempre que possível, prefira usar o [`useEffect`.](/reference/react/useEffect)

---

## Uso {/*usage*/}

### Medindo o layout antes do navegador exibir a tela {/*measuring-layout-before-the-browser-repaints-the-screen*/}

A maioria dos componentes não precisa saber sua posição e tamanho na tela para decidir o que renderizar. Eles apenas retornam algum JSX. Em seguida, o navegador calcula o *layout* deles (posição e tamanho) e exibe a tela.

Às vezes, somente isso não é suficiente. Imagine uma ferramenta de dica que aparece ao lado de algum elemento quando o mouse está sobre ele. Se houver espaço suficiente, a ferramenta de dica deve aparecer acima do elemento, mas se não couber, ela deve aparecer abaixo. Para renderizar a ferramenta de dica na posição final correta, você precisa saber a altura dela (ou seja, se ela se encaixa na parte superior).

Para fazer isso, é necessário renderizar duas vezes:

1. Renderize a ferramenta de dica em qualquer lugar (mesmo com uma posição incorreta).
2. Meça sua altura e decida onde colocar a ferramenta de dica.
3. Renderize a ferramenta de dica *novamente* no local correto.

**Tudo isso precisa acontecer antes do navegador exibir a tela.** Você não quer que o usuário veja a ferramenta de dica se movendo. Chame o `useLayoutEffect` para realizar as medições de layout antes do navegador exibir a tela:


```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Você ainda não sabe qual a altura real

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-renderize novamente agora já que você conhece a altura real
  }, []);

  // ...use o tooltipHeight na lógica de renderização em seguida...
}
```

Aqui está a explicação de como o código acima funciona passo a passo:

1. O `Tooltip` renderiza com o valor inicial do *state* (estado) `tooltipHeight = 0` (portanto, a ferramenta de dica pode estar posicionada incorretamente).
2. O React o adiciona no DOM e executa o código do `useLayoutEffect`.
3. Seu `useLayoutEffect` [mede a altura](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) do conteúdo da ferramenta de dica e altera o valor do *state*, desencadeando uma nova renderização imediatamente.
4. O `Tooltip` renderiza novamente com o *state* (estado) `tooltipHeight` contendo o valor correto da altura (então a ferramenta de dica é posicionada corretamente).
5. O React a atualiza o DOM e finalmente o navegador exibe a ferramenta de dica.

Passe o mouse sobre os botões abaixo e observe como a ferramenta de dica ajusta a sua posição conforme a disponibilidade de espaço:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Esta ferramenta de dica não cabe acima do botão.
            <br />
            Por isso, ela é exibida abaixo!
          </div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica abaixo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Esta ferramenta de dica cabe acima do botão</div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica acima)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Esta ferramenta de dica cabe acima do botão</div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica acima)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Medida da altura da ferramenta de dica: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Não cabe acima, então coloque abaixo.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Observe que, mesmo o componente `Tooltip` precisando ser renderizado em duas etapas (primeiro, com o `tooltipHeight` inicializado com o valor `0` e em seguida, com a medida da altura real), você só visualiza o resultado final. Isso é o por que precisamos usar `useLayoutEffect` ao invés de [`useEffect`](/reference/react/useEffect) para este cenário de exemplo. Vamos visualizar as diferenças com mais detalhes abaixo.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` impede o navegador de exibir a tela {/*uselayouteffect-blocks-the-browser-from-repainting*/}

O React garante que o código dentro de `useLayoutEffect` e quaisquer atualizações de *state* (estado) agendadas dentro dele serão processados **antes do navegador exibir a tela**. Isso permite que você renderize a ferramenta de dica, tire sua medida e renderize novamente sem que o usuário perceba a primeira renderização extra. Em outras palavras, o `useLayoutEffect` bloqueia o navegador de realizar a construção da tela.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Esta ferramenta de dica não cabe acima do botão.
            <br />
            Por isso, ela é exibida abaixo!
          </div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica abaixo)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Esta ferramenta de dica cabe acima do botão</div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica acima)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Esta ferramenta de dica cabe acima do botão</div>
        }
      >
        Passe o mouse sobre mim (ferramenta de dica acima)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Não cabe acima, então coloque abaixo.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` does not block the browser {/*useeffect-does-not-block-the-browser*/}

Here is the same example, but with [`useEffect`](/reference/react/useEffect) instead of `useLayoutEffect`. If you're on a slower device, you might notice that sometimes the tooltip "flickers" and you briefly see its initial position before the corrected position.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

To make the bug easier to reproduce, this version adds an artificial delay during rendering. React will let the browser paint the screen before it processes the state update inside `useEffect`. As a result, the tooltip flickers:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Edit this example to `useLayoutEffect` and observe that it blocks the paint even if rendering is slowed down.

<Solution />

</Recipes>

<Note>

Rendering in two passes and blocking the browser hurts performance. Try to avoid this when you can.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

The purpose of `useLayoutEffect` is to let your component [use layout information for rendering:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Render the initial content.
2. Measure the layout *before the browser repaints the screen.*
3. Render the final content using the layout information you've read.

When you or your framework uses [server rendering](/reference/react-dom/server), your React app renders to HTML on the server for the initial render. This lets you show the initial HTML before the JavaScript code loads.

The problem is that on the server, there is no layout information.

In the [earlier example](#measuring-layout-before-the-browser-repaints-the-screen), the `useLayoutEffect` call in the `Tooltip` component lets it position itself correctly (either above or below content) depending on the content height. If you tried to render `Tooltip` as a part of the initial server HTML, this would be impossible to determine. On the server, there is no layout yet! So, even if you rendered it on the server, its position would "jump" on the client after the JavaScript loads and runs.

Usually, components that rely on layout information don't need to render on the server anyway. For example, it probably doesn't make sense to show a `Tooltip` during the initial render. It is triggered by a client interaction.

However, if you're running into this problem, you have a few different options:

- Replace `useLayoutEffect` with [`useEffect`.](/reference/react/useEffect) This tells React that it's okay to display the initial render result without blocking the paint (because the original HTML will become visible before your Effect runs).

- Alternatively, [mark your component as client-only.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) This tells React to replace its content up to the closest [`<Suspense>`](/reference/react/Suspense) boundary with a loading fallback (for example, a spinner or a glimmer) during server rendering.

- Alternatively, you can render a component with `useLayoutEffect` only after hydration. Keep a boolean `isMounted` state that's initialized to `false`, and set it to `true` inside a `useEffect` call. Your rendering logic can then be like `return isMounted ? <RealContent /> : <FallbackContent />`. On the server and during the hydration, the user will see `FallbackContent` which should not call `useLayoutEffect`. Then React will replace it with `RealContent` which runs on the client only and can include `useLayoutEffect` calls.

- If you synchronize your component with an external data store and rely on `useLayoutEffect` for different reasons than measuring layout, consider [`useSyncExternalStore`](/reference/react/useSyncExternalStore) instead which [supports server rendering.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
