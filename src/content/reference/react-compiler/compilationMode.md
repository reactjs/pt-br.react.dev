---
title: compilationMode
---

<Intro>

A opção `compilationMode` controla como o React Compiler seleciona quais funções compilar.

</Intro>

```js
{
  compilationMode: 'infer' // ou 'annotation', 'syntax', 'all'
}
```

<InlineToc />

---

## Referência {/*reference*/}

### `compilationMode` {/*compilationmode*/}

Controla a estratégia para determinar quais funções o React Compiler irá otimizar.

#### Tipo {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### Valor padrão {/*default-value*/}

`'infer'`

#### Opções {/*options*/}

- **`'infer'`** (padrão): O compilador usa heurísticas inteligentes para identificar componentes e hooks do React:
  - Funções explicitamente anotadas com a diretiva `"use memo"`
  - Funções que são nomeadas como componentes (PascalCase) ou hooks (prefixo `use`) E criam JSX e/ou chamam outros hooks

- **`'annotation'`**: Compila apenas funções explicitamente marcadas com a diretiva `"use memo"`. Ideal para adoção incremental.

- **`'syntax'`**: Compila apenas componentes e hooks que usam a sintaxe de [componente](https://flow.org/en/docs/react/component-syntax/) e [hook](https://flow.org/en/docs/react/hook-syntax/) do Flow.

- **`'all'`**: Compila todas as funções de nível superior. Não recomendado, pois pode compilar funções que não são do React.

#### Ressalvas {/*caveats*/}

- O modo `'infer'` requer que as funções sigam as convenções de nomenclatura do React para serem detectadas
- Usar o modo `'all'` pode impactar negativamente o desempenho ao compilar funções utilitárias
- O modo `'syntax'` requer Flow e não funcionará com TypeScript
- Independentemente do modo, as funções com a diretiva `"use no memo"` são sempre ignoradas

---

## Uso {/*usage*/}

### Modo de inferência padrão {/*default-inference-mode*/}

O modo padrão `'infer'` funciona bem para a maioria das bases de código que seguem as convenções do React:

```js
{
  compilationMode: 'infer'
}
```

Com este modo, estas funções serão compiladas:

```js
// ✅ Compilado: Nomeado como um componente + retorna JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Compilado: Nomeado como um hook + chama hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Compilado: Diretiva explícita
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Não compilado: Não é um padrão de componente/hook
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### Adoção incremental com modo de anotação {/*incremental-adoption*/}

Para migração gradual, use o modo `'annotation'` para compilar apenas funções marcadas:

```js
{
  compilationMode: 'annotation'
}
```

Em seguida, marque explicitamente as funções para compilar:

```js
// Apenas esta função será compilada
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Isso não será compilado sem a diretiva
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Usando o modo de sintaxe do Flow {/*flow-syntax-mode*/}

Se sua base de código usa Flow em vez de TypeScript:

```js
{
  compilationMode: 'syntax'
}
```

Em seguida, use a sintaxe de componente do Flow:

```js
// Compilado: Sintaxe de componente Flow
component Button(label: string) {
  return <button>{label}</button>;
}

// Compilado: Sintaxe de hook Flow
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Não compilado: Sintaxe de função regular
function helper(data) {
  return process(data);
}
```

### Excluindo funções específicas {/*opting-out*/}

Independentemente do modo de compilação, use `"use no memo"` para pular a compilação:

```js
function ComponentWithSideEffects() {
  "use no memo"; // Evitar compilação

  // Este componente tem efeitos colaterais que não devem ser memorizados
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## Solução de problemas {/*troubleshooting*/}

### Componente não sendo compilado no modo infer {/*component-not-compiled-infer*/}

No modo `'infer'`, certifique-se de que seu componente siga as convenções do React:

```js
// ❌ Não será compilado: nome em minúsculas
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Será compilado: nome PascalCase
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Não será compilado: não cria JSX ou chama hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Será compilado: chama um hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```