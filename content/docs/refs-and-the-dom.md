---
id: refs-and-the-dom
title: Refs e o DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Refs fornecem uma forma de acessar os nós do DOM ou elementos React criados no método render.

Em um fluxo de dados típico do React, as [props](/docs/components-and-props.html) são a única forma de componentes pais interagirem com seus filhos. Para modificar um componente filho, você terá que re-renderizá-lo com as novas props. Porém, existem alguns casos onde você precisa modificar imperativamente um componente filho fora do fluxo típico de dados. O componente filho a ser modificado poderia ser uma instância de um componente React, ou ele poderia ser um elemento DOM. Para ambos os casos, o React fornece uma saída.

### Quando Usar Refs {#when-to-use-refs}

Existem algumas boas finalidades para o uso de refs:

- Gerenciamento de foco, seleção de texto, ou reprodução de mídia.
- Engatilhar animações imperativas.
- Integração com bibliotecas DOM de terceiros.

Evite usar refs para qualquer coisa que possa ser feita de forma declarativa.

Por exemplo, ao invés de expôr os métodos `open()` e `close()` em um componente `Dialog`, passe a propriedade `isOpen` para ele.

### Não Utilize Refs Excessivamente {#dont-overuse-refs}

Sua primeira atitude talvez seja usar refs para "fazer as coisas acontecerem" no seu app. Se este é o caso,
tire um momento para pensar de forma mais crítica sobre onde o estado deveria ser mantido na hierarquia dos seus componentes. Frequentemente, isso torna claro que o lugar apropriado para "manter" o estado é no nível mais alto da hierarquia. Veja o guia [Subindo o Estado](/docs/lifting-state-up.html) para ver exemplos.

> Nota
>
> Os exemplos abaixo foram atualizados para usar a API `React.createRef()` introduzida no React 16.3. Se você está utilizando uma versão anterior do React, nós recomendamos usar [refs com callbacks](#callback-refs).

### Criando Refs {#creating-refs}

Refs são criadas usando `React.createRef()` e anexadas aos elementos React por meio do atributo `ref`. As Refs são comumente atribuídas a uma propriedade de instância quando um componente é construído para que então elas possam ser referenciadas por todo o componente.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Acessando Refs {#accessing-refs}

Quando uma ref é passada para um elemento no `render`, uma referência para o nó se torna acessível no atributo `current` da ref.

```javascript
const node = this.myRef.current;
```

O valor da ref difere dependendo do tipo do nó:

- Quando o atributo `ref` é usado em um elemento HTML, a `ref` criada no construtor `React.createRef()` recebe um elemento DOM subjacente como a propriedade `current`.

- Quando o atributo `ref` é usado em um componente de classe, o objeto `ref` recebe uma instância montada de um componente
  em sua propriedade `current`.

- **Você não pode usar o atributo `ref` em um componente funcional**, já que eles não possuem instâncias.

Os exemplos abaixo demonstram as diferenças.

#### Adicionando uma Ref a um Elemento DOM {#adding-a-ref-to-a-dom-element}

Este código usa uma `ref` para armazenar uma referência a um nó DOM:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Cria uma ref para armazenar o elemento textInput do DOM
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitamente foca o input de texto usando a API do DOM diretamente
    // Nota: nós estamos acessando o campo "current" para obter um nó do DOM.
    this.textInput.current.focus();
  }

  render() {
    // Diz ao React que nós queremos associar o atributo ref do <input>
    // com o `textInput` que nós criamos no construtor.
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

O React irá atribuir a propriedade `current` ao elemento DOM quando o componente for montado, e atribuirá `null` de volta quando ele for desmontado. As atualizações da `ref` acontecem antes dos métodos de lifecycle `componentDidMount` ou `componentDidUpdate`.

#### Adicionando uma Ref a um Componente de Classe {#adding-a-ref-to-a-class-component}

Se nós quisermos envolver o `CustomTextInput` acima para para simulá-lo sendo clicado imediatamente após a montagem, nós poderiamos usar uma ref para obter acesso ao input customizado e chamar o seu método `focusTextInput` manualmente.

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Note que isso só funciona se o `CustomTextInput` é declarado como uma Classe:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refs e Componentes Funcionais {#refs-and-function-components}

Por padrão, **você não deve usar um atributo `ref` em componentes funcionais**, pois eles não possuem instâncias:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Isto *não* vai funcionar!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Se você quer permitir que pessoas passem a `ref` para seu componente de função, você pode usar [`forwardRef`](/docs/forwarding-refs.html) (possivelmente em conjunto com [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)) ou você pode converter o componente para classe.

Você pode, entretanto, **usar um atributo `ref` dentro de um componente funcional** contanto que você referencie um elemento DOM ou um componente de classe:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput deve ser declarado aqui para então a ref poder referenciá-lo.
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Expondo Refs do DOM para Componentes Pais {#exposing-dom-refs-to-parent-components}

Em raros casos, você pode querer ter acesso ao nó DOM do filho de um componente pai. Isso geralmente não é recomendado, pois quebra o encapsulamento do componente, mas isso pode ser ocasionalmente útil para engatilhar foco ou medir o tamanho ou a posição de um nó DOM filho.

Enquanto você poderia [adicionar uma ref a um componente filho](#adding-a-ref-to-a-class-component), esta não é a solução ideal, pois você obteria apenas uma instância do componente ao invés de um nó DOM. Adicionalmente, isto não funcionaria com componentes funcionais.

Se você usa o React 16.3 ou acima, nós recomendamos usar o [encaminhamento de refs](/docs/forwarding-refs.html) para estes casos. **Encaminhamento de Refs permitem que os componentes optem por expôr a referência de qualquer componente filho como próprias**. Você pode encontrar um exemplo detalhado de como expôr nó DOM de um componente filho para um componente pai na [documentação de encaminhamento de ref](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Se você usa React 16.2 ou abaixo, ou se você precisa de mais flexibilidade do que a fornecida pelo encaminhamento de ref, você pode usar [esta abordagem alternativa](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) e explicitamente passar uma ref como uma prop diferentemente nomeada.

Quando possível, desaconcelhamos a exposição de nós DOM, mas pode ser uma saída útil. Note que esta abordagem requer que você adicione algum código ao componente filho. Se você não tem controle absoluto sob a implementação do componente filho, a sua última opção é usar o [`findDOMNode()`](/docs/react-dom.html#finddomnode), mas isto é desencorajado e descontinuado no [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Refs com Callback {#callback-refs}

O React também dá suporte a outra forma de atribuír refs chamado "refs com callback", que dá um controle mais granular sob quando refs são atribuídas e desatribuídas.

Em vez de passar um atributo `ref` criado pelo `createRef()`, você passa uma função. A função recebe uma instância de um componente React ou um elemento DOM HTML como seu argumento, que pode ser armazenado e acessado em outro lugar.

O exemplo abaixo implementa um padrão comum: utilizar `ref` com callback para armazenar uma referência para um nó DOM em uma propriedade de instância.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Foca o input de texto usando a API DOM diretamente
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // auto-foca o input na montagem
    this.focusTextInput();
  }

  render() {
    // Utiliza a `ref` com callback para armazenar uma referência ao elemento DOM
    // do input de texto em um campo de instância (por exemplo, this.textInput)
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

O React vai chamar o callback da `ref` com o elemento DOM quando o componente for montado, e chamá-lo com `null` quando ele for desmontado. Refs são garantidos de estarem atualizados antes do `componentDidMount` ou `componentDidUpdate` serem disparados.

Você pode passar refs com callback entre componentes, assim como você faz com refs de objetos que foram criados com `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

No exemplo acima, `Parent` passa sua ref com callback como uma propriedade `inputRef` do `CustomTextInput`, e o `CustomTextInput` passa a mesma função como um atributo `ref` especial para o `<input>`. Como resultado, `this.inputElement` no `Parent` será atribuído para o nó DOM correspondente ao elemento `<input>` no `CustomTextInput`.

### API Legada: Refs String {#legacy-api-string-refs}

Se você trabalhou com React antes, você deve estar familiarizado com uma antiga API onde o atributo ref é uma string, como `"textInput"`, e o nó DOM é acessado como `this.refs.textInput`. Nós não aconselhamos isto, pois refs string [tem alguns problemas](https://github.com/facebook/react/pull/8333#issuecomment-271648615), são consideradas abandonadas, e **provávelmente serão removidas em um dos futuros releases**.

> Nota
>
> Se você está usando `this.refs.textInput` para acessar refs, nós recomendamos ao invés disso utilizar o [padrão de callback](#callback-refs) ou a [API `createRef`](#creating-refs).

### Ressalvas com Refs com callback {#caveats-with-callback-refs}

Se a `ref` com callback é definida como uma função inline, ela será chamada duas vezes durante as atualizações, primeiro com `null` e então novamente com o elemento DOM. Isto porquê uma nova instância da função é criada com cada renderização, então o React precisa limpar a referência antiga e atribuir a nova. Você pode evitar isso definindo a `ref` com callback como um método ligado a classe, mas note que isto não deveria importar na maioria dos casos.
