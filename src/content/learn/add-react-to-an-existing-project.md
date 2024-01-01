---
title: Adicionar React a um Projeto Existente
---

<Intro>

Se você quer adicionar alguma interatividade ao seu projeto existente, você não precisa reescrevê-lo em React. Adicione React ao seu projeto existente e renderize componentes React interativos em qualquer lugar.

</Intro>

<Note>

**Você precisa instalar o [Node.js](https://nodejs.org/en/) para o desenvolvimento local.** Embora você possa [experimentar o React](/learn/installation#try-react) online ou com uma simples página HTML, realisticamente a maioria das ferramentas JavaScript que você vai querer usar para desenvolvimento requer o Node.js.

</Note>

## Usando o React para uma subrota inteira do seu site existente {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Digamos que você tenha um aplicativo da web existente em `example.com` construído com outra tecnologia de servidor (como Rails) e você deseja implementar todas as rotas iniciando em `example.com/some-app/` completamente com React.

Veja como recomendamos configurá-lo:

1. **Construa a parte React do seu aplicativo** usando um dos [frameworks baseados em React](/learn/start-a-new-react-project).
2. **Especifique `/some-app` como o *caminho base*** na configuração do seu framework (veja como: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configure seu servidor ou um proxy** para que todas as solicitações em `/some-app/` sejam tratadas pelo seu aplicativo React.

Isso garante que a parte React do seu aplicativo possa [se beneficiar das melhores práticas](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) embutidas nesses frameworks.

Muitos frameworks baseados em React são full stack e permitem que seu aplicativo React tire proveito do servidor. No entanto, você pode usar a mesma abordagem mesmo se não puder ou não quiser executar JavaScript no servidor. Nesse caso, exponha os HTML/CSS/JS exportados ([saída `next export`](https://nextjs.org/docs/advanced-features/static-html-export) para o Next.js, padrão para o Gatsby) em `/some-app/` em vez disso.

## Usando o React para uma parte da sua página existente {/*using-react-for-a-part-of-your-existing-page*/}

Digamos que você tenha uma página existente construída com outra tecnologia (seja uma tecnologia do servidor como Rails ou uma do cliente como Backbone) e deseje renderizar componentes React interativos em algum lugar dessa página. Essa é uma forma comum de integrar o React - na verdade, é assim que a maioria dos usos do React parecia na Meta por muitos anos!

Você pode fazer isso em duas etapas:

1. **Configure um ambiente JavaScript** que permita o uso da sintaxe [JSX](/learn/writing-markup-with-jsx), divida o seu código em módulos com a sintaxe [`import`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export) e utilize pacotes (por exemplo, React) do registro de pacotes [npm](https://www.npmjs.com/).
2. **Renderize seus componentes React** onde você deseja vê-los na página.

A abordagem exata depende da configuração existente da sua página, então vamos examinar alguns detalhes.

### Passo 1: Configure um ambiente JavaScript modular {/*step-1-set-up-a-modular-javascript-environment*/}

Um ambiente JavaScript modular permite que você escreva seus componentes React em arquivos individuais, em vez de escrever todo o seu código em um único arquivo. Também permite que você use todos os pacotes maravilhosos publicados por outros desenvolvedores no registro [npm](https://www.npmjs.com/)-- incluindo o próprio React! Como fazer isso depende da sua configuração existente:

* **Se o seu aplicativo já está dividido em arquivos que usam declarações `import`,** tente usar a configuração que você já tem. Verifique se escrever `<div />` no seu código JS causa um erro de sintaxe. Se causar um erro de sintaxe, você pode precisar [transformar seu código JavaScript com o Babel](https://babeljs.io/setup) e habilitar o [Babel React preset](https://babeljs.io/docs/babel-preset-react) para usar JSX.

* **Se o seu aplicativo não possui uma configuração existente para compilar módulos JavaScript,** configure-o com o [Vite](https://vitejs.dev/). A comunidade do Vite mantém [muitas integrações com frameworks backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), incluindo Rails, Django e Laravel. Se o seu framework backend não estiver listado, [siga este guia](https://vitejs.dev/guide/backend-integration.html) para integrar manualmente a construção do Vite com seu backend.

Para verificar se a sua configuração funciona, execute este comando na pasta do seu projeto:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Em seguida, adicione estas linhas de código no topo do seu arquivo JavaScript principal (que pode ser chamado de index.js ou main.js):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- O conteúdo existente da sua página (neste exemplo, ele é substituído) -->
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Limpar o conteúdo HTML existente
document.body.innerHTML = '<div id="app"></div>';

// Em vez disso, renderize seu componente React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Se todo o conteúdo da sua página foi substituído por um "Hello, world", tudo funcionou! Continue lendo.

<Note>

Integrar um ambiente JavaScript modular em um projeto existente pela primeira vez pode parecer intimidante, mas vale a pena! Se você ficar preso, experimente os nossos [recursos da comunidade](/community) ou o [Vite Chat](https://chat.vitejs.dev/).

</Note>

### Passo 2: Renderizar componentes React em qualquer lugar da página {/*step-2-render-react-components-anywhere-on-the-page*/}

No passo anterior, você colocou este código no topo do seu arquivo principal:

```js
import { createRoot } from 'react-dom/client';

// Limpar o conteúdo HTML existente
document.body.innerHTML = '<div id="app"></div>';

// Em vez disso, renderize seu componente React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Claro, você não quer realmente limpar o conteúdo HTML existente!

Apague este código.

Em vez disso, você provavelmente deseja renderizar seus componentes React em lugares específicos em seu HTML. Abra sua página HTML (ou os modelos do servidor que a geram) e adicione um identificador único [`id`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Global_attributes/id) a qualquer tag, por exemplo:

```html
<!-- ... em algum lugar no seu HTML. ... -->
<nav id="navigation"></nav>
<!-- ... mais html ... -->
```

Isso permite que você encontre aquele elemento HTML com [`document.getElementById`](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/getElementById) e o passe para [`createRoot`](/reference/react-dom/client/createRoot) para que você possa renderizar seu próprio componente React dentro dele:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Implemente de fato uma barra de navegação.
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Observe como o conteúdo HTML original de `index.html` é preservado, mas o seu próprio componente React `NavigationBar` agora aparece dentro do `<nav id="navigation" />` do seu HTML. Leia a documentação de uso do [`createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) para aprender mais sobre como renderizar componentes React dentro de uma página HTML existente.

Quando você adota o React em um projeto existente, é comum começar com pequenos componentes interativos (como botões) e, gradualmente, "subir de nível" até que eventualmente toda a sua página seja construída com React. Se você chegar a esse ponto, recomendamos migrar para [um framework React](/learn/start-a-new-react-project) imediatamente para aproveitar ao máximo o React.

## Usando o React Native em um aplicativo móvel nativo existente {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) também pode ser integrado incrementalmente em aplicativos nativos existentes. Se você possui um aplicativo nativo existente para Android (Java ou Kotlin) ou iOS (Objective-C ou Swift), [siga este guia](https://reactnative.dev/docs/integration-with-existing-apps) para adicionar uma tela React Native a ele.

