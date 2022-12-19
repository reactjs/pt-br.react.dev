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
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07
  }
}

root.render(<HelloMessage name="Taylor" />);
