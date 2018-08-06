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

    // test_cube();
    test_monkey();

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

    if( meshes && meshes.length > 0)
    {
        for(let i = 0; i < meshes.length; i++){
            // meshes[i].rotation.x += 0.02
            meshes[i].rotation.y += 0.02;
        }
    }


    renderContext.render(camera, meshes);
    renderContext.present();
    requestAnimationFrame(loop);
}


function test_cube(){
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
}

function test_line(){
    // 线段
    mesh = new core.Line('line', new utils.Vector3(2,1,1)
        , new utils.Vector3(0,0,1))
    meshes.push(mesh);
}

function test_monkey(){
    loadJsonFile("./resource/monkey.json", (l_meshes:core.Mesh[])=>{
        meshes = l_meshes;
    })
}

function loadJsonFile(fileName:string, callback:(result:core.Mesh[])=>any):void
{
    let jsonObj = {};
    let xmlHttp:XMLHttpRequest = new XMLHttpRequest();
    xmlHttp.open('GET', fileName, true);
    let _this = this;
    xmlHttp.onreadystatechange = function () {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            jsonObj = JSON.parse(xmlHttp.responseText);
            callback(_this.createMeshes(jsonObj))
        }

    }

    xmlHttp.send(null);
}

function createMeshes(jsonObj:any):core.Mesh[]{
    let meshes:core.Mesh[]=[];
    for(let meshIndex = 0; meshIndex < jsonObj.meshes.length; meshIndex++){
        // 顶点
        let verticesArr:number[] = jsonObj.meshes[meshIndex].vertices;
        // 面
        let polygonsArr:number[] = jsonObj.meshes[meshIndex].indices;
        //UV
        let uvCount:number = jsonObj.meshes[meshIndex].uvCount;
        let verticesStep = 1;

        // uv数量确定 步进数
        switch(uvCount){
            case 0:
                verticesStep = 6;
                break;
            case 1:
                verticesStep = 8;
                break;
            case 2:
                verticesStep = 10;
                break;
        }

        let verticesCount = verticesArr.length/verticesStep;
        let polygonCount = polygonsArr.length/3;
        let mesh:core.Mesh = new core.Mesh(jsonObj.meshes[meshIndex].name, verticesCount, polygonCount);
        //填充顶点
        for (let index = 0; index < verticesCount; index++){
            let x = verticesArr[index * verticesStep];
            let y = verticesArr[index * verticesStep + 1];
            let z = verticesArr[index * verticesStep + 2];
            mesh.vertices[index] = new utils.Vector3(x, y, z);
        }

        //填充面信息

        for(let index:number = 0; index < polygonCount; index++){
            let a = polygonsArr[index*3];
            let b = polygonsArr[index*3 + 1];
            let c = polygonsArr[index*3 + 2];
            mesh.polygons[index] = new core.Polygon(a, b, c);

        }

        let position = jsonObj.meshes[meshIndex].position;
        mesh.position = new utils.Vector3(position[0], position[1], position[2]);
        meshes.push(mesh);
    }

    return meshes;
}