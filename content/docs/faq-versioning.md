---
id: faq-versioning
title: Política de Versão
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

O React segue os princípios de [versionamento semântico (semver)](https://semver.org/).

Isso significa que com um número de versão **x.y.z**:  

<<<<<<< HEAD
* Ao liberarmos uma **atualização que quebra compatibilidade**, fazemos uma **major release** alterando o número **x** (ex: 15.6.2 para 16.0.0).
* Ao liberarmos uma **atualização com novas funcionalidades**, fazemos uma **minor release** alterando o número **y** (ex: 15.6.2 para 15.7.0).
* Ao liberarmos uma **atualização para correção de erros**, fazemos um **patch release** alterando o número **z** (ex: 15.6.2 para 15.6.3).
=======
* When releasing **critical bug fixes**, we make a **patch release** by changing the **z** number (ex: 15.6.2 to 15.6.3).
* When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (ex: 15.6.2 to 15.7.0).
* When releasing **breaking changes**, we make a **major release** by changing the **x** number (ex: 15.6.2 to 16.0.0).
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc

Atualizações que quebram compatibilidade podem também conter novas funcionalidades, e qualquer versão pode incluir correção de erros.

<<<<<<< HEAD
### Atualizações que quebram compatibilidade {#breaking-changes} 
=======
Minor releases are the most common type of release.

### Breaking Changes {#breaking-changes}
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc

Atualizações que quebram compatibilidade são inconvenientes para todos, sendo assim, tentamos diminuir o número de major releases – por exemplo, React 15 foi lançado em Abril de 2016 e React 16 foi lançado em Setembro de 2017; React 17 não é esperado até 2019.

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

<<<<<<< HEAD
Dito isso, se nós percebermos que uma mudança desta lista possa causar problemas na comunidade, ainda faremos o nosso melhor para prover um plano gradual de migração.
=======
That said, if we expect that a change on this list will cause broad problems in the community, we will still do our best to provide a gradual migration path.

### If a Minor Release Includes No New Features, Why Isn't It a Patch? {#minors-versus-patches}

It's possible that a minor release will not include new features. [This is allowed by semver](https://semver.org/#spec-item-7), which states **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

However, it does raise the question of why these releases aren't versioned as patches instead.

The answer is that any change to React (or other software) carries some risk of breaking in unexpected ways. Imagine a scenario where a patch release that fixes one bug accidentally introduces a different bug. This would not only be disruptive to developers, but also harm their confidence in future patch releases. It's especially regrettable if the original fix is for a bug that is rarely encountered in practice.

We have a pretty good track record for keeping React releases free of bugs, but patch releases have an even higher bar for reliability because most developers assume they can be adopted without adverse consequences.

For these reasons, we reserve patch releases only for the most critical bugs and security vulnerabilities.

If a release includes non-essential changes — such as internal refactors, changes to implementation details, performance improvements, or minor bugfixes — we will bump the minor version even when there are no new features.
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc
