---
title: "Introduzindo o React Profiler"
author: [bvaughn]
---
React 16.5 adiciona suporte para o novo plugin de profile do DevTools.
Este plugin usa a [API experimental de profile](https://github.com/reactjs/rfcs/pull/51) do React para coletar informações temporais sobre cada componente que é renderizado a fim de identificar gargálos de desempenho em aplicações React.
Ele será completamente compatível com nossas futuras funcionalidades de [time slicing e suspense](/blog/2018/03/01/sneak-peek-beyond-react-16.html).

Este blog post cobre os seguintes tópicos:
* [Analisando uma aplicação](#profiling-an-application)
* [Lendo dados de desempenho](#reading-performance-data)
  * [Navegando por commits](#browsing-commits)
  * [Filtrando commits](#filtering-commits)
  * [Gráfico de chama](#flame-chart)
  * [Gráfico de classificação](#ranked-chart)
  * [Gráfico de componente](#component-chart)
  * [Interações](#interactions)
* [Guia de soluções de problemas](#troubleshooting)
  * [Nenhum dado de profile foi salvo para a raiz selecionada](#no-profiling-data-has-been-recorded-for-the-selected-root)
  * [Nenhum dado de tempo a ser exibido para o commit selecionado](#no-timing-data-to-display-for-the-selected-commit)
* [Vídeo aprofundado](#deep-dive-video)

## Analisando uma aplicação {#profiling-an-application}

DevTools irá exibir uma aba chamada "Profiler" para aplicações que suportem a nova API de profiling:

![Nova aba "profiler" do DevTools](../images/blog/introducing-the-react-profiler/devtools-profiler-tab.png)

> Nota:
>
> `react-dom` 16.5+ suporta análise no modo DEV.
> Um pacote de produção para análise está disponível como `react-dom/profiling`.
> Leia mais sobre como usar este bundle em [fb.me/react-profiling](https://fb.me/react-profiling) 

O painel de "Profiler" estará vazio inicialmente. Clique no botão de gravar para iniciar a análise:

![Clique "gravar" para iniciar a análise](../images/blog/introducing-the-react-profiler/start-profiling.png)

Uma vez que você começou a gravar, DevTools irá coletar automativamente informações de desempenho cada vez que sua aplicação renderizar.
Use sua aplicação como você normalente faria.
Quando você finalizar a análise, clique no botão de "Parar".

![Clique "parar" quando você finalizar a análise](../images/blog/introducing-the-react-profiler/stop-profiling.png)

Assumindo que sua aplicação renderizou pelo menos uma vez enquanto a análise acontecia, DevTools irá mostrar diversas formas para ver os dados de desempenho.
Iremos [olhar cada uma destas formas abaixo](#reading-performance-data).

## Lendo dados de desempenho {#reading-performance-data}

### Navegando por commits {#browsing-commits}
Conceitualmente, React funciona em duas fases:

* A fase de **render** determina quais mudanças precisam ser feitas no DOM, por exemplo. Durante esta fase, React executa `render` e então compara o resultado com o render anterior.
* A fase de **commit** aplica todas as mudanças. (No caso do React DOM, é quando o React insere, atualiza e remove nós do DOM.) O React também executa os métodos do ciclo de vida como `componentDidMount` e `componentDidUpdate` durante esta fase.

O profiler do DevTools agrupa a informação de desempenho por commit.
Commits são exibidos em um gráfico de barra próximo ao topo do profiler:

![Gráfico de barras dos commits analisados](../images/blog/introducing-the-react-profiler/commit-selector.png)

Cada barra no gráfico representa um único commit com o commit atualmente selecionado pintado de preto.
Você pode clicar numa barra (ou nas setas para esquerda/direita) para selecionar um commit diferente.

A cor e a altura de cada barra corresponde ao tempo que aquele commit demorou para renderizar.
(Barras amarelas altas demoraram mais do que as barras azuis menores.)

### Filtrando commits {#filtering-commits}

O quanto mais você executar o profile, mais vezes a sua aplicação irá renderizar.
Em alguns casos você vai acabar com _commits demais_ para analisar facilmente.
O profiler oferece um mecanismo de filtro para ajudar nestes casos.
Use-o para especificar um limit e o profiler irá esconder todos os commits que foram mais _rápidos_ que aquele valor.

![Filtrando commits por tempo](../images/blog/introducing-the-react-profiler/filtering-commits.gif)

### Gráfico de chama {#flame-chart}

A visualização de gráfico de chama (flame chart) representa o estado da sua aplicação para um commit particular.
Cada barra no gráfico representa um componente React (por exemplo `App`, `Nav`).
O tamanho e cor da barra representa quanto tempo o componente e seus filhos demoraram para renderizar.
(A largura da barra representa quanto tempo foi gasto _quando o componente foi renderizado pela última vez_ e a cor representa quanto tempo foi gasto _como parte do commit atual_.)

![Examplo de gráfico de chama](../images/blog/introducing-the-react-profiler/flame-chart.png)

> Nota:
>
> A largura da barra indica quanto tempo demorou para renderizar o componente (e seus filhos) na última vez que foi renderizado.
> Se o componente não re-renderizou como parte do último commit, o tempo representa uma renderização anterior.
> O quanto maior for um componente, mais demorado é para ele renderizar.
> 
> A cor da barra indica quanto tempo o componente (e seus filhos) demoraram para renderizar no commit selecionado.
> Componentes amarelos levaram mais tempo, componentes azuis levaram menos tempo e componentes cinza não renderizaram durante este commit.

Por exemplo, o commit acima levou um total de 18.4ms para renderizar.
O componente `Router` foi o "mais caro" para renderizar (levando 18.4ms).
A maior parte deste tempo foi devido a seus filhos, `Nav` (8.4ms) e `Route` (7.9ms).
O resto do tempo se dividiu entre seus filhos remanescentes ou gasto no método de render do próprio componente.

Você pode aumentar ou diminuir o zoom no gráfico de chama clicando nos componentes:
![Clique em um componente para aumentar ou diminuir o zoom](../images/blog/introducing-the-react-profiler/zoom-in-and-out.gif)

Clicar num componente irá selecioná-lo e mostrar, no painel lateral direito, informações que incluem suas `props` e `estado` no momento deste commit.
Você pode analisar e aprender mais sobre como o componente realmente renderizou durante o commit:

![Visualizando as props e estado de um componente em um commit](../images/blog/introducing-the-react-profiler/props-and-state.gif)

Em alguns casos, selecionar um componente e alternar entre commits pode dar uma dica do _porquê_ o componente renderizou:

![Visualizando quais valores mudaram entre commits](../images/blog/introducing-the-react-profiler/see-which-props-changed.gif)

A imagem acima mostra que `state.scrollOffset` mudou entre os commits.
Foi isto que provavelmente causou que o componente `List` renderizasse novamente.

### Gráfico de classificação {#ranked-chart}

A visualização de gráfico de classificação (ranked chart) representa um único commit.
Cada barra no gráfico representa um componente React (por exemplo `App`, `Nav`).
O gráfico é ordenado de tal forma que o componente que demorou mais para renderizar fica no topo.

![Exemplo de gráfico de classificação](../images/blog/introducing-the-react-profiler/ranked-chart.png)

> Nota:
>
> O tempo de renderização de um componente inclui o tempo gasto para renderizar seus filhos,
> portanto, os componentes que demoram mais para renderizar estão geralmente próximos ao topo da árvore.

Assim como no gráfico de chama, você pode aumentar ou diminuir o zoom de um gráfico de classificação ao clicar nos componentes.

### Gráfico de componente {#component-chart}

Algumas vezes é útil visualizar quantas vezes um componente específico renderizou enquanto você estava analisando.
O gráfico de componente fornece esta informação no formato de um gráfico de barras.
Cada barra no gráfico representa uma vez que o componente renderizou.
A cor e a altura de cada barra corresponde a quanto tempo o componente demorou para renderizar _relativamente a outros componentes_ num commit específico.

![Exemplo de gráfico de componente](../images/blog/introducing-the-react-profiler/component-chart.png)

O gráfico acima mostra que o componente `List` renderizou 11 vezes.
Ele também mostra que cada vez que ele renderizou, foi o componente mais "caro" no commit (significando que foi o mais demorado).

Para visualizar este gráfico, você deve clicar duas vezes num componente _ou_ selecionar um componente e clicar no ícone com um gráfico de barras azul no painel de detalhe a direita.
Você pode retornar ao gráfico anterior clicando no botão "x" no painel de detalhe a direita.
Você também pode clicar duas vezes numa barra específica para visualizar mais informações sobre aquele commit.

![Como visualizar todas as renderizações de um componente específico](../images/blog/introducing-the-react-profiler/see-all-commits-for-a-fiber.gif)

Se o componente selecionado não renderizou durante uma sessão de análise, a seguinte mensagem irá ser exibida:

![Nenhuma renderização para o componente selecionado](../images/blog/introducing-the-react-profiler/no-render-times-for-selected-component.png)

### Interações {#interactions}

React recentemente adicionou outra [API experimental](https://fb.me/react-interaction-tracing) para rastrear a _causa_ de uma atualização.
"Interações" rastreadas com esta API irão ser mostradas no profiler:

![O painel de interações](../images/blog/introducing-the-react-profiler/interactions.png)

A imagem acima mostra uma sessão de análise que registrou quatro interações.
Cada linha representa uma interação que foi rastreada.
Os pontos coloridos através da linha representam commits relacionados àquela interação.

Você também pode ver quais interações foram rastreadas para um commit específico a partir das visualizações de gráfico de chama e de gráfico de classificação:

![Lista de interações de um commi](../images/blog/introducing-the-react-profiler/interactions-for-commit.png)

Você pode navigar através de interações e commits clicando neles:

![Navegue através de interações e commits](../images/blog/introducing-the-react-profiler/navigate-between-interactions-and-commits.gif)

A API de rastreamento ainda é novo e iremos abordar ela com mais detalhes em posts futuros.

## Guia de soluções de problemas {#troubleshooting}

### Nenhum dado de profile foi salvo para a raiz selecionada {#no-profiling-data-has-been-recorded-for-the-selected-root}

Se sua aplicação possui múltiplas "raizes", você talvez veja a seguinte mensagem após a análise:
![Nenhum dado foi salvo para a raiz selecionada](../images/blog/introducing-the-react-profiler/no-profiler-data-multi-root.png)

Esta mensagem indica que nenhum dado de dessempenho foi gravado para a raiz que está selecionada no painel de "Elementos".
Neste caso, tente selecionar uma raiz diferente no painel para visualizar informações analisadas para aquela raiz:

![Selecione uma raiz no painel de "Elements" para visualizar seus dados de desempenho](../images/blog/introducing-the-react-profiler/select-a-root-to-view-profiling-data.gif)

### Nenhum dado de tempo a ser exibido para o commit selecionado {#no-timing-data-to-display-for-the-selected-commit}

Às vezes, um commit pode ser tão rápido que `perfomance.now()` não retorna nenhuma informação de tempo significativa para o DevTools.
Neste caso, a seguinte mensagem irá aparecer:

![Nenhum dado de tempo a ser exibido para o commit selecionado](../images/blog/introducing-the-react-profiler/no-timing-data-for-commit.png)

## Vídeo aprofundado {#deep-dive-video}

O vídeo a seguir demonstra como o React profiler pode ser usado para detectar e melhorar gargálos de performance numa aplicação React real.

<br>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nySib7ipZdk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
