// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Você agora pode obter a ref difretamente para o button do DOM:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
