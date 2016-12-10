/**
 * craftyjs 0.7.1
 * http://craftyjs.com/
 *
 * Copyright 2016, Louis Stowasser
 * Dual licensed under the MIT or GPL licenses.
 */

! function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
}({
    1: [function(a, b, c) {
        function d() {
            k = !1, h.length ? j = h.concat(j) : l = -1, j.length && e()
        }

        function e() {
            if (!k) {
                var a = setTimeout(d);
                k = !0;
                for (var b = j.length; b;) {
                    for (h = j, j = []; ++l < b;) h && h[l].run();
                    l = -1, b = j.length
                }
                h = null, k = !1, clearTimeout(a)
            }
        }

        function f(a, b) {
            this.fun = a, this.array = b
        }

        function g() {}
        var h, i = b.exports = {},
            j = [],
            k = !1,
            l = -1;
        i.nextTick = function(a) {
            var b = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
            j.push(new f(a, b)), 1 !== j.length || k || setTimeout(e, 0)
        }, f.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = g, i.addListener = g, i.once = g, i.off = g, i.removeListener = g, i.removeAllListeners = g, i.emit = g, i.binding = function(a) {
            throw new Error("process.binding is not supported")
        }, i.cwd = function() {
            return "/"
        }, i.chdir = function(a) {
            throw new Error("process.chdir is not supported")
        }, i.umask = function() {
            return 0
        }
    }, {}],
    2: [function(a, b, c) {
        var d = a("../core/core.js");
        d.c("Draggable", {
            _origX: null,
            _origY: null,
            _oldX: null,
            _oldY: null,
            _dir: null,
            init: function() {
                this.requires("MouseDrag"), this.bind("StartDrag", this._startDrag).bind("Dragging", this._drag)
            },
            remove: function() {
                this.unbind("StartDrag", this._startDrag).unbind("Dragging", this._drag)
            },
            enableDrag: function() {
                return this.uniqueBind("Dragging", this._drag), this
            },
            disableDrag: function() {
                return this.unbind("Dragging", this._drag), this
            },
            dragDirection: function(a) {
                if ("undefined" == typeof a) this._dir = null;
                else if ("" + parseInt(a, 10) == a) this._dir = {
                    x: Math.cos(a / 180 * Math.PI),
                    y: Math.sin(a / 180 * Math.PI)
                };
                else if (0 === a.x && 0 === a.y) this._dir = {
                    x: 0,
                    y: 0
                };
                else {
                    var b = Math.sqrt(a.x * a.x + a.y * a.y);
                    this._dir = {
                        x: a.x / b,
                        y: a.y / b
                    }
                }
                return this
            },
            _startDrag: function(a) {
                this._origX = a.realX, this._origY = a.realY, this._oldX = this._x, this._oldY = this._y
            },
            _drag: function(a) {
                if (this._dir) {
                    if (0 !== this._dir.x || 0 !== this._dir.y) {
                        var b = (a.realX - this._origX) * this._dir.x + (a.realY - this._origY) * this._dir.y;
                        this.x = this._oldX + b * this._dir.x, this.y = this._oldY + b * this._dir.y
                    }
                } else this.x = this._oldX + (a.realX - this._origX), this.y = this._oldY + (a.realY - this._origY)
            }
        }), d.c("Multiway", {
            _speed: null,
            init: function() {
                this.requires("Motion, Keyboard"), this._keyDirection = {}, this._activeDirections = {}, this._directionSpeed = {}, this._speed = {
                    x: 150,
                    y: 150
                }, this.bind("KeyDown", this._keydown).bind("KeyUp", this._keyup)
            },
            remove: function() {
                this.unbind("KeyDown", this._keydown).unbind("KeyUp", this._keyup), this.__unapplyActiveDirections()
            },
            _keydown: function(a) {
                var b = this._keyDirection[a.key];
                void 0 !== b && (0 !== this._activeDirections[b] || this.disableControls || (this.vx += this._directionSpeed[b].x, this.vy += this._directionSpeed[b].y), this._activeDirections[b]++)
            },
            _keyup: function(a) {
                var b = this._keyDirection[a.key];
                void 0 !== b && (this._activeDirections[b]--, 0 !== this._activeDirections[b] || this.disableControls || (this.vx -= this._directionSpeed[b].x, this.vy -= this._directionSpeed[b].y))
            },
            multiway: function(a, b) {
                return b ? void 0 !== a.x && void 0 !== a.y ? (this._speed.x = a.x, this._speed.y = a.y) : (this._speed.x = a, this._speed.y = a) : b = a, this.disableControls || this.__unapplyActiveDirections(), this._updateKeys(b), this._updateSpeed(this._speed), this.disableControls || this.__applyActiveDirections(), this
            },
            speed: function(a) {
                return this.disableControls || this.__unapplyActiveDirections(), this._updateSpeed(a), this.disableControls || this.__applyActiveDirections(), this
            },
            _updateKeys: function(a) {
                this._keyDirection = {}, this._activeDirections = {};
                for (var b in a) {
                    var c = d.keys[b] || b,
                        e = this._keyDirection[c] = a[b];
                    this._activeDirections[e] = this._activeDirections[e] || 0, this.isDown(c) && this._activeDirections[e]++
                }
            },
            _updateSpeed: function(a) {
                this._directionSpeed = {};
                var b;
                for (var c in this._keyDirection) b = this._keyDirection[c], this._directionSpeed[b] = {
                    x: Math.round(1e3 * Math.cos(b * (Math.PI / 180)) * a.x) / 1e3,
                    y: Math.round(1e3 * Math.sin(b * (Math.PI / 180)) * a.y) / 1e3
                }
            },
            __applyActiveDirections: function() {
                for (var a in this._activeDirections) this._activeDirections[a] > 0 && (this.vx += this._directionSpeed[a].x, this.vy += this._directionSpeed[a].y)
            },
            __unapplyActiveDirections: function() {
                for (var a in this._activeDirections) this._activeDirections[a] > 0 && (this.vx -= this._directionSpeed[a].x, this.vy -= this._directionSpeed[a].y)
            },
            enableControl: function() {
                return this.disableControls && this.__applyActiveDirections(), this.disableControls = !1, this
            },
            disableControl: function() {
                return this.disableControls || this.__unapplyActiveDirections(), this.disableControls = !0, this
            }
        }), d.c("Jumper", {
            _jumpSpeed: 300,
            canJump: !0,
            init: function() {
                this.requires("Supportable, Motion, Keyboard"), this.enableControl = this.enableControl || function() {
                    this.disableControls = !1
                }, this.disableControl = this.disableControl || function() {
                    this.disableControls = !0
                }
            },
            remove: function() {
                this.unbind("KeyDown", this._keydown_jumper)
            },
            _keydown_jumper: function(a) {
                if (!this.disableControls && this._jumpKeys[a.key]) {
                    var b = this.ground;
                    this.canJump = !!b, this.trigger("CheckJumping", b), this.canJump && (this.vy = -this._jumpSpeed)
                }
            },
            jumper: function(a, b) {
                b ? this._jumpSpeed = a : b = a, this._jumpKeys = {};
                for (var c = 0; c < b.length; ++c) {
                    var e = b[c],
                        f = d.keys[e] || e;
                    this._jumpKeys[f] = !0
                }
                return this.uniqueBind("KeyDown", this._keydown_jumper), this
            },
            jumpSpeed: function(a) {
                return this._jumpSpeed = a, this
            }
        }), d.c("Fourway", {
            init: function() {
                this.requires("Multiway")
            },
            fourway: function(a) {
                return this.multiway(a || this._speed, {
                    UP_ARROW: -90,
                    DOWN_ARROW: 90,
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180,
                    W: -90,
                    S: 90,
                    D: 0,
                    A: 180,
                    Z: -90,
                    Q: 180
                }), this
            }
        }), d.c("Twoway", {
            init: function() {
                this.requires("Multiway, Jumper")
            },
            twoway: function(a, b) {
                return this.multiway(a || this._speed, {
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180,
                    D: 0,
                    A: 180,
                    Q: 180
                }), this.jumper(b || 2 * a || this._jumpSpeed, [d.keys.UP_ARROW, d.keys.W, d.keys.Z]), this
            }
        })
    }, {
        "../core/core.js": 7
    }],
    3: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            device: {
                _deviceOrientationCallback: !1,
                _deviceMotionCallback: !1,
                _normalizeDeviceOrientation: function(a) {
                    var b;
                    window.DeviceOrientationEvent ? b = {
                        tiltLR: a.gamma,
                        tiltFB: a.beta,
                        dir: a.alpha,
                        motUD: null
                    } : window.OrientationEvent && (b = {
                        tiltLR: 90 * a.x,
                        tiltFB: -90 * a.y,
                        dir: null,
                        motUD: a.z
                    }), d.device._deviceOrientationCallback(b)
                },
                _normalizeDeviceMotion: function(a) {
                    var b = a.accelerationIncludingGravity,
                        c = b.z > 0 ? 1 : -1,
                        e = {
                            acceleration: b,
                            rawAcceleration: "[" + Math.round(b.x) + ", " + Math.round(b.y) + ", " + Math.round(b.z) + "]",
                            facingUp: c,
                            tiltLR: Math.round(b.x / 9.81 * -90),
                            tiltFB: Math.round((b.y + 9.81) / 9.81 * 90 * c)
                        };
                    d.device._deviceMotionCallback(e)
                },
                deviceOrientation: function(a) {
                    this._deviceOrientationCallback = a, d.support.deviceorientation && (window.DeviceOrientationEvent ? d.addEvent(this, window, "deviceorientation", this._normalizeDeviceOrientation) : window.OrientationEvent && d.addEvent(this, window, "MozOrientation", this._normalizeDeviceOrientation))
                },
                deviceMotion: function(a) {
                    this._deviceMotionCallback = a, d.support.devicemotion && window.DeviceMotionEvent && d.addEvent(this, window, "devicemotion", this._normalizeDeviceMotion)
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    4: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.extend({
            over: null,
            mouseObjs: 0,
            mousePos: {},
            lastEvent: null,
            touchObjs: 0,
            selected: !1,
            keydown: {},
            detectBlur: function(a) {
                var b = a.clientX > d.stage.x && a.clientX < d.stage.x + d.viewport.width && a.clientY > d.stage.y && a.clientY < d.stage.y + d.viewport.height;
                !d.selected && b && d.trigger("CraftyFocus"), d.selected && !b && d.trigger("CraftyBlur"), d.selected = b
            },
            multitouch: function(a) {
                return "boolean" != typeof a ? this._touchHandler.multitouch : void(this._touchHandler.multitouch = a)
            },
            resetKeyDown: function() {
                for (var a in d.keys) d.keydown[d.keys[a]] && this.trigger("KeyUp", {
                    key: d.keys[a]
                });
                d.keydown = {}
            },
            mouseDispatch: function(a) {
                if (d.mouseObjs) {
                    d.lastEvent = a;
                    var b, c, e, f = a.target ? a.target : a.srcElement,
                        g = d.domHelper.translate(a.clientX, a.clientY),
                        h = a.type;
                    "undefined" == typeof a.which ? a.mouseButton = a.button < 2 ? d.mouseButtons.LEFT : 4 == a.button ? d.mouseButtons.MIDDLE : d.mouseButtons.RIGHT : a.mouseButton = a.which < 2 ? d.mouseButtons.LEFT : 2 == a.which ? d.mouseButtons.MIDDLE : d.mouseButtons.RIGHT, a.realX = c = d.mousePos.x = g.x, a.realY = e = d.mousePos.y = g.y, b = d.findClosestEntityByComponent("Mouse", c, e, f), b ? "mousedown" === h ? b.trigger("MouseDown", a) : "mouseup" === h ? b.trigger("MouseUp", a) : "dblclick" == h ? b.trigger("DoubleClick", a) : "click" == h ? b.trigger("Click", a) : "mousemove" === h ? (b.trigger("MouseMove", a), this.over !== b && (this.over && (this.over.trigger("MouseOut", a), this.over = null), this.over = b, b.trigger("MouseOver", a))) : b.trigger(h, a) : ("mousemove" === h && this.over && (this.over.trigger("MouseOut", a), this.over = null), "mousedown" === h ? d.viewport.mouselook("start", a) : "mousemove" === h ? d.viewport.mouselook("drag", a) : "mouseup" == h && d.viewport.mouselook("stop")), "mousemove" === h && (this.lastEvent = a)
                }
            },
            touchDispatch: function(a) {
                if (d.touchObjs || d.mouseObjs) {
                    if (this._touchHandler.multitouch) switch (a.type) {
                        case "touchstart":
                            this._touchHandler.handleStart(a);
                            break;
                        case "touchmove":
                            this._touchHandler.handleMove(a);
                            break;
                        case "touchleave":
                        case "touchcancel":
                        case "touchend":
                            this._touchHandler.handleEnd(a)
                    } else this._touchHandler.mimicMouse(a);
                    a.target && "INPUT" !== a.target.nodeName && "TEXTAREA" !== a.target.nodeName && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
                }
            },
            _touchHandler: {
                fingers: [],
                multitouch: !1,
                handleStart: function(a) {
                    for (var b = a.changedTouches, c = 0, e = b.length; e > c; c++) {
                        var f, g, h, i = !1,
                            j = d.domHelper.translate(b[c].clientX, b[c].clientY),
                            k = a.target ? a.target : a.srcElement;
                        b[c].realX = f = j.x, b[c].realY = g = j.y, h = this.findClosestTouchEntity(f, g, k), h && (h.trigger("TouchStart", b[c]), i = this.fingerDownIndexByEntity(h));
                        var l = this.setTouch(b[c], h);
                        i !== !1 && i >= 0 ? this.fingers[i] = l : this.fingers.push(l)
                    }
                },
                handleMove: function(a) {
                    for (var b = a.changedTouches, c = 0, e = b.length; e > c; c++) {
                        var f, g, h, i = this.fingerDownIndexById(b[c].identifier),
                            j = d.domHelper.translate(b[c].clientX, b[c].clientY),
                            k = a.target ? a.target : a.srcElement;
                        b[c].realX = f = j.x, b[c].realY = g = j.y, h = this.findClosestTouchEntity(f, g, k), i >= 0 && ("undefined" != typeof this.fingers[i].entity && (this.fingers[i].entity == h ? this.fingers[i].entity.trigger("TouchMove", b[c]) : ("object" == typeof h && h.trigger("TouchStart", b[c]), this.fingers[i].entity.trigger("TouchEnd"))), this.fingers[i].entity = h, this.fingers[i].realX = f, this.fingers[i].realY = g)
                    }
                },
                handleEnd: function(a) {
                    for (var b = a.changedTouches, c = "touchcancel" == a.type ? "TouchCancel" : "TouchEnd", d = 0, e = b.length; e > d; d++) {
                        var f = this.fingerDownIndexById(b[d].identifier);
                        f >= 0 && (this.fingers[f].entity && this.fingers[f].entity.trigger(c), this.fingers.splice(f, 1))
                    }
                },
                setTouch: function(a, b) {
                    return {
                        identifier: a.identifier,
                        realX: a.realX,
                        realY: a.realY,
                        entity: b
                    }
                },
                findClosestTouchEntity: function(a, b, c) {
                    return d.findClosestEntityByComponent("Touch", a, b, c)
                },
                fingerDownIndexById: function(a) {
                    for (var b = 0, c = this.fingers.length; c > b; b++) {
                        var d = this.fingers[b].identifier;
                        if (d == a) return b
                    }
                    return -1
                },
                fingerDownIndexByEntity: function(a) {
                    for (var b = 0, c = this.fingers.length; c > b; b++) {
                        var d = this.fingers[b].entity;
                        if (d == a) return b
                    }
                    return -1
                },
                mimicMouse: function(a) {
                    var b, c = d.lastEvent;
                    "touchstart" === a.type ? b = "mousedown" : "touchmove" === a.type ? b = "mousemove" : "touchend" === a.type ? b = "mouseup" : "touchcancel" === a.type ? b = "mouseup" : "touchleave" === a.type && (b = "mouseup"), a.touches && a.touches.length ? first = a.touches[0] : a.changedTouches && a.changedTouches.length && (first = a.changedTouches[0]);
                    var f = e.createEvent("MouseEvent");
                    f.initMouseEvent(b, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, a.relatedTarget), first.target.dispatchEvent(f), null !== c && "mousedown" == c.type && "mouseup" == b && (b = "click", f = e.createEvent("MouseEvent"), f.initMouseEvent(b, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, a.relatedTarget), first.target.dispatchEvent(f))
                }
            },
            findClosestEntityByComponent: function(a, b, c, e) {
                var f, g, h, i = e ? e : d.stage.elem,
                    j = 0,
                    k = -1,
                    l = {};
                if ("CANVAS" != i.nodeName) {
                    for (;
                        "string" != typeof i.id && -1 == i.id.indexOf("ent");) i = i.parentNode;
                    var m = d(parseInt(i.id.replace("ent", ""), 10));
                    m.__c[a] && m.isAt(b, c) && (f = m)
                }
                if (!f)
                    for (g = d.map.search({
                            _x: b,
                            _y: c,
                            _w: 1,
                            _h: 1
                        }, !1), h = g.length; h > j; ++j)
                        if (g[j].__c[a] && g[j]._visible) {
                            var n = g[j],
                                o = !1;
                            if (!l[n[0]] && (l[n[0]] = !0, n.mapArea ? n.mapArea.containsPoint(b, c) && (o = !0) : n.isAt(b, c) && (o = !0), o && (n._z >= k || -1 === k))) {
                                if (n._z === k && n[0] < f[0]) continue;
                                k = n._z, f = n
                            }
                        }
                return f
            },
            mouseWheelDispatch: function(a) {
                a.direction = a.detail < 0 || a.wheelDelta > 0 ? 1 : -1, d.trigger("MouseWheelScroll", a)
            },
            keyboardDispatch: function(a) {
                for (var b = a, c = {}, e = "char charCode keyCode type shiftKey ctrlKey metaKey timestamp".split(" "), f = e.length; f;) {
                    var g = e[--f];
                    c[g] = b[g]
                }
                return c.which = null !== b.charCode ? b.charCode : b.keyCode, c.key = b.keyCode || b.which, c.originalEvent = b, a = c, "keydown" === a.type ? d.keydown[a.key] !== !0 && (d.keydown[a.key] = !0, d.trigger("KeyDown", a)) : "keyup" === a.type && (delete d.keydown[a.key], d.trigger("KeyUp", a)), d.selected && !(8 == a.key || a.key >= 112 && a.key <= 135) ? (b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0, b.target && "INPUT" !== b.target.nodeName && "TEXTAREA" !== b.target.nodeName && (b.preventDefault ? b.preventDefault() : b.returnValue = !1), !1) : void 0
            }
        }), d._preBind("Load", function() {
            d.addEvent(this, "keydown", d.keyboardDispatch), d.addEvent(this, "keyup", d.keyboardDispatch), d.addEvent(this, d.stage.elem, "mousedown", d.mouseDispatch), d.addEvent(this, d.stage.elem, "mouseup", d.mouseDispatch), d.addEvent(this, e.body, "mouseup", d.detectBlur), d.addEvent(this, window, "blur", d.resetKeyDown), d.addEvent(this, d.stage.elem, "mousemove", d.mouseDispatch), d.addEvent(this, d.stage.elem, "click", d.mouseDispatch), d.addEvent(this, d.stage.elem, "dblclick", d.mouseDispatch), d.addEvent(this, d.stage.elem, "touchstart", d.touchDispatch), d.addEvent(this, d.stage.elem, "touchmove", d.touchDispatch), d.addEvent(this, d.stage.elem, "touchend", d.touchDispatch), d.addEvent(this, d.stage.elem, "touchcancel", d.touchDispatch), d.addEvent(this, d.stage.elem, "touchleave", d.touchDispatch), "Moz" === d.support.prefix ? d.addEvent(this, d.stage.elem, "DOMMouseScroll", d.mouseWheelDispatch) : d.addEvent(this, d.stage.elem, "mousewheel", d.mouseWheelDispatch)
        }), d._preBind("CraftyStop", function() {
            d.removeEvent(this, "keydown", d.keyboardDispatch), d.removeEvent(this, "keyup", d.keyboardDispatch), d.stage && (d.removeEvent(this, d.stage.elem, "mousedown", d.mouseDispatch), d.removeEvent(this, d.stage.elem, "mouseup", d.mouseDispatch), d.removeEvent(this, d.stage.elem, "mousemove", d.mouseDispatch), d.removeEvent(this, d.stage.elem, "click", d.mouseDispatch), d.removeEvent(this, d.stage.elem, "dblclick", d.mouseDispatch), d.removeEvent(this, d.stage.elem, "touchstart", d.touchDispatch), d.removeEvent(this, d.stage.elem, "touchmove", d.touchDispatch), d.removeEvent(this, d.stage.elem, "touchend", d.touchDispatch), d.removeEvent(this, d.stage.elem, "touchcancel", d.touchDispatch), d.removeEvent(this, d.stage.elem, "touchleave", d.touchDispatch), "Moz" === d.support.prefix ? d.removeEvent(this, d.stage.elem, "DOMMouseScroll", d.mouseWheelDispatch) : d.removeEvent(this, d.stage.elem, "mousewheel", d.mouseWheelDispatch)), d.removeEvent(this, e.body, "mouseup", d.detectBlur), d.removeEvent(this, window, "blur", d.resetKeyDown)
        }), d.c("Mouse", {
            init: function() {
                d.mouseObjs++, this.requires("AreaMap").bind("Remove", function() {
                    d.mouseObjs--
                })
            }
        }), d.c("Touch", {
            init: function() {
                d.touchObjs++, this.requires("AreaMap").bind("Remove", function() {
                    d.touchObjs--
                })
            }
        }), d.c("AreaMap", {
            init: function() {},
            areaMap: function(a) {
                if (arguments.length > 1) {
                    var b = Array.prototype.slice.call(arguments, 0);
                    a = new d.polygon(b)
                } else a = a.constructor === Array ? new d.polygon(a.slice()) : a.clone();
                return a.shift(this._x, this._y), this.mapArea = a, this.attach(this.mapArea), this.trigger("NewAreaMap", a), this
            }
        }), d.c("Button", {
            init: function() {
                var a = !d.mobile || d.mobile && !d.multitouch() ? "Mouse" : "Touch";
                this.requires(a)
            }
        }), d.c("MouseDrag", {
            _dragging: !1,
            init: function() {
                this.requires("Mouse"), this.bind("MouseDown", this._ondown)
            },
            remove: function() {
                this.unbind("MouseDown", this._ondown)
            },
            _ondown: function(a) {
                a.mouseButton === d.mouseButtons.LEFT && this.startDrag(a)
            },
            _ondrag: function(a) {
                return this._dragging && 0 !== a.realX && 0 !== a.realY ? void this.trigger("Dragging", a) : !1
            },
            _onup: function(a) {
                a.mouseButton === d.mouseButtons.LEFT && this.stopDrag(a)
            },
            startDrag: function(a) {
                return this._dragging ? void 0 : (this._dragging = !0, d.addEvent(this, d.stage.elem, "mousemove", this._ondrag), d.addEvent(this, d.stage.elem, "mouseup", this._onup), this.trigger("StartDrag", a || d.lastEvent), this)
            },
            stopDrag: function(a) {
                return this._dragging ? (this._dragging = !1, d.removeEvent(this, d.stage.elem, "mousemove", this._ondrag), d.removeEvent(this, d.stage.elem, "mouseup", this._onup), this.trigger("StopDrag", a || d.lastEvent), this) : void 0
            }
        }), d.c("Keyboard", {
            isDown: function(a) {
                return "string" == typeof a && (a = d.keys[a]), !!d.keydown[a]
            }
        })
    }, {
        "../core/core.js": 7
    }],
    5: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            keys: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                PAUSE: 19,
                CAPS: 20,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                INSERT: 45,
                DELETE: 46,
                0: 48,
                1: 49,
                2: 50,
                3: 51,
                4: 52,
                5: 53,
                6: 54,
                7: 55,
                8: 56,
                9: 57,
                A: 65,
                B: 66,
                C: 67,
                D: 68,
                E: 69,
                F: 70,
                G: 71,
                H: 72,
                I: 73,
                J: 74,
                K: 75,
                L: 76,
                M: 77,
                N: 78,
                O: 79,
                P: 80,
                Q: 81,
                R: 82,
                S: 83,
                T: 84,
                U: 85,
                V: 86,
                W: 87,
                X: 88,
                Y: 89,
                Z: 90,
                NUMPAD_0: 96,
                NUMPAD_1: 97,
                NUMPAD_2: 98,
                NUMPAD_3: 99,
                NUMPAD_4: 100,
                NUMPAD_5: 101,
                NUMPAD_6: 102,
                NUMPAD_7: 103,
                NUMPAD_8: 104,
                NUMPAD_9: 105,
                MULTIPLY: 106,
                ADD: 107,
                SUBSTRACT: 109,
                DECIMAL: 110,
                DIVIDE: 111,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                PLUS: 187,
                COMMA: 188,
                MINUS: 189,
                PERIOD: 190,
                PULT_UP: 29460,
                PULT_DOWN: 29461,
                PULT_LEFT: 4,
                PULT_RIGHT: 5
            },
            mouseButtons: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            }
        })
    }, {
        "../core/core.js": 7
    }],
    6: [function(a, b, c) {
        var d = function(a, b) {
            this.timePerFrame = 1e3 / Crafty.timer.FPS(), this.duration = a, "function" == typeof b ? this.easing_function = b : "string" == typeof b && this.standardEasingFunctions[b] ? this.easing_function = this.standardEasingFunctions[b] : this.easing_function = this.standardEasingFunctions.linear, this.reset()
        };
        d.prototype = {
            duration: 0,
            clock: 0,
            steps: null,
            complete: !1,
            paused: !1,
            reset: function() {
                this.loops = 1, this.clock = 0, this.complete = !1, this.paused = !1
            },
            repeat: function(a) {
                this.loops = a
            },
            setProgress: function(a, b) {
                this.clock = this.duration * a, "undefined" != typeof b && (this.loops = b)
            },
            pause: function() {
                this.paused = !0
            },
            resume: function() {
                this.paused = !1, this.complete = !1
            },
            tick: function(a) {
                if (!this.paused && !this.complete)
                    for (this.clock += a, this.frames = Math.floor(this.clock / this.timePerFrame); this.clock >= this.duration && this.complete === !1;) this.loops--, this.loops > 0 ? this.clock -= this.duration : this.complete = !0
            },
            time: function() {
                return Math.min(this.clock / this.duration, 1)
            },
            value: function() {
                return this.easing_function(this.time())
            },
            standardEasingFunctions: {
                linear: function(a) {
                    return a
                },
                smoothStep: function(a) {
                    return (3 - 2 * a) * a * a
                },
                smootherStep: function(a) {
                    return (6 * a * a - 15 * a + 10) * a * a * a
                },
                easeInQuad: function(a) {
                    return a * a
                },
                easeOutQuad: function(a) {
                    return a * (2 - a)
                },
                easeInOutQuad: function(a) {
                    return .5 > a ? 2 * a * a : (4 - 2 * a) * a - 1
                }
            }
        }, b.exports = d
    }, {}],
    7: [function(a, b, c) {
        function d() {
            var a = f++;
            return a in i ? d() : a
        }

        function e(a) {
            if (null === a || "object" != typeof a) return a;
            var b = a.constructor();
            for (var c in a) b[c] = e(a[c]);
            return b
        }
        var f, g, h, i, j, k, l, m, n, o = a("./version"),
            p = function(a) {
                return new p.fn.init(a)
            };
        h = {}, l = Array.prototype.slice, m = /\s*,\s*/, n = /\s+/;
        var q = function() {
            f = 1, g = 0, i = {}, j = {}, k = []
        };
        q(), p.fn = p.prototype = {
            init: function(a) {
                if ("string" != typeof a) return a || (a = 0, a in i || (i[a] = this)), a in i ? (this[0] = a, this.length = 1, this.__c || (this.__c = {}), this._callbacks || p._addCallbackMethods(this), i[a] || (i[a] = this), i[a]) : (this.length = 0, this);
                var b, c, d, e, f, g, j, k = 0,
                    l = !1,
                    o = !1;
                if ("*" === a) {
                    g = 0;
                    for (b in i) this[g] = +b, g++;
                    return this.length = g, 1 === g ? i[this[0]] : this
                } - 1 !== a.indexOf(",") ? (o = !0, d = m) : -1 !== a.indexOf(" ") && (l = !0, d = n);
                for (b in i)
                    if (i.hasOwnProperty(b))
                        if (c = i[b], l || o) {
                            for (e = a.split(d), g = 0, j = e.length, f = 0; j > g; g++) c.__c[e[g]] && f++;
                            (l && f === j || o && f > 0) && (this[k++] = +b)
                        } else c.__c[a] && (this[k++] = +b);
                if (k > 0 && !l && !o && this.extend(h[a]), e && l)
                    for (g = 0; j > g; g++) this.extend(h[e[g]]);
                return this.length = k, 1 === k ? i[this[k - 1]] : (p._addCallbackMethods(this), this)
            },
            setName: function(a) {
                var b = String(a);
                return this._entityName = b, this.trigger("NewEntityName", b), this
            },
            addComponent: function(a) {
                var b, c, d = 0;
                for (b = 1 === arguments.length && -1 !== a.indexOf(",") ? a.split(m) : arguments; d < b.length; d++)
                    if (this.__c[b[d]] !== !0 && (this.__c[b[d]] = !0, c = h[b[d]], this.extend(c), c && "required" in c && this.requires(c.required), c && "init" in c && c.init.call(this), c && "events" in c)) {
                        var e = c.events;
                        for (var f in e) {
                            var g = "function" == typeof e[f] ? e[f] : c[e[f]];
                            this.bind(f, g)
                        }
                    }
                return this.trigger("NewComponent", b), this
            },
            toggleComponent: function(a) {
                var b, c, d = 0;
                if (arguments.length > 1)
                    for (b = arguments.length; b > d; d++) this.has(arguments[d]) ? this.removeComponent(arguments[d]) : this.addComponent(arguments[d]);
                else if (-1 !== a.indexOf(","))
                    for (c = a.split(m), b = c.length; b > d; d++) this.has(c[d]) ? this.removeComponent(c[d]) : this.addComponent(c[d]);
                else this.has(a) ? this.removeComponent(a) : this.addComponent(a);
                return this
            },
            requires: function(a) {
                return this.addComponent(a)
            },
            removeComponent: function(a, b) {
                var c = h[a];
                if (this.trigger("RemoveComponent", a), c && "events" in c) {
                    var d = c.events;
                    for (var e in d) {
                        var f = "function" == typeof d[e] ? d[e] : c[d[e]];
                        this.unbind(e, f)
                    }
                }
                if (c && "remove" in c && c.remove.call(this, !1), b === !1 && c)
                    for (var g in c) delete this[g];
                return delete this.__c[a], this
            },
            getId: function() {
                return this[0]
            },
            has: function(a) {
                return !!this.__c[a]
            },
            attr: function(a, b, c, d) {
                return 1 === arguments.length && "string" == typeof arguments[0] ? this._attr_get(a) : this._attr_set(a, b, c, d)
            },
            _attr_get: function(a, b) {
                var c, d, e;
                return ("undefined" == typeof b || null === b) && (b = this), a.indexOf(".") > -1 ? (d = a.split("."), c = d.shift(), e = d.join("."), this._attr_get(d.join("."), b[c])) : b[a]
            },
            _attr_set: function() {
                var a, b, c;
                return "string" == typeof arguments[0] ? (a = this._set_create_object(arguments[0], arguments[1]), b = !!arguments[2], c = arguments[3] || arguments[0].indexOf(".") > -1) : (a = arguments[0], b = !!arguments[1], c = !!arguments[2]), b || this.trigger("Change", a), c ? this._recursive_extend(a, this) : this.extend.call(this, a), this
            },
            _set_create_object: function(a, b) {
                var c, d, e, f = {};
                return a.indexOf(".") > -1 ? (c = a.split("."), d = c.shift(), e = c.join("."), f[d] = this._set_create_object(e, b)) : f[a] = b, f
            },
            _recursive_extend: function(a, b) {
                var c;
                for (c in a) a[c].constructor === Object ? b[c] = this._recursive_extend(a[c], b[c]) : b[c] = a[c];
                return b
            },
            toArray: function() {
                return l.call(this, 0)
            },
            timeout: function(a, b) {
                return this.each(function() {
                    var c = this;
                    setTimeout(function() {
                        a.call(c)
                    }, b)
                }), this
            },
            bind: function(a, b) {
                if (1 === this.length) this._bindCallback(a, b);
                else
                    for (var c = 0; c < this.length; c++) {
                        var d = i[this[c]];
                        d && d._bindCallback(a, b)
                    }
                return this
            },
            uniqueBind: function(a, b) {
                this.unbind(a, b), this.bind(a, b)
            },
            one: function(a, b) {
                var c = this,
                    d = function(e) {
                        b.call(c, e), c.unbind(a, d)
                    };
                return c.bind(a, d)
            },
            unbind: function(a, b) {
                var c, d;
                for (c = 0; c < this.length; c++) d = i[this[c]], d && d._unbindCallbacks(a, b);
                return this
            },
            trigger: function(a, b) {
                if (1 === this.length) this._runCallbacks(a, b);
                else
                    for (var c = 0; c < this.length; c++) {
                        var d = i[this[c]];
                        d && d._runCallbacks(a, b)
                    }
                return this
            },
            each: function(a) {
                for (var b = 0, c = this.length; c > b; b++) i[this[b]] && a.call(i[this[b]], b);
                return this
            },
            get: function(a) {
                var b = this.length;
                if ("undefined" != typeof a) {
                    if (a >= b || 0 > a + b) return;
                    return a >= 0 ? i[this[a]] : i[this[a + b]]
                }
                for (var c = 0, d = []; b > c; c++) i[this[c]] && d.push(i[this[c]]);
                return d
            },
            clone: function() {
                var a, b, c = this.__c,
                    d = p.e();
                for (a in c) d.addComponent(a);
                for (b in this) "0" != b && "_global" != b && "_changed" != b && "function" != typeof this[b] && "object" != typeof this[b] && (d[b] = this[b]);
                return d
            },
            setter: function(a, b) {
                return this.defineField(a, function() {}, b)
            },
            defineField: function(a, b, c) {
                return p.defineField(this, a, b, c), this
            },
            destroy: function() {
                this.each(function() {
                    var a;
                    this.trigger("Remove");
                    for (var b in this.__c) a = h[b], a && "remove" in a && a.remove.call(this, !0);
                    this._unbindAll(), delete i[this[0]]
                })
            }
        }, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function(a) {
            var b, c = this;
            if (!a) return c;
            for (b in a) c !== a[b] && (c[b] = a[b]);
            return c
        }, p._callbackMethods = {
            _bindCallback: function(a, b) {
                var c = this._callbacks[a];
                c || (c = this._callbacks[a] = (j[a] || (j[a] = {}))[this[0]] = [], c.context = this, c.depth = 0), c.push(b)
            },
            _runCallbacks: function(a, b) {
                if (this._callbacks[a]) {
                    var c, d = this._callbacks[a],
                        e = d.length;
                    for (d.depth++, c = 0; e > c; c++) "undefined" == typeof d[c] ? d.depth <= 1 && (d.splice(c, 1), c--, e--, 0 === d.length && (delete this._callbacks[a], delete j[a][this[0]])) : d[c].call(this, b);
                    d.depth--
                }
            },
            _unbindCallbacks: function(a, b) {
                if (this._callbacks[a])
                    for (var c = this._callbacks[a], d = 0; d < c.length; d++) b && c[d] != b || delete c[d]
            },
            _unbindAll: function() {
                if (this._callbacks)
                    for (var a in this._callbacks) this._callbacks[a] && (this._unbindCallbacks(a), delete j[a][this[0]])
            }
        }, p._addCallbackMethods = function(a) {
            a.extend(p._callbackMethods), a._callbacks = {}
        }, p._addCallbackMethods(p), p.extend({
            0: "global",
            init: function(a, b, c) {
                if (!this._preBindDone)
                    for (var d = 0; d < this._bindOnInit.length; d++) {
                        var e = this._bindOnInit[d];
                        p.bind(e.event, e.handler)
                    }
                return p.viewport.init(a, b, c), this.trigger("Load"), this.timer.init(), this
            },
            _bindOnInit: [],
            _preBindDone: !1,
            _preBind: function(a, b) {
                this._bindOnInit.push({
                    event: a,
                    handler: b
                })
            },
            getVersion: function() {
                return o
            },
            stop: function(a) {
                if (p.trigger("CraftyStop", a), this.timer.stop(), a) {
                    if (p.audio.remove(), p.stage && p.stage.elem.parentNode) {
                        var b = document.createElement("div");
                        b.id = p.stage.elem.id, p.stage.elem.parentNode.replaceChild(b, p.stage.elem)
                    }
                    delete p.canvasLayer.context, delete p.domLayer._div, delete p.webgl.context, p._unbindAll(), p._addCallbackMethods(p), this._preBindDone = !1, q()
                }
                return this
            },
            pause: function(a) {
                return (1 === arguments.length ? a : !this._paused) ? (this.trigger("Pause"), this._paused = !0, setTimeout(function() {
                    p.timer.stop()
                }, 0), p.keydown = {}) : (this.trigger("Unpause"), this._paused = !1, setTimeout(function() {
                    p.timer.init()
                }, 0)), this
            },
            isPaused: function() {
                return this._paused
            },
            timer: function() {
                var a, b, c, d = "fixed",
                    e = 5,
                    f = 40,
                    h = 0,
                    i = 0,
                    j = 50,
                    k = 1e3 / j;
                return {
                    init: function() {
                        "undefined" == typeof c && (c = (new Date).getTime() - k);
                        var d = "undefined" != typeof window && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null);
                        d ? (a = function() {
                            p.timer.step(), null !== a && (b = d(a))
                        })() : a = setInterval(function() {
                            p.timer.step()
                        }, 1e3 / j)
                    },
                    stop: function() {
                        p.trigger("CraftyStopTimer"), "function" != typeof a && clearInterval(a);
                        var c = "undefined" != typeof window && (window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || null);
                        c && c(b), a = null
                    },
                    steptype: function(a, b) {
                        if ("variable" === a || "semifixed" === a) d = a, b && (f = b);
                        else {
                            if ("fixed" !== a) throw "Invalid step type specified";
                            d = "fixed", b && (e = b)
                        }
                    },
                    step: function() {
                        var a, b, j, l = 0;
                        if (currentTime = (new Date).getTime(), h > 0 && p.trigger("MeasureWaitTime", currentTime - h), c + i >= currentTime) return void(h = currentTime);
                        var m = currentTime - (c + i);
                        m > 20 * k && (i += m - k, m = k), "fixed" === d ? (l = Math.ceil(m / k), l = Math.min(l, e), b = k) : "variable" === d ? (l = 1, b = m, b = Math.min(b, f)) : "semifixed" === d && (l = Math.ceil(m / f), b = m / l);
                        for (var n = 0; l > n; n++) {
                            j = currentTime;
                            var o = {
                                frame: g++,
                                dt: b,
                                gameTime: c
                            };
                            p.trigger("EnterFrame", o), p.trigger("ExitFrame", o), c += b, currentTime = (new Date).getTime(), p.trigger("MeasureFrameTime", currentTime - j)
                        }
                        l > 0 && (a = currentTime, p.trigger("PreRender"), p.trigger("RenderScene"), p.trigger("PostRender"), currentTime = (new Date).getTime(), p.trigger("MeasureRenderTime", currentTime - a)), h = currentTime
                    },
                    FPS: function(a) {
                        return "undefined" == typeof a ? j : (j = a, k = 1e3 / j, p.trigger("FPSChange", a), void 0)
                    },
                    simulateFrames: function(a, b) {
                        for ("undefined" == typeof b && (b = k); a-- > 0;) {
                            var c = {
                                frame: g++,
                                dt: b
                            };
                            p.trigger("EnterFrame", c), p.trigger("ExitFrame", c)
                        }
                        p.trigger("PreRender"), p.trigger("RenderScene"), p.trigger("PostRender")
                    }
                }
            }(),
            e: function() {
                var a = d();
                return i[a] = null, i[a] = p(a), arguments.length > 0 && i[a].addComponent.apply(i[a], arguments), i[a].setName("Entity #" + a), i[a].addComponent("obj"), p.trigger("NewEntity", {
                    id: a
                }), i[a]
            },
            c: function(a, b) {
                h[a] = b
            },
            trigger: function(a, b) {
                var c, d, e = j[a] || (j[a] = {});
                for (c in e) e.hasOwnProperty(c) && (d = e[c], d && 0 !== d.length && d.context._runCallbacks(a, b))
            },
            bind: function(a, b) {
                return this._bindCallback(a, b), b
            },
            uniqueBind: function(a, b) {
                return this.unbind(a, b), this.bind(a, b)
            },
            one: function(a, b) {
                var c = this,
                    d = function(e) {
                        b.call(c, e), c.unbind(a, d)
                    };
                return c.bind(a, d)
            },
            unbind: function(a, b) {
                this._unbindCallbacks(a, b)
            },
            frame: function() {
                return g
            },
            components: function() {
                return h
            },
            isComp: function(a) {
                return a in h
            },
            debug: function(a) {
                return "handlers" === a ? j : i
            },
            settings: function() {
                var a = {},
                    b = {};
                return {
                    register: function(a, c) {
                        b[a] = c
                    },
                    modify: function(c, d) {
                        b[c] && (b[c].call(a[c], d), a[c] = d)
                    },
                    get: function(b) {
                        return a[b]
                    }
                }
            }(),
            defineField: function(a, b, c, d) {
                Object.defineProperty(a, b, {
                    get: c,
                    set: d,
                    configurable: !1,
                    enumerable: !0
                })
            },
            clone: e
        }), "function" == typeof define && define("crafty", [], function() {
            return p
        }), b.exports = p
    }, {
        "./version": 16
    }],
    8: [function(a, b, c) {
        (function(c) {
            var d = a("./core"),
                e = "undefined" != typeof window && window.document;
            ! function() {
                var a = d.support = {},
                    b = "undefined" != typeof navigator && navigator.userAgent.toLowerCase() || "undefined" != typeof c && c.version,
                    f = /(webkit)[ \/]([\w.]+)/.exec(b) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(b) || /(ms)ie ([\w.]+)/.exec(b) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(b) || /(v)\d+\.(\d+)/.exec(b) || [],
                    g = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(b);
                if (g && (d.mobile = g[0]), a.defineProperty = function() {
                        if (!("defineProperty" in Object)) return !1;
                        try {
                            Object.defineProperty({}, "x", {})
                        } catch (a) {
                            return !1
                        }
                        return !0
                    }(), a.audio = "undefined" != typeof window && "canPlayType" in e.createElement("audio"), a.prefix = f[1] || f[0], "moz" === a.prefix && (a.prefix = "Moz"), "o" === a.prefix && (a.prefix = "O"), "v" === a.prefix && (a.prefix = "node"), f[2] && (a.versionName = f[2], a.version = +f[2].split(".")[0]), a.canvas = "undefined" != typeof window && "getContext" in e.createElement("canvas"), a.canvas) {
                    var h;
                    try {
                        var i = e.createElement("canvas");
                        h = i.getContext("webgl") || i.getContext("experimental-webgl"), h.viewportWidth = a.canvas.width, h.viewportHeight = a.canvas.height
                    } catch (j) {}
                    a.webgl = !!h
                } else a.webgl = !1;
                a.css3dtransform = "undefined" != typeof window && ("undefined" != typeof e.createElement("div").style.Perspective || "undefined" != typeof e.createElement("div").style[a.prefix + "Perspective"]), a.deviceorientation = "undefined" != typeof window && ("undefined" != typeof window.DeviceOrientationEvent || "undefined" != typeof window.OrientationEvent), a.devicemotion = "undefined" != typeof window && "undefined" != typeof window.DeviceMotionEvent
            }(), b.exports = {
                _events: {},
                addEvent: function(a, b, c, d) {
                    3 === arguments.length && (d = c, c = b, b = window.document);
                    var e = function(b) {
                            d.call(a, b)
                        },
                        f = a[0] || "";
                    this._events[f + b + c + d] || (this._events[f + b + c + d] = e, b.addEventListener(c, e, !1))
                },
                removeEvent: function(a, b, c, d) {
                    3 === arguments.length && (d = c, c = b, b = window.document);
                    var e = a[0] || "",
                        f = this._events[e + b + c + d];
                    f && (b.removeEventListener(c, f, !1), delete this._events[e + b + c + d])
                },
                background: function(a) {
                    d.stage.elem.style.background = a
                }
            }
        }).call(this, a("_process"))
    }, {
        "./core": 7,
        _process: 1
    }],
    9: [function(a, b, c) {
        var d = a("../core/core.js");
        b.exports = {
            assets: {},
            __paths: {
                audio: "",
                images: ""
            },
            paths: function(a) {
                return "undefined" == typeof a ? this.__paths : (a.audio && (this.__paths.audio = a.audio), void(a.images && (this.__paths.images = a.images)))
            },
            asset: function(a, b) {
                return 1 === arguments.length ? d.assets[a] : d.assets[a] ? void 0 : (d.assets[a] = b, this.trigger("NewAsset", {
                    key: a,
                    value: b
                }), b)
            },
            image_whitelist: ["jpg", "jpeg", "gif", "png", "svg"],
            load: function(a, b, c, e) {
                function f() {
                    var a = this.src;
                    this.removeEventListener && this.removeEventListener("canplaythrough", f, !1), m++, c && c({
                        loaded: m,
                        total: n,
                        percent: m / n * 100,
                        src: a
                    }), m === n && b && b()
                }

                function g() {
                    var a = this.src;
                    e && e({
                        loaded: m,
                        total: n,
                        percent: m / n * 100,
                        src: a
                    }), m++, m === n && b && b()
                }
                Array.isArray(a) && d.log("Calling Crafty.load with an array of assets no longer works; see the docs for more details."), a = "string" == typeof a ? JSON.parse(a) : a;
                var h, i, j, k, l, m = 0,
                    n = (a.audio ? Object.keys(a.audio).length : 0) + (a.images ? Object.keys(a.images).length : 0) + (a.sprites ? Object.keys(a.sprites).length : 0),
                    o = d.support.audio,
                    p = d.paths(),
                    q = function(a) {
                        return a.substr(a.lastIndexOf(".") + 1).toLowerCase()
                    },
                    r = function(a, b) {
                        return -1 === b.search("://") ? "audio" == a ? p.audio + b : p.images + b : b
                    },
                    s = function(a) {
                        return d.asset(a) || null
                    },
                    t = function(a) {
                        return d.audio.supports(q(a))
                    },
                    u = function(a) {
                        return -1 != d.image_whitelist.indexOf(q(a))
                    },
                    v = function(a, b) {
                        a.onload = f, "webkit" === d.support.prefix && (a.src = ""), a.src = b
                    };
                for (k in a)
                    for (l in a[k])
                        if (a[k].hasOwnProperty(l)) {
                            if (h = a[k][l], "audio" === k && o) {
                                if ("object" == typeof h) {
                                    var w = [];
                                    for (var x in h) i = r(k, h[x]), !s(i) && t(h[x]) && w.push(i);
                                    j = d.audio.add(l, w).obj
                                } else "string" == typeof h && t(h) && (i = r(k, h), s(i) || (j = d.audio.add(l, i).obj));
                                j && j.addEventListener && j.addEventListener("canplaythrough", f, !1)
                            } else l = "sprites" === k ? l : h, i = r(k, l), u(l) && (j = s(i), j || (j = new Image, "sprites" === k && d.sprite(h.tile, h.tileh, i, h.map, h.paddingX, h.paddingY, h.paddingAroundBorder), d.asset(i, j)), v(j, i));
                            j ? j.onerror = g : --n
                        }
                0 === n && b()
            },
            removeAssets: function(a) {
                a = "string" == typeof a ? JSON.parse(a) : a;
                var b, c, e, f, g = d.paths(),
                    h = function(a, b) {
                        return -1 === b.search("://") ? "audio" == a ? g.audio + b : g.images + b : b
                    };
                for (e in a)
                    for (f in a[e])
                        if (a[e].hasOwnProperty(f))
                            if (b = a[e][f], "audio" === e)
                                if ("object" == typeof b)
                                    for (var i in b) c = h(e, b[i]), d.asset(c) && d.audio.remove(f);
                                else "string" == typeof b && (c = h(e, b), d.asset(c) && d.audio.remove(f));
                else if (f = "sprites" === e ? f : b, c = h(e, f), d.asset(c)) {
                    if ("sprites" === e)
                        for (var j in b.map) delete d.components()[j];
                    delete d.assets[c]
                }
            }
        }
    }, {
        "../core/core.js": 7
    }],
    10: [function(a, b, c) {
        b.exports = {
            init: function() {
                this.changed = [], this.bind("Change", this._changed_attributes), this.bind("Change", this._changed_triggers)
            },
            _changed_triggers: function(a, b) {
                var c;
                b = Crafty.extend.call({
                    pre: ""
                }, b);
                for (c in a) this.trigger("Change[" + b.pre + c + "]", a[c]), a[c].constructor === Object && this._changed_triggers(a[c], {
                    pre: b.pre + c + "."
                })
            },
            _changed_attributes: function(a) {
                var b;
                for (b in a) this.changed.push(b);
                return this
            },
            is_dirty: function(a) {
                return 0 === arguments.length ? !!this.changed.length : this.changed.indexOf(a) > -1
            }
        }
    }, {}],
    11: [function(a, b, c) {
        var d = a("../core/core.js");
        b.exports = {
            _scenes: {},
            _current: null,
            scene: function(a, b, c) {
                return 1 === arguments.length || "function" != typeof arguments[1] ? void d.enterScene(a, arguments[1]) : void d.defineScene(a, b, c)
            },
            defineScene: function(a, b, c) {
                if ("function" != typeof b) throw "Init function is the wrong type.";
                this._scenes[a] = {}, this._scenes[a].initialize = b, "undefined" != typeof c && (this._scenes[a].uninitialize = c)
            },
            enterScene: function(a, b) {
                if ("function" == typeof b) throw "Scene data cannot be a function";
                d.trigger("SceneDestroy", {
                    newScene: a
                }), d.viewport.reset(), d("2D").each(function() {
                    this.has("Persist") || this.destroy()
                }), null !== this._current && "uninitialize" in this._scenes[this._current] && this._scenes[this._current].uninitialize.call(this);
                var c = this._current;
                this._current = a, d.trigger("SceneChange", {
                    oldScene: c,
                    newScene: a
                }), this._scenes.hasOwnProperty(a) ? this._scenes[a].initialize.call(this, b) : d.error('The scene "' + a + '" does not exist')
            }
        }
    }, {
        "../core/core.js": 7
    }],
    12: [function(a, b, c) {
        var d = a("../core/core.js");
        try {
            var e = "undefined" != typeof window && window.localStorage || new a("node-localstorage").LocalStorage("./localStorage")
        } catch (f) {
            var e = null
        }
        var g = function(a, b) {
            var c = b;
            if (!e) return d.error("Local storage is not accessible.  (Perhaps you are including crafty.js cross-domain?)"), !1;
            if (1 === arguments.length) try {
                return JSON.parse(e.getItem(a))
            } catch (f) {
                return e.getItem(a)
            } else "object" == typeof b && (c = JSON.stringify(b)), e.setItem(a, c)
        };
        g.remove = function(a) {
            return e ? void e.removeItem(a) : void d.error("Local storage is not accessible.  (Perhaps you are including crafty.js cross-domain?)")
        }, b.exports = g
    }, {
        "../core/core.js": 7
    }],
    13: [function(a, b, c) {
        var d = a("../core/core.js");
        d._systems = {}, d.s = function(a, b, c) {
            return b ? void(c === !1 ? (d._systems[a] = new d.CraftySystem(a, b), d.trigger("SystemLoaded", a)) : d._registerLazySystem(a, b)) : d._systems[a]
        }, d._registerLazySystem = function(a, b) {
            Object.defineProperty(d._systems, a, {
                get: function() {
                    return Object.defineProperty(d._systems, a, {
                        value: new d.CraftySystem(a, b),
                        writable: !0,
                        enumerable: !0,
                        configurable: !0
                    }), d.trigger("SystemLoaded", a), d._systems[a]
                },
                configurable: !0
            })
        }, d.CraftySystem = function() {
            return systemID = 1,
                function(a, b) {
                    if (this.name = a, !b) return this;
                    if (this._systemTemplate = b, this.extend(b), d._addCallbackMethods(this), this[0] = "system" + systemID++, "function" == typeof this.init && this.init(a), "events" in b) {
                        var c = b.events;
                        for (var e in c) {
                            var f = "function" == typeof c[e] ? c[e] : b[c[e]];
                            this.bind(e, f)
                        }
                    }
                }
        }(), d.CraftySystem.prototype = {
            extend: function(a) {
                for (var b in a) "undefined" == typeof this[b] && (this[b] = a[b])
            },
            bind: function(a, b) {
                return this._bindCallback(a, b), this
            },
            trigger: function(a, b) {
                return this._runCallbacks(a, b), this
            },
            unbind: function(a, b) {
                return this._unbindCallbacks(a, b), this
            },
            one: function(a, b) {
                var c = this,
                    d = function(e) {
                        b.call(c, e), c.unbind(a, d)
                    };
                return c.bind(a, d)
            },
            uniqueBind: function(a, b) {
                return this.unbind(a, b), this.bind(a, b)
            },
            destroy: function() {
                d.trigger("SystemDestroyed", this), "function" == typeof this.remove && this.remove(), this._unbindAll(), delete d._systems[this.name]
            }
        }
    }, {
        "../core/core.js": 7
    }],
    14: [function(a, b, c) {
        b.exports = {
            init: function() {
                this._delays = [], this.bind("EnterFrame", function(a) {
                    for (var b = this._delays.length; --b >= 0;) {
                        var c = this._delays[b];
                        if (c === !1) this._delays.splice(b, 1);
                        else {
                            for (c.accumulator += a.dt; c.accumulator >= c.delay && c.repeat >= 0;) c.accumulator -= c.delay, c.repeat--, c.callback.call(this);
                            c.repeat < 0 && (this._delays.splice(b, 1), "function" == typeof c.callbackOff && c.callbackOff.call(this))
                        }
                    }
                })
            },
            delay: function(a, b, c, d) {
                return this._delays.push({
                    accumulator: 0,
                    callback: a,
                    callbackOff: d,
                    delay: b,
                    repeat: (0 > c ? 1 / 0 : c) || 0
                }), this
            },
            cancelDelay: function(a) {
                for (var b = this._delays.length; --b >= 0;) {
                    var c = this._delays[b];
                    c && c.callback == a && (this._delays[b] = !1)
                }
                return this
            }
        }
    }, {}],
    15: [function(a, b, c) {
        b.exports = {
            init: function() {
                this.tweenGroup = {}, this.tweenStart = {}, this.tweens = [], this.uniqueBind("EnterFrame", this._tweenTick)
            },
            _tweenTick: function(a) {
                var b, c, d;
                for (d = this.tweens.length - 1; d >= 0; d--) b = this.tweens[d], b.easing.tick(a.dt), c = b.easing.value(), this._doTween(b.props, c), b.easing.complete && (this.tweens.splice(d, 1), this._endTween(b.props))
            },
            _doTween: function(a, b) {
                for (var c in a) this[c] = (1 - b) * this.tweenStart[c] + b * a[c]
            },
            tween: function(a, b, c) {
                var d = {
                    props: a,
                    easing: new Crafty.easing(b, c)
                };
                for (var e in a) "undefined" != typeof this.tweenGroup[e] && this.cancelTween(e), this.tweenStart[e] = this[e], this.tweenGroup[e] = a;
                return this.tweens.push(d), this
            },
            cancelTween: function(a) {
                if ("string" == typeof a) "object" == typeof this.tweenGroup[a] && delete this.tweenGroup[a][a];
                else if ("object" == typeof a)
                    for (var b in a) this.cancelTween(b);
                return this
            },
            pauseTweens: function() {
                this.tweens.map(function(a) {
                    a.easing.pause()
                })
            },
            resumeTweens: function() {
                this.tweens.map(function(a) {
                    a.easing.resume()
                })
            },
            _endTween: function(a) {
                for (var b in a) delete this.tweenGroup[b];
                this.trigger("TweenEnd", a)
            }
        }
    }, {}],
    16: [function(a, b, c) {
        b.exports = "0.7.1"
    }, {}],
    17: [function(a, b, c) {
        var d = a("./core/core");
        d.easing = a("./core/animation"), d.extend(a("./core/extensions")), d.extend(a("./core/loader")), d.c("Model", a("./core/model")), d.extend(a("./core/scenes")), d.storage = a("./core/storage"), d.c("Delay", a("./core/time")), d.c("Tween", a("./core/tween")), a("./core/systems"), a("./spatial/2d"), a("./spatial/collision"), a("./spatial/spatial-grid"), a("./spatial/rect-manager"), a("./spatial/math"), a("./graphics/canvas"), a("./graphics/canvas-layer"), a("./graphics/color"), a("./graphics/dom"), a("./graphics/dom-helper"), a("./graphics/dom-layer"), a("./graphics/drawing"), a("./graphics/gl-textures"), a("./graphics/html"), a("./graphics/image"), a("./graphics/particles"), a("./graphics/sprite-animation"), a("./graphics/sprite"), a("./graphics/text"), a("./graphics/viewport"), a("./graphics/webgl"), a("./isometric/diamond-iso"), a("./isometric/isometric"), a("./controls/inputs"), a("./controls/controls"), a("./controls/device"), a("./controls/keycodes"), a("./sound/sound"), a("./debug/debug-layer"), a("./debug/logging"), window && (window.Crafty = d), b.exports = d
    }, {
        "./controls/controls": 2,
        "./controls/device": 3,
        "./controls/inputs": 4,
        "./controls/keycodes": 5,
        "./core/animation": 6,
        "./core/core": 7,
        "./core/extensions": 8,
        "./core/loader": 9,
        "./core/model": 10,
        "./core/scenes": 11,
        "./core/storage": 12,
        "./core/systems": 13,
        "./core/time": 14,
        "./core/tween": 15,
        "./debug/debug-layer": 18,
        "./debug/logging": 19,
        "./graphics/canvas": 21,
        "./graphics/canvas-layer": 20,
        "./graphics/color": 22,
        "./graphics/dom": 25,
        "./graphics/dom-helper": 23,
        "./graphics/dom-layer": 24,
        "./graphics/drawing": 26,
        "./graphics/gl-textures": 27,
        "./graphics/html": 28,
        "./graphics/image": 29,
        "./graphics/particles": 30,
        "./graphics/sprite": 32,
        "./graphics/sprite-animation": 31,
        "./graphics/text": 33,
        "./graphics/viewport": 34,
        "./graphics/webgl": 35,
        "./isometric/diamond-iso": 36,
        "./isometric/isometric": 37,
        "./sound/sound": 38,
        "./spatial/2d": 39,
        "./spatial/collision": 40,
        "./spatial/math": 41,
        "./spatial/rect-manager": 42,
        "./spatial/spatial-grid": 43
    }],
    18: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.c("DebugCanvas", {
            init: function() {
                this.requires("2D"), d.DebugCanvas.context || d.DebugCanvas.init(), d.DebugCanvas.add(this), this._debug = {
                    alpha: 1,
                    lineWidth: 1
                }, this.bind("RemoveComponent", this.onDebugRemove), this.bind("Remove", this.onDebugDestroy)
            },
            onDebugRemove: function(a) {
                "DebugCanvas" === a && d.DebugCanvas.remove(this)
            },
            onDebugDestroy: function(a) {
                d.DebugCanvas.remove(this)
            },
            debugAlpha: function(a) {
                return this._debug.alpha = a, this
            },
            debugFill: function(a) {
                return "undefined" == typeof a && (a = "red"), this._debug.fillStyle = a, this
            },
            debugStroke: function(a) {
                return "undefined" == typeof a && (a = "red"), this._debug.strokeStyle = a, this
            },
            debugDraw: function(a) {
                var b = a.globalAlpha,
                    c = this._debug;
                c.alpha && (a.globalAlpha = this._debug.alpha), c.strokeStyle && (a.strokeStyle = c.strokeStyle), c.lineWidth && (a.lineWidth = c.lineWidth), c.fillStyle && (a.fillStyle = c.fillStyle), this.trigger("DebugDraw"), a.globalAlpha = b
            }
        }), d.c("DebugRectangle", {
            init: function() {
                this.requires("2D, DebugCanvas")
            },
            debugRectangle: function(a) {
                return this.debugRect = a, this.unbind("DebugDraw", this.drawDebugRect), this.bind("DebugDraw", this.drawDebugRect), this
            },
            drawDebugRect: function() {
                var a = d.DebugCanvas.context,
                    b = this.debugRect;
                null !== b && void 0 !== b && b._h && b._w && (this._debug.fillStyle && a.fillRect(b._x, b._y, b._w, b._h), this._debug.strokeStyle && a.strokeRect(b._x, b._y, b._w, b._h))
            }
        }), d.c("VisibleMBR", {
            init: function() {
                this.requires("DebugRectangle").debugFill("purple").bind("EnterFrame", this._assignRect)
            },
            _assignRect: function() {
                this._mbr ? this.debugRectangle(this._mbr) : this.debugRectangle(this)
            }
        }), d.c("DebugPolygon", {
            init: function() {
                this.requires("2D, DebugCanvas")
            },
            debugPolygon: function(a) {
                return this.polygon = a, this.unbind("DebugDraw", this.drawDebugPolygon), this.bind("DebugDraw", this.drawDebugPolygon), this
            },
            drawDebugPolygon: function() {
                if ("undefined" != typeof this.polygon) {
                    var a = d.DebugCanvas.context;
                    a.beginPath();
                    for (var b = this.polygon.points, c = b.length, e = 0; c > e; e += 2) a.lineTo(b[e], b[e + 1]);
                    a.closePath(), this._debug.fillStyle && a.fill(), this._debug.strokeStyle && a.stroke()
                }
            }
        }), d.c("WiredHitBox", {
            init: function() {
                this.requires("DebugPolygon").debugStroke("red").matchHitBox(), this.bind("NewHitbox", this.matchHitBox)
            },
            matchHitBox: function() {
                this.debugPolygon(this.map)
            }
        }), d.c("SolidHitBox", {
            init: function() {
                this.requires("Collision, DebugPolygon").debugFill("orange").debugAlpha(.7).matchHitBox(), this.bind("NewHitbox", this.matchHitBox)
            },
            matchHitBox: function() {
                this.debugPolygon(this.map)
            }
        }), d.c("WiredAreaMap", {
            init: function() {
                this.requires("DebugPolygon").debugStroke("green").matchAreaMap(), this.bind("NewAreaMap", this.matchAreaMap)
            },
            matchAreaMap: function() {
                this.debugPolygon(this.mapArea)
            }
        }), d.c("SolidAreaMap", {
            init: function() {
                this.requires("DebugPolygon").debugFill("lime").debugAlpha(.7).matchAreaMap(), this.bind("NewAreaMap", this.matchAreaMap)
            },
            matchAreaMap: function() {
                this.debugPolygon(this.mapArea)
            }
        }), d.DebugCanvas = {
            context: null,
            entities: [],
            onetimeEntities: [],
            add: function(a) {
                this.entities.push(a)
            },
            remove: function(a) {
                for (var b = this.entities, c = b.length - 1; c >= 0; c--) b[c] == a && b.splice(c, 1)
            },
            init: function() {
                if (!d.DebugCanvas.context) {
                    if (!d.support.canvas) return d.trigger("NoCanvas"), void d.stop();
                    var a;
                    a = e.createElement("canvas"), a.width = d.viewport.width, a.height = d.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px", a.id = "debug-canvas", a.style.zIndex = 1e5, d.stage.elem.appendChild(a), d.DebugCanvas.context = a.getContext("2d"), d.DebugCanvas._canvas = a
                }
                d.unbind("RenderScene", d.DebugCanvas.renderScene), d.bind("RenderScene", d.DebugCanvas.renderScene)
            },
            renderScene: function(a) {
                a = a || d.viewport.rect();
                var b, c = d.DebugCanvas.entities,
                    e = 0,
                    f = c.length,
                    g = d.DebugCanvas.context,
                    h = d.viewport;
                for (g.setTransform(h._scale, 0, 0, h._scale, Math.round(h._x * h._scale), Math.round(h._y * h._scale)), g.clearRect(a._x, a._y, a._w, a._h); f > e; e++) b = c[e], b.debugDraw(g)
            }
        }
    }, {
        "../core/core.js": 7
    }],
    19: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            loggingEnabled: !0,
            log: function() {
                d.loggingEnabled && console && console.log && console.log.apply(console, arguments)
            },
            error: function() {
                d.loggingEnabled && console && console.error && console.error.apply(console, arguments)
            }
        })
    }, {
        "../core/core.js": 7
    }],
    20: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            canvasLayer: {
                _dirtyRects: [],
                _changedObjs: [],
                layerCount: 0,
                _dirtyViewport: !1,
                _sort: function(a, b) {
                    return a._globalZ - b._globalZ
                },
                add: function(a) {
                    this._changedObjs.push(a)
                },
                context: null,
                _canvas: null,
                init: function() {
                    if (!d.support.canvas) return d.trigger("NoCanvas"), void d.stop();
                    this._dirtyRects = [], this._changedObjs = [], this.layerCount = 0;
                    var a;
                    a = document.createElement("canvas"), a.width = d.viewport.width, a.height = d.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px";
                    d.canvasLayer;
                    d.stage.elem.appendChild(a), this.context = a.getContext("2d"), this._canvas = a;
                    var b = d.viewport._scale;
                    1 != b && a.scale(b, b), this._setPixelart(d._pixelartEnabled), d.uniqueBind("PixelartSet", this._setPixelart), d.uniqueBind("RenderScene", this._render), d.uniqueBind("ViewportResize", this._resize), d.bind("InvalidateViewport", function() {
                        d.canvasLayer._dirtyViewport = !0
                    })
                },
                _render: function() {
                    var a = d.canvasLayer,
                        b = a._dirtyViewport,
                        c = a._changedObjs.length,
                        e = a.context;
                    if (c || b) {
                        if (b) {
                            var f = d.viewport;
                            e.setTransform(f._scale, 0, 0, f._scale, Math.round(f._x * f._scale), Math.round(f._y * f._scale))
                        }
                        c / a.layerCount > .6 || b ? a._drawAll() : a._drawDirty(), a._clean()
                    }
                },
                _drawDirty: function() {
                    var a, b, c, e, f, g, h = this._changedObjs,
                        i = h.length,
                        j = this._dirtyRects,
                        k = d.rectManager,
                        l = k.overlap,
                        m = this.context,
                        n = [],
                        o = [];
                    for (a = 0; i > a; a++) this._createDirty(h[a]);
                    for (k.mergeSet(j), i = j.length, a = 0; i > a; ++a)
                        if (e = j[a], n.length = 0, o.length = 0, e) {
                            for (e._w = e._x + e._w, e._h = e._y + e._h, e._x = e._x > 0 ? 0 | e._x : (0 | e._x) - 1, e._y = e._y > 0 ? 0 | e._y : (0 | e._y) - 1, e._w -= e._x, e._h -= e._y, e._w = e._w === (0 | e._w) ? e._w : (0 | e._w) + 1, e._h = e._h === (0 | e._h) ? e._h : (0 | e._h) + 1, c = d.map.search(e, !1), m.clearRect(e._x, e._y, e._w, e._h), m.save(), m.beginPath(), m.rect(e._x, e._y, e._w, e._h), m.clip(), b = 0, f = c.length; f > b; ++b) g = c[b], !n[g[0]] && g._visible && g.__c.Canvas && (n[g[0]] = !0, o.push(g));
                            for (o.sort(this._sort), b = 0, f = o.length; f > b; ++b) {
                                g = o[b];
                                var p = g._mbr || g;
                                l(p, e) && g.draw(), g._changed = !1
                            }
                            m.closePath(), m.restore()
                        }
                    if (d.canvasLayer.debugDirty === !0)
                        for (m.strokeStyle = "red", a = 0, i = j.length; i > a; ++a) e = j[a], m.strokeRect(e._x, e._y, e._w, e._h)
                },
                _drawAll: function(a) {
                    a = a || d.viewport.rect();
                    var b, c = d.map.search(a),
                        e = 0,
                        f = c.length,
                        g = this.context;
                    for (g.clearRect(a._x, a._y, a._w, a._h), c.sort(this._sort); f > e; e++) b = c[e], b._visible && b.__c.Canvas && (b.draw(), b._changed = !1)
                },
                debug: function() {
                    d.log(this._changedObjs)
                },
                _clean: function() {
                    var a, b, c, d, e = this._changedObjs;
                    for (c = 0, d = e.length; d > c; c++) b = e[c], a = b._mbr || b, "undefined" == typeof b.staleRect && (b.staleRect = {}), b.staleRect._x = a._x, b.staleRect._y = a._y, b.staleRect._w = a._w, b.staleRect._h = a._h, b._changed = !1;
                    e.length = 0, this._dirtyRects.length = 0, this._dirtyViewport = !1
                },
                _createDirty: function(a) {
                    var b = a._mbr || a,
                        c = this._dirtyRects,
                        e = d.rectManager;
                    if (a.staleRect) {
                        if (e.overlap(a.staleRect, b)) return e.merge(a.staleRect, b, a.staleRect), void c.push(a.staleRect);
                        c.push(a.staleRect)
                    }
                    a.currentRect._x = b._x, a.currentRect._y = b._y, a.currentRect._w = b._w, a.currentRect._h = b._h, c.push(a.currentRect)
                },
                _resize: function() {
                    var a = d.canvasLayer._canvas;
                    a.width = d.viewport.width, a.height = d.viewport.height
                },
                _setPixelart: function(a) {
                    var b = d.canvasLayer.context;
                    b.imageSmoothingEnabled = !a, b.mozImageSmoothingEnabled = !a, b.webkitImageSmoothingEnabled = !a, b.oImageSmoothingEnabled = !a, b.msImageSmoothingEnabled = !a
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    21: [function(a, b, c) {
        var d = a("../core/core.js");
        d.c("Canvas", {
            init: function() {
                var a = d.canvasLayer;
                a.context || a.init(), this._drawLayer = a, this._drawContext = a.context, a.layerCount++, this.currentRect = {}, this._changed = !0, a.add(this), this.bind("Invalidate", function(b) {
                    this._changed === !1 && (this._changed = !0, a.add(this))
                }), this.bind("Remove", function() {
                    this._drawLayer.layerCount--, this._changed = !0, this._drawLayer.add(this)
                })
            },
            drawVars: {
                type: "canvas",
                pos: {},
                ctx: null,
                coord: [0, 0, 0, 0],
                co: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            },
            draw: function(a, b, c, d, e) {
                if (this.ready) {
                    4 === arguments.length && (e = d, d = c, c = b, b = a, a = this._drawContext);
                    var f = this.drawVars.pos;
                    f._x = this._x + (b || 0), f._y = this._y + (c || 0), f._w = d || this._w, f._h = e || this._h, context = a || this._drawContext, coord = this.__coord || [0, 0, 0, 0];
                    var g = this.drawVars.co;
                    g.x = coord[0] + (b || 0), g.y = coord[1] + (c || 0), g.w = d || coord[2], g.h = e || coord[3], (this._flipX || this._flipY || this._rotation) && context.save(), 0 !== this._rotation && (context.translate(this._origin.x + this._x, this._origin.y + this._y), f._x = -this._origin.x, f._y = -this._origin.y, context.rotate(this._rotation % 360 * (Math.PI / 180))), (this._flipX || this._flipY) && (context.scale(this._flipX ? -1 : 1, this._flipY ? -1 : 1), this._flipX && (f._x = -(f._x + f._w)), this._flipY && (f._y = -(f._y + f._h)));
                    var h;
                    return this._alpha < 1 && (h = context.globalAlpha, context.globalAlpha = this._alpha), this.drawVars.ctx = context, this.trigger("Draw", this.drawVars), (0 !== this._rotation || this._flipX || this._flipY) && context.restore(), h && (context.globalAlpha = h), this
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    22: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.extend({
            assignColor: function() {
                function a(a) {
                    return a._red = a._blue = a._green = 0, a
                }

                function b(a) {
                    var b = a.toString(16);
                    return 1 == b.length && (b = "0" + b), b
                }

                function c(a, c, d) {
                    return "#" + b(a) + b(c) + b(d)
                }

                function d(b, c) {
                    var d;
                    if (7 === b.length) d = 2;
                    else {
                        if (4 !== b.length) return a(c);
                        d = 1
                    }
                    return c._red = parseInt(b.substr(1, d), 16), c._green = parseInt(b.substr(1 + d, d), 16), c._blue = parseInt(b.substr(1 + 2 * d, d), 16), c
                }

                function f(b, c) {
                    var d = l.exec(b);
                    return null === d || 4 != d.length && 5 != d.length ? a(c) : (c._red = Math.round(parseFloat(d[1])), c._green = Math.round(parseFloat(d[2])), c._blue = Math.round(parseFloat(d[3])), d[4] && (c._strength = parseFloat(d[4])), c)
                }

                function g(a, b) {
                    if ("undefined" == typeof k[a]) {
                        j === !1 && (window.document.body.appendChild(i), j = !0), i.style.color = a;
                        var e = window.getComputedStyle(i).color;
                        f(e, b), k[a] = c(b._red, b._green, b._blue)
                    } else d(k[a], b);
                    return b
                }

                function h(a) {
                    return "rgba(" + a._red + ", " + a._green + ", " + a._blue + ", " + a._strength + ")"
                }
                var i = e.createElement("div");
                i.style.display = "none";
                var j = !1,
                    k = {
                        aqua: "#00ffff",
                        black: "#000000",
                        blue: "#0000ff",
                        fuchsia: "#ff00ff",
                        gray: "#808080",
                        green: "#00ff00",
                        lime: "#00ff00",
                        maroon: "#800000",
                        navy: "#000080",
                        olive: "#808000",
                        orange: "#ffa500",
                        purple: "#800080",
                        red: "#ff0000",
                        silver: "#c0c0c0",
                        teal: "#008080",
                        white: "#ffffff",
                        yellow: "#ffff00"
                    },
                    l = /rgba?\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,?\s*([0-9.]+)?\)/;
                return function(a, b) {
                    b = b || {}, a = a.trim().toLowerCase();
                    var c = null;
                    c = "#" === a[0] ? d(a, b) : "r" === a[0] && "g" === a[1] && "b" === a[2] ? f(a, b) : g(a, b), b._strength = b._strength || 1, b._color = h(b)
                }
            }()
        });
        var f = "attribute vec2 aPosition;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec4 aColor;\n\nvarying lowp vec4 vColor;\n\nuniform  vec4 uViewport;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n  vColor = vec4(aColor.rgb*aColor.a*aLayer.y, aColor.a*aLayer.y);\n}",
            g = "precision mediump float;\nvarying lowp vec4 vColor;\nvoid main(void) {\n	gl_FragColor = vColor;\n}",
            h = [{
                name: "aPosition",
                width: 2
            }, {
                name: "aOrientation",
                width: 3
            }, {
                name: "aLayer",
                width: 2
            }, {
                name: "aColor",
                width: 4
            }];
        d.c("Color", {
            _red: 0,
            _green: 0,
            _blue: 0,
            _strength: 1,
            _color: "",
            ready: !0,
            init: function() {
                this.bind("Draw", this._drawColor), this.has("WebGL") && this._establishShader("Color", g, f, h), this.trigger("Invalidate")
            },
            remove: function() {
                this.unbind("Draw", this._drawColor), this.has("DOM") && (this._element.style.backgroundColor = "transparent"), this.trigger("Invalidate")
            },
            _drawColor: function(a) {
                this._color && ("DOM" === a.type ? (a.style.backgroundColor = this._color, a.style.lineHeight = 0) : "canvas" === a.type ? (a.ctx.fillStyle = this._color, a.ctx.fillRect(a.pos._x, a.pos._y, a.pos._w, a.pos._h)) : "webgl" === a.type && a.program.writeVector("aColor", this._red / 255, this._green / 255, this._blue / 255, this._strength))
            },
            color: function(a) {
                return 0 === arguments.length ? this._color : (arguments.length >= 3 ? (this._red = arguments[0], this._green = arguments[1], this._blue = arguments[2], "number" == typeof arguments[3] && (this._strength = arguments[3])) : (d.assignColor(a, this), "number" == typeof arguments[1] && (this._strength = arguments[1])), this._color = "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + this._strength + ")", this.trigger("Invalidate"), this)
            }
        })
    }, {
        "../core/core.js": 7
    }],
    23: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.extend({
            domHelper: {
                innerPosition: function(a) {
                    var b = a.getBoundingClientRect(),
                        c = b.left + (window.pageXOffset ? window.pageXOffset : e.body.scrollLeft),
                        d = b.top + (window.pageYOffset ? window.pageYOffset : e.body.scrollTop),
                        f = parseInt(this.getStyle(a, "border-left-width") || 0, 10) || parseInt(this.getStyle(a, "borderLeftWidth") || 0, 10) || 0,
                        g = parseInt(this.getStyle(a, "border-top-width") || 0, 10) || parseInt(this.getStyle(a, "borderTopWidth") || 0, 10) || 0;
                    return c += f, d += g, {
                        x: c,
                        y: d
                    }
                },
                getStyle: function(a, b) {
                    var c;
                    return a.currentStyle ? c = a.currentStyle[this.camelize(b)] : window.getComputedStyle && (c = e.defaultView.getComputedStyle(a, null).getPropertyValue(this.csselize(b))), c
                },
                camelize: function(a) {
                    return a.replace(/-+(.)?/g, function(a, b) {
                        return b ? b.toUpperCase() : ""
                    })
                },
                csselize: function(a) {
                    return a.replace(/[A-Z]/g, function(a) {
                        return a ? "-" + a.toLowerCase() : ""
                    })
                },
                translate: function(a, b) {
                    var c = e.documentElement,
                        f = e.body;
                    return {
                        x: (a - d.stage.x + (c && c.scrollLeft || f && f.scrollLeft || 0)) / d.viewport._scale - d.viewport._x,
                        y: (b - d.stage.y + (c && c.scrollTop || f && f.scrollTop || 0)) / d.viewport._scale - d.viewport._y
                    }
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    24: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.extend({
            domLayer: {
                _changedObjs: [],
                _dirtyViewport: !1,
                _div: null,
                init: function() {
                    this._changedObjs = [], this._dirtyViewport = !1;
                    var a = this._div = e.createElement("div");
                    d.stage.elem.appendChild(a), a.style.position = "absolute", a.style.zIndex = "1", a.style.transformStyle = "preserve-3d", d.uniqueBind("RenderScene", this._render), d.uniqueBind("PixelartSet", this._setPixelArt), d.uniqueBind("InvalidateViewport", function() {
                        d.domLayer._dirtyViewport = !0
                    })
                },
                _setPixelArt: function(a) {
                    var b = d.domLayer._div.style,
                        c = d.domHelper.camelize;
                    a ? (b[c("image-rendering")] = "optimizeSpeed", b[c("image-rendering")] = "-moz-crisp-edges", b[c("image-rendering")] = "-o-crisp-edges", b[c("image-rendering")] = "-webkit-optimize-contrast", b[c("-ms-interpolation-mode")] = "nearest-neighbor", b[c("image-rendering")] = "optimize-contrast", b[c("image-rendering")] = "pixelated", b[c("image-rendering")] = "crisp-edges") : (b[c("image-rendering")] = "optimizeQuality", b[c("-ms-interpolation-mode")] = "bicubic", b[c("image-rendering")] = "auto")
                },
                debug: function() {
                    d.log(this._changedObjs)
                },
                _render: function() {
                    var a = d.domLayer,
                        b = a._changedObjs;
                    if (a._dirtyViewport && (a._setViewport(), a._dirtyViewport = !1), b.length) {
                        for (var c = 0, e = b.length; e > c; ++c) b[c].draw()._changed = !1;
                        b.length = 0
                    }
                },
                add: function(a) {
                    this._changedObjs.push(a)
                },
                _setViewport: function() {
                    var a = d.domLayer._div.style,
                        b = d.viewport;
                    a.transform = a[d.support.prefix + "Transform"] = "scale(" + b._scale + ", " + b._scale + ")", a.left = Math.round(b._x * b._scale) + "px", a.top = Math.round(b._y * b._scale) + "px", a.zIndex = 10
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    25: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.c("DOM", {
            _element: null,
            _cssStyles: null,
            avoidCss3dTransforms: !1,
            init: function() {
                var a = d.domLayer;
                a._div || a.init(), this._drawLayer = a, this._cssStyles = {
                    visibility: "",
                    left: "",
                    top: "",
                    width: "",
                    height: "",
                    zIndex: "",
                    opacity: "",
                    transformOrigin: "",
                    transform: ""
                }, this._element = e.createElement("div"), a._div.appendChild(this._element), this._element.style.position = "absolute", this._element.id = "ent" + this[0], this.bind("Invalidate", this._invalidateDOM), this.bind("NewComponent", this._updateClass), this.bind("RemoveComponent", this._removeClass), this._invalidateDOM()
            },
            remove: function() {
                this.undraw(), this.unbind("NewComponent", this._updateClass), this.unbind("RemoveComponent", this._removeClass), this.unbind("Invalidate", this._invalidateDOM)
            },
            getDomId: function() {
                return this._element.id
            },
            _removeClass: function(a) {
                var b = 0,
                    c = this.__c,
                    d = "";
                for (b in c) b != a && (d += " " + b);
                d = d.substr(1), this._element.className = d
            },
            _updateClass: function() {
                var a = 0,
                    b = this.__c,
                    c = "";
                for (a in b) c += " " + a;
                c = c.substr(1), this._element.className = c
            },
            _invalidateDOM: function() {
                this._changed || (this._changed = !0, this._drawLayer.add(this))
            },
            DOM: function(a) {
                return a && a.nodeType && (this.undraw(), this._element = a, this._element.style.position = "absolute"), this
            },
            draw: function() {
                var a = this._element.style,
                    b = this.__coord || [0, 0, 0, 0],
                    c = {
                        x: b[0],
                        y: b[1],
                        w: b[2],
                        h: b[3]
                    },
                    e = d.support.prefix,
                    f = [];
                if (this._cssStyles.visibility !== this._visible && (this._cssStyles.visibility = this._visible, this._visible ? a.visibility = "visible" : a.visibility = "hidden"), d.support.css3dtransform && !this.avoidCss3dTransforms ? f.push("translate3d(" + ~~this._x + "px," + ~~this._y + "px,0)") : (this._cssStyles.left !== this._x && (this._cssStyles.left = this._x, a.left = ~~this._x + "px"), this._cssStyles.top !== this._y && (this._cssStyles.top = this._y, a.top = ~~this._y + "px")), this._cssStyles.width !== this._w && (this._cssStyles.width = this._w, a.width = ~~this._w + "px"), this._cssStyles.height !== this._h && (this._cssStyles.height = this._h, a.height = ~~this._h + "px"), this._cssStyles.zIndex !== this._z && (this._cssStyles.zIndex = this._z, a.zIndex = this._z), this._cssStyles.opacity !== this._alpha && (this._cssStyles.opacity = this._alpha, a.opacity = this._alpha, a[e + "Opacity"] = this._alpha), this._mbr) {
                    var g = this._origin.x + "px " + this._origin.y + "px";
                    a.transformOrigin = g, a[e + "TransformOrigin"] = g, d.support.css3dtransform ? f.push("rotateZ(" + this._rotation + "deg)") : f.push("rotate(" + this._rotation + "deg)")
                }
                return this._flipX && f.push("scaleX(-1)"), this._flipY && f.push("scaleY(-1)"), this._cssStyles.transform != f.join(" ") && (this._cssStyles.transform = f.join(" "), a.transform = this._cssStyles.transform, a[e + "Transform"] = this._cssStyles.transform), this.trigger("Draw", {
                    style: a,
                    type: "DOM",
                    co: c
                }), this
            },
            undraw: function() {
                var a = this._element;
                return a && null !== a.parentNode && a.parentNode.removeChild(a), this
            },
            css: function(a, b) {
                var c, e, f = this._element,
                    g = f.style;
                if ("object" == typeof a)
                    for (c in a) a.hasOwnProperty(c) && (e = a[c], "number" == typeof e && (e += "px"), g[d.domHelper.camelize(c)] = e);
                else {
                    if (!b) return d.domHelper.getStyle(f, a);
                    "number" == typeof b && (b += "px"), g[d.domHelper.camelize(a)] = b
                }
                return this.trigger("Invalidate"), this
            }
        })
    }, {
        "../core/core.js": 7
    }],
    26: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            _pixelartEnabled: !1,
            pixelart: function(a) {
                d._pixelartEnabled = a, d.trigger("PixelartSet", a)
            }
        })
    }, {
        "../core/core.js": 7
    }],
    27: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = d.TextureManager = function(a, b) {
                this.gl = a, this.webgl = b, this.max_units = a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS), this.bound_textures = [], this.registered_textures = {}, this.active = null
            };
        e.prototype = {
            reset: function() {
                for (var a, b = 0; b < this.bound_textures.length; b++) a = this.bound_textures[b], a.unbind();
                this.bound_textures = [], this.active = null
            },
            makeTexture: function(a, b, c) {
                var d = (this.gl, this.webgl),
                    e = "texture-(r:" + c + ")-" + a;
                if ("undefined" != typeof this.registered_textures[e]) return this.registered_textures[e];
                var g = new f(this, e);
                return this.registered_textures[e] = g, this.bindTexture(g), g.setImage(b), g.setFilter(d.texture_filter), g.setRepeat(c), g
            },
            smallest: function() {
                for (var a = 1 / 0, b = null, c = 0; c < this.bound_textures.length; c++) {
                    var d = this.bound_textures[c];
                    d.size < a && (a = d.size, b = c)
                }
                return b
            },
            getAvailableUnit: function() {
                return this.bound_textures.length < this.max_units ? this.bound_textures.length : this.smallest()
            },
            bindTexture: function(a) {
                if (null === a.unit) {
                    var b = this.getAvailableUnit();
                    this.bound_textures[b] && this.unbindTexture(this.bound_textures[b]), this.bound_textures[b] = a, a.bind(b)
                }
            },
            unbindTexture: function(a) {
                a.unbind()
            },
            setActiveTexture: function(a) {
                this.active !== a.id && (this.gl.activeTexture(this.gl[a.name]), this.active = a.unit)
            }
        };
        var f = d.TextureWrapper = function(a, b) {
            this.manager = a, this.gl = a.gl, this.glTexture = this.gl.createTexture(), this.id = b, this.active = !1, this.unit = null, this.powerOfTwo = !1
        };
        f.prototype = {
            bind: function(a) {
                var b = this.gl;
                this.unit = a, this.name = "TEXTURE" + a, this.manager.setActiveTexture(this), b.bindTexture(b.TEXTURE_2D, this.glTexture)
            },
            isActive: function() {
                return this.manager.active === this.unit
            },
            unbind: function() {
                this.unit = null, this.name = null, this.isActive() && (this.manager.active = null)
            },
            setImage: function(a) {
                if (!this.isActive()) throw "Trying to set image of texture that isn't active";
                this.width = a.width, this.height = a.height, this.size = a.width * a.height, this.powerOfTwo = !(Math.log(a.width) / Math.LN2 != Math.floor(Math.log(a.width) / Math.LN2) || Math.log(a.height) / Math.LN2 != Math.floor(Math.log(a.height) / Math.LN2));
                var b = this.gl;
                b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, a)
            },
            setFilter: function(a) {
                if (!this.isActive()) throw "Trying to set filter of texture that isn't active";
                var b = this.gl;
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, a), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, a)
            },
            setRepeat: function(a) {
                if (!this.isActive()) throw "Trying to set repeat property of texture that isn't active";
                if (a && !this.powerOfTwo) throw "Can't create a repeating image whose dimensions aren't a power of 2 in WebGL contexts";
                var b = this.gl;
                this.repeatMode = a ? b.REPEAT : b.CLAMP_TO_EDGE, b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, this.repeatMode), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, this.repeatMode)
            },
            setToProgram: function(a, b, c) {
                if (null === this.unit) throw "Trying to use texture not set to a texture unit.";
                var d = this.gl;
                d.useProgram(a), d.uniform1i(d.getUniformLocation(a, b), this.unit), d.uniform2f(d.getUniformLocation(a, c), this.width, this.height)
            }
        }
    }, {
        "../core/core.js": 7
    }],
    28: [function(a, b, c) {
        var d = a("../core/core.js");
        d.c("HTML", {
            inner: "",
            init: function() {
                this.requires("2D, DOM")
            },
            replace: function(a) {
                return this.inner = a, this._element.innerHTML = a, this
            },
            append: function(a) {
                return this.inner += a, this._element.innerHTML += a, this
            },
            prepend: function(a) {
                return this.inner = a + this.inner, this._element.innerHTML = a + this.inner, this
            }
        })
    }, {
        "../core/core.js": 7
    }],
    29: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = "attribute vec2 aPosition;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec2 aTextureCoord;\n\nvarying mediump vec3 vTextureCoord;\n\nuniform vec4 uViewport;\nuniform mediump vec2 uTextureDimensions;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n  \n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n  vTextureCoord = vec3(aTextureCoord, aLayer.y);\n}",
            f = "varying mediump vec3 vTextureCoord;\n  \nuniform sampler2D uSampler;\nuniform mediump vec2 uTextureDimensions;\n\nvoid main(void) {\n  highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;\n  mediump vec4 base_color = texture2D(uSampler, coord);\n  gl_FragColor = vec4(base_color.rgb*base_color.a*vTextureCoord.z, base_color.a*vTextureCoord.z);\n}",
            g = [{
                name: "aPosition",
                width: 2
            }, {
                name: "aOrientation",
                width: 3
            }, {
                name: "aLayer",
                width: 2
            }, {
                name: "aTextureCoord",
                width: 2
            }];
        d.c("Image", {
            _repeat: "repeat",
            ready: !1,
            init: function() {
                this.bind("Draw", this._drawImage)
            },
            remove: function() {
                this.unbind("Draw", this._drawImage)
            },
            image: function(a, b) {
                if (this.__image = a, this._repeat = b || "no-repeat", this.img = d.asset(a), this.img) this._onImageLoad();
                else {
                    this.img = new Image, d.asset(a, this.img), this.img.src = a;
                    var c = this;
                    this.img.onload = function() {
                        c._onImageLoad()
                    }
                }
                return this.trigger("Invalidate"), this
            },
            _onImageLoad: function() {
                this.has("Canvas") ? this._pattern = this._drawContext.createPattern(this.img, this._repeat) : this.has("WebGL") && (this._establishShader("image:" + this.__image, f, e, g), this.program.setTexture(this.webgl.makeTexture(this.__image, this.img, "no-repeat" !== this._repeat))), "no-repeat" === this._repeat && (this.w = this.w || this.img.width, this.h = this.h || this.img.height), this.ready = !0, this.trigger("Invalidate")
            },
            _drawImage: function(a) {
                if ("canvas" === a.type) {
                    if (!this.ready || !this._pattern) return;
                    var b = a.ctx;
                    b.fillStyle = this._pattern, b.save(), b.translate(a.pos._x, a.pos._y), b.fillRect(0, 0, a.pos._w, a.pos._h), b.restore()
                } else if ("DOM" === a.type) this.__image && (a.style.backgroundImage = "url(" + this.__image + ")", a.style.backgroundRepeat = this._repeat);
                else if ("webgl" === a.type) {
                    var c = a.pos;
                    a.program.writeVector("aTextureCoord", 0, 0, 0, c._h, c._w, 0, c._w, c._h)
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    30: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.c("Particles", {
            init: function() {
                this._Particles = d.clone(this._Particles), this._Particles.parentEntity = this
            },
            particles: function(a) {
                if (!d.support.canvas || d.deactivateParticles) return this;
                var b, c, f, g, h;
                b = e.createElement("canvas"), b.width = d.viewport.width, b.height = d.viewport.height, b.style.position = "absolute", b.style.left = "0px", b.style.top = "0px", d.stage.elem.appendChild(b), c = b.getContext("2d"), this._Particles.init(a), this.bind("Remove", function() {
                    d.stage.elem.removeChild(b)
                }).bind("RemoveComponent", function(a) {
                    "particles" === a && d.stage.elem.removeChild(b)
                }), f = this.x + d.viewport.x, g = this.y + d.viewport.y, this._Particles.position = this._Particles.vectorHelpers.create(f, g);
                var i = {
                    x: d.viewport.x,
                    y: d.viewport.y
                };
                return this.bind("EnterFrame", function() {
                    f = this.x + d.viewport.x, g = this.y + d.viewport.y, this._Particles.viewportDelta = {
                        x: d.viewport.x - i.x,
                        y: d.viewport.y - i.y
                    }, i = {
                        x: d.viewport.x,
                        y: d.viewport.y
                    }, this._Particles.position = this._Particles.vectorHelpers.create(f, g), "function" == typeof d.rectManager.boundingRect ? (h = d.rectManager.boundingRect(this._Particles.register), h && c.clearRect(h._x, h._y, h._w, h._h)) : c.clearRect(0, 0, d.viewport.width, d.viewport.height), this._Particles.update(), this._Particles.render(c)
                }), this
            },
            _Particles: {
                presets: {
                    maxParticles: 150,
                    size: 18,
                    sizeRandom: 4,
                    speed: 1,
                    speedRandom: 1.2,
                    lifeSpan: 29,
                    lifeSpanRandom: 7,
                    angle: 65,
                    angleRandom: 34,
                    startColour: [255, 131, 0, 1],
                    startColourRandom: [48, 50, 45, 0],
                    endColour: [245, 35, 0, 0],
                    endColourRandom: [60, 60, 60, 0],
                    sharpness: 20,
                    sharpnessRandom: 10,
                    spread: 10,
                    duration: -1,
                    fastMode: !1,
                    gravity: {
                        x: 0,
                        y: .1
                    },
                    jitter: 0,
                    originOffset: {
                        x: 0,
                        y: 0
                    },
                    particles: [],
                    active: !0,
                    particleCount: 0,
                    elapsedFrames: 0,
                    emissionRate: 0,
                    emitCounter: 0,
                    particleIndex: 0
                },
                init: function(a) {
                    this.position = this.vectorHelpers.create(0, 0), "undefined" == typeof a && (a = {});
                    for (var b in this.presets) "undefined" != typeof a[b] ? this[b] = a[b] : this[b] = this.presets[b];
                    this.emissionRate = this.maxParticles / this.lifeSpan, this.positionRandom = this.vectorHelpers.create(this.spread, this.spread)
                },
                addParticle: function() {
                    if (this.particleCount == this.maxParticles) return !1;
                    var a = new this.particle(this.vectorHelpers);
                    return this.initParticle(a), this.particles[this.particleCount] = a, this.particleCount++, !0
                },
                RANDM1TO1: function() {
                    return 2 * Math.random() - 1
                },
                initParticle: function(a) {
                    a.position.x = d.viewport._scale * (this.position.x + this.originOffset.x + this.positionRandom.x * this.RANDM1TO1()), a.position.y = d.viewport._scale * (this.position.y + this.originOffset.y + this.positionRandom.y * this.RANDM1TO1());
                    var b = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180),
                        c = this.vectorHelpers.create(Math.sin(b), -Math.cos(b)),
                        e = this.speed + this.speedRandom * this.RANDM1TO1();
                    a.direction = this.vectorHelpers.multiply(c, e), a.size = d.viewport._scale * (this.size + this.sizeRandom * this.RANDM1TO1()), a.size = a.size < 0 ? 0 : ~~a.size, a.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1(), a.sharpness = this.sharpness + this.sharpnessRandom * this.RANDM1TO1(), a.sharpness = a.sharpness > 100 ? 100 : a.sharpness < 0 ? 0 : a.sharpness, a.sizeSmall = ~~(a.size / 200 * a.sharpness);
                    var f = [this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(), this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(), this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(), this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1()],
                        g = [this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(), this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(), this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(), this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1()];
                    a.colour = f, a.deltaColour[0] = (g[0] - f[0]) / a.timeToLive, a.deltaColour[1] = (g[1] - f[1]) / a.timeToLive, a.deltaColour[2] = (g[2] - f[2]) / a.timeToLive, a.deltaColour[3] = (g[3] - f[3]) / a.timeToLive
                },
                update: function() {
                    if (this.active && this.emissionRate > 0) {
                        var a = 1 / this.emissionRate;
                        for (this.emitCounter++; this.particleCount < this.maxParticles && this.emitCounter > a;) this.addParticle(), this.emitCounter -= a;
                        this.elapsedFrames++, -1 != this.duration && this.duration < this.elapsedFrames && this.stop()
                    }
                    this.particleIndex = 0, this.register = [];
                    for (var b; this.particleIndex < this.particleCount;) {
                        var c = this.particles[this.particleIndex];
                        if (c.timeToLive > 0) {
                            c.direction = this.vectorHelpers.add(c.direction, this.gravity), c.position = this.vectorHelpers.add(c.position, c.direction), c.position = this.vectorHelpers.add(c.position, this.viewportDelta), this.jitter && (c.position.x += this.jitter * this.RANDM1TO1(), c.position.y += this.jitter * this.RANDM1TO1()), c.timeToLive--;
                            var d = c.colour[0] += c.deltaColour[0],
                                e = c.colour[1] += c.deltaColour[1],
                                f = c.colour[2] += c.deltaColour[2],
                                g = c.colour[3] += c.deltaColour[3];
                            b = [], b.push("rgba(" + (d > 255 ? 255 : 0 > d ? 0 : ~~d)), b.push(e > 255 ? 255 : 0 > e ? 0 : ~~e), b.push(f > 255 ? 255 : 0 > f ? 0 : ~~f), b.push((g > 1 ? 1 : 0 > g ? 0 : g.toFixed(2)) + ")"), c.drawColour = b.join(","), this.fastMode || (b[3] = "0)", c.drawColourEnd = b.join(",")), this.particleIndex++
                        } else this.particleIndex != this.particleCount - 1 && (this.particles[this.particleIndex] = this.particles[this.particleCount - 1]), this.particleCount--;
                        var h = {};
                        h._x = ~~c.position.x, h._y = ~~c.position.y, h._w = c.size, h._h = c.size, this.register.push(h)
                    }
                },
                stop: function() {
                    this.active = !1, this.elapsedFrames = 0, this.emitCounter = 0, this.parentEntity.trigger("ParticleEnd")
                },
                render: function(a) {
                    for (var b = 0, c = this.particleCount; c > b; b++) {
                        var e = this.particles[b],
                            f = e.size,
                            g = f >> 1;
                        if (!(e.position.x + f < 0 || e.position.y + f < 0 || e.position.x - f > d.viewport.width || e.position.y - f > d.viewport.height)) {
                            var h = ~~e.position.x,
                                i = ~~e.position.y;
                            if (this.fastMode) a.fillStyle = e.drawColour;
                            else {
                                var j = a.createRadialGradient(h + g, i + g, e.sizeSmall, h + g, i + g, g);
                                j.addColorStop(0, e.drawColour), j.addColorStop(.9, e.drawColourEnd), a.fillStyle = j
                            }
                            a.fillRect(h, i, f, f)
                        }
                    }
                },
                particle: function(a) {
                    this.position = a.create(0, 0), this.direction = a.create(0, 0), this.size = 0, this.sizeSmall = 0, this.timeToLive = 0, this.colour = [], this.drawColour = "", this.deltaColour = [], this.sharpness = 0
                },
                vectorHelpers: {
                    create: function(a, b) {
                        return {
                            x: a,
                            y: b
                        }
                    },
                    multiply: function(a, b) {
                        return a.x *= b, a.y *= b, a
                    },
                    add: function(a, b) {
                        return a.x += b.x, a.y += b.y, a
                    }
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    31: [function(a, b, c) {
        var d = a("../core/core.js");
        d.c("SpriteAnimation", {
            _reels: null,
            _currentReelId: null,
            _currentReel: null,
            _isPlaying: !1,
            animationSpeed: 1,
            init: function() {
                this._reels = {}
            },
            reel: function(a, b, c, e, f) {
                if (0 === arguments.length) return this._currentReelId;
                if (1 === arguments.length && "string" == typeof a) {
                    if ("undefined" == typeof this._reels[a]) throw "The specified reel " + a + " is undefined.";
                    return this.pauseAnimation(), this._currentReelId !== a && (this._currentReelId = a, this._currentReel = this._reels[a], this._updateSprite(), this.trigger("ReelChange", this._currentReel)), this
                }
                var g, h, i;
                if (g = {
                        id: a,
                        frames: [],
                        currentFrame: 0,
                        easing: new d.easing(b),
                        defaultLoops: 1
                    }, g.duration = g.easing.duration, "number" == typeof c)
                    if (h = c, i = e, f >= 0)
                        for (; c + f > h; h++) g.frames.push([h, i]);
                    else
                        for (; h > c + f; h--) g.frames.push([h, i]);
                else {
                    if (3 !== arguments.length || "object" != typeof c) throw "Urecognized arguments. Please see the documentation for 'reel(...)'.";
                    g.frames = c
                }
                return this._reels[a] = g, this
            },
            animate: function(a, b) {
                "string" == typeof a && this.reel(a);
                var c = this._currentReel;
                if ("undefined" == typeof c || null === c) throw "No reel is specified, and there is no currently active reel.";
                return this.pauseAnimation(), "undefined" == typeof b && (b = "number" == typeof a ? a : 1), c.easing.reset(), this.loops(b), this._setFrame(0), this.bind("EnterFrame", this._animationTick), this._isPlaying = !0, this.trigger("StartAnimation", c), this
            },
            resumeAnimation: function() {
                return this._isPlaying === !1 && null !== this._currentReel && (this.bind("EnterFrame", this._animationTick), this._isPlaying = !0, this._currentReel.easing.resume(), this.trigger("StartAnimation", this._currentReel)), this
            },
            pauseAnimation: function() {
                return this._isPlaying === !0 && (this.unbind("EnterFrame", this._animationTick), this._isPlaying = !1, this._reels[this._currentReelId].easing.pause()), this
            },
            resetAnimation: function() {
                var a = this._currentReel;
                if (null === a) throw "No active reel to reset.";
                return this.reelPosition(0), a.easing.repeat(a.defaultLoops), this
            },
            loops: function(a) {
                return 0 === arguments.length ? null !== this._currentReel ? this._currentReel.easing.loops : 0 : (null !== this._currentReel && (0 > a && (a = 1 / 0), this._currentReel.easing.repeat(a), this._currentReel.defaultLoops = a), this)
            },
            reelPosition: function(a) {
                if (null === this._currentReel) throw "No active reel.";
                if (0 === arguments.length) return this._currentReel.currentFrame;
                var b, c = this._currentReel.frames.length;
                if ("end" === a && (a = c - 1), 1 > a && a > 0) b = a, a = Math.floor(c * b);
                else {
                    if (a !== Math.floor(a)) throw "Position " + a + " is invalid.";
                    0 > a && (a = c - 1 + a), b = a / c
                }
                return a = Math.min(a, c - 1), a = Math.max(a, 0), this._setProgress(b), this._setFrame(a), this
            },
            _animationTick: function(a) {
                var b = this._reels[this._currentReelId];
                b.easing.tick(a.dt * this.animationSpeed);
                var c = b.easing.value(),
                    d = Math.min(Math.floor(b.frames.length * c), b.frames.length - 1);
                this._setFrame(d), b.easing.complete === !0 && (this.pauseAnimation(), this.trigger("AnimationEnd", this._currentReel))
            },
            _setFrame: function(a) {
                var b = this._currentReel;
                a !== b.currentFrame && (b.currentFrame = a, this._updateSprite(), this.trigger("FrameChange", b))
            },
            _updateSprite: function() {
                var a = this._currentReel,
                    b = a.frames[a.currentFrame];
                this.sprite(b[0], b[1])
            },
            _setProgress: function(a, b) {
                this._currentReel.easing.setProgress(a, b)
            },
            isPlaying: function(a) {
                return this._isPlaying ? a ? this._currentReelId === a : !!this._currentReelId : !1
            },
            getReel: function(a) {
                if (0 === arguments.length) {
                    if (!this._currentReelId) return null;
                    a = this._currentReelId
                }
                return this._reels[a]
            }
        })
    }, {
        "../core/core.js": 7
    }],
    32: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = "attribute vec2 aPosition;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec2 aTextureCoord;\n\nvarying mediump vec3 vTextureCoord;\n\nuniform vec4 uViewport;\nuniform mediump vec2 uTextureDimensions;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n  \n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n  vTextureCoord = vec3(aTextureCoord, aLayer.y);\n}",
            f = "varying mediump vec3 vTextureCoord;\n  \nuniform sampler2D uSampler;\nuniform mediump vec2 uTextureDimensions;\n\nvoid main(void) {\n  highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;\n  mediump vec4 base_color = texture2D(uSampler, coord);\n  gl_FragColor = vec4(base_color.rgb*base_color.a*vTextureCoord.z, base_color.a*vTextureCoord.z);\n}",
            g = [{
                name: "aPosition",
                width: 2
            }, {
                name: "aOrientation",
                width: 3
            }, {
                name: "aLayer",
                width: 2
            }, {
                name: "aTextureCoord",
                width: 2
            }];
        d.extend({
            sprite: function(a, b, c, h, i, j, k) {
                var l, m, n;
                "string" == typeof a && (j = i, i = h, h = b, c = a, a = 1, b = 1), "string" == typeof b && (j = i, i = h, h = c, c = b, b = a), !j && i && (j = i), i = parseInt(i || 0, 10), j = parseInt(j || 0, 10);
                var o = function() {
                    this.ready = !0, this.trigger("Invalidate")
                };
                n = d.asset(c), n || (n = new Image, n.src = c, d.asset(c, n), n.onload = function() {
                    for (var a in h) d(a).each(o)
                });
                var p = function() {
                    this.requires("2D, Sprite"), this.__trim = [0, 0, 0, 0], this.__image = c, this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]], this.__tile = a, this.__tileh = b, this.__padding = [i, j], this.__padBorder = k, this.sprite(this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]), this.img = n, this.img.complete && this.img.width > 0 && (this.ready = !0, this.trigger("Invalidate")), this.w = this.__coord[2], this.h = this.__coord[3], this.has("WebGL") && (this._establishShader(this.__image, f, e, g), this.program.setTexture(this.webgl.makeTexture(this.__image, this.img, !1)))
                };
                for (l in h) h.hasOwnProperty(l) && (m = h[l], d.c(l, {
                    ready: !1,
                    __coord: [m[0], m[1], m[2] || 1, m[3] || 1],
                    init: p
                }));
                return this
            }
        }), d.c("Sprite", {
            __image: "",
            __tile: 0,
            __tileh: 0,
            __padding: null,
            __trim: null,
            img: null,
            ready: !1,
            init: function() {
                this.__trim = [0, 0, 0, 0], this.bind("Draw", this._drawSprite)
            },
            remove: function() {
                this.unbind("Draw", this._drawSprite)
            },
            _drawSprite: function(a) {
                var b = a.co,
                    c = a.pos,
                    d = a.ctx;
                if ("canvas" === a.type) d.drawImage(this.img, b.x, b.y, b.w, b.h, c._x, c._y, c._w, c._h);
                else if ("DOM" === a.type) {
                    var e = this._h / b.h,
                        f = this._w / b.w,
                        g = this._element.style,
                        h = g.backgroundColor;
                    "initial" === h && (h = "");
                    var i = h + " url('" + this.__image + "') no-repeat";
                    i !== g.background && (g.background = i), g.backgroundPosition = "-" + b.x * f + "px -" + b.y * e + "px", (1 != e || 1 != f) && (g.backgroundSize = this.img.width * f + "px " + this.img.height * e + "px")
                } else "webgl" === a.type && a.program.writeVector("aTextureCoord", b.x, b.y, b.x, b.y + b.h, b.x + b.w, b.y, b.x + b.w, b.y + b.h)
            },
            sprite: function(a, b, c, d) {
                return this.__coord = this.__coord || [0, 0, 0, 0], this.__coord[0] = a * (this.__tile + this.__padding[0]) + (this.__padBorder ? this.__padding[0] : 0) + this.__trim[0], this.__coord[1] = b * (this.__tileh + this.__padding[1]) + (this.__padBorder ? this.__padding[1] : 0) + this.__trim[1], "undefined" != typeof c && "undefined" != typeof d && (this.__coord[2] = this.__trim[2] || c * this.__tile || this.__tile, this.__coord[3] = this.__trim[3] || d * this.__tileh || this.__tileh), this.trigger("Invalidate"), this
            },
            crop: function(a, b, c, d) {
                var e = this._mbr || this.pos();
                return this.__trim = [], this.__trim[0] = a, this.__trim[1] = b, this.__trim[2] = c, this.__trim[3] = d, this.__coord[0] += a, this.__coord[1] += b, this.__coord[2] = c, this.__coord[3] = d, this._w = c, this._h = d, this.trigger("Invalidate", e), this
            }
        })
    }, {
        "../core/core.js": 7
    }],
    33: [function(a, b, c) {
        var d = a("../core/core.js");
        d.c("Text", {
            _text: "",
            defaultSize: "10px",
            defaultFamily: "sans-serif",
            defaultVariant: "normal",
            defaultLineHeight: "normal",
            ready: !0,
            init: function() {
                this.requires("2D"), this._textFont = {
                    type: "",
                    weight: "",
                    size: this.defaultSize,
                    lineHeight: this.defaultLineHeight,
                    family: this.defaultFamily,
                    variant: this.defaultVariant
                }, this.bind("Draw", function(a) {
                    var b = this._fontString();
                    if ("DOM" === a.type) {
                        var c = this._element,
                            d = c.style;
                        d.color = this._textColor, d.font = b, c.innerHTML = this._text
                    } else if ("canvas" === a.type) {
                        var e = a.ctx;
                        e.save(), e.textBaseline = "top", e.fillStyle = this._textColor || "rgb(0,0,0)", e.font = b, e.fillText(this._text, a.pos._x, a.pos._y), e.restore()
                    }
                })
            },
            _getFontHeight: function() {
                var a = /([a-zA-Z]+)\b/,
                    b = {
                        px: 1,
                        pt: 4 / 3,
                        pc: 16,
                        cm: 96 / 2.54,
                        mm: 96 / 25.4,
                        "in": 96,
                        em: void 0,
                        ex: void 0
                    };
                return function(c) {
                    var d = parseFloat(c),
                        e = a.exec(c),
                        f = e ? e[1] : "px";
                    return void 0 !== b[f] ? Math.ceil(d * b[f]) : Math.ceil(d)
                }
            }(),
            text: function(a) {
                return "undefined" == typeof a || null === a ? this._text : ("function" == typeof a ? this._text = a.call(this) : this._text = a, this.has("Canvas") && this._resizeForCanvas(), this.trigger("Invalidate"), this)
            },
            _resizeForCanvas: function() {
                var a = this._drawContext;
                a.font = this._fontString(), this.w = a.measureText(this._text).width;
                var b = this._textFont.size || this.defaultSize;
                this.h = 1.1 * this._getFontHeight(b)
            },
            _fontString: function() {
                return this._textFont.type + " " + this._textFont.variant + " " + this._textFont.weight + " " + this._textFont.size + " / " + this._textFont.lineHeight + " " + this._textFont.family
            },
            textColor: function(a) {
                return d.assignColor(a, this), this._textColor = "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + this._strength + ")", this.trigger("Invalidate"), this
            },
            textFont: function(a, b) {
                if (1 === arguments.length) {
                    if ("string" == typeof a) return this._textFont[a];
                    if ("object" == typeof a)
                        for (var c in a) "family" == c ? this._textFont[c] = "'" + a[c] + "'" : this._textFont[c] = a[c]
                } else this._textFont[a] = b;
                return this.has("Canvas") && this._resizeForCanvas(), this.trigger("Invalidate"), this
            },
            unselectable: function() {
                return this.has("DOM") && (this.css({
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                    cursor: "default"
                }), this.trigger("Invalidate")), this
            }
        })
    }, {
        "../core/core.js": 7
    }],
    34: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        d.extend({
            viewport: {
                clampToEntities: !0,
                _width: 0,
                _height: 0,
                _x: 0,
                _y: 0,
                _scale: 1,
                bounds: null,
                scroll: function(a, b) {
                    this[a] = b, d.trigger("ViewportScroll"), d.trigger("InvalidateViewport")
                },
                rect_object: {
                    _x: 0,
                    _y: 0,
                    _w: 0,
                    _h: 0
                },
                rect: function() {
                    return this.rect_object._x = -this._x, this.rect_object._y = -this._y, this.rect_object._w = this._width / this._scale, this.rect_object._h = this._height / this._scale, this.rect_object
                },
                pan: function() {
                    function a(a) {
                        h.tick(a.dt);
                        var i = h.value();
                        d.viewport.x = (1 - i) * f + i * c, d.viewport.y = (1 - i) * g + i * e, d.viewport._clamp(), h.complete && (b(), d.trigger("CameraAnimationDone"))
                    }

                    function b() {
                        d.unbind("EnterFrame", a)
                    }
                    var c, e, f, g, h;
                    return d._preBind("StopCamera", b),
                        function(b, i, j, k) {
                            d.trigger("StopCamera"), "reset" != b && (f = d.viewport._x, g = d.viewport._y, c = f - b, e = g - i, h = new d.easing(j, k), d.uniqueBind("EnterFrame", a))
                        }
                }(),
                follow: function() {
                    function a() {
                        var a = d.viewport._scale;
                        d.viewport.scroll("_x", -(this.x + this.w / 2 - d.viewport.width / 2 / a - e * a)), d.viewport.scroll("_y", -(this.y + this.h / 2 - d.viewport.height / 2 / a - f * a)), d.viewport._clamp()
                    }

                    function b() {
                        c && (c.unbind("Move", a), c.unbind("ViewportScale", a), c.unbind("ViewportResize", a))
                    }
                    var c, e, f;
                    return d._preBind("StopCamera", b),
                        function(b, g, h) {
                            b && b.has("2D") && (d.trigger("StopCamera"), c = b, e = "undefined" != typeof g ? g : 0, f = "undefined" != typeof h ? h : 0, b.bind("Move", a), b.bind("ViewportScale", a), b.bind("ViewportResize", a), a.call(b))
                        }
                }(),
                centerOn: function(a, b) {
                    var c = a.x + d.viewport.x,
                        e = a.y + d.viewport.y,
                        f = a.w / 2,
                        g = a.h / 2,
                        h = d.viewport.width / 2 / d.viewport._scale,
                        i = d.viewport.height / 2 / d.viewport._scale,
                        j = c + f - h,
                        k = e + g - i;
                    d.viewport.pan(j, k, b)
                },
                zoom: function() {
                    function a() {
                        d.unbind("EnterFrame", b)
                    }

                    function b(b) {
                        var e, l;
                        k.tick(b.dt), e = Math.pow(f, k.value()), l = 1 === f ? k.value() : (1 / e - 1) / (1 / f - 1), d.viewport.scale(e * c), d.viewport.scroll("_x", g * (1 - l) + h * l), d.viewport.scroll("_y", i * (1 - l) + j * l), d.viewport._clamp(), k.complete && (a(), d.trigger("CameraAnimationDone"))
                    }
                    d._preBind("StopCamera", a);
                    var c, e, f, g, h, i, j, k;
                    return function(a, l, m, n, o) {
                        return a ? (arguments.length <= 2 && (n = l, l = d.viewport.x - d.viewport.width, m = d.viewport.y - d.viewport.height), d.trigger("StopCamera"), c = d.viewport._scale, f = a, e = c * f, g = d.viewport.x, i = d.viewport.y, h = -(l - d.viewport.width / (2 * e)), j = -(m - d.viewport.height / (2 * e)), k = new d.easing(n, o), void d.uniqueBind("EnterFrame", b)) : void d.viewport.scale(1)
                    }
                }(),
                scale: function() {
                    return function(a) {
                        this._scale = a ? a : 1, d.trigger("InvalidateViewport"), d.trigger("ViewportScale")
                    }
                }(),
                mouselook: function() {
                    var a = !1,
                        b = !1,
                        c = {};
                    return old = {},
                        function(e, f) {
                            if ("boolean" == typeof e) return a = e, void(a ? d.mouseObjs++ : d.mouseObjs = Math.max(0, d.mouseObjs - 1));
                            if (a) switch (e) {
                                case "move":
                                case "drag":
                                    if (!b) return;
                                    diff = {
                                        x: f.clientX - c.x,
                                        y: f.clientY - c.y
                                    }, c.x = f.clientX, c.y = f.clientY, d.viewport.x += diff.x, d.viewport.y += diff.y, d.viewport._clamp();
                                    break;
                                case "start":
                                    d.trigger("StopCamera"), c.x = f.clientX, c.y = f.clientY, b = !0;
                                    break;
                                case "stop":
                                    b = !1
                            }
                        }
                }(),
                _clamp: function() {
                    if (this.clampToEntities) {
                        var a = d.clone(this.bounds) || d.map.boundaries();
                        a.max.x *= this._scale, a.min.x *= this._scale, a.max.y *= this._scale, a.min.y *= this._scale, a.max.x - a.min.x > d.viewport.width ? d.viewport.x < (-a.max.x + d.viewport.width) / this._scale ? d.viewport.x = (-a.max.x + d.viewport.width) / this._scale : d.viewport.x > -a.min.x && (d.viewport.x = -a.min.x) : d.viewport.x = -1 * (a.min.x + (a.max.x - a.min.x) / 2 - d.viewport.width / 2), a.max.y - a.min.y > d.viewport.height ? d.viewport.y < (-a.max.y + d.viewport.height) / this._scale ? d.viewport.y = (-a.max.y + d.viewport.height) / this._scale : d.viewport.y > -a.min.y && (d.viewport.y = -a.min.y) : d.viewport.y = -1 * (a.min.y + (a.max.y - a.min.y) / 2 - d.viewport.height / 2)
                    }
                },
                init: function(a, b, c) {
                    this._defineViewportProperties(), this._x = 0, this._y = 0, this._scale = 1, this.bounds = null, this._width = a || window.innerWidth, this._height = b || window.innerHeight, "undefined" == typeof c && (c = "cr-stage");
                    var f;
                    if ("string" == typeof c) f = e.getElementById(c);
                    else {
                        if (!("undefined" != typeof HTMLElement ? c instanceof HTMLElement : c instanceof Element)) throw new TypeError("stage_elem must be a string or an HTMLElement");
                        f = c
                    }
                    d.stage = {
                        x: 0,
                        y: 0,
                        fullscreen: !1,
                        elem: f ? f : e.createElement("div")
                    }, a || b || (e.body.style.overflow = "hidden", d.stage.fullscreen = !0), d.addEvent(this, window, "resize", d.viewport.reload), d.addEvent(this, window, "blur", function() {
                        d.settings.get("autoPause") && (d._paused || d.pause())
                    }), d.addEvent(this, window, "focus", function() {
                        d._paused && d.settings.get("autoPause") && d.pause()
                    }), d.settings.register("stageSelectable", function(a) {
                        d.stage.elem.onselectstart = a ? function() {
                            return !0
                        } : function() {
                            return !1
                        }
                    }), d.settings.modify("stageSelectable", !1), d.settings.register("stageContextMenu", function(a) {
                        d.stage.elem.oncontextmenu = a ? function() {
                            return !0
                        } : function() {
                            return !1
                        }
                    }), d.settings.modify("stageContextMenu", !1), d.settings.register("autoPause", function() {}), d.settings.modify("autoPause", !1), f || (e.body.appendChild(d.stage.elem), d.stage.elem.id = c);
                    var g, h = d.stage.elem.style;
                    if (h.width = this.width + "px", h.height = this.height + "px", h.overflow = "hidden", d.bind("ViewportResize", function() {
                            d.trigger("InvalidateViewport")
                        }), d.mobile) {
                        void 0 !== typeof h.webkitTapHighlightColor && (h.webkitTapHighlightColor = "rgba(0,0,0,0)");
                        var i = e.createElement("meta"),
                            j = e.getElementsByTagName("head")[0];
                        i = e.createElement("meta"), i.setAttribute("name", "apple-mobile-web-app-capable"), i.setAttribute("content", "yes"), j.appendChild(i), d.addEvent(this, d.stage.elem, "touchmove", function(a) {
                            a.preventDefault()
                        })
                    }
                    h.position = "relative", g = d.domHelper.innerPosition(d.stage.elem), d.stage.x = g.x, d.stage.y = g.y, d.uniqueBind("ViewportResize", this._resize)
                },
                _resize: function() {
                    d.stage.elem.style.width = d.viewport.width + "px", d.stage.elem.style.height = d.viewport.height + "px"
                },
                _defineViewportProperties: function() {
                    Object.defineProperty(this, "x", {
                        set: function(a) {
                            this.scroll("_x", a)
                        },
                        get: function() {
                            return this._x
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "y", {
                        set: function(a) {
                            this.scroll("_y", a)
                        },
                        get: function() {
                            return this._y
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "width", {
                        set: function(a) {
                            this._width = a, d.trigger("ViewportResize")
                        },
                        get: function() {
                            return this._width
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "height", {
                        set: function(a) {
                            this._height = a, d.trigger("ViewportResize")
                        },
                        get: function() {
                            return this._height
                        },
                        configurable: !0
                    })
                },
                reload: function() {
                    var a, b = window.innerWidth,
                        c = window.innerHeight;
                    d.stage.fullscreen && (this._width = b, this._height = c, d.trigger("ViewportResize")), a = d.domHelper.innerPosition(d.stage.elem), d.stage.x = a.x, d.stage.y = a.y
                },
                reset: function() {
                    d.viewport.mouselook("stop"), d.trigger("StopCamera"), d.viewport.scroll("_x", 0), d.viewport.scroll("_y", 0), d.viewport.scale(1)
                },
                onScreen: function(a) {
                    return d.viewport._x + a._x + a._w > 0 && d.viewport._y + a._y + a._h > 0 && d.viewport._x + a._x < d.viewport.width && d.viewport._y + a._y < d.viewport.height
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    35: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = window.document;
        RenderProgramWrapper = function(a, b) {
            this.shader = b, this.context = a, this.array_size = 16, this.max_size = 1024, this._indexArray = new Uint16Array(6 * this.array_size), this._indexBuffer = a.createBuffer()
        }, RenderProgramWrapper.prototype = {
            initAttributes: function(a) {
                this.attributes = a, this._attribute_table = {};
                for (var b = 0, c = 0; c < a.length; c++) {
                    var d = a[c];
                    this._attribute_table[d.name] = d, d.bytes = d.bytes || Float32Array.BYTES_PER_ELEMENT, d.type = d.type || this.context.FLOAT, d.offset = b, d.location = this.context.getAttribLocation(this.shader, d.name), this.context.enableVertexAttribArray(d.location), b += d.width
                }
                this.stride = b, this._attributeArray = new Float32Array(4 * this.array_size * this.stride), this._attributeBuffer = this.context.createBuffer(), this._registryHoles = [], this._registrySize = 0
            },
            growArrays: function(a) {
                if (!(this.array_size >= this.max_size)) {
                    var b = Math.min(a, this.max_size),
                        c = new Float32Array(4 * b * this.stride),
                        d = new Uint16Array(6 * b);
                    c.set(this._attributeArray), d.set(this._indexArray), this._attributeArray = c, this._indexArray = d, this.array_size = b
                }
            },
            registerEntity: function(a) {
                if (0 === this._registryHoles.length) {
                    if (this._registrySize >= this.max_size) throw "Number of entities exceeds maximum limit.";
                    this._registrySize >= this.array_size && this.growArrays(2 * this.array_size), a._glBufferIndex = this._registrySize, this._registrySize++
                } else a._glBufferIndex = this._registryHoles.pop()
            },
            unregisterEntity: function(a) {
                "number" == typeof a._glBufferIndex && this._registryHoles.push(a._glBufferIndex), a._glBufferIndex = null
            },
            resetRegistry: function() {
                this._maxElement = 0, this._registryHoles.length = 0
            },
            setCurrentEntity: function(a) {
                this.ent_offset = 4 * a._glBufferIndex, this.ent = a
            },
            switchTo: function() {
                var a = this.context;
                a.useProgram(this.shader), a.bindBuffer(a.ARRAY_BUFFER, this._attributeBuffer);
                for (var b, c = this.attributes, e = 0; e < c.length; e++) b = c[e], a.vertexAttribPointer(b.location, b.width, b.type, !1, this.stride * b.bytes, b.offset * b.bytes);
                var f = this.texture_obj;
                f && null === f.unit && d.webgl.texture_manager.bindTexture(f), this.index_pointer = 0
            },
            setTexture: function(a) {
                void 0 === this.texture_obj && (a.setToProgram(this.shader, "uSampler", "uTextureDimensions"), this.texture_obj = a)
            },
            addIndices: function(a) {
                var b = this._indexArray,
                    c = this.index_pointer;
                b[0 + c] = 0 + a, b[1 + c] = 1 + a, b[2 + c] = 2 + a, b[3 + c] = 1 + a, b[4 + c] = 2 + a, b[5 + c] = 3 + a, this.index_pointer += 6
            },
            renderBatch: function() {
                var a = this.context;
                a.bindBuffer(a.ARRAY_BUFFER, this._attributeBuffer), a.bufferData(a.ARRAY_BUFFER, this._attributeArray, a.STATIC_DRAW), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this._indexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, this._indexArray, a.STATIC_DRAW), a.drawElements(a.TRIANGLES, this.index_pointer, a.UNSIGNED_SHORT, 0)
            },
            setViewportUniforms: function(a) {
                var b = this.context;
                b.useProgram(this.shader), b.uniform4f(this.shader.viewport, a._x, a._y, a._width / a._scale, a._height / a._scale)
            },
            writeVector: function(a, b, c) {
                for (var d = this._attribute_table[a], e = this.stride, f = d.offset + this.ent_offset * e, g = d.width, h = arguments.length - 1, i = this._attributeArray, j = 0; 4 > j; j++)
                    for (var k = 0; g > k; k++) i[f + e * j + k] = arguments[(g * j + k) % h + 1]
            }
        }, d.c("WebGL", {
            init: function() {
                d.webgl.context || d.webgl.init();
                var a = this.webgl = d.webgl;
                a.context;
                this._changed = !0, this.bind("Change", this._glChange)
            },
            remove: function() {
                this._changed = !0, this.unbind(this._glChange), this.program && this.program.unregisterEntity(this)
            },
            _glChange: function() {
                this._changed === !1 && (this._changed = !0)
            },
            drawVars: {
                type: "webgl",
                pos: {},
                ctx: null,
                coord: [0, 0, 0, 0],
                co: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            },
            draw: function(a, b, c, d, e) {
                if (this.ready) {
                    4 === arguments.length && (e = d, d = c, c = b, b = a, a = this.webgl.context);
                    var f = this.drawVars.pos;
                    f._x = this._x + (b || 0), f._y = this._y + (c || 0), f._w = d || this._w, f._h = e || this._h;
                    var g = this.__coord || [0, 0, 0, 0],
                        h = this.drawVars.co;
                    h.x = g[0] + (b || 0), h.y = g[1] + (c || 0), h.w = d || g[2], h.h = e || g[3], this._flipX && (h.x = h.x + h.w, h.w = -h.w), this._flipY && (h.y = h.y + h.h, h.h = -h.h);
                    var i = this.webgl.context;
                    this.drawVars.gl = i;
                    var j = this.drawVars.program = this.program;
                    return j.setCurrentEntity(this), j.writeVector("aPosition", this._x, this._y, this._x, this._y + this._h, this._x + this._w, this._y, this._x + this._w, this._y + this._h), j.writeVector("aOrientation", this._origin.x + this._x, this._origin.y + this._y, this._rotation * Math.PI / 180), j.writeVector("aLayer", this._globalZ, this._alpha), this.trigger("Draw", this.drawVars), j.addIndices(j.ent_offset), this
                }
            },
            _establishShader: function(a, b, c, d) {
                this.program = this.webgl.getProgramWrapper(a, b, c, d), this.program.registerEntity(this), this.ready = !0
            }
        }), d.extend({
            webgl: {
                context: null,
                changed_objects: [],
                _compileShader: function(a, b) {
                    var c = this.context,
                        d = c.createShader(b);
                    if (c.shaderSource(d, a), c.compileShader(d), !c.getShaderParameter(d, c.COMPILE_STATUS)) throw c.getShaderInfoLog(d);
                    return d
                },
                _makeProgram: function(a, b) {
                    var c = this.context,
                        d = this._compileShader(a, c.FRAGMENT_SHADER),
                        e = this._compileShader(b, c.VERTEX_SHADER),
                        f = c.createProgram();
                    if (c.attachShader(f, e), c.attachShader(f, d), c.linkProgram(f), !c.getProgramParameter(f, c.LINK_STATUS)) throw "Could not initialise shaders";
                    return f.viewport = c.getUniformLocation(f, "uViewport"), f
                },
                programs: {},
                getProgramWrapper: function(a, b, c, e) {
                    if (void 0 === this.programs[a]) {
                        var f = this._makeProgram(b, c),
                            g = new RenderProgramWrapper(this.context, f);
                        g.name = a, g.initAttributes(e), g.setViewportUniforms(d.viewport), this.programs[a] = g
                    }
                    return this.programs[a]
                },
                makeTexture: function(a, b, c) {
                    var d = this;
                    return d.texture_manager.makeTexture(a, b, c)
                },
                init: function() {
                    if (!d.support.webgl) return d.trigger("NoWebGL"), void d.stop();
                    this.changed_objects = [];
                    var a;
                    a = e.createElement("canvas"), a.width = d.viewport.width, a.height = d.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px", d.stage.elem.appendChild(a);
                    var b;
                    try {
                        b = a.getContext("webgl", {
                            premultipliedalpha: !0
                        }) || a.getContext("experimental-webgl", {
                            premultipliedalpha: !0
                        }), b.viewportWidth = a.width, b.viewportHeight = a.height
                    } catch (c) {
                        return d.trigger("NoWebGL"), void d.stop()
                    }
                    this.context = b, this._canvas = a, b.clearColor(0, 0, 0, 0), b.disable(b.DEPTH_TEST), b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA), b.enable(b.BLEND);
                    var f = this;
                    d.uniqueBind("RenderScene", f.render), d.uniqueBind("ViewportResize", f._resize), d.uniqueBind("InvalidateViewport", function() {
                        f.dirtyViewport = !0
                    }), d.uniqueBind("PixelartSet", f._setPixelart), f._setPixelart(d._pixelartEnabled), this.dirtyViewport = !0, this.texture_manager = new d.TextureManager(b, this)
                },
                _resize: function() {
                    var a = d.webgl._canvas;
                    a.width = d.viewport.width, a.height = d.viewport.height;
                    var b = d.webgl.context;
                    b.viewportWidth = a.width, b.viewportHeight = a.height
                },
                _setPixelart: function(a) {
                    var b = d.webgl.context;
                    a ? d.webgl.texture_filter = b.NEAREST : d.webgl.texture_filter = b.LINEAR
                },
                zsort: function(a, b) {
                    return a._globalZ - b._globalZ
                },
                visible_gl: [],
                render: function(a) {
                    a = a || d.viewport.rect();
                    var b = d.webgl,
                        c = b.context;
                    c.viewport(0, 0, c.viewportWidth, c.viewportHeight), c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                    var e = b.programs;
                    if (b.dirtyViewport) {
                        for (var f in e) e[f].setViewportUniforms(d.viewport);
                        b.dirtyViewport = !1
                    }
                    var g, h = d.map.search(a),
                        i = 0,
                        j = h.length,
                        k = b.visible_gl;
                    for (k.length = 0, i = 0; j > i; i++) g = h[i], g._visible && g.__c.WebGL && g.program && k.push(g);
                    k.sort(b.zsort), j = k.length;
                    var l = null;
                    for (i = 0; j > i; i++) g = k[i], l !== g.program && (null !== l && l.renderBatch(), l = g.program, l.index_pointer = 0, l.switchTo()), g.draw(), g._changed = !1;
                    null !== l && l.renderBatch()
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    36: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            diamondIso: {
                _tile: {
                    width: 0,
                    height: 0
                },
                getTileDimensions: function() {
                    return {
                        w: this._tile.width,
                        h: this._tile.height
                    }
                },
                _map: {
                    width: 0,
                    height: 0
                },
                _origin: {
                    x: 0,
                    y: 0
                },
                _tiles: [],
                getTile: function(a, b, c) {
                    return this._tiles[a][b][c]
                },
                init: function(a, b, c, d, e, f) {
                    this._tile.width = parseInt(a, 10), this._tile.height = parseInt(b, 10) || parseInt(a, 10) / 2, this._tile.r = this._tile.width / this._tile.height, this._map.width = parseInt(c, 10), this._map.height = parseInt(d, 10) || parseInt(c, 10);
                    for (var g = 0; c > g; g++) {
                        this._tiles[g] = Array();
                        for (var h = 0; d > h; h++) this._tiles[g][h] = Array()
                    }
                    return this.x = parseInt(e, 10) || 0, this.y = parseInt(f, 10) || 0, this.layerZLevel = c + d + 1, this
                },
                place: function(a, b, c, d) {
                    var e = this.pos2px(b, c),
                        f = (a.tileHeight, a.h / this._tile.height);
                    a.x = e.x, a.y = e.y - (f - 2) * this._tile.height - this._tile.height * d,
                        a.z = this.getZAtLoc(b, c, d);
                    for (var g = 0; f - 2 >= g; g++) {
                        var h = this._tiles[b][c][d + g];
                        h && h !== a && h.destroy(), this._tiles[b][c][d + g] = a
                    }
                    return this
                },
                detachTile: function(a) {
                    for (var b = 0; b < this._map.width; b++)
                        for (var c = 0; c < this._map.height; c++)
                            for (var d = this._tiles[b][c].length, e = 0; d > e; e++)
                                if (this._tiles[b][c][e] && a === this._tiles[b][c][e]) {
                                    tHeight = a.h / this._tile.height;
                                    for (var f = 0; f < tHeight; f++) this._tiles[b][c][e + f] = void 0;
                                    return {
                                        x: b,
                                        y: c,
                                        z: e
                                    }
                                }
                    return !1
                },
                centerAt: function(a, b) {
                    var c = this.pos2px(a, b);
                    d.viewport.x = -c.x + d.viewport.width / 2 - this._tile.width, d.viewport.y = -c.y + d.viewport.height / 2
                },
                getZAtLoc: function(a, b, c) {
                    return this.layerZLevel * c + a + b
                },
                pos2px: function(a, b) {
                    return {
                        x: this.x + (a - b - 1) * this._tile.width / 2,
                        y: this.y + (a + b) * this._tile.height / 2
                    }
                },
                px2pos: function(a, b) {
                    var c = (b - this.y) / this._tile.height,
                        d = (a - this.x) / this._tile.width,
                        e = c + d,
                        f = c - d;
                    return inX = e > 0 && e < this._map.width, inY = f > 0 && f < this._map.height, inX && inY ? {
                        x: ~~e,
                        y: ~~f
                    } : void 0
                },
                getOverlappingTiles: function(a, b) {
                    var c = this.px2pos(a, b),
                        d = [],
                        e = ~~c.x,
                        f = ~~c.y,
                        g = this._map.width - e,
                        h = this._map.height - f,
                        i = Math.min(g, h),
                        j = this._tiles[e][f][1];
                    j && d.push(j);
                    for (var k = 1; i > k; k++) {
                        var l = this._tiles[e + k][f + k][k];
                        l && d.push(l)
                    }
                    return d
                },
                polygon: function(a) {
                    a.requires("Collision");
                    var b = 0,
                        c = 0,
                        e = [b - 0, a.h - c - this._tile.height / 2, b - this._tile.width / 2, a.h - c - 0, b - this._tile.width, a.h - c - this._tile.height / 2, b - this._tile.width / 2, a.h - c - this._tile.height],
                        f = new d.polygon(e);
                    return f
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    37: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            isometric: {
                _tile: {
                    width: 0,
                    height: 0
                },
                _elements: {},
                _pos: {
                    x: 0,
                    y: 0
                },
                _z: 0,
                size: function(a, b) {
                    return this._tile.width = a, this._tile.height = b > 0 ? b : a / 2, this
                },
                place: function(a, b, c, e) {
                    var f = this.pos2px(a, b);
                    return f.top -= c * (this._tile.height / 2), e.attr({
                        x: f.left + d.viewport._x,
                        y: f.top + d.viewport._y
                    }).z += c, this
                },
                pos2px: function(a, b) {
                    return {
                        left: a * this._tile.width + (1 & b) * (this._tile.width / 2),
                        top: b * this._tile.height / 2
                    }
                },
                px2pos: function(a, b) {
                    return {
                        x: -Math.ceil(-a / this._tile.width - .5 * (1 & b)),
                        y: b / this._tile.height * 2
                    }
                },
                centerAt: function(a, b) {
                    if ("number" == typeof a && "number" == typeof b) {
                        var c = this.pos2px(a, b);
                        return d.viewport._x = -c.left + d.viewport.width / 2 - this._tile.width / 2, d.viewport._y = -c.top + d.viewport.height / 2 - this._tile.height / 2, this
                    }
                    return {
                        top: -d.viewport._y + d.viewport.height / 2 - this._tile.height / 2,
                        left: -d.viewport._x + d.viewport.width / 2 - this._tile.width / 2
                    }
                },
                area: function() {
                    var a = this.centerAt(),
                        b = this.px2pos(-a.left + d.viewport.width / 2, -a.top + d.viewport.height / 2),
                        c = this.px2pos(-a.left - d.viewport.width / 2, -a.top - d.viewport.height / 2);
                    return {
                        x: {
                            start: b.x,
                            end: c.x
                        },
                        y: {
                            start: b.y,
                            end: c.y
                        }
                    }
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    38: [function(a, b, d) {
        var e = a("../core/core.js"),
            f = window.document;
        e.extend({
            audio: {
                sounds: {},
                supported: null,
                codecs: {
                    ogg: 'audio/ogg; codecs="vorbis"',
                    wav: 'audio/wav; codecs="1"',
                    webma: 'audio/webm; codecs="vorbis"',
                    mp3: 'audio/mpeg; codecs="mp3"',
                    m4a: 'audio/mp4; codecs="mp4a.40.2"'
                },
                volume: 1,
                muted: !1,
                paused: !1,
                playCheck: null,
                _canPlay: function() {
                    if (this.supported = {}, e.support.audio) {
                        var a, b = this.audioElement();
                        for (var c in this.codecs) a = b.canPlayType(this.codecs[c]), "" !== a && "no" !== a ? this.supported[c] = !0 : this.supported[c] = !1
                    }
                },
                supports: function(a) {
                    return null === this.supported && this._canPlay(), this.supported[a] ? !0 : !1
                },
                audioElement: function() {
                    return "undefined" != typeof Audio ? new Audio("") : f.createElement("audio")
                },
                create: function(a, b) {
                    var c = b.substr(b.lastIndexOf(".") + 1).toLowerCase();
                    if (!this.supports(c)) return !1;
                    var d = this.audioElement();
                    return d.id = a, d.preload = "auto", d.volume = e.audio.volume, d.src = b, e.asset(b, d), this.sounds[a] = {
                        obj: d,
                        played: 0,
                        volume: e.audio.volume
                    }, this.sounds[a]
                },
                add: function(a, b) {
                    if (e.support.audio) {
                        var c, d;
                        if (1 === arguments.length && "object" == typeof a)
                            for (var f in a)
                                for (c in a[f])
                                    if (d = e.audio.create(f, a[f][c])) break;
                        if ("string" == typeof a && ("string" == typeof b && (d = e.audio.create(a, b)), "object" == typeof b))
                            for (c in b)
                                if (d = e.audio.create(a, b[c])) break;
                        return d
                    }
                },
                play: function(a, b, c) {
                    if (0 !== b && e.support.audio && this.sounds[a]) {
                        var d = this.sounds[a],
                            f = this.getOpenChannel();
                        if (!f) return null;
                        f.id = a, f.repeat = b;
                        var g = f.obj;
                        return f.volume = d.volume = d.obj.volume = c || e.audio.volume, g.volume = d.volume, g.src = d.obj.src, this.muted && (g.volume = 0), g.play(), d.played++, f.onEnd = function() {
                            d.played < f.repeat || -1 == b ? (this.currentTime && (this.currentTime = 0), this.play(), d.played++) : (f.active = !1, this.pause(), this.removeEventListener("ended", f.onEnd, !0), this.currentTime = 0, e.trigger("SoundComplete", {
                                id: f.id
                            }))
                        }, g.addEventListener("ended", f.onEnd, !0), g
                    }
                },
                maxChannels: 7,
                setChannels: function(a) {
                    this.maxChannels = a, a < this.channels.length && (this.channels.length = a)
                },
                channels: [],
                getOpenChannel: function() {
                    for (var a = 0; a < this.channels.length; a++) {
                        var b = this.channels[a];
                        if (b.active === !1 || b.obj.ended && b.repeat <= this.sounds[b.id].played) return b.active = !0, b
                    }
                    if (a < this.maxChannels) {
                        var c = {
                            obj: this.audioElement(),
                            active: !0,
                            _is: function(a) {
                                return this.id === a && this.active
                            }
                        };
                        return this.channels.push(c), c
                    }
                    return null
                },
                remove: function(a) {
                    if (e.support.audio) {
                        var b, c, d = e.paths().audio;
                        if (a) this.sounds[a] && (b = this.sounds[a], c = b.obj.src.split("/").pop(), e.audio.stop(a), delete e.assets[d + c], delete e.assets[b.obj.src], delete e.audio.sounds[a]);
                        else
                            for (var f in this.sounds) b = this.sounds[f], c = b.obj.src.split("/").pop(), e.audio.stop(a), delete e.assets[d + c], delete e.assets[b.obj.src], delete e.audio.sounds[a]
                    }
                },
                stop: function(a) {
                    if (e.support.audio)
                        for (var b in this.channels) c = this.channels[b], (!a && c.active || c._is(a)) && (c.active = !1, c.obj.pause())
                },
                _mute: function(a) {
                    if (e.support.audio) {
                        var b;
                        for (var c in this.channels) b = this.channels[c], b.obj.volume = a ? 0 : b.volume;
                        this.muted = a
                    }
                },
                toggleMute: function() {
                    this.muted ? this._mute(!1) : this._mute(!0)
                },
                mute: function() {
                    this._mute(!0)
                },
                unmute: function() {
                    this._mute(!1)
                },
                pause: function(a) {
                    if (e.support.audio && a && this.sounds[a]) {
                        var b;
                        for (var c in this.channels) b = this.channels[c], b._is(a) && !b.obj.paused && b.obj.pause()
                    }
                },
                unpause: function(a) {
                    if (e.support.audio && a && this.sounds[a]) {
                        var b;
                        for (var c in this.channels) b = this.channels[c], b._is(a) && b.obj.paused && b.obj.play()
                    }
                },
                togglePause: function(a) {
                    if (e.support.audio && a && this.sounds[a]) {
                        var b;
                        for (var c in this.channels) b = this.channels[c], b._is(a) && (b.obj.paused ? b.obj.play() : b.obj.pause())
                    }
                },
                isPlaying: function(a) {
                    if (!e.support.audio) return !1;
                    for (var b in this.channels)
                        if (this.channels[b]._is(a)) return !0;
                    return !1
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    39: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = a("./spatial-grid.js");
        d.map = new e;
        var f = Math,
            g = (f.cos, f.sin, f.PI),
            h = g / 180;
        d.c("2D", {
            _x: 0,
            _y: 0,
            _w: 0,
            _h: 0,
            _z: 0,
            _rotation: 0,
            _alpha: 1,
            _visible: !0,
            _globalZ: null,
            _origin: null,
            _mbr: null,
            _entry: null,
            _children: null,
            _parent: null,
            _changed: !1,
            _2D_property_definitions: {
                x: {
                    set: function(a) {
                        this._attr("_x", a)
                    },
                    get: function() {
                        return this._x
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _x: {
                    enumerable: !1
                },
                y: {
                    set: function(a) {
                        this._attr("_y", a)
                    },
                    get: function() {
                        return this._y
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _y: {
                    enumerable: !1
                },
                w: {
                    set: function(a) {
                        this._attr("_w", a)
                    },
                    get: function() {
                        return this._w
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _w: {
                    enumerable: !1
                },
                h: {
                    set: function(a) {
                        this._attr("_h", a)
                    },
                    get: function() {
                        return this._h
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _h: {
                    enumerable: !1
                },
                z: {
                    set: function(a) {
                        this._attr("_z", a)
                    },
                    get: function() {
                        return this._z
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _z: {
                    enumerable: !1
                },
                rotation: {
                    set: function(a) {
                        this._attr("_rotation", a)
                    },
                    get: function() {
                        return this._rotation
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _rotation: {
                    enumerable: !1
                },
                alpha: {
                    set: function(a) {
                        this._attr("_alpha", a)
                    },
                    get: function() {
                        return this._alpha
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _alpha: {
                    enumerable: !1
                },
                visible: {
                    set: function(a) {
                        this._attr("_visible", a)
                    },
                    get: function() {
                        return this._visible
                    },
                    configurable: !0,
                    enumerable: !0
                },
                _visible: {
                    enumerable: !1
                }
            },
            _define2DProperties: function() {
                for (var a in this._2D_property_definitions) Object.defineProperty(this, a, this._2D_property_definitions[a])
            },
            init: function() {
                this._globalZ = this[0], this._origin = {
                    x: 0,
                    y: 0
                }, this._bx1 = 0, this._bx2 = 0, this._by1 = 0, this._by2 = 0, this._children = [], this._define2DProperties(), this._entry = d.map.insert(this), this.bind("Move", function(a) {
                    var b = this._cbr || this._mbr || this;
                    this._entry.update(b), this._children.length > 0 && this._cascade(a)
                }), this.bind("Rotate", function(a) {
                    var b = this._cbr || this._mbr || this;
                    this._entry.update(b), this._children.length > 0 && this._cascade(a)
                }), this.bind("Remove", function() {
                    if (this._children) {
                        for (var a = 0; a < this._children.length; a++) delete this._children[a]._parent, this._children[a].destroy && this._children[a].destroy();
                        this._children = []
                    }
                    this._parent && this._parent.detach(this), d.map.remove(this), this.detach()
                })
            },
            offsetBoundary: function(a, b, c, d) {
                return 1 === arguments.length && (b = c = d = a), this._bx1 = a, this._bx2 = c, this._by1 = b, this._by2 = d, this.trigger("BoundaryOffset"), this._calculateMBR(), this
            },
            _calculateMBR: function() {
                var a = this._origin.x + this._x,
                    b = this._origin.y + this._y,
                    c = -this._rotation * h,
                    d = this._x - this._bx1 - a,
                    e = this._x + this._w + this._bx2 - a,
                    f = this._y - this._by1 - b,
                    g = this._y + this._h + this._by2 - b,
                    i = Math.cos(c),
                    j = Math.sin(c);
                i = 1e-10 > i && i > -1e-10 ? 0 : i, j = 1e-10 > j && j > -1e-10 ? 0 : j;
                var k = d * i + f * j,
                    l = -d * j + f * i,
                    m = e * i + f * j,
                    n = -e * j + f * i,
                    o = e * i + g * j,
                    p = -e * j + g * i,
                    q = d * i + g * j,
                    r = -d * j + g * i,
                    s = Math.floor(Math.min(k, m, o, q) + a),
                    t = Math.floor(Math.min(l, n, p, r) + b),
                    u = Math.ceil(Math.max(k, m, o, q) + a),
                    v = Math.ceil(Math.max(l, n, p, r) + b);
                if (this._mbr ? (this._mbr._x = s, this._mbr._y = t, this._mbr._w = u - s, this._mbr._h = v - t) : this._mbr = {
                        _x: s,
                        _y: t,
                        _w: u - s,
                        _h: v - t
                    }, this._cbr) {
                    var w = this._cbr,
                        x = w.cx,
                        y = w.cy,
                        z = w.r,
                        A = a + (x + this._x - a) * i + (y + this._y - b) * j,
                        B = b - (x + this._x - a) * j + (y + this._y - b) * i;
                    w._x = Math.min(A - z, s), w._y = Math.min(B - z, t), w._w = Math.max(A + z, u) - w._x, w._h = Math.max(B + z, v) - w._y
                }
            },
            _rotate: function(a) {
                var b = this._rotation - a;
                if (0 !== b) {
                    this._rotation = a;
                    var c = {
                        x: this._origin.x + this._x,
                        y: this._origin.y + this._y
                    };
                    this._calculateMBR();
                    var d = b * h,
                        e = Math.cos(d),
                        f = Math.sin(d);
                    this.trigger("Rotate", {
                        cos: e > -1e-10 && 1e-10 > e ? 0 : e,
                        sin: f > -1e-10 && 1e-10 > f ? 0 : f,
                        deg: b,
                        rad: d,
                        o: c
                    })
                }
            },
            area: function() {
                return this._w * this._h
            },
            intersect: function(a, b, c, d) {
                var e, f = this._mbr || this;
                return e = "object" == typeof a ? a : {
                    _x: a,
                    _y: b,
                    _w: c,
                    _h: d
                }, f._x < e._x + e._w && f._x + f._w > e._x && f._y < e._y + e._h && f._y + f._h > e._y
            },
            within: function(a, b, c, d) {
                var e, f = this._mbr || this;
                return e = "object" == typeof a ? a : {
                    _x: a,
                    _y: b,
                    _w: c,
                    _h: d
                }, e._x <= f._x && e._x + e._w >= f._x + f._w && e._y <= f._y && e._y + e._h >= f._y + f._h
            },
            contains: function(a, b, c, d) {
                var e, f = this._mbr || this;
                return e = "object" == typeof a ? a : {
                    _x: a,
                    _y: b,
                    _w: c,
                    _h: d
                }, e._x >= f._x && e._x + e._w <= f._x + f._w && e._y >= f._y && e._y + e._h <= f._y + f._h
            },
            pos: function(a) {
                return a = a || {}, a._x = this._x, a._y = this._y, a._w = this._w, a._h = this._h, a
            },
            mbr: function(a) {
                return a = a || {}, this._mbr ? (a._x = this._mbr._x, a._y = this._mbr._y, a._w = this._mbr._w, a._h = this._mbr._h, a) : this.pos(a)
            },
            isAt: function(a, b) {
                if (this.mapArea) return this.mapArea.containsPoint(a, b);
                if (this.map) return this.map.containsPoint(a, b);
                var c = this._mbr || this;
                return c._x <= a && c._x + c._w >= a && c._y <= b && c._y + c._h >= b
            },
            move: function(a, b) {
                return "n" === a.charAt(0) && (this.y -= b), "s" === a.charAt(0) && (this.y += b), ("e" === a || "e" === a.charAt(1)) && (this.x += b), ("w" === a || "w" === a.charAt(1)) && (this.x -= b), this
            },
            shift: function(a, b, c, d) {
                return a && (this.x += a), b && (this.y += b), c && (this.w += c), d && (this.h += d), this
            },
            _cascade: function(a) {
                if (a) {
                    var b, c = 0,
                        d = this._children,
                        e = d.length;
                    if ("cos" in a || "sin" in a)
                        for (; e > c; ++c) b = d[c], "rotate" in b && b.rotate(a);
                    else
                        for (var f = this._x - a._x, g = this._y - a._y, h = this._w - a._w, i = this._h - a._h; e > c; ++c) b = d[c], b.shift(f, g, h, i)
                }
            },
            attach: function() {
                for (var a, b = 0, c = arguments, d = arguments.length; d > b; ++b) a = c[b], a._parent && a._parent.detach(a), a._parent = this, this._children.push(a);
                return this
            },
            detach: function(a) {
                var b;
                if (!a) {
                    for (b = 0; b < this._children.length; b++) this._children[b]._parent = null;
                    return this._children = [], this
                }
                for (b = 0; b < this._children.length; b++) this._children[b] == a && this._children.splice(b, 1);
                return a._parent = null, this
            },
            origin: function(a, b) {
                if ("string" == typeof a)
                    if ("centre" === a || "center" === a || -1 === a.indexOf(" ")) a = this._w / 2, b = this._h / 2;
                    else {
                        var c = a.split(" ");
                        "top" === c[0] ? b = 0 : "bottom" === c[0] ? b = this._h : ("middle" === c[0] || "center" === c[1] || "centre" === c[1]) && (b = this._h / 2), "center" === c[1] || "centre" === c[1] || "middle" === c[1] ? a = this._w / 2 : "left" === c[1] ? a = 0 : "right" === c[1] && (a = this._w)
                    }
                return this._origin.x = a, this._origin.y = b, this
            },
            flip: function(a) {
                return a = a || "X", this["_flip" + a] || (this["_flip" + a] = !0, this.trigger("Invalidate")), this
            },
            unflip: function(a) {
                return a = a || "X", this["_flip" + a] && (this["_flip" + a] = !1, this.trigger("Invalidate")), this
            },
            rotate: function(a) {
                var b, c;
                b = (this._x + this._origin.x - a.o.x) * a.cos + (this._y + this._origin.y - a.o.y) * a.sin + (a.o.x - this._origin.x), c = (this._y + this._origin.y - a.o.y) * a.cos - (this._x + this._origin.x - a.o.x) * a.sin + (a.o.y - this._origin.y), this._attr("_rotation", this._rotation - a.deg), this._attr("_x", b), this._attr("_y", c)
            },
            _attr: function(a, b) {
                if (this[a] !== b) {
                    var c, e = d.rectManager._pool.copy(this);
                    if ("_rotation" === a) this._rotate(b);
                    else if ("_z" === a) {
                        var f = b << 0;
                        b = b == f ? f : f + 1, this._globalZ = 1e5 * b + this[0], this[a] = b, this.trigger("Reorder")
                    } else if ("_x" === a || "_y" === a) c = this._mbr, c && (c[a] -= this[a] - b, this._cbr && (this._cbr[a] -= this[a] - b)), this[a] = b, this.trigger("Move", e);
                    else if ("_h" === a || "_w" === a) {
                        c = this._mbr;
                        var g = this[a];
                        this[a] = b, c && this._calculateMBR(), "_w" === a ? this.trigger("Resize", {
                            axis: "w",
                            amount: b - g
                        }) : "_h" === a && this.trigger("Resize", {
                            axis: "h",
                            amount: b - g
                        }), this.trigger("Move", e)
                    }
                    this[a] = b, this.trigger("Invalidate"), d.rectManager._pool.recycle(e)
                }
            }
        }), d.c("Supportable", {
            _ground: null,
            _groundComp: null,
            canLand: !0,
            init: function() {
                this.requires("2D"), this.__area = {
                    _x: 0,
                    _y: 0,
                    _w: 0,
                    _h: 0
                }, this.defineField("ground", function() {
                    return this._ground
                }, function(a) {})
            },
            remove: function(a) {
                this.unbind("EnterFrame", this._detectGroundTick)
            },
            startGroundDetection: function(a) {
                return a && (this._groundComp = a), this.uniqueBind("EnterFrame", this._detectGroundTick), this
            },
            stopGroundDetection: function() {
                return this.unbind("EnterFrame", this._detectGroundTick), this
            },
            _detectGroundTick: function() {
                var a = this._groundComp,
                    b = this._ground,
                    c = d.rectManager.overlap,
                    e = this._cbr || this._mbr || this,
                    f = this.__area;
                if (f._x = e._x, f._y = e._y + 1, f._w = e._w, f._h = e._h, b) {
                    var g = b._cbr || b._mbr || b;
                    b.__c[a] && c(g, f) || (this._ground = null, this.trigger("LiftedOffGround", b), b = null)
                }
                if (!b)
                    for (var h, i, j = d.map.search(f, !1), k = 0, l = j.length; l > k; ++k)
                        if (h = j[k], i = h._cbr || h._mbr || h, h !== this && h.__c[a] && c(i, f) && (this.canLand = !0, this.trigger("CheckLanding", h), this.canLand)) {
                            this._ground = b = h, this.y = h._y - this._h, this.trigger("LandedOnGround", b);
                            break
                        }
            }
        }), d.c("GroundAttacher", {
            _groundAttach: function(a) {
                a.attach(this)
            },
            _groundDetach: function(a) {
                a.detach(this)
            },
            init: function() {
                this.requires("Supportable"), this.bind("LandedOnGround", this._groundAttach), this.bind("LiftedOffGround", this._groundDetach)
            },
            remove: function(a) {
                this.unbind("LandedOnGround", this._groundAttach), this.unbind("LiftedOffGround", this._groundDetach)
            }
        }), d.c("Gravity", {
            _gravityConst: 500,
            init: function() {
                this.requires("2D, Supportable, Motion"), this.bind("LiftedOffGround", this._startGravity), this.bind("LandedOnGround", this._stopGravity)
            },
            remove: function(a) {
                this.unbind("LiftedOffGround", this._startGravity), this.unbind("LandedOnGround", this._stopGravity)
            },
            _gravityCheckLanding: function(a) {
                this._dy < 0 && (this.canLand = !1)
            },
            gravity: function(a) {
                return this.bind("CheckLanding", this._gravityCheckLanding), this.startGroundDetection(a), this._startGravity(), this
            },
            antigravity: function() {
                return this._stopGravity(), this.stopGroundDetection(), this.unbind("CheckLanding", this._gravityCheckLanding), this
            },
            gravityConst: function(a) {
                return this._gravityActive && (this.ay -= this._gravityConst, this.ay += a), this._gravityConst = a, this
            },
            _startGravity: function() {
                this._gravityActive = !0, this.ay += this._gravityConst
            },
            _stopGravity: function() {
                this.ay = 0, this.vy = 0, this._gravityActive = !1
            }
        });
        var i = function(a, b, c, e) {
                var f = b + c,
                    g = "_" + f,
                    h = {
                        key: "",
                        oldValue: 0
                    };
                e ? d.defineField(a, f, function() {
                    return this[g]
                }, function(a) {
                    var b = this[g];
                    a !== b && (this[g] = a, h.key = f, h.oldValue = b, this.trigger("MotionChange", h))
                }) : d.defineField(a, f, function() {
                    return this[g]
                }, function(a) {}), Object.defineProperty(a, g, {
                    value: 0,
                    writable: !0,
                    enumerable: !1,
                    configurable: !1
                })
            },
            j = function(a, b, c, e) {
                var f = b + "x",
                    g = b + "y",
                    h = "_" + f,
                    i = "_" + g;
                return c ? (d.defineField(e, "x", function() {
                    return a[h]
                }, function(b) {
                    a[f] = b
                }), d.defineField(e, "y", function() {
                    return a[i]
                }, function(b) {
                    a[g] = b
                })) : (d.defineField(e, "x", function() {
                    return a[h]
                }, function(a) {}), d.defineField(e, "y", function() {
                    return a[i]
                }, function(a) {})), Object.seal && Object.seal(e), e
            };
        d.c("AngularMotion", {
            _vrotation: 0,
            _arotation: 0,
            _drotation: 0,
            init: function() {
                this.requires("2D"), i(this, "v", "rotation", !0), i(this, "a", "rotation", !0), i(this, "d", "rotation", !1), this.__oldRotationDirection = 0, this.bind("EnterFrame", this._angularMotionTick)
            },
            remove: function(a) {
                this.unbind("EnterFrame", this._angularMotionTick)
            },
            resetAngularMotion: function() {
                return this._drotation = 0, this.vrotation = 0, this.arotation = 0, this
            },
            _angularMotionTick: function(a) {
                var b = a.dt / 1e3,
                    c = this._rotation,
                    d = this._vrotation,
                    e = this._arotation,
                    f = c + d * b + .5 * e * b * b;
                this.vrotation = d + e * b;
                var g = this._vrotation,
                    h = g ? 0 > g ? -1 : 1 : 0;
                this.__oldRotationDirection !== h && (this.__oldRotationDirection = h, this.trigger("NewRotationDirection", h)), this._drotation = f - c, 0 !== this._drotation && (this.rotation = f, this.trigger("Rotated", c))
            }
        }), d.c("Motion", {
            _vx: 0,
            _vy: 0,
            _ax: 0,
            _ay: 0,
            _dx: 0,
            _dy: 0,
            init: function() {
                this.requires("2D"), i(this, "v", "x", !0), i(this, "v", "y", !0), this._velocity = j(this, "v", !0, new d.math.Vector2D), i(this, "a", "x", !0), i(this, "a", "y", !0), this._acceleration = j(this, "a", !0, new d.math.Vector2D), i(this, "d", "x", !1), i(this, "d", "y", !1), this._motionDelta = j(this, "d", !1, new d.math.Vector2D), this.__movedEvent = {
                    axis: "",
                    oldValue: 0
                }, this.__oldDirection = {
                    x: 0,
                    y: 0
                }, this.bind("EnterFrame", this._linearMotionTick)
            },
            remove: function(a) {
                this.unbind("EnterFrame", this._linearMotionTick)
            },
            resetMotion: function() {
                return this.vx = 0, this.vy = 0, this.ax = 0, this.ay = 0, this._dx = 0, this._dy = 0, this
            },
            motionDelta: function() {
                return this._motionDelta
            },
            velocity: function() {
                return this._velocity
            },
            acceleration: function() {
                return this._acceleration
            },
            _linearMotionTick: function(a) {
                var b = a.dt / 1e3,
                    c = this._x,
                    d = this._vx,
                    e = this._ax,
                    f = this._y,
                    g = this._vy,
                    h = this._ay,
                    i = c + d * b + .5 * e * b * b,
                    j = f + g * b + .5 * h * b * b;
                this.vx = d + e * b, this.vy = g + h * b;
                var k = this.__oldDirection,
                    l = this._vx,
                    m = l ? 0 > l ? -1 : 1 : 0,
                    n = this._vy,
                    o = n ? 0 > n ? -1 : 1 : 0;
                (k.x !== m || k.y !== o) && (k.x = m, k.y = o, this.trigger("NewDirection", k));
                var p = this.__movedEvent;
                this._dx = i - c, this._dy = j - f, 0 !== this._dx && (this.x = i, p.axis = "x", p.oldValue = c, this.trigger("Moved", p)), 0 !== this._dy && (this.y = j, p.axis = "y", p.oldValue = f, this.trigger("Moved", p))
            }
        }), d.polygon = function(a) {
            arguments.length > 1 && (a = Array.prototype.slice.call(arguments, 0)), this.points = a
        }, d.polygon.prototype = {
            containsPoint: function(a, b) {
                var c, d, e = this.points,
                    f = e.length / 2,
                    g = !1;
                for (c = 0, d = f - 1; f > c; d = c++) e[2 * c + 1] > b != e[2 * d + 1] > b && a < (e[2 * d] - e[2 * c]) * (b - e[2 * c + 1]) / (e[2 * d + 1] - e[2 * c + 1]) + e[2 * c] && (g = !g);
                return g
            },
            shift: function(a, b) {
                for (var c = 0, d = this.points, e = d.length; e > c; c += 2) d[c] += a, d[c + 1] += b
            },
            clone: function() {
                return new d.polygon(this.points.slice(0))
            },
            rotate: function(a) {
                for (var b, c, d = 0, e = this.points, f = e.length; f > d; d += 2) b = a.o.x + (e[d] - a.o.x) * a.cos + (e[d + 1] - a.o.y) * a.sin, c = a.o.y - (e[d] - a.o.x) * a.sin + (e[d + 1] - a.o.y) * a.cos, e[d] = b, e[d + 1] = c
            }
        }, d.circle = function(a, b, c) {
            this.x = a, this.y = b, this.radius = c, this.points = [];
            for (var d, e = 0; 16 > e; e += 2) d = e * Math.PI / 8, this.points[e] = this.x + Math.sin(d) * c, this.points[e + 1] = this.y + Math.cos(d) * c
        }, d.circle.prototype = {
            containsPoint: function(a, b) {
                var c = this.radius,
                    d = (Math.sqrt, this.x - a),
                    e = this.y - b;
                return c * c > d * d + e * e
            },
            shift: function(a, b) {
                this.x += a, this.y += b;
                for (var c = 0, d = this.points, e = d.length; e > c; c += 2) d[c] += a, d[c + 1] += b
            },
            rotate: function() {}
        }, d.matrix = function(a) {
            this.mtx = a, this.width = a[0].length, this.height = a.length
        }, d.matrix.prototype = {
            x: function(a) {
                if (this.width == a.height) {
                    for (var b = [], c = 0; c < this.height; c++) {
                        b[c] = [];
                        for (var e = 0; e < a.width; e++) {
                            for (var f = 0, g = 0; g < this.width; g++) f += this.mtx[c][g] * a.mtx[g][e];
                            b[c][e] = f
                        }
                    }
                    return new d.matrix(b)
                }
            },
            e: function(a, b) {
                return 1 > a || a > this.mtx.length || 1 > b || b > this.mtx[0].length ? null : this.mtx[a - 1][b - 1]
            }
        }
    }, {
        "../core/core.js": 7,
        "./spatial-grid.js": 43
    }],
    40: [function(a, b, c) {
        var d = a("../core/core.js"),
            e = Math.PI / 180;
        d.c("Collision", {
            init: function() {
                this.requires("2D"), this._collisionData = {}, this.collision()
            },
            remove: function() {
                this._cbr = null, this.unbind("Resize", this._resizeMap), this.unbind("Resize", this._checkBounds)
            },
            collision: function(a) {
                if (this.unbind("Resize", this._resizeMap), this.unbind("Resize", this._checkBounds), a) {
                    if (arguments.length > 1) {
                        var b = Array.prototype.slice.call(arguments, 0);
                        a = new d.polygon(b)
                    } else a = a.constructor === Array ? new d.polygon(a.slice()) : a.clone();
                    this._findBounds(a.points)
                } else a = new d.polygon([0, 0, this._w, 0, this._w, this._h, 0, this._h]), this.bind("Resize", this._resizeMap), this._cbr = null;
                return this.rotation && a.rotate({
                    cos: Math.cos(-this.rotation * e),
                    sin: Math.sin(-this.rotation * e),
                    o: {
                        x: this._origin.x,
                        y: this._origin.y
                    }
                }), this.map = a, this.attach(this.map), this.map.shift(this._x, this._y), this.trigger("NewHitbox", a), this
            },
            _findBounds: function(a) {
                for (var b = 1 / 0, c = -(1 / 0), d = 1 / 0, e = -(1 / 0), f = a.length, g = 0; f > g; g += 2) a[g] < b && (b = a[g]), a[g] > c && (c = a[g]), a[g + 1] < d && (d = a[g + 1]), a[g + 1] > e && (e = a[g + 1]);
                var h = {
                    cx: (b + c) / 2,
                    cy: (d + e) / 2,
                    r: Math.sqrt((c - b) * (c - b) + (e - d) * (e - d)) / 2
                };
                return b >= 0 && d >= 0 && (this._checkBounds = function() {
                    null === this._cbr && this._w < c || this._h < e ? (this._cbr = h, this._calculateMBR()) : this._cbr && (this._cbr = null, this._calculateMBR())
                }, this.bind("Resize", this._checkBounds)), b >= 0 && d >= 0 && c <= this._w && e <= this._h ? (this._cbr = null, !1) : (this._cbr = h, this._calculateMBR(), !0)
            },
            _resizeMap: function(a) {
                var b, c, d = this.rotation * e,
                    f = this.map.points;
                "w" === a.axis ? (d ? (b = a.amount * Math.cos(d), c = a.amount * Math.sin(d)) : (b = a.amount, c = 0), f[2] += b, f[3] += c) : (d ? (c = a.amount * Math.cos(d), b = -a.amount * Math.sin(d)) : (b = 0, c = a.amount), f[6] += b, f[7] += c), f[4] += b, f[5] += c
            },
            hit: function(a) {
                var b, c, e, f, g = this._cbr || this._mbr || this,
                    h = d.map.search(g, !1),
                    i = 0,
                    j = h.length,
                    k = {},
                    l = d.rectManager.overlap,
                    m = "map" in this && "containsPoint" in this.map,
                    n = [];
                if (!j) return !1;
                for (; j > i; ++i) c = h[i], e = c._cbr || c._mbr || c, c && (b = c[0], !k[b] && this[0] !== b && c.__c[a] && l(e, g) && (k[b] = c));
                for (f in k)
                    if (c = k[f], m && "map" in c) {
                        var o = this._SAT(this.map, c.map);
                        o.obj = c, o.type = "SAT", o && n.push(o)
                    } else n.push({
                        obj: c,
                        type: "MBR"
                    });
                return n.length ? n : !1
            },
            onHit: function(a, b, c) {
                var d = !1;
                return this.bind("EnterFrame", function() {
                    var e = this.hit(a);
                    e ? (d = !0, b.call(this, e)) : d && ("function" == typeof c && c.call(this), d = !1)
                }), this
            },
            _createCollisionHandler: function(a, b) {
                return function() {
                    var c = this.hit(a);
                    if (b.occurring === !0) {
                        if (c !== !1) return;
                        b.occurring = !1, this.trigger("HitOff", a)
                    } else c !== !1 && (b.occurring = !0, this.trigger("HitOn", c))
                }
            },
            checkHits: function() {
                var a = arguments,
                    b = 0;
                for (1 === a.length && (a = a[0].split(/\s*,\s*/)); b < a.length; ++b) {
                    var c = a[b],
                        d = this._collisionData[c];
                    void 0 === d && (this._collisionData[c] = d = {
                        occurring: !1,
                        handler: null
                    }, d.handler = this._createCollisionHandler(c, d), this.bind("EnterFrame", d.handler))
                }
                return this
            },
            ignoreHits: function() {
                var a, b = arguments,
                    c = 0;
                if (0 === b.length) {
                    for (a in this._collisionData) this.unbind("EnterFrame", a.handler);
                    this._collisionData = {}
                }
                for (1 === b.length && (b = b[0].split(/\s*,\s*/)); c < b.length; ++c) {
                    var d = b[c];
                    a = this._collisionData[d], void 0 !== a && (this.unbind("EnterFrame", a.handler), delete this._collisionData[d])
                }
                return this
            },
            resetHitChecks: function() {
                var a, b = arguments,
                    c = 0;
                if (0 === b.length)
                    for (a in this._collisionData) this._collisionData[a].occurring = !1;
                for (1 === b.length && (b = b[0].split(/\s*,\s*/)); c < b.length; ++c) {
                    var d = b[c];
                    a = this._collisionData[d], void 0 !== a && (a.occurring = !1)
                }
                return this
            },
            _SAT: function(a, b) {
                for (var c, d, e, f, g, h, i, j, k, l = 0, m = a.points, n = b.points, o = m.length / 2, p = n.length / 2, q = 0, r = 0, s = -(1 / 0), t = null, u = null; o > l; l++) {
                    for (k = l == o - 1 ? 0 : l + 1, q = -(m[2 * l + 1] - m[2 * k + 1]), r = m[2 * l] - m[2 * k], d = Math.sqrt(q * q + r * r), q /= d, r /= d, e = f = 1 / 0, g = h = -(1 / 0), c = 0; o > c; ++c) j = m[2 * c] * q + m[2 * c + 1] * r, j > g && (g = j), e > j && (e = j);
                    for (c = 0; p > c; ++c) j = n[2 * c] * q + n[2 * c + 1] * r, j > h && (h = j), f > j && (f = j);
                    if (f > e ? (i = f - g, q = -q, r = -r) : i = e - h, i >= 0) return !1;
                    i > s && (s = i, t = q, u = r)
                }
                for (l = 0; p > l; l++) {
                    for (k = l == p - 1 ? 0 : l + 1, q = -(n[2 * l + 1] - n[2 * k + 1]), r = n[2 * l] - n[2 * k], d = Math.sqrt(q * q + r * r), q /= d, r /= d, e = f = 1 / 0, g = h = -(1 / 0), c = 0; o > c; ++c) j = m[2 * c] * q + m[2 * c + 1] * r, j > g && (g = j), e > j && (e = j);
                    for (c = 0; p > c; ++c) j = n[2 * c] * q + n[2 * c + 1] * r, j > h && (h = j), f > j && (f = j);
                    if (f > e ? (i = f - g, q = -q, r = -r) : i = e - h, i >= 0) return !1;
                    i > s && (s = i, t = q, u = r)
                }
                return {
                    overlap: s,
                    normal: {
                        x: t,
                        y: u
                    }
                }
            }
        })
    }, {
        "../core/core.js": 7
    }],
    41: [function(a, b, c) {
        var d = a("../core/core.js");
        d.math = {
            abs: function(a) {
                return 0 > a ? -a : a
            },
            amountOf: function(a, b, c) {
                return c > b ? (a - b) / (c - b) : (a - c) / (b - c)
            },
            clamp: function(a, b, c) {
                return a > c ? c : b > a ? b : a
            },
            degToRad: function(a) {
                return a * Math.PI / 180
            },
            distance: function(a, b, c, e) {
                var f = d.math.squaredDistance(a, b, c, e);
                return Math.sqrt(parseFloat(f))
            },
            lerp: function(a, b, c) {
                return a + (b - a) * c
            },
            negate: function(a) {
                return Math.random() < a ? -1 : 1
            },
            radToDeg: function(a) {
                return 180 * a / Math.PI
            },
            randomElementOfArray: function(a) {
                return a[Math.floor(a.length * Math.random())]
            },
            randomInt: function(a, b) {
                return a + Math.floor((1 + b - a) * Math.random())
            },
            randomNumber: function(a, b) {
                return a + (b - a) * Math.random()
            },
            squaredDistance: function(a, b, c, d) {
                return (a - c) * (a - c) + (b - d) * (b - d)
            },
            withinRange: function(a, b, c) {
                return a >= b && c >= a
            }
        }, d.math.Vector2D = function() {
            function a(b, c) {
                if (b instanceof a) this.x = b.x, this.y = b.y;
                else if (2 === arguments.length) this.x = b, this.y = c;
                else if (arguments.length > 0) throw "Unexpected number of arguments for Vector2D()"
            }
            return a.prototype.x = 0, a.prototype.y = 0, a.prototype.add = function(a) {
                return this.x += a.x, this.y += a.y, this
            }, a.prototype.angleBetween = function(a) {
                return Math.atan2(this.x * a.y - this.y * a.x, this.x * a.x + this.y * a.y)
            }, a.prototype.angleTo = function(a) {
                return Math.atan2(a.y - this.y, a.x - this.x)
            }, a.prototype.clone = function() {
                return new a(this)
            }, a.prototype.distance = function(a) {
                return Math.sqrt((a.x - this.x) * (a.x - this.x) + (a.y - this.y) * (a.y - this.y))
            }, a.prototype.distanceSq = function(a) {
                return (a.x - this.x) * (a.x - this.x) + (a.y - this.y) * (a.y - this.y)
            }, a.prototype.divide = function(a) {
                return this.x /= a.x, this.y /= a.y, this
            }, a.prototype.dotProduct = function(a) {
                return this.x * a.x + this.y * a.y
            }, a.prototype.crossProduct = function(a) {
                return this.x * a.y - this.y * a.x
            }, a.prototype.equals = function(b) {
                return b instanceof a && this.x == b.x && this.y == b.y
            }, a.prototype.perpendicular = function(b) {
                return b = b || new a, b.setValues(-this.y, this.x)
            }, a.prototype.getNormal = function(b, c) {
                return c = c || new a, c.setValues(b.y - this.y, this.x - b.x).normalize()
            }, a.prototype.isZero = function() {
                return 0 === this.x && 0 === this.y
            }, a.prototype.magnitude = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            }, a.prototype.magnitudeSq = function() {
                return this.x * this.x + this.y * this.y
            }, a.prototype.multiply = function(a) {
                return this.x *= a.x, this.y *= a.y, this
            }, a.prototype.negate = function() {
                return this.x = -this.x, this.y = -this.y, this
            }, a.prototype.normalize = function() {
                var a = Math.sqrt(this.x * this.x + this.y * this.y);
                return 0 === a ? (this.x = 1, this.y = 0) : (this.x /= a, this.y /= a), this
            }, a.prototype.scale = function(a, b) {
                return void 0 === b && (b = a), this.x *= a, this.y *= b, this
            }, a.prototype.scaleToMagnitude = function(a) {
                var b = a / this.magnitude();
                return this.x *= b, this.y *= b, this
            }, a.prototype.setValues = function(b, c) {
                return b instanceof a ? (this.x = b.x, this.y = b.y) : (this.x = b, this.y = c), this
            }, a.prototype.subtract = function(a) {
                return this.x -= a.x, this.y -= a.y, this
            }, a.prototype.toString = function() {
                return "Vector2D(" + this.x + ", " + this.y + ")"
            }, a.prototype.translate = function(a, b) {
                return void 0 === b && (b = a), this.x += a, this.y += b, this
            }, a.tripleProduct = function(a, b, c, e) {
                e = e || new d.math.Vector2D;
                var f = a.dotProduct(c),
                    g = b.dotProduct(c);
                return e.setValues(b.x * f - a.x * g, b.y * f - a.y * g)
            }, a
        }(), d.math.Matrix2D = function() {
            return Matrix2D = function(a, b, c, d, e, f) {
                if (a instanceof Matrix2D) this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, this.f = a.f;
                else if (6 === arguments.length) this.a = a, this.b = b, this.c = c, this.d = d, this.e = e, this.f = f;
                else if (arguments.length > 0) throw "Unexpected number of arguments for Matrix2D()"
            }, Matrix2D.prototype.a = 1, Matrix2D.prototype.b = 0, Matrix2D.prototype.c = 0, Matrix2D.prototype.d = 1, Matrix2D.prototype.e = 0, Matrix2D.prototype.f = 0, Matrix2D.prototype.apply = function(a) {
                var b = a.x;
                return a.x = b * this.a + a.y * this.c + this.e, a.y = b * this.b + a.y * this.d + this.f, a
            }, Matrix2D.prototype.clone = function() {
                return new Matrix2D(this)
            }, Matrix2D.prototype.combine = function(a) {
                var b = this.a;
                return this.a = b * a.a + this.b * a.c, this.b = b * a.b + this.b * a.d, b = this.c, this.c = b * a.a + this.d * a.c, this.d = b * a.b + this.d * a.d, b = this.e, this.e = b * a.a + this.f * a.c + a.e, this.f = b * a.b + this.f * a.d + a.f, this
            }, Matrix2D.prototype.equals = function(a) {
                return a instanceof Matrix2D && this.a == a.a && this.b == a.b && this.c == a.c && this.d == a.d && this.e == a.e && this.f == a.f
            }, Matrix2D.prototype.determinant = function() {
                return this.a * this.d - this.b * this.c
            }, Matrix2D.prototype.invert = function() {
                var a = this.determinant();
                if (0 !== a) {
                    var b = {
                        a: this.a,
                        b: this.b,
                        c: this.c,
                        d: this.d,
                        e: this.e,
                        f: this.f
                    };
                    this.a = b.d / a, this.b = -b.b / a, this.c = -b.c / a, this.d = b.a / a, this.e = (b.c * b.f - b.e * b.d) / a, this.f = (b.e * b.b - b.a * b.f) / a
                }
                return this
            }, Matrix2D.prototype.isIdentity = function() {
                return 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d && 0 === this.e && 0 === this.f
            }, Matrix2D.prototype.isInvertible = function() {
                return 0 !== this.determinant()
            }, Matrix2D.prototype.preRotate = function(a) {
                var b = Math.cos(a),
                    c = Math.sin(a),
                    d = this.a;
                return this.a = b * d - c * this.b, this.b = c * d + b * this.b, d = this.c, this.c = b * d - c * this.d, this.d = c * d + b * this.d, this
            }, Matrix2D.prototype.preScale = function(a, b) {
                return void 0 === b && (b = a), this.a *= a, this.b *= b, this.c *= a, this.d *= b, this
            }, Matrix2D.prototype.preTranslate = function(a, b) {
                return "number" == typeof a ? (this.e += a, this.f += b) : (this.e += a.x, this.f += a.y), this
            }, Matrix2D.prototype.rotate = function(a) {
                var b = Math.cos(a),
                    c = Math.sin(a),
                    d = this.a;
                return this.a = b * d - c * this.b, this.b = c * d + b * this.b, d = this.c, this.c = b * d - c * this.d, this.d = c * d + b * this.d, d = this.e, this.e = b * d - c * this.f, this.f = c * d + b * this.f, this
            }, Matrix2D.prototype.scale = function(a, b) {
                return void 0 === b && (b = a), this.a *= a, this.b *= b, this.c *= a, this.d *= b, this.e *= a, this.f *= b, this
            }, Matrix2D.prototype.setValues = function(a, b, c, d, e, f) {
                return a instanceof Matrix2D ? (this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, this.f = a.f) : (this.a = a, this.b = b, this.c = c, this.d = d, this.e = e, this.f = f), this
            }, Matrix2D.prototype.toString = function() {
                return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e + "] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])"
            }, Matrix2D.prototype.translate = function(a, b) {
                return "number" == typeof a ? (this.e += this.a * a + this.c * b, this.f += this.b * a + this.d * b) : (this.e += this.a * a.x + this.c * a.y, this.f += this.b * a.x + this.d * a.y), this
            }, Matrix2D
        }()
    }, {
        "../core/core.js": 7
    }],
    42: [function(a, b, c) {
        var d = a("../core/core.js");
        d.extend({
            rectManager: {
                merge: function(a, b, c) {
                    return "undefined" == typeof c && (c = {}), c._h = Math.max(a._y + a._h, b._y + b._h), c._w = Math.max(a._x + a._w, b._x + b._w), c._x = Math.min(a._x, b._x), c._y = Math.min(a._y, b._y), c._w -= c._x, c._h -= c._y, c
                },
                overlap: function(a, b) {
                    return a._x < b._x + b._w && a._x + a._w > b._x && a._y < b._y + b._h && a._y + a._h > b._y
                },
                mergeSet: function(a) {
                    for (var b = 0; b < a.length - 1;) this.overlap(a[b], a[b + 1]) ? (this.merge(a[b], a[b + 1], a[b]), a.splice(b + 1, 1), b > 0 && b--) : b++;
                    return a
                },
                boundingRect: function(a) {
                    if (a && a.length) {
                        var b, c, d = 1,
                            e = a.length,
                            f = a[0];
                        for (f = [f._x, f._y, f._x + f._w, f._y + f._h]; e > d;) b = a[d], c = [b._x, b._y, b._x + b._w, b._y + b._h], c[0] < f[0] && (f[0] = c[0]), c[1] < f[1] && (f[1] = c[1]), c[2] > f[2] && (f[2] = c[2]), c[3] > f[3] && (f[3] = c[3]), d++;
                        return c = f, f = {
                            _x: c[0],
                            _y: c[1],
                            _w: c[2] - c[0],
                            _h: c[3] - c[1]
                        }
                    }
                },
                _pool: function() {
                    var a = [],
                        b = 0;
                    return {
                        get: function(c, d, e, f) {
                            a.length <= b && a.push({});
                            var g = a[b++];
                            return g._x = c, g._y = d, g._w = e, g._h = f, g
                        },
                        copy: function(c) {
                            a.length <= b && a.push({});
                            var d = a[b++];
                            return d._x = c._x, d._y = c._y, d._w = c._w, d._h = c._h, d
                        },
                        recycle: function(a) {
                            b--
                        }
                    }
                }()
            }
        })
    }, {
        "../core/core.js": 7
    }],
    43: [function(a, b, c) {
        function d(a, b, c) {
            this.keys = a, this.map = c, this.obj = b
        }
        var e, f = (a("../core/core.js"), function(a) {
                e = a || 64, this.map = {}
            }),
            g = " ",
            h = {};
        f.prototype = {
            insert: function(a) {
                var b, c, e = f.key(a),
                    g = new d(e, a, this),
                    h = 0;
                for (h = e.x1; h <= e.x2; h++)
                    for (b = e.y1; b <= e.y2; b++) c = h << 16 ^ b, this.map[c] || (this.map[c] = []), this.map[c].push(a);
                return g
            },
            search: function(a, b) {
                var c, d, e, g, i, j = f.key(a, h),
                    k = [];
                for (void 0 === b && (b = !0), c = j.x1; c <= j.x2; c++)
                    for (d = j.y1; d <= j.y2; d++)
                        if (i = this.map[c << 16 ^ d])
                            for (e = 0; e < i.length; e++) k.push(i[e]);
                if (b) {
                    var l, m, n = [],
                        o = {};
                    for (c = 0, g = k.length; g > c; c++) l = k[c], l && (m = l[0], l = l._mbr || l, !o[m] && l._x < a._x + a._w && l._x + l._w > a._x && l._y < a._y + a._h && l._y + l._h > a._y && (o[m] = k[c]));
                    for (l in o) n.push(o[l]);
                    return n
                }
                return k
            },
            remove: function(a, b) {
                var c, d, e = 0;
                for (1 == arguments.length && (b = a,
                        a = f.key(b, h)), e = a.x1; e <= a.x2; e++)
                    for (c = a.y1; c <= a.y2; c++)
                        if (d = e << 16 ^ c, this.map[d]) {
                            var g, i = this.map[d],
                                j = i.length;
                            for (g = 0; j > g; g++) i[g] && i[g][0] === b[0] && i.splice(g, 1)
                        }
            },
            refresh: function(a) {
                var b, c, d, e, g, h = a.keys,
                    i = a.obj;
                for (c = h.x1; c <= h.x2; c++)
                    for (d = h.y1; d <= h.y2; d++)
                        if (b = this.map[c << 16 ^ d])
                            for (g = b.length, e = 0; g > e; e++) b[e] && b[e][0] === i[0] && b.splice(e, 1);
                for (f.key(i, h), c = h.x1; c <= h.x2; c++)
                    for (d = h.y1; d <= h.y2; d++) b = this.map[c << 16 ^ d], b || (b = this.map[c << 16 ^ d] = []), b.push(i);
                return a
            },
            boundaries: function() {
                var a, b, c = {
                        max: {
                            x: -(1 / 0),
                            y: -(1 / 0)
                        },
                        min: {
                            x: 1 / 0,
                            y: 1 / 0
                        }
                    },
                    d = {
                        max: {
                            x: -(1 / 0),
                            y: -(1 / 0)
                        },
                        min: {
                            x: 1 / 0,
                            y: 1 / 0
                        }
                    };
                for (var e in this.map)
                    if (this.map[e].length) {
                        var f = e >> 16,
                            g = e << 16 >> 16;
                        if (0 > g && (f = -1 ^ f), f >= c.max.x) {
                            c.max.x = f;
                            for (a in this.map[e]) b = this.map[e][a], "object" == typeof b && "requires" in b && (d.max.x = Math.max(d.max.x, b.x + b.w))
                        }
                        if (f <= c.min.x) {
                            c.min.x = f;
                            for (a in this.map[e]) b = this.map[e][a], "object" == typeof b && "requires" in b && (d.min.x = Math.min(d.min.x, b.x))
                        }
                        if (g >= c.max.y) {
                            c.max.y = g;
                            for (a in this.map[e]) b = this.map[e][a], "object" == typeof b && "requires" in b && (d.max.y = Math.max(d.max.y, b.y + b.h))
                        }
                        if (g <= c.min.y) {
                            c.min.y = g;
                            for (a in this.map[e]) b = this.map[e][a], "object" == typeof b && "requires" in b && (d.min.y = Math.min(d.min.y, b.y))
                        }
                    }
                return d
            }
        }, f.key = function(a, b) {
            return a._mbr && (a = a._mbr), b || (b = {}), b.x1 = Math.floor(a._x / e), b.y1 = Math.floor(a._y / e), b.x2 = Math.floor((a._w + a._x) / e), b.y2 = Math.floor((a._h + a._y) / e), b
        }, f.hash = function(a) {
            return a.x1 + g + a.y1 + g + a.x2 + g + a.y2
        }, d.prototype = {
            update: function(a) {
                f.hash(f.key(a, h)) != f.hash(this.keys) && this.map.refresh(this)
            }
        }, b.exports = f
    }, {
        "../core/core.js": 7
    }]
}, {}, [17]);