// pages/movies/movies.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters:{},
        comingSoon:{},
        top250:{},
        searchResult:{},
        containerShow:true,
        searchPanelShow:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (event) {
        var inTheaterUrl = app.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheaterUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: "GET",
            header: {
                "content-type": "json"
            },
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            }
        })
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.convertToStarsArray(subject.rating.stars)
            }
            movies.push(temp);
        }
        var readyData = {}; 
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData);
        // console.log(movies);
    },

    //更多页面跳转
    onMoreTap:function(event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        })
    },
    
    //电影详情页面跳转
    onMovieTap: function(event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        })
        // console.log(movieId);
    },

    onBindFocus: function(event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onBindChange: function(event) {
        var text = event.detail.value;
        var searchUrl = app.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },

    onCancelImgTap:function(event) {
        this.setData({
            containerShow:true,
            searchPanelShow:false,
            searchResult:{}
        })
    }
})