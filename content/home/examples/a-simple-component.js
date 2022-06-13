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
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b
  }
}

root.render(<HelloMessage name="Taylor" />);
