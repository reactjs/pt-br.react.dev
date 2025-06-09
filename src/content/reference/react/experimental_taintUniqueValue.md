---
title: experimental_taintUniqueValue
version: experimental
---

<Experimental>

**Esta API é experimental e ainda não está disponível em uma versão estável do React.**

Você pode experimentá-la atualizando os pacotes do React para a versão experimental mais recente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

As versões experimentais do React podem conter erros. Não as use na produção.

Esta API só está disponível dentro de [Componentes de Servidor React](/reference/rsc/use-client).

</Experimental>

<Intro>

`taintUniqueValue` permite impedir que valores exclusivos sejam passados para Componentes de Cliente, como senhas, chaves ou tokens.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Para impedir a passagem de um objeto contendo dados sensíveis, consulte [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Chame `taintUniqueValue` com uma senha, token, chave ou hash para registrá-lo com o React como algo que não deve ser permitido passar para o Cliente como está:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Não passe chaves secretas para o cliente.',
  process,
  process.env.SECRET_KEY
);
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `message`: A mensagem que você deseja exibir se `value` for passado para um Componente de Cliente. Esta mensagem será exibida como parte do Erro que será lançado se `value` for passado para um Componente de Cliente.

* `lifetime`: Qualquer objeto que indique por quanto tempo `value` deve ser contaminado. `value` será bloqueado de ser enviado para qualquer Componente de Cliente enquanto este objeto ainda existir. Por exemplo, passar `globalThis` bloqueia o valor durante o tempo de vida de um aplicativo. `lifetime` é tipicamente um objeto cujas propriedades contêm `value`.

* `value`: Uma string, bigint ou TypedArray. `value` deve ser uma sequência exclusiva de caracteres ou bytes com alta entropia, como um token criptográfico, chave privada, hash ou uma senha longa. `value` será bloqueado de ser enviado para qualquer Componente de Cliente.

#### Retorna {/*returns*/}

`experimental_taintUniqueValue` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* Derivar novos valores de valores contaminados pode comprometer a proteção contra contaminação. Novos valores criados por uppercase de valores contaminados, concatenando valores de string contaminados em uma string maior, convertendo valores contaminados para base64, substringando valores contaminados e outras transformações semelhantes não são contaminados, a menos que você explicitamente chame `taintUniqueValue` nesses valores recém-criados.
* Não use `taintUniqueValue` para proteger valores de baixa entropia, como códigos PIN ou números de telefone. Se algum valor em uma solicitação for controlado por um invasor, ele poderá inferir qual valor está contaminado enumerando todos os valores possíveis do segredo.

---

## Uso {/*usage*/}

### Impedir que um token seja passado para Componentes de Cliente {/*prevent-a-token-from-being-passed-to-client-components*/}

Para garantir que informações confidenciais, como senhas, tokens de sessão ou outros valores exclusivos, não sejam passados inadvertidamente para Componentes de Cliente, a função `taintUniqueValue` oferece uma camada de proteção. Quando um valor é contaminado, qualquer tentativa de passá-lo para um Componente de Cliente resultará em um erro.

O argumento `lifetime` define a duração em que o valor permanece contaminado. Para valores que devem permanecer contaminados indefinidamente, objetos como [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) ou `process` podem servir como argumento `lifetime`. Esses objetos têm um tempo de vida que abrange toda a duração da execução do seu aplicativo.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Não passe uma senha de usuário para o cliente.',
  globalThis,
  process.env.SECRET_KEY
);
```

Se o tempo de vida do valor contaminado estiver ligado a um objeto, o `lifetime` deve ser o objeto que encapsula o valor. Isso garante que o valor contaminado permaneça protegido durante a vida útil do objeto encapsulador.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Não passe um token de sessão do usuário para o cliente.',
    user,
    user.session.token
  );
  return user;
}
```

Neste exemplo, o objeto `user` serve como argumento `lifetime`. Se este objeto for armazenado em um cache global ou for acessível por outra requisição, o token da sessão permanecerá contaminado.

<Pitfall>

**Não confie apenas na contaminação para segurança.** Contaminar um valor não bloqueia todos os valores derivados possíveis. Por exemplo, a criação de um novo valor por upper casing de uma string contaminada não contaminará o novo valor.

```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Não passe a senha para o cliente.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` não está contaminado
```

Neste exemplo, a constante `password` está contaminada. Então `password` é usado para criar um novo valor `uppercasePassword` chamando o método `toUpperCase` em `password`. O `uppercasePassword` recém-criado não está contaminado.

Outras formas semelhantes de derivar novos valores de valores contaminados, como concatená-lo em uma string maior, convertê-lo para base64 ou retornar uma substring, criam valores não contaminados.

A contaminação só protege contra erros simples, como passar explicitamente valores secretos para o cliente. Erros na chamada de `taintUniqueValue`, como usar um armazenamento global fora do React, sem o objeto de tempo de vida correspondente, podem fazer com que o valor contaminado se torne não contaminado. A contaminação é uma camada de proteção; um aplicativo seguro terá várias camadas de proteção, APIs bem projetadas e padrões de isolamento.

</Pitfall>

<DeepDive>

#### Usando `server-only` e `taintUniqueValue` para evitar vazamento de segredos {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Se você estiver executando um ambiente de Componentes de Servidor que tenha acesso a chaves privadas ou senhas, como senhas de banco de dados, você deve ter cuidado para não passá-las para um Componente de Cliente.

```js
export async function Dashboard(props) {
  // NÃO FAÇA ISSO
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Este exemplo vazaria o token secreto da API para o cliente. Se este token da API puder ser usado para acessar dados que este usuário em particular não deveria ter acesso, isso poderia levar a uma violação de dados.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

Idealmente, segredos como este são abstraídos em um único arquivo auxiliar que só pode ser importado por utilitários de dados confiáveis no servidor. O auxiliar pode até ser marcado com [`server-only`](https://www.npmjs.com/package/server-only) para garantir que este arquivo não seja importado no cliente.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Às vezes, erros acontecem durante a refatoração e nem todos os seus colegas podem saber sobre isso.
Para se proteger contra a ocorrência desses erros no futuro, podemos "contaminar" a senha real:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Não passe a senha do token da API para o cliente. ' +
    'Em vez disso, faça todas as buscas no servidor.'
  process,
  process.env.API_PASSWORD
);
```

Agora, sempre que alguém tentar passar esta senha para um Componente de Cliente, ou enviar a senha para um Componente de Cliente com uma Função de Servidor, um erro será lançado com a mensagem que você definiu quando chamou `taintUniqueValue`.

</DeepDive>