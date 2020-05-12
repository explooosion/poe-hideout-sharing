import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TiFeather } from "react-icons/ti";
import { useParams, useHistory, Link } from 'react-router-dom';
import ReactFiles from 'react-files';
import HideoutParse from 'hideout-parse';
import HTML from 'html-parse-stringify';
import { v1 as uuid } from 'uuid';
import moment from 'moment';
import _ from 'lodash';

import { InputText } from 'primereact/inputtext';
// import { Spinner } from 'primereact/spinner';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Captcha } from 'primereact/captcha';
import { Growl } from 'primereact/growl';

import Editor from '../components/Editor';

import MasterLayout from '../layout/MasterLayout';

import HideoutList from '../interface/HideoutList';

import { getCookie, setCookie, delCookie, COOKIE_FORMCONTENT } from '../utils/Cookie';

import { formatImgTagFromContent } from '../utils/Format';

import { updateHideout, createHideout } from '../actions';

import defaultModelImg from '../images/default-thumbnail.jpg';
import bg from '../images/bg.jpg';

const Main = styled.div`
  overflow: auto;
  position: relative;
  display: block;
  width: 100vw;
  min-height: 100vh;
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  /* overwrite */
  .p-grid {
    margin: 0 0 1.5rem;
    padding: 0 1.5rem;
    max-width: 100%;
  }

  .p-editor-container {
    width: 100%;

    /* Edit content basic style */
    .p-editor-content.ql-container,
    .ql-editor {
      font-size: 17px;
      line-height: 1.7;
    }
  }
`;

const Form = styled.div`
  margin: 2rem auto 3rem;
  padding: 1rem 0 0;
  width: ${p => p.theme.screenLg};
  color: #fff;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.gray};

  @media only screen and (max-width: ${p => p.theme.screenMd}) {
    width: 90vw;
  }

  .require::after {
    content: '*';
    margin-left: .15rem;
    color: ${p => p.theme.danger};
    font-family: ${p => p.theme.headerFont};
  }
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  padding: .5rem 0 1rem;
  text-align: center;
  font-family: ${p => p.theme.headerFont};
  color: #fff;
  border-bottom: 1px solid ${p => p.theme.gray};
`;

const Thumbnails = styled.div`
  margin-top: 1rem;
  width: 100%;

  img {
    margin: 0 .5rem;
    height: 80px;
    border: 2px solid transparent;
    opacity: .5;
    transition: all .2s ease;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &.selected {
      border: 2px solid ${p => p.theme.lightWarning};
      opacity: 1;
    }
  }
`;

const Item = styled.div`
  margin-bottom: 1.75rem;

  > h2 {
    font-size: 20px;
    width: 100%;
    margin-bottom: .5rem;
    font-family: ${p => p.theme.globalFont};
  }

  > input {
    padding: .65rem .5rem;
    font-size: 16px;
    font-family: ${p => p.theme.inputFont};
  }
`;

const Buttons = styled.div`
  justify-content: center;
  border-top: 1px solid ${p => p.theme.gray};

  button {
    margin-top: 1.5rem;
    width: 200px;
    height: 40px;
    font-family: ${p => p.theme.globalFont};

    &:first-child {
      margin-right: 1rem;
    }
  }
`;

const Message = styled.span`
  display: block;
  margin: 1rem 0 .5rem;
  color: ${p => p.theme.warning};

  &::before {
    content: '【 ';
  }

  &::after {
    content: ' 】';
  }
`;

const Files = styled(ReactFiles)`

  &&& {
    margin: 1rem 0;
    text-align: center;
    cursor: pointer;
  }

  .files-title {
    overflow: hidden;
    padding: 2rem;
    max-width: 365px;
    width: 365px;
    font-size: 17px;
    text-overflow: ellipsis;
    background-color: ${p => rgba(p.theme.dark, .85)};
    color: #fff;
    letter-spacing: 1px;
    border: 1px solid ${p => p.theme.gray};
    border-radius: .5rem;
    white-space: nowrap;
    transition: all .2s ease-in-out;

    &:hover {
      background-color: ${p => rgba(p.theme.gray, .55)};
    }
  }
`;

const stepForPublish = 4;

let growl;

function Create() {

  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.auth);
  const { hideouts } = useSelector(state => state.firebase);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('my hideout');
  const [description, setDescription] = useState('thhis is an hideout');
  // const [version, setVersion] = useState(1);
  const [formContent, setFormContent] = useState('');
  const [thumbnail, setThumbnail] = useState(defaultModelImg);
  const [thumbnails, setThumbnails] = useState([]);
  // const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileChoose, setFileChoose] = useState('');
  const [fileProgressShow, setFileProgressShow] = useState(false);
  const [captcha, setCaptcha] = useState(process.env.NODE_ENV === 'development');

  // Preload
  useEffect(() => {

    const _formContent = getCookie(COOKIE_FORMCONTENT);
    if (_.isNull(_formContent) === false) {
      setFormContent(_formContent);
    }

    if (id) {
      const h = hideouts.find(hideout => hideout.id === id);
      console.log('load exiest by id', id);

      if (h) {
        setTitle(h.title);
        setDescription(h.description);
        // setVersion(h.version);
        setFormContent(h.formContent);
        setThumbnail(h.thumbnail);
        setFileContent(h.fileContent);
        onThumbnailsUpdate(h.formContent);
      }

    }
  }, [hideouts, id]);

  const onCancelCreate = () => {
    console.log('onCancelCreate');
    if (_.isEmpty(formContent)) {
      return history.goBack();
    } else {
      return window.confirm(t('CreateCancelMessage'))
        ? delCookie(COOKIE_FORMCONTENT) & history.goBack()
        : null;
    }
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
    setFormContent(value);
    onThumbnailsUpdate(value);
    // Backup formContent
    setCookie(COOKIE_FORMCONTENT, value);
  }

  const onThumbnailUpdate = e => {
    setThumbnail(e.target.getAttribute('src'));
  }

  const onThumbnailsUpdate = (content = '') => {
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
      // setFile(_file);
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

  const onUpdate = async () => {
    const List = {};
    List.id = id;
    List.title = title;
    List.description = description;
    List.thumbnail = thumbnail;
    // List.version = version;
    List.update = moment().toString();
    List.formContent = formContent;

    console.log('onUpdate', List);

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
      await dispatch(updateHideout(List));
      setFileProgressShow(false);
      growl.show({
        severity: 'success',
        summary: 'Success Update',
        detail: title,
      });
      setStep(stepForPublish);
      delCookie(COOKIE_FORMCONTENT);
    }
  }

  const onPublish = async () => {
    const List = new HideoutList();
    List.id = uuid();
    List.title = title;
    List.description = description;
    List.authorId = user.uid;
    List.thumbnail = thumbnail;
    // List.version = version;
    List.create = moment().toString();
    List.update = List.create;
    List.timestamp = moment().format('X');

    List.download = 0; // Math.floor(Math.random() * 500);  // Fake
    List.views = 0; // Math.floor(Math.random() * 3000);    // Fake
    List.favorite = 0; // Math.floor(Math.random() * 300);  // Fake

    List.formContent = formContent;
    List.fileContent = fileContent;

    console.log('onPublish', List);

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
      await dispatch(createHideout(List));
      setFileProgressShow(false);
      growl.show({
        severity: 'success',
        summary: 'Success Publish',
        detail: title,
      });
      delCookie(COOKIE_FORMCONTENT);
      setStep(stepForPublish);
    }
  }

  const renderStep = () => {
    return (
      <Fragment key={'create-step'}>

        <div style={{ display: step === 1 ? 'block' : 'none' }}>
          <Item className="p-grid">
            <h2 className="require">{t('CreateTitle')}</h2>
            <InputText className="p-col-12" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('CreateTitleInput')} autoFocus />
          </Item>
          <Item className="p-grid">
            <h2>{t('CreateDescription')}</h2>
            <InputText className="p-col-12" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('CreateDescriptionInput')} autoFocus />
          </Item>
          {
            /**
            <Item className="p-grid">
            <h2 className="require">{t('CreateVersion')}</h2>
            <Spinner keyfilter="int" min={1} max={100} step={1} value={version} onChange={(e) => setVersion(e.target.value)} />
            </Item>
            */
          }
          <Item className="p-grid">
            <h2 className="require">{t('CreateContent')}</h2>
            <Editor className="create-editor-panel" value={formContent} onChange={onEditorUpdate} />
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipImage')}</h4>
            <h4 style={{ marginTop: '.5rem', width: '100%' }}><TiFeather size="1rem" style={{ marginRight: '.25rem' }} />{t('CreateContentTipUpload')} <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer">imgur</a></h4>
          </Item>
          <Item className="p-grid">
            <h2 className="require">{t('CreateThumbnail')}</h2>
            <span>{t('CreateThumbnailInfo')}</span>
            <Thumbnails>{thumbnails.map((tn, index) => (<img src={tn} alt={tn} title={tn} className={thumbnail === tn ? 'selected' : ''} key={`thumbnail-${index}`} onClick={onThumbnailUpdate} />))}</Thumbnails>
          </Item>
          <Buttons className="p-grid" style={{ marginTop: '1rem' }}>
            <Button label={t('CreateCancel')} className="p-button-secondary p-button-raised" onClick={onCancelCreate} />
            <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </Buttons>
        </div>

        <div style={{ display: step === 2 ? 'block' : 'none' }}>
          <div className="p-grid p-justify-center p-align-center p-dir-col">
            <h2 className={id ? null : 'require'}>{t('CreateUploadTitle')}</h2>
            <Files
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
            <Message>{id ? t('CreateUploadAlertIgnore') : t('CreateUploadAlert')}</Message>
            {fileProgressShow ? <ProgressBar mode="indeterminate" style={{ height: '10px', marginTop: '1rem', borderRadius: '.25rem' }} /> : null}
          </div>
          <Buttons className="p-grid" style={{ marginTop: '1rem' }}>
            <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={onPreviousStep} disabled={fileProgressShow} />
            <Button label={t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </Buttons>
        </div>

        <div style={{ display: step === 3 ? 'block' : 'none' }}>
          <div className="p-grid p-justify-center p-align-center p-dir-col">
            <Captcha style={{ background: '#fff' }} siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={onResponseCaptcha}></Captcha>
          </div>
          <Buttons className="p-grid" style={{ marginTop: '1rem' }}>
            <Button label={t('CreatePrevious')} icon="pi pi-arrow-left" iconPos="left" className="p-button-secondary p-button-raised" onClick={onPreviousStep} disabled={fileProgressShow} />
            <Button label={t('CreatePublish')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised" onClick={onNextStep} />
          </Buttons>
        </div>

        <div className="p-grid p-justify-center p-align-center" style={{ flexFlow: 'column', display: step === 4 ? 'flex' : 'none' }}>
          <h2 style={{ marginBottom: '1rem' }}>{t('CreateResultSuccess')}</h2>
          <Link to="/"><Button label={t('CreateFinish')} /></Link>
        </div>

      </Fragment>
    );
  }

  // if (!isLogin) return <Redirect to="/login" />;

  return (
    <MasterLayout>
      <Main>
        <Form>
          <Title>{t('CreatePageTitle')}</Title>
          {renderStep()}
        </Form>
      </Main>
      <Growl ref={el => growl = el} />
    </MasterLayout>
  );
}

export default Create;
