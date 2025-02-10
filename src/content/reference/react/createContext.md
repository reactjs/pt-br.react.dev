---
title: createContext
---

<Intro>

`createContext` permite que você crie um [contexto](/learn/passing-data-deeply-with-context) que componentes podem fornecer ou consumir.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Invoque `createContext` fora de qualquer componente para criar um contexto.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `defaultValue`: O valor que você quer que o contexto tenha quando não há um provedor de contexto correspondente na árvore acima do componente que lê o contexto. Se você não tem um valor padrão significativo, especifique `null`. O valor padrão é um "último recurso" reserva. Ele é estático e nunca muda com o tempo. 

#### Retornos {/*returns*/}

`createContext` retorna um objeto de contexto.

**O objeto de contexto em si, não possui nenhuma informação.** Ele representa _qual_ contexto outros componentes irão consumir ou fornecer. Geralmente, você vai usar[`SomeContext.Provider`](#provider) em um componente acima para especificar um valor para o contexto, e invocar [`useContext(SomeContext)`](/reference/react/useContext) em componentes abaixo pra consumi-lo. O objeto de contexto possui algumas propriedades:

* `SomeContext.Provider` permite que você forneça o valor do contexto aos seus componentes.
* `SomeContext.Consumer` é uma alternativa raramanete usada como uma forma de consumir o valor de um contexto.

---

### `SomeContext.Provider` {/*provider*/}

Envolva seus componente em um provedor de contexto para especificar o valor desse contexto para todos os componentes dentro dele:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: O valor que você deseja passar para todos os componentes que estão consumindo esse contexto dentro deste provedor, não importa o quão profundo. O valor do contexto pode ser de qualquer tipo. Um componente invocando [`useContext(SomeContext)`](/reference/react/useContext) dentro do provedor recebe o `value` do provedor de contexto correspondente mais próximo acima dele.

---

### `SomeContext.Consumer` {/*consumer*/}

Antes do `useContext` existir, havia uma forma mais arcaica de consumir um contexto:

```js
function Button() {
  // 🟡 Jeito legado (não recomendado)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```
<<<<<<< HEAD
Apesar dessa forma mais antiga ainda funcionar, **códigos recém escritos devem consumir o contexto com [`useContext()`](/reference/react/useContext) ao invés disso:**
=======

Although this older way still works, **newly written code should read context with [`useContext()`](/reference/react/useContext) instead:**
>>>>>>> 91614a51a1be9078777bc337ba83fc62e606cc14

```js
function Button() {
  // ✅ Jeito recomendado
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Uma função. O React invocará a função que você passar com o valor do contexto atual determinado pelo mesmo algoritmo que o [`useContext()`](/reference/react/useContext) utiliza, e renderizará o resultado que você retornar dessa função. O React também irá re-executar essa função e atualizar a UI sempre que o contexto dos componentes pais mudar.

---

## Uso {/*usage*/}

### Criando um contexto {/*creating-context*/}

Contextos permitem [passar informação profundamente](/learn/passing-data-deeply-with-context) sem precisar passar props manualmente em cada nível.

Invoque `createContext` fora de qualquer componente para criar um ou mais contextos.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` retorna um <CodeStep step={1}>objeto de contexto</CodeStep>. Componentes podem consumir esse contexto passando-o para o hook [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Por padrão, os valores que receberão são os <CodeStep step={3}>valores padrão</CodeStep> que você especificou quando criava os contextos. Porém, por si só isso não é útil porque os valores padrão nunca mudam.

Contextos são úteis porque você pode **fornecer outros valores dinâmicos de seus componentes:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Agora o componente `Page` e qualquer componente dentro dele, não importa o quão profundo esteja, irão "ver" os valores do contexto passados. Se os valores do contexto mudarem, o React também irá re-renderizar os componentes que estão lendo o contexto.

[Leia mais sobre consumir e providenciar contexto e veja exemplos.](/reference/react/useContext)

---

### Importando e exportando contextos de um arquivo {/*importing-and-exporting-context-from-a-file*/}

Frequentemente, componentens em arquivos diferentes irão precisar acessar o mesmo contexto. É por isso que é comum declarar contextos em um arquivo separado. Então você pode usar o [`export` statement](https://developer.mozilla.org/pt-BR/docs/web/javascript/reference/statements/export) para tornar o contexto disponível para outros arquivos:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Componentes declarados em outros arquivos podem usar o [`import`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/import) para ler ou providenciar esse contexto:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```
Isso funciona de forma similar com a [importação e exportação de componentes.](/learn/importing-and-exporting-components)

---

## Resolução de problemas {/*troubleshooting*/}

### Não consigo encontrar uma forma de mudar o valor do contexto {/*i-cant-find-a-way-to-change-the-context-value*/}

Código como esse especifica o valor *padrão* do contexto:

```js
const ThemeContext = createContext('light');
```

Esse valor nunca muda. React só usa esse valor como um fallback (reserva) se ele não conseguir encontrar um provedor correspondente acima.

Para fazer o valor do contexto mudar com o tempo, [adicione estado e envolva os componentes em um provedor de contexto (context provider).](/reference/react/useContext#updating-data-passed-via-context)
