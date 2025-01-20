---
title: preconnect
canary: true
---

<Canary>

A função `preconnect` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`preconnect` permite que você faça uma conexão antecipada com um servidor do qual você espera carregar recursos.

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

A função `preconnect` fornece ao navegador uma sugestão de que ele deve abrir uma conexão com o servidor fornecido. Se o navegador optar por fazer isso, isso pode acelerar o carregamento de recursos desse servidor. 

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do servidor com o qual você deseja se conectar.

#### Retorna {/*returns*/}

`preconnect` não retorna nada.

#### Ressalvas {/*caveats*/}

* Chamadas múltiplas para `preconnect` com o mesmo servidor têm o mesmo efeito que uma única chamada.
* No navegador, você pode chamar `preconnect` em qualquer situação: durante a renderização de um componente, em um Effect, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preconnect` só tem efeito se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Qualquer outra chamada será ignorada.
* Se você souber os recursos específicos de que precisará, pode chamar [outras funções](/reference/react-dom/#resource-preloading-apis) em vez disso, que começarão a carregar os recursos imediatamente.
* Não há benefício em pré-conectar ao mesmo servidor em que a própria página da web está hospedada, pois ela já foi conectada no momento em que a sugestão seria dada.

---

## Uso {/*usage*/}

### Pré-conectando ao renderizar {/*preconnecting-when-rendering*/}

Chame `preconnect` ao renderizar um componente se você souber que seus filhos carregarão recursos externos daquele host.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Pré-conectando em um manipulador de eventos {/*preconnecting-in-an-event-handler*/}

Chame `preconnect` em um manipulador de eventos antes de transitar para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```