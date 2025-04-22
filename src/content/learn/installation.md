---
title: Instalação
---

<Intro>

React foi projetado desde o princípio para adoção gradual. Você pode utilizar o React o quanto for necessário. Seja se você quiser ter um gostinho do React, adicionar alguma interatividade a uma página HTML, ou iniciar uma aplicação complexa baseada em React, esta seção vai ajudá-lo a dar os primeiros passos.

</Intro>

## Experimente React {/*try-react*/}

Não é necessário que instale nada para mexer com o React. Experimente editar este exemplo de código!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Você pode editá-lo diretamente ou abri-lo em uma nova aba pressionando o botão "Fork" no canto superior direito.

A maioria das páginas na documentação do React contém sandboxes como esta. Fora da documentação do React, existem muitos sandboxes online que suportam React: por exemplo, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) ou [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Para experimentar o React localmente em sua máquina, [baixe este arquivo HTML.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Abra-o em seu editor e em seu navegador!

## Criando um App React {/*creating-a-react-app*/}

Se você quiser iniciar um novo app React, você pode [criar um app React](/learn/creating-a-react-app) usando um framework recomendado.

## Criando um App React do Zero {/*build-a-react-app-from-scratch*/}

Se um framework não for uma boa opção para seu projeto, você preferir construir seu próprio framework, ou você apenas quer aprender os fundamentos de um app React, você pode [criar um app React do zero](/learn/build-a-react-app-from-scratch).

## Adicione React a um projeto existente {/*add-react-to-an-existing-project*/}

Se você quiser experimentar o React em seu app ou site existente, você pode [adicionar o React a um projeto existente.](/learn/add-react-to-an-existing-project)


<Note>

#### Devo usar Create React App? {/*should-i-use-create-react-app*/}

Não. Create React App foi descontinuado. Para mais informações, veja [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Próximos passos {/*próximos-passos*/}

Vá para o guia de [Início Rápido](/learn) para um tour pelos conceitos mais importantes de React que você encontrará no dia a dia.

