---
id: perf
title: Ferramentas de desempenho
permalink: docs/perf.html
layout: docs
category: Add-Ons
---

> Nota:
>
> A partir do React 16, `react-addons-perf` não é suportado. Por favor, use [as ferramentas de criação de perfil do seu navegador](/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab) para obter informações sobre quais componentes são renderizados novamente.

**Importando**

```javascript
import Perf from 'react-addons-perf'; // ES6
var Perf = require('react-addons-perf'); // ES5 com npm
```


## Visão geral {#overview}

O React geralmente é bastante rápido fora da caixa. No entanto, em situações em que você precisa extrair cada grama de desempenho do seu aplicativo, ele fornece o método [shouldComponentUpdate()](/docs/react-component.html#shouldcomponentupdate) onde você pode adicionar dicas de otimização ao algoritmo diff do React.

Além de fornecer uma visão geral do desempenho geral do seu aplicativo, `Perf` é uma ferramenta de criação de perfil que informa exatamente onde você precisa colocar esses métodos.

Veja estes artigos para uma introdução às ferramentas de desempenho React:

 - ["How to Benchmark React Components"](https://medium.com/code-life/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)
 - ["Performance Engineering with React"](https://benchling.engineering/performance-engineering-with-react-e03013e53285)
 - ["A Deep Dive into React Perf Debugging"](https://benchling.engineering/a-deep-dive-into-react-perf-debugging-fd2063f5a667) 

### Desenvolvimento vs. Production Builds {#development-vs-production-builds}

Se você estiver testando ou vendo problemas de desempenho em seus aplicativos React, certifique-se de testar com a [compilação de produção minificada](/downloads.html). A compilação de desenvolvimento inclui avisos extras que são úteis ao criar seus aplicativos, mas é mais lento devido à contabilidade extra que faz.

No entanto, as ferramentas de desempenho descritas nesta página só funcionam ao usar a compilação de desenvolvimento do React. Portanto, o criador de perfil serve apenas para indicar as partes _relativamente_ caras do seu aplicativo.

### Usando Perf {#using-perf}

O objeto `Perf` pode ser usado com React apenas no modo de desenvolvimento. Você não deve incluir esse pacote ao criar seu aplicativo para produção.

#### Obtendo medições {#getting-measurements}

 - [`start()`](#start)
 - [`stop()`](#stop)
 - [`getLastMeasurements()`](#getlastmeasurements)

#### Exibindo resultados {#printing-results}

Os métodos a seguir usam as medidas retornadas por [`Perf.getLastMeasurements()`](#getlastmeasurements) para exibir o resultado de forma bonita.

 - [`printInclusive()`](#printinclusive)
 - [`printExclusive()`](#printexclusive)
 - [`printWasted()`](#printwasted)
 - [`printOperations()`](#printoperations)
 - [`printDOM()`](#printdom)

* * *

## Referência {#reference}

### `start()` {#start}
### `stop()` {#stop}

```javascript
Perf.start()
// ...
Perf.stop()
```

Iniciar/parar a medição. As operações intermediárias do React são registradas para as análises abaixo. As operações que levaram um tempo insignificante são ignoradas.

Depois de parar, você precisará de [`Perf.getLastMeasurements()`](#getlastmeasurements) para obter as medidas.

* * *

### `getLastMeasurements()` {#getlastmeasurements}

```javascript
Perf.getLastMeasurements()
```

Obtenha a estrutura de dados opaca que descreve as medições da última sessão start-stop. Você pode salvá-lo e passá-lo para outros métodos de impressão no [`Perf`](#printing-results) para analisar medições anteriores.

> Nota
>
> Não confie no formato exato do valor de retorno, pois ele pode mudar em versões menores. Atualizaremos a documentação se o formato do valor de retorno se tornar uma parte compatível da API pública.

* * *

### `printInclusive()` {#printinclusive}

```javascript
Perf.printInclusive(measurements)
```

Exibe o tempo total gasto. Quando nenhum argumento é passado, `printInclusive` assume como padrão todas as medidas da última gravação. Isso exibe uma tabela bem formatada no console, assim:

![](../images/docs/perf-inclusive.png)

* * *

### `printExclusive()` {#printexclusive}

```javascript
Perf.printExclusive(measurements)
```

Os tempos "exclusivos (Exclusive)" não incluem os tempos necessários para montar os componentes: processando props, chamando `componentWillMount` e `componentDidMount`, etc.

![](../images/docs/perf-exclusive.png)

* * *

### `printWasted()` {#printwasted}

```javascript
Perf.printWasted(measurements)
```

**A parte mais útil do criador de perfil**.

O tempo "desperdiçado (Wasted)" é gasto em componentes que na verdade não renderizaram nada, por exemplo, a renderização permaneceu a mesma, então o DOM não foi tocado.

![](../images/docs/perf-wasted.png)

* * *

### `printOperations()` {#printoperations}

```javascript
Perf.printOperations(measurements)
```

Exibe as manipulações do DOM subjacentes, por exemplo "set innerHTML" e "remove".

![](../images/docs/perf-dom.png)

* * *

### `printDOM()` {#printdom}

```javascript
Perf.printDOM(measurements)
```

Este método foi renomeado para [`printOperations()`](#printoperations). Atualmente `printDOM()` ainda existe como um alias, mas imprime um aviso de descontinuação e eventualmente será removido.
