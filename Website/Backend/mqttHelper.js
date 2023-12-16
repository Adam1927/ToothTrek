var mqtt = require('mqtt');
const protocol = 'tcp'
const host = 'broker.hivemq.com'
const mqttPort = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${mqttPort}`

const QOS = 1
const mqttClient = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})
mqttClient.on('connect', () => {
    console.log(`Connected to mqtt server with url ${connectUrl}`)
})
mqttClient.on('error', (err) => {
    print(err)
})
mqttClient.handleRequest = function(req, res, requestTopic, uid,body) {
    try {
        const responseTopic = `${requestTopic}/${uid}`;
        this.subscribe(responseTopic);
        var publishJson;
        console.log("the response topic is: " + responseTopic);
        if(body){
            publishJson = JSON.stringify({ "responseTopic": responseTopic, ...body });        }
        else{
            publishJson = JSON.stringify({ "responseTopic": responseTopic });
        }
        this.publish(requestTopic, publishJson);
        const timeout = setTimeout(() => {
            this.unsubscribe(responseTopic);
            return res.status(500).json({ error: 'Request timed out' });
        }, 50000);//CHANGE BACK TO 10 SEC

        this.once('message', (topic, message) => {
            if (topic === responseTopic) {
                clearTimeout(timeout);
                this.unsubscribe(responseTopic);
                return res.json(JSON.parse(message.toString()));

            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = mqttClient;

module.exports = mqttClient;