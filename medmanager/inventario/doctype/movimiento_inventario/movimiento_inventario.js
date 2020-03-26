// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Movimiento Inventario', {
	refresh: function(frm) {
		cur_frm.set_query("producto", "movimientos", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];

			var data = { "almacen": doc.almacen_origen };

			if(!(doc.almacen_origen == null))
			{
				return {
					query: "medmanager.inventario.doctype.movimiento_inventario.movimiento_inventario.productos_almacen",
					filters: {
						almacen: doc.almacen_origen
					}
				}
			}
		});
	},
	movimientos_add: function(frm) {
		console.log("movimientos_add");
	},
});


frappe.ui.form.on('Producto Mvto Inventario', {
	refresh: function(frm) {
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
	},
});


