---
title: "Espiada: Além do React 16"
author: [sophiebits]
---

O [Dan Abramov](https://twitter.com/dan_abramov) do nosso time acabou de palestrar na [JSConf Iceland 2018](https://2018.jsconf.is/) com uma prévia de alguns novos recursos em que estamos trabalhando no React. A palestra começa com uma pergunta: "Com as vastas diferenças em poder de computação e velocidade de rede, como podemos oferecer a melhor experiência de usuário para todos?"

Aqui está o vídeo cortesia da JSConf Iceland:

<br>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nLF0n9SACd4?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Acho que você irá gostar mais da palestra, se você parar de ler aqui e apenas assistir ao vídeo. Se você não tiver tempo para assistir, segue um (bem) breve resumo.

## Sobre as Duas Demonstrações {#about-the-two-demos}

Na primeira demonstração, Dan diz: "Criamos uma maneira genérica de garantir que as atualizações de alta prioridade não sejam bloqueadas por uma atualização de baixa prioridade, chamada **time slicing**. Se meu dispositivo for rápido o suficiente, parece quase síncrono; se o meu dispositivo estiver lento, o aplicativo ainda parece responsivo. Ele se adapta ao dispositivo graças a API do [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback). Entretanto, apenas o estado final será apresentado; a página renderizada é sempre consistente e não vemos artifícios visuais da renderização lenta, causando uma experiência ruim ao usuário.

Na segunda demonstração, Dan explica: "Criamos uma maneira genérica para os componentes suspenderem a renderização enquanto carregam dados assíncronos, que chamamos de **suspense**. Você pode pausar qualquer atualização de estado até que os dados estejam prontos, e também adicionar carregamento assíncrono a qualquer componente no fundo da árvore sem descer todas as props e estados através do seu aplicativo e elevando a lógica. Em uma rede rápida, as atualizações parecem muito fluidas e instantâneas sem uma inconstância de carregamentos que aparecem e desaparecem. Em uma rede lenta, você pode intencionalmente projetar quais os estados de carregamento que o usuário deve ver e como eles devem ser granulares ou grosseiros, em vez de exibir os carregamentos com base em como o código é escrito. O aplicativo permanece responsivo durante todo o processo."

"Importantemente, esse ainda é o React que você conhece. Esse ainda é o paradigma do componente declarativo que você provavelmente gosta no React."

Estamos ansiosos para liberar esses novos recursos de renderização assíncrona no final do ano. Siga este blog e [@reactjs no Twitter](https://twitter.com/reactjs) para atualizações.
