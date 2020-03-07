odoo.define("pos_message.message", function (require) {
    "use strict";
    let rpc = require('web.rpc');
    let chrome = require('point_of_sale.chrome');
    // let models = require('point_of_sale.models');
    let screens = require('point_of_sale.screens');

    // Model check data
    // Không cần thiết phải khai báo load model vì message không cần phải load cùng hệ thống
    // models.load_models({
    //     model: 'pos.message',
    //     fields: ['name', 'message'],
    //     domain: function (self) {
    //         return [['pos_message_line_ids.pos_config_id', '=', self.config.id]]
    //     }, loaded: function (self, messages) {
    //         if (messages.length > 0) {
    //             self.message = messages[0];
    //         }
    //     }
    // });
    //
    // let _super_posmodel = models.PosModel.prototype;
    // models.PosModel = models.PosModel.extend({
    //     initialize: function (session, attributes) {
    //         this.message = null;
    //         return _super_posmodel.initialize.call(this, session, attributes);
    //     },
    //     // check_message: function () {
    //     //
    //     // }
    // });
    screens.ReceiptScreenWidget.include({
        // When user click Next order in receipt screen
        get_message_receipt: async function () {
            // let domain = [['id', '=', message_id]];
            let self = this;
            let time_now = moment().format('YYYY-MM-DDTHH:mm:ss');
            let domain = [['pos_message_line_ids.pos_config_id', '=', self.pos.config.id],
                ['message_time', '<', time_now],
                ['pos_message_line_ids.is_read', '=', false]];
            let fields = ['name', 'message'];
            return await rpc.query({
                model: 'pos.message',
                method: 'search_read',
                args: [domain, fields],
                limit: 1,
            });
        },
        confirm_message_receipt: async function (message_id, pos_config_id) {
            return await rpc.query({
                model: 'pos.message.line',
                method: 'create_from_ui',
                args: [{'is_read': true, 'message_id': message_id, 'pos_config_id': pos_config_id}],
            });
        },
        click_next: async function () {
            let self = this;
            let message = await self.get_message_receipt();
            if (message.length > 0) {
                self.gui.show_popup('confirm', {
                    'title': message[0].name,
                    'body': message[0].message,
                    'confirm': async function () {
                        let ok = await self.confirm_message_receipt(message[0].id, self.pos.config.id);
                        if (ok) {
                            window.location.reload();
                        } else {
                            self.pos.get_order().finalize();
                        }
                    },
                    'cancel': function () {
                        self.pos.get_order().finalize();
                    }
                });
            } else {
                self.pos.get_order().finalize();
            }
        }
    });
    //HOOK chrome
    chrome.OrderSelectorWidget.include({
        get_message: async function () {
            // let domain = [['id', '=', message_id]];
            let self = this;
            let time_now = moment().format('YYYY-MM-DDTHH:mm:ss');
            let domain = [['pos_message_line_ids.pos_config_id', '=', self.pos.config.id],
                ['message_time', '<', time_now],
                ['pos_message_line_ids.is_read', '=', false]];
            let fields = ['name', 'message'];
            return await rpc.query({
                model: 'pos.message',
                method: 'search_read',
                args: [domain, fields],
                limit: 1,
            });
        },
        confirm_message: async function (message_id, pos_config_id) {
            return await rpc.query({
                model: 'pos.message.line',
                method: 'create_from_ui',
                args: [{'is_read': true, 'message_id': message_id, 'pos_config_id': pos_config_id}],
            });
        },
        show_message_handler: async function (is_neworder = false) {
            let self = this;
            let message = await self.get_message();
            if (message.length > 0) {
                self.gui.show_popup('confirm', {
                    'title': message[0].name,
                    'body': message[0].message,
                    'confirm': async function () {
                        let ok = await self.confirm_message(message[0].id, self.pos.config.id);
                        if (ok) {
                            window.location.reload();
                        } else {
                            self.pod_order_action(is_neworder);
                        }
                    },
                    'cancel': function () {
                        self.pod_order_action(is_neworder);
                    }
                });
            } else {
                self.pod_order_action(is_neworder);
            }
        },
        pod_order_action: function (is_neworder = false) {
            let self = this;
            if (is_neworder) {
                self.pos.add_new_order();
            } else {
                self.pos_delete_order_old()
            }
        },
        pos_delete_order_old: function (event, $el) {
            let order = this.pos.get_order();
            let self = this;
            if (!order) {
                return;
            } else if (!order.is_empty()) {
                this.gui.show_popup('confirm', {
                    'title': _t('Destroy Current Order ?'),
                    'body': _t('You will lose any data associated with the current order'),
                    confirm: function () {
                        self.pos.delete_current_order();
                    },
                });
            } else {
                self.pos.delete_current_order();
            }
        },
        neworder_click_handler: async function (event, $el) {
            //CHECK MESSAGE HERE....!
            let self = this;
            //Check message
            await self.show_message_handler(true);
            //Continue old code
        },
        deleteorder_click_handler: async function (event, $el) {
            let self = this;
            //Check message
            await self.show_message_handler();
        }
    })
    ;
})
;