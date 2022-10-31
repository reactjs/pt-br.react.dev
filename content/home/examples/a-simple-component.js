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
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356
  }
}

root.render(<HelloMessage name="Taylor" />);
