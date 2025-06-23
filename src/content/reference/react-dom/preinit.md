---
title: preinit
---

<Note>

[Frameworks baseados em React](/learn/start-a-new-react-project) frequentemente tratam o carregamento de recursos para você, então talvez você não precise chamar esta API sozinho. Consulte a documentação do seu framework para mais detalhes.

</Note>

<Intro>

`preinit` permite que você busque e avalie ansiosamente uma folha de estilo ou script externo.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Para pré-inicializar um script ou folha de estilo, chame a função `preinit` de `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preinit` fornece ao navegador uma dica de que ele deve começar a baixar e executar o recurso fornecido, o que pode economizar tempo. Scripts que você `preinit` são executados quando terminam o download. Folhas de estilo que você pré-inicializa são inseridas no documento, o que faz com que entrem em vigor imediatamente.

#### Parâmetros {/*parameters*/}

<<<<<<< HEAD
* `href`: uma string. A URL do recurso que você deseja baixar e executar.
* `options`: um objeto. Ele contém as seguintes propriedades:
  *  `as`: uma string obrigatória. O tipo de recurso. Seus valores possíveis são `script` e `style`.
  * `precedence`: uma string. Obrigatório com folhas de estilo. Diz onde inserir a folha de estilo em relação a outras. Folhas de estilo com maior precedência podem substituir aquelas com menor precedência. Os valores possíveis são `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`. É necessário quando `as` é definido como `"fetch"`.
  *  `integrity`: uma string. Um hash criptográfico do recurso, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: uma string. Um [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) criptográfico para permitir o recurso ao usar uma Política de Segurança de Conteúdo estrita.
  *  `fetchPriority`: uma string. Sugere uma prioridade relativa para buscar o recurso. Os valores possíveis são `auto` (o padrão), `high` e `low`.
=======
* `href`: a string. The URL of the resource you want to download and execute.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. The type of resource. Its possible values are `script` and `style`.
  * `precedence`: a string. Required with stylesheets. Says where to insert the stylesheet relative to others. Stylesheets with higher precedence can override those with lower precedence. The possible values are `reset`, `low`, `medium`, `high`. 
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the resource, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy. 
  *  `fetchPriority`: a string. Suggests a relative priority for fetching the resource. The possible values are `auto` (the default), `high`, and `low`.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

#### Retorna {/*returns*/}

`preinit` não retorna nada.

#### Ressalvas {/*caveats*/}

* Várias chamadas para `preinit` com o mesmo `href` têm o mesmo efeito de uma única chamada.
* No navegador, você pode chamar `preinit` em qualquer situação: ao renderizar um componente, em um Effect, em um manipulador de eventos e assim por diante.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preinit` só tem efeito se você o chamar ao renderizar um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.

---

## Uso {/*usage*/}

### Pré-inicializando ao renderizar {/*preiniting-when-rendering*/}

Chame `preinit` ao renderizar um componente se você souber que ele ou seus filhos usarão um recurso específico e estiver tudo bem com o recurso sendo avaliado e, portanto, entrando em vigor imediatamente após o download.

<Recipes titleText="Exemplos de pré-inicialização">

#### Pré-inicializando um script externo {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador baixe o script, mas não o execute imediatamente, use [`preload`](/reference/react-dom/preload) em vez disso. Se você quiser carregar um módulo ESM, use [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Pré-inicializando uma folha de estilo {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

A opção `precedence`, que é obrigatória, permite que você controle a ordem das folhas de estilo dentro do documento. Folhas de estilo com maior precedência podem anular as com menor precedência.

Se você quiser baixar a folha de estilo, mas não inseri-la no documento imediatamente, use [`preload`](/reference/react-dom/preload) em vez disso.

<Solution />

</Recipes>

### Pré-inicializando em um manipulador de eventos {/*preiniting-in-an-event-handler*/}

Chame `preinit` em um manipulador de eventos antes de fazer a transição para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```