function tokenizeCode(code) {
	var tokens = []; // 保存结果数组
	for (var i = 0; i < code.length; i++) {
		// 从0开始 一个个字符读取
		var currentChar = code.charAt(i);
		if (currentChar === ';') {
			tokens.push({
				type: 'sep',
				value: currentChar
			});
			// 该字符已经得到解析了，直接循环下一个
			continue;
		}
		if (currentChar === '(' || currentChar === ')') {
			tokens.push({
				type: 'parens',
				value: currentChar
			});
			continue;
		}
		if (currentChar === '{' || currentChar === '}') {
			tokens.push({
				type: 'brace',
				value: currentChar
			});
			continue;
		}
		if (currentChar === '>' || currentChar === '<') {
			tokens.push({
				type: 'operator',
				value: currentChar
			});
			continue;
		}
		if (currentChar === '"' || currentChar === '\'') {
			// 如果是单引号或双引号，表示一个字符的开始
			var token = {
				type: 'string',
				value: currentChar
			};
			tokens.push(token);
			var closer = currentChar;

			// 表示下一个字符是不是被转译了
			var escaped = false;
			// 循环遍历 寻找字符串的末尾
			for (i++; i < code.length; i++) {
				currentChar = code.charAt(i);
				// 将当前遍历到的字符先加到字符串内容中
				token.value += currentChar;
				if (escaped) {
					// 如果当前为true的话，就变为false，然后该字符就不做特殊的处理
					escaped = false;
				} else if (currentChar === '\\') {
					// 如果当前的字符是 \, 将转译状态变为true，下一个字符不会被做处理
					escaped = true;
				} else if (currentChar === closer) {
					break;
				}
			}
			continue;
		}

		// 数字做处理 
		if (/[0-9]/.test(currentChar)) {
			// 如果数字是以 0 到 9的字符开始的话
			var token = {
				type: 'number',
				value: currentChar
			};
			tokens.push(token);
			// 继续遍历，如果下一个字符还是数字的话，比如0到9或小数点的话
			for (i++; i < code.length; i++) {
				currentChar = code.charAt(i);
				if (/[0-9\.]/.test(currentChar)) {
					// 先不考虑多个小数点 或 进制的情况下
					token.value += currentChar;
				} else {
					// 如果下一个字符不是数字的话，需要把i值返回原来的位置上，需要减1
					i--;
					break;
				}
			}
			continue;
		}
		// 标识符是以字母，$, _开始的 做判断
		if (/[a-zA-Z\$\_]/.test(currentChar)) {
			var token = {
				type: 'identifier',
				value: currentChar
			};
			tokens.push(token);
			// 继续遍历下一个字符，如果下一个字符还是以字母，$,_开始的话
			for (i++; i < code.length; i++) {
				currentChar = code.charAt(i);
				if (/[a-zA-Z0-9\$\_]/.test(currentChar)) {
					token.value += currentChar;
				} else {
					i--;
					break;
				}
			}
			continue;
		}

		// 连续的空白字符组合在一起
		if (/\s/.test(currentChar)) {
			var token = {
				type: 'whitespace',
				value: currentChar
			}
			tokens.push(token);
			// 继续遍历下一个字符
			for (i++; i < code.length; i++) {
				currentChar = code.charAt(i);
				if (/\s/.test(currentChar)) {
					token.value += currentChar;
				} else {
					i--;
					break;
				}
			}
			continue;
		}
		// 更多的字符判断 ......
		// 遇到无法理解的字符 直接抛出异常
		throw new Error('Unexpected ' + currentChar);
	}
	return tokens;
}
var tokens = tokenizeCode(`
        if (1 > 0) {
          alert("aa");
        }
      `);
console.log(tokens);