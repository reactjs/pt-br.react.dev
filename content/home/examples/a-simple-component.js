class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Olá, {this.props.name}!
      </div>
    );
=======
    return <div>Hello {this.props.name}</div>;
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985
  }
}

root.render(<HelloMessage name="Taylor" />);
