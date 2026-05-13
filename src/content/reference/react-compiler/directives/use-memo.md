---
title: "use memo"
titleForTitleTag: "Diretiva 'use memo'"
---

<Intro>

`"use memo"` marca uma função para otimização do React Compiler.

</Intro>

<Note>

Na maioria dos casos, você não precisa de `"use memo"`. Ele é usado principalmente no modo `annotation`, onde você deve marcar explicitamente as funções para otimização. No modo `infer`, o compilador detecta automaticamente componentes e hooks por seus padrões de nomenclatura (PascalCase para componentes, prefixo `use` para hooks). Se um componente ou hook não estiver sendo compilado no modo `infer`, você deve corrigir sua convenção de nomenclatura em vez de forçar a compilação com `"use memo"`.

</Note>

<InlineToc />

---

## Referência {/*reference*/}

### `"use memo"` {/*use-memo*/}

Adicione `"use memo"` no início de uma função para marcá-la para otimização do React Compiler.

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

Quando uma função contém `"use memo"`, o React Compiler irá analisá-la e otimizá-la durante o tempo de construção. O compilador irá automaticamente memorizar valores e componentes para evitar recomputações e re-renderizações desnecessárias.

#### Ressalvas {/*caveats*/}

* `"use memo"` deve estar no início do corpo de uma função, antes de quaisquer imports ou outro código (comentários são OK).
* A diretiva deve ser escrita com aspas duplas ou simples, não crases.
* A diretiva deve corresponder exatamente a `"use memo"`.
* Somente a primeira diretiva em uma função é processada; diretivas adicionais são ignoradas.
* O efeito da diretiva depende da sua configuração de [`compilationMode`](/reference/react-compiler/compilationMode).

### Como `"use memo"` marca funções para otimização {/*how-use-memo-marks*/}

Em um aplicativo React que usa o React Compiler, as funções são analisadas no tempo de construção para determinar se podem ser otimizadas. Por padrão, o compilador infere automaticamente quais componentes memorizar, mas isso pode depender da sua configuração de [`compilationMode`](/reference/react-compiler/compilationMode) se você a tiver definido.

`"use memo"` marca explicitamente uma função para otimização, substituindo o comportamento padrão:

* No modo `annotation`: Somente funções com `"use memo"` são otimizadas
* No modo `infer`: O compilador usa heurísticas, mas `"use memo"` força a otimização
* No modo `all`: Tudo é otimizado por padrão, tornando `"use memo"` redundante

A diretiva cria um limite claro em seu código base entre código otimizado e não otimizado, dando a você controle preciso sobre o processo de compilação.

### Quando usar `"use memo"` {/*when-to-use*/}

Você deve considerar o uso de `"use memo"` quando:

#### Você está usando o modo annotation {/*annotation-mode-use*/}
Em `compilationMode: 'annotation'`, a diretiva é necessária para qualquer função que você deseja otimizar:

```js
// ✅ Este componente será otimizado
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ Este componente não será otimizado
function SimpleWrapper() {
  // ...
}
```

#### Você está adotando gradualmente o React Compiler {/*gradual-adoption*/}
Comece com o modo `annotation` e otimize seletivamente componentes estáveis:

```js
// Comece otimizando componentes folha
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// Mova-se gradualmente pela árvore conforme você verifica o comportamento
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## Uso {/*usage*/}

### Trabalhando com diferentes modos de compilação {/*compilation-modes*/}

O comportamento de `"use memo"` muda com base na sua configuração do compilador:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // ou 'infer' ou 'all'
    }]
  ]
};
```

#### Modo annotation {/*annotation-mode-example*/}
```js
// ✅ Otimizado com "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Não otimizado (sem diretiva)
function ProductList({ products }) {
  // ...
}
```

#### Modo infer (padrão) {/*infer-mode-example*/}
```js
// Automaticamente memorizado porque este é nomeado como um Componente
function ComplexDashboard({ data }) {
  // ...
}

// Ignorado: Não é nomeado como um Componente
function simpleDisplay({ text }) {
  // ...
}
```

No modo `infer`, o compilador detecta automaticamente componentes e hooks por seus padrões de nomenclatura (PascalCase para componentes, prefixo `use` para hooks). Se um componente ou hook não estiver sendo compilado no modo `infer`, você deve corrigir sua convenção de nomenclatura em vez de forçar a compilação com `"use memo"`.

---

## Solução de problemas {/*troubleshooting*/}

### Verificando a otimização {/*verifying-optimization*/}

Para confirmar que seu componente está sendo otimizado:

1. Verifique a saída compilada em sua construção
2. Use o React DevTools para verificar o selo Memo ✨

### Veja também {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Desativar a compilação
* [`compilationMode`](/reference/react-compiler/compilationMode) - Configurar o comportamento da compilação
* [React Compiler](/learn/react-compiler) - Guia de primeiros passos