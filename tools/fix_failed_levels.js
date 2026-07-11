// Fix failed levels by generating random solvable 10-tube levels
// Random distribution → DFS check → keep if solvable
var fs = require('fs');
var path = require('path');

var COLORS = ['red','blue','yellow','green','purple','lightgreen','lightblue','orange','brown','pink','gray','hotpink','slate','navy','magenta','darkgray'];

// Failed levels to fix (0-indexed): L211, L217, L228, L229, L237, L240
var failedLevels = [210, 216, 227, 228, 236, 239];

// === State functions (same as generate_solutions.js) ===
function stateKey(tubes) {
  var norm = [];
  for (var t = 0; t < tubes.length; t++) {
    var tube = tubes[t], cap = tube.length;
    var layers = [];
    for (var i = 0; i < cap; i++) layers.push(tube[i] || 'transparent');
    norm.push(layers.join(','));
  }
  var empty = [], pure = [], rest = [];
  for (var j = 0; j < norm.length; j++) {
    var s = norm[j], layers = s.split(',');
    var allT = true;
    for (var k = 0; k < layers.length; k++) { if (layers[k] !== 'transparent') { allT = false; break; } }
    if (allT) { empty.push(s); continue; }
    var allSame = true, fst = layers[0];
    for (var k2 = 1; k2 < layers.length; k2++) { if (layers[k2] !== fst) { allSame = false; break; } }
    if (allSame) pure.push(s); else rest.push(s);
  }
  return rest.sort().concat(pure.sort()).concat(empty.sort()).join('|');
}

function getTop(tube) {
  for (var i = 3; i >= 0; i--) { var c = tube[i] || 'transparent'; if (c !== 'transparent') return {color: c, idx: i}; }
  return null;
}
function countRun(tube, ti, c) { var n = 0; for (var i = ti; i >= 0 && tube[i] === c; i--) n++; return n; }
function countSpace(tube) { var n = 0; for (var i = 0; i < 4; i++) if ((tube[i] || 'transparent') === 'transparent') n++; return n; }
function isWin(tubes) {
  for (var t = 0; t < tubes.length; t++) {
    var fst = tubes[t][0] || 'transparent';
    for (var i = 1; i < 4; i++) if ((tubes[t][i] || 'transparent') !== fst) return false;
  }
  return true;
}
function cloneTubes(tubes) {
  return tubes.map(function(t) { var c = []; for (var i = 0; i < 4; i++) c.push(t[i] || 'transparent'); c.cap = 4; return c; });
}
function applyMove(tubes, move) {
  var next = cloneTubes(tubes);
  var src = next[move.from], dst = next[move.to];
  var top = getTop(src); if (!top) return next;
  var run = countRun(src, top.idx, top.color);
  var space = countSpace(dst);
  var cnt = Math.min(run, space);
  if (cnt <= 0) return next;
  var color = top.color;
  var rm = 0; for (var i = 3; i >= 0 && rm < cnt; i--) if (src[i] === color) { src[i] = 'transparent'; rm++; }
  var ad = 0; for (var i = 0; i < 4 && ad < rm; i++) if (dst[i] === 'transparent') { dst[i] = color; ad++; }
  return next;
}
function getScoredMoves(tubes) {
  var moves = [];
  for (var f = 0; f < tubes.length; f++) {
    var top = getTop(tubes[f]); if (!top) continue;
    var run = countRun(tubes[f], top.idx, top.color);
    for (var t = 0; t < tubes.length; t++) {
      if (f === t) continue;
      var dtop = getTop(tubes[t]);
      if (dtop && dtop.color !== top.color) continue;
      var space = countSpace(tubes[t]); if (space <= 0) continue;
      var cnt = Math.min(run, space);
      // Score
      var next = applyMove(tubes, {from: f, to: t, count: cnt, color: top.color});
      var score = cnt * 10;
      var srcPure = true; for (var i = 1; i < 4; i++) if (next[f][i] !== next[f][0]) { srcPure = false; break; }
      if (srcPure && next[f][0] !== 'transparent') score += 200;
      var dstPure = true; for (var i = 1; i < 4; i++) if (next[t][i] !== next[t][0]) { dstPure = false; break; }
      if (dstPure && next[t][0] !== 'transparent') score += 300;
      if (dtop && dtop.color === top.color) score += 100;
      if (!dtop) score -= 20;
      moves.push({from: f, to: t, count: cnt, color: top.color, score: score});
    }
  }
  moves.sort(function(a, b) { return b.score - a.score; });
  return moves;
}

// DFS solver
var MAX_NODES = 500000;
var MAX_DEPTH = 200;

function dfsSolve(tubes) {
  var startKey = stateKey(tubes);
  var visited = {}; visited[startKey] = true;
  var nodeCount = 0, found = null;

  function dfs(cur, depth, path) {
    nodeCount++;
    if (nodeCount > MAX_NODES || depth > MAX_DEPTH) return false;
    if (isWin(cur)) { found = path.slice(); return true; }

    var moves = getScoredMoves(cur);
    for (var mi = 0; mi < moves.length; mi++) {
      var move = moves[mi];
      var next = applyMove(cur, move);
      var nk = stateKey(next);
      if (visited.hasOwnProperty(nk)) continue;
      visited[nk] = true;
      // Use a simple move format for the solution
      path.push({from: move.from, to: move.to});
      if (dfs(next, depth + 1, path)) return true;
      path.pop();
    }
    return false;
  }

  dfs(tubes, 0, []);
  return found;
}

// Generate a random level
function generateRandomLevel(seedStr) {
  var colors = COLORS.slice(0, 8); // 8 colors
  var cap = 4, emptyTubes = 2;

  // Build list of all layers
  var allLayers = [];
  for (var ci = 0; ci < colors.length; ci++) {
    for (var r = 0; r < cap; r++) allLayers.push(colors[ci]);
  }

  // Seeded shuffle
  var s = seedStr;
  for (var i = allLayers.length - 1; i > 0; i--) {
    var x = Math.sin(s * (i + 1) * 127.1 + 311.7) * 43758.5453;
    var j = Math.floor((x - Math.floor(x)) * (i + 1));
    var tmp = allLayers[i]; allLayers[i] = allLayers[j]; allLayers[j] = tmp;
    s += 1;
  }

  // Distribute into color tubes
  var tubes = [];
  var idx = 0;
  for (var ci = 0; ci < colors.length; ci++) {
    var tube = [];
    for (var l = 0; l < cap; l++) tube.push(allLayers[idx++]);
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

  // Convert to hex
  var hex = tubes.map(function(tube) {
    var h = '';
    for (var l = 0; l < 4; l++) {
      var c = tube[l] || 'transparent';
      if (c === 'transparent') h += 'f';
      else h += COLORS.indexOf(c).toString(16);
    }
    return h;
  }).join(',');

  return { hex: hex, tubes: tubes };
}

// Main
var dataPath = path.join(__dirname, '..', 'js', 'challenge_data.js');
var dataContent = fs.readFileSync(dataPath, 'utf-8');
var hexPattern = /"([0-9a-f,]+)"/g;
var hexStrs = [], m;
while ((m = hexPattern.exec(dataContent)) !== null) hexStrs.push(m[1]);

var solPath = path.join(__dirname, '..', 'js', 'challenge_solutions.js');
var solContent = fs.readFileSync(solPath, 'utf-8');
var solMatch = solContent.match(/GameGlobal\.CHALLENGE_SOLUTIONS\s*=\s*(\[[\s\S]*\]);/);
var solutions = JSON.parse(solMatch[1]);

for (var fi = 0; fi < failedLevels.length; fi++) {
  var idx = failedLevels[fi];
  var found = false;

  for (var attempt = 0; attempt < 100 && !found; attempt++) {
    var seed = idx * 10000 + attempt * 137;
    var gen = generateRandomLevel(seed);

    // Skip if already winning
    if (isWin(gen.tubes)) continue;

    // Try to solve
    var path = dfsSolve(gen.tubes);
    if (path && path.length > 0) {
      hexStrs[idx] = gen.hex;
      var solStr = path.map(function(mv) { return mv.from + ',' + mv.to; }).join(',');
      solutions[idx] = [solStr];
      found = true;
      console.log('L' + (idx + 1) + ': Fixed! ' + path.length + ' moves, ' + gen.tubes.length + ' tubes (attempt ' + (attempt + 1) + ')');
    }
  }

  if (!found) {
    console.log('L' + (idx + 1) + ': FAILED to generate solvable level after 100 attempts');
  }
}

// Write challenge_data.js
var newData = '// Pre-generated 240 challenge levels (hex-encoded)\n' +
  '// Format: each string is comma-separated 4-char hex tubes\n' +
  '// hex digit 0-f = color index, f = transparent\n' +
  '// Always 2 empty tubes at the end\n' +
  'GameGlobal.CHALLENGE_DATA = [\n';
for (var i = 0; i < hexStrs.length; i++) {
  newData += '  "' + hexStrs[i] + '"';
  if (i < hexStrs.length - 1) newData += ',';
  newData += '\n';
}
newData += '];\n';
fs.writeFileSync(dataPath, newData, 'utf-8');
console.log('Updated challenge_data.js');

// Write challenge_solutions.js
var compact = JSON.stringify(solutions, null, 2);
var newSol = '// Pre-computed solution paths for all ' + hexStrs.length + ' challenge levels\n' +
  '// Format: each level is an array of 1-2 move strings\n' +
  '// Each move string: "f1,t1,f2,t2,..." where f=fromIndex, t=toIndex\n' +
  '// Multiple paths = alternative strategies; random one chosen at runtime\n' +
  '// Empty array = no solution found\n' +
  'GameGlobal.CHALLENGE_SOLUTIONS = ' + compact + ';\n';
fs.writeFileSync(solPath, newSol, 'utf-8');
console.log('Updated challenge_solutions.js');
