---
title: "'use client'"
titleForTitleTag: "'use client' directive"
---

<RSC>

`'use client'` é para uso com [Componentes do Servidor React](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` permite que você marque qual código é executado no cliente.

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `'use client'` {/*use-client*/}

Adicione `'use client'` no topo de um arquivo para marcar o módulo e suas dependências transitivas como código do cliente.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

<<<<<<< HEAD
Quando um arquivo marcado com `'use client'` é importado de um Componente do Servidor, [empacotadores compatíveis](/learn/start-a-new-react-project#full-stack-frameworks) tratarão a importação do módulo como uma fronteira entre código executado no servidor e código executado no cliente.
=======
When a file marked with `'use client'` is imported from a Server Component, [compatible bundlers](/learn/creating-a-react-app#full-stack-frameworks) will treat the module import as a boundary between server-run and client-run code.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Como dependências de `RichTextEditor`, `formatDate` e `Button` também serão avaliados no cliente, independentemente de seus módulos conterem uma diretiva `'use client'`. Note que um único módulo pode ser avaliado no servidor quando importado de código do servidor e no cliente quando importado de código do cliente.

#### ressalvas {/*caveats*/}

* `'use client'` deve estar no início de um arquivo, acima de quaisquer imports ou outros códigos (comentários são permitidos). Devem ser escritos com aspas simples ou duplas, mas não com crases.
* Quando um módulo `'use client'` é importado de outro módulo renderizado pelo cliente, a diretiva não tem efeito.
* Quando um módulo de componente contém uma diretiva `'use client'`, qualquer uso desse componente é garantido como um Componente do Cliente. No entanto, um componente pode ser avaliado ainda no cliente mesmo que não tenha uma diretiva `'use client'`.
	* Um uso de componente é considerado um Componente do Cliente se for definido em um módulo com a diretiva `'use client'` ou se for uma dependência transitiva de um módulo que contém uma diretiva `'use client'`. Caso contrário, é um Componente do Servidor.
* O código marcado para avaliação no cliente não se limita a componentes. Todo código que faz parte da subárvore do módulo do Cliente é enviado e executado pelo cliente.
* Quando um módulo avaliado no servidor importa valores de um módulo `'use client'`, os valores devem ser um componente React ou [valores de props serializáveis suportados](#passing-props-from-server-to-client-components) a serem passados para um Componente do Cliente. Qualquer outro caso irá lançar uma exceção.

### Como o `'use client'` marca código do cliente {/*how-use-client-marks-client-code*/}

Em um aplicativo React, os componentes são frequentemente divididos em arquivos separados, ou [módulos](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Para aplicativos que usam Componentes do Servidor React, o aplicativo é renderizado no servidor por padrão. `'use client'` introduz uma fronteira entre servidor e cliente na [árvore de dependência do módulo](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), efetivamente criando uma subárvore de módulos do Cliente.

Para ilustrar melhor isso, considere o seguinte aplicativo de Componentes do Servidor React.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Sua citação inspiradora é:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire-me novamente</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Não deixe que ontem ocupe muito do hoje.” — Will Rogers",
  "Ambição é colocar uma escada contra o céu.",
  "Uma alegria compartilhada é uma alegria dobrada.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

Na árvore de dependência do módulo deste aplicativo de exemplo, a diretiva `'use client'` em `InspirationGenerator.js` marca esse módulo e todas as suas dependências transitivas como módulos do Cliente. A subárvore que começa em `InspirationGenerator.js` agora é marcada como módulos do Cliente.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="Um gráfico em árvore onde o nó superior representa o módulo 'App.js'. 'App.js' tem três filhos: 'Copyright.js', 'FancyText.js' e 'InspirationGenerator.js'. 'InspirationGenerator.js' tem dois filhos: 'FancyText.js' e 'inspirations.js'. Os nós abaixo e incluindo 'InspirationGenerator.js' têm uma cor de fundo amarela para significar que essa subárvore é renderizada pelo cliente devido à diretiva 'use client' em 'InspirationGenerator.js'.">
`'use client'` segmenta a árvore de dependência do módulo do aplicativo de Componentes do Servidor React, marcando `InspirationGenerator.js` e todas as suas dependências como renderizadas pelo cliente.
</Diagram>

Durante a renderização, o framework irá renderizar no servidor o componente raiz e continuará pela [árvore de renderização](/learn/understanding-your-ui-as-a-tree#the-render-tree), optando por não avaliar qualquer código importado de código marcado como cliente.

A porção renderizada no servidor da árvore de renderização é então enviada ao cliente. O cliente, com seu código do cliente baixado, então completa a renderização do restante da árvore.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Um gráfico em árvore onde cada nó representa um componente e seus filhos como componentes filhos. O nó de nível superior é rotulado como 'App' e tem dois componentes filhos 'InspirationGenerator' e 'FancyText'. 'InspirationGenerator' tem dois componentes filhos, 'FancyText' e 'Copyright'. Tanto 'InspirationGenerator' quanto seu componente filho 'FancyText' são marcados para serem renderizados pelo cliente.">
A árvore de renderização para o aplicativo de Componentes do Servidor React. `InspirationGenerator` e seu componente filho `FancyText` são componentes exportados a partir de código marcado como cliente e considerados Componentes do Cliente.
</Diagram>

Introduzimos as seguintes definições:

* **Componentes do Cliente** são componentes em uma árvore de renderização que são renderizados no cliente.
* **Componentes do Servidor** são componentes em uma árvore de renderização que são renderizados no servidor.

Trabalhando através do aplicativo de exemplo, `App`, `FancyText` e `Copyright` são todos renderizados no servidor e considerados Componentes do Servidor. Como `InspirationGenerator.js` e suas dependências transitivas estão marcados como código do cliente, o componente `InspirationGenerator` e seu componente filho `FancyText` são Componentes do Cliente.

<DeepDive>
#### Como `FancyText` é tanto um Componente do Servidor quanto um Componente do Cliente? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Pelas definições acima, o componente `FancyText` é tanto um Componente do Servidor quanto um Componente do Cliente, como isso é possível?

Primeiro, vamos esclarecer que o termo "componente" não é muito preciso. Aqui estão apenas duas maneiras que "componente" pode ser entendido:

1. Um "componente" pode se referir a uma **definição de componente**. Na maioria dos casos, isso será uma função.

```js
// Esta é uma definição de um componente
function MyComponent() {
  return <p>Meu Componente</p>
}
```

2. Um "componente" também pode se referir a um **uso de componente** de sua definição.
```js
import MyComponent from './MyComponent';

function App() {
  // Este é um uso de um componente
  return <MyComponent />;
}
```

Frequentemente, a imprecisão não é importante ao explicar conceitos, mas neste caso, é.

Quando falamos sobre Componentes do Servidor ou do Cliente, estamos nos referindo a usos de componentes.

* Se o componente for definido em um módulo com uma diretiva `'use client'`, ou o componente for importado e chamado em um Componente do Cliente, então o uso do componente é um Componente do Cliente.
* Caso contrário, o uso do componente é um Componente do Servidor.

<Diagram name="use_client_render_tree" height={150} width={450} alt="Um gráfico em árvore onde cada nó representa um componente e seus filhos como componentes filhos. O nó de nível superior é rotulado como 'App' e tem dois componentes filhos 'InspirationGenerator' e 'FancyText'. 'InspirationGenerator' tem dois componentes filhos, 'FancyText' e 'Copyright'. Tanto 'InspirationGenerator' quanto seu componente filho 'FancyText' são marcados para serem renderizados pelo cliente.">Uma árvore de renderização ilustra usos de componentes.</Diagram>

Voltando à questão do `FancyText`, vemos que a definição do componente _não_ possui uma diretiva `'use client'` e tem dois usos.

O uso de `FancyText` como filho de `App` marca esse uso como um Componente do Servidor. Quando `FancyText` é importado e chamado sob `InspirationGenerator`, esse uso de `FancyText` é um Componente do Cliente, já que `InspirationGenerator` contém uma diretiva `'use client'`.

Isso significa que a definição do componente para `FancyText` será avaliada tanto no servidor quanto também baixada pelo cliente para renderizar seu uso como Componente do Cliente.

</DeepDive>

<DeepDive>

#### Por que `Copyright` é um Componente do Servidor? {/*why-is-copyright-a-server-component*/}

Porque `Copyright` é renderizado como um filho do Componente do Cliente `InspirationGenerator`, você pode ficar surpreso que ele é um Componente do Servidor.

Lembre-se de que `'use client'` define a fronteira entre código do servidor e do cliente na _árvore de dependência do módulo_, não na árvore de renderização.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Um gráfico em árvore onde o nó superior representa o módulo 'App.js'. 'App.js' tem três filhos: 'Copyright.js', 'FancyText.js' e 'InspirationGenerator.js'. 'InspirationGenerator.js' tem dois filhos: 'FancyText.js' e 'inspirations.js'. Os nós abaixo e incluindo 'InspirationGenerator.js' têm uma cor de fundo amarela para significar que essa subárvore é renderizada pelo cliente devido à diretiva 'use client' em 'InspirationGenerator.js'.">
`'use client'` define a fronteira entre código do servidor e do cliente na árvore de dependência do módulo.
</Diagram>

Na árvore de dependência do módulo, vemos que `App.js` importa e chama `Copyright` do módulo `Copyright.js`. Como `Copyright.js` não contém uma diretiva `'use client'`, o uso do componente é renderizado no servidor. `App` é renderizado no servidor, pois é o componente raiz.

Componentes do Cliente podem renderizar Componentes do Servidor porque você pode passar JSX como props. Nesse caso, `InspirationGenerator` recebe `Copyright` como [filhos](/learn/passing-props-to-a-component#passing-jsx-as-children). No entanto, o módulo `InspirationGenerator` nunca importa diretamente o módulo `Copyright` nem chama o componente, tudo isso é feito por `App`. Na verdade, o componente `Copyright` é totalmente executado antes que `InspirationGenerator` comece a renderizar.

A lição é que uma relação de renderização pai-filho entre componentes não garante o mesmo ambiente de renderização.

</DeepDive>

### Quando usar `'use client'` {/*when-to-use-use-client*/}

Com `'use client'`, você pode determinar quando os componentes são Componentes do Cliente. Como os Componentes do Servidor são padrão, aqui está um breve resumo das vantagens e limitações dos Componentes do Servidor para determinar quando você precisa marcar algo como renderizado pelo cliente.

Para simplicidade, falamos sobre Componentes do Servidor, mas os mesmos princípios se aplicam a todo código no seu aplicativo que é executado no servidor.

#### Vantagens dos Componentes do Servidor {/*advantages*/}
* Componentes do Servidor podem reduzir a quantidade de código enviado e executado pelo cliente. Somente módulos do Cliente são empacotados e avaliados pelo cliente.
* Componentes do Servidor se beneficiam de serem executados no servidor. Eles podem acessar o sistema de arquivos local e podem experimentar baixa latência para buscas de dados e requisições de rede.

#### Limitações dos Componentes do Servidor {/*limitations*/}
* Componentes do Servidor não podem suportar interação, pois os manipuladores de eventos devem ser registrados e acionados por um cliente.
	* Por exemplo, manipuladores de eventos como `onClick` só podem ser definidos em Componentes do Cliente.
* Componentes do Servidor não podem usar a maioria dos Hooks.
	* Quando os Componentes do Servidor são renderizados, sua saída é essencialmente uma lista de componentes para o cliente renderizar. Componentes do Servidor não persistem em memória após a renderização e não podem ter seu próprio estado.

### Tipos serializáveis retornados por Componentes do Servidor {/*serializable-types*/}

Como em qualquer aplicativo React, os componentes pai passam dados para os componentes filhos. Como eles são renderizados em ambientes diferentes, passar dados de um Componente do Servidor para um Componente do Cliente requer consideração extra.

Os valores das props passadas de um Componente do Servidor para um Componente do Cliente devem ser serializáveis.

Props serializáveis incluem:
* Primitivos
	* [string](https://developer.mozilla.org/pt-BR/docs/Glossary/String)
	* [number](https://developer.mozilla.org/pt-BR/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/pt-BR/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/pt-BR/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/pt-BR/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Symbol), apenas símbolos registrados no registro global de símbolos via [`Symbol.for`](https://developer.mozilla.org/
  
  
  /docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iteráveis contendo valores serializáveis
	* [String](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) e [ArrayBuffer](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [Objetos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object) simples: aqueles criados com [inicializadores de objetos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Object_initializer), com propriedades serializáveis
* Funções que são [Funções de Servidor](/reference/rsc/server-functions)
* Elementos de Componente de Cliente ou Servidor (JSX)
* [Promises](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notavelmente, estes não são suportados:
* [Funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function) que não são exportadas de módulos marcados como cliente ou marcados com [`'use server'`](/reference/rsc/use-server)
* [Classes](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objetos que são instâncias de qualquer classe (exceto as embutidas mencionadas) ou objetos com [um protótipo nulo](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Símbolos não registrados globalmente, ex. `Symbol('meu novo símbolo')`

## Uso {/*usage*/}

### Construindo com interatividade e estado {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Valor da Contagem: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Como `Counter` requer tanto o Hook `useState` quanto manipuladores de eventos para incrementar ou decrementar o valor, este componente deve ser um Componente do Cliente e exigirá uma diretiva `'use client'` no topo.

Em contraste, um componente que renderiza UI sem interação não precisará ser um Componente do Cliente.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Por exemplo, o componente pai de `Counter`, `CounterContainer`, não requer `'use client'` pois não é interativo e não usa estado. Além disso, `CounterContainer` deve ser um Componente do Servidor, pois lê do sistema de arquivos local no servidor, o que é possível apenas em um Componente do Servidor.

Existem também componentes que não usam recursos exclusivos do servidor ou do cliente e podem ser indiferentes a onde eles renderizam. Em nosso exemplo anterior, `FancyText` é um desses componentes.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Neste caso, não adicionamos a diretiva `'use client'`, resultando no _output_ de `FancyText` (em vez de seu código-fonte) sendo enviado ao navegador quando referenciado a partir de um Componente do Servidor. Como demonstrado no exemplo anterior do aplicativo Inspirações, `FancyText` é usado como um Componente do Servidor ou do Cliente, dependendo de onde é importado e utilizado.

Mas se a saída HTML de `FancyText` fosse grande em relação ao seu código-fonte (incluindo dependências), pode ser mais eficiente forçá-lo a ser sempre um Componente do Cliente. Componentes que retornam uma longa string de caminho SVG são um caso em que pode ser mais eficiente forçar um componente a ser um Componente do Cliente.

### Usando APIs do cliente {/*using-client-apis*/}

Seu aplicativo React pode usar APIs específicas do cliente, como as APIs do navegador para armazenamento web, manipulação de áudio e vídeo, e hardware de dispositivos, entre [outras](https://developer.mozilla.org/pt-BR/docs/Web/API).

Neste exemplo, o componente usa [APIs do DOM](https://developer.mozilla.org/pt-BR/docs/Glossary/DOM) para manipular um [`canvas`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/canvas) elemento. Como essas APIs estão disponíveis apenas no navegador, ele deve ser marcado como um Componente do Cliente.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Usando bibliotecas de terceiros {/*using-third-party-libraries*/}

Frequentemente, em um aplicativo React, você utilizará bibliotecas de terceiros para lidar com padrões ou lógica comuns de UI.

Essas bibliotecas podem depender de Hooks de componentes ou APIs do cliente. Componentes de terceiros que usam qualquer uma das seguintes APIs do React devem ser executados no cliente:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) e [`react-dom`](/reference/react-dom/hooks) Hooks, excluindo [`use`](/reference/react/use) e [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Se utilizarem APIs do cliente, por exemplo, inserção no DOM ou visualizações nativas da plataforma

Se essas bibliotecas foram atualizadas para serem compatíveis com os Componentes do Servidor React, então elas já incluirão marcadores `'use client'` de sua própria, permitindo que você as use diretamente em seus Componentes do Servidor. Se uma biblioteca não foi atualizada, ou se um componente precisa de props como manipuladores de eventos que só podem ser especificados no cliente, talvez seja necessário adicionar seu próprio arquivo de Componente do Cliente entre o Componente do Cliente de terceiros e seu Componente do Servidor onde você gostaria de usá-lo.

[TODO]: <> (Solução de problemas - precisam de casos de uso)
