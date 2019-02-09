---
id: error-decoder
title: Decodificador de Erros
permalink: docs/error-decoder.html
---

Para reduzir o número de bytes enviados pela rede, nós evitamos enviar mensagens de erro completas na build minificada para produção do React.

Recomendamos fortemente a utilização local da build de desenvolvimento para depurar seu aplicativo, uma vez que ela monitora informações
adicionais de depuração e disponibiliza avisos úteis sobre potenciais problemas nos seus aplicativos. No entanto, caso se depare com uma exceção
na build de produção, essa página irá remontar o texto original do erro.