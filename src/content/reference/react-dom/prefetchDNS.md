---
title: prefetchDNS
canary: true
---

<Canary>

A função `prefetchDNS` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`prefetchDNS` permite que você busque de forma antecipada o IP de um servidor do qual você espera carregar recursos.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Para buscar um host, chame a função `prefetchDNS` do `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função prefetchDNS fornece ao navegador uma dica de que ele deve buscar o endereço IP de um servidor específico. Se o navegador optar por fazê-lo, isso pode acelerar o carregamento de recursos desse servidor. 

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do servidor ao qual você deseja se conectar.

#### Retornos {/*returns*/}

`prefetchDNS` não retorna nada.

#### Ressalvas {/*caveats*/}

* Chamadas múltiplas para `prefetchDNS` com o mesmo servidor têm o mesmo efeito que uma única chamada.
* No navegador, você pode chamar `prefetchDNS` em qualquer situação: durante a renderização de um componente, em um Effect, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `prefetchDNS` tem efeito apenas se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.
* Se você conhece os recursos específicos que precisará, pode chamar [outras funções](/reference/react-dom/#resource-preloading-apis) que começarão a carregar os recursos imediatamente.
* Não há benefício em buscar antecipadamente o mesmo servidor de onde a página da web está hospedada, pois ele já foi buscado no momento em que a dica seria dada.
* Comparado com [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` pode ser melhor se você estiver conectando de forma especulativa a um grande número de domínios, caso em que o overhead das pré-conexões pode superar o benefício.

---

## Uso {/*usage*/}

### Busca antecipada de DNS ao renderizar {/*prefetching-dns-when-rendering*/}

Chame `prefetchDNS` ao renderizar um componente se você souber que seus filhos carregarão recursos externos desse host.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Busca antecipada de DNS em um manipulador de eventos {/*prefetching-dns-in-an-event-handler*/}

Chame `prefetchDNS` em um manipulador de eventos antes de fazer a transição para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você chamá-lo durante a renderização da nova página ou estado.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```