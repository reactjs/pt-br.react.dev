---
title: "Apresentando o Sistema de Código de Erro do React"
author: [keyanzhang]
---

Construir uma melhor experiência para o desenvolvedor tem sido uma das coisas com as quais o React se preocupa profundamente, e uma parte crucial é detectar possíveis erros antipadrões em potencial e fornecer mensagens de erro úteis quando as coisas (podem) derem errado. No entanto, a maioria deles existem apenas no modo de desenvolvimento; na produção, evitamos ter afirmações extremamente custosas e enviar mensagens de erro completas para reduzir o número de bytes enviados pela conexão.

Antes desta versão, removemos as mensagens de erro no momento da construção e é por isso que você pode ter visto essa mensagem em produção:

> Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.

Para facilitar o debug em produção, estamos introduzindo um Sistema de Código de Erro no [15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0). Nós desenvolvemos um [gulp script](https://github.com/facebook/react/blob/master/scripts/error-codes/gulp-extract-errors.js) que coleta todas as nossas mensagens de erro `invariantes` e as põem em um [arquivo JSON](https://github.com/facebook/react/blob/master/scripts/error-codes/codes.json), e em tempo de execução, o Babel usa o JSON para [reescrever](https://github.com/facebook/react/blob/master/scripts/error-codes/replace-invariant-error-codes.js) nossas chamadas `invariantes` em produção para referenciar os IDs de erro correspondentes. Agora, quando as coisas derem errado na produção, o erro que o React exibe contém um URL com um ID de erro e informações relevantes. O URL direcionará você para uma página em nossa documentação em que a mensagem de erro original é remontada.

Embora esperemos que você não veja erros com frequência, você pode ver como isso funciona [aqui](/docs/error-decoder.html?invariant=109&args[]=Foo). É assim que será o mesmo erro que exibimos acima na introdução:

> Minified React error #109; visit [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

Fazemos isso para que a experiência do desenvolvedor seja a melhor possível, enquanto também mantém o tamanho do bundle de produção o menor possível.  Esse recurso não deve exigir alterações do seu lado — use os arquivos `min.js` em produção ou agrupe o código do aplicativo com `process.env.NODE_ENV === 'production'` e você deve estar pronto!
