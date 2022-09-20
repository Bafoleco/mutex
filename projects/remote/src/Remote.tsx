import React from 'react';
import TabDisplay from './TabDisplay';
import './messaging';
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
      <div> No id </div>
    );
  }

  console.log(registeredTabs);

  return (
    registeredTabs ? <TabDisplay id={id} registeredTabs={registeredTabs} /> : <div> Loading... </div>
  );
}


export default Remote;
