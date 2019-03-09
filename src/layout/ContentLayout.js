import React, { Component, Fragment } from 'react';
import './ContentLayout.scss';

// import { BreadCrumb } from 'primereact/breadcrumb';

class ContentLayout extends Component {
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
        <div className="content">
          <div className="block">

            {this.renderChildren()}

          </div>
        </div>
      </Fragment>
    );
  }
}

export default ContentLayout;
