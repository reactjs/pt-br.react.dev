function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // Atribui a prop "fowardRef" como uma ref
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Note o segundo parâmetro "ref" fornecido pelo React.fowardRef.
  // Nós podemos passá-lo para LogProps como qualquer outra props regular, e.g. "fowardedRef"
  // E ela pode ser anexada ao componente
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
