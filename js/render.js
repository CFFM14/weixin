// ============================================================
// Water Sort Puzzle - Rendering Methods
// Extracted from main.js - assigned to WaterSortGame.prototype
// ============================================================

var WaterSortGame = GameGlobal.WaterSortGame;

// --- Render dispatcher ---
WaterSortGame.prototype.render = function() {
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
  else if (this.screen === 'challenge') this.renderChallenge();
  else if (this.screen === 'speciallevels') this.renderSpecialLevels();
  else if (this.screen === 'blindboxmenu') this.renderBlindBoxMenu();
  else if (this.screen === 'varcapmenu') this.renderVarCapMenu();
};

// --- More Menu Screen ---
WaterSortGame.prototype.renderChallenge = function() {

    var ctx = this.ctx, s = this.scale;
    this.buttonBounds = [];
    var hh = 50 * s;
    ctx.fillStyle = 'rgba(0, 180, 220, 0.5)';
    this.drawRoundRect(0, -10 * s, this.sw, hh + 10 * s, 25 * s); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * s;
    this.drawRoundRect(0, -10 * s, this.sw, hh + 10 * s, 25 * s); ctx.stroke();
    this.drawMusicButton(8 * s, hh / 2 - 14 * s, 28 * s);
    ctx.fillStyle = '#333'; ctx.font = 'bold ' + (20 * s) + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('\u95ef\u5173\u6a21\u5f0f', this.sw / 2, hh / 2 - 5 * s);
    var totalLevels = this._totalLevels, perPage = 8;
    var totalPages = Math.ceil(totalLevels / perPage);
    if (this.challengePage >= totalPages) this.challengePage = totalPages - 1;
    if (this.challengePage < 0) this.challengePage = 0;
    var startIdx = this.challengePage * perPage, endIdx = Math.min(startIdx + perPage, totalLevels);
    var itemH = 55 * s, listY = hh + 15 * s, itemW = this.sw - 40 * s, itemX = 20 * s;
    var rangeLabels = ['\u2b50 1-30','\u2b50\u2b50 31-60','\u2b50\u2b50\u2b50 61-90','\u2728 91-120','\ud83c\udfc5 121-150','\ud83d\udc8e 151-180','\ud83d\udc80 181-210','\ud83d\udd25 211-240'];
    var ri2 = Math.floor(startIdx / 30);
    ctx.fillStyle = '#888'; ctx.font = (11 * s) + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(rangeLabels[ri2] || '', this.sw / 2, listY - 2 * s);
    for (var i = startIdx; i < endIdx; i++) {
      var iy = listY + (i - startIdx) * itemH + 12 * s, locked = i > this._unlockedLevel;
      ctx.fillStyle = locked ? 'rgba(200,200,200,0.5)' : 'rgba(255,255,255,0.85)';
      this.drawRoundRect(itemX, iy, itemW, itemH - 5 * s, 8 * s); ctx.fill();
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1 * s;
      this.drawRoundRect(itemX, iy, itemW, itemH - 5 * s, 8 * s); ctx.stroke();
      ctx.fillStyle = locked ? '#bbb' : '#333';
      ctx.font = 'bold ' + (15 * s) + 'px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var label = '\u7b2c ' + (i + 1) + ' \u5173' + (locked ? ' \ud83d\udd12' : '');
      ctx.fillText(label, this.sw / 2, iy + (itemH - 5 * s) / 2);
      if (!locked) this.buttonBounds.push({ id: 'ch_play_' + i, x: itemX, y: iy, w: itemW, h: itemH - 5 * s });
    }
    var navY = this.sh - 55 * s;
    if (this.challengePage > 0) { this.drawSmallBtn(20 * s, navY, 70 * s, 32 * s, '< \u4e0a\u9875', '#e0e0e0'); this.buttonBounds.push({ id: 'ch_prev', x: 20 * s, y: navY, w: 70 * s, h: 32 * s }); }
    if (this.challengePage < totalPages - 1) { this.drawSmallBtn(this.sw - 90 * s, navY, 70 * s, 32 * s, '\u4e0b\u9875 >', '#e0e0e0'); this.buttonBounds.push({ id: 'ch_next', x: this.sw - 90 * s, y: navY, w: 70 * s, h: 32 * s }); }
    if (totalPages > 1) { ctx.fillStyle = '#888'; ctx.font = (12 * s) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText((this.challengePage + 1) + '/' + totalPages, this.sw / 2, navY + 16 * s); }
    var bw = 100 * s, bh = 38 * s;
    this.drawGameButton((this.sw - bw) / 2, this.sh - 50 * s, bw, bh, '\u2190 \u8fd4\u56de', '#f0b8b8');
    this.buttonBounds.push({ id: 'back_challenge', x: (this.sw - bw) / 2, y: this.sh - 50 * s, w: bw, h: bh });
    ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
  };

// --- Game Screen ---
WaterSortGame.prototype.renderGame = function() {
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

  // +Tube
  var tubeX = hintX + hintW + gap;
  var tubeW = 52 * s;
  this.drawSmallBtn(tubeX, btnY2, tubeW, btnH2, '+管', '#b8d8ff');
  this.buttonBounds.push({ id: 'add_tube', x: tubeX, y: btnY2, w: tubeW, h: btnH2 });

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
};

// --- Rules Screen ---
WaterSortGame.prototype.renderRules = function() {
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
};

// --- Level Select Screen ---
WaterSortGame.prototype.renderLevelSelect = function() {
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
};

// --- Classic Difficulty Menu Screen ---
WaterSortGame.prototype.renderClassicMenu = function() {
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
};

// --- Classic Level List Screen ---
WaterSortGame.prototype.renderClassicLevels = function() {
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
};

// --- Special Levels Menu Screen ---
WaterSortGame.prototype.renderSpecialLevels = function() {
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
};

// --- Blind Box Menu Screen ---
WaterSortGame.prototype.renderBlindBoxMenu = function() {
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
};

// --- Variable Capacity Menu Screen ---
WaterSortGame.prototype.renderVarCapMenu = function() {
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
};

// --- Drawing: Menu Button ---
WaterSortGame.prototype.drawMenuButton = function(x, y, w, h, text) {
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
};

// --- Drawing: Small Button ---
WaterSortGame.prototype.drawSmallBtn = function(x, y, w, h, text, color) {
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
};

// --- Drawing: Game Button ---
WaterSortGame.prototype.drawGameButton = function(x, y, w, h, text, color) {
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
};

// --- Drawing: Tube (THE BIG ONE) ---
WaterSortGame.prototype.drawTube = function(x, y, water, selected, tilt, bump, cap, pivotX, pivotY) {
  var ctx = this.ctx;
  var w = this.tubeW;
  var r = this.tubeRadius;
  cap = cap || this.capOf(water);
  var h = this.waterH * cap + r;
  tilt = tilt || 0;
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
};

// --- Drawing: Transfer Animation (water stream) ---
WaterSortGame.prototype.drawTransferAnim = function() {
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
  var curWLen = curW.length;
  var ad2 = 0;
  for (var ai = 0; ai < curWLen && ad2 < fullAdd2; ai++) {
    if (curW[ai] === 'transparent') { curW[ai] = anim.fromColor; ad2++; }
  }
  var layerH = this.tubeH / 4;
  var surfIdx = -1, surfFrac = 1;
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
};

// --- Drawing: Editor Tube ---
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

// --- Drawing: Music Button ---
WaterSortGame.prototype.drawMusicButton = function(x, y, size) {
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
};

// --- Drawing: Rounded Rectangle Fill ---
WaterSortGame.prototype.drawRoundRect = function(x, y, w, h, r) {
  this.drawRoundRectPath(x, y, w, h, r);
};

// --- Drawing: Rounded Rectangle Path ---
WaterSortGame.prototype.drawRoundRectPath = function(x, y, w, h, r) {
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
};

// --- Text Wrapping ---
WaterSortGame.prototype.wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
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
};

// --- Layout: Calculate Tube Positions ---
WaterSortGame.prototype.calcTubePositions = function(water) {
  var self = this;
  var n = water.length;
  var gap = 20 * this.scale;
  var s = this.scale;
  var defaultH = this.waterH * 4 + this.tubeRadius;

  var tubeHeights = water.map(function(w) {
    return self.waterH * self.capOf(w) + self.tubeRadius;
  });

  var rows, tubesPerRow;
  if (n <= 6) { rows = 2; tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)]; }
  else if (n <= 10) { rows = 2; tubesPerRow = [Math.ceil(n / 2), Math.floor(n / 2)]; }
  else if (n <= 15) { rows = 3; tubesPerRow = [Math.ceil(n / 3), Math.ceil((n - Math.ceil(n / 3)) / 2), n - Math.ceil(n / 3) - Math.ceil((n - Math.ceil(n / 3)) / 2)]; }
  else { rows = 4; var perRow = Math.ceil(n / 4); tubesPerRow = [perRow, perRow, perRow, n - perRow * 3]; }
  tubesPerRow = tubesPerRow.filter(function(x) { return x > 0; });
  rows = tubesPerRow.length;

  var rowMaxH = [], idx = 0;
  for (var r = 0; r < rows; r++) {
    var maxH = 0;
    for (var c = 0; c < tubesPerRow[r]; c++) {
      var th = idx < n ? tubeHeights[idx] : defaultH;
      if (th > maxH) maxH = th;
      idx++;
    }
    rowMaxH.push(maxH);
  }

  var headingH = 50 * s, bottomH = 70 * s, availH = this.sh - headingH - bottomH, rowGap = 25 * s;
  var totalH = 0;
  for (var rr = 0; rr < rows; rr++) totalH += rowMaxH[rr] + (rr > 0 ? rowGap : 0);
  totalH -= rowGap;

  var positions = [], idx2 = 0, curY = headingH + (availH - totalH) / 2;
  for (var r2 = 0; r2 < rows; r2++) {
    var count = tubesPerRow[r2];
    var rowW = count * this.tubeW + (count - 1) * gap;
    var startX = (this.sw - rowW) / 2 + this.tubeW / 2;
    for (var c2 = 0; c2 < count; c2++) {
      var th = idx2 < n ? tubeHeights[idx2] : defaultH;
      var tubeY = curY + rowMaxH[r2] - th; // bottom-align
      positions.push({ x: startX + c2 * (this.tubeW + gap), y: tubeY });
      idx2++;
    }
    curY += rowMaxH[r2] + rowGap;
  }
  return positions;
};

// --- Layout: Calculate Editor Tube Positions ---
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
