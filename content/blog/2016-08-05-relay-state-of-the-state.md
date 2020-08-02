---
title: "Relay: State of the State"
author: [josephsavona]
---

Este mês marca um ano desde o lançamento do Relay e gostaríamos de compartilhar uma atualização no projeto e o que vem a seguir.

## Um ano em revisão {#a-year-in-review}


Um ano após o lançamento, estamos incrivelmente empolgados ao ver uma comunidade ativa se formando em volta do Relay e que empresas como o Twitter estão [usando Relay em produção](https://fabric.io/blog/building-fabric-mission-control-with-graphql-and-relay):

> Para um projeto como o controle de missão, GraphQL e o Relay foram uma solução quase perfeita, e o custo de construí-lo de qualquer outra maneira justificava o investimento.
>
> -- <cite>Fin Hopkins</cite>

Esse tipo de feedback positivo é realmente encorajador (admito reler essa publicação muitas vezes), e uma grande motivação para continuarmos e tornarmos o Relay ainda melhor.

Com a ajuda da comunidade, já percorremos um longo caminho desde a pré-visualização técnica. Aqui estão alguns destaques:

- Em março, adicionamos suporte à renderização no lado do servidor e à criação de várias instâncias do Relay em uma single page. Esse foi um esforço coordenado ao longo de vários meses pelos membros da comunidade [Denis Nedelyaev](https://github.com/denvned) e [Gerald Monaco](https://github.com/devknoll) (agora no Facebook).
- Também em março, adicionamos suporte ao React Native. Enquanto usamos internamente o Relay e o React Native juntos, eles não funcionaram juntos em código aberto imediatamente. Devemos um grande obrigado a [Adam Miskiewicz](https://github.com/skevy), [Tom Burns](https://github.com/boourns), [Gaëtan Renaudeau](https://github.com/gre), [David Aurelio](https://github.com/davidaurelio), [Martín Bigio](https://github.com/martinbigio), [Paul O’Shannessy](https://github.com/zpao), [Sophie Alpert](https://github.com/sophiebits), e muitos outros que ajudaram a rastrear e resolver problemas. Finalmente, graças a [Steven Luscher](https://github.com/steveluscher) por coordenar esse esforço e criar o primeiro aplicativo de exemplo Relay/ReactNative.

Também vimos alguns grandes projetos de código aberto surgindo no Relay:

- [Denis Nedelyaev](https://github.com/denvned) criou [isomorphic-relay](https://github.com/denvned/isomorphic-relay/), um pacote que ajuda os desenvolvedores a criar aplicativos Relay renderizado pelo servidor, onde os dados são preparados no servidor e usados para inicializar o aplicativo no cliente.
- [Jimmy Jia](https://github.com/taion) criou [react-router-relay](https://github.com/relay-tools/react-router-relay) para integrar a busca de dados do Relay no React Router.
- [Pavel Chertorogov](https://github.com/nodkz) released [relay-network-layer](https://github.com/nodkz/react-relay-network-layer), que adiciona recursos como solicitações de consulta em lote, middleware, autenticação, log e muito mais.

Esta é apenas uma pequena amostra das contribuições da comunidade. Até agora, mergeamos mais de 300 PRs - cerca de 25% de nossos commits - de mais de 80 de vocês. Esses PRs melhoraram tudo, desde o site e as documentações até o core do framework. Somos humilhados por essas contribuições excelentes e empolgados por continuar trabalhando com cada um de vocês!

# Retrospectiva & Roteiro {#retrospective--roadmap}

No início deste ano, paramos para refletir sobre o estado do projeto. O que estava funcionando bem? O que poderia ser melhorado? Quais recursos devemos adicionar e o que podemos remover? Alguns temas surgiram: performance no celular, experiência do desenvolvedor e capacitação da comunidade.

## Performance no celular {#mobile-perf}

Primeiro, o Relay foi criado para atender às necessidades dos desenvolvedores de produtos no Facebook. Em 2016, isso significa ajudar os desenvolvedores a criar aplicativos que funcionam bem em [dispositivos móveis conectados em redes mais lentas](https://newsroom.fb.com/news/2015/10/news-feed-fyi-building-for-all-connectivity/). Por exemplo, pessoas na área de desenvolvimento geralmente usam [telefones do ano de 2011](https://code.facebook.com/posts/307478339448736/year-class-a-classification-system-for-android/) e se conectam via [redes 2G](https://code.facebook.com/posts/952628711437136/classes-performance-and-network-segmentation-on-android/). Esses cenários apresentam seus próprios desafios.

Portanto, um dos nossos principais objetivos este ano é otimizar o Relay para desempenho em dispositivos móveis de última geração *primeiro*, sabendo que isso também pode resultar em desempenho aprimorado em dispositivos de última geração. Além das abordagens padrão, como avaliação comparativa, criação de perfil e otimizações, também estamos trabalhando em mudanças gerais.

Por exemplo, na retransmissão de hoje, aqui está o que acontece o que acontece quando um aplicativo é aberto. Primeiro, o React Native começa a inicializar o contexto do JavaScript (carregando e analisando seu código e, em seguida, executando-o). Quando isso termina, o aplicativo é executado e o Relay vê que você precisa de dados. Ele constrói e imprime a consulta, carrega o texto da consulta no servidor, processa a resposta e renderiza seu aplicativo. (Observe que esse processo se aplica à Web, exceto que o código precisa ser *baixado* em vez de carregado do dispositivo.)

Idealmente, porém, poderíamos começar a buscar dados assim que o código nativo fosse carregado - paralelamente à inicialização do contexto JS. No momento em que seu código JS estava pronto para execução, a busca de dados já estava em andamento. Para fazer isso, precisaríamos de uma maneira de determinar *estaticamente* - no momento da construção - que consulta um aplicativo enviaria.

A chave é que o GraphQL já é estático - nós apenas precisamos abraçar completamente esse fato. Mas, sobre isso veremos depois.

## Experiência do desenvolvedor {#developer-experience}

Em seguida, prestamos atenção ao feedback da comunidade e sabemos que, para simplificar, o Relay pode ser "mais fácil" de usar (e "mais simples" também). Isso não é totalmente surpreendente para nós - o Relay foi originalmente projetado como uma biblioteca de roteamento e gradualmente se transformou em uma biblioteca de busca de dados. Conceitos como "rotas" de retransmissão, por exemplo, não servem mais como uma função crítica e são apenas mais um conceito que os desenvolvedores precisam aprender. Outro exemplo são as mutações: enquanto as gravações *são* inerentemente mais complexas que as leituras, nossa API não simplifica bastante as coisas simples.

Além do nosso foco no desempenho móvel, também mantemos a experiência do desenvolvedor em mente à medida que desenvolvemos o núcleo do Relay.

## Capacitar a Comunidade {#empowering-the-community}

Por fim, queremos facilitar o desenvolvimento de bibliotecas úteis para as pessoas da comunidade que trabalham com o Relay. Em comparação, a pequena área de superfície do React - componentes - permite que os desenvolvedores construam coisas interessantes, como roteamento, componentes de ordem superior ou editores de texto reutilizáveis. Para o Relay, isso significaria que a estrutura fornecesse primitivas básicas nas quais os usuários possam desenvolver. Queremos que seja possível para a comunidade integrar o Relay com outras bibliotecas que não sejam o React, ou criar assinaturas em tempo real como uma biblioteca complementar.

# Qual é o próximo passo {#whats-next}

Esses eram grandes objetivos e também um pouco assustadores; sabíamos que melhorias incrementais só nos permitiriam avançar tão rápido. Então, em abril, iniciamos um projeto para construir uma nova implementação do núcleo do Relay para dispositivos móveis de baixo custo desde o início.

Como você pode imaginar, já que estamos escrevendo isso, o experimento foi um sucesso. O resultado é um novo núcleo que mantém as melhores partes do Relay hoje - componentes & dependências de dados colocados, consistência automática de dados/visualização, busca declarativa de dados - enquanto melhora o desempenho em dispositivos móveis e aborda muitas áreas comuns de confusão.


No momento, estamos focados em enviar os primeiros aplicativos usando o novo núcleo: resolver erros, refinar as alterações da API e a experiência do desenvolvedor, e adicionar os recursos que faltam. Estamos empolgados em trazer essas alterações para o código aberto e o faremos assim que testarmos em produção. Entraremos em mais detalhes em algumas próximas palestras - links abaixo -, mas por enquanto, aqui está uma visão geral:

- **Consultas Estáticas**: Ao adicionar algumas diretivas específicas ao Relay, conseguimos manter a expressividade das consultas atuais do Relay usando sintaxe estática (concretamente: você sabe qual consulta um aplicativo executará apenas olhando o texto fonte, sem precisar executá-la código). Para iniciantes, isso permitirá que os aplicativos de retransmissão iniciem a busca de dados em paralelo com a inicialização do JavaScript. Mas também abre outras possibilidades: conhecer a consulta antecipadamente significa que podemos gerar um código otimizado para lidar com as respostas da consulta, por exemplo, ou para ler dados da consulta de um cache offline.
- **Mutações Expressivas**: Continuaremos a oferecer suporte a uma API de mutação de nível superior para casos comuns, mas também forneceremos uma API de nível inferior que permita o acesso a dados "brutos" quando necessário. Se você precisar solicitar uma lista de elementos em cache, por exemplo, haverá uma maneira de fazer `sort ()` nela.
- **Relay sem Rota**: As rotas desaparecerão em código aberto. Em vez de uma rota com várias definições de consulta, você apenas fornecerá uma única consulta com quantos campos raiz desejar.
- **Despejo de Cache/Coleta de Lixo**: A API e a arquitetura foram projetadas desde o início para permitir a remoção de dados em cache que não são mais referenciados por uma exibição montada.

Recuando, reconhecemos que qualquer alteração na API exigirá um investimento de sua parte. Para facilitar a transição, *continuaremos a oferecer suporte à API atual no futuro próximo* (ainda a estamos usando também). E, na medida do possível, abriremos código-fonte das ferramentas que usamos para migrar nosso próprio código. As idéias que estamos explorando incluem modos de código, uma camada de interoperabilidade para as APIs antigas/novas e tutoriais & guias para facilitar a migração.

Por fim, estamos fazendo essas alterações porque acreditamos que elas melhoram o Relay: mais simples para os desenvolvedores que estão criando aplicativos e mais rápido para as pessoas que os usam.

# Conclusão {#conclusion}

Se você chegou até aqui, parabéns e obrigado pela leitura! Compartilharemos mais informações sobre essas mudanças em algumas próximas palestras:

- [Greg Hurrell](https://github.com/wincent) apresentará um mergulho profundo do Relay no [Meetup ReactJS no Vale do Silício](http://www.meetup.com/Silicon-Valley-ReactJS-Meetup/events/232236845/) em 17 de agosto.
- Eu ([@josephsavona](https://github.com/josephsavona)) estarei falando sobre o Relay em [React Rally](http://www.reactrally.com) em 25 de agosto.

Mal podemos esperar para compartilhar o novo código com você e estamos trabalhando o mais rápido possível!
