# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RelacionUsuario(Document):
	pass


@frappe.whitelist()
def get_permission_query_conditions_Empresa(user, tableName):
	relacion = frappe.get_doc("Relacion Usuario", user)

	tablaActual = tableName

	cadena = " 1=1 "
	cadenaInvalida = " 1!=1 "

	if relacion.tipo_relacion == "Cliente" or relacion.tipo_relacion == "Proveedor":
		return cadenaInvalida
	
	if relacion.tipo_relacion == "Administrador":
		cadena = cadena + " AND ({tabla}.empresa = '{empresa}')".format(tabla=tablaActual, empresa=relacion.empresa)
	else:
		if relacion.empresa:
			cadena = cadena + " AND ({tabla}.empresa = '{empresa}')".format(tabla=tablaActual, empresa=relacion.empresa)
		else:
			return cadenaInvalida

	return cadena
