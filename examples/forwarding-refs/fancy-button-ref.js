import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// O componente FancyButton que importamos é o HOC LogProps
// Mesmo que a saída renderizada seja a mesma,
// Nossa ref vai apontar para LogProps ao invês do componente interno FancyButton!
// Isso significa que nós não podemos chamar e.g. ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
