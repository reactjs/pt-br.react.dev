---
id: testing-recipes
title: Receitas de Teste
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Padrões de teste comuns para componentes React.

> Nota:
>
> Esta página assume que você está utilizando o [Jest](https://jestjs.io/) como executor de testes. Se você está utilizando um executor de testes diferente, pode ser necessário mudar a API porém no geral o desenho da solução provavelmente será o mesmo. Leia mais detalhes sobre como configurar um ambiente de testes na página [Ambientes de Teste](/docs/testing-environments.html).

Nessa página, nós iremos primeiramente usar componentes funcionais. Entretanto, essas estratégias não dependem desses detalhes de implementação e também funcionam em componentes de classe.

- [Detalhamento da configuração](#setup--teardown)
- [`act()`](#act)
- [Renderizando](#rendering)
- [Busca de dados](#data-fetching)
- [Transformando módulos em _mock_](#mocking-modules)
- [Eventos](#events)
- [Temporizadores](#timers)
- [Testes de Snapshot](#snapshot-testing)
- [Renderizações Múltiplas](#multiple-renderers)
- [Algo faltando?](#something-missing)

---

### Detalhamento da configuração {#setup--teardown}

Para cada teste, nós geralmente queremos renderizar nossa árvore React para um elemento do DOM que está atrelado a um `documento`. Isso é importante para que ele recebe eventos do DOM. Quando o teste finaliza, nós queremos realizar uma "limpeza" e desmontar a árvore do `documento`.

Um jeito comum de se realizar isso é usar a combinação dos blocos `beforeEach` e `afterEach` para que eles sempre sejam executado e isolem o bloco de teste.

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // Configura um elemento do DOM como alvo do teste
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Limpar ao sair
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Você pode utilizar um diferente padrão, mas tenha em mente de que queremos executar uma limpeza _mesmo que o teste falhe_. Caso contrário, os testes podem impactar outros, alterando o comportamento. Isso faz com que eles sejam difíceis de serem depurados.

---

### `act()` {#act}

Quando está se escrevendo testes de UI, tarefas como renderização, eventos de usuário ou busca de testes podem ser considerados como "unidades" de interação com a interface do usuário. React provê um auxiliar chamado `act()` que garante que todas as atualizações relacionadas a esses "usuários" estejam sendo processadas e aplicadas ao DOM antes que você faça alguma declaração de testes.

```js
act(() => {
  // renderizar componentes
});
// fazer declarações de testes
```

Isso ajuda seus testes serem executados próximos do que os usuários experimentariam quando estiverem usando sua aplicação. o restos dos exemplos utilizam a função `act()` para ter essas garantias.

Você pode achar que utilizar o `act()` diretamente um pouco verboso demais. Para evitar um pouco do _boilerplate_, você pode usar uma biblioteca como a [React Testing Library](https://testing-library.com/react), cujo as funções auxiliares são encapsuladas com o `act()`.

> Nota:
>
> O nome `act` vem do padrão [_Arrange-Act-Assert_](http://wiki.c2.com/?ArrangeActAssert).

---

### Renderizando {#rendering}

Popularmente, você deseja testar se um componente renderiza corretamente dado a _prop_ recebida. Considere um componente simples que renderiza uma mensagem baseado em uma _prop_:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

Nós podemos criar o seguinte teste para esse componente:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Limpar ao sair
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Busca de Dados {#data-fetching}

Ao invés de realizar chamadas reais para uma API, você pode transformar a requisição em _mock_ com dados fictícios. Transformando o dado em _mock_ com dados "falsos" previne testes incompletos por causa de um _backend_ indisponível, além de torná-los mais rápido. Nota: Você ainda pode querer executar um subconjunto de testes usando um _framework_ ["_end-to-end_"](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) que valida se a aplicação inteira está funcionando em conjunto.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

Nós podemos escrever os testes para o componente:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpar na saída
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Usar a versão assíncrona de act para aplicar Promises resolvidas
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // remover o mock para garantir que os testes estão completamente isolados
  global.fetch.mockRestore();
});
```

---

### Transformando módulos em _mock_ {#mocking-modules}

Alguns módulos podem não funcionar corretamente dentro de um ambiente de testes ou podem não ser essenciais para o teste em si. Transformando eles em _mock_ com dados fictícios pode facilitar a escrita dos testes para seu próprio código.

Considere um componente `Contact` que possui um componente terceiro `GoogleMap` embutido:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Se nós não queremos carregar esse componente nos nossos testes, nós podemos transformar a dependência em _mock_ em um componente fictício e executar o teste:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpar na saída
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Eventos {#events}

Nós recomendamos despachar eventos reais de elementos do DOM e então afirmar no seu resultado. Considere um componente `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

We could write tests for it:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  // container *deve* ser anexado ao documento para que os eventos ocorram corretamente.
  document.body.appendChild(container);
});

afterEach(() => {
  // limpar na saída
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // buscar pelo elemento do botão e disparar alguns eventos de click nele
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Os diferentes eventos do DOM e suas propriedades estão descritas em [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Note que você precisa passara `{ bubbles: true }` em cada evento que for criado para que ele chegue ao React Listener pois o React delega os eventos ao documento automaticamente.

> Nota:
>
> _React Testing Library_ oferece um [auxiliar mais conciso](https://testing-library.com/docs/dom-testing-library/api-events) para disparar eventos

---

### Temporizadores {#timers}

Seu código pode usar funções baseadas em tempo como `setTimeout` para programar mais trabalhos no futuro. Nesse exemplo abaixo, um painel de múltipla escolha espera por uma seleção e avança, esgotando o tempo se uma seleção não é feita em 5 segundos:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Nós podemos escrever testes para esse componente usando os [mocks de temporizador do Jest](https://jestjs.io/docs/en/timer-mocks) e testando os diferentes estados que ele pode estar.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpar na saída
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // move ahead in time by 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // and then move ahead by 5 seconds
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount the app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Você pode usar os temporizadores fictícios apenas em alguns testes. Acima, nós habilitamos eles usando `jest.useFakeTimers()`. A principal vantagem que eles fornecem é que seus testes não precisam esperar os 5 segundos para executar e você também não precisa fazer o código ser mais convoluto apenas para o teste.

---

### Testes de _Snapshot_ {#snapshot-testing}

Frameworks como o Jest também permitem você salvar "snapshots" de dados com [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). Com essas funções, nós podemos "salvar" o resultado do componente renderizado e garantir que uma mudança nele precisa ser explicitamente apontada como uma mudança no _snapshot_.

Nesse exemplo, nós renderizamos um componente e formatamos o HTML renderizado com o pacote [`pretty`](https://www.npmjs.com/package/pretty), antes de salvá-lo como um _inline snapshot_.

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // configurar o elemento do DOM como o alvo da renderização
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // limpar na saída
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

Tipicamente é melhor fazer afirmações mais específicas do que utilizar snapshots. Esse tipo de testes inclui detalhes de implementação e portanto podem facilmente quebrar. Seletivamente [transformar alguns componentes filhos em mock](#mocking-modules) pode reduzir o tamanho do snapshot e mantê-los legíveis para o review de código.

---

### Renderizações múltiplas {#multiple-renderers}

Em casos raros, você pode estar executando um test em um componente que utiliza múltiplos renderizadores. Por exemplo, você pode estar executando testes de _snapshot_ em um componente com `react-test-renderer`, que internamente usa `ReactDOM.render` dentro de um componente filho para renderizar algum conteúdo. Nesse cenário, você pode encapsular as atualizações com o respectivo `act()` dos seus renderizadores.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Algo faltando? {#something-missing}

Se algum cenário comum não estiver coberto, por favor nos avise na página de [_issues_](https://github.com/reactjs/reactjs.org/issues) no repositório da documentação oficial do site.
