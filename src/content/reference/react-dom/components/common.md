---
title: "Componentes comuns (por exemplo, <div>)"
---

<Intro>

Todos os componentes de navegador integrados, como [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), suportam algumas `props` e eventos comuns.

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### Componentes comuns (por exemplo, `<div>`) {/*common*/}

```js
<div className="wrapper">Algum conteúdo</div>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*common-props*/}

Essas `props` especiais do React são suportadas para todos os componentes integrados:

* `children`: Um nó React (um elemento, uma string, um número, [um portal,](/reference/react-dom/createPortal) um nó vazio como `null`, `undefined` e booleanos, ou um array de outros nós React). Especifica o conteúdo dentro do componente. Quando você usa JSX, geralmente especificará a `prop` `children` implicitamente aninhando tags como `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Um objeto da forma `{ __html: '<p>algum html</p>' }` com uma string de HTML bruto dentro. Substitui a propriedade [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) do nó do DOM e exibe o HTML passado dentro. Isso deve ser usado com extrema cautela! Se o HTML dentro não for confiável (por exemplo, se for baseado em dados de usuário), você corre o risco de introduzir uma vulnerabilidade de [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). [Leia mais sobre o uso de `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Um objeto ref de [`useRef`](/reference/react/useRef) ou [`createRef`](/reference/react/createRef), ou uma [`ref` callback function,](#ref-callback) ou uma string para [refs legadas.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Sua ref será preenchida com o elemento DOM para esse nó. [Leia mais sobre como manipular o DOM com refs.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Um booleano. Se `true`, suprime o aviso que o React mostra para elementos que têm `children` e `contentEditable={true}` (que normalmente não funcionam juntos). Use isso se você estiver construindo uma biblioteca de entrada de texto que gerencia o conteúdo `contentEditable` manualmente.

* `suppressHydrationWarning`: Um booleano. Se você usar [renderização no servidor,](/reference/react-dom/server) normalmente há um aviso quando o servidor e o cliente renderizam conteúdos diferentes. Em alguns casos raros (como timestamps), é muito difícil ou impossível garantir uma correspondência exata. Se você definir `suppressHydrationWarning` como `true`, o React não alarmará sobre discrepâncias nos atributos e no conteúdo daquele elemento. Funciona apenas a um nível de profundidade e é destinado a ser usado como uma válvula de escape. Não exagere. [Leia sobre a supressão de erros de hidratação.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Um objeto com estilos CSS, por exemplo `{ fontWeight: 'bold', margin: 20 }`. Semelhante à propriedade DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style), os nomes das propriedades CSS precisam ser escritos em `camelCase`, por exemplo `fontWeight` em vez de `font-weight`. Você pode passar strings ou números como valores. Se você passar um número, como `width: 100`, o React automaticamente anexará `px` ("pixels") ao valor, a menos que seja uma [propriedade sem unidade.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Recomendamos usar `style` apenas para estilos dinâmicos onde você não conhece os valores do estilo antecipadamente. Em outros casos, aplicar classes CSS simples com `className` é mais eficiente. [Leia mais sobre `className` e `style`.](#applying-css-styles)

Essas `props` DOM padrão também são suportadas para todos os componentes integrados:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Uma string. Especifica um atalho de teclado para o elemento. [Geralmente não recomendado.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Os atributos ARIA permitem que você especifique as informações da árvore de acessibilidade para este elemento. Veja [Atributos ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) para uma referência completa. No React, todos os nomes de atributos ARIA são exatamente os mesmos que em HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Uma string. Especifica se e como a entrada do usuário deve ser capitalizada.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Uma string. Especifica o nome da classe CSS do elemento. [Leia mais sobre a aplicação de estilos CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Um booleano. Se `true`, o navegador permite que o usuário edite diretamente o elemento renderizado. Isso é usado para implementar bibliotecas de entrada de texto rico como [Lexical.](https://lexical.dev/) O React avisa se você tentar passar filhos React para um elemento com `contentEditable={true}` porque o React não poderá atualizar seu conteúdo após edições do usuário.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Os atributos de dados permitem que você anexe alguns dados em formato de string ao elemento, por exemplo `data-fruit="banana"`. No React, eles não são comumente usados porque normalmente você leria dados de `props` ou `state` em vez disso.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Ou `'ltr'` ou `'rtl'`. Especifica a direção do texto do elemento.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Um booleano. Especifica se o elemento é arrastável. Parte da [API de Arrastar e Soltar do HTML.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Uma string. Especifica qual ação apresentar para a tecla enter em teclados virtuais.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Uma string. Para [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) e [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), permite que você [associe o rótulo com algum controle.](/reference/react-dom/components/input#providing-a-label-for-an-input) Igual ao [`for` atributo HTML.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) O React usa os nomes de propriedades DOM padrão (`htmlFor`) em vez de nomes de atributos HTML.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Um booleano ou uma string. Especifica se o elemento deve ser oculto.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Uma string. Especifica um identificador único para este elemento, que pode ser usado para encontrá-lo mais tarde ou conectá-lo com outros elementos. Gere-o com [`useId`](/reference/react/useId) para evitar colisões entre múltiplas instâncias do mesmo componente.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Uma string. Se especificado, o componente se comportará como um [elemento personalizado.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Uma string. Especifica qual tipo de teclado exibir (por exemplo, texto, número ou telefone).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Uma string. Especifica qual propriedade o elemento representa para crawlers de dados estruturados.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Uma string. Especifica o idioma do elemento.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Uma função de manipulador [`AnimationEvent`](#animationevent-handler). Dispara quando uma animação CSS é completada.
* `onAnimationEndCapture`: Uma versão de `onAnimationEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Uma função de manipulador [`AnimationEvent`](#animationevent-handler). Dispara quando uma iteração de uma animação CSS termina, e outra começa.
* `onAnimationIterationCapture`: Uma versão de `onAnimationIteration` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Uma função de manipulador [`AnimationEvent`](#animationevent-handler). Dispara quando uma animação CSS começa.
* `onAnimationStartCapture`: `onAnimationStart`, mas dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando um botão de ponteiro não primário é clicado.
* `onAuxClickCapture`: Uma versão de `onAuxClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onBeforeInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event): Uma função de manipulador [`InputEvent`](#inputevent-handler). Dispara antes que o valor de um elemento editável seja modificado. O React *não* usa ainda o evento nativo [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) e, em vez disso, tenta fazer um polyfill usando outros eventos.
* `onBeforeInputCapture`: Uma versão de `onBeforeInput` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onBlur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event): Uma função de manipulador [`FocusEvent`](#focusevent-handler). Dispara quando um elemento perde o foco. Ao contrário do evento [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) do navegador, no React o evento `onBlur` propaga.
* `onBlurCapture`: Uma versão de `onBlur` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o botão primário foi clicado no dispositivo de apontar.
* `onClickCapture`: Uma versão de `onClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Uma função de manipulador [`CompositionEvent`](#compositionevent-handler). Dispara quando um [editor de método de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) inicia uma nova sessão de composição.
* `onCompositionStartCapture`: Uma versão de `onCompositionStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Uma função de manipulador [`CompositionEvent`](#compositionevent-handler). Dispara quando um [editor de método de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) completa ou cancela uma sessão de composição.
* `onCompositionEndCapture`: Uma versão de `onCompositionEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Uma função de manipulador [`CompositionEvent`](#compositionevent-handler). Dispara quando um [editor de método de entrada](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) recebe um novo caractere.
* `onCompositionUpdateCapture`: Uma versão de `onCompositionUpdate` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o usuário tenta abrir um menu de contexto.
* `onContextMenuCapture`: Uma versão de `onContextMenu` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Uma função de manipulador [`ClipboardEvent`](#clipboardevent-handler). Dispara quando o usuário tenta copiar algo para a área de transferência.
* `onCopyCapture`: Uma versão de `onCopy` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Uma função de manipulador [`ClipboardEvent`](#clipboardevent-handler). Dispara quando o usuário tenta cortar algo para a área de transferência.
* `onCutCapture`: Uma versão de `onCut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDoubleClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o usuário clica duas vezes. Corresponde ao evento [`dblclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) do navegador.
* `onDoubleClickCapture`: Uma versão de `onDoubleClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara enquanto o usuário está arrastando algo. 
* `onDragCapture`: Uma versão de `onDrag` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara quando o usuário para de arrastar algo. 
* `onDragEndCapture`: Uma versão de `onDragEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara quando o conteúdo arrastado entra em um alvo de soltura válido. 
* `onDragEnterCapture`: Uma versão de `onDragEnter` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara em um alvo de soltura válido enquanto o conteúdo arrastado está sendo arrastado sobre ele. Você deve chamar `e.preventDefault()` aqui para permitir a soltura.
* `onDragOverCapture`: Uma versão de `onDragOver` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara quando o usuário começa a arrastar um elemento.
* `onDragStartCapture`: Uma versão de `onDragStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Uma função de manipulador [`DragEvent`](#dragevent-handler). Dispara quando algo é solto em um alvo de soltura válido.
* `onDropCapture`: Uma versão de `onDrop` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onFocus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event): Uma função de manipulador [`FocusEvent`](#focusevent-handler). Dispara quando um elemento recebe foco. Ao contrário do evento [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) do navegador, no React o evento `onFocus` propaga.
* `onFocusCapture`: Uma versão de `onFocus` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um elemento captura programaticamente um ponteiro.
* `onGotPointerCaptureCapture`: Uma versão de `onGotPointerCapture` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Uma função de manipulador [`KeyboardEvent`](#keyboardevent-handler). Dispara quando uma tecla é pressionada.
* `onKeyDownCapture`: Uma versão de `onKeyDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Uma função de manipulador [`KeyboardEvent`](#keyboardevent-handler). Obsoleto. Use `onKeyDown` ou `onBeforeInput` em vez disso.
* `onKeyPressCapture`: Uma versão de `onKeyPress` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Uma função de manipulador [`KeyboardEvent`](#keyboardevent-handler). Dispara quando uma tecla é liberada.
* `onKeyUpCapture`: Uma versão de `onKeyUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um elemento para de capturar um ponteiro.
* `onLostPointerCaptureCapture`: Uma versão de `onLostPointerCapture` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro é pressionado.
* `onMouseDownCapture`: Uma versão de `onMouseDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro se move para dentro de um elemento. Não tem uma fase de captura. Em vez disso, `onMouseLeave` e `onMouseEnter` propagam do elemento sendo deixado para o que está sendo acessado.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro se move para fora de um elemento. Não tem uma fase de captura. Em vez disso, `onMouseLeave` e `onMouseEnter` propagam do elemento sendo deixado para o que está sendo acessado.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro muda de coordenadas.
* `onMouseMoveCapture`: Uma versão de `onMouseMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro se move para fora de um elemento, ou se ele se move para dentro de um elemento filho.
* `onMouseOutCapture`: Uma versão de `onMouseOut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Uma função de manipulador [`MouseEvent`](#mouseevent-handler). Dispara quando o ponteiro é liberado.
* `onMouseUpCapture`: Uma versão de `onMouseUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando o navegador cancela uma interação de ponteiro.
* `onPointerCancelCapture`: Uma versão de `onPointerCancel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro se torna ativo.
* `onPointerDownCapture`: Uma versão de `onPointerDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro se move para dentro de um elemento. Não tem uma fase de captura. Em vez disso, `onPointerLeave` e `onPointerEnter` propagam do elemento sendo deixado para o que está sendo acessado.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro se move para fora de um elemento. Não tem uma fase de captura. Em vez disso, `onPointerLeave` e `onPointerEnter` propagam do elemento sendo deixado para o que está sendo acessado.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro muda de coordenadas.
* `onPointerMoveCapture`: Uma versão de `onPointerMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro se move para fora de um elemento, se a interação do ponteiro é cancelada, e [algumas outras razões.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Uma versão de `onPointerOut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Uma função de manipulador [`PointerEvent`](#pointerevent-handler). Dispara quando um ponteiro não está mais ativo.
* `onPointerUpCapture`: Uma versão de `onPointerUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Uma função de manipulador [`ClipboardEvent`](#clipboardevent-handler). Dispara quando o usuário tenta colar algo da área de transferência.
* `onPasteCapture`: Uma versão de `onPaste` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando um elemento foi rolado. Este evento não se propaga.
* `onScrollCapture`: Uma versão de `onScroll` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Uma função de manipulador [`Event`](#event-handler). Dispara após a seleção dentro de um elemento editável como um input mudar. O React estende o evento `onSelect` para funcionar também com elementos `contentEditable={true}`. Além disso, o React o estende para disparar para seleção vazia e em edições (que podem afetar a seleção).
* `onSelectCapture`: Uma versão de `onSelect` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Uma função de manipulador [`TouchEvent`](#touchevent-handler). Dispara quando o navegador cancela uma interação de toque.
* `onTouchCancelCapture`: Uma versão de `onTouchCancel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Uma função de manipulador [`TouchEvent`](#touchevent-handler). Dispara quando um ou mais pontos de toque são removidos.
* `onTouchEndCapture`: Uma versão de `onTouchEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Uma função de manipulador [`TouchEvent`](#touchevent-handler). Dispara quando um ou mais pontos de toque são movidos.
* `onTouchMoveCapture`: Uma versão de `onTouchMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Uma função de manipulador [`TouchEvent`](#touchevent-handler). Dispara quando um ou mais pontos de toque são colocados.
* `onTouchStartCapture`: Uma versão de `onTouchStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Uma função de manipulador [`TransitionEvent`](#transitionevent-handler). Dispara quando uma transição CSS completa.
* `onTransitionEndCapture`: Uma versão de `onTransitionEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Uma função de manipulador [`WheelEvent`](#wheelevent-handler). Dispara quando o usuário gira um botão de roda.
* `onWheelCapture`: Uma versão de `onWheel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Uma string. Especifica o papel do elemento explicitamente para tecnologias assistivas.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Uma string. Especifica o nome do slot ao usar shadow DOM. No React, um padrão equivalente é tipicamente alcançado passando JSX como `props`, por exemplo `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Um booleano ou nulo. Se definido explicitamente como `true` ou `false`, habilita ou desabilita a verificação ortográfica.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Um número. Sobrescreve o comportamento padrão do botão Tab. [Evite usar valores diferentes de `-1` e `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Uma string. Especifica o texto da tooltip para o elemento.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Pode ser `'yes'` ou `'no'`. Passar `'no'` exclui o conteúdo do elemento de ser traduzido.

Você também pode passar atributos personalizados como `props`, por exemplo `mycustomprop="someValue"`. Isso pode ser útil ao integrar com bibliotecas de terceiros. O nome do atributo personalizado deve estar em minúsculas e não deve começar com `on`. O valor será convertido em uma string. Se você passar `null` ou `undefined`, o atributo personalizado será removido.

Esses eventos disparam apenas para os elementos [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando um formulário é redefinido.
* `onResetCapture`: Uma versão de `onReset` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando um formulário é enviado.
* `onSubmitCapture`: Uma versão de `onSubmit` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)

Esses eventos disparam apenas para os elementos [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Ao contrário dos eventos do navegador, eles propagam no React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o usuário tenta dispensar o diálogo.
* `onCancelCapture`: Uma versão de `onCancel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando um diálogo foi fechado.
* `onCloseCapture`: Uma versão de `onClose` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)

Esses eventos disparam apenas para os elementos [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). Ao contrário dos eventos do navegador, eles propagam no React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o usuário alterna os detalhes.
* `onToggleCapture`: Uma versão de `onToggle` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)

Esses eventos disparam para [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), e elementos SVG `<image>` (https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). Ao contrário dos eventos do navegador, eles propagam no React:

* `onLoad`: Uma função de manipulador [`Event`](#event-handler). Dispara quando o recurso foi carregado.
* `onLoadCapture`: Uma versão de `onLoad` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o recurso não pôde ser carregado.
* `onErrorCapture`: Uma versão de `onError` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)

Esses eventos disparam para recursos como [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) e [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Ao contrário dos eventos do navegador, eles propagam no React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o recurso não foi totalmente carregado, mas não devido a um erro.
* `onAbortCapture`: Uma versão de `onAbort` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando há dados suficientes para começar a reprodução, mas não o suficiente para reproduzir até o final sem buffering.
* `onCanPlayCapture`: Uma versão de `onCanPlay` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando há dados suficientes que é provável que seja possível começar a reprodução sem buffering até o final.
* `onCanPlayThroughCapture`: Uma versão de `onCanPlayThrough` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a duração da mídia foi atualizada.
* `onDurationChangeCapture`: Uma versão de `onDurationChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a mídia se torna vazia.
* `onEmptiedCapture`: Uma versão de `onEmptied` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Uma função de manipulador [`Event`](#event-handler). Dispara quando o navegador encontra mídia criptografada.
* `onEncryptedCapture`: Uma versão de `onEncrypted` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a reprodução para porque não há mais nada para tocar.
* `onEndedCapture`: Uma versão de `onEnded` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o recurso não pôde ser carregado.
* `onErrorCapture`: Uma versão de `onError` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o quadro de reprodução atual foi carregado.
* `onLoadedDataCapture`: Uma versão de `onLoadedData` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando os metadados foram carregados.
* `onLoadedMetadataCapture`: Uma versão de `onLoadedMetadata` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o navegador começou a carregar o recurso.
* `onLoadStartCapture`: Uma versão de `onLoadStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a mídia foi pausada.
* `onPauseCapture`: Uma versão de `onPause` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a mídia não está mais pausada.
* `onPlayCapture`: Uma versão de `onPlay` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a mídia começa ou reinicia a reprodução.
* `onPlayingCapture`: Uma versão de `onPlaying` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Uma função de manipulador [`Event`](#event-handler). Dispara periodicamente enquanto o recurso está carregando.
* `onProgressCapture`: Uma versão de `onProgress` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a taxa de reprodução muda.
* `onRateChangeCapture`: Uma versão de `onRateChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onResize`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/resize_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o vídeo muda de tamanho.
* `onResizeCapture`: Uma versão de `onResize` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando uma operação de busca é completada.
* `onSeekedCapture`: Uma versão de `onSeeked` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando uma operação de busca começa.
* `onSeekingCapture`: Uma versão de `onSeeking` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o navegador está esperando por dados, mas eles continuam não carregando.
* `onStalledCapture`: Uma versão de `onStalled` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o carregamento do recurso foi suspenso.
* `onSuspendCapture`: Uma versão de `onSuspend` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o tempo de reprodução atual é atualizado.
* `onTimeUpdateCapture`: Uma versão de `onTimeUpdate` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando o volume muda.
* `onVolumeChangeCapture`: Uma versão de `onVolumeChange` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Uma função de manipulador [`Event`](#event-handler). Dispara quando a reprodução é interrompida devido à falta temporária de dados.
* `onWaitingCapture`: Uma versão de `onWaiting` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)

#### Ressalvas {/*common-caveats*/}

- Você não pode passar `children` e `dangerouslySetInnerHTML` ao mesmo tempo.
- Alguns eventos (como `onAbort` e `onLoad`) não se propagam no navegador, mas se propagam no React.

---

### Função de callback `ref` {/*ref-callback*/}

Em vez de um objeto ref (como o retornado por [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), você pode passar uma função para o atributo `ref`.

```js
<div ref={(node) => console.log(node)} />
```

[Veja um exemplo de uso da callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Quando o nó DOM `<div>` é adicionado à tela, o React chamará sua callback `ref` com o `node` DOM como argumento. Quando aquele nó DOM `<div>` é removido, o React chamará sua callback `ref` com `null`.

O React também chamará sua callback `ref` sempre que você passar uma *callback* `ref` *diferente*. No exemplo acima, `(node) => { ... }` é uma função diferente em cada renderização. Quando seu componente re-renderiza, a *anterior* função será chamada com `null` como argumento, e a *próxima* função será chamada com o nó DOM.

#### Parâmetros {/*ref-callback-parameters*/}

* `node`: Um nó DOM ou `null`. O React lhe passará o nó DOM quando a ref for anexada, e `null` quando a ref for destacada. A menos que você passe a mesma referência de função para a callback `ref` em cada renderização, a callback será temporariamente destacada e reanexada durante cada re-renderização do componente.

<Canary>

#### Retorna {/*returns*/}

*  **opcional** `função de limpeza`: Quando a `ref` é destacada, o React chamará a função de limpeza. Se uma função não for retornada pela callback `ref`, o React chamará a callback novamente com `null` como argumento quando a `ref` for destacada.

```js

<div ref={(node) => {
  console.log(node);

  return () => {
    console.log('Limpeza', node)
  }
}}>

```

#### Ressalvas {/*caveats*/}

* Quando o Modo Estrito está ativado, o React **executará um ciclo extra de configuração+limpeza somente para desenvolvimento** antes da primeira configuração real. Este é um teste de estresse que garante que sua lógica de limpeza "reflete" sua lógica de configuração e que ela para ou reverte o que a configuração está fazendo. Se isso causar um problema, implemente a função de limpeza.
* Quando você passar uma *callback* `ref` *diferente*, o React chamará a função de limpeza da *callback* anterior, se fornecida. Se nenhuma função de limpeza for definida, a callback `ref` será chamada com `null` como argumento. A *próxima* função será chamada com o nó DOM.

</Canary>

---

### Objeto de evento do React {/*react-event-object*/}

Seus manipuladores de eventos receberão um *objeto de evento do React*. Às vezes, ele também é conhecido como um "evento sintético".

```js
<button onClick={e => {
  console.log(e); // Objeto de evento do React
}} />
```

Ele se conforma ao mesmo padrão que os eventos DOM subjacentes, mas corrige algumas inconsistências dos navegadores.

Alguns eventos do React não se mapeiam diretamente para os eventos nativos do navegador. Por exemplo, em `onMouseLeave`, `e.nativeEvent` apontará para um evento `mouseout`. O mapeamento específico não faz parte da API pública e pode mudar no futuro. Se você precisar do evento do navegador subjacente por algum motivo, leia a partir de `e.nativeEvent`.

#### Propriedades {/*react-event-object-properties*/}

Os objetos de evento do React implementam algumas das propriedades padrão do [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Um booleano. Retorna se o evento borbulha através do DOM. 
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Um booleano. Retorna se o evento pode ser cancelado.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Um nó DOM. Retorna o nó ao qual o manipulador atual está anexado na árvore React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Um booleano. Retorna se `preventDefault` foi chamado.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Um número. Retorna em qual fase o evento está atualmente.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Um booleano. Retorna se o evento foi iniciado pelo usuário.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Um nó DOM. Retorna o nó no qual o evento ocorreu (que pode ser um filho distante).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Um número. Retorna o tempo em que o evento ocorreu.

Além disso, os objetos de evento do React fornecem essas propriedades:

* `nativeEvent`: Um [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) DOM. O objeto original do evento do navegador.

#### Métodos {/*react-event-object-methods*/}

Os objetos de evento do React implementam alguns dos métodos padrão do [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Impede a ação padrão do navegador para o evento.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Interrompe a propagação do evento através da árvore React.

Além disso, os objetos de evento do React fornecem esses métodos:

* `isDefaultPrevented()`: Retorna um valor booleano indicando se `preventDefault` foi chamado.
* `isPropagationStopped()`: Retorna um valor booleano indicando se `stopPropagation` foi chamado.
* `persist()`: Não usado com React DOM. Com React Native, chame isso para ler as propriedades do evento após o evento.
* `isPersistent()`: Não usado com React DOM. Com React Native, retorna se `persist` foi chamado.

#### Ressalvas {/*react-event-object-caveats*/}

* Os valores de `currentTarget`, `eventPhase`, `target`, e `type` refletem os valores que seu código React espera. Nos bastidores, o React anexa manipuladores de eventos na raiz, mas isso não é refletido nos objetos de evento do React. Por exemplo, `e.currentTarget` pode não ser o mesmo que o `e.nativeEvent.currentTarget` subjacente. Para eventos polyfilled, `e.type` (tipo de evento React) pode diferir de `e.nativeEvent.type` (tipo subjacente).

---

### Função de manipulador de evento `AnimationEvent` {/*animationevent-handler*/}

Um tipo de manipulador de eventos para os [eventos de animação CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parâmetros {/*animationevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Função de manipulador de evento `ClipboardEvent` {/*clipboadevent-handler*/}

Um tipo de manipulador de eventos para os eventos da [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parâmetros {/*clipboadevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Função de manipulador de evento `CompositionEvent` {/*compositionevent-handler*/}

Um tipo de manipulador de eventos para os eventos de [editor de método de entrada (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parâmetros {/*compositionevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Função de manipulador de evento `DragEvent` {/*dragevent-handler*/}

Um tipo de manipulador de eventos para os eventos da [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Fonte de arrasto
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Alvo de soltura
  </div>
</>
```

#### Parâmetros {/*dragevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Também inclui as propriedades herdadas do [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `FocusEvent` {/*focusevent-handler*/}

Um tipo de manipulador de eventos para os eventos de foco.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Veja um exemplo.](#handling-focus-events)

#### Parâmetros {/*focusevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `Event` {/*event-handler*/}

Um tipo de manipulador para eventos genéricos.

#### Parâmetros {/*event-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) sem propriedades adicionais.

---

### Função de manipulador de evento `InputEvent` {/*inputevent-handler*/}

Um tipo de manipulador de eventos para o evento `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parâmetros {/*inputevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Função de manipulador de evento `KeyboardEvent` {/*keyboardevent-handler*/}

Um tipo de manipulador de eventos para eventos de teclado.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Veja um exemplo.](#handling-keyboard-events)

#### Parâmetros {/*keyboardevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `MouseEvent` {/*mouseevent-handler*/}

Um tipo de manipulador de eventos para eventos de mouse.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Veja um exemplo.](#handling-mouse-events)

#### Parâmetros {/*mouseevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `PointerEvent` {/*pointerevent-handler*/}

Um tipo de manipulador de eventos para [eventos de ponteiro.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Veja um exemplo.](#handling-pointer-events)

#### Parâmetros {/*pointerevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Também inclui as propriedades herdadas do [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `TouchEvent` {/*touchevent-handler*/}

Um tipo de manipulador de eventos para [eventos de toque.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parâmetros {/*touchevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `TransitionEvent` {/*transitionevent-handler*/}

Um tipo de manipulador de eventos para os eventos de transição CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parâmetros {/*transitionevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Função de manipulador de evento `UIEvent` {/*uievent-handler*/}

Um tipo de manipulador de eventos para eventos genéricos de UI.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parâmetros {/*uievent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função de manipulador de evento `WheelEvent` {/*wheelevent-handler*/}

Um tipo de manipulador de eventos para o evento `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parâmetros {/*wheelevent-handler-parameters*/}

* `e`: Um [objeto de evento do React](#react-event-object) com essas propriedades extras do [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Também inclui as propriedades herdadas do [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)

  Também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Uso {/*usage*/}

### Aplicando estilos CSS {/*applying-css-styles*/}

No React, você especifica uma classe CSS com [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) Funciona como o atributo `class` em HTML:

```js
<img className="avatar" />
```

Então, você escreve as regras CSS para isso em um arquivo CSS separado:

```css
/* No seu CSS */
.avatar {
  border-radius: 50%;
}
```

O React não prescreve como você deve adicionar arquivos CSS. No caso mais simples, você adicionará uma tag [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ao seu HTML. Se você usar uma ferramenta de build ou um framework, consulte sua documentação para aprender como adicionar um arquivo CSS ao seu projeto.

Às vezes, os valores de estilo dependem de dados. Use o atributo `style` para passar alguns estilos dinamicamente:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


No exemplo acima, `style={{}}` não é uma sintaxe especial, mas um objeto regular `{}` dentro das chaves `style={ }` [JSX.](/learn/javascript-in-jsx-with-curly-braces) Recomend