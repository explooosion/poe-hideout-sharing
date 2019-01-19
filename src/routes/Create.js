import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Files from 'react-files';
import uuid from 'uuid/v1';
// import faker from 'faker';

import { Steps } from 'primereact/steps';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';

// layout
import MasterLayout from '../layout/MasterLayout';

// interface
import HideoutList from '../interface/HideoutList';
import HideoutScreenshot from '../interface/HideoutScreenshot';

// service
import Database from '../service/Database';
import Storage from '../service/Storage';

const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';

const db = new Database();
const storage = new Storage();

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
      file: null,
      fileChoose: '',
    }
  }

  async onNext() {
    // STEP FROM 0 TO 3
    let valid = true;
    let step = this.state.step;
    switch (step) {
      case 0: // Title
        if (this.state.title.length === 0) {
          valid = false;
          console.error('Missing title.');
        }
        break;
      case 1: // Detail
        if (this.state.description.length === 0) {
          valid = false;

        }
        if (this.state.description.length === 0) {
          valid = false;
          console.error('Missing description.');
        }
        break;
      default: break;
    }

    if (!valid) return;
    step = step >= 3 ? 3 : step + 1;
    this.setState({ step: step });

    // If publish success
    if (step === this.state.steps.length - 1)
      await this.onPublish();
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

  async onPublish() {
    // Upload file
    const { status, fileName } = await storage.uploadHideout(this.state.file);
    console.log('upload-status', status);
    console.log('upload-fileName', fileName);
    if (!status) return;

    // Create list
    const List = new HideoutList();
    List.title = this.state.title;
    List.id = uuid();
    List.description = this.state.description;
    List.author = 'Robby';    // fake
    List.type = 'Backstreet'; // fake
    List.thumbnail = this.state.thumbnail;
    List.favour = Math.floor(Math.random() * 10000000);
    List.version = 1;
    List.update = new Date();
    List.create = new Date();
    List.download = Math.floor(Math.random() * 500);  // Fake
    List.views = Math.floor(Math.random() * 3000);    // Fake
    List.favorite = Math.floor(Math.random() * 300);  // Fake
    List.screenshots = this.state.screenshotList;
    List.fileName = fileName;

    // Check payload
    let valid = false;
    Object.keys(List).forEach(key => {
      console.info('key:', key);
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
      }
    });

    // Add hideout
    if (valid) {
      const result = await db.onSetHideouts(List);
      console.log('Upload result', result);
    }

    // // Redirect to home pages
    // this.growl.show({ severity: 'success', summary: 'Success Publish', detail: this.state.title });
    // // Animation
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

  onFilesChange(files) {
    // Single file
    this.setState({ file: files[0], fileChoose: files[0].name });
  }

  onFilesError(error, file) {
    console.error('error code ' + error.code + ': ' + error.message, file);
  }

  onValid(data) {
    console.log(typeof data, data);
    let valid = true;
    switch (typeof data) {
      case 'string': valid = data.length > 0; break;
      case 'numer': valid = data > 0; break;
      default: break;
    }
    return valid
      ? { display: 'none' }
      : { display: 'block' };
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
              <span className="form-valid" style={this.onValid(this.state.title)}>Please input title.</span>
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
                <span className="form-valid" style={this.onValid(this.state.description)}>Please input description.</span>
              </div>
            </div>
            <div className="p-grid p-justify-center group-version">
              <div className="p-col-3">
                <label htmlFor="txtVersion">Version:</label>
              </div>
              <div className="p-col-8">
                <Spinner id="txtVersion" keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => this.setState({ version: e.target.value })} placeholder="Please Input your hideout version." />
                <span className="form-valid" style={this.onValid(this.state.version)}>Please input version.</span>
              </div>
            </div>
            <div className="p-grid p-justify-center group-thumbnail">
              <div className="p-col-3">
                <label htmlFor="txtThumbnail">Thumbnail:</label>
                <small>( jpg | png | gif )</small>
              </div>
              <div className="p-col-8">
                <InputText className="form-thumbnail" id="txtThumbnail" value={this.state.thumbnail} onChange={(e) => this.setState({ thumbnail: e.target.value })} placeholder="Please Input your hideout thumbnail url." />
                <span className="form-valid" style={this.onValid(this.state.thumbnail)}>Please input thumbnail.</span>
                <img src={this.state.thumbnail} alt={this.state.thumbnail} />
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
                        ? (<img className="form-screenshot" src={this.state.screenshotModelImg} alt={this.state.screenshotModelImg} />)
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
                        return (<img key={KEY} src={url} alt={url} />);
                      case 'youtube':
                        return (
                          <div key={KEY} className="youtube-container">
                            <iframe title="share" src={url} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                          </div>
                        );
                      default: return null;
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
            <h1 className="create-title">Choose hideout file.</h1>
            <br />
            <div className="p-grid p-justify-center group-upload">
              <Files
                className="files-dropzone"
                onChange={files => this.onFilesChange(files)}
                onError={(error, file) => this.onFilesError(error, file)}
                accepts={['.hideout', 'hideout/*']}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                <div className="files-title">Drop files here or click to upload</div>
                <p style={{ color: '#f00', textAlign: 'center' }}>{this.state.fileChoose}</p>
              </Files>
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
            <Steps className="create-steps" model={this.state.steps} activeIndex={this.state.step} readOnly={true} />
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
