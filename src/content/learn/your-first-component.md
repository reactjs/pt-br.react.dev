---
title: Seu Primeiro Componente
---

<Intro>

Os *Componentes* são um dos conceitos centrais do React. Eles são a base das interfaces de usuário (UI), o que os torna o lugar perfeito para começar sua jornada com React!

</Intro>

<YouWillLearn>

* O que é um componente
* Que papel desempenham os componentes em uma aplicação React
* Como escrever o seu primeiro componente React

</YouWillLearn>

## Componentes: O Alicerce da UI {/*components-ui-building-blocks*/}

Na Web, o HTML nos permite criar documentos estruturados e ricos em conteúdo com seu conjunto de tags nativas, como `<h1>` e `<li>`:

```html
<article>
  <h1>Meu Primeiro Componente</h1>
  <ol>
    <li>Componentes: O Alicerce da UI</li>
    <li>Definindo um Componente</li>
    <li>Usando um Componente</li>
  </ol>
</article>
```

Este trecho de HTML representa um artigo `<article>`, seu título `<h1>`, e um índice de conteúdo (abreviado) apresentado como uma lista ordenada `<ol>`. Este conjunto de tags, combinado com CSS para estilização e JavaScript para a interatividade, é responsável por cada elemento de UI que você vê na Web — seja uma barra lateral, avatar, modal ou dropdown.

O React permite que você combine tags HTML, CSS e JavaScript em "componentes" personalizados, **elementos de UI reutilizáveis para a sua aplicação.** O código do índice de conteúdo que você viu acima pode ser transformado em um componente `<TableOfContents />` que você pode renderizar em cada página. Por trás do código, ele ainda usa as mesmas tags HTML como `<article>`, `<h1>`, etc.

Assim como nas tags HTML, você pode compor, ordenar e colocá-lo dentro de outros componentes para criar páginas inteiras. Por exemplo, a página de documentação que você está lendo é feita de componentes React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Documentação</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```
À medida que seu projeto cresce, você notará que muitos de seus designs podem ser compostos através da reutilização de componentes que você já escreveu, acelerando seu desenvolvimento. Nosso índice de conteúdo acima poderia ser usado em qualquer tela usando o componente `<TableOfContents />`! Você pode até mesmo iniciar seu projeto com os milhares de componentes compartilhados pela comunidade de código aberto do React, como [Chakra UI](https://chakra-ui.com/) e [Material UI.](https://material-ui.com/)

## Definindo um componente {/*defining-a-component*/}

Tradicionalmente, na criação de páginas web, os desenvolvedores web estruturavam o conteúdo utilizando HTML e, em seguida, adicionavam interações acrescentando um pouco de JavaScript. Isso funcionava muito bem quando a interação não era algo essencial na web. Atualmente, espera-se que muitos sites e aplicações sejam interativos. O React coloca a interatividade em primeiro lugar enquanto ainda usa a mesma tecnologia: **um componente React é uma função JavaScript que permite você _adicionar tags HTML_.** Confira o exemplo abaixo (você pode editar o exemplo abaixo):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Agora vamos aprender como construir um componente:

### Passo 1: Exportar o componente {/*step-1-export-the-component*/}

O prefixo `export default` é uma [sintaxe padrão do JavaScript](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (não específica do React). Ele permite que você marque a função principal em um arquivo para que você possa mais tarde importá-la de outros arquivos. (Mais sobre importação em [Importando e Exportando Componentes](/learn/importing-and-exporting-components)!

### Passo 2: Definir a função {/*step-2-define-the-function*/}

Com a sintaxe `function Profile() { }` você está definindo uma função JavaScript chamada `Profile`.

<Pitfall>

Os componentes do React são funções comuns do JavaScript, mas **seus nomes devem começar com letra maiúscula** ou não funcionarão!

</Pitfall>

### Passo 3: Adicionar HTML {/*step-3-add-markup*/}

O componente retorna uma tag `<img />` com os atributos `src` e `alt`. O `<img />` é escrito como HTML, mas na verdade, é o JavaScript que está por trás! Essa sintaxe é chamada [JSX](/learn/writing-markup-with-jsx) e permite usar tags HTML dentro do JavaScript.

As instruções de retorno podem ser escritas todas em uma linha, como neste componente:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Mas se seu HTML não estiver na mesma linha que a declaração `return`, você deve colocá-la entre parênteses:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Sem parênteses, qualquer código nas linhas após `return` [será ignorado](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Usando um componente {/*using-a-component*/}

Agora que você definiu seu componente `Profile`, você pode colocá-lo dentro de outros componentes. Por exemplo, você pode exportar um componente `Gallery` que usa várias vezes o componente `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Cientistas incríveis</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### O que o navegador vê {/*what-the-browser-sees*/}

Observe a diferença entre caixa alta e caixa baixa no nome dos componentes:

* `<section>` é minúscula, então o React sabe que nos referimos a uma tag HTML.
* `<Profile />` começa com a letra `P` maiúsculo, então o React sabe que queremos usar nosso componente chamado `Profile`.

E o componente `Profile` contém ainda mais HTML, como a tag `<img />`. No final, é isso que o navegador vê:

```html
<section>
  <h1>Cientistas incríveis</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Agrupando e organizando componentes {/*nesting-and-organizing-components*/}

Os componentes são funções comuns do JavaScript, portanto, você pode manter vários componentes no mesmo arquivo. Isso é conveniente quando os componentes são relativamente pequenos ou relacionados entre si. Caso o arquivo comece a ficar muito extenso, você pode sempre mover `Profile` para um arquivo separado. Você aprenderá como fazer isso em breve na [página sobre importações.](/learn/importing-and-exporting-components)

Como os componentes `Profile` são renderizados dentro da `Gallery`—mesmo várias vezes—, podemos dizer que `Gallery` é um **componente pai**, tornando cada `Profile` como um componente "filho". Essa é parte da magia do React: você pode definir um componente uma vez e usá-lo em quantos lugares e quantas vezes quiser.

<Pitfall>

Componentes podem renderizar outros componentes, mas **você nunca deve definir um componente dentro de outro componente:**

```js {2-5}
export default function Gallery() {
  // 🔴 Nunca defina um componente dentro de outro componente!
  function Profile() {
    // ...
  }
  // ...
}
```

O trecho acima é [muito lento e causa erros.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Em vez disso, defina todos os componentes no nível superior:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare componentes no nível superior
function Profile() {
  // ...
}
```

Quando um componente filho precisa de alguns dados de um pai, [passe-os por props](/learn/passing-props-to-a-component) em vez de definições de aninhamento.

</Pitfall>

<DeepDive>

#### Componentes em todos os níveis {/*components-all-the-way-down*/}

Sua aplicação React começa em um componente "raiz". Normalmente, ele é criado automaticamente quando você inicia um novo projeto. Por exemplo, se você usar [CodeSandbox](https://codesandbox.io/) ou você usar o framework [Next.js](https://nextjs.org/), o componente raiz é definido em `pages/index.js`. Nesses exemplos, você exportou componentes raiz.

A maioria das aplicações React usa componentes em todos os níveis. Isso significa que você não usará componentes apenas para partes reutilizáveis, como botões, mas também para partes maiores, como barras laterais, listas e até em páginas inteiras! Os componentes são uma maneira prática de organizar o código e o HTML da UI, mesmo que alguns deles sejam usados apenas uma vez.

<<<<<<< HEAD
Os [Frameworks React](/learn/start-a-new-react-project) levam isso um passo adiante. Em vez de usar um arquivo HTML vazio e deixar o React "assumir" o gerenciamento da página com JavaScript, eles *também* geram o HTML automaticamente a partir de seus componentes React. Isso permite que seu aplicativo mostre algum conteúdo antes que o código JavaScript seja carregado.
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Ainda assim, muitos sites usam o React apenas para [adicionar interatividade às páginas HTML existentes.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) Eles têm muitos componentes raiz em vez de um único para toda a página. Você pode usar o React na medida certa para atender as suas necessidades.

</DeepDive>

<Recap>

Você acabou de ter um gostinho do React! Vamos recapitular alguns pontos importantes.

* O React permite que você crie componentes, **elementos de UI reutilizáveis para sua aplicação.**
* Em uma aplicação React, cada parte da UI é um componente.
* Os componentes do React são funções comuns do JavaScript, mas com duas diferenças importantes:

  1. Seus nomes sempre começam com letra maiúscula.
  2. Eles retornam JSX.

</Recap>



<Challenges>

#### Exportar o componente {/*export-the-component*/}

Este sandbox não funciona porque o componente raiz não é exportado:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Tente resolver o problema antes de ver a solução!

<Solution>

Adicione o prefixo `export default` antes da definição da função, da seguinte forma:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Você pode estar se perguntando por que escrever `export` sozinho não é o suficiente para corrigir este exemplo. Você pode aprender a diferença entre `export` e `export default` em [Importando e Exportando Componentes.](/learn/importing-and-exporting-components)

</Solution>

#### Corrija a declaração de retorno {/*fix-the-return-statement*/}

Há algo errado na declaração `return`. Você consegue corrigir?

<Hint>

Você pode receber um erro "Unexpected token" ao tentar corrigir isso. Nesse caso, verifique se o ponto e vírgula aparece *depois* do parêntese de fechamento. Deixar um ponto-e-vírgula dentro de `return ( )` causará um erro.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Você pode corrigir esse componente movendo a instrução de retorno para uma linha da seguinte forma:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Outra opção é envolver o JSX retornado entre parênteses após a declaração `return`: 

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Identifique o erro {/*spot-the-mistake*/}

Algo está errado com a forma como o componente `Profile` é declarado e usado. Você consegue identificar o erro? (Tente lembrar como o React distingue os componentes das tags HTML!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Cientistas incríveis</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Os nomes dos componentes React devem começar com uma letra maiúscula.

Altere `function profile()` para `function Profile()` e, em seguida, altere cada `<profile />` para `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Cientistas incríveis</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Seu próprio componente {/*your-own-component*/}

Escreva um componente do zero. Você pode dar a ele qualquer nome válido e retornar qualquer JSX. Se você está sem ideias, você pode escrever um componente `Congratulations` que mostre `<h1>Bom trabalho!</h1>`. Não se esqueça de exportá-lo!

<Sandpack>

```js
// Escreva seu componente abaixo!
```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Bom trabalho!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
