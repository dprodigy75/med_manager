// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Partida', {
	refresh: function(frm) {
		
	},
	num_partida: function(frm) {
		
	},
	validate: function(frm) {
		console.log(frm);
	},
	subpartidas_add: function(frm) {
		console.log(frm);
	},
	subpartidas_on_form_rendered: function(frm, cdt, cdn) {
		var d  = locals[cdt][cdn];

		console.log(frm);
		console.log(cdt);
		console.log(cdn);

		console.log(JSON.stringify(d));
		console.log(JSON.stringify(d.subpartidas));

		for(var i = 0; i < d.subpartidas.length; i++)
		{
			var valor = d.num_partida + "." + d.subpartidas[i].idx;

			//d.subpartidas[i].name = valor;

			//frappe.model.set_value('Subpartida', 'subpartidas', 'clave', valor)
			
			//frappe.model.set_value(cdt, cdn, 'clave', valor);
			d.subpartidas[i].clave = valor;		

			// $.each(cur_frm.childtable || [], function(i, v) {
			// 	frappe.db.get_value("Sales Invoice", v.reference_name, "fieldnameresult", function(r) {
			// 		frappe.model.set_value(v.doctype, v.name, childfieldname, r.fieldnameresult)
			// 	})
			// })


			//frm.set_value('subpartidas[' + i + '].name', valor);
		}


		

    	console.log(JSON.stringify(d));
    }
});
