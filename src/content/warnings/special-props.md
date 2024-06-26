---
title: Aviso sobre Props Especiais
---

A maioria das props em um elemento JSX são passadas para o componente, no entanto, há duas props especiais (`ref` and `key`) que são usadas pelo React e, portanto, não são encaminhadas para o componente.

Por exemplo, você não pode ler `props.key` de um componente. Se você precisar acessar o mesmo valor dentro do componente filho, deve passá-lo como uma prop diferente (ex: `<ListItemWrapper key={result.id} id={result.id} />` e ler `props.id`). Embora isso possa parecer redundante, é importante separar a lógica da aplicação das dicas para o React.