/**
 * @author vanCopper
 *
 */
namespace core{

    export class Line extends Mesh{

        constructor(name:string, p0:utils.Vector3, p1:utils.Vector3){
            super(name,2,0);
            this.rotation = utils.Vector3.Zero();
            this.position = utils.Vector3.Zero();
            this.vertices = new Array(2);
            this.vertices[0] = p0;
            this.vertices[1] = p1;
        }
    }

}