---
title: cache
---

<RSC>

<<<<<<< HEAD
`cache` é apenas para uso com [Componentes React Server](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).
=======
`cache` is only for use with [React Server Components](/reference/rsc/server-components).
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

</RSC>

<Intro>

`cache` permite que você faça cache do resultado de uma busca ou computação de dados.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `cache(fn)` {/*cache*/}

Chame `cache` fora de quaisquer componentes para criar uma versão da função com cache.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Quando `getMetrics` for chamado pela primeira vez com `data`, `getMetrics` chamará `calculateMetrics(data)` e armazenará o resultado no cache. Se `getMetrics` for chamado novamente com os mesmos `data`, ele retornará o resultado em cache em vez de chamar `calculateMetrics(data)` novamente.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

- `fn`: A função para a qual você deseja armazenar resultados em cache. `fn` pode receber quaisquer argumentos e retornar qualquer valor.

#### Retorna {/*returns*/}

`cache` retorna uma versão em cache de `fn` com a mesma assinatura de tipo. Ele não chama `fn` no processo.

Ao chamar `cachedFn` com argumentos fornecidos, ele primeiro verifica se um resultado em cache existe no cache. Se um resultado em cache existir, ele o retorna. Caso contrário, ele chama `fn` com os argumentos, armazena o resultado no cache e retorna o resultado. A única vez em que `fn` é chamado é quando há uma falha no cache.

<Note>

A otimização de armazenamento em cache de valores de retorno com base nas entradas é conhecida como [_memoization_](https://en.wikipedia.org/wiki/Memoization). Nos referimos à função retornada de `cache` como uma função memoizada.

</Note>

#### Ressalvas {/*caveats*/}

<<<<<<< HEAD
[//]: # 'TODO: adicionar links para a referência de Componente Servidor/Cliente assim que https://github.com/reactjs/react.dev/pull/6177 for mesclado'

- React invalidará o cache de todas as funções memoizadas para cada solicitação do servidor.
- Cada chamada para `cache` cria uma nova função. Isso significa que chamar `cache` com a mesma função várias vezes retornará diferentes funções memoizadas que não compartilham o mesmo cache.
- `cachedFn` também armazenará erros em cache. Se `fn` lançar um erro para determinados argumentos, ele será armazenado em cache e o mesmo erro será relançado quando `cachedFn` for chamado com esses mesmos argumentos.
- `cache` é para uso somente em [Componentes de Servidor](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).
=======
- React will invalidate the cache for all memoized functions for each server request.
- Each call to `cache` creates a new function. This means that calling `cache` with the same function multiple times will return different memoized functions that do not share the same cache.
- `cachedFn` will also cache errors. If `fn` throws an error for certain arguments, it will be cached, and the same error is re-thrown when `cachedFn` is called with those same arguments.
- `cache` is for use in [Server Components](/reference/rsc/server-components) only.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

---

## Uso {/*usage*/}

### Fazer cache de uma computação cara {/*cache-expensive-computation*/}

Use `cache` para pular o trabalho duplicado.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

<<<<<<< HEAD
Se o mesmo objeto `user` for renderizado em `Profile` e `TeamReport`, os dois componentes podem compartilhar o trabalho e chamar `calculateUserMetrics` apenas uma vez para esse `user`.

Suponha que `Profile` seja renderizado primeiro. Ele chamará <CodeStep step={1}>`getUserMetrics`</CodeStep> e verificará se há um resultado em cache. Como é a primeira vez que `getUserMetrics` é chamado com esse `user`, haverá uma falha no cache. `getUserMetrics` então chamará `calculateUserMetrics` com esse `user` e gravará o resultado no cache.
=======
If the same `user` object is rendered in both `Profile` and `TeamReport`, the two components can share work and only call `calculateUserMetrics` once for that `user`.

Assume `Profile` is rendered first. It will call <CodeStep step={1}>`getUserMetrics`</CodeStep>, and check if there is a cached result. Since it is the first time `getUserMetrics` is called with that `user`, there will be a cache miss. `getUserMetrics` will then call `calculateUserMetrics` with that `user` and write the result to cache.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

Quando `TeamReport` renderizar sua lista de `users` e atingir o mesmo objeto `user`, ele chamará <CodeStep step={2}>`getUserMetrics`</CodeStep> e lerá o resultado do cache.

If `calculateUserMetrics` can be aborted by passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), you can use [`cacheSignal()`](/reference/react/cacheSignal) to cancel the expensive computation if React has finished rendering. `calculateUserMetrics` may already handle cancellation internally by using `cacheSignal` directly.

<Pitfall>

##### Chamar funções memoizadas diferentes lerá de caches diferentes. {/*pitfall-different-memoized-functions*/}

Para acessar o mesmo cache, os componentes devem chamar a mesma função memoizada.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Incorreto: chamar 'cache' no componente cria um novo 'getWeekReport' para cada renderização
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Incorreto: 'getWeekReport' só é acessível para o componente 'Precipitation'.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

No exemplo acima, <CodeStep step={2}>`Precipitation`</CodeStep> e <CodeStep step={1}>`Temperature`</CodeStep> cada um chama `cache` para criar uma nova função memoizada com sua própria busca de cache. Se ambos os componentes renderizarem para o mesmo `cityData`, eles farão um trabalho duplicado para chamar `calculateWeekReport`.

Além disso, `Temperature` cria uma <CodeStep step={1}>nova função memoizada</CodeStep> cada vez que o componente é renderizado, o que não permite nenhum compartilhamento de cache.

Para maximizar as ocorrências de cache e reduzir o trabalho, os dois componentes devem chamar a mesma função memoizada para acessar o mesmo cache. Em vez disso, defina a função memoizada em um módulo dedicado que pode ser [`import`-ado](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) em todos os componentes.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
<<<<<<< HEAD
Aqui, ambos os componentes chamam a <CodeStep step={3}>mesma função memoizada</CodeStep> exportada de `./getWeekReport.js` para ler e gravar no mesmo cache.
=======
Here, both components call the <CodeStep step={3}>same memoized function</CodeStep> exported from `./getWeekReport.js` to read and write to the same cache.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
</Pitfall>

### Compartilhar um snapshot de dados {/*take-and-share-snapshot-of-data*/}

<<<<<<< HEAD
Para compartilhar um snapshot de dados entre componentes, chame `cache` com uma função de busca de dados como `fetch`. Quando vários componentes fazem a mesma busca de dados, apenas uma solicitação é feita e os dados retornados são armazenados em cache e compartilhados entre os componentes. Todos os componentes se referem ao mesmo snapshot de dados na renderização do servidor.
=======
To share a snapshot of data between components, call `cache` with a data-fetching function like `fetch`. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. All components refer to the same snapshot of data across the server render.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

<<<<<<< HEAD
Se `AnimatedWeatherCard` e `MinimalWeatherCard` renderizarem para a mesma <CodeStep step={1}>cidade</CodeStep>, eles receberão o mesmo snapshot de dados da <CodeStep step={2}>função memoizada</CodeStep>.
=======
If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same <CodeStep step={1}>city</CodeStep>, they will receive the same snapshot of data from the <CodeStep step={2}>memoized function</CodeStep>.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

Se `AnimatedWeatherCard` e `MinimalWeatherCard` fornecerem argumentos diferentes de <CodeStep step={1}>cidade</CodeStep> para <CodeStep step={2}>`getTemperature`</CodeStep>, então `fetchTemperature` será chamado duas vezes e cada site de chamada receberá dados diferentes.

A <CodeStep step={1}>cidade</CodeStep> atua como uma chave de cache.

<Note>

<<<<<<< HEAD
[//]: # 'TODO: adicionar links para Componentes de Servidor quando mesclado.'

<CodeStep step={3}>Renderização assíncrona</CodeStep> é suportada apenas para Componentes de Servidor.
=======
<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
<<<<<<< HEAD
[//]: # 'TODO: adicionar link e mencionar para usar a documentação quando for mesclado'
[//]: # 'Para renderizar componentes que usam dados assíncronos em Componentes Cliente, consulte a documentação `use`.'
=======

To render components that use asynchronous data in Client Components, see [`use()` documentation](/reference/react/use).
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

</Note>

### Pré-carregar dados {/*preload-data*/}

Ao armazenar em cache uma busca de dados de longa duração, você pode iniciar o trabalho assíncrono antes de renderizar o componente.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Bom: começar a buscar os dados do usuário
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Ao renderizar `Page`, o componente chama <CodeStep step={1}>`getUser`</CodeStep>, mas observe que ele não usa os dados retornados. Essa primeira chamada <CodeStep step={1}>`getUser`</CodeStep> inicia a consulta assíncrona do banco de dados que ocorre enquanto `Page` está fazendo outro trabalho computacional e renderizando os filhos.

Ao renderizar `Profile`, chamamos <CodeStep step={2}>`getUser`</CodeStep> novamente. Se a chamada inicial <CodeStep step={1}>`getUser`</CodeStep> já tiver retornado e armazenado em cache os dados do usuário, quando `Profile` <CodeStep step={2}>pedir e esperar por esses dados</CodeStep>, ele poderá simplesmente ler do cache sem exigir outra chamada de procedimento remoto. Se a <CodeStep step={1}>solicitação de dados inicial</CodeStep> não foi concluída, o pré-carregamento de dados nesse padrão reduz o atraso na busca de dados.

<DeepDive>

#### Armazenamento em cache de trabalho assíncrono {/*caching-asynchronous-work*/}

Ao avaliar uma [função assíncrona](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), você receberá uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) para esse trabalho. A promise contém o estado desse trabalho (_pendente_, _cumprido_, _falhou_) e seu eventual resultado resolvido.

<<<<<<< HEAD
Neste exemplo, a função assíncrona <CodeStep step={1}>`fetchData`</CodeStep> retorna uma promise que está aguardando o `fetch`.
=======
In this example, the asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> returns a promise that is awaiting the `fetch`.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work
  await getData();
  // ...
}
```

Ao chamar <CodeStep step={2}>`getData`</CodeStep> pela primeira vez, a promise retornada de <CodeStep step={1}>`fetchData`</CodeStep> é armazenada em cache. As pesquisas subsequentes retornarão a mesma promise.

Observe que a primeira chamada <CodeStep step={2}>`getData`</CodeStep> não faz `await`, enquanto a <CodeStep step={3}>segunda</CodeStep> faz. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) é um operador JavaScript que esperará e retornará o resultado resolvido da promise. A primeira chamada <CodeStep step={2}>`getData`</CodeStep> simplesmente inicia o `fetch` para armazenar em cache a promise para a <CodeStep step={3}>segunda</CodeStep> pesquisa <CodeStep step={2}>`getData`</CodeStep>.

<<<<<<< HEAD
Se na <CodeStep step={3}>segunda chamada</CodeStep>, a promise ainda estiver _pendente_, então `await` irá pausar pelo resultado. A otimização é que, enquanto esperamos pelo `fetch`, o React pode continuar com o trabalho computacional, reduzindo assim o tempo de espera para a <CodeStep step={3}>segunda chamada</CodeStep>.
=======
If by the <CodeStep step={3}>second call</CodeStep> the promise is still _pending_, then `await` will pause for the result. The optimization is that while we wait on the `fetch`, React can continue with computational work, thus reducing the wait time for the <CodeStep step={3}>second call</CodeStep>.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

Se a promise já estiver resolvida, seja para um erro ou para o resultado _cumprido_, `await` retornará esse valor imediatamente. Em ambos os resultados, há um benefício de desempenho.
</DeepDive>

<Pitfall>

##### Chamar uma função memoizada fora de um componente não usará o cache. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Incorreto: chamar a função memoizada fora do componente não fará memoização.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Correto: `getUser` irá memoizar.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React apenas fornece acesso ao cache para a função memoizada em um componente. Ao chamar <CodeStep step={1}>`getUser`</CodeStep> fora de um componente, ele ainda avaliará a função, mas não lerá ou atualizará o cache.

<<<<<<< HEAD
Isso ocorre porque o acesso ao cache é fornecido por meio de um [contexto](/learn/passing-data-deeply-with-context), que só é acessível de um componente.
=======
This is because cache access is provided through a [context](/learn/passing-data-deeply-with-context) which is only accessible from a component.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

</Pitfall>

<DeepDive>

#### Quando devo usar `cache`, [`memo`](/reference/react/memo) ou [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Todas as APIs mencionadas oferecem memoização, mas a diferença é o que elas se destinam a memoizar, quem pode acessar o cache e quando seu cache é invalidado.

#### `useMemo` {/*deep-dive-use-memo*/}

Em geral, você deve usar [`useMemo`](/reference/react/useMemo) para armazenar em cache uma computação cara em um Componente Cliente em várias renderizações. Como exemplo, para memoizar uma transformação de dados dentro de um componente.

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
Neste exemplo, `App` renderiza dois `WeatherReport`s com o mesmo registro. Mesmo que ambos os componentes façam o mesmo trabalho, eles não podem compartilhar o trabalho. O cache de `useMemo` é apenas local ao componente.

<<<<<<< HEAD
No entanto, `useMemo` garante que, se `App` renderizar novamente e o objeto `record` não mudar, cada instância do componente pulará o trabalho e usará o valor memoizado de `avgTemp`. `useMemo` só armazenará em cache a última computação de `avgTemp` com as dependências fornecidas.
=======
However, `useMemo` does ensure that if `App` re-renders and the `record` object doesn't change, each component instance would skip work and use the memoized value of `avgTemp`. `useMemo` will only cache the last computation of `avgTemp` with the given dependencies.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

#### `cache` {/*deep-dive-cache*/}

Em geral, você deve usar `cache` em Componentes de Servidor para memoizar o trabalho que pode ser compartilhado entre os componentes.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
Reescrevendo o exemplo anterior para usar `cache`, neste caso a <CodeStep step={3}>segunda instância de `WeatherReport`</CodeStep> poderá pular o trabalho duplicado e ler do mesmo cache que a <CodeStep step={1}>primeira `WeatherReport`</CodeStep>. Outra diferença em relação ao exemplo anterior é que `cache` também é recomendado para <CodeStep step={2}>memoizar buscas de dados</CodeStep>, ao contrário de `useMemo`, que deve ser usado apenas para computações.

No momento, `cache` deve ser usado apenas em Componentes de Servidor e o cache será invalidado em solicitações de servidor.

#### `memo` {/*deep-dive-memo*/}

Você deve usar [`memo`](reference/react/memo) para impedir que um componente seja renderizado novamente se suas props não forem alteradas.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

<<<<<<< HEAD
Neste exemplo, ambos os componentes `MemoWeatherReport` chamarão `calculateAvg` quando renderizados pela primeira vez. No entanto, se `App` renderizar novamente, sem alterações no `record`, nenhuma das props foi alterada e `MemoWeatherReport` não será renderizado novamente.
=======
In this example, both `MemoWeatherReport` components will call `calculateAvg` when first rendered. However, if `App` re-renders, with no changes to `record`, none of the props have changed and `MemoWeatherReport` will not re-render.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

Em comparação com `useMemo`, `memo` memoiza a renderização do componente com base nas props vs. computações específicas. Semelhante a `useMemo`, o componente memoizado só armazena em cache a última renderização com os últimos valores de prop. Assim que as props mudam, o cache é invalidado e o componente é renderizado novamente.

</DeepDive>

---

## solução de problemas {/*troubleshooting*/}

### Minha função memoizada ainda é executada, embora eu a tenha chamado com os mesmos argumentos {/*memoized-function-still-runs*/}

Veja as armadilhas mencionadas anteriormente
* [Chamar funções memoizadas diferentes lerá de caches diferentes.](#pitfall-different-memoized-functions)
* [Chamar uma função memoizada fora de um componente não usará o cache.](#pitfall-memoized-call-outside-component)

Se nada do acima se aplicar, pode ser um problema com a forma como o React verifica se algo existe no cache.

Se seus argumentos não forem [primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ex. objetos, funções, arrays), certifique-se de passar a mesma referência de objeto.

Ao chamar uma função memoizada, o React procurará os argumentos de entrada para ver se um resultado já está em cache. React usará a igualdade superficial dos argumentos para determinar se há uma ocorrência de cache.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Incorreto: props é um objeto que muda a cada renderização.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Nesse caso, os dois `MapMarker`s parecem estar fazendo o mesmo trabalho e chamando `calculateNorm` com o mesmo valor de `{x: 10, y: 10, z:10}`. Mesmo que os objetos contenham os mesmos valores, eles não são a mesma referência de objeto, pois cada componente cria seu próprio objeto `props`.

O React chamará [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) na entrada para verificar se há uma ocorrência de cache.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Correto: Passe primitivos para a função memoizada
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Uma maneira de resolver isso seria passar as dimensões do vetor para `calculateNorm`. Isso funciona porque as próprias dimensões são primitivos.

Outra solução pode ser passar o próprio objeto vetor como uma prop para o componente. Precisaremos passar o mesmo objeto para ambas as instâncias de componente.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Correto: Passar o mesmo objeto `vector`
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
