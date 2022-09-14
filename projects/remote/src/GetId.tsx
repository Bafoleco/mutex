import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';

export const GetId = () => {
  const [id, setId] = React.useState<string | undefined>(undefined);

  return (
    <Stack style={{padding: '0.5rem 3rem 0.5rem 3rem'}} gap={2}>
      <input placeholder="Pairing Code" value={id} onChange={(event) => {
        setId(event.target.value);
      }}/>

      <Button onClick={() => {  }}> 
        Connect to server
      </Button>
    </Stack>
  )
}