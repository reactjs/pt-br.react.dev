---
title: <Profiler>
---

<Intro>

`<Profiler>`permite medir o desempenho de renderização de uma árvore React de forma programática.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<Profiler>` {/*profiler*/}

Envolva uma árvore de componentes em um `<Profiler>` para medir seu desempenho de renderização.
```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Uma String que identifica a parte da IU que está sendo medida..
* `onRender`: Um [`onRender` callback](#onrender-callback) O React chama o useEffect toda vez que os componentes dentro da árvore com perfil são atualizados. Ele recebe informações sobre o que foi renderizado e quanto tempo levou.

  
#### Ressalvas {/*caveats*/}
* A criação de perfil adiciona alguma sobrecarga adicional, por isso **é desativada na compilação de produção por padrão**. Para optar pela criação de perfil de produção, é necessário ativar um [Produção especial compilada com ativação de criação de perfis.](https://fb.me/react-profiling)

---

### `onRender` callback {/*onrender-callback*/}

O React irá chamar a função onRender com informações sobre a renderização.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Parâmetros {/*onrender-parameters*/}


* `id`: A string `id` prop da árvore `<Profiler>` que acabou de ser confirmada. Isso permite identificar qual parte da árvore foi confirmada se você estiver utilizando múltiplos profilers.
* `phase`: `"mount"`, `"update"` ou `"nested-update"`. Isso permite que você saiba se a árvore foi montada pela primeira vez ou se foi renderizada novamente devido a uma alteração nos props, state ou hooks.
* `actualDuration`: O número de milissegundos gastos para renderizar o `<Profiler>` e seus descendentes para a atualização atual. Isso indica o quão bem a subárvore faz uso da memoização (e.g. [`memo`](/reference/react/memo) e [`useMemo`](/reference/react/useMemo)). Preferêncialmente, este valor deve diminuir consideravelmente após a montagem inicial, uma vez que muitos dos descendentes só precisarão ser renderizados novamente se seus adereços específicos mudarem.
* `baseDuration`: O número de milissegundos que estima quanto tempo levaria para renderizar novamente toda a subárvore `<Profiler>` sem nenhuma otimização. É calculado pela soma das durações de renderização mais recentes de cada componente da árvore. Este valor estima o pior caso de custo de renderização (por exemplo, a montagem inicial ou uma árvore sem memoização). Compare `actualDuration` com este valor para ver se a memoização está funcionando.
* `startTime`: Um carimbo de data/hora numérico para quando o React começou a renderizar a atualização atual.
* `endTime`: Um carimbo de data e hora numérico que indica quando o React fez o commit da atualização atual. Esse valor é compartilhado entre todos os profilers em um commit, permitindo que eles sejam agrupados, se assim desejado.



---

## Uso {/*usage*/}

### Medindo o desempenho de renderização de forma programática {/*measuring-rendering-performance-programmatically*/}

Envolver o componente `<Profiler>` ao redor de uma árvore React para medir o desempenho de renderização dela.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Ele requer dois props: um `id` (string) e um callback `onRender` (função) que o React chama sempre que um componente dentro da árvore "confirma" uma atualização.

<Pitfall>

A criação de perfil adiciona alguma sobrecarga adicional, por isso **é desativada por padrão na compilação de produção. Para habilitar a criação de perfil na compilação de produção**, é necessário ativar uma [compilação de produção especial com a criação de perfil ativada].(https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` permite reunir medições de forma programática. Se estiver à procura de um profiler interativo, experimente o separador Profiler em [React Developer Tools](/learn/react-developer-tools). Apresenta uma funcionalidade semelhante à de uma extensão do browser.
</Note>

---

### Medição das diferentes partes da aplicação {/*measuring-different-parts-of-the-application*/}

Você pode usar vários componentes `<Profiler>` para medir diferentes partes de sua aplicação:


```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Você também pode aninhar componentes <Profiler>:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Embora o `<Profiler>` seja um componente leve, deve ser usado apenas quando necessário. Cada uso adiciona alguma sobrecarga de CPU e memória a uma aplicação.
---

