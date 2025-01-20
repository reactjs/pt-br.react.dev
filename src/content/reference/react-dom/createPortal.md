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

Para criar um portal, chame `createPortal`, passando algum JSX e o nó DOM onde ele deve ser renderizado:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Este filho é colocado na div pai.</p>
  {createPortal(
    <p>Este filho é colocado no corpo do documento.</p>,
    document.body
  )}
</div>
```

[Veja mais exemplos abaixo.](#usage)

Um portal apenas altera a colocação física do nó DOM. De todas as outras maneiras, o JSX que você renderiza em um portal atua como um nó filho do componente React que o renderiza. Por exemplo, o filho pode acessar o contexto fornecido pela árvore pai, e os eventos se propagam de filhos para pais de acordo com a árvore React.

#### Parâmetros {/*parameters*/}

* `children`: Qualquer coisa que pode ser renderizada com o React, como um pedaço de JSX (por exemplo, `<div />` ou `<SomeComponent />`), um [Fragmento](/reference/react/Fragment) (`<>...</>`), uma string ou um número, ou um array desses.

* `domNode`: Algum nó DOM, como aqueles retornados por `document.getElementById()`. O nó deve já existir. Passar um nó DOM diferente durante uma atualização fará com que o conteúdo do portal seja recriado.

* **opcional** `key`: Uma string ou número único a ser usado como a [chave](/learn/rendering-lists/#keeping-list-items-in-order-with-key) do portal.

#### Retornos {/*returns*/}

`createPortal` retorna um nó React que pode ser incluído no JSX ou retornado de um componente React. Se o React encontrá-lo na saída do render, colocará os `children` fornecidos dentro do `domNode` fornecido.

#### Ressalvas {/*caveats*/}

* Eventos de portais se propagam de acordo com a árvore React e não com a árvore DOM. Por exemplo, se você clicar dentro de um portal, e o portal estiver envolvido em `<div onClick>`, o manipulador `onClick` será disparado. Se isso causar problemas, pare a propagação do evento de dentro do portal, ou mova o portal para cima na árvore React.

---

## Uso {/*usage*/}

### Renderizando em uma parte diferente do DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portais* permitem que seus componentes renderizem alguns de seus filhos em um lugar diferente no DOM. Isso permite que uma parte do seu componente "escape" de quaisquer contêineres em que possa estar. Por exemplo, um componente pode exibir um diálogo modal ou um tooltip que aparece acima e fora do resto da página.

Para criar um portal, renderize o resultado de `createPortal` com <CodeStep step={1}>algum JSX</CodeStep> e o <CodeStep step={2}>nó DOM onde ele deve ir</CodeStep>:

```js [[1, 8, "<p>Este filho é colocado no corpo do documento.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este filho é colocado na div pai.</p>
      {createPortal(
        <p>Este filho é colocado no corpo do documento.</p>,
        document.body
      )}
    </div>
  );
}
```

O React colocará os nós DOM do <CodeStep step={1}>JSX que você passou</CodeStep> dentro do <CodeStep step={2}>nó DOM que você forneceu</CodeStep>.

Sem um portal, o segundo `<p>` seria colocado dentro da `<div>` pai, mas o portal "teletransportou" ele para o [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Este filho é colocado na div pai.</p>
      {createPortal(
        <p>Este filho é colocado no corpo do documento.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Note como o segundo parágrafo aparece visualmente fora da `<div>` pai com a borda. Se você inspecionar a estrutura do DOM com ferramentas de desenvolvedor, verá que o segundo `<p>` foi colocado diretamente no `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Este filho é colocado dentro da div pai.</p>
      </div>
    ...
  </div>
  <p>Este filho é colocado no corpo do documento.</p>
</body>
```

Um portal apenas altera a colocação física do nó DOM. De todas as outras maneiras, o JSX que você renderiza em um portal atua como um nó filho do componente React que o renderiza. Por exemplo, o filho pode acessar o contexto fornecido pela árvore pai, e os eventos ainda se propagam de filhos para pais de acordo com a árvore React.

---

### Renderizando um diálogo modal com um portal {/*rendering-a-modal-dialog-with-a-portal*/}

Você pode usar um portal para criar um diálogo modal que flutua acima do resto da página, mesmo que o componente que invoca o diálogo esteja dentro de um contêiner com `overflow: hidden` ou outros estilos que interferem com o diálogo.

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
        Mostrar modal sem um portal
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
        Mostrar modal usando um portal
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
      <div>Eu sou um diálogo modal</div>
      <button onClick={onClose}>Fechar</button>
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
  position: absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

É importante garantir que seu aplicativo seja acessível ao usar portais. Por exemplo, você pode precisar gerenciar o foco do teclado para que o usuário possa mover o foco dentro e fora do portal de uma maneira natural.

Siga as [Práticas de Autoria de Modal WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) ao criar modais. Se você usar um pacote da comunidade, garanta que ele seja acessível e siga essas diretrizes.

</Pitfall>

---

### Renderizando componentes React em marcação de servidor não-React {/*rendering-react-components-into-non-react-server-markup*/}

Os portais podem ser úteis se sua raiz React for apenas parte de uma página estática ou renderizada no servidor que não é construída com o React. Por exemplo, se sua página for construída com um framework de servidor como Rails, você pode criar áreas de interatividade dentro de áreas estáticas, como barras laterais. Comparado a ter [várias raízes React separadas](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), os portais permitem que você trate o aplicativo como uma única árvore React com estado compartilhado, mesmo que suas partes sejam renderizadas em diferentes partes do DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Meu app</title></head>
  <body>
    <h1>Bem-vindo ao meu aplicativo híbrido</h1>
    <div class="parent">
      <div class="sidebar">
        Esta é uma marcação de servidor não-React
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
  return <p>Esta parte é renderizada pelo React</p>;
}

function SidebarContent() {
  return <p>Esta parte também é renderizada pelo React!</p>;
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

### Renderizando componentes React em nós DOM não-React {/*rendering-react-components-into-non-react-dom-nodes*/}

Você também pode usar um portal para gerenciar o conteúdo de um nó DOM que é gerenciado fora do React. Por exemplo, suponha que você esteja integrando com um widget de mapa não-React e deseja renderizar conteúdo React dentro de um popup. Para fazer isso, declare uma variável de estado `popupContainer` para armazenar o nó DOM no qual você vai renderizar:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Quando você criar o widget de terceiros, armazene o nó DOM retornado pelo widget para que você possa renderizar nele:

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

Isso permite que você use `createPortal` para renderizar conteúdo React dentro de `popupContainer` uma vez que ele se torne disponível:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Olá do React!</p>,
      popupContainer
    )}
  </div>
);
```

Aqui está um exemplo completo que você pode experimentar:

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
        <p>Olá do React!</p>,
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