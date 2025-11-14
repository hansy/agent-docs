/*
 Example: Quick Mode gating + boundary check using agent-core.
 Usage: node scripts/agent/examples/quick-example.js <changedFile1> [changedFile2 ...]
 This example simulates a small change by listing changed files and a rough added-lines count.
 In a real flow, compute metrics from a unified patch and/or `git diff`.
*/

const core = require('../core');

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/agent/examples/quick-example.js <changedFile1> [changedFile2 ...]');
    process.exit(2);
  }
  const changedFiles = args;

  // 1) Quick Mode gate
  const { cfg } = core.loadQuickConfig();
  const metrics = {
    changedFiles,
    filesChanged: changedFiles.length,
    addedLines: 10, // placeholder for demo
    newFiles: false,
    renames: false,
  };
  const gate = core.quickGateFromMetrics(metrics, cfg);
  if (!gate.ok) {
    console.log('ESCALATE to Feature Mode:', gate.reasons.join(', '));
    process.exit(0);
  }

  // 2) Boundary checks (requires files to exist on disk)
  const { rules } = core.loadStructureRules();
  const boundaries = core.enforceBoundaries(changedFiles, rules);
  if (!boundaries.ok) {
    console.log('Boundary violations:');
    for (const v of boundaries.violations) {
      console.log(`- ${v.file}: ${v.from} → ${v.to} via ${v.import} (${v.rule})`);
    }
    process.exit(1);
  }

  // 3) Generate a tiny brief for the Coder
  const brief = core.generateBrief({ role: 'CODER', files: changedFiles });
  console.log('\n--- Brief ---\n' + brief + '\n');

  // 4) Run checks
  const { commands } = core.loadCommands();
  const checks = core.runChecks(commands);
  console.log('Checks:', checks);
  if (!checks.ok) process.exit(1);
}

main();

