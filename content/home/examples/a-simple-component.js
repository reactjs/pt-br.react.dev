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
>>>>>>> 4808a469fa782cead9802619b0341b27b342e2d3
  }
}

root.render(<HelloMessage name="Taylor" />);
