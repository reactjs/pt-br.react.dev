---
title: JavaScript em JSX com chaves
---

<Intro>

A sintaxe JSX permite que você escreva tags similares ao HTML dentro de um arquivo JavaScript, mantendo a lógica de renderização e o conteúdo no mesmo local. Às vezes, você pode querer adicionar um pouco de lógica JavaScript ou referenciar uma propriedade dinâmica dentro deste bloco de tags. Nessa situação, você pode usar chaves em seu JSX para abrir uma janela para o JavaScript.

</Intro>

<YouWillLearn>

* Como passar strings com aspas
* Como fazer referência a uma variável JavaScript dentro do JSX usando chaves
* Como chamar uma função JavaScript dentro da JSX com chaves
* Como usar um objeto JavaScript dentro da JSX com chaves

</YouWillLearn>

## Passando strings com aspas {/*passing-strings-with-quotes*/}

Quando você quiser passar um atributo de string para a JSX, coloque-o entre aspas simples ou duplas:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Neste caso, `"https://i.imgur.com/7vQD0fPs.jpg"` e `"Gregorio Y. Zara"` estão sendo passados como strings.

Mas e se você quiser especificar dinamicamente o atributo `src` ou `alt`? Você poderia **usar um valor do JavaScript substituindo `"` e `"` por `{` e `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Perceba a diferença entre `className="avatar"`, que especifica um nome de classe CSS `"avatar"` para tornar a imagem redonda, e `src={avatar}`, que lê o valor da variável JavaScript chamada `avatar`. Isso ocorre porque as chaves permitem que você trabalhe com JavaScript diretamente em seu bloco de tags!

## Usando chaves: Uma janela para o mundo do JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX é uma forma especial de escrever JavaScript. Isso significa que é possível usar JavaScript dentro dela - com chaves `{ }`. O exemplo abaixo primeiro declara um nome para o cientista, `name`, e depois o insere o dentro do `<h1>` com chaves:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Tente trocar o valor do `name` de `'Gregorio Y. Zara'` para `'Hedy Lamarr'`. Está vendo como o título da lista muda?

Qualquer expressão JavaScript funcionará entre chaves, incluindo chamadas de função como `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Onde usar chaves {/*where-to-use-curly-braces*/}

Você só pode usar chaves de duas maneiras dentro da JSX:

1. **Como texto** diretamente dentro de uma tag JSX: `<h1>{nome}'s To Do List</h1>` funciona, porém `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` não funcionará.
2. **Como atributos** imediatamente após o sinal `=`: `src={avatar}` lerá a variável `avatar`, mas `src="{avatar}"` passará a string `"{avatar}"`.

## Uso de "chaves duplas": CSS e outros objetos em JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Além de strings, números e outras expressões JavaScript, você pode até passar objetos em JSX. Os objetos também são denotados por chaves, como `{ name: "Hedy Lamarr", inventions: 5 }`. Portanto, para passar um objeto JS em JSX, você deve envolver o objeto em outro par de chaves: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Você pode ver isso com estilos CSS em linha na JSX. O React não exige que você use estilos inline (as classes CSS funcionam muito bem na maioria dos casos). Mas quando você precisa de um estilo inline, você passa um objeto para o atributo `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Tente alterar os valores de `backgroundColor` e `color`.

Você pode ver claramente o objeto JavaScript dentro das chaves quando o escreve dessa forma:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Da próxima vez que você encontrar `{{` e `}}` em JSX, saiba que isso é nada mais do que um objeto dentro das chaves da JSX!

<Pitfall>

As propriedades de `style` em linha são escritas em camelCase. Por exemplo, o HTML `<ul style="background-color: black"`> seria escrito como `<ul style={{ backgroundColor: 'black' }}>` em seu componente.

</Pitfall>

## Mais diversão com objetos JavaScript e chaves {/*more-fun-with-javascript-objects-and-curly-braces*/}

Você pode colocar várias expressões dentro de um objeto e referenciá-las em seu JSX dentro de chaves:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Neste exemplo, o objeto JavaScript `person` contém uma string `name` e um objeto `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

O componente pode usar os valores de `person` da seguinte forma:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX é uma linguagem de modelação mínima, pois permite que você organize dados e lógica usando JavaScript.

<Recap>

Agora você sabe quase tudo sobre JSX:

* Os atributos JSX entre aspas são passados como strings.
* As chaves permitem que você inclua a lógica e as variáveis do JavaScript em seu bloco de tags.
* Elas funcionam dentro do conteúdo da tag JSX ou imediatamente após `=` em atributos.
* `{{` e `}}` não é uma sintaxe especial: é um objeto JavaScript colocado entre chaves JSX.

</Recap>

<Challenges>

#### Corrija o erro {/*fix-the-mistake*/}

Este código é interrompido com um erro dizendo `Objetos não são válidos como um filho React`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Você consegue identificar o problema?

<Hint>Observe o que está dentro das chaves. Estamos colocando a coisa certa lá?</Hint>

<Solution>

Isso está acontecendo porque esse exemplo renderiza *um objeto* no bloco de tags em vez de uma string: `<h1>{person}'s Todos</h1>` está tentando renderizar o objeto `person` inteiro! A inclusão de objetos diretamente como conteúdo de texto gera um erro porque o React não sabe como você deseja exibi-los.

Para corrigi-lo, substitua `<h1>{person}'s Todos</h1>` por `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Extraia informações para um objeto {/*extract-information-into-an-object*/}

Extraia o URL da imagem para o objeto `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Mova o URL da imagem para uma propriedade chamada `person.imageUrl` e leia-o a partir da tag `<img>` usando chaves:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Escreva uma expressão entre chaves JSX {/*write-an-expression-inside-jsx-curly-braces*/}

No objeto abaixo, o URL completo da imagem é dividido em quatro partes: URL base, `imageId`, `imageSize` e extensão do arquivo.

Queremos que o URL da imagem combine estes atributos: URL base (sempre `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) e extensão de arquivo (sempre `'.jpg'`). Entretanto, há algo errado com a forma como a tag `<img>` especifica sua `src`.

Você pode consertá-lo?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Para verificar se sua correção funcionou, tente alterar o valor de `imageSize` para `'b'`. A imagem deverá ser redimensionada após sua edição.

<Solution>

Você pode escrevê-lo como `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` abre a expressão JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produz a string de URL correta
3. `}` fecha a expressão JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Você também pode mover essa expressão para uma função separada, como `getImageUrl` abaixo:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Variáveis e funções podem ajudá-lo a manter o bloco de tags simples!

</Solution>

</Challenges>
