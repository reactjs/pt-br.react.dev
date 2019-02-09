---
id: reconciliation
title: Reconciliação
permalink: docs/reconciliation.html
---

O React provê uma API declarativa, assim, você não precisa se preocupar em saber exatamente o que mudou aem cada atualização. Isso torna mais fácil a criação de aplicações, apesar de não ser obvia a forma como isso é implementado no React. Este artigo explica as escolhas que fizemos no algoritimo de "diffing" para que as atualizaçãos nos componentes sejam previsíveis e rapidas o suficiente para aplicações de alta performance.

## Motivação {#motivation}

Quando utilizamos React, podemos imaginar a função `render()` como uma função responsável por gerar à árvore de Elementos React.

Na proxima atualização de `state` ou `props`, a função `render()` retornará uma árvore de Elementos React diferente. Dessa forma, o React precisará descobrir como ele pode atualizar a UI para sincronizar com a arvore mais recente.

Existem algumas soluções genéricas para o problema deste algoritmo de gerar menor número de operações para transformar uma árvore em outra. Contudo, o [algoritmo de última geração](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) possui uma complexidade da ordem de O(n<sup>3</sup>), onde n é o numero de elementos na àrvore.

Se usassemos isso no React, exibir 1000 elementos iria requerer aproximadamente um bilhão de comparações. Isso é, de longe, muito custoso. Em vez disso, o React implementa um algoritmo eurístico  da ordem de O(n) baseado em duas suposições:

1. Dois elementos de tipos diferentes irão produzir árvores diferentes.
2. O desenvolvedor pode indicar quais elementos filhos estão estáveis entre diferentes renderizações através da propriedade `key`

Na prática, essas suposições são válidas para quase todos os casos práticos.

## O Algoritimo de Diferenciação {#the-diffing-algorithm}

Quando diferenciando duas árvores, o React primeiro compara os dois elementos raíz. O comportamento é diferente dependendo do tipo dos elementos raíz.

### Elementos de Tipos Diferentes {#elements-of-different-types}

Sempre que os elementos raíz tiverem tipos diferentes, o React irá destruir a arvore antiga e construir uma árvore nova do zero. Indo de  `<a>` para `<img>`, ou de `<Article>` para `<Comment>`, ou de `<Button>` para `<div>` - qualquer uma dessas mudanças resultará em uma reconstrução total.

Quando desruimos uma árvore, os nós antigos do DOM são destruidos. Instancias de componentes recebem `componentWillUnmount()`. Quando construimos uma nova árvore, novos nós do DOM são inseridos no DOM. Instancias de componentes recebem `componentWillMount()` and depois `componenteDidMount()`. Qualquer estado associado com a árvore antiga é perdido.

Qualquer componente abaixo irá ser desmontado e ter seu estado destruido.
Por exemplo, quando diferenciando: 
```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Isso irá destruir o antigo `Counter` e remontar um novo.

### Elementos DOM de mesmo tipo {#dom-elements-of-the-same-type}

Quando comparando dois Elementos DOM React do mesmo tipo, React olhará para os atributos de ambos, mantendo os nós DOM subjacentes e apenas atulizando os atributos modificados. Por exemplo:


```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```
Comparando estes dois elementos, o React sabe que deve modificar apenas o `className` no nó DOM subjacente.

Quando aqualizando o `style`, o React tambem sabe que deve atualizar apenas as propriedades modificadas. Por exemplo: 
```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```
Quando convertendo entre estes dois elementos, o React sabe que precisa modificar apenas o estilo `color`, mas não o `fontWeight`.

Depois de manipular o nó DOM, o React itera recursivamente sobre os filhos.

### Elementos Componentes De Mesmo Tipo {#component-elements-of-the-same-type}

Quando um componente atualiza, a instance continua a mesma, então o estato é matido entre as renderizações. O React atualiza as props das instancias dos componente subjacentes para sincronizar com o novo elemento e então chama `componentWillReceiveProps()` e `componentWillUpdate()` na instancia subjacente.

Depois, o método `render()` é chamado e o Algoritmo de Diferenciação itera recursivamente no resultado anterior e no novo resultado.

### Iterando Recursivamente Nos Filhos {#recursing-on-children}

Por padrão, quando iterando recursivamente nos filhos de um nó DOM, o React apenas itera sobre ambas as listas de filhos ao mesmo tempo e gera uma mutação sempre que há uma diferença.

Por exemplo, quando adicionado um elemento no final da lista de filhos, a conversão entre essas duas árvores funciona bem:

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

O React irá sincronizar as duas árvores `<li>first</li>`, as duas árvores `<li>second</li>`, e então inserir a árvore `<li>third</li>`.

Se você implementar ingenuamente, inserir um element no inicio trará uma performance menor. Por exemplo, a conversão entre essas duas árvores tem um baixo desempenho:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```
O React irá modificar todo filho em vez de perceber que poderia manter as sub-árvores `<li>Duke</li>` e `<li>Villanova</li>` intáctas. Essa ineficiencia poderá ser um problema.

### Chaves {#keys}

Para resolver esse problema, o React possui o atributo `key`. Quando os filhos possuem chaves, o React às utiliza para igualar os filhos da árvore original com os filhos da árvore subsequente. Por exemplo, adicionando a `key` no nosso exemplo ineficiente acima, podemos fazer uma conversão eficiente da arvore:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Agora o React sabe que o elemento com a chave `'2014'` é o novo elemento, e os outros elementos com as chaves `'2015'` e `'2016'` apenas se moveram.

Na pratica, achar uma chave não é difícil. O elemento ao qual você irá exibir pode já possui um ID unico, então a chave poderia ser gerada a partir do seu proprio dado:

```js
<li key={item.id}>{item.name}</li>
```

Quando não é o caso, você pode adicionar uma propriedade ID ao seu modelo ou utilizar um hash em algumas partes do dado para gerar uma chave. A chave deve ser única apenas entre seus irmãos, não globalmente.

Como um ú ltimo recurso, você pode passar o index do item de um array como chave. Isso pode funcionar bem para items que nunca são reordenados, mas reordena-los trará uma baixa performance.

Reordenar pode tambem causar um problema com o estado do componente quando os indexes são utilizados como chaves. A instance do componente é atualizada e reusada baseada na sua chave. Se a chave é um index, mover o item modifica a chave. Como resultado disso, o estado do componente para coisas como inputs não controlados podem ficar bagunçados e atualizar de uma forma inesperada.

[Aqui](codepen://reconciliation/index-used-as-key) é um exemplo, no CodePen, de um problema que pode ser causado por usar indexes como chaves, e [aqui](codepen://reconciliation/no-index-used-as-key) é uma versão atualizada do mesmo exemplo mostrando como a não utilização dos indices como chaves resolve os problemas relacionados a reordenação, ordenação e adição no início da lista.

## Compensações {#tradeoffs}

É importante lembrar que o algoritmo de reconciliação é um detalhe de implementação. o React poderia re-renderizar o aplicativo inteiro a cada ação; o resultado final seria o mesmo. Apenas para ser claro, re-renderizar neste contexto significa chamar o método `render` para todos os componentes, isso não significa que o React irá desmontar e remonta-los. Isso significa apenas aplicar as diferenças seguindo as regras mencionadas nas seção anteriores.

Nós estamos regularmente refinando as eurísticas de modo a tornar mais rápidos os casos mais comums. Na implementação atual, você pode dizer que uma sub-árvore foi movida para entre seus irmãos, mas não pode dizer que ela se moveu para qualquer outro lugar. O algoritmo irá re-renderizar toda a sub-árvore.

Devido ao React ser baseado em eurísticas, se as suposições por trás delas não encaixarem, a performance será menor.

1. O algoritmo não irá tentar sincronizar as sub-arvores de componentes de tipos diferentes. Se você percerber que está tentando alternar entre dois componentes de tipos diferentes com uma saída muito similar, você irá querer que eles tenham o mesmo tipo. Na pratica nós não achamos que isso é um problema.

2. Chaves devem ser estáveis, previsiveis e unicas. Chaves estáveis (como as produzidas por `Math.random()`) irão causar a re-criação desnecessária de várias instancias de componentes e nós DOM, o que pode causar uma degradação na performance e a perca do estado nos componentes filhos.