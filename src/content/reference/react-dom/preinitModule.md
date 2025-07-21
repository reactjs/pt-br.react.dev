---
title: preinitModule
---

<Note>

<<<<<<< HEAD
[Frameworks baseados em React](/learn/start-a-new-react-project) frequentemente tratam o carregamento de recursos para você, então você pode não precisar chamar esta API por conta própria. Consulte a documentação do seu framework para obter detalhes.
=======
[React-based frameworks](/learn/creating-a-react-app) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

</Note>

<Intro>

`preinitModule` permite que você obtenha e avalie ansiosamente um módulo ESM.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Para fazer o preinit de um módulo ESM, chame a função `preinitModule` de `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preinitModule` fornece ao navegador uma dica de que ele deve começar a baixar e executar o módulo fornecido, o que pode economizar tempo. Módulos que você faz o `preinit` são executados quando terminam de ser baixados.

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do módulo que você deseja baixar e executar.
* `options`: um objeto. Ele contém as seguintes propriedades:
  *  `as`: uma string obrigatória. Deve ser `'script'`.
  *  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus possíveis valores são `anonymous` e `use-credentials`.
  *  `integrity`: uma string. Uma hash criptográfica do módulo, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: uma string. Um [nonce criptográfico para permitir o módulo](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Content Security Policy estrita.

#### Retorna {/*returns*/}

`preinitModule` não retorna nada.

#### Ressalvas {/*caveats*/}

* Múltiplas chamadas para `preinitModule` com o mesmo `href` têm o mesmo efeito de uma única chamada.
* No navegador, você pode chamar `preinitModule` em qualquer situação: ao renderizar um componente, em um Effect, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preinitModule` só tem efeito se você o chamar durante a renderização de um componente ou em um contexto assíncrono originário da renderização de um componente. Quaisquer outras chamadas serão ignoradas.

---

## Uso {/*usage*/}

### Pré-carregamento durante a renderização {/*preloading-when-rendering*/}

Chame `preinitModule` ao renderizar um componente se você souber que ele ou seus filhos usarão um módulo específico e você estiver de acordo com o fato do módulo ser avaliado e, portanto, ter efeito imediatamente após ser baixado.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador baixe o módulo, mas não o execute imediatamente, use [`preloadModule`](/reference/react-dom/preloadModule) em vez disso. Se você deseja preinit um script que não é um módulo ESM, use [`preinit`](/reference/react-dom/preinit).

### Pré-carregamento em um manipulador de eventos {/*preloading-in-an-event-handler*/}

Chame `preinitModule` em um manipulador de eventos antes de fazer a transição para uma página ou estado onde o módulo será necessário. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```