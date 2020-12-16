import React, { useState, useContext } from 'react';
import {Table } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginContext } from '../../context/LoginContext';
import CallAPI from './../../utils/CallAPI'
import Authorization from './../../utils/callAuth'
const History = () => {
  const [login, setLogin] = React.useState(true);
  const [isLogin] = useContext(LoginContext);
  const [data, setData] = useState([])
  React.useEffect(() => {
    setLogin(isLogin);
    Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
      .then(resp => {
        CallAPI(`histories/playhistories/${resp.data.id}`, 'GET', null)
          .then(res => {
            const result = res.data.map((item, index) => {
              const pos = item.player1.id === resp.data.id ? 1 : 2;
              return {
                id: item.id,
                userID: pos === 1 ? item.player2.id : item.player1.id,
                username: pos === 1 ? item.player2.username : item.player1.username,
                isWin: pos === 1 ? item.isWin : item.isWin === 1 ? 0 : 1,
                // date: item.date
              }
            })

            setData(result)
          })
      })
  }, [])

  console.log(data)
  if (!login) return <Redirect to='/login' />
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID đối thủ</th>
            <th>Username đối thủ</th>
            <th>Kết quả</th>
            {/* <th>Thời gian</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (<tr key={index}>
              <td>{item.id}</td>
              <td>{item.userID}</td>
              <td>{item.username}</td>
              <td>{item.isWin === 1 ? "Thắng" : "Thua"}</td>
              {/* <td>{item.date}</td> */}
            </tr>)
          })}

        </tbody>
      </Table>
    </>
  )
}

export default History;