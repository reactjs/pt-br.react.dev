---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

O `eslint-plugin-react-hooks` fornece regras do ESLint para impor as [Regras do React](/reference/rules).

</Intro>

Este plugin ajuda você a detectar violações das regras do React em tempo de compilação, garantindo que seus componentes e hooks sigam as regras do React para correção e desempenho. Os lints cobrem tanto padrões fundamentais do React (exhaustive-deps e rules-of-hooks) quanto problemas sinalizados pelo React Compiler. Os diagnósticos do React Compiler são automaticamente exibidos por este plugin ESLint e podem ser usados mesmo que seu aplicativo ainda não tenha adotado o compilador.

<Note>
Quando o compilador relata um diagnóstico, isso significa que o compilador foi capaz de detectar estaticamente um padrão que não é suportado ou quebra as Regras do React. Quando ele detecta isso, ele **automaticamente** ignora esses componentes e hooks, enquanto mantém o restante do seu aplicativo compilado. Isso garante uma cobertura ideal de otimizações seguras que não quebrarão seu aplicativo.

O que isso significa para o linting é que você não precisa corrigir todas as violações imediatamente. Resolva-as no seu próprio ritmo para aumentar gradualmente o número de componentes otimizados.
</Note>

## Regras Recomendadas {/*recommended*/}

Estas regras estão incluídas no preset `recommended` em `eslint-plugin-react-hooks`:

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - Valida que os arrays de dependência para hooks do React contêm todas as dependências necessárias
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - Valida que componentes e hooks seguem as Regras dos Hooks
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - Valida funções de ordem superior que definem componentes ou hooks aninhados
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - Valida as opções de configuração do compilador
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - Valida o uso de Error Boundaries em vez de try/catch para erros de filhos
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - Valida a configuração do modo de gating
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - Valida contra atribuição/mutação de globais durante a renderização
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - Valida contra mutação de props, estado e outros valores imutáveis
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - Valida contra o uso de bibliotecas incompatíveis com memoização
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - Valida que a memoização manual existente é preservada pelo compilador
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - Valida que componentes/hooks são puros verificando funções conhecidas como impuras
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - Valida o uso correto de refs, não lendo/escrevendo durante a renderização
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - Valida contra a chamada de setState síncronamente em um effect
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - Valida contra a definição de estado durante a renderização
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - Valida que os componentes são estáticos, não recriados a cada renderização
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - Valida contra sintaxe que o React Compiler não suporta
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - Valida o uso do hook `useMemo` sem um valor de retorno