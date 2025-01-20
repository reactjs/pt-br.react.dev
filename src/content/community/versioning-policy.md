---
title: Política de Versionamento
---

<Intro>

Todas as versões estáveis do React passam por um alto nível de testes e seguem o versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Para uma lista de lançamentos anteriores, veja a [página Versões](/versions).

## Lançamentos estáveis {/*stable-releases*/}

Os lançamentos estáveis do React (também conhecidos como "Último" canal de lançamento) seguem os princípios do [versionamento semântico (semver)](https://semver.org/).

Isso significa que com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticos**, fazemos um **lançamento de correção** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **alterações que quebram a compatibilidade**, fazemos um **lançamento major** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Os lançamentos major também podem conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Os lançamentos menores são o tipo de lançamento mais comum.

### Alterações que quebram a compatibilidade {/*breaking-changes*/}

Alterações que quebram a compatibilidade são inconvenientes para todos, então tentamos minimizar o número de lançamentos major – por exemplo, o React 15 foi lançado em abril de 2016 e o React 16 foi lançado em setembro de 2017, e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que os lançamentos menores são frequentemente mais interessantes e atrativos do que os lançamentos major, apesar de seu nome modesto.

### Compromisso com a estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Quando possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins têm sido desencorajados por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) mas ainda são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos códigos ainda os utilizam em código legado estável.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. Apenas a base de código do Facebook tem mais de 50.000 componentes React. Isso significa que precisamos tornar o mais fácil possível fazer upgrade para novas versões do React; se fizermos alterações grandes sem um caminho de migração, as pessoas ficarão presas em versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas pode atualizar mais de 50.000 componentes sozinha, esperamos que a atualização seja gerenciável para qualquer um que use o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe do componente, que incluímos na versão de código aberto para que todos possam usar.

### Atualizações graduais através de avisos {/*gradual-upgrades-via-warnings*/}

As versões de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras alterações que quebram a compatibilidade. Assim, se seu aplicativo não tiver avisos na versão mais recente, ele será compatível com a próxima versão major. Isso permite que você atualize seus aplicativos um componente de cada vez.

Os avisos de desenvolvimento não afetarão o comportamento em tempo de execução do seu aplicativo. Assim, você pode ter certeza de que seu aplicativo se comportará da mesma maneira entre as versões de desenvolvimento e produção – as únicas diferenças são que a versão de produção não registrará os avisos e que é mais eficiente. (Se você notar o contrário, por favor, registre um problema.)

### O que conta como uma alteração que quebra a compatibilidade? {/*what-counts-as-a-breaking-change*/}

Em geral, nós *não* aumentamos o número da versão major para alterações em:

* **Avisos de desenvolvimento.** Como estes não afetam o comportamento de produção, podemos adicionar novos avisos ou modificar avisos existentes entre versões major. Na verdade, isso é o que nos permite avisar de forma confiável sobre futuras alterações que quebram a compatibilidade.
* **APIs que começem com `unstable_`.** Estas são fornecidas como recursos experimentais cujas APIs ainda não estamos confiantes. Ao lançá-las com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma maneira de testar novos recursos antecipadamente, mas precisamos da flexibilidade para fazer alterações com base no que aprendemos no período alpha. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por sua conta.

Esta política é projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão major para todas essas alterações, acabaríamos lançando mais versões major e, em última análise, causando mais dor de versionamento para a comunidade. Isso também significaria que não poderíamos avançar na melhoria do React tão rápido quanto gostaríamos.

Dito isso, se esperarmos que uma alteração desta lista cause problemas abrangentes na comunidade, ainda faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não incluir novos recursos, por que não é uma correção? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser incrementada se funcionalidades substanciais ou melhorias forem introduzidas dentro do código privado. Ela PODE incluir alterações no nível de correção."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como correções.

A resposta é que qualquer alteração no React (ou em outro software) carrega algum risco de quebrar de maneiras inesperadas. Imagine um cenário em que um lançamento de correção que corrige um bug acidentalmente introduza um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria sua confiança em lançamentos de correção futuros. É especialmente lamentável se a correção original for para um bug que é raramente encontrado na prática.

Temos um bom histórico em manter os lançamentos do React livres de bugs, mas lançamentos de correção têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores assume que pode ser adotada sem consequências adversas.

Por essas razões, reservamos os lançamentos de correção apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se um lançamento incluir alterações não essenciais — como refatorações internas, mudanças em detalhes de implementação, melhorias de desempenho ou correções menores — aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os canais de lançamento {/*all-release-channels*/}

O React depende de uma comunidade de código aberto próspera para registrar relatórios de bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos versões especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvedor. Desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não devem se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Último**](#latest-channel) é para lançamentos estáveis do React semver. É o que você obtém ao instalar o React a partir do npm. Este é o canal que você já está usando hoje. **Aplicativos voltados para o usuário que consomem o React diretamente usam este canal.**
- [**Canary**](#canary-channel) rastreia o branch principal do repositório de código-fonte do React. Pense nisso como candidatos a lançamento para o próximo lançamento semver. **[Frameworks ou outras configurações curadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nos lançamentos estáveis. Estes também rastreiam o branch principal, mas com bandeiras de recursos adicionais ativadas. Use isso para testar recursos futuros antes de serem lançados.

Todos os lançamentos são publicados no npm, mas apenas o Último usa o versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seus conteúdos e a data do commit, ex: `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Último quanto Canary são oficialmente suportados para aplicativos voltados para o usuário, mas com expectativas diferentes**:

* Lançamentos Último seguem o modelo tradicional semver.
* Lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças que quebram a compatibilidade. Eles existem para configurações curadas (como frameworks) que desejam lançar gradualmente novos recursos e correções de bugs de acordo com seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não garantimos que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Último.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, conseguimos aproveitar as muitas ferramentas que suportam o fluxo de trabalho npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Último {/*latest-channel*/}

Último é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados para usuários reais.

**Se você não tem certeza de qual canal deve usar, é o Último.** Se você está usando o React diretamente, é o que você já está usando. Você pode esperar que as atualizações para o Último sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, conforme [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Último. Você pode pensar no Canary como um superconjunto do Último que é atualizado com mais frequência.

O grau de mudança entre o mais recente lançamento Canary e o mais recente lançamento Último é aproximadamente o mesmo que você encontraria entre dois lançamentos semver menores. No entanto, **o canal Canary não se conforma ao versionamento semântico.** Você deve esperar alterações que quebram a compatibilidade ocasionalmente entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicativos voltados para o usuário diretamente, a menos que você esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos no Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, ex: `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as alterações no React passam por extensivos testes internos antes de serem liberadas ao público. No entanto, há uma infinidade de ambientes e configurações utilizados em todo o ecossistema React e não é possível testarmos contra todos eles.

Se você é o autor de um framework, biblioteca, ferramenta de desenvolvedor de terceiros ou projeto de infraestrutura similar, você pode nos ajudar a manter o React estável para seus usuários e toda a comunidade React executando periodicamente seu conjunto de testes contra as mudanças mais recentes. Se você estiver interessado, siga estes passos:

- Configure um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados tanto por [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto por [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes React para o mais recente lançamento do canal Canary, usando a tag `canary` no npm. Usando o cli npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute seu conjunto de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com a próxima versão menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise registrando um [problema](https://github.com/facebook/react/issues).

Um projeto que utiliza este fluxo de trabalho é o Next.js. Você pode consultar a [configuração do CircleCI deles](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como exemplo.

### Canal Experimental {/*experimental-channel*/}

Como o Canary, o canal Experimental é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Ao contrário do Canary, os lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para um lançamento mais amplo.

Normalmente, uma atualização para o Canary é acompanhada por uma atualização correspondente para o Experimental. Eles são baseados na mesma revisão de origem, mas são construídos usando um conjunto diferente de bandeiras de recursos.

Os lançamentos Experimentais podem ser significativamente diferentes dos lançamentos para Canary e Último. **Não use lançamentos Experimentais em aplicativos voltados para o usuário.** Você deve esperar mudanças que quebram a compatibilidade entre lançamentos no canal Experimental.

Os lançamentos no Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, ex: `0.0.0-experimental-68053d940-20210623`.

#### O que vai em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para serem lançados ao público mais amplo e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados – a razão pela qual temos experimentos é testar a viabilidade de mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos os Hooks, teríamos lançado os Hooks no canal Experimental semanas antes de estarem disponíveis no Último.

Você pode considerar valioso executar testes de integração contra o Experimental. Isso depende de você. No entanto, esteja ciente de que o Experimental é ainda menos estável que o Canary. **Não garantimos qualquer estabilidade entre lançamentos Experimentais.**

#### Como posso saber mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ou não ser documentados. Normalmente, os experimentos não são documentados até que estejam próximos do lançamento no Canary ou Último.

Se um recurso não estiver documentado, ele pode ser acompanhado por um [RFC](https://github.com/reactjs/rfcs).

Postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que divulgaremos publicamente todos os experimentos.

Você pode sempre consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público no GitHub para uma lista abrangente de mudanças.