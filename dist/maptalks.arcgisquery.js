/*!
 * maptalks.arcgisquery v1.0.3
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks));
}(this, (function (exports,maptalks) { 'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/*let parseFilter = function (filter) {
    let xml = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:And>';
    if (filter.PropertyName) {
        xml += ' <ogc:PropertyIsEqualTo><ogc:PropertyName>' + filter.PropertyName[0] + '</ogc:PropertyName><ogc:Literal>' + filter.PropertyName[1] + '</ogc:Literal></ogc:PropertyIsEqualTo>';
    }
    if (filter.Spatial) {
        xml += '<ogc:Intersects><ogc:PropertyName/><gml:' + filter.Spatial.geoType + 'xmlns:gml="http://www.opengis.net/gml" srsName="' +
          filter.Spatial.srsName + '">' +
          '<gml:coordinates decimal="." cs="," ts=" ">' + filter.Point + '</gml:coordinates></gml:' + filter.Spatial.geoType + '></ogc:Intersects></ogc:And></ogc:Filter>';
    }
    return xml;
};*/

var parseQueryString = function parseQueryString(option) {
    var queryString = 'wfs?VERSION=1.0.0&REQUEST=GetFeature&SERVICE=WFS';
    var condition = {
        TYPENAME: option.TYPENAME,
        FILTER: option.FILTER || ''
    };
    for (var p in condition) {
        queryString += '&' + p + '=' + encodeURIComponent(condition[p]);
    }
    queryString += '&RESULTTYPE=result';
    return queryString;
};

var QueryTask = function (_maptalks$Class) {
    _inherits(QueryTask, _maptalks$Class);

    function QueryTask(serverUrl, option) {
        _classCallCheck(this, QueryTask);

        var _this = _possibleConstructorReturn(this, _maptalks$Class.call(this));

        _this.serverUrl = serverUrl || '';
        _this.option = option || {};
        _this.excute = function (callback) {
            if (!this.validUrl(this.serverUrl)) return;
            var _url = this.checkUrl(this.serverUrl);
            var proxyUrl = this.option.proxy || '../proxy/proxy.ashx';
            var requestUrl = proxyUrl;
            var filter = parseQueryString(this.option);
            maptalks.Ajax.post({
                url: requestUrl
            }, 'url=' + encodeURIComponent(_url) + '&filter=' + filter, function (err, res) {
                if (err) return;
                var _result = null;
                try {
                    _result = maptalks.Util.parseJSON(res);
                } catch (ex) {
                    callback(res);
                    return;
                }
                callback(_result);
            });
        };
        return _this;
    }

    QueryTask.prototype.validUrl = function validUrl(url) {
        if (!url) return false;
        if (typeof url != 'string') return false;
        if (url.indexOf('http://')) return false;
        return true;
    };

    QueryTask.prototype.checkUrl = function checkUrl(url) {
        if (typeof url === 'string') {
            if (url.indexOf('/', url.length - 1) > 0) return url;else if (url.indexOf('/', url.length - 1) < 0) return url + '/';
        }
        return url;
    };

    return QueryTask;
}(maptalks.Class);

exports.QueryTask = QueryTask;

Object.defineProperty(exports, '__esModule', { value: true });

})));
