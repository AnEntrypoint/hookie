import { useState, useEffect } from 'react';
import * as componentManager from '../lib/componentManager';

export function useComponentEdit(editComponent, owner, repo) {
  const [componentCode, setComponentCode] = useState('');
  const [props, setProps] = useState([]);
  const [description, setDescription] = useState('');
  const [allowedChildren, setAllowedChildren] = useState('all');
  const [specificChildren, setSpecificChildren] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editComponent) {
      loadEditComponentData();
    }
  }, [editComponent]);

  const loadEditComponentData = async () => {
    try {
      const schema = await componentManager.loadComponentSchema(owner, repo, editComponent.name);
      const code = await componentManager.loadComponentImplementation(owner, repo, editComponent.name);

      setDescription(schema.description || '');
      setComponentCode(code);

      const propsArray = Object.entries(schema.props || {}).map(([name, config]) => ({
        name,
        type: config.type,
        required: config.required || false,
        default: config.default || '',
        enum: config.enum?.join(', ') || '',
        options: config.options?.join(', ') || ''
      }));
      setProps(propsArray);

      if (schema.allowedChildren?.length === 0) {
        setAllowedChildren('none');
      } else if (schema.allowedChildren && schema.allowedChildren[0] !== '*') {
        setAllowedChildren('specific');
        setSpecificChildren(schema.allowedChildren);
      }
    } catch (err) {
      setError(`Failed to load component: ${err.message}`);
    }
  };

  return {
    componentCode, setComponentCode,
    props, setProps,
    description, setDescription,
    allowedChildren, setAllowedChildren,
    specificChildren, setSpecificChildren,
    error, setError
  };
}
