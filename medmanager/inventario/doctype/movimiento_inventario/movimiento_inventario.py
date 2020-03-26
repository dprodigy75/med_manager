# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MovimientoInventario(Document):
	pass
	# items = frappe.db.sql("select p.name, p.descripcion as description, "
	# " from `tabProducto` as p inner join "
	# " `tabProducto Inventario` as i on "
	# " p.name = i.producto "
	# " where i.parent = %s "
	# " order by p.name asc", almacen, as_dict=True)

@frappe.whitelist()
def productos_almacen(doctype, txt, searchfield, start, page_len, filters):
	# Validate properties before merging
	almacen = filters.get('almacen')
	if almacen:
		if not frappe.db.exists("Almacen", almacen):
			throw("El Almacén: {0} no existe".format(almacen))
	else:
		return frappe.db.sql("select p.name, p.descripcion as description "
			" from `tabProducto` as p inner join "
			" `tabProducto Inventario` as i on "
			" p.name = i.producto "
			" order by p.name asc")

	return frappe.db.sql("select p.name, p.descripcion as description "
		" from `tabProducto` as p inner join "
		" `tabProducto Inventario` as i on "
		" p.name = i.producto "
		" where i.parent = %s "
		" order by p.name asc", almacen)

