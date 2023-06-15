'use strict' 
 
const modbus = require('jsmodbus');
const net = require('net'); 
const socket = new net.Socket() 
const options = { 
  'host': '127.0.0.1', 
  'port': '502' 
} 
const client = new modbus.client.TCP(socket); 
 
function readHreg(){ 
    socket.on('connect', function () { 
    client.readHoldingRegisters(0, 10)
        .then(function (resp) { 
          const data = {
            values: resp.response._body.valuesAsArray
          };
          const jsonData = JSON.stringify(data);
          console.log(jsonData);
          socket.end();

        })
        .catch(function(){
            console.error(require('util').inspect(arguments,{
                depth: null
            }));
            socket.end();

        });
    });
        socket.on('error', console.error); 
        socket.connect(options);
} 
 
   readHreg();