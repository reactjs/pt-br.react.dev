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
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd
  }
}

root.render(<HelloMessage name="Taylor" />);
