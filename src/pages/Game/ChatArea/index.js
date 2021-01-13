import React, { useState, useEffect } from 'react';
import { Card, CardGroup } from 'react-bootstrap';

import './styles.css';
import SendMessageComponent from './SendMessageComponent';
import MessageItem from './MessageItem';
import { socket, sendMessage } from './../../../context/Socket';

const ChatArea = ({ roomID }) => {
  const [messages, setMessages] = useState([]);
  const [isError, setIsError] = useState(false);
  React.useEffect(() => {
    socket.once('message', res => {
      setMessages([...messages, ...[{
        name: res.username?res.username:'Guest',
        content: res.content,
        time: res.time,
        host: false,
        image: '#'
      }
      ]]);
    });
    return () => {
      socket.off('message')
    }
  }, [roomID,messages]);
  useEffect(() => {
    setMessages([{
      name: 'System',
      content: 'Chào mừng bạn đến với Advanced Caro của Khoa Hưng Huy',
      time: Date.now(),
      host: false,
      image: '#'
    }]);
  }, []);
  const handleSendMessage = (input) => {
    const currentTime = Date.now();
    sendMessage(roomID, input, setIsError, currentTime);
    setMessages([...messages,...[{
      name: 'Tôi',
      content: input,
      time: currentTime,
      host: true,
      image: '#'
    }]]);
  }
  return (
    <>
      <CardGroup className={'pageChatRoomContainer'} style = {{border: "5px solid brown"}}>
        <Card.Header className='pageChatRoomHeader'>
          <Card.Title style = {{color: "#DE9B72"}}>Trò chuyện</Card.Title>
        </Card.Header>
        <Card.Body className='pageChatRoomBody'>
          {
            messages.map((message, index, arr) => {
              return (
                message.host ? <div className='hostContainer'>
                  <MessageItem name={message.name} index={index} typePlayer='host' content={message.content} time={message.time} isFinal = {arr.length - 1 === index? true : false}/>
                </div> :
                  <div className='guestContainer'>
                    <MessageItem name={message.name} index={index} typePlayer='guest' content={message.content} time={message.time} isFinal = {arr.length - 1 === index? true : false} />
                  </div>
              )
            })
          }
          {
            isError?<div className='noticeMessage'>Gửi lỗi</div>:null
          }
        </Card.Body>
        <Card.Footer className='pageChatRoomFooter'>
          <SendMessageComponent sendMessage={handleSendMessage} />
        </Card.Footer>
      </CardGroup>
    </>
  )
}
export default ChatArea;