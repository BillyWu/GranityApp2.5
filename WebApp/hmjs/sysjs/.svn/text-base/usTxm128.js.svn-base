   function buildTXM(bh,height) {
        //code128±àÂëºÚ°×¼ä¸ô±àºÅ·½Ê½
        height=(!height)?50:height;        
        var codebs = ['bbsbbssbbss', 'bbssbbsbbss', 'bbssbbssbbs', 'bssbssbbsss', 'bssbsssbbss', 'bsssbssbbss', 'bssbbssbsss', 'bssbbsssbss', 'bsssbbssbss', 'bbssbssbsss', 'bbssbsssbss', 'bbsssbssbss', 'bsbbssbbbss', 'bssbbsbbbss', 'bssbbssbbbs', 'bsbbbssbbss', 'bssbbbsbbss', 'bssbbbssbbs', 'bbssbbbssbs', 'bbssbsbbbss', 'bbssbssbbbs', 'bbsbbbssbss', 'bbssbbbsbss', 'bbbsbbsbbbs', 'bbbsbssbbss', 'bbbssbsbbss', 'bbbssbssbbs', 'bbbsbbssbss', 'bbbssbbsbss', 'bbbssbbssbs', 'bbsbbsbbsss', 'bbsbbsssbbs', 'bbsssbbsbbs', 'bsbsssbbsss', 'bsssbsbbsss', 'bsssbsssbbs', 'bsbbsssbsss', 'bsssbbsbsss', 'bsssbbsssbs', 'bbsbsssbsss', 'bbsssbsbsss', 'bbsssbsssbs', 'bsbbsbbbsss', 'bsbbsssbbbs', 'bsssbbsbbbs', 'bsbbbsbbsss', 'bsbbbsssbbs', 'bsssbbbsbbs', 'bbbsbbbsbbs', 'bbsbsssbbbs', 'bbsssbsbbbs', 'bbsbbbsbsss', 'bbsbbbsssbs', 'bbsbbbsbbbs', 'bbbsbsbbsss', 'bbbsbsssbbs', 'bbbsssbsbbs', 'bbbsbbsbsss', 'bbbsbbsssbs', 'bbbsssbbsbs', 'bbbsbbbbsbs', 'bbssbssssbs', 'bbbbsssbsbs', 'bsbssbbssss', 'bsbssssbbss', 'bssbsbbssss', 'bssbssssbbs', 'bssssbsbbss', 'bssssbssbbs', 'bsbbssbssss', 'bsbbssssbss', 'bssbbsbssss', 'bssbbssssbs', 'bssssbbsbss', 'bssssbbssbs', 'bbssssbssbs', 'bbssbsbssss', 'bbbbsbbbsbs', 'bbssssbsbss', 'bsssbbbbsbs', 'bsbssbbbbss', 'bssbsbbbbss', 'bssbssbbbbs', 'bsbbbbssbss', 'bssbbbbsbss', 'bssbbbbssbs', 'bbbbsbssbss', 'bbbbssbsbss', 'bbbbssbssbs', 'bbsbbsbbbbs', 'bbsbbbbsbbs', 'bbbbsbbsbbs', 'bsbsbbbbsss', 'bsbsssbbbbs', 'bsssbsbbbbs', 'bsbbbbsbsss', 'bsbbbbsssbs', 'bbbbsbsbsss', 'bbbbsbsssbs', 'bsbbbsbbbbs', 'bsbbbbsbbbs', 'bbbsbsbbbbs', 'bbbbsbsbbbs', 'bbsbssssbss', 'bbsbssbssss', 'bbsbssbbbss', 'bbsssbbbsbsbb'];
        var s = "<span style='height:"+ height +";width:1;background:#FFFFFF;'></span>";
        var b = "<span style='height:"+ height +";width:1;background:#000000;'></span>";

        //Ê¹ÓÃcode128B±àÂë
        var tmstart = 104;
        var sum = tmstart;
        var tmspan = codebs[tmstart];
        var tmResult = "";
        for (var i = 0; i < bh.length; i++) {
            var charval = bh.charCodeAt(i);
            charval += charval < 32 ? 64 : -32;
            sum += charval * (i+1);
            tmspan += codebs[charval];
        }
        var tmvalidate = sum % 103;
        tmspan += codebs[tmvalidate] + codebs[codebs.length - 1];
        for (var i = 0; i < tmspan.length; i++) {
            if ("b" == tmspan.substr(i, 1))
                tmResult += b;
            else
                tmResult += s;
        }
        return tmResult;
    }
    function buildTXM128C(bh,height) {
        //code128±àÂëºÚ°×¼ä¸ô±àºÅ·½Ê½
        height=(!height)?50:height;
        var codebs = ['bbsbbssbbss', 'bbssbbsbbss', 'bbssbbssbbs', 'bssbssbbsss', 'bssbsssbbss', 'bsssbssbbss', 'bssbbssbsss', 'bssbbsssbss', 'bsssbbssbss', 'bbssbssbsss', 'bbssbsssbss', 'bbsssbssbss', 'bsbbssbbbss', 'bssbbsbbbss', 'bssbbssbbbs', 'bsbbbssbbss', 'bssbbbsbbss', 'bssbbbssbbs', 'bbssbbbssbs', 'bbssbsbbbss', 'bbssbssbbbs', 'bbsbbbssbss', 'bbssbbbsbss', 'bbbsbbsbbbs', 'bbbsbssbbss', 'bbbssbsbbss', 'bbbssbssbbs', 'bbbsbbssbss', 'bbbssbbsbss', 'bbbssbbssbs', 'bbsbbsbbsss', 'bbsbbsssbbs', 'bbsssbbsbbs', 'bsbsssbbsss', 'bsssbsbbsss', 'bsssbsssbbs', 'bsbbsssbsss', 'bsssbbsbsss', 'bsssbbsssbs', 'bbsbsssbsss', 'bbsssbsbsss', 'bbsssbsssbs', 'bsbbsbbbsss', 'bsbbsssbbbs', 'bsssbbsbbbs', 'bsbbbsbbsss', 'bsbbbsssbbs', 'bsssbbbsbbs', 'bbbsbbbsbbs', 'bbsbsssbbbs', 'bbsssbsbbbs', 'bbsbbbsbsss', 'bbsbbbsssbs', 'bbsbbbsbbbs', 'bbbsbsbbsss', 'bbbsbsssbbs', 'bbbsssbsbbs', 'bbbsbbsbsss', 'bbbsbbsssbs', 'bbbsssbbsbs', 'bbbsbbbbsbs', 'bbssbssssbs', 'bbbbsssbsbs', 'bsbssbbssss', 'bsbssssbbss', 'bssbsbbssss', 'bssbssssbbs', 'bssssbsbbss', 'bssssbssbbs', 'bsbbssbssss', 'bsbbssssbss', 'bssbbsbssss', 'bssbbssssbs', 'bssssbbsbss', 'bssssbbssbs', 'bbssssbssbs', 'bbssbsbssss', 'bbbbsbbbsbs', 'bbssssbsbss', 'bsssbbbbsbs', 'bsbssbbbbss', 'bssbsbbbbss', 'bssbssbbbbs', 'bsbbbbssbss', 'bssbbbbsbss', 'bssbbbbssbs', 'bbbbsbssbss', 'bbbbssbsbss', 'bbbbssbssbs', 'bbsbbsbbbbs', 'bbsbbbbsbbs', 'bbbbsbbsbbs', 'bsbsbbbbsss', 'bsbsssbbbbs', 'bsssbsbbbbs', 'bsbbbbsbsss', 'bsbbbbsssbs', 'bbbbsbsbsss', 'bbbbsbsssbs', 'bsbbbsbbbbs', 'bsbbbbsbbbs', 'bbbsbsbbbbs', 'bbbbsbsbbbs', 'bbsbssssbss', 'bbsbssbssss', 'bbsbssbbbss', 'bbsssbbbsbsbb'];
        var s = "<span style='height:"+ height +";width:1;background:#FFFFFF;'></span>";
        var b = "<span style='height:"+ height +";width:1;background:#000000;'></span>";

        if (0 < bh.length % 2)
            bh = "0" + bh;
        //Ê¹ÓÃcode128B±àÂë
        var tmstart = 105;
        var sum = tmstart;
        var tmspan = codebs[tmstart];
        var tmResult = "";
        for (var i = 0; i < bh.length; i += 2) {
            var charval = parseInt(bh.substr(i, 2),10);
            sum += charval * (i + 2) / 2;
            tmspan += codebs[charval];
        }
        var tmvalidate = sum % 103;
        tmspan += codebs[tmvalidate] + codebs[codebs.length - 1];
        for (var i = 0; i < tmspan.length; i++) {
            if ("b" == tmspan.substr(i, 1))
                tmResult += b;
            else
                tmResult += s;
        }
        return tmResult;
    }
