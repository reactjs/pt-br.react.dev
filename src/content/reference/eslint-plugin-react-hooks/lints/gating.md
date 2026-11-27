---
title: gating
---

<Intro>

Valida a configuração do [modo de gating](/reference/react-compiler/gating).

</Intro>

## Detalhes da Regra {/*rule-details*/}

O modo de gating permite adotar o React Compiler gradualmente, marcando componentes específicos para otimização. Esta regra garante que sua configuração de gating seja válida para que o compilador saiba quais componentes processar.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Campos obrigatórios ausentes
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Campo 'source' ausente
      }
    }]
  ]
};

// ❌ Tipo de gating inválido
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Deveria ser um objeto
    }]
  ]
};
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Configuração de gating completa
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // nome da função exportada
        source: 'featureFlags' // nome do módulo
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ Sem gating (compila tudo)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Sem o campo gating - compila todos os componentes
    }]
  ]
};
```
