---
title: Entendendo sua UI como uma Árvore
---

<Intro>

Seu aplicativo React está tomando forma com muitos componentes sendo aninhados uns dentro dos outros. Como o React acompanha a estrutura de componentes do seu aplicativo?

React, e muitas outras bibliotecas de UI, modelam a UI como uma árvore. Pensar no seu aplicativo como uma árvore é útil para entender a relação entre os componentes. Essa compreensão o ajudará a depurar conceitos futuros como performance e gerenciamento de estado.

</Intro>

<YouWillLearn>

* Como o React "vê" as estruturas dos componentes
* O que é uma árvore de renderização e para que ela é útil
* O que é uma árvore de dependência de módulos e para que ela é útil

</YouWillLearn>

## Sua UI como uma árvore {/*your-ui-as-a-tree*/}

<<<<<<< HEAD
Árvores são um modelo de relacionamento entre itens e a UI é frequentemente representada usando estruturas de árvores. Por exemplo, os navegadores usam estruturas de árvores para modelar HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) e CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Plataformas móveis também usam árvores para representar sua hierarquia de visualização.
=======
Trees are a relationship model between items. The UI is often represented using tree structures. For example, browsers use tree structures to model HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) and CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Mobile platforms also use trees to represent their view hierarchy.
>>>>>>> d271a7ac11d2bf0d6e95ebdfacaf1038421f9be0

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagrama com três seções dispostas horizontalmente. Na primeira seção, há três retângulos empilhados verticalmente, com as etiquetas 'Componente A', 'Componente B' e 'Componente C'. A transição para o próximo painel é uma seta com o logotipo do React no topo rotulado 'React'. A seção do meio contém uma árvore de componentes, com a raiz rotulada 'A' e dois filhos rotulados 'B' e 'C'. A próxima seção é novamente transicionada usando uma seta com o logotipo do React no topo rotulado 'React DOM'. A terceira e última seção é um wireframe de um navegador, contendo uma árvore de 8 nós, que tem apenas um subconjunto destacado (indicando a subárvore da seção do meio).">

React cria uma árvore de UI a partir de seus componentes. Neste exemplo, a árvore de UI é então usada para renderizar no DOM.
</Diagram>

Como navegadores e plataformas móveis, o React também usa estruturas de árvores para gerenciar e modelar a relação entre os componentes em um aplicativo React. Essas árvores são ferramentas úteis para entender como os dados fluem por um aplicativo React e como otimizar a renderização e o tamanho do aplicativo.

## A Árvore de Renderização {/*the-render-tree*/}

Uma característica importante dos componentes é a capacidade de compor componentes de outros componentes. À medida que [aninhamos componentes](/learn/your-first-component#nesting-and-organizing-components), temos o conceito de componentes pai e filho, onde cada componente pai pode ser ele mesmo um filho de outro componente.

Quando renderizamos um aplicativo React, podemos modelar essa relação em uma árvore, conhecida como árvore de renderização.

Aqui está um aplicativo React que renderiza citações inspiradoras.

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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
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

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
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

<Diagram name="render_tree" height={250} width={500} alt="Gráfico em árvore com cinco nós. Cada nó representa um componente. A raiz da árvore é App, com duas setas se estendendo dela para 'InspirationGenerator' e 'FancyText'. As setas são rotuladas com a palavra 'renders'. O nó 'InspirationGenerator' também tem duas setas apontando para os nós 'FancyText' e 'Copyright'.">

React cria uma *árvore de renderização*, uma árvore de UI, composta pelos componentes renderizados.


</Diagram>

Do aplicativo de exemplo, podemos construir a árvore de renderização acima.

A árvore é composta por nós, cada um dos quais representa um componente. `App`, `FancyText`, `Copyright`, para citar alguns, são todos nós em nossa árvore.

O nó raiz em uma árvore de renderização do React é o [componente raiz](/learn/importing-and-exporting-components#the-root-component-file) do aplicativo. Neste caso, o componente raiz é `App` e é o primeiro componente que o React renderiza. Cada seta na árvore aponta de um componente pai para um componente filho.

<DeepDive>

#### Onde estão as tags HTML na árvore de renderização? {/*where-are-the-html-elements-in-the-render-tree*/}

Você notará na árvore de renderização acima que não há menção das tags HTML que cada componente renderiza. Isso ocorre porque a árvore de renderização é composta apenas de [componentes](learn/your-first-component#components-ui-building-blocks) React.

React, como uma biblioteca de UI, é agnóstico à plataforma. Em react.dev, mostramos exemplos que renderizam na web, que usa marcação HTML como seus primitivos de UI. Mas um aplicativo React poderia renderizar em uma plataforma móvel ou desktop, que pode usar diferentes primitivos de UI como [UIView](https://developer.apple.com/documentation/uikit/uiview) ou [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Esses primitivos de UI da plataforma não fazem parte do React. As árvores de renderização do React podem fornecer informações sobre nosso aplicativo React, independentemente da plataforma em que seu aplicativo renderiza.

</DeepDive>

Uma árvore de renderização representa uma única passagem de renderização de um aplicativo React. Com a [renderização condicional](/learn/conditional-rendering), um componente pai pode renderizar diferentes filhos dependendo dos dados passados.

Podemos atualizar o aplicativo para renderizar condicionalmente uma citação ou cor inspiradora.

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

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
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
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Gráfico em árvore com seis nós. O nó superior da árvore é rotulado 'App' com duas setas se estendendo para os nós rotulados 'InspirationGenerator' e 'FancyText'. As setas são linhas sólidas e são rotuladas com a palavra 'renders'. O nó 'InspirationGenerator' também tem três setas. As setas para os nós 'FancyText' e 'Color' são tracejadas e rotuladas com 'renders?'. A última seta aponta para o nó rotulado 'Copyright' e é sólida e rotulada com 'renders'.">

Com a renderização condicional, em diferentes renderizações, a árvore de renderização pode renderizar diferentes componentes.

</Diagram>

Neste exemplo, dependendo do que `inspiration.type` é, podemos renderizar `<FancyText>` ou `<Color>`. A árvore de renderização pode ser diferente para cada passagem de renderização.

Embora as árvores de renderização possam diferir em diferentes passagens de renderização, essas árvores geralmente são úteis para identificar quais são os *componentes de nível superior* e *folha* em um aplicativo React. Os componentes de nível superior são os componentes mais próximos do componente raiz e afetam o desempenho da renderização de todos os componentes abaixo deles e geralmente contêm a maior complexidade. Os componentes folha estão próximos da parte inferior da árvore e não têm componentes filhos e costumam ser renderizados com frequência.

Identificar essas categorias de componentes é útil para entender o fluxo de dados e a performance do seu aplicativo.

## A Árvore de Dependência de Módulos {/*the-module-dependency-tree*/}

Outra relação em um aplicativo React que pode ser modelada com uma árvore são as dependências de módulos de um aplicativo. À medida que [dividimos nossos componentes](/learn/importing-and-exporting-components#exporting-and-importing-a-component) e lógica em arquivos separados, criamos [módulos JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) onde podemos exportar componentes, funções ou constantes.

Cada nó em uma árvore de dependência de módulos é um módulo e cada ramificação representa uma declaração `import` nesse módulo.

Se pegarmos o aplicativo Inspirations anterior, podemos construir uma árvore de dependência de módulos, ou árvore de dependência, para abreviar.

<Diagram name="module_dependency_tree" height={250} width={658} alt="Um gráfico em árvore com sete nós. Cada nó é rotulado com um nome de módulo. O nó de nível superior da árvore é rotulado 'App.js'. Existem três setas apontando para os módulos 'InspirationGenerator.js', 'FancyText.js' e 'Copyright.js' e as setas são rotuladas com 'imports'. Do nó 'InspirationGenerator.js', existem três setas que se estendem para três módulos: 'FancyText.js', 'Color.js' e 'inspirations.js'. As setas são rotuladas com 'imports'.">

A árvore de dependência de módulos para o aplicativo Inspirations.

</Diagram>

O nó raiz da árvore é o módulo raiz, também conhecido como arquivo de ponto de entrada. É frequentemente o módulo que contém o componente raiz.

Comparando com a árvore de renderização do mesmo aplicativo, existem estruturas semelhantes, mas algumas diferenças notáveis:

* Os nós que compõem a árvore representam módulos, não componentes.
* Módulos não componentes, como `inspirations.js`, também são representados nesta árvore. A árvore de renderização encapsula apenas componentes.
* `Copyright.js` aparece em `App.js`, mas na árvore de renderização, `Copyright`, o componente, aparece como um filho de `InspirationGenerator`. Isso ocorre porque `InspirationGenerator` aceita JSX como [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), portanto, ele renderiza `Copyright` como um componente filho, mas não importa o módulo.

As árvores de dependência são úteis para determinar quais módulos são necessários para executar seu aplicativo React. Ao construir um aplicativo React para produção, geralmente há uma etapa de compilação que irá empacotar todo o JavaScript necessário para enviar ao cliente. A ferramenta responsável por isso é chamada de [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), e os bundlers usarão a árvore de dependência para determinar quais módulos devem ser incluídos.

À medida que seu aplicativo cresce, o tamanho do pacote também. Tamanhos de pacote grandes são caros para um cliente baixar e executar. Tamanhos de pacote grandes podem atrasar o tempo para sua UI ser desenhada. Obter uma noção da árvore de dependência do seu aplicativo pode ajudar com a depuração desses problemas.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Árvores são uma forma comum de representar a relação entre entidades. Elas são frequentemente usadas para modelar UI.
* Árvores de renderização representam a relação aninhada entre os componentes do React em uma única renderização.
* Com a renderização condicional, a árvore de renderização pode mudar em diferentes renderizações. Com diferentes valores de prop, os componentes podem renderizar diferentes componentes filhos.
* As árvores de renderização ajudam a identificar quais são os componentes de nível superior e folha. Os componentes de nível superior afetam o desempenho da renderização de todos os componentes abaixo deles e os componentes folha são frequentemente renderizados novamente. Identificá-los é útil para entender e depurar a performance de renderização.
* Árvores de dependência representam as dependências de módulos em um aplicativo React.
* As árvores de dependência são usadas por ferramentas de construção para empacotar o código necessário para enviar um aplicativo.
* As árvores de dependência são úteis para depurar tamanhos de pacote grandes que diminuem o tempo de pintura e expõem oportunidades para otimizar o código que é empacotado.

</Recap>

[TODO]: <> (Adicionar desafios)
