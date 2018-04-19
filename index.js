module.exports = function(ID, SECRET) {
    var URL = 'https://www.smsup.es';

    var PATH_SMS = '/api/sms/';
    var PATH_CREDITS = '/api/creditos/';
    var PATH_REQUEST = '/api/peticion/';

    var POST = 'POST';
    var DELETE = 'DELETE';
    var GET = 'GET';

    var smsuplib = {};

    smsuplib.GSM = 'gsm';
    smsuplib.UNICODE = 'uni';
    smsuplib.AUTO = 'aut';

    smsuplib.sendSms = function (text, numbers, sender, date, coding, reference) {
        date = (date instanceof Date) ? date.toISOString() : 'NOW';
        reference = reference || '';
        var post = {texto: text, fecha: date, telefonos: numbers, referencia: reference, remitente: sender};
        if (coding != null && [smsuplib.GSM, smsuplib.UNICODE, smsuplib.AUTO].indexOf(coding) > -1) {
            post.codificacion = coding;
        }
        var headers = createHeaders(PATH_SMS, POST, post);
        return sendRequest(PATH_SMS, POST, headers, post);
    };

    smsuplib.deleteSms = function (idSms) {
        var path = PATH_SMS + idSms + '/';
        var headers = createHeaders(path, DELETE);
        return sendRequest(path, DELETE, headers);
    };

    smsuplib.stateSms = function(idSms) {
        var path = PATH_SMS + idSms + '/';
        var headers = createHeaders(path, GET);
        return sendRequest(path, GET, headers);
    };

    smsuplib.credits = function () {
        var headers = createHeaders(PATH_CREDITS, GET);
        return sendRequest(PATH_CREDITS, GET, headers);
    };

    smsuplib.resultRequest = function(reference) {
        var path = PATH_REQUEST + reference + '/';
        var headers = createHeaders(path, GET);
        return sendRequest(path, GET, headers);
    };



    function createHeaders(url, method, postData) {
        var headers = {};
        var smsdate = (new Date()).toISOString();
        headers['Sms-Date'] = smsdate;

        var textPost = (postData) ? JSON.stringify(postData) : '';
        var text = method + url + smsdate + textPost;
        hash = hash_hmac(text, SECRET);
        headers['Firma'] = ID + ':' + hash;
        return headers;
    }

    function hash_hmac(text, key) {
        var crypto = require('crypto');
        var buf1 = crypto.createHmac("sha1", key).update(text).digest();
        return buf1.toString('hex');
    }

    function sendRequest(url, method, header, body) {
        var request = require('request');
        var options = {
            url: URL + url,
            headers: header,
            method: method,
            json: body
        };
        return new Promise(function (resolve, reject) {
            request(options,
                function (error, response, body) {
                    if (response.statusCode !== 200) {
                        body.httpCode = response.statusCode;
                        reject(body);
                        return;
                    }

                    resolve(body);
                }
            );
        });

    }

    return smsuplib;
};
