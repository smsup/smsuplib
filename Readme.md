smsuplib
============

Libreria nodejs que facilita el uso de la api de smsup.es para el envio de sms.

Documentacion de la API disponible en:

http://www.smsup.es/docs/api/

Instalacion
-----------

```bash
npm install smsuplib --save
```


Uso
---

Envio de un sms:

``` javascript
sms.sendSms('texto del mensaje', ['+34 600000000'], 'Remitente')
    .then(
        function (response) {
            console.log('OK', response);
        },
        function (response) {
            console.log(response);
        }
    );
```

Si todo ha ido bien, en response se recibe un array de objetos, uno por telefono indicado. 
Cada objeto tiene dos parametros:
- telefono: telefono indicado al hacer la peticion.
- id: id asignado a ese envio. Es el id ha usar en otras peticiones, por ejemplo para saber el estado del envio.

Si ha ocurrido un error, se recibe en response un objeto con dos parametros:
- httCode: codigo http de la respuesta.
- error: mensaje explicativo del error

Ademas de los tres parametros indicados, el metodo sendSms admite otros 3 parametros opcionales:
- date: objeto Date con la fecha en la que se quiere enviar el mensaje. Si no se indica se envia en el momento actual.
- coding: codificacion usada para el mensaje smsuplib.GSM, smsuplib.UNICODE o smsuplib.AUTO
- reference: identificador unico de esa peticion

Obtener el estado de un envio:

``` javascript
sms.stateSms('1000000')
    .then(
        function (response) {
            console.log('OK', response);
        },
        function (response) {
            console.log(response);
        }
    );
```

Si la peticion es correcta, se recibe un objeto con tres parametros:
- estado: estado del envio.
- mensajes: numero de mensajes necesarios para realizar el envio.
- creditos: numero de creditos consumidos por este envio.

En caso de error la respuesta es similar a la del metodo anterior.

Creditos disponibles:

``` javascript
sms.credits()
    .then(
        function (response) {
            console.log('OK', response);
        },
        function (response) {
            console.log(response);
        }
    );
```

Con este metodo podemos obtener el numero de creditos disponibles en nuestra cuenta. 
Se recibe un objeto con un solo parametro, creditos, con el numero de creditos disponible.


Otros metodos:

Existen otros metodos disponibles, con un uso similar a los anteriores, que son:
- deleteSms: elimina un envio, si aun no ha llegado la fecha de envio. Recibe como parametro el id del sms recibido en la peticiion de envio.
- resultRequest: nos devuelve el resultado de una peticion de envio anterior, si se indico la referencia, por si no fue posible procesarla en su momento. Recibe como parametro la referencia.