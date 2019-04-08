---
title: "Você Provavelmente Não Precisa de Estado Derivado"
author: [bvaughn]
---

O React 16.4 incluiu um [bugfix para getDerivedStateFromProps](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) que fez com que alguns bugs existentes em componentes do React se reproduzissem de forma mais consistente. Se esta versão expôs um caso em que seu aplicativo estava usando um anti-padrão e passou a não funcionar corretamente, lamentamos os danos. Neste post, vamos explicar alguns anti-padrões comuns com estado derivado e nossas alternativas preferidas.

Por muito tempo, o ciclo de vida `componentWillReceiveProps` era a única maneira de atualizar o estado em resposta a uma mudança nos objetos sem renderização adicional. Na versão 16.3, [introduzimos um ciclo de vida substituto, `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) para resolver os mesmos casos de uso de uma maneira mais segura. Ao mesmo tempo, percebemos que as pessoas têm muitos equívocos sobre como usar os dois métodos e descobrimos que os anti-padrões resultam em bugs sutis e confusos. A correção de bugs `getDerivedStateFromProps` no 16.4 [torna o estado derivado mais previsível](https://github.com/facebook/react/issues/12898), portanto os resultados do uso indevido são mais fáceis de serem notados.

> Nota
>
> Todos os anti-padrões descritos neste post se aplicam tanto ao antigo `componentWillReceiveProps` quanto ao mais recente `getDerivedStateFromProps`.

 Esta postagem do blog abordará os seguintes tópicos:
* [Quando usar o estado derivado](#when-to-use-derived-state)
* [Bugs comuns ao usar o estado derivado](#common-bugs-when-using-derived-state)
  * [Anti-padrão: Copiando incondicionalmente props ao estado](#anti-pattern-unconditionally-copying-props-to-state)
  * [Anti-padrão: Apagando o estado quando as props mudam](#anti-pattern-erasing-state-when-props-change)
* [Soluções preferidas](#preferred-solutions)
* [E quanto a memoização?](#what-about-memoization)

## Quando Usar o Estado Derivado {#when-to-use-derived-state}

`getDerivedStateFromProps` existe apenas para uma finalidade. Ele permite que um componente atualize seu estado interno como resultado de **alterações em props**. Nosso post anterior do blog forneceu alguns exemplos, como [registrando a direção de rolagem atual com base em uma props de marcador de deslocamento](blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) ou [carregar dados externos especificados por um objeto de origem](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

Nós não fornecemos muitos exemplos, porque como regra geral, **o estado derivado deve ser usado com parcimônia**. Todos os problemas com o estado derivado que vimos podem ser reduzidos a (1) atualização de estado incondicional de props ou (2) atualização de estado sempre que props e state não corresponderem. (Vamos falar sobre os dois em mais detalhes abaixo)

* Se você estiver usando o estado derivado para memoizar alguns cálculos baseados apenas nos itens atuais, você não precisará do estado derivado. Veja [E sobre a memorização?](#what-about-memoization) abaixo.
* Se você estiver atualizando o estado derivado incondicionalmente ou atualizando-o sempre que props e state não corresponderem, seu componente provavelmente redefine seu estado com muita freqüência. Leia para mais detalhes.

## Bugs Comuns ao Usar o Estado Derivado {#common-bugs-when-using-derived-state}

Os termos ["controlado"](/docs/forms.html#controlled-components) e ["não-controlado"](/docs/uncontrolled-components.html) geralmente se referem a formulários de entrada, mas também podem descrever onde os dados de qualquer componente residem. Os dados passados ​​como props podem ser considerados como **controlados** (porque o componente pai _controla_ esses dados). Os dados que existem apenas no estado interno podem ser considerados como **não-controlados** (porque os pais não podem alterá-los diretamente).

O erro mais comum com estado derivado é misturar esses dois; quando o valor de um estado derivado também é atualizado por chamadas a `setState`, não existe uma única fonte de verdade para os dados. O [exemplo de carregamento de dados externos](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) mencionado acima pode parecer semelhante, mas é diferente de alguns jeitos importantes. No exemplo de carregamento, há uma fonte clara da verdade para o estado de "origem" e para o estado de que "carrega". Quando a prop fonte muda, o estado de carregamento deve **sempre** ser substituído. De maneira oposta, o estado é substituído apenas quando a prop **muda** e é gerenciado pelo componente.

Os problemas surgem quando qualquer uma dessas restrições é alterada. Isso geralmente vem em duas formas. Vamos dar uma olhada a ambas.

### Anti-padrão: Copiando incondicionalmente props ao estado {#anti-pattern-unconditionally-copying-props-to-state}

Um equívoco comum é achar que `getDerivedStateFromProps` e `componentWillReceiveProps` só são chamados quando as props "mudam". Esses ciclos de vida são chamados sempre que um componente pai é renderizado, independentemente de os objetos serem "diferentes" de antes. Por causa disso, sempre foi inseguro _incondicionalmente_ substituir o estado usando qualquer um desses ciclos de vida. **Isso fará com que as atualizações de estado sejam perdidas.**

Vamos considerar um exemplo para demonstrar o problema. Aqui está um componente `EmailInput` que "espelha" uma prop de email no estado:
```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // Isso apagará qualquer atualização de estado local!
    // Não faça isso.
    this.setState({ email: nextProps.email });
  }
}
```

No início, este componente pode parecer certo. O estado é inicializado com o valor especificado pelas props e atualizado quando digitamos no `<input>`. Mas se os pais de nossos componentes forem re-renderizados, tudo que digitarmos no `<input>` será perdido! ([Veja esta demo para um exemplo.](https://codesandbox.io/s/m3w9zn1z8x)) Isso se aplica mesmo se compararmos `nextProps.email !== this.state.email` antes de redefinir.

Neste exemplo simples, adicionar `shouldComponentUpdate` para re-renderizar somente quando o endereço de email foi alterado poderia corrigir isso. No entanto, na prática, os componentes geralmente aceitam múltiplas props; outra prop mudando ainda causaria uma renderização e um reset incorreto. Props de função e objeto também são frequentemente criados inline, dificultando a implementação de um `shouldComponentUpdate` que retorne true de forma confiável somente quando uma mudança de material ocorrer. [Aqui está uma demo que mostra isso acontecendo.](https://codesandbox.io/s/jl0w6r9w59) Como resultado, `shouldComponentUpdate` é melhor usado como uma otimização de desempenho, e não para garantir a correção do estado derivado.

Espero que esteja claro até agora por que **é uma má ideia copiar incondicionalmente as props ao estado**. Antes de analisar possíveis soluções, vamos ver um padrão problemático relacionado: e se fôssemos apenas atualizar o estado quando a prop do email fosse alterada?

### Anti-padrão: Apagando o estado quando as props mudam {#anti-pattern-erasing-state-when-props-change}

Continuando o exemplo acima, poderíamos evitar apagar acidentalmente o estado, atualizando-o apenas quando a `props.email` for alterada:

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // A qualquer momento que props.email mude, atualize o estado.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> Nota
>
> Mesmo que o exemplo acima mostre `componentWillReceiveProps`, o mesmo anti-padrão se aplica a `getDerivedStateFromProps`.

Acabamos de fazer uma grande melhora. Agora nosso componente irá apagar o que digitamos apenas quando os objetos realmente mudarem.

Ainda há um problema sutil. Imagine um aplicativo gerenciador de senhas usando o componente de entrada acima. Ao navegar entre detalhes para duas contas com o mesmo email, a entrada não se limparia. Isso ocorre porque o valor da prop transferida para o componente seria o mesmo para ambas as contas! Isso seria uma surpresa para o usuário, já que uma alteração não salva em uma conta parece afetar outras contas que compartilharam o mesmo e-mail. ([Veja demo aqui.](https://codesandbox.io/s/mz2lnkjkrx))

Este design é fundamentalmente falho, mas também é um erro fácil de fazer. ([Eu mesmo o fiz!](https://twitter.com/brian_d_vaughn/status/959600888242307072)) Felizmente, existem duas alternativas que funcionam melhor. A chave para ambos é que **para qualquer parte dos dados, você precisa escolher um único componente que seja dono da verdade e evitar duplicá-lo em outros componentes.** Vamos dar uma olhada em cada uma das alternativas.

## Soluções Preferidas {#preferred-solutions}

### Recomendação: Componente totalmente controlado {#recommendation-fully-controlled-component}

Uma maneira de evitar os problemas mencionados acima é remover completamente o estado do nosso componente. Se o endereço de e-mail existir apenas como prop, não precisaremos nos preocupar com conflitos com o estado. Poderíamos até converter o `EmailInput` em um componente de função mais leve:
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

Essa abordagem simplifica a implementação de nosso componente, mas se ainda quisermos armazenar um valor de rascunho, o componente de formulário pai precisará fazer isso manualmente. ([Clique aqui para ver uma demonstração deste padrão.](https://codesandbox.io/s/7154w1l551))

### Recomendação: Componente totalmente não-controlado com uma 'chave' {#recommendation-fully-uncontrolled-component-with-a-key}

Outra alternativa seria que nosso componente possuísse totalmente o estado "rascunho" do email . Nesse caso, nosso componente ainda poderia aceitar uma prop para o valor _inicial_, mas ignoraria as mudanças subsequentes nessa prop:

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

Para redefinir o valor ao mover para um item diferente (como em nosso cenário de gerenciador de senhas), podemos usar o atributo especial do React chamado de `chave`. Quando uma `chave` muda, o React [_cria_ uma nova instância do componente ao invés de _atualizar_ a atual](/docs/reconciliation.html#keys). As chaves geralmente são usadas para listas dinâmicas, mas também são úteis aqui. Em nosso caso, poderíamos usar o ID do usuário para recriar a entrada de e-mail sempre que um novo usuário for selecionado:

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

Cada vez que o ID muda, o `EmailInput` será recriado e seu estado será redefinido para o valor` defaultEmail` mais recente. ([Clique aqui para ver uma demonstração desse padrão.](https://codesandbox.io/s/6v1znlxyxn)) Com essa abordagem, você não precisa adicionar uma `chave` a todas as entradas. Pode fazer mais sentido colocar uma 'chave' em todo o formulário. Toda vez que a chave é alterada, todos os componentes do formulário serão recriados com um estado recém-inicializado.

Na maioria dos casos, essa é a melhor maneira de lidar com o estado que precisa ser redefinido.

> Nota
>
> Embora isso possa parecer lento, a diferença de desempenho é geralmente insignificante. O uso de uma chave pode até ser mais rápido se os componentes tiverem lógica pesada que é executada nas atualizações, já que o diff é ignorado para essa subárvore.

#### Alternativa 1: Redefinir componente não controlado com uma prop de ID {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

Se a `chave` não funcionar por algum motivo (talvez o componente seja muito caro para inicializar), uma solução viável, porém complicada, seria observar as mudanças no "userID" em `getDerivedStateFromProps`:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Sempre que o usuário atual mudar,
    // Redefina quaisquer partes do estado que estejam vinculadas a esse usuário.
    // Neste exemplo simples, seria apenas o email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Isso também fornece a flexibilidade de apenas redefinir partes do estado interno de nosso componente, se assim desejarmos. ([Clique aqui para ver uma demonstração deste padrão.](https://codesandbox.io/s/rjyvp7l3rq))

> Nota
>
> Mesmo que o exemplo acima mostre `getDerivedStateFromProps`, a mesma técnica pode ser usada com `componentWillReceiveProps`.

#### Alternativa 2: Redefinir componente não-controlado com um método de instância {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

Mais raramente, você pode precisar redefinir o estado mesmo se não houver um ID apropriado para usar como `chave`. Uma solução é redefinir a chave para um valor aleatório ou um número de incremento automático sempre que você quiser redefinir. Uma outra alternativa viável é expor um método de instância para redefinir imperativamente o estado interno:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

O componente de formulário pai poderia então [usar um `ref` para chamar este método](/docs/glossary.html#refs).([Clique aqui para ver uma demonstração deste padrão.](https://codesandbox.io/s/l70krvpykl))

As refs podem ser úteis em certos casos como este, mas geralmente recomendamos que você as use com parcimônia. Mesmo na demonstração, esse método imperativo não é ideal porque dois processamentos ocorrerão em vez de um.

-----

### Recapitulação {#recap}

Recapitulando, ao projetar um componente é importante decidir se seus dados serão controlados ou não.

Em vez de tentar **"espelhar" o valor de uma prop no estado**, faça o componente **controlado** e consolide os dois valores divergentes no estado de algum componente pai. Por exemplo, ao invés de uma criança aceitar um `props.value` "comprometido" e rastrear um `state.value` "rascunho", faça o pai gerenciar ambos `state.draftValue` e `state.committedValue` e controlar o valor da criança diretamente. Isso torna o fluxo de dados mais explícito e previsível.

Para componentes **não-controlados**, se você estiver tentando redefinir o estado quando um objeto específico (geralmente um ID) for alterado, você terá algumas opções:
* **Recomendação: Para limpar _todo o estado interno_, use o atributo `chave`.**
* Alternativa 1: Para redefinir _apenas certos campos de estado_, observe as alterações em uma propriedade especial (por exemplo, `props.userID`).
* Alternativa 2: Você também pode considerar voltar a um método de instância imperativo usando refs.

## E Quanto a Memoização? {#what-about-memoization}

Também vimos o estado derivado usado para garantir que um valor caro usado em `render` seja recalculado somente quando as entradas mudam. Essa técnica é conhecida como [memoização](https://en.wikipedia.org/wiki/Memoization).

Usar o estado derivado para memoização não é necessariamente ruim, mas geralmente não é a melhor solução. Há uma complexidade inerente no gerenciamento do estado derivado, e essa complexidade aumenta com cada propriedade adicional. Por exemplo, se adicionarmos um segundo campo derivado ao estado do nosso componente, nossa implementação precisará rastrear separadamente as alterações em ambos.

Vejamos um exemplo de um componente que usa uma prop objeto - uma lista de itens - e processa os itens que correspondem a uma consulta de pesquisa inserida pelo usuário. Poderíamos usar o estado derivado para armazenar a lista filtrada:

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // NOTA: esse exemplo NÃO é a abordagem recomendada.
  // Veja os exemplos abaixo para nossas recomendações.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Execute novamente o filtro sempre que a lista ou o texto do filtro forem alterados.
    // Note que precisamos armazenar prevPropsList e prevFilterText para detectar mudanças.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

Essa implementação evita recalcular `filteredList` com mais freqüência do que o necessário. Mas é mais complicado do que o necessário, porque ele tem que rastrear e detectar separadamente as alterações nos props e no estado para atualizar adequadamente a lista filtrada. Neste exemplo, podemos simplificar as coisas usando `PureComponent` e movendo a operação de filtro para o método de renderização:

```js
// PureComponents apenas re-renderizam se pelo menos um estado ou valor de prop for alterado.
// A mudança é determinada fazendo uma comparação superficial entre as chaves do estado e as props.
class Example extends PureComponent {
  // O estado apenas precisa manter o valor atual do texto do filtro:
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // O método de renderização neste PureComponent é chamado apenas se
    // props.list ou state.filterText for alterado.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

A abordagem acima é muito mais limpa e simples do que a versão do estado derivado. Ocasionalmente, isso não será bom o suficiente - a filtragem pode ser lenta para listas grandes, e o `PureComponent` não impedirá as re-renderizações se outra prop for mudar. Para resolver essas duas preocupações, poderíamos adicionar um auxiliar de memoização para evitar desnecessariamente filtrar novamente nossa lista:

```js
import memoize from "memoize-one";

class Example extends Component {
  // O estado apenas precisa manter o valor atual do texto do filtro:
  state = { filterText: "" };

  // Execute novamente o filtro sempre que o array da lista ou o texto do filtro forem alterados:
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calcule a última lista filtrada. Se esses argumentos não mudaram
    // desde a última renderização, `memoize-one` reutilizará o último valor de retorno.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

Isso é muito mais simples e funciona tão bem quanto a versão do estado derivado!

Ao usar memoização, lembre-se de algumas restrições:

1. Na maioria dos casos, você vai querer **anexar a função memoizada a uma instância de componente**. Isso evita que várias instâncias de um componente limpem as chaves memoizadas umas das outras.
2. Normalmente, você desejará usar um auxiliar de memoização com um **tamanho de cache limitado** para evitar vazamentos de memória ao longo do tempo. (No exemplo acima, usamos `memoize-one` porque ele armazena apenas os argumentos e resultados mais recentes.)
3. Nenhuma das implementações mostradas nesta seção funcionará se `props.list` for recriada toda vez que o componente pai for renderizado. Mas na maioria dos casos, essas abordagem são apropriadas.

## Encerrando {#in-closing}

Em aplicações do mundo real, os componentes geralmente contêm uma mistura de comportamentos controlados e descontrolados. Isso é ok! Se cada valor tiver uma fonte clara de verdade, você poderá evitar os anti-padrões mencionados acima.

Também vale a pena reiterar que `getDerivedStateFromProps` (e o estado derivado em geral) é um recurso avançado e deve ser usado com moderação devido a essa complexidade. Se o seu caso de uso ficar fora desses padrões, compartilhe-o conosco no [GitHub](https://github.com/reactjs/reactjs.org/issues/new) ou [Twitter](https://twitter.com/reactjs)!
