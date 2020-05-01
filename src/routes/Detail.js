import React, { useState } from 'react';
import './Detail.scss';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import { Link, useParams, useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import jsFileDownload from 'js-file-download';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DeferredContent } from 'primereact/deferredcontent';
import { Growl } from 'primereact/growl';
import { SplitButton } from 'primereact/splitbutton';
import { TabMenu } from 'primereact/tabmenu';

import ContentLayout from '../layout/ContentLayout';
import DetailMenu from '../components/DetailMenu';
import HideoutList from '../interface/HideoutList';
import Session from '../service/Session';
import { formatHideoutObject, formatHideoutFromFileContent } from '../utils/Format';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();

function Detail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const { hideouts, users } = useSelector(state => state.firebase);
  const { isLogin, user } = useSelector(state => state.auth);

  let growl;
  let FileContent = { Objects: [] };

  const shareButtonItems = [
    {
      label: 'FaceBook',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${document.URL}`, '_blank'),
    },
    {
      label: 'Google',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://plus.google.com/share?url=${document.URL}`, '_blank'),
    },
    {
      label: 'Twitter',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://twitter.com/intent/tweet?text=${document.URL}`, '_blank'),
    },
  ];

  const tabMenu = [
    { label: t('DetailPreview'), icon: 'pi pi-images' },
    { label: t('DetailItems'), icon: 'pi pi-list' },
    { label: t('DetailCode'), icon: 'pi pi-file' },
  ];

  const [activeItem, setActiveItem] = useState(0);

  let hideout = new HideoutList();
  hideout = hideouts.find(h => h.id === id);

  if (_.isUndefined(hideout)) return null;

  const { title, views, download, favorite, authorId, update, description, fileContent } = hideout;
  const { uname } = users.find(u => u.uid === authorId) || { uname: 'Unknown' };

  try { FileContent = JSON.parse(fileContent); }
  catch (e) { console.error('renderItems', e); }

  // Caculate total cost
  const COST = FileContent.Objects
    .map(c => Number(hideoutAPI.getDoodadByHash(c.Hash).Cost) || 0)
    .reduce((p, c) => p + c);

  const onTabChange = value => setActiveItem(value);

  /**
   * Update favorite counter
   */
  const onFavoriteClick = async () => {
    console.log('onFavoriteClick');
    // await this.database.onUpdateHideoutFavorite(this.id);
    growl.show({ severity: 'success', summary: 'Favorite Hideout', detail: 'Add successfully.' });
  }

  /**
   * Download file and update counter
   */
  const onDownloadFileClick = async (_fileContent = '') => {
    console.log('onDownloadFileClick');
    growl.show({ severity: 'info', summary: 'Download Hideout', detail: 'Start to download...' });
    jsFileDownload(formatHideoutFromFileContent(fileContent), `${title}.hideout`);
    // await this.database.onUpdateHideoutDownload(this.id);
  }


  /**
 * Switch active tab content
 * @param {object} param0
 */
  const renderDetail = h => {
    switch (activeItem.label) {
      default:
      case t('DetailPreview'): return renderForm(h.formContent);
      case t('DetailItems'): return renderItems(h.fileContent);
      case t('DetailCode'): return renderCode(h.fileContent);
    }
  }

  /**
   * Render items tab
   */
  const renderItems = () => {
    const c = FileContent;
    return (
      <div className="detail-content">
        <section className="section">
          <table className="detail-items">
            <thead>
              <tr>
                <th>{t('DetailQuantity')}</th>
                <th>{t('DetailIcon')}</th>
                <th>{t('DetailName')}</th>
                <th>{t('DetailCost')}</th>
                <th>{t('DetailMasterLevel')}</th>
                <th>{t('DetailMasterName')}</th>
              </tr>
            </thead>
            <tbody>
              {
                // use uniqBy to remove duplicates from Objects
                _.uniqBy(c.Objects, 'Hash').map((objUniq, index) => {
                  // caculate quantity
                  const quantity = c.Objects.filter((obj) => obj.Hash === objUniq.Hash).length;
                  // pick up attributes
                  const { Hash, Icon, Cost, MasterLevel, MasterName } = hideoutAPI.getDoodadByHash(objUniq.Hash);
                  // If not find then return null
                  return Hash ? (
                    <tr key={`code-${index}-${Hash}`}>
                      <td>{quantity}</td>
                      <td><img src={Icon} alt={objUniq.Name} title={objUniq.Name} /></td>
                      <td>{objUniq.Name}</td>
                      <td><NumberFormat value={Cost} displayType={'text'} thousandSeparator={true} /></td>
                      <td>{MasterLevel}</td>
                      <td>{MasterName}</td>
                    </tr>
                  ) : null; // console.warn('Can not find ', objUniq.Name);
                })
              }
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  /**
   * Render code tab
   */
  const renderCode = () => {
    const c = FileContent;
    return (
      <div className="detail-content">
        <section className="section detail-code">
          <p><b>Language</b><code className="section-title">{c.Language}</code></p>
          <p><b>Hideout Hash</b><code className="section-title">{_.get(c, 'Hideout Hash')}</code></p>
          <p><b>Hideout Name</b><code className="section-title">{_.get(c, 'Hideout Name')}</code></p>
          <hr />
          {
            c.Objects.map((o, index) =>
              (
                <div key={`code-${index}-${o.Hash}`}>
                  {index % 10 === 0 && index > 0 ? <hr /> : null}
                  <p key={`hideout-object-${index}`}>
                    <b>{o.Name}</b><code className="section-title">{formatHideoutObject(_.omit(o, 'Name'))}</code>
                  </p>
                </div>
              )
            )
          }
        </section>
      </div>
    )
  }

  const renderForm = (formContent = '') => {
    return (
      <div className="detail-content">
        <DeferredContent>
          <section className="section detail-form">
            {ReactHtmlParser(formContent)}
          </section>
        </DeferredContent>
      </div>
    );
  }

  return (
    <article className="detail">
      <DetailMenu hideout={hideout} cost={COST} />
      <ContentLayout>
        <Toolbar className="detail-author">
          <summary className="p-toolbar-group-left">
            {t('DetailPostedby')} <Link to={`/profile/${authorId}`}>{uname}</Link> {moment().startOf('hour').from(update)}
            {
              /* Edit button */
              (isLogin ? (authorId === user.uid) : false)
                ? <Link to={`/edit/${id}`}><FaEdit className="detail-button" datatype="edit" /></Link>
                : null
            }
          </summary>
          <div className="p-toolbar-group-right">
            <FaEye />
            <span className="v">{views}</span>
            <FaDownload />
            <span className="d">{download}</span>
            <FaHeart />
            <span className="f">{favorite}</span>
          </div>
        </Toolbar>
        <Toolbar className="detail-title">
          <div className="p-toolbar-group-left">
            <h2 style={{ marginLeft: '.5rem' }}>{title}</h2>
          </div>
          <div className="p-toolbar-group-right">
            <Button label={t('DetailDownload')} icon="pi pi-download" style={{ marginRight: '.25em' }} onClick={() => onDownloadFileClick(fileContent)} />
            <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} onClick={() => onFavoriteClick()} />
            <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
            <SplitButton icon="pi pi-share-alt" className="p-button-warning" style={{ marginRight: '.25em' }} model={shareButtonItems}></SplitButton>
          </div>
        </Toolbar>

        <div className="detail-description">
          {description}
        </div>

        <TabMenu className="detaild-tabmenu" model={tabMenu} activeItem={activeItem} onTabChange={(e) => onTabChange(e.value)} />
        <Growl ref={(el) => growl = el} />

        {renderDetail(hideout)}

        <div className="detail-footer">
          <Button label={t('DetailBack')} icon="pi pi-arrow-left" iconPos="left" onClick={() => history.push('/')} />
        </div>
      </ContentLayout>
    </article>
  );
}

export default Detail;

// class Detail extends Component {

//   constructor(props) {
//     super(props);
//     this.dispatch = props.dispatch;
//     t = props.t;
//     this.database = props.database;
//     this.users = props.users;
//     this.auth = props.auth;
//     this.hideoutAPI = props.hideoutAPI;
//     this.id = props.match.params.id;
//     this.hideout = new HideoutList();
//     this.fileContent = { Objects: [] };
//     this.state = {
//       tabMenu: [
//         { label: t('DetailPreview'), icon: 'pi pi-images' },
//         { label: t('DetailItems'), icon: 'pi pi-list' },
//         { label: t('DetailCode'), icon: 'pi pi-file' },
//       ],
//       activeItem: 0,
//     }
//   }

//   componentWillMount() {
//     this.database.onUpdateHideoutViews(this.id);
//   }

//   componentWillReceiveProps() {
//     this.setState({
//       tabMenu: [
//         { label: t('DetailPreview'), icon: 'pi pi-images' },
//         { label: t('DetailItems'), icon: 'pi pi-list' },
//         { label: t('DetailCode'), icon: 'pi pi-file' },
//       ],
//     });
//   }

//   /**
//    * Update active tab
//    * @param {object} value
//    */
//   onTabChange(value) {
//     this.setState({ activeItem: value });
//   }

//   /**
//    * Update favorite counter
//    */
//   async onFavoriteClick() {
//     await this.database.onUpdateHideoutFavorite(this.id);
//     this.growl.show({ severity: 'success', summary: 'Favorite Hideout', detail: 'Add successfully.' });
//   }

//   /**
//    * Download file and update counter
//    */
//   async onDownloadFileClick(fileContent = '') {
//     this.growl.show({ severity: 'info', summary: 'Download Hideout', detail: 'Start to download...' });
//     jsFileDownload(formatHideoutFromFileContent(fileContent), `${this.id}.hideout`);
//     await this.database.onUpdateHideoutDownload(this.id);
//   }

//   getShareButtonItems() {
//     return [
//       {
//         label: 'FaceBook',
//         // icon: 'pi pi-star-o',
//         command: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${document.URL}`, '_blank'),
//       },
//       {
//         label: 'Google',
//         // icon: 'pi pi-star-o',
//         command: () => window.open(`https://plus.google.com/share?url=${document.URL}`, '_blank'),
//       },
//       {
//         label: 'Twitter',
//         // icon: 'pi pi-star-o',
//         command: () => window.open(`https://twitter.com/intent/tweet?text=${document.URL}`, '_blank'),
//       },
//     ];
//   }

//   /**
//    * Switch active tab content
//    * @param {object} param0
//    */
//   renderDetail({ formContent, fileContent }) {
//     const { label } = this.state.activeItem;
//     switch (label) {
//       default:
//       case t('DetailPreview'): return this.renderForm(formContent);
//       case t('DetailItems'): return this.renderItems(fileContent);
//       case t('DetailCode'): return this.renderCode(fileContent);
//     }
//   }

//   /**
//    * Render items tab
//    */
//   renderItems() {
//     const c = this.fileContent;
//     return (
//       <div className="detail-content">
//         <section className="section">
//           <table className="detail-items">
//             <thead>
//               <tr>
//                 <th>{t('DetailQuantity')}</th>
//                 <th>{t('DetailIcon')}</th>
//                 <th>{t('DetailName')}</th>
//                 <th>{t('DetailCost')}</th>
//                 <th>{t('DetailMasterLevel')}</th>
//                 <th>{t('DetailMasterName')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 // use uniqBy to remove duplicates from Objects
//                 _.uniqBy(c.Objects, 'Hash').map((objUniq, index) => {
//                   // caculate quantity
//                   const quantity = c.Objects.filter((obj) => obj.Hash === objUniq.Hash).length;
//                   // pick up attributes
//                   const { Hash, Icon, Cost, MasterLevel, MasterName } = this.hideoutAPI.getDoodadByHash(objUniq.Hash);
//                   // If not find then return null
//                   return Hash ? (
//                     <tr key={`code-${index}-${Hash}`}>
//                       <td>{quantity}</td>
//                       <td><img src={Icon} alt={objUniq.Name} title={objUniq.Name} /></td>
//                       <td>{objUniq.Name}</td>
//                       <td><NumberFormat value={Cost} displayType={'text'} thousandSeparator={true} /></td>
//                       <td>{MasterLevel}</td>
//                       <td>{MasterName}</td>
//                     </tr>
//                   ) : null; // console.warn('Can not find ', objUniq.Name);
//                 })
//               }
//             </tbody>
//           </table>
//         </section>
//       </div>
//     );
//   }

//   /**
//    * Render code tab
//    */
//   renderCode() {
//     t = this.props.t;
//     const c = this.fileContent;
//     return (
//       <div className="detail-content">
//         <section className="section detail-code">
//           <p><b>Language</b><code className="section-title">{c.Language}</code></p>
//           <p><b>Hideout Hash</b><code className="section-title">{_.get(c, 'Hideout Hash')}</code></p>
//           <p><b>Hideout Name</b><code className="section-title">{_.get(c, 'Hideout Name')}</code></p>
//           <hr />
//           {
//             c.Objects.map((o, index) =>
//               (
//                 <div key={`code-${index}-${o.Hash}`}>
//                   {index % 10 === 0 && index > 0 ? <hr /> : null}
//                   {/* eslint-disable-next-line no-useless-escape */}
//                   <p key={`hideout-object-${index}`}>
//                     <b>{o.Name}</b><code className="section-title">{formatHideoutObject(_.omit(o, 'Name'))}</code>
//                   </p>
//                 </div>
//               )
//             )
//           }
//         </section>
//       </div>
//     )
//   }

//   renderForm(formContent = '') {
//     return (
//       <div className="detail-content">
//         <DeferredContent>
//           <section className="section detail-form">
//             {ReactHtmlParser(formContent)}
//           </section>
//         </DeferredContent>
//       </div>
//     );
//   }

//   render() {
//     this.hideout = this.database.get().find(({ id }) => id === this.id);
//     if (!this.hideout) return <Redirect to="/" />;

//     const { title, views, download, favorite, authorId, update, description, fileContent } = this.hideout;
//     const { uname } = this.users.getById(authorId);

//     try { this.fileContent = JSON.parse(fileContent); }
//     catch (e) { console.error('renderItems', e); }

//     // Caculate total cost
//     const COST = this.fileContent.Objects
//       .map(c => Number(this.hideoutAPI.getDoodadByHash(c.Hash).Cost) || 0)
//       .reduce((p, c) => p + c);

//     return (
//       <article className="detail">
//         <DetailMenu hideout={this.hideout} cost={COST} />
//         <ContentLayout>
//           <Toolbar className="detail-author">
//             <summary className="p-toolbar-group-left">
//               {t('DetailPostedby')} <Link to={`/profile/${authorId}`}>{uname}</Link> {moment().startOf('hour').from(update)}
//               {
//                 /* Edit button */
//                 (Session.get('auth') ? (authorId === Session.get('auth').uid) : false)
//                   ? <Link to={`/edit/${this.id}`}><FaEdit className="detail-button" datatype="edit" /></Link>
//                   : null
//               }
//             </summary>
//             <div className="p-toolbar-group-right">
//               <FaEye />
//               <span className="v">{views}</span>
//               <FaDownload />
//               <span className="d">{download}</span>
//               <FaHeart />
//               <span className="f">{favorite}</span>
//             </div>
//           </Toolbar>
//           <Toolbar className="detail-title">
//             <div className="p-toolbar-group-left">
//               <h2 style={{ marginLeft: '.5rem' }}>{title}</h2>
//             </div>
//             <div className="p-toolbar-group-right">
//               <Button label={t('DetailDownload')} icon="pi pi-download" style={{ marginRight: '.25em' }} onClick={e => this.onDownloadFileClick(fileContent)} />
//               <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} onClick={e => this.onFavoriteClick()} />
//               <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
//               <SplitButton icon="pi pi-share-alt" className="p-button-warning" style={{ marginRight: '.25em' }} onClick={this.save} model={this.getShareButtonItems()}></SplitButton>
//             </div>
//           </Toolbar>
//           <div className="detail-description">
//             {description}
//           </div>
//           <TabMenu className="detaild-tabmenu" model={this.state.tabMenu} activeItem={this.state.activeItem} onTabChange={(e) => this.onTabChange(e.value)} />
//           <Growl ref={(el) => this.growl = el} />
//           {this.renderDetail(this.hideout)}
//           <div className="detail-footer">
//             <Button label={t('DetailBack')} icon="pi pi-arrow-left" iconPos="left" onClick={() => this.props.history.push('/')} />
//           </div>
//         </ContentLayout>
//       </article>
//     );
//   }
// }

// Detail.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     auth: state.auth,
//     firebase: state.firebase,
//     hideoutAPI: state.hideoutAPI,
//     users: state.users,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(Detail));
