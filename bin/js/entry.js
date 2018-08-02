function init() {
    var h5_stage = document.getElementById('h5_stage');
    var ctx = h5_stage.getContext('2d');
    ctx.fillStyle = '0x333333';
    ctx.fillRect(0, 0, 640, 480);
    var h5_3d_stage = document.getElementById('h5_3d_stage');
    var ctx_3d = h5_3d_stage.getContext('webgl');
    ctx_3d.clearColor(1, 1, 1, 1);
    ctx_3d.flush();
    console.log('Hello TypeScript');
}
//# sourceMappingURL=entry.js.map