var SynJS = SynJS || {};

/**
 Provides the default module for ajax

 @requires jQuery
 @module SynJS.ajax
 **/
SynJS.ajax = {
    /**
     Send an ajax request

     @example

         requestOpts = {type: 'POST', url: url, data: data };
         SynJS.ajax.request(requestOpts, callbackSucesso);


     @param opts {Object} map of ajax options, see http://jqapi.com/#p=jQuery.ajax
     @param callbackSuccess {Function} function to be executed in success case
     @param [callbackError] {Function} function to be executed in error case
     @method request
     @return Execute callbacks received
     **/
    request: function (opts, callbackSuccess, callbackError) {
        "use strict";
        SynJS.log.group('SENT URL: %c %s >>>>>> %c | HTTP Method: %c"%s" %c| PARAMS: %O', "color: green; font-size: 12px", opts.url, "color: black;", "color: #BA49FF; font-weight: bold; font-size: 12px", opts.type, "color: black;", SynJS.utils.splitStringParamsToObject(opts.data));
        SynJS.log.time("Request time");

        var options, defaultOpts = {
            success: function (data, textStatus) {
                SynJS.log.group('RETURNED: %c %s <<<<< %c"%s"', "color: #0066CC; font-size: 11px", opts.url, "color: #FF4A2E; text-transform: uppercase; font-size: 11px", textStatus);
                SynJS.log.info('DATA: %o', data);
                callbackSuccess(data, textStatus);
                SynJS.log.groupEnd();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if(callbackError) {
                    callbackError(XMLHttpRequest, textStatus, errorThrown);
                } else {
                    SynJS.log.group('RETURNED: "%s"', textStatus);
                    SynJS.log.warn('Request Error!!!');
                    SynJS.log.error('XMLHttpRequest: %O', XMLHttpRequest);
                    SynJS.log.error('Status: %s', textStatus);
                    SynJS.log.error('errorThrown: %O', errorThrown);
                    SynJS.utils.defaultCallbackAjaxError(XMLHttpRequest, textStatus, errorThrown);
                    SynJS.log.groupEnd();
                }
            }
        };

        options = $.extend(opts, defaultOpts);

        if(Boolean(opts.url)) {
            $.ajax(options);
        } else {
            SynJS.log.warn('Não foi possivel ler a URL, parâmetros recebidos: %O', arguments);
        }
        SynJS.log.timeEnd("Tempo gasto na requisição");
        SynJS.log.groupEnd();
    }
};