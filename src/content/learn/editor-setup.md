---
title: Configuração do Editor
---

<Intro>

Um editor configurado corretamente pode tornar o código mais claro para ler e mais rápido para escrever. Ele pode até mesmo ajudá-lo a detectar erros ao escrevê-los! Se esta é a primeira vez que você configura um editor ou deseja ajustar seu editor atual, temos algumas recomendações.

</Intro>

<YouWillLearn>

* Quais são os editores mais populares
* Como formatar seu código automaticamente

</YouWillLearn>

## Seu editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) é um dos editores mais populares em uso hoje. Possui uma grande variedade de extensões e se integra bem a serviços populares como o GitHub. A maioria dos recursos listados abaixo também podem ser adicionados ao VS Code como extensões, tornando-o altamente configurável!

Outros editores de texto populares usados ​​na comunidade React incluem:

* [WebStorm](https://www.jetbrains.com/webstorm/) é um ambiente de desenvolvimento integrado projetado especificamente para JavaScript.
* [Sublime Text](https://www.sublimetext.com/) tem suporte para JSX e TypeScript, [realce de sintaxes](https://stackoverflow.com/a/70960574/458193) e preenchimento automático embutidos.
* [Vim](https://www.vim.org/) é um editor de texto altamente configurável construído para tornar a criação e alteração de qualquer tipo de texto muito eficiente. Está incluído como "vi" na maioria dos sistemas UNIX e no Apple OS X.

## Recursos recomendados dos editores de texto {/*recommended-text-editor-features*/}

Alguns editores vêm com esses recursos integrados, mas outros podem exigir a adição de uma extensão. Verifique o suporte que seu editor de escolha oferece para ter certeza!

### Linting {/*linting*/}

*Linters* de código encontram problemas em seu código enquanto você escreve, ajudando a corrigi-los antecipadamente. [ESLint](https://eslint.org/) é um popular *linter* de código aberto para JavaScript.

* [Instale o ESLint com a configuração recomendada para o React](https://www.npmjs.com/package/eslint-config-react-app) (cerfitique-se de ter o [Node instalado](https://nodejs.org/en/download/current/))
* [Integre o ESLint no VSCode com a extensão oficial](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Certifique-se de ter ativado as regras [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) para o seu projeto.** Elas são essenciais e detectam os bugs mais severos cedo. A predefinição [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) recomendada já as inclui.

### Formatação {/*formatting*/}

A última coisa que você quer fazer ao compartilhar seu código com outro colaborador é entrar em uma discussão sobre [tabs versus espaços](https://www.google.com/search?q=tabs+vs+spaces)! Felizmente, [Prettier](https://prettier.io/) limpará seu código reformatando-o para estar em conformidade com regras predefinidas e configuráveis. Execute o Prettier e todas as suas guias serão convertidas em espaços - e seu recuo, aspas, etc. também serão alterados para se adequar à configuração. Na configuração ideal, o Prettier será executado quando você salvar seu arquivo, fazendo essas edições rapidamente para você.

Você pode instalar a [extensão Prettier no VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) seguindo estas etapas:

1. Inicie o VSCode
2. Abra *Ir para Arquivo...* (pressione Ctrl/Cmd+P)
3. Cole `ext install esbenp.prettier-vscode`
4. Pressione Enter

#### Formatando ao salvar {/*formatting-on-save*/}

Idealmente, você deve formatar seu código a cada salvamento. O VS Code tem configurações para isso!

1. No VS Code, pressione `CTRL/CMD + SHIFT + P`.
2. Digite "configurações"
3. Pressione Enter
4. Na barra de pesquisa, digite "formatar ao salvar"
5. Se assegure de que a opção "formatar ao salvar" está selecionada!

> Se sua predefinição ESLint tiver regras de formatação, elas podem entrar em conflito com o Prettier. Recomendamos desativar todas as regras de formatação em sua predefinição ESLint usando [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) para que o ESLint seja *apenas* usado para detectar erros lógicos. Se você deseja impor que os arquivos sejam formatados antes que uma solicitação pull seja mesclada, use [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) para sua integração contínua.
