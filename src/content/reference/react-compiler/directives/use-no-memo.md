---
title: "useMemo"
titleForTitleTag: "'use no memo' directive"
---
<Intro>

`"use no memo"` impede que uma função seja otimizada pelo React Compiler.

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

Adicione `"use no memo"` no início de uma função para impedir a otimização pelo React Compiler.

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

Quando uma função contém `"use no memo"`, o React Compiler a ignorará completamente durante a otimização. Isso é útil como uma saída temporária ao depurar ou ao lidar com código que não funciona corretamente com o compilador.

#### Ressalvas {/*caveats*/}

* `"use no memo"` deve estar no início do corpo da função, antes de quaisquer imports ou outro código (comentários são permitidos).
* A diretiva deve ser escrita com aspas duplas ou simples, não com crases.
* A diretiva deve corresponder exatamente a `"use no memo"` ou seu alias `"use no forget"`.
* Esta diretiva tem precedência sobre todos os modos de compilação e outras diretivas.
* Destina-se a ser uma ferramenta de depuração temporária, não uma solução permanente.

### Como `"use no memo"` desabilita a otimização {/*how-use-no-memo-opts-out*/}

O React Compiler analisa seu código em tempo de compilação para aplicar otimizações. `"use no memo"` cria um limite explícito que instrui o compilador a ignorar uma função inteiramente.

Esta diretiva tem precedência sobre todas as outras configurações:
* No modo `all`: A função é ignorada apesar da configuração global
* No modo `infer`: A função é ignorada mesmo que heurísticas a otimizassem

O compilador trata essas funções como se o React Compiler não estivesse habilitado, deixando-as exatamente como escritas.

### Quando usar `"use no memo"` {/*when-to-use*/}

`"use no memo"` deve ser usado com moderação e temporariamente. Cenários comuns incluem:

#### Depurando problemas do compilador {/*debugging-compiler*/}
Quando você suspeita que o compilador está causando problemas, desabilite temporariamente a otimização para isolar o problema:

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: Remover após corrigir o problema #123

  // Violações das Regras do React que não foram detectadas estaticamente
  // ...
}
```

#### Integração com bibliotecas de terceiros {/*third-party*/}
Ao integrar com bibliotecas que podem não ser compatíveis com o compilador:

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // Tem efeitos colaterais que o compilador pode otimizar incorretamente
  // ...
}
```

---

## Uso {/*usage*/}

A diretiva `"use no memo"` é colocada no início do corpo de uma função para impedir que o React Compiler otimize essa função:

```js
function MyComponent() {
  "use no memo";
  // Corpo da função
}
```

A diretiva também pode ser colocada no topo de um arquivo para afetar todas as funções nesse módulo:

```js
"use no memo";

// Todas as funções neste arquivo serão ignoradas pelo compilador
```

`"use no memo"` no nível da função substitui a diretiva no nível do módulo.

---

## Solução de problemas {/*troubleshooting*/}

### Diretiva não impede a compilação {/*not-preventing*/}

Se `"use no memo"` não estiver funcionando:

```js
// ❌ Errado - diretiva após o código
function Component() {
  const data = getData();
  "use no memo"; // Tarde demais!
}

// ✅ Correto - diretiva primeiro
function Component() {
  "use no memo";
  const data = getData();
}
```

Verifique também:
* Ortografia - deve ser exatamente `"use no memo"`
* Aspas - devem ser usadas aspas simples ou duplas, não crases

### Melhores práticas {/*best-practices*/}

**Sempre documente o motivo** pelo qual você está desabilitando a otimização:

```js
// ✅ Bom - explicação clara e rastreamento
function DataProcessor() {
  "use no memo"; // TODO: Remover após corrigir a violação da regra do React
  // ...
}

// ❌ Ruim - sem explicação
function Mystery() {
  "use no memo";
  // ...
}
```

### Veja também {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Habilita a compilação
* [React Compiler](/learn/react-compiler) - Guia de introdução