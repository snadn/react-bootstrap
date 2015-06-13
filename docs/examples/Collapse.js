class T extends React.Component {
  constructor(p,c){
    super(p,c);
    this.state ={};
  }

  render(){

    return (
      <div>
        <button onClick={ ()=> this.setState({ open: !this.state.open })}>
          click
        </button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
              Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}

React.render(<T/>, mountNode);