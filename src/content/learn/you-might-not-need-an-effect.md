---
title: 'Talvez você não precise de um Effect'
---

<Intro>

Effects são um escape do paradigma do React. Eles te permitem "dar um passo para fora" do React e sincronizar seus componentes com algum serviço externo, como um widget não React, a rede ou o DOM do navegador. Se não houver nenhum sistema externo envolvido (por exemplo, se você quiser atualizar o estado de um componente quando algumas props ou estado mudarem), você não deveria precisar de um Effect. Remover Effects desnecessários tornará seu código mais compreensível, mais rápido de executar e menos propenso a erros.

</Intro>

<YouWillLearn>

* Por que e como remover Effects desnecessários dos seus componentes
* Como fazer cache de operações custosas sem Effects
* Como redefinir e ajustar o estado de um componente sem Effects
* Como compartilhar lógica entre event handlers
* Qual lógica deve ser movida para event handlers
* Como notificar componentes pais sobre mudanças

</YouWillLearn>

## Como remover Effects desnecessários {/*how-to-remove-unnecessary-effects*/}

Existem dois casos comuns em que você não precisa de Effects:

* **Você não precisa de Effects para manipular seus dados para renderização.** Por exemplo, digamos que você queira filtrar uma lista antes de exibi-la. Você pode ficar tentado a escrever um Effect que atualiza uma variável de estado quando a lista for alterada. No entanto, isso é ineficiente. Quando você atualizar o estado, o React primeiro executará as funções dos componentes para calcular o que deve estar em tela. Em seguida, o React ["aplica"](/learn/render-and-commit) essas alterações no DOM, atualizando a tela. Depois, o React executará seus Effects. Se seu Effect *também* atualizar o estado imediatamente, todo o processo será reiniciado do zero! Para evitar renderizações desnecessárias, transforme todos os dados no top level de seus componentes. Esse código será reexecutado automaticamente sempre que suas props ou estado forem alterados.
* **Você não precisa de Effects para lidar com eventos do usuário.** Por exemplo, digamos que você queira enviar uma requisição POST para `/api/buy` e mostrar uma notificação quando o usuário comprar um produto. No event handler de click do botão Comprar, você sabe exatamente o que aconteceu. Quando um Effect é executado, você não sabe *o que* o usuário fez (por exemplo, em qual botão foi clicado). É por isso que você normalmente tratará os eventos do usuário nos event handlers correspondentes.

Você precisa *realmente* de Effects para [sincronizar](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) com sistemas externos. Por exemplo, você pode escrever um Effect que mantenha um widget jQuery sincronizado com o estado do React. Também é possível buscar dados com Effects: por exemplo, você pode sincronizar os resultados da pesquisa com o termo que você pesquisou. Lembre-se de que [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) modernos oferecem mecanismos internos de data fetching mais eficientes do que escrever Effects diretamente em seus componentes.

Para ajudá-lo a adquirir a intuição correta, vamos dar uma olhada em alguns exemplos concretos comuns!

### Atualizar o estado baseado em props ou estado {/*updating-state-based-on-props-or-state*/}

Suponha que você tenha um componente com duas variáveis de estado: `firstName` e `lastName`. Você quer calcular o `fullName` concatenando os dois. Além disso, você gostaria que o `fullName` atualizasse sempre que o `firstName` ou `lastName` mudassem. Seu primeiro instinto pode ser adicionar uma variável de estado `fullName` e atualizá-la num Effect:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Evitar: estado redundante e Effect desnecessário
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Isso é mais complicado que o necessário. É ineficente também: isso faz uma renderização inteira com um valor desatualizado de `fullName`, e depois imediatamente re-renderiza com o valor atualizado. Remova a variável de estado e o Effect:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Bom: calculado durante renderização
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Quando algo pode ser calculado a partir de props ou estado, [não o coloque em um estado.](/learn/choosing-the-state-structure#avoid-redundant-state) Em vez disso, calcule durante a renderização.**  Isso torna seu código mais rápido (você evita "cascatear" atualizações extras), simples (você remove algum código), e menos propenso a erros (você evita bugs causados por diferentes variáveis de estado ficando desatualizadas entre si). Se essa abordagem parece nova para você, [Pensando em React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) explica o que deve ser um estado.

### Fazer cache de cálculos custosos {/*caching-expensive-calculations*/}

Esse componente calcula `visibleTodos` pegando os `todos` que recebe via props e filtrando eles de acordo com com a prop `filter`. Você pode se sentir tentado a armazenar o resultado em um estado e atualizar ele com um Effect:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Evitar: estado redundante e Effect desnecessário
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Como no exemplo anterior, isso é desnecessário e ineficiente. Primeiro, remova o estado e o Effect:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Isso é bom se getFilteredTodos() não for lento.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Geralmente, esse código está bom! Mas talvez `getFilteredTodos()` é lento ou você tem muitos `todos`.  Nesse caso, você não quer recalcular `getFilteredTodos()` se alguma variável de estado não relacionada como `newTodo` mudou.

Você pode fazer cache (ou ["memoizar"](https://en.wikipedia.org/wiki/Memoization)) um cálculo custoso envolvendo-o num Hook [`useMemo`](/reference/react/useMemo):

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Não re-executa a não ser que `todos` ou `filter` mudem
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Ou, escrito numa linha só:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Não re-executa getFilteredTodos() a não ser que `todos` ou `filter` mudem
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Isso diz ao React que você não quer que a função de dentro seja re-executada a não ser que `todos` ou `filter` tenham mudado.** O React se lembra do retorno de `getFilteredTodos()` durante a renderização inicial. Durante as próximas renderizações, ele vai checar se `todos` ou `filter` são diferentes. Se eles são o mesmo da última vez, `useMemo` vai retornar o último valor salvo. Mas se forem diferentes, o React vai executar a função de dentro novamente (e armazenar seu resultado).

A função envolvida no [`useMemo`](/reference/react/useMemo) executa durante a renderização, então apenas funciona para [cálculos puros.](/learn/keeping-components-pure)

<DeepDive>

#### Como dizer se um cálculo é custoso? {/*how-to-tell-if-a-calculation-is-expensive*/}

Em geral, a menos que você esteja criando ou fazendo looping em milhares de objetos, provavelmente não é uma operação custosa. Se quiser ter mais confiança, você pode adicionar um console log para medir o tempo gasto em um trecho de código:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Realize a interação que está medindo (por exemplo, digitar no input). Em seguida, você verá logs como `filter array: 0.15ms` no seu console. Se o tempo total registrado somar um valor significativo (digamos, `1ms` ou mais), talvez faça sentido memoizar esse cálculo. Como um experimento, você pode então envolver o cálculo em um `useMemo` para verificar se o tempo total registrado diminuiu ou não para essa interação:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Ignorado se `todos` e `filter` não tiverem sido alterados
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` não fará com que a *primeira* renderização seja mais rápida. Ele só ajuda a evitar trabalho desnecessário nas atualizações.

Lembre-se de que seu computador provavelmente é mais rápido do que o dos seus usuários, portanto, é uma boa ideia testar o desempenho com uma lentidão artificial. Por exemplo, o Chrome oferece uma opção de [Throttling de CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) para isso.

Observe também que medir o desempenho no desenvolvimento não fornecerá os resultados mais precisos. (Por exemplo, quando o [Strict Mode](/reference/react/StrictMode)  estiver ativado, você verá cada componente ser renderizado duas vezes em vez de uma). Para obter os tempos mais precisos, faça uma build de produção de seu app e teste-o em um dispositivo parecido com o de seus usuários.

</DeepDive>

### Redefinir todo o estados quando uma prop é modificada {/*resetting-all-state-when-a-prop-changes*/}

Esse componente `ProfilePage` recebe uma propriedade `userId`. A página contém um input de comentário e você usa uma variável de estado `comment` para manter seu valor. Um dia, você percebeu um problema: quando você navega de um perfil para outro, o estado `comment` não é redefinido. Como resultado, é fácil publicar acidentalmente um comentário no perfil de um usuário errado. Para corrigir o problema, você deseja limpar a variável de estado `comment` sempre que o `userId` for alterado:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Evitar: Redefinir o estado na mudança de prop em um Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Isso é ineficiente porque a `ProfilePage` e seus filhos serão renderizados primeiro com o valor desatualizado e, em seguida, renderizados novamente. Também é complicado porque você precisaria fazer isso em *todos* os componentes que têm algum estado dentro de `ProfilePage`. Por exemplo, se a interface do usuário de comentários estiver aninhada, você também deverá limpar o estado dos comentários aninhados.

Em vez disso, você pode dizer ao React que o perfil de cada usuário é conceitualmente um perfil _diferente_, fornecendo a ele uma chave explícita. Divida seu componente em dois e passe um atributo `key` do componente externo para o interno:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Este e qualquer outro estado abaixo serão redefinidos automaticamente na mudança de chave
  const [comment, setComment] = useState('');
  // ...
}
```

Normalmente, o React preserva o estado quando o mesmo componente é renderizado no mesmo local. **Ao passar `userId` como `key` para o componente `Profile`, você está pedindo ao React para tratar dois componentes `Profile` com `userId` diferentes como dois componentes diferentes que não devem compartilhar nenhum estado.** Sempre que a chave (que você definiu como `userId`) mudar, o React irá recriar o DOM e [redefinir o estado](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) do componente `Profile` e todos os seus filhos. Agora o campo `comment` será apagado automaticamente ao navegar entre os perfis.

Observe que, neste exemplo, somente o componente externo `ProfilePage` é exportado e visível para outros arquivos do projeto. Os componentes que renderizam o `ProfilePage` não precisam passar a chave para ele: eles passam o `userId` como uma propriedade normal. O fato de `ProfilePage` passar a chave para o componente `Profile` interno é um detalhe de implementação.


### Ajustando algum estado quando uma prop é alterada {/*adjusting-some-state-when-a-prop-changes*/}

Às vezes, você pode querer redefinir ou ajustar uma parte do estado em uma alteração de prop, mas não todo ele.

Esse componente `List` recebe uma lista de `items` como uma prop e mantém o item selecionado na variável de estado `selection`. Você deseja redefinir a `selection` para `null` sempre que a prop `items` receber um array diferente:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Evite: Ajustar o estado na mudança de prop em um Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Isso também não é ideal. Toda vez que os `items` mudarem, a `List` e seus componentes filhos serão renderizados com um valor `selection` desatualizado no início. Em seguida, o React atualizará o DOM e executará os Effects. Por fim, a chamada `setSelection(null)` causará outra re-renderização da `List` e de seus componentes filhos, reiniciando todo o processo novamente.

Comece excluindo o Effect. Em vez disso, ajuste o estado diretamente durante a renderização:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Melhor: Ajustar o estado durante a renderização
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Armazenar informações de renderizações anteriores](/reference/react/useState#storing-information-from-previous-renders) dessa maneira pode ser difícil de entender, mas é melhor do que atualizar o mesmo estado em um Effect. No exemplo acima, `setSelection` é chamado diretamente durante uma renderização. O React irá re-renderizar a `List` *imediatamente* após sair com uma instrução `return`. O React ainda não renderizou os filhos da `List` ou atualizou o DOM, então isso permite que os filhos da `List` pulem a renderização do valor obsoleto da `selection`.

Quando você atualiza um componente durante a renderização, o React joga fora o JSX retornado e imediatamente reinicia a renderização. Para evitar repetições em cascata muito lentas, o React só permite que você atualize o estado do *mesmo* componente durante uma renderização. Se você atualizar o estado de outro componente durante uma renderização, verá um erro. Uma condição como `items !== prevItems` é necessária para evitar loops. Você pode ajustar o estado dessa forma, mas quaisquer outros efeitos colaterais (como alterar o DOM ou definir timeouts) devem ficar em event handlers ou Effects para [manter os componentes puros](/learn/keeping-components-pure).

**Embora esse padrão seja mais eficiente do que um Effect, a maioria dos componentes também não deve precisar dele.** Não importa como você o faça, o ajuste do estado com base em props ou outro estado torna o fluxo de dados mais difícil de entender e depurar. Sempre verifique se, em vez disso, você pode [redefinir todo o estado com uma chave](#resetting-all-state-when-a-prop-changes) ou [calcular tudo durante a renderização](#updating-state-based-on-props-or-state). Por exemplo, em vez de armazenar (e redefinir) o *item* selecionado, você pode armazenar o *ID do item selecionado:*

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Melhor: calcular tudo durante a renderização
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Agora não há necessidade de "ajustar" o estado. Se o item com o ID selecionado estiver na lista, ele permanecerá selecionado. Se não estiver, a `selection` calculada durante a renderização será `null` porque nenhum item correspondente foi encontrado. Esse comportamento é diferente, mas indiscutivelmente melhor porque a maioria das alterações nos `items` preserva a seleção.

### Compartilhamento de lógica entre manipuladores de eventos {/*sharing-logic-between-event-handlers*/}

Digamos que você tenha uma página de produto com dois botões (Buy e Checkout) que permitem que você compre o produto. Você deseja exibir uma notificação sempre que o usuário colocar o produto no carrinho. Chamar `showNotification()` nos handlers de cliques dos dois botões parece repetitivo, portanto, você pode se sentir tentado a colocar essa lógica em um Effect:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Evitar: Lógica específica do evento dentro de um Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Esse Effect é desnecessário. Ele também provavelmente causará bugs. Por exemplo, digamos que seu aplicativo "lembre" o carrinho de compras entre os recarregamentos da página. Se você adicionar um produto ao carrinho uma vez e atualizar a página, a notificação aparecerá novamente. Ela continuará aparecendo toda vez que você atualizar a página desse produto. Isso ocorre porque `product.isInCart` já será `true` no carregamento da página, de modo que o Effect acima chamará `showNotification()`.

**Quando não tiver certeza se algum código deve estar em um Effect ou em um manipulador de eventos, pergunte a si mesmo *por que* esse código precisa ser executado. Use Effects somente para códigos que devem ser executados *porque* o componente foi exibido ao usuário.** Neste exemplo, a notificação deve aparecer porque o usuário *pressionou o botão*, não porque a página foi exibida! Exclua o Effect e coloque a lógica compartilhada em uma função chamada de ambos os manipuladores de eventos:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Bom: A lógica específica do evento é chamada pelos event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Isso remove o Effect desnecessário e corrige o bug.

### Enviando uma solicitação POST {/*sending-a-post-request*/}

Esse componente `Form` envia dois tipos de solicitações POST. Ele envia um evento de analytics quando é montado. Quando você preencher o formulário e clicar no botão Submit, ele enviará uma solicitação POST para o endpoint `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Bom: Essa lógica deve ser executada porque o componente foi exibido
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Evitar: Lógica específica do evento dentro de um Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Vamos aplicar os mesmos critérios do exemplo anterior.

A solicitação POST de análise deve permanecer em um Effect. Isso ocorre porque o _motivo_ para enviar o evento de análise é que o formulário foi exibido. (Ele seria disparado duas vezes no desenvolvimento, mas [veja aqui](/learn/synchronizing-with-effects#enviar-análises) para saber como lidar com isso).

No entanto, a solicitação POST `/api/register` não é causada pelo formulário que está sendo _exibido_. Você só deseja enviar a solicitação em um momento específico: quando o usuário pressiona o botão. Isso só deve acontecer _naquela interação específica_. Exclua o segundo Effect e mova essa solicitação POST para o event handler:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Bom: Essa lógica é executada porque o componente foi exibido
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Bom: A lógica específica do evento está no event handler.
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Ao decidir se deve colocar alguma lógica em um event handler ou em um Effect, a principal pergunta que precisa ser respondida é _que tipo de lógica_ ela é da perspectiva do usuário. Se essa lógica for causada por uma interação específica, mantenha-a no event handler. Se for causada pelo fato de o usuário _ver_ o componente na tela, mantenha-a no Effect.

### Cadeias de processamentos {/*chains-of-computations*/}

Às vezes, você pode se sentir tentado a encadear Effects que ajustam uma parte do estado com base em outro estado:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Evitar: Cadeias de Effects que ajustam o estado apenas para acionar uns aos outros
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Há dois problemas com esse código.

Um problema é que ele é muito ineficiente: o componente (e seus filhos) precisa ser renderizado novamente entre cada chamada `set` na cadeia. No exemplo acima, na pior das hipóteses (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render), há três re-renderizações desnecessárias da árvore abaixo.

Mesmo que isso não fosse lento, à medida que seu código evolui, você se depara com casos em que a "cadeia" que você escreveu não atende aos novos requisitos. Imagine que você esteja adicionando uma maneira de percorrer o histórico dos movimentos do jogo. Você faria isso atualizando cada variável de estado para um valor do passado. Entretanto, definir o estado `card` como um valor do passado acionaria a cadeia de Effects novamente e alteraria os dados que você está mostrando. Esse tipo de código costuma ser rígido e frágil.

Nesse caso, é melhor calcular o que for possível durante a renderização e ajustar o estado no event handler:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calcular o que puder durante a renderização
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calcular todo o próximo estado no event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Isso é muito mais eficiente. Além disso, se você implementar uma maneira de visualizar o histórico do jogo, agora poderá definir cada variável de estado para um movimento do passado sem acionar a cadeia de Effects que ajusta todos os outros valores. Se precisar reutilizar a lógica entre vários manipuladores de eventos, você poderá [extrair uma função](#sharing-logic-between-event-handlers) e chamá-la a partir desses manipuladores.

Lembre-se de que, dentro dos event handlers, [o estado se comporta como uma snapshot](/learn/state-as-a-snapshot). Por exemplo, mesmo depois de chamar `setRound(round + 1)`, a variável `round` refletirá o valor no momento em que o usuário clicou no botão. Se você precisar usar o próximo valor para cálculos, defina-o manualmente como `const nextRound = round + 1`.

Em alguns casos, você *não pode* calcular o próximo estado diretamente no event handler. Por exemplo, imagine um formulário com vários dropdowns em que as opções do próximo dropdown dependem do valor selecionado do dropdown anterior. Nesse caso, uma cadeia de Effects é apropriada porque você está sincronizando com a rede.

### Inicialização do aplicativo {/*initializing-the-application*/}

Algumas lógicas devem ser executadas apenas uma vez quando o aplicativo for carregado.

Você pode se sentir tentado a colocá-la em um Effect no componente mais alto da árvore:

```js {2-6}
function App() {
  // 🔴 Evitar: Effects com lógica que devem ser executados apenas uma vez
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

No entanto, você descobrirá rapidamente que ele [é executado duas vezes no desenvolvimento.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Isso pode causar problemas - por exemplo, talvez ele invalide o token de autenticação porque a função não foi projetada para ser chamada duas vezes. Em geral, seus componentes devem ser resistentes à remontagem. Isso inclui seu componente `App` de nível superior.

Embora talvez ele nunca seja remontado na prática em produção, seguir as mesmas restrições em todos os componentes facilita a movimentação e a reutilização do código. Se alguma lógica precisar ser executada *uma vez por carregamento de aplicativo* em vez de *uma vez por montagem de componente*, adicione uma variável no nível mais alto para registrar se ela já foi executada:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Só é executado uma vez por execução do aplicativo
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Você também pode executá-lo durante a inicialização do módulo e antes de o aplicativo ser renderizado:

```js {1,5}
if (typeof window !== 'undefined') { // Verifica se estamos executando no navegador.
   // ✅ Só é executado uma vez por execução do aplicativo
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

O código no nível mais alto é executado uma vez quando o componente é importado, mesmo que ele não seja renderizado. Para evitar lentidão ou comportamento inesperado ao importar componentes arbitrários, não use esse padrão em excesso. Mantenha a lógica de inicialização de todo o aplicativo em módulos de componentes raiz como `App.js` ou no ponto de entrada do aplicativo.

### Notificar componentes pai sobre alterações de estado {/*notifying-parent-components-about-state-changes*/}

Digamos que você esteja escrevendo um componente `Toggle` com um estado interno `isOn` que pode ser `true` ou `false`. Há algumas maneiras diferentes de alterná-lo (clicando ou arrastando). Você deseja notificar o componente pai sempre que o estado interno do `Toggle` for alterado, portanto, você expõe um evento `onChange` e o chama a partir de um Effect:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Evitar: O handler onChange é executado tarde demais
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Como anteriormente, isso não é ideal. O `Toggle` atualiza seu estado primeiro, e o React atualiza a tela. Em seguida, o React executa o Effect, que chama a função `onChange` passada de um componente pai. Agora o componente pai atualizará seu próprio estado, iniciando outra passagem de renderização. Seria melhor fazer tudo em uma única passagem.

Exclua o Effect e, em vez disso, atualize o estado de *ambos* os componentes no mesmo event handler:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Bom: Executa todas as atualizações durante o evento que as causou
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Com essa abordagem, tanto o componente `Toggle` quanto seu componente pai atualizam seu estado durante o evento. O React [processa em lote atualizações](/learn/queueing-a-series-of-state-updates) de diferentes componentes juntos, de modo que haverá apenas uma passagem de renderização.

Você também pode remover completamente o estado e, em vez disso, receber `isOn` do componente pai:

```js {1,2}
// ✅ Também é bom: o componente é totalmente controlado por seu pai
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Elevar o estado"](/learn/sharing-state-between-components) permite que o componente pai controle totalmente o `Toggle` alternando o estado do próprio componente pai. Isso significa que o componente pai terá que conter mais lógica, mas haverá menos estado geral com o qual se preocupar. Sempre que você tentar manter duas variáveis de estado diferentes sincronizadas, tente elevar o estado em vez disso!

### Passando dados para o pai {/*passing-data-to-the-parent*/}

Esse componente `Child` obtém alguns dados e os passa para o componente `Parent` em um Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Evitar: Passar dados para o pai em um Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

No React, os dados fluem dos componentes pai para seus filhos. Quando você vê algo errado na tela, pode rastrear a origem da informação subindo a cadeia de componentes até encontrar o componente que passa a prop errada ou tem o estado errado. Quando os componentes filhos atualizam o estado de seus componentes pais em Effects, o fluxo de dados se torna muito difícil de rastrear. Como tanto o componente filho quanto o pai precisam dos mesmos dados, deixe o componente pai buscar esses dados e, em vez disso, *passá-los* para o filho:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Bom: Passagem de dados para a filho
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Isso é mais simples e mantém o fluxo de dados previsível: os dados fluem do pai para o filho.

### Inscrição em um armazenamento externo {/*subscribing-to-an-external-store*/}

Às vezes, seus componentes podem precisar escutar alguns dados fora do estado do React. Esses dados podem ser de uma biblioteca de terceiros ou de uma API integrada do navegador. Como esses dados podem ser alterados sem o conhecimento do React, você precisa se inscrever manualmente em seus componentes. Isso geralmente é feito com um Effect, por exemplo:

```js {2-17}
function useOnlineStatus() {
  // Não é o ideal: Inscrição manual no armazenamento em um Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Aqui, o componente se inscreve em um armazenamento de dados externo (nesse caso, a API `navigator.onLine` do navegador). Como essa API não existe no servidor (portanto, não pode ser usada para o HTML inicial), inicialmente o estado é definido como `true`. Sempre que o valor desse armazenamento de dados for alterado no navegador, o componente atualizará seu estado.

Embora seja comum usar Effects para isso, o React tem um Hook criado especificamente para assinar um armazenamento externo que é preferível. Remova o Effect e substitua-o por uma chamada para [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Bom: Inscrição em um armazenamento externo com um Hook padrão
  return useSyncExternalStore(
    subscribe, // O React não fará uma nova inscrição enquanto você passar a mesma função
    () => navigator.onLine, // Como obter o valor no cliente
    () => true // Como obter o valor no servidor
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Essa abordagem é menos propensa a erros do que a sincronização manual de dados mutáveis para o estado do React com um Effect. Normalmente, você escreverá um Hook personalizado como o `useOnlineStatus()` acima para não precisar repetir esse código nos componentes individuais. [Leia mais sobre como assinar armazenamentos externos a partir de componentes React](/reference/react/useSyncExternalStore)

### Buscando dados {/*fetching-data*/}

Muitos aplicativos usam o Effects para iniciar a busca de dados. É bastante comum escrever um Effect de busca de dados como este:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Evitar: Busca sem lógica de limpeza
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Você *não* precisa mover essa busca para um event handler.

Isso pode parecer uma contradição com os exemplos anteriores, nos quais você precisava colocar a lógica nos event handlers! Entretanto, considere que não é *o evento de digitação* que é o principal motivo para buscar. As entradas de pesquisa geralmente são preenchidas previamente a partir do URL, e o usuário pode navegar para trás e para frente sem tocar na entrada.

Não importa de onde vêm `page` e `query`. Enquanto esse componente estiver visível, você deseja manter o `results` [sincronizado](/learn/synchronizing-with-effects) com os dados da rede para a `page` e a `query` atuais. É por isso que se trata de um Effect.

Entretanto, o código acima tem um bug. Imagine que você digite `"hello"` rapidamente. Então a `query` mudará de `"h"` para `"he"`, `"hel"`, `"hell"` e `"hello"`. Isso dará início a buscas separadas, mas não há garantia sobre a ordem em que as respostas chegarão. Por exemplo, a resposta `"hell"` pode chegar *depois* da resposta `"hello"`. Como ela chamará `setResults()` por último, você exibirá os resultados de pesquisa errados. Isso é chamado de ["condição de corrida"](https://pt.wikipedia.org/wiki/Condi%C3%A7%C3%A3o_de_corrida): duas solicitações diferentes "correram" uma contra a outra e chegaram em uma ordem diferente da esperada.

**Para corrigir a condição de corrida, você precisa [adicionar uma função de limpeza](/learn/synchronizing-with-effects#fetching-data) para ignorar respostas obsoletas:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Isso garante que, quando seu Effect buscar dados, todas as respostas, exceto a última solicitada, serão ignoradas.

Lidar com condições de corrida não é a única dificuldade na implementação da busca de dados. Talvez você também queira pensar em armazenar respostas em cache (para que o usuário possa clicar em Voltar e ver a tela anterior instantaneamente), como buscar dados no servidor (para que o HTML inicial renderizado pelo servidor contenha o conteúdo buscado em vez de um spinner) e como evitar cascatas de rede (para que um filho possa buscar dados sem esperar por todos os pais).

**Esses problemas se aplicam a qualquer biblioteca de interface do usuário, não apenas ao React. Resolvê-los não é trivial, e é por isso que os [frameworks modernos](/learn/start-a-new-react-project#production-grade-react-frameworks) fornecem mecanismos internos de busca de dados mais eficientes do que a busca de dados no Effects.**

Se você não usa um framework (e não quer criar o sua próprio), mas gostaria de tornar a busca de dados do Effects mais ergonômica, considere extrair sua lógica de busca em um Hook personalizado, como neste exemplo:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Provavelmente, você também desejará adicionar alguma lógica para tratamento de erros e para verificar se o conteúdo está sendo carregado. Você mesmo pode criar um Hook como esse ou usar uma das muitas soluções já disponíveis no ecossistema React. **Embora isso, por si só, não seja tão eficiente quanto usar o mecanismo de busca de dados integrado de um framework, mover a lógica de busca de dados para um Hook personalizado facilitará a adoção de uma estratégia eficiente de busca de dados posteriormente.**

Em geral, sempre que tiver que recorrer à criação de Effects, fique atento para quando puder extrair uma parte da funcionalidade em um Hook personalizado com uma API mais declarativa e específica, como o `useData` acima. Quanto menos chamadas `useEffect` brutas você tiver em seus componentes, mais fácil será manter seu aplicativo.

<Recap>

- Se você puder calcular algo durante a renderização, não precisará de um Effect.
- Para armazenar em cache cálculos custosos, adicione `useMemo` em vez de `useEffect`.
- Para redefinir o estado de uma árvore de componentes inteira, passe uma `key` diferente para ela.
- Para redefinir um determinado estado em resposta a uma alteração de prop, ajuste-o durante a renderização.
- O código que é executado porque um componente foi *exibido* deve estar em Effects, o restante deve estar em eventos.
- Se você precisar atualizar o estado de vários componentes, é melhor fazê-lo durante um único evento.
- Sempre que você tentar sincronizar variáveis de estado em diferentes componentes, considere elevar o estado.
- Você pode buscar dados com o Effects, mas precisa implementar a limpeza para evitar condições de corrida.

</Recap>

<Challenges>

#### Transformar dados sem Effects {/*transform-data-without-effects*/}

A `TodoList` abaixo exibe uma lista de todos. Quando a caixa de seleção "Show only active todos" está marcada, os *todos* concluídos não são exibidos na lista. Independentemente de quais *todos* estejam visíveis, o rodapé exibe a contagem de *todos* que ainda não foram concluídos.

Simplifique esse componente removendo todo o estado e os Effects desnecessários.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Se você puder calcular algo durante a renderização, não precisará de estado ou de um Effect que o atualize.

</Hint>

<Solution>

Há apenas duas partes essenciais de estado neste exemplo: a lista de `todos` e a variável de estado `showActive` que representa se a caixa de seleção está marcada. Todas as outras variáveis de estado são [redundantes](/learn/choosing-the-state-structure#avoid-redundant-state) e podem ser calculadas durante a renderização. Isso inclui o `footer`, que você pode mover diretamente para o JSX ao redor.

Seu resultado deve ser semelhante a este:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Armazenar em cache um cálculo sem Effects {/*cache-a-calculation-without-effects*/}

Neste exemplo, a filtragem dos *todos* foi extraída em uma função separada chamada `getVisibleTodos()`. Essa função contém uma chamada `console.log()` dentro dela, o que o ajuda a perceber quando está sendo chamada. Alterne a opção "Show only active todos" e observe que isso faz com que a função `getVisibleTodos()` seja executada novamente. Isso é esperado porque os *todos* visíveis mudam quando você alterna quais devem ser exibidos.

Sua tarefa é remover o Effect que recomputa a lista `visibleTodos` no componente `TodoList`. No entanto, é necessário certificar-se de que o `getVisibleTodos()` não seja executado novamente (e, portanto, não imprima nenhum registro) quando você digitar na entrada.

<Hint>

Uma solução é adicionar uma chamada `useMemo` para armazenar em cache os *todos* visíveis. Há também outra solução, menos óbvia.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Remova a variável de estado e o Effect e, em vez disso, adicione uma chamada `useMemo` para armazenar em cache o resultado da chamada `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Com essa alteração, a função `getVisibleTodos()` será chamada somente se `todos` ou `showActive` forem alterados. A digitação na entrada altera apenas a variável de estado `text`, portanto, não aciona uma chamada para `getVisibleTodos()`.

Há também outra solução que não precisa do `useMemo`. Como a variável de estado `text` não pode afetar a lista de todos, você pode extrair o formulário `NewTodo` em um componente separado e mover a variável de estado `text` para dentro dele:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Essa abordagem também satisfaz os requisitos. Quando você digita na entrada, apenas a variável de estado `text` é atualizada. Como a variável de estado `text` está no componente filho `NewTodo`, o componente pai `TodoList` não será renderizado novamente. É por isso que a função `getVisibleTodos()` não é chamada quando você digita. (Ele ainda seria chamado se o `TodoList` fosse renderizado novamente por outro motivo).

</Solution>

#### Redefinir estado sem Effects {/*reset-state-without-effects*/}

Esse componente `EditContact` recebe um objeto de contato com o formato `{ id, name, email }` como a propriedade `savedContact`. Tente editar os campos de entrada de nome e e-mail. Quando você pressiona Save, o botão do contato acima do formulário é atualizado para o nome editado. Quando você pressiona Reset, todas as alterações pendentes no formulário são descartadas. Brinque com essa interface de usuário para se familiarizar com ela.

Quando você seleciona um contato com os botões na parte superior, o formulário é redefinido para refletir os detalhes desse contato. Isso é feito com um Effect dentro de `EditContact.js`. Remova esse Effect. Encontre outra maneira de redefinir o formulário quando `savedContact.id` for alterado.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Seria bom se houvesse uma maneira de dizer ao React que quando `savedContact.id` é diferente, o formulário `EditContact` é conceitualmente um _formulário de contato diferente_ e não deve preservar o estado. Você se lembra de alguma maneira?

</Hint>

<Solution>

Divida o componente `EditContact` em dois. Mova todo o estado do formulário para o componente `EditForm` interno. Exporte o componente externo `EditContact` e faça com que ele passe `savedContact.id` como a `chave` para o componente interno `EditContact`. Como resultado, o componente interno `EditForm` redefine todo o estado do formulário e recria o DOM sempre que você seleciona um contato diferente.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Enviar um formulário sem Effects {/*submit-a-form-without-effects*/}

Esse componente `Form` permite que você envie uma mensagem a um amigo. Quando você envia o formulário, a variável de estado `showForm` é definida como `false`. Isso aciona um Effect chamando `sendMessage(message)`, que envia a mensagem (você pode vê-la no console). Depois que a mensagem é enviada, você vê uma caixa de diálogo "Thank you" (Obrigado) com um botão "Open chat" (Abrir bate-papo) que permite que você volte ao formulário.

Os usuários do seu aplicativo estão enviando muitas mensagens. Para tornar o bate-papo um pouco mais difícil, você decidiu mostrar a caixa de diálogo "Thank you" *primeiro* em vez do formulário. Altere a variável de estado `showForm` para inicializar com `false` em vez de `true`. Assim que fizer essa alteração, o console mostrará que uma mensagem vazia foi enviada. Alguma coisa nessa lógica está errada!

Qual é a causa principal desse problema? E como você pode corrigi-lo?

<Hint>

A mensagem deve ser enviada _porque_ o usuário viu a caixa de diálogo "Thank you"? Ou é o contrário?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

A variável de estado `showForm` determina se deve ser exibido o formulário ou a caixa de diálogo "Thank you". No entanto, você não está enviando a mensagem porque a caixa de diálogo "Thank you" foi _exibida_. Você deseja enviar a mensagem porque o usuário enviou o formulário. Exclua o Effect enganoso e mova a chamada `sendMessage` para dentro do event handler `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Observe como, nessa versão, apenas _submeter o formulário_ (que é um evento) faz com que a mensagem seja enviada. Isso funciona igualmente bem, independentemente de `showForm` ser inicialmente definido como `true` ou `false`. (Defina-o como `false` e não observe nenhuma mensagem extra no console).

</Solution>

</Challenges>
