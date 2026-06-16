---
title: refs
---

<Intro>

Valida o uso correto de refs, não lendo/escrevendo durante a renderização. Veja a seção "armadilhas" em [`useRef()` usage](/reference/react/useRef#usage).

</Intro>

## Detalhes da Regra {/*rule-details*/}

Refs armazenam valores que não são usados para renderização. Diferente do state, a alteração de uma ref não dispara uma re-renderização. Ler ou escrever `ref.current` durante a renderização quebra as expectativas do React. Refs podem não estar inicializadas quando você tenta lê-las, e seus valores podem estar desatualizados ou inconsistentes.

## Como Detecta Refs {/*how-it-detects-refs*/}

A lint aplica estas regras apenas a valores que ela sabe serem refs. Um valor é inferido como ref quando o compilador vê qualquer um dos seguintes padrões:

- Retornado de `useRef()` ou `React.createRef()`.

  ```js
  const scrollRef = useRef(null);
  ```

- Um identificador chamado `ref` ou que termina com `Ref` que lê ou escreve em `.current`.

  ```js
  buttonRef.current = node;
  ```

- Passado através de uma prop JSX `ref` (por exemplo, `<div ref={someRef} />`).

  ```jsx
  <input ref={inputRef} />
  ```

Uma vez que algo é marcado como ref, essa inferência segue o valor através de atribuições, desestruturação ou chamadas de helper. Isso permite que a lint aponte violações mesmo quando `ref.current` é acessado dentro de outra função que recebeu a ref como argumento.

## Violações Comuns {/*common-violations*/}

- Lendo `ref.current` durante a renderização
- Atualizando `refs` durante a renderização
- Usando `refs` para valores que deveriam ser state

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Lendo ref durante a renderização
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Não leia durante a renderização
  return <div>{value}</div>;
}

// ❌ Modificando ref durante a renderização
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Não modifique durante a renderização
  return <div />;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Leia ref em effects/handlers
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK no effect
    }
  });

  return <div ref={ref} />;
}

// ✅ Use state para valores de UI
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Inicialização preguiçosa do valor da ref
function Component() {
  const ref = useRef(null);

  // Inicializa apenas uma vez no primeiro uso
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - inicialização preguiçosa
  }

  const handleClick = () => {
    console.log(ref.current); // Usa o valor inicializado
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## Solução de Problemas {/*troubleshooting*/}

### A lint sinalizou meu objeto simples com `.current` {/*plain-object-current*/}

A heurística de nome intencionalmente trata `ref.current` e `fooRef.current` como refs reais. Se você está modelando um objeto contêiner personalizado, escolha um nome diferente (por exemplo, `box`) ou mova o valor mutável para o state. Renomear evita a lint porque o compilador para de inferi-lo como uma ref.