import React, { useState } from 'react';
import { Card, CardGroup, Nav } from 'react-bootstrap';

import './styles.css';
import MessageItem from './MessageItem';

const ChatArea = ({ jumpTo, stepHistory, chats }) => {
  const [messages, setMessages] = useState([]);
  const [activeKey, setActiveKey] = useState("chess");
  const [steps, setSteps] = useState(stepHistory);
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(()=>{
    setSteps(stepHistory)
  }, [stepHistory])

  React.useEffect(() => {
    setMessages(chats)
  }, [chats])
  return (
    <>
      <CardGroup className={'pageChatRoomContainer'} style={{ border: "5px solid brown" }}>
        <Card.Header className='pageChatRoomHeader'>
          <Nav variant="tabs" defaultActiveKey="#chess" style={{ minWidth: "-webkit-fill-available" }}>
            <Nav.Item style={{ minWidth: "50%" }} onClick={() => setActiveKey("chess")}>
              <Nav.Link href="#chess" >Nước đi</Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ minWidth: "50%" }} onClick={() => setActiveKey("mess")}>
              <Nav.Link href="#mess" >Trò chuyện</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className='pageChatRoomBody'>
          {
            activeKey === "chess" ?
              steps.map((step, move) => {
                const desc = move ?
                  'Đánh tại ô' + " ( " + Math.floor(step.position / 20) + ", " + step.position % 20 + " )" :
                  'Bắt đầu game';
                return (
                  <li key={move} style = {{marginTop: "2vh", minWidth: "-webkit-fill-available" }}>
                    <button className = {`myButton ${move === currentStep ? 'ready' : ''}`} onClick={() => {jumpTo(move); setCurrentStep(move)} } style={{  minWidth: "90%" }}>{desc}</button>
                  </li>
                );
              })
              :
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
        </Card.Body>
      </CardGroup>
    </>
  )
}
export default ChatArea;