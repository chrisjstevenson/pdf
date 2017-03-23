/*
 See https://github.com/oracle/node-oracledb/blob/master/examples/lobstream1.js
 for more information.
 This uses Promises instead of streams
*/
global.Promise = require('bluebird');
const config = require('./config.js');
const PdfDocument = require('pdfkit');
const gm = require('gm');
const oracledb = require('oracledb');
Promise.promisifyAll(oracledb);
const fs = require('fs');
const assert = require('assert');

const tmpFilePath = 'output/tmp';

oracledb.getConnection({
        user: config.database.dbUserName,
        password:config.database.dbPassword,
        connectString: config.database.connectionString
    })
    .then(connection => {
        return connection.execute(
            "SELECT SHP_LBL " +
            "FROM BBY_SHP_MFST_HDR " +
            "WHERE ROWNUM = 1"
        )
            .then(result => doStream(result.rows[0][0]))
            .catch(err => {
                console.error(err);
                return connection.close();
            });
    })
    .delay(500)
    .then(() => {

        fs.open(`${tmpFilePath}.gif`, 'r', (err, fd) => {
            assert.ok(!err);
        });

        // Convert to jpeg for pdfkit
        gm(`${tmpFilePath}.gif`)
            .write(`${tmpFilePath}.jpeg`, (err) => {
                if (err) return console.error(err);
            });

    })
    .delay(500)
    .then(() => {

        // Write the image to a pdf
        let doc = new PdfDocument();
        doc.pipe(fs.createWriteStream(`${tmpFilePath}.pdf`));
        doc.image(`${tmpFilePath}.jpeg`, 10, 10, { scale: 0.40 }); // adjust for scale, location,etc.
        doc.end();

        console.log(`* Wrote ${tmpFilePath}.pdf`);
    })
    .catch(err => {
        console.error(err);
    });


// Stream a LOB to a file
function doStream(lob) {
    let outFileName = 'output/tmp.gif';
    assert.ok(lob.type === oracledb.BLOB);

    lob.on('error', (err) => {
        throw new Error(err);
    });

    lob.on('close', () => {
        // nah
    });

    let outStream = fs.createWriteStream(outFileName);
    outStream.on('error', err => {
        console.error(err);
    });

    // Switch into flowing mode and push the LOB to the file
    lob.pipe(outStream);
}