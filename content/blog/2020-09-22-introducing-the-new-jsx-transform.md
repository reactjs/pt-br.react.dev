---
title: "Apresentando o novo JSX Transform"
author: [lunaruan]
---

<div class="scary">

> This blog site has been archived. Go to [react.dev/blog](https://react.dev/blog) to see the recent posts.

</div>

Embora o React 17 [não contenha novos recursos](/blog/2020/08/10/react-v17-rc.html), ele fornecerá suporte para uma nova versão do JSX Transform. Neste post, descreveremos o que é e como experimentá-lo.

## O Que é um JSX Transform? {#whats-a-jsx-transform}

Os navegadores não entendem JSX imediatamente, então a maioria dos usuários do React confia em um compilador como o Babel ou TypeScript para **transformar o código JSX em JavaScript regular**. Muitos toolkits pré-configurados como o Create React App ou Next.js também incluem um JSX Transform por baixo do capô.

Junto com a versão React 17, queríamos fazer algumas melhorias no JSX Transform, mas não queríamos quebrar as configurações existentes. É por isso que [trabalhamos com Babel](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154) para **oferecer uma versão nova e reescrita do JSX Transform** para pessoas que gostariam de atualizar.

Atualizar para a nova transformação é totalmente opcional, mas tem alguns benefícios:

* Com a nova transformação, você pode **usar JSX sem importar o React**.
* Dependendo de sua configuração, a saída compilada pode **melhorar ligeiramente o tamanho do pacote**.
* Isso permitirá melhorias futuras que **reduzem o número de conceitos** que você precisa para aprender React.

**Esta atualização não mudará a sintaxe JSX e não é necessária.** O antigo JSX Transform continuará funcionando normalmente e não há planos de remover o suporte para ele.


[React 17 RC](/blog/2020/08/10/react-v17-rc.html) já inclui suporte para a nova transformação, então experimente! Para facilitar a adoção **também adaptamos seu suporte** para React 16.14.0, React 15.7.0 e React 0.14.10. Você pode encontrar as instruções de atualização para diferentes ferramentas [abaixo](#how-to-upgrade-to-the-new-jsx-transform).

Agora, vamos examinar mais de perto as diferenças entre a velha e a nova transformação.

## O Que Há de Diferente na Nova Transformação? {#whats-different-in-the-new-transform}

Quando você usa JSX, o compilador o transforma em chamadas de função React que o navegador pode entender. **A antiga transformação JSX** transforma JSX em chamadas `React.createElement(...)`.

Por exemplo, digamos que seu código-fonte tenha a seguinte aparência:

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

Nos bastidores, a antiga transformação JSX o transforma em JavaScript regular:

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

>Nota
>
>**Seu código-font não precisa ser alterado de forma alguma.** Estamos descrevendo como a transformação JSX transforma seu código-fonte JSX no código JavaScript que um navegador pode entender.

No entanto, isso não é perfeito:

* Como JSX foi compilado em `React.createElement`, `React` precisa estar no escopo se você usasse JSX.
* Existe algumas [melhorias e simplificações de desempenho](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation) que `React.createElement` não permite.

Para resolver esses problemas, o React 17 apresenta dois novos pontos de entrada para o pacote React que devem ser usados apenas por compiladores como Babel e TypeScript. Em vez de transformar JSX em `React.createElement`, **a nova transformação JSX** importa automaticamente funções especiais desses novos pontos de entrada no pacote React e os chama.

Digamos que seu código-fonte tenha a seguinte aparência:

```js
function App() {
  return <h1>Hello World</h1>;
}
```

É para isso que a nova transformação JSX o compila:

```js
// Inserido por um compilador (não importe você mesmo!)
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

Observe como nosso código original **não precisava mais importar o React** para usar JSX! (Mas ainda precisaríamos importar o React para usar Hooks ou outras exportações que o React fornece.)

**Esta mudança é totalmente compatível com todo o código JSX existente**, assim você não terá que mudar seus componentes. Se estiver curioso, você pode verificar a [RFC técnica](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) para obter mais detalhes sobre como a nova transformação funciona.

> Nota
>
> As funções dentro de `react/jsx-runtime` e `react/jsx-dev-runtime` devem ser usadas apenas pela transformação do compilador. Se você precisa criar elementos manualmente em seu código, você deve continuar usando `React.createElement`. Ele continuará a funcionar e não irá embora.

## Como Fazer Upgrade para a Nova Transformação JSX {#how-to-upgrade-to-the-new-jsx-transform}

Se você não estiver pronto para atualizar para a nova transformação JSX ou se estiver usando JSX para outra biblioteca, não se preocupe. A transformação antiga não será removida e continuará a ter suporte.

Se quiser fazer upgrade, você precisará de duas coisas:

* **Uma versão do React que suporta a nova transformação** ([React 17 RC](/blog/2020/08/10/react-v17-rc.html) e superior suportam, mas também lançamos React 16.14.0, React 15.7.0 e React 0.14.10 para pessoas que ainda estão nas versões principais mais antigas).
* **Um compilador compatível** (consulte as instruções para diferentes ferramentas abaixo).

Como a nova transformação JSX não exige que o React esteja no escopo, [também preparamos um script automatizado](#removing-unused-react-imports) que removerá as importações desnecessárias de sua base de código.

### Create React App {#create-react-app}

Create React App [4.0.0](https://github.com/facebook/create-react-app/releases/tag/v4.0.0)+ usa a nova transformação para versões compatíveis do React.

### Next.js {#nextjs}

Next.js [v9.5.3](https://github.com/vercel/next.js/releases/tag/v9.5.3)+ usa a nova transformação para versões compatíveis do React.

### Gatsby {#gatsby}

Gatsby [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28)+ usa a nova transformação para versões compatíveis do React.

>Nota
>
>Se você obtiver [este erro de Gatsby](https://github.com/gatsbyjs/gatsby/issues/26979) após atualizar para React 17 RC, execute `npm update` para corrigi-lo.

### Configuração Manual do Babel {#manual-babel-setup}

O suporte para a nova transformação JSX está disponível no Babel [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) e superior.

Primeiro, você precisará atualizar para a última transformação do Babel e do plugin.

Se você estiver usando `@babel/plugin-transform-react-jsx`:

```bash
# para usuários npm
npm update @babel/core @babel/plugin-transform-react-jsx
```

```bash
# para usuários yarn
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
```

Se você estiver usando `@babel/preset-react`:

```bash
# para usuários npm
npm update @babel/core @babel/preset-react
```

```bash
# para usuários yarn
yarn upgrade @babel/core @babel/preset-react
```

Atualmente, a antiga transformação `{"runtime": "classic"}` é a opção padrão. Para habilitar a nova transformação, você pode passar `{"runtime": "automatic"}` como uma opção para `@babel/plugin-transform-react-jsx` ou `@babel/preset-react`:

```js
// Se você estiver usando @babel/preset-react
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

```js
// Se você estiver usando @babel/plugin-transform-react-jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
}
```

A partir do Babel 8, `"automatic"` será o tempo de execução padrão para ambos os plug-ins. Para obter mais informações, verifique a documentação do Babel para [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) e [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react).

> Nota
>
> Se você usar JSX com uma biblioteca diferente de React, você pode usar [a opção `importSource`](https://babeljs.io/docs/en/babel-preset-react#importsource) para importar dessa biblioteca - desde que forneça os pontos de entrada necessários. Como alternativa, você pode continuar usando a transformação clássica, que continuará a ser compatível.
>
> Se você é um autor de biblioteca e está implementando o ponto de entrada `/jsx-runtime` para sua biblioteca, tenha em mente que [há um caso](https://github.com/facebook/react/issues/20031#issuecomment-710346866) em que até mesmo a nova transformação tem que voltar para `createElement` para compatibilidade de versões anteriores. Nesse caso, ele irá importar automaticamente `createElement` diretamente do ponto de entrada *root* especificado por `importSource`.

### ESLint {#eslint}

Se você estiver usando [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), as regras de `react/jsx-uses-react` e `react/react-in-jsx-scope` não são mais necessárias e podem ser desativadas ou removidas.

```js
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript {#typescript}

TypeScript suporta a nova transformação JSX em [v4.1](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#jsx-factories).

### Flow {#flow}

Flow suporta a nova transformação JSX em [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) para cima, adicionando `react.runtime = automatic` às opções de configuração do Flow.

## Removendo Imports React não Utilizadas {#removing-unused-react-imports}

Como a nova transformação JSX importará automaticamente as funções `react/jsx-runtime` necessárias, o React não precisará mais estar no escopo quando você usar JSX. Isso pode levar a importação React não utilizadas em seu código. Não faz mal mantê-los, mas se quiser removê-los, recomendamos a execução de um script [“codemod”](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) para removê-los automaticamente:

```bash
cd your_project
npx react-codemod update-react-imports
```

>Nota
>
>Se você estiver recebendo errors ao executar o codemod, tente especificar um dialeto JavaScript diferente quando `npx react-codemod update-react-imports` solicitar que você escolha um. Em particular, neste momento, a configuração "JavaScript com Flow" suporta sintaxe mais recente do que a configuração "JavaScript", mesmo se você não usar o Flow. [Crie uma issue](https://github.com/reactjs/react-codemod/issues) se você tiver problemas.
>
>Lembre-se de que a saída do codemod nem sempre corresponderá ao estilo de codificação do seu projeto, então você pode querer executar [Prettier](https://prettier.io/) depois que o codemod terminar para uma formatação consistente.

Executar este codemod irá:

* Remover todas as importações React não utilizadas como resultado da atualização para a nova transformação JSX.
* Alterar todas as importações React padrão (ou seja, `import React from "react"`) para importações nomeadas desestruturadas (ex. `import { useState } from "react"`), que é o estilo preferido no futuro. Este codemod **não** afetará as importações de namespace existentes (ou seja, `import * as React from "react"`), que também é um estilo válido. As importações padrão continuarão funcionando no React 17, mas, a longo prazo, encorajamos nos afastar delas.

Por exemplo,

```js
import React from 'react';

function App() {
  return <h1>Olá Mundo</h1>;
}
```

será substituído por

```js
function App() {
  return <h1>Olá Mundo</h1>;
}
```

Se você usar alguma outra importação do React - por exemplo, um Hook - então o codemod irá convertê-lo em uma importação nomeada.

Por exemplo,

```js
import React from 'react';

function App() {
  const [text, setText] = React.useState('Olá Mundo');
  return <h1>{text}</h1>;
}
```

será substituído por

```js
import { useState } from 'react';

function App() {
  const [text, setText] = useState('Olá Mundo');
  return <h1>{text}</h1>;
}
```

Além de limpar as importações não utilizadas, isso também o ajudará a se preparar para uma versão principal futura do React (não do React 17), que oferecerá suporte aos Módulos ES e não terá uma exportação padrão.

## Obrigado {#thanks}

Gostaríamos de agradecer aos mantenedores de Babel, TypeScript, Create React App, Next.js, Gatsby, ESLint e Flow por sua ajuda na implementação e integração da nova transformação JSX. Também queremos agradecer à comunidade React por seus comentários e discussões sobre a [RFC técnica](https://github.com/reactjs/rfcs/pull/107).
