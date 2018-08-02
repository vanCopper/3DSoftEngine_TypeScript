/**
 * @author vanCopper
 *
 */
namespace core{
    export class Mesh{
        public position:utils.Vector3;
        public rotation:utils.Vector3;
        public name:string;
        private vertices:utils.Vector3[];

        constructor(name:string, verticesCount:number){
            this.position = utils.Vector3.Zero();
            this.rotation = utils.Vector3.Zero();
            this.vertices = new Array(verticesCount);
            this.name = name;
        }
    }
}