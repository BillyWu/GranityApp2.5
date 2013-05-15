    function op_delete(suff)
    {
        var sl = oBarbox.options.selectedIndex;
        sl = sl >= oBarbox.options.length ? oBarbox.options.length - 1 : sl < 0 ? 0 : sl;
        if (sl < 0 || !oBarbox.options[sl]) return;
        var txmKC = oBarbox.options[sl].text.substr(0, 11);
        oBarbox.options.remove(sl);
        //更新明细尺码数量
        var strSize = txmKC.substr(10, 1);
        if(!suff) suff="";
        var size = ["", "XS"+suff, "S"+suff, "M"+suff, "L"+suff, "XL"+suff, "XXL"+suff, "XXXL"+suff, "XXXXL"+suff];
        //检查单据内条码信息
        var band = $band("detail");
        var index = -1;
        for (var i = 0, len = band.RecordCount(); i < len; i++)
        {
            var kc = band.getFldStrValue("款号颜色条码", i);
            var sT = band.getFldStrValue("尺码", i);
            if (txmKC != kc || sT != size[strSize])
                continue;
            index = i;
            break;
        }
        if (index < 0) return;
        //依据条码文本列表统计同款号颜色尺码数量
        txmKC = txmKC.substr(0, 10);
        var strKCS = txmKC + strSize;
        var countT = 0;
        var re = new RegExp("\\b" + strKCS + "\\w{4}\\b", "ig");
        for (var i = 0; i < oBarbox.options.length; i++)
        {
            var matchs = oBarbox.options[i].text.match(re);
            countT += !matchs ? 0 : 1;
        }
        if (countT > -1)
        {
            band.setFldStrValue(index, "条码数量", countT);
            band.CalXmlLand.Calculate(index);
        } 
        if (band.Grid) band.Grid.Sum();

        if (sl < oBarbox.options.length)
            oBarbox.options[sl].selected = true;
        else if (oBarbox.options.length > 0)
            oBarbox.options[sl - 1].selected = true;
    }           
