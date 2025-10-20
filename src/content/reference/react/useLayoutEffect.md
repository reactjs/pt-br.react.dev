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

<<<<<<< HEAD
* `setup`: A função com a lógica do seu *Effect* (efeito). Sua função de configuração também pode opcionalmente retornar uma função de limpeza (*cleanup*). Antes que o seu componente seja adicionado ao DOM, o React executará a sua função de configuração. Após cada re-renderização por meio das dependências alteradas, o React primeiro executará a função de limpeza (se fornecida) com os valores antigos e, em seguida, executará a sua função de configuração com os novos valores. Antes que o seu componente seja removido do DOM, o React executará a sua função de limpeza.
 
* **opcional** `dependencies`: A lista de todos os valores reativos referenciados dentro do código de `setup`. Valores reativos incluem *props*, *states* e todas as variáveis e funções declaradas diretamente no *body* do seu componente. Se o seu linter estiver [configurado para o React](/learn/editor-setup#linting), ele verificará se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita inline, como por exemplo: `[dep1, dep2, dep3]`. O React fará uma comparação de cada dependência com seu valor anterior usando o [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se você omitir esse argumento, seu *Effect* (efeito) será executado novamente após cada nova re-renderização do componente.
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. Before your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. Before your component is removed from the DOM, React will run your cleanup function.

* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every re-render of the component.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

#### Retorno {/*returns*/}

`useLayoutEffect` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* `useLayoutEffect` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou nos seus próprios Hooks. Não é possível chamá-lo dentro de loops ou condições. Se você precisar fazer isso, crie um componente e mova seu *Effect* (efeito) para lá.

* Quando o *Strict Mode* (Modo Estrito) está ativado, o React **executará um ciclo extra de setup+cleanup (*configuração+limpeza*) exclusivamente para modo de desenvolvimento** antes do primeiro ciclo de configuração real. Isso é um teste de estresse que garante que sua lógica de *cleanup* (limpeza) "espelhe" sua lógica de *setup* (configuração) e que ela interrompa ou desfaça qualquer coisa que o *setup* (configuração) esteja fazendo. Se isso lhe causar um problema, [implemente a função de *cleanup* (limpeza).](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se algumas de suas dependências são objetos ou funções definidas dentro do componente, há o risco de que elas **façam o *Effect* (efeito) ser executado mais vezes do que o necessário**. Para corrigir isso, remova as dependências com [objetos](/reference/react/useEffect#removing-unnecessary-object-dependencies) e [funções](/reference/react/useEffect#removing-unnecessary-function-dependencies) desnecessárias. Você também pode [extrair as atualizações de *state* (estado)](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) e sua [lógica não reativa](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) para fora do seu *Effect* (efeito).

* Os *Effects* (efeitos) **só são executados no lado do cliente.** Eles não são executados durante a renderização no lado do servidor.

* O código executado dentro do `useLayoutEffect` e todas as atualizações de *state* (estado) agendadas a partir dele **bloqueiam o navegador de exibir a tela**. Quando usado em excesso, acaba tornando sua aplicação lenta. Sempre que possível, prefira usar o [`useEffect`.](/reference/react/useEffect)

* If you trigger a state update inside `useLayoutEffect`, React will execute all remaining Effects immediately including `useEffect`.

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

```js src/ButtonWithTooltip.js
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

```js src/Tooltip.js active
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

```js src/TooltipContainer.js
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

```js src/ButtonWithTooltip.js
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

```js src/Tooltip.js active
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

```js src/TooltipContainer.js
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

#### `useEffect` não bloqueia o navegador {/*useeffect-does-not-block-the-browser*/}

Aqui está o mesmo exemplo, mas com [`useEffect`](/reference/react/useEffect) ao invés de `useLayoutEffect`. Se estiver em um dispositivo mais lento, talvez você perceba que às vezes a ferramenta de dica "pisca" e durante um instante você vê sua posição inicial antes da correção de posição ser aplicada.

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

```js src/ButtonWithTooltip.js
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

```js src/Tooltip.js active
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

```js src/TooltipContainer.js
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

Para tornar o bug mais fácil de reproduzir, esta versão adiciona um atraso artificial durante a renderização. O React permitirá que o navegador construa a tela antes de processar a atualização do *state* (estado) dentro do `useEffect`. Como resultado, a dica de ferramenta piscará:

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

```js src/ButtonWithTooltip.js
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

```js {expectedErrors: {'react-compiler': [10, 11]}} src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Isso artificialmente retarda a renderização
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Não faça nada por um tempo...
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

```js src/TooltipContainer.js
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

Edite esse exemplo usando `useLayoutEffect` e veja que ele bloqueia a construção mesmo se a renderização for retardada.

<Solution />

</Recipes>

<Note>

Renderizar em duas etapas bloqueando o navegador prejudica o desempenho. Tente evitar isso sempre que for possível.

</Note>

---

## Solução de Problemas {/*troubleshooting*/}

### Estou recebendo o erro: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

O propósito do `useLayoutEffect` é permitir que seu componente [use informações de layout para a renderização:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Renderize o conteúdo inicial.
2. Meça o layout *antes do navegador exibir a tela*.
3. Renderize o conteúdo final usando as informações de layout que você recebeu.

Quando você ou seu framework utilizam a [renderização no lado do servidor](/reference/react-dom/server), sua aplicação React gera o HTML no servidor para a renderização inicial. Isso permite que você exiba o HTML inicial antes que o código JavaScript seja carregado.

O problema é que no lado do servidor não há informações de layout disponíveis.

No [exemplo anterior](#measuring-layout-before-the-browser-repaints-the-screen), a chamada do `useLayoutEffect` no componente `Tooltip` permite que ele se posicione corretamente (acima ou abaixo do conteúdo) dependendo da altura do conteúdo. Se você tentasse renderizar o `Tooltip` como parte do HTML inicial do servidor, isso seria impossível de determinar. No servidor, ainda não há layout! Portanto, mesmo que você o renderizasse no lado do servidor, sua posição "pularia" no lado do cliente após o carregamento e execução do JavaScript.

Normalmente, componentes que dependem de informações de layout não precisam ser renderizados no lado do servidor. Por exemplo, é provável que não se faça muito sentido mostrar um `Tooltip` durante a renderização inicial, pois ele é acionado por meio de uma interação do usuário no lado do cliente.

No entanto, se encontrar esse problema, você possui essas opções:

- Substituir o `useLayoutEffect` pelo [`useEffect`.](/reference/react/useEffect) Isso informa ao React que é aceitável exibir o resultado da renderização inicial sem bloquear a construção (porque o HTML original ficará visível antes de seu *Effect* (efeito) ser executado).

- [Marque seu componente como exclusivo para o cliente.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) Isso diz ao React para substituir seu conteúdo até o limite mais próximo de [`<Suspense>`](/reference/react/Suspense) por uma carga de fallback (por exemplo, um *spinner* ou um *glimmer*) durante a renderização no lado do servidor.

- Você também pode renderizar um componente com `useLayoutEffect` somente após a hidratação. Mantenha um *state* (estado) booleano `isMounted` que é iniciado como `false`, e defina-o como `true` dentro de uma chamada de `useEffect`. Sua lógica de renderização pode ser algo semelhante a isso: `return isMounted ? <RealContent /> : <FallbackContent />`. No lado servidor e durante a hidratação, o usuário verá `FallbackContent` que não deve chamar o `useLayoutEffect`.  Então, o React substituirá isso por `RealContent`  que é executado apenas no lado do cliente e pode incluir chamadas de `useLayoutEffect`.

- Se você sincronizar seu componente com uma loja de dados externa e depender de `useLayoutEffect` por razões diferentes da medição de layout, considere usar [`useSyncExternalStore`](/reference/react/useSyncExternalStore) que oferece [suporte a renderização no lado servidor.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
