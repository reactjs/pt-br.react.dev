---
title: "O Plano para React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: A equipe do React está animada para compartilhar algumas atualizações. Começamos a trabalhar na versão React 18, que será nossa próxima versão principal. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18. Publicamos uma versão Alpha do React 18 para que os autores de bibliotecas possam experimentá-la e fornecer feedback...
---

8 de junho de 2021 por [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

A equipe do React está animada para compartilhar algumas atualizações:

1. Começamos a trabalhar na versão React 18, que será nossa próxima versão principal.
2. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18.
3. Publicamos uma versão Alpha do React 18 para que os autores de bibliotecas possam experimentá-la e fornecer *feedback*.

Essas atualizações são direcionadas principalmente aos *maintainers* de bibliotecas de terceiros. Se você está aprendendo, ensinando ou usando o React para construir aplicações voltadas para o usuário, você pode ignorar esta publicação com segurança. Mas você está convidado a acompanhar as discussões no Grupo de Trabalho do React 18 se estiver curioso!

---

</Intro>

## O que vem no React 18 {/*whats-coming-in-react-18*/}

Quando for lançado, o React 18 incluirá melhorias prontas para uso (como [ *automatic batching*](https://github.com/reactwg/react-18/discussions/21)), novas APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)), e um [novo *streaming server renderer*](https://github.com/reactwg/react-18/discussions/37) com suporte integrado para `React.lazy`.

Esses recursos são possíveis graças a um novo mecanismo de *opt-in* que estamos adicionando no React 18. Ele é chamado de "renderização concorrente" e permite que o React prepare várias versões da UI ao mesmo tempo. Essa mudança está principalmente nos bastidores, mas ela abre novas possibilidades para melhorar o desempenho real e percebido do seu *app*.

Se você está acompanhando nossas pesquisas sobre o futuro do React (não esperamos que você acompanhe!), talvez já tenha ouvido falar em algo chamado "modo concorrente" ou que isso possa quebrar seu *app*. Em resposta a esse *feedback* da comunidade, redesenhamos a estratégia de *upgrade* para adoção gradual. Em vez de um “modo” de tudo ou nada, a renderização concorrente será habilitada apenas para atualizações acionadas por um dos novos recursos. Na prática, isso significa que **você poderá adotar o React 18 sem reescritas e experimentar os novos recursos no seu próprio ritmo.**

## Uma estratégia de adoção gradual {/*a-gradual-adoption-strategy*/}

Como a concorrência no React 18 é *opt-in*, não há mudanças significativas e imediatas que quebrem o comportamento do componente. **Você pode atualizar para o React 18 com o mínimo ou nenhuma mudança no código da sua aplicação, com um esforço comparável ao de um lançamento principal típico do React**. Com base em nossa experiência na conversão de vários *apps* para React 18, esperamos que muitos usuários possam atualizar em uma única tarde.

Nós enviamos com sucesso recursos de concorrência para dezenas de milhares de componentes no Facebook e, em nossa experiência, descobrimos que a maioria dos componentes do React "simplesmente funciona" sem alterações adicionais. Estamos comprometidos em garantir que essa seja uma atualização tranquila para toda a comunidade, por isso estamos anunciando hoje o React 18 Working Group.

## Trabalhando com a comunidade {/*working-with-the-community*/}

Estamos tentando algo novo para este lançamento: Convidamos um painel de especialistas, desenvolvedores, autores de bibliotecas e educadores de toda a comunidade React para participar do nosso [React 18 Working Group](https://github.com/reactwg/react-18) para fornecer *feedback*, fazer perguntas e colaborar no lançamento. Não pudemos convidar todos que queríamos para este grupo inicial e pequeno, mas se este experimento funcionar, esperamos que haja mais no futuro!

**O objetivo do React 18 Working Group é preparar o ecossistema para uma adoção suave e gradual do React 18 pelas aplicações e bibliotecas existentes.**  O Working Group é hospedado no [GitHub Discussions](https://github.com/reactwg/react-18/discussions) e está disponível para leitura pública. Membros do grupo de trabalho podem deixar *feedback*, fazer perguntas e compartilhar ideias. A equipe principal também usará o repositório de discussões para compartilhar nossas descobertas de pesquisa. À medida que o lançamento estável se aproxima, qualquer informação importante também será postada neste *blog*.

Para obter mais informações sobre como atualizar para o React 18 ou recursos adicionais sobre o lançamento, consulte a [publicação de anúncio do React 18](https://github.com/reactwg/react-18/discussions/4).

## Acessando o React 18 Working Group {/*accessing-the-react-18-working-group*/}

Todos podem ler as discussões no [repositório do React 18 Working Group](https://github.com/reactwg/react-18).

Como esperamos um aumento inicial de interesse no Working Group, apenas membros convidados poderão criar ou comentar *threads*. No entanto, os *threads* são totalmente visíveis ao público, para que todos tenham acesso às mesmas informações. Acreditamos que este é um bom compromisso entre a criação de um ambiente produtivo para os membros do grupo de trabalho, mantendo a transparência com a comunidade em geral.

Como sempre, você pode enviar relatórios de *bug*, perguntas e *feedback* geral para nossa [ferramenta de *issue*](https://github.com/facebook/react/issues).

## Como experimentar o React 18 Alpha hoje {/*how-to-try-react-18-alpha-today*/}

Novas versões *alpha* são [publicadas regularmente no npm usando a tag `@alpha`](https://github.com/reactwg/react-18/discussions/9). Esses *releases* são construídos usando a *commit* mais recente em nosso repositório principal. Quando um recurso ou correção de *bug* é mesclado, ele aparecerá em uma versão *alpha* no dia da semana seguinte.

Pode haver mudanças significativas de comportamento ou API entre as versões *alpha*. Por favor, lembre-se que **as versões *alpha* não são recomendadas para aplicações de produção, voltadas para o usuário**.

## Cronograma de lançamento projetado do React 18 {/*projected-react-18-release-timeline*/}

Não temos uma data de lançamento específica agendada, mas esperamos que leve vários meses de *feedback* e iteração até que o React 18 esteja pronto para a maioria das aplicações de produção.

*   Library Alpha: Disponível hoje
*   Public Beta: Pelo menos vários meses
*   Release Candidate (RC): Pelo menos várias semanas após a Beta
*   General Availability: Pelo menos várias semanas após a RC

Mais detalhes sobre nosso cronograma de lançamento projetado estão [disponíveis no Working Group](https://github.com/reactwg/react-18/discussions/9). Publicaremos atualizações neste *blog* quando estivermos mais próximos de um lançamento público.
``