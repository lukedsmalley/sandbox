
function postCommand(command, args, callback) {
    function onReadyStateChanged() {
        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200) {
                callback(null, xmlHttpRequest.responseText)
            } else {
                callback('Request returned status ' + xmlHttpRequest.status + ': ' + xmlHttpRequest.responseText, null)
            }
        }
    }

    var xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.onreadystatechange = onReadyStateChanged
    xmlHttpRequest.open('POST', '/command/' + command)
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json')
    xmlHttpRequest.send(JSON.stringify(args))
}

var commandBox = document.querySelector('#command')
var outputBox = document.querySelector('#output')
var fileBox = document.querySelector('#file')

var commands = {}
var mapCommand = (command, handler) => (commands[command] = handler)

function splitArgs(argString) {
    let  args = []
    let current = ''
    let literal = false
    
    for (let i = 0; i < argString.length; i++) {
        if (!literal && argString.substring(i, argString.length).startsWith('//')) return

        let c = argString.substr(i, 1)
        if (literal) {
            if (c == '"') {
                if (current.length > 0) {
                    args.push(current)
                    current = ''
                }
                literal = false
            } else {
                current += c
            }
        } else {
            if (c == '"') {
                if (current.length > 0) {
                    args.push(current)
                    current = ''
                }
                literal = true
            } else if (c == ' ' || c == '\n' || c == '\r' || c == '\t') {
                if (current.length > 0) {
                    args.push(current)
                    current = ''
                }
            } else {
                current += c
            }
        }
    }
    
    if (current.length > 0) {
        args.push(current)
        current = ''
    }
    
    return args
}

function executeCommand(command) {
    if (command.startsWith('//')) return

    let commandName, args, remainder
    if (command.indexOf(' ') > -1) {
        commandName = command.split(' ')[0]
        let preparsedRemainder = command.substring(commandName.length + 1, command.length)
        args = splitArgs(preparsedRemainder)
        remainder = args.join(' ')
    } else {
        commandName = command
        args = []
        remainder = ''
    }

    if (!commands.hasOwnProperty(commandName)) {
        outputBox.value = '// ' + commandName + ' is not a valid command. Use \'help\' for a list of commands.'
    }

    try {
        commands[commandName](args, remainder)
        commandBox.value = ''
    } catch (err) {
        outputBox.value = '// ' + err
    }
}

commandBox.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        executeCommand(commandBox.value)
    }
}, false)

outputBox.addEventListener('dblclick', function(e) {
    executeCommand(outputBox.value)
})


mapCommand('help', function(args, remainder) {
    outputBox.value = '// Commands:  load <filename>  |  save <filename>'
})

mapCommand('load', function(args, remainder) {
    postCommand('load', {filename: remainder}, function(err, data) {
        if (err == null) {
            outputBox.value = 'save ' + remainder
            fileBox.innerHTML = data
        } else {
            outputBox.value = '// ' + err
        }
    })
})

mapCommand('save', function(args, remainder) {
    postCommand('save', {filename: args[0], data: fileBox.value}, function(err, data) {
        if (err != null) {
            outputBox.value = '// ' + err
        }
    })
})