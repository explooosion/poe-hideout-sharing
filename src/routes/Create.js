import React, { useState, useEffect } from 'react';
import './Create.scss';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TiFeather } from "react-icons/ti";
import { Redirect, Link, useParams, useHistory } from 'react-router-dom';
import Files from 'react-files';
import HideoutParse from 'hideout-parse';
import { v1 as uuid } from 'uuid';
import moment from 'moment';
import Cookies from 'js-cookie';
import HTML from 'html-parse-stringify';
import _ from 'lodash';
// import LZ4 from 'lz4';

import { InputText } from 'primereact/inputtext';
import { Spinner } from 'primereact/spinner';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Captcha } from 'primereact/captcha';
import { Growl } from 'primereact/growl';

import Editor from '../components/Editor';
import MasterLayout from '../layout/MasterLayout';
import HideoutList from '../interface/HideoutList';
import Session from '../service/Session';
import { formatImgTagFromContent } from '../utils/Format';

// const defaultModelImg = 'https://via.placeholder.com/392x220?text=Path+Of+Exile';
import defaultModelImg from '../images/default-thumbnail.jpg';

import { updateHideout, createHideout } from '../actions';

function Create() {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.auth);
  const { hideouts } = useSelector(state => state.firebase);

  const stepForPublish = 4;
  let growl;

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('my hideout');
  const [description, setDescription] = useState('thhis is an hideout');
  const [version, setVersion] = useState(1);
  const [formContent, setFormContent] = useState('');
  const [thumbnail, setThumbnail] = useState(defaultModelImg);
  const [thumbnails, setThumbnails] = useState([]);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileChoose, setFileChoose] = useState('');
  const [fileProgressShow, setFileProgressShow] = useState(false);
  const [captcha, setCaptcha] = useState(process.env.NODE_ENV === 'development');

  // Preload
  useEffect(() => {
    if (id) {
      const h = hideouts.find(hideout => hideout.id === id);
      console.log('load exiest by id', id);
      if (h) {
        setTitle(h.title);
        setDescription(h.description);
        setVersion(h.version);
        setFormContent(h.formContent);
        setThumbnail(h.thumbnail);
        setFileContent(h.fileContent);
        onThumbnailsUpdate(h.formContent);
      }
    }
  }, [hideouts, id]);

  const onCancelCreate = () => {
    console.log('onCancelCreate');
    if (formContent === '') return history.push('/');
    return window.confirm('Leave without saving changes?')
      ? history.push('/')
      // Remove backup
      // ? Cookies.remove('formContent') & history.push('/')
      : null;
  }

  const onNextStep = () => {
    console.log('onNextStep')
    if (step + 1 === stepForPublish) {
      onCheckMode();
    } else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    };
  }

  const onPreviousStep = () => {
    console.log('onPreviousStep')
    if (step - 1 <= 0) {
      return;
    } else {
      setStep(step - 1);
      window.scrollTo(0, 0);
    };
  }

  const onEditorUpdate = value => {
    console.log('onEditorUpdate');
    setFormContent(value);
    // onThumbnailsUpdate(value);
    // Backup formContent
    // Cookies.set('formContent', value);
  }

  const onThumbnailUpdate = e => {
    setThumbnail(e.target.getAttribute('src'));
  }

  const onThumbnailsUpdate = (content = '') => {
    console.log('onThumbnailsUpdate');
    const _thumbnail = formatImgTagFromContent(content);
    if (_thumbnail.length > 0) {
      setThumbnails(HTML.parse(_thumbnail.join('')).map(_t => _t.attrs.src));
    }
  }

  const onFilesChange = files => {
    try {
      const r = new FileReader();
      const _file = files[0];
      r.readAsText(_file);
      r.onload = e => {
        try { setFileContent(JSON.stringify(HideoutParse(e.target.result))); /* jsFileDownload(e.target.result, 'app.hideout'); */ }
        catch (err) { console.error('HideoutParse', err); }
      }
      setFile(_file);
      setFileChoose(_file.name);
    } catch (err) { console.error('onFilesChange', err); }
  }

  const onFilesError = (error, _file) => {
    growl.show({ severity: 'error', summary: 'Oops!', detail: error.message });
    console.error('error code ' + error.code + ': ' + error.message, _file);
  }

  const onResponseCaptcha = response => {
    console.log('onResponseCaptcha');
    if (response) setCaptcha(true);
  }

  const onCheckMode = () => {
    console.log('onCheckMode');
    if (!captcha) growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Please check the captcha.' });
    else if (id) onUpdate();
    else onPublish();
  }

  const onUpdate = () => {
    console.log('onUpdate');
    const List = {};
    List.id = id;
    List.title = title;
    List.description = description;
    List.thumbnail = thumbnail;
    List.version = version;
    List.update = moment().toString();
    List.formContent = formContent;

    if (fileChoose !== '') List.fileContent = fileContent;

    // Check payload
    let valid = true;
    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    if (valid) {
      setFileProgressShow(true);
      console.log('update', List);
      dispatch(updateHideout(List));
      setFileProgressShow(false);
      growl.show({
        severity: 'success',
        summary: 'Success Update',
        detail: title,
      });
      setStep(stepForPublish);
    }
  }

  const onPublish = () => {
    console.log('onPublish');
    const List = new HideoutList();
    List.id = uuid();
    List.title = title;
    List.description = description;
    List.authorId = user.uid;
    List.thumbnail = thumbnail;
    List.version = version;
    List.update = moment().toString();
    List.create = moment().toString();
    List.timestamp = moment().format('X');

    List.download = 0; // Math.floor(Math.random() * 500);  // Fake
    List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
    List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

    List.formContent = formContent;
    List.fileContent = fileContent;

    // Check payload
    let valid = true;
    Object.keys(List).forEach(key => {
      if (List[key].length === 0) {
        valid = false;
        console.warn('Invalid:', key);
        growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
      }
    });

    if (valid) {
      setFileProgressShow(true);
      dispatch(createHideout(List));
      setFileProgressShow(false);
      growl.show({
        severity: 'success',
        summary: 'Success Publish',
        detail: title,
      });
      // Cookies.remove('formContent');
      setStep(stepForPublish);
      // id = List.id;
    }
  }

  const renderStep = () => {
    switch (step) {
      default:
      case 1: return (
        <div>
          <div className="p-grid create-item">
            <h2 className="require">{t('CreateTitle')}</h2>
            <InputText className="p-col-12" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('CreateTitleInput')} autoFocus />
          </div>
          <div className="p-grid create-item">
            <h2>{t('CreateDescription')}</h2>
            <InputText className="p-col-12" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('CreateDescriptionInput')} autoFocus />
          </div>
          <div className="p-grid create-item">
            <h2 className="require">{t('CreateVersion')}</h2>
            <Spinner keyfilter="int" min={1} max={100} step={1} value={version} onChange={(e) => setVersion(e.target.value)} />
          </div>
          <div className="p-grid create-item">
            <h2 className="require">{t('CreateContent')}</h2>
            <Editor className="create-editor-panel" value={formContent} onChange={onEditorUpdate} />
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipImage')}</h4>
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipUpload')} <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">imgur</a></h4>
          </div>
          <div className="p-grid create-item">
            <h2 className="require">{t('CreateThumbnail')}</h2>
            <span>{t('CreateThumbnailInfo')}</span>
            <div className="create-thumbnails">{thumbnails.map((tn, index) => (<img src={tn} alt={tn} title={tn} className={thumbnail === tn ? 'selected' : ''} key={`thumbnail-${index}`} onClick={onThumbnailUpdate} />))}</div>
          </div>
          <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
            <Button label={t('CreateCancel')} className="p-button-secondary p-button-raised" onClick={onCancelCreate} />
            <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </div>
        </div>
      );
      case 2: return (
        <div>
          <div className="p-grid p-justify-center p-align-center p-dir-col">
            <h2 className={id ? null : 'require'}>{t('CreateUploadTitle')}</h2>
            <Files
              className="create-file"
              onChange={onFilesChange}
              onError={onFilesError}
              accepts={['.hideout', 'hideout/*']}
              multiple={false}
              minFileSize={0}
              maxFileSize={200 * 1024}
            >
              <div className="files-title">
                {fileChoose.length === 0 ? t('CreateUploadFile') : fileChoose}
              </div>
            </Files>
            <span className="files-message">{id ? t('CreateUploadAlertIgnore') : t('CreateUploadAlert')}</span>
            {fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px', marginTop: '1rem', borderRadius: '.25rem' }} /> : null}
          </div>
          <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
            <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={onPreviousStep} disabled={fileProgressShow} />
            <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </div>
        </div>
      );
      case 3: return (
        <div>
          <div className="p-grid p-justify-center p-align-center p-dir-col">
            <Captcha style={{ background: '#fff' }} siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={onResponseCaptcha}></Captcha>
          </div>
          <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
            <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={onPreviousStep} disabled={fileProgressShow} />
            <Button label={t('CreatePublish')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </div>
        </div>
      );
      case 4: return (
        <div className="p-grid p-justify-center p-align-center" style={{ flexFlow: 'column' }}>
          <h2 style={{ marginBottom: '1rem' }}>{t('CreateResultSuccess')}</h2>
          <Link to="/"><Button label={t('CreateFinish')} /></Link>
        </div>
      );
    }
  }

  if (!isLogin) return <Redirect to="/login" replace />;
  return (
    <MasterLayout>
      <div className="create">
        <div className="create-form">
          <h1 className="create-title">{t('CreatePageTitle')}</h1>
          {renderStep()}
        </div>
      </div>
      <Growl ref={(el) => growl = el} />
    </MasterLayout>
  );
}

export default Create;

// class ReCreate extends Component {

//   constructor(props) {
//     super(props);
//     this.dispatch = props.dispatch;
//     t = props.t;
//     this.id = props.match.params.id;
//     this.database = props.database;
//     this.auth = props.auth;
//     this.users = props.users;
//     this.state = {
//       step: 1,
//       stepForPublish: 4,
//       title: 'my hideout ',
//       description: 'this is an hideout.',
//       version: 1,
//       formContent: Cookies.get('formContent') || '',
//       thumbnail: defaultModelImg,
//       thumbnails: [],
//       fileContent: '',
//       fileChoose: '',
//       fileProgressShow: false,
//       captcha: process.env.NODE_ENV === 'development',
//     };
//   }

//   componentWillMount() {
//     if (!Session.get('auth')) this.props.history.push('/login');
//   }

//   componentDidMount() {
//     if (this.id) {
//       const h = this.database.getById(this.id);
//       if (!h) return;
//       this.setState({
//         title: h.title,
//         description: h.description,
//         version: h.version,
//         formContent: h.formContent,
//         thumbnail: h.thumbnail,
//         fileContent: h.fileContent,
//       }, () => this.onThumbnailsUpdate(formContent));
//     }
//   }

//   componentWillReceiveProps() {
//     this.id = this.props.match.params.id;
//   }

//   onThumbnailUpdate = (e) => {
//     this.setState({ thumbnail: e.target.getAttribute('src') });
//   }

//   onThumbnailsUpdate(formContent = '') {
//     const thumbnail = formatImgTagFromContent(formContent);
//     if (thumbnail.length > 0) {
//       this.setState({
//         thumbnails: HTML.parse(thumbnail.join('')).map(t => t.attrs.src),
//       });
//     }
//   }

//   /**
//    * Update editor formContent
//    * @param {string} value
//    */
//   onEditorUpdate = value => {
//     this.onThumbnailsUpdate(value);
//     this.setState({ formContent: value });
//     // Backup formContent
//     Cookies.set('formContent', value);
//   }

//   /**
//    * Choose files
//    * @param {array} files
//    */
//   onFilesChange(files = []) {
//     try {
//       const r = new FileReader();
//       const file = files[0];
//       r.readAsText(file);
//       r.onload = (e) => {
//         try {
//           this.setState({ fileContent: JSON.stringify(HideoutParse(e.target.result)) });
//           // jsFileDownload(e.target.result, 'app.hideout');
//         } catch (err) { console.error('HideoutParse', err); }
//       }
//       this.setState({ file: file, fileChoose: file.name });
//     } catch (err) { console.error('onFilesChange', err); }
//   }

//   /**
//    * File error handler
//    * @param {object} error
//    * @param {objecgt} file
//    */
//   onFilesError(error, file) {
//     this.growl.show({ severity: 'error', summary: 'Oops!', detail: error.message });
//     console.error('error code ' + error.code + ': ' + error.message, file);
//   }

//   /**
//    * Pass Captcha
//    * @param {object} response
//    */
//   onResponseCaptcha(response) {
//     if (response) this.setState({ captcha: true });
//   }

//   /**
//    * Cancel for create hideout
//    */
//   onCancelCreate() {
//     if (formContent === '') return this.props.history.push('/');
//     return window.confirm('Leave without saving changes?')
//       ? Cookies.remove('formContent') & this.props.history.push('/')
//       : null;
//   }

//   onNextStep() {
//     const step = step + 1;
//     if (step === stepForPublish) this.onCheckMode();
//     else this.setState({ step: step }, () => window.scrollTo(0, 0));
//   }

//   onPreviousStep() {
//     const step = step - 1;
//     if (step <= 0) return;
//     else this.setState({ step: step }, () => window.scrollTo(0, 0));
//   }

//   /**
//    * Check data is create or update
//    */
//   onCheckMode() {
//     if (!captcha) this.growl.show({ severity: 'warn', summary: 'Oops!', detail: 'Please check the captcha.' });
//     else if (this.id) this.onUpdate();
//     else this.onPublish();
//   }

//   async onUpdate() {
//     const List = {};
//     List.id = this.id;
//     List.title = title;
//     List.description = description;
//     List.thumbnail = thumbnail;
//     List.version = version;

//     const date = moment();
//     List.update = date.toString();
//     List.formContent = formContent;


//     if (fileChoose !== '') List.fileContent = fileContent;

//     // Check payload
//     let valid = true;
//     Object.keys(List).forEach(key => {
//       if (List[key].length === 0) {
//         valid = false;
//         console.warn('Invalid:', key);
//         this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
//       }
//     });

//     if (valid) {
//       this.setState({ fileProgressShow: true });
//       await this.database.onUpdateHideout(List);
//       this.setState({ fileProgressShow: false });
//       this.growl.show({
//         severity: 'success',
//         summary: 'Success Update',
//         detail: title,
//       });
//       this.setState({ step: stepForPublish });
//     }
//   }

//   async onPublish() {
//     const List = new HideoutList();
//     List.id = uuid();
//     List.title = title;
//     List.description = description;
//     List.authorId = _.get(Session.get('auth'), 'uid') || {};
//     List.thumbnail = thumbnail;
//     List.version = version;

//     const date = moment();
//     List.update = date.toString();
//     List.create = date.toString();
//     List.timestamp = date.format('X');

//     List.download = 0; // Math.floor(Math.random() * 500);  // Fake
//     List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
//     List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

//     List.formContent = formContent;
//     List.fileContent = fileContent;

//     // Check payload
//     let valid = true;
//     Object.keys(List).forEach(key => {
//       if (List[key].length === 0) {
//         valid = false;
//         console.warn('Invalid:', key);
//         this.growl.show({ severity: 'warn', summary: 'Oops!', detail: `Missing ${key}` });
//       }
//     });

//     if (valid) {
//       this.setState({ fileProgressShow: true });
//       await this.database.onCreateHideout(List);
//       this.setState({ fileProgressShow: false });
//       this.growl.show({
//         severity: 'success',
//         summary: 'Success Publish',
//         detail: title,
//       });
//       Cookies.remove('formContent');
//       this.setState({ step: stepForPublish });
//       this.id = List.id;
//     }
//   }

//   renderStep() {
//     switch (step) {
//       default:
//       case 1: return (
//         <div>
//           <div className="p-grid create-item">
//             <h2 className="require">{t('CreateTitle')}</h2>
//             <InputText className="p-col-12" value={title} onChange={(e) => this.setState({ title: e.target.value })} placeholder={t('CreateTitleInput')} autoFocus />
//           </div>
//           <div className="p-grid create-item">
//             <h2>{t('CreateDescription')}</h2>
//             <InputText className="p-col-12" value={description} onChange={(e) => this.setState({ description: e.target.value })} placeholder={t('CreateDescriptionInput')} autoFocus />
//           </div>
//           <div className="p-grid create-item">
//             <h2 className="require">{t('CreateVersion')}</h2>
//             <Spinner keyfilter="int" min={1} max={100} step={1} value={version} onChange={(e) => this.setState({ version: e.target.value })} />
//           </div>
//           <div className="p-grid create-item">
//             <h2 className="require">{t('CreateContent')}</h2>
//             <Editor className="create-editor-panel" value={formContent} onChange={this.onEditorUpdate} />
//             <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipImage')}</h4>
//             <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipUpload')} <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">imgur</a></h4>
//           </div>
//           <div className="p-grid create-item">
//             <h2 className="require">{t('CreateThumbnail')}</h2>
//             <span>{t('CreateThumbnailInfo')}</span>
//             <div className="create-thumbnails">{thumbnails.map((t, index) => (<img src={t} alt={t} title={t} className={thumbnail === t ? 'selected' : ''} key={`thumbnail-${index}`} onClick={this.onThumbnailUpdate} />))}</div>
//           </div>
//           <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
//             <Button label={t('CreateCancel')} className="p-button-secondary p-button-raised" onClick={() => this.onCancelCreate()} />
//             <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={() => this.onNextStep()} />
//           </div>
//         </div>
//       );
//       case 2: return (
//         <div>
//           <div className="p-grid p-justify-center p-align-center p-dir-col">
//             <h2 className={this.id ? null : 'require'}>{t('CreateUploadTitle')}</h2>
//             <Files
//               className="create-file"
//               onChange={files => this.onFilesChange(files)}
//               onError={(error, file) => this.onFilesError(error, file)}
//               accepts={['.hideout', 'hideout/*']}
//               multiple={false}
//               minFileSize={0}
//               maxFileSize={200 * 1024}
//             >
//               <div className="files-title">
//                 {fileChoose.length === 0 ? t('CreateUploadFile') : fileChoose}
//               </div>
//             </Files>
//             <span className="files-message">{this.id ? t('CreateUploadAlertIgnore') : t('CreateUploadAlert')}</span>
//             {fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px', marginTop: '1rem', borderRadius: '.25rem' }} /> : null}
//           </div>
//           <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
//             <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={() => this.onPreviousStep()} disabled={fileProgressShow} />
//             <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={() => this.onNextStep()} />
//           </div>
//         </div>
//       );
//       case 3: return (
//         <div>
//           <div className="p-grid p-justify-center p-align-center p-dir-col">
//             <Captcha style={{ background: '#fff' }} siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={res => this.onResponseCaptcha(res)}></Captcha>
//           </div>
//           <div className="p-grid create-button" style={{ marginTop: '1rem' }}>
//             <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={() => this.onPreviousStep()} disabled={fileProgressShow} />
//             <Button label={t('CreatePublish')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={() => this.onNextStep()} />
//           </div>
//         </div>
//       );
//       case 4: return (
//         <div className="p-grid p-justify-center p-align-center" style={{ flexFlow: 'column' }}>
//           <h2 style={{ marginBottom: '1rem' }}>{t('CreateResultSuccess')}</h2>
//           <Link to="/"><Button label={t('CreateFinish')} /></Link>
//         </div>
//       );
//     }
//   }

//   render() {
//     return (
//       <MasterLayout>
//         <div className="create">
//           <div className="create-form">
//             <h1 className="create-title">{t('CreatePageTitle')}</h1>
//             {this.renderStep()}
//           </div>
//         </div>
//         <Growl ref={(el) => this.growl = el} />
//       </MasterLayout>
//     );
//   }
// }

// ReCreate.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     auth: state.auth,
//     firebase: state.firebase,
//     users: state.users,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(ReCreate));
