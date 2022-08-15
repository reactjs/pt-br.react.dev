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
>>>>>>> 5fed75dac5f4e208369b102a1337d76944111b33
  }
}

root.render(<HelloMessage name="Taylor" />);
