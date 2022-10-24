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
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
  }
}

root.render(<HelloMessage name="Taylor" />);
