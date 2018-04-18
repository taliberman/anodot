const S3Client = require('./s3/s3');

const express = require('express');
const bodyParser = require('body-parser');

const server = express();

server.use(bodyParser.json());

const port = 1234;

server.get('/', (req, res) => {

    S3Client.getObject('msbit.anodot','anodot_table.xlsx')
        .then( rows => {
            res.send(rows);
        });
});

server.post('/csv', (req, res) => {
    const fields = req.body.fields;
    const filters = req.body.filters;

    S3Client.getObject('msbit.anodot','anodot_table.xlsx')
        .then( rows => {

            let newRows = filterRows(rows, filters);
            newRows = removeColumns(newRows, fields);

            res.send(newRows);
        });
});

removeColumns = ( rows, fields ) => {

    if (!fields || !Array.isArray(fields))
        return rows;

    return rows.map(row => {
        const newRow = {};

        fields.forEach( field => {
            newRow[field]  = row[field];
        });

        return newRow;
    });
};

filterRows = ( rows, filters ) => {

    if (!filters || !Array.isArray(filters) || filters.length == 0){
        return rows;
    }

    let filteredRows = [];

    rows.forEach( row => {
        let removeRow = false;
        filters.forEach(filter => {

            if (removeRow)
                return;

            if ( !row[filter.key] || row[filter.key] !== filter.value ){
                removeRow = true;
            }
        });

        if (!removeRow){
            filteredRows.push(row);
        }
    });

    return filteredRows;
};

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});