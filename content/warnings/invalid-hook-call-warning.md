---
title: Invalid Hook Call Warning
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

 Você provavelmente está aqui porque recebeu a seguinte mensagem de erro:

 > Hooks can only be called inside the body of a function component.

Existem três razões comuns pelas quais você pode estar vendo a mensagem:

1. Você pode ter **versões incompatíveis** do React e React DOM.
2. Você pode estar **quebrando as [Regras dos Hooks](/docs/hooks-rules.html)**.
3. Você pode ter **mais do que uma cópia do React** na mesma app.

Vamos olhar cada um destes casos.

## Versões incompatíveis do React e React DOM {#mismatching-versions-of-react-and-react-dom}

Você pode estar usando uma versão do `react-dom` (< 16.8.0) ou `react-native` (< 0.59) que ainda não suporta _Hooks_. Você pode executar o script `npm ls react-dom` ou `npm ls react-native` na pasta da sua aplicação para verificar qual versão esta usando. Se você encontrar mais do que uma delas, isto talvez pode também causar problemas (mais detalhes sobre isso abaixo).

## Quebrando as Regras dos Hooks {#breaking-the-rules-of-hooks}

Você pode somente chamar os _Hooks_ **enquanto o React renderiza um componente funcional**:

* ✅ Chame-os no nível superior do corpo de um componente funcional.
* ✅ Chame-os no nível superior do corpo de um [Hook customizado](/docs/hooks-custom.html).

**Aprenda mais sobre isto na [Regras dos Hooks](/docs/hooks-rules.html).**

```js{2-3,8-9}
function Counter() {
  // ✅ Bom: nível superior de um componente funcional
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bom: nível superior de um Hook customizado
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Para evitar confusão, **não** é suportado chamar Hooks em outros casos:

* 🔴 Não chame Hooks em componentes de classe.
* 🔴 Não chame em manipuladores de eventos.
* 🔴 Não chame Hooks dentro de funções passadas para `useMemo`, `useReducer`, ou `useEffect`.

Se você quebrar estas regras, poderá ver este erro.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Ruim: dentro de um manipulador de evento (para arrumar, mova-o para fora!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Ruim: dentro do useMemo (para arrumar, mova-o para fora!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Bad: dentro de um componente de classe
    useEffect(() => {})
    // ...
  }
}
```

Você pode usar o [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para capturar alguns desses erros.

>Nota
>
>[Hooks Customizados](/docs/hooks-custom.html) *podem* chamar outros Hooks (este é todo o seu propósito). Isso funciona porque Hooks customizados também devem ser chamados apenas enquanto um componente funcional estiver sendo renderizado.


## React Duplicado {#duplicate-react}

Para que os _Hooks_ funcionem, a importação do `react` no código da sua aplicação precisa ser resolvida no mesmo módulo que a importação do `react` de dentro do pacote do `react-dom`. 

Se estas importações do `react` resolverem para dois objetos exportados diferentes, você verá este alerta. Isso pode acontecer se você **acidentalmente acabar com duas cópias** do pacote `react`.

Se você usa o gerenciador de pacotes do Node, você pode executar este verificador na pasta do seu projeto:

    npm ls react

Se você ver mais do que um React, você precisará descobrir porquê isso acontece e corrigir a sua árvore de dependências. Por exemplo, talvez uma biblioteca que você está usando incorretamente especifique o `react` como uma dependência (ao invés de uma dependência de pares). Até que essa biblioteca seja arrumada, [a resolução do Yarn](https://yarnpkg.com/lang/pt-br/docs/selective-version-resolutions/) é uma possível solução alternativa.

Você pode tentar depurar este problema adicionando alguns logs e reiniciando seu servidor de desenvolvimento:

```js
// Adicione isto no node_modules/react-dom/index.js
window.React1 = require('react');

// Adicione isto no arquivo do seu componente
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Se ele imprimir `false` então você pode ter duas cópias do React e precisa descobrir porquê isso aconteceu. [Esta issue](https://github.com/facebook/react/issues/13991) inclue algumas razões comuns encontradas pela comunidade.

Este problema pode também aparecer quando você usa `npm link` ou um equivalente. Neste caso, seu _bundler_ pode "ver" duas cópias do React — um na pasta da aplicação e outro na pasta da sua biblioteca. Assumindo que `myapp` e `mylib` são pastas irmãs, uma possível resolução é executar o script `npm link ../myapp/node_modules/react` de dentro da `mylib`. Isto fará com que a biblioteca use a cópia do React da aplicação.

>Nota
>
>Em geral, o React suporta o uso de várias cópias independentes em uma página (por exemplo, se um aplicativo e um _widget_ de terceiros o usarem). Ele somente quebra se `require('react')` resolver diferentemente entre o componente e a cópia do `react-dom` que ele foi renderizado.

## Outros casos {#other-causes}

Se nada disso funcionar, por favor comente [nesta issue](https://github.com/facebook/react/issues/13991) e nós iremos tentar ajudar. Tente criar um pequeno exemplo que reproduza o problema — você poderá descobrir o problema enquanto estiver fazendo isso.
