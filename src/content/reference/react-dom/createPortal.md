---
title: createPortal
---

<Intro>

`createPortal` permite que você renderize alguns filhos em uma parte diferente do DOM.

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Para criar um portal, chame `createPortal`, passando algum JSX e o nó do DOM onde ele deve ser renderizado:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[Veja mais exemplos abaixo.](#usage)

Um portal só muda a colocação física do nó do DOM. Em todas as outras maneiras, o JSX que você renderiza em um portal atua como um nó filho do componente React que o renderiza. Por exemplo, o filho pode acessar o contexto fornecido pela árvore pai, e eventos propagam-se de filhos para pais de acordo com a árvore React.

#### Parâmetros {/*parameters*/}

*   `children`: Qualquer coisa que possa ser renderizada com o React, como um pedaço de JSX (por exemplo, `<div />` ou `<SomeComponent />`), um [Fragmento](/reference/react/Fragment) (`<>...</>`), uma string ou um número, ou uma array disso.

*   `domNode`: Algum nó do DOM, como aqueles retornados por `document.getElementById()`. O nó já deve existir. Passar um nó DOM diferente durante uma atualização fará com que o conteúdo do portal seja recriado.

<<<<<<< HEAD
*   **opcional** `key`: Uma string ou número único a ser usado como a [chave](/learn/rendering-lists/#keeping-list-items-in-order-with-key) do portal.
=======
* **optional** `key`: A unique string or number to be used as the portal's [key.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

#### Retorna {/*returns*/}

`createPortal` retorna um nó React que pode ser incluído em JSX ou retornado de um componente React. Se o React o encontrar na saída de renderização, ele colocará os `children` fornecidos dentro do `domNode` fornecido.

#### Ressalvas {/*caveats*/}

*   Eventos de portais se propagam de acordo com a árvore React, em vez da árvore DOM. Por exemplo, se você clicar dentro de um portal, e o portal for encapsulado em `<div onClick>`, esse manipulador `onClick` será acionado. Se isso causar problemas, pare a propagação do evento de dentro do portal, ou mova o próprio portal para cima na árvore React.

---

## Uso {/*usage*/}

### Renderizando para uma parte diferente do DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portais* permitem que seus componentes renderizem alguns de seus filhos em um lugar diferente no DOM. Isso permite que parte do seu componente "escape" de quaisquer contêineres em que ele possa estar. Por exemplo, um componente pode exibir um diálogo modal ou uma dica de ferramenta que aparece acima e fora do restante da página.

Para criar um portal, renderize o resultado de `createPortal` com <CodeStep step={1}>algum JSX</CodeStep> e o <CodeStep step={2}>nó do DOM para onde ele deve ir</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React colocará os nós DOM para <CodeStep step={1}>o JSX que você passou</CodeStep> dentro do <CodeStep step={2}>nó DOM que você forneceu</CodeStep>.

Sem um portal, o segundo `<p>` seria colocado dentro da `<div>` pai, mas o portal o "teletransportou" para o [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Observe como o segundo parágrafo aparece visualmente fora da `<div>` pai com a borda. Se você inspecionar a estrutura do DOM com ferramentas de desenvolvedor, você verá que o segundo `<p>` foi colocado diretamente no `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Um portal muda apenas a colocação física do nó do DOM. De todas as outras maneiras, o JSX que você renderiza em um portal atua como um nó filho do componente React que o renderiza. Por exemplo, o filho pode acessar o contexto fornecido pela árvore pai, e os eventos ainda se propagam de filhos para pais de acordo com a árvore React.

---

### Renderizando um diálogo modal com um portal {/*rendering-a-modal-dialog-with-a-portal*/}

Você pode usar um portal para criar um diálogo modal que flutua acima do restante da página, mesmo que o componente que invoca o diálogo esteja dentro de um contêiner com `overflow: hidden` ou outros estilos que interferem no diálogo.

Neste exemplo, os dois contêineres têm estilos que interrompem o diálogo modal, mas o que é renderizado em um portal não é afetado porque, no DOM, o modal não está contido dentro dos elementos JSX pai.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

É importante garantir que seu aplicativo seja acessível ao usar portais. Por exemplo, pode ser necessário gerenciar o foco do teclado para que o usuário possa mover o foco para dentro e para fora do portal de uma maneira natural.

Siga as [Práticas de Criação de Modal WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) ao criar modais. Se você usar um pacote da comunidade, certifique-se de que ele seja acessível e siga essas diretrizes.

</Pitfall>

---

### Renderizando componentes React em marcação de servidor não React {/*rendering-react-components-into-non-react-server-markup*/}

Portais podem ser úteis se sua raiz React for apenas parte de uma página estática ou renderizada no servidor que não é construída com React. Por exemplo, se sua página for construída com uma estrutura de servidor como Rails, você pode criar áreas de interatividade dentro de áreas estáticas, como barras laterais. Em comparação com ter [várias raízes React separadas,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portais permitem que você trate o aplicativo como uma única árvore React com estado compartilhado, mesmo que suas partes renderizem em diferentes partes do DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Renderizando componentes React em nós DOM não React {/*rendering-react-components-into-non-react-dom-nodes*/}

Você também pode usar um portal para gerenciar o conteúdo de um nó DOM que é gerenciado fora do React. Por exemplo, suponha que você esteja integrando com um widget de mapa que não é React e deseja renderizar o conteúdo React dentro de um popup. Para fazer isso, declare uma variável de estado `popupContainer` para armazenar o nó DOM em que você vai renderizar:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Quando você cria o widget de terceiros, armazene o nó DOM retornado pelo widget para poder renderizar nele:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Isso permite que você use `createPortal` para renderizar o conteúdo React em `popupContainer` assim que ele estiver disponível:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Aqui está um exemplo completo com o qual você pode brincar:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
