import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getRoomInfo as getRoomInfoApi } from '../../../utils/roomAPI';
import { Redirect, Link } from 'react-router-dom';
import './styles.css';
import GameCard from '../GameCard/GameCard';
import AddNewGame from '../AddNewGame/AddNewGame';
import { socket, createRoom, joinRoom, getRooms, playNow, unPlayNow, autoAddUserToRoom, autoCreateRoom, responseDrawRequest } from './../../../context/Socket';
import Notice from './../../../components/Notice/index';
import Authorization from '../../../utils/callAuth';
import close from './close.svg'


const ManageListGameCard = () => {
  const [listGame, setListGame] = useState([]);
  const [idNewRoom, setIdNewRoom] = useState(null);
  const [isError, setIsError] = useState({
    value: false,
    message: ""
  });
  const [showPlaynowModal, setShowPlaynowModal] = useState(false);
  const [roomPassword, setRoomPassWord] = useState("");
  const [roomStepPeriod, setRoomStepPeriod] = useState(10);
  const [isPasswordRequire, setIsPasswordRequire] = useState(false);
  const [isRoomPasswordErr, setIsRoomPasswordErr] = useState({
    value: false,
    message: ""
  });
  const [isCreatingRoom, setIsCreatingRoom] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [curRoomId, setCurRoomId] = useState(-1);
  const [invite, setInvite] = useState({
    value: false,
    username: "",
    roomID: null
  })

  const [showJoinRoomWithIdModal, setShowJoinRoomWithIdModal] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isJoinRoomWithIdErr, setIsJoinRoomWithIdErr] = useState({
    value: false,
    message: ""
  })

  useEffect(() => {
    socket.on('inviteplay', res => {
      setInvite({
        value: true,
        username: res.username,
        roomID: res.roomID
      })
    });

    return () => {
      socket.off('inviteplay')
    }
  }, [])

  useEffect(() => {
    getRooms(setListGame);
    socket.on('getrooms', res => setListGame(res));
    socket.on('autoaddusertoroom', res => {
      Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
        .then(user => {
          const userId = user.data.id;
          const addedUserId = res[1];
          if (userId === addedUserId) {
            const roomId = res[0];
            setTimeout(() => {
              joinRoom(roomId, null, setIdNewRoom, setIsError, setIsRoomPasswordErr);
            }, 1000);
          }
        });
    });
    socket.on('playnowaccepted', res => {
      Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
        .then(user => {
          const userId = user.data.id;
          const hostUserId = res[0];
          const addedUserId = res[1];
          if (userId === hostUserId) {
            const callback = (roomId) => {
              autoAddUserToRoom(roomId, addedUserId);
              setIdNewRoom(roomId);
            };
            autoCreateRoom(userId, callback, setIsError);
          }
        });
    });
    return () => {
      socket.off('playnowaccepted');
      socket.off('autoaddusertoroom');
    }
  }, []);

  const handleJoinRoom = async (roomID) => {
    getRoomInfoApi(roomID)
      .then(res => {
        if (res) {
          const roomInfo = JSON.parse(res);
          const listGameTmp = listGame;
          let isRoomActive = false;
          listGameTmp.forEach(game => {
            if (+game.roomID === +roomInfo.id) {
              isRoomActive = true;
            }
          })
          if (isRoomActive) {
            if (roomInfo.password != null) {
              handleCloseJoinRoomWithIdModal();
              setCurRoomId(roomID);
              setIsCreatingRoom(false);
              setShowRoomModal(true);
            }
            else {
              joinRoom(roomID, null, setIdNewRoom, setIsError, setIsRoomPasswordErr);
            }
          }
          else {
            setIsJoinRoomWithIdErr({
              value: true,
              message: "Phòng này hiên tại không hoạt động"
            })
          }

        }
        else {
          setIsJoinRoomWithIdErr({
            value: true,
            message: "ID phòng không tồn tại"
          })
        }

      });
  }

  const handleJoinRoomWithPassword = () => {
    if (roomPassword === "" || roomPassword.length < 7) {
      setIsRoomPasswordErr({
        value: true,
        message: "Mật khẩu không được phép để trống và ít nhất là 7 kí tự"
      });
    } else {
      // alert(curRoomId);
      joinRoom(curRoomId, roomPassword, setIdNewRoom, setIsError, setIsRoomPasswordErr)
    }
  }

  const addNew = () => {
    setIsCreatingRoom(true);
    setShowRoomModal(true);
  };

  const handleAddNew = async () => {
    if (!isPasswordRequire) {
      createRoom(setIdNewRoom, setIsError, { roomPassword: null, roomStepPeriod: roomStepPeriod });
    } else {
      if (roomPassword === "" || roomPassword.length < 7) {
        setIsRoomPasswordErr({
          value: true,
          message: "Mật khẩu không được phép để trống và ít nhất là 7 kí tự"
        });
      } else {
        createRoom(setIdNewRoom, setIsError, { roomPassword: roomPassword, roomStepPeriod: roomStepPeriod });
      }
    }
  }

  const handleShowPlayNowModal = () => {
    setShowPlaynowModal(true);
    playNow();
  }

  const handleClosePlayNowModal = () => {
    unPlayNow();
    setShowPlaynowModal(false);
  }

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setRoomPassWord("");
    setIsRoomPasswordErr({
      value: false,
      message: ""
    })
  }

  const handleRoomInputDataChange = (event) => {
    const value = event.target.value;
    if (event.target.name === "roomPassword") {
      setRoomPassWord(value);
    } else if (event.target.name === "roomStepPeriod") {
      setRoomStepPeriod(value);
    } else if (event.target.name === "joinRoomId") {
      setJoinRoomId(value);
    }
  }

  const handlePasswordRequireCheckboxChange = (event) => {
    const value = event.target.checked;
    setIsPasswordRequire(value);
  }

  const handleShowJoinRoomWithIdModal = () => {
    setShowJoinRoomWithIdModal(true);
  }

  const handleCloseJoinRoomWithIdModal = () => {
    setShowJoinRoomWithIdModal(false);
  }

  const handleJoinRoomWithId = () => {
    handleJoinRoom(joinRoomId);
  }

  if (idNewRoom !== null) return <Redirect to={`/room/${idNewRoom}`} />
  return (
    <>
      {
        invite.value ?
          <div className='outGame outer-border upResult' id='outGame' >
            <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
              <div class="mid-border">
                <div class="inner-border">
                  <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                  <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>

                  <button className='close-button none-button' onClick={() => {
                    document.getElementById('outGame').className = 'outGame outer-border downResult';
                    setTimeout(() => {
                      setInvite({
                        value: false,
                        usename: "",
                        roomID: null
                      });
                    }, 900)
                  }}>
                    <img src={close} className='img-cup' alt="Đang load"></img>
                  </button>
                  <div className='notice-content'>
                    <h3>Thông báo</h3>
                    <h5>{`${invite.username} muốn mời bạn vào chơi!`}</h5>
                    <div>
                      <div className='myButton mt-2 mr-2' onClick={() => {
                        document.getElementById('outGame').className = 'outGame outer-border downResult';
                        setTimeout(() => {
                          setInvite({
                            value: false,
                            usename: "",
                            roomID: null
                          });
                        }, 900)
                      }}>
                        Hủy
                        </div>
                      <Link to={`/room/${invite.roomID}`}>
                        <div className='myButton mt-2 ml-2'>
                          Đồng ý
                    </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : <></>
      }
      <div className="mainBoardContainer">
        <Notice isShow={isError.value} mes={isError.message} handleClose={() => setIsError({
          value: false,
          message: ""
        })}></Notice>
        <div className="managerBoardHeader">
          <h4>Danh sách các phòng game</h4>
          <div>
            <Button className="joinRoomWithIdBtnStyle" variant="container" onClick={handleShowJoinRoomWithIdModal}><b>Vào phòng với ID</b></Button>
            <Button className="playNowBtnStyle" variant="container" onClick={handleShowPlayNowModal}><b>Chơi ngay</b></Button>
          </div>
        </div>
        <h5>Vào phòng game mong muốn bằng cách xin ID phòng từ chủ phòng</h5>
        <Container className="managerBoardContainer">
          <Row>
            <Col xs={3}>
              <AddNewGame addNew={addNew} />
            </Col>
            {
              listGame.map((game, index) => {
                return (
                  <Col xs={3} key={index}>
                    <GameCard game={game} index={index} onJoinRoom={() => handleJoinRoom(game.roomID)} />
                  </Col>
                )
              })
            }
          </Row>
        </Container>
        <Modal show={showPlaynowModal}
          onHide={handleClosePlayNowModal}
          backdrop='static'
          keyboard={false}
          centered
          contentClassName="playNowModelStyle">
          <Modal.Body>
            Đang tìm người chơi...
          <div className="playNowModelBodyStyle">
              <Button className="backBtnPlayNowModelStyle" variant="outline"
                onClick={handleClosePlayNowModal}>Hủy</Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={showRoomModal}
          onHide={handleCloseRoomModal}
          backdrop='static'
          keyboard={false}
          centered
          contentClassName="createRoomModalStyle">
          <Modal.Header className="createRoomModalNoBorderStyle">
            <Modal.Title>{isCreatingRoom ? "Tạo phòng" : "Vào phòng"}</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <Form>

              {isCreatingRoom &&
                <>
                  <Form.Group>
                    <Form.Label>Thời gian bước đi</Form.Label>
                    <Form.Control type="number" min={10} name="roomStepPeriod" value={roomStepPeriod} onChange={handleRoomInputDataChange} className="inputPasswordStyle" />
                  </Form.Group>
                  <Form.Group >
                    <Form.Check type="checkbox" label="Cần nhập mật khẩu" checked={isPasswordRequire} onChange={handlePasswordRequireCheckboxChange} id="inputCheckboxCreateRoom" />
                  </Form.Group>

                </>
              }
              {
                isCreatingRoom && isPasswordRequire &&
                <Form.Group>
                  <Form.Label>Nhập mật khẩu phòng</Form.Label>
                  <Form.Control type="password" name="roomPassword" value={roomPassword} onChange={handleRoomInputDataChange} className="inputPasswordStyle" />
                </Form.Group>
              }
              {
                !isCreatingRoom &&
                <Form.Group>
                  <Form.Label>Nhập mật khẩu phòng</Form.Label>
                  <Form.Control type="password" name="roomPassword" value={roomPassword} onChange={handleRoomInputDataChange} className="inputPasswordStyle" />
                </Form.Group>
              }
              {isRoomPasswordErr.value && isRoomPasswordErr.message}
            </Form>
          </Modal.Body>
          <Modal.Footer className="createRoomModalNoBorderStyle">
            <Button className="btnCreateRoomModalStyle" variant="outline"
              onClick={isCreatingRoom ? handleAddNew : handleJoinRoomWithPassword}>{isCreatingRoom ? "Tạo" : "Vào"}</Button>
            <Button className="btnCreateRoomModalStyle" variant="outline"
              onClick={handleCloseRoomModal}>Hủy</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showPlaynowModal}
          onHide={handleClosePlayNowModal}
          backdrop='static'
          keyboard={false}
          centered
          contentClassName="playNowModelStyle">
          <Modal.Body>
            Đang tìm người chơi...
          <div className="playNowModelBodyStyle">
              <Button className="backBtnPlayNowModelStyle" variant="outline"
                onClick={handleClosePlayNowModal}>Hủy</Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={showJoinRoomWithIdModal}
          onHide={handleCloseJoinRoomWithIdModal}
          backdrop='static'
          keyboard={false}
          centered
          contentClassName="createRoomModalStyle">
          <Modal.Header className="createRoomModalNoBorderStyle">
            <Modal.Title>Vào phòng với ID</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <Form>
              <Form.Group>
                <Form.Label>Nhập ID phòng</Form.Label>
                <Form.Control type="text" name="joinRoomId" value={joinRoomId} onChange={handleRoomInputDataChange} className="inputPasswordStyle" />
              </Form.Group>
              {isJoinRoomWithIdErr.value && isJoinRoomWithIdErr.message}
            </Form>
          </Modal.Body>
          <Modal.Footer className="createRoomModalNoBorderStyle">
            <Button className="btnCreateRoomModalStyle" variant="outline"
              onClick={handleJoinRoomWithId}>Vào</Button>
            <Button className="btnCreateRoomModalStyle" variant="outline"
              onClick={handleCloseJoinRoomWithIdModal}>Hủy</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </>
  )
}
export default ManageListGameCard;