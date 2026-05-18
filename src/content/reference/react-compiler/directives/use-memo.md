---
title: "useMemo"
titleForTitleTag: "'use memo' directive"
---
<Intro>

`"use memo"` marca uma função para otimização pelo React Compiler.

</Intro>

<Note>

Na maioria dos casos, você não precisa de `"use memo"`. Ele é primariamente necessário no modo `annotation`, onde você deve marcar explicitamente as funções para otimização. No modo `infer`, o compilador detecta automaticamente componentes e hooks por seus padrões de nomenclatura (PascalCase para componentes, prefixo `use` para hooks). Se um componente ou hook não estiver sendo compilado no modo `infer`, você deve corrigir sua convenção de nomenclatura em vez de forçar a compilação com `"use memo"`.

</Note>

<InlineToc />

---

## Referência {/*reference*/}

### `"use memo"` {/*use-memo*/}

Adicione `"use memo"` no início de uma função para marcá-la para otimização pelo React Compiler.

```js {1}
function MeuComponente() {
  "use memo";
  // ...
}
```

Quando uma função contém `"use memo"`, o React Compiler a analisará e otimizará durante o tempo de compilação. O compilador automaticamente memorizará valores e componentes para prevenir recálculos e re-renderizações desnecessárias.

#### Ressalvas {/*caveats*/}

* `"use memo"` deve estar no início do corpo da função, antes de quaisquer imports ou outro código (comentários são permitidos).
* A diretiva deve ser escrita com aspas duplas ou simples, não com crases.
* A diretiva deve corresponder exatamente a `"use memo"`.
* Apenas a primeira diretiva em uma função é processada; diretivas adicionais são ignoradas.
* O efeito da diretiva depende da sua configuração de [`compilationMode`](/reference/react-compiler/compilationMode).

### Como `"use memo"` marca funções para otimização {/*how-use-memo-marks*/}

Em um aplicativo React que usa o React Compiler, as funções são analisadas no tempo de compilação para determinar se podem ser otimizadas. Por padrão, o compilador infere automaticamente quais componentes memorizar, mas isso pode depender da sua configuração de [`compilationMode`](/reference/react-compiler/compilationMode), se você a definiu.

`"use memo"` marca explicitamente uma função para otimização, substituindo o comportamento padrão:

* No modo `annotation`: Apenas funções com `"use memo"` são otimizadas.
* No modo `infer`: O compilador usa heurísticas, mas `"use memo"` força a otimização.
* No modo `all`: Tudo é otimizado por padrão, tornando `"use memo"` redundante.

A diretiva cria um limite claro em sua base de código entre código otimizado e não otimizado, dando a você controle granular sobre o processo de compilação.

### Quando usar `"use memo"` {/*when-to-use*/}

Você deve considerar usar `"use memo"` quando:

#### Você está usando o modo de anotação {/*annotation-mode-use*/}
Em `compilationMode: 'annotation'`, a diretiva é necessária para qualquer função que você queira otimizar:

```js
// ✅ Este componente será otimizado
function ListaOtimizada() {
  "use memo";
  // ...
}

// ❌ Este componente não será otimizado
function WrapperSimples() {
  // ...
}
```

#### Você está adotando gradualmente o React Compiler {/*gradual-adoption*/}
Comece com o modo `annotation` e otimize seletivamente componentes estáveis:

```js
// Comece otimizando componentes folha
function Botao({ onClick, children }) {
  "use memo";
  // ...
}

// Gradualmente suba na árvore conforme verifica o comportamento
function GrupoDeBotoes({ botoes }) {
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

#### Modo de anotação {/*annotation-mode-example*/}
```js
// ✅ Otimizado com "use memo"
function CartaoProduto({ produto }) {
  "use memo";
  // ...
}

// ❌ Não otimizado (sem diretiva)
function ListaProdutos({ produtos }) {
  // ...
}
```

#### Modo Infer (padrão) {/*infer-mode-example*/}
```js
// Automaticamente memorizado porque este é nomeado como um Componente
function DashboardComplexo({ data }) {
  // ...
}

// Ignorado: Não é nomeado como um Componente
function exibicaoSimples({ texto }) {
  // ...
}
```

No modo `infer`, o compilador detecta automaticamente componentes e hooks por seus padrões de nomenclatura (PascalCase para componentes, prefixo `use` para hooks). Se um componente ou hook não estiver sendo compilado no modo `infer`, você deve corrigir sua convenção de nomenclatura em vez de forçar a compilação com `"use memo"`.

---

## Solução de problemas {/*troubleshooting*/}

### Verificando a otimização {/*verifying-optimization*/}

Para confirmar que seu componente está sendo otimizado:

1. Verifique a saída compilada em seu build.
2. Use o React DevTools para verificar o selo Memo ✨.

### Ver também {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Desativar compilação
* [`compilationMode`](/reference/react-compiler/compilationMode) - Configurar comportamento de compilação
* [React Compiler](/learn/react-compiler) - Guia de início rápido