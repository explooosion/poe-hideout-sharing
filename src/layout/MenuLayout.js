import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

const Main = styled.div`
  display: block;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  width: ${p => p.theme.menuWidth};
  height: ${p => `calc(100vh - ${p.theme.headerHeight})`};
  text-align: left;
  color: #fff;
  background-color: ${p => rgba(p.theme.dark, .5)};
  border: 2px solid ${p => p.theme.black};
  border-top: 0;

  @media only screen and (max-width: ${p => p.theme.screenLg}) {
    display: none;
  }

  .menu-title {
    color: ${p => p.theme.warning};
    font-family: ${p => p.theme.headerFont};
    margin-bottom: 2rem;
  }

  .item {
    position: relative;
    margin-bottom: 1rem;

    .item-title {
      margin-bottom: .15rem;
    }

    .item-group {
      display: flex;
      justify-content: left;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
      }

      span {
        margin-left: .5rem;
      }
    }
  }

  /* overwrite */
  .p-dropdown .p-dropdown-panel {
    top: 30px !important;
  }
`;

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
    <>
      <Main>
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
      </Main>
    </>
  );
}
