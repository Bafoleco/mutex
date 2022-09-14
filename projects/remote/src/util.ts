import { SERVER_URL } from '../../common/constants';

export const send_message = (type: string, id: string, payload: object) => {

  const body = {
    message: {
      type: type, 
      id: id,
      payload: payload
    }
  };
  
  fetch(SERVER_URL + "/sendDataToExtension/" + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}