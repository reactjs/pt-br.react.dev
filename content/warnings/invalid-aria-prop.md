---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

O aviso invalid-aria-prop irá disparar caso você tente renderizar um elemento do DOM com uma propriedade aria-* que não existe na [especificação](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Caso você ache que está usando uma propriedade válida, verifique se escreveu ela corretamente. `aria-labelledby` e `aria-activedescendant` são muitas vezes escritas de forma incorreta.

<<<<<<< HEAD
2. O React não reconhece o atributo que você especificou. Isso será corrigido em uma futura versão do React. No entanto, atualmente o React remove todos os atributos desconhecidos, logo ao especificar eles em sua aplicação React não fará com que eles sejam renderizados.
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985
