# -*- coding: utf-8 -*-
from odoo import api, models, fields, _


class PosMessage(models.Model):
    _name = 'pos.message'
    _description = _('POS Message')

    name = fields.Char(string=_("Title"), required=True)
    message = fields.Text(string=_("Message"), required=True)
    message_time = fields.Datetime(
        string=_('Start Time'),
        default=fields.Datetime.now())
    pos_message_line_ids = fields.One2many(
        'pos.message.line',
        'pos_message_id',
        string=_('Pos'))
