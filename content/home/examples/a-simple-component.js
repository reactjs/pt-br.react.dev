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
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
  }
}

root.render(<HelloMessage name="Taylor" />);
