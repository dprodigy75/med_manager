# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MovimientoInventario(Document):
	@frappe.whitelist()
	def productos_almacen(almacen):
		# Validate properties before merging
		if not frappe.db.exists("Almacen", almacen):
			throw("El Almacén: {0} no existe".format(almacen))

		return frappe.db.sql("select p.name, p.descripcion as description, "
		" from `tabProducto` as p inner join "
		" `tabProducto Inventario` as i on "
		" p.name = i.producto "
		" where i.parent = %s "
		" order by p.name asc", almacen)
	
		# items = frappe.db.sql("select p.name, p.descripcion as description, "
		# " from `tabProducto` as p inner join "
		# " `tabProducto Inventario` as i on "
		# " p.name = i.producto "
		# " where i.parent = %s "
		# " order by p.name asc", almacen, as_dict=True)

