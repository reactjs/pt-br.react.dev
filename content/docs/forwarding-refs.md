---
id: encaminhamento-de-refs
title: Encaminhamento de Refs
permalink: docs/forwarding-refs.html
---

Encaminhamento de Ref é uma técnica para passar automaticamente uma [ref](/docs/refs-and-the-dom.html) através de um componente para um dos seus filhos. Isso normalmente não é necessário para a maioria dos componentes na aplicação. Entretanto, pode ser útil para alguns tipos de componentes, especialmente em bibliotecas de componentes reutilizáveis. Os cenários mais comuns estão descritos abaixo.

## Encaminhamento de refs para componentes do DOM {#forwarding-refs-to-dom-components}

Considere um componente `FancyButton` que renderiza o elemento nativo `button` do DOM: `embed:forwarding-refs/fancy-button-simple.js`

Componentes React escondem seus detalhes de implementação, inclusive suas saídas renderizadas. Outros componentes usando o `FancyButton` **geralmente não precisarão** [obter uma ref](/docs/refs-and-the-dom.html) para o elemento interno `button` do DOM. Isso é bom pois previne os componentes de se basearem demasiadamente na estrutura do DOM de cada um.

Embora essa encapsulação seja desejável para componentes com nível de aplicação como `FeedStory` ou `Comment`, ela pode ser incoveniente para componentes "folhas" altamente reutilizáveis como `FancyButton` ou `MyTextInput`. Esses componentes tendem a serem usados em toda a aplicação de uma maneira similar como os elementos `button` e `input` do DOM, e acessar seus nós do DOM pode ser inevitável para o gerenciamento de foco, seleção ou animações.

**Encaminhamento de ref é um recurso opt-in que permite que alguns componentes tomem uma `ref` que eles recebam e a repassem para baixo (em outras palavras, "encaminhem") para um filho.**

No exemplo abaixo, `FancyButton` usa `React.forwardRef` para obter a `ref` passada para ele e então a encaminha para o `button` do DOM que ele renderiza:

`embed:forwarding-refs/fancy-button-simple-ref.js`

Desta forma, componentes usando `FancyButton` podem obter uma referência ao nó DOM `button` subjacente e acessá-lo se necessário — como se eles usassem um `button` DOM diretamente.

Aqui está uma explicação passo-a-passo sobre o que acontece no exemplo acima:

1. Nós criamos uma [React ref](/docs/refs-and-the-dom.html) ao chamar `React.createRef` e atribuí-la a uma variável `ref`.
2. Nós passamos nossa `ref` para `<FancyButton ref={ref}>` especificando-a como um atributo JSX.
3. O React passa a `ref` como um segundo argumento para a função `(props, ref) => ...` dentro de `fowardRef`.
4. Nós encaminhamos esse argumento `ref` para `<button ref={ref}>` especificando-a como um atributo JSX.
5. Quando a ref estiver anexada, `ref.current` irá apontar para o nó `<button>` do DOM.

>Nota
> 
> O segundo argumento `ref` só existe quando você define um componente com a chamada `React.forwardRef`. Componentes funcionais ou de classe não recebem o argumento `ref`, e ref também não está disponível nas props.
> 
> Encaminhamento de ref não é limitado aos componentes do DOM. Você pode encaminhar refs para componentes de classe também.

## Nota para quem mantém uma biblioteca de componentes {#note-for-component-library-maintainers} 

**Quando você começar a usar `fowardRef` em uma biblioteca de componentes, você deve tratar isso como uma mudança abrupta e lançar uma nova versão maior.** Isso porque sua biblioteca provavelmente terá um comportamento observável diferente (como para onde as refs são atribuídas, ou quais tipos são exportados) e isso pode ocasionar quebras em aplicações ou em outras bibliotecas que dependem do comportamento antigo.

Aplicar `React.fowardRef` condicionalmente quando ele existe também não é recomendado pelas mesmas razões: isso muda commo sua biblioteca se comporta e potencialmente pode quebrar as aplicações para seus usuários quando eles derem upgrade no próprio React.

## Encaminhamento de refs em componentes de ordem superior {#forwarding-refs-in-higher-order-components}

Esta técnica também pode ser particulamente útil com [componentes de ordem superior](/docs/higher-order-components.html) (também conhecidos como HOCs). Vamos começar com o exemplo de um HOC que da log de props de componente para o console: `embed:forwarding-refs/log-props-before.js`

O HOC "logProps" passa todas as `props` para o componente que ele envolve, assim a saída renderizada será a mesma. Por exemplo, podemos usar este HOC para dar log em todas as props que são passadas para nosso componente "fancy button": `embed:forwarding-refs/fancy-button.js`

Existe uma ressalva sobre o exemplo acima: refs não serão aceitas. Isso porque `ref` não é uma prop. Assim como `key` é tratada de forma diferente pelo React. Se você adiciona uma ref a um HOC, a ref irá referir-se ao componente mais externo e não ao componente encapsulado.

Isso significa que refs destinadas para nosso componente `FancyButton` terão que ser anexadas, na verdade, ao componente `LogProps`: `embed:forwarding-refs/fancy-button-ref.js`

Felizmente, nós podemos encaminhar refs explicitamente para o componente interno `FancyButton` usando a API `React.forwardRef`. `React.forwardRef` aceita uma função de render que recebe parâmetros `props` e `ref` e retorna um nó React. Por exemplo: `embed:forwarding-refs/log-props-after.js`

## Exibindo um nome customizável em DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` aceita uma função de renderização. React DevTools usa esta função para determinar o que exibir para o componente de encaminhamento de ref.

Por exemplo, o componente a seguir vai aparecer como "*ForwardRef*" no DevTools:

`embed:forwarding-refs/wrapped-component.js`

Se você nomear a função de renderização, DevTools também irá incluir seu nome (e.g. *ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Você inclusive pode definir a propriedade `displayName` da função para incluir o componente que você está envolvendo:

`embed:forwarding-refs/customized-display-name.js`
