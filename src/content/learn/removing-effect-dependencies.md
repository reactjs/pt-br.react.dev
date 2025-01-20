---
title: 'Removendo Dependências de Efeito'
---

<Intro>

Quando você escreve um Efeito, o linter verificará se você incluiu todos os valores reativos (como props e state) que o Efeito lê na lista de dependências do seu Efeito. Isso garante que o seu Efeito permaneça sincronizado com as últimas props e state do seu componente. Dependências desnecessárias podem fazer com que o seu Efeito seja executado com muita frequência ou até mesmo criar um loop infinito. Siga este guia para revisar e remover dependências desnecessárias dos seus Efeitos.

</Intro>

<YouWillLearn>

- Como corrigir loops de dependência de Efeito infinitos
- O que fazer quando você quiser remover uma dependência
- Como ler um valor do seu Efeito sem "reagir" a ele
- Como e por que evitar dependências de objetos e funções
- Por que suprimir o linter de dependências é perigoso e o que fazer em vez disso

</YouWillLearn>

## As dependências devem corresponder ao código {/*dependencies-should-match-the-code*/}

Quando você escreve um Efeito, primeiro especifica como [começar e parar](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) o que quer que o seu Efeito esteja fazendo:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
    // ...
}
```

Então, se você deixar as dependências do Efeito vazias (`[]`), o l