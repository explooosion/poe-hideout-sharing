import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { rgba, transitions } from 'polished';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';
import _ from 'lodash';

import { Card } from 'primereact/card';
// import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';

import ContentLayout from '../layout/ContentLayout';

import HomeMenu from '../components/HomeMenu';

import bg from '../images/bg.jpg';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();

const Main = styled.div`
  *:not(.pi) {
    font-family: ${p => p.theme.globalFont};
  }
  display: flex;
  margin-top: ${p => p.theme.headerHeight};
  width: 100vw;
  height: calc(100vh - ${p => p.theme.headerHeight});
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  .p-card {
    overflow: hidden;
    border: 2px solid ${p => p.theme.gray};
    background-color: ${p => p.theme.lightBlack};
  }

  .p-card-content {
    /* author link */
    > a {
      overflow: hidden;
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 1;
      outline: none;

      &:hover {
        color: ${p => p.theme.warning}
      }

      &::before {
        content: '@';
      }
    }
  }

  .p-card-title {
    overflow: hidden;
    color: ${p => p.theme.lightWarning};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-paginator {
    background-color: transparent;
    border: none;

    .p-disabled {
      color: #fff;
      opacity: .8;
    }
  }
`;

const Group = styled.div`
  padding: .75rem;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.black};
`;

const Image = styled.div`
  position: relative;
  height: 150px;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  ${transitions('opacity', '.2s ease-in-out')};

  &:hover {
    opacity: .85;
  }
`;

const Counters = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: .5rem;

  div {
    display: flex;
    align-items: center;
    margin-right: .5rem;
    color: #fff;
  }

  span {
    margin: 0 .15rem 0 .25rem;
  }
`;

function Home() {
  const { i18n } = useTranslation();
  const [breadcrumb] = useState([{ label: 'hideouts', url: '/' }]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [_hideouts, _setHideouts] = useState([]);
  const { hideouts, users } = useSelector(state => state.firebase);

  useEffect(() => {
    _setHideouts(hideouts);
  }, [hideouts]);

  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  }

  const onSortChange = event => {
    // console.log('onSortChange', event)
    const { name: key } = event.target;
    _setHideouts(
      event.value === 'Increment'
        ? [..._hideouts.sort((a, b) => a[key] - b[key])]
        : [..._hideouts.sort((a, b) => b[key] - a[key])]
    );
  }

  const onFilterChange = event => {
    // console.log('onFilterChange', event)
    let hash = null;
    const { value } = event.target;
    _setHideouts(
      hideouts.filter(h => {
        try { hash = _.get(JSON.parse(h.fileContent), 'Hideout Hash'); }
        catch (e) { console.warn('renderHideouts', e); hash = null; }
        if (_.isNull(hash) || _.isNull(value)) return true;
        else return _.get(hideoutAPI.getByHash(hash, i18n.language), 'Name') === value;
      })
    );
  }

  const renderCards = (lists = []) => {
    // Lists by pages
    const listsByPage = [];
    lists.forEach((value, index) =>
      (
        index >= first &&
        index < (first + rows)
      ) ? listsByPage.push(value) : null);

    return listsByPage.map((hideout, index) => {
      const { uname } = users.find(u => u.uid === hideout.authorId) || { uname: 'Unknown', id: '' };

      return (
        <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
          <Card
            title={hideout.title}
            header={renderCardHeader(hideout)}
          >
            <Link to={`/profile/${hideout.authorId}`}>{uname}</Link>
            <Counters>
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
            </Counters>
          </Card>
        </div>
      );
    });
  }

  const renderCardHeader = (hideout = {}) => {
    const { id, thumbnail, title } = hideout;
    return (
      <Link to={`/detail/${id}`} alt={title} title={title}>
        <Image style={{ backgroundImage: `url(${thumbnail})` }} />
      </Link>
    );
  }

  return (
    <Main>
      {
        <HomeMenu
          hideouts={_hideouts}
          onSortChange={onSortChange.bind(this)}
          onFilterChange={onFilterChange.bind(this)}
        />
      }
      <ContentLayout breadcrumb={breadcrumb}>
        {
          // _hideouts.length === 0
          //   ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} />
          //   :
          (
            <Group>
              <div className="p-grid">{renderCards(_hideouts)}</div>
              <br />
              <Paginator
                first={first}
                rows={rows}
                rowsPerPageOptions={[20, 40, 60]}
                totalRecords={_hideouts.length}
                onPageChange={onPageChange}
              >
              </Paginator>
            </Group>
          )
        }
      </ContentLayout>
    </Main>
  );
}

export default Home;
