---
title: "React Canaries: Habilitando a Implementação Incremental de Recursos Fora do Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como o Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como o Meta tem usado versões de ponta do React internamente há muito tempo. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se houver regressões, as trataremos com a mesma urgência que erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novos recursos individuais do React antes que eles sejam incluídos nas versões semver-estáveis.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canaries do React incluem apenas recursos que acreditamos razoavelmente estar prontos para adoção. Incentivamos os frameworks a considerarem agrupar lançamentos Canary do React.
* Anunciaremos mudanças disruptivas e novos recursos em nosso blog assim que forem lançados nas versões Canary.
* **Como sempre, o React continua a seguir semver para cada lançamento estável.**

## Como os recursos do React são normalmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Normalmente, cada recurso do React passa pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e a prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamento `experimental`. Neste ponto, espera-se que o recurso mude significativamente.
2. Encontramos uma equipe no Meta disposta a nos ajudar a testar esse recurso e fornecer feedback. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes no Meta para testá-lo.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e tornamos o recurso disponível na branch `main` por padrão, que a maioria dos produtos Meta usa. Neste ponto, qualquer equipe no Meta pode usar esse recurso.
4. À medida que construímos confiança na direção, também publicamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um conjunto amplo de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos próximos de cortar um lançamento de código aberto, escrevemos a documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Esse manual funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando o recurso está geralmente pronto para uso (etapa 3) e quando é lançado em código aberto (etapa 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem do Meta e adotar novos recursos individuais mais cedo (à medida que se tornam disponíveis) sem precisar esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, *fizemos* uso de lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram completamente finalizados e nos quais ainda estamos iterando ativamente. Não podemos lançá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar sobre as partes que não estão prontas sem uma enxurrada de lançamentos de versões principais, que o semver exigiria que fizéssemos.

No Meta, resolvemos esse problema construindo o React a partir da branch `main` e atualizando-o manualmente para um commit específico a cada semana. Essa é também a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é vinculado a um commit específico da branch `main` do repositório do React. Isso permite que o React Native inclua correções importantes de erros e adote progressivamente novos recursos do React ao nível do framework sem ficar vinculado ao cronograma global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *sobre* o React inclua uma mudança disruptiva relacionada ao React *antes* que essa mudança disruptiva seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças disruptivas afetam apenas integrações de framework. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar o semver.

Lançamentos contínuos com o canal Canary nos permitirá ter um ciclo de feedback mais curto e garantir que novos recursos recebam testes abrangentes na comunidade. Esse fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em uma versão estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos Experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem passar por mudanças disruptivas significativas no caminho para a estabilização (ou podem até ser removidas completamente). Embora Canaries também possam conter erros (como qualquer lançamento), no futuro planejamos anunciar quaisquer mudanças disruptivas significativas nos Canaries em nosso blog. Canaries são os mais próximos do código que o Meta executa internamente, portanto, você pode geralmente esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão vinculada e escanear manualmente o log de commits do GitHub ao atualizar entre os commits vinculados.

**Esperamos que a maioria das pessoas que usam o React fora de uma configuração curada (como um framework) desejem continuar usando os lançamentos estáveis.** No entanto, se você estiver construindo um framework, pode querer considerar agrupar uma versão Canary do React vinculada a um commit específico e atualizá-la em seu próprio ritmo. O benefício disso é que permite que você entregue recursos completos do React e correções de bugs mais cedo para seus usuários e conforme seu próprio cronograma de lançamentos, semelhante a como o React Native tem feito isso nos últimos anos. A desvantagem é que você assumiria uma responsabilidade adicional para revisar quais commits do React estão sendo incorporados e comunicar aos seus usuários quais mudanças do React estão incluídas em seus lançamentos.

Se você é um autor de framework e deseja tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças disruptivas e novos recursos cedo {/*announcing-breaking-changes-and-new-features-early*/}

Lançamentos Canary representam nossa melhor estimativa do que irá para o próximo lançamento estável do React a qualquer momento.

Tradicionalmente, anunciamos mudanças disruptivas apenas no *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma forma oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças disruptivas e novos recursos significativos *à medida que forem lançados* nos Canaries. Por exemplo, se mesclarmos uma mudança disruptiva que será lançada em um Canary, escreveremos uma postagem sobre isso em nosso blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você for um autor de framework lançando uma versão principal que atualiza o Canary do React vinculado para incluir essa mudança, poderá vincular nossa postagem do blog em suas notas de lançamento. Finalmente, quando uma versão estável principal do React estiver pronta, iremos vincular aquelas postagens do blog já publicadas, o que esperamos que ajude nossa equipe a progredir mais rapidamente.

Planejamos documentar APIs à medida que forem lançadas nos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora deles. APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser vinculados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre vincular a *exata* versão do Canary que está usando. Como os Canaries são pré-lançamentos, eles podem ainda incluir mudanças disruptivas.

## Exemplo: Componentes do Servidor React {/*example-react-server-components*/}

Como anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes do Servidor React foram finalizadas, e não esperamos mudanças disruptivas significativas relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar suporte para Componentes do Servidor React em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos entrelaçados apenas para framework (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças disruptivas lá.

Isso significa que os Componentes do Servidor React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento importante do React, a única maneira de um framework adotá-los é enviar uma versão Canary vinculada do React. (Para evitar a inclusão de duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary vinculado que enviam com seu framework e explicar isso aos seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Bibliotecas de teste contra versões estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary único, pois isso seria proibitivamente difícil. No entanto, assim como quando introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos, incentivamos as bibliotecas a realizar testes tanto na versão mais recente estável quanto na versão Canary mais recente. Se você perceber uma mudança no comportamento que não foi anunciada, registre um erro no repositório do React para que possamos ajudar a diagnosticar. Esperamos que, à medida que essa prática se torne amplamente adotada, reduzirá a quantidade de esforço necessário para atualizar bibliotecas para novas versões principais do React, uma vez que regressões acidentais seriam encontradas à medida que são lançadas.

<Note>

Estritamente falando, Canary não é um *novo* canal de lançamento - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canaries serem uma forma oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo mudanças nos lançamentos estáveis do React.