---
title: useDebugValue
---

<Intro>

`useDebugValue` é um Hook do React que permite adicionar um rótulo a um Hook personalizado no [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Chame `useDebugValue` na raiz do seu [Hook personalizado](/learn/reusing-logic-with-custom-hooks) para exibir um valor de depuração legível:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `value`: O valor que você deseja exibir no React DevTools. Pode ter qualquer tipo.
* **opcional** `format`: Uma função de formatação. Quando o componente é inspecionado, o React DevTools chamará a função de formatação com o `value` como argumento e, em seguida, exibirá o valor formatado retornado (que pode ter qualquer tipo). Se você não especificar a função de formatação, o valor original `value` será exibido.

#### Retornos {/*returns*/}

`useDebugValue` não retorna nada.

## Uso {/*usage*/}

### Adicionando um rótulo a um Hook personalizado {/*adding-a-label-to-a-custom-hook*/}

Chame `useDebugValue` na raiz do seu [Hook personalizado](/learn/reusing-logic-with-custom-hooks) para exibir um <CodeStep step={1}>valor de depuração</CodeStep> legível para [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Isso fornece aos componentes que chamam `useOnlineStatus` um rótulo como `OnlineStatus: "Online"` quando você os inspeciona:

![Uma captura de tela do React DevTools mostrando o valor de depuração](/images/docs/react-devtools-usedebugvalue.png)

Sem a chamada `useDebugValue`, apenas os dados subjacentes (neste exemplo, `true`) seriam exibidos.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

Não adicione valores de depuração a todos os Hooks personalizados. É mais valioso para Hooks personalizados que fazem parte de bibliotecas compartilhadas e que têm uma estrutura de dados interna complexa que é difícil de inspecionar.

</Note>

---

### Adiando a formatação de um valor de depuração {/*deferring-formatting-of-a-debug-value*/}

Você também pode passar uma função de formatação como o segundo argumento para `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Sua função de formatação receberá o <CodeStep step={1}>valor de depuração</CodeStep> como parâmetro e deve retornar um <CodeStep step={2}>valor de exibição formatado</CodeStep>. Quando seu componente é inspecionado, o React DevTools chamará essa função e exibirá seu resultado.

Isso permite evitar executar lógica de formatação potencialmente cara, a menos que o componente seja realmente inspecionado. Por exemplo, se `date` for um valor Date, isso evita chamar `toDateString()` nele para cada renderização.