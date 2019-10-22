---
id: uncontrolled-components
title: Componentes não controlados
permalink: docs/uncontrolled-components.html
---

Na maioria dos casos, recomendamos o uso de [componentes controlados](/docs/forms.html#controlled-components) para implementar formulários. Em um componente controlado, os dados de formulário são manipulados por um componente React. A alternativa são componentes não controlados, onde os dados de formulário são controlados pelo próprio DOM.

Para criar um componente não controlado, em vez de criar um manipulador de evento para cada atualização de estado, você pode [usar ref](/docs/refs-and-the-dom.html) para obter os valores do formulário do DOM.

Por exemplo, este código aceita um único nome em um componente não controlado:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Como um componente não controlado mantém a fonte de verdade no DOM, às vezes é mais fácil integrar código React e não React ao usar componentes não controlados. Também pode conter menos código se você quiser fazer gambiarra. Caso contrário, você geralmente deve usar componentes controlados.

Se ainda não estiver claro qual tipo de componente você deve usar para uma situação específica, você pode achar útil este [artigo sobre inputs controlados e não controlados](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

### Valores padrão {#default-values}

No ciclo de vida de renderização do React, o atributo `value` nos elementos de formulário substituirá o valor no DOM. Com um componente não controlado, você geralmente deseja que o React especifique o valor inicial, mas que deixa as atualizações subsequentes não controladas. Para lidar com esse tipo de caso, você pode especificar o atributo `defaultValue` em vez de `value`.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Da mesma forma, `<input type="checkbox">` e `<input type="radio">` suporta `defaultChecked`, e `<select>` e `<textarea>` suporta `defaultValue`.

## A Tag de input de arquivo {#the-file-input-tag}

Em HTML, um `<input type="file">` permite que o usuário escolha um ou mais arquivos do armazenamento do dispositivo para serem carregados em um servidor ou manipulados por JavaScript por meio da [API de arquivos](https://developer.mozilla.org/pt-BR/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

No React, um `<input type="file" />` é sempre um componente não controlado porque seu valor só pode ser definido por um usuário e não programaticamente

Você deve usar a API de arquivos para interagir com os arquivos. O exemplo a seguir mostra como criar um [ref no nó DOM](/docs/refs-and-the-dom.html) para acessar arquivo(s) em um manipulador de envio.

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)
