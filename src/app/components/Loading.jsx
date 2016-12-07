import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Loading extends Component{

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.state = {
      roll: Array(4).fill().map( () => (
        ~~(Math.random()*3)
      ) ),
      randomRotate: Array(4).fill().map( () => (
        ~~(Math.random()*30) + "deg"
      ) ),
      randomTranslateX: Array(4).fill().map( () => (
        ~~(Math.random()*10) + "px"
      ) ),
      randomTranslateY: Array(4).fill().map( () => (
        ~~(Math.random()*10) + "px"
      ) )
    }
  }

  render() {
    return (<ReactCSSTransitionGroup
        transitionName="Loading-"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        {...this.props}
      >
      { this.props.show ? <div className="Loading" >
        <div className="Loading-dice" key="dice" >
          {this.state.roll.map( (rollItem, index) => (
            <div className="Loading--randomize" key={"randomize-" + index} style={{
              transform: 'rotateZ(' + this.state.randomRotate[index] + ') translateX(' + this.state.randomTranslateX[index] + ') translateY(' + this.state.randomTranslateY[index] + ')'
            }} >
              <div className={"Loading-die Loading-die-" + this.rollValues[rollItem]} key={"die-"+index} >
                <div className="Loading-die-face Loading-die-face-z"></div>
                <div className="Loading-die-face Loading-die-face-x"></div>
                <div className="Loading-die-face Loading-die-face-y"></div>
              </div>
            </div>
          ) )}
          </div>
          { this.props.children ? <div className="Loading-message" key="message" >{this.props.children}</div> : null }
        </div> : null
      }
    </ReactCSSTransitionGroup>);
  };

  rollValues = {
    0: "minus",
    1: "null",
    2: "plus"
  }

}
