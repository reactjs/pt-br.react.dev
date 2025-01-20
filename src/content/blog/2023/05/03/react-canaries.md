---
title: "React Canaries: Habilitando Implementação Incremental de Recursos Fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante ao que o Meta tem utilizado há muito tempo com versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais React do cronograma de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante ao que o Meta tem utilizado há muito tempo com versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais React do cronograma de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se houver regressões, trataremos delas com a mesma urgência que erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novos recursos individuais do React antes que eles sejam lançados nas versões semver-estáveis.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canaries do React incluem apenas recursos que acreditamos razoavelmente estar prontos para adoção. Encorajamos frameworks a considerar agrupar lançamentos Canary do React fixados.
* Anunciaremos mudanças quebradoras e novos recursos em nosso blog à medida que eles forem lançados nas versões Canary.
* **Como sempre, o React continua a seguir semver para cada lançamento estável.**

## Como os recursos do React são geralmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Tipicamente, cada recurso do React passou pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Neste ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe no Meta disposta a nos ajudar a testar este recurso e fornecer feedback sobre ele. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes no Meta para testá-lo.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e tornamos o recurso disponível na branch `main` por padrão, que a maioria dos produtos do Meta usa. Nesse ponto, qualquer equipe no Meta pode usar esse recurso.
4. À medida que construímos confiança na direção, também publicamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um amplo conjunto de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos prestes a liberar uma versão open source, escrevemos a documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Este manual funciona bem para a maioria dos recursos que já lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando ele é lançado como open source (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir o mesmo approach do Meta e adotar novos recursos individuais mais cedo (à medida que se tornam disponíveis) sem ter que esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento estável.

## Podemos simplesmente fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, nós *fazemos* usar lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram totalmente concluídos e que ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar sobre as partes que não estão prontas sem uma enxurrada de lançamentos de versões principais, que semver exigiria que fizéssemos.

No Meta, resolvemos esse problema construindo o React a partir da branch `main` e atualizando-o manualmente para um commit fixo específico a cada semana. Esta também é a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado a um commit específico da branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adote novos recursos do React de forma incremental no nível do framework, sem ficar acoplado ao cronograma global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *sobre* o React inclua uma mudança quebradora relacionada ao React *antes* que essa mudança quebradora seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças quebradoras afetam apenas integrações de frameworks. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar semver.

Lançamentos contínuos com o canal Canaries nos permitirão ter um ciclo de feedback mais curto e garantir que novos recursos recebam testes abrangentes na comunidade. Este fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em um lançamento estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem sofrer mudanças quebradoras significativas em seu caminho para a estabilização (ou podem até ser removidas totalmente). Embora os Canaries também possam conter erros (como qualquer lançamento), vamos anunciar qualquer mudança quebradora significativa nos Canaries em nosso blog. Os Canaries são os mais próximos do código que o Meta executa internamente, então você pode geralmente esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e escanear manualmente o log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas usando o React fora de uma configuração curada (como um framework) queira continuar usando os lançamentos estáveis.** No entanto, se você está construindo um framework, talvez queira considerar agrupar uma versão Canary do React fixada a um commit específico e atualizá-la a seu próprio ritmo. O benefício disso é que permite que você entregue recursos concretos do React e correções de bugs mais cedo para seus usuários e no seu próprio cronograma de lançamentos, semelhante ao que o React Native tem feito nos últimos anos. A desvantagem é que você assumiria a responsabilidade adicional de revisar quais commits do React estão sendo puxados e comunicar a seus usuários quais mudanças do React estão incluídas em seus lançamentos.

Se você é um autor de framework e quer tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças quebradoras e novos recursos cedo {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nossa melhor estimativa do que irá para o próximo lançamento estável do React a qualquer momento.

Tradicionalmente, nós só anunciamos mudanças quebradoras no *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças quebradoras e novos recursos significativos *à medida que forem lançados* nos Canaries. Por exemplo, se mesclarmos uma mudança quebradora que irá sair em um Canary, escreveremos um post sobre isso em nosso blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está fazendo um lançamento principal que atualiza o canary do React fixado para incluir essa mudança, você pode linkar para nosso post no blog nas suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, iremos linkar para esses posts já publicados no blog, o que esperamos ajudar nossa equipe a avançar mais rapidamente.

Planejamos documentar APIs à medida que elas forem lançadas nos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora delas. APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que está usando. Como os Canaries são pré-lançamentos, eles ainda podem incluir mudanças quebradoras.

## Exemplo: Componentes do Servidor React {/*example-react-server-components*/}

Como anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes do Servidor React foram finalizadas, e não esperamos mudanças quebradoras significativas relacionadas ao seu contrato de API voltado ao usuário. No entanto, não podemos ainda liberar suporte para Componentes do Servidor React em uma versão estável do React porque ainda estamos trabalhando em várias funcionalidades interligadas apenas para frameworks (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças quebradoras lá.

Isso significa que os Componentes do Servidor React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é enviar uma versão Canary fixada do React. (Para evitar agregar duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado que enviam com seu framework e explicar isso a seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra versões estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary, pois isso seria proibitivamente difícil. No entanto, assim como quando introduzimos originalmente os diferentes canais de pré-lançamento do React, encorajamos bibliotecas a executar testes contra *tanto* a versão estável mais recente quanto a versão Canary mais recente. Se você notar uma mudança no comportamento que não foi anunciada, por favor, relate um erro no repositório do React para que possamos ajudar a diagnosticá-lo. Esperamos que, à medida que essa prática se torne amplamente adotada, reduza a quantidade de esforço necessário para atualizar bibliotecas para novas versões principais do React, já que regressões acidentais seriam encontradas à medida que fossem lançadas.

<Note>

Estritamente falando, Canary não é um canal de lançamento *novo*--ele costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canaries sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nos lançamentos estáveis do React.