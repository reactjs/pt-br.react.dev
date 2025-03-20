---
title: "Componentes comuns (por exemplo, <div>)"
---

<Intro>

Todos os componentes nativos do navegador, como [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), suportam algumas props e eventos comuns.

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

Estas props especiais do React são suportadas para todos os componentes nativos:

*   `children`: Um nó React (um elemento, uma string, um número, [um portal,](/reference/react-dom/createPortal) um nó vazio como `null`, `undefined` e booleanos, ou um array de outros nós React). Especifica o conteúdo dentro do componente. Quando você usa JSX, você geralmente especificará a prop `children` implicitamente ao aninhar tags como `<div><span /></div>`.

*   `dangerouslySetInnerHTML`: Um objeto do formulário `{ __html: '<p>some html</p>' } ` com uma string HTML bruta dentro. Substitui a propriedade [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) do nó DOM e exibe o HTML passado dentro. Isso deve ser usado com extrema cautela! Se o HTML dentro não for confiável (por exemplo, se for baseado em dados do usuário), você corre o risco de introduzir uma vulnerabilidade [XSS](https://pt.wikipedia.org/wiki/Cross-site_scripting). [Leia mais sobre o uso de `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

*   `ref`: Um objeto ref de [`useRef`](/reference/react/useRef) ou [`createRef`](/reference/react/createRef), ou uma [`ref` função callback,](#ref-callback) ou uma string para [refs legados.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Seu ref será preenchido com o elemento DOM para este nó. [Leia mais sobre como manipular o DOM com refs.](#manipulating-a-dom-node-with-a-ref)

*   `suppressContentEditableWarning`: Um booleano. Se `true`, suprime o aviso que o React mostra para elementos que têm `children` e `contentEditable={true}` (que normalmente não funcionam juntos). Use isso se você estiver construindo uma biblioteca de entrada de texto que gerencia o conteúdo `contentEditable` manualmente.

*   `suppressHydrationWarning`: Um booleano. Se você usar [renderização no servidor,](/reference/react-dom/server) normalmente há um aviso quando o servidor e o cliente renderizam conteúdo diferente. Em alguns casos raros (como timestamps), é muito difícil ou impossível garantir uma correspondência exata. Se você definir `suppressHydrationWarning` como `true`, o React não o avisará sobre incompatibilidades nos atributos e no conteúdo desse elemento. Ele só funciona em um nível de profundidade e é projetado para ser usado como uma porta de saída. Não use em excesso. [Leia sobre como suprimir erros de hidratação.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

*   `style`: Um objeto com estilos CSS, por exemplo, `{ fontWeight: 'bold', margin: 20 }`. Semelhante à propriedade [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style), os nomes das propriedades CSS precisam ser escritos como `camelCase`, por exemplo, `fontWeight` em vez de `font-weight`. Você pode passar strings ou números como valores. Se você passar um número, como `width: 100`, o React anexará automaticamente `px` ("pixels") ao valor, a menos que seja uma [propriedade sem unidade.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Recomendamos que você use `style` apenas para estilos dinâmicos nos quais você não conhece os valores do estilo com antecedência. Em outros casos, aplicar classes CSS simples com `className` é mais eficiente. [Leia mais sobre `className` e `style`.](#applying-css-styles)

Essas props DOM padrão também são suportadas para todos os componentes nativos:*   [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Uma string. Especifica um atalho de teclado para o elemento. [Geralmente não recomendado.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
*   [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Atributos ARIA permitem que você especifique as informações da árvore de acessibilidade para este elemento. Veja [Atributos ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) para uma referência completa. Em React, todos os nomes de atributos ARIA são exatamente os mesmos no HTML.
*   [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Uma string. Especifica se e como a entrada do usuário deve ser capitalizada.
*   [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Uma string.  Especifica o nome da classe CSS do elemento. [Leia mais sobre como aplicar estilos CSS.](#applying-css-styles)
*   [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Um booleano. Se `true`, o navegador permite que o usuário edite o elemento renderizado diretamente. Ele é usado para implementar bibliotecas de entrada de texto avançadas como [Lexical.](https://lexical.dev/) React avisa se você tentar passar os filhos React para um elemento com `contentEditable={true}` porque o React não poderá atualizar o conteúdo depois das edições do usuário.
*   [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Atributos de dados permitem que você anexe alguns dados de string ao elemento, por exemplo, `data-fruit="banana"`. Em React, eles não são comumente usados porque você geralmente leria dados de props ou state em vez disso.
*   [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir):  `'ltr'` ou `'rtl'`. Especifica a direção do texto do elemento.
*   [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Um booleano. Especifica se o elemento é arrastável. Parte da [API HTML Drag and Drop.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
*   [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Uma string. Especifica qual ação apresentar para a tecla Enter em teclados virtuais.
*   [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Uma string. Para [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) e [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), permite que você [associe o rótulo com algum controle.](/reference/react-dom/components/input#providing-a-label-for-an-input) Mesma coisa que o atributo HTML [`for`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React usa os nomes de propriedade DOM padrão (`htmlFor`) em vez de nomes de atributo HTML.
*   [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Um booleano ou uma string. Especifica se o elemento deve ser ocultado.
*   [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Uma string. Especifica um identificador exclusivo para este elemento, que pode ser usado para encontrá-lo mais tarde ou conectá-lo com outros elementos. Gere-o com [`useId`](/reference/react/useId) para evitar conflitos entre várias instâncias do mesmo componente.
*   [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Uma string. Se especificado, o componente se comportará como um [elemento personalizado.](/reference/react-dom/components#custom-html-elements)
*   [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Uma string. Especifica que tipo de teclado exibir (por exemplo, texto, número ou telefone).
*   [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Uma string. Especifica qual propriedade o elemento representa para rastreadores de dados estruturados.
*   [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Uma string. Especifica o idioma do elemento.
*   [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Uma função de [`AnimationEvent` handler](#animationevent-handler). Dispara quando uma animação CSS é concluída.
*   `onAnimationEndCapture`: Uma versão de `onAnimationEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Uma função de [`AnimationEvent` handler](#animationevent-handler). Dispara quando uma iteração de uma animação CSS termina, e outra começa.
*   `onAnimationIterationCapture`: Uma versão de `onAnimationIteration` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Uma função de [`AnimationEvent` handler](#animationevent-handler). Dispara quando uma animação CSS começa.
*   `onAnimationStartCapture`: `onAnimationStart`, mas dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando um botão de ponteiro não primário foi clicado.
*   `onAuxClickCapture`: Uma versão de `onAuxClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   `onBeforeInput`: Uma função de [`InputEvent` handler](#inputevent-handler). Dispara antes que o valor de um elemento editável seja modificado. React *não* usa ainda o evento nativo [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event), e em vez disso tenta polyfill usando outros eventos.
*   `onBeforeInputCapture`: Uma versão de `onBeforeInput` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   `onBlur`: Uma função de [`FocusEvent` handler](#focusevent-handler). Dispara quando um elemento perde o foco. Diferente do evento [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) embutido no navegador, em React o evento `onBlur` propaga.
*   `onBlurCapture`: Uma versão de `onBlur` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o botão primário foi clicado no dispositivo apontador.
*   `onClickCapture`: Uma versão de `onClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Uma função de [`CompositionEvent` handler](#compositionevent-handler). Dispara quando um [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) inicia uma nova sessão de composição.
*   `onCompositionStartCapture`: Uma versão de `onCompositionStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Uma função de [`CompositionEvent` handler](#compositionevent-handler). Dispara quando um [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) conclui ou cancela uma sessão de composição.
*   `onCompositionEndCapture`: Uma versão de `onCompositionEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Uma função de [`CompositionEvent` handler](#compositionevent-handler). Dispara quando um [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) recebe um novo caractere.
*   `onCompositionUpdateCapture`: Uma versão de `onCompositionUpdate` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o usuário tenta abrir um menu de contexto.
*   `onContextMenuCapture`: Uma versão de `onContextMenu` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Uma função de [`ClipboardEvent` handler](#clipboardevent-handler). Dispara quando o usuário tenta copiar algo na área de transferência.
*   `onCopyCapture`: Uma versão de `onCopy` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Uma função de [`ClipboardEvent` handler](#clipboardevent-handler). Dispara quando o usuário tenta cortar algo na área de transferência.
*   `onCutCapture`: Uma versão de `onCut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   `onDoubleClick`: Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o usuário clica duas vezes. Corresponde ao evento [`dblclick` do navegador.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
*   `onDoubleClickCapture`: Uma versão de `onDoubleClick` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara enquanto o usuário está arrastando algo.
*   `onDragCapture`: Uma versão de `onDrag` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara quando o usuário para de arrastar algo.
*   `onDragEndCapture`: Uma versão de `onDragEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara quando o conteúdo arrastado entra em um destino válido.
*   `onDragEnterCapture`: Uma versão de `onDragEnter` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara em um destino válido enquanto o conteúdo arrastado é arrastado sobre ele. Você deve chamar `e.preventDefault()` aqui para permitir soltar.
*   `onDragOverCapture`: Uma versão de `onDragOver` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara quando o usuário começa a arrastar um elemento.
*   `onDragStartCapture`: Uma versão de `onDragStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Uma função de [`DragEvent` handler](#dragevent-handler). Dispara quando algo é solto em um destino válido.
*   `onDropCapture`: Uma versão de `onDrop` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   `onFocus`: Uma função de [`FocusEvent` handler](#focusevent-handler). Dispara quando um elemento recebe foco. Diferente do evento [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) embutido no navegador, em React o evento `onFocus` propaga.
*   `onFocusCapture`: Uma versão de `onFocus` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um elemento captura programaticamente um ponteiro.
*   `onGotPointerCaptureCapture`: Uma versão de `onGotPointerCapture` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Uma função de [`KeyboardEvent` handler](#keyboardevent-handler). Dispara quando uma tecla é pressionada.
*   `onKeyDownCapture`: Uma versão de `onKeyDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Uma função de [`KeyboardEvent` handler](#keyboardevent-handler). Obsoleto. Use `onKeyDown` ou `onBeforeInput` em vez disso.
*   `onKeyPressCapture`: Uma versão de `onKeyPress` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Uma função de [`KeyboardEvent` handler](#keyboardevent-handler). Dispara quando uma tecla é solta.
*   `onKeyUpCapture`: Uma versão de `onKeyUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um elemento para de capturar um ponteiro.
*   `onLostPointerCaptureCapture`: Uma versão de `onLostPointerCapture` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro é pressionado.
*   `onMouseDownCapture`: Uma versão de `onMouseDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro se move para dentro de um elemento. Não possui uma fase de captura. Em vez disso, `onMouseLeave` e `onMouseEnter` propagam do elemento que está saindo para aquele que está entrando.
*   [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro se move para fora de um elemento. Não possui uma fase de captura. Em vez disso, `onMouseLeave` e `onMouseEnter` propagam do elemento que está saindo para aquele que está entrando.
*   [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro muda de coordenadas.
*   `onMouseMoveCapture`: Uma versão de `onMouseMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro se move para fora de um elemento, ou se ele se move para um elemento filho.
*   `onMouseOutCapture`: Uma versão de `onMouseOut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Uma função de [`MouseEvent` handler](#mouseevent-handler). Dispara quando o ponteiro é solto.
*   `onMouseUpCapture`: Uma versão de `onMouseUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando o navegador cancela uma interação de ponteiro.
*   `onPointerCancelCapture`: Uma versão de `onPointerCancel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro se torna ativo.
*   `onPointerDownCapture`: Uma versão de `onPointerDown` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro se move para dentro de um elemento. Não possui uma fase de captura. Em vez disso, `onPointerLeave` e `onPointerEnter` propagam do elemento que está saindo para aquele que está entrando.
*   [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro se move para fora de um elemento. Não possui uma fase de captura. Em vez disso, `onPointerLeave` e `onPointerEnter` propagam do elemento que está saindo para aquele que está entrando.
*   [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro muda de coordenadas.
*   `onPointerMoveCapture`: Uma versão de `onPointerMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro se move para fora de um elemento, se a interação do ponteiro for cancelada e [alguns outros motivos.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
*   `onPointerOutCapture`: Uma versão de `onPointerOut` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Uma função de [`PointerEvent` handler](#pointerevent-handler). Dispara quando um ponteiro não está mais ativo.
*   `onPointerUpCapture`: Uma versão de `onPointerUp` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Uma função de [`ClipboardEvent` handler](#clipboardevent-handler). Dispara quando o usuário tenta colar algo da área de transferência.
*   `onPasteCapture`: Uma versão de `onPaste` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Uma função de [`Event` handler](#event-handler). Dispara quando um elemento foi rolado. Este evento não propaga.
*   `onScrollCapture`: Uma versão de `onScroll` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Uma função de [`Event` handler](#event-handler). Dispara após a seleção dentro de um elemento editável, como uma alteração de entrada. React estende o evento `onSelect` para funcionar também para elementos com `contentEditable={true}`. Além disso, React o estende para disparar para seleção vazia e em edições (o que pode afetar a seleção).
*   `onSelectCapture`: Uma versão de `onSelect` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Uma função de [`TouchEvent` handler](#touchevent-handler). Dispara quando o navegador cancela uma interação touch.
*   `onTouchCancelCapture`: Uma versão de `onTouchCancel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Uma função de [`TouchEvent` handler](#touchevent-handler). Dispara quando um ou mais pontos de toque são removidos.
*   `onTouchEndCapture`: Uma versão de `onTouchEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Uma função de [`TouchEvent` handler](#touchevent-handler). Dispara quando um ou mais pontos de toque são movidos.
*   `onTouchMoveCapture`: Uma versão de `onTouchMove` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Uma função de [`TouchEvent` handler](#touchevent-handler). Dispara quando um ou mais pontos de toque são colocados.
*   `onTouchStartCapture`: Uma versão de `onTouchStart` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Uma função de [`TransitionEvent` handler](#transitionevent-handler). Dispara quando uma transição CSS é concluída.
*   `onTransitionEndCapture`: Uma versão de `onTransitionEnd` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Uma função de [`WheelEvent` handler](#wheelevent-handler). Dispara quando o usuário gira um botão da roda.
*   `onWheelCapture`: Uma versão de `onWheel` que dispara na [fase de captura.](/learn/responding-to-events#capture-phase-events)
*   [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Uma string. Especifica a função do elemento explicitamente para tecnologias assistivas.
*   [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Uma string. Especifica o nome do slot ao usar shadow DOM. Em React, um padrão equivalente é normalmente alcançado passando JSX como props, por exemplo, `<Layout left={<Sidebar />} right={<Content />} />`.
*   [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Um booleano ou nulo. Se definido explicitamente como `true` ou `false`, habilita ou desabilita a verificação ortográfica.
*   [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Um número. Substitui o comportamento padrão do botão Tab. [Evite usar valores diferentes de `-1` e `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
*   [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Uma string. Especifica o texto da dica de ferramenta para o elemento.
*   [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` ou `'no'`. Passar `'no'` exclui o conteúdo do elemento de ser traduzido.
Você também pode passar atributos customizados como props, por exemplo `mycustomprop = "someValue"`. Isso pode ser útil ao integrar com bibliotecas de terceiros. O nome do atributo customizado deve estar em caixa baixa e não deve começar com `on`. O valor será convertido em uma string. Se você passar `null` ou `undefined`, o atributo customizado será removido.

Esses eventos disparam apenas para os elementos [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

*   [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando um formulário é resetado.
*   `onResetCapture`: Uma versão do `onReset` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando um formulário é submetido.
*   `onSubmitCapture`: Uma versão do `onSubmit` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).

Esses eventos disparam apenas para os elementos [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Diferente dos eventos do navegador, eles propagam no React:

*   [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o usuário tenta descartar o diálogo.
*   `onCancelCapture`: Uma versão do `onCancel` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando um diálogo foi fechado.
*   `onCloseCapture`: Uma versão do `onClose` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).

Esses eventos disparam apenas para os elementos [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). Diferente dos eventos do navegador, eles propagam no React:

*   [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o usuário alterna os detalhes.
*   `onToggleCapture`: Uma versão do `onToggle` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).

Esses eventos disparam para elementos [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) e [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). Diferente dos eventos do navegador, eles propagam no React:

*   `onLoad`: Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o recurso foi carregado.
*   `onLoadCapture`: Uma versão do `onLoad` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o recurso não pôde ser carregado.
*   `onErrorCapture`: Uma versão do `onError` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).

Esses eventos disparam para recursos como [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) e [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Diferente dos eventos do navegador, eles propagam no React:

*   [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o recurso não foi totalmente carregado, mas não devido a um erro.
*   `onAbortCapture`: Uma versão do `onAbort` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando há dados suficientes para começar a reproduzir, mas não o suficiente para reproduzir até o fim sem buffering.
*   `onCanPlayCapture`: Uma versão do `onCanPlay` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando há dados suficientes que é provável que seja possível começar a reproduzir sem buffering até o fim.
*   `onCanPlayThroughCapture`: Uma versão do `onCanPlayThrough` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a duração da mídia foi atualizada.
*   `onDurationChangeCapture`: Uma versão do `onDurationChange` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a mídia se tornou vazia.
*   `onEmptiedCapture`: Uma versão do `onEmptied` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o navegador encontra mídia criptografada.
*   `onEncryptedCapture`: Uma versão do `onEncrypted` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a reprodução para porque não há mais nada para reproduzir.
*   `onEndedCapture`: Uma versão do `onEnded` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o recurso não pôde ser carregado.
*   `onErrorCapture`: Uma versão do `onError` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o frame de reprodução atual foi carregado.
*   `onLoadedDataCapture`: Uma versão do `onLoadedData` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando os metadados foram carregados.
*   `onLoadedMetadataCapture`: Uma versão do `onLoadedMetadata` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o navegador começou a carregar o recurso.
*   `onLoadStartCapture`: Uma versão do `onLoadStart` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a mídia foi pausada.
*   `onPauseCapture`: Uma versão do `onPause` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a mídia não está mais pausada.
*   `onPlayCapture`: Uma versão do `onPlay` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a mídia começa ou reinicia a reprodução.
*   `onPlayingCapture`: Uma versão do `onPlaying` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara periodicamente enquanto o recurso está carregando.
*   `onProgressCapture`: Uma versão do `onProgress` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a taxa de reprodução muda.
*   `onRateChangeCapture`: Uma versão do `onRateChange` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   `onResize`: Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o vídeo muda de tamanho.
*   `onResizeCapture`: Uma versão do `onResize` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando uma operação de busca é concluída.
*   `onSeekedCapture`: Uma versão do `onSeeked` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando uma operação de busca começa.
*   `onSeekingCapture`: Uma versão do `onSeeking` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o navegador está esperando por dados, mas continua sem carregar.
*   `onStalledCapture`: Uma versão do `onStalled` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o carregamento do recurso foi suspenso.
*   `onSuspendCapture`: Uma versão do `onSuspend` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o tempo de reprodução atual é atualizado.
*   `onTimeUpdateCapture`: Uma versão do `onTimeUpdate` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando o volume foi alterado.
*   `onVolumeChangeCapture`: Uma versão do `onVolumeChange` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).
*   [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Uma função [`manipulador de eventos (event handler)`](#event-handler). Dispara quando a reprodução parou devido à falta temporária de dados.
*   `onWaitingCapture`: Uma versão do `onWaiting` que dispara na [fase de captura](/learn/responding-to-events#capture-phase-events).

#### Ressalvas {/*common-caveats*/}

*   Você não pode passar `children` e `dangerouslySetInnerHTML` ao mesmo tempo.
*   Alguns eventos (como `onAbort` e `onLoad`) não propagam no navegador, mas propagam no React.

---

### Função de callback `ref` {/*ref-callback*/}```
### Em vez de um objeto ref (como o que é retornado por [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), você pode passar uma função para o atributo `ref`.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[Veja um exemplo de como usar o callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Quando o nó DOM `<div>` é adicionado à tela, React chamará seu callback `ref` com o `node` DOM como argumento. Quando esse nó DOM `<div>` for removido, React chamará sua função de limpeza retornada do callback.

React também chamará seu callback `ref` sempre que você passar um callback `ref` *diferente*. No exemplo acima, `(node) => { ... }` é uma função diferente a cada renderização. Quando seu componente renderizar novamente, a função *anterior* será chamada com `null` como argumento, e a função *seguinte* será chamada com o nó DOM.

#### Parâmetros {/*ref-callback-parameters*/}

*   `node`: Um nó DOM. React passará o nó DOM quando a ref for anexada. A menos que você passe a mesma referência de função para o callback `ref` em cada renderização, o callback será temporariamente limpo e recriado durante cada nova renderização do componente.

<Note>

#### O React 19 adicionou funções de limpeza para callbacks `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Para dar suporte à compatibilidade com versões anteriores, se uma função de limpeza não for retornada do callback `ref`, `node` será chamada com `null` quando a `ref` for desanexada. Esse comportamento será removido em uma versão futura.

</Note>

#### Retorna {/*returns*/}

*   **opcional** `função de limpeza`: Quando a `ref` é desanexada, React chamará a função de limpeza. Se uma função não for retornada pelo callback `ref`, React chamará o  callback novamente com `null` como argumento quando a `ref` for desanexada. Esse comportamento será removido em uma versão futura.

#### Ressalvas {/*caveats*/}

*   Quando o Modo Strict está ativado, React irá **executar um ciclo extra de configuração + limpeza apenas para desenvolvimento** antes da primeira configuração real. Este é um teste de estresse que garante que sua lógica de limpeza "espelhe" sua lógica de configuração e que ele pare ou desfaça o que a configuração está fazendo.  Se isso causar um problema, implemente a função de limpeza.
*   Quando você passa um callback `ref` *diferente*, React chamará a função de limpeza do callback *anterior*, se fornecida.  Se nenhuma função de limpeza for definida, o callback `ref` será chamado com `null` como argumento. A função *seguinte* será chamada com o nó DOM.

---

### Objeto de evento React {/*react-event-object*/}

Seus manipuladores de eventos receberão um *objeto de evento React.* Ele também é às vezes conhecido como um "evento sintético".

```js
<button onClick={e => {
  console.log(e); // Objeto de evento React
}} />
```

Ele está em conformidade com o mesmo padrão dos eventos DOM subjacentes, mas corrige algumas inconsistências do navegador.

Alguns eventos React não se mapeiam diretamente para os eventos nativos do navegador. Por exemplo, em `onMouseLeave`, `e.nativeEvent` apontará para um evento `mouseout`. O mapeamento específico não faz parte da API pública e pode mudar no futuro. Se você precisar do evento do navegador subjacente por algum motivo, leia-o de `e.nativeEvent`.

#### Propriedades {/*react-event-object-properties*/}

Os objetos de evento React implementam algumas das propriedades [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) padrão:

*   [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Um booleano. Retorna se o evento se propaga pelo DOM.
*   [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Um booleano. Retorna se o evento pode ser cancelado.
*   [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Um nó DOM. Retorna o nó ao qual o manipulador atual está anexado na árvore React.
*   [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Um booleano. Retorna se `preventDefault` foi chamado.
*   [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Um número. Retorna em qual fase o evento está no momento.
*   [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Um booleano. Retorna se o evento foi iniciado pelo usuário.
*   [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Um nó DOM. Retorna o nó em que o evento ocorreu (que pode ser um filho distante).
*   [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Um número. Retorna o tempo em que o evento ocorreu.

Além disso, os objetos de evento React fornecem essas propriedades:

*   `nativeEvent`: Um [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) DOM. O objeto de evento original do navegador.

#### Métodos {/*react-event-object-methods*/}

Os objetos de evento React implementam alguns dos métodos [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) padrão:

*   [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Impede a ação padrão do navegador para o evento.
*   [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Interrompe a propagação do evento pela árvore React.

Além disso, os objetos de evento React fornecem esses métodos:

*   `isDefaultPrevented()`: Retorna um valor booleano indicando se `preventDefault` foi chamado.
*   `isPropagationStopped()`: Retorna um valor booleano indicando se `stopPropagation` foi chamado.
*   `persist()`: Não usado com React DOM. Com React Native, chame isso para ler as propriedades do evento após o evento.
*   `isPersistent()`: Não usado com React DOM. Com React Native, retorna se `persist` foi chamado.

#### Ressalvas {/*react-event-object-caveats*/}

*   Os valores de `currentTarget`, `eventPhase`, `target` e `type` refletem os valores que seu código React espera. Por baixo dos panos, React anexa manipuladores de eventos na raiz, mas isso não é refletido em objetos de evento React. Por exemplo, `e.currentTarget` pode não ser o mesmo que o `e.nativeEvent.currentTarget` subjacente. Para eventos polyfilled, `e.type` (tipo de evento React) pode diferir de `e.nativeEvent.type` (tipo subjacente).

---

### Função do manipulador `AnimationEvent` {/*animationevent-handler*/}

Um tipo de manipulador de eventos para os eventos [animação CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parâmetros {/*animationevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent):
    *   [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
    *   [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
    *   [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Função do manipulador `ClipboardEvent` {/*clipboadevent-handler*/}

Um tipo de manipulador de eventos para os eventos da [API Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parâmetros {/*clipboadevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent):

    *   [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Função do manipulador `CompositionEvent` {/*compositionevent-handler*/}

Um tipo de manipulador de eventos para os eventos do [editor de método de entrada (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parâmetros {/*compositionevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
    *   [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Função do manipulador `DragEvent` {/*dragevent-handler*/}

Um tipo de manipulador de eventos para os eventos da [API HTML Drag and Drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Origem da arrastada
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Alvo da soltura
  </div>
</>
```

#### Parâmetros {/*dragevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent):
    *   [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

    Ele também inclui as propriedades [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) herdadas:

    *   [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

    Ele também inclui as propriedades [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) herdadas:

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função do manipulador `FocusEvent` {/*focusevent-handler*/}

Um tipo de manipulador de eventos para os eventos de foco.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Veja um exemplo.](#handling-focus-events)

#### Parâmetros {/*focusevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
    *   [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

    Ele também inclui as propriedades [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) herdadas:

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função do manipulador `Event` {/*event-handler*/}

Um tipo de manipulador de eventos para eventos genéricos.

#### Parâmetros {/*event-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) sem propriedades adicionais.

---

### Função do manipulador `InputEvent` {/*inputevent-handler*/}

Um tipo de manipulador de eventos para o evento `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parâmetros {/*inputevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
    *   [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Função do manipulador `KeyboardEvent` {/*keyboardevent-handler*/}

Um tipo de manipulador de eventos para eventos de teclado.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Veja um exemplo.](#handling-keyboard-events)

#### Parâmetros {/*keyboardevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
    *   [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
    *   [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
    *   [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
    *   [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
    *   [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
    *   [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
    *   [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
    *   [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
    *   [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
    *   [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
    *   [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
    *   [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
    *   [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

    Ele também inclui as propriedades [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) herdadas:

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função do manipulador `MouseEvent` {/*mouseevent-handler*/}

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

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):
    *   [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

    Ele também inclui as propriedades [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) herdadas:

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função do manipulador `PointerEvent` {/*pointerevent-handler*/}

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

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
    *   [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
    *   [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
    *   [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
    *   [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
    *   [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
    *   [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
    *   [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
    *   [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
    *   [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
    *   [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

    Ele também inclui as propriedades [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) herdadas:```
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

  Ele também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função manipuladora de eventos `TouchEvent` {/*touchevent-handler*/}

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

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras do [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent):
    *   [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
    *   [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
    *   [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
    *   [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
    *   [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
    *   [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
    *   [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)

    Ele também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função manipuladora do evento `TransitionEvent` {/*transitionevent-handler*/}

Um tipo de manipulador de eventos para os eventos de transição CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parâmetros {/*transitionevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras do [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
    *   [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
    *   [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
    *   [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Função manipuladora de eventos `UIEvent` {/*uievent-handler*/}

Um tipo de manipulador de eventos para eventos de UI genéricos.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parâmetros {/*uievent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):
    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Função manipuladora de eventos `WheelEvent` {/*wheelevent-handler*/}

Um tipo de manipulador de eventos para o evento `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parâmetros {/*wheelevent-handler-parameters*/}

*   `e`: Um [objeto de evento React](#react-event-object) com estas propriedades extras do [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent):
    *   [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
    *   [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
    *   [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
    *   [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)

    Ele também inclui as propriedades herdadas do [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

    *   [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

    Ele também inclui as propriedades herdadas do [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Uso {/*usage*/}

### Aplicando estilos CSS {/*applying-css-styles*/}

No React, você especifica uma classe CSS com [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) Ele funciona como o atributo `class` em HTML:

```js
<img className="avatar" />
```

Então você escreve as regras CSS correspondentes em um arquivo CSS separado:

```css
/* No seu CSS */
.avatar {
  border-radius: 50%;
}
```

O React não prescreve como você adiciona arquivos CSS. No caso mais simples, você adicionará uma tag [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ao seu HTML. Se você usar uma ferramenta de build ou um framework, consulte sua documentação para aprender como adicionar um arquivo CSS ao seu projeto.

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

No exemplo acima, `style={{}}` não é uma sintaxe especial, mas um objeto `{}` regular dentro da `style={ }` [chaves JSX.](/learn/javascript-in-jsx-with-curly-braces) Recomendamos usar o atributo `style` apenas quando seus estilos dependem de variáveis JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Como aplicar várias classes CSS condicionalmente? {/*how-to-apply-multiple-css-classes-conditionally*/}

Para aplicar classes CSS condicionalmente, você precisa produzir a string `className` você mesmo usando JavaScript.

Por exemplo, `className={'row ' + (isSelected ? 'selected': '')}` produzirá `className="row"` ou `className="row selected"` dependendo se `isSelected` é `true`.

Para tornar isso mais legível, você pode usar uma pequena biblioteca auxiliar como [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

É especialmente conveniente se você tiver várias classes condicionais:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipulando um nó DOM com uma ref {/*manipulating-a-dom-node-with-a-ref*/}

Às vezes, você precisará obter o nó DOM do navegador associado a uma tag em JSX. Por exemplo, se você deseja focar em um `<input>` quando um botão é clicado, você precisa chamar [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) no nó DOM `<input>` do navegador.

Para obter o nó DOM do navegador para uma tag, [declare uma ref](/reference/react/useRef) e passe-a como o atributo `ref` para essa tag:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

O React colocará o nó DOM em `inputRef.current` depois que ele for renderizado na tela.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Leia mais sobre [manipulação de DOM com refs](/learn/manipulating-the-dom-with-refs) e [verifique mais exemplos.](/reference/react/useRef#examples-dom)

Para casos de uso mais avançados, o atributo `ref` também aceita uma [função callback.](#ref-callback)

---

### Definindo perigosamente o HTML interno {/*dangerously-setting-the-inner-html*/}

Você pode passar uma string HTML bruta para um elemento da seguinte forma:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Isto é perigoso. Como acontece com a propriedade [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) DOM subjacente, você deve ter extrema cautela! A menos que a marcação seja proveniente de uma fonte totalmente confiável, é trivial introduzir uma vulnerabilidade [XSS](https://pt.wikipedia.org/wiki/Cross-site_scripting) dessa maneira.**

Por exemplo, se você usar uma biblioteca Markdown que converte Markdown em HTML, você confia que seu analisador não contenha bugs, e o usuário só vê sua própria entrada, você pode exibir o HTML resultante assim:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Olá,_ **Markdown**!');
  return (
    <>
      <label>
        Digite algum markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Isto é SOMENTE seguro porque o HTML de saída
  // é mostrado para o mesmo usuário e porque você
  // confia que este analisador Markdown não tem bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

O objeto `{__html}` deve ser criado o mais próximo possível de onde o HTML é gerado, como o exemplo acima faz na função `renderMarkdownToHTML`. Isso garante que todo o HTML bruto que está sendo usado em seu código seja explicitamente marcado como tal e que apenas as variáveis que você espera que contenham HTML sejam passadas para `dangerouslySetInnerHTML`. Não é recomendado criar o objeto inline como `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Para ver por que renderizar HTML arbitrário é perigoso, substitua o código acima por isto:

```js {1-4,7,8}
const post = {
  // Imagine que este conteúdo está armazenado no banco de dados.
  content: `<img src="" onerror='alert("você foi hackeado")'>`
};

export default function MarkdownPreview() {
  // 🔴 FURO DE SEGURANÇA: passando uma entrada não confiável para dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

O código incorporado no HTML será executado. Um hacker poderia usar este furo de segurança para roubar informações do usuário ou realizar ações em seu nome. **Use `dangerouslySetInnerHTML` apenas com dados confiáveis e sanitizados.**

---

### Manipulando eventos de mouse {/*handling-mouse-events*/}

Este exemplo mostra alguns [eventos de mouse](#mouseevent-handler) comuns e quando eles são disparados.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (pai)')}
      onMouseLeave={e => console.log('onMouseLeave (pai)')}
    >
      <button
        onClick={e => console.log('onClick (primeiro botão)')}
        onMouseDown={e => console.log('onMouseDown (primeiro botão)')}
        onMouseEnter={e => console.log('onMouseEnter (primeiro botão)')}
        onMouseLeave={e => console.log('onMouseLeave (primeiro botão)')}
        onMouseOver={e => console.log('onMouseOver (primeiro botão)')}
        onMouseUp={e => console.log('onMouseUp (primeiro botão)')}
      >
        Primeiro botão
      </button>
      <button
        onClick={e => console.log('onClick (segundo botão)')}
        onMouseDown={e => console.log('onMouseDown (segundo botão)')}
        onMouseEnter={e => console.log('onMouseEnter (segundo botão)')}
        onMouseLeave={e => console.log('onMouseLeave (segundo botão)')}
        onMouseOver={e => console.log('onMouseOver (segundo botão)')}
        onMouseUp={e => console.log('onMouseUp (segundo botão)')}
      >
        Segundo botão
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manipulando eventos de ponteiro {/*handling-pointer-events*/}

Este exemplo mostra alguns [eventos de ponteiro](#pointerevent-handler) comuns e quando eles são disparados.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (pai)')}
      onPointerLeave={e => console.log('onPointerLeave (pai)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (primeiro filho)')}
        onPointerEnter={e => console.log('onPointerEnter (primeiro filho)')}
        onPointerLeave={e => console.log('onPointerLeave (primeiro filho)')}
        onPointerMove={e => console.log('onPointerMove (primeiro filho)')}
        onPointerUp={e => console.log('onPointerUp (primeiro filho)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Primeiro filho
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (segundo filho)')}
        onPointerEnter={e => console.log('onPointerEnter (segundo filho)')}
        onPointerLeave={e => console.log('onPointerLeave (segundo filho)')}
        onPointerMove={e => console.log('onPointerMove (segundo filho)')}
        onPointerUp={e => console.log('onPointerUp (segundo filho)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Segundo filho
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manipulando eventos de foco {/*handling-focus-events*/}

No React, [eventos de foco](#focusevent-handler) propagam. Você pode usar o `currentTarget` e `relatedTarget` para diferenciar se os eventos de foco ou desfoque se originaram de fora do elemento pai. O exemplo mostra como detectar o foco de um filho, o foco do elemento pai e como detectar a entrada ou saída do foco de toda a subárvore.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('foco no pai');
        } else {
          console.log('foco no filho', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Não é acionado ao trocar o foco entre os filhos
          console.log('foco entrou no pai');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('pai sem foco');
        } else {
          console.log('filho sem foco', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Não é acionado ao trocar o foco entre os filhos
          console.log('foco deixou o pai');
        }
      }}
    >
      <label>
        Primeiro nome:
        <input name="firstName" />
      </label>
      <label>
        Sobrenome:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Manipulando eventos de teclado {/*handling-keyboard-events*/}

Este exemplo mostra alguns [eventos de teclado](#keyboardevent-handler) comuns e quando eles são disparados.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      Primeiro nome:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>