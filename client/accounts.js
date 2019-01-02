//https://atmospherejs.com/ian/accounts-ui-bootstrap-3
accountsUIBootstrap3.setLanguage('es'); // Espanhol
Accounts.ui.config
({
    passwordSignupFields: "USERNAME_AND_EMAIL",     //requiera un username e email para crear cuenta
    requestPermissions: {},
    extraSignupFields: 
    [
        {                       //////nombre
            fieldName: 'nombre',
            fieldLabel: 'Nombre',
            inputType: 'text',
            visible: true,
            validate: function(value, errorFunction) 
            {
                if (!value) 
                {
                    errorFunction("Por favor escribe tu nombre");
                    return false;
                } 
                return true;
            }
        }, 

        {                       ////apellidos
            fieldName: 'apellidos',
            fieldLabel: 'Apellidos',
            inputType: 'text',
            visible: true,
        }, 

        {                       //////genero
            fieldName: 'gender',
            showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
            fieldLabel: 'Sexo',
            inputType: 'radio',
            radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
            data: 
            [
                {                    // Array of radio options, all properties are required
                    id: 1,                  // id suffix of the radio element
                    label: 'Masculino',          // label for the radio element
                    value: 'm'              // value of the radio element, this will be saved.
                }, 

                {
                    id: 2,
                    label: 'Femenino',
                    value: 'f',
                    checked: 'checked'
                }
            ],
            visible: true
        },         

        {               /////terminos y condiciones
            fieldName: 'terminos',
            fieldLabel: 'Acepto los terminos y condiciones.',
            inputType: 'checkbox',
            visible: true,
            saveToProfile: false,
            validate: function(value, errorFunction) 
            {
                if (value) 
                    return true; 
                
                errorFunction('Debes aceptar los terminos y condiciones.');
                return false;
            }
        }
    ]
});