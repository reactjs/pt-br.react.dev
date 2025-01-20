---
title: Atualizando Arrays no Estado
---

<Intro>

Arrays são mutáveis em JavaScript, mas você deve tratá-los como imutáveis quando os armazena no estado. Assim como com objetos, quando você deseja atualizar um array armazenado no estado, precisa criar um novo (ou fazer uma cópia de um existente) e, em seguida, definir o estado para usar o novo array.

</Intro>

<YouWillLearn>

- Como adicionar, remover ou alterar itens em um array no estado do React
- Como atualizar um objeto dentro de um array
- Como tornar a cópia de arrays menos repetitiva com Immer

</YouWillLearn>

## Atualizando arrays sem mutação {/*updating-arrays-without-mutation*/}

Em JavaScript, arrays são apenas mais um tipo de objeto. [Assim como com objetos](/learn/updating-objects-in-state), **você deve tratar arrays no estado do React como somente leitura.** Isso significa que você não deve reatribuir itens dentro de um array como `arr[0] = 'pássaro'`, e você também não deve usar métodos que mutam o array, como `push()` e `pop()`.

Em vez disso, toda vez que você quiser atualizar um array, deve passar um *novo* array para sua função de definição de estado. Para fazer isso, você pode criar um novo array a partir do array original em seu estado chamando seus métodos não mutantes, como `filter()` e `map()`. Então você pode definir o seu estado para o novo array resultante.

Aqui está uma