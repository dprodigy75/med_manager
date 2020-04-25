// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Movimiento Inventario', {
	refresh: function(frm) {

		if(!(frm.doc.almacen_origen == null))
		{
			EstableceFiltros(frm, cur_frm);
		}
	},
	onload: function(frm) {
		currentNivel = 'AREA';
		currentDocTypeNameFrm = 'Movimiento Inventario';

		estableceContextoForm(frm, currentDocTypeNameFrm, currentNivel);

		frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));

		if(frm.doc.docstatus == 0)
		{
			cur_frm.clear_table("movimientos");
		}
		
		EstableceFiltroOrigen(frm, cur_frm);

		frm.toggle_display(['movimientos'], !(frm.doc.almacen_origen == null));
	},
	validate: function(frm) {
		
	
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
			EstableceFiltros(frm, cur_frm);
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
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		frappe.call({
			method:'frappe.client.get_list',
			args: {
				doctype: 'Producto Inventario',
				fields: [
					"name",
					"producto",
					"lote"
				],
				filters: {
					'parent': frm.doc.almacen_origen,
					'producto': row.producto,
				},
				parent: 'Almacen',
			}, 
			callback: function(resp) { 
				if(resp==null || !(Array.isArray(resp.message)) || resp.message.length<=0)
				{
					frappe.throw("Ocurrió un error al cargar el inventario del producto")
					return;
				}

				var lotes = [];

				$.each(resp.message, function( index, value ) {
					lotes.push(value.lote);						
				});
	
				var lote = frappe.meta.get_docfield(row.doctype, "lote", cur_frm.doc.name);

				lote.options = lotes;

				//frm.refresh_field(lote);
				cur_frm.refresh();
			}
		});
	},
	lote: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(row.producto==null)
		{
			return;
		}

		frappe.call({
			method:'frappe.client.get',
			args: {
				doctype: 'Producto Inventario',
				filters: {
					'parent': frm.doc.almacen_origen,
					'producto': row.producto,
					'lote': row.lote
				},
				parent: 'Almacen'
			}, 
			callback: function(resp) { 
				if(resp==null || resp.message==null)
				{
					frappe.throw("Ocurrió un error al cargar el lote del producto")
					return;
				}
	
				frappe.model.set_value(row.doctype, row.name, "cantidad_maxima", resp.message.cantidad);
				frappe.model.set_value(row.doctype, row.name, "cantidad", 0);
				frappe.model.set_value(row.doctype, row.name, "unidad", resp.message.unidad);
	
				cur_frm.refresh();
			}
		});
	}
});

function EstableceFiltroOrigen(frm, cur_frm) {

	cur_frm.set_query('almacen_origen', function () {
		return {
			filters: [
				["Almacen", "activo", "=", 1]
			]
		};
	});
}

function EstableceFiltros(frm, cur_frm) {
	cur_frm.set_query("producto", "movimientos", function (doc, cdt, cdn) {
		var d = locals[cdt][cdn];
		var data = { "almacen": doc.almacen_origen };
		return {
			query: "medmanager.inventario.doctype.movimiento_inventario.movimiento_inventario.productos_almacen",
			filters: {
				almacen: doc.almacen_origen
				, activo: 1
			}
		};
	});
	cur_frm.set_query('almacen_destino', function () {
		return {
			filters: [
				["Almacen", "name", "!=", frm.doc.almacen_origen],
				["Almacen", "activo", "=", 1],
			]
		};
	});
}



