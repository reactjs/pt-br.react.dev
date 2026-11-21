---
title: component-hook-factories
---

<Intro>

Valida contra funções de ordem superior que definem componentes ou hooks aninhados. Componentes e hooks devem ser definidos no nível do módulo.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Definir componentes ou hooks dentro de outras funções cria novas instâncias a cada chamada. O React trata cada uma como um componente completamente diferente, destruindo e recriando toda a árvore de componentes, perdendo todo o estado e causando problemas de desempenho.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ Função factory criando componentes
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Componente definido dentro de outro componente
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Função factory de hook
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Componente definido no nível do módulo
function Component({ defaultValue }) {
  // ...
}

// ✅ Hook personalizado no nível do módulo
function useData(endpoint) {
  // ...
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso de comportamento dinâmico no componente {/*dynamic-behavior*/}

Você pode achar que precisa de uma factory para criar componentes personalizados:

```js
// ❌ Errado: padrão factory
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

Em vez disso, passe [JSX como `children`](/learn/passing-props-to-a-component#passing-jsx-as-children):

```js
// ✅ Melhor: passe JSX como children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Vermelho</Button>
      <Button color="blue">Azul</Button>
    </>
  );
}
```
