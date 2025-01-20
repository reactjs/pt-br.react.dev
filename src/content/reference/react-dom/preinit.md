---
title: preinit
canary: true
---

<Canary>

A função `preinit` atualmente está disponível apenas nos canais Canary e experimental do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

Os [frameworks baseados em React](/learn/start-a-new-react-project) frequentemente lidam com o carregamento de recursos para você, então você pode não precisar chamar esta API você mesmo. Consulte a documentação do seu framework para detalhes.

</Note>

<Intro>

`preinit` permite que você busque e avalie ansiosamente uma folha de estilo ou script externo.

```js
preinit("https://example.com/script.js", {as: "style"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Para preinit um script ou folha de estilo, chame a função `preinit` de `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Veja mais exemplos abaixo.](#usage)

A função `preinit` fornece ao navegador uma dica de que ele deve começar a baixar e executar o recurso dado, o que pode economizar tempo. Scripts que você `preinit` são executados quando terminam de ser baixados. Folhas de estilo que você preinit são inseridas no documento, fazendo com que tenham efeito imediatamente.

#### Parameters {/*parameters*/}

* `href`: uma string. A URL do recurso que você deseja baixar e executar.
* `options`: um objeto. Ele contém as seguintes propriedades:
  *  `as`: uma string obrigatória. O tipo de recurso. Seus valores possíveis são `script` e `style`.
  * `precedence`: uma string. Obrigatória com folhas de estilo. Indica onde inserir a folha de estilo em relação a outras. Folhas de estilo com maior precedência podem substituir aquelas com menor precedência. Os valores possíveis são `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser utilizada. Seus valores possíveis são `anonymous` e `use-credentials`. É obrigatória quando `as` está definido como `"fetch"`.
  *  `integrity`: uma string. Um hash criptográfico do recurso, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: uma string. Um [nonce criptográfico para permitir o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo estrita.
  *  `fetchPriority`: uma string. Sugere uma prioridade relativa para buscar o recurso. Os valores possíveis são `auto` (o padrão), `high` e `low`.

#### Returns {/*returns*/}

`preinit` não retorna nada.

#### Caveats {/*caveats*/}

* Chamadas múltiplas para `preinit` com o mesmo `href` têm o mesmo efeito que uma única chamada.
* No navegador, você pode chamar `preinit` em qualquer situação: enquanto renderiza um componente, em um Efeito, em um manipulador de eventos etc.
* Na renderização do lado do servidor ou ao renderizar Componentes do Servidor, `preinit` só tem efeito se você chamá-lo enquanto renderiza um componente ou em um contexto assíncrono originado da renderização de um componente. Quaisquer outras chamadas serão ignoradas.

---

## Usage {/*usage*/}

### Preiniting when rendering {/*preiniting-when-rendering*/}

Chame `preinit` ao renderizar um componente se você souber que ele ou seus filhos usarão um recurso específico e você estiver OK com o recurso sendo avaliado e, portanto, entrando em vigor imediatamente após ser baixado.

<Recipes titleText="Exemplos de preiniting">

#### Preiniting an external script {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Se você quiser que o navegador baixe o script, mas não o execute imediatamente, use [`preload`](/reference/react-dom/preload) em vez disso. Se você quiser carregar um módulo ESM, use [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preiniting a stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

A opção `precedence`, que é obrigatória, permite controlar a ordem das folhas de estilo dentro do documento. Folhas de estilo com maior precedência podem sobrepor aquelas com menor precedência.

Se você quiser baixar a folha de estilo, mas não inseri-la no documento imediatamente, use [`preload`](/reference/react-dom/preload) em vez disso.

<Solution />

</Recipes>

### Preiniting in an event handler {/*preiniting-in-an-event-handler*/}

Chame `preinit` em um manipulador de eventos antes de fazer a transição para uma página ou estado onde recursos externos serão necessários. Isso inicia o processo mais cedo do que se você o chamasse durante a renderização da nova página ou estado.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Iniciar Assistente</button>
  );
}
```