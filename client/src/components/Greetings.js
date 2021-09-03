import React from 'react';
import {useParams} from 'react-router-dom';

export default function Greetings() {

  const { token } = useParams();
  console.log("token: " + token);

  return (
    <div>
        <h1>Greetings, Who ever the fuck you are</h1>
    </div>
  )
}