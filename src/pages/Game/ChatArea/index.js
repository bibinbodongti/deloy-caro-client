import React, { useState, useEffect } from 'react';
import { Card, CardGroup, Button } from 'react-bootstrap';

import './styles.css';
import SendMessageComponent from './SendMessageComponent';
import MessageItem from './MessageItem';
import { socket, sendMessage } from './../../../context/Socket';

const ChatArea = ({ roomID }) => {
  const [messages, setMessages] = useState([]);
  const [isMessageBox, setIsMessageBox] = useState(false);
  const [isError, setIsError] = useState(false);
  React.useEffect(() => {
    socket.once('message', res => {
      setMessages([...messages, ...[{
        name: res.username?res.username:'Guest',
        content: res.content,
        time: 'just now',
        host: false,
        image: '#'
      }
      ]]);
      setIsMessageBox(true);
    });
    return () => {
      socket.off('message')
    }
  }, [roomID,messages]);
  useEffect(() => {
    setMessages([{
      name: 'System',
      content: 'Chào mừng bạn đến với Advanced Caro của Khoa Hưng Huy',
      time: 'just now',
      host: false,
      image: '#'
    }]);
    setIsMessageBox(true);  
  }, []);
  const handleSendMessage = (input) => {
    sendMessage(roomID, input, setIsError);
    setMessages([...messages,...[{
      name: 'Mine',
      content: input,
      time: 'just now',
      host: true,
      image: '#'
    }]]);
  }
  return (
    <>
      <CardGroup className={isMessageBox ? 'pageChatRoomContainer' : 'pageChatRoomContainer-hidden'}>
        <Card.Header className='pageChatRoomHeader'>
          <Card.Title>Trò chuyện</Card.Title>
          <Button variant="outline-danger" onClick={() => setIsMessageBox(false)}>
            <svg
              fill='white'
              width="1em" height="1em"
              viewBox="0 0 329.26933 329"
              xmlns="http://www.w3.org/2000/svg">
              <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
            </svg>
          </Button>
        </Card.Header>
        <Card.Body className='pageChatRoomBody'>
          {
            messages.map((message, index) => {
              return (
                message.host ? <div className='hostContainer'>
                  <MessageItem name={message.name} index={index} typePlayer='host' content={message.content} time={message.time} />
                </div> :
                  <div className='guestContainer'>
                    <MessageItem name={message.name} index={index} typePlayer='guest' content={message.content} time={message.time} />
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
      <Button onClick={() => setIsMessageBox(true)} className={!isMessageBox ? 'iconMessage' : 'iconMessage-hidden'}>Messsage</Button>
    </>
  )
}
export default ChatArea;