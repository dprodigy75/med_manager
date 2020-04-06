frappe.listview_settings['Almacen'] = {
    onload: function(listview) {
        console.log(listview);

        newFunction(listview);
 
        listview.page.add_inner_button('Cambiar', () =>  SetWorkingData());        
    },
    refresh: function() {

		console.log(this);

	},
};


function newFunction(listview) {
    var contexto = getContexto();

   
    if (contexto == null) {
        SetWorkingData().then(function (data) {

            var opciones = [];
            ;

            var clienteStr = getUnformatedOptions(contexto.Cliente);

            var opcionCliente = {
                "cliente": ["=", clienteStr]
            };
            opciones.push(opcionCliente);
            frappe.route_options = opciones;
            listview.refresh();
        });
    }
    else {
        var opciones = [];

        listview.page.add_inner_message(contexto.GetString());
        
        var clienteStr = getUnformatedOptions(contexto.Cliente);

        var opcionCliente = {
            "cliente": clienteStr
        };

        opciones.push(opcionCliente);
        console.log(opciones);
        // frappe.route_options = opciones; 
        frappe.route_options = {
            "cliente": clienteStr
        };
        console.log(frappe.route_options);
        listview.refresh();
    }
}

function SetWorkingData()
{
	CargaRelacionUsuario().then(function(resp){
		var relacionUsuario = resp.message;
		
		if(relacionUsuario == null)
			return;
		
		console.log(relacionUsuario);

		var contexto = getContexto();

		if(contexto==null)
		{
			CargaEmpresas().then(function(resp){

				empresas = resp.message;

				if(!(empresas==null))
				{			
					var primerEmpresa = empresas[0];

					CargaClientes(primerEmpresa.name).then(function(resp){			

						clientes = resp.message;
						
						if(!(clientes==null))
						{
							var lstEmpresas = getFormatedOptions(empresas, 'nombre');
							var lstClientes = getFormatedOptions(clientes, 'razon_social');

							CargaDialogo(lstEmpresas, lstClientes);					
						}
					});
				}
			});
		}
	});
}
