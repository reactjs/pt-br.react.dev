---
title: "Canários do React: Habilitando Implementação Incremental de Recursos Fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como o Meta tem usado versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Isso permite que configurações curadas como frameworks desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como o Meta tem usado versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Isso permite que configurações curadas como frameworks desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se houver qualquer regressão, as trataremos com a mesma urgência que os erros em versões estáveis.
* Canários permitem que você comece a usar novos recursos individuais do React antes que eles estejam disponíveis nas versões semver-estáveis.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canários do React incluem apenas recursos que acreditamos razoavelmente estar prontos para adoção. Nós encorajamos frameworks a considerar agrupar lançamentos do React Canary fixados.
* Anunciaremos mudanças que quebram a compatibilidade e novos recursos em nosso blog à medida que forem lançados em versões Canary.
* **Como sempre, o React continua a seguir semver para cada lançamento estável.**

## Como os recursos do React são geralmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Normalmente, cada recurso do React passa pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Neste ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe no Meta disposta a nos ajudar a testar esse recurso e fornecer feedback sobre ele. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes no Meta para testá-lo.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e tornamos o recurso disponível na ramificação `main` por padrão, que a maioria dos produtos Meta utiliza. Neste ponto, qualquer equipe no Meta pode usar esse recurso.
4. À medida que construímos confiança na direção, também publicamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um amplo conjunto de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos próximos de lançar uma versão de código aberto, escrevemos documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Esse playbook funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando é lançado em código aberto (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem do Meta e adotar novos recursos individuais mais cedo (à medida que se tornam disponíveis) sem ter que esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, *fazemos* lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram totalmente concluídos e que ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não conseguimos versioná-los separadamente porque eles afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar sobre as partes que não estão prontas sem uma série de lançamentos de versão principal, o que a semver exigiria que fizéssemos.

No Meta, resolvemos esse problema construindo o React a partir da ramificação `main`, e atualizando-o manualmente para um commit fixado específico a cada semana. Esta também é a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado a um commit específico da ramificação `main` do repositório do React. Isso permite que o React Native inclua correções de erros importantes e adote incrementalmente novos recursos do React em nível de framework sem ficar preso ao cronograma global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *sobre* o React inclua uma mudança quebradora relacionada ao React *antes* que essa mudança quebradora seja incluída em uma versão estável do React. Isso é particularmente útil porque algumas mudanças quebradoras afetam apenas integrações de framework. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar a semver.

Lançamentos contínuos com o canal Canary nos permitirão ter um ciclo de feedback mais próximo e garantir que novos recursos recebam testes abrangentes na comunidade. Esse fluxo de trabalho se aproxima de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em uma versão estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem sofrer mudanças quebradoras significativas em seu caminho para estabilidade (ou podem até ser removidas completamente). Embora os Canários também possam conter erros (como qualquer lançamento), no futuro planejamos anunciar quaisquer mudanças quebradoras significativas nos Canários em nosso blog. Os Canários são os mais próximos do código que o Meta executa internamente, então você pode esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e fazer uma varredura manual no log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas que usam o React fora de uma configuração curada (como um framework) queira continuar usando as versões Estáveis.** No entanto, se você está construindo um framework, pode considerar agrupar uma versão Canary do React fixada a um commit específico e atualizá-la à sua própria velocidade. O benefício disso é que permite que você envie recursos completos do React e correções de erros mais cedo para seus usuários e no seu próprio cronograma de lançamentos, semelhante a como o React Native tem feito nos últimos anos. A desvantagem é que você assumiria uma responsabilidade adicional para revisar quais commits do React estão sendo incorporados e comunicar aos seus usuários quais mudanças do React estão incluídas com seus lançamentos.

Se você é um autor de framework e deseja experimentar essa abordagem, entre em contato conosco.

## Anunciando mudanças quebradoras e novos recursos cedo {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nosso melhor palpite do que irá para a próxima versão estável do React a qualquer momento.

Tradicionalmente, temos anunciado mudanças quebradoras apenas ao *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir React, planejamos mudar para anunciar mudanças quebradoras e novos recursos significativos *à medida que forem lançados* nos Canários. Por exemplo, se mesclamos uma mudança quebradora que será enviada em um Canary, escreveremos uma postagem sobre isso em nosso blog React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework lançando uma versão principal que atualiza o canário React fixado para incluir essa mudança, você pode vincular nossa postagem do blog em suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, vincularemos essas postagens de blog já publicadas, o que esperamos que ajude nossa equipe a avançar mais rapidamente.

Planejamos documentar APIs à medida que forem lançadas nos Canários - mesmo que essas APIs ainda não estejam disponíveis fora delas. APIs que estão disponíveis apenas nos Canários serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canários devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que está usando. Como os Canários são pré-lançamentos, eles ainda podem incluir mudanças quebradoras.

## Exemplo: Componentes de Servidor do React {/*example-react-server-components*/}

Conforme [anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes de Servidor do React foram finalizadas, e não esperamos mudanças quebradoras significativas relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar suporte para Componentes de Servidor do React em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos interligados apenas para framework (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças quebradoras lá.

Isso significa que os Componentes de Servidor do React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento maior do React, a única maneira de um framework adotá-los é enviar uma versão Canary do React fixada. (Para evitar a inclusão de duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado com o qual eles enviam seu framework e explicar isso aos seus usuários. Como exemplo, isso é o que o Next.js App Router faz.)

## Testando bibliotecas contra versões Estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary, uma vez que isso seria proibitivamente difícil. No entanto, assim como quando [introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), encorajamos bibliotecas a executar testes contra *tanto* as versões Estáveis mais recentes quanto as versões Canary mais recentes. Se você perceber uma mudança no comportamento que não foi anunciada, please.file um erro no repositório do React para que possamos ajudar a diagnosticar. Esperamos que, à medida que essa prática se torne amplamente adotada, ela reduzirá o esforço necessário para atualizar bibliotecas para novas versões principais do React, uma vez que regressões acidentais seriam encontradas à medida que aparecem.

<Note>

Estritamente falando, Canary não é um *novo* canal de lançamento - ele costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com Next.js. Estamos anunciando como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canários sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nos lançamentos estáveis do React.