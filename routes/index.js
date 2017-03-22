var Debug = require('debug');
var Webhooks = require('../lib/webhooks.js');
var Stripe = require('stripe');
var webHookModel = require('../models/webHook');
	
// Main function for responding to webhook
exports.webhookHandler = function (config) {

	var stripe = Stripe(config.stripe.secret_key);
	var debug = Debug('webhook-handler');
	var webhooks = Webhooks(config);
	var recordEvent = function(data, res) {
		var newRecord = new webHookModel({
			sender: 'Stripe',
			type: data.type,
			event: JSON.stringify(data)
		});

		newRecord.save(function(err, rec) {
			if (err) {
				console.log('recording event failure');
				return res.status(500).send({ message: 'INTERNAL_ERROR' });
			} else {
				console.log('recording event success');
				return res.status(200).send({ success: true, message: 'OK' });
			}
		});
	};
	
	return function middleware(req, res, next) {
		
		var api_data;

		if(req.body.type)
		{
			api_data = req.body;
		}
		else if(req.query.type) 
		{
			api_data = req.query;
		}
		else{
			debug('missing data. body:', req.body, 'query:', req.query);
			setTimeout(function () {
				res.send(400, { error: 'Missing body'});
			}, 500);
			return;
		}
		
		// confirm that stripe was real
		
		if (api_data.id !== 'evt_00000000000000') {
			stripe.events.retrieve(api_data.id, function(err, evt){
				if(err || !evt)
				{
					debug(
						'FAIL event confirmation',
						api_data.type,
						JSON.stringify(api_data),
						err.toString()
					);
						return res.send(500, { message: 'INTERNAL_ERROR' });
				} else {
					debug('event confirmed recording', api_data.id);
					return recordEvent(api_data, res);
					
				}
			});
		} else {
				debug('test event. no confirmation needed. recording', api_data.id);
				return recordEvent(api_data, res);
		}
	};
};

