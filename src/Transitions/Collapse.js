/*eslint-disable react/prop-types */
'use strict';
import React from 'react';
import Transition from './Transition';
import domUtils from '../utils/domUtils';
import createChainedFunction from '../utils/createChainedFunction';

let capitalize = str => str[0].toUpperCase() + str.substr(1);

// reading a dimension prop will cause the browser to recalculate,
// which will let our animations work
let triggerBrowserReflow = node => node.offsetHeight; //eslint-disable-line no-unused-expressions

const MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width:  ['marginLeft', 'marginRight']
};

function getDimensionValue(dimension, elem){
  let value = elem[`offset${capitalize(dimension)}`];
  let computedStyles = domUtils.getComputedStyles(elem);
  let margins = MARGINS[dimension];

  return (value +
    parseInt(computedStyles[margins[0]], 10) +
    parseInt(computedStyles[margins[1]], 10)
  );
}

class Collapse extends React.Component {

  constructor(props, context){
    super(props, context);
  }

  render() {
    let entering = createChainedFunction(this.handleEntering.bind(this), this.props.onEntering);
    let entered = createChainedFunction(this.handleEntered.bind(this), this.props.onEntered);
    let exit = createChainedFunction(this.handleExit.bind(this), this.props.onExit);

    return (
      <Transition
        {...this.props}
        in={this.props.in}
        exitClassName='collapse'
        exitingClassName='collapsing'
        enterClassName='collapse in'
        enteringClassName='collapsing'
        onEntering={entering}
        onEntered={entered}
        onExit={exit}
      >
        { this.props.children }
      </Transition>
    );
  }

  handleEntering(elem){
    let dimension = this.props.dimension;
    elem.style[dimension] = elem[`scroll${capitalize(dimension)}`] + 'px';
  }

  handleEntered(elem){
    let dimension = this.props.dimension;
    elem.style[dimension] = null;
  }

  handleExit(elem){
    let dimension = this.props.dimension;

    elem.style[dimension] = this.props.getDimensionValue(dimension, elem) + 'px';

    triggerBrowserReflow(elem);

    elem.style[dimension] = '0';
  }
}

Collapse.propTypes = {
  ...Transition.propTypes,
  dimension: React.PropTypes.oneOf(['height', 'width']),
  getDimensionValue: React.PropTypes.funcs
};

Collapse.defaultProps = {
  in:       false,
  dimension: 'height',
  getDimensionValue
};

export default Collapse;

