/* eslint-disable react/jsx-fragments */
import React, { Fragment, useRef } from 'react';
import './ContentLayout.scss';

import Gotop from '../components/Gotop';

// import { BreadCrumb } from 'primereact/breadcrumb';

export default function ContentLayout(props) {

  const gotopRef = useRef(null);

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
      <div className="content">
        <div className="block" ref={gotopRef}>
          {renderChildren()}
        </div>
      </div>
      <Gotop element={gotopRef} />
    </Fragment>
  );
}
