---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

O aviso invalid-aria-prop irá disparar caso você tente renderizar um elemento do DOM com uma propriedade aria-* que não existe na Iniciativa para a Acessibilidade da Web (WAI) Aplicações Internet Ricas Acessiveis (ARIA) [especificação](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Caso você ache que está usando uma propriedade válida, verifique se escreveu ela corretamente. `aria-labelledby` e `aria-activedescendant` são muitas vezes escritas de forma incorreta.

2. O React não reconhece o atributo qe você especificou. Isso será corrigido em uma futura versão do React. No entanto, atualmente o React remove todos os atributos desconhecidos, logo ao especificar eles em sua aplicação React não fará com que eles sejam renderizados.