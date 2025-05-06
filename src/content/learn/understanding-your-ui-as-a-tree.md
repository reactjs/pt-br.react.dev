---
title: Entendendo Sua UI como uma Árvore
---

<Intro>

Seu aplicativo React está tomando forma com muitos componentes sendo aninhados dentro uns dos outros. Como o React acompanha a estrutura dos componentes do seu aplicativo?

O React, e muitas outras bibliotecas de UI, modelam a interface do usuário como uma árvore. Pensar no seu aplicativo como uma árvore é útil para entender a relação entre os componentes. Essa compreensão ajudará você a depurar conceitos futuros como desempenho e gerenciamento de estado.

</Intro>

<YouWillLearn>

* Como o React "vê" estruturas de componentes
* O que é uma árvore de renderização e para que ela é útil
* O que é uma árvore de dependência de módulos e para que ela é útil

</YouWillLearn>

## Sua UI como uma árvore {/*your-ui-as-a-tree*/}

Árvores são um modelo de relacionamento entre itens e a UI é frequentemente representada usando estruturas de árvore. Por exemplo, os navegadores usam estruturas de árvore para modelar HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) e CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Plataformas móveis também usam árvores para representar sua hierarquia de visualização.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagrama com três seções dispostas horizontalmente. Na primeira seção, há três retângulos empilhados verticalmente, com rótulos 'Componente A', 'Componente B', e 'Componente C'. A transição para o próximo painel é uma seta com o logotipo do React no topo rotulado como 'React'. A seção do meio contém uma árvore de componentes, com a raiz rotulada como 'A' e duas crianças rotuladas como 'B' e 'C'. A próxima seção é novamente transicionada usando uma seta com o logotipo do React no topo rotulada como 'React DOM'. A terceira e última seção é um wireframe de um navegador, contendo uma árvore de 8 nós, que possui apenas um subconjunto destacado (indicando o subárvore da seção do meio).">

O React cria uma árvore de UI a partir dos seus componentes. Neste exemplo, a árvore de UI é utilizada para renderizar no DOM.
</Diagram>

Assim como navegadores e plataformas móveis, o React também utiliza estruturas de árvore para gerenciar e modelar a relação entre componentes em um aplicativo React. Essas árvores são ferramentas úteis para entender como os dados fluem através de um aplicativo React e como otimizar a renderização e o tamanho do aplicativo.

## A Árvore de Renderização {/*the-render-tree*/}

Uma característica principal dos componentes é a capacidade de compor componentes de outros componentes. Ao [aninharmos componentes](/learn/your-first-component#nesting-and-organizing-components), temos o conceito de componentes pai e filho, onde cada componente pai pode ser também um filho de outro componente.

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
      <p>Sua citação inspiradora é:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire-me de novo</button>
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
  "Não deixe o ontem ocupar muito do hoje.” — Will Rogers",
  "Ambição é colocar uma escada contra o céu.",
  "Uma alegria que é compartilhada é uma alegria em dobro.",
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

<Diagram name="render_tree" height={250} width={500} alt="Gráfico de árvore com cinco nós. Cada nó representa um componente. A raiz da árvore é App, com duas setas se estendendo dela para 'InspirationGenerator' e 'FancyText'. As setas estão rotuladas com a palavra 'renderiza'. O nó 'InspirationGenerator' também tem duas setas apontando para os nós 'FancyText' e 'Copyright'.">

O React cria uma *árvore de renderização*, uma árvore de UI, composta pelos componentes renderizados.

</Diagram>

A partir do exemplo de aplicativo, podemos construir a árvore de renderização acima.

A árvore é composta por nós, cada um dos quais representa um componente. `App`, `FancyText`, `Copyright`, para citar alguns, são todos nós em nossa árvore.

O nó raiz em uma árvore de renderização React é o [componente raiz](/learn/importing-and-exporting-components#the-root-component-file) do aplicativo. Neste caso, o componente raiz é `App` e ele é o primeiro componente que o React renderiza. Cada seta na árvore aponta de um componente pai para um componente filho.

<DeepDive>

#### Onde estão as tags HTML na árvore de renderização? {/*where-are-the-html-elements-in-the-render-tree*/}

Você notará que na árvore de renderização acima, não há menção das tags HTML que cada componente renderiza. Isso ocorre porque a árvore de renderização é composta apenas por [componentes](learn/your-first-component#components-ui-building-blocks) React.

O React, como um framework de UI, é agnóstico em relação à plataforma. No react.dev, mostramos exemplos que são renderizados para a web, que utiliza marcação HTML como seus primitivos de UI. Mas um aplicativo React poderia muito bem ser renderizado para uma plataforma móvel ou desktop, que pode usar primitivos de UI diferentes como [UIView](https://developer.apple.com/documentation/uikit/uiview) ou [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Esses primitivos de UI de plataforma não são parte do React. As árvores de renderização React podem fornecer insights sobre nosso aplicativo React, independentemente da plataforma para a qual seu aplicativo é renderizado.

</DeepDive>

Uma árvore de renderização representa uma única passagem de renderização de uma aplicação React. Com [renderização condicional](/learn/conditional-rendering), um componente pai pode renderizar crianças diferentes dependendo dos dados passados.

Podemos atualizar o aplicativo para renderizar condicionalmente uma citação inspiradora ou uma cor.

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
      <p>Sua {inspiration.type} inspiradora é:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire-me de novo</button>
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
  {type: 'quote', value: "Não deixe o ontem ocupar muito do hoje.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambição é colocar uma escada contra o céu."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Uma alegria que é compartilhada é uma alegria em dobro."},
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

<Diagram name="conditional_render_tree" height={250} width={561} alt="Gráfico de árvore com seis nós. O nó superior da árvore é rotulado como 'App' com duas setas se estendendo para os nós rotulados como 'InspirationGenerator' e 'FancyText'. As setas são linhas sólidas e estão rotuladas com a palavra 'renderiza'. O nó 'InspirationGenerator' também tem três setas. As setas para os nós 'FancyText' e 'Color' são tracejadas e rotuladas com 'renderiza?'. A última seta aponta para o nó rotulado como 'Copyright' e é sólida e rotulada com 'renderiza'.">

Com a renderização condicional, em diferentes renderizações, a árvore de renderização pode renderizar componentes diferentes.

</Diagram>

Neste exemplo, dependendo do que `inspiration.type` é, podemos renderizar `<FancyText>` ou `<Color>`. A árvore de renderização pode ser diferente para cada passagem de renderização.

Embora as árvores de renderização possam diferir entre as passagens de renderização, essas árvores são geralmente úteis para identificar quais são os *componentes de nível superior* e *componentes folha* em um aplicativo React. Componentes de nível superior são os componentes mais próximos do componente raiz e afetam o desempenho de renderização de todos os componentes abaixo deles, frequentemente contendo a maior complexidade. Componentes folha estão perto do fundo da árvore e não têm componentes filhos, sendo frequentemente re-renderizados.

Identificar essas categorias de componentes é útil para entender o fluxo de dados e o desempenho do seu aplicativo.

## A Árvore de Dependência de Módulos {/*the-module-dependency-tree*/}

Outra relação em um aplicativo React que pode ser modelada com uma árvore são as dependências de módulos do aplicativo. À medida que [dividimos nossos componentes](/learn/importing-and-exporting-components#exporting-and-importing-a-component) e lógica em arquivos separados, criamos [módulos JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) onde podemos exportar componentes, funções ou constantes.

Cada nó em uma árvore de dependência de módulos é um módulo e cada ramo representa uma declaração `import` nesse módulo.

Se pegarmos o aplicativo de Inspirações anterior, podemos construir uma árvore de dependência de módulos, ou árvore de dependência para abreviar.

<Diagram name="module_dependency_tree" height={250} width={658} alt="Um gráfico de árvore com sete nós. Cada nó é rotulado com um nome de módulo. O nó de nível superior da árvore é rotulado como 'App.js'. Há três setas apontando para os módulos 'InspirationGenerator.js', 'FancyText.js' e 'Copyright.js' e as setas estão rotuladas como 'importa'. A partir do nó 'InspirationGenerator.js', há três setas que se estendem para três módulos: 'FancyText.js', 'Color.js' e 'inspirations.js'. As setas estão rotuladas como 'importa'.">

A árvore de dependência de módulos para o aplicativo Inspirações.

</Diagram>

O nó raiz da árvore é o módulo raiz, também conhecido como o arquivo de entrada. Ele geralmente é o módulo que contém o componente raiz.

Comparando com a árvore de renderização do mesmo aplicativo, há estruturas semelhantes, mas algumas diferenças notáveis:

* Os nós que compõem a árvore representam módulos, não componentes.
* Módulos não-componentes, como `inspirations.js`, também são representados nesta árvore. A árvore de renderização encapsula apenas componentes.
* `Copyright.js` aparece sob `App.js`, mas na árvore de renderização, `Copyright`, o componente, aparece como um filho de `InspirationGenerator`. Isso porque `InspirationGenerator` aceita JSX como [props filhos](/learn/passing-props-to-a-component#passing-jsx-as-children), então renderiza `Copyright` como um componente filho, mas não importa o módulo.

As árvores de dependência são úteis para determinar quais módulos são necessários para executar seu aplicativo React. Ao construir um aplicativo React para produção, geralmente há uma etapa de construção que agrupa todo o JavaScript necessário para ser enviado ao cliente. A ferramenta responsável por isso é chamada de [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), e os bundlers usarão a árvore de dependência para determinar quais módulos devem ser incluídos.

À medida que seu aplicativo cresce, muitas vezes o tamanho do bundle também cresce. Tamanhos de bundle grandes são caros para um cliente baixar e executar. Tamanhos de bundle grandes podem atrasar o tempo que leva para sua UI ser desenhada. Ter uma noção da árvore de dependência do seu aplicativo pode ajudar na depuração desses problemas.

[comment]: <> (talvez devêssemos também aprofundar em imports condicionais)

<Recap>

* Árvores são uma maneira comum de representar a relação entre entidades. Elas são frequentemente usadas para modelar a interface do usuário.
* Árvores de renderização representam a relação aninhada entre componentes React em uma única renderização.
* Com a renderização condicional, a árvore de renderização pode mudar em diferentes renderizações. Com diferentes valores de prop, os componentes podem renderizar diferentes componentes filhos.
* Árvores de renderização ajudam a identificar quais são os componentes de nível superior e folha. Componentes de nível superior afetam o desempenho de renderização de todos os componentes abaixo deles e os componentes folha são frequentemente re-renderizados. Identificá-los é útil para entender e depurar o desempenho de renderização.
* Árvores de dependência representam as dependências de módulo em um aplicativo React.
* Árvores de dependência são usadas por ferramentas de construção para agrupar o código necessário para enviar um aplicativo.
* Árvores de dependência são úteis para depurar tamanhos de bundle grandes que atrasam o tempo de renderização e expõem oportunidades para otimizar qual código é agrupado.

</Recap>

[TODO]: <> (Adicionar desafios)