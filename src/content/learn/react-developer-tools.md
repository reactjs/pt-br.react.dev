---
title: Ferramenta de desenvolvedor do React
---

<Intro>

Use a ferramenta de desenvolvedor do React para inspecionar [componentes](/learn/your-first-component), editar [props](/learn/passing-props-to-a-component) e [estados](/learn/state-a-components-memory), e identificar problemas de performance.


</Intro>

<YouWillLearn>

* Como instalar React Developer Tools

</YouWillLearn>

## Extensão do navegador {/*browser-extension*/}

A forma mais fácil de depurar websites construídos com React é instalar a ferramenta de desenvolvedor do React no navegador. Ela está disponível para vários navegadores populares:

* [Instalar para **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Instalar para **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Instalar para **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Agora, se você visitar um website **construído com React**, você verá os painéis _Components_ e _Profiler_.

![Extensão de ferramenta de desenvolvedor do React](https://beta.reactjs.org/images/docs/react-devtools-extension.png)

### Safari e outros navegadores {/*safari-and-other-browsers*/}
Para outros navegadores (Safari, por exemplo), instale o pacote [`react-devtools`](https://www.npmjs.com/package/react-devtools):
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Em seguida, abra a ferramenta de desenvolvedor no terminal:
```bash
react-devtools
```

Em seguida, conecte seu website adicionando a seguinte tag `<script>` ao início do `<head>` de seu website.:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Agora recarregue seu website para que você possa ver a ferramenta de desenvolvedor.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}

Para inspecionar aplicativos construídos com [React Native](https://reactnative.dev/), você pode usar o [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), o depurador integrado que se integra profundamente com as Ferramentas de Desenvolvedor do React. Todos os recursos funcionam de forma idêntica à extensão do navegador, incluindo destaque e seleção de elementos nativos.

[Saiba mais sobre depuração no React Native.](https://reactnative.dev/docs/debugging)

> Para versões do React Native anteriores à 0.76, use a versão independente do React DevTools seguindo o guia [Safari e outros navegadores](#safari-and-other-browsers) acima.
