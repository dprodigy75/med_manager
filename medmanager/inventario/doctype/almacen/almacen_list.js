//Local a cada listview
var currentListView = null;
var currentDocTypeName = 'Almacen';
var currentNivel = 'UNIDAD_MEDICA';

frappe.listview_settings[currentDocTypeName] = {
    onload: function(listview) {
        
        frappe.provide('frappe.model');

        estableceContextoListView(listview, currentDocTypeName, currentNivel);

        currentListView = listview;
 
        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeName));        
    },
    refresh: function() {

		console.log(this);
	},
};


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

                        return CargaDialogo(lstEmpresas, lstClientes, lstUnidades, estableceContexto);
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
