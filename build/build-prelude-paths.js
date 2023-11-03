'use strict';

const
	ts = require('typescript'),
	fs = require('fs'),
	glob = require('glob');

const primitiveTypes = ['Number', 'Array', 'Date', 'Object', 'String', 'RegExp', 'Function'];
const formatPath = (fullPath) => {
	const path = fullPath.replace(/.*\/src\//, '');

	if (path.endsWith('/index.ts')) {
		return path.replace('/index.ts', '');
	}

	return path.replace('.ts', '');
};

function extractPreludeInfo() {
	const
		preludeFiles = glob.sync('src/core/prelude/**/*.ts'),
		preludeProgram = ts.createProgram(preludeFiles, require('../tsconfig.json')),
		source = preludeProgram.getSourceFiles();

	const result = {};

	function transformer(ctx) {
		return (sourceFile) => {
			function visitor(node) {
				if (ts.isVariableDeclaration(node) && node.initializer) {
					const
						{initializer, name} = node,
						invokedExpression = ts.getInvokedExpression(initializer),
						exportedSymbol = name && name.escapedText;

					if (invokedExpression && invokedExpression.escapedText === 'extend') {
						const
							[{expression, escapedText}, {text: methodName}] = initializer.arguments,
							parentType = expression && expression.escapedText || escapedText;

						if (!result[parentType]) {
							result[parentType] = {};
						}

						if (primitiveTypes.includes(parentType)) {
							result[parentType][methodName] = {
								path: formatPath(sourceFile.path),
								name: exportedSymbol
							};
					}
				}
			}

				return ts.visitEachChild(node, visitor, ctx);
			}

			return ts.visitEachChild(sourceFile, visitor, ctx);
		};
	}

	ts.transform(source, [transformer]);

	return result;
}

function savePreludeInformation(preludeInfo) {
	fs.writeFileSync('./lib/prelude-paths.json', JSON.stringify(preludeInfo, null, 2));
}

savePreludeInformation(extractPreludeInfo());
