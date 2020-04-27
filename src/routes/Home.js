import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Home.scss';

import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';
import { withTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';
import { DeferredContent } from 'primereact/deferredcontent';

import ContentLayout from '../layout/ContentLayout';
import HomeMenu from '../components/HomeMenu';

function Home() {
  const [first] = useState(0);
  const [rows] = useState(20);
  const [breadcrumb] = useState([{ label: 'hideouts', url: '/' }]);

  const { hideouts, users } = useSelector(state => state.database);

  const renderCards = (lists = []) => {
    // Lists by pages
    const listsByPage = [];
    lists.forEach((value, index) =>
      (
        index >= first &&
        index < (first + rows)
      ) ? listsByPage.push(value) : null);

    return listsByPage.map((hideout, index) => {
      const { uname } = users.getById(hideout.authorId);
      return (
        <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
          <DeferredContent>
            <Card
              className="card-item"
              title={hideout.title}
              subTitle={uname}
              header={renderCardHeader(hideout)}
            >
              <div className="card-counts">
                <div>
                  <FaEye />
                  <span>{hideout.views}</span>
                </div>
                <div>
                  <FaDownload />
                  <span>{hideout.download}</span>
                </div>
                <div>
                  <FaHeart />
                  <span>{hideout.favorite}</span>
                </div>
              </div>
            </Card>
          </DeferredContent>
        </div>
      );
    });
  }

  const renderCardHeader = (hideout = {}) => {
    const { id, thumbnail, title } = hideout;
    return (
      <Link to={`/detail/${id}`} alt={title} title={title}>
        <div className="card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
      </Link>
    );
  }

  // const renderCardFooter = () => {
  //   return (
  //     <span>
  //       <Button label="Save" icon="pi pi-check" style={{ marginRight: '.25em' }} />
  //       <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" />
  //     </span>
  //   );
  // }

  return (
    <div className="home">
      {/* <HomeMenu
        hideouts={[]}
      // onSortChange={(key, value) => this.onSortChange(key, value)}
      // onFilterChange={(key, value) => this.onFilterChange(key, value)}
     />*/}
      <ContentLayout breadcrumb={breadcrumb}>
        {
          hideouts.length === 0
            ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} />
            :
            (
              <div className="card-group">
                <div className="p-grid">{renderCards(hideouts)}</div>
                <br />
                <Paginator
                  first={first}
                  rows={rows}
                  rowsPerPageOptions={[20, 40, 60]}
                  totalRecords={hideouts.length}
                // onPageChange={e => this.onPageChange(e)}
                >
                </Paginator>
              </div>
            )
        }
      </ContentLayout>
    </div>
  );
}

export default Home;

// class Home extends Component {

//   constructor(props) {
//     super(props);
//     // this.dispatch = props.dispatch;
//     // this.database = props.database;
//     // this.users = props.users;
//     // this.t = props.t;
//     // this.state = {
//     //   first: 0,
//     //   rows: 20,
//     //   breadcrumb: [
//     //     { label: 'hideouts', url: '/' },
//     //   ],
//     //   hideouts: this.database.get(),
//     // }
//   }

//   /**
//    * Sort hideouts
//    * @param {string} key
//    * @param {string} value
//    */
//   onSortChange(key, value) {
//     const hideouts = this.state.hideouts;
//     this.setState({
//       hideouts: value === 'Increment'
//         ? hideouts.sort((a, b) => {
//           return a[key] - b[key];
//         })
//         : hideouts.sort((a, b) => {
//           return b[key] - a[key];
//         }),
//     });
//   }

//   /**
//    * Filter hideouts
//    * @param {string} key
//    * @param {string} value
//    */
//   onFilterChange(key, value) {
//     this.setState({
//       hideouts: this.database.get().filter(hideout => {
//         if (value) return hideout[key] === `${value} Hideout`;
//         return hideout;
//       }),
//     });
//   }

//   onPageChange(event) {
//     this.setState({
//       first: event.first,
//       rows: event.rows,
//     });
//   }

//   renderCards(lists = []) {
//     // Lists by pages
//     const listsByPage = [];
//     lists.forEach((value, index) =>
//       (
//         index >= this.state.first &&
//         index < (this.state.first + this.state.rows)
//       ) ? listsByPage.push(value) : null);

//     return listsByPage.map((hideout, index) => {
//       const { uname } = this.props.users.getById(hideout.authorId);
//       return (
//         <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
//           <DeferredContent>
//             <Card
//               className="card-item"
//               title={hideout.title}
//               subTitle={uname}
//               header={this.renderCardHeader(hideout)}
//             >
//               <div className="card-counts">
//                 <div>
//                   <FaEye />
//                   <span>{hideout.views}</span>
//                 </div>
//                 <div>
//                   <FaDownload />
//                   <span>{hideout.download}</span>
//                 </div>
//                 <div>
//                   <FaHeart />
//                   <span>{hideout.favorite}</span>
//                 </div>
//               </div>
//             </Card>
//           </DeferredContent>
//         </div>
//       );
//     });
//   }

//   renderCardHeader(hideout = {}) {
//     const { id, thumbnail, title } = hideout;
//     return (
//       <Link to={`/detail/${id}`} alt={title} title={title}>
//         <div className="card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
//       </Link>
//     );
//   }

//   renderCardFooter() {
//     return (
//       <span>
//         <Button label="Save" icon="pi pi-check" style={{ marginRight: '.25em' }} />
//         <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" />
//       </span>
//     );
//   }

//   render() {
//     this.users = this.props.users;
//     this.database = this.props.database;
//     const Hideouts = this.state.hideouts;

//     // Fake Data
//     // let Hideouts = this.props.database.get();
//     // const ALists = [];
//     // const FAKETOTAL = 100;
//     // if (Lists.length > 0) {
//     //   for (let i = 0; i < FAKETOTAL; i++) ALists[i] = Lists[0];
//     //   Lists = ALists;
//     // }

//     return (
//       <div className="home">
//         <HomeMenu
//           hideouts={Hideouts || []}
//           onSortChange={(key, value) => this.onSortChange(key, value)}
//           onFilterChange={(key, value) => this.onFilterChange(key, value)}
//         />
//         <ContentLayout breadcrumb={this.state.breadcrumb}>
//           {
//             this.database.get().length === 0
//               ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} />
//               :
//               (
//                 <div className="card-group">
//                   <div className="p-grid">{this.renderCards(Hideouts)}</div>
//                   <br />
//                   <Paginator first={this.state.first} rows={this.state.rows} rowsPerPageOptions={[20, 40, 60]} totalRecords={Hideouts.length} onPageChange={e => this.onPageChange(e)}></Paginator>
//                 </div>
//               )
//           }
//         </ContentLayout>
//       </div>
//     );
//   }
// }

// Home.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     database: state.database,
//     users: state.users,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(Home));
