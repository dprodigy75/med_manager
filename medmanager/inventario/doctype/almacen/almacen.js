// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Almacen', {
	onload: function(frm) {

		frm.set_intro('Please set the value of description');
		
		// Custom buttons
		frm.add_custom_button('Get User Email Address', function(){
			frappe.msgprint(frm.doc.nombre);
			}, "Utilities");

		SetWorkingData();

		EstableceFiltroCliente(frm, cur_frm);
		EstableceFiltroUnidad(frm, cur_frm);
		EstableceFiltroAlmacenPadre(frm, cur_frm);
	},
	refresh: function(frm) {

		frm.set_intro('Please set the value of description');

	  frm.add_custom_button('Get User Email Address', function(){
		frappe.msgprint(frm.doc.nombre);
		}, "Utilities");

	},
	cliente: function(frm) {
		EstableceFiltroUnidad(frm, cur_frm);
		EstableceFiltroAlmacenPadre(frm, cur_frm);

		frm.set_value('unidad_medica', null);
		frm.refresh_field('unidad_medica');
		frm.set_value('almacen_padre', null);
		frm.refresh_field('almacen_padre');
	}
});

function EstableceFiltroCliente(frm, cur_frm) {
	cur_frm.set_query('cliente', function () {
		return {
			filters: [
				["Cliente", "activo", "=", 1]
			]
		};
	});
}
function EstableceFiltroUnidad(frm, cur_frm) {
	cur_frm.set_query('unidad_medica', function () {
		return {
			filters: [
				["Unidad Medica", "activo", "=", 1],
				["Unidad Medica", "cliente", "=", frm.doc.cliente]
			]
		};
	});
}
function EstableceFiltroAlmacenPadre(frm, cur_frm) {
	cur_frm.set_query('almacen_padre', function () {
		return {
			filters: [
				["Almacen", "activo", "=", 1],
				["Almacen", "cliente", "=", frm.doc.cliente],
				["Almacen", "name", "!=", frm.doc.name]
			]
		};
	});
}



function SetWorkingData()
{
	CargaRelacionUsuario().then(function(resp){
		var relacionUsuario = resp.message;
		
		if(relacionUsuario == null)
			return;
		
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
							var lstEmpresas = getFormatedOptions(empresas, 'abreviacion');
							var lstClientes = getFormatedOptions(clientes, 'abreviacion');

							CargaDialogo(lstEmpresas, lstClientes);					
						}
					});
				}
			});
		}
	});
}
