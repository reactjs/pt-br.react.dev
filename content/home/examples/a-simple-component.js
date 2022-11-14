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
>>>>>>> 3bba430b5959c2263c73f0d05d46e2c99c972b1c
  }
}

root.render(<HelloMessage name="Taylor" />);
