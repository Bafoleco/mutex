import React from 'react';
import TabDisplay from './TabDisplay';
import './messaging';
import Spinner from 'react-bootstrap/Spinner'
import { useParams } from 'react-router-dom';
import { onFirestoreUpdate } from './messaging';
import { RegisteredTabs } from '../../common/types';

const Remote = () => {
  const [registeredTabs, setRegisteredTabs] = React.useState<RegisteredTabs | undefined>(undefined);
  const { id } = useParams();

  React.useEffect(() => {
    console.log("setting up firestore listener");

    if (id) {
      onFirestoreUpdate(id, (tabState) => {
        console.log('cb: got tab state from firestore');
        if (tabState) {
          console.log('got tab state from firestore');
          console.log(tabState);
          console.log('setting tab state');
          setRegisteredTabs(tabState);
        }
      });
    }
  }, [id]);

  if (!id) {
    return (
      <div> No Mutex ID could be parsed from this url. Did you use an exact pairing link from the extension? </div>
    );
  }

  console.log(registeredTabs);

  return (
    registeredTabs ? <TabDisplay id={id} registeredTabs={registeredTabs} /> :
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spinner animation="border" variant="secondary" role="status" style={{ margin: 'auto', width: "10rem", height: "10rem" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
  );
}


export default Remote;
