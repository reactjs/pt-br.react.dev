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

## Por que a localização é importante? {#why-localization-matters}

O React já tem muitos eventos e conferências no mundo todo, mas muitos desenvolvedores não tem o inglês como idioma principal. Gostaríamos de oferecer suporte às comunidades locais que usam o React, disponibilizando nossa documentação nos idiomas mais populares.

No passado, membros da comunidade do React criaram traduções não oficiais para o [chinês](https://github.com/discountry/react), [árabe](https://wiki.hsoub.com/React) e [coreano](https://github.com/reactjs/ko.reactjs.org/issues/4); Ao criar um canal oficial para essas traduções, esperamos torna-las mais fáceis de se encontrar e ajudar a garantir que os usuários do React que não falam inglês não sejam deixados para trás.

## Contribuindo {#contributing}

Se você quiser ajudar em uma tradução atual, confira a página [Idiomas](/languages) e clique no link "Contribuir" para o seu idioma.

Não consegue encontrar o seu idioma? Se você deseja manter o repositório de tradução do seu idioma, siga as instruções no [repositório de tradução](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation)!

## Backstory {#backstory}

Olá a todos! Me chamo [Nat] (https://twitter.com/tesseralis)! Talvez você me conheça como a [moça dos poliedros](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). Nas últimas semanas, eu ajudei a equipe do React a coordenar os esforços da tradução. Eis como eu fiz isso.

Nossa abordagem original para as traduções foi usar uma plataforma SaaS que permite usuários a submeter traduções. Já havia um [pull request](https://github.com/reactjs/reactjs.org/pull/873) para integrá-lo e minha responsabilidade original era terminar essa integração. No entanto, tivemos preocupações sobre a viabilidade dessa integração e a qualidade das traduções na plataforma no momento. Nossa principal preocupação era garantir que as traduções continuassem atualizadas com o repositório principal e não se tornassem obsoletas.

[Dan](https://twitter.com/dan_abramov) me encorajou a procurar soluções alternativas, e nós nos deparamos com a forma como a [Vue](https://vuejs.org) manteve suas traduções - através de diferentes forks dos principais repositórios no GitHub. Em particular, a [tradução em japonês](https://jp.vuejs.org) usou um bot para verificar periodicamente as alterações no repositório em inglês e enviar pull requests sempre que existir uma 
mudança.

Essa abordagem nos atraiu por vários motivos:

* Menos código de integração.
* Encorajou maintainers ativos em cada repositório para garantir qualidade.
* Os colaboradores já tem entendimento do GitHub como plataforma e ficam motivados para contribuir diretamente a organização do React.

Começamos com um período inicial de teste em três idiomas: espanhol, japonês e chinês simplificado. Isso nos permitiu resolver quaisquer problemas no processo e garantir que futuras traduções tenham ótimas chances de sucesso. Eu queria dar a liberdade para que as equipes de tradução pudessem escolher qualquer ferramenta com a qual se sentissem à vontade. O único requisito é uma [checklist](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) que descreve a ordem de importância para a tradução de páginas.

After the trial period, we were ready to accept more languages. I created [a script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) to automate the creation of the new language repo, and a site, [Is React Translated Yet?](https://isreacttranslatedyet.com), to track progress on the different translations. We started *10* new translations on our first day alone!

Because of the automation, the rest of the maintance went mostly smoothly. We eventually created a [Slack channel](https://rt-slack-invite.herokuapp.com) to make it easier for translators to share information, and I released a guide solidifying the [responsibilities of maintainers](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Allowing translators to talk with each other was a great boon -- for example, the Arabic, Persian, and Hebrew translations were able to talk to each other in order to get [right-to-left text](https://en.wikipedia.org/wiki/Right-to-left) working!

## The Bot {#the-bot}

The most challenging part was getting the bot to sync changes from the English version of the site. Initially we were using the [che-tsumi](https://github.com/vuejs-jp/che-tsumi) bot created by the Japanese Vue translation team, but we soon decided to build our own bot to suit our needs. In particular, the che-tsumi bot works by [cherry picking](https://git-scm.com/docs/git-cherry-pick) new commits. This ended up causing a cavalade of new issues that were interconnected, especially when [Hooks were released](/blog/2019/02/06/react-v16.8.0.html).

In the end, we decided that instead of cherry picking each commit, it made more sense to merge all new commits and create a pull request around once a day. Conflicts are merged as-is and listed in the [pull request](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), leaving a checklist for maintainers to fix.

Creating the [sync script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) was easy enough: it downloads the translated repo, adds the original as a remote, pulls from it, merges the conflicts, and creates a pull request.

The problem was finding a place for the bot to run. I'm a frontend developer for a reason -- Heroku and its ilk are alien to me and *endlessly* frustrating. In fact, until this past Tuesday, I was running the script by hand on my local machine!

The biggest challenge was space. Each fork of the repo is around 100MB -- which takes minutes to clone on my local machine. We have *32* forks, and the free tiers or most deployment platforms I checked limited you to 512MB of storage. 

After lots of notepad calculations, I found a solution: delete each repo once we've finished the script and limit the concurrency of `sync` scripts that run at once to be within the storage requirements. Luckily, Heroku dynos have a much faster Internet connection and are able to clone even the React repo quickly.

There were other smaller issues that I ran into. I tried using the [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) add-on so I didn't have to write any actual `watch` code, but it end up running too inconsistently, and I [had an existential meltdown on Twitter](https://twitter.com/tesseralis/status/1097387938088796160) when I couldn't figure out how to send commits from the Heroku dyno. But in the end, this frontend engineer was able to get the bot working!

There are, as always, improvements I want to make to the bot. Right now it doesn't check whether there is an outstanding pull request before pushing another one. It's still hard to tell the exact change that happened in the original source, and it's possible to miss out on a needed translation change. But I trust the maintainers we've chosen to work through these issues, and the bot is [open source](https://github.com/reactjs/reactjs.org-translation) if anyone wants to help me make these improvements!

## Thanks {#thanks}

Finally, I would like to extend my gratitude to the following people and groups:

 * All the translation maintainers and contributors who are helping translate React to more than thirty languages.
 * The [Vue.js Japan User Group](https://github.com/vuejs-jp) for initiating the idea of having bot-managed translations, and especially [Hanatani Takuma](https://github.com/potato4d) for helping us understand their approach and helping maintain the Japanese translation.
 * [Soichiro Miki](https://github.com/smikitky) for many [contributions](https://github.com/reactjs/reactjs.org/pull/1636) and thoughtful comments on the overall translation process, as well as for maintaining the Japanese translation.
 * [Eric Nakagawa](https://github.com/ericnakagawa) for managing our previous translation process.
 * [Brian Vaughn](https://github.com/bvaughn) for setting up the [languages page](/languages) and managing all the subdomains.

 And finally, thank you to [Dan Abramov](https://twitter.com/dan_abramov) for giving me this opportunity and being a great mentor along the way.
