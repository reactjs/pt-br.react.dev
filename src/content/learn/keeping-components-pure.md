---
title: Mantendo Componentes Puras
---

<Intro>

Algumas funções JavaScript são *purificadas.* Funções puras apenas realizam um cálculo e nada mais. Ao escrever estritamente seus componentes como funções puras, você pode evitar uma classe inteira de bugs confusos e comportamentos imprevisíveis à medida que sua base de código cresce. Para obter esses benefícios, no entanto, há algumas regras que você deve seguir.

</Intro>

<YouWillLearn>

* O que é pureza e como isso ajuda você a evitar bugs
* Como manter os componentes puros mantendo as mudanças fora da fase de renderização
* Como usar o Modo Estrito para encontrar erros em seus componentes

</YouWillLearn>

## Pureza: Componentes como fórmulas {/*purity-components-as-formulas*/}

Na ciência da computação (e especialmente no mundo da programação funcional), [uma função pura](https://wikipedia.org/wiki/Pure_function) é uma função com as seguintes características:

* **Ela cuida dos seus próprios assuntos.** Ela não altera nenhum objeto ou variável que existia antes de ser chamada.
* **Mesmos inputs, mesma saída.** Dado os mesmos inputs, uma função pura deve sempre retornar o mesmo resultado.

Você pode já estar familiarizado com um exemplo de funções puras: fórmulas em matemática.

Considere esta fórmula matemática: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Se <Math><MathI>x</MathI> = 2</Math>, então <Math><MathI>y</MathI> = 4</Math>. Sempre.

Se <Math><MathI>x</MathI> = 3</Math>, então <Math><MathI>y</MathI> = 6</Math>. Sempre.

Se <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> não será às vezes <Math>9</Math> ou <Math>–1</Math> ou <Math>2.5</Math> dependendo da hora do dia ou do estado do mercado de ações.

Se <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> e <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> _sempre_ será <Math>6</Math>.

Se nós fizermos isso em uma função JavaScript, ela se pareceria com isso:

```js
function double(number) {
  return 2 * number;
}
```

No exemplo acima, `double` é uma **função pura.** Se você passar `3`, ela retornará `6`. Sempre.

O React é projetado em torno desse conceito. **O React assume que todo componente que você escreve é uma função pura.** Isso significa que os componentes React que você escreve devem sempre retornar o mesmo JSX dado os mesmos inputs:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Ferva {drinkers} xícaras de água.</li>
      <li>Adicione {drinkers} colheres de chá e {0.5 * drinkers} colheres de especiarias.</li>
      <li>Adicione {0.5 * drinkers} xícaras de leite para ferver e açúcar a gosto.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Receita de Chai Temperado</h1>
      <h2>Para dois</h2>
      <Recipe drinkers={2} />
      <h2>Para uma reunião</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Quando você passa `drinkers={2}` para `Recipe`, ele retornará JSX contendo `2 xícaras de água`. Sempre.

Se você passar `drinkers={4}`, ele retornará JSX contendo `4 xícaras de água`. Sempre.

Assim como uma fórmula matemática.

Você poderia pensar nos seus componentes como receitas: se você segui-los e não introduzir novos ingredientes durante o processo de cozimento, você obterá o mesmo prato toda vez. Esse "prato" é o JSX que o componente serve ao React para [renderizar.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Uma receita de chá para x pessoas: leve x xícaras de água, adicione x colheres de chá e 0.5x colheres de especiarias, e 0.5x xícaras de leite" />

## Efeitos Colaterais: consequências (não) intencionais {/*side-effects-unintended-consequences*/}

O processo de renderização do React deve sempre ser puro. Os componentes devem apenas *retornar* seu JSX, e não *alterar* nenhum objeto ou variável que existia antes da renderização — isso os tornaria impuros!

Aqui está um componente que quebra essa regra:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Mau: alterando uma variável preexistente!
  guest = guest + 1;
  return <h2>Xícara de chá para o convidado #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Este componente está lendo e escrevendo uma variável `guest` declarada fora dele. Isso significa que **chamar este componente múltiplas vezes produzirá JSX diferente!** E o que é mais, se _outros_ componentes lerem `guest`, eles também produzirão JSX diferente, dependendo de quando foram renderizados! Isso não é previsível.

Voltando à nossa fórmula <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, agora mesmo se <Math><MathI>x</MathI> = 2</Math>, não podemos confiar que <Math><MathI>y</MathI> = 4</Math>. Nossos testes poderiam falhar, nossos usuários ficariam confusos, aviões cairiam do céu — você pode ver como isso levaria a bugs confusos!

Você pode corrigir este componente [passando `guest` como uma prop em vez](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Xícara de chá para o convidado #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Agora seu componente é puro, pois o JSX que ele retorna depende apenas da prop `guest`.

Em geral, você não deve esperar que seus componentes sejam renderizados em uma ordem particular. Não importa se você chama <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> antes ou depois de <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: ambas as fórmulas resolverão independentemente uma da outra. Da mesma forma, cada componente deve apenas "pensar por si mesmo", e não tentar coordenar ou depender de outros durante a renderização. Renderizar é como um exame escolar: cada componente deve calcular o JSX por conta própria!

<DeepDive>

#### Detectando cálculos impuros com o Modo Estrito {/*detecting-impure-calculations-with-strict-mode*/}

Embora você ainda possa não ter usado todos eles, no React existem três tipos de inputs que você pode ler durante a renderização: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory) e [context.](/learn/passing-data-deeply-with-context) Você deve sempre tratar esses inputs como somente leitura.

Quando você quer *mudar* algo em resposta à entrada do usuário, você deve [definir o estado](/learn/state-a-components-memory) em vez de escrever em uma variável. Você nunca deve alterar variáveis ou objetos preexistentes enquanto seu componente está renderizando.

O React oferece um "Modo Estrito" no qual ele chama a função de cada componente duas vezes durante o desenvolvimento. **Ao chamar as funções de componentes duas vezes, o Modo Estrito ajuda a encontrar componentes que quebram essas regras.**

Note como o exemplo original exibiu "Convidado #2", "Convidado #4", e "Convidado #6" ao invés de "Convidado #1", "Convidado #2", e "Convidado #3". A função original era impura, então chamá-la duas vezes a quebrou. Mas a versão pura corrigida funciona mesmo se a função for chamada duas vezes a cada vez. **Funções puras apenas calculam, então chamá-las duas vezes não mudará nada** — assim como chamar `double(2)` duas vezes não muda o que é retornado, e resolver <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> duas vezes não muda o que <MathI>y</MathI> é. Mesmos inputs, mesmas saídas. Sempre.

O Modo Estrito não tem efeito na produção, então não irá desacelerar o aplicativo para seus usuários. Para optar pelo Modo Estrito, você pode envolver seu componente raiz em `<React.StrictMode>`. Algumas estruturas fazem isso por padrão.

</DeepDive>

### Mutação Local: O pequeno segredo do seu componente {/*local-mutation-your-components-little-secret*/}

No exemplo acima, o problema era que o componente mudou uma variável *preexistente* durante a renderização. Isso é frequentemente chamado de **"mutação"** para torná-lo um pouco mais assustador. Funções puras não mutam variáveis fora do escopo da função ou objetos que foram criados antes da chamada — isso as torna impuras!

No entanto, **é completamente aceitável mudar variáveis e objetos que você *acabou de* criar durante a renderização.** Neste exemplo, você cria um array `[]`, atribui-o a uma variável `cups`, e então `push` uma dúzia de xícaras nele:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Xícara de chá para o convidado #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Se a variável `cups` ou o array `[]` fossem criados fora da função `TeaGathering`, isso seria um grande problema! Você estaria mudando um objeto *preexistente* ao adicionar itens àquele array.

No entanto, isso é aceitável porque você os criou *durante a mesma renderização*, dentro de `TeaGathering`. Nenhum código fora de `TeaGathering` saberá que isso aconteceu. Isso é chamado de **"mutação local"** — é como o pequeno segredo do seu componente.

## Onde você _pode_ causar efeitos colaterais {/*where-you-_can_-cause-side-effects*/}

Enquanto a programação funcional depende fortemente da pureza, em algum momento, em algum lugar, _algo_ precisa mudar. Esse é meio que o ponto da programação! Essas mudanças — atualizar a tela, iniciar uma animação, mudar os dados — são chamadas de **efeitos colaterais.** São coisas que acontecem _"à parte"_, não durante a renderização.

No React, **efeitos colaterais geralmente pertencem dentro de [manipuladores de eventos.](/learn/responding-to-events)** Manipuladores de eventos são funções que o React executa quando você realiza alguma ação — por exemplo, quando clica em um botão. Mesmo que os manipuladores de eventos sejam definidos *dentro* do seu componente, eles não são executados *durante* a renderização! **Assim, os manipuladores de eventos não precisam ser puros.**

Se você esgotou todas as outras opções e não consegue encontrar o manipulador de eventos certo para seu efeito colateral, você ainda pode anexá-lo ao seu JSX retornado com uma chamada [`useEffect`](/apis/useeffect) em seu componente. Isso diz ao React para executá-lo mais tarde, após a renderização, quando os efeitos colaterais são permitidos. **No entanto, essa abordagem deve ser seu último recurso.**

Quando possível, tente expressar sua lógica apenas com a renderização. Você ficará surpreso com a facilidade que isso pode trazer!

<DeepDive>

#### Por que o React se importa com a pureza? {/*why-does-react-care-about-purity*/}

Escrever funções puras exige um pouco de hábito e disciplina. Mas também desbloqueia oportunidades maravilhosas:

* Seus componentes poderiam ser executados em um ambiente diferente — por exemplo, no servidor! Como eles retornam o mesmo resultado para os mesmos inputs, um componente pode atender a muitos pedidos de usuários.
* Você pode melhorar o desempenho ao [pular a renderização](/reference/react/memo) de componentes cujos inputs não mudaram. Isso é seguro porque funções puras sempre retornam os mesmos resultados, então elas são seguras para serem cacheadas.
* Se alguns dados mudam no meio da renderização de uma árvore de componentes profunda, o React pode reiniciar a renderização sem perder tempo para terminar a renderização antiga. A pureza torna seguro parar de calcular a qualquer momento.

Cada novo recurso do React que estamos construindo aproveita a pureza. Desde busca de dados até animações e desempenho, manter os componentes puros desbloqueia o poder do paradigma React.

</DeepDive>

<Recap>

* Um componente deve ser puro, significando:
  * **Ela cuida dos seus próprios assuntos.** Não deve alterar nenhum objeto ou variável que existia antes da renderização.
  * **Mesmos inputs, mesma saída.** Dado os mesmos inputs, um componente deve sempre retornar o mesmo JSX. 
* A renderização pode acontecer a qualquer momento, então os componentes não devem depender da sequência de renderização uns dos outros.
* Você não deve mutar nenhum dos inputs que seus componentes usam para renderização. Isso inclui props, state e context. Para atualizar a tela, ["defina" o estado](/learn/state-a-components-memory) em vez de mutar objetos preexistentes.
* Esforce-se para expressar a lógica do seu componente no JSX que você retorna. Quando você precisar "mudar as coisas", geralmente você vai querer fazer isso em um manipulador de eventos. Como último recurso, você pode usar `useEffect`.
* Escrever funções puras exige um pouco de prática, mas desbloqueia o poder do paradigma do React.

</Recap>


  
<Challenges>

#### Conserte um relógio quebrado {/*fix-a-broken-clock*/}

Este componente tenta definir a classe CSS do `<h1>` para `"night"` durante o tempo da meia-noite até seis horas da manhã, e `"day"` em todos os outros momentos. No entanto, não funciona. Você pode consertar este componente?

Você pode verificar se sua solução funciona mudando temporariamente o fuso horário do computador. Quando a hora atual estiver entre meia-noite e seis da manhã, o relógio deve ter cores invertidas!

<Hint>

Renderização é uma *cálculo*, não deve tentar "fazer" coisas. Você consegue expressar a mesma ideia de forma diferente?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Você pode consertar este componente calculando a `className` e incluindo-a na saída da renderização:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Neste exemplo, o efeito colateral (modificando o DOM) não era necessário. Você só precisava retornar JSX.

</Solution>

#### Conserte um perfil quebrado {/*fix-a-broken-profile*/}

Dois componentes `Profile` são renderizados lado a lado com dados diferentes. Pressione "Colapsar" no primeiro perfil e depois "Expandir". Você notará que ambos os perfis agora mostram a mesma pessoa. Este é um bug.

Encontre a causa do bug e conserte-o.

<Hint>

O código com bug está em `Profile.js`. Certifique-se de lê-lo de cima a baixo!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Colapsar' : 'Expandir'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

O problema é que o componente `Profile` escreve em uma variável preexistente chamada `currentPerson`, e os componentes `Header` e `Avatar` leem dela. Isso torna *todos três* impuros e difíceis de prever.

Para corrigir o bug, remova a variável `currentPerson`. Em vez disso, passe todas as informações do `Profile` para `Header` e `Avatar` através de props. Você precisará adicionar uma prop `person` a ambos os componentes e passá-la por completo.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Colapsar' : 'Expandir'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Lembre-se de que o React não garante que as funções dos componentes serão executadas em qualquer ordem particular, portanto, você não pode se comunicar entre eles definindo variáveis. Toda comunicação deve ocorrer através de props.

</Solution>

#### Conserte um tray de histórias quebrado {/*fix-a-broken-story-tray*/}

O CEO da sua empresa está pedindo para você adicionar "histórias" ao seu aplicativo de relógio online, e você não pode dizer não. Você escreveu um componente `StoryTray` que aceita uma lista de `stories`, seguido por um espaço reservado "Criar História".

Você implementou o espaço reservado "Criar História" adicionando uma história falsa a mais no final do array `stories` que você recebe como prop. Mas, por algum motivo, "Criar História" aparece mais de uma vez. Corrija o problema.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Criar História'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "História de Ankit" },
  {id: 1, label: "História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Impedir que a memória cresça infinitamente enquanto você lê a documentação.
  // Estamos quebrando nossas próprias regras aqui.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>É {time.toLocaleTimeString()} agora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Note como sempre que o relógio é atualizado, "Criar História" é adicionado *duas vezes*. Isso serve como uma dica de que temos uma mutação durante a renderização - o Modo Estrito chama componentes duas vezes para tornar esses problemas mais perceptíveis.

A função `StoryTray` não é pura. Ao chamar `push` no array `stories` recebido (uma prop!), ela está mutando um objeto que foi criado *antes* do início da renderização de `StoryTray`. Isso a torna cheia de bugs e muito difícil de prever.

A correção mais simples é não tocar no array de forma alguma e renderizar "Criar História" separadamente:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Criar História</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "História de Ankit" },
  {id: 1, label: "História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Impedir que a memória cresça infinitamente enquanto você lê a documentação.
  // Estamos quebrando nossas próprias regras aqui.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>É {time.toLocaleTimeString()} agora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Alternativamente, você poderia criar um _novo_ array (copiando o existente) antes de adicionar um item a ele:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copie o array!
  let storiesToDisplay = stories.slice();

  // Não afeta o array original:
  storiesToDisplay.push({
    id: 'create',
    label: 'Criar História'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "História de Ankit" },
  {id: 1, label: "História de Taylor" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Impedir que a memória cresça infinitamente enquanto você lê a documentação.
  // Estamos quebrando nossas próprias regras aqui.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>É {time.toLocaleTimeString()} agora.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Isso mantém sua mutação local e sua função de renderização pura. No entanto, você ainda precisa ter cuidado: por exemplo, se você tentasse mudar algum dos itens existentes do array, precisaria clonar esses itens também.

É útil lembrar quais operações em arrays os mutam e quais não. Por exemplo, `push`, `pop`, `reverse` e `sort` irão mutar o array original, mas `slice`, `filter` e `map` criarão um novo.

</Solution>

</Challenges>