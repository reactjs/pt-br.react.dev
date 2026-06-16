---
title: immutability
---

<Intro>

Valida contra a mutação de props, estado e outros valores que [são imutáveis](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable).

</Intro>

## Detalhes da Regra {/*rule-details*/}

As props e o estado de um componente são instantâneos imutáveis. Nunca os modifique diretamente. Em vez disso, passe novas props adiante e use a função de atualização do `useState`.

## Violações Comuns {/*common-violations*/}

### Inválido {/*invalid*/}

```js
// ❌ Mutação de push em array
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Mutando!
    setItems(items); // Mesma referência, sem re-renderização
  };
}

// ❌ Atribuição de propriedade de objeto
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Mutando!
    setUser(user); // Mesma referência
  };
}

// ❌ Ordenação sem espalhamento (spread)
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort muta!
  };
}
```

### Válido {/*valid*/}

```js
// ✅ Cria novo array
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // Novo array
  };
}

// ✅ Cria novo objeto
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // Novo objeto
  };
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso adicionar itens a um array {/*add-items-array*/}

Mutar arrays com métodos como `push()` não aciona re-renderizações:

```js
// ❌ Errado: Mutando o array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // Mesma referência de array!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

Crie um novo array em vez disso:

```js
// ✅ Melhor: Cria um novo array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Ou: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### Preciso atualizar objetos aninhados {/*update-nested-objects*/}

Mutar propriedades aninhadas não aciona re-renderizações:

```js
// ❌ Errado: Mutando objeto aninhado
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Mutação!
    setUser(user); // Mesma referência de objeto
  };
}
```

Use o espalhamento (spread) em cada nível que precisa ser atualizado:

```js
// ✅ Melhor: Cria novos objetos em cada nível
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```