// pages/movies/movie-detail/movie-detail.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.id;
        var url = app.doubanBase + "/v2/movie/subject/" + movieId;
        util.http(url, this.callBack);
    },

    callBack: function(data) {
        if(!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
        }
        if(data.directors[0] != null) {
            if(data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large;               
            }
            director.name = data.directors[0].name;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentsCount: data.comments_count,
            year: data.year,
            genres: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        // console.log(movie);
        this.setData({
            movie: movie
        })
        // console.log(data);
    },

    onPreviewImg: function(event) {
        console.log(1);
        var url = event.currentTarget.dataset.src;
        wx.previewImage({
            current: url,
            urls: [url],
        })
    }
})