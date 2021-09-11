import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

export default function Ground({ playerAction }) {

return (
        <div className="d-flex justify-content-around flex-row col-md-2 offset-md-2 addopacitymonkey adddisablemonkey" id="grounddisappear">
            <div className="col-3 col-md-9 m-1 d-flex justify-content-center flex-row ">
                <img alt="" src="" className="img-fluid" id="groundcard" onClick={playerAction} />
            </div>
        </div>
  );
}