/**
 * @author vanCopper
 *
 */

let canvas: HTMLCanvasElement;
let renderContext: core.RenderContext;
let mesh: core.Line;
let meshes: core.Mesh[] = [];
let camera: core.Camera;

document.addEventListener("DOMContentLoaded", init, false);

function init(){
    console.log("init...")
    canvas = <HTMLCanvasElement> document.getElementById("frontBuffer");
    camera = new core.Camera();
    renderContext = new core.RenderContext(canvas);

    // 立方体
    mesh = new core.Mesh("Cube", 8, 12);
    meshes.push(mesh);
    //顶点
    mesh.vertices[0] = new utils.Vector3(-1, 1, 1);
    mesh.vertices[1] = new utils.Vector3(1, 1, 1);
    mesh.vertices[2] = new utils.Vector3(-1, -1, 1);
    mesh.vertices[3] = new utils.Vector3(1, -1, 1);
    mesh.vertices[4] = new utils.Vector3(-1, 1, -1);
    mesh.vertices[5] = new utils.Vector3(1, 1, -1);
    mesh.vertices[6] = new utils.Vector3(1, -1, -1);
    mesh.vertices[7] = new utils.Vector3(-1, -1, -1);
    // 面
    mesh.polygons[0] = new core.Polygon(0, 1, 2);
    mesh.polygons[1] = new core.Polygon(1, 2, 3);
    mesh.polygons[2] = new core.Polygon(1, 3, 6);
    mesh.polygons[3] = new core.Polygon(1, 5, 6);
    mesh.polygons[4] = new core.Polygon( 0, 1, 4);
    mesh.polygons[5] = new core.Polygon( 1, 4, 5);

    mesh.polygons[6] = new core.Polygon( 2, 3, 7);
    mesh.polygons[7] = new core.Polygon( 3, 6, 7);
    mesh.polygons[8] = new core.Polygon( 0, 2, 7);
    mesh.polygons[9] = new core.Polygon( 0, 4, 7);
    mesh.polygons[10] = new core.Polygon( 4, 5, 6);
    mesh.polygons[11] = new core.Polygon( 4, 6, 7);

    // 线段
    // mesh = new core.Line('line', new utils.Vector3(2,1,1)
    //     , new utils.Vector3(0,0,1))
    // meshes.push(mesh);
    camera.position = new utils.Vector3(0, 0, 10);
    camera.target = new utils.Vector3(0, 0, 0);

    // 按帧执行重绘 如浏览器不支持该API 可使用setTimeout
    /**
     window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
     */
    requestAnimationFrame(loop);
}

function loop() {
    renderContext.clear();

    mesh.rotation.x += 0.02
    mesh.rotation.y += 0.02;

    renderContext.render(camera, meshes);
    renderContext.present();
    requestAnimationFrame(loop);
}
