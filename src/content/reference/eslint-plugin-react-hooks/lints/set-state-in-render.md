---
title: set-state-in-render
---

<Intro>

Valida contra a definição incondicional de estado durante a renderização, o que pode acionar renderizações adicionais e potenciais loops de renderização infinitos.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Chamar `setState` durante a renderização aciona incondicionalmente outra renderização antes que a atual termine. Isso cria um loop infinito que trava seu aplicativo.

## Violações Comuns {/*common-violations*/}

### Inválido {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ setState incondicional diretamente na renderização
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Loop infinito!
  return <div>{count}</div>;
}
```

### Válido {/*valid*/}

```js
// ✅ Derivar durante a renderização
function Component({items}) {
  const sorted = [...items].sort(); // Apenas calcule na renderização
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Definir estado no manipulador de eventos
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Derivar de props em vez de definir estado
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ Derivar condicionalmente estado de props e estado de renderizações anteriores
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // Esta condição a torna válida
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## Solução de Problemas {/*troubleshooting*/}

### Quero sincronizar o estado com uma prop {/*clamp-state-to-prop*/}

Um problema comum é tentar "corrigir" o estado após a renderização. Suponha que você queira impedir que um contador exceda uma prop `max`:

```js
// ❌ Errado: limita durante a renderização
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

Assim que `count` exceder `max`, um loop infinito é acionado.

Em vez disso, geralmente é melhor mover essa lógica para o evento (o local onde o estado é definido pela primeira vez). Por exemplo, você pode impor o máximo no momento em que atualiza o estado:

```js
// ✅ Limita ao atualizar
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

Agora, o setter só é executado em resposta ao clique, o React termina a renderização normalmente e `count` nunca ultrapassa `max`.

Em casos raros, você pode precisar ajustar o estado com base em informações de renderizações anteriores. Para esses casos, siga [este padrão](https://react.dev/reference/react/useState#storing-information-from-previous-renders) de definir o estado condicionalmente.