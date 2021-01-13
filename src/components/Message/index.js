import React from 'react'

const Notice = ({content}) => {

  return (
    <div className='notice-game outer-border upResult' id='notice' >
      <h5>{content}</h5>
    </div>
  );
}

export default Notice;
