'use strict';
import React from 'react';
import Transition from './Transition';

class Fade extends React.Component {

  constructor(props, context){
    super(props, context);
  }

  render() {
    return (
      <Transition
        {...this.props}
        in={this.props.in}
        exitClassName='fade'
        exitingClassName='fade'
        enterClassName='fade in'
        enteringClassName='fade in'
      >
        { this.props.children }
      </Transition>
    );
  }
}

Fade.propTypes = {
  in:       React.PropTypes.bool,
  dimension: React.PropTypes.oneOf(['height', 'width'])
};

Fade.defaultProps = {
  in:       false,
  dimension: 'height'
};

export default Fade;

