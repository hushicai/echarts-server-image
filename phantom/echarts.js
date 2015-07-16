/**
 * @file phantom
 * @author hushicai(bluthcy@gmail.com)
 */

var phantom = require('phantom');
var path = require('path');

var url = 'file://' + path.resolve(__dirname, '../www/echarts.html');
var outfile = path.resolve(__dirname, '../output/echarts.png');

var phantomInstance = null;
var pageInstance = null;

phantom.create(function (ph) {
    phantomInstance = ph;
    phantomInstance.createPage(cb);
});

function cb(page) {
    pageInstance = page;
    pageInstance.open(url, pageOnLoadFinished);
}

function pageOnLoadFinished(status) {
    if (status !== 'success') {
        phantomInstance.exit();
        return;
    }
    pageInstance.evaluate(function () {
        /* global ec */
        return ec.getDataURL('png');
        // return window.dataURL;
    }, onPageEvaluate);
}

function onPageEvaluate(data) {
    data = data.replace(/^data:image\/png;base64,/, '');
    var dataBuffer = new Buffer(data, 'base64');
    require('fs').writeFileSync(outfile, dataBuffer, 'base64');
    console.log('saved to `%s`', outfile);
    phantomInstance.exit();
}
