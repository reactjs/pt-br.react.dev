---
title: preconnect
---

<Intro>

`preconnect` permite que você se conecte ansiosamente a um servidor do qual você espera carregar recursos.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Para pré-conectar a um host, chame a função `preconnect` de `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preconnect` fornece ao navegador uma dica de que ele deve abrir uma conexão com o servidor fornecido. Se o navegador escolher fazê-lo, isso pode acelerar o carregamento de recursos desse servidor.

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do servidor ao qual você deseja se conectar.

#### Retorna {/*returns*/}

`preconnect` não retorna nada.

#### Ressalvas {/*caveats*/}

* Múltiplas chamadas para `preconnect` com o mesmo servidor têm o mesmo efeito de uma única chamada.
* No navegador, você pode chamar `preconnect` em qualquer situação: ao renderizar um componente, em um Effect, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Server Components, `preconnect` só tem efeito se você chamá-lo ao renderizar um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.
* Se você sabe os recursos específicos de que precisará, pode chamar [outras funções](/reference/react-dom/#resource-preloading-apis) em vez disso que começarão a carregar os recursos imediatamente.
* Não há benefício em pré-conectar ao mesmo servidor onde a própria página da web está hospedada, pois ela já foi conectada no momento em que a dica seria dada.

---

## Uso {/*usage*/}

### Pré-conexão ao renderizar {/*preconnecting-when-rendering*/}

Chame `preconnect` ao renderizar um componente se você souber que seus filhos carregarão recursos externos desse host.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Pré-conexão em um manipulador de eventos {/*preconnecting-in-an-event-handler*/}

Chame `preconnect` em um manipulador de eventos antes de fazer a transição para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```