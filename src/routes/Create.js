import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Files from 'react-files';
import { FaTrashAlt } from 'react-icons/fa';
import uuid from 'uuid/v1';
import moment from 'moment';
import store from 'store2';

import { Steps } from 'primereact/steps';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Captcha } from 'primereact/captcha';

// layout
import MasterLayout from '../layout/MasterLayout';

// interface
import HideoutList from '../interface/HideoutList';
import HideoutScreenshot from '../interface/HideoutScreenshot';

const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';

class Create extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.id = this.props.match.params.id;
    this.database = this.props.firebase.database;
    this.storage = this.props.firebase.storage;
    this.hideout = new HideoutList();

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
      fileProgressShow: false,
      captcha: process.env.NODE_ENV === 'development' ? true : false,
    }

    this.HKListener = this.onHotKeyNext.bind(this);
  }

  componentWillMount() {
    if (!store.session('auth')) this.props.history.push('/login');
  }

  componentDidMount() {
    if (this.id) this.onEditMode();
    window.addEventListener('keypress', this.HKListener);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.HKListener);
  }

  /**
   * Next by press enter
   * @param {number} keyCode
   */
  onHotKeyNext({ keyCode }) {
    if (keyCode === 13 && this.state.step < 3) this.onNext();
  }

  /**
   * Load data by id in edit mode
   */
  onEditMode() {
    this.hideout = this.props.hideouts.Lists.find(({ id }) => id === this.id);
    if (this.hideout) {
      this.setState({
        title: this.hideout.title,
        description: this.hideout.description,
        version: this.hideout.version,
        thumbnail: this.hideout.thumbnail,
        screenshotList: this.hideout.screenshots,
        fileChoose: this.hideout.fileName,
      });
    }
  }

  async onNext() {
    // STEP FROM 0 TO 3
    let step = this.state.step;

    // onNext or onPrev event
    if (!this.onNextCheck(step)) return;
    step = step >= 3 ? 3 : step + 1;

    // onPublish event
    if (step === this.state.steps.length - 1)
      await this.onPublish();

    // Wait for onNextCheck or onPublish
    this.setState({ step: step });
  }

  /**
   * Check form on next step
   * @param {number} step
   */
  onNextCheck(step) {
    let valid = true;
    switch (step) {
      case 0: // Title
        if (this.state.title.length === 0) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing title.' });
        }
        break;
      case 1: // Detail
        if (this.state.description.length === 0) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing description.' });
        }
        if (this.state.version <= 0) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing version.' });
        }
        if (this.state.thumbnail.length === 0) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing thumbnail.' });
        }
        if (this.state.screenshotList.length === 0) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing screenshots.' });
        }
        break;
      case 2: // Upload
        if (this.state.file === null && !this.id) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing description.' });
        }
        if (!this.state.captcha) {
          valid = false;
          this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Please check the captcha.' });
        }
        break;
      default:
        valid = false;
        console.warn('Can not check step value.');
        this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing something...' });
        break;
    }
    return valid;
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
    // Check payload
    let valid = true;
    let fileName = this.state.fileChoose;

    // Check is create or update with file
    if ((this.id && this.state.file) || (!this.id && this.state.file)) {
      this.setState({ fileProgressShow: true });
      if (this.id && this.state.file) {
        // Delete old file
        console.log('wait for deletinng old file');
        await this.storage.onDeleteHideout(this.hideout.fileName);
      }
      // Upload new file
      const result = await this.storage.onUploadHideout(this.state.file);
      fileName = result.fileName;
      console.info(result.status, result.fileName);
      if (!result.status) valid = false;
    }

    let List = {};
    if (!this.id) {
      // Create new list
      List = new HideoutList();
      List.title = this.state.title;
      List.id = uuid();
      List.description = this.state.description;
      List.author = 'Robby';    // fake
      List.type = 'Backstreet'; // fake

      List.thumbnail = this.state.thumbnail;
      List.favour = Math.floor(Math.random() * 10000000); // Hideout favour
      List.version = this.state.version;

      const date = moment();
      List.update = date.format('YYYY-MM-DD, hh:mm:ss');
      List.create = date.format('YYYY-MM-DD, hh:mm:ss');
      List.timestamp = date.format('X');

      List.download = 0; // Math.floor(Math.random() * 500);  // Fake
      List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
      List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

      List.screenshots = this.state.screenshotList;
      List.fileName = fileName;

    } else {
      // Update list
      List.id = this.id;
      List.title = this.state.title;
      List.description = this.state.description;
      List.thumbnail = this.state.thumbnail;
      List.version = this.state.version;

      const date = moment();
      List.update = date.format('YYYY-MM-DD, HH:mm:ss');
      List.screenshots = this.state.screenshotList;
      List.fileName = fileName;
    }

    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    // Add or update hideout
    if (valid) {
      console.log('push', List);
      await this.database.onSetHideouts(List, !this.id ? true : false);
      this.growl.show({
        severity: 'success',
        summary: this.id ? 'Success Update' : 'Success Publish',
        detail: this.state.title,
      });

      // // Redirect to home pages
      this.timer = setInterval(() => {
        if (this.state.finishTimer <= 0) {
          clearInterval(this.timer);
          this.props.history.push('/');
        } else {
          this.setState({
            finishTimer: this.state.finishTimer - 1,
          });
        };
      }, 1000);
    } else {
      this.setState({ fileProgressShow: false });
    }
  }

  /**
   * Pass Captcha
   * @param {object} response
   */
  onResponseCaptcha(response) {
    if (response) this.setState({ captcha: true });
  }

  onScreenshotModelUrlChange(url) {
    const URL = url === '' ? defaultModelImg : url;
    this.setState({
      screenshotModelUrl: url,
      screenshotModelImg: URL,
    });
  }

  onAddScreenshot() {
    // Check input url
    if (this.state.screenshotModelUrl.length === 0) {
      this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Missing url or youtube id.' });
      return;
    };
    // Check exist url
    if (this.state.screenshotList.find(({ url }) => url === this.state.screenshotModelUrl) !== undefined) {
      this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Already in screenshot list.' });
      return;
    };

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

  /**
   * Form validation class
   * @param {any} data
   */
  onValid(data) {
    let valid = true;
    switch (typeof data) {
      case 'string': valid = data.length > 0; break;
      case 'number': valid = data > 0; break;
      case 'object':
        if (data !== null) {
          valid = data.length > 0 || data.size > 0;
          break;
        }
        valid = false; break; // for file upload
      default: valid = false; console.warn(data, typeof data); break;
    }
    return valid
      ? { display: 'none' }
      : { display: 'block' };
  }

  /**
   * Delete preview image or yotube
   * @param {string} source
   */
  onDeletePreviewImage(source) {
    const screenshotList = this.state.screenshotList.filter(({ url }) => url !== source);
    this.setState({ screenshotList });
  }

  renderGroupPreview() {
    const list = this.state.screenshotList ? this.state.screenshotList : [];
    return list.map(({ type, url }, index) => {
      const KEY = `screenshot-${index}`;
      let image;
      switch (type) {
        case 'image':
          image = (<img src={url} alt={url} />);
          break;
        case 'youtube':
          image = (
            <div className="youtube-container">
              <iframe title="share" src={url} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          );
          break;
        default:
          image = null;
          break;
      }
      return (
        <div className="group-preview-image" key={KEY}>
          <FaTrashAlt
            className="group-preview-delete"
            onClick={() => this.onDeletePreviewImage(url)}
          />
          {image}
        </div>
      )
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
              <span className="form-valid" style={this.onValid(this.state.title)}>Please set the a title.</span>
            </div>
            <div className="create-control">
              <Button label="Cancel" className="p-button-secondary p-button-raised create-control-button" onClick={() => this.props.history.goBack()} />
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={() => this.onNext()} />
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
                <span className="form-valid" style={this.onValid(this.state.description)}>Please set the description.</span>
              </div>
            </div>
            <div className="p-grid p-justify-center group-version">
              <div className="p-col-3">
                <label htmlFor="txtVersion">Version:</label>
              </div>
              <div className="p-col-8">
                <Spinner id="txtVersion" keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => this.setState({ version: e.target.value })} placeholder="Please Input your hideout version." />
                <span className="form-valid" style={this.onValid(this.state.version)}>Please set the version.</span>
              </div>
            </div>
            <div className="p-grid p-justify-center group-thumbnail">
              <div className="p-col-3">
                <label htmlFor="txtThumbnail">Thumbnail:</label>
                <small>( jpg | png | gif )</small>
              </div>
              <div className="p-col-8">
                <InputText className="form-thumbnail" id="txtThumbnail" value={this.state.thumbnail} onChange={(e) => this.setState({ thumbnail: e.target.value })} placeholder="Please Input your hideout thumbnail url." />
                <span className="form-valid" style={this.onValid(this.state.thumbnail)}>Please set the thumbnail.</span>
                <img src={this.state.thumbnail} alt={this.state.thumbnail} />
                <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">Need to upload?</a>
              </div>
            </div>
            <div className="p-grid p-justify-center group-screenshot">
              <div className="p-col-3">
                <label htmlFor="txtThumbnail">Screenshot:</label>
              </div>
              <div className="p-col-8">
                <Button label="Add" icon="pi pi-plus" iconPos="left" className="p-button-raised" onClick={() => this.setState({ screenshotModel: true })} />
                <Button label="Reset" icon="pi pi-replay" iconPos="left" className="p-button-secondary p-button-raised" onClick={() => this.setState({ screenshotList: [] })} />
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
                    <span className="form-valid" style={this.onValid(this.state.screenshotModelUrl)}>Please set the url or youtube id.</span>
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
                <span
                  className="form-valid"
                  style={this.onValid(this.state.screenshotList)}
                >
                  Please add screenshotLists.
                </span>
                {this.renderGroupPreview()}
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
            <h1 className="create-title">Choose your hideout file.</h1>
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
                <span className="form-valid" style={Object.assign({}, this.onValid(this.state.file), { textAlign: 'center' })}>
                  {this.id ? 'Please choose the new file or ignoring.' : 'Please choose the file.'}
                </span>
                {this.state.fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} /> : null}
              </Files>
              {
                process.env.NODE_ENV !== 'development'
                  ? <Captcha siteKey="6Lc8BI0UAAAAAKiq9Lu8ZYXO88T9FeFAnbEqNNA1" onResponse={res => this.onResponseCaptcha(res)}></Captcha>
                  : null
              }
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
    this.hideout = this.props.hideouts.Lists.find(({ id }) => id === this.id);

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
  return {
    hideouts: state.hideouts,
    firebase: state.firebase,
  }
}

export default connect(mapStateToProps)(Create);
