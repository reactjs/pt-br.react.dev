---
title: gating
---

<Intro>

A opção `gating` habilita a compilação condicional, permitindo que você controle quando o código otimizado é usado em tempo de execução.

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## Referência {/*reference*/}

### `gating` {/*gating*/}

Configura o gating de flag de recurso em tempo de execução para funções compiladas.

#### Tipo {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### Valor padrão {/*default-value*/}

`null`

#### Propriedades {/*properties*/}

- **`source`**: Caminho do módulo para importar a flag de recurso
- **`importSpecifierName`**: Nome da função exportada para importar

#### Ressalvas {/*caveats*/}

- A função de gating deve retornar um booleano
- Ambas as versões compiladas e originais aumentam o tamanho do bundle
- A importação é adicionada a cada arquivo com funções compiladas

---

## Uso {/*usage*/}

### Configuração básica de flag de recurso {/*basic-setup*/}

1. Crie um módulo de flag de recurso:

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // sua lógica aqui
  return getFeatureFlag('react-compiler-enabled');
}
```

2. Configure o compilador:

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3. O compilador gera código com gating:

```js
// Entrada
function Button(props) {
  return <button>{props.label}</button>;
}

// Saída (simplificada)
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* versão compilada */ }
  : function Button_original(props) { /* versão original */ };
```

Observe que a função de gating é avaliada uma vez no tempo do módulo, então, uma vez que o bundle JS foi analisado e avaliado, a escolha do componente permanece estática para o restante da sessão do navegador.

---

## Solução de problemas {/*troubleshooting*/}

### Flag de recurso não funcionando {/*flag-not-working*/}

Verifique se o seu módulo de flag exporta a função correta:

```js
// ❌ Errado: Exportação padrão
export default function shouldUseCompiler() {
  return true;
}

// ✅ Correto: Exportação nomeada correspondente a importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### Erros de importação {/*import-errors*/}

Certifique-se de que o caminho da fonte está correto:

```js
// ❌ Errado: Relativo a babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ Correto: Caminho de resolução do módulo
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ Também correto: Caminho absoluto da raiz do projeto
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```