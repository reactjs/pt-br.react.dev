---
title: Escrevendo Marcação com JSX
---

<Intro>

*JSX* é uma extensão de sintaxe para JavaScript que permite que você escreva marcação semelhante a HTML dentro de um arquivo JavaScript. Embora existam outras maneiras de escrever componentes, a maioria dos desenvolvedores do React prefere a concisão do JSX, e a maioria das bases de código o utiliza.

</Intro>

<YouWillLearn>

* Por que o React mistura marcação com lógica de renderização
* Como o JSX é diferente do HTML
* Como exibir informações com JSX

</YouWillLearn>

## JSX: Colocando marcação em JavaScript {/*jsx-putting-markup-into-javascript*/}

A Web foi construída sobre HTML, CSS e JavaScript. Por muitos anos, os desenvolvedores web mantiveram conteúdo em HTML, design em CSS e lógica em JavaScript—frequentemente em arquivos separados! O conteúdo era marcado dentro do HTML enquanto a lógica da página vivia separadamente no JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Marcação HTML com fundo roxo e um div com duas tags filhas: p e form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Três manipuladores JavaScript com fundo amarelo: onSubmit, onLogin e onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Mas à medida que a Web se tornou mais interativa, a lógica determinou cada vez mais o conteúdo. O JavaScript estava encarregado do HTML! É por isso que **no React, a lógica de renderização e a marcação vivem juntas no mesmo lugar—componentes.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Componente React com HTML e JavaScript dos exemplos anteriores misturados. O nome da função é Sidebar que chama a função isLoggedIn, destacada em amarelo. Dentro da função destacada em roxo está a tag p de antes, e uma tag Form referenciando o componente mostrado no próximo diagrama.">

`Sidebar.js` Componente React

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Componente React com HTML e JavaScript dos exemplos anteriores misturados. O nome da função é Form contendo dois manipuladores onClick e onSubmit destacados em amarelo. Seguindo os manipuladores está o HTML destacado em roxo. O HTML contém um elemento de formulário com um elemento de input aninhado, cada um com uma prop onClick.">

`Form.js` Componente React

</Diagram>

</DiagramGroup>

Manter a lógica de renderização de um botão e a marcação juntos garante que elas permaneçam sincronizadas em cada edição. Por outro lado, detalhes que não estão relacionados, como a marcação do botão e a marcação de uma barra lateral, são isolados um do outro, tornando mais seguro alterar um ou outro por conta própria.

Cada componente React é uma função JavaScript que pode conter alguma marcação que o React renderiza no navegador. Os componentes React usam uma extensão de sintaxe chamada JSX para representar essa marcação. JSX se parece muito com HTML, mas é um pouco mais rigoroso e pode exibir informações dinâmicas. A melhor maneira de entender isso é converter alguma marcação HTML em marcação JSX.

<Note>

JSX e React são duas coisas separadas. Eles são frequentemente usados juntos, mas você *pode* [usá-los independentemente](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) um do outro. JSX é uma extensão de sintaxe, enquanto o React é uma biblioteca JavaScript.

</Note>

## Convertendo HTML para JSX {/*converting-html-to-jsx*/}

Suponha que você tenha algum HTML (perfeitamente válido):

```html
<h1>Todos de Hedy Lamarr</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Inventar novos semáforos
    <li>Repetir uma cena de filme
    <li>Melhorar a tecnologia de espectro
</ul>
```

E você quer colocá-lo em seu componente:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Se você copiar e colar como está, não funcionará:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Isso não funciona bem!
    <h1>Todos de Hedy Lamarr</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Inventar novos semáforos
      <li>Repetir uma cena de filme
      <li>Melhorar a tecnologia de espectro
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Isso acontece porque JSX é mais rigoroso e possui algumas regras a mais do que HTML! Se você ler as mensagens de erro acima, elas o guiarão para corrigir a marcação, ou você pode seguir o guia abaixo.

<Note>

Na maior parte do tempo, as mensagens de erro exibidas pelo React ajudarão você a encontrar onde está o problema. Dê uma olhada nelas se você ficar preso!

</Note>

## As Regras do JSX {/*the-rules-of-jsx*/}

### 1. Retornar um único elemento raiz {/*1-return-a-single-root-element*/}

Para retornar múltiplos elementos de um componente, **embrulhe-os com uma única tag pai.**

Por exemplo, você pode usar um `<div>`:

```js {1,11}
<div>
  <h1>Todos de Hedy Lamarr</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Se você não quiser adicionar um `<div>` extra à sua marcação, pode escrever `<>` e `</>` em vez disso:

```js {1,11}
<>
  <h1>Todos de Hedy Lamarr</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Essa tag vazia é chamada de *[Fragmento.](/reference/react/Fragment)* Fragments permitem que você agrupe coisas sem deixar nenhum vestígio na árvore HTML do navegador.

<DeepDive>

#### Por que múltiplas tags JSX precisam ser embrulhadas? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX se parece com HTML, mas nos bastidores, ele é transformado em objetos JavaScript puro. Você não pode retornar dois objetos de uma função sem embrulhá-los em um array. Isso explica por que você também não pode retornar duas tags JSX sem embrulhá-las em outra tag ou em um Fragmento.

</DeepDive>

### 2. Feche todas as tags {/*2-close-all-the-tags*/}

JSX exige que as tags sejam fechadas explicitamente: tags auto-fechadas como `<img>` devem se tornar `<img />`, e tags de embrulho como `<li>laranjas` devem ser escritas como `<li>laranjas</li>`.

É assim que a imagem de Hedy Lamarr e os itens da lista aparecem fechados:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Inventar novos semáforos</li>
    <li>Repetir uma cena de filme</li>
    <li>Melhorar a tecnologia de espectro</li>
  </ul>
</>
```

### 3. camelCase <s>tudo</s> a maioria das coisas! {/*3-camelcase-salls-most-of-the-things*/}

JSX se transforma em JavaScript e atributos escritos em JSX tornam-se chaves de objetos JavaScript. Em seus próprios componentes, você frequentemente desejará ler esses atributos em variáveis. Mas o JavaScript tem limitações nos nomes de variáveis. Por exemplo, seus nomes não podem conter traços ou ser palavras reservadas como `class`.

É por isso que, no React, muitos atributos HTML e SVG são escritos em camelCase. Por exemplo, em vez de `stroke-width`, você usa `strokeWidth`. Como `class` é uma palavra reservada, no React você escreve `className` em vez disso, nomeado após a [propriedade correspondente do DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Você pode [encontrar todos esses atributos na lista de props de componentes do DOM.](/reference/react-dom/components/common) Se você errar algum, não se preocupe—o React imprimirá uma mensagem com uma possível correção no [console do navegador.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Por razões históricas, os atributos [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) e [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) são escritos como no HTML com traços.

</Pitfall>

### Dica profissional: Use um Conversor de JSX {/*pro-tip-use-a-jsx-converter*/}

Converter todos esses atributos na marcação existente pode ser tedioso! Recomendamos usar um [conversor](https://transform.tools/html-to-jsx) para traduzir seu HTML e SVG existentes para JSX. Conversores são muito úteis na prática, mas ainda vale a pena entender o que está acontecendo para que você possa escrever JSX confortavelmente por conta própria.

Aqui está seu resultado final:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Todos de Hedy Lamarr</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Inventar novos semáforos</li>
        <li>Repetir uma cena de filme</li>
        <li>Melhorar a tecnologia de espectro</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Agora você sabe por que o JSX existe e como usá-lo em componentes:

* Os componentes React agrupam a lógica de renderização junto com a marcação porque estão relacionadas.
* JSX é semelhante ao HTML, com algumas diferenças. Você pode usar um [conversor](https://transform.tools/html-to-jsx) se precisar.
* As mensagens de erro frequentemente o orientarão na direção certa para corrigir sua marcação.

</Recap>

<Challenges>

#### Converta algum HTML para JSX {/*convert-some-html-to-jsx*/}

Este HTML foi colado em um componente, mas não é uma JSX válida. Corrija-o:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Bem-vindo ao meu site!</h1>
    </div>
    <p class="summary">
      Você pode encontrar meus pensamentos aqui.
      <br><br>
      <b>E <i>imagens</b></i> de cientistas!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Se você deve fazer isso manualmente ou usar o conversor, depende de você!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Bem-vindo ao meu site!</h1>
      </div>
      <p className="summary">
        Você pode encontrar meus pensamentos aqui.
        <br /><br />
        <b>E <i>imagens</i></b> de cientistas!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>