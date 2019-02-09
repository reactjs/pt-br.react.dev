---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

A maioria das propriedades de um elemento JSX são passadas para o componente. Porém, existem duas propriedades especiais (`ref` e `key`) que são usadas pelo React, e portanto não são passadas para um componente.

Por exemplo, ao tentar acessar `this.props.key` de um componente (ex: a função de renderizar ou [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) essa prop não estará definida. Caso você precise acessar o mesmo valor de dentro de um componente filho, você deve passá-lo como uma prop diferente (ex: `<ListItemWrapper key={result.id} id={result.id} />`). Por mais que isso possa parecer redundante, é importante separar a lógica da aplicação das dicas de reconciliação.
