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
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
  }
}

root.render(<HelloMessage name="Taylor" />);
