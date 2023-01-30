---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

<<<<<<< HEAD
Este guia de referência documenta o agregador `SyntheticEvent` (evento sintético), que faz parte do sistema de eventos do React. Veja o guia [Manipulando Eventos](/docs/handling-events.html) para saber mais.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://beta.reactjs.org/reference/react-dom/components/common)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

This reference guide documents the `SyntheticEvent` wrapper that forms part of React's Event System. See the [Handling Events](/docs/handling-events.html) guide to learn more.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

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
> A partir da v17, `e.persist()` não faz nada porque o `SyntheticEvent` não é mais [agrupado](/docs/legacy-event-pooling.html).

> Nota:
>
> A partir da v0.14, retornar `false` de um _event handler_ não irá mais parar a propagação de eventos. Sendo assim, tanto o `e.stopPropagation()` quanto o `e.preventDefault()` deve ser acionado manualmente, quando apropriado.

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

#### onFocus {#onfocus}

O evento `onFocus` é chamado quando o elemento (ou algum elemento dentro dele) recebe o foco. Por exemplo, é chamado quando o usuário clica em um input de texto.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focos no input');
      }}
      placeholder="onFocus é acionado quando você clica nesta entrada."
    />
  )
}
```

#### onBlur {#onblur}

O manipulador de eventos `onBlur` é chamado quando o foco deixa o elemento (ou deixa algum elemento dentro dele). Por exemplo, é chamado quando o usuário clica fora de um input de texto focado.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Disparado porque esta entrada perdeu o foco');
      }}
      placeholder="onBlur é acionado quando você clica nesta entrada e clica fora dela."
    />
  )
}
```

#### Detecção de Foco Entrando e Saindo {#detecting-focus-entering-and-leaving}

Você pode usar `currentTarget` e `relatedTarget` para diferenciar se os eventos de foco ou desfoque originaram-se de _fora_ do elemento pai. Aqui está uma demonstração que você pode copiar e colar que mostra como detectar o foco de um elemento filho, focalizando o próprio elemento e o foco entrando ou saindo de toda a subárvore.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focos dele');
        } else {
          console.log('focus no elemento filho', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Não acionado ao trocar o foco entre os elementos filhos
          console.log('foco entrou no proprio elemento');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('desfoque dele');
        } else {
          console.log('desfoque no elemento filho', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Não acionado ao trocar o foco entre os elementos filhos
          console.log(focos a esquerda'');
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

>Nota
>
>Começando com React 17, o evento `onScroll` **não borbulha** no React. Isso corresponde ao comportamento do navegador e evita a confusão quando um elemento rolável aninhado dispara eventos em um pai distante.

Propriedades:

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
