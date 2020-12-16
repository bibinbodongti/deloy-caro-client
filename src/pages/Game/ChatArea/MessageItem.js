import React from 'react';
import {Toast } from 'react-bootstrap';

const MessageItem = ({typePlayer,name,time,content,image,index}) => {
  return (
    <>
      <Toast keu={index} className={typePlayer}>
        <Toast.Header closeButton={false}>
          <img src={image?image:'#'} className="rounded mr-2" alt="" />
          <strong className="mr-auto">{name?name:'Player'}</strong>
          <small>{time?time:'just now'}</small>
        </Toast.Header>
        <Toast.Body>{content?content:'...'}</Toast.Body>
      </Toast>
    </>
  )
}
export default MessageItem;