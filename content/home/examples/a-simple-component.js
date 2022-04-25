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
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892
  }
}

root.render(<HelloMessage name="Taylor" />);
