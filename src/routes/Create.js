import React, { Component } from 'react';
import './Create.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withNamespaces } from 'react-i18next';
import uuid from 'uuid/v1';
import moment from 'moment';

import { Steps } from 'primereact/steps';
import { Growl } from 'primereact/growl';

import Session from '../service/Session';

// layout
import MasterLayout from '../layout/MasterLayout';

// Step components
import Step0 from '../components/Create/Step0';
import Step1 from '../components/Create/Step1';
import Step2 from '../components/Create/Step2';
import Step3 from '../components/Create/Step3';

// interface
import HideoutList from '../interface/HideoutList';

const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';

class Create extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.id = props.match.params.id;
    this.database = props.database;
    this.storage = props.storage;
    this.auth = props.auth;
    this.users = props.users;
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
      fileContent: '',
      fileChoose: '',
      fileProgressShow: false,
      captcha: process.env.NODE_ENV === 'development' ? true : false,
    }

    this.HKListener = this.onHotKeyNext.bind(this);
  }

  componentWillMount() {
    if (!Session.get('auth')) this.props.history.push('/login');
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
    this.hideout = this.database.get().find(({ id }) => id === this.id);
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
    if (step === this.state.steps.length - 1) {
      const status = await this.onPublish();
      if (!status) {
        this.setState({ step: step - 1 });
        return;
      }
    }

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
        if (this.state.file === null && !this.id && this.state.fileContent === '') {
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
      // console.info(result.status, result.fileName);
      if (!result.status) valid = false;
    }

    let List = {};
    const { uid } = Session.get('auth') || {};
    if (!this.id) {
      // Create new list
      List = new HideoutList();
      List.title = this.state.title;
      List.id = uuid();
      List.description = this.state.description;
      List.authorId = uid;

      List.type = JSON.parse(this.state.fileContent)['Hideout Name'] || ''; // fake
      List.thumbnail = this.state.thumbnail;
      List.version = this.state.version;

      const date = moment();
      List.update = date.toString();
      List.create = date.toString();
      List.timestamp = date.format('X');

      List.download = 0; // Math.floor(Math.random() * 500);  // Fake
      List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
      List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

      List.screenshots = this.state.screenshotList;
      List.fileName = fileName;
      List.fileContent = this.state.fileContent;

    } else {
      // Update list
      List.id = this.id;
      List.title = this.state.title;
      List.description = this.state.description;
      List.thumbnail = this.state.thumbnail;
      List.version = this.state.version;
      List.update = moment().toString();
      List.screenshots = this.state.screenshotList;
      if (this.state.fileContent !== '') {
        List.fileName = fileName;
        List.fileContent = this.state.fileContent;
        List.type = JSON.parse(this.state.fileContent)['Hideout Name'] || ''; // fake
      }
    }

    // Check payload keys
    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    // Add or update hideout
    if (valid) {
      await this.database.onSetHideouts(List, !this.id ? true : false);
      this.growl.show({
        severity: 'success',
        summary: this.id ? 'Success Update' : 'Success Publish',
        detail: this.state.title,
      });

      // Redirect to home pages
      this.timer = setInterval(() => {
        if (this.state.finishTimer <= 0) {
          clearInterval(this.timer);
          this.props.history.push('/');
        } else {
          this.setState({ finishTimer: this.state.finishTimer - 1 });
        };
      }, 1000);
    } else {
      this.setState({ fileProgressShow: false });
    }

    return valid;
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
      default: valid = false; console.warn(typeof data, data); break;
    }
    return valid
      ? { display: 'none' }
      : { display: 'block' };
  }

  /**
   * Upadte state by child
   * @param {object} state
   */
  onSetState(state) {
    this.setState(state);
  }

  renderSteps() {
    const { step } = this.state;
    switch (step) {
      case 0:
      default:
        return (
          <Step0
            state={this.state}
            history={this.props.history}
            onSetState={this.onSetState.bind(this)}
            onNext={this.onNext.bind(this)}
            onValid={this.onValid.bind(this)}
          />
        );
      case 1:
        return (
          <Step1
            state={this.state}
            onSetState={this.onSetState.bind(this)}
            onNext={this.onNext.bind(this)}
            onPrev={this.onPrev.bind(this)}
            onValid={this.onValid.bind(this)}
          />
        );
      case 2:
        return (
          <Step2
            id={this.id}
            state={this.state}
            onSetState={this.onSetState.bind(this)}
            onNext={this.onNext.bind(this)}
            onPrev={this.onPrev.bind(this)}
            onValid={this.onValid.bind(this)}
            growl={this.growl}
          />
        );
      case 3:
        return (
          <Step3
            timer={this.timer}
            state={this.state}
            onSetState={this.onSetState.bind(this)}
            onNext={this.onNext.bind(this)}
            onPrev={this.onPrev.bind(this)}
            onValid={this.onValid.bind(this)}
          />
        );
    }
  }

  render() {
    this.hideout = this.database.getById(this.id);
    // Edit mode check
    if (this.id && Session.get('auth')) {
      // Not find hideout by id
      if (!this.hideout) return <Redirect to="/" />;
      // Auth 401
      if (this.hideout.authorId !== this.auth.user.uid) return <Redirect to="/" />;
    }
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
    auth: state.auth,
    database: state.database,
    storage: state.storage,
    users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Create));
