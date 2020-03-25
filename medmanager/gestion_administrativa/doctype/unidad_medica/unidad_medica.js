// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Unidad Medica', {
	refresh: function(frm) {

	},
	onload: function(frm) {

		frappe.db.get_doc('Cliente', frm.doc.cliente)
    		.then(doc => {
				frm.set_value('nom_cliente', doc.razon_social);
				frm.toggle_display('nom_cliente', true);
    		});

		//frm.toggle_enable('nom_cliente', true);
		//frm.set_df_property('nom_cliente', 'read_only', 1);
	}
});

