# Guia de Estilo Universal

Este documento descreve as regras que devem ser aplicadas para **todos** os idiomas.  
Quando estiver se referindo ao próprio `React`, use `o React`.

## IDs dos Títulos

Todos os títulos possuem IDs explícitos como abaixo:

```md
## Tente React {#try-react}
```

**Não** traduza estes IDs! Eles são usado para navegação e quebrarão se o documento for um link externo, como:

```md
Veja a [seção iniciando](/getting-started#try-react) para mais informações.
```

✅ FAÇA:

```md
## Tente React {#try-react}
```

❌ NÃO FAÇA:

```md
## Tente React {#tente-react}
```

Isto quebraria o link acima.

## Texto em Blocos de Código

Mantenha o texto em blocos de código sem tradução, exceto para os comentários. Você pode optar por traduzir o texto em strings, mas tenha cuidado para não traduzir strings que se refiram ao código!

Exemplo:
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ FAÇA:

```js
// Exemplo
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ PERMITIDO:

```js
// Exemplo
const element = <h1>Olá mundo</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ NÃO FAÇA:

```js
// Exemplo
const element = <h1>Olá mundo</h1>;
// "root" se refere a um ID de elemento.
// NÃO TRADUZA
ReactDOM.render(element, document.getElementById('raiz'));
```

❌ DEFINITIVAMENTE NÃO FAÇA:

```js
// Exemplo
const elemento = <h1>Olá mundo</h1>;
ReactDOM.renderizar(elemento, documento.obterElementoPorId('raiz'));
```

## Links Externos

Se um link externo se referir a um artigo no [MDN] or [Wikipedia] e se houver uma versão traduzida em seu idioma em uma qualidade decente, opte por usar a versão traduzida.

[MDN]: https://developer.mozilla.org/pt-BR/
[Wikipedia]: https://pt.wikipedia.org/wiki/Wikipédia:Página_principal

Exemplo:

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ OK:

```md
Elementos React são [imutáveis](https://pt.wikipedia.org/wiki/Objeto_imutável).
```

Para links que não possuem tradução (Stack Overflow, vídeos do YouTube, etc.), simplesmente use o link original.

## Traduções Comuns

Sugestões de palavras e termos:

| Palavra/Termo original | Sugestão |
| ------------------ | ---------- |
| bubbling | propagar |
| bug | erro |
| browser | navegador |
| class | classe |
| context | contexto |
| controlled component | componente controlado |
| uncontrolled component | componente não controlado |
| debugging | depuração|
| function component | componente de função |
| class component | componente de classe |
| key | chave |
| library | biblioteca |
| lowercase | minúscula(s) / caixa baixa |
| package | pacote |
| React element | Elemento React |
| React fragment | Fragmento React |
| render | renderizar (verb), renderizado (noun)
| uncontrolled component | componente não controlado |
| uppercase | maiúscula(s) / caixa alta |
| to wrap | encapsular |
| to assert | afirmar |
| assertion | asserção |
| server | servidor |
| server-side | lado do servidor |
| client | cliente |
| client-side | lado do cliente |
| high-order components | componente de alta-ordem |
| stateful logic | lógica com estado |
| stateful component | componente com estado |
| container | contêiner |
| helper function | função auxiliar |
| siblings | irmãos |
| DOM node | nó do DOM |
| handler | manipulador |
| event handler | manipulador de eventos (event handler) |

## Conteúdo que não deve ser traduzido

* array
* arrow function
* bind
* bundle
* bundler
* camelCase
* callback
* DOM
* framework
* hook
* mock
* portal
* props
* ref
* state
* string
* string literal
* template literal
* UI
* log
* timestamps
* release
* script
* single-page-apps
* subscription
* subscribe
* event listener
* widgets
* watcher
* wrapper
