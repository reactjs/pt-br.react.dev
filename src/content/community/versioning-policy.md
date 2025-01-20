---
title: Política de Versionamento
---

<Intro>

Todos os builds estáveis do React passam por um alto nível de testes e seguem o versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Para uma lista de lançamentos anteriores, veja a página [Versões](/versions).

## Lançamentos Estáveis {/*stable-releases*/}

Os lançamentos estáveis do React (também conhecidos como canal de lançamento "Mais Recente") seguem os princípios do [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticas**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças quebradas**, fazemos um **lançamento maior** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Lançamentos maiores também podem conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças Quebradas {/*breaking-changes*/}

Mudanças quebradas são inconvenientes para todos, por isso tentamos minimizar o número de lançamentos maiores – por exemplo, o React 15 foi lançado em abril de 2016, o React 16 foi lançado em setembro de 2017 e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que os lançamentos menores são frequentemente mais interessantes e atraentes do que os maiores, apesar de seu nome modesto.

### Compromisso com a Estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Sempre que possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins foram desencorajados por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) mas são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos códigos continuam a usá-los em códigos legados estáveis.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. O código do Facebook sozinho tem mais de 50.000 componentes React. Isso significa que precisamos tornar o processo de atualização para novas versões do React o mais fácil possível; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas em versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas pode atualizar mais de 50.000 componentes sozinha, esperamos que a atualização seja gerenciável para qualquer um que use o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe dos componentes, que depois incluímos no lançamento de código aberto para que todos possam usar.

### Atualizações Gradativas via Avisos {/*gradual-upgrades-via-warnings*/}

Builds de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças quebradas. Assim, se seu aplicativo não tiver avisos na versão mais recente, ele será compatível com o próximo lançamento maior. Isso permite que você atualize seus aplicativos um componente de cada vez.

Os avisos de desenvolvimento não afetarão o comportamento de tempo de execução do seu aplicativo. Assim, você pode se sentir confiante de que seu aplicativo se comportará da mesma forma entre os builds de desenvolvimento e produção -- as únicas diferenças são que o build de produção não registrará os avisos e que é mais eficiente. (Se você notar o contrário, por favor, registre um problema.)

### O que conta como uma mudança quebrada? {/*what-counts-as-a-breaking-change*/}

Em geral, *não* aumentamos o número da versão maior para mudanças em:

* **Avisos de desenvolvimento.** Como estes não afetam o comportamento em produção, podemos adicionar novos avisos ou modificar os avisos existentes entre as versões maiores. De fato, isso é o que nos permite avisar com precisão sobre mudanças quebradas futuras.
* **APIs que começam com `unstable_`.** Essas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança. Ao lançá-las com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alfa e Canary do React.** Fornecemos versões alfa do React como uma maneira de testar novos recursos antecipadamente, mas precisamos da flexibilidade para fazer mudanças com base no que aprendemos no período alfa. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por conta própria.

Essa política foi projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão maior para todas essas mudanças, acabaríamos lançando mais versões maiores e, em última instância, causando mais dores de versionamento para a comunidade. Também significaria que não poderíamos avançar na melhoria do React tão rápido quanto gostaríamos.

Dito isso, se esperarmos que uma mudança nesta lista cause problemas amplos na comunidade, faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não inclui novos recursos, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] pode ser incrementada se funcionalidades ou melhorias substanciais forem introduzidas dentro do código privado. Pode incluir mudanças no nível de patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches em vez disso.

A resposta é que qualquer mudança no React (ou em outro software) carrega algum risco de quebrar de maneiras inesperadas. Imagine um cenário onde um lançamento de patch que corrige um bug acidentalmente introduz um bug diferente. Isso não seria apenas disruptivo para os desenvolvedores, mas também prejudicaria a confiança deles em futuros lançamentos de patch. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um bom histórico de manter os lançamentos do React livres de bugs, mas os lançamentos de patch têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores assume que podem ser adotados sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se um lançamento incluir mudanças não essenciais — como refatorações internas, mudanças em detalhes de implementação, melhorias de desempenho ou correções de bugs menores — aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os Canais de Lançamento {/*all-release-channels*/}

O React depende de uma comunidade de código aberto vibrante para registrar relatórios de bugs, abrir solicitações de pull e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar feedback, às vezes compartilhamos builds especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvedor. Desenvolvedores que usam o React principalmente para construir aplicações voltadas para o usuário não precisam se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Mais Recente**](#latest-channel) é para lançamentos estáveis do React, semver. É o que você obtém ao instalar o React da npm. Este é o canal que você já está usando hoje. **Aplicações voltadas para o usuário que consomem o React diretamente usam este canal.**
- [**Canary**](#canary-channel) acompanha o ramo principal do repositório de código-fonte do React. Pense nisso como candidatos a lançamentos para o próximo lançamento semver. **[Frameworks ou outras configurações curadas podem optar por usar este canal com uma versão estável do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nos lançamentos estáveis. Esses também acompanham o ramo principal, mas com flags de recursos adicionais ativadas. Use isso para experimentar recursos futuros antes que sejam lançados.

Todos os lançamentos são publicados no npm, mas apenas o Mais Recente usa versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seus conteúdos e da data de commit, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto o canal Mais Recente quanto o Canary são oficialmente suportados para aplicações voltadas para o usuário, mas com expectativas diferentes**:

* Os lançamentos Mais Recentes seguem o modelo tradicional de semver.
* Os lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças quebradas. Eles existem para configurações curadas (como frameworks) que desejam lançar gradualmente novos recursos do React e correções de bugs em seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não garantimos que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Mais Recente.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, conseguimos aproveitar as muitas ferramentas que suportam o fluxo de trabalho npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Mais Recente {/*latest-channel*/}

O Mais Recente é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados para usuários reais.

**Se você não tem certeza de qual canal deve usar, é o Mais Recente.** Se você está usando o React diretamente, é isso que você já está usando. Você pode esperar que atualizações para o Mais Recente sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, como [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que acompanha o ramo principal do repositório React. Usamos pré-lançamentos no canal Canary como candidatos a lançamentos para o canal Mais Recente. Você pode pensar no Canary como um superconjunto do Mais Recente que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Mais Recente mais recente é aproximadamente o mesmo que você encontraria entre dois lançamentos menores de semver. No entanto, **o canal Canary não está em conformidade com o versionamento semântico.** Você deve esperar mudanças quebradas ocasionais entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicações voltadas para o usuário diretamente, a menos que esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos em Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash dos conteúdos da build e da data de commit, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as mudanças no React passam por extensivos testes internos antes de serem lançadas ao público. No entanto, existem uma infinidade de ambientes e configurações usados por todo o ecossistema do React, e não é possível para nós testar cada um deles.

Se você é o autor de um framework de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto de infraestrutura semelhante, você pode nos ajudar a manter o React estável para seus usuários e toda a comunidade React executando periodicamente sua suíte de testes contra as mudanças mais recentes. Se você estiver interessado, siga estas etapas:

- Configure um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados tanto por [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto por [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes React para o lançamento mais recente no canal Canary, usando a tag `canary` no npm. Usando a CLI do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute sua suíte de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com o próximo lançamento menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise registrando um [problema](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode se referir à [configuração do CircleCI deles](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como um exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que acompanha o ramo principal do repositório React. Ao contrário do Canary, lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para um lançamento mais amplo.

Normalmente, uma atualização para o Canary vem acompanhada de uma atualização correspondente para o Experimental. Eles são baseados na mesma revisão de código, mas são construídos usando um conjunto diferente de flags de recursos.

Lançamentos Experimentais podem ser significativamente diferentes dos lançamentos Canary e Mais Recentes. **Não use lançamentos Experimentais em aplicações voltadas para o usuário.** Você deve esperar mudanças quebradas frequentes entre lançamentos no canal Experimental.

Os lançamentos em Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash dos conteúdos da build e da data de commit, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que entra em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para serem lançados ao público mais amplo e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados -- a razão pela qual temos experimentos é para testar a viabilidade das mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos Hooks, teríamos lançado Hooks no canal Experimental semanas antes de estarem disponíveis no Mais Recente.

Você pode achar valioso executar testes de integração contra o Experimental. Isso fica a seu critério. No entanto, esteja avisado de que o Experimental é ainda menos estável do que o Canary. **Não garantimos nenhuma estabilidade entre lançamentos Experimentais.**

#### Como posso aprender mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ou não estar documentados. Normalmente, experimentos não são documentados até que estejam próximos de ser lançados no Canary ou no Mais Recente.

Se um recurso não estiver documentado, ele pode ser acompanhado por um [RFC](https://github.com/reactjs/rfcs).

Nós postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que vamos publicamente divulgar todo experimento.

Você sempre pode se referir ao [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público do GitHub para uma lista abrangente de mudanças.