---
id: create-fragment
title: Fragmentos Chaveados
permalink: docs/create-fragment.html
layout: docs
category: Add-Ons
---

> Nota:
>
> O ponto de entrada `React.addons` está obsoleto a partir do React v15.5. Agora temos suporte de primeira classe para fragmentos sobre os quais você pode ler [aqui](/docs/fragments.html).

## Importando {#importing}

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 com npm
```

## Visão geral {#overview}

Na maioria dos casos, você pode usar a prop `key` para especificar chaves nos elementos que você está retornando de `render`. No entanto, isso se divide em uma situação: se você tiver dois conjuntos de childrens que precisa reordenar, não há como colocar uma chave em cada conjunto sem adicionar um elemento wrapper.

Ou seja, se você tiver um componente como:

```js
function Swapper(props) {
  let children;
  if (props.swapped) {
    children = [props.rightChildren, props.leftChildren];
  } else {
    children = [props.leftChildren, props.rightChildren];
  }
  return <div>{children}</div>;
}
```

Os childrens serão desmontados e remontados conforme você altera a prop `swapped` porque não há nenhuma chave marcada nos dois conjuntos de childrens.

Para resolver esse problema, você pode usar o add-on `createFragment` para fornecer chaves aos conjuntos de children.

#### `Array<ReactNode> createFragment(object children)` {#arrayreactnode-createfragmentobject-children}

Em vez de criar arrays, escrevemos:

```javascript
import createFragment from 'react-addons-create-fragment';

function Swapper(props) {
  let children;
  if (props.swapped) {
    children = createFragment({
      right: props.rightChildren,
      left: props.leftChildren
    });
  } else {
    children = createFragment({
      left: props.leftChildren,
      right: props.rightChildren
    });
  }
  return <div>{children}</div>;
}
```

As chaves do objeto passado (ou seja, `left` e `right`) são usadas como chaves para todo o conjunto de childrens, e a ordem das chaves do objeto é usada para determinar a ordem dos childrens renderizados. Com essa alteração, os dois conjuntos de childrens serão reordenados corretamente no DOM sem desmontar.

O valor de retorno de `createFragment` deve ser tratado como um objeto opaco; você pode usar os auxiliares [`React.Children`](/docs/react-api.html#react.children) para percorrer um fragmento, mas não deve acessá-lo diretamente. Observe também que estamos contando com o mecanismo JavaScript preservando a ordem de enumeração de objetos aqui, que não é garantida pela especificação, mas é implementada por todos os principais navegadores e VMs para objetos com chaves não numéricas.
