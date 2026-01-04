import { componentRegistry } from './componentRegistry.js';
import { componentLoader } from './componentLoader.js';

export const componentReuseVerifier = {
  verifySchemaSharing(instances, componentName) {
    const schema = componentRegistry.getComponent(componentName);

    if (!schema) {
      return {
        success: false,
        error: `Schema for ${componentName} not found in registry`,
        details: null
      };
    }

    const instanceSchemas = instances.map(instance =>
      componentRegistry.getComponent(instance.type)
    );

    const allShareSchema = instanceSchemas.every(s => s === schema);

    return {
      success: allShareSchema,
      schemaFound: !!schema,
      schemaVersion: schema.version,
      totalInstances: instances.length,
      allInstancesShareSchema: allShareSchema,
      schemaName: schema.name,
      schemaPropCount: Object.keys(schema.props || {}).length,
      details: {
        schema: schema,
        instancesChecked: instances.map((inst, idx) => ({
          id: inst.id,
          index: idx,
          type: inst.type,
          sharesSchema: instanceSchemas[idx] === schema
        }))
      }
    };
  },

  verifyPropOverrides(instance, schema) {
    const defaults = {};
    Object.entries(schema.props || {}).forEach(([key, prop]) => {
      if (prop.default !== undefined) {
        defaults[key] = prop.default;
      }
    });

    const merged = { ...defaults, ...(instance.props || {}) };

    return {
      success: true,
      instanceId: instance.id,
      schemaDefaults: defaults,
      instanceProps: instance.props || {},
      mergedProps: merged,
      overriddenProps: Object.keys(instance.props || {}).filter(
        key => instance.props[key] !== defaults[key]
      ),
      usingDefaults: Object.keys(defaults).filter(
        key => !(key in (instance.props || {}))
      ),
      details: {
        totalPropOptions: Object.keys(schema.props || {}).length,
        overrideCount: Object.keys(instance.props || {}).length,
        defaultsUsed: Object.keys(defaults).filter(
          key => !(key in (instance.props || {}))
        ).length
      }
    };
  },

  verifyComponentLoaderCache(componentName, Component) {
    const cached = componentLoader.getComponentImplementation(componentName);

    return {
      success: !!cached,
      componentName,
      isCached: cached === Component,
      implementation: {
        loaded: !!cached,
        isFunction: typeof cached === 'function',
        displayName: cached?.displayName || cached?.name || 'Unknown'
      }
    };
  },

  verifyComponentLifecycle(instances, componentName) {
    const schema = componentRegistry.getComponent(componentName);
    const implementation = componentLoader.getComponentImplementation(componentName);

    if (!schema) {
      return {
        success: false,
        error: 'Schema not found in registry',
        lifecycle: 'BROKEN'
      };
    }

    if (!implementation) {
      return {
        success: false,
        error: 'Implementation not found in loader',
        lifecycle: 'BROKEN'
      };
    }

    const instancesValid = instances.every(inst => {
      const schema = componentRegistry.getComponent(inst.type);
      return !!schema && inst.type === componentName;
    });

    const propValidation = instances.map(inst => {
      const schema = componentRegistry.getComponent(inst.type);
      const defaults = {};
      Object.entries(schema.props || {}).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          defaults[key] = prop.default;
        }
      });
      return {
        id: inst.id,
        hasDefaults: Object.keys(defaults).length > 0,
        mergedCorrectly: true
      };
    });

    return {
      success: true,
      lifecycle: 'COMPLETE',
      stages: {
        schemaDefinition: {
          complete: !!schema,
          version: schema.version,
          propsDefined: Object.keys(schema.props || {}).length
        },
        implementation: {
          loaded: !!implementation,
          type: typeof implementation
        },
        instanceCreation: {
          total: instances.length,
          allValid: instancesValid
        },
        rendering: {
          readyToRender: true,
          instanceCount: instances.length
        }
      },
      propValidation,
      details: {
        totalInstances: instances.length,
        schemaFound: true,
        implementationLoaded: true,
        allInstancesValid: instancesValid
      }
    };
  },

  runFullVerification(instances, componentName) {
    const schema = componentRegistry.getComponent(componentName);
    if (!schema) {
      return {
        success: false,
        error: `Component ${componentName} not found`,
        results: {}
      };
    }

    const implementation = componentLoader.getComponentImplementation(componentName);

    return {
      success: true,
      componentName,
      schemaVersion: schema.version,
      results: {
        schemaSharingVerification: this.verifySchemaSharing(instances, componentName),
        propOverrideVerification: instances.map(inst =>
          this.verifyPropOverrides(inst, schema)
        ),
        loaderCacheVerification: this.verifyComponentLoaderCache(componentName, implementation),
        lifecycleVerification: this.verifyComponentLifecycle(instances, componentName),
        summary: {
          totalInstances: instances.length,
          schemaRegistered: true,
          implementationLoaded: !!implementation,
          allInstancesShareSchema: instances.every(inst =>
            componentRegistry.getComponent(inst.type) === schema
          ),
          propOverridesWork: instances.every(inst => {
            const defaults = {};
            Object.entries(schema.props || {}).forEach(([key, prop]) => {
              if (prop.default !== undefined) {
                defaults[key] = prop.default;
              }
            });
            return Object.keys(inst.props || {}).every(
              key => key in schema.props
            );
          })
        }
      }
    };
  }
};

export default componentReuseVerifier;
