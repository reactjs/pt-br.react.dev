---
title: Reagindo à entrada de dados com state 
---

<Intro>

React oferece uma maneira declarativa de manipular a interface do usuário. Em vez de manipular diretamente partes individuais da UI, você descreve os diferentes estados em que seu componente pode estar e alterna entre eles em resposta à entrada do usuário. Isso é semelhante ao modo como os designers pensam sobre a UI.

</Intro>

<YouWillLearn>

* Como programação da UI difere entre declarativa e imperativa
* Como enumerar os diferentes estados visuais em que seu componente pode estar
* Como acionar as alterações entre os diferentes estados visuais a partir do código

</YouWillLearn>

## Como a UI declarativa se compara à imperativa {/*how-declarative-ui-compares-to-imperative*/}

Ao projetar interações de UI, você provavelmente pensa em como a UI *muda* em resposta às ações do usuário. Considere um formulário que permite que o usuário envie uma resposta:

* Quando você digita algo no formulário, o botão "Enviar" **fica habilitado**.
* Quando você pressiona "Enviar", tanto o formulário quanto o botão ficam desativados e um loader aparece.
* Se a solicitação de rede for bem-sucedida, o formulário ficará oculto e a mensagem "Obrigado" aparecerá.
* Se a solicitação de rede falhar, uma mensagem de erro **aparecerá** e o formulário **ficará habilitado** novamente.

Na **programação imperativa**, o que foi dito acima corresponde diretamente a como você implementa a interação. Você precisa escrever as instruções exatas para manipular a interface do usuário, dependendo do que acabou de acontecer. Eis outra maneira de pensar sobre isso: imagine estar ao lado de alguém em um carro e dizer a essa pessoa, curva à curva, para onde ir.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Em um carro dirigido por uma pessoa de aparência ansiosa que representa o JavaScript, um passageiro ordena que o motorista execute uma sequência de complicadas navegações curva à curva." />

Essa pessoa não sabe para onde você quer ir, apenas segue os seus comandos. (E se você errar as instruções, acabará no lugar errado!) É chamada de *imperativa* porque você precisa "comandar" cada elemento, desde o loader até o botão, dizendo ao computador *como* atualizar a interface do usuário.

Neste exemplo de programação imperativa de UI, o formulário é criado *sem* o React. Ele usa apenas o [DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model) do navegador:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
   // Simula que está acessando a rede. 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Bom palpite, mas resposta errada. Tente novamente!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Questionário sobre cidades</h2>
  <p>
    Qual cidade está localizada em dois continentes?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Enviar</button>
  <p id="loading" style="display: none">Carregando...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">É isso mesmo!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Manipular a UI de forma imperativa funciona bem em exemplos isolados, mas fica exponencialmente mais difícil de gerenciar em sistemas mais complexos. Imagine atualizar uma página cheia de formulários diferentes como esse. Adicionar um novo elemento de UI ou uma nova interação exigiria a verificação cuidadosa de todo o código existente para garantir que você não tenha introduzido um bug (por exemplo, esquecer de mostrar ou ocultar algo).

React foi criado para resolver esse problema.

Em React, você não manipula diretamente a UI, ou seja, você não ativa, desativa, mostra ou oculta componentes diretamente. Em vez disso, você **declara o que deseja mostrar** e React trata de como atualizar a UI. Pense em entrar em um táxi e dizer ao motorista para onde você quer ir, ao invés de dizer a ele exatamente onde virar. O trabalho do motorista é levá-lo até lá, e ele pode até conhecer alguns atalhos que você não considerou!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Em um carro dirigido pelo React, um passageiro pede para ser levado a um local específico no mapa. React trata de como fazer isso." />

## Pensando na UI de forma declarativa {/*thinking-about-ui-declaratively*/}

Você viu acima como implementar um formulário de forma imperativa. Para entender melhor como pensar em React, você verá a seguir como reimplementar essa interface do usuário usando React:

1. **Identifique** os diferentes estados visuais de seu componente
2. **Determine** o que aciona essas mudanças no `state`
3. **Represente** o `state` na memória usando `useState`
4. **Remova** quaisquer variáveis não essenciais do `state`
5. **Conecte** os manipuladores de eventos para definir o `state`

### Etapa 1: Identificar os diferentes estados visuais do seu componente {/*step-1-identify-your-components-different-visual-states*/}

Na ciência da computação, você pode ouvir falar que uma ["máquina de estado"](https://pt.wikipedia.org/wiki/M%C3%A1quina_de_estados_finita) está em um de vários "estados". Se você trabalha com um designer, pode ter visto modelos de diferentes "estados visuais". O React está na interseção do design e da ciência da computação, portanto, essas duas ideias são fontes de inspiração.

Primeiro, você precisa visualizar todos os diferentes "estados" da UI que o usuário poderá ver:

* **Empty (vazio)**: O formulário tem um botão "Enviar" desativado.
* **Typing (digitando)**: O formulário tem um botão "Enviar" ativado.
* **Submit (enviar)**: O formulário está completamente desativado. O loader é exibido.
* **Sucess (successo)**: A mensagem "Obrigado" é exibida em vez de um formulário.
* **Error (erro)**: Igual ao `state` de "digitando", mas com uma mensagem de erro extra.

Assim como um designer, você desejará "simular" ou criar "mocks" para os diferentes estados antes de adicionar a lógica. Por exemplo, aqui está uma simulação para apenas a parte visual do formulário. Essa simulação é controlada por uma propriedade chamada `status` com um valor padrão de `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>É isso mesmo!</h1>
  }
  return (
    <>
      <h2>Questionário sobre cidades</h2>
      <p>
        Em qual cidade há um outdoor que transforma ar em água potável?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Enviar
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Você pode nomear essa propriedade como quiser, a nomenclatura não é importante. Tente editar `status = 'empty'` para `status = 'success'` para ver a mensagem de sucesso aparecer. A simulação permite que você itere rapidamente na interface do usuário antes de conectar qualquer lógica. Aqui está um protótipo mais detalhado do mesmo componente, ainda "controlado" pela propriedade `status`:

<Sandpack>

```js
export default function Form({
  // Tente mudar para 'submitting', 'error' or 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>É isso mesmo!</h1>
  }
  return (
    <>
      <h2>Questionário sobre cidades</h2>
      <p>
        Em qual cidade há um outdoor que transforma ar em água potável? 
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Enviar
        </button>
        {status === 'error' &&
          <p className="Error">
            Bom palpite, mas resposta errada. Tente novamente!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Exibindo vários estados visuais de uma só vez {/*displaying-many-visual-states-at-once*/}

Se um componente tiver muitos estados visuais, pode ser conveniente mostrar todos eles em uma página:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Formulário ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>É isso mesmo!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Bom palpite, mas resposta errada. Tente novamente!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Páginas como essa são geralmente chamadas de "guias de estilo vivos" ou "*storybooks*".

</DeepDive>

### Etapa 2: Determinar o que aciona essas mudanças de estado {/*step-2-determine-what-triggers-those-state-changes*/}

Você pode acionar atualizações de estado em resposta a dois tipos de entradas:

* **Entradas humanas,** como clicar em um botão, digitar em um campo, navegar em um link.
* **Entradas de computador**, como receber uma resposta de rede, a conclusão de um tempo limite, o carregamento de uma imagem.

<IllustrationBlock>
  <Illustration caption="Entradas humanas" alt="Um dedo" src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Entradas de computador" alt="Uns e zeros" src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Em ambos os casos, **você deve definir [variáveis de state](/learn/state-a-components-memory#anatomy-of-usestate) para atualizar a UI.** Para o formulário que você está desenvolvendo, será necessário alterar o `state` em resposta a algumas entradas diferentes:

* **Alterar a entrada de texto** (humano) deve mudá-la do `state` *Empty* (vazio) para o `state` *Typing* (digitando) ou vice-versa, dependendo do fato de a caixa de texto estar vazia ou não.
* **Clicar no botão Enviar** (humano) deve mudar para o `state` *Submitting* (enviando).
* **A resposta de rede bem-sucedida** (computador) deve mudar para o `state` *Success* (sucesso).
* **A resposta de rede com falha** (computador) deve mudar para o `state` *Error* (erro) com a mensagem de erro correspondente.

<Note>

Observe que as entradas humanas geralmente exigem [manipuladores de eventos](/learn/responding-to-events)!

</Note>

Para ajudar a visualizar esse fluxo, tente desenhar cada `state` no papel como um círculo rotulado e cada mudança entre dois estados como uma seta. Você pode esboçar muitos fluxos dessa forma e resolver os bugs muito antes da implementação.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Fluxograma movendo-se da esquerda para a direita com 5 nós. O primeiro nó rotulado como 'empty' (vazio) tem uma borda rotulada como 'start typing' (comece a digitar) conectada a um nó rotulado como 'typing' (digitando). Esse nó tem uma borda chamada 'press submit' (pressione enviar) conectada a um nó chamado 'submitting' (enviando), que tem duas bordas. A borda esquerda é rotulada como 'network error' (error de rede), conectada a um nó rotulado como 'error' (error). A borda direita é rotulada como 'network success' (sucesso de rede) e se conecta a um nó rotulado como 'success' (sucesso).">

Estados do formulário

</Diagram>

</DiagramGroup>

### Etapa 3: Representar o `state` na memória com `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Em seguida, você precisará representar os estados visuais do seu componente na memória com [`useState`.](/reference/react/useState) A simplicidade é fundamental: cada `state` é uma "peça móvel", e **você quer o menor número possível de "peças móveis".** Maior complexidade leva a mais bugs!

Comece com o `state` que *absolutamente* precisa estar lá. Por exemplo, você precisará armazenar `answer` para a entrada e `error` (se existir) para armazenar o último erro:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Em seguida, você precisará de uma variável de `state` que represente qual dos estados visuais você deseja exibir. Geralmente, há mais de uma maneira de representar isso na memória, portanto, você precisará experimentar.

Se tiver dificuldade para pensar na melhor maneira imediatamente, comece adicionando um número suficiente de `state` para ter certeza absoluta de que todos os estados visuais possíveis estão incluídos:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Sua primeira ideia provavelmente não será a melhor, mas tudo bem: refatorar o `state` faz parte do processo!

### Etapa 4: Remover todas as variáveis não essenciais do `state` {/*step-4-remove-any-non-essential-state-variables*/}

Você quer evitar a duplicação no conteúdo do `state` para rastrear apenas o que é essencial. Gastar um pouco de tempo refatorando sua estrutura de `state` tornará seus componentes mais fáceis de entender, reduzirá a duplicação e evitará significados não intencionais. Seu objetivo é **prevenir os casos em que o `state` na memória não representa nenhuma UI válida que você gostaria que o usuário visse.** (Por exemplo, você nunca quer mostrar uma mensagem de erro e desativar a entrada ao mesmo tempo, ou o usuário não conseguirá corrigir o erro!)

Aqui estão algumas perguntas que você pode fazer sobre suas variáveis de `state`:

* **Por exemplo**, `isTyping` (está digitando) e `isSubmitting` (está enviando) não podem ser ambos `true`. Um paradoxo geralmente significa que o `state` não é suficientemente restrito. Há quatro combinações possíveis de dois booleanos, mas apenas três correspondem a `state` válidos. Para remover o `state` "impossível", você pode combiná-los em um `status` que deve ser um dos três valores: `'typing'` (digitando), `'submitting'` (enviando) ou `'success'` (sucesso).
* **A mesma informação já está disponível em outra variável de `state`**? Outro paradoxo: `isEmpty` (está vazio) e `isTyping` (está digitando) não podem ser `true` ao mesmo tempo. Ao torná-las variáveis de `state` separadas, você corre o risco de que elas fiquem dessincronizadas e causem bugs. Felizmente, você pode remover `isEmpty` (está vazio) e, em vez disso, verificar `answer.length === 0`.
* **Você pode obter as mesmas informações do inverso de outra variável de `state`**? O `isError` (é erro) não é necessário porque você pode verificar `error !== null` em vez disso.

Após essa remoção, você fica com 3 (antes eram 7!) variáveis de `state` *essenciais*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Você sabe que eles são essenciais, pois não é possível remover nenhum deles sem prejudicar a funcionalidade.

<DeepDive>

#### Eliminação de estados "impossíveis" com um *reducer* {/*eliminating-impossible-states-with-a-reducer*/}

Essas três variáveis são uma representação suficientemente boa do `state` desse formulário. Entretanto, ainda há alguns estados intermediários que não fazem sentido. Por exemplo, um `error` não nulo não faz sentido quando `status` é `'success'`. Para modelar o `state` com mais precisão, você pode [extraí-lo em um reducer](/learn/extracting-state-logic-into-a-reducer) Os *reducers* permitem unificar várias variáveis de `state` em um único objeto e consolidar toda a lógica relacionada!

</DeepDive>

### Etapa 5: Conecte os manipuladores de eventos para definir o `state` {/*step-5-connect-the-event-handlers-to-set-state*/}

Por fim, crie manipuladores de eventos que atualizem o `state`. Abaixo está o formulário final, com todos os manipuladores de eventos conectados:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>É isso mesmo!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Questionário sobre cidades</h2>
      <p>
        Em que cidade há um outdoor que transforma ar em água potável?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Enviar 
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Simula que está acessando a rede. 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Bom palpite, mas resposta errada. Tente novamente!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Embora esse código seja mais longo do que o exemplo imperativo original, ele é muito menos frágil. Expressar todas as interações como alterações de `state` permite que você introduza posteriormente novos estados visuais sem quebrar os existentes. Também permite que você altere o que deve ser exibido em cada `state` sem alterar a lógica da própria interação.

<Recap>

* Programação declarativa significa descrever a UI para cada estado visual em vez de microgerenciá-la (imperativa).
* Ao desenvolver um componente:
  1. Identifique todos os seus estados visuais.
  2. Determine os acionadores humanos e computacionais para as mudanças de estado.
  3. Modele o `state` com `useState`.
  4. Remova o `state` não essencial para evitar bugs e paradoxos.
  5. Conecte os manipuladores de eventos para definir o `state`.

</Recap>



<Challenges>

#### Adicionar e remover uma classe CSS {/*add-and-remove-a-css-class*/}

Faça com que, ao clicar na imagem, a classe CSS `background--active` seja removida da `<div>` externa, mas a classe `picture--active` seja adicionada ao `<img>`. Clicar novamente no plano de fundo deve restaurar as classes CSS originais.

Visualmente, você deve esperar que clicar na imagem remova o plano de fundo roxo e destaque a borda da imagem. Clicar fora da imagem destaca o plano de fundo, mas remove o destaque da borda da imagem.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Casas de arco-íris em Kampung Pelangi, Indonésia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Esse componente tem dois estados visuais: quando a imagem está ativa e quando a imagem está inativa:

* Quando a imagem está ativa, as classes CSS são `background` e `picture picture--active`.
* Quando a imagem está inativa, as classes CSS são `background background--active` e `picture`.

Uma única variável de `state` booleana é suficiente para lembrar se a imagem está ativa. A tarefa original era remover ou adicionar classes CSS. No entanto, em React, você precisa *descrever* o que deseja ver em vez de *manipular* os elementos da UI. Portanto, você precisa calcular as duas classes CSS com base no estado atual. Você também precisa [interromper a propagação](/learn/responding-to-events#stopping-propagation) para que o clique na imagem não seja registrado como um clique no plano de fundo.

Verifique se essa versão funciona clicando na imagem e depois fora dela:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Casas de arco-íris em Kampung Pelangi, Indonésia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternativamente, você poderia retornar dois blocos separados de JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Casas de arco-íris em Kampung Pelangi, Indonésia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Casas de arco-íris em Kampung Pelangi, Indonésia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Lembre-se de que, se dois blocos JSX diferentes descreverem a mesma árvore, os aninhamentos deles (primeira `<div>` → primeira `<img>`) devem ser correspondentes. Caso contrário, a ativação de `isActive` recriaria toda a árvore abaixo e [redefiniria seu estado](/learn/preserving-and-resetting-state). É por isso que, se uma árvore JSX semelhante for retornada em ambos os casos, é melhor escrevê-la como uma única parte do JSX.

</Solution>

#### Editor de perfil {/*profile-editor*/}

Aqui está um pequeno formulário implementado com JavaScript simples e DOM. Altere-o para entender seu comportamento:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Editar Perfil') {
    editButton.textContent = 'Salvar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Olá ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Olá ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nome:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Sobrenome:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">Olá, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Esse formulário alterna entre dois modos: no modo de edição, você vê as entradas, e no modo de visualização, você vê apenas o resultado. O rótulo do botão muda entre "Editar" e "Salvar", dependendo do modo em que você estiver. Quando você altera as entradas, a mensagem de boas-vindas na parte inferior é atualizada em tempo real.

Sua tarefa é reimplementá-lo em React na *sandbox* abaixo. Para sua conveniência, a marcação já foi convertida para JSX, mas você precisará fazer com que ela mostre e oculte as entradas como a original faz.

Certifique-se de que ele também atualize o texto na parte inferior!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Nome:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Sobrenome:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Editar Perfil
      </button>
      <p><i>Olá, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Você precisará de duas variáveis de `state` para manter os valores de entrada: `firstName` e `lastName`. Você também precisará de uma variável de `state` `isEditing` que determina se os dados de entrada devem ser exibidos ou não. Você não deve precisar de uma variável `fullName` (nome completo) porque o nome completo sempre pode ser calculado a partir de `firstName` (nome) e `lastName` (sobrenome).

Finalmente, você deve usar [renderização condicional](/learn/conditional-rendering) para mostrar ou ocultar os dados de entrada dependendo de `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Nome:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Sobrenome:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Salvar' : 'Editar'} Perfil
      </button>
      <p><i>Olá, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare essa solução com o código imperativo original. Qual é a diferença entre eles?

</Solution>

#### Refatore a solução imperativa sem usar React {/*refactor-the-imperative-solution-without-react*/}

Aqui está o sandbox original do desafio anterior, escrito imperativamente sem o uso de React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Editar Perfil') {
    editButton.textContent = 'Salvar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Olá ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Olá ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nome:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Sobrenome:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">Olá, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine que React não existisse. Você pode refatorar esse código de forma a tornar a lógica menos frágil e mais semelhante à versão do React? Como seria se o `state` fosse explícito, como em React?

Se estiver com dificuldades para pensar por onde começar, o esboço abaixo já tem a maior parte da estrutura pronta. Se começar por aqui, preencha a lógica que falta na função `updateDOM`. (Consulte o código original quando necessário).

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Salvar Perfil';
    // TODO: exibir entradas, ocultar conteúdo 
  } else {
    editButton.textContent = 'Editar Perfil';
    // TODO: ocultar entradas, exibir conteúdo 
  }
  // TODO: atualizar os rótulos de texto
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nome:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Sobrenome:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">Olá, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

A lógica faltante incluía alternar a exibição entre entradas e conteúdo, além de atualizar os rótulos:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Salvar Perfil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Editar Perfil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Olá ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Nome:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Sobrenome:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Editar Perfil</button>
  <p><i id="helloText">Olá, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

A função `updateDOM` que você escreveu mostra o que React faz nos bastidores quando você define o `state`. (No entanto, React também evita modificar o DOM para propriedades que não foram alteradas desde a última vez em que foram definidas).

</Solution>

</Challenges>
