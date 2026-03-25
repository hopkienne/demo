const PARTS = [
  { key: 'torso', className: 'ant-body' },
  { key: 'head', className: 'ant-head' },
  { key: 'left-arm', className: 'ant-arm ant-arm-left' },
  { key: 'right-arm', className: 'ant-arm ant-arm-right' },
  { key: 'left-leg', className: 'ant-leg ant-leg-left' },
  { key: 'right-leg', className: 'ant-leg ant-leg-right' },
  { key: 'tail', className: 'ant-tail' },
  { key: 'antenna-left', className: 'ant-antenna ant-antenna-left' },
  { key: 'antenna-right', className: 'ant-antenna ant-antenna-right' },
];

function renderPart({ key, className }) {
  return `
    <img
      class="${className}"
      data-part="${key}"
      src="/src/ant/assets/parts/${key}.png"
      alt=""
      aria-hidden="true"
    >
  `;
}

export function createAntRigMarkup() {
  return `
    <div class="ant-rig" aria-hidden="true">
      <div class="ant-target-beam"></div>
      <div class="ant-idle-wrapper">
        ${PARTS.map(renderPart).join('')}
      </div>
    </div>
  `;
}
