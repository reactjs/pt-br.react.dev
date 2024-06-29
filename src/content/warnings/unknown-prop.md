---
title: Aviso de Prop Desconhecida
---

O aviso de prop desconhecida será acionado se você tentar renderizar um elemento DOM com uma prop que não é reconhecida pelo React como um atributo/prop legal do DOM. Você deve garantir que seus elementos DOM não tenham props espúrias.

Existem algumas razões prováveis para esse aviso aparecer:

1. Você está usando `{...props}` ou `cloneElement(element, props)`? Ao copiar props para um componente filho, você deve garantir que não está acidentalmente encaminhando props que foram destinadas apenas para o componente pai. Veja correções comuns para esse problema abaixo.

2. Você está usando um atributo DOM não padrão em um nó DOM nativo, talvez para representar dados personalizados. Se você está tentando anexar dados personalizados a um elemento DOM padrão, considere usar um atributo de dados personalizado conforme descrito [no MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. O React ainda não reconhece o atributo que você especificou. Isso provavelmente será corrigido em uma versão futura do React. O React permitirá que você passe isso sem um aviso se você escrever o nome do atributo em minúsculas.

4. Você está usando um componente React sem maiúscula, por exemplo `<myButton />`. O React interpreta isso como uma tag do DOM porque a transformação JSX do React usa a convenção de maiúsculas vs. minúsculas para distinguir entre componentes definidos pelo usuário e tags do DOM. Para seus próprios componentes React, use PascalCase. Por exemplo, escreva `<MyButton />` em vez de `<myButton />`.

---

Se você receber esse aviso porque está passando props como `{...props}`, seu componente pai precisa "consumir" qualquer prop que seja destinada ao componente pai e não destinada ao componente filho. Exemplo:

**Ruim:** A prop `layout` inesperada é encaminhada para a tag `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // RUIM! Porque você sabe com certeza que "layout" não é uma prop que <div> entende.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // RUIM! Porque você sabe com certeza que "layout" não é uma prop que <div> entende.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Bom:** A sintaxe de espalhamento pode ser usada para retirar variáveis de props e colocar as props restantes em uma variável.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Bom:**  Você também pode atribuir as props a um novo objeto e excluir as chaves que você está usando do novo objeto. Certifique-se de não excluir as props do objeto original `this.props`, pois esse objeto deve ser considerado imutável.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
