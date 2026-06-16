---
title: <ViewTransition>
version: canary
---



<Intro>

<Canary>

**A API `<ViewTransition />` está atualmente disponível apenas nos canais Canary e Experimental do React.**

[Saiba mais sobre os canais de lançamento do React aqui.](/community/versioning-policy#all-release-channels)

</Canary>

`<ViewTransition>` permite animar uma árvore de componentes com Transitions e Suspense.

```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

Envolva uma árvore de componentes com `<ViewTransition>` para animá-la:

```js
<ViewTransition>
  <Page />
</ViewTransition>
```

[Veja mais exemplos abaixo.](#usage)

<DeepDive>

#### Como `<ViewTransition>` funciona? {/*how-does-viewtransition-work*/}

Por baixo dos panos, o React aplica `view-transition-name` a estilos inline do nó DOM mais próximo aninhado dentro do componente `<ViewTransition>`. Se houver múltiplos nós DOM irmãos como `<ViewTransition><div /><div /></ViewTransition>`, então o React adiciona um sufixo ao nome para tornar cada um único, mas conceitualmente eles fazem parte do mesmo. O React não aplica isso de forma proativa, mas apenas no momento em que o limite deve participar de uma animação.

O React chama automaticamente `startViewTransition` nos bastidores, então você nunca deve fazer isso sozinho. Na verdade, se você tiver algo mais na página executando uma ViewTransition, o React a interromperá. Portanto, é recomendado que você use o próprio React para coordenar isso. Se você teve outras maneiras de acionar ViewTransitions no passado, recomendamos que migre para a maneira integrada.

Se houver outras ViewTransitions do React já em execução, o React esperará que elas terminem antes de iniciar a próxima. No entanto, é importante notar que se houver várias atualizações ocorrendo enquanto a primeira está em execução, todas elas serão agrupadas em uma. Se você iniciar A->B. Então, nesse ínterim, você recebe uma atualização para ir para C e depois D. Quando a primeira animação A->B terminar, a próxima animará de B->D.

O ciclo de vida `getSnapshotBeforeUpdate` será chamado antes de `startViewTransition` e alguns `view-transition-name` serão atualizados ao mesmo tempo.

Em seguida, o React chama `startViewTransition`. Dentro do `updateCallback`, o React irá:

- Aplicar suas mutações ao DOM e invocar `useInsertionEffect`.
- Esperar que as fontes carreguem.
- Chamar `componentDidMount`, `componentDidUpdate`, `useLayoutEffect` e refs.
- Esperar que qualquer Navegação pendente termine.
- Em seguida, o React medirá quaisquer alterações no layout para ver quais limites precisarão ser animados.

Após a resolução da Promise `ready` de `startViewTransition`, o React reverterá o `view-transition-name`. Em seguida, o React invocará os callbacks `onEnter`, `onExit`, `onUpdate` e `onShare` para permitir o controle programático manual sobre as animações. Isso ocorrerá após o cálculo das animações padrão integradas.

Se um `flushSync` ocorrer no meio desta sequência, o React pulará a Transição, pois depende de ser capaz de concluir de forma síncrona.

Após a resolução da Promise `finished` de `startViewTransition`, o React invocará `useEffect`. Isso evita que eles interfiram no desempenho da animação. No entanto, isso não é uma garantia, pois se outro `setState` ocorrer enquanto a animação estiver em execução, ele ainda terá que invocar o `useEffect` mais cedo para preservar as garantias sequenciais.

</DeepDive>

#### Props {/*props*/}

- **opcional** `name`: Uma string ou objeto. O nome da View Transition usado para transições de elementos compartilhados. Se não for fornecido, o React usará um nome exclusivo para cada View Transition para evitar animações inesperadas.
- Props de [Classe de Transição de Visualização](#view-transition-class).
- Props de [Evento de Transição de Visualização](#view-transition-event).

#### Ressalvas {/*caveats*/}

- Use `name` apenas para [transições de elementos compartilhados](#animating-a-shared-element). Para todas as outras animações, o React gera automaticamente um nome exclusivo para evitar animações inesperadas.
- Por padrão, as atualizações de `setState` ocorrem imediatamente e não ativam `<ViewTransition>`, apenas atualizações encapsuladas em uma [Transition](/reference/react/useTransition), [`<Suspense>`](/reference/react/Suspense) ou `useDeferredValue` ativam ViewTransition.
- `<ViewTransition>` cria uma imagem que pode ser movida, dimensionada e com fade cruzado. Ao contrário das Animações de Layout que você pode ter visto no React Native ou Motion, isso significa que nem todo Elemento individual dentro dele anima sua posição. Isso pode levar a um melhor desempenho e uma animação mais contínua e suave em comparação com a animação de cada peça individual. No entanto, também pode perder a continuidade em coisas que deveriam estar se movendo por conta própria. Portanto, você pode ter que adicionar mais `<ViewTransition>` manualmente como resultado.
- Atualmente, `<ViewTransition>` funciona apenas no DOM. Estamos trabalhando para adicionar suporte ao React Native e outras plataformas.

#### Gatilhos de animação {/*animation-triggers*/}

O React decide automaticamente o tipo de animação de View Transition a ser acionada:

- `enter`: Se um `ViewTransition` for o primeiro componente inserido nesta Transição, isso será ativado.
- `exit`: Se um `ViewTransition` for o primeiro componente excluído nesta Transição, isso será ativado.
- `update`: Se um `ViewTransition` tiver quaisquer mutações de DOM dentro dele que o React esteja fazendo (como uma prop mudando) ou se o próprio limite `ViewTransition` mudar de tamanho ou posição devido a um irmão imediato. Se houver `ViewTransition` aninhados, a mutação se aplica a eles e não ao pai.
- `share`: Se um `ViewTransition` nomeado estiver dentro de uma subárvore excluída e outro `ViewTransition` nomeado com o mesmo nome fizer parte de uma subárvore inserida na mesma Transição, eles formam uma Transição de Elemento Compartilhado e animam do excluído para o inserido.

Por padrão, `<ViewTransition>` anima com um fade cruzado suave (a transição de visualização padrão do navegador).

Você pode personalizar a animação fornecendo uma [Classe de Transição de Visualização](#view-transition-class) para o componente `<ViewTransition>` para cada tipo de gatilho (veja [Estilizando Transições de Visualização](#styling-view-transitions)), ou usando [Eventos de Transição de Visualização](#view-transition-events) para controlar a animação com JavaScript usando a [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

<Note>

#### Sempre verifique `prefers-reduced-motion` {/*always-check-prefers-reduced-motion*/}

Muitos usuários podem preferir não ter animações na página. O React não desabilita automaticamente as animações para este caso.

Recomendamos sempre usar a consulta de mídia `@media (prefers-reduced-motion)` para desativar animações ou atenuá-las com base na preferência do usuário.

No futuro, as bibliotecas CSS podem ter isso integrado em seus presets.

</Note>

### Classe de Transição de Visualização {/*view-transition-class*/}

`<ViewTransition>` fornece props para definir quais animações são acionadas:

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

#### Props {/*view-transition-class-props*/}

- **opcional** `enter`: `"auto"`, `"none"`, uma string ou um objeto.
- **opcional** `exit`: `"auto"`, `"none"`, uma string ou um objeto.
- **opcional** `update`: `"auto"`, `"none"`, uma string ou um objeto.
- **opcional** `share`: `"auto"`, `"none"`, uma string ou um objeto.
- **opcional** `default`: `"auto"`, `"none"`, uma string ou um objeto.

#### Ressalvas {/*view-transition-class-caveats*/}

- Se `default` for `"none"`, todos os outros gatilhos serão desativados, a menos que sejam explicitamente listados.

#### Valores {/*view-transition-values*/}

Os valores da classe de Transição de Visualização podem ser:
- `auto`: o padrão. Usa a animação padrão do navegador.
- `none`: desativa as animações para este tipo.
- `<classname>`: um nome de classe CSS personalizado a ser usado para [personalizar Transições de Visualização](#styling-view-transitions).

Valores de objeto podem ser um objeto com chaves de string e um valor de `auto`, `none` ou um nome de classe personalizado:
- `{[type]: value}`: aplica `value` se a animação corresponder ao [Tipo de Transição](/reference/react/addTransitionType).
- `{default: value}`: o valor padrão a ser aplicado se nenhum [Tipo de Transição](/reference/react/addTransitionType) for correspondido.

Por exemplo, você pode definir uma ViewTransition como:

```js
<ViewTransition
  /* desativa qualquer animação não definida abaixo */
  default="none"
  enter={{
    /* aplica slide-in para o Tipo de Transição `forward` */
    "forward": 'slide-in',
    /* caso contrário, usa a animação padrão do navegador */
    "default": 'auto'
  }}
  /* usa o padrão do navegador para animações de saída */
  exit="auto"
  /* aplica uma classe `cross-fade` personalizada para atualizações */
  update="cross-fade"
>
```

Veja [Estilizando Transições de Visualização](#styling-view-transitions) para saber como definir classes CSS para animações personalizadas.

---

### Evento de Transição de Visualização {/*view-transition-event*/}

Eventos de Transição de Visualização permitem que você controle a animação com JavaScript usando a [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API):

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
/>
```

#### Props {/*view-transition-event-props*/}

- **opcional** `onEnter`: Chamado quando uma animação de "entrada" é acionada.
- **opcional** `onExit`: Chamado quando uma animação de "saída" é acionada.
- **opcional** `onShare`: Chamado quando uma animação de "compartilhamento" é acionada.
- **opcional** `onUpdate`: Chamado quando uma animação de "atualização" é acionada.


#### Ressalvas {/*view-transition-event-caveats*/}
- Apenas um evento dispara por `<ViewTransition>` por Transição. `onShare` tem precedência sobre `onEnter` e `onExit`.
- Cada evento deve retornar uma **função de limpeza**. A função de limpeza é chamada quando a Transição de Visualização termina, permitindo que você cancele ou limpe quaisquer animações.

#### Argumentos {/*view-transition-event-arguments*/}

Cada evento recebe dois argumentos:

- `instance`: Uma instância de Transição de Visualização que fornece acesso aos [pseudo-elementos](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_process) da transição de visualização
  - `old`: O pseudo-elemento `::view-transition-old`.
  - `new`: O pseudo-elemento `::view-transition-new`.
  - `name`: A string `view-transition-name` para este limite.
  - `group`: O pseudo-elemento `::view-transition-group`.
  - `imagePair`: O pseudo-elemento `::view-transition-image-pair`.
- `types`: Um `Array<string>` de [Tipos de Transição](/reference/react/addTransitionType) incluídos na animação. Array vazio se nenhum tipo foi especificado.

Por exemplo, você pode definir um evento `onEnter` que controla a animação usando JavaScript:

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

Veja [Animando com JavaScript](#animating-with-javascript) para mais exemplos.

---

## Estilizando Transições de Visualização {/*styling-view-transitions*/}

<Note>

Em muitos exemplos iniciais de Transições de Visualização na web, você verá o uso de um [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) e, em seguida, a estilização usando seletores `::view-transition-...(my-name)`. Não recomendamos isso para estilização. Em vez disso, normalmente recomendamos o uso de uma Classe de Transição de Visualização.

</Note>

Para personalizar a animação de um `<ViewTransition>`, você pode fornecer uma Classe de Transição de Visualização a uma das props de ativação. A Classe de Transição de Visualização é um nome de classe CSS que o React aplica aos elementos filhos quando a ViewTransition é ativada.

Por exemplo, para personalizar uma animação de "entrada", forneça um nome de classe à prop `enter`:

```js
<ViewTransition enter="slide-in">
```

Quando o `<ViewTransition>` ativar uma animação de "entrada", o React adicionará o nome de classe `slide-in`. Em seguida, você pode se referir a esta classe usando [pseudo-seletores de transição de visualização](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) para criar animações reutilizáveis:

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

No futuro, as bibliotecas CSS podem adicionar animações integradas usando Classes de Transição de Visualização para facilitar o uso.

---

## Uso {/*usage*/}

### Animando um elemento ao entrar/sair {/*animating-an-element-on-enter*/}

Transições de Entrada/Saída são acionadas quando um `<ViewTransition>` é adicionado ou removido por um componente em uma transição:

```js {3}
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>Oi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

Quando `setShow` é chamado, `show` muda para `true` e o componente `Child` é renderizado. Quando `setShow` é chamado dentro de `startTransition`, e `Child` renderiza um `ViewTransition` antes de qualquer outro nó DOM, uma animação de `enter` é acionada.

Quando `show` muda de volta para `false`, uma animação de `exit` é acionada.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

#### Apenas ViewTransitions de nível superior animam na saída/entrada {/*only-top-level-viewtransition-animates-on-exit-enter*/}

`<ViewTransition>` só ativa a saída/entrada se for colocado _antes_ de quaisquer nós DOM.

Se houver um `<div>` acima do `<ViewTransition>`, nenhuma animação de saída/entrada será acionada:

```js [3, 5]
function Item() {
  return (
    <div> {/* 🚩<div> acima de <ViewTransition> quebra a saída/entrada */}
      <ViewTransition enter="auto" exit="auto" default="none">
        <Video video={videos[0]} />
      </ViewTransition>
    </div>
  );
}
```

Essa restrição evita bugs sutis onde anima muito ou muito pouco.

</Pitfall>

---

### Animando entrada/saída com Activity {/*animating-enter-exit-with-activity*/}

Se você deseja animar um componente entrando e saindo enquanto preserva seu estado, ou pré-renderizando conteúdo para uma animação, você pode usar [`<Activity>`](/reference/react/Activity). Quando um `<ViewTransition>` dentro de um `<Activity>` se torna visível, a animação `enter` é ativada. Quando se torna oculto, a animação `exit` é ativada:

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>

```

Neste exemplo, `Counter` tem um contador com estado interno. Tente incrementar o contador, ocultá-lo e mostrá-lo novamente. O valor do contador é preservado enquanto a barra lateral anima entrando e saindo:

<Sandpack>

```js
import { Activity, ViewTransition, useState, startTransition } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="layout">
      <Toggle show={show} setShow={setShow} />
      <Activity mode={show ? 'visible' : 'hidden'}>
        <ViewTransition enter="auto" exit="auto" default="none">
          <Counter />
        </ViewTransition>
      </Activity>
    </div>
  );
}
function Toggle({show, setShow}) {
  return (
    <button
      className="toggle"
      onClick={() => {
        startTransition(() => {
          setShow(s => !s);
        });
      }}>
      {show ? 'Hide' : 'Show'}
    </button>
  )
}
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

```

```css
.layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 200px;
}
.counter {
  padding: 15px;
  background: #f0f4f8;
  border-radius: 8px;
  width: 200px;
}
.counter h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.counter p {
  margin: 0 0 10px 0;
}
.toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f0f8ff;
  cursor: pointer;
  font-size: 14px;
}
.toggle:hover {
  background: #e0e8ff;
}
.counter button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Sem `<Activity>`, o contador seria resetado para `0` toda vez que a barra lateral reaparecesse.

---

### Animando um elemento compartilhado {/*animating-a-shared-element*/}

Normalmente, não recomendamos atribuir um nome a um `<ViewTransition>` e, em vez disso, deixamos o React atribuir um nome automático. A razão pela qual você pode querer atribuir um nome é para animar entre componentes completamente diferentes quando uma árvore é desmontada e outra árvore é montada ao mesmo tempo, para preservar a continuidade.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Quando uma árvore é desmontada e outra é montada, se houver um par onde o mesmo nome existe na árvore que está sendo desmontada e na árvore que está sendo montada, eles acionam a animação "compartilhada" em ambos. Ela anima do lado que está sendo desmontado para o lado que está sendo montado.

Ao contrário de uma animação de saída/entrada, isso pode estar profundamente dentro da árvore deletada/montada. Se um `<ViewTransition>` também fosse elegível para saída/entrada, então a animação "compartilhada" teria precedência.

Se a Transição primeiro desmontar um lado e depois levar a um fallback `<Suspense>` a ser exibido antes que o novo nome seja eventualmente montado, nenhuma transição de elemento compartilhado ocorrerá.

<Sandpack>

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video, Thumbnail, FullscreenVideo} from './Video';
import videos from './data';

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return (
      <FullscreenVideo
        video={videos[0]}
        onExit={() => startTransition(() => setFullscreen(false))}
      />
    );
  }
  return (
    <Video
      video={videos[0]}
      onClick={() => startTransition(() => setFullscreen(true))}
    />
  );
}
```

```js src/Video.js
import {ViewTransition} from 'react';

const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video, children}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({video, onClick}) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Se um dos lados do par, montado ou desmontado, estiver fora da viewport, então nenhum par é formado. Isso garante que ele não apareça ou desapareça da viewport quando algo é rolado. Em vez disso, ele é tratado como uma entrada/saída regular por si só.

Isso não acontece se a mesma instância do Componente mudar de posição, o que aciona uma "atualização". Essas animam independentemente de um lado estar fora da viewport.

Existe um caso conhecido onde, se um `<ViewTransition>` profundamente aninhado e desmontado estiver dentro da viewport, mas o lado montado não estiver dentro da viewport, o lado desmontado animará como sua própria animação de "saída", mesmo que esteja profundamente aninhado, em vez de como parte da animação pai.

</Note>

<Pitfall>

É importante que haja apenas uma coisa com o mesmo nome montada por vez em todo o aplicativo. Portanto, é importante usar namespaces únicos para o nome para evitar conflitos. Para garantir que você possa fazer isso, você pode querer adicionar uma constante em um módulo separado que você importe.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>

---

### Animando a reordenação de itens em uma lista {/*animating-reorder-of-items-in-a-list*/}

```js
items.map((item) => <Component key={item.id} item={item} />);
```

Ao reordenar uma lista, sem atualizar o conteúdo, a animação "update" é acionada em cada `<ViewTransition>` na lista se eles estiverem fora de um nó DOM. Semelhante às animações de entrada/saída.

Isso significa que isso acionará a animação neste `<ViewTransition>`:

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

No entanto, isso não animaria cada item individualmente:

```js
function Component() {
  return (
    <div>
      <ViewTransition>...</ViewTransition>
    </div>
  );
}
```

Em vez disso, qualquer `<ViewTransition>` pai faria um cross-fade. Se não houver um `<ViewTransition>` pai, então não há animação nesse caso.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Isso significa que você pode querer evitar elementos de wrapper em listas onde você deseja permitir que o Componente controle sua própria animação de reordenação:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

A regra acima também se aplica se um dos itens for atualizado para redimensionar, o que faz com que os irmãos redimensionem, ele também animará seu `<ViewTransition>` irmão, mas apenas se eles forem irmãos imediatos.

Isso significa que durante uma atualização, que causa muito relayout, ele não anima individualmente cada `<ViewTransition>` na página. Isso levaria a muitas animações barulhentas que distraem da mudança real. Portanto, o React é mais conservador sobre quando uma animação individual é acionada.

<Pitfall>

É importante usar corretamente as chaves para preservar a identidade ao reordenar listas. Pode parecer que você poderia usar "name", transições de elementos compartilhados, para animar reordenações, mas isso não seria acionado se um lado estivesse fora da viewport. Para animar uma reordenação, você geralmente quer mostrar que ela foi para uma posição fora da viewport.

</Pitfall>

---

### Animando conteúdo do Suspense {/*animating-from-suspense-content*/}

Como qualquer Transição, o React espera pelos dados e por novos CSS (`<link rel="stylesheet" precedence="...">`) antes de executar a animação. Além disso, as ViewTransitions também esperam até 500ms para que novas fontes sejam carregadas antes de iniciar a animação, para evitar que elas pisquem posteriormente. Pelo mesmo motivo, uma imagem envolvida por uma ViewTransition esperará o carregamento da imagem.

Se estiver dentro de uma nova instância de `Suspense boundary`, o fallback será exibido primeiro. Após o `Suspense boundary` carregar completamente, ele aciona a `<ViewTransition>` para animar a revelação do conteúdo.

Existem duas maneiras de animar `Suspense boundaries` dependendo de onde você coloca a `<ViewTransition>`:

**Atualização:**

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

Neste cenário, quando o conteúdo muda de A para B, ele será tratado como uma "atualização" e aplicará a classe apropriada. Tanto A quanto B terão o mesmo `view-transition-name` e, portanto, agirão como um cross-fade por padrão.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

**Entrada/Saída:**

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

Neste cenário, são duas instâncias separadas de `ViewTransition`, cada uma com seu próprio `view-transition-name`. Isso será tratado como uma "saída" de `<A>` e uma "entrada" de `<B>`.

Você pode obter efeitos diferentes dependendo de onde escolher colocar o limite da `<ViewTransition>`.

---

### Desativando uma animação {/*opting-out-of-an-animation*/}

Às vezes, você está envolvendo um componente grande existente, como uma página inteira, e deseja animar algumas atualizações, como a mudança de tema. No entanto, você não quer que todas as atualizações dentro da página inteira sejam animadas com cross-fade quando elas são atualizadas. Especialmente se você estiver adicionando animações incrementalmente.

Você pode usar a classe "none" para desativar uma animação. Ao envolver seus filhos em um "none", você pode desativar animações para atualizações neles, enquanto o pai ainda aciona.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

Isso animará apenas se o tema mudar e não se apenas os filhos forem atualizados. Os filhos ainda podem optar por participar novamente com sua própria `<ViewTransition>`, mas pelo menos será manual novamente.

---

### Personalizando animações {/*customizing-animations*/}

Por padrão, `<ViewTransition>` inclui o cross-fade padrão do navegador.

Para personalizar animações, você pode fornecer props para o componente `<ViewTransition>` para especificar quais animações usar, com base em como a `<ViewTransition>` é ativada.

Por exemplo, podemos desacelerar a animação de cross-fade padrão:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

E definir `slow-fade` em CSS usando classes de transição de visualização:

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Além de definir o `default`, você também pode fornecer configurações para animações de `enter`, `exit`, `update` e `share`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 4px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Personalizando animações com tipos {/*customizing-animations-with-types*/}

Você pode usar a API [`addTransitionType`](/reference/react/addTransitionType) para adicionar um nome de classe aos elementos filhos quando um tipo específico de transição é ativado para um gatilho de ativação específico. Isso permite que você personalize a animação para cada tipo de transição.

Por exemplo, para personalizar a animação para todas as navegações para frente e para trás:

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>;

// no seu roteador:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

Quando a `ViewTransition` ativa uma animação "navigation-back", o React adicionará o nome da classe "slide-right". Quando a `ViewTransition` ativa uma animação "navigation-forward", o React adicionará o nome da classe "slide-left".

No futuro, roteadores e outras bibliotecas poderão adicionar suporte para tipos e estilos de transição de visualização padrão.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Animação com JavaScript {/*animating-with-javascript*/}

Enquanto as [Classes de Transição de Visualização](#view-transition-class) permitem definir animações com CSS, às vezes você precisa de controle imperativo sobre a animação. Os callbacks `onEnter`, `onExit`, `onUpdate` e `onShare` dão acesso direto aos pseudo-elementos de transição de visualização para que você possa animá-los usando a [Web Animations API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Animations_API).

Cada callback recebe uma `instance` com propriedades `.old` e `.new` representando os pseudo-elementos de transição de visualização. Você pode chamar `.animate()` neles assim como faria em um elemento DOM:

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

Isso permite combinar animações controladas por CSS e animações controladas por JavaScript.

No exemplo a seguir, o fade cruzado padrão é tratado por CSS, e as animações de slide são controladas por JavaScript nas animações `onEnter` e `onExit`:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      default="none"
      /* CSS driven cross fade defaults */
      enter="auto"
      exit="auto"
      /* JS driven slide animations */
      onEnter={(instance) => {
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: 500, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: 300, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {transform: 'translateY(20px)'},
  {transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {transform: 'translateY(0)'},
  {transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

#### Sempre limpe os Eventos de Transição de Visualização {/*always-clean-up-view-transition-events*/}

Os Eventos de Transição de Visualização devem sempre retornar uma função de limpeza:

```js {7}
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: 500, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

Isso permite que o navegador cancele a animação quando a Transição de Visualização for interrompida.

</Note>

---

### Animação de tipos de transição com JavaScript {/*animating-transition-types-with-javascript*/}

Você pode usar `types` passados para eventos de `ViewTransition` para aplicar condicionalmente animações diferentes com base em como a Transição foi acionada.

```js {3}
 <ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

Este exemplo chama [`addTransitionType`](/reference/react/addTransitionType) para marcar uma Transição como "rápida" e, em seguida, ajustar a duração da animação:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, addTransitionType} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      onEnter={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 2000;
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: duration, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 500;
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: duration, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  const [isFast, setIsFast] = useState(false);
  return (
    <>
      <div>
        Fast: <input type="checkbox" onChange={() => {setIsFast(f => !f)}} value={isFast}></input>
      </div><br />
      <button
        onClick={() => {
          startTransition(() => {
            if (isFast) {
              addTransitionType('fast');
            }
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {opacity: 1, transform: 'translateY(0)'},
  {opacity: 0, transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Construindo roteadores com suporte a Transição de Visualização {/*building-view-transition-enabled-routers*/}

O React aguarda a conclusão de qualquer Navegação pendente para garantir que a restauração da rolagem ocorra dentro da animação. Se a Navegação estiver bloqueada no React, seu roteador deve desbloquear em `useLayoutEffect`, pois `useEffect` levaria a um deadlock.

Se um `startTransition` for iniciado a partir do evento popstate legado, como durante uma navegação "voltar", ele deverá ser concluído de forma síncrona para garantir que a restauração de scroll e formulário funcione corretamente. Isso entra em conflito com a execução de uma animação de Transição de Visualização. Portanto, o React pulará as animações de popstate e as animações não serão executadas para o botão voltar. Você pode corrigir isso atualizando seu roteador para usar a API de Navegação.

---

## Solução de Problemas {/*troubleshooting*/}

### Meu `<ViewTransition>` não está ativando {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` só ativa se for colocado antes de qualquer nó DOM:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Oi</ViewTransition>
    </div>
  );
}
```

Para corrigir, certifique-se de que `<ViewTransition>` venha antes de quaisquer outros nós DOM:

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>Oi</div>
    </ViewTransition>
  );
}
```

### Estou recebendo um erro "Existem dois componentes `<ViewTransition name=%s>` com o mesmo nome montados ao mesmo tempo." {/*two-viewtransition-with-same-name*/}

Este erro ocorre quando dois componentes `<ViewTransition>` com o mesmo `name` são montados ao mesmo tempo:

```js [3]
function Item() {
  // 🚩 Todos os itens receberão o mesmo "name".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </>
  );
}
```

Isso fará com que a Transição de Visualização gere um erro. Em desenvolvimento, o React detecta esse problema para exibi-lo e registra dois erros:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

Existem dois componentes `<ViewTransition name=%s>` com o mesmo nome montados ao mesmo tempo. Isso não é suportado e fará com que as Transições de Visualização gerem um erro. Tente usar um nome mais exclusivo, por exemplo, usando um prefixo de namespace e adicionando o id de um item ao nome.
{' '}em Item
{' '}em ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

A duplicata existente de `<ViewTransition name=%s>` tem este rastreamento de pilha.
{' '}em Item
{' '}em ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

Para corrigir, certifique-se de que haja apenas um `<ViewTransition>` com o mesmo nome montado ao mesmo tempo em todo o aplicativo, garantindo que o `name` seja exclusivo ou adicionando um `id` ao nome:

```js [3]
function Item({id}) {
  // ✅ Todos os itens receberão um nome exclusivo.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
```
