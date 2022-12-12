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
>>>>>>> c883f623d597852b49f9314bb8133442ef9d3298
  }
}

root.render(<HelloMessage name="Taylor" />);
