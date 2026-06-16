---
title: unsupported-syntax
---

<Intro>

Valida contra sintaxes que o React Compiler não suporta. Se necessário, você ainda pode usar essa sintaxe fora do React, como em uma função utilitária independente.

</Intro>

## Detalhes da Regra {/*rule-details*/}

O React Compiler precisa analisar estaticamente seu código para aplicar otimizações. Recursos como `eval` e `with` tornam impossível entender estaticamente o que o código faz em tempo de compilação, portanto, o compilador não pode otimizar componentes que os utilizam.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Usando eval em um componente
function Component({ code }) {
  const result = eval(code); // Não pode ser analisado
  return <div>{result}</div>;
}

// ❌ Usando a declaração with
function Component() {
  with (Math) { // Altera o escopo dinamicamente
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Acesso dinâmico a propriedades com eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Usa acesso normal a propriedades
function Component({propName, props}) {
  const value = props[propName]; // Analisável
  return <div>{value}</div>;
}

// ✅ Usa métodos padrão do Math
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso avaliar código dinâmico {/*evaluate-dynamic-code*/}

Você pode precisar avaliar código fornecido pelo usuário:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Errado: eval em um componente
function Calculator({expression}) {
  const result = eval(expression); // Inseguro e não otimizável
  return <div>Result: {result}</div>;
}
```

Use um analisador de expressões seguro em vez disso:

```js
// ✅ Melhor: Usa um analisador seguro
import {evaluate} from 'mathjs'; // ou biblioteca similar

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Avaliação segura de expressões matemáticas
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Expressão inválida');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calcular</button>
      {result && <div>Resultado: {result}</div>}
    </div>
  );
}
```

<Note>

Nunca use `eval` com entrada do usuário - é um risco de segurança. Use bibliotecas de análise dedicadas para casos de uso específicos, como expressões matemáticas, análise de JSON ou avaliação de templates.

</Note>