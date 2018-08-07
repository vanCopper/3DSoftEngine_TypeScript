/**
 * @author vanCopper
 *
 */
namespace core{

    export class Texture{
        private width:number;
        private height:number;
        private imageBuffer:ImageData;

        constructor(filename:string, width:number, height:number){
            this.width = width;
            this.height = height;
            this.load(filename);
        }

        public load(filename:string):void{
            let imageTexture = new Image();
            imageTexture.height = this.height;
            imageTexture.width = this.width;
            imageTexture.onload = ()=>{
                let tempCanvas:HTMLCanvasElement = document.createElement("canvas");
                tempCanvas.width = this.width;
                tempCanvas.height = this.height;
                let tempContext:CanvasRenderingContext2D = tempCanvas.getContext("2d");
                tempContext.drawImage(imageTexture, 0, 0);
                this.imageBuffer = tempContext.getImageData(0,0, this.width, this.height);
            }
            imageTexture.src = filename;
        }

        public map(tu:number, tv:number):utils.Color4{
            if(this.imageBuffer){
                //重复采样
                var u = Math.abs(((tu * this.width) % this.width)) >> 0;
                var v = Math.abs(((tv * this.height) % this.height)) >> 0;
                let pos = (u + v * this.width)*4;
                let r = this.imageBuffer.data[pos];
                let g = this.imageBuffer.data[pos+1];
                let b = this.imageBuffer.data[pos+2];
                let a = this.imageBuffer.data[pos+3];
                return new utils.Color4(r/255.0, g/255.0, b/255.0, a/255.0);
            }else
            {
                return new utils.Color4(1, 1, 1, 1);
            }
        }
    }

}