// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Contrato', {
	refresh: function(frm) {
		console.log(frm.doc.name);
		// frappe.call({
		// 	'method': 'frappe.client.get_list',
		// 	'args': {
		// 	  'doctype': 'Periodo Contrato',
		// 	  fields: ['name', 'contrato'],
		// 	  filters: {"contrato": ["=", frm.doc.name]},
		// 	},
		// 	'callback': function(res){
		// 		console.log(res);
		// 		var template = "<table><tbody>{% for (var row in rows) { %}<tr>{% for (var col in rows[row]) { %}<td>rows[row][col]</td>{% } %}</tr>{% } %}</tbody></table>";
		// 	   frm.set_df_property('html_fieldname', 'options', frappe.render(template, {rows: res.message}));
		// 	   frm.refresh_field('html_fieldname');
		// 	}
		//   });
	},
	cliente: function(frm) {
		if(!(frm.doc.cliente == null))
		{
			frappe.db.get_doc('Cliente', frm.doc.cliente)
				.then(doc => {
					frm.set_value('nom_cliente', doc.razon_social);
					frm.toggle_display('nom_cliente', true);
				});
		}
	},
	onload: function(frm) {
		if(!(frm.doc.cliente == null))
		{
			frappe.db.get_doc('Cliente', frm.doc.cliente)
				.then(doc => {
					frm.set_value('nom_cliente', doc.razon_social);
					frm.toggle_display('nom_cliente', true);
				});
		}

		//frm.toggle_enable('nom_cliente', true);
		//frm.set_df_property('nom_cliente', 'read_only', 1);		
	}
});
