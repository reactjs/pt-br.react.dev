---
title: Instalação
---

<Intro>

React foi projetado desde o princípio para adoção gradual. Você pode utilizar o React o quanto for necessário. Seja se você quiser ter um gostinho do React, adicionar alguma interatividade a uma página HTML, ou iniciar uma aplicação complexa baseada em React, esta seção vai ajudá-lo a dar os primeiros passos.

</Intro>

<YouWillLearn isChapter={true}>

* [Como iniciar um novo projeto em React](/learn/start-a-new-react-project)
* [Como adicionar React a um projeto existente](/learn/add-react-to-an-existing-project)
* [Como configurar seu editor](/learn/editor-setup)
* [Como instalar as Ferramentas de Desenvolvedor React](/learn/react-developer-tools)

</YouWillLearn>

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

<<<<<<< HEAD
A maioria das páginas nas documentações do React contém exemplos interativos como este. Fora da documentação do React, existem muitos sites *sandboxes* que permitem usar React: por exemplo, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), ou [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)
=======
Most pages in the React documentation contain sandboxes like this. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?template=QWYVwWN)
>>>>>>> eb174dd932613fb0784a78ee2d9360554538cc08

### Experimente React localmente {/*try-react-locally*/}

Para experimentar o React localmente na sua máquina, [baixe este arquivo HTML.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Abra-o em seu editor e em seu navegador!

## Inicie um novo projeto em React {/*start-a-new-react-project*/}

Caso queira construir uma aplicação ou um site totalmente em React, [inicie um novo projeto em React.](/learn/start-a-new-react-project)

## Adicione React a um projeto existente {/*add-react-to-an-existing-project*/}

Caso queira experimentar React em uma aplicação ou site já existentes, [adicione React a um projeto existente.](/learn/add-react-to-an-existing-project)

## Próximos passos {/*próximos-passos*/}

Vá para o guia de [Início Rápido](/learn) para um tour pelos conceitos mais importantes de React que você encontrará no dia a dia.

