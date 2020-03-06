# -*- coding: utf-8 -*-
from odoo import api, models, fields, _


class PosMessageLine(models.Model):
    _name = 'pos.message.line'
    _description = _('POS Message Line')

    is_read = fields.Boolean(string=_('Read'))
    pos_config_id = fields.Many2one(
        'pos.config',
        string=_('POS'))
    pos_message_id = fields.Many2one(
        'pos.message',
        string=_('Message'))
