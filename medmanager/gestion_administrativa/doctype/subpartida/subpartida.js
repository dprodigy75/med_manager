// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Subpartida', {
	refresh: function(frm) {
		console.log(frm);
	},
	refresh: function(frm) {
		console.log(frm);
	},
	validate: function(frm) {
		console.log(frm);
	},
	producto: function(frm) {
		console.log(frm);

		frappe.db.get_doc('Producto', frm.doc.producto)
		.then(doc => {
			frm.set_value('cantidad_min', doc.minimo);
			frm.set_value('cantidad_max', doc.maximo);
			frm.refresh();
		});
	}
});
