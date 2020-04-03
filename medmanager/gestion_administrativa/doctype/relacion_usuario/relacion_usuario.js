// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Relacion Usuario', {
	refresh: function(frm) {
		
	},
	onload: function(frm) {
		toggle_tipo_relacion(frm);

		cur_frm.set_query('empresa', function () {
			return {
				filters: [
					["Empresa", "activo", "=", 1],
				]
			};
		});
	},
	tipo_relacion: function(frm) {
		toggle_tipo_relacion(frm);

		EstableceFiltroCliente(frm);
		EstableceFiltroUnidadMedica(frm);
	},
	empresa: function(frm) {
		console.log(frm.doc.empresa);

		EstableceFiltroCliente(frm);
	},
	cliente: function(frm) {
		console.log(frm.doc.cliente);

		EstableceFiltroUnidadMedica(frm);
	},
});


function EstableceFiltroUnidadMedica(frm) {
	frm.set_value('unidad', null);
	frm.refresh_field('unidad');

	var valor = frm.doc.cliente ?? '';

	cur_frm.set_query('unidad', function () {
		return {
			filters: [
				["Unidad Medica", "cliente", "=", valor],
				["Unidad Medica", "activo", "=", 1],
			]
		};
	});
}

function EstableceFiltroCliente(frm) {
	frm.set_value('cliente', null);
	frm.refresh_field('cliente');

	var valor = frm.doc.empresa ?? '';

	cur_frm.set_query('cliente', function () {
		return {
			filters: [
				["Cliente", "empresa", "=", valor],
				["Cliente", "activo", "=", 1],
			]
		};
	});	
}

function toggle_tipo_relacion(frm)
{
	if(frm.doc.tipo_relacion==null)
	{
		frm.toggle_display(['empresa'], false);
		frm.toggle_display(['area'], false);
		frm.toggle_display(['cliente'], false);
		frm.toggle_display(['proveedor'], false);
		frm.toggle_display(['unidad'], false);
		return;
	}
	if(frm.doc.tipo_relacion=="Administrador")
	{
		frm.toggle_display(['empresa'], false);
		frm.toggle_display(['area'], false);
		frm.toggle_display(['cliente'], false);
		frm.toggle_display(['proveedor'], false);
		frm.toggle_display(['unidad'], false);

		frm.toggle_reqd('empresa', false);
		frm.toggle_reqd('area', false);
		frm.toggle_reqd('cliente', false);
		frm.toggle_reqd('proveedor', false);
		frm.toggle_reqd('unidad', false);

		return;
	}
	if(frm.doc.tipo_relacion=="Empleado")
	{
		frm.toggle_display(['empresa'], true);
		frm.toggle_display(['area'], true);
		frm.toggle_display(['cliente'], true);
		frm.toggle_display(['proveedor'], false);
		frm.toggle_display(['unidad'], true);

		frm.toggle_reqd('empresa', true);
		frm.toggle_reqd('area', true);
		frm.toggle_reqd('cliente', true);
		frm.toggle_reqd('proveedor', false);
		frm.toggle_reqd('unidad', false);

		return;
	}
	if(frm.doc.tipo_relacion=="Cliente")
	{
		frm.toggle_display(['empresa'], true);
		frm.toggle_display(['area'], false);
		frm.toggle_display(['cliente'], true);
		frm.toggle_display(['proveedor'], false);
		frm.toggle_display(['unidad'], false);

		frm.toggle_reqd('empresa', true);
		frm.toggle_reqd('area', false);
		frm.toggle_reqd('cliente', true);
		frm.toggle_reqd('proveedor', false);
		frm.toggle_reqd('unidad', false);

		return;
	}
	if(frm.doc.tipo_relacion=="Proveedor")
	{
		frm.toggle_display(['empresa'], true);
		frm.toggle_display(['area'], false);
		frm.toggle_display(['cliente'], false);
		frm.toggle_display(['proveedor'], true);
		frm.toggle_display(['unidad'], false);

		frm.toggle_reqd('empresa', true);
		frm.toggle_reqd('area', false);
		frm.toggle_reqd('cliente', false);
		frm.toggle_reqd('proveedor', true);
		frm.toggle_reqd('unidad', false);

		return;
	}
}