---
title: Política de Versão
---

<Intro>

Todas as versões estáveis do React passam por um alto nível de teste e seguem a versão semântica (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback antecipado sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Esta política de versionamento descreve nossa abordagem aos números de versão para pacotes como `react` e `react-dom`. Para uma lista de lançamentos anteriores, consulte a página [Versões](/versions).

## Versões estáveis {/*stable-releases*/}

As versões estáveis do React (também conhecidas como canal de lançamento "Mais recente") seguem os princípios de [versionamento semântico (semver)](https://semver.org/).

Isso significa que com um número de versão **x.y.z**:

* Ao lançar **correções de bugs críticos**, fazemos uma **versão de correção** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao lançar **novos recursos** ou **correções não críticas**, fazemos uma **versão secundária** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao lançar **mudanças de última hora**, fazemos uma **versão principal** alterando o número **x** (ex: 15.6.2 para 16.0.0).

As versões principais também podem conter novos recursos, e qualquer versão pode incluir correções de bugs.

As versões secundárias são o tipo de lançamento mais comum.

Sabemos que nossos usuários continuam a usar versões antigas do React em produção. Se soubermos de uma vulnerabilidade de segurança no React, lançamos uma correção retroportada para todas as versões principais afetadas pela vulnerabilidade.

### Mudanças de última hora {/*breaking-changes*/}

Mudanças de última hora são inconvenientes para todos, por isso tentamos minimizar o número de lançamentos principais – por exemplo, o React 15 foi lançado em abril de 2016 e o React 16 foi lançado em setembro de 2017, e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões secundárias. Isso significa que as versões secundárias costumam ser mais interessantes e atraentes do que as principais, apesar de seu nome discreto.

### Compromisso com a estabilidade {/*commitment-to-stability*/}

À medida que mudamos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar os novos recursos. Quando possível, manteremos uma API mais antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins foram desencorajados por anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas eles são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos codebases continuam a usá-los em código estável e legado.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. O codebase do Facebook sozinho tem mais de 50.000 componentes React. Isso significa que precisamos tornar o mais fácil possível a atualização para as novas versões do React; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas em versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas consegue atualizar mais de 50.000 componentes sozinho, esperamos que a atualização seja gerenciável para qualquer pessoa que use React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe do componente, que então incluímos no lançamento de código aberto para todos usarem.

### Atualizações graduais por meio de avisos {/*gradual-upgrades-via-warnings*/}

As compilações de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças de última hora. Dessa forma, se seu aplicativo não apresentar avisos na versão mais recente, ele será compatível com a próxima versão principal. Isso permite que você atualize seus aplicativos um componente de cada vez.

Os avisos de desenvolvimento não afetarão o comportamento de tempo de execução do seu aplicativo. Dessa forma, você pode ter certeza de que seu aplicativo se comportará da mesma maneira entre as compilações de desenvolvimento e produção - as únicas diferenças são que a compilação de produção não registrará os avisos e que ela é mais eficiente. (Se você notar o contrário, por favor, registre um erro.)

### O que conta como uma mudança de última hora? {/*what-counts-as-a-breaking-change*/}

Em geral, *não* aumentamos o número da versão principal para alterações em:

*   **Avisos de desenvolvimento.** Como esses avisos não afetam o comportamento de produção, podemos adicionar novos avisos ou modificar os avisos existentes entre as versões principais. Na verdade, é isso que nos permite avisar de forma confiável sobre as próximas mudanças de última hora.
*   **APIs começando com `unstable_`.** Estas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança suficiente. Ao lançá-los com um prefixo `unstable_`, podemos iterar mais rapidamente e obter uma API estável mais cedo.
*   **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma forma de testar novos recursos antecipadamente, mas precisamos da flexibilidade para fazer alterações com base no que aprendemos no período alfa. Se você usar essas versões, observe que as APIs podem mudar antes do lançamento estável.
*   **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia. Você está por sua conta.

Esta política foi projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão principal para todas essas mudanças, acabaríamos lançando mais versões principais e, em última análise, causando mais dificuldades de versionamento para a comunidade. Também significaria que não podemos progredir na melhoria do React tão rápido quanto gostaríamos.

Dito isto, se esperarmos que uma mudança nesta lista cause grandes problemas na comunidade, faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento secundário não incluir novos recursos, por que não é uma correção? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que uma versão secundária não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"\[uma versão secundária] PODE ser incrementada se novas funcionalidades ou melhorias substanciais forem introduzidas no código privado. Pode incluir mudanças no nível de correção."**

No entanto, isso levanta a questão de por que essas versões não são versionadas como correções.

A resposta é que qualquer mudança no React (ou outro software) acarreta algum risco de quebra de maneiras inesperadas. Imagine um cenário em que uma versão de correção que corrige um bug introduza acidentalmente um bug diferente. Isso não seria apenas perturbador para os desenvolvedores, mas também prejudicaria sua confiança em futuras versões de correção. É especialmente lamentável se a correção original for para um bug que raramente é encontrado na prática.

Temos um bom histórico de manter os lançamentos do React livres de bugs, mas as versões de correção têm um padrão ainda mais alto de confiabilidade porque a maioria dos desenvolvedores supõe que podem ser adotadas sem consequências adversas.

Por essas razões, reservamos as versões de correção apenas para os bugs e vulnerabilidades de segurança mais críticos.

Se uma versão incluir alterações não essenciais — como refatorações internas, alterações nos detalhes de implementação, melhorias de desempenho ou pequenas correções de bugs — aumentaremos a versão secundária, mesmo quando não houver novos recursos.

## Todos os canais de lançamento {/*all-release-channels*/}

O React depende de uma próspera comunidade de código aberto para registrar relatórios de erros, abrir solicitações de pull e [enviar RFCs](https://github.com/reactjs/rfcs). Para incentivar o feedback, às vezes compartilhamos compilações especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para os desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas de desenvolvedor. Os desenvolvedores que usam o React principalmente para construir aplicativos voltados para o usuário não precisam se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React foi projetado para um caso de uso distinto:

-   [**Mais recente**](#latest-channel) é para versões estáveis do React semver e é o que você obtém quando instala o React do npm. Este é o canal que você já está usando hoje. **Aplicativos voltados para o usuário que usam o React diretamente usam este canal.**
-   [**Canary**](#canary-channel) acompanha o branch principal do repositório de código-fonte do React. Pense neles como candidatos a lançamento para a próxima versão semver. **[Frameworks ou outras configurações selecionadas podem optar por usar este canal com uma versão fixada do React.](/blog/2023/05/03/react-canaries) Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
-   [**Experimental**](#experimental-channel)inclui APIs e recursos experimentais que não estão disponíveis nas versões estáveis. Estes também acompanham o branch principal, mas com sinalizadores de recursos adicionais ativados. Use isso para experimentar os próximos recursos antes que eles sejam lançados.

Todas as versões são publicadas no npm, mas apenas Latest usa versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seu conteúdo e da data da confirmação, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Latest quanto Canary são oficialmente suportados para aplicativos voltados para o usuário, mas com expectativas diferentes**:

*   As versões Latest seguem o modelo semver tradicional.
*   As versões Canary [devem ser fixadas](/blog/2023/05/03/react-canaries) e podem incluir mudanças de última hora. Eles existem para configurações selecionadas (como frameworks) que desejam lançar gradualmente novos recursos e correções de bugs do React em sua própria programação de lançamento.

As versões Experimentais são fornecidas apenas para fins de teste e não oferecemos nenhuma garantia de que o comportamento não mudará entre as versões. Eles não seguem o protocolo semver que usamos para lançamentos do Latest.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, podemos aproveitar as muitas ferramentas que suportam o fluxo de trabalho do npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Mais recente {/*latest-channel*/}

Latest é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados para usuários reais.

**Se você não tiver certeza de qual canal deve usar, é Latest.** Se você estiver usando o React diretamente, é isso que você já está usando. Você pode esperar que as atualizações para Latest sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, conforme [descrito anteriormente](#stable-releases).

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que acompanha o branch principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Latest. Você pode pensar em Canary como um superconjunto de Latest que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Latest mais recente é aproximadamente o mesmo que você encontraria entre duas versões secundárias semver. No entanto, **o canal Canary não está em conformidade com o versionamento semântico.** Você deve esperar mudanças de última hora ocasionais entre as versões sucessivas no canal Canary.

**Não use pré-lançamentos em aplicativos voltados para o usuário diretamente, a menos que você esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

As versões no Canary são publicadas com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data da confirmação, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as alterações no React passam por extensos testes internos antes de serem lançadas ao público. No entanto, há uma miríade de ambientes e configurações usadas em todo o ecossistema React, e não é possível para nós testar contra todos eles.

Se você é o autor de um framework React de terceiros, biblioteca, ferramenta de desenvolvedor ou projeto semelhante de tipo de infraestrutura, pode nos ajudar a manter o React estável para seus usuários e para toda a comunidade React executando periodicamente seu conjunto de testes em relação às alterações mais recentes. Se você estiver interessado, siga estas etapas:

*   Configure um job cron usando sua plataforma de integração contínua preferida. Os jobs cron são suportados por [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) e [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
*   No job cron, atualize seus pacotes React para o lançamento React mais recente no canal Canary, usando a tag `canary` no npm. Usando o cli do npm:

    ```console
    npm update react@canary react-dom@canary
    ```

    Ou yarn:

    ```console
    yarn upgrade react@canary react-dom@canary
    ```
*   Execute seu conjunto de testes em relação aos pacotes atualizados.
*   Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com a próxima versão secundária do React.
*   Se algo quebrar inesperadamente, por favor, nos avise [registrando um erro](https://github.com/facebook/react/issues).

Um projeto que usa este fluxo de trabalho é o Next.js. Você pode consultar sua [configuração do CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como exemplo.

### Canal Experimental {/*experimental-channel*/}

Como Canary, o canal Experimental é um canal de pré-lançamento que acompanha o branch principal do repositório do React. Ao contrário do Canary, as versões Experimentais incluem recursos e APIs adicionais que não estão prontos para lançamento mais amplo.

Normalmente, uma atualização para Canary é acompanhada por uma atualização correspondente para Experimental. Eles são baseados na mesma revisão de origem, mas são construídos usando um conjunto diferente de sinalizadores de recursos.

As versões experimentais podem ser significativamente diferentes das versões do Canary e do Latest. **Não use as versões experimentais em aplicativos voltados para o usuário.** Você deve esperar frequentes mudanças de última hora entre as versões no canal Experimental.

As versões em Experimental são publicadas com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data da confirmação, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que vai em uma versão experimental? {/*what-goes-into-an-experimental-release*/}

Os recursos experimentais são aqueles que não estão prontos para serem lançados ao público em geral e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados - a razão pela qual temos experimentos é para testar a viabilidade das alterações propostas.

Por exemplo, se o canal Experimental existisse quando anunciamos os Hooks, teríamos lançado os Hooks no canal Experimental semanas antes de estarem disponíveis no Latest.

Você pode achar valioso executar testes de integração em relação ao Experimental. Isso é com você. No entanto, esteja ciente de que Experimental é ainda menos estável do que Canary. **Não garantimos nenhuma estabilidade entre as versões Experimentais.**

#### Como posso aprender mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Os recursos experimentais podem ou não ser documentados. Normalmente, os experimentos não são documentados até estarem próximos do lançamento em Canary ou Latest.

Se um recurso não estiver documentado, eles podem ser acompanhados por um [RFC](https://github.com/reactjs/rfcs).

Publicaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que divulgaremos todos os experimentos.

Você sempre pode consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público do GitHub para obter uma lista abrangente de alterações.
``