/**
 * @author vanCopper
 *
 */

let canvas: HTMLCanvasElement;
let renderContext: core.RenderContext;
let mesh: core.Mesh;
let meshes: core.Mesh[] = [];
let camera: core.Camera;

document.addEventListener("DOMContentLoaded", init, false);

function init(){
    console.log("init...")
    canvas = <HTMLCanvasElement> document.getElementById("frontBuffer");
    mesh = new core.Mesh("Cube", 8);
    meshes.push(mesh);
    camera = new core.Camera();
    renderContext = new core.RenderContext(canvas);

    mesh.vertices[0] = new utils.Vector3(-1, 1, 1);
    mesh.vertices[1] = new utils.Vector3(1, 1, 1);
    mesh.vertices[2] = new utils.Vector3(-1, -1, 1);
    mesh.vertices[3] = new utils.Vector3(-1, -1, -1);
    mesh.vertices[4] = new utils.Vector3(-1, 1, -1);
    mesh.vertices[5] = new utils.Vector3(1, 1, -1);
    mesh.vertices[6] = new utils.Vector3(1, -1, 1);
    mesh.vertices[7] = new utils.Vector3(1, -1, -1);

    camera.position = new utils.Vector3(0, 0, 10);
    camera.target = new utils.Vector3(0, 0, 0);

    // Calling the HTML5 rendering loop
    requestAnimationFrame(loop);
}

function loop() {
    renderContext.clear();

    mesh.rotation.x += 0.05
    mesh.rotation.y += 0.05;

    renderContext.render(camera, meshes);
    renderContext.present();
    requestAnimationFrame(loop);
}
