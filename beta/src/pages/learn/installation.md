---
title: Instalação
---

<Intro>

O React foi pensado desde o início para a adoção gradual, e você pode usar o quanto de React que você precisar. Se você quiser experimentar o React, adicionar um pouco de interatividade para uma página HTML, ou iniciar um aplicativo complexo desenvolvido com React, esta seção irá te ajudar a começar. 

</Intro>

<YouWillLearn>

* [Como adicionar o React a uma página HTML](/learn/add-react-to-a-website)
* [Como criar um novo projeto React](/learn/start-a-new-react-project)
* [Como configurar seu editor de código](/learn/editor-setup)
* [Como instalar a Ferramenta de Desenvolvedor do React](/learn/react-developer-tools)

</YouWillLearn>

## Testar o React {/*try-react*/}

Você não precisa instalar nada para testar o React. Tente editar a sandbox abaixo!

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

Nós utilizamos sandboxes ao longo desta documentação como ferramentas de aprendizagem. As sandboxes lhe ajudam a familiarizar-se com o funcionamento do React e te auxiliam a decidir se o React é a escolha certa para você. Além das presentes na documentação oficial, existem diversas sandboxes online que têm suporte para React: [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), ou [CodePen](https://codepen.io/pen/?template=wvdqJJm), por exemplo.

### Testar o React localmente {/*try-react-locally*/}

Para testar o React localmente, [faça o download desta página HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). Abra-a no seu editor de código e no seu navegador!

## Adicionar o React a uma página {/*add-react-to-a-page*/}

Se você estiver trabalhando em um site já existente e precisa usar apenas um pouco de React, você pode [adicionar o React com uma tag de script](/learn/add-react-to-a-website). 

## Iniciar um projeto React {/*start-a-react-project*/}


Se você estiver pronto para [iniciar um projeto do zero](/learn/start-a-new-react-project) com React, você pode configurar um conjunto de ferramentas pequeno para ter uma experiência de desenvolvimento agradável. Você pode também iniciar com uma framework que toma várias decisões para você por padrão. 

## Próximos passos {/*next-steps*/}

Como você irá iniciar a sua jornada depende de como você gosta de aprender, o que você precisa realizar, e o quanto você quer evoluir! Por que não ler [Pensando em React](/learn/thinking-in-react) - nosso tutorial de introdução? Ou você pode ir direto para [Descrevendo a UI](/learn/describing-the-ui) para testar mais exemplos e aprender cada tópico passo a passo. Não há maneira errada de aprender React!