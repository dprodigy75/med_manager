# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Almacen(Document):
	pass


@frappe.whitelist()
def get_permission_query_conditions(user):
	relacion = frappe.get_doc("Relacion Usuario", user)

	tablaActual = "tabAlmacen"

	if relacion.tipo_relacion == "Cliente" or relacion.tipo_relacion == "Proveedor":
		frappe.throw("Perfil de usuario inválido")

	cadena = " 1=1 "
	cadenaInvalida = " 1!=1 "

	if relacion.tipo_relacion == "Administrador":
		cadena = cadena + " AND ({tabla}.empresa = '{empresa}')".format(tabla=tablaActual, empresa=relacion.empresa)

		if relacion.cliente:
			cadena = cadena + " AND ({tabla}.cliente = '{cliente}')".format(tabla=tablaActual, cliente=relacion.cliente)

		if relacion.area:
			cadena = cadena + " AND ({tabla}.area = '{area}')".format(tabla=tablaActual, area=relacion.area)

		if relacion.unidad_medica:
			cadena = cadena + " AND ({tabla}.unidad_medica = '{unidad_medica}')".format(tabla=tablaActual, unidad_medica=relacion.unidad_medica)
	else:
		if relacion.empresa:
			cadena = cadena + " AND ({tabla}.empresa = '{empresa}')".format(tabla=tablaActual, empresa=relacion.empresa)
		else:
			return cadenaInvalida

		if relacion.cliente:
			cadena = cadena + " AND ({tabla}.cliente = '{cliente}')".format(tabla=tablaActual, cliente=relacion.cliente)
		else:
			return cadenaInvalida

		if relacion.area:
			cadena = cadena + " AND ({tabla}.area = '{area}')".format(tabla=tablaActual, area=relacion.area)
		else:
			return cadenaInvalida

		if relacion.unidad_medica:
			cadena = cadena + " AND ({tabla}.unidad_medica = '{unidad_medica}')".format(tabla=tablaActual, unidad_medica=relacion.unidad_medica)
		else:
			return cadenaInvalida
				
	# cadena = cadena + " AND ({tabla}.cliente IN (SELECT name FROM 'tabCliente' WHERE empresa = '{empresa}')".format(tabla=tablaActual, empresa=relacion.empresa)

	return cadena
    #return "(tabevent.event_type='public' or tabevent.owner='{user}'".format(user=frappe.session.user)
