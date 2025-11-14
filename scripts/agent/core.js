/*
 Minimal agent-core helpers (no external deps).
 Purpose: give agents a tiny API to read JSON twins, enforce boundaries,
 run checks, gate Quick Mode, and generate small role briefs.
*/

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// -------- Filesystem helpers --------

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function findFile(candidates) {
  for (const c of candidates) {
    if (exists(c)) return c;
  }
  return null;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, json, 'utf8');
}

// -------- Loaders (auto-detect locations) --------

function loadState() {
  const file = findFile([
    path.join('docs', 'agents', 'state.json'),
    'state.json',
  ]);
  if (!file) throw new Error('state.json not found (docs/agents/state.json or state.json)');
  return { file, data: readJson(file) };
}

function saveState(next) {
  const { file } = loadState();
  writeJson(file, next);
  return file;
}

function loadCommands() {
  const file = findFile([
    path.join('docs', 'commands.json'),
    'commands.json',
  ]);
  if (!file) throw new Error('commands.json not found');
  const { commands } = readJson(file);
  return { file, commands };
}

function loadStructureRules() {
  const file = findFile([
    path.join('docs', 'structure.rules.json'),
    'structure.rules.json',
  ]);
  if (!file) throw new Error('structure.rules.json not found');
  const rules = readJson(file);
  return { file, rules };
}

function loadQuickConfig() {
  const file = findFile([
    path.join('docs', 'agents', 'quick.config.json'),
    path.join('docs', 'quick.config.json'),
    'quick.config.json',
  ]);
  if (!file) throw new Error('quick.config.json not found');
  const cfg = readJson(file);
  return { file, cfg };
}

function loadTechStack() {
  const file = findFile([
    path.join('docs', 'tech_stack.json'),
    'tech_stack.json',
  ]);
  if (!file) return { file: null, stack: null };
  const stack = readJson(file);
  return { file, stack };
}

// -------- Structure helpers --------

function moduleForPath(filePath, rules) {
  const normalized = filePath.split(path.sep).join('/');
  let best = null;
  for (const m of rules.modules || []) {
    const root = (m.root || '').replace(/\\/g, '/');
    if (!root) continue;
    if (normalized === root || normalized.startsWith(root + '/')) {
      if (!best || root.length > best.root.length) {
        best = { name: m.name, root };
      }
    }
  }
  return best ? best.name : null;
}

function listImportsTS(filePath) {
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
  if (!exts.includes(path.extname(filePath))) return [];
  let src = '';
  try { src = fs.readFileSync(filePath, 'utf8'); } catch { return []; }
  const results = [];
  const importRe = /import\s+(?:[^'";]+?\s+from\s+)?['\"]([^'\"]+)['\"]/g;
  const requireRe = /require\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  let m;
  while ((m = importRe.exec(src))) results.push(m[1]);
  while ((m = requireRe.exec(src))) results.push(m[1]);
  return results;
}

function resolveImportModule(fromFile, imp, rules) {
  // External module or alias → ignore boundary check
  if (!imp.startsWith('.') && !imp.startsWith('/')) return null;
  const base = path.dirname(fromFile);
  let target = path.normalize(path.join(base, imp));
  // We don’t resolve extensions; for module mapping we only need the root prefix.
  return moduleForPath(target, rules);
}

function enforceBoundaries(changedFiles, rules) {
  const violations = [];
  for (const file of changedFiles) {
    const fromMod = moduleForPath(file, rules) || 'unknown';
    const allowed = rules.allow && rules.allow[fromMod];
    if (!allowed) continue; // unknown modules not enforced here
    const imports = listImportsTS(file);
    for (const imp of imports) {
      const toMod = resolveImportModule(file, imp, rules);
      if (!toMod || toMod === fromMod) continue;
      if (!allowed.includes(toMod)) {
        violations.push({ file, import: imp, from: fromMod, to: toMod, rule: `${fromMod} may import only [${allowed.join(', ')}]` });
      }
    }
  }
  return { ok: violations.length === 0, violations };
}

// -------- Quick Mode gating --------

function countAddedLinesFromPatch(unifiedPatch) {
  const lines = unifiedPatch.split(/\r?\n/);
  let count = 0;
  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) continue;
    if (line.startsWith('+')) count++;
  }
  return count;
}

function quickGateFromMetrics(metrics, cfg) {
  const reasons = [];
  const limits = cfg.limits || {};
  if (typeof metrics.filesChanged === 'number' && limits.maxFilesChanged != null) {
    if (metrics.filesChanged > limits.maxFilesChanged) reasons.push(`filesChanged>${limits.maxFilesChanged}`);
  }
  if (typeof metrics.addedLines === 'number' && limits.maxAddedLines != null) {
    if (metrics.addedLines > limits.maxAddedLines) reasons.push(`addedLines>${limits.maxAddedLines}`);
  }
  if (metrics.newFiles && limits.allowNewFiles === false) reasons.push('newFilesNotAllowed');
  if (metrics.renames && limits.allowRenames === false) reasons.push('renamesNotAllowed');
  if (Array.isArray(cfg.allowedPaths) && metrics.changedFiles) {
    for (const f of metrics.changedFiles) {
      const norm = f.split(path.sep).join('/');
      const ok = cfg.allowedPaths.some(p => norm === p || norm.startsWith(p + '/'));
      if (!ok) reasons.push(`pathNotAllowed:${f}`);
    }
  }
  const esc = cfg.escalateIf || {};
  for (const k of ['touchesPublicAPI','addsDependency','touchesMigrations','changesConfig']) {
    if (metrics[k] && esc[k]) reasons.push(`escalate:${k}`);
  }
  return { ok: reasons.length === 0, reasons };
}

// -------- Commands / checks --------

function runCommand(cmd, opts = {}) {
  try {
    const res = cp.spawnSync(cmd, { shell: true, stdio: 'pipe', encoding: 'utf8', cwd: opts.cwd || process.cwd(), timeout: opts.timeout || 0 });
    return { ok: res.status === 0, code: res.status, stdout: res.stdout, stderr: res.stderr };
  } catch (e) {
    return { ok: false, code: -1, stdout: '', stderr: String(e) };
  }
}

function runChecks(commands, opts = {}) {
  const out = {};
  let ok = true;
  for (const key of ['lint','typecheck','test']) {
    if (!commands[key]) continue;
    const r = runCommand(commands[key], opts);
    out[key] = { ok: r.ok, code: r.code };
    if (!r.ok) ok = false;
  }
  out.ok = ok;
  return out;
}

// -------- Brief generation (minimal) --------

function generateBrief({ role, planSlug, files = [], modules = [], includeCommands = true }) {
  const { data: state } = loadState();
  const { rules } = loadStructureRules();
  const cmds = includeCommands ? loadCommands().commands : null;
  const uniqueModules = modules.length ? modules : Array.from(new Set(files.map(f => moduleForPath(f, rules)).filter(Boolean)));
  const parts = [];
  parts.push(`[Brief] Role: ${role}`);
  parts.push(`Plan: ${planSlug || state.plan_slug || 'n/a'}`);
  parts.push(`Branch: ${state.branch || 'n/a'} • Autopilot: ${state.autopilot || 'off'}`);
  parts.push(`State: ${state.state} • Current Role: ${state.current_role}`);
  if (files.length) parts.push(`Files: ${files.join(', ')}`);
  if (uniqueModules.length) {
    parts.push('Structure rules (slice):');
    for (const m of rules.modules) {
      if (!uniqueModules.includes(m.name)) continue;
      const allow = rules.allow && rules.allow[m.name] ? rules.allow[m.name].join(', ') : 'none';
      parts.push(`- ${m.name} @ ${m.root} — allow: [${allow}] — ${m.purpose || ''}`);
    }
  }
  if (cmds) {
    parts.push('Commands:');
    for (const key of ['test','lint','typecheck']) {
      if (cmds[key]) parts.push(`- ${key}: ${cmds[key]}`);
    }
  }
  return parts.join('\n');
}

// -------- Exports --------

module.exports = {
  // IO
  loadState,
  saveState,
  loadCommands,
  loadStructureRules,
  loadQuickConfig,
  loadTechStack,
  // Structure
  moduleForPath,
  enforceBoundaries,
  // Quick Mode
  countAddedLinesFromPatch,
  quickGateFromMetrics,
  // Checks
  runCommand,
  runChecks,
  // Briefs
  generateBrief,
};

