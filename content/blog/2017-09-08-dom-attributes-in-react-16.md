---
title: "Atributos do DOM no React 16"
author: [gaearon]
---

<div class="scary">

> This blog site has been archived. Go to [react.dev/blog](https://pt-br.react.dev/blog) to see the recent posts.

</div>

No passado, o React ignorava atributos do DOM desconhecidos. Se você escreveu arquivos JSX com um atributo que o React não reconhece, ele apenas ignoraria. Por exemplo: 

```js
// Seu código:
<div mycustomattribute="alguma coisa" />
```

renderizaria uma div vazia no DOM com React 15:  

```js
// Renderização no React 15:
<div />
```

No React 16, estamos fazendo uma mudança. Agora, qualquer atributo desconhecido será colocado no DOM:

```js
// Renderização no React 16:
<div mycustomattribute="alguma coisa" />
```

## Por Que Estamos Mudando Isso? {#why-are-we-changing-this}

O React sempre forneceu uma API central do JavaScript para o DOM. Visto que os componentes do React constantemente usam props customizadas e relacionadas ao DOM, faz sentido para o React usar a convenção `camelCase` como nas APis do DOM. 

```js
<div tabIndex={-1} />
```

Isso não mudou. Porém, a maneira como aplicamos isso no passado, nos forçou manter uma lista de permissões de todos os atributos do DOM válidos para o React no bundle.

```js
// ...
summary: 'summary',
tabIndex: 'tabindex'
target: 'target',
title: 'title',
// ...
```

Isso tem duas desvantagens:

* Você não pode [passar um atributo personalizado](https://github.com/facebook/react/issues/140). Isso é útil por fornecer atributos não padronizados específicos de um navegador, tentando novas APIs do DOM, e interagindo com arbitrárias bibliotecas de terceiros.

* A lista de atributos continuou crescendo ao longo do tempo, porém, a maioria dos atributos canônicos do React já são válidos no DOM. Removendo a maioria das listas de permissões, tornou-se possível reduzir bastante o tamanho do bundle. 

Com uma nova abordagem, ambos problemas foram solucionados. No React 16, você pode passar um atributo personalizado para qualquer elemento HTML e SVG, que o React não irá incluir toda lista de permissões do atributo na versão de produção. 

**Observe que você ainda deve usar atributos canônicos do React para atributos desconhecidos:**

```js
// Sim, por favor
<div tabIndex="-1" />

// Atenção: Propriedade do DOM `tabindex` inválida. Você quis dizer `tabIndex`?
<div tabindex="-1" />
```

Em outras palavras, a maneira como se usa componentes do DOM no React não mudou, mas agora você tem novos recursos. 

## Devo Manter Dados Em Atributos Personalizados? {#should-i-keep-data-in-custom-attributes}

Não. Nós não recomendamos você manter dados em atributos do DOM. Mesmo se você tiver que fazer isso, usar atributos `data-` provavelmente é uma escolha melhor, porém na maioria dos casos deve ser mantido em um estado de um componente React, ou em armazenamentos externos.

Entretanto, a nova funcionalidade é de fácil manuseio se você precisa usar um atributo não padronizado, ou um novo atributo do DOM, ou até mesmo se você precisa integrar com bibliotecas terceiras que dependa de tais atributos.

## Atributos de Dados e ARIA {#data-and-aria-attributes}

Assim como antes, o React deixa você passar atributos `data-` e `aria-` livremente: 

```js
<div data-foo="42" />
<button aria-label="Close" onClick={onClose} />
```

Isso não mudou.

[Acessibilidade](/docs/accessibility.html) é muito importante, por isso que o React 16 passa qualquer atributo e também valida se `aria-` props tem seus nomes corretos no modo de desenvolvimento, como o React 15 fazia. 

## Caminho de Migração {#migration-path}

Nós incluimos uma [notificação sobre atributos desconhecidos](/warnings/unknown-prop.html) desde o [React 15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0) que saiu há mais de um ano. A grande maioria das bibliotecas terceiras já atualizaram seu código. Se sua aplicação ainda não apresenta notificações com o React 15.2.0 ou em suas versões superiores, essa mudança não exigirá modificações no código da sua aplicação.

Se você ainda envia acidentalmente props que não pertencem ao DOM, à componentes do DOM, com o React 16 você começará a ver esses atributos, por exemplo:

```js
<div myData='[Object object]' />
```

Isso é um pouco seguro (o navegador vai somente ignora-lo), porém nos recomendamos corrigir esses casos assim que eles forem encontrados. Um potencial risco é se você passar um objeto que implementa um método `toString()` ou `valueOf()` personalizado. Outra possível discussão é que os atributos legados de HTML como `align` e `valign` vão ser passados agora pelo DOM. Eles costumavam ser retirados pois o React não os suportava. 

Para evitar esses problemas, nós sugerimos corrigir os avisos no React 15 antes de atualizar para o React 16.

## Mudanças nos Detalhes {#changes-in-detail}

Nós fizemos algumas outras mudanças para tornar o comportamento mais previsível e garantir que você não esteja cometendo erros. Nós não esperamos que essas mudanças possam quebrar aplicações existentes. 

**Essas mudanças somente afetam componentes do DOM como `<div>`, mas não seus próprios componentes.**

Abaixo está uma lista detalhada delas. 

* **Atributos desconhecidos com string, números, e objetos:** 

    ```js
    <div mycustomattribute="value" />
    <div mycustomattribute={42} />
    <div mycustomattribute={myObject} />
    ```

    React 15: Avisa e ignora eles.  
    React 16: Converte os valores para string e passa os valores dos atributos.

    *Nota: Atributos que começam com `on` não tem seus valores passados como exceção pois pode se tornar uma potencial falha de segurança.* 

* **Atributos React conhecidos com um nome canônico diferente:** 

    ```js
    <div tabindex={-1} />
    <div class="hi" />
    ```

    React 15: Avisa e ignora eles.
    React 16: Avisa mas converte os valores para strings e passa os valores.

    *Nota: Sempre use a nomenclatura canônica React para todos os atributos suportados.* 

* **Atributos não boleanos com valores boleanos:**

    ```js
    <div className={false} />
    ```

    React 15: Converte boleano para string e passa os valores.
    React 16: Avisa e ignora eles.

* **Atributos não relacionados a eventos com valores funções:**

    ```js
    <div className={function() {}} />
    ```

    React 15: Converte funções para strings e passa os valores.
    React 16: Avisa e ignora eles.

* **Atributos com valores de símbolo:**

    ```js
    <div className={Symbol('foo')} />
    ```

    React 15: Erro.
    React 16: Avisa e ignora eles.

* **Atributos com valores `NaN`:**

    ```js
    <div tabIndex={0 / 0} />
    ```

    React 15: Converte `NaN`s para strings e passa os valores.
    React 16: Converte `NaN`s para strings e passa os valores com um aviso. 

Ao testar esta versão, nós também criamos uma [tabela para todos os atributos conhecidos](https://github.com/facebook/react/blob/main/fixtures/attribute-behavior/AttributeTableSnapshot.md), que atualiza automaticamente, para rastrear possíveis regressões. 

## Tente! {#try-it}

Você pode tentar essa mudança neste [CodePen](https://codepen.io/gaearon/pen/gxNVdP?editors=0010).
Ele usa React 16 RC, e você pode [nos ajudar testando o RC em seu projeto!](https://github.com/facebook/react/issues/10294)

## Agradecimentos {#thanks}

Esse esforço foi em grande parte conduzido por [Nathan Hunzaker](https://github.com/nhunzaker) que tem sido um [ativo colaborador externo do React](https://github.com/facebook/react/pulls?q=is:pr+author:nhunzaker+is:closed).

Você pode encontrar seu trabalho sobre este assunto em vários PRs ao longo do ano passado: [#6459](https://github.com/facebook/react/pull/6459), [#7311](https://github.com/facebook/react/pull/7311), [#10229](https://github.com/facebook/react/pull/10229), [#10397](https://github.com/facebook/react/pull/10397), [#10385](https://github.com/facebook/react/pull/10385), e [#10470](https://github.com/facebook/react/pull/10470).

Mudanças importantes em um projeto popular podem exigir muito tempo e pesquisa. Nathan demonstrou perseverança e compromisso em realizar essa mudança, e somos muito gratos a ele por esse e outros esforços.

Também gostaríamos de agradecer a [Brandon Dail](https://github.com/aweary) e [Jason Quense](https://github.com/jquense) por sua ajuda inestimável para manter o React este ano.

## Trabalho Futuro {#future-work}

Não estamos mudando como [elementos customizados](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) funcionam no React 16, mas há [discussões existentes](https://github.com/facebook/react/issues/7249) sobre a definição de propriedades em vez de atributos e podemos revisitar isso no React 17. Sinta-se à vontade para entrar em contato se quiser ajudar!
