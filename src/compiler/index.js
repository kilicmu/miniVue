import { parseHTML } from "./parser-html";
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配动态变量的+？
function genProps (attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[ i ];
    if (attr.name === 'style') {
      const obj = {};
      console.log(attr.value);
      attr.value.split(";").forEach(item => {
        const [ key, value ] = item.split(":");
        obj[ key ] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return str;
}

function genChildren (el) {
  let children = el;
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false;
  }
}

function gen (node) {
  if (node.type === 1) {
    // 元素
    return generate(node);
  } else { // 文本
    // 正则 lastIndex问题
    let text = node.text;
    let tokens = [];
    let match, index;
    let lastIndex = defaultTagRE.lastIndex = 0;
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[ 1 ].trim()})`);
      lastIndex = index + match[ 0 ].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return `_v(${tokens.join('+')})`;
  }
}

function generate (el) {
  console.log("----el-------", el)
  const children = genChildren(el.children);// 子节点

  let code = `_c("${el.tag}",{${el.attrs.length ? genProps(el.attrs) : 'undefined'}}
  ${children ? `,${children}` : ''})
  `
  return code
}

export function compileToFunction (template) {
  // 编译模板为render函数

  // 1. 将代码-》ast语法树 paser解析
  const root = parseHTML(template);
  // console.log(root);
  // 将AST语法树生成Render函数
  let code = generate(root);

  code = `with(this){ return ${code}}`

  let renderFn = new Function(code);
  return renderFn;
  // 2. 标记静态书 markup解析

  // 3. 通过ast产生的语法树，生成render函数 render（codegen）
}