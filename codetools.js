function prepareCodeForSplit(raw) {
    var quoteLevel = 0;
    var inCurly = false;
    var out = "";
    for (var i = 0; i < raw.length; i++) {
        var cur = raw[i];
        var skipAdd = false;
        switch (cur) {
            case '"':
                if (inCurly) {
                    quoteLevel++;
                } else if (quoteLevel > 0) {
                    quoteLevel--;
                }
                break;
            case ';':
                if (quoteLevel === 0) {
                    skipAdd = true;
                }
                break;
            case '{':
                inCurly = true;
                break;
            case '}':
                inCurly = false;
                if (quoteLevel > 1) {
                    quoteLevel--;
                }
                break;
            case ',':
                out += (inCurly || quoteLevel > 0 ? "³" : cur);
                skipAdd = true;
                break;

        }
        if (!skipAdd) {
            out += cur;
        }

    }
    return out;
}

function restoreCodeAfterSplit(raw) {
    return raw.replace(/³/g, ",");
}


function splitParametersExpressions(raw) {
    var escaped = prepareCodeForSplit(raw.replace(/[\r\n]/g, ""));
    var result = escaped.split(",");
    for (var i = 0; i < result.length; i++) {
        result[i] = restoreCodeAfterSplit(result[i]).replace(/^\s+$/, "");
    }
    return result;
}