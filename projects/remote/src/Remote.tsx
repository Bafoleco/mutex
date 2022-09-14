import React from 'react';
import TabDisplay from './TabDisplay';
import './messaging';
import { useParams } from 'react-router-dom';

import { onFirestoreUpdate } from './messaging';

const Remote = () => {
  const [tabInfo, setTabInfo] = React.useState({});
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
          setTabInfo(tabState);
        }
      });  
    }
  }, [id]);

  if (!id) {
    return (
      <div> No id </div>
    );
  }

  return(
    <TabDisplay id={id} registeredTabs={tabInfo}/>  
  );
}


export default Remote;
