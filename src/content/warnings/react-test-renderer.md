---
title: Avisos de Depreciação do react-test-renderer
---

<<<<<<< HEAD
TODO: Atualizar isso para 19?

## Aviso do ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}
=======
## ReactTestRenderer.create() warning {/*reacttestrenderercreate-warning*/}
>>>>>>> 65d297e93b36be5370e58ab7828d022c741ecbe2

O react-test-renderer está descontinuado. Um aviso será emitido sempre que ReactTestRenderer.create() ou ReactShallowRender.render() forem chamados. O pacote react-test-renderer permanecerá disponível no NPM, mas não será mantido e pode quebrar com novos recursos do React ou mudanças nos internos do React.

A equipe do React recomenda migrar seus testes para [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) para uma experiência de teste moderna e bem suportada.

## Novo Aviso do ShallowRenderer() {/*new-shallowrenderer-warning*/}

O pacote react-test-renderer não exporta mais um shallow renderer em `react-test-renderer/shallow`. Isso era simplesmente uma reembalagem de um pacote separado previamente extraído: `react-shallow-renderer`. Portanto, você pode continuar usando o shallow renderer da mesma forma instalando-o diretamente. Veja [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
