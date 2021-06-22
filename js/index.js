// section1 模块交互
(function () { // 形成一个独立的作用域，变量名不会受影响
    // 弹出视频
    var palyBtn = document.querySelector("#section1 .play"),
        dialog = document.querySelector(".dialog"),
        shadow = document.querySelector(".shadow"),
        closeBtn = document.querySelector(".dialog .closeBtn"),
        // 获取它，是为了解决移除弹出框关闭后视频仍然播放的问题
        movie = document.querySelector(".dialog .movie"),
        // 将movie的结构存储一份
        movieInner = movie.innerHTML;

    palyBtn.addEventListener("click", function () {
        // 简写
        dialog.style.display = shadow.style.display = "block";
        movie.innerHTML = movieInner;
    });
    closeBtn.addEventListener("click", function () {
        dialog.style.display = shadow.style.display = "none";
        movie.innerHTML = "";
    });
})();

// section2 选项卡
(function () {
    function tab(btn, content) {
        var btns = btn.children;
        var cons = content.children;
        for (var i = 0; i < btns.length; i++) {
            btns[i].index = i; // 按钮身上添加一个索引值，为了找到对应的内容
            btns[i].addEventListener("click", function () {
                for (var i = 0; i < btns.length; i++) {
                    btns[i].classList.remove("active");
                    cons[i].classList.remove("active");
                }
                this.classList.add("active");
                cons[this.index].classList.add("active");
            });
        }
    }
    var tabBtn = document.querySelectorAll(".tapBtn"); // 所有选项卡的标题(数组)
    var tabContent = document.querySelectorAll(".tabContent"); // 所有选项卡的内容(数组)

    for (var i = 0; i < tabBtn.length; i++) {
        tab(tabBtn[i], tabContent[i]);
    }
})();

// section3 轮播图
(function () {
    function carousel(id) {
        var wrap = document.querySelector(id + ' .wrap'), // 注意：因为是字符串拼接，后代选择器前面需含空格
            ul = document.querySelector(id + ' ul'),
            prev = document.querySelector(id + ' .prev'),
            next = document.querySelector(id + ' .next'),
            circles = document.querySelectorAll(id + ' .circle span'),
            boxWidth = wrap.offsetWidth; // 轮播图可视区域宽度

        ul.innerHTML += ul.innerHTML; // 复制一份图片
        var len = ul.children.length; // 所有图片的个数
        ul.style.width = len * boxWidth + "px"; // 复制一份图片后，更改ul的宽度

        var cn = 0, // 当前图片的索引
            ln = 0; // 上一个图片的索引

        next.addEventListener("click", function () {
            cn++;
            move();
        });
        prev.addEventListener("click", function () {
            if (cn == 0) {
                cn = len / 2;
                ul.style.transform = "translateX(" + -cn * boxWidth + "px)";
                ul.style.transition = ""; // 去掉过渡
            }
            // 条件里让transition为空，但是调用move后，会让transition不为空。这样等于没做。放到定时器里，move会在下一次事件循环里执行，也就是不同步
            setTimeout(function () {
                cn--;
                move();
            }, 13);

        });

        // 轮播图移动函数
        function move() {
            ul.style.transition = ".3s";
            // ul的移动左边的距离 = 当前索引 * 轮播图可视区域宽度（第一张为0，第二张为1...依次类推）
            ul.style.transform = "translateX(" + -cn * boxWidth + "px)";

            // 同步圆点：原始cn = 0、1、2、3、4、5、6、7 最终：0、1、2、3、0、1、2、3 (算法：cn%len/2)
            var hn = cn % (len / 2);
            circles[ln].className = ""; // 去掉上一个圆点的样式
            circles[hn].className = "active"; // 当前圆点的样式
            ln = hn; // 当前次的点击相对于下次点击，它是上一次
        }
        // 这个事件会在transition过渡完成后触发
        ul.addEventListener("transitionend", function () {
            if (cn == len / 2) { //假设总图片len为8，如果当前图片索引为4，其实也就是第5张图
                cn = 0;
                ul.style.transform = "translateX(" + -cn * boxWidth + "px)";
                ul.style.transition = ""; // 去掉过渡
            }
        });
    }
    carousel("#section3");
    carousel("#section5");
})();

// section4 选项卡
(function () {
    var section4 = document.querySelector("#section4"),
        lis = document.querySelectorAll("#section4 li"),
        bottom = document.querySelector("#section4 .bottom"),
        ln = 0;
    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i; // 按钮身上添加一个索引值，为了找到对应的内容
        lis[i].addEventListener("click", function () {
            // 方案1
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("active");
                section4.style.background = "url(images/section4_big_0" + (this.index + 1) + ".png)no-repeat center top";
                bottom.style.background = "url(images/section4_big_0" + (this.index + 1) + "_bottom.png)no-repeat center top";
            }
            this.classList.add("active");
            // 方案2(提高性能)
            // lis[ln].classList.remove('active');
            // this.classList.add("active");
            // ln = this.index;
        });
    }
})();

// section7 手风琴选项卡
(function () {
    var lis = document.querySelectorAll("#section7 ul li"),
        ln = 0;
    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i; // 按钮身上添加一个索引值，为了找到对应的内容
        lis[i].addEventListener("click", function () {
            // 方案1
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("active");
            }
            this.classList.add("active");
        });
    }
})();

// section8 旋转轮播图
(function () {
    var ul = document.querySelector("#section8 ul"),
        lis = ul.children,
        prev = document.querySelector("#section8 .prev"),
        next = prev.nextElementSibling,
        spans = document.querySelectorAll("#section8 .circle span"),
        cn = 0,
        ln = 0,
        len = lis.length;
    next.addEventListener("click", function () {
        cn++;
        ul.appendChild(lis[0]); // 思路：将ul中第1个元素剪切添加至末尾，无限循环
        if (cn == len) {
            cn = 0;
            spans[cn].className = "active";
        }
        spans[ln].className = "";
        spans[cn].className = "active";
        ln = cn;
    });
    prev.addEventListener("click", function () {
        cn--;
        ul.insertBefore(lis[len - 1], lis[0]);
        if (cn < 0) {
            cn = len - 1;
            spans[cn].className = "active";
        }
        spans[ln].className = "";
        spans[cn].className = "active";
        ln = cn;
    });
})();