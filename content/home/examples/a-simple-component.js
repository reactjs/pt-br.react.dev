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
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34
  }
}

root.render(<HelloMessage name="Taylor" />);
