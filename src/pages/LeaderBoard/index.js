import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import CallAuthAPI from './../../utils/CallAuthAPI';
import Authorization from './../../utils/callAuth';
import './styles.css';
import Header from './../../components/Header/Header'


const LeaderBoard = () => {
  const [login, setLogin] = React.useState({
    state: false,
    isLogin: false
  });
  const [isLogin] = useContext(LoginContext);
  const [data, setData] = useState([])
  React.useEffect(() => {
    Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
      .then(resp => {
        setLogin({
          state: true,
          isLogin: true,
        });
        CallAuthAPI('leaderboard', 'GET', null, JSON.parse(localStorage.getItem('id_token')))
          .then(res => {
            setData(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => setLogin({
        state: true,
        isLogin: false,
      }))
  }, [isLogin])

  if (login.state) if (!login.isLogin) return <Redirect to='/login' />
  return (
    <>
      <Header></Header>
      <Container className='leaderboardContainer' fluid>
        {
          login.isLogin ? (<>
            <h3 className='titleLeaderBoard'>Bảng xếp hạng</h3>
            <div className='tbl-header-leader-rank'>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Top</th>
                    <th>Username</th>
                    <th>Số cúp</th>
                    <th>Rank</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='tbl-content-leader-rank'>
              <table>
                <tbody>
                  {data.map((item, index) => {
                    return (<tr key={index}>
                      <td style={{ width: "10%" }}>{index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.cup}</td>
                      <td>{item.rank}</td>
                    </tr>)
                  })}
                </tbody>
              </table>
            </div>
          </>) : null
        }
      </Container >
    </>
  )
}

export default LeaderBoard;