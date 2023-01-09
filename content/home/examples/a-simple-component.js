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
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
  }
}

root.render(<HelloMessage name="Taylor" />);
