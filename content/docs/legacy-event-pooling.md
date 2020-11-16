---
id: legacy-event-pooling
title: Pooling de Eventos
permalink: docs/legacy-event-pooling.html
---

>Nota
>
>Esta página é relevante apenas para React 16 e anteriores, e para React Native.
>
>React 17 na web **não** usa pool de eventos.
>
>[Mais informações](/blog/2020/08/10/react-v17-rc.html#no-event-pooling) sobre esta mudança no React 17.

<<<<<<< HEAD
Os objetos [`SyntheticEvent`](/docs/events.html) são agrupados. Isso será reutilizado e todas as propriedades serão anuladas após a chamada do manipulador de eventos. Por exemplo, isso não funcionará:
=======
The [`SyntheticEvent`](/docs/events.html) objects are pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event handler has been called. For example, this won't work:
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

```javascript
function handleChange(e) {
  // Isso não funcionará porque o objeto de evento é reutilizado.
  setTimeout(() => {
    console.log(e.target.value); // Muito tarde!
  }, 100);
}
```

Se você precisar acessar as propriedades do objeto de evento após a execução do manipulador de eventos, você precisa chamar `e.persist()`:

```javascript
function handleChange(e) {
  // Evita que o React redefina suas propriedades:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```
