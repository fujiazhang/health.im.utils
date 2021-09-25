"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Net = /** @class */ (function () {
    function Net(options) {
        this.getToken = options.getToken;
        this.prefix = options.prefix || '/api';
    }
    Net.prototype.fetch = function (request) {
        var url = request.url, props = __rest(request, ["url"]);
        var token = this.getToken();
        return fetch("" + this.prefix + url, __assign({ headers: {
                Authorization: "Bearer " + token
            } }, props));
    };
    return Net;
}());
exports.default = Net;
//# sourceMappingURL=net.js.map