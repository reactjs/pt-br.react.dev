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
>>>>>>> ea9e9ab2817c8b7eff5ff60e8fe9b649fd747606
  }
}

root.render(<HelloMessage name="Taylor" />);
