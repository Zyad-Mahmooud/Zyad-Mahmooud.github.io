var Gradient = {};
Gradient = function (e) {
    var t = {};

    function r(a) {
        if (t[a]) return t[a].exports;
        var n = t[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        return e[a].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = t, r.d = function (e, t, a) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: a
        })
    }, r.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, r.t = function (e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var a = Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var n in e) r.d(a, n, function (t) {
                return e[t]
            }.bind(null, n));
        return a
    }, r.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 0)
}([function (e, t) {
    e.exports.parse = function (e, t) {
        let r = /.*gradient\s*\(((?:\([^)]*\)|[^)(]*)*)\)/.exec(e);
        const a = /#[0-9a-fA-F]{3,6}|(rgb|rgba|hsl|hsla) ?\([ 0-9.%,]+?\)|([Aa]lice[Bb]lue|[Aa]ntique[Ww]hite|[Aa]qua(marine)?|[Aa]zure|[Bb]eige|[Bb]isque|[Bb]lack|[Bb]lanched[Aa]lmond|[Bb]lue([Vv]iolet)?|[Bb]rown|[Bb]urly[Ww]ood|[Cc]adet[Bb]lue|[Cc]hartreuse|[Cc]hocolate|[Cc]oral|[Cc]ornflower[Bb]lue|[Cc]ornsilk|[Cc]rimson|[Cc]yan|[Dd]ark([Bb]lue|[Cc]yan|[Gg]olden[Rr]od|[Gg]ray|[Gg]rey|[Gg]reen|[Kk]haki|[Mm]agenta|[Oo]live[Gg]reen|[Oo]range|[Oo]rchid|[Rr]ed|[Ss]almon|[Ss]ea[Gg]reen|[Ss]late[Bb]lue|[Ss]late[Gg]ray|[Ss]late[Gg]rey|[Tt]urquoise|[Vv]iolet)?|[Dd]eep([Pp]ink|[Ss]ky[Bb]lue)?|[Dd]im([Gg]ray|[Gg]rey)?|[Dd]odger[Bb]lue|[Ff]ire[Bb]rick|[Ff]loral[Ww]hite|[Ff]orest[Gg]reen|[Ff]uchsia|[Gg]ainsboro|[Gg]host[Ww]hite|[Gg]old(en[Rr]od)?|[Gg]ray|[Gg]rey|[Gg]reen([Yy]ellow)?|[Hh]oney[Dd]ew|[Hh]ot[Pp]ink|[Ii]ndian[Rr]ed|[Ii]ndigo|[Ii]vory|[Kk]haki|[Ll]avender([Bb]lush)?|[Ll]awn[Gg]reen|[Ll]emon[Cc]hiffon|[Ll]ight([Bb]lue|[Cc]oral|[Cc]yan|[Gg]olden[Rr]od[Yy]ellow|[Gg]ray|[Gg]rey|[Gg]reen|[Pp]ink|[Ss]almon|[Ss]ea[Gg]reen|[Ss]ky[Bb]lue|[Ss]late[Gg]ray|[Ss]late[Gg]rey|[Ss]teel[Bb]lue|[Yy]ellow)?|[Ll]ime([Gg]reen)?|[Ll]inen|[Mm]agenta|[Mm]aroon|[Mm]edium([Aa]qua[Mm]arine|[Bb]lue|[Oo]rchid|[Pp]urple|[Ss]ea[Gg]reen|[Ss]late[Bb]lue|[Ss]pring[Gg]reen|[Tt]urquoise|[Vv]iolet[Rr]ed)?|[Mm]idnight[Bb]lue|[Mm]int[Cc]ream|[Mm]isty[Rr]ose|[Mm]occasin|[Nn]avajo[Ww]hite|[Nn]avy|[Oo]ld[Ll]ace|[Oo]live([Dd]rab)?|[Oo]range([Rr]ed)?|[Oo]rchid|[Pp]ale[Gg]olden[Rr]od|[Pp]ale([Gg]reen|[Tt]urquoise|[Vv]iolet[Rr]ed)?|[Pp]apaya[Ww]hip|[Pp]each[Pp]uff|[Pp]eru|[Pp]ink|[Pp]lum|[Pp]owder[Bb]lue|[Pp]urple|[Rr]ebecca[Pp]urple|[Rr]ed|[Rr]osy[Bb]rown|[Rr]oyal[Bb]lue|[Ss]addle[Bb]rown|[Ss]almon|[Ss]andy[Bb]rown|[Ss]ea([Gg]reen|[Ss]hell)?|[Ss]ienna|[Ss]ilver|[Ss]ky[Bb]lue|[Ss]late([Bb]lue|[Gg]ray|[Gg]rey)?|[Ss]now|[Ss]pring[Gg]reen|[Ss]teel[Bb]lue|[Tt]an|[Tt]eal|[Tt]histle|[Tt]omato|[Tt]urquoise|[Vv]iolet|[Ww]heat|[Ww]hite([Ss]moke)?|[Yy]ellow([Gg]reen)?)/,
            n = new RegExp(a.source, "g"),
            o = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/g,
            l = new RegExp(`(${a.source})|${/((?:\d*\.)?\d+(px|%|em|deg|turn|rad|grad)?)/.source}`, "g");
        let i = "N/A";
        const c = /(deg|turn|rad|grad)/g,
            s = /(to (left( top| bottom)|right( top| bottom)|top( right| left)?|bottom( right| left)?)?)/g,
            u = /(ellipse|circle)/g,
            g = /(farthest-(corner|side)?|closest-(corner|side)?)/g,
            h = e.match(/((repeating-)?conic-gradient|(repeating-)?linear-gradient|(repeating-)?radial-gradient)/g)[0],
            f = h.includes("conic");
        r = r[1].match(/(?:[^)(,]+|\([^)(]+\))+/g);
        for (let e = 0; e < r.length; e++) r[e] = r[e].trim();
        const p = function () {
                return !!r[0].match(n)
            },
            d = p();
        p() || (i = r[0], r.shift());
        const m = function (e) {
                return e.match(/rad/) ? parseFloat(e) * (180 / Math.PI) : e.match(/turn/) ? 360 * parseFloat(e) : e.match(/grad/) ? parseFloat(e) / 400 * 360 : e
            },
            b = f ? "deg" : "%",
            y = `0${b}`,
            G = f ? "360deg" : "100%";
        let S = [];
        for (let e = 0; e < r.length; e++) {
            const t = r[e].match(l);
            3 === t.length ? (S.push(`${t[0]} ${t[1]}`), S.push(`${t[0]} ${t[2]}`)) : S.push(r[e])
        }
        let k = [];
        for (let e = 0; e < S.length; e++) {
            const t = S[e].match(l),
                r = t[0],
                a = t[1];
            k[e] = a ? [r, f ? `${m(a)}deg` : a] : [r, 0 === e ? y : e === S.length - 1 ? G : null]
        }
        const B = [];
        let w = !1;
        for (let e = 0; e < k.length; e++) {
            const t = !k[e][1];
            t && !w && (B.push([e]), w = !0), !t && w && (B[B.length - 1].push(e - 1), w = !1)
        }
        for (let e = 0; e < B.length; e++) {
            const t = B[e][0],
                r = B[e][1],
                a = parseFloat(k[t - 1][1]),
                n = r - t + 2,
                o = (parseFloat(k[r + 1][1]) - a) / n;
            let l = a;
            for (let e = 0; e < n; e++) {
                l += o;
                const r = +l.toFixed(2);
                k[t + e][1] = `${r}${b}`
            }
        }
        const P = {
            type: h,
            stops: k,
            gradientDefinition: i,
            firstParameterIsColor: d,
            position: function (e) {
                let t, r, a = e,
                    n = null;
                if (a.match(/(at)/g)) {
                    a = a.slice(a.indexOf("at"), a.length), a = a.replace("at ", "");
                    const e = a.split(" ");
                    if (4 === e.length) t = "left" === e[0] ? e[1] : `calc(100% - ${e[1]})`, r = "top" === e[2] ? e[3] : `calc(100% - ${e[3]})`;
                    else if (1 === e.length || 2 === e.length) switch (a) {
                    case "center":
                        t = "50%", r = "50%";
                        break;
                    case "right top":
                    case "top right":
                        t = "100%", r = "0%";
                        break;
                    case "left top":
                    case "top left":
                        t = "0%", r = "0%";
                        break;
                    case "right bottom":
                    case "bottom right":
                        t = "100%", r = "100%";
                        break;
                    case "left bottom":
                    case "bottom left":
                        t = "0%", r = "100%";
                        break;
                    case "top":
                    case "center top":
                    case "top center":
                        t = "50%", r = "0%";
                        break;
                    case "left":
                    case "center left":
                    case "left center":
                        t = "0%", r = "50%";
                        break;
                    case "right":
                    case "center right":
                    case "right center":
                        t = "100%", r = "50%";
                        break;
                    case "bottom":
                    case "center bottom":
                    case "bottom center":
                        t = "50%", r = "100%";
                        break;
                    default:
                        n = a.split(" "), t = n[0], r = n[1] || "50%"
                    }
                } else t = "50%", r = "50%";
                return {
                    x: t,
                    y: r
                }
            }(i),
            linearAngle: function (e) {
                let t = 0;
                if (!h.match(/(repeating-)?linear-gradient/)) return t;
                if (e.match(c)) t = parseInt(e, 10);
                else switch (function () {
                    const t = e.match(s);
                    return t && t[0]
                }()) {
                case "to top":
                    t = 0;
                    break;
                case "to bottom":
                    t = 180;
                    break;
                case "to left":
                    t = 270;
                    break;
                case "to right":
                    t = 90;
                    break;
                case "to right top":
                case "to top right":
                    t = 45;
                    break;
                case "to left top":
                case "to top left":
                    t = 315;
                    break;
                case "to right bottom":
                case "to bottom right":
                    t = 135;
                    break;
                case "to left bottom":
                case "to bottom left":
                    t = 225;
                    break;
                default:
                    t = 0
                }
                return t
            }(i),
            shape: function (e) {
                const t = e.match(u);
                return t ? t[0] : "ellipse"
            }(i),
            size: function (e) {
                if (!h.match(/(repeating-)?radial-gradient/)) return "farthest-corner";
                if (e.match(/(at)/g)) {
                    if ((e = (e = (e = e.split("at")[0]).replace(/ellipse |circle /g, "")).trim()).match(/ /g)) return e.split(" ");
                    if (e.match(o)) return e;
                    if (e.match(g)) return e.match(g)[0]
                } else {
                    if ((e = (e = e.replace(/ellipse |circle /g, "")).trim()).match(/ /g)) return e.split(" ");
                    if (e.match(o)) return e;
                    if (e.match(g)) return e.match(g)[0]
                }
                return "farthest-corner"
            }(i),
            conicAngle: function (e) {
                let t = 0;
                return e.match(/from (.*?) at/) ? t = m(e.match(/from (.*?) at/)[1]) : e.match(/from/) && (t = m(e.match(/from (.*)/)[1])), t
            }(i)
        };
        return t ? P : JSON.stringify(P, null, 2)
    }
}]);