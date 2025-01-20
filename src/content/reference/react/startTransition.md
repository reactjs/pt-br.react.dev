---
title: startTransition
---

<Intro>

`startTransition` permite que você atue no estado sem bloquear a UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

A função `startTransition` permite que você marque uma atualização de estado como uma Transição.

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

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `scope`: Uma função que atualiza algum estado chamando uma ou mais [`funções set.`](/reference/react/useState#setstate) O React chama imediatamente `scope` sem argumentos e marca todas as atualizações de estado agendadas de forma síncrona durante a chamada da função `scope` como Transições. Elas serão [não-bloqueantes](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) e [não exibirão indicadores de carregamento indesejados.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Retorna {/*returns*/}

`startTransition` não retorna nada.

#### Ressalvas {/*caveats*/}

* `startTransition` não fornece uma maneira de rastrear se uma Transição está pendente. Para mostrar um indicador de pendência enquanto a Transição está em andamento, você precisa de [`useTransition`](/reference/react/useTransition) em vez disso.

* Você pode encapsular uma atualização em uma Transição apenas se tiver acesso à função `set` desse estado. Se você quiser iniciar uma Transição em resposta a alguma prop ou valor de retorno de um Hook personalizado, tente [`useDeferredValue`](/reference/react/useDeferredValue) em vez disso.

* A função que você passa para `startTransition` deve ser síncrona. O React executa imediatamente essa função, marcando todas as atualizações de estado que ocorrem enquanto ela é executada como Transições. Se você tentar realizar mais atualizações de estado posteriormente (por exemplo, em um timeout), elas não serão marcadas como Transições.

* Uma atualização de estado marcada como uma Transição será interrompida por outras atualizações de estado. Por exemplo, se você atualizar um componente de gráfico dentro de uma Transição, mas então começar a digitar em um input enquanto o gráfico está no meio de uma re-renderização, o React reiniciará o trabalho de renderização no componente gráfico após lidar com a atualização de estado do input.

* Atualizações de Transição não podem ser usadas para controlar inputs de texto.

* Se houver várias Transições em andamento, o React atualmente as agrupa. Esta é uma limitação que provavelmente será removida em uma versão futura.

---

## Uso {/*usage*/}

### Marcando uma atualização de estado como uma Transição não-bloqueante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Você pode marcar uma atualização de estado como uma *Transição* envolvendo-a em uma chamada `startTransition`:

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

Transições permitem que você mantenha as atualizações da interface do usuário responsivas mesmo em dispositivos lentos.

Com uma Transição, sua UI permanece responsiva no meio de uma re-renderização. Por exemplo, se o usuário clicar em uma aba, mas depois mudar de ideia e clicar em outra aba, ele pode fazer isso sem esperar que a primeira re-renderização termine.

<Note>

`startTransition` é muito semelhante ao [`useTransition`](/reference/react/useTransition), exceto que não fornece a flag `isPending` para rastrear se uma Transição está em andamento. Você pode chamar `startTransition` quando `useTransition` não está disponível. Por exemplo, `startTransition` funciona fora de componentes, como de uma biblioteca de dados.

[Saiba mais sobre Transições e veja exemplos na página `useTransition`](/reference/react/useTransition)

</Note>