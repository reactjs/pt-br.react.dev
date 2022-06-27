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
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246
  }
}

root.render(<HelloMessage name="Taylor" />);
