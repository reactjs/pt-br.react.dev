class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Ao invés de exportar FancyButton, nós exportamos LogProps.
// De qualquer forma, isso irá renderizar o FancyButton
// highlight-next-line
export default logProps(FancyButton);
