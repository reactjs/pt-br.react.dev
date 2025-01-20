---
title: "Como Atualizar para o React 18"
author: Rick Hanlon
date: 2022/03/08
description: Como compartilhamos na postagem de lançamento, o React 18 introduz recursos alimentados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicativos existentes. Neste artigo, iremos guiá-lo pelos passos para atualizar para o React 18.
---

8 de março de 2022 por [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Como compartilhamos na [postagem de lançamento](/blog/2022/03/29/react-v18), o React 18 introduz recursos alimentados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicativos existentes. Neste artigo, iremos guiá-lo pelos passos para atualizar para o React 18.

Por favor, [relate quaisquer problemas](https://github.com/facebook/react/issues/new/choose) que você encontrar enquanto atualiza para o React 18.

</Intro>

<Note>

Para usuários do React Native, o React 18 será incluído em uma versão futura do React Native. Isso ocorre porque o React 18 depende da Nova Arquitetura do React Native para se beneficiar das novas capacidades apresentadas neste blogpost. Para mais informações, veja a [keynote do React Conf aqui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

---

## Instalando {/*installing*/}

Para instalar a versão mais recente do React:

```bash
npm install react react-dom
```

Ou se você estiver usando yarn:

```bash
yarn add react react-dom
```

## Atualizações para APIs de Renderização do Cliente {/*updates-to-client-rendering-apis*/}

Quando você instalar o React 18 pela primeira vez, verá um aviso no console:

<ConsoleBlock level="error">

ReactDOM.render não é mais suportado no React 18. Use createRoot em seu lugar. Até você mudar para a nova API, seu aplicativo se comportará como se estivesse executando o React 17. Saiba mais: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

O React 18 introduz uma nova API de raiz que fornece melhor ergonomia para gerenciar raízes. A nova API de raiz também habilita o novo renderizador concorrente, que permite que você opte por funcionalidades concorrentes.

```js
// Antes
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// Depois
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) se você usar TypeScript
root.render(<App tab="home" />);
```

Nós também mudamos `unmountComponentAtNode` para `root.unmount`:

```js
// Antes
unmountComponentAtNode(container);

// Depois
root.unmount();
```

Nós também removemos o callback de render, uma vez que geralmente não tem o resultado esperado quando utilizado com Suspense:

```js
// Antes
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('renderizado');
});

// Depois
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('renderizado');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

Não há uma substituição um-para-um para a antiga API de callback de renderização — depende do seu caso de uso. Veja a postagem do grupo de trabalho sobre [Substituindo render por createRoot](https://github.com/reactwg/react-18/discussions/5) para mais informações.

</Note>

Por fim, se seu aplicativo usa renderização do lado do servidor com hidratação, atualize `hydrate` para `hydrateRoot`:

```js
// Antes
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// Depois
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Ao contrário do createRoot, você não precisa de uma chamada separada root.render() aqui.
```

Para mais informações, veja a [discussão do grupo de trabalho aqui](https://github.com/reactwg/react-18/discussions/5).

<Note>

**Se seu aplicativo não funcionar após a atualização, verifique se ele está envolto em `<StrictMode>`.** [O Modo Estrito ficou mais rigoroso no React 18](#updates-to-strict-mode), e nem todos os seus componentes podem ser resilientes às novas verificações que ele adiciona no modo de desenvolvimento. Se remover o Modo Estrito consertar seu aplicativo, você pode removê-lo durante a atualização, e depois adicioná-lo de volta (ou no topo ou para uma parte da árvore) após corrigir os problemas que ele aponta.

</Note>

## Atualizações para APIs de Renderização do Servidor {/*updates-to-server-rendering-apis*/}

Nesta versão, estamos reformulando nossas APIs `react-dom/server` para oferecer suporte total ao Suspense no servidor e ao SSR em Streaming. Como parte dessas mudanças, estamos descontinuando a antiga API de streaming de Node, que não oferece suporte ao streaming de Suspense incremental no servidor.

Usar esta API agora irá gerar aviso:

* `renderToNodeStream`: **Descontinuado ⛔️️**

Em vez disso, para streaming em ambientes Node, use:
* `renderToPipeableStream`: **Novo ✨**

Nós também estamos introduzindo uma nova API para suportar streaming SSR com Suspense para ambientes de runtime modernos, como Deno e Cloudflare workers:
* `renderToReadableStream`: **Novo ✨**

As seguintes APIs continuarão funcionando, mas com suporte limitado para Suspense:
* `renderToString`: **Limitado** ⚠️
* `renderToStaticMarkup`: **Limitado** ⚠️

Por fim, esta API continuará funcionando para a renderização de e-mails:
* `renderToStaticNodeStream`

Para mais informações sobre as mudanças nas APIs de renderização do servidor, veja a postagem do grupo de trabalho sobre [Atualizando para o React 18 no servidor](https://github.com/reactwg/react-18/discussions/22), um [aprofundamento sobre a nova Arquitetura de Suspense SSR](https://github.com/reactwg/react-18/discussions/37), e a palestra de [Shaundai Person](https://twitter.com/shaundai) sobre [Streaming Server Rendering com Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) na React Conf 2021.

## Atualizações nas definições do TypeScript {/*updates-to-typescript-definitions*/}

Se seu projeto usa TypeScript, você precisará atualizar suas dependências `@types/react` e `@types/react-dom` para as versões mais recentes. Os novos tipos são mais seguros e capturam problemas que costumavam ser ignorados pelo verificador de tipos. A mudança mais notável é que a prop `children` agora precisa ser listada explicitamente ao definir props, por exemplo:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Veja a [pull request de tipagens do React 18](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) para uma lista completa de mudanças apenas de tipo. Ela vincula a correções de exemplo em tipos de bibliotecas para que você possa ver como ajustar seu código. Você pode usar o [script de migração automatizado](https://github.com/eps1lon/types-react-codemod) para ajudar a portar seu código de aplicativo para as novas e mais seguras tipagens mais rapidamente.

Se você encontrar um bug nas tipagens, por favor, [registre um problema](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) no repositório DefinitelyTyped.

## Agrupamento Automático {/*automatic-batching*/}

O React 18 adiciona melhorias de desempenho de forma nativa fazendo mais agrupamento por padrão. O agrupamento é quando o React agrupa várias atualizações de estado em uma única re-renderização para melhor desempenho. Antes do React 18, apenas atualizações dentro de manipuladores de eventos do React eram agrupadas. Atualizações dentro de promessas, setTimeout, manipuladores de eventos nativos ou qualquer outro evento não eram agrupadas no React por padrão:

```js
// Antes do React 18, apenas eventos do React eram agrupados

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React apenas re-renderizará uma vez ao final (isso é agrupamento!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React renderizará duas vezes, uma vez para cada atualização de estado (sem agrupamento)
}, 1000);
```

A partir do React 18 com `createRoot`, todas as atualizações serão automaticamente agrupadas, não importa de onde elas se origina. Isso significa que atualizações dentro de timeouts, promessas, manipuladores de eventos nativos ou qualquer outro evento serão agrupadas da mesma forma que atualizações dentro de eventos do React:

```js
// Depois do React 18, atualizações dentro de timeouts, promessas,
// manipuladores de eventos nativos ou qualquer outro evento são agrupadas.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React apenas re-renderizará uma vez ao final (isso é agrupamento!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React apenas re-renderizará uma vez ao final (isso é agrupamento!)
}, 1000);
```

Esta é uma mudança significativa, mas esperamos que isso resulte em menos trabalho de renderização e, portanto, melhor desempenho em seus aplicativos. Para optar por não usar agrupamento automático, você pode usar `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // O React já atualizou o DOM até agora
  flushSync(() => {
    setFlag(f => !f);
  });
  // O React já atualizou o DOM até agora
}
```

Para mais informações, veja o [aprofundamento em agrupamento automático](https://github.com/reactwg/react-18/discussions/21).

## Novas APIs para Bibliotecas {/*new-apis-for-libraries*/}

No Grupo de Trabalho do React 18, trabalhamos com mantenedores de bibliotecas para criar novas APIs necessárias para oferecer suporte à renderização concorrente para casos de uso específicos em áreas como estilos e armazenamento externo. Para suportar o React 18, algumas bibliotecas podem precisar mudar para uma das seguintes APIs:

* `useSyncExternalStore` é um novo Hook que permite aos armazenamentos externos suportar leituras concorrentes forçando as atualizações do armazenamento a serem síncronas. Esta nova API é recomendada para qualquer biblioteca que integre com o estado externo ao React. Para mais informações, veja a [postagem de visão geral do useSyncExternalStore](https://github.com/reactwg/react-18/discussions/70) e [detalhes da API useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` é um novo Hook que permite que bibliotecas CSS-in-JS abordem problemas de desempenho relacionados à injeção de estilos na renderização. A menos que você já tenha construído uma biblioteca CSS-in-JS, não esperamos que você a use. Este Hook será executado após a mutação do DOM, mas antes que os efeitos de layout leiam o novo layout. Isso resolve um problema que já existe no React 17 e versões anteriores, mas é ainda mais importante no React 18 porque o React cede ao navegador durante a renderização concorrente, dando a ele a chance de recalcular o layout. Para mais informações, veja o [Guia de Atualização de Bibliotecas para `<style>`](https://github.com/reactwg/react-18/discussions/110).

O React 18 também introduz novas APIs para renderização concorrente, como `startTransition`, `useDeferredValue` e `useId`, que compartilhamos mais na [postagem de lançamento](/blog/2022/03/29/react-v18).

## Atualizações para Modo Estrito {/*updates-to-strict-mode*/}

No futuro, gostaríamos de adicionar um recurso que permite ao React adicionar e remover seções da IU enquanto preserva o estado. Por exemplo, quando um usuário muda de tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React desmontaria e remontaria árvores usando o mesmo estado de componente de antes.

Esse recurso dará ao React melhor desempenho de forma nativa, mas requer que os componentes sejam resilientes a efeitos sendo montados e destruídos várias vezes. A maioria dos efeitos funcionará sem quaisquer alterações, mas alguns efeitos presumem que são montados ou destruídos apenas uma vez.

Para ajudar a destacar esses problemas, o React 18 introduz uma nova verificação específica para desenvolvimento no Modo Estrito. Esta nova verificação desmontará e remontará automaticamente cada componente, sempre que um componente montar pela primeira vez, restaurando o estado anterior na segunda montagem.

Antes dessa mudança, o React montaria o componente e criaria os efeitos:

```
* O React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
```

Com o Modo Estrito no React 18, o React simulará o desmontagem e remontagem do componente no modo de desenvolvimento:

```
* O React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
* O React simula o desmontagem do componente.
    * Efeitos de layout são destruídos.
    * Efeitos são destruídos.
* O React simula a montagem do componente com o estado anterior.
    * Código de configuração de efeito de layout é executado
    * Código de configuração de efeito é executado
```

Para mais informações, veja as postagens do Grupo de Trabalho sobre [Adicionar Estado Reutilizável ao StrictMode](https://github.com/reactwg/react-18/discussions/19) e [Como suportar Estado Reutilizável em Efeitos](https://github.com/reactwg/react-18/discussions/18).

## Configurando Seu Ambiente de Testes {/*configuring-your-testing-environment*/}

Quando você atualizar seus testes para usar `createRoot`, pode ver este aviso no console de testes:

<ConsoleBlock level="error">

O ambiente de testes atual não está configurado para suportar act(...)

</ConsoleBlock>

Para corrigir isso, defina `globalThis.IS_REACT_ACT_ENVIRONMENT` como `true` antes de executar seu teste:

```js
// No seu arquivo de configuração de teste
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

O propósito da flag é informar ao React que ele está sendo executado em um ambiente semelhante a um teste unitário. O React irá registrar avisos úteis se você esquecer de envolver uma atualização com `act`.

Você também pode definir a flag como `false` para informar ao React que `act` não é necessário. Isso pode ser útil para testes de ponta a ponta que simulam um ambiente completo de navegador.

Eventualmente, esperamos que as bibliotecas de testes configurem isso automaticamente para você. Por exemplo, a [próxima versão da React Testing Library tem suporte embutido ao React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) sem qualquer configuração adicional.

[Mais informações sobre a API de teste `act` e mudanças relacionadas](https://github.com/reactwg/react-18/discussions/102) estão disponíveis no grupo de trabalho.

## Removendo Suporte para Internet Explorer {/*dropping-support-for-internet-explorer*/}

Nesta versão, o React está removendo suporte para o Internet Explorer, que [sairá de suporte em 15 de junho de 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Estamos fazendo essa mudança agora porque novos recursos introduzidos no React 18 são construídos usando recursos modernos de navegador, como microtasks, que não podem ser adequadamente polifilados no IE.

Se você precisar suportar o Internet Explorer, recomendamos que você permaneça com o React 17.

## Descontinuações {/*deprecations*/}

* `react-dom`: `ReactDOM.render` foi descontinuado. Usá-lo irá gerar um aviso e executar seu aplicativo no modo do React 17.
* `react-dom`: `ReactDOM.hydrate` foi descontinuado. Usá-lo irá gerar um aviso e executar seu aplicativo no modo do React 17.
* `react-dom`: `ReactDOM.unmountComponentAtNode` foi descontinuado.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` foi descontinuado.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` foi descontinuado.

## Outras Mudanças Significativas {/*other-breaking-changes*/}

* **Consistência no tempo do useEffect**: O React agora sempre esvazia sincronicamente funções de efeito se a atualização foi disparada durante um evento de entrada discreta do usuário, como um clique ou um evento de keydown. Anteriormente, o comportamento não era sempre previsível ou consistente.
* **Erros de hidratação mais rigorosos**: Mismatches de hidratação devido a conteúdo textual faltante ou extra agora são tratados como erros em vez de avisos. O React não tentará mais "consertar" nós individuais inserindo ou excluindo um nó no cliente em uma tentativa de corresponder à marcação do servidor e reverterá para a renderização do cliente até o limite `<Suspense>` mais próximo na árvore. Isso garante que a árvore hidratada seja consistente e evita potenciais buracos de privacidade e segurança que podem ser causados por mismatches de hidratação.
* **Árvores de Suspense sempre consistentes:** Se um componente suspender antes de ser totalmente adicionado à árvore, o React não o adicionará à árvore em um estado incompleto ou disparará seus efeitos. Em vez disso, o React descartará completamente a nova árvore, aguardará a operação assíncrona terminar e, em seguida, tentará renderizar novamente do zero. O React irá renderizar a tentativa de nova renderização de forma concorrente, e sem bloquear o navegador.
* **Efeitos de Layout com Suspense**: Quando uma árvore re-suspende e reverte para um fallback, o React agora limpará os efeitos de layout e os recreará quando o conteúdo dentro do limite for exibido novamente. Isso corrige um problema que impedia bibliotecas de componentes de medir corretamente o layout quando usadas com Suspense.
* **Novos Requisitos de Ambiente JS**: O React agora depende de recursos modernos de navegadores, incluindo `Promise`, `Symbol` e `Object.assign`. Se você suporta navegadores e dispositivos mais antigos, como o Internet Explorer, que não fornecem recursos modernos de navegador nativamente ou têm implementações não conformes, considere incluir um polifil global em sua aplicação empacotada.

## Outras Mudanças Notáveis {/*other-notable-changes*/}

### React {/*react*/}

* **Componentes podem agora renderizar `undefined`:** O React não avisa mais se você retornar `undefined` de um componente. Isso torna os valores de retorno de componentes permitidos consistentes com valores que são permitidos no meio de uma árvore de componentes. Sugerimos usar um linter para evitar erros como esquecer uma declaração `return` antes do JSX.
* **Nos testes, avisos `act` agora são opt-in:** Se você estiver executando testes de ponta a ponta, os avisos `act` são desnecessários. Introduzimos um mecanismo de [opt-in](https://github.com/reactwg/react-18/discussions/102) para que você possa habilitá-los apenas para testes unitários onde são úteis e benéficos.
* **Sem aviso sobre `setState` em componentes desmontados:** Anteriormente, o React avisava sobre vazamentos de memória quando você chamava `setState` em um componente desmontado. Este aviso foi adicionado para assinaturas, mas as pessoas principalmente o encontram em cenários onde definir o estado é aceitável, e soluções alternativas tornam o código pior. Nós [removemos](https://github.com/facebook/react/pull/22114) esse aviso.
* **Sem supressão de logs do console:** Quando você usa o Modo Estrito, o React renderiza cada componente duas vezes para ajudá-lo a encontrar efeitos colaterais inesperados. No React 17, suprimimos logs do console para uma das duas renderizações para facilitar a leitura dos logs. Em resposta ao [feedback da comunidade](https://github.com/facebook/react/issues/21783) sobre isso ser confuso, removemos a supressão. Em vez disso, se você tiver o React DevTools instalado, os logs da segunda renderização serão exibidos em cinza, e haverá uma opção (desativada por padrão) para suprimir completamente.
* **Uso de memória aprimorado:** O React agora limpa mais campos internos durante o desmontagem, tornando o impacto de vazamentos de memória não corrigidos que podem existir no seu código de aplicativo menos severo.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Não gerará mais erros ao suspender no servidor. Em vez disso, irá emitir o HTML de fallback para o limite `<Suspense>` mais próximo e, em seguida, tentará renderizar o mesmo conteúdo no cliente. Ainda é recomendável que você mude para uma API de streaming, como `renderToPipeableStream` ou `renderToReadableStream`, em vez disso.
* **`renderToStaticMarkup`:** Não gerará mais erros ao suspender no servidor. Em vez disso, irá emitir o HTML de fallback para o limite `<Suspense>` mais próximo.

## Changelog {/*changelog*/}

Você pode ver o [changelog completo aqui](https://github.com/facebook/react/blob/main/CHANGELOG.md).