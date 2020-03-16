---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

O termo _["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)_ se refere a uma técnica de compartilhar código entre componentes React passando uma prop cujo valor é uma função.

Um componente com uma _render prop_ recebe uma função que retorna um elemento React e a invoca no momento de renderização, não sendo necessário para o componente implementar uma lógica própria.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Bibliotecas que usam render props incluem [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) e [Formik](https://github.com/jaredpalmer/formik).

Nesse documento vamos discutir por que _render props_ são úteis e como escrevê-las.

## Uso de _Render Props_ para Características Transversais {#use-render-props-for-cross-cutting-concerns}

Componentes são as principais unidades de reuso de código em React, mas nem sempre é fácil compartilhar o estado ou comportamento que um componente encapsula para outros componentes utilizarem esses valores.

Por exemplo, o componente abaixo captura a posição do mouse em um aplicativo web:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Enquanto o cursor se move pela tela, o componente mostra suas coordenadas (x, y) em um `<p>`

A questão é: Como podemos reutilizar esse comportamento em outro componente? Em outras palavras, se outro componente precisar saber a posição do cursor, podemos encapsular esse comportamento de forma que seja fácil compartilhá-lo com outros componentes?

Lembrando que componentes são a unidade básica de reuso de código em React, vamos tentar refatorar esse código para usar o componente `<Mouse>`, ele encapsula o comportamento que precisamos reutilizar. 

```js
// O componente <Mouse> encapsula o comportamento que precisamos...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...mas como renderizar algo diferente de um <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

Agora o componente `<Mouse>` encapsula todos os comportamentos associados aos eventos `mousemove` e guarda a posição (x, y) do cursor, mas ainda não é completamente reutilizável.

Por exemplo, suponha que temos o componente `<Cat>` que renderiza a image de um gato seguindo o mouse na tela.
Poderíamos usar uma _prop_ `<Cat mouse={{ x, y }}>` que passaria as coordenadas do mouse para o componente de forma que este saberia onde posicionar a imagem na tela.

Inicialmente, você poderia tentar renderizar `<Cat>` *dentro do método render do `<Mouse>`*, assim:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Poderíamos simplesmente trocar o <p> por um <Cat> ... mas assim
          teríamos que criar um componente <MouseWithSomethingElse>
          separado toda vez que precisarmos usá-lo, então <MouseWithCat>
          não é muito reutilizável ainda.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Essa abordagem funciona para o nosso caso em específico, mas ainda não atingimos o objetivo de encapsular o comportamento de uma maneira completamente reutilizável. Agora, toda vez que precisarmos da posição do mouse para outro caso, teremos que criar um novo componente (ou seja, outro `<MouseWithCat>`) que renderiza algo especificamente para esse caso.

Aqui é onde a _render prop_ se encaixa: Ao invés de escrever um componente `<Cat>` dentro de `<Mouse>`, e mudar diretamente a saída renderizada, podemos passar uma função como prop para `<Mouse>`, que vai chamá-la para determinar o que renderizar dinamicamente- essa é a _render prop_.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          No lugar de fornecer uma representação estática do que <Mouse> deve
          renderizar, use a `render` prop para determinar o que renderizar
          dinamicamente.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Agora, no lugar de clonar o componente `<Mouse>` e escrever o método `render` para resolver um caso específico, nós passamos uma _render prop_ que `<Mouse>` pode usar para determinar o que ele renderiza dinamicamente.

Portanto, **uma _render prop_ é uma função passada nas _props_ que um componente utiliza para determinar o que renderizar.**

Essa técnica torna o comportamento que precisamos compartilhar extremamente portátil. Para acessar esse comportamento, basta renderizar um `<Mouse>` com uma `render` _prop_ que dirá o que renderizar com o (x, y) atual do cursor.

Algo interessante para notar sobre _render props_ é que você pode implementar a maioria dos _[higher-order components](/docs/higher-order-components.html)_ (HOC) utilizando um componente qualquer com uma _render prop_. Por exemplo, se você preferir ter um HOC `withMouse` no lugar de um componente `<Mouse>`, você poderia simplesmente criar um utilizando o `<Mouse>` com uma _render prop_.

```js
// Se você realmente quer usar HOC por alguma razão, você
// pode facilmente criar uma usando um componente qualquer
// com uma render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Então, utilizar uma _render prop_ torna possível qualquer um dos padrões citados.

## Usando outras _Props_ além de `render`{#using-props-other-than-render} 

É importante lembrar que mesmo o nome padrão sendo _"render props"_, não quer dizer que você deve ter uma _prop_ chamada `render` para usar esse padrão. Na verdade, [*qualquer* _prop_ que é uma função usada por um componente para determinar o que renderizar é uma _"render prop"_](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Embora os exemplos acima usem a palavra `render`, poderíamos usar a _prop_ `children`!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

Lembre-se, a _prop_ `children` não precisar estar nomeada na lista de "atributos" do seu elemento JSX. Ao invés disso, você pode inserí-la _dentro_ do seu elemento!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Você pode ver essa técnica sendo usada na API [react-motion](https://github.com/chenglou/react-motion). 


Dado que essa é uma técnica um pouco incomum, quando você estiver criando uma API como essa, você provavelmente vai querer definir nos seus `propTypes` que `children` deve ser uma função.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Avisos {#caveats}

### Tenha cuidado ao utilizar _Render Props_ num React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Usar uma _render prop_ pode anular a vantagem de utilizar [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) se você criar uma função dentro de um método `render`. Isso se deve à comparação superficial de _prop_ sempre retornar `false` para novas _props_, e, nesse caso, cada `render` vai gerar um novo valor para a _render prop_.

Por exemplo, continuando com o componente `<Mouse>` acima, se `Mouse` estendesse `React.PureComponent` no lugar de `React.Component`, nosso exemplo seria assim:

```js
class Mouse extends React.PureComponent {
  // Mesma implementação de antes...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          Isso é ruim! O valor da prop `render` vai ser
          diferente para cara render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Nesse exemplo, cada vez que `<MouseTracker>` renderiza, ele gera uma nova função como valor da prop `<Mouse render>`, anulando assim o efeito de `<Mouse>` estender `React.PureComponent`!

Para contornar esse problema, você pode definir a prop como um método de instância:

```js
class MouseTracker extends React.Component {
  // Definindo como um método de instância, `this.renderTheCat`
  // sempre se refere a *mesma* função quando chamamos na
  // renderização
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Nos casos onde você não pode definir a prop estaticamente (por exemplo, quando você precisa esconder as props e o estado do componente), `<Mouse>` deveria estender `React.Component`.
