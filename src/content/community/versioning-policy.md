---
title: Política de Versionamento
---

<Intro>

Todas as compilações estáveis do React passam por um alto nível de testes e seguem o versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback precoce sobre features experimentais. Esta página descreve o que você pode esperar das versões do React.

</Intro>

Para uma lista de versões anteriores, veja a página [Versões](/versions).

## Lançamentos Estáveis {/*stable-releases*/}

Lançamentos estáveis do React (também conhecidos como "Último" canal de lançamento) seguem os princípios do [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticas**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novas funcionalidades** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças quebráveis**, fazemos um **lançamento maior** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Lançamentos maiores podem também conter novas funcionalidades, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças Quebráveis {/*breaking-changes*/}

Mudanças quebráveis são inconvenientes para todos, por isso tentamos minimizar o número de lançamentos maiores – por exemplo, o React 15 foi lançado em abril de 2016, o React 16 foi lançado em setembro de 2017 e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novas funcionalidades em versões menores. Isso significa que lançamentos menores são frequentemente mais interessantes e atraentes do que maiores, apesar de seu nome modesto.

### Compromisso com a Estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novas funcionalidades. Quando possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins têm sido desencorajados há anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas ainda são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos bases de código continuam a usá-los em código legado estável.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. A base de código do Facebook sozinha tem mais de 50.000 componentes React. Isso significa que precisamos tornar o mais fácil possível a atualização para novas versões do React; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas em versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas pode atualizar mais de 50.000 componentes sozinhas, esperamos que a atualização seja gerenciável para qualquer pessoa que use o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe dos componentes, que então incluímos no lançamento de código aberto para que todos usem.

### Upgrades Graduais via Avisos {/*gradual-upgrades-via-warnings*/}

As compilações de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças quebráveis. Dessa forma, se seu aplicativo não tiver avisos na última versão, ele será compatível com a próxima versão maior. Isso permite que você atualize seus aplicativos um componente de cada vez.

Os avisos de desenvolvimento não afetarão o comportamento em tempo de execução do seu aplicativo. Assim, você pode ter confiança de que seu aplicativo se comportará da mesma forma entre as compilações de desenvolvimento e produção – as únicas diferenças são que a compilação de produção não registrará os avisos e que é mais eficiente. (Se você notar o contrário, por favor, registre um problema.)

### O que conta como uma mudança quebrável? {/*what-counts-as-a-breaking-change*/}

Em geral, *não* aumentamos o número da versão maior para mudanças em:

* **Avisos de desenvolvimento.** Como esses não afetam o comportamento de produção, podemos adicionar novos avisos ou modificar avisos existentes entre versões maiores. Na verdade, isso é o que nos permite avisar de forma confiável sobre mudanças quebráveis futuras.
* **APIs que começam com `unstable_`.** Essas são fornecidas como funcionalidades experimentais cujas APIs ainda não temos confiança. Ao lançá-las com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Oferecemos versões alpha do React como uma forma de testar novas funcionalidades precocemente, mas precisamos da flexibilidade para fazer mudanças com base no que aprendemos no período alpha. Se você usar essas versões, note que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por conta própria.

Esta política é projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão maior para todas essas mudanças, acabaríamos lançando mais versões maiores e, em última análise, causando mais dores de versionamento para a comunidade. Isso também significaria que não poderíamos avançar na melhoria do React tão rapidamente quanto gostaríamos.

Dito isso, se esperarmos que uma mudança nesta lista cause problemas amplos na comunidade, ainda faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não incluir novas funcionalidades, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novas funcionalidades. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser incrementada se funcionalidades ou melhorias substanciais forem introduzidas dentro do código privado. PODE incluir mudanças de nível de patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches.

A resposta é que qualquer mudança no React (ou em outro software) traz algum risco de quebras de maneiras inesperadas. Imagine uma situação em que um lançamento de patch que corrige um bug acidentalmente introduz um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria sua confiança em futuros lançamentos de patch. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um bom histórico de manter os lançamentos do React livres de bugs, mas lançamentos de patch têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores assume que podem ser adotados sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se um lançamento incluir mudanças não essenciais – como refatorações internas, mudanças nos detalhes de implementação, melhorias de desempenho ou correções de bugs menores – aumentaremos a versão menor mesmo quando não houver novas funcionalidades.

## Todos os canais de lançamento {/*all-release-channels*/}

O React depende de uma comunidade de código aberto próspera para registrar relatórios de bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos compilações especiais do React que incluem funcionalidades não lançadas.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvedor. Desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não precisam se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Último**](#latest-channel) é para lançamentos estáveis do React semver. É o que você recebe ao instalar o React do npm. Este é o canal que você já está usando hoje. **Aplicações voltadas para o usuário que consomem o React diretamente usam este canal.**
- [**Canary**](#canary-channel) acompanha o ramo principal do repositório de código fonte do React. Pense nisso como candidatos a lançamentos para o próximo lançamento semver. **[Frameworks ou outras configurações curadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e funcionalidades experimentais que não estão disponíveis nos lançamentos estáveis. Estas também acompanham o ramo principal, mas com flags de funcionalidade adicionais ativadas. Use isso para experimentar funcionalidades futuras antes de serem lançadas.

Todos os lançamentos são publicados no npm, mas apenas o Último usa versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seus conteúdos e a data do commit, ex: `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Último quanto Canary são oficialmente suportados para aplicações voltadas para o usuário, mas com expectativas diferentes**:

* Lançamentos Últimos seguem o modelo tradicional semver.
* Lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças quebráveis. Eles existem para configurações curadas (como frameworks) que desejam lançar gradualmente novas funcionalidades e correções de bugs no seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não garantimos que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Último.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, podemos aproveitar as muitas ferramentas que suportam o fluxo de trabalho do npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Último {/*latest-channel*/}

Último é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são entregues a usuários reais.

**Se você não tem certeza de qual canal deve usar, use o Último.** Se você estiver usando o React diretamente, é isso que você já está usando. Você pode esperar que as atualizações do Último sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, como [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que acompanha o ramo principal do repositório React. Usamos pré-lançamentos no canal Canary como candidatos a lançamentos para o canal Último. Você pode pensar no Canary como um superconjunto do Último que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Último mais recente é aproximadamente o mesmo que você encontraria entre dois lançamentos menores semver. No entanto, **o canal Canary não se conforma com o versionamento semântico.** Você deve esperar mudanças quebráveis ocasionais entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicações voltadas para o usuário diretamente, a menos que você esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos em Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, ex: `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as mudanças no React passam por extensos testes internos antes de serem lançadas ao público. No entanto, existem uma infinidade de ambientes e configurações usados em todo o ecossistema React, e não é possível para nós testarmos contra cada um deles.

Se você é o autor de um framework React de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto semelhante de infraestrutura, você pode nos ajudar a manter o React estável para seus usuários e para toda a comunidade React executando periodicamente sua suíte de testes contra as mudanças mais recentes. Se você estiver interessado, siga estas etapas:

- Configure um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados tanto pelo [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto pelo [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes React para o lançamento mais recente no canal Canary, usando a tag `canary` no npm. Usando a CLI do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute sua suíte de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com a próxima versão menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise registrando um [problema](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode consultar a [configuração do CircleCI deles](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como um exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que acompanha o ramo principal do repositório do React. Diferente do Canary, lançamentos Experimentais incluem funcionalidades e APIs adicionais que não estão prontas para um lançamento mais amplo.

Normalmente, uma atualização do Canary é acompanhada por uma atualização correspondente do Experimental. Elas são baseadas na mesma revisão de código, mas são construídas usando um conjunto diferente de flags de funcionalidade.

Lançamentos Experimentais podem ser significativamente diferentes dos lançamentos do Canary e do Último. **Não use lançamentos Experimentais em aplicações voltadas para o usuário.** Você deve esperar mudanças quebráveis frequentes entre lançamentos no canal Experimental.

Os lançamentos em Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, ex: `0.0.0-experimental-68053d940-20210623`.

#### O que vai em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Funcionalidades experimentais são aquelas que não estão prontas para serem lançadas para o público mais amplo e podem mudar drasticamente antes de serem finalizadas. Alguns experimentos podem nunca ser finalizados – a razão pela qual temos experimentos é para testar a viabilidade de mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos os Hooks, teríamos lançado os Hooks no canal Experimental semanas antes de estarem disponíveis no Último.

Você pode achar valioso executar testes de integração contra o Experimental. Isso fica a seu critério. No entanto, esteja ciente de que o Experimental é ainda menos estável que o Canary. **Não garantimos nenhuma estabilidade entre lançamentos Experimentais.**

#### Como posso aprender mais sobre funcionalidades experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Funcionalidades experimentais podem ou não estar documentadas. Normalmente, experimentos não são documentados até que estejam próximos de serem lançados no Canary ou Último.

Se uma funcionalidade não está documentada, ela pode vir acompanhada de um [RFC](https://github.com/reactjs/rfcs).

Nós postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que vamos divulgar todos os experimentos.

Você sempre pode consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público no GitHub para uma lista abrangente de mudanças.