class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,8}
  // O componente Toolbar deve receber uma prop extra chamada "theme"
  // e repassar para o componente ThemedButton.
  // Isso pode ser bem trabalhoso porque, se cada botão na aplicação
  // precisar saber o tema, este (o tema) teria que ser repassado por
  // todos os componentes.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
