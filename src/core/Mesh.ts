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
        public texture:core.Texture;
        public name:string;

        constructor(name:string, verticesCount:number, polygonCount:number, texture?:core.Texture){

            this.vertices = new Array(verticesCount);
            this.polygons = new Array(polygonCount);
            this.rotation = utils.Vector3.Zero();
            this.position = utils.Vector3.Zero();
            this.name = name;
            this.texture = texture;
        }

        public computeFacesNormals(): void {
            for (var index = 0; index < this.polygons.length; index++) {
                let currentPolygons = this.polygons[index];

                var vertexA = this.vertices[currentPolygons.indexA];
                var vertexB = this.vertices[currentPolygons.indexB];
                var vertexC = this.vertices[currentPolygons.indexC];

                this.polygons[index].normal = (vertexA.normal.add(vertexB.normal.add(vertexC.normal))).scale(1 / 3);
                this.polygons[index].normal.normalize();
            }
        }

    }

}