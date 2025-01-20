---
title: Política de Versionamento
---

<Intro>

Todas as versões estáveis do React passam por um alto nível de testes e seguem os princípios de versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Para uma lista de versões anteriores, veja a página [Versões](/versions).

## Lançamentos estáveis {/*stable-releases*/}

Lançamentos estáveis do React (também conhecidos como canal de lançamento "Último") seguem os princípios de [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao lançar **correções críticas de bugs**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças incompatíveis**, fazemos um **lançamento maior** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Os lançamentos maiores também podem conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças Incompatíveis {/*breaking-changes*/}

Mudanças incompatíveis são inconvenientes para todos, então tentamos minimizar o número de lançamentos maiores – por exemplo, o React 15 foi lançado em abril de 2016, o React 16 foi lançado em setembro de 2017 e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que lançamentos menores são frequentemente mais interessantes e atraentes do que lançamentos maiores, apesar de seu nome modesto.

### Compromisso com a estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Sempre que possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins têm sido desencorajados por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos códigos ainda os utilizam em código legado estável.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. O código do Facebook sozinho possui mais de 50.000 componentes React. Isso significa que precisamos tornar tão fácil quanto possível a atualização para novas versões do React; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas a versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas pode atualizar mais de 50.000 componentes sozinha, esperamos que a atualização seja gerenciável para qualquer um usando o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe dos componentes, que então incluímos no lançamento de código aberto para que todos possam usar.

### Upgrades graduais via avisos {/*gradual-upgrades-via-warnings*/}

As versões de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças incompatíveis. Dessa forma, se seu aplicativo não tiver avisos na versão mais recente, ele será compatível com a próxima versão maior. Isso permite que você atualize seus aplicativos um componente de cada vez.

Os avisos de desenvolvimento não afetarão o comportamento em tempo de execução do seu aplicativo. Assim, você pode se sentir confiante de que seu aplicativo se comportará da mesma maneira entre as versões de desenvolvimento e produção -- as únicas diferenças são que a versão de produção não registrará os avisos e que é mais eficiente. (Se você notar o contrário, por favor, registre um problema.)

### O que conta como uma mudança incompatível? {/*what-counts-as-a-breaking-change*/}

Em geral, nós *não* aumentamos o número da versão maior para mudanças em:

* **Avisos de desenvolvimento.** Como esses não afetam o comportamento de produção, podemos adicionar novos avisos ou modificar os existentes entre versões maiores. Na verdade, isso é o que nos permite avisar de forma confiável sobre próximas mudanças incompatíveis.
* **APIs que começam com `unstable_`.** Essas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança. Ao lançar essas com o prefixo `unstable_`, podemos iterar mais rápido e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma maneira de testar novos recursos rapidamente, mas precisamos da flexibilidade para fazer alterações com base no que aprendemos no período alpha. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por sua conta.

Essa política foi projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão maior para todas essas mudanças, acabaríamos lançando mais versões maiores e, em última instância, causando mais dores de versionamento para a comunidade. Isso também significaria que não poderíamos avançar na melhoria do React tão rapidamente quanto gostaríamos.

Dito isso, se esperarmos que uma mudança nesta lista cause problemas amplos na comunidade, faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não incluir novos recursos, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser incrementada se funcionalidade nova ou melhorias substanciais forem introduzidas no código privado. Pode incluir alterações no nível de patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches em vez disso.

A resposta é que qualquer mudança no React (ou em outro software) traz algum risco de quebrar de maneiras inesperadas. Imagine um cenário onde um lançamento de patch que corrige um bug acidentalmente introduz um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria sua confiança em futuros lançamentos de patch. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um bom histórico de manter os lançamentos do React livres de bugs, mas lançamentos de patch têm um padrão ainda mais alto de confiabilidade, porque a maioria dos desenvolvedores assume que pode ser adotada sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para bugs críticos e vulnerabilidades de segurança.

Se um lançamento inclui alterações não essenciais — como refatorações internas, mudanças em detalhes de implementação, melhorias de desempenho ou correções de bugs menores — aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os canais de lançamento {/*all-release-channels*/}

O React depende de uma comunidade de código aberto vibrante para registrar relatórios de bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos versões especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas para desenvolvedores. Desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não devem se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Último**](#latest-channel) é para lançamentos estáveis de React semver. É o que você obtém ao instalar o React do npm. Este é o canal que você já está usando hoje. **Aplicativos voltados para o usuário que consomem o React diretamente usam este canal.**
- [**Canary**](#canary-channel) rastreia o branch principal do repositório de código fonte do React. Pense nisso como candidatos a lançamento para o próximo lançamento semver. **[Frameworks ou outras configurações curadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nos lançamentos estáveis. Esses também rastreiam o branch principal, mas com sinalizações de recursos adicionais ativadas. Use isso para experimentar recursos que serão lançados posteriormente.

Todos os lançamentos são publicados no npm, mas apenas o Último utiliza o versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seu conteúdo e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Último quanto Canary são oficialmente suportados para aplicativos voltados para o usuário, mas com expectativas diferentes**:

* Lançamentos Últimos seguem o modelo semver tradicional.
* Lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças incompatíveis. Eles existem para configurações curadas (como frameworks) que desejam liberar gradualmente novos recursos e correções de bugs do React em seu próprio cronograma de lançamentos.

As versões Experimentais são fornecidas apenas para fins de teste e não garantimos que o comportamento não mudará entre lançamentos. Elas não seguem o protocolo semver que usamos para lançamentos do Último.

Ao publicar pré-lançamentos no mesmo repositório que usamos para lançamentos estáveis, conseguimos aproveitar muitas ferramentas que suportam o fluxo de trabalho do npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Último {/*latest-channel*/}

Último é o canal usado para lançamentos estáveis do React. Corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados a usuários reais.

**Se você não tiver certeza de qual canal deve usar, é o Último.** Se você estiver usando o React diretamente, é isso que você já está usando. Você pode esperar que as atualizações do Último sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, conforme [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Último. Você pode pensar no Canary como um superconjunto do Último que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o mais recente lançamento Último é aproximadamente o mesmo que você encontraria entre dois lançamentos menores semver. No entanto, **o canal Canary não se conforma ao versionamento semântico.** Você deve esperar mudanças incompatíveis ocasionais entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicativos voltados para o usuário diretamente, a menos que você esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos no Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre React e outros projetos.

Todas as mudanças no React passam por extensivos testes internos antes de serem lançadas ao público. No entanto, há uma infinidade de ambientes e configurações usados em todo o ecossistema React, e não é possível para nós testar contra todos eles.

Se você é o autor de um framework React de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto de infraestrutura semelhante, você pode nos ajudar a manter o React estável para seus usuários e para toda a comunidade React executando periodicamente seu conjunto de testes contra as mudanças mais recentes. Se você estiver interessado, siga estas etapas:

- Configure um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados tanto pelo [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto pelo [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes React para o mais recente lançamento do canal Canary, usando a tag `canary` no npm. Usando a CLI do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute seu conjunto de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcionará com o próximo lançamento menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise registrando um [problema](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode se referir à [configuração do CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) deles como exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que rastreia o branch principal do repositório do React. Diferente do Canary, lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para um lançamento mais amplo.

Normalmente, uma atualização no Canary é acompanhada por uma atualização correspondente no Experimental. Ambos são baseados na mesma revisão de código fonte, mas são construídos usando um conjunto diferente de sinalizações de recursos.

Lançamentos Experimentais podem ser significativamente diferentes dos lançamentos do Canary e do Último. **Não use lançamentos Experimentais em aplicativos voltados para o usuário.** Você deve esperar mudanças incompatíveis frequentes entre lançamentos no canal Experimental.

Os lançamentos no Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que entra em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para ser lançados ao público mais amplo e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados -- a razão pela qual temos experimentos é para testar a viabilidade de mudanças propostas.

Por exemplo, se o canal Experimental existisse quando anunciamos os Hooks, teríamos lançado os Hooks no canal Experimental semanas antes de estarem disponíveis no Último.

Você pode achar valioso executar testes de integração contra lançamentos Experimentais. Isso fica a seu critério. No entanto, esteja avisado de que o Experimental é ainda menos estável que o Canary. **Não garantimos nenhuma estabilidade entre lançamentos Experimentais.**

#### Como posso aprender mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ser ou não documentados. Normalmente, experimentos não são documentados até estarem próximos de serem lançados no Canary ou Último.

Se um recurso não estiver documentado, ele pode ser acompanhado por um [RFC](https://github.com/reactjs/rfcs).

Nós publicaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que iremos divulgar cada experimento.

Você pode sempre consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público do GitHub para uma lista abrangente de mudanças.