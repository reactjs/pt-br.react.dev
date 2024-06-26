---
title: Aviso de Propriedade ARIA Inválida
---

Este aviso será disparado se você tentar renderizar um elemento DOM com uma propriedade `aria-*` prop que não existe na especificação de Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [especificação](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Se você acredita que está usando uma propriedade válida, verifique a ortografia cuidadosamente. `aria-labelledby` e `aria-activedescendant` são frequentemente escritos de forma incorreta.

2. Se você escreveu `aria-role`, talvez tenha pretendido dizer `role`.

3. Caso contrário, se você estiver na versão mais recente do React DOM e verificou que está usando um nome de propriedade válido listado na especificação ARIA, por favor, [relate um erro](https://github.com/facebook/react/issues/new/choose).
