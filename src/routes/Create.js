import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Steps } from 'primereact/steps';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';

import MasterLayout from '../layout/MasterLayout';

class Create extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.state = {
      steps: [
        { label: 'Title' },
        { label: 'Detail' },
        { label: 'File' },
        { label: 'Finish' },
      ],
      step: 0,
      title: '',
      description: '',
      version: 1,
    }
  }

  onNext(value) {
    let step;
    if (value === undefined) {
      step = this.state.step;
      step = step >= 3 ? 3 : step + 1;
    } else {
      step = value;
    };
    this.setState({ step: step });
  }

  onPrev(value) {
    let step;
    if (value === undefined) {
      step = this.state.step;
      step = step <= 0 ? 0 : step - 1;
    } else {
      step = value;
    };
    this.setState({ step: step });
  }

  renderSteps() {
    const { step } = this.state;
    switch (step) {
      case 0:
      default:
        return (
          <div className="create-group">
            <h1 className="create-title">What is your hideout name?</h1>
            <div className="p-grid p-justify-center">
              <InputText className="p-col-10" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} placeholder="Please Input your hideout name." autoFocus />
            </div>
            <div className="create-control">
              <Link to='/'>
                <Button label="Cancel" className="p-button-secondary p-button-raised create-control-button" />
              </Link>
              <Button label="Next" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="create-group">
            <h1 className="create-title">Hideout Detail</h1>
            <div className="p-grid p-justify-center">
              <InputText id="txtTitle" className="p-col-10" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} placeholder="Please Input your hideout name." />
            </div>
            <br />
            <div className="p-grid p-justify-center">
              <label className="p-col-3" htmlFor="txtDescription">Description:</label>
              <InputText id="txtDescription" className="p-col-8" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} placeholder="Please Input your hideout description." autoFocus />
            </div>
            <div className="p-grid p-justify-center">
              <label className="p-col-3" htmlFor="txtVersion">Version:</label>
              <div className="p-col-8">
                <Spinner id="txtVersion" keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => this.setState({ version: e.target.value })} placeholder="Please Input your hideout version." />
              </div>
            </div>
            <div className="create-control">
              <Button label="Previous" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => this.onPrev()} />
              <Button label="Next" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="create-group">
            <h1 className="create-title">Step3</h1>
            <div className="create-control">
              <Button label="Previous" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => this.onPrev()} />
              <Button label="Next" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="create-group">
            <h1 className="create-title">Step4</h1>
            <div className="create-control">
              <Button label="Previous" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => this.onPrev()} />
              <Button label="Next" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <MasterLayout>
        <div className="create">
          <div className="container">
            <Steps model={this.state.steps} activeIndex={this.state.step} onSelect={(e) => this.onNext(e.index)} readOnly={false} />
            {this.renderSteps()}
          </div>
        </div>
      </MasterLayout>
    );
  }
}

Create.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(Create);
