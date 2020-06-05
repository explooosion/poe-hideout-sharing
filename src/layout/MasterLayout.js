import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  margin-top: ${p => p.theme.headerHeight};
`;

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
    <>
      <Main>
        {renderChildren()}
      </Main>
    </>
  );
}

