/**
 * @author vanCopper
 *
 */
namespace core{

    export class Camera{
        public position:utils.Vector3;
        public target:utils.Vector3;

        constructor(){

            this.position = utils.Vector3.Zero();
            this.target = utils.Vector3.Zero();

        }
    }

}