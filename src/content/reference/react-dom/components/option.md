---
title: "<option>"
---

<Intro>

O [componente `<option>` embutido no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) permite renderizar uma opção dentro de uma caixa [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<option>` {/*option*/}

O [componente `<option>` embutido no navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) permite renderizar uma opção dentro de uma caixa [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<option>` suporta todas as [props comuns de elementos.](/reference/react-dom/components/common#props)

Além disso, `<option>` suporta estas props:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Um booleano. Se `true`, a opção não será selecionável e aparecerá atenuada.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Uma string. Especifica o significado da opção. Se não especificado, o texto dentro da opção é utilizado.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): O valor a ser usado [ao submeter o `<select>` pai em um formulário](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) se esta opção for selecionada.

#### Ressalvas {/*caveats*/}

* O React não suporta o atributo `selected` em `<option>`. Em vez disso, passe o `value` desta opção para o [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) para uma caixa de seleção não controlada, ou [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) para uma caixa de seleção controlada.

---

## Uso {/*usage*/}

### Exibindo uma caixa de seleção com opções {/*displaying-a-select-box-with-options*/}

Renderize um `<select>` com uma lista de componentes `<option>` dentro para exibir uma caixa de seleção. Dê a cada `<option>` um `value` representando os dados a serem submetidos com o formulário.

[Leia mais sobre a exibição de um `<select>` com uma lista de componentes `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Escolha uma fruta:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  