---
title: "Novo Esquema de Versão"
author: [sebmarkbage]
---

Hoje anunciamos que estamos mudando para as principais revisões do React. A versão atual é 0.14.7. A próxima release será: **15.0.0**

Na prática, esta mudança não deve afetar a maioria de vocês. A mudança para as principais versões do SemVer simplesmente ajuda a indicar o nosso compromisso para com a estabilidade e nos dá a flexibilidade para adicionar novos recursos em releases menores que sejam compatíveis com as versões anteriores. Isso significa que nós podemos ter menos releases principais e você não precisará esperar tanto tempo para desfrutar das melhorias do React. Além disso, se você é um autor de componente, este esquema de versão te dá a flexibilidade para suportar duas versões principais do React ao mesmo tempo, para que você não precise deixar nada para trás.

O core da API do React se mantém estável há anos. Nossos negócios, assim como muitos de vocês, dependem fortemente do uso do React como parte essencial da nossa infraestrutura. Também estamos comprometidos com a estabilidade e o progresso do React daqui em diante.

## Juntar Todo Mundo {#bring-everyone-along}

React não é apenas uma biblioteca, mas um ecossistema. Sabemos que os seus e os nossos aplicativos não são apenas ilhas isoladas de código. É uma rede com seu próprio código de aplicativo, seus próprios componentes de código aberto e bibliotecas de terceiros que dependem do React.

<img src="../images/blog/versioning-1.png" width="403">

Portanto, é importante que não só atualizemos nossos próprios códigos base como também incluamos a comunidade inteira conosco. Nós levamos o caminho da atualização muito a sério - para todos.

<img src="../images/blog/versioning-poll.png" width="596">

## Introduzindo Releases Menores {#introducing-minor-releases}

Idealmente, todos poderiam depender da versão mais recente do React o tempo todo.

<img src="../images/blog/versioning-2.png" width="463">

Sabemos que na prática isso não é possível. No futuro, nós esperamos mais novas APIs aditivas em vez da quebra das que já existem. Ao passar para as revisões principais no esquema do SemVer, nós podemos lançar novas versões sem quebrar as existentes. 

<img src="../images/blog/versioning-3.png" width="503">

Isso significa que, se um componente precisa de uma API nova, não é necessário que nenhum dos outros componentes faça qualquer trabalho adicional. Eles permanecem compatíveis.

## O que Aconteceu com o 1.0.0? {#what-happened-to-100}

Parte do crescimento e da popularidade do React é que ele é estável e tem um bom desempenho em produção. As pessoas perguntaram há muito tempo qual seria a aparência do React v1.0. Tecnicamente, algumas mudanças são importantes para evitar estagnação, mas ainda conseguimos estabilidade, tornando fácil a atualização. Se os números da versão principal indicarem estabilidade e gerar confiança que possa ser usada em produção, então chegamos lá há muito tempo. Há também muito preconceito sobre o que é a v1.0. Ainda estamos seguindo o SemVer. Nós estamos apenas comunicando estabilidade movendo o 0 do começo ao fim.

## Quebra de Código {#breaking-changes}

Releases de revisão menores conterão avisos de depreciação e dicas de como atualizar uma API ou padrões que serão removidos ou mudados no futuro.

Continuaremos a lançar [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) para padrões comuns, afim de tornar fácil as atualizações automáticas da sua base de código.

Uma vez que alcancemos o fim da vida útil de uma versão principal específica, lançaremos uma nova versão principal onde todas as APIs depreciadas terão sido removidas.

## Evitando o Maior Obstáculo {#avoiding-the-major-cliff}

Se você tentar atualizar seu componente para 16.0.0 você poderá achar que sua aplicação não funcionará mais se você ainda tiver outras depedências. E.g. se os componentes de Ryan e Jed forem compatíveis apenas com 15.x.x.

<img src="../images/blog/versioning-4.png" width="498">

No pior dos casos, você retorna a sua aplicação para 15.1.0. Desde que você queira usar seu componente, você também poderá revertê-lo.

<img src="../images/blog/versioning-5.png" width="493">

Claro, Ryan e Jed pensam da mesma maneira. Se não formos cuidadosos, podemos atingir um ponto onde ninguém atualiza. Isso já aconteceu com muitos ecossistemas de projetos de software no passado.

Portanto, estamos comprometidos em tornar isso fácil para a maioria dos componentes e bibliotecas construídas em cima do React para que possam ser compatíveis com duas versões principais ao mesmo tempo. Iremos fazer isso introduzindo novas APIs antes da remover completamente as antigas, assim evitando esses obstáculos.

<img src="../images/blog/versioning-6.png" width="493">
