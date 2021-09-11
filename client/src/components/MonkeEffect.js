import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

export default function MonkeEffect() {

return (
    <div className="d-flex justify-content-center flex-row col-12" id="monkeyparentdiv">
        <div id="monkeydiv" className="m-0 p-0 disableformonkey">
            <span id="monkeyspan1">MON</span>
            <span id="monkeyspan2">KE</span>
        </div>
    </div>
  );
}