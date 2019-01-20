import React, { Component, Fragment } from 'react';
import './MenuLayout.scss';

class MenuLayout extends Component {
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
        <div className="menu">
          <h2 className="menu-title">{this.props.title || 'Menu Title'}</h2>
          {
            /* Item Template */
            /*
            <div className="item">
              <h4 className="item-title">Level</h4>
              YOUR ITEM CONTENT
            </div>
            */
            /* Item Template */
          }
          {this.renderChildren()}
        </div>
      </Fragment>
    );
  }
}

export default MenuLayout;
