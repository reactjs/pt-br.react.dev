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
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a
  }
}

root.render(<HelloMessage name="Taylor" />);
