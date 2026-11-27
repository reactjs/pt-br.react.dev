---
title: static-components
---

<Intro>

Valida que os componentes são estáticos, não recriados a cada renderização. Componentes que são recriados dinamicamente podem redefinir o estado e acionar renderizações excessivas.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Componentes definidos dentro de outros componentes são recriados a cada renderização. O React os vê como um tipo de componente totalmente novo, desinstalando o antigo e instalando o novo, destruindo todo o estado e nós do DOM no processo.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Componente definido dentro de outro componente
function Parent() {
  const ChildComponent = () => { // Novo componente a cada renderização!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // Estado é redefinido a cada renderização
}

// ❌ Criação dinâmica de componente
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Componentes no nível do módulo
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // Referencia componente existente
    : TextComponent;

  return <Component />;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso renderizar componentes diferentes condicionalmente {/*conditional-components*/}

Você pode definir componentes dentro de outros para acessar o estado local:

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ Errado: Componente interno para acessar o estado do pai
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // Recriado a cada renderização!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

Passe os dados como props em vez disso:

```js
// ✅ Melhor: Passe props para componente estático
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

Se você se encontrar querendo definir componentes dentro de outros componentes para acessar variáveis locais, isso é um sinal de que você deveria estar passando props em vez disso. Isso torna os componentes mais reutilizáveis e testáveis.

</Note>