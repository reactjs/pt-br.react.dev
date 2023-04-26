---
title: Instalação
---

<Intro>

O React foi projetado desde o início para uma adoção gradual. Você pode usar o React tanto quanto precisar. Se você quer ter um gostinho do React, adicionar alguma interatividade a uma página HTML ou começar um aplicativo complexo baseado em React, esta seção vai te ajudar a começar.

</Intro>

<YouWillLearn isChapter={true}>

* [Como iniciar um novo projeto React](/learn/start-a-new-react-project)
* [Como adicionar React a um projeto existente](/learn/add-react-to-an-existing-project)
* [Como configurar seu editor](/learn/editor-setup)
* [Como instalar o React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Experimente o React {/*try-react*/}

Você não precisa instalar nada para brincar com o React. Experimente editar neste Sandbox!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Olá, {name}</h1>;
}

export default function App() {
  return <Greeting name="mundo" />
}
```

</Sandpack>

Você pode editá-lo diretamente ou abrí-lo em uma nova guia pressionando o botão "Fork" no canto superior direito.

A Maioria das páginas de documentação do React contém uma Sandbox como esta. Fora da documentação do React, existem muitas Sandbox online que suportam o React: por exemplo, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), ou [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### Experimente o React localmente {/*try-react-locally*/}

Para experimentar o React localmente no seu computador, [baixe esta página HTML.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Abra-a em seu editor e no seu navegador!

## Inicie um novo projeto React {/*start-a-new-react-project*/}

Se você quiser construir um aplicativo ou um site totalmente com React, [inicie um novo projeto React.](/learn/start-a-new-react-project)

## Adicione o React a um projeto existente {/*add-react-to-an-existing-project*/}

Se quiser experimentar o React no seu aplicativo ou site existente, [adicione o React a um projeto existente.](/learn/add-react-to-an-existing-project)

## Próximos passos {/*next-steps*/}

Vá para o [Guia de Início Rápido](/learn) para uma visão geral dos conceitos mais importantes do React que você encontrará todos os dias.