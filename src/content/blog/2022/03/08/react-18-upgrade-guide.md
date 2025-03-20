---
title: "Como Fazer o Upgrade para o React 18"
author: Rick Hanlon
date: 2022/03/08
description: Como compartilhamos na publicação de lançamento, o React 18 apresenta recursos impulsionados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicativos existentes. Nesta publicação, guiaremos você pelas etapas para fazer o upgrade para o React 18.
---

08 de Março de 2022 por [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Como compartilhamos na [publicação de lançamento](/blog/2022/03/29/react-v18), o React 18 apresenta recursos impulsionados pelo nosso novo renderizador concorrente, com uma estratégia de adoção gradual para aplicativos existentes. Nesta publicação, guiaremos você pelas etapas para fazer o upgrade para o React 18.

Por favor, [relate quaisquer erros](https://github.com/facebook/react/issues/new/choose) que você encontrar ao fazer o upgrade para o React 18.

</Intro>

<Note>

Para usuários do React Native, o React 18 será lançado em uma versão futura do React Native. Isso ocorre porque o React 18 se baseia na Nova Arquitetura do React Native para se beneficiar dos novos recursos apresentados nesta postagem do blog. Para obter mais informações, consulte a [apresentação principal do React Conf aqui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

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

## Atualizações para as APIs de Renderização do Cliente {/*updates-to-client-rendering-apis*/}

Quando você instala o React 18 pela primeira vez, verá um aviso no console:

<ConsoleBlock level="error">

ReactDOM.render não é mais suportado no React 18. Use createRoot em vez disso. Até que você mude para a nova API, seu aplicativo se comportará como se estivesse executando o React 17. Saiba mais: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

O React 18 apresenta uma nova API raiz que fornece melhor ergonomia para gerenciar as raízes. A nova API raiz também habilita o novo renderizador concorrente, o que permite que você opte por recursos concorrentes.

```js
// Antes
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// Depois
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
```

Também mudamos o `unmountComponentAtNode` para `root.unmount`:

```js
// Antes
unmountComponentAtNode(container);

// Depois
root.unmount();
```

Também removemos o callback do render, pois geralmente não tem o resultado esperado ao usar o Suspense:

```js
// Antes
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// Depois
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

Não há substituição individual para a antiga API de callback de renderização - ela depende do seu caso de uso. Consulte a postagem do grupo de trabalho para [Substituindo o render com createRoot](https://github.com/reactwg/react-18/discussions/5) para obter mais informações.

</Note>

Finalmente, se seu aplicativo usa renderização do lado do servidor com hidratação, atualize `hydrate` para `hydrateRoot`:

```js
// Antes
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// Depois
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

Para obter mais informações, consulte a [discussão do grupo de trabalho aqui](https://github.com/reactwg/react-18/discussions/5).

<Note>

**Se seu aplicativo não funcionar após a atualização, verifique se ele está encapsulado em `<StrictMode>`.** [O Strict Mode ficou mais rigoroso no React 18](#updates-to-strict-mode) e nem todos os seus componentes podem ser resistentes às novas verificações que ele adiciona no modo de desenvolvimento. Se a remoção do Strict Mode corrigir seu aplicativo, você poderá removê-lo durante o upgrade e, em seguida, adicioná-lo novamente (seja no topo ou para uma parte da árvore) depois de corrigir os problemas que ele está apontando.

</Note>

## Atualizações para APIs de Renderização do Servidor {/*updates-to-server-rendering-apis*/}

Neste lançamento, estamos reformulando nossas APIs `react-dom/server` para oferecer suporte total ao Suspense no servidor e Streaming SSR. Como parte dessas alterações, estamos descontinuando a antiga API de streaming do Node, que não oferece suporte ao streaming incremental do Suspense no servidor.

Usar esta API agora avisará:

* `renderToNodeStream`: **Descontinuado ⛔️️**

Em vez disso, para streaming em ambientes Node, use:
* `renderToPipeableStream`: **Novo ✨**

Também estamos introduzindo uma nova API para dar suporte ao Streaming SSR com Suspense para ambientes de tempo de execução de ponta modernos, como Deno e Cloudflare workers:
* `renderToReadableStream`: **Novo ✨**

As seguintes APIs continuarão funcionando, mas com suporte limitado para Suspense:
* `renderToString`: **Limitado** ⚠️
* `renderToStaticMarkup`: **Limitado** ⚠️

Finalmente, esta API continuará funcionando para renderizar e-mails:
* `renderToStaticNodeStream`

Para obter mais informações sobre as alterações nas APIs de renderização do servidor, consulte a postagem do grupo de trabalho sobre [Atualização para React 18 no servidor](https://github.com/reactwg/react-18/discussions/22), uma [análise aprofundada da nova Arquitetura SSR do Suspense](https://github.com/reactwg/react-18/discussions/37) e a palestra de [Shaundai Person](https://twitter.com/shaundai) sobre [Renderização de Servidor de Streaming com Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) no React Conf 2021.

## Atualizações para definições de TypeScript {/*updates-to-typescript-definitions*/}

Se seu projeto usa TypeScript, você precisará atualizar suas dependências `@types/react` e `@types/react-dom` para as versões mais recentes. Os novos tipos são mais seguros e detectam problemas que costumavam ser ignorados pelo verificador de tipo. A alteração mais notável é que a prop `children` agora precisa ser listada explicitamente ao definir props, por exemplo:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Consulte a [pull request do React 18 typings](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) para obter uma lista completa de alterações somente de tipo. Ele vincula a correções de exemplo nos tipos da biblioteca para que você possa ver como ajustar seu código. Você pode usar o [script de migração automatizado](https://github.com/eps1lon/types-react-codemod) para ajudar a portar o código do seu aplicativo para os novos e mais seguros typings mais rapidamente.

Se você encontrar um erro nos typings, [envie um problema](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) no repositório DefinitelyTyped.

## Batching Automático {/*automatic-batching*/}

O React 18 adiciona melhorias de desempenho prontas para uso, fazendo mais batching por padrão. Batching é quando o React agrupa várias atualizações de state em uma única re-renderização para melhor desempenho. Antes do React 18, apenas agrupamos atualizações dentro de manipuladores de eventos do React. As atualizações dentro de promises, setTimeout, manipuladores de eventos nativos ou qualquer outro evento não foram agrupadas no React por padrão:

```js
// Antes do React 18, apenas eventos do React eram agrupados

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React só irá re-renderizar uma vez no final (isso é batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React irá renderizar duas vezes, uma para cada atualização de state (sem batching)
}, 1000);
```

A partir do React 18 com `createRoot`, todas as atualizações serão automaticamente agrupadas, não importa de onde se originem. Isso significa que as atualizações dentro de timeouts, promises, manipuladores de eventos nativos ou qualquer outro evento serão agrupadas da mesma forma que as atualizações dentro dos eventos do React:

```js
// Depois do React 18, as atualizações dentro de timeouts, promises,
// manipuladores de eventos nativos ou qualquer outro evento são agrupadas.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React só irá re-renderizar uma vez no final (isso é batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React só irá re-renderizar uma vez no final (isso é batching!)
}, 1000);
```

Esta é uma mudança drástica, mas esperamos que isso resulte em menos trabalho de renderização e, portanto, melhor desempenho em seus aplicativos. Para desativar o batching automático, você pode usar `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

Para obter mais informações, consulte a [análise aprofundada do batching automático](https://github.com/reactwg/react-18/discussions/21).

## Novas APIs para Bibliotecas {/*new-apis-for-libraries*/}

No React 18 Working Group, trabalhamos com os mantenedores da biblioteca para criar novas APIs necessárias para dar suporte à renderização concorrente para casos de uso específicos para seu caso de uso em áreas como estilos e stores externos. Para dar suporte ao React 18, algumas bibliotecas podem precisar mudar para uma das seguintes APIs:

* `useSyncExternalStore` é um novo Hook que permite que stores externos suportem leituras simultâneas, forçando as atualizações do store a serem síncronas. Esta nova API é recomendada para qualquer biblioteca que se integre ao state externo ao React. Para obter mais informações, consulte a [postagem de visão geral do useSyncExternalStore](https://github.com/reactwg/react-18/discussions/70) e [detalhes da API useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` é um novo Hook que permite que bibliotecas CSS-in-JS abordem problemas de desempenho de injeção de estilos na renderização. A menos que você já tenha construído uma biblioteca CSS-in-JS, não esperamos que você use isso. Este Hook será executado depois que o DOM for mutado, mas antes que os efeitos de layout leiam o novo layout. Isso resolve um problema que já existe no React 17 e abaixo, mas é ainda mais importante no React 18 porque o React cede ao navegador durante a renderização concorrente, dando a ele a chance de recalcular o layout. Para obter mais informações, consulte o [Guia de upgrade da biblioteca para `<style>`](https://github.com/reactwg/react-18/discussions/110).

O React 18 também apresenta novas APIs para renderização concorrente, como `startTransition`, `useDeferredValue` e `useId`, sobre os quais compartilhamos mais na [post de lançamento](/blog/2022/03/29/react-v18).

## Atualizações para o Strict Mode {/*updates-to-strict-mode*/}

No futuro, gostaríamos de adicionar um recurso que permite que o React adicione e remova seções da UI enquanto preserva o state. Por exemplo, quando um usuário sai de uma tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React desmontaria e remontaria árvores usando o mesmo componente state de antes.

Este recurso dará ao React melhor desempenho pronto para uso, mas requer que os componentes sejam resilientes a efeitos que são montados e destruídos várias vezes. A maioria dos efeitos funcionará sem nenhuma alteração, mas alguns efeitos presumem que eles só são montados ou destruídos uma vez.

Para ajudar a expor esses problemas, o React 18 apresenta uma nova verificação de desenvolvimento apenas para Strict Mode. Esta nova verificação desmontará e remontará automaticamente cada componente, sempre que um componente for montado pela primeira vez, restaurando o state anterior na segunda montagem.

Antes dessa alteração, o React montaria o componente e criaria os efeitos:

```
* React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
```

Com o Strict Mode no React 18, o React simulará a desmontagem e remontagem do componente no modo de desenvolvimento:

```
* React monta o componente.
    * Efeitos de layout são criados.
    * Efeitos são criados.
* React simula a desmontagem do componente.
    * Efeitos de layout são destruídos.
    * Efeitos são destruídos.
* React simula a montagem do componente com o estado anterior.
    * O código de configuração do efeito de layout é executado
    * O código de configuração do efeito é executado
```

Para obter mais informações, consulte as postagens do grupo de trabalho para [Adicionando State reutilizável ao StrictMode](https://github.com/reactwg/react-18/discussions/19) e [Como dar suporte ao State reutilizável em Effects](https://github.com/reactwg/react-18/discussions/18).

## Configurando seu ambiente de teste {/*configuring-your-testing-environment*/}

Quando você atualizar seus testes para usar `createRoot`, poderá ver este aviso no console de teste:

<ConsoleBlock level="error">

O ambiente de teste atual não está configurado para dar suporte a act(...)

</ConsoleBlock>

Para corrigir isso, defina `globalThis.IS_REACT_ACT_ENVIRONMENT` como `true` antes de executar seu teste:

```js
// No seu arquivo de configuração de teste
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

O objetivo da flag é dizer ao React que ele está sendo executado em um ambiente semelhante a um teste de unidade. O React registrará avisos úteis se você esquecer de encapsular uma atualização com `act`.

Você também pode definir a flag como `false` para dizer ao React que `act` não é necessário. Isso pode ser útil para testes de ponta a ponta que simulam um ambiente de navegador completo.

Eventualmente, esperamos que as bibliotecas de teste configurem isso para você automaticamente. Por exemplo, a [próxima versão da React Testing Library tem suporte integrado para o React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) sem nenhuma configuração adicional.

[Mais informações sobre a API de teste `act` e as alterações relacionadas](https://github.com/reactwg/react-18/discussions/102) estão disponíveis no grupo de trabalho.

## Interrompendo o suporte para o Internet Explorer {/*dropping-support-for-internet-explorer*/}

Neste lançamento, o React está interrompendo o suporte para o Internet Explorer, que [está saindo do suporte em 15 de junho de 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Estamos fazendo essa alteração agora porque os novos recursos introduzidos no React 18 são construídos usando recursos modernos do navegador, como microtasks, que não podem ser preenchidos adequadamente no IE.

Se você precisar oferecer suporte ao Internet Explorer, recomendamos que você fique com o React 17.

## Descontinuações {/*deprecations*/}

* `react-dom`: `ReactDOM.render` foi descontinuado. Usá-lo avisará e executará seu aplicativo no modo React 17.
* `react-dom`: `ReactDOM.hydrate` foi descontinuado. Usá-lo avisará e executará seu aplicativo no modo React 17.
* `react-dom`: `ReactDOM.unmountComponentAtNode` foi descontinuado.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` foi descontinuado.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` foi descontinuado.

## Outras alterações importantes {/*other-breaking-changes*/}

* **Tempo consistente de useEffect**: React agora sempre libera síncronamente as funções de efeito se a atualização foi acionada durante um evento de entrada do usuário discreto, como um evento de click ou keydown. Anteriormente, o comportamento nem sempre era previsível ou consistente.
* **Erros de hidratação mais rigorosos**: Incompatibilidades de hidratação devido a conteúdo de texto ausente ou extra agora são tratadas como erros em vez de avisos. O React não tentará mais "corrigir" nós individuais inserindo ou excluindo um nó no cliente em uma tentativa de corresponder a marcação do servidor e reverterá para a renderização do cliente até o limite mais próximo de `<Suspense>` na árvore. Isso garante que a árvore hidratada seja consistente e evita possíveis buracos de privacidade e segurança que podem ser causados ​​por incompatibilidades de hidratação.
* **Árvores Suspense são sempre consistentes:** Se um componente suspender antes de ser totalmente adicionado à árvore, o React não o adicionará à árvore em um estado incompleto nem disparará seus efeitos. Em vez disso, o React descartará a nova árvore completamente, aguardará a conclusão da operação assíncrona e, em seguida, tentará renderizar novamente do zero. O React renderizará a tentativa de repetição simultaneamente e sem bloquear o navegador.
* **Efeitos de layout com Suspense**: Quando uma árvore for suspensa novamente e reverter para um fallback, o React agora limpará os efeitos de layout e, em seguida, os recriará quando o conteúdo dentro da borda for mostrado novamente. Isso corrige um problema que impedia as bibliotecas de componentes de medir corretamente o layout quando usado com Suspense.
* **Novos requisitos de ambiente JS**: React agora depende de recursos modernos do navegador, incluindo `Promise`, `Symbol` e `Object.assign`. Se você oferece suporte a navegadores e dispositivos mais antigos, como o Internet Explorer, que não fornecem recursos modernos de navegador nativamente ou têm implementações não compatíveis, considere incluir um polyfill global em seu aplicativo empacotado.

## Outras alterações notáveis ​​ {/*other-notable-changes*/}

### React {/*react*/}

* **Os componentes agora podem renderizar `undefined`:** O React não avisa mais se você retornar `undefined` de um componente. Isso torna os valores de retorno de componentes permitidos consistentes com os valores que são permitidos no meio de uma árvore de componentes. Sugerimos o uso de um linter para evitar erros como esquecer uma instrução `return` antes do JSX.
* **Nos testes, os avisos `act` agora são opt-in:** Se você estiver executando testes de ponta a ponta, os avisos `act` são desnecessários. Apresentamos um mecanismo [opt-in](https://github.com/reactwg/react-18/discussions/102) para que você possa habilitá-los apenas para testes de unidade, onde são úteis e benéficos.
* **Sem aviso sobre `setState` em componentes desmontados:** Anteriormente, o React avisava sobre vazamentos de memória quando você chama `setState` em um componente desmontado. Este aviso foi adicionado para assinaturas, mas as pessoas o encontram principalmente em cenários em que definir o state está bem, e as soluções alternativas tornam o código pior. [Removemos](https://github.com/facebook/react/pull/22114) este aviso.
* **Sem supressão de logs do console:** Quando você usa o Strict Mode, o React renderiza cada componente duas vezes para ajudá-lo a encontrar efeitos colaterais inesperados. No React 17, suprimimos os logs do console para uma das duas renderizações para facilitar a leitura dos logs. Em resposta ao [feedback da comunidade](https://github.com/facebook/react/issues/21783) sobre isso ser confuso, removemos a supressão. Em vez disso, se você tiver o React DevTools instalado, as renderizações do segundo log serão exibidas em cinza e haverá uma opção (desativada por padrão) para suprimi-las completamente.
* **Uso de memória aprimorado:** React agora limpa mais campos internos na desmontagem, tornando o impacto de vazamentos de memória não corrigidos que podem existir em seu código de aplicativo menos severo.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Não irá mais gerar um erro ao suspender no servidor. Em vez disso, ele emitirá o HTML de fallback para o limite `<Suspense>` mais próximo e, em seguida, tentará renderizar novamente o mesmo conteúdo no cliente. Ainda é recomendável que você mude para uma API de streaming como `renderToPipeableStream` ou `renderToReadableStream` em vez disso.
* **`renderToStaticMarkup`:** Não irá mais gerar um erro ao suspender no servidor. Em vez disso, ele emitirá o HTML de fallback para o limite `<Suspense>` mais próximo.

## Changelog {/*changelog*/}

Você pode ver o [changelog completo aqui](https://github.com/facebook/react/blob/main/CHANGELOG.md).
``