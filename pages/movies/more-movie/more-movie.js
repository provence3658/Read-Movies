// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigateTitlt: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;

        //动态设置导航栏
        wx.setNavigationBarTitle({
            title: category,
        })

        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.doubanBase + "/v2/movie/top250";
                break;
        }
        util.http(dataUrl, this.callBack);
        this.data.requestUrl = dataUrl;
    },

    callBack: function (data) {
        var movies = [];
        for (var idx in data.subjects) {
            var subject = data.subjects[idx];
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
        var totalMovies = {};
        if(!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
            //this.data.movies是之前的
            //movies是新加载的20条
            console.log("false");
        }
        else {
            totalMovies = movies;
            console.log("true");
            this.data.isEmpty = false;
        }
        this.data.totalCount += 20;
        this.setData({
            movies: totalMovies
        });       
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        // console.log(movies);
    },
    //由于下拉刷新和scroll-view不可以同时使用, 改用onReachBottom
    // onScrollLower: function(event) {
    //     // console.log("加载更多");
    //     var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    //     util.http(nextUrl, this.callBack);
    //     wx.showNavigationBarLoading();
    // },

    onReachBottom: function(event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.callBack);
        wx.showNavigationBarLoading();
    },

    onPullDownRefresh: function(event) {
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";
        this.data.isEmpty = true;
        this.data.movies = {};   
        util.http(refreshUrl, this.callBack);
        this.data.totalCount = 0;
        wx.showNavigationBarLoading();
    },

    //电影详情页面跳转
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        })
        // console.log(movieId);
    }
})