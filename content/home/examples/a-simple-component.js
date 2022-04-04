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
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
  }
}

root.render(<HelloMessage name="Taylor" />);
