---
id: accessibility
title: Acessibilidade
permalink: docs/accessibility.html
---

## Por que Acessibilidade ? {#why-accessibility}

A acessibilidade da Web (também chamada de [** a11y **](https://en.wiktionary.org/wiki/a11y)) é o design e a criação de sites que podem ser usados ​​por todos. O suporte à acessibilidade é necessário para permitir que tecnologias assistivas interpretem as páginas da web.

React suporta totalmente a construção de sites acessíveis, muitas vezes usando técnicas HTML padrão.


## Padrões e Diretrizes {#standards-and-guidelines}

### WCAG  {#wcag} 

O [Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag) fornece diretrizes para a criação de sites acessíveis.

As seguintes checklists das WCAG fornecem uma visão geral:

- [WCAG checklist from Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [WCAG checklist from WebAIM](https://webaim.org/standards/wcag/checklist)
- [Checklist from The A11Y Project](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

O documento [Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) contém técnicas para a criação de widgets JavaScript totalmente acessíveis.

Note que todos os atributos HTML `aria-*` são totalmente suportados no JSX. Enquanto a maioria das propriedades e atributos do DOM no React são camelCase, esses atributos devem ser hyphen-case ​​(também conhecidos como kebab-case, lisp-case, etc), pois estão em HTML:


```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## Linguagem HTML {#semantic-html}

Linguagem é a base da acessibilidade em um aplicativo da web. Usando os corretamente elementos HTML para reforçar o significado da informação
em nossos sites, muitas vezes a acessibilidade pode vir gratuitamente.

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)


Às vezes, quebramos a semântica de HTML quando adicionamos elementos `<div>` ao nosso JSX somente para fazer nosso código React funcionar, especialmente ao trabalhar com listas (`<ol>`, `<ul>` e `<dl>`) e HTML `<table>`. Nesses casos, devemos usar [React Fragments](/docs/fragments.html) para agrupar vários elementos.

Por exemplo,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListaDeItems({ item }) {
  return (
    <Fragment>
      <dt>{item.nome}</dt>
      <dd>{item.descricao}</dd>
    </Fragment>
  );
}

function Glossario(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListaDeItems item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Você pode mapear uma coleção de items para uma matriz de fragmentos como faria com qualquer outro tipo de elemento:

```javascript{6,9}
function Glossario(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments também aceitam `key`(chave) prop quando estao mapeando coleções
        <Fragment key={item.id}>
          <dt>{item.nome}</dt>
          <dd>{item.descricao}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Quando você não precisa de nenhum `prop` na tag Fragment você pode usar a [syntax curta](/docs/fragments.html#short-syntax), se a sua configuração suportar:

```javascript{3,6}
function ListaDeItems({ item }) {
  return (
    <>
      <dt>{item.nome}</dt>
      <dd>{item.descricao}</dd>
    </>
  );
}
```

Para mais informações, veja a [doumentação para Fragments](/docs/fragments.html).

## Formulários Acessíveis {#accessible-forms}

### Rótulos {#labeling}

Todos os elements de um formulário HTML, como `<input>` e `<textarea>`, precisam ser rotulados. Precisamos fornecer rótulos descritivos pois são expostos aos leitores de tela.

Os seguintes artigos nos mostram como fazer isso:

- [The W3C shows us how to label elements](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM shows us how to label elements](https://webaim.org/techniques/forms/controls)
- [The Paciello Group explains accessible names](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Embora essas práticas HTML padrão possam ser usadas diretamente em React, observe que o atributo `for` está escrito como `htmlFor` em JSX:

```javascript{1}
<label htmlFor="nomeDaEntrada">Nome:</label>
<input id="nomeDaEntrada" type="text" name="nome"/>
```

### Notificando erros ao usuário {#notifying-the-user-of-errors}

Situações de erro precisam ser entendidas por todos os usuários. Os artigos a seguir nos mostram como expor os erros aos leitores de tela:

- [The W3C demonstrates user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM looks at form validation](https://webaim.org/techniques/formvalidation/)

## Controle de Foco {#focus-control}

Certifique-se de que seu aplicativo da web seja totalmente navegável apenas com o teclado:

- [WebAIM talks about keyboard accessibility](https://webaim.org/techniques/keyboard/)

### Foco no teclado e foco de contorno  {#keyboard-focus-and-focus-outline}

Foco no teclado se refere ao elemento no DOM que foi selecionado e aceita ações do teclado. Podemos ver o contorno do foco na imagem a seguir: 

<img src="../images/docs/keyboard-focus.png" alt="Contorno de foco azul envolta do link selecionado" />

Somente use CSS que elimine este contorno, por exemplo, definindo `outline: 0`, se você for substituí-lo por outra implementação de esquema de foco.

### Mecanismos para pular conteúdo {#mechanisms-to-skip-to-desired-content}

São mecanismos para permitir que os usuários ignorem as seções de navegação anteriores em seu aplicativo, pois isso ajuda e acelera a navegação pelo teclado.

Skiplinks ou Links para Pular Navegacão são links de navegação ocultos que só se tornam visíveis quando os usuários interagem com a página usando o teclado. Eles são muito fáceis de implementar com alguns estilos e âncoras de páginas:

- [WebAIM - Skip Navigation Links](https://webaim.org/techniques/skipnav/)

Também use elementos e pontos de referência, como `<main>` e `<aside>`, para demarcar regiões de páginas como tecnologia assistiva, permitindo que o usuário navegue rapidamente para estas seções.

Leia mais sobre o uso desses elementos para melhorar a acessibilidade aqui:

- [Accessible Landmarks](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Programaticamente gerenciando o foco {#programmatically-managing-focus}

Aplicações em React modificam continuamente o HTML DOM durante o tempo de execução, às vezes levando à perda de foco do teclado ou a um elemento inesperado. Para consertar isso, precisamos programar o foco do teclado na direção certa, de maneira programática. Por exemplo, redefinindo o foco do teclado para um botão que abriu uma janela modal depois que essa janela restrita é fechada.

Você pode encotrar mais informações de como fazer isto no MDN [navegação por teclado de JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Para definir o foco no React, podemos usar [Refs para elementos no DOM](/docs/refs-and-the-dom.html).

Dessa maneira, primeiro criamos uma referência a um elemento no JSX de uma classe de componente:

```javascript{4-5,8-9,13}
class EntradaDeTexto extends React.Component {
  constructor(props) {
    super(props);
    // Cria um ref para guardar o inputDeTexto no DOM 
    this.inputDeTexto = React.createRef();
  }
  render() {
  // Use a `ref` callback para guardar a referencia do texto no input dentro do DOM 
  // elemento em um campo (por exemplo, this.inputDeTexto).
    return (
      <input
        type="text"
        ref={this.inputDeTexto}
      />
    );
  }
}
```

Então podemos nos concentrar em outro lugar em nosso componente quando necessário:

 ```javascript
 focus() {
   // Focalize explicitamente a entrada de texto usando a API DOM 
   // Nota: estamos acessando o DOM "atual" para obter o elemento
   this.textInput.current.focus();
 }
 ```

Às vezes, um componente pai precisa definir o foco para um elemento em um componente filho. Nós podemos fazer isso [expondo as referências DOM aos componentes pais](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components), através de um `prop` especial no componente filho que encaminha a referência do pai o elemento filho.

```javascript{4,12,16}
function EntradaDeTexto(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class ComponentePai extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <EntradaDeTexto inputRef={this.inputElement} />
    );
  }
}

// Agora você pode definir o foco quando necessário.
this.inputElement.current.focus();
```

Ao usar um HOC (Componente de alta ordem) para estender componentes é recomendado [encaminhar a ref](/docs/forwarding-refs.html) para o componente de menor order usando a função  de React `forwardRef`. Se um terceiro HOC não passar a referência, o padrão acima ainda pode ser usado como fallback.

Um ótimo exemplo de gerenciamento de foco é o [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Este é um exemplo relativamente raro de uma janela modal totalmente acessível. Não só define o foco inicial o botão cancelar (impedindo o usuário do teclado de ativar acidentalmente a ação de sucesso) e interceptar o foco do teclado dentro do modal, ele também redefine o foco de volta para o elemento que inicialmente acionou o modal.

>Nota:
>
>Embora esse seja um recurso de acessibilidade muito importante, também é uma técnica que deve ser usada de maneira criteriosa. 
>Use-o para reparar o comportamento do foco do teclado quando ele é alterado, e não para tentar antecipar como os usuários desejam usar os aplicativos.


## Movimentos do mouse e ponteiro (cursor) {#mouse-and-pointer-events}

Certifique-se de que todas as funcionalidades expostas através do movimento de mouse ou ponteiro também possam ser acessadas usando apenas o teclado. Se depender apenas do movimento do mouse, haverá muitos casos em que usuários de teclado não poderão usar seu aplicativo.

Para ilustrar isso, abaixo pode-se ver um exemplo clássico de quebra da acessibilidade causada por cliques. Esse é o padrão de clique externo, em que um usuário pode desativar um popover aberto clicando fora do elemento.

<img src="../images/docs/outerclick-with-mouse.gif" alt=" Um botão de que abre uma lista pop-over implementada com o clique e operado com um mouse mostrando que a ação de fechamento funciona." />

Isso geralmente é implementado ao anexar um `click` ao objeto de janela que fecha o popover:

```javascript{12-14,26-30}
class ClickForaExemplo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Isso pode funcionar bem para usuários com dispositivos com ponteiro, como um mouse. Mas, operá-lo apenas com o teclado quebra a funcionalidade ao passar para o próximo elemento, já que o objeto `window` nunca recebe um evento `click`. Isso pode levar a uma funcionalidade escondida que impede os usuários de usar seu aplicativo.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

A mesma funcionalidade pode ser obtida usando manipuladores de eventos apropriados, como `onBlur` e `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class ExamploDeBlur extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Fechamos o popover no próximo tick usando setTimeout.
  // Isso é necessário porque precisamos primeiro checar se
  // outro filho do elemento recebeu foco como
  // o evento blur é acionado antes do novo evento de foco.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Se o elemento filho receber foco, não feche o popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // O React nos ajuda cancelando o blur e
    // focando nos eventos do elemento pai.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Esse código expõe a funcionalidade para usuários de dispositivo de mouse e teclado. Observe também os `aria-*` `props` adicionados para suportar usuários de leitores de tela. Por motivos de simplicidade a interação com as setas nas opções de popover não foram implementados.

<img src="../images/docs/blur-popover-close.gif" alt="Uma lista popover que fecha corretamente para usuários de mouse e teclado." />

Este é um exemplo de muitos casos em que, depender apenas dos eventos de ponteiro e o mouse, pode quebrar a funcionalidade para usuários de teclado. Sempre testar com o teclado realçará imediatamente as áreas problemáticas que podem ser corrigidas usando manipuladores de eventos com reconhecimento de teclado.

## Widgets mais complexos {#more-complex-widgets}

Uma experiência do usuário mais complexa não significa ser menos acessível. Considerando que a acessibilidade é mais facilmente alcançada programando o mais próximo possível do HTML, até mesmo o widget mais complexo pode ser programado de forma acessível.

Aqui, exigimos conhecimento de [ARIA Roles](https://www.w3.org/TR/wai-aria/#role), bem como [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
Estas são caixas de ferramentas preenchidas com atributos HTML que são totalmente suportados no JSX e nos permitem construir componentes em React totalmente funcionais e totalmente acessíveis.

Cada tipo de widget tem um padrão de design específico e espera-se que funcione de certa forma por usuários e agentes do usuário:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/article/practical-aria-examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Outros pontos a serem consideração {#other-points-for-consideration}

### Definindo o idioma {#setting-the-language}

Indique o idioma dos textos de página, pois o software leitor de tela usa isso para selecionar as configurações de voz correta:

- [WebAIM - Document Language](https://webaim.org/techniques/screenreader/#language)

### Definindo o título do documento {#setting-the-document-title}

Defina no documento `<title>` para descrever corretamente o conteúdo atual da página, pois isso garante que o usuário permaneça ciente do contexto da página atual:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Podemos definir o titulo usando [React Document Title Component](https://github.com/gaearon/react-document-title).

### Contraste de Cor{#color-contrast}

Certifique-se de que todo o texto legível em seu site tenha contraste de cores suficiente para permanecer legível ao máximo por usuários com baixa visão:

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](https://a11yproject.com/posts/what-is-color-contrast/)

Pode ser entediante calcular manualmente as combinações de cores adequadas para todos os casos em seu site. Em vez disso, você pode [calcular uma paleta de cores inteira acessível com Colorable](https://jxnblk.com/colorable/).

As ferramentas abaixo aXe e WAVE incluem testes de contraste de cores e relatam erros de contraste.

Se você quiser estender suas habilidades de teste de contraste, você pode usar estas ferramentas:

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Ferramentas de Desenvolvimento e Teste {#development-and-testing-tools}

Há várias ferramentas que podemos usar para ajudar na criação de aplicativos acessíveis.

### O Teclado {#the-keyboard}

Há várias ferramentas que podemos usar para ajudar na criação de aplicativos da Web acessíveis.

1. Desconectando o seu mouse.
2. Usando `Tab` e `Shift+Tab` navegue pelo site.
3. Usando `Enter` para clicar elementos.
3. Se necessário, usando o teclado e as setas, interaja com alguns elementos, como menus e dropdowns.

### Assistência ao desenvolvimento {#development-assistance}

Podemos verificar alguns recursos de acessibilidade diretamente em nosso código JSX. Frequentemente, as verificações do intellisense já são fornecidas em IDEs JSX para as funções, estados e propriedades do ARIA. Nós também temos acesso à seguintes ferramentas:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

O [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin para ESLint fornece feedback sobre o linting da AST em relação a problemas de acessibilidade no seu JSX. Muitos dos IDE permitem integrar essas descobertas diretamente na análise de código e nas janelas de código-fonte.

[Create React App](https://github.com/facebookincubator/create-react-app) tem este plugin com um subconjunto de regras ativadas. Se você quiser ativar ainda mais regras de acessibilidade, você pode criar um arquivo `.eslintrc` na raiz do seu projeto com este conteúdo:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testando acessibilidade no navegador {#testing-accessibility-in-the-browser}

Existem várias ferramentas que podem executar auditorias de acessibilidade em páginas da Web em seu navegador. Por favor, use-as em combinação com outras verificações de acessibilidade mencionadas aqui, pois elas podem somente testar a acessibilidade técnica do seu HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems oferece [aXe-core](https://github.com/dequelabs/axe-core) para testes de acessibilidade automatizados e de ponta a ponta de seus aplicativos. Este módulo inclui integrações para o Selenium.

[O mecanismo de acessibilidade aXe](https://www.deque.com/products/axe/) é uma extensão de navegador de inspetor de acessibilidade construída com `aXe-core`.

Você também pode usar o [react-axe](https://github.com/dylanb/react-axe), um módulo para logar essas descobertas de acessibilidade diretamente no console durante o desenvolvimento e avaliação.

#### WebAIM WAVE {#webaim-wave}

O [Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) é outra extensão do navegador de acessibilidade.

#### Inspectores de Acessibilidade e a Árvore de Acessibilidade {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) é um subconjunto da árvore DOM que contém objetos acessíveis para cada elemento DOM que deve ser exposto para tecnologia assistiva, como leitores de tela.

Em alguns navegadores, podemos visualizar facilmente as informações de acessibilidade de cada elemento na árvore de acessibilidade:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Using the Accessibility Inspector in Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Leitores de tela {#screen-readers}

Testar com um leitor de tela deve fazer parte de seus testes de acessibilidade.

Observe que as combinações de navegador / leitor de tela são importantes. É recomendável que você teste seu aplicativo no navegador mais adequado ao seu leitor de tela preferido.

###  Leitores de tela mais comumente usados {#commonly-used-screen-readers}

#### NVDA no Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) ou NVDA é um leitor de tela do Windows de código aberto que é amplamente utilizado.

Consulte os seguintes guias sobre como usar melhor o NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver no Safari {#voiceover-in-safari}

O VoiceOver é um leitor de tela integrado em dispositivos Apple.

Consulte os seguintes guias sobre como ativar e usar o VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](https://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS no Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) ou JAWS, é um leitor de tela muito popular, utilizado no sistema Windows.

Consulte os seguintes guias sobre como ativar e usar o JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Outros leitores de tela {#other-screen-readers}

#### ChromeVox no Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) é um leitor de tela integrado nos Chromebooks e está disponível [como extensão](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) para o Google Chrome.

Consulte os guias a seguir sobre como usar melhor o ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](https://www.chromevox.com/keyboard_shortcuts.html)
