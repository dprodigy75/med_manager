// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Area Cliente', {
	refresh: function(frm) {

	},
	cliente: function(frm) {
		ObtenerDatosTitulo(frm);
	},
	area: function(frm) {
		ObtenerDatosTitulo(frm);	
	},
	validate: function(frm) {
		ObtenerDatosTitulo(frm);
	},
});

function ObtenerDatosTitulo(frm){
	if(frm.doc.cliente!=null && frm.doc.cliente!='')
	{
		var cliente = 
			frappe.db.get_doc("Cliente", frm.doc.cliente).then(function(message) {					
					frm.set_value("titulo", frm.doc.area + " - " + message.razon_social);
			});
	}
}
