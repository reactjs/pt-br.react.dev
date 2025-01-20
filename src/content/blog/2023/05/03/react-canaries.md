---
title: "React Canaries: Habilitando Implementações Incrementais de Funcionalidades Fora da Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React a opção de adotar novas funcionalidades individuais assim que seu design estiver próximo do final, antes de serem lançadas em uma versão estável - semelhante a como a Meta tem usado versões de ponta do React internamente. Estamos introduzindo um novo [canal de releases Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Isso permite que configurações curadas como frameworks desacoplem a adoção de funcionalidades individuais do React da programação de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React a opção de adotar novas funcionalidades individuais assim que seu design estiver próximo do final, antes de serem lançadas em uma versão estável - semelhante a como a Meta tem usado versões de ponta do React internamente. Estamos introduzindo um novo [canal de releases Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Isso permite que configurações curadas como frameworks desacoplem a adoção de funcionalidades individuais do React da programação de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de releases Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se regressões ocorrerem, iremos tratá-las com a mesma urgência que erros em lançamentos estáveis.
* Canaries permitem que você comece a usar novas funcionalidades individuais do React antes que elas cheguem às versões semver-estáveis.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canaries do React incluem apenas funcionalidades que acreditamos razoavelmente que estão prontas para adoção. Incentivamos frameworks a considerar a inclusão de versões Canary do React fixadas.
* Anunciaremos mudanças breaking e novas funcionalidades em nosso blog assim que elas chegarem às releases Canary.
* **Como sempre, o React continua a seguir semver para cada release Estável.**

## Como as funcionalidades do React são normalmente desenvolvidas {/*how-react-features-are-usually-developed*/}

Tipicamente, cada funcionalidade do React passa pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e prefixamos com `experimental_` ou `unstable_`. A funcionalidade está disponível apenas no canal de release `experimental`. Neste ponto, espera-se que a funcionalidade mude significativamente.
2. Encontramos uma equipe na Meta disposta a nos ajudar a testar essa funcionalidade e fornecer feedback sobre ela. Isso leva a uma rodada de mudanças. À medida que a funcionalidade se torna mais estável, trabalhamos com mais equipes na Meta para testá-la.
3. Eventualmente, nos sentimos confiantes no design. Removemos o prefixo do nome da API e disponibilizamos a funcionalidade no branch `main` por padrão, que a maioria dos produtos da Meta utiliza. Neste ponto, qualquer equipe da Meta pode usar essa funcionalidade.
4. À medida que aumentamos a confiança na direção, também postamos um RFC para a nova funcionalidade. Neste ponto, sabemos que o design funciona para um conjunto amplo de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos próximos de lançar uma versão open source, escrevemos a documentação para a funcionalidade e finalmente lançamos a funcionalidade em uma versão estável do React.

Este playbook funciona bem para a maioria das funcionalidades que lançamos até agora. No entanto, pode haver uma lacuna significativa entre quando a funcionalidade está geralmente pronta para uso (passo 3) e quando é lançada como open source (passo 5).

**Gostaríamos de oferecer à comunidade React a opção de seguir a mesma abordagem que a Meta e adotar novas funcionalidades individuais mais cedo (à medida que ficam disponíveis) sem ter que esperar pelo próximo ciclo de lançamento do React.**

Como sempre, todas as funcionalidades do React eventualmente estarão em uma release Estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

De maneira geral, *nós* usamos lançamentos menores para introduzir novas funcionalidades.

No entanto, isso nem sempre é possível. Às vezes, novas funcionalidades estão interconectadas com *outras* novas funcionalidades que ainda não foram totalmente concluídas e nas quais ainda estamos iterando ativamente. Não podemos lançá-las separadamente porque suas implementações estão relacionadas. Não podemos versioná-las separadamente porque afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar nas partes que não estão prontas sem uma infinidade de lançamentos de versão principais, o que o semver exigiria que fizéssemos.

Na Meta, resolvemos esse problema construindo o React a partir do branch `main` e atualizando manualmente para um commit específico fixado toda semana. Esta é também a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada release *estável* do React Native está fixada em um commit específico do branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adotem novas funcionalidades do React de maneira incremental a nível de framework sem se acoplarem à programação global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *em cima de* React inclua uma mudança breaking relacionada ao React *antes* que essa mudança breaking seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças breaking afetam apenas integrações de frameworks. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar semver.

Lançamentos contínuos com o canal Canaries nos permitirá ter um ciclo de feedback mais apertado e garantir que novas funcionalidades sejam testadas de forma abrangente na comunidade. Este fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões do JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novas funcionalidades do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em uma release estável do React, assim como novas funcionalidades do JavaScript são lançadas em navegadores antes de serem oficialmente ratificadas como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos Experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem passar por mudanças breaking significativas em seu caminho para a estabilização (ou podem até ser removidas completamente). Embora os Canaries também possam conter erros (como qualquer release), a partir de agora planejamos anunciar quaisquer mudanças breaking significativas nos Canaries em nosso blog. Os Canaries são os mais próximos do código que a Meta executa internamente, então você pode esperar que eles sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e escanear manualmente o log de commits do GitHub ao atualizar entre os commits fixados.

**Esperamos que a maioria das pessoas que usam React fora de uma configuração cuidada (como um framework) queira continuar usando as versões Estáveis.** No entanto, se você está construindo um framework, pode querer considerar a inclusão de uma versão Canary do React fixada em um commit específico e atualizá-la no seu próprio ritmo. O benefício disso é que permite que você envie funcionalidades individuais do React e correções de bugs mais cedo para seus usuários e de acordo com sua própria programação de lançamentos, semelhante ao que o React Native tem feito nos últimos anos. A desvantagem é que você assumiria uma responsabilidade adicional para revisar quais commits do React estão sendo puxados e comunicar a seus usuários quais mudanças do React estão incluídas em seus lançamentos.

Se você é um autor de framework e deseja tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças breaking e novas funcionalidades com antecedência {/*announcing-breaking-changes-and-new-features-early*/}

As releases Canary representam nosso melhor palpite sobre o que irá entrar na próxima versão estável do React a qualquer momento.

Tradicionalmente, só anunciamos mudanças breaking no *final* do ciclo de lançamento (ao fazer um lançamento principal). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças breaking e novas funcionalidades significativas *à medida que elas chegam* nos Canaries. Por exemplo, se mesclarmos uma mudança breaking que sairá em um Canary, escreveremos um post sobre isso no blog do React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está cortando um lançamento principal que atualiza o Canary fixado do React para incluir essa mudança, você pode vincular ao nosso post do blog em suas notas de lançamento. Finalmente, quando uma versão principal estável do React estiver pronta, vincularíamos a esses posts de blog já publicados, o que esperamos que ajude nossa equipe a avançar mais rápido.

Planejamos documentar APIs à medida que elas chegam nos Canaries - mesmo que essas APIs ainda não estejam disponíveis fora deles. APIs que estão disponíveis apenas nos Canaries serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229), e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Canaries devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que você está usando. Como os Canaries são pré-releases, eles ainda podem incluir mudanças breaking.

## Exemplo: Componentes do Servidor React {/*example-react-server-components*/}

Conforme anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes do Servidor do React foram finalizadas, e não esperamos mudanças breaking significativas relacionadas ao contrato de API voltado para o usuário. No entanto, ainda não podemos liberar suporte para Componentes do Servidor React em uma versão estável do React porque ainda estamos trabalhando em várias funcionalidades interligadas apenas para frameworks (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças breaking lá.

Isso significa que os Componentes do Servidor React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento principal do React, a única maneira de um framework adotá-los é enviar uma versão Canary fixada do React. (Para evitar incluir duas cópias do React, frameworks que desejam fazer isso precisariam impor a resolução de `react` e `react-dom` para o Canary fixado que enviam com seu framework, e explicar isso a seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra versões Estáveis e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lancamento Canary, pois isso seria proibitivamente difícil. No entanto, assim como quando [introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), incentivamos bibliotecas a rodar testes tanto nas versões Estáveis mais recentes quanto nas versões Canary mais recentes. Se você perceber uma mudança de comportamento que não foi anunciada, por favor, abra um bug no repositório do React para que possamos ajudar a diagnosticá-lo. Esperamos que, à medida que essa prática se torne amplamente adotada, isso reduzirá o esforço necessário para atualizar bibliotecas para novas versões principais do React, pois regressões acidentais seriam encontradas assim que chegassem.

<Note>

Estritamente falando, Canary não é um *novo* canal de lançamento - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando-o como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canaries sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos Estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nas releases estáveis do React.