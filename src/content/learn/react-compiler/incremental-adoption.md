---
title: Adoção Incremental
---

<Intro>
O React Compiler pode ser adotado incrementalmente, permitindo que você o teste em partes específicas do seu código primeiro. Este guia mostra como implementar gradualmente o compilador em projetos existentes.
</Intro>

<YouWillLearn>

* Por que a adoção incremental é recomendada
* Usando overrides do Babel para adoção baseada em diretório
* Usando a diretiva "use memo" para compilação opt-in
* Usando a diretiva "use no memo" para excluir componentes
* Flags de recurso em tempo de execução com gating
* Monitorando seu progresso de adoção

</YouWillLearn>

## Por que Adoção Incremental? {/*why-incremental-adoption*/}

O React Compiler é projetado para otimizar automaticamente todo o seu código, mas você não precisa adotá-lo de uma vez. A adoção incremental dá a você controle sobre o processo de implementação, permitindo que você teste o compilador em pequenas partes do seu app antes de expandir para o resto.

Começar pequeno ajuda você a construir confiança nas otimizações do compilador. Você pode verificar que seu app se comporta corretamente com código compilado, medir melhorias de performance e identificar casos extremos específicos do seu código. Esta abordagem é especialmente valiosa para aplicações em produção onde a estabilidade é crítica.

A adoção incremental também facilita a correção de violações das Regras do React que o compilador pode encontrar. Em vez de corrigir violações em todo o seu código de uma vez, você pode abordá-las sistematicamente conforme expande a cobertura do compilador. Isso mantém a migração gerenciável e reduz o risco de introduzir bugs.

Ao controlar quais partes do seu código são compiladas, você também pode executar testes A/B para medir o impacto real das otimizações do compilador. Esses dados ajudam você a tomar decisões informadas sobre a adoção completa e demonstram o valor para sua equipe.

## Abordagens para Adoção Incremental {/*approaches-to-incremental-adoption*/}

Existem três abordagens principais para adotar o React Compiler incrementalmente:

1. **Overrides do Babel** - Aplicar o compilador a diretórios específicos
2. **Opt-in com "use memo"** - Apenas compilar componentes que explicitamente optam por participar
3. **Gating em tempo de execução** - Controlar compilação com flags de recurso

Todas as abordagens permitem que você teste o compilador em partes específicas da sua aplicação antes da implementação completa.

## Adoção Baseada em Diretório com Overrides do Babel {/*directory-based-adoption*/}

A opção `overrides` do Babel permite que você aplique plugins diferentes a diferentes partes do seu código. Isso é ideal para adotar gradualmente o React Compiler diretório por diretório.

### Configuração Básica {/*basic-configuration*/}

Comece aplicando o compilador a um diretório específico:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Plugins globais que se aplicam a todos os arquivos
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### Expandindo a Cobertura {/*expanding-coverage*/}

Conforme você ganha confiança, adicione mais diretórios:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Plugins globais
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Plugins diferentes para código legado
      ]
    }
  ]
};
```

### Com Opções do Compilador {/*with-compiler-options*/}

Você também pode configurar opções do compilador por override:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // opções ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // opções ...
        }]
      ]
    }
  ]
};
```


## Modo Opt-in com "use memo" {/*opt-in-mode-with-use-memo*/}

Para controle máximo, você pode usar `compilationMode: 'annotation'` para apenas compilar componentes e hooks que explicitamente optam por participar com a diretiva `"use memo"`.

<Note>
Esta abordagem dá a você controle refinado sobre componentes e hooks individuais. É útil quando você quer testar o compilador em componentes específicos sem afetar diretórios inteiros.
</Note>

### Configuração do Modo Annotation {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### Usando a Diretiva {/*using-the-directive*/}

Adicione `"use memo"` no início das funções que você quer compilar:

```js
function TodoList({ todos }) {
  "use memo"; // Opta este componente para compilação

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Opta este hook para compilação

  return data.slice().sort();
}
```

Com `compilationMode: 'annotation'`, você deve:
- Adicionar `"use memo"` a cada componente que você quer otimizado
- Adicionar `"use memo"` a cada hook customizado
- Lembrar de adicioná-lo a novos componentes

Isso dá a você controle preciso sobre quais componentes são compilados enquanto você avalia o impacto do compilador.

## Flags de Recurso em Tempo de Execução com Gating {/*runtime-feature-flags-with-gating*/}

A opção `gating` permite que você controle a compilação em tempo de execução usando flags de recurso. Isso é útil para executar testes A/B ou implementar gradualmente o compilador baseado em segmentos de usuário.

### Como o Gating Funciona {/*how-gating-works*/}

O compilador envolve código otimizado em uma verificação em tempo de execução. Se o gate retorna `true`, a versão otimizada executa. Caso contrário, o código original executa.

### Configuração do Gating {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### Implementando a Flag de Recurso {/*implementing-the-feature-flag*/}

Crie um módulo que exporta sua função de gating:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use seu sistema de flag de recurso
  return getFeatureFlag('react-compiler-enabled');
}
```

## Solução de Problemas na Adoção {/*troubleshooting-adoption*/}

Se você encontrar problemas durante a adoção:

1. Use `"use no memo"` para temporariamente excluir componentes problemáticos
2. Verifique o [guia de depuração](/learn/react-compiler/debugging) para problemas comuns
3. Corrija violações das Regras do React identificadas pelo plugin ESLint
4. Considere usar `compilationMode: 'annotation'` para adoção mais gradual

## Próximos Passos {/*next-steps*/}

- Leia o [guia de configuração](/reference/react-compiler/configuration) para mais opções
- Aprenda sobre [técnicas de depuração](/learn/react-compiler/debugging)
- Verifique a [referência da API](/reference/react-compiler/configuration) para todas as opções do compilador
