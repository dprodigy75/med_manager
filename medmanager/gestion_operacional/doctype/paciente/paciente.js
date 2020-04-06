// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Paciente', {
	refresh: function(frm) {

	},
	before_save: function(frm) {
		frm.set_value('nombre_completo', (frm.doc.nombre.trim() + " " + frm.doc.ap_paterno.trim() + " " + (frm.doc.ap_materno || '')).trim() )
	}
});
