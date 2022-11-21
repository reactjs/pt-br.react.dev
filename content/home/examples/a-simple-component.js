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
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30
  }
}

root.render(<HelloMessage name="Taylor" />);
