---
title: "(A => B) !=> (B => A)"
author: [jimfb]
---

A documentação para `componentWillReceiveProps` diz que `componentWillReceiveProps` será invocado quando as props mudam como resultado de uma re-renderização. Algumas pessoas assumem que isso significa "se `componentWillReceiveProps` é chamado, então as props devem ter mudado", mas essa conclusão é logicamente incorreta.

O princípio orientador é um dos meus favoritos da lógica/matemática formal:
 > A implica B não implica B implica A

Exemplo: "Se eu comer comida mofada, eu ficarei doente" não implica "se estou doente, então eu devo ter comido comida mofada". Existem muitas outras razões pelas quais eu poderia estar me sentindo doente. Por exemplo, a gripe tem circulado no escritório. Da mesma forma, existem várias razões para que `componentWillReceiveProps` seja chamado, mesmo que as props não tenham mudado.

Se você não acredita em mim, chame `ReactDOM.render()` três vezes com exatamente as mesmas props, e tente prever o número de vezes que `componentWillReceiveProps` será chamado:

```js
class Component extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps.data.bar);
  }
  render() {
    return <div>Bar {this.props.data.bar}!</div>;
  }
}

var container = document.getElementById('container');

var mydata = {bar: 'drinks'};
ReactDOM.render(<Component data={mydata} />, container);
ReactDOM.render(<Component data={mydata} />, container);
ReactDOM.render(<Component data={mydata} />, container);
```

Neste caso, a resposta é "2". React chama `componentWillReceiveProps` duas vezes (uma vez para cada um dos dois updates). Nas duas vezes, o valor "drinks" é impresso (isto é, as props não mudaram).

Para entender o porquê, precisamos pensar no que *poderia* ter acontecido. Os dados *poderiam* ter mudado entre a renderização inicial e as duas atualizações subsequentes, se o código tivesse realizado uma mutação como essa:

```js
var mydata = {bar: 'drinks'};
ReactDOM.render(<Component data={mydata} />, container);
mydata.bar = 'food'
ReactDOM.render(<Component data={mydata} />, container);
mydata.bar = 'noise'
ReactDOM.render(<Component data={mydata} />, container);
```

React não tem como saber que os dados não foram alterados. Portanto, React precisa chamar `componentWillReceiveProps`, porque o componente precisa ser notificado sobre as novas props (mesmo se as novas props forem iguais as props antigas).

Você pode pensar que o React poderia apenas usar verificações mais inteligentes para igualidade, mas há alguns problemas com essa ideia:

 * O antigo `mydata` e o novo `mydata` são na verdade o mesmo objeto físico (apenas o valor interno do objeto mudou). Como as referências são triplamente iguais, fazer uma verificação de igualdade não nos diz se o valor mudou. A única solução possível seria ter criado uma cópia profunda dos dados e, posteriormente, fazer uma comparação profunda - mas isso pode ser proibitivamente caro para grandes estruturas de dados (especialmente aquelas com ciclos).
 * O objeto `mydata` pode conter referências para funções que capturaram variáveis dentro de clausuras. Não há como o React espiar dentro dessas clausuras e, portanto, não há como o React copiá-las e/ou verificar sua igualdade.
 * O objeto `mydata` pode conter referências a objetos que são re-instanciados durante uma re-renderização do pai (ou seja, não são triplamente igual) mas são conceitualmente iguais (ou seja, mesmas chaves e mesmos valores). Uma comparação profunda (cara) poderia detectar isso, exceto que as funções apresentam um problema novamente porque não há uma forma confiável para comparar duas funções para verificar se elas são semanticamente equivalentes.

Dadas as restrições da linguagem, às vezes é impossível alcançarmos semânticas de igualdade significativas. Nesses casos, o React irá chamar `componentWillReceiveProps` (mesmo que as props não tenham mudado) para que o componente tenha a oportunidade de examinar as novas props e agir de acordo.

Como resultado, sua implementação do `componentWillReceiveProps` NÂO DEVE assumir que suas props foram alteradas. Se você deseja que uma operação (como uma solicitação de rede) ocorra apenas quando props foram alteradas, o código do `componentWillReceiveProps` precisa verificar se as props foram realmente alteradas.
