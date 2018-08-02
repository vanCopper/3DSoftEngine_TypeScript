function init():void
{
    var  h5_stage:HTMLCanvasElement = document.getElementById('h5_stage') as HTMLCanvasElement;


    var ctx:CanvasRenderingContext2D = h5_stage.getContext('2d');
    ctx.fillStyle = '0x333333';
    ctx.fillRect(0,0, 640, 480);

    var h5_3d_stage:HTMLCanvasElement = document.getElementById('h5_3d_stage') as HTMLCanvasElement;
    var ctx_3d:WebGLRenderingContext = h5_3d_stage.getContext('webgl')
    ctx_3d.clearColor(1, 1,1, 1)
    ctx_3d.flush();
    console.log('Hello TypeScript')

}
