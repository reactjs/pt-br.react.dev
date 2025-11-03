---
title: <Profiler>
---

<Intro>

`<Profiler>` possibilita medir o desempenho de renderização de uma árvore React de forma programática.

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

* `id`: Uma string que identifica a parte da UI que você está medindo.
* `onRender`: Um [callback `onRender`](#onrender-callback) que o React chama toda vez que os componentes dentro da árvore são atualizados. Ele recebe informações sobre o que foi renderizado e quanto tempo levou.

#### Ressalvas {/*caveats*/}

<<<<<<< HEAD
* O profiling adiciona uma sobrecarga adicional, então **ele é desativado por padrão na compilação de produção.** Para optar pelo profiling em produção, você precisa habilitar uma [compilação especial de produção com profiling ativado.](https://fb.me/react-profiling)
=======
* Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

---

### `onRender` callback {/*onrender-callback*/}

O React chamará o callback `onRender` com informações sobre o que foi renderizado.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Agregar ou registrar a duração da renderização...
}
```

#### Parâmetros {/*onrender-parameters*/}

* `id`: A string `id` prop da árvore `<Profiler>` que acabou de ser processada. Isso permite identificar qual parte da árvore foi processada, especialmente se você estiver usando vários profilers.
* `phase`: `"mount"`, `"update"` ou `"nested-update"`. Indica se a árvore foi montada pela primeira vez ou renderizada novamente devido a uma mudança em props, estado ou Hooks.
* `actualDuration`: O número de milissegundos gastos renderizando o `<Profiler>` e seus descendentes para a atualização atual. Indica o quão bem a subárvore utiliza a memorização (por exemplo, [`memo`](/reference/react/memo) e [`useMemo`](/reference/react/useMemo)). Idealmente, esse valor deve diminuir significativamente após a montagem inicial, pois muitos dos descendentes só precisarão ser renderizados novamente se suas props específicas mudarem.
* `baseDuration`: O número de milissegundos estimando quanto tempo levaria para renderizar novamente toda a subárvore `<Profiler>` sem otimizações. É calculado somando as durações de renderização mais recentes de cada componente na árvore. Esse valor estima o custo em um cenário de pior caso de renderização (por exemplo, a montagem inicial ou uma árvore sem memorização). Compare `actualDuration` com ele para ver se a memorização está funcionando.
* `startTime`: Um timestamp numérico que indica quando o React começou a renderizar a atualização atual.
* `commitTime`: Um timestamp numérico que indica quando o React finalizou a atualização atual. Esse valor é compartilhado entre todos os profilers em uma atualização, permitindo que eles sejam agrupados, se desejado.

---

## Uso {/*usage*/}

### Medindo o desempenho da renderização de forma programática {/*measuring-rendering-performance-programmatically*/}

Envolva o componente `<Profiler>` em uma árvore React para medir o desempenho de sua renderização.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Para utilizar o `<Profiler>`, é necessário fornecer duas propriedades: um `id` (string) e um callback `onRender` (função). O React chama esse callback sempre que um componente dentro da árvore realiza uma atualização.

<Pitfall>

<<<<<<< HEAD
Profiling adiciona uma sobrecarga adicional, então **ele é desativado por padrão na compilação de produção.** Para optar pelo profiling em produção, você precisa habilitar uma [compilação especial de produção com profiling ativado.](https://fb.me/react-profiling)
=======
Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

</Pitfall>

<Note>

`<Profiler>` permite que você colete medições de forma programática. Se estiver procurando por um profiler interativo, experimente a guia Profiler na [Ferramenta de desenvolvedor do React](/learn/react-developer-tools). Ela expõe funcionalidades semelhantes a uma extensão de navegador.

Components wrapped in `<Profiler>` will also be marked in the [Component tracks](/reference/dev-tools/react-performance-tracks#components) of React Performance tracks even in profiling builds.
In development builds, all components are marked in the Components track regardless of whether they're wrapped in `<Profiler>`.

</Note>

---

### Medindo diferentes partes da aplicação {/*measuring-different-parts-of-the-application*/}

Você pode usar múltiplos componentes `<Profiler>` para analisar distintas partes da sua aplicação:

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

Você também pode aninhar componentes `<Profiler>`:

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

Embora `<Profiler>` seja um componente leve, ele deve ser usado apenas quando necessário. Cada uso adiciona uma sobrecarga de CPU e memória à aplicação.

---

