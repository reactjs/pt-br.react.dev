---
title: preserve-manual-memoization
---

<Intro>

Valida que a memoização manual existente é preservada pelo compilador. O React Compiler compilará componentes e hooks apenas se sua inferência [corresponder ou exceder a memoização manual existente](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo).

</Intro>

## Detalhes da Regra {/*rule-details*/}

O React Compiler preserva suas chamadas existentes de `useMemo`, `useCallback` e `React.memo`. Se você memoizou algo manualmente, o compilador assume que você teve um bom motivo e não o removerá. No entanto, dependências incompletas impedem o compilador de entender o fluxo de dados do seu código e aplicar otimizações adicionais.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Dependências ausentes em useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Dependência 'filter' ausente
  );

  return <List items={filtered} />;
}

// ❌ Dependências ausentes em useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // 'value' ausente

  return <button onClick={handleClick}>Update</button>;
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Dependências completas
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // Todas as dependências incluídas
  );

  return <List items={filtered} />;
}

// ✅ Ou deixe o compilador lidar com isso
function Component({ data, filter }) {
  // Nenhuma memoização manual necessária
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Devo remover minha memoização manual? {/*remove-manual-memoization*/}

Você pode se perguntar se o React Compiler torna a memoização manual desnecessária:

```js
// Eu ainda preciso disso?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

Você pode removê-la com segurança se estiver usando o React Compiler:

```js
// ✅ Melhor: Deixe o compilador otimizar
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```