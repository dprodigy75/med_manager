# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

from medmanager.gestion_administrativa.doctype.relacion_usuario.relacion_usuario import get_permission_query_conditions_Empresa

class Cliente(Document):
	pass


@frappe.whitelist()
def get_permission_query_conditions(user):
	return get_permission_query_conditions_Empresa(user, "`tabCliente`")