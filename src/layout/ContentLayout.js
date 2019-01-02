import React, { Component, Fragment } from 'react';
import './ContentLayout.scss';

import { BreadCrumb } from 'primereact/breadcrumb';

class ContentLayout extends Component {
  constructor(props) {
    super(props);
    const { breadcrumb } = this.props;
    this.state = {
      breadcrumb: breadcrumb,
    }
  }

  renderBreadCrumbItems() {
    return this.state.breadcrumb;
  }

  renderBreadCrumbHome() {
    return {
      icon: 'pi pi-home',
      url: '/',
    };
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
        <div className="content">
          {/*
          <BreadCrumb
            className="bread"
            model={this.renderBreadCrumbItems()}
            home={this.renderBreadCrumbHome()}
          />
          */}
          <div className="block">

            {this.renderChildren()}

          </div>
        </div>
      </Fragment>
    );
  }
}

export default ContentLayout;
