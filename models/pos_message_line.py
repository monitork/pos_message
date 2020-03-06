# -*- coding: utf-8 -*-
from odoo import api, models, fields, _


class PosMessageLine(models.Model):
    _name = 'pos.message.line'
    _description = _('POS Message Line')

    is_read = fields.Boolean(string=_('Read'))
