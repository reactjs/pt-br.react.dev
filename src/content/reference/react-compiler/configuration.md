---
title: Configuration
---

<Intro>

Esta página lista todas as opções de configuração disponíveis no React Compiler.

</Note>

<Note>

Para a maioria dos aplicativos, as opções padrão funcionarão imediatamente. Se você tiver uma necessidade especial, poderá usar estas opções avançadas.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // opções do compilador
      }
    ]
  ]
};
```

---

## Controle de Compilação {/*compilation-control*/}

Estas opções controlam *o quê* o compilador otimiza e *como* ele seleciona componentes e hooks para compilar.

* [`compilationMode`](/reference/react-compiler/compilationMode) controla a estratégia para selecionar funções a serem compiladas (por exemplo, todas as funções, apenas as anotadas ou detecção inteligente).

```js
{
  compilationMode: 'annotation' // Compila apenas funções "use memo"
}
```

---

## Compatibilidade de Versão {/*version-compatibility*/}

A configuração da versão do React garante que o compilador gere código compatível com sua versão do React.

[`target`](/reference/react-compiler/target) especifica qual versão do React você está usando (17, 18 ou 19).

```js
// Para projetos React 18
{
  target: '18' // Também requer o pacote react-compiler-runtime
}
```

---

## Tratamento de Erros {/*error-handling*/}

Estas opções controlam como o compilador responde a código que não segue as [Regras do React](/reference/rules).

[`panicThreshold`](/reference/react-compiler/panicThreshold) determina se deve falhar na compilação ou pular componentes problemáticos.

```js
// Recomendado para produção
{
  panicThreshold: 'none' // Pula componentes com erros em vez de falhar na compilação
}
```

---

## Depuração {/*debugging*/}

Opções de log e análise ajudam você a entender o que o compilador está fazendo.

[`logger`](/reference/react-compiler/logger) fornece logging personalizado para eventos de compilação.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compilado:', filename);
      }
    }
  }
}
```

---

## Flags de Funcionalidade {/*feature-flags*/}

A compilação condicional permite que você controle quando o código otimizado é usado.

[`gating`](/reference/react-compiler/gating) habilita flags de funcionalidade em tempo de execução para testes A/B ou implementações graduais.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## Padrões Comuns de Configuração {/*common-patterns*/}

### Configuração padrão {/*default-configuration*/}

Para a maioria das aplicações React 19, o compilador funciona sem configuração:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### Projetos React 17/18 {/*react-17-18*/}

Versões mais antigas do React precisam do pacote runtime e da configuração de target:

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // ou '17'
}
```

### Adoção Incremental {/*incremental-adoption*/}

Comece com diretórios específicos e expanda gradualmente:

```js
{
  compilationMode: 'annotation' // Compila apenas funções "use memo"
}
```