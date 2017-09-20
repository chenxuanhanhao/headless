/**
 * 公式编辑器
 *
 */

// Configuration
var _wrs_conf_defaultEditMode = 'mathml';

var _wrs_conf_editorEnabled = true; // Specifies if fomula editor is enabled.

var _wrs_conf_imageMathmlAttribute = 'data-mathml'; // Specifies the image tag where we should save the formula editor mathml code.

var _wrs_conf_editorPath = Editor.ueditor.options.UEDITOR_HOME_URL + 'third-party/formula/index.html'; // _wrs_conf_editorPath = CKEDITOR.basePath + '/plugins/ckeditor_wiris/integration/editor.php';			// Specifies where is the editor HTML code (for popup window).
var _wrs_conf_editorAttributes = 'width=560, height=350, scroll=no, resizable=yes, location=no, status=no, menubar=no, titlebar=no, toolbar=no'; // Specifies formula editor window options.

// 转图片的接口。
// var _wrs_conf_createimagePath = '/pluginwiris_engine/app/createimage';

// var _wrs_conf_getmathmlPath = '/pluginwiris_engine/app/getmathml'; // _wrs_conf_getmathmlPath = CKEDITOR.basePath + '/plugins/ckeditor_wiris/integration/getmathml.php';			// Specifies where is the getmathml script.
// var _wrs_conf_servicePath = '/pluginwiris_engine/app/service';

var _wrs_conf_saveMode = 'tags'; // This value can be 'tags', 'xml' or 'safeXml'.
var _wrs_conf_parseModes = ['latex']; // This value can contain 'latex'.

var _wrs_cur_editor;
var _wrs_dialog;
// Vars
var _wrs_fontSize = 14;
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_init = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_directionality;

// Vars
var _wrs_currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
var _wrs_editMode = 'mathml';
var _wrs_isNewElement = true;
var _wrs_temporalImage;
var _wrs_temporalMath;
var _wra_temporalMath_id;
var _wrs_temporalFocusElement;
var _wrs_androidRange;

var _wrs_isRendering = true;

var _wrs_xmlCharacters = {
	'tagOpener': '<', // \x3C
	'tagCloser': '>', // \x3E
	'doubleQuote': '"', // \x22
	'ampersand': '&', // \x26
	'quote': '\'' // \x27
};

var _wrs_safeXmlCharacters = {
	'tagOpener': '«', // \xAB
	'tagCloser': '»', // \xBB
	'doubleQuote': '¨', // \xA8
	'ampersand': '§', // \xA7
	'quote': '`', // \x60
	'realDoubleQuote': '¨'
};

var _wrs_safeXmlCharactersEntities = {
	'tagOpener': '&laquo;',
	'tagCloser': '&raquo;',
	'doubleQuote': '&uml;',
	'realDoubleQuote': '&quot;'
}

var _wrs_safeBadBlackboardCharacters = {
	'ltElement': '«mo»<«/mo»',
	'gtElement': '«mo»>«/mo»',
	'ampElement': '«mo»&«/mo»'
}

var _wrs_safeGoodBlackboardCharacters = {
	'ltElement': '«mo»§lt;«/mo»',
	'gtElement': '«mo»§gt;«/mo»',
	'ampElement': '«mo»§amp;«/mo»'
}

var _wrs_staticNodeLengths = {
	'IMG': 1,
	'BR': 1
}

// Retrocompatibility

if (!(window._wrs_conf_imageClassName)) {
	_wrs_conf_imageClassName = 'Wirisformula';
}

// Functions

/**
 * Adds element events.
 * @param object target Target
 * @param function doubleClickHandler Function to run when user double clicks the element
 * @param function mousedownHandler Function to run when user mousedowns the element
 * @param function mouseupHandler Function to run when user mouseups the element
 */
function wrs_addElementEvents(target, doubleClickHandler, mousedownHandler, mouseupHandler) {
	if (doubleClickHandler) {
		wrs_addEvent(target, 'dblclick', function(event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			doubleClickHandler(target, element, realEvent);
		});
	}

	if (mousedownHandler) {
		wrs_addEvent(target, 'mousedown', function(event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			_wrs_temporalFocusElement = element;
			mousedownHandler(target, element, realEvent);
		});
	}

	if (mouseupHandler) {
		wrs_addEvent(target, 'mouseup', function(event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mouseupHandler(target, element, realEvent);
		});
	}
}

/**
 * Cross-browser addEventListener/attachEvent function.
 * @param object element Element target
 * @param event event Event
 * @param function func Function to run
 */
function wrs_addEvent(element, event, func) {
	if (element.addEventListener) {
		element.addEventListener(event, func, false);
	} else if (element.attachEvent) {
		element.attachEvent('on' + event, func);
	}
}

/**
 * Adds iframe events.
 * @param object iframe Target
 * @param function doubleClickHandler Function to run when user double clicks the iframe
 * @param function mousedownHandler Function to run when user mousedowns the iframe
 * @param function mouseupHandler Function to run when user mouseups the iframe
 */
function wrs_addIframeEvents(iframe, doubleClickHandler, mousedownHandler, mouseupHandler) {
	wrs_addElementEvents(iframe.contentWindow.document, function(target, element, event) {
		doubleClickHandler(iframe, element, event);
	}, function(target, element, event) {
		mousedownHandler(iframe, element, event);
	}, function(target, element, event) {
		mouseupHandler(iframe, element, event);
	});
}

/**
 * Checks if a determined array contains a determined element.
 * @param array stack
 * @param object element
 * @return bool
 */
function wrs_arrayContains(stack, element) {
	for (var i = stack.length - 1; i >= 0; --i) {
		if (stack[i] === element) {
			return i;
		}
	}

	return -1;
}

/**
 * Checks if an element contains a class.
 * @param object element
 * @param string className
 * @return bool
 */
function wrs_containsClass(element, className) {
	if (!('className' in element)) {
		return false;
	}

	var currentClasses = element.className.split(' ');

	for (var i = currentClasses.length - 1; i >= 0; --i) {
		if (currentClasses[i] == className) {
			return true;
		}
	}

	return false;
}

/**
 * Converts old xmlinitialtext attribute (with «») to the correct one(with §lt;§gt;)
 * @param string text
 * @return string
 */
function wrs_convertOldXmlinitialtextAttribute(text) {
	//Used to fix a bug with Cas imported from Moodle 1.9 to Moodle 2.x
	//This could be removed in future
	var val = 'value=';

	var xitpos = text.indexOf('xmlinitialtext');
	var valpos = text.indexOf(val, xitpos);
	var quote = text.charAt(valpos + val.length);
	var startquote = valpos + val.length + 1;
	var endquote = text.indexOf(quote, startquote);

	var value = text.substring(startquote, endquote);

	var newvalue = value.split('«').join('§lt;');
	newvalue = newvalue.split('»').join('§gt;');
	newvalue = newvalue.split('&').join('§');
	newvalue = newvalue.split('¨').join('§quot;');

	text = text.split(value).join(newvalue);
	return text;
}

/**
 * Cross-browser solution for creating new elements.
 *
 * It fixes some browser bugs.
 *
 * @param string elementName The tag name of the wished element.
 * @param object attributes An object where each key is a wished attribute name and each value is its value.
 * @param object creator Optional param. If supplied, this function will use the "createElement" method from this param. Else, "document" will be used.
 * @return object The DOM element with the specified attributes assignated.
 */
function wrs_createElement(elementName, attributes, creator) {
	if (attributes === undefined) {
		attributes = {};
	}

	if (creator === undefined) {
		creator = document;
	}

	var element;

	/*
	 * Internet Explorer fix:
	 * If you create a new object dynamically, you can't set a non-standard attribute.
	 * For example, you can't set the "src" attribute on an "applet" object.
	 * Other browsers will throw an exception and will run the standard code.
	 */

	try {
		var html = '<' + elementName;

		for (var attributeName in attributes) {
			html += ' ' + attributeName + '="' + wrs_htmlentities(attributes[attributeName]) + '"';
		}

		html += '>';
		element = creator.createElement(html);
	} catch (e) {
		element = creator.createElement(elementName);

		for (var attributeName in attributes) {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
	}

	return element;
}

/**
 * Cross-browser httpRequest creation.
 * @return object
 */
function wrs_createHttpRequest() {
	if (_wrs_currentPath.substr(0, 7) == 'file://') {
		throw 'Cross site scripting is only allowed for HTTP.';
	}

	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}

	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	} catch (e) {
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		} catch (oc) {}
	}

	return false;
}

/**
 * Gets formula image src with AJAX.
 * @param mathml Mathml code
 * @param wirisProperties
 * @return string Image src
 */
function wrs_createImageSrc(mathml, wirisProperties) {
	var data = (wirisProperties) ? wirisProperties : {};
	data['mml'] = mathml;

	if (window._wrs_conf_useDigestInsteadOfMathml && _wrs_conf_useDigestInsteadOfMathml) {
		data['returnDigest'] = 'true';
	}

	var result = wrs_getContent(_wrs_conf_createimagePath, data);

	if (result.indexOf('@BASE@') != -1) {
		// Replacing '@BASE@' with the base URL of createimage.
		var baseParts = _wrs_conf_createimagePath.split('/');
		baseParts.pop();
		result = result.split('@BASE@').join(baseParts.join('/'));
	}

	return result;
}

/**
 * Creates new object using its html code.
 * @param string objectCode
 * @return object
 */
function wrs_createObject(objectCode, creator) {
	if (creator === undefined) {
		creator = document;
	}

	// Internet Explorer can't include "param" tag when is setting an innerHTML property.
	objectCode = objectCode.split('<applet ').join('<span wirisObject="WirisApplet" ').split('<APPLET ').join('<span wirisObject="WirisApplet" '); // It is a 'span' because 'span' objects can contain 'br' nodes.
	objectCode = objectCode.split('</applet>').join('</span>').split('</APPLET>').join('</span>');

	objectCode = objectCode.split('<param ').join('<br wirisObject="WirisParam" ').split('<PARAM ').join('<br wirisObject="WirisParam" '); // It is a 'br' because 'br' can't contain nodes.
	objectCode = objectCode.split('</param>').join('</br>').split('</PARAM>').join('</br>');

	var container = wrs_createElement('div', {}, creator);
	container.innerHTML = objectCode;

	function recursiveParamsFix(object) {
		if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisParam') {
			var attributesParsed = {};

			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
				}
			}

			var param = wrs_createElement('param', attributesParsed, creator);

			// IE fix
			if (param.NAME) {
				param.name = param.NAME;
				param.value = param.VALUE;
			}

			param.removeAttribute('wirisObject');
			object.parentNode.replaceChild(param, object);
		} else if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisApplet') {
			var attributesParsed = {};

			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
				}
			}

			var applet = wrs_createElement('applet', attributesParsed, creator);
			applet.removeAttribute('wirisObject');

			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);

				if (object.childNodes[i].nodeName.toLowerCase() == 'param') {
					applet.appendChild(object.childNodes[i]);
					--i; // When we insert the object child into the applet, object loses one child.
				}
			}

			object.parentNode.replaceChild(applet, object);
		} else {
			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);
			}
		}
	}

	recursiveParamsFix(container);
	return container.firstChild;
}

/**
 * Converts an object to its HTML code.
 * @param object object
 * @return string
 */
function wrs_createObjectCode(object) {
	if (object.nodeType == 1) { // ELEMENT_NODE
		var output = '<' + object.tagName;

		for (var i = 0; i < object.attributes.length; ++i) {
			if (object.attributes[i].specified) {
				output += ' ' + object.attributes[i].name + '="' + wrs_htmlentities(object.attributes[i].value) + '"';
			}
		}

		if (object.childNodes.length > 0) {
			output += '>';

			for (var i = 0; i < object.childNodes.length; ++i) {
				output += wrs_createObjectCode(object.childNodes[i]);
			}

			output += '</' + object.tagName + '>';
		} else if (object.nodeName == 'DIV' || object.nodeName == 'SCRIPT') {
			output += '></' + object.tagName + '>';
		} else {
			output += '/>';
		}

		return output;
	}

	if (object.nodeType == 3) { // TEXT_NODE
		return wrs_htmlentities(object.nodeValue);
	}

	return '';
}

/**
 * Parses end HTML code.
 * @param string code
 * @param object wirisProperties Extra attributes for the formula.
 * @param string language Language for the formula.
 * @return string
 */
function wrs_endParse(code, wirisProperties, language) {
	code = wrs_endParseEditMode(code, wirisProperties, language);
	return wrs_endParseSaveMode(code);
}

/**
 * Parses end HTML code depending on the edit mode.
 * @param string code
 * @param object wirisProperties Extra formula attributes.
 * @param string language Language for the formula.
 * @return string
 */
function wrs_endParseEditMode(code, wirisProperties, language) {
	// Converting LaTeX to images.

	if (window._wrs_conf_parseModes !== undefined && wrs_arrayContains(_wrs_conf_parseModes, 'latex') != -1) {
		var output = '';
		var endPosition = 0;
		var startPosition = code.indexOf('$$');

		while (startPosition != -1) {
			output += code.substring(endPosition, startPosition);
			endPosition = code.indexOf('$$', startPosition + 2);

			if (endPosition != -1) {
				var latex = code.substring(startPosition + 2, endPosition);
				latex = wrs_htmlentitiesDecode(latex);
				var mathml = wrs_getMathMLFromLatex(latex, true);
				var imgObject = wrs_mathmlToImgObject(document, mathml, wirisProperties, language);
				output += wrs_createObjectCode(imgObject);
				endPosition += 2;
			} else {
				output += '$$';
				endPosition = startPosition + 2;
			}

			startPosition = code.indexOf('$$', endPosition);
		}

		output += code.substring(endPosition, code.length);
		code = output;
	}

	return code;
}

/**
 * Parses end HTML code depending on the save mode.
 * @param string code
 * @return string
 */
function wrs_endParseSaveMode(code) {
	var output = '';
	var convertToXml = false;
	var convertToSafeXml = false;

	if (window._wrs_conf_saveMode) {
		if (_wrs_conf_saveMode == 'safeXml') {
			convertToXml = true;
			convertToSafeXml = true;
		} else if (_wrs_conf_saveMode == 'xml') {
			convertToXml = true;
		}
	}

	var endPosition = 0;
	var pattern = /<img/gi;
	var patternLength = pattern.source.length;

	while (pattern.test(code)) {
		var startPosition = pattern.lastIndex - patternLength;
		output += code.substring(endPosition, startPosition);

		var i = startPosition + 1;

		while (i < code.length && endPosition <= startPosition) {
			var character = code.charAt(i);

			if (character == '"' || character == '\'') {
				var characterNextPosition = code.indexOf(character, i + 1);

				if (characterNextPosition == -1) {
					i = code.length; // End while.
				} else {
					i = characterNextPosition;
				}
			} else if (character == '>') {
				endPosition = i + 1;
			}

			++i;
		}

		if (endPosition < startPosition) { // The img tag is stripped.
			output += code.substring(startPosition, code.length);
			return output;
		}

		var imgCode = code.substring(startPosition, endPosition);
		output += wrs_getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml);
	}

	output += code.substring(endPosition, code.length);
	return output;
}

/**
 * Fires an element event.
 * @param object element
 * @param string event
 */
function wrs_fireEvent(element, event) {
	if (document.createEvent) {
		var eventObject = document.createEvent('HTMLEvents');
		eventObject.initEvent(event, true, true);
		return !element.dispatchEvent(eventObject);
	}

	var eventObject = document.createEventObject();
	return element.fireEvent('on' + event, eventObject)
}

/**
 * Gets the formula mathml or CAS appletCode using its image hash code.
 * @param string variableName Variable to send on POST query to the server.
 * @param string imageHashCode
 * @return string
 */
function wrs_getCode(variableName, imageHashCode) {
	var data = {};
	data[variableName] = imageHashCode;
	return wrs_getContent(_wrs_conf_getmathmlPath, data);
}

/**
 * Gets the content from an URL.
 * @param string url
 * @param object postVariables Null if a GET query should be done.
 * @return string
 */
function wrs_getContent(url, postVariables) {
	try {
		var httpRequest = wrs_createHttpRequest();

		if (httpRequest) {
			if (url.substr(0, 1) == '/' || url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
				httpRequest.open('POST', url, false);
			} else {
				httpRequest.open('POST', _wrs_currentPath + url, false);
			}

			if (postVariables !== undefined) {
				httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
				httpRequest.send(wrs_httpBuildQuery(postVariables));
			} else {
				httpRequest.send(null);
			}

			return httpRequest.responseText;
		}

		alert('Your browser is not compatible with AJAX technology. Please, use the latest version of Mozilla Firefox.');
	} catch (e) {}

	return '';
}

/**
 * Converts MathML to LaTeX.
 * @param string mathml
 * @return string
 */
function wrs_getLatexFromMathML(mathml) {
	var data = {
		'service': 'mathml2latex',
		'mml': mathml
	};

	return wrs_getContent(_wrs_conf_servicePath, data);
}

/**
 * Extracts the latex of a determined position in a text.
 * @param string text
 * @param int caretPosition
 * @return object An object with 3 keys: 'latex', 'start' and 'end'. Null if latex is not found.
 */
function wrs_getLatexFromTextNode(textNode, caretPosition) {
	// Looking for the first textNode.
	var startNode = textNode;

	while (startNode.previousSibling && startNode.previousSibling.nodeType == 3) { // TEXT_NODE
		startNode = startNode.previousSibling;
	}

	// Finding latex.

	function getNextLatexPosition(currentNode, currentPosition) {
		var position = currentNode.nodeValue.indexOf('$$', currentPosition);

		while (position == -1) {
			currentNode = currentNode.nextSibling;

			if (!currentNode || currentNode.nodeType != 3) { // TEXT_NODE
				return null; // Not found.
			}

			position = currentNode.nodeValue.indexOf('$$');
		}

		return {
			'node': currentNode,
			'position': position
		};
	}

	function isPrevious(node, position, endNode, endPosition) {
		if (node == endNode) {
			return (position <= endPosition);
		}

		while (node && node != endNode) {
			node = node.nextSibling;
		}

		return (node == endNode);
	}

	var start;

	var end = {
		'node': startNode,
		'position': 0
	};

	do {
		var start = getNextLatexPosition(end.node, end.position);

		if (start == null || isPrevious(textNode, caretPosition, start.node, start.position)) {
			return null;
		}

		var end = getNextLatexPosition(start.node, start.position + 2);

		if (end == null) {
			return null;
		}

		end.position += 2;
	} while (isPrevious(end.node, end.position, textNode, caretPosition));

	// Isolating latex.
	var latex;

	if (start.node == end.node) {
		latex = start.node.nodeValue.substring(start.position + 2, end.position - 2);
	} else {
		latex = start.node.nodeValue.substring(start.position + 2, start.node.nodeValue.length);
		var currentNode = start.node;

		do {
			currentNode = currentNode.nextSibling;

			if (currentNode == end.node) {
				latex += end.node.nodeValue.substring(0, end.position - 2);
			} else {
				latex += currentNode.nodeValue;
			}
		} while (currentNode != end.node);
	}

	return {
		'latex': latex,
		'startNode': start.node,
		'startPosition': start.position,
		'endNode': end.node,
		'endPosition': end.position
	};
}

/**
 * Converts LaTeX to MathML.
 * @param string latex
 * @return string
 */
function wrs_getMathMLFromLatex(latex, includeLatexOnSemantics) {
	var data = {
		'service': 'latex2mathml',
		'latex': latex
	};

	if (includeLatexOnSemantics) {
		data['saveLatex'] = '';
	}

	var mathML = wrs_getContent(_wrs_conf_servicePath, data);
	return mathML.split("\r").join('').split("\n").join(' ');
}

/**
 * Gets the node length in characters.
 * @param object node
 * @return int
 */
function wrs_getNodeLength(node) {
	if (node.nodeType == 3) { // TEXT_NODE
		return node.nodeValue.length;
	}

	if (node.nodeType == 1) { // ELEMENT_NODE
		var length = _wrs_staticNodeLengths[node.nodeName.toUpperCase()];

		if (length === undefined) {
			length = 0;
		}

		for (var i = 0; i < node.childNodes.length; ++i) {
			length += wrs_getNodeLength(node.childNodes[i]);
		}

		return length;
	}

	return 0;
}

/**
 * Parses the query string and returns it as a Hash table.
 * @return object
 */
function wrs_getQueryParams(windowObject) {
	var data = {};
	var start = windowObject.location.search.indexOf('?');
	start = (start == -1) ? 0 : start + 1;
	var queryStringParts = windowObject.location.search.substr(start).split('&');

	for (var i = 0; i < queryStringParts.length; ++i) {
		var paramParts = queryStringParts[i].split('=', 2);
		data[paramParts[0]] = wrs_urldecode(paramParts[1]);
	}

	return data;
}

/**
 * Gets the selected node or text.
 * If the caret is on a text node, concatenates it with all the previous and next text nodes.
 * @param object target The editable element
 * @param boolean isIframe Specifies if the target is an iframe or not
 * @return object An object with the 'node' key setted if the item is an element or the keys 'node' and 'caretPosition' if the element is text
 */
function wrs_getSelectedItem(target, isIframe) {
	var windowTarget;

	if (isIframe) {
		windowTarget = target.contentWindow;
		windowTarget.focus();
	} else {
		windowTarget = window;
		target.focus();
	}

	if (document.selection) {
		var range = windowTarget.document.selection.createRange();

		if (range.parentElement) {
			if (range.text.length > 0) {
				return null;
			}

			windowTarget.document.execCommand('InsertImage', false, '#');
			var temporalObject = range.parentElement();

			if (temporalObject.nodeName.toUpperCase() != 'IMG') {
				// IE9 fix: parentElement() does not return the IMG node, returns the parent DIV node. In IE < 9, pasteHTML does not work well.
				range.pasteHTML('<span id="wrs_openEditorWindow_temporalObject"></span>');
				temporalObject = windowTarget.document.getElementById('wrs_openEditorWindow_temporalObject');
			}

			var node;
			var caretPosition;

			if (temporalObject.nextSibling && temporalObject.nextSibling.nodeType == 3) { // TEXT_NODE
				node = temporalObject.nextSibling;
				caretPosition = 0;
			} else if (temporalObject.previousSibling && temporalObject.previousSibling.nodeType == 3) { // TEXT_NODE
				node = temporalObject.previousSibling;
				caretPosition = node.nodeValue.length;
			} else {
				node = windowTarget.document.createTextNode('');
				temporalObject.parentNode.insertBefore(node, temporalObject);
				caretPosition = 0;
			}

			temporalObject.parentNode.removeChild(temporalObject);

			return {
				'node': node,
				'caretPosition': caretPosition
			};
		}

		if (range.length > 1) {
			return null;
		}

		return {
			'node': range.item(0)
		};
	}

	var selection = windowTarget.getSelection();

	try {
		var range = selection.getRangeAt(0);
	} catch (e) {
		var range = windowTarget.document.createRange();
	}

	var node = range.startContainer;

	if (node.nodeType == 3) { // TEXT_NODE
		if (range.startOffset != range.endOffset) {
			return null;
		}

		return {
			'node': node,
			'caretPosition': range.startOffset
		};
	}

	if (node.nodeType == 1) { // ELEMENT_NODE
		var position = range.startOffset;

		if (node.childNodes[position]) {
			return {
				'node': node.childNodes[position]
			};
		}
	}

	return null;
}

/**
 * Converts the HTML of a image into the output code that WIRIS must return.
 * @param string imgCode
 * @return string
 */
function wrs_getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml) {
	var imgObject = wrs_createObject(imgCode);

	if (imgObject) {
		if (imgObject.className == _wrs_conf_imageClassName) {
			if (!convertToXml) {
				return imgCode;
			}

			var xmlCode = imgObject.getAttribute(_wrs_conf_imageMathmlAttribute);

			if (xmlCode == null) {
				xmlCode = imgObject.getAttribute('alt');
			}

			if (!convertToSafeXml) {
				xmlCode = wrs_mathmlDecode(xmlCode);
			}

			return xmlCode;
		} else if (imgObject.className == _wrs_conf_CASClassName) {
			var appletCode = imgObject.getAttribute(_wrs_conf_CASMathmlAttribute);
			appletCode = wrs_mathmlDecode(appletCode);
			var appletObject = wrs_createObject(appletCode);
			appletObject.setAttribute('src', imgObject.src);
			var object = appletObject;
			var appletCodeToBeInserted = wrs_createObjectCode(appletObject);

			if (convertToSafeXml) {
				appletCodeToBeInserted = wrs_mathmlEncode(appletCodeToBeInserted);
			}

			return appletCodeToBeInserted;
		}
	}

	return imgCode;
}

/**
 * Parses a text and replaces all HTML special characters by their entities.
 * @param string input
 * @return string
 */
function wrs_htmlentities(input) {
	return input.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}

/**
 * Parses a text and replaces all the HTML entities by their characters.
 * @param string input
 * @return string
 */
function wrs_htmlentitiesDecode(input) {
	return input.split('&quot;').join('"').split('&gt;').join('>').split('&lt;').join('<').split('&amp;').join('&');
}

/**
 * Converts a hash to a HTTP query.
 * @param hash properties
 * @return string
 */
function wrs_httpBuildQuery(properties) {
	var result = '';

	for (i in properties) {
		if (properties[i] != null) {
			result += wrs_urlencode(i) + '=' + wrs_urlencode(properties[i]) + '&';
		}
	}

	return result;
}

/**
 * Parses initial HTML code.
 * @param string code
 * @param string language Language for the formula.
 * @return string
 */
/* Note: The code inside this function has been inverted.
 	If you invert again the code then you cannot use correctly LaTeX
	in Moodle.
 */
function wrs_initParse(code, language) {
	code = wrs_initParseSaveMode(code, language);
	return wrs_initParseEditMode(code);
}

/**
 * Parses initial HTML code depending on the edit mode.
 * @param string code
 * @return string
 */
function wrs_initParseEditMode(code) {
	if (window._wrs_conf_parseModes !== undefined && wrs_arrayContains(_wrs_conf_parseModes, 'latex') != -1) {
		var imgList = wrs_getElementsByNameFromString(code, 'img', true);
		var token = 'encoding="LaTeX">';
		var carry = 0; // While replacing images with latex, the indexes of the found images changes respecting the original code, so this carry is needed.

		for (var i = 0; i < imgList.length; ++i) {
			var imgCode = code.substring(imgList[i].start + carry, imgList[i].end + carry);

			if (imgCode.indexOf(' class="' + _wrs_conf_imageClassName + '"') != -1) {
				var mathmlStartToken = ' ' + _wrs_conf_imageMathmlAttribute + '="';
				var mathmlStart = imgCode.indexOf(mathmlStartToken);

				if (mathmlStart == -1) {
					mathmlStartToken = ' alt="';
					mathmlStart = imgCode.indexOf(mathmlStartToken);
				}

				if (mathmlStart != -1) {
					mathmlStart += mathmlStartToken.length;
					var mathmlEnd = imgCode.indexOf('"', mathmlStart);
					var mathml = wrs_mathmlDecode(imgCode.substring(mathmlStart, mathmlEnd));
					var latexStartPosition = mathml.indexOf(token);

					if (latexStartPosition != -1) {
						latexStartPosition += token.length;
						var latexEndPosition = mathml.indexOf('</annotation>', latexStartPosition);
						var latex = mathml.substring(latexStartPosition, latexEndPosition);

						var replaceText = '$$' + wrs_htmlentitiesDecode(latex) + '$$';
						code = code.substring(0, imgList[i].start + carry) + replaceText + code.substring(imgList[i].end + carry);
						carry += replaceText.length - (imgList[i].end - imgList[i].start);
					}
				}
			}
		}
	}

	return code;
}

/**
 * Parses initial HTML code depending on the save mode.
 * @param string code
 * @param string language Language for the formula.
 * @return string
 */
function wrs_initParseSaveMode(code, language) {
	if (window._wrs_conf_saveMode) {
		var safeXml = (_wrs_conf_saveMode == 'safeXml');
		var characters = _wrs_xmlCharacters;

		if (safeXml) {
			characters = _wrs_safeXmlCharacters;
		}

		if (safeXml || _wrs_conf_saveMode == 'xml') {
			// Converting XML to tags.
			code = wrs_parseMathmlToLatex(code, characters);
			code = wrs_parseMathmlToImg(code, characters, language);
		}
	}

	var appletList = wrs_getElementsByNameFromString(code, 'applet', false);
	var carry = 0; // While replacing applets with images, the indexes of the found applets changes respecting the original code, so this carry is needed.

	for (var i = 0; i < appletList.length; ++i) {
		var appletCode = code.substring(appletList[i].start + carry, appletList[i].end + carry);

		//The second control in the if is used to find WIRIS applet which don't have Wiriscas class (as it was in old CAS applets).
		if (appletCode.indexOf(' class="' + _wrs_conf_CASClassName + '"') != -1 || appletCode.toUpperCase().indexOf('WIRIS') != -1) {
			if (appletCode.indexOf(' src="') != -1) {
				var srcStart = appletCode.indexOf(' src="') + ' src="'.length;
				var srcEnd = appletCode.indexOf('"', srcStart);
				var src = appletCode.substring(srcStart, srcEnd);
			} else {
				//This should happen only with old CAS imported from Moodle 1 to Moodle 2
				if (typeof(_wrs_conf_pluginBasePath) != 'undefined') {
					var src = _wrs_conf_pluginBasePath + '/integration/showcasimage.php?formula=noimage';
				} else {
					var src = '';
				}
				if (appletCode.indexOf(' class="' + _wrs_conf_CASClassName + '"') == -1) {
					var closeSymbol = appletCode.indexOf('>');
					var appletTag = appletCode.substring(0, closeSymbol);
					var newAppletTag = appletTag.split(' width=').join(' class="Wiriscas" width=');
					appletCode = appletCode.split(appletTag).join(newAppletTag);
					appletCode = appletCode.split('\'').join('"');
				}
			}

			// 'Double click to edit' has been removed here.
			var imgCode = '<img align="middle" class="' + _wrs_conf_CASClassName + '" ' + _wrs_conf_CASMathmlAttribute + '="' + wrs_mathmlEncode(appletCode) + '" src="' + src + '" />';

			code = code.substring(0, appletList[i].start + carry) + imgCode + code.substring(appletList[i].end + carry);
			carry += imgCode.length - (appletList[i].end - appletList[i].start);
		}
	}

	return code;
}

/**
 * Looks for elements that match the given name in a HTML code string.
 * Important: this function is very concrete for WIRIS code. It takes as preconditions lots of behaviors that are not the general case.
 *
 * @param string code HTML code
 * @param string name Element names
 * @param boolean autoClosed True if the elements are autoClosed.
 * @return array
 */
function wrs_getElementsByNameFromString(code, name, autoClosed) {
	var elements = [];
	var code = code.toLowerCase();
	name = name.toLowerCase();
	var start = code.indexOf('<' + name + ' ');

	while (start != -1) { // Look for nodes.
		var endString;

		if (autoClosed) {
			endString = '>';
		} else {
			endString = '</' + name + '>';
		}

		var end = code.indexOf(endString, start);

		if (end != -1) {
			end += endString.length;

			elements.push({
				'start': start,
				'end': end
			});
		} else {
			end = start + 1;
		}

		start = code.indexOf('<' + name + ' ', end);
	}

	return elements;
}

function wrs_makeImageWrapMath(element, mathml) {
	var $element = $(element);

	if (window.MathJax) {

		mathml = mathml
			.replace(/<[^>]*>/gi, function(str, name) {
				return str.replace(/\'/gi, '"');
			})
			.replace(/\t\r\n/gi, "");

		mathml = encodeURIComponent(mathml);
		$element.attr('contenteditable', false);

		$element
			.wrap('<span contenteditable="false" data-mathml="' + mathml + '" data-module="true" style="display: inline-block; vertical-align: middle; position: relative;font-size: ' + _wrs_fontSize + 'px;"/>');

		$element
			.after('<span contenteditable="false" data-math-overlay="true" style="cursor: default; position: absolute; top: 0; left: 0; z-index: 2; background:url(themes/default/images/math-overlay.png);"></span>')
			.css({'position': 'absolute', 'top': 0, 'left': 0, 'z-index': 1, 'width': 'auto', 'height': 'auto'});

		var width = $element.width(),
			height = $element.height();

		$element.parent().css({width: width, height: height});
		$element.next().css({width: width, height: height});
	} else {
		var width = $element.width(),
			height = $element.height();

		if ($element.parent().is('span[data-module="true"]')) {
			$element.parent()
				.attr('style', '')
				.css({'display': 'inline-block', 'position': 'relative', 'width': width, 'height': height, 'vertical-align': 'middle'});
		} else {
			$element
				.wrap('<span contenteditable="false" data-module="true" style="display: inline-block; vertical-align: middle; position: relative; width: ' + width + 'px; height: ' + height + 'px;" />');
		}

		$element
			.after('<span contenteditable="false" data-math-overlay="true" style="cursor: default; position: absolute; top: 0, left: 0; z-index: 2; width: ' + width + 'px; height: ' + height + 'px; background:url(themes/default/images/math-overlay.png);"></span>')
			.css({'position': 'absolute', 'top': 0, 'left': 0, 'z-index': 1, 'width': 'auto', 'height': 'auto'})

	}
};

/**
 * Replaces a selection with an element.
 * @param object element Element
 * @param object focusElement Element to be focused
 * @param object windowTarget Target
 */
function wrs_insertElementOnSelection(mathml, html, focusElement, windowTarget, editMode) {

	try {
		// focusElement.focus();

		if (_wrs_isNewElement) {
			if (editMode == 'mathml') {
				_wrs_cur_editor.fireEvent('saveScene');

				if (html) {
					// 直接插入在ie8下有问题，所以需要曲线救国。
					var mathNode;
					var temp = _wrs_cur_editor.execCommand('inserthtml', '<span>temp</span>', "notNeedUndo");
					var $temp = $(temp);
					$temp.after('<span>&nbsp;</span>').after($(html));
					mathNode = $temp.next()[0];
					$temp.remove();

					wrs_makeImageWrapMath(mathNode, mathml);
				} else {
					var math = _wrs_cur_editor.execCommand('inserthtml', mathml);

					wrs_makeImageWrapMath(math);
					$(math.parentNode).after("&nbsp;");
				}

				// _wrs_cur_editor.execCommand('inserthtml', '<span>&nbsp;</span>');

				_wrs_cur_editor.fireEvent('saveScene');
				return;
			}

			if (document.selection) {
				var range = windowTarget.document.selection.createRange();
				windowTarget.document.execCommand('InsertImage', false, element.src);

				if (!('parentElement' in range)) {
					windowTarget.document.execCommand('delete', false);
					range = windowTarget.document.selection.createRange();
					windowTarget.document.execCommand('InsertImage', false, element.src);
				}

				if ('parentElement' in range) {
					var temporalObject = range.parentElement();

					if (temporalObject.nodeName.toUpperCase() == 'IMG') {
						temporalObject.parentNode.replaceChild(element, temporalObject);
					} else {
						// IE9 fix: parentNode() does not return the IMG node, returns the parent DIV node. In IE < 9, pasteHTML does not work well.
						range.pasteHTML(wrs_createObjectCode(element));
					}
				}
			} else {
				var isAndroid = false;

				_wrs_cur_editor.execCommand('inserthtml', mathml);
			}
		} else if (_wrs_temporalMath) {
			_wrs_cur_editor.fireEvent('saveScene');

			if (window.MathJax) {
				var mathNode;
				var $tempMath = $(_wrs_temporalMath);

				$tempMath.after($(html));
				mathNode = $tempMath.next()[0];
				$tempMath.remove();

				UE.fireEvent('aftermathinsert', mathNode, mathml);
			} else {
				var parent = _wrs_temporalMath.parentNode;
				var $parent = $(parent);
				parent.innerHTML = mathml;

				// 先重置父层的宽高，这样公式出来的时候才能正常显示。
				parent.style.width = 'auto';
				parent.style.height = 'auto';
				$parent.find('object').remove();
				UE.fireEvent('aftermathinsert', $(parent).find('math')[0]);
			}

			_wrs_cur_editor.fireEvent('saveScene');
		}
	} catch (e) {
		window.console && console.warn(e);
	}
}

/**
 * Checks if the mathml at position i is inside an HTML attribute or not.
 * @param string content
 * @param string i
 * @return bool True if is inside an HTML attribute. In other case, false.
 */
function wrs_isMathmlInAttribute(content, i) {
	//regex = '^[\'"][\\s]*=[\\s]*[\\w-]+([\\s]*("[^"]*"|\'[^\']*\')[\\s]*=[\\s]*[\\w-]+[\\s]*)*[\\s]+gmi<';
	var math_att = '[\'"][\\s]*=[\\s]*[\\w-]+'; // "=att OR '=att
	var att_content = '"[^"]*"|\'[^\']*\''; // "blabla" OR 'blabla'
	var att = '[\\s]*(' + att_content + ')[\\s]*=[\\s]*[\\w-]+[\\s]*'; // "blabla"=att OR 'blabla'=att
	var atts = '(' + att + ')*'; // "blabla"=att1 "blabla"=att2
	var regex = '^' + math_att + atts + '[\\s]+gmi<'; // "=att "blabla"=att1 "blabla"=att2 gmi<
	var expression = new RegExp(regex);

	var actual_content = content.substring(0, i);
	var reversed = actual_content.split('').reverse().join('');
	var exists = expression.test(reversed);

	return exists;
}

/**
 * WIRIS special encoding.
 * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlDecode(input) {
	// Decoding entities.
	input = input.split(_wrs_safeXmlCharactersEntities.tagOpener).join(_wrs_safeXmlCharacters.tagOpener);
	input = input.split(_wrs_safeXmlCharactersEntities.tagCloser).join(_wrs_safeXmlCharacters.tagCloser);
	input = input.split(_wrs_safeXmlCharactersEntities.doubleQuote).join(_wrs_safeXmlCharacters.doubleQuote);
	//Added to fix problem due to import from 1.9.x
	input = input.split(_wrs_safeXmlCharactersEntities.realDoubleQuote).join(_wrs_safeXmlCharacters.realDoubleQuote);

	//Blackboard
	if ('_wrs_blackboard' in window && window._wrs_blackboard) {
		input = input.split(_wrs_safeBadBlackboardCharacters.ltElement).join(_wrs_safeGoodBlackboardCharacters.ltElement);
		input = input.split(_wrs_safeBadBlackboardCharacters.gtElement).join(_wrs_safeGoodBlackboardCharacters.gtElement);
		input = input.split(_wrs_safeBadBlackboardCharacters.ampElement).join(_wrs_safeGoodBlackboardCharacters.ampElement);

		/*var regex = /«mtext».*[<>&].*«\/mtext»/;

		var result = regex.exec(input);
		while(result){
			var changedResult = result[0].split(_wrs_xmlCharacters.tagOpener).join('§lt;');
			changedResult = changedResult.split(_wrs_xmlCharacters.tagCloser).join('§gt;');
			changedResult = changedResult.split(_wrs_xmlCharacters.ampersand).join('§amp;');
			input = input.replace(result, changedResult);
			result = regex.exec(input);
		}*/
	}

	// Decoding characters.
	input = input.split(_wrs_safeXmlCharacters.tagOpener).join(_wrs_xmlCharacters.tagOpener);
	input = input.split(_wrs_safeXmlCharacters.tagCloser).join(_wrs_xmlCharacters.tagCloser);
	input = input.split(_wrs_safeXmlCharacters.doubleQuote).join(_wrs_xmlCharacters.doubleQuote);
	input = input.split(_wrs_safeXmlCharacters.ampersand).join(_wrs_xmlCharacters.ampersand);
	input = input.split(_wrs_safeXmlCharacters.quote).join(_wrs_xmlCharacters.quote);

	// We are replacing $ by & for retrocompatibility. Now, the standard is replace § by &
	input = input.split('$').join('&');

	return input;
}

/**
 * WIRIS special encoding.
 * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlEncode(input) {
	input = input.split(_wrs_xmlCharacters.tagOpener).join(_wrs_safeXmlCharacters.tagOpener);
	input = input.split(_wrs_xmlCharacters.tagCloser).join(_wrs_safeXmlCharacters.tagCloser);
	input = input.split(_wrs_xmlCharacters.doubleQuote).join(_wrs_safeXmlCharacters.doubleQuote);
	input = input.split(_wrs_xmlCharacters.ampersand).join(_wrs_safeXmlCharacters.ampersand);
	input = input.split(_wrs_xmlCharacters.quote).join(_wrs_safeXmlCharacters.quote);

	return input;
}

/**
 * Converts special symbols (> 128) to entities.
 * @param string mathml
 * @return string
 */
function wrs_mathmlEntities(mathml) {
	var toReturn = '';

	for (var i = 0; i < mathml.length; ++i) {
		//parsing > 128 characters
		if (mathml.charCodeAt(i) > 128) {
			toReturn += '&#' + mathml.charCodeAt(i) + ';';
		} else {
			toReturn += mathml.charAt(i);
		}
	}

	return toReturn;
}

/**
 * Converts mathml to img object.
 * @param object creator Object with the "createElement" method
 * @param string mathml MathML code
 * @return object
 */
function wrs_mathmlToImgObject(creator, mathml, wirisProperties, language) {
	var imgObject = creator.createElement('img');
	//imgObject.title = 'Double click to edit';
	imgObject.align = 'middle';

	imgObject.className = _wrs_conf_imageClassName;

	var result = wrs_createImageSrc(mathml, wirisProperties);

	if (window._wrs_conf_useDigestInsteadOfMathml && _wrs_conf_useDigestInsteadOfMathml) {
		var parts = result.split(':', 2);
		imgObject.setAttribute(_wrs_conf_imageMathmlAttribute, parts[0]);
		imgObject.src = parts[1];
	} else {
		imgObject.setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
		imgObject.src = result;
	}

	return imgObject;
}

/**
 * 渲染，初始化公式编辑器。
 * @param  {[type]} language [description]
 * @return {[type]}          [description]
 */
function wrs_renderEditor(language, callback) {
	if (!_wrs_dialog) {

		var path = _wrs_conf_editorPath;

		if (language) {
			path += '?lang=' + language;
		}

		var availableDirs = new Array('rtl', 'ltr');
		if (typeof _wrs_int_directionality != 'undefined' && wrs_arrayContains(availableDirs, _wrs_int_directionality) != -1) {
			path += '&dir=' + _wrs_int_directionality;
		}

		var editor = _wrs_cur_editor;

		_wrs_dialog = new UE.ui.Dialog(UE.utils.extend({
	        iframeUrl: path,
	        editor: editor,
	        className:'edui-for-formula',
	        title: "公式编辑器",
	        holdScroll: false,
	        fullscreen: false,
	        mask: false,
	        formula: true,
	        closeDialog: editor.getLang("closeDialog")
	    }, {}));

	    _wrs_dialog.render();
	    _wrs_dialog.loadInPage();
	    _wrs_dialog.open(false);

	    _wrs_int_window_opened = true;
	    _wrs_int_temporalIframe = _wrs_cur_editor.iframe;

	    _wrs_isRendering = false;

	    callback && callback();
	}
}

/**
 * Opens a new editor window.
 * @param string language Language code for the editor
 * @param object target The editable element
 * @param boolean isIframe Specifies if the target is an iframe or not
 * @return object The opened window
 */
function wrs_openEditorWindow(language, target, isIframe) {
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1;
	var contentWindow;

	if (isAndroid) {
		var selection = target.contentWindow.getSelection();
		_wrs_androidRange = selection.getRangeAt(0);
	}

	if (isIframe === undefined) {
		isIframe = true;
	}

	_wrs_editMode = (window._wrs_conf_defaultEditMode) ? _wrs_conf_defaultEditMode : 'images';
	_wrs_temporalRange = null;

	if (target) {
		var selectedItem = wrs_getSelectedItem(target, isIframe);

		if (selectedItem != null) {
			if (selectedItem.caretPosition === undefined) {
				if (selectedItem.node.className == _wrs_conf_imageClassName) {
					if (selectedItem.node.nodeName.toUpperCase() == 'IMG') {
						_wrs_editMode = 'images';
					} else if (selectedItem.node.nodeName.toUpperCase() == 'IFRAME') {
						_wrs_editMode = 'iframes';
					}

					_wrs_temporalImage = selectedItem.node;
					_wrs_isNewElement = false;
				}
			} else {
				var latexResult = wrs_getLatexFromTextNode(selectedItem.node, selectedItem.caretPosition);

				if (latexResult != null) {
					_wrs_editMode = 'latex';

					var mathml = wrs_getMathMLFromLatex(latexResult.latex);
					_wrs_isNewElement = false;

					_wrs_temporalImage = document.createElement('img');
					_wrs_temporalImage.setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
					var windowTarget = (isIframe) ? target.contentWindow : window;

					if (document.selection) {
						var leftOffset = 0;
						var previousNode = latexResult.startNode.previousSibling;

						while (previousNode) {
							leftOffset += wrs_getNodeLength(previousNode);
							previousNode = previousNode.previousSibling;
						}

						_wrs_temporalRange = windowTarget.document.selection.createRange();
						_wrs_temporalRange.moveToElementText(latexResult.startNode.parentNode);
						_wrs_temporalRange.move('character', leftOffset + latexResult.startPosition);
						_wrs_temporalRange.moveEnd('character', latexResult.latex.length + 4); // +4 for the '$$' characters.
					} else {
						_wrs_temporalRange = windowTarget.document.createRange();
						_wrs_temporalRange.setStart(latexResult.startNode, latexResult.startPosition);
						_wrs_temporalRange.setEnd(latexResult.endNode, latexResult.endPosition);
					}
				}
			}
		}
	}

	if (!_wrs_dialog) {
		wrs_renderEditor(language, openDialog);
	}

	var timerId = null;
	var maxTry = 50;
	function openDialog() {
		clearTimeout(timerId);
		// 如果缓存了数学公式，则加载数学公式。
		// 否则清空公式编辑器。

		try {
			contentWindow = _wrs_dialog.getDom('iframe').contentWindow;

			var mathml = _wrs_temporalMath;
			if (mathml) {
				if (window.MathJax) {
					mathml = decodeURIComponent(_wrs_temporalMath.getAttribute('data-mathml'))
				} else {
					mathml = _wrs_temporalMath.outerHTML;
				}
				contentWindow.wrs_setMathML(mathml);
			} else {
				contentWindow.wrs_clearMathEditor();
			}

			_wrs_dialog.show();
			contentWindow.wrs_setFocus();
		} catch(e) {
			timerId = setTimeout(openDialog, 100);
		}

	}

	openDialog();

}

/**
 * Converts all occurrences of mathml code to LATEX.
 * @param string content
 * @return string
 */
function wrs_parseMathmlToLatex(content, characters) {
	var output = '';
	var mathTagBegin = characters.tagOpener + 'math';
	var mathTagEnd = characters.tagOpener + '/math' + characters.tagCloser;
	var openTarget = characters.tagOpener + 'annotation encoding=' + characters.doubleQuote + 'LaTeX' + characters.doubleQuote + characters.tagCloser;
	var closeTarget = characters.tagOpener + '/annotation' + characters.tagCloser;
	var start = content.indexOf(mathTagBegin);
	var end = 0;
	var mathml, startAnnotation, closeAnnotation;

	while (start != -1) {
		output += content.substring(end, start);
		end = content.indexOf(mathTagEnd, start);

		if (end == -1) {
			end = content.length - 1;
		} else {
			end += mathTagEnd.length;
		}

		mathml = content.substring(start, end);

		startAnnotation = mathml.indexOf(openTarget);
		if (startAnnotation != -1) {
			startAnnotation += openTarget.length;
			closeAnnotation = mathml.indexOf(closeTarget);
			output += '$$' + mathml.substring(startAnnotation, closeAnnotation) + '$$';
		} else {
			output += mathml;
		}

		start = content.indexOf(mathTagBegin, end);
	}

	output += content.substring(end, content.length);
	return output;
}

/**
 * Converts all occurrences of mathml code to the corresponding image.
 * @param string content
 * @return string
 */
function wrs_parseMathmlToImg(content, characters, language) {
	var output = '';
	var mathTagBegin = characters.tagOpener + 'math';
	var mathTagEnd = characters.tagOpener + '/math' + characters.tagCloser;
	var start = content.indexOf(mathTagBegin);
	var end = 0;

	while (start != -1) {
		output += content.substring(end, start);
		end = content.indexOf(mathTagEnd, start);

		if (end == -1) {
			end = content.length - 1;
		} else {
			end += mathTagEnd.length;
		}

		if (!wrs_isMathmlInAttribute(content, start)) {
			var mathml = content.substring(start, end);
			mathml = (characters == _wrs_safeXmlCharacters) ? wrs_mathmlDecode(mathml) : wrs_mathmlEntities(mathml);
			output += wrs_createObjectCode(wrs_mathmlToImgObject(document, mathml, null, language));
		} else {
			output += content.substring(start, end);
		}

		start = content.indexOf(mathTagBegin, end);
	}

	output += content.substring(end, content.length);
	return output;
}


/**
 * Inserts or modifies formulas.
 * @param object focusElement Element to be focused
 * @param object windowTarget Window where the editable content is
 * @param string mathml Mathml code
 * @param object wirisProperties Extra attributes for the formula (like background color or font size).
 * @param string editMode Current edit mode.
 * @param string language Language for the formula.
 */
function wrs_updateFormula(focusElement, windowTarget, mathml, html, wirisProperties, editMode, language) {

	wrs_insertElementOnSelection(mathml, html, focusElement, windowTarget, editMode);

}

/**
 * URL decode function.
 * @param string input
 * @return string
 */
function wrs_urldecode(input) {
	return decodeURIComponent(input);
}

/**
 * URL encode function.
 * @param string clearString Input.
 * @return string
 */
function wrs_urlencode(clearString) {
	var output = '';
	//encodeURIComponent doesn't encode !'()*~
	output = encodeURIComponent(clearString).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/~/g, '%7E');
	return output;
}


var dialoger = null;
/**
 * Opens formula editor.
 * @param object iframe Target
 */

function wrs_int_openNewFormulaEditor(iframe, language) {
    if (_wrs_int_window_opened) {
    	var fn = function() {
    		clearTimeout(dialoger);
    		if (!_wrs_isRendering) {
		    	var contentWindow = _wrs_dialog.getDom('iframe').contentWindow;
		    	contentWindow.wrs_clearMathEditor();
		    	_wrs_dialog.show();
		    	contentWindow.wrs_setFocus();
	    	} else {
	    		dialoger = setTimeout(fn, 100);
	    	}
    	}

    	fn();
    } else {
    	_wrs_temporalMath = null;
        _wrs_int_window_opened = true;
        _wrs_isNewElement = true;
        _wrs_int_temporalIframe = iframe;
        _wrs_int_window = wrs_openEditorWindow(language, iframe, true);
    }
}

/**
 * Handles a double click on the iframe.
 * @param object iframe Target
 * @param object element Element double clicked
 */

function wrs_int_doubleClickHandler(editor, iframe, element) {

	// if (window.MathJax) {
	// 	var mathml = decodeURIComponent(element.getAttribute('data-mathml'));
	//     if (mathml) {
	//     	var fn = function() {
	//     		clearTimeout(dialoger);
	//     		if (!_wrs_isRendering) {

	// 	    		_wrs_int_window_opened = true;
	// 				_wrs_temporalMath = element;
	// 				_wrs_isNewElement = false;

	// 				var contentWindow = _wrs_dialog.getDom('iframe').contentWindow;
	// 				contentWindow.wrs_setMathML(mathml);
	// 				_wrs_dialog.show();
	// 				contentWindow.wrs_setFocus();
	// 			} else {
	// 				dialoger = setTimeout(fn, 100);
	// 			}
	//     	}

	//     	fn();
	//     }
    // } else {
    	if (!_wrs_int_window_opened) {
    		_wrs_temporalMath = element;
    		wrs_int_openExistingFormulaEditor(iframe, "zh");
    	} else {
    		var mathml;

    		if (window.MathJax) {
    			mathml = decodeURIComponent(element.getAttribute('data-mathml'));
    		} else {
    			mathml = _wrs_temporalMath.outerHTML
    		}

    		var contentWindow = _wrs_dialog.getDom('iframe').contentWindow;
    		contentWindow.wrs_setMathML(mathml);
    		_wrs_dialog.show();
    		contentWindow.wrs_setFocus();
    	}
    // }
}

/**
 * Opens formula editor to edit an existing formula.
 * @param object iframe Target
 */

function wrs_int_openExistingFormulaEditor(iframe, language) {
    _wrs_int_window_opened = true;
    _wrs_isNewElement = false;
    _wrs_int_temporalIframe = iframe;
    _wrs_int_window = wrs_openEditorWindow(language, iframe, true);
}

/**
 * Handles a mouse down event on the iframe.
 * @param object iframe Target
 * @param object element Element mouse downed
 */

function wrs_int_mousedownHandler(iframe, element) {
    if (element.nodeName.toLowerCase() == 'img') {
        if (wrs_containsClass(element, 'Wirisformula') || wrs_containsClass(element, 'Wiriscas')) {
            _wrs_int_temporalImageResizing = element;
        }
    }
}

/**
 * Handles a mouse up event on the iframe.
 */

function wrs_int_mouseupHandler() {
    if (_wrs_int_temporalImageResizing) {
        setTimeout(function() {
            _wrs_int_temporalImageResizing.removeAttribute('style');
            _wrs_int_temporalImageResizing.removeAttribute('width');
            _wrs_int_temporalImageResizing.removeAttribute('height');
        }, 10);
    }
}

function wrs_convertMMLToHTML(mathml, callback) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	div.style.textIndent = '-999px';
	div.style.fontSize = _wrs_fontSize + 'px';
	div.style.position = 'absolute';
	div.innerHTML = mathml;

	window.MathJax.Hub.Typeset(div, function() {
		var $div = $(div),
			$math = $div.find('[aria-readonly="true"]');

		if (!$math.length) {
			$math = $div.find('.window.MathJax_MathML');
		}

		var html = $math[0].outerHTML.replace(/id="[^\"]*?"/gi, '').replace(/id=[^\s]*?\s/gi, '');
		// div.parentNode.removeChild(div);
		callback(html);
	})
}

/**
 * Calls wrs_updateFormula with well params.
 * @param string mathml
 */

function wrs_int_updateFormula(mathml, editMode, language) {
	if (window.MathJax) {
		wrs_convertMMLToHTML(mathml, function(html) {
		    wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, html, _wrs_int_wirisProperties, editMode, language);
		});
	} else {
		wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, null, _wrs_int_wirisProperties, editMode, language);
	}

}

/**
 * 窗口关闭处理
 */
function wrs_int_notifyWindowClosed() {
    _wrs_int_window_opened = false;
    _wrs_dialog.close();
}


UE.plugins['formula'] = function() {

 	var me = this;
 	var opt = this.options;


 	me.commands['formula'] = {
 		execCommand: function() {
		 	// 当前编辑器。
		 	_wrs_cur_editor = me;

 			wrs_int_openNewFormulaEditor(me.iframe, "zh");
 		},

 		queryCommandState: function() {

 		}
 	};

 	if (!window.MathJax) {
 		var removeObjectNode = function() {
 			setTimeout(function() {
		 		// 获取所有的object节点。
		 		var objectNode = me.body.getElementsByTagName('object');
		 		UE.utils.each(objectNode, function(node) {
		 			if (node && node.nodeType == 1) {
				 		UE.dom.domUtils.remove(node);
			 		}
		 		});
	 		}, 10);
	 	};

	 	me.addListener('afterinserthtml', removeObjectNode);
	 	me.addListener('reset', removeObjectNode);
 	}

}

// 包裹公式。
UE.commands['formulawrap'] = {
	execCommand: function(command, node) {
		var me = this;

		if (window.MathJax) {
			var $node = $(node);

			var mathList = [];

			var mathNode = $node.find('[aria-readonly="true"]');
			if (mathNode && mathNode.length) {
				UE.utils.each(mathNode, function(math) {
					mathList.push(math);
				});
			}

			mathNode = $node.find('.MathJax_MathML');
			if (mathNode && mathNode.length) {
				if (mathNode && mathNode.length) {
					UE.utils.each(mathNode, function(math) {
						mathList.push(math);
					});
				}
			}

			var findNextScript = function(node) {
				var curNode  = node.nextSibling;

				if (!curNode) return;
				if (curNode.nodeName.toLowerCase() !== 'script') {
					return findNextScript(curNode);
				}

				return curNode;
			}

			var getMathMl = function(node) {

				var scriptNode = findNextScript(node);
				if (scriptNode) return $(scriptNode).html();

				var mathNode = (function() {
					var next = node.nextSibling;

					if (next) {
						while(next && next.nodeType !== 1 || next.nodeName.toLowerCase() == 'object') next = next.nextSibling;
						if (next && next.nodeName.toLowerCase() === 'math') return next;
					}

					return null;
				})();

				if (mathNode) {
					var html = mathNode.outerHTML;

					if (html == null &&　window.XMLSerializer) {
						html = (new XMLSerializer()).serializeToString(mathNode);
					}

					mathNode.parentNode.removeChild(mathNode);

					return html;
				}
			}

			UE.utils.each(mathList, function(math) {
				if (math) {
					var $math = $(math);
					$math.attr('contentEditable', 'false');

					var mathml = getMathMl($math[0]);

					if (mathml) {
						wrs_makeImageWrapMath(math, mathml);
					}
				}
			});
		} else {
			var doc = me.iframe.contentWindow.document,
				$doc = $(doc),
				maths = $doc.find('math');

			var removeNode = function() {
				// 考虑到没有只有没有插入flash的需求，所以看到object就直接移除了。
				$doc.find('object').remove();
			}

			UE.utils.each(maths, function(math) {
				wrs_makeImageWrapMath(math);
			});

			removeNode();
		}

	},
	notNeedUndo: true,
	ignoreContentChange: true
}

// 初始化公式编辑器。
UE.commands['formulainit'] = {
	execCommand: function(command) {
		var me = this;

		_wrs_cur_editor = me;

		wrs_renderEditor("zh");
	},
	notNeedUndo: true,
	ignoreContentChange: true
}

UE.alert = function() {
	var guid = function() {
        var counter = 0;

        return function( prefix ) {
            var guid = (+new Date()).toString( 32 ),
                i = 0;

            for ( ; i < 5; i++ ) {
                guid += Math.floor( Math.random() * 65535 ).toString( 32 );
            }

            return (prefix || 'mj_') + guid + (counter++).toString( 32 );
        };
    }();

    var msgBox;
    var msgId = 'errorMsgBox_' + guid();

    if (document.getElementById(msgId)) {
    	msgBox = document.getElementById(msgId);
    } else {
		msgBox = document.createElement('div');
		msgBox.id = msgId;
	}

	var showBox = function(message) {
		msgBox.innerHTML = message;

		var boxWidth = $(msgBox).width();
		var boxHeight = $(msgBox).height();

		msgBox.style.position = 'fixed';
		msgBox.style.left = (Math.max(document.body.clientWidth, document.documentElement.clientWidth) - boxWidth) / 2 + 'px';
		msgBox.style.top = (Math.max(document.body.clientHeight, document.documentElement.clientHeight) - boxHeight) / 2 + 'px';
		msgBox.style.zIndex = 9999;
		msgBox.style.display = 'block';
		msgBox.style.color = 'rgb(241, 12, 12)';
		msgBox.style.background = '#ffffff';
		msgBox.style.border =  '1px solid rgb(241, 12, 12)';
		msgBox.style.boxShadow =  'rgb(241, 172, 172) 0px 0px 9px;';
		msgBox.style.padding = '10px';

		document.body.appendChild(msgBox);
	};

	var hideBox = function() {
		msgBox.style.display = 'none';
	};

	var t1 = +new Date();
	return function(message) {
		var now = +new Date();

		if (now - t1 > 6000) {
			showBox(message);
			setTimeout(function() {
				hideBox();
				t1 = +new Date();
			}, 3000);
		}
	}
}();

UE.commands['getcontents'] = {
	execCommand: function() {
		var me = this,
			body = me.iframe.contentWindow.document.body,
			$body= $(body);

		if (window.MathJax) {
			var _$body = $body.clone();

			_$body.find('[data-module="true"]').each(function(index, math) {
				var $math = $(this);

				var mathml = decodeURIComponent($math.attr('data-mathml'));
				$math.replaceWith(mathml);
			});

			if (_$body.find('[aria-readonly="true"]').length > 0 || _$body.find('.MathJax_MathML').length > 0) {
				UE.alert('数据有异常，请"刷新"页面后答题！');
				return "";
			}

			_$body.find('input.input_radio').removeAttr('value').removeAttr('checked');
			_$body.find('input.input_line').removeAttr('value').removeAttr('checked');

			var contents = _$body.html();

			contents = contents
				.replace(/<\/?div[^>]*>/g,'')
				.replace('<!--?XML:NAMESPACE PREFIX = [default] http://www.w3.org/1998/Math/MathML NS = "http://www.w3.org/1998/Math/MathML" /-->', '')
				.replace('<?IMPORT NAMESPACE = [default] http://www.w3.org/1998/Math/MathML URN = "http://www.w3.org/1998/Math/MathML" IMPLEMENTATION = "#[default] http://www.w3.org/1998/Math/MathMLPlayer" DECLARENAMESPACE />', '')
				.replace(/<\?XML\:NAMESPACE PREFIX = \[default\] http\:\/\/www\.w3\.org\/1998\/Math\/MathML NS = \"http\:\/\/www\.w3\.org\/1998\/Math\/MathML\" \/>/, '')
				.replace(/<math style=".*?">/, '<math>')
				.replace(/<OBJECT id=\"\[default\] http:\/\/www.w3.org\/1998\/Math\/MathMLPlayer\" classid=clsid:32F66A20-7614-11D4-BD11-00104BD3F987><\/OBJECT>/gi, '')
				.replace(/<math style="DISPLAY: inline-block; CURSOR: pointer"/gi, '<math')

			return contents;
		} else {
			maths = $body.find('math');

			var removeNode = function() {
				$body.find('object').remove();
			}

			var mathList = [];
			UE.utils.each(maths, function(math) {
				var $math = $(math);
				$math
					.next()
					.remove();
				mathList.push($math.parent().attr('style'));
				$math.attr('style', '');
				$math.unwrap();
			});

			removeNode();

			var str = '&lt;?IMPORT NAMESPACE = [default] http://www.w3.org/1998/Math/MathML URN = &quot;http://www.w3.org/1998/Math/MathML&quot; IMPLEMENTATION = &quot;#[default] http://www.w3.org/1998/Math/MathMLPlayer&quot; DECLARENAMESPACE /&gt;'

			var contents = me.getContent().replace(str, "");

			UE.utils.each(maths, function(math, index) {
				var $math = $(math);

				$math
					.attr('style', mathList[index]);
			});

			me.execCommand('formulawrap');

			return contents;
		}
	},
	notNeedUndo: true,
	ignoreContentChange:true
};

UE.addListener('editorrenderend', function(editor) {
	_wrs_cur_editor = editor;

	if (window.MathJax) {
		$(editor.iframe.contentWindow.document)
			.on('dblclick', '[data-math-overlay]', function(e) {
				wrs_int_doubleClickHandler(editor, editor.iframe, this.parentNode);
			})

			.on('keydown', '[data-module="true"]', function(e) {
				if (e.keyCode == 8 || e.keyCode == 46) {
					e.preventDefault();
					alert('把光标定位到公式后面，然后按退格键，即可删除公式。')
				}
			});
	} else {
		$(editor.iframe.contentWindow.document)
			.on('dblclick', '[data-math-overlay]', function(e) {
				e.preventDefault();
				e.stopPropagation();

				var math = this.parentNode.firstChild;
				if (math.getAttribute('title')) {
					math.setAttribute('title', '');
				}

				wrs_int_doubleClickHandler(editor, editor.iframe, math);
			})

			.on('keydown', '[data-module="true"]', function(e) {
				if (e.keyCode == 8 || e.keyCode == 46) {
					e.preventDefault();
					alert('把光标定位到公式后面，然后按退格键，即可删除公式。')
				}
			})
	}
});

UE.addListener('aftermathinsert', function(element, mathml) {
	wrs_makeImageWrapMath(element, mathml);
});
