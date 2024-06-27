---
title: Regras dos Hooks
---

Provavelmente você está aqui porque recebeu a seguinte mensagem de erro:

<ConsoleBlock level="error">

Hooks só podem ser chamados dentro do corpo de um componente de função.

</ConsoleBlock>

Existem três razões comuns pelas quais você pode estar vendo isso:

1. Você pode estar **quebrando as Regras dos Hooks**.
2. Você pode ter **versões incompatíveis** do React e do React DOM.
3. Você pode ter **mais de uma cópia do React** no mesmo aplicativo.

Vamos analisar cada um desses casos.

## Quebrando as Regras dos Hooks {/*breaking-rules-of-hooks*/}

Funções cujos nomes começam com `use` são chamadas de [*Hooks*](/reference/react) no React.

**Não chame Hooks dentro de loops, condições ou funções aninhadas.** Em vez disso, sempre use Hooks no nível superior da sua função de componente React, antes de qualquer retorno antecipado. Você só pode chamar Hooks enquanto o React está renderizando um componente de função:

* ✅ Chame-os no nível superior no corpo de um [componente de função](/learn/your-first-component).
* ✅ Chame-os no nível superior no corpo de um [Hook personalizado](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Bom: no nível superior em um componente de função
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bom: no nível superior em um Hook personalizado
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

**Não** é suportado chamar Hooks (funções começando com `use`) em outros casos, por exemplo:

* 🔴 Não chame Hooks dentro de condições ou loops.
* 🔴 Não chame Hooks após uma instrução de `return` condicional.
* 🔴 Não chame Hooks em manipuladores de eventos.
* 🔴 Não chame Hooks em componentes de classe.
* 🔴 Não chame Hooks dentro de funções passadas para `useMemo`, `useReducer`, ou `useEffect`.

Se você quebrar essas regras, poderá ver esse erro.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Ruim: dentro de uma condição (para corrigir, mova para fora!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Ruim: dentro de um loop (para corrigir, mova para fora!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Ruim: após um retorno condicional (para corrigir, mova para antes do retorno!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Ruim: dentro de um manipulador de eventos (para corrigir, mova para fora!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Ruim: dentro de useMemo (para corrigir, mova para fora!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Ruim: dentro de um componente de classe (para corrigir, escreva um componente de função em vez de uma classe!)
    useEffect(() => {})
    // ...
  }
}
```

Você pode usar o [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para detectar esses erros.

<Note>

[Hooks personalizados](/learn/reusing-logic-with-custom-hooks) *podem* chamar outros Hooks (essa é a finalidade deles). Isso funciona porque Hooks personalizados também devem ser chamados apenas enquanto um componente de função está sendo renderizado.

</Note>

## Versões Incompatíveis do React e React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Você pode estar usando uma versão do `react-dom` (< 16.8.0) ou `react-native` (< 0.59) que ainda não suporta Hooks. Você pode executar `npm ls react-dom` ou `npm ls react-native` na pasta do seu aplicativo para verificar qual versão está usando. Se encontrar mais de uma, isso também pode criar problemas (mais sobre isso abaixo).

## Cópia Duplicada do React {/*duplicate-react*/}

Para que os Hooks funcionem, a importação de `react` no código da sua aplicação precisa ser resolvida para o mesmo módulo que a importação de `react` dentro do pacote `react-dom`.

Se essas importações de `react` forem resolvidas para dois objetos de exportação diferentes, você verá este aviso. Isso pode acontecer se você **acidentalmente acabar** com duas cópias do pacote `react`.

Se você usar Node para gerenciamento de pacotes, pode executar esta verificação na sua pasta de projeto:

<TerminalBlock>

npm ls react

</TerminalBlock>

Se você ver mais de um React, precisará descobrir por que isso acontece e corrigir sua árvore de dependências. Por exemplo, talvez uma biblioteca que você está usando especifica incorretamente  `react`  como uma dependência (em vez de uma dependência peer). Até que essa biblioteca seja corrigida, [resoluções do Yarn](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) são uma possível solução alternativa.

Você também pode tentar depurar este problema adicionando alguns logs e reiniciando seu servidor de desenvolvimento:

```js
// Adicione isso em node_modules/react-dom/index.js
window.React1 = require('react');

// Adicione isso no seu arquivo de componente
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Se imprimir `false` então você pode ter dois Reacts e precisa descobrir por que isso aconteceu. [Este problema](https://github.com/facebook/react/issues/13991) inclui algumas razões comuns encontradas pela comunidade.

Esse problema também pode ocorrer quando você usa `npm link` ou equivalente. Nesse caso, seu bundler pode "ver" dois Reacts — um na pasta da aplicação e outro na pasta da sua biblioteca. Supondo que `myapp` e `mylib` sejam pastas irmãs, uma possível correção é executar `npm link ../myapp/node_modules/react` a partir de `mylib`. Isso deve fazer com que a biblioteca use a cópia do React da aplicação.

<Note>

Em geral, o React suporta o uso de várias cópias independentes em uma página (por exemplo, se um aplicativo e um widget de terceiros usarem). Ele só quebra se `require('react')` for resolvido de maneira diferente entre o componente e a cópia do `react-dom` com a qual foi renderizado.

</Note>

## Outras Causas {/*other-causes*/}

Se nada disso funcionou, por favor comente neste [problema](https://github.com/facebook/react/issues/13991) e tentaremos ajudar. Tente criar um pequeno exemplo reproduzível — você pode descobrir o problema enquanto faz isso.
