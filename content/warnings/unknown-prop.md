---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---

O aviso _unknown-prop_ (propriedade desconhecida) será disparado se você tentar renderizar um elemento DOM com a prop que não é reconhecida pelo React como um atributo/propriedade DOM válido. Você deve garantir que seus elementos DOM não tenham props falsas declaradas.

Existem algumas possíveis razões desses avisos aparecerem:


1. Você está usando `{...this.props}` ou `cloneElement(element, this.props)`? Seu componente está transferindo suas próprias props diretamente para um elemento filho (por exemplo. [transferindo props](/docs/transferring-props.html)). Quando transferir props para um elemento filho, você deve garantir que não está passando acidentalmente props que deveriam ser interpretadas pelo componente pai.

2. Você está usando um atributo DOM não padrão em um elemento DOM nativo, possivelmente para representar dados personalizados. Se você está tentando inserir um dado personalizado em um elemento padrão do DOM, considere usar um atributo data como descrito [em MDN](https://developer.mozilla.org/pt-BR/docs/Web/Guide/HTML/Using_data_attributes).

3. O React ainda não reconhece o atributo que você especificou. Isto provavelmente será corrigido em uma versão futura do React. Entretanto, o React atualmente retira todos os atributos desconhecidos, portanto especificá-los em seu aplicativo React não fará com que eles sejam renderizados.

4. Você está usando um componente React sem uma letra maiúscula. O React interpreta isso como uma tag DOM, porque [o React JSX usa letras maiúsculas e minúsculas para distinguir entre componentes definidos pelo usuário e tags DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Para corrigir isso, componentes compostos devem "consumir" qualquer prop destinada ao componente composto e não destinada ao componente filho. 
Exemplo:

**Ruim:** Inesperado, a prop `layout` é passada para a tag `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // RUIM! Porquê você tem certeza que "layout" não é uma prop que <div> entenda.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // RUIM! Porquê você tem certeza que "layout" não é uma prop que <div> entenda.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Bom:** O spread operator pode ser usado para extrair variáveis ​​de props e colocar os objetos restantes em uma variável.

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

**Bom:** Você também pode atribuir as props a um novo objeto e excluir as chaves que você está usando do novo objeto. Certifique-se de não excluir as props do objeto original `this.props`, já que esse objeto deve ser considerado imutável.

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
