---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Note:
>
> `React.PropTypes` foi movido para um pacote diferente desde a versão v15.5. do React. Por favor, use [the `prop-types` library agora](https://www.npmjs.com/package/prop-types).
>
>Nós fornecemos [um script de migração](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) para automatizar o processo.

Em releases futuras do React, o código que implementa a validação de PropType será removida. Uma vez isso acontecendo, qualquer código que contenha essas funções chamadas de forma manual irão emitir um erro.  

### Declarar PropTypes ainda é uma boa ideia {#declaring-proptypes-is-still-fine}

A forma normal de usar a PropTypes ainda é suportada:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Nada mudou por aqui.

### Não chame PropTypes diretamente {#dont-call-proptypes-directly}

Usar PropTypes de uma forma diferente que não seja a anotação dos componentes React não é mais suportado:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Não suportado
var error = apiShape(json, 'response');
```

Caso você dependa do uso  PropTypes dessa forma, encorajamos você a usar ou criar um fork da PropTypes (como [esses](https://github.com/aackerman/PropTypes) [dois](https://github.com/developit/proptypes) pacotes).

Se você não resolver esse  warning, Esse código não irá funcionar em produção com o React 16.

### Se você não chama PropTypes diretamente mas mesmo assim recebe esse warning {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Inspecione a stack trace produzida pelo warning. Você irá encontrar a definição do componente responsável pela chamada direta da PropTypes. Provavelmente, o problema é causado por uma PropTypes de terceiros que encapsula a PropTypes do React, por exemplo:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop ao invés disso'
  )
}
```

Nesse caso, `ThirdPartyPropTypes.deprecated` é um wrapper chamando `PropTypes.bool`. Esse padrão por si só já é o suficiente, mas dispara um falso positivo pelo fato do React pensar que está chamando diretamente a PropTypes. No próximo tópico, iremos explicar como resolver esse problema para a implementação de uma biblioteca, algo como `ThirdPartyPropTypes`. Caso não seja uma biblioteca que você escreveu, você pode abrir um issue por isso.

### Resolvendo o falso positivo em uma PropTypes de terceiro {#fixing-the-false-positive-in-third-party-proptypes}

Se você é o autor de uma biblioteca terceira com PropTypes e permite que seus usuários façam wrap de uma React PropTypes existente, provavelmente eles começarão a receber esse warning da sua biblioteca. Isso acontece porque o React não enxerga um último parâmetro "secreto" que passa a [detectar](https://github.com/facebook/react/pull/7132) manualmente as chamadas da PropTypes.

Aqui está como corrigir isso. Usaremos `deprecated` daqui [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) como exemplo. A atual implementação só passa adiante as `props`, `propName`, and `componentName` arguments:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Para resolver o falso positivo, tenha certeza que está passando **todos** os parâmetro para o wrapped da PropType. Um jeito fácil de fazer isso com ES6 é usando a notação `...rest`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Note ...rest here
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // and here
  };
}
```

Isso fará com que o warning pare de ser lançado.
