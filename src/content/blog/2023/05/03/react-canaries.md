---
title: "React Canaries: Habilitando a Implementação Incremental de Recursos Fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante à maneira como o Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React da programação de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante à maneira como o Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React da programação de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se quaisquer regressões ocorrerem, as trataremos com uma urgência similar a erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novos recursos individuais do React antes que eles sejam lançados nas versões estáveis semver.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), o React Canaries inclui apenas recursos que acreditamos razoavelmente estar prontos para adoção. Encorajamos frameworks a considerar agrupar lançamentos Canary do React fixados.
* Anunciaremos mudanças significativas e novos recursos em nosso blog assim que forem lançados nos Canary releases.
* **Como sempre, o React continua a seguir semver para cada lançamento Estável.**

## Como os recursos do React são geralmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Geralmente, cada recurso do React passa pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Neste ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe no Meta disposta a nos ajudar a testar esse recurso e fornecer feedback sobre ele. Isso leva a uma rodada de alterações. À medida que o recurso se torna mais estável, trabalhamos com mais equipes no Meta para testá-lo.
3. Eventualmente, sentimos confiança no design. Removemos o prefixo do nome da API e tornamos o recurso disponível no branch `main` por padrão, que a maioria dos produtos do Meta usa. Nesse momento, qualquer equipe do Meta pode usar esse recurso.
4. À medida que ganhamos confiança na direção, também publicamos um RFC para o novo recurso. Neste ponto sabemos que o design funciona para um conjunto amplo de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos prestes a lançar uma versão de código aberto, escrevemos documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Esse roteiro funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando é lançado como código aberto (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir o mesmo caminho que o Meta e adotar recursos novos individuais mais cedo (à medida que se tornam disponíveis) sem ter que esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento Estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, *fazemos* lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram concluídos completamente e nos quais ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque eles afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar nas partes que não estão prontas sem uma enxurrada de lançamentos de versões principais, o que o semver exigiria de nós.

No Meta, resolvemos esse problema construindo o React a partir do branch `main`, atualizando-o manualmente para um commit fixado específico a cada semana. Essa é também a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado a um commit específico do branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adote de forma incremental novos recursos do React em nível de framework sem se acoplar à programação global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, permite que um framework *sobre* o React inclua uma mudança breaking relacionada ao React *antes* que essa mudança breaking seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças breaking afetam apenas integrações de frameworks. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar o semver.

Lançamentos contínuos com o canal Canaries nos permitirão ter um ciclo de feedback mais rápido e garantir que novos recursos sejam amplamente testados na comunidade. Esse fluxo de trabalho está mais próximo de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em um lançamento estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos Experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem passar por mudanças breaking significativas em seu caminho para a estabilização (ou podem até ser removidas completamente). Embora Canaries também possam conter erros (como qualquer lançamento), daqui para frente planejamos anunciar quaisquer mudanças breaking significativas nos Canaries em nosso blog. Os Canaries são os mais próximos do código que o Meta executa internamente, portanto, você pode esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e escanear manualmente o log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas que usam o React fora de uma configuração curada (como um framework) queira continuar usando os lançamentos Estáveis.** No entanto, se você está construindo um framework, pode querer considerar agrupar uma versão Canary do React fixada em um commit específico e atualizá-la em seu próprio ritmo. O benefício disso é que ele permite que você envie recursos completos individuais do React e correções de bugs mais cedo para seus usuários e em seu próprio cronograma de lançamentos, semelhante ao que o React Native tem feito nos últimos anos. O lado negativo é que você assumiria uma responsabilidade adicional para revisar quais commits do React estão sendo incluídos e comunicar a seus usuários quais alterações do React estão incluídas em seus lançamentos.

Se você é um autor de framework e deseja tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças breaking e novos recursos cedo {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nosso melhor palpite sobre o que irá compor o próximo lançamento estável do React a qualquer momento.

Tradicionalmente, só anunciamos mudanças breaking no *final* do ciclo de lançamento (ao realizar um lançamento principal). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças breaking e novos recursos significativos *à medida que eles surgem* nos Canaries. Por exemplo, se nós mesclarmos uma mudança breaking que será lançada em um Canary, escreveremos um post sobre isso no blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está realizando um lançamento principal que atualiza o Canary fixado do React para incluir essa mudança, você pode vincular nosso post do blog a partir de suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, vincularemos a esses posts do blog já publicados, o que esperamos ajudar nossa equipe a progredir mais rápido.

Planejamos documentar APIs à medida que elas aparecem nos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora deles. APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que está usando. Como os Canaries são pré-lançamentos, eles ainda podem incluir mudanças breaking.

## Exemplo: Componentes do Servidor React {/*example-react-server-components*/}

Como anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes do Servidor React foram finalizadas e não esperamos mudanças breaking significativas relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar suporte para Componentes do Servidor React em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos entrelaçados voltados apenas para frameworks (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças breaking lá.

Isso significa que os Componentes do Servidor React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é lançar uma versão Canary fixada do React. (Para evitar a inclusão de duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado que enviam com seu framework e explicar isso a seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra versões Estáveis e Canaries {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary, pois isso seria extremamente difícil. No entanto, assim como quando introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos atrás](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), encorajamos bibliotecas a executar testes contra *tanto* a versão Estável mais recente quanto a versão Canary mais recente. Se você notar uma mudança no comportamento que não foi anunciada, por favor, abra um bug no repositório do React para que possamos ajudar a diagnosticar. Esperamos que, à medida que essa prática se torne amplamente adotada, reduza a quantidade de esforço necessário para atualizar bibliotecas para novas versões principais do React, já que regressões acidentais seriam descobertas à medida que elas ocorrem.

<Note>

Estritamente falando, Canary não é um novo canal de lançamento - antigamente era chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando-o como um novo canal de lançamento para comunicar as novas expectativas, como Canaries sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nas versões estáveis do React.