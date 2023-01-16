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
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
  }
}

root.render(<HelloMessage name="Taylor" />);
