---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

O aviso invalid-aria-prop irá disparar caso você tente renderizar um elemento do DOM com uma propriedade aria-* que não existe na [especificação](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Caso você ache que está usando uma propriedade válida, verifique se escreveu ela corretamente. `aria-labelledby` e `aria-activedescendant` são muitas vezes escritas de forma incorreta.

2. Se você escreveu `aria-role`, você pode querer dizer `role`.

3. Caso contrário, se você estiver usando a versão mais recente do React DOM e tiver verificado que está usando um nome de propriedade válido listado na especificação ARIA, [reporte um bug](https://github.com/facebook/react /problemas/novo/escolher).
