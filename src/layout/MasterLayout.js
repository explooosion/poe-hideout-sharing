/* eslint-disable react/jsx-fragments */
import React, { Fragment } from 'react';
import './MasterLayout.scss';

export default function MasterLayout(props) {
  const renderChildren = () => {
    const { children, type } = props;
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

  return (
    <Fragment>
      <div className="master">
        {renderChildren()}
      </div>
    </Fragment>
  );
}

