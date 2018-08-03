/**
 * @author vanCopper
 *
 */
namespace core{
    export class RenderContext {
        private backbuffer: ImageData;
        private workingCanvas: HTMLCanvasElement;
        private workingContext: CanvasRenderingContext2D;
        private workingWidth: number;
        private workingHeight:number;
        private backbufferdata:any;

        constructor(canvas:HTMLCanvasElement){
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
        }

        public clear():void
        {
            this.workingContext.clearRect(0,0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
        }

        public present():void
        {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        }

        public setPixel(x:number, y:number, color:utils.Color4):void
        {
            this.backbufferdata = this.backbuffer.data;
            let index:number = (x + y * this.workingWidth) * 4

            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        }

        public project(coord:utils.Vector3, transMat:utils.Matrix):utils.Vector2{
            let point:utils.Vector3 = utils.Vector3.TransformCoordinates(coord, transMat);
            let x:number = point.x * this.workingWidth + this.workingWidth/2.0;
            let y:number = -point.y * this.workingHeight + this.workingHeight/2.0;
            return new utils.Vector2(x,y);
        }

        public drawPoint(point:utils.Vector2):void{
            if(point.x >= 0 && point.y >=0
                && point.x < this.workingWidth
                && point.y < this.workingHeight){
                this.setPixel(point.x, point.y, new utils.Color4(1,1,0,1));
            }
        }

        public render(camera:Camera, meshes:Mesh[]):void{
            let viewMat = utils.Matrix.LookAtLH(camera.position, camera.target, utils.Vector3.Up());
            let projectionMat = utils.Matrix.PerspectiveFovLH(0.78, this.workingWidth/this.workingHeight,
                0.01, 1.0);

            for(let i:number = 0; i < meshes.length; i++){
                let rMesh = meshes[i];
                let worldMat = utils.Matrix.RotationYawPitchRoll(rMesh.rotation.y, rMesh.rotation.x, rMesh.rotation.z)
                    .multiply(utils.Matrix.Translation(rMesh.position.x, rMesh.position.y, rMesh.position.z));
                let transformMat = worldMat.multiply(viewMat).multiply(projectionMat);

                for( let indexVertices = 0; indexVertices < rMesh.vertices.length; indexVertices++){
                    let projectedPoint = this.project(rMesh.vertices[indexVertices], transformMat);
                    this.drawPoint(projectedPoint);
                }
            }

        }

    }
}