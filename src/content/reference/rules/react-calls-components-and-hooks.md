---
title: O React chama Componentes e Hooks
---

<Intro>
O React é responsável por renderizar componentes e Hooks quando necessário para otimizar a experiência do usuário. É declarativo: você diz ao React o que renderizar na lógica do seu componente, e o React descobrirá a melhor forma de exibi-lo para o seu usuário.
</Intro>

<InlineToc />

---

## Nunca chame funções de componentes diretamente {/*never-call-component-functions-directly*/}
Os componentes devem ser usados apenas em JSX. Não os chame como funções regulares. O React deve chamá-los.

O React deve decidir quando a função do seu componente é chamada [durante a renderização](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). No React, você faz isso usando JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Bom: Use apenas componentes em JSX
}
```

```js {expectedErrors: {'react-compiler': [2]}} {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Ruim: Nunca os chame diretamente
}
```

Se um componente contém Hooks, é fácil violar as [Regras dos Hooks](/reference/rules/rules-of-hooks) quando os componentes são chamados diretamente em um loop ou condicionalmente.

Deixar o React orquestrar a renderização também oferece uma série de benefícios:

* **Os componentes se tornam mais do que funções.** O React pode aumentá-los com recursos como _estado local_ através de Hooks que estão ligados à identidade do componente na árvore.
* **Os tipos de componentes participam da reconciliação.** Ao deixar o React chamar seus componentes, você também diz mais sobre a estrutura conceitual de sua árvore. Por exemplo, quando você muda de renderizar `<Feed>` para a página `<Profile>`, o React não tentará reutilizá-los.
* **O React pode melhorar a experiência do usuário.** Por exemplo, ele pode permitir que o navegador realize algumas tarefas entre chamadas de componentes para que a re-renderização de uma grande árvore de componentes não bloqueie a thread principal.
* **Uma melhor história de depuração.** Se os componentes são cidadãos de primeira classe dos quais a biblioteca está ciente, podemos construir ferramentas ricas para introspecção em desenvolvimento.
* **Reconciliação mais eficiente.** O React pode decidir exatamente quais componentes na árvore precisam ser re-renderizados e pular aqueles que não precisam. Isso torna seu aplicativo mais rápido e mais ágil.

---

## Nunca passe Hooks como valores regulares {/*never-pass-around-hooks-as-regular-values*/}

Os Hooks devem ser chamados apenas dentro de componentes ou Hooks. Nunca os passe como um valor regular.

Os Hooks permitem que você aumente um componente com recursos do React. Eles devem sempre ser chamados como uma função, e nunca passados como um valor regular. Isso possibilita um _raciocínio local_, ou a capacidade dos desenvolvedores de entender tudo que um componente pode fazer ao olhar para aquele componente isoladamente.

Quebrar essa regra fará com que o React não otimize automaticamente seu componente.

### Não mude um Hook dinamicamente {/*dont-dynamically-mutate-a-hook*/}

Os Hooks devem ser o mais "estáticos" possível. Isso significa que você não deve mudá-los dinamicamente. Por exemplo, isso significa que você não deve escrever Hooks de alta ordem:

```js {expectedErrors: {'react-compiler': [2, 3]}} {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Ruim: não escreva Hooks de alta ordem
  const data = useDataWithLogging();
}
```

Os Hooks devem ser imutáveis e não devem ser mutados. Em vez de mutar um Hook dinamicamente, crie uma versão estática do Hook com a funcionalidade desejada.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Bom: Crie uma nova versão do Hook
}

function useDataWithLogging() {
  // ... Crie uma nova versão do Hook e inicie a lógica aqui
}
```

### Não use Hooks dinamicamente {/*dont-dynamically-use-hooks*/}

Os Hooks também não devem ser usados dinamicamente: por exemplo, em vez de fazer injeção de dependência em um componente passando um Hook como valor:

```js {expectedErrors: {'react-compiler': [2]}} {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Ruim: não passe Hooks como props
}
```

Você deve sempre iniciar a chamada do Hook dentro desse componente e lidar com qualquer lógica lá.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Bom: Use o Hook diretamente
}

function useDataWithLogging() {
  // Se houver alguma lógica condicional para mudar o comportamento do Hook, ela deve ser iniciada
  // dentro do Hook
}
```

Dessa forma, `<Button />` é muito mais fácil de entender e depurar. Quando os Hooks são usados de maneiras dinâmicas, isso aumenta muito a complexidade do seu aplicativo e inibe o raciocínio local, tornando sua equipe menos produtiva a longo prazo. Também facilita acidentalmente violar as [Regras dos Hooks](/reference/rules/rules-of-hooks) que afirmam que Hooks não devem ser chamados condicionalmente. Se você se encontrar precisando simular componentes para testes, é melhor simular o servidor em vez de responder com dados fixos. Se possível, também geralmente é mais eficaz testar seu aplicativo com testes de ponta a ponta.