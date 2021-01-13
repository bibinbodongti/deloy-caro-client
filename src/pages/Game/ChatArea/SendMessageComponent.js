import React,{useState} from 'react';
import { InputGroup,FormControl,Button } from 'react-bootstrap';

const SendMessageComponent = ({sendMessage}) => {
  const [input,setInput]=useState('');
  const handleChangeInput=(e)=>{
    setInput(e.target.value);
  }
  const handleSendMessage=(e)=>{
    e.preventDefault();
    sendMessage(input);
    setInput('');
  }
  return (
    <div>
      <form onSubmit={handleSendMessage}>
      <InputGroup className="mb-2">
        <FormControl
          placeholder="Enter message..."
          aria-label="Enter message..."
          aria-describedby="basic-addon2"
          value={input}
          onChange={handleChangeInput}
        />
        <InputGroup.Append>
          <Button type='submit' onClick={handleSendMessage} variant="outline-light">Gửi</Button>
        </InputGroup.Append>
      </InputGroup>
      </form>
    </div>
  )
}
export default SendMessageComponent;