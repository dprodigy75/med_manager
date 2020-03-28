// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Movimiento Inventario', {
	refresh: function(frm) {

		if(!(doc.almacen_origen == null))
		{
			cur_frm.set_query("producto", "movimientos", function(doc, cdt, cdn) {
				var d = locals[cdt][cdn];

				var data = { "almacen": doc.almacen_origen };

				return {
					query: "medmanager.inventario.doctype.movimiento_inventario.movimiento_inventario.productos_almacen",
					filters: {
						almacen: doc.almacen_origen
					}
				}			
			});

			frm.set_query('almacen_destino', function() {
				return {
					filters: [
						["Almacen", "name", "!=", frm.doc.almacen_origen]
					]
				}
			});
		}
	},
	onload: function(frm) {
		cur_frm.clear_table("movimientos");
		frm.toggle_display(['movimientos'], !(frm.doc.almacen_origen == null));
	},
	almacen_origen: function(frm) {
		//var almacen_field = frappe.meta.get_docfield(frm.doctype, "almacen_origen");
		if(almacen_Origen_actual == null)
		{
			almacen_Origen_anterior = null;
		}
		else
		{
			almacen_Origen_anterior = almacen_Origen_actual;
		}

		almacen_Origen_actual = frm.doc.almacen_origen;

		if(!(almacen_Origen_actual == null))
		{
			frm.set_query('almacen_destino', function() {
				return {
					filters: [
						["Almacen", "name", "!=", frm.doc.almacen_origen]
					]
				}
			});
		}	

		frm.toggle_display(['movimientos'], !(frm.doc.almacen_origen == null));

		if(!(almacen_Origen_anterior == null) && almacen_Origen_anterior !== almacen_Origen_actual)
		{
			frappe.confirm('Si cambia el almacén perdera los cambios en el detalle de los productos del movimiento de inventario ¿Está seguro?',
    			() => {
					frm.set_value('almacen_destino', null);
					frm.clear_table("movimientos");
					frm.refresh_field('almacen_destino');
					frm.refresh_field('movimientos');
				}, 
				() => {
					almacen_Origen_actual = almacen_Origen_anterior;
					frm.set_value('almacen_origen', almacen_Origen_anterior);
					frm.refresh_field('almacen_origen');
			});
			
			frm.refresh();
		}
	},
	movimientos_add: function(frm) {
		console.log("movimientos_add");
	},
});

var almacen_Origen_actual = null;
var almacen_Origen_anterior = null;


frappe.ui.form.on('Producto Mvto Inventario', {
	refresh: function(frm) {
	},
	lote: function(frm, cdt, cdn) {
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		// console.log(frm);
		// console.log(row);

		frappe.db.get_doc('Almacen', frm.doc.almacen_origen)
    	.then(doc => {
			// console.log(doc)
			
			var lotes = [];

			var esteProducto = row.producto;

			$.each(doc.inventario, function( index, value ) {
				if(!(value==null) && !(value.producto==null)){
					if(value.producto == esteProducto)
					{
						lotes.push(value.lote);
					}
				}
			});

			var lote = frappe.meta.get_docfield(row.doctype, "lote", cur_frm.doc.name);

			//lote.fieldtype = "Select";
			lote.options = lotes;

			//row.set_value('cantidad_min', doc.minimo)

			//refresh_field(lote);

			//row.set_df_property('lote', 'fieldtype', 'Select');
			//row.set_df_property('lote', 'options', lotes);

			//cur_frm.refresh();
			// frm.refresh();
		});

		//frm.set_value('cantidad_min', doc.minimo);
		// cur_frm.refresh();
		// frm.refresh();
		
	},
});


