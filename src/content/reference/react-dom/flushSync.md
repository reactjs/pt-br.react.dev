---
title: flushSync
---

<Pitfall>

Usar `flushSync` é incomum e pode prejudicar a performance do seu app.

</Pitfall>

<Intro>

`flushSync` permite que você force o React a descarregar quaisquer atualizações dentro do callback fornecido de forma síncrona. Isso garante que o DOM seja atualizado imediatamente.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Chame `flushSync` para forçar o React a finalizar qualquer trabalho pendente e atualizar o DOM de forma síncrona.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Na maior parte do tempo, `flushSync` pode ser evitado. Use `flushSync` como último recurso.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `callback`: Uma função. O React chamará imediatamente este callback e descarregará todas as atualizações que ele contém de forma síncrona. Ele também pode descarregar quaisquer atualizações pendentes, ou `Effects`, ou atualizações dentro de `Effects`. Se uma atualização suspender como resultado desta chamada `flushSync`, os fallbacks podem ser exibidos novamente.

#### Retorna {/*returns*/}

`flushSync` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* `flushSync` pode prejudicar significativamente a performance. Use com moderação.
* `flushSync` pode forçar limites pendentes de Suspense a mostrar seu estado de `fallback`.
* `flushSync` pode executar `Effects` pendentes e aplicar de forma síncrona quaisquer atualizações que eles contenham antes de retornar.
* `flushSync` pode descarregar atualizações fora do callback quando necessário para descarregar as atualizações dentro do callback. Por exemplo, se houver atualizações pendentes de um clique, o React pode descarregá-las antes de descarregar as atualizações dentro do callback.

---

## Uso {/*usage*/}

### Descarregando atualizações para integrações de terceiros {/*flushing-updates-for-third-party-integrations*/}

Ao integrar com código de terceiros, como APIs de navegador ou bibliotecas de UI, pode ser necessário forçar o React a finalizar as atualizações. Use `flushSync` para forçar o React a descarregar quaisquer <CodeStep step={1}>atualizações de state</CodeStep> dentro do callback de forma síncrona:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Por esta linha, o DOM é atualizado.
```

Isso garante que, quando a próxima linha de código for executada, o React já tenha atualizado o DOM.

**Usar `flushSync` é incomum, e usá-lo com frequência pode prejudicar significativamente a performance do seu app.** Se o seu app usa apenas as APIs do React, e não se integra com bibliotecas de terceiros, `flushSync` deve ser desnecessário.

No entanto, pode ser útil para integrar com código de terceiros, como APIs de navegador.

Algumas APIs de navegador esperam que os resultados dentro de callbacks sejam escritos para o DOM de forma síncrona, até o final do callback, para que o navegador possa fazer algo com o DOM renderizado. Na maioria dos casos, o React lida com isso automaticamente. Mas em alguns casos pode ser necessário forçar uma atualização síncrona.

Por exemplo, a API `onbeforeprint` do navegador permite que você altere a página imediatamente antes da abertura da caixa de diálogo de impressão. Isso é útil para aplicar estilos de impressão personalizados que permitem que o documento seja exibido melhor para impressão. No exemplo abaixo, você usa `flushSync` dentro do callback `onbeforeprint` para "descarregar" imediatamente o estado do React para o DOM. Então, quando a caixa de diálogo de impressão for aberta, `isPrinting` exibirá "yes":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

Sem `flushSync`, a caixa de diálogo de impressão exibirá `isPrinting` como "no". Isso ocorre porque o React agrupa as atualizações de forma assíncrona e a caixa de diálogo de impressão é exibida antes que o estado seja atualizado.

<Pitfall>

`flushSync` pode prejudicar significativamente a performance e pode forçar inesperadamente limites pendentes de Suspense a mostrar seu estado de fallback.

Na maior parte do tempo, `flushSync` pode ser evitado, então use `flushSync` como último recurso.

</Pitfall>

---

## Solução de Problemas {/*troubleshooting*/}

### Estou recebendo um erro: "flushSync foi chamado de dentro de um método de ciclo de vida" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}

O React não pode executar `flushSync` no meio de uma renderização. Se você fizer isso, ele não fará nada e avisará:

<ConsoleBlock level="error">

Aviso: flushSync foi chamado de dentro de um método de ciclo de vida. O React não pode fazer flush quando já está renderizando. Considere mover esta chamada para uma tarefa do agendador ou micro tarefa.

</ConsoleBlock>

Isso inclui chamar `flushSync` dentro de:

- renderização de um componente.
- hooks `useLayoutEffect` ou `useEffect`.
- métodos de ciclo de vida de componentes de classe.

Por exemplo, chamar `flushSync` em um Effect não fará nada e avisará:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Errado: chamando flushSync dentro de um effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

Para corrigir isso, você geralmente quer mover a chamada `flushSync` para um evento:

```js
function handleClick() {
  // ✅ Correto: flushSync em manipuladores de evento é seguro
  flushSync(() => {
    setSomething(newValue);
  });
}
```

Se for difícil mover para um evento, você pode adiar `flushSync` em uma micro tarefa:

```js {3,7}
useEffect(() => {
  // ✅ Correto: adiar flushSync para uma micro tarefa
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

<<<<<<< HEAD
Isso permitirá que a renderização atual termine e agende outra renderização síncrona para fazer flush das atualizações.
=======
This will allow the current render to finish and schedule another synchronous render to flush the updates.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Pitfall>

`flushSync` pode prejudicar significativamente a performance, mas este padrão específico é ainda pior para a performance. Esgote todas as outras opções antes de chamar `flushSync` em uma micro tarefa como uma saída de emergência.

</Pitfall>
