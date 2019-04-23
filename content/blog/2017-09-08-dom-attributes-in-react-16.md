---
title: "Atributos do DOM no React 16"
author: [gaearon]
---

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
<div tabIndex="-1" />
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

<!--If you still accidentally forward non-DOM props to DOM components, with React 16 you will start seeing those attributes in the DOM, for example:-->
Se você ainda envia acidentalmente props que não pertencem ao DOM, à componentes do DOM, com o React 16 você começará a ver esses atributos, por exemplo:

```js
<div myData='[Object object]' />
```

Isso é um pouco seguro (o navegador vai somente ignora-lo), porém nos recomendamos corrigir esses casos assim que eles forem encontrados. Um potencial risco é se você passar um objeto que implementa um método `toString()` ou `valueOf()` personalizado. Outra possível discussão é que os atributos legados de HTML como `align` e `valign` vão ser passados agora pelo DOM. Eles costumavam ser retirados pois o React não os suportava. 

To avoid these problems, we suggest to fix the warnings you see in React 15 before upgrading to React 16.

## Changes in Detail {#changes-in-detail}

We've made a few other changes to make the behavior more predictable and help ensure you're not making mistakes. We don't anticipate that these changes are likely to break real-world applications.

**These changes only affect DOM components like `<div>`, not your own components.**  

Below is a detailed list of them.

* **Unknown attributes with string, number, and object values:**  

    ```js
    <div mycustomattribute="value" />
    <div mycustomattribute={42} />
    <div mycustomattribute={myObject} />
    ```

    React 15: Warns and ignores them.  
    React 16: Converts values to strings and passes them through.

    *Note: attributes starting with `on` are not passed through as an exception because this could become a potential security hole.*

* **Known attributes with a different canonical React name:**  

    ```js
    <div tabindex="-1" />
    <div class="hi" />
    ```

    React 15: Warns and ignores them.  
    React 16: Warns but converts values to strings and passes them through.

    *Note: always use the canonical React naming for all supported attributes.*

* **Non-boolean attributes with boolean values:**  

    ```js
    <div className={false} />
    ```

    React 15: Converts booleans to strings and passes them through.  
    React 16: Warns and ignores them.

* **Non-event attributes with function values:**  

    ```js
    <div className={function() {}} />
    ```

    React 15: Converts functions to strings and passes them through.  
    React 16: Warns and ignores them.

* **Attributes with Symbol values:**

    ```js
    <div className={Symbol('foo')} />
    ```

    React 15: Crashes.  
    React 16: Warns and ignores them.

* **Attributes with `NaN` values:**

    ```js
    <div tabIndex={0 / 0} />
    ```

    React 15: Converts `NaN`s to strings and passes them through.  
    React 16: Converts `NaN`s to strings and passes them through with a warning.

While testing this release, we have also [created an automatically generated table](https://github.com/facebook/react/blob/master/fixtures/attribute-behavior/AttributeTableSnapshot.md) for all known attributes to track potential regressions.

## Try It! {#try-it}

You can try the change in [this CodePen](https://codepen.io/gaearon/pen/gxNVdP?editors=0010).  
It uses React 16 RC, and you can [help us by testing the RC in your project!](https://github.com/facebook/react/issues/10294)

## Thanks {#thanks}

This effort was largely driven by [Nathan Hunzaker](https://github.com/nhunzaker) who has been a [prolific outside contributor to React](https://github.com/facebook/react/pulls?q=is:pr+author:nhunzaker+is:closed).

You can find his work on this issue in several PRs over the course of last year: [#6459](https://github.com/facebook/react/pull/6459), [#7311](https://github.com/facebook/react/pull/7311), [#10229](https://github.com/facebook/react/pull/10229), [#10397](https://github.com/facebook/react/pull/10397), [#10385](https://github.com/facebook/react/pull/10385), and [#10470](https://github.com/facebook/react/pull/10470).

Major changes in a popular project can take a lot of time and research. Nathan demonstrated perseverance and commitment to getting this change through, and we are very thankful to him for this and other efforts.

We would also like to thank [Brandon Dail](https://github.com/aweary) and [Jason Quense](https://github.com/jquense) for their invaluable help maintaining React this year.

## Future Work {#future-work}

We are not changing how [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) work in React 16, but there are [existing discussions](https://github.com/facebook/react/issues/7249) about setting properties instead of attributes, and we might revisit this in React 17. Feel free to chime in if you'd like to help!
