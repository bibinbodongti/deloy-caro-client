import Authorization from './../utils/callAuth'
import * as Config from './../constant/config'
import CallAuthAPI from './../utils/CallAuthAPI'

import io from "socket.io-client";

export const socket = io(Config.API_URL);

export const msgOnline = setIslogin => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('msgToServerOnline', res.data.id)
      setIslogin(true);
    })
    .catch(err => { setIslogin(false) })
}

export const getOnlines = (setUsers) => {
  socket.emit('getonlines', users => {
    CallAuthAPI('users/online', 'POST', {
      users: users,
    }, JSON.parse(localStorage.getItem('id_token')))
      .then(res => {
        setUsers(res.data)
      })
  })
}

export const playNow = () => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('playnow', res.data.id);
    })
    .catch(err => {

    })
}

export const unPlayNow = () => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('unplaynow', res.data.id);
    })
    .catch(err => {

    })
}

export const getRooms = (setListGame) => {
  socket.emit('getrooms', res => setListGame(res));
}

export const msgLogout = setIslogin => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('msgToServerLogout', res.data.id);
      localStorage.removeItem("id_token");
      setIslogin(false);

    })
    .catch(err => { setIslogin(false) })
}

export const createRoom = (setIdNewRoom, setIsError, roomData) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('createroom', [res.data.id, roomData.roomPassword, roomData.roomStepPeriod], res => {
        if (res === -1) {
          setIsError({
            value: true,
            message: "Bạn đã tham gia phòng khác!"
          })
        }
        else {
          setIdNewRoom(res)
        }
      });
    })
}

export const autoCreateRoom = (userId, callback, setIsError) => {
  socket.emit('createroom', [userId, null, 20], res => {
    if (res === -1) {
      setIsError({
        value: true,
        message: "Bạn đã tham gia phòng khác!"
      })
    }
    else {
      callback(res);
    }
  });
}

export const autoAddUserToRoom = (roomId, userId) => {
  socket.emit('autoaddusertoroom', [roomId, userId]);
}


export const joinRoom = (roomID, roomPassword, setIdNewRoom, setIsError, setIsRoomPasswordErr) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('joinroom', {
        roomID: roomID,
        roomPassword: roomPassword,
        userID: res.data.id
      }, res => {
        if (res.value === false) {
          if (res.isRoomPasswordErr) {
            console.log(res);
            setIsRoomPasswordErr({
              value: true,
              message: res.message
            })
          }
          else {
            setIsError({
              value: true,
              message: res.message
            })
          }
        }
        else {
          setIdNewRoom(roomID)
        }
      });
    })
}



export const reconnectRoom = (roomID, setConnect, setIsHost, setIsPlayer) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('reconnectroom', {
        roomID: roomID,
        userID: res.data.id
      }, res => {
        setConnect(true);
        if (res === 1) {
          setIsHost(true);
          setIsPlayer(true);
          return;
        }
        if (res === 2) {
          setIsHost(false);
          setIsPlayer(true);
          return;
        }

        setIsHost(false);
        setIsPlayer(false);
      });
    })
}
export const sendMessage = (roomID, content, setError, currentTime) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('sendmessage', {
        roomID: roomID,
        userID: res.data.id,
        content: content,
        time: currentTime
      }, res => {
        if (res === false)
          setError(true);
      });
    })
}
export const leaveRoom = () => {
  socket.emit('leaveroom')

}

export const startGame = (roomID, alphabet, setIsPlaying, setNextAPL, setHistory, setWinner) => {
  socket.emit('startgame', {
    roomID: roomID,
    alphabet: alphabet
  }, res => {
    if (res) {
      setIsPlaying(true);
      setNextAPL(alphabet);
      setHistory([{
        squares: Array(400).fill(null),
        position: null,
      }])
      setWinner({
        value: null,
        position: []
      })
    }
    else {
    }
  });
}

// export const playChess = (roomID, pos, alp) => {
//   socket.emit('playchess', {
//     roomID: roomID,
//     history: pos,
//     stepNumber: alp
//   })
// }

export const playChess = (roomID, position, alphabet) => {
  socket.emit('playchess', {
    roomID: roomID,
    position: position,
    alphabet: alphabet
  })
}


export const becomePlayer = (roomID, setIsPlayer, setIsHost, setIsFirst) => {
  socket.emit('becomeplayer', {
    roomID
  }, res => {
    if (res === 1) {
      setIsPlayer(true);
      setIsHost(true);
      setIsFirst(true);
      return;
    }
    if (res === 2) {
      setIsPlayer(true);
      setIsHost(false);
      setIsFirst(false);
      return;
    }
    setIsPlayer(false);
    setIsHost(false);
    setIsFirst(false);
  })
}

export const getPlayers = (roomID, setFirstPlayer, setSecondPlayer, setIsHost, setIsFirst) => {
  socket.emit('getplayers', {
    roomID
  }, players => {
    if (players.length === 2) {
      CallAuthAPI(`users/${players[1].userID}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
        .then(res => {
          setSecondPlayer({
            user: res.data,
            isHost: players[1].isPlayer === 1 ? true : false,
            isReady: false,
            isTurn: null
          });
        })
      CallAuthAPI(`users/${players[0].userID}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
        .then(res => {
          setFirstPlayer({
            user: res.data,
            isHost: players[0].isPlayer === 1 ? true : false,
            isReady: false,
            isTurn: null
          });
        })
      return;
    }

    if (players.length === 1) {
      Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
        .then(user => {
          if (user.data.id === players[0].userID) {
            CallAuthAPI(`users/${players[0].userID}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
              .then(res => {
                setSecondPlayer({
                  user: res.data,
                  isHost: true,
                  isReady: false,
                  isTurn: null
                });
              })
            setIsHost(true)
            setIsFirst(true);
            setFirstPlayer({
              user: null,
              isHost: false,
              isReady: false,
              isTurn: null
            });
          }
          else {
            CallAuthAPI(`users/${players[0].userID}`, 'GET', null, JSON.parse(localStorage.getItem('id_token')))
              .then(res => {
                setFirstPlayer({
                  user: res.data,
                  isHost: true,
                  isReady: false,
                  isTurn: null
                });
              })

            setSecondPlayer({
              user: null,
              isHost: false,
              isReady: false,
              isTurn: null
            });
          }
        })
      return;
    }

    setSecondPlayer({
      user: null,
      isHost: false,
      isReady: false,
      isTurn: false
    });
    setFirstPlayer({
      user: null,
      isHost: false,
      isReady: false,
      isTurn: false
    });
  })
}


export const standUp = (roomID, setIsPlayer, setIsHost) => {
  socket.emit('standup', {
    roomID
  }, res => {
    setIsPlayer(false);
    setIsHost(false)
  })
}

export const readyPlay = (roomID, player, setPlayer) => {
  socket.emit('readyplay', {
    roomID
  })
  setPlayer({
    ...player,
    isReady: true
  })
}

export const getRoomState = (roomID, isPlayer, setHistory, setIsPlaying, setAlphabet, setNextAlphabet, setWait, setFirstPlayer, setSecondPlayer) => {
  socket.emit('getroomstate', {
    roomID
  }, state => {
    if (state && state.length !== 0) {
      const history = [...state].slice(2).reduce((res, item, index, arr) => {
        const newHistory = res.slice(0, res.length);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();

        squares[item.position] = item.alphabet;


        return newHistory.concat([{ squares: squares, position: item.position }]);
      }, [{
        squares: Array(400).fill(null),
        position: null
      }]);

      setHistory(history);
      setIsPlaying(true);

      const currentALP = state[state.length - 1].alphabet;

      setFirstPlayer(player => ({
        ...player,
        isTurn: currentALP === 'X' ? player.isHost ? null : state[state.length - 1].startTime : player.isHost ? state[state.length - 1].startTime : null
      }))

      setSecondPlayer(player => ({
        ...player,
        isTurn: currentALP === 'X' ? player.isHost ? null : state[state.length - 1].startTime : player.isHost ? state[state.length - 1].startTime : null
      }))

      if (isPlayer)
        Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
          .then(res => {
            const currentALP = state[state.length - 1].alphabet;
            if (state[state.length - 1].userID === res.data.id) {
              setAlphabet(currentALP);
              setNextAlphabet(currentALP === 'X' ? 'O' : 'X')
              setWait(wait => !wait);
            }
            else {
              setAlphabet(currentALP === 'X' ? 'O' : 'X');
              setNextAlphabet(currentALP === 'X' ? 'O' : 'X')
            }
          })
    }

  })
}

export const endMatch = (roomID, status, player1ID, player2ID) => {
  socket.emit('endmatch', {
    roomID,
    status,
    player1ID,
    player2ID
  })
}

export const drawRequestSocket = (roomID) => {
  socket.emit("drawrequest", {
    roomID
  })
}

export const responseDrawRequest = (roomID, isAccept) => {
  socket.emit('responsedrawrequest', {
    roomID,
    isAccept
  })
}

export const surrenderRequest = (roomID) => {
  socket.emit('surrender', {
    roomID
  })
}

export const getViewers = (roomID, setViewers) => {
  socket.emit('getviewers', {
    roomID
  }, users => {
    console.log(users)

    CallAuthAPI('users/viewers/ids', 'POST', {
      userIDs: users,
    }, JSON.parse(localStorage.getItem('id_token')))
      .then(res => {
        setViewers(res.data)
      })

  })
}

export const getWaittingPlayers = (setWaittingPlayers) => {
  socket.emit('getwaittingplayers', userIDs => {
    CallAuthAPI('users/viewers/ids', 'POST', {
      userIDs: userIDs,
    }, JSON.parse(localStorage.getItem('id_token')))
      .then(res => {
        const temp = res.data.map(item => ({
          ...item,
          isInvite: false
        }))
        setWaittingPlayers(temp)
      })

  })
}

export const invitePlayer = (userIDs, roomID) => {
  socket.emit('inviteplayer', {
    userIDs,
    roomID
  }
  )
}

export const getRoomPeriod = (roomID, setTimeout)=>{
  socket.emit('getRoomPeriod', {
    roomID
  }, res =>{
    setTimeout(Number(res));
  })
}