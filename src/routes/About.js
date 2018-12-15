import React, { Component } from 'react';
import './About.scss';

import MasterLayout from '../layout/MasterLayout';

class About extends Component {

  render() {
    return (
      <MasterLayout>
        <div className="about">
          <h1>About</h1>
        </div>
      </MasterLayout>
    );
  }
}

export default About;
