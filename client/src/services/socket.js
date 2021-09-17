import io from "socket.io-client";
function Sok () {
    this.socket = 0;
    
    this.getSocket = function () {
        if ( this.socket == 0) {
            this.socket = io();
            return  this.socket;
        }
        else
            return  this.socket;
    }
}
let sok = new Sok();
export default sok;