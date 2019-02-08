---
id: faq-ajax
title: AJAX e APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Como fazer uma requisição AJAX? {#como-fazer-uma-requisicao-ajax}

Você pode usar qualquer biblioteca AJAX que desejar com React. Algumas populares são [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), e o nativo do navegador [window.fetch](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API).

### Onde eu devo fazer uma chamada AJAX no ciclo de vida do componente? {#onde-eu-devo-fazer-uma-chamada-ajax-no-ciclo-de-vida-do-componente}

Você deve preencher dados com chamadas AJAX no método [`componentDidMount`](/docs/react-component.html#mounting) do ciclo de vida. Isto é para que você consiga usar `setState` para atualizar seu componente quando os dados forem recebidos.

### Exemplo: Usando resultados AJAX para definir o estado local {#exemplo-usando-ajax-para-definir-o-estado-local}

O componente abaixo demonstra como deve fazer uma chamada AJAX no `componentDidMount` para preencher o estado local. 

A API de exemplo retorna um objeto JSON como este:

```
{
  "itens": [
    { "id": 1, "nome": "Maçãs",  "preço": "R$2" },
    { "id": 2, "nome": "Pêssegos", "preço": "R$5" }
  ] 
}
```

```jsx
class MeuComponente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      erro: null,
      foiCarregado: false,
      itens: []
    };
  }

  componentDidMount() {
    fetch("https://api.exemplo.com/itens")
      .then(res => res.json())
      .then(
        (resultado) => {
          this.setState({
            foiCarregado: true,
            itens: resultado.itens
          });
        },
        // Nota: É importante lidar com os erros aqui
        // em vez de um bloco catch() para não recebermos
        // exceções de erros dos componentes.
        (erro) => {
          this.setState({
            foiCarregado: true,
            erro
          });
        }
      )
  }

  render() {
    const { erro, foiCarregado, itens } = this.state;
    if (erro) {
      return <div>Erro: {erro.mensagem}</div>;
    } else if (!foiCarregado) {
      return <div>Carregando...</div>;
    } else {
      return (
        <ul>
          {itens.map(item => (
            <li key={item.nome}>
              {item.nome} {item.preço}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
