module.exports = LiveMDE

var Nanocomponent = require('nanocomponent')
var SimpleMDE = require('simplemde')
var assert = require('assert')
var html = require('bel')

function LiveMDE (opts) {
    if (!(this instanceof LiveMDE)) {
        return new LiveMDE(opts)
    }
    Nanocomponent.call(this)

    this.editor = null
    this.listener = null
    this.opts = opts || {}
}

LiveMDE.prototype = Object.create(Nanocomponent.prototype)

/**
 * Nanocompent overrides
 */
LiveMDE.prototype.createElement = function (name, value) {
    this.name = name || 'livemde'
    this.value = value || ''

    return html`<div>
        <textarea>${value}</textarea>
    </div>`
}

LiveMDE.prototype.update = function (name, value) {
    return this.name !== name || this.value !== value;
}

LiveMDE.prototype.load = function (el) {
    var self = this
    self.opts.element =  el.querySelector('textarea')
    self.editor = new SimpleMDE(this.opts)
    self.editor.codemirror.on('change', function (mirror, change) {
        if (self.listener && change.origin) self.listener({
            name: self.name,
            change: change
        })
    })
}

/**
 * LiveMDE features
 */
LiveMDE.prototype.apply = function (update) {
    if (this.name === update.name) applyChange(this.editor.codemirror, update.change)
}

LiveMDE.prototype.listen = function (cb) {
    this.listener = cb
}

/**
 * Private methods
 */
function applyChange (mirror, change) {
    mirror.replaceRange(change.text.join('\n'), change.from, change.to)

    if (change.next) {
        applyChange(change.next)
    }
}
