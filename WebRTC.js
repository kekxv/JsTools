/**
 * WebRTC API
 * @param option
 * @returns {{onMessage:function<any>,onIceCandidate:function<RTCPeerConnection,RTCPeerConnectionIceEvent>}}
 * @constructor
 */
let WebRTC = function (option) {
    let self = this;
    /**
     *
     * @type {RTCDataChannel|null}
     * @private
     */
    let _localChannel = null;
    /**
     * 是否连接
     * @type {boolean}
     */
    this.connected = false;
    /**
     //配置穿墙服务器的相关信息
     const peerConnectionConfigure = {
          "iceServers": [
              {
                  "username": "name",
                  "urls": [
                      "turn:ip:3478?transport=udp",
                      "turn:ip:3478?transport=tcp"
                  ],
                  "credential": "password"
              },
              {
                  "urls": [
                      "stun:ip:3478"
                  ]
              }
          ],
          "bundlePolicy": "max-bundle",
          "rtcpMuxPolicy": "require"
        }
     */
    const peerConnectionConfigure = null;
    //创建 PeerConnection
    let peerConnection = new RTCPeerConnection(peerConnectionConfigure);

    let _initLocalChannel = function () {
        _localChannel.binaryType = 'arraybuffer';
        _localChannel.addEventListener('open', self._onopen);
        _localChannel.addEventListener('close', self._onclose);
        _localChannel.addEventListener('error', self._onerror);
        _localChannel.addEventListener('message', self._onmessage);
    };

    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            let candidateData = {
                "type": "candidate",
                "label": event.candidate.sdpMLineIndex,
                "id": event.candidate.sdpMid,
                "candidate": event.candidate
            }
            // 相互发送candidate
            // console.log("onicecandidate", candidateData);
            option.onicecandidate && option.onicecandidate(candidateData);
        } else {
            // option.onicecandidate && option.onicecandidate(event);
        }
    }
    peerConnection.ondatachannel = (ev) => {
        // console.log("ondatachannel", ev);
        _localChannel = ev.channel;
        _initLocalChannel();
    }

    Object.defineProperties(this, {
        $option: {
            /**
             * @type {{onMessage:function<any>,onIceCandidate:function<RTCPeerConnection,RTCPeerConnectionIceEvent>}}
             */
            value: option,
            configurable: false, enumerable: false
        },
        // peerConnection: {
        //     get() {
        //         return peerConnection;
        //     }, configurable: false, enumerable: true
        // },
        peerConnection: {value: peerConnection, configurable: false, enumerable: true, writable: false},
        _localChannel: {
            get() {
                return _localChannel;
            },
            set(v) {
                if (_localChannel) {
                    _localChannel.close();
                    _localChannel = null;
                }
                _localChannel = v;
            }, configurable: false, enumerable: true
        },
        _DataChannelLabel: {
            get() {
                return option.DataChannelLabel || option.ChannelLabel || option.data_channel_label || 'kGoChat';
            }, configurable: false, enumerable: true
        },
        _onopen: {
            configurable: false, enumerable: false,
            get() {
                return function (ev) {
                    self.connected = true;
                    let onopen = option.onOpen || option.onopen || console.log;
                    onopen.call(self, ev);
                }
            }
        },
        _onclose: {
            configurable: false, enumerable: false,
            get() {
                return function (ev) {
                    self.connected = false;
                    let onclose = option.onClose || option.onclose || console.log;
                    onclose.call(self, ev);
                }
            }
        },
        _onerror: {
            configurable: false, enumerable: false,
            get() {
                return function (ev) {
                    let onerror = option.onError || option.onerror || console.log;
                    onerror.call(self, ev);
                }
            }
        },
        _onmessage: {
            configurable: false, enumerable: false,
            get() {
                return function (ev) {
                    let onmessage = option.onMessage || option.onmessage || console.log;
                    onmessage.call(self, ev, ev.data);
                }
            }
        }
    });

    let IceCandidateFlag = false;
    Object.defineProperty(this, "addIceCandidate", {
        configurable: false,
        get() {
            return async function (icecandidate) {
                if (typeof icecandidate === "string") {
                    try {
                        icecandidate = JSON.parse(icecandidate);
                    } catch (e) {
                        console.log(e);
                        return;
                    }
                }
                if (IceCandidateFlag) return;
                try {
                    // console.log("icecandidate",icecandidate);
                    await peerConnection.addIceCandidate(icecandidate);
                    IceCandidateFlag = true;
                } catch (e) {
                    console.error(e);
                    // throw e;
                }
            }
        }
    });
    if (option.master) {
        const dataChannelParams = {ordered: true};
        let peerConnection = self.peerConnection;
        this._localChannel = peerConnection
            .createDataChannel(self._DataChannelLabel, dataChannelParams);
        this._localChannel.binaryType = 'arraybuffer';
        _initLocalChannel();
    }
}
Object.defineProperty(WebRTC.prototype, "type", {value: "WebRTC", configurable: false, writable: false,});
Object.defineProperty(WebRTC.prototype, "createOffer", {
    configurable: false,
    get() {
        return function () {
            return new Promise(async (resolve, reject) => {
                let peerConnection = this.peerConnection;
                let offer = await peerConnection.createOffer();
                //保存本地 sdp
                await peerConnection.setLocalDescription(offer);
                resolve(offer);
            })
        }
    }
});
Object.defineProperty(WebRTC.prototype, "send", {
    configurable: false,
    /**
     * @type {function(data:string|Blob|ArrayBuffer|ArrayBufferView)}
     */
    get() {
        /**
         * @type {function(data:string|Blob|ArrayBuffer|ArrayBufferView)}
         */
        return function (data) {
            return new Promise(async (resolve, reject) => {
                await this._localChannel.send(data);
                resolve();
            })
        }
    }
});
Object.defineProperty(WebRTC.prototype, "handleOffer", {
    configurable: false,
    get() {
        return async function (offer) {
            if (typeof offer === "string") {
                try {
                    offer = JSON.parse(offer);
                } catch (e) {
                    console.log(e);
                    return;
                }
            }
            let peerConnection = this.peerConnection;
            //保存 remote offer(sdp)
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            let answer = await peerConnection.createAnswer();
            //保存本地 answer(sdp)
            await peerConnection.setLocalDescription(answer);
            return answer;
        }
    }
});
Object.defineProperty(WebRTC.prototype, "handleAnswer", {
    configurable: false,
    get() {
        return async function (answer) {
            if (typeof answer === "string") {
                try {
                    answer = JSON.parse(answer);
                } catch (e) {
                    console.log(e);
                    return;
                }
            }
            let peerConnection = this.peerConnection;
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }
});
Object.defineProperty(WebRTC.prototype, "handleCandidate", {
    configurable: false,
    get() {
        return async function (candidate) {
            let peerConnection = this.peerConnection;
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
});

window.WebRTC = WebRTC;

export default WebRTC;
