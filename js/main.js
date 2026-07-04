// ============================================================
// Water Sort Puzzle - WeChat Mini Game
// Converted from web version to Canvas-based WeChat Mini Game
// ============================================================

// --- Bubble Particle System (replaces particles.js) ---
class BubbleParticle {
  constructor(w, h) {
    this.init(w, h, true);
  }

  init(w, h, randomY) {
    this.x = Math.random() * w;
    this.y = randomY ? Math.random() * h : h + Math.random() * 50;
    this.r = 5 + Math.random() * 25;
    this.speed = 0.3 + Math.random() * 1.5;
    this.opacity = 0.3 + Math.random() * 0.7;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = (Math.random() - 0.5) * 0.02;
  }

  update(w, h) {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.3;
    if (this.y + this.r < 0) {
      this.init(w, h, false);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// --- Main Game Class ---
class WaterSortGame {
  constructor() {
    this.colors = ["red", "blue", "yellow", "green", "purple", "lightgreen", "lightblue", "orange", "brown", "pink", "gray", "hotpink", "slate", "navy", "magenta", "darkgray"];
    this.colorMap = {
      red: "#ff4444", blue: "#4488ff", yellow: "#ffdd44", green: "#44cc44",
      purple: "#cc44cc", lightgreen: "#88dd88", lightblue: "#44cccc",
      orange: "#ff8844", brown: "#8B4513", pink: "#ff88cc",
      gray: "#c5c5c5", hotpink: "#ed49b4", slate: "#5f7292",
      navy: "#001f97", magenta: "#9b006b", darkgray: "#5e5e5e",
      transparent: "rgba(255,255,255,0.15)"
    };

    this.water = [];
    this.originalWater = [];
    this.currentLevel = 0;
    this.clicked = [];
    this.transferring = false;
    this.animTimer = 0;
    this.moves = 0;
    this.won = false;
    this.screen = 'menu';
    this.scale = 1;

    this.levelNames = ["EASY", "MEDIUM", "HARD", "VERY HARD", "", "", "", "IMPOSSIBLE"];

    this.tubeBounds = [];
    this.buttonBounds = [];

    this.transferAnim = null; // { from, to, fromColor, fromCount, progress, duration }
    this.undoStack = [];  // { from, to, color, count }
    this.queuedAction = null; // { from, to } — pre-select during animation
    this._hintThinking = false; // hint computation in progress
    this._hintMsg = null;       // null | 'thinking' | 'timeout' | 'unsolvable'
    this._lastHintFrom = -1;    // track last hint to prevent pingpong
    this._lastHintTo = -1;

    // Editor state
    this.editorTubes = [];
    this.editorSelected = -1;
    this.editorActiveColor = 'red';
    this.editorFromEditor = false;
    this.showNaming = false;
    this.editName = '';
    this.myLevelsPage = 0;
    this.showValidation = false;
    this.validationIssues = [];

    // BGM state
    this.bgmStarted = false;
    this.bgmPlaying = false;

    // Classic level system
    this.CLASSIC_COLORS = ["red", "yellow", "lightgreen", "lightblue", "blue", "purple", "gray", "pink", "hotpink", "orange", "brown", "green", "slate", "navy", "magenta", "darkgray"];
    this.CLASSIC_DATA = [
      "1103,2221,0033,0321",
      "3301,3022,1203,1201",
      "4312,4300,2432,3010,4112",
      "0412,3434,0014,0122,2133",
      "2424,3250,5015,3040,3135,2141",
      "4453,2020,2330,1551,2501,1434",
      "2864,0224,1361,6044,6283,0811,8303",
      "1653,3224,1426,1605,3015,4500,4623",
      "4466,6320,5782,3732,8780,7440,0585,5326",
      "0123,0123,0123,0123,4567,5674,6745,7456",
      "2200,6384,7318,7541,3674,6568,0741,5835,0212",
      "8224,2375,3700,2650,5765,1674,8141,3160,8384",
      "3667,0747,4288,4586,7290,9950,4383,2216,1903,1155",
      "5010,4791,9668,1390,3868,5142,7756,3495,0322,2487",
      "4709,1162,aa27,3255,053a,8369,9486,3796,8a47,0521,4081",
      "1430,1920,1788,5529,7a36,2a96,7550,4869,4017,43a3,68a2",
      "3407,2825,a978,4613,0654,4051,7906,3895,aa79,a113,8262",
      "6324,8897,3469,4a23,5771,1562,129a,8514,007a,5a09,8630",
      "33a4,3896,6170,1522,6943,aa5a,1687,2080,0547,9725,8941",
      "5107,4761,8186,9a53,4350,9278,1745,62a9,2a43,9068,320a",
      "ba79,0621,0148,1522,7187,a332,883a,9653,4ab6,7064,b0b4,5599",
      "0511,3b07,7140,1794,6862,82ab,5866,a352,7209,4a34,35b9,89ba",
      "8213,6a47,7537,45a0,1a06,0b96,4190,56a4,b212,b788,3599,23b8",
      "4188,63a3,7b60,0170,4497,537a,5091,a62b,5532,499a,1b8b,2682",
      "3b52,7077,8295,3490,2318,a169,2aab,051b,46b3,5a06,8814,6947",
      "3421,a367,6619,4a1a,6273,88b0,7814,9979,00b2,3b5a,8b02,5455",
      "2440,0312,6833,59b6,9712,9706,b758,ba24,0cb8,1c65,45c8,c17a,3aa9",
      "9c75,a536,9bb7,0824,22cc,639c,268a,4043,781a,31b9,5080,714a,b165",
      "2975,95a2,1538,a060,cbc0,b874,4549,61c7,349b,a802,17b3,3a16,862c",
      "8321,b3d9,ab42,6751,1000,cdd8,1bc5,5456,3d96,a40a,4b82,6c72,93ca,9877",
      "c6a8,d520,421a,d867,3036,2d83,9a69,cbb9,47b5,57cc,1511,0ab8,7d20,3944",
      "86da,5b61,5263,28d3,9570,ccb9,0437,8414,705b,1acb,12dc,792a,9d03,8a64",
      "c249,da02,5904,7328,19c8,6dd5,a26b,8765,4933,adc7,113c,74b1,608b,ab50",
      "51bb,30c6,49c7,3213,91c7,a750,bd2c,3686,a8a7,0910,bd85,2d94,4564,8da2",
      "11a7,eea9,d223,8c8d,55d4,7304,580c,0679,698c,3b49,a45b,76c0,e1b1,6ad2,be32",
      "c652,72c3,4e38,551a,b9ab,6e1e,c00a,7a44,8932,b8d6,30d9,b927,45ce,11d0,768d",
      "d141,8a54,953e,aa56,8967,3d4c,8da1,9bc7,03e8,ecb0,5272,be39,4261,db60,702c",
      "687c,c462,3535,0496,0232,5bad,e7ae,1e4b,a4d1,eb80,8b23,195c,c7da,d609,8917",
      "cb19,029d,1746,246b,525b,83ea,aa03,e55d,38b9,27a4,3681,4e07,0dcc,91dc,87e6",
      "b434,9d33,a5cb,1879,560b,86c3,7a1d,b8ca,921d,7105,ede7,0ec6,6294,e48a,2205",
      "1ad8,5060,748a,3893,d075,b774,3016,acbe,2ea9,e158,9524,bc4e,6c9b,63d2,2c1d",
      "6c67,27c3,9086,b951,d0e5,8894,1c93,05c2,7ad2,e241,3b71,4bdd,0a3b,6aee,48a5",
      "6910,1412,de54,aa31,6b0d,587a,9c87,68d2,60c4,7b95,523a,ee32,8ce3,07dc,bb94",
      "1c8a,8302,c4b9,6635,7ecb,7e21,8a1a,deda,5d00,b697,b945,e34d,2518,0436,c927",
      "4e35,31ea,14cb,1da4,8925,8283,bdac,626d,5795,e090,6b07,a60b,1747,cc39,de28",
      "4a34,9c88,d0eb,945e,232e,a79b,2752,6c58,4d50,d1b0,6cdc,7e38,76a6,3b01,a119",
      "e3a6,8331,50b0,40b3,e2e2,961a,4897,575c,e44d,c82b,5d77,9da0,c86d,b921,16ca",
      "d195,3646,a2cb,7e41,0c2c,55ab,857d,02e4,379d,60d3,19ea,8819,b437,8eca,620b",
      "18ea,3632,1388,2b06,5d24,e6ac,96ab,3ac5,4d25,7481,904e,0059,97d7,ceb7,1dbc",
      "2c4d,1085,968e,3c56,e9c1,86b3,7774,da36,ba7c,80ea,2290,d539,0da2,14b5,1b4e",
      "07b9,5281,be3d,2213,62a6,6a11,93e0,557a,46dc,b3ce,ce40,a879,8b05,dc49,d847",
      "b101,689b,09ec,6c2a,e584,4978,4ad7,23b7,8d6a,5036,bc07,5a31,124d,92ce,d53e",
      "119a,3bc7,5d29,d320,2c67,1a9a,b75b,e0a5,038c,80bc,e698,8621,354d,4d46,e74e",
      "e2e9,c987,7b54,3b56,dc28,3d91,0576,e6c6,014a,2430,d2e8,7b04,3bd1,8aa1,c95a",
      "3ca2,b830,6e0c,4550,5591,4d76,7d17,e8a9,7c4b,26ee,01ab,d462,3d3a,18c9,b982",
      "53b1,60c5,e144,937b,4c18,cd8c,2707,3d64,b9ad,1e03,d769,25b2,05a2,a96a,88ee",
      "a792,bcd6,cc30,bab1,1447,4086,e534,aed9,1536,10ea,7e80,2c95,d2b2,5838,d796",
      "171b,16ec,7594,d5a3,6ace,9224,3eb3,8926,0a50,52be,d840,cd8a,dc03,b417,9687",
      "4063,42d5,3994,67e8,ed3e,8c9a,5e1b,3dc9,16a0,ac5b,4287,6527,bd17,a2cb,1080",
      "a100,e268,6918,d479,87be,cc5c,7bb9,31d0,0e35,ad35,24e5,14c3,a7bd,622a,4869",
      "51d7,c286,ab1b,4dc4,696c,3520,e870,d60e,a933,1ae0,791e,49bb,5dc7,2848,a523",
      "e896,624c,3a20,751a,d4da,1e5c,c007,e323,b7db,8885,d63b,4511,490e,2c69,9b7a",
      "1816,e639,dd0c,2552,d649,403b,1c72,4d87,a709,5956,cba8,ceb3,417b,8aea,e230",
      "ae87,b112,3412,a699,2756,b3b2,6054,9ced,dcc0,9d37,74eb,5aa0,03e8,5c1d,6848",
      "218b,be37,4952,9a37,3b57,4c66,c61d,0e00,4a8b,29ac,215e,d901,d5a3,467e,c88d",
      "296a,045c,5429,8761,6a90,b70e,68da,ec23,a278,01ed,4534,71eb,b381,9dd5,bc3c",
      "2172,70f6,f26e,abdc,5904,2988,9d1e,0503,51e8,3414,bec6,fbcd,faba,7363,ca89,547d",
      "0bac,1c83,7487,852a,4231,23cc,9620,afe7,65ed,1d6b,991d,fb63,a4d0,f8fe,b549,5e70",
      "e5dd,1be1,cda2,923e,73ac,e741,8a09,d78a,6fc9,1480,2703,b460,2854,f5f6,c9f5,b3b6",
      "0721,8493,6b5b,1fc6,0765,515a,e7fa,384c,64e8,b72a,d4fb,0138,d32a,fd99,c20e,9ced",
      "0d67,6102,5613,b27a,4742,41db,12e9,9ed5,9a78,e3cf,bfb6,9e8d,080a,3453,fafc,c85c",
      "351a,bac2,e616,83fc,f077,8996,7a7e,9c1a,563f,b2d0,531e,b84c,54bd,02d9,8e42,04df",
      "d7f8,75e2,6bca,fd79,16ac,a0b4,8094,a153,972d,bcfe,2e1c,4631,6b00,5d84,e285,33f9",
      "a11b,76a0,e089,e607,9dfc,d944,4c86,a8c3,45e1,26ad,b25b,f335,7cfd,3b25,e8f1,7092",
      "7f5a,812f,7273,c81b,3eb0,ced5,3569,13ac,e7da,09d8,f5de,49ba,cb12,66f0,2446,4809",
      "9c57,34ed,5c83,3f68,01f4,b24b,9761,40dc,e6a2,5308,7a59,ec9b,1a6e,ff2d,28d1,ba70",
      "65d1,ad56,8c3a,7014,6f45,ab29,8987,992c,031e,34d1,07ef,f6a8,7ce2,fb23,bdeb,c054",
      "341d,4cf9,f251,d50e,7b5a,e928,4f16,fba6,d7c6,7079,e16a,c49b,d88e,2c23,5a80,3b30",
      "a04b,765e,629c,067e,bff8,5856,71ad,84aa,302c,fd8c,2d4b,e93d,5930,72ef,911b,34c1",
      "3513,92a1,a6c4,a9b8,47fe,3b12,2048,60e7,1eef,458b,2f9d,70d5,fa6d,56c8,b70d,cc93",
      "53e4,5616,d588,9e91,fa10,d026,3fb7,bea9,0ec2,68d5,f9c0,a833,d44c,24a7,f27b,cb17",
      "d8c7,a10b,786f,2512,567d,f8a2,ccde,df3c,ef03,5b0e,6943,9a63,149b,4850,a427,19eb",
      "08a3,720c,29c0,2e77,59fb,14eb,8430,41dd,f8aa,6ab9,fce6,155d,9851,62fd,c7e6,433b",
      "c6c9,ad37,c203,4131,e7bd,60f6,8f0b,0587,a4eb,e2e7,8982,6adb,f251,df95,45a3,c194"
    ];
    // Challenge: 240 levels linear progression
    this._challengeCache = {};
    this.challengePage = 0;
    this._totalLevels = 240;
    this._unlockedLevel = 239; // DEBUG: unlock all for testing

    this.init();
  }

  init() {
    var sysInfo = wx.getSystemInfoSync();
    this.sw = sysInfo.windowWidth || sysInfo.screenWidth || 375;
    this.sh = sysInfo.windowHeight || sysInfo.screenHeight || 667;
    this.pr = sysInfo.pixelRatio || 1;
    this.scale = Math.min(this.sw / 375, this.sh / 667);

    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.sw * this.pr;
    this.canvas.height = this.sh * this.pr;
    this.ctx.scale(this.pr, this.pr);

    // Pre-calculate scaled sizes
    this.tubeW = 40 * this.scale;
    this.tubeH = 130 * this.scale;
    this.waterH = 30 * this.scale;
    this.tubeRadius = 20 * this.scale;
    this.btnW = 140 * this.scale;
    this.btnH = 44 * this.scale;

    // Particles
    var self = this;
    this.particles = [];
    for (var i = 0; i < 50; i++) {
      this.particles.push(new BubbleParticle(this.sw, this.sh));
    }

    // Touch state
    this._touchDownId = null;

    // BGM audio
    this.bgm = wx.createInnerAudioContext();
    this.bgm.src = 'bgm.mp3';
    this.bgm.loop = true;
    this.bgm.volume = 0.4;
    var self2 = this;
    this.bgm.onError(function(err) {
      console.log('[BGM] Audio error:', err.errMsg);
    });

    // Pour sound effect
    this.pourAudio = wx.createInnerAudioContext();
    this.pourAudio.src = 'pour.mp3';
    this.pourAudio.loop = false;
    this.pourAudio.volume = 0.6;

    // Bind touch events - try multiple methods for compatibility
    this._bindTouch();

    // Start loop
    this.lastTime = Date.now();
    this._boundLoop = this.gameLoop.bind(this);
    this._boundLoop();
  }

  _bindTouch() {
    var self = this;
    var startFn = function(e) { self.onTouchStart(e); };
    var endFn = function(e) { self.onTouchEnd(e); };
    var cancelFn = function() { self._touchDownId = null; };
    var method = 'none';

    // Try wx.on first (newer unified API), then wx.onTouchStart, then canvas events
    if (typeof wx.on === 'function') {
      method = 'wx.on';
      wx.on('touchstart', startFn);
      wx.on('touchend', endFn);
      wx.on('touchcancel', cancelFn);
    } else if (typeof wx.onTouchStart === 'function') {
      method = 'wx.onTouchStart';
      wx.onTouchStart(startFn);
      wx.onTouchEnd(endFn);
      wx.onTouchCancel(cancelFn);
    } else if (this.canvas && typeof this.canvas.addEventListener === 'function') {
      method = 'canvasEvents';
      this.canvas.addEventListener('touchstart', startFn);
      this.canvas.addEventListener('touchend', endFn);
      this.canvas.addEventListener('touchcancel', cancelFn);
    }

    if (typeof console !== 'undefined' && console.log) {
      console.log('[WaterSort] Touch bind method: ' + method +
        ' | screen=' + this.sw + 'x' + this.sh + ' scale=' + this.scale.toFixed(2));
    }
  }

  // --- Game Loop ---
  gameLoop() {
    requestAnimationFrame(this._boundLoop);

    var now = Date.now();
    var dt = Math.min(now - this.lastTime, 50);
    this.lastTime = now;

    try {
      this.update(dt);
      this.render();
    } catch (e) {
      // Prevent game loop from dying on render errors
      if (typeof console !== 'undefined' && console.error) {
        console.error('[WaterSort] gameLoop error:', e.message || e);
      }
    }
  }

  update(dt) {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.sw, this.sh);
    }

    if (this.transferAnim) {
      var anim = this.transferAnim;
      anim.elapsed += dt;
      var t = Math.min(anim.elapsed / anim.duration, 1);

      // Phase timings
      var p1End = 0.12;   // Move to target
      var p2End = 0.60;   // Tilt and pour
      var p3End = 0.78;   // Return upright
      // Tilt depends on how high the water is: deeper water needs more tilt
      var topIdx = -1;
      var preSrcLen = anim.preSource.length;
      for (var wi = preSrcLen - 1; wi >= 0; wi--) {
        if (anim.preSource[wi] !== 'transparent') { topIdx = wi; break; }
      }
      var waterFrac = topIdx >= 0 ? (topIdx + 0.8) / preSrcLen : 0.25;
      var maxTilt = 20 + (1 - waterFrac) * 55; // 20°(full) ~ 75°(near empty)

      var easeInOut = function(x) { return x < 0.5 ? 2*x*x : -1+(4-2*x)*x; };
      var easeOut = function(x) { return 1 - (1-x)*(1-x); };

      if (t <= p1End) {
        // Phase 1: Move source to left of target (same row)
        var p1 = easeInOut(t / p1End);
        anim.sourceX = anim.fromOrigX + (anim.fromTargetX - anim.fromOrigX) * p1;
        anim.sourceY = anim.fromOrigY + (anim.fromTargetY - anim.fromOrigY) * p1;
        anim.sourceTilt = 0;
        anim.targetBump = 1;
      } else if (t <= p2End) {
        // Phase 2: Tilt and pour with wobble
        anim.sourceX = anim.fromTargetX;
        anim.sourceY = anim.fromTargetY;
        var p2 = (t - p1End) / (p2End - p1End);
        var baseTilt = maxTilt * easeInOut(p2);
        // Hand wobble: ±4° at ~2.5Hz
        var wobble = Math.sin(anim.elapsed * 0.015) * 4 * p2;
        anim.sourceTilt = baseTilt + wobble;
        var bumpP = Math.max(0, (t - 0.25) / 0.2);
        bumpP = Math.min(1, bumpP);
        anim.targetBump = 1 + Math.sin(bumpP * Math.PI) * 0.06;
      } else if (t <= p3End) {
        // Phase 3: Return upright (faster)
        anim.sourceX = anim.fromTargetX;
        anim.sourceY = anim.fromTargetY;
        var p3 = (t - p2End) / (p3End - p2End);
        anim.sourceTilt = maxTilt * (1 - easeOut(p3));
        anim.targetBump = 1;
      } else {
        // Phase 4: Return to original position
        var p4 = (t - p3End) / (1 - p3End);
        anim.sourceX = anim.fromTargetX + (anim.fromOrigX - anim.fromTargetX) * easeInOut(p4);
        anim.sourceY = anim.fromTargetY + (anim.fromOrigY - anim.fromTargetY) * easeInOut(p4);
        anim.sourceTilt = 0;
        anim.targetBump = 1;
      }

      if (t >= 1) {
        // Apply the actual water transfer now
        var wf = this.water[anim.from];
        var wt = this.water[anim.to];
        var col = anim.fromColor;
        var cnt = anim.count;
        var capF = this.capOf(wf);
        var capT = this.capOf(wt);
        // Remove from source (top-down)
        var rm = 0;
        for (var i = capF - 1; i >= 0 && rm < cnt; i--) {
          if (wf[i] === col) { wf[i] = 'transparent'; rm++; }
        }
        // Add to target (bottom-up)
        var ad = 0;
        for (var j = 0; j < capT && ad < cnt; j++) {
          if (wt[j] === 'transparent') { wt[j] = col; ad++; }
        }
        this.transferAnim = null;
        this.transferring = false;
        if (!this.won) this.checkWin();
        // Reveal blind layers
        this.revealBlindLayers();
        // Execute queued action if user pre-selected during animation
        if (this.queuedAction && this.queuedAction.to >= 0 && !this.won) {
          var qa = this.queuedAction;
          this.queuedAction = null;
          this.moves++;
          this.transfer(qa.from, qa.to);
        }
      }
    }
  }

  // --- Render ---
  render() {
    var ctx = this.ctx;
    // Background
    var grad = ctx.createLinearGradient(0, 0, 0, this.sh);
    grad.addColorStop(0, '#7bc6ff');
    grad.addColorStop(1, '#5ba0e0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.sw, this.sh);

    // Particles
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }

    // Screen rendering
    if (this.screen === 'menu') this.renderMenu();
    else if (this.screen === 'rules') this.renderRules();
    else if (this.screen === 'game') this.renderGame();
    else if (this.screen === 'editor') this.renderEditor();
    else if (this.screen === 'mylevels') this.renderMyLevels();
    else if (this.screen === 'levelselect') this.renderLevelSelect();
    else if (this.screen === 'classicmenu') this.renderClassicMenu();
    else if (this.screen === 'classiclevels') this.renderClassicLevels();
    else if (this.screen === 'blindboxmenu') this.renderBlindBoxMenu();
    else if (this.screen === 'varcapmenu') this.renderVarCapMenu();
    else if (this.screen === 'challenge') this.renderChallenge();
    else if (this.screen === 'speciallevels') this.renderSpecialLevels();
  }

  // --- 闯关模式 Screen ---
  renderChallenge() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(0, 180, 220, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (20 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('闯关模式', this.sw / 2, headingH / 2 - 5 * s);

    var btnW = this.sw - 60 * s;
    var btnH = 44 * s;
    var gap = 48 * s;
    var startY = headingH + 20 * s;

    var diffBtns = [
      { id: 'sublevel_0_1', label: 'EASY      🌟' },
      { id: 'sublevel_1_1', label: 'MEDIUM    🌟🌟' },
      { id: 'sublevel_2_1', label: 'HARD      🌟🌟🌟' },
      { id: 'sublevel_3_1', label: 'VERY HARD 🌟🌟🌟🌟' },
      { id: 'sublevel_7_1', label: 'IMPOSSIBLE 🌟🌟🌟🌟🌟' }
    ];
    for (var d = 0; d < diffBtns.length; d++) {
      var dy = startY + d * gap;
      var dx = (this.sw - btnW) / 2;
      this.drawMenuButton(dx, dy, btnW, btnH, diffBtns[d].label);
      this.buttonBounds.push({ id: diffBtns[d].id, x: dx, y: dy, w: btnW, h: btnH });
    }

    var g2y = startY + diffBtns.length * gap + 10 * s;
    var extraBtns = [
      { id: 'classic_menu',  label: 'CLASSIC LEVEL    🏆' },
      { id: 'hardcore_menu', label: 'HARDCORE (1 TUBE) 💀' }
    ];
    for (var e2 = 0; e2 < extraBtns.length; e2++) {
      var e2y = g2y + e2 * gap;
      var e2x = (this.sw - btnW) / 2;
      this.drawMenuButton(e2x, e2y, btnW, btnH, extraBtns[e2].label);
      this.buttonBounds.push({ id: extraBtns[e2].id, x: e2x, y: e2y, w: btnW, h: btnH });
    }

    var backY = g2y + extraBtns.length * gap + 15 * s;
    var backW = 100 * s;
    var backH = 38 * s;
    var backX = (this.sw - backW) / 2;
    this.drawGameButton(backX, backY, backW, backH, '← 返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_challenge', x: backX, y: backY, w: backW, h: backH });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Menu Screen ---
  renderMenu() {
    var ctx = this.ctx;
    var cx = this.sw / 2;
    var s = this.scale;
    this.buttonBounds = [];

    // Music button (top-left)
    this.drawMusicButton(8 * s, 8 * s, 28 * s);

    // === Logo + Title (matches HTML5 version) ===
    var logoY = 50 * s;
    ctx.fillStyle = '#fff';
    ctx.font = (40 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('🧪', cx, logoY);

    ctx.fillStyle = '#3b3b3b';
    ctx.font = 'bold ' + (26 * s) + 'px sans-serif';
    ctx.fillText('倒水游戏', cx, logoY + 52 * s);

    ctx.fillStyle = '#9a9a9a';
    ctx.font = (14 * s) + 'px sans-serif';
    ctx.fillText('Water Sort Puzzle', cx, logoY + 82 * s);

    // === Menu buttons (matches HTML5: 5 buttons with icons) ===
    var btnW = this.sw - 80 * s;
    var btnH = 44 * s;
    var startY = logoY + 130 * s;
    var gap = 50 * s;

    var btns = [
      { id: 'challenge_menu',  label: '🎯  闯关模式' },
      { id: 'special_menu',    label: '🌟  特殊关卡' },
      { id: 'editor',          label: '🔧  关卡自制器' },
      { id: 'mylevels',        label: '📁  我的关卡' },
      { id: 'rules',           label: '📖  游戏说明' }
    ];

    for (var i = 0; i < btns.length; i++) {
      var by = startY + i * gap;
      var bx = (this.sw - btnW) / 2;
      this.drawMenuButton(bx, by, btnW, btnH, btns[i].label);
      this.buttonBounds.push({ id: btns[i].id, x: bx, y: by, w: btnW, h: btnH });
    }

    // Bottom credit
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.font = (10 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Developed by Soumavo Dey  |  WeChat Edition', cx, this.sh - 14 * s);

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  drawMenuButton(x, y, w, h, text) {
    var ctx = this.ctx;
    ctx.fillStyle = '#fff';
    this.drawRoundRect(x, y, w, h, 7 * this.scale);
    ctx.fill();
    ctx.strokeStyle = '#8e37ff';
    ctx.lineWidth = 1.5 * this.scale;
    this.drawRoundRect(x, y, w, h, 7 * this.scale);
    ctx.stroke();
    ctx.fillStyle = '#3b3b3b';
    ctx.font = '600 ' + (14 * this.scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Game Screen ---
  renderGame() {
    var ctx = this.ctx;
    var s = this.scale;
    this.tubeBounds = [];
    this.buttonBounds = [];

    // Heading bar
    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    // Music toggle button (top-left)
    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    var heading;
    if (this.currentLevel <= -10) {
      var diffNames = ['EASY', 'MEDIUM', 'HARD', 'VERY HARD', 'IMPOSSIBLE'];
      var dIdx = -(this.currentLevel + 10);
      heading = 'CLASSIC ' + (diffNames[dIdx] || 'EASY') + ' #' + (this.classicLevelNum || '?');
    } else if (this.currentLevel >= 0) {
      heading = this.levelNames[this.currentLevel] || 'IMPOSSIBLE';
    } else if (this.currentLevel === -1) {
      heading = 'CUSTOM';
    } else if (this.currentLevel === -3) {
      heading = 'BLIND BOX';
    } else if (this.currentLevel === -4) {
      heading = 'VAR CAP';
    } else if (this.currentLevel === -5) {
      heading = 'HARDCORE';
    } else {
      heading = 'SAVED';
    }
    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (20 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(heading, this.sw / 2, headingH / 2 - 5 * s);

    // Draw tubes — calcTubePositions returns centers, drawTube expects left edge
    var n = this.water.length;
    this._cachedPositions = this.calcTubePositions(this.water);
    var anim = this.transferAnim;
    var pourIdx = anim ? anim.from : -1;

    // Compute pour progress for water interpolation
    var pourP = 0;
    if (anim) {
      var animT = Math.min(anim.elapsed / anim.duration, 1);
      pourP = Math.max(0, Math.min(1, (animT - 0.12) / 0.48)); // 0→1 during tilt phase
    }

    // Helper: build interpolated water for source (water level drops smoothly)
    function buildSourceWater(pre, color, count, progress) {
      var w = pre.slice();
      var len = w.length;
      var total = count * progress;
      var fullRemove = Math.floor(total);
      var frac = total - fullRemove;
      var rm = 0;
      for (var i = len - 1; i >= 0 && rm < fullRemove; i--) {
        if (w[i] === color) { w[i] = 'transparent'; rm++; }
      }
      if (frac > 0.001 && fullRemove < count) {
        for (var i2 = len - 1; i2 >= 0; i2--) {
          if (w[i2] === color) { w._partialIdx = i2; w._partialFrac = 1 - frac; break; }
        }
      }
      return w;
    }
    // Helper: build interpolated water for target (water level rises smoothly)
    function buildTargetWater(pre, color, count, progress) {
      var w = pre.slice();
      var len = w.length;
      var total = count * progress;
      var fullAdd = Math.floor(total);
      var frac = total - fullAdd;
      var ad = 0;
      for (var i = 0; i < len && ad < fullAdd; i++) {
        if (w[i] === 'transparent') { w[i] = color; ad++; }
      }
      if (frac > 0.001 && fullAdd < count) {
        var ad2 = 0;
        for (var i2 = 0; i2 < len; i2++) {
          if (w[i2] === 'transparent') { ad2++; if (ad2 === 1) { w[i2] = color; w._partialIdx = i2; w._partialFrac = frac; break; } }
        }
      }
      return w;
    }

    // Pass 1: draw all tubes except the pouring source
    for (var i = 0; i < n; i++) {
      if (i === pourIdx) continue;
      var p = this._cachedPositions[i];
      var leftX = p.x - this.tubeW / 2;
      var topY = p.y;
      var selected = (this.clicked.length === 1 && this.clicked[0] === i) ||
                     (this.transferAnim && this.queuedAction && this.queuedAction.from === i);
      var tilt = 0, bump = 1;
      var tubeWater = this.water[i];
      if (anim && i === anim.to) {
        tubeWater = buildTargetWater(anim.preTarget, anim.fromColor, anim.count, pourP);
        bump = anim.targetBump || 1;
      }
      var capI = this.capOf(tubeWater);
      var realH = this.waterH * capI + this.tubeRadius;
      this.drawTube(leftX, topY, tubeWater, selected, tilt, bump, capI, null, null);
      this.tubeBounds.push({ id: 'tube_' + i, x: leftX, y: topY, w: this.tubeW, h: realH });
    }

    // Pass 2: draw the pouring source tube on top (water gradually decreases)
    if (pourIdx >= 0) {
      var srcLeft = anim.sourceX;
      var srcTop = anim.sourceY;
      var srcTilt = anim.sourceTilt;
      var pivX = srcLeft + this.tubeW;
      var pivY = srcTop;
      var srcWater = buildSourceWater(anim.preSource, anim.fromColor, anim.count, pourP);
      var srcCap = this.capOf(srcWater);
      var srcRealH = this.waterH * srcCap + this.tubeRadius;
      this.drawTube(srcLeft, srcTop, srcWater, false, srcTilt, 1, srcCap, pivX, pivY);
      this.tubeBounds.push({ id: 'tube_' + pourIdx, x: srcLeft, y: srcTop, w: this.tubeW, h: srcRealH });
    }

    // Transfer animation overlay
    if (this.transferAnim) {
      this.drawTransferAnim();
    }

    // Bottom bar
    var barY = this.sh - 60 * s;

    // Moves counter
    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (14 * s) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('步数：' + this.moves, 12 * s, barY + 15 * s);

    // Bottom buttons
    var btnW2 = 65 * s;
    var btnH2 = 36 * s;
    var btnY2 = this.sh - 53 * s;
    var gap = 5 * s;

    // Restart
    var restX = 8 * s;
    this.drawSmallBtn(restX, btnY2, btnW2, btnH2, '重来', '#90ee90');
    this.buttonBounds.push({ id: 'restart', x: restX, y: btnY2, w: btnW2, h: btnH2 });

    // Undo
    var undoX = restX + btnW2 + gap;
    var undoW = 50 * s;
    this.drawSmallBtn(undoX, btnY2, undoW, btnH2, '撤销', '#ffdd88');
    this.buttonBounds.push({ id: 'undo', x: undoX, y: btnY2, w: undoW, h: btnH2 });

    // Hint
    var hintX = undoX + undoW + gap;
    var hintW = 52 * s;
    // Hint button with dynamic label
    var hintLabel = '💡 提示';
    if (this._hintThinking) hintLabel = '💭 …';
    else if (this._hintMsg === 'timeout') hintLabel = '⏱ 超时';
    else if (this._hintMsg === 'unsolvable') hintLabel = '❓ 无解';
    var hintBg = this._hintThinking ? '#ffe8cc' : '#fff8cc';
    this.drawSmallBtn(hintX, btnY2, hintW, btnH2, hintLabel, hintBg);
    this.buttonBounds.push({ id: 'hint', x: hintX, y: btnY2, w: hintW, h: btnH2 });

    // +Tube (hidden in hardcore mode)
    if (this.currentLevel !== -5) {
      var tubeX = hintX + hintW + gap;
      var tubeX = undoX + undoW + gap;
      var tubeW = 52 * s;
      this.drawSmallBtn(tubeX, btnY2, tubeW, btnH2, '+管', '#b8d8ff');
      this.buttonBounds.push({ id: 'add_tube', x: tubeX, y: btnY2, w: tubeW, h: btnH2 });
    }

    // Home/Back
    var isClassic = this.currentLevel <= -10;
    var homeLabel = isClassic ? '返回' : '主页';
    var homeId = isClassic ? 'back_classic_win' : 'home';
    var homeW = 62 * s;
    var homeX = this.sw - homeW - 8 * s;
    this.drawSmallBtn(homeX, btnY2, homeW, btnH2, homeLabel, '#90ee90');
    this.buttonBounds.push({ id: homeId, x: homeX, y: btnY2, w: homeW, h: btnH2 });

    // Win overlay
    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, this.sw, this.sh);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold ' + (50 * s) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('恭喜通关！', this.sw / 2, this.sh / 2 - 50 * s);

      var wby = this.sh / 2 + 10 * s;
      var isClassic = this.currentLevel <= -10;

      if (isClassic) {
        // Classic level: RESTART | BACK | NEXT (if available)
        var range = this.getClassicLevelRange(this.classicDifficulty);
        var totalInDiff = range[1] - range[0];
        var hasNext = (this.classicLevelIdx + 1) < totalInDiff;
        var btnCount = hasNext ? 3 : 2;
        var btnGap = 8 * s;
        var totalW = btnCount * btnW2 + (btnCount - 1) * btnGap;
        var startX = (this.sw - totalW) / 2;

        this.drawGameButton(startX, wby, btnW2, btnH2, '重来', '#90ee90');
        this.buttonBounds.push({ id: 'restart_win', x: startX, y: wby, w: btnW2, h: btnH2 });

        var backX = startX + btnW2 + btnGap;
        this.drawGameButton(backX, wby, btnW2, btnH2, '返回', '#ffcc80');
        this.buttonBounds.push({ id: 'back_classic_win', x: backX, y: wby, w: btnW2, h: btnH2 });

        if (hasNext) {
          var nextX = backX + btnW2 + btnGap;
          this.drawGameButton(nextX, wby, btnW2, btnH2, '下一关', '#80ccff');
          this.buttonBounds.push({ id: 'next_classic_win', x: nextX, y: wby, w: btnW2, h: btnH2 });
        }
      } else {
        // Non-classic: RESTART | HOME
        var wbx = this.sw / 2 - btnW2 - 15 * s;
        this.drawGameButton(wbx, wby, btnW2, btnH2, '重来', '#90ee90');
        this.buttonBounds.push({ id: 'restart_win', x: wbx, y: wby, w: btnW2, h: btnH2 });

        var whx = this.sw / 2 + 15 * s;
        this.drawGameButton(whx, wby, btnW2, btnH2, '主页', '#90ee90');
        this.buttonBounds.push({ id: 'home_win', x: whx, y: wby, w: btnW2, h: btnH2 });
      }

      ctx.fillStyle = '#333';
      ctx.font = (16 * s) + 'px sans-serif';
      ctx.fillText('步数：' + this.moves, this.sw / 2, wby + btnH2 + 30 * s);
    }

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  calcTubePositions(water) {
    var self = this;
    var n = water.length;
    var gap = 20 * this.scale;
    var s = this.scale;
    var defaultH = this.waterH * 4 + this.tubeRadius;

    // Per-tube heights
    var tubeHeights = water.map(function(w) {
      return self.waterH * self.capOf(w) + self.tubeRadius;
    });

    var rows, tubesPerRow;
    if (n <= 6) {
      rows = 2;
      tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)];
    } else if (n <= 10) {
      rows = 2;
      tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)];
    } else if (n <= 15) {
      rows = 3;
      tubesPerRow = [Math.ceil(n / 3), Math.ceil((n - Math.ceil(n / 3)) / 2), n - Math.ceil(n / 3) - Math.ceil((n - Math.ceil(n / 3)) / 2)];
    } else {
      rows = 4;
      var perRow = Math.ceil(n / 4);
      tubesPerRow = [perRow, perRow, perRow, n - perRow * 3];
    }
    tubesPerRow = tubesPerRow.filter(function(x) { return x > 0; });
    rows = tubesPerRow.length;

    // Max height per row
    var rowMaxH = [];
    var idx = 0;
    for (var r = 0; r < rows; r++) {
      var maxH = 0;
      for (var c = 0; c < tubesPerRow[r]; c++) {
        var th = idx < n ? tubeHeights[idx] : defaultH;
        if (th > maxH) maxH = th;
        idx++;
      }
      rowMaxH.push(maxH);
    }

    var headingH = 50 * s;
    var bottomH = 70 * s;
    var availH = this.sh - headingH - bottomH;
    var rowGap = 25 * s;

    var totalH = 0;
    for (var rr = 0; rr < rows; rr++) totalH += rowMaxH[rr] + (rr > 0 ? rowGap : 0);
    totalH -= rowGap;

    var positions = [];
    var idx2 = 0;
    var curY = headingH + (availH - totalH) / 2;
    for (var r2 = 0; r2 < rows; r2++) {
      var count = tubesPerRow[r2];
      var rowW = count * this.tubeW + (count - 1) * gap;
      var startX = (this.sw - rowW) / 2 + this.tubeW / 2;
      // Each tube's Y aligns bottom to the row's max height
      for (var c2 = 0; c2 < count; c2++) {
        var th = idx2 < n ? tubeHeights[idx2] : defaultH;
        var tubeY = curY + rowMaxH[r2] - th; // bottom-align
        positions.push({ x: startX + c2 * (this.tubeW + gap), y: tubeY });
        idx2++;
      }
      curY += rowMaxH[r2] + rowGap;
    }
    return positions;
  }

  drawTube(x, y, water, selected, tilt, bump, cap, pivotX, pivotY) {
    var ctx = this.ctx;
    var w = this.tubeW;
    var r = this.tubeRadius;
    cap = cap || this.capOf(water);
    tilt = tilt || 0;
    // Variable height: waterH * cap + bottom radius
    var h = this.waterH * cap + r;
    bump = bump || 1;

    var isPour = tilt > 0 && pivotX != null;

    ctx.save();

    if (isPour) {
      // === POUR ANIMATION ===
      // Tilt around pivot, water stays parallel to tube walls
      var px = pivotX;
      var py = pivotY;
      ctx.translate(px, py);
      ctx.rotate(tilt * Math.PI / 180);
      ctx.translate(-px, -py);

      // Clip to tube interior
      ctx.beginPath();
      this.drawRoundRectPath(x, y, w, h, r);
      ctx.clip();

      // Glass background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, w, h);

      // Water layers (partial-height top layer supported)
      var waterLayerH = this.waterH;
      var partialIdx = water._partialIdx;
      var partialFrac = water._partialFrac || 0;
      for (var i = 0; i < cap; i++) {
        var colorKey = water[i] || 'transparent';
        if (colorKey === 'transparent') continue;
        var isBlindPour = colorKey.indexOf('blind_') === 0;
        var realColorKey = isBlindPour ? colorKey.substring(6) : colorKey;
        var wy = y + h - (i + 1) * waterLayerH;
        var lh = waterLayerH + 1;
        if (i === partialIdx && partialFrac > 0) {
          lh = waterLayerH * partialFrac + 1;
          wy = y + h - (i + 1) * waterLayerH + waterLayerH * (1 - partialFrac);
        }
        if (isBlindPour) {
          var blindPhaseP = Date.now() * 0.002;
          var blindGradP = ctx.createLinearGradient(x, wy, x + w, wy + lh);
          var hueP1 = ((blindPhaseP * 40) % 360);
          blindGradP.addColorStop(0, 'hsl(' + hueP1 + ', 80%, 55%)');
          blindGradP.addColorStop(0.5, 'hsl(' + ((hueP1 + 90) % 360) + ', 80%, 65%)');
          blindGradP.addColorStop(1, 'hsl(' + ((hueP1 + 180) % 360) + ', 80%, 50%)');
          ctx.fillStyle = blindGradP;
          ctx.fillRect(x, wy, w, lh);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold ' + (Math.min(waterLayerH * 0.7, 18 * this.scale)) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', x + w / 2, wy + lh / 2);
          ctx.textAlign = 'start';
          ctx.textBaseline = 'alphabetic';
        } else {
          ctx.fillStyle = this.colorMap[realColorKey] || 'rgba(255,255,255,0.15)';
          ctx.fillRect(x, wy, w, lh);
        }
        if (i < cap - 1 && water[i+1] !== 'transparent' && i !== partialIdx) {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, wy);
          ctx.lineTo(x + w, wy);
          ctx.stroke();
        }
      }

      // Surface highlight
      var surfaceY = y + h;
      for (var j = cap - 1; j >= 0; j--) {
        if (water[j] !== 'transparent' && water[j].indexOf('blind_') !== 0) {
          var lh2 = (j === partialIdx && partialFrac > 0) ? waterLayerH * partialFrac : waterLayerH;
          surfaceY = y + h - (j + 1) * waterLayerH + (waterLayerH - lh2);
          break;
        }
      }
      if (surfaceY < y + h) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1.5 * this.scale;
        ctx.beginPath();
        ctx.moveTo(x, surfaceY);
        ctx.lineTo(x + w, surfaceY);
        ctx.stroke();
      }

      // Tube border
      ctx.beginPath();
      this.drawRoundRectPath(x, y, w, h, r);
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.9)';
      ctx.lineWidth = 2 * this.scale;
      ctx.stroke();

      // Glass shine
      ctx.beginPath();
      ctx.moveTo(x + 5 * this.scale, y + 10 * this.scale);
      ctx.lineTo(x + 5 * this.scale, y + h - r);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2 * this.scale;
      ctx.stroke();

    } else {
      // === NORMAL MODE: simple rotate ===
      var px = pivotX != null ? pivotX : (x + w / 2);
      var py = pivotY != null ? pivotY : (y + h);
      ctx.translate(px, py);
      if (tilt !== 0) ctx.rotate(tilt * Math.PI / 180);
      if (bump !== 1) ctx.scale(bump, bump);
      ctx.translate(-px, -py);

      if (selected) {
        // Float up effect
        var floatOffset = 4 * this.scale;
        ctx.translate(0, -floatOffset);
        // Glow effect (applied to tube border below)
        ctx.shadowColor = 'rgba(255, 255, 180, 0.8)';
        ctx.shadowBlur = 12 * this.scale;
        // Scale up
        var cx = x + w / 2;
        var cy = y + h / 2;
        ctx.translate(cx, cy);
        ctx.scale(1.08, 1.08);
        ctx.translate(-cx, -cy);
      }

      ctx.beginPath();
      this.drawRoundRectPath(x, y, w, h, r);
      ctx.clip();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(x, y, w, h);

      var layerH2 = this.waterH;
      var pIdx2 = water._partialIdx;
      var pFrac2 = water._partialFrac || 0;
      for (var i2 = 0; i2 < cap; i2++) {
        var ck2 = water[i2] || 'transparent';
        if (ck2 === 'transparent') continue;
        var isBlind = ck2.indexOf('blind_') === 0;
        var realColor = isBlind ? ck2.substring(6) : ck2;
        var wy2 = y + h - (i2 + 1) * layerH2;
        var lh = layerH2 + 1;
        if (i2 === pIdx2 && pFrac2 > 0) {
          lh = layerH2 * pFrac2 + 1;
          wy2 = y + h - (i2 + 1) * layerH2 + layerH2 * (1 - pFrac2);
        }
        if (isBlind) {
          // Rainbow flow gradient for blind layers
          var blindPhase = Date.now() * 0.002;
          var blindGrad = ctx.createLinearGradient(x, wy2, x + w, wy2 + lh);
          var hue1 = ((blindPhase * 40) % 360);
          var hue2 = ((hue1 + 180) % 360);
          blindGrad.addColorStop(0, 'hsl(' + hue1 + ', 80%, 55%)');
          blindGrad.addColorStop(0.5, 'hsl(' + ((hue1 + 90) % 360) + ', 80%, 65%)');
          blindGrad.addColorStop(1, 'hsl(' + hue2 + ', 80%, 50%)');
          ctx.fillStyle = blindGrad;
          ctx.fillRect(x, wy2, w, lh);
          // "?" mark
          ctx.fillStyle = '#fff';
          ctx.font = 'bold ' + (Math.min(layerH2 * 0.7, 18 * this.scale)) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', x + w / 2, wy2 + lh / 2);
          ctx.textAlign = 'start';
          ctx.textBaseline = 'alphabetic';
        } else {
          ctx.fillStyle = this.colorMap[realColor] || 'rgba(255,255,255,0.15)';
          ctx.fillRect(x, wy2, w, lh);
        }

        if (i2 < cap - 1 && water[i2+1] !== 'transparent' && i2 !== pIdx2) {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, wy2);
          ctx.lineTo(x + w, wy2);
          ctx.stroke();
        }
      }

      // Wave surface on top non-transparent, non-blind layer
      var topColorIdx = -1;
      for (var wi = cap - 1; wi >= 0; wi--) {
        if (water[wi] !== 'transparent' && water[wi].indexOf('blind_') !== 0) { topColorIdx = wi; break; }
      }
      if (topColorIdx >= 0) {
        var waveSurfaceY;
        if (topColorIdx === pIdx2 && pFrac2 > 0) {
          waveSurfaceY = y + h - (topColorIdx + 1) * layerH2 + layerH2 * (1 - pFrac2);
        } else {
          waveSurfaceY = y + h - (topColorIdx + 1) * layerH2;
        }
        var wavePhase = Date.now() * 0.003;
        var waveAmp = 1.5 * this.scale;
        var waveFreq = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1 * this.scale;
        ctx.beginPath();
        var waveSteps = 20;
        for (var ws = 0; ws <= waveSteps; ws++) {
          var wx = x + (w / waveSteps) * ws;
          var wy = waveSurfaceY + Math.sin(wx * 0.02 * waveFreq + wavePhase) * waveAmp;
          if (ws === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      this.drawRoundRectPath(x, y, w, h, r);
      ctx.strokeStyle = selected ? 'rgba(255, 215, 100, 0.95)' : 'rgba(150, 150, 150, 0.9)';
      ctx.lineWidth = selected ? (2.5 * this.scale) : (2 * this.scale);
      ctx.stroke();

      // Reset glow shadow after drawing border
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.moveTo(x + 5 * this.scale, y + 10 * this.scale);
      ctx.lineTo(x + 5 * this.scale, y + h - r);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2 * this.scale;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawTransferAnim() {
    var ctx = this.ctx;
    var anim = this.transferAnim;
    if (!anim || !this._cachedPositions) return;

    var toPos = this._cachedPositions[anim.to];
    if (!toPos) return;

    var t = Math.min(anim.elapsed / anim.duration, 1);
    // Only show during pour phase (12% - 78%)
    if (t < 0.08 || t > 0.82) return;

    var s = this.scale;
    var color = this.colorMap[anim.fromColor] || '#fff';

    // Source lip: bottom-right of tilted source (water exits here downward)
    var tiltFrac = Math.min(1, anim.sourceTilt / 60);
    var fx = anim.sourceX + this.tubeW * (0.5 + tiltFrac * 0.5);
    var fy = anim.sourceY + this.tubeH * 0.2 + tiltFrac * this.tubeH * 0.6;
    // Target water surface Y with fractional layer
    var tx = toPos.x;
    var pourP2 = Math.max(0, Math.min(1, (t - 0.12) / 0.48));
    var totalAdd2 = anim.count * pourP2;
    var fullAdd2 = Math.floor(totalAdd2);
    var fracAdd2 = totalAdd2 - fullAdd2;
    var curW = anim.preTarget.slice();
    var ad2 = 0;
    for (var ai = 0; ai < 4 && ad2 < fullAdd2; ai++) {
      if (curW[ai] === 'transparent') { curW[ai] = anim.fromColor; ad2++; }
    }
    var layerH = this.tubeH / 4;
    var surfIdx = -1, surfFrac = 1;
    var curWLen = curW.length;
    for (var li = curWLen - 1; li >= 0; li--) {
      if (curW[li] !== 'transparent') { surfIdx = li; break; }
    }
    if (fracAdd2 > 0.001 && fullAdd2 < anim.count) {
      // There's a partially filled layer on top
      surfIdx = surfIdx >= 0 ? surfIdx + 1 : 0;
      surfFrac = fracAdd2;
    }
    var ty;
    if (surfIdx >= 0) {
      ty = toPos.y + this.tubeH - (surfIdx + 1) * layerH + layerH * (1 - surfFrac);
    } else {
      ty = toPos.y + this.tubeH * 0.75;
    }

    // Fade in/out at phase boundaries
    var alpha = 1;
    if (t < 0.15) alpha = (t - 0.08) / 0.07;
    if (t > 0.65) alpha = Math.max(0, (0.82 - t) / 0.17);
    ctx.globalAlpha = alpha;

    // === Straight vertical water stream ===
    var streamW = 3 * s + anim.sourceTilt / 70 * 2.5 * s;
    var streamX = tx; // centered over target
    ctx.strokeStyle = color;
    ctx.lineWidth = streamW;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(streamX, fy);
    ctx.lineTo(streamX, ty);
    ctx.stroke();
    if (streamW > 1.5 * s) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = streamW * 0.3;
      ctx.beginPath();
      ctx.moveTo(streamX, fy);
      ctx.lineTo(streamX, ty);
      ctx.stroke();
    }

    // === Droplets ===
    for (var d = 0; d < anim.droplets.length; d++) {
      var drop = anim.droplets[d];
      var dp = (t - 0.12 - drop.delay * 0.5);
      dp = Math.max(0, Math.min(1, dp / 0.55));
      if (dp <= 0 || dp >= 1) continue;
      var dy2 = fy + (ty - fy) * dp;
      var dx2 = streamX + drop.offsetX * s;
      ctx.beginPath();
      ctx.arc(dx2, dy2, drop.radius * s * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fill();
    }

    // === Target ripple ===
    var rippleAlpha = Math.max(0, (t - 0.2) / 0.15);
    rippleAlpha = Math.min(rippleAlpha, (0.75 - t) / 0.1 + 0.3);
    rippleAlpha = Math.max(0, Math.min(1, rippleAlpha));
    if (rippleAlpha > 0) {
      var rp = (t - 0.2) * 3;
      for (var r = 0; r < 3; r++) {
        var rr = (rp * 12 + r * 7) * s;
        var ra = rippleAlpha * (1 - r * 0.3) * 0.4;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 * s * (1 - r * 0.25);
        ctx.globalAlpha = ra;
        ctx.beginPath();
        ctx.arc(tx, ty + 12 * s, Math.max(1, rr), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // === Splash ===
    if (t > 0.2 && t < 0.7) {
      var splashStr = Math.sin((t - 0.2) / 0.5 * Math.PI);
      var seed = Math.floor(anim.elapsed / 80);
      for (var sp = 0; sp < 5; sp++) {
        var sx = tx + Math.sin(seed * 7 + sp * 2.3) * 10 * s;
        var sy = ty + 8 * s - Math.abs(Math.cos(seed * 3 + sp)) * 15 * s * splashStr;
        var sr = (1 + Math.abs(Math.cos(seed + sp)) * 2.5) * s;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * splashStr * 0.5;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }

  drawGameButton(x, y, w, h, text, color) {
    var ctx = this.ctx;
    ctx.fillStyle = color;
    this.drawRoundRect(x, y, w, h, 10 * this.scale);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1 * this.scale;
    this.drawRoundRect(x, y, w, h, 10 * this.scale);
    ctx.stroke();
    ctx.fillStyle = '#333';
    var fontSize = Math.min(13 * this.scale, w / text.length * 1.2);
    ctx.font = 'bold ' + fontSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Rules Screen ---
  renderRules() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, this.sw, this.sh);

    // Rules box
    var rx = 30 * s;
    var ry = 80 * s;
    var rw = this.sw - 60 * s;
    var rh = this.sh - 200 * s;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.drawRoundRect(rx, ry, rw, rh, 10 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(rx, ry, rw, rh, 10 * s);
    ctx.stroke();

    // Rules heading
    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (26 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('RULES', this.sw / 2, ry + 15 * s);

    // Rules text
    var rulesText = 'There will be some glasses (or test tubes). Your task is to put the liquids with same color together! You can transfer different colored water from one glass to another only if the other glass is empty or its top most layer of water is of the same color as that of the one from which water is to be taken. The glass you have selected will be highlighted to prevent confusion. Restart button will take you back to the beginning of the level, also every time you open the same level the water will be shuffled.';

    ctx.font = (14 * s) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var textX = rx + 20 * s;
    var textY = ry + 55 * s;
    var maxW = rw - 40 * s;
    this.wrapText(ctx, rulesText, textX, textY, maxW, 18 * s);

    // Back button
    var bx = this.sw - 110 * s;
    var by = ry + rh - 48 * s;
    var bw = 100 * s;
    var bh = 40 * s;
    this.drawGameButton(bx, by, bw, bh, '返回', '#90ee90');
    this.buttonBounds.push({ id: 'back_rules', x: bx, y: by, w: bw, h: bh });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var cy = y;

    for (var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + ' ';
      var metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, cy);
        line = words[i] + ' ';
        cy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, cy);
  }

  // --- Touch Handling ---
  onTouchStart(e) {
    var touch = this._extractTouch(e);
    if (!touch) { console.log('[TouchStart] No touch in event'); return; }
    var tx = touch.x != null ? touch.x : (touch.clientX != null ? touch.clientX : touch.pageX);
    var ty = touch.y != null ? touch.y : (touch.clientY != null ? touch.clientY : touch.pageY);
    if (tx == null || ty == null) {
      console.log('[TouchStart] No coords. touch keys: ' + Object.keys(touch).join(','));
      return;
    }

    this._touchDownId = this.hitTestId(tx, ty);
    this._lastTouchX = tx;
    this._lastTouchY = ty;
  }

  onTouchEnd(e) {
    var touch = this._extractTouch(e, true);
    if (!touch) return;
    var tx = touch.x != null ? touch.x : (touch.clientX != null ? touch.clientX : touch.pageX);
    var ty = touch.y != null ? touch.y : (touch.clientY != null ? touch.clientY : touch.pageY);
    if (tx == null || ty == null) {
      tx = this._lastTouchX;
      ty = this._lastTouchY;
    }
    if (tx == null || ty == null) return;

    var targetId = this.hitTestId(tx, ty);

    // Tolerance: if finger moved slightly and end isn't on any target,
    // fall back to the start target (common on touch screens)
    if (!targetId && this._touchDownId) {
      var dx = tx - this._lastTouchX;
      var dy = ty - this._lastTouchY;
      if (Math.sqrt(dx * dx + dy * dy) < 14) {
        targetId = this._touchDownId;
      }
    }

    if (targetId && targetId === this._touchDownId) {
      this.handleAction(targetId);
    }
    this._touchDownId = null;
  }

  _extractTouch(e, useChanged) {
    if (!e) return null;
    var touches = useChanged ? (e.changedTouches || e.touches) : (e.touches || e.changedTouches);
    if (!touches || touches.length === 0) return null;
    return touches[0];
  }

  hitTestId(x, y) {
    var allBounds = [];
    if (this.screen === 'game') {
      allBounds = this.tubeBounds.concat(this.buttonBounds);
    } else if (this.screen === 'editor') {
      allBounds = this.tubeBounds.concat(this.buttonBounds);
    } else {
      allBounds = this.buttonBounds;
    }

    for (var i = allBounds.length - 1; i >= 0; i--) {
      var b = allBounds[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        return b.id;
      }
    }
    return null;
  }

  handleAction(id) {
    // Start BGM on first user tap
    if (!this.bgmStarted && this.bgm) {
      this.bgm.play();
      this.bgmStarted = true;
      this.bgmPlaying = true;
    }

    // Validation popup: only allow OK
    if (this.showValidation) {
      if (id === 'validation_ok') this.showValidation = false;
      return;
    }

    if (this.transferring) return;

    // BGM toggle works even during transfer (no return above it)
    if (id === 'toggle_bgm') {
      this.toggleBGM();
      return;
    }

    if (id === 'rules') {
      this.screen = 'rules';
    } else if (id === 'editor') {
      this.openEditor();
    } else if (id === 'challenge_menu') {
      this.challengePage = 0; this.screen = 'challenge';
    } else if (id.indexOf('ch_play_') === 0) {
      var lvlIdx = parseInt(id.split('_')[2]);
      var w = this.getChallengeLevel(lvlIdx);
      this.water = w;
      this.originalWater = w.map(function(t) { var c = t.slice(); c.cap = t.cap || t.length; return c; });
      this.moves = 0; this.won = false; this.clicked = []; this.transferring = false; this.transferAnim = null;
      this.currentLevel = lvlIdx; this.screen = 'game';
    } else if (id === 'ch_prev') {
      this.challengePage = Math.max(0, this.challengePage - 1);
    } else if (id === 'ch_next') {
      this.challengePage++;
    } else if (id === 'back_challenge') {
      this.screen = 'menu';
    } else if (id === 'special_menu') {
      this.screen = 'speciallevels';
    } else if (id === 'back_challenge') {
      this.screen = 'menu';
    } else if (id.indexOf('bb_') === 0) {
      var bbIdx = parseInt(id.split('_')[1]);
      var bbConfigs = [
        { n:5, maxHidden:1, tubeRatio:0.25 },
        { n:6, maxHidden:2, tubeRatio:0.35 },
        { n:7, maxHidden:2, tubeRatio:0.50 },
        { n:8, maxHidden:2, tubeRatio:0.60 }
      ];
      this.openBlindBox2(bbConfigs[bbIdx].n, bbConfigs[bbIdx].maxHidden, bbConfigs[bbIdx].tubeRatio);
    } else if (id.indexOf('vc_') === 0) {
      var vcIdx = parseInt(id.split('_')[1]);
      this.openVarCap2(3 + vcIdx);
    } else if (id === 'back_special') {
      this.screen = 'menu';
    } else if (id === 'hardcore_menu') {
      this.openHardcore();
    } else if (id === 'mylevels') {
      this.myLevelsPage = 0;
      this.screen = 'mylevels';
    } else if (id === 'classic_menu') {
      this.screen = 'classicmenu';
    } else if (id.indexOf('classic_diff_') === 0) {
      this.classicDifficulty = parseInt(id.split('_')[2]);
      this.classicPage = 0;
      this.screen = 'classiclevels';
    } else if (id.indexOf('classic_play_') === 0) {
      var cpIdx = parseInt(id.split('_')[2]);
      this.openClassicLevel(this.classicDifficulty, cpIdx);
    } else if (id === 'classic_prev') {
      this.classicPage = Math.max(0, this.classicPage - 1);
    } else if (id === 'classic_next') {
      this.classicPage++;
    } else if (id === 'back_classic_menu') {
      this.screen = 'menu';
    } else if (id === 'back_classic_levels') {
      this.screen = 'classicmenu';
    } else if (id === 'back_classic_win') {
      this.screen = 'classiclevels';
    } else if (id === 'next_classic_win') {
      this.openClassicLevel(this.classicDifficulty, this.classicLevelIdx + 1);
    } else if (id === 'back_levelselect') {
      this.screen = 'menu';
    } else if (id === 'back_rules') {
      this.screen = 'menu';
    } else if (id === 'home' || id === 'home_win') {
      this.showMenu();
    } else if (id === 'undo') {
      this.undoMove();
    } else if (id === 'hint') {
      this.doHint();
    } else if (id === 'add_tube') {
      this.addEmptyTube();
    } else if (id === 'restart' || id === 'restart_win') {
      this.restart();
    } else if (id.indexOf('level_') === 0) {
      var lvl = parseInt(id.split('_')[1]);
      this.currentLevel = lvl;
      this.screen = 'levelselect';
    } else if (id.indexOf('sublevel_') === 0) {
      var parts = id.split('_');
      this.openLevelBySeed(parseInt(parts[1]), parseInt(parts[2]));
    } else if (id.indexOf('tube_') === 0) {
      if (this.won) return;
      var tubeIdx = parseInt(id.split('_')[1]);
      this.clickTube(tubeIdx);
    }
    // Editor actions
    else if (id === 'editor_add') { this.editorAddTube(); }
    else if (id === 'editor_remove') { this.editorRemoveTube(); }
    else if (id === 'editor_cap_inc') { this.editorSetCapacity(1); }
    else if (id === 'editor_cap_dec') { this.editorSetCapacity(-1); }
    else if (id === 'editor_clear') { this.editorClearTube(); }
    else if (id === 'editor_play') { this.editorPlay(); }
    else if (id === 'editor_back') { this.showMenu(); }
    else if (id.indexOf('palette_') === 0) {
      this.editorActiveColor = id.split('_')[1];
    }
    else if (id.indexOf('etube_') === 0) {
      if (this.showNaming) return;
      var etIdx = parseInt(id.split('_')[1]);
      if (this.editorActiveColor === 'transparent') {
        this.editorEraseLayer(etIdx);
      } else {
        if (this.editorSelected === etIdx) {
          this.editorFillLayer(etIdx);
        } else {
          this.editorSelected = etIdx;
        }
      }
    }
    // Editor save / naming
    else if (id === 'editor_save') { this.openNaming(); }
    else if (id === 'validation_ok') { this.showValidation = false; }
    else if (id === 'naming_done') { this.confirmSave(); }
    else if (id === 'naming_cancel') {
      if (typeof wx.hideKeyboard === 'function') wx.hideKeyboard();
      this.showNaming = false;
    }
    // My Levels actions
    else if (id.indexOf('playlevel_') === 0) {
      var lvlId = parseInt(id.split('_')[1]);
      this.playSavedLevel(lvlId);
    }
    else if (id.indexOf('deletelevel_') === 0) {
      var delId = parseInt(id.split('_')[1]);
      this.deleteSavedLevel(delId);
    }
    else if (id === 'mylevels_prev') { this.myLevelsPage = Math.max(0, this.myLevelsPage - 1); }
    else if (id === 'mylevels_next') { this.myLevelsPage++; }
    else if (id === 'mylevels_back') { this.screen = 'menu'; }
  }

  // --- Level Editor ---
  openEditor() {
    this.screen = 'editor';
    this.editorSelected = -1;
    this.editorActiveColor = 'red';
    // Start with 5 tubes: 3 colored + 2 empty
    this.editorTubes = [
      { capacity: 4, layers: ['red', 'red', 'red', 'red'] },
      { capacity: 4, layers: ['blue', 'blue', 'blue', 'blue'] },
      { capacity: 4, layers: ['yellow', 'yellow', 'yellow', 'yellow'] },
      { capacity: 4, layers: ['transparent', 'transparent', 'transparent', 'transparent'] },
      { capacity: 4, layers: ['transparent', 'transparent', 'transparent', 'transparent'] }
    ];
  }

  renderEditor() {
    var ctx = this.ctx;
    var s = this.scale;
    this.tubeBounds = [];
    this.buttonBounds = [];

    // Heading bar
    var headingH = 45 * s;
    ctx.fillStyle = 'rgba(255, 180, 50, 0.5)';
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 12 * s, 24 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (18 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('关卡自制器', this.sw / 2, headingH / 2 - 5 * s);

    // Top toolbar buttons
    var tbY = headingH + 2 * s;
    var tbH = 30 * s;
    var tbW = 55 * s;
    var tbGap = 6 * s;
    var tbX = 8 * s;

    // Add tube button
    this.drawSmallBtn(tbX, tbY, tbW, tbH, '+Tube', '#b8f0b8');
    this.buttonBounds.push({ id: 'editor_add', x: tbX, y: tbY, w: tbW, h: tbH });
    tbX += tbW + tbGap;

    // Remove tube button
    this.drawSmallBtn(tbX, tbY, tbW, tbH, '-Tube', '#f0b8b8');
    this.buttonBounds.push({ id: 'editor_remove', x: tbX, y: tbY, w: tbW, h: tbH });
    tbX += tbW + tbGap;

    // Capacity +/- for ALL tubes
    var cap0 = this.editorTubes.length > 0 ? this.editorTubes[0].capacity : 4;
    this.drawSmallBtn(tbX, tbY, tbW, tbH, 'All-', '#ffe0a0');
    this.buttonBounds.push({ id: 'editor_cap_dec', x: tbX, y: tbY, w: tbW, h: tbH });
    tbX += tbW + tbGap;

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (13 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cap:' + cap0, tbX + 24 * s, tbY + tbH / 2);
    tbX += 50 * s + tbGap;

    this.drawSmallBtn(tbX, tbY, tbW, tbH, 'All+', '#ffe0a0');
    this.buttonBounds.push({ id: 'editor_cap_inc', x: tbX, y: tbY, w: tbW, h: tbH });
    tbX += tbW + tbGap;

    // Clear selected
    if (this.editorSelected >= 0) {
      this.drawSmallBtn(tbX, tbY, tbW, tbH, 'Clear', '#e0e0e0');
      this.buttonBounds.push({ id: 'editor_clear', x: tbX, y: tbY, w: tbW, h: tbH });
    }

    // Draw tubes
    var n = this.editorTubes.length;
    var positions = this.calcEditorTubePositions(n);
    this._editorPositions = positions;
    for (var i = 0; i < n; i++) {
      var p = positions[i];
      var leftX = p.x - this.tubeW / 2;
      var sel = (i === this.editorSelected);
      this.drawEditorTube(leftX, p.y, this.editorTubes[i], sel);
      var etRealH = this.waterH * this.editorTubes[i].capacity + this.tubeRadius;
      this.tubeBounds.push({ id: 'etube_' + i, x: leftX, y: p.y, w: this.tubeW, h: etRealH });
    }

    // Color palette at the bottom (2 rows for 16 colors)
    var totalColors = this.colors.length;
    var colorsPerRow = Math.ceil(totalColors / 2);
    var palH = 28 * s;
    var palGap = 4 * s;
    var palW = (this.sw - 20 * s - palGap * (colorsPerRow - 1)) / colorsPerRow;
    for (var row = 0; row < 2; row++) {
      var palY = this.sh - 105 * s + row * (palH + 4 * s);
      var palX = 10 * s;
      for (var c = row * colorsPerRow; c < Math.min((row + 1) * colorsPerRow, totalColors); c++) {
        var colorKey = this.colors[c];
        var isActive = (this.editorActiveColor === colorKey);
        ctx.fillStyle = this.colorMap[colorKey];
        this.drawRoundRect(palX, palY, palW, palH, 5 * s);
        ctx.fill();
        if (isActive) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5 * s;
          this.drawRoundRect(palX, palY, palW, palH, 5 * s);
          ctx.stroke();
        }
        this.buttonBounds.push({ id: 'palette_' + colorKey, x: palX, y: palY, w: palW, h: palH });
        palX += palW + palGap;
      }
    }

    // Transparency (erase) button
    var transY = this.sh - 50 * s;
    var transW = 80 * s;
    var transH = 30 * s;
    this.drawSmallBtn(this.sw / 2 - transW - 10 * s, transY, transW, transH, 'ERASE', '#fff');
    this.buttonBounds.push({ id: 'palette_transparent', x: this.sw / 2 - transW - 10 * s, y: transY, w: transW, h: transH });

    // Play button
    this.drawSmallBtn(this.sw / 2 + 10 * s, transY, transW, transH, 'PLAY', '#90ee90');
    this.buttonBounds.push({ id: 'editor_play', x: this.sw / 2 + 10 * s, y: transY, w: transW, h: transH });

    // Back button
    this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'editor_back', x: this.sw - 70 * s, y: headingH / 2 - 15 * s, w: 60 * s, h: 30 * s });

    // Save button on the right side
    this.drawSmallBtn(this.sw - 140 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, 'SAVE', '#b8d8ff');
    this.buttonBounds.push({ id: 'editor_save', x: this.sw - 140 * s, y: headingH / 2 - 15 * s, w: 60 * s, h: 30 * s });

    // Naming popup overlay
    if (this.showNaming) this.renderNamingPopup();

    // Validation popup overlay
    if (this.showValidation) this.renderValidationPopup();

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  renderValidationPopup() {
    var ctx = this.ctx;
    var s = this.scale;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, this.sw, this.sh);

    var pw = this.sw - 50 * s;
    var ph = 280 * s;
    var px = 25 * s;
    var py = (this.sh - ph) / 2;
    ctx.fillStyle = '#fff';
    this.drawRoundRect(px, py, pw, ph, 12 * s);
    ctx.fill();
    ctx.strokeStyle = '#e33';
    ctx.lineWidth = 2 * s;
    this.drawRoundRect(px, py, pw, ph, 12 * s);
    ctx.stroke();

    ctx.fillStyle = '#c00';
    ctx.font = 'bold ' + (16 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('! LEVEL ISSUES !', this.sw / 2, py + 12 * s);

    ctx.fillStyle = '#444';
    ctx.font = (12 * s) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var ty = py + 40 * s;
    for (var i = 0; i < this.validationIssues.length; i++) {
      ctx.fillText((i + 1) + '. ' + this.validationIssues[i], px + 15 * s, ty, pw - 30 * s);
      // Measure and wrap
      var metrics = ctx.measureText(this.validationIssues[i]);
      var lines = Math.ceil(metrics.width / (pw - 30 * s)) || 1;
      ty += 18 * s * lines;
    }

    // Hint
    ctx.fillStyle = '#888';
    ctx.font = (11 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Each color count must be a multiple of tube capacity.', this.sw / 2, ty + 8 * s);

    // Close button
    var btnY2 = py + ph - 42 * s;
    this.drawSmallBtn(this.sw / 2 - 40 * s, btnY2, 80 * s, 32 * s, 'OK', '#f0b0b0');
    this.buttonBounds.push({ id: 'validation_ok', x: this.sw / 2 - 40 * s, y: btnY2, w: 80 * s, h: 32 * s });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  renderNamingPopup() {
    var ctx = this.ctx;
    var s = this.scale;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, this.sw, this.sh);

    var pw = this.sw - 60 * s;
    var ph = 170 * s;
    var px = 30 * s;
    var py = (this.sh - ph) / 2;
    ctx.fillStyle = '#fff';
    this.drawRoundRect(px, py, pw, ph, 12 * s);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2 * s;
    this.drawRoundRect(px, py, pw, ph, 12 * s);
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (18 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SAVE LEVEL', this.sw / 2, py + 15 * s);

    var nameY = py + 45 * s;
    var nameH = 38 * s;
    ctx.fillStyle = '#e8f4ff';
    this.drawRoundRect(px + 15 * s, nameY, pw - 30 * s, nameH, 6 * s);
    ctx.fill();
    ctx.strokeStyle = '#5680ff';
    ctx.lineWidth = 1.5 * s;
    this.drawRoundRect(px + 15 * s, nameY, pw - 30 * s, nameH, 6 * s);
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = (16 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.editName || 'Level 1', this.sw / 2, nameY + nameH / 2);
    ctx.fillStyle = '#888';
    ctx.font = (10 * s) + 'px sans-serif';
    ctx.fillText('Keyboard "done" = save', this.sw / 2, nameY + nameH + 15 * s);

    // Buttons: Cancel / Save
    var btnY3 = py + ph - 45 * s;
    var bw5 = (pw - 50 * s) / 2;
    this.drawSmallBtn(px + 15 * s, btnY3, bw5, 32 * s, 'CANCEL', '#f0b0b0');
    this.buttonBounds.push({ id: 'naming_cancel', x: px + 15 * s, y: btnY3, w: bw5, h: 32 * s });
    this.drawSmallBtn(px + bw5 + 35 * s, btnY3, bw5, 32 * s, 'SAVE', '#90ee90');
    this.buttonBounds.push({ id: 'naming_done', x: px + bw5 + 35 * s, y: btnY3, w: bw5, h: 32 * s });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  calcEditorTubePositions(n) {
    var positions = [];
    var gap = 15 * this.scale;
    var s = this.scale;

    var rows, tubesPerRow;
    if (n <= 5) { rows = 2; tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)]; }
    else if (n <= 8) { rows = 2; tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)]; }
    else if (n <= 12) { rows = 3; tubesPerRow = [Math.ceil(n / 3), Math.ceil((n - Math.ceil(n / 3)) / 2), n - Math.ceil(n / 3) - Math.ceil((n - Math.ceil(n / 3)) / 2)]; }
    else { rows = 4; var perRow = Math.ceil(n / 4); tubesPerRow = [perRow, perRow, perRow, n - perRow * 3]; }

    // Filter out zeros
    tubesPerRow = tubesPerRow.filter(function(x) { return x > 0; });

    var topBarH = 80 * s;
    var bottomH = 110 * s;
    var availH = this.sh - topBarH - bottomH;
    var rowGap = 30 * s;

    var idx = 0;
    for (var r = 0; r < tubesPerRow.length; r++) {
      var count = tubesPerRow[r];
      var rowW = count * this.tubeW + (count - 1) * gap;
      var startX = (this.sw - rowW) / 2 + this.tubeW / 2;
      var totalRowsH = tubesPerRow.length * this.tubeH + (tubesPerRow.length - 1) * rowGap;
      var rowY = topBarH + (availH - totalRowsH) / 2 + r * (this.tubeH + rowGap);

      for (var c = 0; c < count; c++) {
        positions.push({ x: startX + c * (this.tubeW + gap), y: rowY });
        idx++;
      }
    }
    return positions;
  }

  drawEditorTube(x, y, tube, selected) {
    var ctx = this.ctx;
    var w = this.tubeW;
    var h = this.tubeH;
    var r = this.tubeRadius;
    var cap = tube.capacity;
    var layers = tube.layers;
    var layerH = h / cap;

    ctx.save();

    if (selected) {
      var cx = x + w / 2;
      var cy = y + h / 2;
      ctx.translate(cx, cy);
      ctx.scale(1.08, 1.08);
      ctx.translate(-cx, -cy);
    }

    // Clip to tube
    ctx.beginPath();
    this.drawRoundRectPath(x, y, w, h, r);
    ctx.clip();

    // Glass bg
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(x, y, w, h);

    // Layer dividers (horizontal lines)
    for (var i = 0; i < cap; i++) {
      var ly = y + h - (i + 1) * layerH;
      ctx.strokeStyle = 'rgba(180,180,180,0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, ly);
      ctx.lineTo(x + w, ly);
      ctx.stroke();
    }

    // Draw colored layers (index 0 = bottom)
    for (var i2 = 0; i2 < cap; i2++) {
      var colorKey = (i2 < layers.length) ? layers[i2] : 'transparent';
      var wy = y + h - (i2 + 1) * layerH;
      ctx.fillStyle = this.colorMap[colorKey] || 'rgba(255,255,255,0.15)';
      ctx.fillRect(x, wy, w, layerH + 1);
    }

    // Selected highlight glow
    if (selected) {
      ctx.strokeStyle = '#ff6600';
      ctx.lineWidth = 3 * this.scale;
    } else {
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.9)';
      ctx.lineWidth = 2 * this.scale;
    }
    ctx.beginPath();
    this.drawRoundRectPath(x, y, w, h, r);
    ctx.stroke();

    ctx.restore();
  }

  drawSmallBtn(x, y, w, h, text, color) {
    var ctx = this.ctx;
    ctx.fillStyle = color;
    this.drawRoundRect(x, y, w, h, 6 * this.scale);
    ctx.fill();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1 * this.scale;
    this.drawRoundRect(x, y, w, h, 6 * this.scale);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (11 * this.scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // Validate editor level
  validateLevel() {
    var issues = [];
    var cap = this.editorTubes.length > 0 ? this.editorTubes[0].capacity : 4;

    // Count each color across all tubes
    var colorCounts = {};
    for (var c = 0; c < this.colors.length; c++) {
      colorCounts[this.colors[c]] = 0;
    }

    var emptyTubes = 0;
    for (var t = 0; t < this.editorTubes.length; t++) {
      var et = this.editorTubes[t];
      var allEmpty = true;
      for (var l = 0; l < et.layers.length; l++) {
        var clr = et.layers[l];
        if (clr !== 'transparent') {
          allEmpty = false;
          if (colorCounts[clr] !== undefined) colorCounts[clr]++;
        }
      }
      if (allEmpty) emptyTubes++;
    }

    // Check each color count must be 0 or multiple of capacity
    var usedColors = [];
    for (var color in colorCounts) {
      var cnt = colorCounts[color];
      if (cnt > 0) {
        usedColors.push(color);
        if (cnt % cap !== 0) {
          issues.push('"' + color + '" has ' + cnt + ' layers, need a multiple of ' + cap +
            ' (add ' + (cap - cnt % cap) + ' or remove ' + (cnt % cap) + ')');
        }
      }
    }

    // Need at least 2 empty slots (across all tubes) for gameplay
    var emptySlots = 0;
    for (var t2 = 0; t2 < this.editorTubes.length; t2++) {
      emptySlots += this.editorTubes[t2].capacity - this.editorTubes[t2].layers.length;
      for (var l2 = 0; l2 < this.editorTubes[t2].layers.length; l2++) {
        if (this.editorTubes[t2].layers[l2] === 'transparent') emptySlots++;
      }
    }
    if (emptySlots < 2) {
      issues.push('Need at least 2 empty slots to pour water. Add an empty tube.');
    }

    // No tube should overflow its capacity (shouldn't happen, but check)
    for (var t3 = 0; t3 < this.editorTubes.length; t3++) {
      var et3 = this.editorTubes[t3];
      var colored = 0;
      for (var l3 = 0; l3 < et3.layers.length; l3++) {
        if (et3.layers[l3] !== 'transparent') colored++;
      }
      // Water is always bottom-compacted, so top layers might be empty
      // This check is informational only
    }

    return { valid: issues.length === 0, issues: issues, colorCounts: colorCounts, emptySlots: emptySlots };
  }

  showValidationPopup() {
    var result = this.validateLevel();
    if (result.valid) return true; // All good, proceed

    // Show issues in a popup
    this.validationIssues = result.issues;
    return false;
  }

  // Editor actions
  editorAddTube() {
    this.editorTubes.push({ capacity: 4, layers: ['transparent', 'transparent', 'transparent', 'transparent'] });
  }

  editorRemoveTube() {
    if (this.editorTubes.length <= 2) return;
    if (this.editorSelected >= this.editorTubes.length - 1 && this.editorSelected > 0) {
      this.editorSelected--;
    }
    this.editorTubes.pop();
  }

  editorSetCapacity(delta) {
    // Apply to ALL tubes
    if (this.editorTubes.length === 0) return;
    var newCap = this.editorTubes[0].capacity + delta;
    if (newCap < 2 || newCap > 8) return;
    for (var t = 0; t < this.editorTubes.length; t++) {
      var tube = this.editorTubes[t];
      var newLayers = [];
      for (var i = 0; i < newCap; i++) {
        newLayers.push(i < tube.layers.length ? tube.layers[i] : 'transparent');
      }
      tube.capacity = newCap;
      tube.layers = newLayers;
    }
  }

  editorClearTube() {
    if (this.editorSelected < 0 || this.editorSelected >= this.editorTubes.length) return;
    var tube = this.editorTubes[this.editorSelected];
    for (var i = 0; i < tube.layers.length; i++) {
      tube.layers[i] = 'transparent';
    }
  }

  editorFillLayer(tubeIndex) {
    if (tubeIndex < 0 || tubeIndex >= this.editorTubes.length) return;
    var tube = this.editorTubes[tubeIndex];
    // Fill from bottom up: replace first transparent with active color
    for (var i = 0; i < tube.capacity; i++) {
      if (i >= tube.layers.length || tube.layers[i] === 'transparent') {
        if (i >= tube.layers.length) tube.layers.push('transparent');
        tube.layers[i] = this.editorActiveColor;
        return;
      }
    }
    // Full - shift up (remove bottom, add top)
    for (var j = 1; j < tube.capacity; j++) {
      tube.layers[j - 1] = tube.layers[j];
    }
    tube.layers[tube.capacity - 1] = this.editorActiveColor;
  }

  editorEraseLayer(tubeIndex) {
    if (tubeIndex < 0 || tubeIndex >= this.editorTubes.length) return;
    var tube = this.editorTubes[tubeIndex];
    // Remove from top down: replace last non-transparent with transparent
    for (var i = tube.capacity - 1; i >= 0; i--) {
      if (i < tube.layers.length && tube.layers[i] !== 'transparent') {
        tube.layers[i] = 'transparent';
        return;
      }
    }
  }

  // --- DFS Solver for solvability check ---
  isSolvable(tubesArray, fast) {
    var self = this;
    var maxDepth = fast ? 200 : 8000;
    // Normalize: each tube is array of colors (bottom=idx0), with .cap property
    var normalizeState = function(tubes) {
      return tubes.map(function(t) {
        var cap = t.cap || t.length || 4;
        var layers = [];
        for (var i = 0; i < cap; i++) {
          // Strip 'blind_' prefix for solver
          var c = (i < t.length) ? (t[i] || 'transparent') : 'transparent';
          layers.push(c);
        }
        return { cap: cap, layers: layers };
      });
    };

    var hashState = function(tubes) {
      return tubes.map(function(t) { return t.layers.join(','); }).join('|');
    };

    var isWin = function(tubes) {
      for (var i = 0; i < tubes.length; i++) {
        var t = tubes[i];
        var first = t.layers[0];
        for (var j = 1; j < t.cap; j++) {
          if (t.layers[j] !== first) return false;
        }
      }
      return true;
    };

    var getTop = function(tube) {
      for (var i = tube.cap - 1; i >= 0; i--) {
        var c = tube.layers[i];
        if (c !== 'transparent' && c.indexOf('blind_') !== 0) return { color: c, idx: i };
      }
      return null;
    };

    var hasSpace = function(tube) {
      for (var i = 0; i < tube.cap; i++) {
        if (tube.layers[i] === 'transparent') return true;
      }
      return false;
    };

    var norm = normalizeState(tubesArray);
    var startHash = hashState(norm);
    var visited = {};
    visited[startHash] = true;
    var queue = [norm];
    var explored = 0;

    while (queue.length > 0 && explored < maxDepth) {
      var cur = queue.shift();
      explored++;

      if (isWin(cur)) return true;

      for (var f = 0; f < cur.length; f++) {
        var fromTube = cur[f];
        var topF = getTop(fromTube);
        if (!topF) continue;

        // Count consecutive same color from top
        var sameCount = 1;
        for (var si = topF.idx - 1; si >= 0 && cur[f].layers[si] === topF.color; si--) {
          sameCount++;
        }

        for (var tgt = 0; tgt < cur.length; tgt++) {
          if (f === tgt) continue;
          var toTube = cur[tgt];
          if (!hasSpace(toTube)) continue;

          var topT = getTop(toTube);
          var toColor = topT ? topT.color : null;
          if (toColor && toColor !== topF.color) continue;

          // Clone and apply move
          var next = cur.map(function(t) {
            return { cap: t.cap, layers: t.layers.slice() };
          });

          // Remove from source
          var removed = 0;
          for (var ri = next[f].cap - 1; ri >= 0 && removed < sameCount; ri--) {
            if (next[f].layers[ri] === topF.color) {
              next[f].layers[ri] = 'transparent';
              removed++;
            }
          }
          // Add to target
          var added = 0;
          for (var ai = 0; ai < next[tgt].cap && added < removed; ai++) {
            if (next[tgt].layers[ai] === 'transparent') {
              next[tgt].layers[ai] = topF.color;
              added++;
            }
          }

          var h = hashState(next);
          if (!visited[h]) {
            visited[h] = true;
            queue.push(next);
          }
        }
      }
    }

    // If we exhausted queue or hit depth limit, check if exhausted = unsolvable
    return queue.length === 0 && explored < maxDepth ? false : null; // null = timeout/unknown
  }

  // --- Hint: sync DFS + greedy fallback ---
  startHint(callback) { var self = this; setTimeout(function() { callback(self._findHintSync()); }, 30); }

  _findHintSync() {
    // First, try pre-computed solution for challenge levels
    if (this.currentLevel >= 0 && this.currentLevel < 240 && GameGlobal.CHALLENGE_SOLUTIONS) {
      var solStr = GameGlobal.CHALLENGE_SOLUTIONS[this.currentLevel];
      if (solStr) {
        var parts = solStr.split(',');
        for (var pi = 0; pi < parts.length; pi += 2) {
          var pf = parseInt(parts[pi]), pt = parseInt(parts[pi+1]);
          if (pf === this._lastHintTo && pt === this._lastHintFrom) continue; // skip reverse
          // Check if this move is valid for current state
          var topCheck = this.getTopLayer(this.water[pf]);
          if (!topCheck) continue;
          var tgtCheck = this.getTopLayer(this.water[pt]);
          if (tgtCheck && tgtCheck.color !== topCheck.color) continue;
          if (!this.hasSpace(this.water[pt])) continue;
          return { from: pf, to: pt };
        }
      }
    }
    // Fallback to online DFS solver
    var timeoutMs = 4000, startTime = Date.now(), maxDepth = Math.max(800, this.water.length * 80);
    var banFrom = this._lastHintTo, banTo = this._lastHintFrom;

    var tubes = [];
    for (var t = 0; t < this.water.length; t++) {
      var cap = this.capOf(this.water[t]), tube = [];
      for (var l = 0; l < cap; l++) tube.push(this.water[t][l] || 'transparent');
      tubes.push(tube);
    }

    var _topC = function(w) { for (var i = w.length - 1; i >= 0; i--) { var c = w[i]; if (c !== 'transparent' && c.indexOf('blind_') !== 0) return c; } return 'transparent'; };
    var _topR = function(w) { var c = _topC(w); if (c === 'transparent') return 0; var n = 0; for (var i = w.length - 1; i >= 0 && w[i] === c; i--) n++; return n; };
    var _sp = function(w) { var n = 0; for (var i = w.length - 1; i >= 0 && w[i] === 'transparent'; i--) n++; return n; };
    var _pur = function(w) { var f = w[0]; for (var i = 1; i < w.length; i++) if (w[i] !== f) return false; return true; };
    function key(state) {
      var norm = state.map(function(t) { return t.join(','); }), empty = [], pure = [], rest = [];
      for (var i = 0; i < norm.length; i++) {
        var layers = norm[i].split(',');
        if (layers.every(function(c) { return c === 'transparent'; })) empty.push(norm[i]);
        else if (layers.every(function(c) { return c === layers[0]; })) pure.push(norm[i]);
        else rest.push(norm[i]);
      }
      return rest.sort().concat(pure.sort()).concat(empty.sort()).join('|');
    }

    var visited = {}, result = null;
    function dfs(state, depth, firstMove) {
      if (depth > maxDepth || (depth % 200 === 0 && Date.now() - startTime > timeoutMs)) {
        result = 'timeout'; return false;
      }
      if (state.every(_pur)) { result = firstMove; return true; }
      var k = key(state); if (visited[k]) return false; visited[k] = true;

      var moves = [], firstEmpty = -1;
      for (var i = 0; i < state.length; i++) if (_topC(state[i]) === 'transparent') { firstEmpty = i; break; }
      for (var from = 0; from < state.length; from++) {
        if (_pur(state[from])) continue;
        var sc = _topC(state[from]); if (sc === 'transparent') continue;
        var srcRun = _topR(state[from]);
        for (var to = 0; to < state.length; to++) {
          if (from === to) continue;
          if (!firstMove && from === banFrom && to === banTo) continue;
          var dTop = _topC(state[to]);
          if (dTop !== 'transparent' && dTop !== sc) continue;
          var sp = _sp(state[to]); if (sp === 0) continue;
          if (dTop === 'transparent' && to !== firstEmpty) continue;
          var cnt = Math.min(srcRun, sp);
          if (dTop === sc) {
            var afterSrcRun = srcRun - cnt;
            var testTo = state[to].slice(); var ta = 0;
            for (var ti = 0; ti < testTo.length && ta < cnt; ti++) if (testTo[ti] === 'transparent') { testTo[ti] = sc; ta++; }
            var completesTo = testTo.every(function(c) { return c === testTo[0]; });
            if (!completesTo && afterSrcRun > 0) continue;
          }
          var score = cnt * 10;
          var afterTo = state[to].slice(); var ad2 = 0;
          for (var ai = 0; ai < afterTo.length && ad2 < cnt; ai++) if (afterTo[ai] === 'transparent') { afterTo[ai] = sc; ad2++; }
          if (afterTo.every(function(c) { return c === afterTo[0]; })) score += 100;
          else if (dTop !== 'transparent') score += 50;
          moves.push({ from: from, to: to, cnt: cnt, score: score, sc: sc });
        }
      }
      moves.sort(function(a, b) { return b.score - a.score; });
      for (var mi = 0; mi < moves.length; mi++) {
        if (result) return false;
        var mv = moves[mi];
        var savedFrom = state[mv.from].slice(), savedTo = state[mv.to].slice();
        var rm = 0;
        for (var ri = state[mv.from].length - 1; ri >= 0 && rm < mv.cnt; ri--) if (state[mv.from][ri] === mv.sc) { state[mv.from][ri] = 'transparent'; rm++; }
        var ad = 0;
        for (var ai = 0; ai < state[mv.to].length && ad < mv.cnt; ai++) if (state[mv.to][ai] === 'transparent') { state[mv.to][ai] = mv.sc; ad++; }
        var move = firstMove !== null ? firstMove : { from: mv.from, to: mv.to };
        var r = dfs(state, depth + 1, move);
        if (r === true) return move;
        if (r && r !== 'timeout' && typeof r === 'object') { result = r; return true; }
        state[mv.from] = savedFrom; state[mv.to] = savedTo;
      }
      return false;
    }
    try {
      var r = dfs(tubes.map(function(t) { return t.slice(); }), 0, null);
      if (r === 'timeout' || result === 'timeout') return 'timeout';
      if (r && typeof r === 'object') return r;
    } catch(e) {}

    // Greedy fallback
    var best = null, bs = -1;
    for (var f = 0; f < tubes.length; f++) {
      var tf = _topC(tubes[f]); if (tf === 'transparent' || _pur(tubes[f])) continue;
      var sr = _topR(tubes[f]);
      for (var tgt = 0; tgt < tubes.length; tgt++) {
        if (f === tgt || (f === banFrom && tgt === banTo)) continue;
        var dt = _topC(tubes[tgt]);
        if (dt !== 'transparent' && dt !== tf) continue;
        var spVal = _sp(tubes[tgt]); if (spVal <= 0) continue;
        var cntVal = Math.min(sr, spVal);
        // fallback 也加反乒乓剪枝
        if (dt === tf) {
          var afterSrc = sr - cntVal;
          var tTo = tubes[tgt].slice(); var ta2 = 0;
          for (var ti2 = 0; ti2 < tTo.length && ta2 < cntVal; ti2++) if (tTo[ti2] === 'transparent') { tTo[ti2] = tf; ta2++; }
          var comp = tTo.every(function(c) { return c === tTo[0]; });
          if (!comp && afterSrc > 0) continue;
        }
        var s = cntVal * 10 + (dt === tf ? 50 : 0);
        if (s > bs) { bs = s; best = { from: f, to: tgt }; }
      }
    }
    return best;
  }



  // === 240-level challenge system ===
  _getLevelSpec(idx) {
    if(idx<30) return {nColors:5,counts:[1,1,1,1,1],empty:2};
    if(idx<60) return {nColors:6,counts:[1,1,1,1,1,1],empty:2};
    if(idx<90) return {nColors:7,counts:[1,1,1,1,1,1,1],empty:2};
    if(idx<120){var c=[2,2,2,1,1,1,1];return{nColors:7,counts:this._shuffleArr(c,idx),empty:2};}
    if(idx<150) return {nColors:8,counts:[1,1,1,1,1,1,1,1],empty:2};
    if(idx<180){var c2=[2,2,2,2,1,1,1,1];return{nColors:8,counts:this._shuffleArr(c2,idx+100),empty:2};}
    if(idx<210){var c3=[2,2,2,2,2,2,1,1];return{nColors:8,counts:this._shuffleArr(c3,idx+200),empty:2};}
    var c4=[3,3,3,3,2,2,2,2];return{nColors:8,counts:this._shuffleArr(c4,idx+300),empty:2};
  }

  _shuffleArr(arr,seed){var a=arr.slice();for(var i=a.length-1;i>0;i--){var s=Math.sin(seed*(i+1)*127.1+311.7)*43758.5453;var j=Math.floor((s-Math.floor(s))*(i+1));var tmp=a[i];a[i]=a[j];a[j]=tmp;}return a;}

  _shuffleTubesOnce(tubes,steps){
    var gt=function(w){for(var i=w.length-1;i>=0;i--)if(w[i]!=='transparent')return{color:w[i],idx:i};return null;};
    for(var k=0;k<steps;k++){
      var from=Math.floor(Math.random()*tubes.length),to=Math.floor(Math.random()*tubes.length);
      if(from===to)continue;var src=tubes[from],dst=tubes[to],sc=gt(src);if(!sc)continue;
      var dc=gt(dst);if(dc&&dc.color!==sc.color)continue;
      var run=1;for(var ri=sc.idx-1;ri>=0&&src[ri]===sc.color;ri--)run++;
      var sp=0;for(var si=0;si<dst.length;si++)if(dst[si]==='transparent')sp++;
      var mx=Math.min(run,sp);if(mx<=0)continue;
      var cnt=1+Math.floor(Math.random()*mx);
      var rm=0;for(var ri2=src.length-1;ri2>=0&&rm<cnt;ri2--)if(src[ri2]===sc.color){src[ri2]='transparent';rm++;}
      var ad=0;for(var ai=0;ai<dst.length&&ad<cnt;ai++)if(dst[ai]==='transparent'){dst[ai]=sc.color;ad++;}
    }
  }

  getChallengeLevel(levelIndex) {
    var data = GameGlobal.CHALLENGE_DATA;
    if (levelIndex < 0 || levelIndex >= data.length) return [];
    var hexStr = data[levelIndex];
    var tubeHexes = hexStr.split(',');
    var water = [];
    for (var t = 0; t < tubeHexes.length; t++) {
      var hex = tubeHexes[t];
      var tube = [];
      for (var l = 0; l < 4; l++) {
        var ci = parseInt(hex.charAt(l), 16);
        tube.push(ci === 15 ? 'transparent' : this.colors[ci]);
      }
      tube.cap = 4;
      water.push(tube);
    }
    return water;
  }

  // --- Reverse construction
  generateByReverse(colors, cap, emptyTubes, shuffleSteps) {
    cap = cap || 4;
    emptyTubes = emptyTubes || 2;
    shuffleSteps = shuffleSteps || 30;

    var allColors = [];
    for (var ci = 0; ci < colors.length; ci++) {
      for (var ri = 0; ri < cap; ri++) {
        allColors.push(colors[ci]);
      }
    }

    // Build solved state: each color fills its own tubes
    var tubes = [];
    for (var ci2 = 0; ci2 < colors.length; ci2++) {
      var tube = [];
      for (var ri2 = 0; ri2 < cap; ri2++) {
        tube.push(colors[ci2]);
      }
      tube.cap = cap;
      tubes.push(tube);
    }
    // Add empty tubes
    for (var ei = 0; ei < emptyTubes; ei++) {
      var et = [];
      for (var ej = 0; ej < cap; ej++) et.push('transparent');
      et.cap = cap;
      tubes.push(et);
    }

    // Perform random legal reverse moves (forward moves from solved state)
    var self = this;
    var getTopColor = function(tube) {
      for (var i = tube.cap - 1; i >= 0; i--) {
        if (tube[i] !== 'transparent') return { color: tube[i], idx: i };
      }
      return null;
    };
    var countConsecutive = function(tube, topIdx, color) {
      var cnt = 0;
      for (var i = topIdx; i >= 0 && tube[i] === color; i--) cnt++;
      return cnt;
    };
    var hasSpace2 = function(tube) {
      for (var i = 0; i < tube.cap; i++) if (tube[i] === 'transparent') return true;
      return false;
    };
    var isEmpty2 = function(tube) {
      for (var i = 0; i < tube.cap; i++) if (tube[i] !== 'transparent') return false;
      return true;
    };

    for (var step = 0; step < shuffleSteps; step++) {
      // Pick a random source tube (non-empty, not completed)
      var validSources = [];
      for (var s = 0; s < tubes.length; s++) {
        if (isEmpty2(tubes[s])) continue;
        // Allow pure tubes too — we're shuffling, need to break them up
        validSources.push(s);
      }
      if (validSources.length === 0) continue;

      var fromIdx = validSources[Math.floor(Math.random() * validSources.length)];
      var fromTop = getTopColor(tubes[fromIdx]);
      if (!fromTop) continue;
      var cnt = countConsecutive(tubes[fromIdx], fromTop.idx, fromTop.color);

      // Pick a random target (has space, not same as source, top matches or empty)
      var validTargets = [];
      for (var t = 0; t < tubes.length; t++) {
        if (t === fromIdx) continue;
        if (!hasSpace2(tubes[t])) continue;
        var tTop = getTopColor(tubes[t]);
        if (tTop && tTop.color !== fromTop.color) continue;
        // Don't pour into empty if source has only one color and we want variety
        // Allow pour into empty tube during shuffle (removed original guard)
        validTargets.push(t);
      }
      if (validTargets.length === 0) continue;

      var toIdx = validTargets[Math.floor(Math.random() * validTargets.length)];

      // Perform the move — use target space like HTML5
      var tgtSpace = 0;
      for (var si = 0; si < tubes[toIdx].cap; si++) if (tubes[toIdx][si] === 'transparent') tgtSpace++;
      var moveCount = Math.min(cnt, tgtSpace);
      if (moveCount <= 0) continue;
      var removed2 = 0;
      for (var ri = tubes[fromIdx].cap - 1; ri >= 0 && removed2 < moveCount; ri--) {
        if (tubes[fromIdx][ri] === fromTop.color) {
          tubes[fromIdx][ri] = 'transparent';
          removed2++;
        }
      }
      var added2 = 0;
      for (var ai = 0; ai < tubes[toIdx].cap && added2 < removed2; ai++) {
        if (tubes[toIdx][ai] === 'transparent') {
          tubes[toIdx][ai] = fromTop.color;
          added2++;
        }
      }
    }

    return tubes;
  }

  editorPlay() {
    var result = this.validateLevel();
    if (!result.valid) {
      this.validationIssues = result.issues;
      this.showValidation = true;
      return;
    }

    // DFS solvability check
    var solvable = this.isSolvable(this.editorTubes);
    if (solvable === false) {
      this.validationIssues = ['This level is unsolvable! Adjust the color distribution.'];
      this.showValidation = true;
      return;
    }

    // Work on a copy so we don't mutate the editor state
    var tubes = JSON.parse(JSON.stringify(this.editorTubes));
    var emptyCount = 0;
    for (var i = 0; i < tubes.length; i++) {
      var et = tubes[i];
      var allTransparent = true;
      for (var j = 0; j < et.capacity; j++) {
        if (j < et.layers.length && et.layers[j] !== 'transparent') { allTransparent = false; break; }
      }
      if (allTransparent) emptyCount++;
    }
    var globalCap = tubes.length > 0 ? tubes[0].capacity : 4;
    while (emptyCount < 2) {
      var emptyLayers = []; for (var z = 0; z < globalCap; z++) emptyLayers.push('transparent');
      tubes.push({ capacity: globalCap, layers: emptyLayers });
      emptyCount++;
    }

    this.water = [];
    for (var i2 = 0; i2 < tubes.length; i2++) {
      var et2 = tubes[i2];
      var w = [];
      for (var j2 = 0; j2 < et2.capacity; j2++) {
        w.push(j2 < et2.layers.length ? et2.layers[j2] : 'transparent');
      }
      w.cap = et2.capacity;
      this.water.push(w);
    }

    this.originalWater = this.water.map(function(t) {
      var copy = t.slice();
      copy.cap = t.cap || t.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.undoStack = [];
    this.queuedAction = null;
    this.currentLevel = -1; // Custom level
    this.editorFromEditor = true;
    this.screen = 'game';
  }

  // --- Naming & Save ---
  openNaming() {
    var result = this.validateLevel();
    if (!result.valid) {
      this.validationIssues = result.issues;
      this.showValidation = true;
      return;
    }
    // DFS solvability check
    var solvable = this.isSolvable(this.editorTubes);
    if (solvable === false) {
      this.validationIssues = ['This level is unsolvable! Adjust the color distribution.'];
      this.showValidation = true;
      return;
    }
    var levels = this.loadSavedLevels();
    this.editName = 'Level ' + (levels.length + 1);
    this.showNaming = true;
    var self = this;
    if (typeof wx.showKeyboard === 'function') {
      wx.showKeyboard({ defaultValue: this.editName, maxLength: 14, confirmType: 'done' });
      wx.onKeyboardInput(function(res) { self.editName = res.value; });
    }
  }

  confirmSave() {
    if (typeof wx.hideKeyboard === 'function') wx.hideKeyboard();
    var name = this.editName.trim() || 'Untitled';
    var levels = this.loadSavedLevels();
    levels.push({
      id: Date.now(),
      name: name,
      tubes: JSON.parse(JSON.stringify(this.editorTubes))
    });
    this.saveSavedLevels(levels);
    this.showNaming = false;
    this.editName = '';
  }

  loadSavedLevels() {
    try {
      var data = wx.getStorageSync('savedLevels');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveSavedLevels(levels) {
    wx.setStorageSync('savedLevels', JSON.stringify(levels));
  }

  deleteSavedLevel(id) {
    var levels = this.loadSavedLevels();
    levels = levels.filter(function(l) { return l.id !== id; });
    this.saveSavedLevels(levels);
    // Refresh screen
    this.screen = 'mylevels';
  }

  playSavedLevel(id) {
    var levels = this.loadSavedLevels();
    var level = null;
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].id === id) { level = levels[i]; break; }
    }
    if (!level) return;

    this.water = [];
    var emptyCount = 0;
    var savedCap = 4;
    for (var i2 = 0; i2 < level.tubes.length; i2++) {
      var et = level.tubes[i2];
      var cap = et.capacity || 4;
      savedCap = cap;
      var w = [];
      var allTransparent = true;
      for (var j2 = 0; j2 < cap; j2++) {
        var color = j2 < et.layers.length ? et.layers[j2] : 'transparent';
        w.push(color);
        if (color !== 'transparent') allTransparent = false;
      }
      w.cap = cap;
      this.water.push(w);
      if (allTransparent) emptyCount++;
    }
    // Ensure at least 2 empty tubes
    while (emptyCount < 2) {
      var e = []; for (var z = 0; z < savedCap; z++) e.push('transparent');
      e.cap = savedCap;
      this.water.push(e);
      emptyCount++;
    }

    this.originalWater = this.water.map(function(t) {
      var copy = t.slice();
      copy.cap = t.cap || t.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.undoStack = [];
    this.queuedAction = null;
    this.currentLevel = -2; // Custom saved level
    this.screen = 'game';
  }

  // --- Special Levels Menu Screen ---
  renderSpecialLevels() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(200, 150, 50, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (20 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('特殊关卡', this.sw / 2, headingH / 2 - 5 * s);

    var btnW = this.sw - 50 * s;
    var btnH = 42 * s;
    var gap = 46 * s;
    var startY = headingH + 15 * s;

    // 🎁 盲盒模式
    ctx.fillStyle = '#999';
    ctx.font = (12 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('🎁 盲盒模式', this.sw / 2, startY);
    startY += 18 * s;

    var bbOpts = [
      { id: 'bb_0', label: '🎁 简单    5色·遮1层' },
      { id: 'bb_1', label: '🎁 中等    6色·遮1~2层' },
      { id: 'bb_2', label: '🎁 困难    7色·遮1~2层' },
      { id: 'bb_3', label: '🎁 专家    8色·遮1~2层' }
    ];
    for (var b = 0; b < bbOpts.length; b++) {
      var by = startY + b * gap;
      var bx = (this.sw - btnW) / 2;
      this.drawMenuButton(bx, by, btnW, btnH, bbOpts[b].label);
      this.buttonBounds.push({ id: bbOpts[b].id, x: bx, y: by, w: btnW, h: btnH });
    }

    // 🧪 变容模式
    var vcLabelY = startY + bbOpts.length * gap + 8 * s;
    ctx.fillStyle = '#999';
    ctx.font = (12 * s) + 'px sans-serif';
    ctx.fillText('🧪 变容模式', this.sw / 2, vcLabelY);
    var vcStartY = vcLabelY + 18 * s;

    var vcOpts = [
      { id: 'vc_0', label: '🌱 入门    3色·容量4~5' },
      { id: 'vc_1', label: '🌿 初级    4色·容量4~6' },
      { id: 'vc_2', label: '🌳 中级    5色·容量4~6' },
      { id: 'vc_3', label: '🏔 高级    6色·容量4~7' }
    ];
    for (var v = 0; v < vcOpts.length; v++) {
      var vy2 = vcStartY + v * gap;
      var vx2 = (this.sw - btnW) / 2;
      this.drawMenuButton(vx2, vy2, btnW, btnH, vcOpts[v].label);
      this.buttonBounds.push({ id: vcOpts[v].id, x: vx2, y: vy2, w: btnW, h: btnH });
    }

    var backY = vcStartY + vcOpts.length * gap + 15 * s;
    var backW = 100 * s;
    var backH = 38 * s;
    var backX = (this.sw - backW) / 2;
    this.drawGameButton(backX, backY, backW, backH, '← 返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_special', x: backX, y: backY, w: backW, h: backH });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Blind Box Menu Screen ---
  renderBlindBoxMenu() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    // Heading
    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(180, 100, 255, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (22 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BLIND BOX MODE', this.sw / 2, headingH / 2 - 5 * s);

    // Subtitle
    var subY = headingH + 15 * s;
    ctx.fillStyle = '#555';
    ctx.font = (13 * s) + 'px sans-serif';
    ctx.fillText('Select blind layers count', this.sw / 2, subY);

    // Layer options
    var btnW = this.sw - 60 * s;
    var btnH = 48 * s;
    var startY = subY + 30 * s;
    var gap = 58 * s;

    var options = [
      { id: 'blindbox_layers_1', label: '1 BLIND LAYER (Easy)' },
      { id: 'blindbox_layers_2', label: '2 BLIND LAYERS (Hard)' }
    ];

    for (var i = 0; i < options.length; i++) {
      var by = startY + i * gap;
      var bx = (this.sw - btnW) / 2;
      this.drawMenuButton(bx, by, btnW, btnH, options[i].label);
      this.buttonBounds.push({ id: options[i].id, x: bx, y: by, w: btnW, h: btnH });
    }

    // Back button
    var backY = startY + options.length * gap + 15 * s;
    var backW = 100 * s;
    var backH = 40 * s;
    var backX = (this.sw - backW) / 2;
    this.drawGameButton(backX, backY, backW, backH, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_blindbox', x: backX, y: backY, w: backW, h: backH });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  openBlindBox(blindLayers) {
    var numColors = 4 + blindLayers * 2; // 6 colors for 1 blind, 8 colors for 2 blind
    var colorSet = this.colors.slice(0, numColors);
    var shuffleSteps = 25 + blindLayers * 10;
    this.water = this.generateByReverse(colorSet, 4, 2, shuffleSteps);

    // Mark bottom blindLayers layers as blind in non-empty tubes
    for (var t = 0; t < this.water.length; t++) {
      var tube = this.water[t];
      var cap = this.capOf(tube);
      var blindCount = 0;
      for (var l = 0; l < cap && blindCount < blindLayers; l++) {
        if (tube[l] !== 'transparent') {
          tube[l] = 'blind_' + tube[l];
          blindCount++;
        }
      }
    }

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.currentLevel = -3; // Blind box marker
    this.screen = 'game';
  }

  // --- Blind Box v2 (HTML5匹配) ---
  _genAndShuffle(colors, cap, emptyTubes, steps) {
    // Randomly distribute all colored layers (guarantees proper mixing)
    var all = [];
    for (var ci = 0; ci < colors.length; ci++) for (var ri = 0; ri < cap; ri++) all.push(colors[ci]);
    for (var si = all.length - 1; si > 0; si--) { var sj = Math.floor(Math.random() * (si + 1)); var tmp = all[si]; all[si] = all[sj]; all[sj] = tmp; }
    var tubes = [], idx = 0;
    for (var ci2 = 0; ci2 < colors.length; ci2++) { var tube = []; for (var li = 0; li < cap; li++) tube.push(all[idx++]); tube.cap = cap; tubes.push(tube); }
    for (var ei = 0; ei < emptyTubes; ei++) { var et = []; for (var ej = 0; ej < cap; ej++) et.push('transparent'); et.cap = cap; tubes.push(et); }
    for (var ei2 = tubes.length - emptyTubes; ei2 < tubes.length; ei2++) for (var ej2 = 0; ej2 < cap; ej2++) tubes[ei2][ej2] = 'transparent';
    return tubes;
  }

  openBlindBox2(n, maxHidden, tubeRatio) {
    // Random distribution (same as challenge levels)
    var colorSet = this.colors.slice(0, n);
    this.water = this._genAndShuffle(colorSet, 4, 2, 50 + n * 10);

    // Mark bottom layers as blind
    var numToHide = Math.max(1, Math.floor(this.water.length * tubeRatio));
    // Pick candidate tubes that have enough filled layers
    var candidates = [];
    for (var t = 0; t < this.water.length; t++) {
      var filled = 0;
      for (var l = 0; l < this.capOf(this.water[t]); l++) {
        if (this.water[t][l] !== 'transparent') filled++;
      }
      if (filled >= 2) candidates.push(t);
    }
    // Shuffle candidates
    for (var s = candidates.length - 1; s > 0; s--) {
      var j = Math.floor(Math.random() * (s + 1));
      var tmp = candidates[s]; candidates[s] = candidates[j]; candidates[j] = tmp;
    }
    var hidden2 = 0;
    for (var c = 0; c < candidates.length && hidden2 < numToHide; c++) {
      var ci = candidates[c];
      var filled2 = 0;
      for (var l2 = 0; l2 < this.capOf(this.water[ci]); l2++) {
        if (this.water[ci][l2] !== 'transparent') filled2++;
      }
      var maxH = Math.min(maxHidden, filled2 - 1);
      if (maxH < 1) continue;
      var h = 1 + Math.floor(Math.random() * maxH);
      // Mark bottom h layers as blind
      var marked = 0;
      for (var l3 = 0; l3 < this.capOf(this.water[ci]) && marked < h; l3++) {
        if (this.water[ci][l3] !== 'transparent' && this.water[ci][l3].indexOf('blind_') !== 0) {
          this.water[ci][l3] = 'blind_' + this.water[ci][l3];
          marked++;
        }
      }
      hidden2++;
    }

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0; this.won = false; this.clicked = [];
    this.transferring = false; this.transferAnim = null;
    this.currentLevel = -3; this.screen = 'game';
  }

  // --- Variable Capacity v2 (HTML5匹配) ---
  openVarCap2(numColors) {
    var colorSet = this.colors.slice(0, numColors);
    var capsPool = [4, 5, 6, 7, 4, 5, 6, 7, 4, 5];
    var caps = [];
    for (var ci = 0; ci < numColors; ci++) caps.push(capsPool[ci] || 5);

    // Shuffle all layers together
    var allLayers = [];
    for (var ci2 = 0; ci2 < numColors; ci2++) {
      for (var ri = 0; ri < caps[ci2]; ri++) allLayers.push(colorSet[ci2]);
    }
    for (var sl = allLayers.length - 1; sl > 0; sl--) {
      var sj = Math.floor(Math.random() * (sl + 1));
      var st = allLayers[sl]; allLayers[sl] = allLayers[sj]; allLayers[sj] = st;
    }

    // Distribute into tubes by capacity
    this.water = [];
    var idx = 0;
    for (var ci3 = 0; ci3 < numColors; ci3++) {
      var cap = caps[ci3];
      var tube = [];
      for (var li = 0; li < cap; li++) tube.push(allLayers[idx++]);
      tube.cap = cap;
      this.water.push(tube);
    }
    // Add 2 empty tubes
    var et1 = ['transparent', 'transparent', 'transparent', 'transparent']; et1.cap = 4;
    var et2 = ['transparent', 'transparent', 'transparent', 'transparent']; et2.cap = 4;
    this.water.push(et1, et2);

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0; this.won = false; this.clicked = [];
    this.transferring = false; this.transferAnim = null;
    this.currentLevel = -4; this.screen = 'game';
  }

  // --- Variable Capacity Menu ---
  renderVarCapMenu() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(80, 200, 150, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (22 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VARIABLE CAPACITY', this.sw / 2, headingH / 2 - 5 * s);

    var subY = headingH + 15 * s;
    ctx.fillStyle = '#555';
    ctx.font = (13 * s) + 'px sans-serif';
    ctx.fillText('Select difficulty (color count)', this.sw / 2, subY);

    var btnW = this.sw - 60 * s;
    var btnH = 48 * s;
    var startY = subY + 30 * s;
    var gap = 58 * s;

    var diffs = [
      { id: 'varcap_diff_0', label: 'EASY (4 colors, cap 3-5)' },
      { id: 'varcap_diff_1', label: 'MEDIUM (5 colors, cap 3-6)' },
      { id: 'varcap_diff_2', label: 'HARD (6 colors, cap 4-7)' }
    ];

    for (var i = 0; i < diffs.length; i++) {
      var by = startY + i * gap;
      var bx = (this.sw - btnW) / 2;
      this.drawMenuButton(bx, by, btnW, btnH, diffs[i].label);
      this.buttonBounds.push({ id: diffs[i].id, x: bx, y: by, w: btnW, h: btnH });
    }

    var backY = startY + diffs.length * gap + 15 * s;
    var backW = 100 * s;
    var backH = 40 * s;
    var backX = (this.sw - backW) / 2;
    this.drawGameButton(backX, backY, backW, backH, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_varcap', x: backX, y: backY, w: backW, h: backH });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  openVarCap(difficulty) {
    var numColors = 4 + difficulty;
    var colorSet = this.colors.slice(0, numColors);
    // Assign random capacities to each color (each color's tube gets a different cap)
    var caps = [];
    for (var ci = 0; ci < numColors; ci++) {
      caps.push(3 + Math.floor(Math.random() * (3 + difficulty))); // cap 3-5 for easy, larger for hard
    }

    // Build solved state with variable capacities
    var tubes = [];
    for (var ci2 = 0; ci2 < numColors; ci2++) {
      var cap = caps[ci2];
      var tube = [];
      for (var li = 0; li < cap; li++) tube.push(colorSet[ci2]);
      tube.cap = cap;
      tubes.push(tube);
    }
    // Add 2 empty tubes with random capacities
    for (var ei = 0; ei < 2; ei++) {
      var ecap = 3 + Math.floor(Math.random() * 4);
      var et = [];
      for (var ej = 0; ej < ecap; ej++) et.push('transparent');
      et.cap = ecap;
      tubes.push(et);
    }

    // Shuffle by random forward moves
    var shuffleSteps = 25 + difficulty * 10;
    this.water = this._shuffleTubes(tubes, shuffleSteps);

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.currentLevel = -4;
    this.screen = 'game';
  }

  // Shuffle tubes by performing random forward moves
  _shuffleTubes(tubes, steps) {
    var self = this;
    for (var step = 0; step < steps; step++) {
      // Pick random non-empty source
      var validFrom = [];
      for (var s = 0; s < tubes.length; s++) {
        for (var si = self.capOf(tubes[s]) - 1; si >= 0; si--) {
          if (tubes[s][si] !== 'transparent') { validFrom.push(s); break; }
        }
      }
      if (validFrom.length === 0) continue;
      var fromIdx = validFrom[Math.floor(Math.random() * validFrom.length)];

      // Get top color info
      var fromTop = null;
      var fromCap = self.capOf(tubes[fromIdx]);
      for (var fi = fromCap - 1; fi >= 0; fi--) {
        if (tubes[fromIdx][fi] !== 'transparent') { fromTop = { color: tubes[fromIdx][fi], idx: fi }; break; }
      }
      if (!fromTop) continue;

      // Count consecutive
      var cnt = 1;
      for (var cj = fromTop.idx - 1; cj >= 0 && tubes[fromIdx][cj] === fromTop.color; cj--) cnt++;

      // Pick valid target
      var validTargets = [];
      for (var t = 0; t < tubes.length; t++) {
        if (t === fromIdx) continue;
        var tCap = self.capOf(tubes[t]);
        // Check top color
        var tTop = null;
        for (var ti = tCap - 1; ti >= 0; ti--) {
          if (tubes[t][ti] !== 'transparent') { tTop = { color: tubes[t][ti], idx: ti }; break; }
        }
        if (tTop && tTop.color !== fromTop.color) continue;
        // Check space
        var space = 0;
        for (var spi = 0; spi < tCap; spi++) {
          if (tubes[t][spi] === 'transparent') space++;
        }
        if (space <= 0) continue;
        validTargets.push(t);
      }
      if (validTargets.length === 0) continue;
      var toIdx = validTargets[Math.floor(Math.random() * validTargets.length)];

      // Apply move — use target space like HTML5
      var toCap = self.capOf(tubes[toIdx]);
      var tgtSpace = 0;
      for (var si = 0; si < toCap; si++) if (tubes[toIdx][si] === 'transparent') tgtSpace++;
      var moveCount = Math.min(cnt, tgtSpace);
      if (moveCount <= 0) continue;
      var rm2 = 0;
      for (var ri = fromCap - 1; ri >= 0 && rm2 < moveCount; ri--) {
        if (tubes[fromIdx][ri] === fromTop.color) {
          tubes[fromIdx][ri] = 'transparent';
          rm2++;
        }
      }
      var ad2 = 0;
      for (var ai = 0; ai < toCap && ad2 < rm2; ai++) {
        if (tubes[toIdx][ai] === 'transparent') {
          tubes[toIdx][ai] = fromTop.color;
          ad2++;
        }
      }
    }
    return tubes;
  }

  openHardcore() {
    var numColors = 6 + Math.floor(Math.random() * 4); // 6-9 colors
    var colorSet = this.colors.slice(0, numColors);
    var shuffleSteps = 40 + Math.floor(Math.random() * 20);
    this.water = this.generateByReverse(colorSet, 4, 1, shuffleSteps); // only 1 empty tube

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.currentLevel = -5;
    this.screen = 'game';
  }

  // --- My Levels Screen ---
  renderMyLevels() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    // Heading
    var headingH = 45 * s;
    ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 12 * s, 24 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (18 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('我的关卡', this.sw / 2, headingH / 2 - 5 * s);

    // Back button
    this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'mylevels_back', x: this.sw - 70 * s, y: headingH / 2 - 15 * s, w: 60 * s, h: 30 * s });

    var levels = this.loadSavedLevels();
    var perPage = 7;
    var totalPages = Math.max(1, Math.ceil(levels.length / perPage));
    if (this.myLevelsPage >= totalPages) this.myLevelsPage = totalPages - 1;
    var startIdx = this.myLevelsPage * perPage;
    var pageLevels = levels.slice(startIdx, startIdx + perPage);

    if (levels.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = (16 * s) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No saved levels yet', this.sw / 2, this.sh / 2);
      ctx.fillText('Create one in the Editor!', this.sw / 2, this.sh / 2 + 30 * s);
    } else {
      var itemH = 65 * s;
      var listY = headingH + 20 * s;
      for (var i = 0; i < pageLevels.length; i++) {
        var lvl = pageLevels[i];
        var iy = listY + i * itemH;
        var ix = 15 * s;
        var iw = this.sw - 30 * s;
        var ih = itemH - 5 * s;

        // Item background
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.drawRoundRect(ix, iy, iw, ih, 8 * s);
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1 * s;
        this.drawRoundRect(ix, iy, iw, ih, 8 * s);
        ctx.stroke();

        // Name + tube count
        ctx.fillStyle = '#333';
        ctx.font = 'bold ' + (14 * s) + 'px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(lvl.name, ix + 10 * s, iy + 8 * s);
        ctx.fillStyle = '#888';
        ctx.font = (11 * s) + 'px sans-serif';
        ctx.fillText(lvl.tubes.length + ' tubes', ix + 10 * s, iy + 30 * s);

        // Play button
        var pbw = 45 * s;
        var pbh = 28 * s;
        var pbx = this.sw - pbw - 90 * s;
        var pby = iy + ih / 2 - pbh / 2;
        this.drawSmallBtn(pbx, pby, pbw, pbh, 'PLAY', '#90ee90');
        this.buttonBounds.push({ id: 'playlevel_' + lvl.id, x: pbx, y: pby, w: pbw, h: pbh });

        // Delete button
        var dbx = this.sw - 48 * s;
        this.drawSmallBtn(dbx, pby, 38 * s, pbh, 'X', '#f0b8b8');
        this.buttonBounds.push({ id: 'deletelevel_' + lvl.id, x: dbx, y: pby, w: 38 * s, h: pbh });
      }

      // Pagination
      var navY = this.sh - 50 * s;
      if (this.myLevelsPage > 0) {
        this.drawSmallBtn(20 * s, navY, 70 * s, 32 * s, '< PREV', '#e0e0e0');
        this.buttonBounds.push({ id: 'mylevels_prev', x: 20 * s, y: navY, w: 70 * s, h: 32 * s });
      }
      if (this.myLevelsPage < totalPages - 1) {
        this.drawSmallBtn(this.sw - 90 * s, navY, 70 * s, 32 * s, 'NEXT >', '#e0e0e0');
        this.buttonBounds.push({ id: 'mylevels_next', x: this.sw - 90 * s, y: navY, w: 70 * s, h: 32 * s });
      }
      if (totalPages > 1) {
        ctx.fillStyle = '#888';
        ctx.font = (12 * s) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((this.myLevelsPage + 1) + '/' + totalPages, this.sw / 2, navY + 16 * s);
      }
    }

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Seeded shuffle for fixed levels ---
  seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  seededShuffle(arr, seed) {
    var a = arr.slice();
    var result = [];
    var s = seed;
    while (a.length > 0) {
      s++;
      var n = Math.floor(this.seededRandom(s) * a.length);
      result.push(a.splice(n, 1)[0]);
    }
    return result;
  }

  openLevelBySeed(difficulty, subLevel) {
    var N = difficulty + 3; // number of colors
    var colors = this.colors.slice(0, N);
    // Use reverse construction with varying shuffle for different sub-levels
    var shuffleSteps = 15 + subLevel * 8 + difficulty * 5;
    this.water = this.generateByReverse(colors, 4, 2, shuffleSteps);

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.undoStack = [];
    this.queuedAction = null;
    this.currentLevel = difficulty;
    this.screen = 'game';
  }

  // --- Level Select Screen ---
  renderLevelSelect() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    var heading = this.currentLevel >= 0 ? (this.levelNames[this.currentLevel] || '') : '';
    var headingH = 45 * s;
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 12 * s, 24 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (18 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(heading + ' - Select Level', this.sw / 2, headingH / 2 - 5 * s);

    this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_levelselect', x: this.sw - 70 * s, y: headingH / 2 - 15 * s, w: 60 * s, h: 30 * s });

    var btnW = this.sw - 60 * s;
    var btnH = 48 * s;
    var startY = headingH + 30 * s;
    var gap = 58 * s;
    for (var i = 1; i <= 5; i++) {
      var by = startY + (i - 1) * gap;
      var bx = (this.sw - btnW) / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      this.drawRoundRect(bx, by, btnW, btnH, 8 * s);
      ctx.fill();
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1 * s;
      this.drawRoundRect(bx, by, btnW, btnH, 8 * s);
      ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.font = 'bold ' + (16 * s) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Level ' + i, this.sw / 2, by + btnH / 2);
      this.buttonBounds.push({ id: 'sublevel_' + this.currentLevel + '_' + i, x: bx, y: by, w: btnW, h: btnH });
    }

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // --- Game Logic ---
  openLevel(level) {
    this.moves = 0;
    this.undoStack = [];
    this.queuedAction = null;
    this.currentLevel = level;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.animTimer = 0;
    this.screen = 'game';

    // Use reverse construction for guaranteed solvability
    var numColors = level + 3;
    var colorSet = this.colors.slice(0, numColors);
    var shuffleSteps = 20 + level * 10; // harder = more shuffling
    this.water = this.generateByReverse(colorSet, 4, 2, shuffleSteps);

    // Save original state for restart (deep copy including .cap)
    this.originalWater = this.water.map(function(t) {
      var copy = t.slice();
      copy.cap = t.cap || t.length;
      return copy;
    });
  }

  clickTube(idx) {
    // If transfer animation is in progress, queue this click as pre-select
    if (this.transferAnim) {
      if (!this.queuedAction) {
        this.queuedAction = { from: idx, to: -1 };
      } else if (this.queuedAction.to === -1) {
        if (this.queuedAction.from !== idx) {
          this.queuedAction.to = idx;
        } else {
          this.queuedAction = null; // cancel if same tube
        }
      } else {
        // Overwrite previous queue
        this.queuedAction = { from: idx, to: -1 };
      }
      return;
    }

    if (this.clicked.length === 0) {
      this.clicked.push(idx);
    } else {
      this.clicked.push(idx);
      if (this.clicked[0] !== this.clicked[1]) {
        this.moves++;
        this.transfer(this.clicked[0], this.clicked[1]);
      }
      this.clicked = [];
    }
  }

  transfer(from, to) {
    var waterFrom = this.water[from];
    var waterTo = this.water[to];

    // Validate: target must have space
    if (!this.hasSpace(waterTo) || this.isEmpty(waterFrom)) {
      this.moves = Math.max(0, this.moves - 1);
      return;
    }

    // Find the top layer of source
    var fromTop = this.getTopLayer(waterFrom);
    if (!fromTop) {
      this.moves = Math.max(0, this.moves - 1);
      return;
    }

    var fromColor = fromTop.color;
    var fromCount = fromTop.count;

    // Find the top layer of target
    var toTop = this.getTopLayer(waterTo);
    var toColor = toTop ? toTop.color : null;
    var toSpace = this.countSpace(waterTo);

    // Validate: target must be empty or same color
    if (toColor && toColor !== fromColor) {
      this.moves = Math.max(0, this.moves - 1);
      return;
    }

    var transferCount = Math.min(fromCount, toSpace);

    // Save for undo
    this.undoStack.push({ from: from, to: to, color: fromColor, count: transferCount });

    // Build droplet particles
    var droplets = [];
    var dropletCount = 5 + Math.floor(Math.random() * 5);
    for (var d = 0; d < dropletCount; d++) {
      droplets.push({
        delay: 0.35 + Math.random() * 0.3,
        arcHeight: 0.5 + Math.random() * 0.5,
        radius: 2.5 + Math.random() * 4,
        offsetX: (Math.random() - 0.5) * 10
      });
    }

    // Get tube positions for animation
    var fromPos = this._cachedPositions ? this._cachedPositions[from] : null;
    var toPos = this._cachedPositions ? this._cachedPositions[to] : null;
    var fromOrigX = fromPos ? fromPos.x - this.tubeW / 2 : 0;
    var fromOrigY = fromPos ? fromPos.y : 0;
    var gap = 8 * this.scale;
    var toLeftX = toPos ? toPos.x - this.tubeW / 2 : 0;
    var toTopY = toPos ? toPos.y : 0;
    var fromTargetX = Math.max(4 * this.scale, toLeftX - this.tubeW * 0.6);
    var fromTargetY = toTopY - this.tubeH * 0.5; // upper-left of target

    // Save pre-transfer water state for animation rendering
    var preSource = waterFrom.slice();
    var preTarget = waterTo.slice();

    this.transferring = true;
    // Play pour sound effect
    if (this.pourAudio) {
      this.pourAudio.seek(0);
      this.pourAudio.play();
    }
    this.transferAnim = {
      from: from,
      to: to,
      fromColor: fromColor,
      count: transferCount,
      elapsed: 0,
      duration: 1100,
      // Source tube positions
      fromOrigX: fromOrigX,
      fromOrigY: fromOrigY,
      fromTargetX: fromTargetX,
      fromTargetY: fromTargetY,
      // Pre-transfer water for rendering
      preSource: preSource,
      preTarget: preTarget,
      // Current animation state
      sourceX: fromOrigX,
      sourceY: fromOrigY,
      sourceTilt: 0,
      // Target tube
      targetBump: 1,
      droplets: droplets
    };

    // Water state change is deferred to end of animation (in update())
  }

  revealBlindLayers() {
    // Auto-reveal blind layers when all non-blind layers above are empty
    for (var t = 0; t < this.water.length; t++) {
      var tube = this.water[t];
      var cap = this.capOf(tube);
      for (var i = cap - 1; i >= 0; i--) {
        if (tube[i] && tube[i].indexOf('blind_') === 0) {
          // Check if all layers above this blind layer are transparent
          var allAboveTransparent = true;
          for (var j = cap - 1; j > i; j--) {
            if (tube[j] !== 'transparent') { allAboveTransparent = false; break; }
          }
          if (allAboveTransparent) {
            // Reveal: remove 'blind_' prefix
            tube[i] = tube[i].substring(6); // 'blind_'.length = 6
          }
        }
      }
    }
  }

  checkWin() {
    for (var i = 0; i < this.water.length; i++) {
      var tube = this.water[i];
      var cap = this.capOf(tube);
      var first = tube[0];
      for (var j = 1; j < cap; j++) {
        if (tube[j] !== first) return;
      }
    }
    this.won = true;
    // Save challenge progress
    if (this.currentLevel >= 0 && this._unlockedLevel <= this.currentLevel) {
      this._unlockedLevel = Math.min(239, this.currentLevel + 1);
      try { wx.setStorageSync('challenge_unlocked', this._unlockedLevel); } catch(e) {}
    }
  }

  // --- Helpers ---
  capOf(tube) { return tube.cap || tube.length; }

  hasSpace(tube) {
    for (var i = 0; i < this.capOf(tube); i++) {
      if (tube[i] === 'transparent') return true;
    }
    return false;
  }

  isEmpty(tube) {
    for (var i = 0; i < this.capOf(tube); i++) {
      if (tube[i] !== 'transparent') return false;
    }
    return true;
  }

  getTopLayer(tube) {
    var cap = this.capOf(tube);
    for (var i = cap - 1; i >= 0; i--) {
      if (tube[i] !== 'transparent' && tube[i].indexOf('blind_') !== 0) {
        var color = tube[i];
        var count = 0;
        for (var j = i; j >= 0; j--) {
          if (tube[j] === color) count++;
          else break;
        }
        return { color: color, count: count, topIndex: i };
      }
    }
    return null;
  }

  countSpace(tube) {
    var count = 0;
    var cap = this.capOf(tube);
    for (var i = 0; i < cap; i++) {
      if (tube[i] === 'transparent') count++;
    }
    return count;
  }

  shuffle(x) {
    var a = [];
    var len = x.length;
    for (var i = 0; i < len; i++) {
      var n = Math.floor(Math.random() * x.length);
      a.push(x[n]);
      x.splice(n, 1);
    }
    return a;
  }

  restart() {
    this.moves = 0;
    this.undoStack = [];
    this.water = this.originalWater.map(function(t) {
      var copy = t.slice();
      copy.cap = t.cap || t.length;
      return copy;
    });
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.animTimer = 0;
    this.screen = 'game';
  }

  // --- Classic Level System ---
  getClassicLevelRange(difficulty) {
    var ranges = [
      [0, 17],    // EASY: 17 levels
      [17, 34],   // MEDIUM: 17 levels
      [34, 51],   // HARD: 17 levels
      [51, 68],   // VERY HARD: 17 levels
      [68, 84]    // IMPOSSIBLE: 16 levels
    ];
    return ranges[difficulty] || [0, 17];
  }

  openClassicLevel(difficulty, index) {
    var range = this.getClassicLevelRange(difficulty);
    var globalIdx = range[0] + index;
    if (globalIdx >= range[1] || globalIdx >= this.CLASSIC_DATA.length) return;

    var levelStr = this.CLASSIC_DATA[globalIdx];
    var tubeHexes = levelStr.split(',');
    var CLR = this.CLASSIC_COLORS;
    this.water = [];
    for (var t = 0; t < tubeHexes.length; t++) {
      var hex = tubeHexes[t];
      var tube = [];
      for (var l = 0; l < 4; l++) {
        var colorIdx = parseInt(hex.charAt(l), 16);
        tube.push(CLR[colorIdx]);
      }
      tube.cap = 4;
      this.water.push(tube);
    }
    // Add 2 empty tubes
    var e1 = ['transparent', 'transparent', 'transparent', 'transparent']; e1.cap = 4;
    var e2 = ['transparent', 'transparent', 'transparent', 'transparent']; e2.cap = 4;
    this.water.push(e1, e2);

    this.originalWater = this.water.map(function(tu) {
      var copy = tu.slice();
      copy.cap = tu.cap || tu.length;
      return copy;
    });
    this.moves = 0;
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
    this.currentLevel = -(10 + difficulty); // Negative to indicate classic, offset by difficulty
    this.classicLevelNum = index + 1;
    this.classicLevelIdx = index;
    this.screen = 'game';
  }

  // --- Classic Level Menu Screens ---
  renderClassicMenu() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    // Heading
    var headingH = 50 * s;
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, headingH + 10 * s, 25 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 14 * s, 28 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (22 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CLASSIC LEVEL', this.sw / 2, headingH / 2 - 5 * s);

    // Subtitle
    var subY = headingH + 15 * s;
    ctx.fillStyle = '#555';
    ctx.font = (13 * s) + 'px sans-serif';
    ctx.fillText('Select Difficulty', this.sw / 2, subY);

    // Difficulty buttons
    var levels = ['EASY', 'MEDIUM', 'HARD', 'VERY HARD', 'IMPOSSIBLE'];
    var btnW = this.sw - 60 * s;
    var btnH = 48 * s;
    var startY = subY + 30 * s;
    var gap = 58 * s;

    for (var i = 0; i < levels.length; i++) {
      var by = startY + i * gap;
      var bx = (this.sw - btnW) / 2;
      this.drawMenuButton(bx, by, btnW, btnH, levels[i]);
      this.buttonBounds.push({
        id: 'classic_diff_' + i,
        x: bx, y: by, w: btnW, h: btnH
      });
    }

    // Back button
    var backY = startY + levels.length * gap + 15 * s;
    var backW = 100 * s;
    var backH = 40 * s;
    var backX = (this.sw - backW) / 2;
    this.drawGameButton(backX, backY, backW, backH, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_classic_menu', x: backX, y: backY, w: backW, h: backH });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  renderClassicLevels() {
    var ctx = this.ctx;
    var s = this.scale;
    this.buttonBounds = [];

    var diffNames = ['EASY', 'MEDIUM', 'HARD', 'VERY HARD', 'IMPOSSIBLE'];
    var diffName = diffNames[this.classicDifficulty] || 'EASY';

    // Heading
    var headingH = 45 * s;
    ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -8 * s, this.sw, headingH + 8 * s, 22 * s);
    ctx.stroke();

    // Music button
    this.drawMusicButton(8 * s, headingH / 2 - 12 * s, 24 * s);

    ctx.fillStyle = '#333';
    ctx.font = 'bold ' + (18 * s) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CLASSIC - ' + diffName, this.sw / 2, headingH / 2 - 5 * s);

    // Back button
    this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, '返回', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_classic_levels', x: this.sw - 70 * s, y: headingH / 2 - 15 * s, w: 60 * s, h: 30 * s });

    // Level list with pagination
    var range = this.getClassicLevelRange(this.classicDifficulty);
    var totalLevels = range[1] - range[0];
    var perPage = 8;
    var totalPages = Math.max(1, Math.ceil(totalLevels / perPage));
    if (this.classicPage >= totalPages) this.classicPage = totalPages - 1;
    var startIdx = this.classicPage * perPage;
    var endIdx = Math.min(startIdx + perPage, totalLevels);

    var itemH = 55 * s;
    var listY = headingH + 20 * s;
    var itemW = this.sw - 40 * s;
    var itemX = 20 * s;

    for (var i = startIdx; i < endIdx; i++) {
      var iy = listY + (i - startIdx) * itemH;
      var levelNum = i + 1;

      // Item background
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      this.drawRoundRect(itemX, iy, itemW, itemH - 5 * s, 8 * s);
      ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1 * s;
      this.drawRoundRect(itemX, iy, itemW, itemH - 5 * s, 8 * s);
      ctx.stroke();

      // Level name
      ctx.fillStyle = '#333';
      ctx.font = 'bold ' + (16 * s) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Level ' + levelNum, this.sw / 2, iy + (itemH - 5 * s) / 2);

      // Touch target
      this.buttonBounds.push({ id: 'classic_play_' + i, x: itemX, y: iy, w: itemW, h: itemH - 5 * s });
    }

    // Pagination
    var navY = this.sh - 55 * s;
    if (this.classicPage > 0) {
      this.drawSmallBtn(20 * s, navY, 70 * s, 32 * s, '< PREV', '#e0e0e0');
      this.buttonBounds.push({ id: 'classic_prev', x: 20 * s, y: navY, w: 70 * s, h: 32 * s });
    }
    if (this.classicPage < totalPages - 1) {
      this.drawSmallBtn(this.sw - 90 * s, navY, 70 * s, 32 * s, 'NEXT >', '#e0e0e0');
      this.buttonBounds.push({ id: 'classic_next', x: this.sw - 90 * s, y: navY, w: 70 * s, h: 32 * s });
    }
    if (totalPages > 1) {
      ctx.fillStyle = '#888';
      ctx.font = (12 * s) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((this.classicPage + 1) + '/' + totalPages, this.sw / 2, navY + 16 * s);
    }

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  doHint() {
    if (this.won || this.transferAnim || this._hintThinking) return;
    if (!this.water || this.water.length === 0) return;
    // Check if already solved
    var allPure = true;
    for (var i = 0; i < this.water.length && allPure; i++) {
      var f = this.water[i][0];
      for (var j = 1; j < this.capOf(this.water[i]); j++) if (this.water[i][j] !== f) { allPure = false; break; }
    }
    if (allPure) return;

    this._hintThinking = true;
    this._hintMsg = 'thinking';
    var self = this;

    this.startHint(function(r) {
      self._hintThinking = false;
      if (r && typeof r === 'object') {
        self._hintMsg = null;
        self._lastHintFrom = r.from;
        self._lastHintTo = r.to;
        self.clicked = [r.from];
        setTimeout(function() {
          if (self.clicked.length === 1 && self.clicked[0] === r.from) {
            self.moves++;
            self.transfer(r.from, r.to);
            self.clicked = [];
          }
        }, 380);
      } else if (r === 'timeout') {
        self._hintMsg = 'timeout';
        setTimeout(function() { self._hintMsg = null; }, 1500);
      } else {
        // Last resort: find ANY valid move from actual game state
        var anyMove = null;
        for (var fi = 0; fi < self.water.length && !anyMove; fi++) {
          var top = self.getTopLayer(self.water[fi]);
          if (!top) continue;
          for (var ti = 0; ti < self.water.length && !anyMove; ti++) {
            if (fi === ti) continue;
            if (self._lastHintFrom === fi && self._lastHintTo === ti) continue;
            var tTop = self.getTopLayer(self.water[ti]);
            if (tTop && tTop.color !== top.color) continue;
            if (!self.hasSpace(self.water[ti])) continue;
            anyMove = { from: fi, to: ti };
          }
        }
        if (anyMove) {
          self._lastHintFrom = anyMove.from;
          self._lastHintTo = anyMove.to;
          self.clicked = [anyMove.from];
          var am = anyMove;
          setTimeout(function() {
            if (self.clicked.length === 1 && self.clicked[0] === am.from) {
              self.moves++;
              self.transfer(am.from, am.to);
              self.clicked = [];
            }
          }, 380);
        } else {
          self._hintMsg = 'unsolvable';
          setTimeout(function() { self._hintMsg = null; }, 1500);
        }
      }
    });
  }

  undoMove() {
    if (this.undoStack.length === 0 || this.won) return;
    var undo = this.undoStack.pop();
    var waterFrom = this.water[undo.from]; // original source
    var waterTo = this.water[undo.to];     // original target
    var color = undo.color;
    var count = undo.count;
    var capFrom = this.capOf(waterFrom);
    var capTo = this.capOf(waterTo);

    // Remove 'count' of 'color' from target (scan top-down)
    var removed = 0;
    for (var i = capTo - 1; i >= 0 && removed < count; i--) {
      if (waterTo[i] === color) {
        waterTo[i] = 'transparent';
        removed++;
      }
    }

    // Add 'count' of 'color' back to source (fill bottom-up)
    var added = 0;
    for (var j2 = 0; j2 < capFrom && added < count; j2++) {
      if (waterFrom[j2] === 'transparent') {
        waterFrom[j2] = color;
        added++;
      }
    }

    this.moves = Math.max(0, this.moves - 1);
  }

  addEmptyTube() {
    if (this.won) return;
    if (this.currentLevel === -5) return; // No extra tube in hardcore
    var n = this.water.length;
    // Cap at 20 tubes to avoid layout issues
    if (n >= 20) return;
    var empty = ['transparent', 'transparent', 'transparent', 'transparent'];
    empty.cap = 4;
    this.water.push(empty);
  }

  toggleBGM() {
    if (!this.bgm) return;
    if (this.bgmPlaying) {
      this.bgm.pause();
      this.bgmPlaying = false;
    } else {
      this.bgm.play();
      this.bgmPlaying = true;
      this.bgmStarted = true;
    }
  }

  showMenu() {
    this.screen = 'menu';
    this.won = false;
    this.clicked = [];
    this.transferring = false;
    this.transferAnim = null;
  }

  // --- Drawing Helpers ---
  drawMusicButton(x, y, size) {
    var ctx = this.ctx;
    var s = size;
    ctx.fillStyle = this.bgmPlaying ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)';
    this.drawRoundRect(x, y, s, s, s / 2);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1 * this.scale;
    this.drawRoundRect(x, y, s, s, s / 2);
    ctx.stroke();
    ctx.fillStyle = this.bgmPlaying ? '#333' : '#999';
    ctx.font = (16 * this.scale) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♪', x + s / 2, y + s / 2);
    if (!this.bgmPlaying) {
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2 * this.scale;
      ctx.beginPath();
      ctx.moveTo(x + 5 * this.scale, y + 5 * this.scale);
      ctx.lineTo(x + s - 5 * this.scale, y + s - 5 * this.scale);
      ctx.stroke();
    }
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    this.buttonBounds.push({ id: 'toggle_bgm', x: x, y: y, w: s, h: s });
  }

  drawRoundRect(x, y, w, h, r) {
    this.drawRoundRectPath(x, y, w, h, r);
  }

  drawRoundRectPath(x, y, w, h, r) {
    var ctx = this.ctx;
    r = Math.min(r, h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
}

// --- Export to global scope for split modules ---
GameGlobal.WaterSortGame = WaterSortGame;

// --- Bootstrap ---
new WaterSortGame();
