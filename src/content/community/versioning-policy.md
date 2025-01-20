---
title: Política de Versionamento
---

<Intro>

Todas as versões estáveis do React passam por um alto nível de testes e seguem a versão semântica (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar das versões do React.

</Intro>

Para uma lista de versões anteriores, veja a página [Versões](/versions).

## Lançamentos Estáveis {/*stable-releases*/}

Os lançamentos estáveis do React (também conhecidos como canal de lançamentos "Mais Recentes") seguem os princípios de [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticas**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças que quebram a compatibilidade**, fazemos um **lançamento maior** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Lançamentos maiores também podem conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças Quebradoras {/*breaking-changes*/}

Mudanças que quebram a compatibilidade são inconvenientes para todos, então tentamos minimizar o número de lançamentos maiores – por exemplo, o React 15 foi lançado em abril de 2016 e o React 16 foi lançado em setembro de 2017, e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que os lançamentos menores são frequentemente mais interessantes e atraentes do que os maiores, apesar de seus nomes modestos.

### Compromisso com a Estabilidade {/*commitment-to-stability*/}

Conforme mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Quando possível, continuaremos mantendo uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins foram desencorajados por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas eles são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitas bases de código continuam a usá-los em código legado estável.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. A base de código do Facebook sozinha tem mais de 50.000 componentes React. Isso significa que precisamos tornar o processo de atualização para novas versões do React o mais fácil possível; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas a versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas pode atualizar mais de 50.000 componentes sozinha, esperamos que a atualização seja gerenciável para qualquer um que use o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe do componente, que depois incluímos no lançamento de código aberto para todos usarem.

### Atualizações Gradativas via Avisos {/*gradual-upgrades-via-warnings*/}

Versões de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças que quebram a compatibilidade. Dessa forma, se seu aplicativo não tiver avisos na versão mais recente, ele será compatível com a próxima versão maior. Isso permite que você atualize seus aplicativos um componente de cada vez.

Avisos de desenvolvimento não afetarão o comportamento de tempo de execução do seu aplicativo. Assim, você pode ter a certeza de que seu aplicativo se comportará da mesma maneira entre as versões de desenvolvimento e produção – as únicas diferenças são que a versão de produção não registrará os avisos e que é mais eficiente. (Se você notar algo diferente, por favor, registre um problema.)

### O que conta como uma mudança quebradora? {/*what-counts-as-a-breaking-change*/}

Em geral, nós *não* aumentamos o número da versão maior para mudanças em:

* **Avisos de desenvolvimento.** Como esses não afetam o comportamento em produção, podemos adicionar novos avisos ou modificar avisos existentes entre versões principais. Na verdade, isso nos permite avisar de forma confiável sobre mudanças quebradoras futuras.
* **APIs que começam com `unstable_`.** Estas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança. Ao lançá-las com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma maneira de testar novos recursos cedo, mas precisamos da flexibilidade para fazer mudanças com base no que aprendemos no período alpha. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por conta própria.

Essa política é projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão maior para todas essas mudanças, acabaríamos lançando mais versões maiores e, por fim, causando mais problemas de versionamento para a comunidade. Isso também significaria que não poderíamos progredir em melhorar o React tão rapidamente quanto gostaríamos.

Dito isso, se esperarmos que uma mudança nesta lista cause problemas generalizados na comunidade, ainda faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não incluir novos recursos, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser incrementada se funcionalidades substanciais ou melhorias forem introduzidas dentro do código privado. PODE incluir mudanças de nível patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches.

A resposta é que qualquer mudança no React (ou em outro software) traz algum risco de quebrar de maneiras inesperadas. Imagine um cenário onde um lançamento de patch que corrige um bug acidentalmente introduz um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria a confiança deles em lançamentos de patch futuros. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um histórico bastante bom em manter os lançamentos do React livres de bugs, mas os lançamentos de patch têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores supõe que eles podem ser adotados sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se um lançamento incluir mudanças não essenciais – como refatoraçõe internas, mudanças em detalhes de implementação, melhorias de desempenho ou correções menores de bugs – aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os Canais de Lançamento {/*all-release-channels*/}

O React se baseia em uma próspera comunidade de código aberto para registrar relatórios de bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos versões especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvimento. Desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não devem se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Mais Recentes**](#latest-channel) é para lançamentos estáveis do React em conformidade com semver. É o que você obtém quando instala o React pelo npm. Este é o canal que você já está usando hoje. **Aplicativos voltados para o usuário que consomem o React diretamente usam este canal.**
- [**Canary**](#canary-channel) rastreia o branch principal do repositório de código-fonte do React. Pense nisso como candidatos a lançamentos para o próximo lançamento semver. **[Frameworks ou outras configurações organizadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nas versões estáveis. Estes também rastreiam o branch principal, mas com flags de recursos adicionais ativadas. Use isso para experimentar recursos futuros antes que sejam lançados.

Todos os lançamentos são publicados no npm, mas apenas o Mais Recentes utiliza versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seu conteúdo e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Mais Recentes quanto Canary são oficialmente suportados para aplicativos voltados para usuários, mas com expectativas diferentes**:

* Os lançamentos Mais Recentes seguem o modelo tradicional de semver.
* Os lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças que quebram a compatibilidade. Eles existem para configurações organizadas (como frameworks) que desejam lançar gradualmente novos recursos e correções de bugs no seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não garantimos que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Mais Recentes.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, conseguimos aproveitar as muitas ferramentas que suportam o fluxo de trabalho do npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Mais Recentes {/*latest-channel*/}

Mais Recentes é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados a usuários reais.

**Se você não tem certeza de qual canal deve usar, é o Mais Recentes.** Se você está usando o React diretamente, isso é o que você já está utilizando. Você pode esperar que as atualizações do Mais Recentes sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, como [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Mais Recentes. Você pode pensar no Canary como um superset do Mais Recentes que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Mais Recentes mais recente é aproximadamente o mesmo que você encontraria entre dois lançamentos menores de semver. No entanto, **o canal Canary não se conforma ao versionamento semântico.** Você deve esperar mudanças que quebram a compatibilidade entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicativos voltados para usuários diretamente, a menos que esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos em Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da construção e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as mudanças no React passam por extensos testes internos antes de serem lançadas ao público. No entanto, existem uma infinidade de ambientes e configurações usados em todo o ecossistema do React, e não é possível para nós testarmos contra todos eles.

Se você é o autor de um framework de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto de infraestrutura semelhante ao React, pode nos ajudar a manter o React estável para seus usuários e toda a comunidade do React, executando periodicamente sua suíte de testes contra as mudanças mais recentes. Se você estiver interessado, siga estes passos:

- Configure um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados tanto pelo [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto pelo [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes do React para o lançamento mais recente no canal Canary, usando a tag `canary` no npm. Usando a cli do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute sua suíte de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com o próximo lançamento menor do React.
- Se algo quebrar inesperadamente, por favor nos avise abrindo um [problema](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode consultar sua [configuração do CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Ao contrário do Canary, os lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para lançamento mais amplo.

Usualmente, uma atualização do Canary é acompanhada por uma atualização correspondente do Experimental. Eles são baseados na mesma revisão de código, mas são construídos usando um conjunto diferente de flags de recursos.

Os lançamentos Experimentais podem ser significativamente diferentes dos lançamentos do Canary e do Mais Recentes. **Não use lançamentos Experimentais em aplicativos voltados para usuários.** Você deve esperar mudanças que quebram a compatibilidade frequentes entre lançamentos no canal Experimental.

Os lançamentos Experimentais são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da construção e da data do commit, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que entra em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para serem lançados ao público mais amplo e podem mudar drasticamente antes de serem finalizados. Algumas experiências podem nunca ser finalizadas - a razão pela qual temos experiências é testar a viabilidade das mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos Hooks, teríamos lançado Hooks no canal Experimental semanas antes de estarem disponíveis no Mais Recentes.

Você pode achar valioso executar testes de integração contra o Experimental. Isso fica a seu critério. No entanto, tenha em mente que o Experimental é ainda menos estável que o Canary. **Não garantimos nenhuma estabilidade entre lançamentos Experimentais.**

#### Como posso aprender mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ou não estar documentados. Normalmente, experiências não são documentadas até que estejam próximas do lançamento no Canary ou no Mais Recentes.

Se um recurso não está documentado, pode estar acompanhado de um [RFC](https://github.com/reactjs/rfcs).

Postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novas experiências, mas isso não significa que publicaremos todas as experiências.

Você sempre pode consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público do GitHub para uma lista abrangente de mudanças.