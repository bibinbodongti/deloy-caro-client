import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const Notice = ({handleClose, isShow, mes})=> {
  const [show, setShow] = React.useState(isShow);
  const [message, setMessage] = React.useState(mes);
  React.useEffect(()=>{
    setShow(isShow);
    setMessage(mes);
  }, [isShow, mes])
  return (
    <>
      <Modal show={show} onHide={()=> {handleClose(); setShow(false)}} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{handleClose(); setShow(false)}}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Notice;
