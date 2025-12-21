const getSizeValue = (size) => {
  const sizes = {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem'
  };
  return sizes[size] || sizes.base;
};

const getWeight = (weight) => {
  const weights = {
    normal: 400,
    semibold: 600,
    bold: 700
  };
  return weights[weight] || 400;
};

const getLetterSpacing = (size) => {
  const spacing = {
    sm: '-0.2px',
    base: '-0.1px',
    lg: '0px',
    xl: '0px'
  };
  return spacing[size] || '-0.1px';
};

const getLineHeight = (size) => {
  const lineHeights = {
    sm: '1.5',
    base: '1.6',
    lg: '1.7',
    xl: '1.8'
  };
  return lineHeights[size] || '1.6';
};

export default function Text(props) {
  const {
    content = 'Enter text',
    size = 'base',
    color = '#1e293b',
    weight = 'normal',
    align = 'left',
    lineHeight,
    style = {}
  } = props;

  return (
    <p
      style={{
        fontSize: getSizeValue(size),
        color,
        fontWeight: getWeight(weight),
        textAlign: align,
        lineHeight: lineHeight || getLineHeight(size),
        letterSpacing: getLetterSpacing(size),
        wordBreak: 'break-word',
        display: 'block',
        marginTop: 0,
        marginBottom: '20px',
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        ...style
      }}
    >
      {content}
    </p>
  );
}
