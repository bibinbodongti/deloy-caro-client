import 'bootstrap/dist/css/bootstrap.min.css';
import Authorization from './../../utils/callAuth'
import React, { useState, useContext } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { Redirect, Link } from "react-router-dom";
import { LoginContext } from '../../context/LoginContext';
import { getMatchHistories } from '../../utils/matchAPI';
import styles from './styles.module.css';
import Header from './../../components/Header/Header'

const initialState = {
  totalMatch: 0,
  matchs: [],
};

const ITEM_PER_PAGE = 20;

const History = () => {
  const [login, setLogin] = React.useState({
    state: false,
    isLogin: false,
  });
  const [isLogin] = useContext(LoginContext);
  const [mainState, setMainState] = useState(initialState);
  const [active, setActive] = useState(1);

  React.useEffect(() => {
    const bearerToken = JSON.parse(localStorage.getItem('id_token'));
    Authorization('auth/profile', bearerToken)
      .then(async user => {
        setLogin({
          state: true,
          isLogin: true,
        });
        const playerId = user.data.id;
        const { totalMatch, matchs } = JSON.parse(await getMatchHistories(playerId, active));
        const mainStateApi = { totalMatch, matchs: [] };
        mainStateApi.matchs = matchs.map((item, index) => {
          let opponentUsername = "";
          let result = "";
          let time = "";
          if (item.status === 0) result = "Hòa";
          if (playerId === item.player1.id) {
            opponentUsername = item.player2.username;
            if (item.status === 1) result = "Chiến thắng";
            else if (item.status === 2) result = "Thất bại";
          }
          else if (playerId === item.player2.id) {
            opponentUsername = item.player1.username;
            if (item.status === 2) result = "Chiến thắng";
            else if (item.status === 1) result = "Thất bại";
          }
          const date1 = new Date(item.startDate), date2 = new Date(item.endDate);
          time = "" + Math.round((date2.getTime() - date1.getTime()) / 1000);
          return {
            opponentUsername,
            time,
            result,
            id: item.id
          }
        });
        setMainState(mainStateApi);
      })
      .catch((err) => {
        console.log(err);
        setLogin({
          state: true,
          isLogin: false,
        })
      })
  }, [isLogin, active])

  let items = [];
  const { totalMatch, matchs } = mainState;
  const nPage = Math.floor(totalMatch % ITEM_PER_PAGE === 0 ? totalMatch / ITEM_PER_PAGE : totalMatch / ITEM_PER_PAGE + 1);
  for (let number = 1; number <= nPage; number++) {
    items.push(
      <Pagination.Item className={styles.paginationItem} key={number} active={number === active} onClick={() => setActive(number)}>
        {number}
      </Pagination.Item>)
  }
  if (login.state) if (!login.isLogin) return <Redirect to='/login' />
  return (
    <>
      <Header></Header>
      <div className={styles.historyContainer}>
        {login.isLogin && (
          <>
            <h3 className={styles.historyTitle}>Lịch sử đấu</h3>
            <div className={styles.historyTableHead}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Đối thủ</th>
                    <th>Thời gian (Giây)</th>
                    <th>Kết quả</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className={styles.historyTableBody}>
              <table>
                <tbody>
                  {matchs.map((match, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1 + (active - 1) * ITEM_PER_PAGE}</td>
                        <td>{match.opponentUsername}</td>
                        <td>{match.time}</td>
                        <td>{match.result}</td>
                        <td><Link to={`/history/${match.id}`}><button className="myButton">Xem</button></Link></td>
                      </tr>)
                  })}
                </tbody>
              </table>
            </div>
            {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Đối thủ</th>
                <th>Thời gian (Giây)</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {matchs.map((match, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{match.opponentUsername}</td>
                    <td>{match.time}</td>
                    <td>{match.result}</td>
                  </tr>)
              })}
            </tbody>
          </Table> */}
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First className={styles.paginationItem} onClick={() => setActive(1)} />
                <Pagination.Prev className={styles.paginationItem} onClick={() => {
                  if (active !== 1)
                    setActive(active - 1);
                }} />
                {items}
                <Pagination.Next className={styles.paginationItem} onClick={() => {
                  if (active !== nPage)
                    setActive(active + 1);
                }} />
                <Pagination.Last className={styles.paginationItem} onClick={() => {
                  setActive(nPage);
                }} />
              </Pagination>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default History;