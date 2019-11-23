---
title: "Descontinuando o Suporte ao IE 8 no React DOM"
author: [sophiebits]
---

Desde seu lançamento em 2013, o React oferece suporte a todos os navegadores populares, incluindo o Internet Explorer 8 e superior. Lidamos com a normalização de muitas peculiaridades presentes nas versões antigas do navegador, incluindo diferenças no sistema de eventos, para que o código do seu aplicativo não precise se preocupar com a maioria dos erros do navegador.

Hoje, a Microsoft [interrompeu o suporte para versões mais antigas do IE](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support). A partir do React v15, descontinuamos o suporte do React DOM's para o IE 8. Ouvimos dizer que a maioria dos aplicativos React DOM já não suporta versões antigas do Internet Explorer, portanto, isso não deve afetar muitas pessoas. Essa alteração nos ajudará a desenvolver mais rapidamente e tornar o React DOM ainda melhor. (Ainda não removeremos ativamente o código relacionado ao IE 8, mas nós iremos despriorizar novos bugs que sejam relatados. Se você precisar dar suporte ao IE 8 recomendamos que você permaneça no React v0.14.)

O React DOM continuará a oferecer suporte ao IE 9 e superior no futuro próximo.
