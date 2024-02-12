---
title: Importando e Exportando Componentes
---

<Intro>

A magia dos componentes reside na sua habilidade de reutilização: você pode criar um componente que é composto por outros componentes. Mas conforme você aninha mais e mais componentes, faz sentido começar a dividi-los em arquivos diferentes. Isso permite que você mantenha seus arquivos fáceis de explorar e reutiliza-los em mais lugares.

</Intro>

<YouWillLearn>

* O que é um arquivo de componente raiz
* Como importar e exportar um componente
* Quando usar importações e exportações padrão (`default`) e nomeada
* Como importar e exportar múltiplos componentes em um arquivo
* Como separar componentes em múltiplos arquivos

</YouWillLearn>

## O arquivo de componente raiz {/*the-root-component-file*/}

Em [Seu Primeiro Componente](/learn/your-first-component), você criou um componente `Profile` e um componente `Gallery` que renderiza:

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

Atualmente, eles residem em um **arquivo de componente raiz,** chamado `App.js` nesse exemplo. Dependendo da sua configuração, seu componente raiz pode estar em outro arquivo. Se você usar um framework com roteamento baseado em arquivo, como o Next.js, seu componente raiz será diferente para cada página.

## Exportando e importando um componente {/*exporting-and-importing-a-component*/}

E se você quiser mudar a tela inicial no futuro e colocar uma lista de livros de ciências lá? Ou colocar todos os perfis em outro lugar? Faz sentido mover `Gallery` e `Profile` para fora do arquivo do componente raiz. Isso os tornará mais modulares e reutilizáveis em outros arquivos. Você pode mover um componente em três etapas:

1. **Criar** um novo arquivo JS para colocar os componentes.
2. **Exportar** seu componente de função desse arquivo (usando exportações [padrão](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) ou [nomeada](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **Importar** no arquivo onde você usará o componente (usando a técnica correspondente para importar exportações [padrão](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) ou [nomeadas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

Aqui, tanto `Profile` e `Gallery` foram movidos de `App.js` para um novo arquivo chamado `Gallery.js`. Agora você pode alterar o arquivo `App.js` para importar o componente `Gallery` de `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Observe como este exemplo é dividido em dois arquivos de componentes agora:

1. `Gallery.js`:
     - Define o componente `Profile` que é usado apenas dentro do mesmo arquivo e não é exportado.
     - Exporta o componente `Gallery` como uma **(default export).**
2. `App.js`:
     - Importa `Gallery` como uma **importação padrão** de `Gallery.js`.
     - Exporta o componente raiz `App` como uma **exportação padrão (default export).**


<Note>

Você pode encontrar arquivos que não possuem a extensão de arquivo `.js` da seguinte forma:

```js 
import Gallery from './Gallery';
```

Tanto `'./Gallery.js'` quanto `'./Gallery'` funcionarão com o React, embora o primeiro esteja mais próximo de como os [Módulos ES nativos](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) funcionam.

</Note>

<DeepDive>

#### Exportação padrão vs nomeada {/*default-vs-named-exports*/}

Existem duas maneiras principais de exportar valores com JavaScript: exportações padrão e exportações nomeadas. Até agora, nossos exemplos usaram apenas exportações padrão. Mas você pode usar um ou ambos no mesmo arquivo. **Um arquivo não pode ter mais de uma exportação _padrão_, mas pode ter quantas exportações _nomeadas_ você desejar.**

![Exportações padrão e nomeadas](/images/docs/illustrations/i_import-export.svg)

A forma como você exporta seu componente determina como você deve importá-lo. Você receberá um erro se tentar importar uma exportação padrão da mesma forma que faria com uma exportação nomeada! Este gráfico pode ajudá-lo a acompanhar:

| Sintase | Declaração de exportação              | Declaração de importação                |
| ------- | ------------------------------------- | --------------------------------------- |
| Padrão  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nomeada | `export function Button() {}`         | `import { Button } from './Button.js';` |

Quando você escreve uma importação _padrão_, você pode colocar o nome que quiser depois de `import`. Por exemplo, você poderia escrever `import Banana from './Button.js'` e ainda forneceria a mesma exportação padrão. Por outro lado, com importações nomeadas, o nome deve corresponder em ambos os lados. É por isso que eles são chamados de importações _nomeadas_!

**Os usuários costumam usar exportações padrão se o arquivo exportar apenas um componente e usar exportações nomeadas se exportar vários componentes e valores.** Independentemente de qual estilo de código você preferir, sempre forneça nomes significativos para as funções do componente e os arquivos que os contêm. Componentes sem nomes, como `export default () => {}`, são desencorajados porque dificultam a depuração.

</DeepDive>

## Exportando e importando múltiplos componentes no mesmo arquivo {/*exporting-and-importing-multiple-components-from-the-same-file*/}

E se você quiser mostrar apenas um `Profile` em vez de uma galeria? Você também pode exportar o componente `Profile`. Mas `Gallery.js` já tem uma exportação *padrão* e você não pode ter _duas_ exportações padrão. Você poderia criar um novo arquivo com uma exportação padrão ou adicionar uma exportação *nomeada* para `Profile`. **Um arquivo pode ter apenas uma exportação padrão, mas pode ter várias exportações nomeadas!**

<Note>

Para reduzir a confusão potencial entre exportações padrão e nomeadas, algumas equipes optam por manter apenas um estilo (padrão ou nomeado) ou evitar misturá-los em um único arquivo. Faça o que for melhor para você!

</Note>

Primeiro, **exporte** `Profile` de `Gallery.js` usando uma exportação nomeada (sem a palavra-chave `default`):

```js
export function Profile() {
  // ...
}
```

Então, **importe** `Profile` de `Gallery.js` para `App.js` usando uma importação nomeada (com chaves):

```js
import { Profile } from './Gallery.js';
```

Finalmente, **renderize** `<Profile />` do componente `App`:

```js
export default function App() {
  return <Profile />;
}
```

Agora `Gallery.js` contém duas exportações: uma exportação `Gallery` padrão e uma exportação `Profile` nomeada. `App.js` importa ambos. Tente editar `<Profile />` para `<Gallery />` e vice-versa neste exemplo:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Agora você esta usando uma mistura de exportações padrão e nomeadas:

* `Gallery.js`:
  - Exporta o componente `Profile` como uma **exportação chamada `Profile`.**
  - Exporta o componente `Gallery` como uma **exportação padrão.**
* `App.js`:
  - Importa `Profile` como uma **importação nomeada chamada `Profile`** de `Gallery.js`.
  - Importa `Gallery` como uma **importação padrão** de `Gallery.js`.
  - Exporta o componente raiz `App` como uma **exportação padrão.**

<Recap>

Nessa pagina você aprendeu:

* O que é um arquivo de componente raiz
* Como importar e exportar um componente
* Quando e como usar importações e exportações padrão e nomeada
* Como exportar múltiplos componentes em um arquivo

</Recap>



<Challenges>

#### Divida os componentes ainda mais {/*split-the-components-further*/}

Atualmente, `Gallery.js` exporta `Profile` e `Gallery`, o que é um pouco confuso.

Mova o componente `Profile` para seu próprio `Profile.js` e, em seguida, altere o componente `App` para renderizar `<Profile />` e `<Gallery />` um após o outro.

Você pode usar uma exportação padrão ou nomeada para `Profile`, mas certifique-se de usar a sintaxe de importação correspondente tanto em `App.js` e `Gallery.js`! Você pode consultar a tabela abaixo:

| Sintase | Declaração de exportação              | Declaração de importação                |
| ------- | ------------------------------------- | --------------------------------------- |
| Padrão  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nomeada | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Não se esqueça de importar seus componentes onde eles são chamados. A `Gallery` também não usa `Profile`?

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
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

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Depois de fazê-lo funcionar com um tipo de exportação, faça-o funcionar com o outro tipo.

<Solution>

Esta é a solução com exportações nomeadas:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

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

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Esta é a solução com exportações padrão:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

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

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
