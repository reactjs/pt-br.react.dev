---
title: Avisos de Depreciação do react-test-renderer
---

<<<<<<< HEAD
## Aviso do ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}
=======
TODO: Update this for 19?

## ReactTestRenderer.create() warning {/*reacttestrenderercreate-warning*/}
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

O react-test-renderer está descontinuado. Um aviso será emitido sempre que ReactTestRenderer.create() ou ReactShallowRender.render() forem chamados. O pacote react-test-renderer permanecerá disponível no NPM, mas não será mantido e pode quebrar com novos recursos do React ou mudanças nos internos do React.

<<<<<<< HEAD
A equipe do React recomenda migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) para uma experiência de teste moderna e bem suportada.
=======
The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) for a modern and well supported testing experience.
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16


## Novo Aviso do ShallowRenderer() {/*new-shallowrenderer-warning*/}

<<<<<<< HEAD
O pacote react-test-renderer não exporta mais um shallow renderer em `react-test-renderer/shallow`. . Isto era simplesmente uma reembalagem de um pacote separado anteriormente extraído: `react-shallow-renderer`. Portanto, você pode continuar usando o shallow renderer da mesma maneira, instalando-o diretamente. Veja [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
=======
The react-test-renderer package no longer exports a shallow renderer at `react-test-renderer/shallow`. This was simply a repackaging of a previously extracted separate package: `react-shallow-renderer`. Therefore you can continue using the shallow renderer in the same way by installing it directly. See [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16
