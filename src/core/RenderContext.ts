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
        // 深度缓冲区
        private depthbuffer:number[];

        constructor(canvas:HTMLCanvasElement){
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
            this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
        }

        public clear():void
        {
            this.workingContext.clearRect(0,0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);

            // 清楚深度缓冲区，使用最大值填充
            for(let i = 0; i < this.depthbuffer.length; i++)
            {
                this.depthbuffer[i] = Number.MAX_VALUE;
            }
        }

        public present():void
        {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        }

        public setPixel(x:number, y:number, z:number, color:utils.Color4):void
        {
            this.backbufferdata = this.backbuffer.data;
            //缓冲区是一维数组，这里把坐标转换为一位数组的索引
            let depthIndex:number =((x>>0) + (y>>0) * this.workingWidth)
            let index:number = depthIndex * 4

            if(this.depthbuffer[depthIndex] < z){
                return;//深度测试不通过
            }

            this.depthbuffer[depthIndex] = z;
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        }

        // 将3d坐标转换为屏幕2d坐标
        // public project(coord:utils.Vector3, transMat:utils.Matrix):utils.Vector3{
        //     let point:utils.Vector3 = utils.Vector3.TransformCoordinates(coord, transMat);
        //     // 变换后原点在坐标系中心点
        //     // 将原点移动至左上角
        //     let x:number = point.x * this.workingWidth + this.workingWidth/2.0 >> 0;
        //     let y:number = -point.y * this.workingHeight + this.workingHeight/2.0 >> 0;
        //     return new utils.Vector3(x,y, point.z);
        // }

        public project(vertex:Vertex, transMat:utils.Matrix, worldMat:utils.Matrix):Vertex{
            let rVertex:Vertex;
            let point:utils.Vector3 = utils.Vector3.TransformCoordinates(vertex.coordinates, transMat);
            //在3D空间 转换坐标和法线
            let point3d:utils.Vector3 = utils.Vector3.TransformCoordinates(vertex.coordinates, worldMat);
            let normal3d:utils.Vector3 = utils.Vector3.TransformCoordinates(vertex.normal, worldMat);
            // 变换后原点在坐标系中心点
            // 将原点移动至左上角
            let x:number = point.x * this.workingWidth + this.workingWidth/2.0;
            let y:number = -point.y * this.workingHeight + this.workingHeight/2.0;
            rVertex = new Vertex(normal3d, new utils.Vector3(x,y,point.z), point3d);
            return rVertex;
        }

        public drawPoint(point:utils.Vector3, color:utils.Color4=new utils.Color4(1,1,0,1)):void{
            //在屏幕范围内的点才绘制
            if(point.x >= 0 && point.y >=0
                && point.x < this.workingWidth
                && point.y < this.workingHeight){
                this.setPixel(point.x, point.y, point.z, color);
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
                this.drawPoint(new utils.Vector3(i,y,1));
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
                this.drawPoint(new utils.Vector3(x0, y0, 1));

                if ((x0 == x1) && (y0 == y1)) break;
                var e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
            }
        }

        /**
         * 限制值在min<>max之间，默认0-1
         * @param {number} value
         * @param {number} min
         * @param {number} max
         * @returns {number}
         */
        public clamp(value:number, min:number = 0, max:number = 1):number{
            return Math.max(min, Math.min(value, max));
        }

        /**
         * 插值 取min到max之间指定gradient(占比%)值
         * @param {number} min
         * @param {number} max
         * @param {number} gradient
         * @returns {number}
         */
        public interpolate(min:number, max:number, gradient:number){
            return min + (max - min)*this.clamp(gradient);
        }

        /**
         * 计算光向量和法向量之间角度的余弦值
         * 0-1之间
         * @param {utils.Vector3} vertex
         * @param {utils.Vector3} normal
         * @param {utils.Vector3} lightPos
         * @returns {number}
         */
        public computeNDotL(vertex:utils.Vector3, normal:utils.Vector3, lightPos:utils.Vector3):number{
            let lightDir = lightPos.subtract(vertex);
            normal.normalize();
            lightDir.normalize();
            return Math.max(0, utils.Vector3.Dot(normal, lightDir));
        }

        /**
         * 在两点之间从左到右画线
         * papb->pcpd
         * pa,pb,pc,pd已排序
         * @param {number} y
         * @param {utils.Vector3} pa
         * @param {utils.Vector3} pb
         * @param {utils.Vector3} pc
         * @param {utils.Vector3} pd
         * @param {utils.Color4} color
         */
        // public processScanLine(y:number, pa:utils.Vector3, pb:utils.Vector3,
        //                        pc:utils.Vector3, pd:utils.Vector3, color:utils.Color4):void
        public processScanLine(slData:ScanLineData, va:Vertex, vb:Vertex,
                               vc:Vertex, vd:Vertex, color:utils.Color4):void
        {
            let pa:utils.Vector3 = va.coordinates;
            let pb:utils.Vector3 = vb.coordinates;
            let pc:utils.Vector3 = vc.coordinates;
            let pd:utils.Vector3 = vd.coordinates;
            // 由当前y值 计算出梯度
            // 再计算出 sx, ex
            // 如果 pa.y == pb.y 或者 pc.y = pd.y 梯度为 1
            let gradient1 = pa.y != pb.y ? (slData.currentY-pa.y)/(pb.y-pa.y) : 1;
            let gradient2 = pc.y != pd.y ? (slData.currentY-pc.y)/(pd.y - pc.y) : 1;

            let sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
            let ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;

            // 计算开始的z，结束的z
            let z1:number = this.interpolate(pa.z, pb.z, gradient1);
            let z2:number = this.interpolate(pc.z, pd.z, gradient2);
            for(let x = sx; x < ex; x++){

                var gradient:number = (x-sx)/(ex-sx);
                let z = this.interpolate(z1, z2, gradient);
                let ndotl = slData.ndotla;
                let eColor:utils.Color4 = new utils.Color4(color.r * ndotl, color.g * ndotl,
                                                            color.b * ndotl, 1);
                this.drawPoint(new utils.Vector3(x, slData.currentY, z), eColor);
            }
        }

        // public drawTriangle(dp1:utils.Vector3, dp2:utils.Vector3, dp3:utils.Vector3, color:utils.Color4):void{
        public drawTriangle(v1:Vertex, v2:Vertex, v3:Vertex, color:utils.Color4):void{

            // p1在最上面 p2在中间 p3在最下面
            if (v1.coordinates.y > v2.coordinates.y) {
                var temp = v2;
                v2 = v1;
                v1 = temp;
            }

            if (v2.coordinates.y > v3.coordinates.y) {
                var temp = v2;
                v2 = v3;
                v3 = temp;
            }

            if (v1.coordinates.y > v2.coordinates.y) {
                var temp = v2;
                v2 = v1;
                v1 = temp;
            }

            var p1 = v1.coordinates;
            var p2 = v2.coordinates;
            var p3 = v3.coordinates;

            // 求面的法向量 三个顶点法向量的平均值
            let vnFace = (v1.normal.add(v2.normal.add(v3.normal))).scale(1/3);
            // 面中心点
            let centerPos = (v1.worldCoordinates.add(v2.worldCoordinates.add(v3.worldCoordinates))).scale(1/3);
            // 光源位置
            let lightPos:utils.Vector3 = new utils.Vector3(0, 10, 10);
            let ndotl = this.computeNDotL(centerPos, vnFace, lightPos);

            let data:ScanLineData = new ScanLineData(null, ndotl, null, null, null);
            // 斜率
            let dP1P2:number;
            let dP1P3:number;
            if(p2.y - p1.y > 0){
                dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
            }else {
                dP1P2 = 0;
            }

            if (p3.y - p1.y > 0){
                dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
            }else
            {
                dP1P3 = 0;
            }

            // 第一种情况来说，三角形是这样的：
            // P1
            // -
            // --
            // - -
            // -  -
            // -   - P2
            // -  -
            // - -
            // -
            // P3
            if (dP1P2 > dP1P3) {
                for (let y = p1.y >> 0; y <= p3.y >> 0; y++)
                {
                    data.currentY = y;
                    if (y < p2.y) {
                        this.processScanLine(data, v1, v3, v1, v2, color);
                    }
                    else {
                        this.processScanLine(data, v1, v3, v2, v3, color);
                    }
                }
            }
            // 第二种情况来说，三角形是这样的：
            //       P1
            //        -
            //       --
            //      - -
            //     -  -
            // P2 -   -
            //     -  -
            //      - -
            //        -
            //       P3
            else {
                for (let y = p1.y >> 0; y <= p3.y >> 0; y++)
                {
                    data.currentY = y;
                    if (y < p2.y) {
                        this.processScanLine(data, v1, v2, v1, v3, color);
                    }
                    else {
                        this.processScanLine(data, v2, v3, v1, v3, color);
                    }
                }
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
                   let vertexA:core.Vertex = rMesh.vertices[currentPolygon.indexA];
                   let vertexB:core.Vertex = rMesh.vertices[currentPolygon.indexB];
                   let vertexC:core.Vertex = rMesh.vertices[currentPolygon.indexC];

                   let pA:core.Vertex = this.project(vertexA, transformMat, worldMat);
                   let pB:core.Vertex = this.project(vertexB, transformMat, worldMat);
                   let pC:core.Vertex = this.project(vertexC, transformMat, worldMat);

                   // let color:number = 0.5 + ((p_index % rMesh.polygons.length) / rMesh.polygons.length) * 0.75;
                   let color:number = 1.0;
                   this.drawTriangle(pA, pB, pC, new utils.Color4(color, color, color, 1));
                   // this.drawLine(pA, pB);
                   // this.drawLine(pB, pC);
                   // this.drawLine(pC, pA);
               }

            }

        }
    }

    class ScanLineData{
        public currentY:any;
        public ndotla:any;
        public ndotlb:any;
        public ndotlc:any;
        public ndotld:any;

        constructor(currentY:any, ndotla:any, ndotlb:any, ndotlc:any, ndotld:any){
            this.currentY = currentY;
            this.ndotla = ndotla;
            this.ndotlb = ndotlb;
            this.ndotlc = ndotlc;
            this.ndotld = ndotld;
        }
    }
}