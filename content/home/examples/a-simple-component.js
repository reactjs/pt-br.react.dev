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
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
  }
}

root.render(<HelloMessage name="Taylor" />);
