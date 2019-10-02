---
title: "O React já esta traduzido? ¡Sí! Sim! はい！"
author: [tesseralis]
---

Temos o prazer de anunciar o esforço continuo para manter traduções oficiais do website de documentação do React em diferentes idiomas. Graças ao esforço dedicado dos membros da comunidade do React de todo o mundo, o React agora está sendo traduzido em *mais de 30* idiomas! Você pode acha-los na nova pagina de [Idiomas](/languages).

Além disso, as três linguagens a seguir concluíram a tradução da maioria dos documentos do React! 🎉

* **Espanhol: [es.reactjs.org](https://es.reactjs.org)**
* **Japonês: [ja.reactjs.org](https://ja.reactjs.org)**
* **Português do Brasil: [pt-br.reactjs.org](https://pt-br.reactjs.org)**

Parabéns especiais para [Alejandro Ñáñez Ortiz](https://github.com/alejandronanez), [Rainer Martínez Fraga](https://github.com/carburo), [David Morales](https://github.com/dmorales), [Miguel Alejandro Bolívar Portilla](https://github.com/Darking360), e todos os colaboradores da tradução em espanhol por serem os primeiros a *completamente* traduzirem as páginas principais da documentação!

## Por Que a Localização é Importante? {#why-localization-matters}

O React já tem muitos eventos e conferências no mundo todo, mas muitos desenvolvedores não tem o inglês como idioma principal. Gostaríamos de oferecer suporte às comunidades locais que usam o React, disponibilizando nossa documentação nos idiomas mais populares.

No passado, membros da comunidade do React criaram traduções não oficiais para o [chinês](https://github.com/discountry/react), [árabe](https://wiki.hsoub.com/React) e [coreano](https://github.com/reactjs/ko.reactjs.org/issues/4); Ao criar um canal oficial para essas traduções, esperamos torna-las mais fáceis de se encontrar e ajudar a garantir que os usuários do React que não falem inglês não sejam deixados para trás.

## Contribuindo {#contributing}

Se você quiser ajudar em uma tradução atual, confira a página [Idiomas](/languages) e clique no link "Contribuir" para o seu idioma.

Não consegue encontrar o seu idioma? Se você deseja manter o repositório de tradução do seu idioma, siga as instruções no [repositório de tradução](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation)!

## Contexto {#backstory}

Olá a todos! Me chamo [Nat](https://twitter.com/tesseralis)! Talvez você me conheça como a [moça dos poliedros](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). Nas últimas semanas, eu ajudei a equipe do React a coordenar os esforços da tradução. Eis como eu fiz isso.

Nossa abordagem original para as traduções foi usar uma plataforma SaaS que permite usuários a submeter traduções. Já havia um [pull request](https://github.com/reactjs/reactjs.org/pull/873) para integrá-lo e minha responsabilidade original era terminar essa integração. No entanto, tivemos preocupações sobre a viabilidade dessa integração e a qualidade das traduções na plataforma no momento. Nossa principal preocupação era garantir que as traduções continuassem atualizadas com o repositório principal e não se tornassem obsoletas.

[Dan](https://twitter.com/dan_abramov) me encorajou a procurar soluções alternativas, e nós nos deparamos com a forma como a [Vue](https://vuejs.org) manteve suas traduções - através de diferentes forks dos principais repositórios no GitHub. Em particular, a [tradução em japonês](https://jp.vuejs.org) usou um bot para verificar periodicamente as alterações no repositório em inglês e enviar pull requests sempre que existir uma mudança.

Essa abordagem nos atraiu por vários motivos:

* Menos código de integração.
* Encorajou mantenedores ativos em cada repositório para garantir qualidade.
* Os colaboradores já tem entendimento do GitHub como plataforma e ficam motivados para contribuir diretamente a organização do React.

Começamos com um período inicial de teste em três idiomas: espanhol, japonês e chinês simplificado. Isso nos permitiu resolver quaisquer problemas no processo e garantir que futuras traduções tenham ótimas chances de sucesso. Eu queria dar a liberdade para que as equipes de tradução pudessem escolher qualquer ferramenta com a qual se sentissem à vontade. O único requisito é uma [checklist](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) que descreve a ordem de importância para a tradução de páginas.

Após o período de testes, estávamos prontos para aceitar mais idiomas. Eu criei [um script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) para automatizar a criação de novos repositórios de idiomas, e um site, [O React já esta traduzido?](https://isreacttranslatedyet.com), para acompanhar o andamento das diferentes traduções. Começamos *10* novas traduções apenas no nosso primeiro dia!

Por causa da automação, o restante da manutenção foi em geral tranquila. Nós finalmente criamos um [canal no Slack](https://rt-slack-invite.herokuapp.com) para facilitar o compartilhamento de informações pelos tradutores, e eu publiquei um guia para solidificar as [responsabilidades dos mantenedores](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Permitir que os tradutores conversassem entre si foi um grande benefício - por exemplo, as traduções em árabe, persa e hebraico eram capazes de se comunicar entre si para obter o [texto da direita para a esquerda](https://en.wikipedia.org/wiki/Right-to-left) funcionando!

## O Bot {#the-bot}

A parte mais desafiadora foi fazer com que o bot sincronizasse as alterações da versão em inglês do site. Inicialmente, estávamos usando o bot [che-tsumi](https://github.com/vuejs-jp/che-tsumi) criado pela equipe de tradução da Vue em japonês, mas logo decidimos construir nosso próprio bot para atender às nossas necessidades. Em particular, o bot che-tsumi trabalha com [cherry picking](https://git-scm.com/docs/git-cherry-pick) dos novos commits. Isso acabou causando uma confusão de novos problemas que estavam interconectados, especialmente quando [os Hooks foram lançados](/blog/2019/02/06/react-v16.8.0.html).

No final, decidimos que em vez de selecionar cada commit com cherry pick, fazia mais sentido juntar todos os novos commits e criar um novo pull request em torno de uma vez por dia. Conflitos são deixados como estão e listados no [pull request](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), deixando uma lista de pontos para os mantenedores corrigirem.

Criar o [script de sincronização](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) foi fácil: ele faz o download do repositório traduzido, adiciona o original como remoto, puxa dele, mescla os conflitos e cria um pull request.

O problema foi encontrar um lugar para o bot rodar. Eu sou uma desenvolvedora frontend por uma razão - Heroku e seus amigos são estranhos para mim e infinitamente frustrantes. Na verdade, até esta terça-feira passada, eu estava executando o script manualmente na minha máquina local!

O maior desafio foi o espaço. Cada fork do repositório tem cerca de 100MB - o que leva alguns minutos para clonar na minha máquina local. Temos *32* forks, e os níveis gratuitos da maioria das plataformas de deployment que eu verifiquei limitam você a 512 MB de armazenamento.

Após vários cálculos no papel, encontrei uma solução: excluir cada repo depois de terminar o script e limitar a simultaneidade dos scripts de sincronização que são executados de uma vez para estarem dentro dos requisitos de armazenamento. Felizmente, os dynos no Heroku têm uma conexão à Internet muito mais rápida e são capazes de clonar até mesmo o repositório do React rapidamente.

Houve outros problemas menores que eu encontrei. Eu tentei usar o [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) para não ter que escrever nenhum código que fizesse `watch` (vigiar o repositório), mas ele acabou rodando de forma muito inconsistente, e eu [tive um colapso existencial no Twitter](https://twitter.com/tesseralis/status/1097387938088796160) quando não conseguia descobrir como enviar commits do dyno no Heroku. Mas no final, essa engenheira de frontend conseguiu fazer o bot funcionar!

Há, como sempre, melhorias que quero fazer no bot. No momento, ele não verifica se há um pedido de pull request pendente antes de fazer outro. Ainda é difícil dizer a mudança exata que aconteceu na fonte original, e é possível não perceber uma mudança de tradução necessária. Mas eu confio nos mantenedores que escolhemos para resolver esses problemas, e o bot é [open source](https://github.com/reactjs/reactjs.org-translation) se alguém quiser me ajudar a fazer essas melhorias!

## Agradecimentos {#thanks}

Por fim, gostaria de estender minha gratidão às seguintes pessoas e grupos:

 * Todos os mantenedores e contribuidores que estão ajudando a traduzir o React para mais de trinta idiomas.
 * O [Grupo de Usuários do Vue.js Japão](https://github.com/vuejs-jp) por ter a ideia de ter traduções gerenciadas por um bot e, especialmente, a [Hanatani Takuma](https://github.com/potato4d) por nos ajudar a entender sua abordagem e ajudar a manter a tradução em japonês.
 * [Soichiro Miki](https://github.com/smikitky) por muitas [contribuições](https://github.com/reactjs/reactjs.org/pull/1636) e comentários heio de idéias sobre o processo geral de tradução, bem como por manter a tradução japonesa.
 * [Eric Nakagawa](https://github.com/ericnakagawa) por gerenciar nosso processo de tradução anterior.
 * [Brian Vaughn](https://github.com/bvaughn) por configurar a [página de idiomas](/languages) e gerenciar todos os subdomínios.

E finalmente, obrigada a [Dan Abramov](https://twitter.com/dan_abramov) por me dar esta oportunidade e ser um grande mentor ao longo do caminho.
