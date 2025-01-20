---
title: preinitModule
canary: true
---

<Canary>

A função `preinitModule` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

Frameworks [baseados em React](/learn/start-a-new-react-project) frequentemente lidam com o carregamento de recursos para você, então você pode não precisar chamar esta API você mesmo. Consulte a documentação do seu framework para detalhes.

</Note>

<Intro>

`preinitModule` permite que você busque e avalie um módulo ESM de forma antecipada.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Para pré-inicializar um módulo ESM, chame a função `preinitModule` do `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preinitModule` fornece ao navegador uma dica de que ele deve começar a baixar e executar o módulo fornecido, o que pode economizar tempo. Módulos que você `preinit` são executados quando terminam de ser baixados.

#### Parâmetros {/*parameters*/}

* `href`: uma string. A URL do módulo que você deseja baixar e executar.
* `options`: um objeto. Ele contém as seguintes propriedades:
  *  `as`: uma string obrigatória. Deve ser `'script'`.
  *  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser utilizada. Seus valores possíveis são `anonymous` e `use-credentials`.
  *  `integrity`: uma string. Um hash criptográfico do módulo, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: uma string. Um [nonce criptográfico para permitir o módulo](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo rigorosa.

#### Retornos {/*returns*/}

`preinitModule` não retorna nada.

#### Ressalvas {/*caveats*/}

* Chamadas múltiplas para `preinitModule` com o mesmo `href` têm o mesmo efeito que uma única chamada.
* No navegador, você pode chamar `preinitModule` em qualquer situação: ao renderizar um componente, em um Efeito, em um manipulador de eventos, e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preinitModule` só tem efeito se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Qualquer outra chamada será ignorada.

---

## Uso {/*usage*/}

### Pré-carregamento ao renderizar {/*preloading-when-rendering*/}

Chame `preinitModule` ao renderizar um componente se você sabe que ele ou seus filhos usarão um módulo específico e você está de acordo com o módulo sendo avaliado e, assim, tendo efeito imediatamente após ser baixado.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador baixe o módulo, mas não o execute imediatamente, use [`preloadModule`](/reference/react-dom/preloadModule) em vez disso. Se você quiser pré-inicializar um script que não é um módulo ESM, use [`preinit`](/reference/react-dom/preinit).

### Pré-carregamento em um manipulador de eventos {/*preloading-in-an-event-handler*/}

Chame `preinitModule` em um manipulador de eventos antes de transitar para uma página ou estado onde o módulo será necessário. Isso inicia o processo mais cedo do que se você chamá-lo durante a renderização da nova página ou estado.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```