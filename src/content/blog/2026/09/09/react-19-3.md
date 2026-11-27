---
title: "React 19.3"
author: The React Team
date: 2026/09/09
description: O React 19.3 adiciona novos recursos como View Transitions, Fragment Refs, browser(), Trusted Types e muito mais.
---

9 de setembro de 2026 por [A Equipe do React](/community/team)

---

<Intro>

O React 19.3 já está disponível no npm!

</Intro>


[No ano passado](/blog/2025/04/23/react-labs-view-transitions-activity-and-more), compartilhamos View Transitions e Fragment Refs como novas APIs experimentais que chegariam ao React. Estamos animados em anunciar que ambas agora são estáveis no React 19.3!

Neste post, vamos mostrar como elas funcionam e também abordar outras mudanças notáveis desta versão.

<InlineToc />

---

## Novos recursos do React {/*new-react-features*/}

### View Transitions {/*view-transition*/}

O novo componente `<ViewTransition>` permite animar elementos quando eles entram, saem, se movem ou são redimensionados, usando a [View Transition API](https://developer.mozilla.org/pt-BR/docs/Web/API/View_Transition_API) do navegador. Nós o compartilhamos como uma API experimental [no ano passado](/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions), e no 19.3 ele está estável e pronto para uso.

Para animar parte da sua UI, envolva-a em `<ViewTransition>`:

```js
import { ViewTransition } from 'react';

{isShowing && (
  <ViewTransition>
    <Component />
  </ViewTransition>
)}
```

Agora, sempre que uma atualização marcada como [Transition](/reference/react/useTransition) alterar o estilo do componente filho, ou fizer com que o `ViewTransition` seja montado ou desmontado, o React vai animar essa atualização.

{/*
Atualizações fora de uma Transition não disparam animações, pois elas devem ser urgentes e refletidas imediatamente na UI. Atualizações de estado dentro de [startTransition](/reference/react/startTransition), a revelação de um [`<Suspense>`](/reference/react/Suspense) ou uma atualização de [`useDeferredValue`](/reference/react/useDeferredValue) fazem uma View Transition ser animada.
*/}

O React escolhe qual animação executar com base em como a árvore mudou:

- **enter**: o `<ViewTransition>` é adicionado.
- **exit**: o `<ViewTransition>` é removido.
- **update**: os filhos de um `<ViewTransition>` mudam de estilo ou de conteúdo.
- **share**: um `<ViewTransition>` com nome é removido de um lugar e adicionado em outro.

Observe que atualizações não marcadas como Transitions não disparam animações, pois elas devem ser urgentes e refletidas imediatamente na UI. Atualizações de estado dentro de [startTransition](/reference/react/startTransition), a revelação de um [`<Suspense>`](/reference/react/Suspense) ou uma atualização de [`useDeferredValue`](/reference/react/useDeferredValue) fazem uma View Transition ser animada.

Aqui está um exemplo simples de uma animação de entrada/saída:

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
import { ViewTransition, useState, startTransition } from 'react';
import { Video } from './Video';
import videos from './data';

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

      {showItem && (
        <ViewTransition>
          <Video video={videos[0]} />
        </ViewTransition>
      )}
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Por padrão, `<ViewTransition>` anima com um cross-fade suave. Você pode personalizar cada tipo de animação passando uma [View Transition Class](/reference/react/ViewTransition#view-transition-class) e definindo a animação em CSS, ou pode usar a [Web Animations API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Animations_API) para disparar animações de forma imperativa com as [props de evento](/reference/react/ViewTransition#view-transition-event) (`onEnter`, `onExit`, `onShare`, `onUpdate`).

{/*
Há algumas regras para ter em mente. Um `<ViewTransition>` só anima na entrada e na saída se for a primeira coisa renderizada na sua subárvore, antes de qualquer nó do DOM, e cada `name` compartilhado deve ser único em todo o seu app em um dado momento. Veja [Solução de problemas](/reference/react/ViewTransition#troubleshooting) para os detalhes.
 */}

Atualmente, `<ViewTransition>` funciona apenas no DOM. Estamos trabalhando no suporte para React Native e outras plataformas.

Para saber mais, veja a [documentação de `<ViewTransition>`](/reference/react/ViewTransition).

---

#### `addTransitionType` {/*add-transition-type*/}

Às vezes, você vai querer personalizar qual animação é usada para a mesma atualização de estado. Por exemplo, avançar um carrossel _para frente_ até o terceiro slide deve animar os slides da direita para a esquerda, enquanto voltar _para trás_ deve animá-los da esquerda para a direita, mesmo que ambas as ações definam currentSlide como 3.

Você pode personalizar a animação de uma determinada View Transition chamando `addTransitionType` junto com a atualização de estado. Isso permite adicionar mais informações sobre a _causa_ de uma Transition específica:

```js {3,10}
function nextSlide() {
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
}

function previousSlide() {
  startTransition(() => {
    addTransitionType('previous');
    setCurrentSlide(c => c - 1);
  });
}
```

Depois, você pode especificar animações diferentes com base nesse tipo de Transition:

```js
<ViewTransition
  enter={{
    'next': 'from-right',
    'previous': 'from-left',
  }}
  exit={{
    'next': 'to-left',
    'previous': 'to-right',
  }}
>
  <Page />
</ViewTransition>
```

Aqui está um exemplo:

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
  Fragment
} from 'react';
import { Video } from './Video';
import videos from './data';
import './animations.css';

export default function Component() {
  const [selected, setSelected] = useState(0)
  const video = videos[selected];

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : videos.length - 1 )
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('next');
              setSelected(c => c + 1 < videos.length ? c + 1 : 0)
            });
          }}>
          ➡️
        </button>
      </div>

      <ViewTransition
        key={video.id}
        enter={{
          'next': 'from-right',
          'previous': 'from-left'
        }}
        exit={{
          'next': 'to-left',
          'previous': 'to-right'
        }}
      >
        <Video video={video} />
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
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];
```

```css src/animations.css
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 250ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-new(.from-right) {
  --offset: 100%;
  animation-name: slide-in;
}

::view-transition-new(.from-left) {
  --offset: -100%;
  animation-name: slide-in;
}

::view-transition-old(.to-right) {
  --offset: 100%;
  animation-name: slide-out;
}

::view-transition-old(.to-left) {
  --offset: -100%;
  animation-name: slide-out;
}

@keyframes slide-in {
  from {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}
```

```css src/styles.css
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
  gap: 8px;
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

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

O React também adiciona cada Transition Type ao elemento como um [view transition type](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) do navegador, para que você possa limitar o escopo das animações em CSS com `:active-view-transition-type(...)`.

Para saber mais, veja a [documentação de `addTransitionType`](/reference/react/addTransitionType).

---

#### Animando fallbacks, imagens e fontes com Suspense {/*animating-fallbacks-images-and-fonts-with-suspense*/}

Uma das coisas mais empolgantes sobre View Transitions no React é como elas se integram com Suspense.

Você pode animar um limite de Suspense enquanto ele revela seus filhos, envolvendo-o em `<ViewTransition>`:

```js
<ViewTransition>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</ViewTransition>
```

Quando os filhos terminam de carregar, o React dispara uma animação de **update** do fallback para o conteúdo final.

Aqui está um exemplo. Tente pressionar ➕ para renderizar um LazyVideo que suspende na primeira vez em que é renderizado:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

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
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
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
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 750ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
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
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Embora isso funcione, você vai notar que o vídeo também é animado ao aparecer e desaparecer nas revelações seguintes, mesmo já tendo sido carregado. (Você também pode notar que o fallback aparece com fade-in na primeira vez em que é exibido.)

Em geral, animações com Suspense funcionam melhor quando usadas com moderação, e evitadas para UI em cache que, de outra forma, apareceria instantaneamente.

Aqui estão alguns princípios para alcançar uma boa UX ao animar com Suspense:

- Fallbacks devem aparecer imediatamente _sem animação_
- Um fallback deve ser atualizado para seu conteúdo final _com animação_
- Filhos que não suspendem devem aparecer imediatamente _sem animação_

Isso faz seu app parecer ágil quando tudo já está carregado, e usa animação apenas para tornar mais fluida a transição do fallback para o conteúdo final.

Para corrigir nosso exemplo acima, podemos desativar todas as animações, exceto as de atualização:

```js {1}
<ViewTransition update="auto" default="none">
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
</ViewTransition>
```

Vamos ver como ele se comporta agora:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

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
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition update="auto" default="none">
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
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
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 5000ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
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
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Observe como o fallback aparece imediatamente ao tocar no botão, o que mantém nossa UI responsiva às ações do usuário. Além disso, depois que o vídeo foi carregado, alterná-lo é instantâneo.

Há outros padrões que você pode usar, dependendo do efeito que deseja alcançar. Para saber mais, confira a documentação sobre [animar com Suspense](/reference/react/ViewTransition#animating-from-suspense-content).

---

Além de animar fallbacks, View Transitions servem como uma forma de fazer com que imagens ou fontes disparem Suspense enquanto carregam.

Isso permite evitar o comportamento padrão do navegador, em que imagens ou fontes podem aparecer piscando sempre que terminam de carregar, e, em vez disso, construir sequências de carregamento coordenadas que consideram todos os recursos de um componente.

Envolva imagens ou fontes dentro de `<ViewTransition>` para disparar Suspense enquanto elas carregam:

```js
<ViewTransition>
  <Suspense fallback={<Fallback />}>
    <img src={imageSrc} />

    <style href={fontSrc} precedence="default">
      {`@font-face {
        font-family: 'Fancy';
        src: url(${fontSrc}) format('truetype');
        font-display: swap;
      }`}
    </style>
  </Suspense>
</ViewTransition>
```

Aqui está um exemplo de um componente que suspende até que seus dados, imagem e fonte tenham sido carregados:


<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import { ProfileCard, ProfileCardLoading } from './ProfileCard.js';
import { VanillaProfileCard } from './VanillaProfileCard.js';

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>

      {resources && (
        <ViewTransition update='auto' default='none'>
          <Suspense fallback={<ProfileCardLoading />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}

      <hr />

      <VanillaProfileCard />
    </>
  );
}
```

```js src/ProfileCard.js
import { use } from 'react';

export function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

export function ProfileCardLoading() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}
```


```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        img { object-fit: cover; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Adiciona um parâmetro único para que os recursos não fiquem em cache,
// e cada execução mostre o estado de carregamento.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Observação: a forma como você faz data fetching depende
// do framework que você usa junto com o Suspense.

export async function fetchQuote() {
  // Adiciona um atraso falso para tornar a espera perceptível.
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
img {
  object-fit: cover;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Para saber mais sobre como esperar o carregamento de imagens, fontes ou folhas de estilo, veja a [documentação de Suspense](/reference/react/Suspense#waiting-for-a-font-to-load).

---

### Fragment Refs {/*fragment-refs*/}

Quando você precisa de um controle de mais baixo nível sobre os nós do DOM de um componente (por exemplo, para anexar um event listener, observar a visibilidade ou mover o foco), normalmente você pode usar uma ref. Mas há algumas situações em que isso é difícil:

- Componentes que renderizam um grupo de irmãos sem um único pai
- Componentes que não repassam sua prop `ref` para outro elemento

```js
function Component() {
  // Como podemos trabalhar com a lista de nós do DOM renderizados por este componente?
  return (
    {posts.map(post => (
      <Heading key={post.id}>
        {post.title}
      </Heading>
    ))}
  )
}
```

Adicionar uma `<div>` wrapper só para guardar uma ref às vezes funciona, mas também pode interferir no estilo ou no layout do seu componente. Além disso, se um componente não expõe uma prop `ref`, você precisaria modificar esse componente para fazer isso, o que pode ser impossível se ele vier de uma biblioteca que você não controla.

Fragment Refs resolvem esses problemas fornecendo um conjunto limitado de métodos do DOM comumente usados, que funcionam com qualquer componente React, independentemente do que ele renderiza.

No 19.3, você pode usá-las passando uma ref diretamente para um [`<Fragment>`](/reference/react/Fragment). Essa ref fornece uma `FragmentInstance`, que você pode usar para trabalhar com os filhos do DOM do Fragment:

```js {2,5-6,10}
function Component() {
  const fragmentRef = useRef(null);

  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.focus();
  }, []);

  return (
    <Fragment ref={fragmentRef}>
      {posts.map(post => (
        <Heading key={post.id}>
          {post.title}
        </Heading>
      ))}
    </Fragment>
  )
}
```

A `FragmentInstance` opera sobre o DOM dos filhos _como um grupo_, sem alterar sua estrutura:

- `addEventListener`, `removeEventListener` e `dispatchEvent` gerenciam eventos para os filhos de primeiro nível.
- `focus`, `focusLast` e `blur` movem o foco entre filhos aninhados, em profundidade (depth-first).
- `observeUsing` e `unobserveUsing` conectam um `IntersectionObserver` ou `ResizeObserver`.
- `getClientRects`, `getRootNode`, `compareDocumentPosition` e `scrollIntoView` permitem medir e rolar até os filhos de primeiro nível do fragment.

Assim, Fragment Refs permitem anexar comportamento a outros componentes sem exigir que você modifique a parte interna desses componentes, e sem alterar a estrutura do DOM que eles já produzem.

Este exemplo mostra um componente `InView` com uma prop `onChange` que é disparada sempre que seus filhos entram ou saem da viewport:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Card from './Card';
import InView from './InView';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>

      <InView onChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </InView>

      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```js src/InView.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

export default function InView({ onChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Observe como `InView` consegue adicionar comportamento aos seus filhos, mesmo que não exista um único elemento pai no DOM, e apesar de `Card` não expor uma prop `ref`.

Para saber mais sobre como trabalhar com Fragment Refs, veja a [documentação de `<Fragment>`](/reference/react/Fragment).

---

## Novos recursos do React DOM {/*new-react-dom-features*/}

### `browser` {/*browser*/}

Se o seu app usa renderização no servidor, seus componentes vão renderizar em dois ambientes diferentes:

- No servidor, os componentes renderizam para produzir o HTML inicial
- No cliente, os componentes renderizam para enriquecer esse HTML com manipuladores de eventos

Na maioria das vezes, seus componentes devem ser capazes de produzir um HTML que corresponda à sua saída inicial renderizada no cliente, garantindo que eles sejam hidratados corretamente e, ao mesmo tempo, permitindo que os usuários vejam o máximo de conteúdo possível no carregamento inicial.

Mas, em casos raros, um componente pode não conseguir produzir uma UI significativa no servidor. Por exemplo, ele pode depender de uma API exclusiva do navegador como `localStorage`, ou pode ler o fuso horário local do navegador. Nesses casos, talvez você queira excluir esse componente completamente da renderização no servidor.

Antes, você poderia fazer isso usando algum estado atualizado em um Effect, ou verificando a presença de APIs do navegador como `window`:

```js
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}
```

No 19.3, o React agora inclui uma API nativa para essa técnica.

Um componente pode chamar `use(browser())` para optar por não participar da renderização do lado do servidor:

```js {5}
import { use } from 'react';
import { browser } from 'react-dom';

function Component() {
  use(browser());

  // ...
}
```

Isso vai disparar Suspense no servidor, mas _não_ no cliente. Durante a renderização do lado do servidor, o fallback do limite de Suspense mais próximo será exibido no HTML. Depois que o componente é hidratado no cliente, `use(browser())` não suspende, permitindo que o componente continue renderizando normalmente.

Aqui está um exemplo de um componente que renderiza o fuso horário local do seu dispositivo. Pressione **Reload** para ver o HTML inicial seguido da primeira renderização do React no cliente:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone() {
  use(browser());
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{timeZone}</p>
}

export default function App() {
  return (
    <>
      <p>Your current time zone is:</p>
      <Suspense fallback="Loading...">
        <TimeZone />
      </Suspense>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Espera para que tanto o fallback quanto o conteúdo hidratado fiquem visíveis.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Como TimeZone suspende no servidor, o HTML inicial inclui o fallback do Suspense. Após um pequeno atraso artificial, o React hidrata a página, permitindo que o componente renderize normalmente no navegador.

Assim, para componentes que não conseguem produzir uma UI significativa durante a renderização no servidor, `browser` permite usar Suspense para seus estados de carregamento, fazendo com que eles participem junto com outros componentes que suspendem até estarem prontos para renderizar.

---

Como outras chamadas a `use`, `use(browser())` pode ser chamado dentro de uma instrução condicional ou após um retorno antecipado. Isso permite escrever componentes ou Hooks personalizados que podem optar por não participar da renderização no servidor com base em uma condição, como o valor de uma prop.

Aqui está o mesmo exemplo de cima, exceto que agora nosso componente TimeZone aceita um valor padrão opcional que ele pode renderizar como parte do HTML inicial:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone({ defaultValue }) {
  if (defaultValue) {
    return <p>{defaultValue}</p>;
  }

  use(browser());
  const localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{localTimeZone}</p>
}

export default function App() {
  return (
    <>
      <div>
        <p>The event's time zone is:</p>
        <TimeZone defaultValue='America/New_York' />
      </div>

      <hr />

      <div>
        <p>Your current time zone is:</p>
        <Suspense fallback="Loading...">
          <TimeZone />
        </Suspense>
      </div>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Espera para que tanto o fallback quanto o conteúdo hidratado fiquem visíveis.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Observe como TimeZone só suspende no segundo caso, quando nenhum valor padrão é fornecido.

Outro exemplo útil desse padrão é fazer com que um Hook de data fetching como `useQuery` não participe da renderização no servidor, a menos que os dados iniciais dessa query tenham sido passados (por exemplo, a partir de um Server Component ou da função loader de um framework):

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser());
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

Agora, o componente ProductDetails pode ser incluído no HTML, desde que receba `initialData` durante a renderização no servidor. Caso contrário, ele suspende até ser renderizado no navegador, momento em que `useQuery` pode buscar os dados ou ler do seu cache normalmente.

Para saber mais sobre `browser`, [confira a documentação](/reference/react-dom/browser).

---

### Suporte a Trusted Types {/*trusted-types-support*/}

O React 19.3 se integra com a [Trusted Types API](https://developer.mozilla.org/pt-BR/docs/Web/API/Trusted_Types_API) do navegador, um recurso de segurança que ajuda a prevenir ataques de XSS baseados em DOM. Quando um site impõe Trusted Types com `Content-Security-Policy: require-trusted-types-for 'script'`, o navegador exige que os valores passados para injection sinks como `innerHTML` sejam objetos tipados (`TrustedHTML`, `TrustedScript`, `TrustedScriptURL`) criados por meio das suas políticas de sanitização, em vez de strings brutas.

Antes, o React sempre convertia valores para strings (via `'' + value`) antes de passá-los para as APIs do DOM, o que transformava os objetos de Trusted Types de volta em strings simples que o navegador rejeitaria. Agora o React repassa esses valores sem conversão, para que o navegador possa validá-los e suas políticas de Trusted Types funcionem como esperado.

---

## Novos recursos de React Server Components {/*new-react-server-components-features*/}

### `<Context>` pode ser renderizado diretamente em Server Components {/*context-can-be-rendered-directly-in-server-components*/}

Embora Server Components não possam _criar_ Context, eles podem _renderizar_ Context importando-o de um módulo `'use client'`.

Antes, isso exigia que o módulo do cliente exportasse um componente wrapper separado, geralmente chamado de Provider:

```js {7-9}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ currentUser, children }) {
  return <UserContext value={currentUser}>{children}</UserContext>;
}
```

```js {8}
// server-component.js
import { UserProvider } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserProvider currentUser={currentUser}>
      {children}
    </UserProvider>
  )
}
```

Observe que, neste exemplo, o provider não faz nada além de passar a prop do Server Component diretamente para o Context.

No React 19.3, Server Components podem importar e renderizar Context diretamente de um módulo `'use client'`, sem um componente wrapper adicional:

```js {5}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

```js {8}
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  )
}
```

Isso é especialmente útil para Contexts que existem apenas para permitir que Server Components compartilhem alguns dados com o restante da árvore do cliente.


---

## Changelog {/*changelog*/}

Outras mudanças notáveis
- `react`: Renderiza Transitions de forma independente em vez de combiná-las em uma única renderização, para que uma Transition lenta não segure mais outras não relacionadas [#37290](https://github.com/react/react/pull/37290)
- `react-dom`: Invoca Effects duas vezes no Strict Mode durante a hidratação, igualando o comportamento de raízes renderizadas no cliente [#35961](https://github.com/react/react/pull/35961)
- `react`: Adiciona um aviso quando `use` é usado incorretamente em uma condicional [#37104](https://github.com/react/react/pull/37104)
- `react`: Renomeia "form state" para "action state" nas mensagens de erro de `useActionState` [#35790](https://github.com/react/react/pull/35790)
- `react-dom`: Adiciona suporte aos eventos `onFullscreenChange` e `onFullscreenError` [#34621](https://github.com/react/react/pull/34621)
- `react-dom`: Adiciona suporte à propriedade SVG `maskType` [#35921](https://github.com/react/react/pull/35921)
- `react-dom`: Suporta `fetchPriority` para recursos de módulo [#36835](https://github.com/react/react/pull/36835)
- `react-dom`: Dispara `onReset` quando o React reseta automaticamente um formulário após uma Server Action [#35176](https://github.com/react/react/pull/35176)
- `react-dom`: Inclui o `submitter` nos eventos `submit` [#35590](https://github.com/react/react/pull/35590)
- `react-dom`: Reconhece `credentialless` como um atributo booleano em iframes [#36148](https://github.com/react/react/pull/36148)
- `react-dom`: Agrupa (batch) atualizações de eventos `resize` até o próximo frame [#35117](https://github.com/react/react/pull/35117)
- `react-server`: Transporta `Error.cause` [#35810](https://github.com/react/react/pull/35810) e `AggregateError.errors` [#36156](https://github.com/react/react/pull/36156) para o cliente
- `react-server`: Adiciona suporte a `<Activity>` no Flight [#34697](https://github.com/react/react/pull/34697)

Correções de bugs notáveis

- `react`: Corrige `useDeferredValue` ficando preso em um valor antigo [#36134](https://github.com/react/react/pull/36134)
- `react`: Corrige a propagação de contexto para fallbacks do Suspense [#36160](https://github.com/react/react/pull/36160) e através de limites de Suspense suspensos [#35839](https://github.com/react/react/pull/35839)
- `react`: Corrige um travamento ao atualizar um limite de Suspense desidratado dentro de uma árvore oculta [#37135](https://github.com/react/react/pull/37135)
- `react`: Corrige `useSyncExternalStore` perdendo mutações do store que aconteceram enquanto uma árvore `<Activity>` estava oculta [#36947](https://github.com/react/react/pull/36947)
- `react`: Corrige `useEffectEvent` para ler os valores mais recentes em componentes `forwardRef` e `memo` [#34831](https://github.com/react/react/pull/34831)
- `react`: Corrige o status do formulário sendo resetado quando o estado do componente é atualizado [#34075](https://github.com/react/react/pull/34075)
- `react`: Corrige vários bugs do Fast Refresh com `lazy`, `memo` e edições que mudam o tipo de um componente [#36965](https://github.com/react/react/pull/36965), [#36964](https://github.com/react/react/pull/36964), [#36963](https://github.com/react/react/pull/36963), [#36950](https://github.com/react/react/pull/36950)
- `react`: Corrige um bug em que `<title>` ainda era elevado para o `<head>` depois que o `<Activity>` contendo o `<title>` mudava de modo de `visible` para `hidden` [#34983](https://github.com/react/react/pull/34983)
- `react`: Impede que erros escapem de um `<Activity>` oculto [#35074](https://github.com/react/react/pull/35074)
- `react`: Oculta o conteúdo de portals renderizados dentro de um `<Activity>` oculto [#35091](https://github.com/react/react/pull/35091)
- `react`: Não referencia mais o tipo interno `<Offscreen>` nas mensagens de erro [#35763](https://github.com/react/react/pull/35763)
- `react-dom`: Corrige o foco para elementos delegados e que já estão focados [#36010](https://github.com/react/react/pull/36010)
- `react-dom`: Corrige um vazamento de listener em `FragmentInstance` normalizando as opções de captura conforme a especificação do DOM [#36047](https://github.com/react/react/pull/36047)
- `react-dom`: Corrige uma falha de `<ViewTransition>` no Safari Mobile [#35337](https://github.com/react/react/pull/35337)
- `react-dom`: Corrige uma falha de `<ViewTransition>` com `SuspenseList` [#35520](https://github.com/react/react/pull/35520)
- `react-dom`: Atualiza `defaultValue` para inputs `type="number"` para corresponder aos outros tipos de input [#36980](https://github.com/react/react/pull/36980)
- `react-dom`: Evita definir `innerHTML` quando ele não mudou [#36949](https://github.com/react/react/pull/36949)
- `react-dom`: Corrige um falso positivo de incompatibilidade de hidratação em atributos `nonce` [#37030](https://github.com/react/react/pull/37030)
- `react-dom`: Corrige o travamento de `react-dom/server` no Deno [#35235](https://github.com/react/react/pull/35235)
- `react-server`: Corrige entradas de `FormData` descartadas em `decodeReplyFromBusboy` [#36468](https://github.com/react/react/pull/36468)
- `react-server`: Corrige um stack overflow com cadeias async profundas [#35612](https://github.com/react/react/pull/35612) e um `RangeError` causado pelo crescimento exponencial de informações de depuração [#37481](https://github.com/react/react/pull/37481)

Para ver a lista completa de mudanças, consulte o [Changelog](https://github.com/react/react/blob/main/CHANGELOG.md).

---

_Agradecimentos a [Sam Selikoff](https://x.com/samselikoff) por escrever este post, e a [Matt Carroll](https://mattcarrollcode.com/), [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Andrew Clark](https://x.com/acdlite) por revisá-lo._
