---
title: rules-of-hooks
---

<Intro>

Valida se os componentes e hooks seguem as [Regras dos Hooks](/reference/rules/rules-of-hooks).

</Intro>

## Detalhes da Regra {/*rule-details*/}

O React depende da ordem em que os hooks são chamados para preservar corretamente o estado entre as renderizações. Cada vez que seu componente é renderizado, o React espera que os mesmos hooks sejam chamados na mesma ordem. Quando os hooks são chamados condicionalmente ou em loops, o React perde o controle de qual estado corresponde a qual chamada de hook, levando a bugs como inconsistências de estado e erros de "Rendered fewer/more hooks than expected".

## Violações Comuns {/*common-violations*/}

Estes padrões violam as Regras dos Hooks:

- **Hooks em condições** (`if`/`else`, ternário, `&&`/`||`)
- **Hooks em loops** (`for`, `while`, `do-while`)
- **Hooks após retornos antecipados**
- **Hooks em callbacks/manipuladores de eventos**
- **Hooks em funções assíncronas**
- **Hooks em métodos de classe**
- **Hooks no nível do módulo**

<Note>

### Hook `use` {/*use-hook*/}

O hook `use` é diferente de outros hooks do React. Você pode chamá-lo condicionalmente e em loops:

```js
// ✅ `use` pode ser condicional
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use` pode estar em loops
for (const promise of promises) {
  results.push(use(promise));
}
```

No entanto, `use` ainda tem restrições:
- Não pode ser envolvido em try/catch
- Deve ser chamado dentro de um componente ou hook

Saiba mais: [Referência da API `use`](/reference/react/use)

</Note>

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ Hook em condição
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Hook após retorno antecipado
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Hook em callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` em try/catch
try {
  const data = use(promise);
} catch (e) {
  // tratamento de erro
}

// ❌ Hook no nível do módulo
const globalState = useState(0); // Fora do componente
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Hooks no nível superior
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use` pode ser condicional
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Quero buscar dados com base em alguma condição {/*conditional-data-fetching*/}

Você está tentando chamar `useEffect` condicionalmente:

```js
// ❌ Hook condicional
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

Chame o hook incondicionalmente, verifique a condição dentro dele:

```js
// ✅ Condição dentro do hook
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

Existem maneiras melhores de buscar dados do que em um `useEffect`. Considere usar TanStack Query, useSWR ou React Router 6.4+ para buscar dados. Essas soluções lidam com a deduplicação de requisições, cache de respostas e evitam "waterfalls" de rede.

Saiba mais: [Buscando Dados](/learn/synchronizing-with-effects#fetching-data)

</Note>

### Preciso de estados diferentes para cenários diferentes {/*conditional-state-initialization*/}

Você está tentando inicializar o estado condicionalmente:

```js
// ❌ Estado condicional
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

Sempre chame `useState`, defina o valor inicial condicionalmente:

```js
// ✅ Valor inicial condicional
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## Opções {/*options*/}

Você pode configurar hooks de efeito personalizados usando configurações compartilhadas do ESLint (disponíveis no `eslint-plugin-react-hooks` 6.1.1 e posterior):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Padrão Regex que corresponde a hooks personalizados que devem ser tratados como efeitos. Isso permite que `useEffectEvent` e funções de evento semelhantes sejam chamados a partir de seus hooks de efeito personalizados.

Esta configuração compartilhada é usada pelas regras `rules-of-hooks` e `exhaustive-deps`, garantindo um comportamento consistente em toda a verificação de linting relacionada a hooks.