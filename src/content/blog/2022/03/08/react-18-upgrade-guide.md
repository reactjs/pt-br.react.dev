---
title: "Como Fazer Upgrade para o React 18"
author: Rick Hanlon
date: 2022/03/08
description: Como compartilhamos na postagem de lançamento, o React 18 introduz recursos alimentados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicações existentes. Neste post, vamos orientá-lo pelas etapas para fazer upgrade para o React 18.
---

8 de março de 2022 por [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Como compartilhamos na [postagem de lançamento](/blog/2022/03/29/react-v18), o React 18 introduz recursos alimentados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicações existentes. Neste post, vamos orientá-lo pelas etapas para fazer upgrade para o React 18.

Por favor, [relate quaisquer problemas](https://github.com/facebook/react/issues/new/choose) que encontrar ao fazer upgrade para o React 18.

</Intro>

<Note>

Para usuários do React Native, o React 18 será incluído em uma versão futura do React Native. Isso ocorre porque o React 18 depende da Nova Arquitetura do React Native para beneficiar-se das novas capacidades apresentadas neste blogpost. Para mais informações, veja a [keynote do React Conf aqui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

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

## Atualizações nas APIs de Renderização do Cliente {/*updates-to-client-rendering-apis*/}

Quando você instalar o React 18 pela primeira vez, verá um aviso no console:

<ConsoleBlock level="error">

ReactDOM.render não é mais suportado no React 18. Use createRoot em vez disso. Até você mudar para a nova API, seu aplicativo se comportará como se estivesse executando o React 17. Saiba mais: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

O React 18 introduz uma nova API raiz que fornece melhor ergonomia para gerenciar raízes. A nova API raiz também permite o novo renderizador concorrente, que permite que você opte por recursos concorrentes.

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

Também mudamos `unmountComponentAtNode` para `root.unmount`:

```js
// Antes
unmountComponentAtNode(container);

// Depois
root.unmount();
```

Também removemos o callback de renderização, uma vez que geralmente não tem o resultado esperado ao usar Suspense:

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

Não há um substituto exato para a antiga API de callback de renderização — depende do seu caso de uso. Veja a postagem do grupo de trabalho sobre [Substituindo render por createRoot](https://github.com/reactwg/react-18/discussions/5) para mais informações.

</Note>

Finalmente, se seu aplicativo usar renderização do lado do servidor com hidratação, atualize `hydrate` para `hydrateRoot`:

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

**Se seu aplicativo não funcionar após o upgrade, verifique se está encapsulado em `<StrictMode>`.** O [Modo Estrito ficou mais rigoroso no React 18](#updates-to-strict-mode), e nem todos os seus componentes podem ser resilientes às novas verificações que ele adiciona no modo de desenvolvimento. Se remover o Modo Estrito corrigir seu aplicativo, você pode removê-lo durante o upgrade e depois adicioná-lo novamente (seja no topo ou para uma parte da árvore) após corrigir os problemas que ele está apontando.

</Note>

## Atualizações nas APIs de Renderização do Servidor {/*updates-to-server-rendering-apis*/}

Nesta versão, estamos reformulando nossas APIs `react-dom/server` para suportar totalmente Suspense no servidor e Streaming SSR. Como parte dessas mudanças, estamos descontinuando a antiga API de streaming do Node, que não suporta streaming incremental de Suspense no servidor.

Usar esta API agora avisará:

* `renderToNodeStream`: **Descontinuado ⛔️️**

Em vez disso, para streaming em ambientes Node, use:
* `renderToPipeableStream`: **Novo ✨**

Também estamos introduzindo uma nova API para suportar streaming SSR com Suspense em ambientes de execução moderna, como Deno e Cloudflare workers:
* `renderToReadableStream`: **Novo ✨**

As seguintes APIs continuarão funcionando, mas com suporte limitado para Suspense:
* `renderToString`: **Limitado** ⚠️
* `renderToStaticMarkup`: **Limitado** ⚠️

Finalmente, esta API continuará a funcionar para renderização de e-mails:
* `renderToStaticNodeStream`

Para mais informações sobre as mudanças nas APIs de renderização do servidor, veja a postagem do grupo de trabalho sobre [Upgrade para o React 18 no servidor](https://github.com/reactwg/react-18/discussions/22), uma [análise profunda sobre a nova Arquitetura SSR do Suspense](https://github.com/reactwg/react-18/discussions/37), e a palestra de [Shaundai Person](https://twitter.com/shaundai) sobre [Streaming Server Rendering com Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) na React Conf 2021.

## Atualizações nas definições do TypeScript {/*updates-to-typescript-definitions*/}

Se seu projeto usa TypeScript, você precisará atualizar suas dependências `@types/react` e `@types/react-dom` para as versões mais recentes. Os novos tipos são mais seguros e detectam problemas que costumavam ser ignorados pelo verificador de tipos. A mudança mais notável é que a prop `children` agora precisa ser listada explicitamente ao definir props, por exemplo:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Veja a [pull request de tipagens do React 18](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) para uma lista completa das mudanças apenas nas tipagens. Ela liga a correções de exemplo nas tipagens de biblioteca para que você possa ver como ajustar seu código. Você pode usar o [script de migração automatizado](https://github.com/eps1lon/types-react-codemod) para ajudar a portar o código do seu aplicativo para as novas e mais seguras tipagens mais rapidamente.

Se você encontrar um bug nas tipagens, por favor, [registre um problema](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) no repositório DefinitelyTyped.

## Agrupamento Automático {/*automatic-batching*/}

O React 18 adiciona melhorias de desempenho prontas para uso ao fazer mais agrupamento por padrão. Agrupamento é quando o React agrupa várias atualizações de estado em um único re-renderizador para melhor desempenho. Antes do React 18, agrupávamos apenas atualizações dentro dos manipuladores de eventos do React. Atualizações dentro de promessas, setTimeout, manipuladores de eventos nativos ou qualquer outro evento não eram agrupadas no React por padrão:

```js
// Antes do React 18, apenas eventos do React eram agrupados

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React re-renderizará apenas uma vez no final (isso é agrupamento!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React re-renderizará duas vezes, uma para cada atualização de estado (sem agrupamento)
}, 1000);
```

A partir do React 18 com `createRoot`, todas as atualizações serão agrupadas automaticamente, não importa de onde elas se originem. Isso significa que atualizações dentro de timeouts, promessas, manipuladores de eventos nativos ou qualquer outro evento serão agrupadas da mesma forma que atualizações dentro de eventos do React:

```js
// Depois do React 18, atualizações dentro de timeouts, promessas,
// manipuladores de eventos nativos ou qualquer outro evento são agrupadas.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React re-renderizará apenas uma vez no final (isso é agrupamento!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React re-renderizará apenas uma vez no final (isso é agrupamento!)
}, 1000);
```

Esta é uma mudança significativa, mas esperamos que isso resulte em menos trabalho de renderização e, portanto, melhor desempenho em suas aplicações. Para optar por não utilizar o agrupamento automático, você pode usar `flushSync`:

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

Para mais informações, veja a [análise profunda do agrupamento automático](https://github.com/reactwg/react-18/discussions/21).

## Novas APIs para Bibliotecas {/*new-apis-for-libraries*/}

No Grupo de Trabalho do React 18, trabalhamos com mantenedores de bibliotecas para criar novas APIs necessárias para suportar renderização concorrente para casos de uso específicos em áreas como estilos e armazenamentos externos. Para suportar o React 18, algumas bibliotecas podem precisar mudar para uma das seguintes APIs:

* `useSyncExternalStore` é um novo Hook que permite que armazenamentos externos suportem leituras concorrentes, forçando atualizações para o armazenamento a serem síncronas. Esta nova API é recomendada para qualquer biblioteca que integre com estado externo ao React. Para mais informações, veja a [postagem de visão geral do useSyncExternalStore](https://github.com/reactwg/react-18/discussions/70) e [detalhes da API do useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` é um novo Hook que permite que bibliotecas CSS-in-JS abordem problemas de desempenho ao injetar estilos durante a renderização. A menos que você já tenha construído uma biblioteca CSS-in-JS, não esperamos que você use isso. Este Hook será executado após o DOM ser mutado, mas antes que os efeitos de layout leiam o novo layout. Isso resolve um problema que já existe no React 17 e abaixo, mas é ainda mais importante no React 18 porque o React cede ao navegador durante a renderização concorrente, dando uma chance de recalcular o layout. Para mais informações, veja o [Guia de Upgrade da Biblioteca para `<style>`](https://github.com/reactwg/react-18/discussions/110).

O React 18 também introduz novas APIs para renderização concorrente, como `startTransition`, `useDeferredValue` e `useId`, sobre as quais compartilhamos mais na [postagem de lançamento](/blog/2022/03/29/react-v18).

## Atualizações ao Modo Estrito {/*updates-to-strict-mode*/}

No futuro, gostaríamos de adicionar um recurso que permita ao React adicionar e remover seções da UI mantendo o estado. Por exemplo, quando um usuário clica fora de uma tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React desmonte e remonte árvores usando o mesmo estado de componente que antes.

Esse recurso dará ao React melhor desempenho pronto para uso, mas requer que os componentes sejam resilientes a efeitos sendo montados e destruídos várias vezes. A maioria dos efeitos funcionará sem alterações, mas alguns efeitos assumem que são montados ou destruídos apenas uma vez.

Para ajudar a identificar esses problemas, o React 18 introduz uma nova verificação exclusiva para desenvolvimento no Modo Estrito. Essa nova verificação desmontará e remontará automaticamente cada componente, sempre que um componente for montado pela primeira vez, restaurando o estado anterior na segunda montagem.

Antes dessa mudança, o React montava o componente e criava os efeitos:

```
* O React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
```

Com o Modo Estrito no React 18, o React irá simular o desmonte e a remontagem do componente no modo de desenvolvimento:

```
* O React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
* O React simula o desmonte do componente.
    * Efeitos de layout são destruídos.
    * Efeitos são destruídos.
* O React simula a montagem do componente com o estado anterior.
    * O código de configuração de efeitos de layout é executado
    * O código de configuração de efeitos é executado
```

Para mais informações, veja as postagens do Grupo de Trabalho sobre [Adicionando Estado Reutilizável ao StrictMode](https://github.com/reactwg/react-18/discussions/19) e [Como suportar Estado Reutilizável em Efeitos](https://github.com/reactwg/react-18/discussions/18).

## Configurando seu Ambiente de Teste {/*configuring-your-testing-environment*/}

Quando você atualizar seus testes para usar `createRoot`, pode ver este aviso no console do seu teste:

<ConsoleBlock level="error">

O ambiente de teste atual não está configurado para suportar act(...)

</ConsoleBlock>

Para corrigir isso, defina `globalThis.IS_REACT_ACT_ENVIRONMENT` como `true` antes de executar seu teste:

```js
// No seu arquivo de configuração de teste
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

O objetivo da bandeira é informar ao React que está sendo executado em um ambiente semelhante a testes unitários. O React irá registrar avisos úteis caso você esqueça de encapsular uma atualização com `act`.

Você também pode definir a bandeira como `false` para informar ao React que `act` não é necessário. Isso pode ser útil para testes de ponta a ponta que simulam um ambiente completo de navegador.

Eventualmente, esperamos que as bibliotecas de teste configure isso para você automaticamente. Por exemplo, a [próxima versão da React Testing Library tem suporte embutido para o React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) sem nenhuma configuração adicional.

[Mais informações sobre a API de teste `act` e mudanças relacionadas](https://github.com/reactwg/react-18/discussions/102) estão disponíveis no grupo de trabalho.

## Removendo Suporte para Internet Explorer {/*dropping-support-for-internet-explorer*/}

Nesta versão, o React está removendo o suporte para o Internet Explorer, que está [sair de suporte em 15 de junho de 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Estamos fazendo essa mudança agora porque novos recursos introduzidos no React 18 são construídos usando recursos modernos do navegador, como microtasks, que não podem ser adequadamente polidos no IE.

Se você precisar dar suporte ao Internet Explorer, recomendamos que permaneça com o React 17.

## Desativações {/*deprecations*/}

* `react-dom`: `ReactDOM.render` foi descontinuado. Usá-lo irá avisar e executar seu aplicativo no modo React 17.
* `react-dom`: `ReactDOM.hydrate` foi descontinuado. Usá-lo irá avisar e executar seu aplicativo no modo React 17.
* `react-dom`: `ReactDOM.unmountComponentAtNode` foi descontinuado.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` foi descontinuado.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` foi descontinuado.

## Outras Mudanças Quebrando {/*other-breaking-changes*/}

* **Tempos consistentes do useEffect**: O React agora sempre esvazia sincronicamente funções de efeito se a atualização foi acionada durante um evento de entrada do usuário discreto, como um clique ou um evento de keydown. Anteriormente, o comportamento não era sempre previsível ou consistente.
* **Erros de hidratação mais rigorosos**: Desajustes de hidratação devido a conteúdo de texto faltando ou extra agora são tratados como erros, em vez de avisos. O React não tentará mais "corrigir" nós individuais inserindo ou excluindo um nó no cliente em uma tentativa de corresponder à marcação do servidor e reverterá para renderização no cliente até a fronteira `<Suspense>` mais próxima na árvore. Isso garante que a árvore hidratada seja consistente e evita possíveis buracos de privacidade e segurança que podem ser causados por desajustes de hidratação.
* **As árvores de Suspense são sempre consistentes:** Se um componente suspender antes de ser totalmente adicionado à árvore, o React não o adicionará à árvore em um estado incompleto ou acionará seus efeitos. Em vez disso, o React descartará completamente a nova árvore, aguardará a conclusão da operação assíncrona e, em seguida, tentará renderizar novamente do zero. O React renderizará a tentativa de re-exibição de forma concorrente, e sem bloquear o navegador.
* **Efeitos de Layout com Suspense**: Quando uma árvore re-suspende e reverte para um fallback, o React agora limpará os efeitos de layout e, em seguida, os recriará quando o conteúdo dentro da fronteira for exibido novamente. Isso corrige um problema que impedia que bibliotecas de componentes medisse corretamente o layout ao serem usadas com Suspense.
* **Novos Requisitos de Ambiente JS**: O React agora depende de recursos modernos de navegadores, incluindo `Promise`, `Symbol` e `Object.assign`. Se você suporta navegadores mais antigos e dispositivos, como Internet Explorer, que não fornecem recursos modernos de navegador nativamente ou têm implementações não conformes, considere incluir um polyfill global em sua aplicação empacotada.

## Outras Mudanças Notáveis {/*other-notable-changes*/}

### React {/*react*/}

* **Componentes agora podem renderizar `undefined`:** O React não avisa mais se você retornar `undefined` de um componente. Isso torna os valores de retorno permitidos consistentes com os valores que são permitidos no meio de uma árvore de componentes. Sugerimos usar um linter para evitar erros como esquecer uma instrução `return` antes do JSX.
* **Nos testes, avisos `act` agora são opt-in:** Se você estiver executando testes de ponta a ponta, os avisos de `act` são desnecessários. Introduzimos um mecanismo [opt-in](https://github.com/reactwg/react-18/discussions/102) para que você possa habilitá-los apenas para testes unitários onde eles são úteis e benéficos.
* **Sem aviso sobre `setState` em componentes desmontados:** Anteriormente, o React alertava sobre vazamentos de memória quando você chamava `setState` em um componente desmontado. Este aviso foi adicionado para assinaturas, mas as pessoas se deparam com isso principalmente em cenários onde definir o estado está bem, e soluções alternativas pioram o código. Removemos [isso](https://github.com/facebook/react/pull/22114).
* **Sem supressão de logs de console:** Quando você usa o Modo Estrito, o React renderiza cada componente duas vezes para ajudá-lo a encontrar efeitos colaterais inesperados. No React 17, suprimimos logs de console para uma das duas renderizações para facilitar a leitura dos logs. Em resposta ao [feedback da comunidade](https://github.com/facebook/react/issues/21783) sobre isso ser confuso, removemos a supressão. Em vez disso, se você tiver o React DevTools instalado, os logs da segunda renderização serão exibidos em cinza, e haverá uma opção (desativada por padrão) para suprimir completamente.
* **Uso de memória melhorado:** O React agora limpa mais campos internos ao serem desmontados, reduzindo o impacto de vazamentos de memória que podem existir no código do seu aplicativo.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Não gerará mais erro quando estiver suspenso no servidor. Em vez disso, emitirá o HTML de fallback para a fronteira `<Suspense>` mais próxima e, em seguida, tentará renderizar o mesmo conteúdo no cliente. Ainda é recomendável que você mude para uma API de streaming como `renderToPipeableStream` ou `renderToReadableStream` em vez disso.
* **`renderToStaticMarkup`:** Não gerará mais erro quando estiver suspenso no servidor. Em vez disso, emitirá o HTML de fallback para a fronteira `<Suspense>` mais próxima.

## Registro de Mudanças {/*changelog*/}

Você pode ver o [registro de mudanças completo aqui](https://github.com/facebook/react/blob/main/CHANGELOG.md).