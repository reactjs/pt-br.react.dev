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

Configura o controle de feature flag em tempo de execução para funções compiladas.

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

- **`source`**: Caminho do módulo para importar o feature flag.
- **`importSpecifierName`**: Nome da função exportada a ser importada.

#### Ressalvas {/*caveats*/}

- A função de gating deve retornar um booleano.
- Tanto a versão compilada quanto a original aumentam o tamanho do bundle.
- A importação é adicionada a todos os arquivos com funções compiladas.

---

## Uso {/*usage*/}

### Configuração básica de feature flag {/*basic-setup*/}

1. Crie um módulo de feature flag:

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

3. O compilador gera código controlado:

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

Note que a função de gating é avaliada uma vez no momento da carga do módulo. Assim, uma vez que o bundle JS tenha sido analisado e avaliado, a escolha do componente permanece estática pelo resto da sessão do navegador.

---

## Solução de problemas {/*troubleshooting*/}

### Feature flag não funcionando {/*flag-not-working*/}

Verifique se o seu módulo de flag exporta a função correta:

```js
// ❌ Errado: Exportação padrão
export default function shouldUseCompiler() {
  return true;
}

// ✅ Correto: Exportação nomeada correspondendo a importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### Erros de importação {/*import-errors*/}

Certifique-se de que o caminho da origem está correto:

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

// ✅ Também correto: Caminho absoluto a partir da raiz do projeto
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```