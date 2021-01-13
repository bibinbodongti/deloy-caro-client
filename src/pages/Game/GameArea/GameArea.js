import React, { useState } from 'react';
// import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { Container, Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";

import Board from '../Board/Board';
import { calculateWinner } from './Service'
import outRoom from './image/back-arrow.svg'
import upArrow from './image//up-arrow.svg'
import group from './image//group.svg'
import trophy from './image//trophy.svg'
import add from './image//add.svg'
import close from './image//close.svg'
import join from './image//join.svg'
import key from './image//key.svg'
import handshake from './image//handshake.svg'
import whiteflag from './image//white-flag.svg'
import ChangingProgressProvider from './provider'
import "react-circular-progressbar/dist/styles.css";
import { socket, startGame, playChess, leaveRoom, becomePlayer, getPlayers, getViewers, standUp, readyPlay, getRoomState, endMatch, drawRequestSocket, responseDrawRequest, surrenderRequest, getWaittingPlayers, invitePlayer,getRoomPeriod } from './../../../context/Socket'
import CallAuthAPI from './../../../utils/CallAuthAPI'
import Notice from './../../../components/Message/index'
import './styles.css';
import man from './image/man.svg'

const GameArea = (props) => {
  const [alphabet, setAlphabet] = useState("");
  const [nextALP, setNextAPL] = useState("")
  const [wait, setWait] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [history, setHistory] = useState([{
    squares: Array(400).fill(null),
    position: null,
  }]);

  const [winner, setWinner] = useState(
    {
      value: null,
      position: []
    }
  )

  const [seeViewer, setSeeViewer] = useState(false);
  const [invite, setInvite] = useState(false);
  const [notice, setNotice] = useState({
    value: false,
    message: ""
  });
  const [outGame, setOutGame] = useState(false);
  const [isPlayer, setIsPlayer] = useState(props.isPlayer);
  const [isHost, setIsHost] = useState(props.isHost);
  const [surrender, setSurrender] = useState(false);
  const [drawRequest, setDrawRequest] = useState(-1);
  const [viewers, setViewers] = useState([]);
  const [waittingPlayer, setWaittingPlayers] = useState([]);
  const [period, setPeriod] = useState(0);

  const [firstPlayer, setFirstPlayer] = useState({
    user: null,
    isHost: false,
    isReady: false,
    isTurn: null
  })

  const [secondPlayer, setSecondPlayer] = useState({
    user: null,
    isHost: false,
    isReady: false,
    isTurn: null
  })

  const handleEndGame = React.useCallback(() => {
    if (isPlaying) {
      socket.off('playchess');
      socket.off('startgame')
      setFirstPlayer(player => (
        {
          ...player,
          isTurn: null
        }
      ));
      setSecondPlayer(player => (
        {
          ...player,
          isTurn: null
        }
      ));
      setIsPlaying(false);
      setNextAPL('');
    }

  }, [isPlaying])


  React.useEffect(() => {
    getPlayers(props.roomID, setFirstPlayer, setSecondPlayer, setIsHost, setIsFirst);
    getRoomPeriod(props.roomID, setPeriod);
  }, [props.roomID]);

  React.useEffect(() => {
    getViewers(props.roomID, setViewers);
    socket.on('newviewer', users => {
      console.log("Viewer")
      CallAuthAPI('users/viewers/ids', 'POST', {
        userIDs: users,
      }, JSON.parse(localStorage.getItem('id_token')))
        .then(res => {
          setViewers(res.data)
        })
    });

    return () => {
      socket.off('newviewer')
    }
  }, [props.roomID])

  React.useEffect(() => {
    if (firstPlayer.user && secondPlayer.user)
      getRoomState(props.roomID, isPlayer, setHistory, setIsPlaying, setAlphabet, setNextAPL, setWait, setFirstPlayer, setSecondPlayer);
  }, [firstPlayer.user, secondPlayer.user, isPlayer, props.roomID])

  React.useEffect(() => {
    setIsPlayer(props.isPlayer);
    setIsHost(props.isHost)
  }, [props.isPlayer, props.isHost])

  React.useEffect(() => {
    if (isPlaying) {
      socket.off('endmatch');
      socket.once('endmatch', result => {
        handleEndGame();

        if (result.winner !== null && !winner.value) {

          setWinner({
            value: result.winner === secondPlayer.user.id ? secondPlayer.isHost ? 'X' : 'O' : secondPlayer.isHost ? 'O' : 'X',
            position: []
          })
          if (isPlayer)
            if (result.winner === secondPlayer.user.id)
              setIsFirst(true);
            else
              setIsFirst(false)
        }
        else {

          setWinner({
            value: 'D',
            position: []
          })
        }
      })
    }
  }, [isPlaying, handleEndGame, secondPlayer, isPlayer, winner])

  React.useEffect(() => {
    if (isPlayer && isPlaying && alphabet !== '') {
      socket.off('drawrequest');
      socket.on('drawrequest', res => {
        setDrawRequest(1);
      })

      socket.off('surrender');
      socket.once('surrender', res => {

        setNotice({
          value: true,
          message: "Đối thủ đã đầu hàng!"
        })
        setIsFirst(true);
      })
    }

    return () => {
      socket.off('drawrequest');
    }
  }, [isPlayer, isPlaying, alphabet])

  React.useEffect(() => {
    socket.off('newplayer')
    socket.on('newplayer', res => {
      if (winner.value) {
        setTimeout(() => {
          if (document.getElementById('result'))
            document.getElementById('result').className = 'result outer-border downResult';
          setTimeout(() => {
            socket.off('playchess');
            socket.off('startgame');
            setWinner({
              value: null,
              position: []
            })
            setHistory([{
              squares: Array(400).fill(null),
              position: null,
            }])
            setIsPlaying(false);
            getPlayers(props.roomID, setFirstPlayer, setSecondPlayer, setIsHost, setIsFirst);

          }, 900)

        }, 4000)
      }
      else {
        getPlayers(props.roomID, setFirstPlayer, setSecondPlayer, setIsHost, setIsFirst);
      }
    })

    return () => {
      socket.off('newplayer');
    }
  }, [props.roomID, winner.value]);

  React.useEffect(() => {
    if (firstPlayer.user && secondPlayer.user && isPlayer) {
      socket.off('readyplayer');
      socket.once('readyplayer', res => {
        setFirstPlayer(player => ({
          ...player,
          isReady: player.isHost ? false : true
        }))

        setSecondPlayer(player => ({
          ...player,
          isReady: player.isHost ? false : true
        }))

      })
    }

    return () => {
      socket.off('readyplayer');
    }
  }, [firstPlayer, secondPlayer, isPlayer]);

  React.useEffect(() => {
    if (isPlayer && isPlaying === false && !isHost && history.length === 1)
      socket.once('startgame', res => {
        socket.off('playchess')
        setWinner({
          value: null,
          position: []
        })
        setAlphabet('O')
        setIsPlaying(true);
        setNextAPL(res.alphabet);
        setHistory([{
          squares: Array(400).fill(null),
          position: null,
        }])

        setFirstPlayer(player => ({
          ...player,
          isReady: false,
          isTurn: res.alphabet === 'X' ? res.startTime : null
        }))

        setSecondPlayer(player => ({
          ...player,
          isReady: false,
          isTurn: res.alphabet === 'X' ? null : res.startTime
        }))

        if (isFirst === false)
          socket.once('playchess', res => {
            const newHistory = history.slice(0, history.length);
            const current = newHistory[newHistory.length - 1];
            // create a copy of current array squares
            const squares = current.squares.slice();
            if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[res.position]) {
              return;
            }

            squares[res.position] = res.alphabet;
            setHistory(newHistory.concat([{ squares: squares, position: res.position }]));
            setNextAPL(res.alphabet === 'O' ? 'X' : 'O');
            setSecondPlayer(temp => ({
              ...temp,
              isReady: false,
              isTurn: res.startTime
            }))
            setFirstPlayer(temp => ({
              ...temp,
              isReady: false,
              isTurn: null
            }))
          })

      })

    // return () => {
    //   socket.off('startgame')
    //   socket.off('playchess')
    // }
  }, [isPlaying, history, isHost, isPlayer, isFirst])

  React.useEffect(() => {
    if (wait === true) {
      const newHistory = history;
      const current = newHistory[history.length - 1];
      const winnerTemp = calculateWinner(current.squares, current.position, 20, 20, 5);
      if (!winnerTemp.value) {
        socket.off('playchess')
        socket.once('playchess', res => {
          const newHistory = history.slice(0, history.length);
          const current = newHistory[newHistory.length - 1];
          // create a copy of current array squares
          const squares = current.squares.slice();
          if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[res.position]) {
            return;
          }
          setWait(false);
          squares[res.position] = res.alphabet;
          setSecondPlayer(temp => ({
            ...temp,
            isTurn: res.startTime
          }))
          setFirstPlayer(temp => ({
            ...temp,
            isTurn: null
          }))
          setHistory(newHistory.concat([{ squares: squares, position: res.position }]));
          setNextAPL(res.alphabet === 'O' ? 'X' : 'O');

        })
      }

    }

    // return () => {
    //   socket.off('playchess')
    // }

  }, [history, wait, isPlaying])

  React.useEffect(() => {
    if (!isPlayer && history.length === 1) {
      socket.off('startgame');
      socket.once('startgame', res => {
        socket.off('playchess')
        setFirstPlayer(player => ({
          ...player,
          isTurn: res.alphabet === 'X' ? player.isHost ? res.startTime : null : player.isHost ? null : res.startTime
        }))
        setSecondPlayer(player => ({
          ...player,
          isTurn: res.alphabet === 'X' ? player.isHost ? res.startTime : null : player.isHost ? null : res.startTime
        }))

        setWinner({
          value: null,
          position: []
        })

        setHistory([{
          squares: Array(400).fill(null),
          position: null,
        }])

        setIsPlaying(true)

        socket.once('playchess', res => {
          const newHistory = history.slice(0, history.length);
          const current = newHistory[newHistory.length - 1];
          // create a copy of current array squares
          const squares = current.squares.slice();
          if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[res.position]) {
            return;
          }
          squares[res.position] = res.alphabet;
          setFirstPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))
          setSecondPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))
          setHistory(newHistory.concat([{ squares: squares, position: res.position }]));
        })
      })
    }

    // return () => {
    //   socket.off('startgame');
    //   socket.off('playchess')
    // }

  }, [isPlayer, history])

  React.useEffect(() => {
    if (!isPlayer) {
      socket.off('playchess')
      const newHistory = history;
      const current = newHistory[history.length - 1];
      const winnerTemp = calculateWinner(current.squares, current.position, 20, 20, 5);
      if (!winnerTemp.value)
        socket.once('playchess', res => {
          const newHistory = history.slice(0, history.length);
          const current = newHistory[newHistory.length - 1];
          // create a copy of current array squares
          const squares = current.squares.slice();
          if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[res.position]) {
            return;
          }
          squares[res.position] = res.alphabet;
          setFirstPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))
          setSecondPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))

          setHistory(newHistory.concat([{ squares: squares, position: res.position }]));

        })
    }
    // return () => {
    //   socket.off('playchess')
    // }
  }, [isPlayer, history])

  const handleClick = (i) => {
    if (!isPlaying)
      return;
    if (nextALP !== alphabet)
      return;

    const newHistory = history.slice(0, history.length);
    const current = newHistory[newHistory.length - 1];
    // create a copy of current array squares
    const squares = current.squares.slice();
    if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[i]) {
      return;
    }
    setWait(true);
    squares[i] = alphabet;
    setSecondPlayer({
      ...secondPlayer,
      isTurn: null
    })

    setFirstPlayer({
      ...firstPlayer,
      isTurn: Date.now()
    })

    setHistory(newHistory.concat([{ squares: squares, position: i }]));
    setNextAPL(alphabet === 'O' ? 'X' : 'O');
    playChess(props.roomID, i, alphabet);
  }

  const handleStartGame = () => {
    if (firstPlayer.isReady === false) {
      if (notice.value === false)
        setNotice({
          value: true,
          message: "Chưa có đối thủ hoặc đối thủ chưa sẵn sàng!!!"
        })
    }
    else {
      setAlphabet('X');
      startGame(props.roomID, isFirst ? 'X' : 'O', setIsPlaying, setNextAPL, setHistory, setWinner);

      if (!isFirst) {
        socket.once('playchess', res => {
          const newHistory = history.slice(0, history.length);
          const current = newHistory[newHistory.length - 1];
          // create a copy of current array squares
          const squares = current.squares.slice();
          if (calculateWinner(current.squares, current.position, 20, 20, 5).value || squares[res.position]) {
            return;
          }
          squares[res.position] = res.alphabet;
          setFirstPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))
          setSecondPlayer(player => ({
            ...player,
            isTurn: res.alphabet === 'X' ? player.isHost ? null : res.startTime : player.isHost ? res.startTime : null
          }))

          setHistory(newHistory.concat([{ squares: squares, position: res.position }]));
          setNextAPL('X');
        })
      }
      if (firstPlayer.isReady) {
        setFirstPlayer({
          ...firstPlayer,
          isReady: false,
          isTurn: isFirst ? null : Date.now()
        })
      }

      setSecondPlayer({
        ...secondPlayer,
        isReady: false,
        isTurn: isFirst ? Date.now() : null
      })
    }

  }

  const handleLeaveRoom = () => {
    if (isPlaying && isPlayer) {
      const hostPos = firstPlayer.isHost ? 1 : 2;
      endMatch(props.roomID, isHost ? 2 : 1, hostPos === 1 ? firstPlayer.user.id : secondPlayer.user.id, hostPos === 1 ? secondPlayer.user.id : firstPlayer.user.id)
      surrenderRequest(props.roomID);
      setTimeout(() => {
        leaveRoom();
      }, 3000);
      return;
    }
    leaveRoom();
  }

  const handleStandUp = () => {
    socket.off('startgame')
    socket.off('playchess')
    setIsFirst(false);
    standUp(props.roomID, setIsPlayer, setIsHost);
    setAlphabet("");
    setNextAPL("");
  }

  const handleBecomePlayer = () => {
    socket.off('playchess')
    socket.off('startgame')
    becomePlayer(props.roomID, setIsPlayer, setIsHost, setIsFirst);
    setHistory([{
      squares: Array(400).fill(null),
      position: null,
    }])

    setWinner({
      value: null,
      position: []
    })
    setIsPlaying(false);
  }

  React.useEffect(() => {
    if (notice.value) {
      setTimeout(() => {
        setNotice({
          value: false,
          message: ""
        })
      }, 3900)
    }

  }, [notice.value]);

  React.useEffect(() => {
    const newHistory = history;
    const current = newHistory[history.length - 1];
    const winnerTemp = calculateWinner(current.squares, current.position, 20, 20, 5);

    if (winnerTemp.value !== null && isPlaying) {
      setIsPlaying(false)
      setFirstPlayer(player => (
        {
          ...player,
          isTurn: null
        }
      ))
      setSecondPlayer(player => (
        {
          ...player,
          isTurn: null
        }
      ))

      if (isPlayer)
        if (winnerTemp.value === alphabet) {
          setIsFirst(true);
          const hostPos = firstPlayer.isHost ? 1 : 2;
          endMatch(props.roomID, winnerTemp.value === 'X' ? 1 : 2, hostPos === 1 ? firstPlayer.user.id : secondPlayer.user.id, hostPos === 1 ? secondPlayer.user.id : firstPlayer.user.id)
        }
        else {
          setIsFirst(false);
        }

      setWinner(winnerTemp);
    }
  }, [history, alphabet, isPlaying, firstPlayer, secondPlayer, isPlayer, props.roomID])

  const handleIsAcceptDrawRequest = (isAccept) => {
    responseDrawRequest(props.roomID, isAccept);

  }

  const handleDrawRequest = () => {
    drawRequestSocket(props.roomID);
    socket.once('responsedrawrequest', isAccept => {
      if (isAccept === 1) {
        const hostPos = firstPlayer.isHost ? 1 : 2;
        endMatch(props.roomID, 0, hostPos === 1 ? firstPlayer.user.id : secondPlayer.user.id, hostPos === 1 ? secondPlayer.user.id : firstPlayer.user.id)
      } else {
        setNotice({
          value: true,
          message: "Đối thủ từ chối đề nghị cầu hòa của bạn!"
        })
      }
    })

  }


  const handleSurrender = () => {
    const hostPos = firstPlayer.isHost ? 1 : 2;
    endMatch(props.roomID, isHost ? 2 : 1, hostPos === 1 ? firstPlayer.user.id : secondPlayer.user.id, hostPos === 1 ? secondPlayer.user.id : firstPlayer.user.id)
    setIsFirst(false);
  }

  const handleOpenInvitePlayer = ()=>{
    getWaittingPlayers(setWaittingPlayers);
    setInvite(true);
  }

  const handleInvitePlayer = (userID)=>{
    invitePlayer([userID], props.roomID)
    const temp = [...waittingPlayer].map(item => {
      if(item.id === userID){
        return {
          ...item,
          isInvite: true
        }
      }
      else{
        return item;
      }
    });
    setWaittingPlayers(temp);
  }

  const handleCloseResultBoard = () => {
    document.getElementById('result').className = 'result outer-border downResult';
    setTimeout(() => {
      socket.off('playchess');
      socket.off('startgame');

      if (winner.value !== 'D')
        if (isPlayer && firstPlayer.user && secondPlayer.user) {
          if (winner.value === 'X') {
            if (isHost) {
              const range = secondPlayer.user.cup > firstPlayer.user.cup ? 3 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 5;
              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))

              if (firstPlayer.user)
                setFirstPlayer(player => {
                  if (player.user) {
                    return ({
                      ...player,
                      user: {
                        ...player.user,
                        cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                      }
                    })
                  }
                  else {
                    return ({
                      user: null,
                      isHost: false,
                      isReady: false,
                      isTurn: null
                    }
                    )
                  }
                })
            }
            else {
              const range = secondPlayer.user.cup > firstPlayer.user.cup ? 5 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 3;

              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))

              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))
            }
          }
          else {
            if (isHost) {
              const range = secondPlayer.user.cup > firstPlayer.user.cup ? 5 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 3;

              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))
              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))
            }
            else {
              const range = secondPlayer.user.cup > firstPlayer.user.cup ? 3 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 5;

              setSecondPlayer(player => ({
                ...player,
                user: {
                  ...player.user,
                  cup: Number(player.user.cup + range)
                }
              }))
              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))
            }
          }

        }
        else {
          if (winner.value === 'X') {

            if (firstPlayer.user && firstPlayer.isHost) {
              const range = firstPlayer.user.cup > secondPlayer.user.cup ? 3 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 5;

              setFirstPlayer(player => ({
                ...player,
                user: {
                  ...player.user,
                  cup: Number(player.user.cup + range)
                }
              }))
              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))
            }
            else {
              const range = firstPlayer.user.cup > secondPlayer.user.cup ? 5 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 3;

              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))
              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))
            }
          }
          else {
            if (firstPlayer.user && firstPlayer.isHost) {
              const range = firstPlayer.user.cup > secondPlayer.user.cup ? 5 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 3;

              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))

              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))
            }
            else {
              const range = firstPlayer.user.cup > secondPlayer.user.cup ? 3 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 5;

              if (firstPlayer.user)
                setFirstPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup + range)
                  }
                }))
              if (secondPlayer.user)
                setSecondPlayer(player => ({
                  ...player,
                  user: {
                    ...player.user,
                    cup: Number(player.user.cup - range) < 0 ? 0 : Number(player.user.cup - range)
                  }
                }))
            }
          }
        }

      setWinner({
        value: null,
        position: []
      })
      setHistory([{
        squares: Array(400).fill(null),
        position: null,
      }])
      setIsPlaying(false);


    }, 900)
  }

  React.useEffect(() => {
    if (winner.value && !isPlayer) {
      setTimeout(() => {
        if (document.getElementById('result')) {
          document.getElementById('result').className = 'result outer-border downResult';
          setTimeout(() => {
            socket.off('playchess');
            socket.off('startgame');
            setWinner({
              value: null,
              position: []
            })
            setHistory([{
              squares: Array(400).fill(null),
              position: null,
            }])
            setIsPlaying(false);
            getPlayers(props.roomID, setFirstPlayer, setSecondPlayer, setIsHost, setIsFirst);

            // if (winner.value)
            //   if (winner.value !== 'D')
            //     if (winner.value === 'X') {
            //       if (firstPlayer.user && firstPlayer.isHost) {
            //         setFirstPlayer(player => ({
            //           ...player,
            //           user: {
            //             ...player.user,
            //             cup: Number(player.user.cup + 5)
            //           }
            //         }))
            //         if (secondPlayer.user)
            //           setSecondPlayer(player => {
            //             if (player.user) {
            //               return ({
            //                 ...player,
            //                 user: {
            //                   ...player.user,
            //                   cup: Number(player.user.cup - 5) < 0 ? 0 : Number(player.user.cup - 5)
            //                 }
            //               })
            //             }
            //             else {
            //               return ({
            //                 user: null,
            //                 isHost: false,
            //                 isReady: false,
            //                 isTurn: null
            //               }
            //               )
            //             }
            //           })
            //       }
            //       else {
            //         if (firstPlayer.user)
            //           setFirstPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup - 5) < 0 ? 0 : Number(player.user.cup - 5)
            //             }
            //           }))

            //         if (secondPlayer.user)
            //           setSecondPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup + 5)
            //             }
            //           }))
            //       }
            //     }
            //     else {
            //       if (firstPlayer.user && firstPlayer.isHost) {
            //         if (firstPlayer.user)
            //           setFirstPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup - 5) < 0 ? 0 : Number(player.user.cup - 5)
            //             }
            //           }))

            //         if (secondPlayer.user)
            //           setSecondPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup + 5)
            //             }
            //           }))
            //       }
            //       else {
            //         if (firstPlayer.user)
            //           setFirstPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup + 5)
            //             }
            //           }))
            //         if (secondPlayer.user)
            //           setSecondPlayer(player => ({
            //             ...player,
            //             user: {
            //               ...player.user,
            //               cup: Number(player.user.cup - 5) < 0 ? 0 : Number(player.user.cup - 5)
            //             }
            //           }))
            //       }

            //     }

          }, 900)
        }
      }, 2000)

    }
  }, [winner, isPlayer, props.roomID]);

  const newHistory = history;
  const current = newHistory[history.length - 1];
  let range = 0;

  console.log(secondPlayer)

  if (winner.value)
    if (winner.value === alphabet) {
      range = secondPlayer.user.cup > firstPlayer.user.cup ? 3 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 5;
    }
    else {
      range = secondPlayer.user.cup > firstPlayer.user.cup ? 5 : secondPlayer.user.cup === firstPlayer.user.cup ? 4 : 3;
    }

  return (
    <>
      <Row>
        < Col xs={4} className='sidebar-infor' >
          <Row>
            <Col xs={6}>
              <button className="myButton mt-2" onClick={() => setOutGame(true)}>
                <img src={outRoom} className='img-out-room' alt='Đang load...'></img>
              </button>
            </Col>
            <Col xs={6} style={{ display: "flex", alignItems: "center" }}>
              <h5>Room ID: {props.roomID}</h5>
            </Col>
          </Row>
          <Row className='mid-border player-avatar'   >
            <div className='inner-border' style={{ position: "relative" }} >
              {
                firstPlayer.user ? <Row>
                  <Col xs={12} className='text-align-center'>
                    <h5 >{firstPlayer.user.username}</h5>
                  </Col>
                  <Col xs={12}>
                    {
                      isPlaying || !isPlayer ?
                        <div className='text-align-center' style={{ height: "17vh", width: "17vh", margin: "auto" }}>
                          <ChangingProgressProvider period = {period} startTime={firstPlayer.isTurn} interval={200} values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}>
                            {percentage => (
                              <CircularProgressbarWithChildren
                                value={percentage}
                                styles={buildStyles({
                                  pathColor: !firstPlayer.isTurn ? "brown" : percentage < 70 ? "#DE9B72" : "#ee5b00",
                                  trailColor: !firstPlayer.isTurn ? "brown" : "#eee",
                                  strokeLinecap: !firstPlayer.isTurn ? "brown" : "butt",
                                })}
                              >
                                <img src={firstPlayer.user.avatarImagePath === null ? man : firstPlayer.user.avatarImagePath} className="img-fluid z-depth-1 rounded-circle img-avatar" alt="Đang load..." />

                              </CircularProgressbarWithChildren>
                            )}
                          </ChangingProgressProvider>
                        </div> :
                        <div className='text-align-center'>
                          <img src={firstPlayer.user.avatarImagePath === null ? man : firstPlayer.user.avatarImagePath} className={`img-fluid z-depth-1 rounded-circle img-avatar ${firstPlayer.isReady ? 'ready' : ''}`} alt="" />
                        </div>
                    }


                  </Col>
                  <Col xs={12} className='text-align-center mt-2'>
                    <Row className="justify-content-md-center">
                      <img src={trophy} className="img-fluid z-depth-1 rounded-circle img-cup" alt="myimg" />
                      <h5>{firstPlayer.user.cup}</h5>
                    </Row>
                  </Col>
                </Row> :
                  <Row>
                    <Col xs={12} className='text-align-center'>
                    </Col>
                    <Col xs={12} className='text-align-center'>
                      {
                        isPlayer ?
                          <button className='none-button' onClick={ handleOpenInvitePlayer }>
                            <img src={add} className="img-fluid z-depth-1 rounded-circle add-user" alt="Đang load..." />
                          </button> :
                          <button className='none-button' onClick={handleBecomePlayer}>
                            <img src={join} className="img-fluid z-depth-1 rounded-circle add-user" alt="Đang load..." />
                          </button>
                      }

                    </Col>
                    <Col xs={12} className='text-align-center mt-2'>
                      <Row className="justify-content-md-center">
                      </Row>
                    </Col>
                  </Row>
              }
              {
                firstPlayer.isHost ? <div style={{ position: "absolute" }}>
                  <img src={key} className="img-fluid z-depth-1 rounded-circle " style={{ height: "8vh" }} alt="Đang load..." />
                </div> : <></>
              }
            </div>
          </Row>
          <Row className='mid-border player-avatar'   >
            <div className='inner-border' style={{ position: 'relative' }} >
              {
                secondPlayer.user ? <Row>
                  <Col xs={12} className='text-align-center'>
                    <h5 >{secondPlayer.user.username}</h5>
                  </Col>
                  <Col xs={12}>
                    {
                      isPlaying || !isPlayer ?
                        <div className='text-align-center' style={{ height: "17vh", width: "17vh", margin: "auto" }}>
                          <ChangingProgressProvider period = {period} startTime={secondPlayer.isTurn} interval={200} values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]}>
                            {percentage => (
                              <CircularProgressbarWithChildren
                                value={percentage}
                                styles={buildStyles({
                                  pathColor: !secondPlayer.isTurn ? "brown" : percentage < 70 ? "#DE9B72" : "#ee5b00",
                                  trailColor: !secondPlayer.isTurn ? "brown" : "#eee",
                                  strokeLinecap: !secondPlayer.isTurn ? "brown" : "butt",
                                })}
                              >
                                <img src={secondPlayer.user.avatarImagePath === null ? man : secondPlayer.user.avatarImagePath} className="img-fluid z-depth-1 rounded-circle img-avatar" alt="Đang load..." />

                              </CircularProgressbarWithChildren>
                            )}
                          </ChangingProgressProvider>
                        </div>
                        : <div className='text-align-center'>
                          <img src={secondPlayer.user.avatarImagePath === null ? man : secondPlayer.user.avatarImagePath} className={`img-fluid z-depth-1 rounded-circle img-avatar ${secondPlayer.isReady ? 'ready' : ''}`} id='demoObject' alt="" />
                        </div>
                    }
                  </Col>
                  <Col xs={12} className='text-align-center mt-2'>
                    <Row className="justify-content-md-center">
                      <img src={trophy} className="img-fluid z-depth-1 rounded-circle img-cup" alt="myimg" />
                      <h5>{secondPlayer.user.cup}</h5>
                    </Row>
                  </Col>
                </Row> :
                  <Row>
                    <Col xs={12} className='text-align-center'>
                    </Col>
                    <Col xs={12} className='text-align-center'>
                      <button className='none-button' onClick={handleBecomePlayer}>
                        <img src={join} className="img-fluid z-depth-1 rounded-circle add-user" alt="myimg" />
                      </button>
                    </Col>
                    <Col xs={12} className='text-align-center mt-2'>
                      <Row className="justify-content-md-center">
                      </Row>
                    </Col>
                  </Row>
              }
              {
                secondPlayer.isHost ? <div style={{ position: "absolute" }}>
                  <img src={key} className="img-fluid z-depth-1 rounded-circle " style={{ height: "8vh" }} alt="myimg" />
                </div> : <></>
              }
            </div>
          </Row>

          <Row className='sidebar-infor-footer'>
            <Col >
              {isPlayer && isPlaying ? <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip> Đầu hàng</Tooltip>}
              >
                <div className='myButton stand-up-button text-align-center' onClick={() => setSurrender(true)}>
                  <img src={whiteflag} className='img-cup' alt='img-cup'></img>
                </div>
              </OverlayTrigger> : <></>
              }

            </Col >
            <Col >
              {isPlayer ? isPlaying ?
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip> Cầu hòa</Tooltip>}
                >
                  <div className='myButton stand-up-button text-align-center' onClick={() => setDrawRequest(0)}>
                    <img src={handshake} className='img-cup' alt='handsake'></img>
                  </div>
                </OverlayTrigger>
                :
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip> Đứng lên</Tooltip>}
                >
                  <div className='myButton stand-up-button text-align-center' onClick={handleStandUp} >
                    <img src={upArrow} className='img-cup' alt='uparrow'></img>
                  </div>
                </OverlayTrigger> : <></>}

            </Col >
            <Col >
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip> Người xem</Tooltip>}
              >
                <div className='myButton viewer-button text-align-center' onClick={() => setSeeViewer(true)}>
                  {viewers.length}
                  <img src={group} className='img-cup ml-2' alt="myimg"></img>
                </div>
              </OverlayTrigger>,

            </Col >
          </Row>
        </Col >
        <Col xs={8} className="game-board">
          <Container>
            {winner.value ?
              <div className='result outer-border upResult' id='result' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <button className='close-button none-button ' onClick={handleCloseResultBoard}>
                        <img src={close} className='img-cup' alt="Đang load"></img>
                      </button>
                      <div className='notice-content'>
                        <h1 style={{ color: "#DE9B72" }}>{isPlayer ? winner.value !== 'D' ? winner.value === alphabet ? "Y0U WIN" : "YOU LOSE" : "DRAW" : winner.value === 'X' ? firstPlayer.isHost ? firstPlayer.user.username + " WIN" : secondPlayer.user.username + " WIN" : winner.value === 'O' ? firstPlayer.isHost ? secondPlayer.user.username + " WIN" : firstPlayer.user.username + " WIN" : "DRAW"}</h1>
                        <h5>Cup ban đầu: {isPlayer? secondPlayer.user.cup : 0}</h5>
                        <h5>Cộng: {isPlayer && winner.value !== 'D' ? winner.value === 'X' ? secondPlayer.isHost ? +range : Number(secondPlayer.user.cup - range) < 0 ? -secondPlayer.user.cup : -range : secondPlayer.isHost ? Number(secondPlayer.user.cup - range) < 0 ? -secondPlayer.user.cup : -range : +range : 0}</h5>
                        <h5>Tổng cộng: {isPlayer && winner.value !== 'D' ? winner.value === 'X' ? secondPlayer.isHost ? Number(secondPlayer.user.cup + range) : Number(secondPlayer.user.cup - range) < 0 ? 0 : Number(secondPlayer.user.cup - range) : secondPlayer.isHost ? Number(secondPlayer.user.cup - range) < 0 ? 0 : Number(secondPlayer.user.cup - range) : Number(secondPlayer.user.cup + range) : 0}</h5>
                        <div className='myButton mt-2' onClick={handleCloseResultBoard}>
                          {isPlayer ? "Chơi tiếp" : "Đã rõ"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> : <></>
            }
            {seeViewer ?
              <div className='viewer outer-border upResult' id='viewer' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <button className='close-button none-button' onClick={() => {
                        document.getElementById('viewer').className = 'viewer outer-border downResult';
                        setTimeout(() => {
                          setSeeViewer(false);
                        }, 900)
                      }}>
                        <img src={close} className='img-cup' alt="Đang load"></img>
                      </button>
                      <div className='notice-content'>
                        <h3>Người xem</h3>
                        <div class="tbl-header">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th><img src={trophy} className='img-cup' alt="Đang load"></img></th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div class="tbl-content">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                              {viewers.map((item, index) => {
                                return (<tr key={index}>
                                  <td>{item.username}</td>
                                  <td>{item.cup}</td>
                                </tr>)
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className='myButton mt-2' onClick={() => {
                          document.getElementById('viewer').className = 'viewer outer-border downResult';
                          setTimeout(() => {
                            setSeeViewer(false);
                          }, 900)
                        }}>
                          OK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div> : <></>
            }

            {invite ?
              <div className='invite outer-border upResult' id='invite' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <button className='close-button none-button' onClick={() => {
                        document.getElementById('invite').className = 'invite outer-border downResult';
                        setTimeout(() => {
                          setInvite(false);
                        }, 900)
                      }}>
                        <img src={close} className='img-cup' alt="Đang load"></img>

                      </button>
                      <div className='notice-content'>
                        <h3>Danh sách mời</h3>
                        <div class="tbl-header">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th><img src={trophy} className='img-cup' alt="Đang load"></img></th>
                                <th></th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div class="tbl-content">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                              {
                                waittingPlayer.map((player, index)=>(
                                  <tr key = {index}>
                                  <td>{player.username}</td>
                                  <td>{player.cup}</td>
                                  <td >{!player.isInvite? <div className='myButton' onClick = {()=> handleInvitePlayer(player.id)}>Mời</div> : <></>} </td>
                                </tr>
                                ))
                              }
                            
                            </tbody>
                          </table>
                        </div>

                        <div className='myButton mt-2' onClick={() => {
                          document.getElementById('invite').className = 'invite outer-border downResult';
                          const userIDs = waittingPlayer.map(item => item.id);
                          invitePlayer(userIDs, props.roomID)
                          setTimeout(() => {
                            setInvite(false);
                          }, 900)
                          setNotice({
                            value: true,
                            message: "Đã mời lời thành công đến người chơi khác"
                          })
                        }}>
                          Mời tất cả
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div> : <></>
            }

            {outGame ?
              <div className='outGame outer-border upResult' id='outGame' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="Đang load"></img>

                      <button className='close-button none-button' onClick={() => {
                        document.getElementById('outGame').className = 'outGame outer-border downResult';
                        setTimeout(() => {
                          setOutGame(false);
                        }, 900)
                      }}>
                        <img src={close} className='img-cup' alt="Đang load"></img>

                      </button>
                      <div className='notice-content'>
                        <h3>Thông báo</h3>
                        <h5>Bạn có đồng ý rời khỏi phòng không?</h5>
                        <div>
                          <div className='myButton mt-2 mr-2' onClick={() => {
                            document.getElementById('outGame').className = 'outGame outer-border downResult';
                            setTimeout(() => {
                              setOutGame(false);
                            }, 900)
                          }}>
                            Hủy
                        </div>
                          <Link to='/'>
                            <div className='myButton mt-2 ml-2' onClick={handleLeaveRoom}>
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

            {surrender ?
              <div className='surrender outer-border upResult' id='surrender' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="myimg"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="myimg"></img>

                      <button className='close-button none-button' onClick={() => {
                        document.getElementById('surrender').className = 'surrender outer-border downResult';
                        setTimeout(() => {
                          setSurrender(false);
                        }, 900)
                      }}>
                        <img src={close} className='img-cup' alt="myimg"></img>

                      </button>
                      <div className='notice-content'>
                        <h3>Đầu hàng</h3>
                        <h5>Bạn có muốn đầu hàng đối thủ không?</h5>
                        <div>
                          <div className='myButton mt-2 mr-2' onClick={() => {
                            document.getElementById('surrender').className = 'surrender outer-border downResult';
                            setTimeout(() => {
                              setSurrender(false);
                            }, 900)
                          }}>
                            Hủy
                        </div>
                          <div className='myButton mt-2 ml-2' onClick={() => {
                            document.getElementById('surrender').className = 'surrender outer-border downResult';
                            surrenderRequest(props.roomID)
                            setTimeout(() => {
                              handleSurrender();
                              setSurrender(false);
                            }, 900)
                          }}>
                            Đồng ý
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> : <></>
            }

            {drawRequest !== -1 ?
              <div className='drawRequest outer-border upResult' id='drawRequest' >
                <div class="body dark-background" style={{ backgroundImage: "url(https://i.ibb.co/nrmkm7d/five-bells-washed-out-logo.png)" }}>
                  <div class="mid-border">
                    <div class="inner-border">
                      <img class="vertical-decoration top" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="myimg"></img>
                      <img class="vertical-decoration bottom" src="https://i.ibb.co/JRTK9z4/horizontally-centered-vertical-decoration.png" alt="myimg"></img>

                      <button className='close-button none-button' onClick={() => {
                        document.getElementById('drawRequest').className = 'drawRequest outer-border downResult';
                        setTimeout(() => {
                          setDrawRequest(-1)
                        }, 900)
                      }}>
                        <img src={close} className='img-cup' alt="myimg"></img>

                      </button>
                      <div className='notice-content'>
                        <h3>Cầu hòa</h3>
                        <h5>{surrender === 0 ? "Bạn có muốn đầu hàng đối thủ không?" : "Đối thủ muốn đầu hàng bạn"}</h5>
                        <div>
                          <div className='myButton mt-2 mr-2' onClick={() => {
                            document.getElementById('drawRequest').className = 'drawRequest outer-border downResult';

                            if (drawRequest === 1) {
                              handleIsAcceptDrawRequest(0);
                            }

                            setTimeout(() => {
                              setDrawRequest(-1)
                            }, 900)
                          }}>
                            Hủy
                        </div>
                          <div className='myButton mt-2 ml-2' onClick={() => {
                            if (drawRequest === 0)
                              handleDrawRequest();
                            else {
                              handleIsAcceptDrawRequest(1);
                            }
                            document.getElementById('drawRequest').className = 'drawRequest outer-border downResult';
                            setTimeout(() => {
                              setDrawRequest(-1)
                            }, 900)

                          }}>
                            Đồng ý
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div> : <></>
            }

            {notice.value ?

              <Notice content={notice.message}></Notice> : <></>
            }

            {isPlayer && !isPlaying ? isHost && !winner.value ?
              <div className='myButton start-btn' onClick={handleStartGame}>
                Bắt Đầu
            </div> : !firstPlayer.isReady && !secondPlayer.isReady && !winner.value ? <div className='myButton start-btn' onClick={() => {
                if (firstPlayer.isHost === true)
                  readyPlay(props.roomID, secondPlayer, setSecondPlayer)
                else
                  readyPlay(props.roomID, firstPlayer, setFirstPlayer)
              }}>
                Sẵn sàng
            </div> : <></> : <></>}

            <div style={{ pointerEvents: isPlaying && isPlayer ? "all" : "none" }}>
              <Board
                currentPosition={current.position}
                winningSquares={winner.value ? winner.position : []}
                squares={current.squares}
                onClick={(i) => handleClick(i)}
              />
            </div>

          </Container>
        </Col>
      </Row>
    </>

  );
}
export default GameArea;