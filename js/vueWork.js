let vm = new Vue({
    // 刚开始就需要数据请求
    created() { //生命周期,在创建的时候请求数据
        myaxios.get("search", {
            params: { //需要传入的数据
                keywords: "摇滚"
            },
        }).then((res) => { //异步程序回调返回请求的数据
            console.log(res);
            // let { data } = res
            this.songs = res.result.songs //处理获取的数据
        })
    },
    el: '#app',
    data: {
        keywords: "摇滚", //初始化输入框的关键字
        songs: [], //初始化好左边歌曲列表页情况，用数组形式
        faceImgUrl: "./img/cover.jpg", //初始化播放时歌曲封面图片地址
        musicUrl: "", //初始化歌曲播放的地址
        isMusicPause: true, //初始化歌曲播放的监听器，来对接内容中间的动画是否播放
        pinNews: [], //初始化评论内容，用数组存储
        isMvPlaying: false, //初始化根据Mv是否播放判断页面是否隐藏的
        mvUrl: " " //初始化mv播放的地址
    },
    methods: {
        // 点击了播放MV的按钮
        openMv: function(id) {
            // 播放mv要保证音乐是关闭的pause()
            this.$refs.audioDom.pause();
            this.isMvPlaying = true //true表示播放mv
            myaxios.get("mv/url", {
                params: {
                    id: id
                }
            }).then((res) => { //处理收到的mv数据
                console.log(res);
                this.mvUrl = res.data.url



            })
        },
        // 点击了关闭mv的按钮
        closeMv: function() {
            this.isMvPlaying = false //false表示没有播放mv
                // 点击关闭按钮要保证mv是关闭的pause()
            this.$refs.videoDom.pause();
        },
        handleSearchMusic: function() { //进行的是搜索歌曲，有左边歌曲列表是实时响应
            if (!this.keywords) { //当输入框为空，直接退出
                return false;
            }
            // 输入不为空时：
            myaxios.get("search", {
                params: {
                    keywords: this.keywords //就是使上传的关键字就是文本框输入的关键字

                }
            }).then((res) => { //异步程序回调返回请求的数据
                // console.log(res);
                // let { data } = res
                this.songs = res.result.songs //处理获取的数据
            })
        },
        musicPlay: function(id) { //传入了点击的莫一首歌曲的id
            myaxios.get("song/detail", { //做歌曲图片详情的数据请求
                params: {
                    ids: id
                }
            }).then((res) => {
                console.log(res);
                this.faceImgUrl = res.songs[0].al.picUrl;
                this.isMusicPause = false;
                myaxios.get("song/url", { //做歌曲播放的详情请求
                    params: {
                        id: id
                    }
                }).then((res) => { //做歌曲播放的数据处理
                    console.log(res);
                    this.musicUrl = res.data[0].url;

                });
                myaxios.get("comment/hot?type=0", { //获取到评论的数据
                    params: { id: id }
                }).then((res) => { //将评论的数据进行处理
                    console.log(res);
                    this.pinNews = res.hotComments
                })
            });

        },
        // 当歌曲点了停止后，动画要停止播放
        songPause: function() {
            this.isMusicPause = true; //就将这个监听器状态调为true导致动画的类名不被应用就没有动画
        },
        songPlaying: function() {
            this.isMusicPause = false; //就将这个监听器状态调为false导致动画的类名被应用就有动画
        },

    }
})