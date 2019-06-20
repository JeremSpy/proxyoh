/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */

define("draw/Group", ["react", "react-class"], function (e, t) {
        var r = t({
            render: function () {
                var t = this.props.children,
                    r = this.props.canvas,
                    a = this.props.repaint || this.repaint;
                return t = e.Children.map(t, function (t) {
                    return e.cloneElement(t, {
                        canvas: r,
                        repaint: a
                    })
                }), e.createElement("div", {
                    style: {
                        position: "relative"
                    }
                }, t)
            },
            componentWillUpdate: function () {
                if ("function" !== this.props.repaint) {
                    this.r = !0;
                    var e = this.props.canvas;
                    if (null !== e) {
                        var t = e.getContext("2d");
                        t.fillStyle = "#fff", t.fillRect(0, 0, e.width, e.height)
                    }
                }
            },
            repaint: function () {
                "function" != typeof this.props.repaint ? this.forceUpdate() : this.props.repaint()
            }
        });
        return r.displayName = "Group", r.defaultProps = {}, r
    }), define("draw/Canvas", ["react", "react-class", "./Group"], function (e, t, r) {
        return t({
            getInitialState: function () {
                return {
                    canvas: null
                }
            },
            render: function () {
                return e.createElement("canvas", {
                    onClick: this.save.bind(this),
                    className: this.props.className,
                    width: this.props.width,
                    height: this.props.height,
                    ref: function (e) {
                        this.canvas = e
                    }.bind(this)
                }, e.createElement(r, {
                    canvas: this.state.canvas
                }, this.props.children))
            },
            save: function () {
                var e = "";
                null !== this.state.canvas && (e = this.state.canvas.toDataURL());
                var t = document.createElement("a");
                if (t.setAttribute("href", e), t.setAttribute("download", "Image.png"), document.createEvent) {
                    var r = document.createEvent("MouseEvent");
                    r.initEvent("click", !0, !0), t.dispatchEvent(r)
                } else t.click()
            },
            componentDidMount: function () {
                var e = this.canvas;
                delete this.canvas, this.setState({
                    canvas: e
                })
            }
        })
    }), define("draw/Text", ["react", "react-class"], function (e, t) {
        var r = t({
            render: function () {
                return e.createElement("div", {
                    style: this.props.style
                }, this.props.text)
            },
            componentDidMount: function () {
                this.draw()
            },
            componentDidUpdate: function () {
                this.draw()
            },
            draw: function () {
                var e = this.props.canvas;
                if (null !== e) {
                    var t = e.getContext("2d"),
                        r = JSON.parse(JSON.stringify(this.props.style));
                    t.save(), t.fillStyle = r.color || "black";
                    var a;
                    do {
                        this.setFont(t, r), a = this.createParagraphs(t, this.props.text, r.width);
                        var n = r.fontSize * a.reduce(function (e, t) {
                            return e + t.length
                        }, 0);
                        if (void 0 === r.height || n < r.height) break;
                        r.fontSize--
                    } while (r.fontSize > 0);
                    this.drawText(t, a, r.fontSize), t.restore()
                }
            },
            createParagraphs: function (e, t, r) {
                return t.split("\n").map(function (t) {
                    switch (this.props.style.whitespace) {
                        case "nowrap":
                            return [t];
                        default:
                            return this.wrapParagraph(e, t, r)
                    }
                }, this)
            },
            wrapParagraph: function (e, t, r) {
                for (var a = t.split(" ").filter(function (e) {
                        return e.length > 0
                    }), n = [], i = e.measureText(" ").width, l = {
                        width: -i,
                        words: []
                    }, o = 0; o < a.length; ++o) {
                    var s = a[o],
                        p = e.measureText(s).width;
                    l.width + p + i < r ? (l.width += p + i, l.words[l.words.length] = s) : (l.words.length > 0 && (n[n.length] = l.words.join(" ")), l = {
                        width: p,
                        words: [s]
                    })
                }
                return n[n.length] = l.words.join(" "), n
            },
            drawText: function (e, t, r) {
                e.save(), e.translate(this.props.style.left, this.props.style.top);
                for (var a = 0; a < t.length; ++a)
                    for (var n = t[a], i = 0; i < n.length; ++i) {
                        var l = n[i];
                        switch (e.translate(0, r), this.props.style.textAlign) {
                            default:
                                this.drawTextDefaultAligned(e, l);
                                break;
                            case "left":
                                this.drawTextLeftAligned(e, l);
                                break;
                            case "right":
                                this.drawTextRightAligned(e, l);
                                break;
                            case "center":
                                this.drawTextCentered(e, l);
                                break;
                            case "justify":
                                i !== n.length - 1 ? this.drawTextJustified(e, l) : this.drawTextDefaultAligned(e, l)
                        }
                    }
                e.restore()
            },
            drawTextDefaultAligned: function (e, t) {
                this.drawTextLeftAligned(e, t)
            },
            drawTextLeftAligned: function (e, t) {
                var r = e.measureText(t).width,
                    a = this.props.style.width || 0,
                    n = Math.min(a / Math.max(r, 1), 1);
                e.save(), e.scale(n, 1), e.fillText(t, 0, 0), e.restore()
            },
            drawTextRightAligned: function (e, t) {
                var r = e.measureText(t).width,
                    a = this.props.style.width || 0,
                    n = Math.min(a / Math.max(r, 1), 1);
                e.save(), e.translate(a - r * n, 0), e.scale(n, 1), e.fillText(t, 0, 0), e.restore()
            },
            drawTextCentered: function (e, t) {
                var r = e.measureText(t).width,
                    a = this.props.style.width || 0,
                    n = Math.min(a / Math.max(r, 1), 1);
                e.save(), e.translate(a / 2 - r * n / 2, 0), e.scale(n, 1), e.fillText(t, 0, 0), e.restore()
            },
            drawTextJustified: function (e, t) {
                for (var r = t.split(" "), a = e.measureText(" ").width, n = (this.props.style.width - e.measureText(t).width) / Math.max(1, r.length - 1), i = 0, l = 0; l < r.length; ++l) e.fillText(r[l], i, 0), i += e.measureText(r[l]).width + a + n
            },
            setFont: function (e, t) {
                e.font = [t.fontStyle, t.fontVariant, t.fontWeight, t.fontSize + "px", t.fontFamily].join(" ")
            }
        });
        return r.displayName = "Text", r.defaultProps = {
            repaint: function () {},
            canvas: null,
            text: "",
            width: void 0,
            style: {
                color: "black",
                fontFamily: ["serif"],
                fontVariant: "normal",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 400
            }
        }, r
    }), define("tcg/ygo/Rarities", [], function () {
        return {
            common: {
                name: "Commune",
                foil: void 0,
                color: void 0
            },
            rare: {
                name: "Rare",
                foil: void 0,
                color: "silver"
            },
            secret: {
                name: "Secret rare",
                foil: [
                    ["res", "tcg", "ygo", "foil"].join("/"), "Secret.png"
                ].join("/"),
                color: "silver"
            }
        }
    }), define("tcg/ygo/layout/component/CardName", ["react", "react-class", "draw/Text", "../../Rarities"], function (e, t, r, a) {
        var n = {
                regular: {
                    fontFamily: ["Matrix Regular Small Caps", "Spectral SC", "serif"],
                    fontSize: 32,
                    fontStyle: "normal",
                    fontWeight: 600,
                    textAlign: "left",
                    whitespace: "nowrap",
                    left: 32,
                    top: 24,
                    width: 315,
                    height: 48
                },
                skill: {
                    fontFamily: ["Heebo", "sans-serif"],
                    fontSize: 32,
                    fontStyle: "normal",
                    fontWeight: 500,
                    textAlign: "left",
                    whitespace: "nowrap",
                    left: 32,
                    top: 24,
                    width: 315,
                    height: 48
                }
            },
            i = {
                default: {
                    highlight: {
                        color: "transparent"
                    },
                    base: {
                        color: "#000"
                    }
                },
                white: {
                    highlight: {
                        color: "transparent"
                    },
                    base: {
                        color: "#FFF"
                    }
                },
                silver: {
                    highlight: {
                        color: "#FFF"
                    },
                    base: {
                        color: "#222"
                    }
                }
            },
            l = t({
                render: function () {
                    var t = (a[this.props.rarity] || {}).color || this.props.color,
                        l = n[this.props.type] || n.regular;
                    return e.createElement(e.Fragment, null, e.createElement(r, {
                        text: this.props.value,
                        style: Object.assign({}, l, (i[t] || i.default).highlight, {
                            top: l.top + 1
                        }),
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    }), e.createElement(r, {
                        text: this.props.value,
                        style: Object.assign({}, l, (i[t] || i.default).base),
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    }))
                }
            });
        return l.displayName = "CardName", l.defaultProps = {
            value: "",
            rarity: "common",
            type: "regular",
            color: "black"
        }, l
    }), define("tcg/ygo/Attributes", [], function () {
        var e = ["res", "tcg", "ygo", "attribute"].join("/");
        return {
            None: {
                url: void 0
            },
            Dark: {
                url: [e, "Dark.png"].join("/")
            },
            Divine: {
                url: [e, "Divine.png"].join("/")
            },
            Earth: {
                url: [e, "Earth.png"].join("/")
            },
            Fire: {
                url: [e, "Fire.png"].join("/")
            },
            Light: {
                url: [e, "Light.png"].join("/")
            },
            Water: {
                url: [e, "Water.png"].join("/")
            },
            Wind: {
                url: [e, "Wind.png"].join("/")
            },
            Spell: {
                url: [e, "Spell.png"].join("/")
            },
            Trap: {
                url: [e, "Trap.png"].join("/")
            }
        }
    }), define("draw/Image", ["react", "react-class"], function (e, t) {
        var r = t({
            getInitialState: function () {
                return {
                    image: null
                }
            },
            render: function () {
                return e.createElement("img", {
                    src: this.props.src,
                    crossOrigin: "anonymous",
                    onLoad: this.onLoad,
                    style: {
                        position: "absolute",
                        left: this.props.style.left,
                        top: this.props.style.top,
                        width: this.props.style.width,
                        height: this.props.style.height,
                        mixBlendMode: this.props.style.mixBlendMode
                    }
                })
            },
            onLoad: function (e) {
                this.setState({
                    image: e.target
                }), this.props.repaint()
            },
            componentDidUpdate: function () {
                var e = this.props.canvas;
                if (null !== e && null !== this.state.image) {
                    var t = e.getContext("2d");
                    t.save(), t.globalCompositeOperation = this.props.style.mixBlendMode, t.drawImage(this.state.image, this.props.style.left, this.props.style.top, this.props.style.width || this.state.image.width, this.props.style.height || this.state.image.height), t.restore()
                }
            }
        });
        return r.defaultProps = {
            style: {
                left: 0,
                top: 0,
                width: void 0,
                height: void 0,
                mixBlendMode: "normal"
            },
            canvas: null,
            repaint: function () {}
        }, r
    }), define("tcg/ygo/layout/component/Attribute", ["react", "react-class", "../../Attributes", "draw/Image"], function (e, t, r, a) {
        var n = t({
            render: function () {
                var t = Object.assign({}, this.props, {
                    src: r[this.props.value].url,
                    style: {
                        left: 350,
                        top: 28,
                        width: 40,
                        height: 40
                    }
                });
                return e.createElement(a, t)
            }
        });
        return n.displayName = "Attribute", n.defaultProps = {
            value: "None"
        }, n
    }), define("tcg/ygo/layout/component/Border", ["react", "react-class", "draw/Image"], function (e, t, r) {
        var a = t({
            render: function () {
                var t = "res/tcg/ygo/border/" + this.props.value + ".png";
                return this.props.pendulum && (t = t.replace(".png", ".pendulum.png")), e.createElement(r, {
                    src: t,
                    style: {
                        left: 0,
                        top: 0,
                        width: 420,
                        height: 610
                    },
                    canvas: this.props.canvas,
                    repaint: this.props.repaint
                })
            }
        });
        return a.displayName = "Border", a.defaultProps = {
            value: "Normal"
        }, a
    }), define("tcg/ygo/layout/component/Image", ["react", "react-class", "draw/Image", "../../Rarities"], function (e, t, r, a) {
        var n = {
                Normal: {
                    left: 50,
                    top: 110,
                    width: 320,
                    height: 320
                },
                Pendulum: {
                    left: 30,
                    top: 110,
                    width: 360,
                    height: 360
                }
            },
            i = t({
                render: function () {
                    var t = this.props.pendulum ? n.Pendulum : n.Normal;
                    e.createElement("span");
                    return e.createElement(e.Fragment, null, e.createElement(r, {
                        src: this.props.value,
                        style: t,
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    }), e.createElement(r, {
                        src: (a[this.props.rarity] || {}).foil,
                        style: Object.assign({}, t, {
                            mixBlendMode: "color-dodge"
                        }),
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    }))
                }
            });
        return i.displayName = "Image", i.defaultProps = {
            rarity: "common"
        }, i
    }), define("tcg/ygo/Stars", [], function () {
        var e = ["res", "tcg", "ygo", "star"].join("/");
        return {
            Normal: {
                url: [e, "Normal.png"].join("/")
            },
            Negative: {
                url: [e, "Negative.png"].join("/")
            },
            Xyz: {
                url: [e, "Xyz.png"].join("/")
            }
        }
    }), define("tcg/ygo/layout/component/Level", ["react", "react-class", "../../Stars", "draw/Group", "draw/Image"], function (e, t, r, a, n) {
        var i = {
                float: "right",
                left: 43,
                top: 73,
                width: 28,
                height: 28,
                maxWidth: 334
            },
            l = {
                float: "right",
                left: 35,
                top: 73,
                width: 28,
                height: 28,
                maxWidth: 350
            },
            o = [null, i, i, i, i, i, i, i, i, i, i, i, l],
            s = (l.maxWidth - 12 * l.width) / 12,
            p = t({
                render: function () {
                    for (var t = [], i = Math.min(Math.abs(this.props.value), 12), l = o[i] || {}, p = this.props.value > 0, c = p ? l.maxWidth - (l.width + s) : 0, u = p ? -1 : 1, h = 0; h < i; ++h) t[t.length] = e.createElement(n, {
                        src: r[this.props.star].url,
                        key: "star:" + h,
                        style: {
                            left: l.left + c + u * (h * (l.width + s)),
                            top: l.top,
                            width: l.width,
                            height: l.height
                        }
                    });
                    return e.createElement(a, this.props, t)
                }
            });
        return p.displayName = "Level", p.defaultProps = {}, p
    }), define("tcg/ygo/Icons", [], function () {
        var e = ["res", "tcg", "ygo", "icon"].join("/");
        return {
            Aucune: {
                url: null
            },
            Continue: {
                url: [e, "Continuous.png"].join("/")
            },
            Counter: {
                url: [e, "Counter.png"].join("/")
            },
            Equipement: {
                url: [e, "Equip.png"].join("/")
            },
            Terrain: {
                url: [e, "Field.png"].join("/")
            },
            "Magie rapide": {
                url: [e, "Quick-play.png"].join("/")
            },
            Rituel: {
                url: [e, "Ritual.png"].join("/")
            }
        }
    }), define("tcg/ygo/layout/component/Type", ["react", "react-class", "draw/Group", "draw/Image", "draw/Text", "../../Icons"], function (e, t, r, a, n, i) {
        var l = {
                Monster: {
                    fontFamily: ["Spectral SC", "serif"],
                    fontSize: 16,
                    fontWeight: 800,
                    textAlign: "left",
                    whitespace: "nowrap",
                    left: 35,
                    top: 458,
                    width: 350,
                    height: 20
                },
                Backrow: {
                    Icon: {
                        left: 346,
                        top: 74,
                        width: 24,
                        height: 24
                    },
                    Type: {
                        fontFamily: ["Spectral SC", "serif"],
                        fontSize: 16,
                        fontWeight: 800,
                        textAlign: "right",
                        whitespace: "nowrap",
                        left: 40,
                        top: 75,
                        width: 340,
                        height: 20
                    },
                    TypeWithIcon: {
                        fontFamily: ["Spectral SC", "serif"],
                        fontSize: 16,
                        fontWeight: 800,
                        textAlign: "right",
                        whitespace: "nowrap",
                        left: 40,
                        top: 75,
                        width: 306,
                        height: 20
                    },
                    TypeWithIconClosing: {
                        fontFamily: ["Spectral SC", "serif"],
                        fontSize: 16,
                        fontWeight: 800,
                        textAlign: "left",
                        whitespace: "nowrap",
                        left: 370,
                        top: 75,
                        width: 10,
                        height: 20
                    }
                }
            },
            o = t({
                render: function () {
                    switch (this.props.type) {
                        case "Backrow":
                            var t = [e.createElement(n, {
                                text: ["[", this.props.value, ""].join(" "),
                                style: l.Backrow.TypeWithIcon,
                                key: "type"
                            }), e.createElement(a, {
                                src: (i[this.props.icon] || {
                                    url: ""
                                }).url,
                                style: l.Backrow.Icon,
                                key: "icon"
                            }), e.createElement(n, {
                                text: " ]",
                                key: "close",
                                style: l.Backrow.TypeWithIconClosing
                            })];
                            return e.createElement(r, {
                                canvas: this.props.canvas,
                                repaint: this.props.repaint
                            }, null !== (i[this.props.icon] || {
                                url: null
                            }).url ? t : e.createElement(n, {
                                text: ["[", this.props.value, "]"].join(" "),
                                style: l.Backrow.Type
                            }));
                        case "Monster":
                            return e.createElement(n, {
                                text: ["[", this.props.value, "]"].join(" "),
                                style: l.Monster,
                                canvas: this.props.canvas,
                                repaint: this.props.repaint
                            })
                    }
                    return null
                }
            });
        return o.displayName = "Circulation", o.defaultProps = {
            value: "",
            icon: "None",
            type: "Monster"
        }, o
    }), define("tcg/ygo/layout/component/Effect", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = {
                Monster: {
                    fontFamily: ["Matrix Book", "Spectral", "serif"],
                    fontSize: 13,
                    textAlign: "justify",
                    left: 35,
                    top: 475,
                    width: 350,
                    height: 75
                },
                Backrow: {
                    fontFamily: ["Matrix Book", "Spectral", "serif"],
                    fontSize: 13,
                    textAlign: "justify",
                    left: 35,
                    top: 460,
                    width: 350,
                    height: 110
                },
                Vanilla: {
                    fontFamily: ["Amiri", "serif"],
                    fontStyle: "italic",
                    fontSize: 13,
                    textAlign: "justify",
                    left: 35,
                    top: 475,
                    width: 350,
                    height: 75
                },
                Skill: {
                    fontFamily: ["Matrix Book", "Spectral", "serif"],
                    fontSize: 13,
                    textAlign: "justify",
                    left: 35,
                    top: 475,
                    width: 350,
                    height: 95
                }
            },
            n = t({
                render: function () {
                    return e.createElement(r, {
                        text: this.props.value,
                        style: Object.assign({}, a[this.props.type]),
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    })
                }
            });
        return n.displayName = "Effect", n.defaultProps = {
            value: "",
            type: "Monster",
            flavour: !1
        }, n
    }), define("tcg/ygo/layout/component/Atk", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = {
                fontFamily: ["Crimson Text", "serif"],
                fontSize: 18,
                textAlign: "right",
                whitespace: "nowrap",
                fontWeight: 600,
                left: 260,
                top: 551,
                width: 40,
                height: void 0
            },
            n = t({
                render: function () {
                    return e.createElement(r, {
                        text: this.props.value,
                        style: a,
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    })
                }
            });
        return n.displayName = "Atk", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/component/Def", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = {
                fontFamily: ["Crimson Text", "serif"],
                fontSize: 18,
                textAlign: "right",
                whitespace: "nowrap",
                fontWeight: 600,
                left: 345,
                top: 551,
                width: 40,
                height: void 0
            },
            n = t({
                render: function () {
                    return e.createElement(r, {
                        text: this.props.value,
                        style: a,
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    })
                }
            });
        return n.displayName = "Def", n.defaultProps = {
            type: "Regular"
        }, n
    }), define("tcg/ygo/layout/component/Pendulum", ["react", "react-class", "draw/Group", "draw/Text"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return this.props.enabled ? e.createElement(r, {
                    canvas: this.props.canvas,
                    repaint: this.props.repaint
                }, e.createElement(a, {
                    text: this.props.effect,
                    style: {
                        fontFamily: ["Matrix Book", "Spectral", "serif"],
                        fontSize: 13,
                        textAlign: "justify",
                        left: 65,
                        top: 385,
                        width: 290,
                        height: 70
                    }
                }), e.createElement(a, {
                    text: this.props.blue,
                    style: {
                        fontFamily: ["Crimson Text", "serif"],
                        fontSize: 28,
                        textAlign: "center",
                        fontWeight: 600,
                        left: 32,
                        top: 410,
                        width: 23,
                        height: 30
                    }
                }), e.createElement(a, {
                    text: this.props.red,
                    style: {
                        fontFamily: ["Crimson Text", "serif"],
                        fontSize: 28,
                        textAlign: "center",
                        fontWeight: 600,
                        left: 365,
                        top: 410,
                        width: 23,
                        height: 30
                    }
                })) : null
            }
        });
        return n.displayName = "Pendulum", n.defaultProperties = {
            enabled: !1,
            blue: 0,
            red: 0,
            effect: ""
        }, n
    }), define("tcg/ygo/layout/component/Link", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = {
                fontFamily: ["IDroid", "Audiowide", "sans-serif"],
                fontSize: 16,
                textAlign: "right",
                whitespace: "nowrap",
                left: 370,
                top: 552,
                width: 15,
                height: void 0
            },
            n = t({
                render: function () {
                    return e.createElement(r, {
                        text: this.props.value,
                        style: a,
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    })
                }
            });
        return n.displayName = "Link", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/component/Serial", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = t({
            render: function () {
                return e.createElement(r, {
                    text: this.props.value,
                    style: {
                        fontFamily: ["Matrix Book", "Spectral", "serif"],
                        color: this.props.color,
                        fontSize: 12,
                        textAlign: "left",
                        whitespace: "nowrap",
                        left: 20,
                        top: 580,
                        width: 150,
                        height: void 0
                    },
                    canvas: this.props.canvas,
                    repaint: this.props.repaint
                })
            }
        });
        return a.displayName = "Serial", a.defaultProps = {
            value: "",
            color: "black"
        }, a
    }), define("tcg/ygo/layout/component/Copyright", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = t({
            render: function () {
                return e.createElement(r, {
                    text: this.props.value,
                    style: {
                        fontFamily: ["Matrix Book", "Spectral", "serif"],
                        color: this.props.color,
                        fontSize: 12,
                        textAlign: "right",
                        whitespace: "nowrap",
                        left: 230,
                        top: 580,
                        width: 150,
                        height: void 0
                    },
                    canvas: this.props.canvas,
                    repaint: this.props.repaint
                })
            }
        });
        return a.displayName = "Copyright", a.defaultProps = {
            value: "",
            color: "black"
        }, a
    }), define("tcg/ygo/layout/component/LinkMarkers", ["react", "react-class", "draw/Group", "draw/Image"], function (e, t, r, a) {
        var n = {
                regular: {
                    topLeft: {
                        top: 95,
                        left: 32,
                        width: 42,
                        height: 42
                    },
                    topCenter: {
                        top: 86,
                        left: 174,
                        width: 72,
                        height: 25
                    },
                    topRight: {
                        top: 95,
                        left: 346,
                        width: 42,
                        height: 42
                    },
                    middleLeft: {
                        top: 235,
                        left: 26,
                        width: 25,
                        height: 72
                    },
                    middleRight: {
                        top: 235,
                        left: 369,
                        width: 25,
                        height: 72
                    },
                    bottomLeft: {
                        top: 402,
                        left: 32,
                        width: 42,
                        height: 42
                    },
                    bottomCenter: {
                        top: 428,
                        left: 174,
                        width: 72,
                        height: 25
                    },
                    bottomRight: {
                        top: 402,
                        left: 346,
                        width: 42,
                        height: 42
                    }
                },
                pendulum: {
                    topLeft: {
                        top: 95,
                        left: 16,
                        width: 42,
                        height: 42
                    },
                    topCenter: {
                        top: 86,
                        left: 174,
                        width: 72,
                        height: 25
                    },
                    topRight: {
                        top: 95,
                        left: 362,
                        width: 42,
                        height: 42
                    },
                    middleLeft: {
                        top: 302,
                        left: 6,
                        width: 25,
                        height: 72
                    },
                    middleRight: {
                        top: 302,
                        left: 389,
                        width: 25,
                        height: 72
                    },
                    bottomLeft: {
                        top: 545,
                        left: 16,
                        width: 42,
                        height: 42
                    },
                    bottomCenter: {
                        top: 572,
                        left: 174,
                        width: 72,
                        height: 25
                    },
                    bottomRight: {
                        top: 545,
                        left: 362,
                        width: 42,
                        height: 42
                    }
                }
            },
            i = t({
                render: function () {
                    var t = e.createElement,
                        i = [],
                        l = n[this.props.pendulum ? "pendulum" : "regular"];
                    for (var o in l) l.hasOwnProperty(o) && this.props.hasOwnProperty(o) && !0 === this.props[o] && (i[i.length] = t(a, {
                        key: o,
                        src: "res/tcg/ygo/marker/" + o + ".png",
                        style: l[o]
                    }));
                    return e.createElement(r, {
                        text: this.props.value,
                        repaint: this.props.repaint,
                        canvas: this.props.canvas
                    }, i)
                }
            });
        return i.displayName = "LinkMarkers", i.defaultProps = {
            pendulumm: !1,
            topLeft: !1,
            topCenter: !1,
            topRight: !1,
            middleLeft: !1,
            middleRight: !1,
            bottomLeft: !1,
            bottomCenter: !1,
            bottomRight: !1
        }, i
    }), define("tcg/ygo/layout/component/Id", ["react", "react-class", "draw/Text"], function (e, t, r) {
        var a = {
                fontFamily: ["Matrix Book", "Spectral", "serif"],
                fontSize: 12,
                whitespace: "nowrap",
                height: void 0
            },
            n = {
                regular: {
                    textAlign: "right",
                    left: 290,
                    top: 437,
                    width: 80
                },
                pendulum: {
                    color: "black",
                    textAlign: "left",
                    left: 35,
                    top: 555,
                    width: 80
                },
                link: {
                    textAlign: "right",
                    left: 265,
                    top: 437,
                    width: 80
                }
            },
            i = t({
                render: function () {
                    return e.createElement(r, {
                        text: this.props.value,
                        style: Object.assign({
                            color: this.props.color
                        }, a, n[this.props.position]),
                        canvas: this.props.canvas,
                        repaint: this.props.repaint
                    })
                }
            });
        return i.displayName = "Id", i.defaultProps = {
            value: "",
            color: "black",
            position: "regular"
        }, i
    }), define("tcg/ygo/layout/component/All", ["./CardName", "./Attribute", "./Border", "./Image", "./Level", "./Type", "./Effect", "./Atk", "./Def", "./Pendulum", "./Link", "./Serial", "./Copyright", "./LinkMarkers", "./Id"], function (e, t, r, a, n, i, l, o, s, p, c, u, h, d, f) {
        return {
            CardName: e,
            Attribute: t,
            Border: r,
            Image: a,
            Level: n,
            Type: i,
            Effect: l,
            Atk: o,
            Def: s,
            Pendulum: p,
            Link: c,
            Serial: u,
            Copyright: h,
            LinkMarkers: d,
            Id: f
        }
    }), define("tcg/ygo/layout/Normal", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Normal",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect,
                    type: "Vanilla"
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Normal", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Effect", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Effect",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Effect", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Ritual", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Ritual",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Ritual", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Fusion", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Fusion",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Fusion", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Synchro", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Synchro",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Synchro", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/DarkSynchro", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "DarkSynchro",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: -this.props.level,
                    star: "Negative"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial,
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular",
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright,
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }))
            }
        });
        return n.displayName = "DarkSynchro", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Unity", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: !0,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Unity",
                    pendulum: !0
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, Object.assign({}, this.props.pendulum, {
                    enabled: !0
                })), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: "pendulum"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Unity", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Xyz", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Xyz",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: -this.props.level,
                    star: "Xyz"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial,
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular",
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright,
                    color: this.props.pendulum.enabled ? void 0 : "white"
                }))
            }
        });
        return n.displayName = "Xyz", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Link", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Link",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.LinkMarkers, Object.assign({
                    pendulum: this.props.pendulum.enabled
                }, this.props.link)), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Link, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "link"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Link", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Token", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Token",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Level, {
                    value: this.props.level,
                    star: "Normal"
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect
                }), e.createElement(a.Atk, {
                    value: this.props.atk
                }), e.createElement(a.Def, {
                    value: this.props.def
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Token", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Spell", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Spell",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type,
                    type: "Backrow",
                    icon: this.props.icon
                }), e.createElement(a.Effect, {
                    value: this.props.effect,
                    type: "Backrow"
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Spell", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Trap", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    pendulum: this.props.pendulum.enabled,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Trap",
                    pendulum: this.props.pendulum.enabled
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity
                }), e.createElement(a.Attribute, {
                    value: this.props.attribute
                }), e.createElement(a.Pendulum, this.props.pendulum), e.createElement(a.Type, {
                    value: this.props.type,
                    type: "Backrow",
                    icon: this.props.icon
                }), e.createElement(a.Effect, {
                    value: this.props.effect,
                    type: "Backrow"
                }), e.createElement(a.Serial, {
                    value: this.props.serial
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: this.props.pendulum.enabled ? "pendulum" : "regular"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright
                }))
            }
        });
        return n.displayName = "Trap", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/Skill", ["react", "react-class", "draw/Group", "./component/All"], function (e, t, r, a) {
        var n = t({
            render: function () {
                return e.createElement(r, this.props, e.createElement(a.Image, {
                    value: this.props.image,
                    rarity: this.props.rarity
                }), e.createElement(a.Border, {
                    value: "Skill"
                }), e.createElement(a.CardName, {
                    value: this.props.name,
                    color: "white",
                    rarity: this.props.rarity,
                    type: "skill"
                }), e.createElement(a.Type, {
                    value: this.props.type
                }), e.createElement(a.Effect, {
                    value: this.props.effect,
                    type: "Skill"
                }), e.createElement(a.Serial, {
                    value: this.props.serial,
                    color: "white"
                }), e.createElement(a.Id, {
                    value: this.props.id,
                    position: "regular",
                    color: "white"
                }), e.createElement(a.Copyright, {
                    value: this.props.copyright,
                    color: "white"
                }))
            }
        });
        return n.displayName = "Skill", n.defaultProps = {}, n
    }), define("tcg/ygo/layout/All", ["./Normal", "./Effect", "./Ritual", "./Fusion", "./Synchro", "./DarkSynchro", "./Unity", "./Xyz", "./Link", "./Token", "./Spell", "./Trap", "./Skill"], function (e, t, r, a, n, i, l, o, s, p, c, u, h) {
        return {
            Normal: {
                value: "Normal",
                fn: e
            },
            Effect: {
                value: "Effect",
                fn: t
            },
            Ritual: {
                value: "Ritual",
                fn: r
            },
            Fusion: {
                value: "Fusion",
                fn: a
            },
            Synchro: {
                value: "Synchro",
                fn: n
            },
            DarkSynchro: {
                value: "DarkSynchro",
                name: "Dark Synchro",
                fn: i
            },
            Xyz: {
                value: "Xyz",
                fn: o
            },
            Unity: {
                value: "Unity",
                fn: l
            },
            Link: {
                value: "Link",
                fn: s
            },
            Token: {
                value: "Token",
                fn: p
            },
            Spell: {
                value: "Spell",
                fn: c
            },
            Trap: {
                value: "Trap",
                fn: u
            },
            Skill: {
                value: "Skill",
                fn: h
            }
        }
    }), define("tcg/ygo/Card", ["react", "react-class", "draw/Canvas", "./layout/All", "./Attributes", "./Stars", "./Icons", "./Rarities"], function (e, t, r, a, n, i, l, o) {
        var s = t({
            render: function () {
                return e.createElement(r, {
                    width: 420,
                    height: 610,
                    className: "ygo card"
                }, e.createElement(a[this.props.layout].fn, this.props))
            }
        });
        return s.defaultProps = {
            layout: "Normal"
        }, s.displayName = "Card", s.Layout = a, s.Attributes = n, s.Stars = i, s.Icons = l, s.Rarities = o, s
    }),
    function () {
        function e(e, t, r) {
            return e.call.apply(e.bind, arguments)
        }

        function t(e, t, r) {
            if (!e) throw Error();
            if (2 < arguments.length) {
                var a = Array.prototype.slice.call(arguments, 2);
                return function () {
                    var r = Array.prototype.slice.call(arguments);
                    return Array.prototype.unshift.apply(r, a), e.apply(t, r)
                }
            }
            return function () {
                return e.apply(t, arguments)
            }
        }

        function r(a, n, i) {
            return r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? e : t, r.apply(null, arguments)
        }

        function a(e, t) {
            this.a = e, this.o = t || e, this.c = this.o.document
        }

        function n(e, t, r, a) {
            if (t = e.c.createElement(t), r)
                for (var n in r) r.hasOwnProperty(n) && ("style" == n ? t.style.cssText = r[n] : t.setAttribute(n, r[n]));
            return a && t.appendChild(e.c.createTextNode(a)), t
        }

        function i(e, t, r) {
            e = e.c.getElementsByTagName(t)[0], e || (e = document.documentElement), e.insertBefore(r, e.lastChild)
        }

        function l(e) {
            e.parentNode && e.parentNode.removeChild(e)
        }

        function o(e, t, r) {
            t = t || [], r = r || [];
            for (var a = e.className.split(/\s+/), n = 0; n < t.length; n += 1) {
                for (var i = !1, l = 0; l < a.length; l += 1)
                    if (t[n] === a[l]) {
                        i = !0;
                        break
                    } i || a.push(t[n])
            }
            for (t = [], n = 0; n < a.length; n += 1) {
                for (i = !1, l = 0; l < r.length; l += 1)
                    if (a[n] === r[l]) {
                        i = !0;
                        break
                    } i || t.push(a[n])
            }
            e.className = t.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
        }

        function s(e, t) {
            for (var r = e.className.split(/\s+/), a = 0, n = r.length; a < n; a++)
                if (r[a] == t) return !0;
            return !1
        }

        function p(e) {
            return e.o.location.hostname || e.a.location.hostname
        }

        function c(e, t, r) {
            function a() {
                p && l && o && (p(s), p = null)
            }
            t = n(e, "link", {
                rel: "stylesheet",
                href: t,
                media: "all"
            });
            var l = !1,
                o = !0,
                s = null,
                p = r || null;
            te ? (t.onload = function () {
                l = !0, a()
            }, t.onerror = function () {
                l = !0, s = Error("Stylesheet failed to load"), a()
            }) : setTimeout(function () {
                l = !0, a()
            }, 0), i(e, "head", t)
        }

        function u(e, t, r, a) {
            var i = e.c.getElementsByTagName("head")[0];
            if (i) {
                var l = n(e, "script", {
                        src: t
                    }),
                    o = !1;
                return l.onload = l.onreadystatechange = function () {
                    o || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (o = !0, r && r(null), l.onload = l.onreadystatechange = null, "HEAD" == l.parentNode.tagName && i.removeChild(l))
                }, i.appendChild(l), setTimeout(function () {
                    o || (o = !0, r && r(Error("Script load timeout")))
                }, a || 5e3), l
            }
            return null
        }

        function h() {
            this.a = 0, this.c = null
        }

        function d(e) {
            return e.a++,
                function () {
                    e.a--, m(e)
                }
        }

        function f(e, t) {
            e.c = t, m(e)
        }

        function m(e) {
            0 == e.a && e.c && (e.c(), e.c = null)
        }

        function g(e) {
            this.a = e || "-"
        }

        function v(e, t) {
            this.c = e, this.f = 4, this.a = "n";
            var r = (t || "n4").match(/^([nio])([1-9])$/i);
            r && (this.a = r[1], this.f = parseInt(r[2], 10))
        }

        function y(e) {
            return b(e) + " " + e.f + "00 300px " + w(e.c)
        }

        function w(e) {
            var t = [];
            e = e.split(/,\s*/);
            for (var r = 0; r < e.length; r++) {
                var a = e[r].replace(/['"]/g, ""); - 1 != a.indexOf(" ") || /^\d/.test(a) ? t.push("'" + a + "'") : t.push(a)
            }
            return t.join(",")
        }

        function E(e) {
            return e.a + e.f
        }

        function b(e) {
            var t = "normal";
            return "o" === e.a ? t = "oblique" : "i" === e.a && (t = "italic"), t
        }

        function k(e) {
            var t = 4,
                r = "n",
                a = null;
            return e && ((a = e.match(/(normal|oblique|italic)/i)) && a[1] && (r = a[1].substr(0, 1).toLowerCase()), (a = e.match(/([1-9]00|normal|bold)/i)) && a[1] && (/bold/i.test(a[1]) ? t = 7 : /[1-9]00/.test(a[1]) && (t = parseInt(a[1].substr(0, 1), 10)))), r + t
        }

        function x(e, t) {
            this.c = e, this.f = e.o.document.documentElement, this.h = t, this.a = new g("-"), this.j = !1 !== t.events, this.g = !1 !== t.classes
        }

        function S(e) {
            e.g && o(e.f, [e.a.c("wf", "loading")]), A(e, "loading")
        }

        function C(e) {
            if (e.g) {
                var t = s(e.f, e.a.c("wf", "active")),
                    r = [],
                    a = [e.a.c("wf", "loading")];
                t || r.push(e.a.c("wf", "inactive")), o(e.f, r, a)
            }
            A(e, "inactive")
        }

        function A(e, t, r) {
            e.j && e.h[t] && (r ? e.h[t](r.c, E(r)) : e.h[t]())
        }

        function N() {
            this.c = {}
        }

        function T(e, t, r) {
            var a, n = [];
            for (a in t)
                if (t.hasOwnProperty(a)) {
                    var i = e.c[a];
                    i && n.push(i(t[a], r))
                } return n
        }

        function F(e, t) {
            this.c = e, this.f = t, this.a = n(this.c, "span", {
                "aria-hidden": "true"
            }, this.f)
        }

        function L(e) {
            i(e.c, "body", e.a)
        }

        function j(e) {
            return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + w(e.c) + ";font-style:" + b(e) + ";font-weight:" + e.f + "00;"
        }

        function I(e, t, r, a, n, i) {
            this.g = e, this.j = t, this.a = a, this.c = r, this.f = n || 3e3, this.h = i || void 0
        }

        function P(e, t, r, a, n, i, l) {
            this.v = e, this.B = t, this.c = r, this.a = a, this.s = l || "BESbswy", this.f = {}, this.w = n || 3e3, this.u = i || null, this.m = this.j = this.h = this.g = null, this.g = new F(this.c, this.s), this.h = new F(this.c, this.s), this.j = new F(this.c, this.s), this.m = new F(this.c, this.s), e = new v(this.a.c + ",serif", E(this.a)), e = j(e), this.g.a.style.cssText = e, e = new v(this.a.c + ",sans-serif", E(this.a)), e = j(e), this.h.a.style.cssText = e, e = new v("serif", E(this.a)), e = j(e), this.j.a.style.cssText = e, e = new v("sans-serif", E(this.a)), e = j(e), this.m.a.style.cssText = e, L(this.g), L(this.h), L(this.j), L(this.m)
        }

        function R() {
            if (null === ae) {
                var e = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
                ae = !!e && (536 > parseInt(e[1], 10) || 536 === parseInt(e[1], 10) && 11 >= parseInt(e[2], 10))
            }
            return ae
        }

        function B(e, t, r) {
            for (var a in re)
                if (re.hasOwnProperty(a) && t === e.f[re[a]] && r === e.f[re[a]]) return !0;
            return !1
        }

        function M(e) {
            var t, r = e.g.a.offsetWidth,
                a = e.h.a.offsetWidth;
            (t = r === e.f.serif && a === e.f["sans-serif"]) || (t = R() && B(e, r, a)), t ? ee() - e.A >= e.w ? R() && B(e, r, a) && (null === e.u || e.u.hasOwnProperty(e.a.c)) ? D(e, e.v) : D(e, e.B) : _(e) : D(e, e.v)
        }

        function _(e) {
            setTimeout(r(function () {
                M(this)
            }, e), 50)
        }

        function D(e, t) {
            setTimeout(r(function () {
                l(this.g.a), l(this.h.a), l(this.j.a), l(this.m.a), t(this.a)
            }, e), 0)
        }

        function z(e, t, r) {
            this.c = e, this.a = t, this.f = 0, this.m = this.j = !1, this.s = r
        }

        function W(e) {
            0 == --e.f && e.j && (e.m ? (e = e.a, e.g && o(e.f, [e.a.c("wf", "active")], [e.a.c("wf", "loading"), e.a.c("wf", "inactive")]), A(e, "active")) : C(e.a))
        }

        function O(e) {
            this.j = e, this.a = new N, this.h = 0, this.f = this.g = !0
        }

        function G(e, t, a, n, i) {
            var l = 0 == --e.h;
            (e.f || e.g) && setTimeout(function () {
                var e = i || null,
                    s = n || null || {};
                if (0 === a.length && l) C(t.a);
                else {
                    t.f += a.length, l && (t.j = l);
                    var p, c = [];
                    for (p = 0; p < a.length; p++) {
                        var u = a[p],
                            h = s[u.c],
                            d = t.a,
                            f = u;
                        if (d.g && o(d.f, [d.a.c("wf", f.c, E(f).toString(), "loading")]), A(d, "fontloading", f), d = null, null === ne)
                            if (window.FontFace) {
                                var f = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),
                                    m = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
                                ne = f ? 42 < parseInt(f[1], 10) : !m
                            } else ne = !1;
                        d = ne ? new I(r(t.g, t), r(t.h, t), t.c, u, t.s, h) : new P(r(t.g, t), r(t.h, t), t.c, u, t.s, e, h), c.push(d)
                    }
                    for (p = 0; p < c.length; p++) c[p].start()
                }
            }, 0)
        }

        function U(e, t, r) {
            var a = [],
                n = r.timeout;
            S(t);
            var a = T(e.a, r, e.c),
                i = new z(e.c, t, n);
            for (e.h = a.length, t = 0, r = a.length; t < r; t++) a[t].load(function (t, r, a) {
                G(e, i, t, r, a)
            })
        }

        function X(e, t) {
            this.c = e, this.a = t
        }

        function J(e, t) {
            this.c = e, this.a = t
        }

        function q(e, t) {
            this.c = e || ie, this.a = [], this.f = [], this.g = t || ""
        }

        function H(e, t) {
            for (var r = t.length, a = 0; a < r; a++) {
                var n = t[a].split(":");
                3 == n.length && e.f.push(n.pop());
                var i = "";
                2 == n.length && "" != n[1] && (i = ":"), e.a.push(n.join(i))
            }
        }

        function V(e) {
            if (0 == e.a.length) throw Error("No fonts to load!");
            if (-1 != e.c.indexOf("kit=")) return e.c;
            for (var t = e.a.length, r = [], a = 0; a < t; a++) r.push(e.a[a].replace(/ /g, "+"));
            return t = e.c + "?family=" + r.join("%7C"), 0 < e.f.length && (t += "&subset=" + e.f.join(",")), 0 < e.g.length && (t += "&text=" + encodeURIComponent(e.g)), t
        }

        function $(e) {
            this.f = e, this.a = [], this.c = {}
        }

        function Y(e) {
            for (var t = e.f.length, r = 0; r < t; r++) {
                var a = e.f[r].split(":"),
                    n = a[0].replace(/\+/g, " "),
                    i = ["n4"];
                if (2 <= a.length) {
                    var l, o = a[1];
                    if (l = [], o)
                        for (var o = o.split(","), s = o.length, p = 0; p < s; p++) {
                            var c;
                            if (c = o[p], c.match(/^[\w-]+$/)) {
                                var u = pe.exec(c.toLowerCase());
                                if (null == u) c = "";
                                else {
                                    if (c = u[2], c = null == c || "" == c ? "n" : se[c], null == (u = u[1]) || "" == u) u = "4";
                                    else var h = oe[u],
                                        u = h || (isNaN(u) ? "4" : u.substr(0, 1));
                                    c = [c, u].join("")
                                }
                            } else c = "";
                            c && l.push(c)
                        }
                    0 < l.length && (i = l), 3 == a.length && (a = a[2], l = [], a = a ? a.split(",") : l, 0 < a.length && (a = le[a[0]]) && (e.c[n] = a))
                }
                for (e.c[n] || (a = le[n]) && (e.c[n] = a), a = 0; a < i.length; a += 1) e.a.push(new v(n, i[a]))
            }
        }

        function Q(e, t) {
            this.c = e, this.a = t
        }

        function K(e, t) {
            this.c = e, this.a = t
        }

        function Z(e, t) {
            this.c = e, this.f = t, this.a = []
        }
        var ee = Date.now || function () {
                return +new Date
            },
            te = !!window.FontFace;
        g.prototype.c = function (e) {
            for (var t = [], r = 0; r < arguments.length; r++) t.push(arguments[r].replace(/[\W_]+/g, "").toLowerCase());
            return t.join(this.a)
        }, I.prototype.start = function () {
            var e = this.c.o.document,
                t = this,
                r = ee(),
                a = new Promise(function (a, n) {
                    function i() {
                        ee() - r >= t.f ? n() : e.fonts.load(y(t.a), t.h).then(function (e) {
                            1 <= e.length ? a() : setTimeout(i, 25)
                        }, function () {
                            n()
                        })
                    }
                    i()
                }),
                n = null,
                i = new Promise(function (e, r) {
                    n = setTimeout(r, t.f)
                });
            Promise.race([i, a]).then(function () {
                n && (clearTimeout(n), n = null), t.g(t.a)
            }, function () {
                t.j(t.a)
            })
        };
        var re = {
                D: "serif",
                C: "sans-serif"
            },
            ae = null;
        P.prototype.start = function () {
            this.f.serif = this.j.a.offsetWidth, this.f["sans-serif"] = this.m.a.offsetWidth, this.A = ee(), M(this)
        };
        var ne = null;
        z.prototype.g = function (e) {
            var t = this.a;
            t.g && o(t.f, [t.a.c("wf", e.c, E(e).toString(), "active")], [t.a.c("wf", e.c, E(e).toString(), "loading"), t.a.c("wf", e.c, E(e).toString(), "inactive")]), A(t, "fontactive", e), this.m = !0, W(this)
        }, z.prototype.h = function (e) {
            var t = this.a;
            if (t.g) {
                var r = s(t.f, t.a.c("wf", e.c, E(e).toString(), "active")),
                    a = [],
                    n = [t.a.c("wf", e.c, E(e).toString(), "loading")];
                r || a.push(t.a.c("wf", e.c, E(e).toString(), "inactive")), o(t.f, a, n)
            }
            A(t, "fontinactive", e), W(this)
        }, O.prototype.load = function (e) {
            this.c = new a(this.j, e.context || this.j), this.g = !1 !== e.events, this.f = !1 !== e.classes, U(this, new x(this.c, e), e)
        }, X.prototype.load = function (e) {
            function t() {
                if (i["__mti_fntLst" + a]) {
                    var r, n = i["__mti_fntLst" + a](),
                        l = [];
                    if (n)
                        for (var o = 0; o < n.length; o++) {
                            var s = n[o].fontfamily;
                            void 0 != n[o].fontStyle && void 0 != n[o].fontWeight ? (r = n[o].fontStyle + n[o].fontWeight, l.push(new v(s, r))) : l.push(new v(s))
                        }
                    e(l)
                } else setTimeout(function () {
                    t()
                }, 50)
            }
            var r = this,
                a = r.a.projectId,
                n = r.a.version;
            if (a) {
                var i = r.c.o;
                u(this.c, (r.a.api || "https://fast.fonts.net/jsapi") + "/" + a + ".js" + (n ? "?v=" + n : ""), function (n) {
                    n ? e([]) : (i["__MonotypeConfiguration__" + a] = function () {
                        return r.a
                    }, t())
                }).id = "__MonotypeAPIScript__" + a
            } else e([])
        }, J.prototype.load = function (e) {
            var t, r, a = this.a.urls || [],
                n = this.a.families || [],
                i = this.a.testStrings || {},
                l = new h;
            for (t = 0, r = a.length; t < r; t++) c(this.c, a[t], d(l));
            var o = [];
            for (t = 0, r = n.length; t < r; t++)
                if (a = n[t].split(":"), a[1])
                    for (var s = a[1].split(","), p = 0; p < s.length; p += 1) o.push(new v(a[0], s[p]));
                else o.push(new v(a[0]));
            f(l, function () {
                e(o, i)
            })
        };
        var ie = "https://fonts.googleapis.com/css",
            le = {
                latin: "BESbswy",
                "latin-ext": "çöüğş",
                cyrillic: "йяЖ",
                greek: "αβΣ",
                khmer: "កខគ",
                Hanuman: "កខគ"
            },
            oe = {
                thin: "1",
                extralight: "2",
                "extra-light": "2",
                ultralight: "2",
                "ultra-light": "2",
                light: "3",
                regular: "4",
                book: "4",
                medium: "5",
                "semi-bold": "6",
                semibold: "6",
                "demi-bold": "6",
                demibold: "6",
                bold: "7",
                "extra-bold": "8",
                extrabold: "8",
                "ultra-bold": "8",
                ultrabold: "8",
                black: "9",
                heavy: "9",
                l: "3",
                r: "4",
                b: "7"
            },
            se = {
                i: "i",
                italic: "i",
                n: "n",
                normal: "n"
            },
            pe = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/,
            ce = {
                Arimo: !0,
                Cousine: !0,
                Tinos: !0
            };
        Q.prototype.load = function (e) {
            var t = new h,
                r = this.c,
                a = new q(this.a.api, this.a.text),
                n = this.a.families;
            H(a, n);
            var i = new $(n);
            Y(i), c(r, V(a), d(t)), f(t, function () {
                e(i.a, i.c, ce)
            })
        }, K.prototype.load = function (e) {
            var t = this.a.id,
                r = this.c.o;
            t ? u(this.c, (this.a.api || "https://use.typekit.net") + "/" + t + ".js", function (t) {
                if (t) e([]);
                else if (r.Typekit && r.Typekit.config && r.Typekit.config.fn) {
                    t = r.Typekit.config.fn;
                    for (var a = [], n = 0; n < t.length; n += 2)
                        for (var i = t[n], l = t[n + 1], o = 0; o < l.length; o++) a.push(new v(i, l[o]));
                    try {
                        r.Typekit.load({
                            events: !1,
                            classes: !1,
                            async: !0
                        })
                    } catch (e) {}
                    e(a)
                }
            }, 2e3) : e([])
        }, Z.prototype.load = function (e) {
            var t = this.f.id,
                r = this.c.o,
                a = this;
            t ? (r.__webfontfontdeckmodule__ || (r.__webfontfontdeckmodule__ = {}), r.__webfontfontdeckmodule__[t] = function (t, r) {
                for (var n = 0, i = r.fonts.length; n < i; ++n) {
                    var l = r.fonts[n];
                    a.a.push(new v(l.name, k("font-weight:" + l.weight + ";font-style:" + l.style)))
                }
                e(a.a)
            }, u(this.c, (this.f.api || "https://f.fontdeck.com/s/css/js/") + p(this.c) + "/" + t + ".js", function (t) {
                t && e([])
            })) : e([])
        };
        var ue = new O(window);
        ue.a.c.custom = function (e, t) {
            return new J(t, e)
        }, ue.a.c.fontdeck = function (e, t) {
            return new Z(t, e)
        }, ue.a.c.monotype = function (e, t) {
            return new X(t, e)
        }, ue.a.c.typekit = function (e, t) {
            return new K(t, e)
        }, ue.a.c.google = function (e, t) {
            return new Q(t, e)
        };
        var he = {
            load: r(ue.load, ue)
        };
        "function" == typeof define && define.amd ? define("webfont", [], function () {
            return he
        }) : "undefined" != typeof module && module.exports ? module.exports = he : (window.WebFont = he, window.WebFontConfig && ue.load(window.WebFontConfig))
    }(), define("tcg/ygo/CardMaker", ["react", "react-class", "./Card", "webfont"], function (e, t, r, a) {
        var n = {
            version: "1.2.0",
            rarity: "Common",
            name: "",
            level: 0,
            type: "",
            effect: "",
            atk: "",
            def: "",
            serial: "01234567",
            copyright: "©1996 KAZUKI TAKAHASHI",
            id: "",
            attribute: "None",
            pendulum: {
                enabled: !1,
                effect: "",
                blue: "5",
                red: "5"
            },
            link: {
                topLeft: !1,
                topCenter: !1,
                topRight: !1,
                middleLeft: !1,
                middleRight: !1,
                bottomLeft: !1,
                bottomCenter: !1,
                bottomRight: !1
            },
            layout: "Normal"
        };
        return t({
            getInitialState: function () {
                window.addEventListener("beforeunload", function (e) {
                    localStorage.setItem("ccms", JSON.stringify(this.state))
                }.bind(this));
                var e = JSON.parse(localStorage.getItem("ccms"));
                console.log(e);
                var t = {
                    card: {
                        version: "1.0.0",
                        name: "Nom de la Carte",
                        level: 7,
                        type: "Type / Epyt",
                        icon: "None",
                        effect: "Texte de l'effet",
                        atk: "0",
                        def: "0",
                        serial: "01234567",
                        copyright: "©1996 KAZUKI TAKAHASHI",
                        attribute: "None",
                        id: "YGO-F000",
                        pendulum: {
                            enabled: !0,
                            effect: "",
                            blue: "5",
                            red: "5"
                        },
                        link: {
                            topLeft: !1,
                            topCenter: !1,
                            topRight: !1,
                            middleLeft: !1,
                            middleRight: !1,
                            bottomLeft: !1,
                            bottomCenter: !1,
                            bottomRight: !1
                        },
                        layout: "Normal"
                    }
                };
                return a.load({
                    google: {
                        families: ["Buenard", "Spectral SC:semi-bold,extra-bold", "Spectral", "Amiri:italic", "Audiowide", "Crimson Text:semi-bold,bold", "Heebo:medium"]
                    },
                    fontactive: function () {
                        this.forceUpdate()
                    }.bind(this)
                }), Object.assign({}, t, e)
            },
            render: function () {
                function t(t) {
                    var r = [];
                    for (var a in t) t.hasOwnProperty(a) && (element = t[a] || {}, r[r.length] = e.createElement("option", {
                        key: a,
                        value: void 0 !== element.value ? element.value : a
                    }, element.name || a));
                    return r
                }
                var a = t(r.Layout),
                    n = t(r.Attributes),
                    i = t(r.Icons),
                    l = t(r.Rarities),
                    o = e.createElement;
                return o("div", {
                    className: "cardmaker ygo"
                }, o("div", {
                    className: "live-preview"
                }, o(r, this.state.card)), o("div", {
                    className: "editor"
                }, o("button", {
                    onClick: this.create
                }, "Tout rétablir"), o("button", {
                    onClick: this.save
                }, "Exporter JSON"), o("button", {
                    onClick: this.open
                }, "Importer JSON"), o("label", null, "Nom", o("input", {
                    onChange: this.updateField("card.name"),
                    type: "text",
                    value: this.state.card.name
                })), o("label", null, "Rareté", o("select", {
                    onChange: this.updateField("card.rarity"),
                    value: this.state.card.rarity
                }, l)), o("label", null, "Bordure", o("select", {
                    onChange: this.updateField("card.layout"),
                    value: this.state.card.layout
                }, a)), o("label", null, "Attribut", o("select", {
                    onChange: this.updateField("card.attribute"),
                    value: this.state.card.attribute
                }, n)), o("label", null, "Niveau", o("input", {
                    onChange: this.updateField("card.level"),
                    type: "number",
                    value: this.state.card.level
                })), o("label", null, "Image", o("input", {
                    onChange: this.updateField("card.image"),
                    type: "text"
                }), o("input", {
                    onChange: this.updateCardImage("image"),
                    type: "file"
                })), o("label", null, "Type", o("input", {
                    onChange: this.updateField("card.type"),
                    type: "text",
                    value: this.state.card.type
                })), o("label", null, "Icône", o("select", {
                    onChange: this.updateField("card.icon"),
                    value: this.state.card.icon
                }, i)), o("label", null, "Effet", o("textarea", {
                    onChange: this.updateField("card.effect"),
                    value: this.state.card.effect
                })), o("label", null, "ATK", o("input", {
                    onChange: this.updateField("card.atk"),
                    type: "text",
                    value: this.state.card.atk
                })), o("label", null, "DEF et/ou Link", o("input", {
                    onChange: this.updateField("card.def"),
                    type: "text",
                    value: this.state.card.def
                })), o("label", null, "ID de set", o("input", {
                    onChange: this.updateField("card.id"),
                    type: "text",
                    value: this.state.card.id
                })), o("label", null, "Numéro (code)", o("input", {
                    onChange: this.updateField("card.serial"),
                    type: "text",
                    value: this.state.card.serial
                })), o("label", null, "Droits", o("input", {
                    onChange: this.updateField("card.copyright"),
                    type: "text",
                    value: this.state.card.copyright
                })), o("fieldset", null, o("legend", null, o("input", {
                    id: "ccm_ygo:pendulum.enabled",
                    onChange: function (e) {
                        this.updateField("card.pendulum.enabled")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.pendulum.enabled
                }), o("label", {
                    htmlFor: "ccm_ygo:pendulum.enabled"
                }, "Effet Pendule")), o("label", null, "Côté bleu", o("input", {
                    onChange: this.updateField("card.pendulum.blue"),
                    type: "text",
                    value: this.state.card.pendulum.blue
                })), o("label", null, "Côté rouge", o("input", {
                    onChange: this.updateField("card.pendulum.red"),
                    type: "text",
                    value: this.state.card.pendulum.red
                })), o("label", null, "Effet", o("textarea", {
                    onChange: this.updateField("card.pendulum.effect"),
                    type: "text",
                    value: this.state.card.pendulum.effect
                }))), o("fieldset", null, o("legend", null, "Link"), o("table", null, o("tbody", null, o("tr", null, o("td", null, o("input", {
                    id: "ccm_ygo:link.topLeft",
                    onChange: function (e) {
                        this.updateField("card.link.topLeft")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.topLeft
                }), o("label", {
                    htmlFor: "ccm_ygo:link.topLeft"
                }, "")), o("td", null, o("input", {
                    id: "ccm_ygo:link.topCenter",
                    onChange: function (e) {
                        this.updateField("card.link.topCenter")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.topCenter
                }), o("label", {
                    htmlFor: "ccm_ygo:link.topCenter"
                }, "")), o("td", null, o("input", {
                    id: "ccm_ygo:link.topRight",
                    onChange: function (e) {
                        this.updateField("card.link.topRight")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.topRight
                }), o("label", {
                    htmlFor: "ccm_ygo:link.topRight"
                }, ""))), o("tr", null, o("td", null, o("input", {
                    id: "ccm_ygo:link.middleLeft",
                    onChange: function (e) {
                        this.updateField("card.link.middleLeft")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.middleLeft
                }), o("label", {
                    htmlFor: "ccm_ygo:link.middleLeft"
                }, "")), o("td"), o("td", null, o("input", {
                    id: "ccm_ygo:link.middleRight",
                    onChange: function (e) {
                        this.updateField("card.link.middleRight")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.middleRight
                }), o("label", {
                    htmlFor: "ccm_ygo:link.middleRight"
                }, ""))), o("tr", null, o("td", null, o("input", {
                    id: "ccm_ygo:link.bottomLeft",
                    onChange: function (e) {
                        this.updateField("card.link.bottomLeft")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.bottomLeft
                }), o("label", {
                    htmlFor: "ccm_ygo:link.bottomLeft"
                }, "")), o("td", null, o("input", {
                    id: "ccm_ygo:link.bottomCenter",
                    onChange: function (e) {
                        this.updateField("card.link.bottomCenter")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.bottomCenter
                }), o("label", {
                    htmlFor: "ccm_ygo:link.bottomCenter"
                }, "")), o("td", null, o("input", {
                    id: "ccm_ygo:link.bottomRight",
                    onChange: function (e) {
                        this.updateField("card.link.bottomRight")({
                            target: {
                                value: e.target.checked
                            }
                        })
                    }.bind(this),
                    type: "checkbox",
                    checked: this.state.card.link.bottomRight
                }), o("label", {
                    htmlFor: "ccm_ygo:link.bottomRight"
                }, "")))))), o("pre", {
                    className: "special"
                }, "∞\n", "☆\n", "●\n", "₀\n",	"₁\n",	"₂\n",	"₃\n",	"₄\n",	"₅\n",	"₆\n",	"₇\n",	"₈\n",	"₉\n")))
            },
            create: function () {
                this.setState({
                    card: n
                })
            },
            save: function () {
                var e = document.createElement("a");
                if (e.setAttribute("href", "data:/text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.card))), e.setAttribute("download", (this.state.card.name || "Card") + ".json"), document.createEvent) {
                    var t = document.createEvent("MouseEvent");
                    t.initEvent("click", !0, !0), e.dispatchEvent(t)
                } else e.click()
            },
            open: function () {
                var e = document.createElement("input");
                if (e.setAttribute("type", "file"), e.setAttribute("accept", ".json"), e.addEventListener("change", function (e) {
                        var t = e.target.files;
                        if (FileReader && t.length) {
                            var r = new FileReader;
                            r.onload = function () {
                                try {
                                    var e = JSON.parse(r.result);
                                    console.log(e), this.setState({
                                        card: e
                                    })
                                } catch (e) {
                                    console.error(e)
                                }
                            }.bind(this), r.readAsText(t[0])
                        }
                    }.bind(this)), document.createEvent) {
                    var t = document.createEvent("MouseEvent");
                    t.initEvent("click", !0, !0), e.dispatchEvent(t)
                } else link.click()
            },
            updateField: function (e) {
                var t = e.split(".");
                return function (e) {
                    for (var r = [], a = this.state, n = 0; n < t.length; ++n) r[r.length] = {
                        node: a,
                        name: t[n]
                    }, a = a[t[n]];
                    r.reverse();
                    var i = r.reduce(function (e, t) {
                        var r = {};
                        return r[t.name] = e, Object.assign({}, t.node, r)
                    }, e.target.value);
                    this.setState(i)
                }.bind(this)
            },
            updateTemplate: function (e) {
                this.setState({
                    card: Object.assign({}, this.state.card, {
                        layout: r.Layout[e.target.value]
                    })
                })
            },
            updateCardImage: function (e) {
                return function (t) {
                    var r = t.target.files;
                    if (FileReader && r && r.length) {
                        var a = new FileReader;
                        a.onload = function () {
                            var t = {};
                            t[e] = a.result, this.setState({
                                card: Object.assign({}, this.state.card, t)
                            })
                        }.bind(this), a.readAsDataURL(r[0])
                    }
                }.bind(this)
            }
        })
    }), define("App", ["react", "react-class", "tcg/ygo/CardMaker"], function (e, t, r) {
        return t({
            render: function () {
                return e.createElement(r, null)
            }
        })
    }),
    function () {
        var e = document.getElementById("react-root");
        e.innerText = "Chargement", requirejs.onError = function (t) {
            console.error(t), e.innerText = "Erreur de chargement"
        }, require(["react", "react-dom", "App"], function (t, r, a) {
            r.render(t.createElement(a), e)
        })
    }(), define("main", function () {});