---
id: update
title: Auxiliares de Imutabilidade
permalink: docs/update.html
layout: docs
category: Add-Ons
---

> Nota:
>
> `update` é um add-on legado. Em vez disso, use [`immutability-helper`](https://github.com/kolodny/immutability-helper).

**Importando**

```javascript
import update from 'react-addons-update'; // ES6
var update = require('react-addons-update'); // ES5 com npm
```

## Visão geral {#overview}

O React permite que você use qualquer estilo de gerenciamento de dados que desejar, incluindo mutação. No entanto, se você puder usar dados imutáveis ​​em partes críticas de desempenho de seu aplicativo, é fácil implementar um método rápido [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) para acelerar significativamente seu aplicativo.

<<<<<<< HEAD
Lidar com dados imutáveis ​​em JavaScript é mais difícil do que em linguagens projetadas para isso, como [Clojure](https://clojure.org/). No entanto, nós fornecemos um simples auxiliar de imutabilidade, `update()`, que torna muito mais fácil lidar com esse tipo de dados, *sem* alterar fundamentalmente a forma como seus dados são representados. Você também pode dar uma olhada no Facebook [Immutable-js](https://facebook.github.io/immutable-js/docs/) e na seção de [desempenho avançado](/docs/advanced-performance.html) para obter mais detalhes sobre Immutable-js.
=======
Dealing with immutable data in JavaScript is more difficult than in languages designed for it, like [Clojure](https://clojure.org/). However, we've provided a simple immutability helper, `update()`, that makes dealing with this type of data much easier, *without* fundamentally changing how your data is represented. You can also take a look at Facebook's [Immutable-js](https://immutable-js.com/docs/latest@main/) and the [Advanced Performance](/docs/advanced-performance.html) section for more detail on Immutable-js.
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

### A ideia principal {#the-main-idea}

Se você alterar dados assim:

```js
myData.x.y.z = 7;
// ou...
myData.a.b.push(9);
```

Você não tem como determinar quais dados foram alterados desde que a cópia anterior foi substituída. Em vez disso, você precisa criar uma nova cópia de `myData` e alterar apenas as partes que precisam ser alteradas. Então você pode comparar a cópia antiga de `myData` com a nova em `shouldComponentUpdate()` usando triplos iguais:

```js
const newData = deepCopy(myData);
newData.x.y.z = 7;
newData.a.b.push(9);
```

Infelizmente, cópias profundas são custosas e às vezes impossíveis. Você pode aliviar isso copiando apenas os objetos que precisam ser alterados e reutilizando os objetos que não foram alterados. Infelizmente, no JavaScript de hoje, isso pode ser complicado:

```js
const newData = extend(myData, {
  x: extend(myData.x, {
    y: extend(myData.x.y, {z: 7}),
  }),
  a: extend(myData.a, {b: myData.a.b.concat(9)})
});
```

Embora isso tenha um bom desempenho (já que apenas faz uma cópia superficial de objetos `log n` e reutiliza o resto), é um grande trabalho escrever. Olhe para toda a repetição! Isso não é apenas irritante, mas também fornece uma grande área de superfície para bugs.

## `update()` {#update}

`update()` fornece "syntactic sugar" simples em torno deste padrão para tornar a escrita deste código mais fácil. Este código se torna:

```js
import update from 'react-addons-update';

const newData = update(myData, {
  x: {y: {z: {$set: 7}}},
  a: {b: {$push: [9]}}
});
```

Embora a sintaxe demore um pouco para se acostumar (pelo fato de ser inspirada na [linguagem de consulta do MongoDB](https://docs.mongodb.com/manual/crud/#query)), não há redundância, é estaticamente analisável e não tem muito mais digitação do que a versão mutativa.

As chaves prefixadas com `$` são chamadas de *comandos (command)*. A estrutura de dados que eles estão "mutando" é chamada de *destino (target)*.

## Comandos disponíveis {#available-commands}

  * `{$push: array}` `push()` todos os itens em `array` no destino.
  * `{$unshift: array}` `unshift()` todos os itens em `array` no destino.
  * `{$splice: array of arrays}` para cada item em `arrays` chama `splice()` no destino com os parâmetros fornecidos pelo item.
  * `{$set: any}` substitui o destino inteiramente.
  * `{$merge: object}` mescla as chaves de `object` com o destino.
  * `{$apply: function}` passa o valor atual para a função e o atualiza com o novo valor retornado.

## Exemplos {#examples}

### Push simples {#simple-push}

```js
const initialArray = [1, 2, 3];
const newArray = update(initialArray, {$push: [4]}); // => [1, 2, 3, 4]
```
`initialArray` ainda é `[1, 2, 3]`.

### Coleções aninhadas {#nested-collections}

```js
const collection = [1, 2, {a: [12, 17, 15]}];
const newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
// => [1, 2, {a: [12, 13, 14, 15]}]
```
Isso acessa o índice `2` da `collection`, chave `a`, e faz uma junção de um item começando no índice `1` (para remover `17`) enquanto insere `13` e `14`.

### Atualizando um valor com base no valor atual {#updating-a-value-based-on-its-current-one}

```js
const obj = {a: 5, b: 3};
const newObj = update(obj, {b: {$apply: function(x) {return x * 2;}}});
// => {a: 5, b: 6}
// Isso é equivalente, mas fica detalhado para coleções profundamente aninhadas:
const newObj2 = update(obj, {b: {$set: obj.b * 2}});
```

### Mesclagem (Superficial) {#shallow-merge}

```js
const obj = {a: 5, b: 3};
const newObj = update(obj, {$merge: {b: 6, c: 7}}); // => {a: 5, b: 6, c: 7}
```
