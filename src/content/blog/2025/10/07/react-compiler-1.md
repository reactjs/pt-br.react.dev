---
title: "React Compiler v1.0"
author: Lauren Tan, Joe Savona, and Mofei Zhang
date: 2025/10/07
description: Estamos lançando hoje a primeira versão estável do compilador.
---

7 de outubro de 2025 por [Lauren Tan](https://x.com/potetotes), [Joe Savona](https://x.com/en_JS) e [Mofei Zhang](https://x.com/zmofei).

---

<Intro>

A equipe do React tem o prazer de compartilhar novas atualizações:

</Intro>

1. O React Compiler 1.0 está disponível hoje.
2. Regras de linting baseadas em compilador são enviadas no `eslint-plugin-react-hooks` nas configurações `recommended` e `recommended-latest`.
3. Publicamos um guia de adoção incremental e fizemos parceria com Expo, Vite e Next.js para que novos aplicativos possam começar com o compilador ativado.

---

Estamos lançando hoje a primeira versão estável do compilador. O React Compiler funciona tanto no React quanto no React Native, e otimiza automaticamente componentes e hooks sem exigir reescritas. O compilador foi testado em batalhas em aplicativos importantes na Meta e está totalmente pronto para produção.

O [React Compiler](/learn/react-compiler) é uma ferramenta de tempo de compilação que otimiza seu aplicativo React através de memoização automática. No ano passado, publicamos o [primeiro beta do React Compiler](/blog/2024/10/21/react-compiler-beta-release) e recebemos muito feedback e contribuições excelentes. Estamos animados com as vitórias que vimos de pessoas adotando o compilador (veja estudos de caso do [Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) e [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)) e estamos ansiosos para levar o compilador a mais usuários na comunidade React.

Este lançamento é o culminar de um esforço de engenharia enorme e complexo que abrange quase uma década. A primeira exploração da equipe React em compiladores começou com o [Prepack](https://github.com/facebookarchive/prepack) em 2017. Embora este projeto tenha sido eventualmente descontinuado, houve muitos aprendizados que informaram a equipe sobre o design dos Hooks, que foram projetados com um futuro compilador em mente. Em 2021, [Xuan Huang](https://x.com/Huxpro) demonstrou a [primeira iteração](https://www.youtube.com/watch?v=lGEMwh32soc) de uma nova abordagem para o React Compiler.

Embora esta primeira versão do novo React Compiler tenha sido eventualmente reescrita, o primeiro protótipo nos deu maior confiança de que este era um problema tratável, e os aprendizados de que uma arquitetura de compilador alternativa poderia nos dar precisamente as características de memoização que queríamos. [Joe Savona](https://x.com/en_JS), [Sathya Gunasekaran](https://x.com/_gsathya), [Mofei Zhang](https://x.com/zmofei) e [Lauren Tan](https://x.com/potetotes) trabalharam em nossa primeira reescrita, movendo a arquitetura do compilador para uma Representação Intermediária de Alto Nível (HIR) baseada em Grafo de Fluxo de Controle (CFG). Isso abriu caminho para uma análise muito mais precisa e até mesmo inferência de tipos dentro do React Compiler. Desde então, muitas partes significativas do compilador foram reescritas, com cada reescrita informada por nossos aprendizados da tentativa anterior. E recebemos ajuda e contribuições significativas de muitos membros da [equipe React](/community/team) ao longo do caminho.

Este lançamento estável é o primeiro de muitos. O compilador continuará a evoluir e melhorar, e esperamos que ele se torne uma nova base e era para a próxima década e mais do React.

Você pode ir direto para o [guia rápido](/learn/react-compiler), ou continuar lendo para os destaques do React Conf 2025.

<DeepDive>

#### Como o React Compiler funciona? {/*how-does-react-compiler-work*/}

O React Compiler é um compilador otimizador que otimiza componentes e hooks através de memoização automática. Embora atualmente seja implementado como um plugin Babel, o compilador é em grande parte desacoplado do Babel e reduz a Árvore de Sintaxe Abstrata (AST) fornecida pelo Babel para sua própria HIR nova, e através de múltiplas passagens de compilador, compreende cuidadosamente o fluxo de dados e a mutabilidade do seu código React. Isso permite que o compilador memorize granularmente os valores usados na renderização, incluindo a capacidade de memorizar condicionalmente, o que não é possível através de memoização manual.

```js {8}
import { use } from 'react';

export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }
  // O compilador ainda pode memorizar código após um retorno condicional
  const theme = mergeTheme(props.theme, use(ThemeContext));
  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```
_Veja este exemplo no [Playground do React Compiler](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)_

Além da memoização automática, o React Compiler também possui passes de validação que rodam no seu código React. Esses passes codificam as [Regras do React](/reference/rules) e usam o entendimento do compilador sobre fluxo de dados e mutabilidade para fornecer diagnósticos onde as Regras do React são violadas. Esses diagnósticos frequentemente expõem bugs latentes escondidos no código React e são principalmente expostos através do `eslint-plugin-react-hooks`.

Para saber mais sobre como o compilador otimiza seu código, visite o [Playground](https://playground.react.dev).

</DeepDive>

## Use o React Compiler Hoje {/*use-react-compiler-today*/}
Para instalar o compilador:

npm
<TerminalBlock>
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev --exact babel-plugin-react-compiler@latest
</TerminalBlock>

Como parte do lançamento estável, tornamos o React Compiler mais fácil de adicionar aos seus projetos e adicionamos otimizações em como o compilador gera a memoização. O React Compiler agora suporta cadeias opcionais e índices de array como dependências. Essas melhorias resultam em menos re-renderizações e UIs mais responsivas, enquanto permitem que você continue escrevendo código declarativo idiomático.

Você pode encontrar mais detalhes sobre o uso do Compilador em [nossa documentação](/learn/react-compiler).

## O que estamos vendo em produção {/*react-compiler-at-meta*/}
[O compilador já foi lançado em aplicativos como a Meta Quest Store](https://youtu.be/lyEKhv8-3n0?t=3002). Vimos as cargas iniciais e as navegações entre páginas melhorarem em até 12%, enquanto certas interações são mais de 2,5 vezes mais rápidas. O uso de memória permanece neutro mesmo com essas melhorias. Embora seus resultados possam variar, recomendamos experimentar o compilador em seu aplicativo para ver ganhos de desempenho semelhantes.

## Compatibilidade com Versões Anteriores {/*backwards-compatibility*/}
Como observado no anúncio Beta, o React Compiler é compatível com React 17 e superior. Se você ainda não está no React 19, pode usar o React Compiler especificando um alvo mínimo em sua configuração do compilador e adicionando `react-compiler-runtime` como uma dependência. Você pode encontrar a documentação sobre isso [aqui](/reference/react-compiler/target#targeting-react-17-or-18).

## Aplique as Regras do React com Linting Powered by Compiler {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
O React Compiler inclui uma regra ESLint que ajuda a identificar código que viola as [Regras do React](/reference/rules). O linter não requer que o compilador seja instalado, portanto, não há risco em atualizar o `eslint-plugin-react-hooks`. Recomendamos que todos atualizem hoje.

Se você já instalou o `eslint-plugin-react-compiler`, agora pode removê-lo e usar o `eslint-plugin-react-hooks@latest`. Muitos agradecimentos a [@michaelfaith](https://bsky.app/profile/michael.faith) por contribuir para esta melhoria!

Para instalar:

npm
<TerminalBlock>
npm install --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev eslint-plugin-react-hooks@latest
</TerminalBlock>

```js {6}
// eslint.config.js (Flat Config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
]);
```

```js {3}
// eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"],
  // ...
}
```

Para habilitar as regras do React Compiler, recomendamos usar o preset `recommended`. Você também pode conferir o [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md) para mais instruções. Aqui estão alguns exemplos que apresentamos no React Conf:

- Capturando padrões de `setState` que causam loops de renderização com [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render).
- Sinalizando trabalho caro dentro de efeitos via [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect).
- Prevenindo acesso inseguro a refs durante a renderização com [`refs`](/reference/eslint-plugin-react-hooks/lints/refs).

## O que devo fazer sobre useMemo, useCallback e React.memo? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}
Por padrão, o React Compiler memorizará seu código com base em sua análise e heurísticas. Na maioria dos casos, essa memoização será tão precisa, ou mais, do que o que você pode ter escrito — e como observado acima, o compilador pode memorizar mesmo em casos onde `useMemo`/`useCallback` não podem ser usados, como após um retorno antecipado.

No entanto, em alguns casos, os desenvolvedores podem precisar de mais controle sobre a memoização. Os hooks `useMemo` e `useCallback` podem continuar a ser usados com o React Compiler como uma saída de emergência para fornecer controle sobre quais valores são memorizados. Um caso de uso comum para isso é se um valor memorizado for usado como uma dependência de efeito, a fim de garantir que um efeito não seja disparado repetidamente, mesmo quando suas dependências não mudam significativamente.

Para código novo, recomendamos confiar no compilador para memoização e usar `useMemo`/`useCallback` quando necessário para obter controle preciso.

Para código existente, recomendamos deixar a memoização existente no lugar (removê-la pode alterar a saída da compilação) ou testar cuidadosamente antes de remover a memoização.

## Novos aplicativos devem usar o React Compiler {/*new-apps-should-use-react-compiler*/}
Fizemos parceria com as equipes do Expo, Vite e Next.js para adicionar o compilador à experiência de novos aplicativos.

O [Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) e superior tem o compilador habilitado por padrão, então novos aplicativos poderão aproveitar o compilador automaticamente desde o início.

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Usuários de [Vite](https://vite.dev/guide/) e [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) podem escolher os templates com o compilador habilitado em `create-vite` e `create-next-app`.

<TerminalBlock>
npm create vite@latest
</TerminalBlock>

<br />

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

## Adote o React Compiler incrementalmente {/*adopt-react-compiler-incrementally*/}
Se você está mantendo um aplicativo existente, pode implementar o compilador no seu próprio ritmo. Publicamos um guia passo a passo de [adoção incremental](/learn/react-compiler/incremental-adoption) que cobre estratégias de controle, verificações de compatibilidade e ferramentas de implantação para que você possa habilitar o compilador com confiança.

## Suporte swc (experimental) {/*swc-support-experimental*/}
O React Compiler pode ser instalado em [várias ferramentas de compilação](/learn/react-compiler#installation), como Babel, Vite e Rsbuild.

Além dessas ferramentas, temos colaborado com Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) da equipe [swc](https://swc.rs/) para adicionar suporte adicional para o React Compiler como um plugin swc. Embora este trabalho não esteja concluído, o desempenho de compilação do Next.js deve ser consideravelmente mais rápido agora quando o [React Compiler estiver habilitado em seu aplicativo Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler).

Recomendamos o uso do [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) ou superior do Next.js para obter o melhor desempenho de compilação.

Usuários do Vite podem continuar usando o [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) para habilitar o compilador, adicionando-o como um plugin [Babel](/learn/react-compiler/installation#vite). Também estamos trabalhando com a equipe do [oxc](https://oxc.rs/) para [adicionar suporte ao compilador](https://github.com/oxc-project/oxc/issues/10048). Assim que o [rolldown](https://github.com/rolldown/rolldown) for oficialmente lançado e o suporte do oxc for adicionado para o React Compiler, atualizaremos a documentação com informações sobre como migrar.

## Atualizando o React Compiler {/*upgrading-react-compiler*/}
O React Compiler funciona melhor quando a auto-memoização aplicada é estritamente para desempenho. Versões futuras do compilador podem alterar como a memoização é aplicada, por exemplo, ela pode se tornar mais granular e precisa.

No entanto, como o código do produto às vezes pode violar as [regras do React](/reference/rules) de maneiras que nem sempre são detectáveis estaticamente em JavaScript, a alteração da memoização pode ocasionalmente ter resultados inesperados. Por exemplo, um valor previamente memorizado pode ser usado como dependência para um `useEffect` em algum lugar na árvore de componentes. Alterar como ou se esse valor é memorizado pode causar disparos excessivos ou insuficientes desse `useEffect`. Embora incentivemos o [useEffect apenas para sincronização](/learn/synchronizing-with-effects), sua base de código pode ter `useEffect`s que cobrem outros casos de uso, como efeitos que precisam ser executados apenas em resposta a valores específicos que mudam.

Em outras palavras, a alteração da memoização pode, em raras circunstâncias, causar comportamento inesperado. Por esse motivo, recomendamos seguir as Regras do React e empregar testes contínuos de ponta a ponta de seu aplicativo para que você possa atualizar o compilador com confiança e identificar quaisquer violações das regras do React que possam causar problemas.

Se você não tiver uma boa cobertura de testes, recomendamos fixar o compilador em uma versão exata (por exemplo, `1.0.0`) em vez de um intervalo SemVer (por exemplo, `^1.0.0`). Você pode fazer isso passando as flags `--save-exact` (npm/pnpm) ou `--exact` (yarn) ao atualizar o compilador. Você deve então fazer todas as atualizações do compilador manualmente, tomando cuidado para verificar se seu aplicativo ainda funciona como esperado.

---

Graças a [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev) e [Dan Abramov](https://bsky.app/profile/danabra.mov) por revisar e editar este post.