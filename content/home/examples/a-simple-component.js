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
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e
  }
}

root.render(<HelloMessage name="Taylor" />);
