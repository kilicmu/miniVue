function sameVnode (a, b) {
  return (
    a.key === b.key && (
      a.tag === b.tag
    )
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key;
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[ i ].key

    map[ key ] = i;
  }
  return map;
}

export function patch (oldVnode, vnode) {
  if (!oldVnode) {
    return createElm(vnode);
  } else {
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) { // 若oldVnode是一个真实节点，首渲染
      const oldElm = oldVnode;
      const parentElm = oldElm.parentNode;
      const el = createElm(vnode);
      parentElm.insertBefore(el, oldElm);
      parentElm.removeChild(oldElm);
      return el;
    } else {
      if (oldVnode.tag !== vnode.tag) {
        const el = oldVnode.el; // 获取真实节点
        oldVnode.el = el.parentNode.replaceChild(createElm(vnode), el);
      }

      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text;
        }
      }

      const el = vnode.el = oldVnode.el;
      updatePrototies(vnode, oldVnode);

      const oldChildren = oldVnode?.children ?? [];
      const newChildren = vnode?.children ?? [];
      if (oldChildren.length && newChildren.length) {
        updateChildren(el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        for (let child of newChildren) {
          el.appendChild(createElm(child));
        }
      } else if (oldChildren.length > 0) {
        el.innerHTML = ''
      }
    }
  }
}

function updateChildren (parentElm, oldChildren, newChildren) {
  let oldKeyToIdx;

  let oldStartIndex = 0,
    oldStartVnode = oldChildren[ oldStartIndex ],
    oldEndIndex = oldChildren.length - 1,
    oldEndVnode = oldChildren[ oldEndIndex ];

  let newStartIndex = 0,
    newStartVnode = newChildren[ newStartIndex ],
    newEndIndex = newChildren.length - 1,
    newEndVnode = newChildren[ newEndIndex ];
  // debugger
  while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[ ++oldStartIndex ];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[ --oldEndIndex ];
    }
    if (sameVnode(oldStartVnode, newStartVnode)) {
      console.log(oldStartVnode, newStartVnode)
      patch(oldStartVnode, newStartVnode); // 复用
      oldStartVnode = oldChildren[ ++oldStartIndex ];
      newStartVnode = newChildren[ ++newStartIndex ];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[ --oldEndIndex ];
      newEndVnode = newChildren[ --newEndIndex ];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[ ++oldStartIndex ];
      newEndVnode = newChildren[ --newEndIndex ];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // debugger
      patch(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[ --oldEndIndex ];
      newStartVnode = newChildren[ ++newStartIndex ];
    } else { // 乱序
      // 通过老key做映射表
      // 在映射表如果有当前newVnode则将那个node移动到oldEndVnode前面
      // 如果没有则新建一个newVnode的节点然后吧这个节点插入到startVnode前
      if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldChildren, oldStartIndex, oldEndIndex);
      let idxInOld = oldKeyToIdx[ newStartVnode.key ]
      if (!idxInOld) {

        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        const vnodeToMove = oldChildren[ idxInOld ];
        oldChildren[ idxInOld ] = undefined;
        console.log("-------", oldStartVnode);
        parentElm.insertBefore(vnodeToMove.el, oldStartVnode.el);
        patch(vnodeToMove, newStartVnode);
      }
      newStartVnode = newChildren[ ++newStartIndex ];
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; ++i) {
      // parentElm.appendChild(createElm(newChildren[ i ]));
      const el = newChildren[ newEndIndex + 1 ]?.el ?? null;
      // console.log('----', el, newChildren[ i ]);
      parentElm.insertBefore(createElm(newChildren[ i ]), el);
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; ++i) {
      const child = oldChildren[ i ];
      if (child != undefined) {
        parentElm.removeChild(child.el);
      }
    }
  }

}

export function createElm (vnode) {
  const { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') {
    // TODO 组件判断
    if (createComponent(vnode)) {
      // console.log('el -----------------', vnode.el);
      return vnode.el = vnode.componentInstance.$el;
    }
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

function createComponent (vnode) {
  console.log('component-vnode------------', vnode)
  let d = vnode.data;
  d.hooks && d.hooks.init && d.hooks.init(vnode)
  // if ((d = d.hooks) && (d = d.init)) {
  //   d(vnode);
  // }
  if (vnode.componentInstance) {
    return true;
  }
}

function updatePrototies (vnode, oldVnode) {
  const newProps = vnode.data || {};
  const el = vnode.el;
  // console.log('____', newProps.onClick())
  if (oldVnode) {
    const oldProps = oldVnode.data || {};
    // 处理style
    const oldStyle = oldProps.style ?? {};
    const newStyle = newProps.style ?? {};

    for (let key in oldStyle) {
      if (!newStyle[ key ]) el.style[ key ] = ''
    }

    for (let key in oldProps) {
      if (!newProps[ key ]) {
        el.removeAttribute(key);
      }
    }
  }

  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[ styleName.trim() ] = newProps.style[ styleName ]
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else if (key.startsWith('on')) {
      const event = key.toLowerCase();
      console.log();
      el[ event ] = newProps[ key ];
    } else if (key !== 'undefined') {
      el.setAttribute(key, newProps[ key ]);
    }
  }
}