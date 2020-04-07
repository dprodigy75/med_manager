
frappe.listview_settings['Almacen'] = {
    onload: function(listview) {
        
        frappe.provide('frappe.model');
        console.log(listview);

        newFunction(listview);

        currentListView = listview;
 
        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuario()   );        
    },
    refresh: function() {

		console.log(this);

	},
};

function cambiaRelacionUsuario()
{
    clearContexto();

    newFunction(currentListView);

}



function newFunction(listview) {
    if(listview == null)
    {
        listview = currentListView;
    }

    var contexto = getContexto();
   
    if (contexto == null) {
        loadWorkingData();
    }
    else {
        listview.page.add_inner_message(contexto.GetString());
        
        var opcionesCliente = {
            "cliente": getUnformatedOptions(contexto.Cliente),
            "area": contexto.Area
        };

        if(!(contexto.UnidadMedica==null))
        {
            opcionesCliente.unidad_medica = getUnformatedOptions(contexto.UnidadMedica);
        }

        console.log(opcionesCliente);

        frappe.route_options = opcionesCliente; 
        // frappe.route_options = {
        //     "cliente": clienteStr
        // };

        frappe.set_route("List", "Almacen");

        console.log(frappe.route_options);
        listview.refresh();
    }
}

var currentListView = null;

async function loadWorkingData()
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
                    var primerCliente = clientes[0];

                    CargaUnidades(primerCliente.name).then(function(resp){
                        unidades = resp.message;

                        var lstEmpresas = getFormatedOptions(empresas, 'abreviacion');
                        var lstClientes = getFormatedOptions(clientes, 'abreviacion');
                        var lstUnidades = getFormatedOptions(unidades, 'nombre');

                        return CargaDialogo(lstEmpresas, lstClientes, lstUnidades, newFunction);
                    });
                }
            });
        }
	});
		
}

async function SetWorkingData()
{
	return await CargaRelacionUsuario().then(function(resp){
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
