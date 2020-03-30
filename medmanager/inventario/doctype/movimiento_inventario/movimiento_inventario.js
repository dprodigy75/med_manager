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
		if(frm.doc.docstatus == 0)
		{
			cur_frm.clear_table("movimientos");
		}
		
		frm.toggle_display(['movimientos'], !(frm.doc.almacen_origen == null));
	},
	validate: function(frm) {
	
		//console.log("T0" + new Date());
		
		//  var p1 = new Promise((resolve, reject) => { 
		// 	var erroresInventario = ValidaInventario(frm);

		// 	debugger;

		// 	if(erroresInventario == null)
		// 	{
		// 		reject("Chale");
		// 	}
			
		// 	resolve("OK");
		//   }); 


		// ValidaInventario(frm)
		// 	.then( function(errores)
		// 	{
		// 		console.log(errores)
		// 		cadena = errores.join();
		// 		llego = 1;
		// 	},function(excepciones)
		// 	{
		// 		console.log(excepciones)
		// 		cadena = excepciones.join();
		// 		llego = 1;
		// 	}
		// 	);
			

		// frappe.throw(cadena);

		//console.log(errorPromise);

		// var respuesta = erroresInventario.then(function(response) {
		// 	console.log("T1" + new Date()); 
		// 	console.log(response);

		// 	 frappe.throw("Validacion");
		// 	 return response;
			 
		//  })
		//  .catch(function(err) {
		// 	console.log("T2" + new Date());
		// 	 console.log(err);
		// 	 frappe.throw(err);
		//  	return "Error inesperado";
		// })

		//console.log("T3" + new Date());
		//console.log(erroresInventario);

		// if(respuesta != '')
		// {
		// 	frappe.throw(respuesta);
		// 	validate = false;
		// }
		
		// frappe.msgprint(__('Test'));

			// erroresInventario
			// 	.then( () => {

			// 	if(erroresInventario !== '')
			// 	{
			// 		frappe.throw(erroresInventario);
			// 	}
			// })
			// .catch( () => {
			// 	frappe.throw("Error inesperado");
			// });		
			

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
	
				var cantidad_maxima = frappe.meta.get_docfield(row.doctype, "cantidad_maxima", cur_frm.doc.name);
				var unidad = frappe.meta.get_docfield(row.doctype, "unidad", cur_frm.doc.name);

				frappe.model.set_value(row.doctype, row.name, "cantidad_maxima", resp.message.cantidad);
				frappe.model.set_value(row.doctype, row.name, "cantidad", 0);
				frappe.model.set_value(row.doctype, row.name, "unidad", resp.message.unidad);
	
				cur_frm.refresh();
			}
		});
	}


		

		//TODO: Optimizar est busqueda de lotes
/* 		frappe.db.get_doc('Producto Inventario', 
			null, 
			{ 
				'parent': frm.doc.almacen_origen,
				 'producto': row.producto
			},
			parent)
    	.then(doc => {
			console.log(doc)

		}); */



		// //TODO: Optimizar est busqueda de lotes
		// frappe.db.get_doc('Almacen', frm.doc.almacen_origen)
    	// .then(doc => {
		// 	// console.log(doc)
			
		// 	var lotes = [];

		// 	var esteProducto = row.producto;


		// 	$.each(doc.inventario, function( index, value ) {
		// 		if(!(value==null) && !(value.producto==null)){
		// 			if(value.producto == esteProducto)
		// 			{
		// 				lotes.push(value.lote);
		// 			}
		// 		}
		// 	});

		// 	var lote = frappe.meta.get_docfield(row.doctype, "lote", cur_frm.doc.name);

		// 	console.log(lote);

		// 	//lote.fieldtype = "Select";
		// 	lote.options = lotes;

		// 	//row.set_value('cantidad_min', doc.minimo)

		// 	//refresh_field(lote);

		// 	//row.set_df_property('lote', 'fieldtype', 'Select');
		// 	//row.set_df_property('lote', 'options', lotes);

		// 	//cur_frm.refresh();
		// 	frm.refresh();
		// });

		//frm.set_value('cantidad_min', doc.minimo);
		// cur_frm.refresh();
		// frm.refresh();
		

});



 async function VerificaInventarioProducto (frm, row) {
	return frappe.call({
		method: 'frappe.client.get',
		args: {
			doctype: 'Producto Inventario',
			filters: {
				'parent': frm.doc.almacen_origen,
				'producto': row.producto,
				'lote': row.lote
			},
			parent: 'Almacen'
		} //, 
		// callback: function(resp) {
		// 	debugger;
		// 	if(resp==null || resp.message==null)
		// 	{
		// 		frappe.throw("Ocurrió un error al cargar el lote del producto")
		// 		return;
		// 	}
		// 	if(row.cantidad > resp.cantidad)
		// 	{
		// 		frappe.throw("El inventario no es sufiiente")
		// 		return false;
		// 	}
		// }
	});	
}


 async function ValidaInventario(frm) {	

	var errores = '';
	for(const row of frm.doc.movimientos)
	{
		var currentPromise =  
			await VerificaInventarioProducto(frm, row)
			.then(resp => {
				console.log(resp);
				var errores = '';
				if (resp == null || resp.message == null) {
					errores += "Ocurrió un error en la respuesta del servidor, vuelva a cargar la página por favor. ";
				}
				if (row.cantidad > resp.message.cantidad) {
					errores += "La cantidad solicitada del producto " + row.producto + " es mayor a la disponible en el inventario."
				}
				return errores;
			});
		
			errores += currentPromise;
	}
return errores;
	// return Promise.all(promesas).then(values => {
	// 	 	console.log(values);
	// 	 	return values;
	// 	 }, reasons => {
	// 	 	console.log(reasons);
	// 	 	return reasons;
	// 	});

	// {
	// 	var currentPromise = 
	// 		await frappe.call({
	// 			method: 'frappe.client.get',
	// 			args: {
	// 				doctype: 'Producto Inventario',
	// 				filters: {
	// 					'parent': frm.doc.almacen_origen,
	// 					'producto': row.producto,
	// 					'lote': row.lote
	// 				},
	// 				parent: 'Almacen'
	// 			}
	// 		});

	// 	promesas.push(currentPromise);

	// 	currentPromise.then(function(resp) {
	// 		console.log(resp);

	// 		if(resp==null || resp.message==null)
	// 		{
	// 			return "Ocurrió un error al cargar el lote del producto";
	// 		 }
			 
	// 		if(row.cantidad > resp.cantidad)
	// 		{
	// 			return "El inventario no es sufiiente";
	// 		}

	// 		return "";
	//    	}, function(reason) {
	// 		console.log("Error:" + reason);
	// 		return "Ocurrió un error inesperado";
	// 	});

	// 	//let result = VerificaInventarioProducto(frm, row);

		//console.log(result);

		//errores += result;
	//}

	// Promise.all(promesas).then(values => {
	// 	console.log(values);
	// 	return values;
	// }, reasons => {
	// 	console.log(reasons);
	// 	return reasons;
	// });	
}

function EstableceFiltros(frm, cur_frm) {
	cur_frm.set_query("producto", "movimientos", function (doc, cdt, cdn) {
		var d = locals[cdt][cdn];
		var data = { "almacen": doc.almacen_origen };
		return {
			query: "medmanager.inventario.doctype.movimiento_inventario.movimiento_inventario.productos_almacen",
			filters: {
				almacen: doc.almacen_origen
			}
		};
	});
	cur_frm.set_query('almacen_destino', function () {
		return {
			filters: [
				["Almacen", "name", "!=", frm.doc.almacen_origen]
			]
		};
	});
}

function demo() {
	console.log('Taking a break...');
	setTimeout(console.log.bind(null, 'Two second later'), 2000);
  }

