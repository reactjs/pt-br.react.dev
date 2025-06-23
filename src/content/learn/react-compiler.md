---
title: React Compiler
---

<Intro>
Esta página dará uma introdução ao React Compiler e como experimentá-lo com sucesso.
</Intro>

<Wip>
Esta documentação ainda está em desenvolvimento. Mais documentação está disponível no [repositório do React Compiler Working Group](https://github.com/reactwg/react-compiler/discussions), e será integrada nesta documentação quando estiver mais estável.
</Wip>

<YouWillLearn>

* Primeiros passos com o compilador
* Instalação do compilador e plugin ESLint
* Resolução de problemas

</YouWillLearn>

<Note>
O React Compiler é um novo compilador atualmente em Beta, que disponibilizámos como código aberto para obter feedback inicial da comunidade. Embora tenha sido usado em produção em empresas como a Meta, implementar o compilador em produção para a sua aplicação dependerá da saúde da sua base de código e de quão bem seguiu as [Regras do React](/reference/rules).

A versão Beta mais recente pode ser encontrada com a tag `@beta`, e versões experimentais diárias com `@experimental`.
</Note>

O React Compiler é um novo compilador que disponibilizámos como código aberto para obter feedback inicial da comunidade. É uma ferramenta apenas de tempo de compilação que otimiza automaticamente a sua aplicação React. Funciona com JavaScript simples, e compreende as [Regras do React](/reference/rules), pelo que não precisa de reescrever nenhum código para o usar.

O compilador também inclui um [plugin ESLint](#installing-eslint-plugin-react-compiler) que exibe a análise do compilador diretamente no seu editor. **Recomendamos vivamente que todos usem o linter hoje.** O linter não requer que tenha o compilador instalado, pelo que pode usá-lo mesmo que não esteja pronto para experimentar o compilador.

O compilador está atualmente lançado como `beta`, e está disponível para experimentar em aplicações e bibliotecas React 17+. Para instalar a Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou, se estiver a usar Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Se ainda não estiver a usar React 19, por favor consulte [a secção abaixo](#using-react-compiler-with-react-17-or-18) para mais instruções.

### O que faz o compilador? {/*what-does-the-compiler-do*/}

Para otimizar aplicações, o React Compiler memoriza automaticamente o seu código. Pode estar familiarizado hoje com memorização através de APIs como `useMemo`, `useCallback`, e `React.memo`. Com estas APIs pode dizer ao React que certas partes da sua aplicação não precisam de ser recalculadas se as suas entradas não mudaram, reduzindo o trabalho nas atualizações. Embora poderosas, é fácil esquecer-se de aplicar memorização ou aplicá-las incorretamente. Isto pode levar a atualizações ineficientes, já que o React tem de verificar partes da sua UI que não têm mudanças _significativas_.

O compilador usa o seu conhecimento de JavaScript e das regras do React para memorizar automaticamente valores ou grupos de valores dentro dos seus componentes e hooks. Se detetar quebras das regras, saltará automaticamente apenas esses componentes ou hooks, e continuará a compilar com segurança outro código.

<Note>
O React Compiler pode detetar estaticamente quando as Regras do React são quebradas, e optar com segurança por não otimizar apenas os componentes ou hooks afetados. Não é necessário que o compilador otimize 100% da sua base de código.
</Note>

Se a sua base de código já está muito bem memorizada, pode não esperar ver grandes melhorias de desempenho com o compilador. No entanto, na prática, memorizar as dependências corretas que causam problemas de desempenho é complicado de acertar manualmente.

<DeepDive>
#### Que tipo de memorização adiciona o React Compiler? {/*what-kind-of-memoization-does-react-compiler-add*/}

O lançamento inicial do React Compiler está principalmente focado em **melhorar o desempenho de atualizações** (re-renderizar componentes existentes), pelo que se foca nestes dois casos de uso:

1. **Saltar re-renderização em cascata de componentes**
    * Re-renderizar `<Parent />` faz com que muitos componentes na sua árvore de componentes se re-renderizem, mesmo que apenas `<Parent />` tenha mudado
1. **Saltar cálculos caros de fora do React**
    * Por exemplo, chamar `expensivelyProcessAReallyLargeArrayOfObjects()` dentro do seu componente ou hook que precisa desses dados

#### Otimizar Re-renderizações {/*optimizing-re-renders*/}

O React permite-lhe expressar a sua UI como uma função do seu estado atual (mais concretamente: as suas props, estado, e contexto). Na sua implementação atual, quando o estado de um componente muda, o React re-renderizará esse componente _e todos os seus filhos_ — a menos que tenha aplicado alguma forma de memorização manual com `useMemo()`, `useCallback()`, ou `React.memo()`. Por exemplo, no seguinte exemplo, `<MessageButton>` re-renderizará sempre que o estado de `<FriendList>` mudar:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Ver este exemplo no React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

O React Compiler aplica automaticamente o equivalente à memorização manual, garantindo que apenas as partes relevantes de uma aplicação se re-renderizam quando o estado muda, que às vezes é referido como "reatividade de grão fino". No exemplo acima, o React Compiler determina que o valor de retorno de `<FriendListCard />` pode ser reutilizado mesmo quando `friends` muda, e pode evitar recriar este JSX _e_ evitar re-renderizar `<MessageButton>` quando a contagem muda.

#### Cálculos caros também são memorizados {/*expensive-calculations-also-get-memoized*/}

O compilador também pode memorizar automaticamente cálculos caros usados durante a renderização:

```js
// **Não** memorizado pelo React Compiler, já que isto não é um componente ou hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memorizado pelo React Compiler já que isto é um componente
function TableContainer({ items }) {
  // Esta chamada de função seria memorizada:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Ver este exemplo no React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

No entanto, se `expensivelyProcessAReallyLargeArrayOfObjects` é verdadeiramente uma função cara, pode querer considerar implementar a sua própria memorização fora do React, porque:

- O React Compiler apenas memoriza componentes React e hooks, não todas as funções
- A memorização do React Compiler não é partilhada entre vários componentes ou hooks

Então se `expensivelyProcessAReallyLargeArrayOfObjects` fosse usado em muitos componentes diferentes, mesmo que os mesmos itens exatos fossem passados, esse cálculo caro seria executado repetidamente. Recomendamos [fazer profiling](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) primeiro para ver se é realmente tão caro antes de tornar o código mais complicado.
</DeepDive>

### Devo experimentar o compilador? {/*should-i-try-out-the-compiler*/}

Por favor note que o compilador ainda está em Beta e tem muitas arestas por limar. Embora tenha sido usado em produção em empresas como a Meta, implementar o compilador em produção para a sua aplicação dependerá da saúde da sua base de código e de quão bem seguiu as [Regras do React](/reference/rules).

**Não tem de se apressar a usar o compilador agora. Está bem esperar até que chegue a uma versão estável antes de o adotar.** No entanto, apreciamos que o experimente em pequenas experiências nas suas aplicações para que possa [fornecer feedback](#reporting-issues) para nos ajudar a tornar o compilador melhor.

## Primeiros Passos {/*getting-started*/}

Além desta documentação, recomendamos verificar o [React Compiler Working Group](https://github.com/reactwg/react-compiler) para informação adicional e discussão sobre o compilador.

### Instalar eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

O React Compiler também alimenta um plugin ESLint. O plugin ESLint pode ser usado **independentemente** do compilador, significando que pode usar o plugin ESLint mesmo que não use o compilador.

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Depois, adicione-o à sua configuração ESLint:

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

Ou, no formato de configuração eslintrc obsoleto:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

O plugin ESLint mostrará quaisquer violações das regras do React no seu editor. Quando isso acontece, significa que o compilador saltou a otimização desse componente ou hook. Isto está perfeitamente bem, e o compilador pode recuperar e continuar a otimizar outros componentes na sua base de código.

<Note>
**Não tem de corrigir todas as violações ESLint imediatamente.** Pode abordá-las ao seu próprio ritmo para aumentar a quantidade de componentes e hooks sendo otimizados, mas não é necessário corrigir tudo antes de poder usar o compilador.
</Note>

### Implementar o compilador na sua base de código {/*using-the-compiler-effectively*/}

#### Projetos existentes {/*existing-projects*/}
O compilador foi desenhado para compilar componentes funcionais e hooks que seguem as [Regras do React](/reference/rules). Também pode lidar com código que quebra essas regras ao optar por sair (saltar) desses componentes ou hooks. No entanto, devido à natureza flexível do JavaScript, o compilador não pode capturar todas as possíveis violações e pode compilar com falsos negativos: isto é, o compilador pode acidentalmente compilar um componente/hook que quebra as Regras do React, o que pode levar a comportamento indefinido.

Por esta razão, para adotar o compilador com sucesso em projetos existentes, recomendamos executá-lo primeiro numa pequena diretoria no seu código de produto. Pode fazer isto configurando o compilador para apenas executar num conjunto específico de diretorias:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Quando tiver mais confiança em implementar o compilador, pode expandir a cobertura para outras diretorias também e lentamente implementá-lo em toda a sua aplicação.

#### Novos projetos {/*new-projects*/}

Se estiver a começar um novo projeto, pode ativar o compilador em toda a sua base de código, que é o comportamento padrão.

### Usar React Compiler com React 17 ou 18 {/*using-react-compiler-with-react-17-or-18*/}

O React Compiler funciona melhor com React 19 RC. Se não conseguir atualizar, pode instalar o pacote extra `react-compiler-runtime` que permitirá que o código compilado execute em versões anteriores à 19. No entanto, note que a versão mínima suportada é a 17.

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

Também deve adicionar o `target` correto à sua configuração do compilador, onde `target` é a versão principal do React que está a usar:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Usar o compilador em bibliotecas {/*using-the-compiler-on-libraries*/}

O React Compiler também pode ser usado para compilar bibliotecas. Como o React Compiler precisa de executar no código fonte original antes de quaisquer transformações de código, não é possível para o pipeline de compilação de uma aplicação compilar as bibliotecas que usa. Portanto, a nossa recomendação é que os mantenedores de bibliotecas compiem e testem independentemente as suas bibliotecas com o compilador, e enviem código compilado para npm.

Como o seu código está pré-compilado, os utilizadores da sua biblioteca não precisarão de ter o compilador ativado para beneficiar da memorização automática aplicada à sua biblioteca. Se a sua biblioteca é destinada a aplicações que ainda não estão no React 19, especifique um [`target` mínimo e adicione `react-compiler-runtime` como dependência direta](#using-react-compiler-with-react-17-or-18). O pacote runtime usará a implementação correta das APIs dependendo da versão da aplicação, e preencherá as APIs em falta se necessário.

O código de bibliotecas pode frequentemente requerer padrões mais complexos e uso de escape hatches. Por esta razão, recomendamos garantir que tem testes suficientes para identificar quaisquer problemas que possam surgir do uso do compilador na sua biblioteca. Se identificar quaisquer problemas, pode sempre optar por sair de componentes ou hooks específicos com a [diretiva `'use no memo'`](#something-is-not-working-after-compilation).

Similarmente às aplicações, não é necessário compilar completamente 100% dos seus componentes ou hooks para ver benefícios na sua biblioteca. Um bom ponto de partida pode ser identificar as partes mais sensíveis ao desempenho da sua biblioteca e garantir que não quebram as [Regras do React](/reference/rules), que pode usar `eslint-plugin-react-compiler` para identificar.

## Uso {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@beta
</TerminalBlock>

O compilador inclui um plugin Babel que pode usar no seu pipeline de compilação para executar o compilador.

Após instalar, adicione-o à sua configuração Babel. Por favor note que é crítico que o compilador execute **primeiro** no pipeline:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // deve executar primeiro!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler` deve executar primeiro antes de outros plugins Babel, já que o compilador requer a informação do código fonte de entrada para análise sólida.

### Vite {/*usage-with-vite*/}

Se usar Vite, pode adicionar o plugin ao vite-plugin-react:

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

### Next.js {/*usage-with-nextjs*/}

Por favor consulte a [documentação Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) para mais informação.

### Remix {/*usage-with-remix*/}
Instale `vite-plugin-babel`, e adicione o plugin Babel do compilador a ele:

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
        presets: ["@babel/preset-typescript"], // se usar TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Um loader webpack da comunidade está [agora disponível aqui](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Por favor consulte a [documentação Expo](https://docs.expo.dev/guides/react-compiler/) para ativar e usar o React Compiler em aplicações Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native usa Babel via Metro, então consulte a secção [Uso com Babel](#usage-with-babel) para instruções de instalação.

### Rspack {/*usage-with-rspack*/}

Por favor consulte a [documentação Rspack](https://rspack.dev/guide/tech/react#react-compiler) para ativar e usar o React Compiler em aplicações Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Por favor consulte a [documentação Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) para ativar e usar o React Compiler em aplicações Rsbuild.

## Resolução de Problemas {/*troubleshooting*/}

Para reportar problemas, por favor primeiro crie uma reprodução mínima no [React Compiler Playground](https://playground.react.dev/) e inclua-a no seu relatório de bug. Pode abrir issues no repositório [facebook/react](https://github.com/facebook/react/issues).

Também pode fornecer feedback no React Compiler Working Group candidatando-se a ser membro. Por favor veja [o README para mais detalhes sobre como se juntar](https://github.com/reactwg/react-compiler).

### O que assume o compilador? {/*what-does-the-compiler-assume*/}

O React Compiler assume que o seu código:

1. É JavaScript válido e semântico.
2. Testa que valores e propriedades nullable/opcionais estão definidos antes de os aceder (por exemplo, ativando [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) se usar TypeScript), i.e., `if (object.nullableProperty) { object.nullableProperty.foo }` ou com optional-chaining `object.nullableProperty?.foo`.
3. Segue as [Regras do React](https://react.dev/reference/rules).

O React Compiler pode verificar muitas das Regras do React estaticamente, e saltará com segurança a compilação quando detetar um erro. Para ver os erros recomendamos também instalar [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### Como sei que os meus componentes foram otimizados? {/*how-do-i-know-my-components-have-been-optimized*/}

[React DevTools](/learn/react-developer-tools) (v5.0+) e [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) têm suporte integrado para React Compiler e mostrarão um badge "Memo ✨" ao lado de componentes que foram otimizados pelo compilador.

### Algo não está a funcionar após a compilação {/*something-is-not-working-after-compilation*/}
Se tiver eslint-plugin-react-compiler instalado, o compilador mostrará quaisquer violações das regras do React no seu editor. Quando isso acontece, significa que o compilador saltou a otimização desse componente ou hook. Isto está perfeitamente bem, e o compilador pode recuperar e continuar a otimizar outros componentes na sua base de código. **Não tem de corrigir todas as violações ESLint imediatamente.** Pode abordá-las ao seu próprio ritmo para aumentar a quantidade de componentes e hooks sendo otimizados.

Devido à natureza flexível e dinâmica do JavaScript no entanto, não é possível detetar de forma abrangente todos os casos. Bugs e comportamento indefinido como loops infinitos podem ocorrer nesses casos.

Se a sua aplicação não funciona corretamente após a compilação e não vê quaisquer erros ESLint, o compilador pode estar a compilar incorretamente o seu código. Para confirmar isto, tente fazer o problema desaparecer optando agressivamente por sair de qualquer componente ou hook que pense que possa estar relacionado via a [diretiva `"use no memo"`](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // opta este componente por sair de ser compilado pelo React Compiler
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` é um escape hatch _temporário_ que permite optar por sair componentes e hooks de serem compilados pelo React Compiler. Esta diretiva não se destina a ser duradoura da mesma forma que p.ex. [`"use client"`](/reference/rsc/use-client) é.

Não é recomendado recorrer a esta diretiva a menos que seja estritamente necessário. Uma vez que opta por sair de um componente ou hook, está optado por sair para sempre até que a diretiva seja removida. Isto significa que mesmo que corrija o código, o compilador ainda saltará a compilação dele a menos que remova a diretiva.
</Note>

Quando fizer o erro desaparecer, confirme que remover a diretiva de opt out faz o problema voltar. Depois partilhe um relatório de bug connosco (pode tentar reduzi-lo a uma pequena reprodução, ou se for código de código aberto também pode apenas colar todo o código fonte) usando o [React Compiler Playground](https://playground.react.dev) para que possamos identificar e ajudar a corrigir o problema.

### Outros problemas {/*other-issues*/}

Por favor veja https://github.com/reactwg/react-compiler/discussions/7.