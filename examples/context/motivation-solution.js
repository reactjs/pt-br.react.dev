// highlight-range{1-4}
// Context nos permite passar um valor a fundo da árvore de componente
// sem explicitamente passa-la por cada componente.
// Crie um Context para o tema atual (com "light" como padrão).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Use um Provider para passar o tema atual para a árvore abaixo.
    // Qualquer pode acessa-la, não importa quão profundo esteja.
    // Neste exemplo, nós passamos "dark" como tema atual.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// Um componente antecessor não precisa mais
// passar o tema explicitamente.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Atribua um contextType para ler o context do tema atual.
  // React vai encontrar o Provider acima mais próximo e vai usa-lo.
  // Neste exemplo, o tema atual é "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
