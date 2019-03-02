/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import './ReCreate.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { TiFeather } from "react-icons/ti";
import { Link } from 'react-router-dom';
// import jsFileDownload from 'js-file-download';
import Files from 'react-files';
import HideoutParse from 'hideout-parse';
import uuid from 'uuid/v1';
import moment from 'moment';
import Cookies from 'js-cookie';

import { InputText } from 'primereact/inputtext';
import { Spinner } from 'primereact/spinner';
import { Button } from 'primereact/button';
// import { Editor } from 'primereact/editor';
import { ProgressBar } from 'primereact/progressbar';
import { Captcha } from 'primereact/captcha';
import { Growl } from 'primereact/growl';

import Editor from '../components/Editor';
import MasterLayout from '../layout/MasterLayout';
import HideoutList from '../interface/HideoutList';
import Session from '../service/Session';

// const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';
import defaultModelImg from '../images/default-thumbnail.jpg';

class ReCreate extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.id = props.match.params.id;
    this.database = props.database;
    this.storage = props.storage;
    this.auth = props.auth;
    this.users = props.users;
    this.state = {
      step: 1,
      title: 'my hideout ',
      description: 'this is an hideout.',
      version: 1,
      formContent: Cookies.get('formContent') || '',
      thumbnail: defaultModelImg,
      fileContent: '',
      fileChoose: '',
      fileProgressShow: false,
      captcha: process.env.NODE_ENV === 'development',
    };
  }

  componentDidMount() {
    if (this.id) {
      const h = this.database.getById(this.id);
      if (!h) return;
      this.setState({
        title: h.title,
        description: h.description,
        version: h.version,
        formContent: h.formContent,
        thumbnail: h.thumbnail,
        fileContent: h.fileContent,
      });
    }
  }

  componentWillReceiveProps() {
    this.id = this.props.match.params.id;
  }

  /**
   * Update editor formContent
   * @param {string} value
   */
  onEditorUpdate = value => {
    this.setState({ formContent: value });
    console.log(value);
    // Backup formContent
    Cookies.set('formContent', value);
  }

  /**
   * Choose files
   * @param {array} files
   */
  onFilesChange(files = []) {
    try {
      const r = new FileReader();
      const file = files[0];
      r.readAsText(file);
      r.onload = (e) => {
        try {
          this.setState({ fileContent: JSON.stringify(HideoutParse(e.target.result)) });
          // jsFileDownload(e.target.result, 'app.hideout');
        } catch (err) { console.error('HideoutParse', err); }
      }
      this.setState({ file: file, fileChoose: file.name });
    } catch (err) { console.error('onFilesChange', err); }
  }

  /**
   * File error handler
   * @param {object} error
   * @param {objecgt} file
   */
  onFilesError(error, file) {
    this.growl.show({ severity: 'error', summary: 'Oops!', detail: error.message });
    console.error('error code ' + error.code + ': ' + error.message, file);
  }

  /**
   * Pass Captcha
   * @param {object} response
   */
  onResponseCaptcha(response) {
    if (response) this.setState({ captcha: true });
  }

  /**
   * Cancel for create hideout
   */
  onCancelCreate() {
    if (this.state.formContent === '') return this.props.history.push('/');
    return window.confirm('Leave without saving changes?')
      ? Cookies.remove('formContent') & this.props.history.push('/')
      : null;
  }

  onNextStep() {
    const step = this.state.step + 1;
    if (step >= 3) this.onCheckMode();
    else this.setState({ step: step }, () => window.scrollTo(0, 0));
  }

  onPreviousStep() {
    const step = this.state.step - 1;
    if (step <= 0) return;
    else this.setState({ step: step }, () => window.scrollTo(0, 0));
  }

  /**
   * Check data is create or update
   */
  onCheckMode() {
    if (!this.state.captcha) this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Please check the captcha.' });
    else if (this.id) this.onUpdate();
    else this.onPublish();
  }

  async onUpdate() {
    const List = {};
    List.id = this.id;
    List.title = this.state.title;
    List.description = this.state.description;
    List.thumbnail = this.state.thumbnail;
    List.version = this.state.version;

    const date = moment();
    List.update = date.toString();
    List.formContent = this.state.formContent;
    if (this.state.fileChoose !== '') List.fileContent = this.state.fileContent;

    // Check payload
    let valid = true;
    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    if (valid) {
      this.setState({ fileProgressShow: true });
      await this.database.onUpdateHideout(List);
      this.setState({ fileProgressShow: false });
      this.growl.show({
        severity: 'success',
        summary: 'Success Update',
        detail: this.state.title,
      });
      this.setState({ step: 3 });
    }
  }

  async onPublish() {
    const List = new HideoutList();
    List.id = uuid();
    List.title = this.state.title;
    List.description = this.state.description;
    List.authorId = Session.get('auth').uid || {};
    List.thumbnail = this.state.thumbnail;
    List.version = this.state.version;

    const date = moment();
    List.update = date.toString();
    List.create = date.toString();
    List.timestamp = date.format('X');

    List.download = 0; // Math.floor(Math.random() * 500);  // Fake
    List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
    List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

    List.formContent = this.state.formContent;
    List.fileContent = this.state.fileContent;

    // Check payload
    let valid = true;
    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    if (valid) {
      this.setState({ fileProgressShow: true });
      await this.database.onCreateHideout(List);
      this.setState({ fileProgressShow: false });
      this.growl.show({
        severity: 'success',
        summary: 'Success Publish',
        detail: this.state.title,
      });
      Cookies.remove('formContent');
      this.setState({ step: 3 });
      this.id = List.id;
    }
  }

  renderStep() {
    switch (this.state.step) {
      default:
      case 1: return (
        <div>
          <div className="p-grid create-item">
            <h2 className="require">{this.t('Create0Title')}</h2>
            <InputText className="p-col-12" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} placeholder={this.t('Create0TitleInput')} autoFocus />
          </div>
          <div className="p-grid create-item">
            <h2>{this.t('Create1Description')}</h2>
            <InputText className="p-col-12" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} placeholder={this.t('Create1DescriptionInput')} autoFocus />
          </div>
          <div className="p-grid create-item">
            <h2 className="require">{this.t('Create1Version')}</h2>
            <Spinner keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => this.setState({ version: e.target.value })} />
          </div>
          <div className="p-grid create-item">
            <h2 className="require">Content</h2>
            <Editor className="create-editor-panel" value={this.state.formContent} onChange={this.onEditorUpdate} />
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />You can insert the image with copy paste.</h4>
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />Need to upload? <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">imgur</a></h4>
          </div>
          <div className="p-grid create-item">
            <h2 className="require">{this.t('Create1Thumbnail')}</h2>
            <span>Choose images in editor content for thumbnail.</span>
          </div>
          <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
            <Button label={this.t('CreateCancel')} className="p-button-secondary p-button-raised" onClick={() => this.onCancelCreate()} />
            <Button label={this.t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={() => this.onNextStep()} />
          </div>
        </div>
      );
      case 2: return (
        <div>
          <div className="p-grid p-justify-center p-align-center p-dir-col">
            <h2 className={this.id ? null : 'require'}>Hideout File</h2>
            <Files
              className="create-file"
              onChange={files => this.onFilesChange(files)}
              onError={(error, file) => this.onFilesError(error, file)}
              accepts={['.hideout', 'hideout/*']}
              multiple={false}
              minFileSize={0}
              maxFileSize={200 * 1024}
            >
              <div className="files-title">
                {this.state.fileChoose.length === 0 ? this.t('Create2File') : this.state.fileChoose}
              </div>
              <span className="files-message">{this.id ? this.t('Create2FileAlertIgnore') : this.t('Create2FileAlert')}
              </span>
              {this.state.fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px', marginTop: '1rem', borderRadius: '.25rem' }} /> : null}
            </Files>
            <Captcha style={{ background: '#fff' }} siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={res => this.onResponseCaptcha(res)}></Captcha>
          </div>
          <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
            <Button label={this.t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={() => this.onPreviousStep()} disabled={this.state.fileProgressShow} />
            <Button label={this.t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={() => this.onNextStep()} />
          </div>
        </div>
      );
      case 3: return (
        <div className="p-grid p-justify-center p-align-center" style={{ flexFlow: 'column' }}>
          <h2 style={{ marginBottom: '1rem' }}>Successful!</h2>
          <Link to="/"><Button label="GoBack" /></Link>
        </div>
      );
    }
  }

  render() {
    return (
      <MasterLayout>
        <div className="re-create">
          <div className="create-form">
            <h1 className="create-title">Create Hideout</h1>
            {this.renderStep()}
          </div>
        </div>
        <Growl ref={(el) => this.growl = el} />
      </MasterLayout>
    );
  }
}

ReCreate.propTypes = {}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    database: state.database,
    storage: state.storage,
    users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(ReCreate));
