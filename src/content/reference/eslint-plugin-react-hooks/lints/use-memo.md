---
title: use-memo
---

<Intro>

Valida que o hook `useMemo` é usado com um valor de retorno. Veja a [documentação do `useMemo`](/reference/react/useMemo) para mais informações.

</Intro>

## Detalhes da Regra {/*rule-details*/}

`useMemo` serve para computar e cachear valores custosos, não para efeitos colaterais. Sem um valor de retorno, `useMemo` retorna `undefined`, o que frustra seu propósito e provavelmente indica que você está usando o hook errado.

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Sem valor de retorno
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // Falta o retorno!
  }, [data]);

  return <div>{processed}</div>; // Sempre undefined
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Retorna valor computado
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## Solução de Problemas {/*troubleshooting*/}

### Preciso executar efeitos colaterais quando as dependências mudam {/*side-effects*/}

Você pode tentar usar `useMemo` para efeitos colaterais:

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Errado: Efeitos colaterais em useMemo
function Component({user}) {
  // Sem valor de retorno, apenas efeito colateral
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // Não atribuído a uma variável
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

Se o efeito colateral precisar acontecer em resposta a uma interação do usuário, é melhor colocar o efeito colateral junto ao evento:

```js
// ✅ Bom: Efeitos colaterais em manipuladores de eventos
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // Outra lógica de clique...
  };

  return <button onClick={handleClick}>Clique em mim</button>;
}
```

Se o efeito colateral sincroniza o estado do React com algum estado externo (ou vice-versa), use `useEffect`:

```js
// ✅ Bom: Sincronização em useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Tema atual: {theme}</div>;
}
```