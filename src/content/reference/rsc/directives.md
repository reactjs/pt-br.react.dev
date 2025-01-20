---
title: "Diretivas"
canary: true
---

<Canary>

Essas diretivas são necessárias apenas se você estiver [usando Componentes do Servidor do React](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou construindo uma biblioteca compatível com eles.

</Canary>

<Intro>

As diretivas fornecem instruções para [bundlers compatíveis com Componentes do Servidor do React](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</Intro>

---

## Diretivas de código-fonte {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) permite que você marque qual código é executado no cliente.
* [`'use server'`](/reference/rsc/use-server) marca funções do lado do servidor que podem ser chamadas a partir do código do lado do cliente.