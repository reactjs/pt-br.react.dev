---
title: Writing Markup with JSX
---

<Intro>

*JSX* é uma extensão de sintaxe para JavaScript que permite você escrever códigos com marcações tipo HTML dentro de um arquivo Javascript. Embora existam outras maneiras de se escrever componentes, a maioria dos desenvolvedores React preferem a concisão do JSX e a maioria das bases de código o utiliza.

</Intro>

<YouWillLearn>

* Porque o React mistura marcações com lógica de renderização
* Como o JSX é diferente do HTML
* Como mostrar informações com o JSX

</YouWillLearn>

## JSX: Colocando marcação em JavaScript {/*jsx-putting-markup-into-javascript*/}

A Web foi construída em HTML, CSS e JavaScript. Por muitos anos, os desenvolvedores da Web mantiveram o conteúdo em HTML, o design em CSS e a lógica em JavaScript — muitas vezes em arquivos separados! O conteúdo era marcado dentro do HTML enquanto a lógica da página vivia separadamente no JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Marcação HTML com fundo roxo e um div com duas tags filhas: p e form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Três manipuladores JavaScript com fundo amarelo: onSubmit, onLogin e onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Mas à medida que a Web se tornava mais interativa, a lógica determinava cada vez mais o conteúdo. O JavaScript ficou a cargo do HTML! É por isso que **no React, a lógica de renderização e a marcação vivem juntas no mesmo lugar — os componentes.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Componente React com HTML e JavaScript de exemplos anteriores misturados. O nome da função é Sidebar que chama a função isLoggedIn, destacada em amarelo. Aninhada dentro da função destacada em roxo está a tag p de antes e uma tag Form referenciando o componente mostrado no próximo diagrama.">

`Sidebar.js` Componente React 

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Componente React com HTML e JavaScript de exemplos anteriores misturados. O nome da função é Form contendo dois manipuladores onClick e onSubmit destacados em amarelo. Após os manipuladores, está o HTML destacado em roxo. O HTML contém um elemento de formulário com um elemento de entrada aninhado, cada um com uma propriedade onClick.">

`Form.js` Componente React

</Diagram>

</DiagramGroup>

Manter a lógica de renderização e a marcação de um botão juntas garante que eles permaneçam sincronizados entre si em todas as edições. Por outro lado, os detalhes não relacionados, como a marcação do botão e a marcação da barra lateral, são isolados uns dos outros, tornando mais seguro alterar qualquer um deles por conta própria.

Cada componente do React é uma função JavaScript que pode conter alguma marcação que o React renderiza no navegador. Os componentes do React usam uma extensão de sintaxe chamada JSX para representar essa marcação. O JSX se parece muito com o HTML, mas é um pouco mais rígido e pode exibir informações dinâmicas. A melhor maneira de entender isso é converter alguma marcação HTML em marcação JSX.

<Note>

JSX e React são duas coisas separadas. Eles são comumente utilizados juntos, mas você *pode* [usá-los independentemente](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) um do outro. JSX é uma extensão de sintaxe, enquanto o React é uma biblioteca Javascript.

</Note>

## Convertendo HTML em JSX {/*converting-html-to-jsx*/}

Suponha que você possua um HTML (perfeitamente válido):

```html
<h1>Ferramentas do Hedy Lamarr</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Inventar novos semáforos
    <li>Ensaiar uma cena de filme
    <li>Melhorar a tecnologia espectral
</ul>
```

E você quer colocar dentro do seu componente:

```js
export default function ListaDeTarefas() {
  return (
    // ???
  )
}
```

Se você copiar e colar como está, não funcionará:


<Sandpack>

```js
export default function ListaDeTarefas() {
  return (
    // Isso não funciona muito bem!
    <h1>Tarefas do Hedy Lamarr</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="foto"
    >
    <ul>
      <li>Inventar novos semáforos
      <li>Ensaiar uma cena de filme
      <li>Melhorar a tecnologia espectral
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Isso ocorre porque o JSX é mais rígido e possui algumas regras a mais que o HTML! Se você ler as mensagens de erro acima, elas o guiarão para corrigir a marcação ou você poderá seguir o guia abaixo.

<Note>

Na maioria das vezes, as mensagens de erro na tela do React irão ajudá-lo a encontrar onde está o problema. Dê uma lida se você ficar travado!

</Note>

## As Regras do JSX {/*the-rules-of-jsx*/}

### 1. Retornar um único elemento raiz {/*1-return-a-single-root-element*/}

Para retornar vários elementos de um componente, **envolva-os com uma única tag pai.**

Por exemplo, você pode usar uma `<div>`:

```js {1,11}
<div>
  <h1>Tarefas do Hedy Lamarr</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="foto"
  >
  <ul>
    ...
  </ul>
</div>
```


Se você não quiser adicionar uma `<div>` extra à sua marcação, você pode escrever `<>` e `</>` em vez disso:

```js {1,11}
<>
  <h1>Tarefas do Hedy Lamarr</h1>
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

Essa tag vazia é chamada de *[Fragmento.](/reference/react/Fragment)* Os fragmentos permitem que você agrupe coisas sem deixar rastros na árvore HTML do navegador.

<DeepDive>

#### Por que várias tags JSX precisam ser agrupadas? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX se parece com HTML, mas por detrás das cortinas é transformado em objetos JavaScript simples. Você não pode retornar dois objetos de uma função sem envolvê-los em uma matriz. Isso explica por que você também não pode retornar duas tags JSX sem envolvê-las em outra tag ou Fragmento.

</DeepDive>

### 2. Fechar todas as tags {/*2-close-all-the-tags*/}

O JSX requer que as tags sejam explicitamente fechadas: tags de fechamento automático como `<img>` devem se tornar `<img />`, e tags de empacotamento como `<li>laranjas` devem ser escritas como `<li>laranjas</li> `.

É assim que a imagem e os itens da lista de Hedy Lamarr ficam fechados:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="foto"
   />
  <ul>
    <li>Inventar novos semáforos</li>
    <li>Ensaiar uma cena de filme</li>
    <li>Melhorar a tecnologia espectral</li>
  </ul>
</>
```

### 3. camelCase <s>em todas</s> na maioria das coisas! {/*3-camelcase-salls-most-of-the-things*/}

JSX se transforma em JavaScript e atributos escritos em JSX se tornam chaves de objetos JavaScript. Em seus próprios componentes, muitas vezes você desejará ler esses atributos em variáveis. Mas JavaScript tem limitações em nomes de variáveis. Por exemplo, seus nomes não podem conter hífens ou palavras reservadas como `class`.

É por isso que, no React, muitos atributos HTML e SVG são escritos em camelCase. Por exemplo, em vez de `stroke-width` você usa `strokeWidth`. Já que `class` é uma palavra reservada, no React você escreve `className`, nomeado após a [propriedade DOM correspondente](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="foto"
/>
```

Você pode [encontrar todos esses atributos na lista de propriedades do componente DOM.](/reference/react-dom/components/common) Se você errar, não se preocupe — o React imprimirá uma mensagem com uma possível correção para o [console do navegador.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Por razões históricas, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) e [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) são escritos como em HTML com hífens.

</Pitfall>

### Dica: use um conversor JSX {/*pro-tip-use-a-jsx-converter*/}

Converter todos esses atributos em marcação pode ser tedioso! Recomendamos o uso de um [conversor](https://transform.tools/html-to-jsx) para traduzir seu HTML e SVG existentes para JSX. Os conversores são muito úteis na prática, mas ainda vale a pena entender o que está acontecendo para que você possa escrever JSX confortavelmente por conta própria.

Aqui está seu resultado final:

<Sandpack>

```js
export default function ListaDeTarefas() {
  return (
    <>
      <h1>Tarefas do Hedy Lamarr</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="foto" 
      />
      <ul>
        <li>Inventar novos semáforos</li>
        <li>Ensaiar uma cena de filme</li>
        <li>Melhorar a tecnologia espectral</li>
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

Agora você sabe porque o JSX existe e como usá-lo em componentes:

* Os componentes do React agrupam a lógica de renderização junto com a marcação porque estão relacionados.
* O JSX é semelhante ao HTML, com algumas diferenças. Se necessário, pode utilizar um [conversor] (https://transform.tools/html-to-jsx).
* As mensagens de erro geralmente indicam a direção certa para corrigir sua marcação.

</Recap>



<Challenges>

#### Converta um HTML para JSX {/*convert-some-html-to-jsx*/}

Este HTML foi colado em um componente, mas não é um JSX válido. Conserte-o:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Bem-vindo ao meu site!</h1>
    </div>
    <p class="resumo">
      Você pode encontrar meus pensamentos aqui.
      <br><br>
      <b>E <i>fotos</b></i> de cientistas!
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

.resumo {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Se vai fazê-lo manualmente ou utilizando um conversor, você decide! 

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Bem vindo ao meu site!</h1>
      </div>
      <p className="resumo">
        Você pode encontrar meus pensamentos aqui.
        <br /><br />
        <b>E <i>fotos</i></b> de cientistas!
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

.resumo {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
