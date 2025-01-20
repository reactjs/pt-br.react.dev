---
title: preloadModule
canary: true
---

<Canary>

A função `preloadModule` está atualmente disponível apenas nos canais Canary e experimental do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

Frameworks [baseados em React](/learn/start-a-new-react-project) frequentemente lidam com o carregamento de recursos para você, então você pode não precisar chamar esta API você mesmo. Consulte a documentação do seu framework para mais detalhes.

</Note>

<Intro>

`preloadModule` permite que você carregue antecipadamente um módulo ESM que você espera usar.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Para pré-carregar um módulo ESM, chame a função `preloadModule` do `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preloadModule` fornece ao navegador uma dica de que ele deve começar a baixar o módulo dado, o que pode economizar tempo.

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do módulo que você deseja baixar.
* `options`: um objeto. Contém as seguintes propriedades:
  *  `as`: uma string obrigatória. Deve ser `'script'`.
  *  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`.
  *  `integrity`: uma string. Um hash criptográfico do módulo, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: uma string. Um [nonce criptográfico para permitir o módulo](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo estrita. 


#### Retornos {/*returns*/}

`preloadModule` não retorna nada.

#### Ressalvas {/*caveats*/}

* Chamadas múltiplas para `preloadModule` com o mesmo `href` têm o mesmo efeito que uma única chamada.
* No navegador, você pode chamar `preloadModule` em qualquer situação: durante a renderização de um componente, em um Efeito, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preloadModule` só tem efeito se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.

---

## Uso {/*usage*/}

### Pré-carregando ao renderizar {/*preloading-when-rendering*/}

Chame `preloadModule` ao renderizar um componente se você souber que ele ou seus filhos usarão um módulo específico.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador comece a executar o módulo imediatamente (em vez de apenas baixá-lo), use [`preinitModule`](/reference/react-dom/preinitModule) em vez disso. Se você quiser carregar um script que não seja um módulo ESM, use [`preload`](/reference/react-dom/preload).

### Pré-carregando em um manipulador de eventos {/*preloading-in-an-event-handler*/}

Chame `preloadModule` em um manipulador de eventos antes de transitar para uma página ou estado onde o módulo será necessário. Isso inicia o processo mais cedo do que se você chamá-lo durante a renderização da nova página ou estado.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```