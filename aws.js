const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    accessKeyId: 'AKIA6DYM2VQLHDHB6MUW',
    secretAccessKey: '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',
    region: 'ap-southeast-2',
    apiVersion: '2012-11-05',
});

const writeMessageToQueue = async (message) => {
    const paramsSendMessage = {
        MessageBody: JSON.stringify({
            type: 'event-menu-status',
            message
        }),
        QueueUrl: 'https://sqs.ap-southeast-2.amazonaws.com/970152651798/MyNodeQueue',
    }
    await sqs.sendMessage(paramsSendMessage).promise();
}

module.exports = {
    writeMessageToQueue
}