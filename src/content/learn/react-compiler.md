---
title: Compilador React
---

<Intro>
Esta página fornecerá uma introdução ao novo Compilador React experimental e como testá-lo com sucesso.
</Intro>

<Wip>
Esses documentos ainda estão em andamento. Mais documentação está disponível no repositório do [Grupo de Trabalho do Compilador React](https://github.com/reactwg/react-compiler/discussions) e será incorporada a esses documentos quando estiver mais estável.
</Wip>

<YouWillLearn>

* Começando com o compilador
* Instalando o compilador e o plugin eslint
* Solução de problemas

</YouWillLearn>

<Note>
O Compilador React é um novo compilador experimental que tornamos de código aberto para obter feedback inicial da comunidade. Ele ainda possui arestas ásperas e ainda não está completamente pronto para produção.

O Compilador React requer o React 19 Beta.
</Note>

O Compilador React é um novo compilador experimental que tornamos de código aberto para obter feedback inicial da comunidade. É uma ferramenta de tempo de construção que otimiza automaticamente seu aplicativo React. Funciona com JavaScript puro e entende as [Regras do React](/reference/rules), para que você não precise reescrever nenhum código para usá-lo.

O compilador também inclui um [plugin eslint](#installing-eslint-plugin-react-compiler) que traz a análise do compilador diretamente no seu editor. O plugin funciona independentemente do compilador e pode ser usado mesmo se você não estiver usando o compilador em seu aplicativo. Recomendamos que todos os desenvolvedores React utilizem este plugin eslint para ajudar a melhorar a qualidade do seu código.

### O que o compilador faz? {/*what-does-the-compiler-do*/}

O compilador entende seu código em um nível profundo através de sua compreensão da semântica do JavaScript puro e das [Regras do React](/reference/rules). Isso permite que ele adicione otimizações automáticas ao seu código.

Você pode estar familiarizado hoje com a memoização manual através de [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`React.memo`](/reference/react/memo). O compilador pode automaticamente fazer isso por você, se seu código seguir as [Regras do React](/reference/rules). Se detectar que as regras foram quebradas, ele automaticamente pulará apenas aqueles componentes ou hooks, e continuará compilando com segurança outros códigos.

Se sua base de código já estiver muito bem memoizada, você pode não esperar ver grandes melhorias de desempenho com o compilador. No entanto, na prática, memoizar as dependências corretas que causam problemas de desempenho é complicado de fazer manualmente.

### Devo experimentar o compilador? {/*should-i-try-out-the-compiler*/}

Observe que o compilador ainda é experimental e tem muitas arestas ásperas. Embora tenha sido usado em produção em empresas como a Meta, a implementação do compilador na produção do seu aplicativo dependerá da saúde da sua base de código e de quão bem você seguiu as [Regras do React](/reference/rules).

**Você não precisa se apressar para usar o compilador agora. Está tudo bem esperar até que ele alcance um lançamento estável antes de adotá-lo.** No entanto, apreciamos a experimentação em pequenos testes em seus aplicativos para que você possa [fornecer feedback](#reporting-issues) para nós ajudar a melhorar o compilador.

## Começando {/*getting-started*/}

Além destes documentos, recomendamos verificar o [Grupo de Trabalho do Compilador React](https://github.com/reactwg/react-compiler) para obter informações adicionais e discussões sobre o compilador.

### Implementando o compilador em sua base de código {/*using-the-compiler-effectively*/}

#### Projetos existentes {/*existing-projects*/}
O compilador é projetado para compilar componentes funcionais e hooks que seguem as [Regras do React](/reference/rules). Ele também pode lidar com códigos que quebram essas regras, pulando (bail-out) aqueles componentes ou hooks. No entanto, devido à natureza flexível do JavaScript, o compilador não pode pegar todas as possíveis violações e pode compilar com falsos negativos: ou seja, o compilador pode acidentalmente compilar um componente/hook que quebra as Regras do React, o que pode levar a comportamentos indefinidos.

Por essa razão, para adotar o compilador com sucesso em projetos existentes, recomendamos executá-lo primeiro em um pequeno diretório em seu código de produto. Você pode fazer isso configurando o compilador para ser executado apenas em um conjunto específico de diretórios:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Em casos raros, você também pode configurar o compilador para funcionar no modo "opt-in", usando a opção `compilationMode: "annotation"`. Isso faz com que o compilador compile apenas componentes e hooks anotados com um diretório `"use memo"`. Observe que o modo `annotation` é temporário para ajudar os primeiros adotantes e que pretendemos que a diretiva `"use memo"` não seja usada a longo prazo.

```js {2,7}
const ReactCompilerConfig = {
  compilationMode: "annotation",
};

// src/app.jsx
export default function App() {
  "use memo";
  // ...
}
```

Quando você tiver mais confiança ao implementar o compilador, pode expandir a cobertura para outros diretórios e lentamente implementá-lo em todo o seu aplicativo.

#### Novos projetos {/*new-projects*/}

Se você estiver começando um novo projeto, pode habilitar o compilador em toda sua base de código, que é o comportamento padrão.

## Instalação {/*installation*/}

### Verificando compatibilidade {/*checking-compatibility*/}

Antes de instalar o compilador, você pode primeiro verificar se sua base de código é compatível:

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

Este script irá:

- Verificar quantos componentes podem ser otimizados com sucesso: quanto maior, melhor
- Verificar o uso de `<StrictMode>`: ter isso habilitado e seguido significa uma maior chance de que as [Regras do React](/reference/rules) sejam seguidas
- Verificar o uso de bibliotecas incompatíveis: bibliotecas conhecidas que são incompatíveis com o compilador

Como exemplo:

<TerminalBlock>
Compilado com sucesso 8 de 9 componentes.
Uso do StrictMode não encontrado.
Nenhum uso de bibliotecas incompatíveis encontrado.
</TerminalBlock>

### Instalando eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

O Compilador React também alimenta um plugin eslint. O plugin eslint pode ser usado **independentemente** do compilador, o que significa que você pode usar o plugin eslint mesmo se não usar o compilador.

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

Em seguida, adicione-o à sua configuração eslint:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': "error",
  },
}
```

### Uso com Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

O compilador inclui um plugin Babel que você pode usar em seu pipeline de construção para executar o compilador.

Após a instalação, adicione-o à sua configuração Babel. Observe que é crítico que o compilador seja executado **primeiro** no pipeline:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // deve ser executado primeiro!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler` deve ser executado primeiro antes de outros plugins Babel, pois o compilador requer as informações de origem da entrada para uma análise sólida.

### Uso com Vite {/*usage-with-vite*/}

Se você usa Vite, pode adicionar o plugin ao vite-plugin-react:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Uso com Next.js {/*usage-with-nextjs*/}

Next.js tem uma configuração experimental para habilitar o Compilador React. Ele garante automaticamente que Babel esteja configurado com `babel-plugin-react-compiler`.

- Instale o Next.js canary, que utiliza o React 19 Release Candidate
- Instale `babel-plugin-react-compiler`

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler
</TerminalBlock>

Em seguida, configure a opção experimental em `next.config.js`:

```js {4,5,6}
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

Usar a opção experimental garante suporte para o Compilador React em:

- App Router
- Pages Router
- Webpack (padrão)
- Turbopack (opcional através de `--turbo`)

### Uso com Remix {/*usage-with-remix*/}
Instale `vite-plugin-babel` e adicione o plugin Babel do compilador a ele:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // se você usar TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Uso com Webpack {/*usage-with-webpack*/}

Você pode criar seu próprio loader para o Compilador React, assim:

```js
const ReactCompilerConfig = { /* ... */ };
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');

function reactCompilerLoader(sourceCode, sourceMap) {
  // ...
  const result = transformSync(sourceCode, {
    // ...
    plugins: [
      [BabelPluginReactCompiler, ReactCompilerConfig],
    ],
  // ...
  });

  if (result === null) {
    this.callback(
      Error(
        `Falha ao transformar "${options.filename}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

### Uso com Expo {/*usage-with-expo*/}

Expo usa Babel via Metro, então consulte a seção [Uso com Babel](#usage-with-babel) para instruções de instalação.

### Uso com React Native (Metro) {/*usage-with-react-native-metro*/}

React Native usa Babel via Metro, então consulte a seção [Uso com Babel](#usage-with-babel) para instruções de instalação.

## Solução de Problemas {/*troubleshooting*/}

### Relatando Problemas {/*reporting-issues*/}

Para relatar problemas, por favor, crie primeiro uma repro mínima no [React Compiler Playground](https://playground.react.dev/) e inclua-a em seu relatório de bug.

Você pode abrir problemas no repositório [facebook/react](https://github.com/facebook/react/issues).

Você também pode fornecer feedback no Grupo de Trabalho do Compilador React aplicando-se para se tornar membro. Consulte [o README para mais detalhes sobre como se juntar](https://github.com/reactwg/react-compiler).

### Problemas Comuns {/*common-issues*/}

#### Erro `(0 , _c) is not a function` {/*0--_c-is-not-a-function-error*/}

Isso ocorre durante a avaliação de módulo JavaScript quando você não está usando o React 19 Beta e superior. Para corrigir isso, [atualize seu aplicativo para o React 19 Beta](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) primeiro.

### Depuração {/*debugging*/}

#### Verificando se os componentes foram otimizados {/*checking-if-components-have-been-optimized*/}
##### Ferramentas de Desenvolvedor React {/*react-devtools*/}

As Ferramentas de Desenvolvedor React (v5.0+) têm suporte integrado para o Compilador React e exibirão um distintivo "Memo ✨" ao lado dos componentes que foram otimizados pelo compilador.

##### Outros problemas {/*other-issues*/}

Consulte https://github.com/reactwg/react-compiler/discussions/7.