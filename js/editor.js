// ============================================================
// Water Sort Puzzle - Editor & My Levels module
// Extracted from main.js - adds editor methods to WaterSortGame.prototype
// ============================================================

var WaterSortGame = GameGlobal.WaterSortGame;

// --- Level Editor ---
WaterSortGame.prototype.openEditor = function() {
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
};

WaterSortGame.prototype.renderEditor = function() {
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
  ctx.fillText('LEVEL EDITOR', this.sw / 2, headingH / 2 - 5 * s);

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
    this.tubeBounds.push({ id: 'etube_' + i, x: leftX, y: p.y, w: this.tubeW, h: this.tubeH });
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
  this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, 'BACK', '#f0b8b8');
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
};

WaterSortGame.prototype.renderValidationPopup = function() {
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
};

WaterSortGame.prototype.renderNamingPopup = function() {
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
};

WaterSortGame.prototype.calcEditorTubePositions = function(n) {
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
};

WaterSortGame.prototype.drawEditorTube = function(x, y, tube, selected) {
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
};

// Validate editor level
WaterSortGame.prototype.validateLevel = function() {
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
};

WaterSortGame.prototype.showValidationPopup = function() {
  var result = this.validateLevel();
  if (result.valid) return true; // All good, proceed

  // Show issues in a popup
  this.validationIssues = result.issues;
  return false;
};

// Editor actions
WaterSortGame.prototype.editorAddTube = function() {
  this.editorTubes.push({ capacity: 4, layers: ['transparent', 'transparent', 'transparent', 'transparent'] });
};

WaterSortGame.prototype.editorRemoveTube = function() {
  if (this.editorTubes.length <= 2) return;
  if (this.editorSelected >= this.editorTubes.length - 1 && this.editorSelected > 0) {
    this.editorSelected--;
  }
  this.editorTubes.pop();
};

WaterSortGame.prototype.editorSetCapacity = function(delta) {
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
};

WaterSortGame.prototype.editorClearTube = function() {
  if (this.editorSelected < 0 || this.editorSelected >= this.editorTubes.length) return;
  var tube = this.editorTubes[this.editorSelected];
  for (var i = 0; i < tube.layers.length; i++) {
    tube.layers[i] = 'transparent';
  }
};

WaterSortGame.prototype.editorFillLayer = function(tubeIndex) {
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
};

WaterSortGame.prototype.editorEraseLayer = function(tubeIndex) {
  if (tubeIndex < 0 || tubeIndex >= this.editorTubes.length) return;
  var tube = this.editorTubes[tubeIndex];
  // Remove from top down: replace last non-transparent with transparent
  for (var i = tube.capacity - 1; i >= 0; i--) {
    if (i < tube.layers.length && tube.layers[i] !== 'transparent') {
      tube.layers[i] = 'transparent';
      return;
    }
  }
};

WaterSortGame.prototype.editorPlay = function() {
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
};

// --- Naming & Save ---
WaterSortGame.prototype.openNaming = function() {
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
};

WaterSortGame.prototype.confirmSave = function() {
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
};

WaterSortGame.prototype.loadSavedLevels = function() {
  try {
    var data = wx.getStorageSync('savedLevels');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

WaterSortGame.prototype.saveSavedLevels = function(levels) {
  wx.setStorageSync('savedLevels', JSON.stringify(levels));
};

WaterSortGame.prototype.deleteSavedLevel = function(id) {
  var levels = this.loadSavedLevels();
  levels = levels.filter(function(l) { return l.id !== id; });
  this.saveSavedLevels(levels);
  // Refresh screen
  this.screen = 'mylevels';
};

WaterSortGame.prototype.playSavedLevel = function(id) {
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
};

// --- My Levels Screen ---
WaterSortGame.prototype.renderMyLevels = function() {
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
  ctx.fillText('MY LEVELS', this.sw / 2, headingH / 2 - 5 * s);

  // Back button
  this.drawSmallBtn(this.sw - 70 * s, headingH / 2 - 15 * s, 60 * s, 30 * s, 'BACK', '#f0b8b8');
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
};
