import { execFileSync } from 'node:child_process';

const [base, head] = process.argv.slice(2);
if (!base || !head) throw new Error('Usage: node scripts/check-frontend-scope.mjs <base-ref> <head-ref>');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const mergeBase = git('merge-base', base, head).trim();
// Disable rename detection so moving backend files into UI paths cannot hide deletion.
const paths = git('diff', '--no-renames', '--name-only', '-z', mergeBase, head).split('\0').filter(Boolean);
const allowed = p => ['index.html', 'feedback.md'].includes(p) || ['prototype/', 'assets/', 'frontend/', 'tests/frontend/', 'reports/frontend/'].some(prefix => p.startsWith(prefix));
const blocked = paths.filter(p => !allowed(p));
if (blocked.length) {
  console.error('Frontend scope includes files owned by Tyler:\n' + blocked.map(p => JSON.stringify(p)).join('\n'));
  process.exit(1);
}
console.log('Frontend scope passed (' + paths.length + ' changed files).');
