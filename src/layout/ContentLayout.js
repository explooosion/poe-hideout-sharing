import React, { useRef } from 'react';
import styled from 'styled-components';

import Gotop from '../components/Gotop';

// import { BreadCrumb } from 'primereact/breadcrumb';

const Main = styled.div`
  display: block;
  width: ${p => `calc(100vw - ${p.theme.menuWidth})`};

  @media only screen and (max-width:  ${p => p.theme.screenLg}) {
    width: 100%;
  }

  .bread {
    text-align: left;
    border: 0;
    border-bottom: 1px solid #eee;
    border-radius: 0;
  }

  .block {
    overflow-y: auto;
    display: block;
    padding: 1.5rem 2rem 2rem;
    width: 100%;
    height: ${p => `calc(100vh - ${p.theme.headerHeight} - ${p.theme.breadHeight})`};
  }
`;

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
    <>
      <Main>
        <div className="block" ref={gotopRef}>
          {renderChildren()}
        </div>
      </Main>
      <Gotop element={gotopRef} />
    </>
  );
}
