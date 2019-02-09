---
id: faq-structure
title: Estrutura de arquivos
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Existe uma maneira recomendada para estruturar os projetos em React? {#is-there-a-recommended-way-to-structure-react-projects}

O React não opina sobre como você deve estruturar o projeto. Dito isso, existem algumas abordagens populares que você pode experimentar.

#### Agrupar por funcionalidades ou rotas {#grouping-by-features-or-routes}

Uma maneira bem comum para estruturar os projetos é colocar CSS, JS e testes juntos dentro de pastas agrupadas por funcionalidades ou rotas, por exemplo:

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

A definição de "funcionalidade" não é universal e cabe a você escolher a granularidade. Se você não conseguir criar uma lista de pastas de alto nível, você pode perguntar para os usuários do seu produto quais são as partes principais que ele contém e usar o modelo mental como um plano.

#### Agrupar por tipo de arquivo {#grouping-by-file-type}

Outra maneira popular de estruturar projetos é agrupar arquivos semelhantes pelo tipo, por exemplo:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Algumas pessoas também preferem ir além, e separar os componentes em pastas diferentes, dependendo do papel que desempenham na aplicação. Por exemplo o [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) que é uma metodologia de design construída sobre este princípio. Lembre-se de que é mais produtivo tratar essas metodologias como exemplos úteis, ao invés de seguir regras estritas.

#### Evite muito aninhamento {#avoid-too-much-nesting}

Há diversos pontos problemáticos associados ao aninhamento de pastas em projetos JavaScript. Torna-se mais difícil gravar importações relativas entre elas ou atualizá-las quando os arquivos são movidos. A menos que você tenha um motivo muito convincente para usar uma estrutura de pastas aninhadas, considere limitar-se a um máximo de três ou quatro pastas aninhadas em um único projeto. Claro, isso é apenas uma recomendação e pode não ser relevante para o seu projeto.

#### Não pense muito {#dont-overthink-it}

Se você está apenas começando um projeto, [não gaste mais do que cinco minutos](https://en.wikipedia.org/wiki/Analysis_paralysis) na escolha de uma estrutura de arquivos. Escolha qualquer uma das abordagens acima (ou crie as suas próprias) e comece a escrever o código! Você provavelmente vai querer repensá-lo de qualquer jeito depois de ter escrito algum código.

Se você se sentir completamente preso, comece mantendo todos os arquivos em uma única pasta. Eventualmente ele crescerá o suficiente para que você deseje separar alguns arquivos dos demais. A essa altura, você terá conhecimento suficiente para saber quais arquivos são modificados juntos com mais frequência. Em geral é uma boa ideia manter os arquivos que geralmente mudam juntos uns dos outros. Este princípio é chamado de "colocation".

À medida que os projetos vão crescendo, eles costumam usar uma mistura de ambas as abordagens acima na prática. Então escolher a abordagem "certa" no começo não é muito importante.
