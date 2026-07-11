// ============================================================
// Multi-path solution generator for 240 challenge levels
// Uses DFS (memory-efficient) to find 1-2 solution paths per level
// ============================================================

var fs = require('fs');
var path = require('path');

// --- Config ---
var OVERLAP_THRESHOLD = 0.70;
var MAX_DEPTH = 200;
var MAX_VISITED = 2000000;

var COLORS = [
  'red', 'blue', 'yellow', 'green', 'purple',
  'lightgreen', 'lightblue', 'orange', 'brown', 'pink',
  'gray', 'hotpink', 'slate', 'navy', 'magenta', 'darkgray'
];

// ============================================================
// Level parsing
// ============================================================
function parseLevel(hexStr) {
  var tubeHexes = hexStr.split(',');
  var tubes = [];
  for (var t = 0; t < tubeHexes.length; t++) {
    var hex = tubeHexes[t];
    var tube = [];
    for (var l = 0; l < 4; l++) {
      var ci = parseInt(hex.charAt(l), 16);
      tube.push(ci === 15 ? 'transparent' : COLORS[ci]);
    }
    tube.cap = 4;
    tubes.push(tube);
  }
  return tubes;
}

// ============================================================
// State normalization
// ============================================================
function stateKey(tubes) {
  var norm = [];
  for (var t = 0; t < tubes.length; t++) {
    var tube = tubes[t];
    var cap = tube.cap || tube.length || 4;
    var layers = [];
    for (var i = 0; i < cap; i++) {
      layers.push(i < tube.length ? (tube[i] || 'transparent') : 'transparent');
    }
    norm.push(layers.join(','));
  }
  var empty = [], pure = [], rest = [];
  for (var j = 0; j < norm.length; j++) {
    var s = norm[j];
    var layers = s.split(',');
    var allT = true;
    for (var k = 0; k < layers.length; k++) { if (layers[k] !== 'transparent') { allT = false; break; } }
    if (allT) { empty.push(s); continue; }
    var allSame = true, fst = layers[0];
    for (var k2 = 1; k2 < layers.length; k2++) { if (layers[k2] !== fst) { allSame = false; break; } }
    if (allSame) { pure.push(s); }
    else { rest.push(s); }
  }
  return rest.sort().concat(pure.sort()).concat(empty.sort()).join('|');
}

// ============================================================
// Tube helpers
// ============================================================
function getTop(tube) {
  var cap = tube.cap || tube.length || 4;
  for (var i = cap - 1; i >= 0; i--) {
    var c = tube[i] || 'transparent';
    if (c !== 'transparent') return { color: c, idx: i };
  }
  return null;
}

function countRun(tube, topIdx, color) {
  var cnt = 0;
  for (var i = topIdx; i >= 0 && tube[i] === color; i--) cnt++;
  return cnt;
}

function countSpace(tube) {
  var cap = tube.cap || tube.length || 4;
  var cnt = 0;
  for (var i = 0; i < cap; i++) {
    if ((tube[i] || 'transparent') === 'transparent') cnt++;
  }
  return cnt;
}

function isWin(tubes) {
  for (var t = 0; t < tubes.length; t++) {
    var tube = tubes[t], cap = tube.cap || tube.length || 4;
    var first = tube[0] || 'transparent';
    for (var i = 1; i < cap; i++) {
      if ((tube[i] || 'transparent') !== first) return false;
    }
  }
  return true;
}

function cloneTubes(tubes) {
  return tubes.map(function(t) {
    var cap = t.cap || t.length || 4;
    var copy = [];
    for (var i = 0; i < cap; i++) copy.push(t[i] || 'transparent');
    copy.cap = cap;
    return copy;
  });
}

// ============================================================
// Move generation with scoring
// ============================================================
function getScoredMoves(tubes) {
  var moves = [];
  for (var f = 0; f < tubes.length; f++) {
    var src = tubes[f], top = getTop(src);
    if (!top) continue;
    var run = countRun(src, top.idx, top.color);

    for (var t = 0; t < tubes.length; t++) {
      if (f === t) continue;
      var dst = tubes[t], dtop = getTop(dst);
      if (dtop && dtop.color !== top.color) continue;
      var space = countSpace(dst);
      if (space <= 0) continue;
      var cnt = Math.min(run, space);

      // Try the move to score it
      var next = cloneTubes(tubes);
      var ns = next[f], nd = next[t];
      var srcCap = ns.cap || ns.length || 4;
      var dstCap = nd.cap || nd.length || 4;
      var rm2 = 0;
      for (var i = srcCap - 1; i >= 0 && rm2 < cnt; i--) {
        if (ns[i] === top.color) { ns[i] = 'transparent'; rm2++; }
      }
      var ad2 = 0;
      for (var i = 0; i < dstCap && ad2 < rm2; i++) {
        if (nd[i] === 'transparent') { nd[i] = top.color; ad2++; }
      }

      // Score
      var score = rm2 * 10;
      // Bonus if source becomes pure (completed)
      var srcPure = true, srcFst = ns[0];
      for (var j = 1; j < srcCap; j++) { if (ns[j] !== srcFst) { srcPure = false; break; } }
      if (srcPure && srcFst !== 'transparent') score += 200;

      // Bonus if target becomes pure
      var dstPure = true, dstFst = nd[0];
      for (var j = 1; j < dstCap; j++) { if (nd[j] !== dstFst) { dstPure = false; break; } }
      if (dstPure && dstFst !== 'transparent') score += 300;

      // Bonus for pouring onto same color
      if (dtop && dtop.color === top.color) score += 100;

      // Penalty for pouring into empty tube (avoid creating new mixed tubes)
      if (!dtop) score -= 20;

      moves.push({ from: f, to: t, count: cnt, color: top.color, score: score });
    }
  }
  moves.sort(function(a, b) { return b.score - a.score; });
  return moves;
}

function applyMove(tubes, move) {
  var next = cloneTubes(tubes);
  var src = next[move.from], dst = next[move.to];
  var top = getTop(src);
  if (!top) return next;
  var run = countRun(src, top.idx, top.color);
  var space = countSpace(dst);
  var cnt = (typeof move.count === 'number') ? Math.min(move.count, Math.min(run, space)) : Math.min(run, space);
  if (cnt <= 0) return next;
  var color = move.color || top.color;
  var srcCap = src.cap || src.length || 4;
  var dstCap = dst.cap || dst.length || 4;
  var rm = 0;
  for (var i = srcCap - 1; i >= 0 && rm < cnt; i--) {
    if (src[i] === color) { src[i] = 'transparent'; rm++; }
  }
  var ad = 0;
  for (var i = 0; i < dstCap && ad < rm; i++) {
    if (dst[i] === 'transparent') { dst[i] = color; ad++; }
  }
  return next;
}

// ============================================================
// DFS solver — returns array of {from,to} moves, or null
// ============================================================
function dfsSolve(initialTubes, blockedKeys) {
  blockedKeys = blockedKeys || {};
  var startKey = stateKey(initialTubes);
  if (blockedKeys.hasOwnProperty(startKey)) return null;

  var visited = {};
  visited[startKey] = true;
  for (var bk in blockedKeys) {
    if (blockedKeys.hasOwnProperty(bk)) visited[bk] = true;
  }

  var nodeCount = 0;
  var bestPath = null;

  function dfs(tubes, depth, path) {
    nodeCount++;
    if (nodeCount > MAX_VISITED) return false; // exhausted
    if (depth > MAX_DEPTH) return false;

    if (isWin(tubes)) {
      bestPath = path.slice();
      return true; // found!
    }

    var moves = getScoredMoves(tubes);
    for (var mi = 0; mi < moves.length; mi++) {
      var move = moves[mi];
      var next = applyMove(tubes, move);
      var nk = stateKey(next);

      if (visited.hasOwnProperty(nk)) continue;
      visited[nk] = true;

      path.push(move);
      if (dfs(next, depth + 1, path)) return true;
      path.pop();
    }
    return false;
  }

  dfs(initialTubes, 0, []);
  return optimizePath(initialTubes, bestPath);
}

// ============================================================
// Optimize path: remove no-ops, then greedily eliminate ping-pongs
// ============================================================
function optimizePath(initialTubes, path) {
  if (!path) return null;

  // Phase 1: simulate and record all intermediate states
  var states = [cloneTubes(initialTubes)];
  var cur = cloneTubes(initialTubes);
  for (var i = 0; i < path.length; i++) {
    cur = applyMove(cur, path[i]);
    states.push(cloneTubes(cur));
  }

  // Phase 2: greedy shortcut — for each position, try to skip ahead
  var result = [];
  var pos = 0;
  while (pos < path.length) {
    // Try to find a shortcut: jump as far ahead as possible in one move
    var bestJump = pos + 1; // default: just take the next step
    var bestMove = path[pos];

    // Look ahead up to 10 steps to find shortcuts
    var limit = Math.min(pos + 10, path.length);
    for (var j = limit; j > pos; j--) {
      // Can we reach states[j+1] from states[pos] in one move?
      var src = states[pos];
      var tgt = states[j]; // target after j steps (the state we want to reach)

      // Try all possible moves from states[pos]
      var moves = getScoredMoves(src);
      for (var mi = 0; mi < moves.length; mi++) {
        var next = applyMove(src, moves[mi]);
        if (exactKey(next) === exactKey(states[j])) {
          // Found a shortcut! Skip from pos to j in one move
          bestJump = j;
          bestMove = { from: moves[mi].from, to: moves[mi].to };
          break;
        }
      }
      if (bestJump > pos + 1) break; // found a shortcut
    }

    result.push(bestMove);
    pos = bestJump;
  }

  // Phase 3: final simulation to remove any remaining no-ops
  cur = cloneTubes(initialTubes);
  var cleaned = [];
  for (var k = 0; k < result.length; k++) {
    var before = stateKey(cur);
    cur = applyMove(cur, result[k]);
    var after = stateKey(cur);
    if (before !== after) {
      cleaned.push(result[k]);
    }
  }
  return cleaned;
}

// ============================================================
// Exact state key (order-dependent, for precise comparison)
// ============================================================
function exactKey(tubes) {
  return tubes.map(function(t) {
    var cap = t.cap || t.length || 4;
    var layers = [];
    for (var i = 0; i < cap; i++) layers.push(t[i] || 'transparent');
    return layers.join(',');
  }).join('|');
}
// ============================================================
function getPathStates(initialTubes, path) {
  var states = [stateKey(initialTubes)];
  var cur = cloneTubes(initialTubes);
  for (var i = 0; i < path.length; i++) {
    cur = applyMove(cur, path[i]);
    states.push(stateKey(cur));
  }
  return states;
}

// ============================================================
// Compute overlap
// ============================================================
function computeOverlap(statesA, statesB) {
  var setA = {}, setB = {}, common = 0;
  for (var i = 0; i < statesA.length; i++) setA[statesA[i]] = true;
  for (var j = 0; j < statesB.length; j++) {
    var s = statesB[j];
    if (!setB.hasOwnProperty(s)) {
      setB[s] = true;
      if (setA.hasOwnProperty(s)) common++;
    }
  }
  var minSize = Math.min(Object.keys(setA).length, Object.keys(setB).length);
  return minSize > 0 ? common / minSize : 1.0;
}

// ============================================================
// Main
// ============================================================
function main() {
  var dataPath = path.join(__dirname, '..', 'js', 'challenge_data.js');
  var dataContent = fs.readFileSync(dataPath, 'utf-8');

  var hexPattern = /"([0-9a-f,]+)"/g;
  var hexStrs = [], m;
  while ((m = hexPattern.exec(dataContent)) !== null) hexStrs.push(m[1]);

  console.log('Parsed ' + hexStrs.length + ' levels');
  console.log('Using DFS with max ' + MAX_VISITED.toLocaleString() + ' nodes, max depth ' + MAX_DEPTH);

  var allSolutions = [];
  var singleCount = 0, doubleCount = 0, failCount = 0;
  var totalTime = 0;

  for (var i = 0; i < hexStrs.length; i++) {
    var hexStr = hexStrs[i];
    var tubes = parseLevel(hexStr);
    var numTubes = tubes.length;
    var startTime = Date.now();

    // Path A
    var pathA = dfsSolve(tubes);
    if (!pathA) {
      console.log('L' + (i + 1) + ': ✗ NO SOLUTION (' + numTubes + ' tubes)');
      allSolutions.push([]);
      failCount++;
      continue;
    }

    // Path B: block Path A's intermediate states
    var statesA = getPathStates(tubes, pathA);
    var blockedA = {};
    for (var si = 1; si < statesA.length - 1; si++) {
      blockedA[statesA[si]] = true;
    }

    var pathB = dfsSolve(tubes, blockedA);
    var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    totalTime += Date.now() - startTime;

    if (pathB) {
      var statesB = getPathStates(tubes, pathB);
      var overlap = computeOverlap(statesA, statesB);

      var movesA = pathA.map(function(mv) { return mv.from + ',' + mv.to; }).join(',');
      if (overlap <= OVERLAP_THRESHOLD) {
        var movesB = pathB.map(function(mv) { return mv.from + ',' + mv.to; }).join(',');
        allSolutions.push([movesA, movesB]);
        doubleCount++;
        console.log('L' + (i + 1) + ': A=' + pathA.length + ' B=' + pathB.length +
                    ' ovlp=' + (overlap * 100).toFixed(0) + '% ✓2  ' +
                    numTubes + 't  (' + elapsed + 's)');
      } else {
        allSolutions.push([movesA]);
        singleCount++;
        console.log('L' + (i + 1) + ': A=' + pathA.length + '  ovlp=' + (overlap * 100).toFixed(0) +
                    '% →1  ' + numTubes + 't  (' + elapsed + 's)');
      }
    } else {
      var movesA = pathA.map(function(mv) { return mv.from + ',' + mv.to; }).join(',');
      allSolutions.push([movesA]);
      singleCount++;
      console.log('L' + (i + 1) + ': A=' + pathA.length + '  only     ' +
                  numTubes + 't  (' + elapsed + 's)');
    }
  }

  // Write output
  var outPath = path.join(__dirname, '..', 'js', 'challenge_solutions.js');
  var compact = '[\n';
  for (var li = 0; li < allSolutions.length; li++) {
    var sol = allSolutions[li];
    compact += '  ' + JSON.stringify(sol);
    if (li < allSolutions.length - 1) compact += ',';
    compact += '\n';
  }
  compact += ']';

  var output = '// Pre-computed solution paths for all ' + hexStrs.length + ' challenge levels\n' +
    '// Format: each level is an array of 1-2 move strings\n' +
    '// Each move string: "f1,t1,f2,t2,..." where f=fromIndex, t=toIndex\n' +
    '// Multiple paths = alternative strategies; random one chosen at runtime\n' +
    '// Empty array = no solution found\n' +
    'GameGlobal.CHALLENGE_SOLUTIONS = ' + compact + ';\n';

  fs.writeFileSync(outPath, output, 'utf-8');
  console.log('\n========================================');
  console.log('Written to: ' + outPath);
  console.log('Total: ' + hexStrs.length + ' levels');
  console.log('  ' + singleCount + ' with 1 path');
  console.log('  ' + doubleCount + ' with 2 paths');
  console.log('  ' + failCount + ' failed');
  console.log('Total time: ' + (totalTime / 1000).toFixed(0) + 's');
  console.log('========================================');
}

main();
