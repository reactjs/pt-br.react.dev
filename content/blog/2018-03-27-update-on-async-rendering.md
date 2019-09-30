---
title: Atualização em Renderização Assíncrona
author: [bvaughn]
---

Por mais de um ano, a equipe do React tem trabalhado para implementar a renderização assíncrona. No mês passado, durante sua palestra no JSConf na Islândia, [Dan revelou algumas das novas possibilidades excitantes que a renderização assíncrona desbloqueia](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Agora, gostaríamos de compartilhar com você algumas das lições que aprendemos ao trabalhar nesses recursos e algumas receitas para ajudar a preparar seus componentes para renderização assíncrona quando ela for lançada.

Uma das maiores lições que aprendemos é que alguns dos nossos ciclos de vida de componentes legados tendem a incentivar práticas de codificação inseguras. Eles são:

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

Estes métodos de ciclo de vida têm sido muitas vezes incompreendidos e sutilmente usurpados; Além disso, prevemos que o seu potencial uso indevido pode ser mais problemático com a renderização assíncrona. Devido a isso, nós estaremos adicionando um prefixo  "UNSAFE_" para esses ciclos de vida em uma próxima versão. (Aqui,  "inseguro" não refere-se à segurança, mas sim que códigos utilizando esses ciclos de vida terão mais chances de ter bugs em versões futuras do React, especialmente quando a renderização assíncrona estiver habilitada.)

## Caminho de Migração Gradual {#gradual-migration-path}

[React segue o controle de versão semântica](/blog/2016/02/19/new-versioning-scheme.html), portanto, essa alteração será gradual. Nosso plano atual é:

* **16.3**: Introdução de pseudônimos para os ciclos de vida não seguros, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, e `UNSAFE_componentWillUpdate`. (Tanto os nomes de ciclos de vida antigos quanto os novos pseudônimos funcionarão nesta versão.)
* **Uma versão futura do 16. x**: Habilita o aviso de substituição para `componentWillMount`, `componentWillReceiveProps`, e `componentWillUpdate`. (Tanto os nomes de ciclos de vida antigos e os novos pseudônimos funcionarão nesta versão, mas os nomes antigos registrarão um aviso em modo de desenvolvimento.)
* **17.0**: Remoção de `componentWillMount`, `componentWillReceiveProps`, e `componentWillUpdate` . (Apenas os novos nomes de ciclo de vida "UNSAFE_" funcionarão a partir deste ponto para a frente.)

**Observe que, se você for um desenvolvedor de aplicativos React, não precisará fazer nada sobre os métodos legados por enquanto. O objetivo principal da próxima versão 16.3 é permitir que os mantenedores do projeto de código aberto atualizem suas bibliotecas antes de quaisquer avisos de substituição. Esses avisos não serão ativados até uma versão 16.x futura.**

Mantemos mais de 50.000 componentes do React no Facebook, e não planejamos reescrevê-los imediatamente. Entendemos que as migrações levam tempo. Tomaremos o caminho de migração gradual junto com todos na comunidade React.

Se você não tiver tempo para migrar ou testar esses componentes, recomendamos executar um script ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) que os renomeia automaticamente:

```bash
cd seu_projeto
npx react-codemod rename-unsafe-lifecycles
```

Saiba mais sobre este codemod no [post da versão 16.9.0.](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#renaming-unsafe-lifecycle-methods)

---

## Migrando de Ciclos de Vida Legados {#migrating-from-legacy-lifecycles}

Se gostaria de começar a usar as novas APIs de componentes introduzidas no React 16.3 (ou se você for um mantenedor procurando atualizar sua biblioteca com antecedência) aqui estão alguns exemplos que esperamos que o ajudem a começar a pensar em componentes um pouco diferente. Ao longo do tempo, planejamos adicionar "receitas" adicionais à nossa documentação que mostram como executar tarefas comuns de uma forma que evite os ciclos de vida problemáticos.

Antes de começarmos, aqui está uma rápida visão geral das alterações de ciclo de vida planejadas para a versão 16.3:
* Estamos **adicionando os seguintes pseudônimos de ciclo de vida**: `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, e `UNSAFE_componentWillUpdate`. (Os nomes de ciclo de vida antigos e os novos pseudônimos serão suportados.)
* Estamos **introduzingo dois novos ciclos de vida**, estático `getDerivedStateFromProps` e `getSnapshotBeforeUpdate`.

### Novo ciclo de vida: `getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

O novo ciclo de vida estático `getDerivedStateFromProps` é invocado depois que um componente é instanciado, bem como antes de ser renderizado novamente. Ele pode retornar um objeto para atualizar o `state`, ou `null` para indicar que as novas `props` não exigem quaisquer atualizações de `state`.

Juntamente com `componentDidUpdate`, esse novo ciclo de vida deve abranger todos os casos de uso para o legado `componentWillReceiveProps`.

>Nota:
>
> Tanto o antigo método `componentWillReceiveProps` e quanto o novo `getDerivedStateFromProps` adicionam uma complexidade significativa para os componentes. Isso muitas vezes leva a [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Considere **[alternativas mais simples ao `state` derivado](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** para tornar os componentes previsíveis e sustentáveis.

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

### Buscando dados externos quando `props` mudarem {#fetching-external-data-when-props-change}

Aqui está um exemplo de um componente que busca dados externos com base em valores de `props`:
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

A solução recomendado para este componente é mover as atualizações de dados para `componentDidUpdate`. Você também pode usar o novo ciclo de vida `getDerivedStateFromProps` para limpar dados obsoletos antes de renderizar as novas props:

`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> Nota
>
> Se você estiver usando uma biblioteca HTTP que ofereça suporte ao cancelamento, como [axios](https://www.npmjs.com/package/axios), é simples cancelar uma solicitação em andamento ao desmontar o componente. Para Promises nativas, você pode usar uma abordagem como a [mostrada aqui](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Lendo propriedades do DOM antes de uma atualização {#reading-dom-properties-before-an-update}

Aqui está um exemplo de um componente que lê uma propriedade do DOM antes de uma atualização a fim de manter a posição de rolagem dentro de uma lista:
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

No exemplo acima, `componentWillUpdate` é usado para ler a propriedade DOM. No entanto, com renderização assíncrona, pode haver atrasos entre os ciclos de vida de fase "render" (como `componentWillUpdate` e `render`) e  os ciclos de vida de fase "commit" (como `componentDidUpdate`). Se o usuário fizer algo como redimensionar a janela durante esse tempo, o valor de `scrollHeight` lido de `componentWillUpdate` será obsoleto.

A solução para esse problema é usar o novo ciclo de vida de fase "commit", `getSnapshotBeforeUpdate`. Este método é chamado _imediatamente antes_ de mutações serem realizadas (por exemplo, antes do DOM ser atualizado). Ele pode retornar um valor para o React passar como um parâmetro para `componentDidUpdate`, que é chamado _imediatamente após_ as mutações.

Os dois ciclos de vida podem ser usados juntos assim:

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> Nota
>
> Se você estiver escrevendo um componente compartilhado, o polyfill [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) permite que o novo ciclo de vida `getSnapshotBeforeUpdate` seja usado com versões mais antigas do React também. [Saiba mais sobre como usá-lo abaixo.](#open-source-project-maintainers)

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