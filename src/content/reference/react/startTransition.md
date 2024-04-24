---
título: startTransition
---

<Intro>

 `startTransition` permite que você atualize o state sem bloquear a UI

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

A função `startTransition` permite que você marque uma atualização de state como uma transição.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Veja mais exemplos abaixo](#usage)

#### Parâmetros {/*parameters*/}

* `scope`: É uma função que atualiza algum estado chamando uma ou mais [`set` functions.](/reference/react/useState#setstate) O React imediatamente chama `scope` sem parâmetros e marca todas as atualizações de state agendadas sincronizadamente durante a chamada da função `scope` como transições. Elas serão [sem bloqueio](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) e [não exibirão indicadores de carregamento indesejados](/reference/react/useTransition#preventing-unwanted-loading-indicators)

  #### Retornos {/*returns*/}

`startTransition` não retorna nada.

#### Ressalvas {/*caveats*/}

* O `startTransition` não fornece uma forma de verificar se uma transição está pendente. Para mostrar um indicador pendente enquanto a transição está em curso, é necessário usar [`useTransition`](/reference/react/useTransition).

Só é possivel envolver uma atualização em uma transição se você tiver acesso à função `set` desse state. Se desejar iniciar uma transição em resposta a alguma prop ou a um valor de retorno de Hook personalizado, tente [`useDeferredValue`](/reference/react/useDeferredValue) .

* A função que você passa para `startTransition` deve ser síncrona. O React executa imediatamente essa função, marcando todas as atualizações de state que acontecem enquanto ela é executada como transições. Se você tentar executar mais atualizações de state depois (por exemplo, em um timeout), elas não serão marcadas como transições.

* Uma atualização de state marcada como uma transição será interrompida por outras atualizações de state. Por exemplo, se você atualizar um componente de gráfico dentro de uma transição, mas depois começar a digitar em uma entrada enquanto o gráfico estiver no meio de uma nova renderização, o React reiniciará o trabalho de renderização no componente de gráfico depois de lidar com a atualização de state da entrada.

* As atualizações de transição não podem ser utilizadas para controlar entradas de texto.

* Se houver várias transições em andamento, o React atualmente as agrupa em lotes. Essa limitação provavelmente será removida em uma versão futura.

---

## Uso {/*usage*/}

### Marcação de uma atualização de state como uma transição sem bloqueio {/*marking-a-state-update-as-a-non-blocking-transition*/}

É possível marcar uma atualização de state como uma transição envolvendo-a em uma chamada `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

As transições ajudam a manter a interface do usuário responsiva, mesmo em dispositivos mais lentos.

Com uma transição, a sua UI permanece responsiva durante uma nova renderização. Por exemplo, se o usuário clicar em uma guia e depois mudar de ideia e clicar em outra, ele poderá fazê-lo sem precisar esperar que a primeira nova renderização termine.

<Note>

`startTransition` é muito semelhante à [`useTransition`](/reference/react/useTransition), exceto que não fornece a flag `isPending` para monitorar se uma transição está em andamento. Você pode chamar `startTransition` quando `useTransition` não está disponível. Por exemplo, `startTransition` funciona com componentes externos, como por exemplo, a partir de uma biblioteca de dados.

[Saiba mais sobre as transições e veja exemplos na `useTransition` page.](/reference/react/useTransition)

</Note>
