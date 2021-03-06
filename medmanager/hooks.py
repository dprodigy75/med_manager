# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "medmanager"
app_title = "Medical Manager"
app_publisher = "Brandmand"
app_description = "Handle and distribution management of medical resources"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "medmanager.info@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "/assets/medmanager/css/medmanager.css"
app_include_js = "/assets/medmanager/js/medmanager.js"

# include js, css files in header of web template
# web_include_css = "/assets/medmanager/css/medmanager.css"
# web_include_js = "/assets/medmanager/js/medmanager.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "medmanager.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "medmanager.install.before_install"
# after_install = "medmanager.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "medmanager.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

permission_query_conditions = {
	"Almacen": "medmanager.inventario.doctype.almacen.almacen.get_permission_query_conditions",
	"Cliente": "medmanager.gestion_administrativa.doctype.cliente.cliente.get_permission_query_conditions",
	"Contrato": "medmanager.gestion_administrativa.doctype.contrato.contrato.get_permission_query_conditions",
	"Contrato SIO": "medmanager.gestion_administrativa.doctype.contrato_sio.contrato_sio.get_permission_query_conditions",
	"Contrato SIA": "medmanager.gestion_administrativa.doctype.contrato_sia.contrato_sia.get_permission_query_conditions",
}
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"medmanager.tasks.all"
# 	],
# 	"daily": [
# 		"medmanager.tasks.daily"
# 	],
# 	"hourly": [
# 		"medmanager.tasks.hourly"
# 	],
# 	"weekly": [
# 		"medmanager.tasks.weekly"
# 	]
# 	"monthly": [
# 		"medmanager.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "medmanager.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "medmanager.event.get_events"
# }

