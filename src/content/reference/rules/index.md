---
title: Regras do React
---

<Intro>
Assim como diferentes linguagens de programação têm suas próprias maneiras de expressar conceitos, o React tem seus próprios idiomas — ou regras — para expressar padrões de maneira fácil de entender e gerar aplicações de alta qualidade.
</Intro>

<InlineToc />

---

<Note>
Para saber mais sobre como expressar UIs com React, recomendamos a leitura de [Thinking in React](/learn/thinking-in-react).
</Note>

Esta seção descreve as regras que você precisa seguir para escrever um código React idiomático. Escrever um código React idiomático pode ajudá-lo a escrever aplicações bem organizadas, seguras e compostas. Essas propriedades tornam seu app mais resiliente a mudanças e facilitam o trabalho com outros desenvolvedores, bibliotecas e ferramentas.

Essas regras são conhecidas como **Regras do React**. Elas são regras – e não apenas diretrizes – no sentido de que, se forem violadas, seu app provavelmente terá erros. Seu código também se torna não idiomático e mais difícil de entender e raciocinar.

Recomendamos fortemente o uso do [Strict Mode](/reference/react/StrictMode) junto com o [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) do React para ajudar seu codebase a seguir as Regras do React. Ao seguir as Regras do React, você poderá encontrar e resolver esses erros e manter sua aplicação sustentável.

---

## Components and Hooks must be pure {/*components-and-hooks-must-be-pure*/}

[Purity in Components and Hooks](/reference/rules/components-and-hooks-must-be-pure) é uma regra chave do React que torna seu app previsível, fácil de depurar e permite que o React otimize automaticamente seu código.

*   [Components must be idempotent](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Componentes React são assumidos para sempre retornar a mesma saída com relação às suas entradas – props, state e context.
*   [Side effects must run outside of render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Side effects não devem ser executados em render, pois o React pode renderizar componentes várias vezes para criar a melhor experiência de usuário possível.
*   [Props and state are immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – As props e o state de um componente são snapshots imutáveis com relação a um único render. Nunca os mute diretamente.
*   [Return values and arguments to Hooks are immutable](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Uma vez que os valores são passados para um Hook, você não deve modificá-los. Como props em JSX, os valores se tornam imutáveis quando passados para um Hook.
*   [Values are immutable after being passed to JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Não mute valores depois que eles forem usados em JSX. Mova a mutação antes da criação do JSX.

---

## React calls Components and Hooks {/*react-calls-components-and-hooks*/}

[React is responsible for rendering components and hooks when necessary to optimize the user experience.](/reference/rules/react-calls-components-and-hooks) É declarativo: você diz ao React o que renderizar na lógica do seu componente, e o React descobrirá a melhor forma de exibí-lo para o seu usuário.

*   [Never call component functions directly](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Componentes só devem ser usados em JSX. Não os chame como funções regulares.
*   [Never pass around hooks as regular values](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hooks só devem ser chamados dentro de componentes. Nunca o passe como um valor regular.

---

## Rules of Hooks {/*rules-of-hooks*/}

Hooks são definidos usando funções JavaScript, mas eles representam um tipo especial de lógica de UI reutilizável com restrições sobre onde podem ser chamados. Você precisa seguir as [Rules of Hooks](/reference/rules/rules-of-hooks) ao usá-los.

*   [Only call Hooks at the top level](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Não chame Hooks dentro de loops, condições ou funções aninhadas. Em vez disso, sempre use Hooks no nível superior da sua função React, antes de quaisquer retornos antecipados.
*   [Only call Hooks from React functions](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Não chame Hooks de funções JavaScript regulares.