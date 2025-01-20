---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

`'use server'` é necessário apenas se você estiver [usando Componentes de Servidor React](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou construindo uma biblioteca compatível com eles.

</Canary>


<Intro>

`'use server'` marca funções do lado do servidor que podem ser chamadas a partir de código do lado do cliente.

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `'use server'` {/*use-server*/}

Adicione `'use server'` no início do corpo de uma função assíncrona para marcar a função como chamável pelo cliente. Chamamos essas funções de _Ações do Servidor_.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Ao chamar uma Ação do Servidor no cliente, isso fará uma solicitação de rede ao servidor que inclui uma cópia serializada de quaisquer argumentos passados. Se a Ação do Servidor retornar um valor, esse valor será serializado e retornado ao cliente.

Em vez de marcar individualmente funções com `'use server'`, você pode adicionar a diretiva ao topo de um arquivo para marcar todas as exportações dentro desse arquivo como Ações do Servidor que podem ser usadas em qualquer lugar, incluindo importadas no código do cliente.

#### Ressalvas {/*caveats*/}
* `'use server'` deve estar no início de sua função ou módulo; acima de qualquer outro código, incluindo imports (comentários acima das diretivas são OK). Devem ser escritas com aspas simples ou duplas, não com crase.
* `'use server'` só pode ser usado em arquivos do lado do servidor. As Ações do Servidor resultantes podem ser passadas para Componentes do Cliente através de props. Veja os tipos suportados para [serialização](#serializable-parameters-and-return-values).
* Para importar uma Ação do Servidor do [código do cliente](/reference/rsc/use-client), a diretiva deve ser usada em nível de módulo.
* Como as chamadas de rede subjacentes são sempre assíncronas, `'use server'` só pode ser usado em funções assíncronas.
* Sempre trate os argumentos das Ações do Servidor como entrada não confiável e autorize quaisquer mutações. Veja [considerações de segurança](#security).
* As Ações do Servidor devem ser chamadas em uma [Transição](/reference/react/useTransition). Ações do Servidor passadas para [`<form action>`](/reference/react-dom/components/form#props) ou [`formAction`](/reference/react-dom/components/input#props) serão automaticamente chamadas em uma transição.
* As Ações do Servidor são projetadas para mutações que atualizam o estado do lado do servidor; não são recomendadas para busca de dados. Assim, frameworks que implementam Ações do Servidor geralmente processam uma ação por vez e não têm uma maneira de armazenar em cache o valor de retorno.

### Considerações de segurança {/*security*/}

Os argumentos das Ações do Servidor são totalmente controlados pelo cliente. Para segurança, sempre trate-os como entrada não confiável e certifique-se de validar e escapar os argumentos conforme apropriado.

Em qualquer Ação do Servidor, certifique-se de validar se o usuário logado tem permissão para executar essa ação.

<Wip>

Para evitar o envio de dados sensíveis de uma Ação do Servidor, existem APIs experimentais de contaminação para impedir valores e objetos exclusivos de serem passados para o código do cliente.

Veja [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) e [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Argumentos e valores de retorno serializáveis {/*serializable-parameters-and-return-values*/}

Conforme o código do cliente chama a Ação do Servidor pela rede, quaisquer argumentos passados precisarão ser serializáveis.

Aqui estão os tipos suportados para os argumentos da Ação do Servidor:

* Primitivos
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), apenas símbolos registrados no registro global de Símbolos via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iteráveis contendo valores serializáveis
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) e [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* instâncias de [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [objetos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) simples: aqueles criados com [inicializadores de objeto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), com propriedades serializáveis
* Funções que são Ações do Servidor
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notavelmente, esses não são suportados:
* Elementos React, ou [JSX](/learn/writing-markup-with-jsx)
* Funções, incluindo funções de componente ou qualquer outra função que não seja uma Ação do Servidor
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objetos que são instâncias de qualquer classe (exceto os built-ins mencionados) ou objetos com [um protótipo nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Símbolos que não estão registrados globalmente, ex. `Symbol('meu novo símbolo')`

Os valores de retorno serializáveis suportados são os mesmos que [props serializáveis](/reference/rsc/use-client#passing-props-from-server-to-client-components) para um componente de cliente de limite.


## Uso {/*usage*/}

### Ações do Servidor em formulários {/*server-actions-in-forms*/}

O caso de uso mais comum das Ações do Servidor será chamar funções do servidor que mutam dados. No navegador, o [elemento de formulário HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) é a abordagem tradicional para um usuário enviar uma mutação. Com Componentes de Servidor React, o React introduz suporte em primeira classe para Ações do Servidor em [formulários](/reference/react-dom/components/form).

Aqui está um formulário que permite a um usuário solicitar um nome de usuário.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Solicitar</button>
    </form>
  );
}
```

Neste exemplo, `requestUsername` é uma Ação do Servidor passada para um `<form>`. Quando um usuário envia este formulário, há uma solicitação de rede para a função do servidor `requestUsername`. Ao chamar uma Ação do Servidor em um formulário, o React fornecerá o <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> do formulário como o primeiro argumento para a Ação do Servidor.

Ao passar uma Ação do Servidor para a ação do formulário, o React pode [melhorar progressivamente](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) o formulário. Isso significa que os formulários podem ser enviados antes que o pacote JavaScript seja carregado.

#### Tratamento de valores de retorno em formulários {/*handling-return-values*/}

No formulário de solicitação de nome de usuário, pode haver a chance de que um nome de usuário não esteja disponível. `requestUsername` deve nos informar se falha ou não.

Para atualizar a UI com base no resultado de uma Ação do Servidor, enquanto suporta melhoria progressiva, use [`useActionState`](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'bem-sucedido';
  }
  return 'falhou';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/d');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Solicitar</button>
      </form>
      <p>Última solicitação de envio retornou: {state}</p>
    </>
  );
}
```

Observe que assim como a maioria dos Hooks, `useActionState` só pode ser chamado em <CodeStep step={1}>[código do cliente](/reference/rsc/use-client)</CodeStep>.

### Chamando uma Ação do Servidor fora de `<form>` {/*calling-a-server-action-outside-of-form*/}

As Ações do Servidor são endpoints de servidor expostos e podem ser chamadas em qualquer lugar no código do cliente.

Ao usar uma Ação do Servidor fora de um [formulário](/reference/react-dom/components/form), chame a Ação do Servidor em uma [Transição](/reference/react/useTransition), que permite exibir um indicador de carregamento, mostrar [atualizações de estado otimista](/reference/react/useOptimistic) e lidar com erros inesperados. Os formulários envolverão automaticamente as Ações do Servidor em transições.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total de Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Curtir</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Para ler um valor de retorno de uma Ação do Servidor, você precisará usar `await` na promessa retornada.