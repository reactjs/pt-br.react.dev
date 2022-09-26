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
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
