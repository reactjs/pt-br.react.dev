---
title: purity
---

<Intro>

Valida que [componentes/hooks são puros](/reference/rules/components-and-hooks-must-be-pure) verificando se eles não chamam funções conhecidas como impuras.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Componentes React devem ser funções puras - dadas as mesmas props, eles devem sempre retornar o mesmo JSX. Quando componentes usam funções como `Math.random()` ou `Date.now()` durante a renderização, eles produzem saídas diferentes a cada vez, quebrando as suposições do React e causando erros como incompatibilidades de hidratação, memoização incorreta e comportamento imprevisível.

## Violações Comuns {/*common-violations*/}

Em geral, qualquer API que retorna um valor diferente para as mesmas entradas viola esta regra. Exemplos comuns incluem:

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Math.random() na renderização
function Component() {
  const id = Math.random(); // Diferente a cada renderização
  return <div key={id}>Content</div>;
}

// ❌ Date.now() para valores
function Component() {
  const timestamp = Date.now(); // Muda a cada renderização
  return <div>Criado em: {timestamp}</div>;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ IDs estáveis a partir do estado inicial
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso mostrar a hora atual {/*current-time*/}

Chamar `Date.now()` durante a renderização torna seu componente impuro:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Incorreto: A hora muda a cada renderização
function Clock() {
  return <div>Hora atual: {Date.now()}</div>;
}
```

Em vez disso, [mova a função impura para fora da renderização](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent):

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Hora atual: {time}</div>;
}
```