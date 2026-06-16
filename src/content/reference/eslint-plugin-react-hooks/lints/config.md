---
title: config
---

<Intro>

Valida as [opções de configuração](/reference/react-compiler/configuration) do compilador.

</Intro>

## Detalhes da Regra {/*rule-details*/}

O React Compiler aceita várias [opções de configuração](/reference/react-compiler/configuration) para controlar seu comportamento. Esta regra valida que sua configuração usa nomes de opções e tipos de valor corretos, prevenindo falhas silenciosas por erros de digitação ou configurações incorretas.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Nome de opção desconhecido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Erro de digitação: deveria ser compilationMode
    }]
  ]
};

// ❌ Valor de opção inválido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Inválido: use 'all' ou 'infer'
    }]
  ]
};
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Configuração de compilador válida
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Solução de Problemas {/*troubleshooting*/}

### Configuração não funciona como esperado {/*config-not-working*/}

Sua configuração do compilador pode ter erros de digitação ou valores incorretos:

```js
// ❌ Errado: Erros comuns de configuração
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Erro de digitação no nome da opção
      compilationMod: 'all',
      // Tipo de valor incorreto
      panicThreshold: true,
      // Opção desconhecida
      optimizationLevel: 'max'
    }]
  ]
};
```

Verifique a [documentação de configuração](/reference/react-compiler/configuration) para opções válidas:

```js
// ✅ Melhor: Configuração válida
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // ou 'infer'
      panicThreshold: 'none', // ou 'critical_errors', 'all_errors'
      // Use apenas opções documentadas
    }]
  ]
};
```