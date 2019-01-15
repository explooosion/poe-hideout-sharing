import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import uuid from 'uuid/v1';
import faker from 'faker';

import { Steps } from 'primereact/steps';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';
import { FileUpload } from 'primereact/fileupload';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';

import MasterLayout from '../layout/MasterLayout';

import HideoutList from '../interface/HideoutList';
import HideoutScreenshot from '../interface/HideoutScreenshot';

import Firebase from '../service/Firebase';

const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';

const firebase = new Firebase();

class Create extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.state = {
      steps: [
        { label: 'Title' },
        { label: 'Detail' },
        { label: 'Upload' },
        { label: 'Finish' },
      ],
      step: 0,
      title: 'My-New-Hideout',
      description: 'This is a simple hideout.',
      version: 1,
      thumbnail: 'https://imgur.com/A5iSyj1.jpg',
      finishTimer: 5,
      screenshotModel: false,
      screenshotModelUrl: '',
      screenshotModelImg: defaultModelImg,
      screenshotList: [],
      screenshotModelType: 'image',
      screenshotModelTypes: [
        { label: 'Image', value: 'image' },
        { label: 'Youtube', value: 'youtube' },
      ],
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

    // If Publish Success
    if (step === this.state.steps.length - 1) {

      // create list here
      const List = new HideoutList();
      List.title = this.state.title;
      List.id = uuid();
      List.description = this.state.description;

      // fake
      List.author = 'Robby';

      // fake
      List.type = 'Backstreet';

      List.thumbnail = this.state.thumbnail;
      List.favour = Math.floor(Math.random() * 10000000);
      List.version = 1;
      List.update = new Date();
      List.create = new Date();

      // fake
      List.download = Math.floor(Math.random() * 500);
      List.views = Math.floor(Math.random() * 3000);
      List.favorite = Math.floor(Math.random() * 300);

      List.screenshots = this.state.screenshotList;

      // add hideout
      firebase.onSetHideouts(List);

      // Redirect To Home Pages
      // this.growl.show({ severity: 'success', summary: 'Success Publish', detail: this.state.title });
      // this.timer = setInterval(() => {
      //   if (this.state.finishTimer <= 0) {
      //     clearInterval(this.timer);
      //     this.props.history.push('/');
      //   } else {
      //     this.setState({
      //       finishTimer: this.state.finishTimer - 1,
      //     });
      //   };
      // }, 1000);
    }

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

  onScreenshotModelUrlChange(url) {
    const URL = url === '' ? defaultModelImg : url;
    this.setState({
      screenshotModelUrl: url,
      screenshotModelImg: URL,
    });
  }

  onAddScreenshot() {
    const list = this.state.screenshotList;
    const url = this.state.screenshotModelType === 'youtube'
      ? `https://www.youtube.com/embed/${this.state.screenshotModelUrl}?rel=0`
      : this.state.screenshotModelUrl;

    const screenshot = new HideoutScreenshot(url, this.state.screenshotModelType);
    list.push(screenshot.toJSON());

    this.setState({
      screenshotModel: false,
      screenshotModelUrl: '',
      screenshotModelType: 'image',
      screenshotModelImg: defaultModelImg,
      screenshotList: list,
    });
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
            <div className="p-grid p-justify-center group-screenshot">
              <div className="p-col-3">
                <label htmlFor="txtThumbnail">Screenshot:</label>
              </div>
              <div className="p-col-8">
                <Button label="Add" icon="pi pi-plus" iconPos="left" className="p-button-raised" onClick={(e) => this.setState({ screenshotModel: true })} />
                <Button label="Reset" icon="pi pi-replay" iconPos="left" className="p-button-secondary p-button-raised" onClick={(e) => this.setState({ screenshotList: [] })} />
                <Dialog
                  className="screenshot-model"
                  header="Add Screenshot"
                  visible={this.state.screenshotModel}
                  footer={this.renderModelFooter()}
                  modal={true}
                  onHide={(e) => this.setState({ screenshotModel: false })}
                /* dismissableMask={true} */
                >
                  <div className="model-row">
                    <label htmlFor="txtScreenshotUrl">Type:</label>
                    <SelectButton
                      style={{ marginTop: '.25rem' }}
                      value={this.state.screenshotModelType}
                      options={this.state.screenshotModelTypes}
                      onChange={(e) => this.setState({ screenshotModelType: e.value, screenshotModelUrl: '', screenshotModelImg: defaultModelImg })}
                    >
                    </SelectButton>
                    <label htmlFor="txtScreenshotUrl">Url or Youtube ID:</label>
                    <InputText id="txtScreenshotUrl" value={this.state.screenshotModelUrl} onChange={(e) => this.onScreenshotModelUrlChange(e.target.value)} />
                    <label htmlFor="txtScreenshotUrl">*.Example</label>
                    <span>Imgur: <b>https://imgur.com/A5iSyj1.jpg</b></span>
                    <span>Youtube: https://www.youtube.com/watch?v=<b>DDx1fysX5oo</b></span>
                  </div>

                  <div className="model-row">
                    {
                      this.state.screenshotModelType === 'image'
                        ? (<img className="form-screenshot" src={this.state.screenshotModelImg} />)
                        : (
                          <div className="youtube-container">
                            <iframe title="share" src={`https://www.youtube.com/embed/${this.state.screenshotModelImg}?rel=0`} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                          </div>
                        )
                    }
                  </div>
                </Dialog>
              </div>
            </div>
            <div className="p-grid p-justify-center group-preview">
              <div className="p-col-11">
                {
                  this.state.screenshotList.map(({ type, url }, index) => {
                    const KEY = `screenshot-${index}`;
                    switch (type) {
                      case 'image':
                        return (<img key={KEY} src={url} />);
                      case 'youtube':
                        return (
                          <div key={KEY} className="youtube-container">
                            <iframe title="share" src={url} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                          </div>
                        );
                      default: return;
                    }
                  })
                }
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
                <Button label={`Finish (${this.state.finishTimer})`} className="p-button-raised create-control-button" onClick={(e) => clearInterval(this.timer)} />
              </Link>
            </div>
          </div>
        );
    }
  }

  renderModelFooter() {
    return <Button label="Add" className="p-button-raised model-add" onClick={(e) => this.onAddScreenshot()} />;
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
