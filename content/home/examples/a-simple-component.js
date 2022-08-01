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
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
  }
}

root.render(<HelloMessage name="Taylor" />);
