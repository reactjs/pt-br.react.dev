---
title: globals
---

<Intro>

Valida contra a atribuição/mutação de globais durante a renderização, parte de garantir que [efeitos colaterais devem ser executados fora da renderização](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render).

</Intro>

## Detalhes da Regra {/*rule-details*/}

Variáveis globais existem fora do controle do React. Quando você as modifica durante a renderização, você quebra a suposição do React de que a renderização é pura. Isso pode fazer com que os componentes se comportem de maneira diferente em desenvolvimento vs produção, quebrar o Fast Refresh e tornar seu aplicativo impossível de otimizar com recursos como o React Compiler.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Contador global
let renderCount = 0;
function Component() {
  renderCount++; // Mutando global
  return <div>Contagem: {renderCount}</div>;
}

// ❌ Modificando propriedades do window
function Component({userId}) {
  window.currentUser = userId; // Mutação global
  return <div>Usuário: {userId}</div>;
}

// ❌ Push em array global
const events = [];
function Component({event}) {
  events.push(event); // Mutando array global
  return <div>Eventos: {events.length}</div>;
}

// ❌ Manipulação de cache
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Modificando cache durante a renderização
  }
  return <div>{cache[id]}</div>;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Use state para contadores
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicado: {clickCount} vezes
    </button>
  );
}

// ✅ Use context para valores globais
function Component() {
  const user = useContext(UserContext);
  return <div>Usuário: {user.id}</div>;
}

// ✅ Sincronize estado externo com React
function Component({title}) {
  useEffect(() => {
    document.title = title; // OK no efeito
  }, [title]);

  return <div>Página: {title}</div>;
}
```