/* eslint-disable react/jsx-fragments */
import React, { Fragment } from 'react';
import './MenuLayout.scss';

export default function MenuLayout(props) {
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
      <div className="menu">
        <h2 className="menu-title">{props.title || 'Menu Title'}</h2>
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
        {renderChildren()}
      </div>
    </Fragment>
  );
}
