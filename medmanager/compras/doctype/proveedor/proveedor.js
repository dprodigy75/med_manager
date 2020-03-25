// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Proveedor', {
	refresh: function(frm) {

	},
	rfc: function(frm) {
		var rfcValido = ValidaRFC(frm.doc.rfc);

		if(rfcValido !== true)
		{
			frappe.msgprint(__("El formato del RFC no es válido"));
		}
	},
	validate: function(frm) {
		var rfcValido = ValidaRFC(frm.doc.rfc);

		if(rfcValido !== true)
		{
			frappe.msgprint(__("El formato del RFC no es válido"));
			frappe.validated = false;
		}
	}
});

function ValidaRFC(cadena)
{
	var rfcValido = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/.test(cadena);

	return rfcValido;
}