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
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
  }
}

root.render(<HelloMessage name="Taylor" />);
