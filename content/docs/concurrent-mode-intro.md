---
id: concurrent-mode-intro
title: Introdução ao Modo Concorrente (Experimental)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

>Cuidado:
>
>Esta página descreve os recursos **experimentais que ainda [não estão disponíveis](/docs/concurrent-mode-adoption.html) em uma versão estável**. Não confie nas versões experimentais do React em aplicativos de produção. Esses recursos podem mudar significativamente e sem aviso antes de se tornarem parte do React.
>
>Esta documentação é destinada a adotante precoces e pessoas curiosas. Se você é novo no Rect, não se preocupe com esses recursos -- não precisa aprendê-los agora.

Esta página fornece uma visão geral teórica do Modo Concorrente. **Para uma introdução mais prática, consulte as próximas seções:**

* [Suspense Para Busca de Dados](/docs/concurrent-mode-suspense.html) describes a new mechanism for fetching data in React components.
* [Padrões de UI Concorrente](/docs/concurrent-mode-patterns.html) shows some UI patterns made possible by Concurrent Mode and Suspense.
* [Adotando o Modo Concorrente](/docs/concurrent-mode-adoption.html) explains how you can try Concurrent Mode in your project.
* [Referência da API do Modo Concorrente](/docs/concurrent-mode-reference.html) documents the new APIs available in experimental builds.

## O Que é o Modo Concorrente? {#what-is-concurrent-mode}

O Modo Concorrente é um conjunto de novos recursos que ajudam os aplicativos React a permanecerem responsivos e a se ajustarem normalmente aos recursos do dispositivo do usuário e à velocidade da rede.

Esses recursos ainda são experimentais e estão sujeitos a alterações. Eles ainda não fazem parte de uma versão estável do React, mas você pode experimentá-los em uma versão experimental.

## Bloqueio vs Renderização Interrompida {#blocking-vs-interruptible-rendering}

**Para explicar o Modo Concorrente, usaremos o controle de versão como uma metáfora.** Se você trabalha em equipe, provavelmente usa um sistema de controle de versão como o Git e trabalha em branchs. Quando uma branch estiver pronta, você poderá dar merge do seu trabalho na master(branch principal), para que outras pessoas possam puxa-las(pull).

Antes da existência do controle de versão, o fluxo de trabalho de desenvolvimento era muito diferente. Não havia conceito de branchs. Se você quiser editar alguns arquivos, precisará dizer a todos para não tocarem nesses arquivos até que você termine seu trabalho. Você não podia nem começar a trabalhar neles simultaneamente com essa pessoa - você estava literalmente *bloqueado* por ela.

Isso ilustra como as bibliotecas de UI, incluindo React, normalmente funcionam hoje. Depois que eles começam a renderizar uma atualização, incluindo a criação de novos nós do DOM e a execução do código nos componentes, eles não podem interromper esse trabalho. Vamos chamar essa abordagem de "bloqueio de renderização".

Em Modo Concorrente, a renderização não está bloqueando. É interruptível. Isso melhora a experiência do usuário. Também desbloqueia novos recursos que antes não eram possíveis. Antes de examinarmos exemplos concretos nos [próximos](/docs/concurrent-mode-suspense.html) [capítulos](/docs/concurrent-mode-patterns.html), faremos uma visão geral de alto nível dos novos recursos.

### Interruptible Rendering {#interruptible-rendering}

Consider a filterable product list. Have you ever typed into a list filter and felt that it stutters on every key press? Some of the work to update the product list might be unavoidable, such as creating new DOM nodes or the browser performing layout. However, *when* and *how* we perform that work plays a big role.

A common way to work around the stutter is to "debounce" the input. When debouncing, we only update the list *after* the user stops typing. However, it can be frustrating that the UI doesn't update while we're typing. As an alternative, we could "throttle" the input, and update the list with a certain maximum frequency. But then on lower-powered devices we'd still end up with stutter. Both debouncing and throttling create a suboptimal user experience.

The reason for the stutter is simple: once rendering begins, it can't be interrupted. So the browser can't update the text input right after the key press. No matter how good a UI library (such as React) might look on a benchmark, if it uses blocking rendering, a certain amount of work in your components will always cause stutter. And, often, there is no easy fix.

**Concurrent Mode fixes this fundamental limitation by making rendering interruptible.** This means when the user presses another key, React doesn't need to block the browser from updating the text input. Instead, it can let the browser paint an update to the input, and then continue rendering the updated list *in memory*. When the rendering is finished, React updates the DOM, and changes are reflected on the screen.

Conceptually, you can think of this as React preparing every update "on a branch". Just like you can abandon work in branches or switch between them, React in Concurrent Mode can interrupt an ongoing update to do something more important, and then come back to what it was doing earlier. This technique might also remind you of [double buffering](https://wiki.osdev.org/Double_Buffering) in video games.

Concurrent Mode techniques reduce the need for debouncing and throttling in UI. Because rendering is interruptible, React doesn't need to artificially *delay* work to avoid stutter. It can start rendering right away, but interrupt this work when needed to keep the app responsive.

### Intentional Loading Sequences {#intentional-loading-sequences}

We've said before that Concurrent Mode is like React working "on a branch". Branches are useful not only for short-term fixes, but also for long-running features. Sometimes you might work on a feature, but it could take weeks before it's in a "good enough state" to merge into master. This side of our version control metaphor applies to rendering too.

Imagine we're navigating between two screens in an app. Sometimes, we might not have enough code and data loaded to show a "good enough" loading state to the user on the new screen. Transitioning to an empty screen or a large spinner can be a jarring experience. However, it's also common that the necessary code and data doesn't take too long to fetch. **Wouldn't it be nicer if React could stay on the old screen for a little longer, and "skip" the "bad loading state" before showing the new screen?**

While this is possible today, it can be difficult to orchestrate. In Concurrent Mode, this feature is built-in. React starts preparing the new screen in memory first — or, as our metaphor goes, "on a different branch". So React can wait before updating the DOM so that more content can load. In Concurrent Mode, we can tell React to keep showing the old screen, fully interactive, with an inline loading indicator. And when the new screen is ready, React can take us to it.

### Concurrency {#concurrency}

Let's recap the two examples above and see how Concurrent Mode unifies them. **In Concurrent Mode, React can work on several state updates *concurrently*** — just like branches let different team members work independently:

* For CPU-bound updates (such as creating DOM nodes and running component code), concurrency means that a more urgent update can "interrupt" rendering that has already started.
* For IO-bound updates (such as fetching code or data from the network), concurrency means that React can start rendering in memory even before all the data arrives, and skip showing jarring empty loading states.

Importantly, the way you *use* React is the same. Concepts like components, props, and state fundamentally work the same way. When you want to update the screen, you set the state.

React uses a heuristic to decide how "urgent" an update is, and lets you adjust it with a few lines of code so that you can achieve the desired user experience for every interaction.

## Putting Research into Production {#putting-research-into-production}

There is a common theme around Concurrent Mode features. **Its mission is to help integrate the findings from the Human-Computer Interaction research into real UIs.**

For example, research shows that displaying too many intermediate loading states when transitioning between screens makes a transition feel *slower*. This is why Concurrent Mode shows new loading states on a fixed "schedule" to avoid jarring and too frequent updates.

Similarly, we know from research that interactions like hover and text input need to be handled within a very short period of time, while clicks and page transitions can wait a little longer without feeling laggy. The different "priorities" that Concurrent Mode uses internally roughly correspond to the interaction categories in the human perception research.

Teams with a strong focus on user experience sometimes solve similar problems with one-off solutions. However, those solutions rarely survive for a long time, as they're hard to maintain. With Concurrent Mode, our goal is to bake the UI research findings into the abstraction itself, and provide idiomatic ways to use them. As a UI library, React is well-positioned to do that.

## Next Steps {#next-steps}

Now you know what Concurrent Mode is all about!

On the next pages, you'll learn more details about specific topics:

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) describes a new mechanism for fetching data in React components.
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) shows some UI patterns made possible by Concurrent Mode and Suspense.
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) explains how you can try Concurrent Mode in your project.
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) documents the new APIs available in experimental builds.
