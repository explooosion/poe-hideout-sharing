import React, { Component, Fragment } from 'react';
import './MasterLayout.scss';

class MasterLayout extends Component {
  constructor(props) {
    super(props);
  }

  renderChildren() {
    const { children, type } = this.props;
    const layoutClassName = type ? `layout-${type} ` : '';
    return React.Children.map(children, child => {
      const { className: childClassName = '' } = child.props;
      const className = `${layoutClassName}${childClassName}`;
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
