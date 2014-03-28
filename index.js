#!/usr/bin/env node
var split = require('binary-split')
var sorto = require('sorto')
var expandHomeDir = require('expand-home-dir')
var spawn = require('child_process').spawn
var fs = require('fs')

var freq = {}
var bsplit = split()
var grep = spawn('grep', ['^git'])
fs.createReadStream(expandHomeDir('~/.bash_history')).pipe(grep.stdin)
grep.stdout.pipe(bsplit)

bsplit.on('data', function(ch) {
  var parts = ch.toString().split(' ')
  var verb = parts[1]
  if (verb && verb.length > 0) {
    if (!freq[verb]) freq[verb] = 1
    else freq[verb]++
  }
}).on('end', function() {
  var items = sorto.byval(freq)
  items.map(function(i) { console.log(i) })
})