// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts_data.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var postId = options.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData
        });

        var postsCollected = wx.getStorageSync("posts_collected");
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }

        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true,
            })
            app.g_isPlayingMusic = true;
            app.g_currentMusicPostId = that.data.currentPostId;
        })

        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false,
            })
            app.g_isPlayingMusic = false;
            app.g_currentMusicPostId = null;
        })

        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false,
            })
            app.g_isPlayingMusic = false;
            app.g_currentMusicPostId = null;
        })

        if (app.g_isPlayingMusic && app.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true,
            })
        }
    },

    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync("posts_collected");
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postCollected, postsCollected);
    },
    showToast: function (postCollected, postsCollected) {
        //更新文章是否收藏的缓存值
        wx.setStorageSync("posts_collected", postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        }),
            wx.showToast({
                title: postCollected ? "收藏成功" : "取消收藏",
                duration: 1000,
                icon: "success"
            })
    },

    showModal: function (postCollected, postsCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "是否收藏" : "是否取消收藏",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#aaa",
            confirmText: "确定",
            confirmColor: "#4b556c",
            success: function (res) {
                if (res.confirm) {
                    //更新文章是否收藏的缓存值
                    wx.setStorageSync("posts_collected", postsCollected);
                    //更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享到好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"];
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                wx.showModal({
                    title: '内容' + itemList[res.tapIndex],
                })
            }
        })
    },

    onMusicTap: function (event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.data.isPlayingMusic = false;
            this.setData({
                isPlayingMusic: false,
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.dataUrl,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImgUrl,
            })
            this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic: true,
            })
        }
    }
})