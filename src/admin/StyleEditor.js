import React, { useState, useEffect } from 'react';

const StyleEditor = ({ style = {}, onChange = () => {} }) => {
  const [localStyle, setLocalStyle] = useState(style);
  const [activeTab, setActiveTab] = useState('spacing');
  const [linkedSpacing, setLinkedSpacing] = useState(false);

  useEffect(() => {
    setLocalStyle(style);
  }, [style]);

  const handleStyleChange = (property, value) => {
    let cleanValue = value;
    if (typeof value === 'string') {
      cleanValue = value.trim();
    }
    
    const updated = { ...localStyle, [property]: cleanValue };
    Object.keys(updated).forEach(key => {
      if (updated[key] === undefined || updated[key] === null || updated[key] === '') {
        delete updated[key];
      }
    });
    
    setLocalStyle(updated);
    onChange(updated);
  };

  const handleMultipleStyleChanges = (styleObject) => {
    const updated = { ...localStyle, ...styleObject };
    Object.keys(updated).forEach(key => {
      if (updated[key] === undefined || updated[key] === null || updated[key] === '') {
        delete updated[key];
      }
    });
    setLocalStyle(updated);
    onChange(updated);
  };

  const parseValue = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  };

  const getUnitValue = (value) => {
    if (!value) return '0';
    const match = String(value).match(/^([\d.-]+)/);
    return match ? match[1] : value;
  };

  const getUnit = (value) => {
    if (!value) return 'px';
    const match = String(value).match(/([a-z%]+)$/i);
    return match ? match[1] : 'px';
  };

  const applyFullWidth = () => {
    handleStyleChange('width', '100%');
  };

  const applyFlexCenter = () => {
    handleMultipleStyleChanges({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    });
  };

  const applyCardStyle = () => {
    handleMultipleStyleChanges({
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    });
  };

  const resetStyles = () => {
    setLocalStyle({});
    onChange({});
  };

  const SliderControl = ({ label, property, min = 0, max = 100, step = 1, unit = 'px' }) => {
    const value = localStyle[property] || '';
    const numValue = parseValue(value);
    return (
      <div style={sliderControlStyle}>
        <label style={labelStyle}>{label}</label>
        <div style={sliderContainerStyle}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numValue || 0}
            onChange={(e) => handleStyleChange(property, e.target.value + unit)}
            style={rangeInputStyle}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleStyleChange(property, e.target.value)}
            placeholder={`0${unit}`}
            style={textInputStyle}
          />
        </div>
      </div>
    );
  };

  const TextInput = ({ label, property, placeholder = '' }) => {
    const value = localStyle[property] || '';
    return (
      <div style={controlStyle}>
        <label style={labelStyle}>{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleStyleChange(property, e.target.value)}
          placeholder={placeholder}
          style={textInputStyle}
        />
      </div>
    );
  };

  const NumberInput = ({ label, property, min, max, placeholder = '' }) => {
    const value = localStyle[property] || '';
    return (
      <div style={controlStyle}>
        <label style={labelStyle}>{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => handleStyleChange(property, e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          style={textInputStyle}
        />
      </div>
    );
  };

  const ColorControl = ({ label, property }) => {
    const value = localStyle[property] || '';
    const colorValue = value && value.startsWith('#') ? value : '#000000';
    return (
      <div style={controlStyle}>
        <label style={labelStyle}>{label}</label>
        <div style={colorInputContainerStyle}>
          <input
            type="color"
            value={colorValue}
            onChange={(e) => handleStyleChange(property, e.target.value)}
            style={colorPickerStyle}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleStyleChange(property, e.target.value)}
            placeholder="#000000"
            style={{ ...textInputStyle, flex: 1 }}
          />
        </div>
      </div>
    );
  };

  const SelectControl = ({ label, property, options }) => {
    const value = localStyle[property] || '';
    return (
      <div style={controlStyle}>
        <label style={labelStyle}>{label}</label>
        <select
          value={value}
          onChange={(e) => handleStyleChange(property, e.target.value)}
          style={selectStyle}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  };

  const ButtonGroup = ({ label, property, options }) => {
    const value = localStyle[property] || '';
    return (
      <div style={controlStyle}>
        <label style={labelStyle}>{label}</label>
        <div style={buttonGroupContainerStyle}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleStyleChange(property, opt)}
              style={{
                ...buttonGroupItemStyle,
                ...(value === opt ? buttonGroupItemActiveStyle : {})
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SpacingTab = () => (
    <div style={tabContentStyle}>
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Margin</h3>
        <div style={toggleContainerStyle}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={linkedSpacing}
              onChange={(e) => setLinkedSpacing(e.target.checked)}
              style={checkboxStyle}
            />
            Link all sides
          </label>
        </div>
        {linkedSpacing ? (
          <SliderControl label="All Sides" property="margin" max={100} unit="px" />
        ) : (
          <>
            <SliderControl label="Top" property="marginTop" max={100} unit="px" />
            <SliderControl label="Right" property="marginRight" max={100} unit="px" />
            <SliderControl label="Bottom" property="marginBottom" max={100} unit="px" />
            <SliderControl label="Left" property="marginLeft" max={100} unit="px" />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Padding</h3>
        {linkedSpacing ? (
          <SliderControl label="All Sides" property="padding" max={100} unit="px" />
        ) : (
          <>
            <SliderControl label="Top" property="paddingTop" max={100} unit="px" />
            <SliderControl label="Right" property="paddingRight" max={100} unit="px" />
            <SliderControl label="Bottom" property="paddingBottom" max={100} unit="px" />
            <SliderControl label="Left" property="paddingLeft" max={100} unit="px" />
          </>
        )}
      </div>
    </div>
  );

  const TypographyTab = () => (
    <div style={tabContentStyle}>
      <SliderControl label="Font Size" property="fontSize" min={8} max={72} unit="px" />
      <SelectControl 
        label="Font Weight" 
        property="fontWeight" 
        options={['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']}
      />
      <SliderControl label="Line Height" property="lineHeight" min={0.8} max={3} step={0.1} unit="" />
      <SliderControl label="Letter Spacing" property="letterSpacing" min={-2} max={10} unit="px" />
      <ButtonGroup 
        label="Text Align" 
        property="textAlign" 
        options={['left', 'center', 'right', 'justify']}
      />
      <SelectControl 
        label="Text Transform" 
        property="textTransform" 
        options={['none', 'uppercase', 'lowercase', 'capitalize']}
      />
      <SelectControl 
        label="Text Decoration" 
        property="textDecoration" 
        options={['none', 'underline', 'line-through']}
      />
    </div>
  );

  const ColorsTab = () => (
    <div style={tabContentStyle}>
      <ColorControl label="Color" property="color" />
      <ColorControl label="Background" property="background" />
      <ColorControl label="Border Color" property="borderColor" />
      <SliderControl label="Opacity" property="opacity" min={0} max={1} step={0.01} unit="" />
    </div>
  );

  const LayoutTab = () => {
    const display = localStyle.display || '';
    return (
      <div style={tabContentStyle}>
        <SelectControl 
          label="Display" 
          property="display" 
          options={['block', 'inline-block', 'inline', 'flex', 'grid', 'none']}
        />
        <SelectControl 
          label="Position" 
          property="position" 
          options={['static', 'relative', 'absolute', 'fixed', 'sticky']}
        />
        <TextInput label="Width" property="width" placeholder="auto" />
        <TextInput label="Height" property="height" placeholder="auto" />
        <TextInput label="Max Width" property="maxWidth" placeholder="none" />
        <TextInput label="Max Height" property="maxHeight" placeholder="none" />
        <SelectControl 
          label="Overflow" 
          property="overflow" 
          options={['visible', 'hidden', 'scroll', 'auto']}
        />
        <NumberInput label="Z-Index" property="zIndex" min={0} max={9999} />

        {display === 'flex' && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Flexbox</h3>
            <ButtonGroup 
              label="Flex Direction" 
              property="flexDirection" 
              options={['row', 'column', 'row-reverse', 'column-reverse']}
            />
            <ButtonGroup 
              label="Justify Content" 
              property="justifyContent" 
              options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']}
            />
            <ButtonGroup 
              label="Align Items" 
              property="alignItems" 
              options={['flex-start', 'center', 'flex-end', 'stretch', 'baseline']}
            />
            <SliderControl label="Gap" property="gap" max={100} unit="px" />
          </div>
        )}

        {display === 'grid' && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Grid</h3>
            <TextInput label="Grid Columns" property="gridTemplateColumns" placeholder="1fr 1fr" />
            <TextInput label="Grid Rows" property="gridTemplateRows" placeholder="auto" />
            <SliderControl label="Gap" property="gap" max={100} unit="px" />
          </div>
        )}
      </div>
    );
  };

  const AdvancedTab = () => (
    <div style={tabContentStyle}>
      <div style={controlStyle}>
        <label style={labelStyle}>Border</label>
        <SliderControl label="Border Width" property="borderWidth" max={10} unit="px" />
        <SelectControl 
          label="Border Style" 
          property="borderStyle" 
          options={['solid', 'dashed', 'dotted', 'double', 'none']}
        />
        <SliderControl label="Border Radius" property="borderRadius" max={50} unit="px" />
      </div>

      <div style={controlStyle}>
        <label style={labelStyle}>Shadow</label>
        <TextInput label="Box Shadow" property="boxShadow" placeholder="0 2px 8px rgba(0,0,0,0.1)" />
      </div>

      <div style={controlStyle}>
        <label style={labelStyle}>Custom CSS</label>
        <textarea
          value={localStyle.__customCss || ''}
          onChange={(e) => handleStyleChange('__customCss', e.target.value)}
          placeholder="Enter custom CSS properties (property: value;)"
          style={textareaStyle}
        />
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={tabsContainerStyle}>
        {['spacing', 'typography', 'colors', 'layout', 'advanced'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...tabButtonStyle,
              ...(activeTab === tab ? tabButtonActiveStyle : {})
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={contentWrapperStyle}>
        {activeTab === 'spacing' && <SpacingTab />}
        {activeTab === 'typography' && <TypographyTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
      </div>

      <div style={utilitiesContainerStyle}>
        <button onClick={applyFullWidth} style={utilityButtonStyle}>Full Width</button>
        <button onClick={applyFlexCenter} style={utilityButtonStyle}>Center (Flex)</button>
        <button onClick={applyCardStyle} style={utilityButtonStyle}>Card Style</button>
        <button onClick={resetStyles} style={{ ...utilityButtonStyle, ...resetButtonStyle }}>Reset Styles</button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '14px',
  color: '#1f2937'
};

const tabsContainerStyle = {
  display: 'flex',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  padding: '0'
};

const tabButtonStyle = {
  flex: 1,
  padding: '12px 16px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#6b7280',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '13px',
  transition: 'all 150ms ease-in-out',
  borderBottom: '2px solid transparent'
};

const tabButtonActiveStyle = {
  color: '#2563eb',
  borderBottomColor: '#2563eb',
  backgroundColor: '#eff6ff'
};

const contentWrapperStyle = {
  flex: 1,
  overflowY: 'auto',
  maxHeight: '500px',
  padding: '20px'
};

const tabContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb'
};

const sectionTitleStyle = {
  margin: '0',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  color: '#6b7280',
  letterSpacing: '0.5px'
};

const controlStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const sliderControlStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const sliderContainerStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151'
};

const rangeInputStyle = {
  flex: 1,
  height: '6px',
  cursor: 'pointer',
  accentColor: '#2563eb'
};

const textInputStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px',
  color: '#1f2937',
  transition: 'border-color 150ms ease-in-out',
  outline: 'none',
  minWidth: '80px'
};

const colorInputContainerStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
};

const colorPickerStyle = {
  width: '40px',
  height: '40px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  cursor: 'pointer'
};

const selectStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px',
  color: '#1f2937',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  transition: 'border-color 150ms ease-in-out'
};

const buttonGroupContainerStyle = {
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap'
};

const buttonGroupItemStyle = {
  padding: '6px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 150ms ease-in-out'
};

const buttonGroupItemActiveStyle = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderColor: '#2563eb'
};

const toggleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const checkboxStyle = {
  cursor: 'pointer',
  accentColor: '#2563eb'
};

const textareaStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px',
  color: '#1f2937',
  fontFamily: 'monospace',
  minHeight: '100px',
  resize: 'vertical',
  transition: 'border-color 150ms ease-in-out'
};

const utilitiesContainerStyle = {
  display: 'flex',
  gap: '8px',
  padding: '16px 20px',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  flexWrap: 'wrap'
};

const utilityButtonStyle = {
  flex: 1,
  minWidth: '120px',
  padding: '8px 16px',
  border: '1px solid #2563eb',
  borderRadius: '4px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 150ms ease-in-out'
};

const resetButtonStyle = {
  backgroundColor: '#ffffff',
  color: '#ef4444',
  borderColor: '#ef4444'
};

export default StyleEditor;
