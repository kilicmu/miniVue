//
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<a:a>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配结尾的</div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;


// ast语法树树根
let currentParent; // 标识当前父亲
const stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement (tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}
// <div><p></p></div>

export function parseHTML (html) {
  let root = null;
  function start (tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element; // 把当前元素标记为父AST
    stack.push(element);
  }

  function end (tagName) {
    let element = stack.pop();
    currentParent = stack[ stack.length - 1 ];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function chars (text) {
    text = text.replace(/\s/g, '');
    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE,
      })
    }
  }


  // 使用正则解析
  // 不断截取html字符串，对截取内容解析
  while (html) {
    console.log(html)
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
      }
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[ 1 ]);
        advance(endTagMatch[ 0 ].length)
      }

    }

    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd); // 文本内容截取
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
    if (textEnd < 0) {
      break;
    }
  }


  function parseStartTag () {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[ 1 ],
        attrs: []
      }
      advance(start[ 0 ].length);
      let end, attr;

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ "name": attr[ 1 ], "value": attr[ 3 ] || attr[ 4 ] || attr[ 5 ] })
        advance(attr[ 0 ].length);
      }
      if (end) {
        advance(end[ 0 ].length)
        return match;
      }
    }
  }

  function advance (n) {
    html = html.substring(n);
  }
  console.log(root)
  return root;
}