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

export const createRoom = (setIdNewRoom, setIsError) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('createroom', res.data.id, res => {
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

export const joinRoom = (roomID, setIdNewRoom, setIsError) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('joinroom', {
        roomID: roomID,
        userID: res.data.id
      }, res => {
        if (res.value === false) {
          setIsError({
            value: true,
            message: res.message
          })
        }
        else {
          setIdNewRoom(roomID)
        }
      });
    })
}

export const reconnectRoom = (roomID, setError) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('reconnectroom', {
        roomID: roomID,
        userID: res.data.id
      }, res => {
        if (res === false)
          setError(true);
      });
    })
}
export const sendMessage = (roomID, content, setError) => {
  Authorization('auth/profile', JSON.parse(localStorage.getItem('id_token')))
    .then(res => {
      socket.emit('sendmessage', {
        roomID: roomID,
        userID: res.data.id,
        content: content
      }, res => {
        if (res === false)
          setError(true);
      });
    })
}
export const leaveRoom = () => {
  socket.emit('leaveroom')

}

export const startGame = (roomID, alphabet, setIsPlaying, setNextAPL, setStepNumber, setHistory, setIsError, setWinner) => {
  socket.emit('startgame', {
    roomID: roomID,
    alphabet: alphabet
  }, res => {
    if (res) {
      setIsPlaying(true);
      setNextAPL(alphabet);
      setStepNumber(0);
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
      setIsError({
        value: true,
        message: "Chưa đủ 2 người để bắt đầu"
      })
    }
  });
}

export const playChess = (roomID, pos, alp) => {
  socket.emit('playchess', {
    roomID: roomID,
    history: pos,
    stepNumber: alp
  })
}
