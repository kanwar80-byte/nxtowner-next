#!/usr/bin/env node
// ================================================
// NXTOWNER CODEBASE AUDIT SCRIPT
// Run this in your VSCode terminal: node codebase-audit.js
// ================================================

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const { red, green, yellow, blue, cyan, bright, reset } = colors;

// Helper functions
const log = {
  header: (text) => console.log(`\n${bright}${cyan}${'='.repeat(60)}${reset}`),
  section: (text) => console.log(`${bright}${blue}\n${text}${reset}`),
  success: (text) => console.log(`${green}✓${reset} ${text}`),
  warning: (text) => console.log(`${yellow}⚠${reset} ${text}`),
  error: (text) => console.log(`${red}✗${reset} ${text}`),
  info: (text) => console.log(`${cyan}ℹ${reset} ${text}`),
};

const issues = {
  critical: [],
  warnings: [],
  info: [],
};

// ================================================
// 1. ENVIRONMENT CONFIGURATION CHECK
// ================================================

function checkEnvironment() {
  log.section('1. CHECKING ENVIRONMENT CONFIGURATION');
  
  const envFiles = ['.env.local', '.env', '.env.example'];
  const foundEnvFiles = envFiles.filter(file => fs.existsSync(file));
  
  if (foundEnvFiles.length === 0) {
    log.error('No .env files found');
    issues.critical.push('Missing environment files');
  } else {
    log.success(`Found env files: ${foundEnvFiles.join(', ')}`);
  }
  
  // Check .env.local for required variables
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        const hasValue = new RegExp(`${varName}=.+`).test(envContent);
        if (hasValue) {
          log.success(`${varName} is set`);
        } else {
          log.error(`${varName} is defined but empty`);
          issues.critical.push(`${varName} has no value`);
        }
      } else {
        log.error(`${varName} is missing`);
        issues.critical.push(`Missing required env var: ${varName}`);
      }
    });
  }
}

// ================================================
// 2. FILE STRUCTURE CHECK
// ================================================

function checkFileStructure() {
  log.section('2. CHECKING FILE STRUCTURE');
  
  const requiredPaths = {
    'package.json': 'Project manifest',
    'next.config.js': 'Next.js configuration',
    'src/app': 'App directory',
    'src/app/page.tsx': 'Homepage component',
    'src/components': 'Components directory',
    'src/lib': 'Utility functions',
    'src/lib/supabase': 'Supabase client',
    'public': 'Static assets',
  };
  
  Object.entries(requiredPaths).forEach(([filePath, description]) => {
    if (fs.existsSync(filePath)) {
      log.success(`${description}: ${filePath}`);
    } else {
      log.error(`Missing: ${description} at ${filePath}`);
      issues.critical.push(`Missing ${description}`);
    }
  });
  
  // Check for common issues
  if (fs.existsSync('package-lock.json') && fs.existsSync('yarn.lock')) {
    log.warning('Both package-lock.json and yarn.lock exist - use one lock file');
    issues.warnings.push('Multiple lock files detected');
  }
}

// ================================================
// 3. PACKAGE.JSON ANALYSIS
// ================================================

function checkPackageJson() {
  log.section('3. ANALYZING PACKAGE.JSON');
  
  if (!fs.existsSync('package.json')) {
    log.error('package.json not found');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check required dependencies
  const requiredDeps = {
    'next': 'Next.js framework',
    'react': 'React library',
    '@supabase/supabase-js': 'Supabase client',
    'typescript': 'TypeScript',
  };
  
  Object.entries(requiredDeps).forEach(([dep, description]) => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      log.success(`${description} installed`);
    } else {
      log.error(`${description} not found in dependencies`);
      issues.critical.push(`Missing dependency: ${dep}`);
    }
  });
  
  // Check scripts
  const requiredScripts = ['dev', 'build', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts?.[script]) {
      log.success(`Script '${script}' defined: ${packageJson.scripts[script]}`);
    } else {
      log.warning(`Script '${script}' not defined`);
      issues.warnings.push(`Missing script: ${script}`);
    }
  });
}

// ================================================
// 4. HOMEPAGE COMPONENT ANALYSIS
// ================================================

function analyzeHomepage() {
  log.section('4. ANALYZING HOMEPAGE COMPONENT');
  
  const homepagePaths = [
    'src/app/page.tsx',
    'app/page.tsx',
    'pages/index.tsx',
  ];
  
  const homepagePath = homepagePaths.find(p => fs.existsSync(p));
  
  if (!homepagePath) {
    log.error('Homepage component not found');
    issues.critical.push('Homepage component missing');
    return;
  }
  
  log.success(`Found homepage at: ${homepagePath}`);
  const homepageContent = fs.readFileSync(homepagePath, 'utf8');
  
  // Check for key features
  const features = {
    'Supabase import': /from ['"]@supabase\/|createClient/,
    'Search functionality': /search|Search/i,
    'Filter functionality': /filter|Filter/i,
    'Asset type toggle': /asset_type|assetType|digital|operational/i,
    'Listings display': /listings|Listings|map\(/,
    'Data fetching': /useEffect|async|await|fetch/,
  };
  
  Object.entries(features).forEach(([feature, pattern]) => {
    if (pattern.test(homepageContent)) {
      log.success(`${feature} implemented`);
    } else {
      log.warning(`${feature} not detected`);
      issues.warnings.push(`Missing: ${feature}`);
    }
  });
  
  // Check for common issues
  if (/console\.log/.test(homepageContent)) {
    log.warning('console.log() statements found - remove for production');
    issues.info.push('Clean up console.log statements');
  }
  
  if (/TODO|FIXME|HACK/.test(homepageContent)) {
    log.warning('TODO/FIXME comments found');
    issues.info.push('Address TODO comments before launch');
  }
}

// ================================================
// 5. SUPABASE CLIENT CHECK
// ================================================

function checkSupabaseClient() {
  log.section('5. CHECKING SUPABASE CLIENT SETUP');
  
  const supabasePaths = [
    'src/lib/supabase/client.ts',
    'src/lib/supabase/client.js',
    'src/utils/supabase/client.ts',
    'lib/supabase.ts',
  ];
  
  const supabasePath = supabasePaths.find(p => fs.existsSync(p));
  
  if (!supabasePath) {
    log.error('Supabase client not found');
    issues.critical.push('Supabase client setup missing');
    return;
  }
  
  log.success(`Found Supabase client at: ${supabasePath}`);
  const supabaseContent = fs.readFileSync(supabasePath, 'utf8');
  
  // Check for proper setup
  if (!/createClient/.test(supabaseContent)) {
    log.error('createClient not found in Supabase setup');
    issues.critical.push('Supabase createClient missing');
  } else {
    log.success('createClient imported/used');
  }
  
  if (!/NEXT_PUBLIC_SUPABASE_URL/.test(supabaseContent)) {
    log.warning('NEXT_PUBLIC_SUPABASE_URL not referenced');
    issues.warnings.push('Check Supabase URL configuration');
  } else {
    log.success('Supabase URL configured');
  }
  
  if (!/NEXT_PUBLIC_SUPABASE_ANON_KEY/.test(supabaseContent)) {
    log.warning('NEXT_PUBLIC_SUPABASE_ANON_KEY not referenced');
    issues.warnings.push('Check Supabase anon key configuration');
  } else {
    log.success('Supabase anon key configured');
  }
}

// ================================================
// 6. SEARCH FOR HARDCODED VALUES
// ================================================

function checkHardcodedValues() {
  log.section('6. CHECKING FOR HARDCODED VALUES');
  
  const srcFiles = getAllFiles('src').filter(f => 
    f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')
  );
  
  const hardcodedPatterns = {
    'API URLs': /https?:\/\/[a-z0-9.-]+\.(supabase\.co|vercel\.app)/gi,
    'Hardcoded IDs': /['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/gi,
    'Database table names': /from\(['"](?!supabase_table)[a-z_]+['"]\)/gi,
  };
  
  let foundIssues = false;
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    Object.entries(hardcodedPatterns).forEach(([name, pattern]) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 2) { // Allow a few for legitimate use
        log.warning(`${name} found in ${file}`);
        foundIssues = true;
      }
    });
  });
  
  if (!foundIssues) {
    log.success('No concerning hardcoded values found');
  }
}

// ================================================
// 7. ROUTING CHECK
// ================================================

function checkRouting() {
  log.section('7. CHECKING ROUTING STRUCTURE');
  
  const appDir = fs.existsSync('src/app') ? 'src/app' : 'app';
  
  if (!fs.existsSync(appDir)) {
    log.error('App directory not found');
    issues.critical.push('No app directory for routing');
    return;
  }
  
  const expectedRoutes = [
    `${appDir}/page.tsx`,
    `${appDir}/listings`,
    `${appDir}/buy`,
    `${appDir}/sell`,
  ];
  
  expectedRoutes.forEach(route => {
    const exists = fs.existsSync(route) || fs.existsSync(route + '.tsx');
    if (exists) {
      log.success(`Route exists: ${route}`);
    } else {
      log.warning(`Route not found: ${route}`);
      issues.warnings.push(`Missing route: ${route}`);
    }
  });
}

// ================================================
// 8. COMPONENT STRUCTURE CHECK
// ================================================

function checkComponents() {
  log.section('8. CHECKING COMPONENT STRUCTURE');
  
  const componentDirs = ['src/components', 'components'];
  const componentDir = componentDirs.find(dir => fs.existsSync(dir));
  
  if (!componentDir) {
    log.error('Components directory not found');
    issues.warnings.push('No components directory');
    return;
  }
  
  log.success(`Components directory: ${componentDir}`);
  
  const expectedComponents = [
    'Navbar',
    'Header',
    'Footer',
    'SearchBar',
    'ListingCard',
    'FilterBar',
  ];
  
  const componentFiles = getAllFiles(componentDir);
  expectedComponents.forEach(comp => {
    const found = componentFiles.some(f => 
      f.includes(comp.toLowerCase()) || f.includes(comp)
    );
    if (found) {
      log.success(`Component found: ${comp}`);
    } else {
      log.warning(`Component not found: ${comp}`);
      issues.info.push(`Consider creating ${comp} component`);
    }
  });
}

// ================================================
// 9. TYPESCRIPT CONFIG CHECK
// ================================================

function checkTypeScriptConfig() {
  log.section('9. CHECKING TYPESCRIPT CONFIGURATION');
  
  if (!fs.existsSync('tsconfig.json')) {
    log.warning('tsconfig.json not found');
    issues.warnings.push('No TypeScript configuration');
    return;
  }
  
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (tsConfig.compilerOptions?.strict) {
    log.success('Strict mode enabled');
  } else {
    log.warning('Strict mode not enabled');
    issues.info.push('Consider enabling strict mode');
  }
  
  if (tsConfig.compilerOptions?.paths) {
    log.success('Path aliases configured');
  } else {
    log.info('No path aliases configured');
  }
}

// ================================================
// 10. SEARCH FUNCTIONALITY ANALYSIS
// ================================================

function analyzeSearchFunctionality() {
  log.section('10. ANALYZING SEARCH FUNCTIONALITY');
  
  const srcFiles = getAllFiles('src').filter(f => 
    f.endsWith('.ts') || f.endsWith('.tsx')
  );
  
  let searchImplementationFound = false;
  let supabaseQueryFound = false;
  
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    if (/search|Search/.test(content)) {
      if (!searchImplementationFound) {
        log.info(`Search-related code found in: ${file}`);
        searchImplementationFound = true;
      }
    }
    
    if (/\.from\(['"]listings['"]\)/.test(content) && /\.(select|eq|ilike)/.test(content)) {
      if (!supabaseQueryFound) {
        log.success(`Supabase query found in: ${file}`);
        supabaseQueryFound = true;
      }
    }
  });
  
  if (!searchImplementationFound) {
    log.warning('No search implementation detected');
    issues.warnings.push('Search functionality may not be implemented');
  }
  
  if (!supabaseQueryFound) {
    log.warning('No Supabase listings query detected');
    issues.warnings.push('Listings data fetching may not be implemented');
  }
}

// ================================================
// HELPER FUNCTIONS
// ================================================

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// ================================================
// MAIN EXECUTION
// ================================================

function runAudit() {
  console.log(bright + cyan);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         NXTOWNER CODEBASE AUDIT - STARTING                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(reset);
  
  checkEnvironment();
  checkFileStructure();
  checkPackageJson();
  analyzeHomepage();
  checkSupabaseClient();
  checkHardcodedValues();
  checkRouting();
  checkComponents();
  checkTypeScriptConfig();
  analyzeSearchFunctionality();
  
  // Summary
  log.header();
  log.section('AUDIT SUMMARY');
  log.header();
  
  console.log(`\n${red}Critical Issues: ${issues.critical.length}${reset}`);
  issues.critical.forEach(issue => log.error(issue));
  
  console.log(`\n${yellow}Warnings: ${issues.warnings.length}${reset}`);
  issues.warnings.forEach(issue => log.warning(issue));
  
  console.log(`\n${cyan}Info: ${issues.info.length}${reset}`);
  issues.info.forEach(issue => log.info(issue));
  
  console.log('\n' + bright + cyan);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              AUDIT COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(reset);
  
  // Exit code
  if (issues.critical.length > 0) {
    process.exit(1);
  }
}

// Run the audit
runAudit();


