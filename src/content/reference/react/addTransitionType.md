---
title: addTransitionType
version: canary
---

<Canary>

**A API `addTransitionType` está atualmente disponível apenas nos canais Canary e Experimental do React.**

[Saiba mais sobre os canais de lançamento do React aqui.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

`addTransitionType` permite que você especifique a causa de uma transição.


```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Parâmetros {/*parameters*/}

- `type`: O tipo de transição a ser adicionado. Pode ser qualquer string.

#### Retorna {/*returns*/}

`addTransitionType` não retorna nada.

#### Ressalvas {/*caveats*/}

- Se múltiplas transições forem combinadas, todos os Tipos de Transição são coletados. Você também pode adicionar mais de um tipo a uma Transição.
- Os Tipos de Transição são redefinidos após cada commit. Isso significa que um fallback de `<Suspense>` associará os tipos após um `startTransition`, mas a revelação do conteúdo não.

---

## Uso {/*usage*/}

### Adicionando a causa de uma transição {/*adding-the-cause-of-a-transition*/}

Chame `addTransitionType` dentro de `startTransition` para indicar a causa de uma transição:

```js [[1, 6, "addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]]
import { startTransition, addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

Quando você chama <CodeStep step={1}>addTransitionType</CodeStep> dentro do escopo de <CodeStep step={2}>startTransition</CodeStep>, o React associará <CodeStep step={3}>submit-click</CodeStep> como uma das causas para a Transição.

Atualmente, os Tipos de Transição podem ser usados para personalizar diferentes animações com base no que causou a Transição. Você tem três maneiras diferentes de escolher como usá-los:

- [Personalizar animações usando tipos de transição de visualização do navegador](#customize-animations-using-browser-view-transition-types)
- [Personalizar animações usando a Classe `View Transition`](#customize-animations-using-view-transition-class)
- [Personalizar animações usando eventos `ViewTransition`](#customize-animations-using-viewtransition-events)

No futuro, planejamos dar suporte a mais casos de uso para a causa de uma transição.

---
### Personalizar animações usando tipos de transição de visualização do navegador {/*customize-animations-using-browser-view-transition-types*/}

Quando uma [`ViewTransition`](/reference/react/ViewTransition) é ativada a partir de uma transição, o React adiciona todos os Tipos de Transição como [tipos de transição de visualização](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) do navegador ao elemento.

Isso permite que você personalize diferentes animações com base em escopos CSS:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### Personalizar animações usando a Classe `View Transition` {/*customize-animations-using-view-transition-class*/}

Você pode personalizar animações para uma `ViewTransition` ativada com base no tipo, passando um objeto para a Classe View Transition:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

Se múltiplos tipos corresponderem, eles serão unidos. Se nenhum tipo corresponder, a entrada especial "default" será usada em vez disso. Se algum tipo tiver o valor "none", ele prevalecerá e a ViewTransition será desabilitada (não terá um nome atribuído).

Estes podem ser combinados com as props enter/exit/update/layout/share para corresponder com base no tipo de gatilho e Tipo de Transição.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### Personalizar animações usando eventos `ViewTransition` {/*customize-animations-using-viewtransition-events*/}

Você pode personalizar imperativamente animações para uma `ViewTransition` ativada com base no tipo usando eventos View Transition:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

Isso permite que você escolha diferentes Animações imperativas com base na causa.