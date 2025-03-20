---
title: "React Canaries: Habilitando o lançamento incremental de recursos fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, and Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes que sejam lançados em uma versão estável - semelhante a como o Meta usa há muito tempo versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamento do React.
---

3 de maio de 2023 por [Dan Abramov](https://bsky.app/profile/danabra.mov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes que sejam lançados em uma versão estável - semelhante a como o Meta usa há muito tempo versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamento do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como ele é oficialmente suportado, se houver alguma regressão, vamos tratá-las com urgência semelhante à de bugs em lançamentos estáveis.
* Canaries permite que você comece a usar novos recursos individuais do React antes que eles cheguem aos lançamentos semver-estáveis.
* Diferente do canal [Experimental](/community/versioning-policy#experimental-channel), React Canaries só inclui recursos que acreditamos razoavelmente estarem prontos para adoção. Incentivamos os frameworks a considerar a inclusão de lançamentos Canary React fixados.
* Anunciaremos alterações de última hora e novos recursos em nosso blog quando eles chegarem aos lançamentos Canary.
* **Como sempre, o React continua a seguir o semver para cada lançamento Stable.**

## Como os recursos do React são geralmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Normalmente, cada recurso do React passou pelos mesmos estágios:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Neste ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe no Meta disposta a nos ajudar a testar esse recurso e fornecer feedback sobre ele. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes no Meta para experimentá-lo.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e disponibilizamos o recurso no branch `main` por padrão, que a maioria dos produtos do Meta usa. Neste ponto, qualquer equipe no Meta pode usar este recurso.
4. Conforme ganhamos confiança na direção, também postamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um amplo conjunto de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos perto de cortar um lançamento de código aberto, escrevemos a documentação para o recurso e, finalmente, lançamos o recurso em um lançamento estável do React.

Este playbook funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando ele é lançado em código aberto (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem do Meta e adotar novos recursos individuais mais cedo (à medida que se tornam disponíveis) sem ter que esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React acabarão em um lançamento Stable.

## Podemos apenas fazer mais lançamentos secundários? {/*can-we-just-do-more-minor-releases*/}

Geralmente, nós *usamos* lançamentos secundários para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram totalmente concluídos e que ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque eles afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar nas peças que não estão prontas sem uma enxurrada de lançamentos de versão principal, o que o semver exigiria que fizéssemos.

No Meta, resolvemos esse problema construindo o React a partir do branch `main` e atualizando-o manualmente para um commit específico fixado a cada semana. Esta também é a abordagem que os lançamentos do React Native vêm seguindo nos últimos anos. Cada lançamento *estável* do React Native é fixado em um commit específico do branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adote incrementalmente novos recursos do React no nível do framework sem se acoplar ao cronograma global de lançamento do React.

Gostaríamos de disponibilizar este fluxo de trabalho para outros frameworks e configurações curadas. Por exemplo, ele permite que um framework *em cima* do React inclua uma alteração de última hora relacionada ao React *antes* que essa alteração seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas alterações de última hora afetam apenas as integrações do framework. Isso permite que um framework publique tal alteração em sua própria versão secundária sem quebrar o semver.

Lançamentos contínuos com o canal Canaries nos permitirão ter um ciclo de feedback mais restrito e garantir que os novos recursos recebam testes abrangentes na comunidade. Este fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões JavaScript, [lida com alterações em estágios numerados](https://tc39.es/process-document/). Os novos recursos do React podem estar disponíveis em frameworks construídos no React antes que estejam em um lançamento estável do React, assim como os novos recursos do JavaScript são lançados em navegadores antes que sejam oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos Experimental](/community/versioning-policy#canary-channel), nós recomendamos não usá-los em produção porque as APIs experimentais podem sofrer mudanças de última hora significativas a caminho da estabilização (ou podem até ser removidas inteiramente). Embora os Canaries também possam conter erros (como em qualquer lançamento), daqui para frente planejamos anunciar quaisquer mudanças de última hora significativas nos Canaries em nosso blog. Os Canaries são os mais próximos do código que o Meta executa internamente, então você geralmente pode esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e verificar manualmente o log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas que usam o React fora de uma configuração selecionada (como um framework) queiram continuar a usar os lançamentos Stable.** No entanto, se você estiver construindo um framework, talvez queira considerar a inclusão de uma versão Canary do React fixada em um commit específico e atualizá-la em seu próprio ritmo. A vantagem disso é que permite que você entregue recursos e correções de bugs individuais e concluídos do React mais cedo para seus usuários e em seu próprio cronograma de lançamento, semelhante a como o React Native tem feito nos últimos anos. A desvantagem é que você assumiria a responsabilidade adicional de revisar quais commits do React estão sendo inseridos e comunicar aos seus usuários quais alterações do React estão incluídas em seus lançamentos.

Se você é um autor de framework e quer experimentar essa abordagem, entre em contato conosco.

## Anunciando as mudanças de última hora e novos recursos antecipadamente {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nossa melhor estimativa do que entrará no próximo lançamento estável do React em um determinado momento.

Tradicionalmente, só anunciamos alterações de última hora no *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma forma oficialmente suportada de consumir o React, planejamos mudar para anunciar as alterações de última hora e os novos recursos significativos *à medida que eles chegam* aos Canaries. Por exemplo, se mesclarmos uma mudança de última hora que será lançada em um Canary, escreveremos uma postagem sobre isso no blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está lançando uma versão principal que atualiza o canary React fixado para incluir essa alteração, você pode vincular à nossa postagem no blog de suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, vamos vincular a essas postagens de blog já publicadas, o que esperamos ajudar nossa equipe a progredir mais rápido.

Planejamos documentar as APIs à medida que elas chegam aos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora deles. As APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que você está usando. Como os Canaries são pré-lançamentos, eles ainda podem incluir alterações de última hora.

## Exemplo: React Server Components {/*example-react-server-components*/}

Como [anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções React Server Components foram finalizadas e não esperamos alterações de última hora significativas relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar o suporte para React Server Components em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos interligados apenas para framework (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais alterações de última hora lá.

Isso significa que o React Server Components está pronto para ser adotado por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é enviar uma versão Canary do React fixada. (Para evitar a inclusão de duas cópias do React, os frameworks que desejam fazer isso precisariam impor a resolução do `react` e `react-dom` para o Canary fixado que enviam com seu framework e explicar isso para seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra as versões Stable e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que os autores de bibliotecas testem cada lançamento Canary, pois seria proibitivamente difícil. No entanto, assim como quando [introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), incentivamos as bibliotecas a executar testes em *ambas* as versões Stable e Canary mais recentes. Se você vir uma mudança de comportamento que não foi anunciada, registre um bug no repositório do React para que possamos ajudá-lo a diagnosticá-lo. Esperamos que, à medida que essa prática se torna amplamente adotada, ela reduza a quantidade de esforço necessário para atualizar as bibliotecas para as novas versões principais do React, visto que as regressões acidentais seriam encontradas à medida que chegam.

<Note>

Estritamente falando, Canary não é um canal de lançamento *novo* - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando-o como um canal de lançamento *novo* para comunicar as novas expectativas, como o fato de os Canaries serem uma forma oficialmente suportada de usar o React.

</Note>

## Os lançamentos Stable funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma alteração nos lançamentos estáveis do React.
``