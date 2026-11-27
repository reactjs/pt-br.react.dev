---
title: cacheSignal
---

<RSC>

`cacheSignal` é atualmente usado apenas com [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cacheSignal` permite que você saiba quando o tempo de vida do `cache()` terminou.

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

Chame `cacheSignal` para obter um `AbortSignal`.

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

Quando o React terminar de renderizar, o `AbortSignal` será abortado. Isso permite que você cancele qualquer trabalho em andamento que não seja mais necessário.
A renderização é considerada concluída quando:
- O React concluiu a renderização com sucesso
- a renderização foi abortada
- a renderização falhou

#### Parâmetros {/*parameters*/}

Esta função não aceita parâmetros.

#### Retorna {/*returns*/}

`cacheSignal` retorna um `AbortSignal` se chamado durante a renderização. Caso contrário, `cacheSignal()` retorna `null`.

#### Ressalvas {/*caveats*/}

- `cacheSignal` é atualmente apenas para uso em [React Server Components](/reference/rsc/server-components). Em Client Components, ele sempre retornará `null`. No futuro, ele também será usado para Client Components quando um cache do cliente for atualizado ou invalidado. Você não deve assumir que ele sempre será nulo no cliente.
- Se chamado fora da renderização, `cacheSignal` retornará `null` para deixar claro que o escopo atual não é cacheado para sempre.

---

## Uso {/*usage*/}

### Cancelar requisições em andamento {/*cancel-in-flight-requests*/}

Chame <CodeStep step={1}>`cacheSignal`</CodeStep> para abortar requisições em andamento.

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
Você não pode usar `cacheSignal` para abortar trabalho assíncrono que foi iniciado fora da renderização, por exemplo:

```js
import {cacheSignal} from 'react';
// 🚩 Armadilha: A requisição não será realmente abortada se a renderização de `Component` for concluída.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### Ignorar erros após o React ter terminado a renderização {/*ignore-errors-after-react-has-finished-rendering*/}

Se uma função lançar um erro, pode ser devido a um cancelamento (por exemplo, a conexão do <CodeStep step={1}>Banco de Dados</CodeStep> foi fechada). Você pode usar a propriedade <CodeStep step={2}>`aborted`</CodeStep> para verificar se o erro foi devido a um cancelamento ou a um erro real. Você pode querer <CodeStep step={3}>ignorar erros</CodeStep> que foram devido a cancelamento.

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // apenas registre se for um erro real e não devido a cancelamento
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>Nenhum dado disponível</div>;
  }
  return <div>{data.name}</div>;
}
```