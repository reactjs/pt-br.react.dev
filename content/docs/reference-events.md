---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Este guia de referência documenta o agregador `SyntheticEvent` (evento sintético), que faz parte do sistema de eventos do React. Veja o guia [Manipulando Eventos](/docs/handling-events.html) para saber mais.

## Visão geral {#overview}

Os manipuladores de evento (_event handlers_) serão passados como instâncias do `SyntheticEvent`, um agregador _cross-browser_ que envolve os eventos nativos do navegador. Ambos tem a mesma interface, incluindo `stopPropagation()` e `preventDefault()`, porém funcionam de forma idêntica em todos os navegadores.

Caso você pense, por algum motivo, que precisa do evento original do navegador, basta utilizar o atributo `nativeEvent` para acessá-lo. Os eventos sintéticos são diferentes e não são mapeados diretamente para os eventos nativos do navegador. Por exemplo, em `onMouseLeave` `event.nativeEvent` irá apontar para um evento `mouseout`. O mapeamento específico não faz parte da API pública e pode ser alterado a qualquer momento. Cada objeto do `SyntheticEvent` tem os seguintes atributos:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Nota:
>
<<<<<<< HEAD
> A partir da v0.14, retornar `false` de um _event handler_ não irá mais parar a propagação de eventos. Sendo assim, tanto o `e.stopPropagation()` quanto o `e.preventDefault()` deve ser acionado manualmente, quando apropriado.

### Event Pooling (acumulador de eventos) {#event-pooling}

O `SyntheticEvent` é acumulado. Isso significa que o objeto `SyntheticEvent` será reutilizado e todas as suas propriedades serão anuladas após o callback do evento ser acionado.
É assim por questões de performance.
Sendo assim, você não pode acessar o evento de forma assíncrona.

```javascript
function onClick(event) {
  console.log(event); // => objeto anulado (nullified).
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Não funciona. this.state.clickEvent irá conter apenas valores nulos.
  this.setState({clickEvent: event});

  // Você ainda pode exportar as propriedades do evento.
  this.setState({eventType: event.type});
}
```
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

> Nota:
>
<<<<<<< HEAD
> Se você deseja acessar as propriedades de um evento de forma assíncrona, você deve chamar o `event.persist()` no evento em questão. Isso irá remover o evento sintético do acumulador e permitir referências ao evento serem retidas pelo código do usuário.

## Eventos Suportados {#supported-events}

O React normaliza eventos para que eles possam ter propriedades consistentes entre os navegadores.

Os manipuladores de evento (_event handlers_) abaixo são acionados por um evento na fase de propagação (_bubbling_). Para registrar um manipulador de evento para a fase de captura, adicione `Capture` como sufixo do nome do evento. Por exemplo, ao invés de usar `onClick`, você usaria `onClickCapture` para manipular o evento de clique na fase de captura.

- [Eventos do Clipboard](#clipboard-events)
- [Eventos de Composição (Composition)](#composition-events)
- [Eventos do Teclado](#keyboard-events)
- [Eventos de Foco](#focus-events)
- [Eventos de Formulário](#form-events)
- [Eventos Genéricos](#generic-events)
- [Eventos do Mouse](#mouse-events)
- [Eventos do Ponteiro (Pointer)](#pointer-events)
- [Eventos de Seleção](#selection-events)
- [Eventos de Toque (Touch)](#touch-events)
- [Eventos da Interface do Usuário (UI)](#ui-events)
- [Eventos de Rolagem (Wheel)](#wheel-events)
- [Eventos de Mídia](#media-events)
- [Eventos de Imagem](#image-events)
- [Eventos de Animação](#animation-events)
- [Eventos de Transição](#transition-events)
- [Outros Eventos](#other-eventos)
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

* * *

## Referência {#reference}

### Eventos do Clipboard {#clipboard-events}

Nome dos eventos:

```
onCopy onCut onPaste
```

Propriedades:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Eventos de Composição (Composition) {#composition-events}

Nome dos eventos:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Propriedades:

```javascript
string data

```

* * *

### Eventos do Teclado {#keyboard-events}

Nome dos eventos:

```
onKeyDown onKeyPress onKeyUp
```

Propriedades:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

A propriedade `key` pode receber quaisquer valores documentados na [especificação de eventos do DOM Level 3](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Eventos de Foco {#focus-events}

Nome dos eventos:

```
onFocus onBlur
```

Esses eventos de foco funcionam em todos os elementos do React DOM, não apenas em elementos de formulário.

Propriedades:

```js
DOMEventTarget relatedTarget
```

#### onFocus

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```


* * *

### Eventos de Formulário {#form-events}

Nome dos eventos:

```
onChange onInput onInvalid onReset onSubmit 
```

Para mais informações sobre o evento onChange, veja [Formulários](/docs/forms.html).

* * *

### Eventos Genéricos {#generic-events}

Nome dos eventos:

```
onError onLoad
```

* * *

### Eventos do Mouse {#mouse-events}

Nome dos eventos:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Os eventos `onMouseEnter` e `onMouseLeave` propagam do elemento do lado esquerdo ao evento que está entrando, ao invés do _bubbling_ comum e não tem uma fase de captura.

Propriedades:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Eventos do Ponteiro {#pointer-events}

Nome dos eventos:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Os eventos `onPointerEnter` e `onPointerLeave` propagam do elemento do lado esquerdo ao evento que está entrando, ao invés do _bubbling_ comum e não tem uma fase de captura.

Propriedades:

Como definido na [especificação da W3](https://www.w3.org/TR/pointerevents/), os eventos de ponteiro estendem os [Eventos do Mouse](#mouse-events) com as seguintes propriedades:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Uma nota em relação a compatiblidade entre navegadores:

Os eventos de ponteiro ainda não tem suporte em todos os navegadores (no momento da escrita deste artigo, navegadores que oferecem suporte são: Chrome, Firefox, Edge e Internet Explorer). O React deliberadamente não fornece um polyfill para outros navegadores, pois um polyfill que seja compilante com os padrōes aumentaria drasticamente o tamanho do _bundle_ do `react-dom`.

Se sua aplicação necessita de eventos de ponteiro, recomendamos adicionar um polyfill de terceiros.

* * *

### Eventos de Seleção {#selection-events}

Nome dos eventos:

```
onSelect
```

* * *

### Eventos de Toque (Touch) {#touch-events}

Nome dos eventos:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Propriedades:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### Eventos da Interface do Usuário (UI) {#ui-events}

Nome dos eventos:

```
onScroll
```

<<<<<<< HEAD
Propriedades:
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

```javascript
number detail
DOMAbstractView view
```

* * *

### Eventos de Rolagem (Wheel) {#wheel-events}

Nome dos eventos:

```
onWheel
```

Propriedades:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Eventos de Mídia {#media-events}

Nome dos eventos:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Eventos de Imagem {#image-events}

Nome dos eventos:

```
onLoad onError
```

* * *

### Eventos de Animação {#animation-events}

Nome dos eventos:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Propriedades:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Eventos de Transição {#transition-events}

Nome dos eventos:

```
onTransitionEnd
```

Propriedades:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Outros Eventos {#other-events}

Nome dos eventos:

```
onToggle
```
