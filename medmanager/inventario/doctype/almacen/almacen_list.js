frappe.listview_settings['Almacen'] = {
    onload: function(listview) {
        console.log(listview);
        console.log(empresa);
        console.log(area);
        console.log(cliente);

        // SetWorkingData().then(function(data)
        // {
        //     var opciones = [];

        //     console.log(cliente);

        //     if(!(cliente==null))
        //     {
        //         console.log(cliente);
        //         var opcionCliente = {
        //             "cliente": ["=", cliente]
        //         };

        //         opciones.push(opcionCliente);
        //     }

        //     frappe.route_options = opciones;    
        // });
    }
};

