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
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
  }
}

root.render(<HelloMessage name="Taylor" />);
