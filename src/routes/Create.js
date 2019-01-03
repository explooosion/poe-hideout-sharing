import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Steps } from 'primereact/steps';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';
import { FileUpload } from 'primereact/fileupload';
import { Growl } from 'primereact/growl';

import MasterLayout from '../layout/MasterLayout';

import thumbnail from '../images/default-thumbnail.jpg';

class Create extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.state = {
      steps: [
        { label: 'Title' },
        { label: 'Detail' },
        { label: 'Publish' },
        { label: 'Finish' },
      ],
      step: 0,
      title: 'My-New-Hideout',
      description: 'This is a simple hideout.',
      version: 1,
      thumbnail: thumbnail,
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
    if (step === this.state.steps.length - 1) this.growl.show({ severity: 'success', summary: 'Success Publish', detail: this.state.title });
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
            <div className="p-grid p-justify-center group-title">
              <InputText className="p-col-11 form-title" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} placeholder="Please Input your hideout name." autoFocus />
            </div>
            <div className="create-control">
              <Link to='/'>
                <Button label="Cancel" className="p-button-secondary p-button-raised create-control-button" />
              </Link>
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="create-group">
            <h1 className="create-title">{this.state.title}</h1>
            <div className="p-grid p-justify-center">
              <div className="p-col-3">
                <label htmlFor="txtDescription">Description:</label>
              </div>
              <div className="p-col-8">
                <InputText id="txtDescription" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} placeholder="Please Input your hideout description." autoFocus />
              </div>
            </div>
            <div className="p-grid p-justify-center group-version">
              <div className="p-col-3">
                <label htmlFor="txtVersion">Version:</label>
              </div>
              <div className="p-col-8">
                <Spinner id="txtVersion" keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => this.setState({ version: e.target.value })} placeholder="Please Input your hideout version." />
              </div>
            </div>
            <div className="p-grid p-justify-center group-thumbnail">
              <div className="p-col-3">
                <label htmlFor="txtThumbnail">Thumbnail:</label>
                <small>( jpg | png | gif )</small>
              </div>
              <div className="p-col-8">
                <InputText className="form-thumbnail" id="txtThumbnail" value={this.state.thumbnail} onChange={(e) => this.setState({ thumbnail: e.target.value })} placeholder="Please Input your hideout thumbnail url." />
                <img src={this.state.thumbnail} />
                <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">Need to upload?</a>
              </div>
            </div>
            <div className="create-control">
              <Button label="Previous" icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => this.onPrev()} />
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="create-group">
            <h1 className="create-title">Upload hideout file.</h1>
            <br />
            <div className="p-grid p-justify-center">
              <FileUpload name="demo" url="./upload" accept=".hideout"></FileUpload>
            </div>
            <div className="create-control">
              <Button label="Previous" icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => this.onPrev()} />
              <Button label="Submit" icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={(e) => this.onNext()} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="create-group">
            <h1 className="create-title">Publish!</h1>
            <div className="create-control">
              <Link to='/'>
                <Button label="Check It Out" className="p-button-raised create-control-button" />
              </Link>
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
            <Steps className="create-steps" model={this.state.steps} activeIndex={this.state.step} onSelect={(e) => this.onNext(e.index)} readOnly={true} />
            {this.renderSteps()}
          </div>
        </div>
        <Growl ref={(el) => this.growl = el} />
      </MasterLayout>
    );
  }
}

Create.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(Create);
