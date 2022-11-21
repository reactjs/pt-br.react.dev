---
title: Ferramenta de desenvolvedor do React
---

<Intro>

Use a ferramenta de desenvolvedor do React para inspecionar [componentes](/learn/your-first-component), editar [props](/learn/passing-props-to-a-component) e [estados](/learn/state-a-components-memory), e identificar problemas de performance.


</Intro>

<<<<<<< HEAD:beta/src/pages/learn/react-developer-tools.md
## Extensão do navegador {/*browser-extension*/}
=======
<YouWillLearn>

* How to install React Developer Tools

</YouWillLearn>

## Browser extension {/*browser-extension*/}
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/react-developer-tools.md

A forma mais fácil de depurar websites construídos com React é instalar a ferramenta de desenvolvedor do React no navegador. Ela está disponível para vários navegadores populares:

* [Instalar para **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Instalar para **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Instalar para **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

<<<<<<< HEAD:beta/src/pages/learn/react-developer-tools.md
Agora, se você visitar um website **construído com React**, você verá os painéis _Components_ e _Profiler_.
=======
Now, if you visit a website **built with React,** you will see the _Components_ and _Profiler_ panels.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/react-developer-tools.md

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
A ferramenta de desenvolvedor do React também pode ser usada para inspecionar aplicações construídas com [React Native](https://reactnative.dev/).

A forma mais fácil de usar a ferramenta de desenvolvedor do React é instalá-la globalmente:
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

A ferramenta deve conectar-se a qualquer aplicação React Native que esteja em execução de forma local.

> Tente recarregar a aplicação caso a ferramenta de desenvolvedor não se conecte após alguns segudos.

[Aprenda mais sobre como depurar aplicações React Native.](https://reactnative.dev/docs/debugging)
