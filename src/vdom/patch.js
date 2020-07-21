export function patch (oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    const el = createElm(vnode);
    parentElm.insertBefore(el, oldElm);
    parentElm.removeChild(oldElm);
    return el;
  }
}

function createElm (vnode) {
  const { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updatePrototies(vnode);
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updatePrototies (vnode) {
  const newProps = vnode.data || {};

  const el = vnode.el;
  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[ styleName.trim() ] = newProps.style[ styleName ]
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else if (key !== 'undefined') {
      el.setAttribute(key, newProps[ key ]);
    }
  }
}