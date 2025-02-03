---
title: Avisos de Depreciação do react-dom/test-utils
---

<<<<<<< HEAD
## Aviso do ReactDOMTestUtils.act() {/*reactdomtestutilsact-warning*/}
=======
TODO: update for 19?

## ReactDOMTestUtils.act() warning {/*reactdomtestutilsact-warning*/}
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

O `act` de `react-dom/test-utils` foi depreciado em favor do `act` do `react`.

Antes:

```js
import {act} from 'react-dom/test-utils';
```

Depois:

```js
import {act} from 'react';
```

## Resto das APIs do ReactDOMTestUtils {/*rest-of-reactdomtestutils-apis*/}

Todas as APIs, exceto `act`, foram removidas.

A equipe do React recomenda migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) para uma experiência de teste moderna e bem suportada.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

O `renderIntoDocument` pode ser substituído por `render` de `@testing-library/react`.

Antes:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

Depois:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` pode ser substituído por `fireEvent` de `@testing-library/react`.

Antes:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

Depois:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Esteja ciente de que `fireEvent` dispara um evento real no elemento e não apenas chama sinteticamente o manipulador de eventos.

### Lista de todas as APIs removidas {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
