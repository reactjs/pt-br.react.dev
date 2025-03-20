---
title: "React Canaries: Habilitando a Implantação Incremental de Recursos Fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, and Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes que sejam lançados em uma versão estável - semelhante à forma como a Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações selecionadas como frameworks desacoplem a adoção de recursos individuais do React da programação de lançamento do React.
---

3 de maio de 2023, por [Dan Abramov](https://bsky.app/profile/danabra.mov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes que sejam lançados em uma versão estável - semelhante à forma como a Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações selecionadas como frameworks desacoplem a adoção de recursos individuais do React da programação de lançamento do React.

</Intro>

---

## Resumo {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para React. Como ele é oficialmente suportado, se houver alguma regressão, nós as trataremos com uma urgência semelhante a erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novos recursos individuais do React antes que entrem nos lançamentos semver-estáveis.
* Diferente do canal [Experimental](/community/versioning-policy#experimental-channel), React Canaries só inclui recursos que acreditamos razoavelmente estarem prontos para adoção. Encorajamos os frameworks a considerarem a inclusão de versões Canary do React fixadas.
* Anunciaremos as mudanças significativas e os novos recursos em nosso blog assim que chegarem aos lançamentos Canary.
* **Como sempre, o React continua a seguir o semver para cada lançamento Estável.**

## Como os recursos do React são normalmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Tipicamente, cada recurso do React passou pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso só está disponível no canal de lançamento `experimental`. Neste ponto, o recurso deve mudar significativamente.
2. Encontramos uma equipe da Meta disposta a nos ajudar a testar esse recurso e fornecer feedback sobre ele. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes na Meta para experimentá-lo.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e disponibilizamos o recurso no branch `main` por padrão, que a maioria dos produtos da Meta usa. Neste ponto, qualquer equipe da Meta pode usar esse recurso.
4. À medida que ganhamos confiança na direção, também postamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um amplo conjunto de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos perto de cortar um lançamento de código aberto, escrevemos documentação para o recurso e, finalmente, lançamos o recurso em um lançamento estável do React.

Este roteiro funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando é lançado em código aberto (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem da Meta e adotar novos recursos individuais mais cedo (assim que estiverem disponíveis) sem ter que esperar o próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente chegarão a um lançamento Estável.

## Podemos apenas fazer mais lançamentos secundários? {/*can-we-just-do-more-minor-releases*/}

Geralmente, nós *usamos* lançamentos secundários para apresentar novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram totalmente concluídos e que ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar nas partes que não estão prontas sem uma enxurrada de lançamentos de versão principal, o que semver exigiria que fizéssemos.

Na Meta, resolvemos esse problema construindo o React a partir do branch `main` e atualizando-o manualmente para um commit fixado específico a cada semana. Esta também é a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado em um commit específico do branch `main` do repositório do React. Isso permite que o React Native inclua correções de erros importantes e adote incrementalmente novos recursos do React no nível do framework, sem ser acoplado à programação global de lançamento do React.

Gostaríamos de disponibilizar este fluxo de trabalho para outros frameworks e configurações selecionadas. Por exemplo, ele permite que um framework *sobre* o React inclua uma mudança significativa relacionada ao React *antes* que essa mudança significativa seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças significativas afetam apenas as integrações do framework. Isso permite que um framework lance tal mudança em sua própria versão secundária sem quebrar o semver.

Lançamentos contínuos com o canal Canaries nos permitirão ter um loop de feedback mais apertado e garantir que os novos recursos obtenham testes abrangentes na comunidade. Esse fluxo de trabalho está mais próximo de como o TC39, o comitê de padrões JavaScript, [lida com as mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos no React antes de estarem em um lançamento estável do React, assim como novos recursos do JavaScript são enviados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos experimentais](/community/versioning-policy#canary-channel), nós recomendamos não usá-los em produção, pois as APIs experimentais podem passar por mudanças significativas em sua estabilização (ou podem até ser removidas inteiramente). Embora os Canaries também possam conter erros (como em qualquer lançamento), no futuro pretendemos anunciar quaisquer mudanças significativas no Canary em nosso *blog*. Canaries estão mais próximos do código que o Meta executa internamente, então você pode geralmente esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e verificar manualmente o log de commit do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas que usam o React fora de uma configuração selecionada (como um framework) queiram continuar usando os lançamentos Estáveis.** No entanto, se você estiver construindo um framework, pode querer considerar a inclusão de uma versão Canary do React fixada em um commit específico e atualizá-la em seu próprio ritmo. A vantagem disso é que permite que você envie recursos e correções de erros individuais do React já concluídos, para seus usuários e em sua própria programação de lançamento, de forma semelhante a como o React Native tem feito nos últimos anos. A desvantagem é que você assumiria a responsabilidade adicional de revisar quais commits do React estão sendo incluídos e comunicar aos seus usuários quais mudanças do React estão incluídas em seus lançamentos.

Se você é um autor de framework e quer tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças significativas e novos recursos antecipadamente {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nossa melhor estimativa do que entrará no próximo lançamento estável do React a qualquer momento.

Tradicionalmente, só anunciamos mudanças significativas no *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma forma oficialmente suportada de consumir o React, planejamos mudar para anunciar as mudanças significativas e os novos recursos *conforme eles chegam* aos Canaries. Por exemplo, se fizermos a mesclagem de uma mudança significativa que estará em um Canary, escreveremos uma postagem sobre ela no blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework cortando um lançamento principal que atualiza o React canary fixado para incluir essa mudança, você pode vincular à nossa postagem do blog em suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, vincularemos a essas postagens de blog já publicadas, o que esperamos ajudar nossa equipe a progredir mais rapidamente.

Planejamos documentar as APIs conforme elas chegam aos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora deles. As APIs que só estão disponíveis nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso irá incluir APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu app ou framework, certifique-se de sempre fixar a versão *exata* do Canary que você está usando. Como os Canaries são pré-lançamentos, eles ainda podem incluir mudanças significativas.

## Exemplo: React Server Components {/*example-react-server-components*/}

Como [anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções do React Server Components foram finalizadas e não esperamos mudanças significativas relacionadas ao seu contrato de API voltada para o usuário. No entanto, ainda não podemos lançar o suporte para React Server Components em uma versão estável do React, pois ainda estamos trabalhando em vários recursos entrelaçados apenas para framework (como [carregamento de assets](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading) ) e esperamos mais mudanças significativas lá.

Isso significa que os React Server Components estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é enviar uma versão Canary fixada do React. (Para evitar a inclusão de duas cópias do React, os frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado que eles enviam com seu framework e explicar isso a seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas em versões estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que os autores de bibliotecas testem cada lançamento Canary, pois seria proibitivamente difícil. No entanto, assim como quando [apresentamos originalmente os diferentes canais de pré-lançamento do React há três anos](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), nós encorajamos as bibliotecas a executar testes com as versões *estável* e Canary mais recentes. Se você vir uma mudança no comportamento que não foi anunciada, envie um erro no repositório do React para que possamos ajudar a diagnosticá-lo. Esperamos que, à medida que essa prática se torna amplamente adotada, ela reduza a quantidade de esforço necessário para atualizar as bibliotecas para as novas versões principais do React, pois as regressões acidentais seriam encontradas conforme chegam.

<Note>

Falando estritamente, Canary não é um canal de lançamento *novo* - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando-o como um canal de lançamento *novo* para comunicar as novas expectativas, como os Canaries sendo uma forma oficialmente suportada de usar o React.

</Note>

## Os lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nos lançamentos estáveis do React.
``