---
title: Renderização condicional
---

<Intro>

Seus componentes frequentemente precisarão exibir coisas diferentes dependendo de diferentes condições. No React, você pode renderizar condicionalmente JSX usando sintaxe do JavaScript, como declarações `if`, e operadores `? :` e `&&`.

</Intro>

<YouWillLearn>

* Como retornar diferentes JSX dependendendo de uma condição
* Como incluir ou excluir condicionalmente um trecho de JSX
* Atalhos de sintaxe condicional comuns que você encontrará em bases de código do React

</YouWillLearn>

## Retorno condicional de JSX {/*conditionally-returning-jsx*/}

Digamos que você tenha um componente `PackingList` renderizando vários `Item`s, que podem ser marcados como empacotados ou não:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Observe que alguns dos componentes `Item` possuem a propriedade `isPacked` definida como `true` ao invés de `false`. Você deseja adicionar uma marca de seleção (✔) aos itens empacotados se `isPacked={true}`.

Você pode escrever isso como uma [declaração `if`/`else`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) da seguinte maneira:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Se a propriedade `isPacked` for `true`, este código **retorna uma árvore JSX diferente.** Com essa alteração, alguns dos itens recebem uma marca de seleção no final:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Experimente editar o que é retornado em cada caso e veja como o resultado muda!

Observe como você está criando lógica de ramificação com as declarações `if` e `return` do JavaScript. No React, o fluxo de controle (como condições) é tratado pelo JavaScript.

### Retornando condicionalmente nada com `null` {/*conditionally-returning-nothing-with-null*/}

Em algumas situações, você não desejará renderizar nada. Por exemplo, digamos que você não queira mostrar itens embalados de jeito nenhum. Um componente deve retornar algo. Nesse caso, você pode retornar `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Se `isPacked` equivaler à `true`, o componente não retornará nada, `null`. Caso contrário, retornará o JSX para ser renderizado.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Na prática, retornar `null` de um componente não é comum porque pode surpreender um desenvolvedor que está tentando renderizá-lo. Com mais frequência, você condicionalmente incluiria ou excluíria o componente no JSX do componente pai. Veja como fazer isso!

## Incluindo JSX condicionalmente {/*conditionally-including-jsx*/}

No exemplo anterior, você controlou qual (se houver) árvore JSX seria retornada pelo componente. Você pode ter percebido alguma duplicação na saída de renderização:

```js
<li className="item">{name} ✔</li>
```

é muito semelhante a

```js
<li className="item">{name}</li>
```

Ambas as ramificações condicionais retornam `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Embora essa duplicação não seja prejudicial, ela pode tornar seu código mais difícil de manter. E se você quiser alterar a `className`? Você teria que fazer isso em dois lugares do seu código! Em tal situação, você poderia incluir condicionalmente um pouco de JSX para tornar seu código mais [DRY.](https://pt.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Operador condicional ternário (`? :`) {/*conditional-ternary-operator--*/}

O JavaScript possui uma sintaxe compacta para escrever uma expressão condicional -- o [operador condicional](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) ou "operador ternário".

Ao invés disso:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Você pode escrever isso:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Você pode interpretá-lo como *"se `isPacked` for `true`, então (`?`) renderize `name + ' ✔'`, caso contrário (`:`) renderize `name`"*.

<DeepDive>

#### Esses dois exemplos são totalmente equivalentes? {/*are-these-two-examples-fully-equivalent*/}

Se você vem de um histórico de programação orientada a objetos, você pode supor que os dois exemplos acima são sutilmente diferentes porque um deles pode criar duas "instâncias" diferentes de `<li>`. No entanto, os elementos JSX não são "instâncias" porque eles não possuem nenhum estado interno e não são nós reais do DOM. Eles são leves descrições, como plantas baixas. Portanto, esses dois exemplos, na verdade, *são* completamente equivalentes. [Preservando e redefinindo o estado](/learn/preserving-and-resetting-state) explora em detalhes como isso funciona.

</DeepDive>

Agora, vamos supor que você queira envolver o texto do item concluído em outra tag HTML, como `<del>`, para eliminá-lo. Você pode adicionar ainda mais quebras de linha e parênteses para facilitar a aninhamento de mais JSX em cada um dos casos:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Este estilo funciona bem para condições simples, mas use-o com moderação. Se seus componentes ficarem bagunçados com marcação condicional aninhada demais, considere extrair componentes filhos para limpar as coisas. No React, a marcação faz parte do seu código, então você pode usar ferramentas como variáveis e funções para organizar expressões complexas.

### Operador lógico AND (`&&`) {/*logical-and-operator-*/}

Outro atalho comum que você encontrará é o [operador JavaScript AND lógico (`&&`)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Logical_AND). Dentro de componentes React, ele geralmente é usado quando você deseja renderizar algum JSX quando a condição for verdadeira, **ou não renderizar nada caso contrário**. Com `&&`, você pode renderizar condicionalmente o marcador de verificação apenas se `isPacked` for `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Você pode interpretar isso como *"se `isPacked`, então (`&&`) renderize o marcador de verificação, caso contrário, não renderize nada"*.

Veja como funciona na prática:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

A [Express JavaScript &&](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Logical_AND) retorna o valor do seu lado direito (no nosso caso, o marcador de verificação) se o lado esquerdo (a nossa condição) for `true`. Mas se a condição for `false`, a expressão inteira se torna `false`. O React considera `false` como um "vazio" na árvore JSX, assim como `null` ou `undefined`, e não renderiza nada em seu lugar.


<Pitfall>

**Não coloque números no lado esquerdo do `&&`.**

Para testar a condição, o JavaScript converte automaticamente o lado esquerdo para um valor booleano. No entanto, se o lado esquerdo for `0`, então a expressão inteira receberá esse valor (`0`), e o React renderizará alegremente o próprio `0` ao invés de nada.

Por exemplo, um erro comum é escrever o código como `messageCount && <p>Novas mensagens</p>`. É fácil assumir que não renderiza nada quando `messageCount` for `0`, mas na verdade renderiza o próprio `0`!

Para corrigir isso, faça do lado esquerdo um valor booleano: `messageCount > 0 && <p>Novas mensagens</p>`.

</Pitfall>

### Atribuindo condicionalmente JSX à uma variável {/*conditionally-assigning-jsx-to-a-variable*/}

Quando os atalhos atrapalham a escrita de código simples, tente usar uma declaração `if` e uma variável. Você pode reatribuir variáveis definidas com [`let`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/let), portanto, comece fornecendo o conteúdo padrão que você deseja exibir, o nome:

```js
let itemContent = name;
```

Use uma declaração `if` para reatribuir uma expressão JSX a `itemContent` se `isPacked` for `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[As chaves {} abrem a "janela para o JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Incorpore a variável com chaves na árvore JSX retornada, aninhando a expressão previamente calculada dentro do JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Este estilo é o mais verbose, mas também o mais flexível. Veja como funciona na prática:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Como antes, isso funciona não apenas para texto, mas também para JSX arbitrário:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Se você não está familiarizado com JavaScript, essa variedade de estilos pode parecer avassaladora no início. No entanto, aprender esses estilos ajudará você a ler e escrever qualquer código JavaScript, e não apenas componentes React! Escolha aquele que você preferir para começar e consulte esta referência novamente se você esquecer como os outros funcionam.

<Recap>

* No React, você controla a lógica de ramificação com JavaScript.
* Você pode retornar uma expressão JSX condicionalmente com uma declaração `if`.
* Você pode salvar condicionalmente algum JSX em uma variável e depois incluí-lo dentro de outro JSX usando chaves.
* No JSX, `{cond ? <A /> : <B />}` significa *"se `cond`, renderize `<A />`, caso contrário, `<B />`"*.
* No JSX, `{cond && <A />}` significa *"se `cond`, renderize `<A />`, caso contrário, nada"*.
* Os atalhos são comuns, mas você não precisa usá-los se preferir usar um `if` simples.

</Recap>



<Challenges>

#### Mostre um ícone para itens incompletos com `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Use o operador condicional (`cond ? a : b`) para renderizar um ❌ se `isPacked` não for `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Traje espacial"
        />
        <Item 
          isPacked={true} 
          name="Capacete com folha dourada"
        />
        <Item 
          isPacked={false} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostrar a importância do item com `&&` {/*show-the-item-importance-with-*/}

Neste exemplo, cada `Item` recebe uma prop `importance` numérica. Use o operador `&&` para renderizar "_(Relevância: X)_" em itálico, mas apenas para os itens que têm relevância diferente de zero. Sua lista de itens deve ficar assim:

* Traje espacial _(Relevância: 9)_
* Capacete com folha dourada
* Foto de Tam _(Relevância: 6)_

Não se esqueça de adicionar um espaço entre as duas etiquetas!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje espacial"
        />
        <Item 
          importance={0} 
          name="Capacete com folha dourada"
        />
        <Item 
          importance={6} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Isso deve resolver o problema:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Relevância: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Packing List de Sally Ride</h1>
      <ul>
        <Item 
          importance={9} 
          name="Traje espacial"
        />
        <Item 
          importance={0} 
          name="Capacete com folha dourada"
        />
        <Item 
          importance={6} 
          name="Foto de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Observe que você deve escrever `importance > 0 && ...` ao invés de `importance && ...` para que, se `importance` for `0`, `0` não seja renderizado como resultado!

Nesta solução, duas condições separadas são usadas para inserir um espaço entre o nome e o rótulo de importância. Alternativamente, você pode usar um Fragment com um espaço à esquerda: `importance > 0 && <> <i>...</i></>` ou adicionar um espaço imediatamente dentro de `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### Refatore uma série de `? :` para `if` e variáveis {/*refactor-a-series-of---to-if-and-variables*/}

Este componente `Drink` usa uma série de condições `? :` para mostrar informações diferentes dependendo se a prop `name` for `"tea"` ou `"coffee"`. O problema é que as informações sobre cada bebida estão espalhadas em várias condições. Refatore este código para usar uma única declaração `if` em vez de três condições `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte da planta</dt>
        <dd>{name === 'tea' ? 'folha' : 'feijão'}</dd>
        <dt>Teor de cafeína</dt>
        <dd>{name === 'tea' ? '15–70 mg/xícara' : '80–185 mg/xícara'}</dd>
        <dt>Idade</dt>
        <dd>{name === 'tea' ? '4.000+ anos' : '1.000+ anos'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Depois de refatorar o código para usar `if`, você tem mais ideias de como simplificá-lo?

<Solution>

Existem várias maneiras de abordar isso, mas aqui está um ponto de partida:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'folha';
    caffeine = '15–70 mg/xícara';
    age = '4.000+ anos';
  } else if (name === 'coffee') {
    part = 'feijão';
    caffeine = '80–185 mg/xícara';
    age = '1.000+ anos';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte da planta</dt>
        <dd>{part}</dd>
        <dt>Teor de cafeína</dt>
        <dd>{caffeine}</dd>
        <dt>Idade</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Aqui, as informações sobre cada bebida são agrupadas em vez de serem espalhadas em várias condições. Isso facilita a adição de mais bebidas no futuro.

Outra solução seria remover a condição completamente, movendo as informações para objetos:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'folha',
    caffeine: '15–70 mg/xícara',
    age: '4.000+ anos'
  },
  coffee: {
    part: 'feijão',
    caffeine: '80–185 mg/xícara',
    age: '1.000+ anos'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Parte da planta</dt>
        <dd>{info.part}</dd>
        <dt>Teor de cafeína</dt>
        <dd>{info.caffeine}</dd>
        <dt>Idade</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
