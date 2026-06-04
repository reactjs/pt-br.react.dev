---
title: "React Labs: What We've Been Working On – February 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar nosso avanço.
---

15 de fevereiro de 2024 por [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode) e [Dan Abramov](https://bsky.app/profile/danabra.mov).

---

<Intro>

Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023), e gostaríamos de compartilhar nosso progresso.

</Intro>

---

## Compilador React {/*react-compiler*/}

O Compilador React não é mais um projeto de pesquisa: o compilador agora alimenta o instagram.com em produção, e estamos trabalhando para implantar o compilador em superfícies adicionais na Meta e preparar o primeiro lançamento de código aberto.

Como discutido em nossa [postagem anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React pode *às vezes* renderizar demais quando o estado muda. Desde os primórdios do React, nossa solução para tais casos tem sido a memoização manual. Em nossas APIs atuais, isso significa aplicar as APIs [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) para ajustar manualmente o quanto o React renderiza em resposta a mudanças de estado. Mas a memoização manual é um compromisso. Ela polui nosso código, é fácil de errar e requer trabalho extra para mantê-la atualizada.

A memoização manual é um compromisso razoável, mas não estávamos satisfeitos. Nossa visão é que o React re-renderize *automaticamente* apenas as partes certas da UI quando o estado muda, *sem comprometer o modelo mental principal do React*. Acreditamos que a abordagem do React — UI como uma função simples do estado, com valores e idiomatismos JavaScript padrão — é uma parte fundamental do motivo pelo qual o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para React.

JavaScript é uma linguagem notoriamente desafiadora para otimizar, graças às suas regras flexíveis e natureza dinâmica. O Compilador React é capaz de compilar código com segurança, modelando tanto as regras do JavaScript *quanto* as "regras do React". Por exemplo, componentes React devem ser idempotentes — retornando o mesmo valor dadas as mesmas entradas — e não podem mutar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a criar um espaço seguro para o compilador otimizar.

Claro, entendemos que os desenvolvedores às vezes dobram um pouco as regras, e nosso objetivo é fazer com que o Compilador React funcione "out of the box" na maior quantidade de código possível. O compilador tenta detectar quando o código não segue estritamente as regras do React e compilará o código onde for seguro ou pulará a compilação se não for seguro. Estamos testando contra a base de código grande e variada da Meta para ajudar a validar essa abordagem.

Para desenvolvedores que estão curiosos sobre como garantir que seu código siga as regras do React, recomendamos [ativar o Strict Mode](/reference/react/StrictMode) e [configurar o plugin ESLint do React](/learn/editor-setup#linting). Essas ferramentas podem ajudar a capturar bugs sutis em seu código React, melhorando a qualidade de seus aplicativos hoje e preparando seus aplicativos para recursos futuros como o Compilador React. Também estamos trabalhando na documentação consolidada das regras do React e em atualizações para nosso plugin ESLint para ajudar as equipes a entender e aplicar essas regras para criar aplicativos mais robustos.

Para ver o compilador em ação, você pode conferir nossa [palestra do outono passado](https://www.youtube.com/watch?v=qOQClO3g8-Y). Na época da palestra, tínhamos dados experimentais iniciais de testes do Compilador React em uma página do instagram.com. Desde então, implantamos o compilador em produção em todo o instagram.com. Também expandimos nossa equipe para acelerar a implantação em superfícies adicionais na Meta e para código aberto. Estamos animados com o caminho a seguir e teremos mais a compartilhar nos próximos meses.

## Ações {/*actions*/}


[Compartilhamos anteriormente](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) que estávamos explorando soluções para enviar dados do cliente para o servidor com Server Actions, para que você possa executar mutações de banco de dados e implementar formulários. Durante o desenvolvimento das Server Actions, estendemos essas APIs para suportar o manuseio de dados em aplicativos apenas do lado do cliente também.

Referimo-nos a essa coleção mais ampla de recursos simplesmente como "Ações". As Ações permitem que você passe uma função para elementos DOM como [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

A função `action` pode operar de forma síncrona ou assíncrona. Você pode defini-las no lado do cliente usando JavaScript padrão ou no servidor com a diretiva [`'use server'`](/reference/rsc/use-server). Ao usar uma ação, o React gerenciará o ciclo de vida da submissão de dados para você, fornecendo hooks como [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) e [`useActionState`](/reference/react/useActionState) para acessar o estado atual e a resposta da ação do formulário.

Por padrão, as Ações são submetidas dentro de uma [transição](/reference/react/useTransition), mantendo a página atual interativa enquanto a ação está em processamento. Como as Ações suportam funções assíncronas, também adicionamos a capacidade de usar `async/await` em transições. Isso permite que você mostre UI pendente com o estado `isPending` de uma transição quando uma solicitação assíncrona como `fetch` começa, e mostre a UI pendente até que a atualização seja aplicada.

Juntamente com as Ações, estamos introduzindo um recurso chamado [`useOptimistic`](/reference/react/useOptimistic) para gerenciar atualizações de estado otimistas. Com este hook, você pode aplicar atualizações temporárias que são revertidas automaticamente assim que o estado final é confirmado. Para Ações, isso permite que você defina otimisticamente o estado final dos dados no cliente, assumindo que a submissão foi bem-sucedida, e reverta para o valor dos dados recebidos do servidor. Ele funciona usando `async`/`await` regular, então funciona da mesma forma, quer você esteja usando `fetch` no cliente ou uma Server Action do servidor.

Autores de bibliotecas podem implementar props `action={fn}` personalizadas em seus próprios componentes com `useTransition`. Nossa intenção é que as bibliotecas adotem o padrão de Ações ao projetar suas APIs de componentes, para fornecer uma experiência consistente para desenvolvedores React. Por exemplo, se sua biblioteca fornece um componente `<Calendar onSelect={eventHandler}>`, considere também expor uma API `<Calendar selectAction={action}>`.

Embora inicialmente tenhamos focado em Server Actions para transferência de dados cliente-servidor, nossa filosofia para o React é fornecer o mesmo modelo de programação em todas as plataformas e ambientes. Quando possível, se introduzirmos um recurso no cliente, nosso objetivo é fazê-lo funcionar também no servidor, e vice-versa. Essa filosofia nos permite criar um conjunto único de APIs que funcionam independentemente de onde seu aplicativo é executado, facilitando a atualização para diferentes ambientes posteriormente.

As Ações agora estão disponíveis no canal Canary e serão lançadas na próxima versão do React.

## Novos Recursos no React Canary {/*new-features-in-react-canary*/}

Introduzimos [React Canaries](/blog/2023/05/03/react-canaries) como uma opção para adotar recursos estáveis individuais assim que seu design estiver próximo de ser finalizado, antes de serem lançados em uma versão semver estável.

Canaries são uma mudança na forma como desenvolvemos o React. Anteriormente, os recursos eram pesquisados e construídos privadamente dentro da Meta, então os usuários só viam o produto final polido quando lançado para Estável. Com Canaries, estamos construindo publicamente com a ajuda da comunidade para finalizar os recursos que compartilhamos nas séries de blog do React Labs. Isso significa que você ouve sobre novos recursos mais cedo, enquanto eles estão sendo finalizados, em vez de depois de estarem completos.

React Server Components, Asset Loading, Document Metadata e Actions chegaram ao React Canary, e adicionamos documentação para esses recursos em react.dev:

- **Diretivas**: [`"use client"`](/reference/rsc/use-client) e [`"use server"`](/reference/rsc/use-server) são recursos de bundler projetados para frameworks React full-stack. Eles marcam os "pontos de divisão" entre os dois ambientes: `"use client"` instrui o bundler a gerar uma tag `<script>` (como [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), enquanto `"use server"` diz ao bundler para gerar um endpoint POST (como [tRPC Mutations](https://trpc.io/docs/concepts)). Juntos, eles permitem que você escreva componentes reutilizáveis que compõem a interatividade do lado do cliente com a lógica relacionada do lado do servidor.

- **Metadados do Documento**: adicionamos suporte integrado para renderizar tags [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) e de metadados [`<link>`](/reference/react-dom/components/link) em qualquer lugar da sua árvore de componentes. Eles funcionam da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e RSC. Isso fornece suporte integrado para recursos pioneiros por bibliotecas como [React Helmet](https://github.com/nfl/react-helmet).

- **Carregamento de Recursos**: integramos Suspense com o ciclo de vida de carregamento de recursos como stylesheets, fontes e scripts para que o React os leve em consideração para determinar se o conteúdo em elementos como [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) e [`<script>`](/reference/react-dom/components/script) estão prontos para serem exibidos. Também adicionamos novas [APIs de Carregamento de Recursos](/reference/react-dom#resource-preloading-apis) como `preload` e `preinit` para fornecer maior controle sobre quando um recurso deve carregar e inicializar.

- **Ações**: Conforme compartilhado acima, adicionamos Ações para gerenciar o envio de dados do cliente para o servidor. Você pode adicionar `action` a elementos como [`<form/>`](/reference/react-dom/components/form), acessar o status com [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), lidar com o resultado com [`useActionState`](/reference/react/useActionState) e atualizar otimisticamente a UI com [`useOptimistic`](/reference/react/useOptimistic).

Como todos esses recursos funcionam juntos, é difícil lançá-los individualmente no canal Estável. Lançar Ações sem os hooks complementares para acessar estados de formulário limitaria a usabilidade prática das Ações. Introduzir React Server Components sem integrar Server Actions complicaria a modificação de dados no servidor.

Antes de podermos lançar um conjunto de recursos para o canal Estável, precisamos garantir que eles funcionem de forma coesa e que os desenvolvedores tenham tudo o que precisam para usá-los em produção. React Canaries nos permite desenvolver esses recursos individualmente e lançar as APIs estáveis incrementalmente até que todo o conjunto de recursos esteja completo.

O conjunto atual de recursos no React Canary está completo e pronto para ser lançado.

## A Próxima Versão Principal do React {/*the-next-major-version-of-react*/}

Após alguns anos de iteração, `react@canary` está agora pronto para ser lançado para `react@latest`. Os novos recursos mencionados acima são compatíveis com qualquer ambiente em que seu aplicativo seja executado, fornecendo tudo o que é necessário para uso em produção. Como Asset Loading e Document Metadata podem ser uma mudança disruptiva para alguns aplicativos, a próxima versão do React será uma versão principal: **React 19**.

Ainda há mais a ser feito para preparar o lançamento. No React 19, também estamos adicionando melhorias solicitadas há muito tempo que exigem mudanças disruptivas, como suporte para Web Components. Nosso foco agora é implementar essas mudanças, preparar o lançamento, finalizar a documentação para novos recursos e publicar anúncios sobre o que está incluído.

Compartilharemos mais informações sobre tudo o que o React 19 inclui, como adotar os novos recursos do cliente e como criar suporte para React Server Components nos próximos meses.

## Offscreen (renomeado para Activity). {/*offscreen-renamed-to-activity*/}

Desde nossa última atualização, renomeamos uma capacidade que estamos pesquisando de "Offscreen" para "Activity". O nome "Offscreen" implicava que ele se aplicava apenas a partes do aplicativo que não eram visíveis, mas ao pesquisar o recurso, percebemos que é possível que partes do aplicativo sejam visíveis e inativas, como conteúdo atrás de um modal. O novo nome reflete mais de perto o comportamento de marcar certas partes do aplicativo como "ativas" ou "inativas".

Activity ainda está em pesquisa e nosso trabalho restante é finalizar os primitivos que são expostos aos desenvolvedores de bibliotecas. Priorizamos essa área enquanto nos concentramos em lançar recursos mais completos.

* * *

Além desta atualização, nossa equipe apresentou em conferências e apareceu em podcasts para falar mais sobre nosso trabalho e responder a perguntas.

- [Sathya Gunasekaran](https://github.com/gsathya) falou sobre o Compilador React na conferência [React India](https://www.youtube.com/watch?v=kjOacmVsLSE).

- [Dan Abramov](/community/team#dan-abramov) deu uma palestra na [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitulada "React from Another Dimension", que explora uma história alternativa de como React Server Components e Actions poderiam ter sido criados.

- [Dan Abramov](/community/team#dan-abramov) foi entrevistado no [podcast JS Party do Changelog](https://changelog.com/jsparty/311) sobre React Server Components.

- [Matt Carroll](/community/team#matt-carroll) foi entrevistado no [podcast Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll), onde discutiu [The Two Reacts](https://overreacted.io/the-two-reacts/).

Obrigado [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) e [Sathya Gunasekaran](https://twitter.com/_gsathya) por revisar esta postagem.

Obrigado por ler, e [vemo-nos na React Conf](https://conf.react.dev/)!