---
título: startTransition
---

<Intro>

 `startTransition` permite que você atualize o estado sem bloquear a interface do usuário.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

A função startTransition permite que você marque uma atualização de state como uma transição.

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

[Ver mais exemplos abaixo](#uso)

#### Parâmetros {/*parameters*/}

* `scope`: Uma função que atualiza algum estado chamando uma ou mais funções [`set`](/reference/react/useState#setstate) O React imediatamente chama `scope` sem parâmetros e marca todas as atualizações de state agendadas sincronizadamente durante a chamada da função `scope` como transições. Elas serão [sem bloqueio](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) e [não exibirão indicadores de carregamento indesejados](/reference/react/useTransition#preventing-unwanted-loading-indicators)
#### Retornos {/*returns*/}

`startTransition` não retorna nada.

#### Ressalvas {/*caveats*/}

* O `startTransition` não fornece uma forma de verificar se uma transição está pendente. Para mostrar um indicador pendente enquanto a transição está em curso, é necessário [`useTransition`](/reference/react/useTransition) instead.

Você só pode envolver uma atualização em uma transição se tiver acesso à função `set` desse estado. Se desejar iniciar uma transição em resposta a alguma propriedade ou a um valor de retorno personalizado do Hook, tente [`useDeferredValue`](/reference/react/useDeferredValue) .

* A função que você passa para `startTransition` deve ser síncrona. O React executa imediatamente essa função, marcando todas as atualizações de state que acontecem enquanto ela é executada como transições. Se você tentar executar mais atualizações de state depois (por exemplo, em um timeout), elas não serão marcadas como transições.

* Uma atualização de estado marcada como uma transição será interrompida por outras atualizações de estado. Por exemplo, se você atualizar um componente de gráfico dentro de uma transição, mas depois começar a digitar em uma entrada enquanto o gráfico estiver no meio de uma nova renderização, o React reiniciará o trabalho de renderização no componente de gráfico depois de lidar com a atualização do estado da entrada.

* Transition updates can't be used to control text inputs.

* If there are multiple ongoing transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.

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

As transições permitem manter a responsividade das atualizações da interface do usuário, mesmo em dispositivos lentos.

Com uma transição, a sua IU permanece responsiva durante uma nova apresentação. Por exemplo, se o usuário clicar em uma aba e depois mudar de ideia e clicar em outra, ele pode fazer isso sem esperar que a primeira nova apresentação termine.

<Note>

`startTransition` é muito semelhante à [`useTransition`](/reference/react/useTransition), exceto que não fornece a flag `isPending` para rastrear se uma transição está em andamento. Você pode chamar `startTransition` quando `useTransition` não está disponível. Por exemplo, `startTransition` funciona com componentes externos, por exemplo, a partir de uma biblioteca de dados.

[Saiba mais sobre as transições e veja exemplos na `useTransition` page.](/reference/react/useTransition)

</Note>
