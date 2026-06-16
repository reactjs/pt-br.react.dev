---
title: "React Labs: What We've Been Working On – February 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar nosso progresso.
---

15 de fevereiro de 2024 por[Joseph Savona](https://twitter.com/en_JS),[Ricky Hanlon](https://twitter.com/rickhanlonii),[Andrew Clark](https://twitter.com/acdlite),[Matt Carroll](https://twitter.com/mattcarrollcode), e[Dan Abramov](https://bsky.app/profile/danabra.mov).

---

<Intro>

Em posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa[última atualização](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023), e gostaríamos de compartilhar nosso progresso.

</Intro>

---

## React Compiler{/*react-compiler*/}

O React Compiler não é mais um projeto de pesquisa: o compilador agora impulsiona o instagram.com em produção, e estamos trabalhando para lançar o compilador em outras superfícies na Meta e preparar o primeiro lançamento open source.

Como discutido em nosso[post anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React pode*às vezes*re-renderizar demais quando o estado muda. Desde os primórdios do React, nossa solução para esses casos tem sido a memoização manual. Em nossas APIs atuais, isso significa aplicar as APIs[`useMemo`](/reference/react/useMemo),[`useCallback`](/reference/react/useCallback), e[`memo`](/reference/react/memo)para ajustar manualmente o quanto o React re-renderiza em mudanças de estado. Mas a memoização manual é um compromisso. Ela polui nosso código, é fácil de errar e requer trabalho extra para mantê-la atualizada.

A memoização manual é um compromisso razoável, mas não estávamos satisfeitos. Nossa visão é que o React*automaticamente*re-renderize apenas as partes certas da UI quando o estado muda,*sem comprometer o modelo mental principal do React*. Acreditamos que a abordagem do React — UI como uma função simples do estado, com valores e idiomatismos padrão do JavaScript — é uma parte fundamental do motivo pelo qual o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para o React.

O JavaScript é uma linguagem notoriamente desafiadora para otimizar, graças às suas regras flexíveis e natureza dinâmica. O React Compiler consegue compilar código com segurança modelando tanto as regras do JavaScript*quanto*as “regras do React”. Por exemplo, componentes React devem ser idempotentes — retornando o mesmo valor dadas as mesmas entradas — e não podem mutar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a criar um espaço seguro para o compilador otimizar.

Claro, entendemos que os desenvolvedores às vezes dobram um pouco as regras, e nosso objetivo é fazer com que o React Compiler funcione de imediato na maior parte do código possível. O compilador tenta detectar quando o código não segue estritamente as regras do React e compilará o código onde for seguro ou pulará a compilação se não for seguro. Estamos testando contra a base de código grande e variada da Meta para ajudar a validar essa abordagem.

Para desenvolvedores curiosos em garantir que seu código siga as regras do React, recomendamos[habilitar o Strict Mode](/reference/react/StrictMode)e[configurar o plugin ESLint do React](/learn/editor-setup#linting). Essas ferramentas podem ajudar a capturar bugs sutis em seu código React, melhorando a qualidade de seus aplicativos hoje e preparando seus aplicativos para o futuro com recursos futuros como o React Compiler. Também estamos trabalhando na documentação consolidada das regras do React e em atualizações para nosso plugin ESLint para ajudar as equipes a entender e aplicar essas regras para criar aplicativos mais robustos.

Para ver o compilador em ação, você pode conferir nossa[palestra do outono passado](https://www.youtube.com/watch?v=qOQClO3g8-Y). Na época da palestra, tínhamos dados experimentais iniciais de testes do React Compiler em uma página do instagram.com. Desde então, lançamos o compilador em produção em todo o instagram.com. Também expandimos nossa equipe para acelerar o lançamento em outras superfícies na Meta e para o open source. Estamos animados com o caminho à frente e teremos mais a compartilhar nos próximos meses.

## Actions{/*actions*/}


Nós[anteriormente compartilhamos](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)que estávamos explorando soluções para enviar dados do cliente para o servidor com Server Actions, para que você possa executar mutações de banco de dados e implementar formulários. Durante o desenvolvimento de Server Actions, estendemos essas APIs para suportar o manuseio de dados em aplicativos apenas do lado do cliente também.

Nós nos referimos a essa coleção mais ampla de recursos simplesmente como "Actions". Actions permitem que você passe uma função para elementos DOM como[`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

A função`action`pode operar de forma síncrona ou assíncrona. Você pode defini-las no lado do cliente usando JavaScript padrão ou no servidor com a diretiva[`'use server'`](/reference/rsc/use-server). Ao usar uma action, o React gerenciará o ciclo de vida da submissão de dados para você, fornecendo hooks como[`useFormStatus`](/reference/react-dom/hooks/useFormStatus), e[`useActionState`](/reference/react/useActionState)para acessar o estado atual e a resposta da action do formulário.

Por padrão, Actions são submetidas dentro de uma[transição](/reference/react/useTransition), mantendo a página atual interativa enquanto a action está processando. Como Actions suportam funções assíncronas, também adicionamos a capacidade de usar`async/await`em transições. Isso permite que você mostre uma UI pendente com o`isPending`estado de uma transição quando uma requisição assíncrona como`fetch`inicia, e mostre a UI pendente até que a atualização seja aplicada.

Junto com Actions, estamos introduzindo um recurso chamado[`useOptimistic`](/reference/react/useOptimistic)para gerenciar atualizações de estado otimistas. Com este hook, você pode aplicar atualizações temporárias que são automaticamente revertidas assim que o estado final é confirmado. Para Actions, isso permite que você defina otimisticamente o estado final dos dados no cliente, assumindo que o envio foi bem-sucedido, e reverta para o valor dos dados recebidos do servidor. Ele funciona usando o padrão`async`/`await`, então funciona da mesma forma se você estiver usando`fetch`no cliente, ou uma Server Action do servidor.

Autores de bibliotecas podem implementar`action={fn}`props em seus próprios componentes com`useTransition`. Nossa intenção é que as bibliotecas adotem o padrão Actions ao projetar suas APIs de componentes, para fornecer uma experiência consistente para desenvolvedores React. Por exemplo, se sua biblioteca fornece um componente`<Calendar onSelect={eventHandler}>`componente, considere também expor uma API`<Calendar selectAction={action}>`, também.

Embora inicialmente tenhamos focado em Server Actions para transferência de dados cliente-servidor, nossa filosofia para o React é fornecer o mesmo modelo de programação em todas as plataformas e ambientes. Quando possível, se introduzirmos um recurso no cliente, nosso objetivo é fazê-lo funcionar também no servidor, e vice-versa. Essa filosofia nos permite criar um único conjunto de APIs que funcionam onde quer que seu aplicativo seja executado, facilitando a atualização para diferentes ambientes posteriormente.

Actions agora estão disponíveis no canal Canary e serão lançadas na próxima versão do React.

## Novos recursos no React Canary{/*new-features-in-react-canary*/}

Introduzimos[React Canaries](/blog/2023/05/03/react-canaries)como uma opção para adotar recursos estáveis individuais assim que seu design estiver próximo do final, antes de serem lançados em uma versão semver estável.

Canaries são uma mudança na forma como desenvolvemos o React. Anteriormente, os recursos eram pesquisados e construídos privadamente dentro da Meta, então os usuários só viam o produto final polido quando lançado para Estável. Com Canaries, estamos construindo publicamente com a ajuda da comunidade para finalizar recursos que compartilhamos na série de blogs React Labs. Isso significa que você ouve sobre novos recursos mais cedo, à medida que estão sendo finalizados, em vez de depois de estarem completos.

React Server Components, Carregamento de Assets, Metadados de Documento e Actions já foram incorporados ao React Canary, e adicionamos documentação para esses recursos em react.dev:

- **Directives**:[`"use client"`](/reference/rsc/use-client)e[`"use server"`](/reference/rsc/use-server)são recursos de bundler projetados para frameworks React full-stack. Eles marcam os "pontos de divisão" entre os dois ambientes:`"use client"`instrui o bundler a gerar uma tag`<script>`(como[Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), enquanto`"use server"`diz ao bundler para gerar um endpoint POST (como[tRPC Mutations](https://trpc.io/docs/concepts)). Juntos, eles permitem que você escreva componentes reutilizáveis que compõem a interatividade do lado do cliente com a lógica relacionada do lado do servidor.

- **Metadados de Documento**: adicionamos suporte integrado para renderizar[`<title>`](/reference/react-dom/components/title),[`<meta>`](/reference/react-dom/components/meta), e metadados[`<link>`](/reference/react-dom/components/link)tags em qualquer lugar em sua árvore de componentes. Eles funcionam da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e RSC. Isso fornece suporte integrado para recursos pioneiros de bibliotecas como[React Helmet](https://github.com/nfl/react-helmet).

- **Carregamento de Assets**: integramos Suspense com o ciclo de vida de carregamento de recursos como stylesheets, fontes e scripts para que o React os leve em consideração para determinar se o conteúdo em elementos como[`<style>`](/reference/react-dom/components/style),[`<link>`](/reference/react-dom/components/link), e[`<script>`](/reference/react-dom/components/script)estão prontos para serem exibidos. Também adicionamos novas APIs de[Resource Loading APIs](/reference/react-dom#resource-preloading-apis)como`preload`e`preinit`para fornecer maior controle sobre quando um recurso deve carregar e inicializar.

- **Actions**: Conforme compartilhado acima, adicionamos Actions para gerenciar o envio de dados do cliente para o servidor. Você pode adicionar`action`a elementos como[`<form/>`](/reference/react-dom/components/form), acessar o status com[`useFormStatus`](/reference/react-dom/hooks/useFormStatus), lidar com o resultado com[`useActionState`](/reference/react/useActionState), e otimisticamente atualizar a UI com[`useOptimistic`](/reference/react/useOptimistic).

Como todas essas funcionalidades funcionam juntas, é difícil lançá-las individualmente no canal Estável. Lançar Actions sem os hooks complementares para acessar os estados do formulário limitaria a usabilidade prática das Actions. Introduzir Componentes de Servidor React sem integrar Actions de Servidor complicaria a modificação de dados no servidor.

Antes de podermos lançar um conjunto de funcionalidades para o canal Estável, precisamos garantir que elas funcionem de forma coesa e que os desenvolvedores tenham tudo o que precisam para usá-las em produção. Os Canários do React nos permitem desenvolver essas funcionalidades individualmente e lançar as APIs estáveis incrementalmente até que todo o conjunto de funcionalidades esteja completo.

O conjunto atual de funcionalidades no React Canary está completo e pronto para ser lançado.

## A Próxima Versão Principal do React{/*the-next-major-version-of-react*/}

Após alguns anos de iteração,`react@canary`está pronta para ser enviada para`react@latest`. As novas funcionalidades mencionadas acima são compatíveis com qualquer ambiente em que seu aplicativo seja executado, fornecendo tudo o que é necessário para uso em produção. Como o Carregamento de Assets e Metadados de Documento podem ser uma alteração que quebra a compatibilidade para alguns aplicativos, a próxima versão do React será uma versão principal:**React 19**.

Ainda há mais a ser feito para preparar o lançamento. No React 19, também estamos adicionando melhorias muito solicitadas que exigem alterações que quebram a compatibilidade, como suporte para Web Components. Nosso foco agora é incorporar essas alterações, preparar o lançamento, finalizar a documentação para novas funcionalidades e publicar anúncios sobre o que está incluído.

Compartilharemos mais informações sobre tudo o que o React 19 inclui, como adotar as novas funcionalidades do cliente e como criar suporte para Componentes de Servidor React nos próximos meses.

## Offscreen (renomeado para Activity).{/*offscreen-renamed-to-activity*/}

Desde nossa última atualização, renomeamos uma capacidade que estamos pesquisando de "Offscreen" para "Activity". O nome "Offscreen" implicava que ele se aplicava apenas a partes do aplicativo que não eram visíveis, mas ao pesquisar a funcionalidade, percebemos que é possível que partes do aplicativo sejam visíveis e inativas, como conteúdo atrás de um modal. O novo nome reflete mais de perto o comportamento de marcar certas partes do aplicativo como "ativas" ou "inativas".

Activity ainda está em pesquisa e nosso trabalho restante é finalizar os primitivos que são expostos aos desenvolvedores de bibliotecas. Priorizamos essa área enquanto nos concentramos em lançar funcionalidades mais completas.

* * *

Além desta atualização, nossa equipe apresentou em conferências e apareceu em podcasts para falar mais sobre nosso trabalho e responder a perguntas.

- [Sathya Gunasekaran](https://github.com/gsathya)falou sobre o Compilador React na[React India](https://www.youtube.com/watch?v=kjOacmVsLSE)conferência

- [Dan Abramov](/community/team#dan-abramov)deu uma palestra na[RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s)intitulada “React from Another Dimension” que explora uma história alternativa de como os Componentes de Servidor React e Actions poderiam ter sido criados.

- [Dan Abramov](/community/team#dan-abramov)foi entrevistado no podcast[JS Party do Changelog](https://changelog.com/jsparty/311)sobre Componentes de Servidor React

- [Matt Carroll](/community/team#matt-carroll)foi entrevistado no podcast[Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll)onde ele discutiu[The Two Reacts](https://overreacted.io/the-two-reacts/)

Obrigado(a)[Lauren Tan](https://twitter.com/potetotes),[Sophie Alpert](https://twitter.com/sophiebits),[Jason Bonta](https://threads.net/someextent),[Eli White](https://twitter.com/Eli_White), e[Sathya Gunasekaran](https://twitter.com/_gsathya)por revisar este post.

Obrigado(a) por ler, e[vemo-nos na React Conf](https://conf.react.dev/)!