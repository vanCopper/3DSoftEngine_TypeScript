/**
 * @author vanCopper
 *
 */

namespace core{

    export class Polygon{
        public indexA:number;
        public indexB:number;
        public indexC:number;
        public normal:utils.Vector3;

        constructor(indexA:number, indexB:number, indexC:number){
            this.indexA = indexA;
            this.indexB = indexB;
            this.indexC = indexC;
        }
    }

}