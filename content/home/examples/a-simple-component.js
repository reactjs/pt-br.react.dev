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
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
  }
}

root.render(<HelloMessage name="Taylor" />);
