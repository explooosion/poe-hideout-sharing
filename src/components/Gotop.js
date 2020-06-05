import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { useScroll } from 'react-use';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Main = styled.i`
  position: absolute;
  bottom: 40px;
  right: 40px;
  color:  ${p => lighten(0.2, p.theme.primary)};
  opacity: 0;
`;

export default function Gotop(props) {
  const { y } = useScroll(props.element);

  const minY = 100;

  const onClick = () => {
    const { current: element } = props.element;
    if (_.isElement(element) && y > minY) {
      element.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  return (
    <Main
      className="pi pi-arrow-circle-up"
      style={{
        fontSize: '3em',
        opacity: y / 500,
        cursor: y > minY ? 'pointer' : 'default',
        display: y > minY ? 'block' : 'none',
      }}
      onClick={onClick}
    >
    </Main>
  );
}

Gotop.propTypes = {
  element: PropTypes.object.isRequired,
};
