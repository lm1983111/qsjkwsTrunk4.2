define( function(require, exports, module) {
    var $ = require('jquery');
    //var moment=require('moment');
    var Q=require('q');
    var _=require('underscore');

    var formatterSerialize= function (str) {
        var str = str.split("&");
        var newOb = {}
        for (var i = 0; i < str.length; i++) {
            var item = str[i].split("=");
            newOb[item[0]] = item[1]
        }
        return newOb;
    };

    var realLength=function (str) {
        return str.replace(/[^\x00-\xff]/g, "**").length; // [^\x00-\xff] - 匹配非双字节的字符
    }

    var str_substr=function (currentVal,maxleng) {
        var len = 0;
        for (var i = 0; i < currentVal.length; i++) {
            var a = currentVal.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        if(len>maxleng)
        {
            var m=Math.floor(currentVal.length*0.5)
            for(var i=m;i<currentVal.length;i++) {
                var curV = realLength(currentVal.substr(0, i));
                if (curV >= maxleng) {
                    return currentVal.substr(0, i)+"......";
                }
            }
        }
        return currentVal;
    };


    var defaultOb = {
        "pageNum": 1,
        "pageSize": 8,
        "order": "1"
    };
    $(function () {
        Q.reg(/singlePage\/\?(.*)/, function (paraStr) { //正则表达式注册URL，访问匹配该正则表达式的URL时，就会触发回调，在回调中我们修改页面DOM实现无刷新变换内容，para为查询参数字符串
            var tempData = formatterSerialize(paraStr);
            tempData.jwtToken=jtwToken;
            $.extend(defaultOb, tempData); //扩展默认传参
            $.ajax({
                url: ROOT_PATH+"officialWebsite/newsList",
                dataType: 'json',
                data: tempData,
                success: function (data) {
                    if (data.status) {
                        if (data.dataList.length) {  //模板展示新闻数据
                            var tplData = data.dataList;
                            for(k in tplData){
                                if(tplData[k]["createTime"]){
                                    var timestamp4 = new Date(tplData[k]["createTime"]);
                                    tplData[k]["createTime"]=timestamp4.toLocaleDateString().replace(/\//g, "-");//moment(tplData[k]["createTime"]).format('YYYY.MM.DD')
                                }
                                if(tplData[k]["descr"]){
                                    if($("body").width()>=1200){
                                        tplData[k]["descr"]=str_substr(tplData[k]["descr"],240);
                                    }else if($("body").width()>=992 && $("body").width()<1200){
                                        tplData[k]["descr"]=str_substr(tplData[k]["descr"],180);
                                    }
                                }

                            }
                            var tpl = _.template($("#listTpl").html());
                            $("#newsIndexList").removeClass("data-loading")
                            $("#newsIndexList").html(tpl({"datas": tplData}));
                            $("body,html").scrollTop(0)
                        } else if (data.dataList.length == 0) {
                            $("#newsIndexList").html("");
                        }
                        funOb.renderPagination(data);  //展示分页数据
                    }
                },
                error:function (err) {
                    var defaultOb = {
                        "pageNum": 1,
                        "pageSize": 8,
                        "order": "1",
                        "t":"1"
                    };
                    var pagesStr = "singlePage/?"+$.param(defaultOb);
                    Q.go(pagesStr)
                }
            })
        });

        Q.init({
            index: 'singlePage/?' + $.param(defaultOb) //首页地址
        });
        //渲染分页控制器
        //funOb.initPaginationControl();
    });

    var funOb = {
        initPaginationControl: function () {

        },
        changeUrl: function (pageNum) {  //改变URL，触发Q.js回调函数
            var dataOb = { //收集查询参数
                "pageNum": $("#pages").val(),  //页码
                "pageSize": 8, //每页条数
                "order": "1"
            };
            dataOb.pageNum = pageNum;
            var urlStr = "singlePage/?" + $.param(dataOb);
            Q.go(urlStr);
        },
        renderPagination: function (data) {
            var pageNum,
                currentPage = data.currentPage,
                totalPage = data.totalPage;

            if (currentPage > totalPage) {//当前页码大于总页码
                $("#pages").val(totalPage);
                funOb.changeUrl(totalPage);
            } else {
                $("#pages").val(currentPage);
            }

            $("#totalPage").val(totalPage);

            //加载页码
            funOb.pageLoad(currentPage, totalPage);

            //绑定事件
            //点击首页，上一页，下一页，首页， 尾页，查询分页数据
            $('#J_Pagination').on('click', '.page-item', function () {
                var pNum = parseInt($(this).text());
                funOb.changeUrl(pNum);
            }).on('click', '#firstPage', function () {
                funOb.changeUrl(1);
            }).on('click', '#prevPage', function () {
                if (currentPage != "" && currentPage > 1) {
                    pageNum = currentPage - 1;
                    funOb.changeUrl(pageNum);
                }
            }).on('click', '#nextPage', function () {
                if (currentPage != "" && currentPage < totalPage) {
                    pageNum = currentPage + 1;
                    funOb.changeUrl(pageNum);
                }
            }).on('click', '#lastPage', function () {
                funOb.changeUrl(parseInt($("#totalPage").val()));
            })
        },
        pageLoad: function (curPage, totalPage) {//分页加载
            var maxNum = 10,//页码显示个数
                prevNum = 2,//当前页之前页码的显示数
                nextNum = maxNum - prevNum - 1,//当前页之后页码的显示数
                pageHtml = '';
            if (curPage > 1) {
                pageHtml += '<a id="firstPage" href="javascript:;">首页</a><a id="prevPage" href="javascript:;">上一页</a>';
            }
            for (var i = 1; i <= totalPage; i++) {
                if (i == curPage) {//当前页码
                    pageHtml += '<b>' + i + '</b>';
                } else {
                    if (totalPage > maxNum) {//总页码数大于最大显示数
                        if (curPage <= prevNum && i <= maxNum) {//当前页之后的页码补全至最大显示数
                            pageHtml += '<a class="page-item" href="javascript:void(0)" >' + i + '</a>';
                        } else if (totalPage - curPage < nextNum && i >= totalPage - maxNum + 1) {//当前页之前的页码补全至最大显示数
                            pageHtml += '<a class="page-item" href="javascript:void(0)" >' + i + '</a>';
                        } else if ((i < curPage && i >= curPage - prevNum) || i > curPage && i <= nextNum + curPage) {//按配置输出当前页的前后页码
                            pageHtml += '<a class="page-item" href="javascript:void(0)" >' + i + '</a>';
                        }
                    } else {//总页码数小于等于最大显示数时，输出所有页码
                        pageHtml += '<a class="page-item" href="javascript:void(0)" >' + i + '</a>';
                    }
                }
            }
            if (totalPage > curPage) {
                pageHtml += '<a id="nextPage" href="javascript:;">下一页</a><a id="lastPage" href="javascript:;">尾页</a>';
            }
            $('#J_Pagination').html(pageHtml);
        }
    };
})

