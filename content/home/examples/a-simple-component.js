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
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
  }
}

root.render(<HelloMessage name="Taylor" />);
