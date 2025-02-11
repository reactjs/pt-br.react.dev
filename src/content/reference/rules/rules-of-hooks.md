---
title: Regras dos Hooks
---

<Intro>
Os Hooks são definidos usando funções JavaScript, mas representam um tipo especial de lógica de UI reutilizável com restrições sobre onde podem ser chamados.
</Intro>

<InlineToc />

---

##  Chame Hooks apenas no nível superior {/*only-call-hooks-at-the-top-level*/}

Funções cujos nomes começam com `use` são chamadas de [*Hooks*](/reference/react) no React.

**Não chame Hooks dentro de loops, condições, funções aninhadas ou blocos `try`/`catch`/`finally`.** Em vez disso, sempre use Hooks no nível superior da sua função React, antes de quaisquer retornos antecipados. Você só pode chamar Hooks enquanto o React estiver renderizando um componente de função:

* ✅ Chame-os no nível superior no corpo de um [componente de função](/learn/your-first-component).
* ✅ Chame-os no nível superior no corpo de um [Hook personalizado](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Bom: nível superior em um componente de função
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bom: nível superior em um Hook personalizado
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Não é **suportado** chamar Hooks (funções que começam com `use`) em quaisquer outros casos, por exemplo:

* 🔴 Não chame Hooks dentro de condições ou loops.
* 🔴 Não chame Hooks após uma declaração de `return` condicional.
* 🔴 Não chame Hooks em manipuladores de eventos.
* 🔴 Não chame Hooks em componentes de classe.
* 🔴 Não chame Hooks dentro de funções passadas para `useMemo`, `useReducer` ou `useEffect`.
* 🔴 Não chame Hooks dentro de blocos `try`/`catch`/`finally`.

Se você quebrar essas regras, pode ver esse erro.

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
  // 🔴 Ruim: após um return condicional (para corrigir, mova antes do return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Ruim: dentro de um manipulador de evento (para corrigir, mova para fora!)
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

function Bad() {
  try {
    // 🔴 Ruim: dentro de um bloco try/catch/finally (para corrigir, mova para fora!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Você pode usar o [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) para capturar esses erros.

<Note>

[Hooks personalizados](/learn/reusing-logic-with-custom-hooks) *podem* chamar outros Hooks (esse é todo o seu propósito). Isso funciona porque os Hooks personalizados também devem ser chamados apenas enquanto um componente de função está sendo renderizado.

</Note>

---

## Chame Hooks apenas de funções React {/*only-call-hooks-from-react-functions*/}

Não chame Hooks de funções JavaScript regulares. Em vez disso, você pode:

✅ Chamar Hooks de componentes de função React.  
✅ Chamar Hooks de [Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).  

Seguindo essa regra, você garante que toda a lógica com estado em um componente seja claramente visível a partir do seu código fonte.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Não é um componente ou Hook personalizado!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```