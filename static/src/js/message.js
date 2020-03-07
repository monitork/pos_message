odoo.define("pos_message.message", function (require) {
    "use strict";
    let rpc = require('web.rpc');
    let chrome = require('point_of_sale.chrome');

    // Model check data
    // Không cần thiết phải khai báo load model vì message không cần phải load cùng hệ thống
    // models.load_models({
    //     model: 'pos.message',
    //     fields: ['name', 'message'],
    //     domain: function (self) {
    //         return [{'pos_message_line_ids': ['pos_config_id', '=', self.config.id]}]
    //     }
    // });


    //HOOK chrome
    chrome.OrderSelectorWidget.include({
        check_message: async function () {
            let self = this;
            let time_now = moment().format('YYYY-MM-DDTHH:mm:ss');
            let domain = [['pos_config_id', '=', self.pos.config.id], ['is_read', '=', false], ['pos_message_id.message_time', '<', time_now]];
            let fields = ['pos_message_id'];
            return await rpc.query({
                model: 'pos.message.line',
                method: 'search_read',
                args: [domain, fields],
                limit: 1,
            });
        },
        get_message: async function (message_id) {
            let domain = [['id', '=', message_id]];
            let fields = ['name', 'message'];
            return await rpc.query({
                model: 'pos.message',
                method: 'search_read',
                args: [domain, fields],
                limit: 1,
            });
        },
        confirm_message: async function (message_line_id) {
            return await rpc.query({
                model: 'pos.message.line',
                method: 'create_from_ui',
                args: [{'is_read': true, 'id': message_line_id}],
            });
        },
        show_message_handler: async function () {
            let self = this;
            let message_line = await self.check_message();
            if (message_line.length > 0) {
                let message = await self.get_message(message_line[0].pos_message_id[0]);
                if (message.length > 0) {
                    this.gui.show_popup('confirm', {
                        'title': message[0].name,
                        'body': message[0].message,
                        'confirm': async function () {
                            await self.confirm_message(message_line[0].id);
                        }
                    });
                }
            }
        },
        neworder_click_handler: async function (event, $el) {
            //CHECK MESSAGE HERE....!
            let self = this;
            //Check message
            await self.show_message_handler();
            //Continue old code
            self.pos.add_new_order();
        },
        deleteorder_click_handler: async function () {
            let self = this;
            //Check message
            await this.show_message_handler();
            //Continue old code
            let order = this.pos.get_order();
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
        }
    });
});