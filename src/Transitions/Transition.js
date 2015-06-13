'use strict';
import React from 'react';
import TransitionEvents from '../utils/TransitionEvents';
import classnames from 'classnames';

function ensureTransitionEnd(node, handler, duration){
  let fired = false;
  let done = e => {
        if (!fired) {
          fired = true;
          handler(e);
        }
      };

  if ( node ) {
    TransitionEvents.addEndEventListener(node, done);
    setTimeout(done, duration);
  } else {
    setTimeout(done, 0);
  }
}

class Transition extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {};

    this.needsTransition = true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.in !== this.props.in) {
      this.needsTransition = true;
    }
  }

  componentDidUpdate() {
    this.processChild();
  }

  componentDidMount() {
    this.processChild();
  }

  processChild(){
    let needsTransition = this.needsTransition;
    let enter = this.props.in;

    if (needsTransition) {
      this.needsTransition = false;
      this[enter ? 'performEnter' : 'performLeave']();
    }
  }

  performEnter() {
    let node = React.findDOMNode(this);

    this.props.onEnter(node);

    this.setState({ in: true, transitioning: true }, ()=> {
      this.props.onEntering(node);

      ensureTransitionEnd(node, () => {
        if ( this.state.in ){
          this.setState({
            transitioning: false
          }, () => this.props.onEntered(node));
        }

      }, this.props.duration);
    });
  }

  performLeave() {
    let node = React.findDOMNode(this);

    node = this.props.transitioningNode(node) || node;

    this.props.onExit(node);

    this.setState({ in: false, transitioning: true }, () => {
      this.props.onExiting(node);

      ensureTransitionEnd(node, () => {
        if ( !this.state.in ){
          this.setState({ transitioning: false }, ()=> this.props.onExited(node));
        }
      }, this.props.duration);
    });
  }

  render() {
    let child = this.props.children;
    let out = !this.state.in && !this.state.transitioning;

    if ( !child || (this.props.unmountOnExit && out) ){
      return null;
    }

    let classes = '';

    if (this.state.in && !this.state.transitioning) {
      classes += this.props.enterClassName;
    }

    if (this.state.in && this.state.transitioning) {
      classes += this.props.enteringClassName;
    }

    if (!this.state.in && !this.state.transitioning) {
      classes += this.props.exitClassName;
    }

    if (!this.state.in && this.state.transitioning) {
      classes += this.props.exitingClassName;
    }

    return React.cloneElement(child, {
      className: classnames(child.props.className, this.props.className, classes)
    });
  }
}

Transition.propTypes = {
  in:                React.PropTypes.bool,
  unmountOnExit:     React.PropTypes.bool,
  duration:          React.PropTypes.number,

  exitClassName:     React.PropTypes.string,
  exitingClassName:  React.PropTypes.string,
  enterClassName:    React.PropTypes.string,
  enteringClassName: React.PropTypes.string,

  transitioningNode: React.PropTypes.func,
  onEnter:     React.PropTypes.func,
  onEntering: React.PropTypes.func,
  onEntered:  React.PropTypes.func,
  onExit:     React.PropTypes.func,
  onExiting:  React.PropTypes.func,
  onExited:   React.PropTypes.func
};

Transition.defaultProps = {
  in:       false,
  duration: 300,
  transitioningNode: ()=>{},
  onEnter:    ()=>{},
  onEntering: ()=>{},
  onEntered:  ()=>{},

  onExit:     ()=>{},
  onExiting:  ()=>{},
  onExited:   ()=>{}
};

export default Transition;
