---
title: experimental_taintObjectReference
---

<Wip>

**Esta API é experimental e ainda não está disponível em uma versão estável do React.**

Você pode experimentá-la atualizando os pacotes do React para a versão experimental mais recente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versões experimentais do React podem conter erros. Não as utilize em produção.

Esta API está disponível apenas dentro dos Componentes do Servidor do React.

</Wip>


<Intro>

`taintObjectReference` permite que você impeça uma instância específica de objeto de ser passada para um Componente do Cliente, como um objeto `user`.

```js
experimental_taintObjectReference(message, object);
```

Para impedir a passagem de uma chave, hash ou token, veja [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Chame `taintObjectReference` com um objeto para registrá-lo no React como algo que não deve ser permitido ser passado para o Cliente como está:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Não passe TODAS as variáveis de ambiente para o cliente.',
  process.env
);
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `message`: A mensagem que você deseja exibir se o objeto for passado para um Componente do Cliente. Essa mensagem será exibida como parte do Erro que será lançado se o objeto for passado para um Componente do Cliente.

* `object`: O objeto a ser contaminado. Funções e instâncias de classe podem ser passadas para `taintObjectReference` como `object`. Funções e classes já estão bloqueadas de serem passadas para Componentes do Cliente, mas a mensagem de erro padrão do React será substituída pelo que você definiu em `message`. Quando uma instância específica de um Array Tipado é passada para `taintObjectReference` como `object`, quaisquer outras cópias do Array Tipado não serão contaminadas.

#### Retorna {/*returns*/}

`experimental_taintObjectReference` retorna `undefined`.

#### Ressalvas {/*caveats*/}

- Recriar ou clonar um objeto contaminado cria um novo objeto não contaminado que pode conter dados sensíveis. Por exemplo, se você tiver um objeto `user` contaminado, `const userInfo = {name: user.name, ssn: user.ssn}` ou `{...user}` criarão novos objetos que não são contaminados. `taintObjectReference` apenas protege contra erros simples quando o objeto é passado para um Componente do Cliente sem alterações.

<Pitfall>

**Não confie apenas na contaminação para segurança.** Contaminar um objeto não impede o vazamento de todos os possíveis valores derivados. Por exemplo, o clone de um objeto contaminado criará um novo objeto não contaminado. Usar dados de um objeto contaminado (por exemplo, `{secret: taintedObj.secret}`) criará um novo valor ou objeto que não é contaminado. Contaminação é uma camada de proteção; um aplicativo seguro terá múltiplas camadas de proteção, APIs bem projetadas e padrões de isolamento.

</Pitfall>

---

## Uso {/*usage*/}

### Impedir que dados de usuário alcancem o cliente inadvertidamente {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Um Componente do Cliente nunca deve aceitar objetos que carreguem dados sensíveis. Idealmente, as funções de busca de dados não devem expor dados aos quais o usuário atual não deve ter acesso. Às vezes, erros acontecem durante a refatoração. Para proteger contra esses erros que possam ocorrer no futuro, podemos "contaminar" o objeto de usuário em nossa API de dados.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Não passe o objeto completo de usuário para o cliente. ' +
      'Em vez disso, escolha as propriedades específicas que você precisa para este caso de uso.',
    user,
  );
  return user;
}
```

Agora, sempre que alguém tentar passar este objeto para um Componente do Cliente, um erro será lançado com a mensagem de erro passada em vez.

<DeepDive>

#### Protegendo contra vazamentos na busca de dados {/*protecting-against-leaks-in-data-fetching*/}

Se você está executando um ambiente de Componentes do Servidor que tem acesso a dados sensíveis, deve ter cuidado para não passar objetos diretamente:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // NÃO FAÇA ISSO
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Idealmente, o `getUser` não deve expor dados aos quais o usuário atual não deve ter acesso. Para impedir o passagem do objeto `user` para um Componente do Cliente no futuro, podemos "contaminar" o objeto de usuário:

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Não passe o objeto completo de usuário para o cliente. ' +
      'Em vez disso, escolha as propriedades específicas que você precisa para este caso de uso.',
    user,
  );
  return user;
}
```

Agora, se alguém tentar passar o objeto `user` para um Componente do Cliente, um erro será lançado com a mensagem de erro passada.

</DeepDive>