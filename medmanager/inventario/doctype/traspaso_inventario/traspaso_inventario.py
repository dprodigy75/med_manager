# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class TraspasoInventario(Document):
	def validate(self):
		if self.almacen_origen and self.almacen_destino:	
			if not frappe.db.exists("Almacen", {"name": self.almacen_origen}):
				frappe.throw("El Almacén: {0} no existe".format(self.almacen_origen))

			if not frappe.db.exists("Almacen", {"name": self.almacen_destino}):
				frappe.throw("El Almacén: {0} no existe".format(self.almacen_destino))

			if self.almacen_origen == self.almacen_destino:
				frappe.throw("El Almacén origen y destino no pueden ser los mismos")

			if self.fecha_recepcion and self.fecha_salida > self.fecha_recepcion:
				frappe.throw("La fecha de recpción del material no puede ser anterior a la de salida")
			
			for mvto in self.movimientos:
				cantidad = frappe.db.get_value('Producto Inventario', {'parent': self.almacen_origen, 'producto': mvto.producto,	'lote': mvto.lote },\
					'cantidad')
				
				if(cantidad < mvto.cantidad):
					frappe.throw("El producto {0} con lote {1} tiene solo {2} unidades disponibles, revise la solicitud"\
						.format(mvto.producto, mvto.lote, cantidad))
		else:
			frappe.throw("Los datos del traspaso son inválidos")
	
	def afterInsert(self):
		for mvto in self.movimientos:
			name_producto_origen = frappe.db.get_value('Producto Inventario', \
				{'parent': self.almacen_origen, 'producto': mvto.producto, \
				'lote': mvto.lote, 'parentfield': 'inventario' },\
					'name')
			
			if not name_producto_origen:
				frappe.throw("Producto {0} con lote {1}, no encontrado en almacén {2}".format(mvto.producto, mvto.lote, self.almacen_origen))

			produco_origen = frappe.get_doc("Producto Inventario", name_producto_origen)

			if produco_origen:
				nueva_cantidad = produco_origen.cantidad - mvto.cantidad
				produco_origen.update({ "cantidad": nueva_cantidad })
				produco_origen.save()
				# frappe.db.commit()
			else:
				frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.almacen_origen))
			
		almacen = frappe.get_doc("Almacen", self.almacen_origen)

		if not almacen:
			frappe.throw("Almacen {0} inválido".format(self.origen))
		
		for mvto in self.movimientos:			
			produco_almacen_transitorio = frappe.get_doc({'doctype': "Producto Inventario", \
			 	'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad, \
				'unidad': mvto.unidad, 'fecha_caducidad': mvto.fecha_caducidad, \
				'movimiento_inventario': self.name })

			if produco_almacen_transitorio:
				almacen.append("transitorio", produco_almacen_transitorio)
			else:
				frappe.throw("Producto {0} inválido".format(mvto.producto))
		
		almacen.save()
		frappe.db.commit()

	def on_update(self):
		if self.workflow_state == "Recibido":
			self.recibir_traspaso()
		if self.workflow_state == "Devuelto":
			self.devolver_traspaso()

	def devolver_traspaso(self):
		for mvto in self.tabla1:
			name_producto = frappe.db.get_value('Producto Inventario', {'parent': self.almacen_origen, 'producto': mvto.producto, 'lote': mvto.lote, 'parentfield': 'inventario' },\
					'name')

			if not name_producto:
				frappe.throw("Producto {0} con lote {1}, no encontrado en almacén {2}".format(mvto.producto, mvto.lote, self.almacen_origen))

			produco_origen = frappe.get_doc("Producto Inventario", name_producto)
			
			if produco_origen:
				nueva_cantidad = produco_origen.cantidad + mvto.cantidad
				produco_origen.update({ "cantidad": nueva_cantidad })
				produco_origen.save()
				frappe.db.commit()
			else:
				frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.almacen_origen))


	def recibir_traspaso(self):
		nuevos = []

		for mvto in self.movimientos:
			name_producto = frappe.db.get_value('Producto Inventario', {'parent': self.almacen_destino, 'producto': mvto.producto, 'lote': mvto.lote, 'parentfield': 'inventario' },\
				'name')

			if not name_producto:
				# Agregar fecha caducidad
				nuevo = frappe.get_doc({'doctype': "Producto Inventario", \
			 		'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad, \
					'unidad': mvto.unidad, 'fecha_caducidad': mvto.fecha_caducidad, \
					'movimiento_inventario': self.name })

				nuevos.append(nuevo)
			else:
				producto_destino = frappe.get_doc("Producto Inventario", name_producto)

				if producto_destino:
					nueva_cantidad = producto_destino.cantidad + mvto.cantidad					
					producto_destino.update({ "cantidad": nueva_cantidad })						
					producto_destino.save()
					# frappe.db.commit()
				else:
					frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.almacen_destino))

		almacen = frappe.get_doc("Almacen", self.almacen_destino)

		if not almacen:
			frappe.throw("Almacen {0} inválido".format(self.almacen_destino))

		for n in nuevos:
			almacen.append("inventario", n)

		for mvto in self.movimientos:			
			produco_almacen_transitorio = frappe.get_doc({'doctype': "Producto Inventario", \
			 		'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad, \
					'unidad': mvto.unidad, 'fecha_caducidad': mvto.fecha_caducidad, \
					'movimiento_inventario': self.name })

			if produco_almacen_transitorio:
				almacen.append("transitorio", produco_almacen_transitorio)
			else:
				frappe.throw("Producto {0} inválido".format(mvto.producto))

		almacen.save()
		frappe.db.commit()


# update multiple values
# frappe.db.set_value('Task', 'TASK00002', {
#     'subject': 'New Subject',
#     'description': 'New Description'
# })

# for production_plan in production_plans:
#	doc = frappe.get_doc('Production Plan', production_plan)
#	doc.set_status()
#	doc.db_set('status', doc.status)

#	target_doc.run_method("set_missing_values")


@frappe.whitelist()
def productos_almacen(doctype, txt, searchfield, start, page_len, filters):
	# Validate properties before merging
	almacen = filters.get('almacen')

	items = []

	if almacen:
		if frappe.db.exists("Almacen", almacen):
			return frappe.db.sql("select p.name, p.descripcion as description "
				" from `tabProducto` as p inner join "
				" `tabProducto Inventario` as i on "
				" p.name = i.producto "
				" where i.parent = %s "
				" and i.movimiento_inventario is null or i.movimiento_inventario = '' "
				" order by p.name asc", almacen)
		else:
			frappe.throw("El Almacén: {0} no existe".format(almacen))
	else:
		frappe.throw("Valor de almacen es nulo")

	return items


