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
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
  }
}

root.render(<HelloMessage name="Taylor" />);
