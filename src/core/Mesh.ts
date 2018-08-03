/**
 * @author vanCopper
 *
 */
namespace core{

    export class Mesh{

        public position:utils.Vector3;
        public rotation:utils.Vector3;
        public vertices:utils.Vector3[];
        public name:string;

        constructor(name:string, verticesCount:number){
            this.vertices = new Array(verticesCount);
            this.rotation = utils.Vector3.Zero();
            this.position = utils.Vector3.Zero();
            this.name = name;
        }

    }

}