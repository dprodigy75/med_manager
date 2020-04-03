# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class TestB(Document):
	def validate(self):
		if self.origen and self.destino:	
			if not frappe.db.exists("TestA", {"name": self.origen}):
				frappe.throw("El Almacén: {0} no existe".format(self.origen))

			if not frappe.db.exists("TestA", {"name": self.destino}):
				frappe.throw("El Almacén: {0} no existe".format(self.destino))

			if self.origen == self.destino:
				frappe.throw("El Almacén origen y destino no pueden ser los mismos")

			for mvto in self.tabla1:
				cantidad = frappe.db.get_value('TestAChild', {'parent': self.origen, 'producto': mvto.producto,	'lote': mvto.lote, 'parentfield': 'tabla1' },\
					'cantidad')
				
				if not cantidad:
					frappe.throw("El producto {0} con lote {1} no fue encontrado, revise la solicitud"\
						.format(mvto.producto, mvto.lote))
				
				if(cantidad < mvto.cantidad):
					frappe.throw("El producto {0} con lote {1} tiene solo {2} unidades disponibles, revise la solicitud"\
						.format(mvto.producto, mvto.lote, cantidad))
		else:
			frappe.throw("Los datos del traspaso son inválidos")
	
	def after_insert(self):
		for mvto in self.tabla1:
			name_producto = frappe.db.get_value('TestAChild', {'parent': self.origen, 'producto': mvto.producto, 'lote': mvto.lote, 'parentfield': 'tabla1' },\
					'name')

			if not name_producto:
				frappe.throw("Producto {0} con lote {1}, no encontrado en almacén {2}".format(mvto.producto, mvto.lote, self.origen))

			produco_origen = frappe.get_doc("TestAChild", name_producto)
			
			if produco_origen:
				nueva_cantidad = produco_origen.cantidad - mvto.cantidad
				produco_origen.update({ "cantidad": nueva_cantidad })
				produco_origen.save()
				frappe.db.commit()
			else:
				frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.origen))
		
		almacen = frappe.get_doc("TestA", self.origen)

		if not almacen:
			frappe.throw("Almacen {0} inválido".format(self.origen))
		
		for mvto in self.tabla1:			
			produco_almacen_transitorio = frappe.get_doc({'doctype': "TestAChild", \
			 	'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad, \
			 	'id_externo': self.name })

			if produco_almacen_transitorio:
				almacen.append("tabla2", produco_almacen_transitorio)
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
			name_producto = frappe.db.get_value('TestAChild', {'parent': self.origen, 'producto': mvto.producto, 'lote': mvto.lote, 'parentfield': 'tabla1' },\
					'name')

			if not name_producto:
				frappe.throw("Producto {0} con lote {1}, no encontrado en almacén {2}".format(mvto.producto, mvto.lote, self.origen))

			produco_origen = frappe.get_doc("TestAChild", name_producto)
			
			if produco_origen:
				nueva_cantidad = produco_origen.cantidad + mvto.cantidad
				produco_origen.update({ "cantidad": nueva_cantidad })
				produco_origen.save()
				frappe.db.commit()
			else:
				frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.origen))


	def recibir_traspaso(self):
		nuevos = []

		for mvto in self.tabla1:
			name_producto = frappe.db.get_value('TestAChild', {'parent': self.destino, 'producto': mvto.producto, 'lote': mvto.lote, 'parentfield': 'tabla1' },\
				'name')

			if not name_producto:
				# Agregar fecha caducidad
				nuevo = frappe.get_doc({'doctype': "TestAChild", \
					'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad })
				nuevos.append(nuevo)
			else:
				produco_destino = frappe.get_doc("TestAChild", name_producto)

				if produco_destino:
					nueva_cantidad = produco_destino.cantidad + mvto.cantidad					
					produco_destino.update({ "cantidad": nueva_cantidad })						
					produco_destino.save()
					frappe.db.commit()
				else:
					frappe.throw("Producto {0} no encontrado en almacén {1}".format(mvto.producto, self.destino))

		almacen = frappe.get_doc("TestA", self.destino)

		if not almacen:
			frappe.throw("Almacen {0} inválido".format(self.destino))

		for n in nuevos:
			almacen.append("tabla1", n)

		for mvto in self.tabla1:			
			produco_almacen_transitorio = frappe.get_doc({'doctype': "TestAChild", \
				'producto': mvto.producto, 'lote': mvto.lote, 'cantidad': mvto.cantidad, \
				'id_externo': self.name })

			if produco_almacen_transitorio:
				almacen.append("tabla2", produco_almacen_transitorio)
			else:
				frappe.throw("Producto {0} inválido".format(mvto.producto))

		almacen.save()
		frappe.db.commit()
 