---
title: startTransition
---

<Intro>

`startTransition` permite que você renderize uma parte da UI em background.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

A função `startTransition` permite que você marque uma atualização de estado como uma Transition.

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

* `action`: Uma função que atualiza algum `state` chamando uma ou mais funções [`set`](/reference/react/useState#setstate). React chama `action` imediatamente sem parâmetros e marca todas as atualizações de `state` agendadas de forma síncrona durante a chamada da função `action` como Transitions. Quaisquer chamadas assíncronas aguardadas no `action` serão incluídas na transition, mas atualmente requerem encapsular quaisquer funções `set` após o `await` em um `startTransition` adicional (veja [Solução de problemas](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Atualizações de `state` marcadas como Transitions serão [não bloqueantes](#marking-a-state-update-as-a-non-blocking-transition) e [não exibirão indicadores de carregamento indesejados.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Retorna {/*returns*/}

`startTransition` não retorna nada.

#### Ressalvas {/*caveats*/}

* `startTransition` não fornece uma maneira de rastrear se uma Transition está pendente. Para mostrar um indicador pendente enquanto a Transition está em andamento, você precisa de [`useTransition`](/reference/react/useTransition) em vez disso.

* Você pode encapsular uma atualização em uma Transition somente se tiver acesso à função `set` desse `state`. Se você deseja iniciar uma Transition em resposta a alguma `prop` ou um valor de retorno de um Hook customizado, tente [`useDeferredValue`](/reference/react/useDeferredValue) em vez disso.

* A função que você passa para `startTransition` é chamada imediatamente, marcando todas as atualizações de `state` que acontecem enquanto ela é executada como Transitions. Se você tentar executar atualizações de `state` em um `setTimeout`, por exemplo, elas não serão marcadas como Transitions.

* Você deve encapsular quaisquer atualizações de `state` após quaisquer solicitações assíncronas em outro `startTransition` para marcá-las como Transitions. Esta é uma limitação conhecida que corrigiremos no futuro (veja [Solução de problemas](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Uma atualização de `state` marcada como uma Transition será interrompida por outras atualizações de `state`. Por exemplo, se você atualizar um componente de gráfico dentro de uma Transition, mas depois começar a digitar em uma entrada enquanto o gráfico está no meio de uma re-renderização, React reiniciará o trabalho de renderização no componente de gráfico após manipular a atualização de `state` da entrada.

* Atualizações de Transition não podem ser usadas para controlar entradas de texto.

* Se houver várias Transitions em andamento, React atualmente as agrupa. Esta é uma limitação que pode ser removida em uma versão futura.

---

## Uso {/*usage*/}

### Marcando uma atualização de `state` como uma Transition não bloqueante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Você pode marcar uma atualização de `state` como uma *Transition* encapsulando-a em uma chamada `startTransition`:

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

Transitions permitem que você mantenha as atualizações da interface do usuário responsivas, mesmo em dispositivos lentos.

Com uma Transition, sua UI permanece responsiva no meio de uma re-renderização. Por exemplo, se o usuário clicar em uma aba, mas depois mudar de ideia e clicar em outra aba, ele pode fazê-lo sem esperar que a primeira re-renderização termine.

<Note>

`startTransition` é muito semelhante ao [`useTransition`](/reference/react/useTransition), exceto que não fornece a flag `isPending` para rastrear se uma Transition está em andamento. Você pode chamar `startTransition` quando `useTransition` não estiver disponível. Por exemplo, `startTransition` funciona fora dos componentes, como de uma biblioteca de dados.

[Saiba mais sobre Transitions e veja exemplos na página `useTransition`.](/reference/react/useTransition)

</Note>