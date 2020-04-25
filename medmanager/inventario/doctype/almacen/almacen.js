// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt
currentDocTypeNameFrm = 'Almacen';

frappe.ui.form.on('Almacen', {
	onload: function(frm) {

		cargaRelacionUsuario().then(function(resp){ 
			var relacionUsuario = resp.message;

			if(relacionUsuario.tipo_relacion=="Administrador")
			{
				currentNivel = 'AREA';	
			}
			else
			{
				currentNivel = 'UNIDAD_MEDICA';
			}

			currentDocTypeNameFrm = 'Almacen';

			estableceContextoForm(frm, currentDocTypeNameFrm, currentNivel);

			frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));

			//filtroCliente(frm, false, relacionUsuario.Empresa);
			//filtroUnidad(frm, false, relacionUsuario.Empresa, relacionUsuario.Cliente);
		});

		// EstableceFiltroCliente(frm, cur_frm);
		// EstableceFiltroUnidad(frm, cur_frm);
		/*
		filtroUnidad(frm, true, contexto.Empresa, contexto.Cliente);

		estableceFiltroAlmacenPadre(frm, cur_frm);
		*/
	},
	refresh: function(frm) {
		/*
		var contexto = null;
		
		getContexto().then(function(resp){ 
			contexto = resp;
			
			if(!(contexto==null))
			{
				filtroCliente(frm, false, contexto.Empresa);
				filtroUnidad(frm, false, contexto.Empresa, contexto.Cliente);
			}
			else
			{	
				cargaRelacionUsuario().then(function(resp){ 
					var relacionUsuario = resp.message;

					filtroCliente(frm, false, relacionUsuario.Empresa);
					filtroUnidad(frm, false, relacionUsuario.Empresa, relacionUsuario.Cliente);

				});
			}

			frm.page.add_inner_message(contexto.GetString());
			frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));

			estableceFiltroAlmacenPadre(frm, cur_frm);
		});
		*/
	},
	empresa: function(frm) {
		//filtroCliente(cur_frm, false, relacionUsuario.Empresa);
	},
	cliente: function(frm) {
		
		// filtroUnidad(cur_frm, false, frm.doc.empresa, frm.doc.cliente);

	 	// estableceFiltroAlmacenPadre(frm, cur_frm);

	 	// frm.set_value('unidad_medica', null);
	 	// frm.refresh_field('unidad_medica');
	 	// frm.set_value('almacen_padre', null);
	 	// frm.refresh_field('almacen_padre');
	}
});



// function EstableceFiltroCliente(frm, cur_frm) {
// 	cur_frm.set_query('cliente', function () {
// 		return {
// 			filters: [
// 				["Cliente", "activo", "=", 1]
// 			]
// 		};
// 	});
// }
// function EstableceFiltroUnidad(frm, cur_frm) {
// 	cur_frm.set_query('unidad_medica', function () {
// 		return {
// 			filters: [
// 				["Unidad Medica", "activo", "=", 1],
// 				["Unidad Medica", "cliente", "=", frm.doc.cliente]
// 			]
// 		};
// 	});
// }
function estableceFiltroAlmacenPadre(frm, cur_frm) {
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