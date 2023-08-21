---
title: "<progress>"
---

<Intro>

O [componente `<progress>` nativo do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress) permite que você renderize um indicador de progresso.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<progress>` {/*progress*/}

Para exibir um indicador de progresso, renderize o componente [`<progress>` nativo do navegador](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<progress>` suporta todas as [props comuns dos elementos.](/reference/react-dom/components/common#props)

Adicionalmente, `<progress>` suporta estas props:

* [`max`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress#max): Um número. Especifica o `value` máximo. Seu valor padrão é `1`.
* [`value`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress#value): Um número entre `0` e `max`, ou `null` para progresso indeterminado. Especifica o quanto foi feito.

---

## Uso {/*usage*/}

### Controlando um indicador de progresso {/*controlling-a-progress-indicator*/}

Para exibir um indicador de progresso, renderize um componente `<progress>`. Você pode passar `value`, um número entre `0` e o valor `max` por você especificado. Se você não passar um valor `max`, o padrão usado será `1`.

Se a operação não estiver ocorrendo, passe `value={null}` para colocar o indicador de progresso em um estado indeterminado.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
