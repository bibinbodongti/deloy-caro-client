import React,{useState} from 'react';
import { InputGroup,FormControl,Button } from 'react-bootstrap';


const SendMessageComponent = ({sendMessage}) => {
  const [input,setInput]=useState('');
  const handleChangeInput=(e)=>{
    setInput(e.target.value);
  }
  const handleSendMessage=()=>{
    sendMessage(input);
    setInput('');
  }
  return (
    <div>
      <InputGroup className="mb-2">
        <FormControl
          placeholder="Enter message..."
          aria-label="Enter message..."
          aria-describedby="basic-addon2"
          value={input}
          onChange={handleChangeInput}
        />
        <InputGroup.Append>
          <Button onClick={handleSendMessage} variant="outline-light">Gửi</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  )
}
export default SendMessageComponent;