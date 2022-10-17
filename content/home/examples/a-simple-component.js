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
>>>>>>> 8fe817e61e5fe50020ed9379ce9e1c5a2cf476a9
  }
}

root.render(<HelloMessage name="Taylor" />);
