---
id: faq-versioning
title: Política de Versão
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

O React segue os princípios de [versionamento semântico (semver)](https://semver.org/).

Isso significa que com um número de versão **x.y.z**:  

* Ao liberarmos uma **correção de um bug crítico**, fazemos um **patch release** alterando o número **z** (ex: 15.6.2 para 15.6.3).
* Ao liberarmos uma **atualização com novas funcionalidades**, fazemos uma **minor release** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao liberarmos uma **atualização que quebra compatibilidade**, fazemos uma **major release** alterando o número **x** (ex: 15.6.2 para 16.0.0).

Atualizações que quebram compatibilidade podem também conter novas funcionalidades, e qualquer versão pode incluir correção de erros.

Versões minor são o tipo mais comum de versão.

> Esta política de controle de versão não se aplica às compilações de pré-lançamento nos canais Next ou Experimental. [Saiba mais sobre pré-lançamentos.](/docs/release-channels.html)

### Atualizações que quebram compatibilidade {#breaking-changes}

Atualizações que quebram compatibilidade são inconvenientes para todos, sendo assim, tentamos diminuir o número de major releases – por exemplo, React 15 foi lançado em Abril de 2016 e React 16 foi lançado em Setembro de 2017; React 17 não é esperado até algum dia em 2020.

Todavia, lançamos novas funcionalidades em versões menores. Isso significa que updates menores são mais interessantes e convenientes que versões maiores, apesar de parecer o contrário.

### Compromisso com a Estabilidade {#commitment-to-stability} 

Conforme o React é alterado, tentamos minimizar o esforço necessário para tirar um melhor proveito das novas funcionalidades. Quando possível mantemos uma versão anterior da API em funcionamento, mesmo que isso signifique colocá-la em outro pacote. Por exemplo, [mixins são desencorajados há anos](/blog/2016/07/13/mixins-considered-harmful.html) porém atualmente continuam sendo suportados [via create-react-class](/docs/react-without-es6.html#mixins) e muitas bases de código continuam a usá-los em versões estáveis e legadas.

Mais de um milhão de desenvolvedores utilizam o React, coletivamente mantendo milhões de componentes. Apenas o código base do Facebook possui mais de 50.000 componentes. Isso significa que precisamos deixá-lo o mais simples possível para atualizar para novas versões; Se nós realizarmos grandes mudanças sem um plano de migração, as pessoas poderão ficar presas em versões anteriores. As atualizações são testadas no próprio Facebook – se nosso time de menos de 10 pessoas consegue atualizar 50.000+ de componentes sozinhos, nós esperamos que a atualização seja possível para qualquer um que use o React. Em muitos casos, escrevemos [scripts](https://github.com/reactjs/react-codemod) afim de atualizar a sintaxe dos componentes, nos quais incluímos na versão de código fonte para uso de todos.

### Atualizações Graduais através de Advertências {#gradual-upgrades-via-warnings}

Aplicações desenvolvidas em React incluem muitas advertências úteis. Sempre que possível, nós adicionamos advertências afim de preparar para grandes alterações futuras que possam quebrar a compatibilidade. Dessa forma, se a sua aplicação não possui nenhuma advertência na última versão, ela será compatível com a próxima grande atualização. Isso permitirá a você atualizar os componentes do seu aplicativo um a um.  

As advertências de desenvolvimento não afetarão o desempenho da sua aplicação. Dessa maneira, você pode se sentir confiante de que sua aplicação se comportará da mesma maneira entre as versões de desenvolvimento e produção – as únicas diferenças serão de que a versão de produção não apresentará logs de advertência, tornando-a mais eficiente. (Caso você note o contrário, por gentileza, abra uma issue).

### O que Conta como uma Atualização que Quebra Compatibilidade? {#what-counts-as-a-breaking-change}

No geral, *não* alteramos o número de major version por alterações como:

* **Advertências de Desenvolvimento.** Já que estas não afetam o comportamento de produção, nós podemos adicionar novas advertências ou modificar as existentes entre novas versões. De fato, isso é o que nos permite garantir a segurança das próximas versões. 
* **APIs començando com `unstable_`.** Estas são providas como funcionalidades experimentais das quais ainda não possuímos certa estabilidade das APIs. Ao liberarmos estas com um prefixo `unstable_`, podemos rapidamente iterar e tornar a API estável de forma mais rápida.  
* **Versões alpha e canary do React.** Nós provemos versões alpha do React como uma maneira de testar novas funcionalidades de forma mais rápida, porém precisamos da flexibilidade para realizar alterações baseadas no que aprendemos com o período da versão alpha. Caso você faça uso destas versões, note que as APIs podem mudar antes do lançamento da versão estável. 
* **APIs não documentadas e estrutura de dados interna.** Se você acessa propriedades com nomes internos como `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`, não há garantia alguma. Você está por conta própria.

Este documento é destinado a ser pragmático: obviamente, não queremos causar dores de cabeça a você. Se nós alterarmos a major version para todas essas mudanças, nós terminaríamos liberando mais major versions e consequentemente causando mais dores de versionamento para a comunidade. Isso também significaria que não poderíamos melhorar o React tão rápido quanto gostaríamos.

Dito isso, se nós percebermos que uma mudança desta lista possa causar problemas na comunidade, ainda faremos o nosso melhor para prover um plano gradual de migração.

### Se uma versão secundária não inclui novos recursos, por que não é um Patch? {#minors-versus-patches}

É possível que uma versão minor não inclua novos recursos. [Isso é permitido por semver](https://semver.org/#spec-item-7), que afirma que **"[uma versão minor] PODE ser incrementada se novas funcionalidades substanciais ou melhorias forem introduzidas no código privado. Como PODE incluir alterações no nível do patch."**

No entanto, levanta a questão de por que esses lançamentos não são versionados como patches.

A resposta é que qualquer alteração no React (ou outro software) acarreta algum risco de quebra de maneiras inesperadas. Imagine um cenário em que uma versão de patch que corrija um bug introduza acidentalmente um bug diferente. Isso não só prejudicaria os desenvolvedores, mas também prejudicaria sua confiança em futuros lançamentos de patches. É especialmente lamentável se a correção original for um bug que raramente é encontrado na prática.

Temos um histórico muito bom para manter as versões React livres de bugs, mas as versões de patches têm uma barra ainda mais alta de de confiabilidade, porque a maioria dos desenvolvedores supõe que elas podem ser adotadas sem consequências adversas.

Por esses motivos, reservamos versões de patches apenas para os bugs mais críticos e vulnerabilidades de segurança.

Se uma versão incluir alterações não essenciais - como refatores internos, alterações nos detalhes de implementação, melhorias de desempenho ou correções menores - nós iremos colidir com a versão secundária mesmo quando não houver novos recursos.
