import * as maptalks from 'maptalks';

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

const parseQueryString = function (option) {
    let queryString = 'wfs?VERSION=1.0.0&REQUEST=GetFeature&SERVICE=WFS';
    const condition = {
        TYPENAME: option.TYPENAME,
        FILTER:option.FILTER || ''
    };
    for (const p in condition) {
        if (p) {
            queryString += '&' + p + '=' + encodeURIComponent(condition[p]);
        }
    }
    queryString += '&RESULTTYPE=result';
    return queryString;
};

export class QueryTask extends maptalks.Class {
    constructor(serverUrl, option) {
        super();
        this.serverUrl = serverUrl || '';
        this.option = option || {};
        this.excute = function (callback) {
            if (!this.validUrl(this.serverUrl)) return;
            const _url = this.checkUrl(this.serverUrl);
            const proxyUrl = this.option.proxy || '../proxy/proxy.ashx';
            const requestUrl = proxyUrl;
            const filter = parseQueryString(this.option);
            maptalks.Ajax.post({
                url: requestUrl
            }, 'url=' + encodeURIComponent(_url) + '&filter=' +  filter, function (err, res) {
                if (err) return;
                let _result = null;
                try {
                    _result = maptalks.Util.parseJSON(res);
                } catch (ex) {
                    callback(res);
                    return;
                }
                callback(_result);
            });
        };
    }
    validUrl(url) {
        if (!url) return false;
        if (typeof url != 'string') return false;
        if (url.indexOf('http://')) return false;
        return true;
    }
    checkUrl(url) {
        if (typeof url === 'string') {
            if (url.indexOf('/', url.length - 1) > 0)
                return url;
            else if (url.indexOf('/', url.length - 1) < 0)
                return url + '/';
        }
        return url;
    }
}
