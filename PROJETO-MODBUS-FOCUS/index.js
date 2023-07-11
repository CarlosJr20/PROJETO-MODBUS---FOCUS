'use strict';

const modbus = require('jsmodbus');
const net = require('net');
const socket = new net.Socket();
const options = {
  'host': '192.168.1.5',
  // 'host': '127.0.0.1',
  'port': '502'
};
const client = new modbus.client.TCP(socket);

const readings = {}; 

function read() {
  socket.on('connect', function () {
    client.readHoldingRegisters(4601, 2)
      .then(function (resp) {
        readings.PESO_1 = resp.response._body.valuesAsArray[1];
        readings.PESO_2 = resp.response._body.valuesAsArray[0];
        readCoils();
      })
      .catch(function () {
        console.error(require('util').inspect(arguments, {
          depth: null
        }));
        socket.end();
      });
  });

  socket.on('error', console.error);
  socket.connect(options);
}

function readCoils() {

  client.readCoils(2424, 1)
    .then(function (resp) {
      readings['BICO_1'] = resp.response._body.valuesAsArray[0];

 
      client.readCoils(2463, 1)
        .then(function (resp) {
          readings['BICO_2'] = resp.response._body.valuesAsArray[0];

          if (readings.PESO_1 > 500 || readings.PESO_2 > 500) {
         
            readings.PESO_1 = 0;
            readings.PESO_2 = 0;
          }

          socket.end(); 
          console.log(JSON.stringify(readings));
        })
        .catch(function () {
          console.error(require('util').inspect(arguments, {
            depth: null
          }));
          socket.end();
        });
    })
    .catch(function () {
      console.error(require('util').inspect(arguments, {
        depth: null
      }));
      socket.end();
    });
}

read();
