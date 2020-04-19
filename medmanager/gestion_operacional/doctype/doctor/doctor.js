// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Doctor', {
	before_save: function(frm) {
		frm.set_value('nombre_completo', (frm.doc.nombre.trim() + " " + frm.doc.ap_paterno.trim() + " " + (frm.doc.ap_materno || '')).trim() )
	},
	onload: function(frm) {
		EstableceFiltroEspecialidad(frm, cur_frm);
	},
	especialidad: function(frm) {
		EstableceFiltroEspecialidad(frm, cur_frm);
	}
});


function EstableceFiltroEspecialidad(frm, cur_frm) {
	cur_frm.set_query('subespecialidad', function () {
		return {
			filters: [
				["Subespecialidad", "activo", "=", 1],
				["Subespecialidad", "especialidad", "=", frm.doc.especialidad]
			]
		};
	});
}
