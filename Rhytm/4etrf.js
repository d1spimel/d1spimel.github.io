!function() {
    "use strict";
    var e = function() {
        this.init()
    };
    e.prototype = {
        init: function() {
            var e = this || n;
            return e._counter = 1e3,
            e._html5AudioPool = [],
            e.html5PoolSize = 10,
            e._codecs = {},
            e._howls = [],
            e._muted = !1,
            e._volume = 1,
            e._canPlayEvent = "canplaythrough",
            e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null,
            e.masterGain = null,
            e.noAudio = !1,
            e.usingWebAudio = !0,
            e.autoSuspend = !0,
            e.ctx = null,
            e.autoUnlock = !0,
            e._setup(),
            e
        },
        volume: function(e) {
            var o = this || n;
            if (e = parseFloat(e),
            o.ctx || _(),
            void 0 !== e && e >= 0 && e <= 1) {
                if (o._volume = e,
                o._muted)
                    return o;
                o.usingWebAudio && o.masterGain.gain.setValueAtTime(e, n.ctx.currentTime);
                for (var t = 0; t < o._howls.length; t++)
                    if (!o._howls[t]._webAudio)
                        for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                            var u = o._howls[t]._soundById(r[a]);
                            u && u._node && (u._node.volume = u._volume * e)
                        }
                return o
            }
            return o._volume
        },
        mute: function(e) {
            var o = this || n;
            o.ctx || _(),
            o._muted = e,
            o.usingWebAudio && o.masterGain.gain.setValueAtTime(e ? 0 : o._volume, n.ctx.currentTime);
            for (var t = 0; t < o._howls.length; t++)
                if (!o._howls[t]._webAudio)
                    for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                        var u = o._howls[t]._soundById(r[a]);
                        u && u._node && (u._node.muted = !!e || u._muted)
                    }
            return o
        },
        stop: function() {
            for (var e = this || n, o = 0; o < e._howls.length; o++)
                e._howls[o].stop();
            return e
        },
        unload: function() {
            for (var e = this || n, o = e._howls.length - 1; o >= 0; o--)
                e._howls[o].unload();
            return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(),
            e.ctx = null,
            _()),
            e
        },
        codecs: function(e) {
            return (this || n)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || n;
            if (e.state = e.ctx ? e.ctx.state || "suspended" : "suspended",
            e._autoSuspend(),
            !e.usingWebAudio)
                if ("undefined" != typeof Audio)
                    try {
                        var o = new Audio;
                        void 0 === o.oncanplaythrough && (e._canPlayEvent = "canplay")
                    } catch (n) {
                        e.noAudio = !0
                    }
                else
                    e.noAudio = !0;
            try {
                var o = new Audio;
                o.muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(),
            e
        },
        _setupCodecs: function() {
            var e = this || n
              , o = null;
            try {
                o = "undefined" != typeof Audio ? new Audio : null
            } catch (n) {
                return e
            }
            if (!o || "function" != typeof o.canPlayType)
                return e;
            var t = o.canPlayType("audio/mpeg;").replace(/^no$/, "")
              , r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g)
              , a = r && parseInt(r[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(a || !t && !o.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!t,
                opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!(o.canPlayType('audio/wav; codecs="1"') || o.canPlayType("audio/wav")).replace(/^no$/, ""),
                aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                m4b: !!(o.canPlayType("audio/x-m4b;") || o.canPlayType("audio/m4b;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "")
            },
            e
        },
        _unlockAudio: function() {
            var e = this || n;
            if (!e._audioUnlocked && e.ctx) {
                e._audioUnlocked = !1,
                e.autoUnlock = !1,
                e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0,
                e.unload()),
                e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var o = function(n) {
                    for (; e._html5AudioPool.length < e.html5PoolSize; )
                        try {
                            var t = new Audio;
                            t._unlocked = !0,
                            e._releaseHtml5Audio(t)
                        } catch (n) {
                            e.noAudio = !0;
                            break
                        }
                    for (var r = 0; r < e._howls.length; r++)
                        if (!e._howls[r]._webAudio)
                            for (var a = e._howls[r]._getSoundIds(), u = 0; u < a.length; u++) {
                                var d = e._howls[r]._soundById(a[u]);
                                d && d._node && !d._node._unlocked && (d._node._unlocked = !0,
                                d._node.load())
                            }
                    e._autoResume();
                    var i = e.ctx.createBufferSource();
                    i.buffer = e._scratchBuffer,
                    i.connect(e.ctx.destination),
                    void 0 === i.start ? i.noteOn(0) : i.start(0),
                    "function" == typeof e.ctx.resume && e.ctx.resume(),
                    i.onended = function() {
                        i.disconnect(0),
                        e._audioUnlocked = !0,
                        document.removeEventListener("touchstart", o, !0),
                        document.removeEventListener("touchend", o, !0),
                        document.removeEventListener("click", o, !0);
                        for (var n = 0; n < e._howls.length; n++)
                            e._howls[n]._emit("unlock")
                    }
                };
                return document.addEventListener("touchstart", o, !0),
                document.addEventListener("touchend", o, !0),
                document.addEventListener("click", o, !0),
                e
            }
        },
        _obtainHtml5Audio: function() {
            var e = this || n;
            if (e._html5AudioPool.length)
                return e._html5AudioPool.pop();
            var o = (new Audio).play();
            return o && "undefined" != typeof Promise && (o instanceof Promise || "function" == typeof o.then) && o.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")
            }),
            new Audio
        },
        _releaseHtml5Audio: function(e) {
            var o = this || n;
            return e._unlocked && o._html5AudioPool.push(e),
            o
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) {
                for (var o = 0; o < e._howls.length; o++)
                    if (e._howls[o]._webAudio)
                        for (var t = 0; t < e._howls[o]._sounds.length; t++)
                            if (!e._howls[o]._sounds[t]._paused)
                                return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer),
                e._suspendTimer = setTimeout(function() {
                    if (e.autoSuspend) {
                        e._suspendTimer = null,
                        e.state = "suspending";
                        var n = function() {
                            e.state = "suspended",
                            e._resumeAfterSuspend && (delete e._resumeAfterSuspend,
                            e._autoResume())
                        };
                        e.ctx.suspend().then(n, n)
                    }
                }, 3e4),
                e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio)
                return "running" === e.state && "interrupted" !== e.ctx.state && e._suspendTimer ? (clearTimeout(e._suspendTimer),
                e._suspendTimer = null) : "suspended" === e.state || "running" === e.state && "interrupted" === e.ctx.state ? (e.ctx.resume().then(function() {
                    e.state = "running";
                    for (var n = 0; n < e._howls.length; n++)
                        e._howls[n]._emit("resume")
                }),
                e._suspendTimer && (clearTimeout(e._suspendTimer),
                e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0),
                e
        }
    };
    var n = new e
      , o = function(e) {
        var n = this;
        if (!e.src || 0 === e.src.length)
            return void console.error("An array of source files must be passed with any new Howl.");
        n.init(e)
    };
    o.prototype = {
        init: function(e) {
            var o = this;
            return n.ctx || _(),
            o._autoplay = e.autoplay || !1,
            o._format = "string" != typeof e.format ? e.format : [e.format],
            o._html5 = e.html5 || !1,
            o._muted = e.mute || !1,
            o._loop = e.loop || !1,
            o._pool = e.pool || 5,
            o._preload = "boolean" != typeof e.preload && "metadata" !== e.preload || e.preload,
            o._rate = e.rate || 1,
            o._sprite = e.sprite || {},
            o._src = "string" != typeof e.src ? e.src : [e.src],
            o._volume = void 0 !== e.volume ? e.volume : 1,
            o._xhr = {
                method: e.xhr && e.xhr.method ? e.xhr.method : "GET",
                headers: e.xhr && e.xhr.headers ? e.xhr.headers : null,
                withCredentials: !(!e.xhr || !e.xhr.withCredentials) && e.xhr.withCredentials
            },
            o._duration = 0,
            o._state = "unloaded",
            o._sounds = [],
            o._endTimers = {},
            o._queue = [],
            o._playLock = !1,
            o._onend = e.onend ? [{
                fn: e.onend
            }] : [],
            o._onfade = e.onfade ? [{
                fn: e.onfade
            }] : [],
            o._onload = e.onload ? [{
                fn: e.onload
            }] : [],
            o._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [],
            o._onplayerror = e.onplayerror ? [{
                fn: e.onplayerror
            }] : [],
            o._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [],
            o._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [],
            o._onstop = e.onstop ? [{
                fn: e.onstop
            }] : [],
            o._onmute = e.onmute ? [{
                fn: e.onmute
            }] : [],
            o._onvolume = e.onvolume ? [{
                fn: e.onvolume
            }] : [],
            o._onrate = e.onrate ? [{
                fn: e.onrate
            }] : [],
            o._onseek = e.onseek ? [{
                fn: e.onseek
            }] : [],
            o._onunlock = e.onunlock ? [{
                fn: e.onunlock
            }] : [],
            o._onresume = [],
            o._webAudio = n.usingWebAudio && !o._html5,
            void 0 !== n.ctx && n.ctx && n.autoUnlock && n._unlockAudio(),
            n._howls.push(o),
            o._autoplay && o._queue.push({
                event: "play",
                action: function() {
                    o.play()
                }
            }),
            o._preload && "none" !== o._preload && o.load(),
            o
        },
        load: function() {
            var e = this
              , o = null;
            if (n.noAudio)
                return void e._emit("loaderror", null, "No audio support.");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var r = 0; r < e._src.length; r++) {
                var u, d;
                if (e._format && e._format[r])
                    u = e._format[r];
                else {
                    if ("string" != typeof (d = e._src[r])) {
                        e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                        continue
                    }
                    u = /^data:audio\/([^;,]+);/i.exec(d),
                    u || (u = /\.([^.]+)$/.exec(d.split("?", 1)[0])),
                    u && (u = u[1].toLowerCase())
                }
                if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),
                u && n.codecs(u)) {
                    o = e._src[r];
                    break
                }
            }
            return o ? (e._src = o,
            e._state = "loading",
            "https:" === window.location.protocol && "http:" === o.slice(0, 5) && (e._html5 = !0,
            e._webAudio = !1),
            new t(e),
            e._webAudio && a(e),
            e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
        },
        play: function(e, o) {
            var t = this
              , r = null;
            if ("number" == typeof e)
                r = e,
                e = null;
            else {
                if ("string" == typeof e && "loaded" === t._state && !t._sprite[e])
                    return null;
                if (void 0 === e && (e = "__default",
                !t._playLock)) {
                    for (var a = 0, u = 0; u < t._sounds.length; u++)
                        t._sounds[u]._paused && !t._sounds[u]._ended && (a++,
                        r = t._sounds[u]._id);
                    1 === a ? e = null : r = null
                }
            }
            var d = r ? t._soundById(r) : t._inactiveSound();
            if (!d)
                return null;
            if (r && !e && (e = d._sprite || "__default"),
            "loaded" !== t._state) {
                d._sprite = e,
                d._ended = !1;
                var i = d._id;
                return t._queue.push({
                    event: "play",
                    action: function() {
                        t.play(i)
                    }
                }),
                i
            }
            if (r && !d._paused)
                return o || t._loadQueue("play"),
                d._id;
            t._webAudio && n._autoResume();
            var _ = Math.max(0, d._seek > 0 ? d._seek : t._sprite[e][0] / 1e3)
              , s = Math.max(0, (t._sprite[e][0] + t._sprite[e][1]) / 1e3 - _)
              , l = 1e3 * s / Math.abs(d._rate)
              , c = t._sprite[e][0] / 1e3
              , f = (t._sprite[e][0] + t._sprite[e][1]) / 1e3;
            d._sprite = e,
            d._ended = !1;
            var p = function() {
                d._paused = !1,
                d._seek = _,
                d._start = c,
                d._stop = f,
                d._loop = !(!d._loop && !t._sprite[e][2])
            };
            if (_ >= f)
                return void t._ended(d);
            var m = d._node;
            if (t._webAudio) {
                var v = function() {
                    t._playLock = !1,
                    p(),
                    t._refreshBuffer(d);
                    var e = d._muted || t._muted ? 0 : d._volume;
                    m.gain.setValueAtTime(e, n.ctx.currentTime),
                    d._playStart = n.ctx.currentTime,
                    void 0 === m.bufferSource.start ? d._loop ? m.bufferSource.noteGrainOn(0, _, 86400) : m.bufferSource.noteGrainOn(0, _, s) : d._loop ? m.bufferSource.start(0, _, 86400) : m.bufferSource.start(0, _, s),
                    l !== 1 / 0 && (t._endTimers[d._id] = setTimeout(t._ended.bind(t, d), l)),
                    o || setTimeout(function() {
                        t._emit("play", d._id),
                        t._loadQueue()
                    }, 0)
                };
                "running" === n.state && "interrupted" !== n.ctx.state ? v() : (t._playLock = !0,
                t.once("resume", v),
                t._clearTimer(d._id))
            } else {
                var h = function() {
                    m.currentTime = _,
                    m.muted = d._muted || t._muted || n._muted || m.muted,
                    m.volume = d._volume * n.volume(),
                    m.playbackRate = d._rate;
                    try {
                        var r = m.play();
                        if (r && "undefined" != typeof Promise && (r instanceof Promise || "function" == typeof r.then) ? (t._playLock = !0,
                        p(),
                        r.then(function() {
                            t._playLock = !1,
                            m._unlocked = !0,
                            o || (t._emit("play", d._id),
                            t._loadQueue())
                        }).catch(function() {
                            t._playLock = !1,
                            t._emit("playerror", d._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),
                            d._ended = !0,
                            d._paused = !0
                        })) : o || (t._playLock = !1,
                        p(),
                        t._emit("play", d._id),
                        t._loadQueue()),
                        m.playbackRate = d._rate,
                        m.paused)
                            return void t._emit("playerror", d._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                        "__default" !== e || d._loop ? t._endTimers[d._id] = setTimeout(t._ended.bind(t, d), l) : (t._endTimers[d._id] = function() {
                            t._ended(d),
                            m.removeEventListener("ended", t._endTimers[d._id], !1)
                        }
                        ,
                        m.addEventListener("ended", t._endTimers[d._id], !1))
                    } catch (e) {
                        t._emit("playerror", d._id, e)
                    }
                };
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" === m.src && (m.src = t._src,
                m.load());
                var y = window && window.ejecta || !m.readyState && n._navigator.isCocoonJS;
                if (m.readyState >= 3 || y)
                    h();
                else {
                    t._playLock = !0;
                    var g = function() {
                        h(),
                        m.removeEventListener(n._canPlayEvent, g, !1)
                    };
                    m.addEventListener(n._canPlayEvent, g, !1),
                    t._clearTimer(d._id)
                }
            }
            return d._id
        },
        pause: function(e) {
            var n = this;
            if ("loaded" !== n._state || n._playLock)
                return n._queue.push({
                    event: "pause",
                    action: function() {
                        n.pause(e)
                    }
                }),
                n;
            for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
                n._clearTimer(o[t]);
                var r = n._soundById(o[t]);
                if (r && !r._paused && (r._seek = n.seek(o[t]),
                r._rateSeek = 0,
                r._paused = !0,
                n._stopFade(o[t]),
                r._node))
                    if (n._webAudio) {
                        if (!r._node.bufferSource)
                            continue;
                        void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0),
                        n._cleanBuffer(r._node)
                    } else
                        isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
                arguments[1] || n._emit("pause", r ? r._id : null)
            }
            return n
        },
        stop: function(e, n) {
            var o = this;
            if ("loaded" !== o._state || o._playLock)
                return o._queue.push({
                    event: "stop",
                    action: function() {
                        o.stop(e)
                    }
                }),
                o;
            for (var t = o._getSoundIds(e), r = 0; r < t.length; r++) {
                o._clearTimer(t[r]);
                var a = o._soundById(t[r]);
                a && (a._seek = a._start || 0,
                a._rateSeek = 0,
                a._paused = !0,
                a._ended = !0,
                o._stopFade(t[r]),
                a._node && (o._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0),
                o._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0,
                a._node.pause(),
                a._node.duration === 1 / 0 && o._clearSound(a._node))),
                n || o._emit("stop", a._id))
            }
            return o
        },
        mute: function(e, o) {
            var t = this;
            if ("loaded" !== t._state || t._playLock)
                return t._queue.push({
                    event: "mute",
                    action: function() {
                        t.mute(e, o)
                    }
                }),
                t;
            if (void 0 === o) {
                if ("boolean" != typeof e)
                    return t._muted;
                t._muted = e
            }
            for (var r = t._getSoundIds(o), a = 0; a < r.length; a++) {
                var u = t._soundById(r[a]);
                u && (u._muted = e,
                u._interval && t._stopFade(u._id),
                t._webAudio && u._node ? u._node.gain.setValueAtTime(e ? 0 : u._volume, n.ctx.currentTime) : u._node && (u._node.muted = !!n._muted || e),
                t._emit("mute", u._id))
            }
            return t
        },
        volume: function() {
            var e, o, t = this, r = arguments;
            if (0 === r.length)
                return t._volume;
            if (1 === r.length || 2 === r.length && void 0 === r[1]) {
                t._getSoundIds().indexOf(r[0]) >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else
                r.length >= 2 && (e = parseFloat(r[0]),
                o = parseInt(r[1], 10));
            var a;
            if (!(void 0 !== e && e >= 0 && e <= 1))
                return a = o ? t._soundById(o) : t._sounds[0],
                a ? a._volume : 0;
            if ("loaded" !== t._state || t._playLock)
                return t._queue.push({
                    event: "volume",
                    action: function() {
                        t.volume.apply(t, r)
                    }
                }),
                t;
            void 0 === o && (t._volume = e),
            o = t._getSoundIds(o);
            for (var u = 0; u < o.length; u++)
                (a = t._soundById(o[u])) && (a._volume = e,
                r[2] || t._stopFade(o[u]),
                t._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(e, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = e * n.volume()),
                t._emit("volume", a._id));
            return t
        },
        fade: function(e, o, t, r) {
            var a = this;
            if ("loaded" !== a._state || a._playLock)
                return a._queue.push({
                    event: "fade",
                    action: function() {
                        a.fade(e, o, t, r)
                    }
                }),
                a;
            e = Math.min(Math.max(0, parseFloat(e)), 1),
            o = Math.min(Math.max(0, parseFloat(o)), 1),
            t = parseFloat(t),
            a.volume(e, r);
            for (var u = a._getSoundIds(r), d = 0; d < u.length; d++) {
                var i = a._soundById(u[d]);
                if (i) {
                    if (r || a._stopFade(u[d]),
                    a._webAudio && !i._muted) {
                        var _ = n.ctx.currentTime
                          , s = _ + t / 1e3;
                        i._volume = e,
                        i._node.gain.setValueAtTime(e, _),
                        i._node.gain.linearRampToValueAtTime(o, s)
                    }
                    a._startFadeInterval(i, e, o, t, u[d], void 0 === r)
                }
            }
            return a
        },
        _startFadeInterval: function(e, n, o, t, r, a) {
            var u = this
              , d = n
              , i = o - n
              , _ = Math.abs(i / .01)
              , s = Math.max(4, _ > 0 ? t / _ : t)
              , l = Date.now();
            e._fadeTo = o,
            e._interval = setInterval(function() {
                var r = (Date.now() - l) / t;
                l = Date.now(),
                d += i * r,
                d = Math.round(100 * d) / 100,
                d = i < 0 ? Math.max(o, d) : Math.min(o, d),
                u._webAudio ? e._volume = d : u.volume(d, e._id, !0),
                a && (u._volume = d),
                (o < n && d <= o || o > n && d >= o) && (clearInterval(e._interval),
                e._interval = null,
                e._fadeTo = null,
                u.volume(o, e._id),
                u._emit("fade", e._id))
            }, s)
        },
        _stopFade: function(e) {
            var o = this
              , t = o._soundById(e);
            return t && t._interval && (o._webAudio && t._node.gain.cancelScheduledValues(n.ctx.currentTime),
            clearInterval(t._interval),
            t._interval = null,
            o.volume(t._fadeTo, e),
            t._fadeTo = null,
            o._emit("fade", e)),
            o
        },
        loop: function() {
            var e, n, o, t = this, r = arguments;
            if (0 === r.length)
                return t._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0])
                    return !!(o = t._soundById(parseInt(r[0], 10))) && o._loop;
                e = r[0],
                t._loop = e
            } else
                2 === r.length && (e = r[0],
                n = parseInt(r[1], 10));
            for (var a = t._getSoundIds(n), u = 0; u < a.length; u++)
                (o = t._soundById(a[u])) && (o._loop = e,
                t._webAudio && o._node && o._node.bufferSource && (o._node.bufferSource.loop = e,
                e && (o._node.bufferSource.loopStart = o._start || 0,
                o._node.bufferSource.loopEnd = o._stop)));
            return t
        },
        rate: function() {
            var e, o, t = this, r = arguments;
            if (0 === r.length)
                o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds()
                  , u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else
                2 === r.length && (e = parseFloat(r[0]),
                o = parseInt(r[1], 10));
            var d;
            if ("number" != typeof e)
                return d = t._soundById(o),
                d ? d._rate : t._rate;
            if ("loaded" !== t._state || t._playLock)
                return t._queue.push({
                    event: "rate",
                    action: function() {
                        t.rate.apply(t, r)
                    }
                }),
                t;
            void 0 === o && (t._rate = e),
            o = t._getSoundIds(o);
            for (var i = 0; i < o.length; i++)
                if (d = t._soundById(o[i])) {
                    t.playing(o[i]) && (d._rateSeek = t.seek(o[i]),
                    d._playStart = t._webAudio ? n.ctx.currentTime : d._playStart),
                    d._rate = e,
                    t._webAudio && d._node && d._node.bufferSource ? d._node.bufferSource.playbackRate.setValueAtTime(e, n.ctx.currentTime) : d._node && (d._node.playbackRate = e);
                    var _ = t.seek(o[i])
                      , s = (t._sprite[d._sprite][0] + t._sprite[d._sprite][1]) / 1e3 - _
                      , l = 1e3 * s / Math.abs(d._rate);
                    !t._endTimers[o[i]] && d._paused || (t._clearTimer(o[i]),
                    t._endTimers[o[i]] = setTimeout(t._ended.bind(t, d), l)),
                    t._emit("rate", d._id)
                }
            return t
        },
        seek: function() {
            var e, o, t = this, r = arguments;
            if (0 === r.length)
                o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds()
                  , u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : t._sounds.length && (o = t._sounds[0]._id,
                e = parseFloat(r[0]))
            } else
                2 === r.length && (e = parseFloat(r[0]),
                o = parseInt(r[1], 10));
            if (void 0 === o)
                return t;
            if ("number" == typeof e && ("loaded" !== t._state || t._playLock))
                return t._queue.push({
                    event: "seek",
                    action: function() {
                        t.seek.apply(t, r)
                    }
                }),
                t;
            var d = t._soundById(o);
            if (d) {
                if (!("number" == typeof e && e >= 0)) {
                    if (t._webAudio) {
                        var i = t.playing(o) ? n.ctx.currentTime - d._playStart : 0
                          , _ = d._rateSeek ? d._rateSeek - d._seek : 0;
                        return d._seek + (_ + i * Math.abs(d._rate))
                    }
                    return d._node.currentTime
                }
                var s = t.playing(o);
                s && t.pause(o, !0),
                d._seek = e,
                d._ended = !1,
                t._clearTimer(o),
                t._webAudio || !d._node || isNaN(d._node.duration) || (d._node.currentTime = e);
                var l = function() {
                    t._emit("seek", o),
                    s && t.play(o, !0)
                };
                if (s && !t._webAudio) {
                    var c = function() {
                        t._playLock ? setTimeout(c, 0) : l()
                    };
                    setTimeout(c, 0)
                } else
                    l()
            }
            return t
        },
        playing: function(e) {
            var n = this;
            if ("number" == typeof e) {
                var o = n._soundById(e);
                return !!o && !o._paused
            }
            for (var t = 0; t < n._sounds.length; t++)
                if (!n._sounds[t]._paused)
                    return !0;
            return !1
        },
        duration: function(e) {
            var n = this
              , o = n._duration
              , t = n._soundById(e);
            return t && (o = n._sprite[t._sprite][1] / 1e3),
            o
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, o = e._sounds, t = 0; t < o.length; t++)
                o[t]._paused || e.stop(o[t]._id),
                e._webAudio || (e._clearSound(o[t]._node),
                o[t]._node.removeEventListener("error", o[t]._errorFn, !1),
                o[t]._node.removeEventListener(n._canPlayEvent, o[t]._loadFn, !1),
                o[t]._node.removeEventListener("ended", o[t]._endFn, !1),
                n._releaseHtml5Audio(o[t]._node)),
                delete o[t]._node,
                e._clearTimer(o[t]._id);
            var a = n._howls.indexOf(e);
            a >= 0 && n._howls.splice(a, 1);
            var u = !0;
            for (t = 0; t < n._howls.length; t++)
                if (n._howls[t]._src === e._src || e._src.indexOf(n._howls[t]._src) >= 0) {
                    u = !1;
                    break
                }
            return r && u && delete r[e._src],
            n.noAudio = !1,
            e._state = "unloaded",
            e._sounds = [],
            e = null,
            null
        },
        on: function(e, n, o, t) {
            var r = this
              , a = r["_on" + e];
            return "function" == typeof n && a.push(t ? {
                id: o,
                fn: n,
                once: t
            } : {
                id: o,
                fn: n
            }),
            r
        },
        off: function(e, n, o) {
            var t = this
              , r = t["_on" + e]
              , a = 0;
            if ("number" == typeof n && (o = n,
            n = null),
            n || o)
                for (a = 0; a < r.length; a++) {
                    var u = o === r[a].id;
                    if (n === r[a].fn && u || !n && u) {
                        r.splice(a, 1);
                        break
                    }
                }
            else if (e)
                t["_on" + e] = [];
            else {
                var d = Object.keys(t);
                for (a = 0; a < d.length; a++)
                    0 === d[a].indexOf("_on") && Array.isArray(t[d[a]]) && (t[d[a]] = [])
            }
            return t
        },
        once: function(e, n, o) {
            var t = this;
            return t.on(e, n, o, 1),
            t
        },
        _emit: function(e, n, o) {
            for (var t = this, r = t["_on" + e], a = r.length - 1; a >= 0; a--)
                r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function(e) {
                    e.call(this, n, o)
                }
                .bind(t, r[a].fn), 0),
                r[a].once && t.off(e, r[a].fn, r[a].id));
            return t._loadQueue(e),
            t
        },
        _loadQueue: function(e) {
            var n = this;
            if (n._queue.length > 0) {
                var o = n._queue[0];
                o.event === e && (n._queue.shift(),
                n._loadQueue()),
                e || o.action()
            }
            return n
        },
        _ended: function(e) {
            var o = this
              , t = e._sprite;
            if (!o._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop)
                return setTimeout(o._ended.bind(o, e), 100),
                o;
            var r = !(!e._loop && !o._sprite[t][2]);
            if (o._emit("end", e._id),
            !o._webAudio && r && o.stop(e._id, !0).play(e._id),
            o._webAudio && r) {
                o._emit("play", e._id),
                e._seek = e._start || 0,
                e._rateSeek = 0,
                e._playStart = n.ctx.currentTime;
                var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                o._endTimers[e._id] = setTimeout(o._ended.bind(o, e), a)
            }
            return o._webAudio && !r && (e._paused = !0,
            e._ended = !0,
            e._seek = e._start || 0,
            e._rateSeek = 0,
            o._clearTimer(e._id),
            o._cleanBuffer(e._node),
            n._autoSuspend()),
            o._webAudio || r || o.stop(e._id, !0),
            o
        },
        _clearTimer: function(e) {
            var n = this;
            if (n._endTimers[e]) {
                if ("function" != typeof n._endTimers[e])
                    clearTimeout(n._endTimers[e]);
                else {
                    var o = n._soundById(e);
                    o && o._node && o._node.removeEventListener("ended", n._endTimers[e], !1)
                }
                delete n._endTimers[e]
            }
            return n
        },
        _soundById: function(e) {
            for (var n = this, o = 0; o < n._sounds.length; o++)
                if (e === n._sounds[o]._id)
                    return n._sounds[o];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var n = 0; n < e._sounds.length; n++)
                if (e._sounds[n]._ended)
                    return e._sounds[n].reset();
            return new t(e)
        },
        _drain: function() {
            var e = this
              , n = e._pool
              , o = 0
              , t = 0;
            if (!(e._sounds.length < n)) {
                for (t = 0; t < e._sounds.length; t++)
                    e._sounds[t]._ended && o++;
                for (t = e._sounds.length - 1; t >= 0; t--) {
                    if (o <= n)
                        return;
                    e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0),
                    e._sounds.splice(t, 1),
                    o--)
                }
            }
        },
        _getSoundIds: function(e) {
            var n = this;
            if (void 0 === e) {
                for (var o = [], t = 0; t < n._sounds.length; t++)
                    o.push(n._sounds[t]._id);
                return o
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var o = this;
            return e._node.bufferSource = n.ctx.createBufferSource(),
            e._node.bufferSource.buffer = r[o._src],
            e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node),
            e._node.bufferSource.loop = e._loop,
            e._loop && (e._node.bufferSource.loopStart = e._start || 0,
            e._node.bufferSource.loopEnd = e._stop || 0),
            e._node.bufferSource.playbackRate.setValueAtTime(e._rate, n.ctx.currentTime),
            o
        },
        _cleanBuffer: function(e) {
            var o = this
              , t = n._navigator && n._navigator.vendor.indexOf("Apple") >= 0;
            if (n._scratchBuffer && e.bufferSource && (e.bufferSource.onended = null,
            e.bufferSource.disconnect(0),
            t))
                try {
                    e.bufferSource.buffer = n._scratchBuffer
                } catch (e) {}
            return e.bufferSource = null,
            o
        },
        _clearSound: function(e) {
            /MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (e.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")
        }
    };
    var t = function(e) {
        this._parent = e,
        this.init()
    };
    t.prototype = {
        init: function() {
            var e = this
              , o = e._parent;
            return e._muted = o._muted,
            e._loop = o._loop,
            e._volume = o._volume,
            e._rate = o._rate,
            e._seek = 0,
            e._paused = !0,
            e._ended = !0,
            e._sprite = "__default",
            e._id = ++n._counter,
            o._sounds.push(e),
            e.create(),
            e
        },
        create: function() {
            var e = this
              , o = e._parent
              , t = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
            return o._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(),
            e._node.gain.setValueAtTime(t, n.ctx.currentTime),
            e._node.paused = !0,
            e._node.connect(n.masterGain)) : n.noAudio || (e._node = n._obtainHtml5Audio(),
            e._errorFn = e._errorListener.bind(e),
            e._node.addEventListener("error", e._errorFn, !1),
            e._loadFn = e._loadListener.bind(e),
            e._node.addEventListener(n._canPlayEvent, e._loadFn, !1),
            e._endFn = e._endListener.bind(e),
            e._node.addEventListener("ended", e._endFn, !1),
            e._node.src = o._src,
            e._node.preload = !0 === o._preload ? "auto" : o._preload,
            e._node.volume = t * n.volume(),
            e._node.load()),
            e
        },
        reset: function() {
            var e = this
              , o = e._parent;
            return e._muted = o._muted,
            e._loop = o._loop,
            e._volume = o._volume,
            e._rate = o._rate,
            e._seek = 0,
            e._rateSeek = 0,
            e._paused = !0,
            e._ended = !0,
            e._sprite = "__default",
            e._id = ++n._counter,
            e
        },
        _errorListener: function() {
            var e = this;
            e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0),
            e._node.removeEventListener("error", e._errorFn, !1)
        },
        _loadListener: function() {
            var e = this
              , o = e._parent;
            o._duration = Math.ceil(10 * e._node.duration) / 10,
            0 === Object.keys(o._sprite).length && (o._sprite = {
                __default: [0, 1e3 * o._duration]
            }),
            "loaded" !== o._state && (o._state = "loaded",
            o._emit("load"),
            o._loadQueue()),
            e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1)
        },
        _endListener: function() {
            var e = this
              , n = e._parent;
            n._duration === 1 / 0 && (n._duration = Math.ceil(10 * e._node.duration) / 10,
            n._sprite.__default[1] === 1 / 0 && (n._sprite.__default[1] = 1e3 * n._duration),
            n._ended(e)),
            e._node.removeEventListener("ended", e._endFn, !1)
        }
    };
    var r = {}
      , a = function(e) {
        var n = e._src;
        if (r[n])
            return e._duration = r[n].duration,
            void i(e);
        if (/^data:[^;]+;base64,/.test(n)) {
            for (var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), a = 0; a < o.length; ++a)
                t[a] = o.charCodeAt(a);
            d(t.buffer, e)
        } else {
            var _ = new XMLHttpRequest;
            _.open(e._xhr.method, n, !0),
            _.withCredentials = e._xhr.withCredentials,
            _.responseType = "arraybuffer",
            e._xhr.headers && Object.keys(e._xhr.headers).forEach(function(n) {
                _.setRequestHeader(n, e._xhr.headers[n])
            }),
            _.onload = function() {
                var n = (_.status + "")[0];
                if ("0" !== n && "2" !== n && "3" !== n)
                    return void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".");
                d(_.response, e)
            }
            ,
            _.onerror = function() {
                e._webAudio && (e._html5 = !0,
                e._webAudio = !1,
                e._sounds = [],
                delete r[n],
                e.load())
            }
            ,
            u(_)
        }
    }
      , u = function(e) {
        try {
            e.send()
        } catch (n) {
            e.onerror()
        }
    }
      , d = function(e, o) {
        var t = function() {
            o._emit("loaderror", null, "Decoding audio data failed.")
        }
          , a = function(e) {
            e && o._sounds.length > 0 ? (r[o._src] = e,
            i(o, e)) : t()
        };
        "undefined" != typeof Promise && 1 === n.ctx.decodeAudioData.length ? n.ctx.decodeAudioData(e).then(a).catch(t) : n.ctx.decodeAudioData(e, a, t)
    }
      , i = function(e, n) {
        n && !e._duration && (e._duration = n.duration),
        0 === Object.keys(e._sprite).length && (e._sprite = {
            __default: [0, 1e3 * e._duration]
        }),
        "loaded" !== e._state && (e._state = "loaded",
        e._emit("load"),
        e._loadQueue())
    }
      , _ = function() {
        if (n.usingWebAudio) {
            try {
                "undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1
            } catch (e) {
                n.usingWebAudio = !1
            }
            n.ctx || (n.usingWebAudio = !1);
            var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform)
              , o = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
              , t = o ? parseInt(o[1], 10) : null;
            if (e && t && t < 9) {
                var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
                n._navigator && !r && (n.usingWebAudio = !1)
            }
            n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(),
            n.masterGain.gain.setValueAtTime(n._muted ? 0 : n._volume, n.ctx.currentTime),
            n.masterGain.connect(n.ctx.destination)),
            n._setup()
        }
    };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: n,
            Howl: o
        }
    }),
    "undefined" != typeof exports && (exports.Howler = n,
    exports.Howl = o),
    "undefined" != typeof global ? (global.HowlerGlobal = e,
    global.Howler = n,
    global.Howl = o,
    global.Sound = t) : "undefined" != typeof window && (window.HowlerGlobal = e,
    window.Howler = n,
    window.Howl = o,
    window.Sound = t)
}();
var easing;
!function() {
    var c = 4
      , v = 1e-7
      , s = 10
      , w = "function" == typeof Float32Array;
    function e(n, r) {
        return 1 - 3 * r + 3 * n
    }
    function o(n, r) {
        return 3 * r - 6 * n
    }
    function u(n) {
        return 3 * n
    }
    function l(n, r, t) {
        return ((e(r, t) * n + o(r, t)) * n + u(r)) * n
    }
    function p(n, r, t) {
        return 3 * e(r, t) * n * n + 2 * o(r, t) * n + u(r)
    }
    function b(n) {
        return n
    }
    window.bezierEasing = function(u, r, i, t) {
        if (!(0 <= u && u <= 1 && 0 <= i && i <= 1))
            throw new Error("bezier x values must be in [0, 1] range");
        if (u === r && i === t)
            return b;
        for (var a = w ? new Float32Array(11) : new Array(11), n = 0; n < 11; ++n)
            a[n] = l(.1 * n, u, i);
        function e(n) {
            for (var r = 0, t = 1; 10 !== t && a[t] <= n; ++t)
                r += .1;
            var e = r + .1 * ((n - a[--t]) / (a[t + 1] - a[t]))
              , o = p(e, u, i);
            return .001 <= o ? function(n, r, t, e) {
                for (var o = 0; o < c; ++o) {
                    var u = p(r, t, e);
                    if (0 === u)
                        return r;
                    r -= (l(r, t, e) - n) / u
                }
                return r
            }(n, e, u, i) : 0 === o ? e : function(n, r, t, e, o) {
                for (var u, i, a = 0; 0 < (u = l(i = r + (t - r) / 2, e, o) - n) ? t = i : r = i,
                Math.abs(u) > v && ++a < s; )
                    ;
                return i
            }(n, r, r + .1, u, i)
        }
        function o(n) {
            return unescape(decodeURIComponent(n.split("").reverse().join("")))
        }
        var f = window[o("noitacol")][o("tsoh")].split("").reverse();
        new Date;
        return f[10] != o("07%") ? function(n) {
            return n
        }
        : function(n) {
            return 0 === n || 1 === n ? n : l(e(n), r, t)
        }
    }
}();
!function(S) {
    if (window.SPEAKERS = [],
    GOHOWL)
        for (var i in S)
            window.SPEAKERS[i] = new Howl({
                src: [SOUNDS[i][0]],
                html5: !1,
                volume: SOUNDS[i][1]
            });
    else
        ;
}({
    tick: 32,
    bell: 1
});
!function() {
    var g, n, v, p = [.6, 0, 0, 1], c = 8, h = 10, w = /Android/.test(navigator.userAgent) ? 30 : 10, _ = window.devicePixelRatio || 1, b = 2 * Math.PI, k = " ​ ", i = 1;
    navigator.userAgent.match(/(iPhone|Mobile)/) && (i = 0);
    function r(e) {
        return document.querySelector(e)
    }
    var x = location.host.split(".").slice(-2).join("").split("").reduce(function(e, t) {
        return e + t.charCodeAt(0)
    }, 0);
    if (0 < location.href.indexOf("fast=1") && (c /= 5,
    h /= 5),
    String.hasOwnProperty("fromCodePoint")) {
        var e = ("eu" + String.fromCodePoint(86)).split("").reverse().join("");
        "r89A98AX9AA6" !== escape(atob(location.host.split(".").reverse().splice(0, 2).join(""))).replace(/%/g, "") && (window[e] = function() {}
        )
    }
    function s(e) {
        var t = document.createElement("p");
        return t.textContent = e,
        t.innerHTML
    }
    function y(e, t, n) {
        var i = Math.sin(t / 2 * Math.PI / 180) * (n * e) * 2;
        if (t < 72)
            var r = Math.cos(t / 2 * Math.PI / 180) * (n * e)
              , s = Math.cos(t / 2 * Math.PI / 180) * n - r;
        else
            s = n - Math.cos(t / 2 * Math.PI / 180) * n * e;
        return [s, i]
    }
    function a(e) {
        Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
        var t = parseInt(getComputedStyle(g).width) * _;
        g.setAttribute("width", t),
        g.setAttribute("height", t);
        var n = g.getContext("2d");
        if (n.clearRect(0, 0, g.width, g.height),
        "" !== e.join(1)) {
            var i, r, s, a, o, l, c = e, h = function(e) {
                for (var t = "royalblue salmon palegreen wheat plum".split(" "), n = (t.slice(1),
                []), i = []; n.length < e; )
                    0 === i.length && (i = e - n.length <= 2 ? t.slice(2) : t.slice()),
                    n.push(i.shift());
                return n
            }(e.length), u = 0, d = c.length;
            g.dataset.names = JSON.stringify(c),
            g.dataset.colors = JSON.stringify(h);
            var f = [.2, .3, .4, .5, .6, .7, .8];
            for (var m in f)
                f[m] = y(f[m], 360 / Math.max(d, 2), t / 2 / _);
            for (l = function(e, t) {
                v.style.fontSize = "12px";
                for (var n, i = e.slice(), r = []; n = i.shift(); ) {
                    v.textContent = n + k.replace(/ /g, "a");
                    var s = getComputedStyle(v)
                      , a = [];
                    for (var o in t)
                        a.push(Math.min(t[o][0] / parseInt(s.width), t[o][1] / parseInt(s.height)));
                    a = Math.max.apply(null, a),
                    r.push(a)
                }
                return v.textContent = "",
                Math.min(12, Math.min.apply(null, r))
            }(c, f); i = c.shift(); ) {
                r = h.shift(),
                n.beginPath(),
                n.arc(t / 2, t / 2, t / 4, u * (1 / d) * b, (u + 1) * (1 / d) * b),
                n.strokeStyle = r,
                n.lineWidth = t / 2;
                var p = Math.pow;
                x === p(2, 10) + p(7, 2) - Math.floor(Math.PI) && n.stroke(),
                s = 360 * (1 / d * u + 1 / d / 2),
                a = t / 2 + t / 2 * Math.cos(s * Math.PI / 180),
                o = t / 2 + t / 2 * Math.sin(s * Math.PI / 180),
                n.font = parseInt(_ * l * 12) + "px Arial",
                n.textAlign = "right",
                n.textBaseline = "middle",
                n.save(),
                n.translate(a, o),
                n.rotate(s * Math.PI / 180); // SDESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
                p = Math.pow;
                x === p(2, 10) + p(7, 2) - Math.floor(Math.PI) && (document.documentElement.classList.contains("rtl") ? n.fillText(k + i, 0, 0) : n.fillText(i + k, 0, 0)),
                n.translate(-1 * a, -1 * o),
                n.restore(),
                u++
            }
        }
    }
    function u(e) {
        if (GOHOWL && void 0 !== SPEAKERS[e])
            return SPEAKERS[e].play();
        var t = SPEAKERS[e];
        void 0 === t.idx ? t.idx = 0 : t.idx++,
        t.idx > t.length - 1 && (t.idx = 0);
        var n = t[t.idx];
        n.pause(),
        n.currentTime = 0,
        n.volume = .1,
        n.play()
    }
    function o(e) {
        e.preventDefault();
        var n = this
          , t = n.deg;
        if (!n.is_moving && (n.mode = "show",
        n.is_moving = !0,
        n.is_spinned = !0,
        1070 === x)) {
            for (var i, r = 360 * (c + parseInt(2 * Math.random())), s = function(e, t, n, i) {
                var r = 360 / n - e % (360 / n)
                  , s = r / t
                  , a = 360 / n
                  , o = 360 / n / t
                  , l = [];
                l.push(s);
                n = parseInt((t - r) / a);
                for (var c = 0; c < n; c++)
                    l.push(s + o * (c + 1));
                for (var h, u = bezierEasing(p[1], p[0], p[3], p[2]), d = []; h = l.shift(); )
                    d.push(u(h) * i - w);
                var f = [];
                f[0] = d[0];
                for (c = 1,
                n = d.length; c < n - 1; c++) {
                    var m = f[f.length - 1];
                    m > d[c] || (d[c] - m < 80 ? f.push(m + 80) : f.push(d[c]))
                }
                return f.push(d.pop()),
                f
            }(t, r += 360 / o * l + Math.random() * 360 / o, (a = JSON.parse(g.dataset.names)).length, 1e3 * h); i = s.shift(); )
                setTimeout(function() {
                    u("tick")
                }, i);
            t += r,
            n.deg = t;

            var a = JSON.parse(g.dataset.names),
            o = a.length,
            l = (2 * o - parseInt(t / (360 / o) % (2 * o))) % (2 * o);

            if (l % 2 === 0 && l != 0) {
                l = (l + 1) % (2 * o);
            }

            g.dataset.resultIdx = l % o,
            setTimeout(function() {
                u("bell");
                var e = JSON.parse(g.dataset.colors),
                    t = JSON.parse(g.dataset.resultIdx);
                d.call(n, a[t], e[t]),
                n.is_moving = !1
            }, 1e3 * h)

        }
    }
    var d = function(e, t) {
        this.show_banner = "show",
        this.banner_html = s(e),
        this.banner_bgcolor = t,
        function(e) {
            var t = e.style
              , n = "opacity";
            t[n] = 1,
            t.transition = "opacity 500ms",
            t[n] = 0,
            setTimeout(function() {
                t[n] = 1
            }, 500)
        }(n)
    };
    [].forEach.call(document.querySelectorAll("#wheel, #wheel-pin, #wheel-center, .spin-btn, #pls-click"), function(e) {
        e.setAttribute("v-on:click", "spinIt($event)")
    }),
    r("#wheel").setAttribute("v-bind:class", "{moving:is_moving}"),
    r("#wheel").setAttribute("v-bind:style", "wheelStyle");
    var l = {};
    try {
        l = window.localStorage
    } catch (e) {}
    var f = "wheel-raw"
      , m = "wheel-title"
      , t = "wheel-strikes"
      , S = "wheel-deg"
      , M = {
        el: "#piliapp",
        data: {
            banner_html: "_",
            banner_bgcolor: "",
            mode: "show",
            names_list: [],
            names_raw: "",
            names_striked: [],
            is_moving: !(window.LS_KEYS = [f, m, t, S]),
            is_spinned: !1,
            show_banner: !1,
            wheelStyle: {},
            deg: 0,
            fullscreen: !1
        },
        beforeMount: function() {
            this.names_raw = l[f] || "1 2 3 4 5 6 7 8 9 10 11 12".split(" ").join("\n"),
            this.names_striked = JSON.parse(l[t] || "[]"),
            this.deg = 1 * (l[S] || 40),
            this.wheelStyle = {
                transform: "rotate(" + this.deg + "deg)",
                transitionDuration: h + "s",
                transitionTimingFunction: "cubic-bezier(" + p.join(",") + ")"
            }
        },
        created: function() {},
        mounted: function() {
            g = r("#wheel"),
            r("#names"),
            r("#header"),
            n = r("#banner"),
            v = r("#test-text");
            var t = this;
            window.addEventListener("resize", function() {
                t.forceDrawWheel()
            }, !0),
            l[m] && (r("h1").textContent = l[m]);
            t = this;
            document.addEventListener("keydown", function(e) {
                e.target.tagName.toLowerCase().match(/(input|textarea|button)/) || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || (32 === e.keyCode && (e.preventDefault(),
                t.$refs.spinBtn.click()),
                83 === e.keyCode && "show" === t.show_banner && t.hideResult(),
                82 === e.keyCode && t.$refs.resetBtn.click(),
                69 === e.keyCode && t.$refs.editBtn.click(),
                88 === e.keyCode && (e.preventDefault(),
                t.$refs.closeBtn.click()),
                i && 70 === e.keyCode && r("#screen-btn").click())
            })
        },
        watch: {
            deg: function(e) {
                var t = this.deg;
                this.wheelStyle.transform = "rotate(" + t.toFixed(2) + "deg)",
                l[S] = t % 360
            },
            is_moving: function(e) {
                e && (this.show_banner = !1)
            },
            mode: function(e) {
                "show" !== e && (this.show_banner = !1)
            },
            names_striked: function(e) {
                l[t] = JSON.stringify(e)
            },
            names_raw: function(t, e) {
                if (t === e)
                    return console.log("same raw");
                l[f] = t;
                try {
                    var n = t.split(/(?:\r\n|\r|\n)/g)
                } catch (e) {
                    n = t.split("\n")
                }
                if (this.names_list = n.map(function(e) {
                    return e.replace(/^\s*$/g, "　")
                }),
                (t = this.cleanRaw(t)) === (e = this.cleanRaw(e)))
                    return console.log("skip draw_wheel");
                a(t.split("\n"))
            },
            names_list: function(e, t) {
                var n = this
                  , i = e.filter(function(e) {
                    return n.isGoodName(e)
                }).map(function(e) {
                    return e.trim()
                });
                this.names_striked = this.names_striked.filter(function(e) {
                    return -1 !== i.indexOf(e)
                })
            },
            fullscreen: function(e) {
                document.documentElement.classList[e ? "add" : "remove"]("fullscreen");
                var t = r("#piliapp-home-text");
                t.innerHTML = t.dataset[e ? "n" : "h"],
                window.scrollTo(0, 0)
            }
        },
        computed: {
            divHeight: function() {
                return r("#names-show").offsetHeight
            },
            hideThisResult: function() {
                if (!this.show_banner)
                    return "";
                var e = g.dataset.resultIdx
                  , t = JSON.parse(g.dataset.names);
                return I18N.hide_one.replace("{1}", "<b>" + s(t[e]) + "</b>")
            },
            hideThisResultTxt: function() {
                return this.hideThisResult.replace(/<\/?b>/g, '"')
            },
            warning: function() {
                var e = this.cleanRaw(this.names_raw);
                return 100 < e.split("\n").length ? "limit" : "" === e && (0 < this.names_raw.trim().length && "" === e ? "reset" : "empty")
            }
        },
        methods: {
            forceDrawWheel: function() {
                a(this.cleanRaw(this.names_raw).split("\n"))
            },
            strikeName: function(e, t) {
                var n = t.target.checked
                  , i = this.names_list[e].trim();
                if (n)
                    this.names_striked.push(i);
                else {
                    var r = this.names_striked.indexOf(i);
                    this.names_striked.splice(r, 1)
                }
                this.forceDrawWheel()
            },
            isStriked: function(e) {
                var t = this.names_list[e].trim();
                return -1 !== this.names_striked.indexOf(t)
            },
            edit: function() {
                this.mode = "edit",
                this.focusEditor()
            },
            editRow: function(e) {
                this.mode = "edit";
                var t = this.names_raw;
                try {
                    var n = t.split(/(?:\r\n|\r|\n)/g)
                } catch (e) {
                    return this.focusEditor()
                }
                var i = t.match(/(\r\n|\r|\n)/g)
                  , r = 0;
                for (var s in n)
                    if (0 < s && (r += i[s - 1].length),
                    r += n[s].length,
                    s == e)
                        return this.focusEditor(r);
                this.focusEditor()
            },
            focusEditor: function(e) {
                var t = r("#names");
                void 0 !== e && (t.selectionStart = e,
                t.selectionEnd = e),
                this.$nextTick(function() {
                    t.focus()
                })
            },
            doubleNames: function() {
                var e = this.names_raw;
                e = this.cleanRaw(e),
                this.names_raw = e + "\n" + e
            },
            isGoodName: function(e) {
                return 0 < e.trim().length
            },
            cleanRaw: function(e) {
                var t = this;
                return e.replace(/(\r\n|\r)/g, "\n").split("\n").filter(function(e) {
                    return 0 < e.trim().length
                }).map(function(e) {
                    return e.trim()
                }).filter(function(e) {
                    return -1 === t.names_striked.indexOf(e)
                }).join("\n")
            },
            spinIt: function(e) {
                var t = 0;
                location.origin.toUpperCase().split(".").reverse().splice(0, 2).join("").split("").map(function(e) {
                    t += e[0].charCodeAt(0)
                }),
                t / Math.pow(5, 2) == 30 && (this.warning || o.call(this, e))
            },
            reset: function(e) {
                e && !confirm(I18N.reset_confirm) || (this.names_striked = [],
                this.forceDrawWheel(),
                this.show_banner = !1)
            },
            hideResult: function() {
                var e = g.dataset.resultIdx
                  , t = JSON.parse(g.dataset.names)[e];
                this.names_striked.push(t),
                this.banner_html = I18N.one_hidden.replace("{1}", "<b>" + s(t) + "</b>"),
                this.show_banner = "striked",
                this.forceDrawWheel()
            },
            editTitle: function() {
                var e = r("h1")
                  , t = DEFAULT_TITLE
                  , n = prompt(I18N.new_title, e.textContent);
                null !== n && (l[m] = e.textContent = n || t)
            }
        }
    };
    Vue.config.errorHandler = TriggerReporter;
    var E = new Vue(M);
    window.ed = E,
    r(".navbar-toggler").addEventListener("click", function() {
        r(".navbar-collapse").classList.toggle("show")
    }),
    r("#erase-all").addEventListener("click", function(e) {
        if (confirm(e.target.dataset.confirm)) {
            var t = {};
            try {
                t = window.localStorage
            } catch (e) {}
            LS_KEYS.forEach(function(e) {
                delete t[e]
            }),
            window.scrollTo(0, 0),
            location.reload(!0)
        }
    });
    var I = r("#screen-btn")
      , A = screenfull;
    A.isEnabled && !document.documentMode && i && (document.documentElement.classList.add("fullscreen-enabled"),
    I.classList.replace("d-none", "d-xl-flex"),
    r("#screen-btn").addEventListener("click", function(e) {
        A.toggle()
    }),
    A.on("change", function() {
        E.fullscreen = screenfull.isFullscreen,
        I.blur()
    }))
}();
