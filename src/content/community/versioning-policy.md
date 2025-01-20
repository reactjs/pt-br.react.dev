---
title: Política de Versionamento
---

<Intro>

Todas as compilações estáveis do React passam por um alto nível de testes e seguem o versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Para uma lista dos lançamentos anteriores, consulte a página [Versões](/versions).

## Lançamentos estáveis {/*stable-releases*/}

Os lançamentos estáveis do React (também conhecidos como "canal de lançamento mais recente") seguem os princípios do [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticas**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças que quebram a compatibilidade**, fazemos um **lançamento maior** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Lançamentos maiores também podem conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças que quebram a compatibilidade {/*breaking-changes*/}

Mudanças que quebram a compatibilidade são inconvenientes para todos, por isso tentamos minimizar o número de lançamentos maiores – por exemplo, o React 15 foi lançado em abril de 2016 e o React 16 foi lançado em setembro de 2017, e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que lançamentos menores são muitas vezes mais interessantes e atraentes do que lançamentos maiores, apesar de seu nome discreto.

### Compromisso com a estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Sempre que possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins foram desencorajadas por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas elas são suportadas até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos códigos ainda as utilizam em códigos legados estáveis.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. O código do Facebook sozinho tem mais de 50.000 componentes React. Isso significa que precisamos tornar o upgrade para novas versões do React o mais fácil possível; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas a versões antigas. Testamos esses caminhos de upgrade no próprio Facebook – se nossa equipe de menos de 10 pessoas consegue atualizar mais de 50.000 componentes sozinha, esperamos que o upgrade seja gerenciável para qualquer um usando o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe de componentes, que incluímos na versão de código aberto para todos usarem.

### Upgrades graduais via avisos {/*gradual-upgrades-via-warnings*/}

Compilações de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças que quebram a compatibilidade. Dessa forma, se seu aplicativo não tiver avisos na versão mais recente, ele será compatível com a próxima versão maior. Isso permite que você atualize seus aplicativos um componente por vez.

Avisos de desenvolvimento não afetarão o comportamento em tempo de execução do seu aplicativo. Assim, você pode se sentir confiante de que seu aplicativo se comportará da mesma forma entre as compilações de desenvolvimento e produção -- as únicas diferenças são que a compilação de produção não registrará os avisos e que ela é mais eficiente. (Se você notar o contrário, por favor, registre um problema.)

### O que conta como uma mudança que quebra a compatibilidade? {/*what-counts-as-a-breaking-change*/}

Em geral, *não* aumentamos o número da versão maior para mudanças em:

* **Avisos de desenvolvimento.** Como esses não afetam o comportamento em produção, podemos adicionar novos avisos ou modificar avisos existentes entre versões maiores. Na verdade, isso permite que advertamos de forma confiável sobre as próximas mudanças que quebram a compatibilidade.
* **APIs começando com `unstable_`.** Essas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança. Ao lançá-las com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma forma de testar novos recursos precocemente, mas precisamos da flexibilidade para fazer mudanças com base no que aprendemos no período alpha. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por conta própria.

Esta política foi projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão maior para todas essas mudanças, acabaríamos lançando mais versões maiores e, em última análise, causando mais dor de versionamento para a comunidade. Também significaria que não poderíamos progredir na melhoria do React tão rapidamente quanto gostaríamos.

Dito isso, se esperamos que uma mudança nesta lista cause problemas amplos na comunidade, ainda faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não inclui novos recursos, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser aumentada se funcionalidades ou melhorias substanciais forem introduzidas dentro do código privado. Também PODE incluir mudanças no nível de patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches.

A resposta é que qualquer mudança no React (ou outro software) carrega algum risco de quebrar de maneiras inesperadas. Imagine um cenário onde um lançamento de patch que corrige um bug introduz acidentalmente um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria sua confiança em futuros lançamentos de patch. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um histórico bastante bom em manter os lançamentos do React livres de bugs, mas os lançamentos de patch têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores assume que pode ser adotado sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se um lançamento inclui mudanças não essenciais — como refatorações internas, mudanças em detalhes de implementação, melhorias de desempenho ou pequenas correções de bugs — aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os canais de lançamento {/*all-release-channels*/}

O React conta com uma comunidade de código aberto próspera para registrar relatórios de bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos compilações especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvedor. Desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não precisam se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Mais Recente**](#latest-channel) é para lançamentos estáveis do React semver. É o que você obtém ao instalar o React do npm. Este é o canal que você já está usando hoje. **Aplicativos voltados para o usuário que consomem React diretamente usam este canal.**
- [**Canary**](#canary-channel) acompanha o branch principal do repositório do código-fonte do React. Pense nisso como candidatos a lançamento para o próximo lançamento semver. **[Frameworks ou outras configurações curadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nos lançamentos estáveis. Esses também acompanham o branch principal, mas com flags de recursos adicionais ativadas. Use isso para experimentar novos recursos antes que eles sejam lançados.

Todos os lançamentos são publicados no npm, mas apenas o Mais Recente utiliza o versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seus conteúdos e a data do commit, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Mais Recente quanto Canary são oficialmente suportados para aplicativos voltados para o usuário, mas com expectativas diferentes**:

* As versões Mais Recente seguem o modelo tradicional semver.
* As versões Canary [devem ser fixadas](/blog/2023/05/03/react-canaries) e podem incluir mudanças que quebram a compatibilidade. Elas existem para configurações curadas (como frameworks) que desejam liberar gradualmente novos recursos e correções de bugs do React em seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não garantimos que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Mais Recente.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, conseguimos aproveitar as muitas ferramentas que suportam o fluxo de trabalho npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Mais Recente {/*latest-channel*/}

Mais Recente é o canal usado para lançamentos estáveis do React. Corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados para usuários reais.

**Se você não tiver certeza de qual canal deve usar, é o Mais Recente.** Se você estiver usando o React diretamente, é isso que você já está usando. Você pode esperar que as atualizações para o Mais Recente sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, conforme [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que acompanha o branch principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Mais Recente. Você pode pensar no Canary como um superconjunto do Mais Recente que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Mais Recente mais recente é aproximadamente o mesmo que você encontraria entre dois lançamentos menores de semver. No entanto, **o canal Canary não se conforma ao versionamento semântico.** Você deve esperar mudanças que quebram a compatibilidade entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicativos voltados para o usuário diretamente, a menos que você esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Os lançamentos em Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal Canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as mudanças no React passam por extensos testes internos antes de serem lançadas ao público. No entanto, há uma infinidade de ambientes e configurações usados em todo o ecossistema React, e não é possível para nós testar contra todos eles.

Se você é o autor de um framework React de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto de infraestrutura semelhante, pode nos ajudar a manter o React estável para seus usuários e para toda a comunidade React, executando periodicamente seu conjunto de testes contra as mudanças mais recentes. Se estiver interessado, siga estas etapas:

- Configurar um trabalho cron usando sua plataforma de integração contínua preferida. Trabalhos cron são suportados por [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) e [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No trabalho cron, atualize seus pacotes React para o lançamento mais recente no canal Canary, usando a tag `canary` no npm. Usando a cli do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute seu conjunto de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com o próximo lançamento menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise registrando um [problema](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode consultar a [configuração do CircleCI deles](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que acompanha o branch principal do repositório do React. Diferentemente do Canary, lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para um lançamento mais amplo.

Geralmente, uma atualização para o Canary é acompanhada por uma atualização correspondente ao Experimental. Eles são baseados na mesma revisão de código, mas são construídos usando um conjunto diferente de flags de recursos.

Lançamentos Experimentais podem ser significativamente diferentes dos lançamentos para Canary e Mais Recente. **Não use lançamentos Experimentais em aplicativos voltados para o usuário.** Você deve esperar mudanças que quebram a compatibilidade com frequência entre os lançamentos no canal Experimental.

Os lançamentos em Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que entra em um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para serem lançados ao público em geral e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados — a razão pela qual temos experimentos é para testar a viabilidade das mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos Hooks, teríamos lançado Hooks para o canal Experimental semanas antes que estivessem disponíveis no Mais Recente.

Você pode achar valioso executar testes de integração contra o Experimental. Isso depende de você. No entanto, tenha em mente que o Experimental é ainda menos estável do que o Canary. **Não garantimos estabilidade entre lançamentos Experimentais.**

#### Como posso saber mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ou não ser documentados. Normalmente, os experimentos não são documentados até que estejam perto de serem enviados ao Canary ou ao Mais Recente.

Se um recurso não estiver documentado, ele pode estar acompanhado por um [RFC](https://github.com/reactjs/rfcs).

Nós postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que vamos divulgar cada experimento.

Você sempre pode consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público no GitHub para uma lista abrangente de mudanças.