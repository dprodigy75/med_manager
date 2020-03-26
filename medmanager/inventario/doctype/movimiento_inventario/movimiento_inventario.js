// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Movimiento Inventario', {
	refresh: function(frm) {
		console.log("refresh");

		frm.set_query("producto", "movimientos", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];

			if(!(d.almacen_origen==null))
			{
				return {
					query: "medmanager.Inventario.doctype.MovimientoInventario.MovimientoInventario.productos_almacen",
					args: {"almacen": d.almacen_origen},
				}
			}
		});
	},
	movimientos_add: function(frm) {
		console.log("movimientos_add");
	},
});


frappe.ui.form.on('movimientos', {
    // cdt is Child DocType name i.e Quotation Item
    // cdn is the row name for e.g bbfcb8da6a
    movimientos: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		console.log("movimientos movimientos");
		console.log(JSON.stringify(row));
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		console.log("movimientos producto");
		console.log(JSON.stringify(row));
	},
	movimientos_add: function(frm) {
		console.log("movimientos_add");
	},
});

frappe.ui.form.on('Producto Mvto Inventario', {
    // cdt is Child DocType name i.e Quotation Item
    // cdn is the row name for e.g bbfcb8da6a
    movimientos: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		console.log("Producto Mvto Inventario movimientos");
		console.log(JSON.stringify(row));
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		console.log("Producto Mvto Inventario producto");
		console.log(JSON.stringify(row));
	},
});


