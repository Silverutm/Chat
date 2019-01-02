/*Router.configure    //el principal, todo se carga aqui
({
    layoutTemplate:'el_layout_de_la_aplicacion'
});*/

//login
Router.route('/loginUTEL', 
{  
    layoutTemplate:'main',
    yieldRegions: 
    {
        'vacia': {to:'sidebar'},
        'login': {to:'extra'},
        'vacia': {to:'center'},
        'vacia': {to:'rightbar'}
    },    

    waitOn: function () 
    {
        //return Meteor.subscribe('tipo_usuario');
    },

    data: function () 
    {

    },

    onRun: function () {this.next();},
    onRerun: function () {this.next();},
    onBeforeAction: function () 
    { 
        /*if (Meteor.user())
        {
            if (Meteor.user().tipo_usuario == false)       //si no es asesor
//                this.redirect('/chatea');
            this.next();
            else 
                this.next();
        }
        else*/
            this.next();
    },
    onAfterAction: function () {},
    onStop: function () {},

    action: function () { this.render();}
});


//Router.route('/',function(){this.redirect('/loginUTEL_Z');});

//la ruta del chat
Router.route('/chats', 
{  
    layoutTemplate:'main',
    yieldRegions: 
    {
        'sidebar': {to:'sidebar'},
        'vacia': {to:'extra'},
        'centro': {to:'center'},
        'derecha': {to:'rightbar'}
    },    

    waitOn: function () 
    {
        //return Meteor.subscribe('tipo_usuario');
    },

    data: function () 
    {
        
    },

    onRun: function () {this.next();},
    onRerun: function () {this.next();},
    onBeforeAction: function () 
    {
        Session.set('col', 'md-6');
        Session.set('message_section','message_section');
        /*if (!Meteor.user())     //si no esta conectado
            this.redirect('/chatea');
        else if (Meteor.user().tipo_usuario == false)       //si el usuario es falso
            this.redirect('/chatea');
        else*/
            this.next();
    },
    onAfterAction: function () {},
    onStop: function () {},

    action: function () 
    {    
        this.render();
    }
});

Router.route('/chatea', 
{  
    layoutTemplate:'no_chat',
    yieldRegions: {        
        'pedir_datos': {to:'extra'}
    },    
    waitOn: function () {
        //return [Meteor.subscribe('tipo_usuario'), Meteor.subscribe('chat_finalizado', Cookie.get('idchat'))];
    },
    onRun: function () {this.next();}, onRerun: function () {this.next();},
    onBeforeAction: function () {                
        //revisar si hay un chat activo
        //var x = Cookie.get('idchat');
        //if ( x )
        //    this.redirect('/chatea/' + x);
        /*var x = Chats.findOne({});
        if (x) if (!x.finalizado) this.redirect('/chatea/' + Cookie.get('idchat'));

        if (!Meteor.user())     //si no es un usuario, esta bien
            this.next();
        else if (Meteor.user().tipo_usuario != false)       //es un asesor
            //this.redirect('/loginUTEL_Z');
        this.next();
        else*/
        this.next();
    },
    onAfterAction: function () {}, onStop: function () {},
    action: function () { this.render();}
});


Router.route('/campanas', 
{  
    layoutTemplate:'main',
    yieldRegions: 
    {
        'vacia': {to:'sidebar'},
        'campanas': {to:'extra'},
        'vacia': {to:'center'},
        'vacia': {to:'rightbar'}
    },    

    waitOn: function () 
    {
        //return Meteor.subscribe('tipo_usuario');
    },

    onRun: function () {this.next();},
    onRerun: function () {this.next();},
    onBeforeAction: function () 
    {
        Session.set('message_section','');
        /*if (!Meteor.user())     //si no esta conectado
            this.redirect('/chatea');
        else if (Meteor.user().tipo_usuario == false)       //si no es asesor
            this.redirect('/chatea');
        else if (Meteor.user().tipo_usuario != 'admin')       //si no es admin
            this.redirect('/loginUTEL_Z');
        else*/
            this.next();
    },
    onAfterAction: function () {},
    onStop: function () {},

    action: function () 
    {    
        this.render();
    }
});

Router.route('/chatea/:idchat', 
{  
    //path:'/chatea/:idchat',
    layoutTemplate:'main',
    yieldRegions: 
    {
        'vacia': {to:'sidebar'},
        'vacia': {to:'extra'},
        'centro': {to:'center'},
        'vacia': {to:'rightbar'}
    },    

    waitOn: function () 
    {
        //return Meteor.subscribe('los_mensajes', this.params.idchat);
        /*return 
        [
            Meteor.subscribe('tipo_usuario'),
            Meteor.subscribe('los_mensajes', this.params.idchat),
            Meteor.subscribe('chat_finalizado', this.params.idchat)
        ];*/
    },

    onRun: function () {this.next();},
    onRerun: function () {this.next();},
    onBeforeAction: function (pause) 
    {
        Session.set('col', 'xs-12');
        Session.set('message_section','message_section');        
        Session.set('idchat', this.params.idchat);

        /*if (!Meteor.user())     //si no es un usuario, algo esta mal
            this.next();
            //this.redirect('/chatea');
        else if (Meteor.user().tipo_usuario != false)       //es un asesor
            //this.redirect('/loginUTEL_Z');
        this.next();
        else*/
            //this.next();
        //if (!this.ready()) pause();
        //else this.next();
        this.next();
    },
    onAfterAction: function () {},
    onStop: function () {},

    action: function () 
    {    
        /*if (this.ready()) {*/
      this.render();
    /*} else {
      this.render('vacia');}*/
    }
});

Router.route('/chats/:idchat',
{  
    layoutTemplate:'main',
    yieldRegions:
    {
        'sidebar': {to:'sidebar'},
        'vacia': {to:'extra'},
        'centro': {to:'center'},
        'derecha': {to:'rightbar'}
    },    

    waitOn: function () 
    {
        /*return 
        [
            Meteor.subscribe('tipo_usuario'),
            Meteor.subscribe('los_mensajes', this.params.idchat),
            Meteor.subscribe('chat_finalizado', this.params.idchat),
            Meteor.subscribe('informacion_chat', this.params.idchat),
            Meteor.subscribe('lista_chats_antiguos', this.params.idchat)
        ];*/
    },

    onRun: function () {this.next();},
    onRerun: function () {this.next();},
    onBeforeAction: function () 
    {
        Session.set('col', 'md-6');
        Session.set('message_section','message_section');
        Session.set('idchat', this.params.idchat);

        /*if (!Meteor.user())     //si no esta conectado
            this.redirect('/chatea');
        else if (Meteor.user().tipo_usuario == false)       //si el usuario es falso
            this.redirect('/chatea');
        else*/
            this.next();
    },
    onAfterAction: function () {},
    onStop: function () {},

    action: function () 
    {    
        this.render();
    }
});