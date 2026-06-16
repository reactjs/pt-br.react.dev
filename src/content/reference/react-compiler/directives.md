---
title: Directives
---
<Intro>
Diretivas do Compilador React são literais de string especiais que controlam se funções específicas são compiladas.
</Intro>

```js
function MyComponent() {
  "use memo"; // Otimiza este componente para compilação
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## Visão Geral {/*overview*/}

Diretivas do Compilador React fornecem controle granular sobre quais funções são otimizadas pelo compilador. Elas são literais de string colocadas no início do corpo de uma função ou no topo de um módulo.

### Diretivas disponíveis {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** - Otimiza uma função para compilação
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** - Impede a otimização de uma função para compilação

### Comparação rápida {/*quick-comparison*/}

| Diretiva | Propósito | Quando usar |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | Forçar compilação | Ao usar o modo `annotation` ou para substituir heurísticas do modo `infer` |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | Prevenir compilação | Para depurar problemas ou trabalhar com código incompatível |

---

## Uso {/*usage*/}

### Diretivas em nível de função {/*function-level*/}

Coloque diretivas no início de uma função para controlar sua compilação:

```js
// Otimiza para compilação
function OptimizedComponent() {
  "use memo";
  return <div>Isso será otimizado</div>;
}

// Impede a otimização para compilação
function UnoptimizedComponent() {
  "use no memo";
  return <div>Isso não será otimizado</div>;
}
```

### Diretivas em nível de módulo {/*module-level*/}

Coloque diretivas no topo de um arquivo para afetar todas as funções nesse módulo:

```js
// No topo do arquivo
"use memo";

// Todas as funções neste arquivo serão compiladas
function Component1() {
  return <div>Compilado</div>;
}

function Component2() {
  return <div>Também compilado</div>;
}

// Pode ser substituído em nível de função
function Component3() {
  "use no memo"; // Isso substitui a diretiva do módulo
  return <div>Não compilado</div>;
}
```

### Interação com modos de compilação {/*compilation-modes*/}

As diretivas se comportam de maneira diferente dependendo do seu [`compilationMode`](/reference/react-compiler/compilationMode):

* **Modo `annotation`**: Apenas funções com `"use memo"` são compiladas
* **Modo `infer`**: O compilador decide o que compilar; as diretivas substituem as decisões
* **Modo `all`**: Tudo é compilado; `"use no memo"` pode excluir funções específicas

---

## Melhores práticas {/*best-practices*/}

### Use diretivas com moderação {/*use-sparingly*/}

Diretivas são "escape hatches" (saídas de emergência). Prefira configurar o compilador no nível do projeto:

```js
// ✅ Bom - configuração para todo o projeto
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ Use diretivas apenas quando necessário
function SpecialCase() {
  "use no memo"; // Documente por que isso é necessário
  // ...
}
```

### Documente o uso de diretivas {/*document-usage*/}

Sempre explique por que uma diretiva está sendo usada:

```js
// ✅ Bom - explicação clara
function DataGrid() {
  "use no memo"; // TODO: Remover após corrigir problema com alturas de linha dinâmicas (JIRA-123)
  // Implementação complexa de grade
}

// ❌ Ruim - sem explicação
function Mystery() {
  "use no memo";
  // ...
}
```

### Planeje a remoção {/*plan-removal*/}

Diretivas de exclusão devem ser temporárias:

1. Adicione a diretiva com um comentário TODO
2. Crie um issue de rastreamento
3. Corrija o problema subjacente
4. Remova a diretiva

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: Remover após atualizar ThirdPartyLib para v2.0
  return <ThirdPartyComponent />;
}
```

---

## Padrões comuns {/*common-patterns*/}

### Adoção gradual {/*gradual-adoption*/}

Ao adotar o Compilador React em uma base de código grande:

```js
// Comece com o modo annotation
{
  compilationMode: 'annotation'
}

// Otimize componentes estáveis
function StableComponent() {
  "use memo";
  // Componente bem testado
}

// Mais tarde, mude para o modo infer e otimize componentes problemáticos
function ProblematicComponent() {
  "use no memo"; // Corrija os problemas antes de remover
  // ...
}
```


---

## Solução de problemas {/*troubleshooting*/}

Para problemas específicos com diretivas, consulte as seções de solução de problemas em:

* [Solução de problemas de `"use memo"`](/reference/react-compiler/directives/use-memo#troubleshooting)
* [Solução de problemas de `"use no memo"`](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### Problemas comuns {/*common-issues*/}

1. **Diretiva ignorada**: Verifique a posição (deve ser a primeira) e a ortografia
2. **Compilação ainda ocorre**: Verifique a configuração `ignoreUseNoForget`
3. **Diretiva de módulo não funciona**: Certifique-se de que ela esteja antes de todas as importações

---

## Veja também {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) - Configure como o compilador escolhe o que otimizar
* [`Configuration`](/reference/react-compiler/configuration) - Opções completas de configuração do compilador
* [Documentação do Compilador React](https://react.dev/learn/react-compiler) - Guia de início rápido
