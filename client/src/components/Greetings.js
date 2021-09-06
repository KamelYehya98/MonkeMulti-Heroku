import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Greetings({username}) {
  return (
    <div>
        <div className="text-light">Greetings, {username!=null ? username : 'Guest'}</div>
    </div>
  );
}