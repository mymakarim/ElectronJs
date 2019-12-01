'use strict'

const fs = require('fs')
const path = require('path')
const app = require('electron').remote.app
const cheerio = require('cheerio')

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

let webRoot = path.dirname(__dirname)
window.view = require(path.join(webRoot, 'view.js'))
window.model = require(path.join(webRoot, 'model.js'))
window.model.db = path.join(app.getPath('userData'), 'example.db')

// Compose the DOM from separate HTML concerns; each from its own file.
let htmlPath = path.join(app.getAppPath(), 'app', 'html')
let body = fs.readFileSync(path.join(htmlPath, 'body.html'), 'utf8')
let navBar = fs.readFileSync(path.join(htmlPath, 'nav-bar.html'), 'utf8')
let menu = fs.readFileSync(path.join(htmlPath, 'menu.html'), 'utf8')

let O = cheerio.load(body)
O('#nav-bar').append(navBar)
O('#menu').append(menu)

// Pass the DOM from Cheerio to jQuery.
let dom = O.html()
$('body').html(dom)

$('document').ready(function () {
  var columns = ['contact_id', 'first_name', 'last_name', 'email', 'phone'];
  window.model.getTable('contacts', columns , 'first_name' , 'ASC', '10', '0')
})
