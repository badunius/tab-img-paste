// ==UserScript==
// @name         Tabun Image Uploader
// @include      https://tabun.everypony.*
// @version      0.1.1
// @description  upload images by pasting them
// @author       badunius
// @match        https://tampermonkey.net/index.php?version=4.8&ext=dhdg&updated=true
// @grant        GM_xmlhttpRequest
// @downloadURL  http://badunasus/TBL.user.js
// @updateURL    http://badunasus/TBL.user.js
// ==/UserScript==

/**
 * Returns LS security key
 */
const getKey = () => {
	const link = document.querySelector('li.item-signout a')
	const href = link && link.href || ''
	const query = href.split('?')[1] || ''
	const key = query.split('=')[1] || ''
	return key
}

/**
 * Returns image as file from clipboard items
 */
const getImage = (items) => {
	for (let item of items) {
		if (item.type.includes('image')) {
			return item.getAsFile()
		}
	}
	
	return null
}

/**
 * Creates and sends a form
 */
const sendImage = async (image) => {
	const form = new FormData()
	form.append('img_file', image)
	form.append('title', '')
	form.append('security_ls_key', getKey())
  console.log('FORM', form)

  GM.xmlHttpRequest({
    method: "GET",
    url: "http://www.example.com/",
    onload: function(response) {
      alert(response.responseText);
    }
  });
  /*
  GM.xmlHttpRequest({
    method: "POST",
    url: '/ajax/upload/image/',
    data: form,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(response) {
      console.log('>>>', response)
    },
    onprogress: function(evt) {
      console.log('<<<', evt)
    },
  }); */
  
	const res = {} /* await fetch('/ajax/upload/image/', {
		method: 'POST',
		body: form
	}) */
  console.log('RES', res)
  
	const text = await res.text()
  console.log('TEXT', text)

	const json = JSON.parse(new DOMParser().parseFromString(text, 'text/html').querySelector('textarea').textContent)


	console.log(json)
	return json
}

/**
 * Insert tag
 */
const pasteTag = (target, data) => {
	const start = target.selectionStart
	const end = target.selectionEnd
	const text = target.value

	const before = text.slice(0, start)
	const after = text.slice(end)
	const middle = data.sText || ''

	target.value = `${before}${middle}${after}`
	target.selectionStart = start
	target.selectionEnd = start + middle.length
}

const onPaste = (evt) => {
	if (evt.target.tagName !== 'TEXTAREA') { return }

	const  { items } = evt.clipboardData
	const image = getImage(items)
	if (!image) { return }
	
	console.log(image)
	sendImage(image)
		.then(res => pasteTag(evt.target, res))
}
  


(function() {
  'use strict';

  document.addEventListener('paste', onPaste)
  console.log('Loaded+')
})()