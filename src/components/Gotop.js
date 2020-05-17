import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { useScroll } from 'react-use';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Main = styled.i`
  position: absolute;
  bottom: 35px;
  right: 40px;
  color:  ${p => lighten(0.2, p.theme.primary)};
  opacity: 0;
`;

export default function Gotop(props) {
  const { y } = useScroll(props.element);

  const minY = 200;

  const onClick = () => {
    const { current: element } = props.element;
    if (_.isElement(element) && y > 200) {
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
        fontSize: '4em',
        opacity: y / 1000,
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
