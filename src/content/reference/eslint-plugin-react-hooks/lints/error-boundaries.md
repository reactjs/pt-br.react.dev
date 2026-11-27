---
title: error-boundaries
---

<Intro>

Valida o uso de Limites de Erro em vez de try/catch para erros em componentes filhos.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Blocos try/catch não podem capturar erros que ocorrem durante o processo de renderização do React. Erros lançados em métodos de renderização ou hooks sobem pela árvore de componentes. Apenas [Limites de Erro](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) podem capturar esses erros.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Try/catch não capturará erros de renderização
function Parent() {
  try {
    return <ChildComponent />; // Se isso lançar um erro, o catch não ajudará
  } catch (error) {
    return <div>Ocorreu um erro</div>;
  }
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Usando limite de erro
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## Solução de Problemas {/*troubleshooting*/}

### Por que o linter está me dizendo para não envolver `use` em `try`/`catch`? {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

O hook `use` não lança erros no sentido tradicional, ele suspende a execução do componente. Quando `use` encontra uma promessa pendente, ele suspende o componente e permite que o React mostre um fallback. Apenas Suspense e Limites de Erro podem lidar com esses casos. O linter adverte contra `try`/`catch` em torno de `use` para evitar confusão, pois o bloco `catch` nunca seria executado.

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ Try/catch em torno do hook `use`
function Component({promise}) {
  try {
    const data = use(promise); // Não captura - `use` suspende, não lança erro
    return <div>{data}</div>;
  } catch (error) {
    return <div>Falha ao carregar</div>; // Inalcançável
  }
}

// ✅ Limite de erro captura erros de `use`
function App() {
  return (
    <ErrorBoundary fallback={<div>Falha ao carregar</div>}>
      <Suspense fallback={<div>Carregando...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```