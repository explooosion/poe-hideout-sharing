import React, { useState } from 'react';
import './HomeMenu.scss';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';
import _ from 'lodash';

import MenuLayout from '../layout/MenuLayout';

function HomeMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hideoutAPI = useSelector(state => state.hideoutAPI);

  const [type] = useState('');

  console.log(hideoutAPI);

  // const getHideoutsType =>() {
  //   return hideoutAPI.get(this.props.lng).map(({ Icon, Name }) => ({
  //     img: Icon,
  //     label: Name.replace('Hideout', '').trim(),
  //     value: Name.replace('Hideout', '').trim(),
  //   }))
  // }

  return (
    <MenuLayout title={t('HomeHideout')}>
      <div className="home-menu">
        <div className="item">
          <h4 className="item-title">{t('HomeHideoutType')}</h4>
          <Dropdown
            style={{ width: '100%' }}
            value={type}
            // options={this.getHideoutsType()}
            // onChange={(e) => this.onFilterChange({ type: e.value })}
            filter={true}
            filterPlaceholder={`${t('HomeFilter')}...`}
            placeholder={t('HomeSelectType')}
            // itemTemplate={this.renderHideoutTemplate}
            showClear={true}
          />
        </div>
        <Fieldset
          legend={`${t('HomeOptions')}(NotYet)`}
          toggleable={true}
        // collapsed={this.state.panelOptions}
        // onToggle={(e) => this.setState({ panelOptions: e.value })}
        >
          <div className="item">
            <h4 className="item-title">MTX</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.mtx}
              // options={this.getOptions('mtxs')}
              // onChange={(e) => this.onSelectChange({ mtx: e.value })}
              placeholder="Select MTX"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Minimum Rating</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.mini_rating}
              // options={this.getOptions('mini_ratings')}
              // onChange={(e) => this.onSelectChange({ mini_rating: e.value })}
              placeholder="Select Minimum Rating"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Alva Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.alva_level}
              // options={this.getOptions('alva_levels')}
              // onChange={(e) => this.onSelectChange({ alva_level: e.value })}
              placeholder="Select Alva Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Einhar Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.einhar_level}
              // options={this.getOptions('einhar_levels')}
              // onChange={(e) => this.onSelectChange({ einhar_level: e.value })}
              placeholder="Select Einhar Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Niko Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.niko_level}
              // options={this.getOptions('niko_levels')}
              // onChange={(e) => this.onSelectChange({ niko_level: e.value })}
              placeholder="Select Niko Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Zana Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              // value={this.state.zana_level}
              // options={this.getOptions('zana_levels')}
              // onChange={(e) => this.onSelectChange({ zana_level: e.value })}
              placeholder="Select Zana Level"
            />
          </div>
        </Fieldset>
        <div className="item">
          <h4 className="item-title">{t('HomeDownload')}</h4>
          <SelectButton
          // value={this.state.download}
          // options={this.renderSelectButton()}
          // onChange={(e) => this.onSortChange({ download: e.value })}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">{t('HomeViews')}</h4>
          <SelectButton
          // value={this.state.views}
          // options={this.renderSelectButton()}
          // onChange={(e) => this.onSortChange({ views: e.value })}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">{t('HomeFavorite')}</h4>
          <SelectButton
          // value={this.state.favorite}
          // options={this.renderSelectButton()}
          // onChange={(e) => this.onSortChange({ favorite: e.value })}
          >
          </SelectButton>
        </div>
      </div>
    </MenuLayout>
  );
}

export default HomeMenu;

// class HomeMenu extends Component {

//   constructor(props) {
//     super(props);
//     this.dispatch = props.dispatch;
//     this.hideoutAPI = props.hideoutAPI;
//     t = props.t;
//     this.state = {
//       download: '',
//       views: '',
//       favorite: '',
//       type: '',
//       mtx: null,
//       mini_rating: null,
//       alva_level: null,
//       einhar_level: null,
//       niko_level: null,
//       zana_level: null,
//       panelOptions: true,
//     };
//   }

//   onSortChange(state) {
//     this.setState(state);
//     const key = Object.keys(state)[0];
//     this.props.onSortChange(key, state[key]);
//   }

//   onFilterChange(states = { type: '' }) {
//     const state = _.pick(states, 'type');
//     this.setState(state);
//     const key = Object.keys(state)[0];
//     this.props.onFilterChange(key, state[key]);
//   }

//   onSelectChange(state) {
//     this.setState(state);
//   }

//   /**
//    * Get options by key
//    * @param {string} key
//    */
//   getOptions(key) {
//     return {
//       mtxs: [
//         { label: t('HomeAll'), value: null },
//         { label: t('HomeYes'), value: true },
//         { label: t('HomeNo'), value: false },
//       ],
//       mini_ratings: [
//         { label: t('HomeAll'), value: null },
//         { label: '1', value: 1 },
//         { label: '2', value: 2 },
//         { label: '3', value: 3 },
//         { label: '4', value: 4 },
//         { label: '5', value: 5 },
//       ],
//       alva_levels: [
//         { label: t('HomeAll'), value: null },
//         { label: '1', value: 1 },
//         { label: '2', value: 2 },
//         { label: '3', value: 3 },
//         { label: '4', value: 4 },
//         { label: '5', value: 5 },
//         { label: '6', value: 6 },
//         { label: '7', value: 7 },
//       ],
//       einhar_levels: [
//         { label: t('HomeAll'), value: null },
//         { label: '1', value: 1 },
//         { label: '2', value: 2 },
//         { label: '3', value: 3 },
//         { label: '4', value: 4 },
//         { label: '5', value: 5 },
//         { label: '6', value: 6 },
//         { label: '7', value: 7 },
//       ],
//       niko_levels: [
//         { label: t('HomeAll'), value: null },
//         { label: '1', value: 1 },
//         { label: '2', value: 2 },
//         { label: '3', value: 3 },
//         { label: '4', value: 4 },
//         { label: '5', value: 5 },
//         { label: '6', value: 6 },
//         { label: '7', value: 7 },
//       ],
//       zana_levels: [
//         { label: t('HomeAll'), value: null },
//         { label: '1', value: 1 },
//         { label: '2', value: 2 },
//         { label: '3', value: 3 },
//         { label: '4', value: 4 },
//         { label: '5', value: 5 },
//         { label: '6', value: 6 },
//         { label: '7', value: 7 },
//       ],
//     }[key];
//   }

//   getHideoutsType() {
//     return this.hideoutAPI.get(this.props.lng).map(({ Icon, Name }) => ({
//       img: Icon,
//       label: Name.replace('Hideout', '').trim(),
//       value: Name.replace('Hideout', '').trim(),
//     }))
//   }

//   renderHideoutTemplate(option) {
//     return (
//       <div className="p-clearfix item-group">
//         <img alt={option.label} src={option.img} />
//         <span>{option.label}</span>
//       </div>
//     );
//   }

//   renderSelectButton() {
//     return [
//       { label: t('HomeIncrement'), value: 'Increment' },
//       { label: t('HomeDecrement'), value: 'Decrement' },
//     ];
//   }

//   render() {
//     return (
//       <MenuLayout title={t('HomeHideout')}>
//         <div className="home-menu">
//           <div className="item">
//             <h4 className="item-title">{t('HomeHideoutType')}</h4>
//             <Dropdown
//               style={{ width: '100%' }}
//               value={this.state.type}
//               options={this.getHideoutsType()}
//               onChange={(e) => this.onFilterChange({ type: e.value })}
//               filter={true}
//               filterPlaceholder={`${t('HomeFilter')}...`}
//               placeholder={t('HomeSelectType')}
//               itemTemplate={this.renderHideoutTemplate}
//               showClear={true}
//             />
//           </div>
//           <Fieldset legend={`${t('HomeOptions')}(NotYet)`} toggleable={true} collapsed={this.state.panelOptions} onToggle={(e) => this.setState({ panelOptions: e.value })}>
//             <div className="item">
//               <h4 className="item-title">MTX</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.mtx}
//                 options={this.getOptions('mtxs')}
//                 onChange={(e) => this.onSelectChange({ mtx: e.value })}
//                 placeholder="Select MTX"
//               />
//             </div>
//             <div className="item">
//               <h4 className="item-title">Minimum Rating</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.mini_rating}
//                 options={this.getOptions('mini_ratings')}
//                 onChange={(e) => this.onSelectChange({ mini_rating: e.value })}
//                 placeholder="Select Minimum Rating"
//               />
//             </div>
//             <div className="item">
//               <h4 className="item-title">Alva Level</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.alva_level}
//                 options={this.getOptions('alva_levels')}
//                 onChange={(e) => this.onSelectChange({ alva_level: e.value })}
//                 placeholder="Select Alva Level"
//               />
//             </div>
//             <div className="item">
//               <h4 className="item-title">Einhar Level</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.einhar_level}
//                 options={this.getOptions('einhar_levels')}
//                 onChange={(e) => this.onSelectChange({ einhar_level: e.value })}
//                 placeholder="Select Einhar Level"
//               />
//             </div>
//             <div className="item">
//               <h4 className="item-title">Niko Level</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.niko_level}
//                 options={this.getOptions('niko_levels')}
//                 onChange={(e) => this.onSelectChange({ niko_level: e.value })}
//                 placeholder="Select Niko Level"
//               />
//             </div>
//             <div className="item">
//               <h4 className="item-title">Zana Level</h4>
//               <Dropdown
//                 style={{ width: '100%' }}
//                 value={this.state.zana_level}
//                 options={this.getOptions('zana_levels')}
//                 onChange={(e) => this.onSelectChange({ zana_level: e.value })}
//                 placeholder="Select Zana Level"
//               />
//             </div>
//           </Fieldset>
//           <div className="item">
//             <h4 className="item-title">{t('HomeDownload')}</h4>
//             <SelectButton
//               value={this.state.download}
//               options={this.renderSelectButton()}
//               onChange={(e) => this.onSortChange({ download: e.value })}
//             >
//             </SelectButton>
//           </div>
//           <div className="item">
//             <h4 className="item-title">{t('HomeViews')}</h4>
//             <SelectButton
//               value={this.state.views}
//               options={this.renderSelectButton()}
//               onChange={(e) => this.onSortChange({ views: e.value })}
//             >
//             </SelectButton>
//           </div>
//           <div className="item">
//             <h4 className="item-title">{t('HomeFavorite')}</h4>
//             <SelectButton
//               value={this.state.favorite}
//               options={this.renderSelectButton()}
//               onChange={(e) => this.onSortChange({ favorite: e.value })}
//             >
//             </SelectButton>
//           </div>
//         </div>
//       </MenuLayout>
//     );
//   }
// }

// HomeMenu.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     hideoutAPI: state.hideoutAPI,
//     settings: state.settings,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(HomeMenu));
