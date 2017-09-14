var LiveMDE = require('./')
var css = require('sheetify')

css('simplemde/dist/simplemde.min.css')

var one = LiveMDE()
var two = LiveMDE()
sync(one, two)
sync(two, one)

document.body.appendChild(one.render('test'))
document.body.appendChild(two.render('test'))

function sync (from, to) {
    from.listen(function (change) {
        to.apply(change)
    })
}
