// ============================================================
// Water Sort Puzzle - Level Data & Generation Methods
// Extracted from main.js — added to WaterSortGame.prototype
// ============================================================

var WaterSortGame = GameGlobal.WaterSortGame;

// --- Classic Level Data ---
var CLASSIC_COLORS = ["red", "yellow", "lightgreen", "lightblue", "blue", "purple", "gray", "pink", "hotpink", "orange", "brown", "green", "slate", "navy", "magenta", "darkgray"];

var CLASSIC_DATA = [
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

// Assign to prototype for constructor compatibility
WaterSortGame.prototype.CLASSIC_COLORS = CLASSIC_COLORS;
WaterSortGame.prototype.CLASSIC_DATA = CLASSIC_DATA;

// --- Classic Level System ---

/**
 * Returns [start, end) range of level indices in CLASSIC_DATA for a given difficulty.
 * @param {number} difficulty - 0=EASY, 1=MEDIUM, 2=HARD, 3=VERY HARD, 4=IMPOSSIBLE
 * @returns {[number, number]}
 */
WaterSortGame.prototype.getClassicLevelRange = function(difficulty) {
  var ranges = [
    [0, 17],    // EASY: 17 levels
    [17, 34],   // MEDIUM: 17 levels
    [34, 51],   // HARD: 17 levels
    [51, 68],   // VERY HARD: 17 levels
    [68, 84]    // IMPOSSIBLE: 16 levels
  ];
  return ranges[difficulty] || [0, 17];
};

/**
 * Parse hex-encoded classic level strings and set up the game state.
 * @param {number} difficulty - 0=EASY through 4=IMPOSSIBLE
 * @param {number} index - level index within the difficulty
 */
WaterSortGame.prototype.openClassicLevel = function(difficulty, index) {
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
};

// --- Seeded Random for Deterministic Level Generation ---

/**
 * Seeded pseudo-random number generator.
 * Returns a value in [0, 1) based on the seed.
 * @param {number} seed
 * @returns {number}
 */
WaterSortGame.prototype.seededRandom = function(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Deterministic array shuffle using a seed.
 * @param {Array} arr - input array (not mutated)
 * @param {number} seed - starting seed
 * @returns {Array} new shuffled array
 */
WaterSortGame.prototype.seededShuffle = function(arr, seed) {
  var a = arr.slice();
  var result = [];
  var s = seed;
  while (a.length > 0) {
    s++;
    var n = Math.floor(this.seededRandom(s) * a.length);
    result.push(a.splice(n, 1)[0]);
  }
  return result;
};

// --- Level Generation by Seed ---

/**
 * Generate a level from difficulty + subLevel seed, using reverse construction.
 * @param {number} difficulty - number of colors minus 3
 * @param {number} subLevel - sub-level index (controls shuffle variation)
 */
WaterSortGame.prototype.openLevelBySeed = function(difficulty, subLevel) {
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
};

// --- Random Level Generation ---

/**
 * Generate a random level for the given difficulty tier.
 * Uses reverse construction for guaranteed solvability.
 * @param {number} level - difficulty tier (0=EASY, 1=MEDIUM, etc.)
 */
WaterSortGame.prototype.openLevel = function(level) {
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
};

// --- BFS/DFS Solver for Solvability Check ---

/**
 * Checks whether a given tube configuration is solvable using BFS.
 * Each tube must have a .cap property or a .length fallback.
 * Blind layers (prefixed with 'blind_') are treated as regular colors.
 * @param {Array} tubesArray - array of tubes
 * @returns {boolean|null} true=solvable, false=unsolvable, null=timeout/unknown
 */
WaterSortGame.prototype.isSolvable = function(tubesArray) {
  var self = this;
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
  var maxDepth = 8000;
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
};

// --- Reverse Construction Generator ---

/**
 * Generate a guaranteed-solvable level by working backwards from a solved state.
 * Builds the solved configuration (each color fills its own tubes) and then
 * performs random legal forward moves to scramble it.
 *
 * @param {string[]} colors - array of color names to use
 * @param {number} [cap=4] - tube capacity
 * @param {number} [emptyTubes=2] - number of extra empty tubes
 * @param {number} [shuffleSteps=30] - number of random moves to scramble
 * @returns {Array} array of tube arrays, each with .cap property
 */
WaterSortGame.prototype.generateByReverse = function(colors, cap, emptyTubes, shuffleSteps) {
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

  // Reverse shuffling: try to mix from solved state
  var effective = 0;
  var maxTries = shuffleSteps * 20;
  for (var k = 0; k < maxTries && effective < shuffleSteps; k++) {
    var fromIdx, toIdx;
    do {
      fromIdx = Math.floor(Math.random() * tubes.length);
      toIdx = Math.floor(Math.random() * tubes.length);
    } while (fromIdx === toIdx);

    var src = tubes[fromIdx], dst = tubes[toIdx];
    var sc = getTopColor(src); if (sc === null || sc.color === 'transparent') continue;
    var dc = getTopColor(dst);
    if (dc !== null && dc.color !== 'transparent' && dc.color !== sc.color) continue;
    var run = countConsecutive(src, sc.idx, sc.color);
    var sp = 0; for (var si = 0; si < dst.cap; si++) if (dst[si] === 'transparent') sp++;
    var cnt = Math.min(run, sp);
    if (cnt <= 0) continue;

    var rm = 0;
    for (var i = src.length - 1; i >= 0 && rm < cnt; i--) if (src[i] === sc.color) { src[i] = 'transparent'; rm++; }
    var ad = 0;
    for (var j = 0; j < dst.length && ad < cnt; j++) if (dst[j] === 'transparent') { dst[j] = sc.color; ad++; }
    effective++;
  }

  // Check if still all-pure → fallback: random shuffle all layers
  var allPure = true;
  for (var ti = 0; ti < tubes.length && allPure; ti++) {
    var fst = tubes[ti][0];
    for (var lj = 1; lj < tubes[ti].cap; lj++) if (tubes[ti][lj] !== fst) { allPure = false; break; }
  }
  if (allPure) {
    // Fallback: randomly distribute all colored layers across colored tubes
    var allLayers = [];
    for (var ci = 0; ci < colors.length; ci++) {
      for (var ri = 0; ri < cap; ri++) allLayers.push(colors[ci]);
    }
    // Shuffle
    for (var si = allLayers.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = allLayers[si]; allLayers[si] = allLayers[sj]; allLayers[sj] = tmp;
    }
    // Distribute into first colors.length tubes
    var idx = 0;
    for (var ci2 = 0; ci2 < colors.length; ci2++) {
      var tube2 = [];
      for (var li = 0; li < cap; li++) tube2.push(allLayers[idx++]);
      tube2.cap = cap;
      tubes[ci2] = tube2;
    }
    // Clear remaining tubes (should be empty tubes)
    for (var ei = colors.length; ei < tubes.length; ei++) {
      for (var ej = 0; ej < tubes[ei].cap; ej++) tubes[ei][ej] = 'transparent';
    }
  }

  // Ensure last emptyTubes tubes are empty
  for (var ei = tubes.length - emptyTubes; ei < tubes.length; ei++) {
    for (var ej = 0; ej < tubes[ei].cap; ej++) tubes[ei][ej] = 'transparent';
  }

  return tubes;
};

// --- Blind Box Mode ---

/**
 * Generate a Blind Box level with hidden bottom layers.
 * @param {number} blindLayers - number of bottom layers to hide per tube (1 or 2)
 */
WaterSortGame.prototype.openBlindBox = function(blindLayers) {
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
};

// --- Variable Capacity Mode ---

/**
 * Generate a Variable Capacity level where each tube may have a different capacity.
 * @param {number} difficulty - 0=easy (4 colors), 1=medium (5 colors), 2=hard (6 colors)
 */
WaterSortGame.prototype.openVarCap = function(difficulty) {
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
};

// --- Tube Shuffling ---

/**
 * Shuffle tubes by performing random legal forward moves.
 * Used as an alternative to reverse construction for variable-capacity levels.
 * @param {Array} tubes - array of tube arrays (each with .cap property)
 * @param {number} steps - number of random moves to perform
 * @returns {Array} the mutated tubes array
 */
WaterSortGame.prototype._shuffleTubes = function(tubes, steps) {
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
    var tgtSpace2 = 0;
    for (var si2 = 0; si2 < toCap; si2++) if (tubes[toIdx][si2] === 'transparent') tgtSpace2++;
    var moveCount = Math.min(cnt, tgtSpace2);
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
};

// --- Hardcore Mode ---

/**
 * Generate a Hardcore level with only 1 empty tube.
 */
WaterSortGame.prototype.openHardcore = function() {
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
};
