const AWS = require('aws-sdk');
const XLSX = require('xlsx');

const S3 = new AWS.S3(
    {
        region: 'us-east-1',
        accessKeyId: "AKIAJWUVSWPNR5C4ANSA",
        secretAccessKey: "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",
    });


class S3Client {

    constructor(){}

    static getObject(bucketName, fileName) {
        // this.init();
        // this.getObjectAndParseIt(bucketName, fileName);

        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        return S3.getObject(params).promise()
            .then( data => {
                const workbook = XLSX.read(data.Body);
                const sheetNameList = workbook.SheetNames;
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
                return json;
            });
    }
}

module.exports = S3Client;