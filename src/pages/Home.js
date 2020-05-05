import React, { useState } from 'react';
import styled from 'styled-components';
import { rgba, transitions } from 'polished';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';

import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';

import ContentLayout from '../layout/ContentLayout';

import HomeMenu from '../components/HomeMenu';

import bg from '../images/bg.jpg';

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
    display: flex;
    flex-flow: row-reverse;
  }

  .p-card-title {
    overflow: hidden;
    color: ${p => p.theme.lightWarning};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-card-subtitle {
    overflow: hidden;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 1;

    &::before {
      content: '@';
    }
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

  const [breadcrumb] = useState([{ label: 'hideouts', url: '/' }]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { hideouts, users } = useSelector(state => state.firebase);

  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  }

  const onSortChange = event => {
    console.log('onSortChange', event)
    // const hideouts = this.state.hideouts;
    // this.setState({
    //   hideouts: value === 'Increment'
    //     ? hideouts.sort((a, b) => {
    //       return a[key] - b[key];
    //     })
    //     : hideouts.sort((a, b) => {
    //       return b[key] - a[key];
    //     }),
    // });
  }

  const onFilterChange = event => {
    console.log('onFilterChange', event)
    // this.setState({
    //   hideouts: this.database.get().filter(hideout => {
    //     if (value) return hideout[key] === `${value} Hideout`;
    //     return hideout;
    //   }),
    // });
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
      const { uname } = users.find(u => u.uid === hideout.authorId) || { uname: 'Unknown' };

      return (
        <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
          <Card
            title={hideout.title}
            subTitle={uname}
            header={renderCardHeader(hideout)}
          >
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
          hideouts={hideouts}
          onSortChange={onSortChange.bind(this)}
          onFilterChange={onFilterChange.bind(this)}
        />
      }
      <ContentLayout breadcrumb={breadcrumb}>
        {
          hideouts.length === 0
            ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} />
            :
            (
              <Group>
                <div className="p-grid">{renderCards(hideouts)}</div>
                <br />
                <Paginator
                  first={first}
                  rows={rows}
                  rowsPerPageOptions={[20, 40, 60]}
                  totalRecords={hideouts.length}
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
