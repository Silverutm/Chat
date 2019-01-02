/*Template.campanas.onCreated
(
    function()
    {        
        //los asesores que pueden atender esas campanas
        var instance = this;
        var subscription = instance.subscribe("usuarios_campanas");
        var subscriptionw = instance.subscribe("nombres_campanas",'editar');
    }
);

Template.centro.onCreated
(
    function () 
    {
        //UserStatus.startMonitor(60,10,true);    
    }
);

Template.derecha.onCreated
(
    function()
    {
        var instance = this;
        var subscription = instance.subscribe("nombres_campanas",'ver');
    }
);

Template.lista_campanas.onCreated
(
    function()
    {
        //nombres de las campanas
        var instance = this;
        var subscription = instance.subscribe("nombres_campanas",'ver');
    }
);

Template.lista_conversaciones.onCreated
(
    function()
    {
        var instance = this;
        var subscription = instance.subscribe("lista_chats");
    }
);

Template.pedir_datos.onCreated
(
    function()
    {                
        //los datos de la persona
        $.get
        (
            "https://ipinfo.io", 
            function(respuesta) 
            {                
                //var ubicacion = 
                //{
                //    ciudad:respuesta.city,
                //    pais:respuesta.country,
                //    ip:respuesta.ip
                //}
                //Session.set('ubicacion', ubicacion);
                console.log(respuesta);
            }, 
            "jsonp"
        );
    }
);

Template.sidebar.onCreated
(
    function()
    {
        //saber el estatus de las personas con las que chateo
        var instance = this;
        var subscription = instance.subscribe("estatus_interno");
        var subscription2 = instance.subscribe("estatus_cliente");        
    }
);

*/

