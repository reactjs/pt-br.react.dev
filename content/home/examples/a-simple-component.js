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
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
  }
}

root.render(<HelloMessage name="Taylor" />);
