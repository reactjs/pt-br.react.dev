---
title: Política de Versionamento
---

<Intro>

Todas as compilações estáveis do React passam por um alto nível de testes e seguem o versionamento semântico (semver). O React também oferece canais de lançamento instáveis para incentivar o feedback inicial sobre recursos experimentais. Esta página descreve o que você pode esperar dos lançamentos do React.

</Intro>

Para uma lista de lançamentos anteriores, veja a página [Versões](/versions).

## Lançamentos Estáveis {/*stable-releases*/}

Lançamentos estáveis do React (também conhecidos como canal de lançamento "Último") seguem os princípios do [versionamento semântico (semver)](https://semver.org/).

Isso significa que, com um número de versão **x.y.z**:

* Ao liberar **corrigendas críticas**, fazemos um **lançamento de patch** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao liberar **novos recursos** ou **correções não críticas**, fazemos um **lançamento menor** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao liberar **mudanças que quebram a compatibilidade**, fazemos um **lançamento major** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Lançamentos majors podem também conter novos recursos, e qualquer lançamento pode incluir correções de bugs.

Lançamentos menores são o tipo mais comum de lançamento.

### Mudanças Quebradoras {/*breaking-changes*/}

Mudanças quebradoras são inconvenientes para todos, então tentamos minimizar o número de lançamentos majors – por exemplo, o React 15 foi lançado em abril de 2016 e o React 16 foi lançado em setembro de 2017, e o React 17 foi lançado em outubro de 2020.

Em vez disso, lançamos novos recursos em versões menores. Isso significa que lançamentos menores geralmente são mais interessantes e atraentes do que os majors, apesar de seu nome discreto.

### Compromisso com a Estabilidade {/*commitment-to-stability*/}

À medida que alteramos o React ao longo do tempo, tentamos minimizar o esforço necessário para aproveitar novos recursos. Quando possível, manteremos uma API antiga funcionando, mesmo que isso signifique colocá-la em um pacote separado. Por exemplo, [mixins foram desencorajados durante anos](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), mas são suportados até hoje [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e muitos códigos ainda os utilizam em códigos legados estáveis.

Mais de um milhão de desenvolvedores usam o React, mantendo coletivamente milhões de componentes. A base de código do Facebook sozinha tem mais de 50.000 componentes React. Isso significa que precisamos tornar o processo de atualização para novas versões do React o mais fácil possível; se fizermos grandes mudanças sem um caminho de migração, as pessoas ficarão presas a versões antigas. Testamos esses caminhos de atualização no próprio Facebook – se nossa equipe de menos de 10 pessoas consegue atualizar sozinha mais de 50.000 componentes, esperamos que a atualização seja gerenciável para qualquer pessoa que use o React. Em muitos casos, escrevemos [scripts automatizados](https://github.com/reactjs/react-codemod) para atualizar a sintaxe dos componentes, que então incluímos no lançamento de código aberto para que todos possam usar.

### Atualizações Gradativas via Avisos {/*gradual-upgrades-via-warnings*/}

Compilações de desenvolvimento do React incluem muitos avisos úteis. Sempre que possível, adicionamos avisos em preparação para futuras mudanças quebradoras. Assim, se seu aplicativo não tem avisos na versão mais recente, ele será compatível com a próxima versão major. Isso permite que você atualize seus aplicativos um componente por vez.

Avisos de desenvolvimento não afetarão o comportamento em tempo de execução do seu aplicativo. Assim, você pode ter certeza de que seu aplicativo se comportará da mesma maneira entre as compilações de desenvolvimento e produção – as únicas diferenças são que a compilação de produção não registrará os avisos e será mais eficiente. (Se você notar o contrário, por favor, abra uma issue.)

### O que conta como uma mudança quebradora? {/*what-counts-as-a-breaking-change*/}

Em geral, nós *não* aumentamos o número da versão major para mudanças em:

* **Avisos de desenvolvimento.** Uma vez que estes não afetam o comportamento de produção, podemos adicionar novos avisos ou modificar avisos existentes entre as versões majors. Na verdade, isso é o que nos permite avisar de forma confiável sobre mudanças quebradoras futuras.
* **APIs que começam com `unstable_`.** Essas são fornecidas como recursos experimentais cujas APIs ainda não temos confiança. Ao liberar essas com um prefixo `unstable_`, podemos iterar mais rapidamente e chegar a uma API estável mais cedo.
* **Versões Alpha e Canary do React.** Fornecemos versões alpha do React como uma forma de testar novos recursos cedo, mas precisamos da flexibilidade para fazer mudanças com base no que aprendemos durante o período alpha. Se você usar essas versões, note que as APIs podem mudar antes do lançamento estável.
* **APIs não documentadas e estruturas de dados internas.** Se você acessar nomes de propriedades internas como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantias. Você está por sua conta.

Esta política foi projetada para ser pragmática: certamente, não queremos causar dores de cabeça para você. Se aumentássemos a versão major para todas essas mudanças, acabaríamos liberando mais versões majors e, por fim, causando mais dor de versão para a comunidade. Isso também significaria que não poderíamos avançar na melhoria do React tão rapidamente quanto gostaríamos.

Dito isso, se esperarmos que uma mudança nesta lista cause problemas amplos na comunidade, ainda faremos o nosso melhor para fornecer um caminho de migração gradual.

### Se um lançamento menor não inclui novos recursos, por que não é um patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

É possível que um lançamento menor não inclua novos recursos. [Isso é permitido pelo semver](https://semver.org/#spec-item-7), que afirma **"[uma versão menor] PODE ser incrementada se funcionalidades substanciais ou melhorias forem introduzidas dentro do código privado. Ela PODE incluir mudanças de nível patch."**

No entanto, isso levanta a questão de por que esses lançamentos não são versionados como patches.

A resposta é que qualquer mudança no React (ou em outro software) traz algum risco de quebrar de maneiras inesperadas. Imagine um cenário onde um lançamento de patch que corrige um bug acidentalmente introduz um bug diferente. Isso não apenas seria disruptivo para os desenvolvedores, mas também prejudicaria sua confiança em futuros lançamentos de patch. É especialmente lamentável se a correção original for para um bug que é raramente encontrado na prática.

Temos um histórico bastante bom no que diz respeito a manter os lançamentos do React livres de bugs, mas os lançamentos de patch têm um padrão ainda mais elevado de confiabilidade porque a maioria dos desenvolvedores assume que eles podem ser adotados sem consequências adversas.

Por essas razões, reservamos lançamentos de patch apenas para erros críticos e vulnerabilidades de segurança.

Se um lançamento inclui mudanças não essenciais – como refatorações internas, mudanças em detalhes de implementação, melhorias de desempenho ou correções menores de bugs – aumentaremos a versão menor mesmo quando não houver novos recursos.

## Todos os Canais de Lançamento {/*all-release-channels*/}

O React conta com uma comunidade de código aberto vibrante para registrar bugs, abrir pull requests e [submeter RFCs](https://github.com/reactjs/rfcs). Para incentivar feedback, às vezes compartilhamos compilações especiais do React que incluem recursos não lançados.

<Note>

Esta seção será mais relevante para desenvolvedores que trabalham em frameworks, bibliotecas ou ferramentas para desenvolvedores. Desenvolvedores que usam o React principalmente para construir aplicações de interface do usuário não devem se preocupar com nossos canais de pré-lançamento.

</Note>

Cada um dos canais de lançamento do React é projetado para um caso de uso distinto:

- [**Último**](#latest-channel) é para lançamentos estáveis do React com semver. É o que você recebe ao instalar o React do npm. Este é o canal que você já está usando hoje. **Aplicações voltadas para o usuário que consomem o React diretamente utilizam este canal.**
- [**Canary**](#canary-channel) rastreia o ramo principal do repositório de código-fonte do React. Pense nisso como candidatos a lançamento para o próximo lançamento semver. **[Frameworks ou outras configurações selecionadas podem optar por usar este canal com uma versão fixa do React.](/blog/2023/05/03/react-canaries). Você também pode usar Canaries para testes de integração entre o React e projetos de terceiros.**
- [**Experimental**](#experimental-channel) inclui APIs e recursos experimentais que não estão disponíveis nos lançamentos estáveis. Estes também rastreiam o ramo principal, mas com flags de recursos adicionais ativadas. Use isso para experimentar recursos que virão antes de serem lançados.

Todos os lançamentos são publicados no npm, mas apenas o Último utiliza o versionamento semântico. Pré-lançamentos (aqueles nos canais Canary e Experimental) têm versões geradas a partir de um hash de seus conteúdos e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503` para Canary e `0.0.0-experimental-388686f29-20230503` para Experimental.

**Tanto os canais Último quanto Canary são oficialmente suportados para aplicações voltadas para o usuário, mas com expectativas diferentes**:

* Lançamentos Último seguem o modelo tradicional de semver.
* Lançamentos Canary [devem ser fixados](/blog/2023/05/03/react-canaries) e podem incluir mudanças quebradoras. Eles existem para configurações selecionadas (como frameworks) que desejam lançar gradualmente novos recursos e correções de bugs do React em seu próprio cronograma de lançamentos.

Os lançamentos Experimentais são fornecidos apenas para fins de teste, e não fazemos garantias de que o comportamento não mudará entre os lançamentos. Eles não seguem o protocolo semver que usamos para lançamentos do Último.

Ao publicar pré-lançamentos no mesmo registro que usamos para lançamentos estáveis, conseguimos aproveitar as numerosas ferramentas que suportam o fluxo de trabalho npm, como [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canal Último {/*latest-channel*/}

Último é o canal usado para lançamentos estáveis do React. Ele corresponde à tag `latest` no npm. É o canal recomendado para todos os aplicativos React que são enviados para usuários reais.

**Se você não tem certeza de qual canal deve usar, é o Último.** Se você está usando o React diretamente, é isso que você já está usando. Você pode esperar que as atualizações para o Último sejam extremamente estáveis. As versões seguem o esquema de versionamento semântico, conforme [descrito anteriormente.](#stable-releases)

### Canal Canary {/*canary-channel*/}

O canal Canary é um canal de pré-lançamento que rastreia o ramo principal do repositório do React. Usamos pré-lançamentos no canal Canary como candidatos a lançamento para o canal Último. Você pode pensar no Canary como um superconjunto do Último que é atualizado com mais frequência.

O grau de mudança entre o lançamento Canary mais recente e o lançamento Último mais recente é aproximadamente o mesmo que você encontraria entre dois lançamentos menores de semver. No entanto, **o canal Canary não se conforma ao versionamento semântico.** Você deve esperar mudanças quebradoras ocasionais entre lançamentos sucessivos no canal Canary.

**Não use pré-lançamentos em aplicações voltadas para o usuário diretamente, a menos que esteja seguindo o [fluxo de trabalho Canary](/blog/2023/05/03/react-canaries).**

Lançamentos no Canary são publicados com a tag `canary` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `18.3.0-canary-388686f29-20230503`.

#### Usando o canal canary para testes de integração {/*using-the-canary-channel-for-integration-testing*/}

O canal Canary também suporta testes de integração entre o React e outros projetos.

Todas as mudanças no React passam por extensos testes internos antes de serem lançadas ao público. No entanto, existem uma infinidade de ambientes e configurações usados em todo o ecossistema do React, e não é possível para nós testarmos contra todos eles.

Se você é o autor de um framework, biblioteca, ferramenta de desenvolvimento ou projeto de infraestrutura semelhante de terceiros, você pode nos ajudar a manter o React estável para seus usuários e para toda a comunidade do React, executandoperiodicamente sua suíte de testes contra as mudanças mais recentes. Se você estiver interessado, siga estes passos:

- Configure um cron job usando sua plataforma de integração contínua preferida. Cron jobs são suportados tanto pelo [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) quanto pelo [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- No cron job, atualize seus pacotes do React para o mais recente lançamento do canal Canary, usando a tag `canary` no npm. Usando o cli do npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Execute sua suíte de testes contra os pacotes atualizados.
- Se tudo passar, ótimo! Você pode esperar que seu projeto funcione com o próximo lançamento menor do React.
- Se algo quebrar inesperadamente, por favor, nos avise abrindo uma [issue](https://github.com/facebook/react/issues).

Um projeto que usa esse fluxo de trabalho é o Next.js. Você pode consultar a [configuração do CircleCI deles](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) como exemplo.

### Canal Experimental {/*experimental-channel*/}

Assim como o Canary, o canal Experimental é um canal de pré-lançamento que rastreia o ramo principal do repositório do React. Ao contrário do Canary, lançamentos Experimentais incluem recursos e APIs adicionais que não estão prontos para um lançamento mais amplo.

Normalmente, uma atualização para o Canary é acompanhada por uma atualização correspondente para o Experimental. Elas são baseadas na mesma revisão de origem, mas são construídas usando um conjunto diferente de flags de recursos.

Lançamentos Experimentais podem ser significativamente diferentes dos lançamentos para Canary e Último. **Não use lançamentos Experimentais em aplicações voltadas para o usuário.** Você deve esperar mudanças quebradoras frequentes entre os lançamentos no canal Experimental.

Lançamentos no Experimental são publicados com a tag `experimental` no npm. As versões são geradas a partir de um hash do conteúdo da compilação e da data do commit, por exemplo, `0.0.0-experimental-68053d940-20210623`.

#### O que vai para um lançamento experimental? {/*what-goes-into-an-experimental-release*/}

Recursos experimentais são aqueles que não estão prontos para serem lançados ao público mais amplo e podem mudar drasticamente antes de serem finalizados. Alguns experimentos podem nunca ser finalizados – a razão pela qual temos experimentos é testar a viabilidade de mudanças propostas.

Por exemplo, se o canal Experimental tivesse existido quando anunciamos Hooks, teríamos lançado Hooks no canal Experimental semanas antes de estarem disponíveis no Último.

Você pode achar valioso executar testes de integração contra o Experimental. Isso fica a seu critério. No entanto, esteja avisado de que o Experimental é ainda menos estável do que o Canary. **Não garantimos estabilidade entre os lançamentos Experimentais.**

#### Como posso aprender mais sobre recursos experimentais? {/*how-can-i-learn-more-about-experimental-features*/}

Recursos experimentais podem ou não ser documentados. Normalmente, experimentos não são documentados até que estejam próximos de serem lançados no Canary ou Último.

Se um recurso não estiver documentado, ele pode ser acompanhado por um [RFC](https://github.com/reactjs/rfcs).

Nós postaremos no [blog do React](/blog) quando estivermos prontos para anunciar novos experimentos, mas isso não significa que vamos divulgar todos os experimentos.

Você pode sempre consultar o [histórico](https://github.com/facebook/react/commits/main) do nosso repositório público no GitHub para uma lista abrangente de mudanças.