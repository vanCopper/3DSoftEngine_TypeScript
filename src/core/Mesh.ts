/**
 * @author vanCopper
 *
 */
namespace core{

    export class Mesh{

        public position:utils.Vector3;
        public rotation:utils.Vector3;
        public vertices:Vertex[];
        public polygons:core.Polygon[];
        public name:string;

        constructor(name:string, verticesCount:number, polygonCount:number){

            this.vertices = new Array(verticesCount);
            this.polygons = new Array(polygonCount);
            this.rotation = utils.Vector3.Zero();
            this.position = utils.Vector3.Zero();
            this.name = name;
        }

    }

}