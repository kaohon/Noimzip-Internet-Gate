var search_c = document.getElementById('search-contents');
var memo_c = document.getElementById('memo-contents');
var audio_c = document.getElementById('audio-contents');
var profile_c = document.getElementById('profile-contents');

var search_t = document.getElementById('search-tab');
var memo_t = document.getElementById('memo-tab');
var audio_t = document.getElementById('audio-tab');
var profile_t = document.getElementById('profile-tab');

search_t.addEventListener("click", function () {
    search_c.style.display = "block";
    memo_c.style.display = "none";
    audio_c.style.display = "none";
    profile_c.style.display = "none";
  });

memo_t.addEventListener("click", function () {
    search_c.style.display = "none";
    memo_c.style.display = "block";
    audio_c.style.display = "none";
    profile_c.style.display = "none";
  });

audio_t.addEventListener("click", function () {
    search_c.style.display = "none";
    memo_c.style.display = "none";
    audio_c.style.display = "block";
    profile_c.style.display = "none";
  });

profile_t.addEventListener("click", function () {
    search_c.style.display = "none";
    memo_c.style.display = "none";
    audio_c.style.display = "none";
    profile_c.style.display = "block";
  });

var c = document.getElementById("c");
		c.height = window.innerHeight;
		c.width = window.innerWidth;

		var drop_size = 12;
		var columns = c.width/drop_size;

		var chinese = "10";
		chinese = chinese.split("");

		var drops = [];
		for(var i = 0; i < columns; i++)
			drops[i] = 1; //y coordinate - same for everyone at the starting. The index contains the x coordinate

		ctx = c.getContext('2d');

		function draw()
		{
			ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
			ctx.fillRect(0, 0, c.width, c.height);

			ctx.fillStyle = "#00ffff";
			ctx.font= drop_size + "px arial";
			for(var i = 0; i < drops.length; i++)
			{
				text = chinese[Math.floor(Math.random()*chinese.length)];
				ctx.fillText(text, i*drop_size, drops[i]*drop_size);

				if(drops[i]*drop_size > c.height && Math.random() > 0.975)
					drops[i] = 0;

				drops[i]++;
			}

		}

		setInterval(draw, 33);

document.addEventListener("DOMContentLoaded", function () {
    // キャンバス要素とコンテキストを取得
    var canvas = document.getElementById("paintCanvas");
    var context = canvas.getContext("2d");

    // ペイントフラグ
    var painting = false;

    // 描画スタイルの初期設定
    context.lineWidth = 5;
    context.lineCap = "round";
    context.strokeStyle = "#000";

    // 描画開始時のイベントリスナー
    canvas.addEventListener("mousedown", function (event) {
        painting = true;
        startPosition(event);
    });

    // 描画中のイベントリスナー
    canvas.addEventListener("mousemove", function (event) {
        if (painting) {
            draw(event);
        }
    });

    // 描画終了時のイベントリスナー
    canvas.addEventListener("mouseup", function () {
        painting = false;
    });

    // カーソルがキャンバス外に移動したときのイベントリスナー
    canvas.addEventListener("mouseleave", function () {
        painting = false;
    });

    // 描画開始時の位置を設定する関数
    function startPosition(event) {
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    // 描画を行う関数
    function draw(event) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
    }

    // キャンバスの内容をクリアするボタンのイベントリスナー
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 数字と演算子のボタンを取得
    var buttons = document.querySelectorAll("input[type='button']");
    var display = document.getElementById("display");

    // ボタンがクリックされた時のイベントリスナーを追加
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            if (button.value === "=") {
                // = ボタンが押されたら計算を行う
                try {
                    display.value = eval(display.value);
                } catch (error) {
                    display.value = "Error";
                }
            } else if (button.value === "C") {
                // C ボタンが押されたら表示をクリアする
                display.value = "";
            } else {
                // それ以外のボタンが押されたら表示に追加する
                display.value += button.value;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var audioPlayer = document.getElementById("audioPlayer");
    var playButton = document.getElementById("playButton");
    var pauseButton = document.getElementById("pauseButton");
    var nextButton = document.getElementById("nextButton");
    var prevButton = document.getElementById("prevButton");
    var trackInfo = document.getElementById("trackInfo");
    var fileInput = document.getElementById("fileInput");
    var canvas = document.getElementById("c");
    var ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    var audioContext, analyser, dataArray, bufferLength;
    var tracks = [];
    var currentTrackIndex = 0;

    function loadTrack(index) {
        if (tracks.length > 0) {
            var fileURL = URL.createObjectURL(tracks[index]);
            audioPlayer.src = fileURL;
            trackInfo.textContent = tracks[index].name;
            setupVisualizer();
        } else {
            audioPlayer.src = "";
            trackInfo.textContent = "No track selected";
        }
    }

    fileInput.addEventListener("change", function () {
        tracks = Array.from(fileInput.files);
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
    });

    playButton.addEventListener("click", function () {
        if (tracks.length > 0) {
            audioPlayer.play();
        }
    });

    pauseButton.addEventListener("click", function () {
        audioPlayer.pause();
    });

    nextButton.addEventListener("click", function () {
        if (tracks.length > 0) {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            audioPlayer.play();
        }
    });

    prevButton.addEventListener("click", function () {
        if (tracks.length > 0) {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrackIndex);
            audioPlayer.play();
        }
    });

    function setupVisualizer() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            var source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            drawVisualizer();
        }
    }

    function drawVisualizer() {
        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 1;
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();

            var sliceWidth = canvas.width / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {
                var v = dataArray[i] / 128.0;
                var y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
        draw();
    }

    loadTrack(currentTrackIndex);
});
