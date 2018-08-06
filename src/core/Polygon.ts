/**
 * @author vanCopper
 *
 */

namespace core{

    export class Polygon{
        private indexA:number;
        private indexB:number;
        private indexC:number;

        constructor(indexA:number, indexB:number, indexC:number){
            this.indexA = indexA;
            this.indexB = indexB;
            this.indexC = indexC;
        }
    }

}