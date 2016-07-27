
var gui = gui || {};
gui.modules = gui.modules || {};

gui.modules.carrierpigeon = function(options) {

	var DEFAULTS = {
		buttonLabel: 'Ver mensagens',
        title: "Erros",
		message: '',
		type: 'info'
	};

	var buttonLabel = options.buttonLabel || DEFAULTS.buttonLabel;
    var title = options.title || DEFAULTS.title;
	var message = options.message || DEFAULTS.message;
	var typeClass = options.type || DEFAULTS.type;
    var self = this;

    this.messages = [];
    if(options.messages){
        this.messages = options.messages;
    }

	this.button = $('<button>', { id: 'pigeon-button', class: 'pigeon-button', text: buttonLabel });
    this.buttonErrorsCount = $('<span>', { id: 'pigeon-button-errors-count', class: 'pigeon-button-errors-count badge-important', title: "Alertas não lidos." });
    this.button.append(this.buttonErrorsCount);
    this.updateErrorCount();

	this.pigeonWindow = $('<div>', { id: 'pigeon-window', class: 'pigeon-window pigeon-window-shadow'});
	this.pigeonWindowHeader = $('<div>', { class: 'pigeon-header' });
    this.pigeonWindowHeaderTitle = $('<span>', {class: 'pigeon-title', text: title});
	this.pigeonWindowHeaderCloseButton = $('<a>', { href: 'javascript:void(0);', class: 'pigeon-close'});
	this.pigeonWindowMessage = $('<p>', { class: 'pigeon-message', text: message });
	this.pigeonWindowConteiner = $('<div>', { id: 'pigeon-container', class: 'pigeon-container' });

	this.pigeonWindow.addClass(typeClass);

    if (Boolean(options.buttonClasses) && $.isArray(options.buttonClasses)){
        $.each(options.buttonClasses, function(index, cssClass){
            self.button.addClass(cssClass);
        });
    }

    var $iconeErro = $('<i>', { class: 'icon-gui-cancel pull-left' });
    var $iconClose = $('<i>', { class: 'icon-gui-excluir' });
    this.pigeonWindowHeaderCloseButton
        .append($iconClose);

	this.pigeonWindowHeader
        .append($iconeErro)
        .append(this.pigeonWindowHeaderTitle)
		.append(this.pigeonWindowHeaderCloseButton);
	
	this.pigeonWindow
		.append(this.pigeonWindowHeader)
		.append(this.pigeonWindowMessage)
		.append(this.pigeonWindowConteiner);

	this.container = $(options.container);

	this.addEventListeners();
	this.init();
//	this.renderMessages();
};

gui.modules.carrierpigeon.prototype.init = function() {
	this.container.append(this.button);
	this.container.append(this.pigeonWindow);
    this.updateModel();
};

gui.modules.carrierpigeon.prototype.buttonClick = function(){
    if (this.pigeonWindow.hasClass('active')){
        this.pigeonWindow.removeClass('active');
    } else {
        this.pigeonWindow.addClass('active');
    }
};

gui.modules.carrierpigeon.prototype.openWindow = function() {
	this.pigeonWindow.addClass('active');
};

gui.modules.carrierpigeon.prototype.closeWindow = function() {
	this.pigeonWindow.removeClass('active');
};

gui.modules.carrierpigeon.prototype.addEventListeners = function() {
	this.button.on('click', this.buttonClick.bind(this));
	this.pigeonWindowHeaderCloseButton.on('click', this.closeWindow.bind(this));
};

gui.modules.carrierpigeon.prototype.createHtmlMessages = function(messages) {

	var messagesToParse = messages || this.messages;

	if(!$.isArray(messagesToParse)) {
		throw Error('messages deve ser uma lista');
	}

	var $list = $('<ul>', { class: 'pigeon-list' });
	for (var i = 0; i < messagesToParse.length; i++) {
        this.addMessageToList(messagesToParse[i], $list, i);
	}

	return $list;
};

gui.modules.carrierpigeon.prototype.addMessageToList = function(message, list, index){
    var $li = $('<li>', { class: 'pigeon-item' }),
        $divGrupo = $('<div>', { class: 'row-fluid' }),
        $divLink = $('<div>', { id: 'divLink_' + index, class: 'span11' }),
        $divIconeLixeira = $('<div>', { id: 'divIconeLixeira_' + index, class: 'span1 pull-right' }),
        $a = $('<a>', { class: 'pigeon-link', html: message.description, href: 'javascript: void(0);' }),
        $linkLixeira = $('<a>', { class: 'pigeon-delete', title: 'Excluir erro', href: 'javascript:obg.controller.obrigacao.removeErrorMessage(' + index + ');' }),
        $lixeira = $('<i>', { class: 'icon-btn-delete icon-gui-delete icon-large pull-right'});

    if($.isFunction(message.hrefLink)){
        $a.on('click', this.closeWindow.bind(this));
        $a.on('click', message.hrefLink);
    } else {
        $a.attr('href', message.hrefLink);
    }

    $linkLixeira.append($lixeira);

    $divLink.append($a);
    $divIconeLixeira.append($linkLixeira);

    $divGrupo
        .append($divLink)
        .append($divIconeLixeira);

    $li.append($divGrupo);
    list.append($li);
};


gui.modules.carrierpigeon.prototype.renderMessages = function(messages) {
    try{
        // TODO: isolar lógica no componente, criando métodos removeAll, removeError, removeSuccess
        var notices_data = $(window).data("pnotify");
        if (notices_data && notices_data.length) {
            $.each(notices_data, function(){
                if (this.pnotify_remove
                    // não remover mensagens de alerta
                    && !this.hasClass("gui-message-notice"))
                    this.pnotify_remove();
            });
        }
    }
    catch (e){}
    this.pigeonWindowConteiner.empty();
	var list = this.createHtmlMessages(messages);
	this.pigeonWindowConteiner.append(list);
};

gui.modules.carrierpigeon.prototype.updateModel = function() {
    this.renderMessages(this.messages);
    this.updateErrorCount();

    if(this.messages.length > 0){
        this.button.show();
        this.openWindow();
    } else {
        this.button.hide();
        this.closeWindow();
    }
};

gui.modules.carrierpigeon.prototype.clearMessages = function() {
    this.messages = [];
    this.updateModel();
};

gui.modules.carrierpigeon.prototype.updateErrorCount = function() {
    this.buttonErrorsCount.html(this.messages.length);
};

gui.modules.carrierpigeon.prototype.addError = function(description, hrefLink) {
    if(!this.messages){
        this.clearMessages();
    }

    this.messages.push(
        {
            description: description,
            hrefLink: hrefLink
        }
    );
};

gui.modules.carrierpigeon.prototype.removeError = function(nthError) {
    this.messages.splice(nthError, 1);
    this.updateModel();
};