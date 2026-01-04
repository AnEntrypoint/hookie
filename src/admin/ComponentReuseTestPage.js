import React, { useState, useEffect } from 'react';
import { componentRegistry } from '../lib/componentRegistry.js';
import { componentLoader } from '../lib/componentLoader.js';
import { componentReuseVerifier } from '../lib/componentReuseVerifier.js';
import Card from '../components/Card.js';

const ComponentReuseTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = () => {
    setLoading(true);
    const results = {
      passed: 0,
      failed: 0,
      tests: []
    };

    try {
      const cardSchema = componentRegistry.getComponent('Card');
      const schemaTest = {
        name: 'Schema Registration',
        passed: !!cardSchema,
        error: null,
        details: {}
      };

      if (!cardSchema) {
        schemaTest.passed = false;
        schemaTest.error = 'Card schema not found in registry';
        results.failed++;
        results.tests.push(schemaTest);
        setTestResults({
          ...results,
          successRate: '0'
        });
        setLoading(false);
        return;
      }

      schemaTest.details = {
        found: true,
        version: cardSchema.version,
        propCount: Object.keys(cardSchema.props).length,
        props: Object.keys(cardSchema.props)
      };
      results.passed++;
      results.tests.push(schemaTest);

      componentLoader.registerComponentImplementation('Card', Card);
      const cachedCard = componentLoader.getComponentImplementation('Card');
      const cacheTest = {
        name: 'Component Loader Cache',
        passed: cachedCard === Card,
        error: null,
        details: {
          isCached: cachedCard === Card,
          isFunction: typeof cachedCard === 'function'
        }
      };

      if (cachedCard === Card) {
        results.passed++;
      } else {
        cacheTest.error = 'Component implementation not cached correctly';
        results.failed++;
      }
      results.tests.push(cacheTest);

      const cardInstances = [
        {
          id: 'card-instance-1',
          type: 'Card',
          props: {
            title: 'React Development',
            description: 'Build interactive user interfaces with React components.',
            accentColor: '#3b82f6',
            backgroundColor: '#eff6ff',
            shadowSize: 'medium'
          }
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
          }
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
          }
        }
      ];

      const sharingResult = componentReuseVerifier.verifySchemaSharing(cardInstances, 'Card');
      const sharingTest = {
        name: 'Schema Sharing',
        passed: sharingResult.success,
        error: sharingResult.error,
        details: {
          instancesChecked: sharingResult.totalInstances,
          allShareSchema: sharingResult.allInstancesShareSchema,
          schemaVersion: sharingResult.schemaVersion
        }
      };

      if (sharingResult.success) {
        results.passed++;
      } else {
        results.failed++;
      }
      results.tests.push(sharingTest);

      const propTests = cardInstances.map(inst => {
        const propResult = componentReuseVerifier.verifyPropOverrides(inst, cardSchema);
        return {
          instanceId: inst.id,
          overriddenPropsCount: propResult.overriddenProps.length,
          overriddenProps: propResult.overriddenProps,
          usingDefaults: propResult.usingDefaults
        };
      });

      const propsTest = {
        name: 'Instance Prop Overrides',
        passed: propTests.every(t => t.overriddenPropsCount > 0),
        error: null,
        details: {
          instances: propTests
        }
      };

      if (propsTest.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
      results.tests.push(propsTest);

      const lifecycleResult = componentReuseVerifier.verifyComponentLifecycle(
        cardInstances,
        'Card'
      );
      const lifecycleTest = {
        name: 'Component Lifecycle',
        passed: lifecycleResult.success,
        error: lifecycleResult.error,
        details: {
          stages: Object.keys(lifecycleResult.stages || {})
        }
      };

      if (lifecycleResult.success) {
        results.passed++;
      } else {
        results.failed++;
      }
      results.tests.push(lifecycleTest);

      const fullResults = componentReuseVerifier.runFullVerification(cardInstances, 'Card');
      const fullTest = {
        name: 'Full Verification',
        passed: fullResults.success,
        error: fullResults.error,
        details: {
          component: fullResults.componentName,
          schemaVersion: fullResults.schemaVersion,
          totalInstances: fullResults.results?.summary?.totalInstances,
          allShareSchema: fullResults.results?.summary?.allInstancesShareSchema
        }
      };

      if (fullResults.success) {
        results.passed++;
      } else {
        results.failed++;
      }
      results.tests.push(fullTest);

      setTestResults({
        ...results,
        successRate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(2)
      });
    } catch (error) {
      setTestResults({
        passed: 0,
        failed: 1,
        tests: [{
          name: 'Error',
          passed: false,
          error: error.message,
          details: {}
        }],
        successRate: '0'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{
        marginBottom: '10px',
        color: '#1a202c',
        fontSize: '32px'
      }}>
        Component Reuse Verification Test
      </h1>

      <p style={{
        marginBottom: '30px',
        color: '#475569',
        fontSize: '16px'
      }}>
        Testing the component reuse system to verify schema sharing, prop overrides, caching, and lifecycle management.
      </p>

      {loading ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          Running tests...
        </div>
      ) : testResults ? (
        <div>
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: testResults.passed === testResults.passed + testResults.failed ? '#f0fdf4' : '#fef2f2',
            border: testResults.passed === testResults.passed + testResults.failed ? '1px solid #bbf7d0' : '1px solid #fecaca',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              color: testResults.passed === testResults.passed + testResults.failed ? '#15803d' : '#991b1b'
            }}>
              {testResults.failed === 0 ? '✓ All Tests Passed' : '✗ Some Tests Failed'}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div>
                <div style={{ color: '#64748b' }}>Total Tests</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
                  {testResults.passed + testResults.failed}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Passed</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {testResults.passed}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Failed</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: testResults.failed > 0 ? '#ef4444' : '#64748b' }}>
                  {testResults.failed}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Success Rate</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                  {testResults.successRate}%
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '16px',
              color: '#1a202c'
            }}>
              Test Results
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {testResults.tests.map((test, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  backgroundColor: test.passed ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${test.passed ? '#bbf7d0' : '#fecaca'}`,
                  borderRadius: '6px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      color: test.passed ? '#10b981' : '#ef4444'
                    }}>
                      {test.passed ? '✓' : '✗'}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c'
                    }}>
                      {test.name}
                    </span>
                  </div>

                  {test.error && (
                    <div style={{
                      fontSize: '13px',
                      color: '#991b1b',
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: '#fee2e2',
                      borderRadius: '4px'
                    }}>
                      {test.error}
                    </div>
                  )}

                  {test.details && Object.keys(test.details).length > 0 && (
                    <div style={{
                      fontSize: '13px',
                      color: '#475569',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid ' + (test.passed ? '#bbf7d0' : '#fecaca'),
                      fontFamily: 'monospace'
                    }}>
                      <details>
                        <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Details</summary>
                        <pre style={{
                          marginTop: '8px',
                          padding: '8px',
                          backgroundColor: test.passed ? '#ecfdf5' : '#fef2f2',
                          borderRadius: '4px',
                          overflow: 'auto',
                          fontSize: '12px'
                        }}>
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={runTests}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 200ms'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Run Tests Again
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ComponentReuseTestPage;
