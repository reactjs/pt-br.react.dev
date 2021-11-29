---
title: "O plano para o React 18"
author: [acdlite, bvaughn, abernathyca, gaearon, rachelnabors, rickhanlonii, sebmarkbage, sethwebster]
---

<<<<<<< HEAD
O time do React está animado para compartilhar algumas atualizações:
=======
> Update Nov. 15th, 2021
>
> React 18 is now in beta. More information about the status of the release is [available in the React 18 Working Group post](https://github.com/reactwg/react-18/discussions/112).

The React team is excited to share a few updates:
>>>>>>> 0057efa12c1aa2271ef80d7a84d622732bdfa85c

1. Começamos a trabalhar no lançamento do React 18, que será nossa próxima versão principal.
2. Criamos um Grupo de Trabalho para preparar a comunidade para a adoção gradual de novos recursos no React 18.
3. Publicamos um Alpha do React 18 para que os autores de bibliotecas possam testá-lo e fornecer feedback.

Essas atualizações são destinadas principalmente aos mantenedores de bibliotecas de terceiros. Se você está aprendendo, ensinando ou usando o React para criar aplicações voltadas para o usuário, pode seguramente ignorar este post. Mas você é bem vindo para acompanhar as discussões no Grupo de Trabalho React 18 se estiver curioso!

## O que está chegando no React 18

Quando for lançado, o React 18 incluirá melhorias prontas para uso (como [lote automático](https://github.com/reactwg/react-18/discussions/21)), novas APIs (como [`startTransition`](https://github.com/reactwg/react-18/discussions/41)) e um [novo renderizador de servidor de streaming](https://github.com/reactwg/react-18/discussions/37) com suporte integrado para `React.lazy`.

Esses recursos são possíveis graças a um novo mecanismo opcional que estamos adicionando no React 18. É chamado de “renderização concorrente” e permite que o React prepare várias versões da UI ao mesmo tempo. Essa mudança ocorre principalmente nos bastidores, mas abre novas possibilidades para melhorar o desempenho real e percebido de sua aplicação.

Se você tem acompanhado nossa pesquisa sobre o futuro do React (não esperamos que você faça isso!), você pode ter ouvido falar de algo chamado “modo concorrente” ou que esse modo pode quebrar sua aplicação. Em resposta a este feedback da comunidade, reformulamos a estratégia de atualização para uma adoção gradual. Em vez de um “modo” tudo ou nada, a renderização concorrente só será habilitada para atualizações acionadas por um dos novos recursos. Na prática, isso significa que **você poderá adotar o React 18 sem reescrever e experimentar os novos recursos em seu próprio ritmo.**

## Uma estratégia de adoção gradual

Como a concorrência no React 18 é opcional, não há mudanças significativas fora da caixa no comportamento de componente. **Você pode atualizar para o React 18 com o mínimo ou nenhuma alteração no código da aplicação, com um nível de esforço comparável a uma versão principal típica do React**. Com base em nossa experiência na conversão de várias aplicações para React 18, esperamos que muitos usuários sejam capazes de atualizar em uma única tarde.

Enviamos com sucesso recursos concorrentes para dezenas de milhares de componentes no Facebook e, em nossa experiência, descobrimos que a maioria dos componentes do React “simplesmente funcionam” sem alterações adicionais. Estamos empenhados em garantir que esta seja uma atualização tranquila para toda a comunidade, então hoje estamos anunciando o Grupo de Trabalho React 18.

## Trabalhando com a comunidade

Estamos tentando algo novo para este lançamento: convidamos um painel de especialistas, desenvolvedores, autores de bibliotecas e educadores de toda a comunidade React para participar de nosso [Grupo de Trabalho React 18](https://github.com/reactwg/react-18) para fornecer feedback, fazer perguntas e colaborar no lançamento. Não pudemos convidar todos que queríamos para este pequeno grupo inicial, mas se essa experiência funcionar, esperamos que haja mais no futuro!

**O objetivo do Grupo de Trabalho React 18 é preparar o ecossistema para uma adoção gradual e suave do React 18 por aplicações e bibliotecas existentes.** O Grupo de Trabalho está hospedado em [GitHub Discussions](https://github.com/reactwg/react-18/discussions) e está disponível para leitura do público. Os membros do grupo de trabalho podem deixar comentários, fazer perguntas e compartilhar ideias. O time principal também usará o repositório de discussões para compartilhar nossos resultados de pesquisa. Conforme a versão estável se aproxima, qualquer informação importante também será postada neste blog.

Para obter mais informações sobre como atualizar para o React 18 ou recursos adicionais sobre o lançamento, consulte a [postagem de anúncio do React 18](https://github.com/reactwg/react-18/discussions/4).

## Acessando o Grupo de Trabalho React 18

Todos podem ler as discussões no [repositório Grupo de Trabalho React 18](https://github.com/reactwg/react-18).

Como esperamos um aumento inicial de interesse no Grupo de Trabalho, apenas membros convidados terão permissão para criar ou comentar nos tópicos. No entanto, os tópicos são totalmente visíveis ao público, para que todos tenham acesso às mesmas informações. Acreditamos que este é um bom balanço entre a criação de um ambiente produtivo para os membros do grupo de trabalho e manter a transparência com a comunidade em geral.

Como sempre, você pode enviar relatórios de bugs, perguntas e feedback geral para nosso [rastreador de problemas](https://github.com/facebook/react/issues).

## Como experimentar o Alpha do React 18 hoje

Novos alphas são [publicados regularmente para o npm usando a tag `@alpha`](https://github.com/reactwg/react-18/discussions/9). Essas versões são criadas usando o commit mais recente de nosso repositório principal. Quando um recurso ou correção de bug é mesclado, ele aparecerá em um alpha no próximo dia útil.

Podem haver mudanças comportamentais ou de API significativas entre as versões alpha. Por favor lembre-se de que **versões alpha não são recomendadas para aplicações de produção voltados para o usuário**.

## Cronograma de lançamento projetado do React 18

Não temos uma data de lançamento específica agendada, mas esperamos que leve vários meses de feedback e iteração antes que o React 18 esteja pronto para a maioria das aplicações de produção.

* Biblioteca Alpha: disponível hoje
* Beta Público: pelo menos vários meses
* Release Candidate (RC): pelo menos várias semanas após o Beta
* Disponibilidade Geral: pelo menos várias semanas após RC

Mais detalhes sobre nosso cronograma de lançamento projetado estão [disponíveis no Grupo de Trabalho](https://github.com/reactwg/react-18/discussions/9). Publicaremos atualizações neste blog quando estivermos próximos de um lançamento público.
