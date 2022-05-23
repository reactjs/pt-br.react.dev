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
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
  }
}

root.render(<HelloMessage name="Taylor" />);
