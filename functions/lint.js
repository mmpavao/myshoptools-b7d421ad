const { execSync } = require('child_process');

try {
  console.log('Running ESLint...');
  execSync('npx eslint --ext .js,.ts .', { stdio: 'inherit' });
  console.log('ESLint completed successfully.');
} catch (error) {
  console.error('ESLint found issues.');
  process.exit(1);
}