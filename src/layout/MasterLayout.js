/* eslint-disable react/jsx-fragments */
import React, { Component, Fragment } from 'react';
import './MasterLayout.scss';

class MasterLayout extends Component {
  renderChildren() {
    const { children, type } = this.props;
    const layoutClassName = type ? `layout-${type} ` : '';
    return React.Children.map(children, child => {
      let className;
      try {
        const { className: childClassName = '' } = child.props;
        className = `${layoutClassName}${childClassName}`;
      } catch (e) {
        console.warn('renderChildren', e);
        className = `${layoutClassName}`;
      }
      return React.cloneElement(child, { className });
    });
  }

  render() {
    return (
      <Fragment>
        <div className="master">

          {this.renderChildren()}

        </div>
      </Fragment>
    );
  }
}

export default MasterLayout;
