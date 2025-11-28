---
title: Introdução
---

<Intro>
O React Compiler é uma nova ferramenta de build que otimiza automaticamente sua aplicação React. Ele funciona com JavaScript puro e entende as [Regras do React](/reference/rules), então você não precisa reescrever nenhum código para usá-lo.
</Intro>

<YouWillLearn>

* O que o React Compiler faz
* Como começar com o compilador
* Estratégias de adoção incremental
* Depuração e solução de problemas quando algo dá errado
* Usando o compilador em sua biblioteca React

</YouWillLearn>

<<<<<<< HEAD
<Note>
O React Compiler está atualmente em Release Candidate (RC). Agora recomendamos que todos experimentem o compilador e forneçam feedback. A versão RC mais recente pode ser encontrada com a tag `@rc`.
</Note>

## O que o React Compiler faz? {/*what-does-react-compiler-do*/}
=======
## What does React Compiler do? {/*what-does-react-compiler-do*/}
>>>>>>> d271a7ac11d2bf0d6e95ebdfacaf1038421f9be0

O React Compiler otimiza automaticamente sua aplicação React em tempo de build. O React é frequentemente rápido o suficiente sem otimização, mas às vezes você precisa memoizar manualmente componentes e valores para manter sua aplicação responsiva. Esta memoização manual é tediosa, fácil de errar e adiciona código extra para manter. O React Compiler faz essa otimização automaticamente para você, liberando você dessa carga mental para que possa focar na construção de funcionalidades.

### Antes do React Compiler {/*before-react-compiler*/}

Sem o compilador, você precisa memoizar manualmente componentes e valores para otimizar re-renderizações:

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

<Note>

Esta memoização manual tem um bug sutil que quebra a memoização:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

Mesmo que `handleClick` esteja envolvido em `useCallback`, a função arrow `() => handleClick(item)` cria uma nova função toda vez que o componente renderiza. Isso significa que `Item` sempre receberá uma nova prop `onClick`, quebrando a memoização.

O React Compiler é capaz de otimizar isso corretamente com ou sem a função arrow, garantindo que `Item` só re-renderize quando `props.onClick` mudar.

</Note>

### Depois do React Compiler {/*after-react-compiler*/}

Com o React Compiler, você escreve o mesmo código sem memoização manual:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[Veja este exemplo no React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

O React Compiler aplica automaticamente as otimizações equivalentes, garantindo que sua aplicação só re-renderize quando necessário.

<DeepDive>
#### Que tipo de memoização o React Compiler adiciona? {/*what-kind-of-memoization-does-react-compiler-add*/}

A memoização automática do React Compiler é focada principalmente em **melhorar a performance de atualizações** (re-renderizar componentes existentes), então ele foca nestes dois casos de uso:

1. **Pular re-renderizações em cascata de componentes**
    * Re-renderizar `<Parent />` faz com que muitos componentes em sua árvore de componentes re-renderizem, mesmo que apenas `<Parent />` tenha mudado
1. **Pular cálculos caros fora do React**
    * Por exemplo, chamar `expensivelyProcessAReallyLargeArrayOfObjects()` dentro do seu componente ou hook que precisa desses dados

#### Otimizando Re-renderizações {/*optimizing-re-renders*/}

O React permite que você expresse sua UI como uma função de seu estado atual (mais concretamente: suas props, state e context). Em sua implementação atual, quando o estado de um componente muda, o React irá re-renderizar esse componente _e todos os seus filhos_ — a menos que você tenha aplicado alguma forma de memoização manual com `useMemo()`, `useCallback()`, ou `React.memo()`. Por exemplo, no exemplo a seguir, `<MessageButton>` irá re-renderizar sempre que o estado de `<FriendList>` mudar:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Veja este exemplo no React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

O React Compiler aplica automaticamente o equivalente à memoização manual, garantindo que apenas as partes relevantes de uma aplicação re-renderizem conforme o estado muda, o que às vezes é chamado de "reatividade granular". No exemplo acima, o React Compiler determina que o valor de retorno de `<FriendListCard />` pode ser reutilizado mesmo quando `friends` muda, e pode evitar recriar este JSX _e_ evitar re-renderizar `<MessageButton>` conforme a contagem muda.

#### Cálculos caros também são memoizados {/*expensive-calculations-also-get-memoized*/}

O React Compiler também pode memoizar automaticamente cálculos caros usados durante a renderização:

```js
// **Não** memoizado pelo React Compiler, pois isso não é um componente ou hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoizado pelo React Compiler pois isso é um componente
function TableContainer({ items }) {
  // Esta chamada de função seria memoizada:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Veja este exemplo no React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

No entanto, se `expensivelyProcessAReallyLargeArrayOfObjects` é verdadeiramente uma função cara, você pode querer considerar implementar sua própria memoização fora do React, porque:

- O React Compiler apenas memoiza componentes e hooks React, não toda função
- A memoização do React Compiler não é compartilhada entre múltiplos componentes ou hooks

Então se `expensivelyProcessAReallyLargeArrayOfObjects` fosse usado em muitos componentes diferentes, mesmo se os mesmos itens exatos fossem passados, esse cálculo caro seria executado repetidamente. Recomendamos [fazer profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) primeiro para ver se realmente é tão caro antes de tornar o código mais complicado.
</DeepDive>

## Devo experimentar o compilador? {/*should-i-try-out-the-compiler*/}

Encorajamos todos a começar a usar o React Compiler. Embora o compilador ainda seja uma adição opcional ao React hoje, no futuro algumas funcionalidades podem exigir o compilador para funcionar completamente.

### É seguro usar? {/*is-it-safe-to-use*/}

<<<<<<< HEAD
O React Compiler está agora em RC e foi testado extensivamente em produção. Embora tenha sido usado em produção em empresas como a Meta, implementar o compilador em produção para sua aplicação dependerá da saúde de sua base de código e de quão bem você seguiu as [Regras do React](/reference/rules).
=======
React Compiler is now stable and has been tested extensively in production. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).
>>>>>>> d271a7ac11d2bf0d6e95ebdfacaf1038421f9be0

## Quais ferramentas de build são suportadas? {/*what-build-tools-are-supported*/}

O React Compiler pode ser instalado em [várias ferramentas de build](/learn/react-compiler/installation) como Babel, Vite, Metro e Rsbuild.

O React Compiler é principalmente um wrapper leve de plugin Babel em torno do compilador principal, que foi projetado para ser desacoplado do próprio Babel. Embora a versão estável inicial do compilador permaneça principalmente um plugin Babel, estamos trabalhando com as equipes swc e [oxc](https://github.com/oxc-project/oxc/issues/10048) para construir suporte de primeira classe para o React Compiler, então você não precisará adicionar o Babel de volta aos seus pipelines de build no futuro.

Usuários do Next.js podem habilitar o React Compiler invocado pelo swc usando [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) ou superior.

## O que devo fazer sobre useMemo, useCallback e React.memo? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

<<<<<<< HEAD
O React Compiler adiciona memoização automática de forma mais precisa e granular do que é possível com [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`React.memo`](/reference/react/memo). Se você escolher manter a memoização manual, o React Compiler irá analisá-la e determinar se sua memoização manual corresponde à sua memoização automaticamente inferida. Se não houver correspondência, o compilador escolherá não otimizar esse componente.

Isso é feito por precaução, pois um anti-padrão comum com memoização manual é usá-la para correção. Isso significa que sua aplicação depende de valores específicos sendo memoizados para funcionar adequadamente. Por exemplo, para prevenir um loop infinito, você pode ter memoizado alguns valores para impedir que uma chamada `useEffect` seja disparada. Isso quebra as Regras do React, mas como pode ser potencialmente perigoso para o compilador remover automaticamente a memoização manual, o compilador simplesmente não otimizará. Você deve remover manualmente sua memoização escrita à mão e verificar que sua aplicação ainda funciona como esperado.
=======
By default, React Compiler will memoize your code based on its analysis and heuristics. In most cases, this memoization will be as precise, or moreso, than what you may have written.

However, in some cases developers may need more control over memoization. The `useMemo` and `useCallback` hooks can continue to be used with React Compiler as an escape hatch to provide control over which values are memoized. A common use-case for this is if a memoized value is used as an effect dependency, in order to ensure that an effect does not fire repeatedly even when its dependencies do not meaningfully change.

For new code, we recommend relying on the compiler for memoization and using `useMemo`/`useCallback` where needed to achieve precise control.

For existing code, we recommend either leaving existing memoization in place (removing it can change compilation output) or carefully testing before removing the memoization.
>>>>>>> d271a7ac11d2bf0d6e95ebdfacaf1038421f9be0

## Experimente o React Compiler {/*try-react-compiler*/}

Esta seção irá ajudá-lo a começar com o React Compiler e entender como usá-lo efetivamente em seus projetos.

* **[Instalação](/learn/react-compiler/installation)** - Instale o React Compiler e configure-o para suas ferramentas de build
* **[Compatibilidade de Versão React](/reference/react-compiler/target)** - Suporte para React 17, 18 e 19
* **[Configuração](/reference/react-compiler/configuration)** - Personalize o compilador para suas necessidades específicas
* **[Adoção Incremental](/learn/react-compiler/incremental-adoption)** - Estratégias para implementar gradualmente o compilador em bases de código existentes
* **[Depuração e Solução de Problemas](/learn/react-compiler/debugging)** - Identifique e corrija problemas ao usar o compilador
* **[Compilando Bibliotecas](/reference/react-compiler/compiling-libraries)** - Melhores práticas para distribuir código compilado
* **[Referência da API](/reference/react-compiler/configuration)** - Documentação detalhada de todas as opções de configuração

## Recursos adicionais {/*additional-resources*/}

Além desta documentação, recomendamos verificar o [Grupo de Trabalho do React Compiler](https://github.com/reactwg/react-compiler) para informações adicionais e discussões sobre o compilador.
