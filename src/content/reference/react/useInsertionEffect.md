---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` é destinado a autores de bibliotecas CSS-em-JS. A menos que você esteja desenvolvendo em uma biblioteca CSS-em-JS e precise injetar os estilos, você provavelmente vai utilizar [`useEffect`](/reference/react/useEffect) ou [`useLayoutEffect`](/reference/react/useLayoutEffect) em vez disso.

</Pitfall>

<Intro>

O `useInsertionEffect` permite inserir elementos no DOM antes que qualquer efeito de layout seja acionado.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Chame useInsertionEffect para inserir estilos antes que quaisquer efeitos sejam ativados e que possam precisar ler o layout:

```js
import { useInsertionEffect } from 'react';

// Na sua biblioteca CSS-em-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... injetar tags <style> aqui ...
  });
  return rule;
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

* `setup`: A função que contém a lógica do seu Effect. A função de setup também pode opcionalmente retornar uma função *cleanup*. Quando o componente é adicionado ao DOM, porém antes de qualquer efeito de layout ser acionado, o React executará sua função de setup. Após cada re-renderização com as dependências alteradas, o React irá executar primeiro a função de cleanup (caso você a tenha fornecido) com os valores antigos, e depois executará sua função de setup com os novos valores. Quando o componente for removido do DOM, o React irá executar sua função de cleanup.
 
* **opcional** `dependencies`: A lista de todos os valores reativos referenciados no código `setup`. Valores reativos incluem props, state, e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Caso seu linter esteja [configurado para React](/learn/editor-setup#linting), ele irá verificar se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita em linha como `[dep1, dep2, dep3]`. O React irá comparar cada dependência com seu valor anterior utilizando o algoritmo de comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se você não especificar as dependências, seu Effect será executado novamente após cada re-renderização do componente.

#### Retornos {/*returns*/}

`useInsertionEffect` retorna `undefined`.

#### Avisos {/*caveats*/}

* Effects (efeitos) só são executados pelo cliente. Eles não são executados durante a renderização do servidor.
* Não é possível atualizar o estado de dentro do `useInsertionEffect`.
* No momento em que `useInsertionEffect` é executado, as refs ainda não foram anexadas.
* O `useInsertionEffect` pode ser utilizado antes ou depois do DOM ter sido atualizado. Você não deve confiar que o DOM seja atualizado em um determinado momento.
* Ao contrário de outros tipos de Effects, que disparam a limpeza para cada Effect e depois a configuração para cada Effect, `useInsertionEffect` irá disparar tanto a limpeza quanto a configuração de um componente de cada vez. Isso resulta em uma “intercalação” das funções de limpeza e configuração.

---

## Utilização {/*usage*/}

### Injetar os estilos dinâmicos em bibliotecas CSS-em-JS {/*injecting-dynamic-styles-from-css-em-js-libraries*/}

Tradicionalmente, você estilizaria componentes React usando CSS simples.

```js
// Em seu arquivo JS:
<button className="success" />

// Em seu arquivo CSS:
.success { color: green; }
```

Algumas equipes preferem criar estilos diretamente no código JavaScript em vez de escrever arquivos CSS. Isso geralmente requer o uso de uma biblioteca CSS-em-JS ou de alguma ferramenta. Existem três abordagens comuns para CSS-em-JS:

1. A extração estática para os arquivos CSS por um compilador
2. Estilos em linha, por exemplo, `<div style={{ opacity: 1 }}>`
3. Injeção em tempo de execução de tags `<style>`

Se utilizar CSS-em-JS, é recomendável uma combinação das duas primeiras abordagens (arquivos CSS para estilos estáticos, e estilos inline para estilos dinâmicos). **Não recomendamos a injeção de tag em tempo de execução `<style>` por duas razões:**

1. A injeção em tempo de execução obriga o navegador a recalcular os estilos com muito mais frequência.
2. A injeção em tempo de execução pode ser muito lenta se ocorrer no tempo errado no ciclo de vida do React.

O primeiro problema não tem solução, mas o `useInsertionEffect` pode ajudar a resolver o segundo problema.

Chame `useInsertionEffect` para inserir os estilos antes que quaisquer efeitos de layout sejam acionados:

```js {4-11}
// Dentro da sua biblioteca CSS-em-JS
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Como explicado anteriormente, nós não recomendamos injeção em tempo de execução de tags <style>.
    // Porém, se precisar ser feito, é importante que seja feito em useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Da mesma forma que `useEffect`, `useInsertionEffect` não é executado no servidor. Caso seja necessário coletar as regras CSS que foram utilizadas no servidor, isso pode ser feito durante a renderização:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Saiba mais sobre a atualização das bibliotecas CSS-em-JS com injeção em tempo de execução para `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Como isso é melhor do que injetar estilos durante a renderização ou useLayoutEffect? {/*how-is-this-better-than-emjecting-styles-during-rendering-or-uselayouteffect*/}

<<<<<<< HEAD
Caso insira estilos durante a renderização e o React esteja a executar uma [atualização não bloqueante,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) o navegador irá recalcular os estilos a cada frame enquanto renderiza uma estrutura de componentes, o que pode ser **extremamente lento**.
=======
If you insert styles during rendering and React is processing a [non-blocking update,](/reference/react/useTransition#perform-non-blocking-updates-with-actions) the browser will recalculate the styles every single frame while rendering a component tree, which can be **extremely slow.**
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

O `useInsertionEffect` é melhor do do que inserir estilos durante o [`useLayoutEffect`](/reference/react/useLayoutEffect) ou [`useEffect`](/reference/react/useEffect) porque ele garante que no momento em que outros efeitos forem executados em seus componentes, as tags `<style>` já estarão inseridas. Caso contrário, os cálculos de layout em Effects comuns estariam errados devido a estilos desatualizados

</DeepDive>
