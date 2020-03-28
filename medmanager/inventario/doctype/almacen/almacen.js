// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Almacen', {
	refresh: function(frm) {

	},
	onload: function(frm) {
		cur_frm.clear_table("inventario");
	},
});
