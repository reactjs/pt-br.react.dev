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
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e
  }
}

root.render(<HelloMessage name="Taylor" />);
