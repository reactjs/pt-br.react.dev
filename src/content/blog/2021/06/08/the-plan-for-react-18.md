---
title: "O Plano para React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: A equipe do React está animada para compartilhar algumas atualizações. Começamos a trabalhar na versão React 18, que será nossa próxima versão principal. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18. Publicamos um React 18 Alpha para que os autores de bibliotecas possam testá-lo e fornecer feedback...
---

8 de junho de 2021 por [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

A equipe do React está animada para compartilhar algumas atualizações:

1. Começamos a trabalhar na versão React 18, que será nossa próxima versão principal.
2. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18.
3. Publicamos um React 18 Alpha para que os autores de bibliotecas possam testá-lo e fornecer feedback.

Estas atualizações são voltadas principalmente para os mantenedores de bibliotecas de terceiros. Se você está aprendendo, ensinando ou usando `o React` para construir aplicações voltadas para o usuário, pode ignorar esta postagem com segurança. Mas você pode acompanhar as discussões no React 18 Working Group se estiver curioso!

---

</Intro>

## O que vem por aí no React 18 {/*whats-coming-in-react-18*/}

Quando for lançado, `o React` 18 incluirá melhorias prontas para uso (como [automatic batching](https://github.com/reactwg/react-18/discussions/21)), novas APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)) e um [novo streaming server renderer](https://github.com/reactwg/react-18/discussions/37) com suporte integrado para `React.lazy`.

Esses recursos são possíveis graças a um novo mecanismo de opt-in que estamos adicionando no `React` 18. Ele é chamado de "renderização concorrente" e permite que `o React` prepare várias versões da UI ao mesmo tempo. Essa mudança está principalmente nos bastidores, mas desbloqueia novas possibilidades para melhorar tanto o desempenho real quanto o percebido de seu app.

Se você acompanhou nossa pesquisa sobre o futuro do `React` (não esperamos que você o faça!), pode ter ouvido falar de algo chamado "modo concorrente" ou que ele pode quebrar seu app. Em resposta a esse feedback da comunidade, redesenhamos a estratégia de atualização para adoção gradual. Em vez de um "modo" de tudo ou nada, a renderização concorrente será habilitada apenas para atualizações acionadas por um dos novos recursos. Na prática, isso significa que **você poderá adotar `o React` 18 sem reescritas e experimentar os novos recursos no seu próprio ritmo.**

## Uma estratégia de adoção gradual {/*a-gradual-adoption-strategy*/}

Como a concorrência no `React` 18 é opt-in, não há mudanças significativas de última hora no comportamento do componente. **Você pode atualizar para o `React` 18 com o mínimo ou nenhuma alteração no código do seu aplicativo, com um nível de esforço comparável a uma versão principal típica do `React`**. Com base em nossa experiência na conversão de vários apps para `React` 18, esperamos que muitos usuários consigam atualizar em uma única tarde.

Enviamos com sucesso recursos concorrentes para dezenas de milhares de componentes no Facebook e, em nossa experiência, descobrimos que a maioria dos componentes `React` "simplesmente funciona" sem alterações adicionais. Estamos comprometidos em garantir que esta seja uma atualização tranquila para toda a comunidade, então hoje estamos anunciando o React 18 Working Group.

## Trabalhando com a comunidade {/*working-with-the-community*/}

Estamos tentando algo novo para este lançamento: Convidamos um painel de especialistas, desenvolvedores, autores de biblioteca e educadores de toda a comunidade `React` para participar de nosso [React 18 Working Group](https://github.com/reactwg/react-18) para fornecer feedback, fazer perguntas e colaborar no lançamento. Não pudemos convidar todos que queríamos para este pequeno grupo inicial, mas se este experimento der certo, esperamos que haja mais no futuro!

**O objetivo do React 18 Working Group é preparar o ecossistema para uma adoção suave e gradual do `React` 18 por aplicativos e bibliotecas existentes.** O Working Group é hospedado no [GitHub Discussions](https://github.com/reactwg/react-18/discussions) e está disponível para leitura pública. Os membros do grupo de trabalho podem deixar feedback, fazer perguntas e compartilhar ideias. A equipe principal também usará o repositório de discussões para compartilhar nossas descobertas de pesquisa. À medida que o lançamento estável se aproxima, qualquer informação importante também será postada neste blog.

Para obter mais informações sobre como atualizar para `o React` 18 ou recursos adicionais sobre o lançamento, consulte a [postagem de anúncio do `React` 18](https://github.com/reactwg/react-18/discussions/4).

## Acessando o React 18 Working Group {/*accessing-the-react-18-working-group*/}

Todos podem ler as discussões no [repositório do React 18 Working Group](https://github.com/reactwg/react-18).

Como esperamos um aumento inicial de interesse no Grupo de Trabalho, apenas os membros convidados poderão criar ou comentar em tópicos. No entanto, os tópicos são totalmente visíveis ao público, para que todos tenham acesso às mesmas informações. Acreditamos que este é um bom compromisso entre a criação de um ambiente produtivo para os membros do grupo de trabalho, mantendo a transparência com a comunidade em geral.

Como sempre, você pode enviar relatórios de erros, perguntas e feedback geral para nosso [rastreador de problemas](https://github.com/facebook/react/issues).

## Como experimentar o React 18 Alpha hoje {/*how-to-try-react-18-alpha-today*/}

Novos alphas são [publicados regularmente no npm usando a tag `@alpha`](https://github.com/reactwg/react-18/discussions/9). Esses lançamentos são construídos usando o commit mais recente em nosso repositório principal. Quando um recurso ou correção de bug é mesclado, ele aparecerá em um alpha no dia útil seguinte.

Pode haver alterações significativas de comportamento ou API entre os lançamentos alpha. Lembre-se que **lançamentos alpha não são recomendados para aplicações voltadas para o usuário, em produção**.

## Cronograma projetado de lançamento do React 18 {/*projected-react-18-release-timeline*/}

Não temos uma data de lançamento específica agendada, mas esperamos que leve vários meses de feedback e iteração antes que `o React` 18 esteja pronto para a maioria dos aplicativos de produção.

* Library Alpha: Disponível hoje
* Public Beta: Pelo menos vários meses
* Release Candidate (RC): Pelo menos várias semanas após o Beta
* General Availability: Pelo menos várias semanas após o RC

Mais detalhes sobre nosso cronograma de lançamento projetado estão [disponíveis no Working Group](https://github.com/reactwg/react-18/discussions/9). Postaremos atualizações neste blog quando estivermos mais próximos de um lançamento público.