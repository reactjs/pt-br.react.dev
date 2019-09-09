---
id: faq-internals
title: Virtual DOM e Objetos Internos
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### O que é o Virtual DOM? {#what-is-the-virtual-dom}

O virtual DOM (VDOM) é um conceito de programação onde uma representação ideal, ou "virtual", da interface do usuário é mantida em memória e sincronizada com o DOM "real" por uma biblioteca como o ReactDOM. Esse processo é chamado de [reconciliação](/docs/reconciliation.html).

Essa abordagem permite a API declarativa do React: Você diz ao React qual o state que você quer que a interface do usuário esteja, e ele garante que o DOM seja igual ao state. Isso abstrai a manipulação de atributos, manipulação de eventos e atualização manual do DOM que, caso ao contrario, você teria que usar para construir o seu app.

Dado que "virtual DOM" é mais um padrão do que uma tecnologia específica, as pessoas às vezes o citam querendo dizer coisas diferentes. No mundo do React, o termo "virtual DOM" é geralmente associado aos [Elementos do React](/docs/rendering-elements.html) uma vez que eles são objetos representando a interface do usuário. O React, contudo, também usa objetos internos chamados "fibers" para conter informações adicionais sobre a árvore de componentes. Eles também podem ser considerados parte da implementação do "virtual DOM" no React.

### O Shadow DOM é a mesma coisa que o Virtual DOM? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

Não, eles são diferentes. O Shadow DOM é uma tecnologia do navegador desenhada principalmente para conter variáveis e CSS no escopo dos web components. O virtual DOM é um conceito implementado por bibliotecas em JavaScript em cima das APIs do navegador.

### O que é "React Fiber"? {#what-is-react-fiber}

Fiber é um novo motor de reconciliação no React 16. Seu objetivo principal é habilitar renderização incremental no virtual DOM. [Leia mais](https://github.com/acdlite/react-fiber-architecture).
