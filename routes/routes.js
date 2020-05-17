const express = require('express')
const router = express.Router()
const axios = require('axios').default;
const request = require('request');
 
//Importe instancia/modelo de conexión a la base de datos
const temperModel = require('../model/temper')
 
/*RUTINA DE LECTURA NÚMERO 1 */
//LECTURA Y DEVOLUCIÓN DE DATOS DIRECTAMENTE DESDE API
router.get('/direct-api', (req, res) => {
    //se redirecciona el get para dirigirse a la API
    request('https://ws.smn.gob.ar/map_items/weather/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        
        //Se parsean los datos obtenidos (de alrededor de 200 localidades argentinas (no se puede especificar el endpoint)
        var data = JSON.parse(body)
        
        //Se recorre el compendio de datos para separar los específicos de Buenos aires
        //2do: Esto se tiene que poder hacer con una busqueda x xpath o algo asi
        for (index in data){
 
            if(data[index].name === 'Capital Federal'){ //se lo hace tomando esta condición
                var baires = data[index]
                bs = {} //Se crea un 'objeto' "bs" que resguarde TODA la información del clima 
                db = {} //Se crea un nuevo objeto "db" y se pasa allí SOLO las 3 variables que importan: temp, st, hum.
                bs = baires.weather    
                db.temp = bs.temp
                db.humidity = bs.humidity
                db.st = bs.st == null ? 0 : bs.st
            
                // var data = JSON.stringify(db)
                res.send('Temperature: '  + db.temp +  '\nFeels like: ' + db.st + '\nHumidity: ' + db.humidity + '%') 
            }
        }
    }
    });
})
 
//Ruta de escritura de datos en archivo txt a ser descargado 
/* 
1 - se capturan los datos de la BD
2 - se devuelven esos registros
*/
/*
router.get('/get', (req, res) => {
// - 1
    temperModel.find({})
// - 2
    .then(file => {
        console.log('ópereta')
        res.send(file)
    })
});
*/
 
/* ----------------EN EL CLIENTE------------ */
/*
1) Comando para construir una rutina donde: 
        - SC "dayly"     -- es el argumento de repitición 
        - TN "MyTasks.." -- es el nombre
        - TR "..."       -- es el archivo donde está el script
SCHTASKS /CREATE /SC DAILY /TN "MyTasks\Notepad task" /TR "C:\Windows\System32\notepad.exe" /ST 11:00 /RU admin
2) Sintaxis de la rutina
@ECHO OFF
cd C:\Users\juanp\MyTasks
curl http://localhost:5000/test/get -o x.txt
donde "x.txt" --> es el archivo de texto donde se actualizan los datos. 
*/
 
module.exports = router