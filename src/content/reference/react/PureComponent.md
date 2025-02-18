---
title: PureComponent
---

<Pitfall>

Recomendamos definir componentes como funções em vez de classes. [Veja como migrar.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` é semelhante a [`Component`](/reference/react/Component), mas ignora re-renderizações para as mesmas props e estado. Os componentes de classe ainda são suportados pelo React, mas não recomendamos o uso deles em novo código.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Olá, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Para pular a re-renderização de um componente de classe para as mesmas props e estado, estenda `PureComponent` em vez de [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Olá, {this.props.name}!</h1>;
  }
}
```

`PureComponent` é uma subclasse de `Component` e suporta [todas as APIs de `Component`.](/reference/react/Component#reference) Estender `PureComponent` é equivalente a definir um método customizado [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) que compara superficialmente props e estado.


[Veja mais exemplos abaixo.](#usage)

---

## Uso {/*usage*/}

### Ignorando re-renderizações desnecessárias para componentes de classe {/*skipping-unnecessary-re-renders-for-class-components*/}

O React normalmente re-renderiza um componente sempre que seu pai re-renderiza. Como uma otimização, você pode criar um componente que o React não re-renderiza quando seu pai re-renderiza, desde que suas novas props e estado sejam iguais às antigas props e estado. [Os componentes de classe](/reference/react/Component) podem optar por esse comportamento estendendo `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Olá, {this.props.name}!</h1>;
  }
}
```

Um componente React deve sempre ter [lógica de renderização pura.](/learn/keeping-components-pure) Isso significa que ele deve retornar a mesma saída se suas props, estado e contexto não tiverem mudado. Ao usar `PureComponent`, você está dizendo ao React que seu componente cumpre esse requisito, para que o React não precise re-renderizar enquanto suas props e estado não mudarem. No entanto, seu componente ainda re-renderizará se um contexto que ele está usando mudar.

Neste exemplo, note que o componente `Greeting` re-renderiza sempre que `name` é alterado (porque essa é uma de suas props), mas não quando `address` é alterado (porque não é passado para `Greeting` como uma prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting foi renderizado em", new Date().toLocaleTimeString());
    return <h3>Olá{name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Endereço{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Recomendamos definir componentes como funções em vez de classes. [Veja como migrar.](#alternatives)

</Pitfall>

---

## Alternativas {/*alternatives*/}

### Migrando de um componente de classe `PureComponent` para uma função {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Recomendamos usar componentes de função em vez de [componentes de classe](/reference/react/Component) em novo código. Se você tiver alguns componentes de classe existentes usando `PureComponent`, aqui está como você pode convertê-los. Este é o código original:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting foi renderizado em", new Date().toLocaleTimeString());
    return <h3>Olá{name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Endereço{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Quando você [converter este componente de uma classe para uma função,](/reference/react/Component#alternatives) encapsule-o em [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting foi renderizado em", new Date().toLocaleTimeString());
  return <h3>Olá{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Endereço{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Diferente de `PureComponent`, [`memo`](/reference/react/memo) não compara o novo e o antigo estado. Em componentes de função, chamar a [`função set`](/reference/react/useState#setstate) com o mesmo estado [já previne re-renderizações por padrão,](/reference/react/memo#updating-a-memoized-component-using-state) mesmo sem `memo`.

</Note>