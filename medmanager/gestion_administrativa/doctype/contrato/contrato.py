# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

from frappe.model.document import Document

from medmanager.gestion_administrativa.doctype.relacion_usuario.relacion_usuario import get_permission_query_conditions_Empresa

""" frappe.datetime.add_days(date, days);   // add n days to a date
frappe.datetime.add_months(date, months); // add n months to a date
frappe.datetime.month_end(date);  // returns the first day from the month of the given date
frappe.datetime.month_start(date); // returns the last day from the month of the given date
frappe.datetime.get_day_diff(begin, end); // returns the days between 2 dates """

class Contrato(Document):

	def validate(self):
		self.validate_fechas()
		# self.validate_item()

	def before_save(self):
		pass
		#self.validate_dates()
		#frappe.throw(_("Valid From Date must be lesser than Valid Upto Date."))
	# def validate_item(self):
	# 	if not frappe.db.exists("Item", self.item_code):
	# 		frappe.throw(_("Item {0} not found").format(self.item_code))

	def validate_vigencia(self):
		return frappe.datetime.now() > self.fecha_final

	def validate_fechas(self):
		if self.fecha_inicial and self.fecha_final:
			if self.fecha_inicial > self.fecha_final:
				frappe.throw("La fecha de inicio debe ser menor a la fecha del final del contrato")

	
@frappe.whitelist()
def get_permission_query_conditions(user):
	return get_permission_query_conditions_Empresa(user, "`tabContrato`")
