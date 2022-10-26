---
title: Configuração do Editor
---

<Intro>

Um editor devidamente configurado pode tornar o código mais claro para ler e mais rápido para escrever. Ele pode até ajudar você a pegar erros enquanto os escreve! Se esta é a primeira vez que você configura um editor ou está procurando ajustar seu editor atual, nós temos algumas recomendações.

</Intro>

## Seu editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) é um dos editores mais populares em uso hoje em dia. Tem um grande marketplace de extensões e se integra bem com serviços populares como o GitHub. A maioria dos recursos listados abaixo também podem ser adicionados ao VS Code como extensões, tornando-o altamente configurável!

Outros editores de texto populares usados na comunidade React incluem:

* [WebStorm](https://www.jetbrains.com/webstorm/)—um ambiente de desenvolvimento integrado desenvolvido especificamente para JavaScript.
* [Sublime Text](https://www.sublimetext.com/)—tem suporte para JSX e TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) e auto-completar incorporados.
* [Vim](https://www.vim.org/)—um editor de texto altamente configurável construído para tornar a criação e modificação de qualquer tipo de texto muito eficiente. Ele está incluído como "vi" na maioria dos sistemas UNIX e no Apple OS X.

## Funcionalidades recomendadas do editor de texto {/*recommended-text-editor-features*/}

Alguns editores vêm com estas funcionalidades incorporadas, mas outros podem precisar acrescentar uma extensão. Verifique o suporte que seu editor de escolha oferece para ter certeza!

### Linting {/*linting*/}

Os linters de código encontram problemas em seu código enquanto você escreve, ajudando você a consertá-los cedo. [ESLint](https://eslint.org/) é um linter popular e de código aberto para JavaScript. 

* [Instale ESLint com a configuração recomendada para React](https://www.npmjs.com/package/eslint-config-react-app) (certifique-se de ter o [Node instalado!](https://nodejs.org/en/download/current/))
* [Integre ESLint no VSCode com a extensão oficial](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Formatação {/*formatting*/}

A última coisa que você quer fazer ao compartilhar seu código com outro colaborador é entrar em uma discussão sobre [tabs vs espaços](https://www.google.com/search?q=tabs+vs+espaços)! Felizmente, [Prettier](https://prettier.io/) limpará seu código reformatando-o de acordo com as regras pré-definidas e configuradas. Execute o Prettier e todos os seus tabs serão convertidos em espaços e suas indentações, aspas e etc também serão todos alterados para se adequar à configuração. Na configuração ideal, o Prettier será executado quando você salvar seu arquivo, fazendo rapidamente estas edições para você.

Você pode instalar a extensão [Prettier extensão no VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) seguindo estes passos:

1. Inicie o VS Code
2. Use a Abertura Rápida (pressione `CTRL/CMD + P`)
3. Colar `ext install esbenp.prettier-vscode`
4. Pressione enter

#### Formatação ao salvar {/*formatting-on-save*/}

Idealmente, você deve formatar seu código cada vez que salvar. O VS Code tem configurações para isso!

1. No VS Code, pressione `CTRL/CMD + SHIFT + P`.
2. Escreva "configurações"
3. Aperte o enter
4. Na barra de busca, escreva "format on save"
5. Certifique-se de que a opção "format on save" esteja marcada!

> Prettier pode às vezes entrar em conflito com outros linters. Mas geralmente há uma maneira de fazê-los funcionar bem juntos. Por exemplo, se você estiver usando Prettier com ESLint, você pode usar o plugin [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) para executar Prettier como uma regra do ESLint.
