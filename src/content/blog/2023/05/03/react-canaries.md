---
title: "React Canaries: Habilitando a Implementação Incremental de Recursos Fora da Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como a Meta tem usado versões experimentais do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como a Meta tem usado versões experimentais do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se regressões ocorrerem, as trataremos com a mesma urgência que erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novos recursos individuais do React antes que eles sejam lançados nas versões estáveis semver.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canaries do React incluem apenas recursos que acreditamos razoavelmente que estão prontos para adoção. Incentivamos os frameworks a considerar agrupar lançamentos do React Canary fixados.
* Anunciaremos alterações e novos recursos de ruptura em nosso blog assim que forem incluídos nas lançamentos Canary.
* **Como sempre, o React continua a seguir semver para todos os lançamentos estáveis.**

## Como os recursos do React são normalmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Normalmente, cada recurso do React passa pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Nesse ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe na Meta disposta a nos ajudar a testar esse recurso e fornecer feedback. Isso leva a uma rodada de alterações. À medida que o recurso se torna mais estável, trabalhamos com mais equipes da Meta para testá-lo.
3. Por fim, nos sentimos confiantes no design. Removemos o prefixo do nome da API e tornamos o recurso disponível por padrão no branch `main`, que a maioria dos produtos Meta usa. Nesse ponto, qualquer equipe da Meta pode usar esse recurso.
4. À medida que construímos confiança na direção, também postamos uma RFC para o novo recurso. Nesse ponto, sabemos que o design funciona para um amplo conjunto de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos prestes a cortar um lançamento de código aberto, escrevemos a documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Esse playbook funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (passo 3) e quando é lançado em código aberto (passo 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem que a Meta e adotar novos recursos individuais mais cedo (à medida que se tornam disponíveis) sem ter que esperar pelo próximo ciclo de lançamentos do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, *fazemos* lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram completamente finalizados e nos quais ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque eles afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar sobre as partes que não estão prontas sem uma enxurrada de lançamentos de versões principais, o que o semver exigiria que fizéssemos.

Na Meta, resolvemos esse problema construindo o React a partir do branch `main` e atualizando manualmente para um commit fixado específico a cada semana. Essa também é a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado em um commit específico do branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adote novos recursos do React de forma incremental no nível do framework sem ficar acoplado ao cronograma global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *em cima do* React inclua uma alteração de ruptura relacionada ao React *antes* que essa alteração de ruptura seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas alterações de ruptura afetam apenas integrações de frameworks. Isso permite que um framework lance tal alteração em sua própria versão menor sem quebrar o semver.

Lançamentos contínuos com o canal Canary nos permitirão ter um ciclo de feedback mais próximo e garantir que novos recursos sejam amplamente testados na comunidade. Esse fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em etapas numeradas](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos com React antes de serem lançados em uma versão estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* usar tecnicamente [lançamentos Experimentais](/community/versioning-policy#canary-channel), recomendamos contra seu uso em produção porque APIs experimentais podem passar por mudanças significativas de ruptura enquanto estão a caminho da estabilização (ou podem até ser removidas completamente). Embora os Canaries também possam conter erros (como qualquer lançamento), no futuro planejamos anunciar quaisquer mudanças significativas de ruptura nos Canaries em nosso blog. Os Canaries são os mais próximos do código que a Meta executa internamente, portanto, você pode esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e revisar manualmente o log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas usando o React fora de uma configuração curada (como um framework) queira continuar usando os lançamentos Estáveis.** No entanto, se você está construindo um framework, pode querer considerar agrupar uma versão Canary do React fixada em um commit específico e atualizá-la em seu próprio ritmo. O benefício disso é que permite que você envie recursos completos individuais do React e correções de bugs mais cedo para seus usuários e em seu próprio cronograma de lançamentos, semelhante ao que o React Native tem feito nos últimos anos. A desvantagem é que você assumiria responsabilidade adicional para revisar quais commits do React estão sendo incluídos e comunicar aos seus usuários quais alterações do React estão incluídas em seus lançamentos.

Se você é um autor de framework e deseja tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças de ruptura e novos recursos antecipadamente {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nossa melhor estimativa do que entrará no próximo lançamento estável do React a qualquer momento.

Tradicionalmente, apenas anunciamos mudanças de ruptura no *final* do ciclo de lançamento (quando fazemos um lançamento principal). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças de ruptura e novos recursos significativos *à medida que surgem* nos Canaries. Por exemplo, se mesclarmos uma mudança de ruptura que será lançada em um Canary, escreveremos uma postagem sobre isso em nosso blog React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está fazendo um lançamento principal que atualiza o canário React fixado para incluir essa alteração, você pode vincular nossa postagem do blog às suas notas de lançamento. Por fim, quando uma versão principal estável do React estiver pronta, vamos vincular a essas postagens do blog já publicadas, o que esperamos que ajude nossa equipe a progredir mais rapidamente.

Planejamos documentar APIs à medida que surgem nos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora delas. APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que está usando. Como os Canaries são pré-lançamentos, eles ainda podem incluir mudanças de ruptura.

## Exemplo: Componentes de Servidor React {/*example-react-server-components*/}

Conforme anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes de Servidor React foram finalizadas e não esperamos mudanças significativas de ruptura relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar o suporte para Componentes de Servidor React em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos interligados apenas para frameworks (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças de ruptura lá.

Isso significa que os Componentes de Servidor React estão prontos para ser adotados por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é lançar uma versão Canary fixada do React. (Para evitar empacotar duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado que eles enviam com seu framework e explicar isso para seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra versões Estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary, pois seria proibitivamente difícil. No entanto, assim como quando introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos, incentivamos bibliotecas a executar testes contra *tanto* a versão Estável mais recente quanto a versão Canary mais recente. Se você notar uma mudança de comportamento que não foi anunciada, por favor, registre um erro no repositório do React para que possamos ajudar a diagnosticá-lo. Esperamos que, à medida que essa prática se torne amplamente adotada, isso reduza o esforço necessário para atualizar bibliotecas para novas versões principais do React, já que regressões acidentais seriam encontradas à medida que surgem.

<Note>

Estritamente falando, Canary não é um *novo* canal de lançamento - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canaries sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nos lançamentos estáveis do React.