---
id: profiler
title: Profiler API
layout: docs
category: Reference
permalink: docs/profiler.html
---

O componente `Profiler` mede a frequência de renderização de uma aplicação React e o "custo" dessa renderização.
Seu objetivo  é ajudar a identificar partes de aplicação que são lentas e podem se beneficiar de [otimizações como a memorização](/docs/hooks-faq.html#how-to-memoize-calculations)

> Nota:
>
> O uso do `Profiler` adiciona uma sobrecarga de processamento, sendo portanto **desabilitada no [_build_ de produção](/docs/optimizing-performance.html#use-the-production-build)**.
> 
> Ao optar pelo uso do `Profiler` em produção, o React provisiona um _build_ especial de produção com o `Profiler` habilitado.
> Leia mais sobre como utilizar esse _build_ em [fb.me/react-profiling](https://fb.me/react-profiling)

## Utilização {#usage}

O `Profiler` pode ser adicionado em qualquer lugar dentro da árvore de React para mensurar o custo de renderização dessa parte da árvore.
Ele exige duas _props_: um `id` (formato _string_) e uma função de callback `onRender`, o qual o react executa no momento em que a árvore "envia" uma atualização.

Por exemplo, para executar um _profile_ em um componente de `Navigation` e seus descendentes:

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

Múltiplos componentes `Profiler` podem ser utilizados para mensurar diferentes partes de uma aplicação:
```js{3,6:
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

Componentes `Profiler` também podem estar aninhados para mensurar diferentes componentes em uma mesma subárvore:
```js{2,6,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> Nota
>
> Apesar do `Profiler` ser um componente leve, deve ser usado apenas quando necessário; cada uso traz uma carga adicional de CPU e memória para uma aplicação.

## _Callback_ `onRender` {#onrender-callback}

O `Profiler` requer uma função `onRender` como _prop_.
O React chama essa função em todo momento que o a árvore dentro dele "envia" uma atualização.
Ela recebe parâmetros descrevendo o que foi renderizado e quanto tempo levou.

```js
function onRenderCallback(
  id, // o prop "id" da árvore Profiler que acabou de atualizar 
  phase, //  "mount" (se a árvore acabou de ser montada) ou "update" (se foi renderizada novamente)
  actualDuration, // tempo gasto renderizando a atualização enviada
  baseDuration, // tempo estimado para renderizar totalmente a subárvore sem memorização
  startTime, // quando o React começou renderizar essa atualização
  commitTime, // quando o React enviou essa atualização
  interactions // um Set de interações pertencentes â essa atualização
) {
  // Agregue ou registre os tempos de renderização..
}
```

Vamos ver no detalhe cada uma dessas _props_:

* **`id: string`** - 
O `id` da árvore Profiler que acabou de atualizar.
Isso pode ser utilizado para identificar qual parte da árvore foi atualizada se você está utilizando múltiplos componentes `Profiler`.
* **`phase: "mount" | "update"`** -
Identifica se a árvore que foi montada pela primeira vez ou renderizada novamente por uma mudança na _props_, no estado ou por _hooks_.
* **`actualDuration: number`** -
Tempo desprendido renderizańdo o `Profiler` e seus descententes para a atualização corrente. 
Isso indica o quão bem essa subárvore faz o uso da memorização (e.g. [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
Idealmente esse valor deve diminuir significativamente depois da montagem inicial visto que os descendentes só precisarão renderizar novamente se as suas _props_ específicas forem alteradas.
* **`baseDuration: number`** -
A duração da renderização mais recente para cada componente individual dentro da árvore `Profiler`.
Esse valor estima um pior cenário de renderização (por exemplo, a montagem inicial de uma árvore sem memorização).
* **`startTime: number`** -
_Timestamp_ de quando o React começou a renderizar a atualização corrente.
* **`commitTime: number`** -
_Timestamp_ de quando o React enviou a atualização corrente.
Esse valor é compartilhado entre todos os componentes `Profiler` em um envio, permitindo o agrupamento deles se desejável.
* **`interactions: Set`** -
_Set_ de ["interações"](https://fb.me/react-interaction-tracing) que estavam sendo rastreadas quando a atualização foi agendada (por exemplo, quando um `render` ou `setState` foi invocado).

> Nota
>
> Interações podem ser usadas para identificar a causa de uma atualização, apesar da API para rastreá-las ainda ser experimental.
>
> Aprenda mais sobre em [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing)
