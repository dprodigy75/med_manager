# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MovimientoInventario(Document):
	def validate(self):
		if self.almacen_origen and self.almacen_destino:	
			if not frappe.db.exists("Almacen", {"name": self.almacen_origen}):
				frappe.throw("El Almacén: {0} no existe".format(self.almacen_origen))

			if not frappe.db.exists("Almacen", {"name": self.almacen_destino}):
				frappe.throw("El Almacén: {0} no existe".format(self.almacen_destino))
			
			try:
				for mvto in self.movimientos:
					item = frappe.db.get_value(
						'Producto Inventario', \
						['name', 'cantidad'], \
						{'parent': self.almacen_origen,\
						'producto': mvto.producto,\
						'lote': mvto.lote },\
						1,\
						0,\
						'Almacen')
					
					if(item.cantidad < mvto.cantidad):
						frappe.throw("El producto {0} con lote {1} tiene solo {2} unidades disponibles, revise la solicitud"\
							.format(mvto.producto, mvto.lote, mvto.cantidad))
			except:
  				frappe.throw("Ocurrio un error")
		else:
			frappe.throw("Los datos del traspaso son inválidos")

@frappe.whitelist()
def traspaso_almacen(almacen_origen, almacen_destino, producto, cantidad, lote):
	if almacen_origen and almacen_destino and producto and cantidad > 0 and lote:
		docAlmacen_origen = frappe.get_doc('Almacen', almacen_origen)
		
		if docAlmacen_origen:
			inventario = docAlmacen_origen.get("inventario")

		else:
			frappe.throw("El Almacén: {0} no existe".format(almacen_origen))
	else:
		frappe.throw("Los datos del traspaso son inválidos")


""" production_plans = []
		for d in self.get('items'):
			if d.production_plan and d.material_request_plan_item:
				qty = d.qty if self.docstatus == 1 else 0
				frappe.db.set_value('Material Request Plan Item',
					d.material_request_plan_item, 'requested_qty', qty)

				if d.production_plan not in production_plans:
					production_plans.append(d.production_plan)

		for production_plan in production_plans:
			doc = frappe.get_doc('Production Plan', production_plan)
			doc.set_status()
			doc.db_set('status', doc.status)

def update_completed_and_requested_qty(stock_entry, method):
	if stock_entry.doctype == "Stock Entry":
		material_request_map = {}

		for d in stock_entry.get("items"):
			if d.material_request:
				material_request_map.setdefault(d.material_request, []).append(d.material_request_item)

		for mr, mr_item_rows in material_request_map.items():
			if mr and mr_item_rows:
				mr_obj = frappe.get_doc("Material Request", mr)

				if mr_obj.status in ["Stopped", "Cancelled"]:
					frappe.throw(_("{0} {1} is cancelled or stopped").format(_("Material Request"), mr),
						frappe.InvalidStatusError)

				mr_obj.update_completed_qty(mr_item_rows)
				mr_obj.update_requested_qty(mr_item_rows)

def set_missing_values(source, target_doc):
	if target_doc.doctype == "Purchase Order" and getdate(target_doc.schedule_date) <  getdate(nowdate()):
		target_doc.schedule_date = None
	target_doc.run_method("set_missing_values")
	target_doc.run_method("calculate_taxes_and_totals")
 """

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

