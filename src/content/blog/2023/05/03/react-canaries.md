---
title: "React Canaries: Habilitando a Implementação Incremental de Recursos Fora da Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, e Andrew Clark
date: 2023/05/03
description: Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos de forma individual assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como a Meta há muito tempo usa versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.
---

3 de maio de 2023 por [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Gostaríamos de oferecer à comunidade React uma opção para adotar novos recursos de forma individual assim que seu design estiver próximo do final, antes de serem lançados em uma versão estável - semelhante a como a Meta há muito tempo usa versões de ponta do React internamente. Estamos introduzindo um novo [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado. Ele permite que configurações curadas, como frameworks, desacoplem a adoção de recursos individuais do React do cronograma de lançamentos do React.

</Intro>

---

## tl;dr {/*tldr*/}

* Estamos introduzindo um [canal de lançamento Canary](/community/versioning-policy#canary-channel) oficialmente suportado para o React. Como é oficialmente suportado, se alguma regressão ocorrer, a trataremos com a mesma urgência que erros em lançamentos estáveis.
* Canários permitem que você comece a usar novos recursos individuais do React antes que eles sejam incluídos nas versões estáveis semver.
* Ao contrário do canal [Experimental](/community/versioning-policy#experimental-channel), os Canários do React incluem apenas recursos que achamos razoavelmente prontos para adoção. Encorajamos frameworks a considerar agrupar versões Canary fixas do React.
* Anunciaremos mudanças impactantes e novos recursos em nosso blog à medida que forem disponibilizados nas versões Canary.
* **Como sempre, o React continua a seguir semver para cada lançamento estável.**

## Como os recursos do React são normalmente desenvolvidos {/*how-react-features-are-usually-developed*/}

Normalmente, cada recurso do React passou pelas mesmas etapas:

1. Desenvolvemos uma versão inicial e prefixamos com `experimental_` ou `unstable_`. O recurso está disponível apenas no canal de lançamentos `experimental`. Neste ponto, o recurso deve mudar significativamente.
2. Encontramos uma equipe na Meta disposta a nos ajudar a testar esse recurso e fornecer feedback sobre ele. Isso leva a uma rodada de mudanças. À medida que o recurso se torna mais estável, trabalhamos com mais equipes na Meta para testá-lo.
3. Eventualmente, sentimos confiança no design. Removemos o prefixo do nome da API e tornamos o recurso disponível na branch `main` por padrão, que a maioria dos produtos da Meta utiliza. Neste ponto, qualquer equipe na Meta pode usar esse recurso.
4. À medida que construímos confiança na direção, também publicamos um RFC para o novo recurso. Neste ponto, sabemos que o design funciona para um conjunto amplo de casos, mas podemos fazer alguns ajustes de última hora.
5. Quando estamos prestes a cortar um lançamento de código aberto, escrevemos a documentação para o recurso e finalmente lançamos o recurso em uma versão estável do React.

Este plano funciona bem para a maioria dos recursos que lançamos até agora. No entanto, pode haver um gap significativo entre o momento em que o recurso está geralmente pronto para uso (passo 3) e quando é lançado como código aberto (passo 5).

**Gostaríamos de oferecer à comunidade React uma opção para seguir a mesma abordagem da Meta e adotar novos recursos individuais mais cedo (assim que se tornem disponíveis) sem ter que esperar o próximo ciclo de lançamento do React.**

Como sempre, todos os recursos do React eventualmente farão parte de um lançamento estável.

## Podemos apenas fazer mais lançamentos menores? {/*can-we-just-do-more-minor-releases*/}

Geralmente, nós *fazemos* usar lançamentos menores para introduzir novos recursos.

No entanto, isso nem sempre é possível. Às vezes, novos recursos estão interconectados com *outros* novos recursos que ainda não foram totalmente completados e nos quais ainda estamos iterando ativamente. Não podemos liberá-los separadamente porque suas implementações estão relacionadas. Não podemos versioná-los separadamente porque afetam os mesmos pacotes (por exemplo, `react` e `react-dom`). E precisamos manter a capacidade de iterar nas partes que não estão prontas sem uma avalanche de lançamentos de versão major, que a semver exigiria que fizéssemos.

Na Meta, resolvemos esse problema construindo o React a partir da branch `main` e atualizando manualmente para um commit específico fixo a cada semana. Esta também é a abordagem que os lançamentos do React Native têm seguido nos últimos anos. Cada lançamento *estável* do React Native é fixado a um commit específico da branch `main` do repositório do React. Isso permite que o React Native inclua correções de bugs importantes e adote incrementalmente novos recursos do React no nível do framework sem ficar acoplado ao cronograma global de lançamentos do React.

Gostaríamos de tornar esse fluxo de trabalho disponível para outros frameworks e configurações curadas. Por exemplo, isso permite que um framework *em cima do* React inclua uma mudança de ruptura relacionada ao React *antes* que essa mudança de ruptura seja incluída em um lançamento estável do React. Isso é particularmente útil porque algumas mudanças de ruptura afetam apenas integrações de framework. Isso permite que um framework lance tal mudança em sua própria versão menor sem quebrar a semver.

Lançamentos contínuos com o canal Canaries nos permitirão ter um feedback mais rápido e garantir que novos recursos sejam testados de forma abrangente na comunidade. Esse fluxo de trabalho é mais próximo de como o TC39, o comitê de padrões JavaScript, [lida com mudanças em estágios numerados](https://tc39.es/process-document/). Novos recursos do React podem estar disponíveis em frameworks construídos sobre o React antes de estarem em uma versão estável do React, assim como novos recursos do JavaScript são lançados em navegadores antes de serem oficialmente ratificados como parte da especificação.

## Por que não usar lançamentos experimentais em vez disso? {/*why-not-use-experimental-releases-instead*/}

Embora você *possa* tecnicamente usar [lançamentos experimentais](/community/versioning-policy#canary-channel), recomendamos não usá-los em produção porque APIs experimentais podem sofrer mudanças impactantes significativas em seu caminho para a estabilização (ou podem até ser removidas completamente). Embora os Canários também possam conter erros (como qualquer lançamento), no futuro planejamos anunciar quaisquer mudanças impactantes significativas em Canários em nosso blog. Os Canários são os mais próximos do código que a Meta executa internamente, então você pode geralmente esperar que sejam relativamente estáveis. No entanto, você *precisa* manter a versão fixada e escanear manualmente o log de commits do GitHub ao atualizar entre os commits fixos.

**Esperamos que a maioria das pessoas usando React fora de uma configuração curada (como um framework) queira continuar usando os lançamentos estáveis.** No entanto, se você estiver construindo um framework, pode querer considerar a agregação de uma versão Canary do React fixada a um determinado commit e atualizá-la em seu próprio ritmo. O benefício disso é que permite que você envie recursos e correções de bugs individuais do React mais cedo para seus usuários e de acordo com seu próprio cronograma de lançamentos, semelhante ao que o React Native tem feito nos últimos anos. A desvantagem é que você assumiria uma responsabilidade adicional para revisar quais commits do React estão sendo incorporados e comunicar a seus usuários quais mudanças do React estão incluídas em seus lançamentos.

Se você é um autor de framework e deseja tentar essa abordagem, entre em contato conosco.

## Anunciando mudanças impactantes e novos recursos cedo {/*announcing-breaking-changes-and-new-features-early*/}

Os lançamentos Canary representam nosso melhor palpite do que irá para o próximo lançamento estável do React a qualquer momento.

Tradicionalmente, só anunciamos mudanças impactantes no *final* do ciclo de lançamento (quando fazemos um lançamento major). Agora que os lançamentos Canary são uma maneira oficialmente suportada de consumir o React, planejamos mudar para anunciar mudanças impactantes e novos recursos significativos *à medida que forem disponibilizados* nos Canários. Por exemplo, se mesclarmos uma mudança impactante que será liberada em um Canary, escreveremos um post sobre isso em nosso blog React, incluindo codemods e instruções de migração, se necessário. Então, se você é um autor de framework que está cortando um lançamento major que atualiza o Canary fixo do React para incluir essa mudança, você pode vincular ao nosso post do blog em suas notas de lançamento. Finalmente, quando uma versão major estável do React estiver pronta, vincularemos a esses posts do blog já publicados, o que esperamos ajudar nossa equipe a fazer progresso mais rapidamente.

Planejamos documentar APIs à medida que forem disponibilizadas nos Canários - mesmo que essas APIs ainda não estejam disponíveis fora delas. APIs que estão disponíveis apenas nos Canários serão marcadas com uma nota especial nas páginas correspondentes. Isso incluirá APIs como [`use`](https://github.com/reactjs/rfcs/pull/229) e algumas outras (como `cache` e `createServerContext`) para as quais enviaremos RFCs.

## Os Canários devem ser fixados {/*canaries-must-be-pinned*/}

Se você decidir adotar o fluxo de trabalho Canary para seu aplicativo ou framework, certifique-se de sempre fixar a versão *exata* do Canary que você está usando. Como os Canários são pré-lançamentos, eles ainda podem incluir mudanças de ruptura.

## Exemplo: Componentes do Servidor React {/*example-react-server-components*/}

Como anunciamos em março](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), as convenções dos Componentes do Servidor React foram finalizadas e não esperamos mudanças impactantes significativas relacionadas ao seu contrato de API voltado para o usuário. No entanto, não podemos lançar suporte para Componentes do Servidor React em uma versão estável do React ainda porque ainda estamos trabalhando em vários recursos interligados apenas para frameworks (como [carregamento de ativos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e esperamos mais mudanças impactantes lá.

Isso significa que os Componentes do Servidor React estão prontos para serem adotados por frameworks. No entanto, até o próximo lançamento major do React, a única maneira de um framework adotá-los é lançar uma versão Canary do React fixada. (Para evitar agrupar duas cópias do React, frameworks que desejam fazer isso precisariam forçar a resolução de `react` e `react-dom` para o Canary fixo que eles lançam com seu framework e explicar isso a seus usuários. Como exemplo, é isso que o Next.js App Router faz.)

## Testando bibliotecas contra versões Stable e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Não esperamos que autores de bibliotecas testem cada lançamento Canary, pois isso seria proibitivamente difícil. No entanto, assim como quando introduzimos originalmente os diferentes canais de pré-lançamento do React há três anos](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), encorajamos bibliotecas a executar testes contra *tanto* a versão Stable mais recente quanto a versão Canary mais recente. Se você observar uma mudança de comportamento que não foi anunciada, por favor, registre um bug no repositório do React para que possamos ajudar a diagnosticá-lo. Esperamos que, à medida que essa prática se torne amplamente adotada, ela reduzirá o esforço necessário para atualizar bibliotecas para novas versões major do React, já que regressões acidentais seriam encontradas assim que forem lançadas.

<Note>

Estritamente falando, o Canary não é um *novo* canal de lançamento - costumava ser chamado de Next. No entanto, decidimos renomeá-lo para evitar confusão com o Next.js. Estamos anunciando como um *novo* canal de lançamento para comunicar as novas expectativas, como os Canários sendo uma maneira oficialmente suportada de usar o React.

</Note>

## Lançamentos estáveis funcionam como antes {/*stable-releases-work-like-before*/}

Não estamos introduzindo nenhuma mudança nos lançamentos estáveis do React.