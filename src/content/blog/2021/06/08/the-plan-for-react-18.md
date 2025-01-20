---
title: "O Plano para o React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, e Seth Webster
date: 2021/06/08
description: A equipe do React está animada para compartilhar algumas atualizações. Começamos a trabalhar na versão 18 do React, que será nossa próxima versão principal. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18. Publicamos um Alpha do React 18 para que autores de bibliotecas possam experimentá-lo e fornecer feedback...
---

8 de junho de 2021 por [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

A equipe do React está animada para compartilhar algumas atualizações:

1. Começamos a trabalhar na versão 18 do React, que será nossa próxima versão principal.
2. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18.
3. Publicamos um Alpha do React 18 para que autores de bibliotecas possam experimentá-lo e fornecer feedback.

Essas atualizações são direcionadas principalmente a mantenedores de bibliotecas de terceiros. Se você está aprendendo, ensinando ou usando o React para construir aplicações voltadas para o usuário, pode ignorar este post com segurança. Mas você é bem-vindo para acompanhar as discussões no Grupo de Trabalho do React 18 se tiver curiosidade!

---

</Intro>

## O que vem por aí no React 18 {/*whats-coming-in-react-18*/}

Quando for lançado, o React 18 incluirá melhorias prontas para uso (como [agrupamento automático](https://github.com/reactwg/react-18/discussions/21)), novas APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)), e um [novo renderizador de servidor em streaming](https://github.com/reactwg/react-18/discussions/37) com suporte embutido para `React.lazy`.

Esses recursos são possíveis graças a um novo mecanismo opt-in que estamos adicionando no React 18. Chama-se “renderização concorrente” e permite que o React prepare várias versões da interface do usuário ao mesmo tempo. Essa mudança é principalmente nos bastidores, mas desbloqueia novas possibilidades para melhorar tanto o desempenho real quanto o percebido de sua aplicação.

Se você tem acompanhado nossa pesquisa sobre o futuro do React (não esperamos que você faça isso!), pode ter ouvido falar de algo chamado “modo concorrente” ou que isso poderia quebrar sua aplicação. Em resposta a esse feedback da comunidade, redesenhamos a estratégia de atualização para a adoção gradual. Em vez de um “modo” tudo ou nada, a renderização concorrente será ativada apenas para atualizações acionadas por um dos novos recursos. Na prática, isso significa **que você poderá adotar o React 18 sem reescritas e experimentar os novos recursos no seu próprio ritmo.**

## Uma estratégia de adoção gradual {/*a-gradual-adoption-strategy*/}

Como a concorrência no React 18 é opt-in, não há mudanças significativas de quebra de comportamento dos componentes prontas para uso. **Você pode atualizar para o React 18 com mudanças mínimas ou nenhuma em seu código de aplicação, com um esforço comparável ao de uma versão principal típica do React**. Com base em nossa experiência convertendo várias aplicações para o React 18, esperamos que muitos usuários consigam atualizar em uma única tarde.

Conseguimos enviar recursos concorrentes para dezenas de milhares de componentes no Facebook, e em nossa experiência, descobrimos que a maioria dos componentes React “funciona” sem mudanças adicionais. Estamos comprometidos em garantir que esta seja uma atualização tranquila para toda a comunidade, por isso hoje estamos anunciando o Grupo de Trabalho do React 18.

## Trabalhando com a comunidade {/*working-with-the-community*/}

Estamos tentando algo novo para este lançamento: convidamos um painel de especialistas, desenvolvedores, autores de bibliotecas e educadores de toda a comunidade React para participar do nosso [Grupo de Trabalho do React 18](https://github.com/reactwg/react-18) para fornecer feedback, fazer perguntas e colaborar no lançamento. Não conseguimos convidar todos que queríamos para este grupo inicial e pequeno, mas se esse experimento funcionar, esperamos que haja mais oportunidades no futuro!

**O objetivo do Grupo de Trabalho do React 18 é preparar o ecossistema para uma adoção gradual e tranquila do React 18 por aplicações e bibliotecas existentes.** O Grupo de Trabalho está hospedado no [GitHub Discussions](https://github.com/reactwg/react-18/discussions) e está disponível para o público ler. Membros do grupo de trabalho podem deixar feedback, fazer perguntas e compartilhar ideias. A equipe principal também usará o repositório de discussões para compartilhar nossas descobertas de pesquisa. À medida que a versão estável se aproxima, quaisquer informações importantes também serão postadas neste blog.

Para mais informações sobre a atualização para o React 18, ou recursos adicionais sobre o lançamento, veja o [post de anúncio do React 18](https://github.com/reactwg/react-18/discussions/4).

## Acessando o Grupo de Trabalho do React 18 {/*accessing-the-react-18-working-group*/}

Todos podem ler as discussões no [repositório do Grupo de Trabalho do React 18](https://github.com/reactwg/react-18).

Como esperamos um aumento inicial de interesse no Grupo de Trabalho, apenas membros convidados poderão criar ou comentar em tópicos. No entanto, os tópicos são totalmente visíveis ao público, de modo que todos têm acesso às mesmas informações. Acreditamos que isso é um bom compromisso entre criar um ambiente produtivo para os membros do grupo de trabalho, ao mesmo tempo em que mantemos transparência com a comunidade em geral.

Como sempre, você pode enviar relatórios de bugs, perguntas e feedback geral para o nosso [rastreador de problemas](https://github.com/facebook/react/issues).

## Como experimentar o React 18 Alpha hoje {/*how-to-try-react-18-alpha-today*/}

Novos alphas são [publicados regularmente no npm usando a tag `@alpha`](https://github.com/reactwg/react-18/discussions/9). Esses lançamentos são construídos usando o commit mais recente de nosso repositório principal. Quando um recurso ou correção de bug é mesclado, ele aparecerá em um alpha no dia útil seguinte.

Pode haver mudanças comportamentais ou de API significativas entre os lançamentos alfa. Por favor, lembre-se de que **lançamentos alfa não são recomendados para aplicações de produção voltadas para o usuário**.

## Cronograma projetado para o lançamento do React 18 {/*projected-react-18-release-timeline*/}

Não temos uma data de lançamento específica agendada, mas esperamos que leve vários meses de feedback e iteração antes que o React 18 esteja pronto para a maioria das aplicações de produção.

* Biblioteca Alpha: Disponível hoje
* Beta Pública: Pelo menos vários meses
* Release Candidate (RC): Pelo menos várias semanas após a Beta
* Disponibilidade Geral: Pelo menos várias semanas após a RC

Mais detalhes sobre nosso cronograma de lançamento projetado estão [disponíveis no Grupo de Trabalho](https://github.com/reactwg/react-18/discussions/9). Faremos postagens de atualizações neste blog quando estivermos mais próximos de um lançamento público.