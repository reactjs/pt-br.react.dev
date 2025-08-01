---
title: Instalação
---

<Intro>
Este guia irá ajudá-lo a instalar e configurar o React Compiler em sua aplicação React.
</Intro>

<YouWillLearn>

* Como instalar o React Compiler
* Configuração básica para diferentes ferramentas de build
* Como verificar se sua configuração está funcionando

</YouWillLearn>

## Pré-requisitos {/*prerequisites*/}

O React Compiler foi projetado para funcionar melhor com React 19, mas também suporta React 17 e 18. Saiba mais sobre [compatibilidade de versão React](/reference/react-compiler/target).

<Note>
O React Compiler está atualmente em RC. Instale-o usando a tag `@rc` para obter a versão release candidate mais recente.
</Note>

## Instalação {/*installation*/}

Instale o React Compiler como uma `devDependency`:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

Ou com Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@rc
</TerminalBlock>

Ou com pnpm:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

## Configuração Básica {/*basic-setup*/}

O React Compiler foi projetado para funcionar por padrão sem nenhuma configuração. No entanto, se você precisar configurá-lo em circunstâncias especiais (por exemplo, para atingir versões React abaixo de 19), consulte a [referência de opções do compilador](/reference/react-compiler/configuration).

O processo de configuração depende da sua ferramenta de build. O React Compiler inclui um plugin Babel que se integra ao seu pipeline de build.

<Pitfall>
O React Compiler deve executar **primeiro** no seu pipeline de plugins Babel. O compilador precisa das informações do código fonte original para análise adequada, então deve processar seu código antes de outras transformações.
</Pitfall>

### Babel {/*babel*/}

Crie ou atualize seu `babel.config.js`:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // deve executar primeiro!
    // ... outros plugins
  ],
  // ... outras configurações
};
```

### Vite {/*vite*/}

Se você usa Vite, pode adicionar o plugin ao vite-plugin-react:

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

Alternativamente, se você preferir um plugin Babel separado para Vite:

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

Por favor, consulte a [documentação do Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) para mais informações.

### React Router {/*usage-with-react-router*/}
Instale `vite-plugin-babel` e adicione o plugin Babel do compilador:

<TerminalBlock>
{`npm install vite-plugin-babel`}
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // se você usa TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Um loader webpack da comunidade está [disponível aqui](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Por favor, consulte a [documentação do Expo](https://docs.expo.dev/guides/react-compiler/) para habilitar e usar o React Compiler em aplicações Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native usa Babel via Metro, então consulte a seção [Uso com Babel](#babel) para instruções de instalação.

### Rspack {/*usage-with-rspack*/}

Por favor, consulte a [documentação do Rspack](https://rspack.dev/guide/tech/react#react-compiler) para habilitar e usar o React Compiler em aplicações Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Por favor, consulte a [documentação do Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) para habilitar e usar o React Compiler em aplicações Rsbuild.

## Integração com ESLint {/*eslint-integration*/}

O React Compiler inclui uma regra ESLint que ajuda a identificar código que não pode ser otimizado. Quando a regra ESLint reporta um erro, significa que o compilador pulará a otimização daquele componente ou hook específico. Isso é seguro: o compilador continuará otimizando outras partes da sua base de código. Você não precisa corrigir todas as violações imediatamente. Resolva-as no seu próprio ritmo para aumentar gradualmente o número de componentes otimizados.

Instale o plugin ESLint:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@rc
</TerminalBlock>

Em seguida, habilite a regra do compilador na sua configuração ESLint:

```js {3}
// .eslintrc.js
module.exports = {
  rules: {
    'react-hooks/react-compiler': 'error',
  },
};
```

A regra ESLint irá:
- Identificar violações das [Regras do React](/reference/rules)
- Mostrar quais componentes não podem ser otimizados
- Fornecer mensagens de erro úteis para corrigir problemas

## Verificar Sua Configuração {/*verify-your-setup*/}

Após a instalação, verifique se o React Compiler está funcionando corretamente.

### Verificar React DevTools {/*check-react-devtools*/}

Componentes otimizados pelo React Compiler mostrarão um badge "Memo ✨" no React DevTools:

1. Instale a extensão do navegador [React Developer Tools](/learn/react-developer-tools)
2. Abra sua aplicação em modo de desenvolvimento
3. Abra o React DevTools
4. Procure pelo emoji ✨ ao lado dos nomes dos componentes

Se o compilador estiver funcionando:
- Componentes mostrarão um badge "Memo ✨" no React DevTools
- Cálculos caros serão automaticamente memoizados
- Nenhum `useMemo` manual é necessário

### Verificar Saída do Build {/*check-build-output*/}

Você também pode verificar se o compilador está executando verificando a saída do seu build. O código compilado incluirá lógica de memoização automática que o compilador adiciona automaticamente.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## Solução de Problemas {/*troubleshooting*/}

### Excluindo componentes específicos {/*opting-out-specific-components*/}

Se um componente está causando problemas após a compilação, você pode temporariamente excluí-lo usando a diretiva `"use no memo"`:

```js
function ProblematicComponent() {
  "use no memo";
  // Código do componente aqui
}
```

Isso diz ao compilador para pular a otimização para este componente específico. Você deve corrigir o problema subjacente e remover a diretiva uma vez resolvido.

Para mais ajuda na solução de problemas, veja o [guia de depuração](/learn/react-compiler/debugging).

## Próximos Passos {/*next-steps*/}

Agora que você tem o React Compiler instalado, saiba mais sobre:

- [Compatibilidade de versão React](/reference/react-compiler/target) para React 17 e 18
- [Opções de configuração](/reference/react-compiler/configuration) para personalizar o compilador
- [Estratégias de adoção incremental](/learn/react-compiler/incremental-adoption) para bases de código existentes
- [Técnicas de depuração](/learn/react-compiler/debugging) para solução de problemas
- [Guia de compilação de bibliotecas](/reference/react-compiler/compiling-libraries) para compilar sua biblioteca React