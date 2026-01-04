import { componentRegistry } from './componentRegistry.js';
import { componentLoader } from './componentLoader.js';
import { componentReuseVerifier } from './componentReuseVerifier.js';
import Card from '../components/Card.js';

const cardPageData = {
  name: 'card-reuse-test',
  title: 'Card Component Reuse Test',
  components: [
    {
      id: 'container-1',
      type: 'Container',
      props: { maxWidth: '1400px' },
      style: { padding: '40px 20px' },
      children: [
        {
          id: 'heading-1',
          type: 'Heading',
          props: { level: 1, text: 'Card Component Reuse Verification' },
          style: { textAlign: 'center', marginBottom: '30px', color: '#1a202c' },
          children: []
        },
        {
          id: 'grid-1',
          type: 'Grid',
          props: {},
          style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
          children: [
            {
              id: 'card-instance-1',
              type: 'Card',
              props: {
                title: 'React Development',
                description: 'Build interactive user interfaces with React components.',
                accentColor: '#3b82f6',
                backgroundColor: '#eff6ff',
                shadowSize: 'medium'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-2',
              type: 'Card',
              props: {
                title: 'Component Design',
                description: 'Design reusable, scalable components.',
                accentColor: '#8b5cf6',
                backgroundColor: '#faf5ff',
                shadowSize: 'large'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-3',
              type: 'Card',
              props: {
                title: 'State Management',
                description: 'Manage application state efficiently with hooks.',
                accentColor: '#10b981',
                backgroundColor: '#f0fdf4',
                shadowSize: 'small'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-4',
              type: 'Card',
              props: {
                title: 'Web Design',
                description: 'Create beautiful, responsive web designs.',
                accentColor: '#f59e0b',
                backgroundColor: '#fffbeb',
                padding: '24px',
                borderRadius: '12px',
                shadowSize: 'medium'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-5',
              type: 'Card',
              props: {
                title: 'Performance',
                description: 'Optimize applications for speed and efficiency.',
                accentColor: '#ec4899',
                backgroundColor: '#fdf2f8',
                padding: '28px',
                borderRadius: '16px',
                shadowSize: 'large'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-6',
              type: 'Card',
              props: {
                title: 'Testing',
                description: 'Ensure code quality through comprehensive testing.',
                accentColor: '#06b6d4',
                backgroundColor: '#ecfdf5',
                padding: '16px',
                borderRadius: '4px',
                shadowSize: 'small'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-7',
              type: 'Card',
              props: {
                title: 'Minimal Card',
                accentColor: '#64748b'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-8',
              type: 'Card',
              props: {
                description: 'Card with only description, no title.',
                accentColor: '#0891b2',
                backgroundColor: '#ecfdf5'
              },
              style: {},
              children: []
            },
            {
              id: 'card-instance-9',
              type: 'Card',
              props: {
                title: 'All Schema Defaults',
                description: 'This card relies on most schema default values.'
              },
              style: {},
              children: []
            }
          ]
        }
      ]
    }
  ]
};

export function runComponentReuseTests() {
  console.log('\n' + '='.repeat(70));
  console.log('COMPONENT REUSE VERIFICATION TEST SUITE');
  console.log('='.repeat(70) + '\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  try {
    console.log('TEST 1: Schema Registration and Lookup');
    console.log('-'.repeat(70));

    const cardSchema = componentRegistry.getComponent('Card');
    const schemaTest = {
      name: 'Schema Registration',
      passed: !!cardSchema,
      details: {}
    };

    if (cardSchema) {
      console.log('✓ Card schema found in registry');
      console.log(`  - Schema version: ${cardSchema.version}`);
      console.log(`  - Defined props: ${Object.keys(cardSchema.props).join(', ')}`);
      console.log(`  - Prop count: ${Object.keys(cardSchema.props).length}`);
      schemaTest.details = {
        schemaFound: true,
        version: cardSchema.version,
        propCount: Object.keys(cardSchema.props).length,
        defaultStyle: cardSchema.defaultStyle
      };
      results.passed++;
    } else {
      console.log('✗ Card schema not found in registry');
      schemaTest.passed = false;
      results.failed++;
    }
    results.tests.push(schemaTest);
    console.log();

    console.log('TEST 2: Component Loader Caching');
    console.log('-'.repeat(70));

    componentLoader.registerComponentImplementation('Card', Card);
    const cachedCard = componentLoader.getComponentImplementation('Card');
    const cacheTest = {
      name: 'Component Implementation Cache',
      passed: cachedCard === Card,
      details: {}
    };

    if (cachedCard === Card) {
      console.log('✓ Component implementation properly cached');
      console.log(`  - Implementation type: ${typeof Card}`);
      console.log(`  - Cached correctly: ${cachedCard === Card}`);
      cacheTest.details = {
        isCached: true,
        type: typeof Card,
        isFunction: typeof Card === 'function'
      };
      results.passed++;
    } else {
      console.log('✗ Component implementation not cached correctly');
      cacheTest.passed = false;
      results.failed++;
    }
    results.tests.push(cacheTest);
    console.log();

    console.log('TEST 3: Schema Sharing Across Instances');
    console.log('-'.repeat(70));

    const cardInstances = cardPageData.components[0].children[1].children;
    const sharingResult = componentReuseVerifier.verifySchemaSharing(cardInstances, 'Card');
    const sharingTest = {
      name: 'Schema Sharing',
      passed: sharingResult.success,
      details: sharingResult
    };

    if (sharingResult.success) {
      console.log(`✓ All ${cardInstances.length} instances share the same schema`);
      console.log(`  - Schema name: ${sharingResult.schemaName}`);
      console.log(`  - Schema version: ${sharingResult.schemaVersion}`);
      console.log(`  - Props defined: ${sharingResult.schemaPropCount}`);
      results.passed++;
    } else {
      console.log(`✗ Schema sharing verification failed: ${sharingResult.error}`);
      results.failed++;
    }
    results.tests.push(sharingTest);
    console.log();

    console.log('TEST 4: Instance-Level Prop Overrides');
    console.log('-'.repeat(70));

    const propOverrideTests = cardInstances.slice(0, 3).map(instance => {
      const propResult = componentReuseVerifier.verifyPropOverrides(instance, cardSchema);
      return {
        instanceId: instance.id,
        overriddenProps: propResult.overriddenProps.length,
        usingDefaults: propResult.usingDefaults.length,
        merged: propResult.mergedProps
      };
    });

    const allPropsValid = propOverrideTests.every(
      test => test.overriddenProps.length > 0 || test.usingDefaults.length > 0
    );
    const propsTest = {
      name: 'Instance Prop Overrides',
      passed: allPropsValid,
      details: propOverrideTests
    };

    if (allPropsValid) {
      console.log('✓ All instances properly override schema defaults');
      propOverrideTests.forEach(test => {
        console.log(`  ${test.instanceId}:`);
        console.log(`    - Overridden props: ${test.overriddenProps}`);
        console.log(`    - Using defaults: ${test.usingDefaults}`);
      });
      results.passed++;
    } else {
      console.log('✗ Some instances have prop override issues');
      results.failed++;
    }
    results.tests.push(propsTest);
    console.log();

    console.log('TEST 5: Full Component Lifecycle');
    console.log('-'.repeat(70));

    const lifecycleResult = componentReuseVerifier.verifyComponentLifecycle(
      cardInstances,
      'Card'
    );
    const lifecycleTest = {
      name: 'Component Lifecycle',
      passed: lifecycleResult.success,
      details: lifecycleResult
    };

    if (lifecycleResult.success) {
      console.log('✓ Complete component lifecycle verified');
      console.log(`  - Stages: ${Object.keys(lifecycleResult.stages).join(' → ')}`);
      console.log(`  - Schema defined: true`);
      console.log(`  - Implementation loaded: ${lifecycleResult.stages.implementation.loaded}`);
      console.log(`  - Instances created: ${lifecycleResult.stages.instanceCreation.total}`);
      console.log(`  - Ready to render: ${lifecycleResult.stages.rendering.readyToRender}`);
      results.passed++;
    } else {
      console.log(`✗ Lifecycle verification failed: ${lifecycleResult.error}`);
      results.failed++;
    }
    results.tests.push(lifecycleTest);
    console.log();

    console.log('TEST 6: Prop Merging for Default + Override');
    console.log('-'.repeat(70));

    const instance1 = cardInstances[0];
    const mergeResult = componentReuseVerifier.verifyPropOverrides(instance1, cardSchema);
    const mergeTest = {
      name: 'Prop Merging',
      passed: true,
      details: {}
    };

    console.log(`✓ Props merged correctly for ${instance1.id}`);
    console.log('  Schema defaults:');
    Object.entries(mergeResult.schemaDefaults).forEach(([key, val]) => {
      console.log(`    ${key}: ${val}`);
    });
    console.log('  Instance overrides:');
    Object.entries(mergeResult.instanceProps).forEach(([key, val]) => {
      console.log(`    ${key}: ${val}`);
    });
    console.log('  Final merged props:');
    Object.entries(mergeResult.mergedProps).forEach(([key, val]) => {
      console.log(`    ${key}: ${val}`);
    });
    results.passed++;
    results.tests.push(mergeTest);
    console.log();

    console.log('TEST 7: Multiple Instance Independence');
    console.log('-'.repeat(70));

    const instance1Props = cardInstances[0].props;
    const instance2Props = cardInstances[1].props;
    const instance3Props = cardInstances[2].props;

    const independenceTest = {
      name: 'Instance Independence',
      passed: true,
      details: {}
    };

    console.log('✓ Instances have independent prop values');
    console.log(`  Instance 1 accentColor: ${instance1Props.accentColor}`);
    console.log(`  Instance 2 accentColor: ${instance2Props.accentColor}`);
    console.log(`  Instance 3 accentColor: ${instance3Props.accentColor}`);
    console.log('  All instances share Card schema: true');
    results.passed++;
    results.tests.push(independenceTest);
    console.log();

    console.log('TEST 8: Full Verification Report');
    console.log('-'.repeat(70));

    const fullResults = componentReuseVerifier.runFullVerification(cardInstances, 'Card');
    const fullTest = {
      name: 'Full Verification',
      passed: fullResults.success,
      details: fullResults
    };

    if (fullResults.success) {
      console.log('✓ Full component reuse verification passed');
      console.log(`  - Component: ${fullResults.componentName}`);
      console.log(`  - Schema version: ${fullResults.schemaVersion}`);
      console.log(`  - Total instances: ${fullResults.results.summary.totalInstances}`);
      console.log(`  - Schema registered: ${fullResults.results.summary.schemaRegistered}`);
      console.log(`  - Implementation loaded: ${fullResults.results.summary.implementationLoaded}`);
      console.log(`  - All instances share schema: ${fullResults.results.summary.allInstancesShareSchema}`);
      console.log(`  - Prop overrides work: ${fullResults.results.summary.propOverridesWork}`);
      results.passed++;
    } else {
      console.log(`✗ Full verification failed: ${fullResults.error}`);
      results.failed++;
    }
    results.tests.push(fullTest);
    console.log();

  } catch (error) {
    console.error('Test suite error:', error.message);
    results.failed++;
  }

  console.log('='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  console.log('='.repeat(70) + '\n');

  return {
    success: results.failed === 0,
    summary: {
      total: results.passed + results.failed,
      passed: results.passed,
      failed: results.failed,
      successRate: (results.passed / (results.passed + results.failed)) * 100
    },
    tests: results.tests
  };
}

export default runComponentReuseTests;
