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

### Novo ciclo de vida: `getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

O novo ciclo de vida `getSnapshotBeforeUpdate` é chamado logo antes que as mutações sejam feitas (por exemplo, antes que o DOM seja atualizado). O valor de retorno para este ciclo de vida será passado como o terceiro parâmetro para `componentDidUpdate`. (Esse ciclo de vida não é freqüentemente necessário, mas pode ser útil em casos como preservar manualmente a posição de rolagem durante as renderizações.)

Juntamente com `componentDidUpdate`, esse novo ciclo de vida deve abranger todos os casos de uso para o legado `componentWillUpdate`.

Você pode encontrar as assinaturas de tipo [neste gist](https://GIST.github.com/gaearon/88634d27abbc4feeb40a698f760f3264).

Vamos ver exemplos de como ambos os ciclos de vida podem ser usados abaixo.

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

### Buscando dados externos {#fetching-external-data}

Aqui está um exemplo de um componente que usa `componentWillMount` para buscar dados externos:
`embed:update-on-async-rendering/fetching-external-data-before.js`

O código acima é problemático para a renderização do servidor (onde os dados externos não serão usados) e o próximo modo de renderização assíncrona (onde a solicitação pode ser iniciada várias vezes).

O caminho de atualização recomendado para a maioria dos casos de uso é mover os dados-buscados para `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

Há um equívoco comum que buscando os dados no `componentWillMount` permitirá que você evite o primeiro estado de renderização vazio. Na prática, isso nunca foi verdade porque o React sempre executa o `render` imediatamente após o `componentWillMount`. Se os dados não estiverem disponíveis no momento em que `componentWillMount` é acionado, o primeiro `render` ainda mostrará um estado de carregamento, independentemente de onde você iniciar a busca. É por isso que mover a busca para `componentWillMount` não tem nenhum efeito perceptível na grande maioria dos casos.

> Nota
>
> Alguns casos de uso avançados (por exemplo, bibliotecas como Relay) podem querer experimentar de forma ansiosa os dados assíncronos pré-buscados. Um exemplo de como isso pode ser feito está disponível [aqui](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).
>
> A longo prazo, a forma canônica de buscar dados em componentes do React provavelmente será baseada na API de "suspense" [introduzida no JSConf Islândia](https://github.com/reebr/pt-BR.reactjs.org/blob/2018-03-27-update-on-async-rendering/blog/2018/03/01/sneak-peek-beyond-react-16.html). Ambas as soluções para buscar dados dados simples buscando e bibliotecas como Apollo e Relay serão capazes de utilizá-la por baixo dos panos. É significativamente menos verboso do que qualquer uma das soluções acima, mas não será finalizado em tempo para a versão 16.3.
>
> Ao oferecer suporte a renderização do servidor, é atualmente necessário fornecer os dados sincronicamente – `componentWillMount` foi freqüentemente usado para essa finalidade, mas o construtor pode ser usado como uma substituição. As próximas APIs de suspense farão com que os dados assíncronos sejam obtidos de forma limpa para renderização de cliente e servidor.

### Adicionando *listeners* de eventos (ou inscrições) {#adding-event-listeners-or-subscriptions}

Aqui está um exemplo de um componente que assina um *dispatcher* externo de eventos ao montar-se:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Infelizmente, isto pode causar vazamentos de memória para renderização do servidor (onde `componentWillUnmount` nunca será chamado) e em renderização assíncrona (onde a renderização pode ser interrompida antes de ser concluída, fazendo com que `componentWillUnmount` não seja chamado).

As pessoas geralmente assumem que `componentWillMount` e `componentWillUnmount` estão sempre emparelhados mas isto não é garantido. Somente uma vez que `componentDidMount` for chamado, o React garante que o `componentWillUnmount` será chamado para a limpeza.

Por esse motivo, a maneira recomendada para adicionar ouvintes/inscrições é usar o ciclo de vida `componentDidMount`:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

Às vezes, é importante atualizar as inscrições às alterações de propriedades. Se você estiver utilizando uma biblioteca como o Redux ou Mobx, o componente de contêiner da da biblioteca deve lidar com isso para você. Para autores de aplicações, criamos uma pequena biblioteca, [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription), para ajudar com isto. Vamos publicá-la junto com o React 16.3.

Em vez de passar uma prop `dataSource` assinada como fizemos no exemplo acima, poderíamos usar o `create-subscription` para passar o valor subscrito:

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> Nota
> 
> Bibliotecas como Relay/Apollo devem gerenciar inscrições manualmente com as mesmas técnicas que `create-subscription` utilizam por baixo dos panos (como referenciado [aqui](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)) de uma forma que é mais otimizado para o uso da biblioteca.

### Atualizando o `state` baseado em `props` {#updating-state-based-on-props}

>Nota:
>
>Tanto o antigo método `componentWillReceiveProps` e o novo `getDerivedStateFromProps` adicionam uma complexidade significativa para componentes. Isso muitas vezes levam a [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Considere **[alternativas mais simples ao state derivado](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** para tornar os componentes previsíveis e sustentáveis.

Aqui está um exemplo de um componente que utiliza o ciclo de vida `componentWillReceiveProps` legado para atualizar o `state` baseado em um novo valor de uma `props`:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

Embora o código acima não seja problemático em si, o ciclo de vida `componentWillReceiveProps` geralmente é utilizado de forma abusiva fazendo com que _apresentem_ problemas. Devido a isso, o método será depreciado.

A partir da versão 16.3, a maneira recomendada de atualizar o `state` em resposta a mudanças de `props` é com o novo ciclo de vida `static getDerivedStateFromProps`. Ele é chamado quando o componente é criado e todas as vezes que o mesmo for renderizado novamente quando houver mudanças de props ou state:
`embed:update-on-async-rendering/updating-state-from-props-after.js`

Você pode notar no exemplo acima que `props.currentRow` é espelhado no state (como `state.lastRow`). Isso permite `getDerivedStateFromProps` acessar o valor anterior de props da mesma maneira como é feito em `componentWillReceiveProps`.

Você pode se perguntar por que nós não apenas passamos as props anteriores como parâmetro para o `getDerivedStateFromProps`. Nós consideramos essa opção ao projetar a API, mas finalmente decidimos ir contra ela por dois motivos:
* Um parâmetro `prevProps` seria nulo na primeira vez que `getDerivedStateFromProps` fosse chamado (após ser instanciado), requerendo adicionar uma checagem if-not-null a qualquer momento em que `prevProps` fosse acessado.
* Não passar as props anteriores para essa função é uma etapa para liberar memória em futuras versões do React. (Se o React não precisar passar props anteriores para ciclios de vida, então ele precisará manter o objeto de `props` em memória.)

> Nota
>
> Se você está escrevendo um componente compartilhado, o polyfill [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) permite que o novo ciclo de vida `getDerivedStateFromProps` seja usado em versões mais antigas do React também. [Saiba mais sobre como usá-lo abaixo.](#open-source-project-maintainers)

### Invocando callbacks externos {#invoking-external-callbacks}

Aqui está um exemplo de um componente que chama uma função externa quando seu state interno é alterado:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

Às vezes, as pessoas usam `componentWillUpdate` com medo de que quando `componentDidUpdate` for disparado, isso seja "tarde demais" para atualizar o state de outros componentes. Este não é o caso. O React garante que qualquer chamada ao `setState` que esteja ocorrendo durante `componentDidMount` e `componentDidUpdate` sejam liberadas antes que o usuário veja a UI atualizada. Em geral, é melhor evitar atualizações em cascatas como esta, mas em alguns casos elas podem ser necessárias (por exemplo, se você precisa posicionar uma *tooltip* medir o elemento renderizado no DOM).

De qualquer maneira, não é seguro fazer o uso de `componentWillUpdate` para este propósito em modo assíncrono, porque o retorno de uma chamada externa pode ser executada múltiplas em uma única atualização. Em vez disso, o ciclo de vida `componentDidUpdate` deve ser utilizado pois é gerantido que seja invocado uma única vez por atualização:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### Efeitos colaterais em mudanças de props {#side-effects-on-props-change}

Similar ao [exemplo acima](#invoking-external-callbacks), às vezes os componentes tem efeitos colaterais quando ocorrem mudanças de `props`.

`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

Assim como o `componentWillUpdate`, o `componentWillReceiveProps` pode ser chamado várias vezes para uma única atualização. Por esta razão, é importante evitar colocar efeitos colaterais neste método. Em vez disso, `componentDidUpdate` deve ser usado uma vez que é garantido que seja invocado uma única vez por atualização:

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