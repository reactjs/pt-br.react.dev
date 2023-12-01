---
title: Escolhendo a Estrutura do Estado
---

<Intro>

Estruturar bem o estado pode fazer a diferença entre um componente que é agradável de modificar e depurar, e um que é uma fonte constante de erros. Aqui estão algumas dicas que você deve considerar ao estruturar estados.

</Intro>

<YouWillLearn>

* Quando usar uma única variável de estado versus várias
* O que evitar ao organizar estados
* Como corrigir problemas comuns na estrutura do estado

</YouWillLearn>

## Princípios para estruturar estados {/*principles-for-structuring-state*/}

Quando você escreve um componente que mantém algum estado, você terá que fazer escolhas sobre quantas variáveis de estado usar e qual deve ser a forma dos dados. Embora seja possível escrever programas corretos mesmo com uma estrutura de estado subótima, existem alguns princípios que podem orientá-lo a fazer escolhas melhores:

1. **Agrupe estados relacionados.** Se você sempre atualiza duas ou mais variáveis de estado ao mesmo tempo, considere uni-las em uma única variável de estado.
2. **Evite contradições no estado.** Quando o estado é estruturado de forma que várias partes do estado possam se contradizer e "discordar" umas das outras, você deixa espaço para erros. Tente evitar isso.
3. **Evite estados redundantes.** Se você puder calcular algumas informações das *props* do componente ou de suas variáveis de estado existentes durante a renderização, não coloque essas informações no estado desse componente.
4. **Evite duplicação no estado.** Quando os mesmos dados são duplicados entre várias variáveis de estado, ou dentro de objetos aninhados, é difícil mantê-los sincronizados. Reduza a duplicação quando puder.
5. **Evite estados muito aninhados.** Um estado muito hierárquico não é muito conveniente para atualizar. Quando possível, prefira estruturar o estado de forma plana.

O objetivo por trás destes princípios é *tornar o estado fácil de atualizar sem introduzir erros*. Remover dados redundantes e duplicados do estado ajuda a garantir que todas as suas partes permaneçam sincronizadas. Isso é semelhante a como um engenheiro de banco de dados pode querer ["normalizar" a estrutura do banco de dados](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) para reduzir a chance de erros. Parafraseando Albert Einstein, **"Faça seu estado o mais simples possível - mas não simples demais."**

Agora vamos ver como estes princípios se aplicam na prática.

## Agrupe estados relacionados {/*group-related-state*/}

As vezes você pode ficar em dúvida entre usar uma única variável de estado, ou várias.

Você deveria fazer isto?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Ou isto?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Tecnicamente, você pode usar qualquer uma dessas abordagens. Mas **se duas variáveis de estado sempre mudam juntas, pode ser uma boa ideia uní-las em uma única variável de estado.** Assim você não esquecerá de sempre mantê-las sincronizadas, como neste exemplo onde mover o cursor atualiza ambas as coordenadas do ponto vermelho:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Outro caso em que você agrupará dados em um objeto ou em um *array* é quando você não sabe quantas variáveis de estado vai precisar. Por exemplo, é útil quando você tem um formulário onde o usuário pode adicionar campos personalizados.

<Pitfall>

Se sua variável de estado é um objeto, lembre-se de que [você não pode atualizar apenas um campo nele](/learn/updating-objects-in-state) sem explicitamente copiar os outros campos. Por exemplo, você não pode fazer `setPosition({ x: 100 })` no exemplo acima porque ele não teria a propriedade `y`! Em vez disso, se você quisesse definir apenas `x`, faria `setPosition({ ...position, x: 100 })`, ou dividiria em duas variáveis de estado e faria `setX(100)`.

</Pitfall>

## Evite contradições no estado {/*avoid-contradictions-in-state*/}

Aqui está um formulário de feedback do hotel com as variáveis de estado `isSending` e `isSent`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Obrigado pelo feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Como foi sua estadia no Pônei Saltitante?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Enviar
      </button>
      {isSending && <p>Enviando...</p>}
    </form>
  )
}

// Simula o envio de uma mensagem.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Embora este código funcione, ele deixa a porta aberta para estados "impossíveis". Por exemplo, se você esquecer de chamar `setIsSent` e `setIsSending` juntos, você pode acabar em uma situação onde tanto `isSending` quanto `isSent` são `true` ao mesmo tempo. Quão mais complexo for o seu componente, mais difícil será entender o que aconteceu.

**Como `isSending` e `isSent` nunca devem ser `true` ao mesmo tempo, é melhor substituí-los por uma variável de estado `status` que pode assumir um de *três* estados válidos:** `'typing'` (inicial), `'sending'` e `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Obrigado pelo feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Como foi sua estadia no Pônei Saltitante?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Enviar
      </button>
      {isSending && <p>Enviando...</p>}
    </form>
  );
}

// Simula o envio de uma mensagem.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Voce ainda pode declarar algumas constantes para legibilidade:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Mas elas não são variáveis de estado, então você não precisa se preocupar com elas ficando fora de sincronia uma com a outra.

## Evite estados redundantes {/*avoid-redundant-state*/}

Se você pode calcular algumas informações das *props* do componente ou de suas variáveis de estado existentes durante a renderização, você **não deveria** colocar essas informações no estado desse componente.

Por exemplo, neste formulário. Ele funciona, mas você consegue encontrar algum estado redundante nele?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Vamos fazer seu check-in</h2>
      <label>
        Primeiro nome:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Seu ticket será emitido para: <b>{fullName}</b>
      </p>
    </>
  )
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Este formulário tem três variáveis de estado: `firstName`, `lastName` e `fullName`. No entanto, `fullName` é redundante. **Você sempre pode calcular `fullName` a partir de `firstName` e `lastName` durante a renderização, então remova-o do estado.**

Você pode fazer desta forma:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Vamos fazer seu check-in</h2>
      <label>
        Primeiro nome:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Sobrenome:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Seu ticket será emitido para: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Aqui, `fullName` *não* é uma variável de estado. Em vez disso, ela é calculada durante a renderização:

```js
const fullName = firstName + ' ' + lastName;
```

Como resultado, os manipuladores de mudança não precisam fazer nada de especial para atualizá-lo. Quando você chama `setFirstName` ou `setLastName`, você dispara uma nova renderização, e então o próximo `fullName` será calculado a partir dos dados atualizados.

<DeepDive>

#### Não espelhe *props* no estado {/*don-t-mirror-props-in-state*/}

Um exemplo comum de estado redundante são códigos como este:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Aqui, uma variável de estado `color` é inicializada com a prop `messageColor`. O problema é que **se o componente pai passar um valor diferente para `messageColor` depois (por exemplo, `'red'` ao invés de `'blue'`), a *variável de estado* `color` não seria atualizada!** O estado é inicializado apenas durante a primeira renderização.

É por isso que "espelhar" alguma *prop* em uma variável de estado pode levar a confusão. Em vez disso, use a *prop* `messageColor` diretamente no seu código. Se você quiser dar um nome mais curto para ela, use uma constante:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

Desta forma, ela não ficará fora de sincronia com a *prop* passada pelo componente pai.

"Espelhar" *props* no estado só faz sentido quando você *quer* ignorar todas as atualizações para uma *prop* específica. Por convenção, comece o nome da *prop* com `initial` ou `default` para deixar claro que seus novos valores são ignorados:

```js
function Message({ initialColor }) {
  // A variável de estado `color` guarda o *primeiro* valor de `initialColor`.
  // Mudanças posteriores na *prop* `initialColor` são ignoradas.
  const [color, setColor] = useState(initialColor); */
```

</DeepDive>

## Evite duplicação no estado {/*avoid-duplication-in-state*/}

Este componente de lista de menus permite que você escolha um único lanche de viagem dentre vários:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'alga crocante', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>Qual o seu lanche de viagem?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Escolha</button>
          </li>
        ))}
      </ul>
      <p>Você selecionou {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

No momento, ele armazena o item selecionado como um objeto na variável de estado `selectedItem`. No entanto, isso não é bom: **o conteúdo de `selectedItem` é o mesmo objeto que um dos itens dentro da lista `items`.** Isso significa que as informações sobre o item em si estão duplicadas em dois lugares.

Por que isso é um problema? Vamos tornar cada item editável:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'alga crocante', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Qual o seu lanche de viagem?</h2> 
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Escolha</button>
          </li>
        ))}
      </ul>
      <p>Você selecionou {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Observe como se você clicar primeiro em "Escolha" em um item e *depois* editá-lo, **a entrada é atualizada, mas o rótulo na parte inferior não reflete as edições.** Isso ocorre porque você duplicou o estado e esqueceu de atualizar `selectedItem`.

Embora você pudesse atualizar `selectedItem` também, uma correção mais fácil é remover a duplicação. Neste exemplo, em vez de um objeto `selectedItem` (que cria uma duplicação com objetos dentro de `items`), você mantém o `selectedId` no estado e *depois* obtém o `selectedItem` pesquisando o array `items` por um item com esse ID:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'alga crocante', id: 1 },
  { title: 'barra de granola', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Qual o seu lanche de viagem?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Escolha</button>
          </li>
        ))}
      </ul>
      <p>Você selecionou {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>


(Alternativamente, você pode manter o índice selecionado no estado.)

O estado costumava ser duplicado assim:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Mas depois da mudança, é assim:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

A duplicação desapareceu, e você mantém apenas o estado essencial!

Agora, se você editar o item *selecionado*, a mensagem abaixo será atualizada imediatamente. Isso ocorre porque `setItems` dispara uma nova renderização, e `items.find(...)` encontraria o item com o título atualizado. Você não precisava manter *o item selecionado* no estado, porque apenas o *ID selecionado* é essencial. O resto poderia ser calculado durante a renderização.

## Evite estados muito aninhados {/*avoid-deeply-nested-state*/}

Imagine um plano de viagem consistindo de planetas, continentes e países. Você pode ser tentado estruturar seu estado usando objetos e arrays aninhados, como neste exemplo:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Terra',
    childPlaces: [{
      id: 2,
      title: 'África',
      childPlaces: [{
        id: 3,
        title: 'Botsuana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egito',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kênia',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Marrocos',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigéria',
        childPlaces: []
      }, {
        id: 9,
        title: 'África do Sul',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Ámericas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brasil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canadá',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'México',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trindade e Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Ásia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'Índia',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapura',
        childPlaces: []
      }, {
        id: 23,
        title: 'Coreia do Sul',
        childPlaces: []
      }, {
        id: 24,
        title: 'Tailândia',
        childPlaces: []
      }, {
        id: 25,
        title: 'Vietnã',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europa',
      childPlaces: [{
        id: 27,
        title: 'Croácia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'França',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Alemanha',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Itália',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Espanha',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turquia',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Oceania',
      childPlaces: [{
        id: 35,
        title: 'Austrália',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (Polinésia Francesa)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Ilha da Páscoa (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaii (EUA)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Nova Zelândia',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Lua',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Marte',
    childPlaces: [{
      id: 47,
      title: 'Cidade do Milho',
      childPlaces: []
    }, {
      id: 48,
      title: 'Monte Verde',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

Agora, digamos que você queira adicionar um botão para excluir um lugar que você já visitou. Como você faria isso? [Atualizar estados aninhados](/learn/updating-objects-in-state#updating-a-nested-object) envolve fazer cópias de objetos desde a parte que mudou. Excluir um lugar profundamente aninhado envolveria copiar toda a cadeia de lugares pai. Esse código pode ser muito verboso.

**Se o estado for muito aninhado para ser atualizado facilmente, considere torná-lo "plano".** Aqui está uma maneira de você reestruturar esses dados. Em vez de uma estrutura em forma de árvore em que cada `place` tem um array de *seus lugares filhos*, você pode fazer com que cada lugar mantenha um array de *IDs dos seus lugares filhos*. Em seguida, armazene um mapeamento de cada ID de lugar para o lugar correspondente.

Essa reestruturação de dados pode lembrá-lo de ver uma tabela de banco de dados:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares para visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terra',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egito',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kênia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Marrocos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'África do Sul',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trindade e Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Ásia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Índia',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapura',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Coreia do Sul',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Tailândia',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnã',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europa',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croácia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'França',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Alemanha',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Itália',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Espanha',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquia',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Austrália',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polinésia Francesa)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Ilha de Páscoa (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (EUA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nova Zelândia',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lua',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Marte',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Cidade do Milho',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Monte Verde',
    childIds: []
  }
};
```

</Sandpack>

Agora que o estado está "plano" (também conhecido como "normalizado"), atualizar itens aninhados fica mais fácil.

Para remover um lugar agora, você só precisa atualizar dois níveis de estado:

- A versão atualizada de seu lugar *pai* deve excluir o ID removido de seu array `childIds`.
- A versão atualizada do objeto "tabela" raiz deve incluir a versão atualizada do lugar pai.

Aqui está um exemplo de como você poderia fazer isso:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Cria uma nova versão do lugar pai
    // que não inclui o ID deste filho.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Atualiza o objeto de estado raiz...
    setPlan({
      ...plan,
      // ...para que tenha o pai atualizado.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares para visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Completar
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terra',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egito',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kênia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Marrocos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'África do Sul',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trindade e Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Ásia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Índia',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapura',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Coreia do Sul',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Tailândia',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnã',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europa',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croácia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'França',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Alemanha',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Itália',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Espanha',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquia',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [36, 37, 38, 39, 40, 41, 42],   
  },
  35: {
    id: 35,
    title: 'Austrália',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polinésia Francesa)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Ilha de Páscoa (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (EUA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nova Zelândia',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lua',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Piccolomini',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Marte',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Cidade do Milho',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Monte Verde',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Você pode aninhar o estado o quanto quiser, mas torná-lo "plano" pode resolver inúmeros problemas. Isso torna o estado mais fácil de atualizar, e ajuda a garantir que você não tenha duplicação em diferentes partes de um objeto aninhado.

<DeepDive>

#### Otimizando o uso da memória {/*improving-memory-usage*/}

Idealmente, você também removeria os itens excluídos (e seus filhos!) do objeto "tabela" para melhorar o uso da memória. Esta versão faz isso. Ele também [usa Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) para tornar a lógica de atualização mais concisa.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Remove os IDs dos filhos do lugar pai.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Remove o lugar e todos os seus filhos.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lugares para visitar</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Completar
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terra',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'África',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botsuana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egito',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kênia',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Marrocos',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'África do Sul',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Américas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brasil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canadá',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'México',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trindade e Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Ásia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Índia',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapura',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Coreia do Sul',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Tailândia',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnã',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europa',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  27: {
    id: 27,
    title: 'Croácia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'França',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Alemanha',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Itália',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Espanha',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquia',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [36, 37, 38, 39, 40, 41, 42],   
  },
  35: {
    id: 35,
    title: 'Austrália',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polinésia Francesa)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Ilha de Páscoa (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (EUA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nova Zelândia',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lua',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Piccolomini',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Tycho',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Mars',
    childIds: [47, 48]
  },
  46: {
    id: 46,
    title: 'Marte',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Cidade do Milho',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Monte Verde',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</DeepDive>

Por vezes, você também pode reduzir o aninhamento do estado movendo parte do estado aninhado para os componentes filhos. Isso funciona bem para o estado de UI efêmero que não precisa ser armazenado, como saber se o mouse está passando sobre um item.

<Recap>

* Se duas variáveis de estado sempre são atualizadas juntas, considere uní-las em uma.
* Escolha suas variáveis de estado cuidadosamente para evitar criar estados "impossíveis".
* Estruture seu estado de uma maneira que reduza as chances de você cometer um erro ao atualizá-lo.
* Evite estados redundantes e duplicados para que você não precise mantê-los sincronizados.
* Não coloque *props* *dentro de* estados a menos que você queira especificamente impedir atualizações.
* Para padrões de UI como seleção, mantenha o ID ou o índice no estado em vez do objeto em si.
* Se atualizar o estado profundamente aninhado for complicado, tente achatá-lo.

</Recap>

<Challenges>

#### Corrija um componente que não está sendo atualizado {/*fix-a-component-thats-not-updating*/}

Este componente `Clock` recebe duas *props*: `color` e `time`. Quando você seleciona uma cor diferente na caixa de seleção, o componente `Clock` recebe uma *prop* `color` diferente de seu componente pai. No entanto, por algum motivo, a cor exibida não é atualizada. Por quê? Corrija o problema.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Selecione uma cor:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

O problema é que este componente tem o estado `color` inicializado com o valor inicial da *prop* `color`. Mas quando a *prop* `color` muda, isso não afeta a variável de estado! Então elas ficam fora de sincronia. Para corrigir esse problema, remova a variável de estado por completo e use a *prop* `color` diretamente.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Selecione uma cor:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Ou, usando a sintaxe de desestruturação:

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Selecione uma cor:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### Corrija uma lista de itens quebrada {/*fix-a-broken-packing-list*/}

Esta lista de itens tem um rodapé que mostra quantos itens estão empacotados e quantos itens existem no total. Parece funcionar a princípio, mas está com defeitos. Por exemplo, se você marcar um item como empacotado e depois excluí-lo, o contador não será atualizado corretamente. Corrija o contador para que ele esteja sempre correto.

<Hint>

Algum estado neste exemplo é redundante?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Meias quentes', packed: true },
  { id: 1, title: 'Diário de viagem', packed: false },
  { id: 2, title: 'Aguarelas', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} de {total} empacotados!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Deletar
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Apesar de você poder alterar cuidadosamente cada manipulador de eventos para atualizar os contadores `total` e `packed` corretamente, o problema raiz é que essas variáveis de estado sequer existem. Eles são redundantes porque você sempre pode calcular o número de itens (empacotados ou totais) a partir do próprio array `items`. Remova o estado redundante para corrigir o erro:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Meias quentes', packed: true },
  { id: 1, title: 'Diário de viagem', packed: false },
  { id: 2, title: 'Aguarelas', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} de {total} empacotados!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Adicionar</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Deletar
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Observe como os manipuladores de eventos estão apenas preocupados em chamar `setItems` após essa alteração. As contagens de itens agora são calculadas durante a próxima renderização a partir de `items`, portanto, estão sempre atualizadas.

</Solution>

#### Corrija a seleção que desaparece {/*fix-the-disappearing-selection*/}

Existe uma lista de `letters` no estado. Quando você passa o mouse ou foca em uma determinada letra, ela é destacada. A letra destacada atual é armazenada na variável de estado `highlightedLetter`. Você pode "marcar" e "desmarcar" letras individuais, o que atualiza o array `letters` no estado.

Este código funciona, mas há um pequeno problema de UI. Quando você pressiona "Marcar" ou "Desmarcar", o destaque desaparece por um momento. No entanto, ele reaparece assim que você move o ponteiro ou muda para outra letra com o teclado. Por que isso está acontecendo? Corrija para que o destaque não desapareça após o clique no botão.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Caixa de entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Desmarcar' : 'Marcar'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Pronto para a aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Hora de fazer o check-in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'O festival começa em apenas SETE dias!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

O problema é que você está mantendo o objeto de letras em `highlightedLetter`. Mas você também está mantendo as mesmas informações no array `letters`. Então seu estado tem duplicação! Quando você atualiza o array `letters` após o clique no botão, você cria um novo objeto de letras que é diferente de `highlightedLetter`. É por isso que `highlightedLetter === letter` verifica se torna `false` e o destaque desaparece. Ele reaparece na próxima vez que você chamar `setHighlightedLetter` quando o ponteiro se move.

Para corrigir o problema, remova a duplicação do estado. Em vez de armazenar *a própria letra* em dois lugares, armazene o `highlightedId` em vez disso. Então você pode verificar `isHighlighted` para cada letra com `letter.id === highlightedId`, o que funcionará mesmo se o objeto `letter` tiver mudado desde a última renderização.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Caixa de Entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Desmarcar' : 'Marcar'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Pronto para a aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Hora de fazer o check-in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'O festival começa em apenas SETE dias!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Implemente seleção múltipla {/*implemente-selecao-multipla*/}

Neste exemplo, cada `Letter` tem uma *prop* `isSelected` e um manipulador `onToggle` que a marca como selecionada. Isso funciona, mas o estado é armazenado como um `selectedId` (ou `null` ou um ID), então apenas uma letra pode ser selecionada em um determinado momento.

Altere a estrutura do estado para que seleção múltipla seja possível. (Como você estruturaria isso? Pense nisso antes de escrever o código.) Cada caixa de seleção deve se tornar independente das outras. Clicar em uma letra selecionada deve desmarcá-la. Por último, o rodapé deve mostrar o número correto de itens selecionados.

<Hint>

Ao invés de um único ID selecionado, você pode querer manter um array ou um [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set) de IDs selecionados no estado.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: permitir seleção múltipla
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: permitir seleção múltipla
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Caixa de Entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: permitir seleção múltipla
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b> 
            Você selecionou {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Pronto para a aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Hora de fazer o check-in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'O festival começa em apenas SETE dias!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

Ao invés de um único `selectedId`, mantenha um *array* `selectedIds` no estado. Por exemplo, se você selecionar a primeira e a última carta, ele conteria `[0, 2]`. Quando nada estiver selecionado, seria um array vazio `[]`:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Ela estava selecionada?
    if (selectedIds.includes(toggledId)) {
      // Então remova este ID do array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Caso contrário, adicione este ID ao array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Caixa de Entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Você selecionou {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Pronto para a aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Hora de fazer o check-in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'O festival começa em apenas SETE dias!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Uma pequena desvantagem de usar um array é que, para cada item, você está chamando `selectedIds.includes(letter.id)` para verificar se ele está selecionado. Se o array for muito grande, isso pode se tornar um problema de desempenho porque a pesquisa de array com [`includes()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) leva tempo linear, e você está fazendo essa pesquisa para cada item individual.

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Cria uma cópia (para evitar mutação).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Caixa de Entrada</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Você selecionou {selectedCount} cartas
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Pronto para a aventura?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Hora de fazer o check-in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'O festival começa em apenas SETE dias!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Agora cada item faz uma verificação `selectedIds.has(letter.id)`, que é muito rápida.

Lembre-se de que você [não deve mutar objetos no estado](/learn/updating-objects-in-state), e isso também inclui Sets. É por isso que a função `handleToggle` cria uma *cópia* do Set primeiro e, em seguida, atualiza essa cópia.

</Solution>

</Challenges>
