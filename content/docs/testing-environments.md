---
id: testing-environments
title: Ambientes de Teste
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Este documento aborda fatores que podem afetar o seu ambiente de testes assim como recomendações para alguns cenários.

### Test runners {#test-runners}

_Test runners_ como [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) te permitem escrever suítes de teste na forma de JavaScript, e executa-las como parte do seu processo de desenvolvimento. Adicionalmente, suítes de teste são executadas como parte da integração contínua.

- Jest é amplamente compatível com projetos em React, dando suporte à funcionalidades como mock de [módulos](#mocking-modules) e [temporizadores](#mocking-timers), e suporte à [`jsdom`](#mocking-a-rendering-surface). **Se você utiliza o Create React App, o [Jest já vem incluso desde o começo](https://facebook.github.io/create-react-app/docs/running-tests) com configurações padrão úteis.**
- Bibliotecas como [mocha](https://mochajs.org/#running-mocha-in-the-browser) funcionam bem em ambientes com navegadores de verdade, e podem ajudar em testes que dependam explicitamente de navegadores.
- Testes _end-to-end_ são utilizados para testar fluxos mais longos através de várias páginas, e requerem uma [configuração diferente](#end-to-end-tests-aka-e2e-tests).

### Fazendo o mock de uma superfície de renderização {#mocking-a-rendering-surface}

É comum que testes sejam executados em um ambiente que não possui acesso a uma superfície de renderização real como um navegador. Para esses ambientes, nós recomendamos simular um navegador com [`jsdom`](https://github.com/jsdom/jsdom), uma implementação de um navegador com um tamanho leve que é executada em Node.js.

Na maioria dos casos, jsdom se comporta da mesma forma que um navegador comum, mas ela não tem funcionalidades como [layout e navegação](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Ainda assim, ela continua sendo útil para a maioria dos testes de componentes web, já que ela consegue ser executada de forma mais rápida do que tendo que iniciar um navegador para cada teste. Ela também é executada no mesmo processo dos seus testes, o que possibilita que você escreva testes para examinar e fazer asserções sobre o DOM renderizado.

Assim como em um navegador de verdade, jsdom nos permite modelar interações de usuário; testes podem disparar eventos em nós do DOM, e assim observar e fazer verificações sobre os efeitos colaterais dessas ações [<small>(exemplo)</small>](/docs/testing-recipes.html#events).

Uma grande parte dos testes de UI podem ser escritos com a seguinte configuração: Jest sendo usado como _test runner_, renderização feita com o uso de jsdom, e com interações de usuário definidas a partir de sequências de eventos do navegador, com o uso da função auxiliar`act()` [<small>(exemplo)</small>](/docs/testing-recipes.html). Grande parte dos testes da própria biblioteca do React são escritas com essa combinação, por exemplo.

Se você está criando uma biblioteca que testa em sua maioria comportamentos específicos de um navegador, e necessita de um comportamento nativo de um navegador como _layout_ ou _inputs_ de verdade, você pode usar um _framework_ como [mocha](https://mochajs.org/).

Em um ambiente onde você _não pode_ simular um DOM (por exemplo, testes de componentes do React Native no Node.js), você poderia usar [funções auxiliares de simulação de eventos](/docs/test-utils.html#simulate) para simular interações com elementos. Como uma outra alternativa, você pode usar a função auxiliar`fireEvent` da [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

Frameworks como [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) e [webdriver](https://www.seleniumhq.org/projects/webdriver/) são úteis para executar [testes end-to-end](#end-to-end-tests-aka-e2e-tests).

### Fazendo o mock de funções {#mocking-functions}

Ao escrever testes, nós gostaríamos de fazer o mock nas partes do nosso código que não possuem um equivalente dentro do nosso ambiente de testes (por exemplo, checar o status `navigator.onLine` dentro do Node.js). Testes também podem espiar algumas funções e observar como outras partes do teste interagem com elas. Portanto, a possibilidade de fazer o mock de funções selecionadas por versões mais amigáveis para testes é algo bem útil.

Isso é algo especialmente útil para a obtenção de dados (data fetching). Prefere-se normalmente que sejam usados dados "falsos" para testes a fim de evitar a lentidão e a inconstância causada pelo fetching de endpoints de uma API de verdade [<small>(exemplo)</small>](/docs/testing-recipes.html#data-fetching). Isso ajuda a fazer com que os testes sejam previsíveis. Bibliotecas como [Jest](https://jestjs.io/) e [sinon](https://sinonjs.org/), dentre outras, suportam o mock de funções. Para testes _end-to-end_, fazer o mock da sua rede de internet pode ser mais difícil, mas você provavelmente irá querer testar os endpoints da API de verdade ao fazê-los.

### Fazendo o mock de módulos {#mocking-modules}

Alguns componentes dependem de módulos que podem não funcionar corretamente em ambientes de testes, ou que não são essenciais para os nossos testes. Um mock seletivo desses módulos pode ser útil, com o uso de substitutos adequados[<small>(exemplo)</small>](/docs/testing-recipes.html#mocking-modules).

No Node.js, executadores de teste como o Jest [dão suporte ao mock de módulos](https://jestjs.io/docs/en/manual-mocks). Você também pode usar bibliotecas como [`mock-require`](https://www.npmjs.com/package/mock-require).

### Fazendo o mock de temporizadores {#mocking-timers}

Alguns componentes podem estar usando funções com base no tempo como `setTimeout`, `setInterval`, ou `Date.now`. Em ambientes de teste, fazer o mock dessas funções com substitutos que lhe permitam "avançar no tempo" pode ser de grande ajuda. Isso é ótimo para garantir que os seus testes executem de forma rápida! Testes que dependem de temporizadores ainda seriam resolvidos ordenadamente, mas de forma mais rápida[<small>(exemplo)</small>](/docs/testing-recipes.html#timers). A maioria dos frameworks, incluindo o [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) e [lolex](https://github.com/sinonjs/lolex), permitem que você faça o mock de temporizadores nos seus testes.

Às vezes, você pode não querer fazer o mock de temporizadores. Por exemplo, talvez você está testando uma animação, ou interagindo com um endpoint que é sensível a tempo (como uma API com um limitador de requisições). Bibliotecas com mocks de temporizadores te permitem habilitar e desabilitar esses mocks para cada teste/suíte de testes, de forma que você pode explicitamente escolher como esses testes irão ser executados.

### Testes end-to-end {#end-to-end-tests-aka-e2e-tests}

Testes _end-to-end_ são úteis para testar grandes fluxos de trabalho, especialmente quando eles são críticos para o seu negócio (por exemplo, pagamentos ou criação de contas). Para esses testes, você provavelmente irá querer testar não só a forma que um navegador de verdade renderiza a aplicação inteira, como também a forma em que ele busca dados dos endpoints da API de verdade, usa sessões e cookies, e navega entre links diferentes. Você também pode querer fazer verificações não somente no estado do DOM, como também nos dados da aplicação (por exemplo, verificar se as atualizações foram persistidas ou não para o banco de dados).

Nesse cenário, poderiam ser utilizados frameworks como [Cypress](https://www.cypress.io/) ou uma biblioteca como [puppeteer](https://github.com/GoogleChrome/puppeteer) para que você possa navegar entre múltiplas rotas e fazer asserções sobre efeitos colaterais não somente no navegador, mas também possivelmente no backend.
