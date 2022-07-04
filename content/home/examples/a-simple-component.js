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
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
  }
}

root.render(<HelloMessage name="Taylor" />);
