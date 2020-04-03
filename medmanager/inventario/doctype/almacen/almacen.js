// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Almacen', {
	refresh: function(frm) {

	},
	onload: function(frm) {

		console.log(empresa);
		console.log(area);
		console.log(cliente);
		
		SetWorkingData();
	},
});


function SetWorkingData()
{
	CargaRelacionUsuario().then(function(resp){
		var relacionUsuario = resp.message;
		
		if(relacionUsuario == null)
			return;
		
		console.log(relacionUsuario);

		if(empresa==null || cliente==null || area == null)
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
