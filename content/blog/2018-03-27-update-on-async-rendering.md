---
title: Atualização em Renderização Assíncrona
author: [bvaughn]
---

For over a year, the React team has been working to implement asynchronous rendering. Last month during his talk at JSConf Iceland, [Dan unveiled some of the exciting new possibilities async rendering unlocks](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Now we'd like to share with you some of the lessons we've learned while working on these features, and some recipes to help prepare your components for async rendering when it launches.

One of the biggest lessons we've learned is that some of our legacy component lifecycles tend to encourage unsafe coding practices. They are:

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

These lifecycle methods have often been misunderstood and subtly misused; furthermore, we anticipate that their potential misuse may be more problematic with async rendering. Because of this, we will be adding an "UNSAFE_" prefix to these lifecycles in an upcoming release. (Here, "unsafe" refers not to security but instead conveys that code using these lifecycles will be more likely to have bugs in future versions of React, especially once async rendering is enabled.)

## Gradual Migration Path {#gradual-migration-path}

[React follows semantic versioning](/blog/2016/02/19/new-versioning-scheme.html), so this change will be gradual. Our current plan is:

* **16.3**: Introduce aliases for the unsafe lifecycles, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **A future 16.x release**: Enable deprecation warning for `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release, but the old names will log a DEV-mode warning.)
* **17.0**: Remove `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` . (Only the new "UNSAFE_" lifecycle names will work from this point forward.)

**Note that if you're a React application developer, you don't have to do anything about the legacy methods yet. The primary purpose of the upcoming version 16.3 release is to enable open source project maintainers to update their libraries in advance of any deprecation warnings. Those warnings will not be enabled until a future 16.x release.**

We maintain over 50,000 React components at Facebook, and we don't plan to rewrite them all immediately. We understand that migrations take time. We will take the gradual migration path along with everyone in the React community.

---

## Migrating from Legacy Lifecycles {#migrating-from-legacy-lifecycles}

If you'd like to start using the new component APIs introduced in React 16.3 (or if you're a maintainer looking to update your library in advance) here are a few examples that we hope will help you to start thinking about components a bit differently. Over time, we plan to add additional "recipes" to our documentation that show how to perform common tasks in a way that avoids the problematic lifecycles.

Before we begin, here's a quick overview of the lifecycle changes planned for version 16.3:
* We are **adding the following lifecycle aliases**: `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will be supported.)
* We are **introducing two new lifecycles**, static `getDerivedStateFromProps` and `getSnapshotBeforeUpdate`.

### New lifecycle: `getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

The new static `getDerivedStateFromProps` lifecycle is invoked after a component is instantiated as well as before it is re-rendered. It can return an object to update `state`, or `null` to indicate that the new `props` do not require any `state` updates.

Together with `componentDidUpdate`, this new lifecycle should cover all use cases for the legacy `componentWillReceiveProps`.

>Note:
>
>Both the older `componentWillReceiveProps` and the new `getDerivedStateFromProps` methods add significant complexity to components. This often leads to [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Consider **[simpler alternatives to derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** to make components predictable and maintainable.

### New lifecycle: `getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

The new `getSnapshotBeforeUpdate` lifecycle is called right before mutations are made (e.g. before the DOM is updated). The return value for this lifecycle will be passed as the third parameter to `componentDidUpdate`. (This lifecycle isn't often needed, but can be useful in cases like manually preserving scroll position during rerenders.)

Together with `componentDidUpdate`, this new lifecycle should cover all use cases for the legacy `componentWillUpdate`.

You can find their type signatures [in this gist](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264).

We'll look at examples of how both of these lifecycles can be used below.

## Exemplos {#examples}
- [Inicializando o state](#initializing-state)
- [Buscando dados externos](#fetching-external-data)
- [Adicionando ouvintes de eventos (ou inscriçoes)](#adding-event-listeners-or-subscriptions)
- [Atualizando o `state` baseado em props](#updating-state-based-on-props)
- [Invocando callbacks externos](#invoking-external-callbacks)
- [Efeitos colaterais em mudanças de props](#side-effects-on-props-change)
- [Buscando dados externos quando houver alteração de props](#fetching-external-data-when-props-change)
- [Lendo propriedades do DOM antes de uma atualização](#reading-dom-properties-before-an-update)

> Nota
>
> Para brevidade, os exemplos abaixo são escritos usando a classe experimental de transformação de propriedades, mas as mesmas estratégias de migração se aplicam sem ela.

### Inicializando o state {#initializing-state}

Este exemplo mostra um componente com a chamada de `setState` dentro de `componentWillMount`:
`embed:update-on-async-rendering/initializing-state-before.js`

A refatoração mais simples para este tipo de componente é mover a inicialização do state para o construtor ou para um inicializador de propriedade, assim:
`embed:update-on-async-rendering/initializing-state-after.js`

### Fetching external data {#fetching-external-data}

Here is an example of a component that uses `componentWillMount` to fetch external data:
`embed:update-on-async-rendering/fetching-external-data-before.js`

The above code is problematic for both server rendering (where the external data won't be used) and the upcoming async rendering mode (where the request might be initiated multiple times).

The recommended upgrade path for most use cases is to move data-fetching into `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

There is a common misconception that fetching in `componentWillMount` lets you avoid the first empty rendering state. In practice this was never true because React has always executed `render` immediately after `componentWillMount`. If the data is not available by the time `componentWillMount` fires, the first `render` will still show a loading state regardless of where you initiate the fetch. This is why moving the fetch to `componentDidMount` has no perceptible effect in the vast majority of cases.

> Note
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).
>
> In the longer term, the canonical way to fetch data in React components will likely be based on the “suspense” API [introduced at JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Both simple data fetching solutions and libraries like Apollo and Relay will be able to use it under the hood. It is significantly less verbose than either of the above solutions, but will not be finalized in time for the 16.3 release.
>
> When supporting server rendering, it's currently necessary to provide the data synchronously – `componentWillMount` was often used for this purpose but the constructor can be used as a replacement. The upcoming suspense APIs will make async data fetching cleanly possible for both client and server rendering.

### Adding event listeners (or subscriptions) {#adding-event-listeners-or-subscriptions}

Here is an example of a component that subscribes to an external event dispatcher when mounting:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Unfortunately, this can cause memory leaks for server rendering (where `componentWillUnmount` will never be called) and async rendering (where rendering might be interrupted before it completes, causing `componentWillUnmount` not to be called).

People often assume that `componentWillMount` and `componentWillUnmount` are always paired, but that is not guaranteed. Only once `componentDidMount` has been called does React guarantee that `componentWillUnmount` will later be called for clean up.

For this reason, the recommended way to add listeners/subscriptions is to use the `componentDidMount` lifecycle:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

Sometimes it is important to update subscriptions in response to property changes. If you're using a library like Redux or MobX, the library's container component should handle this for you. For application authors, we've created a small library, [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription), to help with this. We'll publish it along with React 16.3.

Rather than passing a subscribable `dataSource` prop as we did in the example above, we could use `create-subscription` to pass in the subscribed value:

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> Note
> 
> Libraries like Relay/Apollo should manage subscriptions manually with the same techniques as `create-subscription` uses under the hood (as referenced [here](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)) in a way that is most optimized for their library usage.

### Updating `state` based on `props` {#updating-state-based-on-props}

>Note:
>
>Both the older `componentWillReceiveProps` and the new `getDerivedStateFromProps` methods add significant complexity to components. This often leads to [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Consider **[simpler alternatives to derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** to make components predictable and maintainable.

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

Although the above code is not problematic in itself, the `componentWillReceiveProps` lifecycle is often mis-used in ways that _do_ present problems. Because of this, the method will be deprecated.

As of version 16.3, the recommended way to update `state` in response to `props` changes is with the new `static getDerivedStateFromProps` lifecycle. It is called when a component is created and each time it re-renders due to changes to props or state:
`embed:update-on-async-rendering/updating-state-from-props-after.js`

You may notice in the example above that `props.currentRow` is mirrored in state (as `state.lastRow`). This enables `getDerivedStateFromProps` to access the previous props value in the same way as is done in `componentWillReceiveProps`.

You may wonder why we don't just pass previous props as a parameter to `getDerivedStateFromProps`. We considered this option when designing the API, but ultimately decided against it for two reasons:
* A `prevProps` parameter would be null the first time `getDerivedStateFromProps` was called (after instantiation), requiring an if-not-null check to be added any time `prevProps` was accessed.
* Not passing the previous props to this function is a step toward freeing up memory in future versions of React. (If React does not need to pass previous props to lifecycles, then it does not need to keep the previous `props` object in memory.)

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getDerivedStateFromProps` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

### Invoking external callbacks {#invoking-external-callbacks}

Here is an example of a component that calls an external function when its internal state changes:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

Sometimes people use `componentWillUpdate` out of a misplaced fear that by the time `componentDidUpdate` fires, it is "too late" to update the state of other components. This is not the case. React ensures that any `setState` calls that happen during `componentDidMount` and `componentDidUpdate` are flushed before the user sees the updated UI. In general, it is better to avoid cascading updates like this, but in some cases they are necessary (for example, if you need to position a tooltip after measuring the rendered DOM element).

Either way, it is unsafe to use `componentWillUpdate` for this purpose in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used since it is guaranteed to be invoked only once per update:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### Side effects on props change {#side-effects-on-props-change}

Similar to the [example above](#invoking-external-callbacks), sometimes components have side effects when `props` change.

`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

Like `componentWillUpdate`, `componentWillReceiveProps` might get called multiple times for a single update. For this reason it is important to avoid putting side effects in this method. Instead, `componentDidUpdate` should be used since it is guaranteed to be invoked only once per update:

`embed:update-on-async-rendering/side-effects-when-props-change-after.js`

### Fetching external data when `props` change {#fetching-external-data-when-props-change}

Here is an example of a component that fetches external data based on `props` values:
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

The recommended upgrade path for this component is to move data updates into `componentDidUpdate`. You can also use the new `getDerivedStateFromProps` lifecycle to clear stale data before rendering the new props:
`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> Note
>
> If you're using an HTTP library that supports cancellation, like [axios](https://www.npmjs.com/package/axios), then it's simple to cancel an in-progress request when unmounting. For native Promises, you can use an approach like [the one shown here](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Reading DOM properties before an update {#reading-dom-properties-before-an-update}

Here is an example of a component that reads a property from the DOM before an update in order to maintain scroll position within a list:
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

In the above example, `componentWillUpdate` is used to read the DOM property. However with async rendering, there may be delays between "render" phase lifecycles (like `componentWillUpdate` and `render`) and "commit" phase lifecycles (like `componentDidUpdate`). If the user does something like resize the window during this time, the `scrollHeight` value read from `componentWillUpdate` will be stale.

The solution to this problem is to use the new "commit" phase lifecycle, `getSnapshotBeforeUpdate`. This method gets called _immediately before_ mutations are made (e.g. before the DOM is updated). It can return a value for React to pass as a parameter to `componentDidUpdate`, which gets called _immediately after_ mutations.

The two lifecycles can be used together like this:

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getSnapshotBeforeUpdate` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

## Outros cenários {#other-scenarios}

Enquanto tentamos cobrir os casos de uso mais comuns nesta publicação, reconhecemos que podemos ter perdido alguns deles. Se você estiver usando `componentWillMount`, `componentWillUpdate`, ou `componentWillReceiveProps` de maneiras não cobertas por esta postagem e não tem certeza de como migrar esses ciclos de vida legados, por favor [envie-nos uma nova issue referente a nossa documentação](https://github.com/reactjs/reactjs.org/issues/new) com o seu código de exemplo e o máximo de informações que puder fornecer. Atualizaremos este documento com novos padrões alternativos à medida que eles aparecerem.

## Mantenedores de projetos de código aberto {#open-source-project-maintainers}

Os mantenedores de código aberto podem estar se perguntando o que essas alterações significam para componentes compartilhados. Se você implementar as sugestões acima, o que acontece com componentes que dependem do novo ciclo de vida estático `getDerivedStateFromProps`? Você também terá que liberar uma nova versão principal e quebrar a compatibilidade com o React 16.2 e versões anteriores?

Felizmente, não!

Quando o React 16.3 for publicado, também publicaremos um novo pacote npm, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). Este pacote contém polyfills de componentes para que os novos ciclos de vida `getDerivedStateFromProps` e `getSnapshotBeforeUpdate` funcionem também com versões mais antigas do React (0.14.9+).

Para usar esse polyfill, primeiro adicione-o como uma dependência à sua biblioteca:

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

Em seguida, atualize seus componentes para utilizarem os novos ciclos de vida (como descrito acima).

Por fim, utilize o polyfill para tornar seu componente compatível com versões anteriores do React:
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`