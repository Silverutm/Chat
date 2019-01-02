const NonEmptyString = Match.Where((x) => {
  check(x, String);
  return x.length > 0;
});


Meteor.methods
({     
    'agregar_campana':function(nombre)
    {
        check(nombre, NonEmptyString);
        if (!this.userId) throw new Meteor.Error('Auth', 'No puedes agregar campana');
        if ( Meteor.users.findOne({_id:this.userId}).tipo_usuario != 'admin' )
            throw new Meteor.Error('Auth', 'No puedes eres admin');
        
        var idcampana = Campanas.insert({'nombre':nombre, activa:true});
        return idcampana;
    },

    'agregar_usuario':function (datos) 
    {
        if (this.isSimulation) return;
        check(datos.usuario, NonEmptyString);
        check(datos.idcampana, NonEmptyString);
        var x = Meteor.users.findOne({username:datos.usuario});
        if (!x) throw new Meteor.Error('Auth', 'No existe asesor');
        var idasesor = x._id;
        if (!x.campanas) Meteor.users.update({_id:idasesor},{$set:{campanas:{}}} );
        Meteor.users.update({_id:idasesor},{$set:{['campanas.'+datos.idcampana]:true}} );
        
        if (x.chats_activos==undefined)
            Meteor.users.update({_id:idasesor},{$set:{'chats_activos':0}} );
        return true;
    },

    'crear_chat':function (datos) 
    {        
        check(datos.nombre, NonEmptyString);        
        if (!datos.email)
            check(datos.matricula, NonEmptyString);
        if (!datos.matricula)
            check(datos.email, NonEmptyString);
        
        if (this.isSimulation) return ;
        Meteor.users.update({_id:this.userId},{$set:{tipo_usuario:false}});
        //lista de asesores disponibles
        var disponibles = Meteor.users.find({'status.online': true, 'tipo_usuario':{$ne:false}}, {fields:{'status.online':1}});
        /*var arr_id_disponibles = new Array();
        var i = 0;
        disponibles.forEach(function (usuario)
        {
            arr_id_disponibles[i] = usuario._id;
            ++i;
        });*/

        //if (i==0)
        if ( disponibles.count() == 0 )
        {
            var chat = 
            {
                ip:this.connection.clientAddress,
                finalizado:true,
                finalizo_asesor:false,
                datos:datos, //nombre, matricula, email, tel, campana, idusuario, ubicacion
                nombre_asesor:'',
                usuario_asesor:'sin asesor',
                idcliente:this.userId
            };

            var idchat = Chats.insert(chat);

            //crear mensaje de bienvenida            
            var mensaje = 
            {
                idchat:idchat,
                texto:'Hola, lamentablemente no tenemos asesores disponibles, intentalo mas tarde o contactanos por Whatsapp con el siguiente link',
                fecha:new Date(),
                privado:false,
                usuario:'sin asesor'
            }
            Mensajes.insert(mensaje);
            var mensaje = 
            {
                idchat:idchat,
                texto:'https://api.whatsapp.com/send?phone=525579047855&text=Hola%2C+pueden+ayudarme+con+una+duda%3F',
                fecha:new Date(),
                privado:false,
                link:true,
                usuario:'sin asesor'
            }
            Mensajes.insert(mensaje);
            //chat.idchat = idchat
            return idchat;
        }
        
        //asesor disponible mas desocupado que atiende esa campana
        var asesor = Meteor.users.findOne
        (
            {
                'status.online': true, 
                'tipo_usuario':{$ne:false}, 
                ['campanas.' + datos.idcampana]:true
            }, 
            {
                fields:{'status.online':1, 'chats_activos':1, 'campanas':1, 'tipo_usuario':1,'profile.nombre':1,'username':1},
                sort:{'chats_activos':1}
            }
        );
        //var asesor = disponibles.findOne( { ['campanas.' + datos.idcampana]:true }, { sort:{'chats_activos':1} });
        if (!asesor) //no se encontro a nadie en los parametros asignar al azar mas desocupado disponible
            asesor = Meteor.users.findOne
            (
                {
                    'status.online': true, 
                    'tipo_usuario':{$ne:false}                    
                }, 
                {
                    fields:{'status.online':1, 'chats_activos':1, 'tipo_usuario':1, 'profile.nombre':1,'username':1},
                    sort:{'chats_activos':1}
                }
            );
        
        //asignarlo al usuario
        Meteor.users.update({_id: asesor._id}, {$inc:{'chats_activos':1}});
        //var datos_asesor = Meteor.users.findOne({_id:asesor.idasesor})        

        var chat = 
        {
            ip:this.connection.clientAddress,
            finalizado:false,
            finalizo_asesor:false,
            datos:datos, //nombre, matricula, email, tel, campana, idusuario, ubicacion
            nombre_asesor:asesor.profile.nombre,
            usuario_asesor:asesor.username,
            idcliente:this.userId,
            idasesor:asesor._id,
            ultimo_mensaje:'Bienvenido. ¿En qué te puedo ayudar?',
            hora_mensaje:new Date()
        };

        var idchat = Chats.insert(chat);

        //crear mensaje de bienvenida
        var mensaje = 
        {
            idchat:idchat,
            texto:'Bienvenido. ¿En qué te puedo ayudar?',
            fecha:new Date(),
            privado:false,
            usuario:asesor.username
        }
        Mensajes.insert(mensaje);

        //chat.idchat = idchat
        return idchat;
    },
    
    'crear_nombre_correo':function(datos) //
    {        
        check(datos.nombre, NonEmptyString);
        if (!datos.email)
            check(datos.matricula, NonEmptyString);
        if (!datos.matricula)
            check(datos.email, NonEmptyString);

        if (this.isSimulation) return ;

        var id = Ids.insert({a:true});  //sirven para crear un email falso para ver status
        return id;
    },

    'desactivar_campana':function(datos)
    {
        if (this.isSimulation) return;
        check(datos.idcampana, NonEmptyString);
        if (!this.userId) throw new Meteor.Error('Auth', 'No puedes desactivar campana');
        if ( Meteor.users.findOne({_id:this.userId}).tipo_usuario != 'admin' )
            throw new Meteor.Error('Auth', 'No puedes eres admin');

        return Campanas.update({_id:datos.idcampana},{$set:{activa:datos.activa}});
    },

    'eliminar_usuario_campana':function (datos) 
    {
        if (this.isSimulation) return;
        check(datos.idasesor, NonEmptyString);
        check(datos.idcampana, NonEmptyString);
        var x = Meteor.users.findOne({_id:datos.idasesor});
        if (!x) throw new Meteor.Error('Auth', 'No existe asesor');
        
        if (!x.campanas) throw new Meteor.Error('Err', 'No tiene campanas');
        Meteor.users.update({_id:datos.idasesor},{$set:{['campanas.'+datos.idcampana]:false}} );                        
                
        return true;
    },

    'finalizar_chat':function (idchat) 
    {
        check(idchat, NonEmptyString);
        var chat = Chats.findOne({_id:idchat,$or:[{idasesor:this.userId}, {idcliente:this.userId}]});
        if (!chat) return;
        Chats.update({_id:idchat}, {$set:{finalizado:true}});
    },

    'hacer_privado':function (idmensaje) 
    {
        if (!this.userId) throw new Meteor.Error('Auth', 'No registrado');
        if (!Meteor.users.findOne({_id:this.userId}).tipo_usuario ) 
            throw new Meteor.Error('Auth', 'No autorizado para hacer privado');
        var p = Mensajes.findOne({_id:idmensaje}).privado;
        p = !p;
        Mensajes.update({_id:idmensaje},{$set:{privado:p}});
    },

    'insertar_mensaje':function(datos)
    {
        if (!this.userId) throw new Meteor.Error('Auth', 'No registrado');
        check(datos.texto, NonEmptyString);
        
        if (!Meteor.users.findOne({_id:this.userId}).tipo_usuario )
        {
            datos.link=false;
            datos.privado=false;
            datos.usuario=undefined;
        }

        if (datos.texto.length > 300) return;

        var chat = Chats.findOne({_id:datos.idchat,$or:[{idasesor:this.userId}, {idcliente:this.userId}]});
		if (!chat) return;
        if (chat.finalizado) return ;
        var t = datos.texto.substring(0,20);
        Chats.update({_id:datos.idchat},{$set:{ultimo_mensaje:t, hora_mensaje:new Date()}});
        var mensaje = 
        {
            idchat:datos.idchat,
            texto:datos.texto,
            fecha:new Date(),
            privado:datos.privado,
            link:datos.link,
            usuario:datos.usuario
        };
        Mensajes.insert(mensaje);
        return ;
    },

    

    'transferir':function (datos) 
    {
        if (!this.userId) throw new Meteor.Error('Auth', 'No registrado');
        if (!Meteor.users.find({_id:this.userId}).tipo_usuario) throw new Meteor.Error('Auth', 'Sin permisos para transferir');
        check(datos.usuario, NonEmptyString);
        check(datos.idchat, NonEmptyString);

        var x = Meteor.users.findOne({username:datos.usuario});
        if (!x) throw new Meteor.Error('Auth', 'No existe quien lo recibe');
        var z = Chats.update({_id:datos.idchat},{$set:{usuario_asesor:x.username, idasesor:x._id}});
        return true;
    }
});

