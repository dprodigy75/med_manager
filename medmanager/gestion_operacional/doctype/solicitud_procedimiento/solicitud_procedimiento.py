# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class SolicitudProcedimiento(Document):
	pass




@frappe.whitelist()
def productos_contrato(doctype, txt, searchfield, start, page_len, filters):
	# Validate properties before merging
	unidad_medica = filters.get('unidad_medica')

	items = []

	if unidad_medica:
		if frappe.db.exists("Unidad Medica", unidad_medica):
			return frappe.db.sql("select p.name, p.descripcion as description "
				" from `tabProducto` as p " 
				" inner join "
				" `tabProducto Inventario` as i on "
				" p.name = i.producto "
				" inner join "
				" `tabAlmacen` as a on "
				" i.parent = a.name "
				" inner join "
				" `tabUnidad Medica` as u on "
				" a.unidad_medica = u.name "
				" inner join "
				" `tabContrato` as c on "
				" u.cliente = c.cliente "
				" where u.name = %s "
				# " and i.parentfield = ""inventario"""
				" and i.movimiento_inventario is null or i.movimiento_inventario = '' "
				" order by p.name asc", unidad_medica)
		else:
			frappe.throw("La unidad médica: {0} no existe".format(unidad_medica))
	else:
		frappe.throw("Valor de unidad médica es nulo")

	return items