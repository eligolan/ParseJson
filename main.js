const data = `{"a":1,"b":[{"a":1,"b":2},{"a":1,"b":2}],"c":"1,0"}`; // example..
console.log(parseObject(data)); // run with example..

function parseObject(str) {
  if (!str.startsWith("{") || !str.endsWith("}")) {
    throw new Error("nein");
  }
  str = str.slice(1, -1);
  const obj = {};
  if (str !== "") {
    const tokens = splitIntoTokens(str);
    tokens.forEach(token => {
      const colon_position = token.indexOf(":");
      const name = eval(token.substr(0, colon_position));
      const value = evalExpression(token.substr(colon_position + 1));
      obj[name] = value;
    });
  }
  return obj;
}

function parseArray(str) {
  if (!str.startsWith("[") || !str.endsWith("]")) {
    throw new Error("nein");
  }
  str = str.slice(1, -1);
  const tokens = splitIntoTokens(str);
  const arr = [];
  tokens.forEach(token => {
    arr.push(evalExpression(token));
  });
  return arr;
}

function evalExpression(str) {
  switch (getType(str)) {
    case "object":
      return parseObject(str);
    case "array":
      return parseArray(str);
    case "string":
      return str.slice(1, -1);
    case "bool":
      return str === "true";
    case "number":
      return Number(str);
    case "null":
      return null;
    default:
      throw new Error("unknown type");
  }
}
// '{ "a":1,"b":[1,2,3],c:[{"c":1,"d":2}]}`
// '"a":1'  '"b":[1,2,3]' 'c:[{"c":1,"d":2}]
function splitIntoTokens(str) {
  const stack = [];
  const tokens = []; //token is a '"<key>":<expression>' in case of object and `<expression>` in case of array
  let j = 0;
  let inString = false;
  for (let i in str) {
    if (str[i] === '"') {
      //indicates if inside a string or not
      inString = !inString;
    }
    if (inString) {
      continue;
    }
    if (str[i] == "{" || str[i] == "[") {
      stack.push(str[i]);
    }
    if (str[i] == "}" || str[i] == "]") {
      stack.pop(str[i]);
    }
    //this is what we care about in order to split
    if (str[i] == "," && stack.length == 0) {
      tokens.push(str.substring(j, i));
      j = +i + 1;
    } else if (i == str.length - 1 && stack.length == 0) {
      tokens.push(str.substring(j));
    }
  }
  return tokens;
}

function getType(str) {
  if (str.startsWith("{") && str.endsWith("}")) {
    return "object";
  }
  if (str.startsWith("[") && str.endsWith("]")) {
    return "array";
  }
  if (str.startsWith('"') && str.endsWith('"')) {
    return "string";
  }
  if (str === "false" || str === "true") {
    return "bool";
  }
  if (str === "null") {
    return "null";
  }
  if (!isNaN(str)) {
    return "number";
  }
  throw new Error("unknown type");
}
