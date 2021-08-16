---
title: "Apresentando o processo React RFC"
author: [acdlite]
---

Estamos adotando um processo de RFC ("request for comments", em português, "Pedido de comentários") para ideias que possam contribuir com o React.

Seguindo o exemplo do [Yarn](https://github.com/yarnpkg/rfcs), [Ember](https://github.com/emberjs/rfcs), e [Rust](https://github.com/rust-lang/rfcs), o objetivo é permitir que membros da equipe principal do React e membros da comunidade possam contribuir no desenvolvimento de novas funcionalidades. Também temos o objetivo de fornecer um caminho claro para a entrada de novas ideias no projeto:

- Crie um documento RFC detalhando seu proposito.
- Submeta uma PR para o [Repositório RFC](https://github.com/reactjs/rfcs).
- Coloque seu feedback na proposta.
- Após a discussão, o time principal pode aceitar ou não o RFC.
- Se o RFC for aceito, a PR é aceita.

Documentos RFCs são aceitos quando eles são aprovados para implementação no React. Uma descrição mais detalhada do processo está disponível no  [README](https://github.com/reactjs/rfcs/blob/master/README.md) do repositório. Os detalhes exatos podem ser melhorados no futuro.

## Quem Pode Submeter RFCs? {#who-can-submit-rfcs}

Qualquer pessoa! Nenhum conhecimento avançado em React é necessário, também não é esperado que você implemente a proposta sozinho.

Como fazemos com nossos outros repositórios, pedimos que você complete um [Contrato de Licença de Contribuidor](https://github.com/reactjs/rfcs#contributor-license-agreement-cla) antes que possamos aceitar sua PR.

## Que tipos de alterações devem ser enviadas como RFCs? {#what-types-of-changes-should-be-submitted-as-rfcs}

Geralmente, qualquer ideia que se beneficiaria de uma revisão ou projeto adicional antes de ser implementada é um bom candidato para uma RFC. Como regra geral, isso significa qualquer proposta que adicione, altere, ou remova uma API do React.

Nem todas as alterações devem passar pelo processo de RFC. Correção de bugs ou melhorias de desempenho que não tocam uma API podem ser enviadas diretamente para a biblioteca principal.

Possuímos diversos repositórios onde você pode enviar contribuições para o React:

- **Erros, Correção de bugs, e alterações de código para a biblioteca principal**: [facebook/react](https://github.com/facebook/react)
- **Site e documentação**: [reactjs/reactjs.org](https://github.com/reactjs/reactjs.org)
- **Ideias para alterações que precisam de revisões adicionais antes de serem implementadas**: [reactjs/rfcs](https://github.com/reactjs/rfcs)

## RFC para uma Nova Context API {#rfc-for-a-new-context-api}

Coincidindo com o lançamento do nosso processo RFC, submetemos uma [proposta para uma nova versão do context](https://github.com/reactjs/rfcs/pull/2). A proposta já recebeu muitos comentários valiosos da comunidade que utilizaremos no projeto da nova API.

A PR do context é um bom exemplo de como uma RFC deve ser estruturada. Estamos ansiosos para começarmos a receber suas propostas!
