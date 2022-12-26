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
>>>>>>> 4b68508440a985598571f78f60637b6dccdd5a1a
  }
}

root.render(<HelloMessage name="Taylor" />);
