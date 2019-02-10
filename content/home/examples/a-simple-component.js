class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Olá, {this.props.name}!
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Daniel" />,
  document.getElementById('hello-example')
);