if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

function parseMarkDown(md) {
    var result = [];
    var nl = md.indexOf("\r\n") > -1 ? "\r\n" : "\n";
    var lines = md.split(nl);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var pMulti = /\*\*exp([A-Z]+)([0-9]+)\.\.\.exp([A-Z]+)([0-9]+)\*\*\t(.+)$/.exec(line);
        var pSingle = /\*\*exp([A-Z]+)([0-9]+)\*\*\t(.+)$/.exec(line);
        if (pMulti) {
            // example follows in next line:
            // **expN1...expN4** coordinates for the browser: upper, left, lower, right

            var st = parseInt(pMulti[2]);
            var en = parseInt(pMulti[4]);
            var descParts = pMulti[5].split(":"); // description parts: left is description. right contains comma separated list of sub descriptions
            var mainDesc = descParts[0];
            var paraSubParts = descParts[1].split(",");
            for (var j = st; j <= en; j++) {
                result.push({
                        literal: "exp" + pMulti[1] + j.toString(),
                        type: pMulti[1],
                        position: j,
                        description: mainDesc + ": " + paraSubParts[j - st].trim()
                    }
                );
            }
            //console.warn("multi ",line);
        } else if (pSingle) {
            result.push({
                literal: "exp" + pSingle[1] + pSingle[2],
                type: pSingle[1],
                position: parseInt(pSingle[2]),
                description: pSingle[3].trim()
            });
        }
        else {
            console.warn("no md match ", line);
        }
    }
    return result;
}

var functionParamap = {
    "E_NO_TBR": parseMarkDown("**expN1...expN4**\tcoordinates for the browser: upper, left, lower, right\n" +
        "**expC5**\tDummy parameter. Is only used in e_ra_tbr   \n" +
        "**expC6**\tColors used for browser in (same schema like SET COLOR)   \n" +
        "**expA7**\tArray of field names to show in browser   \n" +
        "**expC8**\tInfo Text to display in browser lz21   \n" +
        "**expC9**\tName of a user-defined function. It is called by whenever an unidentified key is pressed   \n" +
        "**expAC10**\tArray of headers to show in browser or single text show repeated for each column. If array is passed it has to have same amount of elements as the expA7\tparameter   \n" +
        "**expL11**\tDummy/Obsolete parameter      \n" +
        "**expA12**\tArray of widths used for columns      \n" +
        "**expAB13**\tArray of codeblocks that are used to check if a column is editable or not. Is ignored when expB24\tis set   \n" +
        "**expAB14**\tArray of codeblocks that are used to check if a column editor can be quit (validation). Is ignored when expEditor\tis set. Also note, if you pass an array of .F. the user will never be able to leave the editor.      \n" +
        "**expB15**\tSKIPBLOCK: Code block for moving records forward or backward   \n" +
        "**expB16**\tGOTOPBLOCK: Code block for moving to the very top of all data   \n" +
        "**expB17**\tGOBOTTOMBLOCK: Code block for moving to the very bottom of all data   \n" +
        "**expAC18**\txcHeadSep header seperator (default is |- )   \n" +
        "**expAC19**\txcColSep column seperator (default is | )   \n" +
        "**expAC20**\txcFootSep Footing seperator (default is | )   \n" +
        "**expAC21**\txcFootLines Footing text   \n" +
        "**expB22**\tbCustom custom code block assigned to tbrowse object. purpose unknown   \n" +
        "**expN23**\tNumber of frozen columns to the left (default is 0 = NONE)   \n" +
        "**expAB24**\tCustom editor field editor code block.   \n" +
        "**expAC25**\tArray of colors for each column   \n" +
        "**expB26**\tMysterious cbUnt_Anz   \n" +
        "**expB27**\tMysterious pB21   ")
};


function prepareCodeForSplit(raw) {
    var inQoute = false;
    var inCurly = false;
    var out = "";
    for (var i = 0; i < raw.length; i++) {
        var cur = raw[i];
        var skipAdd = false;
        switch (cur) {
            case '"':
                if (!inCurly) {
                    inQoute = !inQoute;
                }
                break;
            case ';':
                if (!inQoute) {
                    skipAdd = true;
                }
                break;
            case '{':
                inCurly = true;
                break;
            case '}':
                inCurly = false;
                break;
            case ',':
                out += (inQoute || inCurly > 0 ? "³" : cur);
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

function parseCodeSections(raw) {
    var fuMatch = /([a-zA-Z_]+)\s*\(/.exec(raw);
    if (fuMatch) {
        var ps = {
            functionName: fuMatch[1].toUpperCase()
        };
        var lbracket = raw.lastIndexOf(")");
        var t = raw.substr(0, lbracket).substr(fuMatch[0].length);
        ps.literalParameters = splitParametersExpressions(t);
        ps.parameters = functionParamap[ps.functionName];
        return ps;
    }
    return {};
}

function splitParametersExpressions(raw) {
    var escaped = prepareCodeForSplit(raw.replace(/[\r\n]/g, ""));
    var result = escaped.split(",");
    for (var i = 0; i < result.length; i++) {
        result[i] = restoreCodeAfterSplit(result[i]).trim();
    }
    return result;
}
