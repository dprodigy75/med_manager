# -*- coding: utf-8 -*-
# Copyright (c) 2020, Brandmand and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

from frappe.model.document import Document


class Contrato(Document):

	def validate(self):
		self.validate_dates()
		# self.validate_item()

	def before_save(self):
		pass
		#self.validate_dates()
		#frappe.throw(_("Valid From Date must be lesser than Valid Upto Date."))
	# def validate_item(self):
	# 	if not frappe.db.exists("Item", self.item_code):
	# 		frappe.throw(_("Item {0} not found").format(self.item_code))

	def validate_dates(self):
		if self.fecha_inicial and self.fecha_final:
			if self.fecha_inicial > self.fecha_final:
				frappe.throw("La fecha de inicio debe ser menor a la fecha del final del contrato. Test")


