import React, { Component } from 'react';
import './Step2.scss';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import Files from 'react-files';

import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Captcha } from 'primereact/captcha';

class Step2 extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps.state,
    }
  }

  onFilesChange(files) {
    // Single file
    this.props.onSetState({ file: files[0], fileChoose: files[0].name });
  }

  onFilesError(error, file) {
    console.error('error code ' + error.code + ': ' + error.message, file);
  }

  /**
   * Pass Captcha
   * @param {object} response
   */
  onResponseCaptcha(response) {
    if (response) this.props.onSetState({ captcha: true });
  }

  render() {
    const { onValid, onNext, onPrev, id } = this.props;
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
            minFileSize={0}
            clickable
          >
            <div className="files-title">Drop files here or click to upload</div>
            <p style={{ color: '#f00', textAlign: 'center' }}>{this.state.fileChoose}</p>
            <span className="form-valid" style={Object.assign({}, onValid(this.state.file), { textAlign: 'center' })}>
              {id ? 'Please choose the new file or ignoring.' : 'Please choose the file.'}
            </span>
            {this.state.fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} /> : null}
          </Files>
          {
            process.env.NODE_ENV !== 'development'
              ? <Captcha siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={res => this.onResponseCaptcha(res)}></Captcha>
              : null
          }
        </div>
        <div className="create-control">
          <Button label="Previous" icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => onPrev()} />
          <Button label="Submit" icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={(e) => onNext()} />
        </div>
      </div>
    );
  }
}

Step2.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default withNamespaces()(connect(mapStateToProps)(Step2));
