---
title: React DevTools para agentes
version: experimental
---

<Experimental>

**`react-devtools-cdt-mcp` é experimental.** Ele é construído sobre a [API experimental de ferramentas de desenvolvedor de terceiros](https://developer.chrome.com/blog/devtools-for-agents-3p-tools) do [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), e tanto suas ferramentas quanto a saída delas podem mudar entre releases.

</Experimental>

<Intro>

`react-devtools-cdt-mcp` dá aos agentes de programação com IA a mesma visão do seu app que o React DevTools dá a você: a árvore de componentes, props, Hooks, owners, localizações no código-fonte e tempos de renderização.

```js
import 'react-devtools-cdt-mcp/register';
```

</Intro>

<InlineToc />

---

## Visão geral {/*overview*/}

Agentes de programação que controlam um navegador por meio do [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) podem clicar, tirar snapshots e ler o DOM, mas o DOM não diz a eles qual componente renderizou um botão, qual state ele guarda ou por que uma interação foi lenta.

`react-devtools-cdt-mcp` é uma pequena biblioteca de navegador que você importa na página que está depurando. Ela registra um grupo de ferramentas do React na página. Quando o Chrome DevTools MCP se conecta a essa página, ele descobre as ferramentas automaticamente, e seu agente pode chamá-las como qualquer outra ferramenta MCP.

<Note>

`react-devtools-cdt-mcp` **não** é um servidor MCP e não entra na configuração do seu cliente MCP. Ele roda dentro da sua página. O único servidor MCP que você configura é o Chrome DevTools MCP.

</Note>

---

## Configuração {/*setup*/}

#### Instale o pacote {/*install-the-package*/}

<TerminalBlock>

npm install --save-dev react-devtools-cdt-mcp

</TerminalBlock>

#### Importe-o antes do React {/*import-it-before-react*/}

Importe o ponto de entrada `register` logo no início do arquivo de entrada do seu app, **antes** de qualquer coisa que importe `react-dom`:

```js {1}
import 'react-devtools-cdt-mcp/register';

import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);
```

`react-devtools-cdt-mcp` precisa ser carregado antes do React. Se você importá-lo depois do React, as ferramentas não verão seus componentes.

<Pitfall>

`react-devtools-cdt-mcp` se conecta ao React da mesma forma que a extensão React DevTools e faz com que o React reporte cada commit a ele. Isso deixa seu app mais lento, então inclua-o apenas em builds de desenvolvimento.

</Pitfall>

#### Configure o Chrome DevTools MCP {/*set-up-chrome-devtools-mcp*/}

Seu agente precisa do [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) com as [ferramentas de desenvolvedor de terceiros](https://developer.chrome.com/blog/devtools-for-agents-3p-tools) habilitadas. Siga a [documentação do Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp#getting-started) para configurá-lo. Assim que seu agente abrir uma página que importa `react-devtools-cdt-mcp/register`, ele poderá listar e chamar as ferramentas do React.

---

## Experimente {/*try-it*/}

Você não precisa de um agente para ver o que as ferramentas retornam. O sandbox abaixo importa `react-devtools-cdt-mcp/register` exatamente como você faria no seu app e adiciona um pequeno **console de ferramentas** abaixo do app. O console descobre as ferramentas do React da mesma forma que o Chrome DevTools MCP, disparando o evento `devtoolstooldiscovery`, e permite que você as chame manualmente.

Escolha uma ferramenta, edite os parâmetros JSON e pressione **Run tool**. Aqui está uma sessão de depuração para você seguir, fazendo o papel do agente:

1. **Encontre um componente.** Execute `react_find_components` com `{"name": "Row"}`. Cada resultado tem um `uid`, como `"r12"`, que as outras ferramentas aceitam.
2. **Inspecione-o.** Execute `react_get_component_by_uid` com um desses uids e `"includeHooks": true` para ver suas props e Hooks.
3. **Comece pela tela.** Escolha `react_get_component_by_dom_element`, pressione **Pick element** e clique em um produto da lista para obter o componente host que o renderizou.
4. **Faça o profiling de uma interação.** Execute `react_start_profiling`, clique em **Add to cart** no app e depois execute `react_stop_profiling`.
5. **Veja o que foi renderizado.** Execute `react_get_trace_overview` e depois `react_get_commit_report` para o commit `0` para ver quais componentes foram renderizados nesse commit e quanto tempo cada um levou.

<Sandpack>

```js src/App.js active
import { useState } from 'react';

const PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: 'Product ' + (i + 1),
  price: 10 + i,
}));

export default function App() {
  const [query, setQuery] = useState('');
  const visibleProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <main>
      <Cart />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter products"
      />
      <ProductList products={visibleProducts} />
    </main>
  );
}

function Cart() {
  const [count, setCount] = useState(0);
  return (
    <header>
      <CartBadge count={count} />
      <button onClick={() => setCount((c) => c + 1)}>Add to cart</button>
    </header>
  );
}

function CartBadge({ count }) {
  return <span className="badge">Cart: {count}</span>;
}

function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
}

function ProductRow({ product }) {
  return (
    <li>
      {product.name} <b>${product.price}</b>
    </li>
  );
}
```

```js src/index.js
import 'react-devtools-cdt-mcp/register';

import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { mountToolConsole } from './ToolConsole';

createRoot(document.getElementById('root')).render(<App />);
mountToolConsole();
```

```js src/ToolConsole.js hidden
// Um pequeno substituto para o chrome-devtools-mcp. Ele descobre o grupo de
// ferramentas do React da mesma forma que o chrome-devtools-mcp (o evento
// `devtoolstooldiscovery`) e permite que você chame as ferramentas manualmente.
function discoverToolGroup() {
  let toolGroup = null;
  const event = new Event('devtoolstooldiscovery');
  event.respondWith = group => {
    toolGroup = group;
  };
  window.dispatchEvent(event);
  return toolGroup;
}

function firstUid(tools, name) {
  const find = tools.find(t => t.name === 'react_find_components');
  const result = find.execute({name});
  return result.results && result.results[0] ? result.results[0].uid : 'r0';
}

function exampleParams(tools, toolName) {
  switch (toolName) {
    case 'react_get_component_tree':
      return {depth: 4};
    case 'react_find_components':
      return {name: 'Row'};
    case 'react_get_component_by_uid':
      return {uid: firstUid(tools, 'App'), includeHooks: true};
    case 'react_get_component_by_dom_element':
      return {element: '(click "Pick element", then click the page)'};
    case 'react_get_component_source':
    case 'react_get_owner_stack_trace':
    case 'react_get_parent_stack':
    case 'react_get_owner_stack':
      return {uid: firstUid(tools, 'CartBadge')};
    case 'react_start_profiling':
      return {traceName: 'add-to-cart'};
    case 'react_stop_profiling':
      return {};
    case 'react_get_trace_overview':
      return {traceName: 'add-to-cart'};
    case 'react_get_commit_report':
      return {traceName: 'add-to-cart', commitIndex: 0};
    default:
      return {};
  }
}

export function mountToolConsole() {
  const toolGroup = discoverToolGroup();
  const container = document.createElement('section');
  container.className = 'tool-console';
  document.body.appendChild(container);
  if (toolGroup === null) {
    container.textContent =
      'No tools found. Import react-devtools-cdt-mcp/register before React.';
    return;
  }
  const {tools} = toolGroup;
  container.innerHTML = `
    <h3>Tool console</h3>
    <select></select>
    <p class="description"></p>
    <textarea rows="3" spellcheck="false"></textarea>
    <div class="actions">
      <button class="run">Run tool</button>
      <button class="pick" hidden>Pick element</button>
    </div>
    <pre class="output"></pre>
  `;
  const select = container.querySelector('select');
  const description = container.querySelector('.description');
  const textarea = container.querySelector('textarea');
  const runButton = container.querySelector('.run');
  const pickButton = container.querySelector('.pick');
  const output = container.querySelector('pre');
  let pickedElement = null;

  for (const tool of tools) {
    const option = document.createElement('option');
    option.value = tool.name;
    option.textContent = tool.name;
    select.appendChild(option);
  }

  function selectTool() {
    const tool = tools.find(t => t.name === select.value);
    description.textContent = tool.description;
    textarea.value = JSON.stringify(exampleParams(tools, tool.name));
    pickButton.hidden = tool.name !== 'react_get_component_by_dom_element';
    pickedElement = null;
  }

  function run() {
    const tool = tools.find(t => t.name === select.value);
    let params;
    try {
      params = JSON.parse(textarea.value || '{}');
    } catch (error) {
      output.textContent = 'Invalid JSON: ' + error.message;
      return;
    }
    if (tool.name === 'react_get_component_by_dom_element') {
      params.element = pickedElement;
    }
    const result = tool.execute(params);
    output.textContent = JSON.stringify(result, null, 2);
  }

  pickButton.addEventListener('click', () => {
    output.textContent = 'Click any element in the app above...';
    document.addEventListener(
      'click',
      event => {
        if (container.contains(event.target)) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        pickedElement = event.target;
        textarea.value = JSON.stringify({
          element: '<' + event.target.tagName.toLowerCase() + '>',
        });
        run();
      },
      {capture: true, once: true},
    );
  });
  select.addEventListener('change', selectTool);
  runButton.addEventListener('click', run);
  selectTool();
}
```

```css src/styles.css hidden
header { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.badge { padding: 2px 8px; border-radius: 10px; background: #087ea4; color: white; }
ul { padding-left: 20px; max-height: 160px; overflow: auto; }
.tool-console { margin-top: 20px; padding-top: 12px; border-top: 1px solid #ddd; }
.tool-console select, .tool-console textarea { width: 100%; font-family: monospace; }
.tool-console .actions { display: flex; gap: 8px; margin: 8px 0; }
.tool-console pre { background: #f6f7f9; padding: 8px; max-height: 300px; overflow: auto; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-devtools-cdt-mcp": "0.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Note>

O console de ferramentas deste sandbox substitui o Chrome DevTools MCP para que você possa experimentar as ferramentas nesta página. No seu próprio app, você não escreve nada desse código: o Chrome DevTools MCP descobre as ferramentas e seu agente decide quais chamar.

</Note>

---

## Referência {/*reference*/}

### Ferramentas {/*tools*/}

`react-devtools-cdt-mcp` registra um grupo de ferramentas chamado `react`. Seu agente chama essas ferramentas por meio do Chrome DevTools MCP.

* `react_get_component_tree`: Retorna um snapshot da árvore de componentes.
* `react_find_components`: Encontra componentes pelo nome.
* `react_get_component_by_uid`: Retorna as props e os Hooks de um componente.
* `react_get_component_by_dom_element`: Retorna o componente host do React para um elemento DOM.
* `react_get_parent_stack`: Retorna onde um componente está montado na árvore.
* `react_get_owner_stack`: Retorna os componentes que criaram um componente em seu JSX.
* `react_get_owner_stack_trace`: Retorna a owner stack de um componente como um stack trace.
* `react_get_component_source`: Retorna onde um componente está definido.
* `react_start_profiling`: Começa a gravar os tempos de renderização.
* `react_stop_profiling`: Para de gravar os tempos de renderização.
* `react_get_trace_overview`: Retorna um resumo de cada commit em uma gravação.
* `react_get_commit_report`: Retorna quais componentes foram renderizados em um commit e quanto tempo cada um levou.

Os componentes são identificados por uids curtos e estáveis, como `"r5"`. Um uid permanece o mesmo em todas as ferramentas e entre re-renderizações, mas não entre recarregamentos da página.

Toda ferramenta retorna um objeto simples e serializável. Se uma ferramenta falhar, ela retorna, em vez disso, um objeto com uma mensagem `error`.

---

### `register(target?)` {/*register*/}

Chame `register` para instalar o hook do React DevTools e registrar você mesmo as ferramentas do React no Chrome DevTools MCP, em vez de importar `react-devtools-cdt-mcp/register`.

```js
import { register } from 'react-devtools-cdt-mcp';

register();
```

#### Parâmetros {/*register-parameters*/}

* **opcional** `target`: O objeto global no qual o hook será instalado. O padrão é `globalThis`.

#### Retorna {/*register-returns*/}

`register` retorna um objeto com duas propriedades:

* `facade`: O hook do React DevTools instalado e o state que as ferramentas leem.
* `unregister`: Uma função que para de registrar as ferramentas do React no Chrome DevTools MCP.

#### Ressalvas {/*register-caveats*/}

* Chame `register` antes de o React ser inicializado, ou o React não se conectará ao hook.
* Chamar `register` novamente para o mesmo `target` retorna o registro existente.

---

## Solução de problemas {/*troubleshooting*/}

#### Meu agente não vê nenhuma ferramenta do React {/*my-agent-doesnt-see-any-react-tools*/}

Verifique se as [ferramentas de desenvolvedor de terceiros](https://developer.chrome.com/blog/devtools-for-agents-3p-tools) estão habilitadas na sua configuração do Chrome DevTools MCP. Depois, verifique se a página selecionada no Chrome DevTools MCP importa `react-devtools-cdt-mcp/register`. As ferramentas são descobertas por página, quando a página é carregada ou selecionada.

#### A árvore de componentes está vazia {/*the-component-tree-is-empty*/}

`react-devtools-cdt-mcp/register` foi importado depois que o React foi inicializado. Mova o import para a primeira linha do seu arquivo de entrada, antes de qualquer import que carregue `react-dom`.

#### Estou recebendo um erro sobre um ambiente semelhante a um navegador {/*im-getting-an-error-about-a-browser-like-environment*/}

`react-devtools-cdt-mcp/register` lança um erro se for importado fora de um navegador, por exemplo, durante a renderização no servidor ou em testes. Importe-o apenas a partir de código do lado do cliente, ou chame você mesmo `register()` a partir da raiz do pacote onde for seguro.

#### As localizações no código-fonte e as owner stacks estão vazias {/*source-locations-and-owner-stacks-are-empty*/}

Esses dados só existem nos builds de desenvolvimento do React. Certifique-se de que você está executando o servidor de desenvolvimento do seu app, e não um build de produção.

#### Um uid parou de funcionar {/*a-uid-stopped-working*/}

Uids não sobrevivem a recarregamentos da página. Depois de recarregar, obtenha novos uids com `react_get_component_tree` ou `react_find_components`.
