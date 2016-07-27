var SynJS = SynJS || {};

/**
 Provides the utils helpers methods

 @requires jQuery
 @module SynJS.utils
 **/
SynJS.utils = {
    /**
    Returns context value
    IMPORTANT! this function need a input hidden with id='ctx' with context value

    @method getContext
    @return string that represent context
    **/
    getContext: function () {
        "use strict";
        var input = document.getElementById('ctx');
        if(Boolean(input)){
            return input.value.toString();
        } else {
            return '';
        }
    },
    /**
     Returns environment value (Development, Production, etc.)
     IMPORTANT! this function need a input hidden with id='env'  with context value

     @method getEnv
     @return string that represent env of application
     **/
    getEnv: function () {
        "use strict";

        return document.getElementById('env').value.toString();
    },
    /**
     Returns an URL with the context
     @param {String} url An action/part of url
     @method buildContextedUrl
     @return string that represent env of application
     **/
    buildContextedUrl : function (url) {
        "use strict";

        var contextedUrl = SynJS.utils.getContext() + "/" + url;
        return contextedUrl;
    },
    /**
     Transform string of params in an object
     @param {String} params A string of params
     @method splitStringParamsToObject
     @return object
     **/
    splitStringParamsToObject: function (parameters){
        "use strict";

        var cleanedString, params, mapedParams = {};

        if(parameters !== null && parameters !== undefined && !$.isPlainObject(parameters)){
            cleanedString = (parameters.length && parameters[0] === '&') ? parameters.substring(1) : parameters;

            params = cleanedString.split("&");

            for (var i = 0; i < params.length; ++i) {
                var param = params[i].split('='), oldValues;
                if(mapedParams.hasOwnProperty(param[0])) {
                    oldValues = mapedParams[param[0]];
                    if(oldValues instanceof Array){
                        mapedParams[param[0]].push(decodeURIComponent(param[1]));
                    } else {
                        mapedParams[param[0]] = [];
                        mapedParams[param[0]].push(oldValues);
                        mapedParams[param[0]].push(decodeURIComponent(param[1]));
                    }
                } else {
                    mapedParams[param[0]] = decodeURIComponent(param[1]);
                }
            }
        } else {
            mapedParams = parameters;
        }
        return mapedParams;
    },
    /**
     Default handler for ajax errors

     @param {Object} XMLHttpRequest
     @param {String} textStatus
     @param {String} errorThrown
     @method defaultCallbackAjaxError
     **/
    defaultCallbackAjaxError : function (XMLHttpRequest, textStatus, errorThrown) {
        "use strict";

        if (XMLHttpRequest.status === 404) {
            $.mensagem('Página não encontrada! Favor contactar a administração do sistema.');
        } else if (XMLHttpRequest.status === 500) {
            $.mensagem('Ocorreu um erro inesperado! Favor contactar a administração do sistema.');
        } else if (errorThrown === 'parsererror') {
            $.mensagem('Ocorreu um problema ao exibir os dados da requisição! Favor contactar a administração do sistema.');
        } else if (errorThrown === 'timeout') {
            $.mensagem('O servidor demorou muito para responder! Tente novamente. Se persistir, favor contactar a administração do sistema.');
        }
    },
    dateValidate: function ($seletor) {
        "use strict";

        var regExpCaracter = /[^\d]/,
            regExpEspaco = /^\s+|\s+$/g,
            splitedDate,
            day,
            month,
            year,
            newDate,
            stringDate = $seletor.val();

        if (stringDate.length !== 10) {
            $seletor.val('');
            return false;
        }

        splitedDate = stringDate.split('/');

        if (splitedDate.length !== 3) {
            $seletor.val('');
            return false;
        }

        splitedDate[0] = splitedDate[0].replace(regExpEspaco, '');
        splitedDate[1] = splitedDate[1].replace(regExpEspaco, '');
        splitedDate[2] = splitedDate[2].replace(regExpEspaco, '');

        if ((splitedDate[0].length !== 2) || (splitedDate[1].length !== 2) || (splitedDate[2].length !== 4)) {
            $seletor.val('');
            return false;
        }

        /* Procura por caracter não-numérico. EX.: o "x" em "28/09/2x11" */
        if (regExpCaracter.test(splitedDate[0]) || regExpCaracter.test(splitedDate[1]) || regExpCaracter.test(splitedDate[2])) {
            $seletor.val('');
            return false;
        }

        day = parseInt(splitedDate[0], 10);
        month = parseInt(splitedDate[1], 10) - 1; //O JavaScript representa o mês de 0 a 11 (0->janeiro, 1->fevereiro... 11->dezembro)
        year = parseInt(splitedDate[2], 10);

        newDate = new Date(year, month, day);

        if ((newDate.getDate() !== day) || (newDate.getMonth() !== month) || (newDate.getFullYear() !== year)) {
            $seletor.val('');
            return false;
        } else {
            return true;
        }
    },
    getLargestDate: function (date1, date2) {
        "use strict";
        var dt1 = date1.toString().split("/"),
            dt2 = date2.toString().split("/");

        if ((dt2[2] > dt1[2]) || ((dt2[2] === dt1[2]) && (dt2[1] > dt1[1])) || ((dt2[2] === dt1[2]) && (dt2[1] === dt1[1]) && (dt2[0] > dt1[0]))) {
            return date2;
        }
        return date1;
    },
    generateId:function () {
        "use strict";
        var time = new Date().getTime();
        while (time === new Date().getTime());
        return new Date().getTime();
    },


    /**
     * Método que retorna a msg que o campo é inválido.
     * @param messageElement
     */
    displayMessage:function (messageElement) {
        "use strict";

        $(messageElement).show();
    },

    /**
     * Método que valida o parse do datePicker
     * @param date
     * @param formato
     * @param messageElement
     */
    validateParseDatePicker:function (date, formato, messageElement) {
        "use strict";

        var contemData = /^[0-9]+$/.test(date.replace(/\-|\,|\//g, ""));
        var isDate = false;

        if (contemData) {
            try {
                $.datepicker.parseDate(formato, date);
                isDate = true;
            }
            catch (e) {
                SynJS.utils.displayMessage(messageElement);
            }
        }
    },

    /**
     * Método que verifica se a data é válida através do parse do componente datePicker
     * @param element
     * @param formato
     * @param date
     */
    datePickerValidate:function (messageElement, date, formato) {
        "use strict";

        $(messageElement).hide();
        this.validateParseDatePicker(date, formato, messageElement);
    },

    /**
     * Metodo que verifica qual a data é maior compara o resultado com uma data e retorna msg no elemento.
     */
    compareDateAndReturnMsgError:function (messageElement, date, dateCompare) {
        "use strict";

        $(messageElement).hide();
        if (date !== dateCompare) {
            var result = this.getLargestDate(date, dateCompare);
            if (result === dateCompare) {
                SynJS.utils.displayMessage(messageElement);
            }
        }
    },

    /**
     * Metodo verifica se a data esta em branco
     * @param date
     * @return {Boolean}
     */
    isDateBlank:function (date) {
        "use strict";

        var retorno = false;
        if (date === "") {
            retorno = true;
        }
        return retorno;
    },

    /**
     * Metodo que compara duas datas e retorna mensagem de erro quando a data comparada for maior que a data base
     * @param msgInvalid
     * @param msgInvalidRange
     * @param date
     * @param dateCompare
     */
    validateOnChangeDate: function (msgInvalid, msgInvalidRange, date, dateCompare){
        "use strict";

		if (!SynJS.utils.isDateBlank(dateCompare)) {
			SynJS.utils.compareDateAndReturnMsgError(msgInvalidRange , date, dateCompare);	
		}else{
			msgInvalid.hide();
			msgInvalidRange.hide();
		}
    },

    /**
     * Metodo que verifica se a data é valida
     * @param msgInvalid
     * @param msgInvalidRange
     * @param date
     */
    validateOnFocusDate: function (msgInvalid, msgInvalidRange, date){
        "use strict";
        SynJS.utils.datePickerValidate( msgInvalid, date , 'dd/mm/yy');
        if(SynJS.utils.isDateBlank(date)){
            msgInvalid.hide();
            msgInvalidRange.hide();
        }
    },

    /**
     * Valida se o conteudo do campo esté entre: 0-9 , .
     *
     * @param element
     */
    validaCampoNumerico: function (element) {
        "use strict";

        var val = element.value;
        var str = /^[1-9][\.\d+]*(,\d+)*$/.test(val);

        if(!str){
            element.value = '';
        }
    },

    isNumberKey: function (evt){
        "use strict";

        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
        return true;
    },

    /**
     * Metodo que posiciona a tela do usuário no elemento que foi incluido
     * @param html
     */
    blinkAndFocusOnAdd: function (html){
        "use strict";
        var $element = $("#"+$(html).attr('id'));

        if ($element) {

            var $legend = $element.parent().parent().prev();

            if ($legend.hasClass("fechado")) {
                $legend.trigger("click");
            }

            $element.find(".formContainer").effect( "highlight", {}, 1500 );
        }
    }
};