const async = require('async');
const fs = require('fs');
const request = require('request');

const host = 'updates.jenkins-ci.org';
const url = `https://${host}/current/update-center.json`;
/* eslint-disable no-console */ //This is because we are using console log for communications

module.exports = createPluginDb = (destination, cb) => {
    var local = {};
    if(!destination) {
        console.error('we need a destination dir');
        process.exit('1');
    }
    async.series([
        (callback) => {
            request(`${url}?date=${Math.round(100000 * Math.random())}`, (error, response, body) => {
                local.body = body;
                callback(error);
            });
        },
        (callback) => {
            if (local.body) {
                const lines = local.body.split('\n');
                if (lines.length >= 1) {
                    lines.shift();
                    lines.pop();
                    const plugins = JSON.parse(lines.join('')).plugins;
                    fs.writeFile(destination, JSON.stringify(plugins), (err) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('The file was saved!', destination);
                        callback();
                    });
                } else {
                    callback(`The result was not as we expected, please check the url ${url}`);
                }
            } else {
                callback();
            }

        }
    ], (err) => {
    if (err){
        cb(err);
    } else {
        cb();
    }
  });
};
