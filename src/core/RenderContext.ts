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
            //缓冲区是一维数组，这里把坐标转换为一位数组的索引
            let index:number = ((x>>0) + (y>>0) * this.workingWidth) * 4

            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        }

        // 将3d坐标转换为屏幕2d坐标
        public project(coord:utils.Vector3, transMat:utils.Matrix):utils.Vector2{
            let point:utils.Vector3 = utils.Vector3.TransformCoordinates(coord, transMat);
            // 变换后原点在坐标系中心点
            // 将原点移动至左上角
            let x:number = point.x * this.workingWidth + this.workingWidth/2.0 >> 0;
            let y:number = -point.y * this.workingHeight + this.workingHeight/2.0 >> 0;
            return new utils.Vector2(x,y);
        }

        public drawPoint(point:utils.Vector2):void{
            //在屏幕范围内的点才绘制
            if(point.x >= 0 && point.y >=0
                && point.x < this.workingWidth
                && point.y < this.workingHeight){
                this.setPixel(point.x, point.y, new utils.Color4(1,1,0,1));
            }
        }

        /**
         * 数值微分DDA(Digital Differential Analyzer)算法
         * 只实现了沿x轴递增，斜率过大需要沿y轴递增
         * @param {utils.Vector2} p0
         * @param {utils.Vector2} p1
         */
        public drawLine_DDA(p0:utils.Vector2, p1:utils.Vector2):void{
            let x0 = p0.x >> 0;
            let y0 = p0.y >> 0;
            let x1 = p1.x >> 0;
            let y1 = p1.y >> 0;

            let k = (y1 - y0)*1.0/(x1 - x0);
            let y = y0;
            for(let i = x0; i <= x1; ++ i){
                this.drawPoint(new utils.Vector2(i,y));
                y += k;
            }
        }

        /**
         * Bresenham 算法绘制
         * @param {utils.Vector2} point0
         * @param {utils.Vector2} point1
         */
        public drawLine(point0: utils.Vector2, point1: utils.Vector2): void {
            var x0 = point0.x >> 0;
            var y0 = point0.y >> 0;
            var x1 = point1.x >> 0;
            var y1 = point1.y >> 0;
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;

            while (true) {
                this.drawPoint(new utils.Vector2(x0, y0));

                if ((x0 == x1) && (y0 == y1)) break;
                var e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
            }
        }

        public render(camera:Camera, meshes:Mesh[]):void{
            // 观察矩阵
            let viewMat = utils.Matrix.LookAtLH(camera.position, camera.target, utils.Vector3.Up());
            // 投影矩阵
            let projectionMat = utils.Matrix.PerspectiveFovLH(0.78, this.workingWidth/this.workingHeight,
                0.01, 1.0);

            for(let i:number = 0; i < meshes.length; i++){
                let rMesh = meshes[i];
                // 先旋转再平移 得到模型矩阵
                let worldMat = utils.Matrix.RotationYawPitchRoll(rMesh.rotation.y, rMesh.rotation.x, rMesh.rotation.z)
                    .multiply(utils.Matrix.Translation(rMesh.position.x, rMesh.position.y, rMesh.position.z));
                let transformMat = worldMat.multiply(viewMat).multiply(projectionMat);

               for(let p_index = 0; p_index < rMesh.polygons.length; p_index++){
                   let currentPolygon:core.Polygon = rMesh.polygons[p_index];
                   let vertexA:utils.Vector3 = rMesh.vertices[currentPolygon.indexA];
                   let vertexB:utils.Vector3 = rMesh.vertices[currentPolygon.indexB];
                   let vertexC:utils.Vector3 = rMesh.vertices[currentPolygon.indexC];

                   let pA:utils.Vector2 = this.project(vertexA, transformMat);
                   let pB:utils.Vector2 = this.project(vertexB, transformMat);
                   let pC:utils.Vector2 = this.project(vertexC, transformMat);

                   this.drawLine(pA, pB);
                   this.drawLine(pB, pC);
                   this.drawLine(pC, pA);
               }

            }

        }
    }
}