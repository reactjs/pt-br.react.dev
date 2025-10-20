---
title: "Hooks DOM embutidos do React"
---

<Intro>

<<<<<<< HEAD
O pacote `react-dom` contém Hooks que são suportados apenas para aplicações web (que rodam no ambiente DOM do navegador). Estes Hooks não são suportados em ambientes que não são de navegador como aplicativos iOS, Android ou Windows. Se você está procurando por Hooks que são suportados em navegadores web *e outros ambientes* veja [a página de React Hooks](/reference/react). Esta página lista todos os Hooks no pacote `react-dom`.
=======
The `react-dom` package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers *and other environments* see [the React Hooks page](/reference/react/hooks). This page lists all the Hooks in the `react-dom` package.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

</Intro>

---

## Hooks de formulário {/*form-hooks*/}

*Formulários* permitem que você crie controles interativos para submeter informações. Para gerenciar formulários em seus componentes, use um destes Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) permite que você faça atualizações na UI com base no status de um formulário.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```