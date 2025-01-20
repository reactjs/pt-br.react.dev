---
title: flushSync
---

<Pitfall>

Usar `flushSync` é incomum e pode prejudicar o desempenho do seu aplicativo.

</Pitfall>

<Intro>

`flushSync` permite que você force o React a processar qualquer atualização dentro do callback fornecido de forma síncrona. Isso garante que o DOM seja atualizado imediatamente.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Chame `flushSync` para forçar o React a processar qualquer trabalho pendente e atualizar o DOM de forma síncrona.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Na maioria das vezes, `flushSync` pode ser evitado. Use `flushSync` como última alternativa.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `callback`: Uma função. O React chamará imediatamente esse callback e processará qualquer atualização que ele contenha de forma síncrona. Ele também pode processar quaisquer atualizações pendentes, ou Efeitos, ou atualizações dentro dos Efeitos. Se uma atualização suspender como resultado dessa chamada de `flushSync`, os fallbacks podem ser reexibidos.

#### Retorna {/*returns*/}

`flushSync` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* `flushSync` pode prejudicar significativamente o desempenho. Use com moderação.
* `flushSync` pode forçar limites de Suspense pendentes a mostrar seu estado de `fallback`.
* `flushSync` pode executar Efeitos pendentes e aplicar de forma síncrona quaisquer atualizações que eles contenham antes de retornar.
* `flushSync` pode processar atualizações fora do callback, quando necessário, para processar as atualizações dentro do callback. Por exemplo, se houver atualizações pendentes de um clique, o React pode processá-las antes de processar as atualizações dentro do callback.

---

## Uso {/*usage*/}

### Processando atualizações para integrações de terceiros {/*flushing-updates-for-third-party-integrations*/}

Ao integrar com código de terceiros, como APIs de navegador ou bibliotecas de interface do usuário, pode ser necessário forçar o React a processar atualizações. Use `flushSync` para forçar o React a processar quaisquer <CodeStep step={1}>atualizações de estado</CodeStep> dentro do callback de forma síncrona:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Até esta linha, o DOM é atualizado.
```

Isso garante que, quando a próxima linha de código for executada, o React já tenha atualizado o DOM.

**Usar `flushSync` é incomum, e usá-lo com frequência pode prejudicar significativamente o desempenho do seu aplicativo.** Se seu aplicativo usa apenas APIs do React e não integra com bibliotecas de terceiros, `flushSync` deve ser desnecessário.

No entanto, pode ser útil para integrar com código de terceiros, como APIs de navegador.

Algumas APIs de navegador esperam que os resultados dentro dos callbacks sejam escritos no DOM de forma síncrona, até o final do callback, para que o navegador possa fazer algo com o DOM renderizado. Na maioria dos casos, o React cuida disso para você automaticamente. Mas em alguns casos pode ser necessário forçar uma atualização síncrona.

Por exemplo, a API `onbeforeprint` do navegador permite que você mude a página imediatamente antes que o diálogo de impressão seja aberto. Isso é útil para aplicar estilos de impressão personalizados que permitem que o documento seja exibido melhor para impressão. No exemplo abaixo, você usa `flushSync` dentro do callback `onbeforeprint` para imediatamente "processar" o estado do React no DOM. Então, quando o diálogo de impressão abre, `isPrinting` exibe "yes":

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
        Imprimir
      </button>
    </>
  );
}
```

</Sandpack>

Sem `flushSync`, o diálogo de impressão exibirá `isPrinting` como "no". Isso acontece porque o React agrupa as atualizações de forma assíncrona e o diálogo de impressão é exibido antes que o estado seja atualizado.

<Pitfall>

`flushSync` pode prejudicar significativamente o desempenho e pode forçar inesperadamente limites de Suspense pendentes a mostrar seu estado de fallback.

Na maioria das vezes, `flushSync` pode ser evitado, portanto, use `flushSync` como última alternativa.

</Pitfall>