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
>>>>>>> cb9854a54984ef1288a8a2b8754897b15e75f433
  }
}

root.render(<HelloMessage name="Taylor" />);
