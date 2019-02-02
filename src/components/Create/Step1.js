import React, { Component } from 'react';
import './Step1.scss';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { FaTrashAlt } from 'react-icons/fa';

import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { Spinner } from 'primereact/spinner';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';

import HideoutScreenshot from '../../interface/HideoutScreenshot';

const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';

class Step1 extends Component {

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

  /**
   * Delete preview image or yotube
   * @param {string} source
   */
  onDeletePreviewImage(source) {
    const screenshotList = this.state.screenshotList.filter(({ url }) => url !== source);
    this.props.onSetState({ screenshotList });
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

    this.props.onSetState({
      screenshotModel: false,
      screenshotModelUrl: '',
      screenshotModelType: 'image',
      screenshotModelImg: defaultModelImg,
      screenshotList: list,
    });
  }

  onScreenshotModelUrlChange(url) {
    const URL = url === '' ? defaultModelImg : url;
    this.props.onSetState({
      screenshotModelUrl: url,
      screenshotModelImg: URL,
    });
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

  render() {
    const { onSetState, onValid, onNext, onPrev } = this.props;
    return (
      <div className="create-group">
        <h1 className="create-title">{this.state.title}</h1>
        <div className="p-grid p-justify-center">
          <div className="p-col-3">
            <label htmlFor="txtDescription">{this.t('Create1Description')}:</label>
          </div>
          <div className="p-col-8">
            <InputText id="txtDescription" value={this.state.description} onChange={(e) => onSetState({ description: e.target.value })} placeholder={this.t('Create1DescriptionInput')} autoFocus />
            <span className="form-valid" style={onValid(this.state.description)}>{this.t('Create1DescriptionAlert')}</span>
          </div>
        </div>
        <div className="p-grid p-justify-center group-version">
          <div className="p-col-3">
            <label htmlFor="txtVersion">{this.t('Create1Version')}:</label>
          </div>
          <div className="p-col-8">
            <Spinner id="txtVersion" keyfilter="int" min={1} max={100} step={1} value={this.state.version} onChange={(e) => onSetState({ version: e.target.value })} />
            <span className="form-valid" style={onValid(this.state.version)}>{this.t('Create1VersionAlert')}</span>
          </div>
        </div>
        <div className="p-grid p-justify-center group-thumbnail">
          <div className="p-col-3">
            <label htmlFor="txtThumbnail">{this.t('Create1Thumbnail')}:</label>
            <small>( jpg | png | gif )</small>
          </div>
          <div className="p-col-8">
            <InputText className="form-thumbnail" id="txtThumbnail" value={this.state.thumbnail} onChange={(e) => onSetState({ thumbnail: e.target.value })} placeholder={this.t('Create1ThumbnailInput')} />
            <span className="form-valid" style={onValid(this.state.thumbnail)}>{this.t('Create1ThumbnailAlert')}</span>
            <img src={this.state.thumbnail} alt={this.state.thumbnail} />
            <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">{this.t('Create1ThumbnailHelp')}</a>
          </div>
        </div>
        <div className="p-grid p-justify-center group-screenshot">
          <div className="p-col-3">
            <label htmlFor="txtThumbnail">{this.t('Create1Screenshot')}:</label>
          </div>
          <div className="p-col-8">
            <Button label={this.t('Create1ScreenshotAdd')} icon="pi pi-plus" iconPos="left" className="p-button-raised" onClick={() => onSetState({ screenshotModel: true })} />
            <Button label={this.t('Create1ScreenshotReset')} icon="pi pi-replay" iconPos="left" className="p-button-secondary p-button-raised" onClick={() => onSetState({ screenshotList: [] })} />
            <Dialog
              className="screenshot-model"
              header={this.t('Create1ScreenshotModelHeader')}
              visible={this.state.screenshotModel}
              modal={true}
              onHide={() => onSetState({ screenshotModel: false })}
            /* dismissableMask={true} */
            >d
              <div className="model-row">
                <label htmlFor="txtScreenshotUrl">{this.t('Create1ScreenshotModelType')}:</label>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <SelectButton
                    style={{ marginTop: '.25rem' }}
                    value={this.state.screenshotModelType}
                    options={this.state.screenshotModelTypes}
                    onChange={(e) => onSetState({ screenshotModelType: e.value, screenshotModelUrl: '', screenshotModelImg: defaultModelImg })}
                  >
                  </SelectButton>
                  <Button label={this.t('Create1ScreenshotModelAdd')} className="p-button-raised" style={{ width: '80px' }} onClick={() => this.onAddScreenshot()} />
                </div>
                <label htmlFor="txtScreenshotUrl">{this.t('Create1ScreenshotModelInput')}:</label>
                <InputText id="txtScreenshotUrl" value={this.state.screenshotModelUrl} onChange={(e) => this.onScreenshotModelUrlChange(e.target.value)}></InputText>
                <span className="form-valid" style={onValid(this.state.screenshotModelUrl)}>{this.t('Create1ScreenshotModelAlert')}</span>
                <label htmlFor="txtScreenshotUrl">*.{this.t('Create1ScreenshotModelExample')}</label>
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
              style={onValid(this.state.screenshotList)}
            >
              {this.t('Create1ScreenshotAlert')}
            </span>
            {this.renderGroupPreview()}
          </div>
        </div>
        <div className="create-control">
          <Button label={this.t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised create-control-button" onClick={(e) => onPrev()} />
          <Button label={this.t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={(e) => onNext()} />
        </div>
        <Growl ref={(el) => this.growl = el} />
      </div>
    );
  }
}

Step1.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default withNamespaces()(connect(mapStateToProps)(Step1));
