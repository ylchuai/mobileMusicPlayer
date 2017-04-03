var html = document.getElementsByTagName('html')[0];
var winWidth = document.documentElement.clientWidth;
winWidth = winWidth > 768 ? 768 : winWidth;
html.style.fontSize = winWidth / 10 + "px";
html.style.height = '100%';
var getEle = function(id) {
    return document.getElementById(id);
};
var getAsCss = function(selector) {
    return document.querySelector(selector);
}

var musicList = [{
    music: 'music/0.mp3',
    pic: 'image/0.jpg',
    singer: '龙飞',
    name: '鸭梨大'
}, {
    music: 'music/1.mp3',
    pic: 'image/1.jpg',
    singer: '3LAU',
    name: 'Fire'
}, {
    music: 'music/2.mp3',
    pic: 'image/2.jpg',
    singer: 'Daniel',
    name: 'Free'
}, {
    music: 'music/3.mp3',
    pic: 'image/3.jpg',
    singer: 'Inez',
    name: 'Stronger'
}, {
    music: 'music/4.mp3',
    pic: 'image/4.jpg',
    singer: 'Katie',
    name: 'Monsters'
}, {
    music: 'music/5.mp3',
    pic: 'image/5.jpg',
    singer: 'KDrew',
    name: 'Yesterday'
}, {
    music: 'music/6.mp3',
    pic: 'image/6.jpg',
    singer: 'Noisestorm',
    name: 'Heist'
}, {
    music: 'music/7.mp3',
    pic: 'image/7.jpg',
    singer: 'Project',
    name: 'Forgettable'
}, {
    music: 'music/8.mp3',
    pic: 'image/8.jpg',
    singer: 'Various',
    name: 'LUBOV'
}, {
    music: 'music/9.mp3',
    pic: 'image/9.jpg',
    singer: 'ちぃむdmp☆',
    name: 'ろりこんでよかった～'
}];

function init() {
    // var music = getEle('music');
    var music,
        event,
        progress = getAsCss('.progress'),
        progressBar = getAsCss('.progress .bar'),
        progressBtn = getAsCss('.progress .btn'),
        control = getAsCss('section.control'),
        playNext = getEle('playNext'),
        playPrevious = getEle('playPrevious'),
        pic = getAsCss('.pic div img'),
        playBtn = getEle('play'),
        pauseBtn = getEle('pause'),
        time = getEle('time'),
        name = getAsCss('header .name'),
        singer = getAsCss('header .singer'),
        btn_left = progressBtn.offsetLeft,
        progress_left = progress.offsetLeft,
        totalLength = progress.offsetWidth,
        is_drag = false,
        is_getduration = false,
        is_playNow = false,
        is_init = false,
        // 解一个奇怪的bug，头痛，想了一个最简单的方法实现了
        is_first_click = true,
        src = getSrc('order'),
        eventInit = function() {
            return {
                music_duration: 0,
                rate_schedule: 0,
                music_event: {
                    mus_timeUD: function(e) {
                        if (is_drag) return;
                        if (!is_getduration) {
                            if (music.duration && music.duration > 1) {
                                event.music_duration = music.duration;
                                is_getduration = true;
                            } else {
                                return;
                            }
                        }
                        var currentTime = music.currentTime;
                        // console.log(currentTime / duration * 100 + '%');
                        event.rate_schedule = currentTime / event.music_duration;
                        var currentWidth = totalLength * event.rate_schedule + 'px';
                        progressBar.style.width = currentWidth;
                        progressBtn.style['margin-left'] = currentWidth;
                    },
                    mus_play: function(e) {
                        var playFlag,
                            errorFlag;
                        e = e || window.event;
                        playBtn.style.display = 'none';
                        pauseBtn.style.display = 'inline-block';
                        playFlag = setInterval(function() {
                            if (music.readyState == 4) {
                                music.play();
                                picRock.begin();
                                is_playNow = true;
                                clearInterval(playFlag);
                                clearTimeout(errorFlag);
                            }
                        }, 50)
                        errorFlag = setTimeout(function() {
                            clearInterval(playFlag);
                        }, 5000);
                    },
                    mus_pause: function(e) {
                        e = e || window.event;
                        pauseBtn.style.display = 'none';
                        playBtn.style.display = 'inline-block';
                        picRock.stop();
                        music.pause();
                        is_playNow = false;
                    },
                    mus_ended: function(e) {
                        e = e || window.event;
                        pauseBtn.style.display = 'none';
                        playBtn.style.display = 'inline-block';
                        picRock.stop();
                        event.music_event.mus_goToPlay(1, e);
                    },
                    mus_playNext: debounce(function(e) {
                        event.music_event.mus_goToPlay(1, e);
                        event.music_event.mus_play(e);
                    }, 1000, true),
                    mus_playPrevious: debounce(function(e) {
                        event.music_event.mus_goToPlay(-1, e);
                        event.music_event.mus_play(e);
                    }, 1000, true),
                    mus_goToPlay: function(desition, e) {
                        e = e || window.event;
                        event.music_event.mus_pause(e);
                        picRock.reset();
                        is_getduration = false;
                        var info = src(desition);
                        music.src = info.music;
                        name.innerHTML = info.name;
                        singer.innerHTML = info.singer;
                        pic.src = info.pic;
                        event.music_event.mus_play(e);
                    }
                },
                btn_event: {
                    btn_touchmove: function(e) {
                        e = e || window.event;
                        is_drag = true;
                        var left = e.touches[0].clientX - progress_left;
                        progressBtn.style['margin-left'] = left + 'px';
                        progressBar.style.width = left + 'px';
                    },
                    btn_touchend: function(e) {
                        e = e || window.event;
                        music.currentTime = (progressBtn.offsetLeft - btn_left) /
                            progress.offsetWidth * event.music_duration;
                        is_drag = false;
                        if (is_first_click) {
                            var left = progressBtn.offsetLeft;

                            function btnTouch() {
                                console.log(left - btn_left);
                                music.currentTime = (left - btn_left) /
                                    progress.offsetWidth * event.music_duration;
                                is_drag = false;
                            }
                            btnTouch();
                            setTimeout(function() {
                                btnTouch();
                                btnTouch = null;
                                is_first_click = false;
                            }, 0);
                        }
                    }
                },
                progress_event: {
                    progress_click: function(e) {
                        e = e || window.event;
                        var playTime = (e.x - progress_left) / progress.offsetWidth * event.music_duration;
                        playTime = parseInt(playTime / 5) * 5;
                        music.currentTime = playTime;

                        if (is_first_click) {
                            function proClick() {
                                console.log(e.x - progress_left);
                                var playTime = (e.x - progress_left) / progress.offsetWidth * event.music_duration;
                                playTime = parseInt(playTime / 5) * 5;
                                music.currentTime = playTime;
                            }
                            proClick();
                            setTimeout(function() {
                                proClick();
                                proClick = null;
                                is_first_click = false;
                            }, 0);
                        }
                    }
                },
                play_event: {
                    play: function(e) {
                        var playFlag,
                            errorFlag;
                        e = e || window.event;
                        playBtn.style.display = 'none';
                        pauseBtn.style.display = 'inline-block';
                        playFlag = setInterval(function() {
                            if (music.readyState == 4) {

                                picRock.begin();
                                music.play();
                                clearInterval(playFlag);
                                clearTimeout(errorFlag);
                            }
                        }, 50)
                        errorFlag = setTimeout(function() {
                            clearInterval(playFlag);
                        }, 5000);
                        // getEle('orgMusic').play();
                    }
                },
                pause_event: {
                    pause: function(e) {
                        e = e || window.event;
                        pauseBtn.style.display = 'none';
                        playBtn.style.display = 'inline-block';
                        picRock.stop();
                        music.pause();
                    }
                }
            }
        };
    pic.style.animationPlayState = 'paused';
    // 兼容移动端写法
    pic.style['-webkit-animation-play-state'] = 'paused';
    pic.style['animation-play-state'] = 'paused';
    var picRock = function() {
        var deg = 0;
        var timer;
        return {
            begin: function() {
                pic.style.animationPlayState = 'running';
                pic.style['-webkit-animation-play-state'] = 'running';
                pic.style['animation-play-state'] = 'running';
            },
            stop: function() {
                pic.style.animationPlayState = 'paused';
                pic.style['-webkit-animation-play-state'] = 'paused';
                pic.style['animation-play-state'] = 'paused';
            },
            reset: function() {}
        }
    }();

    function musicInit() {
        music = document.createElement('audio');
        var musicInfo = musicList[0];
        music.src = musicInfo.music;
        pic.src = musicInfo.pic;
        name.innerHTML = musicInfo.name;
        singer.innerHTML = musicInfo.singer;
        music.setAttribute('controls', 'controls'); //controls="controls"
        music.volume = 0.3;
        music.addEventListener('loadedmetadata', function() {
            if (is_init) return;
            is_init = true;
            setTimeout(function() {
                event = eventInit();

                playBtn.addEventListener('click', event.play_event.play);
                pauseBtn.addEventListener('click', event.pause_event.pause);
                music.addEventListener('timeupdate', event.music_event.mus_timeUD);
                music.addEventListener('ended', event.music_event.mus_ended);
                progressBtn.addEventListener('touchmove', event.btn_event.btn_touchmove);
                progressBtn.addEventListener('touchend', event.btn_event.btn_touchend);
                progress.addEventListener('click', event.progress_event.progress_click);
                playNext.addEventListener('click', event.music_event.mus_playNext);
                playPrevious.addEventListener('click', event.music_event.mus_playPrevious);

            }, 100);
        });
    }
    musicInit();

    function cssInit() {
        control.style['margin-top'] = (document.body.offsetHeight - control.offsetTop - control.offsetHeight - 20) + 'px';
    }
    cssInit();
}

function getSrc(rule) {
    var playList = [],
        index = 0;
    switch (rule) {
        case 'single':
            break;
        case 'random':
            break;
        case 'order':
        default:
            playList = musicList;
    }
    return function(desition) {
        if (desition == -1 && index != 0) {
            index -= 1;
        } else if (desition == -1 && index == 0) {
            index = playList.length - 1;
        } else if (index < playList.length - 1) {
            index += 1;
        } else if (index === playList.length - 1) {
            index = 0;
        }
        var src = playList[index];
        return src;
    }
}

function debounce(func, wait, immediate) {
    var timeout, later, that, args, timestamp
    timestamp = Date.now();
    later = function() {
        var last = Date.now() - timestamp;
        if (last >= 0 && last <= wait) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                func.apply(that, args);
                // 作用同下
                that = args = null;
            }
        }
    }
    return function() {
        that = this;
        args = arguments;
        if (immediate && !timeout) {
            func.apply(that, args);
        }
        if (!timeout) {
            // 这里可能会有定时器不准的问题，设定时间还未到就进行执行了，不能直接调用func
            // 如果调用时更新上下文，需要用到apply，外部定义的later无法取到上下文，
            // 应当缓存上下文
            timeout = setTimeout(later, wait);
            // 释放掉缓存，避免泄露
            that = args = null;

        }
    }
}