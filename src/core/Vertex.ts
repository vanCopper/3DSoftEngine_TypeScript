/**
 * @author vanCopper
 *
 */
namespace core{
    export class Vertex{
        public normal:utils.Vector3;
        public coordinates:utils.Vector3;
        public worldCoordinates:utils.Vector3;
        public textureCoordinates:utils.Vector2;

        constructor(normal:utils.Vector3, coordinates:utils.Vector3, worldCoordinates:utils.Vector3, textureCoordinates?:utils.Vector2){
            this.normal = normal;
            this.coordinates = coordinates;
            this.worldCoordinates = worldCoordinates;
            this.textureCoordinates = textureCoordinates;
        }
    }
}