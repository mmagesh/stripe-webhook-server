var Schema=mongoose.Schema;

var webHookModel = new Schema({
    sender:'String',
    type:'String',
    event:'String',
    event_dt:{ type: Date, default: Date.now },
});

module.exports=mongoose.model('webhook', webHookModel, 'webhook');
