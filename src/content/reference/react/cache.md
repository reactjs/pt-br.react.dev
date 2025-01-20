---
title: cache
canary: true
---

<Canary>
* `cache` é apenas para uso com [Componentes do Servidor React](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). Veja [frameworks](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) que suportam Componentes do Servidor React.

* `cache` está disponível apenas nos canais [Canary](/community/versioning-policy#canary-channel) e [experimental](/community/versioning-policy#experimental-channel) do React. Por favor, assegure-se de entender as limitações antes de usar `cache` em produção. Saiba mais sobre [canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).
</Canary>

<Intro>

`cache` permite que você armazene em cache o resultado de uma busca de dados ou computação.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `cache(fn)` {/*cache*/}

Chame `cache` fora de qualquer componente para criar uma versão da função com cache.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Quando `getMetrics` é chamado pela primeira vez com `data`, `getMetrics` chamará `calculateMetrics(data)` e armazenará o resultado em cache. Se `getMetrics` for chamado novamente com os mesmos `data`, ele retornará o resultado em cache em vez de chamar `calculateMetrics(data)` novamente.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

- `fn`: A função para a qual você deseja armazenar resultados em cache. `fn` pode aceitar quaisquer argumentos e retornar qualquer valor.

#### Retornos {/*returns*/}

`cache` retorna uma versão em cache de `fn` com a mesma assinatura de tipo. Ele não chama `fn` no processo.

Ao chamar `cachedFn` com determinados argumentos, ele primeiro verifica se um resultado em cache existe. Se um resultado em cache existir, ele retorna o resultado. Se não, ele chama `fn` com os argumentos, armazena o resultado em cache e retorna o resultado. A única vez que `fn` é chamado é quando há uma falha no cache.

<Note>

A otimização de armazenar em cache valores de retorno com base em entradas é conhecida como [_memoização_](https://en.wikipedia.org/wiki/Memoization). Nós nos referimos à função retornada de `cache` como uma função memoizada.

</Note>

#### Ressalvas {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- O React invalidará o cache para todas as funções memoizadas para cada solicitação do servidor. 
- Cada chamada a `cache` cria uma nova função. Isso significa que chamar `cache` com a mesma função várias vezes retornará diferentes funções memoizadas que não compartilham o mesmo cache.
- `cachedFn` também armazenará em cache erros. Se `fn` lançar um erro para determinados argumentos, ele será armazenado em cache, e o mesmo erro será relançado quando `cachedFn` for chamado com esses mesmos argumentos.
- `cache` é para uso apenas em [Componentes do Servidor](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

---

## Uso {/*usage*/}

### Armazenar em cache uma computação cara {/*cache-expensive-computation*/}

Use `cache` para evitar trabalho duplicado.

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

Se o mesmo objeto `user` for renderizado em ambos `Profile` e `TeamReport`, os dois componentes podem compartilhar trabalho e chamar `calculateUserMetrics` apenas uma vez para aquele `user`. 

Suponha que `Profile` seja renderizado primeiro. Ele chamará <CodeStep step={1}>`getUserMetrics`</CodeStep> e verificará se há um resultado em cache. Como é a primeira vez que `getUserMetrics` é chamado com aquele `user`, haverá uma falha no cache. `getUserMetrics` chamará então `calculateUserMetrics` com aquele `user` e gravará o resultado em cache. 

Quando `TeamReport` renderiza sua lista de `users` e chega ao mesmo objeto `user`, ele chamará <CodeStep step={2}>`getUserMetrics`</CodeStep> e lerá o resultado do cache.

<Pitfall>

##### Chamar diferentes funções memoizadas lerá de caches diferentes. {/*pitfall-different-memoized-functions*/}

Para acessar o mesmo cache, os componentes devem chamar a mesma função memoizada.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Errado: Chamar `cache` no componente cria um novo `getWeekReport` para cada renderização
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Errado: `getWeekReport` está acessível apenas para o componente `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

No exemplo acima, <CodeStep step={2}>`Precipitation`</CodeStep> e <CodeStep step={1}>`Temperature`</CodeStep> cada um chama `cache` para criar uma nova função memoizada com sua própria consulta de cache. Se ambos os componentes renderizarem para o mesmo `cityData`, eles farão trabalho duplicado ao chamar `calculateWeekReport`.

Além disso, `Temperature` cria uma <CodeStep step={1}>nova função memoizada</CodeStep> cada vez que o componente é renderizado, o que não permite nenhum compartilhamento de cache.

Para maximizar os acertos de cache e reduzir o trabalho, os dois componentes devem chamar a mesma função memoizada para acessar o mesmo cache. Em vez disso, defina a função memoizada em um módulo dedicado que pode ser [`importado`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) entre componentes.

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
Aqui, ambos os componentes chamam a <CodeStep step={3}>mesma função memoizada</CodeStep> exportada de `./getWeekReport.js` para ler e gravar no mesmo cache. 
</Pitfall>

### Compartilhar um instantâneo de dados {/*take-and-share-snapshot-of-data*/}

Para compartilhar um instantâneo de dados entre componentes, chame `cache` com uma função de busca de dados como `fetch`. Quando vários componentes realizam a mesma busca de dados, apenas uma solicitação é feita e os dados retornados são armazenados em cache e compartilhados entre os componentes. Todos os componentes referem-se ao mesmo instantâneo de dados na renderização do servidor. 

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

Se `AnimatedWeatherCard` e `MinimalWeatherCard` ambos renderizarem para o mesmo <CodeStep step={1}>city</CodeStep>, eles receberão o mesmo instantâneo de dados da <CodeStep step={2}>função memoizada</CodeStep>. 

Se `AnimatedWeatherCard` e `MinimalWeatherCard` fornecerem diferentes <CodeStep step={1}>argumentos city</CodeStep> para <CodeStep step={2}>`getTemperature`</CodeStep>, então `fetchTemperature` será chamado duas vezes e cada local de chamada receberá dados diferentes.

O <CodeStep step={1}>city</CodeStep> atua como uma chave de cache.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>A renderização assíncrona</CodeStep> é suportada apenas para Componentes do Servidor.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'Para renderizar componentes que usam dados assíncronos em Componentes do Cliente, veja a documentação de `use`.'

</Note>

### Pré-carregar dados {/*preload-data*/}

Ao armazenar em cache uma busca de dados de longa duração, você pode iniciar o trabalho assíncrono antes de renderizar o componente.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

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
  // ✅ Bom: comece a buscar os dados do usuário
  getUser(id);
  // ... algum trabalho computacional
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Ao renderizar `Page`, o componente chama <CodeStep step={1}>`getUser`</CodeStep> mas note que não usa os dados retornados. Esta chamada inicial <CodeStep step={1}>`getUser`</CodeStep> inicia a consulta assíncrona ao banco de dados que ocorre enquanto `Page` está fazendo outro trabalho computacional e renderizando filhos.

Ao renderizar `Profile`, chamamos <CodeStep step={2}>`getUser`</CodeStep> novamente. Se a chamada inicial <CodeStep step={1}>`getUser`</CodeStep> já retornou e armazenou em cache os dados do usuário, quando `Profile` <CodeStep step={2}>pede e aguarda esses dados</CodeStep>, ele pode simplesmente ler do cache sem precisar de outra chamada remota. Se a <CodeStep step={1}>solicitação de dados inicial</CodeStep> não tiver sido concluída, a pré-carga de dados neste padrão reduz o atraso na busca de dados.

<DeepDive>

#### Armazenando em cache o trabalho assíncrono {/*caching-asynchronous-work*/}

Ao avaliar uma [função assíncrona](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), você receberá uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) para esse trabalho. A promessa mantém o estado desse trabalho (_pendente_, _cumprido_, _falhou_) e seu eventual resultado resolvido.

Neste exemplo, a função assíncrona <CodeStep step={1}>`fetchData`</CodeStep> retorna uma promessa que está aguardando o `fetch`. 

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... algum trabalho computacional  
  await getData();
  // ...
}
```

Ao chamar <CodeStep step={2}>`getData`</CodeStep> pela primeira vez, a promessa retornada de <CodeStep step={1}>`fetchData`</CodeStep> é armazenada em cache. Busca subsequentes retornarão então a mesma promessa.

Note que a primeira chamada <CodeStep step={2}>`getData`</CodeStep> não `await`, enquanto a <CodeStep step={3}>segunda</CodeStep> sim. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) é um operador JavaScript que aguardará e retornará o resultado resolvido da promessa. A primeira chamada <CodeStep step={2}>`getData`</CodeStep> simplesmente inicia o `fetch` para armazenar a promessa para que a segunda <CodeStep step={3}>`getData`</CodeStep> a consulte.

Se na <CodeStep step={3}>segunda chamada</CodeStep> a promessa ainda estiver _pendente_, então `await` irá pausar para o resultado. A otimização é que enquanto aguardamos o `fetch`, o React pode continuar com o trabalho computacional, reduzindo assim o tempo de espera para a <CodeStep step={3}>segunda chamada</CodeStep>. 

Se a promessa já estiver resolvida, seja para um erro ou para o resultado _cumprido_, `await` retornará esse valor imediatamente. Em ambos os resultados, há um benefício de desempenho.
</DeepDive>

<Pitfall>

##### Chamar uma função memoizada fora de um componente não usará o cache. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Errado: Chamar função memoizada fora do componente não fará a memoização.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Bom: `getUser` fará a memoização.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

O React só fornece acesso ao cache da função memoizada em um componente. Ao chamar <CodeStep step={1}>`getUser`</CodeStep> fora de um componente, ele ainda avaliará a função, mas não lerá ou atualizará o cache.

Isso ocorre porque o acesso ao cache é fornecido através de um [contexto](/learn/passing-data-deeply-with-context) que só é acessível a partir de um componente. 

</Pitfall>

<DeepDive>

#### Quando devo usar `cache`, [`memo`](/reference/react/memo) ou [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Todas as APIs mencionadas oferecem memoização, mas a diferença está no que elas pretendem memoizar, quem pode acessar o cache e quando seu cache é invalidado.

#### `useMemo` {/*deep-dive-use-memo*/}

Em geral, você deve usar [`useMemo`](/reference/react/useMemo) para armazenar em cache uma computação cara em um Componente do Cliente entre renderizações. Como exemplo, para memoizar uma transformação de dados dentro de um componente.

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record)), record);
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
Neste exemplo, `App` renderiza dois `WeatherReport`s com o mesmo registro. Embora ambos os componentes façam o mesmo trabalho, eles não podem compartilhar o trabalho. O cache de `useMemo` é apenas local ao componente.

No entanto, `useMemo` garante que se `App` re-renderizar e o objeto `record` não mudar, cada instância do componente pulará o trabalho e usará o valor memoizado de `avgTemp`. `useMemo` só armazenará em cache a última computação de `avgTemp` com as dependências dadas. 

#### `cache` {/*deep-dive-cache*/}

Em geral, você deve usar `cache` em Componentes do Servidor para memoizar trabalho que pode ser compartilhado entre componentes.

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
Reescrevendo o exemplo anterior para usar `cache`, neste caso a <CodeStep step={3}>segunda instância de `WeatherReport`</CodeStep> poderá pular trabalho duplicado e ler do mesmo cache que a <CodeStep step={1}>primeira `WeatherReport`</CodeStep>. Outra diferença em relação ao exemplo anterior é que `cache` também é recomendado para <CodeStep step={2}>memoizar buscas de dados</CodeStep>, ao contrário de `useMemo`, que só deve ser usado para computações.

No momento, `cache` deve ser usado apenas em Componentes do Servidor e o cache será invalidado entre solicitações do servidor.

#### `memo` {/*deep-dive-memo*/}

Você deve usar [`memo`](reference/react/memo) para evitar que um componente re-renderize se suas props não mudaram.

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

Neste exemplo, ambos os componentes `MemoWeatherReport` chamarão `calculateAvg` quando forem renderizados pela primeira vez. No entanto, se `App` re-renderizar, sem alterações no `record`, nenhuma das props mudará e `MemoWeatherReport` não re-renderizará. 

Comparado a `useMemo`, `memo` memoiza a renderização do componente com base nas props em vez de computações específicas. Semelhante a `useMemo`, o componente memoizado armazena em cache apenas a última renderização com os últimos valores de props. Assim que as props mudam, o cache é invalidado e o componente re-renderiza.

</DeepDive>

---

## Solução de Problemas {/*troubleshooting*/}

### Minha função memoizada ainda é executada mesmo que eu a tenha chamado com os mesmos argumentos {/*memoized-function-still-runs*/}

Veja as armadilhas mencionadas anteriormente
* [Chamar diferentes funções memoizadas lerá de caches diferentes.](#pitfall-different-memoized-functions)
* [Chamar uma função memoizada fora de um componente não usará o cache.](#pitfall-memoized-call-outside-component)

Se nenhuma das acima se aplicar, pode ser um problema com como o React verifica se algo existe em cache.

Se seus argumentos não forem [primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ex. objetos, funções, arrays), certifique-se de passar a mesma referência de objeto.

Ao chamar uma função memoizada, o React procurará os argumentos de entrada para ver se um resultado já está em cache. O React usará igualdade rasa dos argumentos para determinar se há um acerto de cache.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Errado: props é um objeto que muda a cada renderização.
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

Neste caso, os dois `MapMarker`s parecem estar fazendo o mesmo trabalho e chamando `calculateNorm` com o mesmo valor de `{x: 10, y: 10, z:10}`. Embora os objetos contenham os mesmos valores, eles não são a mesma referência de objeto, pois cada componente cria seu próprio objeto `props`.

O React chamará [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) na entrada para verificar se há um acerto de cache.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Bom: Passe primitivos para a função memoizada
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

Uma maneira de resolver isso pode ser passar as dimensões do vetor para `calculateNorm`. Isso funciona porque as dimensões são primitivos.

Outra solução pode ser passar o objeto vetor em si como um prop para o componente. Precisaremos passar o mesmo objeto para ambas as instâncias do componente.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Bom: Passe o mesmo objeto `vector`
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