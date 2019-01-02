Template.el_layout_de_la_aplicacion.helpers
({ 
    col:function() 
    {        
        return Session.get('col');
    },

    message_section:function()
    {
        return Session.get('message_section');
    }
}); 

Meteor.setInterval
(   
    function() 
    { 
         if (UserStatus.isMonitoring()==false)
            UserStatus.startMonitor(60,10,true)
    }, 
    30000
);

/*Meteor.setInterval
(   
    function() 
    { 
        Meteor.subscribe('informacion_chat', Session.get('idchat')),
        Meteor.subscribe('tipo_usuario'),
        Meteor.subscribe('los_mensajes', Session.get('idchat')),
        Meteor.subscribe('chat_finalizado', Session.get('idchat'));
        Meteor.subscribe('chat_finalizado', Cookie.get('idchat'));
        
        if (Chats.findOne({_id:Session.get('idchat')}).finalizado==true)
            {
                
                //Session.set('idchat','1');
                if (Meteor.user().tipo_usuario==false && Router.current().route.getName()!='chatea' )
                    {alert('chat finalizado');Router.go('/chatea');}
                //else Router.go('/chats');
            }
        
        
        Meteor.subscribe('lista_chats_antiguos', Session.get('idchat'));
    }, 
    2000
);*/

function convertir(date)
{
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

Template.area_mensajes.helpers
({ 
    mensajes:function() 
    {
        var x = Mensajes.find( { idchat:Session.get('idchat') },{sort:{fecha:1}} );
        x.count();
        var objDiv = document.getElementById("scroller");
        if (objDiv)
            objDiv.scrollTop=objDiv.scrollHeight;
        
        return x;
    },

    mio:function (usuario) 
    {
        if (usuario==Meteor.user().username)
            return 'ChatLog__entry_mine';
        return '';
    },

    conv:function (fecha) 
    {
        return convertir(fecha);
    },

    proc:function(texto, link)
    {
        if (!link)
            return '<a href="' + texto + '">Link</a>';
        return texto;        
    }
}); 

Template.area_mensajes.events({ 
    'dblclick .js-privado': function() 
    { 
        if (!Meteor.user().tipo_usuario) return;
        Meteor.call
        (
            'hacer_privado',
            this._id,
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                 
            }
        )
    } 
});

Template.campanas.helpers
({ 
    usuarios_campanas:function () 
    {
        return Meteor.users.find( { tipo_usuario:{$ne:false}, ['campanas.'+ Session.get('campana')]:true } );
    },

    campanas:function()
    {
        return Campanas.find();
    },

    checada:function (activa) 
    {
        if (activa) return "checked";
        return "";
    },

    campana_nombre:function()
    {
        var x = Campanas.findOne({_id:Session.get('campana')});
        if (x) return x.nombre;
        return '-';
    }
});

Template.campanas.events({ 
    'click .js-eliminar-usuario-camp': function() 
    { 
        var datos=
        {
            idcampana:Session.get('campana'),
            idasesor:this._id
        }        
        Meteor.call
        (
            'eliminar_usuario_campana',
            datos,
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                
            }
        )    
    },

    'keypress #nueva_campana': function (event) 
    {
        if (event.which === 13) 
        {
            $('.js-agregar-campana').click();
        }
    },

    'click .js-agregar-campana':function()
    {        
        Meteor.call
        (
            'agregar_campana',
            $('#nueva_campana').val(),
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                                

                $('#nueva_campana').val('')
            }
        )
    },

    'keypress #nuevo_usuario': function (event) 
    {
        if (event.which === 13) 
        {
            $('.js-agregar-usuario-camp').click();
        }
    },

     'click .js-agregar-usuario-camp':function()
    {        
        var datos=
        {
            idcampana:Session.get('campana'),
            usuario:$('#nuevo_usuario').val()
        }
        Meteor.call
        (
            'agregar_usuario',
            datos,
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                                

                $('#nuevo_usuario').val('')
            }
        )
    },

    'click .js-seleccionar-campana':function(event)
    {        
        $('.js-seleccionar-campana').removeClass('active');
        $('#'+this._id).addClass('active');
        Session.set('campana', this._id);        
    },

    'click .js-desactivar-campana':function (event)
    {        
        var datos=
        {
            idcampana:event.target.id,
            activa:$(event.target).is(':checked')
        };        
        Meteor.call
        (
            'desactivar_campana',
            datos,
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                                                
            }
        );
    }
});

Template.centro.helpers
({   
    falso:function()
    {
        var x = Meteor.user();
        if (x)
            return !x.tipo_usuario;
        return true;
    },

    idchat:function()
    {
        return Session.get('idchat');
    },

    asesor:function()
    {
        var x = Chats.findOne({});
        if (x)
        return x.nombre_asesor;
    }
}); 

Template.centro.events
({ 
    'click .js-privado':function (event)
    {
        Session.set('privado',$("#privado").is(':checked'));
    },

    'click .js-link':function (event)
    {
        Session.set('link',$("#link").is(':checked'));
    },

    'click .js-finalizar': function(event) 
    { 
        event.preventDefault();         
        Meteor.call
        (
            'finalizar_chat',
            Session.get('idchat'),
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                                
            }
        );
    },//js-enviar-mensaje-input
    'keypress .js-enviar-mensaje-input': function (event) 
    {
        if (event.which === 13 || event=='caca') 
        {
            //$('.js-enviar-mensaje').click();
            if (!$('#texto').val()) return;
            var datos =
            {
                idchat:Session.get('idchat'),
                texto:$('#texto').val(),
                privado:Session.get('privado'),
                link:Session.get('link'),
                usuario:Meteor.user().username
            };

            Meteor.call
            (
                'insertar_mensaje',
                datos,
                function(error, respuesta) 
                {
                    if (error) { console.log(error); return ;}                

                    $('#texto').focus();
                    $('#texto').val('');                               
                }
            );
        }
    },

    'click .js-enviar-mensaje':function()
    {
        $('.js-enviar-mensaje').keypress('caca');
    },

    'click .js-transferir':function()
    {
        var usuario = prompt("A quien lo transferirás","Usuario");
        if (!usuario) return;
        var datos=
        {
            usuario:usuario,
            idchat:Session.get('idchat')
        };
        Meteor.call
        (
            'transferir',
            datos,
            function(error, respuesta) 
            {
                if (error) { console.log(error); return ;}                              
            }
        )
    }
}); 

Template.derecha.helpers
({ 
    el_chat:function () 
    {
        return Chats.findOne({_id:Session.get('idchat'),idasesor:Meteor.userId()});
    },

    cam:function(idcampana)
    {        
        return Campanas.findOne({_id:idcampana}).nombre;
    }
}); 

Template.derecha.events({ 
    'click #foo': function(event, template) { 
         
    } 
}); 

Template.lista_campanas.helpers
({ 
    campana:function()
    {
        return Campanas.find( { activa:{$ne:false} } );
    }
}); 

Template.lista_campanas.events
({ 
    'change .js-campanas':function(event)
    {
        Session.set('campana', event.target.value);
    }
}); 

Template.lista_conversaciones.helpers
({ 
    chats:function()
    {
        return Chats.find({idasesor:Meteor.userId(), finalizado:false}, {fields:{idcliente:1,idasesor:1,finalizado:1, 'datos.nombre':1,'ultimo_mensaje':1, 'hora_mensaje':1}, sort:{hora_mensaje:-1}});
    },

    status:function(idcliente)
    {
        var x = Meteor.users.findOne({_id:idcliente});
        //return "desconectado";
        if (x.status.idle)
            return "inactivo";
        if (x.status.online)
            return "online";
        
        return "desconectado";
    },

    fecha:function(hora)
    {
        return convertir(hora);
    }
}); 

Template.lista_conversaciones.events({ 
    'click .js-chat': function() 
    { 
        $('.js-chat').removeClass('azul');
        $('#'+this._id).addClass('azul');
        Router.go('/chats/'+this._id);
    } 
}); 

Template.lista_conversaciones_pasadas.helpers
({    
    chats:function()
    {
        var x = Chats.findOne({_id:Session.get('idchat')}).datos.email;
        return Chats.find({'datos.email':x, finalizado:true},{});// {fields:{idcliente:1,idasesor:1,finalizado:1, 'datos.nombre':1,'ultimo_mensaje':1, 'hora_mensaje':1}});
    },

    fecha:function(hora)
    {
        return convertir(hora);
    }
});

Template.lista_conversaciones_pasadas.events({ 
    'click .js-chat': function() 
    { 
        $('.js-chat').removeClass('azul');
        $('#'+this._id).addClass('azul');
        Router.go('/chats/'+this._id);
    } 
});

Template.login.helpers
({ 
    admin:function () 
    {
        return ( Meteor.user() ? Meteor.user().tipo_usuario =='admin':false)     
    }
}); 

Template.login.events
({ 
    
}); 


Template.pedir_datos.helpers ({
    soy_alumno:function () {
        return Session.get('alumno');
    }
}); 

Template.pedir_datos.events ({ 
    'submit .js-duda':function(event) {
        event.preventDefault();        
        var datos = {
            nombre : event.target.nombre,
            matricula : event.target.matricula,
            email : event.target.email,
        };
        
        Meteor.call ('crear_nombre_correo',
            datos,     
            (error, id) => {                                                                                              
                if (error) { console.log(error); return ;}
                
                datos.ubicacion = Session.get('ubicacion');
                datos.tel = fevent.target.tel;
                datos.idcampana = event.target.campana;
                
                //crear usuario para el status-online
                datos.idusuario = Accounts.createUser ({
                    email: `${id}@falso.co`,
                    password: id,                    
                });
                //UserStatus.startMonitor(60,10,true);
                Meteor.call
                (
                    'crear_chat', 
                    datos,
                    function (error, idchat) 
                    {
                        if (error) { console.log(error); return ;}

                        //Session.set('chat', chat);
                        Cookie.set('idchat', idchat, {days:1});
                        Router.go('/chatea/' + idchat);
                    }
                ) 
                
            }
        );                                    
        
    },
    
    'click .js-checar':function (event)
    {
        Session.set('alumno',$("#alumno").is(':checked'));
    }
}); 

Template.sidebar.helpers
({ 
    
}); 

Template.sidebar.events({ 
    'click .js-lista-publico': function( ) 
    { 
        //         UserStatus.startMonitor(60,10,true);    
    } 
});




 

 


 

 





