---
title: "React Labs: O que Estamos Trabalhando – Fevereiro de 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, e Dan Abramov
date: 2024/02/15
description: Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos progresso significativo desde nossa última atualização e gostaríamos de compartilhar nosso progresso.
---

15 de fevereiro de 2024 por [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), e [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos progresso significativo desde nossa [última atualização](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) e gostaríamos de compartilhar nosso progresso.

</Intro>

<Note>

O React Conf 2024 está agendado para os dias 15–16 de maio em Henderson, Nevada! Se você estiver interessado em participar do React Conf pessoalmente, você pode [se inscrever para a loteria de ingressos](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) até 28 de fevereiro. 

Para mais informações sobre ingressos, streaming gratuito, patrocínios e mais, consulte [o site do React Conf](https://conf.react.dev).

</Note>

---

## React Compiler {/*react-compiler*/}

O React Compiler não é mais um projeto de pesquisa: o compilador agora alimenta instagram.com em produção, e estamos trabalhando para implementar o compilador em superfícies adicionais no Meta e preparar o primeiro lançamento de código aberto.

Como discutido em nosso [post anterior](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), o React *às vezes* pode re-renderizar demais quando o estado muda. Desde os primeiros dias do React, nossa solução para tais casos tem sido a memoização manual. Em nossas APIs atuais, isso significa aplicar as APIs [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) para ajustar manualmente quanto o React re-renderiza nas mudanças de estado. Mas a memoização manual é um compromisso. Ela bagunça nosso código, é fácil de errar e requer trabalho extra para manter atualizada.

A memoização manual é um compromisso razoável, mas não estávamos satisfeitos. Nossa visão é que o React re-renderize *automaticamente* apenas as partes certas da UI quando o estado muda, *sem comprometer o modelo mental central do React*. Acreditamos que a abordagem do React — UI como uma função simples do estado, com valores e expressões JavaScript padrão — é uma parte chave do motivo pelo qual o React tem sido acessível para tantos desenvolvedores. É por isso que investimos na construção de um compilador otimizador para o React.

JavaScript é uma linguagem notoriamente desafiadora para otimizar, graças às suas regras frágeis e natureza dinâmica. O React Compiler é capaz de compilar código de forma segura modelando tanto as regras do JavaScript *quanto* as “regras do React”. Por exemplo, componentes React devem ser idempotentes — retornando o mesmo valor dados os mesmos inputs — e não podem mutar props ou valores de estado. Essas regras limitam o que os desenvolvedores podem fazer e ajudam a criar um espaço seguro para o compilador otimizar.

É claro que