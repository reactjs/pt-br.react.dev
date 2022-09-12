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
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6
  }
}

root.render(<HelloMessage name="Taylor" />);
