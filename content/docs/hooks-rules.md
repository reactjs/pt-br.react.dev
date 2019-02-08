---
id: hook-rules
title: Regras dos Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hooks* é um novo recurso adicionado no React 16.8. Eles permitem que você use o estado (`state`) e outras funcionalidades do React, sem precisar escrever uma classe.

Hooks são funções Javascript, mas você precisa seguir duas regras ao utilizá-los. Nós providenciamos um [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) para aplicar essas regras automaticamente:

### Use Hooks apenas em nível superior {#only-call-hooks-at-the-top-level}

**Não use Hooks dentro de loops, regras condicionais ou funções aninhadas (funçoes dentro de funções).** Em vez disso, sempre use Hooks no nível superior de sua função React. Por seguir as regras, você garante que os Hooks serão chamados na mesma ordem a cada vez que o componente renderizar. É isso que permite que o React preserve corretamente o estado dos Hooks quando são usados vários `useState` e `useEffect` na mesma função. (Se você ficou curioso, iremos explicar isso melhor [abaixo](#explanation).)

### Use Hooks apenas em funções React {#only-call-hooks-from-react-functions}

**Não use Hooks em funções javascript regulares.** Em vez disso, você pode:

* ✅  Chamar Hooks em componentes React.
* ✅  Chamar Hooks dentro de Hooks Customizados (Nós iremos aprender sobre eles [na próxima página.](/docs/hooks-customizados.html)).

Por seguir essas regras, você garante que toda lógica de estado (`state`) no componente seja claramente visível no código fonte.

## ESLint Plugin

Nós liberamos um plugin ESLint chamado [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) que aplica as duas regras. Se você desejar pode adicionar este plugin ao seu projeto, dessa forma:

```bash
<code>npm install eslint-plugin-react-hooks@next</code>
```
</code>

```js
// Sua Configuração ESLint

{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```

No futuro, temos a intenção de incluir esse plugin por padrão dentro do Create React App e ferramentas similares.

**Você pode pular para próxima página, onde explica melhor como escrever [seus próprios Hooks](/docs/hooks-custom.html) agora.**. Nessa página, nós continuaremos explicando o motivo por trás dessas regras.

## Explicação {#explanation}

Assim como [aprendemos anteriormente](/docs/hooks-state.html#tip-using-multiple-state-variables), nós podemos usar muitos States ou Effects em um único componente:

```js
function Form() {
  // 1. Use o nome da variável de estado
  const [name, setName] = useState('Mary'). 

  // 2. Use um efeito para persistir o formulário
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use um sobrenome como variável de estado
  const [surname, setSurname] = useState('Poppins');

  // 4. Use um efeito para atualizar o título
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ....
}
```

Agora, como o React sabe qual o estado correspondente ao `useState` chamado? A resposta é que para o **React** depende da ordem em que os Hooks sãos chamados. Nosso exemplo funciona porque a ordem do Hook chamado é a mesma sempre que o componente é renderizado:

```js
// ------------
// Primeiro render
// ------------
useState('Mary')           // 1. Inicializa o variável de nome com 'Mary'
useEffect(persistForm)     // 2. Adiciona um efeito para persistir o formulário
useState('Poppins')        // 3. Inicializa a variável sobrenome com 'Poppins'
useEffect(updateTitle)     // 4. Adiciona um efeito para atualizar o título

// -------------
// Segundo render
// -------------
useState('Mary')           // 1. Ler o nome da variável (argumento ignorado)
useEffect(persistForm)     // 2. Substitui o efeito para persistir no formulário
useState('Poppins')        // 3. Ler a variável sobrenome (argumento ignorado)
useEffect(updateTitle)     // 4. Substitui o efeito que atualiza o título

// ...
```

Enquanto a ordem dos Hooks chamados é a mesma entre as renderizações, React pode associar um `state` local a cada um deles. Mas o que acontece se colocarmos uma chamada de Hook (por exemplo, o efeito `persistForm`) dentro de uma condição?

```js
// 🔴 Nós estaremos quebrando a primeira regra por usar um Hook dentro de uma condição

if (name !== '') {
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });
}
```

A condição `name !== ''` é `true` na primeira renderização, então chamamos o Hook dentro da condição. Entretanto, na próxima renderização o usuário pode limpar o formulário, fazendo com que a condição seja `false`. Agora que pulamos este Hook durante a primeira renderização, a ordem das chamadas tornou-se diferente, veja:

```js
useState('Mary')           // ✅  1. Lê a variável de estado (state) name (argumento é ignorado)
// useEffect(persistForm)  // 🔴  Agora, este Hook foi ignorado!
useState('Poppins')        // 🔴  Na ordem era pra ser 2 (mas foi 3). Falha ao ler a variável de estado (state) surname
useEffect(updateTitle)     // 🔴  Na ordem era pra ser 3 (mas foi 4). Falha ao substituir o efeito
```

O React não saberia o que retornar na segunda chamada do Hook `useState`. O React esperava que a segunda chamada de Hook nesse componente fosse ao efeito `persistForm`, assim como aconteceu na renderização anterior, mas a ordem foi alterada. A partir daí, toda vez que um Hook for chamado depois daquele que nós pulamos, o próximo também se deslocaria, levando a erros.

**É por isso que os Hooks devem ser chamados no nível superior de nosso componente.** Se nós queremos executar um efeito condicional, nós podemos colocar a condição _**dentro**_ de nosso Hook:

```js
useEffect(function persistForm() {
  // 👍  Legal! Agora não quebramos mais a primeira regra.
  if (name !== '') {
    localStorage.setItem('formData', name);
  }
});
```

**Note que você não precisa se preocupar com esse problema, se você usar a [regra fornecida no plugin do ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks)**. Mas agora você também sabe o *porquê* os Hooks funcionam dessa maneira, e quais os problemas que essas regras previnem.

## Próximos passos {#next-steps}

Finalmente, estamos prontos para aprender sobre como [escrever nossos próprios Hooks](/docs/hooks-custom.html)! Hooks Customizados permitem você combinar Hooks fornecidos pelo React em suas próprias abstrações, e reusar a lógica do `state` entre diferentes componentes.
