---
title: "<option>"
---

<Intro>

O [componente nativo do navegador `<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) permite que você renderize uma opção dentro de uma caixa [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Alguma opção</option>
  <option value="otherOption">Outra opção</option>
</select>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<option>` {/*option*/}

O [componente nativo do navegador `<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) permite que você renderize um option dentro de uma caixa [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Alguma opção</option>
  <option value="otherOption">Outra opção</option>
</select>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<option>` suporta todas as [props comuns do elemento.](/reference/react-dom/components/common#common-props)

Adicionalmente, `<option>` suporta estas props:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): A boolean. Se `true`, a opção não será selecionável e aparecerá esmaecida.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Uma string. Especifica o significado da opção. Se não especificado, o texto dentro da opção é usado.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): O valor a ser usado [ao enviar o `<select>` pai em um formulário](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) se esta opção estiver selecionada.

#### Ressalvas {/*caveats*/}

* React não suporta o atributo `selected` no `<option>`. Em vez disso, passe o `value` desta opção para o componente pai [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) para uma caixa de seleção não controlada, ou [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) para um componente controlado.

---

## Uso {/*usage*/}

### Exibindo uma caixa de seleção com opções {/*displaying-a-select-box-with-options*/}

Renderize um `<select>` com uma lista de componentes `<option>` dentro para exibir uma caixa de seleção. Dê a cada `<option>` um `value` que representa os dados a serem enviados com o formulário.

[Leia mais sobre como exibir um `<select>` com uma lista de componentes `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Escolha uma fruta:
      <select name="selectedFruit">
        <option value="apple">Maçã</option>
        <option value="banana">Banana</option>
        <option value="orange">Laranja</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>
